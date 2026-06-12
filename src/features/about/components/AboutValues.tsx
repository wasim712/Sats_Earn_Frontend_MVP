import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutValues = () => {
  const values = [
    { icon: "🌍", name: "Accessibility", desc: "Bitcoin for everyone. 180+ countries. No ID. No bank account needed. If you have email and internet, you can earn Bitcoin on SatsEarn." },
    { icon: "🔒", name: "Security", desc: "Your Bitcoin is yours. The 15-day maturity hold protects against fraud. AI verification catches bad actors before they affect the platform." },
    { icon: "💡", name: "Honesty", desc: "We're in beta. We'll tell you what works and what doesn't. No hype. No fake promises. No guaranteed earnings claims. Just real Bitcoin for real work." },
    { icon: "⚡", name: "Simplicity", desc: "No confusing crypto jargon. No technical requirements. If you can scroll and follow an account, you can earn Bitcoin on SatsEarn." },
    { icon: "📊", name: "Transparency", desc: "Public roadmap. Open policies. Clear earning rules. Every sat you earn is traceable from task completion to your Lightning wallet. We hide nothing." },
    { icon: "🤝", name: "Community", desc: "We're not a corporation. We're building with our users. Your feedback shapes our roadmap. Your success is our success. We listen and we act." }
  ];

  return (
    <section id="values" className="px-4 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-12 sm:mb-16">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            Core Values
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
            What We Stand For
          </h2>
        </FadeUp>

        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {values.map((value, i) => (
              <div 
                key={i} 
                className="bg-sats-black-800 border border-white/10 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-sats-orange-500/30 hover:-translate-y-1"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <div className="text-lg font-extrabold text-white mb-2">{value.name}</div>
                <div className="text-[13px] sm:text-sm text-gray-400 leading-relaxed">{value.desc}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
