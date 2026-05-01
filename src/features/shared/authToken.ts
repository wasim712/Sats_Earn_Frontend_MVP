export function getStoredAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
}
