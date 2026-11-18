const CACHE = 'wassertracker-v7-reminders-171-20261118';
const ASSETS = ['./', './index.html', './style.css?v=1.7', './app.js?v=1.7.1', './manifest.webmanifest', './icon.svg?v=1.6', './icon-192.png?v=1.6', './icon-512.png?v=1.6', './apple-touch-icon-1.5.4.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
 // Nur eigene App-Caches löschen; lokale Trinkdaten und Anmeldung bleiben unangetastet.
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('wassertracker-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
 event.respondWith((async () => {
  const cache = await caches.open(CACHE);
  try {
   const response = await fetch(event.request);
   if (response.ok && ASSETS.some(asset => new URL(asset, self.registration.scope).href === event.request.url)) await cache.put(event.request, response.clone());
   return response;
  } catch {
   return await cache.match(event.request) || (event.request.mode === 'navigate' ? await cache.match('./index.html') : null) || Response.error();
  }
 })());
});
self.addEventListener('push', event => {
 let payload = {};
 try { payload = event.data ? event.data.json() : {}; } catch { /* Unbekannte Nutzlast: Standarderinnerung anzeigen. */ }
 if (!payload || typeof payload !== 'object') payload = {};
 event.waitUntil(self.registration.showNotification(typeof payload.title === 'string' ? payload.title : 'WasserTracker', {
  body: typeof payload.body === 'string' ? payload.body : 'Zeit für deinen Trink-Check. Hast du genug getrunken?',
  icon: new URL('./icon-192.png?v=1.6', self.registration.scope).href,
  badge: new URL('./icon-192.png?v=1.6', self.registration.scope).href,
  tag: 'wassertracker-reminder',
  data: { url: self.registration.scope }
 }));
});
self.addEventListener('notificationclick', event => {
 event.notification.close();
 event.waitUntil((async () => {
  const windows = await self.clients.matchAll({type:'window', includeUncontrolled:true});
  const existing = windows.find(client => client.url.startsWith(self.registration.scope));
  if (existing) return existing.focus();
  return self.clients.openWindow(self.registration.scope);
 })());
});
