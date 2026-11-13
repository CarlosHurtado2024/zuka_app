// Los tres pilares de una PWA (spec 2026-11-13-revision-pwa): confiable (red lenta o sin conexión),
// instalable (manifest con atajos e iconos guardados) y capaz (aviso de conexión, almacenamiento
// persistente). Ver también sw.test.js, update.test.js y arranque.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { ROOT, loadScripts, get } = require('./load');

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Carga sw.js con fetch, caché y temporizadores falsos.
function loadSW({ fetch, match, timer = setTimeout } = {}) {
  const listeners = {};
  const cached = [];
  const cache = {
    addAll: async list => cached.push(...list),
    add: async url => cached.push(url),
    put: async () => {},
  };
  const self = { addEventListener: (t, fn) => { listeners[t] = fn; }, location: { origin: 'http://localhost' } };
  const ctx = vm.createContext({
    self, URL, console, Response: { error: () => 'ERROR' },
    caches: { open: async () => cache, match: match || (async () => undefined) },
    fetch: fetch || (async () => ({ ok: true, clone: () => ({}) })),
    setTimeout: timer, clearTimeout,
  });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), ctx, { filename: 'sw.js' });
  return { listeners, cached, ctx };
}

function fire(listeners, url, mode = 'no-cors', ids = {}) {
  let res;
  const ev = {
    request: { url, method: 'GET', mode, headers: { has: () => false } },
    respondWith: p => { res = p; },
    waitUntil: () => {},
    ...ids,
  };
  listeners.fetch(ev);
  return res;
}

test('install guarda KaTeX y hls.js para que las fórmulas y el reproductor anden sin conexión', async () => {
  const { listeners, cached } = loadSW();
  let pending;
  listeners.install({ waitUntil: p => { pending = p; } });
  await pending;
  for (const lib of ['katex.min.js', 'katex.min.css', 'hls.min.js']) {
    assert.ok(cached.some(u => u.endsWith(lib)), `falta ${lib}`);
  }
});

test('install no falla si un CDN no responde', async () => {
  const { listeners, ctx } = loadSW();
  ctx.caches.open = async () => ({ addAll: async () => {}, add: async () => { throw new Error('CDN caído'); } });
  let pending;
  listeners.install({ waitUntil: p => { pending = p; } });
  await assert.doesNotReject(pending);
});

test('el shell guarda los iconos que usa la app instalada', () => {
  const { ctx } = loadSW();
  const shell = vm.runInContext('SHELL', ctx);
  for (const icon of manifest.icons) assert.ok(shell.includes(icon.src), `falta ${icon.src}`);
  assert.ok(shell.includes('icons/apple-touch-icon.png'));
  assert.ok(shell.includes('js/pwa.js'));
});

test('con red rápida responde la red', async () => {
  const net = { ok: true, clone: () => ({}), tag: 'RED' };
  const { listeners } = loadSW({ fetch: async () => net, match: async () => 'CACHE' });
  assert.equal(await fire(listeners, 'http://localhost/js/app.js'), net);
});

test('con red lenta la navegación abre la copia guardada sin esperar', async () => {
  const { listeners } = loadSW({
    fetch: () => new Promise(() => {}),        // la red nunca contesta
    match: async () => 'CACHE',
    timer: (fn) => setTimeout(fn, 5),           // el plazo de la red vence enseguida
  });
  assert.equal(await fire(listeners, 'http://localhost/index.html?tab=clips', 'navigate'), 'CACHE');
});

// Si la página salió de la caché, sus scripts también: nunca un index.html viejo con scripts nuevos.
test('una página abierta desde la caché pide sus scripts a la caché (versiones coherentes)', async () => {
  let netCalls = 0;
  const { listeners } = loadSW({
    fetch: () => { netCalls++; return new Promise(() => {}); },
    match: async () => 'CACHE',
    timer: (fn) => setTimeout(fn, 5),
  });
  await fire(listeners, 'http://localhost/index.html', 'navigate', { resultingClientId: 'c1' });
  const before = netCalls;
  assert.equal(await fire(listeners, 'http://localhost/js/app.js', 'no-cors', { clientId: 'c1' }), 'CACHE');
  assert.equal(netCalls, before, 'no va a la red');
});

test('los scripts de una página traída por la red no usan el plazo (no se mezclan versiones)', async () => {
  const net = { ok: true, clone: () => ({}) };
  const { listeners } = loadSW({
    fetch: () => new Promise(r => setTimeout(() => r(net), 30)),
    match: async () => 'CACHE',
    timer: (fn) => setTimeout(fn, 1),
  });
  assert.equal(await fire(listeners, 'http://localhost/js/app.js', 'no-cors', { clientId: 'c2' }), net);
});

test('red lenta y sin copia: espera a la red', async () => {
  const net = { ok: true, clone: () => ({}) };
  const { listeners } = loadSW({
    fetch: () => new Promise(r => setTimeout(() => r(net), 20)),
    match: async () => undefined,
    timer: (fn) => setTimeout(fn, 1),
  });
  assert.equal(await fire(listeners, 'http://localhost/', 'navigate'), net);
});

test('un error rápido del servidor (500) cede a la copia guardada', async () => {
  const err = { ok: false, status: 500, clone: () => ({}) };
  const { listeners } = loadSW({ fetch: async () => err, match: async () => 'CACHE' });
  assert.equal(await fire(listeners, 'http://localhost/js/app.js'), 'CACHE');
  assert.equal(await fire(listeners, 'http://localhost/', 'navigate'), 'CACHE');
});

test('un 404 sin copia se entrega tal cual', async () => {
  const err = { ok: false, status: 404, clone: () => ({}) };
  const { listeners } = loadSW({ fetch: async () => err, match: async () => undefined });
  assert.equal(await fire(listeners, 'http://localhost/no-existe.js'), err);
});

test('la red falla después del plazo y no hay copia: error, no se queda colgado', async () => {
  const { listeners } = loadSW({
    fetch: () => new Promise((_, no) => setTimeout(() => no(new Error('offline')), 20)),
    match: async () => undefined,
    timer: (fn) => setTimeout(fn, 1),
  });
  assert.equal(await fire(listeners, 'http://localhost/js/app.js'), 'ERROR');
});

test('la red sigue actualizando la copia aunque responda la caché', async () => {
  const pending = [];
  const { listeners } = loadSW({
    fetch: () => new Promise(r => setTimeout(() => r({ ok: true, clone: () => ({}) }), 20)),
    match: async () => 'CACHE',
    timer: (fn) => setTimeout(fn, 1),
  });
  const ev = {
    request: { url: 'http://localhost/', method: 'GET', mode: 'navigate', headers: { has: () => false } },
    respondWith: () => {}, waitUntil: p => pending.push(p),
  };
  listeners.fetch(ev);
  assert.equal(pending.length, 1, 'waitUntil mantiene viva la descarga');
});

test('install no se queda colgado si un CDN nunca contesta', async () => {
  const { listeners, ctx } = loadSW({ timer: (fn, ms) => setTimeout(fn, ms > 1000 ? 5 : ms) });
  ctx.caches.open = async () => ({ addAll: async () => {}, add: () => new Promise(() => {}) });
  let pending;
  listeners.install({ waitUntil: p => { pending = p; } });
  await pending;   // si no hubiera plazo, esta prueba nunca terminaría
});

test('install guarda las fuentes principales de KaTeX', async () => {
  const { listeners, cached } = loadSW();
  let pending;
  listeners.install({ waitUntil: p => { pending = p; } });
  await pending;
  for (const f of ['KaTeX_Main-Regular.woff2', 'KaTeX_Math-Italic.woff2', 'KaTeX_Size1-Regular.woff2']) {
    assert.ok(cached.some(u => u.endsWith(f)), `falta ${f}`);
  }
});

test('sin conexión una navegación abre index.html guardado', async () => {
  const { listeners } = loadSW({
    fetch: async () => { throw new Error('offline'); },
    match: async (req) => (req === 'index.html' ? 'INDEX' : undefined),
  });
  assert.equal(await fire(listeners, 'http://localhost/?tab=clips', 'navigate'), 'INDEX');
});

test('el manifest es instalable y trae atajos a Clips y Tutorías', () => {
  for (const k of ['name', 'short_name', 'start_url', 'display', 'icons']) assert.ok(manifest[k], `falta ${k}`);
  assert.ok(manifest.icons.some(i => i.sizes === '192x192'));
  assert.ok(manifest.icons.some(i => i.sizes === '512x512' && i.purpose === 'maskable'));
  const urls = (manifest.shortcuts || []).map(s => s.url);
  assert.ok(urls.includes('./index.html?tab=clips'));
  assert.ok(urls.includes('./index.html?tab=tutorias'));
  for (const s of manifest.shortcuts) assert.ok(s.icons && s.icons.length, `atajo sin icono: ${s.name}`);
});

test('pwa.js se carga antes que app.js', () => {
  const a = html.indexOf('js/pwa.js'), b = html.indexOf('js/app.js');
  assert.ok(a > 0 && a < b);
});

const P = loadScripts(['js/pwa.js']);

test('tabFromURL abre la pestaña del atajo y solo pestañas válidas', () => {
  const tabFromURL = get(P, 'tabFromURL');
  assert.equal(tabFromURL('?tab=clips'), 'clips');
  assert.equal(tabFromURL('?tab=tutorias'), 'tutorias');
  assert.equal(tabFromURL('?tab=profile'), 'profile');
  assert.equal(tabFromURL('?tab=hackeo'), 'learn');
  assert.equal(tabFromURL(''), 'learn');
});

test('watchConnection avisa al perder y al recuperar la conexión', () => {
  const watchConnection = get(P, 'watchConnection');
  const ls = {}, said = [], cls = new Set();
  const win = { navigator: { onLine: true }, addEventListener: (t, fn) => { ls[t] = fn; } };
  const body = { classList: { toggle: (c, on) => (on ? cls.add(c) : cls.delete(c)) } };
  watchConnection(win, body, m => said.push(m));
  assert.equal(said.length, 0);
  win.navigator.onLine = false; ls.offline();
  assert.ok(cls.has('offline'));
  assert.match(said.pop(), /Sin conexión/);
  win.navigator.onLine = true; ls.online();
  assert.ok(!cls.has('offline'));
  assert.match(said.pop(), /conexión/i);
});

test('watchConnection avisa al abrir la app sin conexión', () => {
  const watchConnection = get(P, 'watchConnection');
  const said = [];
  watchConnection({ navigator: { onLine: false }, addEventListener() {} },
    { classList: { toggle() {} } }, m => said.push(m));
  assert.match(said[0], /Sin conexión/);
});

test('keepData pide almacenamiento persistente solo una vez y sin fallar', async () => {
  const keepData = get(P, 'keepData');
  let asked = 0;
  const nav = { storage: { persisted: async () => false, persist: async () => { asked++; return true; } } };
  assert.equal(await keepData(nav), true);
  assert.equal(asked, 1);
  const already = { storage: { persisted: async () => true, persist: async () => { asked++; } } };
  assert.equal(await keepData(already), true);
  assert.equal(asked, 1);
  assert.equal(await keepData({}), false);
});
