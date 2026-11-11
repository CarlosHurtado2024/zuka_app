// Arranque estable en el celular: la pantalla de inicio de Android, la portada de la app y la app
// usan el mismo fondo, y la app aparece completa de una vez (no por partes) cuando ya pintó y tiene fuentes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const index = read('index.html'), css = read('css/styles.css'), app = read('js/app.js');
const manifest = JSON.parse(read('manifest.json'));
const darkBg = css.match(/:root\s*\{[^}]*--bg:\s*(#[0-9a-f]{6})/i)[1].toLowerCase();
const lightBg = css.match(/:root\[data-theme="light"\]\s*\{[^}]*--bg:\s*(#[0-9a-f]{6})/i)[1].toLowerCase();
const inline = (index.match(/<style>([^<]*)<\/style>/) || [])[1] || '';

test('el manifest usa el fondo oscuro de la app (sin destello blanco al abrir)', () => {
  assert.equal(manifest.background_color.toLowerCase(), darkBg);
  assert.equal(manifest.theme_color.toLowerCase(), darkBg);
});

test('la portada #boot está en el HTML antes de #app y tiene su estilo en línea', () => {
  const boot = index.indexOf('id="boot"'), appDiv = index.indexOf('id="app"');
  assert.ok(boot > 0 && boot < appDiv, 'falta <div id="boot"> antes de #app');
  assert.match(index, /<style>[^<]*#boot\{/, 'el estilo de #boot va en línea en el <head>');
  assert.match(index, /<style>[^<]*html\{background:/, 'el fondo del documento se pinta antes de cargar styles.css');
});

test('la portada y el documento usan exactamente el --bg de cada tema', () => {
  assert.ok(inline.includes(`html{background:${darkBg}}`), 'fondo oscuro del documento');
  assert.ok(inline.includes(`html[data-theme="light"]{background:${lightBg}}`), 'fondo claro del documento');
  assert.match(inline, new RegExp(`#boot\\{[^}]*background:${darkBg}`), 'la portada tiene fondo propio (no hereda el de body)');
  assert.ok(inline.includes(`html[data-theme="light"] #boot{background:${lightBg}}`));
  // En la app instalada la pantalla de inicio es oscura: la portada empieza oscura y se funde con la app clara.
  assert.ok(inline.includes(`@media (display-mode:standalone){html[data-theme="light"] #boot{background:${darkBg}}}`));
});

test('la portada no anima tamaño (el icono no crece ni se acomoda)', () => {
  const style = index.match(/<style>([^<]*)<\/style>/)[1];
  assert.doesNotMatch(style, /scale|@keyframes|width\s*\.|transition:[^;}]*(width|height|transform)/);
});

test('la app quita la portada al estar lista y hay un respaldo si el JS falla', () => {
  assert.match(app, /function hideBoot\(/);
  assert.match(app, /document\.fonts\.load\(/, 'pide la fuente de la app, no solo fonts.ready');
  const boot = app.slice(app.indexOf('// ---- arranque'));
  assert.ok(boot.indexOf('Promise.race(') < boot.lastIndexOf("go('learn')"), 'la espera se arma antes de pintar, por si go falla');
  assert.match(index, /setTimeout\(function \(\) \{[^}]*getElementById\('boot'\)/, 'respaldo en línea que la quita');
});
