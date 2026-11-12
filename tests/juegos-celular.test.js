// Los juegos en celulares angostos (300–320 px): el lienzo conserva el alto de diseño, ningún texto
// se corta ni se sale, y sobre el juego se puede desplazar la lección con el dedo.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = loadScripts(['js/games/kit.js']);
const wrapWords = get(ctx, 'wrapWords'), spanShift = get(ctx, 'spanShift'), heightFor = get(ctx, 'heightFor');
const safeText = get(ctx, 'safeText');
const css = read('css/styles.css'), exercises = read('js/exercises.js');
const measure = s => s.length * 7;

// p5 de mentira: 7 px por letra, guarda lo que se dibuja.
function fakeP(W, H, { size = 14, align = 'center', base = 'center', shift = 0 } = {}) {
  const drawn = [];
  const p = {
    width: W, height: H, drawn,
    _renderer: { _textSize: size, _textAlign: align, _textBaseline: base },
    drawingContext: { getTransform: () => ({ a: 2, b: 0, c: 0, d: 2, e: shift, f: 0 }) },
    textWidth: s => String(s).length * p._renderer._textSize / 2,
    textSize(v) { p._renderer._textSize = v; },
    textAlign(a, b) { p._renderer._textAlign = a; p._renderer._textBaseline = b; },
  };
  const raw = (s, x, y, w, h) => drawn.push({ s, x, y, w, h, size: p._renderer._textSize, base: p._renderer._textBaseline });
  return { p, raw, drawn };
}

test('wrapWords parte por palabras sin pasarse del ancho', () => {
  assert.equal(wrapWords('uno dos tres cuatro', 60, measure).join('|'), 'uno dos|tres|cuatro');
  assert.equal(wrapWords('corto', 100, measure).join('|'), 'corto');
  assert.equal(wrapWords('a\nb c', 100, measure).join('|'), 'a|b c', 'respeta los saltos de línea');
  assert.equal(wrapWords('palabralarguísima x', 30, measure).join('|'), 'palabralarguísima|x', 'una palabra sola no se parte');
});

test('spanShift mete el tramo en los bordes y deja quieto lo que está escondido', () => {
  assert.equal(spanShift(-10, 50, 4, 272), 14);
  assert.equal(spanShift(240, 50, 4, 272), -18);
  assert.equal(spanShift(100, 50, 4, 272), 0);
  assert.equal(spanShift(-500, 50, 4, 272), 0, 'algo fuera de la vista a propósito no se trae');
  assert.equal(spanShift(-10, 300, 4, 272), (4 + 272) / 2 - 140, 'si no cabe, se centra');
});

test('el lienzo conserva el alto de diseño en pantallas angostas', () => {
  assert.equal(heightFor(256, 1.25), 410);
  assert.equal(heightFor(276, 1.25), 410);
  assert.equal(heightFor(328, 1.25), 410);
  assert.equal(heightFor(400, 1.25), 500, 'en pantallas anchas sigue la proporción');
});

test('un texto suelto más ancho que el lienzo se encoge y queda dentro', () => {
  const { p, raw, drawn } = fakeP(200, 300, { size: 14 });
  safeText(p, raw, 'x'.repeat(40), 100, 50);   // 280 px a 14
  assert.equal(drawn.length, 1);
  assert.ok(drawn[0].size < 14 && drawn[0].size >= 9);
  const w = 40 * drawn[0].size / 2;
  assert.ok(drawn[0].x - w / 2 >= 0 && drawn[0].x + w / 2 <= 200);
  assert.equal(p._renderer._textSize, 14, 'el tamaño de letra del juego queda como estaba');
});

test('un texto suelto que se sale por un borde se corre hacia adentro', () => {
  const { p, raw, drawn } = fakeP(200, 300, { size: 10, align: 'left' });
  safeText(p, raw, 'x'.repeat(10), 170, 50);   // 50 px desde 170: se sale 20
  assert.equal(drawn[0].x, 146);
  safeText(p, raw, 'abajo', 20, 297);          // centrado en vertical: se sale 2 px por abajo
  assert.ok(drawn[1].y + 5 <= 300);
});

test('con el lienzo trasladado o girado no se toca nada', () => {
  const { p, raw, drawn } = fakeP(200, 300, { shift: 40 });
  safeText(p, raw, 'x'.repeat(40), 0, 0);
  assert.equal(JSON.stringify(drawn[0]), JSON.stringify({ s: 'x'.repeat(40), x: 0, y: 0, size: 14, base: 'center' }));
});

test('un texto en caja nunca se corta: se dibuja renglón a renglón dentro del lienzo', () => {
  const { p, raw, drawn } = fakeP(200, 300, { size: 12 });
  // Caja de 18 px de alto pegada al borde inferior: a 12 px el texto pide dos renglones (30 px).
  safeText(p, raw, 'toca o arrastra en el edificio para mover', 10, 290, 180, 18);
  assert.ok(drawn.length >= 1);
  assert.equal(drawn.map(d => d.s).join(' '), 'toca o arrastra en el edificio para mover', 'no se pierde ninguna palabra');
  for (const d of drawn) {
    assert.equal(d.base, 'top');
    assert.ok(d.y >= 0 && d.y + d.size <= 300, 'cada renglón queda dentro del lienzo');
    assert.equal(d.w, undefined, 'sin caja: p5 no puede recortar');
  }
  assert.equal(p._renderer._textBaseline, 'center', 'la alineación del juego queda como estaba');
  assert.equal(p._renderer._textSize, 12);
});

const CANVAS = { tag: 'canvas' };
function mountWithFakeP5(press) {
  const c = loadScripts(['js/games/kit.js']);
  let p = null;
  c.p5 = function (sketch) { p = { createCanvas() {}, canvas: CANVAS }; sketch(p, { w: 300, h: 300 }); this.remove = () => {}; };
  c.ResizeObserver = class { observe() {} disconnect() {} };
  const calls = [];
  const m = get(c, 'mountSketch')({ clientWidth: 300 }, q => {
    q.mousePressed = () => { calls.push('press'); return press; };
    q.mouseDragged = () => { calls.push('drag'); return false; };
    q.mouseReleased = () => { calls.push('release'); return false; };
  });
  return { m, calls, p: () => p };
}

test('un toque que el juego no agarra es un desplazamiento: no le llegan ni el arrastre ni el final', async () => {
  const { m, calls, p } = mountWithFakeP5(undefined);
  await m.ready;
  assert.equal(p().touchStarted(), undefined, 'sin false: el navegador puede desplazar');
  assert.equal(p().touchMoved(), undefined);
  assert.equal(p().touchEnded(), undefined);
  assert.equal(calls.join(), 'press');
});

test('un toque que el juego agarra le llega completo y no desplaza', async () => {
  const { m, calls, p } = mountWithFakeP5(false);
  await m.ready;
  assert.equal(p().touchStarted(), false);
  assert.equal(p().touchMoved(), false);
  assert.equal(p().touchEnded(), false);
  assert.equal(p().touchMoved(), undefined, 'tras soltar, el siguiente movimiento ya no es del juego');
  assert.equal(calls.join(), 'press,drag,release');
});

test('un toque que empieza fuera del lienzo no le llega al juego', async () => {
  const { m, calls, p } = mountWithFakeP5(false);
  await m.ready;
  assert.equal(p().touchStarted({ target: { tag: 'titulo' } }), undefined);
  assert.equal(p().touchMoved(), undefined);
  assert.equal(calls.join(), '');
  assert.equal(p().touchStarted({ target: CANVAS }), false);
  assert.equal(calls.join(), 'press');
});

test('el marco del juego deja desplazar en vertical y muestra el resultado', () => {
  const play = css.match(/\.play \{[^}]*\}/)[0];
  assert.match(play, /touch-action: pan-y/);
  assert.match(css, /\.play\.right \{ border-color: var\(--ok\)/);
  assert.match(css, /\.play\.wrong \{ border-color: var\(--bad\)/);
  assert.match(exercises, /box\.classList\.add\(ok \? 'right' : 'wrong'\)/);
});

test('todo juego que agarra piezas devuelve false al agarrarlas (si no, el arrastre se perdería)', () => {
  // mountSketch solo le pasa el arrastre y el final del toque al juego cuando mousePressed devolvió false.
  const dir = path.join(ROOT, 'js/games');
  let seen = 0;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'kit.js')) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = src.match(/p\.mousePressed = \(\) => \{([\s\S]*?)\r?\n {6}\};/);
    if (!m || !/p\.mouseDragged = /.test(src)) continue;
    seen++;
    assert.ok(/return false/.test(m[1]), `${f}: mousePressed nunca devuelve false`);
  }
  assert.ok(seen > 60, `se revisaron ${seen} juegos`);
});
