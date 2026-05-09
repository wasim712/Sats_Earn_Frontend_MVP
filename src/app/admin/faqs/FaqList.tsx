'use client';

import React from 'react';
import { CircleHelp, Trash2 } from 'lucide-react';
import type { FaqItem } from '../content/content.types';

export function FaqList({
  items,
  isLoading,
  onDelete,
}: {
  items: FaqItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6">
      <div className="flex items-center gap-2 mb-4">
        <CircleHelp className="w-5 h-5 text-sats-orange-500" />
        <h2 className="text-xl font-black text-white">Existing FAQs</h2>
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
                  <p className="text-xs text-gray-500 mt-1">{item.category || 'General'} • Order {item.sortOrder}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${item.isActive ? 'bg-green-500/10 text-green-300' : 'bg-gray-500/10 text-gray-300'}`}>
                  {item.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-3 whitespace-pre-wrap">{item.answer}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{new Date(item.createdAt).toLocaleString()}</span>
                <button onClick={() => onDelete(item.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
