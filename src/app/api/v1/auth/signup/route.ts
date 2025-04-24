import { hashPassword } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Handles user signup by creating a new user and sending a verification email.
 * @param request - The incoming request object.
 * @returns A JSON response with the result of the signup operation.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0], // Default name from email
      },
    });

    // Send verification email
    await sendVerificationEmail(user.id, email);

    return NextResponse.json(
      { message: 'User created. Please verify your email.', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
