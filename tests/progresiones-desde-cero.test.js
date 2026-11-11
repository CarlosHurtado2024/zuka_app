// Progresiones en cuatro lecciones (spec 2026-11-11-progresiones-desde-cero): juegos nuevos y contenido.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const NEW = ['pisa-huellas', 'dos-escaleras', 'rebota-pelota'];
const OLD = ['escalera-aritmetica', 'parejas-gauss', 'rellena-medios', 'suma-filas', 'limite-serie', 'torre-producto'];
const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...[...NEW, ...OLD].map(n => `js/games/${n}.js`)]);
const alg = get(ctx, 'COURSE_ALGEBRA'), G = get(ctx, 'GAMES');
const lesson = id => alg.units.flatMap(u => u.lessons).find(l => l.id === id);
const uses = (l, n) => l.ex.filter(e => e.game === n);
const IDS = ['alg-14', 'alg-14b', 'alg-14c', 'alg-14d'];
const strings = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out)); return out; };

test('pisa-huellas: a₁ y d hacen caer los pasos conocidos en sus banderas', () => {
  const g = G['pisa-huellas'];
  const P = { rounds: [{ known: [[3, 13], [7, 25]], a1: 7, d: 3 }, { known: [[2, 18], [6, 6]], a1: 21, d: -3 }] };
  assert.equal(g.grade({ ans: [[7, 3], [21, -3]] }, P).ok, true);
  assert.equal(g.grade({ ans: [[10, 3], [21, -3]] }, P).ok, false, 'a₁ corrido: el paso 3 cae en 16');
  assert.equal(g.grade({ ans: [[7, 3], null] }, P).ok, false);
  assert.ok(g.grade({}, P).solution.includes('a₁ = 7, d = 3'));
  assert.equal(g.termAt(7, 3, 3), 13);
});

test('dos-escaleras: la tapa encaja a la altura a₁ + aₙ', () => {
  const g = G['dos-escaleras'];
  const P = { rounds: [{ a1: 2, d: 3, n: 5 }] };
  assert.equal(g.grade({ hs: [16] }, P).ok, true);
  assert.equal(g.grade({ hs: [14] }, P).ok, false);
  assert.equal(g.grade({ hs: [null] }, P).ok, false);
  assert.ok(g.grade({}, P).solution.includes('40'), 'la suma es la mitad de 5 · 16');
});

test('rebota-pelota: cada rebote sube r veces el anterior', () => {
  const g = G['rebota-pelota'];
  const P = { max: 140, rounds: [{ h0: 81, r: 2 / 3, rTex: '2/3' }] };
  assert.equal(g.grade({ hs: [[54, 36, 24]] }, P).ok, true);
  assert.equal(g.grade({ hs: [[54, 27, 0]] }, P).ok, false, 'restar lo mismo no es geométrica');
  assert.equal(g.grade({ hs: [null] }, P).ok, false);
  assert.ok(g.grade({}, P).solution.includes('54, 36, 24'));
});

test('progresiones: cuatro lecciones seguidas antes de la sumatoria', () => {
  const unit = alg.units.find(u => u.world === 'progresiones');
  assert.equal(unit.lessons.map(l => l.id).join(' '), 'alg-14 alg-14b alg-14c alg-14d alg-15');
});

test('progresiones: cada lección con su video (escenas) y luego juegos con pista, sin tarjetas', () => {
  const need = {
    'alg-14': ['pisa-huellas', 'escalera-aritmetica', 'rellena-medios'],
    'alg-14b': ['dos-escaleras', 'parejas-gauss', 'suma-filas'],
    'alg-14c': ['rebota-pelota', 'torre-producto', 'rellena-medios'],
    'alg-14d': ['limite-serie'],
  };
  for (const id of IDS) {
    const l = lesson(id);
    for (const n of need[id]) assert.ok(uses(l, n).length, `${id} sin ${n}`);
    assert.ok(l.clip.scenes.length >= 3, `${id}: escenas de respaldo`);
    assert.ok(!l.more || !l.more.length, `${id}: un solo video`);
    assert.ok(l.ex.length >= 3, `${id}: pocos ejercicios`);
    l.ex.forEach((e, i) => {
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      assert.ok(['play', 'input'].includes(e.type), `${id} ejercicio ${i} es ${e.type}`);
      assert.ok(!['clasifica-cartas', 'verdadero-falso'].includes(e.game), `${id}: quedan tarjetas`);
      if (e.type === 'input') assert.ok(!e.hint.includes(String(e.answer)), `${id}: la pista dice ${e.answer}`);
    });
    assert.deepEqual(strings([l.ex, l.clip]).filter(x => /\d,\d/.test(x)), [], `${id}: coma decimal`);
  }
  assert.equal(uses(lesson('alg-14'), 'rellena-medios')[0].params.kind, 'aritmetica');
  assert.equal(uses(lesson('alg-14c'), 'rellena-medios')[0].params.kind, 'geometrica');
});

test('progresiones: los ejemplos de los videos no se repiten en los ejercicios', () => {
  const bad = {
    'alg-14': ['a_3 = 10', '"first":2,"last":18', '7, 11, 15', '20, 25, 30'],
    'alg-14b': ['1 + 2 + 3', '3, 5, 7, 9, 11', '"a1":3,"d":2,"n":5', '720', '"a1":1,"d":2'],
    'alg-14c': ['1, 3, 9, 27', '800', '"first":2,"last":162', '3, 6, 12'],
    'alg-14d': ['2^{10}', '{3}{10}', '1 + 2 + 4'],
  };
  for (const [id, words] of Object.entries(bad)) {
    const t = JSON.stringify(lesson(id).ex);
    for (const w of words) assert.ok(!t.includes(w), `${id}: «${w}» sale en el video`);
  }
});

test('progresiones: cada ronda se puede ganar con sus controles y los cálculos cuadran', () => {
  const ph = uses(lesson('alg-14'), 'pisa-huellas')[0].params;
  for (const r of ph.rounds) for (const [k, v] of r.known) assert.equal(G['pisa-huellas'].termAt(r.a1, r.d, k), v);
  assert.equal(G['pisa-huellas'].grade({ ans: ph.rounds.map(r => [r.a1, r.d]) }, ph).ok, true);
  const de = uses(lesson('alg-14b'), 'dos-escaleras')[0].params;
  for (const r of de.rounds) assert.ok(2 * r.a1 + (r.n - 1) * r.d <= (de.max || 20), 'la tapa cabe');
  const rp = uses(lesson('alg-14c'), 'rebota-pelota')[0].params;
  for (const r of rp.rounds) [1, 2, 3].forEach(k => assert.ok(Number.isInteger(Math.round(r.h0 * r.r ** k * 1e6) / 1e6), `rebote ${k} entero`));
  assert.equal(G['escalera-aritmetica'].grade({ d: 4 }, uses(lesson('alg-14'), 'escalera-aritmetica')[0].params).ok, true);
  assert.equal(G['parejas-gauss'].grade({ pairs: [[0, 10], [1, 9], [2, 8], [3, 7], [4, 6]] }, uses(lesson('alg-14b'), 'parejas-gauss')[0].params).ok, true);
  assert.equal(G['suma-filas'].grade({ rows: 10 }, uses(lesson('alg-14b'), 'suma-filas')[0].params).ok, true);
  assert.equal(G['torre-producto'].grade({ n: 7 }, uses(lesson('alg-14c'), 'torre-producto')[0].params).ok, true);
  assert.equal(G['limite-serie'].grade({ guess: 13.5 }, uses(lesson('alg-14d'), 'limite-serie')[0].params).ok, true);
  assert.equal(G['limite-serie'].grade({ guess: 16 }, uses(lesson('alg-14d'), 'limite-serie')[1].params).ok, true);
  for (const id of ['alg-14', 'alg-14c']) for (const e of uses(lesson(id), 'rellena-medios')) {
    const want = G['rellena-medios'].means(e.params), slots = want.map(v => e.params.chips.indexOf(v));
    assert.ok(slots.every(j => j >= 0), 'falta un medio entre las fichas');
    assert.equal(G['rellena-medios'].grade({ slots }, e.params).ok, true);
  }
  const answers = IDS.flatMap(id => lesson(id).ex.filter(e => e.type === 'input').map(e => e.answer));
  for (const a of [149, 860, 486, 315, 3]) assert.ok(answers.includes(a), `falta el cálculo ${a}`);
});
