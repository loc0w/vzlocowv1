'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="light">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}