// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import {
//   fetchPremiumInterests,
//   fetchUserProfile,
//   submitPremiumInterest,
//   upgradePremiumUsingSats,
// } from '@/features/user/userProfileSlice';
// import {
//   Calendar,
//   CheckCircle2,
//   ChevronRight,
//   CircleStar,
//   Coins,
//   Crown,
//   Gem,
//   Info,
//   Medal,
//   Rocket,
//   Shield,
//   Sparkles,
//   Star,
//   TrendingUp,
//   Trophy,
//   Zap,
// } from 'lucide-react';

// type PremiumTierName = 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER';
// type BillingCycle = 'MONTHLY' | 'YEARLY';

// const PREMIUM_TIER_ORDER: PremiumTierName[] = ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
// const FREE_STREAK_DAYS = new Set([7, 21, 60]);

// const PREMIUM_TIERS = [
//   {
//     name: 'PLATINUM' as const,
//     label: 'Platinum',
//     shortLabel: 'PLT',
//     oldSatsMonthly:'6682',
//     oldSatsYearly:'80187',
//     oldUsdYearly:'$59.88',
//     monthlyUsd: '$4.99',
//     monthlyUsdOriginal: '$9.99',
//     yearlyUsd: '$54.99',
//     yearlyUsdOriginal: '$59.88',
//     icon: <CircleStar className="w-6 h-6 text-[#e5e4e2]" />,
//     color: 'text-[#e5e4e2]',
//     border: 'border-[#e5e4e2]/30',
//     bg: 'from-[#e5e4e2]/10 via-[#111] to-[#050505]',
//     glow: 'shadow-[0_0_36px_rgba(229,228,226,0.06)]',
//     chip: 'bg-[#e5e4e2]/10 text-[#f3f2f1] border-[#e5e4e2]/25',
//     perks: ['Priority withdrawals', '10% bonus earnings', 'Exclusive task access'],
//   },
//   {
//     name: 'DIAMOND' as const,
//     label: 'Diamond',
//     shortLabel: 'DMD',
//     oldSatsMonthly:'9361',
//     oldSatsYearly:'112332',
//     oldUsdYearly:'$83.88',
//     monthlyUsd: '$6.99',
//     monthlyUsdOriginal: '$8.98',
//     yearlyUsd: '$76.99',
//     yearlyUsdOriginal: '$83.88',
//     icon: <Gem className="w-6 h-6 text-[#b9f2ff]" />,
//     color: 'text-[#b9f2ff]',
//     border: 'border-[#b9f2ff]/30',
//     bg: 'from-[#b9f2ff]/10 via-[#0a0d12] to-[#050505]',
//     glow: 'shadow-[0_0_36px_rgba(185,242,255,0.08)]',
//     chip: 'bg-[#b9f2ff]/10 text-[#dffaff] border-[#b9f2ff]/25',
//     perks: ['Instant withdrawals', '15% bonus earnings', 'Beta feature access'],
//   },
//   {
//     name: 'CROWN' as const,
//     label: 'Crown',
//     shortLabel: 'CRN',
//     oldSatsMonthly:'13378',
//     oldSatsYearly:'160536',
//     oldUsdYearly:'$119.88',
//     monthlyUsd: '$9.99',
//     monthlyUsdOriginal: '$13.98',
//     yearlyUsd: '$109.99',
//     yearlyUsdOriginal: '$119.88',
//     icon: <Crown className="w-6 h-6 text-[#ffb347]" />,
//     color: 'text-[#ffb347]',
//     border: 'border-[#ffb347]/30',
//     bg: 'from-[#ffb347]/10 via-[#140e08] to-[#050505]',
//     glow: 'shadow-[0_0_38px_rgba(255,179,71,0.1)]',
//     chip: 'bg-[#ffb347]/10 text-[#ffd9a0] border-[#ffb347]/30',
//     perks: ['Account manager access', '20% bonus earnings', 'Premium support queue'],
//   },
//   {
//     name: 'ELITE' as const,
//     label: 'Elite',
//     shortLabel: 'ELT',
//     oldSatsMonthly:'21416',
//     oldSatsYearly:'257135',
//     oldUsdYearly:'$191.88',
//     monthlyUsd: '$15.99',
//     monthlyUsdOriginal: '$21.98',
//     yearlyUsd: '$175.99',
//     yearlyUsdOriginal: '$191.88',
//     icon: <Sparkles className="w-6 h-6 text-[#8a2be2]" />,
//     color: 'text-[#b78cff]',
//     border: 'border-[#8a2be2]/30',
//     bg: 'from-[#8a2be2]/10 via-[#0e0816] to-[#050505]',
//     glow: 'shadow-[0_0_38px_rgba(138,43,226,0.12)]',
//     chip: 'bg-[#8a2be2]/12 text-[#d8bbff] border-[#8a2be2]/28',
//     perks: ['Private feature channel', '25% bonus earnings', 'Event priority invites'],
//   },
//   {
//     name: 'FOUNDER' as const,
//     label: 'Founder',
//     shortLabel: 'FDR',
//     monthlyUsd: null,
//     oldSatsYearly:'334816',
//     monthlyUsdOriginal: null,
//     yearlyUsd: '$249.99',
//     yearlyUsdOriginal: null,
//     icon: <Rocket className="w-6 h-6 text-[#ff6a3d]" />,
//     color: 'text-[#ff8a66]',
//     border: 'border-[#ff6a3d]/30',
//     bg: 'from-[#ff6a3d]/10 via-[#160a06] to-[#050505]',
//     glow: 'shadow-[0_0_40px_rgba(255,106,61,0.14)]',
//     chip: 'bg-[#ff6a3d]/12 text-[#ffc0ad] border-[#ff6a3d]/30',
//     perks: ['Founding member status', '30% bonus earnings', 'Revenue-share priority access'],
//   },
// ] as const;

// const FREE_TIERS = [
//   {
//     name: 'Basic',
//     xp: '0 XP',
//     icon: <Shield className="w-5 h-5 text-gray-300" />,
//     color: 'text-gray-200',
//     border: 'border-slate-400/15',
//     bg: 'from-slate-500/5 via-[#0a0a0a] to-[#050505]',
//     badge: 'bg-slate-300/5 text-slate-300 border-slate-300/10',
//     perks: ['Referral limit: 20 users'],
//   },
//   {
//     name: 'Copper',
//     xp: '1,000 XP',
//     icon: <Coins className="w-5 h-5 text-[#b87333]" />,
//     color: 'text-[#d7a06b]',
//     border: 'border-[#b87333]/15',
//     bg: 'from-[#b87333]/5 via-[#0d0906] to-[#050505]',
//     badge: 'bg-[#b87333]/10 text-[#e6bb92] border-[#b87333]/20',
//     perks: ['Referral limit: 40 users'],
//   },
//   {
//     name: 'Bronze',
//     xp: '5,000 XP',
//     icon: <Medal className="w-5 h-5 text-[#cd7f32]" />,
//     color: 'text-[#d99962]',
//     border: 'border-[#cd7f32]/20',
//     bg: 'from-[#cd7f32]/5 via-[#0e0906] to-[#050505]',
//     badge: 'bg-[#cd7f32]/10 text-[#efbf96] border-[#cd7f32]/20',
//     perks: ['Referral limit: 60 users'],
//   },
//   {
//     name: 'Silver',
//     xp: '15,000 XP',
//     icon: <Star className="w-5 h-5 text-[#C0C0C0]" />,
//     color: 'text-[#d8dde5]',
//     border: 'border-[#C0C0C0]/20',
//     bg: 'from-[#C0C0C0]/5 via-[#0b0d0e] to-[#050505]',
//     badge: 'bg-[#C0C0C0]/10 text-[#eef2f5] border-[#C0C0C0]/20',
//     perks: ['Referral limit: 80 users'],
//   },
//   {
//     name: 'Gold',
//     xp: '50,000 XP',
//     icon: <Trophy className="w-5 h-5 text-[#FFD700]" />,
//     color: 'text-[#FFD700]',
//     border: 'border-[#FFD700]/25',
//     bg: 'from-[#FFD700]/10 via-[#110e05] to-[#050505]',
//     badge: 'bg-[#FFD700]/10 text-[#ffe985] border-[#FFD700]/25',
//     perks: ['Referral limit: 100 users'],
//   },
// ];

// const STREAK_MILESTONES = [
//   { days: 7, sats: 70, title: 'Pulse Start', accent: 'from-orange-500/10 via-[#0a0604] to-[#050505]', iconColor: 'text-orange-400', border: 'border-orange-500/20' },
//   { days: 21, sats: 210, title: 'Momentum Run', accent: 'from-rose-500/10 via-[#0a0406] to-[#050505]', iconColor: 'text-rose-400', border: 'border-rose-500/20' },
//   { days: 60, sats: 600, title: 'Golden Run', accent: 'from-amber-500/10 via-[#0a0804] to-[#050505]', iconColor: 'text-amber-400', border: 'border-amber-500/20' },
//   { days: 90, sats: 900, title: 'Prime Chain', accent: 'from-violet-500/10 via-[#07040a] to-[#050505]', iconColor: 'text-violet-400', border: 'border-violet-500/20' },
//   { days: 180, sats: 1800, title: 'Titan Loop', accent: 'from-fuchsia-500/10 via-[#0a040a] to-[#050505]', iconColor: 'text-fuchsia-400', border: 'border-fuchsia-500/20' },
//   { days: 365, sats: 3650, title: 'Legacy Orbit', accent: 'from-cyan-500/10 via-[#04080a] to-[#050505]', iconColor: 'text-cyan-400', border: 'border-cyan-500/20' },
// ] as const;

// function getTierRank(tier: string | null | undefined) {
//   if (!tier) return -1;
//   return PREMIUM_TIER_ORDER.indexOf(tier as PremiumTierName);
// }

// function formatSats(value: number) {
//   return `${value.toLocaleString()} sats`;
// }


// export default function RewardsPage() {
//   const dispatch = useAppDispatch();
//   const { premiumRequests, premiumMessage, data: profile } = useAppSelector((state) => state.userProfile);
//   const [loadingKey, setLoadingKey] = useState<string | null>(null);
//   const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
//   const [showSatsPricing, setShowSatsPricing] = useState(false);
//   const [celebrationTier, setCelebrationTier] = useState<string | null>(null);

//   useEffect(() => {
//     dispatch(fetchPremiumInterests());
//     dispatch(fetchUserProfile());
//   }, [dispatch]);

//   useEffect(() => {
//     if (premiumMessage) {
//       setFeedback({ type: 'success', message: premiumMessage });
//     }
//   }, [premiumMessage]);

//   const requestMap = useMemo(
//     () =>
//       premiumRequests.reduce<Record<string, { notify: boolean; upgrade: boolean }>>((acc, request) => {
//         const key = request.plan.toUpperCase();
//         acc[key] = acc[key] || { notify: false, upgrade: false };
//         if (request.intent === 'NOTIFY_ME') acc[key].notify = true;
//         if (request.intent === 'UPGRADE') acc[key].upgrade = true;
//         return acc;
//       }, {}),
//     [premiumRequests],
//   );

//   const availableBalance = profile?.balanceAvailable ?? 0;
//   const monthlyPricing = profile?.premiumPricing?.monthlySatsMatrix || {};
//   const yearlyPricing = profile?.premiumPricing?.yearlySatsMatrix || {};
//   const currentPremiumTier = profile?.isPremium ? profile?.premiumTier?.toUpperCase() ?? null : null;
//   const currentPremiumRank = getTierRank(currentPremiumTier);
//   const isPremiumUser = Boolean(profile?.isPremium);
//   const activeTierLabel = profile?.activeTier || currentPremiumTier || 'Basic';

//   const handleNotifyOrUpgrade = async (
//     plan: PremiumTierName,
//     intent: 'NOTIFY_ME' | 'UPGRADE',
//     source = 'rewards-page',
//   ) => {
//     try {
//       setLoadingKey(`${plan}-${intent}-${source}`);
//       setFeedback(null);
//       await dispatch(submitPremiumInterest({ plan, intent, source })).unwrap();
//       await dispatch(fetchPremiumInterests());
//       await dispatch(fetchUserProfile());
//     } catch (error: any) {
//       setFeedback({ type: 'error', message: error?.message || 'Request failed.' });
//     } finally {
//       setLoadingKey(null);
//     }
//   };

//   const handleSatsUpgrade = async (plan: PremiumTierName, billingCycle: BillingCycle) => {
//     try {
//       setLoadingKey(`${plan}-${billingCycle}`);
//       setFeedback(null);
//       await dispatch(upgradePremiumUsingSats({ plan, billingCycle })).unwrap();
//       setCelebrationTier(plan);
//       await dispatch(fetchPremiumInterests());
//       await dispatch(fetchUserProfile());
//     } catch (error: any) {
//       setFeedback({ type: 'error', message: error?.message || 'Upgrade failed.' });
//     } finally {
//       setLoadingKey(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] text-white p-4 md:p-6 lg:p-10 relative overflow-hidden">
//       {/* Background Ambient Glows */}
//       <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-sats-orange-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
//       <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

//       {/* Celebration Modal */}
//       {celebrationTier ? (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md transition-all">
//           <div className="w-full max-w-md rounded-[32px] border border-sats-orange-500/30 bg-gradient-to-b from-[#111] to-[#050505] p-8 text-center shadow-[0_0_60px_rgba(249,115,22,0.15)] animate-in fade-in zoom-in duration-300">
//             <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sats-orange-500/10 text-sats-orange-400 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)]">
//               <Sparkles className="w-10 h-10 animate-pulse" />
//             </div>
//             <h3 className="mt-6 text-3xl font-black text-white tracking-tight">Congratulations!</h3>
//             <p className="mt-3 text-base text-gray-400 leading-relaxed">
//               You have successfully upgraded to <span className="font-black text-sats-orange-400 tracking-wide">{celebrationTier}</span>. Welcome to the elite tier.
//             </p>
//             <button
//               onClick={() => setCelebrationTier(null)}
//               className="mt-8 w-full rounded-2xl bg-gradient-to-r from-sats-orange-500 to-orange-400 px-4 py-4 text-base font-black text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95"
//             >
//               Continue to Dashboard
//             </button>
//           </div>
//         </div>
//       ) : null}

//       <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 relative z-10">
        
//         {/* Header Section */}
//         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div className="max-w-3xl">
//             <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
//               Rewards & Tiers
//             </h1>
//             <p className="text-gray-400 mt-3 text-base md:text-lg leading-relaxed">
//               Track streak milestones, unlock stronger free tiers, and upgrade premium access with seamless cryptocurrency or fiat payments.
//             </p>
//             <div className="mt-6 flex flex-wrap items-center gap-4">
//               <div className="inline-flex items-center gap-2.5 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/5 px-5 py-2.5 text-sm font-bold text-sats-orange-400 backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.05)]">
//                 <Info className="w-4.5 h-4.5" /> Balance: {availableBalance.toLocaleString()} sats
//               </div>
//               <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-gray-200 backdrop-blur-sm">
//                 <Crown className="w-4.5 h-4.5 text-sats-orange-500" /> Active Tier: <span className="text-white">{activeTierLabel}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {feedback ? (
//           <div
//             className={`rounded-2xl border px-5 py-4 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
//               feedback.type === 'success'
//                 ? 'border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
//                 : 'border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
//             }`}
//           >
//             {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
//             {feedback.message}
//           </div>
//         ) : null}

//         {/* Streak Milestones */}
//         <section>
//           <div className="mb-6 flex items-center gap-3">
//             <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
//               <Calendar className="w-5 h-5" />
//             </div>
//             <h2 className="text-2xl md:text-3xl font-black text-white/90">Streak Milestones</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//             {STREAK_MILESTONES.map((item) => {
//               const unlocked = FREE_STREAK_DAYS.has(item.days) || isPremiumUser;
//               const premiumLocked = !FREE_STREAK_DAYS.has(item.days) && !isPremiumUser;

//               return (
//                 <div
//                   key={item.days}
//                   className={`group relative rounded-[28px] border p-6 bg-gradient-to-br ${item.accent} ${
//                     unlocked ? 'border-white/10' : 'border-white/5'
//                   } transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden`}
//                 >
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors" />
//                   <div className="relative z-10 flex items-start justify-between gap-3">
//                     <div className="flex items-center gap-4">
//                       <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-black/40 shadow-inner ${item.border}`}>
//                         <Calendar className={`w-6 h-6 ${item.iconColor}`} />
//                       </div>
//                       <div>
//                         <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.days} Days</div>
//                         <div className="mt-1 text-lg font-black text-white tracking-wide">{item.title}</div>
//                       </div>
//                     </div>
//                     <span
//                       className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border ${
//                         unlocked
//                           ? 'border-green-500/20 bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
//                           : 'border-white/10 bg-black/40 text-gray-500'
//                       }`}
//                     >
//                       {unlocked ? 'Unlocked' : 'Premium'}
//                     </span>
//                   </div>

//                   <div className={`relative z-10 mt-6 font-black text-2xl tracking-tight ${item.iconColor}`}>
//                     {item.sats.toLocaleString()} <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Sats</span>
//                   </div>
//                   <p className="relative z-10 mt-3 text-sm text-gray-400/80 leading-relaxed font-medium">
//                     {premiumLocked
//                       ? 'This milestone is locked for free tiers. Upgrade to any premium membership to unlock.'
//                       : FREE_STREAK_DAYS.has(item.days)
//                         ? 'Available to all users once your daily streak reaches this milestone.'
//                         : 'Unlocked because your premium tier includes extended milestone rewards.'}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* Free Tiers */}
//         <section>
//           <div className="mb-6 flex items-center gap-3">
//             <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
//               <Shield className="w-5 h-5" />
//             </div>
//             <h2 className="text-2xl md:text-3xl font-black text-white/90">Free Tiers</h2>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-5 gap-5">
//             {FREE_TIERS.map((tier) => (
//               <div
//                 key={tier.name}
//                 className={`group rounded-[28px] border ${tier.border} bg-gradient-to-br ${tier.bg} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-white/20`}
//               >
//                 <div className="flex items-center justify-between gap-3 mb-6">
//                   <div className="flex items-center gap-3.5">
//                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-black/40 text-xl shadow-inner group-hover:scale-105 transition-transform">
//                       {tier.icon}
//                     </div>
//                     <div>
//                       <div className={`text-lg font-black tracking-wide ${tier.color}`}>{tier.name}</div>
//                       <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">{tier.xp}</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3 pt-2 border-t border-white/5">
//                   {tier.perks.map((perk) => (
//                     <div key={perk} className="flex items-start gap-2.5 text-sm font-semibold text-gray-300">
//                       <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${tier.color.replace('text-', 'bg-')}`} />
//                       <span>{perk}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Premium Memberships */}
//         <section>
//           <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div className="min-w-0 flex-1">
//               <div className="mb-3 flex items-center gap-3">
//                 <div className="p-2.5 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500 shrink-0">
//                   <Crown className="w-5 h-5" />
//                 </div>
//                 <h2 className="text-2xl md:text-3xl font-black text-white/90">Premium Memberships</h2>
//               </div>
//               <p className="text-base text-gray-400 max-w-3xl leading-relaxed">
//                 Unlock exclusive tasks, instant withdrawals, and huge earning multipliers. Select your preferred payment method directly on the cards below.
//               </p>
//             </div>

          //   <div className="flex w-full lg:w-auto lg:justify-end">
          //     <button
          //       type="button"
          //       onClick={() => setShowSatsPricing(!showSatsPricing)}
          //       className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition-all duration-300 shadow-[0_10px_24px_rgba(0,0,0,0.18)] ${
          //         showSatsPricing
          //           ? 'bg-gradient-to-r from-sats-orange-500 to-orange-400 text-black shadow-[0_0_18px_rgba(249,115,22,0.25)]'
          //           : 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-[0_0_18px_rgba(34,197,94,0.25)]'
          //       }`}
          //     >
          //       <Sparkles className="w-4 h-4" />
          //       <span>{!showSatsPricing ? 'Upgrade Using Sats' : 'Upgrade Using USD'}</span>
          //       <ChevronRight className="w-4 h-4" />
          //     </button>
          //   </div>
          // </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 items-stretch">
//             {PREMIUM_TIERS.map((tier) => {
//               const state = requestMap[tier.name] || { notify: false, upgrade: false };
//               const monthlySats = Number(monthlyPricing[tier.name] || 0);
//               const yearlySats = Number(yearlyPricing[tier.name] || 0);
//               const monthlyEligible = monthlySats > 0 && availableBalance >= monthlySats;
//               const yearlyEligible = yearlySats > 0 && availableBalance >= yearlySats;
//               const isCurrentTier = currentPremiumTier === tier.name;
//               const tierRank = getTierRank(tier.name);
//               const belowCurrentPremium = currentPremiumRank >= 0 && tierRank < currentPremiumRank;
//               const canUpgradeForward = currentPremiumRank < tierRank || currentPremiumRank === -1;
//               const monthlyUnavailable = tier.name === 'FOUNDER';

//               return (
//                 <div
//                   key={tier.name}
//                   className={`group relative flex h-full flex-col overflow-hidden rounded-[32px] border ${isCurrentTier ? 'border-green-500/40' : tier.border} bg-gradient-to-br ${tier.bg} p-6 md:p-7 ${tier.glow} ${
//                     isCurrentTier ? 'ring-2 ring-green-500/20' : 'hover:-translate-y-1'
//                   } transition-all duration-300 backdrop-blur-md`}
//                 >
//                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
                  
//                   <div className="relative z-10 flex h-full flex-col">
//                     <div className="mb-6 flex min-h-[72px] items-start justify-between gap-4">
//                       <div className="flex min-w-0 items-center gap-4">
//                         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-inner group-hover:scale-105 transition-transform">
//                           {tier.icon}
//                         </div>
//                         <div className="min-w-0">
//                           <h3 className={`truncate text-2xl font-black tracking-wide ${tier.color}`}>{tier.label}</h3>
//                           <div className="mt-1 text-sm font-semibold text-gray-400">
//                             {tier.name === 'FOUNDER' ? 'Yearly access only' : 'Monthly and yearly access'}
//                           </div>
//                         </div>
//                       </div>

//                       <span className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border ${isCurrentTier ? 'border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : tier.chip}`}>
//                         {isCurrentTier ? 'Active' : 'Premium'}
//                       </span>
//                     </div>

//                     <div className="space-y-3.5 border-b border-white/[0.06] pb-6">
//                       {tier.perks.map((perk) => (
//                         <div key={perk} className="flex items-start gap-3">
//                           <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${tier.color}`} />
//                           <span className="text-sm font-medium text-gray-200 leading-snug">{perk}</span>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="mt-6 flex flex-1 flex-col">
//                       <div className="flex flex-1 flex-col gap-4">
//                       {!monthlyUnavailable ? (
//                         <PremiumPriceCard
//                           label="Monthly Plan"
//                           showSatsPricing={showSatsPricing}
//                           oldUsdYearly={tier.monthlyUsdOriginal}
//                           newUsd={tier.monthlyUsd}
//                           oldSatsMonthly={tier.oldSatsMonthly}
//                           oldSatsYearly={tier.oldSatsYearly}
//                           newSats={monthlySats > 0 ? monthlySats : null}
//                           accentClass={tier.color}
//                           eligible={monthlyEligible}
//                           active={isCurrentTier}
//                           loading={loadingKey === `${tier.name}-MONTHLY`}
//                           disabled={loadingKey !== null || isCurrentTier || belowCurrentPremium || !canUpgradeForward || (!showSatsPricing && state.upgrade) || (showSatsPricing && !monthlyEligible)}
//                           requestSent={!showSatsPricing && state.upgrade}
//                           actionLabel={
//                             isCurrentTier
//                               ? 'Currently Active'
//                               : belowCurrentPremium
//                                 ? 'Higher Tier Active'
//                                 : showSatsPricing
//                                   ? monthlyEligible
//                                     ? 'Upgrade with Sats'
//                                     : 'Insufficient Sats'
//                                   : state.upgrade
//                                     ? 'Request Sent'
//                                     : 'Upgrade with USD'
//                           }
//                           onAction={() =>
//                             showSatsPricing
//                               ? handleSatsUpgrade(tier.name, 'MONTHLY')
//                               : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-monthly')
//                           }
//                         />
//                       ) : (
//                           <div className="flex min-h-[152px] items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-5 text-center text-sm font-bold text-gray-500 backdrop-blur-sm">
//                             Founder tier is available annually only.
//                           </div>
//                       )}

//                       <PremiumPriceCard
//                         label="Yearly Plan (Save 20%)"
//                         showSatsPricing={showSatsPricing}
//                         oldUsdYearly={tier.yearlyUsdOriginal}
//                         newUsd={tier.yearlyUsd}
//                         oldSatsMonthly={''}
//                         oldSatsYearly={tier.oldSatsYearly}
//                         newSats={yearlySats > 0 ? yearlySats : null}
//                         accentClass={tier.color}
//                         eligible={yearlyEligible}
//                         active={isCurrentTier}
//                         loading={loadingKey === `${tier.name}-YEARLY`}
//                         disabled={loadingKey !== null || isCurrentTier || belowCurrentPremium || !canUpgradeForward || (!showSatsPricing && state.upgrade) || (showSatsPricing && !yearlyEligible)}
//                         requestSent={!showSatsPricing && state.upgrade}
//                         actionLabel={
//                           isCurrentTier
//                             ? 'Currently Active'
//                             : belowCurrentPremium
//                               ? 'Higher Tier Active'
//                               : showSatsPricing
//                                 ? yearlyEligible
//                                   ? 'Upgrade with Sats'
//                                   : 'Insufficient Sats'
//                                 : state.upgrade
//                                   ? 'Request Sent'
//                                   : 'Upgrade with USD'
//                         }
//                         onAction={() =>
//                           showSatsPricing
//                             ? handleSatsUpgrade(tier.name, 'YEARLY')
//                           : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-yearly')
//                         }
//                       />

//                       </div>

//                       <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
//                         <button
//                           onClick={() => handleNotifyOrUpgrade(tier.name, 'NOTIFY_ME', 'rewards-page-notify')}
//                           disabled={loadingKey !== null || state.notify || isCurrentTier || belowCurrentPremium}
//                           className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3.5 text-sm font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                           {state.notify ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Info className="h-4 w-4" />}
//                           <span>{state.notify ? 'We will notify you' : 'Notify me about updates'}</span>
//                         </button>

//                         {isCurrentTier ? (
//                           <StatusBanner tone="green" message="This is your current premium tier." />
//                         ) : belowCurrentPremium ? (
//                           <StatusBanner tone="orange" message="Your current premium tier is already higher than this one." />
//                         ) : showSatsPricing ? (
//                           <StatusBanner
//                             tone={monthlyEligible || yearlyEligible ? 'green' : 'orange'}
//                             message={
//                               monthlyEligible || yearlyEligible
//                                 ? `Enough balance for ${monthlyEligible && yearlyEligible ? 'monthly or yearly' : monthlyEligible ? 'monthly' : 'yearly'} sats purchase.`
//                                 : 'Switch back to USD mode or add more sats to purchase directly.'
//                             }
//                           />
//                         ) : state.upgrade ? (
//                           <StatusBanner tone="blue" message="Upgrade request sent for this tier." />
//                         ) : (
//                           <StatusBanner tone="violet" message="Use upgrade request or notify me if you are planning this tier later." />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// function PremiumPriceCard({
//   label,
//   showSatsPricing,
//   oldUsdYearly,
//   newUsd,
//   oldSatsMonthly,
//   oldSatsYearly,
//   newSats,
//   accentClass,
//   eligible,
//   active,
//   loading,
//   disabled,
//   requestSent,
//   actionLabel,
//   onAction,
// }: {
//   label: string;
//   showSatsPricing: boolean;
//   oldUsdYearly: string | null;
//   newUsd: string | null;
//   oldSatsMonthly: string | null;
//   oldSatsYearly: string | null;
//   newSats: number | null;
//   accentClass: string;
//   eligible: boolean;
//   active: boolean;
//   loading: boolean;
//   disabled: boolean;
//   requestSent: boolean;
//   actionLabel: string;
//   onAction: () => void;
// }) {
//   const showUnavailable = showSatsPricing ? !newSats : !newUsd;

//   return (
//     <div className={`flex h-full flex-col rounded-[20px] border ${active ? 'border-green-500/30 bg-green-500/5' : 'border-white/[0.06] bg-[#080808]/80'} p-5 backdrop-blur-sm transition-colors hover:border-white/10`}>
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</div>

//           {showUnavailable ? (
//             <div className="mt-2 text-xl font-black text-gray-600">Unavailable</div>
//           ) : showSatsPricing ? (
//             <div className="mt-1 flex items-baseline gap-2">
//               <div className={`text-2xl font-black tracking-tight ${accentClass}`}>{newSats ? formatSats(newSats) : 'Unavailable'}</div>
//               {(label.toLowerCase().includes('year') ? oldSatsYearly : oldSatsMonthly)
//                 ? <div className="text-xs font-bold text-gray-500 line-through decoration-gray-500/50">{label.toLowerCase().includes('year') ? oldSatsYearly : oldSatsMonthly}</div>
//                 : null}
//             </div>
//           ) : (
//             <div className="mt-1 flex items-baseline gap-2">
//               <div className={`text-2xl font-black tracking-tight ${accentClass}`}>{newUsd}</div>
//               {oldUsdYearly ? <div className="text-xs font-bold text-gray-500 line-through decoration-gray-500/50">{oldUsdYearly}</div> : null}
//             </div>
//           )}
//         </div>

//         <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${eligible && showSatsPricing ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-white/10 bg-black/40 text-gray-500'}`}>
//           {showSatsPricing ? (eligible ? 'Ready' : 'Locked') : 'Offer'}
//         </span>
//       </div>

//       <button
//         onClick={onAction}
//         disabled={disabled || showUnavailable}
//         className={`mt-auto min-h-[54px] w-full rounded-xl px-4 py-3.5 text-sm font-black transition-all duration-300 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed ${
//           active
//             ? 'border border-green-500/30 bg-green-500/10 text-green-400'
//             : showSatsPricing
//               ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95'
//               : requestSent
//                 ? 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
//                 : 'bg-gradient-to-r from-sats-orange-500 to-orange-400 text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95'
//         }`}
//       >
//         <span className="inline-flex items-center justify-center gap-2">
//           {requestSent ? <CheckCircle2 className="w-4 h-4" /> : !active && !disabled ? <Sparkles className="w-4 h-4" /> : null}
//           <span>{loading ? 'Processing...' : actionLabel}</span>
//         </span>
//       </button>
//     </div>
//   );
// }

// function StatusBanner({ tone, message }: { tone: 'green' | 'orange' | 'violet' | 'blue'; message: string }) {
//   const styles = {
//     green: 'border-green-500/20 bg-green-500/10 text-green-300',
//     orange: 'border-orange-500/20 bg-orange-500/10 text-orange-300',
//     violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
//     blue: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
//   };

//   return <div className={`rounded-xl border px-3 py-2 text-xs font-bold leading-relaxed ${styles[tone]}`}>{message}</div>;
// }

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPremiumInterests,
  fetchUserProfile,
  submitPremiumInterest,
  upgradePremiumUsingSats,
} from '@/features/user/userProfileSlice';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleStar,
  Coins,
  Crown,
  Gem,
  Info,
  Lock,
  Medal,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { PremiumRewardCard } from './PremiumRewardCard';

type PremiumTierName = 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER';
type BillingCycle = 'MONTHLY' | 'YEARLY';

const PREMIUM_TIER_ORDER: PremiumTierName[] = ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
const FREE_STREAK_DAYS = new Set([7, 21, 60]);

const PREMIUM_TIERS = [
  {
    name: 'PLATINUM' as const,
    label: 'Platinum',
    shortLabel: 'PLT',
    oldSatsMonthly:'6682',
    oldSatsYearly:'80187',
    oldUsdYearly:'$59.88',
    monthlyUsd: '$4.99',
    monthlyUsdOriginal: '$9.99',
    yearlyUsd: '$54.99',
    yearlyUsdOriginal: '$59.88',
    icon: <CircleStar className="w-6 h-6 text-[#e5e4e2]" />,
    color: 'text-[#e5e4e2]',
    border: 'border-[#e5e4e2]/30',
    bg: 'from-[#e5e4e2]/15 via-[#131313] to-[#080808]',
    glow: 'shadow-[0_0_36px_rgba(229,228,226,0.06)] hover:shadow-[0_0_40px_rgba(229,228,226,0.12)]',
    chip: 'bg-[#e5e4e2]/10 text-[#f3f2f1] border-[#e5e4e2]/25',
    perks: ['Priority withdrawals', '10% bonus earnings', 'Exclusive task access'],
  },
  {
    name: 'DIAMOND' as const,
    label: 'Diamond',
    shortLabel: 'DMD',
    oldSatsMonthly:'9361',
    oldSatsYearly:'112332',
    oldUsdYearly:'$83.88',
    monthlyUsd: '$6.99',
    monthlyUsdOriginal: '$8.98',
    yearlyUsd: '$76.99',
    yearlyUsdOriginal: '$83.88',
    icon: <Gem className="w-6 h-6 text-[#b9f2ff]" />,
    color: 'text-[#b9f2ff]',
    border: 'border-[#b9f2ff]/30',
    bg: 'from-[#b9f2ff]/15 via-[#0d1117] to-[#080808]',
    glow: 'shadow-[0_0_36px_rgba(185,242,255,0.08)] hover:shadow-[0_0_40px_rgba(185,242,255,0.15)]',
    chip: 'bg-[#b9f2ff]/10 text-[#dffaff] border-[#b9f2ff]/25',
    perks: ['Instant withdrawals', '15% bonus earnings', 'Beta feature access'],
  },
  {
    name: 'CROWN' as const,
    label: 'Crown',
    shortLabel: 'CRN',
    oldSatsMonthly:'13378',
    oldSatsYearly:'160536',
    oldUsdYearly:'$119.88',
    monthlyUsd: '$9.99',
    monthlyUsdOriginal: '$13.98',
    yearlyUsd: '$109.99',
    yearlyUsdOriginal: '$119.88',
    icon: <Crown className="w-6 h-6 text-[#ffb347]" />,
    color: 'text-[#ffb347]',
    border: 'border-[#ffb347]/30',
    bg: 'from-[#ffb347]/15 via-[#16110c] to-[#080808]',
    glow: 'shadow-[0_0_38px_rgba(255,179,71,0.1)] hover:shadow-[0_0_45px_rgba(255,179,71,0.18)]',
    chip: 'bg-[#ffb347]/10 text-[#ffd9a0] border-[#ffb347]/30',
    perks: ['Account manager access', '20% bonus earnings', 'Premium support queue'],
  },
  {
    name: 'ELITE' as const,
    label: 'Elite',
    shortLabel: 'ELT',
    oldSatsMonthly:'21416',
    oldSatsYearly:'257135',
    oldUsdYearly:'$191.88',
    monthlyUsd: '$15.99',
    monthlyUsdOriginal: '$21.98',
    yearlyUsd: '$175.99',
    yearlyUsdOriginal: '$191.88',
    icon: <Sparkles className="w-6 h-6 text-[#8a2be2]" />,
    color: 'text-[#b78cff]',
    border: 'border-[#8a2be2]/30',
    bg: 'from-[#8a2be2]/15 via-[#120b1d] to-[#080808]',
    glow: 'shadow-[0_0_38px_rgba(138,43,226,0.12)] hover:shadow-[0_0_45px_rgba(138,43,226,0.2)]',
    chip: 'bg-[#8a2be2]/12 text-[#d8bbff] border-[#8a2be2]/28',
    perks: ['Private feature channel', '25% bonus earnings', 'Event priority invites'],
  },
  {
    name: 'FOUNDER' as const,
    label: 'Founder',
    shortLabel: 'FDR',
    monthlyUsd: null,
    oldSatsYearly:'334816',
    monthlyUsdOriginal: null,
    yearlyUsd: '$249.99',
    yearlyUsdOriginal: null,
    icon: <Rocket className="w-6 h-6 text-[#ff6a3d]" />,
    color: 'text-[#ff8a66]',
    border: 'border-[#ff6a3d]/30',
    bg: 'from-[#ff6a3d]/15 via-[#1a0d09] to-[#080808]',
    glow: 'shadow-[0_0_40px_rgba(255,106,61,0.14)] hover:shadow-[0_0_50px_rgba(255,106,61,0.22)]',
    chip: 'bg-[#ff6a3d]/12 text-[#ffc0ad] border-[#ff6a3d]/30',
    perks: ['Founding member status', '30% bonus earnings', 'Revenue-share priority access'],
  },
] as const;

const FREE_TIERS = [
  {
    name: 'Basic',
    xp: '0 XP',
    icon: <Shield className="w-5 h-5 text-gray-300" />,
    color: 'text-gray-200',
    border: 'border-slate-400/15',
    bg: 'from-slate-500/5 via-[#0a0a0a] to-[#050505]',
    badge: 'bg-slate-300/5 text-slate-300 border-slate-300/10',
    perks: ['Referral limit: 20 users'],
  },
  {
    name: 'Copper',
    xp: '1,000 XP',
    icon: <Coins className="w-5 h-5 text-[#b87333]" />,
    color: 'text-[#d7a06b]',
    border: 'border-[#b87333]/15',
    bg: 'from-[#b87333]/5 via-[#0d0906] to-[#050505]',
    badge: 'bg-[#b87333]/10 text-[#e6bb92] border-[#b87333]/20',
    perks: ['Referral limit: 40 users'],
  },
  {
    name: 'Bronze',
    xp: '5,000 XP',
    icon: <Medal className="w-5 h-5 text-[#cd7f32]" />,
    color: 'text-[#d99962]',
    border: 'border-[#cd7f32]/20',
    bg: 'from-[#cd7f32]/5 via-[#0e0906] to-[#050505]',
    badge: 'bg-[#cd7f32]/10 text-[#efbf96] border-[#cd7f32]/20',
    perks: ['Referral limit: 60 users'],
  },
  {
    name: 'Silver',
    xp: '15,000 XP',
    icon: <Star className="w-5 h-5 text-[#C0C0C0]" />,
    color: 'text-[#d8dde5]',
    border: 'border-[#C0C0C0]/20',
    bg: 'from-[#C0C0C0]/5 via-[#0b0d0e] to-[#050505]',
    badge: 'bg-[#C0C0C0]/10 text-[#eef2f5] border-[#C0C0C0]/20',
    perks: ['Referral limit: 80 users'],
  },
  {
    name: 'Gold',
    xp: '50,000 XP',
    icon: <Trophy className="w-5 h-5 text-[#FFD700]" />,
    color: 'text-[#FFD700]',
    border: 'border-[#FFD700]/25',
    bg: 'from-[#FFD700]/10 via-[#110e05] to-[#050505]',
    badge: 'bg-[#FFD700]/10 text-[#ffe985] border-[#FFD700]/25',
    perks: ['Referral limit: 100 users'],
  },
];

const STREAK_MILESTONES = [
  { days: 7, sats: 70, title: 'Pulse Start', accent: 'from-orange-500/10 via-[#0a0604] to-[#050505]', iconColor: 'text-orange-400', border: 'border-orange-500/20' },
  { days: 21, sats: 210, title: 'Momentum Run', accent: 'from-rose-500/10 via-[#0a0406] to-[#050505]', iconColor: 'text-rose-400', border: 'border-rose-500/20' },
  { days: 60, sats: 600, title: 'Golden Run', accent: 'from-amber-500/10 via-[#0a0804] to-[#050505]', iconColor: 'text-amber-400', border: 'border-amber-500/20' },
  { days: 90, sats: 900, title: 'Prime Chain', accent: 'from-violet-500/10 via-[#07040a] to-[#050505]', iconColor: 'text-violet-400', border: 'border-violet-500/20' },
  { days: 180, sats: 1800, title: 'Titan Loop', accent: 'from-fuchsia-500/10 via-[#0a040a] to-[#050505]', iconColor: 'text-fuchsia-400', border: 'border-fuchsia-500/20' },
  { days: 365, sats: 3650, title: 'Legacy Orbit', accent: 'from-cyan-500/10 via-[#04080a] to-[#050505]', iconColor: 'text-cyan-400', border: 'border-cyan-500/20' },
] as const;

function getTierRank(tier: string | null | undefined) {
  if (!tier) return -1;
  return PREMIUM_TIER_ORDER.indexOf(tier as PremiumTierName);
}

export default function RewardsPage() {
  const dispatch = useAppDispatch();
  const { premiumRequests, premiumMessage, data: profile } = useAppSelector((state) => state.userProfile);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showSatsPricing, setShowSatsPricing] = useState(false);
  const [celebrationTier, setCelebrationTier] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPremiumInterests());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (premiumMessage) {
      setFeedback({ type: 'success', message: premiumMessage });
    }
  }, [premiumMessage]);

  const requestMap = useMemo(
    () =>
      premiumRequests.reduce<Record<string, { notify: boolean; upgrade: boolean }>>((acc, request) => {
        const key = request.plan.toUpperCase();
        acc[key] = acc[key] || { notify: false, upgrade: false };
        if (request.intent === 'NOTIFY_ME') acc[key].notify = true;
        if (request.intent === 'UPGRADE') acc[key].upgrade = true;
        return acc;
      }, {}),
    [premiumRequests],
  );

  const availableBalance = profile?.balanceAvailable ?? 0;
  const monthlyPricing = profile?.premiumPricing?.monthlySatsMatrix || {};
  const yearlyPricing = profile?.premiumPricing?.yearlySatsMatrix || {};
  const currentPremiumTier = profile?.isPremium ? profile?.premiumTier?.toUpperCase() ?? null : null;
  const currentPremiumRank = getTierRank(currentPremiumTier);
  const isPremiumUser = Boolean(profile?.isPremium);
  const activeTierLabel = profile?.activeTier || currentPremiumTier || 'Basic';

  const handleNotifyOrUpgrade = async (
    plan: PremiumTierName,
    intent: 'NOTIFY_ME' | 'UPGRADE',
    source = 'rewards-page',
  ) => {
    try {
      setLoadingKey(`${plan}-${intent}-${source}`);
      setFeedback(null);
      await dispatch(submitPremiumInterest({ plan, intent, source })).unwrap();
      await dispatch(fetchPremiumInterests());
      await dispatch(fetchUserProfile());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Request failed.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoadingKey(null);
    }
  };

  const handleSatsUpgrade = async (plan: PremiumTierName, billingCycle: BillingCycle) => {
    try {
      setLoadingKey(`${plan}-${billingCycle}`);
      setFeedback(null);
      await dispatch(upgradePremiumUsingSats({ plan, billingCycle })).unwrap();
      setCelebrationTier(plan);
      await dispatch(fetchPremiumInterests());
      await dispatch(fetchUserProfile());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upgrade failed.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-6 lg:p-10 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-sats-orange-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      {/* Celebration Modal */}
      {celebrationTier ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md transition-all">
          <div className="w-full max-w-md rounded-[32px] border border-sats-orange-500/30 bg-gradient-to-b from-[#111] to-[#050505] p-8 text-center shadow-[0_0_60px_rgba(249,115,22,0.15)] animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sats-orange-500/10 text-sats-orange-400 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)]">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="mt-6 text-3xl font-black text-white tracking-tight">Congratulations!</h3>
            <p className="mt-3 text-base text-gray-400 leading-relaxed">
              You have successfully upgraded to <span className="font-black text-sats-orange-400 tracking-wide">{celebrationTier}</span>. Welcome to the elite tier.
            </p>
            <button
              onClick={() => setCelebrationTier(null)}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-sats-orange-500 to-orange-400 px-4 py-4 text-base font-black text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Rewards & Tiers
            </h1>
            <p className="text-gray-400 mt-3 text-base md:text-lg leading-relaxed">
              Track streak milestones, unlock stronger free tiers, and upgrade premium access with seamless cryptocurrency or fiat payments.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2.5 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/5 px-5 py-2.5 text-sm font-bold text-sats-orange-400 backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                <Info className="w-4.5 h-4.5" /> Balance: {availableBalance.toLocaleString()} sats
              </div>
              <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-gray-200 backdrop-blur-sm">
                <Crown className="w-4.5 h-4.5 text-sats-orange-500" /> Active Tier: <span className="text-white">{activeTierLabel}</span>
              </div>
            </div>
          </div>
        </header>

        {feedback ? (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
              feedback.type === 'success'
                ? 'border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                : 'border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            {feedback.message}
          </div>
        ) : null}

        {/* Streak Milestones */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white/90">Streak Milestones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {STREAK_MILESTONES.map((item) => {
              const unlocked = FREE_STREAK_DAYS.has(item.days) || isPremiumUser;
              const premiumLocked = !FREE_STREAK_DAYS.has(item.days) && !isPremiumUser;

              return (
                <div
                  key={item.days}
                  className={`group relative rounded-[28px] border p-6 bg-gradient-to-br ${item.accent} ${
                    unlocked ? 'border-white/10' : 'border-white/5'
                  } transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors" />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-black/40 shadow-inner ${item.border}`}>
                        <Calendar className={`w-6 h-6 ${item.iconColor}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.days} Days</div>
                        <div className="mt-1 text-lg font-black text-white tracking-wide">{item.title}</div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 flex items-center rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border ${
                        unlocked
                          ? 'border-green-500/20 bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                          : 'border-white/10 bg-black/40 text-gray-500'
                      }`}
                    >
                      {unlocked ? 'Unlocked' : <><Lock className="w-2.5 h-2.5 mr-1.5 inline-block -mt-0.5" /> Premium</>}
                    </span>
                  </div>

                  <div className={`relative z-10 mt-6 font-black text-2xl tracking-tight ${item.iconColor}`}>
                    {item.sats.toLocaleString()} <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Sats</span>
                  </div>
                  <p className="relative z-10 mt-3 text-sm text-gray-400/80 leading-relaxed font-medium">
                    {premiumLocked
                      ? 'This milestone is locked for free tiers. Upgrade to any premium membership to unlock.'
                      : FREE_STREAK_DAYS.has(item.days)
                        ? 'Available to all users once your daily streak reaches this milestone.'
                        : 'Unlocked because your premium tier includes extended milestone rewards.'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Free Tiers */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white/90">Free Tiers</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {FREE_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`group rounded-[28px] border ${tier.border} bg-gradient-to-br ${tier.bg} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-white/20`}
              >
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-black/40 text-xl shadow-inner group-hover:scale-105 transition-transform">
                      {tier.icon}
                    </div>
                    <div>
                      <div className={`text-lg font-black tracking-wide ${tier.color}`}>{tier.name}</div>
                      <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">{tier.xp}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/5">
                  {tier.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-2.5 text-sm font-semibold text-gray-300">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${tier.color.replace('text-', 'bg-')}`} />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Memberships */}
        <section>
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500 shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white/90">Premium Memberships</h2>
              </div>
              <p className="text-base text-gray-400 max-w-3xl leading-relaxed">
                Unlock exclusive tasks, instant withdrawals, and huge earning multipliers. Select your preferred payment method directly on the cards below.
              </p>
            </div>
            <div className="flex w-full lg:w-auto lg:justify-end">
              <button
                type="button"
                onClick={() => setShowSatsPricing(!showSatsPricing)}
                className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition-all duration-300 shadow-[0_10px_24px_rgba(0,0,0,0.18)] ${
                  showSatsPricing
                    ? 'bg-gradient-to-r from-sats-orange-500 to-orange-400 text-black shadow-[0_0_18px_rgba(249,115,22,0.25)]'
                    : 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-[0_0_18px_rgba(34,197,94,0.25)]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{!showSatsPricing ? 'Upgrade Using Sats' : 'Upgrade Using USD'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>

          {/* Adjusted 3x2 Grid for Desktop using Flex-Wrap */}
          <div className="flex flex-wrap justify-center gap-6 items-stretch">
            {PREMIUM_TIERS.map((tier) => {
              const state = requestMap[tier.name] || { notify: false, upgrade: false };
              const monthlySats = Number(monthlyPricing[tier.name] || 0);
              const yearlySats = Number(yearlyPricing[tier.name] || 0);
              const monthlyEligible = monthlySats > 0 && availableBalance >= monthlySats;
              const yearlyEligible = yearlySats > 0 && availableBalance >= yearlySats;
              const isCurrentTier = currentPremiumTier === tier.name;
              const tierRank = getTierRank(tier.name);
              const belowCurrentPremium = currentPremiumRank >= 0 && tierRank < currentPremiumRank;
              const canUpgradeForward = currentPremiumRank < tierRank || currentPremiumRank === -1;
              const monthlyUnavailable = tier.name === 'FOUNDER';

              return (
                <PremiumRewardCard
                  key={tier.name}
                  tier={tier}
                  isCurrentTier={isCurrentTier}
                  monthlyUnavailable={monthlyUnavailable}
                  monthlyPlan={
                    monthlyUnavailable
                      ? undefined
                      : {
                          label: 'Monthly Plan',
                          showSatsPricing,
                          oldUsdYearly: tier.monthlyUsdOriginal,
                          newUsd: tier.monthlyUsd,
                          oldSatsMonthly: tier.oldSatsMonthly,
                          oldSatsYearly: tier.oldSatsYearly,
                          newSats: monthlySats > 0 ? monthlySats : null,
                          accentClass: tier.color,
                          eligible: monthlyEligible,
                          active: isCurrentTier,
                          loading: loadingKey === `${tier.name}-MONTHLY`,
                          disabled: loadingKey !== null || isCurrentTier || belowCurrentPremium || !canUpgradeForward || (!showSatsPricing && state.upgrade) || (showSatsPricing && !monthlyEligible),
                          requestSent: !showSatsPricing && state.upgrade,
                          actionLabel:
                            isCurrentTier
                              ? 'Currently Active'
                              : belowCurrentPremium
                                ? 'Higher Tier Active'
                                : showSatsPricing
                                  ? monthlyEligible
                                    ? 'Upgrade with Sats'
                                    : 'Insufficient Sats'
                                  : state.upgrade
                                    ? 'Request Sent'
                                    : 'Upgrade with USD',
                          onAction: () =>
                            showSatsPricing
                              ? handleSatsUpgrade(tier.name, 'MONTHLY')
                              : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-monthly'),
                        }
                  }
                  yearlyPlan={{
                    label: 'Yearly Plan (Save 20%)',
                    showSatsPricing,
                    oldUsdYearly: tier.yearlyUsdOriginal,
                    newUsd: tier.yearlyUsd,
                    oldSatsMonthly: '',
                    oldSatsYearly: tier.oldSatsYearly,
                    newSats: yearlySats > 0 ? yearlySats : null,
                    accentClass: tier.color,
                    eligible: yearlyEligible,
                    active: isCurrentTier,
                    loading: loadingKey === `${tier.name}-YEARLY`,
                    disabled: loadingKey !== null || isCurrentTier || belowCurrentPremium || !canUpgradeForward || (!showSatsPricing && state.upgrade) || (showSatsPricing && !yearlyEligible),
                    requestSent: !showSatsPricing && state.upgrade,
                    actionLabel:
                      isCurrentTier
                        ? 'Currently Active'
                        : belowCurrentPremium
                          ? 'Higher Tier Active'
                          : showSatsPricing
                            ? yearlyEligible
                              ? 'Upgrade with Sats'
                              : 'Insufficient Sats'
                            : state.upgrade
                              ? 'Request Sent'
                              : 'Upgrade with USD',
                    onAction: () =>
                      showSatsPricing
                        ? handleSatsUpgrade(tier.name, 'YEARLY')
                        : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-yearly'),
                  }}
                  statusBanner={
                    <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
                      <button
                        onClick={() => handleNotifyOrUpgrade(tier.name, 'NOTIFY_ME', 'rewards-page-notify')}
                        disabled={loadingKey !== null || state.notify || isCurrentTier || belowCurrentPremium}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {state.notify ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Info className="h-4 w-4" />}
                        <span>{state.notify ? 'We will notify you' : 'Notify me about updates'}</span>
                      </button>

                      {isCurrentTier ? (
                        <StatusBanner tone="green" message="This is your current premium tier." />
                      ) : belowCurrentPremium ? (
                        <StatusBanner tone="orange" message="Your current premium tier is already higher than this one." />
                      ) : showSatsPricing ? (
                        <StatusBanner
                          tone={monthlyEligible || yearlyEligible ? 'green' : 'orange'}
                          message={
                            monthlyEligible || yearlyEligible
                              ? `Enough balance for ${monthlyEligible && yearlyEligible ? 'monthly or yearly' : monthlyEligible ? 'monthly' : 'yearly'} sats purchase.`
                              : 'Switch to USD mode or add more sats to purchase.'
                          }
                        />
                      ) : state.upgrade ? (
                        <StatusBanner tone="blue" message="Upgrade request sent for this tier." />
                      ) : (
                        <StatusBanner tone="violet" message="Use upgrade request or notify me if you are planning this tier later." />
                      )}
                    </div>
                  }
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusBanner({ tone, message }: { tone: 'green' | 'orange' | 'violet' | 'blue'; message: string }) {
  const styles = {
    green: 'border-green-500/20 bg-green-500/10 text-green-300',
    orange: 'border-orange-500/20 bg-orange-500/10 text-orange-300',
    violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  };

  return <div className={`rounded-xl border px-3 py-2.5 text-[11px] sm:text-xs font-bold leading-relaxed ${styles[tone]}`}>{message}</div>;
}
