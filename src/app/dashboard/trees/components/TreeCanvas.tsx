'use client';

import { MessageCard } from '@/app/dashboard/trees/components/MessageCard';
import { Message, Tree } from '@/types/tree.interface';
import {
	Box,
	Button,
	Center,
	Icon,
	IconButton,
	Text,
	VStack,
	useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { toast } from 'sonner';

interface TreeCanvasProps {
	tree: Tree;
	onAddMessage?: () => void;
}

/**
 * TreeCanvas component displays a festive tree with message cards as decorations.
 * It supports different themes and is designed with a mobile-first approach.
 */
export function TreeCanvas({ tree, onAddMessage }: TreeCanvasProps) {
	const isMobile = useBreakpointValue({ base: true, md: false });
	const { data: session } = useSession();
	const router = useRouter();
	const [messages, setMessages] = useState<Message[]>(tree.messages || []);

	// Theme-specific styles
	const getThemeStyles = () => {
		switch (tree.theme) {
			case 'christmas':
				return {
					treeColor: 'teal',
					decorations: ['snowman', 'gingerbread', 'gift', 'ornament', 'bell'],
					bgGradient: 'linear(to-b, blue.900, black)',
				};
			case 'birthday':
				return {
					treeColor: 'pink',
					decorations: ['balloon', 'cake', 'gift', 'star', 'confetti'],
					bgGradient: 'linear(to-b, purple.900, black)',
				};
			case 'valentine':
				return {
					treeColor: 'red',
					decorations: ['heart', 'rose', 'chocolate', 'cupid', 'love'],
					bgGradient: 'linear(to-b, red.900, black)',
				};
			case 'easter':
				return {
					treeColor: 'yellow',
					decorations: ['egg', 'bunny', 'chick', 'flower', 'basket'],
					bgGradient: 'linear(to-b, green.900, black)',
				};
			case 'halloween':
				return {
					treeColor: 'orange',
					decorations: ['pumpkin', 'ghost', 'bat', 'witch', 'spider'],
					bgGradient: 'linear(to-b, gray.900, black)',
				};
			default:
				return {
					treeColor: 'teal',
					decorations: ['ornament', 'gift', 'star', 'bell', 'heart'],
					bgGradient: 'linear(to-b, blue.900, black)',
				};
		}
	};

	const themeStyles = getThemeStyles();

	// Render a snowflake for the background
	const SnowFlake = () => (
		<motion.div
			style={{ position: 'absolute', top: '-10px', left: `${Math.random() * 100}%` }}
			animate={{ y: '100vh', opacity: 0 }}
			transition={{ duration: 5, repeat: Infinity }}
		>
			❄️
		</motion.div>
	);

	const handleUpdateMessage = async (messageId: string, content: string) => {
		try {
			const response = await fetch(`/api/trees/${tree.id}/messages/${messageId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ content }),
			});

			if (!response.ok) throw new Error('Failed to update message');

			const updatedMessage = await response.json();
			setMessages(prev =>
				prev.map(msg => (msg.id === messageId ? { ...msg, content: updatedMessage.content } : msg))
			);
			toast.success('Message updated successfully');
			router.refresh();
		} catch (error) {
			toast.error('Failed to update message');
			console.error(error);
		}
	};

	const handleDeleteMessage = async (messageId: string) => {
		try {
			const response = await fetch(`/api/trees/${tree.id}/messages/${messageId}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete message');

			setMessages(prev => prev.filter(msg => msg.id !== messageId));
			toast.success('Message deleted successfully');
			router.refresh();
		} catch (error) {
			toast.error('Failed to delete message');
			console.error(error);
		}
	};

	return (
		<Box
			position="relative"
			w="100%"
			h={{ base: '400px', md: '500px' }}
			bgGradient={themeStyles.bgGradient}
			borderRadius="lg"
			overflow="hidden"
			boxShadow="xl"
		>
			{/* Background effects */}
			{tree.theme === 'christmas' && (
				<>
					{Array.from({ length: 20 }).map((_, i) => (
						<SnowFlake key={i} />
					))}
				</>
			)}

			{/* Tree base */}
			<Center position="relative" h="100%">
				<Box position="relative" w={{ base: '80%', md: '60%' }} h={{ base: '80%', md: '90%' }}>
					{/* Tree tiers */}
					<Box
						bg={`${themeStyles.treeColor}.500`}
						w="100%"
						h={{ base: '120px', md: '150px' }}
						borderRadius="md"
						position="absolute"
						bottom={{ base: '40px', md: '50px' }}
					/>
					<Box
						bg={`${themeStyles.treeColor}.400`}
						w="80%"
						h={{ base: '100px', md: '120px' }}
						borderRadius="md"
						position="absolute"
						bottom={{ base: '120px', md: '150px' }}
						left="10%"
					/>
					<Box
						bg={`${themeStyles.treeColor}.300`}
						w="60%"
						h={{ base: '80px', md: '90px' }}
						borderRadius="md"
						position="absolute"
						bottom={{ base: '180px', md: '230px' }}
						left="20%"
					/>
					<Box
						bg={`${themeStyles.treeColor}.200`}
						w="40%"
						h={{ base: '50px', md: '60px' }}
						borderRadius="md"
						position="absolute"
						bottom={{ base: '230px', md: '290px' }}
						left="30%"
					/>

					{/* Tree trunk */}
					<Box
						bg="brown.600"
						w={{ base: '40px', md: '50px' }}
						h={{ base: '40px', md: '50px' }}
						position="absolute"
						bottom="0"
						left="calc(50% - 25px)"
					/>

					{/* Tree topper */}
					<Box position="absolute" top="-20px" left="calc(50% - 30px)">
						<Box
							w={{ base: '40px', md: '60px' }}
							h={{ base: '40px', md: '60px' }}
							bg={`${themeStyles.treeColor}.100`}
							borderRadius="full"
							display="flex"
							alignItems="center"
							justifyContent="center"
							boxShadow="lg"
						>
							<Text fontSize={{ base: '20px', md: '24px' }}>⭐</Text>
						</Box>
					</Box>

					{/* Messages */}
					{messages && messages.length > 0 ? (
						messages.map((message, index) => {
							const canEdit = session?.user?.id === message.senderId;
							const canDelete =
								session?.user?.id === message.senderId || session?.user?.id === tree.ownerId;

							// Calculate position based on index and mobile/desktop
							const position = {
								top: `${(index % 5) * 15 + 10}%`,
								left: `${(index % 3) * 30 + 10}%`,
							};

							return (
								<MessageCard
									key={message.id}
									message={message}
									style={position}
									themeStyles={themeStyles}
									canEdit={canEdit}
									canDelete={canDelete}
									onUpdate={handleUpdateMessage}
									onDelete={handleDeleteMessage}
								/>
							);
						})
					) : (
						<Center
							position="absolute"
							top="50%"
							left="50%"
							transform="translate(-50%, -50%)"
							textAlign="center"
							w="90%"
						>
							<VStack
								gap={4}
								bg="whiteAlpha.200"
								backdropFilter="blur(8px)"
								p={6}
								borderRadius="xl"
								borderWidth="1px"
								borderColor="whiteAlpha.300"
								shadow="lg"
							>
								<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="white">
									Your tree looks a bit lonely! 🎄
								</Text>
								<Text fontSize={{ base: 'sm', md: 'md' }} color="whiteAlpha.900">
									Be the first to hang a message decoration and spread the holiday cheer.
								</Text>
								<Button
									onClick={onAddMessage}
									colorScheme={themeStyles.treeColor}
									size="md"
									shadow="md"
									_hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
								>
									<Icon as={FiMessageSquare} mr={2} />
									Add First Message
								</Button>
							</VStack>
						</Center>
					)}
				</Box>
			</Center>

			{/* Add message button (only show when there are messages) */}
			{messages && messages.length > 0 && (
				<IconButton
					aria-label="Add message"
					onClick={onAddMessage}
					colorScheme={themeStyles.treeColor}
					size="lg"
					position="absolute"
					bottom={4}
					right={4}
					borderRadius="full"
					boxShadow="lg"
				>
					<FiMessageSquare />
				</IconButton>
			)}
		</Box>
	);
}
