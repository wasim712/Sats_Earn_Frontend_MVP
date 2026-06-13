export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  country?: string;
  referralCode?: string;
  [key: string]: unknown;
}

export interface AuthUser {
  id?: string;
  email?: string;
  fullName?: string;
  country?: string | null;
  referralCode?: string | null;
  role?: string;
  activeTier?: string;
  isPremium?: boolean;
  premiumExpiresAt?: string | null;
  hasCompletedOnboarding?: boolean;
  hasSkippedOnboarding?: boolean;
  shouldShowOnboarding?: boolean;
  [key: string]: unknown;
}

export interface UserSubmissionHistoryResponse {
  items: Array<{
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
  username?: string | null;
  fullName: string | null;
  email: string;
  country?: string | null;
  joinedAt: string;
  totalXp: number;
  tasksCompleted?: number;
  tier?: string | null;
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

export interface UserDashboard {
  balances?: {
    available?: number;
    availableMsats?: number;
    locked?: number;
    pending?: number;
    pendingMsats?: number;
    btcPriceUsd?: number;
    availableBalance?: number;
    pendingBalance?: number;
    totalEarned?: number;
    totalLifetime?: number;
  };
  gamification?: {
    activeTier?: string;
    isPremium?: boolean;
    premiumExpiresAt?: string | null;
    totalXp?: number;
    currentStreak?: number;
    lastClaimedStreakMilestone?: number;
    level?: number;
    streak?: {
      milestones?: Array<{ days: number; rewardSats: number; claimed: boolean; reachedInCurrentRun: boolean; isNext: boolean }>;
      lastClaimedMilestone?: number;
      nextMilestone?: number | null;
      nextRewardSats?: number;
      progressPercent?: number;
      daysRemaining?: number;
      claimedMilestonesCount?: number;
      totalMilestones?: number;
    };
  };
  balanceAvailable?: number;
  totalXp?: number;
  activeTier?: string;
  isPremium?: boolean;
  premiumExpiresAt?: string | null;
  currentStreak?: number;
  nextStreakMilestone?: number | null;
  nextStreakRewardSats?: number;
  daysRemainingToNextMilestone?: number;
  totalClaimedMilestones?: number;
  totalStreakMilestones?: number;
  streakProgressPercent?: number;
  lastClaimedStreakMilestone?: number;
  streakMilestones?: Array<{
    days: number;
    rewardSats: number;
    claimed: boolean;
    reachedInCurrentRun: boolean;
    isNext: boolean;
  }>;
  monthlyTopEarners?: LeaderboardEntry[];
  recentActivity?: Array<{
    type: string;
    description?: string;
    createdAt: string;
    amountSats: number;
    amountMsats?: number | null;
  }>;
  recentSubmissions?: Array<{
    id?: string;
    taskTitle?: string;
    campaignTitle?: string;
    isStandalone?: boolean;
    status: string;
    submittedAt?: string;
    rewardSats?: number;
    xpReward?: number;
    remainingMs?: number;
  }>;
  [key: string]: unknown;
}

export interface UserProfile {
  id?: string;
  email?: string;
  fullName?: string;
  phone?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
  referralCode?: string | null;
  activeTier?: string;
  isPremium?: boolean;
  premiumExpiresAt?: string | null;
  currentStreak?: number;
  totalXp?: number;
  hasCompletedOnboarding?: boolean;
  hasSkippedOnboarding?: boolean;
  shouldShowOnboarding?: boolean;
  createdAt?: string;
  joinedAt?: string;
  twitterHandle?: string | null;
  instagramHandle?: string | null;
  telegramHandle?: string | null;
  discordHandle?: string | null;
  premiumTier?: string | null;
  balanceAvailable?: number;
  premiumPricing?: {
    monthlySatsMatrix?: Record<string, number>;
    yearlySatsMatrix?: Record<string, number>;
    monthlyUsdMatrix?: Record<string, number>;
    yearlyUsdMatrix?: Record<string, number>;
    oldSatsYearlyMatrix?: Record<string, number>;
  };
  billingHistory?: Array<{
    id: string;
    billingSource: string;
    amountSats?: number | null;
    amountUsd?: number | null;
    premiumTier: string;
    createdAt: string;
    billingCycle: string;
    premiumExpiresAt?: string | null;
    adminNotes?: string | null;
  }>;
  [key: string]: unknown;
}

export interface TodayQuizQuestion {
  id: string;
  questionText: string;
  explanation?: string | null;
  options: string[];
  order: number;
  correctAnswer?: string | null;
}

export interface TodayQuiz {
  id: string;
  date?: string;
  title: string;
  description?: string;
  rewardSats: number;
  xpReward?: number;
  questions: TodayQuizQuestion[];
}

export interface QuizReviewItem {
  questionId: string;
  questionText: string;
  explanation?: string | null;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  attemptCount?: number;
  rewardAwarded?: number;
  xpAwarded?: number;
  options: string[];
  order: number;
  wrongAnswers?: string[];
}

export interface QuizResult {
  message: string;
  passed: boolean;
  score: number;
  totalQuestions?: number;
  maxRewardSats?: number;
  maxXpReward?: number;
  totalAttempts?: number;
  quizTitle?: string;
  quizDescription?: string;
  rewardEarned: number;
  xpEarned?: number;
  streakBonusSats?: number;
  submittedAt?: string;
  review?: QuizReviewItem[];
}

export interface TodayQuizResponse {
  status: 'available' | 'submitted';
  quiz: TodayQuiz;
  result?: QuizResult;
}

export interface SubmitQuizAnswerResponse {
  status: 'in_progress' | 'submitted';
  questionId: string;
  isCorrect: boolean;
  attemptCount?: number;
  wrongAnswers?: string[];
  selectedAnswer?: string;
  message?: string;
  progress?: {
    solvedQuestions: number;
    totalQuestions: number;
  };
  result: QuizResult;
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
  isStandalone?: boolean;
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
  allTime: LeaderboardEntry[];
  streaks: LeaderboardEntry[];
  generatedAt: string;
}










