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
  // Con matemática (a⁻³, 3/4, √12, $…$) se dibuja como fórmula.
  if (typeof formulaWanted === 'function' && formulaWanted(txt)) { ctx.fillStyle = col; drawFormulaCtx(ctx, txt, x, y + 1, { size, maxW, weight, align: 'center' }); return; }
  ctx.font = `${weight} ${size}px ${gameFont()}, system-ui, sans-serif`;
  const w = ctx.measureText(txt).width || 0;
  if (w > maxW) ctx.font = `${weight} ${Math.max(8, size * maxW / w)}px ${gameFont()}, system-ui, sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(txt, x, y + 1);
}
// Ficha centrada en (x, y) con labio; sin relleno propio usa la tarjeta del tema con borde.
function gTile(ctx, C, x, y, w, h, txt, fill, o = {}) {
  const f = fill || C.card, r = o.r ?? 8;
  if (o.ring) { ctx.strokeStyle = o.ring; ctx.lineWidth = 1.5; gBox(ctx, x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 8, r + 3); ctx.stroke(); }
  ctx.fillStyle = fill ? shade(f, 0.74) : C.line; gBox(ctx, x - w / 2, y - h / 2 + 2, w, h, r); ctx.fill();
  ctx.fillStyle = f; gBox(ctx, x - w / 2, y - h / 2, w, h, r); ctx.fill();
  if (!fill) { ctx.strokeStyle = C.line; ctx.lineWidth = 1; gBox(ctx, x - w / 2, y - h / 2, w, h, r); ctx.stroke(); }
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
// La mano: un índice que señala, con los otros dedos doblados y el pulgar a un lado; la yema queda en (x, y).
// Crema con borde azul noche (se ve sobre cualquier tema y cualquier ficha). Al presionar se encoge un poco y
// salen rayitas alrededor de la punta, además de la onda.
function gHand(ctx, C, x, y, down, pulse = 0) {
  const hot = gDark(C) ? C.sun : C.coral;
  if (down) {
    ctx.strokeStyle = hot; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.85 - 0.6 * pulse;
    ctx.beginPath(); ctx.arc(x, y, 12 + 12 * pulse, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.36); ctx.scale(down ? 0.8 : 0.86, down ? 0.8 : 0.86);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (down) {
    ctx.strokeStyle = hot; ctx.lineWidth = 3;
    for (const a of [-2.75, -2.1, -1.57, -1.04, -0.39]) {
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 10, Math.sin(a) * 10 - 1); ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16 - 1); ctx.stroke();
    }
  }
  ctx.fillStyle = '#FFF4E2'; ctx.strokeStyle = '#1D2052'; ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-4.5, 1); ctx.arc(0, 1, 4.5, Math.PI, 0);                 // punta del índice
  ctx.lineTo(4.5, 14); ctx.arc(9, 14, 4.5, Math.PI, 0);                // nudillo del medio
  ctx.lineTo(13.5, 16); ctx.arc(17.5, 16, 4, Math.PI, 0);              // anular
  ctx.lineTo(21.5, 19); ctx.arc(25, 19, 3.5, Math.PI, 0);              // meñique
  ctx.lineTo(28.5, 30); ctx.bezierCurveTo(28.5, 42, 19, 46, 10, 46);   // canto de la mano
  ctx.bezierCurveTo(3, 46, -1, 42, -5, 37);                            // base
  ctx.lineTo(-14, 27); ctx.bezierCurveTo(-18, 22, -12, 17, -8, 21);    // pulgar
  ctx.lineTo(-4.5, 25); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2;                                                    // separación entre los dedos doblados
  ctx.beginPath(); ctx.moveTo(4.5, 14); ctx.lineTo(4.5, 23); ctx.moveTo(13.5, 16); ctx.lineTo(13.5, 24); ctx.moveTo(21.5, 19); ctx.lineTo(21.5, 25); ctx.stroke();
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
const GUIDE_ARCADE = new Set(['rampa-precio', 'tanque-porcentaje', 'llaves-tanque', 'bici-cambios', 'rebote-signos', 'vagon-inverso', 'anillos-subconjunto', 'billar-rebote', 'capas-operacion', 'lazo-conjunto', 'cubo-partes', 'orbita-conjuntos', 'descifra-zona', 'lluvia-elementos', 'revienta-globos', 'luciernagas-venn', 'buzo-enteros', 'carrera-fracciones', 'frena-aguja',
  'dispara-inverso', 'salta-signos', 'serpiente-orden', 'sirve-la-razon', 'corta-proporciones', 'resortera-tres', 'caja-veloz', 'vuela-precios',
  'rompe-cambios', 'traza-progresion', 'encesta-suma', 'dobla-fichas', 'rana-zenon', 'maquina-sigma', 'torre-pisos', 'escala-leyes',
  'siembra-raices', 'muro-radicales', 'jefe-venn', 'jefe-ruta', 'jefe-rueda',
  'torre-grados', 'arma-la-mesa', 'camino-pascal', 'reparte-barras', 'gira-complejos', 'balanza-cajas', 'apunta-chorro', 'donde-cae', 'empaca-filas', 'sondea-niebla',
  'cruza-o-rebota', 'rio-o-hueco', 'llena-estanque', 'bote-corriente', 'cruce-curvas', 'lirios-laguna', 'dos-bancos', 'regla-de-calculo', 'piedras-selva',
  'quita-vueltas', 'rueda-rodante', 'toca-lados', 'figuras-notables', 'multiplica-razon', 'proyecta-punto', 'espejo-cuadrantes', 'ola-entre-lineas', 'crestas-faroles', 'ventana-inversa',
  'escala-triangulo', 'todo-en-senos', 'rectangulo-suma', 'tira-doble', 'red-periodica', 'pareja-opuesta', 'bisagra-area', 'parientes-polares', 'multiplicador-oculto', 'hermanas-raiz']);

// Los pasos propios de cada juego: [escena, texto, opciones]. El ejemplo de la escena es pequeño y distinto de los
// ejercicios: enseña el gesto, no la respuesta.
const GUIDES = {
  'jefe-rueda': [['tap', 'Toca en la rueda los puntos que responden el reto: quedan marcados.', { items: ['•', '•', '•', '•'], pick: [1, 3] }], ['tap', 'Con todas las runas puestas toca «¡Atacar!». Tocar un punto otra vez lo quita.', { items: ['¡Atacar!'], pick: [0] }]],
  'quita-vueltas': [['tap', 'Quita o pon vueltas completas hasta dejar el ángulo en el intervalo y toca «Listo».', { items: ['− 1 vuelta', '+ 1 vuelta', 'Listo'], pick: [0, 0, 2] }]],
  'rueda-rodante': [['step', 'Elige con − / + el ángulo que gira la rueda y toca «Rodar»: avanza lo que mide el arco.', { from: 1, to: 3, label: 'ángulo' }]],
  'toca-lados': [['tap', 'Toca dos lados: primero el que va arriba de la fracción y luego el que va abajo.', { items: ['opuesto', 'adyacente', 'hipotenusa'], pick: [0, 2] }]],
  'figuras-notables': [['tap', 'Busca el ángulo en una figura y toca dos lados: el de arriba de la fracción y el de abajo.', { items: ['1', '√3', '2'], pick: [1, 2] }]],
  'multiplica-razon': [['tap', 'Toca la razón que multiplica al lado conocido para dar el buscado: el juego calcula.', { items: ['sen', 'cos', 'tan'], pick: [2] }]],
  'proyecta-punto': [['step', 'Pon el coseno y el seno del punto con − / +, cada uno con su signo, y toca «Proyectar».', { from: 0, to: 2, label: 'seno' }]],
  'espejo-cuadrantes': [['tap', 'Cada espejo refleja el punto en un eje. Llévalo al cuadrante pedido sin gastar de más.', { items: ['Espejo ↕', 'Espejo ↔'], pick: [1, 0] }], ['step', 'En el cuadrante I, pon con − / + su ángulo de referencia y toca «Comprobar».', { from: 45, to: 30, label: 'referencia' }]],
  'ola-entre-lineas': [['step', 'Elige amplitud y línea media con − / + y toca «Lanzar ola»: debe tocar techo y piso.', { from: 1, to: 3, label: 'amplitud' }]],
  'crestas-faroles': [['step', 'Elige cuántas ondas caben y cuánto se corre la ola: cada cresta debe caer en un farol.', { from: 1, to: 2, label: 'ondas' }]],
  'ventana-inversa': [['step', 'Mueve dónde empieza la ventana y su ancho, y toca «Probar»: no puede repetir alturas.', { from: 4, to: 2, label: 'ancho' }]],
  'escala-triangulo': [['tap', 'Divide el triángulo entre cos θ o sen θ y toca el lado que quedó valiendo lo pedido.', { items: ['÷ cos θ', '÷ sen θ', '↶'], pick: [0] }]],
  'todo-en-senos': [['tap', 'Toca una ficha amarilla y elige qué va arriba y qué va abajo de su fracción.', { items: ['tan x', 'sen x', 'cos x'], pick: [0, 1, 2] }], ['tap', 'Toca una ficha de arriba y una igual de abajo: se cancelan. Al terminar, «Listo».', { items: ['cos x', 'cos x', 'Listo'], pick: [0, 1, 2] }]],
  'rectangulo-suma': [['tap', 'Toca un tramo de color y luego la ficha con su medida. Hazlo con los dos tramos.', { items: ['tramo', 'sen α cos β', 'cos α cos β'], pick: [0, 1] }]],
  'tira-doble': [['step', 'Mueve el corte de la tira con − / + y toca «Restar»: azul menos rojo debe dar lo pedido.', { from: 4, to: 6, label: 'corte' }]],
  'red-periodica': [['step', 'Pon con − / + la primera solución y el salto de la red, y toca «Lanzar»: ahí aparecen los peces.', { from: 2, to: 1, label: 'salto' }]],
  'pareja-opuesta': [['tap', 'Toca, en orden, lo que ya se puede calcular hasta llegar a lo que se pide.', { items: ['C = ?', 'c = ?'], pick: [0, 1] }]],
  'bisagra-area': [['step', 'Gira el lado con − / + hasta la línea punteada y toca «Marcar». Si otro ángulo sirve, márcalo.', { from: 90, to: 60, label: 'ángulo C' }]],
  'parientes-polares': [['step', 'Mueve el punto w con las perillas de módulo y de ángulo, y toca «Fijar».', { from: 45, to: 90, label: 'ángulo' }]],
  'multiplicador-oculto': [['tap', 'Mira cuánto giró y cuánto se estiró la bandera, y toca en la telaraña el número w que lo hace.', { items: ['•', '•', '•', '•'], pick: [2] }]],
  'hermanas-raiz': [['tap', 'Toca en la circunferencia dónde están las otras raíces: quedan igual de separadas.', { items: ['•', '•', '•', '•'], pick: [1, 3] }]],
  'acorrala-raiz': [['tap', 'Toca el tramo donde vive la raíz: está donde las marcas cambian de color.', { items: ['1.3', '1.4', '1.5'], pick: [1] }], ['tap', 'Cada toque abre una lupa: repite con las cifras que siguen.', { items: ['1.41', '1.42'], pick: [0] }]],
  'afina-sistema': [['slide', 'Desliza un coeficiente y mira cómo gira o se desplaza su recta.', { label: 'coeficiente' }]],
  'ajusta-capital': [['slide', 'Arrastra la pila de billetes para fijar el capital; el monto final se calcula solo.', { vert: true }]],
  'alcancias-gemelas': [['slide', 'Mueve la tasa simple hasta que las dos alcancías queden al mismo nivel.', { label: 'tasa' }]],
  'apila-alturas': [['slide', 'Arrastra cada cuenta hacia arriba o abajo hasta la altura que sale de operar f y g.', { vert: true }]],
  'arbol-potencia': [['step', 'Elige con − / + las ramas por nudo y los niveles: el árbol crece solo y cuenta sus hojas.', { from: 2, to: 3, label: 'niveles' }]],
  'arma-la-cuenta': [['drag', 'Arrastra números y operaciones al panel. El resultado se actualiza en vivo.', { tile: '6', slot: 'cuenta' }], ['tap', 'Sobran fichas: usa solo los datos que sirven. «⌫» borra la última.', { items: ['12', '÷', '3', '⌫'], pick: [0, 1, 2, 3] }]],
  'bloques-area': [['step', 'Mueve los números con − / +: el rectángulo cambia y cuenta sus barras y cuadritos.', { from: 2, to: 3, label: 'a' }]],
  'division-sintetica': [['step', 'Elige r con − / + y toca «Dividir»: el juego baja, multiplica y suma. El último es el residuo.', { from: 0, to: 2, label: 'r' }], ['tap', 'Hay pocas divisiones: mira el signo de los residuos anotados para decidir cuál probar.', { items: ['P(1) = −8', 'P(3) = 4'], pick: [0, 1] }]],
  'cancela-factores': [['drag', 'Arrastra cada factor de arriba sobre su igual de abajo para tachar ambos.', { tile: 'x + 3', slot: 'x + 3' }], ['tap', 'Confirma con «Listo» cuando hayas cancelado los factores comunes.', { items: ['Listo'], pick: [0] }]],
  'jefe-ruta': [['tap', 'En cada nivel, de abajo hacia arriba, toca el paso que sí se justifica.', { items: ['2x = 8', '2x = 2'], pick: [0] }], ['tap', 'Con la ruta completa toca «¡Atacar!». Si un paso falla, el juego dice en qué nivel.', { items: ['¡Atacar!'], pick: [0] }]],
  'torre-grados': [['tap', 'Toca los términos del exponente mayor al menor: se apilan en orden.', { items: ['3x', 'x⁴', '7'], pick: [1, 0, 2] }]],
  'arma-la-mesa': [['tap', 'Toca las piezas que completan la mesa y luego «Listo».', { items: ['3x', '9', '6', '3x'], pick: [0, 3, 1] }]],
  'camino-pascal': [['trace', 'Baja casilla por casilla, a la izquierda o a la derecha, hasta la estrella.', { labels: ['▼', '·', '★'], trap: '·' }]],
  'reparte-barras': [['tap', 'Pasa barras de un lado al otro hasta llenar justo el hueco.', { items: ['← barra', 'barra →', 'Listo'], pick: [1, 1, 2] }]],
  'gira-complejos': [['turn', 'Gira o refleja el complejo con los botones hasta llegar a la estrella.', {}]],
  'balanza-cajas': [['tap', 'Quita lo mismo de los dos platillos y al final reparte.', { items: ['− 1 suelta', '− 1 caja', 'Repartir'], pick: [0, 1, 2] }]],
  'apunta-chorro': [['drag', 'Toca en la cuadrícula el vértice del chorro y luego «Lanzar».', { dot: true }]],
  'donde-cae': [['tap', 'Pon un balde en cada marca donde cae el agua y abre la llave.', { items: ['1', '2', '3', '4'], pick: [1, 3] }]],
  'empaca-filas': [['tap', 'Arma filas del ancho del divisor; lo que no alcance es el residuo.', { items: ['Fila de alto x', 'Fila de alto 1', 'Listo'], pick: [0, 1, 2] }]],
  'sondea-niebla': [['tap', 'Alumbra pocas columnas, cambia a «Bandera» y marca los cruces.', { items: ['Linterna', 'Bandera', 'Listo'], pick: [0, 1, 2] }]],
  'cruza-o-rebota': [['tap', 'Toca la ficha de cada cero para elegir cruza o rebota, y dibuja.', { items: ['cruza', 'rebota', 'Dibujar'], pick: [0, 1, 2] }]],
  'rio-o-hueco': [['tap', 'Antes de cada paso decide: caminar, saltar el hueco o río.', { items: ['Caminar', 'Saltar', 'Río'], pick: [0, 1, 2] }]],
  'llena-estanque': [['step', 'Elige en cuántas partes medir el estanque; luego deja pasar las horas.', { from: 4, to: 6, label: 'partes' }]],
  'bote-corriente': [['step', 'Elige la corriente con − / +: el bote sale de la primera pista. Luego zarpa.', { from: 1, to: 3, label: 'corriente' }]],
  'cruce-curvas': [['slide', 'Mueve la mira con ◀ ▶ y marca donde las dos alturas son iguales.', { label: 'x' }]],
  'lirios-laguna': [['tap', 'Mueve el calendario con ◀ ▶ y responde con «Este día».', { items: ['◀ día', 'día ▶', 'Este día'], pick: [0, 0, 2] }]],
  'dos-bancos': [['tap', 'Toca el año en que crees que llega a la meta y corre los años.', { items: ['3', '4', '5', '6'], pick: [1] }]],
  'regla-de-calculo': [['slide', 'Corre la regla de arriba y toca abajo el número del resultado.', { label: 'regla' }]],
  'piedras-selva': [['tap', 'Pisa todas las piedras que sí son solución; las falsas quitan una vida.', { items: ['x = 4', 'x = −2', 'x = 8'], pick: [0] }]],
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
  'buzo-enteros': [['slide', 'Arrastra la sonda a la altura del resultado y suelta para acercar las perlas.', { vert: true }]],
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
  'combina-vectores': [['slide', 'Desliza cada coeficiente para ver cuántas veces se usa ese vector en el recorrido.', { label: 'a' }]],
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
  'globo-lastre': [['drag', 'Arrastra globos o sacos de arena: el canasto sube o baja y la cuenta se escribe sola.', { tile: 'saco', slot: 'canasto' }], ['tap', 'Déjalo a la altura de la bandera. «Reiniciar» lo devuelve al comienzo.', { items: ['Reiniciar'], pick: [0] }]],
  'voltea-flecha': [['slide', 'Arrastra el multiplicador: la flecha se repite y, a la izquierda del 0, se voltea.', {}]],
  'capas-operacion': [['drag', 'Arrastra un número sobre su vecino: el juego los opera y los funde en uno.', { tile: '5', slot: '8' }], ['drag', 'Para una potencia, junta la base con su exponente (la ficha pequeña de arriba).', { tile: '(−3)', slot: '²' }]],
  'tijera-angulos': [['turn', 'Arrastra la punta de la recta: los cuatro ángulos cambian a la vez.', {}]],
  'paralelas-gira': [['turn', 'Gira la recta de abajo hasta que no se cruce nunca con la de arriba.', {}]],
  'apice-triangulo': [['drag', 'Arrastra el vértice de arriba: los ángulos cambian, pero siempre suman 180°.', { tile: 'C', slot: 'arriba' }]],
  'suma-poligono': [['drag', 'Arrastra desde el punto hasta otro vértice para trazar una diagonal.', { tile: '•', slot: 'vértice' }]],
  'cuadrados-pitagoras': [['drag', 'Arrastra las puntas de los catetos: sus cuadrados crecen y la tira los suma.', { tile: 'cateto', slot: 'más largo' }]],
  'escalera-pared': [['slide', 'Arrastra el pie de la escalera: la punta sube o baja por la pared.', {}]],
  'billar-rebote': [['slide', 'Arrastra la mira por la banda de arriba y suelta: la bola sale.', {}]],
  'tableta-fraccion': [['slide', 'Arrastra el deslizador para cortar la tableta en partes iguales.', {}], ['drag', 'Luego arrastra el dedo sobre la tableta para tomar las partes que pide.', { tile: 'parte', slot: 'tableta' }]],
  'corta-igual': [['slide', 'Arrastra: las dos barras se recortan en pedacitos. Cuando encajan en las dos, se pueden juntar.', {}]],
  // Kit LEC de lectura (spec 2026-11-19-preuda-lectura-textos): el texto va arriba; las fichas se arrastran o se tocan y luego la zona.
  'anticipa-texto': [['drag', 'Antes de leer, mira la ficha y arrastra a cada casilla lo que esperas del texto.', { tile: 'explicar', slot: 'propósito' }]],
  'mapa-del-texto': [['drag', 'Arrastra a cada párrafo lo que hace en el texto. Abajo se arma el esqueleto.', { tile: 'da un ejemplo', slot: '¶3' }]],
  'resume-parrafo': [['drag', 'Arrastra a cada párrafo la frase que dice su idea central. Sobran frases.', { tile: 'idea central', slot: '¶2' }]],
  'donde-buscar': [['drag', 'Lleva cada pregunta al párrafo donde está su respuesta.', { tile: '¿quién?', slot: '¶4' }]],
  'lupa-evidencia': [['drag', 'Pon cada afirmación en su caja: lo dice el texto, se deduce o no lo dice.', { tile: 'afirmación', slot: 'se deduce' }]],
  'intruso-excepto': [['drag', 'Lleva cada opción a su párrafo. La que no tiene párrafo va a «No aparece».', { tile: 'opción B', slot: 'No aparece' }]],
  'palabra-a-la-medida': [['drag', 'Arrastra al hueco la palabra que dice lo mismo que la subrayada en esa oración.', { tile: 'prueba', slot: 'hueco' }]],
  'hilo-referente': [['drag', 'Tira el hilo desde el nudo hasta las palabras a las que se refiere. O tócalas.', { dot: true }]],
  'conector-bisagra': [['drag', 'Arrastra un conector a la bisagra: se dibuja la relación que crea entre las ideas.', { tile: 'sin embargo', slot: 'bisagra' }]],
  'signos-que-hablan': [['drag', 'Arrastra sobre el signo resaltado el oficio que cumple en esa oración.', { tile: 'cita', slot: '« »' }]],
  'quien-lo-dice': [['drag', 'Lleva cada idea a la voz que la sostiene: el autor o cada persona citada.', { tile: 'idea', slot: 'la experta' }]],
  'balanza-argumento': [['drag', 'Pon cada oración en el platillo que apoya o debilita la tesis. Lo ajeno se queda abajo.', { tile: 'dato', slot: 'apoya' }]],
  'termometro-tono': [['drag', 'Lee el fragmento y arrastra la aguja hasta su tono. También puedes tocar el tono.', { dot: true }]],
  'caso-nuevo': [['drag', 'Lleva cada situación a «Aplica la idea» si repite la idea del texto, o a «No la aplica».', { tile: 'situación', slot: 'aplica' }]],
  'puente-dos-textos': [['drag', 'Pon cada idea en «Solo Uno», «Los dos» o «Solo Dos», según qué texto la dice.', { tile: 'idea', slot: 'los dos' }]],
  'pregunta-examen': [['tap', 'Lee el texto, vuelve al párrafo que pide la pregunta y toca la opción correcta.', { items: ['A', 'B', 'C', 'D'], pick: [2] }]],
  'subraya-texto': [['tap', 'Lee el texto y toca los trozos que responden la consigna: quedan subrayados.', { items: ['El páramo', 'da agua a', 'dos millones'], pick: [2] }], ['tap', 'Tocar otra vez un trozo lo quita. Si hay varias pestañas, cada una es otra consigna.', { items: ['1', '2'], pick: [1] }]],
  'escala-solucion': [['trace', 'Traza una ruta desde la base y une un paso válido por nivel.', {}], ['tap', 'Toca un paso anterior para corregir lo que sigue.', { items: ['x = 4', 'x = 1'], pick: [1, 0] }]],
  'escala-leyes': [['tap', 'Toca las tarjetas en el orden que deja al escalador en la bandera. Se puede deshacer.', { items: ['· x³', '( )²', '÷ x⁴'], pick: [0, 1] }]],
  'escalera-aritmetica': [['slide', 'Arrastra el segundo peldaño: fija la diferencia y toda la escalera se acomoda.', { vert: true }]],
  'espejo-diagonal': [['drag', 'Arrastra cada ficha hasta su reflejo en el espejo y = x.', { dot: true }]],
  'espiral-potencias': [['step', 'Con «× z» y «÷ z» elige cuántas veces multiplicar; la espiral se ve al comprobar.', { from: 2, to: 4, label: 'n' }]],
  'estira-barra': [['slide', 'Estira o encoge la barra con el tirador (o − / +) hasta el porcentaje pedido.', { label: '%' }]],
  'estira-foto': [['slide', 'Arrastra el borde de abajo para fijar el alto sin deformar la foto.', { vert: true }]],
  'etiqueta-rebaja': [['drag', 'Arrastra a cada etiqueta el sticker con su precio final.', { tile: '$ 80', slot: 'etiqueta −20 %' }]],
  'tamiz-rango': [['slide', 'Arrastra los corchetes: los números que quedan adentro forman el conjunto.', {}]],
  'cajas-anidadas': [['drag', 'Arrastra a la membrana las fichas y bolsas que pide la notación.', { tile: '{2, 3}', slot: 'A' }]],
  'gemelos': [['drag', 'Arrastra a la papelera lo que impide la relación; los hilos unen elementos iguales.', { tile: 's', slot: 'papelera' }]],
  'escalera-inclusion': [['drag', 'Arrastra al centro los conjuntos, del más pequeño al más grande: cada uno debe contener al anterior.', { tile: '{a}', slot: 'centro' }]],
  'arbol-partes': [['drag', 'Arrastra un elemento al árbol: cada rama se parte en dos y las hojas se duplican.', { tile: 'p', slot: 'árbol' }]],
  'anillos-subconjunto': [['slide', 'Arrastra el lanzador bajo una estaca y suelta: el aro solo encaja si la estaca lo contiene.', {}]],
  'solapa-cardinal': [['slide', 'Arrastra B sobre A: lo que comparten pasa a la zona común y la cuenta se escribe sola.', {}]],
  'goma-diferencia': [['drag', 'Arrastra a la goma los elementos que la operación deja por fuera.', { tile: '2', slot: 'goma' }]],
  'busca-b': [['drag', 'Arrastra elementos del universo a B hasta que se cumplan las dos pistas.', { tile: '4', slot: 'B' }]],
  'pares-cero': [['drag', "Una ficha + sobre una − se anulan. Para restar, quita fichas; si faltan, agrega pares cero.", {"tile": "+", "slot": "−"}]],
  'flecha-resta': [['slide', "Arrastra la cola al valor de antes y la punta al de después: la flecha mide el cambio.", {}]],
  'agrupa-fraccion': [['slide', "Arrastra la manija para juntar las partes de la barra en grupos iguales.", {}]],
  'espiral-teodoro': [['turn', "Gira la punta alrededor del centro: cada triángulo nuevo suma uno bajo la raíz.", {}]],
  'agrupa-amigos': [['drag', "Arrastra los números de a dos a cada plato: cada plato muestra su suma.", {"tile": "17", "slot": "plato"}]],
  'une-rectangulos': [['drag', "Arrastra junto a la base los rectángulos que tienen su mismo alto.", {"tile": "6·3", "slot": "base"}]],
  'deshaz-camino': [['drag', "Arrastra a las puertas de regreso las tarjetas que deshacen cada paso.", {"tile": "−3", "slot": "puerta"}]],
  'multiplica-primero': [['drag', "Arrastra un factor sobre otro para multiplicarlos primero.", {"tile": "25", "slot": "4"}]],
  'vagon-inverso': [['slide', "Estira el resorte o elige el factor, y suelta: el vagón corre o la liga se estira.", {}]],
  'resta-opuesto': [['drag', "Voltea la flecha de abajo y pégala en la punta de la de arriba.", {"tile": "−b", "slot": "punta"}]],
  'parte-flecha': [['slide', "Corre la tijera para partir la flecha; si el divisor es negativo, voltea el pedazo.", {}]],
  'rebote-signos': [['slide', "Arrastra la ficha al punto de salida y suelta: salta sola.", {}]],
  'espejo-desigualdad': [['slide', "Arrastra el control: abajo se ven las imágenes y el signo entre ellas.", {}]],
  'barra-razon': [['slide', "Arrastra la manija para partir la cinta en dos tramos.", {}]],
  'rejilla-razon': [['paint', "Pasa el dedo por las baldosas para pintarlas o despintarlas.", {}]],
  'receta-escala': [['slide', "Arrastra las porciones: todos los ingredientes cambian en la misma razón.", {}]],
  'bici-cambios': [['slide', "Arrastra la cadena a un piñón y suelta: la bici pedalea sola.", {}]],
  'llaves-tanque': [['slide', "Elige cuántas llaves abrir y suelta: el agua corre y el reloj cuenta.", {}]],
  'mapa-escala': [['slide', "Arrastra el pueblo B sobre la regla del mapa.", {}]],
  'tanque-porcentaje': [['slide', "Sube la marca de nivel a los litros justos y suelta: el agua llena hasta ahí.", {}]],
  'precio-original': [['slide', "Arrastra el precio de antes: el cambio se aplica y se ve el de ahora.", {}]],
  'factor-cambio': [['slide', "Arrastra el factor hasta que la barra de antes quede igual a la de después.", {}]],
  'rampa-precio': [['slide', "Gira el sello y suelta: la etiqueta baja y cambia de precio al pasar.", {}]],
  'semanas-rebaja': [['slide', "Arrastra las semanas: aparece una barra por semana.", {}]],
  'sube-y-baja': [['slide', "Arrastra el porcentaje que sube y luego baja.", {}]],
  'escalera-potencias': [['slide', "Arrastra la marca por la escalera: subir multiplica por la base y bajar divide.", {}]],
  'cubo-bloques': [['slide', "Arrastra la arista: el cubo se arma con bloquecitos.", {}]],
  'cancela-pisos': [['drag', "Arrastra una ficha de arriba sobre una de abajo: la pareja se cancela.", {"tile": "x", "slot": "x"}]],
  'copias-potencia': [['slide', "Arrastra la manija para hacer copias de la caja de factores.", {}]],
  'fraccion-exponente': [['slide', "Arrastra la regla de la raíz y la de la potencia.", {}]],
  'absoluto-raiz': [['slide', "Arrastra x por la recta y mira x², la raíz y la distancia al cero.", {}]],
  'suma-raices': [['slide', "Arrastra el lado del cuadrado nuevo hasta que su área sea la suma.", {}]],
  'racionaliza-uno': [['drag', "Arrastra una tarjeta que valga 1 sobre la fracción.", {"tile": "√3/√3", "slot": "fracción"}]],
  'copias-raiz': [['slide', "Arrastra hasta que el segmento de abajo mida lo mismo que la fila de arriba.", {}]],
  'goteo-tanque': [['slide', "Arrastra las mediciones: aparece una barra por hora.", {}]],
  'poste-cerca': [['slide', 'Arrastra cuántos postes poner: entre dos postes hay un tramo.', {}]],
  'nivela-barras': [['slide', "Arrastra la línea hasta que lo que sobra arriba llene lo que falta abajo.", {}]],
  'alcancia-semanas': [['slide', "Arrastra las semanas: la alcancía muestra el total.", {}]],
  'razon-terminos': [['slide', "Arrastra la razón: los términos de en medio se llenan solos.", {}]],
  'carrera-crecimiento': [['slide', "Arrastra el puesto y compara la barra que suma con la que multiplica.", {}]],
  'cultivo-celulas': [['slide', "Arrastra las generaciones: las células se multiplican.", {}]],
  'cuadrado-mitades': [['slide', "Arrastra las capas: cada una pinta parte de lo que falta.", {}]],
  'torre-geometrica': [['slide', "Arrastra cuántos términos apilar en la torre.", {}]],
  'ajusta-razon': [['slide', "Arrastra la razón y mira hacia dónde van las sumas parciales.", {}]],
  'sigma-indices': [['slide', "Arrastra los dos topes: desde dónde y hasta dónde va k.", {}]],
  'cambia-indice': [['slide', "Arrastra el corrimiento hasta alinear los términos.", {}]],
  'factorial-cajas': [['slide', "Arrastra cuántos objetos se ponen en fila.", {}]],
  'bloques-polinomio': [['drag', "Arrastra bloques de la bandeja a la mesa; un bloque y su opuesto se anulan.", {"tile": "x²", "slot": "mesa"}]],
  'reduce-semejantes': [['drag', "Arrastra un bloque sobre otro igual de color contrario: se anulan.", {"tile": "x", "slot": "−x"}]],
  'resta-voltea': [['drag', "Pasa cada bloque de Q por el volteador y luego llévalo a la mesa.", {"tile": "x", "slot": "volteador"}]],
  'evalua-polinomio': [['slide', "Arrastra x por la recta: cada término muestra cuánto vale.", {}]],
  'llena-rectangulo': [['drag', "Arrastra bloques al marco hasta llenarlo.", {"tile": "x", "slot": "marco"}]],
  'parte-cuadrado': [['slide', "Arrastra el corte del lado: el cuadrado se parte en cuatro piezas.", {}]],
  'diferencia-cuadrados': [['slide', "Arrastra a y b: el cuadrado pierde una esquina y queda un rectángulo.", {}]],
  'binomios-comun': [['slide', "Arrastra a y b: el rectángulo se llena de barras y cuadritos.", {}]],
  'marco-cuadro': [['slide', "Arrastra el lado del cuadro: el marco se dibuja con su área.", {}]],
  'triangulo-pascal': [['drag', "Arrastra fichas a las casillas vacías de la fila.", {"tile": "10", "slot": "casilla"}]],
  'elige-parentesis': [['drag', "Arrastra fichas b a los paréntesis; cada manera nueva queda anotada.", {"tile": "b", "slot": "( a + b )"}]],
  'exponentes-binomio': [['slide', "Arrastra el número de término: los exponentes cambian.", {}]],
  'fila-potencia': [['slide', "Arrastra la fila de Pascal y mira cuánto suma.", {}]],
  'once-potencias': [['slide', "Arrastra n y compara la fila de Pascal con las cifras de 11ⁿ.", {}]],
  'factor-comun-bloques': [['slide', "Arrastra el número de filas: los bloques se reparten.", {}]],
  'diferencia-esquina': [['slide', "Arrastra el lado de la esquina que se quita.", {}]],
  'suma-producto': [['slide', "Arrastra las dos fichas por la recta: arriba se ven su suma y su producto.", {}]],
  'agrupa-terminos': [['drag', "Arrastra los términos de a dos a cada caja.", {"tile": "x³", "slot": "caja"}]],
  'plano-complejo': [['drag', "Arrastra el punto: el ancho es la parte real y el alto la imaginaria.", {"tile": "•", "slot": "plano"}]],
  'vueltas-i': [['turn', "Gira la flecha: cada cuarto de vuelta es multiplicar por i.", {}]],
  'suma-complejos': [['drag', "Arrastra la punta de la segunda flecha: sale de la punta de la primera.", {"tile": "z₂", "slot": "estrella"}]],
  'conjugado-espejo': [['drag', "Arrastra el punto al reflejo de z en el eje real.", {"tile": "z̄", "slot": "reflejo"}]],
  'modulo-circulo': [['slide', "Arrastra el borde del círculo hasta que pase por el punto.", {}]],
  'despeja-x': [['drag', "Arrastra una tarjeta a la ecuación: se aplica a los dos lados.", {"tile": "−5", "slot": "ecuación"}]],
  'encuentro-caminantes': [['slide', "Arrastra el reloj: los dos caminantes avanzan.", {}]],
  'consecutivos': [['slide', "Arrastra el primer número: los demás lo siguen.", {}]],
  'sin-o-infinitas': [['slide', "Arrastra d y mira las dos rectas.", {}]],
  'perimetro-x': [['slide', "Arrastra el ancho del rectángulo.", {}]],
  'simetria-parabola': [['slide', "Arrastra la recta de simetría.", {}]],
  'abertura-a': [['slide', "Arrastra a: la parábola se abre, se cierra o se voltea.", {}]],
  'forma-canonica': [['slide', "Arrastra h y k hasta que la parábola de trazos se monte encima.", {}]],
  'ingreso-maximo': [['slide', 'Arrastra el precio y mira el punto en la gráfica del ingreso.', {}]],
  'producto-cero': [['slide', "Arrastra las dos marcas: busca dónde se anula algún factor.", {}]],
  'discriminante-traslada': [['slide', "Arrastra c: la parábola sube o baja.", {}]],
  'raices-simetricas': [['slide', "Arrastra la distancia: las dos marcas se abren desde el eje.", {}]],
  'area-ecuacion': [['slide', "Arrastra x: el terreno cambia y se ve su área.", {}]],
  'bolsas-residuo': [['slide', "Arrastra cuántas bolsas llenar: lo que queda suelto es el residuo.", {}]],
  'grado-cociente': [['slide', "Arrastra el grado del cociente hasta igualar la torre de P.", {}]],
  'lado-faltante': [['slide', "Arrastra el otro lado del rectángulo: lo que no cabe es el residuo.", {}]],
  'completa-identidad': [['slide', "Arrastra el residuo hasta que la igualdad se cumpla.", {}]],
  'iguala-coeficientes': [['slide', "Arrastra a y b y compara coeficiente por coeficiente.", {}]],
  'signo-divisor': [['slide', "Arrastra c: la altura de la gráfica en c es el residuo.", {}]],
  'llena-sintetica': [['drag', "Arrastra fichas a la fila de abajo de la tabla.", {"tile": "−1", "slot": "casilla"}]],
  'factor-k': [['slide', "Arrastra k hasta que el residuo P(c) sea cero.", {}]],
  'arma-factores': [['drag', "Arrastra a cada casilla el número que anula ese factor.", {"tile": "3", "slot": "(x − □)"}]],
  'tramo-signo': [['slide', "Arrastra la ficha de prueba por los tramos de la recta.", {}]],
  'multiplicidad': [['slide', "Arrastra el exponente de cada cero: la curva cruza o rebota.", {}]],
  'prueba-candidatos': [['drag', "Arrastra un candidato al probador; si da 0, llévalo a los ceros.", {"tile": "2", "slot": "probador"}]],
  'arma-ceros': [['drag', "Arrastra fichas de cero a la recta; una sobre otra es un cero repetido.", {"tile": "cero", "slot": "recta"}]],
  'factoriza-cubica': [['slide', "Arrastra c buscando un cero del polinomio.", {}]],
  'prohibidos': [['drag', "Arrastra cruces a la recta, a los valores que anulan el denominador.", {"tile": "✕", "slot": "recta"}]],
  'evalua-racional': [['slide', "Arrastra x y mira el numerador y el denominador.", {}]],
  'cerca-asintota': [['slide', "Arrastra la distancia al valor prohibido: la fracción se dispara.", {}]],
  'denominador-comun': [['drag', "Arrastra a la caja los factores del común denominador.", {"tile": "x", "slot": "caja"}]],
  'amplifica-fraccion': [['drag', "Arrastra a cada fracción el factor que le falta.", {"tile": "x", "slot": "fracción"}]],
  'resta-fracciones': [['drag', "Arrastra el signo menos sobre cada término.", {"tile": "−", "slot": "término"}]],
  'voltea-divide': [['drag', "Arrastra la segunda fracción al volteador y luego junto a la primera.", {"tile": "a/b", "slot": "volteador"}]],
  'multiplica-cancela': [['drag', "Arrastra un factor de arriba sobre uno igual de abajo.", {"tile": "x", "slot": "x"}]],
  'dos-rectas': [['drag', "Arrastra el punto hasta el cruce de las dos rectas.", {"tile": "•", "slot": "cruce"}]],
  'elimina-variable': [['slide', "Arrastra k hasta que la barra de y desaparezca.", {}]],
  'dos-compras': [['slide', "Arrastra los dos precios hasta que cuadren los dos recibos.", {}]],
  'corte-parabola-recta': [['slide', "Arrastra la recta arriba o abajo hasta el corte marcado.", {}]],
  'circulo-recta': [['slide', "Arrastra la recta y mira cuántas veces corta el círculo.", {}]],
  'rectangulo-pa': [['drag', "Arrastra la esquina del rectángulo: perímetro y área a la vez.", {"tile": "•", "slot": "esquina"}]],
  'parciales-tapar': [['slide', "Arrastra A y B hasta que las barras lleguen a su meta.", {}]],
  'tapa-evalua': [['drag', "Arrastra la tapa a un factor y lleva el número a su casilla.", {"tile": "tapa", "slot": "factor"}]],
  'ajusta-exponencial': [['slide', "Arrastra a y b hasta que la curva pase por los dos puntos.", {}]],
  'mueve-asintota': [['drag', "Arrastra el punto ancla: la curva y su asíntota lo siguen.", {"tile": "•", "slot": "lugar"}]],
  'mitad-espejo': [['slide', "Arrastra x hasta la altura pedida.", {}]],
  'hacia-e': [['slide', "Arrastra n, el número de pagos al año.", {}]],
  'exponente-buscado': [['slide', "Arrastra el exponente: cuántas veces se multiplica por la base.", {}]],
  'entre-potencias10': [['drag', "Arrastra el número a su tramo entre potencias de 10.", {"tile": "N", "slot": "tramo"}]],
  'expande-log': [['drag', "Arrastra a cada término el número que lo multiplica.", {"tile": "2", "slot": "□·log x"}]],
  'cabe-barra': [['slide', "Arrastra cuántas barras de abajo caben en la de arriba.", {}]],
  'baja-con-log': [['drag', "Arrastra operaciones a la ecuación hasta dejar la x sola.", {"tile": "log", "slot": "ecuación"}]],
  'media-vida': [['slide', "Arrastra el tiempo por la curva de decaimiento.", {}]],
  'sube-al-exponente': [['slide', "Arrastra x hasta que el logaritmo llegue a la altura pedida.", {}]],
  'cambio-u': [['drag', "Arrastra banderas a los ceros de u que sirven.", {"tile": "bandera", "slot": "eje u"}]],
  'tasa-unitaria': [['slide', "Arrastra el precio de una unidad hasta llenar la barra del paquete.", {}]],
  'tabla-compuesta': [['slide', "Arrastra cuánto rinde cada casilla.", {}]],
  'estira-todo': [['slide', "Estira la barra del total hasta que la marca caiga en la parte.", {}]],
  'oferta-lleve': [['slide', "Arrastra el descuento hasta cubrir lo que no se paga.", {}]],
  'puntos-o-porciento': [['slide', "Arrastra el cambio relativo, medido sobre el valor de antes.", {}]],
  'ubica-potencias': [['drag', "Arrastra cada potencia a su valor en la recta.", {"tile": "2⁵", "slot": "recta"}]],
  'reparte-exponente': [['slide', "Arrastra el exponente de cada factor.", {}]],
  'lado-cubo': [['slide', "Arrastra el lado del cubo hasta el volumen pedido.", {}]],
  'indice-radical': [['slide', "Arrastra el índice y el radicando.", {}]],
  'arregla-termino': [['slide', "Arrastra una barra arriba o abajo.", {}]],
  'suma-impares': [['slide', "Arrastra cuántas escuadras de impares pones.", {}]],
  'zigzag-razon': [['slide', "Arrastra la razón de la progresión.", {}]],
  'periodico-serie': [['slide', "Arrastra numerador y denominador.", {}]],
  'producto-telescopico': [['slide', "Arrastra el límite de arriba del producto.", {}]],
  'monomio-area': [['slide', "Arrastra el número y el exponente del área.", {}]],
  'cubo-del-binomio': [['slide', "Arrastra los tres coeficientes.", {}]],
  'elige-comite': [['slide', "Arrastra cuántas personas tiene el comité.", {}]],
  'parte-medio': [['slide', "Arrastra m y n hasta cumplir suma y producto.", {}]],
  'cuadrado-complejo': [['drag', "Arrastra z por el plano.", {"tile": "z", "slot": "plano"}]],
  'edades-barras': [['slide', "Arrastra la edad del hijo.", {}]],
  'tres-puntos': [['slide', "Arrastra a, b y c hasta pasar por los puntos.", {}]],
  'vieta-raices': [['slide', "Arrastra las dos raíces por el eje.", {}]],
  'reparte-terminos': [['drag', "Arrastra a cada casilla el cociente de su término.", {"tile": "3x²", "slot": "casilla"}]],
  'divisor-fraccion': [['slide', "Arrastra c hasta que el divisor valga cero.", {}]],
  'ceros-fraccion': [['drag', "Arrastra banderas a los ceros.", {"tile": "bandera", "slot": "eje"}]],
  'signo-afuera': [['drag', "Arrastra el −1 sobre un factor para escribirlo al revés.", {"tile": "−1", "slot": "factor"}]],
  'fraccion-compuesta': [['drag', "Arrastra el multiplicador sobre la fracción.", {"tile": "2x", "slot": "fracción"}]],
  'escalera-sistema': [['slide', "Arrastra x, y y z hasta encender las tres.", {}]],
  'parciales-repetido': [['slide', "Arrastra A y B hasta que las barras lleguen.", {}]],
  'cruce-potencias': [['drag', "Arrastra banderas a los cruces.", {"tile": "bandera", "slot": "cruce"}]],
  'regla-del-72': [['slide', "Arrastra los años hasta el primero que cumple.", {}]],
  'escala-sonido': [['slide', "Arrastra el sonido por la escala de decibeles.", {}]],
  'dos-ciudades': [['slide', "Arrastra los años hasta el primero que cumple.", {}]],
  'factor-area': [['slide', "Arrastra el factor k que multiplica las longitudes.", {}]],
  'tales-rectas': [['drag', "Arrastra B' hasta que BB' quede paralela a AA'.", {"tile": "B'", "slot": "recta"}]],
  'corta-paralelogramo': [['slide', "Arrastra la base hasta el área pedida.", {}]],
  'mide-circulo': [['drag', "Arrastra el borde del círculo hasta la medida pedida.", {"tile": "r", "slot": "borde"}]],
  'trapecio-promedio': [['drag', "Arrastra el ancho del rectángulo hasta igualar el área.", {"tile": "ancho", "slot": "trapecio"}]],
  'triangulo-cuadricula': [['drag', "Arrastra el vértice por la cuadrícula hasta el área pedida.", {"tile": "•", "slot": "punto"}]],
  'poligono-cuadricula': [['drag', "Arrastra el vértice suelto por la cuadrícula.", {"tile": "•", "slot": "punto"}]],
  'sombreado-resta': [['drag', "Arrastra el borde de la figura de adentro.", {"tile": "borde", "slot": "cuadrado"}]],
  'prisma-capas': [['slide', "Arrastra la altura: cada capa es una copia de la base.", {}]],
  'cono-tercio': [['slide', "Arrastra la altura del cono hasta el volumen pedido.", {}]],
  'desarrollo-caja': [['slide', "Arrastra la altura de la caja hasta la superficie pedida.", {}]],
  'fila-pistas': [['drag', "Arrastra cada nombre a su puesto; las pistas se marcan al cumplirse.", {"tile": "Ana", "slot": "puesto"}]],
  'edificio-pisos': [['drag', "Arrastra cada nombre a su piso; las pistas se marcan al cumplirse.", {"tile": "Ana", "slot": "piso"}]],
  'carrera-llegada': [['drag', "Arrastra cada corredor a su puesto de llegada.", {"tile": "Ana", "slot": "puesto"}]],
  'dias-semana': [['drag', "Arrastra cada actividad a su día de la semana.", {"tile": "Arte", "slot": "día"}]],
  'mesa-redonda': [['drag', "Arrastra cada nombre a una silla; la primera persona ya está sentada.", {"tile": "Ana", "slot": "silla"}]],
  'collar-cuentas': [['drag', "Arrastra cada cuenta a un hueco del collar.", {"tile": "roja", "slot": "hueco"}]],
  'brujula-casas': [['drag', "Arrastra cada nombre a su casa alrededor de la plaza.", {"tile": "Ana", "slot": "casa"}]],
  'descarta-casos': [['drag', "Arrastra una pista sobre la tarjeta que la incumple para tacharla.", {"tile": "pista", "slot": "tarjeta"}]],
  'gira-mesa': [['turn', "Arrastra alrededor de la mesa de la derecha para girarla.", {}]],
  'ronda-saltos': [['drag', "Arrastra la corona hasta la persona que se queda.", {"tile": "corona", "slot": "persona"}]],
  'tabla-cruces': [['drag', "Arrastra las fichas ✓ a la tabla: una por fila y columna.", {"tile": "✓", "slot": "casilla"}]],
  'casilleros': [['drag', "Arrastra cada cosa al casillero de su dueño.", {"tile": "balón", "slot": "casillero"}]],
  'tres-listas': [['drag', "Arrastra colores y mascotas a las casillas de cada persona.", {"tile": "rojo", "slot": "casilla"}]],
  'comite-reglas': [['drag', "Arrastra personas al comité y de vuelta; las reglas se marcan.", {"tile": "F", "slot": "comité"}]],
  'tiene-podria': [['drag', "Prueba casos arriba y arrastra cada afirmación a su zona.", {"tile": "O va", "slot": "zona"}]],
  'trabajo-conjunto': [['slide', "Arrastra las horas que trabajan juntos hasta llenar el tanque.", {}]],
  'velocidad-media': [['slide', "Arrastra la velocidad constante que hace el viaje en el mismo tiempo.", {}]],
  'persecucion': [['slide', "Arrastra el tiempo hasta que los dos carros coincidan.", {}]],
  'arbol-opciones': [['slide', "Arrastra cuántas ramas tiene el nivel que falta.", {}]],
  'placas-codigo': [['drag', "Arrastra a cada casilla cuántas opciones tiene.", {"tile": "26", "slot": "casilla"}]],
  'anagramas': [['drag', "Arrastra al denominador un k! por cada letra repetida.", {"tile": "2!", "slot": "abajo"}]],
  'saludos': [['drag', "Arrastra de una persona a otra para trazar su saludo.", {"tile": "A", "slot": "B"}]],
  'diagonales': [['drag', "Arrastra de un vértice a otro no vecino para trazar la diagonal.", {"tile": "•", "slot": "vértice"}]],
  'cuenta-triangulos': [['drag', "Arrastra sobre la base de una recta a otra para marcar un triángulo.", {"tile": "•", "slot": "base"}]],
  'cuenta-cuadrados': [['slide', "Arrastra cuántos cuadrados hay de cada tamaño.", {}]],
  'complemento-conteo': [['drag', "Arrastra fichas: arriba todos los casos, abajo los que no sirven.", {"tile": "10", "slot": "casilla"}]],
  'suma-casos': [['drag', "Arrastra + o × al hueco entre los dos grupos.", {"tile": "+", "slot": "hueco"}]],
  'ruta-cuadras': [['trace', "Arrastra el dedo por las calles de A hasta B.", {}]],
  'brujula-pasos': [['drag', "Arrastra la ficha a la esquina donde termina el recorrido.", {"tile": "•", "slot": "esquina"}]],
  'punto-distancia': [['drag', "Arrastra la casa a la esquina que cumple las dos distancias.", {"tile": "casa", "slot": "esquina"}]],
  'torres-vistas': [['slide', "Arrastra cada casilla hacia arriba o abajo para cambiar su altura.", {}]],
  'cubos-ocultos': [['slide', "Arrastra el total de cubos, contando los escondidos.", {}]],
  'cubo-pintado': [['slide', "Arrastra cuántos cubitos tienen 3, 2, 1 y ninguna cara pintada.", {}]],
  'arma-desarrollo': [['drag', "Arrastra cuadrados a la cuadrícula hasta que el cubo cierre.", {"tile": "+", "slot": "casilla"}]],
  'caras-opuestas': [['drag', "Arrastra a cada hueco la letra que queda en la cara opuesta.", {"tile": "A", "slot": "hueco"}]],
  'dado-siete': [['drag', "Arrastra los números a las caras escondidas del dado.", {"tile": "6", "slot": "cara"}]],
  'espejo-figura': [['paint', "Pinta arrastrando las casillas del reflejo.", {}]],
  'gira-figura': [['turn', "Arrastra alrededor de la figura para girarla.", {}]],
  'dobla-papel': [['slide', "Arrastra cuántos agujeros habrá al abrir la hoja.", {}]],
  'reloj-espejo': [['turn', "Arrastra el minutero hasta la hora real.", {}]],
  'espejo-palabra': [['drag', "Arrastra las letras en el orden en que se ven en el espejo.", {"tile": "S", "slot": "casilla"}]],
  'diferencias-escalera': [['drag', "Arrastra la barra que falta; abajo se ven las diferencias.", {}]],
  'fibonacci-suma': [['drag', "Arrastra la barra que falta hasta que cada suma se cumpla.", {}]],
  'alterna-dos': [['drag', "Arrastra la barra que sigue; cada color es una sucesión.", {}]],
  'letras-salto': [['drag', "Arrastra la barra: su altura es la posición de la letra.", {}]],
  'figura-patron': [['drag', "Arrastra la figura que falta para darle sus puntos.", {}]],
  'ciclo-reloj': [['turn', "Gira la flecha de la rueda hasta el día pedido.", {}]],
  'ciclo-colores': [['drag', "Arrastra una cuenta de la bandeja al hueco de la posición pedida.", {}]],
  'ultima-cifra': [['slide', "Desliza el marcador hasta la cifra en que termina la potencia.", {}]],
  'clave-simbolos': [['drag', "Arrastra fichas de la bandeja a las casillas para cifrar o descifrar.", {}]],
  'permuta-codigo': [['drag', "Arrastra las letras a las casillas en el orden del código.", {}]],
  'rueda-cesar': [['turn', "Gira el anillo de adentro hasta que la pista se cumpla.", {}]],
  'altura-letras': [['drag', "Sube cada columna hasta la altura de su letra.", {}]],
  'binario-luces': [['tap', "Toca los bombillos para prenderlos o apagarlos.", {}]],
  'cuadro-polibio': [['tap', "Toca las letras del cuadro en orden.", {}]],
  'maquina-regla': [['drag', "Arrastra una regla a la máquina y desliza su número.", {}]],
  'lee-barras': [['slide', "Desliza el marcador hasta la respuesta que da la gráfica.", {}]],
  'arma-barras': [['drag', "Sube cada barra hasta el dato de la tabla.", {}]],
  'mayor-subida': [['drag', "Arrastra la lupa al tramo que pide la pregunta.", {}]],
  'variacion-barras': [['slide', "Desliza el porcentaje hasta que la barra fantasma iguale a la nueva.", {}]],
  'nivela-datos': [['drag', "Arrastra la línea hasta que sobre lo mismo que falta.", {}]],
  'ordena-mediana': [['drag', "Arrastra los valores a las casillas de menor a mayor.", {}]],
  'tres-centros': [['drag', "Arrastra cada alfiler a su lugar en la recta.", {}]],
  'dato-faltante': [['drag', "Sube la barra que falta hasta que el promedio dé justo.", {}]],
  'balanza-promedio': [['drag', "Arrastra el apoyo hasta que la regla quede quieta.", {}]],
  'muestra-sesgo': [['drag', "Arrastra el marco hasta que la muestra se parezca al pueblo.", {}]],
  'eje-engano': [['slide', "Baja el piso del eje y desliza el porcentaje.", {}]],
  'tabla-doble': [['drag', "Arrastra la parte pintada de cada barra hasta su porcentaje.", {}]],
  'circuito-logico': [['tap', "Toca los interruptores hasta que el bombillo quede como se pide.", {}]],
  'tabla-verdad': [['tap', "Toca cada casilla de la columna para ponerle V o F.", {}]],
  'rompe-promesa': [['tap', "Toca los casos en que la frase es falsa (o verdad).", {}]],
  'adivina-conectivo': [['drag', "Arrastra un conectivo a la casilla hasta que la columna coincida.", {}]],
  'arma-negacion': [['drag', "Arrastra las fichas a las casillas para escribir la frase.", {}]],
  'contraejemplo': [['tap', "Toca la ficha que tumba la frase.", {}]],
  'niega-todos': [['tap', "Toca las luces para volver falsa la frase con lo mínimo.", {}]],
  'flecha-deduce': [['tap', "Toca el foco sin dato: sí, no o no se sabe.", {}]],
  'arma-silogismo': [['drag', "Arrastra los círculos hasta cumplir todas las premisas.", {}]],
  'quien-miente': [['tap', "Toca a cada personaje para suponer si dice la verdad o miente.", {}]],
  'maquina-operador': [['slide', "Desliza los números de las bocas hasta lograr el resultado.", {}]],
  'cruce-tabla': [['tap', "Toca la casilla del cruce: fila del primero, columna del segundo.", {}]],
  'neutro-buscador': [['slide', "Desliza e hasta que no cambie a ningún número.", {}]],
  'adivina-operador': [['drag', "Arrastra una regla a la casilla hasta que sirva para todos los ejemplos.", {}]],
  'anida-operador': [['tap', "Toca la caja de adentro para calcularla; luego la de afuera.", {}]],
  'busca-x-operador': [['slide', "Desliza x hasta que la balanza quede pareja.", {}]],
  'corta-lo-que-queda': [['drag', "Arrastra el corte de cada fila hasta las partes que se gastan.", {}]],
  'area-queda': [['drag', "Arrastra las dos agarraderas para dejar pintado lo que queda.", {}]],
  'total-original': [['slide', "Desliza el total hasta que quede lo que se sabe.", {}]],
  'nota-ponderada': [['drag', "Sube la barra de la nota que falta hasta la meta.", {}]],
  'cripto-letras': [['drag', "Arrastra cada rueda arriba o abajo para cambiar la cifra.", {}]],
  'tablero-cifras': [['tap', "Toca un número para ponerlo a prueba.", {}]],
  'peor-caso-bolsa': [['slide', "Desliza cuántas bolas sacar; el juego saca con la peor suerte.", {}]],
  'rectangulo-max': [['drag', "Arrastra la esquina del rectángulo.", {}]],
  'reparto-extremo': [['drag', "Sube o baja la columna de cada niño.", {}]],
  'cinta-ecuacion': [['slide', "Desliza x hasta que la cinta llegue justo al total.", {}]],
  'mezcla-precio': [['slide', "Desliza cuántos kilos van del primero hasta el precio pedido.", {}]],
  'alcancia-monedas': [['drag', "Arrastra la divisoria entre las monedas de cada valor.", {}]],
  'intervalo-solucion': [['drag', "Arrastra la frontera, toca el punto y toca el lado de las soluciones.", {}]],
  'encuesta-tres': [['drag', "Arrastra arriba o abajo sobre cada zona para cambiar su número.", {}]],
  'solapa-barras': [['drag', "Arrastra la barra de abajo hasta que cuadren los de ninguno.", {}]],
  'criba-primos': [['tap', "Toca un número libre para tachar todos sus múltiplos.", {}]],
  'arbol-factores': [['drag', "Arrastra un primo sobre una hoja que divida.", {}]],
  'tabla-divisores': [['drag', "Arrastra las agarraderas de filas y columnas de la tabla.", {}]],
  'cifra-faltante': [['drag', "Arrastra la rueda de la cifra arriba o abajo.", {}]],
  'ritmos-mcm': [['drag', "Arrastra el marcador por la línea de tiempo.", {}]],
  'corta-mcd': [['slide', "Desliza el tamaño de la baldosa.", {}]],
  'pares-primos': [['tap', "Toca una ficha de arriba y luego su pareja de abajo.", {}]],
  'tabla-dados': [['tap', "Toca las casillas donde pasa el suceso.", {}]],
  'urna-fraccion': [['drag', "Arrastra bolas a la urna o sácalas de ella.", {}]],
  'ruleta-sectores': [['tap', "Toca los sectores para pintarlos o despintarlos.", {}]],
  'arbol-caminos': [['tap', "Toca las hojas de los caminos que sirven.", {}]],
  'area-probabilidad': [['drag', "Arrastra el borde del lado que falta.", {}]],
  'lazo-conjunto': [['trace', 'Rodea con el dedo los elementos que pertenecen (o tócalos) y entran al conjunto.', { labels: ['pera', 'uva', 'mango'], trap: 'papa' }], ['tap', 'Cuando adentro estén justo los que cumplen la condición, toca «Listo».', { items: ['pera', 'papa', 'Listo'], pick: [0, 2] }]],
  'cubo-partes': [['tap', 'Arma un subconjunto con los interruptores y toca «Encender». Enciéndelos todos sin repetir.', { items: ['x', 'y', 'Encender'], pick: [0, 2] }]],
  'orbita-conjuntos': [['tap', 'Marca todos los conjuntos que cumplen la relación con A y toca «Listo».', { items: ['{a}', '{a, e}', 'Listo'], pick: [0, 2] }]],
  'descifra-zona': [['slide', 'Desliza cada rueda hasta que el color coincida con la zona rayada y toca «Listo».', { label: 'operación' }]],
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
  'limonada': [['slide', 'Desliza cada ingrediente y compara la razón y el color de las dos jarras.', { label: 'limón' }]],
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
  'rana-zenon': [['touch', 'Cada toque en el estanque es un salto: mira la suma que lleva el marcador.', { label: 'salto' }], ['tap', 'Toca la bandera donde cae (o a la que se acerca sin llegar nunca).', { items: ['⚑', '⚑', '⚑'], pick: [1] }]],
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
  'revienta-globos': [['tap', 'Toca las burbujas cuyo conjunto cumple la misión de la ronda.', { items: ['{a}', '{a, b}', '∅'], pick: [0] }]],
  'rieles-paralelos': [['turn', 'Gira el riel con su manija (o con ◀ ▶) hasta dejarlo como pide la ronda.', {}]],
  'rompe-cambios': [['slide', 'Mueve la paleta con el dedo; al soltar, la pelota sale hacia arriba.', { label: 'paleta' }]],
  'rueda-angulo': [['turn', 'Gira el lado terminal arrastrando su punta; los botones ajustan de a un paso.', {}]],
  'rueda-porcentaje': [['turn', 'Gira la aguja hasta que el sector cubra justo la parte pedida.', {}]],
  'saca-del-radical': [['tap', 'Toca fichas iguales dentro de la raíz para sacarlas como un solo factor.', { items: ['2', '2', '3'], pick: [0, 1] }]],
  'salta-la-coma': [['tap', 'Con ◀ y ▶ corre el punto un lugar: el exponente de 10 lo compensa.', { items: ['◀', '▶'], pick: [1, 1] }]],
  'salta-signos': [['touch', 'Toca la pantalla para saltar las fichas peligrosas; las demás se atrapan corriendo.', { label: '¡salta!' }]],
  'sellos-graficas': [['tap', 'Toca los sellos en orden: cada uno transforma la gráfica actual. ↶ quita el último.', { items: ['→', '↑', '×2'], pick: [0, 2] }]],
  'semaforo-signos': [['tap', 'Toca cada casilla para poner + o −; la fila del producto se calcula sola.', { items: ['+', '−', '+'], pick: [1] }], ['tap', 'Luego enciende los tramos de la solución y decide los puntos críticos.', { items: ['tramo', 'tramo', 'tramo'], pick: [0, 2] }]],
  'serpiente-orden': [['slide', 'Desliza en la dirección del próximo paso. Come las fichas de menor a mayor.', { label: 'avanza' }]],
  'siembra-raices': [['tap', 'Toca las semillas de la respuesta y luego «Sembrar»: crecen hasta su potencia.', { items: ['−2', '0', '2', 'Sembrar'], pick: [0, 2, 3] }]],
  'sintoniza-onda': [['slide', 'Desliza las manijas de la onda hasta hacerla coincidir con la punteada.', { label: 'amplitud' }]],
  'sirve-la-razon': [['hold', 'Mantén presionado para servir y suelta cuando la cantidad mantenga la razón.', {}]],
  'sombra-arbol': [['slide', 'Ajusta la altura del árbol hasta que el rayo caiga justo en la banderita.', { vert: true }]],
  'sombra-equivalente': [['tap', 'Toca una operación: se aplica a los dos lados. El signo de la desigualdad también se toca.', { items: ['− 3', '÷ (−2)', '<'], pick: [0, 1, 2] }]],
  'suma-filas': [['slide', 'Arrastra la manija para desplegar más filas y compara la suma.', { vert: true }]],
  'tabla-conjugado': [['tap', 'Elige por cuál multiplicar: el juego arma la tabla y muestra qué se cancela. Prueba varias.', { items: ['√3 + 1', '√3 − 1'], pick: [0, 1] }]],
  'tacha-repetidos': [['tap', 'Toca las letras que sobran para tacharlas: cada una debe quedar una sola vez.', { items: ['O', 'S', 'O'], pick: [2] }]],
  'tanque-pitagorico': [['slide', 'Ajusta la perilla (arrastre o − / +) hasta que el líquido llegue justo a la marca.', { vert: true }]],
  'telarana-polar': [['drag', 'Arrastra la araña al nudo del resultado: el módulo en el hilo, el ángulo en el rayo.', { dot: true }]],
  'tirolesa': [['step', 'Suelta o recoge cable con los botones hasta que quede tenso entre las torres.', { from: 4, to: 5, label: 'cable' }]],
  'torre-pisos': [['slide', 'Arrastra el ascensor hasta el piso, contando desde la planta baja.', { vert: true }], ['tap', 'Cuando estés en el piso, toca «Entregar».', { items: ['Entregar'], pick: [0] }]],
  'torre-producto': [['slide', 'Sube la manija para construir la torre. Cada piso aplica una multiplicación.', { vert: true }]],
  'tragamonedas': [['step', 'Toca arriba o abajo de cada rodillo para armar el factor.', { from: 2, to: 3, label: 'décimas' }]],
  'traza-progresion': [['trace', 'Traza el camino pasando por los términos en orden; puedes levantar el dedo y pensar.', { labels: ['4', '7', '10'], trap: '9' }]],
  'tren-ordenado': [['drag', 'Arrastra cada vagón a su lugar: de menor a mayor, de izquierda a derecha.', { tile: '−2', slot: 'primer vagón' }]],
  'tuberia-maquinas': [['tap', 'Toca una máquina para meterla en el primer tubo libre; tocar un tubo lo vacía.', { items: ['x + 3', 'x²', '√x'], pick: [1, 0] }]],
  'ubica-en-recta': [['drag', 'Suelta cada número sobre la recta, en su lugar.', { tile: '½', slot: 'entre 0 y 1' }]],
  'une-factor': [['drag', 'Arrastra desde cada cambio hasta su factor para tender la cuerda.', { cord: true, tile: '+25 %', slot: '× 1.25', other: '× 0.75' }]],
  'une-parejas': [['drag', 'Arrastra desde una etiqueta de la izquierda hasta su pareja.', { cord: true, tile: 'A', slot: 'su pareja', other: 'otra' }]],
  'verdadero-falso': [['swipe', 'Desliza la tarjeta: a la derecha si es verdadera, a la izquierda si es falsa.', { left: 'falso', right: 'verdadero' }]],
  'voltea-desigualdad': [['tap', 'Después de cada operación elige «<» o «>» para el nuevo orden de los puntos.', { items: ['<', '>'], pick: [1] }]],
  'vuela-precios': [['slide', 'Arrastra el planeador hasta la altura del resultado y suelta para volar.', { vert: true }]],
};

// Los ejercicios que no son juegos también tienen su ejemplo.
const GUIDE_TYPES = {
  mc: [['tap', 'Lee las opciones y toca la que creas correcta. Puedes cambiarla antes de comprobar.', { items: ['A', 'B', 'C'], pick: [1] }]],
  input: [['keys', 'Escribe tu respuesta con el teclado: valen decimales y fracciones como 3/4.', { text: '3/4' }]],
  order: [['tap', 'Toca las fichas en el orden correcto; tocar una que ya pusiste la devuelve.', { items: ['2.º', '1.º', '3.º'], pick: [1, 0, 2] }]],
  slider: [['slide', 'Mueve el deslizador y mira cómo cambia el dibujo hasta que cumpla lo pedido.', { label: 'valor' }]],
};

for (const [id, game] of Object.entries(typeof GAMES === 'undefined' ? {} : GAMES)) {
  if (game.algebraScene) GUIDES[id] = [['drag', game.instruction + '.', {}]];
}

const guideKey = ex => (ex?.type === 'play' ? ex.game : ex?.type);
const practiceGuideLines = ex => (ex?.type === 'play' ? GUIDES[ex.game] : GUIDE_TYPES[ex?.type])?.map(([, text]) => text) ?? [];

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

// La franja forma parte del área de práctica: al abrirla, el lienzo conserva su propia zona de toque.
let practiceGuideId = 0;
function mountPracticeGuide(host, button, ex, auto, replay) {
  const note = document.createElement('div');
  note.id = `instrucciones-juego-${++practiceGuideId}`;
  note.className = 'practice-guide';
  note.hidden = true;
  note.setAttribute('role', 'status');
  for (const text of practiceGuideLines(ex)) {
    const line = document.createElement('p');
    line.textContent = text;
    note.appendChild(line);
  }
  host.prepend(note);
  const stage = host.querySelector('.game-stage') || host;
  button.setAttribute('aria-controls', note.id);
  const guide = { close, el: note };
  let afterRelease = 0;
  const dismissIntro = () => { afterRelease = requestAnimationFrame(close); };
  function close() {
    stage.removeEventListener('pointerup', dismissIntro);
    cancelAnimationFrame(afterRelease);
    note.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (guideOpen === guide) guideOpen = null;
  }
  function show(manual) {
    if (manual) { closeGuide(); guideOpen = guide; }
    note.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    if (typeof S !== 'undefined' && !ex.exam && !(S.guides ||= {})[guideKey(ex)]) {
      S.guides[guideKey(ex)] = true;
      if (typeof save === 'function') save();
    }
  }
  button.onclick = () => {
    Sfx.tap();
    if (note.hidden) {
      show(true);
      replay?.();
      host.scrollIntoView({ block: 'nearest' });
    } else close();
  };
  if (auto) {
    show(false);
    stage.addEventListener('pointerup', dismissIntro, { once: true });
  } else close();
  return close;
}

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
    if (typeof tex === 'function' && typeof texify === 'function' && window.katex) text.innerHTML = tex(texify(steps[i][1])); else text.textContent = steps[i][1];
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
  // Un juego que se explica sobre el lienzo (mano que hace el gesto) no abre la tarjeta emergente.
  if (ex?.type === 'play' && typeof GAMES !== 'undefined' && GAMES[ex.game]?.demo) return false;
  if (ex?.exam) return false;
  if (typeof S === 'undefined' || !guideSteps(ex).length) return false;
  if (S.guideAuto === false || S.guides?.[guideKey(ex)]) return false;
  return !(typeof document !== 'undefined' && document.querySelector?.('#overlay.open .exam-foot'));   // js/exam.js
}
