const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, means } = loadGame('js/games/rellena-medios.js')['rellena-medios'];
const arit = { first: 10, last: 26, k: 3, kind: 'aritmetica', chips: [13, 14, 18, 20, 22, 24] };
const geom = { first: 5, last: 405, k: 3, kind: 'geometrica', chips: [15, 25, 45, 90, 135, 225] };

test('means calcula los medios aritméticos y geométricos', () => {
  assert.equal(means(arit).join(','), '14,18,22');
  assert.equal(means(geom).join(','), '15,45,135');
});

test('aritméticos 14, 18, 22 en orden → correcto', () => {
  assert.equal(grade({ slots: [1, 2, 4] }, arit).ok, true);
});

test('aritméticos con el 13 en vez del 14 → incorrecto y la solución da d = 4', () => {
  const r = grade({ slots: [0, 2, 4] }, arit);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('d = 4'));
});

test('geométricos 15, 45, 135 → correcto; 25 (restar) → incorrecto y la solución da r = 3', () => {
  assert.equal(grade({ slots: [0, 2, 4] }, geom).ok, true);
  const r = grade({ slots: [1, 2, 4] }, geom);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('r = 3'));
});

test('un hueco vacío → incorrecto', () => {
  assert.equal(grade({ slots: [1, null, 4] }, arit).ok, false);
});
