import React from 'react';

export interface UserTaskPageTask {
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

export type UserTaskResult = { success: boolean; message: string };
export type UserTaskStatus = 'idle' | 'completed' | 'pending_review' | 'rejected';

export type ProofMeta = {
  icon: React.ReactNode;
  label: string;
  hint: string;
};
