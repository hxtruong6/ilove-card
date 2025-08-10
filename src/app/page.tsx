'use client';

import MainTreeSection from '@/components/pages/home/MainTreeSection';
import TreeUserInfoSection from '@/components/pages/home/TreeUserInfoSection';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Field,
  FieldRoot,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuCheck, LuCircle, LuMail, LuShare } from 'react-icons/lu';
import { toast } from 'sonner';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to subscribe email
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("You'll be notified about iCard updates.");
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading or authenticated, don't render the landing page content
  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <TreeUserInfoSection />
      <MainTreeSection />
    </Box>
  );
}

// Feature Card Component
function FeatureCard({
  title,
  description,
  icon: IconComponent,
}: {
  title: string;
  description: string;
  icon: React.ComponentType;
}) {
  return (
    <VStack
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="sm"
      gap={4}
      align="start"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
    >
      <Icon boxSize={8} color="brand.500">
        <IconComponent />
      </Icon>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.800">
          {title}
        </Text>
        <Text color="gray.600">{description}</Text>
      </Box>
    </VStack>
  );
}
