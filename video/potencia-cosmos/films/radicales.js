// «La espiral de Teodoro» · escenas de la lección alg-22b. Motor en kit.js y potencia.js; guion en radicales.data.js.
// La raíz que queda en cian, el cuadrado que sale en ámbar, el resultado en verde, lo que no se puede en rosa.
const RQ = C.cyan, SQ = C.amber, RS = C.green, NO = C.mag;
// Puntos de la espiral de Teodoro: P[k] está a distancia √k del centro (P[1] = (1, 0)).
function spiralPts(n) { const P = [null, [1, 0]]; for (let k = 2; k <= n; k++) { const [x, y] = P[k - 1], r = Math.hypot(x, y); P.push([x - y / r, y + x / r]); } return P; }
// Dibuja la espiral hasta k triángulos (puede ser fraccionario); o.hl: { n: color } resalta hipotenusas; o.labels.
function spiral(cx, cy, u, k, o = {}) {
  const N = Math.ceil(k) + 1, P = spiralPts(Math.max(2, N)), px = p => cx + p[0] * u, py = p => cy - p[1] * u;
  for (let i = 1; i < N; i++) {
    const f = clamp(k - (i - 1)), a = P[i], b = P[i + 1];
    if (f <= 0) break;
    stroke(hexA(C.violet, .7), 2, () => { X.moveTo(px(a), py(a)); X.lineTo(lerp(px(a), px(b), f), lerp(py(a), py(b), f)); }, { g: 6 });
    stroke(hexA(C.ink, .22), 1.5, () => { X.moveTo(cx, cy); X.lineTo(px(a), py(a)); }, { g: 0 });
    if (f >= 1) { stroke(hexA(C.ink, .22), 1.5, () => { X.moveTo(cx, cy); X.lineTo(px(b), py(b)); }, { g: 0 }); if (o.labels && i + 1 <= (o.labels === true ? 99 : o.labels)) { const m = [(b[0]) * .62, (b[1]) * .62]; T('√' + (i + 1), cx + m[0] * u, cy - m[1] * u + 8, { k: 'r', s: o.ls || 24, a: 'c', c: hexA(C.ink, .7) }); } }
  }
  if (o.hl) for (const [n, col] of Object.entries(o.hl)) { const p = P[+n]; if (p && +n <= N) stroke(col, 5, () => { X.moveTo(cx, cy); X.lineTo(px(p), py(p)); }, { g: 18 }); }
  dot(cx, cy, 6, C.ink, 10);
  return { P, px, py };
}
// Segmentos de largo √n en fila (cada uno de largo L píxeles): para sumar radicales «como objetos».
function segs(x, y, n, L, col, k = 1, lab) { for (let i = 0; i < n; i++) { if (k * n - i <= 0) break; const a = x + i * L; stroke(col, 6, () => { X.moveTo(a + 3, y); X.lineTo(a + L * clamp(k * n - i) - 3, y); }, { g: 12 }); if (lab && k * n - i >= 1) T(lab, a + L / 2, y - 22, { k: 'r', s: 26, a: 'c', c: col }); } }
const S = {
  // 1 · Teodoro: la espiral crece triángulo a triángulo hasta √17.
  teodoro(t) {
    stars(t, .4);
    spiral(CX, 780, 92, 16 * seg(t, 1, 18), { labels: t > 18.6 ? 17 : 0, ls: 22 });
    fade(A(t, 1.4, .6), () => T('Teeteto · Platón', CX, 1250, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    fade(win(t, 9.8, 18.2), () => T('cada triángulo: cateto 1', CX, 1300, { k: 'mono', s: 26, a: 'c', c: C.violet }));
  },
  // 2 · El cuadrado escondido: √8 mide el doble que √2.
  escondido(t) {
    stars(t, .3);
    spiral(CX, 700, 80, 16, { hl: t > 1 ? { 2: RQ, 8: SQ } : {} });
    fade(A(t, 2, .6), () => {
      const L = 80 * Math.SQRT2;
      segs(CX - L, 1060, 2, L, RQ, seg(t, 3, 5), '√2');
      stroke(SQ, 6, () => { X.moveTo(CX - L, 1140); X.lineTo(CX - L + 2 * L * seg(t, 3, 5), 1140); }, { g: 12 }); T('√8', CX + L + 40, 1150, { k: 'r', s: 30, c: SQ });
    });
    fade(A(t, 10.2, .6), () => F([['√8', 'r', SQ], [' = ', 'r'], ['√4', 'r', SQ], [' · ', 'r'], ['√2', 'r', RQ], [' = ', 'r'], ['2', 'r', RS], ['√2', 'r', RQ]], CX, 1250, 64, { rev: seg(t, 10.4, 14) }));
    fade(A(t, 20.2, .6), () => F([['√(', 'r'], ['ab', 'i'], [') = √', 'r'], ['a', 'i'], [' · √', 'r'], ['b', 'i'], ['   (', 'r'], ['a', 'i'], [', ', 'r'], ['b', 'i'], [' ≥ 0)', 'r']], CX, 420, 56));
  },
  // 3 · Simplificar: 12 = 4 · 3 → 2√3; 50 = 25 · 2 → 5√2.
  simplificar(t) {
    stars(t, .3);
    const one = (y, n, sq, rest, root, t0) => fade(A(t, t0, .6), () => {
      F([['√' + n, 'r']], 220, y, 72);
      fade(A(t, t0 + 1.2, .5), () => { F([[' = √(', 'r'], [String(sq), 'r', SQ], [' · ', 'r'], [String(rest), 'r', RQ], [')', 'r']], 520, y, 60); stroke(SQ, 3, () => X.roundRect(500, y - 60, 80 + String(sq).length * 22, 80, 12), { g: 12, dash: [8, 6] }); });
      fade(A(t, t0 + 3, .5), () => F([[' = ', 'r'], [String(root), 'r', RS], ['√' + rest, 'r', RQ]], 860, y, 72));
    });
    fade(win(t, .6, 9.8), () => { T('mayor cuadrado que divide al número', CX, 700, { k: 'it', s: 44, a: 'c', c: '#c3ccec' }); T('1, 4, 9, 16, 25, 36, 49, …', CX, 800, { k: 'r', s: 48, a: 'c', c: SQ, g: 8 }); });
    one(620, 12, 4, 3, 2, 10.2); one(900, 50, 25, 2, 5, 19.2);
  },
  // 4 · Semejantes: 3 + 5 segmentos de √2 son 8 segmentos; √2 + √3 no es √5.
  semejantes(t) {
    stars(t, .3);
    const L = 90;
    fade(A(t, 1, .6), () => { segs(140, 560, 3, L, RQ, seg(t, 1.2, 3), '√2'); segs(140 + 3 * L, 560, 5, L, RS, seg(t, 3, 5.4), '√2'); T('mismo segmento √2', CX, 640, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 10.2, .6), () => F([['3√2', 'r', RQ], [' + ', 'r'], ['5√2', 'r', RS], [' = ', 'r'], ['8√2', 'r', C.ink]], CX, 760, 72));
    fade(A(t, 20.2, .6), () => {
      const u = 160, a = Math.SQRT2 * u, b = Math.sqrt(3) * u, c = Math.sqrt(5) * u;
      stroke(RQ, 6, () => { X.moveTo(140, 960); X.lineTo(140 + a, 960); }, { g: 12 }); stroke(SQ, 6, () => { X.moveTo(140 + a, 960); X.lineTo(140 + a + b, 960); }, { g: 12 });
      stroke(NO, 6, () => { X.moveTo(140, 1040); X.lineTo(140 + c, 1040); }, { g: 12 });
      T('√2 + √3 ≈ 3.15', 150 + a + b, 970, { k: 'r', s: 30, c: C.ink }); T('√5 ≈ 2.24', 160 + c, 1050, { k: 'r', s: 30, c: NO });
      check(800, 1160, 24, false, A(t, 22, .5)); F([['√2 + √3', 'r'], [' ≠ ', 'r', NO], ['√5', 'r']], 480, 1180, 56);
    });
  },
  // 5 · Simplificar primero: √8 = 2√2 y √18 = 3√2; juntos, cinco segmentos de √2.
  primero(t) {
    stars(t, .3);
    F([['√8', 'r', SQ], [' + ', 'r'], ['√18', 'r', SQ]], CX, 560, 90);
    fade(A(t, 10.2, .6), () => { F([['√8 = √(4 · 2) = ', 'r'], ['2√2', 'r', RQ]], CX, 720, 54); fade(A(t, 12.6, .5), () => F([['√18 = √(9 · 2) = ', 'r'], ['3√2', 'r', RQ]], CX, 810, 54)); });
    fade(A(t, 19.2, .6), () => { const L = 110; segs(CX - 2.5 * L, 980, 2, L, RQ, seg(t, 19.4, 20.6), '√2'); segs(CX - .5 * L, 980, 3, L, RS, seg(t, 20.6, 22.2), '√2'); F([['2√2', 'r', RQ], [' + ', 'r'], ['3√2', 'r', RS], [' = ', 'r'], ['5√2', 'r', C.ink]], CX, 1120, 72); });
  },
  // 6 · Racionalizar: la división larga 1 ÷ 1.41421…; con el uno disfrazado basta partir por la mitad.
  racionalizar(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => {
      T('1 ÷ 1.41421356…', CX, 560, { k: 'r', s: 64, a: 'c', c: C.ink });
      const lines = ['1.00000000 ÷ 1.41421356', '− 0.98994949   → 0.7', '  0.01005051', '− 0.00989949   → 0.007', '  0.00015102', '…'];
      lines.forEach((l, i) => fade(A(t, 1.6 + i * 1, .4), () => T(l, 220, 680 + i * 60, { k: 'mono', s: 30, c: i % 2 ? NO : C.mute })));
      T('a mano, cifra por cifra', CX, 1100, { k: 'mono', s: 24, a: 'c', c: C.mute });
    });
    fade(A(t, 10, .6), () => {
      F([['1/√2', 'r'], [' · ', 'r'], ['√2/√2', 'r', SQ]], CX, 600, 80);
      T('= 1', CX + 280, 680, { k: 'mono', s: 28, c: SQ });
      fade(A(t, 20.2, .6), () => { F([[' = ', 'r'], ['√2/2', 'r', RS]], CX, 790, 80); F([['1.41421 ÷ 2 = ', 'r'], ['0.70711', 'r', RS]], CX, 940, 60); T('dividir entre 2: fácil', CX, 1010, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    });
  },
  // 7 · El uno disfrazado: 6/√3 · √3/√3 = 6√3/3 = 2√3.
  disfrazado(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { T('racionalizar', CX, 640, { k: 'it', s: 80, a: 'c', c: RS, g: 16 }); T('denominador sin raíces', CX, 740, { k: 'mono', s: 28, a: 'c', c: C.mute }); });
    fade(A(t, 10, .6), () => {
      F([['6/√3', 'r'], [' · ', 'r'], ['√3/√3', 'r', SQ]], CX, 600, 80);
      fade(A(t, 13, .5), () => F([[' = ', 'r'], ['6√3', 'r'], [' / ', 'r'], ['3', 'r', RS]], CX, 740, 80));
      fade(A(t, 15, .5), () => T('√3 · √3 = 3', CX, 820, { k: 'mono', s: 26, a: 'c', c: C.mute }));
      fade(A(t, 19.2, .6), () => F([[' = ', 'r'], ['2√3', 'r', RS]], CX, 960, 96));
    });
  },
  // 8 · El conjugado: 1/(√3 − 1) por (√3 + 1)/(√3 + 1).
  conjugado(t) {
    stars(t, .3);
    F([['1 / (√3 − 1)', 'r']], CX, 520, 72);
    fade(win(t, 2.4, 9.8), () => { F([['(√3 − 1) · √3 = 3 − √3', 'r', NO]], CX, 660, 52); T('la raíz no se va', CX, 730, { k: 'mono', s: 24, a: 'c', c: NO }); });
    fade(A(t, 10.2, .6), () => { F([['√3 − 1', 'r'], ['   →   ', 'r', C.mute], ['√3 + 1', 'r', SQ]], CX, 660, 64); T('el mismo binomio, con el signo del medio cambiado', CX, 730, { k: 'mono', s: 22, a: 'c', c: C.mute }); });
    fade(A(t, 20.2, .6), () => {
      F([['(√3 − 1)(√3 + 1)', 'r'], [' = ', 'r'], ['3', 'r', RS], [' − ', 'r'], ['1', 'r', RS], [' = ', 'r'], ['2', 'r', RS]], CX, 880, 60);
      F([['1 / (√3 − 1)', 'r'], [' = ', 'r'], ['(√3 + 1) / 2', 'r', RS]], CX, 1020, 64);
    });
  },
  // 9 · Suma por diferencia: a² − b² se reacomoda en (a + b)(a − b).
  diferencia(t) {
    stars(t, .3);
    const a = 380, b = 160, x0 = 300, y0 = 560, m = eio(seg(t, 12.4, 15.4));
    fade(A(t, 1, .6), () => {
      bar(x0, y0, a - b, a, SQ, 1, { fill: .22 });
      const cx = lerp(x0 + a - b / 2, x0 + (a - b) / 2, m), cy = lerp(y0 + b + (a - b) / 2, y0 - b / 2, m);
      X.save(); X.translate(cx, cy); X.rotate(Math.PI / 2 * m); bar(-b / 2, -(a - b) / 2, b, a - b, RQ, 1, { fill: .22 }); X.restore();
      fade(1 - seg(t, 10, 11.4), () => { stroke(NO, 3, () => X.rect(x0 + a - b, y0, b, b), { g: 12, dash: [8, 6] }); T('b²', x0 + a - b / 2, y0 + b / 2 + 12, { k: 'r', s: 40, a: 'c', c: NO }); });
      fade(1 - m, () => { T('a', x0 + a / 2, y0 - 20, { k: 'i', s: 40, a: 'c', c: C.ink }); T('a', x0 - 30, y0 + a / 2, { k: 'i', s: 40, a: 'c', c: C.ink }); T('a² − b²', x0 + a + 140, y0 + a / 2, { k: 'r', s: 44, a: 'c', c: SQ }); });
    });
    fade(A(t, 15.6, .5), () => { T('a + b', x0 + a - b + 90, y0 + (a - b) / 2, { k: 'i', s: 40, a: 'c', c: RS }); T('a − b', x0 + (a - b) / 2, y0 + a + 50, { k: 'i', s: 40, a: 'c', c: RS }); });
    fade(A(t, 19.2, .6), () => F([['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [')(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], [') = ', 'r'], ['a', 'i'], ['² ', 'r'], ['− ab + ab', 'r', NO], [' − ', 'r'], ['b', 'i'], ['²', 'r']], CX, 1180, 56, { max: 960 }));
  },
  // 10 · Cierre: la espiral hasta √18 con √8, √12 y √18 resaltadas; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { spiral(CX, 760, 84, 16, { hl: { 8: SQ, 12: RQ } }); T('√8 = 2√2    √12 = 2√3    √18 = 3√2', CX, 1240, { k: 'r', s: 40, a: 'c', c: C.ink, max: 960 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['√(', 'r'], ['ab', 'i'], [') = √', 'r'], ['a', 'i'], ['√', 'r'], ['b', 'i']], 'sacar el cuadrado'], [[['3√2 + 5√2 = 8√2', 'r', RS]], 'semejantes'], [[['1/√2 = √2/2', 'r', SQ]], 'racionalizar'], [[['(√3 − 1)(√3 + 1) = 2', 'r', RQ]], 'conjugado']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [SQ, RS, RQ]);
    });
  },
};
