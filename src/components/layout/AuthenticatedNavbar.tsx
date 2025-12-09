'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { useAuth } from '@/contexts/AuthContext';
import {
	Avatar,
	AvatarImage,
	AvatarRoot,
	Box,
	Container,
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
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuMenu, LuMoon, LuSun } from 'react-icons/lu';

export function AuthenticatedNavbar() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const { colorMode, toggleColorMode } = useColorMode();

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/login');
		} catch (error) {
			console.error('Logout failed:', error);
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
		<Box as="nav" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
			<Container maxW="container.xl" h="full">
				<Flex align="center" justify="space-between" h="full" py={4}>
					{/* Mobile Navigation */}
					<Box display={{ base: 'block', md: 'none' }}>
						<MenuRoot>
							<MenuTrigger asChild>
								<IconButton variant="ghost" aria-label="Open menu" size="md">
									<LuMenu />
								</IconButton>
							</MenuTrigger>
							<Portal>
								<MenuPositioner>
									<MenuContent>
										<MenuItem value="dashboard" onClick={() => router.push('/dashboard')}>
											Dashboard
										</MenuItem>
										<MenuItem value="trees" onClick={() => router.push('/dashboard/trees')}>
											My Trees
										</MenuItem>
										<MenuItem value="explore" onClick={() => router.push('/explore')}>
											Explore
										</MenuItem>
										<MenuItem value="friends" onClick={() => router.push('/friends')}>
											Friends
										</MenuItem>
									</MenuContent>
								</MenuPositioner>
							</Portal>
						</MenuRoot>
					</Box>

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
						<NavLink href="/explore">Explore</NavLink>
						<NavLink href="/friends">Friends</NavLink>
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
										<MenuItem value="settings" onClick={() => router.push('/dashboard/settings')}>
											Settings
										</MenuItem>
										<MenuItem value="logout" onClick={handleLogout}>
											Logout
										</MenuItem>
									</MenuContent>
								</MenuPositioner>
							</Portal>
						</MenuRoot>
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
