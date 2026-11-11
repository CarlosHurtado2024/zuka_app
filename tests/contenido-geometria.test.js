// Curso de Geometría Vectorial y Analítica (spec 2026-11-11-geometria-vectorial): unidades del cronograma,
// sin opción múltiple, todas las tareas con pista que no regala la respuesta, al menos un juego por
// lección y cada ronda de los juegos alcanzable con sus controles.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/data.js']);
const geo = get(ctx, 'COURSE_GEO');
const lessons = geo.units.flatMap(u => u.lessons);
const G = name => loadGame(`js/games/${name}.js`)[name];
const plays = lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => ({ id: l.id, ...e })));
const of = game => plays.filter(e => e.game === game);

test('el curso sigue el cronograma de Geometría Vectorial', () => {
  assert.deepEqual(Array.from(geo.units, u => `${u.title}: ${u.lessons.map(l => l.id).join(' ')}`), [
    'Sistemas de ecuaciones y matrices: geo-1 geo-2 geo-3 geo-4',
    'Inversa y determinantes: geo-5 geo-6 geo-7 geo-8',
    'Vectores y lugares geométricos: geo-9 geo-10 geo-11 geo-12 geo-13',
    'Producto escalar y producto vectorial: geo-14 geo-15 geo-16 geo-17 geo-18',
    'Vectores en la mecánica: geo-19 geo-20 geo-21',
    'Las cónicas: geo-22 geo-23',
  ]);
  const courses = get(ctx, 'COURSES');
  assert.equal(courses.find(c => c.id === 'geo'), geo, 'COURSES usa COURSE_GEO');
  assert.equal(courses.findIndex(c => c.id === 'geo'), courses.findIndex(c => c.id === 'calc') + 1, 'va después de Cálculo');
});

test('cada lección: escenas de respaldo, sin opción múltiple, con juego y con pistas', () => {
  for (const l of lessons) {
    assert.ok(l.clip.scenes.length >= 4, `${l.id}: escenas`);
    assert.ok(l.ex.length >= 4, `${l.id}: ${l.ex.length} ejercicios`);
    assert.ok(l.ex.some(e => e.type === 'play'), `${l.id} sin juego`);
    for (const [i, e] of l.ex.entries()) {
      assert.ok(e.type === 'play' || e.type === 'input', `${l.id} ${i}: ${e.type}`);
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${l.id} ${i} sin pista`);
      assert.ok(typeof e.explain === 'string' && e.explain.length > 20, `${l.id} ${i} sin explicación`);
      if (e.type === 'input') {
        const a = String(e.answer), plain = e.hint.replace(/\$/g, '');
        assert.ok(!new RegExp(`(=|es|vale)\\s*${a.replace(/[.-]/g, '\\$&')}(?![\\d.])`).test(plain), `${l.id} ${i}: la pista regala ${a}`);
      }
    }
  }
});

test('los cinco juegos nuevos se usan', () => {
  for (const g of ['fila-a-fila', 'afina-sistema', 'combina-vectores', 'flecha-vector', 'conica-viva']) assert.ok(of(g).length, g);
});

test('fila a fila: matrices enteras pequeñas y det solo en cuadradas', () => {
  for (const e of of('fila-a-fila')) for (const r of e.params.rounds) {
    assert.ok(r.M.length <= 3 && r.M[0].length <= 6 && r.M.every(row => row.length === r.M[0].length && row.every(Number.isInteger)), e.id);
    assert.ok(['escalonada', 'reducida'].includes(r.goal), e.id);
    if (r.det) assert.equal(r.M.length, r.M[0].length - (r.aug || 0), `${e.id}: det en no cuadrada`);
  }
});

test('afina, combina y cónica: cada ronda tiene solución con las perillas', () => {
  for (const e of of('afina-sistema')) for (const r of e.params.rounds) assert.ok(G('afina-sistema').answer(r), `${e.id}: ${JSON.stringify(r)}`);
  const cv = G('combina-vectores');
  for (const e of of('combina-vectores')) for (const r of e.params.rounds) {
    const step = r.step || 1;
    for (const c of cv.coefs(r)) assert.ok(Math.abs(c) <= cv.LIM && Math.abs(c / step - Math.round(c / step)) < 1e-9, `${e.id}: ${JSON.stringify(r)}`);
  }
  const co = G('conica-viva');
  for (const e of of('conica-viva')) for (const r of e.params.rounds) {
    for (const k of co.keysOf(r.type)) {
      if (k === 'dir') { assert.ok(['x', 'y'].includes(r.ans.dir), e.id); continue; }
      const K = co.KNOB[k], v = r.ans[k];
      assert.ok(v >= K.min && v <= K.max && Math.abs((v - K.min) / K.step - Math.round((v - K.min) / K.step)) < 1e-9 && !(k === 'p' && v === 0), `${e.id}: ${r.eq} ${k}`);
    }
  }
});

test('flecha vector: alguna flecha de la cuadrícula cumple cada ronda', () => {
  const fv = G('flecha-vector');
  for (const e of of('flecha-vector')) e.params.rounds.forEach((r, i) => {
    const R = r.range || 6, grid = [];
    for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) grid.push([x, y]);
    const tails = r.freeTail ? grid : [r.tail || [0, 0]];
    const ok = tails.some(t => grid.some(tip => fv.meets({ tail: t, tip }, r)));
    assert.ok(ok, `${e.id} ronda ${i + 1}: ${r.ask}`);
  });
});
