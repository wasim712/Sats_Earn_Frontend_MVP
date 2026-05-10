'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import type { BlogPost } from '@/app/admin/content/content.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const getReadTime = (content: string) => {
  const words = stripHtml(content).split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Draft';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unscheduled';
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return 'Unable to load blogs right now.';
};

export default function UserBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadBlogs = async () => {
    try {
      setState('loading');
      setError(null);

      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const response = await fetch(`${API_URL}/admin/blogs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Blogs exist in admin, but the backend has not exposed a user-readable blog feed yet.');
        }

        throw new Error(data?.error || data?.message || 'Failed to load blog posts.');
      }

      const safeData = Array.isArray(data) ? data : [];
      const publishedBlogs = safeData.filter((post: BlogPost) => post.isPublished);

      setBlogs(publishedBlogs);
      setSelectedId((current) => current ?? publishedBlogs[0]?.id ?? null);
      setState('success');
    } catch (err) {
      setBlogs([]);
      setSelectedId(null);
      setError(getErrorMessage(err));
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
      const haystack = [blog.title, blog.excerpt || '', stripHtml(blog.content), blog.slug]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [blogs, query]);

  const selectedBlog = useMemo(() => {
    if (!filteredBlogs.length) return null;
    return filteredBlogs.find((blog) => blog.id === selectedId) || filteredBlogs[0];
  }, [filteredBlogs, selectedId]);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-sats-orange-500/15 bg-[#050505]/95 p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_22%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sats-orange-400">
              <Sparkles className="h-4 w-4" />
              Bitcoin Insights
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">SatsEarn Blogs</h1>
              <p className="max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
                Learn faster, stay updated, and explore platform insights through a cleaner reading experience built to match the SatsEarn dashboard theme.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatCard label="Published" value={String(blogs.length)} />
            <StatCard label="Visible" value={String(filteredBlogs.length)} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-5 rounded-[28px] border border-[#1a1a1a] bg-[#050505] p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Blog Library</h2>
              <p className="mt-1 text-sm text-gray-500">Browse published articles in a focused reading layout.</p>
            </div>
            <button
              onClick={loadBlogs}
              disabled={state === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#252525] bg-[#0a0a0a] px-4 py-3 text-sm font-bold text-gray-200 transition-all hover:border-sats-orange-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </button>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blogs by title, slug, or content"
              className="w-full rounded-2xl border border-[#1b1b1b] bg-[#0a0a0a] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-sats-orange-500/40 focus:ring-1 focus:ring-sats-orange-500/40"
            />
          </div>

          {state === 'loading' && <BlogListSkeleton />}

          {state === 'error' && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <div className="space-y-2">
                  <p className="font-bold text-red-300">Couldn&apos;t open the blog feed</p>
                  <p className="leading-6 text-red-200/90">{error}</p>
                  <p className="text-xs text-red-200/70">
                    Frontend is ready, but the current backend only exposes blogs through the admin-only route.
                  </p>
                </div>
              </div>
            </div>
          )}

          {state === 'success' && filteredBlogs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#232323] bg-[#070707] p-8 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-gray-600" />
              <h3 className="mt-4 text-lg font-black text-white">No blogs found</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {blogs.length === 0
                  ? 'There are no published blog posts available yet.'
                  : 'Try adjusting your search to find another article.'}
              </p>
            </div>
          )}

          {state === 'success' && filteredBlogs.length > 0 && (
            <div className="space-y-3">
              {filteredBlogs.map((blog, index) => {
                const isActive = selectedBlog?.id === blog.id;
                const preview = blog.excerpt?.trim() || `${stripHtml(blog.content).slice(0, 110)}...`;

                return (
                  <button
                    key={blog.id}
                    onClick={() => setSelectedId(blog.id)}
                    className={`w-full rounded-[24px] border p-4 text-left transition-all ${
                      isActive
                        ? 'border-sats-orange-500/30 bg-sats-orange-500/10 shadow-[0_0_0_1px_rgba(238,139,18,0.15)]'
                        : 'border-[#1b1b1b] bg-[#090909] hover:border-[#2d2d2d] hover:bg-[#0d0d0d]'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/4 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
                        {index === 0 ? 'Featured' : 'Article'}
                      </span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${isActive ? 'translate-x-0 text-sats-orange-400' : 'text-gray-600'}`} />
                    </div>
                    <h3 className="line-clamp-2 text-base font-black leading-6 text-white">{blog.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">{preview}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{getReadTime(blog.content)} min read</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-[#1a1a1a] bg-[#050505] p-5 md:p-7">
          {state === 'loading' && <BlogReaderSkeleton />}

          {state === 'error' && (
            <EmptyReader
              title="Blog reader unavailable"
              description="The reader view is ready, but it needs a user-accessible blog endpoint to display live content for non-admin users."
            />
          )}

          {state === 'success' && selectedBlog && (
            <article className="space-y-6">
              {selectedBlog.coverImageUrl ? (
                <div className="relative h-[220px] overflow-hidden rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] md:h-[320px]">
                  <Image
                    src={selectedBlog.coverImageUrl}
                    alt={selectedBlog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 70vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
              ) : (
                <div className="flex h-[220px] items-end overflow-hidden rounded-[24px] border border-[#1a1a1a] bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.22),transparent_22%),linear-gradient(135deg,#0b0b0b_0%,#060606_70%,#050505_100%)] p-6 md:h-[320px] md:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/25 bg-sats-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                    <BookOpen className="h-4 w-4" />
                    SatsEarn Editorial
                  </div>
                </div>
              )}

              <div className="space-y-4 border-b border-[#141414] pb-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  <span className="rounded-full border border-sats-orange-500/15 bg-sats-orange-500/10 px-3 py-1.5 text-sats-orange-400">
                    Published
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(selectedBlog.publishedAt || selectedBlog.createdAt)}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{getReadTime(selectedBlog.content)} min read</span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">{selectedBlog.title}</h2>
                  <p className="max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
                    {selectedBlog.excerpt?.trim() || 'Read this article to explore more updates, insights, and knowledge from the SatsEarn ecosystem.'}
                  </p>
                </div>
              </div>

              <div
                className="prose prose-invert max-w-none prose-headings:font-black prose-headings:text-white prose-p:text-gray-300 prose-p:leading-8 prose-li:text-gray-300 prose-strong:text-white prose-a:text-sats-orange-400 prose-blockquote:border-sats-orange-500/30 prose-blockquote:text-gray-300 prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </article>
          )}

          {state === 'success' && !selectedBlog && (
            <EmptyReader
              title="Choose an article"
              description="Pick a blog from the left to open it in the reader panel."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[120px] rounded-2xl border border-[#1b1b1b] bg-[#0a0a0a]/80 px-4 py-4 backdrop-blur-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[24px] border border-[#181818] bg-[#090909] p-4">
          <div className="h-5 w-20 rounded-full bg-[#151515]" />
          <div className="mt-4 h-6 w-4/5 rounded bg-[#151515]" />
          <div className="mt-3 h-4 w-full rounded bg-[#111]" />
          <div className="mt-2 h-4 w-3/4 rounded bg-[#111]" />
          <div className="mt-4 h-4 w-1/2 rounded bg-[#111]" />
        </div>
      ))}
    </div>
  );
}

function BlogReaderSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-[220px] rounded-[24px] bg-[#0b0b0b] md:h-[320px]" />
      <div className="h-4 w-40 rounded bg-[#121212]" />
      <div className="h-10 w-4/5 rounded bg-[#121212]" />
      <div className="h-5 w-3/4 rounded bg-[#101010]" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-4 rounded bg-[#101010]" />
        ))}
      </div>
    </div>
  );
}

function EmptyReader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#202020] bg-[#070707] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10">
        <BookOpen className="h-8 w-8 text-sats-orange-400" />
      </div>
      <h3 className="mt-6 text-2xl font-black text-white">{title}</h3>
      <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">{description}</p>
    </div>
  );
}
