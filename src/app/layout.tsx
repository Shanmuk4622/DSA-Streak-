import './globals.css';
import Link from "next/link";
import { CodeStreakHeader } from "../components/CodeStreakHeader";

export const metadata = {
  title: "DSA Streak",
  description: "Track your DSA progress and stay motivated!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <header className="shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700 dark:text-purple-300">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#6366F1"/><text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="16" fontFamily="Arial" dy=".3em">DSA</text></svg>
              DSA Streak
            </Link>
            <nav className="flex gap-6 text-base font-medium">
              <Link href="/landing" className="hover:text-blue-600 dark:hover:text-purple-300 transition">Home</Link>
              <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-purple-300 transition">Dashboard</Link>
              <Link href="/bank" className="hover:text-blue-600 dark:hover:text-purple-300 transition">Bank</Link>
              <Link href="/notes" className="hover:text-blue-600 dark:hover:text-purple-300 transition">Notes</Link>
              <Link href="/submit" className="hover:text-blue-600 dark:hover:text-purple-300 transition">Submit</Link>
            </nav>
            <div className="flex items-center gap-2">
              {/* Place for AuthButtons or ThemeToggle */}
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8 w-full max-w-5xl">
          {children}
        </main>
        <footer className="bg-white/80 dark:bg-gray-900/80 text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          © {new Date().getFullYear()} DSA Streak. Built with Next.js & Tailwind CSS.
        </footer>
      </body>
    </html>
  );
}
