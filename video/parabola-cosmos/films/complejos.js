// «El problema de Cardano» · escenas de la lección alg-23c. Motor en kit.js y parabola.js; guion en complejos.data.js.
// La parte real en ámbar, la imaginaria en cian, los resultados en verde, el conjugado y lo «imposible» en rosa.
const RE = C.amber, IM = C.cyan, OKc = C.green, CJ = C.mag;
// Plano complejo con origen (ox, oy) y u píxeles por unidad; r rango de −r a r.
function cplane(ox, oy, u, r, k = 1) {
  stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(ox - r * u * k, oy); X.lineTo(ox + r * u * k, oy); X.moveTo(ox, oy + r * u * k); X.lineTo(ox, oy - r * u * k); }, { g: 4 });
  for (let i = Math.ceil(-r); i <= Math.floor(r); i++) if (i) { stroke('rgba(225,232,255,.5)', 1.5, () => { X.moveTo(ox + i * u, oy - 6); X.lineTo(ox + i * u, oy + 6); X.moveTo(ox - 6, oy - i * u); X.lineTo(ox + 6, oy - i * u); }, { g: 0 }); }
  if (k > .9) { T('real', ox + r * u - 10, oy + 40, { k: 'mono', s: 20, a: 'r', c: RE }); T('imaginario', ox + 14, oy - r * u + 10, { k: 'mono', s: 20, c: IM }); T('1', ox + u, oy + 34, { k: 'r', s: 24, a: 'c', c: C.mute }); T('i', ox - 22, oy - u + 8, { k: 'i', s: 26, a: 'c', c: C.mute }); }
  return (a, b) => [ox + a * u, oy - b * u];
}
const S = {
  // 1 · Cardano, 1545: partir el 10 en dos que multipliquen 40.
  cardano(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { stroke('#ffd9a0', 3, () => X.roundRect(330, 400, 420, 130, 18), { g: 12 }); T('ARS MAGNA', CX, 482, { k: 'r', s: 54, a: 'c', c: '#ffd9a0', ls: 6 }); T('Gerolamo Cardano · Núremberg, 1545', CX, 580, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 9.6, .6), () => { F([['x', 'i'], [' + ', 'r'], ['y', 'i'], [' = 10', 'r', RE]], CX, 720, 64); F([['x', 'i'], [' · ', 'r'], ['y', 'i'], [' = 40', 'r', IM]], CX, 810, 64); const s = Math.min(9, Math.floor(seg(t, 11, 17) * 9)) + 1; T(s + ' · ' + (10 - s) + ' = ' + s * (10 - s) + '   (máximo 25)', CX, 900, { k: 'mono', s: 28, a: 'c', c: C.mute }); });
    fade(A(t, 18.6, .6), () => F([['5 + √−15', 'r', CJ], ['     ', 'r'], ['5 − √−15', 'r', CJ]], CX, 1060, 72));
  },
  // 2 · Ningún real: los cuadrados de la recta caen a la derecha del 0.
  ningun(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, -10, 10, { step: 1, lab: v => v % 5 === 0, s: 26 });
    [-3, -2, -1, 1, 2, 3].forEach((v, i) => fade(A(t, 1 + i * .5, .4), () => { dot(px(v), 760, 9, RE, 16); hop(px(v), px(v * v), 760, 40 + Math.abs(v) * 20, hexA(OKc, .7), seg(t, 1.4 + i * .5, 2.4 + i * .5), 2); }));
    fade(A(t, 10.2, .6), () => { X.save(); X.fillStyle = hexA(CJ, .14); X.fillRect(px(-10), 700, px(0) - px(-10), 120); X.restore(); T('aquí no cae ningún cuadrado', px(-5), 860, { k: 'mono', s: 22, a: 'c', c: CJ }); F([['x', 'i'], ['² = −1', 'r', CJ]], CX, 1000, 72); });
    fade(A(t, 19.2, .6), () => T('hace falta un número fuera de la recta', CX, 1120, { k: 'it', s: 44, a: 'c', c: '#c3ccec' }));
  },
  // 3 · El número i: i² = −1; √−25 = 5i; √−15 = √15 i.
  i(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { T('i', CX, 700, { k: 'i', s: 260, a: 'c', c: IM, g: 30 }); F([['i', 'i', IM], ['² = −1', 'r']], CX, 880, 80); });
    fade(A(t, 10.2, .6), () => F([['√−25 = ', 'r'], ['5', 'r', RE], ['i', 'i', IM], ['    (5', 'r', C.mute], ['i', 'i', C.mute], [')² = 25 · (−1)', 'r', C.mute]], CX, 1020, 52));
    fade(A(t, 20.2, .6), () => F([['5 ± √15 ', 'r', OKc], ['i', 'i', IM]], CX, 1140, 72));
  },
  // 4 · Un cuarto de vuelta: el 1 gira 180° a −1; con i gira 90° a i y otros 90° a −1.
  vuelta(t) {
    stars(t, .3);
    const P = cplane(CX, 800, 220, 1.6);
    let ang = 0;
    if (t < 10) ang = Math.PI * eio(seg(t, 2, 5));
    else if (t < 20) ang = Math.PI / 2 * eio(seg(t, 11, 13.5));
    else ang = Math.PI / 2 + Math.PI / 2 * eio(seg(t, 21, 23.5));
    const [x, y] = P(Math.cos(ang), Math.sin(ang));
    stroke(hexA(OKc, .5), 2, () => X.arc(CX, 800, 220, -ang, 0), { g: 0, dash: [6, 8] });
    arrow(CX, 800, x, y, OKc, 1, 4); dot(x, y, 12, OKc, 26);
    T(t < 10 ? 'por −1: 180°' : t < 20 ? 'por i: 90°' : 'otra vez por i: 90° más', CX, 420, { k: 'mono', s: 30, a: 'c', c: t < 10 ? CJ : IM, g: 8 });
    fade(A(t, 23.6, .5), () => F([['i', 'i', IM], [' · ', 'r'], ['i', 'i', IM], [' = −1', 'r', CJ]], CX, 1160, 80));
  },
  // 5 · El plano: 2 + 3i como punto.
  plano(t) {
    stars(t, .3);
    const P = cplane(CX, 860, 100, 4, eo(seg(t, .8, 2.4)));
    fade(A(t, 10.2, .6), () => { const [x, y] = P(2, 3); stroke(RE, 3, () => { X.moveTo(CX, 860); X.lineTo(x, 860); }, { g: 10 }); stroke(IM, 3, () => { X.moveTo(x, 860); X.lineTo(x, y); }, { g: 10 }); dot(x, y, 12, OKc, 26); T('2 + 3i', x + 20, y - 16, { k: 'r', s: 40, c: OKc }); T('2', (CX + x) / 2, 900, { k: 'r', s: 30, a: 'c', c: RE }); T('3', x + 26, (860 + y) / 2, { k: 'r', s: 30, c: IM }); });
    fade(A(t, 19.2, .6), () => { stroke(RE, 6, () => { X.moveTo(CX - 400, 860); X.lineTo(CX + 400, 860); }, { g: 18 }); T('los reales: b = 0', CX - 380, 820, { k: 'mono', s: 24, c: RE }); });
  },
  // 6 · Sumar: flechas encadenadas (2 + 3i) + (4 − i) = 6 + 2i.
  suma(t) {
    stars(t, .3);
    const ox = 170, oy = 1080, u = 100, P = (a, b) => [ox + a * u, oy - b * u]; stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(ox - u, oy); X.lineTo(ox + 7.5 * u, oy); X.moveTo(ox, oy + u); X.lineTo(ox, oy - 4.5 * u); }, { g: 4 }); for (let i = 1; i <= 7; i++) stroke('rgba(225,232,255,.5)', 1.5, () => { X.moveTo(ox + i * u, oy - 6); X.lineTo(ox + i * u, oy + 6); }, { g: 0 }); for (let j = 1; j <= 4; j++) stroke('rgba(225,232,255,.5)', 1.5, () => { X.moveTo(ox - 6, oy - j * u); X.lineTo(ox + 6, oy - j * u); }, { g: 0 });
    const k1 = eo(seg(t, 2, 4)), k2 = eo(seg(t, 11, 13)), k3 = eo(seg(t, 19.4, 21));
    const [ax, ay] = P(2, 3), [bx, by] = P(6, 2);
    arrow(ox, oy, lerp(ox, ax, k1), lerp(oy, ay, k1), RE, k1, 3.5); if (k1 > .9) T('2 + 3i', ax - 20, ay - 20, { k: 'r', s: 34, a: 'r', c: RE });
    arrow(ax, ay, lerp(ax, bx, k2), lerp(ay, by, k2), IM, k2, 3.5); if (k2 > .9) T('+ (4 − i)', (ax + bx) / 2 + 10, (ay + by) / 2 - 24, { k: 'r', s: 32, c: IM });
    arrow(ox, oy, lerp(ox, bx, k3), lerp(oy, by, k3), OKc, k3, 4); if (k3 > .9) { dot(bx, by, 11, OKc, 22); T('6 + 2i', bx + 16, by + 40, { k: 'r', s: 36, c: OKc }); }
    fade(A(t, 10.2, .6), () => F([['(2 + 4)', 'r', RE], [' + ', 'r'], ['(3 − 1)', 'r', IM], ['i', 'i', IM], [' = 6 + 2', 'r'], ['i', 'i']], CX, 1290, 56));
  },
  // 7 · Multiplicar: i · (3 + 2i) gira el punto 90°; (1 + i)² = 2i.
  producto(t) {
    stars(t, .3);
    const P = cplane(CX, 880, 110, 3.6);
    fade(win(t, .5, 19.8), () => {
      const [ax, ay] = P(3, 2), [bx, by] = P(-2, 3); dot(ax, ay, 11, RE, 20); T('3 + 2i', ax + 16, ay - 14, { k: 'r', s: 32, c: RE });
      fade(A(t, 10.2, .6), () => { const g = eio(seg(t, 10.6, 13.4)), a0 = Math.atan2(2, 3), r = Math.hypot(3, 2), a = a0 + Math.PI / 2 * g; const [x, y] = P(r * Math.cos(a), r * Math.sin(a)); stroke(hexA(IM, .5), 2, () => X.arc(CX, 880, r * 110, -a, -a0), { g: 0, dash: [6, 8] }); dot(x, y, 11, OKc, 22); if (g > .95) T('−2 + 3i', bx - 16, by - 14, { k: 'r', s: 32, a: 'r', c: OKc }); });
      F([['i', 'i', IM], ['(3 + 2', 'r'], ['i', 'i'], [') = 3', 'r'], ['i', 'i'], [' + 2', 'r'], ['i', 'i'], ['²', 'r', CJ], [' = −2 + 3', 'r', OKc], ['i', 'i', OKc]], CX, 460, 52);
    });
    fade(A(t, 20.2, .6), () => { const [ax, ay] = P(1, 1), [bx, by] = P(0, 2); dot(ax, ay, 11, RE, 20); T('1 + i', ax + 16, ay + 6, { k: 'r', s: 32, c: RE }); dot(bx, by, 12, OKc, 24); T('2i', bx + 18, by - 6, { k: 'r', s: 32, c: OKc }); F([['(1 + ', 'r'], ['i', 'i'], [')² = 1 + 2', 'r'], ['i', 'i'], [' + ', 'r'], ['i', 'i'], ['²', 'r', CJ], [' = 2', 'r', OKc], ['i', 'i', OKc]], CX, 460, 56); T('gira 45° y se estira', CX, 1340, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 8 · El conjugado: reflejo; producto real; módulo.
  conjugado(t) {
    stars(t, .3);
    const P = cplane(420, 860, 80, 5);
    const [ax, ay] = P(3, 4), [bx, by] = P(3, -4);
    dot(ax, ay, 11, RE, 22); T('3 + 4i', ax + 16, ay - 10, { k: 'r', s: 34, c: RE });
    fade(A(t, 1.6, .6), () => { stroke(hexA(CJ, .5), 2, () => { X.moveTo(ax, ay); X.lineTo(bx, by); }, { g: 0, dash: [6, 8] }); dot(bx, by, 11, CJ, 22); T('3 − 4i', bx + 16, by + 30, { k: 'r', s: 34, c: CJ }); });
    fade(A(t, 10.2, .6), () => F([['(3 + 4', 'r', RE], ['i', 'i', RE], [')(3 − 4', 'r', CJ], ['i', 'i', CJ], [') = 9 + 16 = ', 'r'], ['25', 'r', OKc]], 760, 420, 40, { max: 560 }));
    fade(A(t, 20.2, .6), () => { stroke(OKc, 4, () => { X.moveTo(420, 860); X.lineTo(ax, ay); }, { g: 14 }); T('|3 + 4i| = √25 = 5', 800, 720, { k: 'r', s: 40, a: 'c', c: OKc }); });
  },
  // 9 · La prueba de Cardano: suma 10 y producto 40.
  comprobar(t) {
    stars(t, .3);
    const P = cplane(CX, 860, 64, 6);
    const r = Math.sqrt(15), [ax, ay] = P(5, r), [bx, by] = P(5, -r);
    dot(ax, ay, 11, RE, 22); dot(bx, by, 11, CJ, 22); T('5 + √15 i', ax + 16, ay - 10, { k: 'r', s: 30, c: RE }); T('5 − √15 i', bx + 16, by + 30, { k: 'r', s: 30, c: CJ });
    fade(A(t, 1.2, .6), () => F([['(5 + √15 ', 'r', RE], ['i', 'i', RE], [') + (5 − √15 ', 'r', CJ], ['i', 'i', CJ], [') = ', 'r'], ['10', 'r', OKc]], CX, 460, 46, { max: 960 }));
    fade(A(t, 10.2, .6), () => F([['5² + (√15)² = 25 + 15 = ', 'r'], ['40', 'r', OKc]], CX, 1340, 52));
    fade(A(t, 20.2, .6), () => T('Rafael Bombelli · Bolonia, 1572', 580, 720, { k: 'mono', s: 24, c: C.mute }));
  },
  // 10 · Cierre: el cuarto de vuelta; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { const P = cplane(CX, 800, 200, 1.5); const a = (t * .9) % (Math.PI * 2), [x, y] = P(Math.cos(a), Math.sin(a)); arrow(CX, 800, x, y, IM, 1, 4); dot(x, y, 12, IM, 26); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['i', 'i'], ['² = −1', 'r']], 'un cuarto de vuelta'], [[['a', 'i', RE], [' + ', 'r'], ['b', 'i', IM], ['i', 'i', IM]], 'un punto del plano'], [[['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], ['i', 'i'], [')(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], ['i', 'i'], [') = ', 'r'], ['a', 'i'], ['² + ', 'r'], ['b', 'i'], ['²', 'r']], 'conjugado'], [[['|', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], ['i', 'i'], ['| = √(', 'r'], ['a', 'i'], ['² + ', 'r'], ['b', 'i'], ['²)', 'r']], 'módulo']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [RE, OKc, IM]);
    });
  },
};
