// Jefes finales de Trigonometría (spec 2026-11-23-trig-jefes-y-movimiento): un jefe por mundo con el juego `jefe-rueda`.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js/.test(f));
const ctx = loadScripts(all), GAMES = get(ctx, 'GAMES'), course = get(ctx, 'COURSE_TRIG'), boss = GAMES['jefe-rueda'];

test('cada mundo de Trigonometría tiene su jefe final, con nombre, escenas y tres fases', () => {
  assert.equal(course.units.length, 3);
  const ids = new Set();
  for (const u of course.units) {
    const b = u.boss;
    assert.ok(b && b.id && b.title, `${u.world}: falta el jefe`); ids.add(b.id);
    assert.ok(b.clip.scenes.length >= 2, `${u.world}: escenas del jefe`);
    assert.equal(b.ex.length, 1);
    const ex = b.ex[0];
    assert.equal(ex.game, 'jefe-rueda'); assert.ok(ex.q.length > 20 && ex.hint.length > 30 && ex.explain.length > 30);
    assert.equal(ex.params.rounds.length, 3, `${u.world}: tres fases`);
    assert.ok(['kraken', 'faro', 'nebulosa'].includes(ex.params.kind) && ex.params.name);
    assert.ok(!u.lessons.some(l => l.id === b.id), 'el jefe no es una lección');
  }
  assert.equal(ids.size, 3);
});

test('cada ataque tiene solución sobre los nudos del tablero, no empieza resuelto y su rótulo es corto', () => {
  let multi = 0, n = 0;
  for (const u of course.units) for (const r of u.boss.ex[0].params.rounds) {
    assert.ok(r.title && r.items.length >= 3 && r.items.length <= 4, `${u.world}: ataques por fase`);
    for (const it of r.items) {
      n++;
      const rings = it.rings ? it.rings.length : 1, step = it.step || (rings > 1 ? 30 : 15);
      assert.ok(it.targets.length >= 1);
      for (const [deg, ring = 0] of it.targets) { assert.equal(deg % step, 0, `${it.say}: ${deg}° no es un nudo`); assert.ok(deg >= 0 && deg < 360 && ring >= 0 && ring < rings, it.say); }
      assert.equal(new Set(it.targets.map(t => t.join())).size, it.targets.length, 'sin marcas repetidas');
      assert.equal(boss.ok(boss.answer(it), it), true, it.say); assert.equal(boss.ok(boss.init(it), it), false, it.say);
      assert.equal((it.say.match(/\$/g) || []).length % 2, 0, `TeX parejo: ${it.say}`);
      assert.ok(it.say.replace(/\\[a-z]+|[{}$\\]/g, '').length <= 62, `rótulo corto: ${it.say}`);
      assert.ok(it.why && it.why.length >= 15, `explicación del golpe: ${it.say}`);
      if (it.targets.length > 1) multi++;
    }
  }
  assert.ok(n >= 27 && multi >= 10, 'hay ataques con varias soluciones');
});

test('casos para pensar: un ángulo de triángulo no pasa de 180° y las inversas dan un solo valor', () => {
  const items = course.units.flatMap(u => u.boss.ex[0].params.rounds.flatMap(r => r.items));
  assert.ok(items.some(it => /cos C/.test(it.say) && it.targets.length === 1));
  assert.ok(items.some(it => /\^\{-1\}/.test(it.say) && it.targets.length === 1));
  assert.ok(items.some(it => it.rings && it.targets.length >= 3), 'raíces en la Galaxia Polar');
});

test('la calificación cuenta los ataques de cada fase', () => {
  const p = course.units[0].boss.ex[0].params, full = { done: p.rounds.map(r => r.items.length) };
  assert.equal(boss.grade(full, p).ok, true);
  assert.equal(boss.grade({ done: p.rounds.map((r, i) => (i === 2 ? 0 : r.items.length)) }, p).ok, false);
});

test('el jefe está registrado, con guía y vidas; los juegos de cierre se mueven con las ayudas del kit', () => {
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), guia = fs.readFileSync(path.join(ROOT, 'js/guia.js'), 'utf8');
  assert.ok(html.includes('src="js/games/jefe-rueda.js"') && sw.includes("'js/games/jefe-rueda.js'"));
  assert.ok(guia.includes("'jefe-rueda': [[") && guia.slice(guia.indexOf('GUIDE_ARCADE'), guia.indexOf('const GUIDES')).includes("'jefe-rueda'"));
  const TK = get(ctx, 'TK');
  assert.equal(typeof TK.glide, 'function'); assert.equal(typeof TK.prog, 'function');
  // Sin reloj de cuadros (en Node) el valor salta al destino: nada depende de la animación.
  const G = { dt: 0, t: 0 };
  assert.equal(TK.glide(G, 'x', 5), 5); assert.equal(TK.prog(G, 1), 1);
  for (const g of ['rueda-rodante', 'ola-entre-lineas', 'crestas-faroles', 'quita-vueltas', 'bisagra-area', 'parientes-polares', 'espejo-cuadrantes', 'ventana-inversa', 'tira-doble'])
    assert.ok(/TK\.(glide|prog)\(/.test(fs.readFileSync(path.join(ROOT, `js/games/${g}.js`), 'utf8')), `${g} se mueve`);
});

test('las chispas de acierto viven solo dentro de questGame (roundsGame no las conoce)', () => {
  const kit = fs.readFileSync(path.join(ROOT, 'js/games/kit.js'), 'utf8'), q = kit.indexOf('function questGame');
  assert.ok(q > 0 && kit.indexOf('const bits = []') > q && kit.indexOf('for (const b of bits)') > q);
  assert.equal(kit.slice(kit.indexOf('function roundsGame'), q).includes('bits'), false);
});
