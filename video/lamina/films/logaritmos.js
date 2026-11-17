// Lección alg-72 · Logaritmos y sus propiedades (mundo Crecimiento Exponencial).
// Un rumor que se triplica cada hora: 3ˣ = 243; el logaritmo como exponente; reglas básicas; la gráfica de log₂ x,
// espejo de 2ˣ; producto, cociente y potencia; el error de la suma; cambio de base (log₃ 50 ≈ 3.56).
const R = String.raw;
const POSTER = 70;
const FILM = {
  lesson: 'alg-72', world: 'exp-log', key: 'G', n: [3, 4],
  title: 'Logaritmos y sus propiedades',
  next: 'Ecuaciones exponenciales y logarítmicas',
  intro: 'La exponencial responde cuánto hay después de un tiempo. El logaritmo responde la pregunta al revés: cuánto tiempo hace falta.',
  examples: ['243', '3ˣ = 243', '1/16', '9⁴', '50 personas', '3.56'],
  scenes: [
    { id: 'rumor', name: 'Un rumor', dur: 30,
      caps: [[0.5, 9.0, 'UN RUMOR', 'Cada hora, el número de', 'personas se triplica.'], [9.4, 19.0, 'LA PREGUNTA', 'Cuándo llega a 243:', '$3^{x} = 243$.'],
        [19.4, 29.4, 'CONTANDO', '$3, 9, 27, 81, 243$:', 'a las 5 horas.']],
      narr: [[0.5, 9.0, 'Un rumor empieza con una persona, y cada hora el número de personas que lo saben se triplica.'],
        [9.4, 19.0, 'La pregunta no es cuántas lo saben, sino cuándo llegan a doscientas cuarenta y tres. La incógnita está en el exponente.'],
        [19.4, 29.4, 'Contando: tres, nueve, veintisiete, ochenta y uno, doscientas cuarenta y tres. Cinco horas.']],
      ev: [[1.0, 'pops', 3], [9.8, 'rise'], [19.8, 'count', 0], [20.8, 'count', 1], [21.8, 'count', 2], [22.8, 'count', 3], [23.8, 'count', 4]],
      draw(t) {
        const vals = [1, 3, 9, 27, 81, 243];
        vals.forEach((v, i) => fade(A(t, i ? 19.8 + (i - 1) : 1.0), () => { const x = 120 + i * 168; cells(x - 50, 1080 - Math.min(16, Math.ceil(v / 16)) * 8, 16, Math.min(16, Math.ceil(v / 16)), 6.4, v, { a: .8 }); M(String(v), x + 1, 1150, 42, { pass: true, c: i === 5 ? P.ac : P.ink }); M(R`${i}\t{ h}`, x + 1, 1220, 32, { pass: true, c: P.mute }); }));
        fade(A(t, 9.8), () => M(R`3^{\hl{x}} = 243`, 540, 660, 100, { id: 'q' }));
        fade(A(t, 24.4), () => M(R`x = 5`, 540, 1380, 80, { id: 'r', c: P.ac }));
      } },
    { id: 'definicion', name: 'El logaritmo', dur: 36,
      caps: [[0.5, 9.0, 'UN NOMBRE', 'El exponente que', 'busca: el logaritmo.'], [9.4, 19.0, 'LA DEFINICIÓN', R`$\log_{b} y = x$ quiere decir`, '$b^{x} = y$.'],
        [19.4, 28.0, 'EJEMPLOS', R`$\log_{10} 1000 = 3$`, R`$\log_{2} \frac{1}{16} = −4$`], [28.4, 35.4, 'EN UNA FRASE', 'El logaritmo es', 'un exponente.']],
      narr: [[0.5, 9.0, 'Ese número que se busca, el exponente, tiene nombre: logaritmo. Logaritmo en base tres de doscientos cuarenta y tres es cinco.'],
        [9.4, 19.0, 'En general, logaritmo en base b de y igual a x significa que b elevado a la x da y. Son dos maneras de decir lo mismo.'],
        [19.4, 28.0, 'Logaritmo en base diez de mil es tres. Logaritmo en base dos de un dieciseisavo es menos cuatro.'],
        [28.4, 35.4, 'La idea a recordar: el logaritmo es un exponente, la respuesta a la pregunta a qué hay que elevar.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.0], [19.8, 'pops', 2], [28.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\log_{3} 243 = \hl{5}`, 540, 600, 84, { id: 'a' }));
        fade(A(t, 9.8), () => { M(R`\log_{b} y = x \qquad ⇔ \qquad b^{x} = y`, 540, 790, 68, { id: 'b' }); M(R`\t{base}`, 168, 850, 30, { c: P.mute, pass: true }); });
        fade(A(t, 19.8), () => M(R`\log_{10} 1000 = 3 \quad ⇔ \quad 10^{3} = 1000`, 540, 1020, 50, { id: 'c' }));
        fade(A(t, 20.8), () => M(R`\log_{2} \frac{1}{16} = −4 \quad ⇔ \quad 2^{−4} = \frac{1}{16}`, 540, 1160, 50, { id: 'd' }));
        fade(A(t, 28.8), () => M(R`\t{logaritmo} = \hl{\t{exponente}}`, 540, 1340, 70, { id: 'e' }));
      } },
    { id: 'basicas', name: 'Cuatro hechos', dur: 31,
      caps: [[0.5, 9.0, 'DE LA DEFINICIÓN', R`$\log_{b} 1 = 0$ porque $b^{0} = 1$.`, R`$\log_{b} b = 1$.`], [9.4, 19.0, 'SE DESHACEN', R`$\log_{b} b^{x} = x$`, R`$b^{\log_{b} y} = y$`],
        [19.4, 30.4, 'SOLO POSITIVOS', R`$\log_{b}(−2)$ no existe:`, '$b^{x}$ nunca es negativo.']],
      narr: [[0.5, 9.0, 'De la definición salen cuatro hechos. El logaritmo de uno es cero, porque b a la cero es uno. El de la base es uno.'],
        [9.4, 19.0, 'Y la exponencial y el logaritmo de la misma base se deshacen el uno al otro, como sumar y restar.'],
        [19.4, 30.4, 'Además, solo existe el logaritmo de números positivos: ninguna potencia de base positiva da cero ni un negativo.']],
      ev: [[1.0, 'pops', 2], [9.8, 'pops', 2], [19.8, 'no']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\log_{b} 1 = 0`, 300, 640, 62, { id: 'a' }));
        fade(A(t, 1.6), () => M(R`\log_{b} b = 1`, 780, 640, 62, { id: 'b' }));
        fade(A(t, 9.8), () => M(R`\log_{b} b^{x} = x`, 300, 860, 62, { id: 'c' }));
        fade(A(t, 10.4), () => M(R`b^{\log_{b} y} = y`, 780, 860, 62, { id: 'd' }));
        fade(A(t, 19.8), () => M(R`\log_{b}(−2) \no{\t{ no existe}}`, 540, 1100, 64, { id: 'e' }));
      } },
    { id: 'grafica', name: 'Su gráfica', dur: 35,
      caps: [[0.5, 9.0, 'EL ESPEJO', R`$\log_{2} x$ es el reflejo`, 'de $2^{x}$ en $y = x$.'], [9.4, 19.0, 'PUNTOS', '$(1, 0)$, $(2, 1)$, $(4, 2)$, $(8, 3)$', ''],
        [19.4, 27.0, 'ASÍNTOTA', 'Cerca de 0 se hunde:', 'el eje $y$ es asíntota.'], [27.4, 34.4, 'DOMINIO', 'Dominio $(0, ∞)$,', 'rango todos los reales.']],
      narr: [[0.5, 9.0, 'Como deshace a dos a la x, la gráfica del logaritmo en base dos es su reflejo en la recta y igual a x.'],
        [9.4, 19.0, 'Los puntos se voltean: cero, uno pasa a uno, cero; uno, dos pasa a dos, uno; y así cuatro, dos y ocho, tres.'],
        [19.4, 27.0, 'Cerca de cero se hunde hacia abajo sin tocar el eje vertical: ese eje es una asíntota.'],
        [27.4, 34.4, 'Solo acepta positivos, pero da cualquier número real: crece, aunque cada vez más despacio.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'pops', 4], [19.8, 'tag']],
      draw(t) {
        const Pl = plane({ ox: 300, oy: 1240, sx: 80, sy: 80, x0: -2.5, x1: 8.6, y0: -3.5, y1: 8.4, k: 1, grid: true, xt: [2, 4, 6, 8], yt: [-2, 2, 4, 6, 8] });
        stroke(P.mute, 3, () => { X.moveTo(Pl.X(-2.5), Pl.Y(-2.5)); X.lineTo(Pl.X(8.4), Pl.Y(8.4)); }, { dash: [10, 10] });
        plot(x => 2 ** x, -2.5, 3.07, Pl, { c: hexA(P.ink, .35), w: 4, ymax: 8.4 });
        plot(x => Math.log2(x), .09, 8.4, Pl, { k: draw(t, 1.0, 1.4) });
        [[1, 0], [2, 1], [4, 2], [8, 3]].forEach(([x, y], i) => fade(A(t, 9.8 + i * .5), () => { dot(Pl.X(y), Pl.Y(x), { r: 9, c: P.mute }); dot(Pl.X(x), Pl.Y(y), { r: 12, c: P.ac, ping: ping(t, 9.8 + i * .5) }); }));
        fade(A(t, 19.8), () => stroke(P.ac, 4, () => { X.moveTo(Pl.X(0), Pl.Y(-3.5)); X.lineTo(Pl.X(0), Pl.Y(8.4)); }, { glow: 10 }));
        fade(A(t, 1.6), () => { label('y = 2ˣ', Pl.X(2.6), Pl.Y(7.6), P.mute, { s: 34, a: 'r' }); label('y = log₂ x', Pl.X(8.4), Pl.Y(3) - 30, P.ac, { s: 34, a: 'r' }); });
      } },
    { id: 'producto', name: 'Producto y cociente', dur: 34,
      caps: [[0.5, 9.0, 'MULTIPLICAR', 'Al multiplicar potencias,', 'los exponentes se suman.'], [9.4, 19.0, 'EL PRODUCTO', R`$\log(MN) = \log M + \log N$`, ''],
        [19.4, 27.0, 'UN EJEMPLO', R`$\log_{3}(9 · 27) = 2 + 3 = 5$`, ''], [27.4, 33.4, 'EL COCIENTE', R`$\log \frac{M}{N} = \log M − \log N$`, '']],
      narr: [[0.5, 9.0, 'Nueve es tres al cuadrado y veintisiete es tres al cubo. Su producto es tres a la dos más tres: los exponentes se suman.'],
        [9.4, 19.0, 'Como el logaritmo es un exponente, el logaritmo de un producto es la suma de los logaritmos.'],
        [19.4, 27.0, 'Logaritmo en base tres de nueve por veintisiete: dos más tres, cinco. Y en efecto, el producto es doscientos cuarenta y tres.'],
        [27.4, 33.4, 'Del mismo modo, al dividir los exponentes se restan: el logaritmo de un cociente es una resta.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'sum'], [27.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`3^{2} · 3^{3} = 3^{\hl{2 + 3}}`, 540, 600, 76, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\log_{b}(MN) = \log_{b} M + \log_{b} N`, 540, 790, 58, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`\log_{3}(9 · 27) = 2 + 3 = \hl{5}`, 540, 980, 62, { id: 'c' }));
        fade(A(t, 27.8), () => M(R`\log_{b} \frac{M}{N} = \log_{b} M − \log_{b} N`, 540, 1200, 58, { id: 'd' }));
      } },
    { id: 'potencia', name: 'La potencia', dur: 33,
      caps: [[0.5, 9.0, 'UNA POTENCIA', 'El exponente sale', R`adelante: $\log M^{k} = k \log M$.`], [9.4, 19.0, 'UN EJEMPLO', R`$\log_{3} 9^{4} = 4 · 2 = 8$`, ''],
        [19.4, 32.4, '!CUIDADO', 'El logaritmo de una suma', 'no se parte.']],
      narr: [[0.5, 9.0, 'Elevar a la k es multiplicar k veces, así que el logaritmo se suma k veces: el exponente sale adelante.'],
        [9.4, 19.0, 'Logaritmo en base tres de nueve a la cuatro: cuatro por el logaritmo de nueve, cuatro por dos, ocho.'],
        [19.4, 32.4, 'Y una trampa común: el logaritmo de una suma no es la suma de logaritmos. Logaritmo de uno más uno es el de dos, no cero más cero.']],
      ev: [[1.0, 'rise'], [9.8, 'sum'], [19.8, 'no']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\log_{b} M^{\hl{k}} = \hl{k} \, \log_{b} M`, 540, 640, 72, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\log_{3} 9^{4} = 4 · \log_{3} 9 = 4 · 2 = 8`, 540, 860, 58, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`\log(M + N) \no{≠} \log M + \log N`, 540, 1100, 62, { id: 'c' }));
      } },
    { id: 'base', name: 'Cambio de base', dur: 34,
      caps: [[0.5, 9.0, 'OTRA PREGUNTA', 'Cuándo lo saben 50:', '$3^{x} = 50$.'], [9.4, 19.0, 'CAMBIO DE BASE', R`$\log_{b} y = \frac{\log y}{\log b}$`, ''],
        [19.4, 33.4, 'LA CALCULADORA', R`$\frac{1.699}{0.4771} ≈ 3.56$ horas:`, 'entre las horas 3 y 4.']],
      narr: [[0.5, 9.0, 'Ahora el rumor tiene que llegar a cincuenta personas. Ninguna potencia entera de tres da cincuenta.'],
        [9.4, 19.0, 'La calculadora tiene logaritmo en base diez. Para otra base se usa el cambio de base: el logaritmo de y entre el de la base.'],
        [19.4, 33.4, 'Logaritmo de cincuenta entre logaritmo de tres da unas tres coma cincuenta y seis horas. Tiene sentido: tres a la tres es veintisiete y tres a la cuatro, ochenta y uno.']],
      ev: [[1.0, 'doubt'], [9.8, 'card'], [19.8, 'sum']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`3^{x} = 50`, 540, 600, 92, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\log_{b} y = \frac{\log y}{\log b}`, 540, 800, 80, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`x = \frac{\log 50}{\log 3} ≈ \frac{1.699}{0.4771} ≈ \hl{3.56}`, 540, 1020, 58, { id: 'c' }));
        const ax = axis({ x0: 140, x1: 900, y: 1300, v0: 0, v1: 5, ticks: [0, 1, 2, 3, 4, 5], k: A(t, 22.0) });
        fade(A(t, 23.0), () => { dot(ax(3.56), 1300, { r: 14, c: P.ac, ping: ping(t, 23.0) }); M('27', ax(3), 1240, 34, { pass: true, c: P.mute }); M('81', ax(4), 1240, 34, { pass: true, c: P.mute }); });
      } },
  ],
  sum: [['Definición', R`\log_{b} y = x \;⇔\; b^{x} = y`], ['Hechos', R`\log_{b} 1 = 0, \quad \log_{b} b = 1`], ['Producto', R`\log(MN) = \log M + \log N`], ['Cociente', R`\log \frac{M}{N} = \log M − \log N`], ['Potencia', R`\log M^{k} = k \log M`], ['Cambio de base', R`\log_{b} y = \frac{\log y}{\log b}`]],
  end: ['El logaritmo es un exponente:', 'responde a qué hay que elevar.'],
  finNarr: [[0.8, 9.0, 'En resumen: el logaritmo es el exponente que hay que ponerle a la base para obtener un número.'],
    [9.2, 18.0, 'Convierte productos en sumas, cocientes en restas y potencias en productos. Y el cambio de base lo lleva a la calculadora.']],
};
