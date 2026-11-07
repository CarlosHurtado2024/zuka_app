// Unidad 2 de Trigonometría: cada lección tiene juegos (nada de opción múltiple), todos con pista, y
// cada ronda de los juegos nuevos se puede resolver con los controles del juego.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const unit = get(loadScripts(['js/content.js', 'js/courses/trig.js']), 'COURSE_TRIG').units[1];
const lessons = unit.lessons;
const G = name => loadGame(`js/games/${name}.js`)[name];
const NEW = ['canon-inverso', 'tanque-pitagorico', 'detector-identidades', 'encadena-angulos', 'corredores-dobles', 'pesca-raices', 'compas-ambiguo', 'brazo-robot'];
const plays = lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => ({ id: l.id, ...e })));
const of = game => plays.filter(e => e.game === game);

test('cada lección: sin opción múltiple, al menos tres ejercicios, mayoría juegos y todos con pista', () => {
  assert.equal(lessons.length, 8);
  for (const l of lessons) {
    assert.ok(l.ex.length >= 3, `${l.id} con pocos ejercicios`);
    const n = l.ex.filter(e => e.type === 'play').length;
    assert.ok(n * 2 > l.ex.length, `${l.id}: ${n} juegos de ${l.ex.length}`);
    for (const [i, e] of l.ex.entries()) {
      assert.notEqual(e.type, 'mc', `${l.id} ejercicio ${i} es de opción múltiple`);
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${l.id} ejercicio ${i} sin pista`);
    }
  }
});

test('los ocho juegos nuevos se usan en la unidad', () => {
  for (const g of NEW) assert.ok(of(g).length, `nadie usa ${g}`);
});

test('cada ronda de los juegos nuevos tiene solución alcanzable', () => {
  for (const e of of('canon-inverso')) for (const r of e.params.rounds) {
    const c = G('canon-inverso'), v = c.principal(r.fn, r.x), snap = r.snap || 15, [lo, hi] = c.RANGE[r.fn];
    const best = Math.round(v / snap) * snap;
    assert.ok(Math.abs(best - v) <= snap / 2 + 1e-6 && best >= lo && best <= hi, `${e.id}: ${r.fn}(${r.x}) no se alcanza`);
    assert.ok(c.grade({ aims: e.params.rounds.map(q => Math.round(c.principal(q.fn, q.x) / (q.snap || 15)) * (q.snap || 15)) }, e.params).ok);
  }
  for (const e of of('tanque-pitagorico')) for (const r of e.params.rounds) {
    const t = G('tanque-pitagorico').target(r);
    assert.ok(Math.abs(t * 100 - Math.round(t * 100)) < 1e-6, `${e.id}: ${t} no cae en pasos de 0.01`);
    assert.ok(Math.abs(t) <= G('tanque-pitagorico').MAX[r.id], `${e.id}: ${t} se sale del dial`);
  }
  for (const e of of('detector-identidades')) for (const r of e.params.rounds) {
    const d = G('detector-identidades'), xs = Array.from({ length: 49 }, (_, k) => -Math.PI + k * Math.PI / 24);
    const hits = xs.filter(x => d.differs(r, x)).length;
    if (r.identity) assert.equal(hits, 0, `${e.id}: «${r.lhs} = ${r.rhs}» se separa`);
    else assert.ok(hits >= 4, `${e.id}: «${r.lhs} = ${r.rhs}» casi no tiene contraejemplos`);
  }
  for (const e of of('encadena-angulos')) for (const r of e.params.rounds) {
    const c = G('encadena-angulos'), N = Array.from({ length: 24 }, (_, k) => (k + 1) * 15).filter(c.isNotable);
    assert.ok(!c.isNotable(r.target) && N.some(a => N.some(b => c.lands({ a, b, op: '+' }) === r.target || c.lands({ a, b, op: '-' }) === r.target)), `${e.id}: ${r.target}°`);
  }
  for (const e of of('corredores-dobles')) for (const r of e.params.rounds)
    assert.ok(Array.from({ length: 24 }, (_, k) => k * 15).some(a => G('corredores-dobles').fits(a, r)), `${e.id}: «${r.prompt}» sin respuesta`);
  for (const e of of('pesca-raices')) for (const r of e.params.rounds) {
    const n = G('pesca-raices').rootsOf(r).length;
    assert.ok(n >= 1 && n <= G('pesca-raices').MAX_HOOKS, `${e.id}: ${n} raíces`);
  }
  for (const e of of('compas-ambiguo')) assert.ok(new Set(e.params.rounds.map(r => G('compas-ambiguo').solutions(r).length)).size >= 2, `${e.id}: todas las rondas con el mismo número de triángulos`);
  for (const e of of('brazo-robot')) for (const r of e.params.rounds) {
    const C = G('brazo-robot').elbowFor(r);
    assert.ok(C >= 10 && C <= 170 && Math.abs(C - Math.round(C)) <= 0.5, `${e.id}: codo ${C}`);
  }
});
