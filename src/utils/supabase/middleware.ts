import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * updateSession — Supabase edge middleware utility.
 *
 * This function must be called from src/middleware.ts on every request.
 * It does two critical things:
 *
 * 1. SESSION REFRESH: Calls supabase.auth.getUser() which automatically
 *    refreshes the access token if it has expired and writes the updated
 *    tokens back to the response cookies. Without this, users are logged
 *    out as soon as their JWT expires (default: 1 hour).
 *
 * 2. ROUTE PROTECTION: Checks if a user session exists. If not, redirects
 *    unauthenticated requests to /login.
 *
 * CRITICAL: Do NOT run any code between createServerClient and
 * supabase.auth.getUser(). The cookie forwarding must be uninterrupted
 * or session state will desync between client and server.
 *
 * Usage (src/middleware.ts):
 *   import { updateSession } from "@/utils/supabase/middleware";
 *   export async function middleware(request: NextRequest) {
 *     return await updateSession(request);
 *   }
 */
export async function updateSession(request: NextRequest) {
  // Start with a passthrough response so we can mutate its cookies.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Forward cookies from the request first (required by @supabase/ssr).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Re-create the response so cookie mutations are preserved.
          supabaseResponse = NextResponse.next({ request });
          // Write the refreshed tokens into the response cookies.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not insert any logic here.
  // getUser() validates the token against the Supabase Auth server and
  // triggers the refresh flow if the access token has expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const protectedPrefixes = ["/admin", "/supervisor", "/client"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // IMPORTANT: Return supabaseResponse (not a new NextResponse).
  // Returning a different object would drop the refreshed session cookies.
  return supabaseResponse;
}
