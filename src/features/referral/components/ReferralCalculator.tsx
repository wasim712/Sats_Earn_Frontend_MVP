'use client';
import React, { useState, useMemo } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralCalculator = () => {
  const [rate, setRate] = useState(30);
  const [refs, setRefs] = useState(120);
  const [acts, setActs] = useState(300);
  const [base, setBase] = useState(10);
  const [btc, setBtc] = useState(63000);

  const { monthlySats, monthlyFiat, yearlySats, yearlyFiat } = useMemo(() => {
    const perAction = base * (rate / 100);
    const monthly = perAction * acts * refs;
    const yearly = monthly * 12;

    const formatFiat = (sats: number) => {
      const usd = (sats / 100000000) * btc;
      return `≈ $${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return {
      monthlySats: monthly,
      monthlyFiat: formatFiat(monthly),
      yearlySats: yearly,
      yearlyFiat: formatFiat(yearly)
    };
  }, [rate, refs, acts, base, btc]);

  return (
    <>
      <section id="calculator" className="px-4 pb-16 sm:pb-24 border-t border-white/5 pt-16 sm:pt-24">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-10 sm:mb-14">
            <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              Commission Calculator
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              See what you could <span className="text-sats-orange-500">earn</span>
            </h2>
            <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Paid straight to your Lightning wallet. Uncapped on paid tiers. Play with the numbers below to see the math.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="bg-sats-black-800 border border-sats-orange-500/20 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.05)]">
              {/* Calc Header */}
              <div className="p-5 sm:p-6 border-b border-white/10 bg-sats-orange-500/5 flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-mono text-base font-bold text-white tracking-wide">ESTIMATE EARNINGS</h3>
                <div className="font-mono text-xs text-sats-orange-500 font-bold px-3 py-1 bg-sats-orange-500/10 rounded-full border border-sats-orange-500/20">
                  Live simulation
                </div>
              </div>

              {/* Calc Body */}
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Inputs */}
                <div className="p-6 sm:p-8 lg:border-r border-white/10 flex flex-col gap-6">
                  
                  {/* Tiers */}
                  <div>
                    <label className="block font-mono text-xs text-gray-400 font-bold tracking-wider uppercase mb-3">
                      Your tier level
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: 'Free', val: 5 },
                        { label: 'Plat', val: 10 },
                        { label: 'Ruby', val: 15 },
                        { label: 'Crwn', val: 20 },
                        { label: 'Fndr', val: 30 }
                      ].map((t) => (
                        <button
                          key={t.val}
                          onClick={() => setRate(t.val)}
                          className={`font-mono text-xs font-bold py-2 rounded-lg border transition-all ${
                            rate === t.val 
                              ? 'bg-sats-orange-500 border-sats-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                              : 'bg-sats-black-900 border-white/10 text-gray-400 hover:border-sats-orange-500/30'
                          }`}
                        >
                          {t.label}
                          <span className="block text-[10px] mt-0.5 opacity-80">{t.val}%</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Refs */}
                  <div>
                    <label className="block font-mono text-xs text-gray-400 font-bold tracking-wider uppercase mb-2">
                      Active referrals in your network
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={refs}
                      onChange={(e) => setRefs(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-sats-black-900 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-sats-orange-500 transition-colors"
                    />
                  </div>

                  {/* Acts */}
                  <div>
                    <label className="block font-mono text-xs text-gray-400 font-bold tracking-wider uppercase mb-2">
                      Commissionable actions per referral / mo
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={acts}
                      onChange={(e) => setActs(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-sats-black-900 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-sats-orange-500 transition-colors"
                    />
                  </div>

                  {/* Base Reward */}
                  <div>
                    <label className="block font-mono text-xs text-gray-400 font-bold tracking-wider uppercase mb-2">
                      Base reward per action <span className="text-gray-400 normal-case tracking-normal">(average sats)</span>
                    </label>
                    <div className="flex relative">
                      <input 
                        type="number" 
                        min="0"
                        value={base}
                        onChange={(e) => setBase(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-sats-black-900 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-sats-orange-500 transition-colors"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-400">sats/action</div>
                    </div>
                  </div>

                  {/* BTC Price */}
                  <div>
                    <label className="block font-mono text-xs text-gray-400 font-bold tracking-wider uppercase mb-2">
                      BTC price <span className="text-gray-400 normal-case tracking-normal">(for fiat estimate)</span>
                    </label>
                    <div className="flex relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-gray-400">$</div>
                      <input 
                        type="number" 
                        min="0"
                        step="100"
                        value={btc}
                        onChange={(e) => setBtc(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-sats-black-900 border border-white/10 rounded-xl pl-8 pr-12 py-3 font-mono text-sm text-white focus:outline-none focus:border-sats-orange-500 transition-colors"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-400">USD</div>
                    </div>
                  </div>

                </div>

                {/* Outputs */}
                <div className="p-6 sm:p-8 bg-sats-black-900/50 flex flex-col justify-center border-t lg:border-t-0 border-white/10">
                  <div className="mb-8">
                    <div className="font-mono text-xs text-gray-400 tracking-wider uppercase font-bold mb-2">Your commission rate</div>
                    <div className="font-mono text-3xl font-black text-sats-orange-500 leading-none">
                      {rate}<span className="text-xl text-gray-400 font-normal">%</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/10 mb-8"></div>

                  <div className="mb-8">
                    <div className="font-mono text-xs text-gray-400 tracking-wider uppercase font-bold mb-3">Estimated monthly commission</div>
                    <div className="bg-sats-orange-500/10 border border-sats-orange-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                      <div className="font-mono text-4xl sm:text-5xl font-black text-sats-orange-500 leading-none mb-2 break-words">
                        {monthlySats.toLocaleString()} <span className="text-lg text-gray-400 font-normal">sats</span>
                      </div>
                      <div className="font-mono text-sm text-green-400">{monthlyFiat} / month</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-xs text-gray-400 tracking-wider uppercase font-bold mb-2">Projected over 12 months</div>
                    <div className="font-mono text-2xl font-black text-white leading-none mb-1 break-words">
                      {yearlySats.toLocaleString()} <span className="text-base text-gray-400 font-normal">sats</span>
                    </div>
                    <div className="font-mono text-xs text-green-400">{yearlyFiat} / year</div>
                  </div>
                </div>
              </div>

              {/* Calc Footer */}
              <div className="p-5 sm:p-6 border-t border-white/10 bg-sats-black-900">
                <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="text-green-500 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  </div>
                  <p className="text-[13px] text-gray-300 leading-relaxed m-0">
                    <strong className="text-white">Is this realistic?</strong> The numbers move entirely with what you enter — referrals, how active they are, and the real base reward. it&apos;s a transparent estimate of the math, <strong className="text-white">not a promise of earnings</strong>. Set the inputs to figures you actually expect and the result updates instantly.
                  </p>
                </div>
              </div>

            </div>
          </FadeUp>
        </div>
      </section>

      
    </>
  );
};
