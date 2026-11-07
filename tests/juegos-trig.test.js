// Juegos de la unidad 1 de Trigonometría: rueda del ángulo, corta la pizza, arma el triángulo, mide
// la altura, atrapa el punto, la noria y sintoniza la onda. Se prueba la calificación (grade) y las
// funciones puras que cada juego exporta.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const rueda = G('rueda-angulo'), pizza = G('corta-pizza'), tri = G('arma-triangulo'), altura = G('mide-altura');
const punto = G('atrapa-punto'), noria = G('noria'), onda = G('sintoniza-onda');

test('rueda: fmtRad escribe los grados como múltiplos de π', () => {
  const s = [150, -135, 420, 180, 0, 90, 45, -30, 720].map(rueda.fmtRad).join(' | ');
  assert.equal(s, '5π/6 | −3π/4 | 7π/3 | π | 0 | π/2 | π/4 | −π/6 | 4π');
});

test('rueda: correcto si cada giro (con vueltas y signo) llega al ángulo pedido', () => {
  const params = { snap: 15, rounds: [{ target: 150, tex: '\\tfrac{5\\pi}{6}' }, { target: -135, tex: '-\\tfrac{3\\pi}{4}' }, { target: 405, tex: '405^\\circ' }] };
  assert.equal(rueda.grade({ angles: [150, -135, 405] }, params).ok, true);
  assert.equal(rueda.grade({ angles: [150, 225, 405] }, params).ok, false, '225° es coterminal, pero el giro pedido es negativo');
  const r = rueda.grade({ angles: [150, -135, 45] }, params);
  assert.equal(r.ok, false, '45° no son 405°: falta una vuelta');
  assert.ok(r.solution.includes('405^\\circ = 405^\\circ') || r.solution.includes('405'), r.solution);
  assert.equal(rueda.grade({ angles: [150, null, 405] }, params).ok, false);
});

test('pizza: arco y área de una porción, y la meta con tolerancia', () => {
  const m = pizza.measure({ deg: 120, r: 6 });
  assert.ok(Math.abs(m.arc - 4 * Math.PI) < 1e-9 && Math.abs(m.area - 12 * Math.PI) < 1e-9);
  const params = { rounds: [{ goal: 'arc', value: 4 * Math.PI, r: 6 }, { goal: 'area', value: 6 * Math.PI, r: 4 }, { goal: 'arc', value: 2 * Math.PI, deg: 60, rMin: 2, rMax: 10 }] };
  assert.equal(pizza.grade({ cuts: [{ deg: 120, r: 6 }, { deg: 135, r: 4 }, { deg: 60, r: 6 }] }, params).ok, true);
  const r = pizza.grade({ cuts: [{ deg: 120, r: 6 }, { deg: 90, r: 4 }, { deg: 60, r: 6 }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('135'), r.solution);
});

test('triángulo: las seis razones de unos catetos, y la meta exacta', () => {
  const v = ['sen', 'cos', 'tan', 'csc', 'sec', 'cot'].map(f => tri.ratio(f, 4, 3).toFixed(4)).join(' ');
  assert.equal(v, '0.6000 0.8000 0.7500 1.6667 1.2500 1.3333');
  const params = { max: 12, rounds: [{ fn: 'sen', num: 3, den: 5 }, { fn: 'cos', num: 12, den: 13 }] };
  assert.equal(tri.grade({ legs: [{ a: 8, b: 6 }, { a: 12, b: 5 }] }, params).ok, true, 'semejante también vale');
  const r = tri.grade({ legs: [{ a: 3, b: 4 }, { a: 12, b: 5 }] }, params);
  assert.equal(r.ok, false, 'con catetos 3 y 4 al revés el seno es 4/5');
  assert.ok(r.solution.includes('\\frac{3}{5}'), r.solution);
});

test('altura: el ángulo de elevación desde la distancia elegida', () => {
  assert.ok(Math.abs(altura.angleAt(30, 30) - 45) < 1e-9);
  const params = { rounds: [{ kind: 'edificio', h: 30, angle: 45, maxD: 60 }, { kind: 'arbol', h: 12, angle: 60, maxD: 30 }, { kind: 'faro', h: 40, angle: 25, mode: 'dep', maxD: 120 }] };
  assert.equal(altura.grade({ ds: [30, 7, 86] }, params).ok, true);
  const r = altura.grade({ ds: [30, 12, 86] }, params);
  assert.equal(r.ok, false, 'a 12 m del árbol se ve a 45°');
  assert.ok(r.solution.includes('6.93'), r.solution);
});

test('atrapa el punto: vale cualquiera de los ángulos aceptados', () => {
  const params = { rounds: [{ prompt: '(−1/2, √3/2)', angles: [120] }, { prompt: 'sen θ = 1/2', angles: [30, 150] }] };
  assert.equal(punto.grade({ picks: [120, 150] }, params).ok, true);
  assert.equal(punto.grade({ picks: [120, 30] }, params).ok, true);
  const r = punto.grade({ picks: [60, 30] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('120'), r.solution);
  assert.equal(punto.POINTS.length, 16);
});

test('noria: condiciones de signo y de ángulo de referencia', () => {
  assert.equal(noria.fits(225, { sen: '-', tan: '+' }), true);
  assert.equal(noria.fits(180, { sen: '-', tan: '+' }), false, 'sobre un eje el seno es 0');
  assert.equal(noria.fits(150, { ref: 30, cos: '-', sen: '+' }), true);
  assert.equal(noria.fits(210, { ref: 30, cos: '-', sen: '+' }), false);
  assert.equal(noria.refOf(300), 60);
  const params = { rounds: [{ prompt: 'a', sen: '-', tan: '+' }, { prompt: 'b', ref: 60, cos: '+', sen: '-' }] };
  assert.equal(noria.grade({ angles: [210, 300] }, params).ok, true);
  const r = noria.grade({ angles: [210, 60] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('300'), r.solution);
});

test('onda: coincide si la función es la misma, aunque los números sean otros', () => {
  const params = { rounds: [{ fn: 'sen', target: { a: 3, b: 1, cq: 0, d: 0 }, knobs: ['a'] }, { fn: 'sen', target: { a: 1, b: 2, cq: 1, d: 0 }, knobs: ['b', 'c'] }] };
  assert.equal(onda.grade({ vals: [{ a: 3, b: 1, cq: 0, d: 0 }, { a: 1, b: 2, cq: 1, d: 0 }] }, params).ok, true);
  assert.equal(onda.grade({ vals: [{ a: -3, b: 1, cq: 4, d: 0 }, { a: 1, b: 2, cq: 1, d: 0 }] }, params).ok, true, '−3 sen(x − π) = 3 sen x');
  const r = onda.grade({ vals: [{ a: 2, b: 1, cq: 0, d: 0 }, { a: 1, b: 2, cq: 1, d: 0 }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('3\\operatorname{sen}'), r.solution);
  assert.equal(onda.texOf('cos', { a: -2, b: 1, cq: 0, d: 0 }), 'y = -2\\cos x');
  assert.equal(onda.texOf('sen', { a: 1, b: 2, cq: 2, d: 1 }), 'y = \\operatorname{sen}\\left(2x - \\tfrac{\\pi}{2}\\right) + 1');
});
