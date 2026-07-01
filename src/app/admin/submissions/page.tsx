'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearSubmissionsState,
  fetchPendingSubmissions,
  reviewSubmission,
  type AdminSubmission,
} from '@/features/admin/adminSubmissionsSlice';
import {
  AlertTriangle,
  BadgeCheck,
  Clock3,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  XCircle,
  ExternalLink,
  FileText
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const dispatch = useAppDispatch();
  // Ensure your Redux slice type `AdminSubmission` is updated to include `proofText?: string`
  const { submissions, isLoading, isReviewing, error } = useAppSelector((state) => state.adminSubmissions);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingSubmissions());

    return () => {
      dispatch(clearSubmissionsState());
    };
  }, [dispatch]);

  const filteredSubmissions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return submissions;
    }

    return submissions.filter((submission) => {
      const values = [
        submission.id,
        submission.user.email,
        submission.user.fullName || '',
        submission.user.activeTier || '',
        submission.task.title,
        submission.task.campaign.title,
        submission.status,
      ];

      return values.some((value) => value.toLowerCase().includes(term));
    });
  }, [searchTerm, submissions]);

  const handleApprove = async (submissionId: string) => {
    await dispatch(reviewSubmission({ id: submissionId, status: 'LOCKED_15D' }));
    if (selectedSubmission?.id === submissionId) {
      setSelectedSubmission(null);
      setRejectionReason('');
    }
  };

  const handleReject = async (submissionId: string) => {
    await dispatch(
      reviewSubmission({
        id: submissionId,
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim() || undefined,
      })
    );

    if (selectedSubmission?.id === submissionId) {
      setSelectedSubmission(null);
      setRejectionReason('');
    }
  };

  if (isLoading && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 animate-pulse">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="h-12 w-72 rounded-2xl bg-[#111]" />
          <div className="h-28 rounded-3xl bg-[#080808] border border-[#1a1a1a]" />
          <div className="space-y-4">
            {[1, 2, 3].map((row) => (
              <div key={row} className="h-40 rounded-3xl bg-[#080808] border border-[#1a1a1a]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4">
        <div className="bg-[#050505] border border-red-500/20 text-red-400 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-md text-center shadow-2xl shadow-red-500/5">
          <ShieldAlert className="w-12 h-12 text-red-500/80" />
          <p className="font-semibold text-lg">{error}</p>
          <button
            onClick={() => dispatch(fetchPendingSubmissions())}
            className="px-6 py-3 bg-[#111] border border-[#2a2a2a] rounded-xl text-sm text-white hover:bg-white/5 transition-all"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mt-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-sats-orange-500 tracking-tight">Manual Submissions Review</h1>
            <p className="text-gray-400 text-sm mt-1">Review backend payload from admin pending submissions and approve or reject each proof.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-96 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search user, campaign, task, tier..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all shadow-inner"
              />
            </div>

            <button
              onClick={() => dispatch(fetchPendingSubmissions())}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-white font-bold hover:bg-[#111] hover:border-[#333] transition-all shrink-0 w-full sm:w-auto shadow-sm active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-sats-orange-500" />
              Refresh Queue
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            icon={<Clock3 className="w-5 h-5 text-sats-orange-400" />}
            label="Pending Reviews"
            value={submissions.length}
            glow="bg-sats-orange-500/10"
          />
          <SummaryCard
            icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
            label="Filtered Results"
            value={filteredSubmissions.length}
            glow="bg-yellow-500/10"
          />
          <SummaryCard
            icon={<Eye className="w-5 h-5 text-blue-400" />}
            label="Selected Proof"
            value={selectedSubmission ? 1 : 0}
            glow="bg-blue-500/10"
          />
        </div>

        {error && submissions.length > 0 ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.5fr)_420px] gap-6 items-start">
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
            {filteredSubmissions.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <p className="text-lg font-semibold text-white">No manual review submissions found.</p>
                <p className="text-sm mt-2">The backend queue is empty or nothing matches your search.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#141414]">
                {filteredSubmissions.map((submission) => {
                  const reward = Number(submission.displayRewardSats ?? 0);
                  const isSelected = selectedSubmission?.id === submission.id;

                  return (
                    // FIXED: Changed from <button> to <div> to prevent nested button errors
                    <div
                      key={submission.id}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setRejectionReason(submission.rejectionReason || '');
                      }}
                      className={`cursor-pointer w-full text-left p-5 transition-all ${isSelected ? 'bg-sats-orange-500/8' : 'hover:bg-[#0b0b0b]'}`}
                    >
                      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                        <div className="space-y-3 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-sats-orange-300">
                              {submission.status.replaceAll('_', ' ')}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[#232323] px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-gray-300">
                              {submission.user.activeTier || 'Unknown Tier'}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[#232323] px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-gray-300">
                              {submission.user.isPremium ? 'Premium' : 'Free'}
                            </span>
                          </div>

                          <div>
                            <h2 className="text-lg font-bold text-white break-words">{submission.task.title}</h2>
                            <p className="text-sm text-gray-400 mt-1 break-words">{submission.task.campaign?.title}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                            <InfoPill label="User" value={submission.user.fullName || submission.user.email} />
                            <InfoPill label="Email" value={submission.user.email} />
                            <InfoPill label="Reward" value={`${reward} sats`} />
                            <InfoPill label="Confidence" value={submission.confidenceScore != null ? `${submission.confidenceScore}%` : 'N/A'} />
                          </div>
                        </div>

                        <div className="flex flex-col items-start xl:items-end gap-3 shrink-0">
                          <p className="text-xs text-gray-400">Submitted {formatDateTime(submission.submittedAt)}</p>
                          <div className="flex flex-wrap gap-2">
                            <ActionButton
                              onClick={(event) => {
                                event.stopPropagation(); // Prevents the card from catching the click
                                void handleApprove(submission.id);
                              }}
                              disabled={isReviewing}
                              tone="approve"
                              icon={<BadgeCheck className="w-4 h-4" />}
                              label="Approve"
                            />
                            <ActionButton
                              onClick={(event) => {
                                event.stopPropagation(); // Prevents the card from catching the click
                                setSelectedSubmission(submission);
                                setRejectionReason(submission.rejectionReason || '');
                              }}
                              disabled={false}
                              tone="neutral"
                              icon={<Eye className="w-4 h-4" />}
                              label="Inspect"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-5 shadow-2xl sticky top-24">
            {selectedSubmission ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-sats-orange-500/80">Selected Submission</p>
                  <h2 className="text-xl font-black text-white mt-2 break-words">{selectedSubmission.task.title}</h2>
                  <p className="text-sm text-gray-400 mt-1 break-words">{selectedSubmission.task.campaign?.title}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <DetailRow label="Submission ID" value={selectedSubmission.id} mono />
                  <DetailRow label="User" value={selectedSubmission.user.fullName || 'Unnamed user'} />
                  <DetailRow label="Email" value={selectedSubmission.user.email} />
                  <DetailRow label="Tier" value={selectedSubmission.user.activeTier || 'Unknown'} />
                  <DetailRow label="XP" value={String(selectedSubmission.user.totalXp)} />
                  <DetailRow label="Confidence" value={selectedSubmission.confidenceScore != null ? `${selectedSubmission.confidenceScore}%` : 'N/A'} />
                  <DetailRow label="Submitted" value={formatDateTime(selectedSubmission.submittedAt)} />
                </div>

                {/* ─── DYNAMIC PROOF RENDERER ─── */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-white">Provided Proof</p>
                  
                  {/* If it&apos;s an Image */}
                  {selectedSubmission.screenshotUrl && (
                    <>
                      <a
                        href={selectedSubmission.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]"
                      >
                        <img
                          src={selectedSubmission.screenshotUrl}
                          alt="Submission proof"
                          className="h-64 w-full object-cover"
                        />
                      </a>
                      <a
                        href={selectedSubmission.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sats-orange-400 hover:text-sats-orange-300"
                      >
                        <Eye className="w-4 h-4" />
                        Open full proof in new tab
                      </a>
                    </>
                  )}

                  {/* If it&apos;s a URL or Text */}
                  {(selectedSubmission as any).proofText && (
                    <div className="flex flex-col gap-2">
                      <div className="w-full rounded-2xl border border-[#1a1a1a] bg-[#111] px-4 py-4 text-sm text-gray-300 break-all whitespace-pre-wrap">
                        {(selectedSubmission as any).proofText}
                      </div>
                      
                      {/* Detect if the text is a URL and make it clickable */}
                      {String((selectedSubmission as any).proofText).startsWith('http') && (
                        <a
                          href={(selectedSubmission as any).proofText}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 mt-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit provided link
                        </a>
                      )}
                    </div>
                  )}

                  {/* Fallback for missing proof entirely */}
                  {!selectedSubmission.screenshotUrl && !(selectedSubmission as any).proofText && (
                     <div className="w-full rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4 text-sm text-gray-400 text-center italic">
                       No proof attached (Possible API Verification)
                     </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label htmlFor="rejection-reason" className="text-sm font-bold text-white">
                    Rejection reason
                  </label>
                  <textarea
                    id="rejection-reason"
                    rows={4}
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    placeholder="Optional context for rejection..."
                    className="w-full rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-all focus:border-red-500/40"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => void handleApprove(selectedSubmission.id)}
                    disabled={isReviewing}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500/15 border border-green-500/20 px-5 py-3 font-bold text-green-300 transition-all hover:bg-green-500/20 disabled:opacity-60"
                  >
                    {isReviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => void handleReject(selectedSubmission.id)}
                    disabled={isReviewing}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500/15 border border-red-500/20 px-5 py-3 font-bold text-red-300 transition-all hover:bg-red-500/20 disabled:opacity-60"
                  >
                    {isReviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Eye className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-white">Select a submission</p>
                <p className="text-sm text-gray-400 mt-2">Pick an item from the queue to inspect proof and complete a review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, glow }: { icon: React.ReactNode; label: string; value: number; glow: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1a1a1a] bg-[#050505] p-5 shadow-xl">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl ${glow}`} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">{label}</p>
          <h3 className="mt-3 text-3xl font-black text-white">{value}</h3>
        </div>
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">{icon}</div>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className={`mt-1 text-sm text-white break-all ${mono ? 'font-mono' : 'font-semibold'}`}>{value}</p>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  tone,
  icon,
  label,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  tone: 'approve' | 'neutral';
  icon: React.ReactNode;
  label: string;
}) {
  const toneClassName =
    tone === 'approve'
      ? 'bg-green-500/15 border-green-500/20 text-green-300 hover:bg-green-500/20'
      : 'bg-[#101010] border-[#232323] text-white hover:bg-[#161616]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-60 ${toneClassName}`}
    >
      {icon}
      {label}
    </button>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
