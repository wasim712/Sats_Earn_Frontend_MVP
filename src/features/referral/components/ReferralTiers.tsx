import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralTiers = () => {
  return (
    <>
      {/* FREE VS PAID */}
      <section id="tiers" className="px-4 py-16 sm:py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <div className="w-6 h-px bg-sats-orange-500/50"></div>
              Free vs Paid
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
              Why paid tiers earn more
            </h2>
            <p className="text-base text-gray-300 max-w-2xl leading-relaxed mt-4">
              Everyone can refer. Paid tiers simply earn a higher rate with no ceiling.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <FadeUp>
              <div className="bg-sats-black-800 border border-white/10 rounded-3xl p-8 sm:p-10 h-full transition-all hover:-translate-y-1 hover:border-white/20">
                <div className="font-mono text-[11px] tracking-wider uppercase text-gray-400 font-bold mb-4">
                  Free tiers · Basic–Gold
                </div>
                <div className="font-mono text-5xl sm:text-6xl font-black text-sats-orange-500 leading-none mb-8">
                  5%
                </div>
                <ul className="flex flex-col gap-4">
                  <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500/70 shrink-0 mt-2"></div>
                    Flat 5% commission on the base reward
                  </li>
                  <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500/70 shrink-0 mt-2"></div>
                    Cumulative lifetime caps that rise as you auto-upgrade: Basic 20 referrals / 2,000 sats, up to Gold 100 / 10,000 sats
                  </li>
                  <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500/70 shrink-0 mt-2"></div>
                    Once you hit the cap, commission stops
                  </li>
                  <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500/70 shrink-0 mt-2"></div>
                    Free forever — a solid way to start
                  </li>
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="bg-gradient-to-br from-sats-orange-500/15 to-sats-orange-500/5 border border-sats-orange-500/30 rounded-3xl p-8 sm:p-10 h-full transition-all hover:-translate-y-1 hover:border-sats-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(249,115,22,0.1),transparent_70%)] pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="font-mono text-[11px] tracking-wider uppercase text-sats-orange-500 font-bold mb-4">
                    Paid tiers · Platinum–Founders
                  </div>
                  <div className="font-mono text-5xl sm:text-6xl font-black text-sats-orange-500 leading-none mb-8">
                    10–30%
                  </div>
                  <ul className="flex flex-col gap-4">
                    <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                      2× to 6× the free-tier rate (10% Platinum → 30% Founders)
                    </li>
                    <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                      <strong className="text-white">Uncapped</strong> — unlimited referrals, no earnings ceiling
                    </li>
                    <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                      Commission keeps paying as long as referrals stay active
                    </li>
                    <li className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                      Founders also earn from the Rotation on unattributed signups
                    </li>
                  </ul>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* WHAT EARNS */}
      <section className="px-4 py-8 pb-16 sm:pb-24 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <div className="w-6 h-px bg-sats-orange-500/50"></div>
              What Counts
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              What earns commission
            </h2>
            <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
              Commission is paid on your referrals' commissionable activity. Some one-time bonuses and milestone rewards are not commissionable.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Yes */}
            <FadeUp>
              <div className="bg-sats-black-800 border border-white/10 border-l-[4px] border-l-green-500 rounded-2xl p-6 sm:p-8 h-full">
                <h4 className="font-mono text-sm sm:text-base font-bold tracking-wide text-green-500 flex items-center gap-2 mb-6">
                  ✓ Earns commission
                </h4>
                <ul className="flex flex-col gap-4">
                  {[
                    "Daily tasks & social tasks your referrals complete",
                    "Bitcoin quizzes and learning activities",
                    "Mini-game XP-qualifying activity (where applicable)",
                    "Ongoing commissionable actions, for as long as referrals stay active"
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-300 leading-relaxed">
                      <div className="font-mono font-bold text-green-500 shrink-0">✓</div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* No */}
            <FadeUp delay={0.1}>
              <div className="bg-sats-black-800 border border-white/10 border-l-[4px] border-l-gray-600 rounded-2xl p-6 sm:p-8 h-full">
                <h4 className="font-mono text-sm sm:text-base font-bold tracking-wide text-gray-400 flex items-center gap-2 mb-6">
                  — Not commissionable
                </h4>
                <ul className="flex flex-col gap-4">
                  {[
                    "Streak milestone awards (one-time, lifetime)",
                    "Welcome / signup bonuses",
                    "Goodwill or platform courtesy credits",
                    "The referral's own tier subscription fee"
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm sm:text-[15px] text-gray-400 leading-relaxed">
                      <div className="font-mono font-bold text-gray-600 shrink-0">—</div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
};
