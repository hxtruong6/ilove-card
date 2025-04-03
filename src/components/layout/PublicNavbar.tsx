'use client';

import { useAuth } from '@/lib/auth';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiFile, FiLogOut, FiUser } from 'react-icons/fi';

export function PublicNavbar() {
  const { user, logout } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      as="nav"
      p={4}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      justify="space-between"
      align="center"
      position="sticky"
      top={0}
      zIndex={100}
    >
      {/* Logo */}
      <Link href={user ? '/dashboard' : '/'}>
        <Box fontSize="xl" fontWeight="bold" color="teal.500">
          iCard
        </Box>
      </Link>

      {/* Menu */}
      {isMobile ? (
        <Menu.Root>
          <Menu.Trigger asChild aria-label="Menu">
            <Icon>
              <FiFile />
            </Icon>
          </Menu.Trigger>
          <Menu.Content>
            {user ? (
              <>
                <Menu.Item asChild value="dashboard">
                  <Link href="/dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item asChild value="explore">
                  <Link href="/explore">Explore</Link>
                </Menu.Item>
                <Menu.Item asChild value="friends">
                  <Link href="/friends">Friends</Link>
                </Menu.Item>
                <Menu.Item asChild value="about">
                  <Link href="/friends">Friends</Link>
                </Menu.Item>
                <Menu.Item asChild value="about">
                  <Link href="/about">About</Link>
                </Menu.Item>
                <Menu.Item asChild value="login">
                  <Link href="/login">Login</Link>
                </Menu.Item>
                <Menu.Item asChild value="signup">
                  <Link href="/signup">Signup</Link>
                </Menu.Item>
                <MenuItem onClick={logout} color="red.500" value="logout">
                  <FiLogOut className="mr-2" />
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <Menu.Item asChild value="explore">
                  <Link href="/explore">Explore</Link>
                </Menu.Item>
                <Menu.Item asChild value="about">
                  <Link href="/about">About</Link>
                  About
                </Menu.Item>
                <Menu.Item asChild value="login">
                  <Link href="/login">Login</Link>
                </Menu.Item>
                <Menu.Item asChild value="signup">
                  <Link href="/signup">Signup</Link>
                </Menu.Item>
              </>
            )}
          </Menu.Content>
        </Menu.Root>
      ) : (
        <Flex gap={4} align="center">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/explore">
                <Button variant="ghost">Explore</Button>
              </Link>
              <Link href="/friends">
                <Button variant="ghost">Friends</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="ghost">
                    {user.name} <FiUser />
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item onClick={logout} color="red.500" value="logout">
                    <FiLogOut className="mr-2" />
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Root>
            </>
          ) : (
            <>
              <Link href="/explore">
                <Button variant="ghost">Explore</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button colorScheme="teal">Signup</Button>
              </Link>
            </>
          )}
        </Flex>
      )}
    </Flex>
  );
}
