// Lección alg-12c · Consecuencias de los axiomas: restar, dividir y los signos (mundo La Recta Real).
// Restar = sumar el opuesto; dividir = multiplicar por el recíproco; por qué no se divide entre 0; a · 0 = 0 demostrado;
// la ley de los signos (patrón y regla); la cancelativa (y su trampa con el 0); resolver una ecuación justificando cada paso.
const R = String.raw;
const POSTER = 150;
const FILM = {
  lesson: 'alg-12c', world: 'numeros', key: 'A', n: [5, 6],
  title: 'Consecuencias de los axiomas: restar, dividir y los signos',
  next: 'Axiomas de orden y valor absoluto',
  intro: 'Los axiomas explican lo que se aprende de memoria: por qué menos por menos da más, y no se divide entre cero.',
  examples: ['9 − 4', '12 ÷ 3', '15/8', '3x + 5 = 20', '6 ÷ 0', '0 · 5 = 0 · 7'],
  scenes: [
    { id: 'restar', name: 'Restar', dur: 30,
      caps: [[0.5, 9.0, 'RESTAR', 'Restar es sumar', 'el opuesto.'], [9.4, 19.0, 'EN LA RECTA', '$9 − 4$ y $9 + (−4)$: los', 'dos caminos llegan al 5.'],
        [19.4, 29.4, 'POR ESO', 'La resta no necesita', 'axiomas propios.']],
      narr: [[0.5, 9.0, 'Los axiomas solo hablan de sumar y multiplicar. La resta se define con el opuesto: a menos b es a más el opuesto de b.'],
        [9.4, 19.0, 'Nueve menos cuatro, o nueve más menos cuatro: en la recta, los dos caminos son cuatro pasos a la izquierda desde el nueve. Llegan al cinco.'],
        [19.4, 29.4, 'Por eso todo lo que sabemos de la suma sirve también para la resta: es una suma disfrazada.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.6], [12.2, 'draw', 1.6], [14.0, 'yes']],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: 860, v0: 0, v1: 10, ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], k: 1, ls: 40 });
        dot(X_(9), 860, { r: 13 });
        if (t > 9.4) { hop(X_(9), X_(5), 860, draw(t, 9.8, 1.6), { c: P.ac, label: R`−4`, h: 160 }); hop(X_(9), X_(5), 860, draw(t, 12.2, 1.6), { c: P.mute, label: R`+(−4)`, h: 160, below: true }); fade(A(t, 14.0), () => dot(X_(5), 860, { r: 13, c: P.ac, ping: ping(t, 14.0) })); }
        fade(A(t, 1.0), () => M(R`a − b = a + (−b)`, 540, 1340, 86, { id: 'def' }));
        fade(A(t, 9.8), () => M(R`9 − 4 = 9 + (−4) = \hl{5}`, 540, 1500, 76, { id: 'ej' }));
      } },
    { id: 'dividir', name: 'Dividir', dur: 33,
      caps: [[0.5, 9.0, 'DIVIDIR', 'Dividir es multiplicar', 'por el recíproco.'], [9.4, 19.0, 'EJEMPLO', '$12 ÷ 3$ es tomar', 'un tercio de 12.'],
        [19.4, 32.4, 'CON FRACCIONES', 'Se voltea la segunda', 'y se multiplica.']],
      narr: [[0.5, 9.0, 'Con la división pasa lo mismo: a entre b es a por el recíproco de b, uno sobre b. Siempre que b no sea cero.'],
        [9.4, 19.0, 'Doce entre tres es doce por un tercio: se reparten los doce en tres grupos iguales y se toma uno. Son cuatro.'],
        [19.4, 32.4, 'Por eso, para dividir fracciones se multiplica por la segunda volteada. Tres cuartos entre dos quintos es tres cuartos por cinco medios: quince octavos.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 12], [12.4, 'cut'], [20.0, 'shuffle', 1.2]],
      draw(t) {
        if (t < 19.4) { for (let i = 0; i < 12; i++) { const g = Math.floor(i / 4), j = i % 4, sep = eio(seg(t, 12.4, 13.6)); const x = 260 + i * 50 + g * 70 * sep, y = 760; fade(A(t, 9.8 + i * .08, .3), () => circ(x, y, 20, { fill: g === 0 && t > 14 ? .7 : .25, w: 4 })); }
          fade(A(t, 14.0), () => { brace(250, 450, 800, { label: '4', m: true, k: 1, s: 50 }); label('un tercio', 350, 960, P.ac, { s: 38 }); }); }
        else { const fl = eio(seg(t, 20.0, 21.2)); fade(A(t, 19.6), () => { M(R`\frac{3}{4} ÷ \frac{2}{5}`, 540, 740, 92, { id: 'q' }); X.save(); X.translate(540, 980); X.scale(1, Math.cos(fl * Math.PI) || .001); M(fl < .5 ? R`\frac{2}{5}` : R`\frac{5}{2}`, 0, 30, 92, { c: P.ac, pass: true }); X.restore(); }); }
        fade(A(t, 1.0), () => M(R`a ÷ b = a · \frac{1}{b} \quad (b ≠ 0)`, 540, 1340, 76, { id: 'def' }));
        fade(A(t, 9.8) * (1 - A(t, 19.2)), () => M(R`12 ÷ 3 = 12 · \frac{1}{3} = \hl{4}`, 540, 1500, 76, { id: 'ej' }));
        fade(A(t, 21.4), () => M(R`\frac{3}{4} ÷ \frac{2}{5} = \frac{3}{4} · \hl{\frac{5}{2}} = \frac{15}{8}`, 540, 1500, 72, { id: 'fr' }));
      } },
    { id: 'cero', name: 'No se divide entre cero', dur: 35,
      caps: [[0.5, 9.0, 'DIVIDIR ES DESHACER', '$6 ÷ 2 = 3$ porque', '$3 · 2 = 6$.'], [9.4, 19.0, '!6 ÷ 0', 'Habría que encontrar $x$', 'con $x · 0 = 6$: no existe.'],
        [19.4, 27.0, '!0 ÷ 0', 'Cualquier $x$ cumple $x · 0 = 0$:', 'no hay una sola respuesta.'], [27.4, 34.4, 'CONCLUSIÓN', 'Dividir entre 0', 'no está definido.']],
      narr: [[0.5, 9.0, 'Dividir es deshacer una multiplicación. Seis entre dos da tres, porque tres por dos da seis.'],
        [9.4, 19.0, 'Seis entre cero tendría que ser un número que, multiplicado por cero, dé seis. Pero cualquier número por cero da cero. No hay ninguno.'],
        [19.4, 27.0, 'Y cero entre cero tiene el problema contrario: cualquier número por cero da cero, así que todos servirían. No hay una respuesta única.'],
        [27.4, 34.4, 'En los dos casos la división no tiene sentido. Por eso se dice que dividir entre cero no está definido.']],
      ev: [[1.0, 'rise'], [9.8, 'doubt'], [12.0, 'no'], [19.8, 'pops', 5], [27.8, 'card']],
      draw(t) {
        fade(A(t, .8) * (1 - A(t, 9.2)), () => { M(R`6 ÷ 2 = 3`, 540, 700, 96, { id: 'a' }); M(R`3 · 2 = 6`, 540, 860, 96, { id: 'b', c: P.ac }); });
        if (t > 9.4 && t < 19.4) { M(R`6 ÷ 0 = x \;\; ⇒ \;\; x · 0 = 6`, 540, 700, 72, { id: 'c' }); [1, 5, -3, 100].forEach((v, i) => fade(A(t, 10.4 + i * .5), () => { M(`${v < 0 ? '−' + -v : v} · 0 = 0`, 300 + (i % 2) * 480, 860 + Math.floor(i / 2) * 110, 60, { pass: true }); mark(470 + (i % 2) * 480, 840 + Math.floor(i / 2) * 110, 22, false); })); }
        if (t > 19.4) { M(R`0 ÷ 0 = x \;\; ⇒ \;\; x · 0 = 0`, 540, 700, 72, { id: 'd' }); [1, 5, -3, 100].forEach((v, i) => fade(A(t, 19.8 + i * .4), () => { M(`${v < 0 ? '−' + -v : v} · 0 = 0`, 300 + (i % 2) * 480, 860 + Math.floor(i / 2) * 110, 60, { pass: true }); mark(470 + (i % 2) * 480, 840 + Math.floor(i / 2) * 110, 22, true); })); }
        fade(A(t, 27.8), () => M(R`\frac{a}{0} \;\; \no{\t{no está definido}}`, 540, 1400, 80, { id: 'nd' }), (1 - A(t, 27.8)) * 14);
      } },
    { id: 'porcero', name: 'Por qué a · 0 = 0', dur: 35,
      caps: [[0.5, 9.0, 'UN TRUCO', '$0 = 0 + 0$, por el', 'neutro de la suma.'], [9.4, 19.0, 'DISTRIBUTIVA', '$a · 0 = a · 0 + a · 0$', '(la misma cosa dos veces).'],
        [19.4, 27.0, 'SE CANCELA', 'Se suma el opuesto', 'de $a · 0$ a los dos lados.'], [27.4, 34.4, 'QUEDA', '$0 = a · 0$: no hay que', 'aprenderlo de memoria.']],
      narr: [[0.5, 9.0, 'Que todo número por cero dé cero también se demuestra. El truco es escribir el cero como cero más cero.'],
        [9.4, 19.0, 'Entonces a por cero es a por cero más cero, y por la distributiva, a por cero más a por cero.'],
        [19.4, 27.0, 'Hay una misma cantidad a cada lado, y a la derecha está dos veces. Se le suma su opuesto a los dos lados.'],
        [27.4, 34.4, 'Queda cero igual a a por cero. Salió de los axiomas, paso a paso.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'cut'], [27.8, 'card']],
      draw(t) {
        const st = 1 + (t > 9.8) + (t > 13.0) + (t > 19.8) + (t > 27.8);
        const rows = [[R`a · 0 = a · (0 + 0)`, 'neutro'], [R`a · 0 = a · 0 + a · 0`, 'distributiva'], [R`a · 0 \hl{+ (−a · 0)} = a · 0 + a · 0 \hl{+ (−a · 0)}`, 'sumar el opuesto'], [R`\hl{0 = a · 0}`, 'inversos y neutro']];
        rows.forEach(([r, why], i) => { const t0 = [1.0, 9.8, 19.8, 27.8][i]; fade(A(t, t0), () => { M(r, 540, 620 + i * 180, i === 2 ? 46 : 68, { id: 'r' + i }); label(why, 540, 690 + i * 180, P.mute, { s: 34 }); }, (1 - A(t, t0)) * 14); });
        void st;
      } },
    { id: 'signos', name: 'La ley de los signos', dur: 42,
      caps: [[0.5, 10.0, 'UN PATRÓN', 'Multiplicar por $−2$ y bajar', 'el primer número de a uno.'], [10.4, 20.0, 'CADA PASO SUBE 2', 'Al pasar el cero,', 'los resultados son positivos.'],
        [20.4, 30.0, 'LA LEY', 'Signos distintos dan $−$;', 'signos iguales dan $+$.'], [30.4, 41.4, 'EN EL FONDO', '$−a$ es $(−1)a$, y', '$(−1)(−1) = 1$.']],
      narr: [[0.5, 10.0, 'Miremos un patrón. Tres por menos dos es menos seis; dos por menos dos, menos cuatro; uno por menos dos, menos dos; cero por menos dos, cero.'],
        [10.4, 20.0, 'Cada vez que el primer número baja uno, el resultado sube dos. Si el patrón sigue, menos uno por menos dos da dos, y menos dos por menos dos da cuatro.'],
        [20.4, 30.0, 'Esa es la ley de los signos: un negativo por un positivo da negativo, y dos negativos dan positivo. Se demuestra con la distributiva, igual que a por cero.'],
        [30.4, 41.4, 'La clave: el opuesto de a es menos uno por a. Y menos uno por menos uno tiene que ser uno, para que la distributiva no falle.']],
      ev: [[1.0, 'count', 0], [2.6, 'count', 1], [4.2, 'count', 2], [5.8, 'count', 3], [10.8, 'count', 4], [12.4, 'count', 5], [20.8, 'card'], [30.8, 'rise']],
      draw(t) {
        const rows = [[3, 1.0], [2, 2.6], [1, 4.2], [0, 5.8], [-1, 10.8], [-2, 12.4]];
        const X_ = v => 640 + v * 46;
        line(640, 470, 640, 1180, { w: 3, c: hexA(P.ink, .5) }); fade(A(t, 1.0), () => M('0', 640, 1230, 40, { pass: true }));
        rows.forEach(([a, t0], i) => { const y = 520 + i * 110, p = a * -2; fade(A(t, t0, .4), () => { M(`${a < 0 ? '(−' + -a + ')' : a} · (−2) =`, 380, y + 18, 54, { a: 'r', pass: true }); M(p < 0 ? '−' + -p : String(p), 470, y + 18, 54, { a: 'l', c: p > 0 ? P.ac : P.ink, pass: true }); line(640, y, X_(p), y, { w: 12, c: p > 0 ? P.ac : hexA(P.ink, .7) }); }); if (i && t > t0) fade(A(t, t0 + .3), () => label('+2', 560, y - 46, P.ac, { s: 30, pass: true })); });
        fade(A(t, 20.8), () => { M(R`(−a)b = −(ab)`, 540, 1400, 72, { id: 'l1' }); M(R`(−a)(−b) = ab`, 540, 1520, 72, { id: 'l2', c: P.ac }); });
        fade(A(t, 30.8), () => M(R`−a = (−1)a \qquad (−1)(−1) = 1`, 540, 1680, 60, { id: 'fon' }));
      } },
    { id: 'cancelativa', name: 'Ley cancelativa', dur: 33,
      caps: [[0.5, 9.0, 'CANCELAR', 'Lo mismo a los dos lados', 'de una igualdad se quita.'], [9.4, 19.0, 'TAMBIÉN EN UN PRODUCTO', 'Si $ab = ac$ y $a ≠ 0$,', 'entonces $b = c$.'],
        [19.4, 32.4, '!LA TRAMPA DEL CERO', '$0 · 5 = 0 · 7$, pero', '$5 ≠ 7$: el 0 no se cancela.']],
      narr: [[0.5, 9.0, 'Si a más b es igual a a más c, se quita la a de los dos lados: b es igual a c. Es una balanza.'],
        [9.4, 19.0, 'Con el producto también se puede cancelar, pero solo si lo que se cancela no es cero, porque cancelar es multiplicar por el recíproco.'],
        [19.4, 32.4, 'Mira por qué: cero por cinco y cero por siete dan cero los dos. Si se cancelara el cero, quedaría cinco igual a siete, que es falso.']],
      ev: [[1.0, 'draw', 1.0], [4.0, 'cut'], [9.8, 'rise'], [19.8, 'no']],
      draw(t) {
        const tilt = 0, cx = 540, cy = 760; fade(A(t, 1.0) * (1 - A(t, 9.2)), () => {
          line(cx, cy, cx, cy + 260, { w: 6 }); line(cx - 300, cy + tilt, cx + 300, cy - tilt, { w: 6 }); poly([[cx - 60, cy + 320], [cx + 60, cy + 320], [cx, cy + 260]], { w: 5, fill: .2 });
          [-1, 1].forEach(s => { line(cx + s * 300, cy, cx + s * 300, cy + 120, { w: 3 }); line(cx + s * 300 - 110, cy + 120, cx + s * 300 + 110, cy + 120, { w: 6 }); });
          const out = eio(seg(t, 4.0, 5.2)); [-1, 1].forEach(s => { rect(cx + s * 300 - 100, cy + 40 - out * 160, 90, 70, { r: 10, w: 4, fill: .4 }); fade(1 - out, () => M('a', cx + s * 300 - 55, cy + 92, 46, { pass: true })); rect(cx + s * 300 + 10, cy + 40, 90, 70, { r: 10, w: 4, fill: .2 }); M(s < 0 ? 'b' : 'c', cx + s * 300 + 55, cy + 92, 46, { pass: true }); }); });
        fade(A(t, 1.2) * (1 - A(t, 9.2)), () => M(R`a + b = a + c \;⇒\; b = c`, 540, 1400, 72, { id: 's' }));
        fade(A(t, 9.8), () => M(R`ab = ac, \; a ≠ 0 \;⇒\; b = c`, 540, 760, 72, { id: 'p' }));
        fade(A(t, 19.8), () => { M(R`0 · 5 = 0 · 7`, 540, 980, 80, { id: 'z' }); M(R`5 \no{≠} 7`, 540, 1120, 80, { id: 'zz' }); });
      } },
    { id: 'ecuacion', name: 'Resolver con los axiomas', dur: 32,
      caps: [[0.5, 10.0, 'UNA ECUACIÓN', '$3x + 5 = 20$: se busca', 'el número $x$.'], [10.4, 20.0, 'PRIMERO', 'Sumar $−5$ a los dos', 'lados: $3x = 15$.'],
        [20.4, 31.4, 'DESPUÉS', 'Multiplicar los dos lados', R`por $\frac{1}{3}$: $x = 5$.`]],
      narr: [[0.5, 10.0, 'Así se resuelven las ecuaciones. Tres x más cinco es veinte: hay que encontrar el número x.'],
        [10.4, 20.0, 'Primero se suma el opuesto de cinco a los dos lados. Cinco más menos cinco da cero, el neutro, y queda tres x igual a quince.'],
        [20.4, 31.4, 'Después se multiplican los dos lados por el recíproco de tres. Un tercio por tres da uno, y queda x igual a cinco. Cada paso es un axioma.']],
      ev: [[1.0, 'rise'], [10.8, 'cut'], [20.8, 'cut'], [24.0, 'yes']],
      draw(t) {
        const rows = [[R`3x + 5 = 20`, 1.0, ''], [R`3x + 5 \hl{+ (−5)} = 20 \hl{+ (−5)}`, 10.8, 'inverso aditivo'], [R`3x = 15`, 13.6, 'neutro'], [R`\hl{\frac{1}{3}} · 3x = \hl{\frac{1}{3}} · 15`, 20.8, 'inverso multiplicativo'], [R`x = \hl{5}`, 24.0, 'neutro']];
        rows.forEach(([r, t0, why], i) => fade(A(t, t0), () => { M(r, 540, 560 + i * 170, i === 0 || i === 4 ? 84 : 64, { id: 'e' + i }); if (why) label(why, 540, 620 + i * 170, P.mute, { s: 32 }); }, (1 - A(t, t0)) * 14));
        fade(A(t, 26.0), () => M(R`\t{comprobación: } 3 · 5 + 5 = 20`, 540, 1500, 56, { id: 'comp', c: P.ac }));
      } },
  ],
  sum: [['Restar', R`a − b = a + (−b)`], ['Dividir', R`a ÷ b = a · \frac{1}{b} \quad (b ≠ 0)`], ['Entre cero', R`\frac{a}{0} \;\t{no está definido}`], ['Por cero', R`a · 0 = 0`],
    ['Signos', R`(−a)b = −(ab) \qquad (−a)(−b) = ab`], ['Cancelativa', R`ab = ac, \; a ≠ 0 \;⇒\; b = c`]],
  end: ['Lo que antes era memoria', 'ahora tiene una razón.'],
  finNarr: [[0.8, 10.4, 'En resumen: restar es sumar el opuesto y dividir es multiplicar por el recíproco, nunca entre cero.'],
    [10.6, 17.6, 'Todo número por cero da cero, menos por menos da más, y lo igual se cancela, salvo el cero.']],
};
