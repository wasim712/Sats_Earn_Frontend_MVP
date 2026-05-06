
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ExternalLink, Upload, Image as ImageIcon,
  CheckCircle2, AlertTriangle, Zap, Link as LinkIcon,
  FileText, Shield, RotateCcw, ChevronRight, X,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Types Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

interface Task {
  id: string;
  title: string;
  description: string;
  requiredPlatform: string;
  proofType: 'SCREENSHOT' | 'URL' | 'TEXT_RESPONSE' | 'API_VERIFIED';
  targetUrl?: string | null;
  taskRewardSats?: number;
  xpReward?: number;
  userSubmission?: { status: string } | null;
  submissions?: Array<{ status: string; submittedAt?: string }>;
}

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
  targetUrl: string | null;
  tasks: Task[];
}

type TaskResult = { success: boolean; message: string };
type TaskStatus = 'idle' | 'completed' | 'pending_review' | 'rejected';

const mapSubmissionStatusToTaskStatus = (status?: string | null): TaskStatus => {
  if (!status) return 'idle';
  if (status === 'REJECTED') return 'rejected';
  if (status === 'MANUAL_REVIEW' || status === 'PENDING_24H') return 'pending_review';
  if (status === 'LOCKED_15D' || status === 'WITHDRAWABLE' || status === 'APPROVED') return 'completed';
  return 'idle';
};

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Proof Type Meta Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const PROOF_META: Record<string, { icon: React.ReactNode; label: string; hint: string }> = {
  SCREENSHOT: {
    icon: <ImageIcon className="w-3.5 h-3.5" />,
    label: 'Screenshot',
    hint: 'Upload a JPG or PNG image (max 5MB)',
  },
  URL: {
    icon: <LinkIcon className="w-3.5 h-3.5" />,
    label: 'Link Proof',
    hint: 'Paste the URL as proof of completion',
  },
  TEXT_RESPONSE: {
    icon: <FileText className="w-3.5 h-3.5" />,
    label: 'Text Response',
    hint: 'Describe what you did to complete this task',
  },
  API_VERIFIED: {
    icon: <Shield className="w-3.5 h-3.5" />,
    label: 'Auto-Verified',
    hint: 'Completion is verified automatically via secure API',
  },
};

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// SKELETON
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function PageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6 animate-pulse">
      {/* Back */}
      <div className="h-4 w-24 bg-white/5 rounded-lg" />

      {/* Hero card */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8">
        <div className="h-5 w-28 bg-sats-orange-500/10 rounded-full mb-5" />
        <div className="h-8 w-3/4 bg-white/5 rounded-xl mb-3" />
        <div className="h-4 w-full bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-2/3 bg-white/5 rounded-lg mb-6" />
        <div className="h-10 w-40 bg-white/5 rounded-xl" />
      </div>

      {/* Progress bar */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-24 bg-white/5 rounded" />
          <div className="h-3 w-10 bg-white/5 rounded" />
        </div>
        <div className="h-1.5 bg-[#1a1a1a] rounded-full" />
      </div>

      {/* Task cards */}
      {[1, 2].map(i => (
        <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#111] border border-[#1a1a1a] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-white/5 rounded-lg w-2/3" />
              <div className="h-4 bg-white/5 rounded-lg w-full" />
              <div className="h-4 bg-white/5 rounded-lg w-4/5" />
            </div>
          </div>
          <div className="h-28 bg-[#111] border border-[#1a1a1a] rounded-xl" />
          <div className="h-11 bg-white/5 rounded-xl mt-3" />
        </div>
      ))}
    </div>
  );
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// PROOF INPUT COMPONENTS
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function ScreenshotInput({
  taskId,
  file,
  onChange,
}: {
  taskId: string;
  file: File | null;
  onChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="group block cursor-pointer">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed transition-all duration-200 ${
          file
            ? 'border-sats-orange-500/40 bg-sats-orange-500/5'
            : 'border-[#222] hover:border-sats-orange-500/30 hover:bg-white/[0.02]'
        }`}
      >
        {file ? (
          <>
            <div className="w-9 h-9 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center mb-2">
              <ImageIcon className="w-4 h-4 text-sats-orange-500" />
            </div>
            <p className="text-xs font-semibold text-white/70 px-4 truncate max-w-full">
              {file.name}
            </p>
            <p className="text-[10px] text-white/25 mt-1">
              {(file.size / 1024).toFixed(0)} KB Ã‚Â· Click to change
            </p>
          </>
        ) : (
          <>
            <div className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center mb-2 group-hover:border-sats-orange-500/20 transition-colors">
              <Upload className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <p className="text-xs font-medium text-white/30">
              Click to upload screenshot
            </p>
            <p className="text-[10px] text-white/15 mt-0.5">JPG, PNG Ã¢â‚¬â€ max 5MB</p>
          </>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(taskId, e)}
      />
    </label>
  );
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// TASK STATUS BADGE
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function StatusBadge({ status }: { status: TaskStatus }) {
  const config = {
    completed: {
      cls: 'bg-green-500/10 border-green-500/25 text-green-400',
      dot: 'bg-green-400',
      label: 'Completed',
    },
    pending_review: {
      cls: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
      dot: 'bg-amber-400',
      label: 'In Review',
    },
    rejected: {
      cls: 'bg-red-500/10 border-red-500/25 text-red-400',
      dot: 'bg-red-400',
      label: 'Rejected',
    },
    idle: {
      cls: 'bg-white/5 border-white/8 text-white/30',
      dot: 'bg-white/20',
      label: 'Pending',
    },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'pending_review' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// TASK CARD
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function TaskCard({
  task,
  index,
  taskStatus,
  result,
  isSubmitting,
  selectedFile,
  textInput,
  onFileChange,
  onTextChange,
  onSubmit,
}: {
  task: Task;
  index: number;
  taskStatus: TaskStatus;
  result: TaskResult | null;
  isSubmitting: boolean;
  selectedFile: File | null;
  textInput: string;
  onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (id: string, val: string) => void;
  onSubmit: (id: string, proofType: string) => void;
}) {
  const meta = PROOF_META[task.proofType] ?? PROOF_META.TEXT_RESPONSE;
  const isCompleted = taskStatus === 'completed' || taskStatus === 'pending_review';

  const isSubmitDisabled =
    isSubmitting ||
    isCompleted ||
    (task.proofType === 'SCREENSHOT' && !selectedFile) ||
    ((task.proofType === 'URL' || task.proofType === 'TEXT_RESPONSE') && !textInput.trim());

  return (
    <div
      className={`relative bg-[#080808] border rounded-2xl overflow-hidden transition-all duration-300 ${
        isCompleted
          ? 'border-green-500/15'
          : result?.success === false
          ? 'border-red-500/15'
          : 'border-[#1a1a1a]'
      }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${
          isCompleted
            ? 'bg-green-500/50'
            : result?.success === false
            ? 'bg-red-500/50'
            : 'bg-sats-orange-500/20'
        }`}
      />

      <div className="pl-6 pr-5 pt-6 pb-6 md:pl-7">

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Header row Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            {/* Step number / check */}
            <div
              className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border mt-0.5 transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-500/10 border-green-500/25 text-green-400'
                  : 'bg-[#111] border-[#1e1e1e] text-white/20'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
            </div>

            <div>
              <h3 className="text-base font-bold text-white leading-snug mb-1">
                {task.title}
              </h3>
              <p className="text-sm text-white/35 leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>

          {/* Status badge Ã¢â‚¬â€ visible on md+ */}
          <div className="hidden sm:block shrink-0">
            <StatusBadge status={taskStatus} />
          </div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pl-12">
          {/* Platform */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/6 text-[10px] font-bold uppercase tracking-wider text-white/30">
            {task.requiredPlatform}
          </span>
          {/* Proof type */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sats-orange-500/5 border border-sats-orange-500/15 text-[10px] font-bold uppercase tracking-wider text-sats-orange-500/60">
            {meta.icon}
            {meta.label}
          </span>
          {/* Mobile status badge */}
          <span className="sm:hidden">
            <StatusBadge status={taskStatus} />
          </span>
        </div>
        
      {task.targetUrl && (
        <div className="pl-12 mb-5">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] group/link">
            {/* Step indicator */}
            <div className="shrink-0 w-6 h-6 rounded-lg bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center">
              <span className="text-[9px] font-black text-sats-orange-500/70">1</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-0.5">
                Step 1 Ã¢â‚¬â€ Open on {task.requiredPlatform}
              </p>
              <p className="text-xs text-white/40 truncate">{task.targetUrl}</p>
            </div>

            {/* Ã°Å¸Å¡Â¨ FIXED: Attributes moved inside the opening <a ... > tag */}
            <a
              href={task.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sats-orange-500/8 border border-sats-orange-500/20 text-sats-orange-500 text-xs font-bold hover:bg-sats-orange-500/15 hover:border-sats-orange-500/35 transition-all"
            >
              <span> Open </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}


        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Submission zone Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div className="pl-0 sm:pl-12">

          {/* Already completed / in review */}
          {isCompleted ? (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${
              taskStatus === 'completed'
                ? 'bg-green-500/5 border-green-500/15'
                : 'bg-amber-500/5 border-amber-500/15'
            }`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                taskStatus === 'completed' ? 'bg-green-500/10' : 'bg-amber-500/10'
              }`}>
                {taskStatus === 'completed'
                  ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                  : <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                }
              </div>
              <div>
                <p className={`text-sm font-semibold mb-0.5 ${
                  taskStatus === 'completed' ? 'text-green-300' : 'text-amber-300'
                }`}>
                  {taskStatus === 'completed' ? 'Task Completed' : 'Submission Under Review'}
                </p>
                <p className={`text-xs ${
                  taskStatus === 'completed' ? 'text-green-400/50' : 'text-amber-400/50'
                }`}>
                  {taskStatus === 'completed'
                    ? 'Your proof was approved. Sats have been credited.'
                    : 'Our team is reviewing your submission. This usually takes a few hours.'}
                </p>
              </div>
            </div>

          ) : taskStatus === 'rejected' ? (
            // Rejected Ã¢â‚¬â€ allow re-submission
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-300 mb-0.5">Submission Rejected</p>
                  <p className="text-xs text-red-400/50">
                    Your previous submission was rejected. Please re-submit with valid proof.
                  </p>
                </div>
              </div>
              <ProofInputZone
                task={task}
                meta={meta}
                selectedFile={selectedFile}
                textInput={textInput}
                result={result}
                isSubmitting={isSubmitting}
                isSubmitDisabled={isSubmitDisabled}
                onFileChange={onFileChange}
                onTextChange={onTextChange}
                onSubmit={onSubmit}
              />
            </div>

          ) : (
            // Fresh submission
            <ProofInputZone
              task={task}
              meta={meta}
              selectedFile={selectedFile}
              textInput={textInput}
              result={result}
              isSubmitting={isSubmitting}
              isSubmitDisabled={isSubmitDisabled}
              onFileChange={onFileChange}
              onTextChange={onTextChange}
              onSubmit={onSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Proof Input Zone Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function ProofInputZone({
  task, meta, selectedFile, textInput, result,
  isSubmitting, isSubmitDisabled,
  onFileChange, onTextChange, onSubmit,
}: {
  task: Task;
  meta: (typeof PROOF_META)[string];
  selectedFile: File | null;
  textInput: string;
  result: TaskResult | null;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (id: string, val: string) => void;
  onSubmit: (id: string, proofType: string) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Hint */}
      <p className="text-[11px] text-white/20 flex items-center gap-1.5">
        <span className="text-white/15">{meta.icon}</span>
        {meta.hint}
      </p>

      {/* Input area */}
      {task.proofType === 'SCREENSHOT' && (
        <ScreenshotInput
          taskId={task.id}
          file={selectedFile}
          onChange={onFileChange}
        />
      )}

      {task.proofType === 'URL' && (
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            placeholder="https://twitter.com/..."
            value={textInput}
            onChange={(e) => onTextChange(task.id, e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-sats-orange-500/35 hover:border-white/8 transition-colors"
          />
        </div>
      )}

      {task.proofType === 'TEXT_RESPONSE' && (
        <textarea
          placeholder="Describe what you did to complete this task..."
          value={textInput}
          onChange={(e) => onTextChange(task.id, e.target.value)}
          rows={3}
          className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-sats-orange-500/35 hover:border-white/8 transition-colors resize-none"
        />
      )}

      {task.proofType === 'API_VERIFIED' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
          <div className="shrink-0 w-8 h-8 rounded-xl bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center">
            <Shield className="w-4 h-4 text-sats-orange-500/60" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white/50 mb-0.5">Automatic Verification</p>
            <p className="text-xs text-white/25 leading-relaxed">
              Click Submit and our system will verify your completion securely in real time.
            </p>
          </div>
        </div>
      )}

      {/* Inline error */}
      {result?.success === false && (
        <div className="flex items-start gap-2.5 p-3 bg-red-500/6 border border-red-500/15 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-400/80 leading-relaxed">{result.message}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={() => onSubmit(task.id, task.proofType)}
        disabled={isSubmitDisabled}
        className={`
          w-full flex items-center justify-center gap-2 py-3 rounded-xl
          text-sm font-bold transition-all duration-200 active:scale-[0.98]
          ${isSubmitDisabled
            ? 'bg-[#111] text-white/15 border border-[#1a1a1a] cursor-not-allowed'
            : 'bg-sats-orange-500 text-black hover:bg-sats-orange-500/90 shadow-[0_0_24px_rgba(238,139,18,0.2)]'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Submit Proof
            <ChevronRight className="w-4 h-4 opacity-60" />
          </>
        )}
      </button>
    </div>
  );
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// MAIN PAGE
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

export default function CampaignDetailsPage() {
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
  const [submissionResults, setSubmissionResults] = useState<{ [taskId: string]: TaskResult }>({});

  // Ã¢â€â‚¬Ã¢â€â‚¬ Pre-loaded task statuses (fetched on mount) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const [taskStatuses, setTaskStatuses] = useState<{ [taskId: string]: TaskStatus }>({});

  // Ã¢â€â‚¬Ã¢â€â‚¬ 1. FETCH CAMPAIGN + PRE-CHECK SUBMISSION STATUS Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token =
          sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

        const response = await fetch(`${API_URL}/users/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch campaign details.');

        const data: Campaign = await response.json();
        setCampaign(data);

        // Pre-populate task statuses from campaign response
        const initialStatuses: { [id: string]: TaskStatus } = {};
        data.tasks?.forEach((task) => {
          const latestStatus = task.userSubmission?.status || task.submissions?.[0]?.status;
          initialStatuses[task.id] = mapSubmissionStatusToTaskStatus(latestStatus);
        });
        setTaskStatuses(initialStatuses);

        // Parallel: try to fetch individual task statuses as fallback
        // (if the campaign endpoint doesn't embed submission data)
        const hasAnyEmbedded = data.tasks?.some(
          (t) => t.userSubmission !== undefined || (t.submissions && t.submissions.length > 0)
        );
        if (!hasAnyEmbedded && data.tasks?.length) {
          const statusFetches = data.tasks.map(async (task) => {
            try {
              const r = await fetch(`${API_URL}/users/tasks/${task.id}/status`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!r.ok) return;
              const s = await r.json();
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return alert('Please upload a valid image file (JPG, PNG).');
      if (file.size > 5 * 1024 * 1024) return alert('Image must be smaller than 5MB.');
      setSelectedFiles((prev) => ({ ...prev, [taskId]: file }));
    }
  };

  const handleTextChange = (taskId: string, value: string) => {
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

      const response = await fetch(`${API_URL}/users/tasks/${taskId}/submit`, fetchOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Submission failed.');

      setSubmissionResults((prev) => ({
        ...prev,
        [taskId]: { success: true, message: data.message || 'Submitted successfully!' },
      }));
      // Mark task as pending review immediately after successful submit
      setTaskStatuses((prev) => ({ ...prev, [taskId]: 'pending_review' }));

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
