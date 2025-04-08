'use client';

import { TreeList } from '@/app/dashboard/trees/components/TreeList';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

export default function TreesPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">My Trees</Heading>
        <Text color="gray.600" mt={2}>
          Create and manage your festive trees
        </Text>
      </Box>
      <TreeList />
    </Container>
  );
}
