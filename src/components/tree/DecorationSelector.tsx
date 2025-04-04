'use client';

import { Box, Grid, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import { useState } from 'react';

interface DecorationSelectorProps {
  onSelect: (decoration: string) => void;
  selectedDecoration?: string;
}

/**
 * DecorationSelector component for selecting a decoration for a message
 * Displays a grid of available decorations from the public/images/decorations directory
 */
export function DecorationSelector({ onSelect, selectedDecoration }: DecorationSelectorProps) {
  const [hoveredDecoration, setHoveredDecoration] = useState<string | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // List of available decorations
  const decorations = [
    { id: 'Decor-01', name: 'Decoration 1', path: '/images/decorations/Decor-01.png' },
    { id: 'Decor-02', name: 'Decoration 2', path: '/images/decorations/Decor-02.png' },
    { id: 'Decor-03', name: 'Decoration 3', path: '/images/decorations/Decor-03.png' },
    { id: 'Decor-04', name: 'Decoration 4', path: '/images/decorations/Decor-04.png' },
    { id: 'Decor-05', name: 'Decoration 5', path: '/images/decorations/Decor-05.png' },
    { id: 'Decor-06', name: 'Decoration 6', path: '/images/decorations/Decor-06.png' },
    { id: 'Decor-07', name: 'Decoration 7', path: '/images/decorations/Decor-07.png' },
    { id: 'Decor-08', name: 'Decoration 8', path: '/images/decorations/Decor-08.png' },
    { id: 'Decor-09', name: 'Decoration 9', path: '/images/decorations/Decor-09.png' },
    { id: 'Decor-10', name: 'Decoration 10', path: '/images/decorations/Decor-10.png' },
  ];

  return (
    <Box w="100%">
      <Text mb={2} fontWeight="medium">
        Select a decoration:
      </Text>
      <Grid
        templateColumns={isMobile ? 'repeat(5, 1fr)' : 'repeat(10, 1fr)'}
        gap={2}
        maxH="120px"
        overflowY="auto"
        p={2}
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
      >
        {decorations.map(decoration => (
          <Box
            key={decoration.id}
            position="relative"
            cursor="pointer"
            onClick={() => onSelect(decoration.id)}
            onMouseEnter={() => setHoveredDecoration(decoration.id)}
            onMouseLeave={() => setHoveredDecoration(null)}
            transition="all 0.2s"
            transform={selectedDecoration === decoration.id ? 'scale(1.1)' : 'scale(1)'}
            _hover={{ transform: 'scale(1.1)' }}
            boxShadow={selectedDecoration === decoration.id ? 'md' : 'none'}
            borderRadius="md"
            p={1}
            bg={selectedDecoration === decoration.id ? 'gray.100' : 'transparent'}
          >
            <Image
              src={decoration.path}
              alt={decoration.name}
              w="100%"
              h="auto"
              objectFit="contain"
            />
            {hoveredDecoration === decoration.id && (
              <Text
                position="absolute"
                bottom="-20px"
                left="50%"
                transform="translateX(-50%)"
                fontSize="xs"
                bg="blackAlpha.700"
                color="white"
                px={1}
                py={0.5}
                borderRadius="sm"
                whiteSpace="nowrap"
              >
                {decoration.name}
              </Text>
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
