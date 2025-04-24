'use client';

import { Box, Container, Stack } from '@chakra-ui/react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component for authentication pages (login/register)
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box minH="100vh" bg="#F2F1EE" position="relative" overflow="hidden">
      {/* Background image at the bottom */}
      <Box position="absolute" bottom={0} left={0} right={0} height="50vh" width="100%">
        <Image
          src="/images/bg/auth_bg.png"
          alt="Background"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center bottom',
          }}
          priority
        />
      </Box>

      {/* Content */}
      <Container
        maxW="container.sm"
        py={10}
        px={4}
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          gap={8}
          align="center"
          width="full"
          maxW="md"
          bg="white"
          borderRadius="xl"
          p={8}
          position="relative"
          zIndex={1}
          boxShadow="xl"
        >
          {children}
        </Stack>
      </Container>
    </Box>
  );
}
