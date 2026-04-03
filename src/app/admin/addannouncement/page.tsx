'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createAnnouncement } from '@/features/admin/adminAnnouncementsSlice';
import { ArrowLeft, Megaphone, Save, Loader2, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ANNOUNCEMENT_TYPES = [
  { value: 'INFO', label: 'Information (Blue)', icon: <Info className="w-4 h-4 text-blue-400" /> },
  { value: 'PROMOTION', label: 'Promotion (Purple)', icon: <Megaphone className="w-4 h-4 text-purple-400" /> },
  { value: 'SUCCESS', label: 'Success (Green)', icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> },
  { value: 'WARNING', label: 'Warning (Orange)', icon: <AlertTriangle className="w-4 h-4 text-yellow-400" /> }
];

export default function AddAnnouncementPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'INFO'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await dispatch(createAnnouncement(formData));
    
    if (createAnnouncement.fulfilled.match(result)) {
      router.push('/admin/announcements'); // Redirect back to grid on success
    } else {
      alert(result.payload || "Failed to create announcement.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {/* "Modal" Glass Container */}
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
        
        <form onSubmit={handleSubmit} className="bg-sats-black-900/90 border border-sats-black-800 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sats-black-800 bg-sats-black-950/50">
            <button 
              type="button"
              onClick={() => router.push('/admin/announcements')} 
              className="flex items-center text-gray-400 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>
            
            <div className="flex items-center gap-2 text-white font-bold">
              <Megaphone className="w-5 h-5 text-sats-orange-500" />
              New Broadcast
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Announcement Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 10,000 Sats Giveaway!" 
                className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors" 
              />
            </div>

            {/* Type Selector */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Message Type *</label>
              <div className="relative">
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-10 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors appearance-none cursor-pointer"
                >
                  {ANNOUNCEMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {/* Dynamically render the icon of the selected type */}
                <div className="absolute left-3.5 top-3.5 pointer-events-none">
                  {ANNOUNCEMENT_TYPES.find(t => t.value === formData.type)?.icon}
                </div>
                <div className="absolute right-4 top-3.5 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Message Content *</label>
              <textarea 
                name="content" 
                value={formData.content} 
                onChange={handleChange} 
                required 
                placeholder="Write your announcement details here..." 
                className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors min-h-[150px] resize-y" 
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-sats-black-800 bg-sats-black-950/30 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex items-center justify-center w-full sm:w-auto bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
              Publish Now
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}