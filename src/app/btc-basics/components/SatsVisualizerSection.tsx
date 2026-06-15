'use client';

import React, { useState, useEffect } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function SatsVisualizerSection() {
  const [sats, setSats] = useState<number>(1000);
  const [btcPrice, setBtcPrice] = useState<number>(63000);
  const [inrPrice, setInrPrice] = useState<number>(5229000);

  // Derived calculations
  const btcFraction = (sats / 100_000_000).toFixed(8);
  const usdValue = (sats / 100_000_000) * btcPrice;
  const inrValue = (sats / 100_000_000) * inrPrice;

  // Bar width calculation (cap at 100%)
  const barWidth = Math.min((sats / 100_000_000) * 100, 100);

  const presets = [100, 1000, 10000, 25000, 100000, 1000000];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };

  const handleSatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setSats(val);
    } else if (e.target.value === '') {
      setSats(0);
    }
  };

  return (
    <section className="py-16 sm:py-24 relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center gap-3 mb-4">
          <span className="w-8 h-[1px] bg-sats-orange-500 opacity-50"></span>
          Make It Concrete
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 text-white">How big is a sat?</h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-12">"Sats" can feel abstract at first. Here's the simple truth: you don't need a whole bitcoin — you stack the smallest units, a few at a time.</p>
      </FadeUp>

      <div className="max-w-3xl mx-auto">
        <FadeUp delay={0.2}>
          <div className="bg-sats-black-900/40 backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl p-6 sm:p-10 text-center mb-6 shadow-[0_10px_30px_rgba(247,147,26,0.05)]">
            <div className="font-mono text-xl sm:text-3xl font-bold text-white leading-relaxed mb-3">
              1 <span className="text-sats-orange-500">BTC</span> = <span className="text-sats-orange-500 text-[1.25em]">100,000,000</span> sats
            </div>
            <div className="text-sm sm:text-base text-gray-400">
              One hundred million satoshis make a single bitcoin. Every sat is a real, divisible piece of Bitcoin.
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <label className="text-sm sm:text-base font-bold text-gray-300">I have</label>
              <input 
                type="number" 
                value={sats === 0 ? '' : sats}
                onChange={handleSatsChange}
                className="w-36 bg-sats-black-950 border border-sats-orange-500/40 focus:border-sats-orange-500 rounded-xl px-4 py-3 font-mono text-lg text-sats-orange-500 outline-none text-right transition-colors"
                min="0"
                step="1"
              />
              <label className="text-sm sm:text-base font-bold text-gray-300">sats</label>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => setSats(p)}
                  className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-bold border transition-all ${sats === p ? 'bg-sats-orange-500 border-sats-orange-500 text-black' : 'bg-sats-black-950 border-white/[0.08] text-gray-400 hover:border-sats-orange-500/50 hover:text-sats-orange-500'}`}
                >
                  {p.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-sats-black-950 border border-white/[0.04] rounded-xl p-5 text-center flex flex-col justify-center">
                <div className="font-mono text-[10px] sm:text-[11px] text-gray-500 tracking-widest uppercase mb-2">As a fraction of 1 BTC</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-white break-all">{btcFraction}</div>
              </div>
              <div className="bg-sats-black-950 border border-white/[0.04] rounded-xl p-5 text-center flex flex-col justify-center">
                <div className="font-mono text-[10px] sm:text-[11px] text-gray-500 tracking-widest uppercase mb-2">Approx. value @ ${Math.round(btcPrice / 1000)}k</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-sats-orange-500 break-all">≈ ${formatNumber(usdValue)}</div>
              </div>
              <div className="bg-sats-black-950 border border-white/[0.04] rounded-xl p-5 text-center flex flex-col justify-center">
                <div className="font-mono text-[10px] sm:text-[11px] text-gray-500 tracking-widest uppercase mb-2">Approx. value @ ₹{Math.round(inrPrice / 100000)}L</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-sats-orange-500 break-all">≈ ₹{formatNumber(inrValue)}</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between font-mono text-[10px] sm:text-[11px] text-gray-500 mb-2">
                <span>0</span>
                <span>1 BTC = 100,000,000 sats</span>
              </div>
              <div className="h-3 sm:h-4 w-full bg-sats-black-950 border border-white/[0.04] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sats-orange-400 to-sats-orange-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(barWidth, 0.5)}%` }} // Minimum width for visibility
                ></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-white/[0.04]">
              <div className="flex items-center gap-3">
                <label className="text-xs sm:text-sm font-semibold text-gray-400">BTC price ($)</label>
                <input 
                  type="number" 
                  value={btcPrice} 
                  onChange={e => setBtcPrice(Number(e.target.value) || 0)}
                  className="w-28 bg-sats-black-950 border border-white/[0.1] focus:border-sats-orange-500 rounded-lg px-3 py-2 font-mono text-sm text-white outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs sm:text-sm font-semibold text-gray-400">BTC price (₹)</label>
                <input 
                  type="number" 
                  value={inrPrice} 
                  onChange={e => setInrPrice(Number(e.target.value) || 0)}
                  className="w-32 bg-sats-black-950 border border-white/[0.1] focus:border-sats-orange-500 rounded-lg px-3 py-2 font-mono text-sm text-white outline-none"
                />
              </div>
            </div>

          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="mt-6 text-center text-xs text-gray-500 italic leading-relaxed px-4">
            USD and INR figures are illustrations at the prices you enter — edit either field to match the live rate. Bitcoin's price changes constantly and past prices never predict future ones. This is educational, not financial advice.
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
