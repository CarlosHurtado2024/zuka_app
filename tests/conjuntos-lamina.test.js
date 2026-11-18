// Teoría de Conjuntos en «lámina» (spec 2026-11-26-conjuntos-lamina): lógica de los cuatro juegos nuevos, contenido
// de las tres lecciones y dibujo común de los juegos del mundo.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const html = read('index.html');
// Estos casos también prueban niveles de la versión original. La secuencia actual se prueba en algebra-taller.test.js.
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra\.js$/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units[0], GAMES = get(ctx, 'GAMES');
const lesson = id => unit.lessons.find(l => l.id === id);
const exOf = (id, game) => lesson(id).ex.find(e => e.game === game);
const J = v => JSON.stringify(v);
const NUEVOS = { 'alg-0a': 'lazo-conjunto', 'alg-0b': 'orbita-conjuntos', 'alg-0c': 'descifra-zona' };
const win = P => ({ done: P.rounds.map(r => r.items.length) });

test('cada lección del mundo termina con su juego nuevo, sin reloj, con pista y explicación', () => {
  for (const [id, name] of Object.entries(NUEVOS)) {
    const ex = lesson(id).ex, last = ex[ex.length - 1];
    assert.equal(last.game, name, `${id} termina con ${name}`);
    assert.ok(last.hint.length > 40 && last.explain.length > 40, `${id}: pista y explicación`);
    assert.equal(GAMES[name].grade(win(last.params), last.params).ok, true);
    assert.equal(GAMES[name].grade({ done: last.params.rounds.map(() => 0) }, last.params).ok, false);
    assert.ok(!/reloj|antes de que|rápido|a tiempo/.test(last.q + last.hint), `${id}: sin prisa`);
  }
  for (const viejo of ['lluvia-elementos', 'revienta-globos', 'luciernagas-venn', 'fabrica-subconjuntos'])
    assert.ok(!unit.lessons.some(l => l.ex.some(e => e.game === viejo)), `${viejo} ya no está en las lecciones`);
  assert.ok(exOf('alg-0b', 'cubo-partes'), 'el retículo de las partes está en alg-0b');
});

test('lazo-conjunto: solo gana quien encierra exactamente los que pertenecen; el lazo se cierra solo', () => {
  const g = GAMES['lazo-conjunto'], it = { name: 'F', rule: 'x es una fruta', members: ['uva', 'pera'], others: ['pan', 'sal'] };
  assert.equal(g.ok({ in: ['pera', 'uva'] }, it), true);
  assert.equal(g.ok({ in: ['uva'] }, it), false, 'falta uno');
  assert.equal(g.ok({ in: ['uva', 'pera', 'pan'] }, it), false, 'sobra uno');
  assert.equal(g.ok(g.answer(it), it), true);
  assert.equal(g.ok(g.init(it), it), false);
  const sq = [[0, 0], [10, 0], [10, 10], [0, 10]];
  assert.equal(g.inPoly(5, 5, sq), true); assert.equal(g.inPoly(15, 5, sq), false);
  assert.equal(g.order(it).slice().sort().join(), [...it.members, ...it.others].sort().join(), 'salen todos, mezclados');
  assert.equal(g.order(it).join(), g.order(it).join(), 'siempre en el mismo orden');
});

test('lazo-conjunto (alg-0a): cada reto cabe en el universo, tiene trampas y elementos distintos', () => {
  const P = exOf('alg-0a', 'lazo-conjunto').params;
  for (const r of P.rounds) for (const it of r.items) {
    const all = [...it.members, ...it.others];
    assert.ok(all.length <= 9, `${it.name}: caben en tres filas`);
    assert.ok(it.members.length >= 2 && it.others.length >= 3, `${it.name}: buenos y trampas`);
    assert.equal(new Set(all).size, all.length, `${it.name}: sin repetidos`);
    assert.ok(all.every(x => x.length <= 10), `${it.name}: palabras cortas`);
  }
});

test('cubo-partes: hay que encender los 2ⁿ subconjuntos sin repetir; empieza todo apagado', () => {
  const g = GAMES['cubo-partes'], it = { elements: ['a', 'b', 'c'] };
  assert.equal(g.label(0, it.elements), '∅'); assert.equal(g.label(5, it.elements), '{a, c}');
  const a = g.answer(it);
  assert.equal(a.seen.length, 8); assert.equal(new Set(a.seen).size, 8);
  assert.equal(g.ok(a, it), true);
  assert.equal(g.ok({ cur: 0, seen: [0, 1, 3, 2, 0, 1, 3, 2] }, it), false, 'repetir no cuenta');
  assert.equal(g.ok({ cur: 0, seen: [0, 1, 2, 3, 4, 5, 6] }, it), false, 'falta uno');
  assert.equal(g.init(it).seen.length, 0, 'ninguno encendido al empezar (ni el vacío): nada se regala');
  assert.equal(g.init({ ...it, start: 7 }).cur, 7, 'los interruptores pueden empezar prendidos');
  assert.equal(g.missing({ cur: 0, seen: [0, 1, 3] }, it), 2, 'el robot va por el primero que falta');
  // El juego no enciende nada solo al mover un interruptor: se enciende con el botón, y repetir cuesta una vida.
  const src = read('js/games/cubo-partes.js'), press = src.slice(src.indexOf('function press'), src.indexOf('return Object.assign'));
  assert.match(press, /hitBox\(L\.btn[\s\S]*G\.bad\(/, 'encender uno repetido es un error');
  assert.ok(!/s\.seen\.push[\s\S]*L\.sw/.test(press.slice(press.indexOf('const k ='))), 'mover un interruptor no enciende');
});

test('cubo-partes (alg-0b): dos y tres elementos, y el estado ganador se acepta', () => {
  const ex = exOf('alg-0b', 'cubo-partes'), P = ex.params, g = GAMES['cubo-partes'];
  const ns = P.rounds.flatMap(r => r.items.map(it => it.elements.length));
  assert.ok(ns.includes(2) && ns.includes(3) && ns.every(n => n === 2 || n === 3));
  assert.ok(P.rounds.flatMap(r => r.items).some(it => it.start != null), 'un reto empieza en otro subconjunto');
  assert.equal(g.grade(win(P), P).ok, true);
  assert.ok(ex.hint.length > 40 && !/∅, \{1\}/.test(ex.hint), 'la pista no dicta el recorrido');
});

test('orbita-conjuntos: subconjunto, iguales, disjuntos y unitario (con el vacío y los repetidos)', () => {
  const R = GAMES['orbita-conjuntos'].REL, A = ['a', 'b', 'c'];
  assert.equal(R.sub([], A), true); assert.equal(R.sub(['a', 'c'], A), true); assert.equal(R.sub(['a', 'z'], A), false);
  assert.equal(R.igual(['c', 'a', 'b', 'a'], A), true); assert.equal(R.igual(['a', 'b'], A), false); assert.equal(R.igual(['a', 'b', 'z'], A), false);
  assert.equal(R.disj([], A), true); assert.equal(R.disj(['x'], A), true); assert.equal(R.disj(['x', 'a'], A), false);
  assert.equal(R.unit(['q', 'q']), true); assert.equal(R.unit([]), false); assert.equal(R.unit(['q', 'r']), false);
});

test('orbita-conjuntos (alg-0b): seis conjuntos por reto, con varios buenos, trampas y el vacío', () => {
  const P = exOf('alg-0b', 'orbita-conjuntos').params, g = GAMES['orbita-conjuntos'];
  const kinds = P.rounds.flatMap(r => r.items.map(it => it.kind));
  assert.equal(kinds.slice().sort().join(), 'disj,igual,sub,unit');
  for (const it of P.rounds.flatMap(r => r.items)) {
    const good = g.goods(it);
    assert.equal(it.sets.length, 6, it.kind);
    assert.ok(good.length >= 2 && good.length <= 4, `${it.kind}: entre 2 y 4 buenos`);
    assert.equal(g.ok({ pick: [...good].reverse() }, it), true, 'el orden de marcar no importa');
    assert.equal(g.ok({ pick: good.slice(1) }, it), false);
    assert.equal(g.ok({ pick: [0, 1, 2, 3, 4, 5] }, it), false);
    assert.ok(it.sets.every(X => X.join(', ').length <= 10), `${it.kind}: caben en su píldora`);
  }
  assert.ok(P.rounds.flatMap(r => r.items).filter(it => it.sets.some(X => !X.length)).length >= 3, 'el vacío aparece');
});

test('descifra-zona: cada operación pinta sus zonas, y vale cualquier operación que dé la zona', () => {
  const g = GAMES['descifra-zona'];   // l, r: 0 A, 1 B, 2 Aᶜ, 3 Bᶜ · op: 0 ∪, 1 ∩, 2 −, 3 △ · zonas: 1 solo A, 2 solo B, 3 centro, 0 fuera
  assert.equal(J(g.region({ l: 0, op: 0, r: 1 })), '[1,2,3]');
  assert.equal(J(g.region({ l: 0, op: 1, r: 1 })), '[3]');
  assert.equal(J(g.region({ l: 0, op: 2, r: 1 })), '[1]');
  assert.equal(J(g.region({ l: 0, op: 3, r: 1 })), '[1,2]');
  assert.equal(J(g.region({ l: 2, op: 1, r: 3 })), '[0]', 'Aᶜ ∩ Bᶜ = (A ∪ B)ᶜ');
  assert.equal(J(g.region({ l: 2, op: 0, r: 3 })), '[0,1,2]', 'Aᶜ ∪ Bᶜ = (A ∩ B)ᶜ');
  assert.equal(g.ok({ l: 0, op: 2, r: 1 }, { zones: [1] }), true);
  assert.equal(g.ok({ l: 0, op: 1, r: 3 }, { zones: [1] }), true, 'A ∩ Bᶜ también es A − B');
  assert.equal(g.tex({ l: 2, op: 1, r: 1 }), '$A^c \\cap B$');
  // Nada avisa que la operación coincide antes de tocar «Listo» (si no, se gana girando las ruedas a ciegas).
  const src = read('js/games/descifra-zona.js'), draw = src.slice(src.indexOf('function draw'), src.indexOf('function press'));
  assert.ok(/hit = G\.solved/.test(draw) && !/ok\(s, it\)/.test(draw), 'el dibujo no califica');
});

test('descifra-zona (alg-0c): toda zona pedida tiene respuesta, no empieza resuelta y hay complementos', () => {
  const P = exOf('alg-0c', 'descifra-zona').params, g = GAMES['descifra-zona'], items = P.rounds.flatMap(r => r.items);
  for (const it of items) {
    const a = g.answer(it);
    assert.ok(a && g.ok(a, it), `zona ${it.zones}: tiene respuesta`);
    assert.equal(g.ok(g.init(it), it), false, `zona ${it.zones}: no empieza resuelta`);
  }
  assert.equal(new Set(items.map(it => J([...it.zones].sort()))).size, items.length, 'zonas distintas');
  assert.ok(items.filter(it => it.zones.includes(0)).length >= 2, 'varias necesitan complemento');
});

test('los juegos del mundo dibujan con las piezas de la lámina (SK) y están registrados', () => {
  const sw = read('sw.js');
  for (const f of ['conjuntos-kit', ...Object.values(NUEVOS), 'cubo-partes']) {
    assert.ok(html.includes(`src="js/games/${f}.js"`), `${f} en index.html`);
    assert.ok(sw.includes(`'js/games/${f}.js'`), `${f} en el service worker`);
  }
  assert.ok(html.indexOf('games/kit.js') < html.indexOf('games/conjuntos-kit.js') && html.indexOf('games/conjuntos-kit.js') < html.indexOf('games/arma-notacion.js'), 'el kit del mundo va antes de sus juegos');
  const used = new Set(unit.lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => e.game)));
  for (const g of used) assert.match(read(`js/games/${g}.js`), /SK\.(panel|membrane|chip|formal|zones)\(/, `${g} usa la lámina`);
  const kit = read('js/games/conjuntos-kit.js');
  assert.ok(!/#[0-9a-fA-F]{6}/.test(kit), 'el kit del mundo no fija colores: usa la paleta del tema');
  // Las zonas se pintan con el contexto del lienzo: con p.fill dentro del recorte, p5 se saltaba el relleno siguiente.
  const zones = kit.slice(kit.indexOf('function zones'), kit.indexOf('const maskAt'));
  assert.ok(zones.includes('ctx.fillStyle = css') && !/\bp\.(fill|stroke|rect|line)\(/.test(zones), 'zones no usa p.fill ni p.stroke');
  for (const g of Object.values(NUEVOS)) assert.ok(!/performance\.now|millis\(\)|setTimeout/.test(read(`js/games/${g}.js`)), `${g}: nada corre contra el reloj`);
});
