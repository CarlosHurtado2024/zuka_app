const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/la-obra.js')['la-obra'];
const params = { workers: 12, days: 30, askDays: 24, max: 40 };

test('15 obreros → correcto', () => {
  assert.equal(grade({ workers: 15 }, params).ok, true);
});

test('16 obreros → incorrecto y la solución da 15', () => {
  const r = grade({ workers: 16 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('15'));
});

test('12 obreros (sin cambios) → incorrecto', () => {
  assert.equal(grade({ workers: 12 }, params).ok, false);
});
