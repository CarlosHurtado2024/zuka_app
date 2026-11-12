// Laberinto de valores: tocar una casilla ya recorrida quita o recorta el camino al SOLTAR (y solo si el dedo
// no salió de ella). Arrastrar desde la punta del camino lo alarga; un arrastre que empieza sobre el camino
// no borra nada.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

// Cuadrícula 3 × 3, todas las casillas válidas; entrada 0, salida 8.
const params = { rule: 'todas', rounds: [{ cols: 3, cells: Array.from({ length: 9 }, (_, i) => ({ t: String(i), ok: true })), start: 0, end: 8 }] };

async function mount() {
  const ctx = loadScripts(['js/games/kit.js', 'js/games/laberinto-valor.js']);
  let p = null;
  ctx.p5 = function (sketch) { p = { createCanvas() {}, textFont() {} }; sketch(p); this.remove = () => {}; };
  ctx.ResizeObserver = class { observe() {} disconnect() {} };
  const game = get(ctx, 'GAMES')['laberinto-valor'];
  const inst = game.create({ clientWidth: 300 }, params, { ready() {}, palette: {}, sfx: {} });
  await inst.loaded;
  p.setup();
  // Misma geometría que el juego: una sola ronda (sin pestañas), casillas de (300 − 20) / 3.
  const s = 280 / 3, at = k => ({ x: 10 + (k % 3 + 0.5) * s, y: 52 + (Math.floor(k / 3) + 0.5) * s });
  const move = k => { const c = at(k); p.mouseX = c.x; p.mouseY = c.y; };
  return {
    path: () => inst.getState().paths[0].join(),
    press: k => { move(k); return p.mousePressed(); },
    drag: k => { move(k); return p.mouseDragged(); },
    release: () => p.mouseReleased(),
    tap(k) { this.press(k); this.release(); },
  };
}

test('tocar casillas vecinas avanza al presionar', async () => {
  const g = await mount();
  assert.equal(g.press(1), false, 'el toque es del juego');
  assert.equal(g.path(), '0,1');
  g.release();
  g.tap(2); g.tap(5);
  assert.equal(g.path(), '0,1,2,5');
});

test('tocar la punta la quita, pero al soltar', async () => {
  const g = await mount();
  g.tap(1); g.tap(2);
  g.press(2);
  assert.equal(g.path(), '0,1,2', 'al presionar todavía no se borra');
  g.release();
  assert.equal(g.path(), '0,1');
});

test('tocar una casilla anterior recorta el camino hasta ahí, al soltar', async () => {
  const g = await mount();
  g.tap(1); g.tap(2); g.tap(5);
  g.press(1);
  assert.equal(g.path(), '0,1,2,5');
  g.release();
  assert.equal(g.path(), '0,1');
});

test('arrastrar desde la punta alarga el camino en vez de quitarla', async () => {
  const g = await mount();
  g.tap(1);
  g.press(1); g.drag(4); g.drag(7); g.release();
  assert.equal(g.path(), '0,1,4,7');
});

test('un arrastre que empieza en una casilla anterior y sale de ella no recorta', async () => {
  const g = await mount();
  g.tap(1); g.tap(2); g.tap(5);
  g.press(0); g.drag(3); g.release();   // 3 no es vecina de la punta (5): no cambia nada
  assert.equal(g.path(), '0,1,2,5');
});

test('arrastrar hacia atrás sobre el camino sigue deshaciendo paso a paso', async () => {
  const g = await mount();
  g.press(1); g.drag(2); g.drag(5);
  assert.equal(g.path(), '0,1,2,5');
  g.drag(2);
  assert.equal(g.path(), '0,1,2');
  g.release();
  assert.equal(g.path(), '0,1,2');
});
