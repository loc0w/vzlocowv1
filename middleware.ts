// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Özel middleware mantığı ekleyebilirsiniz
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // token varsa true döner
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/users/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};