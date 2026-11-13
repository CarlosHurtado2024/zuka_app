// «Suma geométrica y suma infinita» (lección alg-14d de Zuka, Escalera de Sigma, video 4) en estilo Scale Zoom Explainer.
// Ejemplos (no salen en los ejercicios de la lección): el chocolate de Caro 1/2 + 1/4 + 1/8 + … = 1 (escenas de respaldo),
// el truco de multiplicar por r y restar con 1 + 2 + 4 + … + 512 = 1 023 (respaldo), 0.333… = 1/3 (respaldo) y las sumas que
// no se estabilizan: 1 + 2 + 4 + … y 1 − 1 + 1 − 1 + … (respaldo).
// Hilo (docs/storytelling-videos.md): Caro tiene una barra de chocolate y cada día come la mitad de lo que queda. ¿Se la acaba?
// La sorpresa: infinitos pedazos suman una cantidad finita. Cierre: nunca la acaba, pero en total come exactamente una barra.
// Niveles: 0 la barra → 1 por 1 + 2 + 4 + …: el truco → 2 por 1/2 + 1/4 + …: la suma infinita → 3 por r = 2: cuando no para.
const POSTER = 70.0;
const BAR = { x: 140, y: 760, w: 800, h: 170 }, CHOC = ['#8A5A3C', '#6E4430'];
const PIECES = [[0, .5, '2'], [.5, .75, '4'], [.75, .875, '8'], [.875, .9375, '16']];
const LX = v => 140 + 800 * v;

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 130, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1385], r: 120, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 90, A: [540, 700] },
  ],
  open: { Z0: 2.4, C: [540, 845], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el truco', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'para siempre', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'cuando no para', L: [330, 1560] },
  ],
  stops: ['la barra', 'el truco', 'suma infinita', 'no para'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[45.0, 46.6], [72.6, 74.2], [119.0, 135]],
    wides: [[44.6, 45.8], [98.6, 100.0]],
    looks: [],
  },
};

// la barra: eaten = cuántos pedazos se ha comido (fraccionario para animar el último)
function chocolate(p, eaten, k, full = false) {
  if (k <= 0.01) return;
  const S = scaleAt(p, BAR.x + BAR.w / 2, BAR.y + BAR.h / 2, k);
  el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: 18, fill: 'none', stroke: C.mist, 'stroke-width': 4, 'stroke-dasharray': '10 8' }, S);
  PIECES.forEach(([a, b], i) => {
    const ke = clamp(eaten - i), x0 = BAR.x + BAR.w * a, w = BAR.w * (b - a);
    if (full) { el('rect', { x: r1(x0 + 3), y: BAR.y + 3, width: r1(w - 6), height: BAR.h - 6, rx: 12, fill: [C.sun, C.mint, C.blue, C.coral][i] }, S); return; }
    if (ke < 1) shaded(S, 'rect', { x: r1(x0 + 3), y: r1(BAR.y + 3 - 60 * ke), width: r1(w - 6), height: BAR.h - 6, rx: 12 }, CHOC[0], CHOC[1], 4, 4);
  });
  const xr = BAR.x + BAR.w * .9375;
  if (full) { for (let j = 0; j < 4; j++) { const a = 1 - Math.pow(.5, 4 + j), b = 1 - Math.pow(.5, 5 + j); el('rect', { x: r1(LX0(a) + 2), y: BAR.y + 3, width: r1(Math.max(2, BAR.w * (b - a) - 3)), height: BAR.h - 6, rx: 3, fill: [C.sun, C.mint, C.blue, C.coral][j % 4] }, S); } }
  else shaded(S, 'rect', { x: r1(xr + 3), y: BAR.y + 3, width: r1(BAR.w * .0625 - 6), height: BAR.h - 6, rx: 8 }, CHOC[0], CHOC[1], 4, 4);
}
const LX0 = v => BAR.x + BAR.w * v;

// ---------- nivel 0 · la barra ----------
function level0(G, t) {
  starField(G, 13, 150);
  const eaten = seg(t, 9.8, 10.4) + seg(t, 12.8, 13.4) + seg(t, 15.8, 16.4) + seg(t, 999, 1000);
  chocolate(G, eaten, pop(t, 1.0));
  PIECES.slice(0, 3).forEach(([a, b, d], i) => {
    const k = pop(t, [10.2, 13.2, 16.2][i]); if (k <= 0.01) return;
    const S = scaleAt(G, LX0((a + b) / 2), 1010, k);
    fracAt(S, LX0((a + b) / 2), 1010, i < 2 ? 46 : 36, '1', d, [C.sun, C.mint, C.blue][i]);
  });
  tag(G, LX0(.9375), 1040, 'queda', pop(t, 22.2), C.cream, 32);
  riseFormula(G, t, 19.0, 999, 540, 1210, 64, [{ fr: ['1', '2'] }, '+', { fr: ['1', '4'] }, '+', { fr: ['1', '8'] }, '=', { fr: ['7', '8'] }], { colors: {} });
  fchip(G, 540, 1385, ['1 + 2 + 4 + …'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 44);
}
// ---------- nivel 1 · el truco ----------
const R1 = [['1', 150], ['2', 290], ['4', 430], ['…', 570], ['256', 710], ['512', 850]];
const R2 = [['2', 290], ['4', 430], ['…', 570], ['256', 710], ['512', 850], ['1024', 990]];
function level1(G, t) {
  starField(G, 23, 90);
  fchip(G, 540, 700, ['1 + 2 + 4 + …'], out(t, 33.0), ZERO, 44);
  const kc = eio(seg(t, 44.6, 45.4));
  tag(G, 60, 834, 'S', pop(t, 32.6), C.sun, 44); tag(G, 60, 944, '2S', pop(t, 38.6), C.sun, 44);
  R1.forEach(([v, x], i) => { const gone = i > 0 ? kc : 0; if (v === '…') dots(G, x, 820, pop(t, 33.0 + i * .2) * (1 - gone)); else chip(G, x, 820, v, pop(t, 33.0 + i * .2) * (1 - .7 * gone), i ? POS : MINT, C.night, 38); });
  R2.forEach(([v, x], i) => { const gone = i < 5 ? kc : 0; if (v === '…') dots(G, x, 930, pop(t, 38.8 + i * .2) * (1 - gone)); else chip(G, x, 930, v, pop(t, 38.8 + i * .2) * (1 - .7 * gone), i === 5 ? ZERO : SKY, C.night, 38); });
  for (let i = 1; i < 6; i++) { const k = eo(seg(t, 44.6 + i * .12, 45.0 + i * .12)) * out(t, 49.6); if (k > 0.01) el('rect', { x: R1[i][1] - 50, y: 872, width: 100, height: 6, rx: 3, fill: C.coral, transform: `rotate(-60 ${R1[i][1]} 875)`, opacity: k.toFixed(2) }, G); }
  riseFormula(G, t, 47.0, 999, 540, 1080, 58, ['S', '=', '2S − S', '=', '1024 − 1', '=', '1023'], { colors: { '1023': C.mint } });
  riseFormula(G, t, 50.6, 999, 540, 1210, 54, ['S', { sub: 'n' }, '=', 'a', { sub: '1' }, '·', '(r', { sup: 'n' }, '− 1) ÷ (r − 1)'], { colors: {} });
  fchip(G, 540, 1385, [{ fr: ['1', '2'] }, '+', { fr: ['1', '4'] }, '+ …'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 46);
}
// ---------- nivel 2 · la suma infinita ----------
const PS = [.5, .75, .875, .9375];
function level2(G, t) {
  starField(G, 37, 90);
  fchip(G, 540, 700, [{ fr: ['1', '2'] }, '+', { fr: ['1', '4'] }, '+ …'], out(t, 61.0), MINT, 46);
  numLine(G, t, 60.2, LX, 940, 0, 1, { plain: true });
  let prev = 0;
  PS.forEach((v, i) => {
    const t0 = 63.0 + i * .9;
    hop(G, LX(prev) + 6, LX(v) - 6, 920, 120 * Math.pow(.6, i), eo(seg(t, t0, t0 + .5)), [C.sun, C.mint, C.blue, C.coral][i], 6);
    prev = v;
    chip(G, [200, 400, 620, 840][i], 1110, String(v), pop(t, t0 + .4) * out(t, 78.4), POS, C.night, 36);
  });
  for (let j = 4; j < 9; j++) { const a = 1 - Math.pow(.5, j), b = 1 - Math.pow(.5, j + 1); hop(G, LX(a), LX(b), 930, 12, eo(seg(t, 66.6 + (j - 4) * .2, 66.8 + (j - 4) * .2)), C.mist, 3); }
  const kq = life(t, 69.4, 78.4); if (kq > 0.01) lasso(G, LX(1), 900, 40, 40, kq, C.sun, 6);
  riseFormula(G, t, 72.6, 78.4, 540, 1240, 56, ['S', { sub: '∞' }, '=', { fr: ['a₁', '1 − r'] }, '=', { fr: ['1/2', '1/2'] }, '=', '1'], { colors: { '1': C.sun } });
  riseFormula(G, t, 78.8, 999, 540, 1110, 52, ['0.333…', '=', { fr: ['3', '10'] }, '+', { fr: ['3', '100'] }, '+', { fr: ['3', '1000'] }, '+ …'], { colors: {} });
  riseFormula(G, t, 82.2, 999, 540, 1240, 56, ['S', { sub: '∞' }, '=', { fr: ['3/10', '1 − 1/10'] }, '=', { fr: ['3/10', '9/10'] }, '=', { fr: ['1', '3'] }], { colors: {} });
  fchip(G, 540, 1385, ['r = 2'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), NEG, 44);
}
// ---------- nivel 3 · cuando no para ----------
const SUMS = [3, 9, 21, 45, 93], ZX = i => 680 + i * 80;
function level3(G, t) {
  starField(G, 49, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['r = 2'], out(t, 96.0), NEG, 44);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const R = scaleAt(S, 540, 1000, k1);
    SUMS.forEach((v, i) => {
      const x = 170 + i * 80, k = pop(t, 96.0 + i * .5); if (k <= 0.01) return;
      const B = scaleAt(R, x, 1250, k), h = v * 4.4;
      shaded(B, 'rect', { x: x - 30, y: 1250 - h, width: 60, height: h, rx: 8 }, C.coral, C.coralD, 4, 4);
      tag(B, x, 1250 - h - 16, String(v), 1, C.cream, 32);
    });
    tag(R, 330, 1310, 'crece sin parar', pop(t, 98.6), C.coral, 38);
    el('rect', { x: 640, y: 1098, width: 360, height: 4, rx: 2, fill: C.n3 }, R);
    tag(R, 640, 912, '1', pop(t, 101.8), C.mist, 34, 'end'); tag(R, 640, 1112, '0', pop(t, 101.8), C.mist, 34, 'end');
    const pts = [0, 1, 2, 3, 4].map(i => [ZX(i), i % 2 ? 1100 : 900]);
    arrowLine(R, pts, eio(seg(t, 102.2, 104.6)), C.sun, 6);
    pts.forEach(([x, y], i) => mark(R, x, y, '', pop(t, 102.2 + i * .55), C.sun));
    tag(R, 820, 1250, 'salta: 1, 0, 1, 0…', pop(t, 104.6), C.sun, 38);
  }
  // vuelta al chocolate
  const kb = pop(t, 108.0);
  if (kb > 0.01) { const B = g(S, { transform: 'translate(0,140)' }); chocolate(B, 0, kb, true); }
  riseFormula(S, t, 109.4, 999, 540, 1240, 52, [{ fr: ['1', '2'] }, '+', { fr: ['1', '4'] }, '+', { fr: ['1', '8'] }, '+ …', '=', '1 barra'], { colors: { '1 barra': C.sun } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Sumas', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'geométricas', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL CHOCOLATE DE CARO', 'cada día, la mitad', 'de lo que queda');
  label(p, t, 12.8, 18.6, 'DÍA A DÍA', 'un medio, un cuarto', 'un octavo…');
  label(p, t, 19.0, 24.4, 'LO QUE LLEVA', 'tres días: siete octavos', 'siempre queda un pedazo');
  label(p, t, 24.8, 29.0, 'UN TRUCO', 'antes de sumar para siempre', 'una suma que crece');
  label(p, t, 31.8, 37.8, 'LA SUMA S', '1 + 2 + 4 + … + 512', 'diez términos, razón 2');
  label(p, t, 38.2, 44.2, 'POR LA RAZÓN', '2S: la misma suma por 2', 'corrida un lugar');
  label(p, t, 44.6, 50.2, 'SE CANCELAN', 'casi todo está en las dos', 'queda 1024 − 1');
  label(p, t, 50.6, 56.6, 'LA FÓRMULA', 'multiplicar por r y restar', 'sirve para cualquier r ≠ 1');
  label(p, t, 60.0, 66.0, 'PARA SIEMPRE', 'cada salto, la mitad del anterior', '0.5, 0.75, 0.875…');
  label(p, t, 66.4, 72.2, 'SE ACERCA A 1', 'cada vez más cerca', 'sin pasarse nunca');
  label(p, t, 72.6, 78.4, 'SUMA INFINITA', 'si la razón está entre −1 y 1', 'primero entre (1 − r)');
  label(p, t, 78.8, 84.4, 'UN DECIMAL', '0.333… es una suma infinita', 'razón un décimo');
  label(p, t, 84.8, 90.4, 'UN TERCIO', '0.333… = 1/3', '¿y si la razón es grande?');
  label(p, t, 95.4, 101.4, 'RAZÓN 2', '3 + 6 + 12 + 24 + …', 'la suma crece sin parar');
  label(p, t, 101.8, 107.4, 'RAZÓN −1', '1 − 1 + 1 − 1…', 'salta entre 1 y 0: diverge');
  label(p, t, 107.8, 114.0, 'VUELTA A LA BARRA', 'infinitos pedazos', 'caben en una barra');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['EL TRUCO', 'por r, restar: casi todo se cancela'],
  ['SUMA FINITA', ['S', { sub: 'n' }, '=', 'a', { sub: '1' }, '·', '(r', { sup: 'n' }, '− 1) ÷ (r − 1)']],
  ['SUMA INFINITA', ['si −1 < r < 1:', 'a', { sub: '1' }, '÷ (1 − r)']],
  ['DIVERGE', 'si r ≥ 1 o r ≤ −1'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'pop', i: 0 }];
  for (const t0 of [9.8, 12.8, 15.8]) ev.push({ t: t0, type: 'fly', d: .6 }, { t: t0 + .4, type: 'pop', i: 1 });
  ev.push({ t: 19.0, type: 'rise' }, { t: 22.2, type: 'pop', i: 2 }, { t: 24.8, type: 'pop', i: 3 });
  for (let i = 0; i < 6; i++) ev.push({ t: 33.0 + i * .2, type: 'tile', i }, { t: 38.8 + i * .2, type: 'tile', i: i + 1 });
  for (let i = 1; i < 6; i++) ev.push({ t: 44.6 + i * .12, type: 'count', i });
  ev.push({ t: 47.0, type: 'rise' }, { t: 47.6, type: 'yes' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 1 });
  for (let i = 0; i < 4; i++) ev.push({ t: 63.0 + i * .9, type: 'slide', d: .5 }, { t: 63.4 + i * .9, type: 'count', i });
  ev.push({ t: 69.4, type: 'lasso', d: .8 }, { t: 72.6, type: 'rise' }, { t: 73.2, type: 'yes' }, { t: 78.8, type: 'rise' }, { t: 82.2, type: 'rise' }, { t: 82.8, type: 'yes' }, { t: 87.8, type: 'pop', i: 2 });
  for (let i = 0; i < 5; i++) ev.push({ t: 96.0 + i * .5, type: 'count', i }, { t: 102.2 + i * .55, type: 'tile', i });
  ev.push({ t: 104.8, type: 'no' }, { t: 108.0, type: 'pop', i: 3 }, { t: 109.4, type: 'rise' }, { t: 110.0, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro tiene una barra de chocolate.'],
  [4.0, 6.4, '¿Algún día se la acabará?'],
  [6.8, 9.6, 'Cada día, la mitad de lo que queda.'],
  [9.8, 12.4, 'El primer día, la mitad.'],
  [12.8, 15.6, 'El segundo, un cuarto.'],
  [15.8, 18.6, 'El tercero, un octavo.'],
  [19.0, 21.8, 'Lleva siete octavos,'],
  [22.0, 24.4, 'y siempre queda un pedazo.'],
  [24.8, 29.0, 'Para sumar sin fin, primero un truco.'],
  [31.8, 34.8, 'Sumemos uno, dos, cuatro… hasta quinientos doce.'],
  [35.0, 37.8, 'Diez términos, cada uno el doble del anterior.'],
  [38.2, 41.0, 'Multiplicamos toda la suma por la razón, dos.'],
  [41.2, 44.2, 'Queda la misma lista, corrida un lugar.'],
  [44.6, 47.4, 'Al restar, casi todo se cancela.'],
  [47.6, 50.2, 'Queda mil veinticuatro menos uno: mil veintitrés.'],
  [50.6, 53.6, 'El truco sirve para cualquier razón distinta de uno.'],
  [53.8, 56.6, '¿Y si sumamos para siempre?'],
  [60.0, 63.0, 'Volvamos al chocolate, sobre una recta.'],
  [63.2, 66.0, 'Cada salto es la mitad del anterior.'],
  [66.4, 69.2, 'La suma se acerca a uno,'],
  [69.4, 72.2, 'cada vez más, sin pasarse nunca.'],
  [72.6, 75.4, 'Con razón entre menos uno y uno,'],
  [75.6, 78.4, 'es el primero entre uno menos r.'],
  [78.8, 81.6, 'Cero punto tres periódico es otra suma infinita:'],
  [81.8, 84.4, 'tres décimos, más tres centésimos, más…'],
  [84.8, 87.6, 'Con razón un décimo, suma un tercio.'],
  [87.8, 90.4, '¿Y si la razón es dos?'],
  [95.4, 98.4, 'Sumemos tres, seis, doce, veinticuatro…'],
  [98.6, 101.4, 'La suma crece sin parar: diverge.'],
  [101.8, 104.6, 'Con razón menos uno, salta: uno, cero, uno…'],
  [104.8, 107.4, 'Tampoco se acerca a un número.'],
  [107.8, 110.6, 'Volvamos a la barra de Caro.'],
  [110.8, 114.0, 'Infinitos pedazos caben en una sola barra.'],
  [115.4, 119.6, 'Si siguiera para siempre, Caro nunca acabaría la barra,'],
  [119.8, 124.4, 'pero lo que come se acerca a una barra entera: la suma vale uno.'],
];
