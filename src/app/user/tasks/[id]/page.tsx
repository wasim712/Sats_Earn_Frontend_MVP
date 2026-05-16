
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserDashboard } from '@/features/user/userDashboardSlice';
import { obfuscatedFetch, obfuscatedJsonRequest, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import {
  mapSubmissionStatusToTaskStatus,
  PageSkeleton,
  PROOF_META,
  TaskCard,
  type UserTaskPageTask as Task,
  type UserTaskResult as TaskResult,
  type UserTaskStatus as TaskStatus,
} from '@/components/user/tasks/CampaignTaskPageComponents';
import { ArrowLeft, AlertTriangle, CheckCircle2, ExternalLink, Zap } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  baseRewardSats: number;
  displayRewardSats?: number;
  xpReward?: number;
  doubleRewardsActive?: boolean;
  doubleRewardsStartAt?: string | null;
  doubleRewardsEndAt?: string | null;
  coverImageUrl?: string | null;
  tierRewardMatrix?: Record<string, number>;
  targetUrl: string | null;
  tasks: Task[];
}

export default function CampaignDetailsPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Submission state (unchanged logic) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const [selectedFiles, setSelectedFiles] = useState<{ [taskId: string]: File | null }>({});
  const [textInputs, setTextInputs] = useState<{ [taskId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [taskId: string]: boolean }>({});
  const [submissionResults, setSubmissionResults] = useState<{ [taskId: string]: TaskResult | null }>({});

  // Ã¢â€â‚¬Ã¢â€â‚¬ Pre-loaded task statuses (fetched on mount) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const [taskStatuses, setTaskStatuses] = useState<{ [taskId: string]: TaskStatus }>({});

  // Ã¢â€â‚¬Ã¢â€â‚¬ 1. FETCH CAMPAIGN + PRE-CHECK SUBMISSION STATUS Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token =
          sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

        const response = await obfuscatedFetch(`${API_URL}/users/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch campaign details.');

        const data: Campaign = await parseObfuscatedJson<Campaign>(response);
        setCampaign(data);

        // Pre-populate task statuses from campaign response
        const initialStatuses: { [id: string]: TaskStatus } = {};
        data.tasks?.forEach((task) => {
          const latestStatus = task.userSubmission?.status || task.submissions?.[0]?.status;
          initialStatuses[task.id] = mapSubmissionStatusToTaskStatus(latestStatus);
        });
        setTaskStatuses(initialStatuses);

        const hasAnyEmbedded = data.tasks?.some(
          (t) => t.userSubmission !== undefined || (t.submissions && t.submissions.length > 0)
        );

        if (!hasAnyEmbedded && data.tasks?.length) {
          const statusFetches = data.tasks.map(async (task) => {
            try {
              const r = await obfuscatedFetch(`${API_URL}/users/tasks/${task.id}/status`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!r.ok) return;
              const s = await parseObfuscatedJson<{ status?: string }>(r);
              const mapped = mapSubmissionStatusToTaskStatus(s?.status);
              setTaskStatuses((prev) => ({ ...prev, [task.id]: mapped }));
            } catch {
              // Silently fail Ã¢â‚¬â€ status check is best-effort
            }
          });
          await Promise.allSettled(statusFetches);
        }
      } catch (err: unknown) {
        setPageError(err instanceof Error ? err.message : 'Failed to fetch campaign details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  // Ã¢â€â‚¬Ã¢â€â‚¬ 2. INPUT HANDLERS (unchanged) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  const handleFileChange = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionResults((prev) => ({ ...prev, [taskId]: null }));
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return alert('Please upload a valid image file (JPG, PNG).');
      if (file.size > 5 * 1024 * 1024) return alert('Image must be smaller than 5MB.');
      setSelectedFiles((prev) => ({ ...prev, [taskId]: file }));
    }
  };

  const handleTextChange = (taskId: string, value: string) => {
    setSubmissionResults((prev) => ({ ...prev, [taskId]: null }));
    setTextInputs((prev) => ({ ...prev, [taskId]: value }));
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬ 3. SUBMIT (unchanged logic, adds status update on success) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  const handleSubmitProof = async (taskId: string, proofType: string) => {
    setIsSubmitting((prev) => ({ ...prev, [taskId]: true }));

    try {
      const token =
        sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      };

      if (proofType === 'SCREENSHOT') {
        const file = selectedFiles[taskId];
        if (!file) throw new Error('Please upload a screenshot.');
        const formData = new FormData();
        formData.append('proofImage', file);
        fetchOptions.body = formData;
      } else if (proofType === 'URL' || proofType === 'TEXT_RESPONSE') {
        const text = textInputs[taskId];
        if (!text || text.trim() === '') throw new Error('Response cannot be empty.');
        fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify({ proofText: text.trim() });
      } else if (proofType === 'API_VERIFIED') {
        fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify({ triggerVerification: true });
      }

      const response = await obfuscatedFetch(`${API_URL}/users/tasks/${taskId}/submit`, fetchOptions);
      const data = await parseObfuscatedJson<{ error?: string; status?: string; submissionId?: string; message?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Submission failed.');

      setSubmissionResults((prev) => ({
        ...prev,
        [taskId]: { success: true, message: data.message || 'Submitted successfully!' },
      }));
      // Mark task as pending review immediately after successful submit
      setTaskStatuses((prev) => ({ ...prev, [taskId]: 'pending_review' }));
      dispatch(fetchUserDashboard());

    } catch (err: unknown) {
      setSubmissionResults((prev) => ({
        ...prev,
        [taskId]: { success: false, message: err instanceof Error ? err.message : 'Submission failed.' },
      }));
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬ Derived Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  const completedCount = campaign
    ? Object.values(taskStatuses).filter(
        (s) => s === 'completed' || s === 'pending_review'
      ).length
    : 0;
  const totalTasks = campaign?.tasks?.length ?? 0;
  const progressPct = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const allDone = completedCount === totalTasks && totalTasks > 0;

  // Ã¢â€â‚¬Ã¢â€â‚¬ Render Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  if (isLoading) return <PageSkeleton />;

  if (pageError || !campaign) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/8 border border-red-500/15 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Campaign Unavailable</h2>
        <p className="text-sm text-white/35 mb-8 leading-relaxed">
          {pageError || "We couldn't load this campaign. It may have ended or been removed."}
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202]">
      {/* Ambient glows */}
      <div className="fixed top-0 right-1/4 w-[400px] h-[400px] bg-sats-orange-500/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-sats-orange-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-6 md:py-10 pb-24">

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Back button Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white mb-7 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Campaign Hero Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div className="relative bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 mb-5 overflow-hidden">
          {/* Decorative bg zap */}
          <div className="absolute -right-6 -top-6 text-white/[0.02]">
            <Zap className="w-48 h-48" strokeWidth={1} />
          </div>
          {/* Top highlight */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          <div className="relative">
            {/* Reward pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sats-orange-500/8 border border-sats-orange-500/20 mb-5">
              <Zap className="w-3.5 h-3.5 text-sats-orange-500" />
              <span className="text-sm font-black text-sats-orange-500">
                {campaign.displayRewardSats ?? Math.max(...Object.values(campaign.tierRewardMatrix || {}).map((value) => Number(value || 0)), 0)} Sats
              </span>
              <span className="text-xs text-sats-orange-500/50 font-medium">total reward</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug mb-3">
              {campaign.title}
            </h1>
            <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-xl mb-6">
              {campaign.description}
            </p>

            {/* Target URL */}
            {campaign.targetUrl && (
              <a
                href={campaign.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f0f0f] border border-[#1e1e1e] text-sm font-semibold text-white/60 hover:text-white hover:border-white/15 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open Campaign Link
              </a>
            )}
            {campaign.doubleRewardsStartAt && campaign.doubleRewardsEndAt && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm font-bold text-yellow-300">
                <Zap className="w-4 h-4" />
                You will get 2x reward from {new Date(campaign.doubleRewardsStartAt).toLocaleDateString()} to {new Date(campaign.doubleRewardsEndAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Progress tracker Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-xl px-5 py-4 mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white/40">Your Progress</span>
              {allDone && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400">
                  <CheckCircle2 className="w-2.5 h-2.5" /> All done
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-white/40">
              <span className={completedCount > 0 ? 'text-white' : ''}>{completedCount}</span>
              /{totalTasks} tasks
            </span>
          </div>
          <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                allDone
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-sats-orange-500 to-yellow-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Tasks Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
              Tasks to Complete
            </h2>
            <span className="text-[10px] text-white/20 font-medium">
              {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </span>
          </div>

          {campaign.tasks?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[#080808] border border-[#1a1a1a] border-dashed rounded-2xl">
              <p className="text-sm text-white/25">No tasks found for this campaign.</p>
            </div>
          ) : (
            campaign.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                taskStatus={taskStatuses[task.id] ?? 'idle'}
                result={submissionResults[task.id] ?? null}
                isSubmitting={!!isSubmitting[task.id]}
                selectedFile={selectedFiles[task.id] ?? null}
                textInput={textInputs[task.id] ?? ''}
                onFileChange={handleFileChange}
                onTextChange={handleTextChange}
                onSubmit={handleSubmitProof}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
