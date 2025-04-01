'use client';

import { theme } from '@/styles/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={theme}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
