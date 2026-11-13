// Razones, proporciones y regla de tres en tres lecciones y un mundo propio (spec 2026-11-11-razones-desde-cero).
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const NEW = ['bolsa-razon', 'estira-foto', 'sombra-arbol'];
const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...NEW.map(n => `js/games/${n}.js`)]);
const alg = get(ctx, 'COURSE_ALGEBRA'), G = get(ctx, 'GAMES');
const lesson = id => alg.units.flatMap(u => u.lessons).find(l => l.id === id);
const uses = (l, n) => l.ex.filter(e => e.game === n);
const close = (a, b) => Math.abs(a - b) < 1e-9;

const NUEVOS = { 'alg-12': '0ef9a94d-cd4c-400e-9e07-672775506036', 'alg-12e': '3ef56e47-d0c4-45da-b464-5b59d09b840b', 'alg-12f': 'd7dcc920-e7a7-4a4e-8120-18afe4820519' };

test('bolsa-razon: la bolsa tiene justo las bolas de cada color que pide la ronda', () => {
  const g = G['bolsa-razon'];
  const P = { max: 20, rounds: [{ text: '', red: 12, blue: 8 }, { text: '', red: 9, blue: 6 }] };
  assert.equal(g.grade({ counts: [[12, 8], [9, 6]] }, P).ok, true);
  assert.equal(g.grade({ counts: [[3, 2], [9, 6]] }, P).ok, false, 'la razón sola no basta: también el total');
  assert.equal(g.grade({ counts: [[12, 8], null] }, P).ok, false);
  assert.equal(g.grade({}, P).ok, false);
  assert.ok(g.grade({}, P).solution.includes('12 rojas y 8 azules'));
});

test('estira-foto: el alto nuevo conserva la razón ancho : alto', () => {
  const g = G['estira-foto'];
  const P = { step: 0.5, max: 12, rounds: [{ w0: 4, h0: 5, w: 8, h: 10 }, { w0: 2, h0: 5, w: 3, h: 7.5 }] };
  assert.equal(g.grade({ hs: [10, 7.5] }, P).ok, true);
  assert.equal(g.grade({ hs: [9, 7.5] }, P).ok, false, 'sumar 4 al alto como al ancho la deforma');
  assert.equal(g.grade({ hs: [10, null] }, P).ok, false);
  assert.ok(g.grade({ hs: [] }, P).solution.includes('7.5'));
});

test('sombra-arbol: la altura del árbol es proporcional a su sombra', () => {
  const g = G['sombra-arbol'];
  const P = { step: 0.5, max: 12, rounds: [{ stick: 2, shadow: 3, treeShadow: 12, tree: 8 }] };
  assert.equal(g.grade({ hs: [8] }, P).ok, true);
  assert.equal(g.grade({ hs: [11] }, P).ok, false);
  assert.equal(g.grade({ hs: [null] }, P).ok, false);
  assert.ok(g.grade({ hs: [] }, P).solution.includes('8'));
  assert.ok(close(g.shadowOf(8, P.rounds[0]), 12));
});

test('mundos: razones y porcentajes en un mundo propio tras sistemas numéricos; el interés tras la exponencial', () => {
  const plan = alg.units.map(u => `${u.world}: ${u.lessons.map(l => l.id).join(' ')}`);
  assert.equal(plan[1], 'numeros: alg-11 alg-11b alg-11c alg-12b alg-12c alg-12d');
  assert.equal(plan[2], 'razones: alg-12 alg-12e alg-12f alg-13 alg-13c alg-13d');
  assert.equal(alg.units.find(u => u.world === 'exp-log').lessons.map(l => l.id).join(' '), 'alg-71 alg-13b alg-72 alg-73');
  assert.equal(alg.units[2].title, 'Razones, proporciones y porcentajes');
  assert.equal(alg.units[1].title, 'Sistemas numéricos y axiomas');
  const W = get(loadScripts(['js/worlds.js']), 'WORLDS');
  assert.ok(W.razones && W.razones.name && W.razones.art.includes('<svg'), 'el mundo nuevo tiene nombre e ilustración');
});

test('razones: tres lecciones, cada una con su video (escenas) y luego sus juegos con pista', () => {
  const need = {
    'alg-12': ['limonada', 'bolsa-razon', 'estira-foto'],
    'alg-12e': ['balanza-proporcion', 'sombra-arbol', 'cuadrado-media', 'duplica-magnitud', 'grafica-relacion', 'reparto'],
    'alg-12f': ['arma-regla', 'bascula', 'la-obra', 'engranajes', 'cadena-razones'],
  };
  for (const [id, games] of Object.entries(need)) {
    const l = lesson(id);
    for (const n of games) assert.ok(uses(l, n).length, `${id} sin ${n}`);
    assert.ok(l.clip.scenes.length >= 3, `${id}: escenas de respaldo`);
    assert.equal(l.clip.bunny, NUEVOS[id], `${id}: su video nuevo de Bunny`);
    assert.ok(!l.more || !l.more.length, `${id}: un solo video`);
    assert.ok(l.ex.length >= 5, `${id}: pocos ejercicios`);
    l.ex.forEach((e, i) => {
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      assert.ok(['play', 'input'].includes(e.type), `${id} ejercicio ${i} es ${e.type}`);
      if (e.type === 'input') assert.ok(!e.hint.includes(String(e.answer)), `${id}: la pista dice ${e.answer}`);
    });
  }
  // La regla de tres no aparece antes de su video.
  for (const n of ['arma-regla', 'cadena-razones', 'la-obra']) assert.ok(!uses(lesson('alg-12'), n).length && !uses(lesson('alg-12e'), n).length, n);
});

test('razones: los ejemplos de los videos no se repiten en los ejercicios', () => {
  const bad = {
    'alg-12': ['18 : 12', '3 : 2', '100 000', '4.5', '7 200', '180 km'],
    'alg-12e': ['10/15', 'x/8', '4/x', '45 000', '24 caramelos', 'taxi'],
    'alg-12f': ['arroz', '8 personas', 'impresoras', '10 000'],
  };
  for (const [id, words] of Object.entries(bad)) {
    const t = JSON.stringify(lesson(id).ex);
    for (const w of words) assert.ok(!t.includes(w), `${id}: «${w}» sale en el video`);
  }
});

test('razones: cada ronda de los juegos nuevos es coherente y alcanzable con sus controles', () => {
  for (const e of uses(lesson('alg-12'), 'bolsa-razon')) for (const r of e.params.rounds) {
    assert.ok(r.red >= 0 && r.blue >= 0 && r.red <= e.params.max && r.blue <= e.params.max, r.text);
    assert.ok(G['bolsa-razon'].grade({ counts: [[r.red, r.blue]] }, { ...e.params, rounds: [r] }).ok);
  }
  for (const e of uses(lesson('alg-12'), 'estira-foto')) for (const r of e.params.rounds) {
    assert.ok(close(r.w0 * r.h, r.h0 * r.w), `foto ${r.w0}×${r.h0}: alto ${r.h}`);
    assert.ok(close(Math.round(r.h / e.params.step) * e.params.step, r.h) && r.h <= e.params.max);
    assert.ok(!close(r.h, r.h0 + r.w - r.w0), 'sumar lo mismo no puede dar la respuesta');
  }
  for (const e of uses(lesson('alg-12e'), 'sombra-arbol')) for (const r of e.params.rounds) {
    assert.ok(close(r.tree * r.shadow, r.stick * r.treeShadow), `árbol ${r.tree}`);
    assert.ok(close(Math.round(r.tree / e.params.step) * e.params.step, r.tree) && r.tree <= e.params.max);
  }
  const nums = [...lesson('alg-12').ex].filter(e => e.type === 'input');
  assert.ok(nums.some(e => e.answer === 14), 'escala 1 : 200 000 con 7 cm son 14 km');
  assert.ok(nums.some(e => e.answer === 2700), 'el kilo más barato cuesta 2 700');
});
