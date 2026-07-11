import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Forgot Password',
  description: 'Recover your SatsEarn account password.',
  path: '/forgotpassword',
});

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
