'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Flame, Trophy, Calendar, Clock, TrendingUp, Target, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type StreakData = {
  // Add your streak data properties here
};

export default function Home() {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 bg-clip-text text-transparent">
            Supercharge Your DSA Journey
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-700 dark:text-gray-200">
            Track your daily progress, solve curated problems, and build a consistent coding streak. Level up your skills with DSA Streak!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
            <a href="/bank" className="btn-secondary">Explore Questions</a>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <img src="/globe.svg" alt="Globe" className="w-64 h-64 opacity-90 drop-shadow-xl" />
        </div>
      </section>
    );
}
