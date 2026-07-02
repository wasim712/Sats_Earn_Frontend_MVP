import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const revalidate = 600;

type SitemapBlogPost = {
  id: string;
  slug?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
};

async function getPublishedBlogs(): Promise<SitemapBlogPost[]> {
  try {
    const response = await fetch(`${API_URL}/public/blogs`, {
      next: { revalidate },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? (data as SitemapBlogPost[]) : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const corePages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' },
    { url: '/blogs', priority: 0.9, changeFrequency: 'daily' },
    { url: '/how-it-works', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/rewards', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/referral', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/founders', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/withdrawals', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/faq', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/btc-basics', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/brands', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/games/sat-worm', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/share-and-earn', priority: 0.8, changeFrequency: 'monthly' },
  ] as const;

  const legalPages = [
    { url: '/legal', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/legal/terms', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/privacy', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/cookie-policy', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/manage-cookies', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/rewards-policy', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/mica-policy', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/regulatory-statement', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/sats-disclaimer', priority: 0.4, changeFrequency: 'yearly' },
    { url: '/legal/community-guidelines', priority: 0.4, changeFrequency: 'yearly' },
  ] as const;

  const staticRoutes: MetadataRoute.Sitemap = [...corePages, ...legalPages].map((route) => ({
    url: getSiteUrl(route.url),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogs = await getPublishedBlogs();

  const blogRoutes: MetadataRoute.Sitemap = blogs.reduce<MetadataRoute.Sitemap>((routes, blog) => {
    const identifier = blog.slug || blog.id;

    if (!identifier) {
      return routes;
    }

    const lastModifiedValue = blog.publishedAt || blog.createdAt;
    const lastModified = lastModifiedValue ? new Date(lastModifiedValue) : now;

    routes.push({
      url: getSiteUrl(`/blogs/${identifier}`),
      lastModified: Number.isNaN(lastModified.getTime()) ? now : lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    return routes;
  }, []);

  return [...staticRoutes, ...blogRoutes];
}
