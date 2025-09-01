"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Flame,
  Trophy,
  User,
  Sparkles
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Problem Log', href: '/submit', icon: BookOpen },
  { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
  { name: 'Settings', href: '/notes', icon: Settings },
];

export default function CodeStreakHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUserName(user.email?.split('@')[0] || 'User');
      }
    };
    getUser();
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white/80 dark:bg-gray-900/80 shadow-lg border-r border-gray-200 dark:border-gray-800 p-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 mb-10">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-500 shadow">
          <Flame className="w-7 h-7 text-white" />
        </span>
        <span className="font-bold text-2xl text-blue-700 dark:text-purple-300">DSA Streak</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-blue-100 dark:hover:bg-gray-800/60 ${pathname === item.href ? 'bg-blue-50 dark:bg-gray-800/80 text-blue-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-200'}`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800">
        {user ? (
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600 dark:text-purple-300" />
            <span className="font-semibold">{userName}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Not signed in</span>
        )}
      </div>
    </aside>
  );
}
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserName(session.user.email?.split('@')[0] || 'User');
      } else {
        setUser(null);
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="w-80 bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-r border-[#334155] flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-8 border-b border-[#334155]">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-2xl flex items-center justify-center shadow-lg">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f8fafc]">CodeStreak</h1>
            <p className="text-sm text-[#64748b]">DSA Progress Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg'
                  : 'text-[#cbd5e1] hover:bg-[#334155] hover:text-white'
              }`}
            >
              <div className={`w-6 h-6 transition-colors ${
                isActive ? 'text-white' : 'text-[#64748b] group-hover:text-white'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-lg">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-[#334155]">
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-[#334155] shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-[#f8fafc] truncate">
                    {userName}
                  </p>
                  <p className="text-sm text-[#64748b] truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 text-[#cbd5e1] hover:text-white hover:bg-[#334155] rounded-2xl transition-all duration-200 group bg-[#0f172a] border border-[#334155]"
            >
              <LogOut className="w-5 h-5 text-[#64748b] group-hover:text-white transition-colors" />
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-[#64748b]" />
            </div>
            <p className="text-[#cbd5e1] mb-6">Please sign in to continue</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-semibold"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
