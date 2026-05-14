const CACHE_VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const STATIC_CACHE = `satsearn-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `satsearn-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';
const SAFE_BACKGROUND_REFRESH_TAG = 'satsearn-safe-content-refresh';

const STATIC_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

async function cacheThenRefresh(request) {
  const cached = await caches.match(request);

  const networkFetch = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        const copy = response.clone();
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, copy);
      }
      return response;
    })
    .catch(() => null);

  if ('sync' in self.registration) {
    self.registration.sync.register(SAFE_BACKGROUND_REFRESH_TAG).catch(() => null);
  }

  return cached || networkFetch || caches.match(OFFLINE_URL);
}

async function warmSafeRoutes() {
  const cache = await caches.open(RUNTIME_CACHE);
  const safeRoutes = ['/', '/user/blogs', '/user/help'];

  await Promise.all(
    safeRoutes.map(async (route) => {
      try {
        const response = await fetch(route, { credentials: 'same-origin' });
        if (response.ok) {
          await cache.put(route, response.clone());
        }
      } catch {
      }
    })
  );
}

self.addEventListener('sync', (event) => {
  if (event.tag === SAFE_BACKGROUND_REFRESH_TAG) {
    event.waitUntil(warmSafeRoutes());
  }
});

function isSafePageRequest(request) {
  return request.method === 'GET' && request.headers.get('accept')?.includes('text/html');
}

function isStaticAsset(requestUrl) {
  return requestUrl.pathname.startsWith('/_next/static/') ||
    requestUrl.pathname.startsWith('/fonts/') ||
    requestUrl.pathname.startsWith('/svgs/') ||
    requestUrl.pathname.endsWith('.png') ||
    requestUrl.pathname.endsWith('.svg') ||
    requestUrl.pathname.endsWith('.jpg') ||
    requestUrl.pathname.endsWith('.jpeg') ||
    requestUrl.pathname.endsWith('.webp') ||
    requestUrl.pathname.endsWith('.ico') ||
    requestUrl.pathname.endsWith('.css') ||
    requestUrl.pathname.endsWith('.js');
}

function isSafeContentRoute(pathname) {
  return pathname === '/' || pathname.startsWith('/user/blogs') || pathname.startsWith('/user/help');
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/') || url.pathname.includes('/admin/') || url.pathname.includes('/user/tasks') || url.pathname.includes('/user/wallet') || url.pathname.includes('/user/notifications')) {
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  if (isSafePageRequest(request) && isSafeContentRoute(url.pathname)) {
    event.respondWith(
      cacheThenRefresh(request)
    );
  }
});
