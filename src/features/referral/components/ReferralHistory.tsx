import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralHistory = () => {
  return (
    <>
      {/* HISTORY CARDS */}
      <section className="px-4 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <div className="w-6 h-px bg-sats-orange-500/50"></div>
              A Bit of History
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
              It started with a faucet
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {/* 2010 Faucet */}
            <FadeUp>
              <div className="flex flex-col h-full bg-sats-black-800 border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all rounded-2xl p-6 sm:p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-xl text-sats-orange-500">
                    💧
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-sats-orange-500 uppercase tracking-wider mb-0.5">June 2010</div>
                    <div className="text-base font-bold text-white leading-tight">The Genesis Faucet</div>
                  </div>
                </div>
                <ul className="flex-1 flex flex-col gap-2.5 mb-5">
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Developer Gavin Andresen launched the first Bitcoin faucet.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Solve a captcha, paste an address → receive <strong className="text-white">5 BTC</strong> free.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    He seeded it with 1,100 BTC of his own to onboard newcomers.
                  </li>
                </ul>
                <div className="mt-auto self-start bg-sats-orange-500/10 border border-sats-orange-500/30 text-sats-orange-500 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md">
                  ~5¢ per BTC then
                </div>
              </div>
            </FadeUp>

            {/* 2010 Pizza */}
            <FadeUp delay={0.1}>
              <div className="flex flex-col h-full bg-sats-black-800 border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all rounded-2xl p-6 sm:p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-xl">
                    🍕
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-sats-orange-500 uppercase tracking-wider mb-0.5">May 2010</div>
                    <div className="text-base font-bold text-white leading-tight">Pizza Day</div>
                  </div>
                </div>
                <ul className="flex-1 flex flex-col gap-2.5 mb-5">
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Laszlo Hanyecz bought two pizzas for <strong className="text-white">10,000 BTC</strong>.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Worth about $41 at the time; it proved Bitcoin could buy real goods.
                  </li>
                </ul>
                <div className="mt-auto self-start bg-sats-orange-500/10 border border-sats-orange-500/30 text-sats-orange-500 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md">
                  First commercial BTC use
                </div>
              </div>
            </FadeUp>

            {/* Faucet Boom */}
            <FadeUp delay={0.2}>
              <div className="flex flex-col h-full bg-sats-black-800 border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all rounded-2xl p-6 sm:p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-xl text-sats-orange-500">
                    🌐
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-sats-orange-500 uppercase tracking-wider mb-0.5">2011–2013</div>
                    <div className="text-base font-bold text-white leading-tight">The Faucet Boom</div>
                  </div>
                </div>
                <ul className="flex-1 flex flex-col gap-2.5 mb-5">
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Hundreds of faucets appeared as Bitcoin spread worldwide.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Per-visit payouts shrank from whole coins to tiny fractions.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Faucets stayed the main on-ramp for non-technical newcomers.
                  </li>
                </ul>
                <div className="mt-auto self-start bg-sats-orange-500/10 border border-sats-orange-500/30 text-sats-orange-500 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md">
                  100s of faucets
                </div>
              </div>
            </FadeUp>

            {/* Scaling Broke It */}
            <FadeUp delay={0.3}>
              <div className="flex flex-col h-full bg-sats-black-800 border border-red-500/30 hover:-translate-y-1 transition-all rounded-2xl p-6 sm:p-7 border-t-[3px] border-t-red-500/70">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xl text-red-500">
                    ⚠️
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-sats-orange-500 uppercase tracking-wider mb-0.5">2014–2017</div>
                    <div className="text-base font-bold text-white leading-tight">Scaling Broke It</div>
                  </div>
                </div>
                <ul className="flex-1 flex flex-col gap-2.5 mb-5">
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Network congestion pushed on-chain fees to <strong className="text-white">$5–$50+</strong> per send.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Sending someone a few sats cost more than the sats were worth.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Most classic faucets quietly shut down.
                  </li>
                </ul>
                <div className="mt-auto self-start bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md">
                  Fees &gt; payouts
                </div>
              </div>
            </FadeUp>

            {/* Lightning Arrives */}
            <FadeUp delay={0.4}>
              <div className="flex flex-col h-full bg-sats-black-800 border border-green-500/30 hover:-translate-y-1 transition-all rounded-2xl p-6 sm:p-7 border-t-[3px] border-t-green-500/70">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-xl text-green-500">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-sats-orange-500 uppercase tracking-wider mb-0.5">2018</div>
                    <div className="text-base font-bold text-white leading-tight">Lightning Arrives</div>
                  </div>
                </div>
                <ul className="flex-1 flex flex-col gap-2.5 mb-5">
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    The Lightning Network brought instant, near-free Bitcoin payments.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Fees drop below a single satoshi; settlement is sub-second.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Sending <strong className="text-white">1 sat</strong> becomes practical again – micro-earning is back.
                  </li>
                </ul>
                <div className="mt-auto self-start bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md">
                  &lt;1 sat fees
                </div>
              </div>
            </FadeUp>

            {/* The SatsEarn Era */}
            <FadeUp delay={0.5}>
              <div className="flex flex-col h-full bg-gradient-to-b from-sats-orange-500/15 to-sats-orange-500/5 border border-sats-orange-500/30 hover:-translate-y-1 transition-all rounded-2xl p-6 sm:p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-sats-orange-500 border border-sats-orange-400 flex items-center justify-center text-2xl font-bold text-black drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                    ₿
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-sats-orange-500 uppercase tracking-wider mb-0.5">2026</div>
                    <div className="text-base font-bold text-white leading-tight">The SatsEarn Era</div>
                  </div>
                </div>
                <ul className="flex-1 flex flex-col gap-2.5 mb-5">
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    The same spirit — earn Bitcoin without buying — rebuilt Lightning-native.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Earn <strong className="text-white">real sats</strong> via tasks, quizzes, streaks & referrals.
                  </li>
                  <li className="relative pl-4 text-[13px] text-gray-400 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sats-orange-500/70">
                    Paid straight to your Lightning wallet – no buying required.
                  </li>
                </ul>
                <div className="mt-auto self-start bg-sats-orange-500 text-black text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
                  You are here
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* WHY LIGHTNING COMPARISON */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="mb-10 sm:mb-12">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <div className="w-6 h-px bg-sats-orange-500/50"></div>
              Why Lightning Matters
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white mb-4">
              What killed faucets — and what fixed them
            </h2>
            <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
              Early faucets broke because on-chain fees dwarfed the payouts. Lightning is what makes earning real sats practical again — and it&apos;s what SatsEarn pays you over.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="bg-sats-black-800 border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-[1.3fr_1fr_1fr] gap-3 p-4 px-6 bg-sats-orange-500/5 border-b border-white/10 text-xs font-mono font-bold tracking-wider uppercase">
                <div className="text-transparent">Feature</div>
                <div className="text-gray-400 text-center">On-Chain Bitcoin</div>
                <div className="text-sats-orange-500 text-center">⚡ Lightning</div>
              </div>

              {/* Rows */}
              {[
                { feat: "Transaction fee", a: "$1 – $50+", b: "< $0.01" },
                { feat: "Confirmation", a: "10 min – hours", b: "< 1 second" },
                { feat: "Smallest practical send", a: "~$10+", b: "1 satoshi" },
                { feat: "Faucet / micro-earning", a: "Not viable", b: "Fully viable" }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] gap-2 sm:gap-3 p-4 px-6 border-b border-white/10 last:border-0 text-center items-center">
                  <div className="text-sats-orange-500 sm:text-gray-300 font-mono text-[12px] sm:text-sm uppercase sm:normal-case font-bold sm:font-normal mb-1 sm:mb-0 sm:text-left">
                    {row.feat}
                  </div>
                  <div className="text-sm text-gray-400 font-mono sm:text-center">
                    <span className="sm:hidden text-gray-400">On-chain: </span>{row.a}
                  </div>
                  <div className="text-sm font-bold text-green-500 font-mono sm:text-center">
                    <span className="sm:hidden text-gray-400 font-normal">⚡ Lightning: </span>{row.b}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* EARLY CALLOUT */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-gradient-to-br from-sats-orange-500/10 to-transparent border border-sats-orange-500/30 rounded-3xl p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-black leading-tight tracking-tight text-white mb-4">
                You're early — and you don't have to buy in
              </h2>
              <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                The faucet generation didn't need to be rich or technical. They just showed up. <strong className="text-white">SatsEarn brings that back</strong> — stack real sats by being active.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-5 text-center">
                  <div className="font-mono text-2xl sm:text-[26px] font-bold text-sats-orange-500 leading-none mb-2">21M</div>
                  <div className="text-xs text-gray-400 leading-snug">Max bitcoin, ever — fixed</div>
                </div>
                <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-5 text-center">
                  <div className="font-mono text-2xl sm:text-[26px] font-bold text-sats-orange-500 leading-none mb-2">100M</div>
                  <div className="text-xs text-gray-400 leading-snug">Sats in 1 BTC — what you stack</div>
                </div>
                <div className="bg-sats-black-800 border border-white/10 rounded-2xl p-5 text-center">
                  <div className="font-mono text-2xl sm:text-[26px] font-bold text-sats-orange-500 leading-none mb-2">$0</div>
                  <div className="text-xs text-gray-400 leading-snug">Needed to start — earn, don't buy</div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
};
