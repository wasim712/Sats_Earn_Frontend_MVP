'use client';

import React, { useEffect, useState } from 'react';
import { HelpContentSection } from '@/components/user/content/HelpContentSection';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';
import {
  USER_API_URL,
  getContentErrorMessage,
  getStoredUserToken,
} from '@/components/user/content/userContent.helpers';
import type {
  UserBlogPost,
  UserFaqItem,
  UserContentLoadState,
} from '@/components/user/content/userContent.types';

const CONTACT_X_URL = '';

export default function UserHelpPage() {
  const [blogs, setBlogs] = useState<UserBlogPost[]>([]);
  const [faqs, setFaqs] = useState<UserFaqItem[]>([]);

  const [blogState, setBlogState] = useState<UserContentLoadState>('idle');
  const [faqState, setFaqState] = useState<UserContentLoadState>('idle');

  const [blogError, setBlogError] = useState<string | null>(null);
  const [faqError, setFaqError] = useState<string | null>(null);

  const loadBlogs = async () => {
    try {
      setBlogState('loading');
      setBlogError(null);

      const token = getStoredUserToken();
      const data = await obfuscatedJsonRequest<unknown>(`${USER_API_URL}/users/blogs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setBlogs(Array.isArray(data) ? data : []);
      setBlogState('success');
    } catch (error) {
      setBlogs([]);
      setBlogError(getContentErrorMessage(error, 'Unable to load blog posts right now.'));
      setBlogState('error');
    }
  };

  const loadFaqs = async () => {
    try {
      setFaqState('loading');
      setFaqError(null);

      const token = getStoredUserToken();
      const data = await obfuscatedJsonRequest<unknown>(`${USER_API_URL}/users/faqs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setFaqs(Array.isArray(data) ? data : []);
      setFaqState('success');
    } catch (error) {
      setFaqs([]);
      setFaqError(getContentErrorMessage(error, 'Unable to load FAQs right now.'));
      setFaqState('error');
    }
  };

  useEffect(() => {
    loadBlogs();
    loadFaqs();
  }, []);

  return (
    <div className="px-4 py-5 md:px-6 md:py-6 xl:px-8">
      <HelpContentSection
        blogs={blogs}
        faqs={faqs}
        blogState={blogState}
        faqState={faqState}
        blogError={blogError}
        faqError={faqError}
        contactHref={CONTACT_X_URL}
      />
    </div>
  );
}
