// Ayudas para escribir el contenido de los cursos (js/courses/*.js y js/data.js).
// Los textos aceptan TeX entre $...$ y **negritas**. En TeX, \sen escribe "sen".
//
// Escena de clip:  sc(segundos, subtítulo, { title, steps, viz, say })
//   title: fórmula grande arriba · steps: líneas que aparecen una a una · viz: animación (ver js/viz.js)
//   Para usar un video real en lugar de la animación: clip: { video: 'videos/archivo.mp4', scenes: [] }
// Ejercicios: mc (opción múltiple), num (respuesta numérica), ord (ordenar), sld (deslizador interactivo).

// Bunny Stream: dominio de la biblioteca de videos ("CDN Hostname" en Stream → tu biblioteca → API).
// Una lección usa un video de Bunny con  clip: { bunny: '<id del video>', duration: <segundos>, … }.
const BUNNY_CDN = 'vz-2449e89f-b51.b-cdn.net';

const sc = (d, text, extra = {}) => ({ d, text, ...extra });
const mc = (q, options, answer, explain) => ({ type: 'mc', q, options, answer, explain });
const num = (q, answer, explain, extra = {}) => ({ type: 'input', q, answer, explain, ...extra });
const ord = (q, items, explain) => ({ type: 'order', q, items, explain });
const sld = (q, o) => ({ type: 'slider', q, ...o });
// Minijuego de p5.js (js/games/<game>.js); params depende de cada juego.
const play = (game, q, params, explain) => ({ type: 'play', game, q, params, explain });
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const sq = x => x * x;
