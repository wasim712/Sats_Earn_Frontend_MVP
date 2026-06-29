'use client';

import { Suspense } from 'react';
import BlogsBrowser from '@/components/user/content/BlogsBrowser';

export default function PublicBlogsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-400">Loading...</div>}>
      <BlogsBrowser backHref="/" backLabel="Back to Home" detailBasePath="/blogs" />
    </Suspense>
  );
}
