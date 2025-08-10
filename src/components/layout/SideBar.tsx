'use client';

import { useColorModeValue } from '@/components/ui/color-mode';
import { Box, Button, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaArrowRight, FaCog, FaTree, FaUser, FaUsers } from 'react-icons/fa';

interface SideBarProps {
  userName?: string;
  onNavigate?: (route: string) => void;
  isOpen?: boolean;
}

/**
 * SideBar component with watercolor banner and navigation menu
 * Matches the design with "Save your Memories" banner and menu items
 */
export default function SideBar({ userName = 'Aidan', onNavigate, isOpen = true }: SideBarProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('black', 'white');

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <Box
      as="aside"
      bg={bgColor}
      h="100vh"
      w={isOpen ? '280px' : '0'}
      overflow="hidden"
      transition="width 0.3s ease"
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
      left="0"
      top="0"
      zIndex="sidebar"
    >
      <VStack gap={0} h="full" align="stretch">
        {/* Watercolor Banner Section */}
        <Box
          bg="linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #fef2f2 100%)"
          p={6}
          position="relative"
          border="2px solid"
          borderColor={borderColor}
          borderRadius="0 0 12px 12px"
          minH="120px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(134, 239, 172, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(254, 240, 138, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(254, 202, 202, 0.2) 0%, transparent 50%)
            `,
            borderRadius: 'inherit',
            pointerEvents: 'none',
          }}
        >
          {/* Decorative tree branches */}
          <Box
            position="absolute"
            top="10px"
            left="10px"
            w="60px"
            h="40px"
            opacity={0.6}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              w: '100%',
              h: '100%',
              background: `
                radial-gradient(ellipse at 30% 50%, #059669 0%, transparent 70%),
                radial-gradient(ellipse at 70% 30%, #4ade80 0%, transparent 70%)
              `,
              borderRadius: '50%',
            }}
          />

          <Box
            position="absolute"
            top="5px"
            right="15px"
            w="40px"
            h="30px"
            opacity={0.5}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              w: '100%',
              h: '100%',
              background: `
                radial-gradient(ellipse at 40% 60%, #86efac 0%, transparent 70%),
                radial-gradient(ellipse at 60% 40%, #bbf7d0 0%, transparent 70%)
              `,
              borderRadius: '50%',
            }}
          />

          {/* Main Text */}
          <VStack gap={0} position="relative" zIndex={1}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={textColor}
              fontFamily="Georgia, serif"
              textAlign="center"
              lineHeight="1.2"
            >
              Save
            </Text>
            <Text
              fontSize="lg"
              fontWeight="medium"
              color={textColor}
              fontFamily="Georgia, serif"
              textAlign="center"
              lineHeight="1.2"
            >
              your
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={textColor}
              fontFamily="Georgia, serif"
              textAlign="center"
              lineHeight="1.2"
            >
              Memories
            </Text>
          </VStack>
        </Box>

        {/* Navigation Menu Section */}
        <VStack gap={4} p={6} flex={1} align="stretch">
          {/* Menu Items */}
          <VStack gap={3} align="stretch">
            {/* My Tree */}
            <Button
              variant="ghost"
              justifyContent="flex-start"
              h="auto"
              p={3}
              borderRadius="lg"
              _hover={{ bg: 'gray.50' }}
              onClick={() => handleNavigation('/trees')}
            >
              <HStack gap={3}>
                <Box
                  w="24px"
                  h="24px"
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaTree} color="green.500" w="20px" h="20px" />
                  {/* Red ornaments */}
                  <Box
                    position="absolute"
                    top="2px"
                    right="2px"
                    w="6px"
                    h="6px"
                    bg="red.400"
                    borderRadius="50%"
                  />
                  <Box
                    position="absolute"
                    bottom="4px"
                    left="4px"
                    w="4px"
                    h="4px"
                    bg="red.400"
                    borderRadius="50%"
                  />
                </Box>
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  My tree
                </Text>
              </HStack>
            </Button>

            {/* Friends */}
            <Button
              variant="ghost"
              justifyContent="flex-start"
              h="auto"
              p={3}
              borderRadius="lg"
              _hover={{ bg: 'gray.50' }}
              onClick={() => handleNavigation('/friends')}
            >
              <HStack gap={3}>
                <Box position="relative">
                  <Icon as={FaUsers} color="blue.600" w="20px" h="20px" />
                  {/* Green checkmark */}
                  <Box
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    w="8px"
                    h="8px"
                    bg="green.400"
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box w="4px" h="2px" bg="white" borderRadius="1px" transform="rotate(-45deg)" />
                  </Box>
                </Box>
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  Friends
                </Text>
              </HStack>
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              justifyContent="flex-start"
              h="auto"
              p={3}
              borderRadius="lg"
              _hover={{ bg: 'gray.50' }}
              onClick={() => handleNavigation('/settings')}
            >
              <HStack gap={3}>
                <Icon as={FaCog} color="blue.600" w="20px" h="20px" />
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  Settings
                </Text>
              </HStack>
            </Button>
          </VStack>

          {/* Spacer */}
          <Box flex={1} />

          {/* User Profile Section */}
          <VStack gap={3} align="stretch">
            <Button
              variant="outline"
              justifyContent="flex-start"
              h="auto"
              p={3}
              borderRadius="lg"
              borderColor="blue.600"
              borderWidth="1px"
              _hover={{ bg: 'blue.50' }}
              onClick={() => handleNavigation('/profile')}
            >
              <HStack gap={3}>
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="50%"
                  bg="linear-gradient(135deg, #4ade80 0%, #059669 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                >
                  <Icon as={FaUser} color="white" w="16px" h="16px" />
                  {/* Hair detail */}
                  <Box
                    position="absolute"
                    top="2px"
                    left="50%"
                    transform="translateX(-50%)"
                    w="12px"
                    h="4px"
                    bg="brown.600"
                    borderRadius="2px"
                  />
                </Box>
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  Hi. {userName}
                </Text>
              </HStack>
            </Button>

            {/* Navigation Arrow */}
            <Button
              variant="ghost"
              size="sm"
              w="40px"
              h="40px"
              p={0}
              borderRadius="md"
              bg="gray.100"
              _hover={{ bg: 'gray.200' }}
              onClick={() => handleNavigation('/next')}
            >
              <Icon as={FaArrowRight} color="black" w="14px" h="14px" />
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
