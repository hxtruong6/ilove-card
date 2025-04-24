import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

/**
 * Updates the profile of the currently authenticated user.
 * @param request - The incoming request object.
 * @returns A JSON response with the updated user profile or an error.
 */
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { name, avatar } = await request.json(); // Expecting JSON payload

    // Prepare data for update, only include fields that are provided
    const updateData: { name?: string; avatar?: string } = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: 'Invalid name format' }, { status: 400 });
      }
      updateData.name = name.trim();
    }
    if (avatar !== undefined) {
      // Add validation for the avatar URL format if necessary
      if (typeof avatar !== 'string' || !avatar.startsWith('https://')) {
        return NextResponse.json({ error: 'Invalid avatar URL format' }, { status: 400 });
      }
      updateData.avatar = avatar;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        // Select only the fields needed for the response
        id: true,
        email: true,
        name: true,
        avatar: true, // Use 'avatar' as mapped in the schema
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    // Add more specific error handling if needed (e.g., Prisma errors)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
