// Estilo «video» de los minijuegos (spec 2026-11-13-juegos-estilo-video): la paleta de los videos zoom,
// fondo con estrellas, pestañas como fichas, animaciones con anime.js y confeti al acertar.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const ctx = loadScripts(['js/games/kit.js']);
const PALETTES = get(ctx, 'PALETTES'), PALETTE = get(ctx, 'PALETTE');
const inkOn = get(ctx, 'inkOn'), backdropDots = get(ctx, 'backdropDots'), fxTween = get(ctx, 'fxTween');
const confettiBits = get(ctx, 'confettiBits'), drawTabs = get(ctx, 'drawTabs'), roundTabs = get(ctx, 'roundTabs');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('la paleta trae los colores de los videos en los dos temas', () => {
  for (const theme of ['dark', 'light']) for (const k of ['sun', 'coral', 'mint', 'sky', 'cream', 'night', 'star', 'halo']) {
    assert.match(PALETTES[theme][k], /^#[0-9A-Fa-f]{6}$/, `${theme}.${k}`);
  }
  assert.equal(PALETTES.dark.bg.toUpperCase(), '#1D2052', 'azul noche de los videos');
  assert.equal(PALETTES.dark.I.toUpperCase(), '#FF6B5E', 'coral de los videos');
});

test('inkOn elige tinta oscura sobre colores claros y blanca sobre oscuros', () => {
  assert.equal(inkOn('#FFC84A'), '#1D2052');
  assert.equal(inkOn('#FFF4E2'), '#1D2052');
  assert.equal(inkOn('#3A5FD9'), '#FFFFFF');
  assert.equal(inkOn('#1D2052'), '#FFFFFF');
  assert.equal(inkOn(undefined, '#123456'), '#123456', 'si no es un color hex, la tinta de respaldo');
});

test('las estrellas del fondo son deterministas, caben en el lienzo y crecen con el área', () => {
  const a = backdropDots(328, 410), b = backdropDots(328, 410);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
  assert.ok(a.length >= 16 && a.length <= 40, String(a.length));
  for (const d of a) assert.ok(d.x >= 0 && d.x <= 328 && d.y >= 0 && d.y <= 410 && d.r > 0 && d.r <= 2.4);
  assert.ok(backdropDots(480, 600).length > a.length);
});

test('fxTween sin anime.js deja el valor final de una vez y avisa al terminar', () => {
  const o = { k: 0.5, a: 1 };
  let done = 0;
  fxTween(o, { k: 1, a: 0 }, { complete: () => done++ });
  assert.equal(o.k, 1); assert.equal(o.a, 0); assert.equal(done, 1);
});

test('el confeti sale en todas las direcciones con los colores de la paleta', () => {
  const bits = confettiBits(18);
  assert.equal(bits.length, 18);
  const keys = new Set(bits.map(b => b.color));
  assert.ok(keys.size >= 3);
  for (const b of bits) {
    assert.ok(['sun', 'coral', 'mint', 'sky'].includes(b.color));
    assert.ok(['dot', 'sq', 'tri'].includes(b.shape));
    assert.ok(Math.hypot(b.dx, b.dy) >= 40 && Math.hypot(b.dx, b.dy) <= 190);
  }
  assert.ok(bits.some(b => b.dx < 0) && bits.some(b => b.dx > 0) && bits.some(b => b.dy < 0));
});

// p falso que anota cada relleno y cada texto
function fakeP() {
  const log = [];
  let fill = null;
  const p = {
    CENTER: 'center', BOLD: 'bold', log,
    fill(c) { fill = c; }, stroke() {}, noStroke() {}, noFill() { fill = null; }, strokeWeight() {},
    rect(x, y, w, h) { log.push({ kind: 'rect', fill, x, y, w, h }); },
    textAlign() {}, textStyle() {}, textSize() {},
    text(s, x, y) { log.push({ kind: 'text', fill, s: String(s), x, y }); },
  };
  return p;
}

test('las pestañas son fichas: la respondida se rellena de su color y el número se lee encima', () => {
  const C = PALETTES.dark, p = fakeP(), tabs = roundTabs(3, 328);
  drawTabs(p, C, tabs, 0, i => (i === 0 ? C.brand : i === 1 ? C.Z : C.line));
  const texts = p.log.filter(e => e.kind === 'text');
  assert.equal(texts.map(t => t.s).join(), '1,2,3');
  const fills = p.log.filter(e => e.kind === 'rect').map(e => e.fill);
  assert.ok(fills.includes(C.brand) && fills.includes(C.Z) && fills.includes(C.card));
  assert.equal(texts[1].fill, inkOn(C.Z));
  assert.equal(texts[2].fill, C.mute, 'la que falta va apagada');
  // las fichas no se salen de su caja más de lo que mide el aro de la actual
  for (const r of p.log.filter(e => e.kind === 'rect')) assert.ok(r.x >= 4 && r.y >= 2, JSON.stringify(r));
});

test('anime.js viene con la app: en index.html antes del kit y en el SHELL del service worker', () => {
  const html = read('index.html'), sw = read('sw.js');
  assert.ok(fs.statSync(path.join(ROOT, 'js/vendor/anime.min.js')).size > 10000);
  const a = html.indexOf('js/vendor/anime.min.js'), k = html.indexOf('js/games/kit.js');
  assert.ok(a > 0 && a < k);
  assert.ok(sw.includes("'js/vendor/anime.min.js'"));
});

test('la paleta activa sigue siendo la oscura por defecto', () => {
  assert.equal(PALETTE.sun, PALETTES.dark.sun);
});

test('inkOn: sobre el rojo de «mal» y el azul de marca del tema oscuro va azul noche (se lee mejor que blanco)', () => {
  assert.equal(inkOn(PALETTES.dark.bad), '#1D2052');
  assert.equal(inkOn(PALETTES.dark.brand), '#1D2052');
  assert.equal(inkOn(PALETTES.light.brand), '#FFFFFF');
});

test('Jost solo cuenta como lista si hay una cara suya ya cargada (sin conexión no se pide)', () => {
  const jostLoaded = get(ctx, 'jostLoaded'), gameFont = get(ctx, 'gameFont');
  assert.equal(jostLoaded([]), false);
  assert.equal(jostLoaded([{ family: 'Plus Jakarta Sans', status: 'loaded' }, { family: 'Jost', status: 'unloaded' }]), false);
  assert.equal(jostLoaded(new Set([{ family: '"Jost"', status: 'loaded' }])), true);
  assert.equal(gameFont(), 'system-ui', 'en Node no hay letras cargadas');
});

test('shade oscurece y aclara un color sin salirse de 00–FF', () => {
  const shade = get(ctx, 'shade');
  assert.equal(shade('#FFC84A', 0.5), '#806425');
  assert.equal(shade('#000000', 1.5), '#808080');
  assert.equal(shade('#102030', 3), '#FFFFFF');
  assert.equal(shade('nada', 0.5), 'nada');
});

test('drawTile pinta labio, cara y texto con tinta legible; drawNumLine numera con el color del signo', () => {
  const drawTile = get(ctx, 'drawTile'), drawNumLine = get(ctx, 'drawNumLine'), C = PALETTES.dark;
  const p = fakeP(); p.textWidth = s => String(s).length * 8; p.line = () => {}; p.width = 328;
  drawTile(p, C, { x: 10, y: 10, w: 60, h: 40 }, '−3', { fill: C.coral });
  const rects = p.log.filter(e => e.kind === 'rect');
  assert.equal(rects.length, 2);
  assert.equal(rects[1].fill, C.coral);
  assert.notEqual(rects[0].fill, C.coral, 'el labio es más oscuro');
  assert.equal(p.log.find(e => e.kind === 'text').fill, inkOn(C.coral));
  const q = fakeP(); q.line = () => {}; q.textWidth = s => String(s).length * 8;
  const X = drawNumLine(q, C, { x0: 20, x1: 300, y: 200, min: -3, max: 3 });
  const t = q.log.filter(e => e.kind === 'text');
  assert.equal(t.map(e => e.s).join(), '−3,−2,−1,0,1,2,3');
  assert.equal(t[0].fill, C.I); assert.equal(t[3].fill, C.N); assert.equal(t[6].fill, C.ink);
  assert.equal(X(0), 160);
});

test('los juegos de Álgebra U1 dibujan con las piezas de los videos', () => {
  const U1 = 'atrapa-elementos ascensor recta-espejo pasaporte-numeros fuga-de-familia pizzeria candado-fraccion pon-la-rayita ordena-terminos acorrala-raiz compas-raiz cajas-numericas lupa-densidad ubica-en-recta inversos-gemelos corta-rectangulo atajo-axiomas arma-producto cancela-balanza tren-ordenado voltea-desigualdad dobla-la-recta distancia-justa dibuja-intervalo'.split(' ');
  for (const g of U1) assert.match(read(`js/games/${g}.js`), /draw(Tile|Pill|Kicker|NumLine|Dot|Slot)\(/, g);
});
