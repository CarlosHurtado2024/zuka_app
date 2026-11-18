// Revisión a fondo de la práctica de Álgebra (spec 2026-11-18-algebra-revision): sin jefes, evaluaciones completas y,
// en los mundos ya revisados, una escena propia por ejercicio: nada de motores genéricos del taller ni juegos repetidos.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const html = read('index.html'), sw = read('sw.js'), app = read('js/app.js');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia/.test(f));
const ctx = loadScripts(all);
const GAMES = get(ctx, 'GAMES'), GUIDES = get(ctx, 'GUIDES'), A = get(ctx, 'COURSE_ALGEBRA'), DONE = get(ctx, 'ALG_REVISADOS'), BORING = get(ctx, 'ALG_ABURRIDOS');
const unit = w => A.units.find(u => u.world === w);
const games = l => l.ex.map(e => e.game);

test('ningún mundo de Álgebra tiene jefe, y la evaluación recoge sus retos', () => {
  for (const u of A.units) {
    assert.equal(u.boss, undefined, u.world);
    const ids = u.lessons.map(l => l.id);
    assert.ok(u.exam.items.length >= 8, `${u.world}: ${u.exam.items.length} preguntas`);
    assert.ok(u.exam.minutes >= Math.round(u.exam.items.length * 1.5) - 1, u.world);
    for (const it of u.exam.items) {
      assert.ok(ids.includes(it.lesson), `${u.world}: ${it.lesson}`);
      assert.ok(it.review && it.review.length > 20, `${u.world}: repaso de ${it.ex.game}`);
      assert.ok(GAMES[it.ex.game], it.ex.game);
    }
  }
  assert.ok(app.includes('u.boss ?'), 'el camino dibuja el jefe solo si existe');
});

test('el archivo de la revisión va después del taller y está en el service worker', () => {
  assert.ok(html.indexOf('js/courses/algebra-taller.js') < html.indexOf('js/courses/algebra-revision.js'));
  assert.ok(sw.includes("'js/courses/algebra-revision.js'"));
});

test('mundos revisados: escenas propias, 7 u 8 juegos distintos y sin repetir juegos en el curso', () => {
  assert.ok(DONE.includes('conjuntos'));
  const seen = new Map();
  for (const l of A.units.flatMap(u => u.lessons)) for (const g of games(l)) seen.set(g, [...(seen.get(g) || []), l.id]);
  for (const w of DONE) {
    const u = unit(w);
    for (const l of u.lessons) {
      const gs = games(l);
      assert.ok(gs.length >= 7 && gs.length <= 8, `${l.id}: ${gs.length}`);
      assert.equal(new Set(gs).size, gs.length, `${l.id}: repetido`);
      for (const e of l.ex) {
        assert.ok(!e.game.startsWith('taller-'), `${l.id}: ${e.game} es un motor genérico`);
        assert.ok(!BORING.includes(e.game), `${l.id}: ${e.game}`);
        assert.ok(GAMES[e.game], `${l.id}: no existe ${e.game}`);
        assert.ok(GUIDES[e.game] || GAMES[e.game].demo, `${l.id}: ${e.game} sin explicación`);
        assert.ok(e.hint?.length > 20 && e.explain?.length > 20, `${l.id}: ${e.game} sin pista`);
        assert.equal(seen.get(e.game).length, 1, `${e.game} se repite en ${seen.get(e.game)}`);
      }
      assert.equal(l.ex.at(-1).motion, true, l.id);
    }
    for (const it of u.exam.items) assert.ok(!it.ex.game.startsWith('taller-') && !BORING.includes(it.ex.game), `${w}: ${it.ex.game} en la evaluación`);
    const per = {}; for (const it of u.exam.items) per[it.lesson] = (per[it.lesson] || 0) + 1;
    for (const l of u.lessons) assert.ok(per[l.id] >= 2, `${w}: ${l.id} tiene ${per[l.id] || 0} preguntas en la evaluación`);
  }
});

// Lógica de los juegos nuevos: con la respuesta se gana, con el inicio no, y cada ronda tiene solución.
const solve = {
  'tamiz-rango': r => ({ L: r.lo - 0.5, R: Math.max(r.lo, r.hi + 1) - 0.5 }),
  'cajas-anidadas': r => ({ in: r.target.map(t => r.tray.indexOf(t)) }),
  gemelos: r => { const n = GAMES.gemelos.need(r); return { outA: n.A, outB: n.B }; },
  'escalera-inclusion': r => ({ tower: GAMES['escalera-inclusion'].chain(r) }),
  'arbol-partes': r => ({ n: GAMES['arbol-partes'].need(r) }),
  'solapa-cardinal': r => ({ k: GAMES['solapa-cardinal'].need(r) }),
  'goma-diferencia': r => ({ gone: GAMES['goma-diferencia'].start(r).filter(v => !GAMES['goma-diferencia'].target(r).includes(v)) }),
  'busca-b': r => ({ B: GAMES['busca-b'].answer(r) }),
};
const uses = () => A.units.flatMap(u => [...u.lessons.flatMap(l => l.ex), ...u.exam.items.map(it => it.ex)]);

test('juegos nuevos del mundo 1: la respuesta gana, el inicio no, y los datos tienen sentido', () => {
  for (const [g, f] of Object.entries(solve)) {
    const list = uses().filter(e => e.game === g);
    assert.ok(list.length >= 2, `${g} se usa en la lección y en la evaluación`);
    for (const e of list) {
      const G = GAMES[g];
      assert.equal(G.grade({ rounds: e.params.rounds.map(f) }, e.params).ok, true, `${g}: ${e.q}`);
      for (const [i, r] of e.params.rounds.entries()) {
        const one = e.params.rounds.map((rr, j) => (j === i ? undefined : f(rr)));
        assert.equal(G.grade({ rounds: one }, e.params).ok, false, `${g}: la ronda ${i + 1} empieza resuelta`);
      }
    }
  }
  // Datos con sentido.
  for (const e of uses().filter(e => e.game === 'tamiz-rango')) for (const r of e.params.rounds) { assert.ok(r.lo >= 0 && r.hi <= r.labels.length - 1 && r.hi >= r.lo - 1, r.text); assert.ok(!/\d|[<>≤≥]|\\mathbb/.test(r.text), `sin números ni desigualdades en Conjuntos: ${r.text}`); }
  // alg-0a no usa ∅, ⊆ ni disjuntos: se ven en alg-0b (spec 2026-11-11-conjuntos-desde-cero).
  for (const e of A.units[0].lessons[0].ex.filter(e => e.game === 'cajas-anidadas' || e.game === 'gemelos')) for (const r of e.params.rounds) assert.ok(!JSON.stringify(r).includes('∅') && (!r.goal || r.goal === '='), JSON.stringify(r));
  for (const e of uses().filter(e => e.game === 'cajas-anidadas')) for (const r of e.params.rounds) assert.ok(r.target.every(t => r.tray.includes(t)) && new Set(r.tray).size === r.tray.length, r.name);
  for (const e of uses().filter(e => e.game === 'solapa-cardinal')) for (const r of e.params.rounds) { const k = GAMES['solapa-cardinal'].need(r); assert.ok(k >= 0 && k <= Math.min(r.a, r.b), JSON.stringify(r)); }
  for (const e of uses().filter(e => e.game === 'busca-b')) for (const r of e.params.rounds) {
    let n = 0; for (let m = 0; m < 2 ** r.U.length; m++) if (GAMES['busca-b'].holds(r.U.filter((_, i) => m & (1 << i)), r).every(Boolean)) n++;
    assert.equal(n, 1, `busca-b: la solución es única (${JSON.stringify(r.conds)})`);
  }
  for (const e of uses().filter(e => e.game === 'goma-diferencia')) for (const r of e.params.rounds) assert.ok([...r.A, ...r.B].every(v => r.U.includes(v)), r.op);
  for (const e of uses().filter(e => e.game === 'arbol-partes')) for (const r of e.params.rounds) assert.ok(Number.isInteger(Math.log2(r.target)) && Math.log2(r.target) <= r.pool.length);
  // Aros: siempre hay al menos una estaca buena y una mala (salvo el vacío, que encaja en todas).
  for (const e of uses().filter(e => e.game === 'anillos-subconjunto')) for (const r of e.params.rounds) for (const it of r.items) {
    const g = GAMES['anillos-subconjunto'].goods(it);
    assert.ok(g.length >= 1 && (it.ring.length === 0 || g.length < it.pegs.length), JSON.stringify(it));
  }
  assert.equal(GAMES['escalera-inclusion'].longest({ sets: [['x'], ['x', 'y', 'z'], [], ['y'], ['x', 'y']] }), 4);
});

test('juegos nuevos registrados, con guía y mano sobre el lienzo', () => {
  for (const g of [...Object.keys(solve), 'anillos-subconjunto']) {
    assert.ok(html.includes(`js/games/${g}.js`) && sw.includes(`'js/games/${g}.js'`), g);
    assert.ok(GUIDES[g], g); assert.equal(GAMES[g].demo, true, g);
  }
  assert.ok(html.indexOf('js/games/conjuntos-kit.js') < html.indexOf('js/games/tamiz-rango.js'));
});
