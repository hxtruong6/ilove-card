import { generateTokens, verifyRefreshToken, verifyToken } from '@/lib/jwt';
import { rateLimiterMiddleware } from '@/middleware/rateLimiter';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/refresh',
];

const isEnableRateLimiter = process.env.ENABLE_RATE_LIMITER === 'true';

/**
 * Middleware function to handle authentication and rate limiting
 */
export async function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  if (isEnableRateLimiter && request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimitResponse = await rateLimiterMiddleware(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }
  console.log('xxx middleware: ', request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
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
        email: 'user@example.com', // Replace with actual user data
        name: 'User Name', // Replace with actual user data
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

  // No valid tokens found, redirect to login
  const url = new URL('/login', request.url);
  url.searchParams.set('from', pathname);
  return NextResponse.redirect(url);
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
