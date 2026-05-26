'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bug, BugPlay, Loader2, Send, ShieldAlert, Sparkles, Trophy } from 'lucide-react';
import { obfuscatedFetch, obfuscatedJsonRequest, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const TITLE_MIN = 5;
const TITLE_MAX = 120;
const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 5000;
const SCREENSHOT_MAX_MB = 5;

type BugReport = {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'REWARDED' | 'REJECTED';
  rewardSats: number;
  adminNotes?: string | null;
  createdAt: string;
};

type BugBountyStats = {
  bugsRewarded: number;
  satsPaidOut: number;
  openReports: number;
};

const defaultStats: BugBountyStats = {
  bugsRewarded: 0,
  satsPaidOut: 0,
  openReports: 0,
};

const rewardTiers = [
  {
    title: 'Critical',
    range: '500 – 1,000 sats',
    description: 'Security vulnerabilities, fund loss, data exposure, authentication bypass',
    tone: 'border-red-500/25 bg-red-500/10 text-red-300',
  },
  {
    title: 'High',
    range: '100 – 500 sats',
    description: 'Gameplay bugs affecting outcomes, incorrect payouts, broken core features',
    tone: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
  },
  {
    title: 'Medium',
    range: '10 – 100 sats',
    description: 'UI glitches, broken flows, display errors, incorrect calculations',
    tone: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
  },
  {
    title: 'Low',
    range: '1 – 10 sats',
    description: 'Typos, minor visual issues, cosmetic inconsistencies, small UX improvements',
    tone: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  },
];

function getToken() {
  return sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token') || '';
}

function getStatusUi(status: BugReport['status']) {
  switch (status) {
    case 'REWARDED':
      return {
        badge: 'border-green-500/20 bg-green-500/10 text-green-300',
        card: 'border-green-500/15 bg-[linear-gradient(180deg,rgba(8,20,13,0.98),rgba(5,10,8,0.98))]',
        label: 'Rewarded',
      };
    case 'REJECTED':
      return {
        badge: 'border-red-500/20 bg-red-500/10 text-red-300',
        card: 'border-red-500/15 bg-[linear-gradient(180deg,rgba(24,9,9,0.98),rgba(12,5,5,0.98))]',
        label: 'Rejected',
      };
    default:
      return {
        badge: 'border-sats-orange-500/20 bg-sats-orange-500/10 text-sats-orange-300',
        card: 'border-[#1a1a1a] bg-[#0a0a0a]',
        label: 'Open',
      };
  }
}

export default function BugBountyPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<BugReport[]>([]);
  const [stats, setStats] = useState<BugBountyStats>(defaultStats);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validationMessage = useMemo(() => {
    if (!title.trim()) return 'Bug title is required.';
    if (title.trim().length < TITLE_MIN) return `Bug title must be at least ${TITLE_MIN} characters.`;
    if (title.trim().length > TITLE_MAX) return `Bug title must be at most ${TITLE_MAX} characters.`;
    if (!description.trim()) return 'Description is required.';
    if (description.trim().length < DESCRIPTION_MIN) return `Description must be at least ${DESCRIPTION_MIN} characters.`;
    if (description.trim().length > DESCRIPTION_MAX) return `Description must be at most ${DESCRIPTION_MAX} characters.`;
    if (file && file.size > SCREENSHOT_MAX_MB * 1024 * 1024) return `Screenshot must be smaller than ${SCREENSHOT_MAX_MB} MB.`;
    return null;
  }, [title, description, file]);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const [historyRes, statsRes] = await Promise.all([
        obfuscatedFetch(`${API_URL}/users/bug-reports`, { headers }),
        obfuscatedFetch(`${API_URL}/users/bug-reports/stats`, { headers }),
      ]);

      if (historyRes.ok) {
        const data = await parseObfuscatedJson<BugReport[] | { data?: BugReport[] }>(historyRes);
        setHistory(Array.isArray(data) ? data : data?.data || []);
      }

      if (statsRes.ok) {
        const data = await parseObfuscatedJson<BugBountyStats | { data?: BugBountyStats }>(statsRes);
        setStats('data' in (data as object) && (data as { data?: BugBountyStats }).data ? (data as { data: BugBountyStats }).data : (data as BugBountyStats));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load bug bounty data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (file) formData.append('screenshot', file);

      await obfuscatedJsonRequest<{ success?: boolean }>(`${API_URL}/users/bug-reports`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setSuccess('Bug report submitted successfully. Admin will review it.');
      setTitle('');
      setDescription('');
      setFile(null);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to submit bug report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="relative overflow-hidden rounded-[28px] border border-sats-orange-500/12 bg-[#050505]/95 px-5 py-6 md:px-7 md:py-7 shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_20%)]" />
          <div className="relative flex flex-col gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                <ShieldAlert className="h-3.5 w-3.5" />
                Bug Bounty Program
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">Find Bugs, Earn Sats</h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400 md:text-[15px]">
                  Help us build a better platform. Report bugs and earn satoshi rewards based on severity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatsCard label="Bugs Rewarded" value={stats.bugsRewarded} icon={<Trophy className="w-4 h-4 text-sats-orange-400" />} isLoading={isLoading} />
              <StatsCard label="Sats Paid Out" value={stats.satsPaidOut.toLocaleString()} icon={<Sparkles className="w-4 h-4 text-green-400" />} isLoading={isLoading} />
              <StatsCard label="Open Reports" value={stats.openReports} icon={<BugPlay className="w-4 h-4 text-sky-400" />} isLoading={isLoading} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 md:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-black text-white">Reward Tiers</h2>
            <p className="mt-1 text-sm text-gray-500">We review bug severity carefully and reward based on actual impact.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rewardTiers.map((tier) => (
              <div key={tier.title} className={`rounded-2xl border p-4 ${tier.tone}`}>
                <p className="text-sm font-black uppercase tracking-[0.18em]">{tier.title}</p>
                <p className="mt-3 text-lg font-black text-white">{tier.range}</p>
                <p className="mt-3 text-sm leading-6 text-white/75">{tier.description}</p>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 md:p-7 space-y-5">
          <div>
            <h2 className="text-xl font-black text-white">Submit a Bug Report</h2>
            <p className="mt-1 text-sm text-gray-500">Give us enough detail to reproduce the issue accurately.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Bug Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white outline-none focus:border-sats-orange-500/40"
              required
              minLength={TITLE_MIN}
              maxLength={TITLE_MAX}
            />
            <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">{title.trim().length}/{TITLE_MAX}</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full min-h-40 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white outline-none focus:border-sats-orange-500/40"
              required
              minLength={DESCRIPTION_MIN}
              maxLength={DESCRIPTION_MAX}
            />
            <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">{description.trim().length}/{DESCRIPTION_MAX}</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Screenshot (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white"
            />
            <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">Max {SCREENSHOT_MAX_MB} MB image file</p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {success ? <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div> : null}

          <button
            type="submit"
            disabled={isSubmitting || Boolean(validationMessage)}
            className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 font-black text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(249,115,22,0.18)]"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Bug
          </button>
        </form>

        <section className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 md:p-7">
          <h2 className="text-xl font-black text-white mb-4">My Bug Reports</h2>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-sats-orange-500" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-400">No bug reports yet.</p>
            ) : (
              history.map((item) => {
                const statusUi = getStatusUi(item.status);

                return (
                  <div key={item.id} className={`rounded-2xl border p-4 ${statusUi.card}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Bug className="w-4 h-4 text-sats-orange-500 shrink-0" />
                        <span className="font-bold text-white truncate">{item.title}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusUi.badge}`}>{statusUi.label}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 leading-6">{item.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                      <span>{item.rewardSats > 0 ? `${item.rewardSats.toLocaleString()} sats rewarded` : 'No reward yet'}</span>
                    </div>
                    {item.adminNotes ? <p className="mt-2 text-xs text-yellow-300">Admin note: {item.adminNotes}</p> : null}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon, isLoading }: { label: string; value: string | number; icon: React.ReactNode; isLoading: boolean }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      {isLoading ? <div className="mt-4 h-8 w-16 rounded-lg bg-white/5 animate-pulse" /> : <p className="mt-4 text-3xl font-black text-white">{value}</p>}
    </div>
  );
}
