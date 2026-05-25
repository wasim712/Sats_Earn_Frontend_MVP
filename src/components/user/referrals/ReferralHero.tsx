'use client';

import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Share2, Gift } from 'lucide-react';

export default function ReferralHero({ code, url, activeTier , tierCommission }: { code: string; url: string; activeTier?: string ; tierCommission:number; }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Pre-filled Share Messages
  const shareText = "I'm earning Bitcoin on SatsEarn! 🚀 Start stacking sats today.";
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\nUse my link: ' + url)}`;
  const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;

  const shareAnywhere = async () => {
    const payload = {
      title: 'SatsEarn Referral',
      text: `${shareText}\n\nUse my link: ${url}`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
      }
    }

    navigator.clipboard.writeText(payload.text);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="relative bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 overflow-hidden group hover:border-sats-orange-500/30 transition-all duration-500">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sats-orange-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        
        {/* TOP ROW: Header & Quick Share */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight"> <Gift className='text-sats-orange-500 inline align-middle'/> Your Referral Link</h2>
            <p className="text-gray-400 text-sm font-medium">Share this link with friends. Your <span className='text-sats-orange-500 font-bold'> {activeTier ||'BASIC'} </span> tier currently gives you <span className='text-sats-orange-500 font-bold'> {tierCommission || 5}% commission .</span></p>
            <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1.5 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-sats-orange-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-sats-orange-400">
                Current Tier: {activeTier || 'BASIC'}
              </span>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="lg:flex items-center gap-3 hidden">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">Quick Share</span>
            
            {/* X (Twitter) */}
            <a href={xShareUrl} target="_blank" rel="noopener noreferrer" title="Share on X" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a href={waShareUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-gray-400 bg-[#25D366] text-white hover:border-[#25D366] transition-all">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            {/* Telegram */}
            <a href={tgShareUrl} target="_blank" rel="noopener noreferrer" title="Share on Telegram" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-gray-400  transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 32 32" fill="none" className="" lang="en">
                <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)"/>
                <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white"/>
                <defs>
                <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#37BBFE"/>
                <stop offset="1" stopColor="#007DBB"/>
                </linearGradient>
                </defs>
              </svg>
            </a>

            <button
              type="button"
              onClick={shareAnywhere}
              title="Share Anywhere"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-gray-300 hover:border-sats-orange-500/30 hover:text-white transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Link & Code */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
          
          {/* Link Box (Scrollable) */}
          <div className="flex-1 flex items-center bg-[#050505] border border-[#1a1a1a] rounded-2xl px-5 py-4 group-hover:border-[#2a2a2a] transition-all overflow-hidden relative">
            <div className="flex-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-gray-300 font-bold text-sm mr-4 pr-4 border-r border-[#1a1a1a]">
              {url}
            </div>
            <button 
              onClick={copyLink} 
              className="shrink-0 text-sats-orange-500 hover:text-sats-orange-400 transition-colors p-1"
              title="Copy Link"
            >
              {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Referral Code Box */}
          <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 px-6 py-4 rounded-2xl flex items-center gap-6 shrink-0 justify-between w-full lg:w-auto hover:bg-sats-orange-500/15 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-sats-orange-500/60 uppercase tracking-widest">Code</span>
              <span className="text-lg font-black text-sats-orange-500 tracking-tighter">{code}</span>
            </div>
            <button 
              onClick={copyCode} 
              className="shrink-0 text-sats-orange-500 hover:text-sats-orange-400 transition-colors bg-sats-orange-500/10 p-2 rounded-xl"
              title="Copy Code"
            >
              {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Quick Share Buttons */}
          <div className="flex items-center gap-3 lg:hidden">
  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">Quick Share</span>
  
  {/* X (Twitter) - Official Black */}
  <a href={xShareUrl} target="_blank" rel="noopener noreferrer" title="Share on X" className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white border border-[#333] hover:bg-[#111] hover:border-[#555] transition-all hover:-translate-y-0.5 shadow-sm">
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  </a>

  {/* WhatsApp - Official Green */}
  <a href={waShareUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all hover:-translate-y-0.5 shadow-sm">
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  </a>

  {/* Telegram - Official Blue (Cleaned up SVG) */}
  <a href={tgShareUrl} target="_blank" rel="noopener noreferrer" title="Share on Telegram" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2AABEE] text-white hover:bg-[#229ED9] transition-all hover:-translate-y-0.5 shadow-sm">
    <svg viewBox="0 0 32 32" className="w-[35px] h-[35px] fill-current pr-[1px] pb-[1px]">
      <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" />
    </svg>
  </a>

  {/* Share Anywhere - Generic Style */}
  <button
    type="button"
    onClick={shareAnywhere}
    title="Share Anywhere"
    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#111] border border-[#2a2a2a] text-gray-300 hover:border-sats-orange-500/50 hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
  >
    <Share2 className="w-4 h-4" />
  </button>
</div>

      </div>
    </div>
  );
}
