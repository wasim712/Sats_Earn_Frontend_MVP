'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeUp: React.FC<FadeUpProps> = ({ children, className = '', delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom+=150', // Triggers before it enters the viewport to prevent empty screens on mobile
          once: true, // Only trigger once, safer for performance and layout
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};