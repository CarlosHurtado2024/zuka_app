// Los minijuegos siguen el tema de la app: PALETTE (el objeto que reciben como api.palette) cambia
// de valores en el sitio al pasar de oscuro a claro, así que un juego abierto se repinta solo.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/games/kit.js']);
const PALETTE = get(ctx, 'PALETTE'), PALETTES = get(ctx, 'PALETTES'), setGameTheme = get(ctx, 'setGameTheme');

const lum = h => {
  const v = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test('hay paleta oscura y clara con las mismas claves', () => {
  assert.equal(Object.keys(PALETTES.light).sort().join(), Object.keys(PALETTES.dark).sort().join());
});

test('setGameTheme cambia los valores del mismo objeto PALETTE', () => {
  const ref = PALETTE;
  setGameTheme('light');
  assert.equal(PALETTE, ref);
  assert.equal(PALETTE.bg, PALETTES.light.bg);
  assert.equal(PALETTE.ink, PALETTES.light.ink);
  setGameTheme('dark');
  assert.equal(PALETTE.bg, PALETTES.dark.bg);
  setGameTheme('cualquier otra cosa');
  assert.equal(PALETTE.bg, PALETTES.dark.bg, 'por defecto, oscuro');
});

for (const theme of ['dark', 'light']) {
  test(`tema ${theme}: el texto y los colores se leen sobre el fondo del juego`, () => {
    const P = PALETTES[theme];
    assert.ok(contrast(P.ink, P.bg) >= 7, 'ink');
    assert.ok(contrast(P.mute, P.bg) >= 4.5, 'mute');
    for (const k of ['N', 'Z', 'Q', 'I', 'R', 'brand', 'ok', 'bad']) assert.ok(contrast(P[k], P.bg) >= 3, `${k} ${P[k]} sobre ${P.bg}`);
    assert.ok(contrast(P.ink, P.card) >= 7, 'ink sobre tarjeta');
  });
}

test('el fondo del recuadro .play (CSS) es el mismo bg de la paleta en cada tema', () => {
  const css = require('fs').readFileSync(require('path').join(__dirname, '..', 'css', 'styles.css'), 'utf8');
  const vals = [...css.matchAll(/--play-bg:\s*(#[0-9a-fA-F]{6})/g)].map(m => m[1].toLowerCase());
  assert.equal(vals.join(), [PALETTES.dark.bg, PALETTES.light.bg].map(c => c.toLowerCase()).join());
});
