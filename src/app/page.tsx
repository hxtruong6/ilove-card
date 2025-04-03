'use client';

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
      {/* Hero Section */}
      <Container maxW="container.xl" py={{ base: 12, md: 20 }}>
        <VStack gap={8} textAlign="center">
          <Heading
            as="h1"
            size={{ base: '2xl', md: '3xl' }}
            maxW="800px"
            lineHeight="1.2"
            color="brand.500"
          >
            Share Joy with iCard's Festive Tree Messages
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="600px">
            Create personalized festive trees and share messages with friends and family in a
            unique, interactive way.
          </Text>
          <HStack gap={4}>
            <Button
              asChild
              size="lg"
              colorScheme="brand"
              px={8}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" colorScheme="brand">
              <Link href="#features">Learn More</Link>
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Box bg="brand.500" py={{ base: 12, md: 20 }} id="features">
        <Container maxW="container.xl">
          <VStack gap={12}>
            <Heading as="h2" size="xl" color="white" textAlign="center">
              Why Choose iCard?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
              <FeatureCard
                title="Customizable Trees"
                description="Design festive trees with various themes and styles to match your celebration."
                icon={LuCheck}
              />
              <FeatureCard
                title="Interactive Messages"
                description="Add rich-text messages that bring your tree to life with personal touches."
                icon={LuCircle}
              />
              <FeatureCard
                title="Easy Sharing"
                description="Share your tree with unique links and collaborate in real-time."
                icon={LuShare}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Email Subscription Section */}
      <Container maxW="container.lg" py={{ base: 12, md: 20 }}>
        <VStack gap={6} bg={cardBg} p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Heading as="h2" size="xl" color="brand.500">
            Stay in the Loop
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="500px">
            Enter your email to receive updates about new features and festive templates!
          </Text>
          <form onSubmit={handleEmailSubmit}>
            <FieldRoot maxW="400px" mx="auto">
              <HStack>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  size="lg"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'brand.500' }}
                />
                <Button type="submit" colorScheme="brand" size="lg" loading={isSubmitting} px={6}>
                  Subscribe <LuMail />
                </Button>
              </HStack>
              <Field.Label mt={2}>We'll never share your email. Unsubscribe anytime.</Field.Label>
            </FieldRoot>
          </form>
        </VStack>
      </Container>

      {/* CTA Footer */}
      <Box bg="gray.100" py={12}>
        <Container maxW="container.md" textAlign="center">
          <VStack gap={6}>
            <Heading as="h3" size="lg">
              Ready to Spread Some Festive Cheer?
            </Heading>
            <Button
              asChild
              size="lg"
              colorScheme="brand"
              px={10}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <Link href="/register">Create Your Tree Now</Link>
            </Button>
          </VStack>
        </Container>
      </Box>
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
