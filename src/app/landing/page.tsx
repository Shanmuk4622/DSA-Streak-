'use client';

import { Flame, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LandingBackground from '@/components/LandingBackground';

export default function LandingPage() {
  const ctaHover = { scale: 1.05, transition: { duration: 0.2 } };

  return (
    <main>
      <LandingBackground />
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-gradient">
            Welcome to DSA Streak
          </h1>
          <p className="mt-4 text-lg md:text-2xl">
            Your all-in-one platform to track, practice, and master Data Structures & Algorithms. Stay consistent, stay ahead!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a href="/dashboard" className="btn-primary" whileHover={ctaHover}>
              Start Solving
            </motion.a>
            <motion.a href="/notes" className="btn-secondary" whileHover={ctaHover}>
              View Notes
            </motion.a>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <img src="/window.svg" alt="Window" className="w-64 h-64 opacity-90 drop-shadow-xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-dark-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 text-dark-text">Why Choose CodeStreak?</h2>
            <p className="text-dark-text text-lg">Everything you need to build a consistent DSA practice</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primaryGradient rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-dark-text">Streak Tracking</h3>
              <p className="text-dark-text leading-relaxed">
                Never break your momentum. Track your current and longest streaks with beautiful visualizations and motivational insights.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primaryGradient rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-dark-text">Activity Calendar</h3>
              <p className="text-dark-text leading-relaxed">
                See your problem-solving activity at a glance with our GitHub-style contribution calendar. Visualize your consistency over time.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primaryGradient rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-dark-text">Progress Analytics</h3>
              <p className="text-dark-text leading-relaxed">
                Get insights into your solving patterns, difficulty distribution, and improvement over time with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-dark-text">Ready to Start Your Journey?</h2>
          <p className="text-dark-text text-lg mb-10 leading-relaxed">
            Join thousands of developers who are building consistency in their DSA practice. Start tracking your progress today and never lose momentum again.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center space-x-3 text-lg px-10 py-4 rounded-xl">
            <span>Start Tracking Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primaryGradient rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-dark-text">CodeStreak</h3>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 CodeStreak. Built with ❤️ for the developer community.
          </p>
        </div>
      </footer>
    </main>
  );
}
