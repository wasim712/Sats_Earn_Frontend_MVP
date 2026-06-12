import React from 'react';

interface AboutMarqueeProps {
  words: string[];
  reverse?: boolean;
}

export const AboutMarquee: React.FC<AboutMarqueeProps> = ({ words, reverse = false }) => {
  // Create a long string to ensure the track loops seamlessly
  const repeatCount = 12;
  const trackContent = Array(repeatCount)
    .fill(words)
    .flat()
    .map((word, i) => (
      <React.Fragment key={i}>
        <span className="font-black text-sm sm:text-base tracking-[0.15em] text-sats-orange-500 uppercase mx-3 sm:mx-4">
          {word}
        </span>
        <span className="text-sats-orange-500 opacity-50 font-black">·</span>
      </React.Fragment>
    ));

  return (
    <div className="relative z-10 overflow-hidden bg-sats-orange-500/10 border-y border-sats-orange-500/20 py-3.5 whitespace-nowrap">
      <div 
        className="inline-block whitespace-nowrap"
        style={{ 
          animation: `scroll-left ${reverse ? '34s' : '28s'} linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal'
        }}
      >
        {trackContent}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};
