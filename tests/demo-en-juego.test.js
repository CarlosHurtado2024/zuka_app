// Demostración sobre el juego (spec 2026-11-18-demo-en-juego): la explicación de cómo se juega no sale en una ventana
// emergente sino encima del lienzo: una mano hace el gesto en el lugar real (de dónde se agarra y a dónde se lleva) con
// un rótulo corto, hasta que el estudiante toca. «Cómo se juega» la repite.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const ctx = loadScripts(['js/games/kit.js', 'js/games/formula.js', 'js/games/globo-lastre.js', 'js/games/voltea-flecha.js', 'js/games/capas-operacion.js', 'js/games/limonada.js', 'js/games/ascensor.js']);
const GAMES = get(ctx, 'GAMES'), demoPose = get(ctx, 'demoPose');

test('demoPose: la mano aparece, presiona, viaja de un punto al otro, suelta y se va', () => {
  const a = { x: 10, y: 100 }, b = { x: 210, y: 20 };
  const at = u => demoPose(u, a, b);
  assert.ok(at(0).alpha < 0.05 && at(0.1).alpha > 0.5, 'entra');
  assert.equal(at(0.05).down, false);
  assert.equal(at(0.2).down, true); assert.deepEqual([at(0.2).x, at(0.2).y], [10, 100], 'presiona en el origen');
  const mid = at(0.5); assert.ok(mid.down && mid.x > 60 && mid.x < 160 && mid.y < 100 && mid.y > 20, 'viaja presionada');
  assert.deepEqual([at(0.8).x, at(0.8).y], [210, 20], 'llega al destino');
  assert.equal(at(0.9).down, false); assert.ok(at(0.99).alpha < 0.2, 'suelta y sale');
  // Un toque (sin destino) se queda en su sitio.
  const tap = demoPose(0.5, a, null); assert.deepEqual([tap.x, tap.y], [10, 100]);
});

test('los juegos del Preuniversitario traen su demostración y los armazones la dibujan hasta el primer toque', () => {
  for (const g of ['globo-lastre', 'voltea-flecha', 'capas-operacion']) {
    assert.equal(GAMES[g].demo, true, `${g}: se explica sobre el juego`);
    assert.match(read(`js/games/${g}.js`), /\n    demo\(G\) \{|\n    demo: G =>/, `${g}: define el gesto`);
  }
  assert.ok(GAMES.limonada.demo, 'la jarra muestra el gesto sobre el ingrediente');
  assert.ok(!GAMES.ascensor.demo, 'los juegos antiguos sin demostración conservan su guía');
  const kit = read('js/games/kit.js');
  assert.match(kit, /function drawDemo\(p, C, t, d\)/);
  assert.match(kit, /function drawHand\(p, C, x, y, down, alpha\)/);
  assert.ok((kit.match(/def\.demo\(G\)/g) || []).length >= 2, 'roundsGame y questGame');
  assert.ok((kit.match(/demo\(\) \{/g) || []).length >= 2, 'los dos devuelven demo() para repetirla');
  assert.match(kit, /reducedMotion\(\)/);
});

test('con demostración no sale la ventana emergente, y «Cómo se juega» la repite sobre el juego', () => {
  const guia = read('js/guia.js'), ex = read('js/exercises.js');
  assert.match(guia, /function guideWanted\(ex\) \{[\s\S]{0,200}GAMES\[ex\.game\]\?\.demo\) return false/);
  assert.match(ex, /demo: \(\) => inst\?\.demo\?\.\(\)/);
  assert.match(ex, /const replay = GAMES\[ex\.game\]\?\.demo \? h\.demo : undefined/);
  assert.match(ex, /closePractice = mountPracticeGuide\(/);
  assert.match(guia, /host\.prepend\(note\)/);
  assert.match(guia, /replay\?\.\(\)/);
});
