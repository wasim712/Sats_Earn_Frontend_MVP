'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Coins, Loader2, Shield, Target, Users, Zap } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminSettings, updateAdminSettings } from '@/features/admin/adminSettingsSlice';
import { ReferralMatrixSection } from '@/components/admin/settings/ReferralMatrixSection';
import { WithdrawalTierMatrixSection } from '@/components/admin/settings/WithdrawalTierMatrixSection';
import { PremiumMonthlySatsMatrixSection } from '@/components/admin/settings/PremiumMonthlySatsMatrixSection';
import { PremiumYearlySatsMatrixSection } from '@/components/admin/settings/PremiumYearlySatsMatrixSection';
import { SettingsErrorBanner, SettingsSuccessToast } from '@/components/admin/settings/SettingsFeedback';
import { SettingsHeader } from '@/components/admin/settings/SettingsHeader';
import { SettingsInputWrapper } from '@/components/admin/settings/SettingsInputWrapper';
import { SettingsSectionCard } from '@/components/admin/settings/SettingsSectionCard';
import { inputCls } from '@/components/admin/settings/settings.constants';

function parseWholeNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly === '') return 0;

  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { settings, isLoading, isSaving, error } = useAppSelector((state) => state.adminSettings);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    welcomeBonusSats: 50,
    minWithdrawalSats: 25000,
    securityLockDays: 15,
    referralBonusPercent: 5,
    baseXpPerTask: 10,
    dailyStreakBonusXp: 5,
    tierReferralMatrix: {
      BASIC: 5, COPPER: 5, BRONZE: 6, SILVER: 7, GOLD: 8,
      PLATINUM: 10, DIAMOND: 12, CROWN: 15, ELITE: 20, FOUNDER: 25,
    } as Record<string, number>,
    tierMinWithdrawalMatrix: {
      BASIC: 25000, COPPER: 25000, BRONZE: 25000, SILVER: 25000, GOLD: 25000,
      PLATINUM: 25000, DIAMOND: 25000, CROWN: 25000, ELITE: 25000, FOUNDER: 25000,
    } as Record<string, number>,
    premiumMonthlySatsMatrix: {
      PLATINUM: 6499, DIAMOND: 8999, CROWN: 12999, ELITE: 19999, FOUNDER: 0,
    } as Record<string, number>,
    premiumYearlySatsMatrix: {
      PLATINUM: 72999, DIAMOND: 102999, CROWN: 146999, ELITE: 221999, FOUNDER: 299999,
    } as Record<string, number>,
    userSidebarConfig: {
      dashboard: true,
      tasks: true,
      standaloneTasks: true,
      minigames: true,
      bugBounty: true,
      quiz: true,
      referrals: true,
      rewards: true,
      leaderboard: true,
      wallet: true,
      settings: true,
      help: true,
      notifications: true,
      profile: true,
    },
  });

  useEffect(() => {
    dispatch(fetchAdminSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings) return;

    setFormData((prev) => ({
      welcomeBonusSats: settings.welcomeBonusSats ?? prev.welcomeBonusSats,
      minWithdrawalSats: settings.minWithdrawalSats ?? prev.minWithdrawalSats,
      securityLockDays: settings.securityLockDays ?? prev.securityLockDays,
      referralBonusPercent: settings.referralBonusPercent ?? prev.referralBonusPercent,
      baseXpPerTask: settings.baseXpPerTask ?? prev.baseXpPerTask,
      dailyStreakBonusXp: settings.dailyStreakBonusXp ?? prev.dailyStreakBonusXp,
      tierReferralMatrix: { ...prev.tierReferralMatrix, ...(settings.tierReferralMatrix || {}) },
      tierMinWithdrawalMatrix: { ...prev.tierMinWithdrawalMatrix, ...(settings.tierMinWithdrawalMatrix || {}) },
      premiumMonthlySatsMatrix: { ...prev.premiumMonthlySatsMatrix, ...(settings.premiumMonthlySatsMatrix || {}) },
      premiumYearlySatsMatrix: { ...prev.premiumYearlySatsMatrix, ...(settings.premiumYearlySatsMatrix || {}) },
      userSidebarConfig: { ...prev.userSidebarConfig, ...(settings.userSidebarConfig || {}) },
    }));
  }, [settings]);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseWholeNumber(value),
    }));
  };

  const handleMatrixChange = (tier: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tierReferralMatrix: {
        ...prev.tierReferralMatrix,
        [tier]: parseWholeNumber(value),
      },
    }));
  };

  const handleWithdrawalMatrixChange = (tier: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tierMinWithdrawalMatrix: {
        ...prev.tierMinWithdrawalMatrix,
        [tier]: parseWholeNumber(value),
      },
    }));
  };

  const handlePremiumMonthlyMatrixChange = (tier: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      premiumMonthlySatsMatrix: {
        ...prev.premiumMonthlySatsMatrix,
        [tier]: parseWholeNumber(value),
      },
    }));
  };


  const handleSidebarToggle = (key: keyof typeof formData.userSidebarConfig) => {
    setFormData((prev) => ({
      ...prev,
      userSidebarConfig: {
        ...prev.userSidebarConfig,
        [key]: !prev.userSidebarConfig[key],
      },
    }));
  };

  const handlePremiumYearlyMatrixChange = (tier: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      premiumYearlySatsMatrix: {
        ...prev.premiumYearlySatsMatrix,
        [tier]: parseWholeNumber(value),
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);

    try {
      await dispatch(updateAdminSettings(formData)).unwrap();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32 relative overflow-x-hidden">
      <SettingsSuccessToast show={showSuccess} />

      <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
          <SettingsHeader isSaving={isSaving} onBack={() => router.push('/admin/dashboard')} />

          {(errorMsg || error) ? <SettingsErrorBanner message={errorMsg || error || ''} /> : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <SettingsSectionCard title="Financial Rules" description="Manage liquidity and payouts." icon={<Coins className="w-5 h-5 text-yellow-500" />}>
              <div className="space-y-6">
                <SettingsInputWrapper label="Welcome Bonus (Sats)" icon={<Zap className="w-4 h-4 text-yellow-500" />}>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="welcomeBonusSats" value={formData.welcomeBonusSats || ''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </SettingsInputWrapper>

                <SettingsInputWrapper label="Security Lock Period (Days)" icon={<Shield className="w-4 h-4 text-blue-500" />}>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="securityLockDays" value={formData.securityLockDays || ''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </SettingsInputWrapper>
              </div>
            </SettingsSectionCard>

            <SettingsSectionCard title="Economy & XP" description="Configure progression and base rewards." icon={<Users className="w-5 h-5 text-sats-orange-500" />}>
              <div className="space-y-6">
                <SettingsInputWrapper label="Default System Fallback (%)" icon={<Users className="w-4 h-4 text-purple-500" />}>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="referralBonusPercent" value={formData.referralBonusPercent || ''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </SettingsInputWrapper>

                <SettingsInputWrapper label="Base XP Per Task" icon={<Target className="w-4 h-4 text-sats-orange-500" />}>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="baseXpPerTask" value={formData.baseXpPerTask || ''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </SettingsInputWrapper>

                <SettingsInputWrapper label="Daily Streak Bonus XP" icon={<Clock className="w-4 h-4 text-red-500" />}>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="dailyStreakBonusXp" value={formData.dailyStreakBonusXp || ''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </SettingsInputWrapper>
              </div>
            </SettingsSectionCard>

            <WithdrawalTierMatrixSection values={formData.tierMinWithdrawalMatrix} onChange={handleWithdrawalMatrixChange} />

            <ReferralMatrixSection values={formData.tierReferralMatrix} onChange={handleMatrixChange} />

            <PremiumMonthlySatsMatrixSection values={formData.premiumMonthlySatsMatrix} onChange={handlePremiumMonthlyMatrixChange} />

            <PremiumYearlySatsMatrixSection values={formData.premiumYearlySatsMatrix} onChange={handlePremiumYearlyMatrixChange} />

            <SettingsSectionCard
              title="User Sidebar Visibility"
              description="Admins can hide user dashboard sections from the backend. Hidden items disappear from the sidebar and blocked pages will not render."
              icon={<Users className="w-5 h-5 text-emerald-400" />}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Object.entries(formData.userSidebarConfig).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())}</p>
                      <p className="text-xs text-gray-500">{value ? 'Visible to users' : 'Hidden from users'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSidebarToggle(key as keyof typeof formData.userSidebarConfig)}
                      className={`relative h-7 w-12 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-[#222]'}`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </SettingsSectionCard>
          </div>
        </form>
      </div>
    </div>
  );
}
