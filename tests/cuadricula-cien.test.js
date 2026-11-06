const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cuadricula-cien.js')['cuadricula-cien'];
const params = { rounds: [{ ask: '35 %', count: 35 }, { ask: '3/4', count: 75 }, { ask: '0,08', count: 8 }] };

test('35, 75 y 8 casillas → correcto', () => {
  assert.equal(grade({ counts: [35, 75, 8] }, params).ok, true);
});

test('9 casillas en la tercera ronda → incorrecto y la solución da 8', () => {
  const r = grade({ counts: [35, 75, 9] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('8'));
});

test('sin pintar → incorrecto', () => {
  assert.equal(grade({ counts: [null, null, null] }, params).ok, false);
});
