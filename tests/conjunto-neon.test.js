// Video «¿Qué es un conjunto?» en estilo neón (video/conjunto-neon, lección alg-0a; pedido del usuario el 2026-11-27):
// fondo negro, sin cuadrícula, blanco + el morado del curso + un color que combina, letra fina, entre 4 y 5 minutos.
// El guion (data.js) es el mismo de video/conjunto-lamina, que ya tiene sus pruebas.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const read = f => fs.readFileSync(path.join(__dirname, '..', 'video', 'conjunto-neon', f), 'utf8');
const film = read('film.js'), index = read('index.html'), D = require('../video/conjunto-neon/data.js');
const hue = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
  return d ? (60 * (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) + 360) % 360 : 0; };

test('el guion es el del video lámina de la misma lección', () => {
  assert.strictEqual(read('data.js'), fs.readFileSync(path.join(__dirname, '..', 'video', 'conjunto-lamina', 'data.js'), 'utf8'));
});

test('fondo negro y sin cuadrícula', () => {
  const P = film.match(/const P = \{[^}]+\}/)[0];
  assert.match(P, /bg: '#000000'/);
  const back = film.slice(film.indexOf('function backdrop()'), film.indexOf('function noise()'));
  assert.doesNotMatch(back, /moveTo|lineTo|stroke\(/, 'el fondo no traza líneas');
  assert.match(index, /background:#000/);
  assert.doesNotMatch(film.slice(film.indexOf('function film(')), /noise\(\)/, 'sin grano');
});

test('colores: blanco, el morado del curso y un rosa que combina; nada de verde azulado', () => {
  const P = film.match(/const P = \{[^}]+\}/)[0], c = k => P.match(new RegExp(`${k}: '(#[0-9A-Fa-f]{6})'`))[1];
  assert.ok(hue(c('teal')) >= 245 && hue(c('teal')) <= 285, `acento ${c('teal')}`);
  assert.ok(hue(c('coral')) >= 300 && hue(c('coral')) <= 345, `segundo color ${c('coral')}`);
  assert.doesNotMatch(film, /#5EE0C1|#244D53|#0F1B30|#0B0E24/i);
});

test('letra fina y de libro; trazos que brillan', () => {
  assert.match(film, /const thin = w => \(w >= 600 \? 500 : w >= 500 \? 340 : 300\)/);
  assert.match(film, /KMath/); assert.match(film, /KMain/);
  assert.match(index, /KaTeX_Math-Italic\.ttf/);
  assert.match(film, /X\.shadowColor = col; X\.shadowBlur = GLOW/);
});

test('dura entre cuatro y cinco minutos', () => {
  const K = Number(index.match(/const K = ([\d.]+)/)[1]), dur = D.DUR * K;
  assert.ok(dur >= 240 && dur <= 300, `${dur.toFixed(1)} s`);
  assert.match(index, /window\.DUR = \+\(D\.DUR \* K\)/);
  assert.match(index, /lines: D\.NARR\.map\(\(\[a, b, s\]\) => \[kt\(a\), kt\(b\), s\]\)/, 'el .srt lleva los mismos tiempos');
});
