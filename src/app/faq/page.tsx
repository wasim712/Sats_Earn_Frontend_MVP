'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';


import { FAQQuestion, FAQCategory, faqData } from "./faqData";
export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isFading, setIsFading] = useState<boolean>(false);
  const mobileTabContainerRef = useRef<HTMLDivElement>(null);

  // FAQ categories and questions object

  // Flat helper to count and search questions
  const totalQuestions = faqData.reduce((acc, cat) => acc + cat.questions.length, 0);

  // Filtered categories and questions based on active category & search query
  const filteredData = faqData
    .map((cat) => {
      const filteredQuestions = cat.questions.filter((item) => {
        const matchesQuery =
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          // Approximate check on text representation of JSX element
          item.q.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesQuery;
      });

      return {
        ...cat,
        questions: filteredQuestions
      };
    })
    .filter((cat) => {
      // If activeCategory is set to something specific, show only that category
      if (activeCategory !== 'all' && cat.id !== activeCategory) {
        return false;
      }
      // If we are searching, show only categories that have matching questions
      return cat.questions.length > 0;
    });

  const totalMatches = filteredData.reduce((acc, cat) => acc + cat.questions.length, 0);

  // Trigger fluent fade animation on category filter change
  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => setIsFading(false), 200);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setActiveQuestionId(null); // Close any open questions

    // Smooth scroll to the layout section top on mobile/desktop
    const targetElement = document.getElementById('faq-grid-section');
    if (targetElement) {
      const yOffset = -90;
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen bg-sats-black-950 ">
      
      {/* Background Glows Container (with overflow-hidden so sticky works on children) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[radial-gradient(circle,rgba(238,139,18,0.08),transparent_60%)]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,139,18,0.03),transparent_65%)]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,139,18,0.05),transparent_60%)]"></div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is SatsEarn?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SatsEarn is a platform where you can learn about Bitcoin and earn real satoshis (fractions of Bitcoin) by completing simple tasks, answering daily quizzes, and engaging with our community. No investment or purchase is ever required."
                }
              },
              {
                "@type": "Question",
                "name": "Is SatsEarn free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, 100% free. We will never ask you to buy Bitcoin, deposit funds, or enter credit card information."
                }
              },
              {
                "@type": "Question",
                "name": "What are satoshis (sats)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A satoshi (sat) is the smallest unit of Bitcoin. Just like there are 100 cents in a dollar, there are 100,000,000 sats in one Bitcoin."
                }
              },
              {
                "@type": "Question",
                "name": "How do I withdraw my earnings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can withdraw your earnings instantly over the Lightning Network once you reach the minimum withdrawal threshold. Simply enter a Lightning invoice from a supported wallet like Wallet of Satoshi, Strike, or Phoenix."
                }
              }
            ]
          }),
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">

        {/* HERO */}
        <header className="text-center pb-12 sm:pb-16">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-5 py-2.5 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 animate-pulse"></span>
              Help Centre
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tighter mb-6 text-white">
              Got Questions?<br />
              <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent">We&apos;ve Got Answers.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Everything you need to know about SatsEarn — from signing up to withdrawing your first sats via Lightning Network.
            </p>
          </FadeUp>
          
          {/* SEARCH BAR */}
          <FadeUp delay={0.4}>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeCategory !== 'all') {
                    setActiveCategory('all');
                  }
                }}
                className="w-full pl-12 pr-28 py-4 bg-sats-black-900/60 backdrop-blur-md border border-white/[0.04] rounded-2xl font-sans text-sm sm:text-base text-white placeholder-gray-500 outline-none focus:border-sats-orange-500/35 focus:shadow-[0_0_20px_rgba(238,139,18,0.1)] transition-all duration-300"
              />
              <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <span className="absolute right-4.5 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-500 pointer-events-none">
                {searchQuery ? `${totalMatches} ${totalMatches === 1 ? 'match' : 'matches'}` : `${totalQuestions} FAQs`}
              </span>
            </div>
          </FadeUp>
        </header>

        {/* MOBILE CATEGORY SCROLL BAR */}
        <div className="hidden sticky top-[60px] bg-sats-black-950 z-40 border-b border-white/[0.04] py-3 -mx-4 px-4 overflow-hidden">
          <div 
            ref={mobileTabContainerRef}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 text-xs font-bold rounded-full border whitespace-nowrap transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-sats-orange-500/10 border-sats-orange-500/35 text-sats-orange-500 shadow-[0_0_15px_rgba(238,139,18,0.08)]'
                  : 'bg-sats-black-900/60 border-white/[0.03] text-gray-400 hover:text-white'
              }`}
            >
              All Questions
            </button>
            {faqData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full border whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-sats-orange-500/10 border-sats-orange-500/35 text-sats-orange-500 shadow-[0_0_15px_rgba(238,139,18,0.08)]'
                    : 'bg-sats-black-900/60 border-white/[0.03] text-gray-400 hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <section id="faq-grid-section" className="flex flex-col md:flex-row gap-0 md:gap-4 mt-8 md:mt-16 min-h-[50vh] relative">
          
          {/* Subtle vertical divider between columns for desktop */}
          <div className="hidden md:block absolute left-[16.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent z-0"></div>

          {/* DESKTOP SIDEBAR */}
          <aside className="w-64 flex-shrink-0 sticky top-40 self-start hidden md:flex flex-col gap-1.5 pr-6 z-10">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-3">
              Categories
            </div>
            <button
              onClick={() => handleCategoryChange('all')}
              className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl border flex items-center justify-between transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-sats-orange-500/10 border-sats-orange-500/30 text-sats-orange-500 shadow-[0_0_15px_rgba(238,139,18,0.05)]'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <span>All Questions</span>
              <span className="font-mono text-xs text-gray-500">{totalQuestions}</span>
            </button>
            {faqData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-sats-orange-500/10 border-sats-orange-500/30 text-sats-orange-500 shadow-[0_0_15px_rgba(238,139,18,0.05)]'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <span>{cat.title}</span>
              <span className="font-mono text-xs text-gray-500">{cat.questions.length}</span>
            </button>
          ))}
          </aside>

          {/* QUESTIONS LIST */}
          <div className="flex-1 min-w-0 md:pl-10">
            <div className={`transition-all duration-200 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              
              {/* NO RESULTS VIEW */}
              {totalMatches === 0 && (
                <div className="text-center py-16 px-4 bg-sats-black-900/30 border border-white/[0.03] rounded-2xl backdrop-blur-md">
                  <span className="text-3xl block mb-4">🔍</span>
                  <h3 className="text-lg font-bold text-white mb-2">No matching questions found</h3>
                  <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                    We couldn&apos;t find any FAQs matching &quot;{searchQuery}&quot;. Try different keywords, reset the search, or contact <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>.
                  </p>
                </div>
              )}

              {/* LIST CATEGORIES */}
              {filteredData.map((cat) => (
                <div key={cat.id} className="mb-14 last:mb-0">
                  
                  {/* Category Header */}
                  <div className="flex items-center gap-3.5 mb-6 pb-3 border-b border-white/[0.04]">
                    <div className="w-10 h-10 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center text-sats-orange-500 shadow-sm shadow-sats-orange-500/5">
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">{cat.title}</h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{cat.sub}</p>
                    </div>
                  </div>

                  {/* Accordion Questions */}
                  <div className="flex flex-col gap-3">
                    {cat.questions.map((item, index) => {
                      const qId = `${cat.id}-${index}`;
                      const isOpen = activeQuestionId === qId;

                      return (
                        <div
                          key={index}
                          className={`bg-sats-black-900/40 backdrop-blur-xs border rounded-2xl overflow-hidden transition-all duration-300 ${
                            isOpen
                              ? 'border-sats-orange-500/35 shadow-[0_4px_25px_rgba(0,0,0,0.5)] bg-sats-black-900/80'
                              : 'border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.01]'
                          }`}
                        >
                          <button
                            onClick={() => setActiveQuestionId(isOpen ? null : qId)}
                            aria-expanded={isOpen}
                            className="w-full text-left px-5 sm:px-6 py-4.5 flex justify-between items-center gap-4 cursor-pointer outline-none transition-colors"
                          >
                            <span className={`text-sm sm:text-base font-bold transition-colors duration-200 ${
                              isOpen ? 'text-sats-orange-500' : 'text-white'
                            }`}>
                              {item.q}
                            </span>
                            <span className={`w-7 h-7 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center text-sats-orange-500 transition-all duration-300 flex-shrink-0 ${
                              isOpen ? 'bg-sats-orange-500 text-black border-sats-orange-500 shadow-[0_0_10px_rgba(238,139,18,0.25)]' : ''
                            }`}>
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-300 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </span>
                          </button>
                          
                          <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                          >
                            <div className="overflow-hidden">
                              <div className="pb-5 px-5 sm:px-6 text-sm sm:text-base text-gray-400 leading-relaxed pt-3 border-t border-white/[0.02]">
                                {item.a}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}

            </div>
          </div>
        </section>

        {/* STILL NEED HELP CTA */}
        <section className="mt-20">
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden bg-gradient-to-br from-sats-black-900 via-sats-black-900 to-sats-orange-500/10 border border-white/[0.05] rounded-3xl p-10 md:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sats-orange-500/30 to-transparent"></div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 text-white">Still Need Help?</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                Can&apos;t find your answer here? Our dedicated support team responds to every inquiry — usually within 24 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="mailto:support@satsearn.app" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-sm transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(238,139,18,0.35)] shadow-[0_5px_15px_rgba(238,139,18,0.2)] tracking-wider uppercase font-mono">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                  support@satsearn.app
                </a>
                <Link href="/support" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-extrabold text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 tracking-wider uppercase font-mono">
                  Go to Support Page
                </Link>
              </div>
            </div>
          </FadeUp>
        </section>

      </div>
    </main>
  );
}
