'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralShare = () => {
  const [tooltipStates, setTooltipStates] = useState<{ [key: string]: boolean }>({});

  const handleInteraction = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    setTooltipStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setTooltipStates(prev => ({ ...prev, [key]: false }));
    }, 3000);
  };

  const handleMouseEnter = (key: string) => {
    setTooltipStates(prev => ({ ...prev, [key]: true }));
  };

  const handleMouseLeave = (key: string) => {
    setTooltipStates(prev => ({ ...prev, [key]: false }));
  };

  const shareAssets = [
    {
      id: 'x',
      platform: 'X / Twitter',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      text: "I'm earning real Bitcoin — actual sats, no buying — just by completing tasks, quizzes and games on @satsearn. Paid straight over Lightning. Start free with my link: satsearn.app/?ref=YOURCODE ⚡"
    },
    {
      id: 'tg',
      platform: 'Telegram / WhatsApp',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
      text: "Hey — found a way to actually earn Bitcoin without buying any. You do small tasks, quizzes and games and get paid in real sats over Lightning. No experience needed, free to start. Here's my link: satsearn.app/?ref=YOURCODE"
    },
    {
      id: 'pitch',
      platform: 'Short pitch (anywhere)',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>,
      text: "SatsEarn lets anyone stack real Bitcoin sats — earned, not bought — through tasks, learning and games, paid over the Lightning Network. Free to join: satsearn.app/?ref=YOURCODE"
    }
  ];

  return (
    <>
      {/* TIPS & FAIR PLAY */}
      <section className="px-4 py-16 sm:py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <FadeUp>
              <div className="mb-8">
                <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-2">Grow Your Network</div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Tips to earn more</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {[
                  { title: "Share where it fits", desc: "Post your link where people are curious. The whole point is helping new people start. Genuine beats spammy." },
                  { title: "Make helpful content", desc: "Short videos explaining how SatsEarn works or how Lightning works. Include your link naturally." },
                  { title: "Help them stay active", desc: "Commission is paid on activity. Answer their questions and point them to guides." },
                  { title: "Upgrade your tier", desc: "Moving up the paid tiers raises your rate and removes the lifetime cap." }
                ].map((tip, i) => (
                  <div key={i} className="bg-gradient-to-r from-sats-orange-500/5 to-transparent border border-white/10 border-l-[3px] border-l-sats-orange-500 rounded-r-xl p-5">
                    <div className="font-mono text-[13px] font-bold text-sats-orange-500 uppercase tracking-wide mb-1.5">{tip.title}</div>
                    <div className="text-[13px] sm:text-sm text-gray-300 leading-relaxed">{tip.desc}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="bg-sats-black-800 border border-white/10 rounded-3xl p-8 sm:p-10 h-full border-t-[4px] border-t-sats-orange-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sats-orange-500/10 flex items-center justify-center text-sats-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">Fair play keeps it real</h3>
                </div>
                <p className="text-[15px] text-gray-300 mb-8 leading-relaxed">
                  SatsEarn is built for genuine people earning genuine sats. Keeping referrals honest is what lets us pay real rewards — so the rules are simple.
                </p>
                <ul className="flex flex-col gap-4">
                  <li className="flex gap-3 text-sm text-gray-300"><strong className="text-green-500 font-mono text-base">✓</strong> Invite real people who use the platform themselves</li>
                  <li className="flex gap-3 text-sm text-gray-400"><strong className="text-red-500 font-mono text-base">✕</strong> No self-referral or extra accounts for yourself</li>
                  <li className="flex gap-3 text-sm text-gray-300"><strong className="text-green-500 font-mono text-base">✓</strong> Share your link openly and honestly</li>
                  <li className="flex gap-3 text-sm text-gray-400"><strong className="text-red-500 font-mono text-base">✕</strong> No bots, fake accounts, or fake task completions</li>
                  <li className="flex gap-3 text-sm text-gray-300"><strong className="text-green-500 font-mono text-base">✓</strong> Earn on your referrals' genuine activity</li>
                  <li className="flex gap-3 text-sm text-gray-400"><strong className="text-red-500 font-mono text-base">✕</strong> Abuse forfeits affected balances and can mean a ban</li>
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* SHARE ASSETS */}
      <section id="share" className="px-4 py-16 sm:py-24 border-t border-white/5 bg-sats-black-900">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14 text-center">
            <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              Ready to Share
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              Grab a message and go
            </h2>
            <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Find a ready-made message to get started. Genuine and personal always beats copy-paste — tweak these to sound like you when you're logged in.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="flex flex-col gap-5 sm:gap-6 mb-8">
              {shareAssets.map((asset) => {
                const isHovered = tooltipStates[asset.id] || false;
                
                // Highlight the dummy link visually
                const parts = asset.text.split('satsearn.app/?ref=YOURCODE');
                
                return (
                  <div key={asset.id} className="bg-sats-black-800 border border-white/10 rounded-2xl p-5 sm:p-6 transition-colors hover:border-white/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2.5 font-bold text-sm text-white">
                        <div className="text-sats-orange-500">{asset.icon}</div>
                        {asset.platform}
                      </div>
                      
                      <Link 
                        href="/signup" 
                        className="bg-sats-orange-500/10 text-sats-orange-500 border border-sats-orange-500/30 rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all hover:bg-sats-orange-500 hover:text-black hover:border-sats-orange-500 shrink-0 text-center"
                      >
                        ⚡ Get Your Link to Copy
                      </Link>
                    </div>

                    <div 
                      className="bg-sats-black-900 border border-white/10 rounded-xl p-4 sm:p-5 text-sm text-gray-300 leading-relaxed relative cursor-not-allowed overflow-hidden group"
                      onMouseEnter={() => handleMouseEnter(asset.id)}
                      onMouseLeave={() => handleMouseLeave(asset.id)}
                      onClick={(e) => handleInteraction(asset.id, e)}
                    >
                      <div className={`relative z-10 transition-all duration-300 ${isHovered ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
                        {parts[0]}
                        <span className="text-sats-orange-500 font-mono">satsearn.app/?ref=YOURCODE</span>
                        {parts[1]}
                      </div>

                      <div className={`absolute inset-0 bg-sats-black-800/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-20 px-4 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <div className="text-xs sm:text-sm font-mono text-white text-center font-bold">
                          Please login/signup to get your referral link.<br className="hidden sm:block"/>This one is dummy.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-500 italic text-center max-w-3xl mx-auto leading-relaxed">
              <strong className="text-gray-400 font-mono font-bold">satsearn.app/?ref=YOURCODE</strong> is a placeholder — once you log in, your dashboard fills in your real 8-character code automatically. Keep it honest — no income promises or "get rich" claims (those break the fair-play rules and can forfeit your commission).
            </p>
          </FadeUp>
        </div>
      </section>
    </>
  );
};
