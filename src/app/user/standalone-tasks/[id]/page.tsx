'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { AlertTriangle, ArrowLeft, Crown, Flame, Globe2, MapPinned, Shield, Target, Zap } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type StandaloneTaskDetails = Task & {
  category?: string;
  coverImageUrl?: string | null;
  targetCountries?: string[];
  isPremiumOnly?: boolean;
  requiredFreeTier?: string;
  doubleRewardsStartAt?: string | null;
  doubleRewardsEndAt?: string | null;
  doubleRewardsActive?: boolean;
  isCompleted?: boolean;
  hasStarted?: boolean;
  userSubmission?: { status: string } | null;
  submissions?: Array<{ status: string; submittedAt?: string }>;
};

export default function StandaloneTaskDetailsPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<StandaloneTaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [taskId: string]: File | null }>({});
  const [textInputs, setTextInputs] = useState<{ [taskId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [taskId: string]: boolean }>({});
  const [submissionResults, setSubmissionResults] = useState<{ [taskId: string]: TaskResult | null }>({});
  const [taskStatuses, setTaskStatuses] = useState<{ [taskId: string]: TaskStatus }>({});

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
        const data = await obfuscatedJsonRequest<StandaloneTaskDetails>(`${API_URL}/users/standalone-tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setTask(data);
        setTaskStatuses({
          [data.id]: mapSubmissionStatusToTaskStatus(data.userSubmission?.status || data.submissions?.[0]?.status),
        });
      } catch (error: unknown) {
        setPageError(error instanceof Error ? error.message : 'Failed to load standalone task.');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleTextChange = (id: string, value: string) => {
    setTextInputs((prev) => ({ ...prev, [id]: value }));
  };

  const refreshTaskStatus = async (id: string) => {
    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const response = await obfuscatedFetch(`${API_URL}/users/standalone-tasks/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseObfuscatedJson<{ status?: string }>(response);
      if (response.ok) {
        setTaskStatuses((prev) => ({ ...prev, [id]: mapSubmissionStatusToTaskStatus(data?.status) }));
      }
    } catch {
    }
  };

  const handleSubmitProof = async (id: string, proofType: string) => {
    const selectedFile = selectedFiles[id];
    const textInput = (textInputs[id] || '').trim();

    if (proofType === 'SCREENSHOT' && !selectedFile) {
      setSubmissionResults((prev) => ({ ...prev, [id]: { success: false, message: 'Please upload a screenshot first.' } }));
      return;
    }

    if ((proofType === 'URL' || proofType === 'TEXT_RESPONSE') && !textInput) {
      setSubmissionResults((prev) => ({ ...prev, [id]: { success: false, message: 'Please enter proof before submitting.' } }));
      return;
    }

    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    setSubmissionResults((prev) => ({ ...prev, [id]: null }));

    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const formData = new FormData();

      if (selectedFile) {
        formData.append('proofImage', selectedFile);
      }

      if (proofType === 'URL' || proofType === 'TEXT_RESPONSE') {
        formData.append('proofText', textInput);
      }

      if (proofType === 'API_VERIFIED') {
        formData.append('triggerVerification', 'true');
      }

      const response = await obfuscatedFetch(`${API_URL}/users/standalone-tasks/${id}/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await parseObfuscatedJson<{ message?: string; error?: string; submission?: { status?: string } }>(response);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to submit proof.');
      }

      const mappedStatus = mapSubmissionStatusToTaskStatus(data?.submission?.status || 'MANUAL_REVIEW');
      setTaskStatuses((prev) => ({ ...prev, [id]: mappedStatus }));
      setSubmissionResults((prev) => ({
        ...prev,
        [id]: { success: true, message: data?.message || 'Proof submitted successfully.' },
      }));

      setTask((prev) => prev ? {
        ...prev,
        hasStarted: true,
        isCompleted: mappedStatus === 'completed' ? true : prev.isCompleted,
        userSubmission: { status: data?.submission?.status || 'MANUAL_REVIEW' },
        submissions: [{ status: data?.submission?.status || 'MANUAL_REVIEW' }],
      } : prev);

      setSelectedFiles((prev) => ({ ...prev, [id]: null }));
      setTextInputs((prev) => ({ ...prev, [id]: '' }));
      dispatch(fetchUserDashboard());
      void refreshTaskStatus(id);
    } catch (error: unknown) {
      setSubmissionResults((prev) => ({
        ...prev,
        [id]: { success: false, message: error instanceof Error ? error.message : 'Failed to submit proof.' },
      }));
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const progressPct = useMemo(() => {
    const currentStatus = task ? taskStatuses[task.id] ?? mapSubmissionStatusToTaskStatus(task.userSubmission?.status || task.submissions?.[0]?.status) : 'idle';
    return currentStatus === 'completed' ? 100 : currentStatus === 'pending_review' ? 70 : currentStatus === 'rejected' ? 35 : 10;
  }, [task, taskStatuses]);

  if (isLoading) return <PageSkeleton />;

  if (pageError || !task) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/8 border border-red-500/15 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Standalone Task Unavailable</h2>
        <p className="text-sm text-white/35 mb-8 leading-relaxed">{pageError || "We couldn't load this standalone task."}</p>
        <button onClick={() => router.push('/user/standalone-tasks')} className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Standalone Tasks
        </button>
      </div>
    );
  }

  const currentStatus = taskStatuses[task.id] ?? mapSubmissionStatusToTaskStatus(task.userSubmission?.status || task.submissions?.[0]?.status);
  const proofMeta = PROOF_META[task.proofType];

  return (
    <div className="min-h-screen bg-[#020202]">
      <div className="fixed top-0 right-1/4 w-[400px] h-[400px] bg-sats-orange-500/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-sats-orange-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-6 md:py-10 pb-24">
        <button
          onClick={() => router.push('/user/standalone-tasks')}
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white mb-7 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Standalone Tasks
        </button>

        <div className="relative bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 mb-5 overflow-hidden">
          {task.coverImageUrl ? (
            <div className="absolute inset-0 opacity-20">
              <img src={task.coverImageUrl} alt={task.title} className="h-full w-full object-cover" />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#080808]" />
          <div className="absolute -right-6 -top-6 text-white/[0.02]">
            <Zap className="w-48 h-48" strokeWidth={1} />
          </div>
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sats-orange-500/8 border border-sats-orange-500/20 mb-5">
              <Zap className="w-3.5 h-3.5 text-sats-orange-500" />
              <span className="text-sm font-black text-sats-orange-500">{Number(task.taskRewardSats || 0)} Sats</span>
              <span className="text-xs text-sats-orange-500/50 font-medium">task reward</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug mb-3">{task.title}</h1>
            <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-3xl mb-4">{task.description}</p>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-semibold text-gray-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#050505] px-3 py-1.5">{proofMeta.label}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#050505] px-3 py-1.5"><Target className="h-3.5 w-3.5" /> {task.requiredPlatform || 'NONE'}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#050505] px-3 py-1.5"><Shield className="h-3.5 w-3.5" /> {task.requiredFreeTier || 'BASIC'}+</span>
              {task.isPremiumOnly ? <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1.5 text-fuchsia-300"><Crown className="h-3.5 w-3.5" /> Premium Only</span> : null}
              {task.doubleRewardsActive ? <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-yellow-300"><Flame className="h-4 w-4" /> 2x Live</span> : null}
              {task.category ? <span className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#050505] px-3 py-1.5"><Globe2 className="h-3.5 w-3.5" /> {task.category}</span> : null}
              {task.targetCountries && task.targetCountries.length > 0 ? <span className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#050505] px-3 py-1.5"><MapPinned className="h-3.5 w-3.5" /> {task.targetCountries.join(', ')}</span> : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">XP Reward</p>
                <p className="mt-2 text-lg font-black text-white">{Number(task.xpReward || 0)} XP</p>
              </div>
              <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Target Link</p>
                <p className="mt-2 truncate text-sm font-bold text-white">{task.targetUrl || 'Not required'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/35">
                <span>Task progress</span>
                <span>{currentStatus === 'completed' ? 'Completed' : currentStatus === 'pending_review' ? 'In Review' : currentStatus === 'rejected' ? 'Retry Needed' : 'Ready to Start'}</span>
              </div>
              <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${currentStatus === 'completed' ? 'bg-green-500' : 'bg-gradient-to-r from-sats-orange-500 to-yellow-500'}`} style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Complete this task</h2>
            <span className="text-[10px] text-white/20 font-medium">1 task</span>
          </div>

          <TaskCard
            key={task.id}
            task={task}
            index={0}
            taskStatus={currentStatus}
            result={submissionResults[task.id] ?? null}
            isSubmitting={!!isSubmitting[task.id]}
            selectedFile={selectedFiles[task.id] ?? null}
            textInput={textInputs[task.id] ?? ''}
            onFileChange={handleFileChange}
            onTextChange={handleTextChange}
            onSubmit={handleSubmitProof}
          />
        </div>
      </div>
    </div>
  );
}
