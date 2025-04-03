import { generateTokens, verifyRefreshToken, verifyToken } from '@/lib/jwt';
import { rateLimiterMiddleware } from '@/middleware/rateLimiter';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { cookies } from 'next/headers';
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
    const accessToken = request.cookies.get('accessToken')?.value;
    if (accessToken) {
      try {
        await verifyToken(accessToken);
        // If token is valid, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Token is invalid, continue to landing page
      }
    }
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

  // Check for access token
  const accessToken = request.cookies.get('accessToken')?.value;
  if (accessToken) {
    try {
      await verifyToken(accessToken);
      return NextResponse.next();
    } catch (error) {
      // Access token is invalid, try refresh token
    }
  }

  // Try refresh token if access token is invalid or missing
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);

      // TODO: Fetch user data from database using payload.userId
      const userData = {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
      };

      // Generate new tokens
      const tokens = await generateTokens(userData);

      // Create response with new tokens
      const response = NextResponse.next();

      // Set new cookies
      response.cookies.set('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      });

      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    } catch (error) {
      // Refresh token is invalid
    }
  }

  // Redirect to login if no valid tokens
  const url = new URL('/login', request.url);
  url.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(url);
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
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
