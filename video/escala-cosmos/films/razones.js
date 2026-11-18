// «La medida de Leonardo» · escenas de la lección alg-12. Motor en kit.js y escala.js; guion en razones.data.js.
// El primer término de una razón va en ámbar, el segundo en cian; lo que la conserva en verde, lo que la deforma en rosa.
const A1 = C.amber, B1 = C.cyan;
// El hombre de Vitruvio esquemático: pies en (cx, base), altura Hh. k (0–1) cuánto va trazado.
function vitruvian(cx, base, Hh, k = 1, col = '#ffd9a0', o = {}) {
  const top = base - Hh, u = Hh / 10, sq = o.square ?? 1, ci = o.circle ?? 1;
  if (sq) stroke(hexA(col, .55), 2, () => X.rect(cx - Hh / 2, top, Hh * clamp(k * 2), Hh * clamp(k * 2 - .2)), { g: 6 });
  if (ci) ring(cx, top + Hh * .4, Hh * .6, hexA(col, .4), 2, clamp(k * 1.6 - .3));   // centro en el ombligo; toca la base del cuadrado
  const seg2 = [[cx, top + 1.15 * u, cx, top + 5.2 * u], [cx - Hh / 2, top + 2.1 * u, cx + Hh / 2, top + 2.1 * u], [cx, top + 5.2 * u, cx - .9 * u, base], [cx, top + 5.2 * u, cx + .9 * u, base]];
  seg2.forEach(([a, b, c, d], i) => { const q = clamp(k * 4 - i * .6); if (q > 0) stroke(col, 3, () => { X.moveTo(a, b); X.lineTo(lerp(a, c, q), lerp(b, d, q)); }, { g: 14 }); });
  if (k > .1) ring(cx, top + .55 * u, .55 * u, col, 3, clamp(k * 3));
}
// Pantalla (rectángulo de lados w × h centrado) con un círculo dentro; sx, sy estiran el contenido.
function screen(cx, cy, w, h, col, o = {}) {
  stroke(col, 3, () => X.roundRect(cx - w / 2, cy - h / 2, w, h, 10), { g: 14 });
  if (o.circle) { const r = o.circle; stroke(o.cc || C.green, 3, () => X.ellipse(cx, cy, r * (o.sx || 1), r * (o.sy || 1), 0, 0, 7), { g: 12 }); }
}
// Un balde: rectángulo de esquinas suaves con un asa.
function bucket(cx, cy, col, a = 1) { fade(a, () => { stroke(col, 2.5, () => { X.moveTo(cx - 24, cy - 26); X.lineTo(cx - 18, cy + 26); X.lineTo(cx + 18, cy + 26); X.lineTo(cx + 24, cy - 26); }, { g: 10 }); stroke(hexA(col, .6), 2, () => X.arc(cx, cy - 26, 22, Math.PI, 0), { g: 0 }); X.save(); X.fillStyle = hexA(col, .25); X.beginPath(); X.moveTo(cx - 22, cy - 12); X.lineTo(cx - 18, cy + 26); X.lineTo(cx + 18, cy + 26); X.lineTo(cx + 22, cy - 12); X.fill(); X.restore(); }); }
const MIX = [['cemento', C.violet, 1], ['arena', C.amber, 2], ['grava', C.cyan, 4]];
// Un vagón de tren esquemático, de largo w, apoyado en y.
function wagon(x, y, w, col, a = 1) { fade(a, () => { const h = w * .26; stroke(col, 3, () => X.roundRect(x, y - h - w * .06, w, h, w * .03), { g: 14 }); for (let i = 0; i < 4; i++) stroke(hexA(col, .6), 2, () => X.rect(x + w * (.08 + i * .22), y - h - w * .06 + h * .2, w * .14, h * .38), { g: 0 }); [.16, .3, .7, .84].forEach(f => ring(x + w * f, y - w * .03, w * .035, col, 2.5)); }); }

const S = {
  // 1 · Leonardo: el hombre dentro del círculo y el cuadrado; brazos = altura; la cara, un décimo.
  vitruvio(t) {
    stars(t, .5);
    const base = 1120, Hh = 600, cx = CX, top = base - Hh;
    vitruvian(cx, base, Hh, seg(t, .8, 6));
    fade(A(t, 1.6, .6), () => T('Leonardo da Vinci · hacia 1490', CX, 1220, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    fade(A(t, 9.8, .6), () => {
      const k = eo(seg(t, 10, 12));
      arrow(cx, top + 2.1 * 60 - 34, cx - Hh / 2 * k, top + 2.1 * 60 - 34, A1, k); arrow(cx, top + 2.1 * 60 - 34, cx + Hh / 2 * k, top + 2.1 * 60 - 34, A1, k);
      T('brazos', cx - Hh / 2 + 10, top + 2.1 * 60 - 54, { k: 'it', s: 34, c: A1 });
      const k2 = eo(seg(t, 12, 14)); arrow(cx + Hh / 2 + 50, base, cx + Hh / 2 + 50, base - Hh * k2, B1, k2);
      fade(A(t, 13.6, .4), () => T('altura', cx + Hh / 2 + 34, base - Hh / 2, { k: 'it', s: 34, a: 'r', c: B1 }));
    });
    fade(A(t, 18.8, .6), () => {
      const y0 = top + 1.15 * 60 - 66, y1 = top + 1.15 * 60 - 6;
      stroke(C.mag, 3, () => { X.moveTo(cx - 90, y0 + 8); X.lineTo(cx - 100, y0 + 8); X.lineTo(cx - 100, y1 + 8); X.lineTo(cx - 90, y1 + 8); });
      T('cara', cx - 112, (y0 + y1) / 2 + 18, { k: 'it', s: 32, a: 'r', c: C.mag });
      for (let i = 1; i < 10; i++) fade(A(t, 20 + i * .25, .3), () => stroke(hexA(C.mag, .45), 1.5, () => { X.moveTo(cx - Hh / 2 - 30, top + i * 60); X.lineTo(cx - Hh / 2 - 10, top + i * 60); }, { g: 0 }));
      fade(A(t, 22.6, .5), () => T('10 caras = 1 altura', cx - Hh / 2 - 20, top - 20, { k: 'mono', s: 22, c: C.mag }));
    });
    T('brazos : altura = ' + (t > 14 ? '1 : 1' : '…'), 96, 1300, { k: 'mono', s: 26, c: A1, g: 8 });
  },
  // 2 · Restar o dividir: la plántula duplica, el árbol apenas cambia; los dos crecieron 2 cm.
  restar(t) {
    stars(t, .3);
    fade(win(t, .5, 9.6), () => { F([['a', 'i', A1], [' − ', 'r'], ['b', 'i', B1]], 330, 720, 110); T('cuánto más', 330, 800, { k: 'mono', s: 26, c: C.mute, a: 'c' }); F([['a', 'i', A1], [' ÷ ', 'r'], ['b', 'i', B1]], 750, 720, 110); T('cuántas veces', 750, 800, { k: 'mono', s: 26, c: C.mute, a: 'c' }); });
    fade(A(t, 10, .6), () => {
      const g = eio(seg(t, 11, 15)), ground = 1150;
      stroke('rgba(200,210,245,.5)', 2, () => { X.moveTo(140, ground); X.lineTo(940, ground); }, { g: 0 });
      const hp = lerp(2, 4, g) * 60; bar(300, ground - hp, 60, hp, C.green, 1); dot(330, ground - hp - 14, 12, C.green, 20);
      const ht = lerp(200, 202, g) * 3; bar(720, ground - ht, 60, ht, C.amber, 1); dot(750, ground - ht - 50, 50, hexA(C.amber, .5), 30);
      T(lerp(2, 4, g).toFixed(1).replace('.0', '') + ' cm', 330, ground + 50, { k: 'r', s: 36, a: 'c', c: C.green });
      T(lerp(200, 202, g).toFixed(1).replace('.0', '') + ' cm', 750, ground + 50, { k: 'r', s: 36, a: 'c', c: C.amber });
      T('plántula', 330, ground + 94, { k: 'mono', s: 22, a: 'c', c: C.mute }); T('árbol joven', 750, ground + 94, { k: 'mono', s: 22, a: 'c', c: C.mute });
      fade(A(t, 15.4, .5), () => { T('+2 cm', 430, ground - 300, { k: 'r', s: 40, a: 'c', c: C.ink }); T('+2 cm', 620, ground - 300, { k: 'r', s: 40, a: 'c', c: C.ink }); });
      fade(A(t, 19.4, .6), () => { T('× 2', 430, ground - 230, { k: 'r', s: 56, a: 'c', c: C.green, g: 14 }); T('× 1.01', 620, ground - 230, { k: 'r', s: 44, a: 'c', c: C.amber, g: 10 }); });
      fade(A(t, 21, .6), () => F([['4 ÷ 2 = ', 'r'], ['2', 'r', C.green], ['      202 ÷ 200 = ', 'r'], ['1.01', 'r', C.amber]], CX, 410, 46, { max: 940 }));
    });
  },
  // 3 · Notación: a : b; el orden importa (cara : altura y altura : cara); b no es 0.
  notacion(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { F([['a', 'i', A1], [' : ', 'r'], ['b', 'i', B1]], CX, 720, 180); T('«a es a b»', CX, 840, { k: 'it', s: 56, a: 'c', c: '#c3ccec' }); fade(A(t, 4, .5), () => F([['a', 'i', A1], [' : ', 'r'], ['b', 'i', B1], [' = ', 'r'], ['a', 'i', A1], [' ÷ ', 'r'], ['b', 'i', B1]], CX, 1000, 80)); });
    fade(win(t, 10, 18.8), () => {
      bar(240, 560, 60, 30, C.mag, 1); bar(240, 620, 600, 30, B1, 1); T('cara', 220, 584, { k: 'it', s: 30, a: 'r', c: C.mag }); T('altura', 220, 644, { k: 'it', s: 30, a: 'r', c: B1 });
      fade(A(t, 11, .5), () => { F([['cara : altura = 1 : 10 = ', 'r'], ['0.1', 'r', C.mag]], CX, 820, 54); });
      fade(A(t, 13.4, .5), () => { F([['altura : cara = 10 : 1 = ', 'r'], ['10', 'r', B1]], CX, 920, 54); });
      fade(A(t, 15.4, .5), () => F([['1 : 10', 'r'], ['  ≠  ', 'r', C.red], ['10 : 1', 'r']], CX, 1080, 80));
    });
    fade(A(t, 19, .6), () => { F([['a', 'i', A1], [' : ', 'r'], ['0', 'r', C.red]], CX, 760, 160); stroke(C.red, 6, () => { X.moveTo(CX - 200, 800); X.lineTo(CX + 200, 600); }, { g: 20 }); T('dividir entre 0 no está definido', CX, 940, { k: 'mono', s: 28, c: C.red, a: 'c', g: 8 }); });
  },
  // 4 · Equivalentes: 16 : 9 crece a 1920 : 1080 (× 120) sin cambiar de forma; luego se pone de pie: 9 : 16.
  equivalentes(t) {
    stars(t, .3);
    const g = eio(seg(t, 12, 14.5)), rot = eio(seg(t, 21, 24)), w = lerp(480, 720, g) * lerp(1, .72, rot), h = w * 9 / 16;
    fade(A(t, .8, .6), () => {
      X.save(); X.translate(CX, 740); X.rotate(-Math.PI / 2 * rot); screen(0, 0, w, h, A1, { circle: h * .32 }); X.restore();
      if (rot < .05) { T(g > .5 ? '1920' : '16', CX, 740 - h / 2 - 22, { k: 'r', s: 40, a: 'c', c: A1 }); T(g > .5 ? '1080' : '9', CX + w / 2 + 20, 754, { k: 'r', s: 40, c: B1 }); }
      else fade(rot, () => { T('9', CX, 740 - w / 2 - 22, { k: 'r', s: 40, a: 'c', c: B1 }); T('16', CX + h / 2 + 20, 754, { k: 'r', s: 40, c: A1 }); });
      fade(A(t, 10.2, .5), () => F([['16 : 9', 'r', A1], [' = ', 'r'], ['32 : 18', 'r'], [' = ', 'r'], ['8 : 4.5', 'r']], CX, 1130, 52, { max: 940 }));
    });
    fade(win(t, 12, 20.4), () => { T('× 120', CX, 470, { k: 'mono', s: 34, c: C.green, a: 'c', g: 10 }); F([['16 · 120 = 1920      9 · 120 = 1080', 'r', C.green]], CX, 1220, 40); });
    fade(A(t, 22, .6), () => T('este video', CX, 1220, { k: 'it', s: 44, c: '#c3ccec', a: 'c' }));
    T('cociente = ' + (16 / 9).toFixed(3), 96, 1300, { k: 'mono', s: 26, c: A1, g: 8 });
  },
  // 5 · Sumar lo mismo deforma: 20 : 13 aplasta el círculo; × 2 lo deja redondo.
  sumar(t) {
    stars(t, .3);
    const d = eio(seg(t, 3, 6)), m = eio(seg(t, 20, 22.5)), h = 300;
    let w = lerp(h * 16 / 9, h * 20 / 13, d), sx = lerp(1, (20 / 13) / (16 / 9), d), col = d > .5 ? C.mag : A1;
    if (t >= 19) { w = lerp(h * 20 / 13, h * 16 / 9 * 1.12, m); sx = lerp((20 / 13) / (16 / 9), 1, m); col = m > .5 ? C.green : C.mag; }
    const hh = t >= 19 ? lerp(h, h * 1.12, m) : h;
    screen(CX, 720, w, hh, col, { circle: hh * .34, sx, cc: col });
    const lab = t < 19 ? (d > .5 ? '20 : 13' : '16 : 9') : (m > .5 ? '32 : 18' : '20 : 13');
    T(lab, CX, 720 - hh / 2 - 26, { k: 'r', s: 44, a: 'c', c: col, g: 8 });
    fade(A(t, 1.6, .5), () => F([['16 + 4 : 9 + 4', 'r'], [' = ', 'r'], ['20 : 13', 'r', C.mag]], CX, 1010, 56));
    fade(win(t, 10, 18.6), () => F([['20/13 ≈ ', 'r'], ['1.54', 'r', C.mag], ['      16/9 ≈ ', 'r'], ['1.78', 'r', A1]], CX, 1130, 50));
    fade(A(t, 19.6, .6), () => F([['16 · 2 : 9 · 2', 'r'], [' = ', 'r'], ['32 : 18', 'r', C.green], [' = 16 : 9', 'r']], CX, 1130, 52));
    check(CX + 280, 1220, 20, t >= 19 && m > .9, A(t, 23, .5)); check(CX + 280, 1220, 20, false, t < 19 ? A(t, 6.4, .5) : 0);
    T('cociente = ' + (t < 19 ? (d > .5 ? 20 / 13 : 16 / 9) : (m > .5 ? 16 / 9 : 20 / 13)).toFixed(3), 96, 1300, { k: 'mono', s: 26, c: col, g: 8 });
  },
  // 6 · Parte a parte: 1 balde de cemento, 2 de arena, 4 de grava; luego 3, 6 y 12.
  parteparte(t) {
    stars(t, .3);
    const big = t >= 19, k = eio(seg(t, 19.4, 21.4));
    MIX.forEach(([name, col, n], j) => {
      const x = 240 + j * 300, cnt = big ? n * 3 : n;
      fade(A(t, 1 + j * .6, .5), () => {
        T(name, x, 470, { k: 'it', s: 38, a: 'c', c: col });
        for (let i = 0; i < cnt; i++) { const cols = big ? 3 : 2, r = Math.floor(i / cols), c = i % cols, sc = big ? .62 : 1; X.save(); X.translate(x + (c - (cols - 1) / 2) * 66 * sc, 580 + r * 84 * sc); X.scale(sc, sc); bucket(0, 0, col, big ? clamp(k * cnt - i) : 1); X.restore(); }
        T(String(cnt), x, 1140, { k: 'r', s: 64, a: 'c', c: col, g: 12 });
      });
    });
    fade(A(t, 3, .5), () => { T(':', 390, 1140, { k: 'r', s: 64, a: 'c' }); T(':', 690, 1140, { k: 'r', s: 64, a: 'c' }); });
    fade(win(t, 10, 18.8), () => { F([['por cada ', 'it'], ['1', 'r', C.violet], [' de cemento, ', 'it'], ['2', 'r', C.amber], [' de arena', 'it']], CX, 1250, 40); });
    fade(A(t, 19.4, .5), () => T('× 3', CX, 410, { k: 'mono', s: 34, c: C.green, a: 'c', g: 10 }));
  },
  // 7 · Parte al todo: la mezcla en una barra de 7 partes; el cemento es 1/7. 21 baldes → 3, 6 y 12.
  partetodo(t) {
    stars(t, .3);
    const x0 = 150, w = 780, u = w / 7, y = 640;
    let acc = 0;
    MIX.forEach(([name, col, n], j) => { fade(A(t, 1 + j * .5, .5), () => { bar(x0 + acc * u, y, n * u, 110, col, 1, { fill: .3 }); T(name, x0 + (acc + n / 2) * u, y + 170, { k: 'it', s: 32, a: 'c', c: col }); }); acc += n; });
    for (let i = 1; i < 7; i++) fade(A(t, 10.4 + i * .3, .3), () => stroke('rgba(220,230,255,.6)', 1.5, () => { X.moveTo(x0 + i * u, y - 14); X.lineTo(x0 + i * u, y + 124); }, { g: 0 }));
    fade(A(t, 10.4, .5), () => { for (let i = 0; i < 7; i++) T(String(i + 1), x0 + (i + .5) * u, y + 70, { k: 'r', s: 40, a: 'c', c: C.ink }); });
    fade(A(t, 13, .6), () => { stroke(C.violet, 3, () => { X.moveTo(x0, y - 30); X.lineTo(x0, y - 44); X.lineTo(x0 + u, y - 44); X.lineTo(x0 + u, y - 30); }); FR(1, 7, x0 + u / 2, y - 110, 50, C.violet, { g: 12 }); T('de la mezcla', x0 + u + 30, y - 96, { k: 'it', s: 34, c: C.violet }); });
    fade(win(t, 1.6, 9.6), () => F([['cemento : mezcla', 'it'], [' = 1 : 7', 'r']], CX, 1020, 54));
    fade(A(t, 19.2, .6), () => {
      F([['21 baldes:  ', 'r'], ['21 · 1/7 = 3', 'r', C.violet]], CX, 1000, 48, { max: 940 });
      F([['21 · 2/7 = 6', 'r', C.amber], ['      ', 'r'], ['21 · 4/7 = 12', 'r', C.cyan]], CX, 1090, 48, { max: 940 });
    });
    T('partes = 1 + 2 + 4 = 7', 96, 1300, { k: 'mono', s: 26, c: C.violet, g: 8 });
  },
  // 8 · Unidades distintas: la recta de 100 m de Bolt; el reloj corre 9.58 s; 10.4 m cada segundo.
  unidades(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => [['metros / segundo', A1], ['pesos / kilo', C.green], ['litros / minuto', B1]].forEach(([s, c], i) => fade(A(t, 1 + i * .6, .4), () => chip(CX, 620 + i * 150, 520, 100, c, s, { k: 'it', s: 42 }))));
    fade(A(t, 10, .6), () => {
      const y = 760, x0 = 140, x1 = 940, rt = clamp(t - 11, 0, 9.58), d = 100 * rt / 9.58;
      stroke('rgba(225,232,255,.8)', 3, () => { X.moveTo(x0, y); X.lineTo(x1, y); }, { g: 6 });
      for (let m = 0; m <= 100; m += 10) { const x = lerp(x0, x1, m / 100); stroke('rgba(225,232,255,.6)', 2, () => { X.moveTo(x, y - 10); X.lineTo(x, y + 10); }, { g: 0 }); if (m % 50 === 0) T(m + ' m', x, y + 54, { k: 'r', s: 30, a: 'c', c: '#b9c3e6' }); }
      stroke(C.green, 3, () => { X.moveTo(x1, y - 60); X.lineTo(x1, y + 20); }, { g: 14 });
      dot(lerp(x0, x1, d / 100), y - 30, 14, A1, 30);
      T('t = ' + rt.toFixed(2) + ' s', 300, 640, { k: 'mono', s: 34, c: B1, g: 8 }); T('d = ' + d.toFixed(1) + ' m', 780, 640, { k: 'mono', s: 34, c: A1, a: 'r', g: 8 });
      fade(A(t, 20, .6), () => {
        for (let s = 1; s <= 9; s++) fade(A(t, 20.4 + s * .2, .3), () => { const x = lerp(x0, x1, s * 10.438 / 100); stroke(hexA(C.green, .8), 2, () => { X.moveTo(x, y + 80); X.lineTo(x, y + 110); }, { g: 8 }); T(s + ' s', x, y + 146, { k: 'mono', s: 20, a: 'c', c: C.green }); });
        T('si fuera siempre igual de rápido', CX, y + 200, { k: 'mono', s: 22, a: 'c', c: C.mute }); F([['100 m', 'r', A1], [' ÷ ', 'r'], ['9.58 s', 'r', B1], [' ≈ ', 'r'], ['10.4 m/s', 'r', C.green]], CX, 1100, 62);
      });
    });
  },
  // 9 · Escala 1 : 87: el vagón de 23 cm junto a una regla; crece hasta el vagón real de 20 m.
  escala(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { F([['modelo', 'it', A1], [' : ', 'r'], ['real', 'it', B1]], CX, 720, 96); T('una razón de longitudes', CX, 820, { k: 'mono', s: 26, c: C.mute, a: 'c' }); });
    fade(A(t, 10, .6), () => {
      const g = eio(seg(t, 12.5, 16)), w = lerp(230, 820, g), x = lerp(150, CX - 410, g);
      wagon(x, 860, w, g > .5 ? B1 : A1);
      fade(1 - g, () => { stroke('rgba(225,232,255,.7)', 2, () => { X.moveTo(150, 900); X.lineTo(380, 900); }, { g: 0 }); for (let i = 0; i <= 23; i++) stroke('rgba(225,232,255,.6)', 1.5, () => { X.moveTo(150 + i * 10, 900); X.lineTo(150 + i * 10, 900 + (i % 5 ? 8 : 16)); }, { g: 0 }); T('23 cm', 265, 950, { k: 'r', s: 32, a: 'c', c: A1 }); });
      fade(A(t, 12.5, .5), () => T('× 87', CX, 520, { k: 'mono', s: 40, c: C.green, a: 'c', g: 12 }));
      fade(A(t, 16, .5), () => T('vagón real (no a escala en pantalla)', CX, 950, { k: 'mono', s: 22, c: C.mute, a: 'c' }));
      fade(A(t, 20.2, .6), () => { F([['23 cm', 'r', A1], [' · 87 = ', 'r'], ['2 001 cm', 'r', B1], [' ≈ 20 m', 'r']], CX, 1090, 60); });
    });
    T('escala = 1 : 87', 96, 1300, { k: 'mono', s: 26, c: C.green, g: 8 });
  },
  // 10 · Cierre: el mismo dibujo en dos tamaños, con las mismas razones; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { vitruvian(330, 1100, 460, 1); vitruvian(800, 1100, 280, 1, B1); T('1 : 1', 330, 1160, { k: 'r', s: 40, a: 'c', c: '#ffd9a0' }); T('1 : 1', 800, 1160, { k: 'r', s: 40, a: 'c', c: B1 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i', A1], [' : ', 'r'], ['b', 'i', B1], [' = ', 'r'], ['a', 'i', A1], [' ÷ ', 'r'], ['b', 'i', B1]], 'razón (b ≠ 0)'], [[['a', 'i'], [' : ', 'r'], ['b', 'i'], [' = ', 'r'], ['ka', 'i', C.green], [' : ', 'r'], ['kb', 'i', C.green]], 'equivalentes'], [[['1 : 2 : 4', 'r']], 'parte a parte'], [[['1 : 7', 'r']], 'parte al todo']], 420, 170, 50);
      endCard(t, 19.6, D.TITLE, D.LINE, [A1, C.green, B1]);
    });
  },
};
