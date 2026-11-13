// «Porcentajes: qué son y cómo se calculan» (lección alg-13 de Zuka, Mercado de las razones, video 4) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (35 de 100 casillas, 9 de 25 con gafas = 36 %, 15 % de 80, 18 de 72,
// 30 es el 40 % de 75, 150 % de 40 y 0.5 % de 2 000), que tests/porcentajes-desde-cero.test.js mantiene fuera de los
// ejercicios. Hilo (docs/storytelling-videos.md): en el mercado todo dice «%»; ¿qué quiere decir?
// Niveles: 0 de cada 100 → 1 por las gafas: parte y todo → 2 por el «?»: tres preguntas → 3 por el 150 %: más de 100 y menos de 1.
const POSTER = 40.6;
const GX0 = 250, GY0 = 560, CS = 58;
const BX0 = 180, BW = 720;

const FILM = {
  DUR: 123, endAt: 108.0,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1370], r: 90, A: [540, 690] },
    { a: 57.4, b: 59.6, P: [540, 1370], r: 75, A: [540, 690] },
    { a: 92.6, b: 94.8, P: [540, 1350], r: 90, A: [540, 690] },
  ],
  open: { Z0: 2.4, C: [GX0 + CS * 2, GY0 + CS * 2], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'parte y todo', L: [330, 1530] },
    { fire: 53.0, lock: 53.6, name: 'tres preguntas', L: [330, 1530] },
    { fire: 88.6, lock: 89.2, name: 'más de 100', L: [330, 1530] },
  ],
  stops: ['de cada 100', 'parte y todo', 'tres preguntas', 'más de 100'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 114.0],
    smiles: [[16.0, 17.6], [40.6, 42.2], [69.4, 71.0], [85.0, 86.6], [112.0, 130]],
    wides: [[96.6, 98.0]],
    looks: [],
  },
};

// ---------- piezas ----------
function glasses(p, x, y, s, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), A = { fill: 'none', stroke: C.night, 'stroke-width': r1(s * .1) };
  for (const sx of [-1, 1]) el('circle', { ...A, cx: r1(x + sx * s * .32), cy: y, r: r1(s * .24) }, S);
  el('path', { ...A, d: `M${r1(x - s * .1)},${y}Q${x},${r1(y - s * .1)} ${r1(x + s * .1)},${y}` }, S);
}
function head(p, x, y, s, k, gl, col) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  el('circle', { cx: x, cy: y, r: r1(s * .42), fill: col }, S);
  if (gl > 0.01) glasses(S, x, y - s * .04, s * .8, gl);
}
function bigGlasses(p, x, y, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  for (const sx of [-1, 1]) { el('circle', { cx: x + sx * 62, cy: y, r: 46, fill: C.blue }, S); el('circle', { cx: x + sx * 62, cy: y, r: 46, fill: 'none', stroke: C.cream, 'stroke-width': 12 }, S); }
  el('path', { d: `M${x - 18},${y - 4}Q${x},${y - 22} ${x + 18},${y - 4}`, fill: 'none', stroke: C.cream, 'stroke-width': 10 }, S);
}

// ---------- nivel 0 · de cada 100 ----------
function level0(G, t) {
  starField(G, 7, 150);
  const n = Math.round(kf(t, [[12.8, 0], [14.6, 35], [18.8, 35], [19.4, 50], [20.8, 50], [21.4, 25], [22.8, 25], [23.4, 10], [24.6, 10], [25.4, 100]]));
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10, k = t < 7 ? (r < 4 && c < 4 ? 1 : 0) : pop(t, 6.6 + (r + c) * .05);
    if (k <= 0.01) continue;
    const x = GX0 + c * CS + CS / 2, y = GY0 + r * CS + CS / 2, w = (CS - 8) * k;
    el('rect', { x: r1(x - w / 2), y: r1(y - w / 2), width: r1(w), height: r1(w), rx: 8, fill: i < n ? C.sun : C.n3 }, G);
  }
  riseFormula(G, t, 14.8, 18.6, 540, 1280, 72, ['35 %', '=', { fr: ['35', '100'] }, '=', '0.35'], { colors: { '35 %': C.sun } });
  riseFormula(G, t, 19.2, 20.8, 540, 1280, 72, [{ fr: ['1', '2'] }, '=', '50 %']);
  riseFormula(G, t, 21.2, 22.8, 540, 1280, 72, [{ fr: ['1', '4'] }, '=', '25 %']);
  riseFormula(G, t, 23.2, 24.6, 540, 1280, 72, [{ fr: ['1', '10'] }, '=', '10 %']);
  riseFormula(G, t, 25.0, 999, 540, 1280, 72, ['el todo', '=', '100 %'], { colors: { '100 %': C.sun } });
  bigGlasses(G, 540, 1370, pop(t, 24.8) * .7 * (1 + .1 * wob(t, 25.2, 14, 6)));
}
// ---------- nivel 1 · parte y todo ----------
function level1(G, t) {
  starField(G, 17, 90);
  bigGlasses(G, 540, 690, 1);
  const m = eio(seg(t, 38.2, 39.4));
  for (let q = 0; q < 4; q++) for (let i = 0; i < 25; i++) {
    const r = Math.floor(i / 5), c = i % 5;
    const k = q === 0 ? pop(t, 32.0 + i * .03) : pop(t, 38.8 + q * .3 + i * .01);
    if (k <= 0.01) continue;
    const x0 = 400 + c * 70, y0 = 840 + r * 70;
    const x1 = 260 + (q % 2) * 290 + c * 52, y1 = 790 + Math.floor(q / 2) * 215 + r * 40;
    const x = q === 0 ? lerp(x0, x1, m) : x1, y = q === 0 ? lerp(y0, y1, m) : y1, s = q === 0 ? lerp(62, 40, m) : 40;
    head(G, x, y, s, k, i < 9 ? pop(t, 33.4 + i * .08) : 0, i < 9 ? C.sun : C.mist);
  }
  riseFormula(G, t, 34.0, 38.0, 540, 1270, 70, [{ fr: ['9', '25'] }]);
  riseFormula(G, t, 39.6, 44.0, 540, 1270, 64, [{ fr: ['9', '25'] }, '=', { fr: ['36', '100'] }, '=', '36 %'], { colors: { '36 %': C.sun } });
  riseFormula(G, t, 44.4, 50.0, 540, 1270, 64, ['9 ÷ 25', '=', '0.36', '=', '36 %'], { colors: { '36 %': C.sun } });
  riseFormula(G, t, 50.4, 999, 540, 1270, 68, [{ fr: ['parte', 'todo'] }, '=', { fr: ['p', '100'] }], { fill: C.sun });
  tile(G, 540, 1370, 100, '?', pop(t, 52.4) * (1 + .12 * wob(t, 53.0, 14, 6)), NEG, C.night);
}
// ---------- nivel 2 · tres preguntas ----------
function level2(G, t) {
  starField(G, 29, 90);
  tile(G, 540, 690, 100, '?', out(t, 61.0), NEG, C.night);
  const Y = 820, H = 90;
  // 15 % de 80
  const k1 = pop(t, 59.8) * out(t, 71.8);
  if (k1 > 0.01) {
    partBar(G, BX0, Y, BW, H, 20, 2, k1, eio(seg(t, 61.6, 62.4)), C.mint);
    partBar(G, BX0, Y, BW, H, 20, 3, k1, eio(seg(t, 63.0, 63.6)) * 1, C.sun, 'transparent');
    partBar(G, BX0, Y, BW, H, 20, 2, k1, eio(seg(t, 61.6, 62.4)), C.mint, 'transparent');
    tag(G, BX0 + BW, Y - 26, '80', k1, C.cream, 46, 'end');
    tag(G, BX0 + BW * .05, Y - 26, '10 % = 8', pop(t, 62.2) * k1, C.mint, 38, 'start');
    tag(G, BX0 + BW * .125, Y + H + 52, '5 % = 4', pop(t, 63.4) * k1, C.sun, 38, 'start');
  }
  riseFormula(G, t, 64.0, 71.6, 540, 1080, 66, ['15 % de 80', '=', '8 + 4', '=', '12'], { colors: { '12': C.sun } });
  riseFormula(G, t, 66.4, 71.6, 540, 1190, 62, ['80 · 0.15', '=', '12']);
  // 18 de 72
  const k2 = pop(t, 72.2) * out(t, 78.2);
  if (k2 > 0.01) { partBar(G, BX0, Y, BW, H, 4, 1, k2, eio(seg(t, 73.6, 74.4)), C.sun); tag(G, BX0 + BW, Y - 26, '72', k2, C.cream, 46, 'end'); tag(G, BX0 + BW / 8, Y + H / 2 + 16, '18', pop(t, 74.2) * k2, C.night, 44); }
  riseFormula(G, t, 74.6, 78.0, 540, 1080, 62, ['18 de 72', '=', { fr: ['1', '4'] }, '=', '25 %'], { colors: { '25 %': C.sun } });
  // 30 es el 40 % de…
  const k3 = pop(t, 78.6);
  if (k3 > 0.01) {
    partBar(G, BX0, Y, BW, H, 10, 4, k3, eio(seg(t, 79.4, 80.2)), C.sun);
    tag(G, BX0 + BW * .2, Y + H / 2 + 16, '30', pop(t, 80.0), C.night, 44);
    tag(G, BX0 + BW, Y - 26, t < 82.4 ? '?' : '75', k3, t < 82.4 ? C.coral : C.mint, 46, 'end');
  }
  riseFormula(G, t, 80.4, 999, 540, 1080, 62, ['30 ÷ 0.4', '=', '75'], { colors: { '75': C.mint } });
  riseFormula(G, t, 84.6, 999, 540, 1190, 62, ['75 · 0.4', '=', '30'], {});
  badge(G, 800, 1150, pop(t, 85.2), true);
  chip(G, 540, 1350, '150 %', pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, C.night, 56);
}
// ---------- nivel 3 · más de 100, menos de 1 ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 108.0, 108.6)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko), Y = 820, H = 90;
  chip(S, 540, 690, '150 %', out(t, 96.0), ZERO, C.night, 56);
  const k1 = pop(t, 95.6) * out(t, 101.4);
  if (k1 > 0.01) {
    partBar(S, BX0, Y, 480, H, 2, 2, k1, eio(seg(t, 96.4, 97.2)), C.mint);
    partBar(S, BX0 + 488, Y, 240, H, 1, 1, k1, eio(seg(t, 97.8, 98.6)), C.sun);
    tag(S, BX0 + 240, Y - 26, '40 es el 100 %', pop(t, 97.0) * k1, C.mint, 36);
    tag(S, BX0 + 608, Y - 26, '+ 20', pop(t, 98.4) * k1, C.sun, 36);
  }
  riseFormula(S, t, 98.8, 101.2, 540, 1080, 66, ['150 % de 40', '=', '60'], { colors: { '60': C.sun } });
  const k2 = pop(t, 101.6);
  if (k2 > 0.01) {
    partBar(S, BX0, Y, BW, H, 1, 0, k2, 0, C.sun);
    tag(S, BX0 + BW / 2, Y + H / 2 + 16, '2 000', k2, C.mist, 40);
    el('rect', { x: BX0, y: Y, width: 10, height: H, rx: 4, fill: C.sun }, S);
    const kl = eio(seg(t, 102.4, 103.2));
    if (kl > 0.01) {
      el('path', { d: `M${BX0 + 5},${Y + H}L${r1(lerp(BX0 + 5, 380, kl))},${r1(lerp(Y + H, 1010, kl))}`, stroke: C.sun, 'stroke-width': 4 }, S);
      el('circle', { cx: 480, cy: 1060, r: r1(120 * kl), fill: C.n2, stroke: C.sun, 'stroke-width': 6 }, S);
      if (kl > .8) { el('rect', { x: 400, y: 1020, width: 160, height: 80, rx: 10, fill: C.sun }, S); el('rect', { x: 400, y: 1020, width: r1(80 * eio(seg(t, 104.0, 104.6))), height: 80, rx: 10, fill: C.coral }, S); tag(S, 480, 1074, '1 % = 20', 1, C.night, 30); }
    }
  }
  riseFormula(S, t, 104.6, 999, 640, 1230, 58, ['0.5 % de 2 000', '=', '10'], { colors: { '10': C.coral } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Porcentajes', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'de cada cien', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'POR CIENTO', 'quiere decir «de cada 100»', 'aquí hay 100 casillas');
  label(p, t, 12.8, 18.6, 'TREINTA Y CINCO', '35 de las 100 casillas', 'el 35 %: 35/100 = 0.35');
  label(p, t, 19.0, 24.6, 'LOS CONOCIDOS', 'la mitad es el 50 %', 'un cuarto, 25 %; un décimo, 10 %');
  label(p, t, 25.0, 29.0, 'EL TODO', 'las 100 casillas', 'son el 100 %');
  label(p, t, 31.8, 37.8, 'EN EL CURSO DE CARO', '25 estudiantes', '9 usan gafas');
  label(p, t, 38.2, 44.0, 'IMAGINA CUATRO CURSOS', 'como el de Caro: 100 estudiantes', '36 con gafas: el 36 %');
  label(p, t, 44.4, 50.0, 'DIVIDIENDO', '9 entre 25: 0.36', '36 centésimas: 36 %');
  label(p, t, 50.4, 56.6, 'LA PROPORCIÓN', 'parte es a todo', 'como p es a 100');
  label(p, t, 60.0, 65.8, 'LA PARTE', '¿cuánto es el 15 % de 80?', 'el 10 % es 8; el 5 %, 4');
  label(p, t, 66.2, 71.8, 'DOCE', '8 + 4 = 12', 'o de una vez: 80 · 0.15');
  label(p, t, 72.2, 78.2, 'EL PORCENTAJE', '¿qué parte es 18 de 72?', 'la cuarta parte: 25 %');
  label(p, t, 78.6, 84.4, 'EL TODO', '30 es el 40 % de…', '30 ÷ 0.4 = 75');
  label(p, t, 84.8, 90.4, 'COMPRUEBA', 'el 40 % de 75', 'es 30: sí cuadra');
  label(p, t, 95.4, 101.2, 'MÁS DE 100', 'el 100 % de 40 es 40', 'el 150 %, eso más la mitad');
  label(p, t, 101.6, 107.8, 'MENOS DEL 1 %', 'el 1 % de 2 000 es 20', 'el 0.5 %, la mitad: 10');
};
FILM.summary = (p, t) => summaryList(p, t, 108.6, 'En resumen', [
  ['POR CIENTO', '«de cada 100»'],
  ['FRACCIÓN Y DECIMAL', ['35 %', '=', { fr: ['35', '100'] }, '=', '0.35']],
  ['LA PROPORCIÓN', [{ fr: ['parte', 'todo'] }, '=', { fr: ['p', '100'] }]],
  ['SIN LÍMITE', 'más del 100 %, o menos del 1 %'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 6; i++) ev.push({ t: 6.6 + i * .2, type: 'tile', i });
  ev.push({ t: 12.8, type: 'paint', d: 1.8 }, { t: 14.8, type: 'rise' });
  for (const t0 of [19.0, 21.0, 23.0, 24.8]) ev.push({ t: t0, type: 'paint', d: .6 }, { t: t0 + .2, type: 'rise' });
  ev.push({ t: 24.8, type: 'pop', i: 0 });
  ev.push({ t: 32.0, type: 'tile', i: 0 }, { t: 32.4, type: 'tile', i: 1 });
  for (let i = 0; i < 9; i++) ev.push({ t: 33.4 + i * .08, type: 'count', i });
  ev.push({ t: 34.0, type: 'rise' }, { t: 38.2, type: 'slide', d: 1.2 });
  for (let q = 1; q < 4; q++) ev.push({ t: 38.8 + q * .3, type: 'tile', i: q });
  ev.push({ t: 39.6, type: 'rise' }, { t: 40.4, type: 'yes' }, { t: 44.4, type: 'rise' }, { t: 50.4, type: 'rise' }, { t: 52.4, type: 'pop', i: 1 });
  ev.push({ t: 59.8, type: 'line', d: .6 }, { t: 61.6, type: 'paint', d: .8 }, { t: 63.0, type: 'paint', d: .6 }, { t: 64.0, type: 'rise' }, { t: 64.6, type: 'yes' }, { t: 66.4, type: 'rise' });
  ev.push({ t: 71.8, type: 'away', d: .4 }, { t: 72.2, type: 'line', d: .6 }, { t: 73.6, type: 'paint', d: .8 }, { t: 74.6, type: 'rise' });
  ev.push({ t: 78.2, type: 'away', d: .4 }, { t: 78.6, type: 'line', d: .6 }, { t: 79.4, type: 'paint', d: .8 }, { t: 80.4, type: 'rise' }, { t: 82.4, type: 'pop', i: 2 }, { t: 84.6, type: 'rise' }, { t: 85.2, type: 'yes' }, { t: 87.8, type: 'pop', i: 3 });
  ev.push({ t: 95.6, type: 'line', d: .6 }, { t: 96.4, type: 'paint', d: .8 }, { t: 97.8, type: 'paint', d: .8 }, { t: 98.8, type: 'rise' }, { t: 99.4, type: 'yes' });
  ev.push({ t: 101.6, type: 'line', d: .6 }, { t: 102.4, type: 'lasso', d: .8 }, { t: 104.0, type: 'paint', d: .6 }, { t: 104.6, type: 'rise' });
  ev.push({ t: 108.0, type: 'away', d: .6 }, { t: 108.6, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 109.2 + k * .55, type: 'stop', i: k });
  ev.push({ t: 111.8, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'En el mercado, todos los letreros dicen «por ciento».'],
  [4.0, 6.4, '¿Qué quiere decir?'],
  [6.8, 9.6, 'Por ciento quiere decir de cada cien.'],
  [9.8, 12.4, 'Aquí hay cien casillas.'],
  [12.8, 15.6, 'Pintamos 35: el 35 %.'],
  [15.8, 18.6, 'Es 35 sobre 100, o el decimal 0.35.'],
  [19.0, 21.8, 'La mitad es el 50 %; un cuarto, el 25 %.'],
  [22.0, 24.6, 'Un décimo, el 10 %.'],
  [25.0, 29.0, 'Y las cien casillas, el todo, son el cien por ciento.'],
  [31.8, 34.8, 'En el curso de Caro hay veinticinco estudiantes.'],
  [35.0, 37.8, 'Nueve usan gafas: nueve de veinticinco.'],
  [38.2, 41.0, 'Para hablar en porcentaje, llevamos el todo a cien.'],
  [41.2, 44.0, 'Imagina cuatro cursos así: cien, y 36 con gafas.'],
  [44.4, 47.2, 'También se puede dividir: nueve entre veinticinco,'],
  [47.4, 50.0, '0.36: el 36 %.'],
  [50.4, 53.4, 'Todo problema de porcentajes es una proporción:'],
  [53.6, 56.6, 'la parte es al todo como p es a cien.'],
  [60.0, 62.8, 'Primera pregunta: ¿cuánto es el quince por ciento de ochenta?'],
  [63.0, 65.8, 'El 10 % es ocho; el 5 %, la mitad: cuatro.'],
  [66.2, 69.0, 'Juntos, doce.'],
  [69.2, 71.8, 'O de una vez: ochenta por cero punto quince.'],
  [72.2, 75.0, 'Segunda: ¿qué porcentaje es dieciocho de setenta y dos?'],
  [75.2, 78.2, 'Es la cuarta parte: el veinticinco por ciento.'],
  [78.6, 81.4, 'Tercera: treinta es el cuarenta por ciento de un número.'],
  [81.6, 84.4, 'Treinta entre cero punto cuatro: setenta y cinco.'],
  [84.8, 87.6, 'Comprobamos: el cuarenta por ciento de setenta y cinco'],
  [87.8, 90.4, 'es treinta. Sí cuadra.'],
  [95.4, 98.4, 'Un porcentaje puede pasar de cien.'],
  [98.6, 101.2, 'El ciento cincuenta por ciento de cuarenta es sesenta.'],
  [101.6, 104.6, 'Y menor que el 1 %: el 1 % de 2 000 es 20;'],
  [104.8, 107.8, 'el cero punto cinco por ciento, la mitad: diez.'],
  [109.2, 113.4, 'Ahora cada letrero del mercado dice algo claro:'],
  [113.6, 118.0, 'cuántos de cada cien.'],
];
