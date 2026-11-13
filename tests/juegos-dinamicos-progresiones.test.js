// Juegos dinámicos de Progresiones y sumatoria (spec 2026-11-13-juegos-dinamicos-progresiones): un juego al final
// de cada lección del mundo. Lógica pura de cada uno y contenido de las rondas.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadGame, loadScripts, get, ROOT } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const J = v => JSON.stringify(v);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units.find(u => /Progresiones/.test(u.title)), GAMES = get(ctx, 'GAMES');
const lesson = id => unit.lessons.find(l => l.id === id);
const DYN = { 'alg-14': 'traza-progresion', 'alg-14b': 'encesta-suma', 'alg-14c': 'dobla-fichas', 'alg-14d': 'rana-zenon', 'alg-15': 'maquina-sigma' };
const paramsOf = id => lesson(id).ex.find(e => e.game === DYN[id]).params;
const goal = (name, r) => (name === 'dobla-fichas' ? 1 : r.items.length);

test('cada lección de Progresiones termina con su juego dinámico, con pista y explicación, y los cinco son distintos', () => {
  for (const [id, name] of Object.entries(DYN)) {
    const ex = lesson(id).ex, last = ex[ex.length - 1], P = last.params, g = GAMES[name];
    assert.equal(last.game, name, `${id} termina con ${name}`);
    assert.ok(g, `${name} cargado`);
    assert.ok(last.hint.length > 40 && last.explain.length > 40, `${id}: pista y explicación`);
    assert.ok(P.rounds.length >= 3, `${id}: al menos tres rondas`);
    const full = { done: P.rounds.map(r => goal(name, r)) }, none = { done: P.rounds.map(() => 0) };
    assert.equal(g.grade(none, P).ok, false, `${name}: el estado inicial no es la respuesta`);
    assert.equal(g.grade(full, P).ok, true, `${name}: resolver todo es ganar`);
    full.done[1]--;
    assert.equal(g.grade(full, P).ok, false, `${name}: falta una ronda`);
    assert.ok(g.grade(none, P).solution.length > 20, `${name}: trae solución`);
  }
  assert.equal(new Set(Object.values(DYN)).size, 5);
});

// ---------- traza-progresion ----------
test('traza-progresion: los términos salen de a₁ y d, y cada punto queda en una casilla distinta', () => {
  const g = G('traza-progresion'), it = { a1: 4, d: 3, len: 5, traps: [8, 12, 14] };
  assert.equal(g.termsOf(it).join(), '4,7,10,13,16');
  assert.equal(g.termsOf({ a1: 9, d: -3, len: 4 }).join(), '9,6,3,0');
  const dots = g.placeDots(it, 'x');
  assert.equal(dots.length, 8);
  assert.equal(new Set(dots.map(d => d.cell)).size, 8, 'sin dos puntos en la misma casilla');
  assert.ok(dots.every(d => d.cell >= 0 && d.cell < 9));
  assert.equal(J(g.placeDots(it, 'x')), J(dots), 'el mismo reparto para la misma semilla');
  assert.equal(dots.map(d => d.value).sort((a, b) => a - b).join(), '4,7,8,10,12,13,14,16');
});

test('traza-progresion (alg-14): las trampas no son términos y todo cabe en la cuadrícula de 3 × 3', () => {
  const g = GAMES['traza-progresion'];
  for (const r of paramsOf('alg-14').rounds) {
    assert.ok(r.items.length >= 2);
    for (const it of r.items) {
      const terms = g.termsOf(it);
      assert.ok(terms.length >= 4 && terms.length + it.traps.length <= 9, `${terms.join(' ')}: caben`);
      assert.ok(it.d !== 0);
      assert.equal(new Set([...terms, ...it.traps]).size, terms.length + it.traps.length, `${terms.join(' ')}: trampas distintas de los términos`);
    }
  }
});

test('traza-progresion: cuando la mecha borra el camino hay que levantar el dedo (no cuenta como error)', () => {
  const src = fs.readFileSync(path.join(ROOT, 'js/games/traza-progresion.js'), 'utf8');
  assert.match(src, /burn >= total\) \{ path = \[0\];[^}]*press = false/);
});

test('maquina-sigma (alg-15): la ronda de índices que no empiezan en 1 cumple su título', () => {
  const r = paramsOf('alg-15').rounds.find(x => /no empiezan en 1/.test(x.title));
  assert.ok(r.items.every(it => it.lo > 1));
});

// ---------- encesta-suma ----------
test('encesta-suma: el balón sale hacia donde se desliza (solo hacia arriba) y entra en la canasta que tiene enfrente', () => {
  const g = G('encesta-suma');
  const v = g.flickVel(0, -80, 500);
  assert.ok(Math.abs(v.vx) < 1e-9 && Math.abs(v.vy + 500) < 1e-9);
  const d = g.flickVel(30, -40, 100);
  assert.ok(Math.abs(d.vx - 60) < 1e-9 && Math.abs(d.vy + 80) < 1e-9);
  assert.equal(g.flickVel(40, 10, 500), null, 'hacia abajo no lanza');
  assert.equal(g.flickVel(2, -6, 500), null, 'un deslizón muy corto no lanza');
  assert.equal(g.hoopAt(52, [50, 150, 250], 30), 0);
  assert.equal(g.hoopAt(100, [50, 150, 250], 30), -1);
});

test('encesta-suma (alg-14b): la opción marcada es la suma de la progresión y las otras no', () => {
  for (const r of paramsOf('alg-14b').rounds) {
    assert.ok(r.items.length >= 3);
    for (const it of r.items) {
      const [a1, d, n] = it.sum, want = (n * (2 * a1 + (n - 1) * d)) / 2;
      assert.equal(new Set(it.options).size, 3, it.ask);
      it.options.forEach((o, i) => assert.equal(+o === want, i === it.answer, `${it.ask}: ${o} (suma ${want})`));
    }
  }
});

// ---------- dobla-fichas ----------
test('dobla-fichas: las fichas se corren y las iguales se funden una sola vez por jugada', () => {
  const g = G('dobla-fichas');
  assert.equal(g.slide([5, 5, 0, 0]).line.join(), '10,0,0,0');
  assert.equal(g.slide([5, 0, 5, 10]).line.join(), '10,10,0,0', 'no se funde dos veces');
  assert.equal(g.slide([5, 5, 5, 5]).line.join(), '10,10,0,0');
  assert.equal(g.slide([0, 0, 0, 5]).line.join(), '5,0,0,0');
  assert.equal(g.slide([5, 10, 20, 40]).moved, false);
  const grid = [5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 10];
  assert.equal(g.move(grid, 'left').grid.join(), '10,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0');
  assert.equal(g.move(grid, 'right').grid.join(), '0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,20');
  assert.equal(g.move(grid, 'down').grid.join(), '0,0,0,0,0,0,0,0,5,0,0,5,10,0,0,10');
  assert.equal(g.move([5, 10, 5, 10, 10, 5, 10, 5, 5, 10, 5, 10, 10, 5, 10, 5], 'up').moved, false);
  assert.equal(g.canMove([5, 10, 5, 10, 10, 5, 10, 5, 5, 10, 5, 10, 10, 5, 10, 5]), false, 'tablero lleno y sin parejas');
  assert.equal(g.canMove([5, 5, 5, 10, 10, 5, 10, 5, 5, 10, 5, 10, 10, 5, 10, 5]), true);
  assert.equal(g.termIndex(40, 5), 4, '40 = 5 · 2³ es el cuarto término');
  assert.equal(g.goalOf({ base: 7, n: 5 }), 112);
});

test('dobla-fichas (alg-14c): metas alcanzables y bases distintas', () => {
  const P = paramsOf('alg-14c');
  assert.equal(new Set(P.rounds.map(r => r.base)).size, P.rounds.length);
  for (const r of P.rounds) assert.ok(r.n >= 4 && r.n <= 6 && r.base >= 1, `base ${r.base}, término ${r.n}`);
});

// ---------- rana-zenon ----------
test('rana-zenon: sumas parciales y suma infinita', () => {
  const g = G('rana-zenon'), it = { a1: 8, r: [1, 2] };
  assert.equal(g.partial(it, 0), 0);
  assert.equal(g.partial(it, 3), 14);
  assert.equal(g.limitOf(it), 16);
  assert.equal(g.answerOf({ ...it, n: 3 }), 14);
  assert.equal(g.answerOf(it), 16);
  assert.equal(g.limitOf({ a1: 9, r: [1, 3] }), 13.5);
});

test('rana-zenon (alg-14d): una sola bandera correcta, todas dentro de la recta, y hay sumas cortas e infinitas', () => {
  const g = GAMES['rana-zenon'], P = paramsOf('alg-14d'), all = P.rounds.flatMap(r => r.items);
  assert.ok(all.some(i => i.n) && all.some(i => !i.n));
  for (const r of P.rounds) {
    assert.ok(r.items.length >= 3);
    for (const it of r.items) {
      assert.ok(it.r[0] < it.r[1] || it.n, 'la suma infinita solo con razón menor que 1');
      assert.equal(new Set(it.flags).size, 3);
      it.flags.forEach((f, i) => { assert.equal(Math.abs(+f - g.answerOf(it)) < 1e-9, i === it.answer, `a₁ = ${it.a1}: bandera ${f}`); assert.ok(+f > 0 && +f <= it.max, `bandera ${f} en la recta`); });
    }
  }
});

// ---------- maquina-sigma ----------
test('maquina-sigma: los términos salen de la fórmula, de k = lo a hi, y se suman o se multiplican', () => {
  const g = G('maquina-sigma'), it = { lo: 2, hi: 5, f: k => 2 * k };
  assert.equal(g.termsOf(it).join(), '4,6,8,10');
  assert.equal(g.totalOf(it, 'sum'), 28);
  assert.equal(g.totalOf(it, 'prod'), 1920);
  assert.equal(g.termsOf({ lo: 1, hi: 3, f: k => k * k }).join(), '1,4,9');
});

test('maquina-sigma (alg-15): términos distintos entre sí y de las trampas; hay sumatorias y productorias', () => {
  const g = GAMES['maquina-sigma'], P = paramsOf('alg-15');
  assert.ok(P.rounds.some(r => r.kind === 'sum') && P.rounds.some(r => r.kind === 'prod'));
  for (const r of P.rounds) {
    assert.ok(r.items.length >= 3);
    for (const it of r.items) {
      const terms = g.termsOf(it);
      assert.ok(terms.length >= 3 && terms.length <= 5 && it.expr.length > 0, it.expr);
      assert.equal(new Set([...terms, ...it.traps]).size, terms.length + it.traps.length, `${it.expr}: sin repetidos`);
      assert.ok(terms.length + it.traps.length <= 8, `${it.expr}: caben en la cinta`);
    }
  }
});
