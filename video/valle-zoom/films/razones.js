// «Razones: comparar dividiendo» (lección alg-12 de Zuka, mundo Razones, proporciones y porcentajes, video 1) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (los cromos de Ana y Beto, 18 niñas y 12 niños = 3 : 2, la foto de 3 × 2,
// 180 km en 3 h, los jugos de 7 200 y 9 200, la escala 1 : 100 000 y 4.5 cm), que tests/razones-desde-cero.test.js mantiene
// fuera de los ejercicios.
// Niveles: 0 comparar (restando o dividiendo) → 1 por el «:»: la razón → 2 por la foto: equivalentes → 3 por el bus: con unidades.
const POSTER = 45.8;
const CX = i => 140 + i * 62, AY = 680, BY_ = 860;
const GX = (g, j) => 155 + g * 154;
const BUS0 = [200, 700], RX = v => 160 + v * 760 / 180;

const FILM = {
  DUR: 123, endAt: 108.4,
  DT: [[29.2, 31.4], [57.6, 59.8], [82.6, 84.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1300], r: 78, A: [540, 700] },
    { a: 57.6, b: 59.8, P: [540, 1350], r: 100, A: [540, 760] },
    { a: 82.6, b: 84.8, P: [540, 1320], r: 90, A: BUS0 },
  ],
  open: { Z0: 2.3, C: [CX(1.5), AY], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'la razón', L: [330, 1530] },
    { fire: 53.8, lock: 54.4, name: 'equivalentes', L: [330, 1530] },
    { fire: 78.6, lock: 79.2, name: 'con unidades', L: [330, 1530] },
  ],
  stops: ['comparar', 'la razón', 'equivalentes', 'con unidades'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 87.6, 93.0, 99.6, 105.4, 115.0],
    smiles: [[21.0, 22.6], [46.0, 47.6], [66.0, 67.6], [94.0, 95.6], [112.0, 130]],
    wides: [[72.2, 73.6]],
    looks: [],
  },
};

// ---------- piezas ----------
function cromo(p, x, y, k, col = SKY) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'rect', { x: x - 23, y: y - 32, width: 46, height: 64, rx: 8 }, col[0], col[1], 3, 3);
  sparkle(S, x, y, 11, C.cream);
}
function photo(p, cx, cy, w, h, k = 1) {                                 // foto de 3 × 2: el dibujo se estira con el marco
  if (k <= 0.01) return;
  const S = scaleAt(p, cx, cy, k);
  el('rect', { x: r1(cx - w / 2 - 12), y: r1(cy - h / 2 - 12), width: r1(w + 24), height: r1(h + 24), rx: 14, fill: C.cream }, S);
  const I = g(S, { 'clip-path': clipOf('rect', { x: r1(cx - w / 2), y: r1(cy - h / 2), width: r1(w), height: r1(h) }) });
  const U = g(I, { transform: `translate(${r1(cx - w / 2)},${r1(cy - h / 2)}) scale(${(w / 300).toFixed(4)},${(h / 200).toFixed(4)})` });
  el('rect', { x: 0, y: 0, width: 300, height: 200, fill: C.blue }, U);
  el('circle', { cx: 225, cy: 58, r: 30, fill: C.sun }, U);
  el('path', { d: 'M0,150Q80,100 160,140T300,130L300,200L0,200Z', fill: C.mint }, U);
  el('rect', { x: 82, y: 90, width: 14, height: 50, fill: C.creamD }, U);
  el('circle', { cx: 89, cy: 82, r: 30, fill: C.mintD }, U);
}
function bus(p, x, y, k = 1) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'rect', { x: x - 70, y: y - 38, width: 140, height: 70, rx: 16 }, C.sun, C.sunD, 5, 5);
  for (let i = 0; i < 3; i++) el('rect', { x: x - 58 + i * 40, y: y - 28, width: 30, height: 24, rx: 6, fill: C.blue }, S);
  for (const dx of [-40, 40]) { el('circle', { cx: x + dx, cy: y + 34, r: 16, fill: C.night }, S); el('circle', { cx: x + dx, cy: y + 34, r: 6, fill: C.mist }, S); }
}
function pack(p, x, y, n, k) {                                           // paquete de n jugos
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), cols = n / 2, w = cols * 46 + 30;
  el('rect', { x: x - w / 2, y: y - 70, width: w, height: 140, rx: 18, fill: C.n3 }, S);
  for (let i = 0; i < n; i++) {
    const cx = x - (cols - 1) * 23 + (i % cols) * 46, cy = y - 30 + Math.floor(i / cols) * 62;
    shaded(S, 'rect', { x: cx - 17, y: cy - 26, width: 34, height: 52, rx: 6 }, i % 2 ? C.coral : C.mint, i % 2 ? C.coralD : C.mintD, 3, 3);
    el('rect', { x: cx - 3, y: cy - 34, width: 6, height: 12, rx: 3, fill: C.cream }, S);
  }
}

// ---------- nivel 0 · comparar ----------
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, CX(1.5), AY, 140, 190);
  const kc = eio(seg(t, 12.8, 13.4)) * (1 - eio(seg(t, 18.2, 18.6)));
  for (let i = 0; i < 12; i++) cromo(G, CX(i), AY, i < 4 ? 1 : pop(t, 6.8 + i * .08), i >= 4 && kc > .5 ? NEG : SKY);
  for (let i = 0; i < 4; i++) cromo(G, CX(i), BY_, pop(t, 7.8 + i * .1), MINT);
  chip(G, 930, AY, 'Ana', pop(t, 7.2), POS, C.night, 40); chip(G, 930, BY_, 'Beto', pop(t, 8.0), POS, C.night, 40);
  const km = eio(seg(t, 13.0, 13.8)) * (1 - eio(seg(t, 18.2, 18.6)));
  if (km > 0.01) for (let i = 0; i < 4; i++) el('rect', { x: CX(i) - 2, y: AY + 40, width: 4, height: r1((BY_ - AY - 80) * km), rx: 2, fill: C.mist }, G);
  tag(G, (CX(4) + CX(11)) / 2, AY - 60, '8 más', kc, C.coral, 46);
  for (let gq = 0; gq < 3; gq++) {
    const k = eio(seg(t, 19.0 + gq * .6, 19.6 + gq * .6)); if (k <= 0.01) continue;
    el('rect', { x: CX(gq * 4) - 34, y: AY - 44, width: r1((CX(3) - CX(0) + 68) * k), height: 88, rx: 16, fill: 'none', stroke: C.sun, 'stroke-width': 5 }, G);
    tag(G, (CX(gq * 4) + CX(gq * 4 + 3)) / 2, AY - 62, String(gq + 1), pop(t, 19.4 + gq * .6), C.sun, 48);
  }
  riseFormula(G, t, 13.4, 18.2, 540, 1060, 76, ['12 − 4', '=', '8'], { colors: { '8': C.coral } });
  riseFormula(G, t, 19.4, 999, 540, 1060, 76, ['12 ÷ 4', '=', '3'], { colors: { '3': C.sun } });
  tile(G, 540, 1300, 110, ':', pop(t, 24.6) * (1 + .12 * wob(t, 25.2, 14, 6)), ZERO, C.night);
}
// ---------- nivel 1 · la razón ----------
function level1(G, t) {
  starField(G, 17, 90);
  tile(G, 540, 700, 110, ':', 1, ZERO, C.night);
  tag(G, 430, 732, '18', pop(t, 31.6), C.sun, 96, 'end'); tag(G, 650, 732, '12', pop(t, 31.8), C.blue, 96, 'start');
  const m = eio(seg(t, 44.0, 45.0));
  for (let i = 0; i < 18; i++) {
    const x0 = 170 + (i % 6) * 56, y0 = 880 + Math.floor(i / 6) * 56, gq = Math.floor(i / 3);
    const k = pop(t, 32.4 + i * .03); if (k <= 0.01) continue;
    el('circle', { cx: r1(lerp(x0, GX(gq), m)), cy: r1(lerp(y0, 860 + (i % 3) * 52, m)), r: r1(20 * k), fill: C.sun }, G);
  }
  for (let i = 0; i < 12; i++) {
    const x0 = 690 + (i % 4) * 56, y0 = 880 + Math.floor(i / 4) * 56, gq = Math.floor(i / 2);
    const k = pop(t, 33.0 + i * .03); if (k <= 0.01) continue;
    el('circle', { cx: r1(lerp(x0, GX(gq), m)), cy: r1(lerp(y0, 1026 + (i % 2) * 52, m)), r: r1(20 * k), fill: C.blue }, G);
  }
  for (let gq = 0; gq < 6; gq++) {
    const k = eio(seg(t, 45.2 + gq * .1, 45.8 + gq * .1)); if (k <= 0.01) continue;
    const hi = t > 50.0 && gq === 0;
    el('rect', { x: GX(gq) - 40, y: 828, width: 80, height: r1(256 * k), rx: 20, fill: 'none', stroke: hi ? C.cream : C.mist, 'stroke-width': hi ? 7 : 4 }, G);
  }
  riseFormula(G, t, 33.4, 37.6, 540, 1240, 66, ['18 : 12', '=', { fr: ['18', '12'] }]);
  riseFormula(G, t, 38.0, 43.6, 540, 1240, 66, ['12 : 18', '≠', '18 : 12'], { fill: C.coral });
  riseFormula(G, t, 45.6, 49.8, 540, 1240, 72, ['18 : 12', '=', '3 : 2'], { colors: { '3 : 2': C.sun } });
  riseFormula(G, t, 50.4, 999, 540, 1240, 66, ['3 : 5', '=', { fr: ['3', '5'] }, '=', '0.6'], { colors: { '0.6': C.sun } });
  photo(G, 540, 1350, 120, 80, pop(t, 53.2) * (1 + .1 * wob(t, 53.8, 14, 6)));
}
// ---------- nivel 2 · equivalentes ----------
function level2(G, t) {
  starField(G, 29, 90);
  const w = kf(t, [[64.6, 210], [65.6, 420], [70.4, 420], [71.0, 210], [71.2, 210], [72.2, 420], [76.4, 420], [77.4, 420]]);
  const h = kf(t, [[64.6, 140], [65.6, 280], [70.4, 280], [71.0, 140], [71.2, 140], [72.2, 350], [76.4, 350], [77.4, 280]]);
  photo(G, 540, 760, w, h);
  const kd = pop(t, 59.6);
  tag(G, 540, r1(760 + h / 2 + 70), String(Math.round(w / 70)), kd, C.sun, 52);
  tag(G, r1(540 - w / 2 - 50), 778, String(Math.round(h / 70)), kd, C.sun, 52, 'end');
  tag(G, 540, r1(760 - h / 2 - 40), '× 2', life(t, 64.4, 69.8), C.mint, 52);
  tag(G, 540, r1(760 - h / 2 - 40), '+ 3', life(t, 71.0, 76.0), C.coral, 52);
  riseFormula(G, t, 59.8, 64.2, 540, 1160, 76, ['3 : 2']);
  riseFormula(G, t, 65.8, 70.2, 540, 1160, 76, ['3 : 2', '=', '6 : 4'], { fill: C.mint });
  riseFormula(G, t, 72.4, 76.2, 540, 1160, 76, ['3 : 2', '≠', '6 : 5'], { fill: C.coral });
  badge(G, 850, 1120, life(t, 73.0, 76.2), false);
  riseFormula(G, t, 76.8, 999, 540, 1160, 64, ['3 : 2', '=', '6 : 4', '=', '18 : 12'], { colors: { '18 : 12': C.sun } });
  bus(G, 540, 1320, pop(t, 78.0) * (1 + .1 * wob(t, 78.6, 14, 6)));
}
// ---------- nivel 3 · con unidades ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 108.4, 109.0)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  const k1 = out(t, 90.0);
  if (k1 > 0.01) {
    const R = scaleAt(S, 540, 760, k1), bx = kf(t, [[85.2, BUS0[0]], [87.4, RX(180) - 30]]);
    el('rect', { x: 120, y: 754, width: 840, height: 12, rx: 6, fill: C.mist }, R);
    [0, 60, 120, 180].forEach((v, i) => { el('rect', { x: RX(v) - 3, y: 744, width: 6, height: 32, rx: 3, fill: C.mist }, R); tag(R, RX(v), 830, v ? `${v} km` : '0', 1, C.mist, 38); });
    [1, 2, 3].forEach(hh => tag(R, RX(60 * hh), 620, `${hh} h`, pop(t, 85.2 + hh * .7), C.sun, 44));
    if (bx > BUS0[0] + 1) el('rect', { x: RX(0), y: 754, width: r1(bx - RX(0)), height: 12, rx: 6, fill: C.sun }, R);
    bus(R, bx, 700);
  }
  riseFormula(S, t, 87.4, 90.0, 540, 980, 62, ['180 km ÷ 3 h', '=', '60 km/h'], { colors: { '60 km/h': C.sun } });
  // los jugos
  const k2 = pop(t, 90.4) * out(t, 96.2);
  if (k2 > 0.01) {
    pack(S, 300, 720, 6, k2); pack(S, 780, 720, 8, k2);
    chip(S, 300, 860, '6 por $7 200', k2, POS, C.night, 40); chip(S, 780, 860, '8 por $9 200', k2, POS, C.night, 40);
    const ku = pop(t, 93.2) * out(t, 96.2);
    chip(S, 300, 960, '$1 200 cada uno', ku, NEG, C.night, 38); chip(S, 780, 960, '$1 150 cada uno', ku, MINT, C.night, 38);
    badge(S, 960, 960, pop(t, 94.0) * out(t, 96.2), true);
  }
  // la escala
  const k3 = pop(t, 96.6);
  if (k3 > 0.01) {
    const M = scaleAt(S, 540, 740, k3);
    el('rect', { x: 200, y: 580, width: 680, height: 320, rx: 24, fill: C.n3 }, M);
    el('path', { d: 'M230,700Q400,640 520,720T860,690', fill: 'none', stroke: C.blue, 'stroke-width': 14, 'stroke-linecap': 'round' }, M);
    for (const [x, n] of [[330, 'A'], [780, 'B']]) { el('circle', { cx: x, cy: 760, r: 16, fill: C.coral }, M); tag(M, x, 740 - 4 - 18, n, 1, C.cream, 40); }
    const kr = eio(seg(t, 98.0, 99.0));
    if (kr > 0.01) {
      el('rect', { x: 320, y: 820, width: r1(470 * kr), height: 50, rx: 8, fill: C.sun }, M);
      for (let c = 0; c <= 4; c++) if (330 + c * 100 < 320 + 470 * kr) { el('rect', { x: 328 + c * 100, y: 820, width: 4, height: 24, fill: C.night }, M); tag(M, 330 + c * 100, 864, String(c), 1, C.night, 26); }
    }
  }
  riseFormula(S, t, 97.0, 999, 540, 1060, 72, ['1 : 100 000'], { fill: C.sun });
  riseFormula(S, t, 99.6, 999, 540, 1170, 64, ['4.5 cm', { s: 'arrow' }, '4.5 km'], { colors: { '4.5 km': C.mint } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Las razones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'comparar dividiendo', { 'font-size': 80, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EN EL MERCADO', 'Ana tiene 12 cromos, Beto 4', '«tengo mucho más», presume Ana');
  label(p, t, 12.8, 18.4, 'RESTANDO', 'Ana tiene 8 más', 'la resta dice cuánto más');
  label(p, t, 18.8, 24.4, 'DIVIDIENDO', 'los 4 de Beto caben 3 veces', 'Ana tiene el triple');
  label(p, t, 24.8, 29.0, 'LA RAZÓN', 'comparar dividiendo', 'cuántas veces cabe una en otra');
  label(p, t, 31.6, 37.6, 'LA RAZÓN', '18 niñas y 12 niños', 'se lee «18 es a 12»');
  label(p, t, 38.0, 43.6, 'EL ORDEN IMPORTA', 'niños a niñas es otra razón', 'y el segundo nunca es 0');
  label(p, t, 44.0, 49.8, 'GRUPOS IGUALES', 'seis grupos: 3 niñas y 2 niños', '18 : 12 es lo mismo que 3 : 2');
  label(p, t, 50.2, 56.0, 'PARTE AL TODO', '3 niñas de cada 5', 'tres quintos del grupo: 0.6');
  label(p, t, 59.6, 64.2, 'LA FOTO DEL PUESTO', 'de 3 de ancho por 2 de alto', 'Ana la quiere más grande');
  label(p, t, 64.6, 70.2, 'POR 2 LOS DOS', '6 por 4: se ve igual', 'solo más grande');
  label(p, t, 70.6, 76.2, 'SUMAR 3 A LOS DOS', '6 por 5: la foto se estira', 'sumar cambia la razón');
  label(p, t, 76.6, 82.4, 'EQUIVALENTES', 'multiplica o divide los dos', 'por el mismo número; nunca sumes');
  label(p, t, 85.0, 89.8, 'CON UNIDADES', '180 km en 3 horas', 'la rapidez: 60 km por hora');
  label(p, t, 90.2, 96.2, '¿CUÁL CONVIENE?', 'precio entre jugos: por unidad', 'el de 8 sale más barato');
  label(p, t, 96.6, 102.4, 'LA ESCALA', '1 cm del mapa son 100 000 cm', 'es decir, 1 km de verdad');
  label(p, t, 102.8, 108.2, 'SIN UNIDADES', 'centímetros con centímetros', 'la escala es solo un número');
};
FILM.summary = (p, t) => summaryList(p, t, 109.0, 'En resumen', [
  ['LA RAZÓN', ['a : b', '=', { fr: ['a', 'b'] }, ',', 'b ≠ 0']],
  ['EQUIVALENTES', 'multiplica los dos, nunca sumes'],
  ['PARTE AL TODO', ['3 : 5', '=', '0.6']],
  ['CON UNIDADES', '60 km/h, precio por unidad'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 4; i < 12; i += 2) ev.push({ t: 6.8 + i * .08, type: 'tile', i });
  ev.push({ t: 7.2, type: 'pop', i: 0 }, { t: 7.8, type: 'tile', i: 1 }, { t: 8.0, type: 'pop', i: 1 });
  ev.push({ t: 12.8, type: 'paint', d: .6 }, { t: 13.0, type: 'slide', d: .8 }, { t: 13.4, type: 'rise' });
  for (let gq = 0; gq < 3; gq++) ev.push({ t: 19.4 + gq * .6, type: 'count', i: gq });
  ev.push({ t: 19.4, type: 'rise' }, { t: 21.2, type: 'yes' }, { t: 24.6, type: 'tile', i: 0 });
  ev.push({ t: 31.6, type: 'pop', i: 0 }, { t: 31.8, type: 'pop', i: 1 }, { t: 32.4, type: 'paint', d: 1.0 }, { t: 33.4, type: 'rise' }, { t: 38.0, type: 'rise' }, { t: 38.6, type: 'no' });
  ev.push({ t: 44.0, type: 'fly', d: 1.0 }, { t: 45.2, type: 'lasso', d: 1.0 }, { t: 45.6, type: 'rise' }, { t: 46.2, type: 'yes' }, { t: 50.4, type: 'rise' }, { t: 53.2, type: 'pop', i: 2 });
  ev.push({ t: 59.6, type: 'pop', i: 0 }, { t: 59.8, type: 'rise' }, { t: 64.6, type: 'slide', d: 1.0 }, { t: 65.8, type: 'rise' }, { t: 66.4, type: 'yes' });
  ev.push({ t: 70.4, type: 'away', d: .6 }, { t: 71.2, type: 'slide', d: 1.0 }, { t: 72.4, type: 'rise' }, { t: 73.0, type: 'no' }, { t: 76.8, type: 'rise' }, { t: 78.0, type: 'pop', i: 3 });
  ev.push({ t: 85.2, type: 'enter', d: 2.2 }, { t: 85.9, type: 'count', i: 0 }, { t: 86.6, type: 'count', i: 1 }, { t: 87.3, type: 'count', i: 2 }, { t: 87.4, type: 'rise' }, { t: 90.0, type: 'away', d: .4 });
  ev.push({ t: 90.4, type: 'card' }, { t: 93.2, type: 'pop', i: 0 }, { t: 94.0, type: 'yes' }, { t: 96.2, type: 'away', d: .4 });
  ev.push({ t: 96.6, type: 'pop', i: 1 }, { t: 97.0, type: 'rise' }, { t: 98.0, type: 'slide', d: 1.0 }, { t: 99.6, type: 'rise' });
  ev.push({ t: 108.4, type: 'away', d: .6 }, { t: 109.0, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 109.6 + k * .55, type: 'stop', i: k });
  ev.push({ t: 112.2, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana le dice a Beto: «tengo más cromos que tú».'],
  [4.0, 6.4, 'Sí, pero ¿cuánto más?'],
  [6.8, 9.6, 'Ana tiene doce cromos y Beto tiene cuatro.'],
  [9.8, 12.4, 'Hay dos formas de compararlos.'],
  [12.8, 15.6, 'Restando: Ana tiene ocho más.'],
  [15.8, 18.4, 'La resta dice cuánto más hay.'],
  [18.8, 21.6, 'Dividiendo: los cuatro de Beto caben tres veces.'],
  [21.8, 24.4, 'Ana tiene el triple.'],
  [24.8, 29.0, 'Comparar dividiendo tiene nombre: es una razón.'],
  [31.6, 34.6, 'En su salón hay dieciocho niñas y doce niños.'],
  [34.8, 37.6, 'La razón se lee: dieciocho es a doce.'],
  [38.0, 40.8, 'El orden importa: niños a niñas es otra razón.'],
  [41.0, 43.6, 'Y el segundo nunca puede ser cero.'],
  [44.0, 46.8, 'Formamos seis grupos iguales.'],
  [47.0, 49.8, 'Cada uno, tres niñas y dos niños.'],
  [50.2, 53.0, 'También se compara la parte con el todo.'],
  [53.2, 56.0, 'Tres de cada cinco son niñas: cero punto seis.'],
  [59.6, 62.2, 'Ana quiere agrandar la foto de su puesto.'],
  [62.4, 64.4, 'Mide tres por dos.'],
  [64.6, 67.4, 'Multiplica los dos lados por dos:'],
  [67.6, 70.2, 'la foto se ve igual, solo más grande.'],
  [70.6, 73.4, 'Beto propone sumar tres a cada lado.'],
  [73.6, 76.2, '¡La foto se estira! La razón cambió.'],
  [76.6, 79.4, 'Una razón se agranda multiplicando,'],
  [79.6, 82.4, 'nunca sumando.'],
  [85.0, 87.4, 'El bus de los jugos hace 180 km en 3 horas.'],
  [87.6, 89.8, 'Sesenta kilómetros por hora.'],
  [90.2, 93.0, '¿Seis jugos por 7 200, u ocho por 9 200?'],
  [93.2, 96.2, 'Por unidad, el de ocho sale más barato.'],
  [96.6, 99.4, 'En el mapa, a escala uno a cien mil,'],
  [99.6, 102.4, 'cuatro punto cinco centímetros son cuatro punto cinco kilómetros.'],
  [102.8, 105.6, 'La escala compara centímetros con centímetros:'],
  [105.8, 108.2, 'no lleva unidades.'],
  [109.6, 113.8, 'Ahora Ana lo dice bien: no solo tiene ocho más, tiene el triple.'],
  [114.0, 118.6, 'Una razón compara dividiendo, y se agranda multiplicando.'],
];
