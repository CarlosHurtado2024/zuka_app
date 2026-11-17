// Ayudas para escribir el contenido de los cursos (js/courses/*.js y js/data.js).
// Los textos aceptan TeX entre $...$ y **negritas**. En TeX, \sen escribe "sen".
//
// Escena de clip:  sc(segundos, subtítulo, { title, steps, viz, say })
//   title: fórmula grande arriba · steps: líneas que aparecen una a una · viz: animación (ver js/viz.js)
//   Para usar un video real en lugar de la animación: clip: { video: 'videos/archivo.mp4', scenes: [] }
// Ejercicios: mc (opción múltiple), num (respuesta numérica), ord (ordenar), sld (deslizador interactivo).

// Bunny Stream: dominio de la biblioteca de videos ("CDN Hostname" en Stream → tu biblioteca → API).
// Una lección usa un video de Bunny con  clip: { bunny: '<id del video>', duration: <segundos>, … }.
// Desde el 2026-11-17 los videos se suben a la biblioteca nueva (811556, sin firma). Los que ya estaban en la
// vieja (zona con token; los firma la función video-url) quedan en BUNNY_VIEJOS y se sirven desde BUNNY_CDN_VIEJA.
// Un video nuevo NO se añade a esa lista.
const BUNNY_CDN = 'vz-1a76d229-c83.b-cdn.net';
const BUNNY_CDN_VIEJA = 'vz-2449e89f-b51.b-cdn.net';
const BUNNY_VIEJOS = new Set([
  '099c6af5-9a75-470c-bf20-7c1aa88f7268', '0d886620-5ca3-4ac0-bd9c-87a40abe9104',
  '0ef9a94d-cd4c-400e-9e07-672775506036', '11dc3023-ff97-453a-bb4b-3ce39a20d647',
  '12b7467f-eb22-4107-80f9-73b90497a18c', '154c9a1f-bfd0-4034-9efa-33c8b146512a',
  '251a81df-bada-43e9-8404-b88bf4a0346c', '280b42b6-7fdb-4fe0-a6c4-e1b0f3de9158',
  '38d0baa7-e9ef-4ce7-9328-b4d3b98a7abd', '3ef56e47-d0c4-45da-b464-5b59d09b840b',
  '5b36dd19-2ee0-47e1-a0cc-e44539a79d17', '73a333b3-2302-4d39-b3f2-b25ae6460d14',
  '8be7aaf7-3780-49a9-a74c-7b088c31682a', '9774d070-4f10-49dc-8074-b9ff5b369601',
  'a05c46b4-a0b6-4ee8-8103-b775378e43c4', 'a0e8be95-b8d7-4d9b-99ed-dc2af4c1f630',
  'c3c304fc-66d9-4eef-9693-b91e816d3fc1', 'c4c0e903-a41b-40ab-b66a-89f82a504728',
  'c4f32f4e-e22f-44da-a13c-d0332c3906c7', 'd6177a51-0618-4cd2-ad35-1a06d3167926',
  'd7dcc920-e7a7-4a4e-8120-18afe4820519', 'de65d162-7fbd-459c-ad71-64f76941ee15',
  'fd578978-f16e-45a2-b24c-cdae0c4c47ca',
]);
const bunnyHost = id => (BUNNY_VIEJOS.has(id) ? BUNNY_CDN_VIEJA : BUNNY_CDN);

const sc = (d, text, extra = {}) => ({ d, text, ...extra });
// `extra` (al final) agrega campos opcionales, como `hint`: la pista que el estudiante abre si se atasca.
const mc = (q, options, answer, explain, extra = {}) => ({ type: 'mc', q, options, answer, explain, ...extra });
const num = (q, answer, explain, extra = {}) => ({ type: 'input', q, answer, explain, ...extra });
const ord = (q, items, explain, extra = {}) => ({ type: 'order', q, items, explain, ...extra });
const sld = (q, o) => ({ type: 'slider', q, ...o });
// Minijuego de p5.js (js/games/<game>.js); params depende de cada juego.
const play = (game, q, params, explain, extra = {}) => ({ type: 'play', game, q, params, explain, ...extra });

// Videos de una lección: el principal (clip) y, si hay, sus partes siguientes (more).
const clipsOf = l => [l.clip, ...(l.more || [])];

// Orden de las tareas de una lección: { k: 'clip', n } (índice en clipsOf) y { k: 'ex', i }.
// Un video de `more` con `after: n` va justo antes del ejercicio n (o al final si n ≥ ex.length);
// los demás videos van tras el principal, en su orden.
// Gesto de la lección: se pasa del video a los ejercicios deslizando en vertical, como al hacer scroll.
// El dedo sube → 'next'; el dedo baja → 'prev' (el video anterior). En un ejercicio el gesto vertical es
// primero para desplazar el contenido: solo cuenta arriba del todo (volver) o, ya respondido, al final (seguir).
function lessonSwipe({ dx, dy, ms, clip, atTop, atBottom, answered }) {
  if (ms >= 700 || Math.abs(dy) <= 60 || Math.abs(dy) <= 1.5 * Math.abs(dx)) return null;
  if (clip) return dy < 0 ? 'next' : 'prev';
  if (dy > 0) return atTop ? 'prev' : null;
  return answered && atBottom ? 'next' : null;
}

function buildQueue(l) {
  const clips = clipsOf(l), ex = l.ex || [];
  const queue = [];
  clips.forEach((c, n) => { if (n === 0 || c.after == null) queue.push({ k: 'clip', n }); });
  const before = i => clips.forEach((c, n) => { if (n > 0 && c.after != null && Math.min(c.after, ex.length) === i) queue.push({ k: 'clip', n }); });
  ex.forEach((_, i) => { before(i); queue.push({ k: 'ex', i }); });
  before(ex.length);
  return queue;
}
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const sq = x => x * x;
