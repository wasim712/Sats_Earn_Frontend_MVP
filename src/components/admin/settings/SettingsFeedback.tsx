import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export function SettingsSuccessToast({ show }: { show: boolean }) {
  return (
    <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#0a0a0a] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.15)] transition-all duration-500 ${show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      </div>
      <div>
        <p className="font-bold text-sm text-white">Settings Saved</p>
        <p className="text-xs opacity-80">Global platform rules updated successfully.</p>
      </div>
    </div>
  );
}

export function SettingsErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl font-medium flex items-center gap-3">
      <AlertTriangle className="w-5 h-5" /> {message}
    </div>
  );
}
