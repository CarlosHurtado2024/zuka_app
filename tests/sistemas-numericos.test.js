// Álgebra 1.1 en tres lecciones (spec 2026-11-11-sistemas-numericos-desde-cero): juego recta-espejo y contenido.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, loadScripts, get } = require('./load');

test('recta-espejo: el punto puesto es el entero pedido', () => {
  const g = loadGame('js/games/recta-espejo.js')['recta-espejo'];
  const P = { min: -6, max: 6, rounds: [{ text: 'el opuesto de 5', value: -5 }, { text: '−(−3)', value: 3 }] };
  assert.equal(g.grade({ xs: [-5, 3] }, P).ok, true);
  assert.equal(g.grade({ xs: [5, 3] }, P).ok, false);
  assert.equal(g.grade({ xs: [-5, null] }, P).ok, false);
  assert.ok(g.grade({ xs: [null, null] }, P).solution.includes('−5'));
  assert.equal(g.snap(2.4, -6, 6), 2);
  assert.equal(g.snap(-9, -6, 6), -6);
});

const GAMES = ['atrapa-elementos', 'ascensor', 'recta-espejo', 'pasaporte-numeros', 'fuga-de-familia', 'pizzeria', 'candado-fraccion', 'pon-la-rayita', 'ordena-terminos', 'acorrala-raiz', 'compas-raiz', 'lupa-densidad', 'cajas-numericas', 'ubica-en-recta'];
const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...GAMES.map(n => `js/games/${n}.js`)]);
const alg = get(ctx, 'COURSE_ALGEBRA'), G = get(ctx, 'GAMES');
const lesson = id => alg.units.flatMap(u => u.lessons).find(l => l.id === id);
const uses = (l, n) => l.ex.filter(e => e.game === n);

test('sistemas numéricos: tres lecciones seguidas, cada una con su video y luego sus ejercicios', () => {
  const unit = alg.units.find(u => u.lessons.some(l => l.id === 'alg-11'));
  assert.equal(unit.lessons.slice(0, 3).map(l => l.id).join(' '), 'alg-11 alg-11b alg-11c');
  const need = {
    'alg-11': ['atrapa-elementos', 'ascensor', 'recta-espejo', 'pasaporte-numeros', 'fuga-de-familia'],
    'alg-11b': ['pizzeria', 'candado-fraccion', 'pon-la-rayita', 'ordena-terminos', 'pasaporte-numeros', 'atrapa-elementos'],
    'alg-11c': ['acorrala-raiz', 'compas-raiz', 'lupa-densidad', 'cajas-numericas', 'ubica-en-recta', 'atrapa-elementos'],
  };
  for (const [id, games] of Object.entries(need)) {
    const l = lesson(id);
    for (const n of games) assert.ok(uses(l, n).length, `${id} sin ${n}`);
    assert.ok(l.clip.scenes.length >= 3, `${id}: escenas de respaldo`);
    assert.ok(!l.more || !l.more.length, `${id}: un solo video y luego los ejercicios`);
    l.ex.forEach((e, i) => {
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      assert.notEqual(e.type, 'mc');
    });
  }
});

test('sistemas numéricos: cada familia aparece en su lección (sin adelantarse)', () => {
  const sets = l => uses(l, 'pasaporte-numeros').flatMap(e => e.params.sets);
  assert.ok(!sets(lesson('alg-11')).includes('Q'), 'alg-11 todavía no ve ℚ');
  for (const e of uses(lesson('alg-11'), 'fuga-de-familia')) assert.ok(e.params.rounds.every(r => r.set === 'N'));
  for (const e of uses(lesson('alg-11b'), 'fuga-de-familia')) assert.ok(e.params.rounds.every(r => r.set === 'Z'));
  for (const e of uses(lesson('alg-11c'), 'fuga-de-familia')) assert.ok(e.params.rounds.every(r => r.set === 'I'));
});

test('sistemas numéricos: los ejemplos de los videos no se repiten en los ejercicios', () => {
  const bad = {
    'alg-11': ['2 − 5', 'manzana', 'el opuesto de 0'],
    'alg-11b': ['3/4', '0.75', '2/11', '0.1818', '0.777', '7/9', '−3/1', '3/6'],
    'alg-11c': ['1.42', '1.96', 'π = 3.14159', '−5/2', '7/2', '√11', '√3'],
  };
  // alg-11 todavía no enseña fracciones (N1), y alg-11c solo usa irracionales que el video N3 presentó
  // (raíces no exactas y π): nada de e.
  assert.ok(!JSON.stringify(lesson('alg-11').ex.map(e => e.params)).includes('/'), 'alg-11 usa fracciones');
  assert.ok(!JSON.stringify(lesson('alg-11c').ex).includes('"label":"e"'), 'alg-11c usa e');
  for (const [id, words] of Object.entries(bad)) {
    const t = JSON.stringify(lesson(id).ex);
    for (const w of words) assert.ok(!t.includes(w), `${id}: «${w}» sale en el video`);
  }
});

test('sistemas numéricos: cada ronda de atrapa y recta-espejo se puede ganar', () => {
  for (const id of ['alg-11', 'alg-11b', 'alg-11c']) {
    for (const e of uses(lesson(id), 'atrapa-elementos')) {
      e.params.rounds.forEach(r => r.members.forEach(m => assert.ok(r.pool.includes(m), `${id}: ${m} no está`)));
      assert.equal(G['atrapa-elementos'].grade({ picks: e.params.rounds.map(r => r.members) }, e.params).ok, true);
    }
    for (const e of uses(lesson(id), 'recta-espejo')) {
      const P = e.params;
      P.rounds.forEach(r => assert.ok(Number.isInteger(r.value) && r.value >= P.min && r.value <= P.max, r.text));
      assert.equal(G['recta-espejo'].grade({ xs: P.rounds.map(r => r.value) }, P).ok, true);
    }
  }
});

test('sistemas numéricos: el video N1 (alg-11) es el nuevo de Bunny', () => {
  const c = lesson('alg-11').clip;
  assert.equal(c.bunny, '44717b9d-7851-4cd6-a19a-d17070db835a');
  assert.equal(c.duration, 269);
  assert.ok(c.scenes.length >= 3);
});
