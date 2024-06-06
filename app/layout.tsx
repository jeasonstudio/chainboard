import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

export const metadata: Metadata = {
  title: 'Chainboard',
  description: 'The shareable on-chain notebook',
};

export const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <html suppressHydrationWarning>
    <head />
    <body className="min-h-screen bg-background text-foreground">
      <ThemeProvider attribute="class" defaultTheme="system">
        {children}
        <Toaster />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
