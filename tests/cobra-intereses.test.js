const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cobra-intereses.js')['cobra-intereses'];
const params = { capital: 1500000, rate: 0.01, target: 180000, months: 12 };

test('doce meses cobrados → 180.000 de interés → correcto', () => {
  assert.equal(grade({ paid: 12 }, params).ok, true);
});

test('once meses → incorrecto y la solución da la moneda de 15.000 y los 12 meses', () => {
  const r = grade({ paid: 11 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('15\\,000') && r.solution.includes('12'));
});

test('ningún mes cobrado → incorrecto', () => {
  assert.equal(grade({ paid: 0 }, params).ok, false);
});
