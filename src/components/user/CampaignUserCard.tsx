'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Zap, Clock, ChevronRight, LinkIcon, CheckCircle2, 
  Monitor, Smartphone, Users, LayoutGrid, ListChecks 
} from 'lucide-react';
import { Campaign } from '@/features/admin/adminCampaignsSlice';

// --- PLATFORM LOGO COMPONENT ---
const PlatformLogo = ({ url, className = "w-6 h-6" }: { url: string | null, className?: string }) => {
  if (!url) return <LinkIcon className={`text-gray-400 ${className}`} />;
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  
  if (lowerUrl.includes('instagram.com')) return <Image src="/svgs/instalogo.svg" alt="Instagram" width={30} height={30} className={className} />;
  if (lowerUrl.includes('t.me')) return <Image src="/svgs/telelogo.svg" alt="Telegram" width={30} height={30} className={className} />;
  if (lowerUrl.includes('facebook.com')) return <Image src="/svgs/facebooklogo.svg" alt="Facebook" width={30} height={30} className={className} />;
  if (lowerUrl.includes('linkedin.com')) return <Image src="/svgs/linkedinlogo.svg" alt="LinkedIn" width={30} height={30} className={className} />;
  if (lowerUrl.includes('youtube.com')) return <Image src="/svgs/youtubelogo.svg" alt="YouTube" width={30} height={30} className={className} />;
  
  return <LinkIcon className={`text-gray-400 ${className}`} />;
};

// --- SUB-COMPONENT: The Individual Task Card ---
export function CampaignUserCard({ campaign }: { campaign: Campaign }) {
  // Calculations & Logic
  const safeTotal = Number(campaign.totalCompletions) || 0;
  const safeMax = Number(campaign.maxCompletions) || 1;
  const spotsLeft = Math.max(0, safeMax - safeTotal);
  const progressPercent = Math.min((safeTotal / safeMax) * 100, 100);
  const isAlmostFull = spotsLeft < (safeMax * 0.1) && spotsLeft > 0;
  const isFull = safeTotal >= safeMax;
  const isCompleted = Boolean(campaign.isCompleted);
  
  const completedTasksCount = Number(campaign.completedTasksCount) || 0;
  const totalTasksCount = Number(campaign.totalTasksCount) || 0;
  
  const visibleRewardTiers = campaign.isPremiumOnly
    ? ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER']
    : ['BASIC', 'COPPER', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
    
  const topTierReward = visibleRewardTiers.reduce(
    (max, tier) => Math.max(max, Number(campaign.tierRewardMatrix?.[tier] || 0)),
    0,
  );

  const requiredPlatform = String((campaign as any).requiredPlatform || 'NONE').toUpperCase();
  const RequiredPlatformIcon = requiredPlatform === 'DESKTOP' ? Monitor : requiredPlatform === 'ANDROID' || requiredPlatform === 'IOS' ? Smartphone : LayoutGrid;
  const requiredPlatformLabel = requiredPlatform === 'NONE' ? 'All Devices' : requiredPlatform === 'IOS' ? 'iOS Only' : requiredPlatform === 'ANDROID' ? 'Android Only' : 'Desktop Only';

  const detailHref = campaign.itemSource === 'standalone' ? `/user/standalone-tasks/${campaign.id}` : `/user/tasks/${campaign.id}`;

  return (
    <Link href={detailHref} className="group block h-full">
      <div className={`relative h-full flex flex-col bg-[#080808] border ${isCompleted ? 'border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.06)]' : 'border-[#1a1a1a] group-hover:border-[#2a2a2a]'} rounded-[32px] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_15px_50px_rgba(249,115,22,0.1)]`}>
        
        {/* ─── 1. Tall Header Banner Image ─── */}
        <div className="relative h-[200px] w-full bg-[#111] overflow-hidden shrink-0">
          {campaign.coverImageUrl ? (
            <Image
              src={campaign.coverImageUrl}
              alt={campaign.title}
              fill
              className="object-cover opacity-70 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-sats-orange-500/10 via-[#111] to-blue-500/10 " />
            // <Image
            // src={"/icon.png"}
            // alt='app logo'
            // fill
            //   className="object-cover opacity-70 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
            //   sizes="(max-width: 768px) 100vw, 33vw"
            //   unoptimized
            // />
          )}
          {/* Bottom fade so text doesn't clash if we put anything over it */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080808] to-transparent opacity-90" />
          
          {/* Top Left: Platform Logo (Clean Glassmorphism) */}
          <div className="absolute top-5 left-5 w-11 h-11 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-lg z-20 group-hover:scale-110 transition-transform duration-300">
            <PlatformLogo url={campaign.targetUrl} className="w-5 h-5 drop-shadow-md" />
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
            {isCompleted ? (
              <div className="bg-green-500/90 backdrop-blur-md text-black text-[11px] font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-4 h-4" /> COMPLETED
              </div>
            ) : (
              <div className="bg-sats-orange-500/90 backdrop-blur-md text-black text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                <Zap className="w-4 h-4 fill-black" />
                Up to {topTierReward.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* ─── 2. Spacious Content Body ─── */}
        <div className="p-6 md:p-8 flex flex-col grow relative z-10">
          
          <h3 className="text-2xl font-black text-white mb-3 leading-tight group-hover:text-sats-orange-500 transition-colors line-clamp-1">
            {campaign.title}
          </h3>
          <p className="text-[15px] text-gray-400 leading-relaxed line-clamp-2">
            {campaign.description}
          </p>

          {/* Info Pills Section */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5 mb-8">
            {/* Device Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 shadow-sm">
              <RequiredPlatformIcon className="w-3.5 h-3.5 text-sats-orange-500" />
              {requiredPlatformLabel}
            </div>

            {/* Steps Completed Badge */}
            {totalTasksCount > 0 && (
              <div className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest shadow-sm ${completedTasksCount === totalTasksCount ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-[#111] border-[#2a2a2a] text-blue-400'}`}>
                <ListChecks className="w-3.5 h-3.5" />
                {completedTasksCount}/{totalTasksCount} Steps
              </div>
            )}

            {/* Double Rewards Badge */}
            {campaign.doubleRewardsStartAt && campaign.doubleRewardsEndAt && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                <Zap className="w-3.5 h-3.5 fill-yellow-400" />
                2x Rewards
              </div>
            )}
          </div>

          {/* ─── 3. Progress & Footer (Pushed to bottom) ─── */}
          <div className="mt-auto space-y-6">
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isCompleted ? 'text-green-400' : isAlmostFull ? 'text-red-400' : 'text-gray-400'}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  {isCompleted ? 'All steps completed' : `${spotsLeft.toLocaleString()} spots left`}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {progressPercent.toFixed(0)}% Filled
                </span>
              </div>
              
              <div className="h-2 w-full bg-[#141414] rounded-full overflow-hidden border border-[#1a1a1a]">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isFull ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-sats-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className={`w-full py-4 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all border group/btn ${
              isCompleted 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : isFull
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-[#111] border-[#2a2a2a] text-white group-hover:bg-sats-orange-500 group-hover:border-sats-orange-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]'
            }`}>
              <span>{isCompleted ? 'View Submission' : isFull ? 'Campaign Full' : 'View Task Details'}</span>
              {!isCompleted && !isFull && <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
            </div>
            
          </div>
        </div>
      </div>
    </Link>
  );
}


