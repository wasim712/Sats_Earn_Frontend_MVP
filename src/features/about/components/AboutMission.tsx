import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutMission = () => {
  return (
    <section id="mission" className="px-4 py-16 sm:py-24 bg-sats-black-900 text-center">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-8">
            Our Mission
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white max-w-4xl mx-auto mb-10">
            To make earning Bitcoin as simple as being online — so anyone, anywhere, can stack sats without ever having to <span className="text-sats-orange-500">buy one single sat. One sat at a time.</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: "⚡", text: "Real Sats Only" },
              { icon: "🌍", text: "Globally Accessible" },
              { icon: "🔒", text: "Fraud Protected" },
              { icon: "💡", text: "No Buying Required" },
              { icon: "🤝", text: "Free Forever Tier" },
              { icon: "📊", text: "Fully Transparent" }
            ].map((pillar, i) => (
              <div key={i} className="flex items-center gap-1 bg-sats-black-800 border border-white/10 rounded-full px-3 py-2 sm:text-sm text-[13px] font-semibold text-white">
                <span className="text-base">{pillar.icon}</span> {pillar.text}
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
