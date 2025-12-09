import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { generateShareUrl } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

		// Generate share URL
		const shareUrl = generateShareUrl(treeId);

		// Update tree to be public
		await prisma.tree.update({
			where: { id: treeId },
			data: { isPublic: true },
		});

		return NextResponse.json({ shareUrl });
	} catch (error) {
		console.error('Error sharing tree:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
