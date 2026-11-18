// «Enteros, signos y jerarquía» · escenas de la lección pu-cm-1 (Preuniversitario UdeA). Motor en kit.js y preu.js;
// guion en enteros.data.js. Positivos en cian, negativos en rosa, el resultado en verde, lo que se hace ahora en lima.
const POS = C.cyan, NEG = C.mag, RES = C.green, NOW = C.lime;
const sq = n => [String(n), 'sp'];   // exponente
// Recta de −R a R ocupando casi todo el ancho; devuelve la posición en pantalla de un valor.
const line = (y, R, k = 1, o = {}) => nline(90, 990, y, -R, R, { k, step: 1, lab: v => v % (o.every || 1) === 0, s: 28, ...o });
// Ficha móvil sobre la recta: un punto con su valor encima.
function token(x, y, col, label) { dot(x, y, 14, col, 22); if (label != null) T(label, x, y - 34, { k: 'r', s: 36, a: 'c', c: col }); }
// Flecha horizontal sobre la recta, desde x0 hasta x1, a la altura y.
function harrow(x0, x1, y, col, lw = 6) {
  if (Math.abs(x1 - x0) < 2) { dot(x0, y, 6, col, 10); return; }
  stroke(col, lw, () => { X.moveTo(x0, y); X.lineTo(x1, y); }, { g: 14 });
  const d = Math.sign(x1 - x0);
  X.save(); X.fillStyle = col; X.shadowColor = col; X.shadowBlur = 14; X.beginPath(); X.moveTo(x1 + d * 8, y); X.lineTo(x1 - d * 12, y - 13); X.lineTo(x1 - d * 12, y + 13); X.fill(); X.restore();
}
// Saltos repetidos de tamaño step desde 0: n saltos, dibujados hasta k (0–1).
function hops(px, y, step, n, col, k) { for (let i = 0; i < n; i++) { const kk = clamp(k * n - i); if (kk > 0) hop(px(i * step), px((i + 1) * step), y - 6, 70, col, eo(kk), 4); } }
const fmt = v => neg(v);
const S = {
  // 1 · El reto: una cuenta y tres respuestas.
  reto(t) {
    stars(t, .6);
    fade(A(t, 1, .7), () => F([['8 − 2 · (5 − 7)', 'r'], sq(2)], CX, 560, 92));
    [['A', '0'], ['B', '24'], ['C', '16']].forEach(([who, r], i) => fade(A(t, 9.8 + i * .9, .5), () => {
      const x = 230 + i * 310;
      stroke(t > 18.6 ? C.dim : C.violet, 3, () => X.roundRect(x - 120, 700, 240, 200, 26), { g: 10 });
      T('estudiante ' + who, x, 760, { k: 'mono', s: 24, a: 'c', c: C.mute });
      T(r, x, 860, { k: 'r', s: 84, a: 'c', c: C.ink, g: 10 });
    }));
    fade(A(t, 18.8, .6), () => { T('una sola es correcta', CX, 1010, { k: 'mono', s: 30, a: 'c', c: NOW }); T('la respuesta, al final', CX, 1062, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 2 · La recta: posiciones, opuestos y orden.
  recta(t) {
    stars(t, .3);
    const y = 760, px = line(y, 6, eio(seg(t, .5, 2.5)));
    fade(A(t, 2.5, .6), () => {
      X.save(); X.fillStyle = hexA(POS, .12); X.fillRect(px(0), y - 120, px(6) - px(0), 100); X.fillStyle = hexA(NEG, .12); X.fillRect(px(-6), y - 120, px(0) - px(-6), 100); X.restore();
      T('negativos', (px(-6) + px(0)) / 2, y - 140, { k: 'mono', s: 28, a: 'c', c: NEG }); T('positivos', (px(0) + px(6)) / 2, y - 140, { k: 'mono', s: 28, a: 'c', c: POS });
    });
    fade(win(t, 10, 18.6), () => {
      token(px(-3), y, NEG, '−3'); token(px(3), y, POS, '3');
      const k = eo(seg(t, 10.8, 12.4));
      hop(px(0), lerp(px(0), px(3), k), y + 100, -60, POS, 1, 3); hop(px(0), lerp(px(0), px(-3), k), y + 100, -60, NEG, 1, 3);
      fade(A(t, 12.6, .5), () => T('misma distancia', CX, y + 210, { k: 'mono', s: 28, a: 'c', c: C.mute }));
    });
    fade(A(t, 19, .6), () => {
      token(px(-5), y, NEG, '−5'); token(px(-1), y, NEG, '−1');
      arrow(px(-5), y + 90, px(-1), y + 90, NOW, eo(seg(t, 19.6, 21)), 4);
      fade(A(t, 21, .6), () => F([['−1 > −5', 'r', NOW]], CX, y + 200, 64));
    });
  },
  // 3 · Sumar es moverse.
  sumar(t) {
    stars(t, .3);
    const y = 820, px = line(y, 8);
    fade(win(t, .8, 9.8), () => { token(px(0), y, C.ink, '0'); hop(px(0), px(6), y - 6, 160, POS, eo(seg(t, 1.5, 4)), 5); fade(A(t, 4, .5), () => { token(px(6), y, POS, '6'); T('+6', px(3), y - 200, { k: 'r', s: 52, a: 'c', c: POS }); }); });
    fade(win(t, 10, 19.8), () => {
      const k = eo(seg(t, 11, 14));
      hop(px(-4), px(2), y - 6, 170, POS, k, 5); token(lerp(px(-4), px(2), k), y, k < 1 ? NOW : RES, k < 1 ? null : '2');
      fade(A(t, 10.2, .5), () => dot(px(-4), y, 9, NEG, 12));
      fade(A(t, 14, .5), () => F([['−4 + 6 = ', 'r'], ['2', 'r', RES]], CX, 520, 76));
    });
    fade(A(t, 20, .5), () => {
      const k = eo(seg(t, 21, 24));
      hop(px(5), px(-3), y - 6, 170, NEG, k, 5); token(lerp(px(5), px(-3), k), y, k < 1 ? NOW : RES, k < 1 ? null : '−3');
      fade(A(t, 20.2, .5), () => dot(px(5), y, 9, POS, 12));
      fade(A(t, 24, .5), () => F([['5 + (−8) = ', 'r'], ['−3', 'r', RES]], CX, 520, 76));
    });
  },
  // 4 · Restar es sumar el opuesto; quitar una deuda.
  restar(t) {
    stars(t, .3);
    const y = 860, px = line(y, 8);
    fade(win(t, .8, 9.8), () => {
      F([['3 − 7', 'r']], CX, 480, 80);
      fade(A(t, 3, .6), () => { arrow(CX, 520, CX, 600, C.mute, 1, 3); F([['3 + (', 'r'], ['−7', 'r', NEG], [')', 'r']], CX, 680, 80); });
    });
    fade(win(t, 10, 19.8), () => {
      const k = eo(seg(t, 10.8, 14));
      F([['3 − 7 = ', 'r'], ['−4', 'r', k >= 1 ? RES : C.dim]], CX, 520, 80);
      hop(px(3), px(-4), y - 6, 170, NEG, k, 5); token(lerp(px(3), px(-4), k), y, k < 1 ? NOW : RES, k < 1 ? null : '−4');
    });
    fade(A(t, 20, .5), () => {
      // La deuda: un bloque rosa de −5 que se quita y la ficha sube.
      const k = eo(seg(t, 21.5, 24.5));
      F([['2 − (', 'r'], ['−5', 'r', NEG], [') = 2 + 5 = ', 'r'], ['7', 'r', k >= 1 ? RES : C.dim]], CX, 520, 70, { max: 960 });
      fade(1 - k * .7, () => { stroke(NEG, 3, () => X.roundRect(px(2) - 6, y - 250, px(7) - px(2) + 12, 60, 14), { g: 12 }); T(k > 0 ? 'deuda de 5: se quita' : 'deuda de 5', (px(2) + px(7)) / 2, y - 210, { k: 'mono', s: 24, a: 'c', c: NEG }); });
      hop(px(2), px(7), y - 6, 150, RES, k, 5); token(lerp(px(2), px(7), k), y, k < 1 ? NOW : RES, k <= 0 ? '2' : k < 1 ? null : '7');
    });
  },
  // 5 · Multiplicar es repetir saltos.
  multiplicar(t) {
    stars(t, .3);
    const y = 860, px = line(y, 13, 1, { every: 3, s: 26 });
    fade(win(t, .8, 9.8), () => { hops(px, y, 3, 4, POS, seg(t, 1.5, 6)); fade(A(t, 6, .5), () => { token(px(12), y, RES, '12'); F([['3 · 4 = ', 'r'], ['12', 'r', RES]], CX, 520, 76); }); });
    fade(A(t, 10, .5), () => { hops(px, y, -3, 4, NEG, seg(t, 10.6, 15)); fade(A(t, 15, .5), () => { token(px(-12), y, RES, '−12'); F([['(−3) · 4 = ', 'r'], ['−12', 'r', RES]], CX, 520, 76); }); });
    fade(A(t, 19, .6), () => { T('signo → dirección', CX, 1080, { k: 'mono', s: 34, a: 'c', c: NOW }); T('número → tamaño', CX, 1140, { k: 'mono', s: 34, a: 'c', c: C.ink }); });
  },
  // 6 · El menos da la vuelta: la flecha se refleja en el 0.
  vuelta(t) {
    stars(t, .3);
    const y = 880, px = line(y, 13, 1, { every: 3, s: 26 }), up = y - 70;
    let v = 0, label = '';
    if (t < 9.8) { const k = eio(seg(t, 3.5, 5.5)); v = lerp(5, -5, k); label = k < 1 ? '5' : '5 · (−1) = −5'; }
    else if (t < 19.8) { const k1 = eio(seg(t, 12.5, 14.5)), k2 = eio(seg(t, 16, 18)); v = lerp(lerp(12, -12, k1), 12, k2); label = k2 > 0 ? 'segunda vuelta' : k1 > 0 ? 'primera vuelta: −12' : '3 · 4 = 12'; }
    else { v = 12; label = '(−3) · (−4) = 12'; }
    harrow(px(0), px(v), up, v < 0 ? NEG : t >= 19.8 ? RES : POS, 8);
    dot(px(0), up, 9, C.ink, 10);
    stroke(hexA(C.ink, .3), 2, () => { X.moveTo(px(0), up - 80); X.lineTo(px(0), y + 40); }, { dash: [8, 10], g: 0 });
    T('espejo en el 0', px(0), up - 96, { k: 'mono', s: 22, a: 'c', c: C.mute });
    T(label, CX, 560, { k: 'r', s: 62, a: 'c', c: t >= 19.8 ? RES : C.ink, max: 960 });
  },
  // 7 · La regla de los signos: tabla y contar negativos.
  signos(t) {
    stars(t, .3);
    fade(win(t, .8, 9.8), () => {
      const rows = [['+', '+', '+'], ['+', '−', '−'], ['−', '+', '−'], ['−', '−', '+']];
      rows.forEach(([a, b, r], i) => fade(A(t, 1.2 + i * .6, .4), () => { const yy = 560 + i * 110; T(`(${a}) · (${b})`, 470, yy, { k: 'r', s: 60, a: 'r', c: C.ink }); T('=', 540, yy, { k: 'r', s: 60, a: 'c', c: C.mute }); T(`(${r})`, 610, yy, { k: 'r', s: 60, a: 'l', c: r === '+' ? POS : NEG }); }));
    });
    fade(win(t, 10, 18.8), () => {
      [1, 2, 3, 4].forEach((n, i) => fade(A(t, 10.6 + i * 1.6, .4), () => {
        const yy = 560 + i * 110; T(Array(n).fill('(−)').join(' · '), 160, yy, { k: 'r', s: 46, c: NEG, max: 600 });
        T(n % 2 ? 'impar → −' : 'par → +', 940, yy, { k: 'mono', s: 32, a: 'r', c: n % 2 ? NEG : POS });
      }));
    });
    fade(A(t, 19, .5), () => {
      const y = 900, px = line(y, 8), up = y - 70;
      // −1 → (−1)(−2) = 2 → 2 · (−3) = −6: tres vueltas.
      const k1 = eio(seg(t, 19.5, 21)), k2 = eio(seg(t, 21.8, 23.3)), k3 = eio(seg(t, 24, 25.5));
      const v = k3 > 0 ? lerp(2, -6, k3) : k2 > 0 ? lerp(-1, 2, k2) : lerp(1, -1, k1);
      harrow(px(0), px(v), up, v < 0 ? NEG : POS, 8);
      F([['(−1)(−2)(−3) = ', 'r'], ['−6', 'r', k3 >= 1 ? RES : C.dim]], CX, 560, 70);
      T(`${(k1 >= 1) + (k2 >= 1) + (k3 >= 1)} de 3 vueltas`, CX, 650, { k: 'mono', s: 30, a: 'c', c: NOW });
    });
  },
  // 8 · Las capas: paréntesis, potencias, × ÷, + −.
  capas(t) {
    stars(t, .3);
    const L = ['+  −', '×  ÷', 'xⁿ', '( )'];
    L.forEach((lab, i) => {
      const r = 360 - i * 80, on = (i === 3 && t < 10) || (i === 2 && t >= 10 && t < 14.5) || (i === 1 && t >= 14.5 && t < 20) || (i === 0 && t >= 20);
      fade(A(t, .8 + (3 - i) * .4, .5), () => {
        stroke(on ? NOW : hexA(C.violet, .7), on ? 5 : 3, () => X.roundRect(CX - r, 760 - r * .9, 2 * r, 1.8 * r, 40), { g: on ? 20 : 8 });
        T(lab, CX, 760 - r * .9 + 56, { k: 'r', s: 48, a: 'c', c: on ? NOW : C.ink });
      });
    });
    fade(A(t, 2.5, .6), () => T('se resuelve de adentro hacia afuera', CX, 1180, { k: 'mono', s: 28, a: 'c', c: C.mute }));
    fade(A(t, 4, .6), () => T('medias antes que zapatos', CX, 1240, { k: 'mono', s: 26, a: 'c', c: NOW }));
  },
  // 9 · El reto resuelto capa por capa.
  resolver(t) {
    stars(t, .3);
    const steps = [
      [.8, [['8 − 2 · ', 'r'], ['(5 − 7)', 'r', NOW], sq(2)]],
      [4, [['8 − 2 · ', 'r'], ['(−2)', 'r', NOW], sq(2)]],
      [10.5, [['8 − ', 'r'], ['2 · 4', 'r', NOW]]],
      [14, [['8 − 8', 'r', NOW]]],
      [20.5, [['0', 'r', RES]]],
    ];
    steps.forEach(([t0, parts], i) => fade(A(t, t0, .5), () => { F(parts, CX, 480 + i * 120, 74); if (i) T('=', 150, 480 + i * 120, { k: 'r', s: 60, a: 'c', c: C.mute }); }));
    fade(A(t, 22.5, .6), () => {
      stroke(hexA(NEG, .7), 2.5, () => X.roundRect(170, 1090, 740, 150, 24), { g: 8 });
      F([['(−2)', 'r'], sq(2), [' = 4', 'r', RES], ['      −2', 'r'], sq(2), [' = −4', 'r', NEG]], CX, 1180, 54, { max: 700 });
    });
  },
  // 10 · Cierre: las tres respuestas, resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => [['A', '0', true], ['B', '24', false], ['C', '16', false]].forEach(([who, r, ok], i) => {
      const x = 230 + i * 310;
      stroke(ok ? RES : C.dim, 3, () => X.roundRect(x - 120, 640, 240, 200, 26), { g: ok ? 18 : 4 });
      T('estudiante ' + who, x, 700, { k: 'mono', s: 24, a: 'c', c: C.mute });
      T(r, x, 800, { k: 'r', s: 84, a: 'c', c: ok ? RES : C.dim });
      check(x, 900, 22, ok, A(t, 1.5 + i * .5, .6));
    }));
    fade(win(t, 3.5, 10.8), () => {
      F([['(8 − 2) · 4 = 24', 'r', NEG]], 300, 1030, 40); T('restó antes de multiplicar', 300, 1080, { k: 'mono', s: 22, a: 'c', c: C.mute });
      F([['8 − 2 · (−4) = 16', 'r', NEG]], 780, 1030, 40); T('tomó (−2)² como −4', 780, 1080, { k: 'mono', s: 22, a: 'c', c: C.mute });
    });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['−4 + 6 = 2', 'r']], 'sumar es moverse'], [[['2 − (−5) = 7', 'r']], 'quitar una deuda'], [[['(−3)(−4) = 12', 'r']], 'dos vueltas'], [[['( ) → xⁿ → × ÷ → + −', 'r']], 'las capas']], 420, 170, 42);
      endCard(t, 19.6, D.TITLE, D.LINE, [POS, NOW, NEG]);
    });
  },
};
