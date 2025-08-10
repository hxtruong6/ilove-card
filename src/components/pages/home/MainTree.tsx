import ImageIcon from '@/components/ui/icons/ImageIcon';
import { ICON_PATH } from '@/lib/constants';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState } from 'react';

interface Decoration {
  id: string;
  name: string;
  iconPath: string;
  position: { x: number; y: number };
  userName: string;
}

interface MainTreeSectionProps {
  decorations?: Decoration[];
  onDecorationClick?: (decoration: Decoration) => void;
  onAddDecoration?: () => void;
}

/**
 * Main tree section component that displays a Christmas tree with hanging decorations
 * @param decorations - Array of decorations to display on the tree
 * @param onDecorationClick - Callback when a decoration is clicked
 * @param onAddDecoration - Callback to add a new decoration
 */
export const MainTree: React.FC<MainTreeSectionProps> = ({
  decorations = [],
  onDecorationClick,
  onAddDecoration,
}) => {
  const [hoveredDecoration, setHoveredDecoration] = useState<string | null>(null);

  // Predefined decoration positions on the tree (percentage-based)
  const decorationPositions = [
    // { x: 50, y: 15 }, // Top - Star area
    // { x: 30, y: 25 }, // Upper left
    // { x: 70, y: 25 }, // Upper right
    { x: 25, y: 40 }, // Middle left
    { x: 50, y: 40 }, // Middle center
    { x: 75, y: 40 }, // Middle right
    { x: 20, y: 55 }, // Lower left
    { x: 40, y: 55 }, // Lower left center
    { x: 60, y: 55 }, // Lower right center
    { x: 80, y: 55 }, // Lower right
    { x: 35, y: 70 }, // Bottom left
    { x: 65, y: 70 }, // Bottom right
  ];

  return (
    <Box
      position="relative"
      w="full"
      maxW="600px"
      mx="auto"
      p={6}
      bg="white"
      borderRadius="xl"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.100"
    >
      {/* Tree Container */}
      <Box position="relative" w="full" h="500px">
        {/* Main Tree */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="300px"
          h="400px"
        >
          <Image
            src={ICON_PATH.TREES.TREE_1}
            alt="Main Christmas Tree"
            width={300}
            height={400}
            objectFit="contain"
            priority
          />
        </Box>

        {/* Tree Star/Topper */}
        <Box position="absolute" top="8%" left="50%" transform="translateX(-50%)" w="40px" h="40px">
          <ImageIcon src={ICON_PATH.ORNAMENT} alt="Tree Star" size="100%" objectFit="contain" />
        </Box>

        {/* Decorations */}
        {decorations.map((decoration, index) => {
          const position = decorationPositions[index % decorationPositions.length];

          return (
            <Box
              borderRadius="md"
              border="1px solid"
              borderColor="gray.300"
              p={2}
              key={decoration.id}
              position="absolute"
              top={`${position.y}%`}
              left={`${position.x}%`}
              transform="translate(-50%, -50%)"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translate(-50%, -50%) scale(1.1)',
                zIndex: 10,
              }}
              onMouseEnter={() => setHoveredDecoration(decoration.id)}
              onMouseLeave={() => setHoveredDecoration(null)}
              onClick={() => onDecorationClick?.(decoration)}
            >
              {/* Decoration Icon */}
              <Box position="relative">
                <ImageIcon
                  src={decoration.iconPath}
                  alt={decoration.name}
                  size="40px"
                  objectFit="contain"
                />

                {/* User Name Label */}
                <Text
                  position="absolute"
                  bottom="-20px"
                  left="50%"
                  transform="translateX(-50%)"
                  fontSize="xs"
                  fontWeight="medium"
                  color="white"
                  textShadow="1px 1px 2px rgba(0,0,0,0.8)"
                  whiteSpace="nowrap"
                  opacity={hoveredDecoration === decoration.id ? 1 : 0.8}
                  transition="opacity 0.2s"
                >
                  {decoration.userName}
                </Text>
              </Box>
            </Box>
          );
        })}

        {/* Add Decoration Button */}
        {/* {onAddDecoration && (
          <Button
            position="absolute"
            bottom="4"
            right="4"
            size="sm"
            colorScheme="teal"
            borderRadius="full"
            onClick={onAddDecoration}
            boxShadow="md"
            _hover={{
              transform: 'scale(1.05)',
            }}
          >
            + Add Decoration
          </Button>
        )} */}
      </Box>
    </Box>
  );
};

export default MainTree;
