import React from 'react';
import { ArrowLeft, Loader2, Save, Settings } from 'lucide-react';

export function SettingsHeader({
  isSaving,
  onBack,
}: {
  isSaving: boolean;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xl mt-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white bg-[#0a0a0a] border border-[#1a1a1a] hover:bg-[#111] px-5 py-2.5 rounded-xl transition-all font-bold w-full sm:w-auto justify-center shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="text-center sm:text-left flex items-center gap-3">
        <div className="p-2 bg-[#111] border border-[#2a2a2a] rounded-lg shadow-inner hidden sm:block">
          <Settings className="w-5 h-5 text-sats-orange-500" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Global Platform Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Control core economics and gamification limits.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center justify-center w-full sm:w-auto bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black px-8 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(238,139,18,0.2)] active:scale-95"
      >
        {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
        Save Changes
      </button>
    </div>
  );
}
