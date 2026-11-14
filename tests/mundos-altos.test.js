// Mundos altos de Álgebra (spec 2026-11-19-mundos-altos): ejercicios, jefe final y evaluación de Taller de los Bloques,
// Fuente de la Parábola, Cordillera Cúbica, Río de Asíntotas y Selva Exponencial.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|guia/.test(f));
const ctx = loadScripts(files);
const GAMES = get(ctx, 'GAMES'), ALG = get(ctx, 'COURSE_ALGEBRA'), GUIDES = get(ctx, 'GUIDES');
const WORLDS = ['polinomios', 'cuadraticas', 'grado-superior', 'racionales', 'exp-log'];
const BOSSES = [...WORLDS, 'numeros', 'razones', 'potencias', 'progresiones'];   // jefes añadidos después a los mundos anteriores
const unit = w => ALG.units.find(u => u.world === w);
const cuenta = GAMES['arma-la-cuenta'], escala = GAMES['escala-solucion'];
// Comprueba un ejercicio de los juegos que se pueden resolver desde los datos.
function check(ex, where) {
  assert.equal(ex.type, 'play', `${where}: ${ex.type}`);
  assert.ok(GAMES[ex.game], `${where}: no existe ${ex.game}`);
  assert.ok(typeof ex.hint === 'string' && ex.hint.length >= 30, `${where}: sin pista`);
  assert.ok(typeof ex.explain === 'string' && ex.explain.length >= 25, `${where}: sin explicación`);
  assert.ok(GUIDES[ex.game], `${where}: ${ex.game} sin guía`);
  const R = ex.params.rounds || [];
  if (ex.game === 'arma-la-cuenta') for (const r of R) {
    const keys = cuenta.keysOf(r);
    assert.ok(Number.isFinite(r.answer), `${where}: la cuenta ${r.sol.join(' ')} no se puede calcular`);
    assert.equal(cuenta.grade({ rounds: [{ seq: r.sol.map(t => keys.indexOf(t)) }] }, ex.params).ok, true, where);
    assert.ok(cuenta.numbersOf(r).length >= 2 && cuenta.numbersOf(r).length <= 8 && r.sol.length <= 15, `${where}: fichas`);
  }
  if (ex.game === 'escala-solucion') for (const r of R) {
    assert.ok(r.levels.length >= 2 && r.levels.length <= 4, `${where}: niveles`);
    for (const lv of r.levels) { assert.ok(lv.length >= 2 && lv.length <= 3 && new Set(lv).size === lv.length, `${where}: agarres`); for (const t of lv) assert.ok(t.length <= 48, `${where}: «${t}» es largo`); }
    assert.equal(escala.grade({ rounds: [{ pick: r.levels.map(() => 0) }] }, ex.params).ok, true);
  }
  if (ex.game === 'arma-la-cuenta') for (const r of R) if (r.sol.length > 1) for (const t of cuenta.numbersOf(r)) assert.ok(Math.abs(cuenta.tileValue(t) - r.answer) > 1e-9, `${where}: la ficha ${t} ya es la respuesta`);
  // La estrella de combina-vectores y su camino caben en el plano (de −6 a 6).
  if (ex.game === 'combina-vectores') for (const r of R) for (const v of [...r.target, ...r.u, ...r.v]) assert.ok(Math.abs(v) <= 6, `${where}: ${r.target} se sale del plano`);
  if (ex.game === 'raices-imanes') for (const r of R) { const f = x => r.a * r.roots.reduce((t, q) => t * (x - q), 1); assert.ok(Math.abs(f(r.mark[0]) - r.mark[1]) < 1e-9, `${where}: la marca no está en la curva`); for (let x = Math.min(...r.roots); x <= Math.max(...r.roots); x += 0.1) assert.ok(f(x) >= r.yr[0] && f(x) <= r.yr[1], `${where}: la curva se corta en x = ${x.toFixed(1)}`); }
  if (ex.game === 'balanza-exponencial') for (const r of R) assert.ok(Math.abs(r.L(r.x) - r.R(r.x)) < 1e-9 && r.x >= -4 && r.x <= 6, `${where}: ${r.txt}`);
  if (ex.game === 'espejo-diagonal') for (const r of R) { for (const [x, y] of r.pts) assert.ok(Math.abs(r.f(x) - y) < 1e-9, `${where}: punto`); assert.ok(r.pts.filter(([x, y]) => x !== y).length >= 2, `${where}: casi todos los puntos están sobre el espejo`); }
  if (ex.game === 'une-parejas') { assert.equal(new Set(ex.params.right).size, ex.params.right.length, `${where}: opciones repetidas`); assert.ok(ex.params.right.length > ex.params.left.length, `${where}: sin distractores`); }
  if (ex.game === 'bloques-area') for (const r of R) {
    const st = r.mode === 'factor' ? { u: r.a, v: r.b } : { u: r.a + r.b, v: r.a * r.b };
    assert.equal(GAMES['bloques-area'].grade({ rounds: [st] }, { rounds: [r] }).ok, true, where);
    assert.ok(r.a >= 1 && r.b >= 1 && r.a <= 9 && r.b <= 9 && r.a + r.b <= 18, `${where}: tamaño`);
  }
  if (ex.game === 'division-sintetica') for (const r of R) assert.ok(GAMES['division-sintetica'].rootsOf(r).length >= 1, `${where}: ningún r entero sirve en ${r.coef}`);
  if (ex.game === 'cancela-factores') for (const r of R) { const n = GAMES['cancela-factores'].bestPairs(r); assert.ok(r.sumTop || r.sumBottom ? n === 0 : n >= 1, `${where}: parejas`); }
}

test('las lecciones de los cinco mundos ya no tienen opción múltiple ni teclado: todo son juegos con pista', () => {
  for (const w of WORLDS) {
    const u = unit(w);
    assert.ok(u.lessons.length >= 3, w);
    for (const l of u.lessons) {
      assert.ok(l.ex.length >= 4, `${l.id}: ${l.ex.length} ejercicios`);
      l.ex.forEach((ex, i) => { if (['alg-4a', 'alg-13b', 'alg-73'].includes(l.id)) assert.equal(ex.type, 'play', `${l.id}#${i}`); else check(ex, `${l.id}#${i}`); });
      assert.ok(new Set(l.ex.map(e => e.game)).size >= 2, `${l.id}: variedad de juegos`);
      for (const m of l.more || []) assert.ok(m.after == null || m.after <= l.ex.length, `${l.id}: la parte 2 del video va después de un ejercicio que no existe`);
    }
  }
});

test('cada mundo tiene su jefe final: tres fases, dos retos por fase, rutas válidas', () => {
  const jefe = GAMES['jefe-ruta'];
  for (const w of BOSSES) {
    const b = unit(w).boss;
    assert.ok(b && /^jefe-alg-/.test(b.id) && b.clip.scenes.length === 2, w);
    const ex = b.ex[0], all = jefe.flat(ex.params);
    assert.equal(ex.game, 'jefe-ruta'); assert.equal(ex.params.rounds.length, 3); assert.equal(all.length, 6);
    assert.ok(ex.hint.length > 30 && ex.params.name.length > 5);
    for (const a of all) {
      assert.ok(a.say.length >= 5 && a.levels.length >= 2 && a.levels.length <= 3, `${w}: ${a.say}`);
      for (const lv of a.levels) { assert.ok(lv.length >= 2 && lv.length <= 3 && new Set(lv).size === lv.length, `${w}: ${a.say}`); for (const t of lv) assert.ok(t.length <= 44, `${w}: «${t}»`); }
      assert.equal(jefe.judge(a, a.levels.map(() => 0)), -1);
      assert.equal(jefe.judge(a, a.levels.map((_, i) => (i === 1 ? 1 : 0))), 1, 'dice en qué nivel está el paso falso');
    }
    assert.equal(jefe.grade({ done: 6 }, ex.params).ok, true); assert.equal(jefe.grade({ done: 5 }, ex.params).ok, false); assert.equal(jefe.grade({}, ex.params).ok, false);
  }
  assert.equal(new Set(BOSSES.map(w => unit(w).boss.id)).size, 9);
  // Con la Pradera, todos los mundos de Álgebra tienen jefe y evaluación.
  for (const u of ALG.units) assert.ok(u.boss && u.exam, `${u.world}: falta jefe o evaluación`);
});

test('cada mundo tiene su evaluación: cinco preguntas, cada una ligada a una lección del mundo', () => {
  for (const w of [...WORLDS, 'progresiones']) {
    const e = unit(w).exam, ids = unit(w).lessons.map(l => l.id);
    assert.ok(e && /^exam-alg-/.test(e.id) && e.minutes >= 10, w);
    assert.equal(e.items.length, 5);
    e.items.forEach((it, i) => { assert.ok(ids.includes(it.lesson), `${w}#${i}: ${it.lesson}`); assert.ok(it.review.length > 30); check(it.ex, `${e.id}#${i}`); });
    assert.ok(new Set(e.items.map(it => it.lesson)).size >= 3, `${w}: cubre varias lecciones`);
  }
});

test('pasos largos: se parten en dos renglones por un corte natural', () => {
  const stepLines = get(ctx, 'stepLines');
  assert.equal(stepLines('x = 3').join('|'), 'x = 3');
  assert.equal(stepLines('Con x = 1: A = 2. Con x = −2: B = 3').join('|'), 'Con x = 1: A = 2.|Con x = −2: B = 3');
  assert.equal(stepLines('x² + 4x + 4 − (x² − 4x + 4)').length, 1, 'sin corte natural queda en uno');
  assert.equal(stepLines('Factor común: 3x(x − 2)(x + 2)').join('|'), 'Factor común:|3x(x − 2)(x + 2)'); assert.equal(stepLines('x² + 7x + 12 = (x + 3)(x + 4)').join('|'), 'x² + 7x + 12|= (x + 3)(x + 4)');
  // El enunciado de cancela-factores es el mismo en todas las rondas: no delata la trampa.
  assert.match(fs.readFileSync(path.join(ROOT, 'js/games/cancela-factores.js'), 'utf8'), /prompt: \(\) =>/);
});

test('juegos nuevos: lógica pura', () => {
  const ds = GAMES['division-sintetica'];
  assert.equal(ds.rowOf([1, -2, -5, 6], 1).join(), '1,-1,-6,0'); assert.equal(ds.remOf([1, -4, 1, 6], 2), 0); assert.equal(ds.remOf([1, 0, -7, 6], -3), 0);
  assert.equal(ds.polyTex([1, 0, -7, 6]), 'x^{3} - 7x + 6'); assert.equal(ds.polyTex([2, 1, -5, 2]), '2x^{3} + x^{2} - 5x + 2');
  assert.equal(ds.rootsOf({ coef: [1, -2, -5, 6], goal: 'zero' }).join(), '-2,1,3');
  assert.equal(ds.grade({ rounds: [{ r: 3, moved: true }] }, { rounds: [{ coef: [1, 1, -4, 2], goal: 'value', value: 26 }] }).ok, true);
  assert.equal(ds.grade({}, { rounds: [{ coef: [1, 1, -4, 2], goal: 'value', value: 26 }] }).ok, false);
  // Pocas divisiones: no alcanza para probar todos los valores; la respuesta es el r que queda elegido.
  assert.equal(ds.maxOf({}), 4); assert.equal(ds.maxOf({ probes: 2 }), 2);
  assert.equal(ds.grade({ rounds: [{ r: 1, tried: [0, 2] }] }, { rounds: [{ coef: [1, -2, -5, 6], goal: 'zero' }] }).ok, true, 'vale razonar la raíz sin haber dividido con ella');
  assert.equal(ds.grade({ rounds: [{ r: 2, tried: [2] }] }, { rounds: [{ coef: [1, -2, -5, 6], goal: 'zero' }] }).ok, false);
  assert.ok(fs.readFileSync(path.join(ROOT, 'js/games/division-sintetica.js'), 'utf8').includes('s.tried.length < maxOf(r) && !s.tried.includes(s.r)'), 'no se divide dos veces con el mismo r ni más de lo permitido');
  const ba = GAMES['bloques-area'];
  assert.equal(ba.grade({ rounds: [{ u: 3, v: 2 }] }, { rounds: [{ mode: 'factor', a: 2, b: 3 }] }).ok, true, 'el orden de a y b no importa');
  assert.equal(ba.grade({ rounds: [{ u: 1, v: 6 }] }, { rounds: [{ mode: 'factor', a: 2, b: 3 }] }).ok, false, 'mismo producto, otra suma');
  assert.equal(ba.grade({ rounds: [{ u: 7, v: 10 }] }, { rounds: [{ mode: 'expand', a: 2, b: 5 }] }).ok, true);
  assert.equal(ba.grade({ rounds: [{ u: 7, v: 7 }] }, { rounds: [{ mode: 'expand', a: 2, b: 5 }] }).ok, false);
  const cf = GAMES['cancela-factores'], r = { top: ['x − 3', 'x + 3'], bottom: ['x + 3', 'x − 2'] }, sum = { top: ['x', '2'], bottom: ['x'], sumTop: true };
  assert.equal(cf.grade({ rounds: [{ pairs: [[1, 0]], done: true }] }, { rounds: [r] }).ok, true);
  assert.equal(cf.grade({ rounds: [{ pairs: [], done: true }] }, { rounds: [r] }).ok, false, 'faltó cancelar');
  assert.equal(cf.grade({ rounds: [{ pairs: [[0, 1]], done: true }] }, { rounds: [r] }).ok, false, 'x − 3 y x − 2 no son iguales');
  assert.equal(cf.grade({ rounds: [{ pairs: [[1, 0]], done: false }] }, { rounds: [r] }).ok, false, 'sin decir «Listo»');
  assert.equal(cf.grade({ rounds: [{ pairs: [], done: true }] }, { rounds: [sum] }).ok, true, 'en una suma no se cancela nada');
  assert.equal(cf.grade({ rounds: [{ pairs: [[0, 0]], done: true }] }, { rounds: [sum] }).ok, false, 'la trampa: cancelar un término');
  assert.match(cf.grade({}, { rounds: [r] }).solution, /frac\{x − 3\}\{x − 2\}/);
});

test('están registrados y no apuran: sin reloj', () => {
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  for (const g of ['bloques-area', 'division-sintetica', 'cancela-factores', 'jefe-ruta']) {
    assert.ok(html.includes(`js/games/${g}.js`) && sw.includes(`js/games/${g}.js`), g);
    assert.ok(!/clock|timer|countdown/i.test(fs.readFileSync(path.join(ROOT, `js/games/${g}.js`), 'utf8')), `${g}: sin reloj`);
  }
  assert.ok(html.indexOf('js/courses/mundos-altos.js') > html.indexOf('js/courses/algebra.js') && html.indexOf('js/courses/mundos-altos.js') < html.indexOf('js/data.js'));
  assert.ok(sw.includes("'js/courses/mundos-altos.js'"));
});
