'use client';

import React, { useEffect, useState } from 'react';
import { Bug, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type BugReport = {
  id: string;
  title: string;
  description: string;
  screenshotUrl?: string | null;
  status: 'OPEN' | 'REWARDED' | 'REJECTED';
  rewardSats: number;
  adminNotes?: string | null;
  createdAt: string;
  user: { fullName?: string | null; email: string };
};

export default function AdminBugReportsPage() {
  const [items, setItems] = useState<BugReport[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [rewards, setRewards] = useState<Record<string, number>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
    const res = await fetch(`${API_URL}/admin/bug-reports`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => { load(); }, []);

  const review = async (id: string, status: 'REWARDED' | 'REJECTED') => {
    if (loadingId) return;

    setLoadingId(id);
    setError(null);

    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const response = await fetch(`${API_URL}/admin/bug-reports/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, rewardSats: rewards[id] || 0, adminNotes: notes[id] || '' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to review bug report.');
      }

      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to review bug report.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white">Bug Reports</h1>
          <p className="text-sm text-gray-400 mt-1">Review user bug reports and reward valid findings.</p>
        </div>
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2"><Bug className="w-5 h-5 text-sats-orange-500" /><h2 className="text-lg font-black text-white">{item.title}</h2></div>
                  <p className="text-sm text-gray-400 mt-1">By {item.user.fullName || item.user.email}</p>
                </div>
                <span className="text-xs font-bold uppercase text-gray-300">{item.status}</span>
              </div>
              <p className="mt-4 text-sm text-gray-300">{item.description}</p>
              {item.screenshotUrl && <a href={item.screenshotUrl} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-sats-orange-500">Open screenshot</a>}
              {item.status === 'OPEN' && (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="number" placeholder="Reward sats" value={rewards[item.id] || ''} onChange={(e) => setRewards((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
                  <input type="text" placeholder="Admin notes" value={notes[item.id] || ''} onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
                  <button onClick={() => review(item.id, 'REWARDED')} disabled={loadingId !== null} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-black text-black disabled:opacity-50">{loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}Approve & Reward</button>
                  <button onClick={() => review(item.id, 'REJECTED')} disabled={loadingId !== null} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-black text-white disabled:opacity-50">{loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
