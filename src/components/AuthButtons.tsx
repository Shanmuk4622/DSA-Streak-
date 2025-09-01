"use client";

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function AuthButtons() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (loading) return null;

  if (loggedIn) {
    return (
      <button
        onClick={() => supabase.auth.signOut()}
        className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
      >
        Sign out
      </button>
    );
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setMsg(null);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) setMsg(error.message);
        else setMsg('Check your email for a login link!');
      }}
      className="flex gap-2 items-center"
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="rounded-lg border px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
      >
        Sign in
      </button>
      {msg && <span className="ml-2 text-xs text-gray-600">{msg}</span>}
    </form>
  );
}