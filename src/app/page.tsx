'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome{userId ? '' : ', please sign in'}</h1>

      <p className="text-sm text-gray-600">
        Start by adding your first solve. This will also create/update your streak automatically.
      </p>

      <div className="flex gap-3">
        <Link href="/submit" className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500">
          Add Solve (Manual)
        </Link>
      </div>

      <hr className="my-4" />

      <div className="rounded-xl bg-white p-4 shadow">
        <p className="text-gray-700">
          Coming next: Dashboard stats, calendar heatmap, notes, and question bank.
        </p>
      </div>
    </div>
  );
}
