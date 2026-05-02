'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile, updateUserProfile } from '@/features/user/userProfileSlice';
import { 
  User, Phone, Send, MessageSquare, 
  CheckCircle2, ArrowLeft, Loader2, AlertTriangle, ShieldCheck
} from 'lucide-react';

// ─── Custom Inline SVGs for Brands ──────────────────────────────────────────
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

// ─── Page Component ─────────────────────────────────────────────────────────
export default function UserSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: profile, isLoading, error } = useAppSelector((state) => state.userProfile);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    twitterHandle: '',
    instagramHandle: '',
    telegramHandle: '',
    discordHandle: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    } else {
      setForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        twitterHandle: profile.twitterHandle || '',
        instagramHandle: profile.instagramHandle || '',
        telegramHandle: profile.telegramHandle || '',
        discordHandle: profile.discordHandle || '',
      });
    }
  }, [dispatch, profile]);

  const handleUpdate = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!form.fullName.trim()) {
      setValidationError("Full Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      // Clean up empty strings to null for backend consistency
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        twitterHandle: form.twitterHandle.replace('@', '').trim() || undefined,
        instagramHandle: form.instagramHandle.replace('@', '').trim() || undefined,
        telegramHandle: form.telegramHandle.replace('@', '').trim() || undefined,
        discordHandle: form.discordHandle.trim() || undefined, // Discord doesn't always use @
      };

      await dispatch(updateUserProfile(payload)).unwrap();
      
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Skeletons & Errors ───────────────────────────────────────────────────
  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="h-6 w-32 bg-[#1a1a1a] rounded-lg mb-8" />
          <div className="h-[500px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <p className="text-red-400 font-medium bg-red-500/10 px-6 py-3 rounded-xl border border-red-500/20">{error}</p>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4 md:mt-6">
          <div>
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Account Settings
            </h1>
            <p className="text-gray-400 text-sm mt-2">Update your personal details and social connections.</p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col">
            
            <div className="p-6 md:p-10 space-y-10">
              {/* Section 1: Personal Details */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sats-orange-500" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWrapper label="Full Name" required>
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={form.fullName}
                      minLength={2}
                      onChange={(e) => handleUpdate('fullName', e.target.value)}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all"
                      placeholder="John Doe"
                    />
                  </InputWrapper>

                  <InputWrapper label="Phone Number (Optional)">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={form.phone}
                      maxLength={10}
                      max={10}
                      onChange={(e) => handleUpdate('phone', e.target.value)}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all"
                      placeholder="123 456 7890"
                    />
                  </InputWrapper>
                </div>
              </div>

              <div className="h-px w-full bg-[#1a1a1a]" />

              {/* Section 2: Social Handles */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-sats-orange-500" /> Social Connections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWrapper label="Twitter/X Handle">
                    <TwitterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={form.twitterHandle}
                      onChange={(e) => handleUpdate('twitterHandle', e.target.value)}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-400/40 focus:bg-blue-400/5 transition-all"
                      placeholder="@username"
                    />
                  </InputWrapper>

                  <InputWrapper label="Discord Username">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={form.discordHandle}
                      onChange={(e) => handleUpdate('discordHandle', e.target.value)}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-400/40 focus:bg-indigo-400/5 transition-all"
                      placeholder="username#1234"
                    />
                  </InputWrapper>

                  <InputWrapper label="Telegram Handle">
                    <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={form.telegramHandle}
                      onChange={(e) => handleUpdate('telegramHandle', e.target.value)}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-sky-400/40 focus:bg-sky-400/5 transition-all"
                      placeholder="@username"
                    />
                  </InputWrapper>

                  <InputWrapper label="Instagram Handle">
                    <InstagramIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={form.instagramHandle}
                      onChange={(e) => handleUpdate('instagramHandle', e.target.value)}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-pink-400/40 focus:bg-pink-400/5 transition-all"
                      placeholder="@username"
                    />
                  </InputWrapper>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 md:p-8 bg-[#0a0a0a] border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-3xl mt-auto">
              
              <div className="flex-1">
                {validationError && (
                  <p className="text-red-400 text-sm font-medium flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit">
                    <AlertTriangle className="w-4 h-4" /> {validationError}
                  </p>
                )}
                {error && !validationError && (
                  <p className="text-red-400 text-sm font-medium flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit">
                    <AlertTriangle className="w-4 h-4" /> Update failed. Please try again.
                  </p>
                )}
                {successMsg && (
                  <p className="text-green-400 text-sm font-bold flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg w-fit animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3.5 rounded-xl border border-[#2a2a2a] text-gray-400 font-bold hover:text-white hover:bg-white/5 transition-all flex-1 sm:flex-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3.5 rounded-xl text-nowrap bg-sats-orange-500 text-black font-black hover:bg-sats-orange-400 active:scale-95 transition-all disabled:opacity-50 flex-1 sm:flex-none flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(238,139,18,0.2)]"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin text-nowrap" /> Saving...</>
                  ) : 'Save Changes'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Input Wrapper Helper ───────────────────────────────────────────────────
function InputWrapper({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
        {label} {required && <span className="text-sats-orange-500">*</span>}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}