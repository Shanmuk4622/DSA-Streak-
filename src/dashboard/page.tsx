'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';
import { Flame, Trophy, Calendar, ExternalLink, BarChart3 } from 'lucide-react';

type StreakRow = {
  current_streak: number;
  longest_streak: number;
  last_solved_date: string | null;
};

type Daily = { day: string; solve_count: number };
type Recent = {
  solve_id: string;
  solved_at: string;
  title: string;
  platform: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard' | null;
  platform_ref: string | null;
  topics: string[] | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState<StreakRow | null>(null);
  const [daily, setDaily] = useState<Daily[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user?.id) { setLoading(false); return; }
      setUserId(u.user.id);

      // streaks
      const { data: sRow, error: sErr } = await supabase
        .from('streaks')
        .select('current_streak,longest_streak,last_solved_date')
        .single();
      if (sErr && sErr.code !== 'PGRST116') console.error(sErr);
      setStreak(sRow ?? null);

      // daily counts (last 14 days)
      const cutoff = dayjs().subtract(14, 'day').format('YYYY-MM-DD');
      const { data: dRows, error: dErr } = await supabase
        .from('vw_daily_solve_counts')
        .select('day, solve_count')
        .gte('day', cutoff);
      if (dErr) console.error(dErr);
      setDaily(dRows ?? []);

      // recent 7
      const { data: rRows, error: rErr } = await supabase
        .from('vw_recent_solved_7')
        .select('solve_id, solved_at, title, platform, difficulty, platform_ref, topics');
      if (rErr) console.error(rErr);
      setRecent(rRows ?? []);

      setLoading(false);
    })();
  }, []);

  const last14Days = useMemo(() => {
    const map = new Map(daily.map(d => [d.day, d.solve_count]));
    const days: { day: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      days.push({ day: d, count: map.get(d) ?? 0 });
    }
    return days;
  }, [daily]);

  if (!userId) {
    return (
      <div className="flex-1 p-8 max-w-4xl mx-auto">
        <div className="card p-8 text-center">
          <p className="text-[#cbd5e1]">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex-1 p-8 max-w-4xl mx-auto">
        <div className="text-[#cbd5e1] text-lg">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] mb-2">Analytics Dashboard</h1>
        <p className="text-[#cbd5e1]">Detailed insights into your problem-solving progress</p>
      </div>

      <div className="space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <KpiCard 
            label="Current Streak" 
            value={streak?.current_streak ?? 0}
            icon={Flame}
            color="from-[#f59e0b] to-[#f97316]"
          />
          <KpiCard 
            label="Longest Streak" 
            value={streak?.longest_streak ?? 0}
            icon={Trophy}
            color="from-[#10b981] to-[#059669]"
          />
          <KpiCard 
            label="Last Solved" 
            value={streak?.last_solved_date ? dayjs(streak.last_solved_date).format('DD MMM YYYY') : '—'}
            icon={Calendar}
            color="from-[#6366f1] to-[#8b5cf6]"
          />
        </div>

        {/* Simple bar chart (14 days) */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#f8fafc]">Last 14 Days Activity</h2>
              <p className="text-sm text-[#64748b]">Daily problem-solving activity</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {last14Days.map(({ day, count }) => (
              <div key={day} className="flex flex-col items-center justify-end flex-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[#6366f1] to-[#8b5cf6] min-h-[4px]"
                  style={{ height: `${Math.min(100, count * 30)}%` }}
                  title={`${day}: ${count} problems`}
                />
                <div className="mt-2 text-xs text-[#64748b]">{dayjs(day).format('DD')}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#64748b]">Bar height represents problems solved per day</p>
        </div>

        {/* Recent solved */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#f8fafc]">Recent Solved</h2>
            <span className="text-sm text-[#64748b]">{recent.length} problems</span>
          </div>
          <div className="space-y-4">
            {recent.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-[#64748b]" />
                </div>
                <p className="text-[#cbd5e1] mb-2">No solves yet</p>
                <p className="text-[#64748b] text-sm">Start solving problems to see your recent activity here!</p>
              </div>
            )}
            {recent.map(r => (
              <div key={r.solve_id} className="p-4 bg-[#0f172a] rounded-lg border border-[#334155] hover:border-[#475569] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-[#f8fafc]">{r.title}</div>
                    <div className="text-sm text-[#64748b] mt-1">
                      {r.platform ?? '—'} • {r.difficulty ?? '—'} • {dayjs(r.solved_at).format('DD MMM, HH:mm')}
                    </div>
                  </div>
                  {r.platform_ref && (
                    <a
                      href={r.platform_ref}
                      target="_blank"
                      className="text-[#6366f1] hover:text-[#818cf8] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {r.topics?.length ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {r.topics.map(t => (
                      <span key={t} className="rounded-full bg-[#334155] px-3 py-1 text-xs text-[#cbd5e1]">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }: { 
  label: string; 
  value: string | number; 
  icon: any;
  color: string;
}) {
  return (
    <div className="card p-6 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-10 translate-x-10`}></div>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-[#cbd5e1]">{label}</h3>
        </div>
      </div>
      <div className="text-3xl font-bold text-[#f8fafc]">{value}</div>
    </div>
  );
}