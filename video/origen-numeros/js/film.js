// «El origen de los números»: toda la película como datos. Una pizarra larga (x 0…6400, y 0…1700) con siete
// columnas de 900 de ancho; la cámara vertical (1080×1920) ve una columna a la vez y avanza de lado.
// Blanco para todo; naranja solo para el hueco y el cero. Sin voz: lo que se lee está escrito con tiza.
import { clamp, lerp, eio } from '/core/lib.js';
import { Stroke, catmull } from './chalk.js';
import { writeLatin, latinWidth } from './hand.js';

const BAR = 8 / 3;                                   // 90 pulsos por minuto, compás de 4
const COL = i => 500 + 900 * i;                      // centro de cada columna
const need = txt => [...txt].filter(c => !/\s/.test(c)).length / 15 + 1.5;

export function build(W = 1080, H = 1920) {
  const S = [], TX = [], EV = [], T = {}, CHECK = [];
  const add = (arr, phase = 'pre') => { arr.forEach(s => { s.layer = 'FL'; s.phase = phase; S.push(s); }); return arr; };
  const line = (pts, o, t0, dur) => {
    const s = new Stroke(o.smooth ? catmull(pts, 10) : pts, { kind: 'write', taper: .2, taperLen: .2, land: .6, skip: .14, endSpecks: true, specks: .6, w: 8, color: 'white', ...o });
    s.t0 = t0; s.t1 = t0 + dur; return s;
  };
  const text = (id, txt, strokes, t1 = 1e9, pad = 8) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of strokes) for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const q = { id, text: txt, layer: 'FL', box: [x0 - pad, y0 - pad, x1 + pad, y1 + pad], t0: strokes[0].t0, t1, done: Math.max(...strokes.map(s => s.t1)) };
    TX.push(q); return q;
  };
  // una línea de letra manuscrita centrada en cx; se encoge si no cabe en maxW
  const lat = (id, txt, cx, by, cap, t, o = {}) => {
    const maxW = o.maxW ?? 730; let w = latinWidth(txt, cap);
    if (w > maxW) { cap *= maxW / w; w = maxW; }
    const s = add(writeLatin(txt, cx - w / 2, by, cap, t, { lspeed: 78, seed: id.length * 7 + txt.length, lw: cap < 90 ? .09 : .072, ...o }), o.phase);
    s.q = text(id, txt, s, o.t1); return s;
  };
  // cifras o signos sueltos, cada uno con su color; devuelve los trazos y el centro x de cada carácter
  const digits = (id, txt, cx, by, cap, t, colors = {}, o = {}) => {
    const chars = [...txt]; const w0 = chars.reduce((a, c) => a + latinWidth(c, cap), 0) * (o.track ?? 1); if (w0 > (o.maxW ?? 740)) cap *= (o.maxW ?? 740) / w0;
    const ws = chars.map(c => latinWidth(c, cap) * (o.track ?? 1)), tot = ws.reduce((a, b) => a + b, 0);
    const out = [], xs = []; let x = cx - tot / 2;
    chars.forEach((c, i) => {
      xs.push(x + ws[i] / 2);
      if (c !== ' ') { const s = writeLatin(c, x + (ws[i] - latinWidth(c, cap)) / 2, by, cap, t, { lspeed: o.lspeed ?? 30, color: colors[i] || 'white', seed: 40 + i * 3 + id.length, lw: o.lw }); out.push(...s); t = s.end + (o.gap ?? .1); }
      x += ws[i];
    });
    add(out, o.phase); out.end = t; out.xs = xs; out.q = text(id, txt, out, o.t1); return out;
  };
  const dashedRing = (cx, cy, rx, ry, t, n = 12, color = 'orange') => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a0 = i / n * 6.2832 - 1.57, a1 = a0 + 6.2832 / n * .55, p = [];
      for (let k = 0; k <= 5; k++) { const a = lerp(a0, a1, k / 5); p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
      out.push(line(p, { w: 7, color, taper: .1 }, t + i * .055, .045));
    }
    out.end = t + n * .055; return out;
  };
  const arrow = (x0, y, x1, t, color = 'white') => {
    const a = line([[x0, y], [x1, y - 3]], { w: 8, color }, t, .22);
    const h = line([[x1 - 34, y - 28], [x1, y - 3], [x1 - 34, y + 24]], { w: 8, color, taper: .1 }, t + .24, .1);
    const out = [a, h]; out.end = t + .34; return out;
  };
  const tally = (x, y, h, t, o = {}) => { const s = line([[x + 4, y - h / 2], [x - 2, y], [x, y + h / 2]], { w: o.w ?? 12, smooth: true, taper: .12, color: o.color || 'white' }, t, o.d ?? .2); return s; };
  // la columna i queda lista para leer hasta `until`: se comprueba que todo lo escrito alcanza a leerse
  const holds = (blocks, until) => blocks.forEach(b => CHECK.push({ id: b.q.id, slack: +(until - b.q.done - need(b.q.text)).toFixed(2) }));

  // ───────── C0 · cinco rayitas y el título (compases 1–4)
  T.c0 = 0;
  {
    const cx = COL(0), y = 640; let t = .35;
    for (let i = 0; i < 4; i++) { add([tally(cx - 150 + i * 100, y, 330, t)]); t += .5; }
    add([line([[cx - 235, y + 120], [cx - 20, y + 10], [cx + 240, y - 125]], { w: 12, smooth: true, taper: .12 }, t + .05, .32)]);
    EV.push({ t: t + .05, type: 'accent' });
    T.title = 3.75;
    const a = lat('titulo-1', 'El origen de', cx, 1160, 100, T.title, { lspeed: 34 });
    const b = lat('titulo-2', 'los números', cx, 1330, 100, a.end + .12, { lspeed: 34 });
    EV.push({ t: T.title, type: 'title' });
    T.c1 = 4 * BAR; holds([a, b], T.c1 - .9);
  }

  // ───────── C1 · el hueso de Ishango (compases 5–7)
  {
    const cx = COL(1), a0 = T.c1; let t = a0 + .1;
    const top = lat('ishango-fecha', 'hace 20 000 años', cx, 280, 66, t); t = top.end + .15;
    // el hueso, un poco inclinado: caña larga y dos cabezas
    const rot = -.2, c0 = Math.cos(rot), s0 = Math.sin(rot), K = 1.18, oy = 790;
    const P = (x, y) => [cx + (x * c0 - y * s0) * K, oy + (x * s0 + y * c0) * K];
    const out = [[-52, -250], [-48, 0], [-52, 250], [-96, 292], [-84, 348], [-32, 344], [0, 318], [32, 344], [84, 348], [96, 292], [52, 250], [48, 0], [52, -250],
      [96, -292], [84, -348], [32, -344], [0, -318], [-32, -344], [-84, -348], [-96, -292], [-52, -250]].map(p => P(...p));
    add([line(out, { w: 9, smooth: true, taper: .05 }, t, 1.0)]); t += 1.05;
    const bottom = lat('ishango-frase', 'muescas en un hueso', cx, 1300, 72, t); t = bottom.end + .1;
    const bottom2 = lat('ishango-lugar', '(Ishango, África)', cx, 1420, 60, t); t = bottom2.end + .15;
    let y = -205; const groups = [3, 6, 4, 8];
    for (const g of groups) {
      for (let i = 0; i < g; i++) { add([line([P(-44, y), P(6, y - 3)], { w: 7, taper: .15 }, t, .07)]); t += .1; y += 17; }
      y += 30; t += .16;
    }
    T.c2 = 7 * BAR; holds([top, bottom, bottom2], T.c2 - .9);
  }

  // ───────── C2 · Babilonia: cuña y gancho, el hueco sin signo, de 60 en 60 (compases 8–12)
  const wedge = (x, y, k, t, color = 'white') => {
    const hd = line([[x - 24 * k, y], [x + 24 * k, y - 2 * k], [x, y + 36 * k], [x - 24 * k, y]], { w: 7, color, taper: .05 }, t, .14);
    const tl = line([[x, y + 34 * k], [x + 1, y + 135 * k]], { w: 8, color, taper: .45, taperLen: .6 }, t + .15, .1);
    const out = [hd, tl]; out.end = t + .25; return out;
  };
  const hook = (x, y, k, t) => { const s = line([[x + 44 * k, y], [x, y + 66 * k], [x + 44 * k, y + 132 * k]], { w: 10, taper: .2 }, t, .16); const out = [s]; out.end = t + .16; return out; };
  {
    const cx = COL(2), a0 = T.c2; let t = a0 + .1;
    const top = lat('bab-fecha', 'Babilonia, 1800 a. C.', cx, 280, 64, t); t = top.end + .2;
    const w1 = add(wedge(cx - 235, 430, 1, t)); t = w1.end + .08;
    const e1 = lat('bab-uno', '= 1', cx - 120, 540, 74, t); t = e1.end + .2;
    const h1 = add(hook(cx + 50, 432, 1, t)); t = h1.end + .08;
    const e2 = lat('bab-diez', '= 10', cx + 215, 540, 74, t); t = e2.end + .3;
    // dos cuñas con un hueco en medio: nadie escribía ese hueco
    const ry = 760;
    add(wedge(cx - 190, ry, 1.25, t)); t += .4;
    add(wedge(cx + 190, ry, 1.25, t)); t += .55;
    T.pushBab = t - .9;
    const ring = add(dashedRing(cx, ry + 84, 84, 104, t)); EV.push({ t, type: 'gap' }); t = ring.end + .15;
    const nada = lat('bab-nada', 'aquí, nada', cx, 1050, 64, t); t = nada.end;
    T.bab1 = nada.q.done + need('aquí, nada') + .05;      // se sostiene el plano cerrado
    t = T.bab1 - .1;
    const b1 = lat('bab-60', 'contaban de 60 en 60', cx, 1290, 68, t, { lspeed: 80 }); t = b1.end + .1;
    const b2 = lat('bab-hora', '1 hora = 60 minutos', cx, 1420, 68, t, { lspeed: 80 });
    T.c3 = 12 * BAR; holds([top, b1, b2], T.c3 - .9); CHECK.push({ id: 'bab-nada', slack: +(T.bab1 - nada.q.done - need('aquí, nada')).toFixed(2) });
  }

  // ───────── C3 · Egipto: 909 con 18 signos (compases 13–15); después se borra y se reescribe
  const wiped = [];
  const coil = (x, y, k, t) => {
    const p = []; for (let i = 0; i <= 26; i++) { const a = i / 26 * 8.4, r = (5 + i * 1.25) * k; p.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
    const e = p[p.length - 1]; p.push([e[0] + 4 * k, e[1] + 26 * k], [e[0] + 14 * k, e[1] + 46 * k]);
    return line(p, { w: 6.5, taper: .1 }, t, .17);
  };
  {
    const cx = COL(3), a0 = T.c3; let t = a0 + .1;
    const top = lat('egipto-fecha', 'Egipto, 3000 a. C.', cx, 280, 64, t); t = top.end + .2;
    for (let i = 0; i < 9; i++) { const s = coil(cx - 290 + (i % 3) * 120, 500 + Math.floor(i / 3) * 150, 1, t); add([s]); wiped.push(s); t += .21; }
    t += .1;
    const bottom = lat('egipto-frase', '909 = 18 signos', cx, 1330, 78, t, { t1: 1e9 }); wiped.push(...bottom); t = bottom.end + .12;
    for (let i = 0; i < 9; i++) { const s = tally(cx + 120 + (i % 3) * 85, 500 + Math.floor(i / 3) * 150, 104, t, { w: 9, d: .1 }); add([s]); wiped.push(s); t += .15; }
    T.c4 = 15 * BAR; holds([top, bottom], T.c4 - .9);
    T.egBottom = bottom;
  }

  // ───────── C4 · India: el punto se vuelve círculo y entra en las cuentas (compases 16–19)
  {
    const cx = COL(4), a0 = T.c4; let t = a0 + .1;
    const top = lat('india-fecha', 'India, año 628', cx, 280, 66, t); t = top.end + .3;
    const dy = 600;
    const dp = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * 15, r = 2 + i * .75; dp.push([cx - 230 + Math.cos(a) * r, dy + Math.sin(a) * r]); }
    add([line(dp, { w: 8, color: 'orange', taper: 0 }, t, .3)]); t += .75;
    add(arrow(cx - 150, dy, cx - 20, t)); t += .5;
    T.pushInd = t - .15;
    T.zero = Math.max(t + 1.0, a0 + 1.25 * BAR);                              // un silencio, y el círculo
    const cp = []; for (let i = 0; i <= 40; i++) { const a = -1.9 + i / 40 * 6.6; cp.push([cx + 170 + Math.cos(a) * 104 * (1 + .03 * Math.sin(a * 2)), dy + Math.sin(a) * 138]); }
    add([line(cp, { w: 15, color: 'orange', taper: .1, land: 1 }, T.zero, .75)]); EV.push({ t: T.zero, type: 'zero' });
    T.ind1 = T.zero + 1.8; t = T.ind1 + .2;
    // 5 − 5 = 0, con el menos trazado a mano (la letra no lo trae)
    const cap = 104, by = 1040, parts = ['5', ' ', '5', ' = ', '0'];
    const wMinus = cap * .55, widths = [latinWidth('5', cap), wMinus + cap * .8, latinWidth('5', cap), latinWidth(' = ', cap), latinWidth('0', cap)], tot = widths.reduce((a, b) => a + b, 0);
    let x = cx - tot / 2; const eq = [];
    parts.forEach((p, i) => {
      if (i === 1) { eq.push(line([[x + cap * .4, by - cap * .42], [x + cap * .4 + wMinus, by - cap * .44]], { w: 8 }, t, .12)); t += .22; }
      else { const s = writeLatin(p, x, by, cap, t, { lspeed: 30, color: i === 4 ? 'orange' : 'white', seed: 60 + i }); eq.push(...s); t = s.end + .12; }
      x += widths[i];
    });
    add(eq); eq.q = text('india-cuenta', '5 − 5 = 0', eq); t += .15;
    const bottom = lat('india-frase', 'ya es un número', cx, 1370, 80, t);
    T.back = 19 * BAR; holds([top, eq, bottom], T.back - .5);
  }

  // ───────── vuelta a C3 · una pasada de borrador y el mismo 909 con tres signos (compases 20–22)
  let wipe;
  {
    const cx = COL(3), a0 = T.back;
    T.wipe0 = a0 + .45; T.wipe1 = T.wipe0 + 1.15;
    EV.push({ t: T.wipe0, type: 'wipe', d: 1.15 });
    const WP = [[cx - 420, 470], [cx + 330, 520], [cx + 400, 700], [cx - 340, 740], [cx - 400, 930], [cx + 340, 960], [cx + 330, 1150], [cx - 330, 1250], [cx + 100, 1340], [cx + 420, 1330]];
    wipe = { t0: T.wipe0, t1: T.wipe1, w: 330, path: catmull(WP, 12) };
    wiped.forEach(s => s.wiped = true);
    T.egBottom.q.t1 = T.wipe0 + .5;
    let t = T.wipe1 + .45;
    T.rewrite = t;
    const big = digits('egipto-909', '909', cx, 880, 300, t, { 1: 'orange' }, { phase: 'post', lspeed: 14, gap: .16, lw: .06, track: 1.04, maxW: 700 }); t = big.end + .25;
    EV.push({ t: T.rewrite, type: 'rewrite' });
    const bottom = lat('egipto-tres', '3 signos', cx, 1330, 86, t, { phase: 'post' });
    T.c5 = 22 * BAR; holds([big, bottom], T.c5 - .5);
  }

  // ───────── C5 · los mayas: punto, raya y concha (compases 23–25)
  {
    const cx = COL(5), a0 = T.c5; let t = a0 + .1;
    const top = lat('maya-lugar', 'mayas, América', cx, 280, 66, t); t = top.end + .2;
    const sx = cx - 150, ex = cx + 120;
    const dp = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * 12, r = 2 + i * .9; dp.push([sx + Math.cos(a) * r, 470 + Math.sin(a) * r]); }
    add([line(dp, { w: 8, taper: 0 }, t, .22)]); t += .3;
    const e1 = lat('maya-uno', '= 1', ex, 500, 76, t); t = e1.end + .2;
    add([line([[sx - 100, 672], [sx, 668], [sx + 100, 670]], { w: 16, smooth: true, taper: .08 }, t, .22)]); t += .3;
    const e5 = lat('maya-cinco', '= 5', ex, 700, 76, t); t = e5.end + .25;
    // la concha: un óvalo con tres costillas, en naranja
    const cy = 880, sh = []; for (let i = 0; i <= 36; i++) { const a = 3.14 + i / 36 * 6.5; sh.push([sx + Math.cos(a) * 112, cy + Math.sin(a) * 62 * (1 - .12 * Math.cos(a))]); }
    const shell = [line(sh, { w: 9, color: 'orange', taper: .08 }, t, .45)];
    [-1, 0, 1].forEach((k, i) => shell.push(line([[sx - 100, cy + 2], [sx - 30, cy + k * 30], [sx + 96, cy + k * 12]], { w: 6, color: 'orange', smooth: true, taper: .3 }, t + .5 + i * .14, .11)));
    add(shell); EV.push({ t, type: 'shell' }); t += .95;
    const e0 = digits('maya-cero', '= 0', ex, 910, 76, t, { 2: 'orange' }, { lspeed: 55, gap: .03 }); t = e0.end + .2;
    const b1 = lat('maya-frase-1', 'otro cero,', cx, 1270, 76, t); t = b1.end + .1;
    const b2 = lat('maya-frase-2', 'inventado aparte', cx, 1400, 76, t);
    T.c6 = 26 * BAR; holds([top, e0, b1, b2], T.c6 - .9);
  }

  // ───────── C6 · hoy: unos y ceros, marca y hueco (compases 26–29)
  {
    const cx = COL(6), a0 = T.c6; let t = a0 + .1;
    const top = lat('hoy', 'hoy', cx, 280, 70, t); t = top.end + .3;
    const bits = '1 0 1 1 0', col = {}; [...bits].forEach((c, i) => { if (c === '0') col[i] = 'orange'; });
    const row = digits('bits', bits, cx, 660, 170, t, col, { lspeed: 20, gap: 2 / 3 - .2, lw: .062, maxW: 700 }); t = row.end + .1;
    // debajo de cada cifra, lo que es: una rayita o un hueco
    const my = 900;
    [...bits].forEach((c, i) => {
      if (c === '1') { add([tally(row.xs[i], my, 130, t, { w: 10, d: .12 })]); EV.push({ t, type: 'bit', v: 1 }); t += .3; }
      else if (c === '0') { add(dashedRing(row.xs[i], my, 44, 62, t, 8)); EV.push({ t, type: 'bit', v: 0 }); t += .5; }
    });
    t += .1;
    const b1 = lat('hoy-frase-1', 'todo lo digital:', cx, 1270, 72, t); t = b1.end + .1;
    const b2 = lat('hoy-frase-2', 'marca y hueco', cx, 1400, 82, t); t = b2.end;
    T.pull = Math.max(t + need('todo lo digital: marca y hueco') - .9, 29 * BAR - 1.2);
    T.DUR = +(T.pull + 1.6 + 2.2).toFixed(2);
    holds([top, row], T.pull); EV.push({ t: T.pull, type: 'end' });
    CHECK.push({ id: 'hoy-frases', slack: +(T.DUR - b2.q.done - need('todo lo digital: marca y hueco')).toFixed(2) });
  }

  // ───────── cámara: claves [t, cx, cy, s] (s para un cuadro de 1920 de ancho), suavizadas entre claves
  const CY = 850, SC = 1.9, pan = .9, whip = .42;
  const K = [
    [0, COL(0), 640, 3.0], [2.55, COL(0) + 6, 640, 2.9], [3.7, COL(0), CY, SC], [T.c1 - pan, COL(0), CY, SC],
    [T.c1, COL(1), CY, SC], [T.c2 - pan, COL(1), CY, SC],
    [T.c2, COL(2), CY, SC], [T.pushBab, COL(2), CY, SC], [T.pushBab + .9, COL(2), 800, 2.3], [T.bab1, COL(2), 804, 2.35], [T.bab1 + .9, COL(2), CY, SC], [T.c3 - pan, COL(2), CY, SC],
    [T.c3, COL(3), CY, SC], [T.c4 - pan, COL(3), CY, SC],
    [T.c4, COL(4), CY, SC], [T.pushInd, COL(4), CY, SC], [T.pushInd + .8, COL(4), 700, 2.35], [T.ind1, COL(4) + 4, 704, 2.4], [T.ind1 + .9, COL(4), CY, SC], [T.back - whip, COL(4), CY, SC],
    [T.back, COL(3), CY, SC], [T.c5 - whip, COL(3), CY, SC],
    [T.c5, COL(5), CY, SC], [T.c6 - pan, COL(5), CY, SC],
    [T.c6, COL(6), CY, SC], [T.pull, COL(6), CY, SC], [T.pull + 1.6, COL(6) - 430, 1010, 1.0], [T.DUR, COL(6) - 436, 1012, .99],
  ];
  EV.push({ t: T.back - whip, type: 'whip' }, { t: T.c5 - whip, type: 'whip' });
  [T.c1, T.c2, T.c3, T.c4, T.c6].forEach(t => EV.push({ t: t - pan, type: 'pan', d: pan }));
  const camAt = tt => {
    let k = 0; while (k + 1 < K.length - 1 && tt > K[k + 1][0]) k++;
    const a = K[k], b = K[k + 1], u = b[0] > a[0] ? eio(clamp((tt - a[0]) / (b[0] - a[0]))) : 1;
    return { cx: lerp(a[1], b[1], u), cy: lerp(a[2], b[2], u), s: lerp(a[3], b[3], u), shot: 0 };
  };

  // sonido de la tiza: un evento por trazo, con su largo, color y lugar en el cuadro
  for (const st of S) {
    if (st.t1 <= 0 || st.t0 >= T.DUR) continue;
    const c = camAt((st.t0 + st.t1) / 2), p = st.at(st.len / 2), sx = (p[0] - c.cx) * c.s / 1920 * 2;
    if (Math.abs(sx) > 1.3) continue;
    EV.push({ t: +st.t0.toFixed(3), type: 'chalk', d: +(st.t1 - st.t0).toFixed(3), len: Math.round(st.len * c.s * .56), color: st.color, pan: +clamp(sx * .6, -.7, .7).toFixed(2), big: st.w > 12 ? 1 : 0 });
  }
  for (const s of S) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } s.bb = [x0 - 40, y0 - 40, x1 + 40, y1 + 40]; }
  EV.push({ t: 0, type: 'grid', bar: BAR, bars: { c1: T.c1, c2: T.c2, c3: T.c3, c4: T.c4, back: T.back, c5: T.c5, c6: T.c6 } });
  EV.sort((a, b) => a.t - b.t);
  return { S, TX, EV, T, CHECK, wipe, camAt, DUR: T.DUR };
}
