import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Verifies a user's email address using a token.
 * @param request - The incoming request object.
 * @returns A JSON response indicating success or failure, or a redirect.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    // Maybe redirect to an error page?
    return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
  }

  try {
    // In a real application, use the VerificationToken model provided by NextAuth adapter
    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } }).catch(() => {}); // Clean up expired/invalid token
      // Maybe redirect to an error page indicating invalid/expired token?
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Find the user associated with the identifier (which should be the email in this case)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      await prisma.verificationToken.delete({ where: { token } }).catch(() => {}); // Clean up token
      // Redirect or show error
      return NextResponse.json({ error: 'User not found for this token' }, { status: 404 });
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the token now that it's used
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect the user to the login page with a success indicator
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('verified', 'true');
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Email verification error:', error);
    // Redirect or show a generic error page
    return NextResponse.json(
      { error: 'Internal server error during verification' },
      { status: 500 }
    );
  }
}
