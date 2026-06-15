'use client';

import React from 'react';

export function MarqueeSection() {
  const items = ['INSTANT LIGHTNING', 'ANY WALLET', 'REAL SATS'];
  
  // Duplicate for smooth seamless loop
  const repeatedItems = [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="relative z-10 overflow-hidden bg-sats-orange-500/10 border-y border-sats-orange-500/20 py-3 sm:py-4">
        <div className="flex w-max">
          <div 
            className="flex whitespace-nowrap"
            style={{ animation: 'scroll-left 30s linear infinite' }}
          >
            {repeatedItems.map((text, i) => (
              <React.Fragment key={i}>
                <span className="font-mono font-bold text-[14px] sm:text-[15px] tracking-[2px] text-sats-orange-500 uppercase mx-3 sm:mx-4">
                  {text}
                </span>
                <span className="text-sats-orange-500 opacity-50 font-bold mx-2">·</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
