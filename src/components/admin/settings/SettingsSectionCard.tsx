import React from 'react';

export function SettingsSectionCard({
  title,
  description,
  icon,
  className = '',
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-6">
        <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl">{icon}</div>
        <div>
          <h2 className="text-lg font-black text-white">{title}</h2>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
