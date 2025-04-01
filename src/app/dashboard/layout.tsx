'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { useAuth } from '@/contexts/AuthContext';
import {
  Avatar,
  AvatarImage,
  AvatarRoot,
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Text,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuMenu, LuMoon, LuSun } from 'react-icons/lu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { open, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  // Responsive values
  const padding = useBreakpointValue({ base: 4, md: 6 });
  const navHeight = useBreakpointValue({ base: '60px', md: '80px' });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const NavLink = ({ href, children }: { href: string; children: string }) => (
    <Link href={href} passHref>
      <Text
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="medium"
        color="gray.600"
        _hover={{ color: 'brand.500', transform: 'translateY(-1px)' }}
        transition="all 0.2s"
      >
        {children}
      </Text>
    </Link>
  );

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Navigation */}
      <Box as="nav" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10} h={navHeight}>
        <Container maxW="container.xl" h="full">
          <Flex align="center" justify="space-between" h="full">
            {/* Brand */}
            <Link href="/dashboard" passHref>
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="bold"
                color="brand.500"
                letterSpacing="tight"
              >
                iCard
              </Text>
            </Link>

            {/* Desktop Navigation */}
            <HStack gap={{ base: 4, md: 8 }} display={{ base: 'none', md: 'flex' }}>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/dashboard/trees">My Trees</NavLink>
              <NavLink href="/dashboard/settings">Settings</NavLink>
            </HStack>

            {/* Right Section */}
            <HStack gap={2}>
              <IconButton
                aria-label="Toggle theme"
                onClick={toggleColorMode}
                variant="ghost"
                size="md"
                display={{ base: 'none', md: 'flex' }}
              >
                {colorMode === 'light' ? <LuMoon /> : <LuSun />}
              </IconButton>

              <MenuRoot>
                <MenuTrigger rounded="full" p={1} _hover={{ bg: 'gray.100' }}>
                  <AvatarRoot size="sm" bg="brand.500">
                    <AvatarImage src={user?.avatar} />
                  </AvatarRoot>
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent>
                      <MenuItem value="logout" onClick={handleLogout}>
                        Logout
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>

              <IconButton
                aria-label="Open menu"
                variant="ghost"
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
              >
                <Icon as={LuMenu} />
              </IconButton>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      {/* <DrawerRoot isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold">
                Menu
              </Text>
              <IconButton
                aria-label="Close menu"
                icon={<CloseIcon />}
                variant="ghost"
                onClick={onClose}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={6} align="stretch" py={4}>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/dashboard/trees">My Trees</NavLink>
              <NavLink href="/dashboard/settings">Settings</NavLink>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={handleLogout}
                isLoading={isLoading}
              >
                Logout
              </Button>
              <Button
                variant="ghost"
                leftIcon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                justifyContent="flex-start"
                onClick={toggleColorMode}
              >
                {colorMode === 'light' ? 'Dark' : 'Light'} Mode
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerR> */}

      {/* Main Content */}
      <Container maxW="container.xl" py={padding}>
        {children}
      </Container>
    </Box>
  );
}
