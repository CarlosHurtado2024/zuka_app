// Preuniversitario UdeA · mundo 1 «Cálculo Mental» (spec 2026-11-18-preuda-mundo-1): el estándar que pidió el usuario
// para todas las lecciones: 7 u 8 ejercicios DISTINTOS (ningún juego repetido dentro de la lección), todos gráficos e
// interactivos (nada de opción múltiple, tarjetas ni fichas de solo tocar), y al final un juego en movimiento.
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
const U = get(ctx, 'COURSES').find(c => c.id === 'preuda').units[0];
// Juegos en movimiento (algo corre, vuela o se desliza solo): van de último.
const MOVING = ['salta-signos', 'carrera-fracciones', 'vuela-precios', 'serpiente-orden', 'buzo-enteros', 'dispara-inverso', 'rompe-cambios', 'corta-proporciones'];
// Mecánicas que el usuario no quiere: escoger entre opciones, tarjetas y armar con fichas de solo tocar.
const BORING = ['escala-solucion', 'arma-la-cuenta', 'une-parejas', 'clasifica-cartas', 'verdadero-falso', 'ordena-terminos'];

test('las cuatro lecciones: 7 u 8 ejercicios distintos, gráficos, con pista, y un juego en movimiento al final', () => {
  assert.equal(U.lessons.map(l => l.id).join(), 'pu-cm-1,pu-cm-2,pu-cm-3,pu-cm-4');
  for (const l of U.lessons) {
    const games = l.ex.map(e => e.game);
    assert.ok(l.ex.length >= 7 && l.ex.length <= 8, `${l.id}: ${l.ex.length} ejercicios`);
    assert.equal(new Set(games).size, games.length, `${l.id}: juego repetido (${games})`);
    for (const e of l.ex) {
      assert.equal(e.type, 'play', l.id);
      assert.ok(GAMES[e.game], `${l.id}: no existe ${e.game}`);
      assert.ok(!BORING.includes(e.game), `${l.id}: ${e.game} es de solo tocar`);
      assert.ok(GUIDES[e.game] || GAMES[e.game].demo, `${l.id}: ${e.game} sin explicación`);
      assert.ok(e.hint?.length > 20 && e.explain?.length > 20, `${l.id}: ${e.game} sin pista o explicación`);
    }
    assert.ok(MOVING.includes(games.at(-1)), `${l.id}: termina en ${games.at(-1)}, que no es de movimiento`);
    assert.ok(!games.slice(0, -1).some(g => MOVING.includes(g)), `${l.id}: el juego en movimiento va solo al final`);
  }
});

test('cada ejercicio trae datos con solución (los juegos de la biblioteca califican bien su respuesta)', () => {
  const byGame = g => U.lessons.flatMap(l => l.ex).filter(e => e.game === g);
  for (const e of byGame('recta-espejo')) assert.ok(e.params.rounds.every(r => r.value >= e.params.min && r.value <= e.params.max));
  for (const e of byGame('ascensor')) assert.ok(e.params.rounds.every(r => r.start + r.move >= e.params.min && r.start + r.move <= e.params.max));
  for (const e of byGame('ubica-en-recta')) assert.ok(e.params.points.every(q => q.value >= e.params.min && q.value <= e.params.max));
  for (const e of byGame('cuadricula-cien')) assert.ok(e.params.rounds.every(r => Number.isInteger(r.count) && r.count > 0 && r.count < 100));
  for (const e of byGame('candado-fraccion')) assert.ok(e.params.rounds.every(r => Math.abs(parseFloat(r.dec) - r.num / r.den) < 1e-9));
  for (const e of byGame('rueda-porcentaje')) assert.ok(e.params.rounds.every(r => Number.isInteger(100 * r.part / r.whole)));
  for (const e of byGame('pinta-personas')) assert.ok(e.params.rounds.every(r => Number.isInteger(r.total * r.pct / 100)));
  for (const e of byGame('etiqueta-rebaja')) for (const it of e.params.items) assert.ok(e.params.stickers.includes(it.price * (100 + it.change) / 100), it.name);
  for (const e of byGame('estira-barra')) assert.ok(e.params.rounds.every(r => r.pct > 0 && r.pct <= e.params.max));
  for (const e of byGame('torre-pisos')) assert.ok(e.params.rounds.every(r => r.items.every(it => it.exp >= r.lo && it.exp <= r.hi)));
  for (const e of byGame('compas-raiz')) assert.ok(e.params.rounds.every(r => [1, 2, 3, 4].some(a => [1, 2, 3, 4].some(b => a * a + b * b === r.n))));
  for (const e of byGame('lupa-densidad')) assert.ok(e.params.rounds.every(r => r.a.value !== r.b.value && Math.min(r.a.value, r.b.value) >= r.view[0] && Math.max(r.a.value, r.b.value) <= r.view[1]));
  for (const g of ['carrera-fracciones', 'vuela-precios']) for (const e of byGame(g)) assert.ok(e.params.rounds.every(r => r.items.every(it => it.answer >= 0 && it.answer < it.options.length && new Set(it.options).size === it.options.length)));
  // La recta de siembra-raices va de −span a span: lo que hay que sembrar tiene que caber.
  for (const e of byGame('siembra-raices')) for (const r of e.params.rounds) for (const it of r.items) assert.ok((it.a < 0 && it.n % 2 === 0) || GAMES['siembra-raices'].wantOf(it, e.params.span).length, JSON.stringify(it));
  for (const e of byGame('salta-signos')) assert.ok(e.params.rounds.every(r => r.items.some(it => it.sign === 1) && r.items.some(it => it.sign === -1)));
});

test('tableta-fraccion: se corta en partes iguales y se toman las del numerador; vale un corte equivalente', () => {
  const g = GAMES['tableta-fraccion'], R = U.lessons[1].ex.find(e => e.game === 'tableta-fraccion').params.rounds;
  for (const r of R) {
    assert.ok(r.total % r.den === 0 && r.total % r.cols === 0 && r.den <= 12, JSON.stringify(r));
    assert.ok(g.okOf({ parts: r.den, take: r.num }, r));
    assert.ok(!g.okOf({ parts: r.den, take: r.num - 1 }, r) && !g.okOf({ parts: 1, take: 1 }, r));
  }
  assert.ok(g.okOf({ parts: 8, take: 6 }, { total: 24, num: 3, den: 4 }), '6/8 de 24 también son 18');
  // La demostración enseña el gesto sin dar la respuesta.
  assert.doesNotMatch(read('js/games/tableta-fraccion.js'), /to: \{ x: G\.px\(Math\.min\(MAXP, r\.den\)\)/);
  assert.ok(!g.okOf({ parts: 5, take: 4 }, { total: 24, num: 3, den: 4 }), '24 no se reparte parejo en 5');
  assert.ok(g.grade({ rounds: R.map(r => ({ parts: r.den, take: r.num })) }, { rounds: R }).ok);
  assert.equal(g.grade({ rounds: [] }, { rounds: R }).ok, false);
  assert.equal(g.demo, true);
});

test('corta-igual: solo encaja un denominador común, y el juego escribe la cuenta', () => {
  const g = GAMES['corta-igual'], R = U.lessons[1].ex.find(e => e.game === 'corta-igual').params.rounds;
  assert.ok(g.fits({ a: [1, 2], b: [1, 3] }, 6) && g.fits({ a: [1, 2], b: [1, 3] }, 12) && !g.fits({ a: [1, 2], b: [1, 3] }, 4));
  assert.equal(g.lcm(4, 6), 12);
  assert.equal(g.text({ a: [1, 2], b: [1, 3] }, 6), '1/2 + 1/3 = 3/6 + 2/6 = 5/6');
  assert.equal(g.text({ a: [2, 3], b: [1, 4], op: '-' }, 12), '2/3 − 1/4 = 8/12 − 3/12 = 5/12');
  for (const r of R) {
    const n = g.lcm(r.a[1], r.b[1]), tot = r.a[0] / r.a[1] + (r.op === '-' ? -1 : 1) * r.b[0] / r.b[1];
    assert.ok(n <= 24 && tot > 0 && tot <= 1.5, JSON.stringify(r));
  }
  assert.ok(g.grade({ rounds: R.map(r => ({ n: g.lcm(r.a[1], r.b[1]) })) }, { rounds: R }).ok);
  assert.ok(!g.grade({ rounds: R.map(() => ({ n: 1 })) }, { rounds: R }).ok);
  assert.equal(g.demo, true);
});

test('los juegos nuevos están registrados', () => {
  for (const g of ['tableta-fraccion', 'corta-igual']) assert.ok(html.includes(`src="js/games/${g}.js"`) && sw.includes(`'js/games/${g}.js'`), g);
});
