'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ReferralParamStorage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode = searchParams.get('ref');

    if (!referralCode) {
      return;
    }

    localStorage.setItem('referral', referralCode.trim().toUpperCase());
  }, [searchParams]);

  return null;
}
