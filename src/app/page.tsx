'use client';

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { toast } from 'sonner';

export default function Home() {
  return (
    <Box p={8}>
      <VStack gap={4} align="start">
        <Heading as="h1" size="2xl">
          Welcome to iCard
        </Heading>
        <Text fontSize="xl">
          Create and share personalized festive trees with messages
        </Text>
        <Button colorScheme="primary" size="lg">
          Get Started
        </Button>

        <Button onClick={() => toast.success('Hello')}>Click me</Button>
      </VStack>
    </Box>
  );
}
