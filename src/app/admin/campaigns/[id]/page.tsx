'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCampaign, deleteCampaign, uploadCampaignCover } from '@/features/admin/adminCampaignsSlice';
import { fetchCountries } from '@/features/admin/adminCountriesSlice';
import type { Campaign, AdminTask } from '@/types/admin';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import {
  CampaignCoverHero,
  CampaignStickyHeader,
  CampaignSuccessToast,
} from '@/components/admin/campaign/CampaignDetailHeader';
import { CampaignAnalyticsPanel } from '@/components/admin/campaign/CampaignAnalyticsPanel';
import { DateTimePickerInput, Field, inputCls } from '@/components/admin/campaign/CampaignDetailShared';
import { 
  Link as LinkIcon, Loader2, X,
  Zap, Target, Crown, Users, Plus, Check, Medal, Edit3, Save, Trash2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const CATEGORIES = ["SOCIAL", "SURVEY", "VIDEO_AD", "APP_INSTALL", "OFFERWALL", "LEARN_EARN", "DAILY_STREAK"];
const FREE_TIERS = ["BASIC", "COPPER", "BRONZE", "SILVER", "GOLD"];
const PREMIUM_TIERS = ["PLATINUM", "DIAMOND", "CROWN", "ELITE", "FOUNDER"];
const DEVICE_OPTIONS = ["NONE", "DESKTOP", "ANDROID", "IOS"];
const PLATFORMS = ["TWITTER", "YOUTUBE", "INSTAGRAM", "TELEGRAM", "FACEBOOK", "LINKEDIN", "APP_STORE", "PLAY_STORE", "WEBSITE"];
const PROOF_TYPES = ["SCREENSHOT", "URL", "TEXT_RESPONSE", "API_VERIFIED"];

function parseWholeNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly === '') return 0;

  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

type CampaignAnalytics = {
  totalSubmissions?: number;
  statusCounts?: { verified?: number; pending?: number; rejected?: number };
  tierDistribution?: Record<string, number>;
  satsByTierDistribution?: Record<string, number>;
  totalTaskRewardSatsSpent?: number;
  totalRewardedSubmissions?: number;
  totalRewardedUsers?: number;
  averageRewardPerApprovedSubmission?: number;
  campaignTaskCount?: number;
};

type CampaignEditForm = Partial<Campaign> & {
  title:string;
  description:string;
  targetCountries: string[];
  doubleRewardsStartAt?: string | null;
  doubleRewardsEndAt?: string | null;
};

type TaskFormState = {
  title: string;
  description: string;
  requiredPlatform: string;
  proofType: string;
  targetUrl: string;
  xpRewardOverride: number;
  tierRewardMatrixOverride: Record<string, number>;
};

type EditableTask = AdminTask & {
  proofType?: string;
  requiredPlatform?: string;
  xpRewardOverride?: number;
};

type ValidationIssue = { path?: string; message: string };

const createEmptyTaskTierMatrix = () =>
  [...FREE_TIERS, ...PREMIUM_TIERS].reduce<Record<string, number>>((acc, tier) => {
    acc[tier] = 0;
    return acc;
  }, {});

const mergeTaskTierMatrix = (matrix?: Record<string, number> | null) => {
  const base = createEmptyTaskTierMatrix();
  if (!matrix) return base;

  for (const tier of [...FREE_TIERS, ...PREMIUM_TIERS]) {
    base[tier] = Number(matrix[tier] || 0);
  }

  return base;
};

const hasTaskMatrixOverrides = (matrix?: Record<string, number> | null) => {
  if (!matrix) return false;

  return [...FREE_TIERS, ...PREMIUM_TIERS].some((tier) => Number(matrix[tier] || 0) > 0);
};

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Platform Logo Helper Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export const PlatformLogo = ({ url, className = "w-6 h-6" }: { url: string | null, className?: string }) => {
  if (!url) return <LinkIcon className={className} />;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return <svg viewBox="0 0 24 24" className={`fill-current ${className}`}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
  }
  if (lowerUrl.includes('instagram.com')) {
    return <svg viewBox="0 0 24 24" className={`fill-current ${className}`}><path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
  }
  return <LinkIcon className={className} />;
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const normalizeCampaignPayload = (data: any) => {
  if (!data || typeof data !== 'object') return null;
  return data.campaign || data.data || data.item || data;
};

export default function SingleCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector((state) => state.adminCountries);
  
  const [campaign, setCampaign] = useState<(Campaign & { tasks?: EditableTask[] }) | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Update Successful");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isDoubleRewardsEnabled, setIsDoubleRewardsEnabled] = useState(false);
  
  const [editForm, setEditForm] = useState<CampaignEditForm>({
    title:'',
    description:'',
    targetCountries: [],
    xpReward: 0,
    coverImageUrl: '',
  });

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ TASK CREATION & EDITING STATE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskFormState>({
    title: '', description: '', requiredPlatform: 'WEBSITE', proofType: 'SCREENSHOT', targetUrl:'', xpRewardOverride: 0, tierRewardMatrixOverride: createEmptyTaskTierMatrix(),
  });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskForm, setEditingTaskForm] = useState<EditableTask>({} as EditableTask);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState<string | null>(null);

  const fetchCampaignData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('sats_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [campRes, analyticsRes] = await Promise.all([
  obfuscatedFetch(`${API_URL}/admin/campaigns/${id}`, { headers, cache: 'no-store' }),
  obfuscatedFetch(`${API_URL}/admin/campaigns/${id}/analytics`, { headers, cache: 'no-store' })
]);

      if (campRes.ok) {
        const rawCampaignData = await parseObfuscatedJson<any>(campRes);
        const campData = normalizeCampaignPayload(rawCampaignData);
        if (!campData) {
          throw new Error('Invalid campaign response received.');
        }
        setCampaign(campData);
        setEditForm({
          ...campData,
          targetCountries: campData.targetCountries || [],
          tierRewardMatrix: campData.tierRewardMatrix || {},
          xpReward: campData.xpReward || 0,
          coverImageUrl: campData.coverImageUrl || '',
          doubleRewardsStartAt: campData.doubleRewardsStartAt || '',
          doubleRewardsEndAt: campData.doubleRewardsEndAt || '',
        });
        setIsDoubleRewardsEnabled(Boolean(campData.doubleRewardsStartAt && campData.doubleRewardsEndAt));
      }

      if (analyticsRes.ok) {
        const analyticsData = await parseObfuscatedJson<any>(analyticsRes);
        setAnalytics(analyticsData);
} else {
  setAnalytics(null); // or fallback
}
    } catch (err) {
      console.error("Failed to fetch campaign data", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);
  const handleCountryToggle = (country: string) => {
    setEditForm((prev) => ({
      ...prev,
      targetCountries: prev.targetCountries?.includes(country)
        ? prev.targetCountries.filter((item) => item !== country)
        : [...(prev.targetCountries || []), country],
    }));
  };

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.trim().toLowerCase())
  );

  const handleSelectAllCountries = () => {
    setEditForm((prev) => ({
      ...prev,
      targetCountries: [...countries],
    }));
  };

  const handleClearAllCountries = () => {
    setEditForm((prev) => ({
      ...prev,
      targetCountries: [],
    }));
  };

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries.length, dispatch]);
  useEffect(() => {
    fetchCampaignData();
  }, [fetchCampaignData]);

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ CAMPAIGN CRUD Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleSave = async () => {
    if (!campaign) return;

    if (
      editForm.doubleRewardsStartAt &&
      editForm.doubleRewardsEndAt &&
      new Date(editForm.doubleRewardsEndAt).getTime() < new Date(editForm.doubleRewardsStartAt).getTime()
    ) {
      alert('Double rewards end time cannot be earlier than the start time.');
      return;
    }

    if (isDoubleRewardsEnabled && (!editForm.doubleRewardsStartAt || !editForm.doubleRewardsEndAt)) {
      alert('Please choose both 2x reward start and end time before saving the campaign.');
      return;
    }

    if (!isDoubleRewardsEnabled && (editForm.doubleRewardsStartAt || editForm.doubleRewardsEndAt)) {
      alert('Turn on the 2x rewards toggle to use the scheduled double rewards window.');
      return;
    }

    setIsSaving(true);

    let coverImageUrl = editForm.coverImageUrl || '';
    if (coverImageFile) {
      setIsUploadingCover(true);
      const uploadResult = await dispatch(uploadCampaignCover(coverImageFile));
      setIsUploadingCover(false);
      if (uploadCampaignCover.fulfilled.match(uploadResult)) {
        coverImageUrl = uploadResult.payload;
      } else {
        alert((uploadResult.payload as string) || 'Failed to upload campaign cover.');
        setIsSaving(false);
        return;
      }
    }

    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      category: editForm.category,
      coverImageUrl: coverImageUrl?.trim() || null,
      targetCountries: editForm.targetCountries || [],
      isPremiumOnly: editForm.isPremiumOnly,
      requiredFreeTier: editForm.requiredFreeTier,
      baseRewardSats: Number(campaign.baseRewardSats || 0),
      xpReward: Number(editForm.xpReward || 0),
      maxCompletions: Number(editForm.maxCompletions),
      isActive: editForm.isActive,
      targetUrl: editForm.targetUrl?.trim() || undefined,
      socialHandleTarget: editForm.socialHandleTarget?.trim() || undefined,
      doubleRewardsStartAt: isDoubleRewardsEnabled ? (editForm.doubleRewardsStartAt || null) : null,
      doubleRewardsEndAt: isDoubleRewardsEnabled ? (editForm.doubleRewardsEndAt || null) : null,
    };

    const result = await dispatch(updateCampaign({ id: campaign.id, data: payload }));
    
    if (updateCampaign.fulfilled.match(result)) {
      await fetchCampaignData();
      setIsEditing(false);
      triggerSuccess("Campaign Updated Live.");
    } else {
      alert("Failed to update campaign.");
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!campaign) return;
    if (window.confirm(`Are you sure you want to delete "${campaign.title}"? All user submissions and associated tasks will be lost forever.`)) {
      setIsDeleting(true);
      const result = await dispatch(deleteCampaign(campaign.id));
      if (deleteCampaign.fulfilled.match(result)) {
        router.push('/admin/campaigns');
      } else {
        alert("Failed to delete campaign.");
        setIsDeleting(false);
      }
    }
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ TASK CRUD Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTask(true);

    try {
      const hasAnyTierOverride = [...FREE_TIERS, ...PREMIUM_TIERS].some((tier) => Number(taskForm.tierRewardMatrixOverride[tier] || 0) > 0);
      if (!hasAnyTierOverride) {
        throw new Error('Add at least one tier reward value.');
      }
      if (Number(taskForm.xpRewardOverride) < 0) {
        throw new Error('Task XP cannot be negative.');
      }

      const token = sessionStorage.getItem('sats_token');
      const res = await obfuscatedFetch(`${API_URL}/admin/campaigns/${id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          proofType: taskForm.proofType,
          requiredPlatform: taskForm.requiredPlatform,
          targetUrl: taskForm.targetUrl || undefined,
          xpRewardOverride: Number(taskForm.xpRewardOverride || 0),
          tierRewardMatrixOverride: taskForm.tierRewardMatrixOverride,
        })
      });

      if (!res.ok) {
        const errorData = await parseObfuscatedJson<any>(res);
        // Zod validation parser so you see EXACTLY why it failed!
        if (errorData.details) {
          throw new Error(errorData.details.map((d: ValidationIssue) => `${d.path}: ${d.message}`).join(' | '));
        }
        throw new Error(errorData.error || "Failed to create task");
      }

      await fetchCampaignData();
      setTaskForm({ title: '', description: '', requiredPlatform: 'WEBSITE', proofType: 'SCREENSHOT', targetUrl:'', xpRewardOverride: 0, tierRewardMatrixOverride: createEmptyTaskTierMatrix() });
      setIsAddingTask(false);
      triggerSuccess("Task Added Successfully.");
    } catch (err) {
      alert(`Validation Error: \n${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId) return;
    setIsUpdatingTask(true);

    try {
      const normalizedTaskTierMatrix = mergeTaskTierMatrix(editingTaskForm.tierRewardMatrixOverride);
      const hasAnyTierOverride = [...FREE_TIERS, ...PREMIUM_TIERS].some(
        (tier) => Number(normalizedTaskTierMatrix[tier] || 0) > 0
      );

      if (!hasAnyTierOverride) {
        alert('Please enter at least one tier reward value.');
        setIsUpdatingTask(false);
        return;
      }
      if (Number(editingTaskForm.xpRewardOverride || 0) < 0) {
        alert('Task XP cannot be negative.');
        setIsUpdatingTask(false);
        return;
      }

      const token = sessionStorage.getItem('sats_token');
      const res = await obfuscatedFetch(`${API_URL}/admin/campaigns/${id}/tasks/${editingTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: editingTaskForm.title,
          description: editingTaskForm.description,
          proofType: editingTaskForm.proofType,
          requiredPlatform: editingTaskForm.requiredPlatform || 'WEBSITE',
          ...(editingTaskForm.targetUrl?.trim() ? { targetUrl: editingTaskForm.targetUrl.trim() } : { targetUrl: '' }),
          xpRewardOverride: Number(editingTaskForm.xpRewardOverride || 0),
          tierRewardMatrixOverride: normalizedTaskTierMatrix,
        })
      });

      if (!res.ok) {
        const errorData = await parseObfuscatedJson<any>(res);
        if (errorData.details) throw new Error(errorData.details.map((d: ValidationIssue) => `${d.path}: ${d.message}`).join(' | '));
        throw new Error(errorData.error || "Failed to update task");
      }

      await fetchCampaignData();
      setEditingTaskId(null);
      triggerSuccess("Task Updated Successfully.");
    } catch (err) {
      alert(`Update Failed: \n${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this task?")) return;
    setIsDeletingTask(taskId);

    try {
      const token = sessionStorage.getItem('sats_token');
      const res = await obfuscatedFetch(`${API_URL}/admin/campaigns/${id}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete task");

      await fetchCampaignData();
      triggerSuccess("Task Deleted Successfully.");
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsDeletingTask(null);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#020202] flex items-center justify-center"><Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" /></div>;
  if (!campaign) return <div className="min-h-screen bg-[#020202] flex items-center justify-center text-red-400 font-bold">Campaign not found.</div>;

  const safeTotal = Number(campaign.totalCompletions) || 0;
  const safeMax = Number(campaign.maxCompletions) || 1;
  const progressPercent = Math.min((safeTotal / safeMax) * 100, 100);
  const visibleRewardTiers = editForm.isPremiumOnly
    ? PREMIUM_TIERS
    : [...FREE_TIERS, ...PREMIUM_TIERS];
  const hasAnyTierReward = visibleRewardTiers.some((tier) => Number(editForm.tierRewardMatrix?.[tier]) > 0);
  const topTierReward = visibleRewardTiers.reduce((max, tier) => Math.max(max, Number(campaign.tierRewardMatrix?.[tier] || 0)), 0);
  const totalSpent = Number(analytics?.totalTaskRewardSatsSpent || 0);
  const totalRewardedSubmissions = Number(analytics?.totalRewardedSubmissions || analytics?.statusCounts?.verified || 0);
  const totalRewardedUsers = Number(analytics?.totalRewardedUsers || totalRewardedSubmissions || 0);
  const averageReward = Number(
    analytics?.averageRewardPerApprovedSubmission ||
    (totalRewardedSubmissions > 0 ? Math.floor(totalSpent / totalRewardedSubmissions) : 0)
  );
  const campaignTaskCount = Number(analytics?.campaignTaskCount || campaign.tasks?.length || 0);

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32 relative overflow-x-hidden">
      <CampaignSuccessToast show={showSuccess} message={successMessage} />

      <div className="max-w-350 mx-auto w-full flex flex-col gap-6 md:gap-8">
        <CampaignCoverHero coverImageUrl={campaign.coverImageUrl} title={campaign.title} />

        <CampaignStickyHeader
          isEditing={isEditing}
          isDeleting={isDeleting}
          isSaving={isSaving}
          isUploadingCover={isUploadingCover}
          onBack={() => router.push('/admin/campaigns')}
          onDelete={handleDelete}
          onEdit={() => setIsEditing(true)}
          onCancel={() => {
            setEditForm({
              ...campaign,
              targetCountries: campaign.targetCountries || [],
              tierRewardMatrix: campaign.tierRewardMatrix || {},
              xpReward: campaign.xpReward || 0,
              coverImageUrl: campaign.coverImageUrl || '',
              doubleRewardsStartAt: campaign.doubleRewardsStartAt || '',
              doubleRewardsEndAt: campaign.doubleRewardsEndAt || '',
            });
            setIsEditing(false);
          }}
          onSave={handleSave}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
          {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ LEFT COLUMN (Spans 2): Campaign Details Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
          <div className="xl:col-span-2 flex flex-col gap-6 md:gap-8">
            <div className="bg-sats-black-950 border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              
              {/* Core Info Header */}
              <div className="flex items-start gap-6 mb-8 border-b border-[#1a1a1a] pb-8">
                <div className="w-16 h-16 rounded-2xl bg-sats-black-900 border border-[#2a2a2a] flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
                  <PlatformLogo url={campaign.targetUrl} className="w-8 h-8" />
                </div>
                <div className="flex-1 w-full overflow-hidden pt-1">
                  {!isEditing ? (
                    <>
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate mb-2">{campaign.title}</h1>
                      <p className="text-gray-400 leading-relaxed text-sm md:text-base">{campaign.description}</p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <input type="text" value={editForm.title} required minLength={5} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-[#111] border border-[#2a2a2a] text-white text-xl font-bold px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-all" placeholder="Campaign Title (Min 5 chars)" />
                      <textarea value={editForm.description} required minLength={10} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#111] border border-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 min-h-30 transition-all" placeholder="Description (Min 10 chars)" />
                      <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 space-y-3">
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest">Campaign Cover Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setCoverImageFile(e.target.files?.[0] || null)}
                          className={inputCls}
                        />
                        <input
                          type="url"
                          value={editForm.coverImageUrl || ''}
                          onChange={e => setEditForm({ ...editForm, coverImageUrl: e.target.value })}
                          placeholder="Or paste image URL https://..."
                          className={inputCls}
                        />
                        {(coverImageFile || editForm.coverImageUrl) && (
                          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-[#1a1a1a]">
                            <Image
                              src={coverImageFile ? URL.createObjectURL(coverImageFile) : (editForm.coverImageUrl || '')}
                              alt="Campaign cover preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Budget */}
              <div className="bg-linear-to-b from-sats-black-900 to-sats-black-950 rounded-2xl p-6 border border-[#1a1a1a] mb-8">
                <div className="flex justify-between items-end mb-5">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Completions Limit</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{safeTotal.toLocaleString()}</span>
                      <span className="text-gray-500 font-medium">/ {safeMax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1.5"><Zap className="w-3.5 h-3.5 text-sats-orange-500" /> Top Tier Reward</p>
                    <span className="text-sats-orange-500 font-black text-3xl">~ {topTierReward.toLocaleString()} <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sats</span></span>
                  </div>
                </div>
                <div className="w-full bg-[#111] border border-[#2a2a2a] rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="h-full bg-sats-orange-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-8 gap-y-6">
                <Field title="Campaign Status">
                  {!isEditing ? (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${campaign.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-gray-400 border-[#2a2a2a]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${campaign.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
                      {campaign.isActive ? 'Live & Active' : 'Paused / Draft'}
                    </span>
                  ) : (
                    <select value={editForm.isActive ? 'true' : 'false'} onChange={e => setEditForm({...editForm, isActive: e.target.value === 'true'})} className={inputCls}>
                      <option value="true">Active (Live)</option>
                      <option value="false">Paused (Draft)</option>
                    </select>
                  )}
                </Field>

                <Field title="Category">
                  {!isEditing ? <span className="text-white font-bold">{campaign.category.replace('_', ' ')}</span> : (
                    <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className={inputCls}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                    </select>
                  )}
                </Field>

                  <Field title="Access Gate">
                  {!isEditing ? (
                    <div className="flex items-center gap-2">
                      {campaign.isPremiumOnly && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black text-yellow-400 uppercase tracking-widest"><Crown className="w-3 h-3" /> Premium Only</span>}
                      <span className="text-gray-300 font-bold text-sm uppercase tracking-wider bg-[#111] px-2 py-0.5 rounded border border-[#2a2a2a]">Tier: {campaign.requiredFreeTier}</span>
                    </div>
                    ) : (
                      <div className="flex gap-4">
                        <select value={editForm.requiredFreeTier} onChange={e => setEditForm({...editForm, requiredFreeTier: e.target.value})} disabled={editForm.isPremiumOnly} className={`${inputCls} disabled:opacity-50`}>
                          {FREE_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, isPremiumOnly: !prev.isPremiumOnly }))} className={`shrink-0 px-4 rounded-xl border text-xs font-bold transition-all ${editForm.isPremiumOnly ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-[#111] border-[#2a2a2a] text-gray-500'}`}>
                        <Crown className="w-4 h-4 mx-auto mb-0.5" /> Premium
                      </button>
                    </div>
                  )}
                  </Field>

                  <Field title="Device Targeting">
                    {!isEditing ? (
                      <span className="text-white font-bold">
                        {campaign.requiredPlatform === 'DESKTOP'
                          ? 'Desktop Only'
                          : campaign.requiredPlatform === 'ANDROID'
                            ? 'Android Only'
                            : campaign.requiredPlatform === 'IOS'
                              ? 'iOS Only'
                              : 'All Devices'}
                      </span>
                    ) : (
                      <select value={editForm.requiredPlatform || 'NONE'} onChange={e => setEditForm({ ...editForm, requiredPlatform: e.target.value as Campaign['requiredPlatform'] })} className={inputCls}>
                        {DEVICE_OPTIONS.map(device => (
                          <option key={device} value={device}>
                            {device === 'NONE' ? 'All Devices' : device === 'DESKTOP' ? 'Desktop Only' : device === 'ANDROID' ? 'Android Only' : 'iOS Only'}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>

                  <div className="sm:col-span-2">
                  <Field title="Target Countries">
                    {!isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        {campaign.targetCountries?.length ? campaign.targetCountries.map((country: string) => (
                          <span key={country} className="px-2 py-1 rounded-lg bg-[#111] border border-[#1a1a1a] text-xs font-bold text-gray-300">
                            {country}
                          </span>
                        )) : <span className="text-gray-500 text-sm">All countries</span>}
                      </div>
                    ) : (
                      <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 space-y-4 col-span-2 w-full">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search countries..."
                            className="flex-1 bg-black border border-[#1a1a1a] text-white text-sm font-medium px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500/50 transition-all"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSelectAllCountries}
                              className="px-4 py-3 rounded-xl border border-sats-orange-500/30 bg-sats-orange-500/10 text-sats-orange-400 text-xs font-bold hover:bg-sats-orange-500/20 transition-all"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={handleClearAllCountries}
                              className="px-4 py-3 rounded-xl border border-[#2a2a2a] bg-[#111] text-gray-300 text-xs font-bold hover:border-[#3a3a3a] transition-all"
                            >
                              Deselect All
                            </button>
                          </div>
                        </div>

                        <div className="max-h-56 overflow-y-auto pr-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                          {filteredCountries.map((country) => {
                            const selected = editForm.targetCountries?.includes(country);
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
                          {filteredCountries.length === 0 && (
                            <p className="text-sm text-gray-500 py-4 text-center">No countries found.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </Field>
                  </div>

                <div className="sm:col-span-2">
                <Field title="Campaign Economics">
                  {!isEditing ? (
                    <div className="space-y-1">
                      <span className="text-white font-bold">{campaign.maxCompletions.toLocaleString()} Max <span className="text-gray-500 mx-2">|</span> Up to {topTierReward.toLocaleString()} Sats</span>
                      {campaign.doubleRewardsStartAt && campaign.doubleRewardsEndAt && (
                        <p className="text-xs text-yellow-400 font-medium">2x Window: {formatDate(campaign.doubleRewardsStartAt)} - {formatDate(campaign.doubleRewardsEndAt)}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-5 items-start">
                        {/* Max Users */}
                        <div>
                          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            Max Completions (Users)
                          </label>
                          <input 
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required 
                            value={editForm.maxCompletions || ''} 
                            onChange={e => setEditForm({...editForm, maxCompletions: parseWholeNumber(e.target.value)})} 
                            placeholder="Max Users" 
                            className={inputCls} 
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            2x Rewards Toggle
                          </label>
                          <div className="flex items-center justify-between p-4 bg-linear-to-r from-yellow-500/10 via-[#0a0a0a] to-[#0a0a0a] border border-yellow-500/20 rounded-2xl shadow-[0_0_0_1px_rgba(234,179,8,0.05)]">
                            <div>
                              <p className="text-sm font-bold text-white flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-500" /> Schedule 2x Task Rewards</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Applies at runtime to every task reward matrix</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setIsDoubleRewardsEnabled((prev) => {
                                  const next = !prev;
                                  if (!next) {
                                    setEditForm((current) => ({
                                      ...current,
                                      doubleRewardsStartAt: '',
                                      doubleRewardsEndAt: '',
                                    }));
                                  }
                                  return next;
                                });
                              }}
                              title={isDoubleRewardsEnabled ? 'Turn off to disable the scheduled 2x rewards window' : 'Turn on to schedule 2x task rewards'}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${isDoubleRewardsEnabled ? 'bg-yellow-500' : 'bg-[#1a1a1a] border border-[#2a2a2a]'} disabled:cursor-not-allowed disabled:opacity-55`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isDoubleRewardsEnabled ? 'translate-x-[22px]' : 'translate-x-1'}`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-5 items-start">
                            <div>
                              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                Double Rewards Start Date
                              </label>
                              <DateTimePickerInput
                                value={editForm.doubleRewardsStartAt || ''}
                                onChange={(val) => setEditForm({ ...editForm, doubleRewardsStartAt: val })}
                                disabled={!isDoubleRewardsEnabled}
                              />
                            </div>

                            {/* Double Rewards End */}
                            <div>
                              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                Double Rewards End Date
                              </label>
                              <DateTimePickerInput
                                value={editForm.doubleRewardsEndAt || ''}
                                onChange={(val) => setEditForm({ ...editForm, doubleRewardsEndAt: val })}
                                disabled={!isDoubleRewardsEnabled}
                              />
                            </div>
                      </div>
                      </div>
                  )}
                </Field>
                </div>
                
              </div>
            </div>
            
            {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ TASK MANAGEMENT ZONE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1a] pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-sats-orange-500" /> Associated Tasks
                </h2>
                <button 
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className={`flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-xl transition-all shadow-sm text-sm ${isAddingTask ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-[#111] border border-[#2a2a2a] hover:bg-white/5 text-white'}`}
                >
                  {isAddingTask ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Task</>}
                </button>
              </div>

              {/* Add Task Form */}
              {isAddingTask && (
                <form onSubmit={handleCreateTask} className="mb-8 p-6 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl animate-in slide-in-from-top-4 duration-300">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-sats-orange-500" /> Create New Task</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Task Title</label>
                      <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} placeholder="e.g. Subscribe to YouTube Channel" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Detailed Instructions</label>
                      <textarea required value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} placeholder="e.g. Click the link, hit subscribe..." className={`${inputCls} min-h-[100px]`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Required Platform</label>
                        <select value={taskForm.requiredPlatform} onChange={e => setTaskForm({...taskForm, requiredPlatform: e.target.value})} className={inputCls}>
                          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Proof Type</label>
                        <select value={taskForm.proofType} onChange={e => setTaskForm({...taskForm, proofType: e.target.value})} className={inputCls}>
                          {PROOF_TYPES.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Task XP Reward</label>
                      <input required type="text" inputMode="numeric" pattern="[0-9]*" value={taskForm.xpRewardOverride || ''} onChange={e => setTaskForm({ ...taskForm, xpRewardOverride: parseWholeNumber(e.target.value) })} placeholder="0" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                        Target URL <span className="text-white/20 normal-case font-normal tracking-normal ml-1">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <LinkIcon className="w-4 h-4 text-white/15" />
                        </div>
                        <input
                          type="url"
                          value={taskForm.targetUrl}
                          onChange={e => setTaskForm({ ...taskForm, targetUrl: e.target.value })}
                          placeholder="https://twitter.com/profile (leave blank if not needed)"
                          className={`${inputCls} pl-10`}
                          pattern="https?://.+"
                          title="Must be a valid URL starting with http:// or https://"
                          minLength={10}
                          maxLength={2048}
                        />
                      </div>
                      {taskForm.targetUrl && !/^https?:\/\/.+/.test(taskForm.targetUrl) && (
                        <p className="text-[11px] text-red-400/70 mt-1.5 flex items-center gap-1">
                          <span>Ã¢Å¡Â </span> Must start with http:// or https://
                        </p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4 space-y-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5"><Medal className="w-4 h-4 text-yellow-500" /> Task Reward Table</p>
                          <p className="text-xs text-gray-500 mt-0.5">Set the sats reward for each tier on this task.</p>
                        </div>
                      </div>

                      <div className="space-y-5">

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Free Tiers</div>
                              <div className="grid grid-cols-1 gap-3">
                                {FREE_TIERS.map((tier) => (
                                  <div key={tier} className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-2.5 flex items-center justify-between">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate mr-2">{tier}</label>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      value={taskForm.tierRewardMatrixOverride[tier] || ''}
                                      onChange={(e) => setTaskForm((prev) => ({ ...prev, tierRewardMatrixOverride: { ...prev.tierRewardMatrixOverride, [tier]: parseWholeNumber(e.target.value) } }))}
                                      placeholder="0"
                                      className="w-16 bg-[#111] border border-[#2a2a2a] rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500"
                                    />
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
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      value={taskForm.tierRewardMatrixOverride[tier] || ''}
                                      onChange={(e) => setTaskForm((prev) => ({ ...prev, tierRewardMatrixOverride: { ...prev.tierRewardMatrixOverride, [tier]: parseWholeNumber(e.target.value) } }))}
                                      placeholder="0"
                                      className="w-16 bg-[#111] border border-yellow-500/20 rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="pt-2">
                      <button type="submit" disabled={isSubmittingTask} className="w-full flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black py-3 rounded-xl transition-all disabled:opacity-50">
                        {isSubmittingTask ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />} 
                        {isSubmittingTask ? 'Creating...' : 'Save Task to Campaign'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
              
              {/* Task List Display */}
              {campaign.tasks && campaign.tasks.length > 0 ? (
                <div className="space-y-4">
                  {campaign.tasks.map((task: EditableTask, index: number) => (
                    <div key={task.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 group hover:border-[#2a2a2a] transition-all">
                      
                      {/* Inline Task Editor */}
                      {editingTaskId === task.id ? (
                        <form onSubmit={handleUpdateTask} className="space-y-4 animate-in fade-in">
                          <div>
                            <input required type="text" value={editingTaskForm.title || ''} onChange={e => setEditingTaskForm({...editingTaskForm, title: e.target.value})} className={inputCls} />
                          </div>
                          <div>
                            <textarea required value={editingTaskForm.description || ''} onChange={e => setEditingTaskForm({...editingTaskForm, description: e.target.value})} className={`${inputCls} min-h-[80px]`} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Task XP Reward</label>
                            <input required type="text" inputMode="numeric" pattern="[0-9]*" value={editingTaskForm.xpRewardOverride || ''} onChange={e => setEditingTaskForm({ ...editingTaskForm, xpRewardOverride: parseWholeNumber(e.target.value) })} placeholder="0" className={inputCls} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                              value={editingTaskForm.requiredPlatform || 'WEBSITE'}
                                onChange={e => setEditingTaskForm({
                                  ...editingTaskForm,
                                  requiredPlatform: e.target.value,
                                                                  })}
                            className={inputCls}
                          >
                              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <select value={editingTaskForm.proofType || 'SCREENSHOT'} onChange={e => setEditingTaskForm({...editingTaskForm, proofType: e.target.value})} className={inputCls}>
                              {PROOF_TYPES.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                            </select>
                          </div>
                          <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                            Target URL <span className="text-white/20 normal-case font-normal tracking-normal ml-1">(optional)</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                              <LinkIcon className="w-4 h-4 text-white/15" />
                            </div>
                            <input
                              type="url"
                              value={editingTaskForm.targetUrl || ''}
                              onChange={e => setEditingTaskForm({ ...editingTaskForm, targetUrl: e.target.value })}
                              placeholder="https://... (leave blank to remove)"
                              className={`${inputCls} pl-10`}
                              pattern="https?://.+"
                              title="Must be a valid URL starting with http:// or https://"
                              minLength={10}
                              maxLength={2048}
                            />
                          </div>
                          {editingTaskForm.targetUrl && !/^https?:\/\/.+/.test(editingTaskForm.targetUrl) && (
                            <p className="text-[11px] text-red-400/70 mt-1.5 flex items-center gap-1">
                              <span>Ã¢Å¡Â </span> Must start with http:// or https://
                            </p>
                          )}
                        </div>
                          <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4 space-y-5">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-sm font-bold text-white flex items-center gap-1.5"><Medal className="w-4 h-4 text-yellow-500" /> Task Reward Table</p>
                                <p className="text-xs text-gray-500 mt-0.5">Edit the sats reward for each tier on this task.</p>
                              </div>
                            </div>

                            <div className="space-y-5">

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  <div className="space-y-3">
                                    <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Free Tiers</div>
                                    <div className="grid grid-cols-1 gap-3">
                                      {FREE_TIERS.map((tier) => (
                                        <div key={tier} className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-2.5 flex items-center justify-between">
                                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate mr-2">{tier}</label>
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={mergeTaskTierMatrix(editingTaskForm.tierRewardMatrixOverride)[tier] || ''}
                                            onChange={(e) => setEditingTaskForm((prev) => ({ ...prev, tierRewardMatrixOverride: { ...mergeTaskTierMatrix(prev.tierRewardMatrixOverride), [tier]: parseWholeNumber(e.target.value) } }))}
                                            placeholder="0"
                                            className="w-16 bg-[#111] border border-[#2a2a2a] rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500"
                                          />
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
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={mergeTaskTierMatrix(editingTaskForm.tierRewardMatrixOverride)[tier] || ''}
                                            onChange={(e) => setEditingTaskForm((prev) => ({ ...prev, tierRewardMatrixOverride: { ...mergeTaskTierMatrix(prev.tierRewardMatrixOverride), [tier]: parseWholeNumber(e.target.value) } }))}
                                            placeholder="0"
                                            className="w-16 bg-[#111] border border-yellow-500/20 rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                          <div className="flex gap-3 justify-end pt-2">
                            <button type="button" onClick={() => setEditingTaskId(null)} className="px-4 py-2 text-gray-400 hover:text-white font-bold text-sm">Cancel</button>
                            <button type="submit" disabled={isUpdatingTask} className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black rounded-lg font-bold text-sm flex items-center disabled:opacity-50">
                              {isUpdatingTask ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Standard Task Display
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-6 h-6 rounded-full bg-[#111] text-gray-400 text-xs font-bold flex items-center justify-center border border-[#2a2a2a]">{index + 1}</span>
                              <h3 className="text-white font-bold">{task.title}</h3>
                              <span className="px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black text-yellow-400 uppercase tracking-widest">
                                Reward Table
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed ml-9">{task.description}</p>
                            
                            <div className="flex items-center gap-3 mt-4 ml-9 flex-wrap">
                              <span className="px-2.5 py-1 bg-[#111] border border-[#2a2a2a] rounded-md text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                                {task.requiredPlatform || 'WEBSITE'}
                              </span>
                              <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                {task.proofType ? task.proofType.replace('_', ' ') : 'NO PROOF TYPE'}
                              </span>
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                                Reward: {(
                                  hasTaskMatrixOverrides(task.tierRewardMatrixOverride)
                                    ? [...FREE_TIERS, ...PREMIUM_TIERS].reduce(
                                        (max, tier) => Math.max(max, Number(task.tierRewardMatrixOverride?.[tier] || 0)),
                                        0
                                      )
                                    : 0
                                ).toLocaleString()} sats
                              </span>
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                XP: {task.xpRewardOverride||0} 
                              </span>
                            </div>
                          </div>
                          
                          {/* Edit / Delete Buttons */}
                          <div className="flex sm:flex-col gap-2 justify-end shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingTaskId(task.id);
                                setEditingTaskForm({
                                  ...task,
                                  xpRewardOverride: task.xpRewardOverride || 0,
                                  tierRewardMatrixOverride: mergeTaskTierMatrix(task.tierRewardMatrixOverride),
                                });
                              }}
                              className="p-2 bg-[#111] border border-[#2a2a2a] hover:text-white text-gray-400 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              disabled={isDeletingTask === task.id}
                              className="p-2 bg-[#111] border border-[#2a2a2a] hover:bg-red-500/10 hover:text-red-400 text-gray-400 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isDeletingTask === task.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                !isAddingTask && (
                  <div className="flex flex-col items-center justify-center py-10 text-center bg-[#0a0a0a] rounded-2xl border border-dashed border-[#2a2a2a]">
                    <Target className="w-10 h-10 text-gray-600 mb-3" />
                    <p className="text-white font-bold mb-1">No Tasks Created Yet</p>
                    <p className="text-xs text-gray-500">Users cannot complete this campaign until you add at least one task.</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ RIGHT COLUMN: Real-Time Analytics Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
          {analytics && (
            <CampaignAnalyticsPanel
              analytics={analytics}
              totalSpent={totalSpent}
              averageReward={averageReward}
              totalRewardedUsers={totalRewardedUsers}
              campaignTaskCount={campaignTaskCount}
            />
          )}

        </div>
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Micro-Components Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
