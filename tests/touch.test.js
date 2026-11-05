// En p5 1.9.x un toque (touchstart) solo dispara touchStarted; no cae en mousePressed como el ratón.
// mountSketch debe enlazar los tres eventos táctiles a los manejadores de ratón del juego, y devolver
// su mismo valor (false cancela el toque y evita el ratón emulado del móvil).
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

function mountWithFakeP5() {
  const ctx = loadScripts(['js/games/kit.js']);
  let p = null;
  ctx.p5 = function (sketch) { p = { createCanvas() {} }; sketch(p, { w: 300, h: 300 }); this.remove = () => {}; };
  ctx.ResizeObserver = class { observe() {} disconnect() {} };
  const calls = [];
  const m = get(ctx, 'mountSketch')({ clientWidth: 300 }, q => {
    q.mousePressed = () => { calls.push('press'); return false; };
    q.mouseDragged = () => { calls.push('drag'); return false; };
    q.mouseReleased = () => { calls.push('release'); };
  });
  return { m, calls, p: () => p };
}

test('los toques llaman a los manejadores de ratón del juego', async () => {
  const { m, calls, p } = mountWithFakeP5();
  await m.ready;
  assert.equal(p().touchStarted(), false);
  assert.equal(p().touchMoved(), false);
  assert.equal(p().touchEnded(), undefined);
  assert.deepEqual(calls, ['press', 'drag', 'release']);
});
