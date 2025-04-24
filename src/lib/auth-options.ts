import { AdditionalUserFields, UserSession } from '@/types/user.interfact';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { verifyPassword } from './auth';
import { prisma } from './prisma';

// Track failed login attempts
const failedLoginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Function to check if an account is locked
function isAccountLocked(email: string): boolean {
  const attempts = failedLoginAttempts.get(email);
  if (!attempts) return false;

  // If less than 10 minutes have passed since the last attempt and 5 or more attempts
  const tenMinutesInMs = 10 * 60 * 1000;
  return attempts.count >= 5 && Date.now() - attempts.lastAttempt < tenMinutesInMs;
}

// Function to record a failed login attempt
function recordFailedAttempt(email: string): void {
  const attempts = failedLoginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  failedLoginAttempts.set(email, attempts);
}

// Function to reset failed login attempts after successful login
function resetFailedAttempts(email: string): void {
  failedLoginAttempts.delete(email);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<(AdapterUser & AdditionalUserFields) | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // Check if account is locked
        if (isAccountLocked(credentials.email)) {
          throw new Error(
            'Account locked due to too many failed attempts. Please try again in 10 minutes.'
          );
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          recordFailedAttempt(credentials.email);
          throw new Error('Invalid credentials');
        }

        if (!user.password) {
          recordFailedAttempt(credentials.email);
          throw new Error('Invalid credentials');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          recordFailedAttempt(credentials.email);
          throw new Error('Invalid credentials');
        }

        // Reset failed attempts on successful login
        resetFailedAttempts(credentials.email);

        // Return user with custom fields
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          avatar: user.avatar,
          lastActiveTreeId: user.lastActiveTreeId || null,
          subscriptionStatus: user.subscriptionStatus,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              avatar: profile.picture,
              password: '', // No password for OAuth users
              emailVerified: new Date(),
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          lastActiveTreeId: user.lastActiveTreeId || null,
        };
      },
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
    verifyRequest: '/verify-email',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name || '';
        session.user.email = user.email || '';
        session.user.avatar = user.avatar || '';
        session.user.lastActiveTreeId = user.lastActiveTreeId || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
