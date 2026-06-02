import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: getSiteUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: getSiteUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: getSiteUrl('/contact'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: getSiteUrl('/privacy-policy'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: getSiteUrl('/terms'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: getSiteUrl('/login'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: getSiteUrl('/signup'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}
