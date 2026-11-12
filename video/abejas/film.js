// «Matemáticas de abeja» · estilo Tablet Sketch Explainer (Lemo-Opuscar). Toda la película: una sola página
// alta (1200 × 5320 unidades) que se va llenando de arriba abajo; la cámara son dos dedos sobre el lienzo.
// Lápiz primero, color después. Sin voz grabada: el ritmo sigue la narración NARR, que se entrega como .srt.
const NARR = [
  [0.8, 4.3, 'Una abeja encontró flores, lejos de la colmena.'],
  [4.7, 9.0, 'Adentro está oscuro. Así que no lo dice: lo baila.'],
  [10.2, 15.3, 'Camina en forma de ocho, y en el tramo recto menea el abdomen.'],
  [15.7, 20.4, 'Ese tramo es una flecha. Hacia arriba significa: hacia el sol.'],
  [20.8, 25.9, 'Si se inclina treinta grados, las flores están a treinta grados del sol.'],
  [26.4, 31.5, 'Y el ritmo dice la distancia: dieciocho vueltas por minuto son mil metros.'],
  [32.0, 36.3, 'Un ángulo y una distancia. En matemáticas se llaman coordenadas polares.'],
  [36.8, 41.5, 'Karl von Frisch descifró este baile y ganó el Nobel en 1973.'],
  [42.6, 49.3, 'También son arquitectas. El hexágono guarda la mayor cantidad de miel con la menor cantidad de cera.'],
  [50.4, 57.5, 'Y una abeja australiana construye en espiral, sin plano: cada una solo mira la celda de al lado.'],
  [57.9, 61.8, 'Es la misma regla con la que crece un cristal.'],
  [62.8, 66.3, 'Además cuentan hasta cuatro. Y entienden el cero.'],
  [67.4, 70.3, 'Matemáticas, sin escribir un solo número.'],
];
const SUBJ = { honey: '#eeb24a', honeyDk: '#c98a2e', stripe: '#6b5140', wing: '#c4dbe6', blue: '#86aee0', blueDk: '#5f88c4', pollen: '#f2c75a',
  leaf: '#8fb47c', wax: '#f5dfa6', sun: '#f7dc7c', wood: '#d2a469', card: '#f1e2c4' };

function buildPage() {
  R = mulberry(20261112);
  const L = (pts, t, d, o = {}) => PEN(pts, { layer: 'light', w: 1.3, p: 0.5, ...o }, t, d);
  const hexP = (cx, cy, r, rot = Math.PI / 6) => Array.from({ length: 7 }, (_, i) => [cx + r * Math.cos(rot + i * Math.PI / 3), cy + r * Math.sin(rot + i * Math.PI / 3)]);
  const sunMark = (x, y, r, t) => { t = circleStroke(x, y, r, { w: 2.6 }, t, 0.3); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2; t = PEN([[x + Math.cos(a) * (r + 10), y + Math.sin(a) * (r + 10)], [x + Math.cos(a) * (r + 30), y + Math.sin(a) * (r + 30)]], { w: 2.4, ta: 0.3, tb: 0.3 }, t + 0.02, 0.04); } return t; };
  const flower = (x, y, k, t, col = true) => {
    const pet = []; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; pet.push(ell(x + Math.cos(a) * 44 * k, y + Math.sin(a) * 44 * k, 34 * k, 24 * k, a, 0, TAU, 28)); }
    for (const p of pet) t = PEN(p, { w: 2.3, wob: 0.5 }, t + 0.02, 0.1);
    t = circleStroke(x, y, 20 * k, { w: 2.3 }, t + 0.02, 0.1);
    return { t, pet, c: ell(x, y, 20 * k, 20 * k, 0, 0, TAU, 20) };
  };

  // ================= Z1 · la abeja encontró flores (0–9.6) =================
  const bx = 480, by = 930, k = 1.5;
  const abd = ell(bx - 95 * k, by + 8 * k, 150 * k, 92 * k, -0.12, 0, TAU, 70), tho = ell(bx + 62 * k, by - 8 * k, 72 * k, 66 * k, 0, 0, TAU, 44), head = ell(bx + 158 * k, by + 6 * k, 46 * k, 44 * k, 0, 0, TAU, 32);
  const w1 = ell(bx + 20 * k, by - 126 * k, 124 * k, 46 * k, -0.5, 0, TAU, 50), w2 = ell(bx - 52 * k, by - 104 * k, 92 * k, 34 * k, -0.22, 0, TAU, 40);
  L([[bx - 260 * k, by + 8 * k], [bx + 215 * k, by + 4 * k]], 0.08, 0.08);
  L(ell(bx - 95 * k, by + 8 * k, 158 * k, 100 * k, -0.12, 2, 2 + TAU * 1.03, 40), 0.17, 0.09);
  let t = PEN(ell(bx - 95 * k, by + 8 * k, 150 * k, 92 * k, -0.12, 2.6, 2.6 + TAU * 1.03, 90), { w: 2.9, ta: 0.04, tb: 0.06, wob: 0.6 }, 0.3, 1.5);   // la primera línea, despacio y de cerca
  const stripe = x => bez([x * k + bx, by - 78 * k], [x * k + bx + 26 * k, by - 30 * k], [x * k + bx + 26 * k, by + 44 * k], [x * k + bx - 2 * k, by + 96 * k], 16);
  for (const x of [-196, -138, -80, -22]) t = PEN(stripe(x), { w: 2.3 }, t + 0.03, 0.1);
  t = PEN([[bx - 243 * k, by + 22 * k], [bx - 278 * k, by + 34 * k]], { w: 2.4, tb: 0.5 }, t + 0.03, 0.05);
  t = circleStroke(bx + 62 * k, by - 8 * k, 72 * k, { ry: 66 * k, w: 2.8 }, t + 0.06, 0.3);
  t = circleStroke(bx + 158 * k, by + 6 * k, 46 * k, { ry: 44 * k, w: 2.8 }, t + 0.04, 0.22);
  t = PEN(ell(bx + 172 * k, by, 12 * k, 16 * k, 0.2, 0, TAU * 1.05, 16), { w: 2.6 }, t + 0.03, 0.07);
  t = PEN([[bx + 176 * k, by - 34 * k], [bx + 214 * k, by - 86 * k], [bx + 246 * k, by - 92 * k]], { w: 2.3 }, t + 0.03, 0.08);
  t = PEN([[bx + 160 * k, by - 38 * k], [bx + 182 * k, by - 100 * k], [bx + 208 * k, by - 116 * k]], { w: 2.3 }, t + 0.03, 0.08);
  T_.out = t + 0.1;                                                    // aquí se abre el plano
  t = PEN(w1, { w: 2.4, wob: 0.7 }, T_.out + 0.5, 0.3);
  t = PEN(w2, { w: 2.2, wob: 0.7 }, t + 0.04, 0.24);
  for (const [x, dx] of [[30, -18], [66, 6], [100, 26]]) t = PEN([[bx + x * k, by + 54 * k], [bx + (x + dx * 0.5) * k, by + 100 * k], [bx + (x + dx) * k, by + 132 * k]], { w: 2.4 }, t + 0.03, 0.07);
  // la flor, arriba a la derecha, y el camino de puntos hasta ella
  const fl = flower(960, 560, 1.3, t + 0.15); t = fl.t;
  t = PEN([[960, 604], [972, 700], [950, 800]], { w: 2.6 }, t + 0.03, 0.12);
  const leaf = ell(1004, 716, 46, 20, -0.5, 0, TAU, 24); t = PEN(leaf, { w: 2.2 }, t + 0.03, 0.1);
  // segundo lápiz: el color
  t = Math.max(t + 0.2, 4.8);
  t = BLOB(abd, SUBJ.honey, { dx: 9, dy: 7, ang: -0.4 }, t, 0.42);
  for (const x of [-196, -80]) { const a = stripe(x), b = stripe(x + 58).reverse(); t = BLOB(a.concat(b), SUBJ.stripe, { dx: 9, dy: 7, a: 0.72, sp: 7 }, t + 0.03, 0.12); }
  t = BLOB(tho, SUBJ.honeyDk, { dx: 9, dy: 7 }, t + 0.04, 0.2);
  t = BLOB(head, SUBJ.stripe, { dx: 8, dy: 6, a: 0.7, holes: [ell(bx + 172 * k, by, 12 * k, 16 * k, 0.2, 0, TAU, 12)] }, t + 0.04, 0.14);
  t = BLOB(w1, SUBJ.wing, { dx: 8, dy: 6, a: 0.8 }, t + 0.04, 0.2);
  t = BLOB(w2, SUBJ.wing, { dx: 8, dy: 6, a: 0.8, stop: 0.6 }, t + 0.04, 0.12);        // sigue dibujándose
  for (const p of fl.pet) t = BLOB(p, SUBJ.blue, { dx: 7, dy: 6, sp: 7 }, t + 0.03, 0.09);
  t = BLOB(fl.c, SUBJ.pollen, { dx: 6, dy: 5, sp: 6 }, t + 0.03, 0.07);
  t = BLOB(leaf, SUBJ.leaf, { dx: 7, dy: 5, sp: 6 }, t + 0.03, 0.08);
  const n1_ = TXT('no lo dice: lo baila', 250, 1300, 92, { f: 'CB', cps: 1500 }, Math.max(t + 0.2, 7.0)); t = n1_.t0 + n1_.d;
  t = PEN([[250, 1328], [540, 1321], [810, 1330]], { layer: 'coral', w: 4.2, wob: 1 }, t + 0.1, 0.25);

  // ================= Z2 · el baile del ocho sobre el panal (10–23) =================
  const C0 = [600, 1930], RC = 370, d = [0.5, -0.866], n = [0.866, 0.5];
  const A = [C0[0] - d[0] * 150, C0[1] - d[1] * 150], B = [C0[0] + d[0] * 150, C0[1] + d[1] * 150];
  t = 10.0;
  t = circleStroke(C0[0], C0[1], RC, { w: 3, a0: 2.2 }, t, 0.8);
  const hx = []; for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) { const x = C0[0] + (i + (j & 1) * 0.5) * 121, y = C0[1] + j * 105; if (Math.hypot(x - C0[0], y - C0[1]) < RC - 78) hx.push([x, y]); }
  for (const [x, y] of hx) t = L(hexP(x, y, 68), t + 0.005, 0.035, { smooth: false });
  const loop = sg => Array.from({ length: 25 }, (_, i) => { const f = i / 24 * Math.PI; return [C0[0] + n[0] * 125 * Math.sin(f) * sg + d[0] * 150 * Math.cos(f), C0[1] + n[1] * 125 * Math.sin(f) * sg + d[1] * 150 * Math.cos(f)]; });
  t = PEN([A, B], { w: 3.2, ta: 0.06, tb: 0.06 }, Math.max(t + 0.1, 11.7), 0.3);
  t = PEN(loop(1), { w: 3 }, t + 0.04, 0.5);
  t = PEN([A, B], { w: 2.2, p: 0.6, ghost: false }, t + 0.03, 0.2);
  t = PEN(loop(-1), { w: 3 }, t + 0.04, 0.5);
  // el meneo: un zigzag sobre el tramo recto
  const zig = []; for (let i = 0; i <= 14; i++) { const u = 0.08 + i / 14 * 0.84, sg = i % 2 ? 1 : -1; zig.push([A[0] + (B[0] - A[0]) * u + n[0] * 17 * sg, A[1] + (B[1] - A[1]) * u + n[1] * 17 * sg]); }
  t = PEN(zig, { w: 2.4, smooth: false, wob: 0.3 }, Math.max(t + 0.15, 13.6), 0.6);
  // la bailarina, pequeña, al final del tramo
  const ba = Math.atan2(d[1], d[0]), bb = ell(B[0] + d[0] * 26, B[1] + d[1] * 26, 38, 22, ba, 0, TAU, 26);
  t = PEN(bb, { w: 2.4 }, t + 0.1, 0.12);
  const bw1 = ell(B[0] + d[0] * 12 + n[0] * 26, B[1] + d[1] * 12 + n[1] * 26, 26, 11, ba + 0.7, 0, TAU, 18), bw2 = ell(B[0] + d[0] * 12 - n[0] * 26, B[1] + d[1] * 12 - n[1] * 26, 26, 11, ba - 0.7, 0, TAU, 18);
  t = PEN(bw1, { w: 2 }, t + 0.02, 0.06); t = PEN(bw2, { w: 2 }, t + 0.02, 0.06);
  t = BLOB(ell(C0[0], C0[1], RC, RC, 0, 0, TAU, 80), SUBJ.wax, { dx: 10, dy: 8, a: 0.75, sp: 16, stop: 0.92, cuts: [bb] }, t + 0.1, 0.55);
  t = BLOB(bb, SUBJ.honey, { dx: 5, dy: 4, sp: 5 }, t + 0.03, 0.06);
  // la flecha: ese tramo apunta
  const sh = -40; t = arrow([[A[0] - n[0] * sh, A[1] - n[1] * sh], [B[0] - n[0] * sh, B[1] - n[1] * sh]], { w: 5 }, Math.max(t + 0.15, 15.9), 0.55);
  // arriba = el sol
  t = L([[C0[0], C0[1]], [C0[0] + 2, C0[1] - 400]], Math.max(t + 0.2, 17.2), 0.25, { w: 1.8, p: 0.75 });
  t = sunMark(600, 1468, 28, t + 0.08);
  t = BLOB(ell(600, 1468, 28, 28, 0, 0, TAU, 20), SUBJ.sun, { dx: 5, dy: 4, sp: 6 }, t + 0.03, 0.07);
  const n2_ = TXT('arriba = el sol', 668, 1490, 66, { f: 'CM', cps: 1400 }, t + 0.1); t = n2_.t0 + n2_.d;
  // 30°
  t = PEN(ell(C0[0], C0[1], 200, 200, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI / 6, 14), { layer: 'coral', w: 4.2 }, Math.max(t + 0.2, 21.0), 0.22);
  const a30 = TXT('30°', 628, 1690, 70, { f: 'CB', layer: 'coral', cps: 900 }, t + 0.06); t = a30.t0 + a30.d;

  // ================= Z3 · el mapa: el mismo ángulo, afuera (23–41.5) =================
  const O = [360, 3020], Sn = [360, 2470], F = [O[0] + d[0] * 560, O[1] + d[1] * 560];
  t = 23.6;
  t = L([[130, 3202], [1070, 3198]], t, 0.2, { w: 1.6 });
  const dome = [[268, 3200], [266, 3110], [296, 3052], [360, 3022], [424, 3052], [454, 3110], [452, 3200]];
  t = PEN(dome, { w: 3 }, t + 0.05, 0.4);
  t = PEN([[268, 3200], [452, 3200]], { w: 2.8 }, t + 0.03, 0.1);
  for (const y of [3078, 3122, 3164]) t = PEN([[272 + (y < 3100 ? 14 : 0), y], [360, y + 8], [448 - (y < 3100 ? 14 : 0), y]], { w: 2 }, t + 0.02, 0.07);
  const door = ell(360, 3176, 20, 24, 0, 0, TAU, 18); t = PEN(door, { w: 2.4 }, t + 0.02, 0.07);
  t = L([O, [Sn[0], Sn[1] + 70]], t + 0.1, 0.3, { w: 1.8, p: 0.75 });
  t = sunMark(Sn[0], Sn[1], 52, t + 0.05);
  // el vector: 30° a la derecha del sol
  t = arrow([[O[0] + d[0] * 30, O[1] + d[1] * 30], [F[0] - d[0] * 46, F[1] - d[1] * 46]], { w: 5.2, head: 26 }, Math.max(t + 0.15, 25.7), 0.7);
  t = PEN(ell(O[0], O[1], 215, 215, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI / 6, 14), { layer: 'coral', w: 4.2 }, t + 0.06, 0.2);
  const b30 = TXT('30°', 400, 2772, 70, { f: 'CB', layer: 'coral', cps: 900 }, t + 0.05); t = b30.t0 + b30.d;
  const f1 = flower(F[0] + 26, F[1] - 26, 0.9, t + 0.1), f2 = flower(F[0] + 118, F[1] + 22, 0.72, f1.t + 0.02); t = f2.t;
  t = PEN([[F[0] + 26, F[1] + 2], [F[0] + 40, F[1] + 90]], { w: 2.4 }, t + 0.02, 0.07); t = PEN([[F[0] + 118, F[1] + 44], [F[0] + 108, F[1] + 110]], { w: 2.4 }, t + 0.02, 0.06);
  const mapColor = t0 => { let t = t0;
  t = BLOB(ell(Sn[0], Sn[1], 52, 52, 0, 0, TAU, 30), SUBJ.sun, { dx: 8, dy: 6 }, t, 0.16);
  t = BLOB(dome, SUBJ.wood, { dx: 9, dy: 7, holes: [door] }, t + 0.04, 0.26);
  for (const f of [f1, f2]) { for (const p of f.pet) t = BLOB(p, SUBJ.blue, { dx: 6, dy: 5, sp: 6 }, t + 0.02, 0.06); t = BLOB(f.c, SUBJ.pollen, { dx: 5, dy: 4, sp: 5 }, t + 0.02, 0.05); }
  return t; };
  // el ritmo dice la distancia
  for (let i = 1; i <= 4; i++) { const p = [O[0] + d[0] * (30 + i * 95), O[1] + d[1] * (30 + i * 95)]; t = PEN([[p[0] - n[0] * 16, p[1] - n[1] * 16], [p[0] + n[0] * 16, p[1] + n[1] * 16]], { w: 2.4 }, t + 0.04, 0.05); }
  const r1_ = TXT('18 vueltas por minuto', 455, 2950, 66, { f: 'CM', cps: 1700 }, Math.max(t + 0.1, 28.0)); t = r1_.t0 + r1_.d;
  const r2_ = TXT('= 1000 metros', 455, 3036, 76, { f: 'CB', layer: 'coral', cps: 1500 }, t + 0.1); t = mapColor(r2_.t0 + r2_.d + 0.15);
  // coordenadas polares
  const p1_ = TXT('ángulo + distancia', 140, 3340, 88, { f: 'CB', cps: 1500 }, Math.max(t + 0.2, 32.3)); t = p1_.t0 + p1_.d;
  const p2_ = TXT('= coordenadas polares', 140, 3440, 88, { f: 'CB', cps: 1600 }, t + 0.12); t = p2_.t0 + p2_.d;
  t = PEN([[196, 3466], [520, 3460], [880, 3468]], { layer: 'coral', w: 4.4, wob: 1 }, t + 0.1, 0.28);
  const nb = TXT('Karl von Frisch · Nobel 1973', 140, 3546, 58, { f: 'CM', cps: 1500 }, Math.max(t + 0.3, 37.2)); t = nb.t0 + nb.d;

  // ================= Z4 · el hexágono (42.6–50) =================
  const HC = [390, 3900], HR = 100, cells = [[0, 0]]; for (let i = 0; i < 6; i++) cells.push([Math.cos(i * Math.PI / 3) * HR * 1.732, Math.sin(i * Math.PI / 3) * HR * 1.732]);
  t = 43.0;
  const hexes = cells.map(([x, y]) => hexP(HC[0] + x, HC[1] + y, HR));
  t = L(ell(HC[0], HC[1], 285, 285, 0, 1, 1 + TAU * 1.02, 40), t, 0.12);
  hexes.forEach((h, i) => { t = PEN(h, { w: 2.9, smooth: false, wob: 0.6 }, t + 0.03, i ? 0.2 : 0.5); });
  hexes.forEach((h, i) => { if (i === 4) return; t = BLOB(h.slice(0, 6), i % 2 ? SUBJ.honey : SUBJ.honeyDk, { dx: 9, dy: 7, ang: -0.5 + i * 0.3, stop: i === 6 ? 0.55 : 1, a: i % 2 ? 0.92 : 0.8 }, t + 0.04, 0.2); });
  const h1_ = TXT('más miel,', 700, 3870, 84, { f: 'CB', cps: 1400 }, Math.max(t + 0.15, 46.2)); t = h1_.t0 + h1_.d;
  const h2_ = TXT('menos cera', 700, 3962, 84, { f: 'CB', cps: 1400 }, t + 0.12); t = h2_.t0 + h2_.d;
  t = PEN([[704, 3988], [860, 3982], [1010, 3990]], { layer: 'coral', w: 4.2, wob: 1 }, t + 0.1, 0.22);

  // ================= Z5 · la espiral (50.4–62) =================
  const SC = [800, 4520], sp = []; { let th = 0.6; while (true) { const r = 30 + 15.5 * th; if (r > 236) break; sp.push([SC[0] + Math.cos(th) * r, SC[1] + Math.sin(th) * r]); th += 54 / r; } }
  t = 51.0;
  t = L(ell(SC[0], SC[1], 262, 262, 0, 0.5, 0.5 + TAU * 1.02, 40), t, 0.12);
  const per = Math.min(0.085, 3.6 / sp.length);
  sp.forEach(([x, y]) => { t = PEN(ell(x, y, 23, 23, 0, 1, 1 + TAU * 1.06, 14), { w: 2.2, wob: 0.4, ta: 0.1, tb: 0.1 }, t + 0.008, per); });
  T_.cells = sp.length;
  t = Math.max(t + 0.15, 55.0);
  sp.forEach(([x, y], i) => { if (i >= sp.length - 4) return; t = BLOB(ell(x, y, 23, 23, 0, 0, TAU, 14), i % 3 ? SUBJ.honey : SUBJ.honeyDk, { dx: 5, dy: 4, sp: 7, amp: 1 }, t + 0.006, 0.045); });
  const lc = sp[sp.length - 1];
  const s1_ = TXT('en espiral,', 110, 4440, 80, { f: 'CB', cps: 1400 }, Math.max(t + 0.1, 53.0));
  const s2_ = TXT('sin plano', 110, 4528, 80, { f: 'CB', cps: 1400 }, s1_.t0 + s1_.d + 0.12);
  t = Math.max(t, s2_.t0 + s2_.d);
  t = arrow([[lc[0] + 150, lc[1] + 120], [lc[0] + 90, lc[1] + 100], [lc[0] + 34, lc[1] + 26]], { w: 4.6, head: 20 }, Math.max(t + 0.15, 56.6), 0.4);
  const s3_ = TXT('como crece un cristal', 110, 4672, 62, { f: 'CM', cps: 1500 }, Math.max(t + 0.2, 58.2)); t = s3_.t0 + s3_.d;

  // ================= Z6 · cuentan hasta cuatro y entienden el cero (62.8–67) =================
  t = 63.0;
  const cards = [];
  for (let i = 0; i < 5; i++) { const x = 130 + i * 196, y = 4910, c = [[x, y], [x + 152, y - 3], [x + 154, y + 150], [x + 2, y + 152]]; cards.push(c); t = PEN(c.concat([c[0]]), { w: 2.8, smooth: false }, t + 0.03, 0.16); }
  const dots = [[], [[76, 76]], [[50, 54], [104, 100]], [[44, 50], [108, 54], [76, 108]], [[48, 48], [106, 48], [48, 106], [106, 106]]];
  dots.forEach((ds, i) => ds.forEach(([dx, dy]) => { t = PEN(ell(130 + i * 196 + dx, 4910 + dy, 15, 15, 0, 0, TAU * 1.1, 10), { w: 3.4 }, t + 0.02, 0.05); }));
  cards.forEach((c, i) => { if (i) t = BLOB(c, SUBJ.card, { dx: 8, dy: 7, sp: 12, a: 0.9 }, t + 0.03, 0.1); });
  ['1', '2', '3', '4'].forEach((s, i) => { const e = TXT(s, 130 + (i + 1) * 196 + 58, 5158, 84, { f: 'CB', cps: 700 }, t + 0.05); t = e.t0 + e.d; });
  const z_ = TXT('0', 130 + 56, 5160, 96, { f: 'CB', layer: 'coral', cps: 500 }, Math.max(t + 0.2, 65.0)); t = z_.t0 + z_.d;
  t = circleStroke(130 + 76, 5128, 62, { layer: 'coral', w: 4, ry: 56 }, t + 0.08, 0.3);

  // ================= el título, al final, en el espacio que quedó libre (68.6–72) =================
  const t1_ = TXT('Matemáticas', 205, 250, 160, { f: 'CB', cps: 1700 }, 69.3); t = t1_.t0 + t1_.d;
  const t2_ = TXT('de abeja', 340, 400, 160, { f: 'CB', cps: 1700 }, t + 0.15); t = t2_.t0 + t2_.d;
  mctx.font = '160px CB'; const wDe = mctx.measureText('de ').width, wAb = mctx.measureText('abeja').width;
  t = BLOB([[340 + wDe - 14, 318], [340 + wDe + wAb + 16, 312], [340 + wDe + wAb + 20, 418], [340 + wDe - 10, 424]], C.mustard, { dx: 10, dy: 9, sp: 16, a: 0.9 }, t + 0.12, 0.3);
  t = PEN([[230, 286], [520, 278], [860, 288]], { layer: 'coral', w: 5, wob: 1.2 }, t + 0.1, 0.3);
  T_.done = t;

  // ================= cámara: dos dedos sobre el lienzo =================
  const o = T_.out;
  CAM = [
    { t: 0.00, x: 330, y: 940, z: 1.9, r: -2.0, k: 'd' },
    { t: o, x: 350, y: 944, z: 1.84, r: -1.8, k: 'd' },
    { t: o + 0.9, x: 600, y: 860, z: 1.12, r: -0.8, k: 'g' },            // se abre: es una abeja
    { t: 6.6, x: 604, y: 866, z: 1.14, r: -0.6, k: 'd' },
    { t: 7.4, x: 600, y: 1010, z: 1.14, r: 0.4, k: 'g' },
    { t: 9.25, x: 602, y: 1016, z: 1.16, r: 0.6, k: 'd' },
    { t: 10.05, x: 600, y: 1900, z: 1.2, r: 1.6, k: 'g' },              // baja al panal
    { t: 13.4, x: 604, y: 1908, z: 1.22, r: 1.3, k: 'd' },
    { t: 14.2, x: 610, y: 1930, z: 1.75, r: 2.4, k: 'g' },               // cerca: el meneo
    { t: 16.9, x: 612, y: 1926, z: 1.8, r: 2.2, k: 'd' },
    { t: 17.7, x: 606, y: 1840, z: 1.18, r: 0.6, k: 'g' },
    { t: 22.7, x: 604, y: 1836, z: 1.2, r: 0.4, k: 'd' },
    { t: 23.5, x: 580, y: 2820, z: 1.13, r: -1.4, k: 'g' },              // baja al mapa
    { t: 31.6, x: 584, y: 2826, z: 1.15, r: -1.1, k: 'd' },
    { t: 32.4, x: 570, y: 3190, z: 1.13, r: 0.8, k: 'g' },                // las dos líneas de abajo
    { t: 41.7, x: 573, y: 3196, z: 1.15, r: 0.6, k: 'd' },
    { t: 42.6, x: 590, y: 3900, z: 1.2, r: -1.6, k: 'g' },              // el hexágono
    { t: 43.5, x: 420, y: 4010, z: 1.55, r: -2.2, k: 'g' },              // el primero, de cerca
    { t: 44.2, x: 424, y: 4012, z: 1.58, r: -2.0, k: 'd' },
    { t: 45.0, x: 590, y: 3906, z: 1.2, r: -1.0, k: 'g' },
    { t: 50.0, x: 593, y: 3912, z: 1.22, r: -0.8, k: 'd' },
    { t: 50.9, x: 580, y: 4530, z: 1.12, r: 1.4, k: 'g' },               // la espiral
    { t: 62.0, x: 584, y: 4538, z: 1.14, r: 1.0, k: 'd' },
    { t: 62.9, x: 600, y: 5020, z: 1.08, r: -0.8, k: 'g' },              // las tarjetas
    { t: 66.8, x: 603, y: 5024, z: 1.1, r: -0.6, k: 'd' },
    { t: 68.1, x: 600, y: 2660, z: 0.36, r: 0.0, k: 'g' },               // toda la página
    { t: 68.7, x: 600, y: 2660, z: 0.36, r: 0.0, k: 'd' },
    { t: 69.6, x: 600, y: 700, z: 1.0, r: -0.6, k: 'g' },               // arriba: queda el sitio del título
    { t: FULL, x: 603, y: 694, z: 1.03, r: -0.4, k: 'd' }];
  CAM.forEach((b, i) => { if (i && b.k === 'g' && b.t > CAM[i - 1].t) SFX.push({ t: CAM[i - 1].t, type: 'gesture', d: b.t - CAM[i - 1].t, pan: 0 }); });
  for (const [a, e, id] of [[21.0, 0, 'idea'], [25.7, 0, 'idea'], [32.3, 0, 'idea'], [46.2, 0, 'idea'], [58.2, 0, 'idea'], [65.0, 0, 'idea'], [69.3, 0, 'title']]) SFX.push({ t: a, type: id, d: 0, pan: 0 });
  SFX.push({ t: 0, type: 'narr', d: 0, pan: 0, lines: NARR });
}
