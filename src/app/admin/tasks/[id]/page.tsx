'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteStandaloneTask, fetchStandaloneTaskById, updateStandaloneTask } from '@/features/admin/adminTasksSlice';
import { fetchCountries } from '@/features/admin/adminCountriesSlice';
import { uploadCampaignCover } from '@/features/admin/adminCampaignsSlice';
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Crown,
  Globe2,
  ImagePlus,
  Loader2,
  Save,
  Shield,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Zap,
} from 'lucide-react';

const FREE_TIERS = ['BASIC', 'COPPER', 'BRONZE', 'SILVER', 'GOLD'];
const PREMIUM_TIERS = ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
const PROOF_TYPES = ['SCREENSHOT', 'URL', 'TEXT_RESPONSE', 'API_VERIFIED'];
const PLATFORMS = ['NONE', 'DESKTOP', 'ANDROID', 'IOS'];
const PLATFORM_LABELS: Record<string, string> = {
  NONE: 'ALL DEVICES',
  DESKTOP: 'DESKTOP',
  ANDROID: 'ANDROID',
  IOS: 'IOS',
};
const CATEGORIES = ['SOCIAL', 'SURVEY', 'VIDEO_AD', 'APP_INSTALL', 'OFFERWALL', 'LEARN_EARN', 'DAILY_STREAK'];

function parseWholeNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly === '') return 0;
  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function toIsoDateTime(value: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

const inputCls = 'w-full rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3 text-sm text-white outline-none transition focus:border-sats-orange-500';
const cardCls = 'rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 md:p-8 shadow-[0_18px_80px_rgba(0,0,0,0.28)]';

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10 p-2.5 text-sats-orange-400">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-black tracking-tight text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/45">{subtitle}</p>
      </div>
    </div>
  );
}

function InputWrap({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 relative">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{label}{required ? ' *' : ''}</span>
        {hint ? <span className="text-[12px] text-white/25">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export default function AdminTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const taskId = params?.id as string;
  const { selectedTask, isLoading, isSaving, isDeleting, error } = useAppSelector((state) => state.adminTasks);
  const { countries } = useAppSelector((state) => state.adminCountries);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOCIAL',
    coverImageUrl: '',
    targetCountries: [] as string[],
    isPremiumOnly: false,
    isNewUserOnly: false,
    newUserMaxAccountAgeDays: 7,
    requiredFreeTier: 'BASIC',
    proofType: 'SCREENSHOT',
    targetUrl: '',
    requiredPlatform: 'NONE',
    xpReward: 0,
    tierRewardMatrix: {} as Record<string, number>,
    doubleRewardsStartAt: '',
    doubleRewardsEndAt: '',
    isActive: true,
  });

  useEffect(() => {
    if (taskId) dispatch(fetchStandaloneTaskById(taskId));
    if (countries.length === 0) dispatch(fetchCountries());
  }, [countries.length, dispatch, taskId]);

  useEffect(() => {
    if (!selectedTask) return;
    setFormData({
      title: selectedTask.title || '',
      description: selectedTask.description || '',
      category: selectedTask.category || 'SOCIAL',
      coverImageUrl: selectedTask.coverImageUrl || '',
      targetCountries: selectedTask.targetCountries || [],
      isPremiumOnly: Boolean(selectedTask.isPremiumOnly),
      isNewUserOnly: Boolean(selectedTask.isNewUserOnly),
      newUserMaxAccountAgeDays: selectedTask.newUserMaxAccountAgeDays ?? 7,
      requiredFreeTier: selectedTask.requiredFreeTier || 'BASIC',
      proofType: selectedTask.proofType || 'SCREENSHOT',
      targetUrl: selectedTask.targetUrl || '',
      requiredPlatform: selectedTask.requiredPlatform || 'NONE',
      xpReward: selectedTask.xpReward ?? selectedTask.xpRewardOverride ?? 0,
      tierRewardMatrix: selectedTask.tierRewardMatrix || selectedTask.tierRewardMatrixOverride || {},
      doubleRewardsStartAt: selectedTask.doubleRewardsStartAt ? selectedTask.doubleRewardsStartAt.slice(0, 16) : '',
      doubleRewardsEndAt: selectedTask.doubleRewardsEndAt ? selectedTask.doubleRewardsEndAt.slice(0, 16) : '',
      isActive: selectedTask.isActive !== false,
    });
  }, [selectedTask]);

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.trim().toLowerCase())
  );
  const completionsCount = Number(selectedTask?.completionsCount || 0);

  const totalRewardPool = useMemo(
    () => [...FREE_TIERS, ...PREMIUM_TIERS].reduce((sum, tier) => sum + Number(formData.tierRewardMatrix[tier] || 0), 0),
    [formData.tierRewardMatrix]
  );

  const highestReward = useMemo(
    () => Math.max(...Object.values(formData.tierRewardMatrix).map((value) => Number(value || 0)), 0),
    [formData.tierRewardMatrix]
  );

  const updatePremiumOnly = (nextValue: boolean) => {
    setFormData((prev) => {
      const nextMatrix = { ...prev.tierRewardMatrix };
      if (nextValue) {
        for (const tier of FREE_TIERS) {
          nextMatrix[tier] = 0;
        }
      }

      return {
        ...prev,
        isPremiumOnly: nextValue,
        requiredFreeTier: nextValue ? 'BASIC' : prev.requiredFreeTier,
        tierRewardMatrix: nextMatrix,
      };
    });
  };

  const handleCountryToggle = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      targetCountries: prev.targetCountries.includes(country)
        ? prev.targetCountries.filter((item) => item !== country)
        : [...prev.targetCountries, country],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let coverImageUrl = formData.coverImageUrl || '';
      if (coverImageFile) {
        setIsUploadingCover(true);
        const uploadResult = await dispatch(uploadCampaignCover(coverImageFile));
        setIsUploadingCover(false);
        if (uploadCampaignCover.fulfilled.match(uploadResult)) {
          coverImageUrl = uploadResult.payload;
        } else {
          setErrorMsg((uploadResult.payload as string) || 'Failed to upload cover image.');
          return;
        }
      }

      await dispatch(updateStandaloneTask({
        taskId,
        data: {
          title: formData.title.trim(),
          description: formData.description,
          category: formData.category,
          coverImageUrl: coverImageUrl || null,
          targetCountries: formData.targetCountries,
          isPremiumOnly: formData.isPremiumOnly,
          isNewUserOnly: formData.isNewUserOnly,
          newUserMaxAccountAgeDays: formData.isNewUserOnly ? Number(formData.newUserMaxAccountAgeDays) : null,
          requiredFreeTier: formData.requiredFreeTier,
          proofType: formData.proofType,
          targetUrl: formData.targetUrl || '',
          requiredPlatform: formData.requiredPlatform,
          xpReward: formData.xpReward,
          tierRewardMatrix: formData.tierRewardMatrix,
          doubleRewardsStartAt: toIsoDateTime(formData.doubleRewardsStartAt),
          doubleRewardsEndAt: toIsoDateTime(formData.doubleRewardsEndAt),
          isActive: formData.isActive,
        },
      })).unwrap();
      setSuccessMsg('Standalone task updated successfully.');
      setCoverImageFile(null);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to update task.');
    } finally {
      setIsUploadingCover(false);
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
    <div className="min-h-screen bg-[#020202] px-4 py-6 text-white md:px-6 lg:px-8 pb-32">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 md:gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
          <div className="sticky top-0 z-40 rounded-3xl border border-[#1a1a1a] bg-[#020202]/90 p-4 backdrop-blur-xl shadow-2xl md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin/tasks')}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 text-sm font-bold text-white/75 transition hover:bg-[#111] hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </button>
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.25em] text-sats-orange-400/80">Standalone setup</p>
                  <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">Edit standalone task</h1>
                  <p className="mt-1 text-sm text-white/45">Update standalone settings without touching campaign data.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 px-5 text-sm font-black text-red-300 transition hover:bg-red-500/15 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Delete Task
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingCover}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-sats-orange-500 px-6 text-sm font-black text-black transition hover:bg-sats-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving || isUploadingCover ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Standalone Task
                </button>
              </div>
            </div>
          </div>

          {errorMsg ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">{errorMsg}</div> : null}
          {successMsg ? <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">{successMsg}</div> : null}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
            <div className="space-y-6">
              <section className={cardCls}>
                <SectionTitle icon={<Target className="h-5 w-5" />} title="Basic Details" subtitle="Update standalone metadata with the same polished flow as create." />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <InputWrap label="Task Title" required>
                      <input value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className={inputCls} required />
                    </InputWrap>
                  </div>

                  <div className="md:col-span-2">
                    <InputWrap label="Cover Image" hint="Upload from device or paste an image URL">
                      <div className="space-y-3">
                        <input type="file" accept="image/*" onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)} className={inputCls} />
                        <input value={formData.coverImageUrl} onChange={(e) => setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))} className={inputCls} placeholder="https://example.com/cover.jpg" />
                      </div>
                    </InputWrap>
                  </div>

                  <div className="md:col-span-2">
                    <InputWrap label="Description" required>
                      <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} className={`${inputCls} min-h-32 resize-y`} required />
                    </InputWrap>
                  </div>

                  <InputWrap label="Category">
                    <select value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} className={`${inputCls} appearance-none cursor-pointer`}>
                      {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-gray-400" />
                  </InputWrap>

                  <InputWrap label="Proof Type">
                    <select value={formData.proofType} onChange={(e) => setFormData((prev) => ({ ...prev, proofType: e.target.value }))} className={`${inputCls} appearance-none cursor-pointer`}>
                      {PROOF_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-gray-400" />
                  </InputWrap>

                  <div className="md:col-span-2">
                    <InputWrap label="Target URL">
                      <input value={formData.targetUrl} onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))} className={inputCls} placeholder="https://..." />
                    </InputWrap>
                  </div>
                </div>

                {(coverImageFile || formData.coverImageUrl) ? (
                  <div className="mt-6 overflow-hidden rounded-3xl border border-[#1a1a1a] bg-[#090909]">
                    <div className="relative h-52 w-full">
                      <Image src={coverImageFile ? URL.createObjectURL(coverImageFile) : formData.coverImageUrl} alt="Standalone cover preview" fill unoptimized className="object-cover" />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex h-52 items-center justify-center rounded-3xl border border-dashed border-[#1f1f1f] bg-[#070707] text-center text-white/35">
                    <div>
                      <ImagePlus className="mx-auto mb-3 h-8 w-8" />
                      <p className="text-sm font-semibold">Cover preview appears here</p>
                    </div>
                  </div>
                )}
              </section>

              <section className={cardCls}>
                <SectionTitle icon={<Shield className="h-5 w-5" />} title="Categorization & Gates" subtitle="Keep edit behavior aligned with create and campaign gates." />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-8">
                  <InputWrap label="Required Free Tier">
                    <select value={formData.requiredFreeTier} onChange={(e) => setFormData((prev) => ({ ...prev, requiredFreeTier: e.target.value }))} disabled={formData.isPremiumOnly} className={`${inputCls} appearance-none cursor-pointer disabled:opacity-50`}>
                      {FREE_TIERS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-gray-400" />
                  </InputWrap>

                  <InputWrap label="Platform Targeting">
                    <select value={formData.requiredPlatform} onChange={(e) => setFormData((prev) => ({ ...prev, requiredPlatform: e.target.value }))} className={`${inputCls} appearance-none cursor-pointer`}>
                      {PLATFORMS.map((item) => <option key={item} value={item}>{PLATFORM_LABELS[item] || item}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-gray-400" />
                  </InputWrap>

                  <InputWrap label="New User Audience" hint="Optional onboarding-only gate">
                    <select value={formData.isNewUserOnly ? 'NEW_USERS_ONLY' : 'ALL_USERS'} onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      isNewUserOnly: e.target.value === 'NEW_USERS_ONLY',
                      newUserMaxAccountAgeDays: e.target.value === 'NEW_USERS_ONLY' ? (prev.newUserMaxAccountAgeDays || 7) : 7,
                    }))} className={`${inputCls} appearance-none cursor-pointer`}>
                      <option value="ALL_USERS">All Users</option>
                      <option value="NEW_USERS_ONLY">New Users Only</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-gray-400" />
                  </InputWrap>

                  {formData.isNewUserOnly ? (
                    <InputWrap label="New User Window (Days)" hint="Account age limit" required>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.newUserMaxAccountAgeDays || ''} onChange={(e) => setFormData((prev) => ({ ...prev, newUserMaxAccountAgeDays: parseWholeNumber(e.target.value) }))} className={inputCls} placeholder="7" />
                    </InputWrap>
                  ) : <div className="hidden md:block" />}
                </div>

                <div className="mb-8">
                  <InputWrap label="Target Countries" hint="Leave selection empty to allow all countries">
                  <div className="mb-3 flex items-center justify-end">
                        <span className="inline-flex items-center rounded-full border border-sats-orange-500/40 bg-sats-orange-500 px-3 py-1 text-xs font-bold tracking-wide text-sats-orange-300">
                          Selected Countries [{formData.targetCountries.length}/{countries.length || 196}]
                        </span>
                      </div>
                    <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4 max-h-72 overflow-y-auto">
                      <div className="mb-4">
                        <input type="text" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} placeholder="Search countries..." className="w-full rounded-xl border border-[#1a1a1a] bg-black px-4 py-2.5 text-sm font-medium text-white outline-none transition-all focus:border-sats-orange-500/50 focus:bg-[#111]" />
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCountries.map((country) => {
                          const selected = formData.targetCountries.includes(country);
                          return (
                            <button
                              key={country}
                              type="button"
                              onClick={() => handleCountryToggle(country)}
                              className={`rounded-xl border px-3 py-2 text-left text-sm transition-all ${selected ? 'border-sats-orange-500 bg-sats-orange-500 text-black' : 'border-[#1a1a1a] bg-black text-gray-300 hover:border-sats-orange-500/40'}`}
                            >
                              {country}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </InputWrap>
                </div>

                <div className="border-t border-[#1a1a1a] pt-8 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 max-w-sm">
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-bold text-white"><Crown className="h-4 w-4 text-yellow-500" /> Premium Exclusive</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-400">Restrict to paid users</p>
                    </div>
                    <button type="button" onClick={() => updatePremiumOnly(!formData.isPremiumOnly)} className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.isPremiumOnly ? 'bg-sats-orange-500' : 'bg-[#1a1a1a]'}`}>
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isPremiumOnly ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 max-w-sm">
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-bold text-white"><CheckSquare className="h-4 w-4 text-sats-orange-400" /> Task Visibility</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-400">Show or hide this standalone task</p>
                    </div>
                    <button type="button" onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))} className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-[#1a1a1a]'}`}>
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>

                </div>
              </section>

              <section className={cardCls}>
                <SectionTitle icon={<CalendarDays className="h-5 w-5" />} title="Boost Window" subtitle="Optional double rewards period for this standalone task." />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputWrap label="Double Rewards Start">
                    <input type="datetime-local" value={formData.doubleRewardsStartAt} onChange={(e) => setFormData((prev) => ({ ...prev, doubleRewardsStartAt: e.target.value }))} className={`${inputCls} [color-scheme:dark]`} />
                  </InputWrap>
                  <InputWrap label="Double Rewards End">
                    <input type="datetime-local" value={formData.doubleRewardsEndAt} onChange={(e) => setFormData((prev) => ({ ...prev, doubleRewardsEndAt: e.target.value }))} className={`${inputCls} [color-scheme:dark]`} />
                  </InputWrap>
                </div>
              </section>
            </div>

            <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
              <section className={cardCls}>
                <SectionTitle icon={<Trophy className="h-5 w-5" />} title="Task Rewards" subtitle="Premium-only mode disables all free-tier rewards automatically." />

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">XP Reward</p>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.xpReward || ''} onChange={(e) => setFormData((prev) => ({ ...prev, xpReward: parseWholeNumber(e.target.value) }))} className="mt-2 w-full border-0 bg-transparent p-0 text-lg font-black text-white outline-none" placeholder="0" />
                  </div>
                  <div className="rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Top Reward</p>
                    <p className="mt-2 text-lg font-black text-white">{highestReward} sats</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Free Tiers</p>
                    <div className="space-y-2.5">
                      {FREE_TIERS.map((tier) => (
                        <div key={tier} className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${formData.isPremiumOnly ? 'border-[#171717] bg-[#070707] opacity-50' : 'border-[#1a1a1a] bg-[#090909]'}`}>
                          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/65">{tier}</span>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.tierRewardMatrix[tier] || ''} onChange={(e) => setFormData((prev) => ({ ...prev, tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: parseWholeNumber(e.target.value) } }))} placeholder="0" disabled={formData.isPremiumOnly} className="w-24 rounded-xl border border-[#242424] bg-[#111] px-3 py-2 text-right text-sm font-black text-white outline-none focus:border-sats-orange-500 disabled:cursor-not-allowed disabled:opacity-40" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300/80">Premium Tiers</p>
                    <div className="space-y-2.5">
                      {PREMIUM_TIERS.map((tier) => (
                        <div key={tier} className="flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
                          <span className="text-xs font-black uppercase tracking-[0.16em] text-yellow-100">{tier}</span>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" value={formData.tierRewardMatrix[tier] || ''} onChange={(e) => setFormData((prev) => ({ ...prev, tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: parseWholeNumber(e.target.value) } }))} placeholder="0" className="w-24 rounded-xl border border-yellow-500/20 bg-[#111] px-3 py-2 text-right text-sm font-black text-white outline-none focus:border-sats-orange-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className={cardCls}>
                <SectionTitle icon={<Sparkles className="h-5 w-5" />} title="Preview Summary" subtitle="Quick health check before saving changes." />
                <div className="space-y-3 text-sm text-white/65">
                  <div className="flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                    <span className="flex items-center gap-2"><CheckSquare className="h-4 w-4 text-sats-orange-400" /> Completions</span>
                    <span className="font-bold text-white">{completionsCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                    <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-sats-orange-400" /> XP Reward</span>
                    <span className="font-bold text-white">{formData.xpReward} XP</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                    <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-sats-orange-400" /> Countries</span>
                    <span className="font-bold text-white">{formData.targetCountries.length || 'Global'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                    <span className="flex items-center gap-2"><Crown className="h-4 w-4 text-sats-orange-400" /> Access</span>
                    <span className="font-bold text-white">{formData.isPremiumOnly ? 'Premium only' : `${formData.requiredFreeTier}+`}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                    <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-sats-orange-400" /> Audience</span>
                    <span className="font-bold text-white">{formData.isNewUserOnly ? `New users (${formData.newUserMaxAccountAgeDays}d)` : 'All users'}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
