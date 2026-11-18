// «Donar es ser subconjunto» · escenas de la lección alg-0b. El motor (letras, trazos, HUD, film) está en kit.js y el
// guion en data.js. La sangre de cada persona es el conjunto de las marcas de sus glóbulos rojos: A (cian), B (ámbar)
// y Rh (verde). Un tipo de sangre es una máscara de bits: A = 1, B = 2, Rh = 4.
const MC = [C.cyan, C.amber, C.green], RED = '#ff5a6a', ANG = [-Math.PI / 2, Math.PI * 5 / 6, Math.PI / 6];
// Un glóbulo: aro rojo con sus marcas en el borde. o: a (opacidad), name (muestra el tipo), set (muestra el conjunto
// debajo), k (aparición de las marcas, 0–1), hi (marca resaltada), dim (marca apagada).
function cell(x, y, r, m, o = {}) {
  fade(o.a ?? 1, () => {
    X.save(); X.beginPath(); X.arc(x, y, r, 0, 7); X.fillStyle = hexA(RED, .13); X.fill(); X.restore();
    ring(x, y, r, RED, Math.max(2.5, r * .035), 1);
    ring(x, y, r * .45, hexA(RED, .35), 2, 1, { g: 0 });
    for (let i = 0; i < 3; i++) {
      const on = m & (1 << i), px = x + r * Math.cos(ANG[i]), py = y + r * Math.sin(ANG[i]), s = Math.max(9, r * .2), k = o.k ?? 1;
      if (!on) { fade(.35, () => ring(px, py, s * .55, 'rgba(160,180,240,.6)', 1.5, 1, { g: 0, dash: [3, 4] })); continue; }
      fade(k * (o.dim === i ? .25 : 1), () => { dot(px, py, s * (o.hi === i ? 1.25 : 1), MC[i], o.hi === i ? 34 : 18); T(D.MARKS[i], px, py + s * .36, { k: 'mono', s: s * (i === 2 ? .82 : 1.05), a: 'c', c: '#06101c' }); });
    }
    if (o.name) T(D.typeName(m), x, y + r * .16, { k: 'r', s: r * .5, a: 'c', c: C.ink });
    if (o.set) F(setParts(m), x, y + r + (o.sy ?? 66), o.ss ?? 46);
  });
}
// El conjunto de un tipo, escrito con llaves: {A, Rh}; el vacío es ∅.
function setParts(m, empty = '∅') {
  if (!m) return [[empty, 'r', C.violet]];
  const p = [['{', 'r']]; D.setOf(m).forEach((s, i, arr) => { p.push([s, 'i', MC[D.MARKS.indexOf(s)]]); if (i < arr.length - 1) p.push([', ', 'r']); }); p.push(['}', 'r']); return p;
}
function arrow(x1, y1, x2, y2, col, k = 1, lw = 3) {
  if (k <= 0) return; const x = lerp(x1, x2, k), y = lerp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1);
  stroke(col, lw, () => { X.moveTo(x1, y1); X.lineTo(x, y); });
  if (k > .9) stroke(col, lw, () => { X.moveTo(x - 16 * Math.cos(a - .45), y - 16 * Math.sin(a - .45)); X.lineTo(x, y); X.lineTo(x - 16 * Math.cos(a + .45), y - 16 * Math.sin(a + .45)); });
}

const S = {
  // 1 · Viena, 1901: dieciséis mezclas de sangre; unas quedan lisas y otras se aglutinan.
  viena(t) {
    stars(t, .5);
    const R = rng(31), clump = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0]; let bad = 0, done = 0;
    for (let i = 0; i < 16; i++) {
      const cx = 210 + (i % 4) * 220, cy = 380 + Math.floor(i / 4) * 220, t0 = 9.8 + i * .5, k = A(t, 1 + i * .18, .6), mix = eio(seg(t, t0, t0 + 1.6));
      fade(k, () => ring(cx, cy, 84, 'rgba(170,190,250,.55)', 2, 1, { g: 4 }));
      const centers = [[-28, -18], [26, 20], [8, -34]];
      for (let j = 0; j < 22; j++) {
        const a = R() * 6.283, rr = Math.sqrt(R()) * 66, x0 = rr * Math.cos(a), y0 = rr * Math.sin(a), c = centers[j % 3], jx = (R() - .5) * 20, jy = (R() - .5) * 20;
        const x = clump[i] ? lerp(x0, c[0] + jx, mix) : x0 + 5 * Math.sin(t * .8 + j), y = clump[i] ? lerp(y0, c[1] + jy, mix) : y0 + 5 * Math.cos(t * .7 + j);
        fade(k * .9, () => dot(cx + x, cy + y, 5.5, RED, 8));
      }
      if (mix >= 1) { done++; if (clump[i]) bad++; check(cx + 62, cy - 62, 13, !clump[i], seg(t, t0 + 1.6, t0 + 2)); }
    }
    fade(A(t, 9.6, .6), () => { T('mezclas       = ' + done, 96, 1300, { k: 'mono', s: 26, c: C.mute }); T('se aglutinan  = ' + bad, 96, 1336, { k: 'mono', s: 26, c: RED, g: 8 }); T('quedan lisas  = ' + (done - bad), 96, 1372, { k: 'mono', s: 26, c: C.green }); });
    fade(win(t, 1.4, 9.2), () => T('transfusiones antes de 1900: sin ninguna regla', CX, 1300, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
  },
  // 2 · Las marcas: un glóbulo grande al que le aparecen A, B y, en 1940, Rh. La sangre es un conjunto de marcas.
  marcas(t) {
    stars(t, .5);
    const k = [A(t, 2.4, .8), A(t, 4.4, .8), A(t, 10.2, .8)];
    X.save(); X.beginPath(); X.arc(CX, SY - 40, 250, 0, 7); X.fillStyle = hexA(RED, .13); X.fill(); X.restore();
    ring(CX, SY - 40, 250, RED, 6, eio(seg(t, .4, 2.2)));
    ring(CX, SY - 40, 110, hexA(RED, .35), 2.5, 1, { g: 0 });
    [['marca A · 1901', -1], ['marca B · 1901', 1], ['factor Rh · 1940', 1]].forEach(([lab], i) => {
      const px = CX + 250 * Math.cos(ANG[i]), py = SY - 40 + 250 * Math.sin(ANG[i]);
      fade(k[i], () => { dot(px, py, 40, MC[i], 30); T(D.MARKS[i], px, py + 15, { k: 'mono', s: i === 2 ? 34 : 44, a: 'c', c: '#06101c' }); T(lab, i === 0 ? px + 60 : px, i === 0 ? py + 8 : py + 84, { k: 'mono', s: 23, c: MC[i], a: i === 0 ? 'l' : 'c' }); });
    });
    T('glóbulo rojo', CX, SY - 30, { k: 'mono', s: 22, c: hexA(RED, .9), a: 'c' });
    fade(A(t, 18.4, .6), () => { F([['M', 'i', C.violet], [' = ', 'r'], ['{', 'r'], ['A', 'i', MC[0]], [', ', 'r'], ['B', 'i', MC[1]], [', ', 'r'], ['Rh', 'i', MC[2]], ['}', 'r']], CX, 1330, 96, { rev: seg(t, 18.6, 21.4) }); T('las tres marcas posibles', CX, 1390, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
    fade(win(t, 12.4, 18), () => T('modelo simplificado: sistemas ABO y Rh', CX, 1330, { k: 'mono', s: 23, c: C.mute, a: 'c' }));
  },
  // 3 · Vacío y unitario: O− no lleva marcas (∅); A− lleva una ({A}).
  vacio(t) {
    stars(t, .5);
    const k1 = A(t, .6, .8), k2 = A(t, 10.2, .8);
    cell(300, 620, 150, 0, { a: k1, name: true });
    fade(k1, () => { F([['{ }', 'r']], 300, 900, 96, { rev: seg(t, 2, 3.4) }); fade(A(t, 4.4, .6), () => { F([[' = ', 'r'], ['∅', 'r', C.violet]], 300, 1010, 96); T('n(∅) = 0', 300, 1080, { k: 'mono', s: 26, c: C.amber, a: 'c', g: 8 }); T('conjunto vacío', 300, 1124, { k: 'mono', s: 23, c: C.mute, a: 'c' }); }); });
    cell(780, 620, 150, 1, { a: k2, name: true });
    fade(k2, () => { F(setParts(1), 780, 900, 96, { rev: seg(t, 11.4, 12.8) }); fade(A(t, 13.6, .6), () => { T('n = 1', 780, 1080, { k: 'mono', s: 26, c: C.amber, a: 'c', g: 8 }); T('conjunto unitario', 780, 1124, { k: 'mono', s: 23, c: C.mute, a: 'c' }); }); });
    // nada pertenece al vacío
    fade(win(t, 20.2, 29.6), () => D.MARKS.forEach((mk, i) => fade(A(t, 20.6 + i * 1.2, .5), () => F([[mk, 'i', MC[i]], [' ∉ ', 'r', C.red], ['∅', 'r', C.violet]], 250 + i * 290, 1330, 64))));
  },
  // 4 · Conjunto de partes: tres interruptores (está / no está) recorren las ocho combinaciones.
  partes(t) {
    stars(t, .4);
    const n = clamp(Math.floor((t - 2.2) / .95) + 1, 0, 8), cur = Math.max(0, n - 1);
    // interruptores
    D.MARKS.forEach((mk, i) => { const on = n > 0 && cur & (1 << i), x = 250 + i * 290; fade(A(t, .6 + i * .3, .5), () => { T(mk, x - 78, 330, { k: 'i', s: 60, c: MC[i], a: 'c' }); stroke(on ? MC[i] : 'rgba(160,180,240,.5)', 3, () => X.roundRect(x - 40, 292, 104, 46, 23), { g: on ? 14 : 0 }); dot(x - 40 + (on ? 81 : 23), 315, 16, on ? MC[i] : '#6b7699', on ? 18 : 0); T(on ? 'está' : 'no está', x + 12, 378, { k: 'mono', s: 20, c: on ? MC[i] : C.mute, a: 'c' }); }); });
    for (let m = 0; m < 8; m++) {
      const x = 180 + (m % 4) * 240, y = 560 + Math.floor(m / 4) * 330, t0 = 2.2 + m * .95, k = A(t, t0, .5);
      cell(x, y, 80, m, { a: k, name: true, set: true, ss: 34, sy: 50 });
      if (m === cur && n > 0 && n <= 8 && t < t0 + .9) ring(x, y, 96 + 20 * seg(t, t0, t0 + .9), hexA(C.ink, 1 - seg(t, t0, t0 + .9)), 2);
    }
    fade(A(t, 2, .5), () => T('combinaciones = ' + n, 96, 1250, { k: 'mono', s: 26, c: C.amber, g: 8 }));
    fade(A(t, 10.6, .6), () => F([['2', 'r', MC[0]], [' · ', 'r'], ['2', 'r', MC[1]], [' · ', 'r'], ['2', 'r', MC[2]], [' = 8', 'r']], 780, 1262, 60, { rev: seg(t, 10.8, 13) }));
    fade(A(t, 20.4, .6), () => { F([['P', 'i', C.violet], ['(', 'r'], ['M', 'i', C.violet], [')', 'r'], [' : el conjunto de todos los subconjuntos de ', 'r'], ['M', 'i', C.violet]], CX, 1380, 44, { rev: seg(t, 20.6, 23.6), max: 940 }); });
    fade(A(t, 25, .6), () => F([['n', 'i', C.amber], ['(', 'r'], ['P', 'i', C.violet], ['(', 'r'], ['A', 'i'], [')) = 2', 'r'], ['ⁿ', 'r', C.amber]], CX, 1480, 72, { rev: seg(t, 25.2, 27.6) }));
  },
  // 5 · Subconjunto: cada marca del donante busca la suya en el receptor.
  sub(t) {
    stars(t, .4);
    const pair = (d, r, t0, y, ok) => {
      const k = A(t, t0, .7);
      cell(260, y, 120, d, { a: k, set: true, ss: 44, sy: 64 }); cell(820, y, 120, r, { a: k, set: true, ss: 44, sy: 64 });
      fade(k, () => { T('donante', 260, y - 178, { k: 'mono', s: 22, c: C.mute, a: 'c' }); T('receptor', 820, y - 178, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
      // las marcas viajan
      D.MARKS.forEach((mk, i) => { if (!(d & (1 << i))) return; const tt = t0 + 1.6 + i * 1.1, fl = eio(seg(t, tt, tt + 1.2)), has = r & (1 << i);
        if (fl <= 0) return; const x1 = 260 + 120 * Math.cos(ANG[i]), y1 = y + 120 * Math.sin(ANG[i]), x2 = has ? 820 + 120 * Math.cos(ANG[i]) : 680, y2 = has ? y + 120 * Math.sin(ANG[i]) : y;
        const x = lerp(x1, x2, fl), yy = lerp(y1, y2, fl) - 70 * Math.sin(Math.PI * fl);
        dot(x, yy, 20, MC[i], 26); T(mk, x, yy + 8, { k: 'mono', s: i === 2 ? 20 : 24, a: 'c', c: '#06101c' });
        if (fl >= 1) check(x2 + (has ? 0 : -6), y2 - 44, 13, !!has, seg(t, tt + 1.2, tt + 1.6)); });
      const kf = A(t, t0 + 5.4, .6);
      fade(kf, () => { F([...setParts(d), [ok ? ' ⊆ ' : ' ⊄ ', 'r', ok ? C.green : C.red], ...setParts(r)], CX, y + 290, 64); T(ok ? 'puede donar' : 'no puede donar', CX, y + 20, { k: 'mono', s: 23, c: ok ? C.green : C.red, a: 'c', g: 8 }); });
    };
    fade(win(t, 9.6, 37.6), () => { pair(1, 5, 10.2, 470, true); if (t > 28.6) pair(3, 1, 29.2, 1010, false); });
    fade(win(t, 20.4, 28.4), () => { T('⊆', CX, 1160, { k: 'r', s: 240, a: 'c', c: C.green, g: 28 }); T('«es subconjunto de»', CX, 1250, { k: 'it', s: 44, a: 'c', c: C.green }); });
    // la regla, al inicio: el cuerpo ataca la marca que no conoce
    fade(win(t, .6, 9.6), () => {
      cell(CX, 640, 170, 1, { name: true });
      const k = eio(seg(t, 2.4, 5)), x = lerp(960, CX + 250, k), y = 420;
      fade(A(t, 2.2, .4), () => { dot(x, y, 26, MC[1], 26); T('B', x, y + 10, { k: 'mono', s: 30, a: 'c', c: '#06101c' }); });
      if (t > 5) { ring(x, y, 40 + 60 * seg(t, 5, 6.2), hexA(C.red, 1 - seg(t, 5, 6.2)), 3); check(x, y - 70, 18, false, seg(t, 5, 5.6)); }
      fade(A(t, 5.6, .6), () => { T('marca desconocida: el cuerpo la ataca', CX, 1010, { k: 'mono', s: 25, c: C.red, a: 'c', g: 8 }); T('marca conocida: no pasa nada', CX, 1052, { k: 'mono', s: 25, c: C.green, a: 'c' }); });
    });
  },
  // 6 · El vacío es subconjunto de todos: O− en el centro dona a los ocho; luego AB+ recibe de los ocho.
  todos(t) {
    stars(t, .4);
    const recv = t > 18.6, mid = recv ? 7 : 0, sw = A(t, 18.6, .8);
    for (let m = 0; m < 8; m++) {
      const a = -Math.PI / 2 + m * Math.PI / 4, x = CX + 390 * Math.cos(a), y = SY + 20 + 390 * .86 * Math.sin(a), t0 = (recv ? 19.4 : 2) + m * .55;
      cell(x, y, 62, m, { a: A(t, .6 + m * .12, .5), name: true });
      const k = eio(seg(t, t0, t0 + .8)), x1 = CX + 120 * Math.cos(a), y1 = SY + 20 + 120 * .86 * Math.sin(a), x2 = CX + 315 * Math.cos(a), y2 = SY + 20 + 315 * .86 * Math.sin(a);
      recv ? arrow(x2, y2, x1, y1, C.green, k, 2.5) : arrow(x1, y1, x2, y2, C.green, k, 2.5);
    }
    cell(CX, SY + 20, 100, mid, { name: true, a: recv ? sw : 1 });
    const n = clamp(Math.floor((t - (recv ? 19.4 : 2)) / .55) + 1, 0, 8);
    T((recv ? 'recibe de = ' : 'le dona a = ') + n + ' de 8', 96, 1300, { k: 'mono', s: 26, c: C.amber, g: 8 });
    fade(recv ? 0 : A(t, 6.8, .6), () => F([['∅', 'r', C.violet], [' ⊆ ', 'r', C.green], ['A', 'i'], ['   para todo conjunto ', 'r'], ['A', 'i']], CX, 1400, 60, { rev: seg(t, 7, 9.4), max: 940 }));
    fade(recv ? A(t, 22.6, .6) : 0, () => F([['A', 'i'], [' ⊆ ', 'r', C.green], ['M', 'i', C.violet], ['   para todo tipo ', 'r'], ['A', 'i']], CX, 1400, 60, { rev: seg(t, 22.8, 25), max: 940 }));
  },
  // 7 · Iguales: las mismas marcas; subconjunto en los dos sentidos.
  iguales(t) {
    stars(t, .4);
    cell(260, 640, 150, 5, { a: A(t, .5, .7), name: true, set: true }); cell(820, 640, 150, 5, { a: A(t, 1.3, .7), name: true, set: true });
    arrow(430, 590, 650, 590, C.green, eio(seg(t, 11.2, 12.4))); arrow(650, 690, 430, 690, C.green, eio(seg(t, 12.8, 14)));
    fade(A(t, 4, .6), () => F([['A', 'i'], [' = ', 'r', C.green], ['B', 'i']], CX, 1000, 130, { rev: seg(t, 4.2, 6) }));
    fade(A(t, 14.4, .6), () => F([['A', 'i'], [' ⊆ ', 'r', C.green], ['B', 'i'], ['   y   ', 'r'], ['B', 'i'], [' ⊆ ', 'r', C.green], ['A', 'i']], CX, 1160, 64, { rev: seg(t, 14.6, 17.6) }));
    fade(A(t, 6.4, .6), () => T('mismos elementos: el mismo conjunto', CX, 1300, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
  },
  // 8 · Disjuntos: {A} y {B} no comparten nada; {A, Rh} y {B, Rh} comparten Rh.
  disjuntos(t) {
    stars(t, .4);
    const k1 = win(t, .5, 23.6);
    fade(k1, () => {
      cell(260, 520, 120, 1, { name: true, set: true, ss: 44, sy: 62 }); cell(820, 520, 120, 2, { name: true, set: true, ss: 44, sy: 62 });
      fade(A(t, 3.4, .6), () => { T('elementos en común = 0', CX, 500, { k: 'mono', s: 24, c: C.amber, a: 'c', g: 8 }); T('disjuntos', CX, 548, { k: 'it', s: 46, a: 'c', c: C.violet }); });
      arrow(410, 590, 670, 590, C.red, eio(seg(t, 6, 7)), 2.5); arrow(670, 620, 410, 620, C.red, eio(seg(t, 7, 8)), 2.5);
      fade(A(t, 11.2, .7), () => {
        cell(260, 1040, 120, 5, { name: true, set: true, ss: 44, sy: 62, hi: 2 }); cell(820, 1040, 120, 6, { name: true, set: true, ss: 44, sy: 62, hi: 2 });
        fade(A(t, 14, .6), () => { T('comparten Rh', CX, 826, { k: 'mono', s: 24, c: MC[2], a: 'c', g: 8 }); T('distintos, pero no disjuntos', CX, 874, { k: 'it', s: 40, a: 'c', c: C.ink }); });
      });
    });
  },
  // 9 · El mapa: los ocho conjuntos en un cubo; cada arista agrega una marca. Donar es subir.
  cubo(t) {
    stars(t, .4);
    const rot = .5 + .18 * Math.sin(t * .35), ex = [Math.cos(rot) * 250, Math.sin(rot) * 70], ey = [-Math.sin(rot + .9) * 230, Math.cos(rot + .9) * 60 - 40], ez = [0, -300];
    const pos = m => { const a = m & 1, b = (m >> 1) & 1, r = (m >> 2) & 1; return [CX + (a - .5) * 2 * ex[0] * .9 + (b - .5) * 2 * ey[0] * .9, SY + 190 + (a - .5) * 2 * ex[1] + (b - .5) * 2 * ey[1] + r * ez[1] - (a + b) * 105]; };
    const path = [0, 1, 5, 7], kp = seg(t, 10.4, 18);
    for (let m = 0; m < 8; m++) for (let i = 0; i < 3; i++) { if (m & (1 << i)) continue; const [x1, y1] = pos(m), [x2, y2] = pos(m | (1 << i)), k = eio(seg(t, .8 + m * .25, 2.2 + m * .25));
      const onPath = path.some((p, j) => j < 3 && p === m && path[j + 1] === (m | (1 << i)) && kp * 3 > j);
      stroke(onPath ? C.green : hexA(MC[i], .65), onPath ? 4 : 2, () => { X.moveTo(x1, y1); X.lineTo(lerp(x1, x2, k), lerp(y1, y2, k)); }, { g: onPath ? 18 : 6 }); }
    for (let m = 0; m < 8; m++) { const [x, y] = pos(m), on = path.includes(m) && kp * 3 >= path.indexOf(m) - .05 && t > 10.4;
      fade(A(t, .6 + m * .2, .5), () => { X.save(); X.beginPath(); X.arc(x, y, 46, 0, 7); X.fillStyle = '#080b18'; X.fill(); X.restore(); ring(x, y, 46, on ? C.green : RED, on ? 4 : 2.5, 1); T(D.typeName(m), x, y + 13, { k: 'r', s: 36, a: 'c', c: C.ink }); }); }
    T('vértices = 8 · aristas = 12', 96, 1300, { k: 'mono', s: 25, c: C.mute });
    fade(A(t, 10.4, .6), () => F([['∅', 'r', C.violet], [' ⊆ ', 'r', C.green], ...setParts(1), [' ⊆ ', 'r', C.green], ...setParts(5), [' ⊆ ', 'r', C.green], ...setParts(7)], CX, 1410, 50, { rev: seg(t, 10.6, 17.6), max: 940 }));
    fade(A(t, 20.4, .6), () => { T('abajo: ∅', 96, 1340, { k: 'mono', s: 25, c: C.violet }); T('arriba: M', 984, 1340, { k: 'mono', s: 25, c: C.violet, a: 'r' }); });
  },
  // 10 · Cierre: las fórmulas de la lección y la tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { cell(CX, 640, 190, 0, { name: true }); T('Karl Landsteiner · Premio Nobel de Medicina, 1930', CX, 940, { k: 'mono', s: 24, c: C.amber, a: 'c', g: 8 }); T('por descubrir los grupos sanguíneos', CX, 984, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
    fade(win(t, 11, 29.6, .6), () => {
      const rows = [[[['∅', 'r', C.violet], [' = { }', 'r']], 'vacío'], [[['{', 'r'], ['A', 'i', MC[0]], ['}', 'r']], 'unitario'], [[['D', 'i'], [' ⊆ ', 'r', C.green], ['R', 'i']], 'subconjunto'], [[['A', 'i'], [' = ', 'r', C.green], ['B', 'i']], 'iguales'], [[['{', 'r'], ['A', 'i', MC[0]], ['}  {', 'r'], ['B', 'i', MC[1]], ['}', 'r']], 'disjuntos'], [[['n', 'i', C.amber], ['(', 'r'], ['P', 'i', C.violet], ['(', 'r'], ['A', 'i'], [')) = 2', 'r'], ['ⁿ', 'r', C.amber]], 'partes']];
      rows.forEach(([p, lab], i) => fade(A(t, 11.4 + i * 1.3, .5), () => { const x = 300 + (i % 2) * 480, y = 400 + Math.floor(i / 2) * 170; F(p, x, y, 60); T(lab, x, y + 50, { k: 'mono', s: 22, c: C.mute, a: 'c' }); }));
      const kt = A(t, 21, 1.2);
      fade(kt, () => {
        T(D.TITLE, CX, 1060, { k: 'brand', s: 84, a: 'c', ls: 16, c: C.ink, g: 24, max: 960 });
        X.fillStyle = C.green; X.shadowColor = C.green; X.shadowBlur = 14; X.fillRect(CX - 60 * eo(seg(t, 21.4, 22.6)), 1100, 120 * eo(seg(t, 21.4, 22.6)), 3); X.shadowBlur = 0;
        fade(A(t, 22.4, .8), () => T(D.LINE, CX, 1190, { k: 'it', s: 48, a: 'c', c: C.ink }));
        fade(A(t, 23.8, .8), () => T('ZUKA · ÁLGEBRA · TEORÍA DE CONJUNTOS', CX, 1300, { k: 'mono', s: 22, a: 'c', c: C.mute, ls: 4 }));
      });
    });
  },
};
