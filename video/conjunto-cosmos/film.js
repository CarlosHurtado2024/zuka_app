// «El día que Plutón cambió de conjunto» · canvas 2D, 1080×1920, cada cuadro es una función pura de t (film(t)).
// Estilo «showreel matemático»: fondo azul casi negro con viñeta, trazos finos neón con resplandor (cian, magenta, ámbar,
// violeta, verde), fórmulas en letra de libro (fuentes de KaTeX), etiquetas monoespaciadas con valores en vivo y un HUD
// fijo (marca, contador de escena, reloj, barra de avance y la fórmula de la escena). Guion y tiempos en data.js.
const W = 1080, H = 1920, CX = 540, SY = 760;   // SY: centro del escenario
let X;
const C = { bg: '#04060e', ink: '#eef2ff', mute: '#7f8ab0', dim: '#3a4263', cyan: '#35e0ff', mag: '#ff4fb0', amber: '#ffc247', violet: '#a78bfa', green: '#5ef2a6', red: '#ff5a6a', blue: '#5b8cff' };

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const A = (t, t0, d = .5) => eo(seg(t, t0, t0 + d));                        // aparece en t0
const win = (t, a, b, d = .45) => A(t, a, d) * (1 - seg(t, b - d, b));      // visible entre a y b
const hexA = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- texto ----------
const MONO = "Consolas, 'Courier New', monospace";
const font = (k, s) => (k === 'i' ? `italic ${s}px KMath, Georgia, 'Cambria Math', serif` : k === 'it' ? `italic ${s}px KMain, Georgia, serif` : k === 'r' ? `${s}px KMain, 'Cambria Math', Georgia, serif`
  : k === 'mono' ? `${s}px ${MONO}` : k === 'brand' ? `600 ${s}px Jost, sans-serif` : `300 ${s}px Jost, sans-serif`);
function fade(a, fn) { if (a <= .003) return; X.save(); X.globalAlpha *= a; fn(); X.restore(); }
function glow(col, blur, fn) { X.save(); X.shadowColor = col; X.shadowBlur = blur; fn(); X.restore(); }
// Texto suelto. o: k (tipo de letra), s, c, a ('l' | 'c' | 'r'), ls (espaciado), max (ancho máximo: se encoge), g (brillo).
function T(str, x, y, o = {}) {
  const s = o.s || 40; X.font = font(o.k || 'r', s); X.letterSpacing = (o.ls || 0) + 'px'; X.fillStyle = o.c || C.ink;
  const w = X.measureText(str).width, k = o.max && w > o.max ? o.max / w : 1, x0 = o.a === 'c' ? x - w * k / 2 : o.a === 'r' ? x - w * k : x;
  X.save(); if (o.g) { X.shadowColor = o.c || C.ink; X.shadowBlur = o.g; } X.translate(x0, y); X.scale(k, k); X.fillText(str, 0, 0); X.restore(); X.letterSpacing = '0px';
  return w * k;
}
// Renglón de fórmula: partes [texto, tipo ('i' cursiva matemática | 'r' redonda), color]. o.rev (0–1) lo va escribiendo
// parte por parte; o.a alineación; o.max ancho máximo. Devuelve { x0, w, mid(i) }.
function F(parts, x, y, size, o = {}) {
  let wsum = 0; const pos = [];
  for (const [s, k] of parts) { X.font = font(k, size); const w = X.measureText(s).width; pos.push([wsum, w]); wsum += w; }
  const sc = o.max && wsum > o.max ? o.max / wsum : 1, x0 = o.a === 'l' ? x : o.a === 'r' ? x - wsum * sc : x - wsum * sc / 2, rev = o.rev ?? 1, n = parts.length;
  X.save(); X.translate(x0, y); X.scale(sc, sc);
  parts.forEach(([s, k, c], i) => {
    const a = clamp(rev * n - i); if (a <= 0) return;
    X.font = font(k, size); X.fillStyle = c || o.c || C.ink; X.globalAlpha *= a;
    if (c && o.g !== 0) { X.shadowColor = c; X.shadowBlur = o.g ?? 14; } else X.shadowBlur = 0;
    X.fillText(s, pos[i][0], (1 - a) * 10); X.globalAlpha /= a || 1;
  });
  X.restore();
  return { x0, w: wsum * sc, mid: i => x0 + (pos[i][0] + pos[i][1] / 2) * sc };
}
const typed = (s, k) => s.slice(0, Math.ceil(s.length * clamp(k)));
const num = (v, d = 0) => v.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/\./g, ' ');

// ---------- trazos ----------
function stroke(col, lw, draw, o = {}) { X.save(); X.strokeStyle = col; X.lineWidth = lw; X.lineCap = 'round'; X.lineJoin = 'round'; if (o.dash) X.setLineDash(o.dash); if (o.g !== 0) { X.shadowColor = col; X.shadowBlur = o.g ?? 16; } X.beginPath(); draw(); X.stroke(); X.restore(); }
function dot(x, y, r, col, g = 18) { X.save(); X.shadowColor = col; X.shadowBlur = g; X.fillStyle = col; X.beginPath(); X.arc(x, y, r, 0, 7); X.fill(); X.restore(); }
function ring(x, y, r, col, lw = 2.5, k = 1, o = {}) { if (k > 0) stroke(col, lw, () => X.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k), o); }
function check(x, y, r, ok, k) { if (k <= 0) return; const c = ok ? C.green : C.red; stroke(c, 4, () => { if (ok) { X.moveTo(x - r, y); X.lineTo(lerp(x - r, x - r * .25, seg(k, 0, .5)), lerp(y, y + r * .7, seg(k, 0, .5))); if (k > .5) X.lineTo(lerp(x - r * .25, x + r, seg(k, .5, 1)), lerp(y + r * .7, y - r * .7, seg(k, .5, 1))); } else { X.moveTo(x - r * .8, y - r * .8); X.lineTo(lerp(x - r * .8, x + r * .8, seg(k, 0, .5)), lerp(y - r * .8, y + r * .8, seg(k, 0, .5))); if (k > .5) { X.moveTo(x + r * .8, y - r * .8); X.lineTo(lerp(x + r * .8, x - r * .8, seg(k, .5, 1)), lerp(y - r * .8, y + r * .8, seg(k, .5, 1))); } } }); }

// ---------- el sistema solar (dibujo, no a escala) ----------
const TILT = .56, ORB = i => 96 + i * 46, SPEED = i => .5 / Math.pow(1 + i * .55, 1.25), PH = [0.6, 2.2, 3.9, 5.2, 1.1, 4.4, 2.9, 0.2, 3.3], PR = [6, 9, 10, 8, 17, 15, 12, 12, 6];
const ppos = (i, t, cy = SY) => { const a = PH[i] + t * SPEED(i), r = ORB(i); return [CX + r * Math.cos(a), cy + r * TILT * Math.sin(a)]; };
// o: n (cuántos planetas, con fracción para el que va entrando), orbit (opacidad de las órbitas), label (opacidad de los
// nombres), col(i) (color), a(i) (opacidad de cada uno), cy.
function solar(t, o = {}) {
  const n = o.n ?? 9, cy = o.cy ?? SY;
  fade(o.sun ?? 1, () => { const g = X.createRadialGradient(CX, cy, 0, CX, cy, 90); g.addColorStop(0, 'rgba(255,214,120,.95)'); g.addColorStop(.25, 'rgba(255,170,60,.5)'); g.addColorStop(1, 'rgba(255,150,40,0)'); X.fillStyle = g; X.fillRect(CX - 90, cy - 90, 180, 180); dot(CX, cy, 15, '#ffe3a0', 30); });
  for (let i = 0; i < Math.ceil(n); i++) {
    const k = clamp(n - i), a = (o.a ? o.a(i) : 1) * k, col = o.col ? o.col(i) : D.PLANETS[i][1];
    if (a <= 0) continue;
    fade((o.orbit ?? .5) * a, () => stroke(i === 8 ? hexA(col, .55) : 'rgba(150,170,230,.38)', 1.5, () => X.ellipse(CX, cy, ORB(i), ORB(i) * TILT, 0, 0, Math.PI * 2 * eo(k)), { g: 0, dash: i === 8 ? [6, 10] : null }));
    const [x, y] = ppos(i, t, cy);
    fade(a, () => { dot(x, y, PR[i] * .8, col, 22); if (i === 5) stroke(hexA(col, .8), 2, () => X.ellipse(x, y, 22, 7, -.3, 0, 7), { g: 8 }); });
    if (o.label) fade(o.label * a, () => T(D.PLANETS[i][0].toLowerCase(), x + PR[i] + 8, y - PR[i] - 4, { k: 'mono', s: 20, c: hexA(col, .95) }));
  }
}
let STARS = null;
function stars(t, a = 1) {
  if (!STARS) { const R = rng(11); STARS = Array.from({ length: 150 }, () => [R() * W, 130 + R() * 1560, .5 + R() * 1.4, R() * 7, .3 + R() * .7]); }
  fade(a, () => { for (const [x, y, r, ph, b] of STARS) { X.globalAlpha = b * (.55 + .45 * Math.sin(t * .9 + ph)) * a; X.fillStyle = '#cfe0ff'; X.beginPath(); X.arc(x, y, r, 0, 7); X.fill(); } X.globalAlpha = 1; });
}

// ---------- escenas ----------
const S = {
  // 1 · Praga, 2006: las nueve órbitas se trazan; Plutón se enciende en magenta y sale de la lista.
  praga(t) {
    stars(t, A(t, 0, 2));
    const out = eio(seg(t, 10.2, 13.5));
    solar(t, { n: lerp(0, 9, eio(seg(t, .6, 7.5))), label: A(t, 4, 1.5) * (1 - seg(t, 16.5, 17.5)) * .9, col: i => (i === 8 ? C.mag : D.PLANETS[i][1]), a: i => (i === 8 ? 1 - out * .72 : 1) });
    if (t > 9.4) { const [x, y] = ppos(8, t); ring(x, y, 20 + 40 * eo(seg(t, 9.4, 10.4)), hexA(C.mag, 1 - seg(t, 9.4, 11)), 3); }
    const cnt = t < 11.6 ? 9 : 8;
    fade(A(t, 5.5, .6), () => { T('planetas', 96, 1196, { k: 'mono', s: 26, c: C.mute }); T('= ' + cnt, 232, 1196, { k: 'mono', s: 26, c: t < 11.6 ? C.amber : C.mag, g: 10 }); T('votos    = 424', 96, 1232, { k: 'mono', s: 26, c: C.mute }); });
    fade(A(t, 12, .8), () => T('plutón: fuera de la lista', 984, 1196, { k: 'mono', s: 24, c: C.mag, a: 'r', g: 8 }));
  },
  // 2 · Sin regla: una lista de memoria; llega Eris y nadie sabe si entra.
  lio(t) {
    stars(t, 1);
    solar(t + 26, { label: .55, orbit: .35, col: i => (i === 8 ? C.mag : D.PLANETS[i][1]) });
    // Eris, más afuera, en una órbita alargada
    const ea = 2.4 + t * .05, ex = CX + 500 * Math.cos(ea), ey = SY - 60 + 300 * Math.sin(ea), k = A(t, 9, 1.2);
    fade(k * .7, () => stroke(hexA(C.violet, .7), 1.5, () => X.ellipse(CX, SY - 60, 500, 300, 0, 0, 7), { g: 0, dash: [4, 12] }));
    fade(k, () => { dot(ex, ey, 6, C.violet, 24); T('eris · 2005', ex + 14, ey - 10, { k: 'mono', s: 22, c: C.violet }); });
    fade(win(t, 10.5, 23.6), () => { T('diámetro plutón ≈ 2 377 km', 96, 1196, { k: 'mono', s: 25, c: C.mag }); T('diámetro eris   ≈ 2 326 km', 96, 1232, { k: 'mono', s: 25, c: C.violet }); });
    // los signos de duda sobre los dos
    const q = win(t, 17, 23.6); if (q > 0) { const [px, py] = ppos(8, t + 26); fade(q * (.6 + .4 * Math.sin(t * 5)), () => { T('?', px - 8, py - 26, { k: 'r', s: 52, c: C.amber, g: 16 }); T('?', ex - 8, ey + 56, { k: 'r', s: 52, c: C.amber, g: 16 }); }); }
    // la lista aprendida de memoria
    fade(win(t, 1.2, 8.8), () => D.PLANETS.forEach(([nm, c], i) => fade(A(t, 1.4 + i * .42, .4), () => T(String(i + 1).padStart(2, '0') + '  ' + nm.toLowerCase(), 96 + (i % 3) * 300, 1196 + Math.floor(i / 3) * 36, { k: 'mono', s: 24, c: i === 8 ? C.mag : C.mute }))));
  },
  // 3 · Conjunto: una curva cerrada reúne a los ocho planetas; cada uno es un elemento.
  conjunto(t) {
    stars(t, .6);
    const gather = eio(seg(t, .6, 3.4));
    // de sus órbitas a una fila ordenada dentro de la curva
    const slot = i => [CX - 300 + (i % 4) * 200, SY - 90 + Math.floor(i / 4) * 190];
    fade(1 - gather, () => solar(t + 50, { n: 8, orbit: .35 }));
    ring(CX, SY, 0, C.ink, 0, 0);
    stroke(C.cyan, 3.5, () => X.ellipse(CX, SY, 440, 300, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * eio(seg(t, 2.6, 5.4))));
    fade(A(t, 4.6, .8) * .1, () => { X.fillStyle = C.cyan; X.beginPath(); X.ellipse(CX, SY, 440, 300, 0, 0, 7); X.fill(); });
    for (let i = 0; i < 8; i++) {
      const [x0, y0] = ppos(i, t + 50), [x1, y1] = slot(i), x = lerp(x0, x1, gather), y = lerp(y0, y1, gather), hi = t > 10.4 + i * .62 && t < 10.4 + i * .62 + .9;
      dot(x, y, lerp(PR[i] * .8, 13, gather), D.PLANETS[i][1], hi ? 40 : 20);
      if (hi) ring(x, y, 26 + 30 * seg(t, 10.4 + i * .62, 11.3 + i * .62), hexA(D.PLANETS[i][1], 1 - seg(t, 10.4 + i * .62, 11.3 + i * .62)), 2.5);
      fade(gather, () => T(D.PLANETS[i][0], x, y + 52, { k: 'it', s: 30, a: 'c', c: hi ? D.PLANETS[i][1] : C.ink }));
    }
    fade(A(t, 5.2, .8), () => T('P', CX + 372, SY - 292, { k: 'i', s: 96, c: C.cyan, g: 20 }));
    const n = clamp(Math.floor((t - 10.4) / .62) + 1, 0, 8);
    fade(win(t, 10.2, 27.6), () => { T('elementos = ' + n, 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 }); });
    // mayúscula / minúscula
    fade(win(t, 19.2, 27.6), () => {
      F([['P', 'i', C.cyan]], 330, 1420, 150); T('conjunto · MAYÚSCULA', 330, 1478, { k: 'mono', s: 22, c: C.mute, a: 'c' });
      F([['t', 'i', C.amber]], 750, 1420, 150); T('elemento · minúscula', 750, 1478, { k: 'mono', s: 22, c: C.mute, a: 'c' });
    });
  },
  // 4 · Bien definida: la regla de 2006 son tres condiciones que se cumplen o no. Tierra, Luna y Plutón pasan por ella.
  regla(t) {
    stars(t, .5);
    const RULES = ['gira alrededor del Sol', 'es casi redondo', 'limpió su órbita'];
    const CAND = [['Tierra', C.cyan, [1, 1, 1], 9.6], ['Luna', '#c9d2ff', [0, 1, 1], 13.4], ['Plutón', C.mag, [1, 1, 0], 18.2]];
    const show = win(t, 8.6, 27.4);
    fade(show, () => {
      T('x', 96, 470, { k: 'i', s: 44, c: C.mute });
      RULES.forEach((r, j) => { T(String(j + 1), 400 + j * 185, 420, { k: 'mono', s: 24, c: C.violet, a: 'c' }); T(r, 400 + j * 185, 470, { k: 'it', s: 26, a: 'c', c: C.ink, max: 172 }); });
      T('resultado', 990, 470, { k: 'mono', s: 22, a: 'r', c: C.mute });
      stroke('rgba(150,170,230,.3)', 1.5, () => { X.moveTo(96, 500); X.lineTo(990, 500); }, { g: 0 });
      CAND.forEach(([nm, col, res, t0], r) => {
        const y = 600 + r * 150, k = A(t, t0, .5);
        fade(k, () => {
          dot(120, y - 12, 13, col, 24); T(nm, 156, y, { k: 'it', s: 40, c: col });
          res.forEach((ok, j) => check(400 + j * 185, y - 12, 15, !!ok, seg(t, t0 + .7 + j * .7, t0 + 1.2 + j * .7)));
          const all = res.every(Boolean), kk = A(t, t0 + 2.9, .5);
          fade(kk, () => F(all ? [['∈ ', 'r', C.green], ['P', 'i', C.green]] : [['∉ ', 'r', C.red], ['P', 'i', C.red]], 990, y, 46, { a: 'r' }));
        });
      });
      // lo que le pasa a Plutón: su órbita, llena de cuerpos helados
      const kb = A(t, 19.6, 1.2);
      if (kb > 0) { const R = rng(5); for (let i = 0; i < 90; i++) { const a = R() * 6.283, rr = 150 + R() * 46, x = CX + rr * Math.cos(a + t * .03), y = 1160 + rr * .34 * Math.sin(a + t * .03); fade(kb * (.3 + R() * .6), () => dot(x, y, 1.6 + R() * 1.6, '#9fb4ff', 6)); } fade(kb, () => { dot(CX + 170 * Math.cos(t * .12), 1160 + 170 * .34 * Math.sin(t * .12), 7, C.mag, 22); T('cinturón de kuiper · miles de cuerpos en la misma zona', CX, 1262, { k: 'mono', s: 21, c: C.mute, a: 'c' }); }); }
    });
    // el contraste: «los más bonitos» cambia con quien opina
    const k2 = win(t, 27, 35.6);
    fade(k2, () => {
      const pick = [[5, 2, 7], [2, 4, 3], [7, 5, 0]];
      ['opinión 1', 'opinión 2', 'opinión 3'].forEach((s, r) => { const y = 520 + r * 190, kk = A(t, 27.6 + r * 1.5, .5); fade(kk, () => { T(s, 96, y + 10, { k: 'mono', s: 24, c: C.mute }); pick[r].forEach((i, j) => { dot(380 + j * 220, y, 15, D.PLANETS[i][1], 22); T(D.PLANETS[i][0], 380 + j * 220, y + 54, { k: 'it', s: 28, a: 'c' }); }); }); });
      fade(A(t, 32.2, .6), () => { T('tres respuestas distintas', CX, 1150, { k: 'mono', s: 26, c: C.red, a: 'c', g: 8 }); T('no hay regla: no hay conjunto', CX, 1190, { k: 'mono', s: 26, c: C.red, a: 'c', g: 8 }); });
    });
    // el primer momento: cada objeto, adentro o afuera
    fade(win(t, 0.6, 8.8), () => {
      stroke(C.cyan, 3.5, () => X.ellipse(CX, SY - 40, 330, 250, 0, 0, 7));
      T('P', CX + 262, SY - 280, { k: 'i', s: 84, c: C.cyan, g: 18 });
      for (let i = 0; i < 8; i++) { const a = i * .785 + .3, x = CX + 180 * Math.cos(a), y = SY - 40 + 140 * Math.sin(a); dot(x, y, 11, D.PLANETS[i][1], 18); }
      [['Luna', '#c9d2ff', 150, 1130], ['Plutón', C.mag, 930, 1130], ['Sol', '#ffe3a0', 150, 400], ['Eris', C.violet, 930, 400]].forEach(([nm, c, x, y], j) => fade(A(t, 2 + j * .9, .5), () => { dot(x, y, 10, c, 18); T(nm, x, y + 48, { k: 'it', s: 28, a: 'c', c }); }));
      fade(A(t, 5.6, .6), () => { T('adentro: está', CX, SY - 30, { k: 'mono', s: 24, c: C.green, a: 'c' }); T('afuera: no está', CX, 1232, { k: 'mono', s: 24, c: C.red, a: 'c' }); });
    });
  },
  // 5 · Pertenencia: el símbolo, su lectura, su negación y de dónde viene.
  pertenece(t) {
    stars(t, .5);
    const k1 = win(t, .6, 17.8), up = eio(seg(t, 9.4, 10.6));
    fade(k1, () => {
      const y1 = lerp(720, 560, up);
      const r = F([['Marte', 'it', D.PLANETS[3][1]], [' ∈ ', 'r', C.green], ['P', 'i', C.cyan]], CX, y1, 150, { rev: seg(t, .8, 3.2) });
      fade(A(t, 3.6, .6), () => { stroke(C.green, 2, () => { X.moveTo(r.mid(1), y1 + 40); X.lineTo(r.mid(1), y1 + 96); }, { g: 6 }); T('«pertenece a»', r.mid(1), y1 + 140, { k: 'it', s: 44, a: 'c', c: C.green }); });
      fade(A(t, 5.4, .6) * (1 - up), () => T('Marte es un elemento de P', CX, y1 + 250, { k: 'mono', s: 26, c: C.mute, a: 'c' }));
      fade(A(t, 10.4, .6), () => {
        const r2 = F([['Plutón', 'it', C.mag], [' ∉ ', 'r', C.red], ['P', 'i', C.cyan]], CX, 990, 150, { rev: seg(t, 10.6, 12.8) });
        fade(A(t, 13.2, .6), () => { stroke(C.red, 2, () => { X.moveTo(r2.mid(1), 1030); X.lineTo(r2.mid(1), 1086); }, { g: 6 }); T('«no pertenece a»', r2.mid(1), 1130, { k: 'it', s: 44, a: 'c', c: C.red }); });
      });
    });
    // la historia: ε → ∈
    fade(win(t, 18, 31.6), () => {
      const m = eio(seg(t, 22.5, 25));
      T('1889', CX, 420, { k: 'mono', s: 34, c: C.amber, a: 'c', g: 10, ls: 6 });
      T('Arithmetices principia · Giuseppe Peano', CX, 470, { k: 'it', s: 34, a: 'c', c: C.mute });
      fade(1 - m, () => T('ε', CX, 880, { k: 'i', s: 420, a: 'c', c: C.violet, g: 30 }));
      fade(m, () => T('∈', CX, 880, { k: 'r', s: 420, a: 'c', c: C.green, g: 30 }));
      fade(A(t, 19.4, .8), () => { T('ἐστί', 300, 1100, { k: 'r', s: 84, a: 'c', c: C.violet, g: 14 }); T('griego: «es»', 300, 1150, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
      fade(A(t, 25.4, .8), () => { F([['x', 'i'], [' ∈ ', 'r', C.green], ['A', 'i', C.cyan]], 780, 1100, 84); T('«x es un elemento de A»', 780, 1150, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
    });
  },
  // 6 · Dos escrituras: por extensión (la lista) y por comprensión (la condición). La Vía Láctea solo cabe en la segunda.
  escrituras(t) {
    stars(t, .4);
    const names = D.PLANETS.slice(0, 8);
    fade(win(t, .6, 29.6), () => {
      // extensión: dos renglones
      const up = eio(seg(t, 10.6, 11.8)), y0 = lerp(700, 480, up), rev = seg(t, 1.2, 7.6);
      const row = (list, first, last) => { const p = first ? [['P', 'i', C.cyan], [' = ', 'r'], ['{ ', 'r', C.amber]] : [['       ', 'r']]; list.forEach(([nm, c], i) => { p.push([nm, 'it', c]); if (!(last && i === list.length - 1)) p.push([', ', 'r']); }); if (last) p.push([' }', 'r', C.amber]); return p; };
      F(row(names.slice(0, 4), true, false), 70, y0, 54, { a: 'l', rev: clamp(rev * 2), max: 940 });
      F(row(names.slice(4), false, true), 70, y0 + 84, 54, { a: 'l', rev: clamp(rev * 2 - 1), max: 940 });
      fade(win(t, 7.4, 10.6), () => { T('llaves { }', 96, y0 + 170, { k: 'mono', s: 24, c: C.amber }); T('comas entre los elementos', 330, y0 + 170, { k: 'mono', s: 24, c: C.mute }); T('n = 8', 984, y0 + 170, { k: 'mono', s: 24, c: C.mute, a: 'r' }); });
      fade(A(t, 11.4, .5), () => T('por extensión', 70, y0 - 86, { k: 'mono', s: 23, c: C.mute }));
      // comprensión
      fade(A(t, 11.8, .6), () => {
        T('por comprensión', 70, 800, { k: 'mono', s: 23, c: C.mute });
        const r = F([['P', 'i', C.cyan], [' = ', 'r'], ['{ ', 'r', C.amber], ['x', 'i', C.mag], [' : ', 'r', C.violet], ['x', 'i', C.mag], [' es un planeta', 'it', C.green], [' }', 'r', C.amber]], 70, 900, 72, { a: 'l', rev: seg(t, 12.2, 16.4), max: 940 });
        const lab = (i, s, c, t0, dy) => fade(win(t, t0, 29.6), () => { stroke(c, 2, () => { X.moveTo(r.mid(i), 926); X.lineTo(r.mid(i), 960 + dy); }, { g: 6 }); T(s, r.mid(i), 992 + dy, { k: 'mono', s: 22, c, a: 'c' }); });
        lab(3, 'un elemento cualquiera', C.mag, 23.6, 60); lab(4, '«tal que»', C.violet, 21.6, 0); lab(6, 'la condición', C.green, 25.6, 0);
        fade(win(t, 21.2, 29.6), () => T('«P es el conjunto de las x tal que x es un planeta»', CX, 1180, { k: 'it', s: 38, a: 'c', c: C.ink, max: 940 }));
      });
    });
    // la Vía Láctea
    fade(win(t, 29.8, 39.8), () => {
      const k = seg(t, 30.2, 37.5);
      galaxy(t, k);
      F([['E', 'i', C.cyan], [' = ', 'r'], ['{ ', 'r', C.amber], ['x', 'i', C.mag], [' : ', 'r', C.violet], ['x', 'i', C.mag], [' es una estrella de la Vía Láctea', 'it', C.green], [' }', 'r', C.amber]], CX, 1130, 50, { rev: seg(t, 30.4, 33.4), max: 940 });
      T('estrellas ≈ ' + num(Math.round(1e11 * eio(k))), 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 });
      T('por extensión: imposible', 984, 1196, { k: 'mono', s: 24, c: C.red, a: 'r' });
    });
  },
  // 7 · ADN: cuatro bases. Muchas letras, cuatro elementos (sin repetidos); en cualquier orden, el mismo conjunto.
  vida(t) {
    const BC = { A: C.cyan, C: C.amber, G: C.mag, T: C.violet }, R = rng(23), SEQ = Array.from({ length: 220 }, () => 'ACGT'[Math.floor(R() * 4)]);
    // la doble hélice, vertical, girando
    const top = 300, bot = 1080, n = 34, k0 = A(t, .3, 1.6);
    fade(k0, () => {
      for (const side of [0, 1]) stroke(side ? C.blue : C.cyan, 3, () => { for (let i = 0; i <= 120; i++) { const y = lerp(top, bot, i / 120), a = y * .0125 + t * .7 + side * Math.PI, x = CX + 150 * Math.sin(a); i ? X.lineTo(x, y) : X.moveTo(x, y); } }, { g: 14 });
      for (let i = 0; i < n; i++) { const y = lerp(top + 10, bot - 10, i / (n - 1)), a = y * .0125 + t * .7, x1 = CX + 150 * Math.sin(a), x2 = CX - 150 * Math.sin(a), b = SEQ[i], pair = { A: 'T', T: 'A', C: 'G', G: 'C' }[b], dep = Math.abs(Math.sin(a));
        if (dep < .12) continue;
        fade(.35 + .65 * dep, () => { stroke(BC[b], 3, () => { X.moveTo(x1, y); X.lineTo(CX, y); }, { g: 8 }); stroke(BC[pair], 3, () => { X.moveTo(CX, y); X.lineTo(x2, y); }, { g: 8 }); }); }
    });
    // la cinta de letras que se va leyendo
    const read = Math.floor(clamp((t - 4) / 14) * 200);
    fade(win(t, 3.6, 33.6), () => {
      const y = 1150; X.save(); X.beginPath(); X.rect(70, y - 50, 940, 70); X.clip();
      const off = (t - 4) * 46;
      for (let i = 0; i < SEQ.length; i++) { const x = 100 + i * 46 - Math.max(0, off - 400); if (x < 40 || x > 1040) continue; T(SEQ[i], x, y, { k: 'mono', s: 40, c: BC[SEQ[i]], a: 'c', g: i < read ? 10 : 0 }); }
      X.restore();
      T('letras leídas       = ' + num(read * 15400), 96, 1232, { k: 'mono', s: 25, c: C.mute });
      T('elementos distintos = 4', 96, 1268, { k: 'mono', s: 25, c: C.amber, g: 8 });
    });
    // B = {A, C, G, T}
    fade(win(t, 5, 19.6), () => { const p = [['B', 'i', C.cyan], [' = ', 'r'], ['{ ', 'r']]; D.BASES.forEach((b, i) => { p.push([b, 'i', BC[b]]); if (i < 3) p.push([', ', 'r']); }); p.push([' }', 'r']); F(p, CX, 1420, 96, { rev: seg(t, 5.4, 8) }); });
    // el orden no importa
    fade(win(t, 20, 33.6), () => {
      const sw = eio(seg(t, 23, 26)), order = [3, 2, 1, 0], xs = i => 410 + i * 110;
      F([['{', 'r']], 340, 1390, 84); F([['}', 'r']], 800, 1390, 84);
      D.BASES.forEach((b, i) => F([[b, 'i', BC[b]]], lerp(xs(i), xs(order.indexOf(i)), sw), 1390, 84));
      [0, 1, 2].forEach(i => F([[',', 'r']], xs(i) + 55, 1390, 84));
      fade(A(t, 26.6, .6), () => F([['{', 'r'], ['A', 'i', BC.A], [', ', 'r'], ['C', 'i', BC.C], [', ', 'r'], ['G', 'i', BC.G], [', ', 'r'], ['T', 'i', BC.T], ['}', 'r'], [' = ', 'r', C.green], ['{', 'r'], ['T', 'i', BC.T], [', ', 'r'], ['G', 'i', BC.G], [', ', 'r'], ['C', 'i', BC.C], [', ', 'r'], ['A', 'i', BC.A], ['}', 'r']], CX, 1500, 52));
    });
  },
  // 8 · Cardinal: contar los elementos.
  cardinal(t) {
    stars(t, .5);
    const n = clamp(Math.floor((t - 2) / .7) + 1, 0, 8);
    stroke(C.cyan, 3.5, () => X.ellipse(CX, SY - 120, 420, 250, 0, 0, 7));
    for (let i = 0; i < 8; i++) { const x = CX - 285 + (i % 4) * 190, y = SY - 200 + Math.floor(i / 4) * 160, on = i < n; dot(x, y, 13, D.PLANETS[i][1], on ? 30 : 12); fade(on ? 1 : 0, () => T(String(i + 1), x + 22, y - 18, { k: 'mono', s: 26, c: C.amber, g: 8 })); if (i === n - 1) ring(x, y, 22 + 26 * seg(t, 2 + i * .7, 2.7 + i * .7), hexA(C.amber, 1 - seg(t, 2 + i * .7, 2.7 + i * .7)), 2.5); }
    T('P', CX + 352, SY - 372, { k: 'i', s: 84, c: C.cyan, g: 18 });
    fade(A(t, 8, .6), () => F([['n', 'i', C.amber], ['(', 'r'], ['P', 'i', C.cyan], [') = ', 'r'], ['8', 'r', C.amber]], CX, 1120, 150, { rev: seg(t, 8.2, 10.2) }));
    fade(A(t, 11.4, .6), () => T('«el cardinal de P es 8»', CX, 1196, { k: 'it', s: 38, a: 'c', c: C.mute }));
    fade(A(t, 15, .6), () => { F([['n', 'i', C.amber], ['(', 'r'], ['B', 'i', C.cyan], [') = ', 'r'], ['4', 'r', C.amber]], 300, 1420, 84); T('bases del ADN', 300, 1470, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
    fade(A(t, 17.4, .6), () => { F([['n', 'i', C.amber], ['(', 'r'], ['E', 'i', C.cyan], [') ≈ 10', 'r']], 760, 1420, 84); T('11', 908, 1378, { k: 'r', s: 46, c: C.ink }); T('estrellas de la Vía Láctea', 780, 1470, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
  },
  // 9 · Elemento y conjunto: la Tierra y la caja con la Tierra adentro.
  cuidado(t) {
    stars(t, .5);
    const E = D.PLANETS[2][1];
    fade(A(t, .5, .8), () => { dot(300, 620, 34, E, 40); F([['Tierra', 'it', E]], 300, 760, 64); T('un elemento', 300, 812, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
    fade(A(t, 3, .8), () => { dot(780, 620, 34, E, 40); stroke(C.amber, 3.5, () => X.ellipse(780, 620, 110, 110, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * eio(seg(t, 3.2, 5.4)))); F([['{', 'r', C.amber], ['Tierra', 'it', E], ['}', 'r', C.amber]], 780, 800, 64); T('un conjunto con un elemento', 780, 852, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
    fade(A(t, 6.4, .6), () => F([['Tierra', 'it', E], ['  ≠  ', 'r', C.red], ['{', 'r', C.amber], ['Tierra', 'it', E], ['}', 'r', C.amber]], CX, 1010, 80, { rev: seg(t, 6.6, 8.8) }));
    fade(A(t, 11.4, .6), () => { F([['Tierra', 'it', E], [' ∈ ', 'r', C.green], ['P', 'i', C.cyan]], CX, 1180, 84, { rev: seg(t, 11.6, 13.2) }); check(900, 1154, 18, true, seg(t, 13.2, 13.8)); });
    fade(A(t, 14.6, .6), () => { F([['{', 'r', C.amber], ['Tierra', 'it', E], ['}', 'r', C.amber], [' ∉ ', 'r', C.red], ['P', 'i', C.cyan]], CX, 1320, 84, { rev: seg(t, 14.8, 16.6) }); check(930, 1294, 18, false, seg(t, 16.6, 17.2)); T('{Tierra} no gira alrededor del Sol: es un conjunto', CX, 1420, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
  },
  // 10 · Cierre: Plutón entra a otro conjunto; la fórmula se arma término a término y sale la tarjeta final.
  cierre(t) {
    stars(t, 1 - seg(t, 26, 28) * .5);
    const k1 = win(t, .5, 19.8);
    fade(k1, () => {
      // dos conjuntos, uno al lado del otro
      stroke(C.cyan, 3, () => X.ellipse(300, 600, 220, 170, 0, 0, 7)); T('P', 470, 420, { k: 'i', s: 72, c: C.cyan, g: 16 }); T('planetas', 300, 830, { k: 'mono', s: 24, c: C.mute, a: 'c' });
      for (let i = 0; i < 8; i++) dot(190 + (i % 4) * 74, 560 + Math.floor(i / 4) * 80, 10, D.PLANETS[i][1], 16);
      const kd = eio(seg(t, 1.2, 3.4));
      stroke(C.mag, 3, () => X.ellipse(780, 600, 220, 170, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * kd)); fade(kd, () => { T('D', 950, 420, { k: 'i', s: 72, c: C.mag, g: 16 }); T('planetas enanos', 780, 830, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
      // Plutón viaja de la orilla de P hasta adentro de D
      const mv = eio(seg(t, 3.6, 6.4)), px = lerp(540, 780, mv), py = lerp(600, 600, mv) - 90 * Math.sin(Math.PI * mv);
      dot(px, py, 12, C.mag, 30); fade(1, () => T('Plutón', px, py + 46, { k: 'it', s: 28, a: 'c', c: C.mag }));
      fade(A(t, 10.4, .6), () => [['Ceres', 690, 520], ['Haumea', 870, 520], ['Makemake', 690, 690], ['Eris', 870, 690]].forEach(([nm, x, y], i) => fade(A(t, 10.6 + i * .5, .4), () => { dot(x, y, 8, C.violet, 14); T(nm, x, y + 38, { k: 'it', s: 24, a: 'c', c: C.violet }); })));
      fade(A(t, 6.6, .6), () => { F([['Plutón', 'it', C.mag], [' ∉ ', 'r', C.red], ['P', 'i', C.cyan]], 300, 990, 64, { rev: seg(t, 6.8, 8) }); F([['Plutón', 'it', C.mag], [' ∈ ', 'r', C.green], ['D', 'i', C.mag]], 780, 990, 64, { rev: seg(t, 8, 9.2) }); });
      fade(A(t, 12.8, .6), () => { F([['D', 'i', C.mag], [' = ', 'r'], ['{ ', 'r', C.amber], ['x', 'i'], [' : ', 'r', C.violet], ['x', 'i'], [' es un planeta enano', 'it', C.green], [' }', 'r', C.amber]], CX, 1130, 52, { rev: seg(t, 13, 15.4), max: 940 }); T('n(D) = 5', CX, 1196, { k: 'mono', s: 26, c: C.amber, a: 'c', g: 8 }); });
    });
    // la fórmula final, término a término
    fade(win(t, 20, 34.4, .6), () => {
      const fr = F([['P', 'i', C.cyan], [' = ', 'r'], ['{ ', 'r', C.amber], ['x', 'i', C.mag], [' : ', 'r', C.violet], ['x', 'i', C.mag], [' es un planeta', 'it', C.green], [' }', 'r', C.amber]], CX, 560, 84, { rev: seg(t, 20.4, 25.4), max: 940 });
      const tags = [['conjunto', 0, C.cyan, 20.6, 0], ['llaves', 2, C.amber, 21.6, 44], ['un elemento', 3, C.mag, 22.4, 0], ['tal que', 4, C.violet, 23.0, 44], ['la regla', 6, C.green, 24.2, 0]];
      tags.forEach(([s, i, c, t0, dy]) => fade(A(t, t0, .5), () => { stroke(c, 1.5, () => { X.moveTo(fr.mid(i), 584); X.lineTo(fr.mid(i), 612 + dy); }, { g: 4 }); T(s, fr.mid(i), 642 + dy, { k: 'mono', s: 23, c, a: 'c' }); }));
      fade(A(t, 25.6, .6), () => { F([['Marte', 'it', D.PLANETS[3][1]], [' ∈ ', 'r', C.green], ['P', 'i', C.cyan]], 300, 800, 60); F([['n', 'i', C.amber], ['(', 'r'], ['P', 'i', C.cyan], [') = ', 'r'], ['8', 'r', C.amber]], 780, 800, 60); });
      // tarjeta final
      const kt = A(t, 27.4, 1.2);
      fade(kt, () => {
        T(D.TITLE, CX, 1060, { k: 'brand', s: 110, a: 'c', ls: 26, c: C.ink, g: 24 });
        X.fillStyle = C.cyan; X.shadowColor = C.cyan; X.shadowBlur = 14; X.fillRect(CX - 60 * eo(seg(t, 27.8, 29)), 1100, 120 * eo(seg(t, 27.8, 29)), 3); X.shadowBlur = 0;
        fade(A(t, 28.8, .8), () => T(D.LINE, CX, 1190, { k: 'it', s: 48, a: 'c', c: C.ink }));
        fade(A(t, 30.2, .8), () => T('ZUKA · ÁLGEBRA · TEORÍA DE CONJUNTOS', CX, 1300, { k: 'mono', s: 22, a: 'c', c: C.mute, ls: 4 }));
      });
    });
  },
};
// La Vía Láctea: brazos espirales de puntos que se van encendiendo (k de 0 a 1).
let GAL = null;
function galaxy(t, k) {
  if (!GAL) { const R = rng(77); GAL = Array.from({ length: 2600 }, (_, i) => { const arm = i % 4, r = Math.pow(R(), .62) * 400, a = arm * 1.5708 + r * .0105 + (R() - .5) * (.9 - r / 700), core = R() < .16; return core ? [(R() - .5) * 110, (R() - .5) * 70, R(), 3] : [r * Math.cos(a), r * Math.sin(a) * .5, R(), arm]; }); }
  const cols = [C.cyan, C.violet, C.mag, '#ffe3a0'], rot = t * .03, cs = Math.cos(rot), sn = Math.sin(rot);
  const g = X.createRadialGradient(CX, 640, 0, CX, 640, 150); g.addColorStop(0, 'rgba(255,225,160,.5)'); g.addColorStop(1, 'rgba(255,200,120,0)'); X.fillStyle = g; X.fillRect(CX - 150, 490, 300, 300);
  const n = Math.floor(GAL.length * (0.12 + .88 * eio(k)));
  for (let i = 0; i < n; i++) { const [x, y, b, c] = GAL[i], px = CX + x * cs - y * 2 * sn * .5, py = 640 + (x * sn * .5 + y * cs); X.globalAlpha = .35 + b * .6; X.fillStyle = cols[c]; X.fillRect(px, py, 1.6 + b * 1.6, 1.6 + b * 1.6); }
  X.globalAlpha = 1;
}

// ---------- fondo, HUD y rótulos ----------
function backdrop() {
  X.fillStyle = C.bg; X.fillRect(0, 0, W, H);
  const g = X.createRadialGradient(CX, SY, 60, CX, SY, 1150); g.addColorStop(0, 'rgba(34,48,110,.34)'); g.addColorStop(.55, 'rgba(14,20,52,.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  const v = X.createRadialGradient(CX, 960, 600, CX, 960, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); X.fillStyle = v; X.fillRect(0, 0, W, H);
}
function corner(x, y, dx, dy) { stroke('rgba(160,180,240,.5)', 2, () => { X.moveTo(x + 26 * dx, y); X.lineTo(x, y); X.lineTo(x, y + 26 * dy); }, { g: 0 }); }
function hud(t, i) {
  const sc = D.SC[i];
  corner(44, 60, 1, 1); corner(1036, 60, -1, 1); corner(44, 1860, 1, -1); corner(1036, 1860, -1, -1);
  T('ZUKA', 70, 112, { k: 'brand', s: 34, ls: 10, c: C.ink });
  T('ÁLGEBRA · TEORÍA DE CONJUNTOS', 70, 146, { k: 'mono', s: 19, ls: 3, c: C.mute });
  T(String(i + 1).padStart(2, '0') + ' / ' + String(D.SC.length).padStart(2, '0'), 1010, 110, { k: 'mono', s: 26, a: 'r', c: C.ink });
  T(sc.name, 1010, 146, { k: 'mono', s: 19, a: 'r', ls: 3, c: C.mute });
  fade(.55 + .45 * Math.sin(t * 3.2), () => dot(838, 101, 6, C.red, 12));
  // la fórmula de la escena, abajo a la izquierda (se escribe al entrar)
  F(D.SCENES[i].formula, 70, 1762, 40, { a: 'l', rev: seg(t - sc.t0, .4, 2.2), max: 700, c: '#d6dcf5' });
  T('t = ' + t.toFixed(2).padStart(6, '0') + ' s', 1010, 1762, { k: 'mono', s: 24, a: 'r', c: C.ink });
  X.fillStyle = 'rgba(160,180,240,.2)'; X.fillRect(70, 1812, 940, 2);
  const gr = X.createLinearGradient(70, 0, 1010, 0); gr.addColorStop(0, C.cyan); gr.addColorStop(.5, C.violet); gr.addColorStop(1, C.mag);
  glow(C.cyan, 10, () => { X.fillStyle = gr; X.fillRect(70, 1811, 940 * t / D.DUR, 4); });
  D.SC.forEach(s => { X.fillStyle = s.t0 <= t ? 'rgba(220,230,255,.8)' : 'rgba(160,180,240,.35)'; X.fillRect(70 + 940 * s.t0 / D.DUR - 1, 1804, 2, 18); });
}
// Título y subtítulo de cada momento, debajo del escenario: serif grande y cursiva.
function caption(lt, sc) {
  for (const [a, b, title, sub] of sc.caps) {
    if (lt < a - .1 || lt > b + .1) continue;
    const out = 1 - seg(lt, b - .35, b);
    fade(A(lt, a, .5) * out, () => T(title, CX, 1590, { k: 'r', s: 62, a: 'c', max: 960 }));
    fade(A(lt, a + .25, .5) * out, () => T(typed(sub, seg(lt, a + .3, a + .3 + Math.min(2.2, sub.length * .035))), CX, 1654, { k: 'it', s: 36, a: 'c', c: '#c3ccec', max: 960 }));
  }
}
function film(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.setLineDash([]); X.shadowBlur = 0;
  backdrop();
  let i = D.SC.findIndex(s => t < s.t1); if (i < 0) i = D.SC.length - 1;
  const sc = D.SC[i], lt = t - sc.t0, k = i ? seg(lt, 0, .35) : 1;
  if (k < 1) fade(1 - k, () => { const p = D.SC[i - 1]; S[p.id](p.t1 - p.t0); });
  fade(k, () => S[sc.id](lt));
  X.setLineDash([]); X.shadowBlur = 0; X.globalAlpha = 1;
  caption(lt, D.SCENES[i]); hud(t, i);
  // corte: un destello breve al cambiar de escena
  if (i && lt < .25) { X.fillStyle = `rgba(190,210,255,${.10 * (1 - lt / .25)})`; X.fillRect(0, 0, W, H); }
}
