'use client';

import { Box, Container, Flex, HStack, Link, Stack, Text } from '@chakra-ui/react';
import { FiGithub, FiInstagram, FiTwitter } from 'react-icons/fi';

import { useColorModeValue } from '../ui/color-mode';

export function Footer() {
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      as="footer"
      bg={useColorModeValue('white', 'gray.900')}
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      py={8}
    >
      <Container maxW="container.xl">
        <Stack gap={8}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              iCard
            </Text>
            <HStack gap={6}>
              <Link href="/about" color={textColor}>
                About
              </Link>
              <Link href="/privacy" color={textColor}>
                Privacy Policy
              </Link>
              <Link href="/terms" color={textColor}>
                Terms of Service
              </Link>
            </HStack>
            <HStack gap={4}>
              <Link
                href="https://twitter.com/icard"
                target="_blank"
                color={textColor}
                _hover={{ color: 'teal.500' }}
              >
                <FiTwitter size={20} />
              </Link>
              <Link
                href="https://instagram.com/icard"
                target="_blank"
                color={textColor}
                _hover={{ color: 'teal.500' }}
              >
                <FiInstagram size={20} />
              </Link>
              <Link
                href="https://github.com/icard"
                color={textColor}
                _hover={{ color: 'teal.500' }}
                target="_blank"
              >
                <FiGithub size={20} />
              </Link>
            </HStack>
          </Flex>
          <Text color={textColor} textAlign="center" fontSize="sm">
            © {new Date().getFullYear()} iCard. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
