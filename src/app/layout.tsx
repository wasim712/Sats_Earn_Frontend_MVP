
import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/store/StoreProvider';
import { InteractiveBackground } from '@/components/layout/InteractiveBackground';
import { RouteWrapper } from '@/components/layout/RouteWrapper';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { AnnouncementBanner } from '@/components/ui/AnnouncementBanner';

export const metadata: Metadata = {
  title: 'SatsEarn | The #1 Gamified Platform to Earn Bitcoin',
  description: 'Complete tasks, surveys, and offers to earn Bitcoin instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-sats-black-950 text-white font-sans " suppressHydrationWarning>
        <StoreProvider>
          <NavbarWrapper/>
          <InteractiveBackground />
          
          <RouteWrapper>
            {children}
          </RouteWrapper>
          
        </StoreProvider>
      </body>
    </html>
  );
}