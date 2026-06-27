/**
 * Strictly typed Google Analytics configuration and tracking functions.
 * Follows the Single Responsibility Principle and DRY.
 * Does not crash if Measurement ID is missing.
 */
import { EVENTS, AnalyticsEventName } from './analytics-events';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Safely checks if Google Analytics is loaded and configured.
 */
export const isAnalyticsEnabled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && !!GA_TRACKING_ID;
};

/**
 * Extends default parameters with environment specific configurations.
 * In development mode, adds `debug_mode: true` to prevent polluting
 * standard production reports while still allowing local verification
 * via network tab and GA DebugView.
 */
const getEventParams = (params?: Record<string, unknown>): Record<string, unknown> => {
  const isDev = process.env.NODE_ENV !== 'production';
  return {
    ...params,
    ...(isDev ? { debug_mode: true } : {}),
  };
};

/**
 * Tracks a page view by pushing a config update to gtag.
 * Crucial for Next.js App Router as it doesn't trigger full page unloads.
 * 
 * @param url - The current pathname + search params of the page
 */
export const trackPageView = (url: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('config', GA_TRACKING_ID as string, {
    page_path: url,
    ...getEventParams(),
  });
};

/**
 * Core event tracking function.
 * All specific tracking helpers delegate to this method.
 * 
 * @param action - The name of the event from the EVENTS dictionary
 * @param params - Optional metadata to attach to the event
 */
export const trackEvent = (
  action: AnalyticsEventName | string,
  params?: Record<string, unknown>
): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', action, getEventParams(params));
};

// ============================================================================
// SPECIFIC EVENT HELPERS
// ============================================================================

export const trackLogin = (method?: string): void => 
  trackEvent(EVENTS.LOGIN, method ? { method } : undefined);

export const trackLogout = (): void => 
  trackEvent(EVENTS.LOGOUT);

export const trackSignup = (method?: string): void => 
  trackEvent(EVENTS.SIGNUP, method ? { method } : undefined);

export const trackTaskStarted = (params?: Record<string, unknown>): void => 
  trackEvent(EVENTS.TASK_STARTED, params);

export const trackTaskCompleted = (params?: Record<string, unknown>): void => 
  trackEvent(EVENTS.TASK_COMPLETED, params);

export const trackRewardClaimed = (params?: Record<string, unknown>): void => 
  trackEvent(EVENTS.REWARD_CLAIMED, params);

export const trackWithdrawalRequested = (params?: Record<string, unknown>): void => 
  trackEvent(EVENTS.WITHDRAWAL_REQUESTED, params);

export const trackWalletConnected = (walletType?: string): void => 
  trackEvent(EVENTS.WALLET_CONNECTED, walletType ? { walletType } : undefined);

export const trackReferralCopied = (): void => 
  trackEvent(EVENTS.REFERRAL_COPIED);

export const trackReferralShared = (platform?: string): void => 
  trackEvent(EVENTS.REFERRAL_SHARED, platform ? { platform } : undefined);

export const trackDailyCheckin = (): void => 
  trackEvent(EVENTS.DAILY_CHECKIN);

export const trackSearch = (searchTerm: string): void => 
  trackEvent(EVENTS.SEARCH, { search_term: searchTerm });

export const trackLanguageChanged = (language: string): void => 
  trackEvent(EVENTS.LANGUAGE_CHANGED, { language });

export const trackThemeChanged = (theme: string): void => 
  trackEvent(EVENTS.THEME_CHANGED, { theme });

export const trackHeroCTA = (): void => 
  trackEvent(EVENTS.HERO_CTA_CLICK);

export const trackNavbarCTA = (): void => 
  trackEvent(EVENTS.NAVBAR_CTA_CLICK);
