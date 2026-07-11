import { Suspense } from 'react';
import { createPageMetadata } from '@/lib/seo';
import BlogsBrowser from '@/components/user/content/BlogsBrowser';

export const metadata = createPageMetadata({
  title: 'Blogs & Comparisions',
  description: 'Read the latest news, updates, and educational content from SatsEarn.',
  path: '/blogs',
});

export default function PublicBlogsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-400">Loading...</div>}>
      <BlogsBrowser backHref="/" backLabel="Back to Home" detailBasePath="/blogs" />
    </Suspense>
  );
}
