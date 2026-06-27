'use client';

import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile, submitPremiumInterest } from '@/features/user/userProfileSlice';
import { fetchUserDashboard } from '@/features/user/userDashboardSlice';
import { syncUserTier } from '@/features/auth/authSlice';
import { 
  Mail, Phone, MapPin, Calendar, 
  Copy, CheckCircle2, Edit3, ShieldCheck, 
  Share2, UserPlus, AlertTriangle, Flame, Zap, Crown, Clock3, Layers3
} from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: profile, isLoading, error } = useAppSelector((state) => state.userProfile);
  const { data: dashboardData } = useAppSelector((state) => state.userDashboard);
  
  const [copied, setCopied] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    if (!dashboardData) {
      dispatch(fetchUserDashboard());
    }
  }, [dashboardData, dispatch]);

  useEffect(() => {
    if (!profile?.activeTier) return;
    dispatch(syncUserTier({
      activeTier: profile.activeTier,
      isPremium: profile.isPremium,
      premiumExpiresAt: profile.premiumExpiresAt || null,
    }));
  }, [dispatch, profile?.activeTier, profile?.isPremium, profile?.premiumExpiresAt]);

  const handleCopyReferral = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpgradeClick = async () => {
    try {
      setUpgradeLoading(true);
      const result = await dispatch(submitPremiumInterest({ plan: 'PLATINUM', intent: 'UPGRADE', source: 'profile-page' })).unwrap();
      alert(result.message);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send upgrade request.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Header Area Skeleton */}
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 mb-8 md:mb-10 animate-pulse">
            <div>
              <div className="h-[36px] md:h-[40px] w-48 bg-[#1a1a1a] rounded-lg mb-2"></div>
              <div className="h-[20px] w-64 bg-[#111] rounded-md"></div>
            </div>
            <div className="flex w-full xl:w-auto flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap items-stretch gap-3 xl:justify-end">
              <div className="min-w-[140px] sm:min-w-[156px] rounded-2xl border border-[#1a1a1a] bg-[#050505] px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 rounded-xl bg-[#111]"></div>
                  <div className="w-full">
                    <div className="h-2.5 w-16 bg-[#1a1a1a] rounded mb-2 mt-1"></div>
                    <div className="h-5 w-20 bg-[#1a1a1a] rounded"></div>
                  </div>
                </div>
              </div>
              <div className="min-w-[140px] sm:min-w-[156px] rounded-2xl border border-[#1a1a1a] bg-[#050505] px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 rounded-xl bg-[#111]"></div>
                  <div className="w-full">
                    <div className="h-2.5 w-16 bg-[#1a1a1a] rounded mb-2 mt-1"></div>
                    <div className="h-5 w-24 bg-[#1a1a1a] rounded"></div>
                  </div>
                </div>
              </div>
              <div className="h-[48px] w-full sm:w-[140px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl"></div>
              <div className="h-[48px] w-full sm:w-[150px] bg-[#111] border border-[#1a1a1a] rounded-xl"></div>
            </div>
          </div>

          {/* Main Grid Layout Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
            
            {/* Left Column (Personal & Socials) */}
            <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
              
              {/* Personal Details Card */}
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-8 border-b border-[#1a1a1a]">
                  <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full"></div>
                  <div>
                    <div className="h-8 md:h-9 w-48 bg-[#1a1a1a] rounded-lg mb-3"></div>
                    <div className="h-6 w-24 bg-[#111] rounded-full"></div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={`info-${item}`} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] shrink-0"></div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="h-2.5 w-20 bg-[#1a1a1a] rounded mb-2.5 mt-0.5"></div>
                        <div className="h-5 md:h-6 w-40 max-w-full bg-[#111] rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Web3 Socials Card */}
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
                <div className="mb-8">
                  <div className="h-6 w-48 bg-[#1a1a1a] rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={`social-${item}`} className="flex items-center gap-4 p-4 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
                      <div className="w-10 h-10 shrink-0 bg-[#111] rounded-xl border border-[#1a1a1a]"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-2.5 w-20 bg-[#1a1a1a] rounded mb-2"></div>
                        <div className="h-5 w-32 bg-[#111] rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Status Card */}
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                  <div>
                    <div className="h-6 md:h-8 w-48 bg-[#1a1a1a] rounded-lg mb-2"></div>
                    <div className="h-4 w-64 md:w-96 max-w-full bg-[#111] rounded"></div>
                  </div>
                  <div className="h-8 w-28 bg-[#111] rounded-xl border border-[#1a1a1a]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={`detail-${item}`} className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 rounded-xl bg-[#111] border border-[#1a1a1a]"></div>
                        <div className="w-full">
                          <div className="h-2.5 w-20 bg-[#1a1a1a] rounded mb-2 mt-1"></div>
                          <div className="h-4 w-24 bg-[#111] rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-[#1a1a1a] bg-[#080808] p-4 space-y-3">
                  <div className="h-4 w-full bg-[#111] rounded"></div>
                  <div className="h-4 w-5/6 bg-[#111] rounded"></div>
                  <div className="h-4 w-4/5 bg-[#111] rounded"></div>
                </div>
              </div>
            </div>

            {/* Right Column: Referral Center */}
            <div className="flex flex-col h-full">
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 h-full min-h-[400px] flex flex-col">
                <div className="w-14 h-14 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl mb-6"></div>
                <div className="h-7 w-32 bg-[#1a1a1a] rounded-lg mb-4"></div>
                <div className="space-y-2 mb-8">
                  <div className="h-4 w-full bg-[#111] rounded"></div>
                  <div className="h-4 w-5/6 bg-[#111] rounded"></div>
                  <div className="h-4 w-4/5 bg-[#111] rounded"></div>
                </div>
                <div className="mt-auto">
                  <div className="h-2.5 w-24 bg-[#1a1a1a] rounded mb-3"></div>
                  <div className="flex items-stretch gap-2">
                    <div className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-4 h-[60px]"></div>
                    <div className="shrink-0 w-16 rounded-xl bg-[#111] border border-[#1a1a1a] h-[60px]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="mt-8 rounded-[28px] border border-[#1a1a1a] bg-[#050505] p-6 md:p-8 animate-pulse">
            <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <div className="h-6 md:h-8 w-40 bg-[#1a1a1a] rounded-lg mb-2"></div>
                <div className="h-4 w-64 md:w-96 max-w-full bg-[#111] rounded"></div>
              </div>
              <div className="h-8 w-24 bg-[#111] rounded-xl border border-[#1a1a1a]"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={`billing-${item}`} className="rounded-3xl border border-[#1a1a1a] bg-[#0a0a0a] p-5">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="h-6 w-24 bg-[#1a1a1a] rounded mb-2"></div>
                      <div className="h-4 w-32 bg-[#111] rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-[#111] rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3 h-[72px]"></div>
                    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3 h-[72px]"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-[#111] rounded-full border border-[#1a1a1a]"></div>
                    <div className="h-6 w-32 bg-[#111] rounded-full border border-[#1a1a1a]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4">
        <div className="bg-[#050505] border border-red-500/20 text-red-400 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500/80" />
          <p className="font-semibold text-lg">{error}</p>
          <button 
            onClick={() => dispatch(fetchUserProfile())} 
            className="px-6 py-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl text-sm text-white hover:bg-white/5 transition-all mt-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Derived Data ───────────────────────────────────────────────────────────
  const joinDate = new Date(profile.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  const initials = (profile.fullName || profile.email || 'User')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const currentStreak = dashboardData?.gamification?.currentStreak ?? 0;
  const totalXp = dashboardData?.gamification?.totalXp ?? 0;
  const activeTier = profile.activeTier || 'BASIC';
  const isPremium = Boolean(profile.isPremium);
  const premiumTierLabel = profile.premiumTier || 'None';
  const premiumEndsAt = profile.premiumExpiresAt ? new Date(profile.premiumExpiresAt) : null;
  const queuedTierLabel = profile.queuedPremiumTier || 'None';
  const queuedStartsAt = profile.queuedPremiumStartsAt ? new Date(profile.queuedPremiumStartsAt) : null;
  const queuedEndsAt = profile.queuedPremiumExpiresAt ? new Date(profile.queuedPremiumExpiresAt) : null;
  const premiumQueue = Array.isArray(profile.premiumQueue) ? profile.premiumQueue : [];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Player Identity</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your personal details and Web3 social presence.</p>
          </div>
          <div className="flex w-full xl:w-auto flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap items-stretch gap-3 xl:justify-end">
            <ProfileStatCard
              icon={Flame}
              label="Current Streak"
              value={`${currentStreak} Days`}
              accent="text-sats-orange-500"
            />
            <ProfileStatCard
              icon={Zap}
              label="Total XP"
              value={totalXp.toLocaleString()}
              accent="text-purple-400"
            />
            <button 
              onClick={() => router.push('/user/settings')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-white font-bold hover:bg-[#111] hover:border-[#333] transition-all active:scale-[0.98] shadow-sm whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4 text-gray-400" /> Edit Profile
            </button>
            <Link
               href={"/user/rewards#premium-tiers"}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-xl text-sats-orange-400 font-bold hover:bg-sats-orange-500/15 transition-all active:scale-[0.98] shadow-sm whitespace-nowrap disabled:opacity-60"
            >
              <Zap className="w-4 h-4" /> {'Upgrade Tier'}
            </Link>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column (Personal & Socials) */}
          <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            
            {/* Personal Details Card */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-8 border-b border-[#1a1a1a]">
                {/* Crisp Avatar */}
                <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 bg-[#0a0a0a] border border-[#2a2a2a] rounded-full flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-inner ring-4 ring-[#050505] outline outline-1 outline-[#1a1a1a]">
                  {initials}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">{profile.fullName}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
                <InfoRow icon={Mail} label="Email Address" value={profile.email} />
                <InfoRow icon={Phone} label="Phone Number" value={profile.phone} fallback="Not provided" />
                <InfoRow icon={MapPin} label="Region" value={profile.country} />
                <InfoRow icon={Calendar} label="Member Since" value={joinDate} />
              </div>
            </div>
            {/* Web3 Socials Card */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-gray-400" /> Connected Accounts
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SocialBox 
                  iconSrc="/svgs/twitter.svg" 
                  platform="Twitter / X" 
                  handle={profile.twitterHandle} 
                  hoverAccent="hover:border-white/40" 
                />
                <SocialBox 
                  iconSrc="/svgs/discord.svg" 
                  platform="Discord" 
                  handle={profile.discordHandle} 
                  hoverAccent="hover:border-indigo-500/50" 
                />
                <SocialBox 
                  iconSrc="/svgs/telelogo.svg" 
                  platform="Telegram" 
                  handle={profile.telegramHandle} 
                  hoverAccent="hover:border-sky-500/50" 
                />
                <SocialBox 
                  iconSrc="/svgs/instalogo.svg" 
                  platform="Instagram" 
                  handle={profile.instagramHandle} 
                  hoverAccent="hover:border-pink-500/50" 
                />
              </div>
            </div>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" /> Premium Status
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">See your active tier, current premium status, and any queued premium plan in detail.</p>
                </div>
                <div className={`inline-flex rounded-xl border px-3 py-2 text-xs font-semibold ${isPremium ? 'border-green-500/20 bg-green-500/10 text-green-300' : 'border-[#2a2a2a] bg-[#090909] text-gray-400'}`}>
                  {isPremium ? 'Premium Active' : 'Free Tier Active'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <DetailCard icon={Layers3} label="Current Active Tier" value={String(activeTier)} accent="text-sky-300" />
                <DetailCard icon={Crown} label="Current Premium Plan" value={premiumTierLabel} accent="text-yellow-300" />
                <DetailCard icon={Clock3} label="Current Premium Ends" value={premiumEndsAt ? premiumEndsAt.toLocaleString() : 'No active premium expiry'} accent="text-blue-300" />
                <DetailCard icon={Crown} label="Queued Premium Plan" value={queuedTierLabel} accent="text-violet-300" />
                <DetailCard icon={Clock3} label="Queued Plan Starts" value={queuedStartsAt ? queuedStartsAt.toLocaleString() : 'No queued premium plan'} accent="text-violet-300" />
                <DetailCard icon={Clock3} label="Queued Plan Ends" value={queuedEndsAt ? queuedEndsAt.toLocaleString() : 'No queued premium plan'} accent="text-violet-300" />
              </div>

              <div className="mt-5 rounded-2xl border border-[#1a1a1a] bg-[#080808] p-4 text-sm text-gray-300 leading-relaxed">
                <p><span className="font-bold text-white">Active tier</span> is what the app currently uses for rewards and access.</p>
                <p className="mt-2"><span className="font-bold text-white">Current premium plan</span> is the live subscription record. If it is missing but active tier is premium, check queued activation timing.</p>
                <p className="mt-2"><span className="font-bold text-white">Queued premium</span> shows the next plan that will start after the current one ends.</p>
              </div>

              {premiumQueue.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-[#1a1a1a] bg-[#080808] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-sm md:text-base font-black text-white tracking-tight">Future Premium Queue</h4>
                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-300">
                      {premiumQueue.length} queued
                    </span>
                  </div>

                  <div className="space-y-3">
                    {premiumQueue.map((item, index) => (
                      <div key={item.id} className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-sm font-black text-white">#{index + 1} {item.premiumTier}</p>
                            <p className="mt-1 text-xs text-gray-400">Purchased {new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-300">
                            {item.billingCycle}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Starts</div>
                            <div className="mt-2 font-semibold text-white">{item.premiumStartsAt ? new Date(item.premiumStartsAt).toLocaleString() : 'Unknown'}</div>
                          </div>
                          <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Ends</div>
                            <div className="mt-2 font-semibold text-white">{item.premiumExpiresAt ? new Date(item.premiumExpiresAt).toLocaleString() : 'Unknown'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            

          </div>

          {/* Right Column: Referral Center */}
          <div className="flex flex-col h-full">
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 h-full flex flex-col group relative overflow-hidden transition-colors hover:border-[#2a2a2a]">
              
              {/* Subtle top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-sats-orange-500 opacity-80" />

              <div className="w-14 h-14 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <UserPlus className="w-6 h-6 text-sats-orange-500" />
              </div>

              <h3 className="text-xl font-black text-white mb-3">Refer & Earn</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Build your network. Share your unique code and earn a percentage of Sats every time a referral completes a task.
              </p>

              <div className="mt-auto">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Your Unique Code</p>
                <div className="flex items-stretch gap-2">
                  <div className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-4 flex items-center justify-center">
                    <span className="text-xl md:text-2xl font-mono font-black text-white tracking-[0.2em] select-all">
                      {profile.referralCode}
                    </span>
                  </div>
                  <button 
                    onClick={handleCopyReferral}
                    className={`shrink-0 w-16 flex items-center justify-center rounded-xl transition-all duration-300 border ${
                      copied 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-sats-orange-500 text-black border-sats-orange-500 hover:bg-sats-orange-400 active:scale-95 shadow-[0_0_15px_rgba(238,139,18,0.15)]'
                    }`}
                    title={copied ? "Copied!" : "Copy Code"}
                  >
                    {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="mt-8 rounded-[28px] border border-[#1a1a1a] bg-[#050505] p-6 md:p-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Billing History</h3>
              <p className="text-sm text-gray-400 mt-1">Shows whether your premium tier came from sats, manual payment, or admin override.</p>
            </div>
            <div className="inline-flex rounded-xl border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-2 text-xs font-semibold text-sats-orange-300">
              {profile.billingHistory?.length ?? 0} record(s)
            </div>
          </div>
          {profile.billingHistory && profile.billingHistory.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {profile.billingHistory.map((item: { id: string; billingSource: string; amountSats?: number | null; amountUsd?: number | null; premiumTier: string; createdAt: string; billingCycle: string; premiumExpiresAt?: string | null; adminNotes?: string | null }) => {
                const sourceLabel = item.billingSource.replace(/_/g, ' ');
                const amountLabel = item.amountSats ? `${item.amountSats.toLocaleString()} sats` : item.amountUsd ? `$${item.amountUsd}` : 'Manual update';
                return (
                  <div key={item.id} className="rounded-3xl border border-[#1d1d1d] bg-gradient-to-br from-[#0a0a0a] to-[#050505] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-black text-white tracking-tight">{item.premiumTier}</div>
                        <div className="mt-1 text-sm text-gray-400">{new Date(item.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-green-300">
                        {item.billingCycle}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Source</div>
                        <div className="mt-2 text-sm font-semibold text-white">{sourceLabel}</div>
                      </div>
                      <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Amount</div>
                        <div className="mt-2 text-sm font-semibold text-sats-orange-300">{amountLabel}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-sats-orange-300">
                        {sourceLabel}
                      </span>
                      {item.premiumExpiresAt ? (
                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-300">
                          Expires {new Date(item.premiumExpiresAt).toLocaleDateString()}
                        </span>
                      ) : null}
                    </div>

                    {item.adminNotes ? (
                      <div className="mt-4 rounded-2xl border border-[#1a1a1a] bg-[#080808] p-3 text-sm text-gray-300">
                        {item.adminNotes}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#2a2a2a] bg-[#050505] p-6 text-sm text-gray-400">
              No billing records yet. Your upgrades and manual billing changes will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Micro-Components ──────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, fallback }: { icon: LucideIcon, label: string, value: string | null | undefined, fallback?: string }) {
  const displayValue = value || fallback;
  const isFallback = !value;

  return (
    <div className="flex items-start gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center shrink-0 group-hover:border-[#333] transition-colors">
        <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-sm md:text-base font-semibold truncate ${isFallback ? 'text-gray-600 italic font-medium' : 'text-gray-200'}`}>
          {displayValue}
        </p>
      </div>
    </div>
  );
}

function SocialBox({ iconSrc, platform, handle, hoverAccent }: { iconSrc: string, platform: string, handle: string | null | undefined, hoverAccent: string }) {
  const isConnected = !!handle;

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
        isConnected 
          ? `bg-[#0a0a0a] border-[#1a1a1a] ${hoverAccent} hover:-translate-y-[2px] shadow-sm` 
          : 'bg-[#050505] border-[#1a1a1a] border-dashed opacity-50'
      }`}
    >
      <div className="w-10 h-10 shrink-0 bg-[#111] rounded-xl flex items-center justify-center border border-[#1a1a1a]">
        {/* Placeholder for actual SVGs placed in the public/svgs folder */}
        <Image 
          src={iconSrc} 
          alt={`${platform} icon`} 
          width={20} 
          height={20} 
          className={!isConnected ? 'opacity-40 grayscale' : ''}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{platform}</p>
        <p className={`text-sm font-bold truncate ${isConnected ? 'text-gray-200' : 'text-gray-600'}`}>
          {isConnected ? `@${handle}` : 'Not Linked'}
        </p>
      </div>
    </div>
  );
}

function ProfileStatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="min-w-[140px] sm:min-w-[156px] rounded-2xl border border-[#1a1a1a] bg-[#050505] px-4 py-3.5 transition-colors hover:border-[#2a2a2a]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#232323] bg-[#0a0a0a]">
          <Icon className={`h-4 w-4 ${accent}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">{label}</p>
          <p className="mt-1 text-base md:text-lg font-black text-white truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#232323] bg-[#111]">
          <Icon className={`h-4 w-4 ${accent}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">{label}</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}



