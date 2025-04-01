import { Box, Container, Flex, Image } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

/**
 * Layout component for authentication pages (login/register)
 */
export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Container maxW="lg" py={{ base: 12, md: 24 }}>
        <Box bg="white" p={8} shadow="lg" rounded="lg" border="1px" borderColor="gray.100">
          <Flex direction="column" align="center" mb={8}>
            <Box position="relative" w={16} h={16} mb={4}>
              <Image src="/images/logo.png" alt="Logo" w="full" h="full" objectFit="cover" />
            </Box>
            <Box as="h1" fontSize="2xl" fontWeight="bold" textAlign="center" color="gray.900">
              {title}
            </Box>
          </Flex>
          {children}
        </Box>
      </Container>
    </Flex>
  );
}
