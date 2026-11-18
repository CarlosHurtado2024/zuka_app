// «El pozo de Eratóstenes» · escenas de la lección alg-12e. Motor en kit.js y escala.js; guion en proporciones.data.js.
// Extremos en ámbar, medios en cian; lo directo en verde, lo inverso en rosa.
const EX = C.amber, ME = C.cyan;
const ANG = 7.2 * 3 * Math.PI / 180;   // el ángulo se dibuja tres veces más grande para que se vea (se avisa en pantalla)
// La Tierra: círculo de centro (cx, cy) y radio r; Siena arriba y Alejandría un poco a la izquierda. o: rays, well, stick, center, arc.
function earth(t, cx, cy, r, o = {}) {
  stroke(hexA(C.blue, .9), 3, () => X.arc(cx, cy, r, 0, Math.PI * 2 * clamp(o.k ?? 1)), { g: 14 });
  X.save(); X.fillStyle = hexA(C.blue, .07); X.beginPath(); X.arc(cx, cy, r, 0, 7); X.fill(); X.restore();
  const sx = cx, sy = cy - r, ax = cx - r * Math.sin(ANG), ay = cy - r * Math.cos(ANG);
  if (o.rays) for (let i = -3; i <= 3; i++) { const x = cx + i * 90, k = clamp(o.rays); stroke(hexA(C.amber, .45), 2, () => { X.moveTo(x, cy - r - 300); X.lineTo(x, lerp(cy - r - 300, cy - r - 40 + Math.abs(i) * 20, k)); }, { g: 6 }); }
  dot(sx, sy, 9, C.amber, 18); dot(ax, ay, 9, C.cyan, 18);
  if (o.names) { T('Siena', sx + 20, sy - 18, { k: 'it', s: 30, c: C.amber }); T('Alejandría', ax - 20, ay - 18, { k: 'it', s: 30, a: 'r', c: C.cyan }); }
  if (o.well) { const k = clamp(o.well); stroke(C.amber, 3, () => { X.moveTo(sx - 16, sy - 30); X.lineTo(sx - 16, sy + 34); X.lineTo(sx + 16, sy + 34); X.lineTo(sx + 16, sy - 30); }, { g: 10 }); stroke(C.amber, 3, () => { X.moveTo(sx, sy - 260); X.lineTo(sx, lerp(sy - 260, sy + 30, k)); }, { g: 18 }); if (k >= 1) dot(sx, sy + 28, 8, '#fff6c8', 26); }
  if (o.stick) {
    const k = clamp(o.stick), ux = -Math.sin(ANG), uy = -Math.cos(ANG), tx = ax + ux * 90, ty = ay + uy * 90;
    stroke(C.cyan, 4, () => { X.moveTo(ax, ay); X.lineTo(lerp(ax, tx, k), lerp(ay, ty, k)); }, { g: 12 });
    if (k >= 1) { stroke(C.amber, 2.5, () => { X.moveTo(tx, ty - 220); X.lineTo(tx, ty); }, { g: 10 }); stroke(hexA(C.amber, .5), 2, () => { X.moveTo(tx, ty); X.lineTo(ax + (tx - ax) * 0 + (ty - ay) * 0, ay); }, { g: 0, dash: [6, 8] }); }
  }
  if (o.angle) { const k = clamp(o.angle); stroke(C.mag, 3, () => X.arc(ax, ay, 60, -Math.PI / 2 - ANG * 0, -Math.PI / 2 - ANG * k, true), { g: 10 }); }
  if (o.center) { const k = clamp(o.center); stroke(hexA(C.ink, .6), 2, () => { X.moveTo(cx, cy); X.lineTo(lerp(cx, sx, k), lerp(cy, sy, k)); X.moveTo(cx, cy); X.lineTo(lerp(cx, ax, k), lerp(cy, ay, k)); }, { g: 0 }); if (k >= 1) stroke(C.mag, 3, () => X.arc(cx, cy, 70, -Math.PI / 2, -Math.PI / 2 - ANG, true), { g: 10 }); }
  if (o.arc) { const k = clamp(o.arc); stroke(C.green, 5, () => X.arc(cx, cy, r + 14, -Math.PI / 2, -Math.PI / 2 - ANG * k, true), { g: 16 }); }
}
const S = {
  // 1 · Egipto: la Tierra, los rayos paralelos; el pozo de Siena y la vara de Alejandría.
  eratostenes(t) {
    stars(t, .5);
    const cx = CX, cy = 1040, r = 340;
    earth(t, cx, cy, r, { k: seg(t, .8, 3), rays: seg(t, 3, 6), names: t > 3.4, well: seg(t, 11, 14), stick: seg(t, 21, 22.5), angle: seg(t, 23.5, 25) });
    fade(A(t, 1.4, .6), () => T('Eratóstenes · bibliotecario de Alejandría', CX, 1440, { k: 'mono', s: 23, c: C.mute, a: 'c' }));
    fade(A(t, 14.4, .5), () => T('el Sol, a plomo', cx + 30, cy - r - 130, { k: 'mono', s: 22, c: C.amber }));
    fade(A(t, 25, .5), () => { T('7.2°', cx - r * Math.sin(ANG) - 70, cy - r * Math.cos(ANG) - 70, { k: 'r', s: 44, a: 'r', c: C.mag, g: 10 }); T('ángulo ampliado en el dibujo', CX, cy + 60, { k: 'mono', s: 20, c: C.mute, a: 'c' }); });
  },
  // 2 · Proporción: a/b = c/d; «a es a b como c es a d»; 3/4 = 6/8 con dos barras.
  proporcion(t) {
    stars(t, .3);
    fade(win(t, .5, 18.8), () => { FR('a', 'b', 360, 700, 110, EX, { k: 'i', g: 12 }); T('=', CX, 740, { k: 'r', s: 110, a: 'c' }); FR('c', 'd', 720, 700, 110, ME, { k: 'i', g: 12 }); fade(A(t, 10.2, .5), () => T('«a es a b como c es a d»', CX, 1000, { k: 'it', s: 52, a: 'c', c: '#c3ccec' })); });
    fade(A(t, 19, .6), () => {
      FR(3, 4, 360, 620, 90, EX, { g: 12 }); T('=', CX, 650, { k: 'r', s: 90, a: 'c' }); FR(6, 8, 720, 620, 90, ME, { g: 12 });
      const x0 = 190, w = 700, k = eo(seg(t, 20, 22));
      for (let i = 0; i < 4; i++) bar(x0 + i * w / 4, 860, w / 4 - 6, 50, EX, i < 3 ? k : 0, { fill: .35 }), stroke(hexA(EX, .5), 1.5, () => X.rect(x0 + i * w / 4, 860, w / 4 - 6, 50), { g: 0 });
      for (let i = 0; i < 8; i++) bar(x0 + i * w / 8, 940, w / 8 - 6, 50, ME, i < 6 ? k : 0, { fill: .35 }), stroke(hexA(ME, .5), 1.5, () => X.rect(x0 + i * w / 8, 940, w / 8 - 6, 50), { g: 0 });
      fade(A(t, 22.5, .5), () => T('0.75', x0 + w * .75, 1050, { k: 'r', s: 48, a: 'c', c: C.green, g: 12 }));
    });
  },
  // 3 · La proporción de Eratóstenes: 7.2° es 1/50 de la vuelta; 5 000 estadios; ángulo : vuelta = distancia : contorno.
  erapro(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => {
      for (let i = 0; i < 50; i++) { const a0 = -Math.PI / 2 + i * Math.PI * 2 / 50; fade(A(t, 1 + i * .04, .2), () => { X.save(); X.beginPath(); X.moveTo(CX, 760); X.arc(CX, 760, 300, a0, a0 + Math.PI * 2 / 50 - .01); X.closePath(); X.fillStyle = i === 0 ? hexA(C.mag, .7) : hexA(C.blue, .14); X.fill(); X.restore(); }); }
      ring(CX, 760, 300, C.blue, 2.5); fade(A(t, 3.4, .5), () => F([['7.2', 'r', C.mag], [' : 360 = 1 : ', 'r'], ['50', 'r', C.mag]], CX, 1170, 64));
    });
    fade(A(t, 10, .6), () => {
      earth(t, CX, 1090, 340, { names: true, center: seg(t, 10.4, 12), arc: seg(t, 12, 14) });
      fade(A(t, 13.8, .5), () => T('5 000 estadios', CX - 60, 690, { k: 'r', s: 38, a: 'c', c: C.green, g: 10 }));
      fade(A(t, 12, .5), () => T('7.2°', CX - 30, 990, { k: 'r', s: 36, a: 'r', c: C.mag }));
      fade(A(t, 20.2, .6), () => { FR('7.2', '360', 400, 450, 60, C.mag, { g: 10 }); T('=', 540, 472, { k: 'r', s: 60, a: 'c' }); FR('5 000', 'C', 690, 450, 60, C.green, { g: 10 }); T('ángulo : vuelta = distancia : contorno', CX, 590, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
    });
  },
  // 4 · Extremos y medios: a : b = c : d; ad = bc; de dónde sale.
  extremos(t) {
    stars(t, .3);
    const r = F([['a', 'i', EX], [' : ', 'r'], ['b', 'i', ME], [' = ', 'r'], ['c', 'i', ME], [' : ', 'r'], ['d', 'i', EX]], CX, 640, 120);
    fade(A(t, 2.6, .6), () => { const xa = r.mid(0), xd = r.mid(6), xb = r.mid(2), xc = r.mid(4); stroke(EX, 3, () => { X.moveTo(xa, 690); X.lineTo(xa, 740); X.lineTo(xd, 740); X.lineTo(xd, 690); }); T('extremos', CX, 790, { k: 'it', s: 38, a: 'c', c: EX }); stroke(ME, 3, () => { X.moveTo(xb, 530); X.lineTo(xb, 490); X.lineTo(xc, 490); X.lineTo(xc, 530); }); T('medios', CX, 466, { k: 'it', s: 38, a: 'c', c: ME }); });
    fade(A(t, 10.2, .6), () => F([['a', 'i', EX], ['d', 'i', EX], [' = ', 'r'], ['b', 'i', ME], ['c', 'i', ME]], CX, 960, 110, { rev: seg(t, 10.4, 12) }));
    fade(A(t, 19, .6), () => {
      [[19.2, [['a', 'i'], ['/', 'r'], ['b', 'i'], [' = ', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i']]], [21.2, [['(', 'r'], ['a', 'i'], ['/', 'r'], ['b', 'i'], [') · ', 'r'], ['bd', 'i', C.green], [' = (', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i'], [') · ', 'r'], ['bd', 'i', C.green]]], [23.4, [['a', 'i', EX], ['d', 'i', EX], [' = ', 'r'], ['c', 'i', ME], ['b', 'i', ME]]]].forEach(([t0, p], i) => fade(A(t, t0, .5), () => F(p, CX, 1110 + i * 80, 52)));
    });
  },
  // 5 · El término que falta: 7.2 · C = 360 · 5 000; C = 250 000 estadios ≈ 39 000 km.
  contorno(t) {
    stars(t, .3);
    F([['7.2', 'r', EX], [' : ', 'r'], ['360', 'r', ME], [' = ', 'r'], ['5000', 'r', ME], [' : ', 'r'], ['C', 'i', EX]], CX, 560, 90);
    fade(A(t, 10.2, .6), () => F([['7.2', 'r', EX], [' · ', 'r'], ['C', 'i', EX], [' = ', 'r'], ['360', 'r', ME], [' · ', 'r'], ['5 000', 'r', ME], [' = 1 800 000', 'r']], CX, 720, 62, { rev: seg(t, 10.4, 13), max: 960 }));
    fade(A(t, 20.2, .6), () => {
      F([['C', 'i', EX], [' = 1 800 000 ÷ 7.2 = ', 'r'], ['250 000', 'r', C.green]], CX, 880, 58, { max: 960 });
      T('estadios', CX, 950, { k: 'mono', s: 26, c: C.mute, a: 'c' });
      fade(A(t, 23.4, .6), () => F([['250 000 · 157 m ≈ ', 'r'], ['39 000 km', 'r', C.green]], CX, 1080, 58));
      ring(CX, 1240, 60, C.blue, 3, seg(t, 23.4, 26)); dot(CX, 1180, 6, C.amber, 14);
    });
    T('C = ' + (t > 21 ? '250 000 estadios' : '…'), 96, 1300, { k: 'mono', s: 26, c: C.green, g: 8 });
  },
  // 6 · Directa: el rayo y el trueno; tabla t → d; recta por el origen.
  directa(t) {
    stars(t, .3);
    fade(win(t, .5, 10), () => {
      const fl = t > 1.2 && t < 1.6 ? 1 : 0;
      stroke(C.amber, 5, () => { X.moveTo(240, 420); X.lineTo(200, 560); X.lineTo(250, 560); X.lineTo(200, 720); }, { g: 30 });
      if (fl) { X.fillStyle = 'rgba(255,240,200,.08)'; X.fillRect(0, 0, W, H); }
      const el = clamp(t - 1.4, 0, 6); for (let i = 0; i < 4; i++) { const rr = (el * 120 - i * 80); if (rr > 0) ring(220, 720, rr, hexA(C.cyan, Math.max(0, .7 - rr / 900)), 2, 1, { g: 6 }); }
      dot(860, 720, 14, C.ink, 18); T('tú', 860, 780, { k: 'it', s: 32, a: 'c', c: C.ink });
      T('t = ' + el.toFixed(1) + ' s', CX, 940, { k: 'mono', s: 36, c: C.cyan, a: 'c', g: 8 }); T('d = ' + Math.round(343 * el) + ' m', CX, 1000, { k: 'mono', s: 36, c: C.amber, a: 'c', g: 8 });
    });
    fade(win(t, 10, 20), () => {
      const rows = [[1, 343], [2, 686], [3, 1029], [6, 2058]];
      T('t (s)', 380, 520, { k: 'it', s: 36, a: 'c', c: C.cyan }); T('d (m)', 700, 520, { k: 'it', s: 36, a: 'c', c: C.amber });
      rows.forEach(([a, b], i) => fade(A(t, 10.6 + i * .8, .4), () => { T(String(a), 380, 600 + i * 80, { k: 'r', s: 44, a: 'c' }); T(num(b), 700, 600 + i * 80, { k: 'r', s: 44, a: 'c' }); T('d / t = 343', 900, 600 + i * 80, { k: 'mono', s: 22, c: C.green }); }));
      fade(A(t, 14.4, .5), () => F([['d', 'i', C.amber], [' / ', 'r'], ['t', 'i', C.cyan], [' = 343', 'r', C.green], ['   constante', 'it', C.mute]], CX, 1020, 56));
    });
    fade(A(t, 20, .6), () => {
      const x0 = 200, y0 = 1180, sx = 110, sy = 0.28;
      axes(x0, y0, 720, 640, 't (s)', 'd (m)', eo(seg(t, 20.2, 21.4)));
      [[1, 343], [2, 686], [3, 1029], [6, 2058]].forEach(([a, b], i) => fade(A(t, 21.4 + i * .4, .3), () => dot(x0 + a * sx, y0 - b * sy, 10, C.amber, 20)));
      curve(u => [x0 + u * sx, y0 - 343 * u * sy], 0, 6.3, C.green, seg(t, 23, 25));
      fade(A(t, 23.4, .5), () => T('origen', x0 - 14, y0 + 44, { k: 'mono', s: 22, c: C.green, a: 'r' }));
    });
  },
  // 7 · Inversa: el tubo de Boyle; mitad de volumen, doble presión; la hipérbola.
  inversa(t) {
    stars(t, .3);
    fade(win(t, .5, 20), () => {
      const v = t < 10 ? lerp(1, .5, eio(seg(t, 4, 7))) : (t < 15 ? lerp(.5, .25, eio(seg(t, 11, 13.5))) : .25 + .75 * eio(seg(t, 15.5, 18.5)) * 0 + 0);
      const vv = t < 15 ? v : .25, x0 = 260, y0 = 560, L = 560;
      stroke('rgba(225,232,255,.8)', 3, () => X.roundRect(x0, y0, 90, L, 12), { g: 8 });
      const top = y0 + L * (1 - vv);
      X.save(); X.fillStyle = hexA(C.cyan, .18); X.fillRect(x0 + 4, top, 82, L * vv - 4); X.restore();
      stroke(C.mag, 6, () => { X.moveTo(x0 - 10, top); X.lineTo(x0 + 100, top); }, { g: 16 });
      for (let i = 0; i < 18; i++) { const R = rng(i + 3); dot(x0 + 15 + R() * 60, top + 10 + R() * (L * vv - 20), 3.5, C.cyan, 8); }
      T('aire', x0 + 45, y0 + L + 50, { k: 'it', s: 32, a: 'c', c: C.cyan });
      T('V = ' + vv.toFixed(2), 700, 700, { k: 'mono', s: 44, c: C.cyan, a: 'c', g: 10 });
      T('P = ' + (1 / vv).toFixed(2), 700, 800, { k: 'mono', s: 44, c: C.mag, a: 'c', g: 10 });
      fade(A(t, 10.4, .5), () => T('P · V = ' + (1).toFixed(2), 700, 920, { k: 'mono', s: 44, c: C.green, a: 'c', g: 12 }));
      fade(A(t, 1.4, .5), () => T('Robert Boyle · 1662', 700, 600, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    });
    fade(A(t, 20, .6), () => {
      const x0 = 200, y0 = 1180, s = 160;
      axes(x0, y0, 720, 640, 'V', 'P', eo(seg(t, 20.2, 21.4)));
      curve(u => [x0 + u * s, y0 - (1 / u) * s], .26, 4.4, C.mag, seg(t, 21.4, 24));
      [[.25, 4], [.5, 2], [1, 1], [2, .5], [4, .25]].forEach(([a, b], i) => fade(A(t, 22 + i * .4, .3), () => dot(x0 + a * s, y0 - b * s, 9, C.cyan, 18)));
      fade(A(t, 24.4, .5), () => F([['P', 'i', C.mag], [' · ', 'r'], ['V', 'i', C.cyan], [' = 1', 'r', C.green]], 760, 700, 56));
    });
  },
  // 8 · Recta o curva: las dos gráficas lado a lado; la estatura con la edad, que no es ninguna.
  comparar(t) {
    stars(t, .3);
    fade(win(t, .5, 18.8), () => {
      axes(110, 1000, 380, 400, 'x', 'y', 1); curve(u => [110 + u * 90, 1000 - u * 85], 0, 4.1, C.green, seg(t, 1, 3));
      F([['y', 'i'], [' = ', 'r'], ['k', 'i', C.green], ['x', 'i']], 300, 1100, 50); T('directa', 300, 1170, { k: 'it', s: 36, a: 'c', c: C.green });
      fade(A(t, 10, .5), () => { axes(590, 1000, 380, 400, 'x', 'y', 1); curve(u => [590 + u * 90, 1000 - 90 / u], .24, 4.1, C.mag, seg(t, 10.4, 12.4)); F([['y', 'i'], [' = ', 'r'], ['k', 'i', C.mag], [' / ', 'r'], ['x', 'i']], 780, 1100, 50); T('inversa', 780, 1170, { k: 'it', s: 36, a: 'c', c: C.mag }); });
    });
    fade(A(t, 19, .6), () => {
      const x0 = 200, y0 = 1120, sx = 38, sy = 3.4;
      axes(x0, y0, 720, 640, 'edad (años)', 'estatura (cm)', 1);
      curve(u => [x0 + u * sx, y0 - (50 + 120 * (1 - Math.pow(.5, u / 5))) * sy], 0, 18, C.amber, seg(t, 19.4, 22));
      [[5, 110], [10, 140]].forEach(([a, b], i) => fade(A(t, 22.4 + i * .8, .4), () => { const y = 50 + 120 * (1 - Math.pow(.5, a / 5)); dot(x0 + a * sx, y0 - y * sy, 10, C.cyan, 18); T(a + ' años · ' + b + ' cm', x0 + a * sx + 20, y0 - y * sy + 50, { k: 'mono', s: 22, c: C.cyan }); }));
      fade(A(t, 24.2, .5), () => T('doble edad, no doble estatura (valores aproximados)', CX, 1220, { k: 'mono', s: 21, c: C.mute, a: 'c' }));
    });
  },
  // 9 · Reparto: 2 + 3 + 5 = 10 partes de un millón.
  reparto(t) {
    stars(t, .3);
    const cols = [C.amber, C.cyan, C.mag], put = [2, 3, 5];
    put.forEach((n, j) => fade(A(t, 1 + j * .6, .5), () => { const x = 270 + j * 270; for (let i = 0; i < n; i++) ring(x, 640 - i * 30, 40, cols[j], 3, 1, { g: 10 }); T(n + ' mil', x, 720, { k: 'r', s: 40, a: 'c', c: cols[j] }); T('amiga ' + (j + 1), x, 770, { k: 'mono', s: 22, a: 'c', c: C.mute }); }));
    fade(A(t, 5, .6), () => T('premio: 1 000 000', CX, 880, { k: 'mono', s: 32, c: C.green, a: 'c', g: 10 }));
    fade(A(t, 10, .6), () => {
      const x0 = 140, w = 800, u = w / 10, k = eo(seg(t, 10.4, 12)); let acc = 0;
      for (let i = 0; i < 10; i++) { const j = i < 2 ? 0 : i < 5 ? 1 : 2; bar(x0 + i * u + 2, 960, u - 4, 70, t > 20 ? cols[j] : C.green, k, { fill: .3 }); }
      fade(A(t, 12.4, .5), () => T('10 partes · 100 000 cada una', CX, 1080, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
      fade(A(t, 20.4, .6), () => put.forEach((n, j) => { const xm = x0 + (acc + n / 2) * u; acc += n; T(num(n * 100000), xm, 1160, { k: 'r', s: 36, a: 'c', c: cols[j], g: 8 }); }));
    });
  },
  // 10 · Cierre: la Tierra con el arco; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { earth(t, CX, 1040, 340, { names: true, rays: 1, well: 1, stick: 1, arc: 1 }); T('40 075 km por el ecuador', CX, 1440, { k: 'mono', s: 26, c: C.green, a: 'c' }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i', EX], ['d', 'i', EX], [' = ', 'r'], ['b', 'i', ME], ['c', 'i', ME]], 'propiedad fundamental'], [[['y', 'i'], ['/', 'r'], ['x', 'i'], [' = ', 'r'], ['k', 'i', C.green]], 'directa: recta'], [[['x', 'i'], ['y', 'i'], [' = ', 'r'], ['k', 'i', C.mag]], 'inversa: curva'], [[['2 : 3 : 5', 'r']], 'reparto']], 420, 170, 50);
      endCard(t, 19.6, D.TITLE, D.LINE, [EX, C.green, ME]);
    });
  },
};
