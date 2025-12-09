import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createTreeSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	theme: z.string().min(1, 'Theme is required'),
	description: z.string().optional(),
	isPublic: z.boolean().optional(),
});

// GET /api/trees - List user's trees
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		console.log('API Route - Session:', session);

		if (!session?.user?.id) {
			console.log('API Route - No session or user ID found');
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const trees = await prisma.tree.findMany({
			where: {
				ownerId: session.user.id,
			},
			include: {
				owner: {
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

		return NextResponse.json(trees);
	} catch (error) {
		console.error('Error fetching trees:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// POST /api/trees - Create new tree
export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = createTreeSchema.parse(body);

		const tree = await prisma.tree.create({
			data: {
				title: validatedData.title,
				theme: {
					connect: { id: validatedData.theme },
				},
				description: validatedData.description,
				visibility: validatedData.isPublic ? 'PUBLIC' : 'INVITE_ONLY',
				owner: {
					connect: { id: session.user.id },
				},
			},
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

		return NextResponse.json(tree, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
		}

		console.error('Error creating tree:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
