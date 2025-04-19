'use client';

import { Tooltip } from '@/components/ui/tooltip';
import { Badge, Box, Icon, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { LuLock } from 'react-icons/lu';

import { SubscriptionModal } from './SubscriptionModal';

interface Decoration {
  id: string;
  type: string;
  icon: string;
  isPremium: boolean;
}

const decorations: Decoration[] = [
  { id: 'star', type: 'Star', icon: '⭐', isPremium: false },
  { id: 'heart', type: 'Heart', icon: '❤️', isPremium: false },
  { id: 'gift', type: 'Gift', icon: '🎁', isPremium: false },
  { id: 'lantern', type: 'Lantern', icon: '🏮', isPremium: true },
  { id: 'ribbon', type: 'Ribbon', icon: '🎀', isPremium: true },
  { id: 'sparkles', type: 'Sparkles', icon: '✨', isPremium: true },
];

interface DecorationPickerProps {
  onSelect: (decoration: Decoration) => void;
  selectedId?: string;
}

export const DecorationPicker = ({ onSelect, selectedId }: DecorationPickerProps) => {
  const { data: session } = useSession();
  const { open, onOpen, onClose } = useDisclosure();
  const isPremium = session?.user?.subscriptionStatus !== 'FREE';

  const handleDecorationClick = (decoration: Decoration) => {
    if (decoration.isPremium && !isPremium) {
      onOpen();
    } else {
      onSelect(decoration);
    }
  };

  return (
    <Box>
      <Text mb={2} fontWeight="medium">
        Choose a decoration
      </Text>
      <SimpleGrid columns={[3, 4, 6]} gap={3}>
        {decorations.map(decoration => (
          <Tooltip
            key={decoration.id}
            content={
              decoration.isPremium && !isPremium
                ? 'Premium decoration - Upgrade to unlock'
                : decoration.type
            }
          >
            <Box position="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Box
                  cursor={decoration.isPremium && !isPremium ? 'not-allowed' : 'pointer'}
                  p={3}
                  borderRadius="md"
                  bg={
                    selectedId === decoration.id
                      ? 'teal.100'
                      : decoration.isPremium
                        ? 'gray.50'
                        : 'white'
                  }
                  border="1px solid"
                  borderColor={decoration.isPremium ? 'yellow.400' : 'transparent'}
                  onClick={() => handleDecorationClick(decoration)}
                  position="relative"
                  textAlign="center"
                  opacity={decoration.isPremium && !isPremium ? 0.6 : 1}
                >
                  <Text fontSize="2xl">{decoration.icon}</Text>
                  {decoration.isPremium && !isPremium && (
                    <Box position="absolute" top={-2} right={-2} zIndex={1}>
                      <LuLock color="yellow.500" />
                    </Box>
                  )}
                  {decoration.isPremium && (
                    <Badge
                      position="absolute"
                      bottom={-2}
                      right={-2}
                      colorScheme="yellow"
                      fontSize="xs"
                    >
                      PRO
                    </Badge>
                  )}
                </Box>
              </motion.div>
            </Box>
          </Tooltip>
        ))}
      </SimpleGrid>
      <SubscriptionModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => {
          // Refresh the session to update subscription status
          window.location.reload();
        }}
      />
    </Box>
  );
};
