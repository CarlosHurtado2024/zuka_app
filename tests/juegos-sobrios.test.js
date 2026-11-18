// Juegos y ejercicios con estética sobria (spec 2026-11-25-juegos-sobrios).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const ctx = loadScripts(['js/games/kit.js']);
const PALETTES = get(ctx, 'PALETTES');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

test('la paleta es de tinta azul, no morada, y la ficha neutra es fría', () => {
  const [r, g, b] = rgb(PALETTES.dark.bg);
  assert.ok(r + g + b < 120, 'fondo oscuro profundo');
  assert.ok(b - r >= 25 && g >= r, 'tinta azul, no morada');
  for (const t of ['dark', 'light']) { const [cr, , cb] = rgb(PALETTES[t].cream); assert.ok(cb >= cr, `${t}: ficha neutra fría`); }
});

test('el fondo de los juegos es liso: sin cuadrícula, sin estrellas y sin nada que se mueva', () => {
  const kit = read('js/games/kit.js'), fn = kit.slice(kit.indexOf('function drawBackdrop'), kit.indexOf('function drawRipples'));
  assert.ok(!/backdropGrid/.test(kit), 'la cuadrícula se quitó');
  assert.ok(!/lineTo|moveTo|stroke\(/.test(fn), 'el fondo no traza líneas');
  assert.ok(!/performance\.now|Math\.sin/.test(fn), 'el fondo no se mueve');
  assert.match(fn, /createRadialGradient/, 'un brillo suave del color del curso');
  assert.match(fn, /C\.brand/);
});

test('fichas y carteles con contorno fino, y vidas pequeñas', () => {
  const kit = read('js/games/kit.js');
  const tile = kit.slice(kit.indexOf('function drawTile'), kit.indexOf('function drawSlot'));
  assert.match(tile, /drawPracticePanel\(p, \{ x, y, w, h \}, fill, o\.ring \?\? C\.line, r, o\.ring \? 2 : 1\)/);
  assert.doesNotMatch(tile, /\blift\b|HILITE/);
  const banner = kit.slice(kit.indexOf('function drawBanner'), kit.indexOf('function makeArcade'));
  assert.ok(!/strokeWeight\(3\)/.test(banner), 'cartel sin borde grueso');
  const tabs = kit.slice(kit.indexOf('function drawTabs'), kit.indexOf('const hitBox'));
  assert.ok(!/stroke\(C\.sun\)/.test(tabs), 'pestaña actual sin aro amarillo');
});

test('los jefes no tienen caras de caricatura', () => {
  for (const g of ['jefe-venn', 'jefe-rueda', 'jefe-ruta', 'carrera-fracciones', 'serpiente-orden', 'salta-signos', 'vuela-precios', 'estira-foto']) {
    const s = read(`js/games/${g}.js`);
    assert.ok(!/eyeY|blink|const eye =|eye\(|ojos|zorrito|p\.fill\(C\.night\); p\.circle\(/.test(s.replace(/^\s*\/\/.*$/gm, '')), `${g}: sin ojos`);
  }
});

test('la app usa botones y opciones sin relieve duro (spec 2026-11-27-interfaz-red)', () => {
  const css = read('css/styles.css');
  const btn = css.slice(css.indexOf('.btn {'), css.indexOf('.btn:hover'));
  assert.doesNotMatch(btn, /box-shadow: 0 [1-9]px 0 /);
  assert.ok(!/box-shadow: 0 [1-9]px 0 /.test(css.slice(css.indexOf('.opt {'), css.indexOf('.opt .key'))));
  assert.match(css, /\.play \{[^}]*border: 1px solid var\(--line\)/);
});

test('Álgebra y Trigonometría sin emojis de caricatura en los ejercicios ni en los juegos', () => {
  const pic = /[\u{1F300}-\u{1FAFF}\u{2600}\u{2B50}\u{26C8}\u{2614}]/u;   // figuras, sol, estrella, tormenta (no ⚑ ni flechas)
  const html = read('index.html'), games = [...html.matchAll(/src="js\/games\/([a-z0-9-]+)\.js"/g)].map(m => m[1]);
  const used = new Set(['algebra', 'mundos-altos', 'trig', 'trig-juegos'].flatMap(c => [...read(`js/courses/${c}.js`).matchAll(/play\('([a-z0-9-]+)'/g)].map(m => m[1])));
  for (const f of ['js/courses/algebra.js', 'js/courses/mundos-altos.js', 'js/courses/trig.js', 'js/courses/trig-juegos.js', ...games.filter(g => used.has(g)).map(g => `js/games/${g}.js`)]) assert.ok(!pic.test(read(f)), f);
  // Los textos ya no nombran los dibujos de antes.
  assert.ok(!/al buzo|la rana|los globos|un globo|el cliente se c/.test(read('js/guia.js') + read('js/courses/algebra.js').slice(0, 60000)));
  for (const g of ['revienta-globos', 'caja-veloz', 'buzo-enteros', 'rana-zenon', 'jefe-rueda']) {
    const s = read(`js/games/${g}.js`);
    assert.ok(!/\/\/ (cabeza|aletas|visor)|una carita|p\.bezier\(x, y \+ b\.h/.test(s), `${g}: sin dibujos de caricatura`);
  }
});
