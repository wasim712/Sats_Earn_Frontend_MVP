'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Announcement } from '@/features/admin/adminAnnouncementsSlice';
import { Trash2, Edit3, Info, AlertTriangle, CheckCircle2, Megaphone, Loader2 } from 'lucide-react';

interface AnnouncementCardProps {
    announcement: Announcement;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, currentStatus: boolean) => void;
    onEdit: (announcement: Announcement) => void;
}

export const AnnouncementCard = ({ announcement, onDelete, onToggleActive ,onEdit}: AnnouncementCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Dynamic styling based on Announcement Type
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'INFO': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Info className="w-4 h-4" /> };
      case 'WARNING': return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <AlertTriangle className="w-4 h-4" /> };
      case 'SUCCESS': return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'PROMOTION': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Megaphone className="w-4 h-4" /> };
      default: return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: <Info className="w-4 h-4" /> };
    }
  };

  const style = getTypeStyles(announcement.type);

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      setIsDeleting(true);
      onDelete(announcement.id);
    }
  };

  const handleToggleClick = async () => {
    setIsToggling(true);
    await onToggleActive(announcement.id, announcement.isActive);
    setIsToggling(false);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };


  return (
    <div className={`bg-sats-black-900 border ${announcement.isActive ? 'border-sats-black-700 shadow-[0_5px_15px_rgba(0,0,0,0.2)]' : 'border-sats-black-800 opacity-80'} rounded-3xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}>
      
      {/* Header: Type & Toggle Switch */}
      <div className="flex justify-between items-center mb-5">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${style.bg} ${style.border} ${style.color}`}>
          {style.icon}
          <span className="text-[10px] font-bold tracking-widest uppercase">{announcement.type}</span>
        </div>
        
        {/* Toggle Switch Container */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${announcement.isActive ? 'text-green-400' : 'text-gray-400'}`}>
            {isToggling ? (announcement.isActive ? 'Pausing...' : 'Going live...') : announcement.isActive ? 'Active' : 'Paused'}
          </span>
          <button 
            onClick={handleToggleClick}
            disabled={isToggling}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
              announcement.isActive ? 'bg-green-500/80 hover:bg-green-500' : 'bg-sats-black-700 hover:bg-gray-600'
            } ${isToggling ? 'opacity-60 pointer-events-none' : ''}`}
            title={announcement.isActive ? "Deactivate" : "Activate"}
          >
            {isToggling ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-4.5 h-4.5 text-white animate-spin" />
              </span>
            ) : null}
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
              announcement.isActive ? 'translate-x-6' : 'translate-x-1'
            } ${isToggling ? 'opacity-0' : 'opacity-100'}`} />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-grow mb-6">
        <h3 className="text-xl font-extrabold text-white mb-2 leading-tight tracking-tight group-hover:text-sats-orange-400 transition-colors">
          {announcement.title}
        </h3>
        <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
          {announcement.content}
        </p>
      </div>

      {/* Footer: Dates & Enhanced Actions */}
      <div className="pt-5 border-t border-sats-black-800 flex items-center justify-between mt-auto">
        
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Created: {formatDate(announcement.createdAt)}</span>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Updated: {formatDate(announcement.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Enhanced Edit Button */}
          <button 
            onClick={() => onEdit(announcement)} // <-- ADD THIS
            className=" cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-sats-black-950 border border-sats-black-800 text-gray-400 hover:text-sats-orange-400 hover:border-sats-orange-500/30 hover:bg-sats-orange-500/10 rounded-lg transition-all text-xs font-bold"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>

          {/* Enhanced Delete Button */}
          <button 
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title="Delete Announcement"
            className="flex cursor-pointer items-center justify-center p-2 bg-sats-black-950 border border-sats-black-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg transition-all disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
