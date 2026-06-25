'use client';

import { SharedBlogsPage } from '@/components/user/content/SharedBlogsPage';

export default function UserBlogsPage() {
  return <SharedBlogsPage apiPath="/users/blogs" backHref="/user/help" backLabel="Back to Help" />;
}
