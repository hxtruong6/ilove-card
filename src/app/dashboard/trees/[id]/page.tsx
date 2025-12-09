'use client';

import { MessageForm } from '@/app/dashboard/trees/components/MessageForm';
import { TreeCanvas } from '@/app/dashboard/trees/components/TreeCanvas';
import { Tree } from '@/types/tree.interface';
import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Icon,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { FiEdit2, FiShare2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';

/**
 * Fetches a single tree by ID
 */
async function fetchTree(id: string): Promise<Tree> {
	const response = await fetch(`/api/trees/${id}`, {
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Failed to fetch tree');
	}

	return response.json();
}

export default function TreeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const isMobile = useBreakpointValue({ base: true, md: false });
	const [showMessageForm, setShowMessageForm] = useState(false);
	const { id: treeId } = use(params);

	const {
		data: tree,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['tree', treeId],
		queryFn: () => fetchTree(treeId),
	});

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/trees/${treeId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete tree');
			}

			toast.success('Tree deleted successfully');
			router.push('/dashboard/trees');
		} catch (error) {
			toast.error('Failed to delete tree');
		}
	};

	const handleShare = async () => {
		try {
			const response = await fetch(`/api/trees/${treeId}/share`, {
				method: 'POST',
			});

			if (!response.ok) {
				throw new Error('Failed to share tree');
			}

			const { shareUrl } = await response.json();
			await navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`);
			toast.success('Share link copied to clipboard');
		} catch (error) {
			toast.error('Failed to share tree');
		}
	};

	if (isLoading) {
		return (
			<Container maxW="container.xl" py={8}>
				<Text>Loading tree...</Text>
			</Container>
		);
	}

	if (error || !tree) {
		return (
			<Container maxW="container.xl" py={8}>
				<Text color="red.500">Failed to load tree. Please try again later.</Text>
			</Container>
		);
	}

	return (
		<Container maxW="container.xl" py={8}>
			<Flex direction="column" gap={8}>
				{/* Tree header */}
				<Box>
					<Flex justify="space-between" align="center" mb={2}>
						<Heading size="lg">{tree.title}</Heading>
						<Flex gap={2}>
							<Button size="sm" onClick={() => router.push(`/dashboard/trees/${tree.id}/edit`)}>
								<Icon as={FiEdit2} mr={2} />
								Edit
							</Button>
							<Button size="sm" colorScheme="blue" onClick={handleShare}>
								<Icon as={FiShare2} mr={2} />
								Share
							</Button>
							<Button size="sm" colorScheme="red" onClick={handleDelete}>
								<Icon as={FiTrash2} mr={2} />
								Delete
							</Button>
						</Flex>
					</Flex>

					{tree.description && <Text color="gray.600">{tree.description}</Text>}

					<Text fontSize="sm" color="gray.500" mt={2}>
						Theme: {tree.theme} • Created by {tree.owner.name || tree.owner.email}
					</Text>
				</Box>

				{/* Tree canvas */}
				<Box>
					<TreeCanvas tree={tree} onAddMessage={() => setShowMessageForm(true)} />
				</Box>

				{/* Message form */}
				{showMessageForm && (
					<Box>
						<Box borderBottom="1px" borderColor="gray.200" mb={4} />
						<MessageForm
							tree={tree}
							onSuccess={() => {
								setShowMessageForm(false);
								refetch();
							}}
						/>
					</Box>
				)}
			</Flex>
		</Container>
	);
}
