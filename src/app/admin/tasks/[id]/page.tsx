'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteStandaloneTask, fetchStandaloneTaskById, updateStandaloneTask } from '@/features/admin/adminTasksSlice';

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
  const { selectedTask, isLoading, isSaving, isDeleting, error } = useAppSelector((state) => state.adminTasks);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUrl: '',
    proofType: 'SCREENSHOT',
    requiredPlatform: 'NONE',
    xpReward: 0,
    tierRewardMatrix: {} as Record<string, number>,
  });

  useEffect(() => {
    if (taskId) dispatch(fetchStandaloneTaskById(taskId));
  }, [dispatch, taskId]);

  useEffect(() => {
    if (!selectedTask) return;
    setFormData({
      title: selectedTask.title || '',
      description: selectedTask.description || '',
      targetUrl: selectedTask.targetUrl || '',
      proofType: selectedTask.proofType || 'SCREENSHOT',
      requiredPlatform: selectedTask.requiredPlatform || 'NONE',
      xpReward: selectedTask.xpReward ?? selectedTask.xpRewardOverride ?? 0,
      tierRewardMatrix: selectedTask.tierRewardMatrix || selectedTask.tierRewardMatrixOverride || {},
    });
  }, [selectedTask]);

  const allTiers = useMemo(() => [...FREE_TIERS, ...PREMIUM_TIERS], []);
  const highestReward = useMemo(() => Math.max(...Object.values(formData.tierRewardMatrix).map((value) => Number(value || 0)), 0), [formData.tierRewardMatrix]);

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
          xpReward: formData.xpReward,
          tierRewardMatrix: formData.tierRewardMatrix,
        },
      })).unwrap();
      setSuccessMsg('Standalone task updated successfully.');
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to update task.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this standalone task? This hides it from admins and users.');
    if (!confirmed) return;

    setErrorMsg(null);
    try {
      await dispatch(deleteStandaloneTask(taskId)).unwrap();
      router.push('/admin/tasks');
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to delete task.');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#020202] p-8 text-white">Loading task...</div>;
  if (error && !selectedTask) return <div className="min-h-screen bg-[#020202] p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => router.push('/admin/tasks')} className="inline-flex items-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0a0a0a]">
            <ArrowLeft className="w-4 h-4" /> Back to Tasks
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-black text-red-300 transition hover:bg-red-500/15 disabled:opacity-50">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Task
          </button>
        </div>

        <section className="rounded-[30px] border border-[#1a1a1a] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_30%),#050505] p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-sats-orange-400">
                Standalone Task
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{formData.title || 'Standalone Task Details'}</h1>
                <p className="mt-3 text-sm md:text-base leading-7 text-gray-400">
                  Edit the task settings, review tiered rewards, and manage visibility from a dedicated standalone flow.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[280px]">
              <InfoCard label="Proof Type" value={formData.proofType} />
              <InfoCard label="Platform" value={formData.requiredPlatform} />
              <InfoCard label="XP Reward" value={String(formData.xpReward)} />
              <InfoCard label="Top Reward" value={`${highestReward} sats`} />
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[30px] border border-[#1a1a1a] bg-[#050505] p-6 md:p-8 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Title">
              <input value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
            </Field>
            <Field label="Proof Type">
              <select value={formData.proofType} onChange={(e) => setFormData((prev) => ({ ...prev, proofType: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500">
                {PROOF_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} rows={5} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
            </Field>
            <Field label="Required Platform">
              <select value={formData.requiredPlatform} onChange={(e) => setFormData((prev) => ({ ...prev, requiredPlatform: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500">
                {PLATFORMS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Target URL">
              <input value={formData.targetUrl} onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" />
            </Field>
            <Field label="Task XP Reward">
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.xpReward || ''} onChange={(e) => setFormData((prev) => ({ ...prev, xpReward: parseWholeNumber(e.target.value) }))} className="w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-sats-orange-500" placeholder="0" />
            </Field>
          </div>

          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 space-y-5">
            <div>
              <p className="text-sm font-bold text-white">Tier Reward Matrix</p>
              <p className="text-xs text-gray-500 mt-1">Configure the exact sats reward per tier for this standalone task.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Free Tiers</div>
                <div className="grid grid-cols-1 gap-3">
                  {FREE_TIERS.map((tier) => (
                    <TierInput key={tier} label={tier} value={formData.tierRewardMatrix[tier] || ''} onChange={(value) => setFormData((prev) => ({ ...prev, tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: parseWholeNumber(value) } }))} />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">Premium Tiers</div>
                <div className="grid grid-cols-1 gap-3">
                  {PREMIUM_TIERS.map((tier) => (
                    <TierInput key={tier} label={tier} value={formData.tierRewardMatrix[tier] || ''} premium onChange={(value) => setFormData((prev) => ({ ...prev, tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: parseWholeNumber(value) } }))} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {errorMsg ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{errorMsg}</div> : null}
          {successMsg ? <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{successMsg}</div> : null}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <button type="button" onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/15 disabled:opacity-50">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Task
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 text-sm font-black text-black hover:bg-sats-orange-400 disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-2 text-base font-black text-white">{value}</div>
    </div>
  );
}

function TierInput({ label, value, onChange, premium = false }: { label: string; value: string | number; onChange: (value: string) => void; premium?: boolean }) {
  return (
    <div className={`rounded-xl p-2.5 flex items-center justify-between ${premium ? 'border border-yellow-500/30 bg-[#050505]' : 'border border-[#1a1a1a] bg-[#050505]'}`}>
      <label className={`text-[10px] font-black uppercase tracking-wider truncate mr-2 ${premium ? 'text-yellow-300' : 'text-gray-500'}`}>{label}</label>
      <input type="text" inputMode="numeric" pattern="[0-9]*" value={value} onChange={(e) => onChange(e.target.value)} className={`w-16 rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none ${premium ? 'border border-yellow-500/20 bg-[#111] focus:border-sats-orange-500' : 'border border-[#2a2a2a] bg-[#111] focus:border-sats-orange-500'}`} />
    </div>
  );
}
