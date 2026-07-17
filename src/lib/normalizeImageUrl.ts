const DRIVE_FILE_ID_PATTERNS = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/];

function extractDriveFileId(url: string): string | null {
  for (const pattern of DRIVE_FILE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Google Drive "view"/"open" links serve an HTML viewer page, not raw image
 * bytes, so they render as a broken image when used as an <img>/<Image> src
 * (they still open fine in a new tab because that loads the viewer page).
 * Rewrite them to Google's direct-content host, which is already allow-listed
 * in next.config's image remotePatterns.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const isDriveUrl = /^https?:\/\/(drive|docs)\.google\.com\//i.test(trimmed);
  if (!isDriveUrl) return trimmed;

  const fileId = extractDriveFileId(trimmed);
  if (!fileId) return trimmed;

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}
