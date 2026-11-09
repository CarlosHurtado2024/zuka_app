// Juegos nuevos de la unidad 1 de Álgebra (spec 2026-11-09-algebra-unidad-1-videos-y-juegos):
// calificación (grade) y funciones puras de cada uno.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const J = v => JSON.stringify(v);

// ---------- fuga-de-familia ----------
test('fuga-de-familia: operaciones con r + k√2 y pertenencia a cada familia', () => {
  const g = G('fuga-de-familia');
  const r2 = { r: 0, k: 1 }, five = { r: 5, k: -1 };
  assert.equal(J(g.combine(r2, five, '+')), J({ r: 5, k: 0 }));
  assert.equal(J(g.combine(r2, { r: 0, k: 2 }, '×')), J({ r: 4, k: 0 }));
  assert.equal(J(g.combine({ r: 1, k: 1 }, { r: 1, k: 1 }, '×')), J({ r: 3, k: 2 }));
  assert.equal(J(g.combine({ r: 12, k: 0 }, { r: -4, k: 0 }, '÷')), J({ r: -3, k: 0 }));
  assert.equal(g.combine({ r: 3, k: 0 }, { r: 0, k: 0 }, '÷'), null, 'entre cero no se divide');
  assert.equal(g.inSet({ r: 3, k: 0 }, 'N'), true);
  assert.equal(g.inSet({ r: 0, k: 0 }, 'N'), false);
  assert.equal(g.inSet({ r: -2, k: 0 }, 'Z'), true);
  assert.equal(g.inSet({ r: 2.4, k: 0 }, 'Z'), false);
  assert.equal(g.inSet({ r: 2.4, k: 0 }, 'Q'), true);
  assert.equal(g.inSet({ r: 1, k: 1 }, 'I'), true);
  assert.equal(g.inSet({ r: 5, k: 0 }, 'I'), false);
});

test('fuga-de-familia: gana quien saca el resultado de la familia', () => {
  const g = G('fuga-de-familia');
  const n = v => ({ label: String(v), r: v, k: 0 });
  const P = { rounds: [
    { set: 'N', op: '−', tiles: [n(3), n(8), n(5)] },
    { set: 'I', op: '+', tiles: [{ label: '√2', r: 0, k: 1 }, { label: '5 − √2', r: 5, k: -1 }, { label: '2√2', r: 0, k: 2 }] },
  ] };
  assert.equal(g.grade({ picks: [[0, 1], [0, 1]] }, P).ok, true, '3 − 8 y √2 + (5 − √2) se escapan');
  assert.equal(g.grade({ picks: [[1, 0], [0, 1]] }, P).ok, false, '8 − 3 = 5 sigue siendo natural');
  assert.equal(g.grade({ picks: [[0, 1], [0, 2]] }, P).ok, false, '√2 + 2√2 sigue siendo irracional');
  assert.equal(g.grade({ picks: [[0, 0], [0, 1]] }, P).ok, false, 'la misma ficha dos veces no vale');
  assert.equal(g.grade({ picks: [[0], [0, 1]] }, P).ok, false);
  assert.ok(g.grade({ picks: [[], []] }, P).solution.includes('3 − 8'));
});

// ---------- candado-fraccion ----------
test('candado-fraccion: decimal en vivo y fracciones equivalentes', () => {
  const g = G('candado-fraccion');
  assert.equal(g.decimalText(7, 20), '0.35');
  assert.equal(g.decimalText(5, 9), '0.5555…');
  assert.equal(g.decimalText(4, 3), '1.3333…');
  assert.equal(g.decimalText(3, 0), '—');
  const P = { rounds: [{ dec: '0.35', num: 7, den: 20 }, { dec: '0.555…', num: 5, den: 9 }] };
  assert.equal(g.grade({ fr: [[7, 20], [5, 9]] }, P).ok, true);
  assert.equal(g.grade({ fr: [[14, 40], [10, 18]] }, P).ok, true, 'las equivalentes también abren');
  assert.equal(g.grade({ fr: [[35, 100], [55, 100]] }, P).ok, false, '0.55 termina: no es 0.555…');
  assert.equal(g.grade({ fr: [[7, 0], [5, 9]] }, P).ok, false);
  assert.ok(g.grade({ fr: [[1, 1], [1, 1]] }, P).solution.includes('7/20'));
});

// ---------- compas-raiz ----------
test('compas-raiz: los catetos cuyo cuadrado suma n', () => {
  const g = G('compas-raiz');
  assert.equal(J(g.legsFor(13, 4)), J([2, 3]));
  assert.equal(J(g.legsFor(8, 4)), J([2, 2]));
  const P = { rounds: [{ n: 5 }, { n: 13 }], max: 4 };
  assert.equal(g.grade({ legs: [[1, 2], [3, 2]] }, P).ok, true, 'el orden de los catetos no importa');
  assert.equal(g.grade({ legs: [[1, 2], [3, 3]] }, P).ok, false);
  assert.equal(g.grade({ legs: [[1, 2], null] }, P).ok, false);
  assert.ok(g.grade({ legs: [null, null] }, P).solution.includes('2² + 3²'));
});

// ---------- lupa-densidad ----------
test('lupa-densidad: el punto queda estrictamente entre los dos números', () => {
  const g = G('lupa-densidad');
  const P = { rounds: [{ a: { label: 'π', value: Math.PI }, b: { label: '22/7', value: 22 / 7 } }] };
  assert.equal(g.grade({ xs: [3.142] }, P).ok, true);
  assert.equal(g.grade({ xs: [3.143] }, P).ok, false, '3.143 > 22/7');
  assert.equal(g.grade({ xs: [Math.PI] }, P).ok, false, 'el extremo no cuenta');
  assert.equal(g.grade({ xs: [null] }, P).ok, false);
  assert.ok(/3\.14/.test(g.grade({ xs: [null] }, P).solution));
  // La vista se acerca 10 veces alrededor de un centro y nunca pasa del zoom máximo.
  const v = g.zoomView({ lo: 3, hi: 4 }, 3.14, 10);
  assert.ok(Math.abs(v.hi - v.lo - 0.1) < 1e-12 && v.lo < 3.14 && v.hi > 3.14);
});

// ---------- duplica-magnitud ----------
test('duplica-magnitud: el nuevo valor y el tipo de relación', () => {
  const g = G('duplica-magnitud');
  assert.equal(g.kindOf(3, 12, 6, 6), 'inversa');
  assert.equal(g.kindOf(4, 30, 12, 90), 'directa');
  assert.equal(g.kindOf(2, 4, 6, 36), 'ninguna');
  const P = { rounds: [{ x0: 3, y0: 12, x1: 6, y1: 6, step: 1, ymax: 24 }, { x0: 2, y0: 4, x1: 6, y1: 36, step: 2, ymax: 48 }] };
  assert.equal(g.grade({ ys: [6, 36] }, P).ok, true);
  assert.equal(g.grade({ ys: [24, 36] }, P).ok, false, 'pensarla directa cuando es inversa');
  assert.equal(g.grade({ ys: [6, 12] }, P).ok, false, 'el área no es directa con el lado');
  assert.equal(g.grade({ ys: [6, null] }, P).ok, false);
});

// ---------- engranajes ----------
test('engranajes: dientes × vueltas se conserva', () => {
  const g = G('engranajes');
  const P = { rounds: [
    { A: [12, 10], B: [30, null] },
    { A: [18, 5], B: [null, 9] },
  ] };
  assert.equal(J(g.answers(P)), J([4, 10]));
  assert.equal(g.grade({ vals: [4, 10] }, P).ok, true);
  assert.equal(g.grade({ vals: [25, 10] }, P).ok, false, 'regla de tres directa: error clásico');
  assert.equal(g.grade({ vals: [4, null] }, P).ok, false);
  assert.ok(g.grade({ vals: [null, null] }, P).solution.includes('12 · 10 = 30 · 4'));
});

// ---------- estira-barra ----------
test('estira-barra: el porcentaje justo y el valor que muestra', () => {
  const g = G('estira-barra');
  assert.equal(g.valueAt(250, 160), 400);
  const P = { rounds: [{ base: 250, pct: 160 }, { base: 400, pct: 85 }] };
  assert.equal(g.grade({ pcts: [160, 85] }, P).ok, true);
  assert.equal(g.grade({ pcts: [60, 85] }, P).ok, false, '«el 60 % más» no es el 60 %');
  assert.equal(g.grade({ pcts: [160, 15] }, P).ok, false);
  assert.ok(g.grade({ pcts: [null, null] }, P).solution.includes('160 %'));
});

// ---------- tragamonedas ----------
test('tragamonedas: los rodillos forman el factor 1 + r/100', () => {
  const g = G('tragamonedas');
  assert.equal(g.factorOf([1, 3, 5, 0]), 1.35);
  assert.equal(g.factorOf([0, 9, 9, 5]), 0.995);
  assert.equal(J(g.reelsFor(-12)), J([0, 8, 8, 0]));
  assert.equal(J(g.reelsFor(150)), J([2, 5, 0, 0]));
  const P = { rounds: [{ change: 35 }, { change: -0.5 }] };
  assert.equal(g.grade({ reels: [[1, 3, 5, 0], [0, 9, 9, 5]] }, P).ok, true);
  assert.equal(g.grade({ reels: [[0, 3, 5, 0], [0, 9, 9, 5]] }, P).ok, false, '0.35 es el aumento, no el factor');
  assert.equal(g.grade({ reels: [[1, 3, 5, 0], [0, 9, 5, 0]] }, P).ok, false, '0.5 % no es 5 %');
});

// ---------- cadena-cambios ----------
test('cadena-cambios: los cambios sucesivos se multiplican', () => {
  const g = G('cadena-cambios');
  const P = { stamps: [10, 10, -10, 50, -50, 20, -20], rounds: [{ goal: 1.21 }, { goal: 0.75 }, { goal: 0.99 }] };
  assert.ok(Math.abs(g.factorOf(P.stamps, [0, 1]) - 1.21) < 1e-12);
  assert.equal(g.grade({ picks: [[0, 1], [3, 4], [2, 0]] }, P).ok, true);
  assert.equal(g.grade({ picks: [[0, 1], [3, 4], [5, 6]] }, P).ok, false, '+20 y −20 dejan 96 %');
  assert.equal(g.grade({ picks: [[0, 0], [3, 4], [2, 0]] }, P).ok, false, 'el mismo sello dos veces no');
  assert.equal(g.grade({ picks: [[0], [3, 4], [2, 0]] }, P).ok, false);
  const sol = g.grade({ picks: [[], [], []] }, P).solution;
  assert.ok(sol.includes('+10 %') && sol.includes('−50 %'), sol);
});

// ---------- crece-planta ----------
test('crece-planta: simple suma lo mismo, compuesto multiplica', () => {
  const g = G('crece-planta');
  assert.equal(J(g.targets({ kind: 'simple', C: 400, M1: 430 })), J([460, 490]));
  assert.equal(J(g.targets({ kind: 'compuesto', C: 500, M1: 600 })), J([720, 864]));
  const P = { rounds: [{ kind: 'simple', C: 400, M1: 430, step: 1 }, { kind: 'compuesto', C: 1000, M1: 1100, step: 1 }] };
  assert.equal(g.grade({ hs: [[460, 490], [1210, 1331]] }, P).ok, true);
  assert.equal(g.grade({ hs: [[460, 490], [1200, 1300]] }, P).ok, false, 'el compuesto no suma siempre 100');
  assert.equal(g.grade({ hs: [[460, null], [1210, 1331]] }, P).ok, false);
});

// ---------- alcancias-gemelas ----------
test('alcancias-gemelas: la tasa simple equivalente al compuesto', () => {
  const g = G('alcancias-gemelas');
  assert.ok(Math.abs(g.equivalent(10, 2) - 10.5) < 1e-9);
  assert.ok(Math.abs(g.equivalent(20, 2) - 22) < 1e-9);
  const P = { rounds: [{ r: 10, n: 2 }, { r: 10, n: 3 }], tol: 0.06 };
  assert.equal(g.grade({ rates: [10.5, 11] }, P).ok, true, '11.03 redondeado a la décima');
  assert.equal(g.grade({ rates: [10, 11] }, P).ok, false, 'la misma tasa simple se queda corta');
  assert.equal(g.grade({ rates: [10.5, null] }, P).ok, false);
});

// ---------- Contenido: las rondas de la unidad 1 tienen solución alcanzable y todo trae pista ----------
const { loadScripts, get } = require('./load');
const NUEVOS = ['fuga-de-familia', 'candado-fraccion', 'compas-raiz', 'lupa-densidad', 'duplica-magnitud', 'engranajes', 'estira-barra', 'tragamonedas', 'cadena-cambios', 'crece-planta', 'alcancias-gemelas'];
const ctxU1 = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...NUEVOS.map(n => `js/games/${n}.js`)]);
const U1 = get(ctxU1, 'COURSE_ALGEBRA').units.find(u => u.title.startsWith('Sistemas numéricos')).lessons;
const GU1 = get(ctxU1, 'GAMES');
const usos = name => U1.flatMap(l => l.ex).filter(e => e.game === name).map(e => e.params);

test('unidad 1: cada juego nuevo se usa y cada ejercicio trae pista', () => {
  for (const n of NUEVOS) assert.ok(usos(n).length >= 1, `${n} no se usa`);
  for (const l of U1) l.ex.forEach((e, i) => assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${l.id} ejercicio ${i} sin pista`));
  const cartas = U1.flatMap(l => l.ex).filter(e => ['verdadero-falso', 'clasifica-cartas', 'une-parejas', 'une-factor', 'directa-inversa'].includes(e.game));
  assert.equal(cartas.length, 0, 'quedan tarjetas en la unidad 1');
});

test('unidad 1: cada ronda de los juegos nuevos se puede ganar con sus controles', () => {
  const ok = (n, st, P) => assert.equal(GU1[n].grade(st, P).ok, true, `${n} sin solución`);
  for (const P of usos('fuga-de-familia')) {
    const picks = P.rounds.map(r => { for (let i = 0; i < r.tiles.length; i++) for (let j = 0; j < r.tiles.length; j++) { if (i === j) continue; const v = GU1['fuga-de-familia'].combine(r.tiles[i], r.tiles[j], r.op); if (v && !GU1['fuga-de-familia'].inSet(v, r.set)) return [i, j]; } return null; });
    ok('fuga-de-familia', { picks }, P);
    // Cada ficha vive en la familia de su ronda.
    P.rounds.forEach(r => r.tiles.forEach(t => assert.ok(GU1['fuga-de-familia'].inSet(t, r.set), `${t.label} no es de ${r.set}`)));
  }
  for (const P of usos('candado-fraccion')) {
    P.rounds.forEach(r => { assert.ok(r.num <= 99 && r.den <= 99); assert.equal(GU1['candado-fraccion'].decimalText(r.num, r.den).replace('…', ''), r.dec.replace('…', '').padEnd(GU1['candado-fraccion'].decimalText(r.num, r.den).replace('…', '').length, r.dec.replace('…', '').slice(-1))); });
    ok('candado-fraccion', { fr: P.rounds.map(r => [r.num, r.den]) }, P);
  }
  for (const P of usos('compas-raiz')) ok('compas-raiz', { legs: P.rounds.map(r => GU1['compas-raiz'].legsFor(r.n, P.max)) }, P);
  for (const P of usos('lupa-densidad')) {
    P.rounds.forEach(r => assert.ok(r.a.value >= r.view[0] && r.b.value <= r.view[1] && r.a.value !== r.b.value));
    ok('lupa-densidad', { xs: P.rounds.map(r => GU1['lupa-densidad'].between(r)) }, P);
  }
  for (const P of usos('duplica-magnitud')) {
    P.rounds.forEach(r => assert.ok(Math.abs(r.y1 / r.step - Math.round(r.y1 / r.step)) < 1e-9 && r.y1 <= r.ymax, r.text));
    ok('duplica-magnitud', { ys: P.rounds.map(r => r.y1) }, P);
  }
  for (const P of usos('engranajes')) {
    const a = GU1['engranajes'].answers(P);
    P.rounds.forEach((r, i) => assert.ok(Number.isInteger(a[i]) && a[i] >= r.min && a[i] <= r.max, `ronda ${i}: ${a[i]}`));
    ok('engranajes', { vals: a }, P);
  }
  for (const P of usos('estira-barra')) ok('estira-barra', { pcts: P.rounds.map(r => r.pct) }, P);
  for (const P of usos('tragamonedas')) ok('tragamonedas', { reels: P.rounds.map(r => GU1['tragamonedas'].reelsFor(r.change)) }, P);
  for (const P of usos('cadena-cambios')) {
    const picks = P.rounds.map(r => { for (let i = 0; i < P.stamps.length; i++) for (let j = 0; j < P.stamps.length; j++) if (i !== j && Math.abs(GU1['cadena-cambios'].factorOf(P.stamps, [i, j]) - r.goal) < 1e-9) return [i, j]; return null; });
    ok('cadena-cambios', { picks }, P);
  }
  for (const P of usos('crece-planta')) {
    P.rounds.forEach(r => GU1['crece-planta'].targets(r).forEach(t => assert.ok(Number.isInteger(t), `${r.kind}: ${t} no se alcanza de 1 en 1`)));
    ok('crece-planta', { hs: P.rounds.map(r => GU1['crece-planta'].targets(r)) }, P);
  }
  for (const P of usos('alcancias-gemelas')) ok('alcancias-gemelas', { rates: P.rounds.map(r => +GU1['alcancias-gemelas'].equivalent(r.r, r.n).toFixed(1)) }, P);
});

test('unidad 1: las pistas de los juegos nuevos no dicen la respuesta', () => {
  const ex = U1.flatMap(l => l.ex).filter(e => NUEVOS.includes(e.game));
  const leak = { 'compas-raiz': ['1² + 2²', '2² + 3²'], 'candado-fraccion': ['7/20', '\tfrac{7}{20}'], 'tragamonedas': ['1.35', '0.88'], 'estira-barra': ['160 %', '85 %'], 'engranajes': ['4 vueltas'] };
  for (const e of ex) for (const bad of leak[e.game] || []) assert.ok(!e.hint.includes(bad), `la pista de ${e.game} dice ${bad}`);
});
