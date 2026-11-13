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

// Mejoras (spec 2026-11-14-mejoras-carrera-y-aguja): ayuda tras fallar y turbo por racha.
test('carrera-fracciones: valor de un texto, reglas para comparar y ayuda que no regala el resultado', () => {
  const g = G('carrera-fracciones');
  assert.equal(g.valueOf('1/4'), 0.25);
  assert.equal(g.valueOf('−6/3'), -2);
  assert.equal(g.valueOf('0.125'), 0.125);
  assert.equal(g.helpOf({ ask: '1/4', options: ['0.25', '0.4', '1.4'], answer: 0 }), '1/4 es 1 ÷ 4');
  assert.equal(g.helpOf({ ask: '−6/3', options: ['−2', '2', '−3'], answer: 0 }), '−6/3 es −6 ÷ 3');
  const h9 = g.helpOf({ ask: '0.9', options: ['9/10', '1/9', '9/100'], answer: 0 });
  assert.ok(/décimas/.test(h9) && !/9 décimas/.test(h9), 'si la respuesta es 9/10, la ayuda no cuenta las décimas');
  assert.equal(g.helpOf({ ask: '0.2', options: ['1/5', '2/1', '1/2'], answer: 0 }), '0.2 son 2 décimas');
  assert.ok(!/cero|\b0 ÷/.test(g.helpOf({ ask: '0/5', options: ['0', '5', '1/5'], answer: 0 })), 'con 0/5 no dice «cero»');
  assert.equal(g.helpOf({ ask: '0.125', options: ['1/8', '1/25', '12/5'], answer: 0 }), '0.125 son 125 milésimas');
  assert.equal(g.helpOf({ ask: '1.5', options: ['3/2', '1/5', '15/100'], answer: 0 }), '1.5 son 15 décimas');
  assert.match(g.helpOf({ ask: '12/18', options: ['2/3', '18/12', '1/6'], answer: 0 }), /arriba y abajo/);
  // Enfoque conceptual (spec 2026-11-14-juegos-conceptuales-valle): cada nombre corta la unidad en sus partes.
  assert.equal(g.partsOf('1/4'), 4);
  assert.equal(g.partsOf('−6/3'), 3);
  assert.equal(g.partsOf('0.25'), 100);
  assert.equal(g.partsOf('0.5'), 10);
  assert.equal(g.partsOf('4'), 1);
  assert.equal(g.rangeOf({ ask: '1/4', options: ['0.25', '0.4', '1.4'] }).join(), '0,2');
  assert.equal(g.rangeOf({ ask: '−6/3', options: ['−2', '2', '−3'] }).join(), '-3,2');
  assert.equal(g.rangeOf({ ask: '1/2', options: ['0.5', '0.2', '0.7'] }).join(), '0,1');
});

test('carrera-fracciones: no hay cuentas a contrarreloj (la fila espera) y las reglas del contenido caben', () => {
  const src = fs.readFileSync(path.join(ROOT, 'js/games/carrera-fracciones.js'), 'utf8');
  assert.match(src, /state === 'waiting'\) return;/, 'la fila se detiene hasta que se elige');
  assert.ok(!/turbo/.test(src), 'sin turbo de velocidad');
  const g = GAMES['carrera-fracciones'];
  for (const r of paramsOf('alg-11b').rounds) for (const it of r.items) {
    const [lo, hi] = g.rangeOf(it);
    assert.ok(hi - lo <= 8, `${it.ask}: la regla va de ${lo} a ${hi}`);
  }
});

test('carrera-fracciones (alg-11b): la ayuda de cada pregunta existe y no trae la respuesta', () => {
  const g = GAMES['carrera-fracciones'];
  for (const r of paramsOf('alg-11b').rounds) for (const it of r.items) {
    const h = g.helpOf(it);
    assert.ok(h.length > 8, it.ask);
    assert.ok(!h.split(/[\s,]+/).includes(it.options[it.answer]), `${it.ask}: «${h}» trae la respuesta`);
  }
});

test('frena-aguja: estrellas según la puntería y enteros que encierran al número', () => {
  const g = G('frena-aguja');
  assert.equal(g.starsOf(0.02, 0.2), 3);
  assert.equal(g.starsOf(0.1, 0.2), 2);
  assert.equal(g.starsOf(0.19, 0.2), 1);
  assert.equal(g.starsOf(0.25, 0.2), 0);
  assert.equal(g.bracket(2.646).join(), '2,3');
  assert.equal(g.bracket(-2.236).join(), '-3,-2');
  assert.equal(g.bracket(3.1416).join(), '3,4');
});

// ---------- frena-aguja ----------
test('frena-aguja: se construye el número (cuadrado o rueda), sin aguja que frenar a tiempo', () => {
  const g = G('frena-aguja');
  assert.equal(g.needleAt, undefined, 'ya no hay aguja que se mueva sola');
  assert.equal(g.kindOf('√7'), 'square');
  assert.equal(g.kindOf('−π'), 'wheel');
  assert.equal(g.areaOf({ label: '√7', value: 2.646 }), 7);
  assert.equal(g.areaOf({ label: '−√5', value: -2.236 }), 5);
  assert.ok(Math.abs(g.turnsOf(Math.PI) - 1) < 1e-12 && Math.abs(g.turnsOf(-Math.PI) - 1) < 1e-12);
  assert.equal(g.digitsOf({ label: '√2', value: 1.414 }), '1.414213');
  assert.equal(g.digitsOf({ label: '−π', value: -3.1416 }), '−3.141592');
  for (const r of paramsOf('alg-11c').rounds) for (const it of r.items) {
    const exact = g.kindOf(it.label) === 'wheel' ? Math.PI : Math.sqrt(g.areaOf(it));
    assert.ok(Math.abs(Math.abs(it.value) - exact) < 0.002, `${it.label}: el valor del contenido es el del cuadrado o la rueda`);
  }
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
