'use client';

import React from 'react';
import type { EditorButton } from '../content/content.types';

export function BlogEditorToolbar({
  buttons,
  isPreview,
  onTogglePreview,
}: {
  buttons: EditorButton[];
  isPreview: boolean;
  onTogglePreview: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        {buttons.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-3 py-2 text-xs font-bold text-white hover:border-sats-orange-500 hover:text-sats-orange-400"
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        ))}

        <button type="button" onClick={onTogglePreview} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-3 py-2 text-xs font-bold text-white hover:border-sats-orange-500 hover:text-sats-orange-400">
          {isPreview ? 'Back To Edit' : 'Preview'}
        </button>
      </div>

      <div className="text-[12px] text-gray-400">Use headings, bullet lists, quotes, links, and images for cleaner blogs.</div>
    </div>
  );
}
