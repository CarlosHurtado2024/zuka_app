// Render que aguanta pausas del GPU: guarda cada cuadro en out/frames/NNNNN.jpg, se salta los que ya existen y, si un
// cuadro se cuelga (tiempo de espera), cierra el navegador, lo abre de nuevo y sigue. Luego une los cuadros con ffmpeg.
// uso: node render.mjs <carpeta del clip> [--fps 24] [--q 'ss=2'] [--out out/video.mp4]   (LIB = carpeta de lemo-opuscar)
import fs from 'fs'; import path from 'path'; import { spawnSync } from 'child_process'; import { pathToFileURL } from 'url';
const LIB = process.env.LIB; if (!LIB) { console.error('falta LIB'); process.exit(2); }
const { openDemo, closeServer } = await import(pathToFileURL(path.join(LIB, 'core/render/page.mjs')));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dir = path.resolve(args[0]), FPS = +opt('--fps', 24), Q = opt('--q', ''), out = path.resolve(dir, opt('--out', 'out/video.mp4'));
const fdir = path.join(dir, 'out', 'frames'); fs.mkdirSync(fdir, { recursive: true });
const name = f => path.join(fdir, String(f).padStart(5, '0') + '.jpg');
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error('tiempo de espera')), ms))]);

let total = null, fails = 0, t0 = Date.now();
for (;;) {
  let ses;
  try {
    ses = await openDemo(dir, { w: 1080, h: 1920, q: Q });
    const { page } = ses;
    total ??= Math.round(await page.evaluate(() => window.DUR) * FPS);
    let f = 0; while (f < total && fs.existsSync(name(f))) f++;
    if (f >= total) { await ses.browser.close(); break; }
    for (; f < total; f++) {
      if (fs.existsSync(name(f))) continue;
      await withTimeout(page.evaluate(t => window.render(t), f / FPS), 60000);
      const buf = await withTimeout(page.screenshot({ type: 'jpeg', quality: 95 }), 60000);
      fs.writeFileSync(name(f) + '.tmp', buf); fs.renameSync(name(f) + '.tmp', name(f));
      if (f % 120 === 0) console.log(`${f}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    await ses.browser.close(); break;
  } catch (e) {
    fails++; console.log(`pausa (${String(e.message || e).split('\n')[0]}); reintento ${fails}`);
    try { await ses?.browser.close(); } catch {}
    if (fails > 25) { closeServer(); console.error('demasiados reintentos'); process.exit(1); }
  }
}
closeServer();
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(fdir, '%05d.jpg'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', out], { stdio: 'inherit' });
if (r.status !== 0) process.exit(1);
console.log(`video: ${out} (${total} cuadros, ${fails} reintentos, ${((Date.now() - t0) / 60000).toFixed(1)} min)`);
