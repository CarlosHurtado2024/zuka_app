// Preuniversitario UdeA · componente Razonamiento lógico completo (spec 2026-11-18-preuda-razonamiento-completo): en los
// mundos terminados (PU_HECHOS), cada lección tiene 7 u 8 juegos distintos, gráficos, con pista y explicación, y termina en
// uno en movimiento; cada mundo tiene evaluación con al menos dos preguntas por lección; y las rondas de los juegos que
// saben su respuesta se ganan con ella y no empiezan resueltas.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const html = read('index.html'), sw = read('sw.js');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia/.test(f));
const ctx = loadScripts(all);
const GAMES = get(ctx, 'GAMES'), GUIDES = get(ctx, 'GUIDES'), DONE = get(ctx, 'PU_HECHOS');
const units = get(ctx, 'COURSES').find(c => c.id === 'preuda').units.filter(u => u.block === 'razonamiento');
const BORING = ['escala-solucion', 'arma-la-cuenta', 'une-parejas', 'clasifica-cartas', 'verdadero-falso', 'ordena-terminos'];
// Juegos que se mueven solos o se lanzan (arcades y questGame): los que pueden cerrar una lección.
const MOVING = ['billar-rebote', 'vuela-precios', 'salta-signos', 'carrera-fracciones', 'serpiente-orden', 'rompe-cambios', 'encesta-suma',
  'resortera-tres', 'traza-progresion', 'camino-pascal', 'descifra-zona', 'orbita-conjuntos', 'balanza-cajas', 'bote-corriente',
  'dobla-fichas', 'rana-zenon', 'corta-proporciones', 'dispara-inverso', 'buzo-enteros', 'tanque-porcentaje', 'rampa-precio', 'bici-cambios',
  'llaves-tanque', 'lazo-conjunto', 'anillos-subconjunto', 'piedras-selva', 'cruza-o-rebota', 'apunta-chorro', 'donde-cae', 'lirios-laguna',
  'sondea-niebla', 'cruce-curvas', 'llena-estanque', 'dos-bancos', 'regla-de-calculo', 'maquina-sigma', 'luciernagas-venn', 'revienta-globos',
  'lluvia-elementos', 'sirve-la-razon', 'vagon-inverso', 'rebote-signos', 'torre-pisos', 'escala-leyes', 'siembra-raices', 'muro-radicales',
];

test('el archivo de juegos del componente está registrado después de las lecciones', () => {
  assert.ok(html.indexOf('js/courses/preuda-razonamiento.js') < html.indexOf('js/courses/preuda-razonamiento-juegos.js'));
  assert.ok(html.indexOf('js/courses/preuda-razonamiento-juegos.js') < html.indexOf('js/courses/preuda.js'));
  assert.ok(sw.includes("'js/courses/preuda-razonamiento-juegos.js'"));
  for (const f of [...html.matchAll(/src="(js\/courses\/preuda-r-[^"]+)"/g)].map(m => m[1])) {
    assert.ok(html.indexOf(f) < html.indexOf('js/courses/preuda-razonamiento-juegos.js'), f);
    assert.ok(sw.includes(`'${f}'`), f);
  }
});

test('mundos terminados: 7 u 8 juegos distintos, gráficos, con pista, y uno en movimiento al final', () => {
  assert.ok(DONE.length >= 1);
  for (const u of units.filter(u => DONE.includes(u.world))) for (const l of u.lessons) {
    const games = l.ex.map(e => e.game);
    assert.ok(l.ex.length >= 7 && l.ex.length <= 8, `${l.id}: ${l.ex.length}`);
    assert.equal(new Set(games).size, games.length, `${l.id}: repetido (${games})`);
    for (const e of l.ex) {
      assert.equal(e.type, 'play', l.id);
      assert.ok(GAMES[e.game], `${l.id}: no existe ${e.game}`);
      assert.ok(!BORING.includes(e.game), `${l.id}: ${e.game}`);
      assert.ok(GUIDES[e.game] || GAMES[e.game].demo, `${e.game} sin explicación`);
      assert.ok(e.hint?.length > 20 && e.explain?.length > 20, `${l.id}: ${e.game} sin pista`);
    }
    assert.ok(MOVING.includes(games.at(-1)), `${l.id} termina en ${games.at(-1)}`);
  }
});

test('cada mundo terminado tiene evaluación: dos o más preguntas por lección, con juegos de verdad y nota de repaso', () => {
  for (const u of units.filter(u => DONE.includes(u.world))) {
    assert.ok(u.exam && u.exam.items.length, u.world);
    for (const l of u.lessons) assert.ok(u.exam.items.filter(it => it.lesson === l.id).length >= 2, `${u.world}: ${l.id}`);
    for (const it of u.exam.items) {
      assert.ok(u.lessons.some(l => l.id === it.lesson), it.lesson);
      assert.ok(it.review?.length > 10, `${it.lesson}: sin nota de repaso`);
      assert.ok(GAMES[it.ex.game] && !BORING.includes(it.ex.game), `${u.world}: ${it.ex.game}`);
      assert.ok(it.ex.hint?.length >= 30 && it.ex.explain?.length > 10, `${u.world}: ${it.ex.game} pista`);
    }
    assert.ok(u.exam.minutes >= 12);
  }
});

test('rondas de los juegos que saben su respuesta: se ganan con ella y no empiezan resueltas', () => {
  for (const u of units.filter(u => DONE.includes(u.world))) {
    for (const e of [...u.lessons.flatMap(l => l.ex), ...u.exam.items.map(it => it.ex)]) {
      const g = GAMES[e.game];
      if (typeof g.answer !== 'function' || !Array.isArray(e.params.rounds)) continue;
      for (const r of e.params.rounds) {
        if (r.items) continue; // los juegos en movimiento responden por retos, no por rondas
        const s = g.answer(r);
        if (!s || typeof s !== 'object' || Array.isArray(s)) continue;
        assert.equal(g.grade({ rounds: [s] }, { ...e.params, rounds: [r] }).ok, true, `${e.game}: ${JSON.stringify(r)}`);
        assert.equal(g.grade({ rounds: [] }, { ...e.params, rounds: [r] }).ok, false, `${e.game} empieza resuelta: ${JSON.stringify(r)}`);
      }
    }
  }
});

test('acertijos de orden: cada uno tiene una sola solución, y en «descarta-casos» queda una sola tarjeta', () => {
  const ORD = get(ctx, 'ORD');
  for (const u of units.filter(u => DONE.includes(u.world))) {
    for (const e of [...u.lessons.flatMap(l => l.ex), ...u.exam.items.map(it => it.ex)]) {
      const g = GAMES[e.game];
      for (const r of e.params.rounds || []) {
        if (typeof g.solutions === 'function') assert.equal(g.solutions(r).length, 1, `${e.game}: ${JSON.stringify(r.names || r.rows || r.people)}`);
        if (e.game === 'descarta-casos') assert.equal(r.cands.filter(a => r.clues.every(c => ORD.sat(a, c, !!r.circ))).length, 1, JSON.stringify(r.cands));
      }
    }
  }
});
