'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import { requestSignupOtp, verifySignupOtp, goBackToStep1, resetAuthError } from '../authSlice';
import { User, Mail, Calendar, MapPin, Lock, AtSign, ArrowRight, Eye, EyeOff, CheckCircle2, Circle, Gift, Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { LogoText } from '@/components/ui/LogoText';

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const RuleItem = ({ met, text }: { met: boolean, text: string }) => (
  <div className={`flex items-center space-x-2 text-[11px] transition-colors duration-300 ${met ? 'text-green-400' : 'text-gray-500'}`}>
    {met ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
    <span>{text}</span>
  </div>
);

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, step, tempData, user } = useAppSelector((state) => state.auth);

  const getReferralFromUrl = () => {
  if (typeof window === "undefined") return "";

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref) {
    localStorage.setItem("referral", ref.toUpperCase());
    return ref.toUpperCase();
  }

  const saved = localStorage.getItem("referral");
  return saved || "";
};

const [formData, setFormData] = useState({
  fullName: '',
  username: '',
  email: '',
  password: '',
  country: '',
  dateOfBirth: '',
  referralCode: getReferralFromUrl() // ✅ here
});

  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom Searchable Dropdown State
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
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

  // Handle clicking outside the country dropdown to close it
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return; 

    // Convert DD/MM/YYYY back to YYYY-MM-DD for the Express backend
    let formattedDate = formData.dateOfBirth;
    if (formData.dateOfBirth.includes('/')) {
      const [day, month, year] = formData.dateOfBirth.split('/');
      formattedDate = `${year}-${month}-${day}`;
    }

    dispatch(requestSignupOtp({ ...formData, dateOfBirth: formattedDate }));
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempData?.email) {
      dispatch(verifySignupOtp({ email: tempData.email, otp }));
    }
  };

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    // Dynamic width: expands to 1100px on step 1, shrinks to 500px on step 2. Mobile blur disabled via sm:backdrop-blur-xl
    <div className={`w-full transition-all duration-500 ease-in-out ${step === 1 ? 'max-w-[1100px]' : 'max-w-[500px]'} bg-sats-black-950/90 sm:bg-sats-black-950/80 border border-sats-black-800 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative font-sans backdrop-blur-none sm:backdrop-blur-xl`}>
      
      <Link href="/" className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>
      <Link href="/">
      <div className="flex justify-center items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-black rounded-xl border border-sats-orange-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                      <Image width={120} height={120} className='rounded-2xl' alt='logo' src='/icon.png'></Image>
                    </div>
          <LogoText className="text-2xl font-bold tracking-tight text-white"/>
        </div>
      </div>
    </Link>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-1 text-white">{step === 1 ? 'Create your account' : 'Verify your email'}</h2>
        <p className="text-gray-400 text-sm">
          {step === 1 ? 'Start earning Bitcoin in minutes' : `We sent an OTP to ${tempData?.email}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          
          {/* THREE COLUMN GRID FOR DESKTOP */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* COLUMN 1: Identity */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-sats-orange-500/80 mb-2">1. Identity</h3>
              
              <div>
                <label className="block text-sm font-bold mb-1.5 text-gray-200">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 text-gray-200">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AtSign className="h-4 w-4 text-gray-500" />
                  </div>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" required className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 text-gray-200">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
                </div>
              </div>
            </div>

            {/* COLUMN 2: Demographics */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-sats-orange-500/80 mb-2">2. Demographics</h3>
              
             <div>
                <label className="block text-sm font-bold mb-1.5 text-gray-200">
                  Date of Birth <span className="text-[10px] text-gray-500 font-normal ml-1">(DD/MM/YYYY)</span>
                </label>
                <div className="relative flex items-center">
                  
                  {/* Left Decorative Icon */}
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>

                  {/* Text Input (For typing DD/MM/YYYY manually) */}
                  <input 
                    type="text" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, ''); 
                      if (val.length > 8) val = val.substring(0, 8);
                      if (val.length > 4) {
                        val = `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4, 8)}`;
                      } else if (val.length > 2) {
                        val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                      }
                      setFormData({ ...formData, dateOfBirth: val });
                    }}
                    placeholder="DD/MM/YYYY" 
                    required
                    maxLength={10}
                    className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600"
                  />

                  {/* Right Clickable Calendar Button (Triggers Native Picker) */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-sats-black-800 transition-colors flex items-center justify-center overflow-hidden">
                    {/* Invisible native date input layered on top */}
                    <input 
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        if (e.target.value) {
                          // Native picker always returns YYYY-MM-DD under the hood
                          const [year, month, day] = e.target.value.split('-');
                          setFormData({ ...formData, dateOfBirth: `${day}/${month}/${year}` });
                        }
                      }}
                    />
                    <Calendar className="h-4 w-4 text-sats-orange-500 pointer-events-none relative z-0" />
                  </div>

                </div>
              </div>

              {/* Custom Searchable Country Dropdown */}
              <div ref={countryRef} className="relative z-50">
                <label className="block text-sm font-bold mb-1.5 text-gray-200">Country</label>
                <div className="relative">
                  <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className={`w-full bg-sats-black-900 border ${isCountryOpen ? 'border-sats-orange-500 ring-1 ring-sats-orange-500' : 'border-sats-black-700'} rounded-xl py-3 pl-10 pr-10 text-left outline-none transition-all ${formData.country ? 'text-white' : 'text-gray-600'}`}>
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                    {formData.country || "Select country"}
                    <ChevronDown className={`absolute right-3.5 top-3.5 h-4 w-4 text-gray-500 transition-transform duration-200 ${isCountryOpen ? 'rotate-180 text-sats-orange-500' : ''}`} />
                  </button>
                  
                  {isCountryOpen && (
                    <div className="absolute w-full mt-2 bg-sats-black-900 border border-sats-black-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="p-2 border-b border-sats-black-800 flex items-center bg-black/40">
                        <Search className="w-4 h-4 text-gray-500 ml-2" />
                        <input type="text" placeholder="Search countries..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-transparent p-2 outline-none text-sm text-white" autoFocus />
                      </div>
                      <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredCountries.length > 0 ? filteredCountries.map(c => (
                          <div key={c} onClick={() => { setFormData({...formData, country: c}); setIsCountryOpen(false); setCountrySearch(''); }} className="px-4 py-2.5 hover:bg-sats-orange-500 hover:text-black cursor-pointer text-sm text-gray-300 transition-colors">
                            {c}
                          </div>
                        )) : (
                          <div className="p-4 text-center text-sm text-gray-500">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-0">
                <label className="block text-sm font-bold mb-1.5 text-gray-200">Referral Code <span className="text-gray-500 font-normal ml-1">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Gift className="h-4 w-4 text-gray-500" />
                  </div>
                  <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} placeholder="PROMO2026" className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600 uppercase" />
                </div>
              </div>
            </div>

            {/* COLUMN 3: Security */}
            <div className="space-y-5 flex flex-col h-full relative z-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-sats-orange-500/80 mb-2">3. Security</h3>
              
              <div>
                <label className="block text-sm font-bold mb-1.5 text-gray-200">Password</label>
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create strong password" required className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="bg-sats-black-900/50 rounded-xl p-4 grid grid-cols-1 gap-2 border border-sats-black-800">
                  <RuleItem met={rules.length} text="8+ characters" />
                  <div className="grid grid-cols-2 gap-2">
                    <RuleItem met={rules.upper} text="Uppercase" />
                    <RuleItem met={rules.lower} text="Lowercase" />
                    <RuleItem met={rules.number} text="Number" />
                    <RuleItem met={rules.special} text="Special" />
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <button type="submit" disabled={isLoading || !isPasswordValid} className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold text-base rounded-xl py-3.5 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(249,115,22,0.2)] active:scale-[0.98]">
                  {isLoading ? 'Processing...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>
        </form>
      ) : (
        /* STEP 2: OTP Verification */
        <form onSubmit={handleStep2Submit} className="space-y-8 mt-4 animate-in fade-in zoom-in-95 duration-300">
           <div className="flex flex-col items-center">
              <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="00000000" required maxLength={8} className="w-full text-center text-4xl sm:text-5xl font-bold tracking-[0.3em] sm:tracking-[0.4em] bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 rounded-xl py-6 sm:py-8 px-4 outline-none transition-all text-white placeholder-gray-800" />
              <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest font-bold">Verification Code</p>
            </div>
            
            <button type="submit" disabled={isLoading || otp.length < 8} className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold text-lg rounded-xl py-4 flex items-center justify-center transition-colors disabled:opacity-70 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              {isLoading ? 'Verifying...' : 'Verify & Enter'}
            </button>

            <div className="text-center">
               <button type="button" onClick={() => dispatch(goBackToStep1())} className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center justify-center mx-auto">
                 <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Use a different email
               </button>
            </div>
        </form>
      )}

      {step === 1 && (
        <p className="mt-8 text-center text-sm text-gray-400 border-t border-sats-black-800 pt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
            Log in here
          </Link>
        </p>
      )}
    </div>
  );
}