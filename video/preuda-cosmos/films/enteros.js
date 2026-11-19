// «Enteros, signos y jerarquía» · escenas de la lección pu-cm-1 (Preuniversitario UdeA). Motor en kit.js y preu.js;
// guion en enteros.data.js (reto real UdeA 2023-2 al inicio y al final). Positivos en cian, negativos en rosa, el resultado
// en verde, lo que se hace ahora en lima.
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
// Las tres estudiantes del reto (UdeA 2023-2) y su resultado.
const KIDS = [['Luisa', 33, C.cyan], ['Juliana', 37, C.violet], ['Ana', 49, C.amber]];
const S = {
  // 1 · El reto (UdeA 2023-2): tres estudiantes, tres resultados; el profesor dice que fallaron por 5, 7 y 9.
  reto(t) {
    stars(t, .6);
    examCard(t, { tag: 'RETO', y: 262, t0: 1, os: 34, lines: ['Luisa, Juliana y Ana hacen el mismo cálculo mental', 'y obtienen 33, 37 y 49. El resultado correcto difiere', 'de los de ellas en 5, 7 y 9 unidades, no necesaria-', 'mente en ese orden. La única afirmación verdadera es:'], opts: ['Juliana falló por 9', 'Ana falló por 9', 'Ana falló por 5', 'Juliana falló por 5'], ok: 3 });
    fade(A(t, 10.2, .6), () => {
      const y = 1080, px = nline(90, 990, y, 25, 55, { lab: v => v % 5 === 0, s: 26, k: eio(seg(t, 10.2, 11.6)) });
      KIDS.forEach(([name, v, c], i) => fade(A(t, 11.8 + i * .6, .5), () => { dot(px(v), y, 14, c, 20); T(String(v), px(v), y - 34, { k: 'r', s: 40, a: 'c', c }); T(name, px(v), y - 84 - (i === 1 ? 40 : 0), { k: 'mono', s: 24, a: 'c', c }); }));
      fade(A(t, 14.6, .6), () => T('a 5 de una, a 7 de otra y a 9 de la otra', CX, y + 130, { k: 'mono', s: 26, a: 'c', c: NOW }));
    });
    fade(A(t, 20.2, .6), () => { T('una sola es correcta', CX, 1320, { k: 'mono', s: 30, a: 'c', c: NOW }); T('la respuesta, al final', CX, 1370, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
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
  // 3 · La distancia en la recta: |a − b|; a distancia 4 de 10 hay dos lugares.
  distancia(t) {
    stars(t, .3);
    const y = 900, px = nline(90, 990, y, -5, 15, { lab: v => v % 5 === 0, s: 26 });
    fade(win(t, .8, 16.6), () => {
      token(px(-3), y, NEG, '−3'); token(px(5), y, POS, '5');
      for (let i = 0; i < 8; i++) { const k = eo(seg(t, 1.6 + i * .35, 2 + i * .35)); if (k > 0) hop(px(-3 + i), px(-2 + i), y - 8, 50, NOW, k, 3); }
      fade(A(t, 4.6, .5), () => T('8 pasos', (px(-3) + px(5)) / 2, y - 110, { k: 'mono', s: 30, a: 'c', c: NOW }));
      fade(A(t, 5.4, .5), () => F([['5 − (−3) = ', 'r'], ['8', 'r', RES]], CX, 560, 72));
      fade(A(t, 9.2, .5), () => {
        arrow(px(-3), y + 90, px(5), y + 90, POS, eo(seg(t, 9.4, 10.6)), 3); arrow(px(5), y + 140, px(-3), y + 140, NEG, eo(seg(t, 11, 12.2)), 3);
        F([['|5 − (−3)| = |−3 − 5| = ', 'r'], ['8', 'r', RES]], CX, 680, 56);
        fade(A(t, 12.4, .5), () => T('de ida o de vuelta, la misma distancia', CX, y + 220, { k: 'mono', s: 26, a: 'c', c: C.mute }));
      });
    });
    fade(A(t, 17.4, .5), () => {
      token(px(10), y, NOW, '10');
      const k = eo(seg(t, 18.4, 20));
      hop(px(10), lerp(px(10), px(6), k), y - 8, 90, NEG, 1, 4); hop(px(10), lerp(px(10), px(14), k), y - 8, 90, POS, 1, 4);
      fade(A(t, 20, .5), () => { token(px(6), y, NEG, '6'); token(px(14), y, POS, '14'); T('4', (px(6) + px(10)) / 2, y - 130, { k: 'r', s: 40, a: 'c', c: NEG }); T('4', (px(10) + px(14)) / 2, y - 130, { k: 'r', s: 40, a: 'c', c: POS }); });
      fade(A(t, 21, .5), () => F([['|x − 10| = 4  →  x = ', 'r'], ['6', 'r', RES], [' o x = ', 'r'], ['14', 'r', RES]], CX, 600, 54, { max: 960 }));
    });
  },
  // 4 · Sumar es moverse.
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
  // 5 · Restar es sumar el opuesto; quitar una deuda.
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
  // 6 · Pregunta real UdeA 2024-1: los días como posiciones en la recta.
  examen(t) {
    stars(t, .3);
    examCard(t, { y: 262, t0: .8, lines: ['El día siguiente de pasado mañana está tan lejos', 'del domingo como el día de ayer lo está del de', 'pasado mañana. Luego, el día de hoy es:'], opts: ['Lunes', 'Martes', 'Miércoles', 'Jueves'], ok: 0, rv: 25 });
    const y = 1000, px = v => 90 + (v + 2) / 9 * 900;
    fade(A(t, 10.2, .3), () => nline(90, 990, y, -2, 7, { lab: () => false, k: eio(seg(t, 10.2, 11.4)) }));
    fade(A(t, 10.4, .5), () => {
      [[-1, 'ayer', NEG, 11], [0, 'hoy', C.ink, 11.8], [2, 'pasado mañana', POS, 12.6], [3, 'el siguiente', NOW, 13.6]].forEach(([v, s, c, t0], i) => fade(A(t, t0, .5), () => {
        dot(px(v), y, 13, c, 18); T(neg(v), px(v), y + 52, { k: 'r', s: 36, a: 'c', c });
        T(s, px(v), y - 40 - (i % 2) * 44, { k: 'mono', s: 22, a: 'c', c, max: 220 });
      }));
    });
    fade(A(t, 20.2, .5), () => {
      hop(px(-1), px(2), y + 90, -70, NEG, eo(seg(t, 20.4, 21.6)), 3);
      fade(A(t, 21.6, .4), () => T('3 días', (px(-1) + px(2)) / 2, y + 200, { k: 'mono', s: 24, a: 'c', c: NEG }));
      hop(px(3), px(6), y + 90, -70, NOW, eo(seg(t, 22.4, 23.6)), 3);
      hop(px(3), px(0), y - 8, 120, hexA(C.red, .8), eo(seg(t, 22.4, 23.6)), 3);
      fade(A(t, 23.6, .4), () => { check((px(0) + px(3)) / 2, y - 120, 16, false, A(t, 23.6, .5)); T('día 0: hoy sería domingo', (px(0) + px(3)) / 2, y - 160, { k: 'mono', s: 20, a: 'c', c: C.red }); });
      fade(A(t, 23.6, .4), () => { T('3 días', (px(3) + px(6)) / 2, y + 200, { k: 'mono', s: 24, a: 'c', c: NOW }); dot(px(6), y, 15, RES, 22); T('domingo', px(6), y - 40, { k: 'mono', s: 24, a: 'c', c: RES }); T('6', px(6), y + 52, { k: 'r', s: 36, a: 'c', c: RES }); });
      fade(A(t, 24.8, .5), () => { 'LMMJVSD'.split('').forEach((d, i) => T(d, px(i), y + 280, { k: 'mono', s: 30, a: 'c', c: i === 0 ? RES : i === 6 ? RES : C.mute })); T('hoy = lunes', CX, y + 350, { k: 'r', s: 48, a: 'c', c: RES, g: 12 }); });
    });
  },
  // 7 · El menos da la vuelta: la flecha se refleja en el 0.
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
  // 9 · El reto resuelto: seis lugares a 5, 7 o 9 de 33; solo 42 cuadra con 37 y 49.
  resolver(t) {
    stars(t, .3);
    const y = 760, px = nline(90, 990, y, 22, 52, { lab: v => v % 10 === 0, s: 26 });
    KIDS.forEach(([name, v, c], i) => { dot(px(v), y, 13, c, 18); T(String(v), px(v), y - 30, { k: 'r', s: 34, a: 'c', c }); T(name, px(v), y - 76 - (i === 1 ? 36 : 0), { k: 'mono', s: 22, a: 'c', c }); });
    const cands = [[28, 5], [26, 7], [24, 9], [38, 5], [40, 7], [42, 9]];
    fade(win(t, .8, 19.8), () => cands.forEach(([v, d], i) => {
      const k = eo(seg(t, 1.6 + i * .7, 2.4 + i * .7)); if (k <= 0) return;
      hop(px(33), lerp(px(33), px(v), k), y + 8, -(30 + d * 9), hexA(C.cyan, .7), 1, 2.5);
      if (k >= 1) { ring(px(v), y, 11, v === 42 && t > 15 ? RES : C.ink, 2.5); T(String(v), px(v), y + 60 + (i % 3) * 34 + d * 3, { k: 'mono', s: 22, a: 'c', c: C.mute }); }
    }));
    const rows = [['28', '9 de 37 y 21 de 49', false], ['26', '11 de 37', false], ['24', '13 de 37', false], ['38', '1 de 37', false], ['40', '3 de 37', false], ['42', '5 de 37 y 7 de 49', true]];
    fade(win(t, 10.2, 19.8), () => rows.forEach(([v, s, ok], i) => fade(A(t, 10.4 + i * 1.1, .4), () => {
      const yy = 1040 + i * 56; T(v + ':', 330, yy, { k: 'mono', s: 28, a: 'r', c: ok ? RES : C.ink }); T('a ' + s, 350, yy, { k: 'mono', s: 26, c: ok ? RES : C.mute, max: 520 });
      check(880, yy - 9, 14, ok, A(t, 10.8 + i * 1.1, .4));
    })));
    fade(A(t, 20.2, .5), () => {
      dot(px(42), y, 15, RES, 24); T('42', px(42), y + 60, { k: 'r', s: 40, a: 'c', c: RES });
      KIDS.forEach(([name, v, c], i) => { const k = eo(seg(t, 20.6 + i * .6, 21.4 + i * .6)); hop(px(42), lerp(px(42), px(v), k), y + 8, -(60 + i * 30), c, 1, 3); });
      fade(A(t, 22.6, .5), () => F([['Luisa ', 'r', C.cyan], ['9', 'r'], ['   Juliana ', 'r', C.violet], ['5', 'r', RES], ['   Ana ', 'r', C.amber], ['7', 'r']], CX, 1120, 52, { max: 960 }));
      fade(A(t, 24, .5), () => T('|42 − 33| = 9,  |42 − 37| = 5,  |42 − 49| = 7', CX, 1200, { k: 'mono', s: 26, a: 'c', c: C.mute, max: 960 }));
    });
  },
  // 10 · Cierre: la opción D, resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => {
      ['Juliana falló por 9', 'Ana falló por 9', 'Ana falló por 5', 'Juliana falló por 5'].forEach((r, i) => {
        const x = 300 + (i % 2) * 480, yy = 620 + Math.floor(i / 2) * 200, ok = i === 3;
        stroke(ok ? RES : C.dim, 3, () => X.roundRect(x - 210, yy - 70, 420, 140, 24), { g: ok ? 18 : 4 });
        T('ABCD'[i], x - 180, yy + 10, { k: 'mono', s: 26, c: C.mute });
        T(r, x + 20, yy + 14, { k: 'r', s: 38, a: 'c', c: ok ? RES : C.dim, max: 320 });
        check(x + 170, yy - 40, 16, ok, A(t, 1.5 + i * .4, .6));
      });
      fade(A(t, 3.5, .6), () => F([['el correcto era 42', 'r']], CX, 1060, 46));
    });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['|42 − 37| = 5', 'r']], 'distancia'], [[['2 − (−5) = 7', 'r']], 'quitar una deuda'], [[['(−3)(−4) = 12', 'r']], 'dos vueltas'], [[['( ) → xⁿ → × ÷ → + −', 'r']], 'las capas']], 420, 170, 42);
      endCard(t, 19.6, D.TITLE, D.LINE, [POS, NOW, NEG]);
    });
  },
};
