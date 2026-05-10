const CACHE_NAME = 'shopshop134-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/style.css',
  '/script.js',
  '/auth.js',
  '/firebase-init.js',
  '/firebase.js',
  '/icon-512.png',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch events
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
