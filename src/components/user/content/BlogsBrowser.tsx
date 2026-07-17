'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  GitCompareArrows,
  Search,
  Sparkles,
} from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';
import { normalizeImageUrl } from '@/lib/normalizeImageUrl';
import {
  USER_API_URL,
  formatContentDate,
  getContentErrorMessage,
  getReadTime,
  stripHtml,
} from '@/components/user/content/userContent.helpers';
import type { UserBlogPost, UserContentLoadState } from '@/components/user/content/userContent.types';

type BlogViewMode = 'blogs' | 'comparisons';

type BlogsBrowserProps = {
  backHref: string;
  backLabel: string;
  detailBasePath: string;
};

const COMPARISON_PATTERNS = [
  /\bvs\.?\b/i,
  /\bversus\b/i,
  /\bcompare\b/i,
  /\bcomparison\b/i,
  /\bcompared\b/i,
];

function isComparisonBlog(blog: UserBlogPost) {
  const searchableText = [blog.title, blog.excerpt || '', stripHtml(blog.content).slice(0, 240)]
    .join(' ')
    .trim();

  return COMPARISON_PATTERNS.some((pattern) => pattern.test(searchableText));
}

function getEmptyMessage(viewMode: BlogViewMode, query: string) {
  if (query.trim()) {
    return viewMode === 'comparisons'
      ? 'No comparison articles found for your search.'
      : 'No blogs found for your search.';
  }

  return viewMode === 'comparisons'
    ? 'No comparison-style blogs are available right now.'
    : 'No blogs are available right now.';
}

function BlogCard({
  blog,
  href,
  isComparison,
}: {
  blog: UserBlogPost;
  href: string;
  isComparison: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group overflow-hidden rounded-[28px] border bg-[#050505] text-left transition-all duration-300 hover:-translate-y-1 hover:bg-[#080808] ${
        isComparison
          ? 'border-[#7c3aed]/25 hover:border-[#a855f7]/40 hover:shadow-[0_18px_46px_rgba(168,85,247,0.16)]'
          : 'border-[#161616] hover:border-sats-orange-500/20 hover:shadow-[0_18px_46px_rgba(249,115,22,0.12)]'
      }`}
    >
      <div className="relative h-52 overflow-hidden border-b border-white/6 bg-[#0b0b0b]">
        {blog.coverImageUrl ? (
          <>
            <Image src={normalizeImageUrl(blog.coverImageUrl)} alt={blog.title} fill className="object-cover scale-110 blur-2xl opacity-45" unoptimized />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.45))]" />
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <div className="relative h-full w-full max-w-[240px] overflow-hidden rounded-[22px] border border-white/10 bg-black/10 shadow-[0_16px_36px_rgba(0,0,0,0.35)]">
                <Image src={normalizeImageUrl(blog.coverImageUrl)} alt={blog.title} fill className="object-contain p-3 transition duration-500 group-hover:scale-[1.03]" unoptimized />
              </div>
            </div>
          </>
        ) : (
          <div className={`flex h-full items-center justify-center ${isComparison ? 'bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_58%)] text-violet-300' : 'bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_58%)] text-sky-400'}`}>
            {isComparison ? <GitCompareArrows className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
          </div>
        )}

        {isComparison ? (
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-violet-200 shadow-[0_8px_20px_rgba(168,85,247,0.18)] backdrop-blur-sm">
            <GitCompareArrows className="h-3.5 w-3.5 text-violet-300" />
            Comparison
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className={`h-3.5 w-3.5 ${isComparison ? 'text-violet-300' : 'text-sats-orange-400'}`} />
            {formatContentDate(blog.publishedAt || blog.createdAt)}
          </span>
          <span className={`h-1 w-1 rounded-full ${isComparison ? 'bg-violet-400/60' : 'bg-sats-orange-500/60'}`} />
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className={`h-3.5 w-3.5 ${isComparison ? 'text-violet-300' : 'text-sats-orange-400'}`} />
            {getReadTime(blog.content)} min read
          </span>
        </div>

        <div className="space-y-2">
          <h3 className={`text-lg font-black leading-7 text-white transition line-clamp-2 ${isComparison ? 'group-hover:text-violet-200' : 'group-hover:text-sats-orange-300'}`}>
            {blog.title}
          </h3>
          <p className="text-sm leading-6 text-gray-400 line-clamp-3">
            {blog.excerpt || `${stripHtml(blog.content).slice(0, 140)}...`}
          </p>
        </div>

        <div className={`mt-1 inline-flex items-center gap-2 text-sm font-bold transition-all duration-200 group-hover:gap-3 ${isComparison ? 'text-violet-300' : 'text-sats-orange-400'}`}>
          Read article
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogsBrowser({ backHref, backLabel, detailBasePath }: BlogsBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [blogs, setBlogs] = useState<UserBlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [state, setState] = useState<UserContentLoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const activeView = searchParams.get('view') === 'comparisons' ? 'comparisons' : 'blogs';

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

  const { regularBlogs, comparisonBlogs } = useMemo(() => {
    const comparisons = blogs.filter(isComparisonBlog);
    const regular = blogs.filter((blog) => !isComparisonBlog(blog));

    return {
      regularBlogs: regular,
      comparisonBlogs: comparisons,
    };
  }, [blogs]);

  const visibleBlogs = useMemo(() => {
    const source = activeView === 'comparisons' ? comparisonBlogs : regularBlogs;
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return source;

    return source.filter((blog) => {
      const haystack = [blog.title, blog.excerpt || '', stripHtml(blog.content), blog.slug].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeView, comparisonBlogs, query, regularBlogs]);

  const setView = (view: BlogViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
      <div className="mx-auto max-w-[1400px] space-y-6 md:space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-sats-orange-500/12 bg-[#050505]/95 px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.38)] md:px-7 md:py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_20%)]" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={backHref}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-bold text-gray-300 transition hover:border-sats-orange-500/25 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
                  {backLabel}
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Blog Hub
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">Platform blogs</h1>
                <p className="max-w-2xl text-sm leading-7 text-gray-400 md:text-[15px]">
                  Explore blogs and dedicated comparison-style articles in one place. Use the pills below to jump directly between standard blog posts and comparison content.
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
                  placeholder={activeView === 'comparisons' ? 'Search comparisons, versus guides, or matchups...' : 'Search blogs, topics, or guides...'}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/50 pl-11 pr-4 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sats-orange-500/40"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center w-full justify-center gap-3">
            <button
              type="button"
              onClick={() => setView('blogs')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                activeView === 'blogs'
                  ? 'border-sats-orange-500/30 bg-sats-orange-500/12 text-sats-orange-300 shadow-[0_10px_24px_rgba(249,115,22,0.16)]'
                  : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-sats-orange-500/20 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Blogs
              <span className="rounded-full bg-black/25 px-2 py-0.5 text-[12px] font-black text-inherit">{regularBlogs.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setView('comparisons')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                activeView === 'comparisons'
                  ? 'border-violet-400/30 bg-violet-500/12 text-violet-200 shadow-[0_10px_24px_rgba(168,85,247,0.18)]'
                  : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-violet-400/20 hover:text-white'
              }`}
            >
              <GitCompareArrows className="h-4 w-4" />
              Comparisons
              <span className="rounded-full bg-black/25 px-2 py-0.5 text-[12px] font-black text-inherit">{comparisonBlogs.length}</span>
            </button>
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
        ) : state === 'loading' ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[28px] border border-[#1a1a1a] bg-[#050505] animate-pulse">
                <div className="h-52 w-full border-b border-[#1a1a1a] bg-[#0a0a0a]" />
                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-20 rounded-full bg-[#111]" />
                    <div className="h-1 w-1 rounded-full bg-[#111]" />
                    <div className="h-3 w-16 rounded-full bg-[#111]" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-5 w-5/6 rounded-md bg-[#111]" />
                    <div className="h-5 w-3/4 rounded-md bg-[#111]" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-3 w-full rounded bg-[#111]" />
                    <div className="h-3 w-full rounded bg-[#111]" />
                    <div className="h-3 w-4/5 rounded bg-[#111]" />
                  </div>
                  <div className="pt-2">
                    <div className="h-4 w-24 rounded-full bg-[#111]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : visibleBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleBlogs.map((blog) => {
              const comparison = isComparisonBlog(blog);

              return (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  href={`${detailBasePath}/${blog.slug || blog.id}`}
                  isComparison={comparison}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#161616] bg-[#050505] p-6 text-sm text-gray-400">
            {getEmptyMessage(activeView, query)}
          </div>
        )}
      </div>
    </div>
  );
}
