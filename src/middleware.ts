import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/admin", "/supervisor", "/client"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "corekonstruct-demo-secret";
  const token = await getToken({ req: request, secret });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const routeToRole: Record<string, string> = {
    "/admin": "admin",
    "/supervisor": "supervisor",
    "/client": "client",
  };

  const matchedRoute = protectedRoutes.find((route) => pathname.startsWith(route));
  const requiredRole = matchedRoute ? routeToRole[matchedRoute] : null;
  const tokenRole = token.role as string | undefined;
  const dashboardRoute = token.dashboardRoute as string | undefined;

  if (requiredRole && tokenRole && tokenRole !== requiredRole) {
    return NextResponse.redirect(new URL(dashboardRoute ?? "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/supervisor/:path*", "/client/:path*"],
};
