'use client';

import React, { useState } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

// Founder Object Interface
interface FounderObject {
  name: string;
  country?: string;
  flag?: string;
}

// Static array of Founder objects
// Easily add/edit objects here to add more Founders to the cohort.
const FOUNDERS_LIST: FounderObject[] = [
  { name: 'Wasim ' },
  { name: 'Sumit Dwivedi'},
  { name: 'Saksham Arya'  },
];

export const FoundersCohort = () => {
  const [page, setPage] = useState(1);
  const totalSpots = 1000;
  const perPage = 100;

  const totalPages = Math.ceil(FOUNDERS_LIST.length / perPage);
  const startIndex = (page - 1) * perPage;
  const currentFounders = FOUNDERS_LIST.slice(startIndex, startIndex + perPage);

  // Format founder numbers to be 3 digits (e.g. #001)
  const formatRank = (num: number) => {
    return `#${String(num).padStart(3, '0')}`;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll smoothly to cohort header
    const elem = document.getElementById('cohort-board');
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="cohort-board" className="py-16 max-w-5xl mx-auto px-4 relative">
      {/* Custom spinning animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes medalSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-medal-spin {
          animation: medalSpin 16s linear infinite;
        }
      `}} />

      {/* Global Defs SVG (rendered once to avoid ID clashes and reduce DOM size) */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <radialGradient id="fmDisc" cx="38%" cy="32%" r="74%">
            <stop offset="0%" stopColor="#ffd271" />
            <stop offset="48%" stopColor="#f7931a" />
            <stop offset="100%" stopColor="#b9660a" />
          </radialGradient>
          <linearGradient id="fmRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe08a" />
            <stop offset="100%" stopColor="#a85c06" />
          </linearGradient>
          <linearGradient id="fmStar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3cf" />
            <stop offset="100%" stopColor="#f7b733" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
              Founding Members
            </div>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-none">
              The founding cohort
            </h2>
          </FadeUp>
        </div>
      </div>

      <FadeUp delay={0.3}>
        <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed mb-10">
          Every Founder earns a place in the cohort with their own Founder medallion. As members join, they fill the board — 100 per page, up to all 1,000.
        </p>
      </FadeUp>

      {/* Cohort Card Box */}
      <FadeUp delay={0.4}>
        <div className="bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl p-5 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
          
          {/* Header Stats */}
          <div className="flex justify-between items-center border-b border-sats-orange-500/10 pb-5 mb-6">
            <span className="font-mono text-xs sm:text-sm tracking-wider uppercase text-gray-300 font-semibold">
              Cohort Board
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-sats-orange-500">
              {FOUNDERS_LIST.length} / {totalSpots}
            </span>
          </div>

          {FOUNDERS_LIST.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              No Founders yet — the board fills as members join. Be the first to claim a spot.
            </div>
          ) : (
            <>
              {/* Cards Grid: Changed to 3 columns on large screens to accommodate the horizontal layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentFounders.map((founder, index) => {
                  const actualRank = startIndex + index + 1;
                  const initialLetter = founder.name.charAt(0);
                  
                  return (
                    <div 
                      key={actualRank}
                      className="bg-sats-black-950/60 border border-sats-orange-500/5 hover:border-sats-orange-500/20 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:bg-sats-black-950/80 group"
                    >
                      {/* Left Side: Circular SVG Medallion with Initial */}
                      <div className="w-16 h-16 flex-shrink-0 relative flex items-center justify-center">
                        <svg viewBox="0 0 80 84" fill="none" className="w-full h-full drop-shadow-[0_3px_8px_rgba(247,147,26,0.12)] group-hover:drop-shadow-[0_4px_12px_rgba(247,147,26,0.25)] transition-all duration-300">
                          {/* rotating notched outer ring */}
                          <g className="animate-medal-spin" style={{ transformOrigin: '40px 44px' }}>
                            <circle 
                              cx="40" 
                              cy="44" 
                              r="33" 
                              fill="none" 
                              stroke="url(#fmRim)" 
                              strokeWidth="2.5" 
                              strokeDasharray="1.5 4.6" 
                              strokeLinecap="round" 
                              opacity="0.8"
                            />
                          </g>
                          
                          {/* laurel sprigs */}
                          <path 
                            d="M21 60c-6-4-8-11-7-18 4 2 7 6 8 11M59 60c6-4 8-11 7-18-4 2-7 6-8 11" 
                            fill="none" 
                            stroke="url(#fmRim)" 
                            strokeWidth="1.8" 
                            strokeLinecap="round" 
                            opacity="0.65"
                          />
                          
                          {/* medallion disc */}
                          <circle cx="40" cy="44" r="26" fill="url(#fmDisc)" />
                          <circle cx="40" cy="44" r="26" fill="none" stroke="#fff0cc" strokeWidth="1.2" opacity="0.5" />
                          <circle cx="40" cy="44" r="20.5" fill="none" stroke="#5a2f02" strokeWidth="1.2" opacity="0.25" />
                          
                          {/* Personal Letter in Medallion Disc */}
                          <text 
                            x="40" 
                            y="50.5" 
                            textAnchor="middle" 
                            fill="#ffffff" 
                            fontSize="19" 
                            fontWeight="900" 
                            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                            className="select-none font-sans drop-shadow-[0_1.5px_3px_rgba(90,47,2,0.5)]"
                          >
                            {initialLetter}
                          </text>

                          {/* top star */}
                          <g transform="translate(40 9)">
                            <path 
                              d="M0 -6.5 1.8 -1.8 6.5 -1.5 2.8 1.4 3.9 6 0 3.2 -3.9 6 -2.8 1.4 -6.5 -1.5 -1.8 -1.8Z" 
                              fill="url(#fmStar)" 
                              stroke="#a85c06" 
                              strokeWidth="0.5" 
                              strokeLinejoin="round"
                            />
                            <circle cx="0" cy="0" r="1.2" fill="#fff" opacity="0.8" />
                          </g>
                        </svg>
                      </div>

                      {/* Right Side: Info Card Wrapper */}
                      <div className="flex flex-col text-left overflow-hidden">
                        <h4 className="font-mono text-sm font-bold text-white mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                          {founder.name}
                        </h4>
                        
                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                          {founder.flag ? (
                            <>
                              <span>{founder.flag}</span>
                              <span className="font-medium">{founder.country}</span>
                            </>
                          ) : (
                            <span className="font-medium">Founding Member</span>
                          )}
                        </div>

                        <div className="font-mono text-xs font-bold text-sats-orange-500 tracking-wider">
                          {formatRank(actualRank)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Pager */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 border-t border-sats-orange-500/10 mt-8 pt-6">
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="font-mono text-xs font-bold text-gray-300 bg-sats-black-950 border border-sats-orange-500/10 hover:border-sats-orange-500/30 rounded-lg px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    ‹ Prev
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === page;
                      return (
                        <button 
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`font-mono text-xs font-bold w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-150 ${
                            isActive 
                              ? 'bg-sats-orange-500 text-black border-sats-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' 
                              : 'bg-sats-black-950 text-gray-300 border-sats-orange-500/10 hover:border-sats-orange-500/30'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="font-mono text-xs font-bold text-gray-300 bg-sats-black-950 border border-sats-orange-500/10 hover:border-sats-orange-500/30 rounded-lg px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </FadeUp>
    </section>
  );
};
