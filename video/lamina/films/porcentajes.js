// Lección alg-13 · Porcentajes: qué son y cómo se calculan (mundo Escalas y Proporciones).
// «De cada 100» con la cuadrícula de 100; equivalencias con fracciones y decimales; parte al todo llevada a 100; las tres
// preguntas con una sola proporción; porcentajes mayores que 100 y menores que 1; trucos para calcular de cabeza.
const R = String.raw;
const POSTER = 60;
const G = 64;                                               // lado de una casilla de la cuadrícula de 100
const grid100 = (n, k = 1, x = 220, y = 500) => fade(k, () => cells(x, y, 10, 10, G, n));
const FILM = {
  lesson: 'alg-13', world: 'razones', key: 'F', n: [4, 6],
  title: 'Porcentajes: qué son y cómo se calculan',
  next: 'Aumentos y descuentos',
  intro: 'Un porcentaje es una razón con el todo puesto en cien. Así es fácil comparar, y una sola proporción responde todas las preguntas.',
  examples: ['37 %', '12 de 15', '30 % de 70', '18 de 45', '27 es el 45 %', '250 %', '0.2 %', '15 % de 360'],
  scenes: [
    { id: 'porciento', name: 'De cada cien', dur: 31,
      caps: [[0.5, 9.0, 'POR CIENTO', 'Quiere decir', '«de cada 100».'], [9.4, 18.0, 'EN LA CUADRÍCULA', '37 casillas de 100:', 'el 37 %.'],
        [18.4, 30.4, 'TRES NOMBRES', R`$37\% = \frac{37}{100} = 0.37$:`, 'el mismo número.']],
      narr: [[0.5, 9.0, 'Por ciento quiere decir de cada cien. Un porcentaje es una fracción con denominador cien.'],
        [9.4, 18.0, 'En una cuadrícula de cien casillas, pintar treinta y siete es pintar el treinta y siete por ciento.'],
        [18.4, 30.4, 'Treinta y siete por ciento, treinta y siete centésimos y cero coma treinta y siete son tres nombres del mismo número.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'pops', 6], [18.8, 'card']],
      draw(t) {
        grid100(Math.floor(clamp((t - 9.8) / 3) * 37), A(t, .8));
        fade(A(t, 12.8), () => M(R`37\%`, 540, 1250, 100, { id: 'p', c: P.ac }));
        fade(A(t, 18.8), () => M(R`37\% = \frac{37}{100} = 0.37`, 540, 1440, 80, { id: 'eq' }));
      } },
    { id: 'conocidos', name: 'Porcentajes conocidos', dur: 33,
      caps: [[0.5, 9.0, 'LOS MÁS USADOS', 'La mitad es el 50 %,', 'un cuarto el 25 %.'], [9.4, 19.0, 'Y TAMBIÉN', 'Un quinto es el 20 %', 'y un décimo, el 10 %.'],
        [19.4, 32.4, 'DE FRACCIÓN A %', 'Se amplía hasta 100', R`abajo: $\frac{3}{4} = \frac{75}{100}$.`]],
      narr: [[0.5, 9.0, 'Hay porcentajes que conviene reconocer de inmediato. La mitad es cincuenta por ciento; un cuarto, veinticinco.'],
        [9.4, 19.0, 'Un quinto es veinte por ciento, porque cien entre cinco es veinte. Y un décimo es diez por ciento.'],
        [19.4, 32.4, 'Para pasar una fracción a porcentaje, se amplía hasta que abajo quede cien. Tres cuartos es setenta y cinco centésimos: setenta y cinco por ciento.']],
      ev: [[1.0, 'draw', 1.0], [3.0, 'draw', 1.0], [9.8, 'draw', 1.0], [12.0, 'draw', 1.0], [19.8, 'card']],
      draw(t) {
        const rows = [[R`\frac{1}{2}`, 50, 1.0], [R`\frac{1}{4}`, 25, 3.0], [R`\frac{1}{5}`, 20, 9.8], [R`\frac{1}{10}`, 10, 12.0]];
        rows.forEach(([f, p, t0], i) => fade(A(t, t0), () => { const y = 560 + i * 150; M(f, 200, y + 70, 56, { pass: true }); rect(300, y, 600, 90, { r: 10, w: 4 }); bar(300, y, 6 * p, 90, { k: draw(t, t0, 1.0), a: .55 }); M(p + R`\%`, 960, y + 64, 50, { a: 'r', c: P.ac, pass: true }); }));
        fade(A(t, 19.8), () => M(R`\frac{3}{4} = \frac{3 · 25}{4 · 25} = \frac{75}{100} = \hl{75\%}`, 540, 1340, 66, { id: 'amp' }));
      } },
    { id: 'partetodo', name: 'Parte del todo', dur: 33,
      caps: [[0.5, 9.0, 'UNA RAZÓN', '12 de 15 estudiantes', 'aprobaron.'], [9.4, 19.0, 'LLEVARLA A 100', R`$\frac{12}{15} = \frac{80}{100}$: de cada`, '100, aprobarían 80.'],
        [19.4, 32.4, 'COMPARAR', 'Así se comparan grupos', 'de tamaños distintos.']],
      narr: [[0.5, 9.0, 'En un grupo de quince estudiantes, aprobaron doce. La razón parte al todo es doce quinceavos.'],
        [9.4, 19.0, 'Si el grupo fuera de cien, en la misma razón aprobarían ochenta. Eso dice el ochenta por ciento.'],
        [19.4, 32.4, 'Por eso los porcentajes sirven para comparar: otro grupo de cuarenta con treinta aprobados tiene el setenta y cinco por ciento. Le fue un poco peor.']],
      ev: [[1.0, 'pops', 15], [9.8, 'draw', 1.0], [19.8, 'pops', 2]],
      draw(t) {
        for (let i = 0; i < 15; i++) fade(A(t, 1.0 + i * .06, .3), () => { const x = 180 + (i % 5) * 150, y = 560 + Math.floor(i / 5) * 140; circ(x, y, 34, { w: 4, fill: i < 12 ? .7 : .05 }); });
        fade(A(t, 9.8), () => M(R`\frac{12}{15} = \frac{12 ÷ 3}{15 ÷ 3} = \frac{4}{5} = \frac{80}{100} = \hl{80\%}`, 540, 1080, 58, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`\frac{30}{40} = \frac{75}{100} = 75\% \quad < \quad 80\%`, 540, 1340, 62, { id: 'c' }));
      } },
    { id: 'preguntas', name: 'Las tres preguntas', dur: 45,
      caps: [[0.5, 9.0, 'UNA SOLA PROPORCIÓN', R`$\frac{\t{parte}}{\t{todo}} = \frac{p}{100}$`, 'responde las tres.'], [9.4, 19.0, 'CUÁNTO ES', 'El 30 % de 70:', '$70 · 0.30 = 21$.'],
        [19.4, 28.0, 'QUÉ PORCENTAJE', '18 de 45:', R`$\frac{18}{45} = 0.4 = 40\%$.`], [28.4, 37.0, 'DE QUÉ TOTAL', '27 es el 45 % de:', '$27 ÷ 0.45 = 60$.'],
        [37.4, 44.4, 'LA CLAVE', 'Saber cuál de los tres', 'datos falta.']],
      narr: [[0.5, 9.0, 'Todas las preguntas de porcentajes salen de una proporción: la parte es al todo como p es a cien.'],
        [9.4, 19.0, 'Si piden el treinta por ciento de setenta, falta la parte: setenta por cero coma treinta da veintiuno.'],
        [19.4, 28.0, 'Si preguntan qué porcentaje es dieciocho de cuarenta y cinco, falta p: dieciocho entre cuarenta y cinco da cero coma cuatro, cuarenta por ciento.'],
        [28.4, 37.0, 'Si veintisiete es el cuarenta y cinco por ciento de algo, falta el todo: veintisiete entre cero coma cuarenta y cinco da sesenta.'],
        [37.4, 44.4, 'Siempre es la misma proporción. Lo único que cambia es cuál de los tres datos hay que encontrar.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.0], [19.8, 'draw', 1.0], [28.8, 'draw', 1.0], [37.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{\t{parte}}{\t{todo}} = \frac{p}{100}`, 540, 640, 84, { id: 'pr' }));
        const qs = [[R`70 · 0.30 = \hl{21}`, 9.8, 30, 21], [R`\frac{18}{45} = 0.4 = \hl{40\%}`, 19.8, 40, 18], [R`\frac{27}{0.45} = \hl{60}`, 28.8, 45, 27]];
        qs.forEach(([s, t0, p, part], i) => fade(A(t, t0), () => { const y = 860 + i * 200; rect(150, y, 600, 60, { r: 10, w: 3 }); bar(150, y, 6 * p, 60, { k: draw(t, t0, 1.0), a: .55 }); M(s, 800, y + 46, 50, { a: 'l', pass: true }); M(p + R`\%`, 150 + 3 * p, y + 44, 34, { c: P.bg, pass: true }); }));
      } },
    { id: 'raros', name: 'Más de 100 y menos de 1', dur: 31,
      caps: [[0.5, 9.0, 'MÁS DE 100 %', 'Es más que el todo:', 'el 250 % de 20 es 50.'], [9.4, 18.0, 'MENOS DE 1 %', 'Es muy poco: el 0.2 %', 'de 5 000 es 10.'],
        [18.4, 30.4, 'LA MISMA CUENTA', 'Se pasa a decimal', 'y se multiplica.']],
      narr: [[0.5, 9.0, 'Hay porcentajes mayores que cien. Doscientos cincuenta por ciento es dos veces y media el todo: de veinte, cincuenta.'],
        [9.4, 18.0, 'Y menores que uno. Cero coma dos por ciento es dos de cada mil: de cinco mil, diez.'],
        [18.4, 30.4, 'La cuenta no cambia: se pasa el porcentaje a decimal dividiendo entre cien, y se multiplica por el todo.']],
      ev: [[1.0, 'draw', 1.6], [9.8, 'pop'], [18.8, 'card']],
      draw(t) {
        const u = 180; for (let i = 0; i < 3; i++) { const k = draw(t, 1.0 + i * .5, .5); bar(150 + i * (u + 10), 620, i === 2 ? u / 2 : u, 90, { k, a: i ? .3 : .55 }); }
        fade(A(t, 2.6), () => { brace(150, 150 + u, 740, { label: '100 %', k: 1, s: 36 }); brace(150, 150 + 2.5 * u + 20, 600, { up: true, label: '250 %', k: 1, s: 36 }); });
        fade(A(t, 9.8), () => { cells(220, 900, 25, 4, 26, 2); label('2 de cada 1000', 540, 1060, P.mute, { s: 34 }); });
        fade(A(t, 1.6), () => M(R`250\% \t{ de } 20 = 2.5 · 20 = 50`, 540, 1300, 62, { id: 'a' }));
        fade(A(t, 10.0), () => M(R`0.2\% \t{ de } 5000 = 0.002 · 5000 = 10`, 540, 1440, 58, { id: 'b' }));
      } },
    { id: 'cabeza', name: 'De cabeza', dur: 33,
      caps: [[0.5, 9.0, 'EL 10 %', 'Se corre la coma', 'un lugar: 10 % de 360 = 36.'], [9.4, 18.0, 'EL 5 %', 'Es la mitad del 10 %:', '18.'],
        [18.4, 32.4, 'SUMANDO', R`$15\% = 10\% + 5\%$:`, '$36 + 18 = 54$.']],
      narr: [[0.5, 9.0, 'Algunos porcentajes salen de cabeza. El diez por ciento es dividir entre diez: correr la coma. El diez por ciento de trescientos sesenta es treinta y seis.'],
        [9.4, 18.0, 'El cinco por ciento es la mitad del diez: dieciocho.'],
        [18.4, 32.4, 'Y con eso se arma el quince por ciento: diez más cinco, treinta y seis más dieciocho, cincuenta y cuatro. Es la propiedad distributiva otra vez.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'cut'], [18.8, 'card']],
      draw(t) {
        const w = 720; rect(180, 620, w, 90, { r: 10, w: 4 }); M('360', 540, 600, 46, { pass: true });
        bar(180, 620, w * .1, 90, { k: draw(t, 1.0, 1.0), label: '36', s: 34 }); fade(A(t, 9.8), () => bar(180 + w * .1, 620, w * .05, 90, { label: '18', s: 30, a: .3 }));
        fade(A(t, 18.8), () => brace(180, 180 + w * .15, 740, { label: '15 % = 54', k: 1, s: 40 }));
        fade(A(t, 1.6), () => M(R`10\% \t{ de } 360 = 36`, 540, 1300, 66, { id: 'a' }));
        fade(A(t, 10.0), () => M(R`5\% \t{ de } 360 = 18`, 540, 1420, 66, { id: 'b' }));
        fade(A(t, 18.8), () => M(R`15\% = 36 + 18 = \hl{54}`, 540, 1560, 70, { id: 'c' }));
      } },
    { id: 'todo', name: 'El todo es el 100 %', dur: 28,
      caps: [[0.5, 9.0, 'UNA ENCUESTA', 'Fútbol 45 %, música 30 %', 'y lectura 25 %.'], [9.4, 18.0, 'SUMAN 100 %', 'Si las opciones no se', 'repiten, completan el todo.'],
        [18.4, 27.4, 'CON 60 PERSONAS', 'El 45 % son 27,', 'el 30 % 18 y el 25 % 15.']],
      narr: [[0.5, 9.0, 'En una encuesta sobre el pasatiempo favorito, el cuarenta y cinco por ciento eligió fútbol, el treinta música y el veinticinco lectura.'],
        [9.4, 18.0, 'Como cada persona eligió una sola opción, los porcentajes suman cien: juntos son el todo.'],
        [18.4, 27.4, 'Si respondieron sesenta personas, se multiplica: veintisiete, dieciocho y quince. Y también suman sesenta.']],
      ev: [[1.0, 'draw', 1.0], [2.0, 'draw', 1.0], [3.0, 'draw', 1.0], [9.8, 'card'], [18.8, 'pops', 3]],
      draw(t) {
        const w = 780, x0 = 150, parts = [[45, 'fútbol', .75], [30, 'música', .45], [25, 'lectura', .2]]; let acc = 0;
        parts.forEach(([p, s, a], i) => { const x = x0 + w * acc / 100; bar(x, 640, w * p / 100, 110, { k: draw(t, 1.0 + i, 1.0), label: p + R`\%`, a, s: 44 }); fade(A(t, 1.6 + i), () => label(s, x + w * p / 200, 610, P.ink, { s: 36 })); fade(A(t, 18.8 + i * .4), () => M(String([27, 18, 15][i]), x + w * p / 200, 830, 56, { c: P.ac, pass: true })); acc += p; });
        fade(A(t, 9.8), () => brace(x0, x0 + w, 880, { label: '100 %', k: 1, s: 46 }));
        fade(A(t, 10.2), () => M(R`45\% + 30\% + 25\% = 100\%`, 540, 1340, 66, { id: 's' }));
        fade(A(t, 19.6), () => M(R`27 + 18 + 15 = 60`, 540, 1480, 66, { id: 'n' }));
      } },
  ],
  sum: [['Porcentaje', R`p\% = \frac{p}{100}`], ['Conocidos', R`\frac{1}{2} = 50\% \quad \frac{1}{4} = 25\% \quad \frac{1}{5} = 20\%`], ['Las tres preguntas', R`\frac{\t{parte}}{\t{todo}} = \frac{p}{100}`], ['Más de 100 y menos de 1', R`250\% = 2.5 \qquad 0.2\% = 0.002`], ['De cabeza', R`15\% = 10\% + 5\%`]],
  end: ['Un porcentaje es una razón', 'con el todo puesto en cien.'],
  finNarr: [[0.8, 9.0, 'En resumen: un porcentaje es una fracción sobre cien, y tiene también su nombre decimal.'],
    [9.2, 16.0, 'Con la proporción parte sobre todo igual a p sobre cien se responde cualquier pregunta.']],
};
