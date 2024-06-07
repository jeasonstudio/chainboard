import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';

import './globals.css';
import { cn } from '../lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Chainboard',
  description: 'The shareable on-chain notebook',
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <html suppressHydrationWarning>
    <head />
    <body
      className={cn(
        'min-h-screen bg-background text-foreground',
        inter.variable
      )}
    >
      <ThemeProvider attribute="class" defaultTheme="system">
        {children}
        <Toaster />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
