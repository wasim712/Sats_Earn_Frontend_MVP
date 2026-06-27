'use client';

import React from 'react';
import { CircleHelp, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import type { FaqItem } from '../content/content.types';

export function FaqList({
  items,
  isLoading,
  onDelete,
  onToggleStatus,
}: {
  items: FaqItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onToggleStatus: (item: FaqItem) => void;
}) {
  return (
    <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6">
      <div className="mb-4 flex items-center gap-2">
        <CircleHelp className="h-5 w-5 text-sats-orange-500" />
        <div>
          <h2 className="text-xl font-black text-white">Existing FAQs</h2>
          <p className="mt-1 text-xs text-gray-400">Lower order numbers appear first in the user help section.</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading FAQs...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-400">No FAQ items yet.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-white">{item.question}</h3>
                  <p className="mt-1 text-xs text-gray-400">{item.category || 'General'} • Order {item.sortOrder}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${item.isActive ? 'bg-green-500/10 text-green-300' : 'bg-gray-500/10 text-gray-300'}`}>
                  {item.isActive ? 'Active' : 'Paused'}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-xs text-gray-400">{item.answer}</p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[12px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStatus(item)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${item.isActive ? 'border border-yellow-500/20 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20' : 'border border-green-500/20 bg-green-500/10 text-green-300 hover:bg-green-500/20'}`}
                  >
                    {item.isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                    {item.isActive ? 'Pause' : 'Activate'}
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
