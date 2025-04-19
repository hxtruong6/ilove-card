'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardRoot,
  List,
  ListItem,
  ListRoot,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuCheckCheck } from 'react-icons/lu';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

const plans: Plan[] = [
  {
    id: 'MONTHLY',
    name: 'Monthly',
    price: '$4.99',
    period: 'per month',
    features: [
      'Access to premium decorations',
      'Upload up to 3 photos per message',
      'Cancel anytime',
    ],
  },
  {
    id: 'YEARLY',
    name: 'Yearly',
    price: '$49.99',
    period: 'per year',
    features: ['All monthly features', 'Save 16% compared to monthly', 'Priority support'],
  },
  {
    id: 'LIFETIME',
    name: 'Lifetime',
    price: '$99.99',
    period: 'one-time',
    features: ['All yearly features', 'Never pay again', 'Early access to new features'],
  },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose, onSuccess }: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedPlan }),
      });

      if (!response.ok) {
        throw new Error('Failed to process subscription');
      }

      toast.success('Subscription successful!', {
        description: 'You now have access to premium features',
        duration: 5000,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Subscription failed', {
        description: error instanceof Error ? error.message : 'Please try again',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Choose Your Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack gap={4}>
            <Text color="gray.600">Unlock premium decorations and more photo uploads</Text>
            <Stack direction={{ base: 'column', md: 'row' }} gap={4} w="full" pb={4}>
              {plans.map(plan => (
                <CardRoot
                  key={plan.id}
                  variant={selectedPlan === plan.id ? 'filled' : 'outline'}
                  cursor="pointer"
                  onClick={() => setSelectedPlan(plan.id)}
                  flex={1}
                >
                  <CardBody>
                    <VStack gap={3} align="stretch">
                      <Box>
                        <Text fontSize="xl" fontWeight="bold">
                          {plan.name}
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                          {plan.price}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {plan.period}
                        </Text>
                      </Box>
                      <ListRoot gap={2}>
                        {plan.features.map((feature, index) => (
                          <ListItem key={index} display="flex" alignItems="center">
                            {/* <ListIcon as={CheckCircleIcon} color="teal.500" marginRight={2} /> */}
                            <LuCheckCheck color="teal.500" />
                            <Text fontSize="sm" ml={2}>
                              {feature}
                            </Text>
                          </ListItem>
                        ))}
                      </ListRoot>
                    </VStack>
                  </CardBody>
                </CardRoot>
              ))}
            </Stack>
            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              loading={isLoading}
              disabled={!selectedPlan}
              onClick={handleSubscribe}
            >
              Subscribe Now
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
