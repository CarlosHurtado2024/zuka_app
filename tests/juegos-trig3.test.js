// Juegos de la unidad 3 de Trigonometría (forma polar de complejos): mapa del tesoro, telaraña polar,
// espiral de potencias y flor de raíces. Se prueba la calificación y las funciones puras.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const mapa = G('mapa-tesoro'), tela = G('telarana-polar'), espiral = G('espiral-potencias'), flor = G('flor-de-raices');

test('mapa: radicales simplificados y argumento por cuadrante', () => {
  assert.equal([1, 2, 3, 4, 8, 12, 18, 25, 50].map(mapa.radTxt).join(' '), '1 √2 √3 2 2√2 2√3 3√2 5 5√2');
  assert.equal([[1, 1], [-1, Math.sqrt(3)], [-2, -2], [0, -3], [-5, 0], [Math.sqrt(3), -1]].map(([a, b]) => mapa.argDeg(a, b)).join(' '), '45 120 225 270 180 330');
});

test('mapa: el pirata llega si el rumbo y los pasos son exactos', () => {
  const params = { rounds: [{ a: -1, b: Math.sqrt(3), label: '−1 + √3 i' }, { a: 2, b: -2, label: '2 − 2i' }] };
  assert.equal(mapa.grade({ walks: [{ k: 4, deg: 120 }, { k: 8, deg: 315 }] }, params).ok, true);
  const r = mapa.grade({ walks: [{ k: 4, deg: 60 }, { k: 8, deg: 315 }] }, params);
  assert.equal(r.ok, false, '60° tiene la misma tangente pero otro cuadrante');
  assert.ok(r.solution.includes('120') && r.solution.includes('2√2'), r.solution);
  assert.equal(mapa.grade({ walks: [{ k: 4, deg: 120 }, null] }, params).ok, false);
});

test('telaraña: producto y cociente en forma polar', () => {
  const t1 = tela.target({ op: '×', z1: { r: 2, deg: 150 }, z2: { r: 3, deg: 300 } });
  assert.equal(`${t1.r} ${t1.deg}`, '6 90');
  const t2 = tela.target({ op: '÷', z1: { r: 6, deg: 45 }, z2: { r: 2, deg: 120 } });
  assert.equal(`${t2.r} ${t2.deg}`, '3 285');
  const params = { rounds: [{ op: '×', z1: { r: 2, deg: 150 }, z2: { r: 3, deg: 300 } }, { op: '÷', z1: { r: 6, deg: 45 }, z2: { r: 2, deg: 120 } }] };
  assert.equal(tela.grade({ picks: [{ r: 6, deg: 90 }, { r: 3, deg: 285 }] }, params).ok, true);
  assert.equal(tela.grade({ picks: [{ r: 5, deg: 90 }, { r: 3, deg: 285 }] }, params).ok, false, 'los módulos se multiplican, no se suman');
  assert.ok(tela.rings(params.rounds[0]).includes(6) && tela.rings(params.rounds[0]).includes(5), 'el anillo trampa r1 + r2 está');
});

test('espiral: la potencia n de z cae en la meta (vale cualquier n que llegue)', () => {
  const p = espiral.power({ r: Math.SQRT2, deg: 45 }, 6);
  assert.ok(Math.abs(p.r - 8) < 1e-9 && p.deg === 270);
  const params = { rounds: [{ z: { r: Math.SQRT2, deg: 45 }, goal: { r: 8, deg: 270 } }, { z: { r: 1, deg: 60 }, goal: { r: 1, deg: 0 } }] };
  assert.equal(espiral.grade({ ns: [6, 6] }, params).ok, true);
  assert.equal(espiral.grade({ ns: [6, 12] }, params).ok, true, 'doce vueltas de 60° también llegan a 1');
  const r = espiral.grade({ ns: [5, 6] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('n = 6'), r.solution);
});

test('flor: radio = raíz n-ésima del módulo; un pétalo en θ/n (módulo 360°/n)', () => {
  const R = { n: 4, r: 16, deg: 240 };
  assert.ok(Math.abs(flor.rootR(R) - 2) < 1e-12);
  assert.equal(flor.radTxt(3, 2), '∛2');
  assert.equal(flor.radTxt(4, 16), '2');
  const params = { rounds: [R, { n: 3, r: 8, deg: 90 }] };
  assert.equal(flor.grade({ flowers: [{ rho: 2, rot: 150 }, { rho: 2, rot: 30 }] }, params).ok, true, '150° = 60° + 90°: otro pétalo, la misma flor');
  assert.equal(flor.grade({ flowers: [{ rho: 2, rot: 150 }, { rho: 2, rot: 90 }] }, params).ok, false, 'el pétalo va en θ/n, no en θ');
  const r = flor.grade({ flowers: [{ rho: 4, rot: 60 }, { rho: 2, rot: 30 }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('60°'), r.solution);
});
