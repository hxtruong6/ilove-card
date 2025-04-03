'use client';

import { Providers } from '@/components/providers';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Providers>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" richColors />
      </Providers>
    </SessionProvider>
  );
}
