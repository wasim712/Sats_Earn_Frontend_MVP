'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bug, Loader2, Send } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type BugReport = {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'REWARDED' | 'REJECTED';
  rewardSats: number;
  adminNotes?: string | null;
  createdAt: string;
};

export default function BugBountyPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<BugReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
    const res = await fetch(`${API_URL}/users/bug-reports`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setHistory(await res.json());
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) formData.append('screenshot', file);
      const res = await fetch(`${API_URL}/users/bug-reports`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit bug report.');
      setSuccess('Bug report submitted successfully. Admin will review it.');
      setTitle('');
      setDescription('');
      setFile(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white">Bug Bounty</h1>
          <p className="text-sm text-gray-400 mt-1">Report app bugs. If valid, admin can approve and reward you.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Bug Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" required minLength={5} />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-36 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" required minLength={20} />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-2">Screenshot (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
          </div>
          {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex gap-2"><AlertTriangle className="w-4 h-4 mt-0.5" />{error}</div>}
          {success && <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>}
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 font-black text-black disabled:opacity-50">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Submit Bug</button>
        </form>

        <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6">
          <h2 className="text-xl font-black text-white mb-4">My Bug Reports</h2>
          <div className="space-y-3">
            {history.length === 0 ? <p className="text-sm text-gray-400">No bug reports yet.</p> : history.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2"><Bug className="w-4 h-4 text-sats-orange-500" /><span className="font-bold text-white">{item.title}</span></div>
                  <span className="text-xs font-bold uppercase text-gray-300">{item.status}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{item.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <span>{item.rewardSats > 0 ? `${item.rewardSats} sats rewarded` : 'No reward yet'}</span>
                </div>
                {item.adminNotes && <p className="mt-2 text-xs text-yellow-300">Admin note: {item.adminNotes}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
