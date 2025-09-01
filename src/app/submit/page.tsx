'use client';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function SubmitPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // form fields
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [platformRef, setPlatformRef] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [topics, setTopics] = useState('');
  const [language, setLanguage] = useState('C++');
  const [solutionText, setSolutionText] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!userId) { setMsg('Please sign in first.'); return; }
    if (!title.trim()) { setMsg('Title is required.'); return; }

    setLoading(true);
    try {
      // 1) upsert question
      const qPayload = {
        owner: userId,
        title: title.trim(),
        platform: platform || null,
        platform_ref: platformRef || null,
        difficulty,
        topics: topics ? topics.split(',').map(t => t.trim()).filter(Boolean) : null,
      };

      const { data: upserted, error: qErr } = await supabase
        .from('questions')
        .upsert(qPayload, { onConflict: 'owner,title' })
        .select('id')
        .single();
      if (qErr) throw qErr;
      const questionId = upserted!.id as string;

      // 2) upload files (if any)
      let attachments: string[] | null = null;
      if (files && files.length > 0) {
        attachments = [];
        for (const f of Array.from(files)) {
          const path = `${userId}/${Date.now()}_${f.name}`;
          const { error: upErr } = await supabase.storage
            .from('solutions')
            .upload(path, f, { upsert: false });
          if (upErr) throw upErr;
          attachments.push(path);
        }
      }

      // 3) insert solve (trigger updates streak)
      const { error: sErr } = await supabase
        .from('solves')
        .insert({
          user_id: userId,
          question_id: questionId,
          solution_text: solutionText || null,
          language: language || null,
          code_snippet: codeSnippet || null,
          attachments: attachments ? JSON.stringify(attachments) : null,
        });
      if (sErr) throw sErr;

      setMsg('✅ Saved! Your streak is updated.');
      setPlatform(''); setPlatformRef(''); setTopics('');
      setSolutionText(''); setCodeSnippet(''); setFiles(null);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setMsg(`❌ ${err.message}`);
      } else {
        setMsg('❌ Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-2xl bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Add Solve (Manual)</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Question Title *</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2"
                 value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">Platform</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              placeholder="e.g. LeetCode, Codeforces"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Link/ID</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2"
                   value={platformRef} onChange={e => setPlatformRef(e.target.value)}
                   placeholder="Enter problem link or ID" />
          </div>
          <div>
            <label htmlFor="difficulty-select" className="block text-sm font-medium">Difficulty</label>
            <select
              id="difficulty-select"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as Difficulty)}
            >
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Topic Tags (comma separated)</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2"
                 value={topics} onChange={e => setTopics(e.target.value)}
                 placeholder="e.g. Arrays, DP, Graphs" />
        </div>

        <div>
          <label className="block text-sm font-medium">Language</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            placeholder="e.g. C++, Python, Java"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Solution Notes</label>
          <textarea className="mt-1 h-28 w-full rounded-lg border px-3 py-2"
                    value={solutionText} onChange={e => setSolutionText(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium">Code Snippet</label>
          <textarea className="mt-1 h-40 w-full font-mono rounded-lg border px-3 py-2"
                    value={codeSnippet} onChange={e => setCodeSnippet(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium">Attachments (images/files)</label>
          <input type="file" multiple
                 className="mt-1 w-full rounded-lg border px-3 py-2"
                 onChange={e => setFiles(e.target.files)} />
        </div>

        <button type="submit" disabled={loading}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500 disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Solve'}
        </button>

        {msg && <p className="pt-2 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
