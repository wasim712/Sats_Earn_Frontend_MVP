'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, CircleHelp, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { FaqAccordion } from '@/components/user/content/FaqAccordion';
import { USER_API_URL, getContentErrorMessage, getStoredUserToken } from '@/components/user/content/userContent.helpers';
import type { UserContentLoadState, UserFaqItem } from '@/components/user/content/userContent.types';

export default function RewardsPage() {
  const [faqs, setFaqs] = useState<UserFaqItem[]>([]);
  const [state, setState] = useState<UserContentLoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadFaqs = async () => {
    try {
      setState('loading');
      setError(null);

      const token = getStoredUserToken();
      const response = await fetch(`${USER_API_URL}/users/faqs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to load FAQs.');
      }

      setFaqs(Array.isArray(data) ? data : []);
      setState('success');
    } catch (err) {
      setFaqs([]);
      setError(getContentErrorMessage(err, 'Unable to load FAQs right now.'));
      setState('error');
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-sats-orange-500/15 bg-[#050505]/95 p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_22%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sats-orange-400">
              <Sparkles className="h-4 w-4" />
              Help Center
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">FAQs & Rewards Help</h1>
              <p className="max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
                Read the most common questions about SatsEarn, earning flow, tasks, rewards, and withdrawals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadFaqs}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white transition hover:border-sats-orange-500/30 hover:bg-sats-orange-500/10"
          >
            {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh FAQs
          </button>
        </div>
      </section>

      {state === 'error' && error ? (
        <div className="flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Unable to load FAQs</p>
            <p className="mt-1 text-red-200/80">{error}</p>
          </div>
        </div>
      ) : null}

      {state === 'loading' ? (
        <div className="rounded-[32px] border border-[#161616] bg-[#050505] p-8 text-sm text-gray-400">Loading FAQs...</div>
      ) : faqs.length > 0 ? (
        <FaqAccordion items={faqs} />
      ) : (
        <div className="rounded-[32px] border border-[#161616] bg-[#050505] p-8 text-center text-gray-400">
          <CircleHelp className="mx-auto h-10 w-10 text-sats-orange-500/70" />
          <p className="mt-4 text-base font-bold text-white">No FAQs published yet.</p>
          <p className="mt-2 text-sm">Ask the admin to publish FAQ content from the admin panel.</p>
        </div>
      )}
    </div>
  );
}
