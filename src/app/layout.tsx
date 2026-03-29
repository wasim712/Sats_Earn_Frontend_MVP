// Location: src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/store/StoreProvider';
import { InteractiveBackground } from '@/components/layout/InteractiveBackground';
// import { Footer } from '@/components/layout/Footer';


export const metadata: Metadata = {
  title: 'SatsEarn | The #1 Gamified Platform to Earn Bitcoin',
  description: 'Complete tasks, surveys, and offers to earn Bitcoin instantly.',
};

export default function RootLayout({
  children, // <--- THIS IS THE MAGIC WORD
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-sats-black-950 text-white font-sans">
        <StoreProvider>
          <InteractiveBackground />
          
          <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        
            {children}

          </main>
        </StoreProvider>
      </body>
    </html>
  );
}