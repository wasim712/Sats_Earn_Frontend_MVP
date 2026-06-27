'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Share, Sparkles, Ticket } from 'lucide-react';

type BillingCycle = 'MONTHLY' | 'YEARLY';

type PlanConfig = {
  label: string;
  showSatsPricing: boolean;
  oldUsdYearly: string | null;
  newUsd: string | null;
  oldSatsMonthly: string | null;
  oldSatsYearly: string | null;
  newSats: number | null;
  accentClass: string;
  eligible: boolean;
  active: boolean;
  loading: boolean;
  disabled: boolean;
  requestSent: boolean;
  actionLabel: string;
  onAction: () => void;
};

type PremiumRewardCardProps = {
  tier: {
    name: string;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    bg: string;
    glow: string;
    chip: string;
  };
  isCurrentTier: boolean;
  monthlyUnavailable: boolean;
  selectedBillingCycle: BillingCycle;
  planPerks: Record<BillingCycle, readonly string[]>;
  monthlyPlan?: PlanConfig;
  yearlyPlan: PlanConfig;
  statusBanners: Record<BillingCycle, React.ReactNode>;
};

type CursorState = {
  rotateX: number;
  rotateY: number;
  glowX: string;
  glowY: string;
  iconX: number;
  iconY: number;
};

const TIER_VISUALS: Record<string, { glow: string; edge: string; deepShadow: string; surface: string; inner: string }> = {
  PLATINUM: {
    glow: 'rgba(217,216,214,0.2)',
    edge: 'rgba(245,244,242,0.28)',
    deepShadow: 'rgba(116,116,120,0.22)',
    surface: 'linear-gradient(155deg, rgba(196,196,201,0.16) 0%, rgba(25,25,28,0.98) 34%, rgba(8,8,10,1) 100%)',
    inner: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015) 26%, rgba(0,0,0,0.16) 100%)',
  },
  DIAMOND: {
    glow: 'rgba(92,209,255,0.24)',
    edge: 'rgba(182,238,255,0.28)',
    deepShadow: 'rgba(18,78,121,0.28)',
    surface: 'linear-gradient(155deg, rgba(56,162,210,0.18) 0%, rgba(8,20,31,0.98) 34%, rgba(5,8,11,1) 100%)',
    inner: 'linear-gradient(135deg, rgba(184,240,255,0.08), rgba(255,255,255,0.015) 24%, rgba(0,0,0,0.18) 100%)',
  },
  CROWN: {
    glow: 'rgba(255,174,63,0.26)',
    edge: 'rgba(255,216,138,0.28)',
    deepShadow: 'rgba(129,74,11,0.3)',
    surface: 'linear-gradient(155deg, rgba(255,176,64,0.18) 0%, rgba(30,19,8,0.98) 34%, rgba(11,8,5,1) 100%)',
    inner: 'linear-gradient(135deg, rgba(255,223,154,0.08), rgba(255,255,255,0.014) 24%, rgba(0,0,0,0.2) 100%)',
  },
  ELITE: {
    glow: 'rgba(155,97,255,0.26)',
    edge: 'rgba(205,170,255,0.28)',
    deepShadow: 'rgba(70,29,126,0.32)',
    surface: 'linear-gradient(155deg, rgba(139,92,246,0.18) 0%, rgba(19,11,30,0.98) 34%, rgba(8,5,12,1) 100%)',
    inner: 'linear-gradient(135deg, rgba(214,190,255,0.08), rgba(255,255,255,0.014) 24%, rgba(0,0,0,0.22) 100%)',
  },
  FOUNDER: {
    glow: 'rgba(255,108,62,0.26)',
    edge: 'rgba(255,183,153,0.28)',
    deepShadow: 'rgba(129,47,19,0.3)',
    surface: 'linear-gradient(155deg, rgba(255,111,66,0.18) 0%, rgba(33,14,9,0.98) 34%, rgba(12,6,5,1) 100%)',
    inner: 'linear-gradient(135deg, rgba(255,196,169,0.08), rgba(255,255,255,0.014) 24%, rgba(0,0,0,0.2) 100%)',
  },
};

function formatSats(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function PremiumPriceCard({
  label,
  showSatsPricing,
  oldUsdYearly,
  newUsd,
  oldSatsMonthly,
  oldSatsYearly,
  newSats,
  accentClass,
  eligible,
  active,
  loading,
  disabled,
  requestSent,
  actionLabel,
  onAction,
}: PlanConfig) {
  const showUnavailable = showSatsPricing ? !newSats : !newUsd;
  const oldValue = label.toLowerCase().includes('year') ? oldSatsYearly : oldSatsMonthly;

  return (
    <div className="group/plan relative flex w-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_22%,rgba(0,0,0,0.18)_100%)] p-5 backdrop-blur-lg transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.26)] active:scale-[0.985] sm:active:scale-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_85%_82%,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 blur-xl transition-all duration-700 group-hover/plan:left-[88%] group-hover/plan:opacity-100 group-active/plan:left-[88%] group-active/plan:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-3 pb-2">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">{label}</div>
          {showUnavailable ? (
            <div className="mt-2 text-xl font-black text-gray-600">Unavailable</div>
          ) : showSatsPricing ? (
            <div className="mt-1 flex items-baseline gap-2">
              <div className={`text-2xl font-black tracking-tight ${accentClass}`}>{newSats ? formatSats(newSats) : 'Unavailable'}</div>
              {/* {label.toLowerCase().includes('year') && oldValue ? <div className="text-xs font-bold text-gray-400 line-through decoration-gray-500/50">{oldValue}</div> : null} */}
            </div>
          ) : (
            <div className="mt-1 flex items-baseline gap-2">
              <div className={`text-2xl font-black tracking-tight ${accentClass}`}>{newUsd}</div>
              {/* {label.toLowerCase().includes('year') && oldUsdYearly ? <div className="text-xs font-bold text-gray-400 line-through decoration-gray-500/50">{oldUsdYearly}</div> : null} */}
            </div>
          )}
        </div>

        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${eligible && showSatsPricing ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-white/10 bg-black/40 text-gray-400'}`}>
          {showSatsPricing ? (eligible ? 'Ready' : 'Locked') : 'Offer'}
        </span>
      </div>

      <button
        onClick={onAction}
        disabled={disabled || showUnavailable}
        className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 backdrop-blur-md border disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-40 ${
          active
            ? 'border-green-500/20 bg-green-500/10 text-green-400 shadow-[inset_0_1px_0_0_rgba(34,197,94,0.2)]'
            : showSatsPricing
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2),0_4px_12px_rgba(0,0,0,0.1)] hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-[1.02] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_8px_24px_rgba(16,185,129,0.25)] active:scale-95'
              : requestSent
                ? 'border-blue-500/20 bg-blue-500/10 text-blue-300 shadow-[inset_0_1px_0_0_rgba(59,130,246,0.2)]'
                : 'border-white/10 bg-white/[0.04] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.1)] hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.2)] active:scale-95'
        }`}
      >
        <span className="inline-flex items-center justify-center gap-2 drop-shadow-md">
          {requestSent ? <CheckCircle2 className="h-4 w-4" /> : !active && !disabled ? <Share className="h-4 w-4" /> : null}
          <span>{loading ? 'Processing...' : actionLabel}</span>
        </span>
      </button>
    </div>
  );
}

function CardFace({
  tier,
  isCurrentTier,
  planLabel,
  perks,
  plan,
  statusBanner,
  monthlyUnavailable,
  onShowAnnual,
  iconTransform,
  iconGlow,
}: {
  tier: PremiumRewardCardProps['tier'];
  isCurrentTier: boolean;
  planLabel: string;
  perks: readonly string[];
  plan?: PlanConfig;
  statusBanner: React.ReactNode;
  monthlyUnavailable?: boolean;
  onShowAnnual?: () => void;
  iconTransform: string;
  iconGlow: string;
}) {
  return (
    <div className="absolute inset-0 flex h-full flex-col rounded-[34px] p-5 sm:p-6 md:p-7 [backface-visibility:hidden]">
      <div className="mb-5 flex  items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4 pr-2">
          <div
            className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 transition-transform duration-200"
            style={{
              transform: iconTransform,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 18px ${iconGlow}`,
            }}
          >
            {tier.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-[1.75rem] leading-none sm:text-[1.95rem] font-black tracking-tight ${tier.color}`}>{tier.label}</h3>
            <div className="mt-2 text-sm sm:text-[1rem] leading-snug font-semibold text-gray-300/80 whitespace-nowrap">{planLabel}</div>
          </div>
        </div>

        <span className={`mt-0.5 shrink-0 whitespace-nowrap rounded-full px-2.5 sm:px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md ${isCurrentTier ? 'border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : tier.chip}`}>
          {isCurrentTier ? 'Active' : planLabel.toUpperCase().includes('ANNUAL') ? 'ANNUAL' : 'MONTHLY'}
        </span>
      </div>

      <div className="space-y-3.5 border-b border-white/[0.08] pb-5 sm:pb-6">
        {perks.map((perk) => (
          <div key={perk} className="flex items-start gap-3">
            <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${tier.color}`} />
            <span className="text-sm font-medium leading-snug text-gray-100/90">{perk}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 sm:mt-6 flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4">
          {plan ? (
            <PremiumPriceCard {...plan} />
          ) : monthlyUnavailable ? (
            <div className="relative flex min-h-[172px] h-full flex-col items-center justify-center overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_22%,rgba(0,0,0,0.18)_100%)] p-5 text-center text-sm font-bold text-gray-400 backdrop-blur-lg">
              <span className="relative z-10">Founder tier is available annually only.</span>
              <button
                type="button"
                onClick={onShowAnnual}
                className="relative z-10 mt-4 inline-flex items-center justify-center rounded-full border border-[#ff6a3d]/30 bg-gradient-to-r from-[#ff6a3d] to-[#ff9b78] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_18px_rgba(255,106,61,0.28)] active:scale-95"
              >
                Annual
              </button>
            </div>
          ) : null}

          {statusBanner}
        </div>
      </div>
    </div>
  );
}

export function PremiumRewardCard({
  tier,
  isCurrentTier,
  monthlyUnavailable,
  selectedBillingCycle,
  planPerks,
  monthlyPlan,
  yearlyPlan,
  statusBanners,
}: PremiumRewardCardProps) {
  const visual = useMemo(() => TIER_VISUALS[tier.name] ?? TIER_VISUALS.PLATINUM, [tier.name]);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<CursorState>({
    rotateX: 0,
    rotateY: 0,
    glowX: '50%',
    glowY: '50%',
    iconX: 0,
    iconY: 0,
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [founderAnnualOverride, setFounderAnnualOverride] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isRevealed, setIsRevealed] = useState(true);
  const [mobileScrollShift, setMobileScrollShift] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const applyViewport = () => {
      const mobile = mediaQuery.matches;
      setIsMobileView(mobile);
      setIsRevealed(!mobile);
      if (!mobile) {
        setMobileScrollShift(0);
      }
    };

    applyViewport();
    mediaQuery.addEventListener('change', applyViewport);

    return () => mediaQuery.removeEventListener('change', applyViewport);
  }, []);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || !isMobileView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobileView]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || !isMobileView) return;

    let frameId = 0;
    const updatePosition = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2) / viewportHeight;
      const clamped = Math.max(0, Math.min(1, progress));
      setMobileScrollShift((0.5 - clamped) * 18);
      frameId = 0;
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobileView]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || isMobileView) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = ((centerY - y) / centerY) * 12;
    const iconX = ((x - centerX) / centerX) * 8;
    const iconY = ((y - centerY) / centerY) * 8;

    setCursor({
      rotateX,
      rotateY,
      glowX: `${(x / rect.width) * 100}%`,
      glowY: `${(y / rect.height) * 100}%`,
      iconX,
      iconY,
    });
  };

  const resetInteraction = () => {
    setIsHovering(false);
    setIsTouchActive(false);
    setCursor({
      rotateX: 0,
      rotateY: 0,
      glowX: '50%',
      glowY: '50%',
      iconX: 0,
      iconY: 0,
    });
  };

  const handleTouchStart = () => {
    if (!isMobileView) return;
    setIsTouchActive(true);
    setCursor({ rotateX: 0, rotateY: 0, glowX: '50%', glowY: '22%', iconX: 0, iconY: -2 });
  };

  const interactive = !isMobileView && isHovering;
  const touchInteractive = isMobileView && isTouchActive;
  const effectiveBillingCycle = tier.name === 'FOUNDER' && founderAnnualOverride ? 'YEARLY' : selectedBillingCycle;
  const shellTransform = isMobileView
    ? `translateY(${mobileScrollShift}px) scale(${touchInteractive ? 1.012 : 1})`
    : interactive
      ? `translateY(-10px) scale(1.035) rotateX(${cursor.rotateX}deg) rotateY(${cursor.rotateY}deg)`
      : 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';

  const iconTransform = isMobileView
    ? `translate3d(0px, ${touchInteractive ? -2 : 0}px, 30px) scale(${touchInteractive ? 1.03 : 1})`
    : `translate3d(${cursor.iconX}px, ${cursor.iconY * -1}px, 30px) rotate(${cursor.rotateY * 0.35}deg) scale(${interactive ? 1.04 : 1})`;
  const iconGlow = interactive || touchInteractive ? visual.glow : 'rgba(0,0,0,0)';

  return (
    <div
      ref={cardRef}
      className="group w-full perspective-[2200px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0px)' : 'translateY(24px)',
        transition: isMobileView ? 'opacity 650ms cubic-bezier(0.22,1,0.36,1), transform 650ms cubic-bezier(0.22,1,0.36,1)' : undefined,
      }}
    >
      <div
        className={` max-w-[400px] relative min-h-[690px] md:min-h-[720px] w-full transform-gpu [transform-style:preserve-3d] transition-[transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
        style={{
          transform: `${shellTransform} ${effectiveBillingCycle === 'YEARLY' ? 'rotateY(180deg)' : 'rotateY(0deg)'}`,
        }}
        onPointerEnter={() => !isMobileView && setIsHovering(true)}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetInteraction}
        onTouchStart={handleTouchStart}
        onTouchEnd={resetInteraction}
        onTouchCancel={resetInteraction}
      >
        {(['MONTHLY', 'YEARLY'] as BillingCycle[]).map((cycle) => {
          const isYearly = cycle === 'YEARLY';
          const plan = isYearly ? yearlyPlan : monthlyPlan;
          const planLabel = isYearly ? 'Annual premium access' : tier.name === 'FOUNDER' ? 'Yearly access only' : 'Monthly premium access';

          return (
            <div
              key={cycle}
              className="absolute inset-0 h-full w-full rounded-[34px] [backface-visibility:hidden]"
              style={{ transform: isYearly ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div
                className={`relative flex h-full min-h-[690px] md:min-h-[720px] w-full transform-gpu flex-col overflow-hidden rounded-[34px] border ${isCurrentTier ? 'border-green-500/40 ring-2 ring-green-500/20' : tier.border} transition-[box-shadow,border-color] duration-200 ease-out will-change-transform`}
                style={{
                  background: visual.surface,
                  boxShadow: isCurrentTier
                    ? `0 35px 80px rgba(0,0,0,0.42), 0 0 0 1px ${visual.edge} inset, 0 0 34px ${visual.glow}`
                    : interactive
                      ? `0 36px 80px rgba(0,0,0,0.45), 0 0 0 1px ${visual.edge} inset, 0 0 18px ${visual.edge}, 0 14px 40px ${visual.deepShadow}`
                      : `0 24px 55px rgba(0,0,0,0.34), 0 0 0 1px rgba(255,255,255,0.04) inset`,
                  WebkitBackdropFilter: isMobileView ? 'none' : 'blur(12px)',
                  backdropFilter: isMobileView ? 'none' : 'blur(12px)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-[34px]"
                  style={{ background: `radial-gradient(circle at ${cursor.glowX} ${cursor.glowY}, ${visual.glow} 0%, transparent 28%), ${visual.inner}`, opacity: 1 }}
                />
                <div
                  className="pointer-events-none absolute inset-[1px] rounded-[33px]"
                  style={{ background: `linear-gradient(145deg, ${visual.edge}, transparent 18%, transparent 56%, rgba(0,0,0,0.18) 100%)`, opacity: interactive ? 0.2 : 0.14 }}
                />
                <div
                  className="pointer-events-none absolute h-40 w-40 rounded-full transition-opacity duration-200"
                  style={{
                    left: `calc(${cursor.glowX} - 5rem)`,
                    top: `calc(${cursor.glowY} - 5rem)`,
                    background: visual.glow,
                    opacity: interactive ? 0.22 : touchInteractive ? 0.18 : 0.12,
                    filter: isMobileView ? 'none' : 'blur(48px)',
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-[34px] transition-opacity duration-200"
                  style={{ boxShadow: `inset 0 1px 0 ${visual.edge}, inset 0 -16px 28px rgba(0,0,0,0.18)`, opacity: interactive ? 0.76 : 0.58 }}
                />

                <div className="absolute inset-x-6 top-0 h-px sm:hidden" style={{ opacity: isRevealed ? 1 : 0, background: `linear-gradient(90deg, transparent, ${visual.edge}, transparent)`, transition: 'opacity 550ms ease 120ms' }} />

                <div className="relative z-10 flex h-full flex-col">
                  <CardFace
                    tier={tier}
                    isCurrentTier={isCurrentTier}
                    planLabel={planLabel}
                    perks={planPerks[cycle]}
                    plan={plan}
                    monthlyUnavailable={!isYearly && monthlyUnavailable}
                    statusBanner={statusBanners[cycle]}
                    onShowAnnual={
                      !isYearly && tier.name === 'FOUNDER'
                        ? () => setFounderAnnualOverride(true)
                        : undefined
                    }
                    iconTransform={iconTransform}
                    iconGlow={iconGlow}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

