'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_TRACKING_ID, trackPageView } from '@/lib/analytics';

/**
 * Internal component to handle route changes and dispatch page view events.
 * it&apos;s isolated so it can be wrapped in a Suspense boundary, preventing
 * the entire layout from de-optimizing to client-side rendering.
 */
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && GA_TRACKING_ID) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
        
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Initializes Google Analytics and tracks route transitions in a Next.js App Router environment.
 * Gracefully disables itself if no Measurement ID is found.
 */
export function GoogleAnalytics() {
  if (!GA_TRACKING_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_TRACKING_ID}', {
            send_page_view: false, // Page views are manually handled by RouteTracker
            ${process.env.NODE_ENV !== 'production' ? 'debug_mode: true,' : ''}
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
    </>
  );
}
