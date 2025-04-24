import { hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Assuming this function exists

/**
 * Resets a user's password using a valid token.
 * @param request - The incoming request object.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }, // Find by the actual token value
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } }).catch(() => {}); // Clean up expired/invalid token
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Find the user by the identifier stored in the token (which is the email)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      await prisma.verificationToken.delete({ where: { token } }).catch(() => {}); // Clean up token
      return NextResponse.json({ error: 'User not found for this token' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
