// Guía «Cómo se juega» (spec 2026-11-16-guia-y-colores): antes de cada ejercicio o juego que el estudiante ve por
// primera vez sale una tarjeta con un primer ejemplo animado: una mano hace el gesto (tocar, arrastrar, girar,
// mantener, lanzar…) sobre una escena pequeña con fichas del propio juego. Después queda el botón «Cómo se juega»
// junto a la pista. Los pasos de cada juego están en GUIDES; las escenas, en GUIDE_SCENES (dibujadas en un lienzo
// con la paleta de los juegos, así sirven en tema claro y oscuro).
//   guideSteps(ex) → [[escena, texto, opciones]]      openGuide(ex, { auto })      guideButton(ex) → html

const GUIDE_MS = 3600;   // lo que dura una vuelta de la animación de un paso
const GUIDE_W = 300, GUIDE_H = 150;   // tamaño de diseño de la escena

const gEase = u => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
const gSeg = (t, a, b) => gEase((t - a) / (b - a));
const gMix = (a, b, u) => a + (b - a) * u;

function gBox(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
}
function gText(ctx, txt, x, y, size, col, maxW = 280, weight = 700) {
  txt = String(txt);
  ctx.font = `${weight} ${size}px ${gameFont()}, system-ui, sans-serif`;
  const w = ctx.measureText(txt).width || 0;
  if (w > maxW) ctx.font = `${weight} ${Math.max(8, size * maxW / w)}px ${gameFont()}, system-ui, sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(txt, x, y + 1);
}
// Ficha centrada en (x, y) con labio; sin relleno propio usa la tarjeta del tema con borde.
function gTile(ctx, C, x, y, w, h, txt, fill, o = {}) {
  const f = fill || C.card, r = o.r ?? 10;
  if (o.ring) { ctx.strokeStyle = o.ring; ctx.lineWidth = 2.5; gBox(ctx, x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 9, r + 3); ctx.stroke(); }
  ctx.fillStyle = fill ? shade(f, 0.74) : C.line; gBox(ctx, x - w / 2, y - h / 2 + 3, w, h, r); ctx.fill();
  ctx.fillStyle = f; gBox(ctx, x - w / 2, y - h / 2, w, h, r); ctx.fill();
  if (!fill) { ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; gBox(ctx, x - w / 2, y - h / 2, w, h, r); ctx.stroke(); }
  if (txt != null && txt !== '') gText(ctx, txt, x, y, o.size ?? 16, fill ? inkOn(f, C.ink) : C.ink, w - 8);
}
function gPill(ctx, C, txt, x, y, col, size = 12) {
  ctx.font = `700 ${size}px ${gameFont()}, system-ui, sans-serif`;
  const w = Math.min(280, (ctx.measureText(String(txt)).width || 40) + 18), h = size + 11;
  ctx.fillStyle = col; gBox(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
  gText(ctx, txt, x, y, size, inkOn(col, C.ink), w - 10);
}
function gSlot(ctx, C, x, y, w, h, col, solid) {
  ctx.strokeStyle = col || C.mute; ctx.lineWidth = solid ? 2.5 : 1.5;
  if (!solid) ctx.setLineDash([4, 4]);
  gBox(ctx, x - w / 2, y - h / 2, w, h, 10); ctx.stroke(); ctx.setLineDash([]);
}
const gDark = C => inkOn(C.bg) === '#FFFFFF';
// La mano: la yema del dedo en (x, y). Crema con borde azul noche (se ve sobre cualquier tema y cualquier ficha);
// al presionar se encoge y suelta una onda.
function gHand(ctx, C, x, y, down, pulse = 0) {
  if (down) {
    ctx.strokeStyle = gDark(C) ? C.sun : C.coral; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.85 - 0.6 * pulse;
    ctx.beginPath(); ctx.arc(x, y, 12 + 12 * pulse, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.42); ctx.scale(down ? 0.9 : 1, down ? 0.9 : 1);
  ctx.fillStyle = '#FFF4E2'; ctx.strokeStyle = '#1D2052'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  gBox(ctx, -7, -7, 14, 34, 7); ctx.fill(); ctx.stroke();          // dedo
  gBox(ctx, -13, 16, 30, 24, 9); ctx.fill(); ctx.stroke();         // palma
  ctx.fillStyle = '#FFF4E2'; ctx.fillRect(-5.5, 13, 11, 8);          // une dedo y palma
  ctx.restore();
}
// Mano que va de un punto a otro: u en 0…1.
const gGo = (a, b, u) => [gMix(a[0], b[0], u), gMix(a[1], b[1], u)];
function gHeart(ctx, x, y, s, col) {
  ctx.fillStyle = col; ctx.beginPath();
  ctx.arc(x - s * 0.42, y - s * 0.2, s * 0.5, 0, 6.2832); ctx.arc(x + s * 0.42, y - s * 0.2, s * 0.5, 0, 6.2832); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - s * 0.9, y + s * 0.05); ctx.lineTo(x + s * 0.9, y + s * 0.05); ctx.lineTo(x, y + s); ctx.closePath(); ctx.fill();
}

const GUIDE_SCENES = {
  // Tocar fichas: o = { items: [etiquetas], pick: [índices en orden] }
  tap(ctx, C, t, o) {
    const items = o.items || ['A', 'B', 'C'], picks = [].concat(o.pick ?? 0), n = items.length, gap = 8;
    const w = Math.min(n === 1 ? 150 : 70, (284 - (n - 1) * gap) / n), x0 = 150 - (n * w + (n - 1) * gap) / 2 + w / 2, y = 58;
    const X = i => x0 + i * (w + gap), m = picks.length, span = 0.82 / m, on = new Set();
    let h = [150, 138], down = false, pulse = 0;
    picks.forEach((pi, k) => {
      const a = 0.05 + k * span;
      if (t < a) return;
      const from = k ? [X(picks[k - 1]) + w * 0.24, y + 17] : [150, 138];
      h = gGo(from, [X(pi) + w * 0.24, y + 17], gSeg(t, a, a + span * 0.5));   // la yema toca abajo a la derecha: no tapa el rótulo
      const pr = (t - (a + span * 0.55)) / (span * 0.3);
      down = pr >= 0 && pr <= 1; pulse = Math.max(0, Math.min(1, pr));
      if (pr >= 0) on.has(pi) && o.toggle ? on.delete(pi) : on.add(pi);
    });
    items.forEach((s, i) => gTile(ctx, C, X(i), y, w, 46, s, on.has(i) ? C.mint : null, { ring: on.has(i) ? C.ok : null, size: 17 }));
    gHand(ctx, C, h[0], h[1], down, pulse);
  },
  // Arrastrar una ficha a una casilla: o = { tile, slot, cord (cuerda entre dos etiquetas), dot (se arrastra un punto) }
  drag(ctx, C, t, o) {
    const A = [76, 104], B = [222, 50], u = gSeg(t, 0.3, 0.68), placed = t > 0.7;
    const pos = [gMix(A[0], B[0], u), gMix(A[1], B[1], u) - Math.sin(Math.PI * u) * 12];
    if (o.dot) {
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let i = 0; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(30 + i * 40, 18); ctx.lineTo(30 + i * 40, 132); ctx.stroke(); }
      for (let j = 0; j <= 3; j++) { ctx.beginPath(); ctx.moveTo(30, 18 + j * 38); ctx.lineTo(270, 18 + j * 38); ctx.stroke(); }
      ctx.strokeStyle = placed ? C.ok : C.mute; ctx.lineWidth = 2; ctx.setLineDash(placed ? [] : [4, 4]);
      ctx.beginPath(); ctx.arc(B[0], B[1], 15, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.sky; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(pos[0], pos[1]); ctx.stroke();
      ctx.fillStyle = C.sky; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(pos[0], pos[1], 17, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(pos[0], pos[1], 9, 0, 6.2832); ctx.fill();
    } else if (o.cord) {
      gTile(ctx, C, A[0], A[1], 84, 40, o.tile ?? 'A', C.sky);
      gTile(ctx, C, B[0], B[1], 84, 40, o.slot ?? 'B', null, { ring: placed ? C.ok : null });
      gTile(ctx, C, B[0], 112, 84, 40, o.other ?? '…', null);
      ctx.strokeStyle = placed ? C.ok : C.coral; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(A[0] + 42, A[1]); ctx.lineTo(placed ? B[0] - 42 : pos[0], placed ? B[1] : pos[1]); ctx.stroke();
    } else {
      gSlot(ctx, C, B[0], B[1], 92, 46, placed ? C.ok : C.mute, placed);
      if (o.slot) gText(ctx, o.slot, B[0], B[1] + 36, 12, C.mute, 130);
      gSlot(ctx, C, A[0], A[1], 84, 40, C.line);
      gTile(ctx, C, pos[0], pos[1], 84, 40, o.tile ?? '5', C.sky, { size: 16 });
    }
    const pre = gSeg(t, 0.04, 0.24), h = t < 0.26 ? gGo([150, 140], [A[0], A[1] + 12], pre) : t < 0.74 ? [pos[0], pos[1] + 12] : gGo([B[0], B[1] + 12], [B[0] + 22, B[1] + 40], gSeg(t, 0.74, 0.9));
    gHand(ctx, C, h[0], h[1], t > 0.24 && t < 0.72, gSeg(t, 0.24, 0.34));
  },
  // Botones − / +: o = { from, to, label }
  step(ctx, C, t, o) {
    const from = o.from ?? 2, to = o.to ?? 4, dir = to >= from ? 1 : -1, n = Math.max(1, Math.min(3, Math.abs(to - from)));
    let done = 0, down = false, pulse = 0;
    for (let k = 0; k < n; k++) { const a = 0.24 + k * 0.19, pr = (t - a) / 0.1; if (pr >= 0) done = k + 1; if (pr >= 0 && pr <= 1) { down = true; pulse = pr; } }
    const v = from + dir * done, y = 98,   /* cada toque suma o resta uno */ bx = 150 + dir * 68;
    const shown = Math.min(12, Math.abs(v)), bw = 16, x0 = 150 - (shown * (bw + 4) - 4) / 2;
    for (let i = 0; i < shown; i++) { ctx.fillStyle = i >= Math.min(12, Math.abs(from)) ? C.mint : C.sky; gBox(ctx, x0 + i * (bw + 4), 30, bw, 26, 5); ctx.fill(); }
    ctx.fillStyle = C.card; ctx.strokeStyle = C.line; ctx.lineWidth = 2; gBox(ctx, 60, y - 20, 180, 40, 14); ctx.fill(); ctx.stroke();
    for (const s of [-1, 1]) {
      const hot = s === dir && down;
      ctx.fillStyle = hot ? C.mint : C.sky; ctx.beginPath(); ctx.arc(150 + s * 68, y, 14, 0, 6.2832); ctx.fill();
      gText(ctx, s < 0 ? '−' : '+', 150 + s * 68, y - 1, 20, inkOn(hot ? C.mint : C.sky, C.ink));
    }
    gText(ctx, negTxt(v), 150, y, 20, C.ink, 80);
    if (o.label) gText(ctx, o.label, 150, y + 34, 12, C.mute, 200);
    const h = gGo([150, 142], [bx, y + 12], gSeg(t, 0.04, 0.2));
    gHand(ctx, C, h[0], h[1], down, pulse);
  },
  // Deslizar una perilla (o.vert: subir una barra): o = { label }
  slide(ctx, C, t, o) {
    const u = gSeg(t, 0.28, 0.7), down = t > 0.22 && t < 0.74;
    let k;
    if (o.vert) {
      const base = 126, hgt = gMix(34, 88, u), goal = base - 88;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60, base); ctx.lineTo(240, base); ctx.stroke();
      ctx.fillStyle = C.line; gBox(ctx, 84, base - 60, 40, 60, 6); ctx.fill();
      ctx.strokeStyle = C.mute; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(150, goal); ctx.lineTo(230, goal); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = t > 0.7 ? C.mint : C.sky; gBox(ctx, 170, base - hgt, 40, hgt, 6); ctx.fill();
      k = [190, base - hgt];
    } else {
      const x0 = 46, x1 = 254, y = 84, x = gMix(x0 + 30, x1 - 44, u);
      ctx.lineCap = 'round'; ctx.strokeStyle = C.line; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.strokeStyle = C.sky; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x, y); ctx.stroke();
      ctx.strokeStyle = C.mute; ctx.lineWidth = 1.5;
      for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * 26, y + 12); ctx.lineTo(x0 + i * 26, y + 18); ctx.stroke(); }
      if (o.label) gPill(ctx, C, o.label, x, y - 30, t > 0.7 ? C.mint : C.sky);
      k = [x, y];
    }
    ctx.fillStyle = C.cream; ctx.strokeStyle = C.night; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(k[0], k[1], 11, 0, 6.2832); ctx.fill(); ctx.stroke();
    const h = t < 0.24 ? gGo([150, 142], [k[0], k[1] + 12], gSeg(t, 0.04, 0.22)) : [k[0], k[1] + 12];
    gHand(ctx, C, h[0], h[1], down, gSeg(t, 0.22, 0.32));
  },
  // Girar alrededor de un centro (ruedas, agujas, brújulas).
  turn(ctx, C, t) {
    const cx = 150, cy = 80, r = 50, a0 = -0.25, a = gMix(a0, -2.1, gSeg(t, 0.28, 0.7));
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.stroke();
    for (let i = 0; i < 12; i++) { const b = i * 0.5236; ctx.beginPath(); ctx.moveTo(cx + Math.cos(b) * (r - 5), cy + Math.sin(b) * (r - 5)); ctx.lineTo(cx + Math.cos(b) * r, cy + Math.sin(b) * r); ctx.stroke(); }
    ctx.fillStyle = C.sky; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r - 8, a, a0); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.mute; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r); ctx.stroke();
    const k = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    ctx.strokeStyle = C.sky; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(k[0], k[1]); ctx.stroke();
    ctx.fillStyle = C.cream; ctx.strokeStyle = C.night; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(k[0], k[1], 10, 0, 6.2832); ctx.fill(); ctx.stroke();
    const h = t < 0.24 ? gGo([230, 140], [k[0], k[1] + 12], gSeg(t, 0.04, 0.22)) : [k[0], k[1] + 12];
    gHand(ctx, C, h[0], h[1], t > 0.22 && t < 0.74, gSeg(t, 0.22, 0.32));
  },
  // Mantener presionado y soltar a tiempo.
  hold(ctx, C, t) {
    const u = gSeg(t, 0.24, 0.66), down = t > 0.2 && t < 0.68, x = 96, base = 126, top = 24, lvl = gMix(8, 62, u);
    ctx.fillStyle = t > 0.68 ? C.mint : C.sky; gBox(ctx, x - 26, base - lvl, 52, lvl, 4); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - 28, top); ctx.lineTo(x - 28, base); ctx.lineTo(x + 28, base); ctx.lineTo(x + 28, top); ctx.stroke();
    ctx.strokeStyle = C.coral; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x - 38, base - 62); ctx.lineTo(x + 38, base - 62); ctx.stroke(); ctx.setLineDash([]);
    gTile(ctx, C, 200, 70, 108, 40, down ? 'presionado…' : t > 0.68 ? '¡suelta!' : 'mantén', down ? C.mint : C.sky, { size: 14 });
    const h = gGo([226, 144], [226, 88], gSeg(t, 0.04, 0.2));
    gHand(ctx, C, h[0], t > 0.72 ? h[1] + 14 * gSeg(t, 0.72, 0.85) : h[1], down, (t * 5) % 1);
  },
  // Lanzar: deslizar hacia el blanco, o (o.back) estirar hacia atrás y soltar.
  fling(ctx, C, t, o) {
    const fly = gSeg(t, 0.5, 0.82);
    if (o.back) {
      const F = [96, 100], pull = gSeg(t, 0.2, 0.46), P = t < 0.5 ? [gMix(F[0], 56, pull), gMix(F[1] - 6, 120, pull)] : [gMix(56, 244, fly), gMix(120, 112, fly) - Math.sin(Math.PI * fly) * 78];
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30, 126); ctx.lineTo(276, 126); ctx.stroke();
      ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = C.mute; ctx.beginPath(); ctx.moveTo(F[0], 126); ctx.lineTo(F[0], F[1]); ctx.moveTo(F[0], F[1]); ctx.lineTo(F[0] - 10, F[1] - 18); ctx.moveTo(F[0], F[1]); ctx.lineTo(F[0] + 10, F[1] - 18); ctx.stroke();
      if (t < 0.5) { ctx.strokeStyle = C.coral; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(F[0] - 10, F[1] - 18); ctx.lineTo(P[0], P[1]); ctx.lineTo(F[0] + 10, F[1] - 18); ctx.stroke(); }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(244, 126); ctx.lineTo(244, 92); ctx.stroke();
      ctx.fillStyle = fly >= 1 ? C.ok : C.coral; ctx.beginPath(); ctx.moveTo(244, 92); ctx.lineTo(266, 99); ctx.lineTo(244, 106); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.sky; ctx.beginPath(); ctx.arc(P[0], P[1], 8, 0, 6.2832); ctx.fill();
      if (t > 0.2 && t < 0.5) gPill(ctx, C, `estirón ${Math.round(1 + pull * 3)}`, 76, 34, C.sky, 11);
      const h = t < 0.2 ? gGo([150, 142], [F[0], F[1] + 8], gSeg(t, 0.04, 0.18)) : t < 0.5 ? [P[0], P[1] + 12] : [56, 132];
      gHand(ctx, C, h[0], h[1], t > 0.18 && t < 0.5, gSeg(t, 0.18, 0.28));
    } else {
      const S0 = [120, 118], T = [214, 40], sw = gSeg(t, 0.2, 0.46), P = t < 0.5 ? S0 : [gMix(S0[0], T[0], fly), gMix(S0[1], T[1], fly) - Math.sin(Math.PI * fly) * 26];
      [[86, '12'], [214, '30']].forEach(([x, s]) => {
        const hit = x === 214 && fly >= 1;
        ctx.strokeStyle = hit ? C.ok : C.coral; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, 44, 26, 8, 0, 0, 6.2832); ctx.stroke();
        gText(ctx, s, x, 24, 14, C.ink);
      });
      if (t > 0.2 && t < 0.5) { ctx.strokeStyle = C.mute; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(S0[0], S0[1]); ctx.lineTo(gMix(S0[0], T[0], sw * 0.5), gMix(S0[1], T[1], sw * 0.5)); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = C.coral; ctx.beginPath(); ctx.arc(P[0], P[1], 11, 0, 6.2832); ctx.fill();
      const h = t < 0.2 ? gGo([150, 144], [S0[0], S0[1] + 12], gSeg(t, 0.04, 0.18)) : t < 0.5 ? [gMix(S0[0], T[0], sw * 0.5), gMix(S0[1], T[1], sw * 0.5) + 12] : [167, 91];
      gHand(ctx, C, h[0], h[1], t > 0.18 && t < 0.48, gSeg(t, 0.18, 0.28));
    }
  },
  // Deslizar: una tarjeta a un lado, un tablero de fichas (o.board) o un corte (o.cut).
  swipe(ctx, C, t, o) {
    const u = gSeg(t, 0.26, 0.62);
    if (o.board) {
      const s = 40, x0 = 150 - 2 * s, y = 58, done = t > 0.62;
      for (let i = 0; i < 4; i++) gSlot(ctx, C, x0 + s / 2 + i * s, y, s - 6, s - 6, C.line);
      if (!done) { gTile(ctx, C, gMix(x0 + s / 2, x0 + 3.5 * s, u), y, s - 8, s - 8, '5', C.sky); gTile(ctx, C, gMix(x0 + 2.5 * s, x0 + 3.5 * s, u), y, s - 8, s - 8, '5', C.sky); }
      else gTile(ctx, C, x0 + 3.5 * s, y, s - 8, s - 8, '10', C.mint, { ring: C.ok });
      const h = t < 0.24 ? gGo([150, 142], [100, 112], gSeg(t, 0.04, 0.22)) : [gMix(100, 200, u), 112];
      ctx.strokeStyle = C.mute; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(100, 104); ctx.lineTo(h[0], 104); ctx.stroke(); ctx.setLineDash([]);
      gHand(ctx, C, h[0], h[1], t > 0.22 && t < 0.64, gSeg(t, 0.22, 0.32));
    } else if (o.cut) {
      const cut = t > 0.5, d = cut ? 3 * gSeg(t, 0.5, 0.7) : 0;
      gPill(ctx, C, o.ref ?? '2/3', 150, 22, C.sky, 13);
      if (cut) { gTile(ctx, C, 104 - d, 76 - d / 2, 30, 40, '', C.mint); gTile(ctx, C, 138 + d, 76 + d / 2, 30, 40, '', C.mint); gText(ctx, o.good ?? '4/6', 121, 76, 16, inkOn(C.mint, C.ink)); }
      else gTile(ctx, C, 121, 76, 64, 40, o.good ?? '4/6', null);
      gTile(ctx, C, 236, 104, 64, 40, o.bad ?? '3/5', null);
      const a = [70, 112], b = [168, 44], h = t < 0.24 ? gGo([150, 144], a, gSeg(t, 0.04, 0.22)) : gGo(a, b, u);
      if (t > 0.24) { ctx.strokeStyle = gDark(C) ? C.sun : C.coral; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(h[0], h[1]); ctx.stroke(); }
      gHand(ctx, C, h[0], h[1] + 12, t > 0.22 && t < 0.64, gSeg(t, 0.22, 0.32));
    } else {
      const x = gMix(150, 196, u), rot = 0.14 * u;
      gPill(ctx, C, o.left ?? '← una', 62, 22, C.line, 12); gPill(ctx, C, o.right ?? 'otra →', 238, 22, t > 0.62 ? C.mint : C.line, 12);
      ctx.save(); ctx.translate(x, 84); ctx.rotate(rot); gTile(ctx, C, 0, 0, 96, 60, o.card ?? '…', null, { size: 15 }); ctx.restore();
      const h = t < 0.24 ? gGo([150, 146], [172, 108], gSeg(t, 0.04, 0.22)) : [x + 22, 108];
      gHand(ctx, C, h[0], h[1], t > 0.22 && t < 0.64, gSeg(t, 0.22, 0.32));
    }
  },
  // Trazar un camino por puntos: o = { labels }
  trace(ctx, C, t, o) {
    const L = o.labels || ['1', '2', '3'], P = [[62, 104], [150, 44], [238, 100]], trap = [150, 112];
    const u = gSeg(t, 0.22, 0.74) * 2, cur = u <= 1 ? gGo(P[0], P[1], u) : gGo(P[1], P[2], u - 1), go = t > 0.2;
    if (go) { ctx.strokeStyle = C.sky; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); if (u > 1) ctx.lineTo(P[1][0], P[1][1]); ctx.lineTo(cur[0], cur[1]); ctx.stroke(); }
    gTile(ctx, C, trap[0], trap[1], 38, 34, o.trap ?? '✕', null, { size: 14 });
    P.forEach((q, i) => { const hit = go && (i === 0 || u >= i - 0.02); gTile(ctx, C, q[0], q[1], 42, 36, L[i] ?? '', hit ? C.mint : null, { ring: hit ? C.ok : null }); });
    const h = go ? [cur[0] + 11, cur[1] + 14] : gGo([150, 144], [P[0][0] + 11, P[0][1] + 14], gSeg(t, 0.03, 0.18));
    gHand(ctx, C, h[0], h[1], go && t < 0.76, gSeg(t, 0.2, 0.3));
  },
  // Escribir en un teclado: o = { text }
  keys(ctx, C, t, o) {
    const keys = [...String(o.text ?? '20'), 'OK'], n = keys.length, w = Math.min(48, 260 / n - 8), x0 = 150 - (n * (w + 8) - 8) / 2 + w / 2, y = 100, span = 0.8 / n;
    let typed = '', h = [150, 144], down = false, pulse = 0, ok = false;
    keys.forEach((k, i) => {
      const a = 0.05 + i * span; if (t < a) return;
      h = gGo(i ? [x0 + (i - 1) * (w + 8) + w * 0.24, y + 15] : [150, 144], [x0 + i * (w + 8) + w * 0.24, y + 15], gSeg(t, a, a + span * 0.5));
      const pr = (t - (a + span * 0.55)) / (span * 0.3);
      if (pr >= 0) { if (k === 'OK') ok = true; else typed += k; }
      down = pr >= 0 && pr <= 1; pulse = Math.max(0, Math.min(1, pr));
    });
    ctx.fillStyle = C.card; ctx.strokeStyle = ok ? C.ok : C.line; ctx.lineWidth = 2; gBox(ctx, 80, 22, 140, 40, 12); ctx.fill(); ctx.stroke();
    gText(ctx, typed || '…', 150, 42, 20, typed ? C.ink : C.mute, 120);
    keys.forEach((k, i) => gTile(ctx, C, x0 + i * (w + 8), y, w, 40, k, k === 'OK' ? (ok ? C.ok : C.sky) : null, { size: 16 }));
    gHand(ctx, C, h[0], h[1], down, pulse);
  },
  // Pintar casillas arrastrando el dedo.
  paint(ctx, C, t) {
    const cols = 8, rows = 3, s = 26, x0 = 150 - cols * s / 2, y0 = 24, u = gSeg(t, 0.22, 0.76) * 11, n = Math.floor(u);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      ctx.fillStyle = i <= n && t > 0.22 ? C.sky : C.card; ctx.strokeStyle = C.line; ctx.lineWidth = 1.5;
      gBox(ctx, x0 + c * s + 2, y0 + r * s + 2, s - 4, s - 4, 5); ctx.fill(); ctx.stroke();
    }
    const i = Math.min(11, u), r = Math.floor(i / cols), c = i - r * cols, p = [x0 + (r ? Math.min(c, cols - 1) : c) * s + s / 2, y0 + r * s + s / 2];
    const h = t < 0.22 ? gGo([150, 144], [x0 + s / 2, y0 + s / 2 + 12], gSeg(t, 0.04, 0.2)) : [p[0], p[1] + 12];
    gPill(ctx, C, `${t > 0.22 ? n + 1 : 0} pintadas`, 150, 124, C.sky, 12);
    gHand(ctx, C, h[0], h[1], t > 0.2 && t < 0.78, gSeg(t, 0.2, 0.3));
  },
  // Tocar la pantalla (saltar, aletear, disparar): o = { label }
  touch(ctx, C, t, o) {
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); gBox(ctx, 40, 16, 220, 118, 16); ctx.stroke(); ctx.setLineDash([]);
    let down = false, pulse = 0, pop = 0;
    for (const a of [0.24, 0.58]) { const pr = (t - a) / 0.16; if (pr >= 0 && pr <= 1) { down = true; pulse = pr; } if (pr >= 0 && pr <= 1.8) pop = Math.sin(Math.min(1, pr / 1.8) * Math.PI); }
    const by = 60 - pop * 26;
    ctx.fillStyle = C.sky; ctx.beginPath(); ctx.arc(110, by, 13, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60, 76); ctx.lineTo(240, 76); ctx.stroke();
    if (o.label && pop > 0.15) gPill(ctx, C, o.label, 186, 44, C.mint, 12);
    const h = gGo([190, 142], [190, 112], gSeg(t, 0.04, 0.2));
    gHand(ctx, C, h[0], h[1], down, pulse);
  },
  // Pestañas de rondas.
  rounds(ctx, C, t, o) {
    const n = Math.max(2, Math.min(5, o.n ?? 3)), w = 46, x0 = 150 - (n * (w + 8) - 8) / 2 + w / 2, y = 46, on = t > 0.56;
    for (let i = 0; i < n; i++) {
      const done = i === 0, sel = on ? i === 1 : i === 0;
      gTile(ctx, C, x0 + i * (w + 8), y, w, 32, done ? '✓' : i + 1, done ? C.ok : sel ? C.sky : null, { ring: sel ? (gDark(C) ? C.sun : C.coral) : null, size: 15 });
    }
    gPill(ctx, C, `Ronda ${on ? 2 : 1} de ${o.n ?? n}`, 150, 104, on ? C.sky : C.line, 13);
    const h = gGo([150, 144], [x0 + w + 8 + 11, y + 13], gSeg(t, 0.1, 0.44)), pr = (t - 0.48) / 0.14;
    gHand(ctx, C, h[0], h[1], pr >= 0 && pr <= 1, Math.max(0, Math.min(1, pr)));
  },
  // Vidas de los juegos de acción.
  lives(ctx, C, t) {
    const lost = t > 0.3 && t < 0.72;
    for (let i = 0; i < 3; i++) {
      const off = lost && i === 2, x = 104 + i * 46;
      gHeart(ctx, x, 52, 17, off ? C.line : C.coral);
      if (off) { ctx.strokeStyle = C.mute; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 15, 68); ctx.lineTo(x + 15, 38); ctx.stroke(); }
    }
    gPill(ctx, C, lost ? 'Un error quita una vida' : t >= 0.72 ? 'Sin vidas, la ronda vuelve a empezar' : 'Tres vidas por ronda', 150, 108, lost ? C.coral : C.sky, 12);
  },
  // Cartel «Toca para empezar».
  start(ctx, C, t) {
    const gone = gSeg(t, 0.62, 0.8);
    ctx.globalAlpha = 1 - gone;
    ctx.fillStyle = shade(C.card, 0.8); gBox(ctx, 50, 38, 200, 62, 14); ctx.fill();
    ctx.fillStyle = C.card; ctx.strokeStyle = C.sky; ctx.lineWidth = 3; gBox(ctx, 50, 34, 200, 62, 14); ctx.fill(); ctx.stroke();
    gText(ctx, 'Toca para empezar', 150, 56, 16, C.ink, 180); gText(ctx, 'Sin prisa', 150, 78, 12, C.mute, 180, 500);
    ctx.globalAlpha = 1;
    if (gone > 0.5) gPill(ctx, C, '¡A jugar!', 150, 66, C.mint, 14);
    const h = gGo([150, 146], [150, 108], gSeg(t, 0.1, 0.42)), pr = (t - 0.46) / 0.14;
    gHand(ctx, C, h[0], h[1], pr >= 0 && pr <= 1, Math.max(0, Math.min(1, pr)));
  },
  // Botón «Comprobar».
  check(ctx, C, t) {
    const ok = t > 0.6;
    gTile(ctx, C, 150, 66, 200, 48, ok ? '✓  ¡Bien!' : 'Comprobar', ok ? C.ok : C.brand, { r: 16, size: 17 });
    const h = gGo([150, 146], [150, 84], gSeg(t, 0.1, 0.42)), pr = (t - 0.46) / 0.14;
    gHand(ctx, C, h[0], h[1], pr >= 0 && pr <= 1, Math.max(0, Math.min(1, pr)));
  },
};

// Juegos de acción (cartel de inicio y vidas): la guía les añade esos dos pasos.
const GUIDE_ARCADE = new Set(['lluvia-elementos', 'revienta-globos', 'luciernagas-venn', 'buzo-enteros', 'carrera-fracciones', 'frena-aguja',
  'dispara-inverso', 'salta-signos', 'serpiente-orden', 'sirve-la-razon', 'corta-proporciones', 'resortera-tres', 'caja-veloz', 'vuela-precios',
  'rompe-cambios', 'traza-progresion', 'encesta-suma', 'dobla-fichas', 'rana-zenon', 'maquina-sigma', 'torre-pisos', 'escala-leyes',
  'siembra-raices', 'muro-radicales', 'jefe-venn']);

// Los pasos propios de cada juego: [escena, texto, opciones]. El ejemplo de la escena es pequeño y distinto de los
// ejercicios: enseña el gesto, no la respuesta.
const GUIDES = {
  'acorrala-raiz': [['tap', 'Toca el tramo donde vive la raíz: está donde las marcas cambian de color.', { items: ['1.3', '1.4', '1.5'], pick: [1] }], ['tap', 'Cada toque abre una lupa: repite con las cifras que siguen.', { items: ['1.41', '1.42'], pick: [0] }]],
  'afina-sistema': [['step', 'Mueve un coeficiente con − / + y mira cómo gira o se desliza su recta.', { from: 1, to: 3, label: 'coeficiente' }]],
  'ajusta-capital': [['slide', 'Arrastra la pila de billetes para fijar el capital; el monto final se calcula solo.', { vert: true }]],
  'alcancias-gemelas': [['slide', 'Mueve la tasa simple hasta que las dos alcancías queden al mismo nivel.', { label: 'tasa' }]],
  'apila-alturas': [['slide', 'Arrastra cada cuenta hacia arriba o abajo hasta la altura que sale de operar f y g.', { vert: true }]],
  'arbol-potencia': [['step', 'Elige con − / + las ramas por nudo y los niveles: el árbol crece solo y cuenta sus hojas.', { from: 2, to: 3, label: 'niveles' }]],
  'arma-conjunto': [['tap', 'Toca las fichas para meterlas a las llaves o sacarlas, hasta cumplir la condición.', { items: ['a', 'e', 'm'], pick: [0, 1] }]],
  'arma-notacion': [['tap', 'Toca las fichas en orden para escribir el conjunto: nombre, igual, llave y elementos.', { items: ['A', '=', '{', '1'], pick: [0, 1, 2, 3] }]],
  'arma-producto': [['tap', 'Elige dos o más fichas: la máquina las multiplica y cuenta cuántas son negativas.', { items: ['−2', '3', '−5'], pick: [0, 2] }]],
  'arma-regla': [['drag', 'Arrastra cada dato a la tabla: misma magnitud en la columna, misma situación en la fila.', { tile: '6 kg', slot: 'kilos' }], ['tap', 'Luego elige las flechas: paralelas si es directa, cruzadas si es inversa.', { items: ['⇉', '⤨'], pick: [0] }]],
  'arma-sigma': [['drag', 'Arrastra cada ficha a su casilla de la Σ: dónde empieza, dónde termina y el término.', { tile: 'k = 1', slot: 'abajo de la Σ' }]],
  'arma-tramos': [['slide', 'Arrastra las asas de cada tramo hasta su altura.', { vert: true }], ['tap', 'En el corte, decide si el punto de cada tramo va lleno o vacío.', { items: ['●', '○'], pick: [1] }]],
  'arma-triangulo': [['drag', 'Arrastra las esquinas del triángulo: los catetos cambian y la razón se calcula en vivo.', { dot: true }]],
  'ascensor': [['tap', 'Toca el piso donde termina el ascensor después de subir o bajar.', { items: ['−1', '0', '1', '2'], pick: [0] }]],
  'atajo-axiomas': [['tap', 'Toca el axioma que quieres usar: la expresión se reescribe sola. Si no sirve, tiembla.', { items: ['conm.', 'asoc.', 'distr.'], pick: [2] }]],
  'atrapa-elementos': [['tap', 'Toca las fichas que cumplen la condición: entran a las llaves. Otro toque las saca.', { items: ['3', '4', '6', '7'], pick: [0, 1, 2, 1], toggle: true }]],
  'atrapa-punto': [['tap', 'Toca el punto de la circunferencia que cumple la pista.', { items: ['30°', '45°', '60°'], pick: [1] }]],
  'balancin': [['slide', 'Arrastra el apoyo por la tabla (o usa − / +) hasta que quede en equilibrio.', {}]],
  'balanza-exponencial': [['step', 'Cambia x con − / +: cada platillo muestra su valor y el brazo cae hacia el mayor.', { from: 1, to: 3, label: 'x' }]],
  'balanza-proporcion': [['slide', 'Desliza x hasta que la balanza quede horizontal.', { label: 'x' }]],
  'bascula': [['slide', 'Arrastra la rueda del precio arriba o abajo (o toca − / +) hasta lo que cuestan los kilos.', { vert: true }]],
  'bodegas': [['slide', 'Arrastra el divisor para repartir los sacos; al soltar, una parte viaja de A a B.', {}]],
  'bolsa-razon': [['step', 'Pon o quita bolas de cada color con − / + hasta que la bolsa cumpla la razón.', { from: 2, to: 3, label: 'rojas' }]],
  'brazo-robot': [['drag', 'Arrastra la pinza para doblar el codo (o ajusta con − / +) hasta la gema.', { dot: true }]],
  'buzo-enteros': [['slide', 'Arrastra al buzo arriba o abajo y espera, a la altura del resultado, a que llegue su perla.', { vert: true }]],
  'cadena-cambios': [['tap', 'Toca dos sellos de la bandeja: la etiqueta muestra el precio después de cada uno.', { items: ['+10 %', '−50 %', '+20 %'], pick: [0, 1] }]],
  'cadena-razones': [['tap', 'Toca una tarjeta para voltear su fracción; el resultado se recalcula solo.', { items: ['9/7', '3/4'], pick: [0] }]],
  'caja-veloz': [['keys', 'Escribe el resultado en el teclado y toca OK.', { text: '20' }]],
  'cajas-numericas': [['drag', 'Arrastra cada número a la caja más pequeña que lo contiene.', { tile: '−3', slot: 'ℤ' }]],
  'cambia-de-piso': [['tap', 'Toca una potencia para mandarla al otro piso de la fracción: su exponente cambia de signo.', { items: ['a⁻³', 'b²'], pick: [0] }]],
  'cancela-balanza': [['tap', 'Toca una ficha de la izquierda y luego una igual de la derecha: las dos se van.', { items: ['3', 'x', '=', '3', '5'], pick: [0, 3] }]],
  'candado-absoluto': [['step', 'Gira cada rueda con ▲ / ▼: centro, símbolo y radio escriben la desigualdad.', { from: 2, to: 3, label: 'radio' }]],
  'candado-fraccion': [['step', 'Gira las ruedas con ▲ / ▼ para armar la fracción; el visor muestra su decimal.', { from: 3, to: 4, label: 'numerador' }]],
  'canon-inverso': [['turn', 'Arrastra el cañón (o usa − / +) para apuntar; solo cuenta lo que está dentro del rango.', {}]],
  'carrera-fracciones': [['tap', 'Toca una puerta para medirla en la regla, junto al número pedido.', { items: ['2/8', '0.5', '3/4'], pick: [0] }], ['tap', 'Si las dos barras miden lo mismo, tócala otra vez y el corredor pasa.', { items: ['2/8', '0.5', '3/4'], pick: [0, 0] }]],
  'carrera-interes': [['slide', 'Desliza el tiempo: los dos corredores avanzan y el medidor muestra la ventaja.', { label: 'mes' }]],
  'cascada': [['tap', 'Toca los stickers de descuento: el precio cae con cada uno.', { items: ['−20 %', '−10 %'], pick: [0, 1] }], ['slide', 'Luego fija con el deslizador el descuento único que da lo mismo.', { label: '%' }]],
  'clasifica-cartas': [['swipe', 'Desliza la tarjeta hacia el lado de su categoría (o usa los botones).', {}]],
  'cobra-intereses': [['tap', 'Toca el mes siguiente para cobrar su interés; el acumulado sube.', { items: ['1', '2', '3', '4'], pick: [0, 1, 2] }]],
  'cofre-candados': [['tap', 'Toca las llaves en el orden que deshace la función: el último candado se abre primero.', { items: ['− 3', '÷ 2', '√'], pick: [1, 0] }]],
  'combina-vectores': [['step', 'Con las perillas elige cuántas veces va cada vector: el camino se dibuja solo.', { from: 1, to: 2, label: 'a' }]],
  'compas-ambiguo': [['drag', 'Arrastra la punta del compás hasta la base; si la toca, suéltala ahí.', { dot: true }], ['tap', 'Si el brazo no alcanza, toca «No hay triángulo».', { items: ['No hay triángulo'], pick: [0] }]],
  'compas-raiz': [['step', 'Elige los catetos con − / +: la diagonal es la raíz que buscas.', { from: 1, to: 2, label: 'cateto' }], ['tap', 'Toca «Girar» y el compás acuesta la diagonal sobre la recta.', { items: ['Girar'], pick: [0] }]],
  'completa-cuadrado': [['step', 'Pasa unidades de la bandeja a la esquina con − / + hasta llenar el hueco.', { from: 1, to: 4, label: 'en la esquina' }]],
  'completa-simetria': [['slide', 'Arrastra los puntos de la izquierda hacia arriba o abajo para completar la simetría.', { vert: true }]],
  'conica-viva': [['step', 'Mueve las perillas del centro y de la forma: la cónica cambia en vivo.', { from: 1, to: 3, label: 'h' }]],
  'correa-del-perro': [['slide', 'Mueve el poste y estira la correa sobre la recta.', {}], ['tap', 'Elige la zona (adentro o afuera) y si las puntas cuentan.', { items: ['adentro', 'afuera'], pick: [0] }]],
  'corredores-dobles': [['hold', 'Mantén presionado «Correr» y suelta cuando se cumpla la condición; − / + ajustan.', {}]],
  'corta-pizza': [['turn', 'Arrastra el borde de la porción para abrirla; el arco y el área se calculan solos.', {}]],
  'corta-proporciones': [['swipe', 'Desliza el dedo para cortar las fichas que valen lo mismo que la fracción de arriba.', { cut: true }]],
  'corta-rectangulo': [['slide', 'Arrastra el corte: salta de cuadrito en cuadrito y parte el rectángulo en dos áreas.', {}]],
  'crece-planta': [['slide', 'Arrastra cada planta (o usa los botones) hasta la altura del mes que le toca.', { vert: true }]],
  'cruz-asintotas': [['drag', 'Arrastra la cruz punteada: la curva se dibuja pegada a ella.', { dot: true }]],
  'cruz-porcentaje': [['drag', 'Arrastra cada dato a su casilla de la cruz; la incógnita va con «?».', { tile: '?', slot: 'casilla B' }]],
  'cuadrado-media': [['drag', 'Arrastra la esquina del cuadrado hasta que su área iguale la del rectángulo.', { dot: true }]],
  'cuadricula-cien': [['paint', 'Arrastra el dedo para pintar casillas: por ciento es «de cada 100».', {}]],
  'cuenta-factores': [['step', 'Cuenta las x del dibujo y elige el exponente del resultado con − / +.', { from: 3, to: 5, label: 'exponente' }]],
  'cuenta-saltos': [['step', 'Elige los saltos con − / +: el juego dibuja los postes y hace la cuenta.', { from: 2, to: 4, label: 'saltos' }]],
  'cuerdas-iguales': [['slide', 'Desliza el anillo por el riel hasta que las dos cuerdas midan lo mismo.', {}]],
  'cumple-notacion': [['tap', 'Toca una ficha para meterla a la bolsa o sacarla, hasta que todas las frases se cumplan.', { items: ['perro', 'pez', 'gato'], pick: [0, 2] }]],
  'detective-pasos': [['tap', 'Toca la línea donde está el primer error.', { items: ['paso 1', 'paso 2', 'paso 3'], pick: [1] }], ['step', 'Con ‹ › elige cómo debía quedar ese paso.', { from: 1, to: 2, label: 'arreglo' }]],
  'detector-identidades': [['slide', 'Arrastra la lupa por el eje x y compara el valor de cada lado.', {}], ['tap', 'Luego decide: «Contraejemplo aquí» o «Es identidad».', { items: ['Contraejemplo', 'Identidad'], pick: [1] }]],
  'dibuja-intervalo': [['slide', 'Arrastra las dos asas sobre la recta hasta los extremos del intervalo.', {}], ['tap', 'Toca un asa para cambiarla entre llena (incluido) y vacía (excluido).', { items: ['●', '○'], pick: [1] }]],
  'directa-inversa': [['drag', 'Arrastra cada situación a la caja de su relación.', { tile: 'situación', slot: 'inversa' }]],
  'dispara-inverso': [['touch', 'Toca hacia donde quieres disparar: la ficha vuela hacia allá. Apúntale a su pareja.', { label: '¡fuego!' }]],
  'distancia-justa': [['slide', 'Coloca b en la recta: la cuerda muestra la distancia hasta a.', { label: 'b' }]],
  'dobla-fichas': [['swipe', 'Desliza el dedo hacia un lado: las fichas se corren y dos iguales se funden en el doble.', { board: true }]],
  'dobla-la-recta': [['slide', 'Pon el punto donde cae el valor absoluto: la recta se dobla por el cero.', {}]],
  'dobla-negativos': [['tap', 'Toca un trozo de la gráfica para doblarlo sobre el eje x; otro toque lo desdobla.', { items: ['∩', '∪', '∩'], pick: [1] }]],
  'domino-equivalencias': [['tap', 'Toca fichas para encadenarlas: cada cara debe valer lo mismo que la anterior.', { items: ['¼ | 2', '0.5 | ¼', '2 | 1'], pick: [1, 0] }]],
  'dos-escaleras': [['slide', 'Sube o baja la tapa hasta que las dos escaleras encajen sin huecos.', { vert: true }]],
  'dos-etapas': [['turn', 'Gira la perilla de la entrada: la máquina recalcula las dos etapas.', {}]],
  'duplica-magnitud': [['slide', 'Sube o baja la barra de «Después» hasta su nuevo valor.', { vert: true }]],
  'encadena-angulos': [['turn', 'Gira el primer brazo hasta un ángulo notable; el segundo suma o resta desde ahí.', {}]],
  'encesta-suma': [['fling', 'Desliza el dedo hacia la canasta de la suma y suelta para lanzar el balón.', {}]],
  'encuesta-venn': [['step', 'En cada zona del diagrama pon con − / + cuántas personas hay.', { from: 3, to: 5, label: 'solo en A' }]],
  'engranajes': [['step', 'Fija con − / + el dato que falta de la rueda B y compara los contadores.', { from: 8, to: 10, label: 'dientes' }]],
  'escala-leyes': [['tap', 'Toca las tarjetas en el orden que deja al escalador en la bandera. Se puede deshacer.', { items: ['· x³', '( )²', '÷ x⁴'], pick: [0, 1] }]],
  'escalera-aritmetica': [['slide', 'Arrastra el segundo peldaño: fija la diferencia y toda la escalera se acomoda.', { vert: true }]],
  'espejo-diagonal': [['drag', 'Arrastra cada ficha hasta su reflejo en el espejo y = x.', { dot: true }]],
  'espiral-potencias': [['step', 'Con «× z» y «÷ z» elige cuántas veces multiplicar; la espiral se ve al comprobar.', { from: 2, to: 4, label: 'n' }]],
  'estira-barra': [['slide', 'Estira o encoge la barra con el tirador (o − / +) hasta el porcentaje pedido.', { label: '%' }]],
  'estira-foto': [['slide', 'Arrastra el borde de abajo para fijar el alto sin deformar la foto.', { vert: true }]],
  'etiqueta-rebaja': [['drag', 'Arrastra a cada etiqueta el sticker con su precio final.', { tile: '$ 80', slot: 'etiqueta −20 %' }]],
  'fabrica-subconjuntos': [['tap', 'En cada caja toca los elementos para encenderlos o apagarlos: todas deben ser distintas.', { items: ['a', 'b', 'c'], pick: [0, 2] }]],
  'fila-a-fila': [['tap', 'Toca la fila que cambia (y la otra, si hace falta) y elige la operación.', { items: ['F1', 'F2', 'F3'], pick: [1, 0] }], ['step', 'Elige k con las perillas y aplica. Se puede deshacer.', { from: 1, to: 2, label: 'k' }]],
  'flecha-vector': [['drag', 'Arrastra la punta de la flecha sobre la cuadrícula para construir el vector.', { dot: true }]],
  'flor-de-raices': [['turn', 'Gira la flor arrastrando un pétalo y elige el radio con − / +.', {}]],
  'frena-aguja': [['slide', 'Arrastra el punto sobre la recta: el cuadrado crece con él y muestra su área.', {}], ['tap', 'Ajusta con − / + y toca «¡Listo!» cuando el área sea la pedida.', { items: ['−', '+', '¡Listo!'], pick: [1, 2] }]],
  'fuga-de-familia': [['tap', 'Mete dos fichas en la máquina, en orden, para que el resultado se escape de la casa.', { items: ['3', '8', '5'], pick: [0, 1] }]],
  'grafica-relacion': [['slide', 'Arrastra cada punto en vertical hasta que la relación sea la pedida.', { vert: true }]],
  'inversos-gemelos': [['step', 'Arma el gemelo con el signo y las ruedas − / +; la máquina muestra el resultado.', { from: 2, to: 3, label: 'numerador' }]],
  'jefe-venn': [['tap', 'Toca los elementos del conjunto que ordena el Guardián y luego ataca.', { items: ['1', '2', '3', '4'], pick: [1, 2] }], ['drag', 'En otras fases, arrastra elementos de una zona a otra del diagrama.', { tile: '5', slot: 'zona A ∩ B' }]],
  'la-obra': [['drag', 'Arrastra obreros de la banca a la obra (o usa ±): el calendario cuenta los días.', { tile: 'obrero', slot: 'la obra' }]],
  'laberinto-valor': [['trace', 'Traza el camino de la entrada a la salida pisando solo casillas que cumplen la regla.', { labels: ['2', '4', '6'], trap: '5' }]],
  'lado-del-cuadrado': [['drag', 'Arrastra la esquina del cuadrado: el área se calcula sola; − y + ajustan fino.', { dot: true }]],
  'laser-recta': [['step', 'Con las perillas «sube», «avanza» y el corte, alinea el láser con los dos cristales.', { from: 1, to: 2, label: 'sube' }]],
  'limite-serie': [['tap', 'Toca «+ término» para sumar saltos cada vez más cortos.', { items: ['+ término'], pick: [0, 0] }], ['slide', 'Arrastra el marcador al valor al que se acerca la suma.', {}]],
  'limonada': [['tap', 'Toca los botones para echar limones y agua: el color depende de la razón.', { items: ['+ limón', '+ agua'], pick: [0, 1] }]],
  'lluvia-elementos': [['slide', 'Arrastra la canasta de lado a lado: atrapa lo que pertenece y esquiva lo que no.', { label: 'canasta' }]],
  'luciernagas-venn': [['tap', 'Toca una luciérnaga cuando esté en la zona de la operación pedida.', { items: ['✦', '✦', '✦'], pick: [1] }]],
  'lupa-densidad': [['tap', 'Amplía con la lupa (+) hasta ver espacio entre las dos banderitas.', { items: ['−', '+'], pick: [1, 1] }], ['slide', 'Suelta el punto estrictamente entre las dos.', {}]],
  'mapa-tesoro': [['turn', 'Gira la brújula para dar el rumbo.', {}], ['step', 'Con − / + elige los pasos exactos; la caminata se ve al comprobar.', { from: 2, to: 3, label: 'pasos' }]],
  'maquina-sigma': [['drag', 'Arrastra de la bandeja la ficha del término que pide la máquina.', { tile: '20', slot: '5k con k = 4' }]],
  'mejor-oferta': [['drag', 'Arrastra el carrito a la vitrina que sale más barata.', { tile: 'carrito', slot: 'vitrina' }]],
  'mezcla': [['tap', 'Toca «+ 10 g» para añadir agua (o «− 10 g»): el medidor muestra el % de alcohol.', { items: ['− 10 g', '+ 10 g'], pick: [1, 1] }]],
  'mide-altura': [['slide', 'Arrastra al topógrafo por el suelo hasta que vea la cima con el ángulo pedido.', {}]],
  'mueve-circulos': [['drag', 'Arrastra el círculo B para dibujar cómo se relaciona con A.', { dot: true }]],
  'mueve-parabola': [['drag', 'Toca o arrastra en la cuadrícula para poner el vértice.', { dot: true }], ['step', 'Con − / + cambia a: la parábola se abre o se cierra.', { from: 1, to: 2, label: 'a' }]],
  'muro-radicales': [['tap', 'Toca ladrillos del montón para ponerlos en fila hasta que mida lo pedido.', { items: ['√3', '√12', '√2'], pick: [0, 1] }]],
  'noria': [['turn', 'Gira la noria arrastrando la cabina dorada hasta un ángulo que cumpla la condición.', {}]],
  'ordena-terminos': [['drag', 'Arrastra las fichas a las cajas en el orden de la expansión.', { tile: '3k', slot: 'primera caja' }]],
  'parejas-gauss': [['tap', 'Toca dos fichas para unirlas con una cuerda: cada pareja debe sumar lo mismo.', { items: ['1', '2', '9', '10'], pick: [0, 3] }]],
  'pares-negativos': [['tap', 'Toca dos factores negativos para emparejarlos: cada pareja da positivo.', { items: ['−2', '−2', '−2'], pick: [0, 1] }], ['tap', 'Al final elige el signo del resultado.', { items: ['+', '−'], pick: [1] }]],
  'parte-baldosa': [['step', 'Parte la baldosa en una cuadrícula más fina con − / +.', { from: 1, to: 2, label: 'cortes por lado' }]],
  'parte-sigma': [['step', 'Cuenta las piezas de cada color y escribe la suma con − / +.', { from: 2, to: 4, label: 'piezas' }]],
  'pasaporte-numeros': [['tap', 'Toca las casillas para sellar todas las familias a las que pertenece el número.', { items: ['ℕ', 'ℤ', 'ℚ'], pick: [1, 2] }]],
  'pesca-raices': [['tap', 'Toca las marcas del muelle donde la ola cruza el agua para lanzar anzuelos.', { items: ['π/6', 'π/2', '5π/6'], pick: [0, 2] }]],
  'pinta-personas': [['tap', 'Toca las personitas para pintarlas hasta tener el porcentaje pedido.', { items: ['☺', '☺', '☺', '☺'], pick: [0, 1] }]],
  'pinta-venn': [['tap', 'Toca una zona del diagrama para pintarla o despintarla.', { items: ['solo A', 'A ∩ B', 'solo B'], pick: [0] }]],
  'piramide-numerica': [['drag', 'Arrastra fichas a los bloques vacíos: cada bloque sale de los dos que lo sostienen.', { tile: '7', slot: 'sobre 3 y 4' }]],
  'pisa-huellas': [['step', 'Fija con − / + dónde cae el primer paso y cuánto avanza cada uno.', { from: 2, to: 3, label: 'avance d' }]],
  'pizzeria': [['step', 'Elige en cuántas porciones cortar la pizza.', { from: 4, to: 7, label: 'porciones' }], ['tap', 'Toca las porciones que llevan ingredientes.', { items: ['◔', '◔', '◔', '◔'], pick: [0, 1, 2] }]],
  'pon-la-rayita': [['tap', 'Toca la primera cifra que se repite y luego la última del bloque: la rayita lo cubre.', { items: ['2', '7', '2', '7'], pick: [0, 1] }]],
  'porcentaje-cambio': [['step', 'Con −10, −1, +1 y +10 fija cuánto cambió, medido sobre el valor de antes.', { from: 9, to: 12, label: '%' }]],
  'proyector-sombras': [['slide', 'Arrastra los corchetes del riel: marcan la sombra de la gráfica sobre cada eje.', {}], ['tap', 'Toca un corchete para cambiarlo entre extremo lleno y vacío.', { items: ['[', '('], pick: [1] }]],
  'raices-imanes': [['slide', 'Desliza los imanes por el eje x hasta las raíces; dos juntos hacen una raíz doble.', {}]],
  'rana-zenon': [['touch', 'Cada toque en el estanque es un salto: mira la suma que lleva la rana.', { label: 'salto' }], ['tap', 'Toca la bandera donde cae (o a la que se acerca sin llegar nunca).', { items: ['⚑', '⚑', '⚑'], pick: [1] }]],
  'rebota-pelota': [['slide', 'Arrastra cada pelota (o usa − / +) hasta la altura de su rebote.', { vert: true }]],
  'rebote': [['slide', 'Arrastra el «% de subida» hasta volver al precio original.', { label: '%' }]],
  'recta-espejo': [['slide', 'Toca o arrastra sobre la recta para poner el punto; su reflejo sale al otro lado del 0.', {}]],
  'reglas-del-juego': [['drag', 'Arrastra el nombre de cada propiedad sobre la igualdad que la muestra.', { tile: 'conmutativa', slot: 'una igualdad' }]],
  'rellena-medios': [['drag', 'Arrastra las fichas a los huecos entre el primer término y el último.', { tile: '8', slot: 'hueco' }]],
  'reparte-factores': [['step', 'Elige en cuántos grupos iguales repartir los factores y cuántos grupos tomar.', { from: 2, to: 3, label: 'grupos' }]],
  'reparte-venn': [['tap', 'Toca un elemento de la bandeja y luego la zona del diagrama donde va.', { items: ['4', 'solo A', 'A ∩ B'], pick: [0, 2] }]],
  'reparto': [['slide', 'Arrastra los dos separadores: la barra se parte en tres montos.', {}]],
  'resortera-tres': [['fling', 'Arrastra hacia atrás para estirar (se ve el número) y suelta.', { back: true }]],
  'resta-corrida': [['tap', 'Toca las columnas que tienen dos números iguales para tacharlos.', { items: ['6', '18', '54'], pick: [0, 1] }]],
  'revienta-globos': [['tap', 'Toca los globos cuyo conjunto cumple la misión de la ronda.', { items: ['{a}', '{a, b}', '∅'], pick: [0] }]],
  'rieles-paralelos': [['turn', 'Gira el riel con su manija (o con ◀ ▶) hasta dejarlo como pide la ronda.', {}]],
  'rompe-cambios': [['slide', 'Mueve la paleta con el dedo; al soltar, la pelota sale hacia arriba.', { label: 'paleta' }]],
  'rueda-angulo': [['turn', 'Gira el lado terminal arrastrando su punta; los botones ajustan de a un paso.', {}]],
  'rueda-porcentaje': [['turn', 'Gira la aguja hasta que el sector cubra justo la parte pedida.', {}]],
  'saca-del-radical': [['tap', 'Toca fichas iguales dentro de la raíz para sacarlas como un solo factor.', { items: ['2', '2', '3'], pick: [0, 1] }]],
  'salta-la-coma': [['tap', 'Con ◀ y ▶ corre el punto un lugar: el exponente de 10 lo compensa.', { items: ['◀', '▶'], pick: [1, 1] }]],
  'salta-signos': [['touch', 'Toca la pantalla para saltar las fichas peligrosas; las demás se atrapan corriendo.', { label: '¡salta!' }]],
  'sellos-graficas': [['tap', 'Toca los sellos en orden: cada uno transforma la gráfica actual. ↶ quita el último.', { items: ['→', '↑', '×2'], pick: [0, 2] }]],
  'semaforo-signos': [['tap', 'Toca cada casilla para poner + o −; la fila del producto se calcula sola.', { items: ['+', '−', '+'], pick: [1] }], ['tap', 'Luego enciende los tramos de la solución y decide los puntos críticos.', { items: ['tramo', 'tramo', 'tramo'], pick: [0, 2] }]],
  'serpiente-orden': [['touch', 'Toca hacia donde debe girar la serpiente: cómete las fichas de menor a mayor.', { label: 'gira' }]],
  'siembra-raices': [['tap', 'Toca las semillas de la respuesta y luego «Sembrar»: crecen hasta su potencia.', { items: ['−2', '0', '2', 'Sembrar'], pick: [0, 2, 3] }]],
  'sintoniza-onda': [['step', 'Mueve cada perilla con − / + hasta que tu onda tape la punteada.', { from: 1, to: 3, label: 'amplitud' }]],
  'sirve-la-razon': [['hold', 'Mantén presionado para servir y suelta cuando la cantidad mantenga la razón.', {}]],
  'sombra-arbol': [['slide', 'Ajusta la altura del árbol hasta que el rayo caiga justo en la banderita.', { vert: true }]],
  'sombra-equivalente': [['tap', 'Toca una operación: se aplica a los dos lados. El signo de la desigualdad también se toca.', { items: ['− 3', '÷ (−2)', '<'], pick: [0, 1, 2] }]],
  'suma-filas': [['tap', 'Toca «+ fila» para añadir una fila de puntos; el contador lleva el total.', { items: ['− fila', '+ fila'], pick: [1, 1] }]],
  'tabla-conjugado': [['tap', 'Elige por cuál multiplicar: el juego arma la tabla y muestra qué se cancela. Prueba varias.', { items: ['√3 + 1', '√3 − 1'], pick: [0, 1] }]],
  'tacha-repetidos': [['tap', 'Toca las letras que sobran para tacharlas: cada una debe quedar una sola vez.', { items: ['O', 'S', 'O'], pick: [2] }]],
  'tanque-pitagorico': [['slide', 'Ajusta la perilla (arrastre o − / +) hasta que el líquido llegue justo a la marca.', { vert: true }]],
  'telarana-polar': [['drag', 'Arrastra la araña al nudo del resultado: el módulo en el hilo, el ángulo en el rayo.', { dot: true }]],
  'tirolesa': [['step', 'Suelta o recoge cable con los botones hasta que quede tenso entre las torres.', { from: 4, to: 5, label: 'cable' }]],
  'torre-pisos': [['tap', 'Toca un piso de la torre y el ascensor va hasta allí: cuenta pisos desde la planta baja.', { items: ['piso 3', 'piso 2', 'piso 1'], pick: [1] }], ['tap', 'Cuando estés en el piso, toca «Entregar».', { items: ['Entregar'], pick: [0] }]],
  'torre-producto': [['tap', 'Toca «×» para multiplicar: la torre crece. «÷ atrás» deshace el último paso.', { items: ['÷ atrás', '× 2'], pick: [1, 1] }]],
  'tragamonedas': [['step', 'Toca arriba o abajo de cada rodillo para armar el factor.', { from: 2, to: 3, label: 'décimas' }]],
  'traza-progresion': [['trace', 'Traza el camino pasando por los términos en orden; puedes levantar el dedo y pensar.', { labels: ['4', '7', '10'], trap: '9' }]],
  'tren-ordenado': [['drag', 'Arrastra cada vagón a su lugar: de menor a mayor, de izquierda a derecha.', { tile: '−2', slot: 'primer vagón' }]],
  'tuberia-maquinas': [['tap', 'Toca una máquina para meterla en el primer tubo libre; tocar un tubo lo vacía.', { items: ['x + 3', 'x²', '√x'], pick: [1, 0] }]],
  'ubica-en-recta': [['drag', 'Suelta cada número sobre la recta, en su lugar.', { tile: '½', slot: 'entre 0 y 1' }]],
  'une-factor': [['drag', 'Arrastra desde cada cambio hasta su factor para tender la cuerda.', { cord: true, tile: '+25 %', slot: '× 1.25', other: '× 0.75' }]],
  'une-parejas': [['drag', 'Arrastra desde una etiqueta de la izquierda hasta su pareja.', { cord: true, tile: 'A', slot: 'su pareja', other: 'otra' }]],
  'verdadero-falso': [['swipe', 'Desliza la tarjeta: a la derecha si es verdadera, a la izquierda si es falsa.', { left: 'falso', right: 'verdadero' }]],
  'voltea-desigualdad': [['tap', 'Después de cada operación elige «<» o «>» para el nuevo orden de los puntos.', { items: ['<', '>'], pick: [1] }]],
  'vuela-precios': [['touch', 'Cada toque es un aleteo: pasa por el aro del resultado.', { label: 'aleteo' }]],
};

// Los ejercicios que no son juegos también tienen su ejemplo.
const GUIDE_TYPES = {
  mc: [['tap', 'Lee las opciones y toca la que creas correcta. Puedes cambiarla antes de comprobar.', { items: ['A', 'B', 'C'], pick: [1] }]],
  input: [['keys', 'Escribe tu respuesta con el teclado: valen decimales y fracciones como 3/4.', { text: '3/4' }]],
  order: [['tap', 'Toca las fichas en el orden correcto; tocar una que ya pusiste la devuelve.', { items: ['2.º', '1.º', '3.º'], pick: [1, 0, 2] }]],
  slider: [['slide', 'Mueve el deslizador y mira cómo cambia el dibujo hasta que cumpla lo pedido.', { label: 'valor' }]],
};

const guideKey = ex => (ex?.type === 'play' ? ex.game : ex?.type);

function guideSteps(ex) {
  if (!ex) return [];
  const check = txt => ['check', txt, {}];
  if (ex.type !== 'play') return GUIDE_TYPES[ex.type] ? [...GUIDE_TYPES[ex.type], check('Cuando estés seguro, toca «Comprobar».')] : [];
  const core = GUIDES[ex.game];
  if (!core) return [];
  const arcade = GUIDE_ARCADE.has(ex.game), n = Array.isArray(ex.params?.rounds) ? ex.params.rounds.length : 0;
  return [
    ...(arcade ? [['start', 'Toca el cartel para empezar la ronda.', {}]] : []),
    ...core,
    ...(!arcade && n > 1 ? [['rounds', `Son ${n} rondas: pasa de una a otra con las pestañas de arriba.`, { n }]] : []),
    ...(arcade ? [['lives', 'Tienes tres vidas por ronda. Si se acaban, la ronda empieza otra vez: no pierdes el ejercicio.', {}]] : []),
    check(arcade ? 'Al terminar todas las rondas, toca «Comprobar».' : 'Cuando quede como quieres, toca «Comprobar».'),
  ];
}

// Dibuja un cuadro de una escena en un lienzo 2D (t de 0 a 1).
function drawGuideScene(ctx, scene, t, opts, w, h, C = PALETTE) {
  const k = Math.min(w / GUIDE_W, h / GUIDE_H);
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
  ctx.translate((w - GUIDE_W * k) / 2, (h - GUIDE_H * k) / 2); ctx.scale(k, k);
  (GUIDE_SCENES[scene] || GUIDE_SCENES.tap)(ctx, C, t, opts || {});
  ctx.restore();
}

const GUIDE_ICON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4 15.2a1.5 1.5 0 0 1 2.2-2L9 15"/></svg>';

function guideButton(ex) {
  return guideSteps(ex).length ? `<button type="button" class="hint-btn guide-btn">${GUIDE_ICON}<span>Cómo se juega</span></button>` : '';
}

let guideOpen = null;
function closeGuide() { guideOpen?.close(); }

function openGuide(ex, o = {}) {
  const steps = guideSteps(ex);
  if (!steps.length || typeof document === 'undefined') return null;
  closeGuide();
  const el = document.createElement('div');
  el.className = 'guide';
  el.innerHTML = `<div class="guide-bg"></div><div class="guide-card" role="dialog" aria-modal="true" aria-labelledby="guide-k" aria-describedby="guide-t">
    <p class="guide-kicker" id="guide-k"></p>
    <div class="guide-stage"><canvas aria-hidden="true"></canvas></div>
    <p class="guide-text" id="guide-t" aria-live="polite"></p>
    <div class="guide-dots" aria-hidden="true">${steps.map(() => '<i></i>').join('')}</div>
    <div class="guide-actions"><button type="button" class="btn ghost guide-back">Atrás</button><button type="button" class="btn guide-next"></button></div>
    ${o.auto ? '<button type="button" class="guide-off">No mostrar la guía al empezar</button>' : ''}</div>`;
  document.body.appendChild(el);
  const cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), stage = el.querySelector('.guide-stage');
  const kicker = el.querySelector('.guide-kicker'), text = el.querySelector('.guide-text'), dots = [...el.querySelectorAll('.guide-dots i')];
  const back = el.querySelector('.guide-back'), next = el.querySelector('.guide-next');
  let i = 0, t0 = performance.now(), raf = 0, alive = true;
  const still = reducedMotion();
  const frame = now => {
    if (!alive) return;
    const r = { width: stage.clientWidth, height: stage.clientHeight }, dpr = Math.min(2, window.devicePixelRatio || 1);   // sin la escala de la entrada
    if (r.width) {
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGuideScene(ctx, steps[i][0], still ? 0.9 : ((now - t0) % GUIDE_MS) / GUIDE_MS, steps[i][2], r.width, r.height);
    }
    raf = requestAnimationFrame(frame);
  };
  const show = () => {
    kicker.textContent = `Cómo se juega · ${i + 1} de ${steps.length}`;
    text.textContent = steps[i][1];
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    back.disabled = i === 0;
    next.textContent = i === steps.length - 1 ? '¡A jugar!' : 'Siguiente';
    t0 = performance.now();
  };
  const prevFocus = document.activeElement;
  // El teclado es de la guía mientras está abierta: no llega a la lección que hay debajo (flechas, números, Enter).
  const onKey = e => {
    if (e.key === 'Tab') {
      const f = [...el.querySelectorAll('button:not(:disabled)')], k = f.indexOf(document.activeElement);
      e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus();
    } else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') next.click();
    else if (e.key === 'ArrowLeft') back.click();
    e.stopPropagation();
  };
  // quiet: el ejercicio se quitó de la pantalla (no se devuelve el foco ni se avisa).
  function close(quiet) {
    if (!alive) return;
    alive = false; cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey, true);
    el.remove(); guideOpen = null;
    if (typeof S !== 'undefined') { (S.guides ||= {})[guideKey(ex)] = true; if (typeof save === 'function') save(); }
    if (quiet === true) return;
    if (prevFocus?.isConnected && prevFocus !== document.body) prevFocus.focus?.({ preventScroll: true });
    o.onClose?.();
  }
  back.onclick = () => { if (i > 0) { i--; show(); } };
  next.onclick = () => { if (i < steps.length - 1) { i++; show(); } else close(); };
  el.querySelector('.guide-bg').onclick = () => close();
  const off = el.querySelector('.guide-off');
  if (off) off.onclick = () => { if (typeof S !== 'undefined') S.guideAuto = false; close(); };
  document.addEventListener('keydown', onKey, true);
  show(); raf = requestAnimationFrame(frame);
  requestAnimationFrame(() => el.classList.add('open'));
  setTimeout(() => el.classList.add('open'), 60);   // por si la pestaña está en segundo plano y no hay cuadros
  next.focus?.({ preventScroll: true });
  guideOpen = { close, el, go: k => { i = Math.max(0, Math.min(steps.length - 1, k)); show(); } };
  return guideOpen;
}

// ¿Sale sola? La primera vez que se ve ese juego (o ese tipo de ejercicio), fuera de las evaluaciones.
function guideWanted(ex) {
  if (typeof S === 'undefined' || !guideSteps(ex).length) return false;
  if (S.guideAuto === false || S.guides?.[guideKey(ex)]) return false;
  return !(typeof document !== 'undefined' && document.querySelector?.('#overlay.open .exam-foot'));   // js/exam.js
}
