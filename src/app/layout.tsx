import type { Metadata } from 'next';

import AppWrappers from './AppWrappers';

export const metadata: Metadata = {
  title: 'iCard - Festive Tree Messaging Platform',
  description: 'Create and share personalized festive trees with messages',
};

export default function RootLayout(
  { children }: { children: React.ReactNode },
) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root">
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
