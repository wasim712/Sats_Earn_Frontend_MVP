import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralMechanics = () => {
  return (
    <>
      {/* HOW IT WORKS */}
      <section className="px-4 py-16 sm:py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <div className="w-6 h-px bg-sats-orange-500/50 hidden sm:block"></div>
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              Three simple steps
            </h2>
            <p className="text-base text-gray-300 max-w-2xl leading-relaxed mx-auto sm:mx-0">
              No cost to start, no purchase required. Invite people, they get active, you earn.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeUp>
              <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 sm:p-8 h-full transition-transform hover:-translate-y-1 hover:border-sats-orange-500/30">
                <div className="w-10 h-10 rounded-xl bg-sats-orange-500 flex items-center justify-center font-mono font-bold text-black mb-6">
                  1
                </div>
                <h3 className="font-mono text-base font-bold text-white tracking-wide mb-3">Share your link</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Every account gets a unique referral link. Share it on social, in your content, or with anyone curious about earning Bitcoin — no prior knowledge needed.
                </p>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.1}>
              <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 sm:p-8 h-full transition-transform hover:-translate-y-1 hover:border-sats-orange-500/30">
                <div className="w-10 h-10 rounded-xl bg-sats-orange-500 flex items-center justify-center font-mono font-bold text-black mb-6">
                  2
                </div>
                <h3 className="font-mono text-base font-bold text-white tracking-wide mb-3">They join & earn</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  When someone signs up through your link and starts completing tasks, quizzes, and other earning methods, they're an active referral.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 sm:p-8 h-full transition-transform hover:-translate-y-1 hover:border-sats-orange-500/30">
                <div className="w-10 h-10 rounded-xl bg-sats-orange-500 flex items-center justify-center font-mono font-bold text-black mb-6">
                  3
                </div>
                <h3 className="font-mono text-base font-bold text-white tracking-wide mb-3">You earn commission</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  You earn a percentage of the platform's base reward for your referrals' commissionable activity — paid in sats, straight to your balance.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* HOW SHARING WORKS (THE MECHANICS) */}
      <section className="px-4 py-8 pb-16 sm:pb-24 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <div className="w-6 h-px bg-sats-orange-500/50 hidden sm:block"></div>
              The Mechanics
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              How sharing actually works
            </h2>
            <p className="text-base text-gray-300 max-w-2xl leading-relaxed mx-auto sm:mx-0">
              A bit more detail on the link, attribution, and when commission lands.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
            <FadeUp>
              <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-sats-orange-500 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-white mb-1.5">One unique link</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed">Your dashboard gives you a single referral link. There's nothing to configure — it's ready the moment you have an account.</p>
                </div>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.1}>
              <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-sats-orange-500 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m19 8 2 2 4-4"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-white mb-1.5">Automatic attribution</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed">When someone signs up through your link, they're permanently linked to you as their referrer. No codes to enter, no follow-up needed.</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-sats-orange-500 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-white mb-1.5">Earn on activity, not signups</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed">Commission accrues as your referrals complete commissionable actions — not just for joining. Active referrals = ongoing sats.</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-sats-orange-500 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-white mb-1.5">Then it matures, like all sats</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed">Each commission entry verifies for 24 hours, locks for a 15-day maturity period, then becomes available to withdraw — the same flow as everything you earn.</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* FLOW STRIP */}
          <FadeUp delay={0.4}>
            <div className="bg-sats-black-900 border border-white/10 rounded-xl p-5 flex flex-wrap items-center gap-3 sm:gap-5 justify-center sm:justify-start">
              <div className="flex items-center gap-2 text-[13px] text-gray-300">
                <span className="text-sats-orange-500 font-mono font-bold">Earned</span>
              </div>
              <div className="text-gray-500">→</div>
              <div className="flex items-center gap-2 text-[13px] text-gray-300">
                <span className="text-sats-orange-500 font-mono font-bold">Pending</span> 24h verify
              </div>
              <div className="text-gray-500">→</div>
              <div className="flex items-center gap-2 text-[13px] text-gray-300">
                <span className="text-sats-orange-500 font-mono font-bold">Maturing</span> 15-day lock
              </div>
              <div className="text-gray-500">→</div>
              <div className="flex items-center gap-2 text-[13px] text-gray-300">
                <span className="text-sats-orange-500 font-mono font-bold">Available</span> to withdraw
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* THE FLOW (NETWORK DIAGRAM) */}
      <section id="network" className="px-4 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <div className="w-6 h-px bg-sats-orange-500/50 hidden sm:block"></div>
              The Flow
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              How the sats reach you
            </h2>
            <p className="text-base text-gray-300 max-w-2xl leading-relaxed mx-auto sm:mx-0">
              From your link to your wallet — the whole loop in one picture.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="bg-sats-black-800 border border-sats-orange-500/20 rounded-3xl p-8 sm:p-12 mb-16 shadow-[0_0_50px_rgba(249,115,22,0.03)]">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 relative">
                <div className="bg-gradient-to-b from-sats-orange-500/15 to-sats-orange-500/5 border border-sats-orange-500/30 rounded-2xl p-5 text-center flex-1 w-full max-w-[200px]">
                  <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-sats-orange-500 mb-3 mx-auto shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
                  </div>
                  <div className="font-bold text-white text-[15px] mb-1">You</div>
                  <div className="text-xs text-gray-400 leading-relaxed">Share your unique link</div>
                </div>

                <div className="text-sats-orange-500 text-3xl rotate-90 sm:rotate-0">→</div>

                <div className="bg-sats-black-900 border border-white/10 rounded-2xl p-5 text-center flex-1 w-full max-w-[200px]">
                  <div className="w-12 h-12 rounded-xl bg-sats-black-800 border border-white/20 flex items-center justify-center text-sats-orange-500 mb-3 mx-auto">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="9" cy="8" r="3.2"/><path d="M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/><path d="M18 8.5l1.8 1.8L23 7"/></svg>
                  </div>
                  <div className="font-bold text-white text-[15px] mb-1">Your referrals</div>
                  <div className="text-xs text-gray-400 leading-relaxed">Join & get active</div>
                </div>

                <div className="text-sats-orange-500 text-3xl rotate-90 sm:rotate-0">→</div>

                <div className="bg-gradient-to-b from-green-500/10 to-green-500/5 border border-green-500/30 rounded-2xl p-5 text-center flex-1 w-full max-w-[200px]">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 mb-3 mx-auto shadow-[0_0_15px_rgba(61,255,170,0.15)]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z"/></svg>
                  </div>
                  <div className="font-bold text-white text-[15px] mb-1">Commission sats</div>
                  <div className="text-xs text-gray-400 leading-relaxed">Land in your balance</div>
                </div>
              </div>
              <p className="text-center text-[13px] text-gray-400 mt-8 max-w-2xl mx-auto leading-relaxed">
                Every commissionable action your referrals complete pays you a <strong className="text-white">fixed share of the admin base reward</strong> — automatically, over Lightning. The more active your network, the more you stack.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
};
