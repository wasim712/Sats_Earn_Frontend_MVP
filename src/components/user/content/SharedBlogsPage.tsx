'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, ArrowLeft, BookOpen, Search, Sparkles, X, CalendarDays, Clock3 } from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';
import {
  USER_API_URL,
  formatContentDate,
  getContentErrorMessage,
  getReadTime,
  getStoredUserToken,
  stripHtml,
} from '@/components/user/content/userContent.helpers';
import type { UserBlogPost, UserContentLoadState } from '@/components/user/content/userContent.types';

type SharedBlogsPageProps = {
  apiPath: string;
  backHref?: string;
  backLabel?: string;
};

export function SharedBlogsPage({ apiPath, backHref, backLabel }: SharedBlogsPageProps) {
  const [blogs, setBlogs] = useState<UserBlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [state, setState] = useState<UserContentLoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mobileDragOffset, setMobileDragOffset] = useState(0);
  const [isDraggingMobileReader, setIsDraggingMobileReader] = useState(false);
  const mobileDragStartY = useRef<number | null>(null);

  const loadBlogs = async () => {
    try {
      setState('loading');
      setError(null);

      const token = getStoredUserToken();
      const headers = apiPath.startsWith('/users/') && token ? { Authorization: `Bearer ${token}` } : undefined;
      const data = await obfuscatedJsonRequest<unknown>(`${USER_API_URL}${apiPath}`, { headers });

      const safeData = Array.isArray(data) ? data as UserBlogPost[] : [];
      setBlogs(safeData);
      setSelectedId((current) => (current && safeData.some((blog) => blog.id === current) ? current : null));
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

  useEffect(() => {
    if (!isReaderOpen || typeof window === 'undefined' || window.innerWidth >= 1280) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isReaderOpen]);

  useEffect(() => {
    if (isReaderOpen) return;

    setMobileDragOffset(0);
    setIsDraggingMobileReader(false);
    mobileDragStartY.current = null;
  }, [isReaderOpen]);

  useEffect(() => {
    if (!filteredBlogs.length) {
      setSelectedId(null);
      setIsReaderOpen(false);
      return;
    }

    if (selectedId && filteredBlogs.some((blog) => blog.id === selectedId)) {
      return;
    }

    setSelectedId(null);
    setIsReaderOpen(false);
  }, [filteredBlogs, selectedId]);

  const handleSelectBlog = (id: string) => {
    setSelectedId(id);
    setIsReaderOpen(true);
  };

  const closeReader = () => {
    setMobileDragOffset(0);
    setIsDraggingMobileReader(false);
    mobileDragStartY.current = null;
    setIsReaderOpen(false);
  };

  const handleMobileSheetDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    mobileDragStartY.current = event.clientY;
    setIsDraggingMobileReader(true);
  };

  const handleMobileSheetDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingMobileReader || mobileDragStartY.current === null) return;

    const dragDistance = event.clientY - mobileDragStartY.current;
    setMobileDragOffset(dragDistance > 0 ? dragDistance : 0);
  };

  const handleMobileSheetDragEnd = () => {
    if (!isDraggingMobileReader) return;

    const shouldClose = mobileDragOffset > 110;
    setIsDraggingMobileReader(false);
    mobileDragStartY.current = null;

    if (shouldClose) {
      closeReader();
      return;
    }

    setMobileDragOffset(0);
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 xl:gap-8 xl:h-[calc(100vh-8rem)]">
        
        {/* Header Area */}
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {backHref && backLabel ? (
                <Link
                  href={backHref}
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-3 py-1.5 text-xs font-bold text-gray-300 transition hover:bg-[#111] hover:text-white hover:border-[#333]"
                >
                  <ArrowLeft className="h-4 w-4 text-gray-400" />
                  {backLabel}
                </Link>
              ) : null}

              <div className="inline-flex items-center gap-2 rounded-xl border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-sats-orange-400">
                <Sparkles className="h-4 w-4" />
                Blog Hub
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Platform Blogs</h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Explore updates, earning strategies, and useful reads in a more relaxed and readable layout.
            </p>
          </div>

          <div className="w-full sm:max-w-md xl:max-w-sm mt-2 xl:mt-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search blogs, topics, or guides..."
                className="h-14 w-full rounded-2xl border border-[#1a1a1a] bg-[#050505] pl-12 pr-4 text-sm font-semibold text-white placeholder:text-gray-500 outline-none transition hover:border-[#2a2a2a] focus:border-sats-orange-500/50 focus:bg-[#0a0a0a] shadow-sm"
              />
            </div>
          </div>
        </div>

        {state === 'error' && error ? (
        <div className="flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Unable to load blogs</p>
            <p className="mt-1 text-red-200/80">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.96fr)] xl:items-stretch xl:overflow-hidden">
        <section className="min-w-0 space-y-4 xl:flex xl:min-h-0 xl:flex-col xl:overflow-hidden xl:pr-2">
          {state === 'loading' ? (
            <div className="rounded-3xl border border-[#161616] bg-[#050505] p-6 text-sm text-gray-400">Loading blog feed...</div>
          ) : filteredBlogs.length > 0 ? (
            <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
                {filteredBlogs.map((blog) => {
                  const isActive = selectedBlog?.id === blog.id;

                  return (
                    <button
                      key={blog.id}
                      type="button"
                      onClick={() => handleSelectBlog(blog.id)}
                      className={`group overflow-hidden rounded-[28px] border text-left transition-all duration-300 ${isActive ? 'border-sats-orange-500/28 bg-sats-orange-500/10 shadow-[0_18px_46px_rgba(249,115,22,0.14)]' : 'border-[#161616] bg-[#050505] hover:border-sats-orange-500/20 hover:bg-[#080808]'}`}
                    >
                      <div className="relative h-48 overflow-hidden border-b border-white/6 bg-[#0b0b0b]">
                        {blog.coverImageUrl ? (
                          <>
                            <Image src={blog.coverImageUrl} alt={blog.title} fill className="object-cover scale-110 blur-2xl opacity-45" unoptimized />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.45))]" />
                            <div className="absolute inset-0 flex items-center justify-center p-5">
                              <div className="relative h-full w-full max-w-[220px] overflow-hidden rounded-[22px] border border-white/10 bg-black/10 shadow-[0_16px_36px_rgba(0,0,0,0.35)]">
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
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
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

                        <div className="mt-1 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 text-sm font-bold text-sats-orange-400 transition-all duration-200 group-hover:gap-3">
                            Read article
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#161616] bg-[#050505] p-6 text-sm text-gray-400">No blogs found for your search.</div>
          )}
        </section>

        <section className="hidden min-w-0 xl:block xl:min-h-0 xl:overflow-hidden">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-white/6 bg-[#050505] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="border-b border-white/6 px-6 py-5">
              {selectedBlog ? (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                    Blog article
                  </div>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-white">{selectedBlog.title}</h2>
                  {selectedBlog.excerpt ? <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">{selectedBlog.excerpt}</p> : null}
                </>
              ) : (
                <div className="text-sm text-gray-400">Select a blog to start reading.</div>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {selectedBlog ? (
                <>
                  <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-sats-orange-400" />
                      {formatContentDate(selectedBlog.publishedAt || selectedBlog.createdAt)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-sats-orange-500/60" />
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-sats-orange-400" />
                      {getReadTime(selectedBlog.content)} min read
                    </span>
                  </div>

                  <div className="space-y-6">
                    {selectedBlog.coverImageUrl ? (
                      <div className="relative h-72 w-full overflow-hidden rounded-[26px] border border-white/6 bg-[#0b0b0b] 2xl:h-64">
                        <Image src={selectedBlog.coverImageUrl} alt={selectedBlog.title} fill className="scale-110 object-cover blur-2xl opacity-40" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <div className="relative h-full w-full max-w-[320px] overflow-hidden rounded-[24px] border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.38)]">
                            <Image src={selectedBlog.coverImageUrl} alt={selectedBlog.title} fill className="object-contain p-4" unoptimized />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <article
                      className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-sats-orange-400 prose-blockquote:border-sats-orange-500/40 prose-blockquote:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <div className={`fixed inset-0 z-[120] xl:hidden ${isReaderOpen && selectedBlog ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isReaderOpen && selectedBlog ? 'opacity-100' : 'opacity-0'}`} />

        <div
          className={`absolute inset-x-0 bottom-0 flex h-[88vh] max-h-[88vh] flex-col overflow-hidden rounded-t-[30px] border border-white/8 bg-[#050505] shadow-[0_-18px_60px_rgba(0,0,0,0.45)] ${isDraggingMobileReader ? '' : 'transition-transform duration-300 ease-out'} ${isReaderOpen && selectedBlog ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ transform: isReaderOpen && selectedBlog ? `translateY(${mobileDragOffset}px)` : undefined }}
        >
          {selectedBlog ? (
            <>
              <div
                className="relative shrink-0 border-b border-white/6 px-4 pb-4 pt-4 touch-none"
                onPointerDown={handleMobileSheetDragStart}
                onPointerMove={handleMobileSheetDragMove}
                onPointerUp={handleMobileSheetDragEnd}
                onPointerCancel={handleMobileSheetDragEnd}
              >
                <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/15" />

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                      Blog article
                    </div>
                    <h2 className="mt-3 pr-2 text-lg font-black leading-tight text-white">{selectedBlog.title}</h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeReader}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition-colors hover:text-white"
                    aria-label="Close blog reader"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {selectedBlog.excerpt ? (
                  <p className="mt-3 text-sm leading-7 text-gray-400">{selectedBlog.excerpt}</p>
                ) : null}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4">
                {selectedBlog.coverImageUrl ? (
                  <div className="relative mb-5 h-52 w-full overflow-hidden rounded-[24px] border border-white/6">
                    <Image src={selectedBlog.coverImageUrl} alt={selectedBlog.title} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/10 to-transparent" />
                  </div>
                ) : null}

                <article
                  className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-sats-orange-400 prose-blockquote:border-sats-orange-500/40 prose-blockquote:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
      </div>
    </div>
  );
}
