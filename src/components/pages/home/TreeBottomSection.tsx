'use client';

import { Box, HStack, IconButton } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight, LuMessageCircle, LuShare2 } from 'react-icons/lu';

/**
 * TreeBottomSection component that displays pagination controls, share icons, and chat icons
 * at the bottom of the main tree section.
 */
const TreeBottomSection: React.FC = () => {
  return (
    <Box
      w="full"
      py={4}
      px={6}
      bg="neutral.50"
      borderLeft="4px solid"
      borderRight="4px solid"
      borderColor="skyBlue.300"
      borderRadius="lg"
    >
      <HStack justify="space-between" align="center" gap={4}>
        {/* Share Icon */}
        <Box>
          <IconButton
            aria-label="Share tree"
            variant="ghost"
            color="terracotta.500"
            size="lg"
            _hover={{ bg: 'terracotta.100' }}
          >
            <LuShare2 />
          </IconButton>
        </Box>

        {/* Pagination Component */}
        <Box>
          <HStack gap={2}>
            <IconButton
              aria-label="Previous page"
              variant="outline"
              borderColor="primary.400"
              color="primary.600"
              bg="white"
              _hover={{ bg: 'primary.50' }}
              size="sm"
            >
              <LuChevronLeft />
            </IconButton>

            <IconButton aria-label="Page 2" variant="solid" colorScheme="primary" size="sm">
              2
            </IconButton>

            <IconButton
              aria-label="Next page"
              variant="outline"
              borderColor="primary.400"
              color="primary.600"
              bg="white"
              _hover={{ bg: 'primary.50' }}
              size="sm"
            >
              <LuChevronRight />
            </IconButton>
          </HStack>
        </Box>

        {/* Chat Icons */}
        <Box position="relative">
          <HStack gap={-2}>
            <IconButton
              aria-label="Chat messages"
              variant="ghost"
              color="primary.500"
              size="lg"
              bg="primary.100"
              _hover={{ bg: 'primary.200' }}
              zIndex={2}
            >
              <LuMessageCircle />
            </IconButton>
            <IconButton
              aria-label="New messages"
              variant="ghost"
              color="terracotta.500"
              size="lg"
              bg="terracotta.100"
              _hover={{ bg: 'terracotta.200' }}
              zIndex={1}
              transform="translateX(-8px)"
            >
              <LuMessageCircle />
            </IconButton>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default TreeBottomSection;
