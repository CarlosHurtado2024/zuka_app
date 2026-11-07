const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, primes, simplify } = loadGame('js/games/saca-del-radical.js')['saca-del-radical'];
const params = { rounds: [{ index: 2, n: 72 }, { index: 2, n: 45 }, { index: 3, n: 54 }] };

test('primes descompone y simplify da coeficiente y radicando', () => {
  assert.equal(primes(72).join('·'), '2·2·2·3·3');
  assert.equal(JSON.stringify(simplify(2, 72)), JSON.stringify({ out: 6, in: 2 }));
  assert.equal(JSON.stringify(simplify(3, 54)), JSON.stringify({ out: 3, in: 2 }));
  assert.equal(JSON.stringify(simplify(2, 45)), JSON.stringify({ out: 3, in: 5 }));
});

test('6√2, 3√5 y 3∛2 → correcto (el estado guarda los primos sacados y los que quedan)', () => {
  const st = { rounds: [{ out: [2, 3], in: [2] }, { out: [3], in: [5] }, { out: [3], in: [2] }] };
  assert.equal(grade(st, params).ok, true);
});

test('sacar solo un par de √72 (2√18) → incorrecto y la solución da 6√2', () => {
  const st = { rounds: [{ out: [2], in: [2, 3, 3] }, { out: [3], in: [5] }, { out: [3], in: [2] }] };
  const r = grade(st, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('6\\sqrt{2}'));
});

test('el orden de los primos no importa', () => {
  const st = { rounds: [{ out: [3, 2], in: [2] }, { out: [3], in: [5] }, { out: [3], in: [2] }] };
  assert.equal(grade(st, params).ok, true);
});
