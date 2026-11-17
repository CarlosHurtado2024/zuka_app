// Video de bienvenida al curso de Álgebra (video/valle-zoom/films/intro.js): narración a ritmo legible, capturas presentes
// y final que cierra la idea del principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'video', 'valle-zoom');
const src = fs.readFileSync(path.join(DIR, 'films', 'intro.js'), 'utf8');
const NARR = eval(src.match(/FILM\.NARR = (\[[\s\S]*?\n\]);/)[1]);

test('la narración va a menos de 3.2 palabras por segundo', () => {
  for (const [a, b, s] of NARR) assert.ok(b - a >= 1.8 && s.split(/\s+/).length / (b - a) <= 3.25, `${a}: ${s}`);
});

test('todas las capturas que usa el video existen', () => {
  const names = [...src.matchAll(/'((?:juego|tour|mundo|pdf|leccion|clips|home|jefe|evaluacion|pista)[\w-]*)'/g)].map(m => m[1]);
  assert.ok(names.length > 20);
  for (const n of new Set(names)) assert.ok(fs.existsSync(path.join(DIR, 'shots', 'intro', n + '.jpg')), n);
});

test('muestra lo que pidió el usuario: mundos, ejercicios, clips, juegos, recorrido y PDF', () => {
  const all = NARR.map(l => l[2]).join(' ').toLowerCase();
  for (const w of ['mundos', 'ejercicios', 'clips', 'juegos', 'recorrido', 'pdf']) assert.ok(all.includes(w), w);
});

test('el final cierra la idea del principio', () => {
  assert.match(NARR[0][2], /lista de fórmulas/);
  assert.match(NARR.at(-2)[2] + ' ' + NARR.at(-1)[2], /lista de fórmulas[\s\S]*diez mundos/);
});
