'use client';

import { useEffect } from 'react';

const PWA_CACHE_VERSION = process.env.NEXT_PUBLIC_PWA_CACHE_VERSION || 'dev';

export function PwaRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(PWA_CACHE_VERSION)}`, { scope: '/' });
      } catch (error) {
        console.error('PWA service worker registration failed:', error);
      }
    };

    register();
  }, []);

  return null;
}
