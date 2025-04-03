'use client';

import { Box, Container, useBreakpointValue } from '@chakra-ui/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const padding = useBreakpointValue({ base: 4, md: 6 });

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Main Content */}
      <Container maxW="container.xl" py={padding}>
        {children}
      </Container>
    </Box>
  );
}
