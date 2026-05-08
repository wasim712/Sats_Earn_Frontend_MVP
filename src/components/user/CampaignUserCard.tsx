import React  from 'react';
import Link from 'next/link';
import { Zap, Clock, ChevronRight, LinkIcon, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
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
  const safeTotal = Number(campaign.totalCompletions) || 0;
  const safeMax = Number(campaign.maxCompletions) || 1;
  const spotsLeft = Math.max(0, safeMax - safeTotal);
  const progressPercent = Math.min((safeTotal / safeMax) * 100, 100);
  const isAlmostFull = spotsLeft < (safeMax * 0.1) && spotsLeft > 0;
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
  
  return (
    <div className={`group relative bg-sats-black-900 border rounded-3xl flex flex-col h-full transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isCompleted ? 'border-green-500/30 hover:shadow-[0_10px_30px_rgba(34,197,94,0.12)]' : 'border-sats-black-800 hover:shadow-[0_10px_30px_rgba(249,115,22,0.1)] hover:border-sats-black-700'}`}>
      {campaign.coverImageUrl && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={campaign.coverImageUrl}
            alt={campaign.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sats-black-900 via-sats-black-900/35 to-transparent" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-linear-to-br from-sats-orange-500/0 via-transparent to-transparent group-hover:from-sats-orange-500/5 transition-colors duration-500 pointer-events-none"></div>

      <div className="relative z-10 p-6 flex justify-between items-start mb-5">
        <div className="w-12 h-12 rounded-2xl bg-sats-black-950 border border-sats-black-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
          <PlatformLogo url={campaign.targetUrl} className="w-6 h-6" />
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm font-black text-green-400">Completed</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-sats-orange-500/10 border border-sats-orange-500/20 px-3 py-1.5 rounded-xl shadow-sm">
            <Zap className="w-4 h-4 text-sats-orange-500 fill-sats-orange-500" />
            <span className="text-sm font-black text-sats-orange-400">Up to {topTierReward} <span className="text-xs font-bold text-sats-orange-500/70">SATS</span></span>
          </div>
        )}
      </div>

      <div className="relative z-10 grow mb-6 px-6">
        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-sats-orange-400 transition-colors line-clamp-1">
          {campaign.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
          {campaign.description}
        </p>
        {campaign.doubleRewardsStartAt && campaign.doubleRewardsEndAt && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-300">
            <Zap className="w-3.5 h-3.5" />
            Get 2x rewards from {new Date(campaign.doubleRewardsStartAt).toLocaleDateString()} to {new Date(campaign.doubleRewardsEndAt).toLocaleDateString()}
          </div>
        )}
        {totalTasksCount > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#1a1a1a] bg-black/40 px-3 py-2 text-xs font-bold text-gray-300">
            <span>{completedTasksCount}/{totalTasksCount} completed</span>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-auto space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-end text-xs font-bold">
            <span className={`${isCompleted ? 'text-green-400' : isAlmostFull ? 'text-orange-400 flex items-center gap-1' : 'text-gray-500'}`}>
              {!isCompleted && isAlmostFull && <Clock className="w-3 h-3" />}
              {isCompleted ? 'All steps completed' : `${spotsLeft.toLocaleString()} spots left`}
            </span>
            <span className="text-gray-600">{progressPercent.toFixed(0)}% Filled</span>
          </div>
          <div className="w-full bg-sats-black-950 rounded-full h-2 border border-sats-black-800 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 bg-linear-to-r from-sats-orange-600 to-sats-orange-400"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <Link 
          href={`/user/tasks/${campaign.id}`}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl border transition-all duration-300 group/btn ${isCompleted ? 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 text-green-300' : 'bg-sats-black-950 hover:bg-sats-orange-500 text-white hover:text-black border-sats-black-800 hover:border-sats-orange-500'}`}
        >
          <span>{isCompleted ? 'View Completed' : 'View Task'}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
