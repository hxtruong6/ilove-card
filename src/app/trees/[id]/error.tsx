'use client';

import { Box, Button, Container, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { FiAlertCircle, FiHome, FiRefreshCw } from 'react-icons/fi';

export default function TreeError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Tree page error:', error);
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
						Oops! Something went wrong
					</Heading>
					<Text fontSize="lg" color="gray.600" maxW="md">
						We encountered an error while loading this tree. Don't worry, your data is safe.
					</Text>
				</VStack>

				{error.digest && (
					<Text fontSize="sm" color="gray.400" fontFamily="mono">
						Error ID: {error.digest}
					</Text>
				)}

				<VStack gap={3} pt={4}>
					<Button colorScheme="teal" size="lg" onClick={reset}>
						<FiRefreshCw />
						Try Again
					</Button>

					<Link href="/dashboard">
						<Button variant="ghost" size="lg">
							<FiHome />
							Go to Dashboard
						</Button>
					</Link>
				</VStack>

				<Text fontSize="sm" color="gray.500" pt={4}>
					If this problem persists, please contact support.
				</Text>
			</VStack>
		</Container>
	);
}
