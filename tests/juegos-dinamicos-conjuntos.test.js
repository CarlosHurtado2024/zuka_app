// Juegos dinámicos de la Pradera de Venn (spec 2026-11-13-juegos-dinamicos-pradera): un juego de acción al final de
// cada lección de Conjuntos. Aquí se prueba su lógica pura y que cada ronda del contenido se pueda ganar.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadGame, loadScripts, get, ROOT } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units[0], GAMES = get(ctx, 'GAMES');
const lesson = id => unit.lessons.find(l => l.id === id);

// ---------- lluvia-elementos ----------
test('lluvia-elementos: pertenece solo lo que está en members; se gana atrapando exactamente esos', () => {
  const g = G('lluvia-elementos');
  const P = { rounds: [{ name: 'F', rule: 'x : x es una fruta', members: ['mango', 'pera'], others: ['papa', 'sal'] }] };
  assert.equal(g.belongs('pera', P.rounds[0]), true);
  assert.equal(g.belongs('papa', P.rounds[0]), false);
  assert.equal(g.grade({ caught: [[]] }, P).ok, false, 'el estado inicial no es la respuesta');
  assert.equal(g.grade({ caught: [['mango']] }, P).ok, false);
  assert.equal(g.grade({ caught: [['pera', 'mango']] }, P).ok, true, 'el orden no importa');
  assert.equal(g.grade({ caught: [['pera', 'mango', 'papa']] }, P).ok, false, 'un intruso no vale');
  assert.match(g.grade({ caught: [[]] }, P).solution, /F = \{mango, pera\}/);
});

test('lluvia-elementos: lo que cae alterna buenos y trampas, y los buenos que faltan siempre vuelven a salir', () => {
  const g = G('lluvia-elementos');
  const r = { members: ['a', 'b', 'c'], others: ['x', 'y'] };
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const seen = new Set(); let bad = 0, run = 0, maxRun = 0;
  for (let k = 0; k < 24; k++) {
    const lab = g.nextDrop(r, ['a'], k, rnd);
    assert.ok([...r.members, ...r.others].includes(lab));
    assert.notEqual(lab, 'a', 'lo ya atrapado no vuelve a caer');
    if (r.members.includes(lab)) { seen.add(lab); run = 0; } else { bad++; run++; maxRun = Math.max(maxRun, run); }
  }
  assert.equal([...seen].sort().join(), 'b,c');
  assert.ok(bad >= 6, 'también caen trampas');
  assert.ok(maxRun <= 2, 'nunca más de dos trampas seguidas');
});

// ---------- revienta-globos ----------
test('revienta-globos: subconjunto, iguales, disjuntos, unitario y vacío', () => {
  const g = G('revienta-globos'), A = ['a', 'b', 'c'];
  assert.equal(g.fits(['a', 'c'], A, 'sub'), true);
  assert.equal(g.fits([], A, 'sub'), true, 'el vacío es subconjunto de todos');
  assert.equal(g.fits(['a', 'z'], A, 'sub'), false);
  assert.equal(g.fits(['c', 'a', 'b'], A, 'igual'), true, 'el orden no importa');
  assert.equal(g.fits(['a', 'b', 'c', 'a'], A, 'igual'), true, 'repetir no agrega elementos');
  assert.equal(g.fits(['a', 'b'], A, 'igual'), false);
  assert.equal(g.fits(['x', 'y'], A, 'disj'), true);
  assert.equal(g.fits(['x', 'a'], A, 'disj'), false);
  assert.equal(g.fits(['x'], A, 'unit'), true);
  assert.equal(g.fits(['x', 'x'], A, 'unit'), true, 'un solo elemento distinto');
  assert.equal(g.fits(['x', 'y'], A, 'unit'), false);
  assert.equal(g.fits([], A, 'vacio'), true);
  assert.equal(g.fits(['x'], A, 'vacio'), false);
  assert.equal(g.setText([]), '∅');
  assert.equal(g.setText(['a', 'b']), '{a, b}');
});

test('revienta-globos: se gana llegando a la meta en todas las rondas', () => {
  const g = G('revienta-globos');
  const P = { goal: 3, rounds: [{ kind: 'sub', A: ['a', 'b'], sets: [['a'], ['b'], [], ['z'], ['a', 'z'], ['y']] }, { kind: 'unit', sets: [['a'], ['b'], ['c'], ['a', 'b'], [], ['a', 'c']] }] };
  assert.equal(g.grade({ pops: [0, 0] }, P).ok, false, 'el estado inicial no es la respuesta');
  assert.equal(g.grade({ pops: [3, 2] }, P).ok, false);
  assert.equal(g.grade({ pops: [3, 3] }, P).ok, true);
  assert.ok(g.grade({ pops: [0, 0] }, P).solution.includes('{a}'));
});

// ---------- luciernagas-venn ----------
test('luciernagas-venn: cada punto cae en una zona y cada operación es un grupo de zonas', () => {
  const g = G('luciernagas-venn'), geo = { ca: { x: 100, y: 100 }, cb: { x: 160, y: 100 }, r: 50 };
  assert.equal(g.maskAt(70, 100, geo), 1, 'solo A');
  assert.equal(g.maskAt(130, 100, geo), 3, 'A y B');
  assert.equal(g.maskAt(190, 100, geo), 2, 'solo B');
  assert.equal(g.maskAt(130, 10, geo), 0, 'fuera de los dos');
  const table = { union: [0, 1, 1, 1], inter: [0, 0, 0, 1], diffAB: [0, 1, 0, 0], diffBA: [0, 0, 1, 0], comp: [1, 0, 0, 0], sim: [0, 1, 1, 0] };
  for (const [op, row] of Object.entries(table)) row.forEach((v, mask) => assert.equal(g.inOp(mask, op), !!v, `${op} con máscara ${mask}`));
  for (const op of Object.keys(table)) assert.ok(g.OPS[op].text.length > 2 && g.OPS[op].say.length > 5, op);
});

test('luciernagas-venn: se gana llegando a la meta en todas las rondas', () => {
  const g = G('luciernagas-venn'), P = { goal: 4, rounds: [{ op: 'inter' }, { op: 'comp' }] };
  assert.equal(g.grade({ catches: [0, 0] }, P).ok, false, 'el estado inicial no es la respuesta');
  assert.equal(g.grade({ catches: [4, 3] }, P).ok, false);
  assert.equal(g.grade({ catches: [4, 4] }, P).ok, true);
  assert.ok(g.grade({ catches: [0, 0] }, P).solution.includes('A ∩ B'));
});

test('luciernagas-venn: en el diagrama que se dibuja, toda zona pedida existe y es tocable', () => {
  const g = G('luciernagas-venn');
  for (const w of [256, 300, 340, 420]) {
    const h = Math.round(Math.max(w, 328) * g.ASPECT), geo = g.vennGeo(w, h), area = [0, 0, 0, 0];
    for (let x = geo.box.x + 8; x < geo.box.x + geo.box.w - 8; x += 4) for (let y = geo.box.y + 8; y < geo.box.y + geo.box.h - 8; y += 4) area[g.maskAt(x, y, geo)] += 16;
    area.forEach((a, mask) => assert.ok(a > 1500, `ancho ${w}: la zona ${mask} mide ${a} px²`));
    assert.ok(geo.box.x >= 8 && geo.box.x + geo.box.w <= w - 8 && geo.box.y + geo.box.h <= h - 30, `ancho ${w}: la caja cabe`);
  }
});

// ---------- contenido de las lecciones ----------
const DYN = { 'alg-0a': 'lluvia-elementos', 'alg-0b': 'revienta-globos', 'alg-0c': 'luciernagas-venn' };

test('cada lección de Conjuntos termina con su juego dinámico, con pista y explicación', () => {
  for (const [id, name] of Object.entries(DYN)) {
    const ex = lesson(id).ex, last = ex[ex.length - 1];
    assert.equal(last.type, 'play', id);
    assert.equal(last.game, name, `${id} termina con ${name}`);
    assert.ok(GAMES[name], `${name} cargado`);
    assert.ok(last.hint.length > 40 && last.explain.length > 40, `${id}: pista y explicación`);
  }
  assert.equal(new Set(Object.values(DYN)).size, 3, 'tres mecánicas distintas');
});

test('lluvia-elementos (alg-0a): cada ronda tiene buenos y trampas distintos y se puede ganar', () => {
  const ex = lesson('alg-0a').ex.find(e => e.game === 'lluvia-elementos'), P = ex.params;
  assert.ok(P.rounds.length >= 3);
  for (const r of P.rounds) {
    assert.ok(r.members.length >= 2 && r.others.length >= 3, r.name);
    assert.equal(new Set([...r.members, ...r.others]).size, r.members.length + r.others.length, `${r.name}: sin repetidos`);
    for (const w of [...r.members, ...r.others]) assert.ok(w.length <= 11, `«${w}» no cabe en una ficha que cae`);
  }
  assert.equal(GAMES['lluvia-elementos'].grade({ caught: P.rounds.map(r => [...r.members]) }, P).ok, true);
  assert.equal(GAMES['lluvia-elementos'].grade({ caught: P.rounds.map(() => []) }, P).ok, false);
});

test('revienta-globos (alg-0b): cada ronda trae globos buenos y trampas suficientes', () => {
  const ex = lesson('alg-0b').ex.find(e => e.game === 'revienta-globos'), P = ex.params, g = GAMES['revienta-globos'];
  assert.ok(P.rounds.length >= 3);
  assert.ok(new Set(P.rounds.map(r => r.kind)).size >= 3, 'relaciones distintas');
  for (const r of P.rounds) {
    const good = r.sets.filter(s => g.fits(s, r.A || [], r.kind)).length;
    assert.ok(good >= 3, `${r.kind}: ${good} globos buenos`);
    assert.ok(r.sets.length - good >= 3, `${r.kind}: ${r.sets.length - good} trampas`);
    for (const s of r.sets) assert.ok(s.length <= 4, `${g.setText(s)} no cabe en un globo`);
  }
  assert.equal(g.grade({ pops: P.rounds.map(() => P.goal ?? 4) }, P).ok, true);
  assert.equal(g.grade({ pops: P.rounds.map(() => 0) }, P).ok, false);
});

test('luciernagas-venn (alg-0c): operaciones distintas y conocidas', () => {
  const ex = lesson('alg-0c').ex.find(e => e.game === 'luciernagas-venn'), P = ex.params, g = GAMES['luciernagas-venn'];
  assert.ok(P.rounds.length >= 3);
  assert.equal(new Set(P.rounds.map(r => r.op)).size, P.rounds.length, 'sin repetir operación');
  for (const r of P.rounds) assert.ok(g.OPS[r.op], r.op);
  assert.equal(g.grade({ catches: P.rounds.map(() => P.goal ?? 4) }, P).ok, true);
});

test('luciernagas-venn: encima del borde no cuenta, y un toque corrido prefiere la que sí está en la zona', () => {
  const g = G('luciernagas-venn'), geo = { ca: { x: 100, y: 100 }, cb: { x: 160, y: 100 }, r: 50 };
  assert.equal(g.edgeDist(150, 100, geo), 0, 'sobre el borde de A');
  assert.equal(g.edgeDist(130, 100, geo), 20, 'en medio del cruce');
  const inside = { x: 130, y: 100 }, onlyA = { x: 104, y: 100 }, far = { x: 20, y: 20 };
  assert.equal(g.pickFly([onlyA, inside, far], 116, 100, geo, 'inter'), inside, 'las dos al alcance: gana la de la zona pedida');
  assert.equal(g.pickFly([onlyA, far], 110, 100, geo, 'inter'), onlyA, 'solo hay una al alcance, aunque sea la equivocada');
  assert.equal(g.pickFly([far], 110, 100, geo, 'inter'), null, 'ninguna al alcance');
  const border = { x: 150, y: 100 };
  assert.equal(g.pickFly([border, onlyA], 140, 100, geo, 'inter'), border, 'la del borde no se prefiere, pero es la más cercana');
});
