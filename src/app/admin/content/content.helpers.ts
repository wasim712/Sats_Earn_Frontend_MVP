export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const EMPTY_BLOG_HTML = '<p>Start writing your blog post...</p>';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
}
