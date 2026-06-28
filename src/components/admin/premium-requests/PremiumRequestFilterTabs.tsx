import React from 'react';

import type { PremiumRequestFilter } from './premiumRequest.helpers';
import { premiumRequestFilterOptions } from './premiumRequest.helpers';

export function PremiumRequestFilterTabs({
  activeFilter,
  counts,
  onChange,
}: {
  activeFilter: PremiumRequestFilter;
  counts: Record<PremiumRequestFilter, number>;
  onChange: (filter: PremiumRequestFilter) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 rounded-[24px] border border-[#171717] bg-[#050505] p-2">
      {premiumRequestFilterOptions.map((option) => {
        const isActive = activeFilter === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition-colors ${
              isActive
                ? 'border-sats-orange-500/30 bg-sats-orange-500/12 text-sats-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.12)]'
                : 'border-[#202020] bg-[#090909] text-gray-400 hover:border-[#303030] hover:text-white'
            }`}
          >
            <span>{option.label}</span>
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[12px] font-black text-inherit">{counts[option.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
