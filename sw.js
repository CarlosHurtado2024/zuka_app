// Service worker de Zuka: permite instalar la app y usarla sin conexión.
// Archivos propios: red primero (para recibir actualizaciones) y caché si no hay conexión.
// Recursos externos (KaTeX, fuentes): caché primero.

const VERSION = 'zuka-v13';
const SHELL = [
  './', 'index.html', 'manifest.json', 'css/styles.css',
  'js/ui.js', 'js/viz.js', 'js/art.js', 'js/content.js', 'js/games/kit.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/data.js', 'js/player.js', 'js/exercises.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon-48.png',
  'brand/logo-light.png', 'brand/logo-dark.png', 'brand/mascota.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Los videos se piden por rangos (respuestas 206), que la caché no admite.
  if (req.method !== 'GET' || !req.url.startsWith('http') || req.headers.has('range')) return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;
  // YouTube maneja su propia caché; guardar su API dejaría una versión vieja.
  if (/youtube|ytimg|googlevideo|b-cdn\.net|mediadelivery\.net/.test(new URL(req.url).hostname)) return;

  if (sameOrigin) {
    e.respondWith(fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
    return;
  }

  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
