'use client';

import React, { useState } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Search, Plus, Minus } from 'lucide-react';

export function GlossarySection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const glossary = [
    { q: 'Bitcoin (BTC)', a: 'Decentralised digital money that runs on a worldwide peer-to-peer network. No bank, company, or government controls it — the rules are enforced by software and maths, and only 21 million will ever exist.' },
    { q: 'Satoshi / Sats', a: 'The smallest unit of Bitcoin, named after its creator. One bitcoin = 100,000,000 sats. You don\'t need a whole coin — most people stack sats, a little at a time.' },
    { q: 'Blockchain', a: 'The public ledger of every Bitcoin transaction ever made, grouped into "blocks" that are chained together in order. Anyone can inspect it, and no one can quietly rewrite history.' },
    { q: 'Halving', a: 'Roughly every four years, the reward miners get for adding a block is cut in half. This steadily slows the creation of new coins until issuance hits zero around 2140.' },
    { q: 'Mining', a: 'The process where specialised computers compete to validate transactions and add the next block. Winners earn newly issued bitcoin plus fees — and in doing so, secure the network.' },
    { q: 'Wallet', a: 'Software or a device that stores the keys to your bitcoin and lets you send and receive it. The wallet holds your keys, not the coins themselves — the coins live on the blockchain.' },
    { q: 'Private Key / Seed Phrase', a: 'The secret that proves ownership of your bitcoin, usually backed up as 12–24 words. Anyone with it controls the funds — so it must never be shared, photographed, or typed into a website.' },
    { q: 'HODL', a: 'Originally a typo of "hold," now shorthand for holding bitcoin through ups and downs rather than trading it. A long-term mindset over short-term moves.' },
    { q: 'Lightning Network', a: 'A layer built on top of Bitcoin for instant, very low-cost payments — ideal for small, everyday amounts. It\'s how SatsEarn pays out the sats you stack.' },
    { q: 'DCA (Dollar-Cost Averaging)', a: 'Buying or earning a fixed small amount on a regular schedule instead of all at once. It smooths out volatility and removes the guesswork of trying to time the market.' },
    { q: 'Fiat Currency', a: 'Government-issued money like the dollar, euro, or rupee. Its supply can be expanded by central banks — the opposite of Bitcoin\'s fixed cap.' },
    { q: 'Stock-to-Flow (S2F)', a: 'A scarcity model comparing existing supply ("stock") to yearly new production ("flow"). Each halving cuts the flow, raising the ratio. It\'s a popular framework, not a guarantee.' },
    { q: 'Mempool', a: 'The waiting room for unconfirmed transactions. When it\'s busy, fees rise as transactions compete to be included in the next block; when it\'s quiet, fees fall.' },
    { q: '"Not your keys, not your coins"', a: 'A core Bitcoin principle: if someone else holds your keys (like an exchange), you\'re trusting them with your money. Holding your own keys means holding your own bitcoin.' }
  ];

  const filteredGlossary = glossary.filter(
    item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 sm:py-24 relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center gap-3 mb-4">
          <span className="w-8 h-[1px] bg-sats-orange-500 opacity-50"></span>
          Bitcoin Glossary
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 text-white">The words, in plain English</h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-12">Tap any term to expand its definition. No prior knowledge assumed.</p>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="relative mb-10 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="relative w-full bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.08] focus:border-sats-orange-500/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-colors"
            placeholder="Search terms — e.g. halving, wallet, sats…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </FadeUp>

      <div className="flex flex-col gap-3">
        {filteredGlossary.length === 0 ? (
          <FadeUp delay={0.3}>
            <div className="text-gray-500 italic py-4">No terms match that search. Try another word.</div>
          </FadeUp>
        ) : (
          filteredGlossary.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <FadeUp key={idx} delay={0.1 + (idx % 10) * 0.05}>
                <div 
                  className={`bg-sats-black-900/40 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-sats-orange-500/40 bg-sats-black-900/80 shadow-[0_4px_20px_rgba(247,147,26,0.08)]' : 'border-white/[0.04] hover:border-white/[0.1]'}`}
                >
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex justify-between items-center gap-4 group"
                  >
                    <span className={`font-bold text-base sm:text-lg transition-colors ${isOpen ? 'text-sats-orange-500' : 'text-white group-hover:text-sats-orange-400'}`}>
                      {item.q}
                    </span>
                    <span className={`flex-shrink-0 text-sats-orange-500 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-180' : ''}`}>
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  
                  {/* Smooth Expanding Answer like home FAQ */}
                  <div 
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-5 text-gray-400 text-sm sm:text-base leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })
        )}
      </div>
    </section>
  );
}
