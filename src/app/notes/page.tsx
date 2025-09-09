'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Note = {
  id: string;
  title: string;
  content: string;
  topics: string[] | null;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

export default function NotesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // editor state
  const [editing, setEditing] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user?.id) { setLoading(false); return; }
      setUserId(u.user.id);
      await loadNotes();
      setLoading(false);
    })();
  }, []);

  async function loadNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false });
    if (error) console.error(error);
    setNotes(data ?? []);
  }

  function resetEditor(n?: Note | null) {
    if (!n) {
      setEditing(null);
      setTitle(''); setTopics(''); setContent(''); setPinned(false);
    } else {
      setEditing(n);
      setTitle(n.title);
      setTopics(n.topics?.join(', ') ?? '');
      setContent(n.content);
      setPinned(n.pinned);
    }
  }

  async function saveNote() {
    setMsg(null);
    if (!title.trim() || !content.trim()) {
      setMsg('Title and content are required.');
      return;
    }
    const payload = {
      title: title.trim(),
      content: content,
      topics: topics ? topics.split(',').map(t => t.trim()).filter(Boolean) : null,
      pinned
    };

    if (editing) {
      const { error } = await supabase.from('notes')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editing.id);
      if (error) { setMsg(error.message); return; }
    } else {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from('notes')
        .insert({ user_id: u.user!.id, ...payload });
      if (error) { setMsg(error.message); return; }
    }
    resetEditor(null);
    await loadNotes();
    setMsg('✅ Saved.');
  }

  async function deleteNote(id: string) {
    if (!confirm('Delete this note?')) return;
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) alert(error.message);
    await loadNotes();
  }

  if (!userId) return <div className="text-sm text-gray-600">Please sign in.</div>;
  if (loading) return <div className="text-sm text-gray-600">Loading…</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Editor */}
      <div className="md:col-span-1 rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">{editing ? 'Edit Note' : 'New Note'}</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2"
                   value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Topics (comma separated)</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2"
                   value={topics} onChange={e => setTopics(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea className="mt-1 h-48 w-full rounded-lg border px-3 py-2"
                      value={content} onChange={e => setContent(e.target.value)} />
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
            Pinned
          </label>

          <div className="flex gap-2">
            <button onClick={saveNote}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
              Save
            </button>
            {editing && (
              <button onClick={() => resetEditor(null)}
                      className="rounded-lg border px-4 py-2 hover:bg-gray-50">
                Cancel
              </button>
            )}
          </div>
          {msg && <p className="text-xs text-gray-600">{msg}</p>}
        </div>
      </div>

      {/* List */}
      <div className="md:col-span-2 rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Your Notes</h2>
        <ul className="divide-y">
          {notes.length === 0 && <li className="py-3 text-sm text-gray-600">No notes yet.</li>}
          {notes.map(n => (
            <li key={n.id} className="py-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{n.title}</div>
                    {n.pinned && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs">Pinned</span>}
                  </div>
                  {n.topics?.length ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {n.topics.map(t => (
                        <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{n.content}</p>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => resetEditor(n)}
                    className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">Updated: {new Date(n.updated_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}