// Service worker de Zuka: permite instalar la app y usarla sin conexión.
// Archivos propios: red primero (para recibir actualizaciones) y caché si no hay conexión.
// Recursos externos (KaTeX, fuentes): caché primero.

const VERSION = 'zuka-v38';
const SHELL = [
  './', 'index.html', 'manifest.json', 'css/styles.css',
  'js/ui.js', 'js/viz.js', 'js/art.js', 'js/content.js', 'js/games/kit.js', 'js/games/cajas-numericas.js', 'js/games/verdadero-falso.js', 'js/games/ubica-en-recta.js', 'js/games/pizzeria.js', 'js/games/ascensor.js', 'js/games/pasaporte-numeros.js', 'js/games/pon-la-rayita.js', 'js/games/acorrala-raiz.js', 'js/games/reglas-del-juego.js', 'js/games/dibuja-intervalo.js', 'js/games/distancia-justa.js', 'js/games/atajo-axiomas.js', 'js/games/arma-producto.js', 'js/games/dobla-la-recta.js', 'js/games/rueda-angulo.js', 'js/games/corta-pizza.js', 'js/games/arma-triangulo.js', 'js/games/mide-altura.js', 'js/games/atrapa-punto.js', 'js/games/noria.js', 'js/games/sintoniza-onda.js', 'js/games/limonada.js', 'js/games/balanza-proporcion.js', 'js/games/directa-inversa.js', 'js/games/grafica-relacion.js', 'js/games/reparto.js', 'js/games/cuadrado-media.js', 'js/games/arma-regla.js', 'js/games/bascula.js', 'js/games/la-obra.js', 'js/games/cadena-razones.js', 'js/games/cuadricula-cien.js', 'js/games/cruz-porcentaje.js', 'js/games/mezcla.js', 'js/games/rueda-porcentaje.js', 'js/games/bodegas.js', 'js/games/cascada.js', 'js/games/rebote.js', 'js/games/dos-etapas.js', 'js/games/carrera-interes.js', 'js/games/une-factor.js', 'js/games/etiqueta-rebaja.js', 'js/games/mejor-oferta.js', 'js/games/clasifica-cartas.js', 'js/games/cobra-intereses.js', 'js/games/ajusta-capital.js', 'js/games/escalera-aritmetica.js', 'js/games/parejas-gauss.js', 'js/games/rellena-medios.js', 'js/games/suma-filas.js', 'js/games/limite-serie.js', 'js/games/torre-producto.js', 'js/games/arma-sigma.js', 'js/games/ordena-terminos.js', 'js/games/voltea-desigualdad.js', 'js/games/une-parejas.js', 'js/games/lado-del-cuadrado.js', 'js/games/saca-del-radical.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/data.js', 'js/player.js', 'js/exercises.js', 'js/update.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon-48.png',
  'brand/logo-light.png', 'brand/logo-dark.png', 'brand/mascota.png',
];

// p5.js (minijuegos) se precachea aparte: si el CDN falla no bloquea la instalación.
const P5_URL = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL).then(() => c.add(P5_URL).catch(() => {}))));
});

// La versión nueva espera a que el usuario acepte el aviso en la app (js/update.js).
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
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
