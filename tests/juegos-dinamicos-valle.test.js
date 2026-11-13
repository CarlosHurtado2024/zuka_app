// Juegos dinámicos del Valle de los Números (spec 2026-11-13-juegos-dinamicos-valle): un juego de acción al final de
// cada lección de la unidad 1 de Álgebra. Lógica pura de cada uno y contenido de las rondas.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadGame, loadScripts, get, ROOT } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units[1], GAMES = get(ctx, 'GAMES');
const lesson = id => unit.lessons.find(l => l.id === id);
const DYN = { 'alg-11': 'buzo-enteros', 'alg-11b': 'carrera-fracciones', 'alg-11c': 'frena-aguja', 'alg-12b': 'dispara-inverso', 'alg-12c': 'salta-signos', 'alg-12d': 'serpiente-orden' };
const paramsOf = id => lesson(id).ex.find(e => e.game === DYN[id]).params;
const full = P => ({ done: P.rounds.map(r => r.items.length) });
const none = P => ({ done: P.rounds.map(() => 0) });

test('cada lección del Valle termina con su juego dinámico, con pista y explicación, y los seis son distintos', () => {
  for (const [id, name] of Object.entries(DYN)) {
    const ex = lesson(id).ex, last = ex[ex.length - 1];
    assert.equal(last.game, name, `${id} termina con ${name}`);
    assert.ok(GAMES[name], `${name} cargado`);
    assert.ok(last.hint.length > 40 && last.explain.length > 40, `${id}: pista y explicación`);
    assert.ok(last.params.rounds.length >= 3, `${id}: al menos tres rondas`);
    for (const r of last.params.rounds) assert.ok(r.items.length >= 3, `${id}: cada ronda con tres preguntas o más`);
    assert.equal(GAMES[name].grade(none(last.params), last.params).ok, false, `${name}: el estado inicial no es la respuesta`);
    assert.equal(GAMES[name].grade(full(last.params), last.params).ok, true, `${name}: resolver todo es ganar`);
    const part = full(last.params); part.done[0]--;
    assert.equal(GAMES[name].grade(part, last.params).ok, false, `${name}: falta una pregunta`);
    assert.ok(GAMES[name].grade(none(last.params), last.params).solution.length > 20, `${name}: trae solución`);
  }
  assert.equal(new Set(Object.values(DYN)).size, 6);
});

// ---------- buzo-enteros ----------
test('buzo-enteros: se toca la perla del nivel donde está el buzo (a medio nivel o menos)', () => {
  const g = G('buzo-enteros');
  assert.equal(g.hitIndex(-2.2, [3, -2, -5]), 1);
  assert.equal(g.hitIndex(-2.6, [3, -2, -5]), -1, 'entre dos niveles no toca ninguna');
  assert.equal(g.hitIndex(2.6, [3, 2]), 0, 'la más cercana');
  assert.equal(g.hitIndex(0, [4, -4]), -1);
});

test('buzo-enteros (alg-11): trampas distintas de la respuesta, dentro de la recta, y sin fracciones', () => {
  const P = paramsOf('alg-11');
  for (const r of P.rounds) for (const it of r.items) {
    const all = [it.value, ...it.traps];
    assert.equal(new Set(all).size, 3, `${it.text}: tres alturas distintas`);
    for (const v of all) assert.ok(Number.isInteger(v) && v >= P.min && v <= P.max, `${it.text}: ${v} fuera de la recta`);
    assert.ok(!it.text.includes('/'), it.text);
  }
});

// ---------- carrera-fracciones ----------
test('carrera-fracciones: el carril sale de dónde se toca', () => {
  const g = G('carrera-fracciones');
  assert.equal(g.laneOf(10, 300), 0);
  assert.equal(g.laneOf(150, 300), 1);
  assert.equal(g.laneOf(295, 300), 2);
  assert.equal(g.laneOf(-20, 300), 0);
  assert.equal(g.laneOf(900, 300), 2);
});

test('carrera-fracciones (alg-11b): la opción marcada vale lo mismo que la pregunta y las otras no', () => {
  const val = s => { const t = String(s).replace('−', '-'); const fr = t.split('/'); return fr.length === 2 ? +fr[0] / +fr[1] : +t; };
  for (const r of paramsOf('alg-11b').rounds) for (const it of r.items) {
    assert.equal(it.options.length, 3, it.ask);
    assert.equal(new Set(it.options).size, 3, `${it.ask}: opciones repetidas`);
    it.options.forEach((o, i) => assert.equal(Math.abs(val(o) - val(it.ask)) < 1e-9, i === it.answer, `${it.ask} y ${o}`));
  }
});

// ---------- frena-aguja ----------
test('frena-aguja: la aguja va y vuelve por la recta, y acierta dentro de la tolerancia', () => {
  const g = G('frena-aguja');
  assert.equal(g.needleAt(0, 0, 4, 2), 0);
  assert.equal(g.needleAt(0.5, 0, 4, 2), 2);
  assert.equal(g.needleAt(1, 0, 4, 2), 4);
  assert.equal(g.needleAt(1.5, 0, 4, 2), 2);
  assert.equal(g.needleAt(2, 0, 4, 2), 0);
  assert.equal(g.hits(2.3, 2.236, 0.2), true);
  assert.equal(g.hits(2.5, 2.236, 0.2), false);
});

test('frena-aguja (alg-11c): cada número cabe en su recta, la tolerancia no deja acertar con el entero vecino y hay pista', () => {
  for (const r of paramsOf('alg-11c').rounds) {
    assert.ok(r.tol >= 0.1 && r.tol <= 0.3, `tolerancia ${r.tol}`);
    for (const it of r.items) {
      assert.ok(it.value > r.min + r.tol && it.value < r.max - r.tol, `${it.label} cabe en la recta`);
      assert.ok(Math.abs(it.value - Math.round(it.value)) > r.tol * 0.6, `${it.label}: no se acierta parando en el entero`);
      assert.ok(it.why.length > 15, `${it.label}: explica dónde queda`);
      assert.ok(!Number.isInteger(it.value), `${it.label} no es entero`);
    }
  }
});

// ---------- dispara-inverso ----------
test('dispara-inverso: la ficha sale hacia donde se apunta y pega cuando toca la burbuja', () => {
  const g = G('dispara-inverso');
  const v = g.aim({ x: 100, y: 300 }, { x: 100, y: 100 }, 400);
  assert.ok(Math.abs(v.vx) < 1e-9 && Math.abs(v.vy + 400) < 1e-9, 'recto hacia arriba');
  const d = g.aim({ x: 0, y: 0 }, { x: 30, y: -40 }, 100);
  assert.ok(Math.abs(d.vx - 60) < 1e-9 && Math.abs(d.vy + 80) < 1e-9);
  assert.equal(g.touches({ x: 10, y: 10 }, { x: 30, y: 10 }, 22), true);
  assert.equal(g.touches({ x: 10, y: 10 }, { x: 60, y: 10 }, 22), false);
});

test('dispara-inverso (alg-12b): cuatro burbujas distintas y una sola es la pareja', () => {
  const val = s => { const t = String(s).replace(/−/g, '-'); const fr = t.split('/'); return fr.length === 2 ? +fr[0] / +fr[1] : +t; };
  for (const r of paramsOf('alg-12b').rounds) {
    assert.ok(['sum', 'prod', 'neutro'].includes(r.kind), r.kind);
    assert.ok(r.mission.length > 10);
    for (const it of r.items) {
      assert.equal(new Set(it.targets).size, 4, `${it.ball}: burbujas repetidas`);
      assert.ok(it.answer >= 0 && it.answer < 4 && it.say.length > 4, it.ball);
      if (r.kind === 'sum') it.targets.forEach((t, i) => assert.equal(Math.abs(val(it.ball) + val(t)) < 1e-9, i === it.answer, `${it.ball} + ${t}`));
      if (r.kind === 'prod') it.targets.forEach((t, i) => assert.equal(Math.abs(val(it.ball) * val(t) - 1) < 1e-9, i === it.answer, `${it.ball} · ${t}`));
    }
  }
});

// ---------- salta-signos ----------
test('salta-signos: se salta lo que tiene el signo de la misión; el salto sube y vuelve al suelo', () => {
  const g = G('salta-signos');
  assert.equal(g.mustJump({ sign: -1 }, 'neg'), true);
  assert.equal(g.mustJump({ sign: 1 }, 'neg'), false);
  assert.equal(g.mustJump({ sign: 1 }, 'pos'), true);
  assert.equal(g.jumpHeight(0), 0);
  assert.ok(g.jumpHeight(g.AIR / 2) > 60, 'en la mitad va alto');
  assert.ok(Math.abs(g.jumpHeight(g.AIR)) < 1e-6, 'al final toca el suelo');
  assert.equal(g.jumpHeight(g.AIR + 1), 0);
});

test('salta-signos (alg-12c): el signo marcado es el del resultado, y en cada ronda hay de los dos', () => {
  const ev = s => Function(`"use strict"; return (${s.replace(/−/g, '-').replace(/÷/g, '/').replace(/\)\(/g, ')*(').replace(/-\(/g, '-1*(')});`)();
  for (const r of paramsOf('alg-12c').rounds) {
    assert.ok(['neg', 'pos'].includes(r.mission));
    assert.ok(r.items.some(i => i.sign > 0) && r.items.some(i => i.sign < 0), 'hay que saltar y atrapar');
    for (const it of r.items) {
      assert.equal(Math.sign(ev(it.text)), it.sign, `${it.text} = ${ev(it.text)}`);
      assert.ok(it.text.length <= 12, `«${it.text}» no cabe en la ficha`);
    }
  }
});

// ---------- serpiente-orden ----------
test('serpiente-orden: toca comer el menor que queda; gira hacia donde se toca, sin devolverse', () => {
  const g = G('serpiente-orden'), items = [{ value: 2 }, { value: -5 }, { value: 0 }];
  assert.equal(g.nextIndex(items, []), 1);
  assert.equal(g.nextIndex(items, [1]), 2);
  assert.equal(g.nextIndex(items, [1, 2]), 0);
  assert.equal(g.nextIndex(items, [0, 1, 2]), -1);
  assert.equal(JSON.stringify(g.turnTo({ x: 1, y: 0 }, 5, -40)), JSON.stringify({ x: 0, y: -1 }), 'más vertical: sube');
  assert.equal(JSON.stringify(g.turnTo({ x: 0, y: 1 }, 30, 4)), JSON.stringify({ x: 1, y: 0 }));
  assert.equal(JSON.stringify(g.turnTo({ x: 1, y: 0 }, -50, 3)), JSON.stringify({ x: 1, y: 0 }), 'no se devuelve');
  assert.equal(JSON.stringify(g.stepCell({ c: 6, r: 0 }, { x: 1, y: 0 }, 7, 8)), JSON.stringify({ c: 0, r: 0 }), 'da la vuelta por el borde');
  assert.equal(JSON.stringify(g.stepCell({ c: 0, r: 0 }, { x: 0, y: -1 }, 7, 8)), JSON.stringify({ c: 0, r: 7 }));
});

test('serpiente-orden (alg-12d): valores distintos en cada ronda y el rótulo vale lo que dice', () => {
  const val = s => { let t = String(s).replace(/−/g, '-'); const neg = t.startsWith('-|'); t = t.replace(/^-\|/, '|'); const abs = /^\|.*\|$/.test(t); t = t.replace(/\|/g, ''); const fr = t.split('/'); let v = fr.length === 2 ? +fr[0] / +fr[1] : +t; if (abs) v = Math.abs(v); return neg ? -v : v; };
  for (const r of paramsOf('alg-12d').rounds) {
    assert.equal(new Set(r.items.map(i => i.value)).size, r.items.length, 'sin empates');
    assert.ok(r.items.length <= 6, 'caben en la cuadrícula');
    for (const it of r.items) { assert.ok(Math.abs(val(it.label) - it.value) < 1e-9, `${it.label} = ${it.value}`); assert.ok(it.label.length <= 6, it.label); }
  }
});
