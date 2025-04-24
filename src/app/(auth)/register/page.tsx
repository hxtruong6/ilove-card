'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Link, Stack, Text } from '@chakra-ui/react';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Stack gap={8} width="full">
        <RegisterForm />
      </Stack>
      <Stack direction="row" justifyContent="center" gap={2}>
        <Text>Already have an account?</Text>
        <Link href="/login" color="blue.500">
          Sign in
        </Link>
      </Stack>
    </AuthLayout>
  );
}
