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
const unit = w => ALG.units.find(u => u.world === w);
const cuenta = GAMES['arma-la-cuenta'], escala = GAMES['escala-solucion'];
// Comprueba un ejercicio de los juegos que se pueden resolver desde los datos.
function check(ex, where) {
  assert.equal(ex.type, 'play', `${where}: ${ex.type}`);
  assert.ok(GAMES[ex.game], `${where}: no existe ${ex.game}`);
  assert.ok(typeof ex.hint === 'string' && ex.hint.length >= 30, `${where}: sin pista`);
  assert.ok(typeof ex.explain === 'string' && ex.explain.trim(), `${where}: sin explicación`);
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

// Sin jefes (spec 2026-11-18-algebra-revision): el usuario no los quiere; sus retos pasaron a la evaluación.
test('ningún mundo tiene jefe final; todos tienen evaluación', () => {
  for (const { world, boss, exam } of ALG.units) { assert.equal(boss, undefined, world); assert.ok(exam, world); }
});

test('cada mundo tiene su evaluación: al menos cinco preguntas, cada una ligada a una lección del mundo', () => {
  for (const w of [...WORLDS, 'progresiones']) {
    const e = unit(w).exam, ids = unit(w).lessons.map(l => l.id);
    assert.ok(e && /^exam-alg-/.test(e.id) && e.minutes >= 10, w);
    assert.ok(e.items.length >= 5, w);
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

test('las escenas de respaldo cuentan el video de cada lección (19 lecciones), con KaTeX bien escrito', () => {
  const ids = WORLDS.flatMap(w => unit(w).lessons.map(l => l.id));
  assert.equal(ids.length, 19);
  for (const id of ids) {
    const l = ALG.units.flatMap(u => u.lessons).find(x => x.id === id), sc = l.clip.scenes;
    assert.ok(sc.length >= 5 && sc.length <= 6, `${id}: ${sc.length} escenas`);
    for (const s of sc) {
      const all = [s.text, s.title || '', ...(s.steps || [])].join(' ');
      assert.equal(all.split('$').length % 2, 1, `${id}: un signo de pesos sin pareja en «${s.text.slice(0, 40)}»`);
      assert.ok(s.text.length >= 40 && s.text.length <= 230, `${id}: escena de ${s.text.length} letras`);
    }
  }
  // Los personajes y ejemplos son los del video.
  const text = id => ALG.units.flatMap(u => u.lessons).find(x => x.id === id).clip.scenes.map(s => s.text + (s.title || '')).join(' ');
  assert.match(text('alg-3'), /mesa.*Beto|Beto.*mesa/); assert.ok(text('alg-92').includes('P(2) = 8 - 8 - 10 + 6 = -4')); assert.match(text('alg-71'), /lirio/); assert.match(text('alg-101'), /corriente/);
});

test('cada lección de los cinco mundos termina con su juego dinámico: uno distinto por lección, sin reloj y con solución', () => {
  const lessons = WORLDS.flatMap(w => unit(w).lessons), used = new Set();
  assert.equal(lessons.length, 19);
  for (const l of lessons) {
    const ex = l.ex[l.ex.length - 1], g = GAMES[ex.game];
    assert.ok(g && typeof g.answer === 'function', `${l.id}: ${ex.game} no es un juego dinámico por retos`);
    assert.ok(!used.has(ex.game), `${l.id}: ${ex.game} ya se usó en otra lección`); used.add(ex.game);
    assert.ok(ex.hint.length >= 40 && ex.explain.length >= 40 && GUIDES[ex.game], `${l.id}: pista, explicación y guía`);
    const src = fs.readFileSync(path.join(ROOT, `js/games/${ex.game}.js`), 'utf8');
    assert.match(src, /questGame\(/); assert.ok(!/clock|timer|countdown|Date\.now/i.test(src), `${ex.game}: sin reloj`);
    assert.ok(html.includes(`js/games/${ex.game}.js`), `${ex.game} en index.html`);
    assert.ok(ex.params.rounds.length >= 2, `${l.id}: rondas`);
    for (const r of ex.params.rounds) {
      assert.ok(r.title.length > 5 && r.items.length >= 2 && r.items.length <= 3, `${l.id}: «${r.title}»`);
      for (const it of r.items) {
        assert.equal(g.ok(g.answer(it, r), it, r), true, `${l.id} ${ex.game}: ${JSON.stringify(it)} no tiene solución`);
        assert.equal(typeof g.grade({}, { rounds: [{ title: 't', items: [it] }] }).solution, 'string');
      }
    }
    // Se califica por retos resueltos en cada ronda.
    assert.equal(g.grade({ done: ex.params.rounds.map(r => r.items.length) }, ex.params).ok, true);
    assert.equal(g.grade({ done: ex.params.rounds.map(() => 0) }, ex.params).ok, false); assert.equal(g.grade({}, ex.params).ok, false);
  }
  // Casos que el estudiante debe pensar: lo que no se arma, lo que no cae, lo que no se corta.
  const P = id => lessons.find(l => l.id === id).ex.slice(-1)[0].params.rounds.flatMap(r => r.items);
  assert.ok(P('alg-24b').some(it => GAMES['reparte-barras'].answer(it).none), 'un montón que no se arma');
  assert.ok(P('alg-4').some(it => !it.roots.length) && P('alg-4').some(it => it.roots.length && it.roots.every(r => r <= 0)), 'sin raíces y raíz detrás');
  assert.ok(P('alg-102').some(it => GAMES['cruce-curvas'].answer(it).marks.length === 0) && P('alg-102').some(it => GAMES['cruce-curvas'].answer(it).marks.length === 1));
  assert.ok(P('alg-73').some(it => it.stones.filter(q => q.ok).length === 2) && P('alg-73').every(it => it.stones.some(q => !q.ok)));
  assert.ok(P('alg-25a').some(it => !it.bottom.some(b => !it.top.includes(b))), 'un sendero sin río');
  // Con cinco linternas y nueve columnas hay que razonar con los signos.
  for (const it of P('alg-92')) assert.ok(it.roots.length < 5 && new Set(it.roots).size === it.roots.length && it.roots.every(r => r >= -4 && r <= 4));
});

test('revisión de los juegos dinámicos: ronda nueva limpia, se puede desplazar, sin repetir ejercicios', () => {
  const kit = fs.readFileSync(path.join(ROOT, 'js/games/kit.js'), 'utf8'), q = kit.slice(kit.indexOf('function questGame'));
  assert.ok(q.includes('if (a.cur !== was && a.cur < R.length) fresh();'), 'al cambiar de ronda el reto empieza limpio');
  assert.ok(q.includes('lost: i => { st.done[i] = 0; fresh(); }'), 'al perder la ronda también');
  assert.ok(q.includes('if (!def.press(G, p.mouseX, p.mouseY)) return;'), 'un toque en zona vacía deja desplazar la lección');
  const lessons = WORLDS.flatMap(w => unit(w).lessons), L = id => lessons.find(l => l.id === id);
  const items = id => L(id).ex.slice(-1)[0].params.rounds.flatMap(r => r.items), rest = id => JSON.stringify(L(id).ex.slice(0, -1));
  // El chorro de una fuente abre hacia abajo.
  for (const it of items('alg-4')) assert.match(it.eq, /^-x\^2/, `donde-cae: ${it.eq}`);
  // Los retos no repiten un ejercicio de la misma lección.
  for (const it of items('alg-73')) assert.ok(!rest('alg-73').includes(JSON.stringify(it.eq).slice(1, -1)), `piedras-selva repite ${it.eq}`);
  assert.ok(!items('alg-3').some(it => it.a === 5) && !items('alg-72').some(it => (it.a === 4 && it.b === 8) || (it.a === 9 && it.b === 27)));
  // Fichas de «cruza / rebota»: los ceros están a 2 unidades o más (la ficha mide menos de 2 unidades).
  for (const it of items('alg-93')) { const z = it.factors.map(f => f[0]).sort((a, b) => a - b); for (let i = 1; i < z.length; i++) assert.ok(z[i] - z[i - 1] >= 2); }
  assert.match(fs.readFileSync(path.join(ROOT, 'js/games/cruza-o-rebota.js'), 'utf8'), /Math\.min\(78, 2 \* \(G\.W - 40\) \/ 10 - 6\)/);
  // El estanque no empieza lejos del denominador común ni lo delata antes de dejar pasar una hora.
  for (const it of items('alg-25b')) assert.equal(GAMES['llena-estanque'].init(it).n, Math.min(it.p, it.q));
  assert.ok(!fs.readFileSync(path.join(ROOT, 'js/games/llena-estanque.js'), 'utf8').includes('no cabe en partes'));
  // La mesa muestra lo elegido, encaje o no; y la apuesta fallida también corre los años.
  assert.ok(fs.readFileSync(path.join(ROOT, 'js/games/arma-la-mesa.js'), 'utf8').includes('xs.length >= 1'));
  assert.ok(fs.readFileSync(path.join(ROOT, 'js/games/dos-bancos.js'), 'utf8').includes('G.s.ran = G.s.year'));
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
