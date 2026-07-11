import { Metadata } from 'next';
import { getSiteUrl, SITE_NAME } from './site';

interface PageMetadataConfig {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  keywords?: string[];
}

export function createPageMetadata({
  title,
  description,
  path,
  noindex = false,
  keywords = [],
}: PageMetadataConfig): Metadata {
  const url = getSiteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
      },
    },
    ...(keywords.length > 0 && { keywords }),
  };
}
