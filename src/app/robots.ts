import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/user/',
          '/admin/',
          '/login',
          '/signup',
          '/forgotpassword',
          '/offline',
          '/api/',
        ],
      },
    ],
    sitemap: getSiteUrl('/sitemap.xml'),
  };
}
