'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, ArrowLeft, BookOpen, Search, Sparkles } from 'lucide-react';
import { BlogSidebarList } from '@/components/user/content/BlogSidebarList';
import {
  USER_API_URL,
  getContentErrorMessage,
  getStoredUserToken,
  stripHtml,
} from '@/components/user/content/userContent.helpers';
import type { UserBlogPost, UserContentLoadState } from '@/components/user/content/userContent.types';

export default function UserBlogsPage() {
  const [blogs, setBlogs] = useState<UserBlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [state, setState] = useState<UserContentLoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadBlogs = async () => {
    try {
      setState('loading');
      setError(null);

      const token = getStoredUserToken();
      const response = await fetch(`${USER_API_URL}/users/blogs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to load blog posts.');
      }

      const safeData = Array.isArray(data) ? data : [];
      setBlogs(safeData);
      setSelectedId((current) => current ?? safeData[0]?.id ?? null);
      setState('success');
    } catch (err) {
      setBlogs([]);
      setSelectedId(null);
      setError(getContentErrorMessage(err, 'Unable to load blogs right now.'));
      setState('error');
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return blogs;

    return blogs.filter((blog) => {
      const haystack = [blog.title, blog.excerpt || '', stripHtml(blog.content), blog.slug].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [blogs, query]);

  const selectedBlog = useMemo(() => {
    if (!filteredBlogs.length) return null;
    return filteredBlogs.find((blog) => blog.id === selectedId) || filteredBlogs[0];
  }, [filteredBlogs, selectedId]);

  return (
    <div className="space-y-6 px-4 py-5 md:space-y-8 md:px-6 md:py-6 xl:px-8">
      <section className="relative overflow-hidden rounded-[28px] border border-sats-orange-500/12 bg-[#050505]/95 px-5 py-5 md:px-7 md:py-6 shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_20%)]" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className='flex gap-3'>
              <div>
              <Link
                href="/user/help"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold text-gray-300 transition hover:border-sats-orange-500/25 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
                Back to Help
              </Link>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                <Sparkles className="h-3.5 w-3.5" />
                Blog Hub
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">Platform blogs</h1>
              <p className="max-w-2xl text-sm leading-7 text-gray-400 md:text-[15px]">
                Explore updates, earning strategies, and useful reads in a more relaxed and readable layout.
              </p>
            </div>
          </div>

          <div className="w-full sm:max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/70" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search blogs, topics, or guides..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/50 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-sats-orange-500/40"
              />
            </div>
          </div>
        </div>
      </section>

      {state === 'error' && error ? (
        <div className="flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Unable to load blogs</p>
            <p className="mt-1 text-red-200/80">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-4">
          {state === 'loading' ? (
            <div className="rounded-3xl border border-[#161616] bg-[#050505] p-6 text-sm text-gray-400">Loading blog feed...</div>
          ) : filteredBlogs.length > 0 ? (
            <BlogSidebarList blogs={filteredBlogs} selectedId={selectedBlog?.id || null} onSelect={setSelectedId} />
          ) : (
            <div className="rounded-3xl border border-[#161616] bg-[#050505] p-6 text-sm text-gray-400">
              {query ? 'No blogs matched your search.' : 'No published blogs available yet.'}
            </div>
          )}
        </aside>

        <section className="overflow-hidden rounded-[32px] border border-[#161616] bg-[#050505] shadow-[0_22px_80px_rgba(0,0,0,0.4)]">
          {selectedBlog ? (
            <>
              {selectedBlog.coverImageUrl ? (
                <div className="relative h-64 w-full overflow-hidden border-b border-white/6">
                  <Image src={selectedBlog.coverImageUrl} alt={selectedBlog.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center border-b border-white/6 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_58%)] text-sky-400">
                  <BookOpen className="h-8 w-8" />
                </div>
              )}

              <div className="space-y-6 px-6 py-6 md:px-8 md:py-8 xl:px-12 xl:py-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sats-orange-400">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  Featured article
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">{selectedBlog.title}</h2>
                  {selectedBlog.excerpt ? <p className="max-w-3xl text-base leading-8 text-gray-300">{selectedBlog.excerpt}</p> : null}
                </div>

                <article
                  className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-sats-orange-400 prose-blockquote:border-sats-orange-500/40 prose-blockquote:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
              </div>
            </>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center p-8 text-center text-gray-400">
              Select a blog from the left to start reading.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
