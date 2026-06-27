/**
 * Centralized dictionary of all Google Analytics events used across the application.
 * Prevents hardcoding event string names and guarantees consistency.
 */
export const EVENTS = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'sign_up',
  
  // Tasks & Offers
  TASK_STARTED: 'task_started',
  TASK_COMPLETED: 'task_completed',
  
  // Rewards & Wallet
  REWARD_CLAIMED: 'reward_claimed',
  WITHDRAWAL_REQUESTED: 'withdrawal_requested',
  WALLET_CONNECTED: 'wallet_connected',
  
  // Referrals
  REFERRAL_COPIED: 'referral_copied',
  REFERRAL_SHARED: 'referral_shared',
  
  // Engagement
  DAILY_CHECKIN: 'daily_checkin',
  SEARCH: 'search',
  LANGUAGE_CHANGED: 'language_changed',
  THEME_CHANGED: 'theme_changed',
  
  // CTAs
  HERO_CTA_CLICK: 'hero_cta_click',
  NAVBAR_CTA_CLICK: 'navbar_cta_click',
} as const;

export type AnalyticsEventName = typeof EVENTS[keyof typeof EVENTS];
