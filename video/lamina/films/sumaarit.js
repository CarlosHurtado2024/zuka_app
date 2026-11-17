// Lección alg-14b · La suma de una progresión aritmética (mundo Sucesiones y Series).
// Gauss y 1 + … + 100; dos escaleras forman un rectángulo; la fórmula y su otra forma; contar cuántos términos hay; los
// impares forman cuadrados; los pares; un ahorro que crece cada semana.
const R = String.raw;
const POSTER = 90;
// escalera de bloques: alturas hs (en bloques), ancho de columna cw, bloque bh; flip = la otra escalera, de cabeza
function stair(x, yb, hs, cw, bh, o = {}) { hs.forEach((h, i) => { const k = o.k ? A(o.k, i * .1, .25) : 1; fade(k, () => { for (let j = 0; j < h; j++) { const y = o.flip ? o.top + j * bh : yb - (j + 1) * bh; rect(x + i * cw + 2, y + 2, cw - 4, bh - 4, { r: 4, w: 2, fill: o.fill ?? .45, fc: o.c, c: hexA(P.ink, .5) }); } }); }); }
const FILM = {
  lesson: 'alg-14b', world: 'progresiones', key: 'G', n: [2, 5],
  title: 'La suma de una progresión aritmética',
  next: 'Progresiones geométricas',
  intro: 'Sumar cien números parece trabajo de horas. Un niño lo hizo en segundos, y su truco sirve para cualquier progresión aritmética.',
  examples: ['1, 4, 7, 10, 13', '7 a 67', '481', '5 000', '140 000', 'impares'],
  scenes: [
    { id: 'gauss', name: 'El truco de Gauss', dur: 37,
      caps: [[0.5, 9.0, 'UNA TAREA LARGA', 'Sumar del 1 al 100.', ''], [9.4, 19.0, 'AL DERECHO Y AL REVÉS', 'Cada columna suma 101:', '$1 + 100$, $2 + 99$, …'],
        [19.4, 28.0, 'CIEN COLUMNAS', '$100 · 101$ es el doble', 'de la suma.'], [28.4, 36.4, 'LA SUMA', R`$\frac{100 · 101}{2} = 5050$.`, '']],
      narr: [[0.5, 9.0, 'Se cuenta que un maestro puso a sus alumnos a sumar del uno al cien, para tenerlos ocupados. Carl Friedrich Gauss, de nueve años, terminó enseguida.'],
        [9.4, 19.0, 'Escribió la suma al derecho y debajo al revés. Cada columna suma ciento uno: uno más cien, dos más noventa y nueve…'],
        [19.4, 28.0, 'Hay cien columnas de ciento uno. Pero así se sumó todo dos veces.'],
        [28.4, 36.4, 'Entonces la suma es cien por ciento uno, entre dos: cinco mil cincuenta.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.2], [12.0, 'pops', 4], [19.8, 'card'], [28.8, 'yes']],
      draw(t) {
        const row = (y, seq, a) => fade(a, () => seq.forEach((s, i) => M(s, 170 + i * 125, y, 50, { pass: true })));
        row(640, ['1', '2', '3', '…', '98', '99', '100'], A(t, 1.0)); row(760, ['100', '99', '98', '…', '3', '2', '1'], A(t, 9.8));
        fade(A(t, 12.0), () => { line(110, 800, 970, 800, { w: 4 }); [0, 1, 2, 4, 5, 6].forEach((i, j) => fade(A(t, 12.0 + j * .2), () => M('101', 170 + i * 125, 880, 46, { c: P.ac, pass: true }))); });
        fade(A(t, 19.8), () => M(R`2S = 100 · 101`, 540, 1180, 80, { id: 'd' }));
        fade(A(t, 28.8), () => M(R`S = \frac{100 · 101}{2} = \hl{5050}`, 540, 1360, 80, { id: 's' }));
      } },
    { id: 'escaleras', name: 'Dos escaleras', dur: 35,
      caps: [[0.5, 9.0, 'UNA ESCALERA', '1, 4, 7, 10, 13:', 'columnas de bloques.'], [9.4, 19.0, 'OTRA, DE CABEZA', 'Encajan y forman', 'un rectángulo.'],
        [19.4, 34.4, 'EL RECTÁNGULO', '5 columnas de $1 + 13 = 14$:', 'la suma es la mitad, 35.']],
      narr: [[0.5, 9.0, 'El truco se ve con bloques. La progresión uno, cuatro, siete, diez, trece es una escalera de columnas.'],
        [9.4, 19.0, 'Si se pone otra escalera igual, de cabeza, encima, las dos encajan y forman un rectángulo.'],
        [19.4, 34.4, 'El rectángulo tiene cinco columnas, y cada una mide el primero más el último: catorce. Son setenta bloques, y cada escalera es la mitad: treinta y cinco.']],
      ev: [[1.0, 'pops', 5], [9.8, 'fly', 1.4], [19.8, 'card']],
      draw(t) {
        const hs = [1, 4, 7, 10, 13], cw = 120, bh = 46, x0 = 240, yb = 1240, top = yb - 14 * bh;
        stair(x0, yb, hs, cw, bh, { k: t - 1.0 });
        const m = eio(seg(t, 9.8, 11.2)); if (t > 9.4) { X.save(); X.translate(0, (1 - m) * -260); stair(x0, yb, hs.map(h => 14 - h), cw, bh, { flip: true, top, fill: .15, c: P.ink }); X.restore(); }
        fade(A(t, 19.8), () => { rect(x0, top, 5 * cw, 14 * bh, { w: 5, c: P.ac }); brace(x0, x0 + 5 * cw, yb + 20, { label: '5 columnas', k: 1, s: 36 }); M('14', x0 + 5 * cw + 60, top + 7 * bh + 14, 48, { c: P.ac, pass: true }); });
        fade(A(t, 20.4), () => M(R`S = \frac{5 · 14}{2} = \hl{35}`, 540, 1440, 80, { id: 's' }));
      } },
    { id: 'formula', name: 'La fórmula', dur: 31,
      caps: [[0.5, 9.0, 'EN GENERAL', '$n$ columnas de altura', '$a_{1} + a_{n}$, partido en dos.'], [9.4, 19.0, 'LA FÓRMULA', R`$S_{n} = \frac{n(a_{1} + a_{n})}{2}$.`, ''],
        [19.4, 30.4, 'SIN EL ÚLTIMO', 'Con $a_{n} = a_{1} + (n − 1)d$:', R`$S_{n} = \frac{n}{2}(2a_{1} + (n − 1)d)$.`]],
      narr: [[0.5, 9.0, 'En general, con n términos el rectángulo tiene n columnas, y cada una mide el primero más el último.'],
        [9.4, 19.0, 'La suma es la mitad: n por a sub uno más a sub n, sobre dos. Es el número de términos por el promedio del primero y el último.'],
        [19.4, 30.4, 'Si no se conoce el último, se reemplaza por su fórmula y queda otra versión, solo con el primero y la diferencia.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'rise']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`S_{n} = a_{1} + a_{2} + … + a_{n}`, 540, 660, 70, { id: 'd' }));
        fade(A(t, 9.8), () => M(R`S_{n} = \frac{n\,(a_{1} + a_{n})}{2}`, 540, 900, 96, { id: 'f' }));
        fade(A(t, 11.0), () => label('términos × promedio del primero y el último', 540, 1020, P.mute, { s: 34 }));
        fade(A(t, 19.8), () => M(R`S_{n} = \frac{n}{2}\,(2a_{1} + (n − 1)\,d)`, 540, 1240, 76, { id: 'f2' }));
      } },
    { id: 'contar', name: 'Cuántos términos', dur: 34,
      caps: [[0.5, 9.0, 'UNA SUMA', '$7 + 12 + 17 + … + 67$:', 'cuántos términos hay.'], [9.4, 19.0, 'CONTAR SALTOS', 'De 7 a 67 suben 60:', '12 saltos de 5, 13 términos.'],
        [19.4, 33.4, 'LA SUMA', R`$\frac{13(7 + 67)}{2} = 481$.`, '']],
      narr: [[0.5, 9.0, 'Para usar la fórmula hay que saber cuántos términos hay. En siete más doce más diecisiete, hasta sesenta y siete, no se ve a simple vista.'],
        [9.4, 19.0, 'Se cuentan los saltos: de siete a sesenta y siete se suben sesenta, en saltos de cinco, doce saltos. Doce saltos son trece términos.'],
        [19.4, 33.4, 'La suma es trece por siete más sesenta y siete, entre dos: cuatrocientos ochenta y uno.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 2.4], [19.8, 'card']],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: 800, v0: 0, v1: 70, ticks: [7, 67], k: 1, ls: 40 });
        for (let i = 0; i < 12; i++) hop(X_(7 + 5 * i), X_(12 + 5 * i), 800, draw(t, 9.8 + i * .2, .25), { c: P.ac, h: 50 });
        for (let i = 0; i <= 12; i++) fade(A(t, 1.0 + i * .08, .2), () => dot(X_(7 + 5 * i), 800, { r: 9, c: P.ac }));
        fade(A(t, 1.0), () => M(R`7 + 12 + 17 + … + 67`, 540, 600, 70, { id: 'e' }));
        fade(A(t, 10.4), () => M(R`n − 1 = \frac{67 − 7}{5} = 12 \;⇒\; n = 13`, 540, 1100, 66, { id: 'n' }));
        fade(A(t, 19.8), () => M(R`S_{13} = \frac{13\,(7 + 67)}{2} = \hl{481}`, 540, 1300, 80, { id: 's' }));
      } },
    { id: 'impares', name: 'Los impares forman cuadrados', dur: 35,
      caps: [[0.5, 9.0, 'LOS IMPARES', '$1 + 3 + 5 + 7$: cada uno', 'es una escuadra de bloques.'], [9.4, 19.0, 'SE ENCAJAN', 'Las escuadras forman', 'un cuadrado de 4 por 4.'],
        [19.4, 34.4, 'EN GENERAL', 'Los primeros $n$ impares', 'suman $n^{2}$.']],
      narr: [[0.5, 9.0, 'Una suma con dibujo propio: los impares. Uno, tres, cinco, siete. Cada impar se puede armar como una escuadra de bloques.'],
        [9.4, 19.0, 'Las escuadras encajan una alrededor de otra y forman un cuadrado: con cuatro impares, un cuadrado de cuatro por cuatro, dieciséis.'],
        [19.4, 34.4, 'Siempre pasa: los primeros n impares suman n al cuadrado. Y la fórmula lo confirma: n por uno más dos n menos uno, entre dos, es n al cuadrado.']],
      ev: [[1.0, 'pops', 4], [9.8, 'fly', 1.4], [19.8, 'card']],
      draw(t) {
        const s = 90, x0 = 360, y0 = 540, cols = [.75, .55, .38, .22];
        for (let k = 0; k < 4; k++) fade(A(t, 1.0 + k * .8), () => { for (let i = 0; i <= k; i++) { rect(x0 + k * s + 3, y0 + i * s + 3, s - 6, s - 6, { r: 6, w: 2, fill: cols[k] }); if (i < k) rect(x0 + i * s + 3, y0 + k * s + 3, s - 6, s - 6, { r: 6, w: 2, fill: cols[k] }); } M(String(2 * k + 1), x0 - 60 - 0, y0 + k * s + 60, 40, { c: P.ac, pass: true }); });
        fade(A(t, 9.8), () => { rect(x0, y0, 4 * s, 4 * s, { w: 5, c: P.ac }); M('16', x0 + 4 * s + 70, y0 + 2 * s + 18, 56, { c: P.ac, pass: true }); });
        fade(A(t, 1.6), () => M(R`1 + 3 + 5 + 7 = 16 = 4^{2}`, 540, 1100, 72, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`1 + 3 + … + (2n − 1) = \hl{n^{2}}`, 540, 1280, 72, { id: 'g' }));
      } },
    { id: 'pares', name: 'Los pares', dur: 25,
      caps: [[0.5, 12.0, 'LOS PARES', '$2 + 4 + … + 2n$: $n$ términos', 'con primero 2 y último $2n$.'], [12.4, 24.4, 'LA SUMA', R`$\frac{n(2 + 2n)}{2} = n(n + 1)$:`, 'un rectángulo de $n$ por $n + 1$.']],
      narr: [[0.5, 12.0, 'Los pares también tienen su fórmula. Dos más cuatro, hasta dos n, son n términos: el primero es dos y el último, dos n.'],
        [12.4, 24.4, 'La suma es n por dos más dos n, entre dos: n por n más uno. Un rectángulo de n por n más uno.']],
      ev: [[1.0, 'pops', 4], [12.8, 'card']],
      draw(t) {
        const s = 80, x0 = 300, y0 = 560;
        for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) fade(A(t, 12.8 + (r * 5 + c) * .04, .2), () => rect(x0 + c * s + 3, y0 + r * s + 3, s - 6, s - 6, { r: 6, w: 2, fill: c > r ? .25 : .6 }));
        fade(A(t, 13.6), () => { brace(x0, x0 + 5 * s, y0 + 4 * s + 20, { label: 'n + 1', m: true, k: 1, s: 44 }); M('n', x0 - 40, y0 + 2 * s + 14, 44, { pass: true }); });
        fade(A(t, 1.0), () => M(R`2 + 4 + 6 + 8 = 20 = 4 · 5`, 540, 1100, 70, { id: 'e' }));
        fade(A(t, 12.8), () => M(R`2 + 4 + … + 2n = \hl{n(n + 1)}`, 540, 1280, 72, { id: 'g' }));
      } },
    { id: 'ahorro', name: 'Un ahorro', dur: 33,
      caps: [[0.5, 9.0, 'UN PLAN', 'La primera semana 5 000; cada', 'semana, 2 000 más.'], [9.4, 19.0, 'EN 10 SEMANAS', R`$a_{1} = 5\,000$, $d = 2\,000$,`, '$n = 10$.'],
        [19.4, 32.4, 'EL TOTAL', R`$\frac{10}{2}(10\,000 + 18\,000)$`, R`$= 140\,000$.`]],
      narr: [[0.5, 9.0, 'Alguien decide ahorrar cinco mil pesos la primera semana, y cada semana dos mil más que la anterior.'],
        [9.4, 19.0, 'Lo que guarda cada semana es una progresión aritmética: primer término cinco mil, diferencia dos mil. Quiere saber cuánto junta en diez semanas.'],
        [19.4, 32.4, 'Con la segunda fórmula: diez medios, por diez mil más nueve veces dos mil. Cinco por veintiocho mil: ciento cuarenta mil pesos.']],
      ev: [[1.0, 'pops', 10], [19.8, 'card']],
      draw(t) {
        for (let i = 0; i < 10; i++) fade(A(t, 1.0 + i * .15, .3), () => { const v = 5 + 2 * i, h = v * 22, x = 150 + i * 80; rect(x, 1100 - h, 64, h, { r: 6, w: 3, fill: .45 }); M(String(v), x + 32, 1150, 30, { pass: true }); });
        fade(A(t, 1.6), () => label('miles de pesos por semana', 540, 1210, P.mute, { s: 32 }));
        fade(A(t, 19.8), () => M(R`S_{10} = \frac{10}{2}\,(2 · 5000 + 9 · 2000) = \hl{140\,000}`, 540, 1400, 56, { id: 's' }));
      } },
  ],
  sum: [['Gauss', R`1 + 2 + … + 100 = 5050`], ['La suma', R`S_{n} = \frac{n\,(a_{1} + a_{n})}{2}`], ['Sin el último', R`S_{n} = \frac{n}{2}\,(2a_{1} + (n − 1)\,d)`], ['Impares', R`1 + 3 + … + (2n − 1) = n^{2}`], ['Pares', R`2 + 4 + … + 2n = n(n + 1)`]],
  end: ['Términos por el promedio', 'del primero y el último.'],
  finNarr: [[0.8, 9.0, 'En resumen: la suma de una progresión aritmética es el número de términos por el promedio del primero y el último.'],
    [9.2, 16.0, 'Dos escaleras forman un rectángulo, y los impares, un cuadrado.']],
};
