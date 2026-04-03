'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createCampaign } from '@/features/admin/adminCampaignsSlice';
import { ArrowLeft, Save, Loader2, Globe, Search, ChevronDown, CheckSquare, Square } from 'lucide-react';

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const CATEGORIES = ["SOCIAL", "SURVEY", "VIDEO_AD", "APP_INSTALL", "OFFERWALL", "LEARN_EARN", "DAILY_STREAK"];
const TIERS = ["BASIC", "BRONZE", "SILVER", "GOLD"];

export default function AddCampaignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOCIAL',
    targetUrl: '',
    socialHandleTarget: '',
    rewardSats: 0,
    maxCompletions: 0,
    requiredTier: 'BASIC',
    targetCountries: [] as string[]
  });

  // Country Dropdown State
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value, 10) }));
  };

  // Country Selection Logic
  const handleCountryToggle = (country: string) => {
    setFormData(prev => {
      const isSelected = prev.targetCountries.includes(country);
      if (isSelected) {
        return { ...prev, targetCountries: prev.targetCountries.filter(c => c !== country) };
      } else {
        return { ...prev, targetCountries: [...prev.targetCountries, country] };
      }
    });
  };

  const handleSelectAllCountries = () => {
    if (formData.targetCountries.length === ALL_COUNTRIES.length) {
      setFormData(prev => ({ ...prev, targetCountries: [] })); // Deselect all
    } else {
      setFormData(prev => ({ ...prev, targetCountries: [...ALL_COUNTRIES] })); // Select all
    }
  };

  const filteredCountries = ALL_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));
  const allSelected = formData.targetCountries.length === ALL_COUNTRIES.length && ALL_COUNTRIES.length > 0;

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.targetCountries.length === 0) {
      alert("Please select at least one target country (or Select All).");
      return;
    }

    setIsSaving(true);
    
    // Clean data (ensure numbers are actually numbers)
    const payload = {
      ...formData,
      rewardSats: Number(formData.rewardSats) || 0,
      maxCompletions: Number(formData.maxCompletions) || 0
    };

    const result = await dispatch(createCampaign(payload));
    
    if (createCampaign.fulfilled.match(result)) {
      router.push('/admin/campaigns'); // Redirect to campaigns list on success
    } else {
      alert(result.payload || "Failed to create campaign.");
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-5xl mx-auto mt-4 sm:mt-10 mb-20">
      
      <form onSubmit={handleSubmit} className="bg-sats-black-900/80 border border-sats-black-800 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 border-b border-sats-black-800 bg-sats-black-950/50">
          <button 
            type="button"
            onClick={() => router.push('/admin/campaigns')} 
            className="flex items-center text-gray-300 hover:text-white bg-sats-black-800 hover:bg-sats-black-700 px-4 py-2 rounded-xl transition-colors font-medium w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Cancel
          </button>
          
          <h1 className="text-xl font-bold text-white">Create New Campaign</h1>
          
          <button 
            type="submit" 
            disabled={isSaving} 
            className="flex items-center justify-center w-full sm:w-auto bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
            Publish Campaign
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-10 space-y-10">
          
          {/* SECTION 1: Basics */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 border-b border-sats-black-800 pb-2">1. Basic Details</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Campaign Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Follow SatsEarn on Twitter" className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Explain what the user needs to do..." className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors min-h-[100px]" />
              </div>
            </div>
          </div>

          {/* SECTION 2: Links & Targeting */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 border-b border-sats-black-800 pb-2">2. Links & Targeting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors appearance-none">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Required Tier *</label>
                <select name="requiredTier" value={formData.requiredTier} onChange={handleChange} required className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors appearance-none">
                  {TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Target URL (Optional)</label>
                <input type="url" name="targetUrl" value={formData.targetUrl} onChange={handleChange} placeholder="https://twitter.com/..." className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Social Handle Target (Optional)</label>
                <input type="text" name="socialHandleTarget" value={formData.socialHandleTarget} onChange={handleChange} placeholder="@satsearn" className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors" />
              </div>

              {/* Multi-Select Country Dropdown */}
              <div className="md:col-span-2 relative" ref={countryRef}>
                <label className="block text-sm font-bold mb-2 text-gray-300">Target Countries *</label>
                <button 
                  type="button" 
                  onClick={() => setIsCountryOpen(!isCountryOpen)} 
                  className={`w-full bg-sats-black-950 border ${isCountryOpen ? 'border-sats-orange-500' : 'border-sats-black-700'} text-left px-4 py-3 rounded-xl outline-none transition-colors flex items-center justify-between`}
                >
                  <span className="truncate text-white">
                    {formData.targetCountries.length === 0 ? "Select Countries..." : 
                     formData.targetCountries.length === ALL_COUNTRIES.length ? "Worldwide (All Countries)" : 
                     `${formData.targetCountries.length} Countries Selected`}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCountryOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-sats-black-900 border border-sats-black-700 rounded-xl shadow-2xl overflow-hidden">
                    
                    {/* Search & Select All Header */}
                    <div className="p-3 border-b border-sats-black-800 bg-sats-black-950 flex flex-col gap-3">
                      <div className="flex items-center bg-black/40 rounded-lg px-3 py-2 border border-sats-black-800">
                        <Search className="w-4 h-4 text-gray-500 mr-2" />
                        <input type="text" placeholder="Search countries..." value={countrySearch} onChange={e => setCountrySearch(e.target.value)} className="w-full bg-transparent outline-none text-sm text-white" />
                      </div>
                      
                      <button 
                        type="button" 
                        onClick={handleSelectAllCountries}
                        className="flex items-center text-sm font-bold text-sats-orange-400 hover:text-sats-orange-300 transition-colors w-max"
                      >
                        {allSelected ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                        {allSelected ? "Deselect All" : "Select All (Worldwide)"}
                      </button>
                    </div>

                    {/* Country List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                      {filteredCountries.map(country => {
                        const isSelected = formData.targetCountries.includes(country);
                        return (
                          <div 
                            key={country} 
                            onClick={() => handleCountryToggle(country)} 
                            className="flex items-center px-3 py-2.5 hover:bg-sats-black-800 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center mr-3 border ${isSelected ? 'bg-sats-orange-500 border-sats-orange-500' : 'border-gray-600'}`}>
                              {isSelected && <CheckSquare className="w-4 h-4 text-black" />}
                            </div>
                            <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-400'}`}>{country}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Economics */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 border-b border-sats-black-800 pb-2">3. Economics & Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Reward (Sats) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sats-orange-500 font-extrabold">~</span>
                  <input 
                    type="number" 
                    name="rewardSats" 
                    value={formData.rewardSats === 0 ? '' : formData.rewardSats} 
                    onChange={handleNumberChange} 
                    required 
                    placeholder="0"
                    min="1"
                    className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 pl-10 rounded-xl outline-none focus:border-sats-orange-500 transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Max Completions *</label>
                <input 
                  type="number" 
                  name="maxCompletions" 
                  value={formData.maxCompletions === 0 ? '' : formData.maxCompletions} 
                  onChange={handleNumberChange} 
                  required 
                  placeholder="0"
                  min="1"
                  className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors" 
                />
                <p className="text-xs text-gray-500 mt-2">Total budget: ~ {((Number(formData.rewardSats) || 0) * (Number(formData.maxCompletions) || 0)).toLocaleString()} Sats</p>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}