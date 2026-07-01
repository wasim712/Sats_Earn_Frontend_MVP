import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutWhyBitcoin = () => {
  return (
    <section id="why-bitcoin" className="px-4 py-16 sm:py-24 bg-sats-black-900 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-12 sm:mb-16">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            Why Bitcoin
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
            The Hardest Money,<br />
            <span className="text-sats-orange-500">Earned the Easy Way.</span>
          </h2>
          <p className="text-base text-gray-300 max-w-lg mx-auto leading-relaxed">
            We pay you in Bitcoin for a reason. Here's why stacking sats beats earning anything else.
          </p>
        </FadeUp>

        <FadeUp>
          <div className="flex flex-col md:flex-row gap-10 md:gap-8 items-center justify-center max-w-4xl mx-auto">
            {/* Left Column */}
            <div className="flex flex-col gap-10 md:gap-12 flex-1 items-center md:items-end md:text-right">
              <div className="max-w-[260px]">
                <div className="text-3xl mb-3 md:mb-4">💎</div>
                <div className="text-lg font-extrabold text-white mb-2 leading-tight">Absolutely Scarce</div>
                <div className="text-sm text-gray-400 leading-relaxed">Only 21 million Bitcoin will ever exist. Its capped supply is a mathematical law baked into the protocol.</div>
              </div>
              <div className="max-w-[260px]">
                <div className="text-3xl mb-3 md:mb-4">🔒</div>
                <div className="text-lg font-extrabold text-white mb-2 leading-tight">Entirely Yours</div>
                <div className="text-sm text-gray-400 leading-relaxed">Once it&apos;s in your wallet, it&apos;s yours. No bank, no platform, no government can freeze or seize your sats.</div>
              </div>
            </div>

            {/* Center Coin */}
            <div className="shrink-0 flex items-center justify-center order-first md:order-none mb-4 md:mb-0">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center text-6xl sm:text-7xl font-black text-white/55 bg-[radial-gradient(circle_at_38%_32%,#ffc04a,#f7931a_55%,#c46f0d)] shadow-[0_0_70px_rgba(249,115,22,0.4),inset_-8px_-8px_24px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-2.5 rounded-full border-2 border-white/20"></div>
                ₿
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-10 md:gap-12 flex-1 items-center md:items-start md:text-left">
              <div className="max-w-[260px]">
                <div className="text-3xl mb-3 md:mb-4">🌍</div>
                <div className="text-lg font-extrabold text-white mb-2 leading-tight">Global & Instant</div>
                <div className="text-sm text-gray-400 leading-relaxed">Send it anywhere on earth in seconds over Lightning. No borders, no middlemen, no waiting.</div>
              </div>
              <div className="max-w-[260px]">
                <div className="text-3xl mb-3 md:mb-4">♾️</div>
                <div className="text-lg font-extrabold text-white mb-2 leading-tight">Permissionless</div>
                <div className="text-sm text-gray-400 leading-relaxed">Anyone with internet can hold and use it. No approval, no application, no gatekeepers.</div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
