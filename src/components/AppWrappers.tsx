'use client';

import { Providers } from '@/components/providers';
import { AuthProvider } from '@/contexts/AuthContext';
import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthProvider>{children}</AuthProvider>
      <Toaster position="top-right" richColors />
    </Providers>
  );
}
