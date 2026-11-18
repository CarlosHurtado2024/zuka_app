// «Los signos de Harriot» · escenas de la lección alg-12d. Motor en kit.js y recta.js; guion en orden.data.js.
// Frío en cian, calor en ámbar, el reflejo en magenta, las distancias en verde.
// Termómetro vertical en x, de lo a hi grados, marcando el valor v con color col.
function thermo(x, v, lo, hi, col, lab) {
  const y0 = 1060, y1 = 460, py = u => lerp(y0, y1, (u - lo) / (hi - lo));
  stroke('rgba(200,210,245,.7)', 2.5, () => X.roundRect(x - 22, y1 - 20, 44, y0 - y1 + 40, 22), { g: 0 });
  X.save(); X.fillStyle = hexA(col, .5); X.fillRect(x - 12, py(v), 24, y0 + 10 - py(v)); X.restore();
  dot(x, y0 + 30, 30, col, 20);
  for (let u = lo; u <= hi; u += 5) { stroke('rgba(200,210,245,.6)', 1.5, () => { X.moveTo(x + 26, py(u)); X.lineTo(x + 40, py(u)); }, { g: 0 }); T(neg(u) + '°', x + 50, py(u) + 9, { k: 'mono', s: 20, c: C.mute }); }
  T(neg(Math.round(v)) + ' °C', x, y1 - 50, { k: 'r', s: 44, a: 'c', c: col, g: 10 });
  if (lab) T(lab, x, y0 + 100, { k: 'mono', s: 22, a: 'c', c: C.mute });
}
const S = {
  // 1 · Harriot: el libro, la Luna del telescopio, y los dos signos que se dibujan.
  harriot(t) {
    stars(t, .5);
    fade(win(t, .5, 9.8), () => {
      stroke('#ffd9a0', 3, () => X.roundRect(200, 420, 320, 420, 14), { g: 12 });
      T('Artis', 360, 560, { k: 'it', s: 46, a: 'c', c: '#ffd9a0' }); T('Analyticae', 360, 620, { k: 'it', s: 46, a: 'c', c: '#ffd9a0' }); T('Praxis', 360, 680, { k: 'it', s: 46, a: 'c', c: '#ffd9a0' }); T('1631', 360, 790, { k: 'mono', s: 28, a: 'c', c: C.amber });
      fade(A(t, 4.4, .8), () => { ring(760, 620, 140, '#e8ecff', 3, 1); X.save(); X.beginPath(); X.arc(760, 620, 140, 0, 7); X.clip(); X.fillStyle = 'rgba(230,236,255,.12)'; X.fillRect(620, 480, 280, 280); X.fillStyle = 'rgba(4,6,14,.85)'; X.beginPath(); X.arc(700, 620, 150, 0, 7); X.fill(); X.restore(); T('la Luna · 1609', 760, 820, { k: 'mono', s: 22, a: 'c', c: C.mute }); });
    });
    fade(A(t, 10, .6), () => {
      const k = eio(seg(t, 10.4, 12.4));
      stroke(C.cyan, 8, () => { X.moveTo(380, 560); X.lineTo(lerp(380, 220, k), 680); X.lineTo(lerp(380, 380, k), lerp(680, 800, k)); }, { g: 24 });
      stroke(C.amber, 8, () => { X.moveTo(700, 560); X.lineTo(lerp(700, 860, eio(seg(t, 13, 15))), 680); X.lineTo(700, lerp(680, 800, eio(seg(t, 13, 15)))); }, { g: 24 });
      fade(A(t, 12.6, .5), () => T('menor que', 300, 900, { k: 'it', s: 44, a: 'c', c: C.cyan }));
      fade(A(t, 15.2, .5), () => T('mayor que', 780, 900, { k: 'it', s: 44, a: 'c', c: C.amber }));
    });
    fade(A(t, 18.8, .6), () => { F([['3', 'r', C.cyan], [' < ', 'r'], ['8', 'r', C.amber]], 300, 1100, 110); F([['8', 'r', C.amber], [' > ', 'r'], ['3', 'r', C.cyan]], 780, 1100, 110); T('la abertura mira al mayor', CX, 1210, { k: 'mono', s: 25, c: C.mute, a: 'c' }); });
  },
  // 2 · Tricotomía: un punto recorre la recta y una de tres luces se enciende (negativo, cero, positivo).
  tricotomia(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, -6, 6, {});
    const v0 = 5 * Math.sin(t * .45), z = Math.abs(v0) < .25, v = z ? 0 : v0, col = z ? C.ink : v > 0 ? C.amber : C.cyan;   // cerca de 0 se detiene en 0: «cero» solo se enciende con el cero
    dot(px(v), 760, 15, col, 30);
    T(z ? '0' : v.toFixed(2).replace('-', '−'), px(v), 700, { k: 'mono', s: 28, a: 'c', c: col });
    [['negativo', C.cyan, -1], ['cero', C.ink, 0], ['positivo', C.amber, 1]].forEach(([s, c, sg], i) => { const on = sg === 0 ? z : !z && Math.sign(v) === sg, x = 240 + i * 300; ring(x, 1000, 46, on ? c : 'rgba(160,180,240,.4)', 3, 1, { g: on ? 24 : 0 }); if (on) dot(x, 1000, 30, c, 30); T(s, x, 1090, { k: 'mono', s: 26, a: 'c', c: on ? c : C.mute }); });
    T('luces encendidas = 1', 96, 1260, { k: 'mono', s: 26, c: C.green, g: 8 });
  },
  // 3 · Qué es menor: a < b porque b − a > 0; temperaturas −12 y −3 en dos termómetros.
  menor(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => {
      const px = nline(110, 990, 700, -2, 10, {});
      dot(px(2), 700, 13, C.cyan, 24); dot(px(7), 700, 13, C.amber, 24); T('a', px(2), 650, { k: 'i', s: 44, a: 'c', c: C.cyan }); T('b', px(7), 650, { k: 'i', s: 44, a: 'c', c: C.amber });
      const k = eio(seg(t, 2, 4)); X.save(); X.fillStyle = hexA(C.green, .25); X.fillRect(px(2), 730, (px(7) - px(2)) * k, 30); X.restore();
      fade(A(t, 4, .4), () => { T('b − a = 5 > 0', (px(2) + px(7)) / 2, 810, { k: 'mono', s: 26, a: 'c', c: C.green, g: 8 }); F([['2', 'r', C.cyan], [' < ', 'r'], ['7', 'r', C.amber]], CX, 980, 96); });
      fade(A(t, 10.4, .5), () => { arrow(px(-1.5), 880, px(9.5), 880, C.amber, eio(seg(t, 10.6, 12.4)), 3); T('más a la derecha = mayor', CX, 1120, { k: 'mono', s: 26, c: C.amber, a: 'c' }); });
    });
    fade(A(t, 20, .6), () => { thermo(320, lerp(0, -12, eio(seg(t, 20.4, 22.4))), -15, 5, C.cyan, 'Moscú'); thermo(760, lerp(0, -3, eio(seg(t, 20.4, 22.4))), -15, 5, '#7fd6ff', 'Berlín'); fade(A(t, 23, .5), () => F([['−12', 'r', C.cyan], [' < ', 'r'], ['−3', 'r', '#7fd6ff']], CX, 1310, 72)); });
  },
  // 4 · ≤: el letrero de 60 y una aguja de velocidad que cruza el límite.
  menorigual(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { F([['≤', 'r', C.green]], CX, 760, 300); T('menor o igual', CX, 860, { k: 'it', s: 50, a: 'c', c: '#c3ccec' }); F([['5 ≤ 7', 'r', C.green], ['      ', 'r'], ['7 ≤ 7', 'r', C.green]], CX, 1020, 64); });
    fade(A(t, 10, .6), () => {
      ring(300, 640, 130, C.red, 12, 1); T('60', 300, 680, { k: 'brand', s: 110, a: 'c', c: C.ink });
      const v = 30 + 32 * Math.sin(Math.max(0, t - 10.4) * .5) ** 2 * 1.0, a = Math.PI * (.75 + 1.5 * v / 100), ok = v <= 60.4;
      stroke('rgba(200,210,245,.6)', 3, () => X.arc(760, 700, 160, Math.PI * .75, Math.PI * 2.25), { g: 0 });
      for (let u = 0; u <= 100; u += 20) { const b = Math.PI * (.75 + 1.5 * u / 100); T(String(u), 760 + 200 * Math.cos(b), 712 + 200 * Math.sin(b), { k: 'mono', s: 22, a: 'c', c: u === 60 ? C.red : C.mute }); }
      stroke(ok ? C.green : C.red, 5, () => { X.moveTo(760, 700); X.lineTo(760 + 150 * Math.cos(a), 700 + 150 * Math.sin(a)); }, { g: 18 }); dot(760, 700, 12, C.ink, 10);
      T('v = ' + Math.round(v) + ' km/h', 96, 1196, { k: 'mono', s: 28, c: ok ? C.green : C.red, g: 8 }); T(ok ? 'permitido' : 'multa', 984, 1196, { k: 'mono', s: 28, c: ok ? C.green : C.red, a: 'r', g: 8 });
      fade(A(t, 12, .5), () => F([['v', 'i'], [' ≤ 60', 'r', C.green]], CX, 1030, 96));
    });
  },
  // 5 · Sumar conserva: los dos termómetros suben 5 °C juntos.
  sumar(t) {
    stars(t, .3);
    const d = 5 * eio(seg(t, 10.6, 13.6));
    thermo(320, -12 + d, -15, 5, C.cyan, 'Moscú'); thermo(760, -3 + d, -15, 5, '#7fd6ff', 'Berlín');
    F([[neg(-12 + Math.round(d)), 'r', C.cyan], [' < ', 'r'], [neg(-3 + Math.round(d)), 'r', '#7fd6ff']], CX, 1310, 72);
    fade(A(t, 1, .5), () => T('a cada una: + ' + Math.round(d) + ' °C', 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 }));
  },
  // 6 · Multiplicar: × 2 conserva (barras que crecen igual); × (−1) voltea; deudas.
  multiplicar(t) {
    stars(t, .3);
    const px = nline(80, 1000, 760, -10, 15, { step: 1, lab: v => v % 5 === 0 });
    if (t < 9.8) { const k = eio(seg(t, 2, 4)); dot(px(lerp(3, 6, k)), 760, 13, C.cyan, 24); dot(px(lerp(7, 14, k)), 760, 13, C.amber, 24); T(String(Math.round(lerp(3, 6, k))), px(lerp(3, 6, k)), 700, { k: 'r', s: 40, a: 'c', c: C.cyan }); T(String(Math.round(lerp(7, 14, k))), px(lerp(7, 14, k)), 700, { k: 'r', s: 40, a: 'c', c: C.amber }); fade(A(t, 4.4, .4), () => F([['3 · 2 = 6', 'r', C.cyan], [' < ', 'r', C.green], ['14 = 7 · 2', 'r', C.amber]], CX, 980, 60)); }
    else {
      const k = eio(seg(t, 11, 14)), a = lerp(3, -3, k), b = lerp(7, -7, k), ya = 760 - 120 * Math.sin(Math.PI * k), yb = 760 - 200 * Math.sin(Math.PI * k);
      dot(px(a), ya, 13, C.cyan, 24); dot(px(b), yb, 13, C.amber, 24); T(neg(Math.round(a)), px(a), ya - 50, { k: 'r', s: 40, a: 'c', c: C.cyan }); T(neg(Math.round(b)), px(b), yb - 50, { k: 'r', s: 40, a: 'c', c: C.amber });
      fade(A(t, 14.4, .4), () => F([['−3', 'r', C.cyan], [' > ', 'r', C.mag], ['−7', 'r', C.amber]], CX, 980, 96));
      fade(A(t, 20, .6), () => { [['deber 3', 3, C.cyan], ['deber 7', 7, C.amber]].forEach(([s, n, c], i) => { const x = 220 + i * 420; T(s, x + 150, 1140, { k: 'mono', s: 26, c, a: 'c' }); for (let j = 0; j < n; j++) { stroke(C.mag, 2.5, () => X.roundRect(x + j * 44, 1170, 36, 50, 6), { g: 6 }); } }); T('mejor deber menos', CX, 1300, { k: 'mono', s: 26, c: C.green, a: 'c', g: 8 }); });
    }
  },
  // 7 · El espejo: la recta se refleja en el cero; 3 y 7 cambian de lado y el orden queda al revés.
  espejo(t) {
    stars(t, .3);
    const k = eio(seg(t, 2, 5)), y = 760, px = v => CX + v * 56;
    stroke('rgba(225,232,255,.9)', 3, () => { X.moveTo(80, y); X.lineTo(1000, y); }, { g: 6 });
    for (let v = -8; v <= 8; v++) { stroke('rgba(225,232,255,.9)', 2, () => { X.moveTo(px(v), y - 10); X.lineTo(px(v), y + 10); }, { g: 0 }); if (v % 2 === 0) T(neg(v), px(v), y + 50, { k: 'r', s: 28, a: 'c', c: '#b9c3e6' }); }
    stroke('rgba(210,225,255,.85)', 3, () => { X.moveTo(CX, 520); X.lineTo(CX, 960); }, { g: 18 });
    // la recta reflejada: cada punto gira alrededor del cero (como una página que se voltea)
    [[3, C.cyan], [7, C.amber]].forEach(([v, c]) => { const x = CX + v * 56 * Math.cos(Math.PI * k), yy = y - v * 18 * Math.sin(Math.PI * k); dot(x, yy, 14, c, 26); T(k > .5 ? neg(-v) : String(v), x, yy - 44, { k: 'r', s: 40, a: 'c', c }); });
    fade(A(t, 5.4, .5), () => { arrow(px(-3) - 20, 900, px(-7) + 20, 900, C.mag, 1, 3); T('ahora el 7 queda a la izquierda', CX, 1080, { k: 'mono', s: 26, c: C.mag, a: 'c' }); });
    fade(A(t, 10.4, .6), () => { F([['3', 'r', C.cyan], [' < ', 'r'], ['7', 'r', C.amber], ['   ⟹   ', 'r'], ['−3', 'r', C.cyan], [' > ', 'r', C.mag], ['−7', 'r', C.amber]], CX, 1240, 72); });
  },
  // 8 · Valor absoluto: la distancia al cero como una barra; |−4.5| = 4.5; las barras de Weierstrass.
  absoluto(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, -6, 6, {});
    const v = t < 10 ? -4.5 : 4.5 * Math.cos(Math.max(0, t - 10.4) * .6), d = Math.abs(v);
    dot(px(v), 760, 13, v < 0 ? C.cyan : C.amber, 26);
    X.save(); X.fillStyle = hexA(C.green, .3); X.fillRect(Math.min(px(0), px(v)), 795, Math.abs(px(v) - px(0)), 22); X.restore();
    stroke(C.green, 2.5, () => X.rect(Math.min(px(0), px(v)), 795, Math.abs(px(v) - px(0)), 22), { g: 10 });
    T('|' + v.toFixed(1).replace('-', '−') + '| = ' + d.toFixed(1), 96, 1196, { k: 'mono', s: 28, c: C.green, g: 8 });
    fade(A(t, 1.4, .5), () => F([['|', 'r', C.green], ['−4.5', 'r', C.cyan], ['| = ', 'r', C.green], ['4.5', 'r', C.green]], CX, 980, 96));
    fade(A(t, 20, .6), () => { T('| |', CX, 1120, { k: 'r', s: 120, a: 'c', c: C.green, g: 20 }); T('Karl Weierstrass · 1841', CX, 1200, { k: 'mono', s: 25, c: C.mute, a: 'c' }); });
  },
  // 9 · Distancia: |b − a| en la recta; la pieza de 50 mm con su franja de tolerancia.
  distancia(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => {
      const px = nline(110, 990, 700, -4, 8, {});
      dot(px(-2), 700, 13, C.cyan, 24); dot(px(5), 700, 13, C.amber, 24); T('a = −2', px(-2), 650, { k: 'r', s: 36, a: 'c', c: C.cyan }); T('b = 5', px(5), 650, { k: 'r', s: 36, a: 'c', c: C.amber });
      stroke(C.green, 4, () => { X.moveTo(px(-2), 760); X.lineTo(px(5), 760); }, { g: 14 });
      F([['|5 − (−2)| = 7', 'r', C.green], ['      ', 'r'], ['|−2 − 5| = 7', 'r', C.green]], CX, 900, 52);
    });
    fade(A(t, 10, .6), () => {
      // la regla de la tolerancia
      const lo = 49.5, hi = 50.5, px = v => 140 + (v - lo) / (hi - lo) * 800;
      X.save(); X.fillStyle = hexA(C.green, .14); X.fillRect(px(49.8), 560, px(50.2) - px(49.8), 220); X.restore();
      stroke(C.green, 2.5, () => X.rect(px(49.8), 560, px(50.2) - px(49.8), 220), { g: 10 });
      stroke('rgba(225,232,255,.9)', 3, () => { X.moveTo(120, 780); X.lineTo(960, 780); }, { g: 6 });
      for (let i = 0; i <= 10; i++) { const v = lo + i * .1; stroke('rgba(225,232,255,.9)', i % 5 ? 1.5 : 2.5, () => { X.moveTo(px(v), 770); X.lineTo(px(v), 790); }, { g: 0 }); if (i % 2 === 0) T(v.toFixed(1), px(v), 830, { k: 'mono', s: 22, a: 'c', c: '#b9c3e6' }); }
      const pieces = [50.05, 49.9, 50.3, 50.15, 49.7, 50.0], n = clamp(Math.floor((t - 11) / 1.6) + 1, 0, 6); let ok = 0, bad = 0;
      for (let i = 0; i < n; i++) { const v = pieces[i], good = Math.abs(v - 50) <= .2 + 1e-9; good ? ok++ : bad++; const y = 600 + (i % 3) * 60; dot(px(v), y, 12, good ? C.green : C.red, 22); if (i === n - 1) T('x = ' + v.toFixed(2) + ' mm  →  |x − 50| = ' + Math.abs(v - 50).toFixed(2), CX, 920, { k: 'mono', s: 26, a: 'c', c: good ? C.green : C.red, g: 8 }); }
      T('sirven = ' + ok, 96, 1196, { k: 'mono', s: 26, c: C.green, g: 8 }); T('se rechazan = ' + bad, 984, 1196, { k: 'mono', s: 26, c: C.red, a: 'r', g: 8 });
      fade(A(t, 20.4, .6), () => F([['49.8 ≤ ', 'r'], ['x', 'i', C.green], [' ≤ 50.2', 'r']], CX, 1050, 72));
    });
  },
  // 10 · Cierre: los signos y las barras; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { T('<   >', CX, 760, { k: 'r', s: 200, a: 'c', c: C.cyan, g: 24 }); T('| |', CX, 960, { k: 'r', s: 140, a: 'c', c: C.green, g: 20 }); T('Harriot, 1631 · Weierstrass, 1841', CX, 1060, { k: 'mono', s: 25, c: C.mute, a: 'c' }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], [' < ', 'r'], ['b', 'i'], [' ⟺ ', 'r'], ['b', 'i'], [' − ', 'r'], ['a', 'i'], [' > 0', 'r']], 'menor que'], [[['a', 'i'], [' < ', 'r'], ['b', 'i'], [' ⟹ ', 'r'], ['a', 'i'], ['+', 'r'], ['c', 'i'], [' < ', 'r'], ['b', 'i'], ['+', 'r'], ['c', 'i']], 'sumar conserva'], [[['a', 'i'], ['<', 'r'], ['b', 'i'], [', ', 'r'], ['c', 'i'], [' < 0 ⟹ ', 'r'], ['ac', 'i'], [' > ', 'r', C.mag], ['bc', 'i']], 'por un negativo, se voltea'], [[['|', 'r'], ['b', 'i'], [' − ', 'r'], ['a', 'i'], ['|', 'r']], 'distancia']], 420, 170, 48);
      endCard(t, 19.6, D.TITLE, D.LINE, [C.cyan, C.green, C.amber]);
    });
  },
};
