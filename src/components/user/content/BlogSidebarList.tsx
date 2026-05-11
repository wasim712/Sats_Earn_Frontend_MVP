'use client';

import React from 'react';
import { ArrowRight, BookOpen, CalendarDays, Clock3 } from 'lucide-react';
import { formatContentDate, getReadTime } from './userContent.helpers';
import type { UserBlogPost } from './userContent.types';

export function BlogSidebarList({
  blogs,
  selectedId,
  onSelect,
}: {
  blogs: UserBlogPost[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {blogs.map((blog) => {
        const isActive = blog.id === selectedId;

        return (
          <button
            key={blog.id}
            type="button"
            onClick={() => onSelect(blog.id)}
            className={`group w-full rounded-3xl border p-4 text-left transition-all ${isActive ? 'border-sats-orange-500/30 bg-sats-orange-500/10 shadow-[0_18px_40px_rgba(249,115,22,0.14)]' : 'border-[#161616] bg-[#050505] hover:border-sats-orange-500/20 hover:bg-[#080808]'}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <BookOpen className="h-3.5 w-3.5" />
                  Blog
                </div>
                <h3 className="mt-3 text-base font-black leading-snug text-white line-clamp-2">
                  {blog.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                  {blog.excerpt || 'No excerpt available.'}
                </p>
              </div>

              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${isActive ? 'border-sats-orange-500/35 bg-sats-orange-500/15 text-sats-orange-300' : 'border-white/10 bg-white/[0.03] text-gray-500'}`}>
                Read
                <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isActive ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-sats-orange-400" />
                {formatContentDate(blog.publishedAt || blog.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-sats-orange-400" />
                {getReadTime(blog.content)} min read
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
