// «Tres luces, ocho colores» · escenas de la lección alg-0c. El motor (letras, trazos, HUD, film) está en kit.js y el
// guion en data.js. Un color de pantalla es una máscara de bits de las luces que lleva: R = 1, G = 2, B = 4.
// R = colores con luz roja, G = colores con luz verde; el universo U son los ocho colores.
const LR = '#ff2a3c', LG = '#20e060', LB = '#3a6cff';
const UB = { x: 80, y: 320, w: 920, h: 840 }, CR = [430, 740, 240], CG = [650, 740, 240];
const ZONE = { 1: [290, 650], 5: [290, 830], 3: [540, 650], 7: [540, 830], 2: [790, 650], 6: [790, 830], 4: [170, 410], 0: [910, 1080] };
const inC = (x, y, c) => (x - c[0]) ** 2 + (y - c[1]) ** 2 <= c[2] ** 2;
// Luz de un círculo: relleno que se suma («lighter») con el de los otros, así el cruce de rojo y verde se ve amarillo.
function light(c, col, a) { if (a <= 0) return; X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha *= a; const g = X.createRadialGradient(c[0], c[1], c[2] * .2, c[0], c[1], c[2]); g.addColorStop(0, col); g.addColorStop(1, hexA(col, .55)); X.fillStyle = g; X.beginPath(); X.arc(c[0], c[1], c[2], 0, 7); X.fill(); X.restore(); }
// Un color del universo: su muestra y su nombre. o: a, hi (resaltado), dim (apagado), n (número al contarlo, con color nc).
function sw(m, x, y, o = {}) {
  const [name, col] = D.COLORS[m];
  fade((o.a ?? 1) * (o.dim ? .22 : 1), () => {
    if (m === 0) { X.save(); X.beginPath(); X.arc(x, y, 28, 0, 7); X.fillStyle = '#05060c'; X.fill(); X.restore(); ring(x, y, 28, 'rgba(200,210,245,.75)', 2, 1, { g: 0 }); } else dot(x, y, 28, col, o.hi ? 40 : 16);
    if (o.hi) ring(x, y, 40, C.ink, 2.5, 1);
    X.save(); X.fillStyle = 'rgba(4,6,14,.72)'; X.font = font('mono', 21); const w = X.measureText(name).width; X.beginPath(); X.roundRect(x - w / 2 - 8, y + 38, w + 16, 28, 8); X.fill(); X.restore();
    T(name, x, y + 59, { k: 'mono', s: 21, a: 'c', c: C.ink });
    if (o.n) T(String(o.n), x + 38, y - 24, { k: 'mono', s: 30, c: o.nc || C.amber, g: 10 });
  });
}
// El diagrama: U, los círculos R y G con su luz y los ocho colores en su zona. o: a, u (U), k (trazo de los círculos),
// lum (luz), reg (predicado de la zona encendida: (enR, enG) → bool), rk (cuánto de la zona, 0–1), mark(m) → opciones de sw.
function venn(t, o = {}) {
  fade(o.a ?? 1, () => {
    fade(o.u ?? 1, () => { stroke('rgba(200,210,245,.7)', 2.5, () => X.roundRect(UB.x, UB.y, UB.w, UB.h, 26), { g: 6 }); T('U', UB.x + UB.w - 70, UB.y + 86, { k: 'i', s: 80, c: C.ink }); });
    const k = o.k ?? 1;
    light(CR, LR, (o.lum ?? .22) * k); light(CG, LG, (o.lum ?? .22) * k);
    if (o.reg) { const rk = o.rk ?? 1, lim = UB.x + UB.w * rk; X.save(); X.fillStyle = 'rgba(238,242,255,.82)'; for (let x = UB.x + 16; x < Math.min(UB.x + UB.w - 8, lim); x += 15) for (let y = UB.y + 16; y < UB.y + UB.h - 8; y += 15) if (o.reg(inC(x, y, CR), inC(x, y, CG))) X.fillRect(x - 2, y - 2, 4.4, 4.4); X.restore(); }
    ring(CR[0], CR[1], CR[2], LR, 4, k); ring(CG[0], CG[1], CG[2], LG, 4, k);
    fade(k, () => { T('R', 250, 470, { k: 'i', s: 84, c: LR, g: 16 }); T('G', 780, 470, { k: 'i', s: 84, c: LG, g: 16 }); });
    for (let m = 0; m < 8; m++) { const z = o.pos ? o.pos(m) : ZONE[m]; sw(m, z[0], z[1], o.mark ? o.mark(m) : {}); }
  });
}
// El resultado por extensión: = {rojo, magenta, …}, cada nombre en su color.
function listParts(pred, lead) {
  const p = [...lead, [' = {', 'r']], ms = [1, 5, 3, 7, 2, 6, 4, 0].filter(pred);
  ms.forEach((m, i) => { p.push([D.COLORS[m][0], 'it', m === 0 ? '#aab4d8' : D.COLORS[m][1]]); if (i < ms.length - 1) p.push([', ', 'r']); });
  p.push(['}', 'r']); return { p, n: ms.length };
}
// Una operación: se enciende su zona, sale el símbolo grande con su lectura y luego el conjunto que da.
function opScene(t, key, sym, read, lead, o = {}) {
  stars(t, .3);
  const pred = D.OPS[o.alt && t > 10 && t < 18.6 ? o.alt : key], reg = { union: (r, g) => r || g, inter: (r, g) => r && g, dif: (r, g) => r && !g, difGR: (r, g) => g && !r, comp: r => !r, sim: (r, g) => r !== g }[o.alt && t > 10 && t < 18.6 ? o.alt : key];
  const rk = o.alt && t > 10 ? (t < 18.6 ? eio(seg(t, 10.2, 12.4)) : eio(seg(t, 18.8, 20.4))) : eio(seg(t, 1.4, 4.6));
  venn(t, { reg, rk, mark: m => (rk > .9 ? (pred(m) ? { hi: true } : { dim: true }) : {}) });
  const altNow = o.alt && t > 10 && t < 18.6;
  fade(A(t, 5, .6), () => { F(altNow ? o.altLead : lead, CX, 1300, 120, { rev: altNow ? seg(t, 10.4, 12) : seg(t, 5.2, 7) }); T(altNow ? o.altRead : read, CX, 1368, { k: 'it', s: 40, a: 'c', c: '#c3ccec' }); });
  fade(A(t, 19.2, .6), () => { const L = listParts(D.OPS[key], lead); F(L.p, CX, 1470, 46, { rev: seg(t, 19.4, 23), max: 940 }); T('n = ' + L.n, 984, 1236, { k: 'mono', s: 26, c: C.amber, a: 'r', g: 8 }); });
}

const S = {
  // 1 · Tu pantalla: se acerca hasta ver los tríos de luces; luego se apaga la azul y, de lejos, es amarillo.
  pantalla(t) {
    const zin = eio(seg(t, 1.4, 8.6)), zout = eio(seg(t, 21.4, 24.6)), p = lerp(4, 132, zin) * lerp(1, .05, zout), blueOff = eio(seg(t, 18.2, 20.6));
    const x0 = 160, y0 = 330, w = 760, h = 860, bars = clamp((p - 7) / 9);
    X.save(); X.beginPath(); X.roundRect(x0, y0, w, h, 22); X.clip();
    const far = `rgb(${255}, ${Math.round(lerp(255, 232, blueOff))}, ${Math.round(lerp(255, 58, blueOff))})`;
    fade(1 - bars, () => { X.fillStyle = far; X.fillRect(x0, y0, w, h); });
    if (bars > 0) fade(bars, () => {
      X.fillStyle = '#02030a'; X.fillRect(x0, y0, w, h);
      const cx = x0 + w / 2, cy = y0 + h / 2, nx = Math.ceil(w / p / 2) + 1, ny = Math.ceil(h / p / 2) + 1, bw = p / 3 * .78, bh = p * .84;
      [[LR, 1], [LG, 1], [LB, 1 - blueOff * .93]].forEach(([col, al], j) => { X.fillStyle = col; X.globalAlpha = bars * al; if (p > 40) { X.shadowColor = col; X.shadowBlur = p * .12; } for (let i = -nx; i <= nx; i++) for (let k = -ny; k <= ny; k++) X.fillRect(cx + i * p + j * p / 3 - p / 2 + p * .04, cy + k * p - bh / 2, bw, bh); X.shadowBlur = 0; });
    });
    X.restore();
    stroke('rgba(200,210,245,.6)', 2.5, () => X.roundRect(x0, y0, w, h, 22), { g: 6 });
    T('zoom × ' + num(Math.round(p / 4 * 10) / 10, 1), 96, 1250, { k: 'mono', s: 26, c: C.amber, g: 8 });
    fade(A(t, 5, .6), () => T('luces por píxel = 3', 96, 1286, { k: 'mono', s: 26, c: C.mute }));
    fade(A(t, 18.4, .6), () => { T('roja: prendida', 984, 1250, { k: 'mono', s: 24, c: LR, a: 'r' }); T('verde: prendida', 984, 1286, { k: 'mono', s: 24, c: LG, a: 'r' }); T('azul: apagada', 984, 1322, { k: 'mono', s: 24, c: C.mute, a: 'r' }); });
  },
  // 2 · Londres, 1861: tres proyectores sobre un mismo disco. Luego, las tres curvas de los conos del ojo.
  maxwell(t) {
    stars(t, .4);
    const on = [A(t, 1.8, .8), A(t, 3.8, .8), A(t, 5.8, .8)], cols = [LR, LG, LB], px = [250, 540, 830], sx = 540, sy = 560, sr = 190, top = win(t, .4, 18);
    fade(top, () => {
      X.save(); X.beginPath(); X.arc(sx, sy, sr, 0, 7); X.fillStyle = '#05060c'; X.fill(); X.restore();
      cols.forEach((c, i) => {
        X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha *= on[i];
        const g = X.createLinearGradient(px[i], 1150, sx, sy); g.addColorStop(0, hexA(c, .5)); g.addColorStop(1, hexA(c, .1)); X.fillStyle = g;
        X.beginPath(); X.moveTo(px[i] - 16, 1150); X.lineTo(sx - sr * .34, sy + sr * .94); X.lineTo(sx + sr * .34, sy + sr * .94); X.lineTo(px[i] + 16, 1150); X.fill();
        X.fillStyle = c; X.beginPath(); X.arc(sx, sy, sr, 0, 7); X.fill();
        X.restore();
        fade(1, () => { stroke(c, 3, () => X.roundRect(px[i] - 44, 1150, 88, 60, 10), { g: on[i] * 16 }); T(['filtro rojo', 'filtro verde', 'filtro azul'][i], px[i], 1250, { k: 'mono', s: 21, c, a: 'c' }); });
      });
      // el tartán: franjas oscuras cruzadas sobre el disco
      const kt = A(t, 9.8, 1.2);
      if (kt > 0) { X.save(); X.beginPath(); X.arc(sx, sy, sr, 0, 7); X.clip(); X.globalAlpha *= kt * .55; [['#c0102a', 30], ['#0a4a2a', 22], ['#10206a', 16], ['#c0102a', 12]].forEach(([c, wd], j) => { X.fillStyle = c; for (let q = -6; q <= 6; q++) { X.fillRect(sx + q * 74 + j * 17 - wd / 2, sy - sr, wd, sr * 2); X.fillRect(sx - sr, sy + q * 74 + j * 17 - wd / 2, sr * 2, wd); } }); X.restore(); }
      ring(sx, sy, sr, 'rgba(220,228,255,.8)', 2.5, 1, { g: 8 });
      T('luces prendidas = ' + on.filter(v => v > .5).length, 96, 1330, { k: 'mono', s: 26, c: C.amber, g: 8 });
      fade(A(t, 10.4, .6), () => T('la foto: una cinta de tartán', 984, 1330, { k: 'mono', s: 24, c: C.mute, a: 'r' }));
    });
    // los tres tipos de conos: sensibilidad según la longitud de onda
    fade(win(t, 18, 26), () => {
      const gx = v => 150 + (v - 380) / 340 * 800, gy = v => 1050 - v * 520, kd = eio(seg(t, 18.6, 22.4));
      stroke('rgba(200,210,245,.7)', 2, () => { X.moveTo(150, 1050); X.lineTo(950, 1050); X.moveTo(150, 1050); X.lineTo(150, 500); }, { g: 0 });
      [400, 500, 600, 700].forEach(v => { T(String(v), gx(v), 1090, { k: 'mono', s: 21, c: C.mute, a: 'c' }); stroke('rgba(200,210,245,.5)', 1.5, () => { X.moveTo(gx(v), 1050); X.lineTo(gx(v), 1062); }, { g: 0 }); });
      T('longitud de onda (nm)', 550, 1132, { k: 'mono', s: 21, c: C.mute, a: 'c' }); T('sensibilidad', 164, 480, { k: 'mono', s: 21, c: C.mute });
      [[440, 26, LB, 'conos S'], [535, 42, LG, 'conos M'], [565, 46, LR, 'conos L']].forEach(([mu, sg, c, lab]) => { stroke(c, 4, () => { for (let v = 380; v <= 380 + 340 * kd; v += 2) { const yv = Math.exp(-((v - mu) ** 2) / (2 * sg * sg)); v === 380 ? X.moveTo(gx(v), gy(yv)) : X.lineTo(gx(v), gy(yv)); } }); fade(A(t, 22.4, .6), () => T(lab, gx(mu) + (mu === 565 ? 70 : mu === 535 ? -10 : 0), gy(1) - 22, { k: 'mono', s: 22, c, a: 'c' })); });
      T('tipos de conos = 3', 96, 1330, { k: 'mono', s: 26, c: C.amber, g: 8 });
    });
  },
  // 3 · Universo: los ocho colores de un píxel (cada luz prendida o apagada) y, dentro, los conjuntos R y G.
  universo(t) {
    stars(t, .3);
    const mv = eio(seg(t, 20.4, 23.4)), grid = m => [200 + (m % 4) * 227, 560 + Math.floor(m / 4) * 330];
    venn(t, { u: A(t, .8, 1.2), k: eio(seg(t, 20.2, 23)), pos: m => { const g = grid(m), z = ZONE[m]; return [lerp(g[0], z[0], mv), lerp(g[1], z[1], mv)]; }, mark: m => ({ a: A(t, 10.2 + m * .5, .5) }) });
    // bajo cada color, qué luces lleva
    fade(win(t, 10.4, 20.4), () => { for (let m = 0; m < 8; m++) { const g = grid(m); fade(A(t, 10.4 + m * .5, .5), () => [LR, LG, LB].forEach((c, i) => { const on = m & (1 << i); on ? dot(g[0] - 26 + i * 26, g[1] + 96, 8, c, 10) : ring(g[0] - 26 + i * 26, g[1] + 96, 8, 'rgba(160,180,240,.45)', 1.5, 1, { g: 0 }); })); } });
    fade(win(t, 1.6, 9.6), () => T('universo: todo de lo que se va a hablar', CX, 760, { k: 'it', s: 44, a: 'c', c: '#c3ccec', max: 820 }));
    fade(A(t, 12, .6), () => T('n(U) = 2 · 2 · 2 = 8', 96, 1236, { k: 'mono', s: 26, c: C.amber, g: 8 }));
    fade(A(t, 23.6, .6), () => { F([['R', 'i', LR], [' = {', 'r'], ['rojo', 'it', LR], [', ', 'r'], ['magenta', 'it', D.COLORS[5][1]], [', ', 'r'], ['amarillo', 'it', D.COLORS[3][1]], [', ', 'r'], ['blanco', 'it'], ['}', 'r']], CX, 1320, 44, { rev: seg(t, 23.8, 26), max: 940 }); F([['G', 'i', LG], [' = {', 'r'], ['verde', 'it', LG], [', ', 'r'], ['cian', 'it', D.COLORS[6][1]], [', ', 'r'], ['amarillo', 'it', D.COLORS[3][1]], [', ', 'r'], ['blanco', 'it'], ['}', 'r']], CX, 1400, 44, { rev: seg(t, 26, 28.2), max: 940 }); });
  },
  union(t) { opScene(t, 'union', '∪', '«R unión G»: está en R o en G', [['R', 'i', LR], [' ∪ ', 'r', C.amber], ['G', 'i', LG]]); },
  inter(t) { opScene(t, 'inter', '∩', '«R intersección G»: está en R y en G', [['R', 'i', LR], [' ∩ ', 'r', C.amber], ['G', 'i', LG]]); },
  dif(t) { opScene(t, 'dif', '−', '«R menos G»: está en R pero no en G', [['R', 'i', LR], [' − ', 'r', C.amber], ['G', 'i', LG]], { alt: 'difGR', altLead: [['G', 'i', LG], [' − ', 'r', C.amber], ['R', 'i', LR]], altRead: '«G menos R»: está en G pero no en R' }); },
  comp(t) { opScene(t, 'comp', 'ᶜ', '«R complemento»: está en U pero no en R', [['R', 'i', LR], ['ᶜ', 'r', C.amber]]); },
  sim(t) { opScene(t, 'sim', '△', '«R diferencia simétrica G»: está en uno solo', [['R', 'i', LR], [' △ ', 'r', C.amber], ['G', 'i', LG]]); },
  // 9 · Contar la unión: 4 + 4 cuenta dos veces a los del cruce.
  contar(t) {
    stars(t, .3);
    const cr = clamp(Math.floor((t - 1.6) / .7) + 1, 0, 4), cg = clamp(Math.floor((t - 5) / .7) + 1, 0, 4), twice = t > 10 && t < 20;
    venn(t, { mark: m => { const ir = D.R.indexOf(m), ig = D.G.indexOf(m); if (ir < 0 && ig < 0) return { dim: true }; return { hi: twice && ir >= 0 && ig >= 0, n: ig >= 0 && ig < cg && t > 5 ? ig + 1 : ir >= 0 && ir < cr ? ir + 1 : 0, nc: ig >= 0 && ig < cg && t > 5 ? LG : LR }; } });
    T('n(R) = ' + cr, 96, 1236, { k: 'mono', s: 26, c: LR, g: 8 }); fade(A(t, 5, .4), () => T('n(G) = ' + cg, 330, 1236, { k: 'mono', s: 26, c: LG, g: 8 }));
    fade(A(t, 8.2, .5), () => T('4 + 4 = 8 ≠ 6', 984, 1236, { k: 'mono', s: 26, c: C.red, a: 'r', g: 8 }));
    fade(win(t, 10.4, 19.6), () => T('amarillo y blanco: contados dos veces', CX, 1320, { k: 'mono', s: 25, c: C.amber, a: 'c', g: 8 }));
    fade(A(t, 20.2, .6), () => { F([['4', 'r', LR], [' + ', 'r'], ['4', 'r', LG], [' − ', 'r'], ['2', 'r', C.amber], [' = ', 'r'], ['6', 'r']], CX, 1340, 110, { rev: seg(t, 20.4, 23.4) });
      F([['n', 'i'], ['(', 'r'], ['A', 'i', LR], [' ∪ ', 'r'], ['B', 'i', LG], [') = ', 'r'], ['n', 'i'], ['(', 'r'], ['A', 'i', LR], [') + ', 'r'], ['n', 'i'], ['(', 'r'], ['B', 'i', LG], [') − ', 'r'], ['n', 'i'], ['(', 'r'], ['A', 'i', LR], [' ∩ ', 'r', C.amber], ['B', 'i', LG], [')', 'r']], CX, 1450, 50, { rev: seg(t, 24, 28), max: 940 }); });
  },
  // 10 · Cierre: con la luz azul, tres círculos y ocho zonas, una para cada color.
  cierre(t) {
    stars(t, .5);
    const c3 = [[430, 640, 235, LR], [650, 640, 235, LG], [540, 830, 235, LB]], pos = { 1: [300, 560], 2: [780, 560], 4: [540, 965], 3: [540, 520], 5: [392, 800], 6: [688, 800], 7: [540, 700], 0: [160, 1090] };
    fade(win(t, .4, 19.8), () => {
      stroke('rgba(200,210,245,.7)', 2.5, () => X.roundRect(UB.x, 320, UB.w, 860, 26), { g: 6 }); T('U', UB.x + UB.w - 70, 406, { k: 'i', s: 80, c: C.ink });
      c3.forEach(([x, y, r, c], i) => { const k = i < 2 ? 1 : eio(seg(t, 1, 3.4)); light([x, y, r], c, .3 * k); ring(x, y, r, c, 4, k); });
      T('R', 232, 430, { k: 'i', s: 76, c: LR, g: 16 }); T('G', 800, 430, { k: 'i', s: 76, c: LG, g: 16 }); fade(A(t, 3, .6), () => T('B', 760, 1050, { k: 'i', s: 76, c: LB, g: 16 }));
      for (let m = 0; m < 8; m++) { const z = pos[m]; sw(m, z[0], z[1], { a: A(t, 3.6 + m * .45, .5), hi: m === 7 && t > 10.4 }); }
      T('zonas = ' + clamp(Math.floor((t - 3.6) / .45) + 1, 0, 8), 96, 1250, { k: 'mono', s: 26, c: C.amber, g: 8 });
      fade(A(t, 10.6, .6), () => F([['R', 'i', LR], [' ∩ ', 'r', C.amber], ['G', 'i', LG], [' ∩ ', 'r', C.amber], ['B', 'i', LB], [' = {', 'r'], ['blanco', 'it'], ['}', 'r']], CX, 1360, 72, { rev: seg(t, 10.8, 14), max: 940 }));
    });
    fade(win(t, 20, 34.4, .6), () => {
      const rows = [[[['R', 'i', LR], [' ∪ ', 'r', C.amber], ['G', 'i', LG]], 'unión · «o»'], [[['R', 'i', LR], [' ∩ ', 'r', C.amber], ['G', 'i', LG]], 'intersección · «y»'], [[['R', 'i', LR], [' − ', 'r', C.amber], ['G', 'i', LG]], 'diferencia · «pero no»'], [[['R', 'i', LR], ['ᶜ', 'r', C.amber]], 'complemento · «no está»'], [[['R', 'i', LR], [' △ ', 'r', C.amber], ['G', 'i', LG]], 'dif. simétrica · «en uno solo»']];
      rows.forEach(([p, lab], i) => fade(A(t, 20.4 + i * 1.1, .5), () => { const x = i < 3 ? 200 + i * 340 : 370 + (i - 3) * 340, y = i < 3 ? 430 : 630; F(p, x, y, 62); T(lab, x, y + 50, { k: 'mono', s: 20, c: C.mute, a: 'c' }); }));
      const kt = A(t, 26.6, 1.2);
      fade(kt, () => {
        T(D.TITLE, CX, 1040, { k: 'brand', s: 92, a: 'c', ls: 18, c: C.ink, g: 24, max: 960 });
        [LR, LG, LB].forEach((c, i) => { X.fillStyle = c; X.shadowColor = c; X.shadowBlur = 14; X.fillRect(CX - 66 + i * 44, 1082, 44 * eo(seg(t, 27, 28.2)), 3); X.shadowBlur = 0; });
        fade(A(t, 28, .8), () => T(D.LINE, CX, 1176, { k: 'it', s: 48, a: 'c', c: C.ink }));
        fade(A(t, 29.4, .8), () => T('ZUKA · ÁLGEBRA · TEORÍA DE CONJUNTOS', CX, 1290, { k: 'mono', s: 22, a: 'c', c: C.mute, ls: 4 }));
      });
    });
  },
};
