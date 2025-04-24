import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - iLove Card',
  description: 'Reset your password to access your iLove Card account',
};

export default function ForgotPasswordPage() {
  return (
    <Container maxW="container.sm" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl" mb={4}>
          Forgot Password
        </Heading>
        <Text color="gray.600">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Text>
      </Box>
      <ForgotPasswordForm />
    </Container>
  );
}
