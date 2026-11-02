// Ayudas para escribir el contenido de los cursos (js/courses/*.js y js/data.js).
// Los textos aceptan TeX entre $...$ y **negritas**. En TeX, \sen escribe "sen".
//
// Escena de clip:  sc(segundos, subtítulo, { title, steps, viz, say })
//   title: fórmula grande arriba · steps: líneas que aparecen una a una · viz: animación (ver js/viz.js)
//   Para usar un video real en lugar de la animación: clip: { video: 'videos/archivo.mp4', scenes: [] }
// Ejercicios: mc (opción múltiple), num (respuesta numérica), ord (ordenar), sld (deslizador interactivo).

const sc = (d, text, extra = {}) => ({ d, text, ...extra });
const mc = (q, options, answer, explain) => ({ type: 'mc', q, options, answer, explain });
const num = (q, answer, explain, extra = {}) => ({ type: 'input', q, answer, explain, ...extra });
const ord = (q, items, explain) => ({ type: 'order', q, items, explain });
const sld = (q, o) => ({ type: 'slider', q, ...o });
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const sq = x => x * x;
