import { UserSession } from '@/types/user.interfact';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { verifyPassword } from './auth';
import { prisma } from './prisma';

declare module 'next-auth' {
  interface Session {
    user: UserSession;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
