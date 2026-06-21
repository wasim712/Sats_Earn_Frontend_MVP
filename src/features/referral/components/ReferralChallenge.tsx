'use client';
import React, { useState, useMemo } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralChallenge = () => {
  const [monthly, setMonthly] = useState(30000);
  const [growth, setGrowth] = useState(10);

  const { bars, totalSats } = useMemo(() => {
    let currentPace = monthly;
    let cumulative = 0;
    const yearlyTotals = [];

    for (let y = 1; y <= 10; y++) {
      const yearSats = currentPace * 12;
      cumulative += yearSats;
      yearlyTotals.push(cumulative);
      currentPace = currentPace * (1 + growth / 100);
    }

    const max = yearlyTotals[9] || 1;
    const generatedBars = yearlyTotals.map((val, i) => ({
      year: i + 1,
      heightPercent: Math.max(2, (val / max) * 100),
    }));

    return {
      bars: generatedBars,
      totalSats: yearlyTotals[9]
    };
  }, [monthly, growth]);

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <FadeUp className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <div className="w-6 h-px bg-sats-orange-500/50"></div>
            The 10-Year Challenge
          </div>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white mb-4">
            Stack consistently, for a decade
          </h2>
          <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
            Not a payout forecast — a consistency challenge. The faucet generation's edge was just <em className="text-white italic">showing up</em>. See how sats add up if you keep stacking.
          </p>
        </FadeUp>

        <FadeUp>
          <div className="bg-sats-black-800 border border-sats-orange-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.03)]">
            <div className="p-6 sm:p-8 border-b border-white/10 bg-sats-orange-500/5">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Your consistency, in sats</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                Set a monthly stacking pace and watch it compound through habit over ten years. This counts sats accumulated only — it makes no claim about what those sats will be worth in future.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                {/* Monthly Pace Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-wider font-bold">
                      Sats you stack per month
                    </label>
                    <span className="font-mono text-sm font-bold text-sats-orange-500">
                      {monthly.toLocaleString()}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="200000" 
                    step="1000" 
                    value={monthly} 
                    onChange={(e) => setMonthly(Number(e.target.value))}
                    className="w-full h-1.5 bg-sats-black-900 rounded-full appearance-none cursor-pointer accent-sats-orange-500"
                  />
                </div>

                {/* Growth Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-wider font-bold">
                      Yearly growth in your pace
                    </label>
                    <span className="font-mono text-sm font-bold text-sats-orange-500">
                      {growth}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    step="1" 
                    value={growth} 
                    onChange={(e) => setGrowth(Number(e.target.value))}
                    className="w-full h-1.5 bg-sats-black-900 rounded-full appearance-none cursor-pointer accent-sats-orange-500"
                  />
                </div>
              </div>

              {/* Chart */}
              <div className="flex items-end gap-1.5 sm:gap-2 h-48 sm:h-56 pt-4 mb-8">
                {bars.map((bar) => (
                  <div key={bar.year} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-sats-orange-500 to-[#ffcc00] rounded-t-md transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      style={{ height: `${bar.heightPercent}%`, minHeight: '4px' }}
                    ></div>
                    <div className="font-mono text-[10px] text-gray-500">Y{bar.year}</div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-sats-orange-500/10 border border-sats-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4">
                <div className="flex-1">
                  <div className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-sats-orange-500 font-bold mb-2">
                    Total stacked over 10 years
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-white leading-none truncate">
                    {totalSats.toLocaleString()} <span className="text-sm sm:text-base text-gray-400 font-normal">sats</span>
                  </div>
                </div>
                <div className="w-full sm:w-px h-px sm:h-12 bg-sats-orange-500/30 sm:mx-4"></div>
                <div className="flex-1 sm:text-right">
                  <div className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-sats-orange-500 font-bold mb-2">
                    That's roughly
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-white leading-none truncate">
                    {(totalSats / 100000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} <span className="text-sm sm:text-base text-gray-400 font-normal">BTC</span>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="px-6 sm:px-8 py-4 border-t border-white/10 bg-sats-black-900/50 text-xs text-gray-500 italic">
              Estimate only — not a forecast of future value. Based purely on mathematical accumulation.
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
