import { rateLimitRequest } from '@/lib/rateLimiter';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Gets the IP address from a request
 * @param request - The Next.js request object
 * @returns The IP address
 */
function getIP(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0] : '127.0.0.1';
}

/**
 * Rate limiting middleware
 * @param request - The Next.js request object
 * @returns Response if rate limited, undefined otherwise
 */
export async function rateLimiterMiddleware(request: NextRequest) {
  const ip = getIP(request);
  const path = request.nextUrl.pathname;

  // Select appropriate rate limiter based on the path
  let key: 'login' | 'register' | 'api' = 'api';
  if (path === '/api/auth/login') {
    key = 'login';
  } else if (path === '/api/auth/register') {
    key = 'register';
  }

  // Check rate limit
  const isAllowed = await rateLimitRequest(key, ip);
  if (!isAllowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  return undefined;
}
