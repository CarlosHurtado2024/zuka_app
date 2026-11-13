// Service worker de Zuka: permite instalar la app y usarla sin conexión.
// Archivos propios: red primero (para recibir actualizaciones) y caché si no hay conexión.
// Recursos externos (KaTeX, fuentes): caché primero.

const VERSION = 'zuka-v111';
const SHELL = [
  './', 'index.html', 'manifest.json', 'css/styles.css',
  'js/ui.js', 'js/viz.js', 'js/art.js', 'js/worlds.js', 'js/content.js', 'js/curiosidades.js', 'js/vendor/anime.min.js', 'js/games/kit.js', 'js/games/cajas-numericas.js', 'js/games/verdadero-falso.js', 'js/games/ubica-en-recta.js', 'js/games/pizzeria.js', 'js/games/ascensor.js', 'js/games/pasaporte-numeros.js', 'js/games/pon-la-rayita.js', 'js/games/acorrala-raiz.js', 'js/games/reglas-del-juego.js', 'js/games/dibuja-intervalo.js', 'js/games/distancia-justa.js', 'js/games/atajo-axiomas.js', 'js/games/arma-producto.js', 'js/games/dobla-la-recta.js', 'js/games/rueda-angulo.js', 'js/games/corta-pizza.js', 'js/games/arma-triangulo.js', 'js/games/mide-altura.js', 'js/games/atrapa-punto.js', 'js/games/noria.js', 'js/games/sintoniza-onda.js', 'js/games/canon-inverso.js', 'js/games/tanque-pitagorico.js', 'js/games/detector-identidades.js', 'js/games/encadena-angulos.js', 'js/games/corredores-dobles.js', 'js/games/pesca-raices.js', 'js/games/compas-ambiguo.js', 'js/games/brazo-robot.js', 'js/games/mapa-tesoro.js', 'js/games/telarana-polar.js', 'js/games/espiral-potencias.js', 'js/games/flor-de-raices.js', 'js/games/limonada.js', 'js/games/balanza-proporcion.js', 'js/games/directa-inversa.js', 'js/games/grafica-relacion.js', 'js/games/reparto.js', 'js/games/cuadrado-media.js', 'js/games/arma-regla.js', 'js/games/bascula.js', 'js/games/la-obra.js', 'js/games/cadena-razones.js', 'js/games/cuadricula-cien.js', 'js/games/cruz-porcentaje.js', 'js/games/mezcla.js', 'js/games/rueda-porcentaje.js', 'js/games/bodegas.js', 'js/games/cascada.js', 'js/games/rebote.js', 'js/games/dos-etapas.js', 'js/games/carrera-interes.js', 'js/games/une-factor.js', 'js/games/etiqueta-rebaja.js', 'js/games/mejor-oferta.js', 'js/games/clasifica-cartas.js', 'js/games/cobra-intereses.js', 'js/games/ajusta-capital.js', 'js/games/escalera-aritmetica.js', 'js/games/parejas-gauss.js', 'js/games/rellena-medios.js', 'js/games/suma-filas.js', 'js/games/limite-serie.js', 'js/games/torre-producto.js', 'js/games/arma-sigma.js', 'js/games/ordena-terminos.js', 'js/games/voltea-desigualdad.js', 'js/games/une-parejas.js', 'js/games/lado-del-cuadrado.js', 'js/games/saca-del-radical.js', 'js/games/completa-cuadrado.js', 'js/games/mueve-parabola.js', 'js/games/balanza-exponencial.js', 'js/games/semaforo-signos.js', 'js/games/sombra-equivalente.js', 'js/games/correa-del-perro.js', 'js/games/candado-absoluto.js', 'js/games/tirolesa.js', 'js/games/balancin.js', 'js/games/cuerdas-iguales.js', 'js/games/laser-recta.js', 'js/games/rieles-paralelos.js', 'js/games/proyector-sombras.js', 'js/games/completa-simetria.js', 'js/games/raices-imanes.js', 'js/games/cruz-asintotas.js', 'js/games/apila-alturas.js', 'js/games/tuberia-maquinas.js', 'js/games/arma-tramos.js', 'js/games/dobla-negativos.js', 'js/games/sellos-graficas.js', 'js/games/espejo-diagonal.js', 'js/games/cofre-candados.js', 'js/games/fuga-de-familia.js', 'js/games/candado-fraccion.js', 'js/games/compas-raiz.js', 'js/games/lupa-densidad.js', 'js/games/duplica-magnitud.js', 'js/games/engranajes.js', 'js/games/estira-barra.js', 'js/games/tragamonedas.js', 'js/games/cadena-cambios.js', 'js/games/crece-planta.js', 'js/games/alcancias-gemelas.js', 'js/games/atrapa-elementos.js', 'js/games/mueve-circulos.js', 'js/games/fabrica-subconjuntos.js', 'js/games/reparte-venn.js', 'js/games/pinta-venn.js', 'js/games/encuesta-venn.js', 'js/games/lluvia-elementos.js', 'js/games/revienta-globos.js', 'js/games/luciernagas-venn.js', 'js/games/buzo-enteros.js', 'js/games/carrera-fracciones.js', 'js/games/frena-aguja.js', 'js/games/dispara-inverso.js', 'js/games/salta-signos.js', 'js/games/serpiente-orden.js', 'js/games/sirve-la-razon.js', 'js/games/corta-proporciones.js', 'js/games/resortera-tres.js', 'js/games/caja-veloz.js', 'js/games/vuela-precios.js', 'js/games/rompe-cambios.js', 'js/games/traza-progresion.js', 'js/games/encesta-suma.js', 'js/games/dobla-fichas.js', 'js/games/rana-zenon.js', 'js/games/maquina-sigma.js', 'js/games/jefe-venn.js', 'js/games/arma-notacion.js', 'js/games/cumple-notacion.js', 'js/games/tacha-repetidos.js', 'js/games/recta-espejo.js', 'js/games/inversos-gemelos.js', 'js/games/corta-rectangulo.js', 'js/games/cancela-balanza.js', 'js/games/tren-ordenado.js', 'js/games/bolsa-razon.js', 'js/games/estira-foto.js', 'js/games/sombra-arbol.js', 'js/games/pisa-huellas.js', 'js/games/dos-escaleras.js', 'js/games/rebota-pelota.js', 'js/games/pinta-personas.js', 'js/games/porcentaje-cambio.js', 'js/games/arma-conjunto.js', 'js/games/fila-a-fila.js', 'js/games/afina-sistema.js', 'js/games/combina-vectores.js', 'js/games/flecha-vector.js', 'js/games/conica-viva.js', 'js/games/laberinto-valor.js', 'js/games/domino-equivalencias.js', 'js/games/piramide-numerica.js', 'js/games/detective-pasos.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/data.js', 'js/player.js', 'js/exercises.js', 'js/exam.js', 'js/update.js', 'js/pwa.js', 'js/back.js', 'js/tour.js', 'js/tutorias.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-48.png',
  'brand/logo-light.png', 'brand/logo-dark.png', 'brand/mascota.png',
];

// Librerías de CDN (minijuegos, fórmulas, reproductor) se precachean aparte: si el CDN falla no
// bloquean la instalación. Sin esto la primera visita no las guarda (el SW aún no controla la página).
const P5_URL = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js';
const CDN = [
  P5_URL,
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js',
  // Fuentes que katex.min.css pide para casi toda fórmula.
  ...['Main-Regular', 'Main-Bold', 'Main-Italic', 'Math-Italic', 'AMS-Regular', 'Size1-Regular', 'Size2-Regular']
    .map(f => `https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_${f}.woff2`),
];
// Con red lenta, al abrir la app no se espera más que esto si hay una copia guardada (la red sigue
// actualizando la copia por detrás). Solo para navegaciones: ver fromCache.
const NET_TIMEOUT = 3000;
// Un CDN que no contesta no debe retener la instalación (ni el aviso de versión nueva).
const CDN_TIMEOUT = 8000;
const wait = ms => new Promise(r => setTimeout(r, ms));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL).then(() => Promise.all(CDN.map(u =>
      Promise.race([c.add(u), wait(CDN_TIMEOUT)]).catch(() => {}))))));
});

// Páginas que se abrieron desde la caché (por red lenta): sus scripts también salen de la caché,
// para no mezclar un index.html viejo con scripts nuevos (o al revés).
const fromCache = new Set();

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
  // Los videos propios pesan varios MB: se sirven de la red y nunca se guardan.
  if (sameOrigin && /\/media\//.test(new URL(req.url).pathname)) return;
  // YouTube maneja su propia caché; guardar su API dejaría una versión vieja.
  if (/youtube|ytimg|googlevideo|b-cdn\.net|mediadelivery\.net/.test(new URL(req.url).hostname)) return;

  if (sameOrigin) {
    const navigate = req.mode === 'navigate';
    const cached = () => caches.match(req, { ignoreSearch: true })
      .then(hit => hit || (navigate ? caches.match('index.html') : null));
    // Página abierta desde la caché: todo lo suyo también (red solo si falta la copia).
    if (!navigate && e.clientId && fromCache.has(e.clientId)) {
      e.respondWith(cached().then(hit => hit || fetch(req)).catch(() => Response.error()));
      return;
    }
    // Red primero (para recibir lo nuevo). Un error del servidor (404/500) cede a la copia buena.
    const net = fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    });
    const fromNet = net.then(
      res => (res.ok || res.type === 'opaqueredirect' ? res : cached().then(hit => hit || res)),
      () => cached().then(hit => hit || Response.error()));
    e.waitUntil(net.catch(() => {}));
    if (!navigate) { e.respondWith(fromNet); return; }
    // Al abrir la app con red lenta: si la red tarda más de NET_TIMEOUT y hay copia, la copia.
    e.respondWith(new Promise(resolve => {
      let done = false;
      const finish = r => { if (!done && r) { done = true; resolve(r); } };
      const timer = setTimeout(() => cached().then(hit => {
        if (hit && !done && e.resultingClientId) fromCache.add(e.resultingClientId);
        finish(hit);
      }), NET_TIMEOUT);
      fromNet.then(res => { clearTimeout(timer); finish(res); });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
