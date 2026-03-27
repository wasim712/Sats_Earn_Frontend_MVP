// 'use client';

// import React, { useEffect, useState } from 'react';

// export const InteractiveBackground = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isHovering, setIsHovering] = useState(false);

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
//     const handleMouseEnter = () => setIsHovering(true);
//     const handleMouseLeave = () => setIsHovering(false);

//     window.addEventListener('mousemove', handleMouseMove);
//     document.body.addEventListener('mouseenter', handleMouseEnter);
//     document.body.addEventListener('mouseleave', handleMouseLeave);

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       document.body.removeEventListener('mouseenter', handleMouseEnter);
//       document.body.removeEventListener('mouseleave', handleMouseLeave);
//     };
//   }, []);

//   return (
//     <div 
//       className="pointer-events-none fixed inset-0 z-0 "
//       style={{
//         maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
//         WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
//       }}
//     >
//       <div className="absolute inset-0 bg-grid-base" />
//       <div
//         className="absolute inset-0 bg-grid-highlight transition-opacity duration-500 ease-out"
//         style={{
//           opacity: isHovering ? 1 : 0, 
//           maskImage: `radial-gradient(150px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
//           WebkitMaskImage: `radial-gradient(150px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`
//         }}
//       />
//     </div>
//   );
// };
'use client';

import React, { useEffect, useRef } from 'react';

export const InteractiveBackground = () => {
  // We use refs to directly manipulate the DOM for zero-latency performance
  const highlightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // requestAnimationFrame ensures we only update visual state right before the browser paints the screen
      animationFrameId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;

        if (highlightRef.current) {
          const mask = `radial-gradient(300px circle at ${clientX}px ${clientY}px, black 0%, transparent 100%)`;
          highlightRef.current.style.maskImage = mask;
          // Bypass TypeScript's warning by using the raw CSS property name directly:
          highlightRef.current.style.setProperty('-webkit-mask-image', mask);
        }

        // 2. Move the giant ambient glow orb to follow the cursor
        // We subtract 300px to perfectly center the 600x600px orb on the mouse tip
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        // Global vignette: Fades the entire background out beautifully toward the bottom of the page
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}
    >
      {/* LAYER 1: The Base Grid (Always visible, very faint) */}
      <div className="absolute inset-0 bg-grid-base opacity-30" />
      
      {/* LAYER 2: The Premium Ambient Glow Orb (Follows cursor, deeply blurred) */}
      <div
        ref={glowRef}
        // will-change-transform forces the browser to use the GPU for this element, ensuring zero lag
        className="absolute left-0 top-0 h-100 w-100 rounded-full bg-sats-orange-500/10 blur-[120px] will-change-transform"
      />

      {/* LAYER 3: The Sharp Highlight Grid (Revealed only by the cursor mask) */}
      <div
        ref={highlightRef}
        className="absolute inset-0 bg-grid-highlight opacity-70"
        style={{
          // Initial state before mouse moves
          maskImage: `radial-gradient(0px circle at 0px 0px, black 0%, transparent 100%)`, 
          WebkitMaskImage: `radial-gradient(0px circle at 0px 0px, black 0%, transparent 100%)`
        }}
      />
    </div>
  );
};