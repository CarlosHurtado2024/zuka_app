// Recorrido guiado de bienvenida (js/tour.js): aparece la primera vez, cubre curso, mundos, niveles,
// video, ejercicios, Clips y Perfil, y sus cálculos de posición no se salen de la pantalla.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = loadScripts(['js/back.js', 'js/tour.js']);
const STEPS = get(ctx, 'TOUR_STEPS'), shouldStart = get(ctx, 'tourShouldStart');
const hole = get(ctx, 'tourHole'), tipPos = get(ctx, 'tourTipPos'), backStep = get(ctx, 'backStep');
const index = read('index.html'), sw = read('sw.js'), app = read('js/app.js'), css = read('css/styles.css');

test('sale solo a quien abre la app por primera vez', () => {
  assert.equal(shouldStart({ xp: 0, done: {} }), true);
  assert.equal(shouldStart({ xp: 0, done: {}, tourDone: true }), false);
  assert.equal(shouldStart({ xp: 12, done: {} }), false, 'quien ya tiene XP no es nuevo');
  assert.equal(shouldStart({ xp: 0, done: { 'alg-0a': true } }), false);
});

test('cubre curso, mundos, niveles, video, ejercicios, progreso, Clips y Perfil, en ese orden', () => {
  assert.equal(STEPS.map(s => s.id).join(),
    'hola,curso,mundos,niveles,video,ejercicios,progreso,clips,tutorias,perfil,fin');
});

test('cada paso tiene título y un texto corto que cabe en el celular', () => {
  for (const s of STEPS) {
    assert.ok(s.title && s.title.length <= 34, `título de ${s.id}`);
    assert.ok(s.text && s.text.length <= 190, `texto de ${s.id}: ${s.text.length} caracteres`);
    assert.ok(['map', 'world'].includes(s.view), `vista de ${s.id}`);
  }
});

test('los pasos que señalan algo dicen qué; los centrados llevan mascota o ilustración', () => {
  for (const s of STEPS) {
    if (s.target) assert.ok(Array.isArray(s.target) && s.target.length, `target de ${s.id}`);
    else assert.ok(s.art, `${s.id} es centrado y necesita arte`);
  }
  const t = id => STEPS.find(s => s.id === id).target.join();
  assert.match(t('curso'), /\.tb-course/);
  assert.match(t('mundos'), /\.wnode/);
  assert.match(t('niveles'), /\.node/);
  assert.match(t('clips'), /data-tab="clips"/);
  assert.match(t('perfil'), /data-tab="profile"/);
});

test('el mapa se muestra antes de entrar al mundo y no se vuelve atrás después', () => {
  const views = STEPS.map(s => s.view).join();
  assert.match(views, /^(map,)+(world,?)+$/);
});

test('el hueco rodea al elemento con margen y no se sale de la pantalla', () => {
  const h = hole({ left: 100, top: 200, width: 80, height: 40 }, 360, 700);
  assert.ok(h.left < 100 && h.top < 200 && h.width > 80 && h.height > 40);
  const edge = hole({ left: 0, top: 0, width: 360, height: 50 }, 360, 700);
  assert.ok(edge.left >= 0 && edge.top >= 0 && edge.left + edge.width <= 360);
  const low = hole({ left: 300, top: 680, width: 80, height: 40 }, 360, 700);
  assert.ok(low.left + low.width <= 360 && low.top + low.height <= 700);
});

test('un elemento fuera de la vista no saca el hueco ni la tarjeta de la pantalla', () => {
  const h = hole({ left: 100, top: 900, width: 80, height: 80 }, 360, 700);
  assert.ok(h.top <= 700 && h.top + h.height <= 700);
  const p = tipPos(h, 320, 200, 360, 700, { left: 0, right: 360 });
  assert.ok(p.top >= 0 && p.top + 200 <= 700);
});

test('una tarjeta más alta que la pantalla empieza arriba y se puede desplazar', () => {
  const B = { left: 0, right: 360 };
  assert.equal(tipPos({ left: 180, top: 170, width: 0, height: 0 }, 320, 400, 360, 340, B).top, 8);
  assert.equal(tipPos({ left: 100, top: 150, width: 80, height: 60 }, 320, 400, 360, 340, B).top, 8);
  const tip = css.match(/\.tour-tip \{[^}]*\}/)[0];
  assert.match(tip, /max-height: calc\(100dvh - 16px\)/);
  assert.match(tip, /overflow-y: auto/);
});

test('en modo revisión el paso de vidas no promete que se pierden', () => {
  const s = STEPS.find(x => x.id === 'progreso');
  assert.match(s.text, /cada error cuesta una/);
  assert.match(s.review, /no las pierdes/);
  assert.ok(s.review.length <= 190);
});

test('al cerrarse, la capa deja pasar los toques de inmediato', () => {
  assert.match(css, /\.tour:not\(\.open\) \{ pointer-events: none; \}/);
});

test('sin elemento, el hueco se cierra en el centro', () => {
  const h = hole(null, 360, 700);
  assert.equal(h.width, 0); assert.equal(h.height, 0);
  assert.equal(h.left, 180); assert.equal(h.top, 350);
});

test('la tarjeta va debajo si cabe, arriba si no, y siempre dentro de los bordes', () => {
  const B = { left: 0, right: 360 };
  const top = tipPos({ left: 10, top: 60, width: 120, height: 44 }, 320, 200, 360, 700, B);
  assert.equal(top.side, 'below');
  assert.ok(top.top >= 60 + 44);
  const bottom = tipPos({ left: 240, top: 640, width: 110, height: 56 }, 320, 200, 360, 700, B);
  assert.equal(bottom.side, 'above');
  assert.ok(bottom.top + 200 <= 640);
  for (const p of [top, bottom]) {
    assert.ok(p.left >= 0 && p.left + 320 <= 360, 'no se sale por los lados');
    assert.ok(p.top >= 0 && p.top + 200 <= 700, 'no se sale por arriba ni abajo');
  }
  // La flecha apunta al centro del elemento, sin salirse de la tarjeta.
  assert.ok(Math.abs(top.left + top.arrow - 70) < 1);
  assert.ok(bottom.arrow >= 18 && bottom.arrow <= 320 - 18);
});

test('en pantalla ancha la tarjeta se queda dentro de la columna de la app', () => {
  const p = tipPos({ left: 420, top: 60, width: 100, height: 40 }, 340, 180, 1280, 800, { left: 400, right: 880 });
  assert.ok(p.left >= 400 && p.left + 340 <= 880);
});

test('sin hueco (paso centrado) la tarjeta queda centrada', () => {
  const p = tipPos({ left: 180, top: 350, width: 0, height: 0 }, 320, 300, 360, 700, { left: 0, right: 360 });
  assert.equal(p.side, 'center');
  assert.equal(p.left, 20); assert.equal(p.top, 200);
});

test('el botón atrás del celular cierra el recorrido antes que cualquier otra cosa de la app', () => {
  assert.equal(backStep({ tab: 'learn', tour: true, world: true }), 'tour');
  assert.equal(backStep({ tab: 'learn', tour: true, dialog: true }), 'dialog');
  assert.equal(backStep({ tab: 'learn' }), 'ask-exit');
});

test('tour.js se carga antes de app.js y está en el SHELL', () => {
  assert.ok(index.includes('src="js/tour.js"'));
  assert.ok(index.indexOf('js/tour.js') < index.indexOf('js/app.js'));
  assert.ok(sw.includes("'js/tour.js'"));
});

test('la app lo arranca al inicio, lo recuerda y deja repetirlo desde Perfil', () => {
  assert.match(app, /tourDone: false/);
  const boot = app.slice(app.indexOf('// ---- arranque'));
  assert.match(boot, /if \(tourShouldStart\(S\)\) startTour\(\)/);
  assert.match(app, /data-tour/);
  assert.match(app, /Ver el recorrido otra vez/);
  // Reiniciar el progreso no vuelve a lanzar el recorrido.
  assert.match(app, /S = Object\.assign\(DEFAULTS\(\), \{ tourDone: S\.tourDone, /);
});

test('la capa usa los colores del tema, queda bajo los diálogos y sobre hojas y avisos', () => {
  const tip = css.match(/\.tour-tip \{[^}]*\}/)?.[0] || '';
  assert.match(tip, /background: var\(--bg2\)/);
  assert.match(tip, /color: var\(--ink\)/);
  const z = sel => +(css.match(new RegExp(`${sel} \\{[^}]*z-index: (\\d+)`))?.[1] ?? 0);
  assert.ok(z('\\.tour') > z('#sheet') && z('\\.tour') > z('\\.toast') && z('\\.tour') < z('\\.dialog'));
  assert.match(css, /prefers-reduced-motion: reduce\) \{[^}]*\.tour/);
});
