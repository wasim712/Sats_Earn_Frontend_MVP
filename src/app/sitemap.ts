import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core Pages
  const corePages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' },
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
  ] as const;

  // Legal Policies
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

  const allRoutes = [...corePages, ...legalPages];

  return allRoutes.map((route) => ({
    url: getSiteUrl(route.url),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
