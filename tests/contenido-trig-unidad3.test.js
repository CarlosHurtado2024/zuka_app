// Unidad 3 de Trigonometría: juegos sin opción múltiple, todos con pista, y rondas alcanzables con los
// controles de cada juego nuevo.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const unit = get(loadScripts(['js/content.js', 'js/courses/trig.js']), 'COURSE_TRIG').units[2];
const lessons = unit.lessons;
const G = name => loadGame(`js/games/${name}.js`)[name];
const plays = lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => ({ id: l.id, ...e })));
const of = game => plays.filter(e => e.game === game);

test('cada lección: sin opción múltiple, mayoría juegos y todos con pista', () => {
  for (const l of lessons) {
    assert.ok(l.ex.length >= 3, l.id);
    const n = l.ex.filter(e => e.type === 'play').length;
    assert.ok(n * 2 > l.ex.length, `${l.id}: ${n} juegos de ${l.ex.length}`);
    for (const [i, e] of l.ex.entries()) {
      assert.notEqual(e.type, 'mc', `${l.id} ${i}`);
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${l.id} ${i} sin pista`);
    }
  }
});

test('los cuatro juegos nuevos se usan y las raíces tienen su video aparte', () => {
  for (const g of ['mapa-tesoro', 'telarana-polar', 'espiral-potencias', 'flor-de-raices']) assert.ok(of(g).length, g);
  const l = lessons.find(l => l.id === 'trig-152'), flor = l.ex.findIndex(e => e.game === 'flor-de-raices');
  assert.equal(l.more[0].after, flor, 'el video de raíces va justo antes de la flor');
});

test('cada ronda se puede resolver con los controles', () => {
  for (const e of of('mapa-tesoro')) for (const r of e.params.rounds) {
    const k = r.a * r.a + r.b * r.b, d = G('mapa-tesoro').argDeg(r.a, r.b);
    assert.ok(Math.abs(k - Math.round(k)) < 1e-9 && k <= 50 && Math.abs(d / 15 - Math.round(d / 15)) < 1e-9, `${e.id}: ${r.label}`);
  }
  for (const e of of('telarana-polar')) for (const r of e.params.rounds) {
    const t = G('telarana-polar').target(r);
    assert.ok(G('telarana-polar').rings(r).includes(t.r) && t.deg % 15 === 0, `${e.id}: ${JSON.stringify(r)}`);
  }
  for (const e of of('espiral-potencias')) for (const r of e.params.rounds) assert.ok(G('espiral-potencias').first(r) != null, `${e.id}: ${r.label}`);
  for (const e of of('flor-de-raices')) for (const R of e.params.rounds) {
    const f = G('flor-de-raices'), first = R.deg / R.n;
    assert.ok(Math.abs(first / 5 - Math.round(first / 5)) < 1e-9, `${e.id}: ${R.label} no cae en pasos de 5°`);
    assert.ok(f.radii(R).some(o => Math.abs(o.v - f.rootR(R)) < 1e-9));
  }
});
