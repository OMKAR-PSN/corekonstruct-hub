import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * createClient — Server-side Supabase client.
 *
 * Use this in Server Components, Server Actions, and Route Handlers.
 * It reads cookies from the incoming request to restore the user's session
 * without making an extra network round-trip.
 *
 * IMPORTANT: This function must be called inside an async context because
 * `cookies()` from next/headers is async in Next.js 15.
 *
 * Usage (Server Component):
 *   import { createClient } from "@/utils/supabase/server";
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll was called from a Server Component.
            // Cookies can only be set in Server Actions and Route Handlers.
            // This is safe to ignore — the session middleware handles refresh.
          }
        },
      },
    },
  );
}
