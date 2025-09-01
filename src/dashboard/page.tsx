'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';

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
      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-gray-700">Please sign in to view your dashboard.</p>
      </div>
    );
  }
  if (loading) {
    return <div className="text-sm text-gray-600">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Current Streak" value={streak?.current_streak ?? 0} />
        <KpiCard label="Longest Streak" value={streak?.longest_streak ?? 0} />
        <KpiCard
          label="Last Solved"
          value={streak?.last_solved_date ? dayjs(streak.last_solved_date).format('DD MMM YYYY') : '—'}
        />
      </div>

      {/* Simple bar chart (14 days) */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Last 14 Days</h2>
        <div className="flex items-end gap-2 h-40">
          {last14Days.map(({ day, count }) => (
            <div key={day} className="flex flex-col items-center justify-end">
              <div
                className="w-6 rounded-t bg-indigo-600"
                style={{ height: `${Math.min(100, count * 30)}%` }}
                title={`${day}: ${count}`}
              />
              <div className="mt-1 text-[10px] text-gray-600">{dayjs(day).format('DD')}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">Bar height = solves per day</p>
      </div>

      {/* Recent solved */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Recent Solved</h2>
        <ul className="divide-y">
          {recent.length === 0 && <li className="py-3 text-sm text-gray-600">No solves yet.</li>}
          {recent.map(r => (
            <li key={r.solve_id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">
                    {r.platform ?? '—'} • {r.difficulty ?? '—'} • {dayjs(r.solved_at).format('DD MMM, HH:mm')}
                  </div>
                </div>
                {r.platform_ref && (
                  <a
                    href={r.platform_ref}
                    target="_blank"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Open
                  </a>
                )}
              </div>
              {r.topics?.length ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {r.topics.map(t => (
                    <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}