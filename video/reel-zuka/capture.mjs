// Capturas reales de Zuka para el reel (tema oscuro, teléfono de 390×844 a 3×). Se puede volver a correr.
//   node video/reel-zuka/capture.mjs        (con la app servida en http://localhost:5199)
// Datos: estado local de demostración (racha, XP y nombre inventados); nada personal ni en vivo.
import { createRequire } from 'node:module';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = process.env.LIB || path.join(os.homedir(), 'lemo-opuscar');
const { chromium } = createRequire(path.join(LIB, 'package.json'))('playwright-core');
const BASE = process.env.BASE || 'http://localhost:5199/';
const OUT = path.join(HERE, 'public', 'textures'); fs.mkdirSync(OUT, { recursive: true });
const GAMES = [['algebra', 'alg-4a', 1], ['trig', 'trig-41b', 0], ['algebra', 'alg-0c', 2], ['trig', 'trig-43b', 0], ['algebra', 'alg-12f', 3], ['trig', 'trig-151', 0], ['trig', 'trig-41a', 0], ['algebra', 'alg-73', 0]];

const browser = await chromium.launch({ channel: 'chromium-headless-shell' }).catch(() => chromium.launch());
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: 'dark', serviceWorkers: 'block' });
const page = await ctx.newPage();
const layout = {};
const seed = today => ({ name: 'Vale', xp: 1280, streak: 7, lastDay: today, hearts: 5, tourDone: true, theme: 'dark', videoMuted: true, hideInstall: true,
  today: { day: today, xp: 20 }, correct: 86, answered: 97, done: { 'alg-0a': 1, 'alg-0b': 1, 'alg-0c': 1, 'alg-11': 1, 'alg-11b': 1 } });
const open = async () => {
  await page.goto(BASE + '?reel=1', { waitUntil: 'networkidle' });
  await page.evaluate(s => { const t = typeof today === 'function' ? today() : null; Object.assign(S, s, { lastDay: t, today: { day: t, xp: 20 } }); save(); }, seed(null));
  await page.reload({ waitUntil: 'networkidle' });               // con el estado guardado: sin recorrido de bienvenida
  await page.evaluate(() => { document.querySelectorAll('.tour').forEach(e => e.remove()); applyTheme(); go('learn'); });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(700);
};
const shot = async (name, opts = {}) => { await page.screenshot({ path: path.join(OUT, name + '.png'), ...opts }); console.log('ok', name); };

await open();
await shot('map');                                             // el camino de mundos
await page.setViewportSize({ width: 390, height: 1900 }); await page.waitForTimeout(500);
await shot('map-tall');
await page.setViewportSize({ width: 390, height: 844 });
const w = await page.$('.wnode.current') || await page.$('.wnode');
if (w) { await w.click(); await page.waitForTimeout(900); await shot('world');
  await page.setViewportSize({ width: 390, height: 1900 }); await page.waitForTimeout(500); await page.evaluate(() => { document.querySelector('#view').scrollTop = 0; }); await page.waitForTimeout(300); await shot('world-tall');
  await page.setViewportSize({ width: 390, height: 844 }); }

for (const [course, id, i] of GAMES) {                         // cada juego, recién abierto
  await open();
  const game = await page.evaluate(([course, id, i]) => { const { c, l } = findLesson(id); const ex = l.ex[i];
    startLesson(c, { ...l, clip: { scenes: l.clip.scenes }, ex: [ex], more: [] }); return ex.game; }, [course, id, i]);
  await page.waitForTimeout(500); await page.click('.clip-skip').catch(() => {});
  await page.waitForSelector('.play canvas', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1600);
  await shot('game-' + game);
  const box = await page.$eval('.play canvas', e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }).catch(() => null);
  layout['game-' + game] = box;
}

await open();                                                  // perfil: racha, XP, progreso
await page.evaluate(() => go('profile')); await page.waitForTimeout(700); await shot('profile');
layout.stats = await page.$$eval('.stat', els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, text: e.innerText.replace(/\n/g, ' ') }; }));

// Clips: el feed con cada clip ya avanzado. Se quita el contador de «me gusta»: en la app es un número de adorno
// y en un anuncio se leería como popularidad real.
for (const [topic, name, wait] of [['mate', 'clips-playing', 9000], ['ciencia', 'clips-abejas', 9000]]) {
  await open();
  await page.evaluate(() => go('clips'));
  await page.waitForSelector('.chip', { timeout: 8000 }).catch(() => {});
  await page.click(`.chip[data-f="${topic}"]`).catch(() => {});
  await page.waitForSelector('.feed-item video', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(wait);
  await page.evaluate(() => document.querySelectorAll('.rail-btn.like small').forEach(e => { e.textContent = ''; }));
  await shot(name);
}

fs.writeFileSync(path.join(OUT, 'layout.json'), JSON.stringify(layout, null, 1));
await browser.close();
console.log('listo');
