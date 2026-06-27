'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateAnnouncement, Announcement } from '@/features/admin/adminAnnouncementsSlice';
import { X, Save, Loader2, Info, AlertTriangle, CheckCircle2, Megaphone, Edit3 } from 'lucide-react';

const ANNOUNCEMENT_TYPES = [
  { value: 'INFO', label: 'Information (Blue)', icon: <Info className="w-4 h-4 text-blue-400" /> },
  { value: 'PROMOTION', label: 'Promotion (Purple)', icon: <Megaphone className="w-4 h-4 text-purple-400" /> },
  { value: 'SUCCESS', label: 'Success (Green)', icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> },
  { value: 'WARNING', label: 'Warning (Orange)', icon: <AlertTriangle className="w-4 h-4 text-yellow-400" /> }
];

interface EditModalProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditAnnouncementModal = ({ announcement, isOpen, onClose }: EditModalProps) => {
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Tracks if changes were made
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    content: announcement?.content || '',
    type: announcement?.type || 'INFO'
  });
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     type: 'INFO'
//   });

//   // Populate form when modal opens with a specific announcement
//   useEffect(() => {
//     if (announcement && isOpen) {
//       setFormData({
//         title: announcement.title,
//         content: announcement.content,
//         type: announcement.type
//       });
//       setIsDirty(false); // Reset dirty state on fresh open
//     }
//   }, [announcement, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !announcement) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true); // Mark as modified
  };

  const handleSafeClose = () => {
    if (isDirty) {
      const confirmExit = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirmExit) return;
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Only send the fields that we allow to be edited
    const result = await dispatch(updateAnnouncement({ 
      id: announcement.id, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { title: formData.title, content: formData.content, type: formData.type as any } 
    }));
    
    if (updateAnnouncement.fulfilled.match(result)) {
      setIsDirty(false);
      onClose(); // Close modal on success
    } else {
      alert("Failed to update announcement.");
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleSafeClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-sats-black-950 border border-sats-black-700 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sats-black-800 bg-sats-black-900/50">
          <div className="flex items-center gap-3 text-white font-bold text-lg">
            <div className="p-2 bg-sats-orange-500/10 text-sats-orange-500 rounded-lg border border-sats-orange-500/20">
              <Edit3 className="w-5 h-5" />
            </div>
            Edit Announcement
          </div>
          <button 
            onClick={handleSafeClose} 
            className="p-2 text-gray-400 hover:text-white hover:bg-sats-black-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Announcement Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full bg-sats-black-900 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors" 
              />
            </div>

            {/* Type Selector */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Message Type</label>
              <div className="relative">
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-sats-black-900 border border-sats-black-700 text-white px-10 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors appearance-none cursor-pointer"
                >
                  {ANNOUNCEMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
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
              <label className="block text-sm font-bold mb-2 text-gray-300">Message Content</label>
              <textarea 
                name="content" 
                value={formData.content} 
                onChange={handleChange} 
                required 
                className="w-full bg-sats-black-900 border border-sats-black-700 text-white px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-colors min-h-37.5 resize-y" 
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-sats-black-800 bg-sats-black-900/50 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={handleSafeClose}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving || !isDirty} // Disable if no changes were made!
              className="flex items-center justify-center bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold px-8 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
              {isDirty ? "Save Changes" : "Saved"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}