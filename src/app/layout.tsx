import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AppWrappers from '../components/AppWrappers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'iCard - Share Your Love',
  description: 'A festive tree messaging platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
