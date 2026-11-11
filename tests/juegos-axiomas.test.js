// Juegos de la lección de axiomas de campo y orden (alg-12b): el atajo de los axiomas (reescribir
// una expresión aplicando axiomas hasta la meta), la máquina de multiplicar (ley de signos) y dobla
// la recta (el valor absoluto como espejo en el cero).
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const atajo = loadGame('js/games/atajo-axiomas.js')['atajo-axiomas'];
const maquina = loadGame('js/games/arma-producto.js')['arma-producto'];
const dobla = loadGame('js/games/dobla-la-recta.js')['dobla-la-recta'];

const R1 = {
  start: '(4 + a) + (−4)', target: 'a',
  states: {
    '(4 + a) + (−4)': { Conmutativa: '(a + 4) + (−4)', Asociativa: '4 + (a + (−4))' },
    '(a + 4) + (−4)': { Asociativa: 'a + (4 + (−4))' },
    'a + (4 + (−4))': { Inverso: 'a + 0' },
    'a + 0': { Neutro: 'a' },
    '4 + (a + (−4))': { Conmutativa: '4 + ((−4) + a)' },
    '4 + ((−4) + a)': { Asociativa: '(4 + (−4)) + a' },
    '(4 + (−4)) + a': { Inverso: '0 + a' },
    '0 + a': { Neutro: 'a' },
  },
};
const R2 = {
  start: '(1/3) · (3 · b)', target: 'b',
  states: { '(1/3) · (3 · b)': { Asociativa: '((1/3) · 3) · b' }, '((1/3) · 3) · b': { Inverso: '1 · b' }, '1 · b': { Neutro: 'b' } },
};

test('atajo: el camino más corto de cada ronda, en nombres de axiomas', () => {
  assert.equal(atajo.shortest(R1).join(' → '), 'Conmutativa → Asociativa → Inverso → Neutro');
  assert.equal(atajo.shortest(R2).join(' → '), 'Asociativa → Inverso → Neutro');
});

test('atajo: correcto si cada ronda llega a su meta por movimientos válidos', () => {
  const params = { rounds: [R1, R2] };
  const ok = { paths: [['(4 + a) + (−4)', '4 + (a + (−4))', '4 + ((−4) + a)', '(4 + (−4)) + a', '0 + a', 'a'], ['(1/3) · (3 · b)', '((1/3) · 3) · b', '1 · b', 'b']] };
  assert.equal(atajo.grade(ok, params).ok, true, 'un camino largo también vale');
  const r = atajo.grade({ paths: [['(4 + a) + (−4)', '(a + 4) + (−4)'], ok.paths[1]] }, params);
  assert.equal(r.ok, false, 'a medio camino');
  assert.ok(r.solution.includes('Conmutativa → Asociativa → Inverso → Neutro'), r.solution);
  assert.equal(atajo.grade({ paths: [['(4 + a) + (−4)', 'a'], ok.paths[1]] }, params).ok, false, 'un salto que no es un axioma');
});

test('máquina: el producto de las fichas elegidas da la meta (con al menos dos fichas)', () => {
  const params = { tiles: [-3, 2, -1, 4, -2, 0], rounds: [{ target: 12 }, { target: -24 }, { target: 6 }] };
  assert.equal(maquina.product([-3, -1, 4]), 12);
  assert.equal(maquina.grade({ picks: [[0, 2, 3], [0, 1, 3], [0, 4]] }, params).ok, true);
  assert.equal(maquina.grade({ picks: [[0, 1, 4], [0, 1, 3], [0, 4]] }, params).ok, true, '(−3)·2·(−2) = 12 también vale');
  const r = maquina.grade({ picks: [[0, 3], [0, 1, 3], [0, 4]] }, params);
  assert.equal(r.ok, false, '(−3)·4 = −12, no 12');
  assert.ok(r.solution.includes('12'), r.solution);
  assert.equal(maquina.grade({ picks: [[0, 2, 3], [0, 1, 3], [0, 4, 5]] }, params).ok, false, 'con el 0 todo da 0');
});

test('dobla la recta: |x| es el reflejo de x en el cero (con tolerancia)', () => {
  const params = { min: -3, max: 3, tol: 0.1, points: [{ inside: -0.2679, tex: '|\\sqrt3 - 2|', sol: '2 - \\sqrt3 \\approx 0.27' }, { inside: 0.7639, tex: '|3 - \\sqrt5|', sol: '3 - \\sqrt5 \\approx 0.76' }] };
  assert.equal(dobla.grade({ answers: [0.27, 0.76] }, params).ok, true);
  const r = dobla.grade({ answers: [-0.27, 0.76] }, params);
  assert.equal(r.ok, false, 'el valor absoluto nunca es negativo');
  assert.ok(r.solution.includes('2 - \\sqrt3 \\approx 0.27'), r.solution);
  assert.equal(dobla.grade({ answers: [0.27, null] }, params).ok, false);
});

const { loadScripts, get } = require('./load');
const L = get(loadScripts(['js/content.js', 'js/courses/algebra.js']), 'COURSE_ALGEBRA').units.flatMap(u => u.lessons);
const l12 = L.find(l => l.id === 'alg-12b');
// Spec 2026-11-11-axiomas-desde-cero: la antigua alg-12b se repartió en alg-12b (campo), alg-12c (consecuencias) y alg-12d (orden).
const ax = ['alg-12b', 'alg-12c', 'alg-12d'].map(id => L.find(l => l.id === id));
const axEx = ax.flatMap(l => l.ex);

test('alg-12b: el video viejo de la Clase 7 se reemplazó por F1 (escenas de respaldo hasta tener su ID)', () => {
  assert.notEqual(l12.clip.bunny, '1992ff97-e3e7-438e-b9c4-8d79b91865a8');
  assert.ok(l12.clip.scenes.length >= 3);
  assert.ok(!l12.more || !l12.more.length, 'es un solo video');
});

test('axiomas: solo juegos (y algún cálculo), con los tres de antes y sin tarjetas, etiquetas ni opción múltiple', () => {
  const games = axEx.map(e => (e.type === 'play' ? e.game : e.type));
  for (const g of ['atajo-axiomas', 'arma-producto', 'dobla-la-recta']) assert.ok(games.includes(g), `falta ${g}`);
  for (const g of ['mc', 'order', 'verdadero-falso', 'clasifica-cartas', 'reglas-del-juego']) assert.ok(!games.includes(g), `sigue ${g}`);
  assert.ok(l12.ex.length >= 5);
  assert.ok(games.filter(g => g === 'input').length <= 2, 'demasiados cálculos sueltos');
});

test('alg-12b: las explicaciones y pistas no tienen comandos de KaTeX rotos (\\cdot, \\tfrac sin barra)', () => {
  for (const e of axEx) for (const s of [e.explain, e.hint]) {
    assert.ok(!/\tfrac|(^|[^\\a-z])cdot/.test(s), `fórmula rota en «${s.slice(0, 60)}»`);
  }
});

test('alg-12b: las rondas del atajo son coherentes (cada meta se alcanza desde su inicio)', () => {
  const ex = l12.ex.find(e => e.game === 'atajo-axiomas');
  for (const r of ex.params.rounds) assert.ok(atajo.shortest(r).length >= 2, `${r.start} no llega a ${r.target}`);
  const m = axEx.find(e => e.game === 'arma-producto');
  for (const r of m.params.rounds) assert.equal(maquina.grade({ picks: [[]] }, { tiles: m.params.tiles, rounds: [r] }).solution.includes('$' + r.target + '$'), false, `la meta ${r.target} no se puede armar`);
});
