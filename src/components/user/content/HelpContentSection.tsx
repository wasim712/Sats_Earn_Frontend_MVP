'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  MessageCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  formatContentDate,
  getReadTime,
  stripHtml,
} from '@/components/user/content/userContent.helpers';
import type {
  UserBlogPost,
  UserFaqItem,
  UserContentLoadState,
} from '@/components/user/content/userContent.types';

type HelpContentSectionProps = {
  blogs: UserBlogPost[];
  faqs: UserFaqItem[];
  blogState: UserContentLoadState;
  faqState: UserContentLoadState;
  blogError: string | null;
  faqError: string | null;
  contactHref?: string;
};

export function HelpContentSection({
  blogs,
  faqs,
  blogState,
  faqState,
  blogError,
  faqError,
  contactHref,
}: HelpContentSectionProps) {
  const [faqQuery, setFaqQuery] = useState('');
  const [blogQuery, setBlogQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string>('');

  const mergedFaqs = useMemo(() => {
    const seenQuestions = new Set<string>();

    return faqs.filter((item) => {
      const key = item.question.trim().toLowerCase();
      if (seenQuestions.has(key)) return false;
      seenQuestions.add(key);
      return true;
    }).map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: item.category || 'Platform',
    }));
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = faqQuery.trim().toLowerCase();
    if (!normalizedQuery) return mergedFaqs;

    return mergedFaqs.filter((faq) => {
      const haystack = `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [mergedFaqs, faqQuery]);

  React.useEffect(() => {
    if (!filteredFaqs.length) {
      setOpenFaqId('');
      return;
    }

    setOpenFaqId((current) => (current && filteredFaqs.some((faq) => faq.id === current) ? current : filteredFaqs[0].id));
  }, [filteredFaqs]);

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = blogQuery.trim().toLowerCase();
    if (!normalizedQuery) return blogs.slice(0, 6);

    return blogs
      .filter((blog) => {
        const haystack = [blog.title, blog.excerpt || '', stripHtml(blog.content), blog.slug]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [blogs, blogQuery]);

  const isContactReady = Boolean(contactHref && contactHref.trim());

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-sats-orange-500/12 bg-[#050505]/95 px-5 py-5 md:px-7 md:py-6 shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.05),transparent_20%)]" />
        <div className="relative flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            Help Center
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">
              Help, FAQs and useful reads
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-gray-400 md:text-[15px]">
              Find quick answers, browse support information, and explore helpful blogs in one clean place.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[28px] border border-white/8 bg-[#070707]/95 p-5 md:p-7 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4 border-b border-white/6 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">FAQ Section</p>
              <h2 className="mt-2 text-xl font-black tracking-tight text-white">Questions answered clearly</h2>
              <p className="mt-2 text-sm text-gray-400">
                Browse live FAQs managed from the admin panel.
              </p>
            </div>

            <div className="relative min-w-0 sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/70" />
              <input
                type="text"
                value={faqQuery}
                onChange={(event) => setFaqQuery(event.target.value)}
                placeholder="Search answers..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sats-orange-500/40"
              />
            </div>
          </div>

          {faqState === 'loading' && !filteredFaqs.length && (
            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 text-sm text-gray-400">
              Loading FAQs...
            </div>
          )}

          {faqState === 'error' && (
            <InlineErrorCard message={faqError || 'Unable to load FAQs right now.'} />
          )}

          <div className="mt-5 space-y-3">
            {filteredFaqs.length ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;

                return (
                  <article
                    key={faq.id}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? 'border-sats-orange-500/35 bg-sats-orange-500/8 shadow-[0_10px_30px_rgba(238,139,18,0.08)]'
                        : 'border-white/8 bg-white/[0.02] hover:border-white/14 hover:bg-white/[0.04]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                      className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left md:px-6"
                    >
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                          {faq.category}
                        </span>
                        <h3 className="text-base font-bold leading-7 text-white md:text-lg">{faq.question}</h3>
                      </div>
                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-emerald-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-white/6 px-5 py-4 text-sm leading-7 text-gray-300 md:px-6">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <EmptyState
                title="No FAQs matched your search"
                description="Try another keyword or refresh to pull the newest admin-added FAQ entries."
                icon={<HelpCircle className="h-6 w-6 text-sats-orange-400" />}
              />
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/8 bg-[#070707]/95 p-5 md:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">Direct Contact</p>
                <h2 className="mt-2 text-xl font-black text-white">Reach out on X</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Keep a dedicated spot here for direct help from the admin or founder account.
                </p>
              </div>
              <div className="rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10 p-3 text-sats-orange-400">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>

            {isContactReady ? (
              <Link
                href={contactHref as string}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sats-orange-500/25 bg-sats-orange-500/10 px-4 py-3 text-sm font-bold text-sats-orange-300 transition hover:border-sats-orange-500/40 hover:bg-sats-orange-500/15"
              >
                Contact on X
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/12 bg-black/30 p-4 text-sm leading-6 text-gray-400">
                Add your X contact link here later. The layout is already reserved and styled to match the rest of the help center.
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#070707]/95 p-5 md:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-4 border-b border-white/6 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">Blog Section</p>
                <h2 className="mt-2 text-xl font-black text-white">Latest platform reads</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Read the newest guides and updates fetched from the platform blog feed.
                </p>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/70" />
                <input
                  type="text"
                  value={blogQuery}
                  onChange={(event) => setBlogQuery(event.target.value)}
                  placeholder="Search blogs..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sats-orange-500/40"
                />
              </div>
            </div>

            {blogState === 'loading' && !filteredBlogs.length && (
              <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 text-sm text-gray-400">
                Loading blog posts...
              </div>
            )}

            {blogState === 'error' && (
              <InlineErrorCard message={blogError || 'Unable to load blog posts right now.'} />
            )}

            <div className="mt-5 space-y-4">
              {filteredBlogs.length ? (
                filteredBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href="/user/blogs"
                    className="group block overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] transition hover:border-sats-orange-500/25 hover:bg-white/[0.04]"
                  >
                    <div className="grid gap-0 md:grid-cols-[140px_1fr]">
                      <div className="relative h-44 overflow-hidden bg-sats-black-900 md:h-full">
                        {blog.coverImageUrl ? (
                          <>
                            <Image
                              src={blog.coverImageUrl}
                              alt={blog.title}
                              fill
                              className="object-cover scale-110 blur-2xl opacity-40"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.4))]" />
                            <div className="absolute inset-0 flex items-center justify-center p-3">
                              <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-white/10 bg-black/10 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                                <Image
                                  src={blog.coverImageUrl}
                                  alt={blog.title}
                                  fill
                                  className="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                                  unoptimized
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_58%)] text-sky-400">
                            <BookOpen className="h-7 w-7" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                          <span>{formatContentDate(blog.publishedAt || blog.createdAt)}</span>
                          <span className="h-1 w-1 rounded-full bg-sats-orange-500/60" />
                          <span>{getReadTime(blog.content)} min read</span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-black leading-7 text-white transition group-hover:text-sats-orange-300">
                            {blog.title}
                          </h3>
                          <p className="text-sm leading-6 text-gray-400">
                            {blog.excerpt || `${stripHtml(blog.content).slice(0, 140)}...`}
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2 text-sm font-bold text-sats-orange-400">
                          Open full blog hub
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState
                  title="No blog posts available"
                  description="Published blog posts will appear here as soon as they are available from the platform feed."
                  icon={<BookOpen className="h-6 w-6 text-sats-orange-400" />}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InlineErrorCard({ message }: { message: string }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-6">{message}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 px-6 py-10 text-center">
      <div className="mb-4 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10 p-3">{icon}</div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">{description}</p>
    </div>
  );
}

