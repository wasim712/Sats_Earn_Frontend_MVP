export type UserBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
};

export type UserFaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

export type UserContentLoadState = 'idle' | 'loading' | 'success' | 'error';
