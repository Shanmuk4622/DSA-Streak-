'use client';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Save, Upload, Code, FileText, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="flex-1 p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] mb-2">Log Your Progress</h1>
        <p className="text-[#cbd5e1]">Track your problem-solving journey and maintain your streak</p>
      </div>

      <div className="card p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Question Title */}
          <div>
            <label className="block text-sm font-semibold text-[#f8fafc] mb-2">
              Question Title *
            </label>
            <input 
              className="input-field w-full"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Two Sum, Valid Parentheses"
              required 
            />
          </div>

          {/* Platform, Link, Difficulty */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-[#f8fafc] mb-2">Platform</label>
              <input
                className="input-field w-full"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                placeholder="LeetCode, Codeforces"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#f8fafc] mb-2">Link/ID</label>
              <input 
                className="input-field w-full"
                value={platformRef} 
                onChange={e => setPlatformRef(e.target.value)}
                placeholder="Problem link or ID" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#f8fafc] mb-2">Difficulty</label>
              <select
                className="input-field w-full"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          {/* Topics and Language */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[#f8fafc] mb-2">
                Topic Tags (comma separated)
              </label>
              <input 
                className="input-field w-full"
                value={topics} 
                onChange={e => setTopics(e.target.value)}
                placeholder="Arrays, DP, Graphs, Trees" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#f8fafc] mb-2">Language</label>
              <input
                className="input-field w-full"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                placeholder="C++, Python, Java"
              />
            </div>
          </div>

          {/* Solution Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#f8fafc] mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Solution Notes
            </label>
            <textarea 
              className="input-field w-full h-32 resize-none"
              value={solutionText} 
              onChange={e => setSolutionText(e.target.value)}
              placeholder="Describe your approach, time complexity, space complexity..."
            />
          </div>

          {/* Code Snippet */}
          <div>
            <label className="block text-sm font-semibold text-[#f8fafc] mb-2">
              <Code className="w-4 h-4 inline mr-2" />
              Code Snippet
            </label>
            <textarea 
              className="input-field w-full h-48 resize-none font-mono text-sm"
              value={codeSnippet} 
              onChange={e => setCodeSnippet(e.target.value)}
              placeholder="Paste your solution code here..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#f8fafc] mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Attachments (images/files)
            </label>
            <input 
              type="file" 
              multiple
              className="input-field w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6366f1] file:text-white hover:file:bg-[#4f46e5] file:cursor-pointer"
              onChange={e => setFiles(e.target.files)} 
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary inline-flex items-center space-x-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving…' : 'Save Progress'}</span>
            </button>
          </div>

          {/* Message */}
          {msg && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg ${
              msg.includes('✅') 
                ? 'bg-[#10b981] bg-opacity-20 text-[#10b981] border border-[#10b981]' 
                : 'bg-[#ef4444] bg-opacity-20 text-[#ef4444] border border-[#ef4444]'
            }`}>
              {msg.includes('✅') ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{msg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
