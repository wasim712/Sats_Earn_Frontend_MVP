
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { requestPasswordReset, resetPassword } from '@/features/auth/authSlice';
import { LogoText } from '@/components/ui/LogoText'; // Adjust import path if necessary
import { 
  Mail, Lock, KeyRound, ArrowLeft, Loader2, 
  CheckCircle2, AlertTriangle, Eye, EyeOff 
} from 'lucide-react';

export default function ForgetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Step 1: 'request' | Step 2: 'reset' | Step 3: 'success'
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI Toggles
  const [showPassword, setShowPassword] = useState(false);

  // --- PASSWORD VALIDATION LOGIC ---
  const passwordRules = {
    length: newPassword.length >= 8 && newPassword.length <= 64,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  // --- HANDLERS ---
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim() || email.length > 100) return setErrorMsg('Please enter a valid email address.');

    setIsLoading(true);
    const result = await dispatch(requestPasswordReset(email.trim().toLowerCase()));
    setIsLoading(false);

    if (requestPasswordReset.fulfilled.match(result)) {
      setStep('reset');
    } else {
      setErrorMsg(result.payload as string || 'Failed to send reset code.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Front-end Guards
    if (otp.length !== 6) return setErrorMsg('Reset code must be exactly 6 characters.');
    if (!isPasswordValid) return setErrorMsg('Password does not meet all security requirements.');
    if (newPassword !== confirmPassword) return setErrorMsg('Passwords do not match.');

    setIsLoading(true);
    const result = await dispatch(resetPassword({ 
      email: email.trim().toLowerCase(), 
      token: otp.trim(), 
      newPassword 
    }));
    setIsLoading(false);

    if (resetPassword.fulfilled.match(result)) {
      setStep('success');
    } else {
      setErrorMsg(result.payload as string || 'Failed to reset password. Please check your code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      {/* Premium Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center mb-8 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#050505] rounded-xl border border-sats-orange-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Image width={120} height={120} className='rounded-xl object-cover' alt='logo' src='/icon.png' />
            </div>
            <LogoText className="text-3xl font-extrabold tracking-tight text-white" />
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl py-10 px-6 shadow-2xl border border-[#1a1a1a] sm:rounded-3xl sm:px-10 overflow-hidden">
          
          {/* STEP 1: REQUEST CODE */}
          {step === 'request' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-white tracking-tight">Forgot Password?</h2>
                <p className="mt-2 text-sm text-gray-400 font-medium">Enter your email address and we'll send you a 6-digit recovery code.</p>
              </div>

              {errorMsg && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-semibold flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> 
                  <span className="leading-snug">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-sats-orange-500 transition-colors" />
                    <input
                      id="email"
                      type="email"
                      required
                      maxLength={100}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                      placeholder="earner@example.com"
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading || !email} className={btnClasses}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Recovery Code'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: VERIFY CODE & RESET PASSWORD */}
          {step === 'reset' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-white tracking-tight">Secure Your Account</h2>
                <p className="mt-2 text-sm text-gray-400 font-medium">If an account exists for <span className="text-sats-orange-500 font-bold">{email}</span> , a 6-digit code has been sent.</p>
              </div>

              {errorMsg && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-semibold flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> 
                  <span className="leading-snug">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 text-center">Recovery Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      minLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.toUpperCase())}
                      className="block w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-xl py-3.5 px-4 focus:ring-1 focus:ring-sats-orange-500 focus:border-sats-orange-500 transition-colors placeholder:text-gray-700 outline-none tracking-[0.5em] text-center font-bold text-lg"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-sats-orange-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      maxLength={64}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClasses}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Checklist */}
                  <div className="mt-4 bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 grid grid-cols-2 gap-y-2 gap-x-2">
                    <ValidationRule isValid={passwordRules.length} text="8+ Characters" />
                    <ValidationRule isValid={passwordRules.uppercase} text="1 Uppercase" />
                    <ValidationRule isValid={passwordRules.lowercase} text="1 Lowercase" />
                    <ValidationRule isValid={passwordRules.number} text="1 Number" />
                    <ValidationRule isValid={passwordRules.special} text="1 Special Char" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-sats-orange-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      maxLength={64}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClasses}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading || otp.length !== 6 || !isPasswordValid || newPassword !== confirmPassword} className={`${btnClasses} mt-6`}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-6">
              <div className="w-20 h-20 mx-auto bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Password Updated!</h2>
              <p className="text-gray-400 font-medium text-sm mb-8 leading-relaxed">Your account is now secure. You can log in with your new password to continue earning.</p>
              <Link href="/login" className={btnClasses}>
                Return to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── UTILITY COMPONENTS & STYLES ───

const inputClasses = "block w-full bg-[#111] border border-[#2a2a2a] text-white rounded-xl py-3.5 pl-12 pr-12 focus:ring-1 focus:ring-sats-orange-500 focus:border-sats-orange-500 transition-colors sm:text-sm placeholder:text-gray-600 outline-none font-medium";

const btnClasses = "flex w-full items-center justify-center gap-2 rounded-xl bg-sats-orange-500 px-4 py-4 text-sm font-black text-black hover:bg-sats-orange-400 transition-all shadow-[0_0_20px_rgba(238,139,18,0.25)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

function ValidationRule({ isValid, text }: { isValid: boolean, text: string }) {
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isValid ? 'text-green-500' : 'text-gray-600'}`}>
      <CheckCircle2 className={`w-3.5 h-3.5 ${isValid ? 'opacity-100' : 'opacity-30'}`} />
      {text}
    </div>
  );
}