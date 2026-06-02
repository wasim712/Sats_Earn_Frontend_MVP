const fallbackSiteUrl = 'https://www.satsearn.com';

export const SITE_NAME = 'SatsEarn';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || fallbackSiteUrl;
export const ENABLE_ADSENSE_SLOTS =
  process.env.NEXT_PUBLIC_ENABLE_ADSENSE_SLOTS === 'true';
export const ADSENSE_CLIENT = 'ca-pub-1587064567124053';

export function getSiteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}
