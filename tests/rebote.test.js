const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/rebote.js')['rebote'];
const params = { base: 100, drop: 10, max: 30, step: 0.1, tol: 0.06 };

test('11,1 % → correcto', () => {
  assert.equal(grade({ up: 11.1 }, params).ok, true);
});

test('11,0 % → incorrecto', () => {
  assert.equal(grade({ up: 11.0 }, params).ok, false);
});

test('11,2 % → incorrecto', () => {
  assert.equal(grade({ up: 11.2 }, params).ok, false);
});

test('10 % → incorrecto y la solución da 11,1', () => {
  const r = grade({ up: 10 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('11.1'));
});

test('sin mover → incorrecto', () => {
  assert.equal(grade({ up: null }, params).ok, false);
});

// Botones ±0,1: la manija sola no garantiza caer en 11,1 con coordenadas táctiles enteras
// (0,83 px por paso), así que el valor también se ajusta por pasos exactos.
const { stepUp } = loadGame('js/games/rebote.js')['rebote'];

test('stepUp suma pasos exactos de 0,1 y respeta los límites', () => {
  assert.equal(stepUp(11.0, 1, params), 11.1);
  assert.equal(stepUp(11.1, -1, params), 11.0);
  assert.equal(stepUp(0, -1, params), 0);
  assert.equal(stepUp(30, 1, params), 30);
  assert.equal(stepUp(null, 1, params), 0.1);
});

test('la solución usa punto decimal, como el resto del contenido de la app', () => {
  assert.ok(grade({ up: 10 }, params).solution.includes('11.1'));
  assert.ok(!grade({ up: 10 }, params).solution.includes('{,}'));
});
