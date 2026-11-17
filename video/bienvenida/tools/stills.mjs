// Cuadros de control (QA): empaqueta una vez y saca varios cuadros de una o varias composiciones.
// Uso: node tools/stills.mjs <composición>:<cuadro>[,<cuadro>…] [<composición>:…] → out/qa/<composición>-<cuadro>.png
import path from 'path';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
for (const arg of process.argv.slice(2)) {
  const [id, list] = arg.split(':');
  const composition = await selectComposition({ serveUrl, id });
  for (const fr of list.split(',')) {
    const out = path.join(root, 'out', 'qa', `${id}-${fr}.png`);
    await renderStill({ serveUrl, composition, frame: +fr, output: out, imageFormat: 'png' });
    console.log('·', path.basename(out));
  }
}
