'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export const ReferralContactFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-4 right-4 sm:bottom-7 sm:right-7 z-[1500] flex flex-col items-end gap-3"
    >
      {/* Tray */}
      <div 
        className={`flex flex-col gap-2 items-end origin-bottom transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none translate-y-4'}`}
      >
        <Link 
          href="/contact" 
          className="flex items-center gap-2.5 bg-sats-black-800 border border-white/10 hover:border-sats-orange-500 hover:text-sats-orange-500 text-white rounded-xl px-4 py-2.5 text-[13px] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors whitespace-nowrap"
        >
          <span>📬</span> Send a Message
        </Link>
        <a 
          href="https://t.me/satsearn" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-sats-black-800 border border-white/10 hover:border-sats-orange-500 hover:text-sats-orange-500 text-white rounded-xl px-4 py-2.5 text-[13px] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors whitespace-nowrap"
        >
          <span className="text-sats-orange-500">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </span> 
          Telegram — Fastest
        </a>
        <a 
          href="https://discord.gg/satsearn" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-sats-black-800 border border-white/10 hover:border-sats-orange-500 hover:text-sats-orange-500 text-white rounded-xl px-4 py-2.5 text-[13px] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors whitespace-nowrap"
        >
          <span className="text-sats-orange-500">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          </span> 
          Discord Community
        </a>
      </div>

      {/* Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-[0_0_22px_rgba(249,115,22,0.55)] relative ${isOpen ? 'bg-sats-black-800 border border-sats-orange-500 text-sats-orange-500 rotate-90' : 'bg-sats-orange-500 text-black border border-transparent'}`}
        aria-label="Contact Support"
      >
        <span className="absolute inset-0 rounded-full shadow-[0_0_0_0_rgba(249,115,22,0.5)] animate-[fab-pulse_2.4s_ease-out_infinite] pointer-events-none"></span>
        
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        )}
      </button>

      <style jsx global>{`
        @keyframes fab-pulse {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.5); }
          70% { box-shadow: 0 0 0 14px rgba(249, 115, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
      `}</style>
    </div>
  );
};
