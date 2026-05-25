import React from 'react';
import { Crown } from 'lucide-react';
import { SettingsSectionCard } from './SettingsSectionCard';
import { inputCls } from './settings.constants';

const PREMIUM_TIERS = ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];

export function PremiumMonthlySatsMatrixSection({ values, onChange }: { values: Record<string, number>; onChange: (tier: string, value: string) => void }) {
  return (
    <SettingsSectionCard title="Premium Monthly Sats Pricing" description="Control monthly sats required for each premium tier." icon={<Crown className="w-5 h-5 text-sats-orange-500" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PREMIUM_TIERS.map((tier) => (
          <label key={tier} className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-gray-400">{tier}</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={values[tier] ?? 0}
              onChange={(event) => onChange(tier, event.target.value)}
              className={inputCls}
            />
          </label>
        ))}
      </div>
    </SettingsSectionCard>
  );
}
