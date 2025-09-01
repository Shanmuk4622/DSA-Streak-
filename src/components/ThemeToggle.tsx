import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';
import AuthButtons from '@/components/AuthButtons';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: 'DSA Streak',
  description: 'Keep your DSA streak alive',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <div className="mx-auto max-w-5xl px-4 py-6">
            <Header />
            <main className="mt-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between rounded-2xl bg-white dark:bg-gray-900 p-4 shadow">
      <div className="font-semibold text-xl">🔥 DSA Streak</div>
      <nav className="flex gap-4 items-center">
        <Link href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
        <Link href="/bank" className="text-sm font-medium hover:underline">Question Bank</Link>
        <Link href="/notes" className="text-sm font-medium hover:underline">Notes</Link>
        <Link href="/submit" className="text-sm font-medium hover:underline">Add Solve</Link>
        <ThemeToggle />
        <AuthButtons />
      </nav>
    </header>
  );
}