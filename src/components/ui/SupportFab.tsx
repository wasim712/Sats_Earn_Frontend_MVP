'use client';

import { useState, useRef, useEffect } from 'react';

export function SupportFab() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[1500] flex flex-col items-end gap-3 transition-all duration-300 md:bottom-8 md:right-8"
    >
      {/* Floating Action Menu */}
      <div
        className={`flex flex-col gap-2.5 items-end transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 translate-y-0 visible'
            : 'scale-90 opacity-0 translate-y-4 invisible absolute bottom-16'
        }`}
      >
        {/* Email Link */}
        <a
          href="mailto:support@satsearn.app"
          className="group flex items-center gap-3 bg-sats-black-900/90 backdrop-blur-md border border-sats-orange-500/20 rounded-xl px-4 py-2.5 no-underline text-[#f0f0f0] text-[13px] font-bold whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-sats-orange-500 hover:text-sats-orange-500 hover:shadow-[0_0_15px_rgba(238,139,18,0.2)] hover:-translate-y-0.5"
        >
          <span className="text-sats-orange-500 group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m2 7 10 6 10-6"/>
            </svg>
          </span>
          Send an Email
        </a>

        {/* Telegram Link */}
        <a
          href="https://t.me/satsearnapp"
          className="group flex items-center gap-3 bg-sats-black-900/90 backdrop-blur-md border border-sats-orange-500/20 rounded-xl px-4 py-2.5 no-underline text-[#f0f0f0] text-[13px] font-bold whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#24A1DE]/40 hover:text-[#24A1DE] hover:shadow-[0_0_15px_rgba(36,161,222,0.2)] hover:-translate-y-0.5"
        >
          <span className="text-sats-orange-500 group-hover:text-[#24A1DE] group-hover:scale-110 transition-all duration-300">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </span>
          Telegram — Fastest
        </a>

        {/* Discord Link */}
        <a
          href="https://discord.gg/VX4cB2xTnZ"
          className="group flex items-center gap-3 bg-sats-black-900/90 backdrop-blur-md border border-sats-orange-500/20 rounded-xl px-4 py-2.5 no-underline text-[#f0f0f0] text-[13px] font-bold whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#5865F2]/40 hover:text-[#5865F2] hover:shadow-[0_0_15px_rgba(88,101,242,0.2)] hover:-translate-y-0.5"
        >
          <span className="text-sats-orange-500 group-hover:text-[#5865F2] group-hover:scale-110 transition-all duration-300">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </span>
          Discord Community
        </a>
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact Support"
        className={`relative w-14 h-14 flex items-center justify-center rounded-full border-none cursor-pointer transition-all duration-300 outline-none hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-sats-black-900 border border-sats-orange-500 shadow-[0_0_15px_rgba(238,139,18,0.25)]'
            : 'bg-sats-orange-500 shadow-[0_0_25px_rgba(238,139,18,0.5)] hover:shadow-[0_0_35px_rgba(238,139,18,0.7)]'
        }`}
      >
        <span className="absolute inset-0 rounded-full animate-[ping_2.4s_ease-out_infinite] bg-sats-orange-500/30 z-0 pointer-events-none"></span>
        <div className="relative w-5 h-5 z-10 flex items-center justify-center">
          <svg
            className={`absolute w-5 h-5 transition-all duration-300 ${
              isOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
            }`}
            viewBox="0 0 24 24"
            fill="#000"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
          <svg
            className={`absolute w-5 h-5 transition-all duration-300 ${
              isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'
            }`}
            viewBox="0 0 24 24"
            fill={isOpen ? '#EE8B12' : '#000'}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </div>
      </button>
    </div>
  );
}
