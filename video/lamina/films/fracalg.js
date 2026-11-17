// Lección alg-25b · Operaciones con fracciones algebraicas (mundo Fracciones Algebraicas).
// Un estanque (2 h y 3 h: lo que llena cada uno por hora); multiplicar y simplificar; dividir por el recíproco; el mínimo común
// denominador; sumar; restar con cuidado del signo; una fracción compleja.
const R = String.raw;
const POSTER = 40;
const FILM = {
  lesson: 'alg-25b', world: 'racionales', key: 'Bb', n: [2, 4],
  title: 'Operaciones con fracciones algebraicas',
  next: 'Sistemas de ecuaciones lineales',
  intro: 'Sumar, restar, multiplicar y dividir fracciones con letras se hace igual que con números. Un problema de un estanque lo muestra.',
  examples: ['2 horas y 3 horas', '6/5', '1/x + 1/(x + 2)', '3/(x − 1) − 2/(x + 1)', '(1 + 1/x)'],
  scenes: [
    { id: 'estanque', name: 'Un estanque', dur: 37,
      caps: [[0.5, 9.0, 'DOS LLAVES', 'Una llena el estanque en 2 h;', 'la otra, en 3 h.'], [9.4, 19.0, 'POR HORA', R`$\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}$`, 'del estanque.'],
        [19.4, 28.0, 'EL TIEMPO JUNTAS', R`$1 ÷ \frac{5}{6} = \frac{6}{5}$ h:`, 'una hora y 12 minutos.'], [28.4, 36.4, '!NO ES EL PROMEDIO', 'Juntas tardan menos que', 'la más rápida.']],
      narr: [[0.5, 9.0, 'Una llave llena un estanque en dos horas; otra, en tres. Queremos saber cuánto tardan abiertas al mismo tiempo.'],
        [9.4, 19.0, 'Conviene pensar en lo que llena cada una en una hora: un medio y un tercio. En sextos: tres más dos, cinco sextos por hora.'],
        [19.4, 28.0, 'Para llenar un estanque entero se divide uno entre cinco sextos: seis quintos de hora, una hora y doce minutos.'],
        [28.4, 36.4, 'No es el promedio de dos y tres. Juntas tardan menos que la más rápida, porque se ayudan.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'pops', 5], [19.8, 'card'], [28.8, 'no']],
      draw(t) {
        rect(330, 520, 420, 420, { r: 16, w: 5 });
        const h = clamp((t - 9.8) / 6) * 5 / 6; fade(A(t, 9.8), () => { fillP(P.ac, .5, () => X.rect(334, 520 + 420 * (1 - h * .6), 412, 420 * h * .6)); fillP(P.ink, .25, () => X.rect(334, 520 + 420 * (1 - h), 412, 420 * h * .4)); });
        fade(A(t, 9.8), () => { for (let i = 1; i < 6; i++) line(330, 520 + 70 * i, 360, 520 + 70 * i, { w: 3 }); label('5/6 en una hora', 540, 990, P.ac, { s: 36 }); });
        fade(A(t, 1.0), () => { label('2 h', 250, 560, P.ink, { s: 40 }); label('3 h', 830, 560, P.ink, { s: 40 }); });
        fade(A(t, 19.8), () => M(R`1 ÷ \frac{5}{6} = \frac{6}{5} \t{ h}`, 540, 1200, 80, { id: 't' }));
      } },
    { id: 'multiplicar', name: 'Multiplicar', dur: 31,
      caps: [[0.5, 9.0, 'ARRIBA POR ARRIBA', R`$\frac{x}{x + 1} · \frac{x + 1}{x^{2}}$:`, 'y abajo por abajo.'], [9.4, 19.0, 'CANCELAR', 'Lo que está arriba', 'y abajo se va.'],
        [19.4, 30.4, 'RESULTADO', R`$\frac{1}{x}$, con $x ≠ 0$`, 'y $x ≠ −1$.']],
      narr: [[0.5, 9.0, 'Para multiplicar se multiplican los numeradores entre sí y los denominadores entre sí, como con números.'],
        [9.4, 19.0, 'Antes de multiplicar conviene cancelar: x más uno está arriba y abajo, y una x de arriba cancela una de las de abajo.'],
        [19.4, 30.4, 'Queda uno sobre x. Valen las restricciones de la expresión original: x no puede ser cero ni menos uno.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{x}{x + 1} · \frac{x + 1}{x^{2}} = \frac{x\,(x + 1)}{(x + 1)\,x · x}`, 540, 700, 70, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\frac{\no{x}\,\no{(x + 1)}}{\no{(x + 1)}\,\no{x} · x}`, 540, 940, 76, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`= \frac{1}{x}`, 540, 1160, 90, { id: 'c' }));
      } },
    { id: 'dividir', name: 'Dividir', dur: 29,
      caps: [[0.5, 9.0, 'POR EL RECÍPROCO', 'Dividir es multiplicar por', 'la segunda volteada.'], [9.4, 19.0, 'EJEMPLO', R`$\frac{x^{2} − 4}{x} ÷ \frac{x + 2}{x^{2}}$.`, ''],
        [19.4, 28.4, 'RESULTADO', R`$\frac{(x − 2)(x + 2)}{x} · \frac{x^{2}}{x + 2}$`, '$= x(x − 2)$.']],
      narr: [[0.5, 9.0, 'Dividir fracciones algebraicas es lo mismo que con números: se multiplica por la segunda volteada.'],
        [9.4, 19.0, 'Para x al cuadrado menos cuatro sobre x, entre x más dos sobre x al cuadrado, se voltea la segunda.'],
        [19.4, 28.4, 'Se factoriza y se cancela: x más dos se va, y una x de abajo con una de arriba. Queda x por x menos dos.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.0], [19.8, 'card']],
      draw(t) {
        fade(A(t, 9.8), () => M(R`\frac{x^{2} − 4}{x} ÷ \frac{x + 2}{x^{2}}`, 540, 700, 76, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`= \frac{(x − 2)\no{(x + 2)}}{\no{x}} · \frac{x^{\no{2}}}{\no{x + 2}}`, 540, 920, 68, { id: 'b' }));
        fade(A(t, 22.0), () => M(R`= \hl{x\,(x − 2)}`, 540, 1120, 84, { id: 'c' }));
      } },
    { id: 'mcd', name: 'El denominador común', dur: 32,
      caps: [[0.5, 9.0, 'PARA SUMAR', 'Hace falta el mismo', 'denominador.'], [9.4, 19.0, 'SE FACTORIZA', '$x^{2} − 1 = (x − 1)(x + 1)$', 'y $x^{2} + x = x(x + 1)$.'],
        [19.4, 31.4, 'EL MÍNIMO', 'Cada factor una vez:', '$x(x − 1)(x + 1)$.']],
      narr: [[0.5, 9.0, 'Para sumar o restar hay que llevar las fracciones al mismo denominador. Se busca el más pequeño posible.'],
        [9.4, 19.0, 'Con uno sobre x al cuadrado menos uno y uno sobre x al cuadrado más x, primero se factorizan los denominadores.'],
        [19.4, 31.4, 'El mínimo común denominador lleva cada factor una sola vez, con su mayor exponente: x por x menos uno por x más uno.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{1}{x^{2} − 1} \qquad \frac{1}{x^{2} + x}`, 540, 680, 76, { id: 'a' }));
        fade(A(t, 9.8), () => { M(R`(x − 1)\hl{(x + 1)}`, 300, 900, 56, { id: 'b' }); M(R`x\hl{(x + 1)}`, 780, 900, 56, { id: 'c' }); });
        fade(A(t, 19.8), () => M(R`x\,(x − 1)(x + 1)`, 540, 1120, 80, { id: 'd' }));
      } },
    { id: 'sumar', name: 'Sumar', dur: 35,
      caps: [[0.5, 9.0, 'DOS FRACCIONES', R`$\frac{1}{x} + \frac{1}{x + 2}$: denominador`, 'común $x(x + 2)$.'], [9.4, 19.0, 'COMPLETAR', 'A cada una se le multiplica', 'por lo que le falta.'],
        [19.4, 34.4, 'RESULTADO', 'Se suman los numeradores:', R`$\frac{2x + 2}{x(x + 2)}$.`]],
      narr: [[0.5, 9.0, 'Para sumar uno sobre x más uno sobre x más dos, el denominador común es x por x más dos.'],
        [9.4, 19.0, 'A la primera le falta x más dos, y se multiplica arriba y abajo por eso. A la segunda le falta x.'],
        [19.4, 34.4, 'Con el mismo denominador se suman los numeradores: x más dos más x, dos x más dos. Se puede factorizar: dos por x más uno.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{1}{x} + \frac{1}{x + 2}`, 540, 660, 86, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= \frac{1 · \hl{(x + 2)}}{x\hl{(x + 2)}} + \frac{1 · \hl{x}}{(x + 2)\hl{x}}`, 540, 880, 70, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`= \frac{2x + 2}{x(x + 2)} = \frac{2(x + 1)}{x(x + 2)}`, 540, 1120, 72, { id: 'c' }));
      } },
    { id: 'restar', name: 'Restar', dur: 33,
      caps: [[0.5, 9.0, 'UNA RESTA', R`$\frac{3}{x − 1} − \frac{2}{x + 1}$.`, ''], [9.4, 19.0, '!OJO CON EL SIGNO', 'El menos afecta a todo', 'el segundo numerador.'],
        [19.4, 32.4, 'RESULTADO', 'Queda', R`$\frac{x + 5}{x^{2} − 1}$.`]],
      narr: [[0.5, 9.0, 'En la resta, tres sobre x menos uno, menos dos sobre x más uno, el denominador común es el producto de los dos.'],
        [9.4, 19.0, 'Cuidado: el signo menos afecta a todo el segundo numerador. Dos por x menos uno, al restarse, cambia los dos signos.'],
        [19.4, 32.4, 'Tres x más tres menos dos x más dos: x más cinco, sobre x al cuadrado menos uno.']],
      ev: [[1.0, 'rise'], [9.8, 'doubt'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{3}{x − 1} − \frac{2}{x + 1}`, 540, 660, 86, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= \frac{3(x + 1) \hl{− 2(x − 1)}}{(x − 1)(x + 1)}`, 540, 880, 70, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`= \frac{3x + 3 \hl{− 2x + 2}}{x^{2} − 1} = \frac{x + 5}{x^{2} − 1}`, 540, 1120, 66, { id: 'c' }));
      } },
    { id: 'compleja', name: 'Una fracción compleja', dur: 33,
      caps: [[0.5, 9.0, 'FRACCIONES ADENTRO', R`$\frac{1 + \frac{1}{x}}{1 − \frac{1}{x^{2}}}$: una fracción`, 'de fracciones.'], [9.4, 19.0, 'SE ARREGLA CADA PISO', R`Arriba $\frac{x + 1}{x}$; abajo`, R`$\frac{x^{2} − 1}{x^{2}}$.`],
        [19.4, 32.4, 'SE DIVIDE', 'Y se simplifica:', R`$\frac{x}{x − 1}$.`]],
      narr: [[0.5, 9.0, 'A veces aparece una fracción con fracciones adentro: uno más uno sobre x, todo sobre uno menos uno sobre x al cuadrado.'],
        [9.4, 19.0, 'Se arregla cada piso por separado. Arriba queda x más uno sobre x; abajo, x al cuadrado menos uno sobre x al cuadrado.'],
        [19.4, 32.4, 'Luego se divide, multiplicando por el recíproco, y se cancela: queda x sobre x menos uno.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{1 + \frac{1}{x}}{1 − \frac{1}{x^{2}}}`, 540, 720, 90, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= \frac{x + 1}{x} · \frac{x^{2}}{(x − 1)(x + 1)}`, 540, 960, 68, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`= \hl{\frac{x}{x − 1}}`, 540, 1180, 86, { id: 'c' }));
      } },
  ],
  sum: [['Multiplicar', R`\frac{a}{b} · \frac{c}{d} = \frac{ac}{bd}`], ['Dividir', R`\frac{a}{b} ÷ \frac{c}{d} = \frac{a}{b} · \frac{d}{c}`], ['Denominador común', R`\t{cada factor una vez}`], ['Sumar', R`\frac{1}{x} + \frac{1}{x + 2} = \frac{2x + 2}{x(x + 2)}`], ['Restar', R`\t{el menos afecta a todo el numerador}`]],
  end: ['Con letras se opera', 'igual que con números.'],
  finNarr: [[0.8, 9.0, 'En resumen: se multiplica arriba por arriba y abajo por abajo, y para dividir se voltea la segunda.'],
    [9.2, 16.0, 'Para sumar o restar se busca el mínimo común denominador, cuidando los signos.']],
};
