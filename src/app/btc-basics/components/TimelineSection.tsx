'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function TimelineSection() {
  const events = [
    { date: 'Oct 2008', title: 'The Whitepaper', desc: 'An author using the name Satoshi Nakamoto publishes "Bitcoin: A Peer-to-Peer Electronic Cash System" — nine pages describing money without banks.', future: false },
    { date: '3 Jan 2009', title: 'Genesis Block Mined', desc: 'The first block is mined, carrying a headline about bank bailouts embedded in its data — a pointed comment on the system Bitcoin was built to sidestep.', future: false },
    { date: '22 May 2010', title: 'Bitcoin Pizza Day', desc: '10,000 BTC are swapped for two pizzas — the first real-world purchase. Those coins would be worth a fortune at later prices.', future: false },
    { date: 'Feb 2011', title: '1 BTC = 1 USD', desc: 'For the first time, a single bitcoin trades at parity with the US dollar — a milestone that felt impossible only months earlier.', future: false },
    { date: '28 Nov 2012', title: 'First Halving', desc: 'The block reward drops from 50 to 25 BTC — the first programmed supply shock, and proof the halving mechanism works as designed.', future: false },
    { date: 'Nov 2013', title: 'First $1,000', desc: 'Bitcoin breaks $1,000 for the first time, catching mainstream media attention and a fresh wave of curiosity.', future: false },
    { date: '9 Jul 2016', title: 'Second Halving', desc: 'The reward falls from 25 to 12.5 BTC, setting the stage for the 2017 bull run toward $20,000.', future: false },
    { date: 'Dec 2017', title: 'First ~$20,000', desc: 'Bitcoin reaches an all-time high near $19,800, drawing worldwide attention and the first serious institutional curiosity.', future: false },
    { date: '11 May 2020', title: 'Third Halving', desc: 'The reward drops from 12.5 to 6.25 BTC, just ahead of the explosive 2020–2021 cycle.', future: false },
    { date: 'Sep 2021', title: 'First Legal Tender', desc: 'El Salvador becomes the first country to adopt Bitcoin as official legal tender alongside the US dollar.', future: false },
    { date: 'Nov 2021', title: 'First ~$69,000', desc: 'Bitcoin sets a then-record near $69,000 as mainstream and corporate adoption accelerates.', future: false },
    { date: 'Jan 2024', title: 'US Spot ETFs Approved', desc: 'US regulators approve spot Bitcoin ETFs — a watershed that opened a regulated on-ramp for institutional capital.', future: false },
    { date: '19 Apr 2024', title: 'Fourth Halving', desc: 'The reward drops from 6.25 to 3.125 BTC. Bitcoin\'s new-supply rate is now lower than gold\'s annual production.', future: false },
    { date: 'Dec 2024', title: 'First $100,000', desc: 'Bitcoin crosses six figures for the first time, cementing its place as a global macro asset.', future: false },
    { date: '6 Oct 2025', title: 'All-Time High ~$126,000', desc: 'Bitcoin sets its record to date around $126,210, driven by heavy ETF inflows — before a sharp correction into 2026.', future: false },
    { date: '~2028 (est.)', title: 'Fifth Halving', desc: 'The reward is expected to halve again from 3.125 to ~1.5625 BTC, continuing the pre-set issuance schedule.', future: true },
    { date: '~2140 (est.)', title: 'The Last Bitcoin', desc: 'The 21-millionth and final bitcoin is mined. After that, miners are paid only in transaction fees, and the supply is complete forever.', future: true }
  ];

  return (
    <section className="py-16 sm:py-24 relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center gap-3 mb-4">
          <span className="w-8 h-[1px] bg-sats-orange-500 opacity-50"></span>
          Key Dates & Milestones
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 text-white">The moments that shaped Bitcoin</h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-12">From a nine-page whitepaper to a multi-trillion-dollar macro asset — the story in order.</p>
      </FadeUp>

      <div className="relative ml-2 sm:ml-4">
        {/* Main Timeline Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-sats-orange-500 via-sats-orange-500/40 to-transparent"></div>

        <div className="flex flex-col gap-0">
          {events.map((ev, idx) => (
            <FadeUp key={idx} delay={0.1 + (idx % 5) * 0.1}>
              <div className={`relative pl-[36px] sm:pl-[48px] pb-8 sm:pb-10 group ${ev.future ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${ev.future ? 'bg-sats-black-950 border-gray-600 shadow-[0_0_0_4px_rgba(6,6,8,1)]' : 'bg-sats-black-950 border-sats-orange-500 shadow-[0_0_0_4px_rgba(6,6,8,1),0_0_12px_rgba(247,147,26,0.3)]'} z-10 transition-colors group-hover:border-sats-orange-400`}></div>
                
                <div className={`font-mono text-[11px] sm:text-xs font-bold tracking-[1px] mb-1.5 ${ev.future ? 'text-gray-500' : 'text-sats-orange-500'}`}>
                  {ev.date}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{ev.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl">{ev.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
