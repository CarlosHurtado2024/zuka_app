// Mundo Torres de Potencias (spec 2026-11-15-torres-de-potencias): doce juegos nuevos y los ejercicios de
// alg-21a, alg-21b, alg-22a y alg-22b. Lógica pura de cada juego y contenido de las rondas.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units.find(u => u.world === 'potencias'), GAMES = get(ctx, 'GAMES');
const lesson = id => unit.lessons.find(l => l.id === id);
const exOf = (id, game) => lesson(id).ex.find(e => e.game === game);
const P = (id, game) => exOf(id, game).params;
const src = name => fs.readFileSync(path.join(ROOT, `js/games/${name}.js`), 'utf8');

const DYN = { 'alg-21a': 'torre-pisos', 'alg-21b': 'escala-leyes', 'alg-22a': 'siembra-raices', 'alg-22b': 'muro-radicales' };
const NEW = { 'alg-21a': ['arbol-potencia', 'pares-negativos'], 'alg-21b': ['cuenta-factores', 'cambia-de-piso', 'salta-la-coma'], 'alg-22a': ['reparte-factores'], 'alg-22b': ['parte-baldosa', 'tabla-conjugado'] };

test('el mundo ya no tiene opción múltiple ni tarjetas, y cada ejercicio trae pista y explicación', () => {
  assert.equal(unit.lessons.map(l => l.id).join(' '), 'alg-21a alg-21b alg-22a alg-22b');
  for (const l of unit.lessons) {
    assert.ok(l.ex.length >= 5, `${l.id}: al menos cinco ejercicios`);
    l.ex.forEach((e, i) => {
      assert.ok(e.type === 'play' || e.type === 'input', `${l.id} ejercicio ${i} es ${e.type}`);
      assert.ok(!['clasifica-cartas', 'verdadero-falso'].includes(e.game), `${l.id} ejercicio ${i}: tarjetas`);
      assert.ok(e.hint.length > 40 && e.explain.length > 40, `${l.id} ejercicio ${i}: pista y explicación`);
    });
    assert.ok(l.ex.filter(e => e.type === 'input').length <= 1, `${l.id}: a lo sumo un cálculo`);
    assert.equal(new Set(l.ex.map(e => e.game || e.q)).size, l.ex.length - (l.ex.filter(e => e.game === 'une-parejas').length > 1 ? 1 : 0), `${l.id}: juegos distintos`);
  }
});

test('cada lección termina con su juego dinámico, sin reloj, y los cuatro son distintos', () => {
  for (const [id, name] of Object.entries(DYN)) {
    const ex = lesson(id).ex, last = ex[ex.length - 1], g = GAMES[name], Q = last.params;
    assert.equal(last.game, name, `${id} termina con ${name}`);
    assert.ok(Q.rounds.length >= 3, `${name}: tres rondas`);
    const full = { done: Q.rounds.map(r => r.items.length) }, none = { done: Q.rounds.map(() => 0) };
    assert.equal(g.grade(none, Q).ok, false);
    assert.equal(g.grade(full, Q).ok, true);
    full.done[1]--;
    assert.equal(g.grade(full, Q).ok, false);
    assert.ok(g.grade(none, Q).solution.length > 20);
    // Entender, no mecanizar: nada de cuentas regresivas ni de tiempo límite.
    assert.ok(!/clock|timer|CLOCK|countdown|tiempo de la jugada/.test(src(name)), `${name}: sin reloj`);
    assert.match(src(name), /Sin prisa/);
  }
  assert.equal(new Set(Object.values(DYN)).size, 4);
});

test('los juegos por rondas: el estado inicial no gana y la solución se puede escribir', () => {
  for (const [id, names] of Object.entries(NEW)) for (const name of names) {
    const g = GAMES[name], Q = P(id, name);
    assert.ok(g, name);
    assert.ok(Q.rounds.length >= 3, `${name}: al menos tres rondas`);
    assert.equal(g.grade({}, Q).ok, false, `${name}: sin tocar nada no se gana`);
    assert.ok(g.grade({}, Q).solution.length > 10, `${name}: trae solución`);
  }
});

test('roundsGame (kit): califica ronda por ronda y sup escribe superíndices', () => {
  const roundsGame = get(ctx, 'roundsGame'), sup = get(ctx, 'sup');
  const g = roundsGame({ init: () => ({ v: 0 }), ok: (s, r) => s.v === r.want, solution: r => `v = ${r.want}`, prompt: () => '', draw() {} });
  const Q = { rounds: [{ want: 2 }, { want: 5 }] };
  assert.equal(g.grade({ rounds: [{ v: 2 }, { v: 5 }] }, Q).ok, true);
  assert.equal(g.grade({ rounds: [{ v: 2 }, { v: 4 }] }, Q).ok, false);
  assert.equal(g.grade({ rounds: [{ v: 2 }] }, Q).ok, false, 'una ronda sin responder');
  assert.equal(g.grade({}, Q).solution, 'v = 2 · v = 5');
  assert.equal(sup(12), '¹²');
  assert.equal(sup(-3), '⁻³');
});

// ---------- alg-21a ----------
test('arbol-potencia: hojas = ramas elevado a niveles; 64 tiene tres respuestas', () => {
  const g = GAMES['arbol-potencia'], Q = P('alg-21a', 'arbol-potencia');
  assert.equal(JSON.stringify(g.powersOf(64)), '[[2,6],[4,3],[8,2]]');
  assert.equal(g.grade({ rounds: [{ b: 2, e: 5 }, { b: 4, e: 3 }, { b: 5, e: 3 }] }, Q).ok, true);
  assert.equal(g.grade({ rounds: [{ b: 2, e: 5 }, { b: 8, e: 2 }, { b: 5, e: 3 }] }, Q).ok, true, 'otra forma del 64');
  assert.equal(g.grade({ rounds: [{ b: 2, e: 5 }, { b: 2, e: 5 }, { b: 5, e: 3 }] }, Q).ok, false);
  for (const r of Q.rounds) assert.ok(g.powersOf(r.target).length >= 1, `${r.target} se puede armar`);
});

test('pares-negativos: el signo sale de contar los negativos, según haya paréntesis o no', () => {
  const g = GAMES['pares-negativos'];
  const A = { base: 2, n: 4, paren: true, outer: false }, B = { base: 2, n: 4, paren: false, outer: true }, D = { base: 2, n: 3, paren: true, outer: true };
  assert.equal(g.exprOf(A), '(−2)⁴'); assert.equal(g.valueOf(A), 16);
  assert.equal(g.exprOf(B), '−2⁴'); assert.equal(g.valueOf(B), -16); assert.equal(g.negsOf(B), 1);
  assert.equal(g.exprOf(D), '−(−2)³'); assert.equal(g.valueOf(D), 8); assert.equal(g.negsOf(D), 4);
  assert.match(g.grade({}, { rounds: [A, B] }).solution, /2 parejas de negativos.*un solo negativo/, 'la solución nombra las parejas');
  const Q = { rounds: [A, B] };
  assert.equal(g.grade({ rounds: [{ pairs: [[0, 1], [2, 3]], sign: 1 }, { pairs: [], sign: -1 }] }, Q).ok, true);
  assert.equal(g.grade({ rounds: [{ pairs: [[0, 1]], sign: 1 }, { pairs: [], sign: -1 }] }, Q).ok, false, 'falta una pareja');
  assert.equal(g.grade({ rounds: [{ pairs: [[0, 1], [2, 3]], sign: -1 }, { pairs: [], sign: -1 }] }, Q).ok, false);
  const signs = P('alg-21a', 'pares-negativos').rounds.map(g.signOf);
  assert.ok(signs.includes(1) && signs.includes(-1), 'hay positivos y negativos');
});

test('torre-pisos: cada piso es una potencia; los sótanos son fracciones, nunca negativos', () => {
  const g = GAMES['torre-pisos'];
  assert.equal(g.valTxt(2, 4), '16');
  assert.equal(g.valTxt(2, 0), '1');
  assert.equal(g.valTxt(5, -2), '1/25');
  assert.equal(g.valTxt(10, -3), '0.001');
  assert.ok(!/seen\.add\(Math\.round\(pos\)\)/.test(src('torre-pisos')), 'las ventanas no se abren al pasar: hay que contar pisos');
  for (const r of P('alg-21a', 'torre-pisos').rounds) {
    assert.ok(r.lo < 0 && r.hi > 0 && r.hi - r.lo <= 8, `${r.title}: con sótanos y a lo sumo nueve pisos`);
    assert.ok(r.base !== 3, 'la escalera del video es la del 3');
    assert.ok(r.items.some(it => it.exp < 0), `${r.title}: algún exponente negativo`);
    assert.equal(new Set(r.items.map(it => it.exp)).size, r.items.length);
    for (const it of r.items) assert.ok(it.exp >= r.lo && it.exp <= r.hi);
  }
});

// ---------- alg-21b ----------
test('cuenta-factores: producto suma, cociente resta (puede dar negativo) y potencia de potencia multiplica', () => {
  const g = GAMES['cuenta-factores'], Q = P('alg-21b', 'cuenta-factores');
  assert.equal(g.expOf({ kind: 'prod', m: 5, n: 2 }), 7);
  assert.equal(g.expOf({ kind: 'quot', m: 2, n: 5 }), -3);
  assert.equal(g.expOf({ kind: 'pow', m: 2, n: 4 }), 8);
  assert.equal(g.exprOf({ kind: 'pow', m: 2, n: 4 }), '(x²)⁴');
  assert.deepEqual([...new Set(Q.rounds.map(r => r.kind))].sort(), ['pow', 'prod', 'quot']);
  assert.ok(Q.rounds.some(r => g.expOf(r) < 0), 'un cociente con exponente negativo');
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ e: g.expOf(r) })) }, Q).ok, true);
});

test('cambia-de-piso: al cruzar la raya el exponente cambia de signo', () => {
  const g = GAMES['cambia-de-piso'], r = { top: [{ b: 'a', e: -3 }, { b: 'b', e: 2 }], bottom: [{ b: 'c', e: -1 }] };
  assert.equal(g.shown(r, [true, true, false]).map(t => t.e).join(), '-3,2,-1');
  assert.equal(g.shown(r, [false, true, true]).map(t => t.e).join(), '3,2,1');
  assert.equal(g.fracTxt(g.shown(r, [false, true, true])), 'b² c / a³');
  const Q = P('alg-21b', 'cambia-de-piso');
  for (const q of Q.rounds) {
    const all = [...q.top, ...q.bottom];
    assert.ok(all.some(t => t.e < 0), 'hay algo que mover');
    assert.ok(all.length <= 4);
  }
  assert.equal(g.grade({ rounds: Q.rounds.map(q => ({ up: [...q.top.map(t => t.e > 0), ...q.bottom.map(t => t.e < 0)] })) }, Q).ok, true);
  assert.equal(g.grade({ rounds: Q.rounds.map(q => ({ up: [...q.top.map(() => false), ...q.bottom.map(() => true)] })) }, Q).ok, false, 'mover todo no sirve');
});

test('salta-la-coma: cada salto del punto cambia el exponente en uno y el valor no cambia', () => {
  const g = GAMES['salta-la-coma'], big = { digits: '384000', point: 6, goal: 'sci' }, small = { digits: '000072', point: 1, goal: 'sci' }, back = { digits: '0025', point: 3, exp: -2, goal: 'std' };
  assert.equal(g.goalPt(big), 1); assert.equal(g.numTxtOf(big, 1), '3.84 × 10⁵'); assert.equal(g.numTxtOf(big, 6), '384000 × 10⁰');
  assert.equal(g.goalPt(small), 5); assert.equal(g.numTxtOf(small, 5), '7.2 × 10⁻⁴'); assert.equal(g.coefTxt(small, 1), '0.00072');
  assert.equal(g.goalPt(back), 1); assert.equal(g.coefTxt(back, 1), '0.025'); assert.equal(g.numTxtOf(back, 3), '2.5 × 10⁻²');
  const Q = P('alg-21b', 'salta-la-coma'), val = (r, pt) => +g.coefTxt(r, pt) * 10 ** g.expAt(r, pt);
  for (const r of Q.rounds) {
    assert.ok(g.goalPt(r) >= 1 && g.goalPt(r) <= r.digits.length && g.goalPt(r) !== r.point, `${r.digits}: hay que mover el punto`);
    assert.ok(Math.abs(val(r, g.goalPt(r)) / val(r, r.point) - 1) < 1e-9, `${r.digits}: mismo valor`);
    if (r.goal === 'sci') { const c = +g.coefTxt(r, g.goalPt(r)); assert.ok(c >= 1 && c < 10); } else assert.equal(g.expAt(r, g.goalPt(r)), 0);
  }
  assert.ok(Q.rounds.some(r => r.goal === 'sci') && Q.rounds.some(r => r.goal === 'std'));
});

test('escala-leyes: multiplicar suma pisos, dividir resta y elevar multiplica; el orden importa', () => {
  const g = GAMES['escala-leyes'];
  assert.equal(g.applyCard(2, { op: 'mul', k: 3 }), 5);
  assert.equal(g.applyCard(2, { op: 'div', k: 3 }), -1);
  assert.equal(g.applyCard(2, { op: 'pow', k: 3 }), 6);
  const it = { start: 2, cards: [{ op: 'pow', k: 2 }, { op: 'div', k: 4 }, { op: 'mul', k: 3 }], target: 6 };
  assert.equal(g.pathOf(it, [2, 0, 1]).join(), '2,5,10,6');
  assert.equal(JSON.stringify(g.solutionsOf(it)), '[[2,0,1]]');
  assert.equal(g.chainTxt(it, [2, 0, 1]), 'x² → x⁵ → x¹⁰ → x⁶');
  for (const r of P('alg-21b', 'escala-leyes').rounds) for (const q of r.items) {
    const sols = g.solutionsOf(q), same = q.cards.map((_, i) => i);
    assert.ok(sols.length >= 1, `${JSON.stringify(q)}: tiene solución`);
    assert.ok(!sols.some(o => o.join() === same.join()), 'usar las tarjetas en el orden en que salen no sirve');
    assert.ok(q.cards.some(c => c.op === 'pow'), 'siempre hay una tarjeta de elevar');
    const [lo, hi] = g.reach(q);
    assert.ok(hi - lo <= 24, `la escalera cabe (${lo} a ${hi})`);
  }
});

// ---------- alg-22a ----------
test('reparte-factores: el denominador reparte en grupos iguales y el numerador dice cuántos tomar', () => {
  const g = GAMES['reparte-factores'];
  assert.equal(g.primes(1000).join(), '2,2,2,5,5,5');
  assert.equal(g.groupOf(64, 3).join(), '2,2');
  assert.equal(g.groupOf(1000, 3).join(), '2,5');
  assert.equal(g.groupOf(64, 4), null, 'seis doses no se reparten parejo en cuatro grupos');
  assert.equal(g.valueOf({ n: 64, num: 2, den: 3 }), 16);
  const Q = P('alg-22a', 'reparte-factores');
  for (const r of Q.rounds) {
    assert.ok(g.groupOf(r.n, r.den), `${r.n}: se reparte en ${r.den}`);
    assert.ok(r.num < r.den && r.num > 1, 'fracción propia con numerador mayor que 1');
    assert.ok(g.primes(r.n).length <= 6, `${r.n}: caben los factores`);
  }
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ split: r.den, keep: r.num })) }, Q).ok, true);
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ split: r.num, keep: r.den })) }, Q).ok, false);
});

test('siembra-raices: la ecuación puede tener dos, una o ninguna solución; la raíz es un solo número', () => {
  const g = GAMES['siembra-raices'];
  assert.equal(g.wantOf({ kind: 'eq', n: 2, a: 36 }).join(), '-6,6');
  assert.equal(g.wantOf({ kind: 'root', n: 2, a: 36 }).join(), '6');
  assert.equal(g.wantOf({ kind: 'eq', n: 2, a: -9 }).length, 0);
  assert.equal(g.wantOf({ kind: 'root', n: 3, a: -64 }).join(), '-4');
  assert.equal(g.judge({ kind: 'eq', n: 2, a: 36 }, [6, -6]).ok, true);
  assert.match(g.judge({ kind: 'eq', n: 2, a: 36 }, [6]).msg, /Falta/);
  assert.match(g.judge({ kind: 'root', n: 2, a: 36 }, [6, -6]).msg, /un solo número/);
  assert.equal(g.judge({ kind: 'root', n: 2, a: -25 }, []).ok, true, 'sin elegir nada cuando no es real');
  assert.equal(g.judge({ kind: 'root', n: 2, a: -25 }, [5]).ok, false);
  assert.equal(g.askTxt({ kind: 'root', n: 3, a: -1 }), '∛(−1) = ?');
  const all = P('alg-22a', 'siembra-raices').rounds.flatMap(r => r.items), sizes = all.map(it => g.wantOf(it).length);
  assert.ok(sizes.includes(0) && sizes.includes(1) && sizes.includes(2), 'ninguna, una y dos respuestas');
  assert.ok(all.some(it => it.kind === 'eq') && all.some(it => it.kind === 'root'));
  for (const it of all) if (it.a > 0 || it.n % 2) assert.ok(g.wantOf(it).length >= 1, `${JSON.stringify(it)}: la respuesta cabe en la recta`);
});

// ---------- alg-22b ----------
test('parte-baldosa: la cuadrícula más fina saca todo el cuadrado escondido', () => {
  const g = GAMES['parte-baldosa'], Q = P('alg-22b', 'parte-baldosa');
  assert.equal(g.bestK(48), 4); assert.equal(g.bestK(200), 10); assert.equal(g.bestK(7), 1);
  assert.match(src('parte-baldosa'), /good = G\.locked &&/, 'el verde solo sale al comprobar');
  assert.equal(g.rootTxt(4, 3), '4√3'); assert.equal(g.rootTxt(1, 7), '√7'); assert.equal(g.rootTxt(5, 1), '5');
  for (const r of Q.rounds) assert.ok(g.bestK(r.n) > 1 && g.bestK(r.n) <= 10 && r.n / g.bestK(r.n) ** 2 > 1, `√${r.n} se simplifica y no es exacta`);
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ k: g.bestK(r.n) })) }, Q).ok, true);
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ k: r.n === 48 ? 2 : g.bestK(r.n) })) }, Q).ok, false, '2√12 todavía esconde un cuadrado');
});

test('tabla-conjugado: producto término a término; solo una opción quita la raíz', () => {
  const g = GAMES['tabla-conjugado'];
  assert.equal(JSON.stringify(g.mulTerm({ c: 1, r: 6 }, { c: 1, r: 2 })), '{"c":2,"r":3}', '√6 · √2 = 2√3');
  assert.equal(JSON.stringify(g.mulTerm({ c: 2, r: 3 }, { c: -2, r: 3 })), '{"c":-12,"r":1}');
  assert.equal(g.polyTxt([{ c: 1, r: 7 }, { c: -1, r: 1 }]), '√7 − 1');
  assert.equal(g.polyTxt(g.product([{ c: 2, r: 1 }, { c: 1, r: 3 }], [{ c: 2, r: 1 }, { c: -1, r: 3 }])), '1');
  assert.equal(g.rational(g.product([{ c: 2, r: 1 }, { c: 1, r: 3 }], [{ c: 2, r: 1 }, { c: 1, r: 3 }])), false);
  const Q = P('alg-22b', 'tabla-conjugado');
  for (const r of Q.rounds) {
    assert.equal(r.options.length, 4);
    assert.equal(r.options.filter(o => g.rational(g.product(r.den, o))).length, 1, `${g.polyTxt(r.den)}: una sola opción sirve`);
    assert.equal(new Set(r.options.map(g.polyTxt)).size, 4);
  }
  assert.ok(Q.rounds.some(r => r.den.length === 1) && Q.rounds.some(r => r.den.length === 2), 'monomio y binomio');
  assert.equal(new Set(Q.rounds.map(g.goodOf)).size > 1, true, 'la buena no está siempre en el mismo sitio');
  assert.equal(g.grade({ rounds: Q.rounds.map(r => ({ pick: g.goodOf(r) })) }, Q).ok, true);
});

test('muro-radicales: solo se juntan los ladrillos del mismo tipo, y cada meta se puede armar', () => {
  const g = GAMES['muro-radicales'];
  assert.equal(JSON.stringify(g.simp(48)), '{"c":4,"r":3}');
  assert.equal(JSON.stringify(g.totalOf([27, 3])), '[{"c":4,"r":3}]');
  assert.equal(g.totalOf([2, 3]).length, 2, '√2 y √3 no se juntan');
  const it = { target: { c: 4, r: 3 }, bricks: [27, 2, 12, 3, 8] };
  assert.equal(g.judge(it, [27, 3]).ok, true);
  assert.match(g.judge(it, [27, 2]).msg, /no se juntan/);
  assert.match(g.judge(it, [12, 3]).msg, /falta/);
  assert.match(g.judge(it, [8, 2]).msg, /meta es de √3/);
  assert.equal(g.solve(it).join(), '0,3');
  assert.equal(g.judge(it, []).ok, false);
  assert.match(src('muro-radicales'), /if \(!row\.length\) \{ a\.say/, 'con la fila vacía, «¡Listo!» no quita una vida');
  assert.ok(!/fill: usedB \? C\.card : colOf/.test(src('muro-radicales')), 'el montón no delata el tipo por el color');
  const rounds = P('alg-22b', 'muro-radicales').rounds;
  for (const r of rounds) for (const q of r.items) {
    assert.ok(g.solve(q), `${g.radTxt(q.target)}: se puede armar`);
    assert.ok(q.bricks.length <= 6 && q.bricks.some(n => g.simp(n).r !== q.target.r), 'hay ladrillos de otro tipo');
    assert.ok(q.target.c * Math.sqrt(q.target.r) <= 13, 'la meta cabe en el lienzo');
    assert.ok(!q.bricks.some(n => g.simp(n).c === q.target.c && g.simp(n).r === q.target.r), 'ningún ladrillo es ya la meta');
  }
  assert.ok(rounds.slice(1).every(r => r.items.every(q => g.solve(q).some(i => g.simp(q.bricks[i]).c > 1))), 'desde la segunda ronda hay que simplificar');
});
