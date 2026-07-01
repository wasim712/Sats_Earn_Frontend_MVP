import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutStory = () => {
  return (
    <section id="story" className="px-4 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-12 items-start">
          
          <div className="lg:sticky lg:top-24">
            <FadeUp>
              <div className="bg-linear-to-br from-sats-orange-500/5 to-sats-black-800 border border-sats-orange-500/20 rounded-3xl p-8 sm:p-10">
                <span className="block text-5xl sm:text-6xl text-sats-orange-500 font-serif leading-0 h-6 sm:h-8">&quot;</span>
                <div className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight mt-2 mb-6 text-white">
                  Bitcoin isn&apos;t bought.<br />
                  It&apos;s <span className="text-sats-orange-500">earned.</span>
                </div>
                <div className="text-sm font-medium text-gray-400 leading-relaxed">
                  — The idea that started SatsEarn. If people create value every day just by being online, they deserve to be paid in the hardest money on earth.
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp className="text-gray-300">
            <div className="text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              Our Story
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 leading-tight tracking-tight">
              Why We Built This
            </h2>
            
            <div className="space-y-5 text-[15px] sm:text-base leading-relaxed">
              <p>
                I watched people lose money trying to get into Bitcoin. Friends who saved for months, bought at the wrong time, panicked, sold at a loss. The dream of owning Bitcoin turned into a nightmare the moment they had to put money in. <strong className="text-white">The barrier wasn&apos;t understanding. It was the buying.</strong>
              </p>
              
              <div className="my-8 bg-sats-black-800 border-l-4 border-sats-orange-500 rounded-r-xl p-5 sm:p-6 text-base sm:text-lg text-white font-semibold italic">
                &quot;What if you never had to buy Bitcoin at all? What if the tasks you already do online — following, watching, sharing, engaging — could pay you in real sats instead of nothing?&quot;
              </div>
              
              <p>
                At the same time, I saw something else. Brands spending billions on marketing that reached people who scrolled past and forgot. Real users creating real value — attention, engagement, action — every single day. And getting paid absolutely nothing for it.
              </p>
              <p>
                These two problems had one solution. <strong className="text-white">A platform where earning Bitcoin is as simple as completing a task.</strong> Where brands reach people who actually care. Where Bitcoin isn&apos;t something you buy — it&apos;s something you stack, one sat at a time, through things you already do.
              </p>
              <p>
                We started with zero users and zero hype. Just a question: <em className="text-sats-orange-500 not-italic font-semibold">what if anyone with an internet connection could earn real Bitcoin today?</em> We&apos;re still answering that question. We&apos;re in early beta. We&apos;re building in public. We make mistakes and we fix them openly.
              </p>
              <p>
                <strong className="text-white">This is just the beginning.</strong> Bitcoin adoption is accelerating and we believe the easiest on-ramp isn&apos;t buying — it&apos;s earning. SatsEarn is how that happens.
              </p>
              <p className="text-sats-orange-500 font-bold mt-8">
                — Wasim Akram, Founder, SatsEarn
              </p>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
};
