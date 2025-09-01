import { Flame, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 bg-clip-text text-transparent">
            Welcome to DSA Streak
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-700 dark:text-gray-200">
            Your all-in-one platform to track, practice, and master Data Structures & Algorithms. Stay consistent, stay ahead!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="btn-primary">Start Solving</a>
            <a href="/notes" className="btn-secondary">View Notes</a>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <img src="/window.svg" alt="Window" className="w-64 h-64 opacity-90 drop-shadow-xl" />
        </div>
      </section>

        {/* Features Section */}
        <section className="py-24 bg-[#1e293b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4 text-[#f8fafc]">Why Choose CodeStreak?</h2>
              <p className="text-[#cbd5e1] text-lg">Everything you need to build a consistent DSA practice</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-8 text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#f8fafc]">Streak Tracking</h3>
                <p className="text-[#cbd5e1] leading-relaxed">
                  Never break your momentum. Track your current and longest streaks with beautiful visualizations and motivational insights.
                </p>
              </div>
              <div className="card p-8 text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#f8fafc]">Activity Calendar</h3>
                <p className="text-[#cbd5e1] leading-relaxed">
                  See your problem-solving activity at a glance with our GitHub-style contribution calendar. Visualize your consistency over time.
                </p>
              </div>
              <div className="card p-8 text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#f8fafc]">Progress Analytics</h3>
                <p className="text-[#cbd5e1] leading-relaxed">
                  Get insights into your solving patterns, difficulty distribution, and improvement over time with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#f59e0b] mb-2">10K+</div>
                <p className="text-[#cbd5e1]">Active Users</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#10b981] mb-2">50K+</div>
                <p className="text-[#cbd5e1]">Problems Solved</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#6366f1] mb-2">100+</div>
                <p className="text-[#cbd5e1]">Day Streaks</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#3b82f6] mb-2">95%</div>
                <p className="text-[#cbd5e1]">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#1e293b]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6 text-[#f8fafc]">Ready to Start Your Journey?</h2>
            <p className="text-[#cbd5e1] text-lg mb-10 leading-relaxed">
              Join thousands of developers who are building consistency in their DSA practice. 
              Start tracking your progress today and never lose momentum again.
            </p>
          );
        }
            </div>
            <div>
              <div className="text-4xl font-bold text-[#3b82f6] mb-2">95%</div>
              <p className="text-[#cbd5e1]">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1e293b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#f8fafc]">Ready to Start Your Journey?</h2>
          <p className="text-[#cbd5e1] text-lg mb-10 leading-relaxed">
            Join thousands of developers who are building consistency in their DSA practice. 
            Start tracking your progress today and never lose momentum again.
          </p>
          <Link
            href="/"
            className="btn-accent inline-flex items-center space-x-3 text-lg px-10 py-4 rounded-xl"
          >
            <span>Start Tracking Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#f8fafc]">CodeStreak</h3>
          </div>
          <p className="text-[#64748b] text-sm">
            © 2024 CodeStreak. Built with ❤️ for the developer community.
          </p>
        </div>
      </footer>
    </main>
  );
}
