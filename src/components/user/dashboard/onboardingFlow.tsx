'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bitcoin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coins,
  Flame,
  Gift,
  HelpCircle,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  PlayCircle,
  Shield,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'satsearn_onboarding_done';
const AUTO_OPEN_TRIGGER_KEY = 'satsearn_onboarding_auto_open_once';

type StepTone = 'orange' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan';

type Step = {
  id: string;
  number: number;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  tone: StepTone;
  icon: React.ComponentType<{ className?: string }>;
  leftCards: { index: number; title: string; text: string; muted?: boolean }[];
  footerFeatures: { title: string; text: string; icon: React.ComponentType<{ className?: string }> }[];
};

const STEPS: Step[] = [
  {
    id: 'welcome',
    number: 1,
    eyebrow: 'WELCOME',
    title: 'Earn Bitcoin with simple daily actions',
    description: 'SatsEarn lets you complete tasks, keep streaks, invite friends, and withdraw real sats from one place.',
    accent: 'A quick 7-step guide so you know exactly where to start.',
    tone: 'orange',
    icon: Bitcoin,
    leftCards: [
      { index: 1, title: 'Complete tasks', text: 'Finish simple tasks and submit proof.' },
      { index: 2, title: 'Earn sats + XP', text: 'Earn sats, gain XP, and level up.' },
    ],
    footerFeatures: [
      { title: 'First earnings fast', text: 'Most users earn their first sats in under 5 minutes.', icon: Zap },
      { title: 'Secure & trusted', text: 'Your account and rewards are safe and protected.', icon: ShieldCheck },
      { title: 'Community driven', text: 'Join thousands of active earners every day.', icon: Users },
      { title: 'Real Bitcoin', text: 'Withdraw real sats directly to your wallet.', icon: Star },
    ],
  },
  {
    id: 'dashboard',
    number: 2,
    eyebrow: 'DASHBOARD',
    title: 'Your dashboard is your main control center',
    description: 'Track your balances, activity, streak progress, and key stats without jumping across pages.',
    accent: 'Open this page daily to stay updated and never miss an opportunity.',
    tone: 'blue',
    icon: LayoutGrid,
    leftCards: [
      { index: 1, title: 'Daily overview', text: 'Get a snapshot of your earnings and activity.' },
      { index: 2, title: 'Live balances', text: 'Check available, pending and locked sats.' },
    ],
    footerFeatures: [
      { title: 'All-in-one overview', text: 'Everything you need in one place.', icon: LayoutGrid },
      { title: 'Live & real-time', text: 'Stats update in real time.', icon: BarChart3 },
      { title: 'Stay informed', text: 'Never miss important updates or rewards.', icon: ShieldCheck },
      { title: 'Performance at a glance', text: 'Track your growth and progress easily.', icon: Clock3 },
    ],
  },
  {
    id: 'tasks',
    number: 3,
    eyebrow: 'TASKS',
    title: 'Tasks are the main way to earn more sats',
    description: 'Open live campaigns, complete the required steps, and submit valid proof for review.',
    accent: 'In-progress tasks help you continue where you left off.',
    tone: 'emerald',
    icon: Trophy,
    leftCards: [
      { index: 1, title: 'Choose a live campaign', text: 'Browse and select an active campaign.' },
      { index: 2, title: 'Submit proof properly', text: 'Complete all steps and submit valid proof.' },
    ],
    footerFeatures: [
      { title: 'Multiple campaigns', text: 'New tasks added regularly.', icon: ListChecks },
      { title: 'Fair rewards', text: 'Earn sats for real completed work.', icon: Coins },
      { title: 'Transparent process', text: 'Every submission goes through review.', icon: Shield },
      { title: 'Stay consistent', text: 'More tasks completed = more earnings.', icon: Target },
    ],
  },
  {
    id: 'wallet',
    number: 4,
    eyebrow: 'WALLET',
    title: 'Your wallet shows what is available, pending, and locked',
    description: 'Use the wallet page to monitor your real withdrawable sats and understand reward status clearly.',
    accent: 'Available balance is the amount ready for withdrawal.',
    tone: 'amber',
    icon: Wallet,
    leftCards: [
      { index: 1, title: 'Available sats', text: 'These are ready and available to withdraw to your Bitcoin wallet.' },
      { index: 2, title: 'Pending review rewards', text: 'Rewards that are under review and will be moved to available once approved.' },
      { index: 0, title: 'Locked sats are restricted due to rules, disputes, or other platform policies.', text: '', muted: true },
    ],
    footerFeatures: [],
  },
  {
    id: 'streaks',
    number: 5,
    eyebrow: 'STREAKS',
    title: 'Keep your streak active to unlock milestone rewards',
    description: 'Come back daily, maintain your streak, and collect progression rewards as you stay consistent.',
    accent: 'Consistency matters more than doing everything at once.',
    tone: 'rose',
    icon: Flame,
    leftCards: [
      { index: 1, title: 'Daily progress', text: 'Return daily to protect your streak and keep it growing.' },
      { index: 2, title: 'Milestone rewards', text: 'Reach key streak milestones to unlock exclusive rewards.' },
    ],
    footerFeatures: [
      { title: 'Protect your streak', text: 'Do not miss a day to keep your streak safe.', icon: ShieldCheck },
      { title: 'Unlock milestones', text: 'Higher streaks bring bigger rewards.', icon: BarChart3 },
      { title: 'Progress & rewards', text: 'Stay consistent and get rewarded more.', icon: Gift },
      { title: 'Build the habit', text: 'Small daily actions create big results.', icon: Star },
    ],
  },
  {
    id: 'referrals',
    number: 6,
    eyebrow: 'REFERRALS',
    title: 'Invite friends and grow your earnings',
    description: 'Share your referral code and earn commission based on your current tier and referral activity.',
    accent: 'Your referral page explains current limits and commission by tier.',
    tone: 'violet',
    icon: Users,
    leftCards: [
      { index: 1, title: 'Share your code', text: 'Invite friends using your unique code.' },
      { index: 2, title: 'Track your network', text: 'Monitor invites, activity, and earnings.' },
    ],
    footerFeatures: [
      { title: 'Grow together', text: 'Help friends discover SatsEarn and earn together.', icon: Users },
      { title: 'Higher activity, higher rewards', text: 'Active friends lead to more commissions for you.', icon: Coins },
      { title: 'Secure & transparent', text: 'All referrals and earnings are tracked securely.', icon: ShieldCheck },
      { title: 'Bonus opportunities', text: 'Special bonuses and events for top referrers.', icon: Trophy },
    ],
  },
  {
    id: 'security',
    number: 7,
    eyebrow: 'READY TO START',
    title: 'Submit correctly, stay active, and earn smarter',
    description: 'Follow task instructions carefully, keep your account secure, and use the replay button anytime if you need this guide again.',
    accent: 'You can reopen this guide later from the dashboard.',
    tone: 'cyan',
    icon: ShieldCheck,
    leftCards: [
      { index: 1, title: 'Follow instructions', text: 'Read every task detail and follow all instructions carefully.' },
      { index: 2, title: 'Avoid invalid submissions', text: 'Wrong or fake submissions may lead to rejection or penalties.' },
      { index: 3, title: 'Submit real proof', text: 'Upload valid and clear proof for review.' },
      { index: 4, title: 'Stay active', text: 'Consistent activity helps you earn more and unlock better opportunities.' },
    ],
    footerFeatures: [],
  },
];

const TONE_STYLES: Record<StepTone, {
  border: string;
  soft: string;
  icon: string;
  chip: string;
  progress: string;
  glow: string;
  button: string;
  footer: string;
}> = {
  orange: {
    border: 'border-orange-500/25',
    soft: 'bg-orange-500/10',
    icon: 'text-orange-300',
    chip: 'border-orange-500/25 bg-orange-500/12 text-orange-300',
    progress: 'from-orange-400 to-amber-300',
    glow: 'from-orange-500/15 via-orange-500/5 to-transparent',
    button: 'from-orange-400 to-amber-300 text-black',
    footer: 'from-orange-500/7 via-transparent to-transparent',
  },
  blue: {
    border: 'border-sky-500/25',
    soft: 'bg-sky-500/10',
    icon: 'text-sky-300',
    chip: 'border-sky-500/25 bg-sky-500/12 text-sky-300',
    progress: 'from-sky-400 to-blue-300',
    glow: 'from-sky-500/15 via-blue-500/5 to-transparent',
    button: 'from-sky-400 to-blue-300 text-black',
    footer: 'from-sky-500/7 via-transparent to-transparent',
  },
  emerald: {
    border: 'border-emerald-500/25',
    soft: 'bg-emerald-500/10',
    icon: 'text-emerald-300',
    chip: 'border-emerald-500/25 bg-emerald-500/12 text-emerald-300',
    progress: 'from-emerald-400 to-lime-300',
    glow: 'from-emerald-500/15 via-green-500/5 to-transparent',
    button: 'from-emerald-400 to-lime-300 text-black',
    footer: 'from-emerald-500/7 via-transparent to-transparent',
  },
  amber: {
    border: 'border-amber-500/25',
    soft: 'bg-amber-500/10',
    icon: 'text-amber-300',
    chip: 'border-amber-500/25 bg-amber-500/12 text-amber-300',
    progress: 'from-amber-300 to-yellow-200',
    glow: 'from-amber-500/15 via-yellow-500/5 to-transparent',
    button: 'from-amber-300 to-yellow-200 text-black',
    footer: 'from-amber-500/7 via-transparent to-transparent',
  },
  rose: {
    border: 'border-pink-500/25',
    soft: 'bg-pink-500/10',
    icon: 'text-pink-300',
    chip: 'border-pink-500/25 bg-pink-500/12 text-pink-300',
    progress: 'from-pink-400 to-rose-300',
    glow: 'from-pink-500/15 via-rose-500/5 to-transparent',
    button: 'from-pink-400 to-rose-300 text-black',
    footer: 'from-pink-500/7 via-transparent to-transparent',
  },
  violet: {
    border: 'border-violet-500/25',
    soft: 'bg-violet-500/10',
    icon: 'text-violet-300',
    chip: 'border-violet-500/25 bg-violet-500/12 text-violet-300',
    progress: 'from-violet-400 to-fuchsia-300',
    glow: 'from-violet-500/15 via-fuchsia-500/5 to-transparent',
    button: 'from-violet-500 to-fuchsia-300 text-white',
    footer: 'from-violet-500/7 via-transparent to-transparent',
  },
  cyan: {
    border: 'border-cyan-500/25',
    soft: 'bg-cyan-500/10',
    icon: 'text-cyan-300',
    chip: 'border-cyan-500/25 bg-cyan-500/12 text-cyan-300',
    progress: 'from-cyan-400 to-teal-300',
    glow: 'from-cyan-500/15 via-teal-500/5 to-transparent',
    button: 'from-amber-300 to-yellow-200 text-black',
    footer: 'from-cyan-500/7 via-transparent to-transparent',
  },
};

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export function OnboardingTour({ isOpen, onClose, referralCode = '' }: OnboardingTourProps) {
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
    if (!isOpen) setCurrentStep(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      if (event.key === 'ArrowLeft') setCurrentStep((prev) => Math.max(prev - 1, 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const step = STEPS[currentStep];
  const tone = TONE_STYLES[step.tone];
  const GuideIcon = step.icon;
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
    if (!isFirst) setCurrentStep((prev) => prev - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/82 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-5">
      <div className="relative flex h-[95vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[30px] border border-[#2a2a2a] bg-[#060606] shadow-[0_32px_120px_rgba(0,0,0,0.7)]">
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-r ${tone.glow}`} />

        <div className="relative z-10 border-b border-[#171717] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${tone.border} ${tone.soft}`}>
                <GuideIcon className={`h-4.5 w-4.5 ${tone.icon}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${tone.icon}`}>SatsEarn Guide</p>
                <h2 className="truncate text-base font-black text-white sm:text-[1.05rem]">Understand the platform in 7 quick steps</h2>
              </div>
            </div>

            <button
              onClick={handleSkip}
              aria-label="Skip guide"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 text-sm font-bold text-gray-200 transition-all hover:border-white/15 hover:text-white"
            >
              <span>Skip</span>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#111]">
              <div className={`h-full rounded-full bg-gradient-to-r ${tone.progress} transition-all duration-300`} style={{ width: `${progress}%` }} />
            </div>
            <div className="min-w-[48px] text-right text-sm font-bold text-white/60">
              {currentStep + 1} / {STEPS.length}
            </div>
          </div>
        </div>
        <div className="relative z-10 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
          <div className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="rounded-[28px] border border-[#1b1b1b] bg-[#0b0b0b] p-4 sm:p-5 lg:p-6">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${tone.chip}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${tone.soft} ${tone.icon}`}>{step.number}</span>
                <span>{step.eyebrow}</span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="max-w-[16ch] text-[2rem] font-black leading-[1.08] text-white sm:max-w-[14ch] sm:text-[2.4rem]">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-sm leading-7 text-gray-300 sm:text-[1rem]">{step.description}</p>
                </div>
                {step.id === 'welcome' && (
                  <div className="hidden shrink-0 lg:flex">
                    <WelcomeCoin tone={tone} />
                  </div>
                )}
              </div>

              <div className={`mt-5 rounded-2xl border ${tone.border} ${tone.soft} px-4 py-3.5`}>
                <p className={`text-sm font-semibold ${tone.icon}`}>{step.accent}</p>
              </div>

              <div className="mt-5 space-y-3">
                {step.leftCards.map((item) => (
                  <LeftInfoCard key={`${step.id}-${item.index}-${item.title}`} item={item} tone={tone} />
                ))}

                {step.id === 'referrals' && (
                  <div className="hidden lg:block">
                    <ReferralInsightCard tone={tone} />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#1b1b1b] bg-[#0b0b0b] p-4 sm:p-5 lg:p-6">
              <RightSlidePanel step={step} tone={tone} referralCode={referralCode} />
            </div>
          </div>

          <div className={`mt-4 rounded-[24px] border border-[#1b1b1b] bg-gradient-to-r ${tone.footer} bg-[#0b0b0b] p-4`}>
            {step.footerFeatures.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {step.footerFeatures.map((feature) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${tone.border} ${tone.soft}`}>
                        <FeatureIcon className={`h-4 w-4 ${tone.icon}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{feature.title}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-400">{feature.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`rounded-2xl border ${tone.border} ${tone.soft} px-4 py-3 text-sm font-semibold ${tone.icon}`}>
                {step.id === 'wallet'
                  ? 'Wallet balances help you understand what is ready now and what is still under review.'
                  : 'Correct actions today = more sats tomorrow.'}
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 border-t border-[#171717] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
          <div className="flex  gap-3 flex-row items-center justify-between">
            <div className="order-1 flex items-center justify-between gap-3 md:order-1 md:justify-start">
              <button
                onClick={handleBack}
                disabled={isFirst}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-[#252525] bg-[#0f0f0f] px-4 text-sm font-bold text-gray-200 transition-all hover:border-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <p className="hidden items-center gap-2 text-sm text-gray-500 md:flex">
                <HelpCircle className="h-4 w-4" />
                <span>You can replay this guide anytime from Dashboard</span>
              </p>
            </div>

            <button
              onClick={handleNext}
              className={`order-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-6 text-sm font-black shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:scale-[1.01] md:order-2 ${tone.button}`}
            >
              <span>{isLast ? 'Start Earning' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftInfoCard({
  item,
  tone,
}: {
  item: Step['leftCards'][number];
  tone: ReturnType<typeof getToneStyles>;
}) {
  if (item.muted) {
    return (
      <div className="rounded-2xl border border-[#1d1d1d] bg-[#0e0e0e] px-4 py-4 text-gray-400">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#242424] bg-[#121212]">
            <AlertCircle className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <p className="text-sm leading-6">{item.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-4 transition-all hover:border-[#2c2c2c]">
      <div className="flex min-w-0 items-start gap-3">
        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-black ${tone.border} ${tone.soft} ${tone.icon}`}>
          {item.index}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">{item.title}</p>
          <p className="mt-1 text-sm leading-6 text-gray-400">{item.text}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-gray-600" />
    </div>
  );
}

function RightSlidePanel({
  step,
  tone,
  referralCode,
}: {
  step: Step;
  tone: ReturnType<typeof getToneStyles>;
  referralCode: string;
}) {
  const FocusIcon = step.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Focus Area</p>
          <p className="mt-1 text-xl font-bold text-white">{step.id === 'security' ? 'Ready to start' : step.eyebrow.charAt(0) + step.eyebrow.slice(1).toLowerCase()}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${tone.border} ${tone.soft}`}>
          <FocusIcon className={`h-5 w-5 ${tone.icon}`} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MiniMetric tone={tone} title="Rewards" value={step.id === 'wallet' ? 'Withdrawable' : 'Live earnings'} icon={Gift} />
        <MiniMetric tone={tone} title="Why it matters" value="Easy to follow" icon={HelpCircle} />
      </div>

      <RightVisualContent step={step} tone={tone} referralCode={referralCode} />
    </div>
  );
}

function MiniMetric({
  tone,
  title,
  value,
  icon: Icon,
}: {
  tone: ReturnType<typeof getToneStyles>;
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${tone.icon}`} />
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">{title}</p>
      </div>
      <p className="mt-3 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function RightVisualContent({
  step,
  tone,
  referralCode,
}: {
  step: Step;
  tone: ReturnType<typeof getToneStyles>;
  referralCode: string;
}) {
  if (step.id === 'welcome') {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tone.border} ${tone.soft}`}>
              <ListChecks className={`h-4.5 w-4.5 ${tone.icon}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Getting started</p>
              <p className="mt-1 text-sm font-bold text-white">Understand the earning flow</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <FlowPill label="Tasks" icon={ListChecks} tone={tone} />
          <ChevronRight className="h-4 w-4 text-gray-600" />
          <FlowPill label="Streak" icon={Flame} tone={TONE_STYLES.rose} />
          <ChevronRight className="h-4 w-4 text-gray-600" />
          <FlowPill label="Wallet" icon={Wallet} tone={TONE_STYLES.amber} />
        </div>

        <div className={`hidden lg:block rounded-2xl border ${tone.border} ${tone.soft} p-4`}>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Why users stay</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
              <p className={`text-lg font-black ${tone.icon}`}>Daily flow</p>
              <p className="mt-1 text-sm leading-6 text-gray-400">Tasks, streaks, referrals, and wallet tracking all work together in one loop.</p>
            </div>
            <div className="rounded-2xl border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
              <p className={`text-lg font-black ${tone.icon}`}>Real progress</p>
              <p className="mt-1 text-sm leading-6 text-gray-400">Every valid action grows your sats, XP, tier progress, and long-term earning power.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step.id === 'dashboard') return <DashboardPreview tone={tone} />;
  if (step.id === 'tasks') return <TasksPreview tone={tone} />;
  if (step.id === 'wallet') return <WalletPreview tone={tone} />;
  if (step.id === 'streaks') return <StreakPreview tone={tone} />;
  if (step.id === 'referrals') return <ReferralPreview tone={tone} referralCode={referralCode} />;
  return <SecurityPreview tone={tone} />;
}
function FlowPill({
  label,
  icon: Icon,
  tone,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: ReturnType<typeof getToneStyles>;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`flex h-11 w-11 items-center justify-center rounded-full border ${tone.border} ${tone.soft}`}>
        <Icon className={`h-4.5 w-4.5 ${tone.icon}`} />
      </div>
      <span className="text-xs font-bold text-white">{label}</span>
    </div>
  );
}

function ReferralInsightCard({ tone }: { tone: ReturnType<typeof getToneStyles> }) {
  return (
    <div className={`rounded-2xl border ${tone.border} ${tone.soft} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${tone.border} bg-[#111]`}>
          <Users className={`h-4.5 w-4.5 ${tone.icon}`} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Referral tip</p>
          <p className="mt-1 text-sm font-bold text-white">Active friends matter more than just invites</p>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            The best results come when your referrals stay active, complete tasks, and keep building their streaks.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Best use</p>
          <p className="mt-1 text-sm font-semibold text-white">Share with people who will actually use the platform</p>
        </div>
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Long-term gain</p>
          <p className="mt-1 text-sm font-semibold text-white">A strong network can become one of your steadiest earning channels</p>
        </div>
      </div>
    </div>
  );
}

function WelcomeCoin({ tone }: { tone: ReturnType<typeof getToneStyles> }) {
  return (
    <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[28px] border border-[#1d1d1d] bg-[radial-gradient(circle_at_50%_35%,rgba(255,184,0,0.18),transparent_46%),linear-gradient(180deg,#101010,#090909)]">
      
      
      {/* FIXED: Wrapper now fills the parent (absolute inset-0) and has z-10 */}
      <div className="absolute inset-0 z-10 drop-shadow-[0_0_22px_rgba(255,184,0,0.2)]">
        <Image
          src="/onboarding/bitcoin_onboarding.png"
          alt="Bitcoin onboarding"
          fill
          // FIXED: object-cover forces the image to fill the card edges, hiding the rectangular box
          className="object-cover" 
          sizes="180px"
          unoptimized
        />
      </div>
      
      {/* Added z-20 and pointer-events-none so the overlay sits perfectly on top of the image */}
      <div className={`absolute inset-0 z-20 bg-gradient-to-b ${tone.glow} opacity-60 pointer-events-none`} />
    </div>
  );
}

function DashboardPreview({ tone }: { tone: ReturnType<typeof getToneStyles> }) {
  return (
    <div className="space-y-3 rounded-[24px] border border-[#1d1d1d] bg-[#0f0f0f] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className={`h-4 w-4 ${tone.icon}`} />
          <span className="text-sm font-bold text-white">Dashboard</span>
        </div>
        <div className="h-2 w-2 rounded-full bg-red-400" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Available', '12,540'],
          ['Pending', '320'],
          ['Locked', '85'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#1d1d1d] bg-[#111] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">{label}</p>
            <p className={`mt-2 text-2xl font-black ${label === 'Available' ? tone.icon : 'text-white'}`}>{value}</p>
            <p className="text-[11px] text-gray-500">sats</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] p-4">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Earnings Overview</span>
          <span>7 Days</span>
        </div>
        <div className="mt-4 flex h-24 items-end gap-3">
          {[50, 60, 70, 65, 75, 90, 80].map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative h-16 w-full flex justify-center align-middle">
                <div className={`absolute bottom-0 w-[60%] rounded-xl bg-gradient-to-t ${tone.progress}`} style={{ height: `${height}%` }} />
              </div>
              <span className="text-[10px] text-gray-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-2xl border ${tone.border} ${tone.soft} px-4 py-3 text-sm font-semibold ${tone.icon}`}>
        Tip: Check your dashboard first every day.
      </div>
    </div>
  );
}

function TasksPreview({ tone }: { tone: ReturnType<typeof getToneStyles> }) {
  return (
    <div className="space-y-3 rounded-[24px] border border-[#1d1d1d] bg-[#0f0f0f] p-4">
      <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${tone.icon}`}>How tasks work</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Choose', icon: Trophy },
          { label: 'Complete', icon: ListChecks },
          { label: 'Submit', icon: ArrowRight },
          { label: 'Earn', icon: Bitcoin },
        ].map(({ label, icon: StepIcon }) => {
          return (
            <div key={label} className="space-y-2">
              <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border ${tone.border} ${tone.soft}`}>
                <StepIcon className={`h-4.5 w-4.5 ${tone.icon}`} />
              </div>
              <p className="text-xs font-bold text-white">{label}</p>
            </div>
          );
        })}
      </div>
      <div className={`rounded-2xl border ${tone.border} ${tone.soft} p-4`}>
        <ul className="space-y-3 text-sm text-white">
          <li className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 ${tone.icon}`} /> Follow instructions carefully</li>
          <li className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 ${tone.icon}`} /> Submit real & valid proof</li>
          <li className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 ${tone.icon}`} /> Wait for review and approval</li>
        </ul>
      </div>
      <div className={`rounded-2xl border ${tone.border} ${tone.soft} px-4 py-3 text-sm font-semibold ${tone.icon}`}>
        Honesty matters. Fake submissions may lead to penalties.
      </div>
    </div>
  );
}

function WalletPreview({ tone }: { tone: ReturnType<typeof getToneStyles> }) {
  return (
    <div className="space-y-3 rounded-[24px] border border-[#1d1d1d] bg-[#0f0f0f] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Wallet Overview</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Available', '24,500'],
          ['Pending', '3,250'],
          ['Locked', '1,200'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#1d1d1d] bg-[#111] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">{label}</p>
            <p className={`mt-2 text-2xl font-black ${label !== 'Locked' ? tone.icon : 'text-white'}`}>{value}</p>
            <p className="text-[11px] text-gray-500">sats</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">Your Balance Status</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#1b1b1b]">
          <div className="flex h-full w-full overflow-hidden rounded-full">
            <div className="h-full bg-yellow-400" style={{ width: '67%' }} />
            <div className="h-full bg-orange-400" style={{ width: '24%' }} />
            <div className="h-full bg-gray-500" style={{ width: '9%' }} />
          </div>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-gray-300">
          <div className="flex items-center justify-between"><span>Available</span><span>24,500 sats</span></div>
          <div className="flex items-center justify-between"><span>Pending</span><span>3,250 sats</span></div>
          <div className="flex items-center justify-between"><span>Locked</span><span>1,200 sats</span></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-3 text-sm font-semibold text-white">Pending rewards</div>
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-3 text-sm font-semibold text-white">Withdrawal rules</div>
      </div>
    </div>
  );
}
function StreakPreview({ tone }: { tone: ReturnType<typeof getToneStyles> }) {
  return (
    <div className="space-y-3 rounded-[24px] border border-[#1d1d1d] bg-[#0f0f0f] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Your Streak Progress</p>
      <div className="grid grid-cols-5 gap-2">
        {['D1', 'D2', 'D3', 'D4', 'D5'].map((day, index) => (
          <div key={day} className="text-center">
            <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border ${index < 3 ? `${tone.border} ${tone.soft}` : 'border-[#2a2a2a] bg-[#111]'}`}>
              <CheckCircle2 className={`h-4.5 w-4.5 ${index < 3 ? tone.icon : 'text-gray-600'}`} />
            </div>
            <p className="mt-2 text-xs font-bold text-white/70">{day}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Best Streak Rewards</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            ['7 Days', '+ 500 sats'],
            ['30 Days', '+ 2,500 sats'],
            ['60 Days', '+ 10,000 sats'],
          ].map(([title, value]) => (
            <div key={title} className="rounded-2xl border border-[#1d1d1d] bg-[#111] px-3 py-4 text-center">
              <Flame className={`mx-auto h-5 w-5 ${tone.icon}`} />
              <p className="mt-3 text-sm font-bold text-white">{title}</p>
              <p className="mt-1 text-xs text-gray-400">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-2xl border ${tone.border} ${tone.soft} px-4 py-3 text-sm font-semibold ${tone.icon}`}>
        Return daily to protect your streak and unlock milestone rewards.
      </div>
    </div>
  );
}

function ReferralPreview({ tone, referralCode }: { tone: ReturnType<typeof getToneStyles>; referralCode: string }) {
  const displayCode = referralCode?.trim() || 'ABCD123';

  return (
    <div className="space-y-3 rounded-[24px] border border-[#1d1d1d] bg-[#0f0f0f] p-4">
      <div className="rounded-2xl border border-[#2a2050] bg-[#131020] px-4 py-4">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Your Referral Code</p>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-violet-500/20 bg-[#171129] px-4 py-3">
          <span className={`text-3xl font-black tracking-[0.2em] ${tone.icon}`}>{displayCode}</span>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tone.border} ${tone.soft}`}>
            <Gift className={`h-4.5 w-4.5 ${tone.icon}`} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Invites</p>
          <p className="mt-2 text-3xl font-black text-white">14</p>
          <p className="text-xs text-gray-400">Total friends invited</p>
        </div>
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Commission</p>
          <p className={`mt-2 text-3xl font-black ${tone.icon}`}>20%</p>
          <p className="text-xs text-gray-400">On eligible earnings</p>
        </div>
      </div>
      <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">Referral Impact</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Invite Friends', icon: Users },
            { label: 'Friends Stay Active', icon: BarChart3 },
            { label: 'You Earn Commission', icon: Coins },
          ].map(({ label, icon: ItemIcon }) => {
            return (
              <div key={label} className="space-y-3">
                <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border ${tone.border} ${tone.soft}`}>
                  <ItemIcon className={`h-4.5 w-4.5 ${tone.icon}`} />
                </div>
                <p className="text-sm font-bold text-white">{label}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-gray-500">
          Preview numbers here are sample data to explain how referred users, activity, and commission can appear.
        </p>
      </div>
    </div>
  );
}

function SecurityPreview({ tone }: { tone: ReturnType<typeof getToneStyles> }) {
  return (
    <div className="space-y-3 rounded-[24px] border border-[#1d1d1d] bg-[#0f0f0f] p-4">
      <div className="space-y-3">
        {[
          ['Submit real proof', 'Upload valid and clear proof for review.'],
          ['Read task details carefully', 'Understand requirements before submitting.'],
          ['Use dashboard replay anytime', 'Replay this guide anytime from the dashboard.'],
          ['Keep your account secure', 'Enable 2FA and never share your password.'],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-[#1d1d1d] bg-[#101010] px-4 py-4">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${tone.border} ${tone.soft}`}>
                <ShieldCheck className={`h-4.5 w-4.5 ${tone.icon}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-gray-400">{text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#1d1d1d] bg-[#101010] p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">Your Progress</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Tasks Done', value: '28', icon: Users },
            { label: 'Current Streak', value: '5 Days', icon: Flame },
            { label: 'Sats Earned', value: '12,540', icon: Star },
            { label: 'Tier', value: 'Gold', icon: Trophy },
          ].map(({ label, value, icon: StatIcon }) => {
            return (
              <div key={label} className="rounded-2xl border border-[#1d1d1d] bg-[#0f0f0f] px-3 py-4">
                <StatIcon className={`h-4.5 w-4.5 ${tone.icon}`} />
                <p className="mt-3 text-[10px] font-black uppercase  tracking-[0.16em] text-white/30">{label}</p>
                <p className={`mt-2 text-xl font-black ${label === 'Tier' ? 'text-amber-300' : 'text-white'}`}>{value}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`rounded-2xl border ${tone.border} ${tone.soft} px-4 py-3 text-sm font-semibold ${tone.icon}`}>
        Great job! You're doing awesome. Keep it up!
      </div>
    </div>
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
      <span className="hidden md:inline">How it works</span>
    </button>
  );
}
