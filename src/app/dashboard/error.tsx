'use client';

import { Box, Button, Container, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { FiAlertCircle, FiHome, FiRefreshCw } from 'react-icons/fi';

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Dashboard error:', error);
	}, [error]);

	return (
		<Container maxW="container.md" py={16}>
			<VStack gap={6} align="center" textAlign="center">
				<Box
					bg="red.50"
					borderRadius="full"
					p={6}
					display="inline-flex"
					alignItems="center"
					justifyContent="center"
				>
					<Icon as={FiAlertCircle} boxSize={12} color="red.500" />
				</Box>

				<VStack gap={2}>
					<Heading size="2xl" color="gray.800">
						Dashboard Error
					</Heading>
					<Text fontSize="lg" color="gray.600" maxW="md">
						We couldn't load your dashboard. This is usually temporary.
					</Text>
				</VStack>

				{error.digest && (
					<Text fontSize="sm" color="gray.400" fontFamily="mono">
						Error ID: {error.digest}
					</Text>
				)}

				<VStack gap={3} pt={4}>
					<Button colorScheme="teal" size="lg" onClick={reset}>
						<Icon as={FiRefreshCw} />
						Reload Dashboard
					</Button>

					<Link href="/">
						<Button variant="ghost" size="lg">
							<FiHome />
							Go to Home
						</Button>
					</Link>
				</VStack>

				<Box mt={6} p={4} bg="gray.50" borderRadius="md" maxW="md">
					<Text fontSize="sm" color="gray.600">
						<strong>Quick fixes to try:</strong>
					</Text>
					<Text fontSize="sm" color="gray.600" mt={2}>
						• Refresh the page
						<br />
						• Clear your browser cache
						<br />• Try again in a few minutes
					</Text>
				</Box>

				<Text fontSize="sm" color="gray.500" pt={2}>
					If this problem persists, please contact support.
				</Text>
			</VStack>
		</Container>
	);
}
