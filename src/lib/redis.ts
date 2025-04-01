import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

// Initialize Redis client
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Configure rate limiters
export const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_limit',
  points: 5, // Number of attempts
  duration: 60 * 15, // Per 15 minutes
});

export const registerLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'register_limit',
  points: 3, // Number of attempts
  duration: 60 * 60, // Per hour
});

export const apiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'api_limit',
  points: 100, // Number of requests
  duration: 60, // Per minute
});

/**
 * Rate limits a request based on IP address
 * @param limiter - The rate limiter to use
 * @param ip - The IP address to rate limit
 * @returns True if the request is allowed, false if rate limited
 */
export async function rateLimitRequest(limiter: RateLimiterRedis, ip: string): Promise<boolean> {
  try {
    await limiter.consume(ip);
    return true;
  } catch (error) {
    return false;
  }
}

// Export Redis client for other uses
export default redisClient;
