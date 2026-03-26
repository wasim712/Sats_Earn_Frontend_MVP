'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const StaggerReveal: React.FC<StaggerRevealProps> = ({ 
  children, 
  className = '',
  delay = 0 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Select all immediate children inside this specific container
    const elements = containerRef.current.children;

    gsap.fromTo(
      elements,
      { 
        y: -15, // Start slightly above their final position
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1, // The magic number: reveals each child 0.1s after the previous one
        ease: 'power3.out',
        delay: delay,
      }
    );
  }, { scope: containerRef }); // Scoping prevents GSAP from accidentally animating other elements on the page

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};