'use client';

import { Message, Tree } from '@/types/tree.interface';
import {
  Box,
  Center,
  Flex,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';

interface TreeCanvasProps {
  tree: Tree;
  onAddMessage?: () => void;
}

/**
 * TreeCanvas component displays a festive tree with message cards as decorations.
 * It supports different themes and is designed with a mobile-first approach.
 */
export function TreeCanvas({ tree, onAddMessage }: TreeCanvasProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (tree.theme) {
      case 'christmas':
        return {
          treeColor: 'teal',
          decorations: ['snowman', 'gingerbread', 'gift', 'ornament', 'bell'],
          bgGradient: 'linear(to-b, blue.900, black)',
        };
      case 'birthday':
        return {
          treeColor: 'pink',
          decorations: ['balloon', 'cake', 'gift', 'star', 'confetti'],
          bgGradient: 'linear(to-b, purple.900, black)',
        };
      case 'valentine':
        return {
          treeColor: 'red',
          decorations: ['heart', 'rose', 'chocolate', 'cupid', 'love'],
          bgGradient: 'linear(to-b, red.900, black)',
        };
      case 'easter':
        return {
          treeColor: 'yellow',
          decorations: ['egg', 'bunny', 'chick', 'flower', 'basket'],
          bgGradient: 'linear(to-b, green.900, black)',
        };
      case 'halloween':
        return {
          treeColor: 'orange',
          decorations: ['pumpkin', 'ghost', 'bat', 'witch', 'spider'],
          bgGradient: 'linear(to-b, gray.900, black)',
        };
      default:
        return {
          treeColor: 'teal',
          decorations: ['ornament', 'gift', 'star', 'bell', 'heart'],
          bgGradient: 'linear(to-b, blue.900, black)',
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Get decoration image path
  const getDecorationImage = (decoration: string) => {
    // If the message has a decoration property, use it
    if (decoration) {
      return `/images/decorations/${decoration}.png`;
    }

    // Fallback to theme-based decoration
    const decorations = themeStyles.decorations;
    const randomDecoration = decorations[Math.floor(Math.random() * decorations.length)];
    return `/images/tree/${randomDecoration}.svg`;
  };

  // Render a snowflake for the background
  const SnowFlake = () => (
    <motion.div
      style={{ position: 'absolute', top: '-10px', left: `${Math.random() * 100}%` }}
      animate={{ y: '100vh', opacity: 0 }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      ❄️
    </motion.div>
  );

  // Render a message card
  const MessageCard = ({ message, index }: { message: Message; index: number }) => {
    // Use the decoration from the message if available, otherwise use a random one
    const decoration = (message as any).decoration || null;
    const isHovered = hoveredMessage === message.id;

    // Calculate position based on index and mobile/desktop
    const position = isMobile
      ? { top: `${(index % 5) * 15 + 10}%`, left: `${(index % 3) * 30 + 10}%` }
      : { top: `${(index % 5) * 15 + 10}%`, left: `${(index % 3) * 30 + 10}%` };

    return (
      <motion.div
        style={{
          position: 'absolute',
          ...position,
          zIndex: 10,
        }}
        whileHover={{ scale: 1.1 }}
        onHoverStart={() => setHoveredMessage(message.id)}
        onHoverEnd={() => setHoveredMessage(null)}
      >
        <Box
          w={{ base: '40px', md: '50px' }}
          h={{ base: '40px', md: '50px' }}
          borderRadius="full"
          bg={`${themeStyles.treeColor}.200`}
          borderWidth="2px"
          borderColor={`${themeStyles.treeColor}.500`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          boxShadow="md"
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.1)', boxShadow: 'lg' }}
          title={message.content}
          position="relative"
          overflow="hidden"
        >
          {decoration ? (
            <Image
              src={getDecorationImage(decoration)}
              alt="Message decoration"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : (
            <Icon as={FiMessageSquare} color={`${themeStyles.treeColor}.700`} />
          )}
        </Box>
      </motion.div>
    );
  };

  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: '400px', md: '500px' }}
      bgGradient={themeStyles.bgGradient}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="xl"
    >
      {/* Background effects */}
      {tree.theme === 'christmas' && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <SnowFlake key={i} />
          ))}
        </>
      )}

      {/* Tree base */}
      <Center position="relative" h="100%">
        <Box position="relative" w={{ base: '80%', md: '60%' }} h={{ base: '80%', md: '90%' }}>
          {/* Tree tiers */}
          <Box
            bg={`${themeStyles.treeColor}.500`}
            w="100%"
            h={{ base: '120px', md: '150px' }}
            borderRadius="md"
            position="absolute"
            bottom={{ base: '40px', md: '50px' }}
          />
          <Box
            bg={`${themeStyles.treeColor}.400`}
            w="80%"
            h={{ base: '100px', md: '120px' }}
            borderRadius="md"
            position="absolute"
            bottom={{ base: '120px', md: '150px' }}
            left="10%"
          />
          <Box
            bg={`${themeStyles.treeColor}.300`}
            w="60%"
            h={{ base: '80px', md: '90px' }}
            borderRadius="md"
            position="absolute"
            bottom={{ base: '180px', md: '230px' }}
            left="20%"
          />
          <Box
            bg={`${themeStyles.treeColor}.200`}
            w="40%"
            h={{ base: '50px', md: '60px' }}
            borderRadius="md"
            position="absolute"
            bottom={{ base: '230px', md: '290px' }}
            left="30%"
          />

          {/* Tree trunk */}
          <Box
            bg="brown.600"
            w={{ base: '40px', md: '50px' }}
            h={{ base: '40px', md: '50px' }}
            position="absolute"
            bottom="0"
            left="calc(50% - 25px)"
          />

          {/* Tree topper */}
          <Box position="absolute" top="-20px" left="calc(50% - 30px)">
            <Box
              w={{ base: '40px', md: '60px' }}
              h={{ base: '40px', md: '60px' }}
              bg={`${themeStyles.treeColor}.100`}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="lg"
            >
              <Text fontSize={{ base: '20px', md: '24px' }}>⭐</Text>
            </Box>
          </Box>

          {/* Messages */}
          {tree.messages && tree.messages.length > 0 ? (
            tree.messages.map((message, index) => (
              <MessageCard key={message.id} message={message} index={index} />
            ))
          ) : (
            <Center
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              textAlign="center"
              w="80%"
            >
              <VStack gap={4}>
                <Text fontSize={{ base: 'md', md: 'lg' }} color="white">
                  No messages yet! Add one to decorate your tree 🎄
                </Text>
                <IconButton
                  aria-label="Add message"
                  onClick={onAddMessage}
                  colorScheme={themeStyles.treeColor}
                  size="lg"
                  borderRadius="full"
                >
                  <Icon as={FiMessageSquare} />
                </IconButton>
              </VStack>
            </Center>
          )}
        </Box>
      </Center>

      {/* Add message button (only show when there are messages) */}
      {tree.messages && tree.messages.length > 0 && (
        <IconButton
          aria-label="Add message"
          onClick={onAddMessage}
          colorScheme={themeStyles.treeColor}
          size="lg"
          position="absolute"
          bottom={4}
          right={4}
          borderRadius="full"
          boxShadow="lg"
        >
          <FiMessageSquare />
        </IconButton>
      )}
    </Box>
  );
}
