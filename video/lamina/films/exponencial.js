// Lección alg-71 · Función exponencial (mundo Crecimiento Exponencial).
// Sumar frente a duplicar; f(x) = aˣ (a > 0, a ≠ 1); la gráfica de 2ˣ (pasa por (0, 1), siempre positiva, asíntota y = 0);
// (1/2)ˣ decrece; moverla (2ˣ + 3); ecuaciones con la misma base (4ˣ = 64); el número e.
const R = String.raw;
const POSTER = 90;
const pl = (k = 1) => plane({ ox: 540, oy: 1120, sx: 90, sy: 60, x0: -5, x1: 4.6, y0: -1, y1: 9.4, k, grid: true, xt: [-4, -2, 2, 4], yt: [1, 2, 4, 8] });
const FILM = {
  lesson: 'alg-71', world: 'exp-log', key: 'G', n: [1, 4],
  title: 'Función exponencial',
  next: 'Interés simple y compuesto',
  intro: 'Sumar lo mismo cada día crece en línea recta. Multiplicar cada día crece cada vez más rápido. Esa es la función exponencial.',
  examples: ['3 + 2t', '3 · 2ᵗ', '2ˣ + 3', '4ˣ = 64', '(1/2)ˣ', '(1 + 1/n)ⁿ'],
  scenes: [
    { id: 'duplicar', name: 'Sumar o duplicar', dur: 31,
      caps: [[0.5, 9.0, 'DOS PLANTAS', 'Una crece 2 hojas por día;', 'la otra duplica sus hojas.'], [9.4, 19.0, 'AL PRINCIPIO', 'Parecidas: 5 y 6 hojas', 'el primer día.'],
        [19.4, 30.4, 'DESPUÉS', 'Al día 6: 15 frente a 192.', 'Multiplicar gana siempre.']],
      narr: [[0.5, 9.0, 'Dos plantas empiezan con tres hojas. Una gana dos hojas cada día; la otra duplica las que tiene.'],
        [9.4, 19.0, 'Al principio van parejas: cinco y seis hojas el primer día, siete y doce el segundo.'],
        [19.4, 30.4, 'Pero al sexto día la primera tiene quince y la segunda, ciento noventa y dos. Multiplicar termina dejando atrás a sumar.']],
      ev: [[1.0, 'pops', 6], [9.8, 'pops', 3], [19.8, 'card']],
      draw(t) {
        const Pl = plane({ ox: 170, oy: 1160, sx: 120, sy: 3, x0: 0, x1: 6.6, y0: 0, y1: 200, k: 1, grid: false, xt: [1, 2, 3, 4, 5, 6], yt: [] });
        for (let d = 0; d <= 6; d++) { fade(A(t, 1.0 + d * .6), () => { dot(Pl.X(d), Pl.Y(3 + 2 * d), { r: 10, c: P.mute }); dot(Pl.X(d), Pl.Y(3 * 2 ** d), { r: 12, c: P.ac }); }); }
        fade(A(t, 19.8), () => { M('192', Pl.X(6) - 30, Pl.Y(192) + 10, 44, { a: 'r', c: P.ac, pass: true }); M('15', Pl.X(6) + 30, Pl.Y(15) - 10, 44, { a: 'l', pass: true }); });
        fade(A(t, 1.2), () => M(R`3 + 2t \qquad \t{frente a} \qquad 3 · 2^{t}`, 540, 1400, 62, { id: 'f' }));
      } },
    { id: 'funcion', name: 'La función', dur: 32,
      caps: [[0.5, 9.0, 'EXPONENCIAL', '$f(x) = a^{x}$: la variable', 'está en el exponente.'], [9.4, 19.0, 'LA BASE', '$a > 0$ y $a ≠ 1$.', ''],
        [19.4, 31.4, 'POR QUÉ', 'Con $a = 1$ no cambia; con $a < 0$,', '$a^{1/2}$ no sería real.']],
      narr: [[0.5, 9.0, 'Una función exponencial tiene la variable en el exponente: a a la x. No confundir con x al cuadrado, donde la variable es la base.'],
        [9.4, 19.0, 'La base tiene que ser positiva y distinta de uno.'],
        [19.4, 31.4, 'Con base uno, uno a la x es siempre uno: no crece. Y con base negativa, exponentes como un medio darían raíces de negativos, que no son reales.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'no']],
      draw(t) {
        fade(A(t, 1.0), () => { M(R`f(x) = a^{\hl{x}}`, 540, 700, 110, { id: 'a' }); M(R`\t{no es } x^{2}`, 540, 840, 56, { id: 'n', c: P.mute }); });
        fade(A(t, 9.8), () => M(R`a > 0, \quad a ≠ 1`, 540, 1020, 80, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`1^{x} = 1 \qquad (−4)^{\frac{1}{2}} = \sqrt{−4} \no{∉ ℝ}`, 540, 1200, 58, { id: 'c' }));
      } },
    { id: 'grafica', name: 'Su gráfica', dur: 36,
      caps: [[0.5, 9.0, 'UNA TABLA', R`$2^{x}$: $\frac{1}{4}, \frac{1}{2}, 1, 2, 4, 8$.`, ''], [9.4, 19.0, 'SIEMPRE POSITIVA', 'Pasa por $(0, 1)$ y', 'nunca toca el eje.'],
        [19.4, 28.0, 'ASÍNTOTA', 'A la izquierda se pega', 'a $y = 0$.'], [28.4, 35.4, 'DOMINIO Y RANGO', 'Dominio: $ℝ$.', 'Rango: los positivos.']],
      narr: [[0.5, 9.0, 'Para dos a la x: en menos dos da un cuarto, en menos uno un medio, en cero uno, y luego dos, cuatro, ocho.'],
        [9.4, 19.0, 'Toda exponencial pasa por cero, uno, porque a a la cero es uno. Y nunca toca el eje: una potencia de base positiva siempre es positiva.'],
        [19.4, 28.0, 'Hacia la izquierda se achica, pegándose al eje horizontal sin llegar: y igual a cero es una asíntota.'],
        [28.4, 35.4, 'Se puede evaluar en cualquier real, y sus valores son todos los positivos.']],
      ev: [[1.0, 'pops', 6], [9.8, 'draw', 1.6], [19.8, 'tag']],
      draw(t) {
        const Pl = pl(1);
        [-2, -1, 0, 1, 2, 3].forEach((x, i) => fade(A(t, 1.0 + i * .4), () => dot(Pl.X(x), Pl.Y(2 ** x), { r: 11, c: P.ac })));
        plot(x => 2 ** x, -5, 3.2, Pl, { k: draw(t, 9.8, 1.6), ymax: 9.4 });
        fade(A(t, 10.8), () => { dot(Pl.X(0), Pl.Y(1), { r: 14, c: P.ac, ping: ping(t, 10.8) }); M('(0, 1)', Pl.X(0) + 24, Pl.Y(1) - 20, 38, { a: 'l', c: P.ac, pass: true }); });
        fade(A(t, 19.8), () => stroke(P.ac, 4, () => { X.moveTo(Pl.X(-5), Pl.Y(0)); X.lineTo(Pl.X(4.6), Pl.Y(0)); }, { glow: 10 }));
        fade(A(t, 1.2), () => M(R`y = 2^{x}`, 300, 560, 70, { id: 'f' }));
      } },
    { id: 'decrece', name: 'Base menor que 1', dur: 30,
      caps: [[0.5, 9.0, 'BASE UN MEDIO', R`$\left(\frac{1}{2}\right)^{x}$: cada paso`, 'a la derecha, la mitad.'], [9.4, 19.0, 'DECRECE', 'Es el espejo de $2^{x}$', 'en el eje vertical.'],
        [19.4, 29.4, 'LA REGLA', '$a > 1$: crece.', '$0 < a < 1$: decrece.']],
      narr: [[0.5, 9.0, 'Con base un medio pasa lo contrario: cada paso a la derecha, el valor se reduce a la mitad.'],
        [9.4, 19.0, 'Su gráfica es el reflejo de dos a la x en el eje vertical, porque un medio a la x es dos a la menos x.'],
        [19.4, 29.4, 'Si la base es mayor que uno, la exponencial crece; si está entre cero y uno, decrece.']],
      ev: [[1.0, 'draw', 1.6], [9.8, 'shuffle', 1.0]],
      draw(t) {
        const Pl = pl(1);
        plot(x => 2 ** x, -5, 3.2, Pl, { c: hexA(P.ink, .3), w: 4, ymax: 9.4 });
        plot(x => .5 ** x, -3.2, 4.6, Pl, { k: draw(t, 1.0, 1.6), ymax: 9.4 });
        fade(A(t, 9.8), () => stroke(P.mute, 3, () => { X.moveTo(Pl.X(0), Pl.Y(-1)); X.lineTo(Pl.X(0), Pl.Y(9.4)); }, { dash: [10, 10] }));
        fade(A(t, 1.2), () => M(R`\left(\frac{1}{2}\right)^{x} = 2^{−x}`, 760, 560, 60, { id: 'f' }));
      } },
    { id: 'mover', name: 'Moverla', dur: 30,
      caps: [[0.5, 9.0, 'SUMAR 3', '$2^{x} + 3$: la curva', 'sube 3.'], [9.4, 19.0, 'LA ASÍNTOTA TAMBIÉN', 'Ahora es $y = 3$:', 'nunca baja de 3.'],
        [19.4, 29.4, 'EL RANGO', 'Los mayores que 3:', '$(3, ∞)$.']],
      narr: [[0.5, 9.0, 'Si a dos a la x se le suma tres, toda la curva sube tres unidades.'],
        [9.4, 19.0, 'La asíntota sube con ella: ahora es la recta y igual a tres, y la curva nunca baja de ahí.'],
        [19.4, 29.4, 'El dominio sigue siendo todos los reales, pero el rango son los números mayores que tres.']],
      ev: [[1.0, 'shuffle', 1.2], [9.8, 'draw', 1.0]],
      draw(t) {
        const Pl = pl(1); const s = 3 * eio(seg(t, 1.0, 2.2));
        plot(x => 2 ** x, -5, 3.2, Pl, { c: hexA(P.ink, .3), w: 4, ymax: 9.4 });
        plot(x => 2 ** x + s, -5, 2.6, Pl, { ymax: 9.4 });
        fade(A(t, 9.8), () => { stroke(P.ac, 4, () => { X.moveTo(Pl.X(-5), Pl.Y(3)); X.lineTo(Pl.X(4.6), Pl.Y(3)); }, { dash: [12, 10] }); label('y = 3', Pl.X(-4.6), Pl.Y(3) - 20, P.ac, { s: 36, a: 'l' }); });
        fade(A(t, 19.8), () => M(R`\t{Rango: } (3, ∞)`, 540, 1400, 66, { id: 'r' }));
      } },
    { id: 'ecuacion', name: 'Igualar exponentes', dur: 30,
      caps: [[0.5, 9.0, 'UNA ECUACIÓN', '$4^{x} = 64$: escribir los dos', 'lados con la misma base.'], [9.4, 19.0, 'BASE 2', '$2^{2x} = 2^{6}$.', ''],
        [19.4, 29.4, 'SE IGUALAN', 'Como la función no repite', 'valores: $2x = 6$, $x = 3$.']],
      narr: [[0.5, 9.0, 'En una ecuación como cuatro a la x igual a sesenta y cuatro, el truco es escribir los dos lados con la misma base.'],
        [9.4, 19.0, 'Cuatro es dos al cuadrado y sesenta y cuatro es dos a la seis: dos a la dos x es igual a dos a la seis.'],
        [19.4, 29.4, 'Como la exponencial nunca repite un valor, los exponentes tienen que ser iguales: dos x es seis, x es tres.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`4^{x} = 64`, 540, 680, 96, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`(2^{2})^{x} = 2^{6} \;⇒\; 2^{\hl{2x}} = 2^{\hl{6}}`, 540, 880, 72, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`2x = 6 \;⇒\; x = \hl{3}`, 540, 1080, 80, { id: 'c' }));
      } },
    { id: 'e', name: 'El número e', dur: 37,
      caps: [[0.5, 9.0, 'CRECER SEGUIDO', 'Un peso al 100 % anual,', 'pagado en $n$ partes.'], [9.4, 19.0, 'MÁS PARTES', R`$\left(1 + \frac{1}{n}\right)^{n}$: 2, 2.25, 2.44, …`, ''],
        [19.4, 28.0, 'UN LÍMITE', 'Se acerca a', '$e = 2.71828…$'], [28.4, 36.4, 'LA EXPONENCIAL NATURAL', '$e^{x}$: la de la naturaleza', 'y las finanzas.']],
      narr: [[0.5, 9.0, 'Un peso gana el cien por ciento al año. Pagado de una vez, da dos pesos. Ahora se paga en n partes iguales…'],
        [9.4, 19.0, '…se tiene uno más uno sobre n, a la n. Con dos partes, dos coma veinticinco; con cuatro, dos coma cuarenta y cuatro.'],
        [19.4, 28.0, 'Con más y más partes, el resultado no se dispara: se acerca a un número, dos coma siete uno ocho, que se llama e.'],
        [28.4, 36.4, 'La exponencial de base e es la exponencial natural: aparece en el crecimiento continuo, en la física y en las finanzas.']],
      ev: [[1.0, 'rise'], [9.8, 'count', 0], [10.6, 'count', 1], [11.4, 'count', 2], [12.2, 'count', 3], [19.8, 'card']],
      draw(t) {
        const rows = [['1', '2'], ['2', '2.25'], ['4', '2.4414'], ['12', '2.6130'], ['365', '2.7146'], ['1000\\,000', '2.71828']];
        fade(A(t, 9.8), () => { T('n', 300, 600, { s: 36, c: P.mute, a: 'c', pass: true }); M(R`\left(1 + \frac{1}{n}\right)^{n}`, 700, 600, 44, { pass: true }); });
        rows.forEach(([n, v], i) => fade(A(t, 9.8 + i * .5), () => { M(n, 300, 700 + i * 80, 46, { pass: true }); M(v, 700, 700 + i * 80, 46, { c: i === 5 ? P.ac : P.ink, pass: true }); }));
        fade(A(t, 19.8), () => M(R`e = 2.71828…`, 540, 1300, 90, { id: 'e' }));
        fade(A(t, 28.8), () => M(R`f(x) = e^{x}`, 540, 1440, 76, { id: 'f' }));
      } },
  ],
  sum: [['Exponencial', R`f(x) = a^{x}, \quad a > 0, \; a ≠ 1`], ['Su gráfica', R`(0, 1), \quad y = 0 \t{ asíntota}`], ['Crece o decrece', R`a > 1 \t{ crece} \qquad 0 < a < 1 \t{ decrece}`], ['Misma base', R`4^{x} = 64 \;⇒\; x = 3`], ['El número e', R`\left(1 + \frac{1}{n}\right)^{n} → e ≈ 2.718`]],
  end: ['Multiplicar cada vez', 'termina ganándole a sumar.'],
  finNarr: [[0.8, 9.0, 'En resumen: la exponencial tiene la variable en el exponente, pasa por cero, uno, y nunca toca el eje.'],
    [9.2, 16.0, 'Crece si la base es mayor que uno y decrece si está entre cero y uno. Su base natural es e.']],
};
