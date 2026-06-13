'use client';

import React, { useEffect, useRef } from 'react';

export const InteractiveBackground = () => {
  // We use refs to directly manipulate the DOM for zero-latency performance
  const highlightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // OPTIMIZATION: Do not calculate or fire interactions on mobile/tablet devices
      if (window.innerWidth < 1024) return;

      animationFrameId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;

        if (highlightRef.current) {
          const mask = `radial-gradient(350px circle at ${clientX}px ${clientY}px, black 0%, transparent 100%)`;
          highlightRef.current.style.maskImage = mask;
          highlightRef.current.style.setProperty('-webkit-mask-image', mask);
        }

        // Move the giant ambient glow orb to follow the cursor
        // Math matches the 600px height/width of the orb so it perfectly centers
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${clientX - 300}px, ${clientY - 300}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 bg-[#020202] overflow-hidden"
      style={{
        // Global vignette: Fades the entire background out beautifully toward the bottom of the page
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}
    >
      {/* LAYER 0: The Anchor Gradient (Fixes the "Floating Font" issue) */}
      {/* This provides a permanent, subtle environmental light source from the top of the page on ALL devices */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sats-orange-500/15 via-[#050505] to-transparent opacity-80" />

      {/* LAYER 1: The Base Grid (Always visible, provides grounding structure) */}
      <div className="absolute inset-0 bg-grid-base opacity-20" />
      
      {/* --- DESKTOP ONLY INTERACTIVE LAYERS --- */}
      
      {/* LAYER 2: The Premium Ambient Glow Orb (Hidden on mobile) */}
      <div
        ref={glowRef}
        // Fixed: Explicit 600px width/height so the JS math (clientX - 300) works perfectly
        className="hidden lg:block absolute left-0 top-0 h-150 w-150 rounded-full bg-sats-orange-500/10 blur-[120px] will-change-transform"
      />

      {/* LAYER 3: The Sharp Highlight Grid (Revealed only by the cursor mask, hidden on mobile) */}
      <div
        ref={highlightRef}
        className="hidden lg:block absolute inset-0 bg-grid-highlight opacity-70"
        style={{
          // Initial state before mouse moves
          maskImage: `radial-gradient(0px circle at 0px 0px, black 0%, transparent 100%)`, 
          WebkitMaskImage: `radial-gradient(0px circle at 0px 0px, black 0%, transparent 100%)`
        }}
      />
    </div>
  );
};