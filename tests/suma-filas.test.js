const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, total } = loadGame('js/games/suma-filas.js')['suma-filas'];
const teatro = { first: 8, d: 2, target: 170, max: 14, item: 'sillas' };
const piramide = { first: 1, d: 1, target: 78, max: 15, item: 'puntos' };

test('total suma la progresión de las filas', () => {
  assert.equal(total(10, teatro), 170);
  assert.equal(total(12, piramide), 78);
  assert.equal(total(0, teatro), 0);
});

test('10 filas de teatro → 170 sillas → correcto', () => {
  assert.equal(grade({ rows: 10 }, teatro).ok, true);
});

test('9 filas → incorrecto y la solución da 10 filas', () => {
  const r = grade({ rows: 9 }, teatro);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('10'));
});

test('12 filas de pirámide → 78 → correcto; 13 → incorrecto', () => {
  assert.equal(grade({ rows: 12 }, piramide).ok, true);
  assert.equal(grade({ rows: 13 }, piramide).ok, false);
});

test('sin filas → incorrecto', () => {
  assert.equal(grade({ rows: 0 }, teatro).ok, false);
});
