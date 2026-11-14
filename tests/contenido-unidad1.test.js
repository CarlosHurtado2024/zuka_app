// Ejercicios de la unidad 1 de Álgebra (Clases 7 a 11): respuestas correctas, índices válidos y
// sin repetir los ejemplos resueltos en los videos (regla del spec 2026-11-07-unidad-1-libro-videos).
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
const alg = get(ctx, 'COURSE_ALGEBRA');
// Lecciones de la antigua unidad 1 (Clases 7 a 11), ahora repartidas en las unidades 1 y 2.
const UNIDAD1 = ['alg-11', 'alg-12b', 'alg-21a', 'alg-21b', 'alg-22a', 'alg-22b'];
const lesson = id => alg.units.flatMap(u => u.lessons).find(l => l.id === id);
const plays = (l, game) => l.ex.filter(e => e.type === 'play' && e.game === game);
const frac = s => { const m = /\\[td]frac\{?(\d+)\}?\{?(\d+)\}?/.exec(s) || /\\[td]frac(\d)(\d)/.exec(s); return m ? +m[1] / +m[2] : +s.replace(/\$/g, ''); };

test('une-parejas y ordena-terminos: índices válidos y etiquetas sin repetir', () => {
  const lista = alg.units.flatMap(u => u.lessons).filter(l => UNIDAD1.includes(l.id));
  assert.equal(lista.length, UNIDAD1.length);
  for (const l of lista) {
    for (const e of plays(l, 'une-parejas')) {
      const { left, right, pairs } = e.params;
      assert.equal(pairs.length, left.length, l.id);
      assert.equal(new Set(right).size, right.length, `${l.id}: etiquetas repetidas a la derecha`);
      for (const [i, j] of pairs) assert.ok(left[i] !== undefined && right[j] !== undefined, `${l.id}: pareja [${i}, ${j}]`);
      assert.equal(new Set(pairs.map(p => p[1])).size, pairs.length, `${l.id}: dos expresiones con la misma pareja`);
    }
    for (const e of plays(l, 'ordena-terminos')) {
      const { chips, order } = e.params;
      assert.equal(new Set(chips).size, chips.length, `${l.id}: fichas repetidas`);
      for (const j of order) assert.ok(chips[j] !== undefined, `${l.id}: orden ${j}`);
    }
  }
});

test('alg-21b: ninguna expresión se repite entre ejercicios', () => {
  const l = lesson('alg-21b');
  const text = JSON.stringify(l.ex);
  assert.ok(text.split('(3x^{-2}y^3)^{-2}').length <= 3, 'la expresión de ordena-terminos no se repite en otro ejercicio');
  const parejas = plays(l, 'une-parejas')[0].params.left;
  assert.ok(!parejas.includes('x³ · x⁵') && !parejas.includes('(x²)³'), 'parejas repetidas con los mc');
});

test('los ejercicios no repiten los ejemplos resueltos en los videos', () => {
  const video = {
    // Video A1 (video/clase_alg_u1_numeros, spec 2026-11-09): 7/4, 13/20, 2/7, 7/12, 0.8181… = 9/11, 7/5, 17/12, 4 − 9.
    'alg-21b': ['(x^{-3}y^2)^{-4}', '(x^2)^3', '(x^{2})^3'],
    'alg-22a': ['8^{2/3}', '\\sqrt[3]{-27}', '16^(3/4)', '25^(−1/2)', '"area":49', '"area":2}', '"area":20.25'],
    'alg-22b': ['\\sqrt{72}', '\\sqrt{50}', '\\sqrt{18}', '4 + \\sqrt5', '3\\sqrt2}', '2x + 3', '\\dfrac{1}{\\sqrt3}', '"n":72', '"n":45', '"n":54'],
  };
  for (const [id, bad] of Object.entries(video)) {
    const text = JSON.stringify(lesson(id).ex).replace(/\\\\/g, '\\');
    for (const b of bad) assert.ok(!text.includes(b), `${id}: «${b}» sale en el video`);
  }
});

test('alg-11 se queda con los sistemas numericos: sus juegos de orden y valor absoluto viven en alg-12b', () => {
  const games = l => l.ex.filter(e => e.type === 'play').map(e => e.game);
  const a11 = [...games(lesson('alg-11')), ...games(lesson('alg-11b')), ...games(lesson('alg-11c'))], a12 = ['alg-12b', 'alg-12c', 'alg-12d'].flatMap(id => games(lesson(id)));
  for (const g of ['reglas-del-juego', 'dibuja-intervalo', 'distancia-justa']) assert.ok(!a11.includes(g), `alg-11 todavia tiene ${g}`);
  for (const g of ['dibuja-intervalo', 'distancia-justa']) assert.ok(a12.includes(g), `alg-12b/12c/12d no tiene ${g}`);
  for (const g of ['cajas-numericas', 'ubica-en-recta', 'pizzeria', 'compas-raiz', 'ordena-terminos', 'candado-fraccion', 'lupa-densidad', 'fuga-de-familia']) assert.ok(a11.includes(g), `alg-11/11b/11c sin ${g}`);
});
