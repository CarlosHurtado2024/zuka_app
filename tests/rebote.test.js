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
  assert.ok(r.solution.includes('11{,}1'));
});

test('sin mover → incorrecto', () => {
  assert.equal(grade({ up: null }, params).ok, false);
});
