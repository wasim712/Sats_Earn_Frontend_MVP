'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckSquare, Loader2, Save } from 'lucide-react';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const FREE_TIERS = ['BASIC', 'COPPER', 'BRONZE', 'SILVER', 'GOLD'];
const PREMIUM_TIERS = ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
const PROOF_TYPES = ['SCREENSHOT', 'URL', 'TEXT_RESPONSE', 'API_VERIFIED'];
const PLATFORMS = ['NONE', 'TWITTER', 'YOUTUBE', 'INSTAGRAM', 'TELEGRAM', 'FACEBOOK', 'LINKEDIN', 'APP_STORE', 'PLAY_STORE', 'WEBSITE'];

const createMatrix = () => [...FREE_TIERS, ...PREMIUM_TIERS].reduce<Record<string, number>>((acc, tier) => {
  acc[tier] = 0;
  return acc;
}, {});

const parseWholeNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  const parsed = Number.parseInt(digits, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function AddStandaloneTaskPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proofType: 'SCREENSHOT',
    targetUrl: '',
    requiredPlatform: 'NONE',
    xpReward: 0,
    tierRewardMatrix: createMatrix(),
  });

  const hasReward = useMemo(
    () => [...FREE_TIERS, ...PREMIUM_TIERS].some((tier) => Number(formData.tierRewardMatrix[tier] || 0) > 0),
    [formData.tierRewardMatrix]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!hasReward) {
      setErrorMsg('Add at least one tier reward value.');
      return;
    }

    setIsSaving(true);
    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const response = await obfuscatedFetch(`${API_URL}/admin/tasks/standalone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          proofType: formData.proofType,
          targetUrl: formData.targetUrl || undefined,
          requiredPlatform: formData.requiredPlatform,
          xpReward: formData.xpReward,
          tierRewardMatrix: formData.tierRewardMatrix,
        }),
      });

      const payload = await parseObfuscatedJson<any>(response);
      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || 'Failed to create standalone task');
      }

      setSuccessMsg('Standalone task created successfully.');
      setFormData({
        title: '',
        description: '',
        proofType: 'SCREENSHOT',
        targetUrl: '',
        requiredPlatform: 'NONE',
        xpReward: 0,
        tierRewardMatrix: createMatrix(),
      });
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to create standalone task');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/admin/campaigns')}
            className="inline-flex items-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2.5 text-sm font-bold text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sats-orange-400">
            <CheckSquare className="w-4 h-4" /> Standalone Task
          </div>
        </div>

        <div className="rounded-[28px] border border-[#1a1a1a] bg-[#080808] p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight">Create Standalone Task</h1>
            <p className="mt-2 text-sm text-gray-400">This creates one task without needing you to manually create a campaign first.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Title</label>
                <input value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} required className="w-full rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} required className="min-h-[120px] w-full rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Proof Type</label>
                <select value={formData.proofType} onChange={(e) => setFormData((prev) => ({ ...prev, proofType: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-white outline-none focus:border-sats-orange-500">
                  {PROOF_TYPES.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Required Platform</label>
                <select value={formData.requiredPlatform} onChange={(e) => setFormData((prev) => ({ ...prev, requiredPlatform: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-white outline-none focus:border-sats-orange-500">
                  {PLATFORMS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Task XP Reward</label>
                <input required type="text" inputMode="numeric" pattern="[0-9]*" value={formData.xpReward || ''} onChange={(e) => setFormData((prev) => ({ ...prev, xpReward: parseWholeNumber(e.target.value) }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-white outline-none focus:border-sats-orange-500" placeholder="0" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Target URL</label>
                <input value={formData.targetUrl} onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-white outline-none focus:border-sats-orange-500" placeholder="https://..." />
              </div>
            </div>

            <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4 space-y-5">
              <div>
                <p className="text-sm font-bold text-white">Task Reward Table</p>
                <p className="text-xs text-gray-500 mt-0.5">Set the sats reward for each tier on this standalone task.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Free Tiers</div>
                  <div className="grid grid-cols-1 gap-3">
                    {FREE_TIERS.map((tier) => (
                      <div key={tier} className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-2.5 flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate mr-2">{tier}</label>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.tierRewardMatrix[tier] || ''} onChange={(e) => setFormData((prev) => ({ ...prev, tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: parseWholeNumber(e.target.value) } }))} placeholder="0" className="w-16 rounded-lg border border-[#2a2a2a] bg-[#111] px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">Premium Tiers</div>
                  <div className="grid grid-cols-1 gap-3">
                    {PREMIUM_TIERS.map((tier) => (
                      <div key={tier} className="rounded-xl border border-yellow-500/30 bg-[#0a0a0a] p-2.5 flex items-center justify-between shadow-[0_0_0_1px_rgba(234,179,8,0.06)]">
                        <label className="text-[10px] font-black text-yellow-300 uppercase tracking-wider truncate mr-2">{tier}</label>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.tierRewardMatrix[tier] || ''} onChange={(e) => setFormData((prev) => ({ ...prev, tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: parseWholeNumber(e.target.value) } }))} placeholder="0" className="w-16 rounded-lg border border-yellow-500/20 bg-[#111] px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{errorMsg}</div>}
            {successMsg && <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{successMsg}</div>}

            <div className="flex justify-end">
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 text-sm font-black text-black hover:bg-sats-orange-400 disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Create Standalone Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
