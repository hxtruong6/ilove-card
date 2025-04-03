import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

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
        <AppWrappers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </AppWrappers>
      </body>
    </html>
  );
}
