'use client';

import { Box, Button, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';

import SideBar from './SideBar';

/**
 * Demo component to showcase the SideBar component
 * Includes navigation state management and content display
 */
export default function SideBarDemo() {
  const [currentRoute, setCurrentRoute] = useState('/trees');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNavigation = (route: string) => {
    setCurrentRoute(route);
    console.log(`Navigating to: ${route}`);
  };

  const getRouteContent = () => {
    switch (currentRoute) {
      case '/trees':
        return {
          title: 'My Tree',
          content: 'This is where your tree and messages will be displayed.',
        };
      case '/friends':
        return {
          title: 'Friends',
          content: 'Connect with friends and share your memories.',
        };
      case '/settings':
        return {
          title: 'Settings',
          content: 'Manage your account settings and preferences.',
        };
      case '/profile':
        return {
          title: 'Profile',
          content: 'View and edit your profile information.',
        };
      case '/next':
        return {
          title: 'Next',
          content: 'This could be a next step or additional feature.',
        };
      default:
        return {
          title: 'Welcome',
          content: 'Select a menu item to get started.',
        };
    }
  };

  const { title, content } = getRouteContent();

  return (
    <Box h="100vh" display="flex">
      {/* SideBar */}
      <SideBar userName="Aidan" onNavigate={handleNavigation} isOpen={isSidebarOpen} />

      {/* Main Content */}
      <Box
        flex={1}
        ml={isSidebarOpen ? '280px' : '0'}
        transition="margin-left 0.3s ease"
        p={8}
        bg="gray.50"
      >
        <VStack gap={6} align="stretch">
          {/* Toggle Button */}
          <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} size="sm" alignSelf="flex-start">
            {isSidebarOpen ? 'Hide' : 'Show'} Sidebar
          </Button>

          {/* Content */}
          <Box bg="white" p={8} borderRadius="lg" shadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              {title}
            </Text>
            <Text fontSize="md" color="gray.600">
              {content}
            </Text>
          </Box>

          {/* Current Route Display */}
          <Box bg="blue.50" p={4} borderRadius="md">
            <Text fontSize="sm" color="blue.700">
              Current Route: <strong>{currentRoute}</strong>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
