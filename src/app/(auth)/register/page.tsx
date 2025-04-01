'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Box, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Stack gap={8} maxWidth="md" width="full">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">
            Create an account
          </Text>
          <Text color="gray.600">Join us and start sharing your love</Text>
        </Box>

        <RegisterForm />

        <Text textAlign="center">
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'blue.500', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
