// La lección 1.5 (sumatoria y productoria) debe ser resoluble con los params reales de cada
// ejercicio y sin coma decimal en ningún texto.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
const lesson = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).find(l => l.id === 'alg-15');
const games = get(loadScripts(['js/games/kit.js', 'js/games/arma-sigma.js', 'js/games/ordena-terminos.js', 'js/games/verdadero-falso.js',
  'js/games/suma-filas.js', 'js/games/torre-producto.js', 'js/games/clasifica-cartas.js']), 'GAMES');
const exs = g => lesson.ex.filter(e => e.game === g);

function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out));
  return out;
}

test('alg-15: siete ejercicios, todos juegos', () => {
  assert.equal(lesson.ex.length, 7);
  assert.ok(lesson.ex.every(e => e.type === 'play'));
});

test('alg-15: ningún texto usa coma decimal', () => {
  assert.deepEqual(strings([lesson.ex, lesson.clip]).filter(s => /\d,\d/.test(s)), []);
});

test('alg-15: cada juego se resuelve con sus params reales', () => {
  const sigma = exs('arma-sigma')[0].params;
  const rounds = sigma.rounds.map(r => ({ cells: { lower: r.chips.findIndex(c => c.cell === 'lower'), upper: r.chips.findIndex(c => c.cell === 'upper'), term: r.chips.findIndex(c => c.cell === 'term') } }));
  assert.ok(rounds.every(r => r.cells.lower >= 0 && r.cells.upper >= 0 && r.cells.term >= 0));
  assert.equal(games['arma-sigma'].grade({ rounds }, sigma).ok, true);
  for (const e of exs('ordena-terminos')) {
    assert.ok(e.params.order.every(j => e.params.chips[j] !== undefined));
    assert.equal(games['ordena-terminos'].grade({ boxes: [...e.params.order] }, e.params).ok, true);
  }
  for (const e of exs('verdadero-falso')) assert.equal(games['verdadero-falso'].grade({ answers: e.params.cards.map(c => c.truth) }, e.params).ok, true);
  assert.equal(games['suma-filas'].grade({ rows: 12 }, exs('suma-filas')[0].params).ok, true);
  assert.equal(games['torre-producto'].grade({ n: 7 }, exs('torre-producto')[0].params).ok, true);
  for (const e of exs('clasifica-cartas')) assert.equal(games['clasifica-cartas'].grade({ answers: e.params.cards.map(c => c.side) }, e.params).ok, true);
});

test('alg-15: los términos desplegados de la sigma son los valores de k² − 1 para k = 2..5', () => {
  const e = exs('ordena-terminos')[0];
  const values = e.params.order.map(j => +e.params.chips[j]);
  assert.equal(values.join(','), [2, 3, 4, 5].map(k => k * k - 1).join(','));
  assert.equal(values.reduce((a, b) => a + b, 0), +e.params.result);
});

// Cada ficha distractora de «ordena-terminos» (k² − 1) debe ser un valor fuera del rango k = 2..5,
// y la explicación debe atribuirla al k correcto (0 ↔ k = 1, 35 ↔ k = 6).
test('alg-15: los distractores de la sigma desplegada son 0 (k = 1) y 35 (k = 6)', () => {
  const e = exs('ordena-terminos')[0];
  const extras = e.params.chips.filter((_, j) => !e.params.order.includes(j)).map(Number).sort((a, b) => a - b);
  assert.equal(extras.join(','), '0,35');
  assert.ok(e.explain.includes('el 0 ($k = 1$)') && e.explain.includes('el 35 ($k = 6$)'));
});
