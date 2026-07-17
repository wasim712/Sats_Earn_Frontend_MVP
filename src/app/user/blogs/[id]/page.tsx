'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, BookOpen, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';
import { normalizeImageUrl } from '@/lib/normalizeImageUrl';
import {
  USER_API_URL,
  formatContentDate,
  getContentErrorMessage,
  getReadTime,
} from '@/components/user/content/userContent.helpers';
import type { UserBlogPost, UserContentLoadState } from '@/components/user/content/userContent.types';

export default function UserBlogDetailsPage() {
  const params = useParams<{ id: string }>();
  const identifier = useMemo(() => String(params?.id || ''), [params]);
  const [blog, setBlog] = useState<UserBlogPost | null>(null);
  const [state, setState] = useState<UserContentLoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      if (!identifier) return;

      try {
        setState('loading');
        setError(null);

        const data = await obfuscatedJsonRequest<UserBlogPost>(`${USER_API_URL}/public/blogs/${identifier}`);
        setBlog(data || null);
        setState('success');
      } catch (err) {
        setBlog(null);
        setError(getContentErrorMessage(err, 'Unable to load this blog right now.'));
        setState('error');
      }
    };

    loadBlog();
  }, [identifier]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#020202] px-4 py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
      <div className="mx-auto max-w-[1100px] space-y-6 md:space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-sats-orange-500/12 bg-[#050505]/95 px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.38)] md:px-7 md:py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_20%)]" />

          <div className="relative flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/user/blogs"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-bold text-gray-300 transition hover:border-sats-orange-500/25 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
                Back to Blogs
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                <Sparkles className="h-3.5 w-3.5" />
                Blog Article
              </div>
            </div>

            {state === 'loading' ? (
              <div className="animate-pulse space-y-4">
                <div className="space-y-3 pt-2">
                  <div className="h-10 w-3/4 max-w-xl bg-[#111] rounded-lg"></div>
                  <div className="h-4 w-1/2 max-w-md bg-[#111] rounded"></div>
                  <div className="h-4 w-1/3 max-w-sm bg-[#111] rounded"></div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-3 w-20 bg-[#111] rounded-full"></div>
                  <div className="h-1 w-1 bg-[#111] rounded-full"></div>
                  <div className="h-3 w-16 bg-[#111] rounded-full"></div>
                </div>
              </div>
            ) : state === 'error' && error ? (
              <div className="flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold">Unable to load blog</p>
                  <p className="mt-1 text-red-200/80">{error}</p>
                </div>
              </div>
            ) : blog ? (
              <>
                <div className="space-y-3">
                  <h1 className="text-2xl font-black tracking-tight text-white md:text-4xl">{blog.title}</h1>
                  {blog.excerpt ? (
                    <p className="max-w-3xl text-sm leading-7 text-gray-400 md:text-[15px]">{blog.excerpt}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-gray-400">
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
              </>
            ) : null}
          </div>
        </section>

        {blog ? (
          <section className="overflow-hidden rounded-[30px] border border-white/6 bg-[#050505] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="p-5 md:p-8">
              {blog.coverImageUrl ? (
                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-[26px] border border-white/6 bg-[#0b0b0b] md:h-[420px]">
                  <Image src={normalizeImageUrl(blog.coverImageUrl)} alt={blog.title} fill className="scale-110 object-cover blur-2xl opacity-40" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="relative h-full w-full max-w-[460px] overflow-hidden rounded-[24px] border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.38)]">
                      <Image src={normalizeImageUrl(blog.coverImageUrl)} alt={blog.title} fill className="object-contain p-4" unoptimized />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 flex h-40 items-center justify-center rounded-[26px] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_58%)] text-sky-400">
                  <BookOpen className="h-10 w-10" />
                </div>
              )}

              <article
                className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-sats-orange-400 prose-blockquote:border-sats-orange-500/40 prose-blockquote:text-gray-300"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </section>
        ) : state === 'loading' ? (
          <section className="overflow-hidden rounded-[30px] border border-[#1a1a1a] bg-[#050505] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="p-5 md:p-8 animate-pulse">
              <div className="relative mb-8 h-64 w-full overflow-hidden rounded-[26px] bg-[#0a0a0a] border border-[#1a1a1a] md:h-[420px]"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-[#111] rounded"></div>
                <div className="h-4 w-full bg-[#111] rounded"></div>
                <div className="h-4 w-5/6 bg-[#111] rounded"></div>
                <div className="pt-4 space-y-4">
                  <div className="h-4 w-full bg-[#111] rounded"></div>
                  <div className="h-4 w-4/5 bg-[#111] rounded"></div>
                  <div className="h-4 w-full bg-[#111] rounded"></div>
                </div>
                <div className="pt-4 space-y-4">
                  <div className="h-4 w-3/4 bg-[#111] rounded"></div>
                  <div className="h-4 w-full bg-[#111] rounded"></div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
