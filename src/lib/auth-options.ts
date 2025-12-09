import { AdditionalUserFields, UserSession } from '@/types/user.interfact';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { verifyPassword } from './auth';
import { prisma } from './prisma';

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

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				// 1. Check if account is locked
				if (user && user.lockedUntil && user.lockedUntil > new Date()) {
					const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
					throw new Error(`Account locked. Please try again in ${minutesLeft} minutes.`);
				}

				// 2. Default failure handler (locks account if user exists)
				const handleFailedLogin = async () => {
					if (user) {
						const newAttempts = (user.failedLoginAttempts || 0) + 1;
						let lockDate = null;

						// Lock for 10 minutes after 5 failed attempts
						if (newAttempts >= 5) {
							lockDate = new Date(Date.now() + 10 * 60 * 1000);
						}

						await prisma.user.update({
							where: { id: user.id },
							data: {
								failedLoginAttempts: newAttempts,
								lockedUntil: lockDate,
							},
						});
					}
					throw new Error('Invalid credentials');
				};

				if (!user || !user.password) {
					await handleFailedLogin();
					return null;
				}

				const isValid = await verifyPassword(credentials.password, user.password);

				if (!isValid) {
					await handleFailedLogin();
					return null;
				}

				// 3. Successful Login - Reset counters
				await prisma.user.update({
					where: { id: user.id },
					data: {
						failedLoginAttempts: 0,
						lockedUntil: null,
					},
				});

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
