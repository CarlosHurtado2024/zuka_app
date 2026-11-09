// Las cadenas de las lecciones con minijuegos llegan a KaTeX tal cual: una barra sin escapar en el
// JS ('\sqrt2' → 'sqrt2', '\tfrac' → TAB + 'frac') no da error de KaTeX pero se ve rota en pantalla.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const TEX_CMD = /(?<![\\A-Za-z])(sqrt|frac|dfrac|tfrac|overline|mathbb|cdot|approx|leq|geq|times|pi|subset|div|Rightarrow|neq)\b/;

function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out));
  return out;
}

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
const lessons = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).filter(l => ['alg-11', 'alg-12', 'alg-13', 'alg-13b', 'alg-14', 'alg-15'].includes(l.id));

for (const l of lessons) {
  test(`${l.id}: ningún texto de ejercicio tiene caracteres de control ni comandos TeX sin barra`, () => {
    const bad = strings(l.ex).filter(s => /[\x00-\x1f]/.test(s) || TEX_CMD.test(s));
    assert.deepEqual(bad, []);
  });
}

// La lección 1.3 es «Porcentajes y descuentos»: el interés simple y compuesto queda para otra
// lección, los dos videos vienen de Bunny y todo el texto usa punto decimal.
const alg13 = lessons.find(l => l.id === 'alg-13');

test('alg-13: se llama «Porcentajes y descuentos» y no tiene ejercicios de interés', () => {
  assert.equal(alg13.title, 'Porcentajes y descuentos');
  assert.ok(!alg13.ex.some(e => e.game === 'carrera-interes'));
  assert.deepEqual(strings(alg13.ex).filter(s => /inter[eé]s/i.test(s)), []);
});

test('alg-13: los dos videos vienen de Bunny y el segundo va tras el sexto ejercicio', () => {
  assert.equal(alg13.clip.bunny, '59348bd7-b5b5-4c29-bf79-31a54b439a1b');
  assert.equal(alg13.clip.duration, 224);
  assert.equal(alg13.clip.scenes.length, 0);
  assert.equal(alg13.more.length, 1);
  assert.equal(alg13.more[0].bunny, '3b666757-462f-4ccf-8f95-a8c816e33141');
  assert.equal(alg13.more[0].duration, 131);
  assert.equal(alg13.more[0].after, 6);
  assert.equal(alg13.more[0].scenes.length, 0);
});

test('alg-13: ningún texto usa coma decimal', () => {
  const bad = strings([alg13.ex, alg13.clip, alg13.more]).filter(s => /\d,\d/.test(s));
  assert.deepEqual(bad, []);
});

// Los params que de verdad lleva la lección deben ser resolubles con el grade de cada juego.
const games = get(loadScripts(['js/games/kit.js', 'js/games/tragamonedas.js', 'js/games/etiqueta-rebaja.js', 'js/games/mejor-oferta.js']), 'GAMES');
const exOf = g => alg13.ex.find(e => e.game === g);

test('alg-13: tragamonedas tiene factores que caben en sus rodillos y se puede resolver', () => {
  const { params } = exOf('tragamonedas');
  const g = games['tragamonedas'];
  const reels = params.rounds.map(r => g.reelsFor(r.change));
  params.rounds.forEach((r, i) => {
    assert.ok(reels[i][0] <= 3, `ronda ${i}: el entero no cabe en el rodillo`);
    assert.ok(Math.abs(g.factorOf(reels[i]) - (1 + r.change / 100)) < 1e-9, `ronda ${i}: necesita más de tres decimales`);
  });
  assert.equal(g.grade({ reels }, params).ok, true);
});

test('alg-13: etiqueta-rebaja tiene el precio final de cada producto entre los stickers', () => {
  const { params } = exOf('etiqueta-rebaja');
  const placed = params.items.map(it => params.stickers.indexOf(Math.round(it.price * (1 + it.change / 100))));
  assert.ok(placed.every(j => j >= 0), 'falta un precio final');
  assert.equal(games['etiqueta-rebaja'].grade({ placed }, params).ok, true);
});

test('alg-13: mejor-oferta no tiene empates y gana b, a, b como dice la explicación', () => {
  const { params, explain } = exOf('mejor-oferta');
  const { finalPrice, grade } = games['mejor-oferta'];
  const winners = params.rounds.map(r => { const a = finalPrice(r.price, r.a), b = finalPrice(r.price, r.b); assert.notEqual(a, b); return a < b ? 'a' : 'b'; });
  assert.equal(winners.join(''), 'bab');
  assert.equal(grade({ picks: winners }, params).ok, true);
  for (const n of ['56\\,000', '55\\,000', '76\\,800']) assert.ok(explain.includes(n), n);
});

test('alg-13: las ofertas de mejor-oferta dicen que son descuentos', () => {
  const { params } = exOf('mejor-oferta');
  assert.match(params.rounds[0].a.label, /descuento/);
  assert.match(params.rounds[0].b.label, /descuento/);
});

// La lección 1.3b (interés) también debe ser resoluble con sus params reales y usar punto decimal.
const alg13b = lessons.find(l => l.id === 'alg-13b');
const games13b = get(loadScripts(['js/games/kit.js', 'js/games/cobra-intereses.js', 'js/games/ajusta-capital.js', 'js/games/mejor-oferta.js', 'js/games/carrera-interes.js']), 'GAMES');
const ex13b = g => alg13b.ex.find(e => e.game === g);

test('alg-13b: ningún texto usa coma decimal', () => {
  assert.deepEqual(strings([alg13b.ex, alg13b.clip]).filter(s => /\d,\d/.test(s)), []);
});

test('alg-13b: cobra-intereses se resuelve con 12 meses y ajusta-capital con 1.000.000', () => {
  assert.equal(games13b['cobra-intereses'].grade({ paid: 12 }, ex13b('cobra-intereses').params).ok, true);
  assert.equal(games13b['ajusta-capital'].grade({ capital: 1000000 }, ex13b('ajusta-capital').params).ok, true);
});

test('alg-13b: los bancos ganan a, b, a sin empates y el explain trae esas cifras', () => {
  const { params, explain } = ex13b('mejor-oferta');
  const { finalPrice, grade } = games13b['mejor-oferta'];
  const winners = params.rounds.map(r => { const a = finalPrice(r.price, r.a), b = finalPrice(r.price, r.b); assert.notEqual(a, b); return a > b ? 'a' : 'b'; });
  assert.equal(winners.join(''), 'aba');
  assert.equal(grade({ picks: winners }, params).ok, true);
  for (const n of ['1\\,104\\,622', '1\\,402\\,552', '1\\,126\\,162']) assert.ok(explain.includes(n), n);
});

test('alg-13b: la carrera del interés se gana en el mes 15 y el explain lo dice', () => {
  const { params, explain } = ex13b('carrera-interes');
  assert.equal(games13b['carrera-interes'].grade({ month: 15 }, params).ok, true);
  assert.ok(explain.includes('118\\,400') && explain.includes('137\\,600'));
});

// En «cobra-intereses» tiene que haber más meses de los necesarios: si no, cobrar todos es la respuesta.
test('alg-13b: cobra-intereses ofrece más meses que los que pide la meta', () => {
  const { params } = ex13b('cobra-intereses');
  assert.ok(params.months > params.target / (params.capital * params.rate));
});
