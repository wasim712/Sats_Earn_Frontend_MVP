import React from 'react';

export type BlogPost = {
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

export type EditorButton = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};
