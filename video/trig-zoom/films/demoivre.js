// «Producto, cociente y potencias: De Moivre» (lección trig-152, Galaxia Polar, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): la sonda que en cada pulso se multiplica por 1 + i (1, 1 + i, 2i, −2 + 2i,
// −4 … y (1 + i)⁸ = 16), (4 + i) · i = −1 + 4i, 2 cis 30° · 3 cis 45° = 6 cis 75°, (√3 + i)⁶ = −64 y
// 8 cis 100° ÷ 2 cis 40° = 4 cis 60°.
// Hilo: una sonda parte del punto 1 y cada pulso la multiplica por 1 + i: ¿dónde está tras ocho pulsos? Sorpresa anunciada:
// la forma polar lo vuelve un juego (gira 45° y se estira √2). Cierre: en 16, tras una vuelta completa.
const POSTER = 76;
const FILM = stdFilm({
  open: { Z0: 1.8, C: [560, 960], t1: 3.8, t2: 6.0 },
  aims: ['multiplicar', 'potencias', 'otra potencia'],
  stops: ['la sonda', 'multiplicar', 'potencias', 'cociente'],
  wides: [[78.8, 80.4], [107.8, 109.4]],
  smiles: [[81.8, 83.6], [119.0, 135]],
});
const PULSE = [[1, 0], [1, 1], [0, 2], [-2, 2], [-4, 0], [-4, -4], [0, -8], [8, -8], [16, 0]];
function cgrid(p, t, t0, O, U, R, k = 1) {
  const ka = eio(seg(t, t0, t0 + .7)) * k; if (ka <= 0.01) return;
  el('rect', { x: r1(O[0] - R * ka), y: O[1] - 3, width: r1(2 * R * ka), height: 6, rx: 3, fill: C.mist }, p);
  el('rect', { x: O[0] - 3, y: r1(O[1] - R * ka), width: 6, height: r1(2 * R * ka), rx: 3, fill: C.mist }, p);
  for (let r = U; r < R; r += U) el('circle', { cx: O[0], cy: O[1], r: r1(r * ka), fill: 'none', stroke: C.n2, 'stroke-width': 2 }, p);
}
function probe(p, x, y, k) {
  if (k <= 0.01) return;
  el('circle', { cx: r1(x), cy: r1(y), r: r1(26 * k), fill: C.n3 }, p);
  shaded(p, 'circle', { cx: r1(x), cy: r1(y), r: r1(16 * k) }, C.coral, C.coralD, 2, 2);
}
function level0(G, t) {
  starField(G, 481, 160);
  const O = [600, 1000], U = 80, k = pop(t, 0.3) * out(t, 28.8);
  cgrid(G, t, 0.4, O, U, 420, k);
  const n = Math.min(4, Math.max(0, Math.floor((t - 6.4) / 1.4) + 1)), f = clamp((t - 6.4) / 1.4 - (n - 1));
  for (let j = 0; j <= Math.min(n, 4); j++) { const q = [O[0] + PULSE[j][0] * U, O[1] - PULSE[j][1] * U]; dot(G, q[0], q[1], pop(t, j ? 6.4 + (j - 1) * 1.4 + .6 : 0.6) * k, C.sun, 11); if (j) { const pq = [O[0] + PULSE[j - 1][0] * U, O[1] - PULSE[j - 1][1] * U]; segAB(G, pq, q, eio(seg(t, 6.4 + (j - 1) * 1.4, 6.4 + (j - 1) * 1.4 + .6)) * k, C.sun, 4); } }
  ['1', '1 + i', '2i', '−2 + 2i', '−4'].forEach((s, j) => { const q = [O[0] + PULSE[j][0] * U, O[1] - PULSE[j][1] * U], kk = pop(t, j ? 6.4 + (j - 1) * 1.4 + .8 : 1.0) * k; if (kk > .01) tag(G, q[0] + (j === 4 ? -10 : 20), q[1] + (j === 4 ? 50 : -24), s, kk, C.sun, 38, j === 4 ? 'middle' : 'start'); });
  const last = PULSE[Math.min(n, 4)];
  probe(G, O[0] + last[0] * U, O[1] - last[1] * U, k);
  const kw = eio(seg(t, 16.0, 17.6)) * k;
  if (kw > 0.01) { const pts = []; for (let j = 0; j <= 60; j++) { const a = 180 * j / 60, r = Math.pow(Math.SQRT2, a / 45); pts.push(pc(O[0], O[1], r * U, a)); } polyline(G, pts, kw, C.mint, 5, { dash: '10 10' }); }
  riseFormula(G, t, 9.8, 12.4, 540, 560, 44, ['(1 + i)', SP('2'), '=', '1 + 2i + i', SP('2'), '=', '2i']);
  fchip(G, 480, 1440, ['×', 'i'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 56);
}
// ---------- nivel 1 · multiplicar es girar y estirar ----------
function level1(G, t) {
  starField(G, 483, 90);
  fchip(G, 540, 700, ['×', 'i'], out(t, 32.4), ZERO, 56);
  const O = [540, 1060], U = 80, ko = 1 - eio(seg(t, 44.4, 44.8));
  if (ko > 0.01) {
    const S = scaleAt(G, O[0], O[1], ko), P = [O[0] + 4 * U, O[1] - U], Q = [O[0] - U, O[1] - 4 * U];
    cgrid(S, t, 31.8, O, U, 400);
    segAB(S, O, P, 1, C.mint, 7); dot(S, P[0], P[1], pop(t, 32.6), C.mint, 13); tag(S, P[0] + 20, P[1] + 40, '4 + i', pop(t, 32.8), C.mint, 38, 'start');
    const kr = eio(seg(t, 35.4, 36.8));
    if (kr > 0.01) { const a = Math.atan2(1, 4) / D2R + 90 * kr, q = pc(O[0], O[1], Math.hypot(4, 1) * U, a); segAB(S, O, q, 1, C.sun, 8); dot(S, q[0], q[1], 1, C.sun, 13); arcDeg(S, O[0], O[1], Math.hypot(4, 1) * U, Math.atan2(1, 4) / D2R, a, 1, C.sun, 4); }
    if (t > 36.8) tag(S, Q[0] - 20, Q[1] - 20, '−1 + 4i', pop(t, 37.0), C.sun, 38, 'end');
    if (t > 38.2) { arcDeg(S, O[0], O[1], 90, Math.atan2(1, 4) / D2R, Math.atan2(1, 4) / D2R + 90, eio(seg(t, 38.4, 39.2)), C.cream, 6, true); tag(S, O[0] + 70, O[1] - 110, '90°', pop(t, 39.2), C.cream, 40, 'start'); }
  }
  riseFormula(G, t, 35.0, 44.2, 540, 560, 46, ['(4 + i)', '·', 'i', '=', '4i + i', SP('2'), '=', '−1 + 4i']);
  const kp = pop(t, 44.8);
  if (kp > 0.01) {
    const O2 = [540, 1100], U2 = 90, A = pc(O2[0], O2[1], 2 * U2, 30), B = pc(O2[0], O2[1], 3 * U2, 45), Cq = pc(O2[0], O2[1], 6 * U2 * eio(seg(t, 51.0, 52.4)) || 1, 75);
    const S = scaleAt(G, O2[0], O2[1], kp);
    cgrid(S, t, 44.8, O2, U2, 560);
    segAB(S, O2, A, 1, C.mint, 7); segAB(S, O2, B, 1, C.coral, 7); tag(S, A[0] + 16, A[1] + 30, '2 cis 30°', 1, C.mint, 34, 'start'); tag(S, B[0] + 16, B[1], '3 cis 45°', 1, C.coral, 34, 'start');
    if (t > 51.0) { segAB(S, O2, Cq, 1, C.sun, 9); dot(S, Cq[0], Cq[1], 1, C.sun, 13); if (t > 52.4) tag(S, Cq[0] - 20, Cq[1] - 20, '6 cis 75°', pop(t, 52.6), C.sun, 40, 'end'); }
  }
  riseFormula(G, t, 50.8, 56.6, 540, 520, 38, ['cis θ', '=', 'cos θ + i sen θ'], { fill: C.mist });
  fchip(G, 480, 1440, ['(1 + i)', SP('8')], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), ZERO, 50);
}
// ---------- nivel 2 · De Moivre y la sonda ----------
function level2(G, t) {
  starField(G, 485, 90);
  fchip(G, 540, 700, ['(1 + i)', SP('8')], out(t, 61.0), ZERO, 50);
  const ko = 1 - eio(seg(t, 90.6, 91.0)), O = [600, 1060], U = 26;
  if (ko > 0.01) {
    const S = scaleAt(G, O[0], O[1], ko);
    cgrid(S, t, 60.2, O, U * 4, 470);
    const n = clamp((t - 66.6) / 12, 0, 1) * 8, full = Math.floor(n);
    const pts = []; for (let j = 0; j <= 160; j++) { const s = n * j / 160; pts.push(pc(O[0], O[1], Math.pow(Math.SQRT2, s) * U, 45 * s)); }
    if (n > 0) polyline(S, pts, 1, C.mint, 5);
    for (let j = 0; j <= full; j++) { const q = [O[0] + PULSE[j][0] * U, O[1] - PULSE[j][1] * U]; dot(S, q[0], q[1], pop(t, 66.6 + j * 1.5), j === 8 ? C.sun : C.cream, j === 8 ? 16 : 10); }
    const tip = pc(O[0], O[1], Math.pow(Math.SQRT2, n) * U, 45 * n); probe(S, tip[0], tip[1], 1);
    if (t > 78.8) tag(S, O[0] + 16 * U, O[1] + 50, '16', pop(t, 79.0), C.sun, 50);
  }
  riseFormula(G, t, 61.4, 72.2, 540, 540, 46, ['1 + i', '=', RAD('2'), 'cis 45°'], { fill: C.mint });
  riseFormula(G, t, 72.6, 84.4, 540, 540, 44, ['(', RAD('2'), ')', SP('8'), 'cis(8 · 45°)', '=', '16 cis 360°'], { fill: C.sun });
  riseFormula(G, t, 85.0, 90.4, 540, 540, 50, ['z', SP('n'), '=', 'r', SP('n'), 'cis nθ'], { fill: C.sun });
  fchip(G, 480, 1440, ['(√3 + i)', SP('6')], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 46);
}
// ---------- nivel 3 · otra potencia y el cociente ----------
function level3(G, t) {
  starField(G, 487, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['(√3 + i)', SP('6')], out(t, 96.0), MINT, 46);
  const O = [540, 1080], U = 5.2;
  const ko = 1 - eio(seg(t, 110.4, 110.8));
  if (ko > 0.01) {
    const S = scaleAt(E, O[0], O[1], ko);
    cgrid(S, t, 95.6, O, 64 * U / 2, 64 * U + 40);
    const n = clamp((t - 101.8) / 5.2, 0, 1) * 6, pts = [];
    for (let j = 0; j <= 120; j++) { const s = n * j / 120; pts.push(pc(O[0], O[1], Math.pow(2, s) * U, 30 * s)); }
    if (n > 0) polyline(S, pts, 1, C.mint, 5);
    const tip = pc(O[0], O[1], Math.pow(2, n) * U, 30 * n); probe(S, tip[0], tip[1], pop(t, 96.0));
    if (t > 107.4) tag(S, O[0] - 64 * U, O[1] + 60, '−64', pop(t, 107.8), C.sun, 50);
  }
  riseFormula(E, t, 98.6, 110.4, 540, 520, 44, [RAD('3'), '+', 'i', '=', '2 cis 30°']);
  riseFormula(E, t, 104.8, 110.4, 540, 610, 44, ['2', SP('6'), 'cis 180°', '=', '−64'], { fill: C.sun });
  const kd = pop(t, 110.8);
  if (kd > 0.01) {
    const S = scaleAt(E, 540, 1000, kd), O2 = [540, 1150], U2 = 45, A = pc(O2[0], O2[1], 8 * U2, 100), B = pc(O2[0], O2[1], 2 * U2, 40), Cq = pc(O2[0], O2[1], 4 * U2, 60);
    cgrid(S, t, 110.8, O2, U2, 420);
    segAB(S, O2, A, 1, C.mint, 7); segAB(S, O2, B, 1, C.coral, 7); segAB(S, O2, Cq, eio(seg(t, 111.6, 112.4)), C.sun, 9);
    formula(S, 540, 620, 40, ['8 cis 100°', '÷', '2 cis 40°', '=', '4 cis 60°'], { fill: C.cream });
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Potencias de', 'complejos', 880);
  label(p, t, 6.6, 12.4, 'LA SONDA', 'cada pulso', '× (1 + i)');
  label(p, t, 12.8, 18.6, 'LA PREGUNTA', '¿dónde estará', 'tras ocho pulsos?');
  label(p, t, 19.0, 24.4, 'UN PATRÓN', 'gira', 'y se aleja');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'la forma polar', 'lo vuelve un juego');
  label(p, t, 31.8, 37.8, 'POR i', '(4 + i) · i', '= −1 + 4i');
  label(p, t, 38.2, 44.2, 'UN GIRO', 'de 90°', 'sin estirarse');
  label(p, t, 44.6, 50.2, 'EL PRODUCTO', 'módulos: se multiplican', 'ángulos: se suman');
  label(p, t, 50.6, 56.6, 'EJEMPLO', '2 · 3 = 6', '30° + 45° = 75°');
  label(p, t, 60.0, 66.0, '1 + i', '= √2 cis 45°');
  label(p, t, 66.4, 72.2, 'CADA PULSO', 'módulo × √2', 'ángulo + 45°');
  label(p, t, 72.6, 78.4, 'OCHO PULSOS', '(√2)⁸ = 16', '8 · 45° = 360°');
  label(p, t, 78.8, 84.4, 'UNA VUELTA', 'la sonda', 'cae en 16');
  label(p, t, 84.8, 90.4, 'TEOREMA DE DE MOIVRE', 'potencias en polar');
  label(p, t, 95.4, 101.4, '(√3 + i)⁶', 'módulo 2', 'ángulo 30°');
  label(p, t, 101.8, 107.4, 'POTENCIA', '2⁶ = 64', '6 · 30° = 180°');
  label(p, t, 107.8, 114.0, 'RESULTADO', '−64', 'dividir: ÷ módulos, − ángulos');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['POR i', 'gira 90°'],
  ['PRODUCTO', 'módulos ×, ángulos +'],
  ['COCIENTE', 'módulos ÷, ángulos −'],
  ['POTENCIAS', ['z', SP('n'), '=', 'r', SP('n'), 'cis nθ']],
  ['LA SONDA', ['(1 + i)', SP('8'), '=', '16']],
]);
FILM.events = () => stdEvents([
  [0.4, 'paint', .8], [0.6, 'pop', 0], [6.4, 'count', 1], [7.8, 'count', 2], [9.2, 'count', 3], [9.8, 'rise'], [10.6, 'count', 4], [16.0, 'paint', 1.6], [24.8, 'pop', 3],
  [31.8, 'paint', .8], [32.6, 'pop', 1], [35.0, 'rise'], [35.4, 'slide', 1.4], [37.0, 'yes'], [38.4, 'paint', .8], [44.8, 'pop'], [50.8, 'rise'], [51.0, 'slide', 1.4], [52.6, 'yes'], [52.4, 'pop', 3],
  [60.2, 'paint', .8], [61.4, 'rise'], [66.6, 'slide', 12.0], [72.6, 'rise'], [79.0, 'yes'], [85.0, 'rise'], [88.0, 'pop', 1],
  [95.6, 'paint', .8], [98.6, 'rise'], [101.8, 'slide', 5.2], [104.8, 'rise'], [107.8, 'yes'], [110.8, 'pop'], [111.6, 'paint', .8],
]);
FILM.NARR = [
  [0.8, 3.6, 'Una sonda espacial parte del punto uno.'],
  [4.0, 6.6, 'Cada pulso la multiplica por uno más i.'],
  [7.0, 9.6, 'Uno, luego uno más i, luego dos i…'],
  [9.8, 12.4, 'Las cuentas cansan: i al cuadrado, signos…'],
  [12.8, 15.6, '¿Dónde estará tras ocho pulsos?'],
  [15.8, 18.6, 'Mira: la sonda gira y se aleja.'],
  [19.0, 21.8, 'En cada pulso, el mismo giro.'],
  [22.0, 24.4, 'Y el mismo estirón.'],
  [24.8, 29.0, 'La forma polar convierte esto en un juego.'],
  [31.8, 34.8, 'Empecemos con algo simple: por i.'],
  [35.0, 37.8, 'Por i, cuatro más i salta aquí.'],
  [38.2, 41.0, 'Giró un cuarto de vuelta, sin estirarse.'],
  [41.2, 44.2, 'Multiplicar por i es girar noventa grados.'],
  [44.6, 47.4, 'En general, se multiplican los módulos…'],
  [47.6, 50.2, 'y se suman los ángulos.'],
  [50.6, 53.6, 'Dos cis treinta por tres cis cuarenta y cinco…'],
  [53.8, 56.6, 'da seis cis setenta y cinco.'],
  [60.0, 63.0, 'Uno más i: raíz de dos, a 45 grados.'],
  [63.2, 66.0, 'Cada pulso multiplica el módulo por √2.'],
  [66.4, 69.2, 'Y suma cuarenta y cinco grados.'],
  [69.4, 72.2, 'Ocho pulsos: raíz de dos a la ocho.'],
  [72.6, 75.4, 'Eso es dieciséis.'],
  [75.6, 78.4, 'Y ocho por cuarenta y cinco: trescientos sesenta.'],
  [78.8, 81.6, '¡Una vuelta completa!'],
  [81.8, 84.4, 'La sonda cae en dieciséis.'],
  [84.8, 87.6, 'Potencia: módulo a la n, ángulo por n.'],
  [87.8, 90.4, 'Sirve para cualquier potencia.'],
  [95.4, 98.4, 'Otra: raíz de tres más i, a la seis.'],
  [98.6, 101.4, 'Módulo dos, ángulo treinta.'],
  [101.8, 104.6, 'Dos a la seis: sesenta y cuatro.'],
  [104.8, 107.4, 'Seis por treinta: ciento ochenta.'],
  [107.8, 110.6, 'Resultado: menos sesenta y cuatro.'],
  [110.8, 114.0, 'Para dividir: módulos se dividen, ángulos se restan.'],
  [115.4, 119.6, 'Tras ocho pulsos, la sonda está en dieciséis:'],
  [119.8, 124.4, 'raíz de dos a la ocho, y una vuelta completa.'],
];
