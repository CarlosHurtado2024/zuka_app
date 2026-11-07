const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, apply } = loadGame('js/games/voltea-desigualdad.js')['voltea-desigualdad'];
const params = { a: -1, b: 2, steps: [{ op: '+', k: 3 }, { op: '×', k: 2 }, { op: '×', k: -1 }, { op: '+', k: -4 }] };

test('apply mueve los dos puntos y dice el signo correcto en cada paso', () => {
  const s = apply(params);
  assert.equal(s.map(x => x.a + ',' + x.b + ',' + x.sign).join(' | '), '2,5,< | 4,10,< | -4,-10,> | -8,-14,>');
});

test('los cuatro signos bien → correcto', () => {
  assert.equal(grade({ signs: ['<', '<', '>', '>'] }, params).ok, true);
});

test('no voltear al multiplicar por −1 → incorrecto y la solución lo explica', () => {
  const r = grade({ signs: ['<', '<', '<', '<'] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('-1'));
});

test('un paso sin responder → incorrecto', () => {
  assert.equal(grade({ signs: ['<', '<', '>', null] }, params).ok, false);
});
