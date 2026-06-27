
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import VerifyOtp from './VerifyOtp';
import { LogoText } from '@/components/ui/LogoText';
import { 
  User, Mail, MapPin, Lock, AtSign, ArrowRight, Eye, EyeOff, 
  CheckCircle2, Circle, Gift, Search, ChevronDown, AlertTriangle, Loader2, XCircle 
} from 'lucide-react';
import Image from 'next/image';
import { requestSignupOtp , verifySignupOtp, goBackToStep1, resetAuthError} from '../authSlice';
import DatePickerInput from './DatePickerInput';
import { fetchCountries } from '@/features/admin/adminCountriesSlice';
import { validateEmailSecurity } from '@/lib/validators';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const RuleItem = ({ met, text }: { met: boolean, text: string }) => (
  <div className={`flex items-center space-x-2 text-[12px] transition-colors duration-300 ${met ? 'text-green-400' : 'text-gray-400'}`}>
    {met ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
    <span>{text}</span>
  </div>
);
export default function SignupForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, step, tempData, user } = useAppSelector((state) => state.auth);
  const { countries } = useAppSelector((state) => state.adminCountries);
  
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'loading' | 'available' | 'taken'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const validatedEmailRef = useRef<string>('');
  const getReferralFromUrl = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("referral", ref.toUpperCase());
      return ref.toUpperCase();
    }
    return localStorage.getItem("referral") || "";
  };

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    country: '',
    dateOfBirth: '',
    referralCode: getReferralFromUrl()
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true);
  const countryRef = useRef<HTMLDivElement>(null);

  const rules = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };
  const isPasswordValid = Object.values(rules).every(Boolean);

  useEffect(() => {
    if (user) router.push('/user/dashboard');
  }, [user, router]);

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [countries.length, dispatch]);

  // LIVE USERNAME CHECKER
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (formData.username.length < 3) {
        setUsernameStatus('idle');
        return;
      }
      setUsernameStatus('loading');
      try {
        const res = await fetch(`${API_URL}/users/check-username?username=${formData.username}`);
        if (res.ok) {
          const data = await res.json();
          setUsernameStatus(data.available ? 'available' : 'taken'); 
        } else {
          setUsernameStatus('idle');
        }
      } catch {
        setUsernameStatus('idle');
      }
    };

    const delayDebounceFn = setTimeout(() => { checkUsernameAvailability(); }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.username]);

  // ERROR INTERCEPTOR (For existing accounts)
  useEffect(() => {
    if (error && (error.toLowerCase().includes('already') || error.toLowerCase().includes('exist'))) {
      const syncErrorState = window.setTimeout(() => {
      if (error.toLowerCase().includes('username')) {
        setUsernameStatus('taken');
        setFormError("Username is already taken.");
      } else {
        setToast({ show: true, message: 'Account found. Redirecting...' });
        dispatch(resetAuthError());
        setTimeout(() => router.push('/login'), 3000);
      }
      }, 0);

      return () => window.clearTimeout(syncErrorState);
    }
  }, [error, dispatch, router]);

  useEffect(() => {
    dispatch(resetAuthError());
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'fullName') filteredValue = value.replace(/[^a-zA-Z\s]/g, ''); 
    else if (name === 'username') filteredValue = value.replace(/[^a-zA-Z0-9]/g, ''); 
    else if (name === 'referralCode') filteredValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(); 

    setFormData({ ...formData, [name]: filteredValue });
    setFormError(null); 

    if (name === 'email') {
      setEmailError(null);
      setIsValidated(false);
      setIsChecking(false);
    }
  };

const handleEmailBlur = async () => {
  const raw = formData.email.trim();
 
  // Don't fire for obviously incomplete addresses — saves API quota
  if (!raw || raw.length < 6 || !raw.includes('@')) {
    if (!raw) {
      setEmailError('Email address is required.');
      setIsValidated(false);
    }
    return;
  }
 
  // Already validated this exact value — no need to re-check
  if (isValidated && validatedEmailRef.current === raw.toLowerCase()) return;
 
  setIsChecking(true);
  setEmailError(null);
  setIsValidated(false);
 
  const result = await validateEmailSecurity(raw);
 
  setEmailError(result.error);
  setIsValidated(result.isValid);
  setIsChecking(false);
 
  if (result.isValid) {
    validatedEmailRef.current = raw.toLowerCase();
  }
};

  const validateForm = () => {
    if (formData.fullName.trim().length < 2) return "Full Name must be at least 2 characters.";
    if (formData.username.length < 3) return "Username must be at least 3 characters.";
    if (formData.username.length > 10) return "Username must be at less than 10 characters.";
    if (usernameStatus === 'taken') return "Please choose a different username.";
    if (!formData.email.trim()) return "Email address is required.";
    if (emailError) return emailError;
    if (!isValidated) return "Please verify your email before continuing.";
    
    if (formData.dateOfBirth.length === 10) {
      const [day, month, year] = formData.dateOfBirth.split('/');
      const dobDate = new Date(`${year}-${month}-${day}`);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
      
      if (age < 13) return "Minimum age required is 13 years.";
    } else {
      return "Please enter a valid Date of Birth (DD/MM/YYYY).";
    }

    if (!formData.country) return "Please select your Country.";
    if (formData.referralCode && formData.referralCode.length > 0 && formData.referralCode.length < 7) {
      return "Referral code must be 7 or 8 characters.";
    }

    return null; 
  };

const handleStep1Submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormError(null);
 
  const validationError = validateForm();
  if (validationError) {
    setFormError(validationError);
    return;
  }
 
  if (!isPasswordValid || usernameStatus === 'taken') return;
 
  const rawEmail = formData.email.trim();
  const cleanEmail = rawEmail.toLowerCase();
 
  // ── Email security check ───────────────────────────────────────────────────
  // Skip the async validator if the email was already validated on blur
  // and the value hasn't changed since. Otherwise run it now (covers the
  // edge-case where a user fills the form without triggering onBlur).
  if (!isValidated || validatedEmailRef.current !== cleanEmail) {
    setIsChecking(true);
    const emailCheck = await validateEmailSecurity(rawEmail);
    setIsChecking(false);
 
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error);
      setIsValidated(false);
      setFormError(emailCheck.error);
      return;
    }
 
    setEmailError(null);
    setIsValidated(true);
    validatedEmailRef.current = cleanEmail;
  }
 
  // ── Pre-flight: check if account already exists ───────────────────────────
  try {
    const res = await fetch(`${API_URL}/users/check-email?email=${encodeURIComponent(cleanEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.exists || !data.available) {
        setToast({ show: true, message: 'Account found. Redirecting...' });
        setTimeout(() => router.push('/login'), 3000);
        return;
      }
    }
  } catch {
    // Endpoint not ready — continue with signup; server will catch duplicates
  }
 
  // ── Dispatch OTP request ──────────────────────────────────────────────────
  const [day, month, year] = formData.dateOfBirth.split('/');
  const formattedDate = `${year}-${month}-${day}`;
 
  dispatch(requestSignupOtp({ ...formData, email: cleanEmail, dateOfBirth: formattedDate }));
};
  const handleOtpSubmit = (otp: string) => {
    if (!tempData?.email) return;

    void (async () => {
      try {
        await dispatch(verifySignupOtp({ email: tempData.email, otp })).unwrap();
        router.push('/user/dashboard');
      } catch {
      }
    })();
  };

  const filteredCountries = countries.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <>
      {/* SUCCESS TOAST POPUP (Green) */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
         <div className="bg-[#050505] border border-green-500/50 rounded-2xl p-4 flex items-center gap-4 shadow-[0_10px_40px_rgba(34,197,94,0.2)]">
             <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
             </div>
             <div>
                <h4 className="text-white font-bold text-sm">Account Already Exists!</h4>
                <p className="text-green-400 text-xs font-medium">{toast.message}</p>
             </div>
         </div>
      </div>

      <div className={`w-full transition-all duration-500 ease-in-out ${step === 1 ? 'max-w-[1100px]' : 'max-w-[500px]'} bg-black/90 sm:bg-black/80 border border-[#1a1a1a] rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(238,139,18,0.1)] relative font-sans backdrop-blur-none sm:backdrop-blur-xl`}>
        
        <Link href="/" className="absolute top-6 right-6 text-gray-400 hover:text-sats-orange-400 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Link>

        <Link href="/">
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-[#050505] rounded-xl border border-sats-orange-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(238,139,18,0.2)]">
                 <Image width={120} height={120} className='rounded-xl' alt='logo' src='/icon.png' />
              </div>
              <LogoText className="text-2xl font-bold tracking-tight text-white"/>
            </div>
          </div>
        </Link>

        {(formError || error) && step === 1 && !toast.show && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="w-4 h-4 inline mr-2 -mt-0.5" />
            {formError || error}
          </div>
        )}

        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-1 text-white">Create your account</h2>
              <p className="text-gray-400 text-sm">Start earning Bitcoin in minutes</p>
            </div>
            
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start">
                
                {/* COLUMN 1: Identity */}
                <div className="space-y-5 flex flex-col h-full">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">1. Identity</h3>
                  
                  <div className="lg:min-h-[92px] ">
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} maxLength={20} placeholder="Enter your full name" required className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-gray-200 flex justify-between">
                      <span>Username <span className="text-red-500">*</span></span>
                      {usernameStatus === 'taken' && <span className="text-xs text-red-400 font-medium">Taken</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <AtSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} maxLength={10} max={10} minLength={3} min={3} placeholder="Choose a username" required className={`w-full bg-sats-black-950 border ${usernameStatus === 'taken' ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-sats-orange-500'} focus:ring-1 rounded-xl py-3 pl-10 pr-10 outline-none transition-all text-white placeholder-gray-600`} />
                      
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        {usernameStatus === 'loading' && <Loader2 className="w-4 h-4 text-sats-orange-500 animate-spin" />}
                        {usernameStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {usernameStatus === 'taken' && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={() => { void handleEmailBlur(); }} placeholder="Enter your email" required className={`w-full bg-[#050505] border ${emailError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-sats-orange-500'} focus:ring-1 rounded-xl py-3 pl-10 pr-10 outline-none transition-all text-white placeholder-gray-600`} />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        {isChecking && <Loader2 className="w-4 h-4 text-sats-orange-500 animate-spin" />}
                        {!isChecking && isValidated && <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in-75 duration-200" />}
                      </div>
                    </div>
                    {emailError && (
                      <p className="animate-in fade-in slide-in-from-top-1 mt-2 flex items-start gap-2 text-xs text-red-400 duration-200">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{emailError}</span>
                      </p>
                    )}
                    {isChecking && !emailError && (
                      <p className="mt-2 text-xs text-sats-orange-400">Checking email security...</p>
                    )}
                  </div>
                </div>
                {/* ddddddddddd */}
                {/* COLUMN 2: Demographics */} 
                <div className="space-y-5 flex flex-col h-full">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">2. Demographics</h3>
                  
                  <div className="lg:min-h-[92px]">
                      <label className="block text-sm font-bold mb-1.5 text-gray-200">
                        Date of Birth <span className="text-red-500">*</span>
                        <span className="text-[10px] text-gray-400 font-normal ml-1">(DD/MM/YYYY)</span>
                      </label>
                      <DatePickerInput
                        value={formData.dateOfBirth}
                        onChange={(val) => {
                          setFormData({ ...formData, dateOfBirth: val });
                          setFormError(null);
                        }}
                        minAge={13}
                        required
                      />
                    </div>

                  <div ref={countryRef} className="relative z-50">
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Country <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className={`w-full bg-sats-black-950 border ${isCountryOpen ? 'border-sats-orange-500 ring-1 ring-sats-orange-500' : 'border-[#1a1a1a]'} rounded-xl py-3 pl-10 pr-10 text-left outline-none transition-all ${formData.country ? 'text-white' : 'text-gray-600'}`}>
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                        {formData.country || "Select country"}
                        <ChevronDown className={`absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 transition-transform duration-200 ${isCountryOpen ? 'rotate-180 text-sats-orange-500' : ''}`} />
                      </button>
                      {isCountryOpen && (
                        <div className="absolute w-full mt-2 bg-sats-black-950 border border-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                          <div className="p-2 border-b border-[#1a1a1a] flex items-center bg-black/40">
                            <Search className="w-4 h-4 text-gray-400 ml-2" />
                            <input type="text" placeholder="Search countries..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-transparent p-2 outline-none text-sm text-white" autoFocus />
                          </div>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {filteredCountries.length > 0 ? filteredCountries.map(c => (
                              <div key={c} onClick={() => { setFormData({...formData, country: c}); setIsCountryOpen(false); setCountrySearch(''); setFormError(null); }} className="px-4 py-2.5 hover:bg-sats-orange-500 hover:text-black cursor-pointer text-sm text-gray-300 transition-colors">
                                {c}
                              </div>
                            )) : (
                              <div className="p-4 text-center text-sm text-gray-400">No countries found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative z-0">
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Referral Code <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Gift className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} maxLength={8} placeholder="PROMO2026" className="w-full bg-sats-black-950 border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600 uppercase" />
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: Security */}
                <div className="space-y-5 flex flex-col h-full relative z-0">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">3. Security</h3>
                  
                  <div className="lg:min-h-[92px]">
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Password <span className="text-red-500">*</span></label>
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} maxLength={20} minLength={8} min={8} placeholder="Create strong password" required className="w-full bg-sats-black-950 border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="bg-sats-black-950 rounded-xl p-4 grid grid-cols-1 gap-2 border border-[#1a1a1a]">
                      <RuleItem met={rules.length} text="8-20 characters" />
                      <div className="grid grid-cols-2 gap-2">
                        <RuleItem met={rules.upper} text="Uppercase" />
                        <RuleItem met={rules.lower} text="Lowercase" />
                        <RuleItem met={rules.number} text="Number" />
                        <RuleItem met={rules.special} text="Special" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => setHasAcceptedTerms((prev) => !prev)}
                      className="mb-3 flex w-full items-start gap-3 text-left"
                    >
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${hasAcceptedTerms ? 'border-sats-orange-400 bg-sats-orange-500 text-black shadow-[0_0_16px_rgba(238,139,18,0.35)]' : 'border-[#3a3a3a] bg-[#0d0d0d] text-transparent'}`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[12px] leading-relaxed text-gray-400">
                        By creating an account, you accept our <span className="font-bold text-sats-orange-400 drop-shadow-[0_0_10px_rgba(238,139,18,0.2)]">Terms &amp; Conditions</span>.
                      </span>
                    </button>

                    <button type="submit" disabled={isLoading || !isPasswordValid || usernameStatus === 'taken' || isChecking || !isValidated || !hasAcceptedTerms} className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-base rounded-xl py-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(238,139,18,0.2)] active:scale-[0.98]">
                      {isLoading ? 'Processing...' : 'Create Account'}
                      {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </button>
                  </div>
                </div>

              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400 border-t border-[#1a1a1a] pt-6">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
                Log in here
              </Link>
            </p>
          </>
        ) : (
          <VerifyOtp 
            email={tempData?.email || ''} 
            isLoading={isLoading} 
            error={error} 
            onSubmit={handleOtpSubmit} 
            onBack={() => dispatch(goBackToStep1())} 
          />
        )}
      </div>
    </>
  );
}
