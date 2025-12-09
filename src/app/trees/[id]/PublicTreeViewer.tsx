'use client';

import { MessageForm } from '@/app/dashboard/trees/components/MessageForm';
import { TreeCanvas } from '@/app/dashboard/trees/components/TreeCanvas';
import { Tree } from '@/types/tree.interface';
import { Box, Button, Flex, Icon, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiShare2 } from 'react-icons/fi';
import { toast } from 'sonner';

export function PublicTreeViewer({ tree }: { tree: Tree }) {
	const { data: session } = useSession();
	const router = useRouter();
	const {
		open: showMessageForm,
		onOpen: openMessageForm,
		onClose: closeMessageForm,
	} = useDisclosure();

	const handleAddMessage = () => {
		if (!session) {
			toast.error('Please login to leave a message');
			router.push(`/login?callbackUrl=/trees/${tree.id}`);
			return;
		}
		openMessageForm();
	};

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast.success('Link copied to clipboard!');
		} catch (err) {
			toast.error('Failed to copy link');
		}
	};

	const isOwner = session?.user?.id === tree.ownerId;

	return (
		<Box>
			{/* Actions Bar for Owner (Mirroring Dashboard slightly) or Public actions */}
			<Flex justify="flex-end" mb={4} gap={2}>
				<Button size="sm" colorScheme="blue" variant="solid" onClick={handleShare}>
					<Icon as={FiShare2} mr={2} />
					Share
				</Button>
				{isOwner && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => router.push(`/dashboard/trees/${tree.id}`)}
					>
						<Icon as={FiEdit2} mr={2} />
						Manage
					</Button>
				)}
			</Flex>

			<TreeCanvas tree={tree} onAddMessage={handleAddMessage} />

			{showMessageForm && (
				<Box mt={8}>
					<Box borderBottom="1px" borderColor="gray.200" mb={4} />
					<MessageForm
						tree={tree}
						onSuccess={() => {
							closeMessageForm();
							router.refresh(); // Refresh server data to show new message
						}}
					/>
				</Box>
			)}
		</Box>
	);
}
