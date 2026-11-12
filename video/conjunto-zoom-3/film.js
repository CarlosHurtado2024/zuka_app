// «Operaciones entre conjuntos» (lección alg-0c de Zuka) en estilo Scale Zoom Explainer. Motor: zoomkit.js.
// Un solo ejemplo: U = siete amigos; A = juegan fútbol {Ana, Beto, Caro, Dani}; B = tocan música {Caro, Dani, Eva}.
// Niveles: 0 el patio (universo y diagrama de Venn) → 1 dentro del cruce: unión e intersección
// → 2 dentro de Ana: diferencia, complemento y diferencia simétrica → 3 dentro del cruce: contar la unión.
const UR = { x: 80, y: 500, w: 920, h: 700 };
const CA = { x: 400, y: 850, r: 230 }, CB = { x: 680, y: 850, r: 230 };
const KIDS = ['Ana', 'Beto', 'Caro', 'Dani', 'Eva', 'Fede', 'Gabi'];
const VP = { Ana: [290, 770], Beto: [290, 930], Caro: [540, 790], Dani: [540, 910], Eva: [790, 850], Fede: [190, 565], Gabi: [890, 565] };
const P0 = { Ana: [520, 690], Beto: [300, 1050], Caro: [770, 1060], Dani: [240, 650], Eva: [820, 720], Fede: [560, 990], Gabi: [400, 860] };
const MOVE = { Ana: 13.4, Beto: 13.5, Caro: 13.6, Dani: 13.7, Eva: 19.6, Fede: 13.8, Gabi: 13.9 };
const RY = 1300;                                                          // renglón del resultado

const FILM = {
  DUR: 120, endAt: 109.2,
  DT: [[30.2, 32.4], [56.4, 58.6], [82.4, 84.6]],
  dives: () => [
    { a: 30.2, b: 32.4, P: [540, 850], r: 70, A: [540, 850] },
    { a: 56.4, b: 58.6, P: VP.Ana, r: 60, A: [540, 850] },
    { a: 82.4, b: 84.6, P: [540, 850], r: 70, A: [540, 700] },
  ],
  open: { Z0: 2.6, C: P0.Ana, t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 26.4, lock: 27.0, name: 'el cruce', L: [330, 1330] },
    { fire: 52.6, lock: 53.2, name: 'lo que sobra', L: [480, 1330] },
    { fire: 78.6, lock: 79.2, name: 'contar', L: [330, 1330] },
  ],
  stops: ['diagrama de Venn', 'unión e intersección', 'diferencias', 'contar'],
  guide: {
    blinks: [7.6, 16.0, 23.2, 35.0, 44.8, 50.4, 61.6, 69.8, 76.2, 88.6, 101.4, 114.0],
    smiles: [[21.0, 22.6], [43.6, 45.0], [99.4, 101.0], [110.4, 130]],
    wides: [[94.2, 95.4]],
    looks: [],
  },
};

// ---------- el diagrama, con zonas pintadas ----------
// pa = cuánto está pintada cada zona {out, a, b, ab}; la pintura se extiende desde el centro de la zona
const ZC = { out: [920, 1150], a: [290, 850], b: [790, 850], ab: [540, 850] };
function spread(p, clip, at, k, col = C.mint) {
  if (k <= 0.005) return;
  const G = g(p, { 'clip-path': clip });
  el('circle', { cx: at[0], cy: at[1], r: r1(760 * eio(k)), fill: col }, G);
}
function venn(G, t, pa = {}, ku = 1, ka = 1, kb = 1) {
  if (ku > 0.01) {
    const S = scaleAt(G, 540, 850, ku);
    el('rect', { x: UR.x, y: UR.y, width: UR.w, height: UR.h, rx: 40, fill: C.n2 }, S);
    spread(S, clipOf('rect', { x: UR.x, y: UR.y, width: UR.w, height: UR.h, rx: 40 }), ZC.out, pa.out || 0);
    el('rect', { x: UR.x, y: UR.y, width: UR.w, height: UR.h, rx: 40, fill: 'none', stroke: C.mist, 'stroke-width': 4 }, S);
    el('circle', { cx: UR.x + UR.w - 44, cy: UR.y + UR.h - 50, r: 30, fill: C.night }, S);
    text(S, UR.x + UR.w - 44, UR.y + UR.h - 33, 'U', { 'font-size': 48, 'font-weight': 700, fill: C.mist, 'text-anchor': 'middle' });
  }
  const circ = c => ({ cx: c.x, cy: c.y, r: c.r });
  const fa = eo(seg(ka, .8, 1)), fb = eo(seg(kb, .8, 1));
  if (fa > 0.01) { el('circle', { ...circ(CA), r: r1(CA.r * fa), fill: C.n3 }, G); spread(G, clipOf('circle', circ(CA)), ZC.a, pa.a || 0); }
  if (fb > 0.01) { el('circle', { ...circ(CB), r: r1(CB.r * fb), fill: C.n3 }, G); spread(G, clipOf('circle', circ(CB)), ZC.b, pa.b || 0); }
  if (fa > .99 && fb > .99) {
    const L = g(G, { 'clip-path': clipOf('circle', circ(CA)) }), L2 = g(L, { 'clip-path': clipOf('circle', circ(CB)) });
    el('circle', { ...circ(CB), fill: C.n3 }, L2);
    spread(L2, clipOf('circle', circ(CB)), ZC.ab, pa.ab || 0);
  }
  lasso(G, CA.x, CA.y, CA.r, CA.r, eio(ka), C.cream, 6); lasso(G, CB.x, CB.y, CB.r, CB.r, eio(kb), C.cream, 6);
  const pill = (x, s, k) => { if (k <= 0.01) return; const w = tw(s, 40) + 40; el('rect', { x: r1(x - w / 2), y: 1110, width: r1(w * k), height: 58, rx: 29, fill: C.night }, G); wipeText(G, x, 1152, s, { 'font-size': 40, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle' }, k, 46); };
  pill(300, 'A: fútbol', eio(seg(ka, .6, 1))); pill(780, 'B: música', eio(seg(kb, .6, 1)));
}
const kidsAt = (G, t, pos = VP, hl = {}) => KIDS.forEach(n => chip(G, pos[n][0], pos[n][1], n, 1 + .12 * wob(t, hl[n] || -9, 16, 6)));
// pintar: [inicio, fin] → 0..1..0
const paintK = (t, a, b) => eio(seg(t, a, a + .8)) * (1 - eio(seg(t, b, b + .5)));

// ---------- nivel 0 · el patio ----------
function level0(G, t) {
  starField(G, 9, 160);
  venn(G, t, {}, pop(t, 6.8), seg(t, 12.6, 13.4), seg(t, 18.8, 19.6));
  const pos = {};
  KIDS.forEach(n => { const m = eio(seg(t, MOVE[n], MOVE[n] + 1.0)); pos[n] = [lerp(P0[n][0], VP[n][0], m), lerp(P0[n][1], VP[n][1], m) - 70 * Math.sin(Math.PI * m)]; });
  if (t < 6.4) halo(G, P0.Ana[0], P0.Ana[1], 120, 175);
  kidsAt(G, t, pos, { Caro: 20.4, Dani: 20.5 });
}
// ---------- nivel 1 · unión e intersección ----------
function level1(G, t) {
  starField(G, 19, 90);
  const u = paintK(t, 33.4, 39.6), n = paintK(t, 40.6, 52.0);
  venn(G, t, { a: u, b: u, ab: Math.max(u, n) });
  kidsAt(G, t, VP, { Caro: 41.4, Dani: 41.5 });
  riseFormula(G, t, 34.4, 39.6, 540, RY, 50, ['A', { s: 'cup' }, 'B', '=', '{Ana, Beto, Caro, Dani, Eva}']);
  riseFormula(G, t, 41.4, 52.0, 540, RY, 54, ['A', { s: 'cap' }, 'B', '=', '{Caro, Dani}']);
}
// ---------- nivel 2 · lo que sobra ----------
function level2(G, t) {
  starField(G, 29, 90);
  const d = paintK(t, 59.6, 65.2), c = paintK(t, 66.0, 71.6), s = paintK(t, 72.4, 78.0);
  venn(G, t, { a: Math.max(d, s), b: Math.max(c, s), out: c, ab: 0 });
  kidsAt(G, t, VP, {});
  riseFormula(G, t, 60.6, 65.2, 540, RY, 54, ['A', '−', 'B', '=', '{Ana, Beto}']);
  riseFormula(G, t, 67.0, 71.6, 540, RY, 54, ['A', { sup: 'c' }, '=', '{Eva, Fede, Gabi}']);
  riseFormula(G, t, 73.4, 78.0, 540, RY, 54, ['A', { s: 'tri' }, 'B', '=', '{Ana, Beto, Eva}']);
}
// ---------- nivel 3 · contar la unión ----------
const RA = { y: 620, x: [200, 370, 540, 710] }, RB = { y: 780, x: [540, 710, 880] };
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 109.2, 109.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  text(S, 90, RA.y + 16, 'A', { 'font-size': 48, 'font-weight': 700, fill: C.mist, 'text-anchor': 'middle' });
  text(S, 90, RB.y + 16, 'B', { 'font-size': 48, 'font-weight': 700, fill: C.mist, 'text-anchor': 'middle' });
  ['Ana', 'Beto', 'Caro', 'Dani'].forEach((n, i) => chip(S, RA.x[i], RA.y, n, 1 + .14 * wob(t, i >= 2 ? 98.8 + (i - 2) * .15 : -9, 16, 6), i >= 2 && t > 97.0 ? [C.sun, C.sunD] : [C.cream, C.creamD]));
  ['Caro', 'Dani', 'Eva'].forEach((n, i) => {
    const dup = i < 2, m = dup ? eio(seg(t, 97.8 + i * .15, 98.8 + i * .15)) : 0;
    const k = dup ? 1 - ei(seg(t, 98.6 + i * .15, 98.85 + i * .15)) : 1;
    chip(S, RB.x[i], lerp(RB.y, RA.y, m), n, k, dup && t > 97.0 ? [C.sun, C.sunD] : [C.cream, C.creamD]);
  });
  // los conteos encima de cada fila
  const cnt = (x, y, s, t0) => { const k = pop(t, t0); if (k > 0.01) text(S, x, r1(y), s, { 'font-size': r1(40 * k), 'font-weight': 700, fill: C.sun, 'text-anchor': 'middle' }); };
  [0, 1, 2, 3].forEach(i => cnt(RA.x[i], RA.y - 52, String(i + 1), 85.6 + i * .3));
  [0, 1, 2].forEach(i => { const k = pop(t, 87.0 + i * .3) * (i < 2 ? out(t, 98.4, .25) : 1); const lbl = i < 2 || t < 98.6 ? String(i + 1) : '1'; if (k > 0.01) text(S, RB.x[i], r1(RB.y + 82), lbl, { 'font-size': r1(40 * k), 'font-weight': 700, fill: C.sun, 'text-anchor': 'middle' }); });
  riseText(S, t, 91.6, 96.6, 540, 990, '4 + 3 = 7', { 'font-size': 96 });
  badge(S, 830, 900, life(t, 93.8, 96.6), false);
  riseText(S, t, 99.0, 999, 540, 990, '4 + 3 − 2 = 5', { 'font-size': 96, fill: C.sun });
  riseFormula(S, t, 103.2, 999, 540, 1200, 54, ['n(A', { s: 'cup' }, 'B)', '=', 'n(A)', '+', 'n(B)', '−', 'n(A', { s: 'cap' }, 'B)']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(800 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Operaciones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'entre conjuntos', { 'font-size': 92, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.2, 'UNIVERSO U', 'los siete amigos', 'todo lo que se estudia');
  label(p, t, 12.6, 18.4, 'CONJUNTO A', 'los que juegan fútbol', 'A = {Ana, Beto, Caro, Dani}');
  label(p, t, 18.8, 24.6, 'CONJUNTO B', 'los que tocan música', 'B = {Caro, Dani, Eva}');
  label(p, t, 24.8, 30.0, 'DIAGRAMA DE VENN', 'lo común va en el cruce', 'Fede y Gabi: en ninguno');
  label(p, t, 32.8, 39.4, 'UNIÓN · «O»', 'está en A o en B', 'o en los dos');
  label(p, t, 40.0, 46.0, 'INTERSECCIÓN · «Y»', 'está en A y en B', 'en los dos a la vez');
  label(p, t, 46.4, 52.2, '«O» JUNTA, «Y» FILTRA', 'la unión crece', 'la intersección se achica');
  label(p, t, 59.0, 65.0, 'DIFERENCIA · «PERO NO»', 'en A, pero no en B', 'a A se le quita lo de B');
  label(p, t, 65.4, 71.4, 'COMPLEMENTO · «NO ESTÁ»', 'lo de U que no está en A', 'se marca con una c arriba');
  label(p, t, 71.8, 77.8, 'DIFERENCIA SIMÉTRICA', 'en uno solo de los dos', 'en A o en B, pero no en ambos');
  label(p, t, 85.0, 90.6, 'CONTAR', 'n(A) = 4 · n(B) = 3', 'n cuenta los elementos');
  label(p, t, 91.0, 96.6, 'SI SUMAMOS', 'da 7, pero son 5', 'la unión tiene 5 amigos');
  label(p, t, 97.0, 102.8, 'CARO Y DANI', 'se contaron dos veces', 'están en el cruce');
  label(p, t, 103.0, 109.0, 'LA FÓRMULA', 'lo común, una sola vez', 'n(A) + n(B), menos los del cruce');
};
FILM.summary = (p, t) => summaryList(p, t, 109.8, 'En resumen', [
  ['UNIÓN · «O»', ['A', { s: 'cup' }, 'B', ': en A o en B']],
  ['INTERSECCIÓN · «Y»', ['A', { s: 'cap' }, 'B', ': en los dos']],
  ['DIFERENCIA', ['A', '−', 'B', ': en A, pero no en B']],
  ['COMPLEMENTO', ['A', { sup: 'c' }, ': lo que no está en A']],
  ['SIMÉTRICA', ['A', { s: 'tri' }, 'B', ': en uno solo']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 6.8, type: 'pop', i: 0 }, { t: 12.6, type: 'lasso', d: .8 }, { t: 18.8, type: 'lasso', d: .8 }];
  KIDS.forEach((n, i) => ev.push({ t: MOVE[n], type: 'fly', d: .9 }, { t: MOVE[n] + 1.0, type: 'tile', i }));
  ev.push({ t: 20.4, type: 'pop', i: 1 });
  [[33.4, 'paint'], [34.4, 'rise'], [40.6, 'paint'], [41.4, 'rise'], [59.6, 'paint'], [60.6, 'rise'], [66.0, 'paint'], [67.0, 'rise'], [72.4, 'paint'], [73.4, 'rise']].forEach(([t, type]) => ev.push({ t, type, d: .8 }));
  for (let i = 0; i < 4; i++) ev.push({ t: 85.6 + i * .3, type: 'count', i });
  for (let i = 0; i < 3; i++) ev.push({ t: 87.0 + i * .3, type: 'count', i });
  ev.push({ t: 91.6, type: 'rise' }, { t: 93.8, type: 'no' }, { t: 95.8, type: 'hush', d: 1.4 }, { t: 97.8, type: 'fly', d: 1.0 }, { t: 98.8, type: 'merge', i: 0 }, { t: 98.95, type: 'merge', i: 1 });
  ev.push({ t: 99.0, type: 'card' }, { t: 103.2, type: 'rise' }, { t: 109.2, type: 'away', d: .6 }, { t: 109.8, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 110.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 113.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Siete amigos comparten el patio.'],
  [4.0, 6.4, 'Ahí están: Ana y los demás.'],
  [6.8, 9.4, 'Todos juntos forman el universo, U.'],
  [9.6, 12.2, 'Es todo lo que vamos a estudiar.'],
  [12.8, 15.6, 'A: los que juegan fútbol.'],
  [15.8, 18.4, 'Ana, Beto, Caro y Dani.'],
  [19.0, 21.6, 'B: los que tocan un instrumento.'],
  [21.8, 24.4, 'Caro, Dani y Eva.'],
  [24.8, 27.6, 'Caro y Dani van en el cruce.'],
  [27.8, 30.2, 'Fede y Gabi, en ninguno.'],
  [32.8, 35.6, 'La unión junta los dos conjuntos.'],
  [35.8, 38.8, 'Está en A o en B: cinco amigos.'],
  [40.0, 42.8, 'La intersección se queda con lo común.'],
  [43.0, 46.0, 'Está en A y en B: Caro y Dani.'],
  [46.4, 49.2, '«O» junta: la unión crece.'],
  [49.4, 52.0, '«Y» filtra: la intersección se achica.'],
  [52.6, 56.0, 'Ahora miremos lo que sobra.'],
  [59.0, 62.0, 'A menos B: en A, pero no en B.'],
  [62.2, 65.0, 'Quedan Ana y Beto.'],
  [65.4, 68.4, 'Complemento de A: lo que no está en A.'],
  [68.6, 71.4, 'Eva, Fede y Gabi.'],
  [71.8, 74.8, 'La diferencia simétrica: lo que está en uno solo.'],
  [75.0, 78.0, 'Ana, Beto y Eva. Caro y Dani no.'],
  [78.6, 82.0, 'Y ahora, a contar.'],
  [85.0, 87.6, 'A tiene cuatro elementos; B tiene tres.'],
  [87.8, 90.8, 'Eso es n de A y n de B.'],
  [91.0, 93.8, 'Si sumamos, cuatro más tres da siete.'],
  [94.0, 96.6, 'Pero en la unión solo hay cinco.'],
  [97.0, 100.0, 'Caro y Dani se contaron dos veces.'],
  [100.2, 102.8, 'Hay que restar los dos comunes: queda cinco.'],
  [102.9, 106.6, 'Es n de A más n de B, menos n del cruce.'],
  [106.8, 109.6, 'Así lo común se cuenta una sola vez.'],
  [110.2, 114.6, 'Unión, intersección, diferencias y complemento:'],
  [114.8, 119.0, 'cada operación es una manera de leer el diagrama.'],
];
