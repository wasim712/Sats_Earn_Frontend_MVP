export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  targetUrl: string | null;
  socialHandleTarget: string | null;
  targetCountries: string[];
  requiredPlatform?: 'NONE' | 'DESKTOP' | 'ANDROID' | 'IOS';
  isPremiumOnly: boolean;
  requiredFreeTier: string;
  baseRewardSats: number;
  tierRewardMatrix: Record<string, number>;
  totalCompletions: number;
  maxCompletions: number;
  isActive: boolean;
  isCompleted?: boolean;
  hasStarted?: boolean;
  completedTasksCount?: number;
  totalTasksCount?: number;
  userCompletionStatus?: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface AdminTask {
  id: string;
  campaignId: string;
  title: string;
  description?: string | null;
  targetUrl?: string | null;
  requirements?: unknown;
  baseRewardSatsOverride?: number | null;
  tierRewardMatrixOverride?: Record<string, number> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  referenceId: string | null;
  createdAt: string;
}

export interface AdminWithdrawal {
  id: string;
  amountSats: number;
  lightningInvoice: string;
  paymentProof: string | null;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  createdAt: string;
  user: {
    id?: string;
    fullName: string | null;
    email: string;
    totalXp: number;
    activeTier?: string | null;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  totalXp: number;
  premiumTier: string | null;
  premiumExpiresAt: string | null;
  isActive: boolean;
  balanceAvailable: number;
  balancePending: number;
  balanceLocked: number;
  referralCode: string;
  createdAt: string;
  updatedAt?: string;
  lastActivityAt: string;
  activeTier: string;
  isPremium: boolean;
  underlyingFreeTier: string;
  _count?: {
    referrals: number;
    submissions: number;
  };
}

export interface AdminQuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  order: number;
}

export interface AdminQuiz {
  id: string;
  title: string;
  rewardSats: number;
  date: string;
  isActive: boolean;
  questions?: AdminQuizQuestion[];
  _count?: {
    questions: number;
    attempts: number;
  };
}
