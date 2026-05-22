
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { StoreProvider } from '@/store/StoreProvider';
import { InteractiveBackground } from '@/components/layout/InteractiveBackground';
import { RouteWrapper } from '@/components/layout/RouteWrapper';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { PwaRegistration } from '@/components/ui/PwaRegistration';
import { PwaInstallPrompt } from '@/components/ui/PwaInstallPrompt';

export const metadata: Metadata = {
  title: 'SatsEarn | The #1 Gamified Platform to Earn Bitcoin',
  description: 'Complete tasks, surveys, and offers to earn Bitcoin instantly.',
  manifest: '/manifest.webmanifest',
  applicationName: 'SatsEarn',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SatsEarn',
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
        <Script
          id="google-adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1587064567124053"
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
