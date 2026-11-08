// Unidad 2 de Cálculo (funciones): ubicación, ejercicios-juego con pista, rondas alcanzables con los
// controles, respuestas correctas y sin repetir los ejemplos de los videos. Spec 2026-11-08-calculo-unidad-2.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const calc = get(loadScripts(['js/content.js', 'js/courses/calculo.js']), 'COURSE_CALC');
const unit = calc.units[1];
const lesson = id => unit.lessons.find(l => l.id === id);
const G = name => loadGame(`js/games/${name}.js`)[name];
const IDS = ['alg-52', 'calc-tipos', 'alg-53', 'calc-tramos', 'alg-61', 'alg-62'];
const NEW = ['proyector-sombras', 'completa-simetria', 'raices-imanes', 'cruz-asintotas', 'apila-alturas', 'tuberia-maquinas', 'arma-tramos', 'dobla-negativos', 'sellos-graficas', 'espejo-diagonal', 'cofre-candados'];
const inside = (v, [lo, hi]) => v > lo && v < hi;
const onHalf = v => Math.abs(v * 2 - Math.round(v * 2)) < 1e-9;
const plays = () => unit.lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => [l.id, e]));

test('unidad 2: seis lecciones en el orden del cronograma, con sus títulos', () => {
  assert.equal(unit.title, 'Funciones');
  assert.equal(unit.lessons.map(l => `${l.id}:${l.title}`).join(' | '), [
    'alg-52:Funciones: dominio, rango y simetría',
    'calc-tipos:Tipos de funciones',
    'alg-53:Operaciones y composición de funciones',
    'calc-tramos:Funciones a tramos y valor absoluto',
    'alg-61:Transformaciones de funciones',
    'alg-62:Función biyectiva e inversa',
  ].join(' | '));
});

test('cada lección: escenas de respaldo, sin opción múltiple ni tarjetas, mayoría juegos y todas con pista', () => {
  for (const id of IDS) {
    const l = lesson(id);
    assert.ok(l.clip.scenes.length >= 4, `${id} con pocas escenas`);
    assert.ok(l.ex.length >= 5, `${id} con pocos ejercicios`);
    const n = l.ex.filter(e => e.type === 'play').length;
    assert.ok(n * 2 > l.ex.length, `${id}: ${n} juegos de ${l.ex.length}`);
    l.ex.forEach((e, i) => {
      assert.notEqual(e.type, 'mc', `${id} ejercicio ${i} es de opción múltiple`);
      assert.ok(!['verdadero-falso', 'clasifica-cartas'].includes(e.game), `${id} ejercicio ${i} es de tarjetas`);
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      if (e.type === 'input') assert.ok(!new RegExp(`(^|[^\\d.])[−-]?${String(Math.abs(e.answer)).replace('.', '\\.')}([^\\d.]|$)`).test(e.hint), `${id} ejercicio ${i}: la pista dice la respuesta`);
    });
  }
});

test('los once juegos nuevos se usan en la unidad', () => {
  const used = new Set(plays().map(([, e]) => e.game));
  for (const g of NEW) assert.ok(used.has(g), `nadie usa ${g}`);
});

test('cada ronda se puede resolver con los controles de su juego', () => {
  for (const [id, e] of plays()) {
    const P = e.params, where = `${id} ${e.game}`;
    if (e.game === 'proyector-sombras') for (const r of P.rounds) {
      for (const v of [r.dom[0], r.dom[1]]) if (v != null) assert.ok(Number.isInteger(v) && v >= r.xr[0] + 1 && v <= r.xr[1] - 1, `${where}: extremo ${v} fuera del riel x`);
      for (const v of [r.ran[0], r.ran[1]]) if (v != null) assert.ok(Number.isInteger(v) && v >= r.yr[0] + 1 && v <= r.yr[1] - 1, `${where}: extremo ${v} fuera del riel y`);
    }
    if (e.game === 'completa-simetria') for (const r of P.rounds) for (const t of G('completa-simetria').target(r)) assert.ok(onHalf(t) && t >= r.yr[0] + 0.5 && t <= r.yr[1] - 0.5, where);
    if (e.game === 'raices-imanes') for (const r of P.rounds) {
      assert.ok(G('raices-imanes').AS.includes(r.a), `${where}: a fuera de la lista`);
      for (const x of r.roots) assert.ok(Number.isInteger(x) && x >= Math.ceil(r.xr[0]) + 1 && x <= Math.floor(r.xr[1]) - 1, `${where}: raíz ${x}`);
      assert.ok(Math.abs(G('raices-imanes').value(r.roots, r.a, r.mark[0]) - r.mark[1]) < 1e-9, `${where}: el punto rotulado no está en la curva`);
      assert.ok(inside(r.mark[1], r.yr), `${where}: punto rotulado fuera del plano`);
    }
    if (e.game === 'cruz-asintotas') for (const r of P.rounds) {
      assert.ok(inside(r.h, [r.xr[0] + 0.5, r.xr[1] - 0.5]) && inside(r.p, [r.yr[0] + 0.5, r.yr[1] - 0.5]), where);
      assert.notEqual(G('cruz-asintotas').kOf(r), 0, `${where}: la función es constante`);
    }
    if (e.game === 'apila-alturas') for (const r of P.rounds) for (const t of G('apila-alturas').target(r)) assert.ok(onHalf(t) && t >= r.yr[0] && t <= r.yr[1], `${where}: ${t}`);
    if (e.game === 'tuberia-maquinas') for (const r of P.rounds) {
      const ids = (r.chips || P.chips.map((_, i) => i)), tub = G('tuberia-maquinas');
      const seqs = []; const rec = s => { if (s.length === r.n) { seqs.push(s); return; } ids.filter(i => !s.includes(i)).forEach(i => rec([...s, i])); };
      rec([]);
      const good = seqs.filter(s => tub.grade({ slots: [s] }, { chips: P.chips, rounds: [r] }).ok);
      assert.equal(good.length, 1, `${where} ${r.goalTxt}: ${good.length} tuberías correctas`);
    }
    if (e.game === 'arma-tramos') for (const r of P.rounds) for (const y of G('arma-tramos').targetYs(r)) assert.ok(onHalf(y) && y >= r.yr[0] && y <= r.yr[1], `${where}: altura ${y}`);
    if (e.game === 'dobla-negativos') for (const r of P.rounds) {
      for (const x of r.roots) assert.ok(Math.abs(r.f(x)) < 1e-9, `${where}: ${x} no es raíz`);
      const pcs = G('dobla-negativos').pieces(r);
      assert.ok(pcs.some(p => p.neg) && pcs.some(p => !p.neg), where);
      for (let k = 1; k < pcs.length; k++) assert.notEqual(pcs[k].neg, pcs[k - 1].neg, `${where}: raíz sin cambio de signo`);
    }
    if (e.game === 'sellos-graficas') for (const r of P.rounds) {
      // Búsqueda en anchura: ¿algún orden de hasta 5 sellos llega a la meta?
      const sel = G('sellos-graficas'), codes = ['R', 'L', 'U', 'D', 'V2', 'Vh', 'Fx', 'Fy'];
      let frontier = [[]], found = false;
      for (let d = 0; d <= 5 && !found; d++) {
        found = frontier.some(s => sel.grade({ stamps: [s] }, { rounds: [r] }).ok);
        if (!found) frontier = frontier.flatMap(s => codes.map(c => [...s, c]));
      }
      assert.ok(found, `${where}: meta inalcanzable con 5 sellos`);
    }
    if (e.game === 'espejo-diagonal') for (const r of P.rounds) for (const [a, b] of r.pts) {
      assert.ok(Math.abs(r.f(a) - b) < 1e-9, `${where}: (${a}, ${b}) no está en f`);
      assert.notEqual(a, b, `${where}: punto sobre el espejo`);
      assert.ok(inside(a, [r.range[0] + 0.5, r.range[1] - 0.5]) && inside(b, [r.range[0] + 0.5, r.range[1] - 0.5]), where);
    }
    if (e.game === 'cofre-candados') for (const r of P.rounds) {
      const fx = r.locks.reduce((acc, l) => l.f(acc), r.probe), back = r.order.reduce((acc, k) => r.keys[k].f(acc), fx);
      assert.ok(Math.abs(back - r.probe) < 1e-9, `${where} ${r.fTxt}: las llaves no devuelven la moneda`);
      assert.equal(r.order.length, r.locks.length, where);
    }
    if (e.game === 'dibuja-intervalo') assert.ok(Number.isInteger(P.a) && Number.isInteger(P.b) && P.a >= P.min && P.b <= P.max, where);
    if (e.game === 'une-parejas') assert.ok(P.right.length > P.left.length, `${where}: sin distractor`);
  }
});

test('respuestas numéricas correctas', () => {
  const nums = id => lesson(id).ex.filter(e => e.type === 'input').map(e => e.answer);
  assert.equal(nums('alg-52').join(), '10,3');        // (−2)² − 3(−2) ; vértice de x² − 6x + 2
  assert.equal(nums('calc-tipos').join(), '2,3');     // pendiente 3 desde (1, 5) ; 8k = 24
  assert.equal(nums('alg-53').join(), '2,13');        // f(g(1)) = f(1) ; g(f(2)) = g(5)
  assert.equal(nums('calc-tramos').join(), '12000,2'); // 6000 + 1500·4 ; |−5| − 3
  assert.equal(nums('alg-61').join(), '11,-2');       // 3·5 − 4 ; x + 3 = 1
  assert.equal(nums('alg-62').join(), '5,3');         // 4x − 7 = 13 ; x³ = 27
});

test('los ejercicios no repiten los ejemplos de los videos', () => {
  const norm = s => s.replace(/\\\\/g, '\\').replace(/−/g, '-').replace(/\s+/g, '');
  const video = {
    'alg-52': ['x-2)', 'sqrt{x+1}', 'x^2-1', 'x²-1'],
    'calc-tipos': ['(x+1)(x-2)', '2x-1', '1/x', 'frac{1}{x}'],
    'alg-53': ['x+1', '(2x+1)'],
    'calc-tramos': ['x^2-4', 'x²-4', 'parqueadero'],
    'alg-61': ['x^2+2', '(x-3)', '2x^2', '2x²'],
    'alg-62': ['2x+3', '(1,5)', '(5,1)'],
  };
  for (const [id, bad] of Object.entries(video)) {
    const text = norm(JSON.stringify(lesson(id).ex));
    for (const b of bad) assert.ok(!text.includes(b), `${id}: «${b}» sale en el video`);
  }
});
