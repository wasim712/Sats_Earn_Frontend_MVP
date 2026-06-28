'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, ArrowLeft, BookOpen, Search, Sparkles, CalendarDays, Clock3, ArrowRight } from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';
import {
  USER_API_URL,
  formatContentDate,
  getContentErrorMessage,
  getReadTime,
  stripHtml,
} from '@/components/user/content/userContent.helpers';
import type { UserBlogPost, UserContentLoadState } from '@/components/user/content/userContent.types';

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<UserBlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [state, setState] = useState<UserContentLoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setState('loading');
        setError(null);

        const data = await obfuscatedJsonRequest<unknown>(`${USER_API_URL}/public/blogs`);
        setBlogs(Array.isArray(data) ? (data as UserBlogPost[]) : []);
        setState('success');
      } catch (err) {
        setBlogs([]);
        setError(getContentErrorMessage(err, 'Unable to load blogs right now.'));
        setState('error');
      }
    };

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

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
      <div className="mx-auto max-w-[1400px] space-y-6 md:space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-sats-orange-500/12 bg-[#050505]/95 px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.38)] md:px-7 md:py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_20%)]" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/user/dashboard"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-bold text-gray-300 transition hover:border-sats-orange-500/25 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
                  Back to Dashboard
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Blog Hub
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">Platform blogs</h1>
                <p className="max-w-2xl text-sm leading-7 text-gray-400 md:text-[15px]">
                  Explore updates, earning strategies, and useful reads in a clean public blog feed. Open any card to read the full article on its own page.
                </p>
              </div>
            </div>

            <div className="w-full sm:max-w-md xl:max-w-sm">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/70" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search blogs, topics, or guides..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/50 pl-11 pr-4 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sats-orange-500/40"
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

        {state === 'loading' ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-[28px] border border-[#1a1a1a] bg-[#050505] animate-pulse">
                <div className="h-52 w-full bg-[#0a0a0a] border-b border-[#1a1a1a]"></div>
                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-20 bg-[#111] rounded-full"></div>
                    <div className="h-1 w-1 rounded-full bg-[#111]"></div>
                    <div className="h-3 w-16 bg-[#111] rounded-full"></div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-5 w-5/6 bg-[#111] rounded-md"></div>
                    <div className="h-5 w-3/4 bg-[#111] rounded-md"></div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-3 w-full bg-[#111] rounded"></div>
                    <div className="h-3 w-full bg-[#111] rounded"></div>
                    <div className="h-3 w-4/5 bg-[#111] rounded"></div>
                  </div>
                  <div className="pt-2">
                    <div className="h-4 w-24 bg-[#111] rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/user/blogs/${blog.slug || blog.id}`}
                className="group overflow-hidden rounded-[28px] border border-[#161616] bg-[#050505] text-left transition-all duration-300 hover:border-sats-orange-500/20 hover:bg-[#080808] hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(249,115,22,0.12)]"
              >
                <div className="relative h-52 overflow-hidden border-b border-white/6 bg-[#0b0b0b]">
                  {blog.coverImageUrl ? (
                    <>
                      <Image src={blog.coverImageUrl} alt={blog.title} fill className="object-cover scale-110 blur-2xl opacity-45" unoptimized />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.45))]" />
                      <div className="absolute inset-0 flex items-center justify-center p-5">
                        <div className="relative h-full w-full max-w-[240px] overflow-hidden rounded-[22px] border border-white/10 bg-black/10 shadow-[0_16px_36px_rgba(0,0,0,0.35)]">
                          <Image src={blog.coverImageUrl} alt={blog.title} fill className="object-contain p-3 transition duration-500 group-hover:scale-[1.03]" unoptimized />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_58%)] text-sky-400">
                      <BookOpen className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-sats-orange-400" />
                      {formatContentDate(blog.publishedAt || blog.createdAt)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-sats-orange-500/60" />
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-sats-orange-400" />
                      {getReadTime(blog.content)} min read
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black leading-7 text-white transition group-hover:text-sats-orange-300 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm leading-6 text-gray-400 line-clamp-3">
                      {blog.excerpt || `${stripHtml(blog.content).slice(0, 140)}...`}
                    </p>
                  </div>

                  <div className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-sats-orange-400 transition-all duration-200 group-hover:gap-3">
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#161616] bg-[#050505] p-6 text-sm text-gray-400">No blogs found for your search.</div>
        )}
      </div>
    </div>
  );
}

