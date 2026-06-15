'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { FloatingSupportButton } from '@/components/ui/FloatingSupportButton';
import { 
  CheckSquare, ShieldCheck, Clock, Zap, 
  UserPlus, CheckCircle, CalendarDays, 
  Shield, Globe, BotOff, Bitcoin, ArrowRight,
  TrendingUp, Activity, Check, X, Wallet
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen bg-sats-black-950 bg-grid-base overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle,rgba(238,139,18,0.06),transparent_60%)]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(238,139,18,0.04),transparent_65%)]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(238,139,18,0.05),transparent_60%)]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-24">

        {/* HERO */}
        <header className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.1em] uppercase text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-5 py-2 mb-6 backdrop-blur-md">
              How It Works
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter mb-6 text-white">
              From Task to <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent">Real Bitcoin</span> in 4 Steps
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              SatsEarn turns simple online actions into real Bitcoin satoshis. Here&apos;s exactly how the process works — from completing your first task to withdrawing sats to your Lightning wallet.
            </p>
          </FadeUp>
        </header>

        {/* STEPS */}
        <section className="mb-24 sm:mb-32">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {[
              { 
                step: 'Step 1', 
                icon: <CheckSquare className="w-6 h-6 text-sats-orange-500" />,
                title: 'Complete a Task', 
                desc: 'Follow accounts on X, Instagram, or Reddit. Answer Bitcoin quizzes. Watch content. Play mini-games. Refer friends. Choose whatever earning methods fit your time and interest — every action stacks sats.',
                meta: 'Earn based on your tier',
                metaIcon: <Bitcoin className="w-4 h-4 text-sats-orange-500" />
              },
              { 
                step: 'Step 2', 
                icon: <ShieldCheck className="w-6 h-6 text-sats-orange-500" />,
                title: 'Verification', 
                desc: 'Every completed task is reviewed by our AI verification system and, where needed, manual review. This confirms the action was genuine and performed by a real human — never a bot. This protects the integrity of the platform for everyone.',
                meta: 'Up to 24 hours',
                metaIcon: <Clock className="w-4 h-4 text-sats-orange-500" />
              },
              { 
                step: 'Step 3', 
                icon: <Clock className="w-6 h-6 text-sats-orange-500" />,
                title: 'Maturity Period', 
                desc: 'Verified sats enter a 15-day maturity period. This is our fraud-protection window — it lets us detect and reverse any fraudulent activity before sats become withdrawable. The same rule applies to every user, regardless of tier. Think of it as anticipation, not a wait.',
                meta: '15 days · all tiers',
                metaIcon: <Clock className="w-4 h-4 text-sats-orange-500" />
              },
              { 
                step: 'Step 4', 
                icon: <Zap className="w-6 h-6 text-sats-orange-500" />,
                title: 'Withdraw via Lightning', 
                desc: 'Once your sats have matured and your available balance meets your tier\'s minimum, withdraw them to any Lightning-compatible Bitcoin wallet. Real sats, sent over the Lightning Network — no conversion, no middlemen, no internal tokens.',
                meta: 'Any Lightning wallet',
                metaIcon: <Zap className="w-4 h-4 text-sats-orange-500" />
              }
            ].map((s, idx) => (
              <FadeUp key={idx} delay={0.1 + idx * 0.1}>
                <div className="flex flex-col sm:flex-row gap-6 bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 hover:border-sats-orange-500/30 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(247,147,26,0)] group-hover:shadow-[0_0_15px_rgba(247,147,26,0.15)]">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs tracking-wider uppercase text-sats-orange-500 mb-2">{s.step}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-sats-orange-500 transition-colors">{s.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">{s.desc}</p>
                    <div className="inline-flex items-center gap-2 bg-sats-black-950 border border-white/[0.08] rounded-lg px-3 py-1.5 font-mono text-xs text-gray-300">
                      {s.metaIcon}
                      {s.meta}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* YOUR FIRST DAY */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">Your First Day</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">What the First 24 Hours Look Like</h2>
            </div>
          </FadeUp>

          <div className="max-w-3xl mx-auto relative pl-4 sm:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-[39px] sm:left-[23px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-sats-orange-500/50 via-sats-orange-500/20 to-transparent z-0"></div>

            <div className="flex flex-col gap-8 sm:gap-10">
              {[
                { time: 'Minute 1', icon: <UserPlus className="w-5 h-5 text-sats-orange-500" />, title: 'Create your free account', desc: 'Just an email — no credit card, no ID, no deposit. You\'re in and on the dashboard in under a minute.' },
                { time: 'Minutes 2–10', icon: <CheckCircle className="w-5 h-5 text-sats-orange-500" />, title: 'Complete your first few tasks', desc: 'Follow a social account, answer a Bitcoin quiz, or play a mini-game. Pick whatever fits — each completed action logs sats to your account right away.' },
                { time: 'Within 24 hours', icon: <ShieldCheck className="w-5 h-5 text-sats-orange-500" />, title: 'Your sats get verified', desc: 'Verification confirms each action was genuine. Your sats move from Pending to Maturing — you\'ll see the 15-day countdown begin on each batch.' },
                { time: 'Day 2 onward', icon: <CalendarDays className="w-5 h-5 text-sats-orange-500" />, title: 'Come back & build a streak', desc: 'Earn a little each day. Streaks unlock milestone bonuses, and consistent daily activity is the fastest path to your first withdrawal once your sats mature.' }
              ].map((item, idx) => (
                <FadeUp key={idx} delay={0.1 + idx * 0.1} className="relative z-10 flex gap-6 sm:gap-8 items-start group">
                  <div className="w-12 h-12 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-sats-orange-500/20 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(247,147,26,0.1)] group-hover:shadow-[0_0_20px_rgba(247,147,26,0.3)]">
                    {item.icon}
                  </div>
                  <div className="pt-1 flex-1">
                    <div className="font-mono text-xs sm:text-sm text-sats-orange-500 font-bold uppercase tracking-wider mb-1">{item.time}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed bg-sats-black-900/40 border border-white/[0.04] p-4 rounded-xl">{item.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          <FadeUp delay={0.5}>
            <p className="text-center text-xs text-gray-500 mt-12 max-w-2xl mx-auto italic">
              A realistic picture of getting started — not a promise of specific amounts. How much you earn depends on task availability and your tier.
            </p>
          </FadeUp>
        </section>

        {/* EARNING STATES TIMELINE */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">Earning States</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Track Every Sat&apos;s Journey</h2>
            </div>
          </FadeUp>

          <div className="max-w-3xl mx-auto relative pl-4 sm:pl-0">
            {/* Multi-color gradient line */}
            <div className="absolute left-[39px] sm:left-[23px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-yellow-500 via-blue-500 to-green-500 opacity-40 z-0"></div>

            <div className="flex flex-col gap-6 sm:gap-8">
              {/* Task Completed */}
              <FadeUp delay={0.1} className="relative z-10 flex gap-6 sm:gap-8 items-start group">
                <div className="w-12 h-12 rounded-full bg-sats-black-900 border-2 border-sats-orange-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(247,147,26,0.3)]">
                  <CheckSquare className="w-5 h-5 text-sats-orange-500" />
                </div>
                <div className="flex-1 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] p-5 sm:p-6 rounded-2xl hover:border-white/[0.1] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">Task Completed</h3>
                    <span className="font-mono text-xs px-3 py-1 bg-sats-orange-500/10 text-sats-orange-500 rounded-full">Instant</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">You finish a task, quiz, game, or referral action. The sats are logged to your account immediately and enter verification.</p>
                </div>
              </FadeUp>

              {/* Pending */}
              <FadeUp delay={0.2} className="relative z-10 flex gap-6 sm:gap-8 items-start group">
                <div className="w-12 h-12 rounded-full bg-sats-black-900 border-2 border-yellow-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Activity className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] p-5 sm:p-6 rounded-2xl hover:border-white/[0.1] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">Pending — Being Verified</h3>
                    <span className="font-mono text-xs px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full">Up to 24h</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4">Our verification system confirms the action was genuine and human. Most clear well within a day.</p>
                  <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[18%]"></div>
                  </div>
                </div>
              </FadeUp>

              {/* Maturing */}
              <FadeUp delay={0.3} className="relative z-10 flex gap-6 sm:gap-8 items-start group">
                <div className="w-12 h-12 rounded-full bg-sats-black-900 border-2 border-blue-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] p-5 sm:p-6 rounded-2xl hover:border-white/[0.1] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">Maturing — Countdown Active</h3>
                    <span className="font-mono text-xs px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">15 days · all tiers</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4">Verified sats enter a visible 15-day countdown — the fraud-protection window that keeps the platform honest. Watch each batch tick down to release. Anticipation, not a wait.</p>
                  <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[62%]"></div>
                  </div>
                </div>
              </FadeUp>

              {/* Available */}
              <FadeUp delay={0.4} className="relative z-10 flex gap-6 sm:gap-8 items-start group">
                <div className="w-12 h-12 rounded-full bg-sats-black-900 border-2 border-green-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <Bitcoin className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] p-5 sm:p-6 rounded-2xl hover:border-white/[0.1] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">Available — Ready to Withdraw</h3>
                    <span className="font-mono text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Lightning</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4">Once matured and your balance hits your tier minimum, withdraw real sats to any Lightning wallet — usually in minutes.</p>
                  <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[100%]"></div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
          <FadeUp delay={0.5}>
            <p className="text-center text-xs text-gray-500 mt-8 max-w-2xl mx-auto italic">
              Every sat follows the same path, on the same 15-day timeline, for every tier — no shortcuts, no exceptions. Paid tiers earn more per task and have lower withdrawal minimums, so they reach payout sooner.
            </p>
          </FadeUp>
        </section>

        {/* BUILT FOR TRUST */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">Why This Process</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">Built for Trust</h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Shield className="w-7 h-7" />, title: 'Fraud Protection', desc: 'The verification and maturity steps exist to keep SatsEarn honest. They stop bots, fake completions, and reversed actions from draining real rewards meant for genuine users.' },
              { icon: <Bitcoin className="w-7 h-7" />, title: 'Real Sats, No Conversion', desc: 'You earn actual Bitcoin satoshis — not points or internal coins that convert later. What you see in your balance is real Bitcoin, withdrawable via Lightning.' },
              { icon: <Globe className="w-7 h-7" />, title: 'Works Everywhere', desc: 'No bank account, no ID, no exchange needed. If you have internet and email, you can earn Bitcoin on SatsEarn from 180+ countries.' },
              { icon: <BotOff className="w-7 h-7" />, title: 'Zero Bots', desc: 'Every action is performed by verified humans. Our review systems ensure no automated activity ever earns on the platform — protecting the value of your sats.' }
            ].map((box, idx) => (
              <FadeUp key={idx} delay={0.1 + idx * 0.1}>
                <div className="bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 hover:-translate-y-1 hover:border-sats-orange-500/30 transition-all duration-300 group h-full">
                  <div className="w-14 h-14 rounded-xl bg-sats-orange-500/10 text-sats-orange-500 flex items-center justify-center mb-6 group-hover:bg-sats-orange-500 group-hover:text-black transition-colors">
                    {box.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-sats-orange-500 transition-colors">{box.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{box.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

      </div>

      {/* MARQUEE */}
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
      <div className="relative z-10 w-full overflow-hidden bg-sats-orange-500/10 border-y border-sats-orange-500/20 py-4 flex select-none">
        <div className="animate-[scroll-left_30s_linear_infinite] flex whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">COMPLETE</span>
              <span className="text-sats-orange-500/50">·</span>
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">VERIFY</span>
              <span className="text-sats-orange-500/50">·</span>
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">MATURE</span>
              <span className="text-sats-orange-500/50">·</span>
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">WITHDRAW</span>
              <span className="text-sats-orange-500/50">·</span>
            </div>
          ))}
        </div>
        {/* We need to duplicate the row for seamless scrolling */}
        <div className="animate-[scroll-left_30s_linear_infinite] flex whitespace-nowrap" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div key={`dup-${i}`} className="flex items-center">
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">COMPLETE</span>
              <span className="text-sats-orange-500/50">·</span>
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">VERIFY</span>
              <span className="text-sats-orange-500/50">·</span>
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">MATURE</span>
              <span className="text-sats-orange-500/50">·</span>
              <span className="font-mono font-bold text-sm tracking-widest text-sats-orange-500 mx-6">WITHDRAW</span>
              <span className="text-sats-orange-500/50">·</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-24">

        {/* EARNING VS BUYING */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">Earning vs Buying</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Why Earning Wins</h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Buy Card */}
            <FadeUp delay={0.2}>
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 sm:p-8 h-full">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                  <X className="w-4 h-4" /> Buying Bitcoin
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-400">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" /> Requires money you have to risk upfront
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-400">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" /> Needs an exchange account, ID, and bank
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-400">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" /> Buy high, panic sell low — timing stress
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-400">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" /> Fees on every purchase and transfer
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-400">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" /> Blocked entirely in many regions
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Earn Card */}
            <FadeUp delay={0.3}>
              <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6 sm:p-8 h-full">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Earning on SatsEarn
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> <span className="font-medium text-white">Zero money in</span> — start with nothing but time
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> No ID, no bank, no exchange — <span className="font-medium text-white">just email</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Stack steadily, <span className="font-medium text-white">no market timing</span> needed
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Transparent fees shown before withdrawal
                  </div>
                  <div className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Works in <span className="font-medium text-white">180+ countries</span> worldwide
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* SUSTAINABILITY */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">Sustainability</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">&quot;How can you give away real Bitcoin?&quot;</h2>
              <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
                It&apos;s the question every honest person asks. The answer isn&apos;t magic — it&apos;s a funded reward pool and a model designed to last. Here&apos;s exactly how it works, with nothing hidden.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <FadeUp delay={0.2}>
              <div className="bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 text-sats-orange-500 flex items-center justify-center mb-5">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Subscription revenue</h3>
                <p className="text-sm text-gray-400 leading-relaxed">A share of every paid-tier membership (Platinum through Founders) flows directly into the reward pool that pays out sats. Paying members help fund the free tier — openly and by design.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 text-sats-orange-500 flex items-center justify-center mb-5">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Sponsor &amp; advertiser revenue</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Brands pay to reach real, engaged Bitcoiners through tasks and offers. That revenue is passed back to you as sats. When you complete a sponsored task, you&apos;re sharing in what the advertiser paid.</p>
              </div>
            </FadeUp>
          </div>

          {/* Flow */}
          <FadeUp delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto mb-16">
              <div className="bg-sats-black-900 border border-white/[0.08] rounded-xl p-4 text-center w-full sm:w-auto flex-1">
                <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Money in</div>
                <div className="font-bold text-white">Subscriptions + Sponsors</div>
              </div>
              <div className="text-gray-500 rotate-90 sm:rotate-0"><ArrowRight className="w-5 h-5" /></div>
              <div className="bg-sats-orange-500/10 border border-sats-orange-500/30 rounded-xl p-4 text-center w-full sm:w-auto flex-1 shadow-[0_0_20px_rgba(247,147,26,0.15)]">
                <div className="font-mono text-xs text-sats-orange-500 uppercase tracking-widest mb-1">Reward pool</div>
                <div className="font-bold text-sats-orange-500">Funded sat reserve</div>
              </div>
              <div className="text-gray-500 rotate-90 sm:rotate-0"><ArrowRight className="w-5 h-5" /></div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center w-full sm:w-auto flex-1 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <div className="font-mono text-xs text-green-500 uppercase tracking-widest mb-1">Money out</div>
                <div className="font-bold text-green-500">Sats to your wallet</div>
              </div>
            </div>
          </FadeUp>

          {/* Chart Section */}
          <FadeUp delay={0.5}>
            <div className="max-w-4xl mx-auto bg-sats-black-900/60 backdrop-blur-md border border-white/[0.08] rounded-3xl p-6 sm:p-10">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Why rewards get smaller as Bitcoin grows</h3>
                <p className="text-sm text-gray-400 max-w-2xl mx-auto">To keep the reward pool sustainable, the number of sats paid per task is reduced as Bitcoin&apos;s price rises — because each sat is worth more in real terms. These bars are <b className="text-sats-orange-500">illustrative scenarios, not price predictions</b>.</p>
              </div>

              {/* Simplified Bar Chart visualization */}
              <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 border-b-2 border-white/[0.1] pb-2 mb-4 px-2">
                {[
                  { price: '~$60k', sats: '~10', now: true, height: 'h-full' },
                  { price: '$100k', sats: '~9', now: false, height: 'h-[90%]' },
                  { price: '$150k', sats: '~8', now: false, height: 'h-[80%]' },
                  { price: '$200k', sats: '~7', now: false, height: 'h-[70%]' },
                  { price: '$250k', sats: '~6', now: false, height: 'h-[60%]' },
                  { price: '$300k', sats: '~5', now: false, height: 'h-[50%]' },
                  { price: '$500k', sats: '~4', now: false, height: 'h-[40%]' },
                  { price: '$750k', sats: '~3', now: false, height: 'h-[30%]' },
                  { price: '$1M+', sats: '~2', now: false, height: 'h-[20%]' }
                ].map((col, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                    <div className={`font-mono text-[10px] sm:text-xs font-bold transition-colors ${col.now ? 'text-green-500' : 'text-sats-orange-500'}`}>{col.sats}</div>
                    <div className={`w-full max-w-[40px] rounded-t-md transition-all ${col.height} ${col.now ? 'bg-gradient-to-b from-green-400 to-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-gradient-to-b from-sats-orange-400 to-sats-orange-600 opacity-80 group-hover:opacity-100'}`}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between gap-1 sm:gap-2 px-2 mb-6">
                {[
                  { price: '~$60k', label: 'Now', now: true },
                  { price: '$100k', label: 'If', now: false },
                  { price: '$150k', label: 'If', now: false },
                  { price: '$200k', label: 'If', now: false },
                  { price: '$250k', label: 'If', now: false },
                  { price: '$300k', label: 'If', now: false },
                  { price: '$500k', label: 'If', now: false },
                  { price: '$750k', label: 'If', now: false },
                  { price: '$1M+', label: 'If', now: false }
                ].map((col, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className={`font-mono text-[9px] sm:text-[11px] font-bold ${col.now ? 'text-green-500' : 'text-gray-300'}`}>{col.price}</div>
                    <div className={`font-mono text-[8px] sm:text-[9px] uppercase tracking-wider ${col.now ? 'text-green-500' : 'text-gray-500'}`}>{col.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-dashed border-white/[0.1] font-mono text-[10px] sm:text-xs text-gray-400 mb-6">
                <div className="text-green-500">↓ Lower price → more sats per task</div>
                <div className="text-sats-orange-500 text-right">Higher price → fewer sats per task ↓</div>
              </div>

              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 text-sm text-gray-300 leading-relaxed mb-4">
                <strong className="text-green-500">This is why starting early matters.</strong> The sats you earn per task are highest while Bitcoin&apos;s price is lower. As (and if) the price climbs, we reduce sat-denominated rewards to keep payouts sustainable — so the per-task sat rates available today are higher than what later phases will offer. That&apos;s a feature of the model, not a promise about how much you&apos;ll earn or where Bitcoin&apos;s price will go.
              </div>
              <p className="text-center text-[11px] text-gray-500 italic max-w-2xl mx-auto">
                The price levels shown are illustrative scenarios for explaining the reward model — they are not forecasts, targets, or financial advice. Bitcoin&apos;s price can fall as well as rise. Exact sat rewards vary by task, tier, and campaign, and are always set by the platform.
              </p>
            </div>
          </FadeUp>
        </section>

        {/* QUICK ANSWERS */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">Quick Answers</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Common Questions</h2>
            </div>
          </FadeUp>

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {[
              { q: 'How long until I can withdraw my first sats?', a: 'After a task is verified (up to 24 hours), sats enter a 15-day maturity period. Once matured and your available balance hits your tier minimum, you can withdraw. Consistent daily earning shortens the time to your first payout.' },
              { q: 'Do I need to buy anything to start?', a: 'Never. SatsEarn is built so you earn Bitcoin without spending any. No deposits, no purchases, no credit card. The free tier is viable forever.' },
              { q: 'Why is there a 15-day maturity period?', a: 'It\'s our fraud-protection window. It lets us detect and reverse fraudulent or reversed actions before sats become withdrawable — keeping the platform honest for genuine users. The same rule applies to everyone.' },
              { q: 'What wallet do I need?', a: 'Any Lightning-compatible Bitcoin wallet — Wallet of Satoshi, Phoenix, Muun, Breez, and more. You only need it when you\'re ready to withdraw.', link: { text: 'See the full withdrawal guide →', href: '/user/wallet' } }
            ].map((faq, idx) => (
              <FadeUp key={idx} delay={0.1 + idx * 0.1}>
                <div className="bg-gradient-to-br from-sats-black-800 to-sats-black-900 backdrop-blur-md border border-white/[0.1] shadow-lg rounded-xl p-6 sm:p-8 hover:border-sats-orange-500/30 transition-all duration-300">
                  <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {faq.a}
                    {faq.link && (
                      <Link href={faq.link.href} className="text-sats-orange-500 font-semibold ml-2 hover:underline">
                        {faq.link.text}
                      </Link>
                    )}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* CTA */}
        <FadeUp delay={0.2}>
          <div className="relative overflow-hidden bg-gradient-to-br from-sats-black-900 via-sats-black-900 to-sats-orange-500/10 border border-sats-orange-500/20 rounded-3xl p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Ready to Stack Your First Sats?</h2>
            <p className="text-gray-300 mb-10 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Create a free account and complete your first task today. No credit card, no buying, no catch.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-base transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-1 shadow-[0_5px_15px_rgba(238,139,18,0.3)] hover:shadow-[0_12px_25px_rgba(238,139,18,0.45)]"
            >
              <Bitcoin className="w-5 h-5" />
              Start Earning Free
            </Link>
            <div className="mt-8 pt-6 border-t border-white/[0.06] text-xs text-gray-500 max-w-lg mx-auto">
              Earnings depend on task availability and tier. All sats subject to 15-day maturity period.
            </div>
          </div>
        </FadeUp>

      </div>

      <FloatingSupportButton />
    </main>
  );
}
