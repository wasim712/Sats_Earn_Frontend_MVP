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
      images: [
      {
        url: getSiteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "SatsEarn",
      },
    ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [getSiteUrl("/og-image.png")],
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
