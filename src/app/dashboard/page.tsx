'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCreateTree = () => {
    router.push('/dashboard/trees/new');
  };

  const handleViewTrees = () => {
    router.push('/dashboard/trees');
  };

  return (
    <Box maxW="7xl" mx="auto" py={8}>
      <VStack gap={8} align="stretch">
        <Box>
          <Heading size="lg">Welcome back, {user?.name}!</Heading>
          <Text color="gray.600" mt={2}>
            Create and manage your digital cards
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          <Box p={6} bg="white" borderRadius="lg" boxShadow="sm" borderWidth={1}>
            <VStack gap={4} align="stretch">
              <Heading size="md">Create New Tree</Heading>
              <Text color="gray.600">
                Start a new digital card tree to share with your loved ones
              </Text>
              <Button colorScheme="brand" onClick={handleCreateTree} size="lg">
                Create Tree
              </Button>
            </VStack>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="sm" borderWidth={1}>
            <VStack gap={4} align="stretch">
              <Heading size="md">My Trees</Heading>
              <Text color="gray.600">View and manage your existing digital card trees</Text>
              <Button colorScheme="brand" variant="outline" onClick={handleViewTrees} size="lg">
                View Trees
              </Button>
            </VStack>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="sm" borderWidth={1}>
            <VStack gap={4} align="stretch">
              <Heading size="md">Recent Activity</Heading>
              <Text color="gray.600">No recent activity to show</Text>
              <Button
                colorScheme="brand"
                variant="ghost"
                onClick={() => router.push('/dashboard/activity')}
                size="lg"
              >
                View All Activity
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
