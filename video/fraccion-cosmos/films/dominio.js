// «La cantidad infinita de Bhaskara» · escenas de la lección alg-25a. Motor en kit.js y fraccion.js; guion en dominio.data.js.
// El numerador en ámbar, el denominador en cian, lo prohibido (asíntota, hueco) en rosa, lo que se simplifica en verde.
const NU = C.amber, DE = C.cyan, NO = C.mag, SI = C.green;
// Gráfica de f entre x0 y x1 saltando cerca de las asíntotas av (lista); P(x, y) con origen (ox, oy) y escala u, sy.
function rplot(ox, oy, u, sy, f, x0, x1, av = [], k = 1, col = NU, ymax = 9) {
  const P = (x, y) => [ox + x * u, oy - y * u * sy];
  stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox + x0 * u - 10, oy); X.lineTo(ox + x1 * u + 10, oy); X.moveTo(ox, oy + ymax * u * sy * .5); X.lineTo(ox, oy - ymax * u * sy); }, { g: 4 });
  for (let i = Math.ceil(x0); i <= x1; i++) if (i) stroke('rgba(225,232,255,.4)', 1.5, () => { X.moveTo(ox + i * u, oy - 5); X.lineTo(ox + i * u, oy + 5); }, { g: 0 });
  av.forEach(a => stroke(hexA(NO, .6), 2, () => { X.moveTo(ox + a * u, oy - ymax * u * sy); X.lineTo(ox + a * u, oy + ymax * u * sy * .5); }, { g: 6, dash: [10, 8] }));
  const cuts = [x0, ...av.filter(a => a > x0 && a < x1), x1];
  for (let s = 0; s < cuts.length - 1; s++) { const a = cuts[s] + (s ? .04 : 0), b = cuts[s + 1] - (s < cuts.length - 2 ? .04 : 0); curve(x => { const y = clamp(f(x), -ymax * .5, ymax); return P(x, y); }, a, b, col, k); }
  return P;
}
const S = {
  // 1 · Bhaskara: a/0 y los intentos de resultado.
  bhaskara(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { T('Bhaskara II · Lilavati y Bijaganita', CX, 460, { k: 'mono', s: 24, a: 'c', c: C.mute }); const r = F([['6', 'r', NU], [' / ', 'r'], ['0', 'r', DE], [' = ', 'r'], ['∞', 'r', NO]], CX, 640, 110); const k = eo(seg(t, 18.8, 19.8)); if (k > 0) stroke(NO, 5, () => { X.moveTo(r.mid(3) - 40, 650); X.lineTo(lerp(r.mid(3) - 40, r.mid(4) + 50, k), lerp(650, 570, k)); }, { g: 14 }); });
    fade(A(t, 18.6, .6), () => { const v = [1, 2, 6, 100][Math.min(3, Math.floor(seg(t, 19, 26) * 4))]; F([['0', 'r', DE], [' · ' + v + ' = 0 ≠ 6', 'r', NO]], CX, 880, 64); T('ningún número sirve: no está definido', CX, 980, { k: 'mono', s: 26, a: 'c', c: NO }); });
  },
  // 2 · Expresión racional: el alquiler repartido.
  racional(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['P', 'i', NU], ['(', 'r'], ['x', 'i'], [')', 'r'], [' / ', 'r'], ['Q', 'i', DE], ['(', 'r'], ['x', 'i'], [')', 'r']], CX, 520, 84));
    fade(A(t, 10.2, .6), () => { const n = 1 + Math.floor(seg(t, 10.4, 26) * 7.99), w = 720 / n; for (let i = 0; i < n; i++) { bar(180 + i * w, 640, w - 6, 120, i % 2 ? NU : DE, 1, { fill: .3 }); } T(n + (n > 1 ? ' personas' : ' persona') + ' · ' + num(200000 / n) + ' cada una', CX, 840, { k: 'mono', s: 30, a: 'c', c: NU, g: 8 }); F([['200 000 / ', 'r'], ['n', 'i', DE]], CX, 960, 64); });
  },
  // 3 · El dominio: fuera los ceros del denominador.
  dominio(t) {
    stars(t, .3);
    F([['Q', 'i', DE], ['(', 'r'], ['x', 'i'], [') ≠ 0', 'r']], CX, 520, 84);
    fade(A(t, 10.2, .6), () => T('200 000 / 0: nadie para pagar', CX, 640, { k: 'mono', s: 28, a: 'c', c: NO }));
    fade(A(t, 20.2, .6), () => { F([['(', 'r'], ['x', 'i'], [' + 2) / ((', 'r'], ['x', 'i', DE], [' − 2', 'r', DE], [')(', 'r'], ['x', 'i', DE], [' + 1', 'r', DE], ['))', 'r']], CX, 760, 52); const px = nline(140, 940, 940, -4, 4, { step: 1, s: 26 }); [2, -1].forEach(v => { ring(px(v), 940, 14, NO, 3); stroke(NO, 3, () => { X.moveTo(px(v) - 10, 930); X.lineTo(px(v) + 10, 950); }, { g: 8 }); }); T('todos los reales menos 2 y −1', CX, 1060, { k: 'mono', s: 26, a: 'c', c: SI }); });
  },
  // 4 · La asíntota: 1/x se dispara cerca de 0.
  asintota(t) {
    stars(t, .3);
    const P = rplot(CX, 860, 110, .35, x => 1 / x, -4, 4, [0], seg(t, .8, 3), NU, 10);
    fade(A(t, 1.4, .5), () => [[.1, '10'], [.01, '100']].forEach(([x, l], i) => T('1/' + x + ' = ' + l, 760, 480 + i * 50, { k: 'mono', s: 26, c: NU })));
    fade(A(t, 10.2, .6), () => T('asíntota: x = 0', CX + 20, 440, { k: 'mono', s: 24, c: NO }));
    fade(A(t, 20.2, .6), () => T('1/(−0.01) = −100', 160, 1220, { k: 'mono', s: 26, c: DE }));
    void P;
  },
  // 5 · Simplificar: el factor (x − 2) se tacha arriba y abajo.
  simplificar(t) {
    stars(t, .3);
    const tach = seg(t, 11, 13);
    const r = F([['(', 'r'], ['x', 'i', SI], [' − 2', 'r', SI], [')(', 'r'], ['x', 'i'], [' + 2)', 'r']], CX, 640, 72);
    stroke('rgba(225,232,255,.8)', 3, () => { X.moveTo(CX - 240, 680); X.lineTo(CX + 240, 680); }, { g: 4 });
    const r2 = F([['(', 'r'], ['x', 'i', SI], [' − 2', 'r', SI], [')(', 'r'], ['x', 'i'], [' + 1)', 'r']], CX, 770, 72);
    if (tach > 0) [r, r2].forEach((q, i) => stroke(NO, 4, () => { X.moveTo(q.mid(0) - 20, (i ? 770 : 640) + 10); X.lineTo(lerp(q.mid(0) - 20, q.mid(3) + 10, tach), lerp((i ? 770 : 640) + 10, (i ? 770 : 640) - 50, tach)); }, { g: 12 }));
    fade(A(t, 13.4, .5), () => F([['= (', 'r'], ['x', 'i'], [' + 2) / (', 'r'], ['x', 'i'], [' + 1)', 'r']], CX, 900, 64));
    fade(A(t, 20.2, .6), () => F([['6/8 = (', 'r'], ['2', 'r', SI], [' · 3)/(', 'r'], ['2', 'r', SI], [' · 4) = 3/4', 'r']], CX, 1060, 60));
    fade(A(t, .8, .6), () => T('se factoriza arriba y abajo', CX, 500, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 6 · Solo factores: (x + 5)/x no es 5.
  factores(t) {
    stars(t, .3);
    F([['(', 'r'], ['x', 'i', NO], [' + 5) / ', 'r'], ['x', 'i', NO]], CX, 620, 96);
    fade(A(t, 10.2, .6), () => { T('= 5', CX + 260, 620, { k: 'r', s: 80, c: NO }); check(CX + 430, 600, 28, false, A(t, 11, .5)); T('la x de arriba suma: no es factor', CX, 760, { k: 'mono', s: 26, a: 'c', c: NO }); });
    fade(A(t, 19.2, .6), () => F([['x', 'i'], [' = 1:  (1 + 5)/1 = ', 'r'], ['6', 'r', SI]], CX, 920, 64));
  },
  // 7 · Un hueco y un río: la gráfica de (x + 2)/(x + 1) con el hueco en (2, 4/3).
  hueco(t) {
    stars(t, .3);
    const f = x => (x + 2) / (x + 1), P = rplot(CX - 60, 900, 100, .55, f, -4.5, 4.5, [-1], seg(t, .8, 3), NU, 6);
    fade(A(t, .8, .5), () => F([['x', 'i'], [' ≠ 2,  ', 'r', NO], ['x', 'i'], [' ≠ −1', 'r', NO]], CX, 450, 56));
    fade(A(t, 10.2, .6), () => { const [a, b] = P(2, 4 / 3); X.save(); X.fillStyle = C.bg; X.beginPath(); X.arc(a, b, 10, 0, 7); X.fill(); X.restore(); ring(a, b, 10, NO, 3); T('hueco', a + 18, b - 18, { k: 'mono', s: 22, c: NO }); });
    fade(A(t, 20.2, .6), () => T('asíntota x = −1', CX - 160, 1240, { k: 'mono', s: 24, a: 'c', c: NO }));
  },
  // 8 · Cerca del hueco: tabla de valores.
  valor(t) {
    stars(t, .3);
    const f = x => (x + 2) / (x + 1);
    [[1.9, 1.99], [2.1, 2.01]].forEach(([a, b], j) => fade(A(t, 1 + j * .8, .4), () => { T('x = ' + a + ':  ' + f(a).toFixed(3), 300 + j * 480, 560, { k: 'mono', s: 28, a: 'c', c: NU }); fade(A(t, 10.2, .5), () => T('x = ' + b + ':  ' + f(b).toFixed(3), 300 + j * 480, 630, { k: 'mono', s: 28, a: 'c', c: NU })); }));
    fade(A(t, 4, .5), () => F([['→ 4/3 ≈ 1.333', 'r', SI]], CX, 760, 60));
    fade(A(t, 19.2, .6), () => { T('x = 2:  sin valor', CX, 880, { k: 'mono', s: 30, a: 'c', c: NO }); F([['(2, 4/3)', 'r', NO]], CX, 1000, 72); });
  },
  // 9 · El alquiler: la curva 200 000 / n con sus dos extremos.
  alquiler(t) {
    stars(t, .3);
    const P = (n, y) => [180 + n * 70, 1180 - y / 200000 * 640];
    stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(180, 1180); X.lineTo(960, 1180); X.moveTo(180, 1180); X.lineTo(180, 480); }, { g: 4 });
    for (let n = 1; n <= 10; n++) fade(A(t, 1 + n * .4, .3), () => { const [a, b] = P(n, 200000 / n); dot(a, b, 10, NU, 18); T(String(n), a, 1220, { k: 'mono', s: 20, a: 'c', c: C.mute }); });
    T('personas', 960, 1260, { k: 'mono', s: 20, a: 'r', c: C.mute });
    fade(A(t, 10.2, .6), () => T('1 persona: 200 000', P(1, 0)[0] + 30, 520, { k: 'mono', s: 24, c: NU }));
    fade(A(t, 20.2, .6), () => T('1 000 personas: 200 cada una', CX, 1340, { k: 'mono', s: 24, a: 'c', c: SI }));
  },
  // 10 · Cierre: hueco y asíntota juntos; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { const P = rplot(CX - 60, 900, 100, .55, x => (x + 2) / (x + 1), -4.5, 4.5, [-1], 1, NU, 6); const [a, b] = P(2, 4 / 3); X.save(); X.fillStyle = C.bg; X.beginPath(); X.arc(a, b, 10, 0, 7); X.fill(); X.restore(); ring(a, b, 10, NO, 3); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['Q', 'i'], ['(', 'r'], ['x', 'i'], [') ≠ 0', 'r']], 'dominio'], [[['1/', 'r'], ['x', 'i']], 'asíntota en x = 0'], [[['(', 'r'], ['x', 'i'], [' − 2)', 'r', SI], ['·…/(', 'r'], ['x', 'i'], [' − 2)', 'r', SI], ['·…', 'r']], 'solo factores'], [[['(2, 4/3)', 'r', NO]], 'hueco']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [NU, SI, DE]);
    });
  },
};
