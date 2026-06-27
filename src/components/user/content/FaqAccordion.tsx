'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';
import type { UserFaqItem } from './userContent.types';

export function FaqAccordion({ items }: { items: UserFaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, UserFaqItem[]>>((acc, item) => {
      const key = item.category || 'General';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <section key={category} className="rounded-[28px] border border-[#161616] bg-[#050505] p-5 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[12px] font-black uppercase tracking-[0.24em] text-sats-orange-400">
            <CircleHelp className="h-4 w-4" />
            {category}
          </div>

          <div className="space-y-3">
            {categoryItems.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div key={item.id} className={`overflow-hidden rounded-2xl border transition-all ${isOpen ? 'border-sats-orange-500/25 bg-sats-orange-500/8' : 'border-white/8 bg-white/[0.02]'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold leading-6 text-white md:text-base">{item.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-sats-orange-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/8 px-5 py-4 text-sm leading-7 text-gray-300 whitespace-pre-wrap">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
