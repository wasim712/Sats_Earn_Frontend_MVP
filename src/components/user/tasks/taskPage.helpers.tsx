import React from 'react';
import { FileText, Image as ImageIcon, Link as LinkIcon, Shield } from 'lucide-react';
import type { ProofMeta, UserTaskStatus } from './taskPage.types';

export const mapSubmissionStatusToTaskStatus = (status?: string | null): UserTaskStatus => {
  if (!status) return 'idle';
  if (status === 'REJECTED') return 'rejected';
  if (status === 'MANUAL_REVIEW' || status === 'PENDING_24H') return 'pending_review';
  if (status === 'LOCKED_15D' || status === 'WITHDRAWABLE' || status === 'APPROVED') return 'completed';
  return 'idle';
};

export const PROOF_META: Record<'SCREENSHOT' | 'URL' | 'TEXT_RESPONSE' | 'API_VERIFIED', ProofMeta> = {
  SCREENSHOT: { icon: <ImageIcon className="w-3 h-3" />, label: 'Screenshot Proof', hint: 'Upload a clear screenshot showing you completed this step.' },
  URL: { icon: <LinkIcon className="w-3 h-3" />, label: 'Link Proof', hint: 'Paste the public URL that proves your action.' },
  TEXT_RESPONSE: { icon: <FileText className="w-3 h-3" />, label: 'Text Response', hint: 'Write a short response confirming what you completed.' },
  API_VERIFIED: { icon: <Shield className="w-3 h-3" />, label: 'Auto Verification', hint: 'We will verify this step automatically after submission.' },
};
