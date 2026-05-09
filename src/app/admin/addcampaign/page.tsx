'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCampaign, uploadCampaignCover } from '@/features/admin/adminCampaignsSlice';
import { fetchCountries } from '@/features/admin/adminCountriesSlice';
import { 
  ArrowLeft, Save, Loader2, ChevronDown, 
  Shield, Target, Coins, Crown 
} from 'lucide-react';

const CATEGORIES = ["SOCIAL", "SURVEY", "VIDEO_AD", "APP_INSTALL", "OFFERWALL", "LEARN_EARN", "DAILY_STREAK"];
const FREE_TIERS = ["BASIC", "COPPER", "BRONZE", "SILVER", "GOLD"];
const PREMIUM_TIERS = ["PLATINUM", "DIAMOND", "CROWN", "ELITE", "FOUNDER"];
const DEVICE_OPTIONS = ["NONE", "DESKTOP", "ANDROID", "IOS"];

export default function AddCampaignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector((state) => state.adminCountries);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  
  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Form State (Aligned exactly with your Zod Schema) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOCIAL',
    coverImageUrl: '',
    targetCountries: [] as string[],
    requiredPlatform: 'NONE',
    isPremiumOnly: false,
    requiredFreeTier: 'BASIC',
    baseRewardSats: 0,
    xpReward: 0,
    doubleRewardsStartAt: '',
    doubleRewardsEndAt: '',
    maxCompletions: 0,
    tierRewardMatrix: {
      BASIC: 0, COPPER: 0, BRONZE: 0, SILVER: 0, GOLD: 0,
      PLATINUM: 0, DIAMOND: 0, CROWN: 0, ELITE: 0, FOUNDER: 0
    } as Record<string, number>
  });

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Handlers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseInt(value, 10) }));
  };

  const handleMatrixChange = (tier: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: value === '' ? 0 : parseInt(value, 10) }
    }));
  };

  const handleDoubleAllRewards = () => {
    setFormData((prev) => ({
      ...prev,
      tierRewardMatrix: Object.fromEntries(
        Object.entries(prev.tierRewardMatrix).map(([tier, reward]) => [tier, Number(reward || 0) * 2])
      ),
    }));
  };

  const handleCountryToggle = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      targetCountries: prev.targetCountries.includes(country)
        ? prev.targetCountries.filter((item) => item !== country)
        : [...prev.targetCountries, country],
    }));
  };

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries.length, dispatch]);

  const visibleRewardTiers = formData.isPremiumOnly
    ? PREMIUM_TIERS
    : [...FREE_TIERS, ...PREMIUM_TIERS];
  const derivedBaseReward = visibleRewardTiers.reduce((max, tier) => {
    const reward = Number(formData.tierRewardMatrix[tier]) || 0;
    return Math.max(max, reward);
  }, 0);
  const projectedMaxLiability = visibleRewardTiers.reduce((max, tier) => {
    const reward = Number(formData.tierRewardMatrix[tier]) || 0;
    return Math.max(max, reward * Number(formData.maxCompletions || 0));
  }, 0);

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Submit Engine Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frontend Validations
    if (formData.title.length < 5) return setErrorMsg("Title must be at least 5 characters.");
    if (formData.description.length < 10) return setErrorMsg("Description must be at least 10 characters.");
    if (derivedBaseReward <= 0) return setErrorMsg("At least one tier reward must be greater than 0.");
    if (formData.maxCompletions <= 0) return setErrorMsg("Max Completions must be greater than 0.");

    setIsSaving(true);

    let coverImageUrl = formData.coverImageUrl || '';
    if (coverImageFile) {
      setIsUploadingCover(true);
      const uploadResult = await dispatch(uploadCampaignCover(coverImageFile));
      setIsUploadingCover(false);
      if (uploadCampaignCover.fulfilled.match(uploadResult)) {
        coverImageUrl = uploadResult.payload;
      } else {
        setErrorMsg((uploadResult.payload as string) || 'Failed to upload campaign cover.');
        setIsSaving(false);
        return;
      }
    }
    
    // Strict Payload Generation to match Zod exactly
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      coverImageUrl: coverImageUrl || undefined,
      targetCountries: formData.targetCountries,
      requiredPlatform: formData.requiredPlatform,
      isPremiumOnly: formData.isPremiumOnly,
      requiredFreeTier: formData.requiredFreeTier,
      baseRewardSats: Number(derivedBaseReward),
      xpReward: Number(formData.xpReward),
      doubleRewardsStartAt: formData.doubleRewardsStartAt || undefined,
      doubleRewardsEndAt: formData.doubleRewardsEndAt || undefined,
      maxCompletions: Number(formData.maxCompletions),
      tierRewardMatrix: formData.tierRewardMatrix,
    };

    const result = await dispatch(createCampaign(payload));
    
    if (createCampaign.fulfilled.match(result)) {
      router.push('/admin/campaigns'); 
    } else {
      setErrorMsg(result.payload as string || "Failed to create campaign.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
          
          {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Header Sticky Bar Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
          <div className="sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xl">
            <button 
              type="button"
              onClick={() => router.back()} 
              className="flex items-center text-gray-400 hover:text-white bg-[#0a0a0a] border border-[#1a1a1a] hover:bg-[#111] px-5 py-2.5 rounded-xl transition-all font-bold w-full sm:w-auto justify-center shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
            </button>
            
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-black text-white tracking-tight">Campaign Master Setup</h1>
              <p className="text-xs text-gray-500 mt-0.5">Define global rules, access gates, and economics.</p>
            </div>
            
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex items-center justify-center w-full sm:w-auto bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black px-8 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(238,139,18,0.2)] active:scale-95"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
              Publish Campaign
            </button>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl font-medium flex items-center gap-3">
              <Shield className="w-5 h-5" /> {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ LEFT COLUMN: Metadata & Access Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
              
              {/* CARD 1: Basic Information */}
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
                <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-sats-orange-500" /> Basic Details
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <InputWrapper label="Campaign Title" required>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required minLength={5} placeholder="e.g. Follow SatsEarn on Twitter" className={inputCls} />
                  </InputWrapper>
                  
                  <InputWrapper label="Campaign Cover Image">
                    <div className="space-y-3">
                      <input type="file" accept="image/*" onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)} className={inputCls} />
                      <input type="url" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} placeholder="Or paste image URL https://..." className={inputCls} />
                      {(coverImageFile || formData.coverImageUrl) && (
                        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-[#1a1a1a]">
                          <Image
                            src={coverImageFile ? URL.createObjectURL(coverImageFile) : formData.coverImageUrl}
                            alt="Campaign cover preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </InputWrapper>

                  <InputWrapper label="Description" required>
                    <textarea name="description" value={formData.description} onChange={handleChange} required minLength={10} placeholder="Explain the high-level goal of this campaign..." className={`${inputCls} min-h-[120px] resize-none`} />
                  </InputWrapper>
                </div>
              </div>

              {/* CARD 2: Access Gates */}
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
                <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sats-orange-500" /> Categorization & Gates
                </h2>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <InputWrapper label="Category" required>
                    <select name="category" value={formData.category} onChange={handleChange} className={`${inputCls} appearance-none cursor-pointer`}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </InputWrapper>

                  <InputWrapper label="Required Free Tier">
                      <select name="requiredFreeTier" value={formData.requiredFreeTier} onChange={handleChange} disabled={formData.isPremiumOnly} className={`${inputCls} appearance-none cursor-pointer disabled:opacity-50`}>
                        {FREE_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </InputWrapper>

                    <InputWrapper label="Device Targeting">
                      <select name="requiredPlatform" value={formData.requiredPlatform} onChange={handleChange} className={`${inputCls} appearance-none cursor-pointer`}>
                        {DEVICE_OPTIONS.map(device => <option key={device} value={device}>{device === 'NONE' ? 'All Devices' : device === 'DESKTOP' ? 'Desktop Only' : device === 'ANDROID' ? 'Android Only' : 'iOS Only'}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </InputWrapper>
                  </div>

                  <div className="mb-8">
                    <InputWrapper label="Target Countries">
                      <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 max-h-56 overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {countries.map((country) => {
                            const selected = formData.targetCountries.includes(country);
                            return (
                              <button
                                key={country}
                                type="button"
                                onClick={() => handleCountryToggle(country)}
                                className={`text-left px-3 py-2 rounded-xl border transition-all ${selected ? 'bg-sats-orange-500 text-black border-sats-orange-500' : 'bg-black text-gray-300 border-[#1a1a1a] hover:border-sats-orange-500/40'}`}
                              >
                                {country}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </InputWrapper>
                  </div>

                {/* Premium Only Toggle */}
                <div className="border-t border-[#1a1a1a] pt-8">
                  <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl max-w-sm">
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5"><Crown className="w-4 h-4 text-yellow-500" /> Premium Exclusive</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Restrict to paid users</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isPremiumOnly: !prev.isPremiumOnly }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.isPremiumOnly ? 'bg-yellow-500' : 'bg-[#1a1a1a] border border-[#2a2a2a]'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${formData.isPremiumOnly ? 'translate-x-[22px]' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ RIGHT COLUMN: Economics Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            <div className="flex flex-col h-full gap-6 md:gap-8">
              <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 h-full">
                
                <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" /> Economics
                </h2>

                <div className="grid grid-cols-1 gap-6 mb-8 border-b border-[#1a1a1a] pb-8">
                  <InputWrapper label="Max Completions (Budget Cap)" required>
                    <input type="number" name="maxCompletions" min="1" value={formData.maxCompletions || ''} onChange={handleNumberChange} required placeholder="0" className={inputCls} />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 px-1">
                      Worst-Case Liability: <span className="text-yellow-500">{projectedMaxLiability.toLocaleString()} Sats</span>
                    </p>
                  </InputWrapper>

                  <InputWrapper label="Campaign XP Reward" required>
                    <input type="number" name="xpReward" min="1" value={formData.xpReward || ''} onChange={handleNumberChange} required placeholder="0" className={inputCls} />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 px-1">
                      Base XP users get for this campaign. During active 2x period, XP also doubles.
                    </p>
                  </InputWrapper>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWrapper label="2x Start Date">
                      <input
                        type="datetime-local"
                        value={formData.doubleRewardsStartAt ? formData.doubleRewardsStartAt.slice(0, 16) : ''}
                        onChange={(e) => setFormData((prev) => ({
                          ...prev,
                          doubleRewardsStartAt: e.target.value ? new Date(e.target.value).toISOString() : '',
                        }))}
                        className={inputCls}
                      />
                    </InputWrapper>

                    <InputWrapper label="2x End Date">
                      <input
                        type="datetime-local"
                        value={formData.doubleRewardsEndAt ? formData.doubleRewardsEndAt.slice(0, 16) : ''}
                        onChange={(e) => setFormData((prev) => ({
                          ...prev,
                          doubleRewardsEndAt: e.target.value ? new Date(e.target.value).toISOString() : '',
                        }))}
                        className={inputCls}
                      />
                    </InputWrapper>
                  </div>
                </div>

                {/* Dense Tier Matrix Grid */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Tier Reward Matrix</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                        Active 2x period doubles both sats rewards and XP rewards.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDoubleAllRewards}
                      className="px-4 py-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-black uppercase tracking-wider hover:bg-yellow-500/20 transition-all"
                    >
                      2x All Rewards
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {visibleRewardTiers.map(tier => (
                      <div key={tier} className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-2.5 flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate mr-2">{tier}</label>
                        <input 
                          type="number" 
                          min="0"
                          value={formData.tierRewardMatrix[tier] || ''} 
                          onChange={(e) => handleMatrixChange(tier, e.target.value)}
                          placeholder="0"
                          className="w-16 bg-[#111] border border-[#2a2a2a] rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500"
                        />
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Input Wrapper Helper Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function InputWrapper({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
        {label} {required && <span className="text-sats-orange-500">*</span>}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-sm font-medium placeholder:text-gray-600 focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all";
