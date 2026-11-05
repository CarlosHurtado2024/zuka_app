const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, create } = loadGame('js/games/dibuja-intervalo.js')['dibuja-intervalo'];
const params = { min: -5, max: 7, a: -2, b: 5, aClosed: true, bClosed: false };

test('−2 lleno y 5 vacío → correcto', () => {
  assert.equal(grade({ left: -2, right: 5, leftClosed: true, rightClosed: false }, params).ok, true);
});

test('asas cruzadas (5 y −2) → se normaliza y es correcto', () => {
  assert.equal(grade({ left: 5, right: -2, leftClosed: false, rightClosed: true }, params).ok, true);
});

test('−2 vacío → incorrecto', () => {
  assert.equal(grade({ left: -2, right: 5, leftClosed: false, rightClosed: false }, params).ok, false);
});

test('extremo derecho en 4 → incorrecto', () => {
  assert.equal(grade({ left: -2, right: 4, leftClosed: true, rightClosed: false }, params).ok, false);
});

// Comprobar no debe habilitarse hasta que p5 haya montado el lienzo (si no, con red lenta se puede
// calificar un juego que todavía no se ve).
test('ready(true) llega solo después de cargar p5', async () => {
  const { loadScripts, get } = require('./load');
  const ctx = loadScripts(['js/games/kit.js', 'js/games/dibuja-intervalo.js']);
  const p = { createCanvas() {}, textFont() {} };
  ctx.p5 = function (sketch) { sketch(p, { w: 300, h: 240 }); p.setup(); this.remove = () => {}; this.resizeCanvas = () => {}; };
  ctx.ResizeObserver = class { observe() {} disconnect() {} };
  const calls = [];
  const inst = get(ctx, 'GAMES')['dibuja-intervalo'].create({ clientWidth: 300 }, params, { ready: v => calls.push(v), palette: get(ctx, 'PALETTE') });
  assert.deepEqual(calls, []);
  await inst.loaded;
  assert.deepEqual(calls, [true]);
});
