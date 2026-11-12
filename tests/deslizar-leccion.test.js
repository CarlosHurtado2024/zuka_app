// En una lección se pasa del video a los ejercicios deslizando en vertical, como al hacer scroll:
// el dedo sube → lo que sigue; el dedo baja → el video anterior. Ya no se desliza hacia los lados.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const swipe = get(loadScripts(['js/content.js']), 'lessonSwipe');
const clip = (o = {}) => swipe({ dx: 0, dy: -120, ms: 250, clip: true, ...o });
const ex = (o = {}) => swipe({ dx: 0, dy: -120, ms: 250, clip: false, atTop: true, atBottom: true, answered: false, ...o });

test('en el video: deslizar hacia arriba avanza y hacia abajo vuelve al video anterior', () => {
  assert.equal(clip({ dy: -120 }), 'next');
  assert.equal(clip({ dy: 120 }), 'prev');
});

test('un gesto corto, lento o de lado no hace nada', () => {
  assert.equal(clip({ dy: -40 }), null, 'corto');
  assert.equal(clip({ ms: 900 }), null, 'lento');
  assert.equal(clip({ dx: -200, dy: -20 }), null, 'hacia la izquierda ya no avanza');
  assert.equal(clip({ dx: 200, dy: 20 }), null, 'hacia la derecha ya no retrocede');
  assert.equal(clip({ dx: 100, dy: -120 }), null, 'en diagonal');
});

test('en un ejercicio el gesto vertical es primero para desplazar el contenido', () => {
  assert.equal(ex({ dy: 120, atTop: false }), null, 'a medio contenido, bajar el dedo solo desplaza');
  assert.equal(ex({ dy: 120, atTop: true }), 'prev', 'arriba del todo, vuelve al video');
  assert.equal(ex({ dy: -120, answered: false }), null, 'sin responder no avanza (ni regaña)');
  assert.equal(ex({ dy: -120, answered: true, atBottom: false }), null);
  assert.equal(ex({ dy: -120, answered: true, atBottom: true }), 'next', 'respondido y al final, sigue');
});

test('app.js usa el gesto vertical con eventos de toque y el botón señala hacia abajo', () => {
  const app = read('js/app.js'), css = read('css/styles.css');
  assert.match(app, /lessonSwipe\(/);
  assert.match(app, /addEventListener\('touchstart'/);
  assert.match(app, /addEventListener\('touchend'/);
  assert.doesNotMatch(app, /dx < 0 \? next\(\) : prev\(\)/);
  assert.doesNotMatch(app, /Ejercicios →|Al ejercicio →|\} →`/);
  assert.match(app, /Ejercicios ↓/);
  assert.match(app, /ArrowDown/);
  // Sobre el video el navegador no se queda con el gesto (ni recarga la página al tirar hacia abajo).
  assert.match(css, /\.lesson\.clip-mode \{[^}]*touch-action: none/);
  assert.match(css, /\.lesson \{[^}]*overscroll-behavior: contain/);
  assert.match(css, /@keyframes lesson-up/);
});
