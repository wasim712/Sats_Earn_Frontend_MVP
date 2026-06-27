'use client';

import React from 'react';
import { LayoutGrid, Users } from 'lucide-react';
import { SettingsSectionCard } from '@/components/admin/settings/SettingsSectionCard';

type UserSidebarVisibilitySectionProps = {
  values: Record<string, boolean>;
  onToggle: (key: string) => void;
};

function formatSidebarLabel(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

export function UserSidebarVisibilitySection({ values, onToggle }: UserSidebarVisibilitySectionProps) {
  return (
    <SettingsSectionCard
      title="User Sidebar Visibility"
      description="Admins can hide user dashboard sections from the backend. Hidden items disappear from the sidebar and blocked pages will not render."
      icon={<Users className="w-5 h-5 text-emerald-400" />}
      className="md:col-span-2"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(values).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            aria-pressed={value}
            className={`group flex w-full items-center gap-4 rounded-[20px] border p-4 text-left transition-all duration-300 ${
              value
                ? 'border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                : 'border-[#1a1a1a] bg-[#050505] hover:border-[#2a2a2a] hover:bg-[#0a0a0a]'
            }`}
          >
            {/* Icon Container (Strictly sized so it never stretches) */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border transition-all duration-300 ${
                value
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.2)]'
                  : 'border-[#222] bg-[#111] text-gray-400 group-hover:text-gray-400'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </div>

            {/* Text Content (Takes available space, safely truncates if too long) */}
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-bold transition-colors duration-300 ${value ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                {formatSidebarLabel(key)}
              </p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-gray-400">
                {value ? 'Visible to users' : 'Hidden from users'}
              </p>
            </div>

            {/* Toggle Switch (Strictly sized and positioned to prevent overflow) */}
            <div
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                value ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-[#222] group-hover:bg-[#333]'
              }`}
            >
              <span
                className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  value ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </div>
          </button>
        ))}
      </div>
    </SettingsSectionCard>
  );
}