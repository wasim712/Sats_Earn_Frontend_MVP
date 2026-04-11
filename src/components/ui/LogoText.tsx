import React from 'react';

interface LogoTextProps {
  className?: string; // Allows overriding sizes/margins from the parent
//   showBeta?: boolean; // Easily toggle the Beta badge on or off
}

export const LogoText = ({ className = ''}: LogoTextProps) => {
  return (
    // select-none prevents users from accidentally highlighting the logo text
    <div className={`flex items-center gap-1 sm:gap-1 select-none ${className}`}>
      
      {/* The Main Text */}
      <div className=" tracking-tight flex items-baseline font-extrabold">
        <span className="text-white">Sats</span>
        <span className="text-sats-orange-500">Earn</span>
      </div>

      {/* The Beta Badge - Pushed slightly up to match the image */}
     
        <span className="bg-sats-orange-500 text-black text-[12px] sm:text-[11px]  px-2.5 py-0.5 rounded-full leading-none self-start mt-1">
          Beta
        </span>

      
    </div>
  );
};