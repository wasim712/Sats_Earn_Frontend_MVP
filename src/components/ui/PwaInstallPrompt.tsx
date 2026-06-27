'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-2xl border border-sats-orange-500/20 bg-[#050505]/95 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.65)]">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-xl border border-sats-orange-500/20 bg-sats-orange-500/10 p-2">
          <Download className="w-4 h-4 text-sats-orange-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-white">Install SatsEarn</p>
          <p className="mt-1 text-xs text-gray-400">Add the app to your home screen for a faster, full-screen experience.</p>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={handleInstall} className="rounded-xl bg-sats-orange-500 px-3 py-2 text-xs font-black text-black">
              Install App
            </button>
            <button onClick={() => setDismissed(true)} className="rounded-xl border border-[#2a2a2a] px-3 py-2 text-xs font-bold text-gray-300">
              Later
            </button>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
