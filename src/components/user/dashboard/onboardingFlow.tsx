'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap, X, ChevronRight, ChevronLeft, CheckCircle2,
  Wallet, LayoutGrid, Lightbulb, Flame, Users,
  Trophy, ArrowUpRight, Gift, Star, Shield,
  ArrowRight,
} from 'lucide-react';

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'satsearn_onboarding_done';

// ─── Step definitions ─────────────────────────────────────────────────────────

interface Step {
  id: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  highlight?: string;       // Optional orange highlight line
  visual: React.ReactNode;  // Illustrative mini-UI inside the card
}

const STEPS: Step[] = [
  {
    id: 'welcome',
    icon: <Zap className="w-5 h-5" />,
    label: 'Welcome',
    title: 'Welcome to SatsEarn ⚡',
    subtitle: 'Bitcoin rewards for real tasks',
    description:
      'SatsEarn is a gamified platform where you complete micro-tasks, take daily quizzes, and engage socially — all to earn real Bitcoin (Sats) directly to your Lightning wallet.',
    visual: (
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="relative">
          <div className="absolute inset-0 bg-sats-orange-500/20 rounded-full blur-2xl scale-150" />
          <div className="relative w-20 h-20 rounded-2xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center">
            <Zap className="w-10 h-10 text-sats-orange-500" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {['Tasks', 'Quizzes', 'Referrals', 'Streaks'].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs font-bold text-white/50">
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/25 text-center">Complete activities → Earn Sats → Withdraw to wallet</p>
      </div>
    ),
  },
  {
    id: 'balance',
    icon: <Wallet className="w-5 h-5" />,
    label: 'Balance',
    title: 'Your Bitcoin Balance',
    subtitle: 'Three types of funds',
    description:
      'Your dashboard shows three balance types. Available Sats are ready to withdraw. Pending Sats are under admin review. Locked Sats are held for 15 days as a security measure before becoming available.',
    highlight: 'Check your Available balance daily — it updates in real time.',
    visual: (
      <div className="grid grid-cols-3 gap-2 w-full">
        {[
          { label: 'Available', value: '12,500', color: 'text-sats-orange-500', border: 'border-sats-orange-500/20', bg: 'bg-sats-orange-500/5' },
          { label: 'Pending', value: '240', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
          { label: 'Locked', value: '50', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} border ${card.border} rounded-xl p-3 flex flex-col gap-1`}>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{card.label}</span>
            <span className={`text-base font-black ${card.color} tabular-nums`}>{card.value}</span>
            <span className="text-[9px] text-white/20">SATS</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'tasks',
    icon: <LayoutGrid className="w-5 h-5" />,
    label: 'Tasks',
    title: 'Browse & Complete Tasks',
    subtitle: 'The main way to earn Sats',
    description:
      'Browse available campaigns and complete their tasks. Each task requires proof of completion — a screenshot, a URL, or a text response. Your submission goes to admin review and once approved, Sats are credited instantly.',
    highlight: 'Higher tiers earn more Sats per task. Level up to unlock bigger rewards.',
    visual: (
      <div className="w-full space-y-2">
        {[
          { title: 'Follow our Twitter', platform: 'TWITTER', reward: '150', proof: 'Screenshot', color: 'text-sky-400' },
          { title: 'Subscribe to YouTube', platform: 'YOUTUBE', reward: '200', proof: 'URL', color: 'text-red-400' },
        ].map((task) => (
          <div key={task.title} className="flex items-center justify-between bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-2.5">
            <div>
              <p className="text-xs font-bold text-white/70">{task.title}</p>
              <p className={`text-[10px] font-bold uppercase ${task.color}`}>{task.platform} · {task.proof}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-sats-orange-500">+{task.reward}</p>
              <p className="text-[9px] text-white/25">Sats</p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="text-[10px] text-white/20 font-medium">Submit proof → Admin review → Sats credited</span>
        </div>
      </div>
    ),
  },
  {
    id: 'quiz',
    icon: <Lightbulb className="w-5 h-5" />,
    label: 'Daily Quiz',
    title: 'Daily Quiz Challenge',
    subtitle: 'One quiz, one chance, every day',
    description:
      'A new Bitcoin or crypto quiz drops every day. Answer all questions correctly to earn the full Sats reward. You only get one attempt per day — so read carefully before submitting!',
    highlight: 'Answer every question before submitting — you cannot go back.',
    visual: (
      <div className="w-full space-y-2">
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3">
          <p className="text-xs font-bold text-white/60 mb-2">What is the max supply of Bitcoin?</p>
          <div className="grid grid-cols-2 gap-1.5">
            {['21 Million', '100 Million', 'Unlimited', '42 Million'].map((opt, i) => (
              <div key={opt} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border ${i === 0 ? 'bg-sats-orange-500/10 border-sats-orange-500/30 text-sats-orange-500' : 'bg-[#0a0a0a] border-[#1a1a1a] text-white/30'}`}>
                {['A', 'B', 'C', 'D'][i]}. {opt}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-white/25">1 attempt / day</span>
          <span className="text-[10px] text-sats-orange-500 font-bold">+50 Sats reward</span>
        </div>
      </div>
    ),
  },
  {
    id: 'streak',
    icon: <Flame className="w-5 h-5" />,
    label: 'Streaks',
    title: 'Daily Streak Bonuses',
    subtitle: 'Stay consistent, earn more',
    description:
      'Complete at least one valid task or quiz every day to maintain your streak. Hitting streak milestones (7, 21, 60, 90, 180, 365 days) rewards you with bonus Sats. Miss a day and your streak resets.',
    highlight: 'Even completing the daily quiz counts toward your streak.',
    visual: (
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          {[
            { days: '7', sats: '+70', done: true },
            { days: '21', sats: '+210', done: false, next: true },
            { days: '60', sats: '+600', done: false },
            { days: '90', sats: '+900', done: false },
          ].map((m, i) => (
            <div key={m.days} className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                m.done
                  ? 'border-sats-orange-500 bg-sats-orange-500 text-black'
                  : m.next
                  ? 'border-sats-orange-500 text-sats-orange-500'
                  : 'border-white/10 text-white/20'
              }`}>
                {m.done ? <CheckCircle2 className="w-4 h-4" /> : m.days}
              </div>
              <span className={`text-[9px] font-bold ${m.done ? 'text-sats-orange-500' : m.next ? 'text-white/60' : 'text-white/20'}`}>
                {m.sats}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-[10px] text-white/25 leading-relaxed">Current: 7 Days 🔥 — Next milestone: 21 Days</span>
        </div>
      </div>
    ),
  },
  {
    id: 'referrals',
    icon: <Gift className="w-5 h-5" />,
    label: 'Referrals',
    title: 'Invite Friends & Earn',
    subtitle: 'Share your code, earn together',
    description:
      'Share your unique referral link or code with friends. When they sign up and complete tasks, you earn bonus Sats automatically. The more friends you bring, the more you earn passively.',
    highlight: 'Your referral earnings stack on top of your regular task earnings.',
    visual: (
      <div className="w-full space-y-2.5">
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-2.5 flex items-center justify-between">
          <span className="text-[10px] text-white/40 font-mono">satsearn.com/ref/SAKSHAM</span>
          <span className="text-[10px] font-black text-sats-orange-500 bg-sats-orange-500/10 px-2 py-0.5 rounded-lg border border-sats-orange-500/20">Copy</span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-2 text-center">
              <div className="w-6 h-6 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 mx-auto mb-1 flex items-center justify-center">
                <Users className="w-3 h-3 text-sats-orange-500" />
              </div>
              <p className="text-[9px] text-white/30">Friend {i}</p>
              <p className="text-[10px] font-black text-sats-orange-500">+50</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'leaderboard',
    icon: <Trophy className="w-5 h-5" />,
    label: 'Leaderboard',
    title: 'Compete on the Leaderboard',
    subtitle: 'See where you stand globally',
    description:
      'The leaderboard ranks users by total Sats earned. Compete with other users, climb the ranks, and earn recognition. Top performers may receive special bonuses and tier upgrades.',
    visual: (
      <div className="w-full space-y-1.5">
        {[
          { rank: 1, name: 'CryptoKing', sats: '2,450,000', badge: '👑' },
          { rank: 2, name: 'SatoshiFan', sats: '1,890,000', badge: '🥈' },
          { rank: 3, name: 'BitcoinMax', sats: '1,240,000', badge: '🥉' },
          { rank: 42, name: 'You', sats: '998,062', badge: '⚡', isYou: true },
        ].map((row) => (
          <div key={row.rank} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${row.isYou ? 'bg-sats-orange-500/8 border-sats-orange-500/20' : 'bg-[#0a0a0a] border-[#1a1a1a]'}`}>
            <span className="text-sm w-5 text-center">{row.badge}</span>
            <span className={`text-xs font-bold flex-1 ${row.isYou ? 'text-sats-orange-400' : 'text-white/60'}`}>{row.name}</span>
            <span className={`text-xs font-black ${row.isYou ? 'text-sats-orange-500' : 'text-white/40'} tabular-nums`}>{row.sats}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'tiers',
    icon: <Star className="w-5 h-5" />,
    label: 'Tiers & XP',
    title: 'Tier System & XP',
    subtitle: 'Level up to unlock bigger rewards',
    description:
      'Every task and quiz earns you XP. XP fills your level bar and eventually upgrades your Tier — from Basic all the way to Founder. Higher tiers unlock exclusive campaigns with larger Sats rewards.',
    highlight: 'Your tier affects how much you earn per task — Platinum earns far more than Basic.',
    visual: (
      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { tier: 'Basic', color: 'text-white/40', border: 'border-white/10' },
            { tier: 'Silver', color: 'text-slate-300', border: 'border-slate-500/30' },
            { tier: 'Gold', color: 'text-yellow-400', border: 'border-yellow-500/30' },
            { tier: 'Platinum', color: 'text-cyan-300', border: 'border-cyan-500/30' },
            { tier: 'Diamond', color: 'text-blue-300', border: 'border-blue-500/30' },
            { tier: 'Founder', color: 'text-sats-orange-500', border: 'border-sats-orange-500/40' },
          ].map((t) => (
            <span key={t.tier} className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wide ${t.color} ${t.border}`}>
              {t.tier}
            </span>
          ))}
        </div>
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/40 font-bold">XP Progress — Basic</span>
            <span className="text-[10px] font-black text-sats-orange-500">340 / 500</span>
          </div>
          <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sats-orange-500 to-yellow-400 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'withdraw',
    icon: <ArrowUpRight className="w-5 h-5" />,
    label: 'Withdraw',
    title: 'Withdraw Your Sats',
    subtitle: 'Cash out to your Lightning wallet',
    description:
      'Once your Available balance reaches the minimum threshold, you can withdraw to any Lightning Network wallet. Generate a Lightning invoice in your wallet app, paste it here, and request payout.',
    highlight: 'Withdrawals are processed manually by admins and typically complete within 24 hours.',
    visual: (
      <div className="w-full space-y-2">
        <div className="bg-sats-orange-500/5 border border-sats-orange-500/20 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-sats-orange-500/50 mb-0.5">Available</p>
            <p className="text-xl font-black text-sats-orange-500">12,500</p>
            <p className="text-[9px] text-sats-orange-500/40">SATS</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ArrowUpRight className="w-5 h-5 text-sats-orange-500/40" />
            <span className="text-[9px] text-white/20">Lightning Network</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-1">
          {['Request', '→', 'Review', '→', 'Paid'].map((s, i) => (
            <span key={i} className={`text-[10px] font-bold ${i % 2 === 0 ? 'text-sats-orange-500' : 'text-white/15'}`}>{s}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'ready',
    icon: <CheckCircle2 className="w-5 h-5" />,
    label: "You're Set!",
    title: "You're Ready to Stack Sats! 🚀",
    subtitle: 'Start earning Bitcoin today',
    description:
      'You now know everything you need to start earning. Head to Browse Tasks to complete your first campaign, or try the Daily Quiz for a quick boost. Your Bitcoin journey starts now.',
    highlight: 'Tip: Complete the daily quiz every day — it takes 2 minutes and keeps your streak alive.',
    visual: (
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { icon: <LayoutGrid className="w-4 h-4" />, label: 'Browse Tasks', color: 'text-sats-orange-500', bg: 'bg-sats-orange-500/10 border-sats-orange-500/25' },
            { icon: <Lightbulb className="w-4 h-4" />, label: 'Daily Quiz', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/25' },
            { icon: <Gift className="w-4 h-4" />, label: 'Referrals', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/25' },
          ].map((a) => (
            <div key={a.label} className={`${a.bg} border rounded-xl p-3 flex flex-col items-center gap-1.5`}>
              <span className={a.color}>{a.icon}</span>
              <span className="text-[9px] font-bold text-white/50 text-center">{a.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-sats-orange-500" />
          <span className="text-sm font-black text-white">Go earn your first Sats!</span>
        </div>
      </div>
    ),
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING TOUR COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const step = STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const close = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      setCurrentStep(0);
      onClose();
    }, 200);
  }, [onClose]);

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    close();
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    close();
  };

  const next = () => {
    if (!isLast) setCurrentStep((s) => s + 1);
  };

  const prev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-200 ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#080808] border border-[#1e1e1e] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">

        {/* Top highlight */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-sats-orange-500/30 to-transparent pointer-events-none" />

        {/* Ambient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-sats-orange-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/25 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-sats-orange-500" />
            </div>
            <div>
              <p className="text-xs font-black text-white leading-none">SatsEarn Tour</p>
              <p className="text-[10px] text-white/25 mt-0.5">
                Step {currentStep + 1} of {STEPS.length}
              </p>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-all"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Progress bar ── */}
        <div className="h-0.5 bg-[#1a1a1a] shrink-0">
          <div
            className="h-full bg-sats-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Step dots (scrollable, desktop pill nav) ── */}
        <div className="hidden sm:flex items-center gap-1.5 px-6 py-3 border-b border-[#111] overflow-x-auto shrink-0">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              title={s.label}
              className={`shrink-0 transition-all duration-200 ${
                i === currentStep
                  ? 'px-3 py-1 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/30 text-[10px] font-black text-sats-orange-500'
                  : i < currentStep
                  ? 'w-5 h-5 rounded-full bg-sats-orange-500/20 border border-sats-orange-500/15 flex items-center justify-center'
                  : 'w-5 h-5 rounded-full bg-white/5 border border-white/8 flex items-center justify-center'
              }`}
            >
              {i === currentStep ? (
                s.label
              ) : i < currentStep ? (
                <CheckCircle2 className="w-2.5 h-2.5 text-sats-orange-500" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="relative px-6 py-5 overflow-y-auto flex-1">
          {/* Step icon + title */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${
              step.id === 'ready'
                ? 'bg-green-500/10 border-green-500/25 text-green-400'
                : 'bg-sats-orange-500/8 border-sats-orange-500/20 text-sats-orange-500'
            }`}>
              {step.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sats-orange-500/50 mb-0.5">
                {step.subtitle}
              </p>
              <h2 className="text-lg font-black text-white leading-snug">
                {step.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/45 leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Visual */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 mb-4">
            {step.visual}
          </div>

          {/* Highlight tip */}
          {step.highlight && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 bg-sats-orange-500/5 border border-sats-orange-500/15 rounded-xl">
              <Zap className="w-3.5 h-3.5 text-sats-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-sats-orange-500/70 leading-relaxed font-medium">
                {step.highlight}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer nav ── */}
        <div className="shrink-0 px-6 py-4 border-t border-[#1a1a1a] flex items-center gap-3">
          {/* Back */}
          <button
            onClick={prev}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1e1e1e] text-white/35 text-sm font-medium hover:text-white/70 hover:border-white/15 transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Skip (not on last) */}
          {!isLast && (
            <button
              onClick={handleSkip}
              className="text-xs text-white/20 hover:text-white/40 transition-colors font-medium"
            >
              Skip tour
            </button>
          )}

          {/* Next / Finish */}
          {isLast ? (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sats-orange-500 text-black text-sm font-black hover:bg-sats-orange-400 active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(238,139,18,0.3)]"
            >
              <span>Start Earning</span>
              <Zap className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sats-orange-500 text-black text-sm font-bold hover:bg-sats-orange-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(238,139,18,0.2)]"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOOK — auto-show on first login, exposes replay trigger
// ══════════════════════════════════════════════════════════════════════════════

export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Delay slightly so dashboard renders first
    const timer = setTimeout(() => {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) setIsOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const openTour = () => setIsOpen(true);
  const closeTour = () => setIsOpen(false);

  return { isOpen, openTour, closeTour };
}

// ══════════════════════════════════════════════════════════════════════════════
// REPLAY BUTTON — drop this wherever you want the "Take Tour" button
// ══════════════════════════════════════════════════════════════════════════════

interface TourButtonProps {
  onClick: () => void;
  variant?: 'pill' | 'icon';
}

export function TourButton({ onClick, variant = 'pill' }: TourButtonProps) {
  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        title="Take the tour"
        className="flex items-center justify-center w-8 h-8 rounded-xl border border-[#1a1a1a] text-white/30 hover:text-sats-orange-500 hover:border-sats-orange-500/25 hover:bg-sats-orange-500/5 transition-all"
      >
        <Lightbulb className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-sats-orange-500/20 bg-sats-orange-500/8 text-sats-orange-500 text-xs font-bold hover:bg-sats-orange-500/15 transition-all"
    >
      <Lightbulb className="w-3.5 h-3.5" />
      <span>How it works</span>
    </button>
  );
}