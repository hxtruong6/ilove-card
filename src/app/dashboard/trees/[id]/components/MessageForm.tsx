'use client';

import {
  Box,
  Button,
  Input,
  Progress,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { DecorationPicker } from './DecorationPicker';

// import { SubscriptionModal } from './SubscriptionModal';
// import { useDragAndDrop } from './hooks/useDragAndDrop';

interface MessageFormProps {
  treeId: string;
  onSuccess?: () => void;
}

const MAX_CHARS = 280;
const MAX_PHOTOS_FREE = 1;
const MAX_PHOTOS_PREMIUM = 3;

export const MessageForm = ({ treeId, onSuccess }: MessageFormProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [decoration, setDecoration] = useState<{
    id: string;
    type: string;
    isPremium: boolean;
  } | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { open, onOpen, onClose } = useDisclosure();

  const maxPhotos =
    session?.user?.subscriptionStatus === 'FREE' ? MAX_PHOTOS_FREE : MAX_PHOTOS_PREMIUM;

  //   const { previewRef, handleDragStart } = useDragAndDrop();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/trees/${treeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          decoration,
          photos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post message');
      }

      toast.success('Message posted!');

      setContent('');
      setDecoration(null);
      setPhotos([]);
      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      toast.error('Failed to post message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > maxPhotos) {
      toast.error(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    setIsUploading(true);

    try {
      // Implement your photo upload logic here
      // This is a placeholder for the actual implementation
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async file => {
          // Replace with your actual upload logic
          return URL.createObjectURL(file);
        })
      );

      setPhotos([...photos, ...uploadedUrls]);
    } catch (error) {
      toast.error('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isInvalid={!!error}>
          <Input
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your message..."
            maxLength={MAX_CHARS}
          />
          <Text fontSize="sm" color="gray.500" mt={1}>
            {content.length}/{MAX_CHARS}
          </Text>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>

        <DecorationPicker onSelect={setDecoration} selectedId={decoration?.id} />

        <Box w="full">
          <Text mb={2} fontWeight="medium">
            Add Photos ({photos.length}/{maxPhotos})
          </Text>
          <SimpleGrid columns={[2, 3]} spacing={2}>
            {photos.map((url, index) => (
              <Box key={index} position="relative">
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  borderRadius="md"
                  objectFit="cover"
                  h="100px"
                />
                <IconButton
                  aria-label="Remove photo"
                  icon={<DeleteIcon />}
                  size="xs"
                  position="absolute"
                  top={1}
                  right={1}
                  onClick={() => {
                    setPhotos(photos.filter((_, i) => i !== index));
                  }}
                />
              </Box>
            ))}
            {photos.length < maxPhotos && (
              <Button
                as="label"
                h="100px"
                cursor="pointer"
                variant="outline"
                display="flex"
                flexDirection="column"
                gap={2}
              >
                <AddIcon />
                <Text fontSize="sm">Add Photo</Text>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  display="none"
                  multiple={maxPhotos - photos.length > 1}
                />
              </Button>
            )}
          </SimpleGrid>
          {isUploading && <Progress size="xs" isIndeterminate mt={2} />}
        </Box>

        <Button type="submit" colorScheme="teal" dis={!content.trim() || !decoration} w="full">
          Post Message
        </Button>
      </VStack>
    </Box>
  );
};
