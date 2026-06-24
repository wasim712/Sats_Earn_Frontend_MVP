'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { ArrowRight, BookOpen, Sparkles, Globe2 } from 'lucide-react';

const BLOG_HIGHLIGHTS = [
  {
    title: 'Bitcoin guides for beginners',
    description: 'Simple explainers, platform walkthroughs, and earning tips for every type of user.',
  },
  {
    title: 'Platform updates and announcements',
    description: 'Stay in sync with new features, campaign changes, and upcoming improvements.',
  },
  {
    title: 'Available for everyone',
    description: 'Read blogs in logged-out state too, with the same smooth reading experience as inside the app.',
  },
];

export const BlogPreviewSection = () => {
  return (
    <section className="relative overflow-hidden py-12" id="blogs">
      <div className="pointer-events-none absolute inset-0 " />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <FadeUp className="mb-16 text-center">
          <div className="mb-4 inline-flex rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1 backdrop-blur-sm">
            <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-sats-orange-500">
              <BookOpen className="h-3.5 w-3.5" />
              SatsEarn Blogs
            </span>
          </div>

          <h2 className="mb-6 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Read, Learn, and Stay
            <br />
            <span className="text-sats-orange-500">Updated Anytime.</span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Explore public blog articles about Bitcoin basics, platform updates, earning strategies, and useful reads - now available even before login.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <FadeUp delay={0.1} className="overflow-hidden rounded-[32px] border border-sats-orange-500/16 bg-[#080808] shadow-[0_20px_70px_rgba(0,0,0,0.40)]">
            <div className="border-b border-white/6 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_35%)] p-6 sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-sky-300">
                <Globe2 className="h-3.5 w-3.5" />
                Public Access
              </div>

              <h3 className="text-2xl font-black text-white sm:text-3xl">
                Same premium reading layout, now on the home side too.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-[15px]">
                The public blog route uses the same design language as the logged-in blog section, so users get a consistent experience whether they are signed in or just discovering the platform.
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
              {BLOG_HIGHLIGHTS.map((item, index) => (
                <div
                  key={item.title}
                  className="group rounded-[24px] border border-white/8 bg-[#050505] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sats-orange-500/20 hover:bg-[#0a0a0a]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-sats-orange-500/18 bg-sats-orange-500/10 text-sats-orange-400 shadow-[0_0_24px_rgba(249,115,22,0.10)]">
                    {index === 0 ? <BookOpen className="h-5 w-5" /> : index === 1 ? <Sparkles className="h-5 w-5" /> : <Globe2 className="h-5 w-5" />}
                  </div>
                  <h4 className="text-base font-black text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.15} className="flex flex-col justify-between rounded-[32px] border border-white/8 bg-[#080808] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32)] sm:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-sats-orange-400">
                <Sparkles className="h-3.5 w-3.5" />
                Live Route Ready
              </div>

              <h3 className="text-2xl font-black text-white">Open the complete blog hub</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-[15px]">
                Browse all published articles, search topics, and read content in the same smooth split-view reader used in the user dashboard.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <Link
                href="/blogs"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 px-5 py-4 text-sm font-black text-white shadow-[0_10px_26px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(249,115,22,0.34)]"
              >
                Explore Blogs
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>

              <div className="rounded-2xl border border-white/8 bg-[#050505] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Route: <span className="text-sats-orange-400">/blogs</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};
