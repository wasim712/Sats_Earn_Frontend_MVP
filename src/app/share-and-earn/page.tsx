import { createPageMetadata } from '@/lib/seo';
import ShareEarn from "./ShareEarn";

export const metadata = createPageMetadata({
  title: 'Share & Earn',
  description: 'Share your SatsEarn link and earn Bitcoin rewards for every friend who joins.',
  path: '/share-and-earn',
});

export default function Page() { 
  return <ShareEarn />; 
}
