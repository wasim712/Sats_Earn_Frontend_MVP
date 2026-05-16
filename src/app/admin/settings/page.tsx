'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  Save, Loader2, Settings, Shield, Zap, Users, 
  Coins, Clock, CheckCircle2, AlertTriangle, ArrowLeft,
  Medal, Crown,
  Target
} from 'lucide-react';
import { fetchAdminSettings, updateAdminSettings } from '@/features/admin/adminSettingsSlice';

const FREE_TIERS = ["BASIC", "COPPER", "BRONZE", "SILVER", "GOLD"];
const PREMIUM_TIERS = ["PLATINUM", "DIAMOND", "CROWN", "ELITE", "FOUNDER"];

export default function AdminSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { settings, isLoading, isSaving, error } = useAppSelector((state) => state.adminSettings);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ─── Form State ───
  const [formData, setFormData] = useState({
    welcomeBonusSats: 50,
    minWithdrawalSats: 25000,
    securityLockDays: 15,
    referralBonusPercent: 5,
    baseXpPerTask: 10,
    dailyStreakBonusXp: 5,
    tierReferralMatrix: {
      BASIC: 5, COPPER: 5, BRONZE: 6, SILVER: 7, GOLD: 8,
      PLATINUM: 10, DIAMOND: 12, CROWN: 15, ELITE: 20, FOUNDER: 25
    } as Record<string, number>,
    tierMinWithdrawalMatrix: {
      BASIC: 25000, COPPER: 25000, BRONZE: 25000, SILVER: 25000, GOLD: 25000,
      PLATINUM: 25000, DIAMOND: 25000, CROWN: 25000, ELITE: 25000, FOUNDER: 25000
    } as Record<string, number>
  });

  // 1. FETCH INITIAL SETTINGS
  useEffect(() => {
    dispatch(fetchAdminSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings) return;

    setFormData(prev => ({
      welcomeBonusSats: settings.welcomeBonusSats ?? prev.welcomeBonusSats,
      minWithdrawalSats: settings.minWithdrawalSats ?? prev.minWithdrawalSats,
      securityLockDays: settings.securityLockDays ?? prev.securityLockDays,
      referralBonusPercent: settings.referralBonusPercent ?? prev.referralBonusPercent,
      baseXpPerTask: settings.baseXpPerTask ?? prev.baseXpPerTask,
      dailyStreakBonusXp: settings.dailyStreakBonusXp ?? prev.dailyStreakBonusXp,
      tierReferralMatrix: { ...prev.tierReferralMatrix, ...(settings.tierReferralMatrix || {}) },
      tierMinWithdrawalMatrix: { ...prev.tierMinWithdrawalMatrix, ...(settings.tierMinWithdrawalMatrix || {}) }
    }));
  }, [settings]);

  // 2. HANDLE INPUT CHANGES
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value === '' ? 0 : parseInt(value, 10) 
    }));
  };

  const handleMatrixChange = (tier: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      tierReferralMatrix: { 
        ...prev.tierReferralMatrix, 
        [tier]: value === '' ? 0 : parseInt(value, 10) 
      }
    }));
  };

  const handleWithdrawalMatrixChange = (tier: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      tierMinWithdrawalMatrix: {
        ...prev.tierMinWithdrawalMatrix,
        [tier]: value === '' ? 0 : parseInt(value, 10)
      }
    }));
  };

  // 3. SAVE TO DATABASE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    return <div className="min-h-screen bg-[#020202] flex items-center justify-center"><Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32 relative overflow-x-hidden">
      
      {/* ─── SUCCESS TOAST ─── */}
      <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#0a0a0a] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.15)] transition-all duration-500 ${showSuccess ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <p className="font-bold text-sm text-white">Settings Saved</p>
          <p className="text-xs opacity-80">Global platform rules updated successfully.</p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
          
          {/* ─── STICKY HEADER ─── */}
          <div className="sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xl mt-4">
            <button 
              type="button"
              onClick={() => router.push('/admin/dashboard')} 
              className="flex items-center text-gray-400 hover:text-white bg-[#0a0a0a] border border-[#1a1a1a] hover:bg-[#111] px-5 py-2.5 rounded-xl transition-all font-bold w-full sm:w-auto justify-center shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            
            <div className="text-center sm:text-left flex items-center gap-3">
              <div className="p-2 bg-[#111] border border-[#2a2a2a] rounded-lg shadow-inner hidden sm:block">
                <Settings className="w-5 h-5 text-sats-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">Global Platform Settings</h1>
                <p className="text-xs text-gray-500 mt-0.5">Control core economics and gamification limits.</p>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex items-center justify-center w-full sm:w-auto bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black px-8 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(238,139,18,0.2)] active:scale-95"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
              Save Changes
            </button>
          </div>

          {(errorMsg || error) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl font-medium flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" /> {errorMsg || error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* ─── FINANCIAL RULES CARD ─── */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-6">
                <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl">
                  <Coins className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Financial Rules</h2>
                  <p className="text-xs text-gray-500">Manage liquidity and payouts.</p>
                </div>
              </div>

              <div className="space-y-6">
                <InputWrapper label="Welcome Bonus (Sats)" icon={<Zap className="w-4 h-4 text-yellow-500" />}>
                  <input type="number" name="welcomeBonusSats" min="0" value={formData.welcomeBonusSats ||''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </InputWrapper>

                <InputWrapper label="Security Lock Period (Days)" icon={<Shield className="w-4 h-4 text-blue-500" />}>
                  <input type="number" name="securityLockDays" min="0" value={formData.securityLockDays||''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </InputWrapper>
              </div>
            </div>

            {/* ─── GAMIFICATION CARD ─── */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-6">
                <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl">
                  <Users className="w-5 h-5 text-sats-orange-500" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Economy & XP</h2>
                  <p className="text-xs text-gray-500">Configure progression and base rewards.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* We keep the Default Percent as a fallback for users with NO tier */}
                <InputWrapper label="Default System Fallback (%)" icon={<Users className="w-4 h-4 text-purple-500" />}>
                  <input type="number" name="referralBonusPercent" min="0" max="100" value={formData.referralBonusPercent||''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </InputWrapper>

                <InputWrapper label="Base XP Per Task" icon={<Target className="w-4 h-4 text-sats-orange-500" />}>
                  <input type="number" name="baseXpPerTask" min="1" value={formData.baseXpPerTask ||''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </InputWrapper>

                <InputWrapper label="Daily Streak Bonus XP" icon={<Clock className="w-4 h-4 text-red-500" />}>
                  <input type="number" name="dailyStreakBonusXp" min="0" value={formData.dailyStreakBonusXp || ''} onChange={handleNumberChange} required className={`${inputCls} pl-11`} />
                </InputWrapper>
              </div>
            </div>

            <div className="md:col-span-2 bg-[#050505] border border-green-500/20 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-green-500/10 pb-6">
                <div className="p-2.5 bg-[#111] border border-green-500/20 rounded-xl">
                  <Coins className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Minimum Withdrawal Per Tier</h2>
                  <p className="text-xs text-gray-500">This controls withdrawal limits for all users. Backend uses these tier values directly.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Free XP Tiers
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {FREE_TIERS.map(tier => (
                      <div key={tier} className="bg-[#0a0a0a] border border-green-500/10 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{tier}</span>
                        <div className="relative">
                          <input
                            type="number" min="0"
                            value={formData.tierMinWithdrawalMatrix[tier] || ''}
                            onChange={(e) => handleWithdrawalMatrixChange(tier, e.target.value)}
                            className="w-full bg-[#111] text-white font-bold text-sm border border-green-500/20 rounded-lg px-3 py-1.5 outline-none focus:border-green-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">Sats</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-yellow-500/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" /> Premium Subs
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PREMIUM_TIERS.map(tier => (
                      <div key={tier} className="bg-[#111] border border-yellow-500/20 rounded-xl p-3 flex flex-col gap-1.5 shadow-[inset_0_0_20px_rgba(234,179,8,0.02)]">
                        <span className="text-[9px] font-black text-yellow-500/70 uppercase tracking-widest">{tier}</span>
                        <div className="relative">
                          <input
                            type="number" min="0"
                            value={formData.tierMinWithdrawalMatrix[tier] || ''}
                            onChange={(e) => handleWithdrawalMatrixChange(tier, e.target.value)}
                            className="w-full bg-[#050505] text-yellow-400 font-bold text-sm border border-yellow-500/30 rounded-lg px-3 py-1.5 outline-none focus:border-yellow-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-600/50 text-xs font-bold">Sats</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── REFERRAL TIER MATRIX (Spans full width at bottom) ─── */}
            <div className="md:col-span-2 bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-6">
                <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl">
                  <Medal className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Referral Commission Matrix</h2>
                  <p className="text-xs text-gray-500">Set the exact percentage a referrer earns based on their current tier.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FREE TIERS */}
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Free XP Tiers
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {FREE_TIERS.map(tier => (
                      <div key={tier} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{tier}</span>
                        <div className="relative">
                          <input 
                            type="number" min="0" max="100"
                            value={formData.tierReferralMatrix[tier] || ''} 
                            onChange={(e) => handleMatrixChange(tier, e.target.value)}
                            className="w-full bg-[#111] text-white font-bold text-sm border border-[#2a2a2a] rounded-lg px-3 py-1.5 outline-none focus:border-sats-orange-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PREMIUM TIERS */}
                <div>
                  <h3 className="text-[10px] font-black text-yellow-500/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" /> Premium Subs
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PREMIUM_TIERS.map(tier => (
                      <div key={tier} className="bg-[#111] border border-yellow-500/20 rounded-xl p-3 flex flex-col gap-1.5 shadow-[inset_0_0_20px_rgba(234,179,8,0.02)]">
                        <span className="text-[9px] font-black text-yellow-500/70 uppercase tracking-widest">{tier}</span>
                        <div className="relative">
                          <input 
                            type="number" min="0" max="100"
                            value={formData.tierReferralMatrix[tier] || ''} 
                            onChange={(e) => handleMatrixChange(tier, e.target.value)}
                            className="w-full bg-[#050505] text-yellow-400 font-bold text-sm border border-yellow-500/30 rounded-lg px-3 py-1.5 outline-none focus:border-yellow-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-600/50 text-xs font-bold">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Input Wrapper Helper ───────────────────────────────────────────────────
function InputWrapper({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-lg font-black placeholder:text-gray-600 focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all";
