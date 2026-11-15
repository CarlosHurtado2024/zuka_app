// «Arco, sector y movimiento circular» (lección trig-41b, Mar de las Ondas, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): el minutero de 3 m del reloj del puerto en 20 minutos (θ = 2π/3,
// s = 2π ≈ 6.28 m, A = 3π ≈ 9.42 m²), el aspersor de 5 m que gira 1.2 rad (15 m²) y la punta frente al medio del
// minutero (ω = 2π rad/h; 6π y 3π m/h).
// Hilo: ¿cuánto camina la punta del minutero en 20 minutos? y ¿quién va más rápido, la punta o el medio?
// Sorpresa anunciada: «la respuesta tiene trampa» (mismo giro, distinto camino). Cierre: 2π ≈ 6.28 m.
const POSTER = 40;
const FILM = stdFilm({
  open: { Z0: 2.0, C: [540, 900], t1: 3.8, t2: 6.0 },
  aims: ['el arco', 'el sector', 'la rapidez'],
  stops: ['el reloj', 'el arco', 'el sector', 'la rapidez'],
  wides: [[9.8, 11.2], [44.6, 46.2]],
  smiles: [[53.8, 55.6], [119.0, 135]],
});
// la carátula del reloj con el minutero en el ángulo a (grados)
function clock(p, cx, cy, R, a, k = 1, o = {}) {
  if (k <= 0.01) return;
  const S = scaleAt(p, cx, cy, k);
  shaded(S, 'circle', { cx, cy, r: R + 26 }, C.coral, C.coralD, 6, 6);
  el('circle', { cx, cy, r: R, fill: C.cream }, S);
  if (o.sweep) sector(S, cx, cy, R, o.sweep[0], o.sweep[1], 1, C.sun);
  for (let j = 0; j < 60; j++) { const big = j % 5 === 0, q1 = pc(cx, cy, R - (big ? 34 : 16), j * 6), q2 = pc(cx, cy, R - 6, j * 6); capsule(S, q1[0], q1[1], q2[0], q2[1], big ? 8 : 4, C.night); }
  const h = pc(cx, cy, R * .5, 90 - 30 * 2.3); capsule(S, cx, cy, h[0], h[1], 18, C.n3);
  const m = pc(cx, cy, R * .88, a); capsule(S, cx, cy, m[0], m[1], 12, C.night);
  el('circle', { cx, cy, r: 18, fill: C.night }, S);
  return m;
}
// ---------- nivel 0 · el reloj del puerto ----------
function level0(G, t) {
  starField(G, 311, 150);
  const cx = 540, cy = 900, R = 300, kk = pop(t, 0.4) * out(t, 28.8);
  const a = 90 - 120 * eio(seg(t, 7.0, 10.0));
  const sw = t > 13.0 ? [a, 90] : null;
  if (kk > 0.01) {
    const S = scaleAt(G, cx, cy, kk);
    clock(S, cx, cy, R, a, 1, { sweep: sw ? [a, a + 120 * eio(seg(t, 13.0, 14.0))] : null });
    arcDeg(S, cx, cy, R * .88, 90, a, eio(seg(t, 7.0, 10.0)), C.coral, 12);
    if (t > 19.2) {
      const tip = pc(cx, cy, R * .88, a), mid = pc(cx, cy, R * .44, a);
      dot(S, tip[0], tip[1], pop(t, 19.4), C.sun, 18);
      dot(S, mid[0], mid[1], pop(t, 20.2), C.mint, 18);
      tag(S, tip[0] + 30, tip[1] + 64, 'punta', pop(t, 19.6), C.sun, 40, 'start');
      tag(S, mid[0] - 10, mid[1] + 70, 'medio', pop(t, 20.4), C.mint, 40);
    }
  }
  const k3 = life(t, 4.0, 12.4); if (k3 > 0.01) chip(G, 470, 1340, 'minutero: 3 m', k3, POS, C.night, 44);
  const k20 = life(t, 12.8, 18.6); if (k20 > 0.01) chip(G, 470, 1340, '20 min = ⅓ de vuelta = 120°', k20, ZERO, C.night, 40);
  riseFormula(G, t, 15.8, 18.6, 540, 1440, 50, ['120°', '=', FR('2π', '3')]);
  fchip(G, 480, 1440, ['s = r', 'θ'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 52);
}
// ---------- nivel 1 · la longitud del arco ----------
function level1(G, t) {
  starField(G, 313, 90);
  fchip(G, 540, 700, ['s = r', 'θ'], out(t, 32.4), ZERO, 52);
  const cx = 540, cy = 1000, R = 220, RD = 180 / Math.PI;
  ucircle(G, t, 31.6, cx, cy, R, { col: C.n3, sw: 6, ext: 1.15 });
  ray(G, cx, cy, R, 0, eio(seg(t, 32.0, 32.4)), C.cream, 7);
  // radios de arco: 1, 2 y el pedazo hasta 2π/3
  const COL = [C.sun, C.mint, C.coral];
  for (let i = 0; i < 2; i++) {
    arcDeg(G, cx, cy, R, i * RD, (i + 1) * RD, eio(seg(t, 32.6 + i * 2.6, 33.6 + i * 2.6)), COL[i], 16);
    const q = pc(cx, cy, R + 50, (i + .5) * RD), k = pop(t, 33.4 + i * 2.6); if (k > 0.01) tag(G, q[0], q[1] + 16, 'r', k, COL[i], 44);
  }
  arcDeg(G, cx, cy, R, 2 * RD, 120, eio(seg(t, 38.6, 39.0)), COL[2], 16);
  const ka = eio(seg(t, 38.2, 38.8));
  if (ka > 0.01) { ray(G, cx, cy, R, 120, ka, C.cream, 7); arcDeg(G, cx, cy, 70, 0, 120, ka, C.cream, 6); tag(G, cx + 30, cy - 90, 'θ', ka, C.cream, 46, 'start'); }
  riseFormula(G, t, 39.0, 56.6, 540, 700, 64, ['s', '=', 'r', '·', 'θ']);
  const kt = life(t, 44.8, 50.2);
  if (kt > 0.01) { chip(G, 470, 1300, '3 · 120 = 360 m', kt, NEG, C.night, 46); badge(G, 760, 1300, pop(t, 46.0) * out(t, 50.2), false); }
  riseFormula(G, t, 51.0, 56.6, 470, 1310, 48, ['3', '·', FR('2π', '3'), '=', '2π', '≈', '6.28 m'], { fill: C.sun });
  fchip(G, 480, 1440, ['A =', FR('1', '2'), 'r', SP('2'), 'θ'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t < 51 ? 0 : 1), ZERO, 44);
}
// ---------- nivel 2 · el área del sector ----------
function level2(G, t) {
  starField(G, 315, 90);
  fchip(G, 540, 700, ['A =', FR('1', '2'), 'r', SP('2'), 'θ'], out(t, 61.0), ZERO, 44);
  const cx = 540, cy = 1080, R = 220, kc = pop(t, 60.2) * (1 - eio(seg(t, 78.4, 78.8)));
  if (kc > 0.01) {
    const S = scaleAt(G, cx, cy, kc);
    el('circle', { cx, cy, r: R, fill: t > 66.4 ? C.n3 : C.n2 }, S);
    const lift = 40 * eio(seg(t, 63.4, 64.2)) * (1 - eio(seg(t, 66.4, 67.0)));
    const m = pc(0, 0, lift, 30);
    sector(g(S, { transform: `translate(${r1(m[0])},${r1(m[1])})` }), cx, cy, R, -30, 90, eio(seg(t, 60.6, 61.6)), C.sun);
    el('circle', { cx, cy, r: R, fill: 'none', stroke: C.cream, 'stroke-width': 6 }, S);
    tag(S, cx - R - 30, cy + 16, 'πr²', pop(t, 66.6), C.mist, 46, 'end');
  }
  riseFormula(G, t, 69.6, 78.4, 540, 740, 50, ['A', '=', FR('θ', '2π'), '·', 'π', 'r', SP('2'), '=', FR('1', '2'), 'r', SP('2'), 'θ']);
  riseFormula(G, t, 75.8, 78.4, 470, 1380, 46, [FR('1', '2'), '·', '9', '·', FR('2π', '3'), '=', '3π', '≈', '9.42 m²'], { fill: C.sun });
  // el aspersor
  const ks = pop(t, 78.8) * (1 - eio(seg(t, 84.4, 84.8)));
  if (ks > 0.01) {
    const S = scaleAt(G, 540, 1060, ks), a = 1.2 * 180 / Math.PI;
    el('rect', { x: 120, y: 1060, width: 840, height: 8, rx: 4, fill: C.mintD }, S);
    sector(S, 300, 1060, 400, 0, a, eio(seg(t, 79.4, 81.4)), C.mint);
    const sp = (a * eio(seg(t, 79.4, 81.4)));
    for (let j = 0; j < 7; j++) { const q = pc(300, 1060, 60 + j * 52, sp); el('circle', { cx: r1(q[0]), cy: r1(q[1]), r: 7, fill: C.blue }, S); }
    shaded(S, 'rect', { x: 284, y: 1040, width: 32, height: 40, rx: 8 }, C.coral, C.coralD, 3, 3);
    tag(S, 520, 1120, 'r = 5 m', pop(t, 79.2), C.cream, 40);
    tag(S, 400, 990, '1.2 rad', pop(t, 81.4), C.night, 38);
  }
  riseFormula(G, t, 82.0, 84.4, 470, 1380, 46, [FR('1', '2'), '·', '25', '·', '1.2', '=', '15 m²'], { fill: C.mint });
  fchip(G, 480, 1440, ['v = r', 'ω'], pop(t, 88.2) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 52);
}
// ---------- nivel 3 · rapidez angular y lineal ----------
function level3(G, t) {
  starField(G, 317, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['v = r', 'ω'], out(t, 96.0), ZERO, 52);
  const cx = 540, cy = 1000, R = 260, a = 90 - 360 * ((Math.max(0, t - 95.6) / 9) % 1);
  const kc = pop(t, 95.2);
  if (kc > 0.01) {
    const S = scaleAt(E, cx, cy, kc);
    el('circle', { cx, cy, r: R + 30, fill: C.n2 }, S);
    const e = Math.max(0, t - 95.6) / 9 * 360, a0 = Math.max(90 - e, 90 - e + 0), tr = Math.min(e, 300);
    if (t > 101.8) { arcDeg(S, cx, cy, R, a + tr, a, 1, C.sun, 14); arcDeg(S, cx, cy, R / 2, a + tr, a, 1, C.mint, 14); }
    const tip = pc(cx, cy, R, a), mid = pc(cx, cy, R / 2, a);
    capsule(S, cx, cy, tip[0], tip[1], 14, C.cream);
    el('circle', { cx, cy, r: 18, fill: C.cream }, S);
    if (t < 101.8) arcDeg(S, cx, cy, 80, a + Math.min(e, 300), a, eio(seg(t, 96.4, 97.4)), C.coral, 8);
    dot(S, tip[0], tip[1], 1, C.sun, 18); dot(S, mid[0], mid[1], 1, C.mint, 18);
    void a0;
  }
  riseFormula(E, t, 98.6, 107.4, 540, 1380, 52, ['ω', '=', FR('2π rad', '1 h')]);
  const k1 = pop(t, 107.8), k2 = pop(t, 110.8);
  if (k1 > 0.01) chip(E, 330, 1380, 'punta: 3 · 2π = 6π m/h', k1, ZERO, C.night, 36);
  if (k2 > 0.01) chip(E, 330, 1460, 'medio: 1.5 · 2π = 3π m/h', k2, MINT, C.night, 36);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Arco, sector', 'y giros');
  label(p, t, 6.6, 12.4, 'EL RELOJ DEL PUERTO', 'pasan 20 minutos', '¿cuánto camina la punta?');
  label(p, t, 12.8, 18.6, 'UN TERCIO DE VUELTA', '120° = 2π/3 rad');
  label(p, t, 19.0, 24.4, 'DOS PUNTOS', 'la punta y el medio', '¿quién va más rápido?');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'la respuesta', 'tiene trampa');
  label(p, t, 31.8, 37.8, 'EL ARCO', '1 radián abarca', '1 radio de arco');
  label(p, t, 38.2, 44.2, 'LA FÓRMULA', 'arco = radio · ángulo', 'θ en radianes');
  label(p, t, 44.6, 50.2, 'CON GRADOS', '¡360 m!', 'más que la torre');
  label(p, t, 50.6, 56.6, 'LA PUNTA', 'camina 2π metros', 'unos 6.28 m');
  label(p, t, 60.0, 66.0, 'EL SECTOR', 'la tajada que barre', 'el minutero');
  label(p, t, 66.4, 72.2, 'UNA FRACCIÓN', 'del círculo entero', 'θ de 2π');
  label(p, t, 72.6, 78.4, 'ÁREA DEL SECTOR', 'un medio de r² θ', 'el reloj: 3π ≈ 9.42 m²');
  label(p, t, 78.8, 84.4, 'UN ASPERSOR', 'alcanza 5 m', 'gira 1.2 rad');
  label(p, t, 84.8, 90.4, 'LA PREGUNTA', '¿quién corre más?', 'la punta o el medio');
  label(p, t, 95.4, 101.4, 'RAPIDEZ ANGULAR', 'ω: ángulo por tiempo', 'igual para los dos');
  label(p, t, 101.8, 107.4, 'RAPIDEZ LINEAL', 'v = r · ω', 'camino por tiempo');
  label(p, t, 107.8, 114.0, 'LA TRAMPA', 'mismo giro', 'la punta, el doble');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['ARCO', ['s = r', 'θ']],
  ['SECTOR', ['A =', FR('1', '2'), 'r', SP('2'), 'θ']],
  ['EL ÁNGULO', 'siempre en radianes'],
  ['RAPIDEZ ANGULAR', ['ω =', FR('θ', 't')]],
  ['RAPIDEZ LINEAL', ['v = r', 'ω']],
]);
FILM.events = () => stdEvents([
  [0.4, 'pop'], [4.0, 'pop', 1], [7.0, 'slide', 3.0], [12.8, 'pop'], [13.0, 'paint', 1.0], [15.8, 'rise'], [19.4, 'pop', 2], [20.2, 'pop', 3], [24.8, 'pop', 3],
  [32.0, 'slide', .4], [32.6, 'paint', 1.0], [33.4, 'count', 1], [35.2, 'paint', 1.0], [36.0, 'count', 2], [38.2, 'pop'], [38.6, 'paint', .4], [39.0, 'rise'],
  [44.8, 'pop', 1], [46.0, 'no'], [51.0, 'rise'], [51.4, 'yes'], [52.4, 'pop', 3],
  [60.2, 'pop'], [60.6, 'paint', 1.0], [63.4, 'slide', .8], [66.6, 'pop', 2], [69.6, 'rise'], [75.8, 'rise'], [76.2, 'yes'],
  [78.8, 'pop'], [79.4, 'paint', 2.0], [82.0, 'rise'], [88.2, 'pop', 1],
  [95.2, 'pop'], [96.4, 'slide', 1.0], [98.6, 'rise'], [101.8, 'paint', 2.0], [107.8, 'card'], [110.8, 'pop', 2], [111.2, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'La torre del puerto tiene un reloj enorme.'],
  [4.0, 6.6, 'Su minutero mide tres metros.'],
  [7.0, 9.6, 'Pasan veinte minutos.'],
  [9.8, 12.4, '¿Cuántos metros caminó la punta?'],
  [12.8, 15.6, 'Veinte minutos son un tercio de la vuelta:'],
  [15.8, 18.6, 'ciento veinte grados, dos pi tercios.'],
  [19.0, 21.8, 'Y una pregunta más difícil:'],
  [22.0, 24.4, '¿quién corre más: punta o medio?'],
  [24.8, 29.0, 'Ojo: la respuesta tiene trampa.'],
  [31.8, 34.8, 'Un radián abarca un arco igual al radio.'],
  [35.0, 37.8, 'Dos radianes, dos radios de arco.'],
  [38.2, 41.0, 'Entonces el arco es radio por ángulo.'],
  [41.2, 44.2, 'Ese ángulo tiene que estar en radianes.'],
  [44.6, 47.4, 'Con grados saldrían trescientos sesenta metros.'],
  [47.6, 50.2, '¡Más alto que la torre entera!'],
  [50.6, 53.6, 'Con radianes: tres por dos pi tercios.'],
  [53.8, 56.6, 'La punta camina unos seis punto veintiocho metros.'],
  [60.0, 63.0, 'El minutero también barre un área.'],
  [63.2, 66.0, 'Es una tajada del círculo: un sector.'],
  [66.4, 69.2, 'El círculo completo tiene pi r cuadrado.'],
  [69.4, 72.2, 'La tajada es theta de dos pi.'],
  [72.6, 75.4, 'Simplificando: un medio de r cuadrado theta.'],
  [75.6, 78.4, 'El minutero barrió tres pi metros cuadrados.'],
  [78.8, 81.6, 'Un aspersor de cinco metros gira 1.2 radianes.'],
  [81.8, 84.4, 'Riega quince metros cuadrados.'],
  [84.8, 87.6, 'Ahora, la pregunta difícil:'],
  [87.8, 90.4, '¿quién corre más, la punta o el medio?'],
  [95.4, 98.4, 'Los dos giran el mismo ángulo cada hora.'],
  [98.6, 101.4, 'Rapidez angular: omega, dos pi por hora.'],
  [101.8, 104.6, 'Pero la punta recorre un círculo más grande.'],
  [104.8, 107.4, 'Su rapidez lineal es r por omega.'],
  [107.8, 110.6, 'Punta: seis pi metros por hora.'],
  [110.8, 114.0, 'El medio: tres pi. Mismo giro, la mitad de camino.'],
  [115.4, 119.6, 'En veinte minutos, la punta del minutero camina'],
  [119.8, 124.4, 'dos pi metros: unos seis punto veintiocho.'],
];
