'use client';

import { useEffect } from 'react';
import { ADSENSE_CLIENT, ENABLE_ADSENSE_SLOTS } from '@/lib/site';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  responsive?: boolean;
};

export function AdSlot({ slot, format = 'auto', className = '', responsive = true }: AdSlotProps) {
  useEffect(() => {
    if (!ENABLE_ADSENSE_SLOTS) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (!ENABLE_ADSENSE_SLOTS) {
    return null;
  }

  return (
    <div className={`rounded-2xl border border-[#1d1d1d] bg-[#090909] p-3 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
