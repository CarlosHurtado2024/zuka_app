// Guía «Cómo se juega» y colores de los juegos (spec 2026-11-16-guia-y-colores).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|guia/.test(f));
const ctx = loadScripts(files);
const GAMES = get(ctx, 'GAMES'), GUIDES = get(ctx, 'GUIDES'), SCENES = get(ctx, 'GUIDE_SCENES'), PALETTES = get(ctx, 'PALETTES');
const guideSteps = get(ctx, 'guideSteps'), drawGuideScene = get(ctx, 'drawGuideScene'), guideButton = get(ctx, 'guideButton');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// Lienzo de mentira: acepta cualquier llamada y anota los colores de relleno que se usan.
function fakeCtx() {
  const fills = [];
  const target = { measureText: () => ({ width: 60 }), fills };
  return new Proxy(target, {
    get: (t, k) => (k in t ? t[k] : () => {}),
    set: (t, k, v) => { if (k === 'fillStyle' || k === 'strokeStyle') fills.push(v); t[k] = v; return true; },
  });
}
const lum = hex => { const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const yellowish = hex => { const [r, g, b] = rgb(hex); return r > 235 && g > 215 && b < 240 && r - b > 14; };

test('todos los juegos tienen su guía, con escenas que existen y textos cortos', () => {
  const names = Object.keys(GAMES);
  assert.ok(names.length >= 170);
  for (const name of names) {
    const steps = GUIDES[name];
    assert.ok(Array.isArray(steps) && steps.length >= 1 && steps.length <= 2, `${name}: de uno a dos pasos propios`);
    for (const [scene, text, opts] of steps) {
      assert.ok(SCENES[scene], `${name}: no existe la escena ${scene}`);
      assert.ok(text.length >= 20 && text.length <= 100, `${name}: texto de ${text.length} letras`);
      assert.ok(/[.!»]$/.test(text), `${name}: el texto termina en punto`);
      assert.equal(typeof opts, 'object', `${name}: opciones`);
      if (opts.pick) for (const i of opts.pick) assert.ok(i >= 0 && i < opts.items.length, `${name}: pick fuera de las fichas`);
    }
  }
  assert.deepEqual(Object.keys(GUIDES).filter(n => !GAMES[n]), [], 'no hay guías de juegos que no existen');
});

test('la guía completa añade el cartel y las vidas a los juegos de acción, las rondas a los demás y siempre «Comprobar»', () => {
  const arcade = guideSteps({ type: 'play', game: 'buzo-enteros', params: { rounds: [{}, {}] } }).map(s => s[0]);
  assert.equal(arcade[0], 'start'); assert.ok(arcade.includes('lives')); assert.ok(!arcade.includes('rounds'));
  assert.equal(arcade[arcade.length - 1], 'check');
  const rounds = guideSteps({ type: 'play', game: 'parte-sigma', params: { rounds: [{}, {}, {}] } });
  assert.equal(rounds.map(s => s[0]).join(' '), 'step rounds check');
  assert.match(rounds[1][1], /Son 3 rondas/);
  assert.equal(guideSteps({ type: 'play', game: 'limonada', params: {} }).map(s => s[0]).join(' '), 'slide check');
  for (const type of ['mc', 'input', 'order', 'slider']) {
    const st = guideSteps({ type });
    assert.ok(st.length === 2 && st[1][0] === 'check', `${type} tiene ejemplo`);
  }
  assert.equal(guideSteps({ type: 'play', game: 'no-existe' }).length, 0);
  assert.equal(guideButton({ type: 'play', game: 'no-existe' }), '');
  assert.match(guideButton({ type: 'mc' }), /guide-btn.*Cómo se juega/);
  // Los juegos de acción de la lista existen y de verdad usan el armazón de vidas.
  for (const name of get(ctx, 'GUIDE_ARCADE')) assert.ok(/makeArcade\(|drawHearts\(|questGame\(/.test(read(`js/games/${name}.js`)), `${name} no es de acción`);
  // Y no falta ninguno: todo juego con vidas lleva esos pasos.
  for (const [name, game] of Object.entries(GAMES)) if (!game.algebraScene && /makeArcade\(/.test(read(`js/games/${name}.js`))) assert.ok(get(ctx, 'GUIDE_ARCADE').has(name), `${name} es de acción y no está en la lista`);
});

test('cada escena se dibuja en los dos temas, en toda la animación, sin fallar y sin colores fijos de tema', () => {
  const used = new Set(Object.values(GUIDES).flat().map(s => s[0]).concat(['start', 'lives', 'rounds', 'check', 'keys', 'slide']));
  assert.deepEqual(Object.keys(SCENES).filter(s => !used.has(s)), [], 'no sobran escenas');
  const all = [...Object.values(GUIDES).flat(), ...guideSteps({ type: 'play', game: 'buzo-enteros', params: { rounds: [{}, {}] } }), ...guideSteps({ type: 'play', game: 'parte-sigma', params: { rounds: [{}, {}] } })];
  for (const theme of ['dark', 'light']) for (const [scene, , opts] of all) for (const t of [0, 0.12, 0.3, 0.5, 0.66, 0.8, 0.99]) {
    const c = fakeCtx();
    assert.doesNotThrow(() => drawGuideScene(c, scene, t, opts, 320, 160, PALETTES[theme]), `${scene} en t = ${t}`);
    assert.equal(c.fills[0], PALETTES[theme].bg, 'el fondo es el del tema');
  }
});

test('la guía está conectada: botón junto a la pista, se abre sola la primera vez y se recuerda', () => {
  const ex = read('js/exercises.js'), guia = read('js/guia.js'), app = read('js/app.js'), css = read('css/styles.css');
  assert.match(ex, /guideButton\(ex\)/); assert.ok(ex.includes('guideWanted(ex)) guide = openGuide(ex, { auto: true, onClose: focusInput })'));
  assert.match(guia, /S\.guides \|\|= \{\}\)\[guideKey\(ex\)\] = true/);
  assert.match(guia, /S\.guideAuto = false/);
  assert.ok(read('js/exam.js').includes("$('.hint-open', body)") && !read('js/exam.js').includes("$('.hint-btn', body)"), 'la evaluación cobra la pista, no la guía');
  assert.match(read('js/back.js'), /if \(s\.guide\) return 'guide'/, 'el botón atrás cierra la guía');
  assert.match(guia, /addEventListener\('keydown', onKey, true\)/, 'el teclado no llega a la lección de abajo');
  assert.match(ex, /guide\.close\(true\)/, 'al quitar el ejercicio se cierra su guía');
  assert.match(guia, /const v = from \+ dir \* done/, 'los botones − \/ + de la escena cuentan de uno en uno');
  assert.ok(guia.includes("'#overlay.open .exam-foot'") && read('js/exam.js').includes('lesson-foot exam-foot'), 'en una evaluación no sale sola');
  assert.match(guia, /reducedMotion\(\)/, 'sin animación si el sistema pide menos movimiento');
  assert.match(app, /guides: \{\}, guideAuto: true/);
  for (const cls of ['.guide-card', '.guide-stage', '.guide-dots', '.guide-actions', '.ex-tools']) assert.ok(css.includes(cls), `falta el estilo ${cls}`);
  assert.ok(html.indexOf('js/guia.js') > 0 && html.indexOf('js/guia.js') < html.indexOf('js/exercises.js'));
  assert.ok(read('sw.js').includes("'js/guia.js'"));
});

test('colores: el fondo claro de los juegos ya no es amarillento y el amarillo de relleno se distingue de él', () => {
  const L = PALETTES.light, D = PALETTES.dark;
  for (const k of ['bg', 'halo', 'card']) assert.ok(!yellowish(L[k]), `${k} claro (${L[k]}) no es crema`);
  const [r, , b] = rgb(L.bg);
  assert.ok(b > r, 'el papel claro tira a azul: el amarillo resalta');
  assert.ok(read('css/styles.css').toLowerCase().includes(`--play-bg: ${L.bg.toLowerCase()}`), 'el marco del juego usa el mismo fondo');
  for (const P of [L, D]) {
    // Los rellenos vivos no se confunden entre sí ni con el fondo.
    const fills = ['sun', 'coral', 'mint', 'sky'];
    for (const a of fills) {
      const d = Math.hypot(...rgb(P[a]).map((v, i) => v - rgb(P.bg)[i]));
      assert.ok(d > 110, `${a} se distingue del fondo (${Math.round(d)})`);
      for (const c of fills) if (a < c) assert.ok(Math.hypot(...rgb(P[a]).map((v, i) => v - rgb(P[c])[i])) > 90, `${a} y ${c}`);
    }
    // Lo que se usa para letras se lee sobre el fondo y sobre la tarjeta.
    for (const k of ['ink', 'mute', 'N', 'Z', 'Q', 'I', 'R', 'ok', 'bad']) for (const on of ['bg', 'card']) assert.ok(ratio(P[k], P[on]) >= 3, `${k} sobre ${on}: ${ratio(P[k], P[on]).toFixed(2)}`);
  }
});

test('ningún juego escribe texto con el amarillo de relleno ni con blanco fijo', () => {
  const dir = path.join(ROOT, 'js/games');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'kit.js')) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    // p.fill(C.sun) seguido de texto antes de cualquier figura: el amarillo de relleno no se lee en el tema claro.
    for (const m of s.matchAll(/p\.fill\(C\.sun\)([\s\S]*?)(?=p\.fill\(|$)/g)) {
      const draw = m[1].search(/p\.(rect|circle|ellipse|triangle|arc|quad|beginShape|line|point)\(|drawTile\(|drawPill\(/), txt = m[1].search(/p\.text\(|fitText\(/);
      assert.ok(!(txt >= 0 && (draw < 0 || txt < draw)), `${f}: texto con C.sun (usar C.N)`);
    }
    assert.ok(!/p\.fill\(k === 0 \? C\.sun/.test(s), `${f}: rótulo del cero con C.sun`);
  }
});
