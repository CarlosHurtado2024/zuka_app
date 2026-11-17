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

// Paleta por curso (COURSE_PALETTES): los juegos de una lección toman los colores de su curso.
const COURSE_PALETTES = get(ctx, 'COURSE_PALETTES'), setGameCourse = get(ctx, 'setGameCourse');
const hue = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
  return d ? (60 * (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) + 360) % 360 : 0; };

test('setGameCourse pone la paleta del curso sobre la del tema, y sin curso vuelve la del tema', () => {
  setGameTheme('dark'); setGameCourse('algebra');
  assert.equal(PALETTE.bg, COURSE_PALETTES.algebra.dark.bg);
  assert.equal(PALETTE.ok, PALETTES.dark.ok, 'acertar y fallar no cambian');
  setGameTheme('light');
  assert.equal(PALETTE.brand, COURSE_PALETTES.algebra.light.brand, 'el curso se conserva al cambiar de tema');
  setGameCourse('un curso sin paleta');
  assert.equal(PALETTE.bg, PALETTES.light.bg);
  setGameCourse(null); setGameTheme('dark');
  assert.equal(JSON.stringify(PALETTE), JSON.stringify(PALETTES.dark));
});

for (const [course, pal] of Object.entries(COURSE_PALETTES)) for (const theme of ['dark', 'light']) {
  test(`${course}, tema ${theme}: la paleta del curso se lee y solo usa claves de la paleta común`, () => {
    for (const k of Object.keys(pal[theme])) { assert.ok(k in PALETTES[theme], k); assert.match(pal[theme][k], /^#[0-9A-F]{6}$/, k); }
    for (const k of ['ok', 'bad']) assert.ok(!(k in pal[theme]), `${k} es de todos los cursos`);
    const P = { ...PALETTES[theme], ...pal[theme] };
    assert.ok(contrast(P.ink, P.bg) >= 7, 'ink');
    assert.ok(contrast(P.mute, P.bg) >= 4.5, 'mute');
    for (const k of ['N', 'Z', 'Q', 'I', 'R', 'brand', 'ok', 'bad']) assert.ok(contrast(P[k], P.bg) >= 3, `${k} ${P[k]} sobre ${P.bg}`);
    assert.ok(contrast(P.ink, P.card) >= 7, 'ink sobre tarjeta');
    assert.equal(new Set(['N', 'Z', 'Q', 'I', 'R'].map(k => P[k])).size, 5, 'las cinco familias se distinguen');
  });
}

test('Álgebra es morado: marca, fondo y línea en tonos morados, sin menta ni verde azulado de relleno', () => {
  for (const theme of ['dark', 'light']) {
    const P = COURSE_PALETTES.algebra[theme];
    for (const k of ['brand', 'bg', 'line', 'R', 'mint', 'sky']) assert.ok(hue(P[k]) >= 225 && hue(P[k]) <= 300, `${theme}.${k} ${P[k]} (tono ${Math.round(hue(P[k]))})`);
  }
});

test('la lección y la evaluación avisan el curso a los juegos, y el marco toma el fondo de la paleta', () => {
  const fs = require('fs'), path = require('path'), read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  assert.match(read('js/app.js'), /function startLesson\(c, l\) \{[\s\S]{0,200}setGameCourse\(c\.id\)/);
  assert.match(read('js/exam.js'), /function startExam\(c, u\) \{[\s\S]{0,200}setGameCourse\(c\.id\)/);
  assert.match(read('js/games/kit.js'), /setProperty\?\.\('--play-bg', PALETTE\.bg\)/);
});

test('cada curso tiene su paleta y su color principal es el del curso, en los dos temas', () => {
  const all = [...require('fs').readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8').matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1])
    .filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
  const COURSES = get(loadScripts(all), 'COURSES');
  assert.equal(Object.keys(COURSE_PALETTES).sort().join(), COURSES.map(c => c.id).sort().join());
  for (const c of COURSES) for (const theme of ['dark', 'light']) {
    const b = COURSE_PALETTES[c.id][theme].brand, dh = Math.abs(hue(b) - hue(c.color));
    assert.ok(Math.min(dh, 360 - dh) <= 25, `${c.id} ${theme}: ${b} no es del color del curso ${c.color}`);
  }
  assert.equal(new Set(Object.values(COURSE_PALETTES).map(p => p.dark.bg)).size, COURSES.length, 'cada curso con su fondo');
});
