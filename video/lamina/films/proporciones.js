// Lección alg-12e · Proporciones y magnitudes proporcionales (mundo Escalas y Proporciones).
// Proporción, extremos y medios; propiedad fundamental (por qué); hallar un término; magnitudes directas (tabla y recta por el
// origen) e inversas (producto constante y curva); media proporcional; reparto proporcional.
const R = String.raw;
const POSTER = 150;
const FILM = {
  lesson: 'alg-12e', world: 'razones', key: 'F', n: [2, 6],
  title: 'Proporciones y magnitudes proporcionales',
  next: 'Regla de tres simple y compuesta',
  intro: 'Cuando dos razones valen lo mismo, forman una proporción. Con ella se calculan datos que faltan y se reconocen magnitudes que crecen juntas.',
  examples: ['3/4 = 9/12', 'x/10 = 9/15', '800', '24 = ', '60 000', '1 : 2 : 3', '4 y 9'],
  scenes: [
    { id: 'proporcion', name: 'Qué es una proporción', dur: 31,
      caps: [[0.5, 9.0, 'PROPORCIÓN', 'La igualdad de dos razones:', R`$\frac{3}{4} = \frac{9}{12}$.`], [9.4, 18.0, 'SE LEE', '«3 es a 4 como', '9 es a 12».'],
        [18.4, 30.4, 'EXTREMOS Y MEDIOS', 'En $a : b = c : d$, $a$ y $d$', 'son extremos; $b$ y $c$, medios.']],
      narr: [[0.5, 9.0, 'Tres cuartos y nueve doceavos valen lo mismo: cero coma setenta y cinco. Cuando dos razones son iguales, forman una proporción.'],
        [9.4, 18.0, 'Se lee: tres es a cuatro como nueve es a doce.'],
        [18.4, 30.4, 'Escrita con dos puntos, los números de las puntas se llaman extremos, y los del medio, medios.']],
      ev: [[1.0, 'draw', 1.0], [2.0, 'draw', 1.0], [18.8, 'tag'], [20.0, 'tag']],
      draw(t) {
        const U = 640; bar(220, 560, U * .75, 70, { k: draw(t, 1.0, 1.0), label: R`\frac{3}{4}` , s: 40 }); bar(220, 690, U * .75, 70, { k: draw(t, 2.0, 1.0), label: R`\frac{9}{12}`, s: 40, a: .25 });
        fade(A(t, 3.2), () => { rect(220, 545, U, 230, { r: 12, w: 3, c: hexA(P.ink, .4) }); label('las dos llegan igual de lejos', 540, 840, P.mute, { s: 36 }); });
        fade(A(t, 1.2), () => M(R`\frac{3}{4} = \frac{9}{12}`, 540, 1100, 96, { id: 'p' }));
        fade(A(t, 18.8), () => { const r = M(R`\id{a}{a} : \id{b}{b} = \id{c}{c} : \id{d}{d}`, 540, 1400, 100, { id: 'em' });
          fade(A(t, 18.8), () => { label('extremo', r.box.a.cx, 1480, P.ac, { s: 32 }); label('extremo', r.box.d.cx, 1480, P.ac, { s: 32 }); });
          fade(A(t, 20.0), () => { label('medio', r.box.b.cx, 1300, P.mute, { s: 32 }); label('medio', r.box.c.cx, 1300, P.mute, { s: 32 }); }); });
      } },
    { id: 'fundamental', name: 'La propiedad fundamental', dur: 33,
      caps: [[0.5, 9.0, 'LA PROPIEDAD', 'Producto de extremos =', 'producto de medios.'], [9.4, 20.0, 'POR QUÉ', 'Se multiplican los dos', 'lados por $bd$.'],
        [20.4, 32.4, 'COMPROBAR', '$3 · 12 = 36$ y $4 · 9 = 36$:', 'sí es una proporción.']],
      narr: [[0.5, 9.0, 'Toda proporción cumple una propiedad: el producto de los extremos es igual al producto de los medios.'],
        [9.4, 20.0, 'La razón: si a sobre b es igual a c sobre d, se multiplican los dos lados por b por d, y se cancelan los denominadores.'],
        [20.4, 32.4, 'Sirve para comprobar. Tres por doce da treinta y seis, y cuatro por nueve también. Entonces sí hay proporción.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [12.4, 'cut'], [20.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{a}{b} = \frac{c}{d} \;\;⇔\;\; ad = bc`, 540, 640, 80, { id: 'pf' }));
        fade(A(t, 9.8), () => M(R`\hl{bd} · \frac{a}{b} = \hl{bd} · \frac{c}{d}`, 540, 860, 70, { id: 's1' }));
        fade(A(t, 12.4), () => M(R`\frac{\no{b}da}{\no{b}} = \frac{b\no{d}c}{\no{d}} \;\;⇒\;\; ad = bc`, 540, 1060, 64, { id: 's2' }));
        fade(A(t, 20.8), () => M(R`3 · 12 = 36 \qquad 4 · 9 = 36`, 540, 1380, 74, { id: 'c' }));
      } },
    { id: 'termino', name: 'Hallar un término', dur: 30,
      caps: [[0.5, 9.0, 'FALTA UN DATO', R`$\frac{x}{10} = \frac{9}{15}$: se busca`, 'el número $x$.'], [9.4, 18.0, 'SE MULTIPLICA EN CRUZ', '$15x = 10 · 9 = 90$.', ''],
        [18.4, 29.4, 'SE DESPEJA', R`$x = \frac{90}{15} = 6$.`, 'Y se comprueba.']],
      narr: [[0.5, 9.0, 'Si falta un número de la proporción, la propiedad fundamental lo encuentra. Equis es a diez como nueve es a quince.'],
        [9.4, 18.0, 'Producto de extremos igual a producto de medios: quince por equis es igual a diez por nueve, noventa.'],
        [18.4, 29.4, 'Equis es noventa entre quince: seis. Y se comprueba: seis décimos y nueve quinceavos valen los dos tres quintos.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', .8], [11.0, 'draw', .8], [18.8, 'card']],
      draw(t) {
        const r = M(R`\frac{\id{x}{x}}{\id{b}{10}} = \frac{\id{c}{9}}{\id{d}{15}}`, 540, 760, 120, { id: 'pr' });
        if (t > 9.4) { line(r.box.x.cx + 20, r.box.x.cy + 20, r.box.d.cx - 20, r.box.d.cy - 20, { k: draw(t, 9.8, .8), c: P.ac, w: 5 }); line(r.box.b.cx + 20, r.box.b.cy - 20, r.box.c.cx - 20, r.box.c.cy + 20, { k: draw(t, 11.0, .8), c: P.mute, w: 5 }); }
        fade(A(t, 10.4), () => M(R`15x = 90`, 540, 1080, 86, { id: 'cx' }));
        fade(A(t, 18.8), () => M(R`x = \frac{90}{15} = \hl{6}`, 540, 1300, 90, { id: 'x' }));
        fade(A(t, 22.0), () => M(R`\frac{6}{10} = \frac{9}{15} = \frac{3}{5}`, 540, 1520, 70, { id: 'ok' }));
      } },
    { id: 'directa', name: 'Magnitudes directas', dur: 39,
      caps: [[0.5, 9.0, 'DIRECTAMENTE PROPORCIONALES', 'Si una se duplica,', 'la otra también.'], [9.4, 19.0, 'LO QUE SE CONSERVA', R`El cociente: $\frac{y}{x} = k$,`, 'el precio de un lápiz.'],
        [19.4, 29.0, 'LA GRÁFICA', 'Una recta que pasa', 'por el origen.'], [29.4, 38.4, 'SE ESCRIBE', '$y = kx$, con', '$k = 800$.']],
      narr: [[0.5, 9.0, 'Un lápiz cuesta ochocientos pesos. Dos cuestan mil seiscientos, tres, dos mil cuatrocientos. Si se compra el doble, se paga el doble.'],
        [9.4, 19.0, 'En cada fila de la tabla, el precio dividido entre los lápices da lo mismo: ochocientos. Ese cociente constante es la marca de las magnitudes directas.'],
        [19.4, 29.0, 'Si se dibujan los puntos, quedan sobre una recta que sale del origen: cero lápices, cero pesos.'],
        [29.4, 38.4, 'Por eso se escribe y igual a k por x. El número k se llama constante de proporcionalidad.']],
      ev: [[1.0, 'pops', 4], [9.8, 'tag'], [19.8, 'draw', 1.4], [22.0, 'pops', 4], [29.8, 'card']],
      draw(t) {
        const rows = [[1, 800], [2, 1600], [3, 2400], [4, 3200]];
        fade(A(t, .8), () => { T('lápices', 170, 560, { s: 34, c: P.mute }); T('pesos', 340, 560, { s: 34, c: P.mute }); rows.forEach(([x, y], i) => fade(A(t, 1.0 + i * .3), () => { M(String(x), 200, 640 + i * 90, 50, { pass: true }); M(String(y), 360, 640 + i * 90, 50, { pass: true }); fade(A(t, 9.8 + i * .3), () => M(R`\frac{${y}}{${x}} = \hl{800}`, 450, 640 + i * 90, 40, { a: 'l', pass: true })); })); });
        if (t > 19.4) { const Pl = plane({ ox: 160, oy: 1220, sx: 140, sy: 140 / 800, x0: 0, x1: 5.4, y0: 0, y1: 4300, k: A(t, 19.6, .8), xt: [1, 2, 3, 4, 5], yt: [] });
          fade(A(t, 19.6), () => { X.fillStyle = hexA(P.bg, .7); X.fillRect(120, 520, 600, 520); });
          plot(x => 800 * x, 0, 5.2, Pl, { k: draw(t, 19.8, 1.4) }); rows.forEach(([x, y], i) => fade(A(t, 22.0 + i * .3), () => dot(Pl.X(x), Pl.Y(y), { r: 12, c: P.ac }))); dot(Pl.X(0), Pl.Y(0), { r: 10, hollow: true }); }
        fade(A(t, 29.8), () => M(R`y = kx \qquad k = \frac{y}{x}`, 540, 1440, 76, { id: 'f' }));
      } },
    { id: 'inversa', name: 'Magnitudes inversas', dur: 40,
      caps: [[0.5, 9.0, 'INVERSAMENTE PROPORCIONALES', 'Si una se duplica,', 'la otra se reduce a la mitad.'], [9.4, 19.0, 'LO QUE SE CONSERVA', 'El producto: $xy = 24$', 'días de trabajo.'],
        [19.4, 29.0, 'LA GRÁFICA', 'Una curva que baja', 'sin tocar los ejes.'], [29.4, 39.4, '!NO TODO LO QUE BAJA', 'Es inversa solo si el', 'producto es constante.']],
      narr: [[0.5, 9.0, 'Dos pintores pintan una casa en doce días. Con cuatro pintores tardan seis; con tres, ocho; con seis, cuatro.'],
        [9.4, 19.0, 'Aquí lo que no cambia es el producto: pintores por días da siempre veinticuatro. Es el trabajo total, medido en días de un pintor.'],
        [19.4, 29.0, 'Los puntos quedan sobre una curva que baja: más pintores, menos días. Nunca toca los ejes.'],
        [29.4, 39.4, 'Ojo: que una cantidad baje cuando la otra sube no basta. Para ser inversas, el producto tiene que ser siempre el mismo.']],
      ev: [[1.0, 'pops', 4], [9.8, 'tag'], [19.8, 'draw', 1.6], [29.8, 'doubt']],
      draw(t) {
        const rows = [[2, 12], [3, 8], [4, 6], [6, 4]];
        if (t < 19.4) { fade(A(t, .8), () => { T('pintores', 170, 560, { s: 34, c: P.mute }); T('días', 380, 560, { s: 34, c: P.mute }); rows.forEach(([x, y], i) => fade(A(t, 1.0 + i * .3), () => { M(String(x), 210, 640 + i * 90, 50, { pass: true }); M(String(y), 400, 640 + i * 90, 50, { pass: true }); fade(A(t, 9.8 + i * .3), () => M(R`${x} · ${y} = \hl{24}`, 500, 640 + i * 90, 42, { a: 'l', pass: true })); })); }); }
        else { const Pl = plane({ ox: 160, oy: 1180, sx: 110, sy: 50, x0: 0, x1: 7.6, y0: 0, y1: 13.5, k: A(t, 19.6, .8), xt: [1, 2, 3, 4, 5, 6, 7], yt: [4, 8, 12], grid: true });
          plot(x => 24 / x, 1.8, 7.4, Pl, { k: draw(t, 19.8, 1.6) }); rows.forEach(([x, y], i) => fade(A(t, 21.4 + i * .3), () => dot(Pl.X(x), Pl.Y(y), { r: 12, c: P.ac }))); }
        fade(A(t, 9.8), () => M(R`xy = k \qquad y = \frac{k}{x}`, 540, 1440, 76, { id: 'f' }));
      } },
    { id: 'media', name: 'Media proporcional', dur: 28,
      caps: [[0.5, 9.0, 'MEDIOS IGUALES', R`$\frac{4}{x} = \frac{x}{9}$: el mismo`, 'número en los dos medios.'], [9.4, 18.0, 'SE RESUELVE', '$x · x = 4 · 9$, o sea', '$x^{2} = 36$.'],
        [18.4, 27.4, 'MEDIA PROPORCIONAL', R`$x = \sqrt{36} = 6$: un cuadrado`, 'con el área del rectángulo.']],
      narr: [[0.5, 9.0, 'A veces el número que falta está en los dos medios. Cuatro es a equis como equis es a nueve.'],
        [9.4, 18.0, 'Producto de medios igual a producto de extremos: equis por equis es cuatro por nueve, treinta y seis.'],
        [18.4, 27.4, 'Equis es seis, la media proporcional. En el dibujo: un rectángulo de cuatro por nueve tiene la misma área que un cuadrado de lado seis.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [18.8, 'draw', 1.0], [20.0, 'draw', 1.0]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{4}{x} = \frac{x}{9}`, 540, 660, 96, { id: 'm' }));
        fade(A(t, 9.8), () => M(R`x^{2} = 36`, 540, 860, 86, { id: 'x2' }));
        const s = 42; rect(150, 960, 9 * s, 4 * s, { k: draw(t, 18.8, 1.0), w: 5, fill: .25 }); rect(620, 960 - 2 * s, 6 * s, 6 * s, { k: draw(t, 20.0, 1.0), w: 5, fill: .45 });
        fade(A(t, 19.6), () => { M('9', 150 + 4.5 * s, 960 + 4 * s + 50, 40, { pass: true }); M('4', 120, 960 + 2 * s + 14, 40, { pass: true }); M('6', 620 + 3 * s, 960 + 4 * s + 50, 40, { pass: true }); label('36', 150 + 4.5 * s, 960 + 2 * s + 14, P.ink, { s: 44, pass: true }); label('36', 620 + 3 * s, 960 + s + 14, P.ink, { s: 44, pass: true }); });
        fade(A(t, 18.8), () => M(R`x = \sqrt{4 · 9} = \hl{6}`, 540, 1440, 86, { id: 'r' }));
      } },
    { id: 'reparto', name: 'Reparto proporcional', dur: 35,
      caps: [[0.5, 9.0, 'REPARTIR', '60 000 pesos en la', 'razón $1 : 2 : 3$.'], [9.4, 18.0, 'CONTAR PARTES', '$1 + 2 + 3 = 6$ partes', 'iguales de 10 000.'],
        [18.4, 34.4, 'A CADA UNO', '10 000, 20 000 y 30 000:', 'suman 60 000.']],
      narr: [[0.5, 9.0, 'Tres hermanos reparten sesenta mil pesos según lo que aportó cada uno: en la razón uno, dos, tres.'],
        [9.4, 18.0, 'Se suman las partes: uno más dos más tres, seis partes. Cada parte vale sesenta mil entre seis: diez mil.'],
        [18.4, 34.4, 'Al primero le toca una parte, diez mil; al segundo dos, veinte mil; al tercero tres, treinta mil. Y se comprueba que suman sesenta mil.']],
      ev: [[1.0, 'draw', 1.2], [9.8, 'cut'], [18.8, 'pop', 0], [19.6, 'pop', 1], [20.4, 'pop', 2]],
      draw(t) {
        const w = 780, x0 = 150; rect(x0, 640, w, 110, { r: 14, w: 5, k: draw(t, 1.0, 1.2) });
        fade(A(t, 9.8), () => { for (let i = 1; i < 6; i++) line(x0 + w * i / 6, 640, x0 + w * i / 6, 750, { w: 3, k: A(t, 9.8 + i * .15) }); });
        [[0, 1, '1'], [1, 3, '2'], [3, 6, '3']].forEach(([a, b, lab], i) => fade(A(t, 18.8 + i * .8), () => { fillP(P.ac, [.3, .5, .75][i], () => X.rect(x0 + w * a / 6 + 3, 643, w * (b - a) / 6 - 6, 104)); brace(x0 + w * a / 6 + 6, x0 + w * b / 6 - 6, 780, { label: ['10 000', '20 000', '30 000'][i], k: 1, s: 38 }); }));
        fade(A(t, 1.2), () => M(R`1 : 2 : 3`, 540, 560, 70, { id: 'r' }));
        fade(A(t, 10.2), () => M(R`\frac{60\,000}{6} = \hl{10\,000} \t{ por parte}`, 540, 1340, 66, { id: 'p' }));
        fade(A(t, 22.0), () => M(R`10\,000 + 20\,000 + 30\,000 = 60\,000`, 540, 1500, 56, { id: 's' }));
      } },
  ],
  sum: [['Proporción', R`\frac{a}{b} = \frac{c}{d} \;⇔\; ad = bc`], ['Directas', R`y = kx \qquad \frac{y}{x} = k`], ['Inversas', R`xy = k`], ['Media proporcional', R`\frac{a}{x} = \frac{x}{b} \;⇒\; x = \sqrt{ab}`], ['Reparto', R`\t{total} ÷ \t{número de partes}`]],
  end: ['Directas: el cociente no cambia.', 'Inversas: el producto no cambia.'],
  finNarr: [[0.8, 9.0, 'En resumen: en una proporción, el producto de extremos es igual al de medios, y así se halla el dato que falta.'],
    [9.2, 16.0, 'En magnitudes directas el cociente es constante; en las inversas, el producto.']],
};
