const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/une-factor.js')['une-factor'];
const params = { changes: [25, -25, 100, -5, 0.5], factors: [1.25, 0.75, 2, 0.95, 1.005, 1.5] };

test('cada cambio unido a su factor → correcto', () => {
  assert.equal(grade({ links: [0, 1, 2, 3, 4] }, params).ok, true);
});

test('−25 % unido a ×1.5 → incorrecto y la solución muestra ×0.75', () => {
  const r = grade({ links: [0, 5, 2, 3, 4] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('0.75'));
});

test('un cambio sin unir → incorrecto', () => {
  assert.equal(grade({ links: [0, 1, 2, 3, null] }, params).ok, false);
});

test('+0.5 % unido a ×1.5 (confundir 0.5 con 50) → incorrecto', () => {
  assert.equal(grade({ links: [0, 1, 2, 3, 5] }, params).ok, false);
});

test('la solución lista todos los pares con punto decimal', () => {
  const s = grade({ links: [null, null, null, null, null] }, params).solution;
  assert.ok(s.includes('+25 %') && s.includes('1.005') && !/\d,\d/.test(s));
});
