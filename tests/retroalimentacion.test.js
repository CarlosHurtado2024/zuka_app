// Al fallar, la retroalimentación dice claramente «Incorrecto» y luego muestra la solución con su
// etiqueta; con la retroalimentación abierta el ejercicio se puede desplazar hasta verse completo.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./load');

const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const check = app.slice(app.indexOf('function check(ex, item)'), app.indexOf('function finish()'));

test('al fallar, el título es «Incorrecto», no «Respuesta correcta»', () => {
  assert.ok(!/<h4>[^<]*'Respuesta correcta:'/.test(check), 'el título rojo no puede decir «Respuesta correcta»');
  assert.match(check, /'Incorrecto'/);
  assert.match(check, /class="fb-label">La respuesta correcta es:/);
});

test('con la retroalimentación abierta, el cuerpo de la lección deja espacio para verla entera', () => {
  assert.match(check, /body\.style\.paddingBottom\s*=/);
  const reset = app.slice(app.indexOf('function reset()'), app.indexOf('function showClip'));
  assert.match(reset, /body\.style\.paddingBottom\s*=\s*''/);
});
