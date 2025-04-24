'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Box, Link, Stack, Text } from '@chakra-ui/react';

export default function LoginPage() {
  return (
    <AuthLayout>
      <Stack gap={8} width="full">
        <LoginForm />
        <Stack direction="row" justifyContent="center" gap={2}>
          <Text>Don&apos;t have an account?</Text>
          <Link href="/register" color="blue.500">
            Sign up
          </Link>
        </Stack>
        {/* Forgot Password */}
        <Stack direction="row" justifyContent="center" gap={2}>
          <Text>Forgot your password?</Text>
          <Link href="/forgot-password" color="blue.500">
            Reset it
          </Link>
        </Stack>
      </Stack>
    </AuthLayout>
  );
}
