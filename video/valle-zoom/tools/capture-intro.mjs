// Capturas reales de la app para el video de bienvenida de Álgebra (films/intro.js).
// Uso: (servidor de la app en http://localhost:5191) node tools/capture-intro.mjs → shots/intro/*.jpg
// Celular 390 × 844 a 3x, tema oscuro, datos de ejemplo (ningún dato real: la app no tiene cuentas).
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(path.join(process.env.LIB || path.join(process.env.HOME || process.env.USERPROFILE, 'lemo-opuscar'), 'package.json'));
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://localhost:5191/';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'shots', 'intro');
fs.mkdirSync(OUT, { recursive: true });
const D0 = new Date(), today = `${D0.getFullYear()}-${String(D0.getMonth() + 1).padStart(2, '0')}-${String(D0.getDate()).padStart(2, '0')}`;
const STATE = (extra = {}) => ({
  name: 'Estudiante', xp: 340, course: 'algebra', streak: 5, maxStreak: 9, lastDay: today, hearts: 5, heartsAt: Date.now(),
  today: { day: today, xp: 20 }, done: { 'alg-0a': true, 'alg-0b': true }, tourDone: true, guideAuto: false, theme: 'dark',
  unlockAll: true, sfx: false, ...extra,
});
const wait = ms => new Promise(r => setTimeout(r, ms));
const ONLY = (process.env.ONLY || 'tour,home,juegos,clips').split(',');

const browser = await chromium.launch();
async function page(state) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, colorScheme: 'dark', serviceWorkers: 'block' });
  await ctx.addInitScript(s => { localStorage.setItem('zuka-v1', s); }, JSON.stringify(state));
  const p = await ctx.newPage();
  await p.goto(BASE + '?intro=' + Date.now(), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await wait(1200);
  return p;
}
const shot = async (p, name) => { await p.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 86 }); console.log('·', name); };

// 1. Recorrido guiado (primera vez, sin progreso)
if (ONLY.includes('tour')) {
  const p = await page(STATE({ tourDone: false, done: {}, xp: 0, streak: 0, lastDay: null }));
  await wait(1500); await shot(p, 'tour-1');
  for (const n of [2, 3, 4, 5]) { await p.click('.tour-tip [data-next]'); await wait(1300); await shot(p, 'tour-' + n); }
  await p.context().close();
}
// 2. Inicio, mapa de mundos, un mundo, el resumen en PDF, jefe y evaluación
if (ONLY.includes('home')) {
  // un estudiante que empieza: sin progreso
  const p = await page(STATE({ xp: 0, done: {}, streak: 0, lastDay: null, today: { day: null, xp: 0 } }));
  await shot(p, 'home');
  await p.evaluate(() => { const v = document.querySelector('#view'); v.scrollTop = v.querySelector('.world-map').offsetTop - 120; }); await wait(700); await shot(p, 'mundos-1');
  await p.evaluate(() => { const v = document.querySelector('#view'); v.scrollTop += 640; }); await wait(700); await shot(p, 'mundos-2');
  await p.evaluate(() => { const v = document.querySelector('#view'); v.scrollTop += 640; }); await wait(700); await shot(p, 'mundos-3');
  await p.evaluate(() => { const v = document.querySelector('#view'); v.scrollTop = v.scrollHeight; }); await wait(700); await shot(p, 'mundos-4');
  await p.evaluate(() => { openWorld = { course: 'algebra', i: 0 }; renderLearn(); document.querySelector('#view').scrollTop = 0; }); await wait(900); await shot(p, 'mundo');
  await p.evaluate(() => { const v = document.querySelector('#view'); v.scrollTop = v.scrollHeight; }); await wait(800); await shot(p, 'mundo-fin');
  await p.evaluate(() => { const c = courseById('algebra'); openBossSheet(c, c.units[0]); }); await wait(900); await shot(p, 'jefe');
  await p.evaluate(() => closeSheet()); await wait(500);
  await p.evaluate(() => { const c = courseById('algebra'); openExamSheet(c, c.units[0]); }); await wait(900); await shot(p, 'evaluacion');
  await p.context().close();
  // unos días después: racha, XP y meta diaria
  const q = await page(STATE());
  await shot(q, 'progreso');
  await q.evaluate(() => openStreakSheet()); await wait(900); await shot(q, 'racha');
  await q.context().close();
}
// 3. Una lección: el video (escenas de respaldo) y sus ejercicios
const GAMES = [['alg-0a', 0], ['alg-0c', 2], ['alg-11', 0], ['alg-12', 1], ['alg-14', 2], ['alg-21a', 1], ['alg-4', 0], ['alg-71', 0], ['alg-25a', 1], ['alg-73', 0]];
if (ONLY.includes('juegos')) {
  const p = await page(STATE());
  await p.evaluate(() => { const c = courseById('algebra'), l = findLesson('alg-0c').l; startLesson(c, { ...l, clip: { scenes: l.clip.scenes }, more: [] }); });
  await wait(3200); await shot(p, 'video');
  for (const [id, i] of GAMES) {
    await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Salir')?.click()).catch(() => {});
    await wait(400);
    await p.evaluate(([id, i]) => { const c = courseById(findLesson(id).c?.id || 'algebra') || courseById('algebra'), l = findLesson(id).l; startLesson(courseById('algebra'), { ...l, clip: { scenes: l.clip.scenes }, ex: [l.ex[i]], more: [] }); }, [id, i]);
    await wait(900); await p.click('.clip-skip').catch(() => {}); await wait(2600);
    await shot(p, `juego-${id}-${i}`);
  }
  // pista abierta en el juego de la Pradera (pinta-venn)
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Salir')?.click()).catch(() => {}); await wait(400);
  await p.evaluate(() => { const l = findLesson('alg-0c').l; startLesson(courseById('algebra'), { ...l, clip: { scenes: l.clip.scenes }, ex: [l.ex[2]], more: [] }); });
  await wait(900); await p.click('.clip-skip').catch(() => {}); await wait(2600);
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /pista/i.test(b.textContent))?.click()); await wait(900); await shot(p, 'pista');
  await p.context().close();
}
// 4. Clips (curiosidades)
if (ONLY.includes('clips')) {
  const p = await page(STATE());
  await p.evaluate(() => go('clips')); await wait(4500); await shot(p, 'clips');
  await p.evaluate(() => document.querySelector('.feed-item[data-id="cur-distancias"]')?.scrollIntoView({ behavior: 'instant' })); await wait(8000); await shot(p, 'clips-2');
  await p.context().close();
}
await browser.close();
