// Lección alg-14 · Sucesiones y progresiones aritméticas (mundo Sucesiones y Series).
// Sucesión, puesto y término; aritmética (los martes de un mes); d positiva, negativa o cero; término general con saltos y no
// términos; hallar a₁ y d con dos términos; medios aritméticos; la gráfica es una recta.
const R = String.raw;
const POSTER = 120;
const LY = 860;
const FILM = {
  lesson: 'alg-14', world: 'progresiones', key: 'G', n: [1, 5],
  title: 'Sucesiones y progresiones aritméticas',
  next: 'La suma de una progresión aritmética',
  intro: 'Una lista de números en orden puede seguir una regla. La más sencilla: sumar siempre lo mismo.',
  examples: ['6, 13, 20, 27', '50, 46, 42', '139', 'a₄ = 17', 'a₉ = 37', 'entre 5 y 29', '1/n'],
  scenes: [
    { id: 'sucesion', name: 'Qué es una sucesión', dur: 31,
      caps: [[0.5, 9.0, 'SUCESIÓN', 'Una lista ordenada', 'de números.'], [9.4, 19.0, 'PUESTO Y TÉRMINO', '$a_{n}$: el término que', 'está en el puesto $n$.'],
        [19.4, 30.4, 'UNA REGLA', R`$a_{n} = \frac{1}{n}$: con la regla`, 'se calcula cualquier término.']],
      narr: [[0.5, 9.0, 'Una sucesión es una lista de números en un orden: hay un primero, un segundo, un tercero, y así.'],
        [9.4, 19.0, 'El término que está en el puesto n se escribe a sub n. El puesto siempre es un natural: uno, dos, tres…'],
        [19.4, 30.4, 'A veces hay una regla. Si a sub n es uno sobre n, la lista es uno, un medio, un tercio, un cuarto. Con la regla se calcula cualquier término sin escribir los anteriores.']],
      ev: [[1.0, 'pops', 5], [9.8, 'tag'], [19.8, 'pops', 4]],
      draw(t) {
        const terms = t < 19.4 ? ['7', '2', '9', '4', '5'] : [R`1`, R`\frac{1}{2}`, R`\frac{1}{3}`, R`\frac{1}{4}`, R`\frac{1}{5}`];
        terms.forEach((s, i) => fade(A(t, (t < 19.4 ? 1.0 : 19.8) + i * .2), () => { const x = 170 + i * 185; rect(x - 70, 600, 140, 140, { r: 16, w: 4, fill: .2 }); M(s, x, 690, 60, { pass: true }); fade(A(t, 9.8 + i * .2), () => { M(String(i + 1), x, 800, 40, { c: P.ac, pass: true }); M(`a_{${i + 1}}`, x, 560, 40, { c: P.mute, pass: true }); }); }));
        fade(A(t, 9.8), () => label('puesto', 70, 800, P.ac, { s: 30, a: 'l', pass: true }));
        fade(A(t, 1.2), () => M(R`a_{1}, \; a_{2}, \; a_{3}, \; …, \; a_{n}, \; …`, 540, 1300, 70, { id: 'g' }));
        fade(A(t, 19.8), () => M(R`a_{n} = \frac{1}{n}`, 540, 1460, 84, { id: 'r' }));
      } },
    { id: 'aritmetica', name: 'Progresión aritmética', dur: 32,
      caps: [[0.5, 9.0, 'LOS MARTES DEL MES', '6, 13, 20, 27:', 'cada uno, 7 días después.'], [9.4, 19.0, 'ARITMÉTICA', 'Se suma siempre', 'la misma diferencia $d$.'],
        [19.4, 31.4, 'LA DIFERENCIA', '$d = a_{n+1} − a_{n}$:', 'aquí $d = 7$.']],
      narr: [[0.5, 9.0, 'Los martes de un mes caen el seis, el trece, el veinte y el veintisiete. De uno al siguiente pasan siempre siete días.'],
        [9.4, 19.0, 'Una lista así, en la que se suma siempre la misma cantidad, se llama progresión aritmética.'],
        [19.4, 31.4, 'La cantidad que se suma se llama diferencia, d, porque es la resta entre un término y el anterior. Aquí d es siete.']],
      ev: [[1.0, 'draw', 1.0], [2.4, 'pop', 0], [3.4, 'pop', 1], [4.4, 'pop', 2], [19.8, 'card']],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: 0, v1: 30, ticks: [0, 6, 13, 20, 27, 30], k: draw(t, 1.0, 1.0), ls: 38 });
        dot(X_(6), LY, { r: 13, c: P.ac }); [6, 13, 20].forEach((v, i) => hop(X_(v), X_(v + 7), LY, draw(t, 2.4 + i, .7), { c: P.ac, label: '+7', h: 120 }));
        [13, 20, 27].forEach((v, i) => fade(A(t, 3.1 + i), () => dot(X_(v), LY, { r: 13, c: P.ac })));
        fade(A(t, 1.2), () => M(R`6, \; 13, \; 20, \; 27`, 540, 1300, 80, { id: 'l' }));
        fade(A(t, 19.8), () => M(R`d = a_{n+1} − a_{n} = 7`, 540, 1460, 76, { id: 'd' }));
      } },
    { id: 'signo', name: 'Crecer, bajar o quedarse', dur: 28,
      caps: [[0.5, 9.0, 'd POSITIVA', 'La progresión crece:', '6, 13, 20, …'], [9.4, 18.0, 'd NEGATIVA', 'Decrece: una vela de 50 cm', 'que baja 4 cada hora.'],
        [18.4, 27.4, 'd = 0', 'Se queda igual:', '5, 5, 5, …']],
      narr: [[0.5, 9.0, 'Si la diferencia es positiva, la progresión crece.'],
        [9.4, 18.0, 'Si es negativa, decrece. Una vela de cincuenta centímetros que se acorta cuatro cada hora: cincuenta, cuarenta y seis, cuarenta y dos.'],
        [18.4, 27.4, 'Y si la diferencia es cero, todos los términos son iguales. También es una progresión aritmética, aunque aburrida.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 4], [18.8, 'pops', 3]],
      draw(t) {
        fade(A(t, 9.8), () => { for (let i = 0; i < 4; i++) { const h = (50 - 4 * i) * 8, x = 220 + i * 190; fade(A(t, 9.8 + i * .4), () => { rect(x - 30, 1100 - h, 60, h, { r: 8, w: 4, fill: .3 }); ell(x, 1100 - h - 26, 12, 22, { w: 3, fill: .8, fc: '#FFC85A', c: '#FFC85A' }); M(String(50 - 4 * i), x, 1160, 44, { pass: true }); }); } });
        fade(A(t, 1.0) * (1 - A(t, 9.4)), () => M(R`d > 0: \quad 6, 13, 20, …`, 540, 760, 70, { id: 'p' }));
        fade(A(t, 10.4), () => M(R`d = −4: \quad 50, 46, 42, 38, …`, 540, 1340, 66, { id: 'n' }));
        fade(A(t, 18.8), () => M(R`d = 0: \quad 5, 5, 5, …`, 540, 1480, 66, { id: 'z' }));
      } },
    { id: 'general', name: 'El término general', dur: 37,
      caps: [[0.5, 9.0, 'SALTOS, NO TÉRMINOS', 'Del primero al cuarto', 'hay tres saltos.'], [9.4, 19.0, 'EN GENERAL', 'Del primero al de puesto $n$', 'hay $n − 1$ saltos de $d$.'],
        [19.4, 28.0, 'LA FÓRMULA', R`$a_{n} = a_{1} + (n − 1)\,d$.`, ''], [28.4, 36.4, 'EJEMPLO', 'El vigésimo martes:', '$6 + 19 · 7 = 139$.']],
      narr: [[0.5, 9.0, 'Del primer término al cuarto no hay cuatro saltos sino tres, como entre los postes de una cerca.'],
        [9.4, 19.0, 'En general, del primero al término de puesto n hay n menos uno saltos, y cada salto suma d.'],
        [19.4, 28.0, 'Entonces a sub n es a sub uno más n menos uno por d. Con esa fórmula se llega a cualquier puesto de un golpe.'],
        [28.4, 36.4, 'Si los martes siguieran contando sin cambiar de mes, el vigésimo sería seis más diecinueve por siete: ciento treinta y nueve.']],
      ev: [[1.0, 'pops', 4], [2.6, 'pop', 0], [3.2, 'pop', 1], [3.8, 'pop', 2], [19.8, 'card'], [28.8, 'card']],
      draw(t) {
        for (let i = 0; i < 4; i++) { const x = 200 + i * 220; fade(A(t, 1.0 + i * .2), () => { line(x, 620, x, 820, { w: 8 }); M(`a_{${i + 1}}`, x, 880, 44, { pass: true }); }); if (i < 3) fade(A(t, 2.6 + i * .6), () => { hop(x, x + 220, 620, 1, { c: P.ac, h: 70 }); M(String(i + 1), x + 110, 520, 40, { c: P.ac, pass: true }); }); }
        fade(A(t, 9.8), () => M(R`n \t{ términos} \;→\; n − 1 \t{ saltos}`, 540, 1040, 62, { id: 's' }));
        fade(A(t, 19.8), () => M(R`a_{n} = a_{1} + (n − 1)\,d`, 540, 1280, 86, { id: 'f' }));
        fade(A(t, 28.8), () => M(R`a_{20} = 6 + 19 · 7 = \hl{139}`, 540, 1440, 76, { id: 'e' }));
      } },
    { id: 'dos', name: 'Con dos términos', dur: 35,
      caps: [[0.5, 9.0, 'DOS DATOS', '$a_{4} = 17$ y $a_{9} = 37$:', 'se halla todo.'], [9.4, 19.0, 'LOS SALTOS', 'Del puesto 4 al 9 hay', '5 saltos: $5d = 20$.'],
        [19.4, 27.0, 'LA DIFERENCIA', '$d = 4$.', ''], [27.4, 34.4, 'EL PRIMERO', 'Se devuelven tres saltos:', '$a_{1} = 17 − 12 = 5$.']],
      narr: [[0.5, 9.0, 'Con dos términos cualesquiera se reconstruye la progresión. Digamos que el cuarto es diecisiete y el noveno, treinta y siete.'],
        [9.4, 19.0, 'Del puesto cuatro al nueve hay cinco saltos, y en ellos se subió de diecisiete a treinta y siete: veinte.'],
        [19.4, 27.0, 'Cinco saltos suman veinte, así que cada salto es cuatro.'],
        [27.4, 34.4, 'Para el primero se devuelven tres saltos desde el cuarto: diecisiete menos doce, cinco.']],
      ev: [[1.0, 'pops', 2], [9.8, 'draw', 2.0], [19.8, 'card'], [27.8, 'draw', 1.4]],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: 0, v1: 40, ticks: [0, 5, 17, 37, 40], k: 1, ls: 38 });
        [[17, 'a_{4}'], [37, 'a_{9}']].forEach(([v, s], i) => fade(A(t, 1.0 + i * .3), () => { dot(X_(v), LY, { r: 13, c: P.ac }); M(s, X_(v), LY - 60, 44, { c: P.ac, pass: true }); }));
        for (let i = 0; i < 5; i++) hop(X_(17 + 4 * i), X_(21 + 4 * i), LY, draw(t, 9.8 + i * .4, .4), { c: P.ac, h: 60 });
        for (let i = 0; i < 3; i++) hop(X_(17 - 4 * i), X_(13 - 4 * i), LY, draw(t, 27.8 + i * .45, .4), { c: P.mute, h: 60, below: true });
        fade(A(t, 29.4), () => { dot(X_(5), LY, { r: 13, c: P.ac }); M('a_{1}', X_(5), LY - 60, 44, { c: P.ac, pass: true }); });
        fade(A(t, 10.4), () => M(R`5d = 37 − 17 = 20`, 540, 1300, 72, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`d = \hl{4}`, 540, 1430, 80, { id: 'b' }));
        fade(A(t, 27.8), () => M(R`a_{1} = 17 − 3 · 4 = \hl{5}`, 540, 1560, 72, { id: 'c' }));
      } },
    { id: 'medios', name: 'Medios aritméticos', dur: 31,
      caps: [[0.5, 9.0, 'MEDIOS', 'Términos que van entre', 'dos números dados.'], [9.4, 19.0, 'TRES ENTRE 5 Y 29', 'Con tres medios hay', 'cuatro saltos: $4d = 24$.'],
        [19.4, 30.4, 'RESULTADO', '$d = 6$: 5, 11, 17, 23, 29.', '']],
      narr: [[0.5, 9.0, 'Los medios aritméticos son los términos que se meten entre dos números para formar una progresión.'],
        [9.4, 19.0, 'Para poner tres medios entre cinco y veintinueve, hay cinco términos en total y cuatro saltos. Los cuatro suman veinticuatro.'],
        [19.4, 30.4, 'Cada salto es seis, y los medios son once, diecisiete y veintitrés.']],
      ev: [[1.0, 'pops', 2], [9.8, 'draw', 1.6], [19.8, 'pops', 3]],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: 0, v1: 32, ticks: [0, 5, 29, 32], k: 1, ls: 38 });
        [5, 29].forEach((v, i) => fade(A(t, 1.0 + i * .3), () => dot(X_(v), LY, { r: 13 })));
        for (let i = 0; i < 4; i++) hop(X_(5 + 6 * i), X_(11 + 6 * i), LY, draw(t, 9.8 + i * .4, .4), { c: P.ac, h: 80, label: '+6' });
        [11, 17, 23].forEach((v, i) => fade(A(t, 19.8 + i * .3), () => { dot(X_(v), LY, { r: 13, c: P.ac }); M(String(v), X_(v), LY + 70, 40, { c: P.ac, pass: true }); }));
        fade(A(t, 10.4), () => M(R`4d = 29 − 5 = 24 \;⇒\; d = 6`, 540, 1320, 70, { id: 'd' }));
        fade(A(t, 19.8), () => M(R`5, \; \hl{11, \; 17, \; 23}, \; 29`, 540, 1480, 76, { id: 'm' }));
      } },
    { id: 'grafica', name: 'La gráfica', dur: 27,
      caps: [[0.5, 9.0, 'PUNTOS', 'Cada término es un punto', '$(n, a_{n})$.'], [9.4, 18.0, 'EN LÍNEA RECTA', 'Cada paso a la derecha', 'sube lo mismo: $d$.'],
        [18.4, 26.4, 'POR ESO', 'Aritmética = crecer', 'en línea recta.']],
      narr: [[0.5, 9.0, 'Si cada término se dibuja como un punto, con el puesto en el eje horizontal y el valor en el vertical, aparece algo conocido.'],
        [9.4, 18.0, 'Los puntos quedan alineados: cada paso a la derecha sube exactamente d.'],
        [18.4, 26.4, 'Una progresión aritmética crece en línea recta. En la próxima lección eso servirá para sumarla.']],
      ev: [[1.0, 'draw', 1.0], [2.0, 'pops', 5], [9.8, 'draw', 1.2]],
      draw(t) {
        const Pl = plane({ ox: 170, oy: 1150, sx: 140, sy: 22, x0: 0, x1: 5.6, y0: 0, y1: 28, k: A(t, 1.0, .8), xt: [1, 2, 3, 4, 5], yt: [5, 9, 13, 17, 21] });
        for (let n = 1; n <= 5; n++) fade(A(t, 2.0 + n * .3), () => dot(Pl.X(n), Pl.Y(1 + 4 * n), { r: 13, c: P.ac }));
        plot(x => 1 + 4 * x, .5, 5.5, Pl, { k: draw(t, 9.8, 1.2), c: hexA(P.ac, .6), w: 4, dash: [12, 10] });
        fade(A(t, 10.6), () => { line(Pl.X(2), Pl.Y(9), Pl.X(3), Pl.Y(9), { w: 3, c: P.mute }); line(Pl.X(3), Pl.Y(9), Pl.X(3), Pl.Y(13), { w: 3, c: P.mute }); label('d', Pl.X(3) + 30, Pl.Y(11) + 10, P.ac, { s: 40, a: 'l' }); });
        fade(A(t, 1.2), () => M(R`a_{n} = 1 + 4n`, 540, 1400, 70, { id: 'f' }));
      } },
  ],
  sum: [['Sucesión', R`a_{1}, \; a_{2}, \; a_{3}, \; …`], ['Aritmética', R`a_{n+1} = a_{n} + d`], ['Término general', R`a_{n} = a_{1} + (n − 1)\,d`], ['Con dos términos', R`a_{9} − a_{4} = 5d`], ['Medios', R`5, \; 11, \; 17, \; 23, \; 29`]],
  end: ['Sumar siempre lo mismo', 'es crecer en línea recta.'],
  finNarr: [[0.8, 9.0, 'En resumen: una sucesión es una lista ordenada, y una aritmética suma siempre la misma diferencia.'],
    [9.2, 16.0, 'Del primero al término n hay n menos uno saltos, y con dos términos se encuentra todo.']],
};
