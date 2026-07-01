'use client';

import React from 'react';
import { GoogleAnalytics } from './GoogleAnalytics';
import GoogleTagManager from './GoogleTagManager'

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Global provider for all analytics integrations.
 * Can be safely extended in the future (e.g. PostHog, Microsoft Clarity)
 * without needing to modify the main application layout.
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <>
      <GoogleAnalytics />
      <GoogleTagManager/>
      {/* 
        Future providers can be added here without modifying the root layout.
      */}
      
      {children}
    </>
  );
}
