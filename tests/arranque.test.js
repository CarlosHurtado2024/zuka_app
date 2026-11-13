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

test('la pantalla de inicio de Android es blanca como el fondo del icono', () => {
  assert.equal(manifest.background_color.toLowerCase(), '#ffffff');
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
  assert.match(inline, new RegExp(`#boot\{[^}]*background:${darkBg}`), 'la portada tiene fondo propio (no hereda el de body)');
  assert.ok(inline.includes(`html[data-theme="light"] #boot{background:${lightBg}}`));
});

test('en la app instalada la portada sigue la pantalla de inicio: blanca y sin un segundo icono', () => {
  assert.ok(inline.includes('@media (display-mode:standalone){#boot,html[data-theme="light"] #boot{background:#ffffff}}'));
  const boot = index.slice(index.indexOf('id="boot"'), index.indexOf('</div>', index.indexOf('id="boot"')));
  assert.doesNotMatch(boot, /<img/, 'un icono propio no coincide con el de Android y parece que salta');
  assert.doesNotMatch(index, /rel="preload" as="image" href="icons\/icon-192\.png"/);
});

test('la portada solo se desvanece: nada se mueve ni cambia de tamaño', () => {
  assert.doesNotMatch(inline, /scale|@keyframes|transform|transition:[^;}]*(width|height|transform)/);
});

test('la app quita la portada al estar lista y hay un respaldo si el JS falla', () => {
  assert.match(app, /function hideBoot\(/);
  assert.match(app, /document\.fonts\.load\(/, 'pide la fuente de la app, no solo fonts.ready');
  const boot = app.slice(app.indexOf('// ---- arranque'));
  assert.ok(boot.indexOf('Promise.race(') < boot.lastIndexOf("go('learn')"), 'la espera se arma antes de pintar, por si go falla');
  assert.match(index, /setTimeout\(function \(\) \{[^}]*getElementById\('boot'\)/, 'respaldo en línea que la quita');
});

test('la app abre rápido: la portada no espera la fuente más de 300 ms y se va en 0.15 s', () => {
  const cap = Number((app.match(/Promise\.race\(\[fontsReady, new Promise\(r => setTimeout\(r, (\d+)\)\)\]\)/) || [])[1]);
  assert.ok(cap > 0 && cap <= 300, `espera máxima por la fuente: ${cap} ms`);
  assert.ok(inline.includes('transition:opacity .15s'), 'desvanecido corto');
  assert.doesNotMatch(app, /BOOT_MIN_MS/, 'sin tiempo mínimo de portada');
});
