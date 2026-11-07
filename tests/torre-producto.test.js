const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, valueAt } = loadGame('js/games/torre-producto.js')['torre-producto'];
const bacterias = { kind: 'ratio', start: 50, r: 2, target: 6400, max: 10, unit: 'bacterias', period: 'hora' };
const factorial = { kind: 'factorial', target: 5040, max: 9, unit: '', period: 'paso' };

test('valueAt: razón fija y factorial', () => {
  assert.equal(valueAt(0, bacterias), 50);
  assert.equal(valueAt(7, bacterias), 6400);
  assert.equal(valueAt(0, factorial), 1);
  assert.equal(valueAt(7, factorial), 5040);
});

test('7 horas → 6.400 bacterias → correcto; 6 → incorrecto y la solución da 7', () => {
  assert.equal(grade({ n: 7 }, bacterias).ok, true);
  const r = grade({ n: 6 }, bacterias);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('7'));
});

test('7! = 5040 → correcto; 8 → incorrecto', () => {
  assert.equal(grade({ n: 7 }, factorial).ok, true);
  assert.equal(grade({ n: 8 }, factorial).ok, false);
});

test('sin pasos → incorrecto', () => {
  assert.equal(grade({ n: 0 }, bacterias).ok, false);
});

test('la solución escribe los miles con separador TeX, no con punto', () => {
  assert.ok(grade({ n: 1 }, bacterias).solution.includes('6\\,400'));
  assert.ok(grade({ n: 1 }, factorial).solution.includes('5\\,040'));
});
