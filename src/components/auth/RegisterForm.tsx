'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';

const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (data: RegisterFormValues) => {
    try {
      await registerUser(data.email, data.password);
    } catch (error) {
      // Error handling is already done in AuthContext
    }
  });

  return (
    <Stack gap={6} width="full">
      {/* Title */}
      <Stack gap={1} textAlign="center">
        <Text fontSize="4xl" fontWeight="bold" color="#5F9E34">
          Sign up!
        </Text>
        <Text fontSize="lg" color="gray.600">
          Create your Account
        </Text>
      </Stack>

      {/* Form */}
      <form onSubmit={onSubmit}>
        <Stack gap={4}>
          <Stack gap={4}>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              size="lg"
              bg="white"
              borderColor={errors.email ? 'red.500' : 'gray.200'}
              _hover={{ borderColor: errors.email ? 'red.500' : 'gray.300' }}
              _focus={{ borderColor: errors.email ? 'red.500' : '#04555A', boxShadow: 'none' }}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email.message}
              </Text>
            )}

            <Input
              {...register('password')}
              type="password"
              placeholder="Create your password"
              size="lg"
              bg="white"
              borderColor={errors.password ? 'red.500' : 'gray.200'}
              _hover={{ borderColor: errors.password ? 'red.500' : 'gray.300' }}
              _focus={{ borderColor: errors.password ? 'red.500' : '#04555A', boxShadow: 'none' }}
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm">
                {errors.password.message}
              </Text>
            )}

            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Verify your password"
              size="lg"
              bg="white"
              borderColor={errors.confirmPassword ? 'red.500' : 'gray.200'}
              _hover={{ borderColor: errors.confirmPassword ? 'red.500' : 'gray.300' }}
              _focus={{
                borderColor: errors.confirmPassword ? 'red.500' : '#04555A',
                boxShadow: 'none',
              }}
            />
            {errors.confirmPassword && (
              <Text color="red.500" fontSize="sm">
                {errors.confirmPassword.message}
              </Text>
            )}
          </Stack>

          <Button
            type="submit"
            size="lg"
            width="full"
            bg="#04555A"
            color="white"
            _hover={{ bg: '#034147' }}
            _active={{ bg: '#023138' }}
            loading={isSubmitting}
          >
            Sign up
          </Button>
        </Stack>
      </form>

      {/* Divider */}
      <Flex align="center" gap={3}>
        <Box flex={1} h="1px" bg="gray.200" />
        <Text color="gray.500">Or</Text>
        <Box flex={1} h="1px" bg="gray.200" />
      </Flex>

      {/* Google Sign In */}
      <Button
        size="lg"
        width="full"
        variant="outline"
        gap={2}
        onClick={() => {}}
        borderColor="gray.200"
        _hover={{ bg: 'gray.50' }}
      >
        <FcGoogle />
        Continue with Google
      </Button>
    </Stack>
  );
}
