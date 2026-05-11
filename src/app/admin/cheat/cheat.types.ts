export type CheatUserState = {
  id: string;
  email: string;
  fullName?: string | null;
  totalXp: number;
  premiumTier?: 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER' | null;
  premiumExpiresAt?: string | null;
  currentStreak: number;
  lastClaimedStreakMilestone: number;
  balanceAvailable: number;
  balancePending: number;
  balanceLocked: number;
  isActive: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  activeTier?: string | null;
  isPremium?: boolean;
  underlyingFreeTier?: string | null;
};

export type CheatUserForm = {
  totalXp: number;
  balanceAvailable: number;
  balancePending: number;
  balanceLocked: number;
  currentStreak: number;
  lastClaimedStreakMilestone: number;
  premiumTier: 'NONE' | 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER';
  premiumExpiresAt: string;
  isActive: boolean;
};
