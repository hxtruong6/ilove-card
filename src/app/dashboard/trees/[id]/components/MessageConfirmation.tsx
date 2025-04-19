import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface MessageConfirmationProps {
  onClose: () => void;
  message: {
    content: string;
    decoration?: {
      id: string;
      type: string;
    };
  };
}

export const MessageConfirmation = ({ onClose, message }: MessageConfirmationProps) => {
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack gap={4} align="center">
          <Text fontSize="lg" fontWeight="medium">
            Your message has been added to the tree!
          </Text>
          <Box p={4} borderRadius="md" bg="gray.50">
            <Text>{message.content}</Text>
          </Box>
          <Button onClick={onClose} colorScheme="teal">
            Back to Tree
          </Button>
        </VStack>
      </motion.div>
    </Box>
  );
};
