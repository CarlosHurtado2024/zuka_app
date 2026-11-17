// Render completo por la API, en tramos (cada tramo se reintenta si una pestaña se traba) y luego se une con ffmpeg.
// La música se mezcla aparte (entra en 0.8 s, sale en los últimos 1.6 s), así la versión sin música sale del mismo video.
// Uso: node tools/render.mjs   → out/bienvenida.mp4 (con música) y out/bienvenida-sin-musica.mp4
import path from 'path';
import fs from 'fs';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FF = process.env.FFMPEG || 'ffmpeg';
const tmp = path.join(root, 'out', 'tramos');
fs.mkdirSync(tmp, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const inputProps = { bgm: false };
const composition = await selectComposition({ serveUrl, id: 'Bienvenida', inputProps });
const N = composition.durationInFrames, STEP = 270;
const parts = [];
for (let a = 0; a < N; a += STEP) {
  const b = Math.min(N - 1, a + STEP - 1), file = path.join(tmp, `t${String(a).padStart(5, '0')}.mp4`);
  parts.push(file);
  if (fs.existsSync(file)) { console.log('ya está', a, b); continue; }
  for (let k = 1; k <= 4; k++) {
    try {
      await renderMedia({ serveUrl, composition, inputProps, codec: 'h264', muted: true, outputLocation: file + '.part.mp4', frameRange: [a, b], concurrency: 2, timeoutInMilliseconds: 90000, crf: 16 });
      fs.renameSync(file + '.part.mp4', file); console.log('tramo', a, b); break;
    } catch (e) { console.log('reintento', a, b, k, String(e.message || e).slice(0, 120)); if (k === 4) throw e; }
  }
}
fs.writeFileSync(path.join(tmp, 'lista.txt'), parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const silent = path.join(root, 'out', 'bienvenida-sin-musica.mp4');
execFileSync(FF, ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'lista.txt'), '-c', 'copy', '-movflags', '+faststart', silent]);
const dur = N / 30;
execFileSync(FF, ['-v', 'error', '-y', '-i', silent, '-i', path.join(root, 'public', 'audio', 'bgm.mp3'),
  '-filter_complex', `[1:a]atrim=0:${dur},asetpts=N/SR/TB,volume=0.55,afade=t=in:st=0:d=0.8,afade=t=out:st=${(dur - 1.6).toFixed(2)}:d=1.6[a]`,
  '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(root, 'out', 'bienvenida.mp4')]);
console.log('listo');
