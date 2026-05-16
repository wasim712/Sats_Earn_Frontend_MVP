export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  country?: string | null;
  role: string;
  activeTier: string;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  balanceAvailable: number;
  balancePending: number;
  balanceLocked: number;
  totalXp: number;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    submissions: number;
    referrals: number;
  };
}

export interface SignUpPayload {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  country: string;
  dateOfBirth: string;
  referralCode?: string;
}

export interface UserProfile {
  fullName: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  twitterHandle: string | null;
  instagramHandle: string | null;
  telegramHandle: string | null;
  discordHandle: string | null;
  referralCode: string;
  createdAt: string;
}

export interface UserBalances {
  available: number;
  pending: number;
  locked: number;
  totalLifetime: number;
}

export interface UserDashboard {
  balances: UserBalances;
  gamification: {
    totalXp: number;
    level: number;
    activeTier: string;
    underlyingFreeTier: string;
    isPremium: boolean;
    premiumExpiresAt: string | null;
    currentStreak: number;
    lastClaimedStreakMilestone?: number | null;
    streak?: {
      currentStreak: number;
      lastClaimedMilestone: number;
      nextMilestone: number | null;
      nextRewardSats: number;
      daysRemaining: number;
      progressPercent: number;
      totalMilestones: number;
      claimedMilestonesCount: number;
      milestones: Array<{
        days: number;
        rewardSats: number;
        claimed: boolean;
        reachedInCurrentRun: boolean;
        isNext: boolean;
      }>;
    };
    xpDisplay: string;
    progressPercent: number;
    nextTier?: string | null;
    xpToNextTier?: number;
    tasksCompleted: number;
    activeReferrals: number;
  };
  recentActivity: Array<{
    amountSats: number;
    type: string;
    description: string | null;
    createdAt: string;
  }>;
  recentSubmissions: Array<{
    id: string;
    taskTitle: string;
    campaignTitle: string;
    status: string;
    rejectionReason: string | null;
    submittedAt: string;
    unlockAt: string | null;
    creditedAt: string | null;
    rewardSats: number;
    xpReward?: number;
    remainingMs: number;
  }>;
}

export interface UserReferral {
  id: string;
  fullName: string | null;
  email: string;
  joinedAt: string;
  totalXp: number;
  isActive: boolean;
  daysActiveLast30: number;
}

export interface UserReferralStats {
  totalInvited: number;
  activeReferrals: number;
  inactiveReferrals: number;
  lifetimeEarningsSats: number;
  referralRewardCapSats?: number | null;
}

export interface UserReferralDashboard {
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  inactiveReferrals: number;
  lifetimeEarningsSats: number;
  activeTier?: string;
  referralRewardCapSats?: number | null;
  referrals: UserReferral[];
}

export interface UserReferralDashboardView {
  referralCode: string;
  stats: UserReferralStats;
  referralsList: UserReferral[];
  activeTier?: string;
}

export interface UserUnlockItem {
  id: string;
  taskTitle: string;
  campaignTitle: string;
  confidenceScore: number | null;
  unlockAt: string | null;
  status: string;
}

export interface TodayQuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  order: number;
}

export interface TodayQuiz {
  id: string;
  title: string;
  description?: string;
  rewardSats: number;
  xpReward?: number;
  questions: TodayQuizQuestion[];
}

export interface TodayQuizResponse {
  status: 'available' | 'submitted';
  quiz: TodayQuiz;
  result?: QuizResult;
}

export interface QuizResult {
  message: string;
  passed: boolean;
  score: number;
  rewardEarned: number;
  xpEarned?: number;
  streakBonusSats?: number;
}

export interface UserWithdrawal {
  id: string;
  amountSats: number;
  lightningInvoice: string;
  paymentProof: string | null;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  createdAt: string;
}

export interface UserSubmissionHistoryItem {
  id: string;
  taskTitle: string;
  campaignTitle: string;
  status: string;
  rejectionReason: string | null;
  submittedAt: string;
  unlockAt: string | null;
  creditedAt: string | null;
  rewardSats: number;
  xpReward?: number;
  remainingMs: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  value: number;
}

export interface UserLeaderboard {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
  streaks: LeaderboardEntry[];
  generatedAt: string;
}
