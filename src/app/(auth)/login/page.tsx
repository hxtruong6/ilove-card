'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Box, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthLayout>
      <Stack gap={8} maxWidth="md" width="full">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">
            Welcome back
          </Text>
          <Text color="gray.600">Sign in to your account</Text>
        </Box>

        <LoginForm />

        <Text textAlign="center">
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'blue.500', textDecoration: 'underline' }}>
            Sign up
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
