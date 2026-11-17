// Lección alg-101 · Sistemas de ecuaciones lineales (mundo Fracciones Algebraicas).
// Jugos y empanadas (x + 2y = 10, 2x + 3y = 17); una ecuación es una recta de soluciones; la solución es el corte; reducción;
// sustitución; paralelas o la misma recta; tres incógnitas escalonadas.
const R = String.raw;
const POSTER = 100;
const pl = (k = 1) => plane({ ox: 230, oy: 1130, sx: 68, sy: 80, x0: -1, x1: 10.8, y0: -1, y1: 7, k, grid: true, xt: [2, 4, 6, 8, 10], yt: [1, 2, 3, 4, 5, 6] });
const L1 = x => (10 - x) / 2, L2 = x => (17 - 2 * x) / 3;
const FILM = {
  lesson: 'alg-101', world: 'racionales', key: 'Bb', n: [3, 4],
  title: 'Sistemas de ecuaciones lineales',
  next: 'Sistemas no lineales y fracciones parciales',
  intro: 'Con una sola pista hay muchas respuestas. Con dos pistas, casi siempre, una sola. Así funcionan los sistemas de ecuaciones.',
  examples: ['x + 2y = 10', '2x + 3y = 17', 'jugo', 'empanada', 'x + 2y + z = 12'],
  scenes: [
    { id: 'problema', name: 'Dos pistas', dur: 31,
      caps: [[0.5, 9.0, 'UNA CAFETERÍA', 'Un jugo y dos empanadas:', '10 mil pesos.'], [9.4, 19.0, 'OTRA CUENTA', 'Dos jugos y tres empanadas:', '17 mil.'],
        [19.4, 30.4, 'EL SISTEMA', '$x + 2y = 10$ y $2x + 3y = 17$,', 'en miles de pesos.']],
      narr: [[0.5, 9.0, 'En una cafetería, un jugo y dos empanadas cuestan diez mil pesos.'],
        [9.4, 19.0, 'Otra cuenta dice que dos jugos y tres empanadas cuestan diecisiete mil.'],
        [19.4, 30.4, 'Si x es el precio del jugo e y el de la empanada, en miles, hay dos ecuaciones que se cumplen a la vez: un sistema.']],
      ev: [[1.0, 'pops', 3], [9.8, 'pops', 5], [19.8, 'card']],
      draw(t) {
        const cup = (x, y) => { poly([[x - 34, y - 50], [x + 34, y - 50], [x + 26, y + 40], [x - 26, y + 40]], { w: 4, fill: .5 }); };
        const emp = (x, y) => { X.save(); X.beginPath(); X.ellipse(x, y, 52, 30, 0, Math.PI, 0); X.closePath(); X.fillStyle = hexA(P.ink, .25); X.fill(); X.strokeStyle = P.ink; X.lineWidth = 4; X.stroke(); X.restore(); };
        fade(A(t, 1.0), () => { cup(200, 640); emp(340, 660); emp(470, 660); M('= 10', 620, 670, 60, { a: 'l', pass: true }); });
        fade(A(t, 9.8), () => { cup(200, 860); cup(290, 860); emp(420, 880); emp(550, 880); emp(680, 880); M('= 17', 780, 890, 60, { a: 'l', pass: true }); });
        fade(A(t, 19.8), () => { M(R`x + 2y = 10`, 540, 1180, 76, { id: 'e1' }); M(R`2x + 3y = 17`, 540, 1300, 76, { id: 'e2' }); });
      } },
    { id: 'recta', name: 'Una recta de soluciones', dur: 32,
      caps: [[0.5, 9.0, 'UNA SOLA PISTA', '$x + 2y = 10$ tiene muchas', 'soluciones: $(10, 0)$, $(4, 3)$, …'], [9.4, 19.0, 'FORMAN UNA RECTA', 'Todas las parejas que', 'cumplen quedan alineadas.'],
        [19.4, 31.4, 'LA OTRA PISTA', 'Es otra recta.', '']],
      narr: [[0.5, 9.0, 'Con la primera cuenta sola hay muchas posibilidades: jugo a diez y empanada gratis, jugo a cuatro y empanada a tres, ocho y uno…'],
        [9.4, 19.0, 'Todas esas parejas, dibujadas como puntos, quedan sobre una recta. Una ecuación lineal es una recta de soluciones.'],
        [19.4, 31.4, 'La segunda cuenta es otra recta, con sus propias soluciones.']],
      ev: [[1.0, 'pops', 4], [9.8, 'draw', 1.4], [19.8, 'draw', 1.4]],
      draw(t) {
        const Pl = pl(1);
        [[10, 0], [8, 1], [6, 2], [4, 3]].forEach(([x, y], i) => fade(A(t, 1.0 + i * .5), () => dot(Pl.X(x), Pl.Y(y), { r: 12, c: P.ac })));
        plot(L1, -.5, 10.5, Pl, { k: draw(t, 9.8, 1.4), c: P.ac });
        plot(L2, -.5, 8.8, Pl, { k: draw(t, 19.8, 1.4), c: P.mute, ymin: -1 });
        fade(A(t, 11.0), () => M(R`x + 2y = 10`, Pl.X(10.4), Pl.Y(.6) - 20, 40, { a: 'r', c: P.ac, pass: true }));
        fade(A(t, 21.0), () => M(R`2x + 3y = 17`, Pl.X(.2), Pl.Y(6.2), 40, { a: 'l', pass: true }));
      } },
    { id: 'corte', name: 'Donde se cortan', dur: 30,
      caps: [[0.5, 9.0, 'LAS DOS A LA VEZ', 'La solución está en', 'las dos rectas.'], [9.4, 19.0, 'EL CORTE', '$(4, 3)$: jugo a 4 mil,', 'empanada a 3 mil.'],
        [19.4, 29.4, 'COMPROBAR', '$4 + 6 = 10$ y', '$8 + 9 = 17$.']],
      narr: [[0.5, 9.0, 'La solución del sistema tiene que cumplir las dos ecuaciones: estar en las dos rectas a la vez.'],
        [9.4, 19.0, 'Eso pasa solo en el punto donde se cortan: cuatro, tres. El jugo cuesta cuatro mil y la empanada tres mil.'],
        [19.4, 29.4, 'Se comprueba en las dos cuentas: cuatro más seis, diez; ocho más nueve, diecisiete.']],
      ev: [[1.0, 'rise'], [9.8, 'pop'], [19.8, 'yes']],
      draw(t) {
        const Pl = pl(1); plot(L1, -.5, 10.5, Pl, { c: P.ac }); plot(L2, -.5, 8.8, Pl, { c: P.mute, ymin: -1 });
        fade(A(t, 9.8), () => { dot(Pl.X(4), Pl.Y(3), { r: 16, c: P.ac, ping: ping(t, 9.8) }); M('(4, 3)', Pl.X(4) + 30, Pl.Y(3) - 30, 44, { a: 'l', c: P.ac, pass: true }); });
        fade(A(t, 19.8), () => M(R`4 + 2 · 3 = 10 \qquad 2 · 4 + 3 · 3 = 17`, 540, 1340, 56, { id: 'c' }));
      } },
    { id: 'reduccion', name: 'Reducción', dur: 34,
      caps: [[0.5, 9.0, 'SIN DIBUJAR', 'Se multiplica la primera', 'por 2: $2x + 4y = 20$.'], [9.4, 19.0, 'SE RESTAN', 'Las $x$ se van:', '$y = 3$.'],
        [19.4, 33.4, 'Y LA OTRA', 'En $x + 2y = 10$:', '$x = 10 − 6 = 4$.']],
      narr: [[0.5, 9.0, 'Sin dibujar, un método es la reducción. Se multiplica la primera ecuación por dos para igualar las x: dos x más cuatro y, veinte.'],
        [9.4, 19.0, 'Al restarle la segunda, las x desaparecen: cuatro y menos tres y es y; veinte menos diecisiete es tres.'],
        [19.4, 33.4, 'Con y igual a tres se vuelve a una de las ecuaciones: x más seis es diez, así que x es cuatro.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => { M(R`2x + 4y = 20`, 540, 640, 70, { id: 'a' }); M(R`2x + 3y = 17`, 540, 760, 70, { id: 'b' }); });
        fade(A(t, 9.8), () => { line(300, 800, 780, 800, { w: 4 }); M('−', 260, 700, 70, { pass: true }); M(R`\no{0x} + y = 3`, 540, 880, 70, { id: 'c' }); });
        fade(A(t, 19.8), () => M(R`x + 2 · 3 = 10 \;⇒\; x = \hl{4}`, 540, 1080, 70, { id: 'd' }));
      } },
    { id: 'sustitucion', name: 'Sustitución', dur: 31,
      caps: [[0.5, 9.0, 'DESPEJAR', 'De la primera:', '$x = 10 − 2y$.'], [9.4, 19.0, 'REEMPLAZAR', 'En la segunda:', '$2(10 − 2y) + 3y = 17$.'],
        [19.4, 30.4, 'UNA SOLA INCÓGNITA', '$20 − y = 17$, así', 'que $y = 3$.']],
      narr: [[0.5, 9.0, 'Otro camino es la sustitución. De la primera ecuación se despeja x: diez menos dos y.'],
        [9.4, 19.0, 'Esa expresión se pone en lugar de x en la segunda. Ahora hay una sola incógnita.'],
        [19.4, 30.4, 'Veinte menos cuatro y más tres y es veinte menos y, igual a diecisiete: y es tres. Los dos métodos coinciden.']],
      ev: [[1.0, 'rise'], [9.8, 'fly', 1.0], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x = 10 − 2y`, 540, 660, 76, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`2\hl{(10 − 2y)} + 3y = 17`, 540, 840, 76, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`20 − y = 17 \;⇒\; y = \hl{3}`, 540, 1020, 76, { id: 'c' }));
      } },
    { id: 'casos', name: 'Ninguna o infinitas', dur: 32,
      caps: [[0.5, 9.0, '!PARALELAS', '$x + 2y = 10$ y $x + 2y = 4$:', 'nunca se cortan.'], [9.4, 19.0, 'SIN SOLUCIÓN', 'Restando sale $0 = 6$:', 'no hay solución.'],
        [19.4, 31.4, 'LA MISMA RECTA', '$x + 2y = 10$ y $2x + 4y = 20$:', 'infinitas soluciones.']],
      narr: [[0.5, 9.0, 'No siempre hay un solo corte. Si las dos rectas son paralelas, como estas dos, no se cortan nunca.'],
        [9.4, 19.0, 'Al restar sale cero igual a seis: una contradicción. El sistema no tiene solución.'],
        [19.4, 31.4, 'Y si una ecuación es la otra multiplicada, son la misma recta: todos sus puntos son solución.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'no'], [19.8, 'draw', 1.4]],
      draw(t) {
        const Pl = pl(1);
        if (t < 19.4) { plot(L1, -.5, 10.5, Pl, { c: P.ac }); plot(x => (4 - x) / 2, -1, 4.5, Pl, { k: draw(t, 1.0, 1.4), c: P.no, ymin: -1 }); }
        else { plot(L1, -.5, 10.5, Pl, { c: P.ac, w: 12 }); plot(L1, -.5, 10.5, Pl, { k: draw(t, 19.8, 1.4), c: P.ink, w: 4, dash: [14, 12] }); }
        fade(A(t, 9.8) * (1 - A(t, 19.2)), () => M(R`0 = 6 \;\no{\t{imposible}}`, 540, 1340, 70, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`2x + 4y = 20 \;⇔\; x + 2y = 10`, 540, 1340, 62, { id: 'b' }));
      } },
    { id: 'tres', name: 'Tres incógnitas', dur: 35,
      caps: [[0.5, 9.0, 'UNA ESCALERA', 'Con tres incógnitas se busca', 'una forma escalonada.'], [9.4, 19.0, 'DE ABAJO HACIA ARRIBA', '$3z = 9$ da $z = 3$;', 'luego $y = 4$.'],
        [19.4, 34.4, 'ARRIBA', '$x + 8 + 3 = 12$:', '$x = 1$.']],
      narr: [[0.5, 9.0, 'Con tres incógnitas la idea es la misma: eliminar hasta llegar a una escalera, donde la última ecuación tiene una sola letra.'],
        [9.4, 19.0, 'Se resuelve de abajo hacia arriba. Tres z es nueve, z es tres. Luego y menos tres es uno: y es cuatro.'],
        [19.4, 34.4, 'Arriba, x más dos por cuatro más tres es doce: x es uno. Cada escalón usa lo que ya se encontró.']],
      ev: [[1.0, 'pops', 3], [9.8, 'card'], [12.4, 'card'], [19.8, 'yes']],
      draw(t) {
        const rows = [[R`x + 2y + z = 12`, 0], [R`y − z = 1`, 1], [R`3z = 9`, 2]];
        rows.forEach(([s, i]) => fade(A(t, 1.0 + i * .4), () => { rect(150 + i * 120, 560 + i * 150, 780 - i * 240, 110, { r: 14, w: 3, fill: .08 }); M(s, 540 + i * 0, 632 + i * 150, 62, { id: 'r' + i }); }));
        fade(A(t, 9.8), () => M(R`z = 3`, 900, 940, 56, { a: 'r', c: P.ac, pass: true }));
        fade(A(t, 12.4), () => M(R`y = 4`, 900, 790, 56, { a: 'r', c: P.ac, pass: true }));
        fade(A(t, 19.8), () => M(R`x = 1`, 900, 640, 56, { a: 'r', c: P.ac, pass: true }));
        fade(A(t, 20.4), () => M(R`(x, y, z) = (1, 4, 3)`, 540, 1180, 70, { id: 's' }));
      } },
  ],
  sum: [['Sistema', R`x + 2y = 10, \;\; 2x + 3y = 17`], ['Solución', R`\t{el corte de las rectas: } (4, 3)`], ['Reducción y sustitución', R`\t{eliminar una incógnita}`], ['Casos', R`\t{paralelas: ninguna} \quad \t{la misma: infinitas}`], ['Tres incógnitas', R`\t{escalonar y subir}`]],
  end: ['Dos pistas, dos rectas:', 'la respuesta está en el cruce.'],
  finNarr: [[0.8, 9.0, 'En resumen: cada ecuación lineal es una recta, y la solución del sistema es donde se cortan.'],
    [9.2, 16.0, 'Se resuelve eliminando una incógnita, y puede no haber solución o haber infinitas.']],
};
