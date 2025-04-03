'use client';

import { TreeForm } from '@/components/tree/TreeForm';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

export default function NewTreePage() {
  return (
    <Container maxW="xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Create New Tree</Heading>
        <Text color="gray.600" mt={2}>
          Create a new festive tree to share with your loved ones
        </Text>
      </Box>
      <TreeForm />
    </Container>
  );
}
