'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  Coins,
  Flame,
  HelpCircle,
  LayoutGrid,
  Lightbulb,
  PlayCircle,
  ShieldCheck,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'satsearn_onboarding_done';
const AUTO_OPEN_TRIGGER_KEY = 'satsearn_onboarding_auto_open_once';

type StepTone = 'orange' | 'blue' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan';

type Step = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  tone: StepTone;
  icon: React.ComponentType<{ className?: string }>;
  points: string[];
};

const STEPS: Step[] = [
  {
    id: 'welcome',
    eyebrow: 'Welcome',
    title: 'Earn Bitcoin with simple daily actions',
    description: 'SatsEarn lets you complete tasks, keep streaks, invite friends, and withdraw real sats from one place.',
    accent: 'A quick 7-step guide so you know exactly where to start.',
    tone: 'orange',
    icon: Zap,
    points: ['Complete tasks', 'Earn sats + XP', 'Withdraw when ready'],
  },
  {
    id: 'dashboard',
    eyebrow: 'Dashboard',
    title: 'Your dashboard is your main control center',
    description: 'Track your balances, activity, streak progress, and key stats without jumping across pages.',
    accent: 'Start here every day to know what to do next.',
    tone: 'blue',
    icon: LayoutGrid,
    points: ['Daily overview', 'Live balances', 'Quick access actions'],
  },
  {
    id: 'tasks',
    eyebrow: 'Tasks',
    title: 'Tasks are the main way to earn more sats',
    description: 'Open live campaigns, complete the required steps, and submit valid proof for review.',
    accent: 'In-progress tasks help you continue where you left off.',
    tone: 'emerald',
    icon: Trophy,
    points: ['Choose a live campaign', 'Submit proof properly', 'Get rewards after approval'],
  },
  {
    id: 'wallet',
    eyebrow: 'Wallet',
    title: 'Your wallet shows what is available, pending, and locked',
    description: 'Use the wallet page to monitor your real withdrawable sats and understand reward status clearly.',
    accent: 'Available balance is the amount ready for withdrawal.',
    tone: 'amber',
    icon: Wallet,
    points: ['Available sats', 'Pending review rewards', 'Locked reward tracking'],
  },
  {
    id: 'streaks',
    eyebrow: 'Streaks',
    title: 'Keep your streak active to unlock milestone rewards',
    description: 'Come back daily, maintain your streak, and collect progression rewards as you stay consistent.',
    accent: 'Consistency matters more than doing everything at once.',
    tone: 'rose',
    icon: Flame,
    points: ['Daily progress', 'Milestone rewards', 'Consistency boost'],
  },
  {
    id: 'referrals',
    eyebrow: 'Referrals',
    title: 'Invite friends and grow your earnings',
    description: 'Share your referral code and earn commission based on your current tier and referral activity.',
    accent: 'Your referral page explains current limits and commission by tier.',
    tone: 'violet',
    icon: Users,
    points: ['Share your code', 'Track your network', 'Earn tier-based commission'],
  },
  {
    id: 'security',
    eyebrow: 'Ready to start',
    title: 'Submit correctly, stay active, and earn smarter',
    description: 'Follow task instructions carefully, keep your account secure, and use the replay button anytime if you need this guide again.',
    accent: 'You can reopen this guide later from the dashboard.',
    tone: 'cyan',
    icon: ShieldCheck,
    points: ['Follow instructions', 'Avoid invalid submissions', 'Replay this guide anytime'],
  },
];

const TONE_STYLES: Record<StepTone, { glow: string; soft: string; chip: string; icon: string; border: string; button: string }> = {
  orange: {
    glow: 'from-orange-500/18 via-amber-500/10 to-transparent',
    soft: 'bg-orange-500/10',
    chip: 'border-orange-400/25 bg-orange-500/10 text-orange-200',
    icon: 'text-orange-300',
    border: 'border-orange-400/18',
    button: 'from-orange-400 to-amber-300 text-black',
  },
  blue: {
    glow: 'from-sky-500/18 via-blue-500/10 to-transparent',
    soft: 'bg-sky-500/10',
    chip: 'border-sky-400/25 bg-sky-500/10 text-sky-200',
    icon: 'text-sky-300',
    border: 'border-sky-400/18',
    button: 'from-sky-400 to-blue-300 text-black',
  },
  emerald: {
    glow: 'from-emerald-500/18 via-green-500/10 to-transparent',
    soft: 'bg-emerald-500/10',
    chip: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200',
    icon: 'text-emerald-300',
    border: 'border-emerald-400/18',
    button: 'from-emerald-400 to-lime-300 text-black',
  },
  violet: {
    glow: 'from-violet-500/18 via-fuchsia-500/10 to-transparent',
    soft: 'bg-violet-500/10',
    chip: 'border-violet-400/25 bg-violet-500/10 text-violet-200',
    icon: 'text-violet-300',
    border: 'border-violet-400/18',
    button: 'from-violet-400 to-fuchsia-300 text-black',
  },
  rose: {
    glow: 'from-rose-500/18 via-pink-500/10 to-transparent',
    soft: 'bg-rose-500/10',
    chip: 'border-rose-400/25 bg-rose-500/10 text-rose-200',
    icon: 'text-rose-300',
    border: 'border-rose-400/18',
    button: 'from-rose-400 to-pink-300 text-black',
  },
  amber: {
    glow: 'from-amber-500/18 via-yellow-500/10 to-transparent',
    soft: 'bg-amber-500/10',
    chip: 'border-amber-400/25 bg-amber-500/10 text-amber-200',
    icon: 'text-amber-300',
    border: 'border-amber-400/18',
    button: 'from-amber-300 to-yellow-200 text-black',
  },
  cyan: {
    glow: 'from-cyan-500/18 via-teal-500/10 to-transparent',
    soft: 'bg-cyan-500/10',
    chip: 'border-cyan-400/25 bg-cyan-500/10 text-cyan-200',
    icon: 'text-cyan-300',
    border: 'border-cyan-400/18',
    button: 'from-cyan-300 to-teal-200 text-black',
  },
};

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      }

      if (event.key === 'ArrowLeft') {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const step = STEPS[currentStep];
  const style = TONE_STYLES[step.tone];
  const StepIcon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const progress = useMemo(() => ((currentStep + 1) / STEPS.length) * 100, [currentStep]);

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, 'true');
      onClose();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 py-5 backdrop-blur-sm">
      <div className="relative flex h-[92vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[26px] border border-[#222] bg-[#070707] shadow-[0_32px_120px_rgba(0,0,0,0.58)] sm:h-[620px] lg:h-[652px] xl:h-[664px]">
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-br ${style.glow}`} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative z-10 flex items-center justify-between border-b border-[#171717] px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${style.border} ${style.soft} sm:h-11 sm:w-11`}>
              <PlayCircle className={`h-4 w-4 ${style.icon} sm:h-5 sm:w-5`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/35">SatsEarn Guide</p>
              <h2 className="text-sm font-black text-white sm:text-lg">Understand the platform in 7 quick steps</h2>
            </div>
          </div>

          <button
            onClick={handleSkip}
            aria-label="Skip guide"
            className="inline-flex h-9 min-w-[64px] shrink-0 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 text-xs font-bold text-gray-300 transition-colors hover:border-white/15 hover:text-white sm:h-10 sm:min-w-[78px] sm:px-4 sm:text-sm"
          >
            <span>Skip</span>
            <X className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-3 px-4 pt-3 sm:px-5 sm:pt-3.5 lg:px-6 lg:pt-4">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#121212]">
            <div className={`h-full rounded-full bg-gradient-to-r ${style.button} transition-all duration-300`} style={{ width: `${progress}%` }} />
          </div>
          <div className="min-w-[56px] text-right text-[11px] font-bold text-white/45 sm:min-w-[72px] sm:text-xs">
            {currentStep + 1} / {STEPS.length}
          </div>
        </div>

        <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-4 md:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-4 lg:py-4.5">
          <div className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-[#1b1b1b] bg-[#0c0c0c] p-4 sm:rounded-[28px] sm:p-5 lg:p-5.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] sm:px-3 sm:text-[11px] sm:tracking-[0.2em] ${style.chip}`}>
                  <StepIcon className="h-3.5 w-3.5" />
                  <span>{step.eyebrow}</span>
                </div>
                <h3 className="mt-3 max-w-[18ch] text-xl font-black leading-[1.08] text-white sm:mt-3.5 sm:max-w-[22ch] sm:text-[1.7rem] lg:mt-4 lg:text-[1.82rem]">
                  {step.title}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-6 text-gray-300 sm:mt-4 sm:text-[14px] sm:leading-6 lg:mt-4 lg:text-[13.5px] lg:leading-[1.55rem] xl:text-[14px] xl:leading-[1.65rem]">{step.description}</p>

            <div className={`mt-4 rounded-2xl border ${style.border} ${style.soft} px-3.5 py-3 sm:mt-4 sm:px-4 lg:mt-4`}>
              <p className={`text-[13px] font-semibold leading-5 ${style.icon} sm:text-sm lg:text-[13px] lg:leading-5`}>{step.accent}</p>
            </div>

            <div className="mt-4 grid gap-2.5 sm:mt-4 sm:gap-2.5 lg:mt-4 lg:gap-2.5">
              {step.points.slice(0, 2).map((point, index) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl border border-[#171717] bg-[#090909] px-3.5 py-3 sm:px-4 lg:px-3.5 lg:py-2.5">
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-black ${style.border} ${style.soft} ${style.icon} sm:h-7 sm:w-7 sm:text-xs`}>
                    {index + 1}
                  </div>
                  <p className="text-[13px] font-medium leading-5 text-gray-200 sm:text-sm sm:leading-6 lg:text-[13px] lg:leading-5">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden min-h-0 flex-col overflow-hidden rounded-[28px] border border-[#1b1b1b] bg-[#0a0a0a] p-5 sm:p-5 lg:flex lg:p-5">
            <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-3 lg:gap-3.5">
              <div className="flex items-center justify-between rounded-2xl border border-[#181818] bg-[#101010] px-4 py-3 lg:px-3.5 lg:py-2.5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Focus Area</p>
                  <p className="mt-1 text-sm font-bold text-white lg:text-[13px]">{step.eyebrow}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${style.border} ${style.soft} lg:h-10 lg:w-10`}>
                  <StepIcon className={`h-5 w-5 ${style.icon} lg:h-4.5 lg:w-4.5`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 lg:gap-2">
                <MiniCard icon={Coins} label="Rewards" value={step.id === 'wallet' ? 'Withdrawable' : 'Live earnings'} tone={style} />
                <MiniCard icon={HelpCircle} label="Why it matters" value="Easy to follow" tone={style} />
              </div>

              <div className="grid min-h-0 gap-2.5 rounded-[24px] border border-[#171717] bg-[linear-gradient(180deg,#0f0f0f_0%,#090909_100%)] p-4 sm:p-4 lg:p-3.5">
                <VisualStrip tone={style} stepId={step.id} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3 border-t border-[#171717] bg-[#090909] px-4 py-3 sm:px-6 sm:py-4">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className="inline-flex h-11 min-w-[96px] items-center justify-center gap-2 rounded-xl border border-[#3a3a3a] bg-[#121212] px-4 text-sm font-bold text-white transition-colors hover:border-white/20 hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-35 sm:w-[108px]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="hidden text-center text-xs font-bold uppercase tracking-[0.18em] text-white/25 lg:block">
            Learn once, replay anytime from dashboard
          </div>

          <button
            onClick={handleNext}
            className={`inline-flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${isLast ? 'from-sats-orange-500 via-orange-400 to-amber-300 text-black shadow-[0_16px_36px_rgba(249,115,22,0.32)]' : style.button} px-4 text-sm font-black transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-[132px]`}
          >
            {isLast ? 'Start Earning' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: ReturnType<typeof getToneStyles>;
}) {
  return (
    <div className="rounded-2xl border border-[#181818] bg-[#0d0d0d] px-4 py-3">
      <div className="flex items-center gap-2 text-white/35">
        <Icon className={`h-4 w-4 ${tone.icon}`} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-3 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function VisualStrip({
  tone,
  stepId,
}: {
  tone: ReturnType<typeof getToneStyles>;
  stepId: string;
}) {
  const commonPill = 'rounded-full border px-3 py-1 text-[11px] font-bold';

  if (stepId === 'dashboard') {
    return (
      <>
        <div className="grid grid-cols-3 gap-3">
          {['Available', 'Pending', 'Locked'].map((item, index) => (
            <div key={item} className="rounded-2xl border border-[#1d1d1d] bg-[#111] px-3 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">{item}</p>
              <p className={`mt-2 text-lg font-black ${index === 0 ? tone.icon : 'text-white'}`}>{index === 0 ? '12,540' : index === 1 ? '320' : '85'}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#0c0c0c] px-4 py-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/35">
            <span>Quick View</span>
            <span>Today</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#151515]">
            <div className={`h-2 rounded-full bg-gradient-to-r ${tone.button}`} style={{ width: '68%' }} />
          </div>
        </div>
      </>
    );
  }

  if (stepId === 'tasks') {
    return (
      <>
        <div className="grid gap-3">
          {['Open campaign', 'Submit proof', 'Wait for approval'].map((item, index) => (
            <div key={item} className="flex items-center justify-between rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-3">
              <span className="text-sm font-semibold text-white">{item}</span>
              <span className={`${commonPill} ${index === 0 ? tone.chip : 'border-[#222] bg-[#131313] text-white/45'}`}>{index === 0 ? 'Now' : index === 1 ? 'Proof' : 'Review'}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (stepId === 'wallet') {
    return (
      <>
        <div className="rounded-[24px] border border-[#1c1c1c] bg-[#111] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Wallet status</p>
          <p className={`mt-3 text-3xl font-black ${tone.icon}`}>24,500 sats</p>
          <p className="mt-1 text-sm text-gray-400">Ready to withdraw</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#1c1c1c] bg-[#0e0e0e] px-4 py-3 text-sm font-semibold text-white">Pending rewards</div>
          <div className="rounded-2xl border border-[#1c1c1c] bg-[#0e0e0e] px-4 py-3 text-sm font-semibold text-white">Withdrawal rules</div>
        </div>
      </>
    );
  }

  if (stepId === 'streaks') {
    return (
      <>
        <div className="flex items-center justify-between rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-3">
          {['D1', 'D2', 'D3', 'D4', 'D5'].map((day, index) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-black ${index < 3 ? `${tone.border} ${tone.soft} ${tone.icon}` : 'border-[#252525] text-white/35'}`}>
                {index < 3 ? '✓' : day}
              </div>
              <span className="text-[10px] font-bold text-white/35">{day}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#0c0c0c] px-4 py-4 text-sm text-gray-300">
          Return daily to protect your streak and unlock milestone rewards.
        </div>
      </>
    );
  }

  if (stepId === 'referrals') {
    return (
      <>
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Your code</p>
          <p className={`mt-3 text-xl font-black tracking-[0.25em] ${tone.icon}`}>ABCD123</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#1c1c1c] bg-[#0d0d0d] px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Invites</p>
            <p className="mt-2 text-lg font-black text-white">14</p>
          </div>
          <div className="rounded-2xl border border-[#1c1c1c] bg-[#0d0d0d] px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Commission</p>
            <p className={`mt-2 text-lg font-black ${tone.icon}`}>20%</p>
          </div>
        </div>
      </>
    );
  }

  if (stepId === 'security') {
    return (
      <>
        <div className="grid gap-3">
          {['Submit real proof', 'Read task details carefully', 'Use dashboard replay anytime'].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${tone.border} ${tone.soft}`}>
                <ShieldCheck className={`h-4 w-4 ${tone.icon}`} />
              </div>
              <span className="text-sm font-semibold text-white">{item}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rounded-[24px] border border-[#1c1c1c] bg-[#101010] p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tone.border} ${tone.soft}`}>
            <Zap className={`h-5 w-5 ${tone.icon}`} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Getting started</p>
            <p className="mt-1 text-base font-bold text-white">Understand the earning flow</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['Tasks', 'Streak', 'Wallet'].map((item) => (
          <div key={item} className="rounded-2xl border border-[#1d1d1d] bg-[#0d0d0d] px-3 py-4 text-center text-sm font-bold text-white">
            {item}
          </div>
        ))}
      </div>
    </>
  );
}

function getToneStyles(tone: StepTone) {
  return TONE_STYLES[tone];
}

export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const done = localStorage.getItem(STORAGE_KEY);
      const shouldAutoOpen = sessionStorage.getItem(AUTO_OPEN_TRIGGER_KEY) === 'true';

      if (!done && shouldAutoOpen) {
        sessionStorage.removeItem(AUTO_OPEN_TRIGGER_KEY);
        setIsOpen(true);
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  const openTour = () => setIsOpen(true);
  const closeTour = () => setIsOpen(false);

  return { isOpen, openTour, closeTour };
}

export function markOnboardingForFirstAutoOpen() {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTO_OPEN_TRIGGER_KEY, 'true');
}

interface TourButtonProps {
  onClick: () => void;
  variant?: 'pill' | 'icon';
}

export function TourButton({ onClick, variant = 'pill' }: TourButtonProps) {
  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        title="Open guide"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] text-gray-400 transition-all hover:border-sats-orange-500/30 hover:bg-sats-orange-500/10 hover:text-sats-orange-400"
      >
        <PlayCircle className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-xs font-bold text-sats-orange-300 transition-colors hover:bg-sats-orange-500/15"
    >
      <Lightbulb className="h-3.5 w-3.5" />
      <span className='hidden md:inline'>How it works</span>
    </button>
  );
}
