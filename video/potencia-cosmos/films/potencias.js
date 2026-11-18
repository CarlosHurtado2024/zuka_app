// «El contador de arena» · escenas de la lección alg-21a. Motor en kit.js y potencia.js; guion en potencias.data.js.
// La base en ámbar, el exponente en cian; lo positivo en verde y lo negativo en rosa.
const BA = C.amber, EXC = C.cyan, POS = C.green, NEG = C.mag;
// Una bacteria: cápsula de largo l centrada en (x, y), girada a.
function bacterium(x, y, l, col = POS, a = 0) { X.save(); X.translate(x, y); X.rotate(a); stroke(col, 2.5, () => X.roundRect(-l / 2, -l * .22, l, l * .44, l * .22), { g: 12 }); X.restore(); }
// Escalones de la escalera: exp → [texto del valor].
const STEP = { 3: '1 000', 2: '100', 1: '10', 0: '1', '-1': '0.1', '-2': '0.01', '-3': '0.001' };
function stairs(t, exps, x0, y0, dx, dy, o = {}) {
  exps.forEach((e, i) => fade(o.k ? clamp(o.k * exps.length - i) : 1, () => {
    const x = x0 + i * dx, y = y0 + i * dy, col = e > 0 ? BA : e === 0 ? POS : NEG;
    stroke(hexA(col, .8), 3, () => { X.moveTo(x - 10, y); X.lineTo(x + dx - 10, y); X.lineTo(x + dx - 10, y + dy); }, { g: 10 });
    pw('10', String(e).replace('-', '−'), x + 4, y - 18, 40, C.ink, EXC);
    T(STEP[e], x + dx - 24, y - 18, { k: 'r', s: 34, a: 'r', c: col, g: 6 });
    if (i && o.arrows) T('÷ 10', x - 16, y - dy / 2 - 6, { k: 'mono', s: 20, a: 'r', c: C.mute });
  }));
}
const S = {
  // 1 · Arquímedes: granos de arena; el número de granos se escribe con 63 ceros.
  arquimedes(t) {
    stars(t, .4);
    const R = rng(5), n = Math.floor(900 * seg(t, .8, 9));
    for (let i = 0; i < n; i++) { const x = 120 + R() * 840, y = 360 + R() * 520; X.fillStyle = hexA('#ffd9a0', .35 + R() * .5); X.fillRect(x, y, 2.5, 2.5); }
    fade(A(t, 1.4, .6), () => T('«El contador de arena» · Arquímedes', CX, 960, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    fade(A(t, 18.6, .6), () => {
      const z = Math.min(63, Math.floor(63 * seg(t, 19, 24))), s = '1' + '0'.repeat(z), groups = [];
      let head = s.length % 3 || 3; groups.push(s.slice(0, head)); for (let i = head; i < s.length; i += 3) groups.push(s.slice(i, i + 3));
      for (let r = 0; r * 8 < groups.length; r++) T(groups.slice(r * 8, r * 8 + 8).join(' '), CX, 1060 + r * 56, { k: 'r', s: 40, a: 'c', c: '#ffd9a0', max: 960 });
      T('ceros = ' + z, 96, 1300, { k: 'mono', s: 26, c: EXC, g: 8 });
      fade(A(t, 24.4, .6), () => pw('10', 63, CX, 560, 150, BA, EXC, { a: 'c', g: 20 }));
    });
  },
  // 2 · Una potencia: 10 · 10 · 10 se pliega en 10³; base y exponente señalados.
  potencia(t) {
    stars(t, .3);
    const m = eio(seg(t, 4, 6.5));
    for (let i = 0; i < 3; i++) fade(A(t, 1 + i * .5, .4) * (1 - m), () => { chip(CX - 300 + i * 300, 600, 170, 110, BA, '10', { s: 56, c: BA }); if (i < 2) T('·', CX - 150 + i * 300, 618, { k: 'r', s: 60, a: 'c' }); });
    fade(m, () => {
      pw('10', 3, CX - 90, 680, 200, BA, EXC, { g: 18 });
      fade(A(t, 10.2, .6), () => { arrow(CX - 260, 820, CX - 40, 720, BA, eo(seg(t, 10.2, 11.2)), 3); T('base', CX - 280, 860, { k: 'it', s: 44, a: 'c', c: BA }); arrow(CX + 300, 420, CX + 160, 500, EXC, eo(seg(t, 12.2, 13.2)), 3); T('exponente', CX + 300, 400, { k: 'it', s: 44, a: 'c', c: EXC }); });
    });
    fade(A(t, 19.2, .6), () => { F([['10 · 10 · 10', 'r', BA], [' = ', 'r'], ['1 000', 'r', POS]], CX, 1020, 64); T('«diez al cubo»', CX, 1100, { k: 'it', s: 44, a: 'c', c: '#c3ccec' }); });
    fade(A(t, 22.4, .6), () => T('10¹ = 10   10² = 100   10³ = 1 000   10⁴ = 10 000', CX, 1210, { k: 'mono', s: 26, a: 'c', c: C.mute, max: 940 }));
  },
  // 3 · Duplicarse: un árbol de divisiones; luego 2¹² = 4 096 bacterias en una cuadrícula.
  bacterias(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => {
      const lv = Math.min(5, Math.floor(seg(t, 1.5, 15) * 6)), y0 = 440;
      for (let d = 0; d <= lv; d++) { const n = 2 ** d; for (let i = 0; i < n; i++) { const x = 540 + (i - (n - 1) / 2) * (860 / Math.max(n, 2)) * (n > 1 ? 1 : 0), y = y0 + d * 140; bacterium(x, y, Math.max(26, 70 - d * 9), POS, d % 2 ? Math.PI / 2 : 0); if (d) { const px = 540 + (Math.floor(i / 2) - (n / 2 - 1) / 2) * (860 / Math.max(n / 2, 2)) * (n > 2 ? 1 : 0); stroke(hexA(POS, .35), 1.5, () => { X.moveTo(px, y - 140 + 22); X.lineTo(x, y - 22); }, { g: 0 }); } } }
      T('divisiones = ' + lv, 96, 1300, { k: 'mono', s: 26, c: EXC, g: 8 }); T('bacterias = ' + 2 ** lv, 984, 1300, { k: 'mono', s: 26, a: 'r', c: POS, g: 8 });
      fade(A(t, 10.2, .6), () => F([['2', 'r', BA], ['ⁿ', 'r', EXC]], CX, 1240, 80));
    });
    fade(A(t, 20, .6), () => {
      const k = seg(t, 20.4, 24), m = Math.floor(4096 * k);
      for (let i = 0; i < m; i++) { X.fillStyle = hexA(POS, .75); X.fillRect(220 + (i % 64) * 10, 420 + Math.floor(i / 64) * 10, 7, 7); }
      pw('2', 12, CX - 170, 1160, 90, BA, EXC); T('= ' + num(m), CX - 30, 1160, { k: 'r', s: 80, c: POS, g: 12 });
      T('4 horas = 12 divisiones de 20 min', CX, 1250, { k: 'mono', s: 24, a: 'c', c: C.mute });
    });
  },
  // 4 · No es multiplicar: diez doses sumados (20) contra diez doses multiplicados (1 024).
  trampa(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { pw('2', 10, 250, 560, 110, BA, EXC); T('≠', CX, 560, { k: 'r', s: 110, a: 'c', c: C.red }); T('2 · 10', 830, 560, { k: 'r', s: 110, a: 'c', c: BA }); });
    fade(A(t, 10, .6), () => { const k = Math.floor(10 * seg(t, 10.4, 14)); T(Array(Math.max(1, k)).fill('2').join(' + ') + ' = ' + 2 * Math.max(1, k), CX, 760, { k: 'r', s: 40, a: 'c', c: C.ink, max: 960 }); T('suma', 96, 820, { k: 'mono', s: 22, c: C.mute }); });
    fade(A(t, 19, .6), () => {
      const k = Math.max(1, Math.floor(10 * seg(t, 19.4, 23.4)));
      T(Array(k).fill('2').join(' · ') + ' = ' + num(2 ** k), CX, 940, { k: 'r', s: 40, a: 'c', c: POS, max: 960, g: 6 });
      T('producto', 96, 1000, { k: 'mono', s: 22, c: C.mute });
      bar(140, 1080, 800 * 20 / 1024, 50, BA, 1); bar(140, 1160, 800 * (2 ** k) / 1024, 50, POS, 1); T('20', 160 + 800 * 20 / 1024, 1118, { k: 'r', s: 32, c: BA }); T(num(2 ** k), Math.min(940, 160 + 800 * (2 ** k) / 1024), 1150, { k: 'r', s: 32, c: POS, a: 'r' });
    });
  },
  // 5 · El signo: multiplicar por −2 salta de un lado al otro de la recta (media vuelta).
  signo(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, -18, 18, { step: 2, lab: v => v % 4 === 0, s: 26 });
    dot(px(0), 760, 6, C.ink, 10);
    const vals = [1, -2, 4, -8, 16], k = seg(t, 1.2, 19) * 4, i = Math.min(3, Math.floor(k)), f = eio(k - i);
    for (let j = 0; j < Math.min(4, Math.floor(k)); j++) hop(px(vals[j]), px(vals[j + 1]), 760, 80 + j * 30, j % 2 ? POS : NEG, 1, 2.5);
    if (k < 4) hop(px(vals[i]), px(vals[i + 1]), 760, 80 + i * 30, i % 2 ? POS : NEG, f, 3);
    const cur = k >= 4 ? 4 : f > .98 ? i + 1 : i;
    dot(px(vals[cur]), 760, 14, vals[cur] > 0 ? POS : NEG, 28);
    F([['(−2)', 'r', NEG], [String(['⁰', '¹', '²', '³', '⁴'][cur]), 'r', EXC], [' = ', 'r'], [String(vals[cur]).replace('-', '−'), 'r', vals[cur] > 0 ? POS : NEG]], CX, 560, 84);
    fade(A(t, 10.2, .6), () => T('par → positivo      impar → negativo', CX, 960, { k: 'mono', s: 28, a: 'c', c: C.ink }));
    fade(A(t, 20.2, .6), () => { F([['(−2)', 'r', NEG], ['⁴', 'r', EXC], [' = ', 'r'], ['16', 'r', POS]], CX, 1100, 64); F([['−', 'r', NEG], ['2', 'r', BA], ['⁴', 'r', EXC], [' = −(2⁴) = ', 'r'], ['−16', 'r', NEG]], CX, 1200, 64); });
  },
  // 6 · La escalera: 10³, 10², 10¹, 10⁰; cada escalón ÷ 10.
  escalera(t) {
    stars(t, .3);
    stairs(t, t < 19 ? [3, 2, 1] : [3, 2, 1, 0], 150, 470, 190, 150, { k: t < 19 ? seg(t, 1, 4) : 1, arrows: t > 10 });
    fade(A(t, 19.4, .6), () => { F([['10 ÷ 10 = ', 'r'], ['1', 'r', POS]], CX, 1200, 64); F([['10', 'r'], ['⁰', 'r', EXC], [' = 1', 'r', POS], ['   no 0', 'it', C.red]], CX, 1290, 56); });
  },
  // 7 · Exponente cero: tres columnas (2, 7 y −3) bajan dividiendo y todas llegan a 1.
  cero(t) {
    stars(t, .3);
    fade(win(t, .5, 18.8), () => {
      [[2, [8, 4, 2, 1]], [7, [343, 49, 7, 1]], [-3, [-27, 9, -3, 1]]].forEach(([b, vs], j) => {
        const x = 230 + j * 310, bs = b < 0 ? '(−3)' : String(b);
        vs.forEach((v, i) => fade(A(t, 1 + j * .5 + i * .9, .4), () => { const y = 480 + i * 150; pw(bs, 3 - i, x - 110, y, 44, BA, EXC); T('= ' + String(v).replace('-', '−'), x + 30, y, { k: 'r', s: 44, c: i === 3 ? POS : C.ink, g: i === 3 ? 12 : 0 }); if (i) T('÷ ' + bs, x, y - 82, { k: 'mono', s: 20, a: 'c', c: C.mute }); }));
      });
      fade(A(t, 10.2, .6), () => F([['a', 'i', BA], ['⁰', 'r', EXC], [' = 1', 'r', POS], ['    (', 'r'], ['a', 'i', BA], [' ≠ 0)', 'r']], CX, 1170, 64));
    });
    fade(A(t, 19, .6), () => { bacterium(CX, 720, 160, POS); pw('2', 0, CX - 80, 980, 90, BA, EXC); T('= 1', CX + 30, 980, { k: 'r', s: 90, c: POS, g: 12 }); T('antes de la primera división', CX, 1060, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 8 · Exponente negativo: la escalera sigue bajo el cero; 2⁻³ = 1/8 es positivo.
  negativo(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => {
      stairs(t, [1, 0, -1, -2, -3], 70, 440, 190, 120, { k: seg(t, .8, 5), arrows: true });
      fade(A(t, 10.2, .6), () => F([['a', 'i', BA], ['⁻ⁿ', 'r', EXC], [' = ', 'r'], ['1 / ', 'r'], ['a', 'i', BA], ['ⁿ', 'r', EXC], ['   (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']], CX, 1170, 64));
    });
    fade(A(t, 20, .6), () => {
      F([['2', 'r', BA], ['⁻³', 'r', EXC], [' = 1 / ', 'r'], ['2', 'r', BA], ['³', 'r', EXC], [' = ', 'r'], ['1/8', 'r', POS]], CX, 560, 72);
      const px = nline(140, 940, 820, -1, 1.25, { step: .125, lab: v => v === -1 || v === 0 || v === 1, s: 30 });
      dot(px(.125), 820, 14, POS, 28); T('1/8', px(.125), 770, { k: 'r', s: 36, a: 'c', c: POS }); T('positivo y pequeño', px(.125) + 40, 920, { k: 'mono', s: 24, c: POS });
      stroke(hexA(NEG, .5), 2, () => { X.moveTo(px(-1), 870); X.lineTo(px(0), 870); }, { g: 0, dash: [6, 8] }); T('aquí no cae', px(-.5), 960, { k: 'mono', s: 22, a: 'c', c: NEG });
    });
  },
  // 9 · Lo muy pequeño: regla de potencias de 10 (m, mm, µm, nm); bacteria de 2 µm y virus de 100 nm.
  micro(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => {
      const marks = [[0, 'm', '1'], [-3, 'mm', '10⁻³'], [-6, 'µm', '10⁻⁶'], [-9, 'nm', '10⁻⁹']];
      stroke('rgba(225,232,255,.8)', 3, () => { X.moveTo(140, 760); X.lineTo(940, 760); }, { g: 6 });
      marks.forEach(([e, u, p], i) => fade(A(t, 1 + i * 1.6, .5), () => { const x = 140 + i * 800 / 3; stroke(EXC, 3, () => { X.moveTo(x, 740); X.lineTo(x, 780); }); T(u, x, 700, { k: 'r', s: 44, a: 'c', c: EXC }); T(p + ' m', x, 830, { k: 'r', s: 32, a: 'c', c: C.ink }); }));
      T('cada marca: × 10⁻³', CX, 920, { k: 'mono', s: 24, a: 'c', c: C.mute });
    });
    fade(A(t, 10, .6), () => {
      const z = eio(seg(t, 10.4, 12.4));
      bacterium(CX, 700, lerp(60, 600, z), POS); T('E. coli · 2 µm = 2 · 10⁻⁶ m', CX, 920, { k: 'mono', s: 28, a: 'c', c: POS, g: 8 });
      fade(A(t, 20, .6), () => { const r = 15; ring(CX + 380, 560, r, NEG, 2.5); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; stroke(NEG, 1.5, () => { X.moveTo(CX + 380 + r * Math.cos(a), 560 + r * Math.sin(a)); X.lineTo(CX + 380 + (r + 7) * Math.cos(a), 560 + (r + 7) * Math.sin(a)); }, { g: 6 }); } T('virus · 100 nm', CX + 380, 520, { k: 'mono', s: 22, a: 'c', c: NEG }); T('a la misma escala', CX, 1000, { k: 'mono', s: 22, a: 'c', c: C.mute }); F([['2 · 10⁻⁶ ÷ 10⁻⁷ = ', 'r'], ['20', 'r', POS]], CX, 1120, 56); });
    });
  },
  // 10 · Cierre: 10⁶³ y la bacteria; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { pw('10', 63, CX, 700, 180, BA, EXC, { a: 'c', g: 24 }); T('granos de arena', CX, 800, { k: 'mono', s: 26, a: 'c', c: C.mute }); bacterium(CX, 1000, 110, POS); T('2 · 10⁻⁶ m', CX, 1090, { k: 'mono', s: 26, a: 'c', c: POS }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i', BA], ['ⁿ', 'r', EXC], [' = ', 'r'], ['a', 'i'], ['·…·', 'r'], ['a', 'i']], 'n veces la base'], [[['(−2)', 'r', NEG], ['ⁿ', 'r', EXC]], 'par +, impar −'], [[['a', 'i', BA], ['⁰ = 1', 'r', POS]], 'a ≠ 0'], [[['a', 'i', BA], ['⁻ⁿ = 1/', 'r'], ['a', 'i', BA], ['ⁿ', 'r', EXC]], 'al denominador (a ≠ 0)']], 420, 170, 50);
      endCard(t, 19.6, D.TITLE, D.LINE, [BA, POS, EXC]);
    });
  },
};
