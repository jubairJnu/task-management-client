

import { withAuth } from "next-auth/middleware";


export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;

      // Always allow access to login page and auth API routes
      if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
        return true;
      }

      // For all other protected routes, check if token exists
      // If no token, NextAuth will automatically redirect to signIn page
      return !!token;
    },
  },
  pages: {
    signIn: "/login", // This tells NextAuth where to redirect when not authenticated
  },
});

export const config = {
  // Protect all routes except login, API routes, and static files
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
