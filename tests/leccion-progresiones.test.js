// La lección 1.4 (progresiones) debe ser resoluble con los params reales de cada ejercicio, con el
// video 2 tras el quinto ejercicio y sin coma decimal en ningún texto.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
const lesson = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).find(l => l.id === 'alg-14');
const buildQueue = get(ctx, 'buildQueue');
const games = get(loadScripts(['js/games/kit.js', 'js/games/clasifica-cartas.js', 'js/games/escalera-aritmetica.js', 'js/games/parejas-gauss.js',
  'js/games/rellena-medios.js', 'js/games/suma-filas.js', 'js/games/limite-serie.js', 'js/games/torre-producto.js', 'js/games/verdadero-falso.js']), 'GAMES');
const exs = g => lesson.ex.filter(e => e.game === g);

function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out));
  return out;
}

test('alg-14: diez ejercicios, el video 2 entra tras el quinto', () => {
  assert.equal(lesson.ex.length, 10);
  assert.equal(lesson.more[0].after, 5);
  const q = JSON.parse(JSON.stringify(buildQueue(lesson))).map(t => t.k + (t.n ?? t.i)).join(' ');
  assert.equal(q, 'clip0 ex0 ex1 ex2 ex3 ex4 clip1 ex5 ex6 ex7 ex8 ex9');
});

test('alg-14: ningún texto usa coma decimal', () => {
  assert.deepEqual(strings([lesson.ex, lesson.clip, lesson.more]).filter(s => /\d,\d/.test(s)), []);
});

test('alg-14: cada juego se resuelve con sus params reales', () => {
  for (const e of exs('clasifica-cartas')) assert.equal(games['clasifica-cartas'].grade({ answers: e.params.cards.map(c => c.side) }, e.params).ok, true);
  assert.equal(games['escalera-aritmetica'].grade({ d: 4 }, exs('escalera-aritmetica')[0].params).ok, true);
  assert.equal(games['parejas-gauss'].grade({ pairs: [[0, 10], [1, 9], [2, 8], [3, 7], [4, 6]] }, exs('parejas-gauss')[0].params).ok, true);
  for (const e of exs('rellena-medios')) {
    const want = games['rellena-medios'].means(e.params);
    const slots = want.map(v => e.params.chips.indexOf(v));
    assert.ok(slots.every(j => j >= 0), 'falta un medio entre las fichas');
    assert.equal(games['rellena-medios'].grade({ slots }, e.params).ok, true);
  }
  assert.equal(games['suma-filas'].grade({ rows: 10 }, exs('suma-filas')[0].params).ok, true);
  assert.equal(games['limite-serie'].grade({ guess: 13.5 }, exs('limite-serie')[0].params).ok, true);
  assert.equal(games['torre-producto'].grade({ n: 7 }, exs('torre-producto')[0].params).ok, true);
  for (const e of exs('verdadero-falso')) assert.equal(games['verdadero-falso'].grade({ answers: e.params.cards.map(c => c.truth) }, e.params).ok, true);
});

test('alg-14: las cartas aritmética/geométrica tienen razón o diferencia constante según su lado', () => {
  const e = exs('clasifica-cartas')[0];
  for (const c of e.params.cards) {
    const nums = c.text.replace(/…/g, '').split(',').map(s => s.trim()).filter(s => /^-?[\d.]+$/.test(s.replace('−', '-'))).map(s => +s.replace('−', '-'));
    const diffs = nums.slice(1).map((v, i) => v - nums[i]), ratios = nums.slice(1).map((v, i) => v / nums[i]);
    const constant = a => a.every(x => Math.abs(x - a[0]) < 1e-9);
    assert.equal(constant(diffs) ? 'left' : constant(ratios) ? 'right' : 'none', c.side, c.text);
  }
});
