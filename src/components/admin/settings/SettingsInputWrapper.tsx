import React from 'react';

export function SettingsInputWrapper({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{icon}</div>
        {children}
      </div>
    </div>
  );
}
