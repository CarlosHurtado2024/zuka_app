// Unidad 0 de Álgebra (conjuntos desde cero): juegos y contenido de las lecciones alg-0a, alg-0b y alg-0c.
// Specs 2026-11-09-algebra-conjuntos y 2026-11-11-conjuntos-desde-cero.
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
  const Q = { rounds: [{ expr: 'A ∩ B', given: ['A = {x, y}', 'B = {y}'], pool: ['x', 'y'], members: ['y'] }] };
  assert.ok(g.grade({ picks: [[]] }, Q).solution.startsWith('A ∩ B = {y}'), 'con expr la solución nombra la operación');
});

// ---------- arma-notacion ----------
test('arma-notacion: lee nombre, =, llaves y elementos separados por comas', () => {
  const g = G('arma-notacion');
  assert.equal(J(g.parse(['D', '=', '{', 'rojo', ',', 'verde', '}'])), J({ name: 'D', elems: ['rojo', 'verde'] }));
  assert.equal(g.parse(['D', '=', '(', 'rojo', ')']), null, 'paréntesis no son llaves');
  assert.equal(g.parse(['D', '=', '{', 'rojo', 'verde', '}']), null, 'falta la coma');
  assert.equal(g.parse(['D', '=', '{', 'rojo', ',', '}']), null, 'coma sobrante');
  assert.equal(J(g.parse(['D', '=', '{', '}'])), J({ name: 'D', elems: [] }));
  const P = { rounds: [{ name: 'D', members: ['rojo', 'verde'], chips: ['D', '=', '{', '}', ',', 'rojo', 'verde', 'azul', '('] }] };
  const idx = labels => labels.map(l => P.rounds[0].chips.indexOf(l));
  assert.equal(g.grade({ seqs: [idx(['D', '=', '{', 'verde', ',', 'rojo', '}'])] }, P).ok, true, 'el orden no importa');
  assert.equal(g.grade({ seqs: [idx(['D', '=', '{', 'rojo', ',', 'verde', ',', 'rojo', '}'])] }, P).ok, false, 'no se repite');
  assert.equal(g.grade({ seqs: [idx(['D', '=', '{', 'rojo', ',', 'azul', '}'])] }, P).ok, false);
  assert.ok(g.grade({ seqs: [[]] }, P).solution.includes('D = {rojo, verde}'));
});

// ---------- cumple-notacion ----------
test('cumple-notacion: cada ficha adentro o afuera según su frase', () => {
  const g = G('cumple-notacion');
  const P = { rounds: [{ set: 'M', tokens: ['perro', 'pez', 'gato'], inside: [true, false, true] }] };
  assert.equal(g.grade({ inside: [[true, false, true]] }, P).ok, true);
  assert.equal(g.grade({ inside: [[true, true, true]] }, P).ok, false);
  assert.ok(g.grade({ inside: [[false, false, false]] }, P).solution.includes('M = {perro, gato}'));
  assert.equal(g.sentence('pez', 'M', false), 'pez ∉ M');
});

// ---------- tacha-repetidos ----------
test('tacha-repetidos: quedan las letras distintas, una vez cada una', () => {
  const g = G('tacha-repetidos');
  assert.equal(J(g.distinct('BANANA')), J(['B', 'A', 'N']));
  const P = { rounds: [{ word: 'BANANA' }] };
  assert.equal(g.grade({ crossed: [[3, 4, 5]] }, P).ok, true);          // B A N | A N A
  assert.equal(g.grade({ crossed: [[1, 2, 5]] }, P).ok, true, 'se puede dejar cualquier copia');
  assert.equal(g.grade({ crossed: [[3, 4]] }, P).ok, false, 'queda una A repetida');
  assert.equal(g.grade({ crossed: [[0, 3, 4, 5]] }, P).ok, false, 'se tachó la única B');
  assert.ok(g.grade({ crossed: [[]] }, P).solution.includes('{B, A, N}'));
});

// ---------- arma-conjunto ----------
test('arma-conjunto: cada ronda pide condiciones y valen varias respuestas', () => {
  const g = G('arma-conjunto');
  const A = ['a', 'b', 'c'];
  assert.equal(g.check([], { size: 0 }), true);
  assert.equal(g.check(['a'], { size: 1, subsetOf: A }), true);
  assert.equal(g.check(['z'], { size: 1, subsetOf: A }), false);
  assert.equal(g.check(['c', 'a', 'b'], { equal: A }), true);
  assert.equal(g.check(['a', 'b'], { equal: A }), false);
  assert.equal(g.check(['x', 'y'], { disjointFrom: A, minSize: 2 }), true);
  assert.equal(g.check(['x', 'a'], { disjointFrom: A }), false);
  assert.equal(g.check(['a', 'b'], { subsetOf: A, contains: ['b'], minSize: 2 }), true);
  const P = { pool: ['a', 'b', 'c', 'x'], rounds: [{ rule: { size: 0 } }, { rule: { size: 1, subsetOf: A } }] };
  assert.equal(g.grade({ picks: [[], ['c']] }, P).ok, true);
  assert.equal(g.grade({ picks: [['a'], ['c']] }, P).ok, false);
  assert.ok(g.grade({ picks: [[], []] }, P).solution.length > 0);
});

// ---------- mueve-circulos ----------
test('mueve-circulos: la relación dibujada sale de la geometría de los círculos', () => {
  const g = G('mueve-circulos');
  assert.equal(g.relationOf(0.2, 0.5), 'sub');
  assert.equal(g.relationOf(0.02, 1), 'equal');
  assert.equal(g.relationOf(1.6, 0.5), 'disjoint');
  assert.equal(g.relationOf(1.0, 0.5), 'overlap');
  assert.equal(g.relationOf(0.3, 1), 'overlap');
});

// ---------- fabrica-subconjuntos ----------
test('fabrica-subconjuntos: 2ⁿ casillas con subconjuntos todos distintos', () => {
  const g = G('fabrica-subconjuntos');
  const P = { rounds: [{ elements: ['a', 'b'] }] };
  const all = [[false, false], [true, false], [false, true], [true, true]];
  assert.equal(g.grade({ slots: [all] }, P).ok, true);
  assert.equal(g.grade({ slots: [[[false, false], [true, false], [true, false], [true, true]]] }, P).ok, false);
  assert.equal(g.subsetText(['a', 'b', 'c'], [true, false, true]), '{a, c}');
});

// ---------- reparte-venn, pinta-venn, encuesta-venn ----------
test('reparte-venn, pinta-venn y encuesta-venn: zonas y conteos', () => {
  const r = { U: ['1', '2', '3', '4', '5'], A: ['1', '2'], B: ['2', '3'] };
  assert.equal(J(G('reparte-venn').zonesOf(r)), J([0, 1, 2, 3, 3]));
  assert.equal(J(G('pinta-venn').targetMasks({ n: 3, f: (a, b, c) => a && (b || c) })), J([3, 5, 7]));
  assert.equal(J(G('encuesta-venn').target({ total: 40, a: 22, b: 18, both: 7 })), J([15, 7, 11, 7]));
});

// ---------- contenido de la unidad 0 ----------
const JUEGOS = ['atrapa-elementos', 'arma-notacion', 'cumple-notacion', 'tacha-repetidos', 'arma-conjunto', 'mueve-circulos', 'fabrica-subconjuntos', 'reparte-venn', 'pinta-venn', 'encuesta-venn'];
const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...JUEGOS.map(n => `js/games/${n}.js`)]);
const alg = get(ctx, 'COURSE_ALGEBRA'), GAMES = get(ctx, 'GAMES');
const unit = alg.units[0];
const lesson = id => unit.lessons.find(l => l.id === id);
const uses = (l, name) => l.ex.filter(e => e.game === name).map(e => e.params);

test('unidad 0: tres lecciones, cada una con su video de respaldo y sus juegos', () => {
  assert.equal(unit.title, 'Conjuntos');
  assert.equal(unit.lessons.map(l => l.id).join(' '), 'alg-0a alg-0b alg-0c');
  const need = {
    'alg-0a': ['arma-notacion', 'cumple-notacion', 'atrapa-elementos', 'tacha-repetidos'],
    'alg-0b': ['arma-conjunto', 'mueve-circulos', 'fabrica-subconjuntos'],
    'alg-0c': ['reparte-venn', 'atrapa-elementos', 'pinta-venn', 'encuesta-venn'],
  };
  for (const [id, games] of Object.entries(need)) {
    const l = lesson(id);
    for (const n of games) assert.ok(uses(l, n).length >= 1, `${id} sin ${n}`);
    assert.ok(l.clip.scenes.length >= 3, `${id}: escenas de respaldo`);
    assert.ok(!l.more || l.more.length === 0, `${id}: un solo video, luego los ejercicios`);
    l.ex.forEach((e, i) => {
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      assert.notEqual(e.type, 'mc', `${id} ejercicio ${i}: opción múltiple`);
    });
  }
});

test('unidad 0: sin números ni desigualdades (aún no se han visto)', () => {
  const text = JSON.stringify(unit.lessons.map(l => ({ ex: l.ex.filter(e => e.type === 'play').map(e => ({ q: e.q, p: e.params })), scenes: l.clip.scenes }))).replace(/\\\\/g, '\\');
  for (const bad of ['ℕ', 'ℤ', '\\mathbb', ' < ', ' ≤ ', '≥', ' > ', 'múltiplo']) assert.ok(!text.includes(bad), `aparece «${bad}»`);
});

test('unidad 0: los ejemplos de los videos no se repiten en los ejercicios', () => {
  const ex = JSON.stringify(unit.lessons.flatMap(l => l.ex)).toLowerCase();
  for (const bad of ['semáforo', 'papaya', '"oso"', 'bogotá', 'amor', 'roma', 'herramienta', 'carla', 'fabio']) assert.ok(!ex.includes(bad), `«${bad}» sale en un video`);
});

test('unidad 0: cada ronda se puede ganar con sus controles', () => {
  const ok = (n, st, P) => assert.equal(GAMES[n].grade(st, P).ok, true, `${n} sin solución`);
  for (const l of unit.lessons) {
    for (const P of uses(l, 'atrapa-elementos')) {
      P.rounds.forEach(r => r.members.forEach(m => assert.ok(r.pool.includes(m), `${m} no está en las fichas`)));
      ok('atrapa-elementos', { picks: P.rounds.map(r => r.members) }, P);
    }
    for (const P of uses(l, 'arma-notacion')) {
      const seqs = P.rounds.map(r => {
        const labels = [r.name, '=', '{', ...r.members.flatMap((m, k) => (k ? [',', m] : [m])), '}'];
        labels.forEach(x => assert.ok(r.chips.includes(x), `falta la ficha ${x}`));
        return labels.map(x => r.chips.indexOf(x));
      });
      ok('arma-notacion', { seqs }, P);
    }
    for (const P of uses(l, 'cumple-notacion')) ok('cumple-notacion', { inside: P.rounds.map(r => r.inside) }, P);
    for (const P of uses(l, 'tacha-repetidos')) {
      const crossed = P.rounds.map(r => [...r.word].map((ch, i) => ([...r.word].indexOf(ch) === i ? -1 : i)).filter(i => i >= 0));
      ok('tacha-repetidos', { crossed }, P);
    }
    for (const P of uses(l, 'arma-conjunto')) {
      const picks = P.rounds.map(r => r.example);
      P.rounds.forEach(r => r.example.forEach(x => assert.ok(P.pool.includes(x), `${x} no está en las fichas`)));
      ok('arma-conjunto', { picks }, P);
    }
    for (const P of uses(l, 'mueve-circulos')) {
      const at = { sub: [0, 0], equal: [0, 0], disjoint: [1.5, 1.2], overlap: [0.9, 0] };
      ok('mueve-circulos', { pos: P.rounds.map(r => at[r.rel]) }, P);
    }
    for (const P of uses(l, 'fabrica-subconjuntos')) {
      const all = P.rounds.map(r => Array.from({ length: 2 ** r.elements.length }, (_, m) => r.elements.map((_, k) => !!(m & (1 << k)))));
      ok('fabrica-subconjuntos', { slots: all }, P);
    }
    for (const P of uses(l, 'reparte-venn')) {
      P.rounds.forEach(r => [...r.A, ...r.B].forEach(x => assert.ok(r.U.includes(x), `${x} fuera de U`)));
      ok('reparte-venn', { zones: P.rounds.map(r => GAMES['reparte-venn'].zonesOf(r)) }, P);
    }
    for (const P of uses(l, 'pinta-venn')) ok('pinta-venn', { masks: P.rounds.map(r => GAMES['pinta-venn'].targetMasks(r)) }, P);
    for (const P of uses(l, 'encuesta-venn')) {
      P.rounds.forEach(r => assert.ok(GAMES['encuesta-venn'].target(r).every(v => v >= 0), r.text));
      ok('encuesta-venn', { counts: P.rounds.map(r => GAMES['encuesta-venn'].target(r)) }, P);
    }
  }
});
