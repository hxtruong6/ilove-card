import { sendPasswordResetEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

/**
 * Handles forgot password requests by generating a reset token and sending an email.
 * @param request - The incoming request object.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Important: Always return a success message even if the email doesn't exist
    // This prevents attackers from discovering registered email addresses.
    if (!user) {
      console.warn(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json(
        { message: 'If an account with this email exists, a password reset email has been sent.' },
        { status: 200 }
      );
    }

    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Store the verification token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email, // Use email as identifier for password reset
        token: token, // Store the unhashed token directly as NextAuth adapter expects
        expires,
      },
    });

    // Send the password reset email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      { message: 'If an account with this email exists, a password reset email has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    // Avoid leaking specific errors
    return NextResponse.json(
      { message: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
