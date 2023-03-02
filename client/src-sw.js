const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

const assetCache = new CacheFirst({
  cacheName: 'asset-cache',
  plugins: [
  new CacheableResponsePlugin({
    statuses: [0, 200],
  }),
  new ExpirationPlugin({
    maxAgeSeconds: 7 * 24 * 60 * 60,
  }),
  ],
  });

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);
registerRoute(({ request }) => request.destination === 'style' || request.destination === "script" || request.destination === "image", assetCache);

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
  });

registerRoute();
