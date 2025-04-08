import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateTreeSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  theme: z.string().min(1, 'Theme is required').optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// GET /api/trees/[id] - Get tree details
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const { id: treeId } = await params;

    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
    }

    if (!tree.isPublic && tree.ownerId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(tree);
  } catch (error) {
    console.error('Error fetching tree:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/trees/[id] - Update tree
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: treeId } = await params;
    const body = await request.json();
    const validatedData = updateTreeSchema.parse(body);

    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
      select: { ownerId: true },
    });

    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
    }

    if (tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedTree = await prisma.tree.update({
      where: { id: treeId },
      data: validatedData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTree);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Error updating tree:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/trees/[id] - Delete tree
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: treeId } = await params;

    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
      select: { ownerId: true },
    });

    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
    }

    if (tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.tree.delete({
      where: { id: treeId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting tree:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
