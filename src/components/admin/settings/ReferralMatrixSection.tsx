import React from 'react';
import { Crown, Medal, Shield } from 'lucide-react';

import { FREE_TIERS, PREMIUM_TIERS } from './settings.constants';
import { SettingsSectionCard } from './SettingsSectionCard';

export function ReferralMatrixSection({
  values,
  onChange,
}: {
  values: Record<string, number>;
  onChange: (tier: string, value: string) => void;
}) {
  return (
    <SettingsSectionCard
      title="Referral Commission Matrix"
      description="Set the exact percentage a referrer earns based on their current tier."
      icon={<Medal className="w-5 h-5 text-blue-400" />}
      className="md:col-span-2"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReferralTierColumn
          title="Free XP Tiers"
          titleClassName="text-gray-400"
          icon={<Shield className="w-4 h-4" />}
          tiers={FREE_TIERS}
          values={values}
          onChange={onChange}
          cardClassName="bg-[#0a0a0a] border border-[#1a1a1a]"
          labelClassName="text-gray-400"
          inputClassName="w-full bg-[#111] text-white font-bold text-sm border border-[#2a2a2a] rounded-lg px-3 py-1.5 outline-none focus:border-sats-orange-500"
          suffixClassName="text-gray-400"
        />

        <ReferralTierColumn
          title="Premium Subs"
          titleClassName="text-yellow-500/80"
          icon={<Crown className="w-4 h-4 text-yellow-500" />}
          tiers={PREMIUM_TIERS}
          values={values}
          onChange={onChange}
          cardClassName="bg-[#111] border border-yellow-500/20 shadow-[inset_0_0_20px_rgba(234,179,8,0.02)]"
          labelClassName="text-yellow-500/70"
          inputClassName="w-full bg-[#050505] text-yellow-400 font-bold text-sm border border-yellow-500/30 rounded-lg px-3 py-1.5 outline-none focus:border-yellow-500"
          suffixClassName="text-yellow-600/50"
        />
      </div>
    </SettingsSectionCard>
  );
}

function ReferralTierColumn({
  title,
  titleClassName,
  icon,
  tiers,
  values,
  onChange,
  cardClassName,
  labelClassName,
  inputClassName,
  suffixClassName,
}: {
  title: string;
  titleClassName: string;
  icon: React.ReactNode;
  tiers: string[];
  values: Record<string, number>;
  onChange: (tier: string, value: string) => void;
  cardClassName: string;
  labelClassName: string;
  inputClassName: string;
  suffixClassName: string;
}) {
  return (
    <div>
      <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${titleClassName}`}>
        {icon} {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {tiers.map((tier) => (
          <div key={tier} className={`rounded-xl p-3 flex flex-col gap-1.5 shadow-sm ${cardClassName}`}>
            <span className={`text-[9px] font-black uppercase tracking-widest ${labelClassName}`}>{tier}</span>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={values[tier] || ''}
                onChange={(event) => onChange(tier, event.target.value)}
                className={inputClassName}
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${suffixClassName}`}>%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
