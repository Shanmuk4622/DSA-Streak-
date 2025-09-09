'use client';

import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body className="min-h-screen flex bg-light-background dark:bg-dark-background">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
        </body>
      </ThemeProvider>
    </html>
  );
}
