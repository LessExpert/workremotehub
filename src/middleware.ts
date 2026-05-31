import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow public access to articles and home
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes
        const publicPaths = ['/articles', '/crypto', '/about', '/contact', '/']
        if (publicPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
          return true
        }
        // Admin routes require auth
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/articles/:path*'],
}
