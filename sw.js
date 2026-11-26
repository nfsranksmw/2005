/* NFSMW Ranks Progressive Web App Service Worker */
const CACHE_NAME = 'nfsmw-ranks-pwa-v1';

const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/reset-and-tokens.css',
  './assets/css/navbar-dropdowns.css',
  './assets/css/sidebar-and-grid.css?v=20261027_v11',
  './assets/css/uiverse-elements.css',
  './assets/css/community.css?v=20261027_v11',
  './assets/css/ticket-theme.css?v=20261027_v11',
  './assets/css/components.css?v=20261027_v11',
  './assets/css/nfsmwo-web.css?v=20261027_v11',
  './assets/js/firebase-config.js?v=20261027_v10',
  './assets/js/routes-data.js?v=20261027_v10',
  './assets/js/i18n.js?v=20261027_v11',
  './assets/js/ui-interactions.js?v=20261027_v11',
  './assets/js/app-cloner.js?v=20261027_v11',
  './assets/img/home-mobile-hero-bg.jpg',
  './assets/img/routes-header-banner.jpg',
  './assets/img/pwa-icon-192.png',
  './assets/img/pwa-icon-512.png',
  './assets/img/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(APP_SHELL_ASSETS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has('range') || url.pathname.endsWith('.mp4')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html').then((cached) => cached || caches.match('./')))
    );
    return;
  }

  // Network-first with cache fallback for styles/scripts so updates reflect cleanly, stale-while-revalidate for images
  const isImage = request.destination === 'image' || /\.(png|jpe?g|svg|webp|ico)$/i.test(url.pathname);
  if (isImage) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
