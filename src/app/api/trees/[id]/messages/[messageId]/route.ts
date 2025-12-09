import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateMessageSchema = z.object({
	content: z.string().min(1, 'Message content is required').optional(),
	decoration: z
		.object({
			id: z.string(),
			type: z.string(),
			icon: z.string(),
			isPremium: z.boolean(),
		})
		.optional(),
});

// PATCH /api/trees/[id]/messages/[messageId] - Update a message
export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string; messageId: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id: treeId, messageId } = await params;
		const body = await request.json();
		const validatedData = updateMessageSchema.parse(body);

		// Verify message existence and ownership
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			include: {
				tree: {
					select: { ownerId: true },
				},
			},
		});

		if (!message) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 });
		}

		// Only sender can edit message
		if (message.senderId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const updatedMessage = await prisma.message.update({
			where: { id: messageId },
			data: {
				...(validatedData.content && { content: validatedData.content }),
				...(validatedData.decoration && {
					decoration: {
						connect: { id: validatedData.decoration.id },
					},
				}),
			},
		});

		return NextResponse.json(updatedMessage);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
		}
		console.error('Error updating message:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// DELETE /api/trees/[id]/messages/[messageId] - Delete a message
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string; messageId: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id: treeId, messageId } = await params;

		// Verify message existence and ownership
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			include: {
				tree: {
					select: { ownerId: true },
				},
			},
		});

		if (!message) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 });
		}

		// Sender OR Tree Owner can delete message
		const isSender = message.senderId === session.user.id;
		const isTreeOwner = message.tree.ownerId === session.user.id;

		if (!isSender && !isTreeOwner) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		await prisma.message.delete({
			where: { id: messageId },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting message:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
