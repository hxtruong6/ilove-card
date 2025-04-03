import { Tree } from '@/types/tree.interface';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiShare2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';

interface TreeCardProps {
  tree: Tree;
}

/**
 * TreeCard component displays a single tree with actions
 */
export function TreeCard({ tree }: TreeCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/trees/${tree.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tree');
      }

      toast.success('Tree deleted successfully');

      // Refresh the page to update the list
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
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" shadow="sm">
      <Box p={4}>
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
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
      </Box>
      <Box p={4} pt={0}>
        {tree.description && (
          <Text
            color="gray.600"
            display="-webkit-box"
            style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {tree.description}
          </Text>
        )}
        <Text fontSize="sm" color="gray.500" mt={2}>
          Theme: {tree.theme}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Messages: {tree.messages?.length ?? 0}
        </Text>
      </Box>
      <Box p={4} pt={0}>
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
      </Box>
    </Box>
  );
}
