// «La deuda de Brahmagupta» · escenas de la lección alg-11. Motor en kit.js y recta.js; guion en naturales.data.js.
// Naturales en ámbar, enteros en cian, deudas (negativos) en magenta.
const NEG = C.mag;
const S = {
  // 1 · El hueso de Ishango: un hueso que se dibuja y rayas que se tallan una a una, contadas en vivo.
  ishango(t) {
    stars(t, .5);
    const k = eio(seg(t, .6, 3.4)), cx = CX, cy = 700;
    // el hueso: un cuerpo alargado y dos cabezas
    fade(k, () => {
      X.save(); X.translate(cx, cy); X.rotate(-.12);
      const g = X.createLinearGradient(-330, 0, 330, 0); g.addColorStop(0, 'rgba(255,214,150,.20)'); g.addColorStop(.5, 'rgba(255,226,170,.30)'); g.addColorStop(1, 'rgba(255,214,150,.20)');
      X.fillStyle = g; X.beginPath(); X.roundRect(-330, -46, 660, 92, 40); X.fill();
      stroke('#ffd9a0', 3, () => { X.roundRect(-330, -46, 660, 92, 40); }, { g: 14 });
      stroke('#ffd9a0', 3, () => { X.ellipse(-350, -30, 46, 40, 0, 0, 7); X.moveTo(-304, 30); X.ellipse(-350, 30, 46, 40, 0, 0, 7); X.moveTo(396, -30); X.ellipse(350, -30, 46, 40, 0, 0, 7); X.moveTo(396, 30); X.ellipse(350, 30, 46, 40, 0, 0, 7); }, { g: 14 });
      X.restore();
    });
    // rayas talladas en grupos (11, 13, 17, 19 como en una de las filas del hueso)
    const groups = [11, 13, 17, 19], total = 60, n = clamp(Math.floor((t - 3.2) / .16), 0, total);
    let i = 0, x = -290;
    X.save(); X.translate(cx, cy); X.rotate(-.12);
    for (const g of groups) { for (let j = 0; j < g; j++, i++) { if (i < n) stroke(C.amber, 3, () => { X.moveTo(x, -30); X.lineTo(x + 3, 30); }, { g: i === n - 1 ? 22 : 8 }); x += 9; } x += 16; }
    X.restore();
    fade(A(t, 3.2, .5), () => T('rayas = ' + n, 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 }));
    fade(A(t, 4.4, .5), () => { T('hueso de Ishango', 984, 1196, { k: 'mono', s: 24, c: C.mute, a: 'r' }); T('Congo · unos 20 000 años', 984, 1232, { k: 'mono', s: 24, c: C.mute, a: 'r' }); });
    // de las rayas a los números: 1, 2, 3, …
    fade(A(t, 18.4, .6), () => { const r = F([['1', 'r', C.amber], [',  ', 'r'], ['2', 'r', C.amber], [',  ', 'r'], ['3', 'r', C.amber], [',  ', 'r'], ['4', 'r', C.amber], [',  …', 'r']], CX, 1030, 110, { rev: seg(t, 18.6, 21.2) }); });
  },
  // 2 · Los naturales: ℕ grande, la sucesión que no se acaba (n → n + 1) y quién pertenece.
  naturales(t) {
    stars(t, .5);
    fade(win(t, .4, 9.6), () => { T('ℕ', CX, 760, { k: 'r', s: 360, a: 'c', c: C.amber, g: 34 }); T('«ene»', CX, 860, { k: 'it', s: 46, a: 'c', c: '#c3ccec' }); });
    // la fila que no se acaba
    fade(win(t, 9.4, 18), () => {
      const px = nline(80, 1000, 720, 0, 10.5, { k: eio(seg(t, 9.6, 11.6)), lab: v => v >= 1 });
      const m = clamp(Math.floor((t - 11) / .6) + 1, 0, 10);
      for (let v = 1; v <= m; v++) { dot(px(v), 720, 11, C.amber, v === m ? 30 : 14); if (v > 1 && v === m) hop(px(v - 1), px(v), 720, 70, C.amber, seg(t, 11 + (v - 1) * .6, 11.4 + (v - 1) * .6), 2.5); }
      fade(A(t, 12, .6), () => F([['n', 'i', C.amber], ['  ⟶  ', 'r'], ['n', 'i', C.amber], [' + 1', 'r']], CX, 960, 80));
      T('naturales = ' + m + (m >= 10 ? ', …' : ''), 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 });
    });
    // pertenencia
    fade(A(t, 18.2, .6), () => {
      family(CX, 720, 380, 250, 'ℕ', C.amber, eio(seg(t, 18.2, 19.6)), { lx: CX + 300, ly: 470 });
      [['12', CX - 120, 700, true, 19.6], ['1', CX + 60, 640, true, 19.6], ['40', CX + 120, 800, true, 19.6], ['−8', 170, 470, false, 21.4], ['3.5', 930, 1020, false, 23]].forEach(([s, x, y, ok, t0]) => fade(A(t, t0, .5), () => { dot(x, y, 10, ok ? C.amber : NEG, 18); T(s, x + 22, y + 14, { k: 'r', s: 44, c: ok ? C.ink : NEG }); }));
      fade(A(t, 20.2, .5), () => F([['12', 'r'], [' ∈ ', 'r', C.green], ['ℕ', 'r', C.amber]], 300, 1200, 72));
      fade(A(t, 22, .5), () => F([['−8', 'r', NEG], [' ∉ ', 'r', C.red], ['ℕ', 'r', C.amber]], 780, 1200, 72));
    });
  },
  // 3 · Sumar y multiplicar se quedan en ℕ; restar se sale: 3 − 8 no tiene respuesta.
  cerrado(t) {
    stars(t, .4);
    const px = nline(110, 1000, 760, 0, 10.5, { lab: v => v >= 1 && v <= 10 });
    stroke(hexA(C.red, .9), 2, () => { X.moveTo(70, 690); X.lineTo(px(.5), 690); X.lineTo(px(.5), 830); X.lineTo(70, 830); }, { dash: [8, 8], g: 6 });
    fade(A(t, .8, .5), () => T('fuera de ℕ', 84, 670, { k: 'mono', s: 22, c: C.red }));
    // 3 + 4 = 7 y 2 · 4 = 8
    if (t < 9.6) {
      dot(px(3), 760, 12, C.amber, 24); hop(px(3), px(7), 760, 120, C.green, seg(t, 1.4, 3.2), 3);
      fade(A(t, 3.2, .4), () => { dot(px(7), 760, 12, C.green, 28); F([['3 + 4 = 7', 'r'], ['  ∈ ', 'r', C.green], ['ℕ', 'r', C.amber]], CX, 1040, 64); });
      fade(A(t, 5.4, .4), () => F([['2 · 4 = 8', 'r'], ['  ∈ ', 'r', C.green], ['ℕ', 'r', C.amber]], CX, 1140, 64));
    } else {
      // 3 − 8: el salto se queda sin piso
      const k = seg(t, 10.4, 14.8), x = lerp(px(3), 140, eio(k));
      dot(px(3), 760, 12, C.amber, 24);
      stroke(NEG, 3, () => { X.moveTo(px(3), 760); X.quadraticCurveTo((px(3) + x) / 2, 640, x, 760 - 40 * Math.sin(Math.PI * k)); });
      if (k > .9) { fade(.6 + .4 * Math.sin(t * 6), () => T('?', 120, 720, { k: 'r', s: 90, c: C.red, g: 18 })); }
      F([['3 − 8 = ', 'r'], ['?', 'r', C.red]], CX, 1060, 96, { rev: seg(t, 10, 11.4) });
      fade(A(t, 15, .6), () => T('ningún natural sirve', CX, 1140, { k: 'mono', s: 25, c: C.red, a: 'c', g: 8 }));
    }
  },
  // 4 · India, 628: el libro de Brahmagupta, fortunas (verde) y deudas (magenta) que se cancelan.
  brahma(t) {
    stars(t, .5);
    fade(win(t, .5, 10.2), () => {
      // una hoja de palma con renglones
      stroke('#ffd9a0', 3, () => X.roundRect(140, 520, 800, 240, 30), { g: 12 });
      for (let r = 0; r < 4; r++) stroke('rgba(255,217,160,.45)', 2, () => { X.moveTo(190, 580 + r * 48); X.lineTo(190 + 700 * eio(seg(t, 1.2 + r * .5, 2.6 + r * .5)), 580 + r * 48); }, { g: 0 });
      T('Brāhmasphuṭasiddhānta · año 628', CX, 830, { k: 'it', s: 38, a: 'c', c: '#ffd9a0' });
      fade(A(t, 3.4, .6), () => { T('0', CX, 1060, { k: 'r', s: 170, a: 'c', c: C.amber, g: 30 }); T('śūnya: «vacío»', CX, 1130, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
    });
    // fortunas y deudas: monedas a un lado y pagarés al otro
    fade(win(t, 10, 30), () => {
      const n = 5, fk = seg(t, 10.6, 13.6), dk = seg(t, 13.6, 16.6), m = eio(seg(t, 21, 25));
      T('fortuna', 300, 470, { k: 'it', s: 48, a: 'c', c: C.green }); T('deuda', 780, 470, { k: 'it', s: 48, a: 'c', c: NEG });
      for (let i = 0; i < n; i++) {
        const y = 560 + i * 90, xf = lerp(300, CX - 60, m), xd = lerp(780, CX + 60, m);
        fade((i < fk * n ? 1 : 0) * (1 - seg(t, 25, 26.2)), () => { ring(xf, y, 30, C.green, 3); T('+1', xf, y + 12, { k: 'mono', s: 26, a: 'c', c: C.green }); });
        fade((i < dk * n ? 1 : 0) * (1 - seg(t, 25, 26.2)), () => { stroke(NEG, 3, () => X.roundRect(xd - 36, y - 26, 72, 52, 8)); T('−1', xd, y + 12, { k: 'mono', s: 26, a: 'c', c: NEG }); });
      }
      fade(A(t, 15.4, .5) * (1 - seg(t, 21, 22)), () => { F([['+5', 'r', C.green]], 300, 1100, 72); F([['−5', 'r', NEG]], 780, 1100, 72); T('cinco de fortuna', 300, 1150, { k: 'mono', s: 22, c: C.mute, a: 'c' }); T('deber cinco', 780, 1150, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
      fade(A(t, 25.6, .6), () => { T('0', CX, 780, { k: 'r', s: 200, a: 'c', c: C.amber, g: 30 }); F([['5', 'r', C.green], [' + (', 'r'], ['−5', 'r', NEG], [') = 0', 'r']], CX, 1100, 84); });
    });
  },
  // 5 · Los enteros: la recta que crece hacia los dos lados; ℤ = {…, −2, −1, 0, 1, 2, …}.
  enteros(t) {
    stars(t, .4);
    const k = eio(seg(t, .6, 3.4)), lo = -6.5, hi = 6.5;
    const px = v => CX + v / hi * 440;
    stroke('rgba(225,232,255,.9)', 3, () => { X.moveTo(CX - 440 * k, 760); X.lineTo(CX + 440 * k, 760); }, { g: 6 });
    if (k > .97) { stroke('rgba(225,232,255,.9)', 3, () => { X.moveTo(CX + 426, 751); X.lineTo(CX + 442, 760); X.lineTo(CX + 426, 769); X.moveTo(CX - 426, 751); X.lineTo(CX - 442, 760); X.lineTo(CX - 426, 769); }, { g: 6 }); }
    for (let v = -6; v <= 6; v++) {
      if (Math.abs(px(v) - CX) > 440 * k) continue;
      const col = v > 0 ? C.amber : v < 0 ? NEG : C.ink;
      dot(px(v), 760, v === 0 ? 12 : 9, col, 14);
      T(neg(v), px(v), 818, { k: 'r', s: 32, a: 'c', c: col });
    }
    fade(A(t, 3.4, .6), () => { T('negativos', px(-3.5), 690, { k: 'mono', s: 24, a: 'c', c: NEG }); T('positivos', px(3.5), 690, { k: 'mono', s: 24, a: 'c', c: C.amber }); T('cero', CX, 690, { k: 'mono', s: 24, a: 'c', c: C.ink }); });
    fade(A(t, 4.4, .6), () => F([['ℤ', 'r', C.cyan], [' = {…, −3, −2, −1, 0, 1, 2, 3, …}', 'r']], CX, 1040, 64, { rev: seg(t, 4.6, 7.6), max: 940 }));
    fade(win(t, 10, 18.6), () => { T('Zahlen', CX, 1200, { k: 'it', s: 80, a: 'c', c: C.cyan, g: 16 }); T('alemán: «números»', CX, 1250, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
    fade(A(t, 19.2, .6), () => { arrow(CX + 40, 900, CX + 400, 900, C.amber, eio(seg(t, 19.4, 21)), 3); arrow(CX - 40, 900, CX - 400, 900, NEG, eio(seg(t, 19.4, 21)), 3); T('enteros = infinitos hacia los dos lados', CX, 1200, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
  },
  // 6 · La cuenta de banco: saldo 3, pago de 8 → −5; consignación de 5 → 0. El saldo vivo en la recta.
  cuenta(t) {
    stars(t, .3);
    const px = nline(100, 1000, 820, -7, 5, { lab: v => true, s: 28 });
    const s1 = eio(seg(t, 2.2, 6.6)), s2 = eio(seg(t, 20, 23.4)), v = t < 19 ? lerp(3, -5, s1) : lerp(-5, 0, s2), col = v < -.01 ? NEG : v > .01 ? C.green : C.ink;
    // el saldo como una barra desde el cero
    X.save(); X.fillStyle = hexA(col, .25); X.fillRect(Math.min(px(0), px(v)), 780, Math.abs(px(v) - px(0)), 80); X.restore();
    stroke(col, 3, () => X.rect(Math.min(px(0), px(v)), 780, Math.abs(px(v) - px(0)), 80), { g: 12 });
    dot(px(v), 820, 14, col, 30);
    // la tarjeta del extracto
    stroke('rgba(200,210,245,.6)', 2, () => X.roundRect(170, 380, 740, 300, 22), { g: 4 });
    T('EXTRACTO', 210, 432, { k: 'mono', s: 24, c: C.mute, ls: 4 });
    const lines = [['saldo inicial', '+3', C.green, 0], ['pago', '−8', NEG, 2], ['consignación', '+5', C.green, 19.6]];
    lines.forEach(([a, b, c, t0], i) => fade(A(t, t0, .5), () => { T(a, 210, 500 + i * 54, { k: 'mono', s: 26, c: C.ink }); T(b, 870, 500 + i * 54, { k: 'mono', s: 26, c, a: 'r' }); }));
    T('saldo = ' + (Math.round(v) === 0 && Math.abs(v) < .5 ? '0' : neg(Math.round(v))), 870, 650, { k: 'mono', s: 30, c: col, a: 'r', g: 10 });
    // pasos a la izquierda contados
    if (t > 10 && t < 19) { const n = clamp(Math.floor((t - 10.4) / .5) + 1, 0, 8); for (let i = 0; i < n; i++) hop(px(3 - i), px(2 - i), 820, 50, NEG, 1, 2.5); T('pasos a la izquierda = ' + n, 96, 1240, { k: 'mono', s: 26, c: NEG, g: 8 }); }
    fade(A(t, 6.8, .6), () => F([['3', 'r', C.green], [' − ', 'r'], ['8', 'r', NEG], [' = ', 'r'], ['−5', 'r', NEG]], CX, 1080, 96));
    fade(A(t, 23.6, .6), () => F([['−5', 'r', NEG], [' + ', 'r'], ['5', 'r', C.green], [' = ', 'r'], ['0', 'r']], CX, 1180, 72));
  },
  // 7 · Opuestos: un espejo en el cero refleja 8 en −8; suman cero; dos reflejos devuelven al principio.
  opuestos(t) {
    stars(t, .4);
    const px = nline(80, 1000, 820, -10, 10, { step: 2, lab: v => v % 2 === 0 });
    // el espejo
    stroke('rgba(210,225,255,.85)', 3, () => { X.moveTo(px(0), 520); X.lineTo(px(0), 940); }, { g: 18 });
    fade(.08, () => { X.fillStyle = '#c8d8ff'; X.fillRect(px(0) - 8, 520, 16, 420); });
    const f1 = eio(seg(t, 2.4, 5)), f2 = eio(seg(t, 20.6, 23.4)), f3 = eio(seg(t, 23.6, 26.4));
    dot(px(8), 820, 14, C.amber, 26); T('8', px(8), 760, { k: 'r', s: 44, a: 'c', c: C.amber });
    if (t < 19.2) {
      // el reflejo viaja por un arco
      const x = lerp(px(8), px(-8), f1), y = 820 - 220 * Math.sin(Math.PI * f1);
      if (f1 > 0) { stroke(hexA(C.violet, .6), 2, () => { for (let i = 0; i <= 30 * f1; i++) { const u = i / 30, xx = lerp(px(8), px(-8), u), yy = 820 - 220 * Math.sin(Math.PI * u); i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } }, { dash: [6, 8] }); dot(x, y, 14, NEG, 26); }
      fade(A(t, 5, .5), () => { T('−8', px(-8), 760, { k: 'r', s: 44, a: 'c', c: NEG }); T('distancia 8', px(4), 900, { k: 'mono', s: 22, c: C.mute, a: 'c' }); T('distancia 8', px(-4), 900, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
      fade(A(t, 10.4, .6), () => F([['8', 'r', C.amber], [' + (', 'r'], ['−8', 'r', NEG], [') = 0', 'r']], CX, 1120, 96, { rev: seg(t, 10.6, 12.6) }));
    } else {
      // dos reflejos: 8 → −8 → 8
      const a = lerp(px(8), px(-8), f2), b = lerp(px(-8), px(8), f3), yA = 820 - 200 * Math.sin(Math.PI * f2), yB = 820 - 200 * Math.sin(Math.PI * f3);
      if (f3 <= 0) dot(a, yA, 14, NEG, 26); else dot(b, yB, 14, C.amber, 30);
      fade(A(t, 19.4, .6), () => F([['−(', 'r'], ['−8', 'r', NEG], [') = ', 'r'], ['8', 'r', C.amber]], CX, 1120, 96, { rev: seg(t, 19.6, 21.6) }));
      fade(A(t, 22, .5), () => T('reflejos = ' + (f3 > .99 ? 2 : f2 > .99 ? 1 : 0), 96, 1240, { k: 'mono', s: 26, c: C.amber, g: 8 }));
    }
  },
  // 8 · ℕ ⊆ ℤ: el óvalo de los naturales dentro del de los enteros, y lo que queda afuera.
  inclusion(t) {
    stars(t, .4);
    family(CX, 740, 450, 310, 'ℤ', C.cyan, eio(seg(t, .4, 2.6)), { lx: CX + 380, ly: 470 });
    family(CX + 140, 740, 230, 200, 'ℕ', C.amber, eio(seg(t, 2, 4)), { lx: CX + 300, ly: 580, fill: .12 });
    const nat = [[1, CX + 70, 680], [2, CX + 190, 650], [3, CX + 120, 780], [7, CX + 240, 800], [15, CX + 60, 860]], rest = [['0', CX - 170, 620], ['−1', CX - 220, 760], ['−2', CX - 130, 880], ['−3', CX - 300, 640], ['−10', CX - 310, 880]];
    nat.forEach(([v, x, y], i) => fade(A(t, 3 + i * .3, .4), () => { dot(x, y, 9, C.amber, 14); T(String(v), x + 18, y + 12, { k: 'r', s: 38, c: C.ink }); }));
    rest.forEach(([s, x, y], i) => fade(A(t, 4.6 + i * .3, .4), () => { const hi = t > 10.2; dot(x, y, 9, hi ? NEG : C.cyan, hi ? 24 : 14); T(s, x + 18, y + 12, { k: 'r', s: 38, c: hi ? NEG : C.ink }); }));
    fade(A(t, 6, .6), () => F([['ℕ', 'r', C.amber], [' ⊆ ', 'r', C.green], ['ℤ', 'r', C.cyan]], CX, 1180, 110));
    fade(A(t, 12, .6), () => F([['ℤ', 'r', C.cyan], [' − ', 'r'], ['ℕ', 'r', C.amber], [' = {…, −3, −2, −1, 0}', 'r', NEG]], CX, 1320, 60, { rev: seg(t, 12.2, 15), max: 940 }));
  },
  // 9 · El cero: la frontera; el calendario salta del 1 a. C. al 1 d. C.; ℕ empieza en 1 en este curso.
  cero(t) {
    stars(t, .4);
    fade(win(t, .4, 9.8), () => {
      const px = nline(100, 1000, 760, -5, 5, {});
      X.save(); X.fillStyle = hexA(NEG, .14); X.fillRect(100, 700, px(0) - 100, 120); X.fillStyle = hexA(C.amber, .14); X.fillRect(px(0), 700, 1000 - px(0), 120); X.restore();
      stroke(C.ink, 3, () => { X.moveTo(px(0), 640); X.lineTo(px(0), 880); }, { g: 20 });
      T('negativos', px(-2.5), 670, { k: 'mono', s: 24, c: NEG, a: 'c' }); T('positivos', px(2.5), 670, { k: 'mono', s: 24, c: C.amber, a: 'c' });
      fade(A(t, 2.4, .6), () => T('el cero no es ninguno de los dos', CX, 1000, { k: 'it', s: 44, a: 'c', c: C.ink }));
    });
    // el calendario
    fade(win(t, 9.8, 23), () => {
      const yrs = [-3, -2, -1, 1, 2, 3], x0 = 130, gap = 164, k = seg(t, 10.4, 14);
      yrs.forEach((y, i) => fade(A(t, 10.4 + i * .3, .4), () => { const x = x0 + i * gap; stroke(y < 0 ? NEG : C.amber, 2.5, () => X.roundRect(x - 62, 640, 124, 150, 14)); T(String(Math.abs(y)), x, 730, { k: 'r', s: 64, a: 'c', c: C.ink }); T(y < 0 ? 'a. C.' : 'd. C.', x, 772, { k: 'mono', s: 22, a: 'c', c: y < 0 ? NEG : C.amber }); }));
      fade(A(t, 13.4, .6), () => { const x = x0 + 2.5 * gap; stroke(C.red, 3, () => { X.moveTo(x, 610); X.lineTo(x, 820); }, { dash: [8, 8], g: 10 }); T('año 0: no existe', x, 880, { k: 'mono', s: 25, c: C.red, a: 'c', g: 8 }); });
      fade(A(t, 15, .6), () => T('Dionisio el Exiguo · año 525', CX, 1000, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
      fade(A(t, 15.6, .6), () => T('del 1 a. C. al 1 d. C. pasa un solo año', CX, 1050, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    });
    fade(A(t, 23.2, .6), () => {
      F([['ℕ', 'r', C.amber], [' = {1, 2, 3, …}', 'r']], CX, 760, 84);
      F([['0', 'r'], [' ∉ ', 'r', C.red], ['ℕ', 'r', C.amber], ['       ', 'r'], ['0', 'r'], [' ∈ ', 'r', C.green], ['ℤ', 'r', C.cyan]], CX, 940, 72);
    });
  },
  // 10 · Cierre: del hueso a la cuenta; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => {
      X.save(); X.translate(CX, 640); X.rotate(-.12); stroke('#ffd9a0', 3, () => X.roundRect(-300, -36, 600, 72, 32), { g: 12 });
      for (let i = 0; i < 24; i++) stroke(C.amber, 2.5, () => { X.moveTo(-260 + i * 22, -22); X.lineTo(-258 + i * 22, 22); }, { g: 8 });
      X.restore();
      const px = nline(160, 920, 900, -5, 5, { k: eio(seg(t, 3, 5)) });
      fade(A(t, 5, .6), () => { dot(px(3), 900, 12, C.green, 24); dot(px(-5), 900, 12, NEG, 24); hop(px(3), px(-5), 900, 120, NEG, seg(t, 5.4, 7.4)); });
    });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['ℕ', 'r', C.amber], [' = {1, 2, 3, …}', 'r']], 'naturales'], [[['ℤ', 'r', C.cyan], [' = {…, −1, 0, 1, …}', 'r']], 'enteros'], [[['ℕ', 'r', C.amber], [' ⊆ ', 'r', C.green], ['ℤ', 'r', C.cyan]], 'todo natural es entero'], [[['a', 'i'], [' + (', 'r'], ['−a', 'i', NEG], [') = 0', 'r']], 'opuestos']], 420, 170, 54);
      endCard(t, 19.4, D.TITLE, D.LINE, [C.amber, C.cyan, NEG]);
    });
  },
};
