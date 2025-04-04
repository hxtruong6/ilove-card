import { ROUTE_CONSTANTS } from '@/lib/route-constants';
import { Tree } from '@/types/tree.interface';
import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TreeCard } from './TreeCard';

/**
 * Fetches the user's trees from the API
 */
async function fetchTrees(): Promise<Tree[]> {
  const response = await fetch('/api/trees', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch trees');
  }
  return response.json();
}

/**
 * TreeList component displays a grid of user's trees
 */
export function TreeList() {
  const router = useRouter();

  const {
    data: trees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trees'],
    queryFn: fetchTrees,
  });

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Loading trees...</Text>
      </Box>
    );
  }

  if (error) {
    toast.error('Failed to load trees. Please try again.');
    return (
      <Box p={4}>
        <Text color="red.500">Failed to load trees</Text>
      </Box>
    );
  }

  if (!trees?.length) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="md" mb={2}>
          No trees yet
        </Heading>
        <Text color="gray.600">Create your first tree to start sharing messages!</Text>
        <Text
          as="button"
          color="blue.500"
          textDecoration="underline"
          onClick={() => router.push(ROUTE_CONSTANTS.DASHBOARD.TREES.NEW)}
          cursor="pointer"
          mt={2}
        >
          Create a tree
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        My Trees
      </Heading>
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
      >
        {trees.map(tree => (
          <TreeCard key={tree.id} tree={tree} />
        ))}
      </Grid>
    </Box>
  );
}
