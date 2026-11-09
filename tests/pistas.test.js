// Pistas: cada ejercicio puede llevar `hint`, un empujón que el estudiante abre si se atasca.
// La lección 1.1 (alg-11) tiene la parte 1 del video, sus ejercicios, la parte 2 y los suyos,
// y todos sus ejercicios traen pista.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
const [mc, num, ord, play, buildQueue] = ['mc', 'num', 'ord', 'play', 'buildQueue'].map(n => get(ctx, n));
const l = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).find(l => l.id === 'alg-11');

test('mc, num, ord y play aceptan { hint } al final', () => {
  assert.equal(mc('q', ['a', 'b'], 0, 'e', { hint: 'h1' }).hint, 'h1');
  assert.equal(num('q', 3, 'e', { hint: 'h2' }).hint, 'h2');
  assert.equal(ord('q', ['a', 'b'], 'e', { hint: 'h3' }).hint, 'h3');
  assert.equal(play('juego', 'q', {}, 'e', { hint: 'h4' }).hint, 'h4');
  assert.equal(mc('q', ['a'], 0, 'e').hint, undefined);
});

test('alg-11: los videos nuevos de Bunny con su duración', () => {
  assert.equal(l.clip.bunny, '86d9fad5-e354-40a1-8f0a-3e324b642b60');
  assert.equal(l.clip.duration, 462);
  assert.equal(l.more.length, 1);
  assert.equal(l.more[0].bunny, 'd5ddb99a-428e-4b8f-9f5f-496c8987ae3d');
  assert.equal(l.more[0].duration, 379);
});

test('alg-11: parte 1, sus ejercicios, parte 2 y los suyos', () => {
  const q = JSON.parse(JSON.stringify(buildQueue(l)));
  const at = q.findIndex(t => t.k === 'clip' && t.n === 1);
  assert.deepEqual(q[0], { k: 'clip', n: 0 });
  assert.equal(at, l.more[0].after + 1, 'la parte 2 va justo tras los ejercicios de la parte 1');
  assert.ok(l.more[0].after >= 5 && l.ex.length - l.more[0].after >= 5, 'al menos cinco ejercicios por parte');
  // Los juegos de irracionales y reales van después de la parte 2.
  const part2 = l.ex.slice(l.more[0].after).filter(e => e.type === 'play').map(e => e.game);
  for (const g of ['cajas-numericas', 'ubica-en-recta', 'compas-raiz', 'lupa-densidad', 'ordena-terminos']) assert.ok(part2.includes(g), `${g} antes de tiempo`);
  const part1 = l.ex.slice(0, l.more[0].after).filter(e => e.type === 'play').map(e => e.game);
  assert.ok(part1.includes('pizzeria') && part1.includes('candado-fraccion'));
  for (const g of ['pasaporte-numeros', 'ascensor', 'pon-la-rayita']) assert.ok(part1.includes(g), `parte 1 sin ${g}`);
  assert.ok(part2.includes('acorrala-raiz'), 'parte 2 sin acorrala-raiz');
});

test('alg-11: todos sus ejercicios son juegos interactivos', () => {
  l.ex.forEach((e, i) => assert.equal(e.type, 'play', `ejercicio ${i} es ${e.type}`));
});

test('unidad 1: cada ejercicio de cada lección trae una pista que no regala la respuesta', () => {
  const ids = ['alg-11', 'alg-12b', 'alg-21a', 'alg-21b', 'alg-22a', 'alg-22b'];
  const lessons = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).filter(l => ids.includes(l.id));
  assert.equal(lessons.length, ids.length);
  for (const lesson of lessons) lesson.ex.forEach((e, i) => {
    const where = `${lesson.id} ejercicio ${i}`;
    assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${where} sin pista`);
    if (e.type === 'mc') assert.ok(!e.hint.includes(e.options[e.answer]), `la pista de ${where} dice la respuesta`);
    if (e.type === 'input') assert.ok(!new RegExp(`(^|[^\\d.])${String(e.answer).replace('-', '−?-?')}([^\\d.]|$)`).test(e.hint), `la pista de ${where} dice la respuesta`);
  });
});

test('hintBlock: sin pista no dibuja nada; con pista, botón «Ver pista» y el texto oculto', () => {
  const ex = loadScripts(['js/exercises.js']);
  ex.tex = s => `<tex>${s}</tex>`; ex.ICON = { bulb: '<svg/>' };
  const hintBlock = get(ex, 'hintBlock');
  assert.equal(hintBlock({ q: 'x' }), '');
  const h = hintBlock({ hint: 'Cuenta los pisos' });
  assert.ok(h.includes('Ver pista') && h.includes('class="hint-btn"'), h);
  assert.ok(/<p class="hint-text" hidden>.*<tex>Cuenta los pisos<\/tex>/.test(h), h);
});
