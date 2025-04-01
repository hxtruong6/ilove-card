'use client';

import { Box, Container, Image, Stack } from '@chakra-ui/react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component for authentication pages (login/register)
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={10} px={4}>
        <Stack gap={8} align="center">
          <Box w={48} h={48} position="relative">
            <Image src="/images/logo.png" alt="iCard Logo" w="full" h="full" objectFit="contain" />
          </Box>
          {children}
        </Stack>
      </Container>
    </Box>
  );
}
