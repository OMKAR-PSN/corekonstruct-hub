import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Next.js Edge Middleware — Session refresh + route protection.
 *
 * Delegates all session handling to the Supabase SSR utility so that:
 *  1. Expired access tokens are automatically refreshed on every request
 *     (the refresh token is rotated and written back to cookies).
 *  2. Unauthenticated visitors hitting /admin, /supervisor, or /client
 *     are redirected to /login with a `?next=` param so we can return
 *     them to their intended destination after login.
 *
 * Do NOT use `getSession()` here — it reads from the potentially-stale
 * client cookie. `updateSession` calls `getUser()` which validates against
 * the Supabase Auth server and is the only source of truth.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/supervisor/:path*",
    "/client/:path*",
  ],
};
