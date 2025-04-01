import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

/**
 * Generates an access token and refresh token for a user
 * @param payload - User data to encode in the token
 * @returns Object containing access token and refresh token
 */
export async function generateTokens(payload: JWTPayload) {
  const accessToken = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') // Access token expires in 15 minutes
    .sign(new TextEncoder().encode(JWT_SECRET));

  const refreshToken = await new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Refresh token expires in 7 days
    .sign(new TextEncoder().encode(REFRESH_SECRET));

  return { accessToken, refreshToken };
}

/**
 * Verifies a JWT token
 * @param token - The token to verify
 * @returns The decoded payload if valid
 * @throws If the token is invalid or expired
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Verifies a refresh token
 * @param token - The refresh token to verify
 * @returns The decoded payload if valid
 * @throws If the token is invalid or expired
 */
export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(REFRESH_SECRET));
    return payload as { userId: string };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

/**
 * Sets the authentication cookies
 * @param tokens - Object containing access and refresh tokens
 */
export async function setAuthCookies(tokens: { accessToken: string; refreshToken: string }) {
  const cookieStore = await cookies();

  cookieStore.set('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  cookieStore.set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Clears the authentication cookies
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}
