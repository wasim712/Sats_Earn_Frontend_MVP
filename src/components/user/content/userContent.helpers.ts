export const USER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getReadTime(content: string) {
  const words = stripHtml(content).split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatContentDate(value?: string | null) {
  if (!value) return 'Draft';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unscheduled';
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getContentErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

export function getStoredUserToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
}
