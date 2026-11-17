// Marca de Zuka: el cerebro en malla (spec 2026-11-27-interfaz-red).
//   node tools/marca.js         escribe js/marca.js y brand/*.svg
//   node tools/marca.js --png   además dibuja icons/*.png (usa playwright-core de ~/lemo-opuscar)
// Los puntos están medidos sobre el pantallazo de referencia (597 × 595 px): la silueta en el sentido del reloj
// y los nodos de adentro. Las aristas salen de una triangulación de Delaunay recortada a la silueta.
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');

const SHAPES = {
  full: {
    outline: [[183, 96], [260, 73], [367, 113], [447, 161], [477, 253], [464, 332], [412, 390], [398, 447], [329, 465],
      [278, 405], [212, 392], [189, 340], [106, 297], [79, 229], [107, 145]],
    inner: [[154, 152], [241, 137], [298, 182], [360, 193], [427, 205], [225, 228], [153, 253], [285, 278], [349, 274],
      [419, 266], [212, 284], [253, 297], [232, 328], [280, 330], [349, 331], [411, 326], [315, 370], [343, 404],
      [382, 373], [248, 366]],
  },
  // Para tamaños chicos (logo, fichas de 44 a 72 px): menos nodos, la misma silueta.
  simple: {
    outline: [[183, 96], [260, 73], [367, 113], [447, 161], [477, 253], [464, 332], [398, 447], [329, 465], [278, 405],
      [189, 340], [106, 297], [79, 229], [107, 145]],
    inner: [[245, 150], [335, 195], [215, 255], [340, 310]],
  },
};
// El tallo: una esquirla azul hielo bajo el nodo de abajo (278, 405), con un pliegue.
const STEM = [[253, 436], [281, 455], [281, 536], [253, 517]];
const STEM_FOLD = [[253, 472], [281, 506]];
const STEM_ROOT = [278, 405];

// ---- geometría ----
function delaunay(pts) {   // Bowyer–Watson
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), d = Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0) * 10;
  const all = [...pts, [x0 - d, y0 - d], [x0 + 2 * d, y0 - d], [x0, y0 + 2 * d]], n = pts.length;
  const circum = (a, b, c) => {
    const [ax, ay] = all[a], [bx, by] = all[b], [cx, cy] = all[c];
    const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D;
    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D;
    return { x: ux, y: uy, r2: (ax - ux) ** 2 + (ay - uy) ** 2 };
  };
  let tris = [{ v: [n, n + 1, n + 2], c: circum(n, n + 1, n + 2) }];
  for (let i = 0; i < n; i++) {
    const [px, py] = all[i], bad = [], keep = [];
    for (const t of tris) ((px - t.c.x) ** 2 + (py - t.c.y) ** 2 < t.c.r2 ? bad : keep).push(t);
    const count = new Map();
    for (const t of bad) for (let k = 0; k < 3; k++) {
      const a = t.v[k], b = t.v[(k + 1) % 3], key = a < b ? `${a},${b}` : `${b},${a}`;
      count.set(key, (count.get(key) || 0) + 1);
    }
    tris = keep;
    for (const [key, c] of count) if (c === 1) {
      const [a, b] = key.split(',').map(Number);
      tris.push({ v: [a, b, i], c: circum(a, b, i) });
    }
  }
  return tris.map(t => t.v).filter(v => v.every(k => k < n));
}
function inside([x, y], poly) {
  let inn = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inn = !inn;
  }
  return inn;
}

// Lleva todo al cuadro 0–100 (el cerebro con su tallo, centrado, con margen).
function fitter() {
  const pts = [...SHAPES.full.outline, ...STEM];
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = 88 / Math.max(x1 - x0, y1 - y0), ox = 50 - (k * (x0 + x1)) / 2, oy = 50 - (k * (y0 + y1)) / 2;
  const r = v => Math.round(v * 10) / 10;
  return ([x, y]) => [r(x * k + ox), r(y * k + oy)];
}

function mesh(kind) {
  const { outline, inner } = SHAPES[kind], fit = fitter();
  const raw = [...outline, ...inner];
  const tris = delaunay(raw).filter(t => inside([0, 1].map(d => (raw[t[0]][d] + raw[t[1]][d] + raw[t[2]][d]) / 3), outline))
    .map(t => [...t].sort((a, b) => a - b)).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const set = new Set();
  const add = (a, b) => set.add(a < b ? `${a},${b}` : `${b},${a}`);
  for (const [a, b, c] of tris) { add(a, b); add(b, c); add(a, c); }
  outline.forEach((_, i) => add(i, (i + 1) % outline.length));
  const edges = [...set].map(s => s.split(',').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return { nodes: raw.map(fit), edges, tris, stem: STEM.map(fit), fold: STEM_FOLD.map(fit), root: fit(STEM_ROOT) };
}

// ---- dibujo ----
// Colores de las caras encendidas, como al final del video: blanco, hielo, cielo, coral, sol y ciruela.
const FACES = ['#f4f7ff', '#bfe6f7', '#f4f7ff', '#8fd0ee', '#dbe9f7', '#bfe6f7', '#f0605d', '#f4f7ff', '#bfe6f7', '#f3d583', '#8fd0ee', '#f4f7ff', '#7a3358', '#dbe9f7'];
const pt = p => `${p[0]} ${p[1]}`;

// `ink` y `stem`: colores fijos para los archivos sueltos; sin ellos el SVG toma el color del texto y --brain-stem.
function brain(kind, { ink = 'currentColor', stem = 'var(--brain-stem, #8fdcff)', cls = true } = {}) {
  const lit = kind === 'lit', g = mesh(kind === 'simple' ? 'simple' : 'full'), simple = kind === 'simple';
  const w = simple ? 2.2 : 1, r = simple ? 3 : 1.5;
  const faces = lit ? `<g stroke="#07080f" stroke-width=".5" stroke-linejoin="round">${g.tris.map((t, i) =>
    `<polygon points="${t.map(k => pt(g.nodes[k])).join(' ')}" fill="${FACES[(i * 5 + t[0]) % FACES.length]}"/>`).join('')}</g>` : '';
  const d = g.edges.map(([a, b]) => `M${pt(g.nodes[a])}L${pt(g.nodes[b])}`).join('') + `M${pt(g.root)}L${pt(g.stem[1])}`;
  const nodes = lit ? '' : `<g fill="${ink}">${g.nodes.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}"/>`).join('')}</g>`;
  return `<svg${cls ? ` class="brain brain-${kind}"` : ''} viewBox="0 0 100 100" aria-hidden="true" focusable="false">${faces}`
    + `<polygon points="${g.stem.map(pt).join(' ')}" fill="${stem}"/>`
    + `<path d="M${pt(g.stem[0])}L${pt(g.fold[1])}L${pt(g.stem[2])}" fill="#07080f" fill-opacity=".22"/>`
    + `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-opacity="${lit ? 0.3 : 0.78}"/>`
    + `${nodes}</svg>`;
}

// ZUKA con trazos, la misma línea de la malla. Altura de mayúscula 20, trazo 2.6.
const WORD_D = 'M1 1H15L1 21H15M24 1V13.5a7 7 0 0 0 14 0V1M47 1V21M61 1L47 12.5M52.6 8L61.5 21M70 21L78 1L86 21M73 14H83';
const wordmark = (ink = 'currentColor') => `<svg class="wordmark" viewBox="-1 -1 89 24" aria-hidden="true" focusable="false">`
  + `<path d="${WORD_D}" pathLength="1" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Animación de entrada (va dentro de la portada #boot de index.html, entre las marcas <!-- intro -->): el cerebro en
// malla está quieto desde el primer cuadro, igual al icono con que Android abre la app, y sus caras se encienden por
// franjas desde el tallo; luego aparecen las letras de ZUKA y el eslogan. Nada se mueve ni cambia de tamaño: solo
// cambia la opacidad de capas enteras (cada franja y cada letra es su propio <svg>), que el celular anima aunque esté
// ocupado cargando la app. Los tiempos los pone css/styles.css (.intro), con el turno --k de cada capa.
const SLOGAN = 'Potencia tu mente';
const INTRO_BANDS = 6;
const INTRO_LETTERS = [['M1 1H15L1 21H15', 1, 15], ['M24 1V13.5a7 7 0 0 0 14 0V1', 24, 38], ['M47 1V21M61 1L47 12.5M52.6 8L61.5 21', 47, 61.5], ['M70 21L78 1L86 21M73 14H83', 70, 86]];
function introBlock() {
  const g = mesh('full'), INK = '#e6ecff', dist = p => Math.hypot(p[0] - g.root[0], p[1] - g.root[1]);
  const mid = t => [0, 1].map(k => (g.nodes[t[0]][k] + g.nodes[t[1]][k] + g.nodes[t[2]][k]) / 3);
  const far = Math.max(...g.tris.map(t => dist(mid(t)))) + 1e-9;
  const svg = (cls, k, body) => `<svg class="${cls}"${k === null ? '' : ` style="--k:${k}"`} viewBox="0 0 100 100" focusable="false">${body}</svg>`;
  const bands = Array.from({ length: INTRO_BANDS }, (_, b) => svg('bi-band', b,
    `<g stroke="#07080f" stroke-width=".5" stroke-linejoin="round">${g.tris.map((t, i) => (Math.floor((dist(mid(t)) / far) * INTRO_BANDS) === b
      ? `<polygon points="${t.map(k => pt(g.nodes[k])).join(' ')}" fill="${FACES[(i * 5 + t[0]) % FACES.length]}"/>` : '')).join('')}</g>`)).join('');
  const wire = svg('bi-wire', null, inner(brain('full', { ink: INK, stem: '#8fdcff', cls: false })));
  const word = INTRO_LETTERS.map(([d, x0, x1], k) => `<svg style="--k:${k}" viewBox="${x0 - 1.5} -0.5 ${x1 - x0 + 3} 23" focusable="false">`
    + `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`).join('');
  return `<div class="intro"><div class="intro-brain">${bands}${wire}</div>`
    + `<div class="intro-text"><div class="intro-word">${word}</div><p class="intro-slogan">${SLOGAN}</p></div></div>`;
}
const INTRO_MARKS = ['<!-- intro: generado por tools/marca.js, no editar -->', '<!-- /intro -->'];
// Pone el bloque de la animación en index.html, entre sus marcas.
function withIntro(index) {
  const a = index.indexOf(INTRO_MARKS[0]), b = index.indexOf(INTRO_MARKS[1]);
  if (a < 0 || b < a) throw new Error('index.html: faltan las marcas de la animación de entrada');
  return index.slice(0, a + INTRO_MARKS[0].length) + introBlock() + index.slice(b);
}

// Archivos sueltos (panel de administración, documentos): colores fijos.
const XMLNS = 'xmlns="http://www.w3.org/2000/svg"';
const inner = s => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
function lockup(ink, stem) {
  return `<svg ${XMLNS} viewBox="0 0 270 100" role="img" aria-label="Zuka"><title>Zuka</title>`
    + `<g>${inner(brain('simple', { ink, stem, cls: false }))}</g>`
    + `<g transform="translate(112 31) scale(1.72)">${inner(wordmark(ink))}</g></svg>\n`;
}
const cerebro = () => `<svg ${XMLNS} viewBox="0 0 100 100" role="img" aria-label="Zuka"><title>Zuka</title>`
  + `${inner(brain('full', { ink: '#e6ecff', stem: '#8fdcff', cls: false }))}</svg>\n`;

function build() {
  const js = `// Marca de Zuka: el cerebro en malla y la palabra ZUKA. GENERADO por \`node tools/marca.js\`: no editar a mano.
// brainSVG(kind): 'simple' (tamaños chicos), 'full' (toda la malla) o 'lit' (las caras encendidas). Toma el color del
// texto para las aristas y --brain-stem para el tallo. brainTile: el cerebro en su ficha oscura, como el icono.
const BRAIN = {
  simple: '${brain('simple')}',
  full: '${brain('full')}',
  lit: '${brain('lit')}',
};
const brainSVG = (kind = 'simple') => BRAIN[kind] || BRAIN.simple;
const brainTile = (kind = 'simple', cls = '') => \`<span class="brain-tile\${cls ? ' ' + cls : ''}">\${brainSVG(kind)}</span>\`;
const WORDMARK = '${wordmark()}';
const logoHTML = () => \`<span class="logo" role="img" aria-label="Zuka">\${brainSVG('simple')}\${WORDMARK}</span>\`;
`;
  return {
    geo: { full: mesh('full'), simple: mesh('simple') },
    intro: introBlock(), withIntro,
    files: {
      'js/marca.js': js,
      'brand/logo-dark.svg': lockup('#edf1ff', '#6fd3ff'),    // para fondo oscuro
      'brand/logo-light.svg': lockup('#0a1230', '#0b5ed7'),   // para fondo claro
      'brand/cerebro.svg': cerebro(),
    },
  };
}

// ---- iconos PNG ----
// `pad`: margen alrededor del cerebro, en fracción del lado. El cerebro va casi hasta el borde; el enmascarable (el que
// usa Android, que lo recorta en círculo u otra forma) lo lleva hasta el límite de la zona segura: un círculo del 80 %.
const ICONS = [
  { file: 'icons/icon-512.png', size: 512, pad: 0.03, kind: 'full' },
  { file: 'icons/icon-192.png', size: 192, pad: 0.03, kind: 'full' },
  { file: 'icons/icon-maskable-512.png', size: 512, pad: 0.1, kind: 'full' },
  { file: 'icons/apple-touch-icon.png', size: 180, pad: 0.03, kind: 'full' },
  { file: 'icons/favicon-48.png', size: 48, pad: 0.02, kind: 'simple', round: 0.22 },
];
function iconPage({ size, pad, kind, round = 0 }) {
  const s = size * (1 - 2 * pad), glow = Math.max(1, size / 64);
  const svg = brain(kind, { ink: '#e6ecff', stem: '#8fdcff', cls: false }).replace('<svg', `<svg ${XMLNS} width="${s}" height="${s}"`);
  return `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}
    #i{width:${size}px;height:${size}px;display:grid;place-items:center;border-radius:${round * size}px;
      background:radial-gradient(circle at 50% 44%, #10142a 0, #07080f 62%)}
    svg{filter:drop-shadow(0 0 ${glow}px rgba(150,205,255,.55)) drop-shadow(0 0 ${glow * 4}px rgba(111,211,255,.28))}</style>
    <div id="i">${svg}</div>`;
}
async function pngs() {
  const lemo = path.join(os.homedir(), 'lemo-opuscar');
  const { chromium } = require(path.join(lemo, 'node_modules', 'playwright-core'));
  const { EXE } = await import('file:///' + path.join(lemo, 'core/render/browser.mjs').replace(/\\/g, '/'));
  const browser = await chromium.launch({ executablePath: EXE });
  for (const icon of ICONS) {
    const page = await browser.newPage({ viewport: { width: icon.size, height: icon.size }, deviceScaleFactor: 1 });
    await page.setContent(iconPage(icon));
    await page.locator('#i').screenshot({ path: path.join(ROOT, icon.file), omitBackground: true });
    await page.close();
    console.log('  ' + icon.file);
  }
  await browser.close();
}

if (require.main === module) {
  const { files } = build();
  for (const [f, text] of Object.entries(files)) { fs.writeFileSync(path.join(ROOT, f), text); console.log('  ' + f); }
  const index = path.join(ROOT, 'index.html');
  fs.writeFileSync(index, withIntro(fs.readFileSync(index, 'utf8')));
  console.log('  index.html (animación de entrada)');
  if (process.argv.includes('--png')) pngs().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { build, brain, mesh };
