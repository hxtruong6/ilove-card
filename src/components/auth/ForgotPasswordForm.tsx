'use client';

import { validateEmail } from '@/lib/auth';
import { Box, Button, Field, Input, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine(validateEmail, 'Invalid email format'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset password email');
      }

      toast.success('Reset link sent', {
        description: 'Check your email for instructions to reset your password.',
        duration: 5000,
      });

      // Redirect to login page after successful submission
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={6}>
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email address</Field.Label>
          <Input id="email" type="email" placeholder="Enter your email" {...register('email')} />
          <Field.ErrorText>{errors.email && errors.email.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          colorScheme="blue"
          w="full"
          loading={isLoading}
          loadingText="Sending..."
        >
          Send Reset Link
        </Button>
      </Stack>
    </Box>
  );
}
