// Lección alg-25a · Dominio y simplificación (mundo Fracciones Algebraicas).
// Expresión racional; el denominador no puede ser 0 (dominio); 1/x y la asíntota; los dos lados de la asíntota; simplificar
// cancelando factores; solo se cancelan factores; hueco frente a asíntota en (x² − 16)/(x² − 2x − 8).
const R = String.raw;
const POSTER = 150;
const F = x => (x + 4) / (x + 2);
const FILM = {
  lesson: 'alg-25a', world: 'racionales', key: 'Bb', n: [1, 4],
  title: 'Dominio y simplificación',
  next: 'Operaciones con fracciones algebraicas',
  intro: 'Una fracción de polinomios funciona casi siempre. Casi: en algunos puntos el denominador se vuelve cero, y ahí pasan cosas.',
  examples: ['(x² − 16)/(x² − 2x − 8)', '(x + 4)/(x + 2)', '4/3', '(2x + 6)/2'],
  scenes: [
    { id: 'expresion', name: 'Expresiones racionales', dur: 30,
      caps: [[0.5, 9.0, 'UNA FRACCIÓN', 'De dos polinomios: una', 'expresión racional.'], [9.4, 19.0, 'EJEMPLO', R`$\frac{x^{2} − 16}{x^{2} − 2x − 8}$.`, ''],
        [19.4, 29.4, 'COMO LAS FRACCIONES', 'Con números se calculan;', 'con letras se simplifican.']],
      narr: [[0.5, 9.0, 'Una expresión racional es una fracción cuyo numerador y denominador son polinomios.'],
        [9.4, 19.0, 'Por ejemplo, x al cuadrado menos dieciséis, sobre x al cuadrado menos dos x menos ocho.'],
        [19.4, 29.4, 'Se trabajan como las fracciones de números: se simplifican, se suman, se multiplican. Pero con un cuidado especial.']],
      ev: [[1.0, 'rise'], [9.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{P(x)}{Q(x)}`, 540, 720, 120, { id: 'g' }));
        fade(A(t, 9.8), () => M(R`\frac{x^{2} − 16}{x^{2} − 2x − 8}`, 540, 1000, 96, { id: 'e' }));
      } },
    { id: 'dominio', name: 'El dominio', dur: 33,
      caps: [[0.5, 9.0, '!NUNCA ENTRE CERO', 'El denominador', 'no puede valer 0.'], [9.4, 19.0, 'SE BUSCA', '$(x − 4)(x + 2) = 0$:', 'en 4 y en $−2$.'],
        [19.4, 32.4, 'EL DOMINIO', 'Todos los reales', 'menos 4 y $−2$.']],
      narr: [[0.5, 9.0, 'Como no se puede dividir entre cero, hay que saber dónde se anula el denominador.'],
        [9.4, 19.0, 'Se factoriza: x menos cuatro por x más dos. Se hace cero en cuatro y en menos dos.'],
        [19.4, 32.4, 'El dominio, los valores permitidos para x, son todos los reales menos cuatro y menos dos.']],
      ev: [[1.0, 'no'], [9.8, 'card'], [19.8, 'pops', 2]],
      draw(t) {
        fade(A(t, 9.8), () => M(R`x^{2} − 2x − 8 = (x − 4)(x + 2)`, 540, 700, 70, { id: 'f' }));
        const X_ = axis({ x0: 110, x1: 960, y: 960, v0: -5, v1: 6, ticks: [-4, -2, 0, 2, 4, 6], k: 1, ls: 38 });
        fade(A(t, 19.8), () => { [-2, 4].forEach(v => dot(X_(v), 960, { r: 14, hollow: true, c: P.no })); stroke(P.ac, 9, () => { X.moveTo(110, 960); X.lineTo(X_(-2) - 18, 960); X.moveTo(X_(-2) + 18, 960); X.lineTo(X_(4) - 18, 960); X.moveTo(X_(4) + 18, 960); X.lineTo(960, 960); }); });
        fade(A(t, 20.4), () => M(R`\t{Dominio: } ℝ − \{−2, \; 4\}`, 540, 1200, 66, { id: 'd' }));
      } },
    { id: 'asintota', name: 'Una asíntota', dur: 35,
      caps: [[0.5, 9.0, 'CERCA DEL CERO', R`$\frac{1}{x}$ con $x = 0.1, 0.01, 0.001$:`, '10, 100, 1000.'], [9.4, 19.0, 'SE DISPARA', 'La curva sube pegada', 'a una recta sin tocarla.'],
        [19.4, 28.0, 'ASÍNTOTA', 'Esa recta, $x = 0$, es una', 'asíntota vertical.'], [28.4, 34.6, 'Y ACOSTADA', R`Lejos, $\frac{1}{x}$ se acerca`, 'a $y = 0$.']],
      narr: [[0.5, 9.0, 'Cerca de un número prohibido, uno sobre x crece: con cero coma uno da diez; con cero coma cero uno, cien; luego mil.'],
        [9.4, 19.0, 'Mientras más cerca de cero, más grande. La curva sube pegada a una recta vertical, sin tocarla nunca.'],
        [19.4, 28.0, 'Esa recta, x igual a cero, se llama asíntota vertical: la curva se acerca tanto como se quiera pero no llega.'],
        [28.4, 34.6, 'Lejos del origen, uno sobre x se acerca a cero: otra asíntota, acostada.']],
      ev: [[1.0, 'count', 0], [2.2, 'count', 1], [3.4, 'count', 2], [9.8, 'draw', 1.6], [19.8, 'tag'], [28.8, 'draw', 1.0]],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1000, sx: 90, sy: 60, x0: -5, x1: 5.6, y0: -6, y1: 7, k: 1, grid: true, xt: [-4, -2, 2, 4], yt: [] });
        plot(x => 1 / x, .14, 5.4, Pl, { k: draw(t, 9.8, 1.6), ymax: 7 }); plot(x => 1 / x, -5, -.17, Pl, { k: draw(t, 28.8, 1.0), ymin: -6 });
        fade(A(t, 19.8), () => { stroke(P.ac, 4, () => { X.moveTo(Pl.X(0), Pl.Y(-6)); X.lineTo(Pl.X(0), Pl.Y(7)); }, { dash: [12, 10], glow: 10 }); label('x = 0', Pl.X(0) + 20, Pl.Y(6.4), P.ac, { s: 36, a: 'l' }); });
        [['0.1', '10'], ['0.01', '100'], ['0.001', '1000']].forEach(([a, b], i) => fade(A(t, 1.0 + i * 1.2), () => M(`x = ${a} \\;→\\; ${b}`, 820, 520 + i * 70, 40, { pass: true })));
        fade(A(t, 1.0), () => M(R`y = \frac{1}{x}`, 300, 560, 66, { id: 'f' }));
      } },
    { id: 'lados', name: 'A los dos lados', dur: 27,
      caps: [[0.5, 12.0, 'POR LA IZQUIERDA', R`Con $x = −0.01$, $\frac{1}{x} = −100$:`, 'se hunde.'], [12.4, 26.4, 'CADA LADO A SU MANERA', 'Por la derecha sube; por', 'la izquierda baja.']],
      narr: [[0.5, 12.0, 'Por el otro lado pasa algo distinto: con x igual a menos cero coma cero uno, uno sobre x es menos cien. La curva se hunde.'],
        [12.4, 26.4, 'Así que a cada lado de la asíntota la curva se va en una dirección: por la derecha hacia arriba y por la izquierda hacia abajo.']],
      ev: [[1.0, 'draw', 1.0], [12.8, 'tag']],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1000, sx: 90, sy: 60, x0: -5, x1: 5.6, y0: -6, y1: 7, k: 1, grid: true, xt: [-4, -2, 2, 4], yt: [] });
        plot(x => 1 / x, .14, 5.4, Pl, { ymax: 7 }); plot(x => 1 / x, -5, -.17, Pl, { ymin: -6, k: draw(t, 1.0, 1.0) });
        stroke(P.ac, 4, () => { X.moveTo(Pl.X(0), Pl.Y(-6)); X.lineTo(Pl.X(0), Pl.Y(7)); }, { dash: [12, 10] });
        fade(A(t, 12.8), () => { arrow(Pl.X(.4), Pl.Y(3.5), Pl.X(.25), Pl.Y(6.2), { c: P.ac, w: 4 }); arrow(Pl.X(-.4), Pl.Y(-3.5), Pl.X(-.25), Pl.Y(-5.6), { c: P.ac, w: 4 }); });
        fade(A(t, 1.2), () => M(R`x = −0.01 \;→\; −100`, 540, 1450, 62, { id: 'a' }));
      } },
    { id: 'simplificar', name: 'Simplificar', dur: 34,
      caps: [[0.5, 9.0, 'FACTORIZAR', 'Arriba $(x − 4)(x + 4)$;', 'abajo $(x − 4)(x + 2)$.'], [9.4, 19.0, 'CANCELAR', 'El factor $x − 4$ está', 'arriba y abajo.'],
        [19.4, 33.4, 'RESULTADO', R`$\frac{x + 4}{x + 2}$, siempre`, 'que $x ≠ 4$.']],
      narr: [[0.5, 9.0, 'Para simplificar, primero se factoriza todo. Arriba, una diferencia de cuadrados; abajo, el trinomio que ya factorizamos.'],
        [9.4, 19.0, 'El factor x menos cuatro aparece arriba y abajo. Como cuatro sobre cuatro, se cancela.'],
        [19.4, 33.4, 'Queda x más cuatro sobre x más dos. Pero vale solo donde la original valía: x distinto de cuatro.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{x^{2} − 16}{x^{2} − 2x − 8} = \frac{(x − 4)(x + 4)}{(x − 4)(x + 2)}`, 540, 700, 70, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\frac{\no{(x − 4)}(x + 4)}{\no{(x − 4)}(x + 2)}`, 540, 920, 76, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`= \frac{x + 4}{x + 2} \quad (x ≠ 4)`, 540, 1140, 80, { id: 'c' }));
      } },
    { id: 'factores', name: 'Solo factores', dur: 30,
      caps: [[0.5, 9.0, '!NO SE CANCELAN SUMANDOS', R`$\frac{x + 5}{5}$ no es $x$:`, 'el 5 no multiplica a todo.'], [9.4, 19.0, 'COMPROBAR', R`Con $x = 1$: $\frac{6}{5} ≠ 1$.`, ''],
        [19.4, 29.4, 'SÍ SE PUEDE', R`$\frac{2x + 6}{2} = \frac{2(x + 3)}{2} = x + 3$:`, 'el 2 es factor.']],
      narr: [[0.5, 9.0, 'Error frecuente: en x más cinco sobre cinco, tachar los cincos. No se puede, porque el cinco de arriba es un sumando, no un factor.'],
        [9.4, 19.0, 'Con x igual a uno se ve: seis quintos no es uno.'],
        [19.4, 29.4, 'En dos x más seis sobre dos sí: arriba se saca factor común dos, y entonces el dos multiplica a todo y se cancela.']],
      ev: [[1.0, 'no'], [9.8, 'no'], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{x + \no{5}}{\no{5}} \;\no{≠}\; x`, 540, 720, 86, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`x = 1: \;\; \frac{6}{5} ≠ 1`, 540, 920, 70, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`\frac{2x + 6}{2} = \frac{\hl{2}(x + 3)}{\hl{2}} = x + 3`, 540, 1140, 74, { id: 'c' }));
      } },
    { id: 'hueco', name: 'Hueco o asíntota', dur: 37,
      caps: [[0.5, 9.0, 'LA GRÁFICA', R`$\frac{x + 4}{x + 2}$ con $x ≠ 4$.`, ''], [9.4, 19.0, 'EN x = −2', 'El denominador sigue siendo 0:', 'una asíntota.'],
        [19.4, 28.0, 'EN x = 4', 'El factor se canceló:', 'queda solo un hueco.'], [28.4, 36.4, 'EL HUECO', R`Donde estaría $\frac{8}{6} = \frac{4}{3}$:`, 'un punto vacío.']],
      narr: [[0.5, 9.0, 'Ahora la gráfica de la fracción simplificada, recordando que x no puede ser cuatro.'],
        [9.4, 19.0, 'En menos dos el denominador todavía se anula: ahí hay una asíntota vertical, un río que la curva no cruza.'],
        [19.4, 28.0, 'En cuatro, en cambio, el factor que daba problemas se canceló. La curva pasa tranquila, salvo por un punto.'],
        [28.4, 36.4, 'Ese punto, a la altura de ocho sextos, o sea cuatro tercios, queda vacío: un hueco en la gráfica.']],
      ev: [[1.0, 'draw', 1.6], [9.8, 'draw', 1.0], [19.8, 'pop'], [28.8, 'tag']],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 940, sx: 70, sy: 60, x0: -7, x1: 7, y0: -5, y1: 7, k: 1, grid: true, xt: [-6, -4, -2, 2, 4, 6], yt: [1, 2] });
        plot(F, -1.8, 6.9, Pl, { k: draw(t, 1.0, 1.6), ymax: 7 }); plot(F, -7, -2.3, Pl, { k: draw(t, 1.6, 1.4), ymin: -5 });
        stroke(hexA(P.ink, .25), 3, () => { X.moveTo(Pl.X(-7), Pl.Y(1)); X.lineTo(Pl.X(7), Pl.Y(1)); }, { dash: [8, 10] });
        fade(A(t, 9.8), () => { stroke(P.ac, 4, () => { X.moveTo(Pl.X(-2), Pl.Y(-5)); X.lineTo(Pl.X(-2), Pl.Y(7)); }, { dash: [12, 10], glow: 10 }); label('asíntota', Pl.X(-2) - 20, Pl.Y(6.4), P.ac, { s: 34, a: 'r' }); });
        fade(A(t, 19.8), () => { dot(Pl.X(4), Pl.Y(4 / 3), { r: 14, hollow: true, c: P.ac }); label('hueco', Pl.X(4), Pl.Y(4 / 3) - 40, P.ac, { s: 34 }); });
        fade(A(t, 28.8), () => M(R`x = 4: \;\; \frac{4 + 4}{4 + 2} = \frac{4}{3}`, 540, 1420, 62, { id: 'h' }));
      } },
  ],
  sum: [['Dominio', R`Q(x) ≠ 0`], ['Asíntota', R`\frac{1}{x} \;→\; x = 0`], ['Simplificar', R`\frac{(x − 4)(x + 4)}{(x − 4)(x + 2)} = \frac{x + 4}{x + 2}`], ['Solo factores', R`\frac{x + 5}{5} ≠ x`], ['Hueco o asíntota', R`\t{cancelado: hueco} \quad \t{no cancelado: asíntota}`]],
  end: ['El dominio se mira', 'antes de simplificar.'],
  finNarr: [[0.8, 9.0, 'En resumen: en una expresión racional el denominador nunca puede ser cero; eso define el dominio.'],
    [9.2, 16.0, 'Se simplifica cancelando factores, nunca sumandos, y donde un factor se canceló queda un hueco.']],
};
