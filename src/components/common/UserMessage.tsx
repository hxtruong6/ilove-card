'use client';

import { useColorModeValue } from '@/components/ui/color-mode';
import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaEllipsisH } from 'react-icons/fa';

interface UserMessageProps {
  message: string;
  author: string;
  timestamp: string;
  decoration?: {
    type: 'holly' | 'pine' | 'berries' | 'ribbon';
    color?: string;
  };
  isSelected?: boolean;
  onMenuClick?: () => void;
  onMessageClick?: () => void;
  decorationUrl?: string;
}

/**
 * UserMessage component for displaying messages with decorations on the tree
 * Matches the watercolor-style design with festive decorations
 */
export default function UserMessage({
  message,
  author,
  timestamp,
  decoration = { type: 'holly' },
  decorationUrl,
  isSelected = false,
  onMenuClick,
  onMessageClick,
}: UserMessageProps) {
  const cardBg = useColorModeValue('white', 'gray.50');
  const borderColor = useColorModeValue('teal.600', 'teal.400');
  const textColor = useColorModeValue('teal.700', 'teal.300');
  const timestampColor = useColorModeValue('gray.500', 'gray.400');
  const tagBg = useColorModeValue('red.700', 'red.600');
  const menuColor = useColorModeValue('gray.400', 'gray.500');

  const renderDecoration = () => {
    switch (decoration.type) {
      case 'holly':
        return (
          <Box position="relative" w="60px" h="40px">
            {/* Holly leaves */}
            <Box
              position="absolute"
              top="5px"
              left="10px"
              w="20px"
              h="12px"
              bg="linear-gradient(135deg, #4ade80 0%, #059669 100%)"
              borderRadius="50% 50% 0 50%"
              transform="rotate(-15deg)"
            />
            <Box
              position="absolute"
              top="8px"
              left="25px"
              w="18px"
              h="10px"
              bg="linear-gradient(135deg, #22c55e 0%, #047857 100%)"
              borderRadius="50% 50% 0 50%"
              transform="rotate(15deg)"
            />
            <Box
              position="absolute"
              top="15px"
              left="15px"
              w="16px"
              h="8px"
              bg="linear-gradient(135deg, #16a34a 0%, #065f46 100%)"
              borderRadius="50% 50% 0 50%"
              transform="rotate(-5deg)"
            />
            {/* Red berries */}
            <Box
              position="absolute"
              top="12px"
              right="8px"
              w="8px"
              h="8px"
              bg="red.500"
              borderRadius="50%"
            />
            <Box
              position="absolute"
              top="18px"
              right="15px"
              w="6px"
              h="6px"
              bg="red.400"
              borderRadius="50%"
            />
            <Box
              position="absolute"
              top="22px"
              right="5px"
              w="7px"
              h="7px"
              bg="red.600"
              borderRadius="50%"
            />
          </Box>
        );
      case 'pine':
        return (
          <Box position="relative" w="60px" h="40px">
            {/* Pine needles */}
            <Box
              position="absolute"
              top="5px"
              left="15px"
              w="30px"
              h="25px"
              bg="linear-gradient(135deg, #059669 0%, #047857 100%)"
              clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
            />
            <Box
              position="absolute"
              top="15px"
              left="10px"
              w="40px"
              h="20px"
              bg="linear-gradient(135deg, #047857 0%, #065f46 100%)"
              clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
            />
          </Box>
        );
      case 'berries':
        return (
          <Box position="relative" w="60px" h="40px">
            {/* Berry clusters */}
            <Box
              position="absolute"
              top="8px"
              left="15px"
              w="12px"
              h="12px"
              bg="red.500"
              borderRadius="50%"
            />
            <Box
              position="absolute"
              top="12px"
              left="25px"
              w="10px"
              h="10px"
              bg="red.400"
              borderRadius="50%"
            />
            <Box
              position="absolute"
              top="18px"
              left="20px"
              w="8px"
              h="8px"
              bg="red.600"
              borderRadius="50%"
            />
            <Box
              position="absolute"
              top="22px"
              left="10px"
              w="9px"
              h="9px"
              bg="red.500"
              borderRadius="50%"
            />
          </Box>
        );
      case 'ribbon':
        return (
          <Box position="relative" w="60px" h="40px">
            {/* Ribbon bow */}
            <Box
              position="absolute"
              top="10px"
              left="20px"
              w="20px"
              h="12px"
              bg="red.500"
              borderRadius="8px 8px 0 0"
            />
            <Box
              position="absolute"
              top="22px"
              left="20px"
              w="20px"
              h="8px"
              bg="red.600"
              borderRadius="0 0 8px 8px"
            />
            <Box
              position="absolute"
              top="15px"
              left="15px"
              w="8px"
              h="10px"
              bg="red.400"
              borderRadius="4px"
            />
            <Box
              position="absolute"
              top="15px"
              right="15px"
              w="8px"
              h="10px"
              bg="red.400"
              borderRadius="4px"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      position="relative"
      w="full"
      maxW="400px"
      cursor={onMessageClick ? 'pointer' : 'default'}
      onClick={onMessageClick}
    >
      {/* Watercolor Background */}
      <Box
        position="absolute"
        top="-20px"
        left="-20px"
        right="-20px"
        bottom="-20px"
        bg="linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #fef2f2 100%)"
        borderRadius="xl"
        opacity={0.3}
        zIndex={-1}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 20%, rgba(134, 239, 172, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(254, 240, 138, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 60%, rgba(254, 202, 202, 0.1) 0%, transparent 50%)
          `,
          borderRadius: 'inherit',
        }}
      />

      {/* Author Tag */}
      <Box
        position="absolute"
        top="-10px"
        left="20px"
        bg={tagBg}
        color="white"
        px={3}
        py={1}
        borderRadius="md"
        fontSize="sm"
        fontWeight="medium"
        zIndex={2}
      >
        by {author}
      </Box>

      {/* Menu Button */}
      {onMenuClick && (
        <IconButton
          position="absolute"
          top="-15px"
          right="-15px"
          size="sm"
          variant="ghost"
          color={menuColor}
          bg="gray.100"
          borderRadius="md"
          onClick={e => {
            e.stopPropagation();
            onMenuClick();
          }}
          aria-label="Message options"
          zIndex={2}
        >
          <FaEllipsisH />
        </IconButton>
      )}

      {/* Message Card */}
      <Box
        bg={cardBg}
        border="2px solid"
        borderColor={borderColor}
        borderRadius="xl"
        p={4}
        position="relative"
        boxShadow="md"
        _before={
          isSelected
            ? {
                content: '""',
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                border: '2px dashed',
                borderColor: 'blue.400',
                borderRadius: 'xl',
                zIndex: -1,
              }
            : undefined
        }
      >
        <HStack gap={4} align="flex-start">
          {/* Decorative Illustration */}
          <Box flexShrink={0} mt={2}>
            {renderDecoration()}
          </Box>

          {/* Message Content */}
          <VStack gap={2} align="flex-start" flex={1}>
            {/* Timestamp */}
            <Text fontSize="xs" color={timestampColor} fontWeight="normal" alignSelf="flex-end">
              {timestamp}
            </Text>

            {/* Message Text */}
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="medium"
              fontStyle="italic"
              lineHeight="1.5"
              wordBreak="break-word"
            >
              {message}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}
