import ImageIcon from '@/components/ui/icons/ImageIcon';
import { MessageIcon } from '@/components/ui/icons/MessageIcon';
import { ICON_PATH } from '@/lib/constants';
import { AvatarImage, AvatarRoot, Badge, Box, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

interface User {
  name: string;
  email: string;
  image?: string;
}

interface MessageInfo {
  id: string;
  content: string;
  createdAt: Date;
  // Add other message properties as needed
}

interface TreeUserInfoProps {
  treeName: string;
  user: User;
  messageInfo: MessageInfo[];
}

/**
 * Displays tree information including name, user details, and message count
 * @param treeName - The name of the tree
 * @param user - User information (name, email, image)
 * @param messageInfo - Array of message information
 */
export const TreeUserInfo: React.FC<TreeUserInfoProps> = ({ treeName, user, messageInfo }) => {
  const messageCount = messageInfo.length;
  const hasUnreadMessages = messageCount > 0;

  return (
    <Box
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.9) 100%)',
        borderRadius: 'lg',
        zIndex: -1,
      }}
    >
      <HStack justify="space-between" align="flex-start" gap={4}>
        {/* Left side - Tree and User Info */}
        <VStack align="flex-start" gap={2} flex={1}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="teal.700"
            fontFamily="serif"
            lineHeight="1.2"
          >
            {treeName}
          </Text>

          <HStack gap={3} align="center">
            <AvatarRoot size="sm" bg="teal.500">
              <AvatarImage src={user.image} />
            </AvatarRoot>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="sm" color="green.600" fontFamily="serif" fontWeight="medium">
                by {user.name}
              </Text>
              <Text fontSize="xs" color="gray.500" fontFamily="mono">
                {user.email}
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* Right side - Message Icon with Badge */}
        <Box position="relative">
          <Box p={3} borderRadius="full" cursor="pointer" transition="all 0.2s">
            <ImageIcon
              src={ICON_PATH.MESSAGE}
              alt="Message icon"
              size={48}
              fallbackSrc={ICON_PATH.MESSAGE_ALT}
            />
          </Box>

          {hasUnreadMessages && (
            <Text position="absolute" top="4" right="5">
              {messageCount > 99 ? '99+' : messageCount}
            </Text>
          )}
        </Box>
      </HStack>
    </Box>
  );
};

export default TreeUserInfo;
