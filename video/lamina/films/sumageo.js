// Lección alg-14d · Suma geométrica y suma infinita (mundo Sucesiones y Series).
// Multiplicar por r y restar (3 + 6 + … + 48); la fórmula; la lámina del mundo: ½ + ¼ + ⅛ + … llena el cuadrado; S∞ = a₁/(1 − r)
// y por qué; 10 + 2 + 0.4 + …; un periódico como suma infinita; cuándo diverge; una dosis diaria que se estabiliza.
const R = String.raw;
const POSTER = 120;
// el cuadrado de la lámina partido en mitades: k = cuántas piezas se ven
function halves(x, y, s, k) {
  let cx = x, cy = y, w = s, h = s, horiz = true;
  for (let i = 0; i < 8; i++) { const a = clamp(k - i); if (a <= 0) break; let rx, ry, rw, rh;
    if (horiz) { rx = cx; ry = cy; rw = w / 2; rh = h; cx += w / 2; w /= 2; } else { rx = cx; ry = cy; rw = w; rh = h / 2; cy += h / 2; h /= 2; }
    fade(a, () => { fillP(P.ac, .6 - i * .06, () => X.rect(rx + 2, ry + 2, rw - 4, rh - 4)); rect(rx, ry, rw, rh, { w: 3 }); if (i < 4) M([R`\frac{1}{2}`, R`\frac{1}{4}`, R`\frac{1}{8}`, R`\frac{1}{16}`][i], rx + rw / 2, ry + rh / 2 + 16, [70, 56, 44, 34][i], { pass: true }); });
    horiz = !horiz; }
  rect(x, y, s, s, { w: 6, c: P.ac });
}
const FILM = {
  lesson: 'alg-14d', world: 'progresiones', key: 'G', n: [4, 5],
  title: 'Suma geométrica y suma infinita',
  next: 'Sumatoria y productoria',
  intro: 'Sumar infinitos números y que dé un número finito suena imposible. La lámina de este mundo muestra que no lo es.',
  examples: ['3 + 6 + 12', '93', '15 + 6 + 2.4', '0.777', '100 mg', '200 mg'],
  scenes: [
    { id: 'restar', name: 'Multiplicar y restar', dur: 39,
      caps: [[0.5, 9.0, 'UNA SUMA', '$S = 3 + 6 + 12 + 24 + 48$.', ''], [9.4, 19.0, 'POR LA RAZÓN', '$2S = 6 + 12 + 24 + 48 + 96$:', 'casi los mismos términos.'],
        [19.4, 28.0, 'SE RESTA', 'Todo se cancela menos', 'el 96 y el 3.'], [28.4, 38.4, 'RESULTADO', '$2S − S = 96 − 3$,', 'así que $S = 93$.']],
      narr: [[0.5, 9.0, 'Para sumar una progresión geométrica hay otro truco. Tomemos tres más seis más doce más veinticuatro más cuarenta y ocho.'],
        [9.4, 19.0, 'Si se multiplica todo por la razón, dos, sale seis más doce más veinticuatro más cuarenta y ocho más noventa y seis. Casi la misma lista, corrida un lugar.'],
        [19.4, 28.0, 'Al restar las dos sumas, los términos repetidos se cancelan. Solo quedan el último de arriba, noventa y seis, y el primero de abajo, tres.'],
        [28.4, 38.4, 'Dos S menos S es S, así que S es noventa y seis menos tres: noventa y tres.']],
      ev: [[1.0, 'pops', 5], [9.8, 'pops', 5], [19.8, 'cut'], [28.8, 'card']],
      draw(t) {
        const top = ['3', '6', '12', '24', '48', ''], bot = ['', '6', '12', '24', '48', '96'], cw = 140, x0 = 150;
        top.forEach((s, i) => s && fade(A(t, 1.0 + i * .2), () => M(s, x0 + i * cw + 60, 700, 54, { c: i && i < 5 && t > 19.8 ? P.dim : P.ink, pass: true })));
        bot.forEach((s, i) => s && fade(A(t, 9.8 + i * .2), () => M(s, x0 + i * cw + 60, 820, 54, { c: i < 5 && t > 19.8 ? P.dim : P.ac, pass: true })));
        fade(A(t, 1.0), () => M('S =', x0 - 30, 700, 50, { a: 'r', pass: true })); fade(A(t, 9.8), () => M('2S =', x0 - 30, 820, 50, { a: 'r', pass: true }));
        if (t > 19.8) for (let i = 1; i < 5; i++) fade(A(t, 19.8 + i * .2), () => { line(x0 + i * cw + 20, 660, x0 + i * cw + 100, 720, { c: P.no, w: 4 }); line(x0 + i * cw + 20, 780, x0 + i * cw + 100, 840, { c: P.no, w: 4 }); });
        fade(A(t, 28.8), () => M(R`2S − S = 96 − 3 \;⇒\; S = \hl{93}`, 540, 1200, 76, { id: 'r' }));
      } },
    { id: 'formula', name: 'La fórmula', dur: 30,
      caps: [[0.5, 12.0, 'EN GENERAL', 'Multiplicar por $r$ y restar:', '$rS − S = a_{1}r^{n} − a_{1}$.'], [12.4, 29.4, 'LA FÓRMULA', R`$S_{n} = a_{1}\frac{r^{n} − 1}{r − 1}$,`, 'con $r ≠ 1$.']],
      narr: [[0.5, 12.0, 'El mismo truco funciona siempre. Al restar r por S menos S, se cancela todo menos a sub uno por r a la n y a sub uno.'],
        [12.4, 29.4, 'Despejando S queda la fórmula de la suma geométrica. Con el ejemplo: tres por dos a la cinco menos uno, entre uno, da noventa y tres otra vez.']],
      ev: [[1.0, 'rise'], [12.8, 'card'], [20.0, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`(r − 1)\,S_{n} = a_{1}\,(r^{n} − 1)`, 540, 700, 72, { id: 'a' }));
        fade(A(t, 12.8), () => M(R`S_{n} = a_{1}\,\frac{r^{n} − 1}{r − 1}`, 540, 940, 96, { id: 'f' }));
        fade(A(t, 20.0), () => M(R`3 · \frac{2^{5} − 1}{2 − 1} = 3 · 31 = 93`, 540, 1180, 66, { id: 'e' }));
      } },
    { id: 'cuadrado', name: 'La lámina del mundo', dur: 38,
      caps: [[0.5, 9.0, 'UN CUADRADO DE ÁREA 1', 'Se pinta la mitad,', 'luego la mitad de lo que queda…'], [9.4, 19.0, 'LAS PIEZAS', R`$\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + …$`, 'van llenando el cuadrado.'],
        [19.4, 28.0, 'NUNCA SE PASA', 'Siempre falta un pedacito,', 'cada vez más pequeño.'], [28.4, 37.4, 'LA SUMA INFINITA', 'Se acerca tanto a 1 como se', 'quiera: vale 1.']],
      narr: [[0.5, 9.0, 'Esta es la lámina de este mundo. Un cuadrado de área uno: se pinta la mitad; de lo que queda, otra mitad; y así.'],
        [9.4, 19.0, 'Las piezas pintadas son un medio, un cuarto, un octavo, un dieciseisavo… una progresión geométrica de razón un medio.'],
        [19.4, 28.0, 'Por más piezas que se pinten, nunca se pasa del cuadrado. Siempre falta un pedacito, igual a la última pieza.'],
        [28.4, 37.4, 'Ese pedacito se hace tan pequeño como se quiera. Por eso la suma infinita vale exactamente uno: el cuadrado completo.']],
      ev: [[1.0, 'draw', 1.0], [3.0, 'pop', 0], [4.4, 'pop', 1], [5.8, 'pop', 2], [7.2, 'pop', 3], [9.8, 'pops', 4], [28.8, 'card']],
      draw(t) {
        halves(290, 520, 500, seg(t, 3.0, 13.0) * 8);
        fade(A(t, 1.0), () => label('área 1', 540, 1060, P.mute, { s: 38 }));
        fade(A(t, 9.8), () => M(R`\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \frac{1}{16} + …`, 540, 1240, 70, { id: 's' }));
        fade(A(t, 19.8), () => M(R`S_{n} = 1 − \frac{1}{2^{n}}`, 540, 1400, 72, { id: 'f' }));
        fade(A(t, 28.8), () => M(R`\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + … = \hl{1}`, 540, 1560, 72, { id: 'r' }));
      } },
    { id: 'infinita', name: 'La suma infinita', dur: 35,
      caps: [[0.5, 9.0, 'SI $|r| < 1$', '$r^{n}$ se acerca a 0', 'cuando $n$ crece.'], [9.4, 19.0, 'LA FÓRMULA', R`$S_{∞} = \frac{a_{1}}{1 − r}$.`, ''],
        [19.4, 34.4, 'EJEMPLO', '$15 + 6 + 2.4 + …$:', R`$\frac{15}{1 − 0.4} = 25$.`]],
      narr: [[0.5, 9.0, 'En general, si la razón está entre menos uno y uno, sus potencias se achican y se acercan a cero.'],
        [9.4, 19.0, 'Entonces, en la fórmula de la suma, r a la n desaparece y queda la suma infinita: a sub uno sobre uno menos r.'],
        [19.4, 34.4, 'Quince más seis más dos coma cuatro, y así, con razón cero coma cuatro: quince sobre cero coma seis, veinticinco. Por más términos que se sumen, nunca se pasa de veinticinco.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'draw', 3.0]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`|r| < 1 \;⇒\; r^{n} → 0`, 540, 640, 72, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`S_{∞} = \frac{a_{1}}{1 − r}`, 540, 860, 96, { id: 'f' }));
        if (t > 19.4) { const X_ = axis({ x0: 110, x1: 960, y: 1150, v0: 0, v1: 28, ticks: [0, 15, 21, 28], k: 1, ls: 36 }); stroke(P.ac, 3, () => { X.moveTo(X_(25), 1080); X.lineTo(X_(25), 1220); }, { dash: [8, 8] }); M('25', X_(25), 1060, 40, { c: P.ac, pass: true });
          let s = 0; [15, 6, 2.4, .96, .384].forEach((v, i) => { const s0 = s; s += v; hop(X_(s0), X_(s), 1150, draw(t, 19.8 + i * .7, .5), { c: P.ac, h: 30 + v * 6 }); }); }
        fade(A(t, 20.4), () => M(R`\frac{15}{1 − 0.4} = \frac{15}{0.6} = \hl{25}`, 540, 1400, 72, { id: 'e' }));
      } },
    { id: 'periodico', name: 'Un periódico', dur: 30,
      caps: [[0.5, 9.0, 'UN DECIMAL PERIÓDICO', R`$0.777… = \frac{7}{10} + \frac{7}{100} + …$`, ''], [9.4, 19.0, 'GEOMÉTRICA', R`Primer término $\frac{7}{10}$,`, R`razón $\frac{1}{10}$.`],
        [19.4, 29.4, 'LA SUMA', R`$\frac{0.7}{1 − 0.1} = \frac{7}{9}$:`, 'como en La Recta Real.']],
      narr: [[0.5, 9.0, 'Un decimal periódico también es una suma infinita. Cero coma siete siete siete es siete décimos más siete centésimos más siete milésimos…'],
        [9.4, 19.0, 'Es una progresión geométrica: primer término siete décimos y razón un décimo.'],
        [19.4, 29.4, 'Su suma es cero coma siete sobre cero coma nueve: siete novenos. Es lo mismo que salía con el truco de restar en La Recta Real.']],
      ev: [[1.0, 'rise'], [9.8, 'tag'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`0.777… = \frac{7}{10} + \frac{7}{100} + \frac{7}{1000} + …`, 540, 700, 62, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`a_{1} = \frac{7}{10} \qquad r = \frac{1}{10}`, 540, 900, 68, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`S_{∞} = \frac{0.7}{1 − 0.1} = \frac{0.7}{0.9} = \hl{\frac{7}{9}}`, 540, 1120, 72, { id: 'c' }));
      } },
    { id: 'diverge', name: 'Cuando no hay suma', dur: 31,
      caps: [[0.5, 9.0, 'SI $r ≥ 1$', '$1 + 2 + 4 + 8 + …$', 'crece sin parar.'], [9.4, 19.0, 'SI $r = −1$', '$1 − 1 + 1 − 1 + …$', 'salta entre 1 y 0.'],
        [19.4, 30.4, 'DIVERGE', 'La fórmula de la suma infinita', 'solo vale con $|r| < 1$.']],
      narr: [[0.5, 9.0, 'Si la razón es uno o más, los términos no se achican. Uno más dos más cuatro más ocho crece sin parar.'],
        [9.4, 19.0, 'Con razón menos uno, uno menos uno más uno menos uno: las sumas parciales saltan entre uno y cero, sin acercarse a nada.'],
        [19.4, 30.4, 'En esos casos se dice que la serie diverge: no tiene suma. La fórmula de la suma infinita solo sirve si r está entre menos uno y uno.']],
      ev: [[1.0, 'pops', 4], [9.8, 'pops', 6], [19.8, 'no']],
      draw(t) {
        const Pl = plane({ ox: 170, oy: 1150, sx: 110, sy: 34, x0: 0, x1: 7, y0: -1, y1: 16, k: A(t, 1.0, .8), xt: [1, 2, 3, 4, 5, 6], yt: [1, 3, 7, 15] });
        [1, 3, 7, 15].forEach((v, i) => fade(A(t, 1.6 + i * .5), () => dot(Pl.X(i + 1), Pl.Y(v), { r: 12, c: P.ac })));
        if (t > 9.4) [1, 0, 1, 0, 1, 0].forEach((v, i) => fade(A(t, 9.8 + i * .4), () => dot(Pl.X(i + 1), Pl.Y(v), { r: 11, c: P.no })));
        fade(A(t, 19.8), () => M(R`\t{solo si} \; |r| < 1`, 540, 1400, 70, { id: 'c' }));
      } },
    { id: 'dosis', name: 'Una dosis diaria', dur: 32,
      caps: [[0.5, 9.0, 'UN MEDICAMENTO', '100 mg cada día; el cuerpo', 'elimina la mitad por día.'], [9.4, 19.0, 'LO QUE QUEDA', '$100 + 50 + 25 + …$', 'después de muchos días.'],
        [19.4, 31.4, 'SE ESTABILIZA', R`$\frac{100}{1 − \frac{1}{2}} = 200$ mg:`, 'nunca se pasa de ahí.']],
      narr: [[0.5, 9.0, 'Una persona toma cien miligramos de un medicamento cada día, y su cuerpo elimina la mitad de lo que tiene en un día.'],
        [9.4, 19.0, 'Justo después de una dosis tiene la de hoy, la mitad de la de ayer, un cuarto de la de antier… cien más cincuenta más veinticinco.'],
        [19.4, 31.4, 'Es una suma geométrica de razón un medio. Con el paso de los días se acerca a cien sobre un medio: doscientos miligramos, y nunca los pasa.']],
      ev: [[1.0, 'pops', 7], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        const vals = [100, 150, 175, 187.5, 193.75, 196.9, 198.4]; vals.forEach((v, i) => fade(A(t, 1.0 + i * .4, .3), () => { const x = 170 + i * 110, h = v * 2.8; rect(x, 1100 - h, 80, h, { r: 6, w: 3, fill: .45 }); T('día ' + (i + 1), x + 40, 1145, { s: 24, c: P.mute, a: 'c', pass: true }); }));
        fade(A(t, 19.8), () => { stroke(P.ac, 4, () => { X.moveTo(140, 1100 - 560); X.lineTo(960, 1100 - 560); }, { dash: [12, 10] }); label('200 mg', 960, 1100 - 580, P.ac, { s: 38, a: 'r' }); });
        fade(A(t, 9.8), () => M(R`100 + 50 + 25 + 12.5 + …`, 540, 1300, 66, { id: 'a' }));
        fade(A(t, 20.4), () => M(R`\frac{100}{1 − \frac{1}{2}} = \hl{200} \t{ mg}`, 540, 1460, 72, { id: 'b' }));
      } },
  ],
  sum: [['Multiplicar y restar', R`rS − S = a_{1}r^{n} − a_{1}`], ['Suma de n términos', R`S_{n} = a_{1}\,\frac{r^{n} − 1}{r − 1}`], ['La lámina', R`\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + … = 1`], ['Suma infinita', R`S_{∞} = \frac{a_{1}}{1 − r} \quad (|r| < 1)`], ['Diverge', R`|r| ≥ 1`]],
  end: ['Infinitos pedazos pueden', 'llenar un solo cuadrado.'],
  finNarr: [[0.8, 9.0, 'En resumen: una suma geométrica se resuelve multiplicando por la razón y restando.'],
    [9.2, 16.0, 'Si la razón está entre menos uno y uno, la suma infinita existe y vale a sub uno sobre uno menos r.']],
};
