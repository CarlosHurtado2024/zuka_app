// El juego de Venn en acción: pista abierta → zona B − A pintada → «Comprobar» → acierto. App en http://localhost:5191.
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(path.join(process.env.LIB || path.join(process.env.USERPROFILE || process.env.HOME, 'lemo-opuscar'), 'package.json'));
const { chromium } = require('playwright-core');
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'tex');
const wait = ms => new Promise(r => setTimeout(r, ms));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, colorScheme: 'dark', serviceWorkers: 'block', hasTouch: false });
await ctx.addInitScript(s => localStorage.setItem('zuka-v1', s), JSON.stringify({ name: 'Estudiante', course: 'algebra', done: {}, tourDone: true, guideAuto: false, theme: 'dark', unlockAll: true, sfx: false, hearts: 5, heartsAt: Date.now() }));
const p = await ctx.newPage();
await p.goto('http://localhost:5191/?j=' + Date.now(), { waitUntil: 'networkidle' }); await wait(1200);
await p.evaluate(() => { const l = findLesson('alg-0c').l; startLesson(courseById('algebra'), { ...l, clip: { scenes: l.clip.scenes }, ex: [l.ex[2]], more: [] }); });
await wait(900); await p.click('.clip-skip').catch(() => {}); await wait(2600);
await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /pista/i.test(b.textContent))?.click()); await wait(1000);
const c = await p.evaluate(() => { const r = document.querySelector('.play canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
const fx = +(process.env.FX || 0.8), fy = +(process.env.FY || 0.6);
await p.mouse.click(c.x + c.w * fx, c.y + c.h * fy); await wait(900);
await p.screenshot({ path: path.join(OUT, 'pista-pintada.png') }); console.log('· pintada', fx, fy);
// las otras tres rondas (pestañas arriba del lienzo): (A ∪ B)ᶜ = afuera; A △ B = las dos lunas; Bᶜ = luna de A + afuera
const at = (x, y) => p.mouse.click(c.x + c.w * x, c.y + c.h * y);
const TAB = [0.1, 0.26, 0.41, 0.56], TY = 0.045, ONLY_A = [0.22, 0.6], ONLY_B = [0.8, 0.6], FUERA = [0.9, 0.33];
const plan = [[FUERA], [ONLY_A, ONLY_B], [ONLY_A, FUERA]];
for (let r = 0; r < 3; r++) { await at(TAB[r + 1], TY); await wait(500); for (const z of plan[r]) { await at(...z); await wait(400); } }
await at(TAB[0], TY); await wait(600);
await p.screenshot({ path: path.join(OUT, 'pista-lista.png') }); console.log('· lista');
await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /comprobar/i.test(b.textContent))?.click()); await wait(700);
await p.screenshot({ path: path.join(OUT, 'pista-acierto.png') }); console.log('· acierto');
await browser.close();
