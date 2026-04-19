"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type InviteResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Helper: build a service-role Supabase client (server-only, never exposed
// to the browser — SUPABASE_SERVICE_ROLE_KEY is not prefixed with NEXT_PUBLIC_).
// ---------------------------------------------------------------------------
function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  return createAdminClient(url, key, {
    auth: {
      // Disable auto-refresh — we're running server-side, no sessions needed.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ---------------------------------------------------------------------------
// Server Action: inviteTeamMember
// ---------------------------------------------------------------------------
/**
 * Sends a Supabase auth invite email to the provided address.
 *
 * Security guarantees:
 *  1. Caller must be an authenticated user — verified server-side via the
 *     cookie-backed session (not trusting any client-supplied claims).
 *  2. Caller's profile row must have role = 'admin' — checked against the DB.
 *  3. The Supabase Admin client uses the service-role key, which:
 *       a) Is a server-only env var (no NEXT_PUBLIC_ prefix).
 *       b) Is never imported or referenced in any client component.
 *       c) Bypasses RLS, so it can write the invite regardless of policies.
 *  4. The `role` and `full_name` values are embedded in user_metadata by the
 *     SERVER (not the browser). The DB trigger reads and validates these
 *     values and only promotes to 'admin'/'supervisor' when present — a
 *     self-signing user cannot replicate this because they don't have the key.
 */
export async function inviteTeamMember(
  formData: FormData
): Promise<InviteResult> {
  // ── 1. Authenticate the caller ──────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "403: Not authenticated." };
  }

  // ── 2. Authorise: only admins may invite ────────────────────────────────
  const { data: callerProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || callerProfile?.role !== "admin") {
    return {
      success: false,
      error: "403: You do not have permission to invite team members.",
    };
  }

  // ── 3. Validate & sanitise form data ────────────────────────────────────
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const fullName = (formData.get("full_name") as string | null)?.trim();
  const role = (formData.get("role") as string | null)?.trim();

  if (!email || !fullName || !role) {
    return { success: false, error: "Email, full name, and role are required." };
  }

  if (!["admin", "supervisor"].includes(role)) {
    return {
      success: false,
      error: "Invalid role. Only 'admin' and 'supervisor' are allowed.",
    };
  }

  // ── 4. Send invite via the service-role Admin client ────────────────────
  const adminClient = createServiceClient();

  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      data: {
        // Embedded server-side. The DB trigger in schema.sql reads these and
        // only promotes if role is 'admin'|'supervisor'.
        role,
        full_name: fullName,
      },
    }
  );

  if (inviteError) {
    return { success: false, error: inviteError.message };
  }

  // ── 5. Revalidate the team page so the server component re-fetches ───────
  revalidatePath("/admin/team");

  return {
    success: true,
    message: `Invite sent to ${email} with role "${role}".`,
  };
}

// ---------------------------------------------------------------------------
// Server Action: fetchTeamMembers  (called from the Server Component directly)
// ---------------------------------------------------------------------------
export async function fetchTeamMembers() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { members: [], error: "Not authenticated." };

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return { members: [], error: "403: Admin access required." };
  }

  // Fetch admin + supervisor profiles (not all clients)
  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .in("role", ["admin", "supervisor"])
    .order("created_at", { ascending: false });

  if (error) return { members: [], error: error.message };

  return { members: members ?? [], error: null };
}
