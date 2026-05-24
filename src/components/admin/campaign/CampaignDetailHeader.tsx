'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Edit3, Loader2, Save, Trash2, X } from 'lucide-react';

export function CampaignSuccessToast({ show, message }: { show: boolean; message: string }) {
  return (
    <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-sats-black-900 border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.15)] transition-all duration-500 ${show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      </div>
      <div>
        <p className="font-bold text-sm text-white">Success</p>
        <p className="text-xs opacity-80">{message}</p>
      </div>
    </div>
  );
}

export function CampaignCoverHero({ coverImageUrl, title }: { coverImageUrl?: string | null; title: string }) {
  if (!coverImageUrl) return null;

  return (
    <div className="relative h-56 md:h-72 overflow-hidden rounded-3xl border border-[#1a1a1a]">
      <Image src={coverImageUrl} alt={title} fill className="object-cover" sizes="100vw" unoptimized />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-black/35 to-transparent" />
    </div>
  );
}

export function CampaignStickyHeader({
  isEditing,
  isDeleting,
  isSaving,
  isUploadingCover,
  onBack,
  onDelete,
  onEdit,
  onCancel,
  onSave,
}: {
  isEditing: boolean;
  isDeleting: boolean;
  isSaving: boolean;
  isUploadingCover: boolean;
  onBack: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xl mt-4">
      <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white bg-sats-black-900 border border-[#1a1a1a] hover:bg-[#111] px-5 py-2.5 rounded-xl transition-all font-bold w-full sm:w-auto justify-center shadow-sm">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
        {!isEditing ? (
          <>
            <button onClick={onDelete} disabled={isDeleting} className="flex items-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
            </button>
            <button onClick={onEdit} className="flex items-center bg-[#111] border border-[#2a2a2a] hover:bg-white/5 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm font-bold">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Campaign
            </button>
          </>
        ) : (
          <>
            <button onClick={onCancel} className="flex items-center text-gray-400 hover:text-white px-4 py-2.5 transition-colors font-bold">
              <X className="w-5 h-5 mr-1.5" /> Cancel
            </button>
            <button onClick={onSave} disabled={isSaving} className="flex items-center bg-green-500 hover:bg-green-400 text-black font-black px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-95">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {isUploadingCover ? 'Uploading Cover...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
