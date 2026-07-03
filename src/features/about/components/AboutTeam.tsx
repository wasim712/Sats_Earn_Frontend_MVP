import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutTeam = () => {
  const team = [
    { name: "Wasim Akram", role: "Founder & CEO", sub: "Product, Strategy & Vision", initial: "W", gradient: "from-[#f7931a] to-[#ffcc00]", isFounder: true },
    { name: "Nadeem M S", role: "Founder", sub: "Operations & Growth", initial: "N", gradient: "from-[#a855f7] to-[#ec4899]", isFounder: true }
  ];

  return (
    <section id="team" className="px-4 py-16 sm:py-24 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-12 sm:mb-16">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            The People
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
            Meet the <span className="text-sats-orange-500">Team</span>
          </h2>
        </FadeUp>

        <FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {team.map((member, i) => (
              <div 
                key={i} 
                className={`relative rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 ${
                  member.isFounder 
                    ? "bg-gradient-to-b from-sats-orange-500/5 to-sats-black-800 border border-sats-orange-500/20 hover:border-sats-orange-500/40" 
                    : "bg-sats-black-800 border border-white/10 hover:border-white/20"
                }`}
              >
                {member.isFounder && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-[9px] font-black tracking-[0.1em] text-sats-orange-500 bg-sats-orange-500/15 border border-sats-orange-500/20 rounded-md px-2 py-0.5">
                    FOUNDER
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black text-black font-mono bg-gradient-to-br ${member.gradient}`}>
                  {member.initial}
                </div>
                
                <div className="text-base sm:text-lg font-bold text-white mb-1">{member.name}</div>
                <div className="text-xs text-sats-orange-500 font-bold tracking-wide mb-1.5">{member.role}</div>
                <div className="text-[13px] text-gray-400 leading-relaxed">{member.sub}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
