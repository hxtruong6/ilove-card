'use client';

import { RichTextEditor } from '@/components/common/RichTextEditor';
import { Tree } from '@/types/tree.interface';
import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { toast } from 'sonner';

import { DecorationSelector } from './DecorationSelector';

interface MessageFormProps {
	tree: Tree;
	onSuccess?: () => void;
}

/**
 * MessageForm component for adding messages to a tree
 * Provides a form with decoration selection and a textarea for message content
 */
export function MessageForm({ tree, onSuccess }: MessageFormProps) {
	const [content, setContent] = useState('');
	const [selectedDecoration, setSelectedDecoration] = useState<string>('Decor-01');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;

		setIsLoading(true);

		try {
			const response = await fetch(`/api/trees/${tree.id}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content,
					decoration: selectedDecoration,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to add message');
			}

			setContent('');
			toast.success('Message added successfully');

			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			toast.error('Failed to add message');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box as="form" onSubmit={handleSubmit} w="100%">
			<VStack gap={4} align="stretch">
				<DecorationSelector
					onSelect={setSelectedDecoration}
					selectedDecoration={selectedDecoration}
				/>

				<Box>
					<Text mb={2} fontWeight="medium">
						Your Message
					</Text>
					<RichTextEditor content={content} onChange={setContent} />
				</Box>

				<HStack justify="flex-end">
					<Button type="submit" colorScheme="brand" loading={isLoading} disabled={!content.trim()}>
						<Icon as={FiSend} mr={2} />
						Send Message
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
}
