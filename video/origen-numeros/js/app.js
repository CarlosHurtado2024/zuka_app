// Página: cada cuadro es Canvas 2D (pared, pizarra, tiza, pasada de borrador, luz) y luego un pase WebGL2
// (desenfoque de movimiento de la cámara, viñeta, color). window.render(t) depende solo de t.
// Adaptado del compositor del estilo «chalkboard» de Lemo-Opuscar: una sola pizarra larga, sin panel
// corredizo, sin franja húmeda, sin placa de subtítulos.
import { clamp } from '/core/lib.js';
import { bake, drawStroke } from './chalk.js';
import { installDeposit, grainTile } from './r2d.js';
import { Post } from './post.js';
import { loadSvgFont } from './hand.js';
import { bakeWall, bakeSlate, WALL, BW, BH } from './stage.js';
import { drawFront } from './props.js';

const Q = new URLSearchParams(location.search), W = innerWidth, H = innerHeight;
const cv = document.getElementById('c');
cv.width = W; cv.height = H;
await loadSvgFont('fonts/EMSDelight.svg');
installDeposit();

const { build } = await import('./film.js');
const F = build(W, H);
for (const s of F.S) bake(s, s.o.R || 2);
window.DUR = F.DUR; window.EV = F.EV;

const WALLI = bakeWall();
const SLATE = bakeSlate(BW, BH, 71, false);
const TILE = grainTile();
const post = new Post(cv, W, H);
const main = new OffscreenCanvas(W, H), mx = main.getContext('2d');
const la = new OffscreenCanvas(W, H), lx = la.getContext('2d');
const PAT = mx.createPattern(TILE, 'repeat');
const KS = W / 1920;                                    // las escalas de cámara se dan para un cuadro de 1920 de ancho
const view = c0 => { const c = { ...c0, s: c0.s * KS }; return { ...c, m: [c.s, 0, 0, c.s, W / 2 - c.cx * c.s, H / 2 - c.cy * c.s], toScreen: (x, y) => [W / 2 + (x - c.cx) * c.s, H / 2 + (y - c.cy) * c.s], W, H }; };

function wipePath(t) {
  const w = F.wipe; if (!w || t <= w.t0) return null;
  const P = w.path, n = Math.max(2, Math.round(P.length * clamp((t - w.t0) / (w.t1 - w.t0))));
  const p = new Path2D(); P.slice(0, n).forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y));
  return p;
}

function frame(t) {
  const c = F.camAt(t), v = view(c);
  // lo que cae fuera del cuadro no se dibuja
  const hw = W / 2 / v.s, hh = H / 2 / v.s, vis = s => t > s.t0 && s.bb[2] > c.cx - hw && s.bb[0] < c.cx + hw && s.bb[3] > c.cy - hh && s.bb[1] < c.cy + hh;
  mx.setTransform(1, 0, 0, 1, 0, 0); mx.globalCompositeOperation = 'source-over'; mx.globalAlpha = 1; mx.filter = 'none';
  mx.fillStyle = '#000'; mx.fillRect(0, 0, W, H);
  mx.setTransform(...v.m); mx.imageSmoothingQuality = 'high';
  mx.drawImage(WALLI.cv, WALL[0], WALL[1], WALL[2], WALL[3]);
  mx.drawImage(SLATE.cv, 0, 0, BW, BH);
  // tiza: lo que se conserva va directo; lo que se borra, en su propia capa
  lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, W, H); lx.filter = 'none'; lx.globalCompositeOperation = 'source-over';
  lx.setTransform(...v.m);
  const hp = wipePath(t);
  for (const s of F.S) if (s.phase === 'pre' && (!hp || s.wiped) && vis(s)) drawStroke(lx, s, t);
  if (hp) {
    lx.globalCompositeOperation = 'destination-out'; lx.filter = `blur(${Math.max(1, 16 * v.s)}px)`; lx.lineCap = 'round'; lx.lineJoin = 'round'; lx.lineWidth = F.wipe.w; lx.strokeStyle = '#000';
    lx.stroke(hp); lx.globalCompositeOperation = 'source-over'; lx.filter = 'none';
    for (const s of F.S) if (s.phase === 'pre' && !s.wiped && vis(s)) drawStroke(lx, s, t);      // el borrador rodea lo que se queda
  }
  mx.setTransform(1, 0, 0, 1, 0, 0); mx.drawImage(la, 0, 0);
  if (hp) {
    mx.save(); mx.setTransform(...v.m); mx.filter = `blur(${Math.max(1, 12 * v.s)}px)`;
    mx.strokeStyle = 'rgba(160,176,168,.024)'; mx.lineCap = 'round'; mx.lineJoin = 'round'; mx.lineWidth = F.wipe.w * .9; mx.stroke(hp); mx.restore();
  }
  mx.setTransform(...v.m);
  for (const s of F.S) if (s.phase === 'post' && vis(s)) drawStroke(mx, s, t);
  // grano fino de la pizarra, donde se alcanza a ver
  if (v.s / KS > .6) {
    mx.save(); mx.beginPath(); mx.rect(0, 0, BW, BH); mx.clip();
    PAT.setTransform(new DOMMatrix([.25, 0, 0, .25, 0, 0])); mx.globalCompositeOperation = 'soft-light'; mx.globalAlpha = Math.min(.2, (v.s / KS - .6) * .3);
    mx.fillStyle = PAT; mx.fillRect(0, 0, BW, BH); mx.restore();
  }
  // luz de las ventanas a la izquierda: una caída suave, sin formas sobre la escritura
  mx.save(); mx.setTransform(...v.m);
  const lg = mx.createLinearGradient(-1500, 0, 7900, 0); lg.addColorStop(0, 'rgb(255,250,240)'); lg.addColorStop(.45, 'rgb(240,240,236)'); lg.addColorStop(1, 'rgb(214,216,218)');
  mx.globalCompositeOperation = 'multiply'; mx.fillStyle = lg; mx.fillRect(-1500, -1500, 9400, 4900);
  mx.restore();
  // el frente de la tiza: unos granos claros donde se está escribiendo
  for (const s of F.S) {
    if (t <= s.t0 || t >= s.t1) continue;
    const p = s.at(s.prog(t) * s.len);
    drawFront(mx, t, v, p[0], p[1], s.color, Math.min(s.w, 9), .5);
  }
  return c;
}

window.render = t => {
  const c = frame(t);
  const pc = F.camAt(t - .5 / 30), k = pc.s / c.s;
  const bl = [k, 0, 0, 0, k, 0, W / 2 - k * W / 2 + pc.s * KS * (c.cx - pc.cx), H / 2 - k * H / 2 + pc.s * KS * (c.cy - pc.cy), 1];
  post.draw(main, bl, t, .3);
};
window.TEXTS = t => {
  const v = view(F.camAt(t)), out = [];
  for (const q of F.TX) {
    if (t < q.t0 || t >= q.t1) continue;
    const [a, b] = v.toScreen(q.box[0], q.box[1]), [d, e] = v.toScreen(q.box[2], q.box[3]);
    out.push({ id: q.id, text: q.text, x0: a, y0: b, x1: d, y1: e });
  }
  return out;
};
window.F = F;
if (Q.has('dbg')) { const n = {}; for (const [k, v] of Object.entries(F.T)) if (typeof v === 'number') n[k] = +v.toFixed(2); console.warn('T ' + JSON.stringify(n)); console.warn('CHECK ' + F.CHECK.filter(c => c.slack < .1).map(c => c.id + ' ' + c.slack).join(' | ')); }
window.render(+(Q.get('t') || 0));
window.READY = true;
