// Unidad 0 de Álgebra (conjuntos): juegos nuevos y contenido de la lección alg-0.
// Spec 2026-11-09-algebra-conjuntos.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, loadScripts, get } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const J = v => JSON.stringify(v);

// ---------- atrapa-elementos ----------
test('atrapa-elementos: el conjunto elegido es igual al pedido (sin importar el orden)', () => {
  const g = G('atrapa-elementos');
  const P = { rounds: [{ pool: ['1', '2', '3', '4', '5', '6'], members: ['3', '6'] }, { pool: ['A', 'L', 'G'], members: ['A', 'L'] }] };
  assert.equal(g.grade({ picks: [['6', '3'], ['L', 'A']] }, P).ok, true);
  assert.equal(g.grade({ picks: [['3'], ['A', 'L']] }, P).ok, false, 'falta un elemento');
  assert.equal(g.grade({ picks: [['3', '6', '1'], ['A', 'L']] }, P).ok, false, 'sobra un elemento');
  assert.ok(g.grade({ picks: [[], []] }, P).solution.includes('{3, 6}'));
  assert.equal(g.listText(['3', '6']), '{3, 6}');
  assert.equal(g.listText([]), '∅');
});

// ---------- mueve-circulos ----------
test('mueve-circulos: la relación dibujada sale de la geometría de los círculos', () => {
  const g = G('mueve-circulos');
  assert.equal(g.relationOf(0.2, 0.5), 'sub');       // d + rB ≤ 1
  assert.equal(g.relationOf(0.02, 1), 'equal');
  assert.equal(g.relationOf(1.6, 0.5), 'disjoint');   // d ≥ 1 + rB
  assert.equal(g.relationOf(1.0, 0.5), 'overlap');
  assert.equal(g.relationOf(0.3, 1), 'overlap', 'dos círculos iguales corridos se cruzan');
  const P = { rounds: [{ rB: 0.5, rel: 'sub' }, { rB: 1, rel: 'equal' }, { rB: 0.5, rel: 'disjoint' }] };
  assert.equal(g.grade({ pos: [[0.1, 0.1], [0, 0], [1.2, 1.2]] }, P).ok, true);
  assert.equal(g.grade({ pos: [[0.9, 0], [0, 0], [1.2, 1.2]] }, P).ok, false);
  assert.equal(g.grade({ pos: [null, [0, 0], [1.2, 1.2]] }, P).ok, false);
});

// ---------- fabrica-subconjuntos ----------
test('fabrica-subconjuntos: 2ⁿ casillas con subconjuntos todos distintos', () => {
  const g = G('fabrica-subconjuntos');
  const P = { rounds: [{ elements: ['a', 'b'] }] };
  const all = [[false, false], [true, false], [false, true], [true, true]];
  assert.equal(g.grade({ slots: [all] }, P).ok, true);
  assert.equal(g.grade({ slots: [[[false, false], [true, false], [true, false], [true, true]]] }, P).ok, false, 'repetido');
  assert.equal(g.grade({ slots: [all.slice(0, 3)] }, P).ok, false, 'faltan casillas');
  assert.ok(g.grade({ slots: [[]] }, P).solution.includes('∅'));
  assert.equal(g.subsetText(['a', 'b', 'c'], [true, false, true]), '{a, c}');
});

// ---------- reparte-venn ----------
test('reparte-venn: zona de cada elemento según A y B', () => {
  const g = G('reparte-venn');
  const r = { U: ['1', '2', '3', '4', '5'], A: ['1', '2'], B: ['2', '3'] };
  assert.equal(J(g.zonesOf(r)), J([0, 1, 2, 3, 3]));   // 0 solo A, 1 A∩B, 2 solo B, 3 fuera
  const P = { rounds: [r] };
  assert.equal(g.grade({ zones: [[0, 1, 2, 3, 3]] }, P).ok, true);
  assert.equal(g.grade({ zones: [[1, 1, 2, 3, 3]] }, P).ok, false);
  assert.equal(g.grade({ zones: [[0, 1, 2, 3, null]] }, P).ok, false);
});

// ---------- pinta-venn ----------
test('pinta-venn: zonas pintadas = zonas donde la operación es verdadera', () => {
  const g = G('pinta-venn');
  const diff = { n: 2, f: (a, b) => a && !b };
  assert.equal(J(g.targetMasks(diff)), J([1]));        // bit 0 = A, bit 1 = B
  const comp = { n: 2, f: (a, b) => !(a || b) };
  assert.equal(J(g.targetMasks(comp)), J([0]));
  const three = { n: 3, f: (a, b, c) => a && (b || c) };
  assert.equal(J(g.targetMasks(three)), J([3, 5, 7]));
  const P = { rounds: [diff, three] };
  assert.equal(g.grade({ masks: [[1], [7, 5, 3]] }, P).ok, true);
  assert.equal(g.grade({ masks: [[1, 3], [3, 5, 7]] }, P).ok, false);
  assert.equal(g.grade({ masks: [[], [3, 5, 7]] }, P).ok, false);
});

// ---------- encuesta-venn ----------
test('encuesta-venn: personas en cada zona', () => {
  const g = G('encuesta-venn');
  const r = { total: 40, a: 22, b: 18, both: 7 };
  assert.equal(J(g.target(r)), J([15, 7, 11, 7]));     // solo A, ambos, solo B, ninguno
  const P = { rounds: [r] };
  assert.equal(g.grade({ counts: [[15, 7, 11, 7]] }, P).ok, true);
  assert.equal(g.grade({ counts: [[22, 7, 18, 0]] }, P).ok, false, 'contar dos veces a los de ambos');
});

// ---------- contenido de la lección ----------
const NUEVOS = ['atrapa-elementos', 'mueve-circulos', 'fabrica-subconjuntos', 'reparte-venn', 'pinta-venn', 'encuesta-venn'];
const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...NUEVOS.map(n => `js/games/${n}.js`)]);
const alg = get(ctx, 'COURSE_ALGEBRA'), GAMES = get(ctx, 'GAMES');
const unit = alg.units[0], lesson = unit.lessons[0];
const uses = name => lesson.ex.filter(e => e.game === name).map(e => e.params);

test('la unidad 0 de Álgebra es Conjuntos, con la lección alg-0 de juegos y pistas', () => {
  assert.equal(unit.title, 'Conjuntos');
  assert.equal(lesson.id, 'alg-0');
  for (const n of NUEVOS) assert.ok(uses(n).length >= 1, `${n} no se usa`);
  lesson.ex.forEach((e, i) => assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `ejercicio ${i} sin pista`));
  assert.ok(lesson.ex.every(e => e.type !== 'mc'), 'sin opción múltiple');
  assert.ok(lesson.clip.scenes.length >= 3, 'escenas de respaldo mientras llega el video');
});

test('alg-0: cada ronda se puede ganar y los datos son coherentes', () => {
  const ok = (n, st, P) => assert.equal(GAMES[n].grade(st, P).ok, true, `${n} sin solución`);
  for (const P of uses('atrapa-elementos')) {
    P.rounds.forEach(r => r.members.forEach(m => assert.ok(r.pool.includes(m), `${m} no está en las fichas`)));
    ok('atrapa-elementos', { picks: P.rounds.map(r => r.members) }, P);
  }
  for (const P of uses('mueve-circulos')) {
    const at = { sub: [0, 0], equal: [0, 0], disjoint: [1.5, 1.2], overlap: [0.9, 0] };
    ok('mueve-circulos', { pos: P.rounds.map(r => at[r.rel]) }, P);
    P.rounds.forEach(r => assert.ok(r.rel !== 'equal' || r.rB === 1, 'conjuntos iguales: círculos del mismo tamaño'));
  }
  for (const P of uses('fabrica-subconjuntos')) {
    const all = P.rounds.map(r => Array.from({ length: 2 ** r.elements.length }, (_, m) => r.elements.map((_, k) => !!(m & (1 << k)))));
    ok('fabrica-subconjuntos', { slots: all }, P);
  }
  for (const P of uses('reparte-venn')) {
    P.rounds.forEach(r => [...r.A, ...r.B].forEach(x => assert.ok(r.U.includes(x), `${x} fuera de U`)));
    ok('reparte-venn', { zones: P.rounds.map(r => GAMES['reparte-venn'].zonesOf(r)) }, P);
  }
  for (const P of uses('pinta-venn')) {
    P.rounds.forEach(r => assert.ok(GAMES['pinta-venn'].targetMasks(r).length >= 1, r.text));
    ok('pinta-venn', { masks: P.rounds.map(r => GAMES['pinta-venn'].targetMasks(r)) }, P);
  }
  for (const P of uses('encuesta-venn')) {
    P.rounds.forEach(r => assert.ok(GAMES['encuesta-venn'].target(r).every(v => v >= 0), r.text));
    ok('encuesta-venn', { counts: P.rounds.map(r => GAMES['encuesta-venn'].target(r)) }, P);
  }
  const nums = lesson.ex.filter(e => e.type === 'input');
  assert.ok(nums.some(e => e.answer === 32) && nums.some(e => e.answer === 17));
});
