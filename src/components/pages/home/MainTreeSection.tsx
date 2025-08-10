import { ICON_PATH } from '@/lib/constants';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { LuPlus, LuTrash } from 'react-icons/lu';
import { toast } from 'sonner';

import MainTreeSection from './MainTree';

/**
 * Example usage of MainTreeSection component with sample decorations
 */
export const MainTreeSectionSection: React.FC = () => {
  const [decorations, setDecorations] = useState([
    {
      id: '1',
      name: 'Santa Hat',
      iconPath: ICON_PATH.DECORATIONS.DECOR_01,
      position: { x: 30, y: 25 },
      userName: 'Michael',
    },
    {
      id: '2',
      name: 'Hot Chocolate Mug',
      iconPath: ICON_PATH.DECORATIONS.DECOR_02,
      position: { x: 70, y: 25 },
      userName: 'Alex',
    },
    {
      id: '3',
      name: 'Snowman',
      iconPath: ICON_PATH.DECORATIONS.DECOR_03,
      position: { x: 25, y: 40 },
      userName: 'Join',
    },
    {
      id: '4',
      name: 'Jingle Bells',
      iconPath: ICON_PATH.DECORATIONS.DECOR_04,
      position: { x: 50, y: 40 },
      userName: 'Michael',
    },
    {
      id: '5',
      name: 'Holly',
      iconPath: ICON_PATH.DECORATIONS.DECOR_05,
      position: { x: 75, y: 40 },
      userName: 'Aidan',
    },
    {
      id: '6',
      name: 'Christmas Stocking',
      iconPath: ICON_PATH.DECORATIONS.DECOR_06,
      position: { x: 20, y: 55 },
      userName: 'Luke',
    },
    {
      id: '7',
      name: 'Candy Canes',
      iconPath: ICON_PATH.DECORATIONS.DECOR_07,
      position: { x: 40, y: 55 },
      userName: 'Michael',
    },
    {
      id: '8',
      name: 'Pinecone',
      iconPath: ICON_PATH.DECORATIONS.DECOR_08,
      position: { x: 60, y: 55 },
      userName: 'Amiee',
    },
    {
      id: '9',
      name: 'Gingerbread Cookie',
      iconPath: ICON_PATH.DECORATIONS.DECOR_09,
      position: { x: 80, y: 55 },
      userName: 'Michael',
    },
    {
      id: '10',
      name: 'Photo',
      iconPath: ICON_PATH.DECORATIONS.DECOR_10,
      position: { x: 35, y: 70 },
      userName: 'Michael',
    },
  ]);

  const handleDecorationClick = (decoration: any) => {
    toast.info(`${decoration.name} by ${decoration.userName}`);
  };

  const handleAddDecoration = () => {
    const newDecoration = {
      id: Date.now().toString(),
      name: 'New Decoration',
      iconPath: ICON_PATH.DECORATIONS.DECOR_01,
      position: { x: 50, y: 50 },
      userName: 'You',
    };

    setDecorations(prev => [...prev, newDecoration]);

    toast.success('Decoration Added!');
  };

  const handleRemoveDecoration = () => {
    if (decorations.length > 0) {
      setDecorations(prev => prev.slice(0, -1));

      toast.warning('Decoration Removed!');
    }
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack gap={6} align="stretch">
        {/* Controls */}
        <HStack justify="center" gap={4}>
          <Button colorScheme="teal" onClick={handleAddDecoration}>
            <LuPlus />
            Add Decoration
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={handleRemoveDecoration}
            disabled={decorations.length === 0}
          >
            <LuTrash />
            Remove Last
          </Button>
        </HStack>

        {/* Tree Section */}
        <MainTreeSection
          decorations={decorations}
          onDecorationClick={handleDecorationClick}
          onAddDecoration={handleAddDecoration}
        />
      </VStack>
    </Box>
  );
};

export default MainTreeSectionSection;
