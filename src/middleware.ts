import { rateLimiterMiddleware } from '@/middleware/rateLimiter';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/landing',
];

// Paths that require authentication
const protectedPaths = ['/dashboard', '/tree/new', '/tree/[id]/edit'];

// Paths that are public but need tree access control
const sharePaths = ['/share/[shareId]/[treeId]'];

const isEnableRateLimiter = process.env.ENABLE_RATE_LIMITER === 'true';

/**
 * Middleware function to handle authentication, rate limiting, and access control
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Special handling for root path
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Apply rate limiting to API routes
  if (isEnableRateLimiter && pathname.startsWith('/api/')) {
    const rateLimitResponse = await rateLimiterMiddleware(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle share paths
  if (pathname.startsWith('/share/')) {
    return NextResponse.next();
  }

  // For all other routes, use NextAuth.js middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
