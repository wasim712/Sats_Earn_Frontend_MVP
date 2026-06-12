import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutStats = () => {
  const stats = [
    { value: '∞', label: 'Ways to Earn' },
    { value: '180+', label: 'Countries' },
    { value: '$0', label: 'Minimum to Start' },
    { value: '100%', label: 'Real Sats' },
  ];

  return (
    <section className="px-4 py-6 sm:py-8">
      <FadeUp>
        <div className="max-w-4xl mx-auto grid grid-cols-2
        sm:grid-cols-4 bg-sats-black-800 border border-sats-orange-500/15 rounded-2xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-sats-orange-500/15">
          {stats.map((stat, i) => (
            <div key={i} className="flex-1 p-6 sm:py-8 sm:px-4 text-center">
              <div className="text-3xl sm:text-4xl font-black text-sats-orange-500 font-mono leading-none">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 tracking-[0.1em] uppercase mt-2 font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
};
