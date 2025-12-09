import { Navbar } from '@/components/layout/Navbar';
import { prisma } from '@/lib/prisma';
import { Button, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicTreeViewer } from './PublicTreeViewer';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const tree = await prisma.tree.findUnique({
		where: { id },
		include: { owner: true },
	});

	if (!tree) {
		return {
			title: 'Tree Not Found',
		};
	}

	return {
		title: `${tree.title} by ${tree.owner.name || 'A Friend'} | iCard`,
		description: `Join in to decorate ${tree.owner.name || 'a friend'}'s festive tree with your messages!`,
		openGraph: {
			title: `${tree.title} | iCard`,
			description: `Add your message to this festive tree!`,
			images: ['/images/og-default.png'], // We can add dynamic OG later
		},
	};
}

async function getTree(id: string) {
	const tree = await prisma.tree.findUnique({
		where: { id },
		include: {
			owner: true,
			messages: {
				include: {
					sender: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});

	if (!tree) notFound();

	// Transform dates for serialization if needed, though Server Components handle generic dates okay usually.
	// However, TreeCanvas expects specific shape.
	return tree;
}

export default async function PublicTreePage({ params }: { params: Promise<{ id: string }> }) {
	const tree = await getTree((await params).id);

	return (
		<>
			<Navbar />
			<Container maxW="container.xl" py={8} minH="calc(100vh - 64px)">
				<VStack gap={6} align="stretch">
					<Flex direction="column" align="center" textAlign="center" gap={2}>
						<Heading size="2xl" color="brand.600">
							{tree.title}
						</Heading>
						<Text fontSize="lg" color="gray.600">
							Created by{' '}
							<Text as="span" fontWeight="bold">
								{tree.owner.name || 'A Friend'}
							</Text>
						</Text>
						{tree.description && (
							<Text color="gray.500" maxW="2xl">
								{tree.description}
							</Text>
						)}
					</Flex>

					{/* Client-side wrapper for interactivity */}
					<PublicTreeViewer tree={tree as any} />

					<Flex justify="center" mt={8}>
						<Link href="/dashboard/trees/new">
							<Button size="lg" colorScheme="brand" variant="outline">
								Create Your Own Tree
							</Button>
						</Link>
					</Flex>
				</VStack>
			</Container>
		</>
	);
}
