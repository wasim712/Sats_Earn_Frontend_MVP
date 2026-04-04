import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-sats-black-700 bg-sats-black-900 p-6 sm:p-8 transition-all duration-300 ${className}`}
      {...props}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
      {/* CRITICAL FIX: Added `h-full flex flex-col` so content stretches perfectly */}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};