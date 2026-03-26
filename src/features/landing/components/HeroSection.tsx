'use client'; // Required for Next.js when using state, refs, or GSAP

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeUp } from '@/components/animations/FadeUp';

export const HeroSection = () => {
  const router = useRouter();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <section className="relative overflow-visible pt-12 pb-8 sm:pt-20 sm:pb-10">
      {/* 1. The Global Top Headline */}
      <FadeUp className="text-center mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          The <span className="text-transparent bg-clip-text bg-linear-to-r from-sats-orange-400 to-sats-orange-600">#1</span> Gamified Platform to Earn <span className="text-sats-orange-500">Bitcoin</span>
        </h2>
      </FadeUp>

      {/* 2. The Split Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Copy & CTAs */}
        <FadeUp className="text-center lg:text-left z-10">
          <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 border border-sats-orange-500/20">
            <span className="text-sats-orange-500 text-xs font-bold tracking-wide">Stack Sats, Not Excuses</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1]">
            Earn <span className="text-sats-orange-500">Bitcoin</span> by <br className="hidden lg:block" />
            Doing Simple Tasks
          </h1>
          
          <p className="text-base sm:text-lg text-gray-400 font-medium mb-10 max-w-xl mx-auto lg:mx-0">
            Complete surveys, watch videos, engage on social media, and earn <span className="text-sats-orange-500 font-bold">Bitcoin</span> (sats) instantly.
          </p>

          {/* Stats Row */}
          <div className="flex justify-center lg:justify-start gap-8 sm:gap-12 mb-10">
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-sats-orange-500">12K+</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Active Users</div>
            </div>
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-sats-orange-500">1M+</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Tasks Completed</div>
            </div>
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-sats-orange-500">₿2.5</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">BTC Distributed</div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Button size="lg" onClick={() => router.push('/signup')} className="gap-2 group w-full sm:w-auto">
              Start Earning Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" size="lg" className="gap-2 w-full sm:w-auto" onClick={handlePlayVideo}>
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Complete tasks</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Withdraw Bitcoin</span>
          </div>
        </FadeUp>

        {/* Right Column: Custom Video Player */}
        <FadeUp delay={0.2} className="relative w-full max-w-lg mx-auto lg:max-w-none z-10">
          <div className="relative rounded-2xl overflow-hidden border border-sats-black-800 bg-sats-black-900/50 p-2 backdrop-blur-md shadow-[0_0_50px_rgba(249,115,22,0.15)] group">
            
            <video 
              ref={videoRef}
              src="/demo-video.mp4" 
              className="w-full rounded-xl bg-black aspect-video object-cover"
              controls={isVideoPlaying}
              playsInline
            />

            {/* Custom Play Button Overlay */}
            {!isVideoPlaying && (
              <div 
                onClick={handlePlayVideo}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all duration-300 group-hover:bg-black/20"
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-r from-sats-orange-500 to-sats-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-10 h-10 ml-1" fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        </FadeUp>

      </div>
    </section>
  );
};