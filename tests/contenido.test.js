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
const lessons = get(ctx, 'COURSE_ALGEBRA').units[0].lessons.filter(l => ['alg-11', 'alg-12', 'alg-13'].includes(l.id));

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
const games = get(loadScripts(['js/games/kit.js', 'js/games/une-factor.js', 'js/games/etiqueta-rebaja.js', 'js/games/mejor-oferta.js']), 'GAMES');
const exOf = g => alg13.ex.find(e => e.game === g);

test('alg-13: une-factor tiene en factors el factor de cada cambio y se puede resolver', () => {
  const { params } = exOf('une-factor');
  const links = params.changes.map(c => params.factors.findIndex(f => Math.abs(f - (1 + c / 100)) < 1e-9));
  assert.ok(links.every(j => j >= 0), 'falta un factor');
  assert.equal(games['une-factor'].grade({ links }, params).ok, true);
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
