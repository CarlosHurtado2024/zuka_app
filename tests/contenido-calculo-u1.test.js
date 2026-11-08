// Unidad 1 de Cálculo (desigualdades, valor absoluto, plano y recta): ubicación, ejercicios-juego con
// pista, rondas alcanzables con los controles, respuestas correctas y sin repetir los ejemplos de los
// videos. Spec 2026-11-07-calculo-unidad-1.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const calc = get(loadScripts(['js/content.js', 'js/courses/calculo.js']), 'COURSE_CALC');
const unit = calc.units[0];
const lesson = id => unit.lessons.find(l => l.id === id);
const G = name => loadGame(`js/games/${name}.js`)[name];
const IDS = ['alg-32', 'alg-26c', 'alg-51', 'calc-recta'];
const NEW = ['sombra-equivalente', 'semaforo-signos', 'correa-del-perro', 'candado-absoluto', 'tirolesa', 'balancin', 'cuerdas-iguales', 'laser-recta', 'rieles-paralelos'];
const onGrid = (v, step, min, max) => v >= min - 1e-9 && v <= max + 1e-9 && Math.abs(v / step - Math.round(v / step)) < 1e-9;

test('unidad 1: cuatro lecciones en el orden del cronograma, con sus títulos', () => {
  assert.equal(unit.lessons.map(l => `${l.id}:${l.title}`).join(' | '), [
    'alg-32:Orden, intervalos e inecuaciones',
    'alg-26c:Desigualdades con valor absoluto',
    'alg-51:Plano cartesiano, distancia y punto medio',
    'calc-recta:La recta: pendiente, paralelas y perpendiculares',
  ].join(' | '));
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
      if (e.type === 'input') assert.ok(!new RegExp(`(^|[^\\d.])[−-]?${String(Math.abs(e.answer)).replace('.', '\\.')}([^\\d.]|$)`).test(e.hint), `${id} ejercicio ${i}: la pista dice la respuesta`);
    });
  }
});

test('los nueve juegos nuevos se usan en la unidad', () => {
  const used = new Set(unit.lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => e.game)));
  for (const g of NEW) assert.ok(used.has(g), `nadie usa ${g}`);
});

// Búsqueda en anchura: ¿se llega a «x ⟂ número» equivalente con las fichas (y voltear) en pocos pasos?
function solvable(round) {
  const som = G('sombra-equivalente'), moves = [...round.chips.keys(), 'flip'];
  let frontier = [[]];
  for (let depth = 0; depth <= 6; depth++) {
    for (const ops of frontier) if (som.grade({ rounds: [{ ops }] }, { rounds: [round] }).ok) return true;
    if (depth < 6) frontier = frontier.flatMap(ops => moves.map(m => [...ops, m])).slice(0, 60000);
  }
  return false;
}

test('cada ronda de los juegos se puede resolver con sus controles', () => {
  for (const id of IDS) for (const e of lesson(id).ex.filter(e => e.type === 'play')) {
    const P = e.params, where = `${id} ${e.game}`;
    if (e.game === 'sombra-equivalente') for (const r of P.rounds) assert.ok(solvable(r), `${where}: ronda sin solución con las fichas`);
    if (e.game === 'semaforo-signos') for (const r of P.rounds) {
      const roots = r.factors.map(f => f.root);
      assert.equal(new Set(roots).size, roots.length, `${where}: raíces repetidas`);
      assert.ok(roots.length <= 3, `${where}: demasiados tramos para el celular`);
    }
    if (e.game === 'correa-del-perro') for (const r of P.rounds) {
      assert.ok(onGrid(r.c, 0.5, P.min, P.max) && onGrid(r.r, 0.5, 0.5, P.max - P.min), `${where}: ${r.txt} fuera de los controles`);
      assert.ok(r.c - r.r >= P.min && r.c + r.r <= P.max, `${where}: ${r.txt} no cabe en la recta`);
    }
    if (e.game === 'candado-absoluto') for (const r of P.rounds) assert.ok(onGrid(r.c, 0.5, -6, 6) && onGrid(r.r, 0.5, 0.5, 8), `${where}: rueda sin la combinación`);
    if (e.game === 'tirolesa') for (const r of P.rounds) assert.ok(G('tirolesa').target(r.A, r.B) <= 20, `${where}: cable demasiado largo`);
    if (e.game === 'balancin') for (const r of P.rounds) assert.ok(Number.isInteger(+(G('balancin').targetT(r) * 12).toFixed(9)), `${where}: el equilibrio no cae en una marca`);
    if (e.game === 'cuerdas-iguales') for (const r of P.rounds) assert.ok(onGrid(G('cuerdas-iguales').target(r), 0.5, -8, 8), `${where}: el punto no cae en el riel`);
    if (e.game === 'laser-recta') for (const r of P.rounds) {
      const las = G('laser-recta');
      let found = false;
      for (let rise = -6; rise <= 6 && !found; rise++) for (let run = 1; run <= 6 && !found; run++) for (let b = -6; b <= 6 && !found; b += 0.5)
        found = las.grade({ vals: [{ rise, run, b }] }, { rounds: [r] }).ok;
      assert.ok(found, `${where}: ninguna combinación de perillas pasa por los cristales`);
    }
    if (e.game === 'rieles-paralelos') for (const r of P.rounds) assert.ok(G('rieles-paralelos').SLOPES.includes(G('rieles-paralelos').targetSlope(r)), `${where}: pendiente que no está en el riel`);
    if (e.game === 'dibuja-intervalo') assert.ok(Number.isInteger(P.a) && Number.isInteger(P.b) && P.a >= P.min && P.b <= P.max, where);
    if (e.game === 'distancia-justa') assert.ok(P.a - P.d >= P.min && P.a + P.d <= P.max, where);
    if (e.game === 'ordena-terminos') for (const j of P.order) assert.ok(P.chips[j] !== undefined, where);
  }
});

test('respuestas numéricas correctas', () => {
  const nums = id => lesson(id).ex.filter(e => e.type === 'input').map(e => e.answer);
  assert.equal(nums('alg-32').join(), '2');           // 7 − 2x > 3x − 8 ⇒ x < 3
  assert.equal(nums('alg-26c').join(), '74.6,-14');  // |L − 75| ≤ 0.4 ; |2x − 5| = 9 ⇒ 7 y −2
  assert.equal(nums('alg-51').join(), '24,-6');      // 6 + 8 + 10 ; 2(−1) − 4
  assert.equal(nums('calc-recta').join(), '4,5');    // 3x − 2y = 12 con y = 0 ; (k − 1)(−1/4) = −1
});

test('los ejercicios no repiten los ejemplos de los videos', () => {
  const norm = s => s.replace(/\\\\/g, '\\').replace(/−/g, '-').replace(/\s+/g, '').replace(/\\le/g, '≤').replace(/\\ge/g, '≥');
  const video = {
    'alg-32': ['3-2x', '(x-2)(x+1)', '(x+3)/(x-1)', '\\frac{x+3}{x-1}'],
    'alg-26c': ['|x-2|', '|2x-6|'],
    'alg-51': ['[-1,2]', '[5,10]', '(-1,2)', '(5,10)'],
    'calc-recta': ['[-1,3]', '[2,-3]', '(-1,3)', '(2,-3)'],
  };
  for (const [id, bad] of Object.entries(video)) {
    const text = norm(JSON.stringify(lesson(id).ex));
    for (const b of bad) assert.ok(!text.includes(b), `${id}: «${b}» sale en el video`);
  }
});
