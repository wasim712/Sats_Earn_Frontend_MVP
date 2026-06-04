'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCampaign, uploadCampaignCover } from '@/features/admin/adminCampaignsSlice';
import { fetchCountries } from '@/features/admin/adminCountriesSlice';
import { 
  ArrowLeft, Save, Loader2, ChevronDown, 
  Shield, Target, Coins, Crown, CalendarDays, Clock3
} from 'lucide-react';

const CATEGORIES = ["SOCIAL", "SURVEY", "VIDEO_AD", "APP_INSTALL", "OFFERWALL", "LEARN_EARN", "DAILY_STREAK"];
const FREE_TIERS = ["BASIC", "COPPER", "BRONZE", "SILVER", "GOLD"];
const DEVICE_OPTIONS = ["NONE", "DESKTOP", "ANDROID", "IOS"];

function getDigitsOnlyValue(value: string) {
  return value.replace(/\D/g, '');
}

function parseWholeNumber(value: string) {
  const digitsOnly = getDigitsOnlyValue(value);
  if (digitsOnly === '') return 0;

  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function toLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayDateValue() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return toLocalDateValue(today);
}

function parseDateTimeValue(value: string) {
  if (!value) {
    return { date: '', hour: '12', minute: '00', period: 'AM' as 'AM' | 'PM' };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', hour: '12', minute: '00', period: 'AM' as 'AM' | 'PM' };
  }

  const hours24 = parsed.getHours();
  const period: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM';
  const hour12 = hours24 % 12 || 12;

  return {
    date: toLocalDateValue(parsed),
    hour: String(hour12).padStart(2, '0'),
    minute: String(parsed.getMinutes()).padStart(2, '0'),
    period,
  };
}

function buildDateTimeIso(date: string, hour: string, minute: string, period: 'AM' | 'PM') {
  if (!date) return '';
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return '';

  let hours24 = Number(hour) % 12;
  if (period === 'PM') hours24 += 12;
  if (period === 'AM' && Number(hour) === 12) hours24 = 0;

  const localDate = new Date(year, month - 1, day, hours24, Number(minute), 0, 0);
  return localDate.toISOString();
}

export default function AddCampaignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector((state) => state.adminCountries);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Form State (Aligned exactly with your Zod Schema) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOCIAL',
    coverImageUrl: '',
    targetCountries: [] as string[],
    requiredPlatform: 'NONE',
    isPremiumOnly: false,
    isNewUserOnly: false,
    newUserMaxAccountAgeDays: 7,
    requiredFreeTier: 'BASIC',
    doubleRewardsStartAt: '',
    doubleRewardsEndAt: '',
    maxCompletions: 0
  });

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Handlers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseWholeNumber(value) }));
  };

  const handleCountryToggle = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      targetCountries: prev.targetCountries.includes(country)
        ? prev.targetCountries.filter((item) => item !== country)
        : [...prev.targetCountries, country],
    }));
  };

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.trim().toLowerCase())
  );

  // const handleSelectAllCountries = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     targetCountries: [...countries],
  //   }));
  // };

  // const handleClearAllCountries = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     targetCountries: [],
  //   }));
  // };

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries.length, dispatch]);

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Submit Engine Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frontend Validations
    if (formData.title.length < 5) return setErrorMsg("Title must be at least 5 characters.");
    if (formData.description.length < 10) return setErrorMsg("Description must be at least 10 characters.");
    if (formData.maxCompletions <= 0) return setErrorMsg("Max Completions must be greater than 0.");
    if (formData.isNewUserOnly && formData.newUserMaxAccountAgeDays <= 0) return setErrorMsg("New user window must be greater than 0 days.");
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
      isNewUserOnly: formData.isNewUserOnly,
      newUserMaxAccountAgeDays: formData.isNewUserOnly ? Number(formData.newUserMaxAccountAgeDays) : undefined,
      requiredFreeTier: formData.requiredFreeTier,
      maxCompletions: Number(formData.maxCompletions),
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
              <p className="text-xs text-gray-500 mt-0.5">Define global rules and access gates. Task-level sats rewards are configured after campaign creation.</p>
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
                    <InputWrapper label="Target Countries"> <span className='text-sm text-gray-500'>&nbsp; Leave selection empty to select all countries</span>
                      <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 max-h-56 overflow-y-auto">
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search countries..."
                            className="flex-1 bg-black border border-[#1a1a1a] text-white text-sm font-medium px-4 py-2.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all"
                          />
                          {/* <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSelectAllCountries}
                              className="px-4 py-2.5 rounded-xl border border-[#2a2a2a] bg-[#111] text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white hover:border-sats-orange-500/40 transition-all"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={handleClearAllCountries}
                              className="px-4 py-2.5 rounded-xl border border-[#2a2a2a] bg-[#111] text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white hover:border-sats-orange-500/40 transition-all"
                            >
                              Deselect All
                            </button>
                          </div> */}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {filteredCountries.map((country) => {
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
                          {filteredCountries.length === 0 && (
                            <div className="col-span-full rounded-xl border border-dashed border-[#1a1a1a] bg-black/40 px-4 py-6 text-center text-sm text-gray-500">
                              No countries match your search.
                            </div>
                          )}
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

                  <div className="mt-4 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 max-w-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5"><Shield className="w-4 h-4 text-sats-orange-400" /> New Users Only</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Restrict by account age</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, isNewUserOnly: !prev.isNewUserOnly }))}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.isNewUserOnly ? 'bg-sats-orange-500' : 'bg-[#1a1a1a] border border-[#2a2a2a]'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${formData.isNewUserOnly ? 'translate-x-[22px]' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    {formData.isNewUserOnly ? (
                      <div className="mt-4">
                        <InputWrapper label="Account Age Window (Days)" required>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" name="newUserMaxAccountAgeDays" value={formData.newUserMaxAccountAgeDays || ''} onChange={handleNumberChange} placeholder="7" className={inputCls} />
                        </InputWrapper>
                      </div>
                    ) : null}
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
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="maxCompletions" value={formData.maxCompletions || ''} onChange={handleNumberChange} required placeholder="0" className={inputCls} />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 px-1">
                      Use this as the campaign completion cap. Sats rewards are set later on each task per tier.
                    </p>
                  </InputWrapper>

                  {/* Changed md:grid-cols-2 to simply stack them vertically in the narrow sidebar with gap-6 */}
                    <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4 text-sm text-gray-400">
                      Double rewards are configured later from the campaign edit page and apply to each task reward matrix at runtime.
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100/85">
                  Task-level sats and tier rewards are configured after campaign creation. Open the campaign tasks and assign rewards separately for each tier there.
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

// AFTER — paste this entire replacement:
function DateTimePickerInput({ value, onChange, disabled = false }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const today = getTodayDateValue();
  const parts = parseDateTimeValue(value);

  const updateValue = (next: Partial<typeof parts>) => {
    const merged = { ...parts, ...next };
    onChange(buildDateTimeIso(merged.date, merged.hour, merged.minute, merged.period));
  };
  
  return (
    <div className={`rounded-xl border border-[#2a2a2a] bg-[#111] p-3 ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-2.5">

        {/* ── Date row — full width, native picker ── */}
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sats-orange-400 z-10" />
          <input
            type="date"
            min={today}
            value={parts.date}
            disabled={disabled}
            onChange={(e) => updateValue({ date: e.target.value })}
            className="
              w-full appearance-none rounded-xl border border-[#2a2a2a]
              bg-[#050505] py-3 pl-10 pr-3
              text-sm font-medium text-white
              outline-none transition-all
              hover:border-[#3a3a3a] focus:border-sats-orange-500/50
              [color-scheme:dark]
            "
          />
        </div>

        {/* ── Time row — three selects in a row ── */}
        <div className="grid grid-cols-3 gap-2">

          {/* Hour */}
          <div className="relative">
            <Clock3 className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-400 z-10" />
            <select
              value={parts.hour}
              disabled={disabled}
              onChange={(e) => updateValue({ hour: e.target.value })}
              className="
                w-full appearance-none rounded-xl border border-[#2a2a2a]
                bg-[#050505] py-3 pl-8 pr-2
                text-sm font-bold text-white
                outline-none transition-all
                focus:border-sats-orange-500/50
                cursor-pointer
              "
            >
              {Array.from({ length: 12 }, (_, i) => {
                const h = String(i + 1).padStart(2, '0');
                return <option key={h} value={h}>{h}</option>;
              })}
            </select>
          </div>

          {/* Minute */}
          <select
            value={parts.minute}
            disabled={disabled}
            onChange={(e) => updateValue({ minute: e.target.value })}
            className="
              w-full appearance-none rounded-xl border border-[#2a2a2a]
              bg-[#050505] px-3 py-3
              text-sm font-bold text-white text-center
              outline-none transition-all
              focus:border-sats-orange-500/50
              cursor-pointer
            "
          >
            {['00','05','10','15','20','25','30','35','40','45','50','55'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* AM/PM */}
          <select
            value={parts.period}
            disabled={disabled}
            onChange={(e) => updateValue({ period: e.target.value as 'AM' | 'PM' })}
            className="
              w-full appearance-none rounded-xl border border-[#2a2a2a]
              bg-[#050505] px-3 py-3
              text-sm font-black text-white text-center
              outline-none transition-all
              focus:border-sats-orange-500/50
              cursor-pointer
            "
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        {/* ── Selected value preview ── */}
        {parts.date && (
          <p className="text-[10px] text-white/25 font-medium px-1">
            {new Date(
              buildDateTimeIso(parts.date, parts.hour, parts.minute, parts.period)
            ).toLocaleString([], {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-sm font-medium placeholder:text-gray-600 focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all";
