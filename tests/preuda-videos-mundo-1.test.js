// Preuniversitario UdeA · razonamiento lógico, mundo 1 (Cálculo mental): videos de las lecciones pu-cm-1 a pu-cm-4
// (spec 2026-11-19-preuda-videos-mundo-1). Proyecto video/preuda-cosmos, películas enteros, fracciones, porcentajes y potencias:
// 4 a 5 minutos, diez escenas, un reto que se plantea al inicio y se resuelve al final, y al menos otro problema en medio
// (tomados de exámenes y talleres reales, pero en el video solo aparece el enunciado: sin decir de dónde salen).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const dir = 'video/preuda-cosmos';
const html = read('index.html');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia/.test(f));
const ctx = loadScripts(all);
const C = get(ctx, 'COURSES').find(c => c.id === 'preuda');
const lesson = id => C.units.flatMap(u => u.lessons).find(l => l.id === id);
const FILMS = { enteros: 'pu-cm-1', fracciones: 'pu-cm-2', porcentajes: 'pu-cm-3', potencias: 'pu-cm-4' };

for (const [name, id] of Object.entries(FILMS)) {
  test(`${name}: película de la lección ${id}, de 4 a 5 minutos, con el formato del curso`, () => {
    const D = require(`../${dir}/films/${name}.data.js`), film = read(`${dir}/films/${name}.js`);
    assert.equal(D.LESSON, id);
    assert.ok(lesson(id), id);
    assert.ok(D.DUR >= 240 && D.DUR <= 300, String(D.DUR));
    assert.equal(D.SCENES.length, 10);
    assert.equal(D.SCENES[0].id, 'reto'); assert.equal(D.SCENES.at(-1).id, 'cierre');
    for (const s of D.SCENES) {
      assert.ok(film.includes(`\n  ${s.id}(t) {`), `falta la escena ${s.id}`);
      s.caps.forEach(([a, b, title, sub], i) => {
        assert.ok(a >= 0.5 && b <= s.dur - 0.4 && b - a >= 5 && title.length <= 36 && sub.length <= 58, `${s.id}: ${title}`);
        if (i) assert.ok(a >= s.caps[i - 1][1] + 0.3);
      });
      for (const [a, b, txt] of s.narr) assert.ok(txt.split(/\s+/).length / (b - a) <= 3.4, `${s.id}: ${txt.slice(0, 40)}`);
    }
    const txt = D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]).join(' ');
    assert.ok(!/[¿?]/.test(txt), 'sin preguntas al espectador');
    assert.doesNotThrow(() => new (require('vm').Script)(film));
    // Preguntas reales: el reto y al menos otra, con su tarjeta de examen.
    assert.ok((film.match(/examCard\(t,/g) || []).length >= 2, 'dos preguntas reales con tarjeta');
    // Pedido del usuario (2026-11-19): los enunciados aparecen solos, sin decir que son del examen de admisión ni del taller.
    const names = D.SCENES.map(s => s.name).join(' ');
    assert.ok(!/examen|taller|admisi|universidad|udea|pregunta real/i.test(txt + ' ' + names), `${name}: menciona el examen o el taller`);
    assert.ok(!/UdeA|year:/.test(film.replace(/\/\/.*$/gm, '')), `${name}: la tarjeta no lleva año ni UdeA`);
    assert.match(film, /examCard\(t, \{ tag: 'RETO'/);
    // Las escenas de respaldo de la lección cuentan el video.
    const L = lesson(id);
    assert.ok(L.clip.scenes.length >= 8);
    assert.ok(L.clip.scenes.every(sc => !/examen|taller|UdeA|admisi/i.test(sc.text + ' ' + (sc.title || ''))), `${id}: respaldo sin examen ni taller`);
  });
}

test('el HUD sigue sin reloj ni barra de avance abajo', () => {
  const kit = read(`${dir}/kit.js`), hud = kit.slice(kit.indexOf('function hud('), kit.indexOf('function caption('));
  assert.ok(!/t = '|toFixed\(2\)|fillRect\(70, 17/.test(hud));
});

test('la matemática de los videos', () => {
  // Enteros: tres resultados (UdeA 2023-2) y los días (UdeA 2024-1).
  const ok = [];
  for (let r = 0; r <= 100; r++) { const d = [33, 37, 49].map(v => Math.abs(r - v)); if ([...d].sort((a, b) => a - b).join() === '5,7,9') ok.push([r, d.join()]); }
  assert.deepEqual(ok, [[42, '9,5,7']]);
  const cand = [5, 7, 9].flatMap(d => [33 - d, 33 + d]).sort((a, b) => a - b); assert.equal(cand.join(), '24,26,28,38,40,42');
  assert.equal(2 - (-1), 3); assert.equal((3 + 3) % 7, 6);   // hoy = 0 (lunes) → el día 6 es domingo
  assert.equal(5 - (-3), 8); assert.ok(Math.abs(6 - 10) === 4 && Math.abs(14 - 10) === 4);
  // Fracciones: las tortas (UdeA 2024-2) y el grupo (UdeA 2023-2).
  const restoTortas = 1 / (3 / 5); assert.ok(Math.abs(restoTortas + 1 / 3 - 2) < 1e-9);
  assert.ok(4 * 9 > 5 * 7 && 4 / 7 > 5 / 9 && 35 / 7 * 2 === 10 && Math.abs(1 / 4 + 1 / 6 - 5 / 12) < 1e-12);
  assert.ok(120000 * (2 / 3) * (3 / 4) === 60000);
  const grupo = n => { for (let g = 1; g < n; g++) { const b = n - g; if (7 * (g - 1) === n - 1 && 5 * g === n - 2) return [g, b]; } return null; };
  assert.deepEqual(grupo(22), [4, 18]); for (const n of [57, 36, 71]) assert.equal(grupo(n), null);
  // Porcentajes: los tenis (UdeA 2025-2), el chocolate (UdeA 2026-1), 1/13 (taller) y descuentos sucesivos.
  assert.equal(Math.round(120000 * 0.9 * 1.1), 118800);
  assert.equal(70 / ((100 - 40 - 25) / 100), 200);
  const dig = Array.from({ length: 2019 }, (_, i) => '076923'[i % 6]).reduce((a, d) => a + +d, 0); assert.equal(dig, 9085);
  assert.equal((1 / 13).toFixed(6), '0.076923');
  assert.equal(Math.round((1 - 0.85 * 0.8) * 100), 32);
  assert.ok(3 / 8 === 0.375 && 80000 * 0.15 === 12000 && 250000 * 0.8 === 200000 && Math.round(250000 * 1.2) === 300000);
  // Potencias: María (UdeA 2024-2), las cartas (UdeA 2025-2), el círculo (UdeA 2026-1) y 2^2019 mod 7 (taller).
  const sumaCifras = s => [...s].reduce((a, d) => a + +d, 0);
  assert.equal(sumaCifras(String(10n ** 5n - 51n)), 40); assert.equal(sumaCifras(String(10n ** 10n - 51n)), 85);
  assert.equal(String(10n ** 10n - 51n), '9999999949');
  const cartas = [1, 2, 4, 8, 16, 32]; let manos = 0;
  for (let m = 0; m < 64; m++) { const ana = cartas.filter((_, i) => m >> i & 1), s = ana.reduce((a, b) => a + b, 0); if (s - (63 - s) === 7) { manos++; assert.equal(ana.length, 3); } }
  assert.equal(manos, 1);
  assert.ok(Math.abs(1.2 ** 2 - 1.44) < 1e-12);
  let r = 1; for (let i = 0; i < 2019; i++) r = r * 2 % 7; assert.equal(r, 1);
  assert.equal(String(2n ** 2019n).length, 608);
  assert.ok(5 ** 3 === 125 && 13 ** 2 === 169 && 10000 - 37 === 9963 && 2 ** 7 === 128 && 2 ** 6 === 64);
  assert.ok(Math.abs(Math.sqrt(72) - 6 * Math.sqrt(2)) < 1e-12 && Math.sqrt(72) > 8 && Math.sqrt(72) < 9);
});

test('los ejemplos de los videos no salen en los ejercicios de su lección', () => {
  const ex = id => JSON.stringify(lesson(id).ex);
  for (const s of ['4/7', '2/7', '18/24', '1/13']) assert.ok(!ex('pu-cm-2').includes(s), s);
  for (const s of ['80000', '250000', '120000', '1/13']) assert.ok(!ex('pu-cm-3').includes(s), s);
  for (const s of ['72', '125', '169', '2019']) assert.ok(!ex('pu-cm-4').includes(`"${s}"`) && !ex('pu-cm-4').includes(`:${s},`), s);
});
