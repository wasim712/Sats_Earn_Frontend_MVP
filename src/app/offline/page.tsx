'use client';

import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-[#1a1a1a] bg-[#050505] p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10">
          <WifiOff className="w-8 h-8 text-sats-orange-400" />
        </div>
        <h1 className="text-2xl font-black">You are offline</h1>
        <p className="mt-3 text-sm text-gray-400">
          SatsEarn could not load this page without an internet connection. Public content may still work if it was cached before.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="rounded-xl bg-sats-orange-500 px-4 py-2.5 text-sm font-black text-black">
            Go Home
          </Link>
          <button onClick={() => window.location.reload()} className="rounded-xl border border-[#2a2a2a] px-4 py-2.5 text-sm font-bold text-gray-300">
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
