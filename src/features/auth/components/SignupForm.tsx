// 'use client';

// import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
// import { requestSignupOtp, verifySignupOtp, goBackToStep1, resetAuthError } from '../authSlice';
// import { User, Mail, Calendar, MapPin, Lock, AtSign, ArrowRight, Eye, EyeOff, CheckCircle2, Circle, Gift, Search, ChevronDown, AlertTriangle } from 'lucide-react';
// import Image from 'next/image';
// import { LogoText } from '@/components/ui/LogoText';

// const ALL_COUNTRIES = [
//   "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
// ];

// const RuleItem = ({ met, text }: { met: boolean, text: string }) => (
//   <div className={`flex items-center space-x-2 text-[11px] transition-colors duration-300 ${met ? 'text-green-400' : 'text-gray-500'}`}>
//     {met ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
//     <span>{text}</span>
//   </div>
// );

// // Calculate date exactly 13 years ago to restrict the native date picker
// const getThirteenYearsAgoDate = () => {
//   const d = new Date();
//   d.setFullYear(d.getFullYear() - 13);
//   return d.toISOString().split("T")[0];
// };

// // ==========================================
// // COMPONENT 1: VERIFY OTP COMPONENT
// // ==========================================
// interface VerifyOtpProps {
//   email: string;
//   isLoading: boolean;
//   error: string | null;
//   onSubmit: (otp: string) => void;
//   onBack: () => void;
// }

// const VerifyOtp: React.FC<VerifyOtpProps> = ({ email, isLoading, error, onSubmit, onBack }) => {
//   const [otp, setOtp] = useState<string[]>(new Array(8).fill(''));
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleChange = (index: number, value: string) => {
//     // Only allow alphanumeric characters
//     if (/[^a-zA-Z0-9]/.test(value)) return;
    
//     const newOtp = [...otp];
//     newOtp[index] = value.substring(value.length - 1).toUpperCase();
//     setOtp(newOtp);

//     // Auto-advance to next input
//     if (value && index < 7) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text/plain').slice(0, 8).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
//     if (pastedData) {
//       const newOtp = [...otp];
//       pastedData.split('').forEach((char, i) => {
//         newOtp[i] = char;
//       });
//       setOtp(newOtp);
//       // Focus on the next empty box or the last box
//       const nextIndex = Math.min(pastedData.length, 7);
//       inputRefs.current[nextIndex]?.focus();
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const otpString = otp.join('');
//     if (otpString.length === 8) {
//       onSubmit(otpString);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8 mt-4 animate-in fade-in zoom-in-95 duration-300">
//       <div className="flex flex-col items-center">
//         <h3 className="text-xl font-bold text-white mb-2">Verify your email</h3>
//         <p className="text-gray-400 text-sm mb-8 text-center">Enter the 8-digit OTP sent to <br/><span className="text-white font-semibold">{email}</span></p>
        
//         <div className="flex gap-2 sm:gap-3 justify-center w-full">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               ref={(el) => { inputRefs.current[index] = el; }}
//               type="text"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               onPaste={handlePaste}
//               className={`w-9 h-12 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black bg-sats-black-900 rounded-xl outline-none transition-all duration-300
//                 ${digit 
//                   ? 'border-2 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
//                   : 'border border-sats-black-700 text-gray-400 focus:border-2 focus:border-sats-orange-500'}
//               `}
//             />
//           ))}
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center font-medium animate-in slide-in-from-top-2">
//           <AlertTriangle className="w-4 h-4 inline mr-2 -mt-0.5" />
//           {error}
//         </div>
//       )}

//       <button type="submit" disabled={isLoading || otp.join('').length < 8} className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-lg rounded-xl py-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(238,139,18,0.2)] active:scale-[0.98]">
//         {isLoading ? 'Verifying...' : 'Verify & Enter'}
//       </button>

//       <div className="text-center mt-6">
//         <button type="button" onClick={onBack} className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center justify-center mx-auto group">
//           <ArrowRight className="w-4 h-4 mr-2 rotate-180 transition-transform group-hover:-translate-x-1" /> Use a different email
//         </button>
//       </div>
//     </form>
//   );
// };


// // ==========================================
// // COMPONENT 2: MAIN SIGNUP FORM
// // ==========================================
// export default function SignupForm() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const { isLoading, error, step, tempData, user } = useAppSelector((state) => state.auth);
  
//   // Custom Frontend Error State to protect the backend
//   const [formError, setFormError] = useState<string | null>(null);

//   const getReferralFromUrl = () => {
//     if (typeof window === "undefined") return "";
//     const params = new URLSearchParams(window.location.search);
//     const ref = params.get("ref");
//     if (ref) {
//       localStorage.setItem("referral", ref.toUpperCase());
//       return ref.toUpperCase();
//     }
//     const saved = localStorage.getItem("referral");
//     return saved || "";
//   };

//   const [formData, setFormData] = useState({
//     fullName: '',
//     username: '',
//     email: '',
//     password: '',
//     country: '',
//     dateOfBirth: '',
//     referralCode: getReferralFromUrl()
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [isCountryOpen, setIsCountryOpen] = useState(false);
//   const [countrySearch, setCountrySearch] = useState('');
//   const countryRef = useRef<HTMLDivElement>(null);

//   const rules = {
//     length: formData.password.length >= 8,
//     upper: /[A-Z]/.test(formData.password),
//     lower: /[a-z]/.test(formData.password),
//     number: /[0-9]/.test(formData.password),
//     special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
//   };
//   const isPasswordValid = Object.values(rules).every(Boolean);

//   useEffect(() => {
//     if (user) router.push('/user/dashboard');
//   }, [user, router]);

//   useEffect(() => {
//     dispatch(resetAuthError());
//     const handleClickOutside = (event: MouseEvent) => {
//       if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
//         setIsCountryOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dispatch]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     let filteredValue = value;

//     // Apply strict filtering constraints
//     if (name === 'fullName') {
//       filteredValue = value.replace(/[^a-zA-Z\s]/g, ''); // Alphabets and spaces only
//     } else if (name === 'username') {
//       filteredValue = value.replace(/[^a-zA-Z0-9]/g, ''); // Alphanumeric only
//     } else if (name === 'referralCode') {
//       filteredValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(); // Alphanumeric uppercase
//     }

//     setFormData({ ...formData, [name]: filteredValue });
//     setFormError(null); // Clear errors when user types
//   };

//   // --- FRONTEND VALIDATION LOGIC ---
//   const validateForm = () => {
//     if (formData.fullName.trim().length < 2) return "Full Name must be at least 2 characters.";
//     if (formData.username.length < 3) return "Username must be at least 3 characters.";
    
//     // Strict Age Validation
//     if (formData.dateOfBirth.length === 10) {
//       const [day, month, year] = formData.dateOfBirth.split('/');
//       const dobDate = new Date(`${year}-${month}-${day}`);
//       const today = new Date();
//       let age = today.getFullYear() - dobDate.getFullYear();
//       const m = today.getMonth() - dobDate.getMonth();
//       if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
//         age--;
//       }
//       if (age < 13) return "Minimum age required is 13 years.";
//     } else {
//       return "Please enter a valid Date of Birth (DD/MM/YYYY).";
//     }

//     if (!formData.country) return "Please select your Country.";
//     if (formData.referralCode && formData.referralCode.length > 0 && formData.referralCode.length < 7) {
//       return "Referral code must be 7 or 8 characters.";
//     }

//     return null; // Passes all checks
//   };

//   const handleStep1Submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormError(null);

//     const validationError = validateForm();
//     if (validationError) {
//       setFormError(validationError);
//       return;
//     }
//     if (!isPasswordValid) return; 

//     // Convert DD/MM/YYYY back to YYYY-MM-DD for the backend
//     const [day, month, year] = formData.dateOfBirth.split('/');
//     const formattedDate = `${year}-${month}-${day}`;

//     dispatch(requestSignupOtp({ ...formData, dateOfBirth: formattedDate }));
//   };

//   const handleOtpSubmit = (otp: string) => {
//     if (tempData?.email) {
//       dispatch(verifySignupOtp({ email: tempData.email, otp }));
//     }
//   };

//   const filteredCountries = ALL_COUNTRIES.filter(c => 
//     c.toLowerCase().includes(countrySearch.toLowerCase())
//   );

//   return (
//     <div className={`w-full transition-all duration-500 ease-in-out ${step === 1 ? 'max-w-[1100px]' : 'max-w-[500px]'} bg-black/90 sm:bg-black/80 border border-[#1a1a1a] rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(238,139,18,0.1)] relative font-sans backdrop-blur-none sm:backdrop-blur-xl`}>
      
//       <Link href="/" className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <line x1="18" y1="6" x2="6" y2="18"></line>
//           <line x1="6" y1="6" x2="18" y2="18"></line>
//         </svg>
//       </Link>

//       <Link href="/">
//         <div className="flex justify-center items-center mb-6">
//           <div className="flex items-center space-x-2">
//             <div className="w-12 h-12 bg-[#050505] rounded-xl border border-sats-orange-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(238,139,18,0.2)]">
//                <Image width={120} height={120} className='rounded-xl' alt='logo' src='/icon.png' />
//             </div>
//             <LogoText className="text-2xl font-bold tracking-tight text-white"/>
//           </div>
//         </div>
//       </Link>

//       {/* COMBINED ERROR DISPLAY (Prioritizes Frontend Errors, falls back to Redux API errors) */}
//       {(formError || error) && step === 1 && (
//         <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
//           <AlertTriangle className="w-4 h-4 inline mr-2 -mt-0.5" />
//           {formError || error}
//         </div>
//       )}

//       {step === 1 ? (
//         <>
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold mb-1 text-white">Create your account</h2>
//             <p className="text-gray-400 text-sm">Start earning Bitcoin in minutes</p>
//           </div>
          
//           <form onSubmit={handleStep1Submit} className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
//               {/* COLUMN 1: Identity */}
//               <div className="space-y-5">
//                 <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">1. Identity</h3>
                
//                 <div>
//                   <label className="block text-sm font-bold mb-1.5 text-gray-200">Full Name <span className="text-red-500">*</span></label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                       <User className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} maxLength={20} placeholder="Enter your full name" required className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold mb-1.5 text-gray-200">Username <span className="text-red-500">*</span></label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                       <AtSign className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input type="text" name="username" value={formData.username} onChange={handleChange} maxLength={20} placeholder="Choose a username" required className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold mb-1.5 text-gray-200">Email Address <span className="text-red-500">*</span></label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                       <Mail className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
//                   </div>
//                 </div>
//               </div>

//               {/* COLUMN 2: Demographics */}
//               <div className="space-y-5">
//                 <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">2. Demographics</h3>
                
//                 <div>
//                   <label className="block text-sm font-bold mb-1.5 text-gray-200">
//                     Date of Birth <span className="text-red-500">*</span> <span className="text-[10px] text-gray-500 font-normal ml-1">(DD/MM/YYYY)</span>
//                   </label>
//                   <div className="relative flex items-center">
//                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                       <Calendar className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input 
//                       type="text" 
//                       name="dateOfBirth"
//                       value={formData.dateOfBirth}
//                       onChange={(e) => {
//                         let val = e.target.value.replace(/\D/g, ''); 
//                         if (val.length > 8) val = val.substring(0, 8);
//                         if (val.length > 4) {
//                           val = `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4, 8)}`;
//                         } else if (val.length > 2) {
//                           val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
//                         }
//                         setFormData({ ...formData, dateOfBirth: val });
//                         setFormError(null);
//                       }}
//                       placeholder="DD/MM/YYYY" 
//                       required
//                       maxLength={10}
//                       className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600"
//                     />
//                     <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center justify-center overflow-hidden">
//                       <input 
//                         type="date"
//                         max={getThirteenYearsAgoDate()}
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                         onChange={(e) => {
//                           if (e.target.value) {
//                             const [year, month, day] = e.target.value.split('-');
//                             setFormData({ ...formData, dateOfBirth: `${day}/${month}/${year}` });
//                             setFormError(null);
//                           }
//                         }}
//                       />
//                       <Calendar className="h-4 w-4 text-sats-orange-500 pointer-events-none relative z-0" />
//                     </div>
//                   </div>
//                 </div>

//                 <div ref={countryRef} className="relative z-50">
//                   <label className="block text-sm font-bold mb-1.5 text-gray-200">Country <span className="text-red-500">*</span></label>
//                   <div className="relative">
//                     <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className={`w-full bg-[#050505] border ${isCountryOpen ? 'border-sats-orange-500 ring-1 ring-sats-orange-500' : 'border-[#1a1a1a]'} rounded-xl py-3 pl-10 pr-10 text-left outline-none transition-all ${formData.country ? 'text-white' : 'text-gray-600'}`}>
//                       <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
//                       {formData.country || "Select country"}
//                       <ChevronDown className={`absolute right-3.5 top-3.5 h-4 w-4 text-gray-500 transition-transform duration-200 ${isCountryOpen ? 'rotate-180 text-sats-orange-500' : ''}`} />
//                     </button>
//                     {isCountryOpen && (
//                       <div className="absolute w-full mt-2 bg-[#050505] border border-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
//                         <div className="p-2 border-b border-[#1a1a1a] flex items-center bg-black/40">
//                           <Search className="w-4 h-4 text-gray-500 ml-2" />
//                           <input type="text" placeholder="Search countries..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-transparent p-2 outline-none text-sm text-white" autoFocus />
//                         </div>
//                         <div className="max-h-48 overflow-y-auto custom-scrollbar">
//                           {filteredCountries.length > 0 ? filteredCountries.map(c => (
//                             <div key={c} onClick={() => { setFormData({...formData, country: c}); setIsCountryOpen(false); setCountrySearch(''); setFormError(null); }} className="px-4 py-2.5 hover:bg-sats-orange-500 hover:text-black cursor-pointer text-sm text-gray-300 transition-colors">
//                               {c}
//                             </div>
//                           )) : (
//                             <div className="p-4 text-center text-sm text-gray-500">No countries found</div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="relative z-0">
//                   <label className="block text-sm font-bold mb-1.5 text-gray-200">Referral Code <span className="text-gray-500 font-normal ml-1">(Optional)</span></label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                       <Gift className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} maxLength={8} placeholder="PROMO2026" className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600 uppercase" />
//                   </div>
//                 </div>
//               </div>

//               {/* COLUMN 3: Security */}
//               <div className="space-y-5 flex flex-col h-full relative z-0">
//                 <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">3. Security</h3>
                
//                 <div>
//                   <label className="block text-sm font-bold mb-1.5 text-gray-200">Password <span className="text-red-500">*</span></label>
//                   <div className="relative mb-3">
//                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                       <Lock className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} maxLength={20} placeholder="Create strong password" required className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600" />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer">
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </button>
//                   </div>

//                   <div className="bg-[#050505] rounded-xl p-4 grid grid-cols-1 gap-2 border border-[#1a1a1a]">
//                     <RuleItem met={rules.length} text="8-20 characters" />
//                     <div className="grid grid-cols-2 gap-2">
//                       <RuleItem met={rules.upper} text="Uppercase" />
//                       <RuleItem met={rules.lower} text="Lowercase" />
//                       <RuleItem met={rules.number} text="Number" />
//                       <RuleItem met={rules.special} text="Special" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="mt-auto pt-4">
//                   <button type="submit" disabled={isLoading || !isPasswordValid} className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-base rounded-xl py-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(238,139,18,0.2)] active:scale-[0.98]">
//                     {isLoading ? 'Processing...' : 'Create Account'}
//                     {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>

//             </div>
//           </form>

//           <p className="mt-8 text-center text-sm text-gray-400 border-t border-[#1a1a1a] pt-6">
//             Already have an account?{' '}
//             <Link href="/login" className="font-bold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
//               Log in here
//             </Link>
//           </p>
//         </>
//       ) : (
//         /* STEP 2: OTP Verification Component */
//         <VerifyOtp 
//           email={tempData?.email || ''} 
//           isLoading={isLoading} 
//           error={error} 
//           onSubmit={handleOtpSubmit} 
//           onBack={() => dispatch(goBackToStep1())} 
//         />
//       )}
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import VerifyOtp from './VerifyOtp';
import { LogoText } from '@/components/ui/LogoText';
import { 
  User, Mail, Calendar, MapPin, Lock, AtSign, ArrowRight, Eye, EyeOff, 
  CheckCircle2, Circle, Gift, Search, ChevronDown, AlertTriangle, Loader2, XCircle 
} from 'lucide-react';
import Image from 'next/image';
import { requestSignupOtp , verifySignupOtp, goBackToStep1, resetAuthError} from '../authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "India", "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Mexico", "Netherlands", "New Zealand", "Norway", "Philippines", "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Vietnam"
];

const RuleItem = ({ met, text }: { met: boolean, text: string }) => (
  <div className={`flex items-center space-x-2 text-[11px] transition-colors duration-300 ${met ? 'text-green-400' : 'text-gray-500'}`}>
    {met ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
    <span>{text}</span>
  </div>
);

const getThirteenYearsAgoDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 13);
  return d.toISOString().split("T")[0];
};

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, step, tempData, user } = useAppSelector((state) => state.auth);
  
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'loading' | 'available' | 'taken'>('idle');

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
      } catch (err) {
        setUsernameStatus('idle');
      }
    };

    const delayDebounceFn = setTimeout(() => { checkUsernameAvailability(); }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.username]);

  // ERROR INTERCEPTOR (For existing accounts)
  useEffect(() => {
    if (error && (error.toLowerCase().includes('already') || error.toLowerCase().includes('exist'))) {
      if (error.toLowerCase().includes('username')) {
        setUsernameStatus('taken');
        setFormError("Username is already taken.");
      } else {
        setToast({ show: true, message: 'Account found. Redirecting...' });
        dispatch(resetAuthError());
        setTimeout(() => router.push('/login'), 3000);
      }
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
  };

  const validateForm = () => {
    if (formData.fullName.trim().length < 2) return "Full Name must be at least 2 characters.";
    if (formData.username.length < 3) return "Username must be at least 3 characters.";
    if (usernameStatus === 'taken') return "Please choose a different username.";
    
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

    // PRE-FLIGHT EMAIL CHECK
    try {
      const res = await fetch(`${API_URL}/users/check-email?email=${formData.email}`);
      if (res.ok) {
        const data = await res.json();
        if (data.exists || !data.available) {
           setToast({ show: true, message: 'Account found. Redirecting...' });
           setTimeout(() => router.push('/login'), 3000);
           return; 
        }
      }
    } catch (e) {
      // Catch if endpoint isn't ready
    }

    const [day, month, year] = formData.dateOfBirth.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    dispatch(requestSignupOtp({ ...formData, dateOfBirth: formattedDate }));
  };

  const handleOtpSubmit = (otp: string) => {
    if (tempData?.email) {
      dispatch(verifySignupOtp({ email: tempData.email, otp }));
    }
  };

  const filteredCountries = ALL_COUNTRIES.filter(c => 
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
        
        <Link href="/" className="absolute top-6 right-6 text-gray-500 hover:text-sats-orange-400 transition-colors">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* COLUMN 1: Identity */}
                <div className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">1. Identity</h3>
                  
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-500" />
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
                        <AtSign className="h-4 w-4 text-gray-500" />
                      </div>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} maxLength={20} placeholder="Choose a username" required className={`w-full bg-[#050505] border ${usernameStatus === 'taken' ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-sats-orange-500'} focus:ring-1 rounded-xl py-3 pl-10 pr-10 outline-none transition-all text-white placeholder-gray-600`} />
                      
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
                        <Mail className="h-4 w-4 text-gray-500" />
                      </div>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600" />
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Demographics */}
                <div className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">2. Demographics</h3>
                  
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">
                      Date of Birth <span className="text-red-500">*</span> <span className="text-[10px] text-gray-500 font-normal ml-1">(DD/MM/YYYY)</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
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
                          setFormError(null);
                        }}
                        placeholder="DD/MM/YYYY" 
                        required
                        maxLength={10}
                        className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center justify-center overflow-hidden">
                        <input 
                          type="date"
                          max={getThirteenYearsAgoDate()}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            if (e.target.value) {
                              const [year, month, day] = e.target.value.split('-');
                              setFormData({ ...formData, dateOfBirth: `${day}/${month}/${year}` });
                              setFormError(null);
                            }
                          }}
                        />
                        <Calendar className="h-4 w-4 text-sats-orange-500 pointer-events-none relative z-0" />
                      </div>
                    </div>
                  </div>

                  <div ref={countryRef} className="relative z-50">
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Country <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className={`w-full bg-[#050505] border ${isCountryOpen ? 'border-sats-orange-500 ring-1 ring-sats-orange-500' : 'border-[#1a1a1a]'} rounded-xl py-3 pl-10 pr-10 text-left outline-none transition-all ${formData.country ? 'text-white' : 'text-gray-600'}`}>
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                        {formData.country || "Select country"}
                        <ChevronDown className={`absolute right-3.5 top-3.5 h-4 w-4 text-gray-500 transition-transform duration-200 ${isCountryOpen ? 'rotate-180 text-sats-orange-500' : ''}`} />
                      </button>
                      {isCountryOpen && (
                        <div className="absolute w-full mt-2 bg-[#050505] border border-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                          <div className="p-2 border-b border-[#1a1a1a] flex items-center bg-black/40">
                            <Search className="w-4 h-4 text-gray-500 ml-2" />
                            <input type="text" placeholder="Search countries..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-transparent p-2 outline-none text-sm text-white" autoFocus />
                          </div>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {filteredCountries.length > 0 ? filteredCountries.map(c => (
                              <div key={c} onClick={() => { setFormData({...formData, country: c}); setIsCountryOpen(false); setCountrySearch(''); setFormError(null); }} className="px-4 py-2.5 hover:bg-sats-orange-500 hover:text-black cursor-pointer text-sm text-gray-300 transition-colors">
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
                      <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} maxLength={8} placeholder="PROMO2026" className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600 uppercase" />
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: Security */}
                <div className="space-y-5 flex flex-col h-full relative z-0">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80 mb-2">3. Security</h3>
                  
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-gray-200">Password <span className="text-red-500">*</span></label>
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-500" />
                      </div>
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} maxLength={20} placeholder="Create strong password" required className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="bg-[#050505] rounded-xl p-4 grid grid-cols-1 gap-2 border border-[#1a1a1a]">
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
                    <button type="submit" disabled={isLoading || !isPasswordValid || usernameStatus === 'taken'} className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-base rounded-xl py-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(238,139,18,0.2)] active:scale-[0.98]">
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