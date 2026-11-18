// Preuniversitario UdeA · mundo 2 «Geometría», lecciones 1 y 2 (spec 2026-11-18-preuda-geometria): 7 u 8 ejercicios
// distintos, todos gráficos y de arrastrar, con un juego en movimiento al final; y la lógica pura de los juegos nuevos.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const html = read('index.html'), sw = read('sw.js');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia/.test(f));
const ctx = loadScripts(all);
const GAMES = get(ctx, 'GAMES'), GUIDES = get(ctx, 'GUIDES');
const U = get(ctx, 'COURSES').find(c => c.id === 'preuda').units.find(u => u.lessons.some(l => l.id === 'pu-ge-1'));
const L = id => U.lessons.find(l => l.id === id);
const ex = (id, game) => L(id).ex.find(e => e.game === game);
const NEW = ['tijera-angulos', 'paralelas-gira', 'apice-triangulo', 'suma-poligono', 'cuadrados-pitagoras', 'escalera-pared', 'billar-rebote'];
const MOVING = ['billar-rebote', 'vuela-precios'];
const BORING = ['escala-solucion', 'arma-la-cuenta', 'une-parejas', 'clasifica-cartas', 'verdadero-falso', 'ordena-terminos'];
// El estado con que se gana cada ronda de un juego por rondas.
const win = (game, params, state) => GAMES[game].grade({ rounds: state }, params).ok;

test('pu-ge-1 y pu-ge-2: 7 u 8 juegos distintos, gráficos, con pista, y uno en movimiento al final', () => {
  for (const id of ['pu-ge-1', 'pu-ge-2']) {
    const l = L(id), games = l.ex.map(e => e.game);
    assert.ok(l.ex.length >= 7 && l.ex.length <= 8, `${id}: ${l.ex.length}`);
    assert.equal(new Set(games).size, games.length, `${id}: repetido (${games})`);
    for (const e of l.ex) {
      assert.equal(e.type, 'play');
      assert.ok(GAMES[e.game], `${id}: no existe ${e.game}`);
      assert.ok(!BORING.includes(e.game), e.game);
      assert.ok(GUIDES[e.game] || GAMES[e.game].demo, `${e.game} sin explicación`);
      assert.ok(e.hint?.length > 20 && e.explain?.length > 20, `${e.game} sin pista`);
    }
    assert.ok(MOVING.includes(games.at(-1)), `${id} termina en ${games.at(-1)}`);
    assert.ok(!games.slice(0, -1).some(g => MOVING.includes(g)));
  }
});

test('los juegos nuevos están registrados, con su guía y su demostración sobre el lienzo', () => {
  assert.ok(html.indexOf('js/games/geo-kit.js') < html.indexOf('js/games/tijera-angulos.js'));
  assert.ok(html.indexOf('js/games/kit.js') < html.indexOf('js/games/geo-kit.js'));
  for (const g of [...NEW, 'geo-kit']) { assert.ok(html.includes(`js/games/${g}.js`), g); assert.ok(sw.includes(`js/games/${g}.js`), g); }
  for (const g of NEW) { assert.ok(GUIDES[g], g); assert.equal(GAMES[g].demo, true, `${g} sin demo`); }
});

test('tijera-angulos: opuestos iguales, vecinos suman 180°, complementarios 90° y el vecino doble', () => {
  const g = GAMES['tijera-angulos'], P = ex('pu-ge-1', 'tijera-angulos').params;
  assert.equal(P.rounds.map(g.want).join(), '65,130,55,60,75');
  for (const r of P.rounds) { const w = g.want(r); assert.ok(w % 5 === 0 && w >= 5 && w <= 175 && w !== 100, JSON.stringify(r)); }
  assert.ok(win('tijera-angulos', P, P.rounds.map(r => ({ a: g.want(r) }))));
  assert.ok(!win('tijera-angulos', P, P.rounds.map((r, i) => ({ a: g.want(r) + (i === 1 ? 5 : 0) }))));
});

test('paralelas-gira: se gana solo con la misma inclinación, y se puede llegar a ella', () => {
  const P = ex('pu-ge-1', 'paralelas-gira').params;
  for (const r of P.rounds) { assert.ok(r.top % 5 === 0 && Math.abs(r.top) <= 35 && r.t - r.top > 20 && r.t - r.top < 160, JSON.stringify(r)); }
  assert.deepEqual([...new Set(P.rounds.map(r => r.pair))].sort().join(), 'alt,conj,corr');
  assert.ok(win('paralelas-gira', P, P.rounds.map(r => ({ b: r.top }))));
  assert.ok(!win('paralelas-gira', P, P.rounds.map(r => ({ b: r.top + 5 }))));
});

test('apice-triangulo: el ángulo que falta y los tipos de triángulo', () => {
  const g = GAMES['apice-triangulo'];
  for (const id of ['pu-ge-1', 'pu-ge-2']) {
    const P = ex(id, 'apice-triangulo').params, ans = P.rounds.map(g.answer);
    for (const [i, a] of ans.entries()) {
      assert.ok(a, `${id} ronda ${i} sin solución`);
      assert.ok(a.A % 5 === 0 && a.B % 5 === 0 && a.A >= 10 && a.B >= 10 && a.A + a.B <= 170, JSON.stringify(a));
      assert.ok(!(a.A === 50 && a.B === 25), 'la ronda no puede empezar resuelta');
      // El vértice se arrastra con el dedo: no puede quedar más alto que el lienzo (alto ≤ 0.87 de la base).
      const ta = Math.tan(a.A * Math.PI / 180), tb = Math.tan(a.B * Math.PI / 180);
      assert.ok(a.A === 90 || a.B === 90 ? Math.min(ta, tb) <= 0.87 : ta * tb / (ta + tb) <= 0.87, `${id} ronda ${i}: triángulo muy alto`);
    }
    assert.ok(win('apice-triangulo', P, ans));
  }
  assert.ok(g.okOf({ A: 50, B: 60 }, { mode: 'falta', A: 50, C: 70 }));
  assert.ok(!g.okOf({ A: 50, B: 55 }, { mode: 'falta', A: 50, C: 70 }));
  assert.ok(g.okOf({ A: 45, B: 90 }, { mode: 'tipo', tipo: 'rectangulo', y: 'isosceles', A: 45 }));
  assert.ok(!g.okOf({ A: 45, B: 60 }, { mode: 'tipo', tipo: 'rectangulo', y: 'isosceles', A: 45 }));
  assert.ok(!g.okOf({ A: 60, B: 50 }, { mode: 'tipo', tipo: 'equilatero', A: 60 }));
});

test('suma-poligono: hay que trazar las n − 3 diagonales; quedan n − 2 triángulos', () => {
  const P = ex('pu-ge-1', 'suma-poligono').params;
  for (const r of P.rounds) assert.ok(r.n >= 4 && r.n <= 8);
  assert.ok(win('suma-poligono', P, P.rounds.map(r => ({ d: Array.from({ length: r.n - 3 }, (_, i) => i + 2) }))));
  assert.ok(!win('suma-poligono', P, P.rounds.map(r => ({ d: [] }))));
  assert.match(GAMES['suma-poligono'].grade({ rounds: P.rounds.map(() => ({ d: [] })) }, P).solution, /540°/);
});

test('cuadrados-pitagoras: cada ronda tiene catetos enteros dentro de la cuadrícula', () => {
  const P = ex('pu-ge-2', 'cuadrados-pitagoras').params;
  // La cuadrícula de cada ronda es más pequeña que la máxima: los catetos tienen que caber en ella.
  const sol = P.rounds.map(r => { const m = GAMES['cuadrados-pitagoras'].size(r, P); for (let a = 1; a <= m; a++) for (let b = 1; b <= m; b++) if (a * a + b * b === r.c2) return { a, b }; return null; });
  assert.ok(sol.every(Boolean));
  assert.ok(P.rounds.every(r => r.c2 !== 5), 'no puede empezar resuelta (2 y 1)');
  assert.ok(win('cuadrados-pitagoras', P, sol));
  assert.ok(!win('cuadrados-pitagoras', P, sol.map(s => ({ a: s.a, b: s.b + 1 }))));
});

test('escalera-pared: el pie queda a una distancia entera, distinta de la del inicio', () => {
  const g = GAMES['escalera-pared'], P = ex('pu-ge-2', 'escalera-pared').params;
  for (const r of P.rounds) { const d = g.need(r); assert.ok(Number.isInteger(d) && d > 1 && d < r.L, JSON.stringify(r)); }
  assert.ok(win('escalera-pared', P, P.rounds.map(r => ({ d: g.need(r) }))));
  assert.ok(!win('escalera-pared', P, P.rounds.map(r => ({ d: g.need(r) - 1 }))));
});

test('billar-rebote: el punto de mira cae en un medio de la banda y los dos ángulos son iguales', () => {
  const g = GAMES['billar-rebote'], P = ex('pu-ge-1', 'billar-rebote').params;
  for (const r of P.rounds) {
    assert.ok(r.items.length >= 2);
    for (const it of r.items) {
      const x = g.aim(it);
      assert.ok(Number.isInteger(x * 2) && x >= 0.5 && x <= 9.5, `${JSON.stringify(it)} → ${x}`);
      // Ángulo de llegada = ángulo de salida.
      assert.ok(Math.abs((6 - it.p[1]) / Math.abs(x - it.p[0]) - (6 - it.t[1]) / Math.abs(it.t[0] - x)) < 1e-9);
      assert.ok((x - it.p[0]) * (it.t[0] - x) > 0, 'el rebote queda entre la bola y la tronera');
    }
  }
});

test('los juegos de la biblioteca reciben datos con solución, y los ejemplos del video no se repiten', () => {
  const C = GAMES['cuerdas-iguales'];
  for (const r of ex('pu-ge-2', 'cuerdas-iguales').params.rounds) { const t = C.target(r); assert.ok(Number.isInteger(t * 2) && Math.abs(t) <= 8, JSON.stringify(r)); }
  const cr = ex('pu-ge-2', 'compas-raiz').params;
  assert.ok(cr.rounds.every(r => [1, 2, 3, 4].some(a => [1, 2, 3, 4].some(b => a * a + b * b === r.n))));
  for (const r of ex('pu-ge-1', 'rueda-angulo').params.rounds) assert.equal(r.target % 15, 0);
  for (const r of ex('pu-ge-2', 'vuela-precios').params.rounds) for (const it of r.items) {
    assert.equal(new Set(it.options).size, it.options.length);
    const [a, b] = it.ask.match(/\d+/g).map(Number), v = Number(it.options[it.answer]);
    assert.ok(/catetos/.test(it.ask) ? a * a + b * b === v * v : a * a - b * b === v * v, it.ask);
  }
  // La escena habla del hexágono (720°) y de la escalera de 13 m a 5 m de la pared.
  assert.ok(ex('pu-ge-1', 'suma-poligono').params.rounds.every(r => r.n !== 6));
  assert.ok(ex('pu-ge-2', 'escalera-pared').params.rounds.every(r => r.L !== 13));
  assert.ok(ex('pu-ge-2', 'cuadrados-pitagoras').params.rounds.every(r => r.c2 !== 169));
});
