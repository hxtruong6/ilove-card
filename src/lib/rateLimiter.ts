import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Rate limit configurations
const RATE_LIMITS = {
  login: {
    points: 5,
    duration: 60 * 15, // 15 minutes
  },
  register: {
    points: 3,
    duration: 60 * 60, // 1 hour
  },
  api: {
    points: 100,
    duration: 60, // 1 minute
  },
};

/**
 * Rate limits a request based on IP address
 * @param key - The key to rate limit (e.g., 'login', 'register', 'api')
 * @param ip - The IP address to rate limit
 * @returns True if the request is allowed, false if rate limited
 */
export async function rateLimitRequest(
  key: 'login' | 'register' | 'api',
  ip: string
): Promise<boolean> {
  const limit = RATE_LIMITS[key];
  const redisKey = `${key}:${ip}`;

  try {
    // Get current count
    const current = (await redis.get<number>(redisKey)) || 0;

    // Check if rate limit exceeded
    if (current >= limit.points) {
      return false;
    }

    // Increment counter
    await redis.incr(redisKey);

    // Set expiry if this is the first request
    if (current === 0) {
      await redis.expire(redisKey, limit.duration);
    }

    return true;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // In case of Redis errors, allow the request
    return true;
  }
}
