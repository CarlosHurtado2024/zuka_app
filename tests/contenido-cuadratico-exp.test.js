// Lecciones alg-4a (polinomio cuadrático, clase 10) y alg-73 (ecuaciones exponenciales y
// logarítmicas, clase 19): ubicación, juegos con pista, rondas alcanzables y respuestas correctas.
// Spec 2026-11-07-cuadratico-y-ecuaciones-exp-log.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const alg = get(loadScripts(['js/content.js', 'js/courses/algebra.js']), 'COURSE_ALGEBRA');
const all = alg.units.flatMap(u => u.lessons);
const lesson = id => all.find(l => l.id === id);
const G = name => loadGame(`js/games/${name}.js`)[name];
const IDS = ['alg-4a', 'alg-73'];

test('alg-4a va antes de las ecuaciones cuadráticas y alg-73 cierra la unidad de exponenciales', () => {
  const unitOf = id => alg.units.find(u => u.lessons.some(l => l.id === id));
  assert.equal(unitOf('alg-4a').lessons.map(l => l.id).join(' '), 'alg-23c alg-1 alg-4a alg-4');
  assert.equal(unitOf('alg-73').lessons.map(l => l.id).join(' '), 'alg-71 alg-72 alg-73');
  assert.equal(lesson('alg-4a').title, 'Polinomio cuadrático y parábola');
  assert.equal(lesson('alg-73').title, 'Ecuaciones exponenciales y logarítmicas');
});

test('cada lección: escenas de respaldo, sin opción múltiple, mayoría juegos y todas con pista', () => {
  for (const id of IDS) {
    const l = lesson(id);
    assert.ok(l.clip.scenes.length >= 4, `${id} con pocas escenas`);
    assert.ok(l.ex.length >= 5, `${id} con pocos ejercicios`);
    const plays = l.ex.filter(e => e.type === 'play').length;
    assert.ok(plays * 2 > l.ex.length, `${id}: ${plays} juegos de ${l.ex.length}`);
    l.ex.forEach((e, i) => {
      assert.notEqual(e.type, 'mc', `${id} ejercicio ${i} es de opción múltiple`);
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      if (e.type === 'input') assert.ok(!new RegExp(`(^|[^\\d.])${String(e.answer).replace('.', '\\.')}([^\\d.]|$)`).test(e.hint), `${id} ejercicio ${i}: la pista dice la respuesta`);
    });
  }
});

test('los tres juegos nuevos se usan', () => {
  const used = IDS.flatMap(id => lesson(id).ex.filter(e => e.type === 'play').map(e => e.game));
  for (const g of ['completa-cuadrado', 'mueve-parabola', 'balanza-exponencial']) assert.ok(used.includes(g), `nadie usa ${g}`);
});

test('cada ronda se puede resolver con los controles del juego', () => {
  const plays = IDS.flatMap(id => lesson(id).ex.filter(e => e.type === 'play').map(e => ({ id, ...e })));
  for (const e of plays) {
    const P = e.params, where = `${e.id} ${e.game}`;
    if (e.game === 'completa-cuadrado') {
      const g = G('completa-cuadrado');
      for (const r of P.rounds) {
        assert.ok(r.b > 0 && r.b % 2 === 0, `${where}: b = ${r.b} debe ser par y positivo`);
        assert.ok((r.b / 2) ** 2 <= g.MAX, `${where}: la esquina no cabe`);
      }
      assert.ok(g.grade({ placed: P.rounds.map(r => (r.b / 2) ** 2) }, P).ok, where);
    }
    if (e.game === 'mueve-parabola') {
      const g = G('mueve-parabola');
      const vals = P.rounds.map(r => ({ a: r.a, ...g.vertexOf(r) }));
      for (const v of vals) {
        assert.ok(Number.isInteger(v.h) && Number.isInteger(v.k), `${where}: vértice no entero`);
        assert.ok(Math.abs(v.h) <= g.RANGE && Math.abs(v.k) <= g.RANGE, `${where}: vértice fuera de la cuadrícula`);
        assert.ok(v.a !== 0 && Number.isInteger(v.a * 2) && Math.abs(v.a) <= 3, `${where}: a = ${v.a} fuera del control`);
      }
      assert.ok(g.grade({ vals }, P).ok, where);
    }
    if (e.game === 'balanza-exponencial') for (const r of P.rounds) {
      const min = r.min ?? -4, max = r.max ?? 6, step = r.step ?? 0.5;
      assert.ok(r.x >= min && r.x <= max && Number.isInteger(+((r.x - min) / step).toFixed(9)), `${where}: x = ${r.x} no se alcanza`);
      const l = r.L(r.x), rr = r.R(r.x);
      assert.ok(Number.isFinite(l) && Math.abs(l - rr) < 1e-9 * Math.max(1, Math.abs(l)), `${where} «${r.tex}»: ${l} ≠ ${rr}`);
      const others = [];
      for (let x = min; x <= max + 1e-9; x += step) if (Math.abs(x - r.x) > 1e-9 && Math.abs(r.L(x) - r.R(x)) < 1e-9) others.push(x);
      assert.equal(others.length, 0, `${where} «${r.tex}»: también se equilibra en ${others}`);
    }
    if (e.game === 'ordena-terminos') for (const j of P.order) assert.ok(P.chips[j] !== undefined, where);
  }
});

test('alg-73: la ronda de logaritmos tiene una solución extraña dentro del rango (que no existe)', () => {
  const r = lesson('alg-73').ex.filter(e => e.game === 'balanza-exponencial').flatMap(e => e.params.rounds).find(r => r.extra != null);
  assert.ok(r, 'ninguna ronda marca su solución extraña');
  assert.ok(r.extra >= (r.min ?? -4) && r.extra <= (r.max ?? 6));
  assert.ok(!Number.isFinite(r.L(r.extra)) || !Number.isFinite(r.R(r.extra)), 'la solución extraña sí existe');
});

test('respuestas numéricas correctas', () => {
  const nums = id => lesson(id).ex.filter(e => e.type === 'input');
  const [h, p] = nums('alg-4a');
  assert.equal(h.answer, 46);   // h(t) = −5t² + 30t + 1 → t = 3, h = 46
  assert.equal(p.answer, 225);  // 15 · 15
  const [lg, dup] = nums('alg-73');
  assert.ok(Math.abs(lg.answer - Math.log(30) / Math.log(4)) < 0.005 && lg.tol >= 0.01);
  assert.ok(Math.abs(dup.answer - Math.log(2) / 0.04) < 0.05 && dup.tol >= 0.05);
});

test('los ejercicios no repiten los ejemplos del video', () => {
  const video = {
    'alg-4a': ['x^2 + 4x', 'x^2 - 6x + 5', '-2x^2 + 4x + 1'],
    'alg-73': ['2^{x+3}', '5^x = 12', '\\log_6'],
  };
  for (const [id, bad] of Object.entries(video)) {
    const text = JSON.stringify(lesson(id).ex).replace(/\\\\/g, '\\');
    for (const b of bad) assert.ok(!text.includes(b), `${id}: «${b}» sale en el video`);
  }
});

test('las rondas de los juegos no usan los coeficientes de los ejemplos del video', () => {
  const rounds = game => lesson('alg-4a').ex.filter(e => e.game === game).flatMap(e => e.params.rounds);
  for (const r of rounds('completa-cuadrado')) assert.ok(r.b !== 4, `x² + 4x sale en el video (${JSON.stringify(r)})`);
  const video = ['1,-6,5', '-2,4,1'];
  for (const r of rounds('mueve-parabola')) assert.ok(!video.includes(`${r.a},${r.b},${r.c}`), `${JSON.stringify(r)} sale en el video`);
  const exp = lesson('alg-73').ex.filter(e => e.game === 'balanza-exponencial').flatMap(e => e.params.rounds).map(r => r.txt).join(' | ');
  for (const b of ['2ˣ⁺³', '5ˣ = 12', 'log₆']) assert.ok(!exp.includes(b), `«${b}» sale en el video`);
});
