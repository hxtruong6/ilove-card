import { ImageIcon } from '@/components/ui/icons/ImageIcon';
import { MessageIcon } from '@/components/ui/icons/MessageIcon';
import { ICON_PATH } from '@/lib/constants';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

/**
 * Example usage of ImageIcon component with different image formats
 */
export const ImageIconExample: React.FC = () => {
  return (
    <Box p={6} maxW="800px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        ImageIcon Component Examples
      </Text>

      <VStack gap={8} align="stretch">
        {/* SVG Icons */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            SVG Icons
          </Text>
          <HStack gap={4} flexWrap="wrap">
            <VStack>
              <ImageIcon src={ICON_PATH.MESSAGE} alt="Message icon" size={32} />
              <Text fontSize="sm">Message (SVG)</Text>
            </VStack>
            <VStack>
              <ImageIcon src={ICON_PATH.ORNAMENT} alt="Ornament icon" size={32} />
              <Text fontSize="sm">Ornament (SVG)</Text>
            </VStack>
          </HStack>
        </Box>

        {/* PNG Icons */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            PNG Icons
          </Text>
          <HStack gap={4} flexWrap="wrap">
            <VStack>
              <ImageIcon src={ICON_PATH.TREE} alt="Tree icon" size={32} />
              <Text fontSize="sm">Tree (PNG)</Text>
            </VStack>
            <VStack>
              <ImageIcon src={ICON_PATH.TREE_WITH_MESSAGE} alt="Tree with message icon" size={32} />
              <Text fontSize="sm">Tree with Message (PNG)</Text>
            </VStack>
            <VStack>
              <ImageIcon src={ICON_PATH.SETTINGS} alt="Settings icon" size={32} />
              <Text fontSize="sm">Settings (PNG)</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Decoration Icons */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Decoration Icons
          </Text>
          <HStack gap={4} flexWrap="wrap">
            {Object.entries(ICON_PATH.DECORATIONS)
              .slice(0, 5)
              .map(([key, path]) => (
                <VStack key={key}>
                  <ImageIcon src={path} alt={`Decoration ${key}`} size={40} />
                  <Text fontSize="sm">{key}</Text>
                </VStack>
              ))}
          </HStack>
        </Box>

        {/* Different Sizes */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Different Sizes
          </Text>
          <HStack gap={4} align="center">
            <VStack>
              <ImageIcon src={ICON_PATH.MESSAGE} alt="Small message icon" size={16} />
              <Text fontSize="sm">16px</Text>
            </VStack>
            <VStack>
              <ImageIcon src={ICON_PATH.MESSAGE} alt="Medium message icon" size={24} />
              <Text fontSize="sm">24px</Text>
            </VStack>
            <VStack>
              <ImageIcon src={ICON_PATH.MESSAGE} alt="Large message icon" size={48} />
              <Text fontSize="sm">48px</Text>
            </VStack>
            <VStack>
              <ImageIcon src={ICON_PATH.MESSAGE} alt="Extra large message icon" size={64} />
              <Text fontSize="sm">64px</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Enhanced MessageIcon */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Enhanced MessageIcon Component
          </Text>
          <HStack gap={4} align="center">
            <VStack>
              <MessageIcon size={32} />
              <Text fontSize="sm">React Icons</Text>
            </VStack>
            <VStack>
              <MessageIcon size={32} useCustomIcon={true} />
              <Text fontSize="sm">Custom SVG</Text>
            </VStack>
            <VStack>
              <MessageIcon size={32} useCustomIcon={true} customIconPath={ICON_PATH.MESSAGE_ALT} />
              <Text fontSize="sm">Custom PNG</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Error Handling with Fallback */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Error Handling with Fallback
          </Text>
          <HStack gap={4} align="center">
            <VStack>
              <ImageIcon
                src="/non-existent-image.svg"
                alt="Non-existent icon"
                size={32}
                fallbackSrc={ICON_PATH.MESSAGE}
              />
              <Text fontSize="sm">With Fallback</Text>
            </VStack>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ImageIconExample;
