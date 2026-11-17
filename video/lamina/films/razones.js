// Lección alg-12 · Razones: comparar dividiendo (mundo Escalas y Proporciones).
// Restar frente a dividir; a : b y cómo se lee; razones equivalentes (y por qué sumar no sirve); parte a parte y parte al todo;
// razones con unidades (rapidez y precio por unidad); escala de un mapa; la lámina del mundo: el triángulo que crece sin deformarse.
const R = String.raw;
const POSTER = 200;
const FILM = {
  lesson: 'alg-12', world: 'razones', key: 'F', n: [1, 6],
  title: 'Razones: comparar dividiendo',
  next: 'Proporciones y magnitudes proporcionales',
  intro: 'Hay dos maneras de comparar dos cantidades, y una de ellas es la puerta de todo este mundo: la razón.',
  examples: ['15 m', '20 : 8', '3 : 5', '210 km', '7 800', '1 : 50 000'],
  scenes: [
    { id: 'comparar', name: 'Restar o dividir', dur: 31,
      caps: [[0.5, 9.0, 'DOS CUERDAS', 'Una de 15 m y otra de 5 m.', 'Se pueden comparar así:'], [9.4, 18.0, 'RESTANDO', '$15 − 5 = 10$: la larga tiene', '10 m más.'],
        [18.4, 30.4, 'DIVIDIENDO', '$15 ÷ 5 = 3$: la corta cabe', 'tres veces en la larga.']],
      narr: [[0.5, 9.0, 'Hay una cuerda de quince metros y otra de cinco. Para compararlas hay dos preguntas distintas.'],
        [9.4, 18.0, 'Cuánto más larga es: se resta. Quince menos cinco, diez metros más.'],
        [18.4, 30.4, 'Cuántas veces cabe una en la otra: se divide. Quince entre cinco, tres veces. Comparar dividiendo es lo que se llama una razón.']],
      ev: [[1.0, 'draw', 1.0], [1.6, 'draw', .6], [9.8, 'brace'], [18.8, 'pop', 0], [19.6, 'pop', 1], [20.4, 'pop', 2], [21.4, 'card']],
      draw(t) {
        const U = 52, x0 = 150; bar(x0, 600, 15 * U, 70, { k: draw(t, 1.0, 1.0), label: '15 m' }); bar(x0, 760, 5 * U, 70, { k: draw(t, 1.6, .6), label: '5 m', a: .2 });
        if (t > 9.4 && t < 18.4) fade(A(t, 9.8), () => { stroke(P.ac, 3, () => { X.moveTo(x0 + 5 * U, 560); X.lineTo(x0 + 5 * U, 860); }, { dash: [8, 8] }); brace(x0 + 5 * U, x0 + 15 * U, 860, { label: '10 m más', k: 1, s: 40 }); });
        if (t > 18.4) for (let i = 0; i < 3; i++) fade(A(t, 18.8 + i * .8, .4), () => { rect(x0 + i * 5 * U, 900, 5 * U, 70, { r: 10, w: 4, fill: .25 }); M(String(i + 1), x0 + (i + .5) * 5 * U, 950, 42, { pass: true }); });
        fade(A(t, 9.8) * (1 - A(t, 18.2)), () => M(R`15 − 5 = 10`, 540, 1360, 90, { id: 'r' }));
        fade(A(t, 21.4), () => M(R`\frac{15}{5} = \hl{3}`, 540, 1380, 110, { id: 'd' }), (1 - A(t, 21.4)) * 14);
      } },
    { id: 'notacion', name: 'Cómo se escribe', dur: 31,
      caps: [[0.5, 9.0, 'LA RAZÓN', '$a : b$ es el cociente', R`$\frac{a}{b}$.`], [9.4, 18.0, 'SE LEE', '«$a$ es a $b$». En una receta,', '2 de harina por 3 de leche.'],
        [18.4, 30.4, 'EL ORDEN IMPORTA', '$2 : 3$ no es $3 : 2$,', 'y $b$ no puede ser 0.']],
      narr: [[0.5, 9.0, 'La razón entre a y b se escribe a dos puntos b, y es el cociente a sobre b.'],
        [9.4, 18.0, 'Se lee a es a b. Una receta con dos tazas de harina por cada tres de leche tiene razón dos es a tres.'],
        [18.4, 30.4, 'El orden importa: dos es a tres no es lo mismo que tres es a dos, porque la división no es conmutativa. Y el segundo término no puede ser cero.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 5], [18.8, 'shuffle', 1.0]],
      draw(t) {
        const cup = (x, y, c, lab) => { poly([[x - 50, y - 70], [x + 50, y - 70], [x + 38, y + 50], [x - 38, y + 50]], { w: 5, fill: .35, fc: c }); };
        fade(A(t, 9.8), () => { for (let i = 0; i < 2; i++) fade(A(t, 9.8 + i * .2), () => cup(250 + i * 130, 760, P.ac)); for (let i = 0; i < 3; i++) fade(A(t, 10.4 + i * .2), () => cup(600 + i * 130, 760, P.ink)); label('harina', 315, 880, P.ac, { s: 38 }); label('leche', 730, 880, P.ink, { s: 38 }); });
        fade(A(t, 1.0), () => M(R`a : b = \frac{a}{b}`, 540, 1340, 100, { id: 'def' }));
        fade(A(t, 11.0), () => M(R`\t{harina : leche} = 2 : 3`, 540, 1500, 70, { id: 'ej' }));
        fade(A(t, 18.8), () => M(R`2 : 3 \no{≠} 3 : 2 \qquad b ≠ 0`, 540, 1640, 66, { id: 'ord' }));
      } },
    { id: 'equivalentes', name: 'Razones equivalentes', dur: 35,
      caps: [[0.5, 9.0, 'SIMPLIFICAR', '$20 : 8 = 5 : 2$: se dividen', 'los dos términos entre 4.'], [9.4, 18.0, 'EQUIVALENTES', 'Multiplicar o dividir los', 'dos por lo mismo.'],
        [18.4, 34.4, '!SUMAR NO SIRVE', '$5 : 2$ y $6 : 3$ no son', 'la misma razón.']],
      narr: [[0.5, 9.0, 'En un grupo hay veinte fichas rosadas por cada ocho blancas. Dividiendo los dos números entre cuatro, la razón es cinco es a dos.'],
        [9.4, 18.0, 'Como con las fracciones, si los dos términos se multiplican o se dividen por el mismo número, la razón no cambia. Son razones equivalentes.'],
        [18.4, 34.4, 'Pero sumar lo mismo a los dos sí la cambia. Cinco es a dos vale dos y medio; seis es a tres vale dos. Ya no es la misma comparación.']],
      ev: [[1.0, 'pops', 7], [3.6, 'cut'], [9.8, 'rise'], [19.0, 'no']],
      draw(t) {
        const grp = eio(seg(t, 3.6, 5.0));
        for (let g = 0; g < 4; g++) { const gx = 140 + g * 210 + grp * 0; fade(A(t, 1.0 + g * .2), () => { for (let i = 0; i < 5; i++) circ(gx + 30 + (i % 3) * 52, 620 + Math.floor(i / 3) * 52, 20, { w: 3, fill: .7 }); for (let i = 0; i < 2; i++) circ(gx + 30 + i * 52, 760, 20, { w: 3, fill: .05 }); if (grp > 0) rect(gx - 10, 580, 180, 220, { r: 18, w: 3, c: hexA(P.ac, grp) }); }); }
        fade(A(t, 1.2), () => M(R`20 : 8 = \frac{20 ÷ \hl{4}}{8 ÷ \hl{4}} = 5 : 2`, 540, 1000, 66, { id: 's' }));
        fade(A(t, 9.8), () => M(R`a : b = (ka) : (kb) \quad (k ≠ 0)`, 540, 1360, 66, { id: 'g' }));
        fade(A(t, 19.0), () => M(R`\frac{5}{2} = 2.5 \quad \no{≠} \quad \frac{5 + 1}{2 + 1} = \frac{6}{3} = 2`, 540, 1540, 62, { id: 'no' }));
      } },
    { id: 'partetodo', name: 'Parte y todo', dur: 33,
      caps: [[0.5, 9.0, 'UNA PINTURA', 'Azul : blanco $= 3 : 5$:', 'parte con parte.'], [9.4, 19.0, 'PARTE AL TODO', 'De cada 8 tarros,', R`3 son azules: $\frac{3}{8}$.`],
        [19.4, 32.4, '!NO CONFUNDIR', '$3 : 5$ compara las partes;', R`$\frac{3}{8}$, una parte con el todo.`]],
      narr: [[0.5, 9.0, 'Para un tono de pintura se mezclan tres tarros de azul por cada cinco de blanco. Esa razón compara una parte con la otra.'],
        [9.4, 19.0, 'Pero cada tanda tiene ocho tarros en total, y tres son azules. La fracción de azul en la mezcla es tres octavos: la parte comparada con el todo.'],
        [19.4, 32.4, 'Las dos razones describen la misma mezcla, pero responden preguntas distintas. Antes de calcular, hay que saber qué se está comparando.']],
      ev: [[1.0, 'pops', 8], [9.8, 'brace'], [19.8, 'tag']],
      draw(t) {
        for (let i = 0; i < 8; i++) { const blue = i < 3, x = 150 + i * 105; fade(A(t, 1.0 + i * .15, .3), () => { rect(x, 620, 80, 120, { r: 12, w: 4, fill: blue ? .7 : .08, fc: blue ? P.ac : P.ink }); }); }
        fade(A(t, 2.6), () => { brace(150, 445, 760, { label: '3 azules', k: 1, s: 38 }); brace(465, 970, 760, { label: '5 blancos', k: 1, s: 38, c: P.ink }); });
        fade(A(t, 9.8), () => brace(150, 970, 600, { up: true, label: '8 en total', k: 1, s: 38 }));
        fade(A(t, 1.2), () => M(R`\t{azul : blanco} = 3 : 5`, 540, 1340, 70, { id: 'pp' }));
        fade(A(t, 10.2), () => M(R`\t{azul : total} = \frac{3}{8} = 0.375`, 540, 1500, 70, { id: 'pt' }));
      } },
    { id: 'unidades', name: 'Razones con unidades', dur: 36,
      caps: [[0.5, 9.0, 'RAPIDEZ', '210 km en 3 h:', R`$\frac{210}{3} = 70$ km por hora.`], [9.4, 18.0, 'UNA RAZÓN CON UNIDADES', 'Kilómetros entre horas:', 'el resultado es km/h.'],
        [18.4, 27.0, 'PRECIO POR UNIDAD', '3 kg por 7 800 o', '5 kg por 12 500.'], [27.4, 35.4, 'LA MÁS BARATA', 'La de 5 kg: 2 500 por kg', 'contra 2 600.']],
      narr: [[0.5, 9.0, 'Un bus recorre doscientos diez kilómetros en tres horas. Dividiendo, recorre setenta kilómetros en cada hora.'],
        [9.4, 18.0, 'Cuando las cantidades tienen unidades distintas, la razón también tiene unidades: kilómetros por hora. Es la rapidez.'],
        [18.4, 27.0, 'Lo mismo sirve para comprar. Una bolsa de arroz de tres kilos cuesta siete mil ochocientos pesos; una de cinco kilos, doce mil quinientos.'],
        [27.4, 35.4, 'Por kilo, la pequeña sale a dos mil seiscientos y la grande a dos mil quinientos. La grande es más barata por kilo.']],
      ev: [[1.0, 'draw', 1.6], [3.0, 'card'], [18.8, 'pops', 2], [27.8, 'yes']],
      draw(t) {
        if (t < 18.4) { const X_ = axis({ x0: 120, x1: 940, y: 760, v0: 0, v1: 210, ticks: [0, 70, 140, 210], k: 1, ls: 38, fmt: v => v + ' km' }); for (let i = 0; i < 3; i++) hop(X_(i * 70), X_(i * 70 + 70), 760, draw(t, 1.0 + i * .55, .5), { c: P.ac, label: '1 h', h: 110 }); }
        else { [[3, '7 800', 260, 18.8], [5, '12 500', 760, 19.4]].forEach(([kg, p, x, t0]) => fade(A(t, t0), () => { rect(x - 110, 580, 220, 260, { r: 26, w: 5, fill: .2 }); M(kg + ' kg', x, 700, 60, { pass: true }); M('$ ' + p, x, 790, 46, { c: P.mute, pass: true }); })); }
        fade(A(t, 3.0) * (1 - A(t, 18.2)), () => M(R`\frac{210 \t{ km}}{3 \t{ h}} = \hl{70 \t{ km/h}}`, 540, 1380, 76, { id: 'v' }));
        fade(A(t, 28.0), () => { M(R`\frac{7800}{3} = 2600 \qquad \frac{12500}{5} = \hl{2500}`, 540, 1380, 62, { id: 'pr' }); label('pesos por kilo', 540, 1500, P.mute, { s: 38 }); });
      } },
    { id: 'escala', name: 'Escala de un mapa', dur: 34,
      caps: [[0.5, 9.0, 'ESCALA 1 : 50 000', 'Lo que mide 1 en el mapa', 'mide 50 000 en la realidad.'], [9.4, 19.0, 'EN UNIDADES', '1 cm del mapa', 'son 50 000 cm = 500 m.'],
        [19.4, 33.4, 'EJEMPLO', '6 cm en el mapa:', R`$6 · 500 \t{ m} = 3$ km.`]],
      narr: [[0.5, 9.0, 'La escala uno es a cincuenta mil dice que lo que mide uno en el mapa mide cincuenta mil en la realidad.'],
        [9.4, 19.0, 'Un centímetro del mapa son cincuenta mil centímetros reales, o sea quinientos metros.'],
        [19.4, 33.4, 'Si dos pueblos están a seis centímetros en el mapa, en la realidad están a seis veces quinientos metros: tres kilómetros.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'tag'], [20.0, 'draw', 1.0], [22.0, 'card']],
      draw(t) {
        rect(150, 520, 780, 520, { r: 24, w: 5, k: draw(t, 1.0, 1.4), fill: .06 });
        fade(A(t, 2.0), () => { stroke(hexA(P.ink, .3), 3, () => { X.moveTo(200, 900); X.bezierCurveTo(400, 700, 600, 980, 880, 640); }); dot(260, 860, { r: 14 }); dot(260 + 6 * 90, 860 - 160, { r: 14, c: P.ac }); });
        fade(A(t, 9.8), () => { for (let i = 0; i <= 6; i++) line(200 + i * 90, 990, 200 + i * 90, 1010, { w: 3 }); line(200, 1000, 740, 1000, { w: 4 }); M('0', 200, 980, 30, { pass: true }); M('6 cm', 740, 980, 30, { pass: true }); });
        fade(A(t, 20.0), () => line(260, 860, 800, 700, { k: draw(t, 20.0, 1.0), c: P.ac, w: 5, dash: [12, 10] }));
        fade(A(t, 1.2), () => M(R`1 : 50\,000`, 540, 1340, 100, { id: 'e' }));
        fade(A(t, 22.0), () => M(R`6 · 50\,000 \t{ cm} = 300\,000 \t{ cm} = \hl{3 \t{ km}}`, 540, 1500, 56, { id: 'r' }));
      } },
    { id: 'semejanza', name: 'Crecer sin deformarse', dur: 35,
      caps: [[0.5, 9.0, 'UN TRIÁNGULO', 'Base $a$ y altura $h$:', 'su inclinación es $h : a$.'], [9.4, 20.0, 'EL DOBLE', 'Base $2a$ y altura $2h$:', 'la razón no cambia.'],
        [20.4, 34.4, 'LA IDEA DEL MUNDO', 'Mantener la razón es', 'crecer sin deformarse.']],
      narr: [[0.5, 9.0, 'Es el dibujo de la lámina del mundo: un triángulo con base a y altura h. La razón h es a a dice qué tan inclinado sube.'],
        [9.4, 20.0, 'Si se duplican las dos, base dos a y altura dos h, la razón queda igual. Por eso el triángulo grande sube con la misma inclinación.'],
        [20.4, 34.4, 'Eso es lo que hacen las escalas, las fotos ampliadas y las maquetas: cambian el tamaño, pero conservan las razones. Así nada se deforma.']],
      ev: [[1.0, 'draw', 1.2], [9.8, 'draw', 1.4], [21.0, 'rise']],
      draw(t) {
        const ox = 170, oy = 1100, a = 300, h = 220;
        poly([[ox, oy], [ox + a, oy], [ox + a, oy - h]], { k: draw(t, 1.0, 1.2), fill: .3, w: 6, c: P.ac });
        poly([[ox, oy], [ox + 2 * a, oy], [ox + 2 * a, oy - 2 * h]], { k: draw(t, 9.8, 1.4), w: 6 });
        fade(A(t, 2.0), () => { M('a', ox + a / 2, oy + 60, 54, { c: P.ac, pass: true }); M('h', ox + a + 40, oy - h / 2 + 18, 54, { a: 'l', c: P.ac, pass: true }); });
        fade(A(t, 11.0), () => { M('2a', ox + a, oy + 130, 54, { pass: true }); M('2h', ox + 2 * a + 40, oy - h + 18, 54, { a: 'l', pass: true }); });
        fade(A(t, 1.6), () => M(R`\frac{h}{a}`, 540, 1380, 100, { id: 'r1' }));
        fade(A(t, 11.4), () => M(R`\frac{2h}{2a} = \frac{h}{a}`, 540, 1380 + 0, 100, { id: 'r2' }), 0);
        fade(A(t, 21.0), () => M(R`a : b = c : d`, 540, 1600, 84, { id: 'pl', c: P.ac }));
      } },
  ],
  sum: [['Razón', R`a : b = \frac{a}{b} \quad (b ≠ 0)`], ['Equivalentes', R`20 : 8 = 5 : 2`], ['Parte a parte y parte al todo', R`3 : 5 \qquad \frac{3}{8}`], ['Con unidades', R`\frac{210 \t{ km}}{3 \t{ h}} = 70 \t{ km/h}`], ['Escala', R`1 : 50\,000`]],
  end: ['Una razón dice cuántas veces', 'cabe una cantidad en otra.'],
  finNarr: [[0.8, 9.0, 'En resumen: la razón compara dividiendo, y se mantiene si los dos términos se multiplican por lo mismo.'],
    [9.2, 16.0, 'Puede comparar partes o una parte con el todo, tener unidades, o ser la escala de un mapa.']],
};
