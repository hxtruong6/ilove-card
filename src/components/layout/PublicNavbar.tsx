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
import { useRouter } from 'next/navigation';
import { FiFile, FiLogOut, FiUser } from 'react-icons/fi';

import SideBar from './SideBar';

export function PublicNavbar() {
	const { user, logout } = useAuth();
	const isMobile = useBreakpointValue({ base: true, md: false });

	const router = useRouter();

	const handleNavigation = (route: string) => {
		router.push(route);
	};

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
						<IconButton variant="ghost" aria-label="Menu">
							<FiFile />
						</IconButton>
					</Menu.Trigger>
					<Menu.Positioner>
						<Menu.Content>
							{user ? (
								<>
									<Menu.Item value="dashboard" onClick={() => handleNavigation('/dashboard')}>
										Dashboard
									</Menu.Item>
									<Menu.Item value="explore" onClick={() => handleNavigation('/explore')}>
										Explore
									</Menu.Item>
									<Menu.Item value="friends" onClick={() => handleNavigation('/friends')}>
										Friends
									</Menu.Item>
									<Menu.Item value="about" onClick={() => handleNavigation('/about')}>
										About
									</Menu.Item>
									<Menu.Item value="logout" onClick={logout} color="red.500">
										<FiLogOut style={{ marginRight: '8px', display: 'inline' }} />
										Logout
									</Menu.Item>
								</>
							) : (
								<>
									<Menu.Item value="explore" onClick={() => handleNavigation('/explore')}>
										Explore
									</Menu.Item>
									<Menu.Item value="about" onClick={() => handleNavigation('/about')}>
										About
									</Menu.Item>
									<Menu.Item value="login" onClick={() => handleNavigation('/login')}>
										Login
									</Menu.Item>
									<Menu.Item value="signup" onClick={() => handleNavigation('/signup')}>
										Signup
									</Menu.Item>
								</>
							)}
						</Menu.Content>
					</Menu.Positioner>
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
