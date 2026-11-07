// Juegos de la unidad 2 de Trigonometría: cañón inverso, tanque pitagórico, detector de identidades,
// ángulos encadenados, corredores dobles, pesca de raíces, compás ambiguo y brazo robot. Se prueba la
// calificación (grade) y las funciones puras que cada juego exporta.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const canon = G('canon-inverso'), tanque = G('tanque-pitagorico'), detector = G('detector-identidades');
const cadena = G('encadena-angulos'), corredores = G('corredores-dobles'), pesca = G('pesca-raices');
const compas = G('compas-ambiguo'), brazo = G('brazo-robot');

test('cañón: valor principal de cada inversa, en grados, y su rango', () => {
  const v = [['asin', -0.5], ['acos', -0.5], ['atan', -1], ['asin', 1], ['acos', 1]].map(([f, x]) => Math.round(canon.principal(f, x)));
  assert.equal(v.join(' '), '-30 120 -45 90 0');
  assert.equal(JSON.stringify(canon.RANGE.acos), '[0,180]');
  assert.equal(JSON.stringify(canon.RANGE.asin), '[-90,90]');
});

test('cañón: acierta el globo del rango; el otro globo del mismo seno no vale', () => {
  const params = { rounds: [{ fn: 'asin', x: 0.5, tex: '\\tfrac12' }, { fn: 'acos', x: -Math.SQRT1_2, tex: '-\\tfrac{\\sqrt2}{2}' }, { fn: 'atan', x: 6 / 8, tex: '\\tfrac68', snap: 1 }] };
  assert.equal(canon.grade({ aims: [30, 135, 37] }, params).ok, true);
  const r = canon.grade({ aims: [150, 135, 37] }, params);
  assert.equal(r.ok, false, '150° tiene seno 1/2, pero no está en el rango de sen⁻¹');
  assert.ok(r.solution.includes('30'), r.solution);
  assert.equal(canon.grade({ aims: [30, null, 37] }, params).ok, false);
});

test('tanque: la otra razón con su signo por el cuadrante', () => {
  const t = [
    { id: 'sc', given: 'sen', value: 0.6, ask: 'cos', q: 2 },
    { id: 'sc', given: 'cos', value: -0.28, ask: 'sen', q: 3 },
    { id: 'ts', given: 'tan', value: 0.75, ask: 'sec', q: 3 },
    { id: 'ts', given: 'sec', value: 1.25, ask: 'tan', q: 4 },
  ].map(tanque.target).map(v => v.toFixed(2));
  assert.equal(t.join(' '), '-0.80 -0.96 -1.25 -0.75');
  const params = { rounds: [{ id: 'sc', given: 'sen', value: 0.6, ask: 'cos', q: 2 }, { id: 'ts', given: 'tan', value: 0.75, ask: 'sec', q: 1 }] };
  assert.equal(tanque.grade({ vals: [-0.8, 1.25] }, params).ok, true);
  const r = tanque.grade({ vals: [0.8, 1.25] }, params);
  assert.equal(r.ok, false, 'en el cuadrante II el coseno es negativo');
  assert.ok(r.solution.includes('0.8'), r.solution);
});

test('detector: contraejemplo donde las gráficas se separan, o «es identidad»', () => {
  const params = { rounds: [
    { lhs: 'a', rhs: 'b', f: x => Math.sin(2 * x), g: x => 2 * Math.sin(x), identity: false },
    { lhs: 'a', rhs: 'b', f: x => Math.cos(x) ** 2 - Math.sin(x) ** 2, g: x => Math.cos(2 * x), identity: true },
  ] };
  assert.equal(detector.differs(params.rounds[0], Math.PI / 2), true);
  assert.equal(detector.differs(params.rounds[0], 0), false, 'en x = 0 coinciden: no es contraejemplo');
  assert.equal(detector.grade({ answers: [{ x: Math.PI / 2 }, 'id'] }, params).ok, true);
  assert.equal(detector.grade({ answers: [{ x: Math.PI }, 'id'] }, params).ok, false, 'en π ambas valen 0');
  assert.equal(detector.grade({ answers: ['id', 'id'] }, params).ok, false);
  assert.equal(detector.grade({ answers: [{ x: 1 }, { x: 1 }] }, params).ok, false, 'una identidad no tiene contraejemplo');
});

test('ángulos encadenados: dos notables que suman o restan el ángulo pedido', () => {
  assert.equal([30, 45, 60, 90, 120, 135, 150, 15, 75, 105].map(cadena.isNotable).join(''), 'truetruetruetruetruetruetruefalsefalsefalse');
  const params = { rounds: [{ target: 75 }, { target: 15 }, { target: 165 }] };
  assert.equal(cadena.grade({ chains: [{ a: 45, b: 30, op: '+' }, { a: 60, b: 45, op: '-' }, { a: 120, b: 45, op: '+' }] }, params).ok, true);
  assert.equal(cadena.grade({ chains: [{ a: 30, b: 45, op: '+' }, { a: 45, b: 30, op: '-' }, { a: 210, b: 45, op: '-' }] }, params).ok, true);
  const r = cadena.grade({ chains: [{ a: 60, b: 15, op: '+' }, { a: 60, b: 45, op: '-' }, { a: 120, b: 45, op: '+' }] }, params);
  assert.equal(r.ok, false, '15° no es notable');
  assert.ok(r.solution.includes('45') && r.solution.includes('30'), r.solution);
});

test('corredores: el rápido va al doble; condiciones sobre θ y 2θ', () => {
  assert.equal(corredores.fits(135, { fast: 270, q: 2 }), true);
  assert.equal(corredores.fits(315, { fast: 270, q: 2 }), false, '315° también lleva al rápido a 270°, pero está en IV');
  assert.equal(corredores.fits(60, { cos2: -0.5, q: 1 }), true);
  assert.equal(corredores.fits(240, { sen2: Math.sqrt(3) / 2, q: 3 }), true);
  const params = { rounds: [{ prompt: 'p', fast: 270, q: 2 }, { prompt: 'p', fast: 300 }] };
  assert.equal(corredores.grade({ angles: [135, 330] }, params).ok, true);
  const r = corredores.grade({ angles: [135, 300] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('150') && r.solution.includes('330'), r.solution);
});

test('pesca: todas las raíces en [0°, 360°) con paso de 15°, sin anzuelos de más', () => {
  const f = x => 2 * Math.sin(x) ** 2 - Math.sin(x) - 1;    // sen x = 1 o sen x = −1/2
  assert.equal(pesca.rootsOf(f).join(' '), '90 210 330');
  const params = { rounds: [{ tex: 't', f }, { tex: 't', f: x => Math.tan(x) - 1 }] };
  assert.equal(pesca.grade({ hooks: [[330, 90, 210], [45, 225]] }, params).ok, true);
  assert.equal(pesca.grade({ hooks: [[90, 210], [45, 225]] }, params).ok, false, 'falta una raíz');
  const r = pesca.grade({ hooks: [[90, 210, 330, 30], [45, 225]] }, params);
  assert.equal(r.ok, false, '30° sobra');
  assert.ok(r.solution.includes('7\\pi') || r.solution.includes('210'), r.solution);
});

test('compás: cero, uno o dos triángulos en el caso ambiguo', () => {
  const n = [{ A: 30, b: 10, a: 6 }, { A: 30, b: 10, a: 5 }, { A: 30, b: 10, a: 4 }, { A: 30, b: 10, a: 12 }].map(r => compas.solutions(r).length);
  assert.equal(n.join(' '), '2 1 0 1');
  const r2 = { A: 30, b: 10, a: 6 }, [x1, x2] = compas.solutions(r2);
  const params = { rounds: [r2, { A: 30, b: 10, a: 4 }] };
  assert.equal(compas.grade({ marks: [[x2, x1], 'none'] }, params).ok, true);
  assert.equal(compas.grade({ marks: [[x1], 'none'] }, params).ok, false, 'faltó el segundo triángulo');
  assert.equal(compas.grade({ marks: [[x1, x2], [3]] }, params).ok, false);
});

test('brazo robot: el codo con la ley de cosenos', () => {
  assert.equal(Math.round(brazo.elbowFor({ a: 5, b: 8, c: 7 })), 60);
  assert.equal(Math.round(brazo.elbowFor({ a: 3, b: 5, c: 7 })), 120);
  assert.ok(Math.abs(brazo.reach(5, 8, 60) - 7) < 1e-9);
  const params = { rounds: [{ a: 5, b: 8, c: 7 }, { a: 3, b: 5, c: 7 }] };
  assert.equal(brazo.grade({ angles: [60, 120] }, params).ok, true);
  const r = brazo.grade({ angles: [60, 90] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('120'), r.solution);
});
