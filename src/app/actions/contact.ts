"use server";

import { createClient } from "@/utils/supabase/server";

export type ContactFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
};

const CHAR_LIMIT = 500;

/**
 * submitContactForm — Server Action
 *
 * Validates the landing page contact form and INSERTs into the
 * public.contact_messages table in Supabase. The table has an anon INSERT
 * policy so unauthenticated visitors can submit freely.
 *
 * Called by the ContactSection via useActionState() in the "use client"
 * LandingPageClient component.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name    = formData.get("name")?.toString().trim()    ?? "";
  const email   = formData.get("email")?.toString().trim()   ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  // ── Field-level validation ───────────────────────────────────────────────
  const fieldErrors: ContactFormState["fieldErrors"] = {};

  if (!name)  fieldErrors.name    = "Name is required.";
  if (!email) fieldErrors.email   = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              fieldErrors.email   = "Please enter a valid email address.";
  if (!message)                 fieldErrors.message = "Message is required.";
  else if (message.length > CHAR_LIMIT)
    fieldErrors.message = `Message must be ${CHAR_LIMIT} characters or fewer.`;

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  // ── Supabase INSERT ──────────────────────────────────────────────────────
  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    console.error("[contact action] Supabase error:", error.message);
    return {
      success: false,
      error: "Failed to send your message. Please try again shortly.",
    };
  }

  return { success: true };
}
