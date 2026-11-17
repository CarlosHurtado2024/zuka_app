// Lección alg-14c · Progresiones geométricas (mundo Sucesiones y Series).
// Multiplicar siempre por r (5, 15, 45, 135); r fracción y r negativa; término general como potencia; sumar frente a
// multiplicar (recta frente a curva); hallar r con dos términos; medios geométricos (dos soluciones); una cadena de mensajes.
const R = String.raw;
const POSTER = 140;
const FILM = {
  lesson: 'alg-14c', world: 'progresiones', key: 'G', n: [3, 5],
  title: 'Progresiones geométricas',
  next: 'Suma geométrica y suma infinita',
  intro: 'Ahora, en vez de sumar siempre lo mismo, se multiplica siempre por lo mismo. Al principio parece parecido. Luego no.',
  examples: ['5, 15, 45, 135', '96, 48, 24', '1, −3, 9', '1215', 'a₂ = 12', 'entre 3 y 48', '1, 4, 16, 64'],
  scenes: [
    { id: 'razon', name: 'Multiplicar siempre', dur: 31,
      caps: [[0.5, 9.0, 'GEOMÉTRICA', '5, 15, 45, 135: cada término', 'es el anterior por 3.'], [9.4, 19.0, 'LA RAZÓN', R`$r = \frac{a_{n+1}}{a_{n}}$: el cociente`, 'entre dos seguidos.'],
        [19.4, 30.4, 'COMPROBAR', R`$\frac{15}{5} = \frac{45}{15} = \frac{135}{45} = 3$.`, '']],
      narr: [[0.5, 9.0, 'En la lista cinco, quince, cuarenta y cinco, ciento treinta y cinco, cada término es el anterior multiplicado por tres. Es una progresión geométrica.'],
        [9.4, 19.0, 'El número por el que se multiplica se llama razón, r. Es el cociente entre un término y el anterior.'],
        [19.4, 30.4, 'Para saber si una lista es geométrica, se divide cada término entre el anterior. Si siempre da lo mismo, lo es.']],
      ev: [[1.0, 'pops', 4], [9.8, 'rise'], [19.8, 'yes']],
      draw(t) {
        const vals = [5, 15, 45, 135]; vals.forEach((v, i) => fade(A(t, 1.0 + i * .5), () => { const s = 40 + Math.sqrt(v) * 22, x = 170 + i * 240 - s / 2 + 40; rect(x, 900 - s, s, s, { r: 8, w: 4, fill: .2 + i * .15 }); M(String(v), x + s / 2, 960, 46, { pass: true }); if (i) M('× 3', 170 + i * 240 - 80, 560, 38, { c: P.ac, pass: true }); }));
        fade(A(t, 9.8), () => M(R`r = \frac{a_{n+1}}{a_{n}}`, 540, 1240, 86, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`\frac{15}{5} = \frac{45}{15} = \frac{135}{45} = \hl{3}`, 540, 1440, 70, { id: 'c' }));
      } },
    { id: 'tipos', name: 'Razón fracción y negativa', dur: 32,
      caps: [[0.5, 9.0, 'r ENTRE 0 Y 1', '96, 48, 24, 12: la mitad', R`cada vez, $r = \frac{1}{2}$.`], [9.4, 19.0, 'SE ACHICA', 'Los términos se acercan a 0', 'sin llegar.'],
        [19.4, 31.4, 'r NEGATIVA', '1, $−3$, 9, $−27$: el signo', 'cambia cada vez, $r = −3$.']],
      narr: [[0.5, 9.0, 'La razón también puede ser una fracción. Noventa y seis, cuarenta y ocho, veinticuatro, doce: cada uno es la mitad del anterior.'],
        [9.4, 19.0, 'Con una razón entre cero y uno, los términos se achican y se acercan a cero, pero ninguno llega.'],
        [19.4, 31.4, 'Y puede ser negativa. Con razón menos tres: uno, menos tres, nueve, menos veintisiete. El signo cambia en cada paso.']],
      ev: [[1.0, 'pops', 5], [9.8, 'draw', 1.2], [19.8, 'pops', 4]],
      draw(t) {
        if (t < 19.4) { const X_ = axis({ x0: 110, x1: 960, y: 820, v0: 0, v1: 100, ticks: [0, 12, 24, 48, 96], k: 1, ls: 36 }); [96, 48, 24, 12, 6, 3].forEach((v, i) => fade(A(t, 1.0 + i * .3), () => { dot(X_(v), 820, { r: 12, c: P.ac }); if (i) hop(X_(2 * v), X_(v), 820, 1, { c: P.ac, h: 50 + v }); })); }
        else { const X_ = axis({ x0: 110, x1: 960, y: 820, v0: -30, v1: 12, ticks: [-27, -3, 0, 1, 9], k: 1, ls: 36 }); [1, -3, 9, -27].forEach((v, i) => fade(A(t, 19.8 + i * .5), () => { dot(X_(v), 820, { r: 13, c: v < 0 ? P.no : P.ac }); if (i) hop(X_(v / -3), X_(v), 820, 1, { c: P.mute, h: 80, below: i % 2 === 0 }); })); }
        fade(A(t, 1.2) * (1 - A(t, 19.2)), () => M(R`96, \; 48, \; 24, \; 12, \; … \qquad r = \frac{1}{2}`, 540, 1240, 66, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`1, \; −3, \; 9, \; −27, \; … \qquad r = −3`, 540, 1240, 66, { id: 'b' }));
      } },
    { id: 'general', name: 'El término general', dur: 35,
      caps: [[0.5, 9.0, 'MULTIPLICACIONES', 'Del primero al de puesto $n$', 'hay $n − 1$ veces $r$.'], [9.4, 19.0, 'LA FÓRMULA', R`$a_{n} = a_{1}\,r^{n−1}$:`, 'una potencia.'],
        [19.4, 34.4, 'EJEMPLO', 'El sexto de 5, 15, 45, …', '$5 · 3^{5} = 1215$.']],
      narr: [[0.5, 9.0, 'Como en la aritmética, del primero al término de puesto n hay n menos uno pasos. Pero cada paso multiplica por r.'],
        [9.4, 19.0, 'Multiplicar n menos uno veces por r es una potencia: a sub n es a sub uno por r a la n menos uno.'],
        [19.4, 34.4, 'El sexto término de cinco, quince, cuarenta y cinco: cinco por tres a la cinco, que es doscientos cuarenta y tres. Da mil doscientos quince.']],
      ev: [[1.0, 'pops', 5], [9.8, 'card'], [19.8, 'card']],
      draw(t) {
        for (let i = 0; i < 6; i++) fade(A(t, 1.0 + i * .2), () => { const x = 160 + i * 150; circ(x, 700, 44, { w: 4, fill: .2 }); M(`a_{${i + 1}}`, x, 716, 40, { pass: true }); if (i) M('×r', x - 75, 640, 32, { c: P.ac, pass: true }); });
        fade(A(t, 2.4), () => brace(160, 910, 780, { label: '5 multiplicaciones', k: 1, s: 36 }));
        fade(A(t, 9.8), () => M(R`a_{n} = a_{1}\,r^{\,n − 1}`, 540, 1100, 96, { id: 'f' }));
        fade(A(t, 19.8), () => M(R`a_{6} = 5 · 3^{5} = 5 · 243 = \hl{1215}`, 540, 1320, 70, { id: 'e' }));
      } },
    { id: 'comparar', name: 'Sumar o multiplicar', dur: 34,
      caps: [[0.5, 9.0, 'DOS LISTAS', 'Sumar 2: 2, 4, 6, 8, …', 'Por 2: 2, 4, 8, 16, …'], [9.4, 19.0, 'EN LA GRÁFICA', 'La aritmética sube en recta;', 'la geométrica, en curva.'],
        [19.4, 33.4, 'SIEMPRE GANA', 'Con $r > 1$, la geométrica', 'deja atrás a la otra.']],
      narr: [[0.5, 9.0, 'Dos listas que empiezan igual: dos, cuatro. Una suma dos cada vez; la otra multiplica por dos. Al tercer término ya se separan: seis frente a ocho.'],
        [9.4, 19.0, 'Dibujadas, la aritmética sube en línea recta. La geométrica sube en curva, cada vez más empinada.'],
        [19.4, 33.4, 'Con una razón mayor que uno, la geométrica siempre termina dejando atrás a cualquier aritmética. Al décimo término: veinte frente a mil veinticuatro.']],
      ev: [[1.0, 'pops', 6], [9.8, 'draw', 1.6], [19.8, 'card']],
      draw(t) {
        const Pl = plane({ ox: 170, oy: 1180, sx: 120, sy: 18, x0: 0, x1: 6.6, y0: 0, y1: 36, k: A(t, 1.0, .8), xt: [1, 2, 3, 4, 5, 6], yt: [8, 16, 32] });
        for (let n = 1; n <= 6; n++) { fade(A(t, 1.6 + n * .3), () => dot(Pl.X(n), Pl.Y(2 * n), { r: 11, c: P.mute })); if (n <= 5) fade(A(t, 1.8 + n * .3), () => dot(Pl.X(n), Pl.Y(Math.pow(2, n)), { r: 12, c: P.ac })); }
        plot(x => 2 * x, .5, 6.4, Pl, { k: draw(t, 9.8, 1.6), c: P.mute, w: 4 }); plot(x => Math.pow(2, x), .5, 5.2, Pl, { k: draw(t, 10.4, 1.6), w: 5 });
        fade(A(t, 19.8), () => M(R`a_{10}: \quad 20 \quad \t{frente a} \quad 2^{10} = 1024`, 540, 1400, 62, { id: 'c' }));
      } },
    { id: 'dos', name: 'Con dos términos', dur: 31,
      caps: [[0.5, 9.0, 'DOS DATOS', '$a_{2} = 12$ y $a_{5} = 324$.', ''], [9.4, 19.0, 'TRES MULTIPLICACIONES', R`Del 2 al 5: $r^{3} = \frac{324}{12} = 27$.`, ''],
        [19.4, 30.4, 'RESULTADO', R`$r = 3$ y $a_{1} = \frac{12}{3} = 4$.`, '']],
      narr: [[0.5, 9.0, 'Con dos términos se reconstruye también la geométrica. El segundo es doce y el quinto, trescientos veinticuatro.'],
        [9.4, 19.0, 'Del puesto dos al cinco hay tres multiplicaciones por r. Entonces r al cubo es trescientos veinticuatro entre doce: veintisiete.'],
        [19.4, 30.4, 'La razón es tres, la raíz cúbica de veintisiete. Y el primero es doce entre tres: cuatro.']],
      ev: [[1.0, 'pops', 2], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        for (let i = 0; i < 5; i++) { const x = 160 + i * 190, known = i === 1 || i === 4; fade(A(t, known ? 1.0 : 19.8 + i * .2), () => { circ(x, 700, 60, { w: 4, fill: known ? .45 : .15 }); M(String([4, 12, 36, 108, 324][i]), x, 718, 42, { pass: true }); M(`a_{${i + 1}}`, x, 610, 36, { c: P.mute, pass: true }); }); if (i >= 2) fade(A(t, 9.8 + (i - 2) * .4), () => M('×r', x - 95, 800, 36, { c: P.ac, pass: true })); }
        fade(A(t, 9.8), () => M(R`r^{3} = \frac{324}{12} = 27`, 540, 1100, 76, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`r = \sqrt[3]{27} = \hl{3} \qquad a_{1} = \frac{12}{3} = \hl{4}`, 540, 1280, 66, { id: 'b' }));
      } },
    { id: 'medios', name: 'Medios geométricos', dur: 33,
      caps: [[0.5, 9.0, 'TRES ENTRE 3 Y 48', 'Cuatro multiplicaciones:', R`$r^{4} = \frac{48}{3} = 16$.`], [9.4, 19.0, '!DOS RESPUESTAS', '$r = 2$ o $r = −2$:', 'los dos a la cuarta dan 16.'],
        [19.4, 32.4, 'LOS MEDIOS', '6, 12, 24', 'o $−6$, 12, $−24$.']],
      narr: [[0.5, 9.0, 'Para poner tres medios geométricos entre tres y cuarenta y ocho, hay cuatro multiplicaciones: r a la cuarta es dieciséis.'],
        [9.4, 19.0, 'Aquí hay una sorpresa: dos a la cuarta es dieciséis, pero menos dos a la cuarta también.'],
        [19.4, 32.4, 'Con razón dos, los medios son seis, doce y veinticuatro. Con razón menos dos, son menos seis, doce y menos veinticuatro. Las dos listas sirven.']],
      ev: [[1.0, 'rise'], [9.8, 'doubt'], [19.8, 'pops', 3], [22.0, 'pops', 3]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`3, \; …, \; …, \; …, \; 48`, 540, 680, 70, { id: 'q' }));
        fade(A(t, 2.4), () => M(R`r^{4} = 16`, 540, 840, 76, { id: 'r4' }));
        fade(A(t, 9.8), () => M(R`2^{4} = 16 \qquad (−2)^{4} = 16`, 540, 1000, 66, { id: 'dos' }));
        fade(A(t, 19.8), () => M(R`3, \; \hl{6, \; 12, \; 24}, \; 48`, 540, 1220, 70, { id: 'm1' }));
        fade(A(t, 22.0), () => M(R`3, \; \hl{−6, \; 12, \; −24}, \; 48`, 540, 1360, 70, { id: 'm2' }));
      } },
    { id: 'mensajes', name: 'Una cadena de mensajes', dur: 30,
      caps: [[0.5, 9.0, 'UN MENSAJE', 'Cada persona lo reenvía', 'a 4 nuevas.'], [9.4, 19.0, 'POR RONDAS', '1, 4, 16, 64, …:', 'geométrica con $r = 4$.'],
        [19.4, 29.4, 'EN LA RONDA 10', R`$4^{9} = 262\,144$ personas`, 'nuevas en una sola ronda.']],
      narr: [[0.5, 9.0, 'Una persona envía un mensaje a cuatro amigas, y cada una lo reenvía a cuatro personas nuevas.'],
        [9.4, 19.0, 'Por rondas llegan uno, cuatro, dieciséis, sesenta y cuatro: una progresión geométrica de razón cuatro.'],
        [19.4, 29.4, 'En la décima ronda lo reciben cuatro a la nueve personas nuevas: más de doscientas sesenta mil. Así se esparcen los rumores.']],
      ev: [[1.0, 'pop'], [3.0, 'pops', 4], [5.0, 'pops', 6], [19.8, 'card']],
      draw(t) {
        const cx = 540, cy = 860; dot(cx, cy, { r: 16, c: P.ac });
        for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + .4, x1 = cx + Math.cos(a) * 130, y1 = cy + Math.sin(a) * 130; fade(A(t, 3.0 + i * .1), () => { line(cx, cy, x1, y1, { w: 3, c: hexA(P.ac, .6) }); dot(x1, y1, { r: 12, c: P.ac }); });
          for (let j = 0; j < 4; j++) { const b = a + (j - 1.5) * .35, x2 = x1 + Math.cos(b) * 130, y2 = y1 + Math.sin(b) * 130; fade(A(t, 5.0 + (i * 4 + j) * .06), () => { line(x1, y1, x2, y2, { w: 2, c: hexA(P.ac, .4) }); dot(x2, y2, { r: 8, c: hexA(P.ac, .8) }); }); } }
        fade(A(t, 9.8), () => M(R`1, \; 4, \; 16, \; 64, \; …`, 540, 1300, 70, { id: 'l' }));
        fade(A(t, 19.8), () => M(R`a_{10} = 4^{9} = \hl{262\,144}`, 540, 1460, 72, { id: 'r' }));
      } },
  ],
  sum: [['Geométrica', R`a_{n+1} = a_{n} · r`], ['Razón', R`r = \frac{a_{n+1}}{a_{n}}`], ['Término general', R`a_{n} = a_{1}\,r^{\,n − 1}`], ['Con dos términos', R`r^{3} = \frac{a_{5}}{a_{2}}`], ['Medios', R`r^{4} = 16 \;⇒\; r = ±2`]],
  end: ['Multiplicar siempre lo mismo', 'es crecer cada vez más rápido.'],
  finNarr: [[0.8, 9.0, 'En resumen: una progresión geométrica multiplica siempre por la misma razón, y su término general es una potencia.'],
    [9.2, 16.0, 'La razón puede ser fracción o negativa, y con razón mayor que uno crece cada vez más rápido.']],
};
