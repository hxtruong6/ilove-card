'use client';

import { Providers } from '@/components/providers';
import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <Providers>
      {children}
      <Toaster position="top-right" richColors />
    </Providers>
  );
}
