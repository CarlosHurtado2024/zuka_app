// Juegos dinámicos de Razones, proporciones y porcentajes (spec 2026-11-13-juegos-dinamicos-razones): un juego de
// acción al final de cada lección del mundo. Lógica pura de cada uno y contenido de las rondas.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadGame, loadScripts, get, ROOT } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units[2], GAMES = get(ctx, 'GAMES');
const lesson = id => unit.lessons.find(l => l.id === id);
const DYN = { 'alg-12': 'sirve-la-razon', 'alg-12e': 'corta-proporciones', 'alg-12f': 'resortera-tres', 'alg-13': 'caja-veloz', 'alg-13c': 'vuela-precios', 'alg-13d': 'rompe-cambios' };
const paramsOf = id => lesson(id).ex.find(e => e.game === DYN[id]).params;
const full = P => ({ done: P.rounds.map(r => r.items.length) });
const none = P => ({ done: P.rounds.map(() => 0) });
const num = s => +String(s).replace(/−/g, '-').replace(/\s/g, '');

test('cada lección de Razones termina con su juego dinámico, con pista y explicación, y los seis son distintos', () => {
  for (const [id, name] of Object.entries(DYN)) {
    const ex = lesson(id).ex, last = ex[ex.length - 1];
    assert.equal(last.game, name, `${id} termina con ${name}`);
    assert.ok(GAMES[name], `${name} cargado`);
    assert.ok(last.hint.length > 40 && last.explain.length > 40, `${id}: pista y explicación`);
    assert.ok(last.params.rounds.length >= 3, `${id}: al menos tres rondas`);
    for (const r of last.params.rounds) assert.ok(r.items.length >= 3, `${id}: cada ronda con tres preguntas o más`);
    assert.equal(GAMES[name].grade(none(last.params), last.params).ok, false, `${name}: el estado inicial no es la respuesta`);
    assert.equal(GAMES[name].grade(full(last.params), last.params).ok, true, `${name}: resolver todo es ganar`);
    const part = full(last.params); part.done[1]--;
    assert.equal(GAMES[name].grade(part, last.params).ok, false, `${name}: falta una pregunta`);
    assert.ok(GAMES[name].grade(none(last.params), last.params).solution.length > 20, `${name}: trae solución`);
  }
  assert.equal(new Set(Object.values(DYN)).size, 6);
});

// ---------- sirve-la-razon ----------
test('sirve-la-razon: cuánto hay que servir y si se soltó a tiempo', () => {
  const g = G('sirve-la-razon');
  assert.equal(g.targetOf({ p: 2, q: 3, have: 4 }), 6);
  assert.equal(g.targetOf({ p: 5, q: 2, have: 10 }), 4);
  assert.equal(g.judge(6.2, { p: 2, q: 3, have: 4 }), 'ok');
  assert.equal(g.judge(5.3, { p: 2, q: 3, have: 4 }), 'low');
  assert.equal(g.judge(6.9, { p: 2, q: 3, have: 4 }), 'high');
});

test('sirve-la-razon (alg-12): la cantidad es entera, cabe en el vaso con margen y no es la misma que ya hay', () => {
  const g = GAMES['sirve-la-razon'];
  for (const r of paramsOf('alg-12').rounds) {
    assert.ok(r.a.length > 2 && r.b.length > 2, 'nombres de los dos ingredientes');
    for (const it of r.items) {
      const t = g.targetOf(it);
      assert.ok(Number.isInteger(t) && t >= 2 && t <= it.max - 1, `${it.p}:${it.q} con ${it.have}: servir ${t} en un vaso de ${it.max}`);
      assert.ok(it.have <= it.max && it.p !== it.q, `${it.p}:${it.q}`);
    }
  }
});

// ---------- corta-proporciones ----------
test('corta-proporciones: razones iguales por productos cruzados, y un corte toca la ficha si pasa cerca', () => {
  const g = G('corta-proporciones');
  assert.equal(g.sameRatio('2/3', '8/12'), true);
  assert.equal(g.sameRatio('2/3', '3/4'), false);
  assert.equal(g.sameRatio('3/4', '4/3'), false);
  assert.ok(g.segDist(50, 50, 0, 50, 100, 50) < 1e-9, 'sobre el corte');
  assert.equal(g.segDist(50, 80, 0, 50, 100, 50), 30);
  assert.equal(g.segDist(150, 50, 0, 50, 100, 50), 50, 'más allá de la punta se mide a la punta');
});

test('corta-proporciones (alg-12e): las buenas forman proporción con la de arriba y las trampas no', () => {
  const g = GAMES['corta-proporciones'];
  for (const r of paramsOf('alg-12e').rounds) {
    assert.ok(r.traps.length >= 3, `${r.ref}: trampas`);
    assert.equal(new Set([...r.items.map(i => i.label), ...r.traps, r.ref]).size, r.items.length + r.traps.length + 1, `${r.ref}: sin repetidos`);
    for (const it of r.items) assert.equal(g.sameRatio(r.ref, it.label), true, `${it.label} = ${r.ref}`);
    for (const t of r.traps) assert.equal(g.sameRatio(r.ref, t), false, `${t} ≠ ${r.ref}`);
  }
});

// ---------- resortera-tres ----------
test('resortera-tres: el estirón que hace falta, dónde cae y el estirón redondeado a medios', () => {
  const g = G('resortera-tres');
  assert.equal(g.pullFor({ ref: [2, 6], target: 15 }), 5);
  assert.equal(g.landing({ ref: [2, 6] }, 4), 12);
  assert.equal(g.snapPull(70, 14, 8), 5);
  assert.equal(g.snapPull(76, 14, 8), 5.5);
  assert.equal(g.snapPull(900, 14, 8), 8, 'no pasa del máximo');
  assert.equal(g.snapPull(-20, 14, 8), 0);
});

test('resortera-tres (alg-12f): cada blanco se alcanza con un estirón de medios, dentro del máximo y distinto del de muestra', () => {
  const g = GAMES['resortera-tres'];
  for (const r of paramsOf('alg-12f').rounds) for (const it of r.items) {
    const need = g.pullFor({ ref: r.ref, target: it.target });
    assert.ok(Number.isInteger(need * 2) && need >= 1 && need <= g.MAX_PULL, `blanco a ${it.target}: estirón ${need}`);
    assert.notEqual(need, r.ref[0], `blanco a ${it.target}: es el mismo tiro de muestra`);
  }
});

// ---------- caja-veloz ----------
test('caja-veloz: el teclado escribe hasta cuatro cifras y borra', () => {
  const g = G('caja-veloz');
  assert.equal(g.typeKey('', '2'), '2');
  assert.equal(g.typeKey('2', '5'), '25');
  assert.equal(g.typeKey('25', '⌫'), '2');
  assert.equal(g.typeKey('', '⌫'), '');
  assert.equal(g.typeKey('1234', '5'), '1234');
  assert.equal(g.typeKey('0', '7'), '7', 'sin ceros a la izquierda');
});

test('caja-veloz (alg-13): cada respuesta es un entero corto y es la cuenta que se pregunta', () => {
  for (const r of paramsOf('alg-13').rounds) for (const it of r.items) {
    assert.ok(Number.isInteger(it.answer) && it.answer > 0 && it.answer < 1000, it.ask);
    const pc = it.ask.match(/^(\d+) % de (\d+)$/), wh = it.ask.match(/^¿Qué % es (\d+) de (\d+)\?$/);
    assert.ok(pc || wh, `«${it.ask}» no se reconoce`);
    assert.equal(it.answer, pc ? (+pc[1] * +pc[2]) / 100 : (+wh[1] / +wh[2]) * 100, it.ask);
  }
});

// ---------- vuela-precios ----------
test('vuela-precios: el aleteo sube y la gravedad baja; se pasa por el aro que queda a la altura', () => {
  const g = G('vuela-precios');
  const up = g.stepBird({ y: 200, vy: g.FLAP }, 0.1), down = g.stepBird({ y: 200, vy: 0 }, 0.1);
  assert.ok(up.y < 200 && up.vy > g.FLAP, 'sube, frenando');
  assert.ok(down.y > 200 && down.vy > 0, 'cae');
  assert.equal(g.ringAt(152, [60, 150, 240], 34), 1);
  assert.equal(g.ringAt(105, [60, 150, 240], 34), -1, 'entre dos aros no pasa por ninguno');
});

test('vuela-precios (alg-13c): tres opciones distintas y la marcada es el resultado', () => {
  for (const r of paramsOf('alg-13c').rounds) for (const it of r.items) {
    assert.equal(new Set(it.options).size, 3, it.ask);
    assert.ok(it.answer >= 0 && it.answer < 3);
    const d = it.ask.match(/^(\d+) con (\d+) % de descuento$/), u = it.ask.match(/^(\d+) más el (\d+) %$/), f = it.ask.match(/^(Subir|Bajar) (\d+) % es multiplicar por$/);
    assert.ok(d || u || f, `«${it.ask}» no se reconoce`);
    const want = d ? +d[1] * (1 - d[2] / 100) : u ? +u[1] * (1 + u[2] / 100) : f[1] === 'Subir' ? 1 + f[2] / 100 : 1 - f[2] / 100;
    it.options.forEach((o, i) => assert.equal(Math.abs(num(o) - want) < 1e-9, i === it.answer, `${it.ask}: ${o}`));
  }
});

// ---------- rompe-cambios ----------
test('rompe-cambios: el rebote sale según dónde pega en la paleta, y el ladrillo sale de dónde llega', () => {
  const g = G('rompe-cambios');
  const mid = g.bounce(0, 38, 250), right = g.bounce(38, 38, 250), left = g.bounce(-19, 38, 250);
  assert.ok(Math.abs(mid.vx) < 1e-9 && Math.abs(mid.vy + 250) < 1e-9, 'en el centro sale recto hacia arriba');
  assert.ok(right.vx > 150 && right.vy < 0 && Math.abs(Math.hypot(right.vx, right.vy) - 250) < 1e-6, 'en el borde derecho sale inclinada a la derecha');
  assert.ok(left.vx < 0 && left.vy < 0);
  assert.equal(g.brickAt(20, 300), 0);
  assert.equal(g.brickAt(150, 300), 1);
  assert.equal(g.brickAt(290, 300), 2);
});

test('rompe-cambios (alg-13d): la opción marcada es el resultado de aplicar los dos cambios seguidos', () => {
  for (const r of paramsOf('alg-13d').rounds) for (const it of r.items) {
    assert.equal(new Set(it.options).size, 3, it.ask);
    const m = it.ask.replace(/−/g, '-').match(/^(\d+) → ([+-]\d+) % → ([+-]\d+) %$/);
    assert.ok(m, `«${it.ask}» no se reconoce`);
    const want = +m[1] * (1 + m[2] / 100) * (1 + m[3] / 100);
    it.options.forEach((o, i) => assert.equal(Math.abs(num(o) - want) < 1e-9, i === it.answer, `${it.ask}: ${o}`));
    const naive = +m[1] * (1 + (+m[2] + +m[3]) / 100);
    assert.ok(it.options.some(o => Math.abs(num(o) - naive) < 1e-9), `${it.ask}: falta la trampa de sumar los porcentajes (${naive})`);
  }
});
