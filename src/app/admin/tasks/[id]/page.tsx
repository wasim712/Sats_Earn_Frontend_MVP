'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStandaloneTaskById, updateStandaloneTask } from '@/features/admin/adminTasksSlice';

const FREE_TIERS = ['BASIC', 'COPPER', 'BRONZE', 'SILVER', 'GOLD'];
const PREMIUM_TIERS = ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
const PROOF_TYPES = ['SCREENSHOT', 'URL', 'TEXT_RESPONSE', 'API_VERIFIED'];
const PLATFORMS = ['NONE', 'DESKTOP', 'ANDROID', 'IOS'];

function parseWholeNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly === '') return 0;
  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function AdminTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const taskId = params?.id as string;
  const { selectedTask, isLoading, isSaving, error } = useAppSelector((state) => state.adminTasks);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUrl: '',
    proofType: 'SCREENSHOT',
    requiredPlatform: 'NONE',
    xpRewardOverride: 0,
    tierRewardMatrixOverride: {} as Record<string, number>,
  });

  useEffect(() => {
    if (taskId) dispatch(fetchStandaloneTaskById(taskId));
  }, [dispatch, taskId]);

  useEffect(() => {
    if (!selectedTask) return;
    const requirements = (selectedTask.requirements as Record<string, any> | null) || {};
    setFormData({
      title: selectedTask.title || '',
      description: selectedTask.description || '',
      targetUrl: selectedTask.targetUrl || '',
      proofType: (selectedTask as any).proofType || 'SCREENSHOT',
      requiredPlatform: requirements.requiredPlatform || 'NONE',
      xpRewardOverride: selectedTask.xpRewardOverride || 0,
      tierRewardMatrixOverride: (selectedTask.tierRewardMatrixOverride as Record<string, number>) || {},
    });
  }, [selectedTask]);

  const allTiers = useMemo(() => [...FREE_TIERS, ...PREMIUM_TIERS], []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await dispatch(updateStandaloneTask({
        taskId,
        data: {
          title: formData.title,
          description: formData.description,
          targetUrl: formData.targetUrl,
          proofType: formData.proofType,
          requiredPlatform: formData.requiredPlatform,
          xpRewardOverride: formData.xpRewardOverride,
          tierRewardMatrixOverride: formData.tierRewardMatrixOverride,
        },
      })).unwrap();
      setSuccessMsg('Task updated successfully.');
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to update task.');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#020202] p-8 text-white">Loading task...</div>;
  if (error && !selectedTask) return <div className="min-h-screen bg-[#020202] p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => router.push('/admin/tasks')} className="inline-flex items-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0a0a0a]">
            <ArrowLeft className="w-4 h-4" /> Back to Tasks
          </button>
        </div>

        <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 md:p-8">
          <h1 className="text-3xl font-black text-white">Standalone Task Details</h1>
          <p className="mt-2 text-sm text-gray-400">Manage this single task using a dedicated task page and endpoint.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Title</label>
              <input value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Proof Type</label>
              <select value={formData.proofType} onChange={(e) => setFormData((prev) => ({ ...prev, proofType: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500">
                {PROOF_TYPES.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Description</label>
              <textarea rows={4} value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Required Platform</label>
              <select value={formData.requiredPlatform} onChange={(e) => setFormData((prev) => ({ ...prev, requiredPlatform: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500">
                {PLATFORMS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Target URL</label>
              <input value={formData.targetUrl} onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">Task XP Reward</label>
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.xpRewardOverride || ''} onChange={(e) => setFormData((prev) => ({ ...prev, xpRewardOverride: parseWholeNumber(e.target.value) }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" placeholder="0" />
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 space-y-5">
            <div>
              <p className="text-sm font-bold text-white">Task Reward Table</p>
              <p className="text-xs text-gray-500 mt-0.5">Set the sats reward for each tier on this standalone task.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Free Tiers</div>
                <div className="grid grid-cols-1 gap-3">
                  {FREE_TIERS.map((tier) => (
                    <div key={tier} className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-2.5 flex items-center justify-between">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate mr-2">{tier}</label>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.tierRewardMatrixOverride[tier] || ''} onChange={(e) => setFormData((prev) => ({ ...prev, tierRewardMatrixOverride: { ...prev.tierRewardMatrixOverride, [tier]: parseWholeNumber(e.target.value) } }))} className="w-16 rounded-lg border border-[#2a2a2a] bg-[#111] px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">Premium Tiers</div>
                <div className="grid grid-cols-1 gap-3">
                  {PREMIUM_TIERS.map((tier) => (
                    <div key={tier} className="rounded-xl border border-yellow-500/30 bg-[#050505] p-2.5 flex items-center justify-between">
                      <label className="text-[10px] font-black text-yellow-300 uppercase tracking-wider truncate mr-2">{tier}</label>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.tierRewardMatrixOverride[tier] || ''} onChange={(e) => setFormData((prev) => ({ ...prev, tierRewardMatrixOverride: { ...prev.tierRewardMatrixOverride, [tier]: parseWholeNumber(e.target.value) } }))} className="w-16 rounded-lg border border-yellow-500/20 bg-[#111] px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {errorMsg ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{errorMsg}</div> : null}
          {successMsg ? <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{successMsg}</div> : null}

          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 text-sm font-black text-black hover:bg-sats-orange-400 disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
