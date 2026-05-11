'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save, Sparkles, Trophy, Flame, Coins, Crown, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCheatFeedback, fetchCheatUser, updateCheatUser } from '@/features/admin/adminCheatSlice';
import type { CheatUserForm } from './cheat.types';

const PREMIUM_TIERS = ['NONE', 'PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'] as const;

const emptyForm: CheatUserForm = {
  totalXp: 0,
  balanceAvailable: 0,
  balancePending: 0,
  balanceLocked: 0,
  currentStreak: 0,
  lastClaimedStreakMilestone: 0,
  premiumTier: 'NONE',
  premiumExpiresAt: '',
  isActive: true,
};

export default function AdminCheatPage() {
  const dispatch = useAppDispatch();
  const { user, isLoading, isSaving, error, success } = useAppSelector((state) => state.adminCheat);
  const [form, setForm] = useState<CheatUserForm>(emptyForm);

  useEffect(() => {
    dispatch(fetchCheatUser());
    return () => {
      dispatch(clearCheatFeedback());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    setForm({
      totalXp: user.totalXp ?? 0,
      balanceAvailable: user.balanceAvailable ?? 0,
      balancePending: user.balancePending ?? 0,
      balanceLocked: user.balanceLocked ?? 0,
      currentStreak: user.currentStreak ?? 0,
      lastClaimedStreakMilestone: user.lastClaimedStreakMilestone ?? 0,
      premiumTier: user.premiumTier ?? 'NONE',
      premiumExpiresAt: user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toISOString().slice(0, 16) : '',
      isActive: Boolean(user.isActive),
    });
  }, [user]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === '' ? 0 : parseInt(value, 10) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearCheatFeedback());
    await dispatch(updateCheatUser({
      totalXp: form.totalXp,
      balanceAvailable: form.balanceAvailable,
      balancePending: form.balancePending,
      balanceLocked: form.balanceLocked,
      currentStreak: form.currentStreak,
      lastClaimedStreakMilestone: form.lastClaimedStreakMilestone,
      premiumTier: form.premiumTier === 'NONE' ? null : form.premiumTier,
      premiumExpiresAt: form.premiumTier === 'NONE' || !form.premiumExpiresAt ? null : new Date(form.premiumExpiresAt).toISOString(),
      isActive: form.isActive,
    }));
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#020202]"><Loader2 className="w-10 h-10 animate-spin text-sats-orange-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-[#050505] border border-sats-orange-500/20 rounded-3xl p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-400 text-xs font-black uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Cheat Control
              </div>
              <h1 className="text-2xl md:text-3xl font-black">Cheat Panel</h1>
              <p className="text-sm text-gray-400 mt-2">Dedicated controls for `sakshamarya015@gmail.com` across XP, streak, balances, and premium tier.</p>
            </div>

            {user && (
              <div className="grid grid-cols-2 gap-3 text-sm min-w-[280px]">
                <StatCard label="Active Tier" value={user.activeTier || 'N/A'} icon={<Trophy className="w-4 h-4 text-yellow-400" />} />
                <StatCard label="Free Tier" value={user.underlyingFreeTier || 'N/A'} icon={<Shield className="w-4 h-4 text-blue-400" />} />
                <StatCard label="Premium" value={user.isPremium ? 'Yes' : 'No'} icon={<Crown className="w-4 h-4 text-purple-400" />} />
                <StatCard label="Status" value={user.isActive ? 'Active' : 'Suspended'} icon={<Coins className="w-4 h-4 text-green-400" />} />
              </div>
            )}
          </div>
        </div>

        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {success && <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Panel title="Gamification Control" description="Set XP, streak, and milestone values.">
            <NumberField label="Total XP" name="totalXp" value={form.totalXp} onChange={handleNumberChange} icon={<Trophy className="w-4 h-4 text-yellow-400" />} />
            <NumberField label="Current Streak" name="currentStreak" value={form.currentStreak} onChange={handleNumberChange} icon={<Flame className="w-4 h-4 text-red-400" />} />
            <NumberField label="Last Claimed Streak Milestone" name="lastClaimedStreakMilestone" value={form.lastClaimedStreakMilestone} onChange={handleNumberChange} icon={<Sparkles className="w-4 h-4 text-pink-400" />} />
          </Panel>

          <Panel title="Wallet Control" description="Directly control the user balances.">
            <NumberField label="Available Balance" name="balanceAvailable" value={form.balanceAvailable} onChange={handleNumberChange} icon={<Coins className="w-4 h-4 text-green-400" />} />
            <NumberField label="Pending Balance" name="balancePending" value={form.balancePending} onChange={handleNumberChange} icon={<Coins className="w-4 h-4 text-yellow-400" />} />
            <NumberField label="Locked Balance" name="balanceLocked" value={form.balanceLocked} onChange={handleNumberChange} icon={<Coins className="w-4 h-4 text-blue-400" />} />
          </Panel>

          <Panel title="Premium Control" description="Force premium tier behavior for testing gamification.">
            <FieldLabel label="Premium Tier" icon={<Crown className="w-4 h-4 text-purple-400" />} />
            <select
              value={form.premiumTier}
              onChange={(e) => setForm((prev) => ({ ...prev, premiumTier: e.target.value as CheatUserForm['premiumTier'] }))}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-sats-orange-500/50"
            >
              {PREMIUM_TIERS.map((tier) => <option key={tier} value={tier}>{tier}</option>)}
            </select>

            <FieldLabel label="Premium Expiry" icon={<Crown className="w-4 h-4 text-yellow-400" />} />
            <input
              type="datetime-local"
              value={form.premiumExpiresAt}
              onChange={(e) => setForm((prev) => ({ ...prev, premiumExpiresAt: e.target.value }))}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-sats-orange-500/50"
            />

            <label className="flex items-center gap-3 mt-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold text-white">User account is active</span>
            </label>
          </Panel>

          <Panel title="Live Summary" description="Current cheat target state from backend.">
            <div className="space-y-3 text-sm text-gray-300">
              <SummaryRow label="Email" value={user?.email || '-'} />
              <SummaryRow label="Full Name" value={user?.fullName || '-'} />
              <SummaryRow label="Updated At" value={user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'} />
              <SummaryRow label="Last Activity" value={user?.lastActivityAt ? new Date(user.lastActivityAt).toLocaleString() : '-'} />
              <SummaryRow label="Premium Expires" value={user?.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleString() : 'Not set'} />
            </div>
          </Panel>

          <div className="xl:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-2xl bg-sats-orange-500 text-black font-black px-6 py-3 disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Cheat Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 space-y-4">
      <div>
        <h2 className="text-lg font-black text-white">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FieldLabel({ label, icon }: { label: string; icon: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500"><span>{icon}</span>{label}</div>;
}

function NumberField({ label, name, value, onChange, icon }: { label: string; name: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <FieldLabel label={label} icon={icon} />
      <input type="number" name={name} min="0" value={value} onChange={onChange} className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-sats-orange-500/50" />
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-black">{icon}{label}</div>
      <div className="text-white font-black mt-2">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-[#111] pb-2"><span className="text-gray-500">{label}</span><span className="text-white font-semibold text-right">{value}</span></div>;
}
