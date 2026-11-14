// Mundo Escalera de Sigma (spec 2026-11-15-escalera-de-sigma): tres juegos nuevos por rondas, los cinco juegos
// dinámicos sin reloj y los ejercicios de alg-14, alg-14b, alg-14c, alg-14d y alg-15.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units.find(u => u.world === 'progresiones'), GAMES = get(ctx, 'GAMES');
const lesson = id => unit.lessons.find(l => l.id === id);
const P = (id, game) => lesson(id).ex.find(e => e.game === game).params;
const src = name => fs.readFileSync(path.join(ROOT, `js/games/${name}.js`), 'utf8');
const DYN = { 'alg-14': 'traza-progresion', 'alg-14b': 'encesta-suma', 'alg-14c': 'dobla-fichas', 'alg-14d': 'rana-zenon', 'alg-15': 'maquina-sigma' };

test('el mundo no tiene opción múltiple ni tarjetas; cada ejercicio trae pista y explicación', () => {
  assert.equal(unit.lessons.map(l => l.id).join(' '), 'alg-14 alg-14b alg-14c alg-14d alg-15');
  for (const l of unit.lessons) {
    l.ex.forEach((e, i) => {
      assert.ok(e.type === 'play' || e.type === 'input', `${l.id} ejercicio ${i} es ${e.type}`);
      assert.ok(!['clasifica-cartas', 'verdadero-falso'].includes(e.game), `${l.id} ejercicio ${i}: tarjetas`);
      assert.ok(typeof e.hint === 'string' && e.hint.length > 40, `${l.id} ejercicio ${i} sin pista`);
      assert.ok(e.explain.length > 40, `${l.id} ejercicio ${i} sin explicación`);
    });
    assert.ok(l.ex.filter(e => e.type === 'input').length <= 1, `${l.id}: a lo sumo un cálculo`);
  }
  assert.equal(unit.lessons.flatMap(l => l.ex).filter(e => e.type === 'input').length, 1, 'solo queda el cálculo de la pelota');
});

test('los cinco juegos dinámicos ya no tienen reloj, mecha, garza ni cinta que corre', () => {
  for (const [id, name] of Object.entries(DYN)) {
    const ex = lesson(id).ex;
    assert.equal(ex[ex.length - 1].game, name, `${id} termina con ${name}`);
    const s = src(name);
    assert.ok(!/clock|CLOCK|FUSE|heron|burn \+=|off \+=/.test(s), `${name}: nada avanza solo ni se acaba`);
    assert.match(s, /Sin prisa/, `${name}: lo dice el cartel`);
  }
  assert.ok(!/Se acabó el tiempo|La garza la alcanzó|La mecha alcanzó/.test(Object.values(DYN).map(src).join('\n')));
  const hints = unit.lessons.flatMap(l => l.ex).map(e => e.hint).join(' ');
  assert.ok(!/mecha|garza|en la cinta|No tardes|no te quedes quieto/.test(hints), 'las pistas tampoco apuran');
});

test('cuenta-saltos: del término 1 al término n hay n − 1 saltos; los términos son uno más que los saltos', () => {
  const g = GAMES['cuenta-saltos'];
  const v = { kind: 'arit', mode: 'value', a1: 4, step: 5, n: 12 }, c = { kind: 'arit', mode: 'count', a1: 5, step: 4, last: 41 }, q = { kind: 'geo', mode: 'value', a1: 2, step: 3, n: 6 };
  assert.equal(g.jumpsOf(v), 11); assert.equal(g.at(v, 11), 59);
  assert.equal(g.jumpsOf(c), 9);
  assert.equal(g.jumpsOf(q), 5); assert.equal(g.at(q, 5), 486);
  const Q = { rounds: [v, c] };
  assert.equal(g.grade({ rounds: [{ j: 11, t: 1 }, { j: 9, t: 10 }] }, Q).ok, true);
  assert.equal(g.grade({ rounds: [{ j: 12, t: 1 }, { j: 9, t: 10 }] }, Q).ok, false, 'la trampa: n saltos');
  assert.equal(g.grade({ rounds: [{ j: 11, t: 1 }, { j: 9, t: 9 }] }, Q).ok, false, 'la trampa: tantos términos como saltos');
  assert.equal(g.grade({}, Q).ok, false);
  for (const id of ['alg-14', 'alg-14b', 'alg-14c']) for (const r of P(id, 'cuenta-saltos').rounds) {
    const j = g.jumpsOf(r);
    assert.ok(j >= 4 && j <= 14, `${id}: ${j} saltos caben en el control`);
    assert.ok(Number.isInteger(g.at(r, j)), `${id}: se llega a un entero`);
  }
  assert.ok(P('alg-14', 'cuenta-saltos').rounds.some(r => r.step < 0), 'una progresión que baja');
  assert.ok(P('alg-14b', 'cuenta-saltos').rounds.every(r => r.mode === 'count'));
  assert.ok(!P('alg-14c', 'cuenta-saltos').rounds.some(r => r.a1 === 2 && r.step === 3), '2, 6, 18… sale en el video');
  assert.match(src('cuenta-saltos'), /if \(G\.locked\) \{ p\.fill\(last \? C\.N/, 'los postes no llevan número hasta comprobar');
  assert.ok(P('alg-14c', 'cuenta-saltos').rounds.every(r => r.kind === 'geo') && P('alg-14c', 'cuenta-saltos').rounds.some(r => r.step < 1));
});

test('resta-corrida: al restar S de rS solo sobreviven el último de arriba y el primero de abajo', () => {
  const g = GAMES['resta-corrida'], r = { a1: 5, r: 2, n: 6 };
  assert.equal(g.term(r, 6), 320);
  assert.equal(g.sumOf(r), 315);
  assert.equal(g.sumOf({ a1: 2, r: 3, n: 5 }), 242);
  const Q = P('alg-14d', 'resta-corrida');
  for (const q of Q.rounds) {
    let s = 0; for (let k = 0; k < q.n; k++) s += g.term(q, k);
    assert.equal(g.sumOf(q), s, 'la fórmula da la suma de verdad');
    assert.ok(q.n + 1 <= 7 && g.term(q, q.n) < 1000, 'cabe en el lienzo');
    assert.ok(!(q.a1 === 1 && q.r === 2) && !(q.a1 === 2 && q.r === 3), 'sin las listas del video (1, 2, 4… y 2, 6, 18…)');
  }
  assert.equal(g.grade({ rounds: Q.rounds.map(q => ({ cut: Array(q.n - 1).fill(true) })) }, Q).ok, true);
  assert.equal(g.grade({ rounds: Q.rounds.map(q => ({ cut: Array(q.n - 1).fill(true).map((v, i) => i > 0) })) }, Q).ok, false);
  assert.equal(g.grade({}, Q).ok, false);
});

test('parte-sigma: la constante se suma una vez por cada k', () => {
  const g = GAMES['parte-sigma'], Q = P('alg-15', 'parte-sigma');
  assert.equal(g.termTxt({ c: 2, d: 3 }), '2k + 3'); assert.equal(g.termTxt({ c: 0, d: 7 }), '7'); assert.equal(g.termTxt({ c: 1, d: 4 }), 'k + 4');
  assert.equal(g.totalOf({ c: 2, d: 3, hi: 4 }), 5 + 7 + 9 + 11);
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ a: r.c, b: r.d * r.hi })) }, Q).ok, true);
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ a: r.c, b: r.d })) }, Q).ok, false, 'la trampa: la constante una sola vez');
  assert.ok(Q.rounds.some(r => r.c === 0), 'una sigma de pura constante');
  assert.ok(!Q.rounds.some(r => r.d === 4 && r.hi === 6), 'Σ 4 de 1 a 6 es el ejemplo del video');
  for (const r of Q.rounds) assert.ok(r.d * r.hi <= 60 && r.c * r.hi + r.d <= 16, 'cabe en el dibujo y en el control');
});
