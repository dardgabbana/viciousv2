import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback-secret-key-change-in-production"
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("admin_session")?.value;
  let isAdmin = false;

  if (token) {
    try {
      await jwtVerify(token, secretKey);
      isAdmin = true;
    } catch {
      isAdmin = false;
    }
  }

  // Protect admin routes except login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (path.startsWith("/admin/login") && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (path.startsWith("/admin/login") && !isAdmin) {
    try {
      // keep old invalid cookie from looping around
      await jwtVerify(token || "", secretKey);
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only admin routes need the session check — running this on every public
  // request cost a middleware invocation plus a JWT verify for nothing.
  matcher: ["/admin/:path*"],
};
