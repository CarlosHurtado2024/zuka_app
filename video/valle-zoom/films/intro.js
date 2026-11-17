// «Bienvenido a Álgebra»: video de presentación del curso de Álgebra de Zuka, en estilo Scale Zoom Explainer, con capturas
// reales de la app (tools/capture-intro.mjs → shots/intro/) dentro de un celular.
// Hilo (docs/storytelling-videos.md): el álgebra parece una lista de fórmulas; aquí es un viaje. Un solo zoom recorre la app:
// 0 la ruta (recorrido guiado y los diez mundos) → 1 por el Mundo 1: un mundo (camino de niveles, resumen en PDF, jefe y
// evaluación) → 2 por un nivel: una lección (video y ejercicios que son juegos, pista) → 3 por Clips: más allá (curiosidades,
// racha y XP) y el primer paso. Cierre: lo que parecía una lista de fórmulas es un mapa de diez mundos.
const POSTER = 58.0;
const SH = n => 'shots/intro/' + n + '.jpg';
const GAMES = ['juego-alg-0c-2', 'juego-alg-12-1', 'juego-alg-21a-1', 'juego-alg-4-0', 'juego-alg-71-0', 'juego-alg-11-0', 'juego-alg-0a-0', 'juego-alg-14-2'];

const FILM = {
  DUR: 108, endAt: 92.0,
  DT: [[22.2, 24.4], [46.4, 48.6], [72.4, 74.6]],
  dives: () => [
    { a: 22.2, b: 24.4, P: [460, 842], r: 130, A: [540, 700] },
    { a: 46.4, b: 48.6, P: [470, 1092], r: 130, A: [540, 700] },
    { a: 72.4, b: 74.6, P: [470, 1100], r: 110, A: [540, 700] },
  ],
  open: { Z0: 1.8, C: [470, 1060], t1: 3.6, t2: 5.8 },
  aim: [
    { fire: 19.2, lock: 19.6, name: 'Mundo 1', L: [330, 1560] },
    { fire: 43.2, lock: 43.6, name: 'una lección', L: [330, 1560] },
    { fire: 69.4, lock: 69.8, name: 'Clips', L: [330, 1560] },
  ],
  stops: ['tu ruta', 'un mundo', 'una lección', 'y más'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 52.8, 59.6, 64.8, 79.0, 85.4, 98.0],
    smiles: [[56.0, 57.6], [87.4, 89.0], [96.0, 108]],
    wides: [[12.8, 14.2], [31.2, 32.6]],
    looks: [],
  },
  preload: ['home', 'tour-1', 'tour-3', 'tour-4', 'mundos-1', 'mundos-2', 'mundos-3', 'mundos-4', 'mundo', 'mundo-fin', 'jefe', 'evaluacion',
    'pdf-1', 'pdf-3', 'leccion-video', 'leccion-video-2', 'pista', 'clips', 'clips-2', 'progreso', 'racha', ...GAMES].map(SH),
};

// ---------- el celular ----------
const PH = { cx: 470, cy: 1060, h: 1040 }, PW = h => h * 390 / 844;
const sx = (fx, o = PH) => o.cx - PW(o.h) / 2 + fx * PW(o.h), sy = (fy, o = PH) => o.cy - o.h / 2 + fy * o.h;
function img(p, url, x, y, w, h, op = 1) {
  el('image', { href: IMG[url] || url, x: r1(x), y: r1(y), width: r1(w), height: r1(h), preserveAspectRatio: 'xMidYMid slice', opacity: op }, p);
}
// el celular con una lista de pantallas [[t0, nombre], …]: la nueva entra deslizándose desde la derecha
function phone(p, t, k, list, o = PH, op = 1) {
  if (k <= 0.01) return;
  const w = PW(o.h), h = o.h, x0 = o.cx - w / 2, y0 = o.cy - h / 2;
  const S = g(scaleAt(p, o.cx, o.cy, k), op < 1 ? { opacity: op } : {});
  el('rect', { x: r1(x0 - 16), y: r1(y0 - 16), width: r1(w + 32), height: r1(h + 32), rx: r1(h * .062), fill: '#0B0D27', stroke: C.n3, 'stroke-width': 4 }, S);
  const scr = g(S, { 'clip-path': clipOf('rect', { x: r1(x0), y: r1(y0), width: r1(w), height: r1(h), rx: r1(h * .048) }) });
  let i = 0; while (i + 1 < list.length && t >= list[i + 1][0]) i++;
  const e = eio(seg(t, list[i][0], list[i][0] + .5));
  if (i > 0 && e < 1) img(scr, SH(list[i - 1][1]), x0 - w * .3 * e, y0, w, h);
  img(scr, SH(list[i][1]), x0 + w * (1 - e) * (i > 0 ? 1 : 0), y0, w, h);
}
// una hoja del PDF, un poco girada
function paper(p, x, y, w, k, name, rot) {
  if (k <= 0.01) return;
  const h = w * 1.414, S = g(scaleAt(p, x, y, k), { transform: `rotate(${rot} ${x} ${y})` });
  el('rect', { x: r1(x - w / 2 + 10), y: r1(y - h / 2 + 14), width: r1(w), height: r1(h), rx: 10, fill: '#000', opacity: .35 }, S);
  img(S, SH(name), x - w / 2, y - h / 2, w, h);
}
const ring = (p, fx, fy, rx, ry, k, col = C.sun) => lasso(p, sx(fx), sy(fy), rx, ry, k, col, 6);

// ---------- nivel 0 · la ruta ----------
function level0(G, t) {
  starField(G, 251, 150);
  phone(G, t, pop(t, 0.6), [[0, 'home'], [6.6, 'tour-1'], [8.6, 'tour-3'], [10.6, 'tour-4'], [12.6, 'mundos-1'], [14.2, 'mundos-2'], [15.6, 'mundos-3'], [17.0, 'mundos-4'], [18.4, 'mundos-1']]);
  fchip(G, 460, 842, ['Pradera de Venn'], pop(t, 19.0) * (1 + .1 * wob(t, 19.6, 14, 6)), MINT, 40);
}
// ---------- nivel 1 · un mundo ----------
function level1(G, t) {
  starField(G, 253, 90);
  phone(G, t, pop(t, 24.4), [[24.4, 'mundo'], [28.0, 'mundo-fin'], [37.4, 'jefe'], [40.4, 'evaluacion'], [42.4, 'mundo']]);
  fchip(G, 540, 700, ['Pradera de Venn'], out(t, 25.6), MINT, 40);
  ring(G, .5, .82, 210, 60, eio(seg(t, 31.0, 31.8)) * out(t, 37.0), C.sun);
  const kp = 1 - eio(seg(t, 36.8, 37.2));
  paper(G, 820, 900, 340, pop(t, 31.8) * kp, 'pdf-1', 6);
  paper(G, 760, 1180, 340, pop(t, 33.4) * kp, 'pdf-3', -5);
  fchip(G, 470, 1092, ['Nivel 1-1'], pop(t, 42.8) * (1 + .1 * wob(t, 43.8, 14, 6)), ZERO, 46);
}
// ---------- nivel 2 · una lección ----------
function level2(G, t) {
  starField(G, 255, 90);
  fchip(G, 540, 700, ['Nivel 1-1'], out(t, 49.8), ZERO, 46);
  const kv = 1 - eio(seg(t, 54.8, 55.2));
  if (kv > 0.01) phone(G, t, pop(t, 48.6) * kv, [[48.6, 'leccion-video'], [52.0, 'leccion-video-2']]);
  // carrusel de juegos: uno al centro y los vecinos a los lados
  if (t > 55.0 && t < 67.8) {
    const u = clamp((t - 55.2) / 1.5, 0, GAMES.length - 1), i = Math.floor(u), f = eio(clamp((u - i) * 3)), pos = i + f;
    const ko = pop(t, 55.0) * (1 - eio(seg(t, 67.2, 67.6)));
    GAMES.map((n, j) => [n, j - pos]).filter(([, r]) => Math.abs(r) < 1.6).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).forEach(([n, r]) => {
      const a = Math.min(1, Math.abs(r)), o = { cx: 470 + r * 420, cy: 1060, h: lerp(1040, 680, a) };
      phone(G, t, ko, [[0, n]], o, 1 - .55 * a);
    });
  }
  // un dedo que toca el juego del centro
  if (t > 55.4 && t < 67.2) { const e = ((t - 55.2) % 1.5) / 1.5, k = seg(e, .35, .9); if (k > 0 && k < 1) { el('circle', { cx: 470, cy: 1180, r: r1(16 + 70 * k), fill: 'none', stroke: C.cream, 'stroke-width': 6, opacity: r1(1 - k) }, G); el('circle', { cx: 470, cy: 1180, r: 18, fill: C.cream, opacity: r1(.8 * (1 - k)) }, G); } }
  if (t > 67.4) phone(G, t, pop(t, 67.4), [[67.4, 'pista']]);
  ring(G, .5, .29, 210, 64, eio(seg(t, 68.4, 69.2)) * out(t, 72.2), C.sun);
  fchip(G, 470, 1100, ['Clips'], pop(t, 69.2) * (1 + .1 * wob(t, 69.8, 14, 6)), NEG, 50);
}
// ---------- nivel 3 · y más: clips, progreso y el primer paso ----------
function level3(G, t) {
  starField(G, 257, 90);
  const ko = 1 - eio(seg(t, 92.0, 92.6)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  phone(S, t, pop(t, 74.6), [[74.6, 'clips'], [78.0, 'clips-2'], [81.2, 'progreso'], [84.2, 'racha'], [87.2, 'home']]);
  fchip(S, 540, 700, ['Clips'], out(t, 75.8), NEG, 50);
  ring(S, .73, .045, 130, 34, eio(seg(t, 81.8, 82.6)) * out(t, 84.0), C.sun);
  ring(S, .5, .52, 220, 52, eio(seg(t, 87.6, 88.4)), C.mint);
  const kc = pop(t, 88.6);
  if (kc > 0.01) chip(S, 470, 515, 'Empieza: Mundo 1 · Pradera de Venn', kc, MINT, C.night, 36);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Bienvenido a', { 'font-size': 100, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'Álgebra', { 'font-size': 96, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL RECORRIDO', 'la app en un minuto', 'sale la primera vez');
  label(p, t, 12.8, 18.4, '10 MUNDOS', 'un camino por el curso', 'cada mundo, un tema');
  label(p, t, 18.8, 22.0, 'MUNDO 1', 'Pradera de Venn', null);
  label(p, t, 25.0, 30.8, 'UN MUNDO', 'un camino de niveles', 'cada nivel, una lección');
  label(p, t, 31.2, 37.0, 'RESUMEN EN PDF', 'teoría y gráficas', 'y un taller de 10 ejercicios');
  label(p, t, 37.4, 43.2, 'JEFE Y EVALUACIÓN', 'el jefe se vence pensando', 'la evaluación te orienta');
  label(p, t, 43.6, 46.2, 'UN NIVEL', 'video y ejercicios', null);
  label(p, t, 49.0, 54.8, 'EL VIDEO', 'intuición primero', 'la fórmula después');
  label(p, t, 55.2, 61.0, 'LOS EJERCICIOS', 'son juegos', 'construyes y comparas');
  label(p, t, 61.4, 67.2, 'SIN PRISA', 'el juego hace las cuentas', 'tú piensas la idea');
  label(p, t, 67.6, 72.0, 'LA PISTA', 'te orienta', 'sin darte la respuesta');
  label(p, t, 75.0, 80.8, 'CLIPS', 'datos curiosos', 'de matemáticas y ciencia');
  label(p, t, 81.2, 87.0, 'TU PROGRESO', 'racha, XP y vidas', 'y una meta diaria');
  label(p, t, 87.4, 92.0, 'TU PRIMER PASO', 'Mundo 1', 'Pradera de Venn');
};
FILM.summary = (p, t) => summaryList(p, t, 92.6, 'Tu curso', [
  ['RECORRIDO', 'la app en un minuto'],
  ['10 MUNDOS', 'un camino por el álgebra'],
  ['LECCIONES', 'video corto y juegos'],
  ['RESUMEN PDF', 'teoría y taller por mundo'],
  ['CLIPS', 'datos curiosos'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 0.6, type: 'pop', i: 0 }];
  for (const t of [6.6, 8.6, 10.6, 12.6, 14.2, 15.6, 17.0, 18.4, 28.0, 37.4, 40.4, 52.0, 78.0, 81.2, 84.2, 87.2]) ev.push({ t, type: 'slide', d: .5 });
  ev.push({ t: 19.0, type: 'pop', i: 2 }, { t: 24.4, type: 'pop', i: 1 }, { t: 31.0, type: 'lasso', d: .8 }, { t: 31.8, type: 'card' }, { t: 33.4, type: 'card' }, { t: 42.8, type: 'pop', i: 3 });
  ev.push({ t: 48.6, type: 'pop', i: 0 }, { t: 55.0, type: 'pop', i: 1 });
  for (let j = 1; j < GAMES.length; j++) ev.push({ t: 55.2 + j * 1.5, type: 'tile', i: j % 4 });
  ev.push({ t: 67.4, type: 'pop', i: 2 }, { t: 68.4, type: 'lasso', d: .8 }, { t: 69.2, type: 'pop', i: 3 });
  ev.push({ t: 74.6, type: 'pop', i: 0 }, { t: 81.8, type: 'lasso', d: .8 }, { t: 87.6, type: 'lasso', d: .8 }, { t: 88.6, type: 'yes' });
  ev.push({ t: 92.0, type: 'away', d: .6 }, { t: 92.6, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 93.2 + k * .55, type: 'stop', i: k % 4 });
  ev.push({ t: 96.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'El álgebra parece una lista de fórmulas.'],
  [4.0, 6.6, 'Aquí no se memoriza: se juega.'],
  [6.8, 9.6, 'La primera vez, un recorrido te muestra todo.'],
  [9.8, 12.4, 'Cada botón y cada pestaña, en un minuto.'],
  [12.8, 15.6, 'El curso es un camino de diez mundos.'],
  [15.8, 18.6, 'De la Pradera de Venn a la Selva Exponencial.'],
  [19.0, 21.8, 'Entremos al primero.'],
  [25.0, 27.8, 'Cada mundo es un camino de niveles.'],
  [28.0, 30.8, 'Al final esperan un jefe y una evaluación.'],
  [31.2, 34.0, 'Y un resumen en PDF por mundo, para descargar:'],
  [34.2, 37.0, 'teoría, gráficas y un taller de diez ejercicios.'],
  [37.4, 40.2, 'El jefe final se vence pensando, sin reloj.'],
  [40.4, 43.2, 'La evaluación te dice qué dominas y qué repasar.'],
  [43.6, 46.2, 'Abramos un nivel.'],
  [49.0, 51.8, 'Cada nivel empieza con un video corto.'],
  [52.0, 54.8, 'Primero la intuición, luego la fórmula.'],
  [55.2, 58.0, 'Los ejercicios son juegos: pintas zonas,'],
  [58.2, 61.0, 'llenas bolsas, doblas papel, mueves parábolas'],
  [61.4, 64.2, 'y equilibras balanzas.'],
  [64.4, 67.2, 'Sin prisa: el juego hace las cuentas.'],
  [67.6, 70.4, 'Y si te atascas, una pista te orienta.'],
  [75.0, 77.8, 'En la pestaña Clips, datos curiosos.'],
  [78.0, 80.8, 'Videos cortos: de dónde salen los números…'],
  [81.2, 84.0, 'Cuando avanzas, crecen tu racha y tu XP;'],
  [84.2, 87.0, 'la meta diaria te marca el ritmo.'],
  [87.4, 91.6, 'Tu viaje empieza en la Pradera de Venn.'],
  [93.4, 97.6, 'Lo que parecía una lista de fórmulas'],
  [97.8, 102.4, 'es un mapa de diez mundos. ¡Bienvenido!'],
];
