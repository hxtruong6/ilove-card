'use client';

import { RichTextEditor } from '@/components/common/RichTextEditor';
import { Message } from '@/types/tree.interface';
import {
	Box,
	Button,
	Icon,
	Image,
	Menu,
	Popover,
	Portal,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
import { useState } from 'react';
import { FiCheck, FiEdit2, FiMessageSquare, FiMoreVertical, FiTrash2, FiX } from 'react-icons/fi';

interface MessageCardProps {
	message: Message;
	style: React.CSSProperties;
	themeStyles: {
		treeColor: string;
	};
	canEdit: boolean;
	canDelete: boolean;
	onUpdate: (id: string, content: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
}

export function MessageCard({
	message,
	style,
	themeStyles,
	canEdit,
	canDelete,
	onUpdate,
	onDelete,
}: MessageCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(message.content);
	const [isHovered, setIsHovered] = useState(false);
	const { onOpen, onClose, open: isOpen } = useDisclosure();

	// Handle decoration image
	const getDecorationImage = (decoration: string) => {
		if (decoration) {
			return `/images/decorations/${decoration}.png`;
		}
		// Fallback logic handled in parent or here if needed
		return null;
	};

	const handleSave = async () => {
		if (editContent.trim() !== message.content) {
			await onUpdate(message.id, editContent);
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditContent(message.content);
		setIsEditing(false);
	};

	const handleDelete = async () => {
		await onDelete(message.id);
		onClose();
	};

	// Safe decoration access with type casting if needed or updated interface
	const decoration = (message as any).decoration as any; // Using existing logic from TreeCanvas
	const decorationImage = decoration?.icon ? `/images/decorations/${decoration.icon}.png` : null;

	return (
		<motion.div
			style={{
				...style,
				position: 'absolute',
				zIndex: isOpen || isEditing ? 20 : 10, // Bring to front when active
			}}
			whileHover={{ scale: 1.1 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
		>
			<Popover.Root
				open={isOpen}
				onOpenChange={(e: any) => (e.open ? onOpen() : onClose())}
				positioning={{ placement: 'top' }}
				closeOnInteractOutside={!isEditing}
			>
				<Popover.Trigger asChild>
					<Box
						w={{ base: '40px', md: '50px' }}
						h={{ base: '40px', md: '50px' }}
						borderRadius="full"
						bg={`${themeStyles.treeColor}.200`}
						borderWidth="2px"
						borderColor={`${themeStyles.treeColor}.500`}
						display="flex"
						alignItems="center"
						justifyContent="center"
						cursor="pointer"
						boxShadow="md"
						transition="all 0.2s"
						_hover={{ transform: 'scale(1.1)', boxShadow: 'lg' }}
						position="relative"
						overflow="hidden"
						onClick={onOpen}
					>
						{decorationImage ? (
							<Image
								src={decorationImage}
								alt="Message decoration"
								w="100%"
								h="100%"
								objectFit="cover"
							/>
						) : (
							<Icon as={FiMessageSquare} color={`${themeStyles.treeColor}.700`} />
						)}
					</Box>
				</Popover.Trigger>
				<Portal>
					<Popover.Positioner>
						<Popover.Content width="250px" boxShadow="xl">
							<Popover.Arrow />
							<Popover.CloseTrigger asChild>
								<Button size="xs" variant="ghost" position="absolute" top="2" right="2">
									<Icon as={FiX} />
								</Button>
							</Popover.CloseTrigger>
							<Popover.Header fontWeight="bold">
								{message.sender?.name || 'Anonymous'} says:
							</Popover.Header>
							<Popover.Body>
								{isEditing ? (
									<VStack gap={2}>
										<Box w="100%">
											<RichTextEditor content={editContent} onChange={setEditContent} />
										</Box>
										<Box display="flex" width="100%" gap={2} justifyContent="flex-end">
											<Button size="xs" onClick={handleCancel} colorPalette="gray">
												<Icon as={FiX} />
											</Button>
											<Button size="xs" onClick={handleSave} colorPalette="green">
												<Icon as={FiCheck} />
											</Button>
										</Box>
									</VStack>
								) : (
									<Box
										fontSize="sm"
										className="prose prose-sm"
										dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }}
									/>
								)}
							</Popover.Body>
							<Popover.Footer
								display="flex"
								alignItems="center"
								justifyContent="space-between"
								pb={4}
							>
								<Text fontSize="xs" color="gray.500">
									{new Date(message.createdAt).toLocaleDateString()}
								</Text>

								{(canEdit || canDelete) && !isEditing && (
									<Menu.Root>
										<Menu.Trigger asChild>
											<Button size="xs" variant="ghost">
												<Icon as={FiMoreVertical} />
											</Button>
										</Menu.Trigger>
										<Menu.Content minW="100px">
											{canEdit && (
												<Menu.Item value="edit" onClick={() => setIsEditing(true)}>
													<Icon as={FiEdit2} /> Edit
												</Menu.Item>
											)}
											{canDelete && (
												<Menu.Item value="delete" onClick={handleDelete} color="red.500">
													<Icon as={FiTrash2} /> Delete
												</Menu.Item>
											)}
										</Menu.Content>
									</Menu.Root>
								)}
							</Popover.Footer>
						</Popover.Content>
					</Popover.Positioner>
				</Portal>
			</Popover.Root>
		</motion.div>
	);
}
