// Capturas reales de la app para el video de bienvenida (video-shotcraft, etapa 4): texturas a 3x + recortes de
// elementos + public/tex/layout.json con las cajas en px CSS (celular 390 × 844). Uso: app servida en
// http://localhost:5191 → node tools/capture.mjs
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(path.join(process.env.LIB || path.join(process.env.USERPROFILE || process.env.HOME, 'lemo-opuscar'), 'package.json'));
const { chromium } = require('playwright-core');

const BASE = process.env.BASE || 'http://localhost:5191/';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'tex');
fs.mkdirSync(OUT, { recursive: true });
const D0 = new Date(), today = `${D0.getFullYear()}-${String(D0.getMonth() + 1).padStart(2, '0')}-${String(D0.getDate()).padStart(2, '0')}`;
const NEW = { name: 'Estudiante', xp: 0, course: 'algebra', streak: 0, lastDay: null, hearts: 5, heartsAt: Date.now(), done: {}, tourDone: true,
  guideAuto: false, theme: 'dark', unlockAll: true, sfx: false };
const wait = ms => new Promise(r => setTimeout(r, ms));
const layout = fs.existsSync(path.join(OUT, 'layout.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'layout.json'), 'utf8')) : {};
const browser = await chromium.launch();
async function page(state, h = 844) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: h }, deviceScaleFactor: 3, colorScheme: 'dark', serviceWorkers: 'block' });
  await ctx.addInitScript(s => { localStorage.setItem('zuka-v1', s); }, JSON.stringify({ ...state, heartsAt: Date.now() }));
  const p = await ctx.newPage();
  await p.goto(BASE + '?cap=' + Date.now(), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await wait(1200);
  return p;
}
const box = (p, sel) => p.evaluate(s => { const e = typeof s === 'string' ? document.querySelector(s) : null; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, sel);
const shot = async (p, name) => { await p.screenshot({ path: path.join(OUT, name + '.png') }); console.log('·', name); };

// recorrido: paso 1 (la tarjeta de bienvenida) y paso 3 (el camino de mundos)
{
  const p = await page({ ...NEW, tourDone: false });
  await wait(1500); await shot(p, 'tour-1'); layout['tour-1'] = { tip: await box(p, '.tour-tip') };
  await p.click('.tour-tip [data-next]'); await wait(1200); await p.click('.tour-tip [data-next]'); await wait(1500);
  await shot(p, 'tour-3'); layout['tour-3'] = { tip: await box(p, '.tour-tip'), hole: await box(p, '.tour-hole') };
  await p.context().close();
}
// el arte de los diez mundos (recortes del mapa) y sus nombres
{
  const p = await page(NEW);
  const n = await p.evaluate(() => document.querySelectorAll('.wnode').length);
  layout.worlds = [];
  for (let i = 0; i < n; i++) {
    const h = await p.$(`.wnode[data-world="${i}"]`); await h.scrollIntoViewIfNeeded(); await wait(250);
    await h.screenshot({ path: path.join(OUT, `world-${i}.png`), omitBackground: true });
    layout.worlds.push(await p.evaluate(i => { const w = document.querySelectorAll('.wnode-label')[i]; return { name: w.childNodes[1]?.textContent || w.textContent, sub: w.querySelector('small').textContent }; }, i));
  }
  console.log('· worlds', n);
  await shot(p, 'home');
  await p.context().close();
}
// un mundo completo (página alta) con sus cajas
{
  const p = await page(NEW, 844);
  await p.evaluate(() => { openWorld = { course: 'algebra', i: 0 }; renderLearn(); });
  await wait(800);
  const H = await p.evaluate(() => { const v = document.querySelector('#view'); return v.scrollHeight + (document.querySelector('header, .topbar')?.offsetHeight || 0) + 90; });
  await p.setViewportSize({ width: 390, height: Math.max(844, Math.ceil(H)) }); await wait(900);
  await p.evaluate(() => { document.querySelector('#view').scrollTop = 0; }); await wait(500);
  await shot(p, 'world-page');
  layout['world-page'] = { h: Math.max(844, Math.ceil(H)), card: await box(p, '.world-card'), boss: await box(p, '.node.boss'), exam: await box(p, '.node.exam'),
    summary: await box(p, '.world-summary'), first: await box(p, '.path .node'),
    nodes: await p.evaluate(() => [...document.querySelectorAll('.path .node')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })) };
  await p.context().close();
}
// la pista en el juego de Venn de la Pradera
{
  const p = await page(NEW);
  await p.evaluate(() => { const l = findLesson('alg-0c').l; startLesson(courseById('algebra'), { ...l, clip: { scenes: l.clip.scenes }, ex: [l.ex[2]], more: [] }); });
  await wait(900); await p.click('.clip-skip').catch(() => {}); await wait(2600);
  await shot(p, 'juego-venn');
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /pista/i.test(b.textContent))?.click()); await wait(1000);
  await shot(p, 'pista');
  layout.pista = { hint: await p.evaluate(() => { const e = [...document.querySelectorAll('div, p, section')].filter(e => /Piensa en cada zona/.test(e.textContent)).sort((a, b) => a.textContent.length - b.textContent.length)[0]; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }),
    canvas: await box(p, '.play canvas') };
  await p.context().close();
}
// clips: cuatro curiosidades distintas
{
  const p = await page(NEW);
  await p.evaluate(() => go('clips')); await wait(5000); await shot(p, 'clip-0');
  const ids = ['cur-distancias', 'cur-abejas', 'cur-pi'];
  for (let i = 0; i < ids.length; i++) {
    await p.evaluate(id => document.querySelector(`.feed-item[data-id="${id}"]`)?.scrollIntoView({ behavior: 'instant' }), ids[i]); await wait(8000);
    await shot(p, 'clip-' + (i + 1));
  }
  await p.context().close();
}
fs.writeFileSync(path.join(OUT, 'layout.json'), JSON.stringify(layout, null, 1));
await browser.close();
