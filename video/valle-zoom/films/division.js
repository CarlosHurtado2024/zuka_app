// «División e igualdad de polinomios» (lección alg-23b de Zuka, Cordillera Cúbica, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): 47 = 5 · 9 + 2, los bloques
// x² + 6x + 10 = (x + 2)(x + 4) + 2, la división larga de la cordillera P(x) = x³ − 2x² − 5x + 6 entre x − 1 (cociente
// x² − x − 6, residuo 0) y la misma cuenta por igualdad de coeficientes: (x − 1)(x² + ax + b) da a = −1 y b = −6.
// Hilo (docs/storytelling-videos.md): Ana dibuja el perfil de una cordillera; la vía del tren va a altura 0 y la montaña la
// cruza en x = 1. Quiere quitar ese cruce: dividir entre x − 1. Sorpresa anunciada: al final no hará falta dividir.
// Cierre: sin ese cruce queda x² − x − 6, que cruza la vía en −2 y 3.
// Niveles: 0 la cordillera → 1 por 47 ÷ 5: dividir con números y con bloques → 2 por P: la división larga → 3 por
// (x − 1)(x² + ax + b): igualar coeficientes.
const POSTER = 74.0;
const SP = s => ({ sup: s });
const P = x => x ** 3 - 2 * x * x - 5 * x + 6;
const PT = ['x', SP('3'), '− 2x', SP('2'), '− 5x + 6'];

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1440], r: 110, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [470, 1440], r: 190, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [460, 1440], r: 200, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 900], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'con números', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'la división', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'igualar', L: [330, 1560] },
  ],
  stops: ['la cordillera', 'con números', 'por pasos', 'igualar'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[78.8, 80.4], [107.8, 109.4], [119.0, 135]],
    wides: [[24.8, 26.2], [44.6, 46.0]],
    looks: [],
  },
};

// un trencito sobre la vía: (x, y) = centro de las ruedas
function train(p, x, y, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'rect', { x: x - 70, y: y - 62, width: 110, height: 50, rx: 12 }, C.coral, C.coralD, 4, 4);
  shaded(S, 'rect', { x: x + 30, y: y - 86, width: 44, height: 74, rx: 10 }, C.sun, C.sunD, 4, 4);
  el('rect', { x: x + 40, y: y - 76, width: 24, height: 22, rx: 5, fill: C.night }, S);
  for (const dx of [-46, -6, 52]) el('circle', { cx: x + dx, cy: y - 10, r: 13, fill: C.night }, S);
}

// ---------- nivel 0 · la cordillera ----------
const M0 = { ox: 480, oy: 900, s: 130, sy: 45 };
function level0(G, t) {
  starField(G, 141, 150);
  rail(G, t, 0.6, M0, -2.4, 3.5);
  ridge(G, M0, P, -2.4, 3.5, eio(seg(t, 1.0, 3.6)), -7.4, 8.4);
  const tx = mx(M0, lerp(-2.2, 0.55, eio(seg(t, 5.0, 11.6))));
  train(G, tx, M0.oy, pop(t, 4.6) * out(t, 18.6));
  const k1 = pop(t, 12.8);
  if (k1 > 0.01) {
    el('circle', { cx: mx(M0, 1), cy: M0.oy, r: r1(16 * k1), fill: C.sun }, G);
    lasso(G, mx(M0, 1), M0.oy, 36, 36, eio(seg(t, 13.0, 13.8)), C.sun, 6);
  }
  tag(G, mx(M0, 1) + 24, M0.oy + 58, 'x = 1', k1, C.sun, 38, 'start');
  riseFormula(G, t, 9.8, 999, 520, 1320, 44, ['P(x)', '=', ...PT], { colors: {} });
  const kq = life(t, 19.0, 24.4);
  if (kq > 0.01) chip(G, 460, 1440, '¿P(x) ÷ (x − 1)?', kq, NEG, C.night, 40);
  fchip(G, 540, 1440, ['47 ÷ 5'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 48);
}
// ---------- nivel 1 · dividir con números y con bloques ----------
function level1(G, t) {
  starField(G, 143, 90);
  fchip(G, 540, 700, ['47 ÷ 5'], out(t, 32.4), ZERO, 48);
  const kd = 1 - eio(seg(t, 40.6, 41.0));
  if (kd > 0.01) {
    const Q = scaleAt(G, 540, 1000, kd);
    for (let c = 0; c < 9; c++) for (let r = 0; r < 5; r++) {
      const k = pop(t, 32.2 + c * .16 + r * .03); if (k <= 0.01) continue;
      el('circle', { cx: 230 + c * 70, cy: 900 + r * 44, r: r1(15 * k), fill: C.sun }, Q);
    }
    for (let c = 0; c < 9; c++) { const k = eio(seg(t, 35.2 + c * .1, 35.6 + c * .1)); if (k > 0.01) el('rect', { x: 203 + c * 70, y: 874, width: 54, height: r1(228 * k), rx: 20, fill: 'none', stroke: C.sunD, 'stroke-width': 4 }, Q); }
    for (let j = 0; j < 2; j++) { const k = pop(t, 36.4 + j * .2); if (k > 0.01) el('circle', { cx: 880 + j * 0, cy: 960 + j * 70, r: r1(15 * k), fill: C.coral }, Q); }
    riseFormula(Q, t, 35.0, 999, 540, 1230, 64, ['47', '=', '5 · 9', '+ 2'], { colors: { '+ 2': C.coral } });
    tag(Q, 540, 1310, 'lo que sobra, 2, es menor que 5', pop(t, 37.4), C.mist, 36);
  }
  // bloques: x² + 6x + 10 = (x + 2)(x + 4) + 2
  const X = 200, U = 50, x0 = 300, y0 = 720;
  blk(G, x0, y0, X, X, pop(t, 41.4), SKY, ['x', SP('2')], 50);
  for (let j = 0; j < 2; j++) blk(G, x0 + X + j * U, y0, U, X, pop(t, 42.0 + j * .2), MINT, null);
  for (let r = 0; r < 4; r++) blk(G, x0, y0 + X + r * U, X, U, pop(t, 42.4 + r * .15), MINT, null);
  for (let r = 0; r < 4; r++) for (let j = 0; j < 2; j++) blk(G, x0 + X + j * U, y0 + X + r * U, U, U, pop(t, 43.0 + r * .1 + j * .05), ZERO, null);
  for (let j = 0; j < 2; j++) blk(G, 720 + j * 70, 1010, U, U, pop(t, 44.6 + j * .2), NEG, null);
  const kl = pop(t, 44.8);
  tag(G, x0 + (X + 2 * U) / 2, y0 - 22, 'x + 2', kl, C.cream, 40);
  tag(G, x0 - 20, y0 + (X + 4 * U) / 2 + 14, 'x + 4', kl, C.cream, 40, 'end');
  tag(G, 780, 1100, 'sobran 2', pop(t, 45.2), C.coral, 36);
  riseFormula(G, t, 47.6, 999, 540, 1290, 46, ['x', SP('2'), '+ 6x + 10', '=', '(x + 2)(x + 4)', '+ 2'], { colors: { '+ 2': C.coral } });
  tag(G, 540, 1210, 'dividendo = divisor · cociente + residuo', pop(t, 50.6), C.mist, 34);
  fchip(G, 470, 1440, PT, pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 42);
}
// ---------- nivel 2 · la división larga ----------
function level2(G, t) {
  starField(G, 145, 90);
  fchip(G, 540, 700, PT, out(t, 61.0), SKY, 42);
  const kr = 1 - eio(seg(t, 80.6, 81.0));
  if (kr > 0.01) {
    const Q = scaleAt(G, 540, 1050, kr);
    tag(Q, 540, 790, 'entre x − 1', pop(t, 60.6), C.cream, 44);
    [[880, 'cociente'], [1030, 'falta'], [1180, 'se resta']].forEach(([y, s], i) => tag(Q, 130, y, s, pop(t, 60.8 + i * .2), C.mist, 34, 'start'));
    const QX = 330, F = { colors: {}, anchor: 'start' };
    riseFormula(Q, t, 62.8, 68.4, QX, 880, 50, ['x', SP('2')], F);
    riseFormula(Q, t, 68.8, 74.4, QX, 880, 50, ['x', SP('2'), '− x'], F);
    riseFormula(Q, t, 74.8, 999, QX, 880, 50, ['x', SP('2'), '− x − 6'], { ...F, fill: C.sun });
    riseFormula(Q, t, 60.4, 66.0, QX, 1030, 50, PT, F);
    riseFormula(Q, t, 66.4, 72.0, QX, 1030, 50, ['−x', SP('2'), '− 5x + 6'], F);
    riseFormula(Q, t, 72.4, 78.0, QX, 1030, 50, ['−6x + 6'], F);
    riseFormula(Q, t, 78.4, 999, QX, 1030, 50, ['0'], { ...F, fill: C.mint });
    riseFormula(Q, t, 64.4, 68.4, QX, 1180, 44, ['x', SP('2'), '(x − 1)', '=', 'x', SP('3'), '− x', SP('2')], F);
    riseFormula(Q, t, 70.4, 74.4, QX, 1180, 44, ['−x(x − 1)', '=', '−x', SP('2'), '+ x'], F);
    riseFormula(Q, t, 76.4, 80.4, QX, 1180, 44, ['−6(x − 1)', '=', '−6x + 6'], F);
  }
  riseFormula(G, t, 81.2, 999, 540, 960, 52, ['P(x)', '=', '(x − 1)(x', SP('2'), '− x − 6)'], { colors: {} });
  const kf = pop(t, 82.6);
  if (kf > 0.01) chip(G, 540, 1090, 'residuo 0: x − 1 es un factor', kf, MINT, C.night, 40);
  fchip(G, 460, 1440, ['(x − 1)(x', SP('2'), '+ ax + b) + r'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 42);
}
// ---------- nivel 3 · igualar coeficientes ----------
const M3 = { ox: 500, oy: 1150, s: 88, sy: 28 };
function level3(G, t) {
  starField(G, 147, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['(x − 1)(x', SP('2'), '+ ax + b) + r'], out(t, 96.0), ZERO, 42);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1), col = { '+ (a − 1)x': C.sun, '+ (b − a)x': C.mint, '− b + r': C.coral, '− 2x': C.sun, '− 5x': C.mint, '+ 6': C.coral };
    riseFormula(Q, t, 95.6, 999, 540, 800, 48, ['(x − 1)(x', SP('2'), '+ ax + b)', '+ r'], { colors: {} });
    riseFormula(Q, t, 97.6, 999, 540, 900, 44, ['=', 'x', SP('3'), '+ (a − 1)x', SP('2'), '+ (b − a)x', '− b + r'], { colors: col });
    riseFormula(Q, t, 99.6, 999, 540, 1000, 44, ['P(x)', '=', 'x', SP('3'), '− 2x', SP('2'), '− 5x', '+ 6'], { colors: col });
    const R = [[1110, 'a − 1 = −2: a = −1', ZERO], [1200, 'b − a = −5: b = −6', MINT], [1290, '−b + r = 6: r = 0', NEG]];
    R.forEach(([y, s, c], i) => { const k = pop(t, 102.0 + i * 1.4); if (k > 0.01) chip(Q, 540, y, s, k, c, C.night, 38); });
  }
  // vuelta a la cordillera
  riseFormula(S, t, 108.0, 999, 540, 800, 46, ['P(x)', '=', '(x − 1)(x', SP('2'), '− x − 6)'], { colors: {} });
  tag(S, 540, 870, 'la parábola que queda: y = x² − x − 6', pop(t, 108.6), C.mist, 34);
  rail(S, t, 108.2, M3, -2.4, 3.5);
  ridge(S, M3, x => x * x - x - 6, -2.4, 3.5, eio(seg(t, 108.4, 109.6)), -7.4, 8.4);
  [[-2, C.mint, 111.0], [3, C.mint, 111.4]].forEach(([x, c, t0]) => {
    const k = pop(t, t0); if (k <= 0.01) return;
    el('circle', { cx: mx(M3, x), cy: M3.oy, r: r1(14 * k), fill: c }, S);
    tag(S, mx(M3, x), M3.oy + 60, minus(x), k, c, 38);
  });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Dividir', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'polinomios', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA CORDILLERA DE ANA', 'un polinomio de grado 3', 'la vía va a altura 0');
  label(p, t, 12.8, 18.6, 'UN CRUCE', 'en x = 1', 'la montaña corta la vía');
  label(p, t, 19.0, 24.4, 'LA PREGUNTA', 'P(x) ÷ (x − 1)', '¿qué queda sin ese cruce?');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'al final', 'no hará falta dividir');
  label(p, t, 31.8, 37.8, 'CON NÚMEROS', '47 = 5 · 9 + 2', '9 bolsas y sobran 2');
  label(p, t, 38.2, 44.2, 'EL RESIDUO', 'lo que sobra', 'es menor que el divisor');
  label(p, t, 44.6, 50.2, 'CON BLOQUES', 'x² + 6x + 10 entre x + 2', 'alto x + 4 y sobran 2');
  label(p, t, 50.6, 56.6, 'LA DIVISIÓN', 'P = D · Q + R', 'R de grado menor que D');
  label(p, t, 60.0, 66.0, 'POR PASOS', 'lo de mayor grado primero', 'x³ ÷ x = x²');
  label(p, t, 66.4, 72.2, 'MULTIPLICAR Y RESTAR', 'x²(x − 1) = x³ − x²', 'queda −x² − 5x + 6');
  label(p, t, 72.6, 78.4, 'OTRA VEZ', 'va −x, luego −6', 'queda −6x + 6, luego 0');
  label(p, t, 78.8, 84.4, 'RESIDUO CERO', 'x − 1 es un factor', 'P = (x − 1)(x² − x − 6)');
  label(p, t, 84.8, 90.4, 'OTRO CAMINO', 'sin dividir', 'comparar coeficientes');
  label(p, t, 95.4, 101.4, 'IGUALAR', '(x − 1)(x² + ax + b) + r', 'debe dar P(x)');
  label(p, t, 101.8, 107.4, 'MISMOS COEFICIENTES', 'a = −1, b = −6, r = 0', 'si falta un término, va 0');
  label(p, t, 107.8, 114.0, 'LA CORDILLERA DE ANA', 'sin el cruce de x = 1', 'queda x² − x − 6');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['DIVIDIR', ['P', '=', 'D · Q + R']],
  ['EL RESIDUO', 'de grado menor que el divisor'],
  ['RESIDUO CERO', 'el divisor es un factor'],
  ['IGUALDAD', 'mismos coeficientes'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'paint', d: 2.6 }, { t: 4.6, type: 'pop', i: 0 }, { t: 5.0, type: 'slide', d: 6.6 }];
  ev.push({ t: 9.8, type: 'rise' }, { t: 12.8, type: 'pop', i: 1 }, { t: 13.0, type: 'lasso', d: .8 }, { t: 19.0, type: 'card' }, { t: 24.8, type: 'pop', i: 2 });
  for (let c = 0; c < 9; c++) ev.push({ t: 32.2 + c * .16, type: 'tile', i: c % 4 });
  ev.push({ t: 35.0, type: 'rise' }, { t: 36.4, type: 'pop', i: 3 }, { t: 40.6, type: 'away', d: .4 }, { t: 41.4, type: 'tile', i: 0 }, { t: 42.0, type: 'tile', i: 1 }, { t: 42.4, type: 'tile', i: 2 }, { t: 43.0, type: 'tile', i: 3 });
  ev.push({ t: 44.6, type: 'pop', i: 0 }, { t: 47.6, type: 'rise' }, { t: 50.6, type: 'card' }, { t: 52.4, type: 'pop', i: 3 });
  for (const t of [62.8, 64.4, 66.4, 68.8, 70.4, 72.4, 74.8, 76.4]) ev.push({ t, type: 'rise' });
  ev.push({ t: 78.4, type: 'yes' }, { t: 80.6, type: 'away', d: .4 }, { t: 81.2, type: 'rise' }, { t: 82.6, type: 'hit' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 97.6, type: 'rise' }, { t: 99.6, type: 'rise' });
  for (let i = 0; i < 3; i++) ev.push({ t: 102.0 + i * 1.4, type: 'pop', i });
  ev.push({ t: 104.8, type: 'yes' }, { t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 108.4, type: 'paint', d: 1.2 }, { t: 110.0, type: 'pop', i: 0 }, { t: 111.0, type: 'pop', i: 1 }, { t: 111.4, type: 'pop', i: 2 });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana dibuja el perfil de una cordillera.'],
  [4.0, 6.6, 'La vía del tren va a altura cero.'],
  [6.8, 9.6, 'El perfil es un polinomio de grado tres.'],
  [9.8, 12.4, 'Lo llama P de x.'],
  [12.8, 15.6, 'Uno de sus cruces: x igual a uno.'],
  [15.8, 18.6, 'Ana quiere quitar ese cruce del polinomio.'],
  [19.0, 21.8, '¿Qué queda si divide entre x menos uno?'],
  [22.0, 24.4, 'Se divide como con números.'],
  [24.8, 29.0, 'Y una sorpresa: al final no hará falta dividir.'],
  [31.8, 34.8, 'Cuarenta y siete caramelos en bolsas de cinco.'],
  [35.0, 37.8, 'Salen nueve bolsas y sobran dos.'],
  [38.2, 41.0, 'Lo que sobra es menor que una bolsa.'],
  [41.4, 44.2, 'Con bloques pasa igual.'],
  [44.6, 47.4, 'Ancho x más dos; sobran dos cuadritos.'],
  [47.6, 50.2, 'El residuo no tiene x: grado menor.'],
  [50.6, 53.6, 'Dividendo: divisor por cociente, más residuo.'],
  [53.8, 56.6, 'Ahora, la cordillera de Ana.'],
  [60.0, 63.0, 'Se divide por pasos, como con números.'],
  [63.2, 66.0, 'x al cubo entre x: x al cuadrado.'],
  [66.4, 69.2, 'Se multiplica y se resta.'],
  [69.4, 72.2, 'Ahora manda menos x al cuadrado: va menos x.'],
  [72.6, 75.4, 'Queda menos seis x más seis.'],
  [75.6, 78.4, 'Va menos seis, y se resta otra vez.'],
  [78.8, 81.6, 'Residuo: cero. No sobra nada.'],
  [81.8, 84.4, 'x menos uno cabe justo: es un factor.'],
  [84.8, 87.6, 'Pero hay un camino sin dividir:'],
  [87.8, 90.4, 'comparar los coeficientes.'],
  [95.4, 98.4, 'P: x menos uno por una parábola, más r.'],
  [98.6, 101.4, 'Se multiplica y se compara con P.'],
  [101.8, 104.6, 'Dos polinomios iguales tienen los mismos coeficientes.'],
  [104.8, 107.4, 'a, menos uno; b, menos seis; r, cero.'],
  [107.8, 110.6, 'Mismo cociente, residuo cero, sin dividir.'],
  [110.8, 114.0, 'Esa parábola corta la vía en menos dos y tres.'],
  [115.4, 119.6, 'Sin el cruce de uno, a la cordillera de Ana'],
  [119.8, 124.4, 'le queda x al cuadrado menos x menos seis.'],
];
