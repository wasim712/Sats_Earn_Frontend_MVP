'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-sats-orange-500 text-black hover:bg-sats-orange-400',
  isLoading = false,
}: ConfirmModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-[28px] w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#1a1a1a] bg-[#111]">
          <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="p-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] rounded-full text-gray-400 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 sm:p-6 border-t border-[#1a1a1a] bg-[#111]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-gray-300 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] ${confirmButtonClass}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
