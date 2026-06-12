import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutSides = () => {
  return (
    <section id="sides" className="px-4 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-12 sm:mb-16">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            Two Sides, One Platform
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
            Building for <span className="text-sats-orange-500">Both</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* For Earners */}
          <FadeUp>
            <div className="border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-sats-orange-500">
                ⚡ For Earners
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { title: "Earn Real Bitcoin", desc: "No gift cards, no points that expire. Real satoshis — actual Bitcoin — that you control and withdraw to your own wallet." },
                { title: "Simple Tasks", desc: "Follow accounts, answer quizzes, watch content, refer friends. Nothing hard. Nothing sketchy. Nothing that requires buying anything." },
                { title: "Referral Income", desc: "Earn 5–30% commission on every task your active referrals complete. Commission is paid on the base reward rate — consistent and transparent." },
                { title: "Your Bitcoin, Your Rules", desc: "Withdraw via Lightning to any wallet after 15-day maturity. No middlemen, no conversion steps, no permission needed." }
              ].map((item, i) => (
                <div key={i} className="bg-sats-black-800 border border-sats-orange-500/15 border-l-[3px] border-l-sats-orange-500 rounded-xl p-5 sm:p-6">
                  <div className="text-base sm:text-lg font-bold text-white mb-1.5">{item.title}</div>
                  <div className="text-sm text-gray-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* For Brands */}
          <FadeUp>
            <div className="border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-green-500">
                🎯 For Brands
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { title: "Real Verified Users", desc: "Every completion is verified by AI and manual review. No bots, no fake engagement. Real humans taking real action on your campaigns." },
                { title: "Measurable Results", desc: "Track every completion in real time. Know exactly what you're getting for your budget. Full transparency on ROI." },
                { title: "Smart Verification", desc: "AI catches fake engagement before it reaches your campaign. Users prove they followed, watched, or downloaded. No fraud reaches your metrics." },
                { title: "Flexible Campaigns", desc: "Social tasks, app installs, surveys, brand awareness, education campaigns. Build exactly what you need with custom reward structures." }
              ].map((item, i) => (
                <div key={i} className="bg-sats-black-800 border border-white/10 border-l-[3px] border-l-green-500 rounded-xl p-5 sm:p-6">
                  <div className="text-base sm:text-lg font-bold text-white mb-1.5">{item.title}</div>
                  <div className="text-sm text-gray-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};
