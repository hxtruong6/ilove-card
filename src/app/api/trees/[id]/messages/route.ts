import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  decoration: z.object({
    id: z.string(),
    type: z.string(),
    icon: z.string(),
    isPremium: z.boolean(),
  }),
  photos: z.array(z.string()).max(3).optional(),
});

// GET /api/trees/[id]/messages - List messages for a tree
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const { id: treeId } = await params;

    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
      select: { isPublic: true, ownerId: true },
    });

    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
    }

    if (!tree.isPublic && tree.ownerId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { treeId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/trees/[id]/messages - Add a message to a tree
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: treeId } = await params;
    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    // Check user's subscription status for premium features
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionStatus: true,
        subscriptionEndDate: true,
      },
    });

    // Validate premium access
    if (validatedData.decoration.isPremium) {
      const hasPremiumAccess =
        user?.subscriptionStatus !== 'FREE' &&
        (user?.subscriptionStatus === 'LIFETIME' ||
          (user?.subscriptionEndDate && user.subscriptionEndDate > new Date()));

      if (!hasPremiumAccess) {
        return NextResponse.json(
          { error: 'Premium decoration requires an active subscription' },
          { status: 403 }
        );
      }
    }

    // Validate photo count based on subscription
    const maxPhotos = user?.subscriptionStatus === 'FREE' ? 1 : 3;
    if (validatedData.photos && validatedData.photos.length > maxPhotos) {
      return NextResponse.json(
        { error: `Free users can only upload ${maxPhotos} photo` },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content: validatedData.content,
        decoration: validatedData.decoration,
        imageUrls: validatedData.photos || [],
        isPremium: validatedData.decoration.isPremium,
        treeId,
        senderId: session.user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            subscriptionStatus: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
