// Interfaz «red» (spec 2026-11-27-interfaz-red): neón sobrio, sin relieve de juguete, y la marca del cerebro en malla.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const css = read('css/styles.css'), index = read('index.html'), app = read('js/app.js'), sw = read('sw.js');
const manifest = JSON.parse(read('manifest.json'));
const block = sel => (css.match(new RegExp(sel.replace(/[.#[\]=":*()]/g, '\\$&') + '\\s*\\{([^}]*)\\}')) || [])[1] || '';
const dark = block(':root'), light = block(':root[data-theme="light"]');
const v = (b, name) => (b.match(new RegExp(`${name}:\\s*([^;]+);`)) || [])[1];
// Reglas sueltas «selector { cuerpo }» (el archivo no anida reglas salvo @media, que aquí da igual).
const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m => ({ sel: m[1].trim(), body: m[2] }));

test('los dos temas traen el fondo negro azulado, el acento hielo y las variables nuevas', () => {
  assert.equal(v(dark, '--bg'), '#07080f');
  assert.equal(v(dark, '--brand'), '#6fd3ff');
  assert.equal(v(dark, '--on-brand'), '#04121d');
  assert.equal(v(light, '--on-brand'), '#ffffff');
  for (const b of [dark, light]) for (const k of ['--halo', '--ink-mix']) assert.match(v(b, k) || '', /^\d+%$/, k);
  assert.match(v(dark, '--display') || '', /Jost/);
});

test('el documento, la portada, theme-color y el manifiesto usan el --bg de cada tema', () => {
  const d = v(dark, '--bg'), l = v(light, '--bg');
  assert.ok(index.includes(`<meta name="theme-color" content="${d}">`));
  assert.ok(app.includes(`t === 'dark' ? '${d}' : '${l}'`), 'applyTheme');
  assert.equal(manifest.theme_color, d);
  assert.equal(manifest.background_color, d, 'la pantalla de inicio de Android es el fondo del icono');
});

test('ninguna sombra dura: el relieve de juguete se fue', () => {
  const hard = /box-shadow:[^;}]*(?:^|[\s,])0 [1-9]\d*px 0 (?:var|color-mix|#|rgb)/;
  const bad = rules.filter(r => hard.test(r.body)).map(r => r.sel);
  assert.deepEqual(bad, []);
});

test('bordes finos y sin peso 800', () => {
  assert.doesNotMatch(css, /2px solid var\(--line\)/);
  assert.doesNotMatch(css, /font-weight:\s*800/);
  assert.doesNotMatch(read('admin/admin.css'), /font-weight:\s*800/);
  assert.doesNotMatch(app, /'800'/, 'la app ya no pide el peso 800');
  const fonts = (index.match(/fonts\.googleapis\.com\/css2\?[^"]+/) || [''])[0];
  assert.match(fonts, /Plus\+Jakarta\+Sans:wght@400;500;600;700&/);
  assert.match(fonts, /Jost:wght@[\d;]*600/);
});

test('sobre el color de marca la tinta es --on-brand, no blanco fijo', () => {
  const onBrand = r => /background:\s*var\(--brand\)|--c:\s*var\(--brand\)/.test(r.body);
  const bad = rules.filter(r => onBrand(r) && /(?:^|[;\s])color:\s*#fff\b/.test(r.body)).map(r => r.sel);
  assert.deepEqual(bad, []);
  assert.match(block('.btn.brand'), /color:\s*var\(--on-brand\)/);
});

test('el camino es una red: nodo con aro, hecho encendido, cerrado apagado y aristas finas', () => {
  assert.match(block('.node'), /border:\s*1\.5px solid var\(--c\)/);
  assert.match(block('.node'), /border-radius:\s*50%/);
  assert.match(block('.node.done'), /background:\s*var\(--gold\)/);
  assert.match(block('.node.locked'), /border-color:\s*var\(--line\)/);
  assert.match(block('.node.locked'), /box-shadow:\s*none/);
  const w = Number((block('.trail path').match(/stroke-width:\s*([\d.]+)/) || [])[1]);
  assert.ok(w > 0 && w <= 2, `arista de ${w}px`);
  assert.doesNotMatch(block('.trail path') + block('.world-map .trail path'), /stroke-dasharray:\s*2 1\d/, 'sin puntos gordos');
});

// ---- la marca ----
const marca = require('../tools/marca.js');
const built = marca.build();

test('js/marca.js sale de tools/marca.js y está registrado', () => {
  assert.equal(read('js/marca.js'), built.files['js/marca.js'].replace(/\r\n/g, '\n'), 'correr: node tools/marca.js');
  for (const f of ['brand/logo-dark.svg', 'brand/logo-light.svg', 'brand/cerebro.svg']) {
    assert.equal(read(f), built.files[f].replace(/\r\n/g, '\n'), f);
    assert.ok(sw.includes(`'${f}'`), `${f} en el SHELL`);
  }
  assert.ok(index.includes('<script defer src="js/marca.js"></script>'));
  assert.ok(index.indexOf('js/marca.js') < index.indexOf('js/ui.js'), 'antes de ui.js, que la usa en el diálogo');
  assert.ok(sw.includes("'js/marca.js'"));
});

test('la malla: cada arista une dos nodos, todo cabe en el cuadro y hay una versión sencilla para tamaños chicos', () => {
  for (const kind of ['full', 'simple']) {
    const g = built.geo[kind];
    for (const [x, y] of g.nodes) assert.ok(x >= 2 && x <= 98 && y >= 2 && y <= 98, `${kind}: nodo (${x}, ${y}) fuera`);
    for (const [a, b] of g.edges) assert.ok(a !== b && g.nodes[a] && g.nodes[b], `${kind}: arista ${a}-${b}`);
    for (const t of g.tris) assert.equal(new Set(t).size, 3);
    const used = new Set(g.edges.flat());
    assert.equal(used.size, g.nodes.length, `${kind}: ningún nodo suelto`);
    assert.ok(g.stem.length >= 4, 'el tallo');
  }
  assert.ok(built.geo.full.nodes.length >= 30);
  assert.ok(built.geo.simple.nodes.length <= 18);
});

test('brainSVG, brainTile y logoHTML: malla, caras encendidas y nombre accesible', () => {
  const ctx = loadScripts(['js/marca.js']);
  const brainSVG = get(ctx, 'brainSVG'), brainTile = get(ctx, 'brainTile'), logoHTML = get(ctx, 'logoHTML');
  for (const k of ['full', 'simple', 'lit']) {
    const s = brainSVG(k);
    assert.match(s, /^<svg class="brain[^"]*" viewBox="0 0 100 100"/);
    assert.match(s, /aria-hidden="true"/);
    assert.match(s, /stroke="currentColor"/, 'las aristas toman el color del texto');
  }
  assert.ok((brainSVG('lit').match(/<polygon/g) || []).length > (brainSVG('full').match(/<polygon/g) || []).length, 'lit llena las caras');
  assert.match(brainTile('simple'), /class="brain-tile"/);
  assert.match(logoHTML(), /role="img" aria-label="Zuka"/);
});

test('animación de entrada: el cerebro se arma por turnos, luego ZUKA y el eslogan, sin retrasar el arranque', () => {
  const ctx = loadScripts(['js/marca.js']), html = get(ctx, 'introHTML')();
  assert.equal(get(ctx, 'SLOGAN'), 'Potencia tu mente');
  assert.match(html, /^<div class="intro" role="img" aria-label="Zuka\. Potencia tu mente">/);
  assert.match(html, /<p class="intro-slogan">Potencia tu mente<\/p>/);
  assert.equal((html.match(/<path pathLength="1" style="--k/g) || []).length, 7, 'ZUKA se escribe trazo a trazo (Z, U, tres de la K y dos de la A)');
  const g = built.geo.full, ds = [...html.matchAll(/style="--d:([\d.]+)"/g)].map(m => Number(m[1]));
  assert.equal(ds.length, g.edges.length + g.nodes.length + g.tris.length, 'cada arista, nodo y cara con su turno');
  assert.ok(ds.every(d => d >= 0 && d <= 1) && Math.max(...ds) === 1 && Math.min(...ds) < .2, 'turnos de 0 a 1, desde el tallo');
  assert.equal((html.match(/<path pathLength="1" style="--d/g) || []).length, g.edges.length, 'aristas que se dibujan');
  // El CSS: nada se ve hasta .play; el orden es malla, caras, palabra, eslogan.
  const delay = sel => Number((css.match(new RegExp(sel.replace(/[.]/g, '\\.') + ' \\{ animation: [^;]*? (?:calc\\()?([\\d.]+)s(?: \\+ var\\(--d\\) \\* [\\d.]+s\\))? forwards')) || [])[1]);
  assert.match(css, /\.intro \.bi-stem, \.intro \.bi-nodes circle, \.intro \.bi-faces polygon, \.intro-slogan \{ opacity: 0; \}/);
  assert.ok(delay('.intro.play .bi-edges path') < delay('.intro.play .bi-faces polygon'));
  assert.ok(delay('.intro.play .bi-faces polygon') < delay('.intro.play .wordmark path'));
  assert.ok(delay('.intro.play .wordmark path') < delay('.intro.play .intro-slogan'));
  // La app: una vez por sesión, se salta con un toque, no sale con «reducir movimiento» y empieza al quitar la portada.
  assert.match(app, /prefers-reduced-motion: reduce\)'\)\.matches \|\| sessionStorage\.getItem\('zuka-intro'\)/);
  assert.match(app, /el\.addEventListener\('click', end\)/);
  assert.match(app.slice(app.indexOf('function hideBoot('), app.indexOf('const INTRO_MS')), /playIntro\(\);/);
  const ms = Number((app.match(/const INTRO_MS = (\d+)/) || [])[1]);
  assert.ok(ms >= 3000 && ms <= 4000, `dura ${ms} ms`);
  assert.ok(Number((css.match(/\.intro \{[^}]*z-index: (\d+)/) || [])[1]) < 1000, 'debajo de la portada #boot');
});

test('la mascota y los logos viejos ya no se usan', () => {
  const files = ['index.html', 'sw.js', 'js/app.js', 'js/ui.js', 'js/tour.js', 'js/cuenta.js', 'admin/index.html', 'css/styles.css'];
  for (const f of files) assert.doesNotMatch(read(f), /mascota\.png|logo-(light|dark)\.png/, f);
  assert.doesNotMatch(read('js/tour.js'), /Soy Zuka/);
  assert.match(read('js/ui.js'), /brainTile\(/, 'el diálogo lleva la ficha del cerebro');
  assert.match(app, /brainSVG\('lit'\)/, 'al terminar la lección el cerebro se enciende');
  assert.match(read('js/cuenta.js'), /logoHTML\(\)/);
});
