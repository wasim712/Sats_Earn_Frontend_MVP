export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImageUrl?: string | null;
  targetUrl: string | null;
  socialHandleTarget: string | null;
  targetCountries: string[];
  requiredPlatform?: 'NONE' | 'DESKTOP' | 'ANDROID' | 'IOS';
  isPremiumOnly: boolean;
  requiredFreeTier: string;
  baseRewardSats: number;
  xpReward?: number;
  doubleRewardsStartAt?: string | null;
  doubleRewardsEndAt?: string | null;
  doubleRewardsActive?: boolean;
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
  xpRewardOverride?: number | null;
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

export interface AdminUserTransaction {
  id: string;
  amountSats: number;
  type: string;
  description: string | null;
  referenceId: string | null;
  createdAt: string;
  source: {
    kind: 'submission' | 'withdrawal';
    submissionId?: string;
    withdrawalId?: string;
    status?: string;
    taskId?: string;
    taskTitle?: string | null;
    campaignId?: string;
    campaignTitle?: string | null;
    amountSats?: number;
  } | null;
}

export interface AdminUserDetail extends AdminUser {
  phone?: string | null;
  username?: string | null;
  country?: string | null;
  dateOfBirth?: string | null;
  authProvider?: string;
  isVerified?: boolean;
  currentStreak?: number;
  registrationIp?: string | null;
  lastIpAddress?: string | null;
  twitterHandle?: string | null;
  instagramHandle?: string | null;
  telegramHandle?: string | null;
  discordHandle?: string | null;
  submissions: Array<{
    id: string;
    status: string;
    submittedAt: string;
    confidenceScore?: number | null;
    rejectionReason?: string | null;
    taskId: string;
    task?: {
      id: string;
      title?: string | null;
      campaign?: {
        id: string;
        title: string;
        baseRewardSats: number;
      };
    };
  }>;
  withdrawals: Array<{
    id: string;
    amountSats: number;
    status: string;
    createdAt: string;
    paymentProof?: string | null;
  }>;
  transactions: AdminUserTransaction[];
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
    isRead: boolean;
  }>;
  quizAttempts: Array<{
    id: string;
    score: number;
    passed: boolean;
    createdAt: string;
    dailyQuiz?: {
      id: string;
      title: string;
      rewardSats: number;
      date: string;
    };
  }>;
  _count?: {
    referrals: number;
    submissions: number;
    withdrawals: number;
    transactions: number;
    quizAttempts: number;
    notifications: number;
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
  xpReward?: number;
  date: string;
  isActive: boolean;
  questions?: AdminQuizQuestion[];
  _count?: {
    questions: number;
    attempts: number;
  };
}
