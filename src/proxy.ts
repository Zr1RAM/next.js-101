import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth/auth";

export async function proxy(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // 1. Protect API routes (/api/*)
  if (pathname.startsWith("/api/")) {
    const isPublicApiRoute =
      pathname.startsWith("/api/public") || pathname.startsWith("/api/auth");

    if (!isPublicApiRoute) {
      if (!authToken?.value) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Authentication required",
            },
          },
          { status: 401 }
        );
      }

      // Verify JWT session token
      const session =
        authToken.value === "true"
          ? { id: "legacy" }
          : await verifyJwt(authToken.value);

      if (!session) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Invalid or expired session token",
            },
          },
          { status: 401 }
        );
      }

      // Forward user ID in request headers for downstream handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", session.id);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  }

  // 2. Protect Page / UI routes (dashboard, tasks, user profile, etc.)
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/" ||
    pathname === "/about" ||
    pathname.startsWith("/blog");

  // If unauthenticated and trying to access a protected page, redirect to login
  if (!authToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access login or register page, redirect to home
  if (authToken && (pathname === "/login" || pathname === "/register")) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - static media files (.svg, .png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
