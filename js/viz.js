// Visualizaciones animadas (canvas 2D) usadas por los clips y por los ejercicios interactivos.
// drawViz(ctx, viz, p, box, param): p ∈ [0,1] es el avance de la escena; `param` (opcional)
// fija el valor que controla el deslizador de un ejercicio.

const PAL = ['#8b7bff', '#22d3ee', '#f472b6', '#facc15', '#34d399', '#fb923c'];
const INK = 'rgba(255,255,255,.92)', DIM = 'rgba(255,255,255,.5)';
const GRID = 'rgba(255,255,255,.07)', AXIS = 'rgba(255,255,255,.35)';
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = t => Math.max(0, Math.min(1, t));
const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const rad = d => (d * Math.PI) / 180;
const font = (px, w = 700) => `${w} ${px}px "Plus Jakarta Sans", system-ui, sans-serif`;
let SC = 1; // escala de trazos y textos según el tamaño del lienzo

function fmt(n, d = 2) {
  const r = +n.toFixed(d);
  return Object.is(r, -0) ? '0' : String(r);
}

function text(ctx, s, x, y, { color = INK, size = 14, align = 'left', base = 'alphabetic', weight = 700 } = {}) {
  ctx.font = font(size, weight);
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
  ctx.fillText(s, x, y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Etiquetas apiladas con fondo oscuro, en la esquina superior del recuadro.
function chips(ctx, b, lines, right = false) {
  let y = b.y + 4;
  for (const [s, c] of lines) {
    ctx.font = font(13 * SC);
    const w = ctx.measureText(s).width + 16 * SC, h = 24 * SC;
    const x = right ? b.x + b.w - w - 4 : b.x + 4;
    ctx.fillStyle = 'rgba(8,10,24,.8)';
    roundRect(ctx, x, y, w, h, 8 * SC); ctx.fill();
    text(ctx, s, x + 8 * SC, y + h / 2 + 1, { color: c || INK, size: 13 * SC, base: 'middle' });
    y += h + 6 * SC;
  }
}

function dot(ctx, x, y, color, r = 6, hollow = false) {
  ctx.beginPath(); ctx.arc(x, y, r * SC, 0, Math.PI * 2);
  if (hollow) {
    ctx.fillStyle = '#0d1024'; ctx.fill();
    ctx.lineWidth = 2.5 * SC; ctx.strokeStyle = color; ctx.stroke();
  } else {
    ctx.fillStyle = color; ctx.fill();
    ctx.lineWidth = 2 * SC; ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.stroke();
  }
}

function arrow(ctx, x1, y1, x2, y2, color, { w = 3, dash = false } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 1) return;
  const h = Math.min(12 * SC, L * 0.5);
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = w * SC; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash([6 * SC, 5 * SC]);
  ctx.beginPath(); ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - Math.cos(a) * h * 0.8, y2 - Math.sin(a) * h * 0.8); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45));
  ctx.lineTo(x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45));
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function niceStep(span) {
  const raw = span / 7, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

// Plano cartesiano con cuadrícula; devuelve las funciones de mapeo X(x), Y(y).
function plane(ctx, b, xr, yr, ax) {
  const X = x => b.x + ((x - xr[0]) / (xr[1] - xr[0])) * b.w;
  const Y = y => b.y + b.h - ((y - yr[0]) / (yr[1] - yr[0])) * b.h;
  const sx = niceStep(xr[1] - xr[0]), sy = niceStep(yr[1] - yr[0]);
  const xs = [], ys = [];
  for (let i = Math.ceil(xr[0] / sx); i * sx <= xr[1] + 1e-9; i++) xs.push(i * sx);
  for (let i = Math.ceil(yr[0] / sy); i * sy <= yr[1] + 1e-9; i++) ys.push(i * sy);
  ctx.save();
  ctx.strokeStyle = GRID; ctx.lineWidth = 1; ctx.beginPath();
  xs.forEach(x => { ctx.moveTo(X(x), b.y); ctx.lineTo(X(x), b.y + b.h); });
  ys.forEach(y => { ctx.moveTo(b.x, Y(y)); ctx.lineTo(b.x + b.w, Y(y)); });
  ctx.stroke();
  const ox = Math.min(Math.max(X(0), b.x), b.x + b.w), oy = Math.min(Math.max(Y(0), b.y), b.y + b.h);
  ctx.strokeStyle = AXIS; ctx.lineWidth = 1.5; ctx.beginPath();
  ctx.moveTo(b.x, oy); ctx.lineTo(b.x + b.w, oy); ctx.moveTo(ox, b.y); ctx.lineTo(ox, b.y + b.h);
  ctx.stroke();
  const sz = 10 * SC, o = { color: DIM, size: sz, weight: 600 };
  xs.forEach(x => Math.abs(x) > 1e-9 && text(ctx, fmt(x), X(x), oy + 4, { ...o, align: 'center', base: 'top' }));
  ys.forEach(y => Math.abs(y) > 1e-9 && text(ctx, fmt(y), ox - 4, Y(y), { ...o, align: 'right', base: 'middle' }));
  if (ax) {
    text(ctx, ax[0], b.x + b.w - 2, oy - 6, { ...o, size: sz + 1, align: 'right' });
    text(ctx, ax[1], ox + 6, b.y + 12 * SC, { ...o, size: sz + 1 });
  }
  ctx.restore();
  return { X, Y };
}

function curve(ctx, pl, b, f, x0, x1, color, { width = 3, dash = false } = {}) {
  if (x1 <= x0) return;
  ctx.save();
  ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
  ctx.strokeStyle = color; ctx.lineWidth = width * SC; ctx.lineJoin = ctx.lineCap = 'round';
  if (dash) ctx.setLineDash([6 * SC, 6 * SC]);
  ctx.beginPath();
  let pen = false, last = 0;
  const N = 300;
  for (let i = 0; i <= N; i++) {
    const x = lerp(x0, x1, i / N), y = f(x);
    if (!Number.isFinite(y)) { pen = false; continue; }
    const px = pl.X(x), py = pl.Y(y);
    if (pen && Math.abs(py - last) > b.h * 1.5) pen = false;
    if (pen) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    pen = true; last = py;
  }
  ctx.stroke();
  ctx.restore();
}

const VIZ = {
  // Gráfica de una o varias funciones; `anim` barre un parámetro, `draw` traza progresivamente.
  graph(ctx, v, p, b, param) {
    const pl = plane(ctx, b, v.xr, v.yr, v.ax);
    const a = param ?? (v.anim ? lerp(v.anim[0], v.anim[1], p) : undefined);
    const end = v.draw ? lerp(v.xr[0], v.xr[1], p) : v.xr[1];
    (v.fs || [{ f: v.f }]).forEach((F, i) =>
      curve(ctx, pl, b, x => F.f(x, a), v.xr[0], end, F.color || PAL[i], { dash: F.dash }));
    (v.holes || []).forEach(([x, y]) => dot(ctx, pl.X(x), pl.Y(y), PAL[0], 6, true));
    (v.points || []).forEach(([x, y, l]) => {
      dot(ctx, pl.X(x), pl.Y(y), PAL[3]);
      if (l) text(ctx, l, pl.X(x) + 10 * SC, pl.Y(y) - 10 * SC, { size: 12 * SC, color: PAL[3] });
    });
    if (v.label && a !== undefined) chips(ctx, b, [[v.label(a)]]);
  },

  // Dos puntos que se acercan a x0 por ambos lados.
  approach(ctx, v, p, b) {
    const pl = plane(ctx, b, v.xr, v.yr);
    curve(ctx, pl, b, v.f, v.xr[0], v.xr[1], PAL[0]);
    curve(ctx, pl, b, () => v.L, v.xr[0], v.xr[1], DIM, { width: 1.5, dash: true });
    dot(ctx, pl.X(v.x0), pl.Y(v.L), PAL[0], 6, true);
    const d = lerp(1.6, 0.01, ease(p)), xl = v.x0 - d, xr = v.x0 + d;
    dot(ctx, pl.X(xl), pl.Y(v.f(xl)), PAL[1]);
    dot(ctx, pl.X(xr), pl.Y(v.f(xr)), PAL[2]);
    chips(ctx, b, [
      [`x = ${fmt(xl, 3)} → f(x) = ${fmt(v.f(xl), 3)}`, PAL[1]],
      [`x = ${fmt(xr, 3)} → f(x) = ${fmt(v.f(xr), 3)}`, PAL[2]],
    ]);
  },

  // Círculo unitario con proyecciones de seno y coseno.
  circle(ctx, v, p, b, param) {
    const deg = param ?? lerp(v.from ?? 0, v.to ?? 360, p), th = rad(deg);
    const R = Math.min(b.w, b.h) / 2 * 0.78, cx = b.x + b.w / 2, cy = b.y + b.h / 2 + 10 * SC;
    ctx.strokeStyle = AXIS; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - R * 1.2, cy); ctx.lineTo(cx + R * 1.2, cy);
    ctx.moveTo(cx, cy - R * 1.2); ctx.lineTo(cx, cy + R * 1.2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 2 * SC;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    if (th > 0.001) {
      ctx.strokeStyle = PAL[3]; ctx.lineWidth = 2.5 * SC;
      ctx.beginPath(); ctx.arc(cx, cy, 24 * SC, 0, -th, true); ctx.stroke();
    }
    const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
    ctx.lineCap = 'round';
    ctx.lineWidth = 4 * SC; ctx.strokeStyle = PAL[1];
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
    ctx.strokeStyle = PAL[2];
    ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5 * SC;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    dot(ctx, px, py, PAL[3], 7);
    chips(ctx, b, [
      [`θ = ${fmt(deg, 0)}°`, PAL[3]],
      [`cos θ = ${fmt(Math.cos(th))}`, PAL[1]],
      [`sin θ = ${fmt(Math.sin(th))}`, PAL[2]],
    ]);
  },

  // Triángulo rectángulo con ángulo θ; `show` elige la razón a mostrar.
  triangle(ctx, v, p, b, param) {
    const from = v.from ?? 35, deg = param ?? lerp(from, v.to ?? from, p), th = rad(deg);
    const c = Math.cos(th), s = Math.sin(th);
    const L = Math.min((b.w * 0.86) / c, ((b.h - 70 * SC) * 0.92) / s);
    const A = { x: b.x + (b.w - L * c) / 2, y: b.y + b.h - 10 * SC };
    const B = { x: A.x + L * c, y: A.y }, C = { x: B.x, y: A.y - L * s };
    ctx.fillStyle = 'rgba(139,123,255,.12)';
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath(); ctx.fill();
    const side = (P, Q, col) => {
      ctx.strokeStyle = col; ctx.lineWidth = 4 * SC; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(Q.x, Q.y); ctx.stroke();
    };
    side(A, B, PAL[1]); side(B, C, PAL[2]); side(A, C, PAL[0]);
    const q = 12 * SC;
    ctx.strokeStyle = DIM; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(B.x - q, B.y); ctx.lineTo(B.x - q, B.y - q); ctx.lineTo(B.x, B.y - q); ctx.stroke();
    ctx.strokeStyle = PAL[3]; ctx.lineWidth = 2.5 * SC;
    ctx.beginPath(); ctx.arc(A.x, A.y, 26 * SC, -th, 0); ctx.stroke();
    text(ctx, 'θ', A.x + 38 * SC * Math.cos(th / 2), A.y - 38 * SC * Math.sin(th / 2), { color: PAL[3], size: 15 * SC, base: 'middle' });
    const lb = { adj: 'adyacente', op: 'opuesto', hip: 'hipotenusa', ...v.labels };
    const ls = 12.5 * SC;
    text(ctx, lb.adj, (A.x + B.x) / 2, A.y + 4 * SC, { color: PAL[1], size: ls, align: 'center', base: 'top' });
    text(ctx, lb.op, B.x + 8 * SC, (B.y + C.y) / 2, { color: PAL[2], size: ls, base: 'middle' });
    ctx.save();
    ctx.translate((A.x + C.x) / 2 - s * 14 * SC, (A.y + C.y) / 2 - c * 14 * SC); ctx.rotate(-th);
    text(ctx, lb.hip, 0, 0, { color: PAL[0], size: ls, align: 'center', base: 'middle' });
    ctx.restore();
    const lines = [[`θ = ${fmt(deg, 0)}°`, PAL[3]]];
    if (v.show === 'sin') lines.push([`sin θ = op/hip = ${fmt(s)}`, PAL[2]]);
    if (v.show === 'cos') lines.push([`cos θ = ady/hip = ${fmt(c)}`, PAL[1]]);
    if (v.show === 'tan') lines.push([`tan θ = op/ady = ${fmt(s / c)}`, PAL[0]]);
    chips(ctx, b, lines);
  },

  // Secante que se convierte en tangente (o tangente que recorre la curva).
  tangent(ctx, v, p, b, param) {
    const pl = plane(ctx, b, v.xr, v.yr);
    curve(ctx, pl, b, v.f, v.xr[0], v.xr[1], PAL[0]);
    let x0, h;
    if (param !== undefined) { x0 = param; h = 0; }
    else if (v.x0anim) { x0 = lerp(v.x0anim[0], v.x0anim[1], p); h = 0; }
    else { x0 = v.x0; h = lerp(v.h0 ?? 1.5, v.h1 ?? 0, p); }
    const isTan = h < 0.02, y0 = v.f(x0);
    const m = isTan ? (v.f(x0 + 1e-4) - v.f(x0 - 1e-4)) / 2e-4 : (v.f(x0 + h) - y0) / h;
    curve(ctx, pl, b, x => y0 + m * (x - x0), v.xr[0], v.xr[1], isTan ? PAL[4] : PAL[3], { width: 2.5 });
    dot(ctx, pl.X(x0), pl.Y(y0), INK);
    if (!isTan) dot(ctx, pl.X(x0 + h), pl.Y(v.f(x0 + h)), PAL[3]);
    chips(ctx, b, [isTan
      ? [`tangente · pendiente m = ${fmt(m)}`, PAL[4]]
      : [`secante · h = ${fmt(h)} · m ≈ ${fmt(m)}`, PAL[3]]]);
  },

  // Tiro parabólico: trayectoria, bola y componentes de la velocidad.
  projectile(ctx, v, p, b, param) {
    const g = v.g ?? 9.8, v0 = v.v0 ?? 20;
    const deg = param ?? (v.anim ? lerp(v.anim[0], v.anim[1], p) : v.ang ?? 45), th = rad(deg);
    const vx = v0 * Math.cos(th), vy = v0 * Math.sin(th), T = (2 * vy) / g, R = vx * T, Hm = (vy * vy) / (2 * g);
    const pl = plane(ctx, b, [0, ((v0 * v0) / g) * 1.08], [0, ((v0 * v0) / (2 * g)) * 1.25], ['x (m)', 'y (m)']);
    const full = param !== undefined || !!v.anim;
    const tt = full ? T : T * clamp01(p * 1.05);
    const pos = t => [vx * t, Math.max(0, vy * t - (g * t * t) / 2)];
    ctx.save();
    ctx.strokeStyle = PAL[3]; ctx.lineWidth = 3 * SC; ctx.lineCap = 'round'; ctx.setLineDash([2 * SC, 7 * SC]);
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const [x, y] = pos((tt * i) / 80);
      if (i) ctx.lineTo(pl.X(x), pl.Y(y)); else ctx.moveTo(pl.X(x), pl.Y(y));
    }
    ctx.stroke(); ctx.restore();
    const [bx, by] = pos(tt), X = pl.X(bx), Y = pl.Y(by);
    if (!full && tt < T) {
      const k = 2.4 * SC;
      arrow(ctx, X, Y, X + vx * k, Y, PAL[1]);
      arrow(ctx, X, Y, X, Y - (vy - g * tt) * k, PAL[2]);
    }
    dot(ctx, X, Y, PAL[3], 8);
    chips(ctx, b, [
      [`θ = ${fmt(deg, 0)}°`, PAL[3]],
      [`alcance = ${fmt(R, 1)} m`, INK],
      [`altura máx = ${fmt(Hm, 1)} m`, DIM],
    ], true);
  },

  // Bloque empujado sobre el piso (2ª ley) o par acción-reacción (3ª ley).
  push(ctx, v, p, b, param) {
    const floor = b.y + b.h * 0.72, size = b.h * 0.24;
    ctx.strokeStyle = AXIS; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(b.x, floor); ctx.lineTo(b.x + b.w, floor); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = b.x; x < b.x + b.w; x += 14 * SC) { ctx.moveTo(x, floor); ctx.lineTo(x - 8 * SC, floor + 10 * SC); }
    ctx.stroke();
    const block = (x, col, label) => {
      ctx.fillStyle = col; roundRect(ctx, x, floor - size, size, size, 8 * SC); ctx.fill();
      text(ctx, label, x + size / 2, floor - size / 2, { color: '#0b0d1a', size: 13 * SC, align: 'center', base: 'middle', weight: 800 });
    };
    if (v.pair) {
      const cx = b.x + b.w / 2, L = b.w * 0.28 * ease(p), cy = floor - size / 2;
      block(cx - size, PAL[0], 'A'); block(cx, PAL[1], 'B');
      arrow(ctx, cx + size / 2, cy - 14 * SC, cx + size / 2 + L, cy - 14 * SC, PAL[3]);
      arrow(ctx, cx - size / 2, cy + 14 * SC, cx - size / 2 - L, cy + 14 * SC, PAL[2]);
      chips(ctx, b, [['A empuja a B: F →', PAL[3]], ['B empuja a A: ← F', PAL[2]]]);
      return;
    }
    const m = v.m ?? 2, F = param ?? v.F ?? 0, a = F / m;
    const t = param !== undefined ? 0 : p * 3, v0 = v.v0 ?? (F === 0 ? 1.2 : 0);
    const xm = v0 * t + (a * t * t) / 2;
    const ppm = (b.w * 0.55) / Math.max(4, v0 * 3 + a * 4.5);
    const x = b.x + b.w * 0.06 + xm * ppm;
    block(x, PAL[0], `${m} kg`);
    if (F > 0) arrow(ctx, x + size, floor - size / 2, x + size + F * b.w * 0.022, floor - size / 2, PAL[3], { w: 4 });
    chips(ctx, b, F === 0 && param === undefined
      ? [['F neta = 0 → v constante', PAL[4]]]
      : [[`F = ${fmt(F)} N`, PAL[3]], [`a = F / m = ${fmt(a)} m/s²`, INK]]);
  },

  // Plano inclinado con peso, normal y componentes.
  incline(ctx, v, p, b, param) {
    const deg = param ?? (v.anim ? lerp(v.anim[0], v.anim[1], p) : v.ang ?? 30), th = rad(deg);
    const O = { x: b.x + b.w * 0.04, y: b.y + b.h * 0.96 };
    let L = b.w * 0.9;
    if (L * Math.tan(th) > b.h * 0.78) L = (b.h * 0.78) / Math.tan(th);
    const top = { x: O.x + L, y: O.y - L * Math.tan(th) };
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(O.x + L, O.y); ctx.lineTo(top.x, top.y); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = PAL[3]; ctx.lineWidth = 2.5 * SC;
    ctx.beginPath(); ctx.arc(O.x, O.y, 34 * SC, -th, 0); ctx.stroke();
    text(ctx, `${fmt(deg, 0)}°`, O.x + 40 * SC, O.y - 8 * SC, { color: PAL[3], size: 12 * SC });
    const u = { x: Math.cos(th), y: -Math.sin(th) }, n = { x: -Math.sin(th), y: -Math.cos(th) };
    const S = L / Math.cos(th), size = Math.min(b.w, b.h) * 0.16;
    const C = { x: O.x + u.x * S * 0.55 + (n.x * size) / 2, y: O.y + u.y * S * 0.55 + (n.y * size) / 2 };
    ctx.save(); ctx.translate(C.x, C.y); ctx.rotate(-th);
    ctx.fillStyle = PAL[0]; roundRect(ctx, -size / 2, -size / 2, size, size, 6 * SC); ctx.fill();
    ctx.restore();
    const W = b.h * 0.32, show = param !== undefined ? 1 : p, ls = 12 * SC;
    if (show > 0.05) {
      arrow(ctx, C.x, C.y, C.x, C.y + W, PAL[2]);
      text(ctx, 'mg', C.x + 6 * SC, C.y + W, { color: PAL[2], size: ls });
    }
    if (show > 0.3) {
      const N = { x: C.x + n.x * W * Math.cos(th), y: C.y + n.y * W * Math.cos(th) };
      arrow(ctx, C.x, C.y, N.x, N.y, PAL[1]);
      text(ctx, 'N', N.x - 14 * SC, N.y, { color: PAL[1], size: ls });
    }
    if (v.comps && show > 0.55) {
      const P1 = { x: C.x - u.x * W * Math.sin(th), y: C.y - u.y * W * Math.sin(th) };
      const P2 = { x: C.x - n.x * W * Math.cos(th), y: C.y - n.y * W * Math.cos(th) };
      arrow(ctx, C.x, C.y, P1.x, P1.y, PAL[3], { dash: true });
      arrow(ctx, C.x, C.y, P2.x, P2.y, PAL[5], { dash: true });
      text(ctx, 'mg sen θ', P1.x - 8 * SC, P1.y - 8 * SC, { color: PAL[3], size: ls, align: 'right' });
      text(ctx, 'mg cos θ', P2.x + 8 * SC, P2.y + 4 * SC, { color: PAL[5], size: ls });
    }
    chips(ctx, b, v.comps
      ? [[`mg sen θ = ${fmt(Math.sin(th))}·mg`, PAL[3]], [`mg cos θ = ${fmt(Math.cos(th))}·mg`, PAL[5]]]
      : [[`θ = ${fmt(deg, 0)}°`, PAL[3]]]);
  },

  // Caída libre con barras de energía potencial y cinética.
  energy(ctx, v, p, b) {
    const top = b.y + b.h * 0.1, ground = b.y + b.h * 0.95, H = ground - top, x = b.x + b.w * 0.24, f = p * p;
    ctx.strokeStyle = AXIS; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(b.x, ground); ctx.lineTo(b.x + b.w, ground); ctx.stroke();
    arrow(ctx, x - 34 * SC, ground, x - 34 * SC, top + f * H, DIM, { w: 1.5, dash: true });
    text(ctx, 'h', x - 46 * SC, (ground + top + f * H) / 2, { color: DIM, size: 13 * SC, base: 'middle' });
    const r = 13 * SC;
    dot(ctx, x, top + f * H - r, PAL[3], 13);
    const bar = (bx, val, col, label) => {
      const h = H * 0.8 * val, w = b.w * 0.15;
      ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.setLineDash([4, 4]);
      ctx.strokeRect(bx, ground - H * 0.8, w, H * 0.8); ctx.setLineDash([]);
      ctx.fillStyle = col; ctx.fillRect(bx, ground - h, w, h);
      text(ctx, label, bx + w / 2, ground - H * 0.8 - 8 * SC, { color: col, size: 13 * SC, align: 'center' });
    };
    bar(b.x + b.w * 0.55, 1 - f, PAL[1], 'Ep');
    bar(b.x + b.w * 0.76, f, PAL[2], 'Ec');
    chips(ctx, b, [['Ep + Ec = constante', PAL[4]]], true);
  },

  // Balanza en equilibrio para ecuaciones.
  balance(ctx, v, p, b) {
    const cx = b.x + b.w / 2, by = b.y + b.h * 0.4, wob = Math.sin(p * Math.PI * 5) * 0.1 * (1 - p);
    ctx.fillStyle = 'rgba(255,255,255,.14)';
    ctx.beginPath(); ctx.moveTo(cx, by); ctx.lineTo(cx - 34 * SC, b.y + b.h); ctx.lineTo(cx + 34 * SC, b.y + b.h); ctx.closePath(); ctx.fill();
    const Lh = b.w * 0.42;
    ctx.save(); ctx.translate(cx, by); ctx.rotate(wob);
    ctx.strokeStyle = INK; ctx.lineWidth = 5 * SC; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-Lh, 0); ctx.lineTo(Lh, 0); ctx.stroke();
    [[-1, v.l, PAL[0]], [1, v.r, PAL[1]]].forEach(([sgn, label, col]) => {
      const px = sgn * Lh * 0.82, drop = b.h * 0.22;
      ctx.save(); ctx.translate(px, 0); ctx.rotate(-wob);
      ctx.strokeStyle = DIM; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-30 * SC, drop); ctx.moveTo(0, 0); ctx.lineTo(30 * SC, drop); ctx.stroke();
      ctx.font = font(18 * SC, 800);
      const w = Math.max(70 * SC, ctx.measureText(label).width + 24 * SC), h = 40 * SC;
      ctx.fillStyle = col; roundRect(ctx, -w / 2, drop, w, h, 10 * SC); ctx.fill();
      text(ctx, label, 0, drop + h / 2 + 1, { color: '#0b0d1a', size: 18 * SC, align: 'center', base: 'middle', weight: 800 });
      ctx.restore();
    });
    ctx.restore();
    dot(ctx, cx, by, PAL[3], 6);
  },

  // Modelo de área de (a + b)².
  areaSquare(ctx, v, p, b) {
    const S = Math.min(b.w, b.h) * 0.8, x0 = b.x + (b.w - S) / 2, y0 = b.y + (b.h - S) / 2 + 8 * SC;
    const A = S * 0.62, B = S - A;
    const pieces = [
      [x0, y0, A, A, PAL[0], 'a²'], [x0 + A, y0, B, A, PAL[1], 'ab'],
      [x0, y0 + A, A, B, PAL[1], 'ab'], [x0 + A, y0 + A, B, B, PAL[2], 'b²'],
    ];
    pieces.forEach(([x, y, w, h, c, l], i) => {
      const k = v.full ? 1 : clamp01(p * 4.4 - i);
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
      if (k <= 0) return;
      ctx.globalAlpha = k;
      ctx.fillStyle = c + '55'; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = c; ctx.lineWidth = 2.5 * SC; ctx.strokeRect(x, y, w, h);
      text(ctx, l, x + w / 2, y + h / 2, { color: INK, size: 20 * SC, align: 'center', base: 'middle', weight: 800 });
      ctx.globalAlpha = 1;
    });
    const o = { color: DIM, size: 14 * SC, align: 'center', weight: 800 };
    text(ctx, 'a', x0 + A / 2, y0 - 8 * SC, o); text(ctx, 'b', x0 + A + B / 2, y0 - 8 * SC, o);
    text(ctx, 'a', x0 - 12 * SC, y0 + A / 2, { ...o, base: 'middle' }); text(ctx, 'b', x0 - 12 * SC, y0 + A + B / 2, { ...o, base: 'middle' });
  },

  // Sumas de Riemann (rectángulos izquierdos).
  riemann(ctx, v, p, b, param) {
    const pl = plane(ctx, b, v.xr, v.yr);
    const n = Math.max(1, Math.round(param ?? lerp(v.n[0], v.n[1], p)));
    const dx = (v.b - v.a) / n;
    let sum = 0;
    ctx.fillStyle = PAL[4] + '55'; ctx.strokeStyle = PAL[4]; ctx.lineWidth = n > 40 ? 0.5 : 1.2;
    for (let i = 0; i < n; i++) {
      const x = v.a + i * dx, h = v.f(x);
      sum += h * dx;
      const X1 = pl.X(x), X2 = pl.X(x + dx), Y0 = pl.Y(0), Yh = pl.Y(h);
      ctx.fillRect(X1, Yh, X2 - X1, Y0 - Yh);
      if (n <= 80) ctx.strokeRect(X1, Yh, X2 - X1, Y0 - Yh);
    }
    curve(ctx, pl, b, v.f, v.xr[0], v.xr[1], PAL[0]);
    const lines = [[`n = ${n} rectángulos`, PAL[4]], [`suma ≈ ${fmt(sum, 3)}`, INK]];
    if (v.exact) lines.push([`exacto = ${v.exact}`, DIM]);
    chips(ctx, b, lines);
  },

  // Suma de vectores punta-cola.
  vectors(ctx, v, p, b) {
    const pl = plane(ctx, b, v.xr || [-1, 6], v.yr || [-1, 5]);
    const P = (x, y) => [pl.X(x), pl.Y(y)], [ox, oy] = P(0, 0), A = v.A;
    const p1 = ease(clamp01(p / 0.35));
    arrow(ctx, ox, oy, ...P(A[0] * p1, A[1] * p1), PAL[0], { w: 3.5 });
    if (v.only === 'A') {
      chips(ctx, b, [[`a = (${A[0]}, ${A[1]})`, PAL[0]], [`|a| = ${fmt(Math.hypot(A[0], A[1]))}`, INK]]);
      return;
    }
    const B = v.B, k = ease(clamp01((p - 0.35) / 0.35)), off = [A[0] * k, A[1] * k];
    arrow(ctx, ...P(...off), ...P(off[0] + B[0] * p1, off[1] + B[1] * p1), PAL[1], { w: 3.5 });
    const r = ease(clamp01((p - 0.72) / 0.25));
    const lines = [[`a = (${A[0]}, ${A[1]})`, PAL[0]], [`b = (${B[0]}, ${B[1]})`, PAL[1]]];
    if (r > 0) {
      arrow(ctx, ox, oy, ...P((A[0] + B[0]) * r, (A[1] + B[1]) * r), PAL[3], { w: 4 });
      lines.push([`a + b = (${A[0] + B[0]}, ${A[1] + B[1]})`, PAL[3]]);
    }
    chips(ctx, b, lines);
  },

  // Transformación lineal del plano por una matriz 2×2.
  matrix(ctx, v, p, b) {
    const k = ease(p), M = v.M;
    const m = [[lerp(1, M[0][0], k), lerp(0, M[0][1], k)], [lerp(0, M[1][0], k), lerp(1, M[1][1], k)]];
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, s = b.w / 8;
    const T = (x, y) => [cx + (m[0][0] * x + m[0][1] * y) * s, cy - (m[1][0] * x + m[1][1] * y) * s];
    ctx.save();
    ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    ctx.strokeStyle = GRID; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = -10; i <= 10; i++) {
      ctx.moveTo(cx + i * s, b.y); ctx.lineTo(cx + i * s, b.y + b.h);
      ctx.moveTo(b.x, cy - i * s); ctx.lineTo(b.x + b.w, cy - i * s);
    }
    ctx.stroke();
    ctx.strokeStyle = PAL[0] + '88'; ctx.lineWidth = 1.2 * SC; ctx.beginPath();
    for (let i = -10; i <= 10; i++) {
      ctx.moveTo(...T(i, -10)); ctx.lineTo(...T(i, 10));
      ctx.moveTo(...T(-10, i)); ctx.lineTo(...T(10, i));
    }
    ctx.stroke();
    ctx.fillStyle = PAL[3] + '44'; ctx.beginPath();
    ctx.moveTo(...T(0, 0)); ctx.lineTo(...T(1, 0)); ctx.lineTo(...T(1, 1)); ctx.lineTo(...T(0, 1)); ctx.closePath(); ctx.fill();
    ctx.restore();
    arrow(ctx, cx, cy, ...T(1, 0), PAL[4], { w: 3.5 });
    arrow(ctx, cx, cy, ...T(0, 1), PAL[2], { w: 3.5 });
    chips(ctx, b, [['î', PAL[4]], ['ĵ', PAL[2]], [`det = ${fmt(m[0][0] * m[1][1] - m[0][1] * m[1][0])}`, PAL[3]]]);
  },
};

function drawViz(ctx, viz, p, box, param) {
  const fn = VIZ[viz.type];
  if (!fn) return;
  SC = Math.max(0.8, Math.min(1.35, box.w / 300));
  ctx.save();
  fn(ctx, viz, p, box, param);
  ctx.restore();
}

function drawClipBg(ctx, W, H, color, t) {
  ctx.fillStyle = '#090b18'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, color + '40'); g.addColorStop(0.45, '#0d1024'); g.addColorStop(1, '#080a16');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const x = W * (0.5 + 0.3 * Math.sin(t * 0.4)), y = H * (0.18 + 0.05 * Math.cos(t * 0.5));
  const rg = ctx.createRadialGradient(x, y, 0, x, y, W * 0.7);
  rg.addColorStop(0, color + '30'); rg.addColorStop(1, color + '00');
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
}
