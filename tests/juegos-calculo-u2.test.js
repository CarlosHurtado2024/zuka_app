// Juegos de la unidad 2 de Cálculo (funciones): calificación (grade) y funciones puras.
// Spec 2026-11-08-calculo-unidad-2.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const J = v => JSON.stringify(v);

// ---------- proyector-sombras ----------
test('proyector-sombras: intervalos con ∞ y calificación', () => {
  const g = G('proyector-sombras');
  assert.equal(g.ivText([0, null, true, false]), '[0, ∞)');
  assert.equal(g.ivText([null, 3, false, true]), '(−∞, 3]');
  assert.equal(g.ivText([-2, 4, false, true]), '(−2, 4]');
  const r = { f: x => Math.sqrt(x + 3), xr: [-5, 5], yr: [-2, 5], dom: [-3, null, true, false], ran: [0, null, true, false] };
  const P = { rounds: [r] };
  assert.equal(g.grade({ rounds: [{ dom: [-3, null, true, true], ran: [0, null, true, false] }] }, P).ok, true, 'el extremo infinito ignora lleno/vacío');
  assert.equal(g.grade({ rounds: [{ dom: [-3, null, false, false], ran: [0, null, true, false] }] }, P).ok, false, 'el −3 sí está');
  const bad = g.grade({ rounds: [{ dom: [-3, null, true, false], ran: [-2, null, true, false] }] }, P);
  assert.equal(bad.ok, false);
  assert.ok(bad.solution.includes('[−3, ∞)') && bad.solution.includes('[0, ∞)'), bad.solution);
});

// ---------- completa-simetria ----------
test('completa-simetria: par copia, impar cambia el signo', () => {
  const g = G('completa-simetria');
  const par = { mode: 'par', pts: [[1, 2], [2, -1], [3, 3]] }, imp = { mode: 'impar', pts: [[1, 2], [2, -1], [3, 3]] };
  assert.equal(J(g.target(par)), J([2, -1, 3]));
  assert.equal(J(g.target(imp)), J([-2, 1, -3]));
  const P = { rounds: [par, imp] };
  assert.equal(g.grade({ ys: [[2, -1, 3], [-2, 1, -3]] }, P).ok, true);
  assert.equal(g.grade({ ys: [[2, -1, 3], [2, -1, 3]] }, P).ok, false);
});

// ---------- raices-imanes ----------
test('raices-imanes: fórmula factorizada y comparación sin importar el orden', () => {
  const g = G('raices-imanes');
  assert.equal(g.formula([1, -2, 1], -1), 'y = −(x + 2)(x − 1)²');
  assert.equal(g.formula([0, 3], 0.5), 'y = ½x(x − 3)');
  assert.equal(g.formula([2], 2), 'y = 2(x − 2)');
  assert.ok(Math.abs(g.value([1, -2], 2, 0) - -4) < 1e-9);
  const P = { rounds: [{ roots: [-2, 1, 1], a: -1 }] };
  assert.equal(g.grade({ rounds: [{ roots: [1, -2, 1], a: -1 }] }, P).ok, true);
  assert.equal(g.grade({ rounds: [{ roots: [1, -2, 1], a: 1 }] }, P).ok, false);
  assert.equal(g.grade({ rounds: [{ roots: [-2, -2, 1], a: -1 }] }, P).ok, false);
});

// ---------- cruz-asintotas ----------
test('cruz-asintotas: el centro es (h, p) en y = (px + q)/(x − h)', () => {
  const g = G('cruz-asintotas');
  const r = { p: 2, q: 1, h: 3 };
  assert.equal(J(g.center(r)), J([3, 2]));
  assert.equal(g.kOf(r), 7);
  assert.equal(g.grade({ cross: [[3, 2]] }, { rounds: [r] }).ok, true);
  assert.equal(g.grade({ cross: [[2, 3]] }, { rounds: [r] }).ok, false);
});

// ---------- apila-alturas ----------
test('apila-alturas: suma, resta y producto punto a punto', () => {
  const g = G('apila-alturas');
  const f = x => x, h = x => 2 - x;
  assert.equal(J(g.target({ mode: 'sum', f, g: h, xs: [-1, 0, 2] })), J([2, 2, 2]));
  assert.equal(J(g.target({ mode: 'prod', f, g: h, xs: [-1, 0, 2] })), J([-3, 0, 0]));
  assert.equal(J(g.target({ mode: 'diff', f, g: h, xs: [1, 3] })), J([0, 4]));
  const P = { rounds: [{ mode: 'sum', f, g: h, xs: [0, 1] }] };
  assert.equal(g.grade({ ys: [[2, 2]] }, P).ok, true);
  assert.equal(g.grade({ ys: [[2, 1]] }, P).ok, false);
});

// ---------- tuberia-maquinas ----------
test('tuberia-maquinas: se aplica de izquierda a derecha y la fórmula se anida', () => {
  const g = G('tuberia-maquinas');
  const chips = [{ tpl: '□ + 3', f: x => x + 3 }, { tpl: '(□)²', f: x => x * x }, { tpl: '2(□)', f: x => 2 * x }];
  assert.equal(g.run(chips, [0, 1], 1), 16);
  assert.equal(g.run(chips, [1, 0], 1), 4);
  assert.equal(g.formulaText(chips, [0, 1]), '(x + 3)²');
  assert.equal(g.formulaText(chips, [1, 2]), '2(x²)');
  assert.equal(g.formulaText(chips, [2, 0]), '2x + 3');
  const P = { chips, rounds: [{ n: 2, input: 1, goal: x => (x + 3) ** 2, tests: [-2, 0, 1, 5] }] };
  assert.equal(g.grade({ slots: [[0, 1]] }, P).ok, true);
  assert.equal(g.grade({ slots: [[1, 0]] }, P).ok, false);
  assert.equal(g.grade({ slots: [[0]] }, P).ok, false);
});

// ---------- arma-tramos ----------
test('arma-tramos: alturas de los extremos y puntos del corte', () => {
  const g = G('arma-tramos');
  const r = { c: 1, xr: [-3, 4], left: { m: 1, b: 2 }, right: { m: -1, b: 4 }, leftIncl: false };
  assert.equal(J(g.targetYs(r)), J([-1, 3, 3, 0]));
  assert.equal(J(g.targetDots(r)), J([false, true]));
  const P = { rounds: [r] };
  assert.equal(g.grade({ rounds: [{ ys: [-1, 3, 3, 0], dots: [false, true] }] }, P).ok, true);
  assert.equal(g.grade({ rounds: [{ ys: [-1, 3, 3, 0], dots: [true, true] }] }, P).ok, false, 'el corte no puede estar en los dos tramos');
  assert.equal(g.grade({ rounds: [{ ys: [-1, 3, 2, 0], dots: [false, true] }] }, P).ok, false);
});

// ---------- dobla-negativos ----------
test('dobla-negativos: trozos entre raíces y cuáles van bajo el eje', () => {
  const g = G('dobla-negativos');
  const r = { f: x => x * x - 4, xr: [-4, 4], roots: [-2, 2] };
  assert.equal(J(g.pieces(r).map(p => [p.a, p.b, p.neg])), J([[-4, -2, false], [-2, 2, true], [2, 4, false]]));
  const P = { rounds: [r] };
  assert.equal(g.grade({ folds: [[false, true, false]] }, P).ok, true);
  assert.equal(g.grade({ folds: [[true, true, false]] }, P).ok, false);
});

// ---------- sellos-graficas ----------
test('sellos-graficas: el orden de los sellos importa', () => {
  const g = G('sellos-graficas');
  assert.equal(J(g.apply(['R', 'R', 'U'])), J({ A: 1, B: 1, C: -2, D: 1 }));
  assert.equal(J(g.apply(['V2', 'U'])), J({ A: 2, B: 1, C: 0, D: 1 }));
  assert.equal(J(g.apply(['U', 'V2'])), J({ A: 2, B: 1, C: 0, D: 2 }));
  assert.equal(J(g.apply(['Fx', 'U'])), J({ A: -1, B: 1, C: 0, D: 1 }));
  assert.equal(J(g.apply(['R', 'Fy'])), J({ A: 1, B: -1, C: -1, D: 0 }), 'reflejar en y después de correr: f(−x − 1)');
  const P = { rounds: [{ base: 'sqrt', target: { A: -2, B: 1, C: 1, D: 3 } }] };
  assert.equal(g.grade({ stamps: [['L', 'V2', 'Fx', 'U', 'U', 'U']] }, P).ok, true);
  assert.equal(g.grade({ stamps: [['L', 'U', 'U', 'U', 'V2', 'Fx']] }, P).ok, false);
  assert.ok(g.grade({ stamps: [[]] }, P).solution.includes('y = −2√(x + 1) + 3'), g.grade({ stamps: [[]] }, P).solution);
});

// ---------- espejo-diagonal ----------
test('espejo-diagonal: cada punto va a (y, x)', () => {
  const g = G('espejo-diagonal');
  const P = { rounds: [{ pts: [[0, 1], [1, 3], [2, 5]] }] };
  assert.equal(g.grade({ pts: [[[1, 0], [3, 1], [5, 2]]] }, P).ok, true);
  assert.equal(g.grade({ pts: [[[0, 1], [3, 1], [5, 2]]] }, P).ok, false);
  assert.equal(g.grade({ pts: [[[5, 2], [1, 0], [3, 1]]] }, P).ok, true, 'cualquier ficha puede ir a cualquier reflejo');
});

// ---------- cofre-candados ----------
test('cofre-candados: las llaves deshacen los candados del último al primero', () => {
  const g = G('cofre-candados');
  const r = { locks: ['× 2', '+ 3'], keys: [{ txt: '÷ 2' }, { txt: '− 3' }, { txt: '+ 3' }], order: [1, 0] };
  const P = { rounds: [r] };
  assert.equal(g.grade({ keys: [[1, 0]] }, P).ok, true);
  assert.equal(g.grade({ keys: [[0, 1]] }, P).ok, false, 'primero se quita el candado de afuera');
  assert.equal(g.grade({ keys: [[1, 0, 2]] }, P).ok, false);
});
