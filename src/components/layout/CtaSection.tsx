'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeUp } from '@/components/animations/FadeUp';

export const CTASection = () => {
  const router = useRouter();

  return (
    // Slightly larger padding bottom (pb-24) to give breathing room before the Footer
    <section className="relative pt-16  sm:pt-20  overflow-hidden border-t border-sats-black-800/50">
      
      {/* Central Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-125 h-75 sm:h-125 bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Ready to Start <span className="text-sats-orange-500">Stacking Sats</span>?
          </h2>
          
          <p className="text-base sm:text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of users earning Bitcoin every day. No investment needed, just your time.
          </p>

          {/* Button Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button 
              size="lg" 
              onClick={() => router.push('/signup')} 
              className="w-full sm:w-auto gap-2 group shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => router.push('/for-brands')} 
              className="w-full sm:w-auto gap-2 group bg-sats-black-900 border-sats-black-700 hover:bg-sats-black-800"
            >
              <Megaphone className="w-5 h-5 text-gray-400 group-hover:text-sats-orange-500 transition-colors" />
              Advertise With Us
              <ArrowRight className="w-5 h-5 text-gray-500 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

        </FadeUp>
      </div>
    </section>
  );
};