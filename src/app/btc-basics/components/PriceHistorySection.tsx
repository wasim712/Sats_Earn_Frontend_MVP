'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function PriceHistorySection() {
  const pricesCol1 = [
    { year: '2009', val: '< $0.01' },
    { year: '2010', val: '$0.39' },
    { year: '2011', val: '$31.91' },
    { year: '2012', val: '$15.40' },
    { year: '2013', val: '$1,242' },
    { year: '2014', val: '$948' },
    { year: '2015', val: '$497' },
    { year: '2016', val: '$979' },
    { year: '2017', val: '$19,783' }
  ];

  const pricesCol2 = [
    { year: '2018', val: '$17,527' },
    { year: '2019', val: '$13,880' },
    { year: '2020', val: '$29,300' },
    { year: '2021', val: '$69,000' },
    { year: '2022', val: '$47,683' },
    { year: '2023', val: '$44,729' },
    { year: '2024', val: '$108,353' },
    { year: '2025', val: '$126,210' },
    { year: '2026 *', val: 'in progress' }
  ];

  const TableBlock = ({ data }: { data: { year: string; val: string }[] }) => (
    <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-2 gap-4 px-5 py-4 bg-sats-orange-500/[0.06] border-b border-white/[0.04]">
        <div className="font-mono text-[12px] tracking-[1.5px] uppercase text-sats-orange-500">Year</div>
        <div className="font-mono text-[12px] tracking-[1.5px] uppercase text-sats-orange-500 text-right">Year High</div>
      </div>
      <div className="flex flex-col">
        {data.map((row, i) => (
          <div key={i} className={`grid grid-cols-2 gap-4 px-5 py-3.5 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors`}>
            <div className="font-mono text-sm text-gray-400">{row.year}</div>
            <div className={`font-mono font-bold text-sm text-right ${row.val === 'in progress' ? 'text-gray-400 italic' : 'text-sats-orange-500'}`}>{row.val}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 sm:py-24 relative px-4 max-w-5xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center gap-3 mb-4">
          <span className="w-8 h-[1px] bg-sats-orange-500 opacity-50"></span>
          Annual Price History
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 text-white">Yearly highs, 2009 to today</h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-12">The highest price Bitcoin reached in each calendar year. Volatility is part of the story — these are peaks, not averages.</p>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
        <FadeUp delay={0.2}>
          <TableBlock data={pricesCol1} />
        </FadeUp>
        <FadeUp delay={0.3}>
          <TableBlock data={pricesCol2} />
        </FadeUp>
      </div>

      <FadeUp delay={0.4}>
        <p className="text-xs sm:text-sm text-gray-400 italic max-w-3xl mx-auto">
          Historical yearly highs, rounded. * 2026 is ongoing. This is educational data, not financial advice — past prices never guarantee future ones.
        </p>
      </FadeUp>
    </section>
  );
}
