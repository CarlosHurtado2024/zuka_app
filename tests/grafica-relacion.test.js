const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/grafica-relacion.js')['grafica-relacion'];
const directa = { kind: 'directa', k: 1.5, given: [[2, 3]], xs: [4, 6, 8], tol: 0.25, xmax: 10, ymax: 14 };
const inversa = { kind: 'inversa', k: 12, given: [[2, 6]], xs: [3, 4, 6], tol: 0.25, xmax: 8, ymax: 8 };

test('directa con ys = [6, 9, 12] → correcto', () => {
  assert.equal(grade({ ys: [6, 9, 12] }, directa).ok, true);
});

test('inversa con ys = [4, 3, 2] → correcto', () => {
  assert.equal(grade({ ys: [4, 3, 2] }, inversa).ok, true);
});

test('un valor a 0.3 del correcto → incorrecto', () => {
  assert.equal(grade({ ys: [6, 9.3, 12] }, directa).ok, false);
});

test('un punto sin colocar → incorrecto', () => {
  assert.equal(grade({ ys: [6, null, 12] }, directa).ok, false);
});
