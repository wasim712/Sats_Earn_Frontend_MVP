'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign } from '@/features/admin/adminCampaignsSlice';
import { Trash2, Power, PowerOff, Link as LinkIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
}

// Smart Logo Component with Original Brand Colors
const PlatformLogo = ({ url, className = "w-6 h-6" }: { url: string | null, className?: string }) => {
  if (!url) return <LinkIcon className={`text-gray-400 ${className}`} />;
  const lowerUrl = url.toLowerCase();
  
  // Twitter/X Logo (White)
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  
  // Instagram Logo (Official Gradient)
  if (lowerUrl.includes('instagram.com')) {
    return (
      <Image
      src="/svgs/instalogo.svg"
      alt="Instagram"
      width={30}
      height={30}
    />
    );
  }
  if (lowerUrl.includes('t.me')) {
    return (
      <Image
      src="/svgs/telelogo.svg"
      alt="Telegram"
      width={30}
      height={30}
    />
    );
  }
  if (lowerUrl.includes('facebook.com')) {
    return (
      <Image
      src="/svgs/facebooklogo.svg"
      alt="Telegram"
      width={30}
      height={30}
    />
    );
  }
  if (lowerUrl.includes('linkedin.com')) {
    return (
      <Image
      src="/svgs/linkedinlogo.svg"
      alt="Telegram"
      width={30}
      height={30}
    />
    );
  }
  if (lowerUrl.includes('youtube.com')) {
    return (
      <Image
      src="/svgs/youtubelogo.svg"
      alt="Telegram"
      width={30}
      height={30}
    />
    );
  }
  
  return <LinkIcon className={`text-gray-400 ${className}`} />;
};

export const CampaignCard = ({ campaign, onDelete, onToggleActive }: CampaignCardProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Safely extract numbers to prevent NaN crashes
  const safeTotal = Number(campaign.totalCompletions) || 0;
  const safeMax = Number(campaign.maxCompletions) || 1;
  const progressPercent = Math.min((safeTotal / safeMax) * 100, 100);

  // Navigate to single campaign view when clicking the card
  const handleCardClick = () => {
    router.push(`/admin/campaigns/${campaign.id}`);
  };

  // e.stopPropagation() prevents the card click event from firing when we click a button
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (window.confirm(`Are you sure you want to delete "${campaign.title}"? This cannot be undone.`)) {
      setIsDeleting(true);
      onDelete(campaign.id);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleActive(campaign.id, campaign.isActive);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-sats-black-900 border ${campaign.isActive ? 'border-sats-orange-500/30 shadow-[0_5px_20px_rgba(249,115,22,0.05)]' : 'border-sats-black-800 opacity-80'} rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-sats-orange-500/60 flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer`}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl bg-sats-black-950 border border-sats-black-800 shadow-inner">
            <PlatformLogo url={campaign.targetUrl} />
          </div>
          
          {/* Status & Tier Badges */}
          <div className="flex flex-col items-end gap-2">
            <span className={`text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border ${campaign.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {campaign.isActive ? 'ACTIVE' : 'PAUSED'}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-extrabold bg-sats-black-800 text-gray-300 px-3 py-1 rounded-full">
              Tier: {campaign.requiredTier}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white mb-2 line-clamp-1 group-hover:text-sats-orange-400 transition-colors" title={campaign.title}>
          {campaign.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-6 h-10 leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span className="text-gray-300">{safeTotal.toLocaleString()} <span className="font-medium text-gray-500">completed</span></span>
            <span>{safeMax.toLocaleString()} <span className="font-medium">max</span></span>
          </div>
          <div className="w-full bg-sats-black-950 rounded-full h-2.5 overflow-hidden border border-sats-black-800">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${campaign.isActive ? 'bg-gradient-to-r from-sats-orange-600 to-sats-orange-400' : 'bg-gray-600'}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center pt-5 border-t border-sats-black-800">
        <div className="flex items-center gap-2">
          <span className="text-sats-orange-500 font-extrabold text-xl leading-none">~</span>
          <span className="text-white font-extrabold text-2xl leading-none tracking-tight">
            {campaign.rewardSats} <span className="text-sm text-gray-500 font-medium tracking-normal">Sats</span>
          </span>
        </div>

        {/* Action Buttons (Event propagation stopped) */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleToggleClick} 
            title={campaign.isActive ? "Pause Campaign" : "Activate Campaign"} 
            className={`p-2.5 rounded-xl transition-all ${campaign.isActive ? 'text-gray-400 hover:text-white hover:bg-sats-black-800' : 'text-green-500 hover:bg-green-500/10'}`}
          >
            {campaign.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={handleDeleteClick} 
            disabled={isDeleting} 
            title="Delete Campaign" 
            className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};