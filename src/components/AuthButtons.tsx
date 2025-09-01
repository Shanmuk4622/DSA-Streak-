"use client";

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { LogOut, Mail, AlertCircle } from 'lucide-react';

export default function AuthButtons() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const hasValidCredentials = supabaseUrl && supabaseAnonKey && 
      supabaseUrl !== 'your_supabase_project_url_here' && 
      supabaseAnonKey !== 'your_supabase_anon_key_here';

    if (!hasValidCredentials) {
      setSupabaseError('Supabase not configured. Please add your credentials to .env.local');
      setLoading(false);
      return;
    }

    // Only try to get session if we have valid credentials
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Supabase auth error:', error);
        setSupabaseError('Authentication service unavailable');
      } else {
        setLoggedIn(!!data.session);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to get session:', error);
      setSupabaseError('Failed to connect to authentication service');
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (loading) return <div className="text-[#cbd5e1]">Loading...</div>;

  if (supabaseError) {
    return (
      <div className="flex items-center space-x-2 text-sm text-[#ef4444] bg-[#ef4444]/10 px-4 py-2 rounded-lg border border-[#ef4444]/20">
        <AlertCircle className="w-4 h-4" />
        <span>{supabaseError}</span>
      </div>
    );
  }

  if (loggedIn) {
    return (
      <button
        onClick={() => supabase.auth.signOut()}
        className="btn-secondary inline-flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setMsg(null);
        try {
          const { error } = await supabase.auth.signInWithOtp({ email });
          if (error) setMsg(error.message);
          else setMsg('Check your email for a login link!');
        } catch (error) {
          console.error('Sign in error:', error);
          setMsg('Failed to send login link. Please try again.');
        }
      }}
      className="flex gap-3 items-center"
    >
      <div className="relative">
        <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b]" />
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field pl-10 pr-4 py-2"
        />
      </div>
      <button
        type="submit"
        className="btn-primary"
      >
        Sign in
      </button>
      {msg && (
        <div className={`flex items-center space-x-2 text-xs px-3 py-2 rounded-lg ${
          msg.includes('Check your email') 
            ? 'text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20' 
            : 'text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20'
        }`}>
          <span>{msg}</span>
        </div>
      )}
    </form>
  );
}