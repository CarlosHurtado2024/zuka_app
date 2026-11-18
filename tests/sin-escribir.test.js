// Sin escribir (spec 2026-11-17-sin-escribir): ningún ejercicio pide teclear; cada uno se cambió por «Arma la cuenta»
// o «Escala la solución».
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js/.test(f));
const transition = all.filter(f => !/courses\/algebra-(taller|revision)\.js$/.test(f));
const before = loadScripts(transition.filter(f => !/sin-escribir/.test(f)));
const converted = loadScripts(transition);
const ctx = loadScripts(all);
const GAMES = get(ctx, 'GAMES'), TABLE = get(ctx, 'SIN_ESCRIBIR'), cuenta = GAMES['arma-la-cuenta'], escala = GAMES['escala-solucion'];
const walk = c => get(c, 'COURSES').flatMap(co => (co.units || []).flatMap(u => [
  ...(u.lessons || []).flatMap(l => l.ex.map((ex, i) => ({ key: `${l.id}#${i}`, ex }))),
  ...((u.exam?.items || []).map((it, i) => ({ key: `exam-${u.world}#${i}`, ex: it.ex }))),
]));

test('en la app no queda ningún ejercicio de escribir, en ningún curso', () => {
  const now = walk(ctx), old = walk(before).filter(e => e.ex.type === 'input');
  assert.ok(old.length >= 130, 'había muchos ejercicios de escribir');
  assert.equal(now.filter(e => e.ex.type === 'input').map(e => e.key).join(), '');
  assert.equal(Object.keys(TABLE).filter(k => !old.some(e => e.key === k)).join(), '', 'no sobran fichas en la tabla');
  // El cambio conserva enunciado, explicación y pista.
  for (const o of old) {
    const n = walk(converted).find(e => e.key === o.key).ex;
    assert.equal(n.type, 'play'); assert.ok(GAMES[n.game], o.key);
    assert.equal(n.q, o.ex.q); assert.equal(n.explain, o.ex.explain); assert.equal(n.hint, o.ex.hint);
  }
});

test('Arma la cuenta: la cuenta de cada ficha da la respuesta del ejercicio y cabe en la pantalla', () => {
  for (const { key, ex } of walk(ctx).filter(e => e.ex.game === 'arma-la-cuenta')) {
    const r = ex.params.rounds[0], keys = cuenta.keysOf(r), nums = cuenta.numbersOf(r);
    const state = { rounds: [{ seq: r.sol.map(t => keys.indexOf(t)) }] };
    assert.ok(state.rounds[0].seq.every(i => i >= 0), `${key}: fichas de la solución`);
    assert.equal(cuenta.grade(state, ex.params).ok, true, `${key}: ${r.sol.join(' ')} no da ${r.answer}`);
    assert.equal(cuenta.grade({ rounds: [{ seq: [] }] }, ex.params).ok, false);
    assert.ok(nums.length >= 2 && nums.length <= 8, `${key}: ${nums.length} fichas de número`);
    assert.ok(r.sol.length <= 15, `${key}: cuenta de ${r.sol.length} fichas`);
    for (const t of nums) assert.ok(Number.isFinite(cuenta.tileValue(t)), `${key}: ficha ${t}`);
    // Ninguna ficha suelta regala la respuesta, salvo cuando la idea es justo elegir el dato.
    const free = nums.filter(t => Math.abs(cuenta.tileValue(t) - r.answer) < 1e-9);
    if (free.length && r.sol.length > 1) {
      const k = keys.indexOf(free[0]), open = keys.indexOf('('), close = keys.indexOf(')');
      assert.equal(cuenta.grade({ rounds: [{ seq: [k] }] }, ex.params).ok, false, `${key}: una ficha suelta no cuenta`);
      assert.equal(cuenta.grade({ rounds: [{ seq: [open, k, close] }] }, ex.params).ok, false, `${key}: tampoco entre paréntesis`);
    }
    assert.ok(r.tol <= 1e-6 * Math.max(1, Math.abs(r.answer)), `${key}: el juego calcula exacto, sin el margen del redondeo`);
    assert.match(cuenta.grade(state, ex.params).solution, /=/);
  }
});

test('Arma la cuenta: calcula con las reglas de siempre y rechaza cuentas mal escritas', () => {
  const ev = s => cuenta.evaluate(s.split(' '));
  assert.equal(ev('2 + 3 * 4'), 14); assert.equal(ev('( 2 + 3 ) * 4'), 20); assert.equal(ev('2 ^ 3 ^ 2'), 512);
  assert.equal(ev('r ( 9 + 16 ) / 5'), 1); assert.equal(ev('-5 * 3 ^ 2'), -45); assert.equal(ev('( -2 ) ^ 2'), 4);
  assert.equal(ev('7 - -3'), 10); assert.ok(Math.abs(ev('10 * sen(30°)') - 5) < 1e-9); assert.ok(Math.abs(ev('2 * π / π/2') - 4) < 1e-9);
  for (const bad of ['2 +', '+ 2', '( 2 + 3', '2 3', '2 / 0', ')', 'r', '2 ^']) assert.ok(Number.isNaN(ev(bad)), bad);
  assert.ok(Number.isNaN(cuenta.evaluate([])));
  assert.equal(cuenta.exprText('3 * -1 + r ( 4 )'.split(' ')), '3 × (−1) + √(4)');
  assert.equal(cuenta.exprText('2 * π / π/2'.split(' ')), '2 × π ÷ (π/2)'); assert.equal(cuenta.exprText('27 ^ 1/3'.split(' ')), '27^(1/3)'); assert.equal(cuenta.exprText('-2 ^ 2'.split(' ')), '(−2)^2');
  assert.equal(cuenta.tileText('200000'), '200 000'); assert.equal(cuenta.tileText('sen(30°)'), 'sen 30°'); assert.equal(cuenta.tileText('-5/13'), '−5/13');
});

test('Escala la solución: gana solo la ruta de pasos válidos; hay de dos a cuatro niveles con dos o tres agarres', () => {
  for (const { key, ex } of walk(ctx).filter(e => e.ex.game === 'escala-solucion')) {
    const r = ex.params.rounds[0];
    assert.ok(r.levels.length >= 2 && r.levels.length <= 4, `${key}: niveles`);
    for (const l of r.levels) {
      assert.ok(l.length >= 2 && l.length <= 3, `${key}: agarres`);
      assert.equal(new Set(l).size, l.length, `${key}: agarres repetidos`);
      for (const t of l) assert.ok(t.length <= 48, `${key}: «${t}» es muy largo`);
    }
    assert.equal(escala.grade({ rounds: [{ pick: r.levels.map(() => 0) }] }, ex.params).ok, true);
    assert.equal(escala.grade({ rounds: [{ pick: r.levels.map((_, i) => (i ? 0 : 1)) }] }, ex.params).ok, false);
    assert.equal(escala.grade({}, ex.params).ok, false);
    // El válido no queda siempre en el mismo lugar.
    assert.equal([...escala.orderOf(r, 0)].sort().join(), r.levels[0].map((_, i) => i).join());
  }
  // El válido cae más o menos parejo en cada lugar: apostar siempre al mismo lado no sirve.
  const pos = { 2: [0, 0], 3: [0, 0, 0] };
  for (const { ex } of walk(ctx).filter(e => e.ex.game === 'escala-solucion')) ex.params.rounds[0].levels.forEach((lv, l) => { pos[lv.length][escala.orderOf(ex.params.rounds[0], l).indexOf(0)]++; });
  for (const n of [2, 3]) { const t = pos[n].reduce((a, b) => a + b, 0); for (const c of pos[n]) assert.ok(c / t < 0.62, `niveles de ${n}: ${pos[n]}`); }
});

test('si un ejercicio se mueve y la ficha ya no corresponde, no se cambia (y se avisa)', () => {
  const sinEscribir = get(ctx, 'sinEscribir');
  const fake = [{ units: [{ lessons: [{ id: 'x', ex: [{ type: 'input', q: 'q', answer: 9, explain: 'e' }, { type: 'input', q: 'q2', answer: 4, explain: 'e' }] }] }] }];
  const out = sinEscribir(fake, { 'x#0': { game: 'arma-la-cuenta', sol: ['2', '+', '2'], traps: [] }, 'x#1': { game: 'arma-la-cuenta', sol: ['2', '+', '2'], traps: [] } });
  assert.equal(out.done, 1); assert.equal(out.mismatch.join(), 'x#0');
  assert.equal(fake[0].units[0].lessons[0].ex[0].type, 'input'); assert.equal(fake[0].units[0].lessons[0].ex[1].game, 'arma-la-cuenta');
});
