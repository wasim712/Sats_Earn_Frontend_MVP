import type { Metadata } from 'next';
import React from 'react';
import { getSiteUrl } from '@/lib/site';
import { faqData } from './faqData';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'FAQ',
  description: 'Answers to common questions about earning Bitcoin, satoshis, referrals, withdrawals, Lightning Network payments, rewards, account management, and platform security.',
  path: '/faq',
});

// Safe helper to extract raw text from React nodes
const extractTextFromNode = (node: React.ReactNode): string => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
  
  if (React.isValidElement(node)) {
    // Cast to access props safely
    const element = node as React.ReactElement<any>;
    if (element.props && element.props.children) {
      return extractTextFromNode(element.props.children);
    }
  }
  return '';
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  // Generate FAQPage JSON-LD
  const mainEntity = faqData.flatMap((category) =>
    category.questions.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: extractTextFromNode(q.a).trim(),
      },
    }))
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Help Centre',
        item: getSiteUrl('/faq'),
      },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Frequently Asked Questions | SatsEarn',
    description:
      'Answers to common questions about earning Bitcoin, satoshis, referrals, withdrawals, Lightning Network payments, rewards, account management, and platform security.',
    url: getSiteUrl('/faq'),
    publisher: {
      '@type': 'Organization',
      name: 'SatsEarn',
    },
  };

  return (
    <>
      {/* Inject schemas dynamically on the server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {children}
    </>
  );
}
