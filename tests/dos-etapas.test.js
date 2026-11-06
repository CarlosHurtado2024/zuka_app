const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/dos-etapas.js')['dos-etapas'];
const params = { changes: [30, -20], output: 8840, max: 20000, step: 20 };

test('entrada 8.500 → correcto', () => {
  assert.equal(grade({ input: 8500 }, params).ok, true);
});

test('entrada 8.520 → incorrecto y la solución da 8 500', () => {
  const r = grade({ input: 8520 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('8\\,500'));
});

test('sin entrada → incorrecto', () => {
  assert.equal(grade({ input: null }, params).ok, false);
});

// Giro de la perilla: el salto entre dos ángulos consecutivos es siempre el camino corto, aunque
// atan2 salte de 170° a −170° (ahí el giro real es +20°, no −340°).
const { turnDelta } = loadGame('js/games/dos-etapas.js')['dos-etapas'];
const deg = d => (d * Math.PI) / 180;

test('turnDelta cruza el borde de atan2 en el sentido corto', () => {
  assert.ok(Math.abs(turnDelta(deg(170), deg(-170)) - deg(20)) < 1e-9);
  assert.ok(Math.abs(turnDelta(deg(-170), deg(170)) + deg(20)) < 1e-9);
  assert.ok(Math.abs(turnDelta(deg(10), deg(28)) - deg(18)) < 1e-9);
});

test('la solución usa punto decimal', () => {
  const s = grade({ input: 8520 }, params).solution;
  assert.ok(s.includes('1.04') && !s.includes('{,}'));
});
