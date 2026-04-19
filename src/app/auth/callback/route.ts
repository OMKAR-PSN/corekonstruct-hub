import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GET /auth/callback
 *
 * Supabase OAuth & Magic Link callback handler.
 *
 * After a user completes Google OAuth (or a magic link), Supabase redirects
 * them here with a short-lived `code` parameter. This route exchanges that
 * code for a real session (access + refresh tokens) and writes them into
 * HttpOnly cookies so the server-side client can read them on subsequent
 * requests.
 *
 * Query parameters:
 *   code  — The one-time auth code from Supabase (required for OAuth).
 *   next  — Optional path to redirect to after login (e.g. "/admin").
 *           Defaults to "/" (the landing page) when omitted.
 *
 * Supabase Dashboard config required:
 *   Authentication → URL Configuration → Redirect URLs
 *   Add: http://localhost:3000/auth/callback  (dev)
 *   Add: https://corekonstruct.com/auth/callback  (prod)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Session is now set in cookies. Redirect to the intended destination.
      // forwardedHost handles Vercel/proxy environments where the public URL
      // differs from the internal origin.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Code exchange failed — redirect to an error page.
  // Create src/app/auth/auth-code-error/page.tsx if you want a branded error.
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
