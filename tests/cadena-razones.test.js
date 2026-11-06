const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cadena-razones.js')['cadena-razones'];
const params = {
  base: 28, unit: 'días',
  factors: [{ label: 'hombres', a: 9, b: 7, inverse: true }, { label: 'horas/día', a: 6, b: 8, inverse: true }],
  answer: 27,
};

test('ninguna tarjeta volteada (9/7 y 6/8) → correcto', () => {
  assert.equal(grade({ flipped: [false, false] }, params).ok, true);
});

test('una tarjeta volteada → incorrecto y la solución da 27', () => {
  const r = grade({ flipped: [true, false] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('27'));
});

test('las dos volteadas → incorrecto', () => {
  assert.equal(grade({ flipped: [true, true] }, params).ok, false);
});

// El juego no puede nacer resuelto: las tarjetas arrancan en la orientación ingenua (7/9 y 8/6).
test('el estado inicial no es la respuesta', async () => {
  const { loadScripts, get } = require('./load');
  const ctx = loadScripts(['js/games/kit.js', 'js/games/cadena-razones.js']);
  const p = { createCanvas() {}, textFont() {} };
  ctx.p5 = function (sketch) { sketch(p, { w: 300, h: 345 }); p.setup(); this.remove = () => {}; this.resizeCanvas = () => {}; };
  ctx.ResizeObserver = class { observe() {} disconnect() {} };
  const inst = get(ctx, 'GAMES')['cadena-razones'].create({ clientWidth: 300 }, params, { ready() {}, palette: get(ctx, 'PALETTE') });
  await inst.loaded;
  assert.equal(grade(inst.getState(), params).ok, false);
});
