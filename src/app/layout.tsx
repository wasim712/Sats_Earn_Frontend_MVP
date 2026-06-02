
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/store/StoreProvider';
import { InteractiveBackground } from '@/components/layout/InteractiveBackground';
import { RouteWrapper } from '@/components/layout/RouteWrapper';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { PwaRegistration } from '@/components/ui/PwaRegistration';
import { PwaInstallPrompt } from '@/components/ui/PwaInstallPrompt';
import { ADSENSE_CLIENT, getSiteUrl, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Earn Bitcoin Through Tasks, Offers, and Rewards`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'SatsEarn is a public rewards platform where users can complete online tasks, surveys, offers, and referrals to earn Bitcoin rewards.',
  manifest: '/manifest.webmanifest',
  applicationName: SITE_NAME,
  alternates: {
    canonical: getSiteUrl('/'),
  },
  openGraph: {
    type: 'website',
    url: getSiteUrl('/'),
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Earn Bitcoin Through Tasks, Offers, and Rewards`,
    description:
      'Learn how SatsEarn works, what users can earn, and where to find support, privacy, and terms information.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Earn Bitcoin Through Tasks, Offers, and Rewards`,
    description:
      'Complete online tasks, surveys, offers, and referrals on SatsEarn to earn Bitcoin rewards.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-sats-black-950 text-white font-sans " suppressHydrationWarning>
        <StoreProvider>
          <PwaRegistration />
          <NavbarWrapper/>
          <InteractiveBackground />
          
          <RouteWrapper>
            {children}
          </RouteWrapper>
          <PwaInstallPrompt />
          
        </StoreProvider>
      </body>
    </html>
  );
}
