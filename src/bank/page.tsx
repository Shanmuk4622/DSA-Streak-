'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Q = {
  id: string;
  title: string;
  platform: string | null;
  platform_ref: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard' | null;
  topics: string[] | null;
};

export default function BankPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [all, setAll] = useState<Q[]>([]);
  const [query, setQuery] = useState('');
  const [diff, setDiff] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user?.id) { setLoading(false); return; }
      setUserId(u.user.id);

      const { data, error } = await supabase
        .from('questions')
        .select('id,title,platform,platform_ref,difficulty,topics')
        .is('owner', null)
        .order('difficulty', { ascending: true })
        .order('title', { ascending: true });

      if (error) console.error(error);
      setAll(data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return all.filter(q => {
      const matchesText =
        !query ||
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        (q.platform ?? '').toLowerCase().includes(query.toLowerCase());
      const matchesDiff = diff === 'All' || q.difficulty === diff;
      const matchesTopic = !topic || q.topics?.some(t => t.toLowerCase().includes(topic.toLowerCase()));
      return matchesText && matchesDiff && matchesTopic;
    });
  }, [all, query, diff, topic]);

  async function markSolved(questionId: string) {
    setMsg(null);
    if (!userId) { setMsg('Please sign in.'); return; }
    const { error } = await supabase.from('solves').insert({
      user_id: userId,
      question_id: questionId,
      solution_text: null,
      language: null,
      code_snippet: null,
      attachments: null,
    });
    if (error) { setMsg(`❌ ${error.message}`); return; }
    setMsg('✅ Logged! Streak updated.');
  }

  if (!userId) return <div className="text-sm text-gray-600">Please sign in.</div>;
  if (loading) return <div className="text-sm text-gray-600">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input className="rounded-lg border px-3 py-2"
                 placeholder="Search title or platform"
                 value={query} onChange={e => setQuery(e.target.value)} />
          <select
            className="rounded-lg border px-3 py-2"
            value={diff}
            onChange={e => setDiff(e.target.value as 'All' | 'Easy' | 'Medium' | 'Hard')}
            aria-label="Filter by difficulty"
          >
            <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
          <input className="rounded-lg border px-3 py-2"
                 placeholder="Topic filter (e.g., DP)"
                 value={topic} onChange={e => setTopic(e.target.value)} />
          <div className="text-sm text-gray-500 self-center">{filtered.length} results</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map(q => (
          <div key={q.id} className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{q.title}</div>
                <div className="text-xs text-gray-500">
                  {q.platform ?? '—'} • {q.difficulty ?? '—'}
                </div>
                {q.topics?.length ? (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {q.topics.map(t => (
                      <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{t}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="ml-3 flex flex-col items-end gap-2">
                {q.platform_ref && (
                  <a className="text-sm text-indigo-600 hover:underline" href={q.platform_ref} target="_blank">
                    Open
                  </a>
                )}
                <button
                  onClick={() => markSolved(q.id)}
                  className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-500"
                >
                  Mark Solved Today
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}