'use client';

import { Tree } from '@/types/tree.interface';
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiMoreVertical, FiShare2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';

interface TreeCardProps {
  tree: Tree;
}

/**
 * TreeCard component displays a single tree with actions
 */
export function TreeCard({ tree }: TreeCardProps) {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/trees/${tree.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tree');
      }

      toast.success('Tree deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete tree');
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/trees/${tree.id}/share`, {
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

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      shadow="sm"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <Box p={4}>
        <HStack justify="space-between" mb={2}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => router.push(`/tree/${tree.id}`)}
            _hover={{ color: 'brand.500' }}
          >
            {tree.title}
          </Text>
          <Text
            fontSize="sm"
            color={tree.isPublic ? 'green.500' : 'gray.500'}
            bg={tree.isPublic ? 'green.50' : 'gray.50'}
            px={2}
            py={1}
            borderRadius="full"
          >
            {tree.isPublic ? 'Public' : 'Private'}
          </Text>
        </HStack>

        {tree.description && (
          <Text color="gray.600" mb={2}>
            {tree.description}
          </Text>
        )}

        <HStack justify="space-between" align="center">
          <Box>
            <Text fontSize="sm" color="gray.500">
              Theme: {tree.theme}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Messages: {tree.messages?.length ?? 0}
            </Text>
          </Box>

          {isMobile ? (
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton>
                  <FiMoreVertical />
                </IconButton>
              </MenuTrigger>
              <Portal>
                <MenuPositioner>
                  <MenuContent>
                    <MenuItem value="edit" onClick={() => router.push(`/tree/${tree.id}/edit`)}>
                      <FiEdit2 />
                    </MenuItem>
                    <MenuItem value="share" onClick={handleShare}>
                      <FiShare2 />
                    </MenuItem>
                    <MenuItem value="delete" onClick={handleDelete} color="red.500">
                      <FiTrash2 />
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </Portal>
            </MenuRoot>
          ) : (
            <HStack gap={2}>
              <Button size="sm" onClick={() => router.push(`/tree/${tree.id}/edit`)}>
                <Icon as={FiEdit2} mr={2} />
                Edit
              </Button>
              <Button size="sm" onClick={handleShare} colorScheme="blue">
                <Icon as={FiShare2} mr={2} />
                Share
              </Button>
              <Button size="sm" onClick={handleDelete} colorScheme="red">
                <Icon as={FiTrash2} mr={2} />
                Delete
              </Button>
            </HStack>
          )}
        </HStack>
      </Box>
    </Box>
  );
}
