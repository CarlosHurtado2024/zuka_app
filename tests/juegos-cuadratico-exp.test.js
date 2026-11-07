// Juegos de las lecciones alg-4a (polinomio cuadrático) y alg-73 (ecuaciones exponenciales y
// logarítmicas): calificación (grade) y funciones puras. Spec 2026-11-07-cuadratico-y-ecuaciones-exp-log.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const cuad = G('completa-cuadrado'), para = G('mueve-parabola'), bal = G('balanza-exponencial');

test('completa-cuadrado: texOf escribe la forma completada con su resto', () => {
  assert.equal(cuad.texOf(6, 5), 'x^2 + 6x + 5 = (x + 3)^2 - 4');
  assert.equal(cuad.texOf(8, 20), 'x^2 + 8x + 20 = (x + 4)^2 + 4');
  assert.equal(cuad.texOf(2, 1), 'x^2 + 2x + 1 = (x + 1)^2');
});

test('completa-cuadrado: correcto solo si cada esquina tiene (b/2)² unidades', () => {
  const params = { rounds: [{ b: 6, c: 5 }, { b: 8, c: 20 }] };
  assert.equal(cuad.grade({ placed: [9, 16] }, params).ok, true);
  const r = cuad.grade({ placed: [9, 15] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('(x + 3)^2 - 4') && r.solution.includes('(x + 4)^2 + 4'), r.solution);
  assert.equal(cuad.grade({ placed: [9] }, params).ok, false);
});

test('completa-cuadrado: se pueden poner a lo sumo 9 cuadritos de más (no tapan la bandeja)', () => {
  assert.equal(cuad.maxFor(2), 10);
  assert.equal(cuad.maxFor(10), 30);
});

test('mueve-parabola: vértice de la forma estándar y forma canónica', () => {
  assert.equal(JSON.stringify(para.vertexOf({ a: 2, b: 8, c: 5 })), '{"h":-2,"k":-3}');
  assert.equal(JSON.stringify(para.vertexOf({ a: -1, b: 2, c: 3 })), '{"h":1,"k":4}');
  assert.equal(para.texStd({ a: -1, b: 2, c: 3 }), 'y = -x^2 + 2x + 3');
  assert.equal(para.texStd({ a: 0.5, b: -3, c: 0 }), 'y = 0.5x^2 - 3x');
  assert.equal(para.texVertex({ a: 2, h: -2, k: -3 }), 'y = 2(x + 2)^2 - 3');
});

test('mueve-parabola: correcto si a, h y k coinciden en todas las rondas', () => {
  const params = { rounds: [{ a: 1, b: -4, c: 1 }, { a: -1, b: 2, c: 3 }] };
  assert.equal(para.grade({ vals: [{ a: 1, h: 2, k: -3 }, { a: -1, h: 1, k: 4 }] }, params).ok, true);
  const r = para.grade({ vals: [{ a: 1, h: 2, k: -3 }, { a: 1, h: 1, k: 4 }] }, params);
  assert.equal(r.ok, false, 'abre hacia arriba en vez de hacia abajo');
  assert.ok(r.solution.includes('-(x - 1)^2 + 4'), r.solution);
});

test('balanza-exponencial: tilt se inclina hacia el lado mayor y es null si un lado no existe', () => {
  assert.equal(bal.tilt(729, 729), 0);
  assert.ok(bal.tilt(8, 2) > 0 && bal.tilt(-1, 2) < 0);
  assert.equal(bal.tilt(NaN, 1), null);
  assert.equal(bal.tilt(1, Infinity), null);
  assert.ok(Math.abs(bal.tilt(1e9, 1)) <= 0.4, 'el brazo no gira de más');
});

test('balanza-exponencial: correcto si cada x es la solución de su ronda', () => {
  const params = { rounds: [{ tex: '9^x = 27^{x-1}', L: x => 9 ** x, R: x => 27 ** (x - 1), x: 3 }, { tex: 'a', L: x => x, R: () => 2, x: 2 }] };
  assert.equal(bal.grade({ xs: [3, 2] }, params).ok, true);
  const r = bal.grade({ xs: [3, -1] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('x = 3') && r.solution.includes('x = 2'), r.solution);
  assert.equal(bal.grade({ xs: [3, null] }, params).ok, false);
});
