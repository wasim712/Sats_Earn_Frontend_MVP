'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import { requestSignupOtp, verifySignupOtp, goBackToStep1, resetAuthError } from '../authSlice';
import { User, Mail, Calendar, MapPin, Lock, AtSign, ArrowRight, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// FIXED: Moved RuleItem outside of the main component!
const RuleItem = ({ met, text }: { met: boolean, text: string }) => (
  <div className={`flex items-center space-x-2 text-xs transition-colors duration-300 ${met ? 'text-green-400' : 'text-gray-500'}`}>
    {met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
    <span>{text}</span>
  </div>
);

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { isLoading, error, step, tempData, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '', 
    username: '',
    email: '',
    password: '',
    country: '',
    dateOfBirth: '',
    referralCode: ''
  });
  
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic Password Validation Checks
  const rules = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };
  
  const isPasswordValid = Object.values(rules).every(Boolean);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return; 
    dispatch(requestSignupOtp(formData));
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempData?.email) {
      dispatch(verifySignupOtp({ email: tempData.email, otp }));
    }
  };

  return (
    <div className="w-full max-w-137.5 bg-sats-black-950/80 border border-sats-black-800 rounded-3xl p-8  shadow-[0_0_50px_rgba(249,115,22,0.1)] relative font-sans backdrop-blur-xl">
      
      <Link href="/" className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <div className="flex justify-center items-center mb-6 mt-2">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-black rounded-xl border border-sats-orange-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(249,115,22,0.2)]">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F97316"/>
             </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">SatsEarn</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-1 text-white">{step === 1 ? 'Create your account' : 'Verify your email'}</h2>
        <p className="text-gray-400 text-sm">
          {step === 1 ? 'Start earning Bitcoin in minutes' : `We sent an OTP to ${tempData?.email}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-200">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name" 
                  required
                  className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-200">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <AtSign className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username" 
                  required
                  className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 text-gray-200">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
                required
                className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-200">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  style={{ colorScheme: "dark" }}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-200">Country</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-10 appearance-none outline-none transition-all text-white"
                >
                  <option value="" disabled>Select your country</option>
                  {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 text-gray-200">Password</label>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password" 
                required
                className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Security Checklist */}
            <div className="bg-sats-black-900/50 rounded-lg p-3 grid grid-cols-2 gap-2 border border-sats-black-800">
              <RuleItem met={rules.length} text="8+ characters" />
              <RuleItem met={rules.upper} text="Uppercase letter" />
              <RuleItem met={rules.lower} text="Lowercase letter" />
              <RuleItem met={rules.number} text="Number" />
              <RuleItem met={rules.special} text="Special character" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !isPasswordValid}
            className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold text-base rounded-xl py-3.5 mt-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            {isLoading ? 'Processing...' : 'Create Account'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </button>
        </form>
      ) : (
        /* STEP 2: OTP Verification */
        <form onSubmit={handleStep2Submit} className="space-y-6 mt-4">
           <div>
              <input 
                type="text" 
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="00000000" 
                required
                maxLength={8}
                className="w-full text-center text-4xl font-bold tracking-[0.5em] bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-6 px-4 outline-none transition-all text-white placeholder-gray-700"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || otp.length < 8}
              className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold text-base rounded-xl py-3.5 flex items-center justify-center transition-colors disabled:opacity-70 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            >
              {isLoading ? 'Verifying...' : 'Verify & Enter'}
            </button>

            <div className="text-center mt-6">
               <button 
                 type="button" 
                 onClick={() => dispatch(goBackToStep1())}
                 className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
               >
                 &larr; Use a different email
               </button>
            </div>
        </form>
      )}

      {step === 1 && (
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
            Log in here
          </Link>
        </p>
      )}
    </div>
  );
}