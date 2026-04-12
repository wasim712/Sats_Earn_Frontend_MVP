'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { AlertTriangle, ArrowRight, Mail } from 'lucide-react';

interface VerifyOtpProps {
  email: string;
  isLoading: boolean;
  error: string | null;
  onSubmit: (otp: string) => void;
  onBack: () => void;
}

export default function VerifyOtp({ email, isLoading, error, onSubmit, onBack }: VerifyOtpProps) {
  const [otp, setOtp] = useState<string[]>(new Array(8).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow alphanumeric characters
    if (/[^a-zA-Z0-9]/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1).toUpperCase();
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 8).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 7);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 8) {
      onSubmit(otpString);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mt-2 animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center">
      
      {/* 1. Header & Instructions (Improved Hierarchy) */}
      <div className="flex flex-col items-center text-center w-full max-w-md">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-[0_0_20px_rgba(238,139,18,0.15)]">
           <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-sats-orange-500" />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Check your email</h3>
        
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
          We have sent an 8-digit verification code to
        </p>
        
        {/* Email Callout Badge */}
        <div className="bg-[#050505] border border-[#1a1a1a] px-3 sm:px-4 py-2 rounded-lg mb-6 sm:mb-8 max-w-full overflow-hidden text-ellipsis">
          <span className="text-white font-bold tracking-wide text-sm sm:text-base">{email}</span>
        </div>
      </div>
      
      {/* 2. OTP Input Blocks (With Cognitive Break & Strict Mobile Math) */}
      <div className="w-full">
        {/* Tightened gap on mobile to gap-1 (4px) so 8 boxes fit without overflowing */}
        <div className="flex gap-1 sm:gap-2.5 justify-center w-full items-center">
          {otp.map((digit, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                // Reduced mobile width to w-8 (32px) and height to h-12 to ensure perfect fit
                className={`w-8 h-12 sm:w-12 sm:h-16 text-center text-lg sm:text-2xl font-black bg-[#050505] rounded-lg sm:rounded-xl outline-none transition-all duration-300 shrink-0
                  ${digit 
                    ? 'border-2 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                    : 'border border-[#1a1a1a] text-gray-400 focus:border-2 focus:border-sats-orange-500 hover:border-[#2a2a2a]'}
                `}
              />
              
              {/* Visual Splitter between 4th and 5th digit for better readability */}
              {index === 3 && (
                <div className="w-2 sm:w-4 h-[2px] bg-[#1a1a1a] rounded-full mx-0.5 sm:mx-1 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. Error State */}
      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/50 text-red-400 p-3.5 rounded-xl text-sm text-center font-medium animate-in slide-in-from-top-2 shadow-lg">
          <AlertTriangle className="w-4 h-4 inline mr-2 -mt-0.5" />
          {error}
        </div>
      )}

      {/* 4. Actions */}
      <div className="w-full space-y-4 sm:space-y-5 pt-2">
        <button type="submit" disabled={isLoading || otp.join('').length < 8} className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-sm sm:text-lg rounded-xl py-3.5 sm:py-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(238,139,18,0.2)] active:scale-[0.98]">
          {isLoading ? 'Verifying...' : 'Verify & Enter Dashboard'}
        </button>

        <button type="button" onClick={onBack} className="w-full text-xs sm:text-sm font-bold text-gray-500 hover:text-white transition-colors flex items-center justify-center group py-2">
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 rotate-180 transition-transform group-hover:-translate-x-1" /> 
          Use a different email address
        </button>
      </div>

    </form>
  );
}