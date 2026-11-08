// Juegos de la unidad 1 de Cálculo (desigualdades, valor absoluto, plano y recta): calificación (grade)
// y funciones puras. Spec 2026-11-07-calculo-unidad-1.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const J = v => JSON.stringify(v);

// ---------- semaforo-signos ----------
const sem = G('semaforo-signos');
const prod = { txt: '(x − 1)(x + 3) ≤ 0', factors: [{ txt: 'x − 1', root: 1, s: 1 }, { txt: 'x + 3', root: -3, s: 1 }], rel: '<=' };
const quot = { txt: '(x + 2)/(x − 4) ≥ 0', factors: [{ txt: 'x + 2', root: -2, s: 1 }, { txt: 'x − 4', root: 4, s: 1, den: true }], rel: '>=' };

test('semaforo-signos: puntos críticos ordenados y signo de cada factor por tramo', () => {
  assert.equal(J(sem.truth(prod)), J({ crit: [-3, 1], cells: [[-1, -1, 1], [-1, 1, 1]], product: [1, -1, 1], picks: [false, true, false], dots: [true, true] }));
  assert.equal(sem.signAt({ root: 3, s: -1 }, 5), -1, '3 − x es negativo a la derecha de 3');
  assert.equal(J(sem.truth(quot).dots), J([true, false]), 'el cero del denominador nunca entra');
});

test('semaforo-signos: solución en notación de intervalos', () => {
  assert.equal(sem.solutionText(prod), '[−3, 1]');
  assert.equal(sem.solutionText(quot), '(−∞, −2] ∪ (4, ∞)');
});

test('semaforo-signos: correcto solo con casillas, tramos y puntos bien puestos', () => {
  const t = sem.truth(prod), params = { rounds: [prod] };
  const good = { rounds: [{ cells: t.cells, picks: t.picks, dots: t.dots }] };
  assert.equal(sem.grade(good, params).ok, true);
  assert.equal(sem.grade({ rounds: [{ ...good.rounds[0], dots: [false, true] }] }, params).ok, false, 'el −3 sí entra');
  assert.equal(sem.grade({ rounds: [{ ...good.rounds[0], picks: [true, true, false] }] }, params).ok, false);
  const r = sem.grade({ rounds: [{ cells: [[1, -1, 1], [-1, 1, 1]], picks: t.picks, dots: t.dots }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('[−3, 1]'), r.solution);
});

// ---------- sombra-equivalente ----------
const som = G('sombra-equivalente');
const start = { a: -2, b: 5, rel: '>=', c: 3, d: 7 };   // 5 − 2x ≥ 3x + 7
const chips = [{ op: '+', k: -3, x: true }, { op: '+', k: -5 }, { op: '/', k: -5 }, { op: '+', k: 2, x: true }];

test('sombra-equivalente: el conjunto de una desigualdad lineal y las fichas', () => {
  assert.equal(J(som.setOf(start)), J({ p: -0.4, rel: '<=' }));
  assert.equal(som.chipText(chips[0]), '−3x');
  assert.equal(som.chipText(chips[2]), '÷(−5)');
  assert.equal(som.chipText({ op: '*', k: -1 }), '×(−1)');
  assert.equal(som.frac(-0.4), '−2/5');
  assert.equal(som.formText({ a: 1, b: 0, rel: '<=', c: 0, d: -0.4 }), 'x ≤ −2/5');
});

test('sombra-equivalente: dividir entre un negativo sin voltear el signo no vale', () => {
  const params = { rounds: [{ start, chips }] };
  assert.equal(som.grade({ rounds: [{ ops: [0, 1, 2] }] }, params).ok, false, 'quedó x ≥ −2/5');
  assert.equal(som.grade({ rounds: [{ ops: [0, 1, 2, 'flip'] }] }, params).ok, true);
  assert.equal(som.grade({ rounds: [{ ops: [0, 1] }] }, params).ok, false, 'x no está despejada');
  assert.ok(som.grade({ rounds: [{ ops: [] }] }, params).solution.includes('x ≤ −2/5'));
});

// ---------- correa-del-perro ----------
const cor = G('correa-del-perro');
test('correa-del-perro: zona adentro o afuera, con o sin puntas', () => {
  assert.equal(cor.setText({ c: -2, r: 3, out: false, closed: false }), '(−5, 1)');
  assert.equal(cor.setText({ c: 3, r: 2, out: true, closed: true }), '(−∞, 1] ∪ [5, ∞)');
  const params = { rounds: [{ c: -2, r: 3, out: false, closed: false }, { c: 3, r: 2, out: true, closed: true }] };
  assert.equal(cor.grade({ vals: params.rounds.map(v => ({ ...v })) }, params).ok, true);
  const r = cor.grade({ vals: [{ c: -2, r: 3, out: false, closed: true }, { c: 3, r: 2, out: true, closed: true }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('(−5, 1)'), r.solution);
});

// ---------- candado-absoluto ----------
const can = G('candado-absoluto');
test('candado-absoluto: escribe |x − c| con el signo correcto y abre solo con las tres ruedas bien', () => {
  assert.equal(can.texOf({ c: -3, rel: '<=', r: 2 }), '|x + 3| \\le 2');
  assert.equal(can.texOf({ c: 4, rel: '>', r: 1.5 }), '|x - 4| > 1.5');
  assert.equal(can.texOf({ c: 0, rel: '<', r: 5 }), '|x| < 5');
  const params = { rounds: [{ c: -3, rel: '<=', r: 2 }] };
  assert.equal(can.grade({ vals: [{ c: -3, rel: '<=', r: 2 }] }, params).ok, true);
  assert.equal(can.grade({ vals: [{ c: 3, rel: '<=', r: 2 }] }, params).ok, false, 'centro con el signo cambiado');
  assert.equal(can.grade({ vals: [{ c: -3, rel: '<', r: 2 }] }, params).ok, false);
});

// ---------- tirolesa ----------
const tir = G('tirolesa');
test('tirolesa: la distancia entre las torres, con tolerancia de una décima', () => {
  assert.equal(tir.dist([1, 2], [4, 6]), 5);
  assert.equal(tir.target([-1, -2], [3, 5]), 8.1);   // √65 ≈ 8.06
  const params = { rounds: [{ A: [1, 2], B: [4, 6] }, { A: [-1, -2], B: [3, 5] }] };
  assert.equal(tir.grade({ lens: [5, 8.1] }, params).ok, true);
  assert.equal(tir.grade({ lens: [5, 8] }, params).ok, false);
  assert.ok(tir.grade({ lens: [5, 8] }, params).solution.includes('\\sqrt{65}'));
});

// ---------- balancin ----------
const bal = G('balancin');
test('balancin: el apoyo se equilibra en el promedio ponderado de los extremos', () => {
  assert.equal(bal.targetT({ mA: 1, mB: 1 }), 0.5);
  assert.equal(bal.targetT({ mA: 2, mB: 1 }), 1 / 3);
  assert.equal(J(bal.pointAt([-2, 1], [4, 7], 1 / 3)), J([0, 3]));
  const params = { rounds: [{ A: [-2, 1], B: [4, 7], mA: 2, mB: 1 }] };
  assert.equal(bal.grade({ ts: [4 / 12] }, params).ok, true);
  const r = bal.grade({ ts: [0.5] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('(0, 3)'), r.solution);
});

// ---------- cuerdas-iguales ----------
const cue = G('cuerdas-iguales');
test('cuerdas-iguales: el punto del riel que está a igual distancia de A y de B', () => {
  // (0, y): 4 + (y − 1)² = 16 + (y − 5)²  ⇒  8y = 36  ⇒  y = 4.5
  assert.equal(cue.target({ A: [2, 1], B: [4, 5], rail: 'y' }), 4.5);
});

test('cuerdas-iguales: correcto si las dos cuerdas miden lo mismo', () => {
  const round = { A: [-4, 1], B: [2, 5], rail: 'x' };
  const p = cue.target(round);
  const d = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  assert.ok(Math.abs(d([p, 0], round.A) - d([p, 0], round.B)) < 1e-9);
  assert.equal(cue.grade({ ps: [p] }, { rounds: [round] }).ok, true);
  assert.equal(cue.grade({ ps: [p + 0.5] }, { rounds: [round] }).ok, false);
});

// ---------- laser-recta ----------
const las = G('laser-recta');
test('laser-recta: la recta de las perillas y si pasa por los cristales', () => {
  assert.equal(las.lineText({ rise: 2, run: 3, b: 1 }), 'y = 2/3 x + 1');
  assert.equal(las.lineText({ rise: -4, run: 2, b: 0 }), 'y = −2x');
  assert.equal(las.lineText({ rise: 0, run: 1, b: -1.5 }), 'y = −1.5');
  const params = { rounds: [{ P: [-3, -1], Q: [3, 3] }] };
  assert.equal(las.grade({ vals: [{ rise: 2, run: 3, b: 1 }] }, params).ok, true);
  assert.equal(las.grade({ vals: [{ rise: 4, run: 6, b: 1 }] }, params).ok, true, 'fracción sin simplificar también vale');
  const r = las.grade({ vals: [{ rise: 2, run: 3, b: 0 }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('\\tfrac{2}{3}'), r.solution);
});

// ---------- rieles-paralelos ----------
const rie = G('rieles-paralelos');
test('rieles-paralelos: la pendiente pedida para paralela y perpendicular (y la vertical)', () => {
  assert.equal(rie.targetSlope({ base: { m: 2 / 3 }, mode: 'par' }), 2 / 3);
  assert.equal(rie.targetSlope({ base: { m: -4 }, mode: 'perp' }), 0.25);
  assert.equal(rie.targetSlope({ base: { m: 0 }, mode: 'perp' }), 'v');
  assert.equal(rie.targetSlope({ base: { m: 'v' }, mode: 'perp' }), 0);
  assert.ok(rie.SLOPES.includes(0.25) && rie.SLOPES.includes('v'));
  const params = { rounds: [{ base: { m: 2 / 3, b: -2 }, through: [-1, 2], mode: 'par' }, { base: { m: 0, b: 1 }, through: [2, -1], mode: 'perp' }] };
  assert.equal(rie.grade({ slopes: [2 / 3, 'v'] }, params).ok, true);
  assert.equal(rie.grade({ slopes: [-3 / 2, 'v'] }, params).ok, false);
  assert.equal(rie.slopeText(-1.5), '−3/2');
  assert.equal(rie.slopeText('v'), 'vertical');
});
