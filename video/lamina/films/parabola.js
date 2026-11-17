// Lección alg-4a · Polinomio cuadrático y parábola (mundo Parábolas y Complejos).
// y = x² (tabla, vértice, simetría); mover: (x − 3)² − 2; abrir o cerrar con a (y voltear); forma canónica y vértice (h, k);
// completar el cuadrado (x² − 6x + 11); el atajo h = −b/2a; un máximo: una pelota lanzada hacia arriba.
const R = String.raw;
const POSTER = 70;
const pl = (k = 1, o = {}) => plane({ ox: o.ox ?? 540, oy: o.oy ?? 1060, sx: o.sx ?? 90, sy: o.sy ?? 60, x0: o.x0 ?? -5, x1: o.x1 ?? 5.6, y0: o.y0 ?? -4, y1: o.y1 ?? 9.4, k, grid: true, xt: o.xt ?? [-4, -2, 2, 4], yt: o.yt ?? [2, 4, 6, 8] });
const FILM = {
  lesson: 'alg-4a', world: 'cuadraticas', key: 'E', n: [3, 4],
  title: 'Polinomio cuadrático y parábola',
  next: 'Ecuaciones cuadráticas',
  intro: 'El polinomio de grado dos dibuja una curva que aparece en cada chorro de agua y cada balón: la parábola.',
  examples: ['(x − 3)² − 2', 'x² − 6x + 11', '2x² − 4x + 5', '−5t² + 20t + 1', '21 m'],
  scenes: [
    { id: 'forma', name: 'La parábola', dur: 33,
      caps: [[0.5, 9.0, 'LA MÁS SENCILLA', '$y = x^{2}$: una tabla', 'de valores.'], [9.4, 19.0, 'SU FORMA', 'Baja, da la vuelta en el', 'vértice y vuelve a subir.'],
        [19.4, 32.4, 'SIMÉTRICA', 'Lo de la izquierda es el espejo', 'de lo de la derecha.']],
      narr: [[0.5, 9.0, 'La más sencilla es y igual a x al cuadrado. En una tabla: menos dos da cuatro, menos uno da uno, cero da cero.'],
        [9.4, 19.0, 'Uniendo los puntos aparece una curva que baja, da la vuelta en un punto, el vértice, y vuelve a subir.'],
        [19.4, 32.4, 'Es simétrica: el eje vertical que pasa por el vértice la parte en dos mitades que son espejo una de otra.']],
      ev: [[1.0, 'pops', 5], [9.8, 'draw', 1.6], [19.8, 'draw', 1.0]],
      draw(t) {
        const Pl = pl(A(t, .6, .8));
        [-2, -1, 0, 1, 2].forEach((x, i) => fade(A(t, 1.0 + i * .5), () => dot(Pl.X(x), Pl.Y(x * x), { r: 12, c: P.ac })));
        plot(x => x * x, -3, 3, Pl, { k: draw(t, 9.8, 1.6) });
        fade(A(t, 11.6), () => label('vértice', Pl.X(0) + 30, Pl.Y(0) + 60, P.ac, { s: 36, a: 'l' }));
        fade(A(t, 19.8), () => stroke(P.mute, 3, () => { X.moveTo(Pl.X(0), Pl.Y(-4)); X.lineTo(Pl.X(0), Pl.Y(9.4)); }, { dash: [10, 10] }));
        fade(A(t, 1.0), () => M(R`y = x^{2}`, 540, 1440, 90, { id: 'f' }));
      } },
    { id: 'mover', name: 'Moverla', dur: 37,
      caps: [[0.5, 9.0, 'A LA DERECHA', '$y = (x − 3)^{2}$: el vértice', 'pasa a $x = 3$.'], [9.4, 19.0, '!OJO CON EL SIGNO', '$x − 3$ mueve a la derecha:', 'el 0 aparece en $x = 3$.'],
        [19.4, 28.0, 'HACIA ABAJO', '$y = (x − 3)^{2} − 2$:', 'baja 2.'], [28.4, 36.4, 'EL VÉRTICE', 'Queda en $(3, −2)$:', 'se lee en la fórmula.']],
      narr: [[0.5, 9.0, 'Si en vez de x se pone x menos tres, la parábola entera se corre tres unidades a la derecha.'],
        [9.4, 19.0, 'Parece al revés, pero tiene lógica: el cuadrado vale cero cuando x menos tres es cero, o sea en x igual a tres.'],
        [19.4, 28.0, 'Si a todo se le resta dos, cada punto baja dos.'],
        [28.4, 36.4, 'El vértice queda en tres, menos dos. Se lee directo en la fórmula.']],
      ev: [[1.0, 'shuffle', 1.4], [19.8, 'shuffle', 1.0], [28.8, 'yes']],
      draw(t) {
        const Pl = pl(1); const h = 3 * eio(seg(t, 1.0, 2.4)), k = -2 * eio(seg(t, 19.8, 20.8));
        plot(x => x * x, -3, 3, Pl, { c: hexA(P.ink, .25), w: 4 });
        plot(x => (x - h) ** 2 + k, h - 3.4, h + 2.6, Pl, { ymax: 9.4 });
        dot(Pl.X(h), Pl.Y(k), { r: 13, c: P.ac });
        fade(A(t, 28.8), () => M('(3, −2)', Pl.X(3) + 30, Pl.Y(-2) + 50, 40, { a: 'l', c: P.ac, pass: true }));
        fade(A(t, 1.0) * (1 - A(t, 19.4)), () => M(R`y = (x \hl{− 3})^{2}`, 540, 1440, 86, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`y = (x − 3)^{2} \hl{− 2}`, 540, 1440, 86, { id: 'b' }));
      } },
    { id: 'abrir', name: 'Abrir, cerrar, voltear', dur: 31,
      caps: [[0.5, 9.0, 'EL NÚMERO a', '$y = 2x^{2}$ sube el doble', 'de rápido: más cerrada.'], [9.4, 19.0, 'MÁS ABIERTA', R`Con $a = \frac{1}{2}$,`, 'sube más despacio.'],
        [19.4, 30.4, 'NEGATIVO', 'Con $a < 0$ abre', 'hacia abajo.']],
      narr: [[0.5, 9.0, 'El número que multiplica al cuadrado cambia la abertura. Dos x al cuadrado sube el doble de rápido: es más cerrada.'],
        [9.4, 19.0, 'Un medio de x al cuadrado sube más despacio: es más abierta.'],
        [19.4, 30.4, 'Y si ese número es negativo, la parábola se voltea y abre hacia abajo, como un chorro de agua.']],
      ev: [[1.0, 'draw', 1.2], [9.8, 'draw', 1.2], [19.8, 'draw', 1.2]],
      draw(t) {
        const Pl = pl(1, { y0: -6, y1: 8.4, oy: 980 });
        plot(x => x * x, -2.8, 2.8, Pl, { c: hexA(P.ink, .3), w: 4 });
        plot(x => 2 * x * x, -2, 2, Pl, { k: draw(t, 1.0, 1.2), ymax: 8.4 });
        plot(x => .5 * x * x, -4, 4, Pl, { k: draw(t, 9.8, 1.2), c: P.mute });
        plot(x => -x * x, -2.4, 2.4, Pl, { k: draw(t, 19.8, 1.2), c: P.no });
        fade(A(t, 1.6), () => M('2x^{2}', Pl.X(1.9), Pl.Y(7.6), 38, { c: P.ac, a: 'r', pass: true })); fade(A(t, 10.4), () => M(R`\frac{1}{2}x^{2}`, Pl.X(4.1), Pl.Y(7.2), 38, { a: 'r', pass: true })); fade(A(t, 20.4), () => M('−x^{2}', Pl.X(2.4), Pl.Y(-5.4), 38, { c: P.no, a: 'l', pass: true }));
      } },
    { id: 'canonica', name: 'La forma canónica', dur: 30,
      caps: [[0.5, 9.0, 'TODO JUNTO', '$y = a(x − h)^{2} + k$.', ''], [9.4, 19.0, 'SE LEE', 'Vértice $(h, k)$; eje $x = h$;', '$a$ dice la abertura.'],
        [19.4, 29.4, 'MÍNIMO O MÁXIMO', 'Si $a > 0$, $k$ es el mínimo;', 'si $a < 0$, el máximo.']],
      narr: [[0.5, 9.0, 'Juntando todo: a por x menos h al cuadrado, más k. Se llama forma canónica.'],
        [9.4, 19.0, 'En ella se lee todo: el vértice es h, k; el eje de simetría es la recta x igual a h; y a dice hacia dónde y cuánto abre.'],
        [19.4, 29.4, 'Si a es positivo, la parábola tiene un punto más bajo, y k es el valor mínimo. Si es negativo, k es el máximo.']],
      ev: [[1.0, 'card'], [9.8, 'tag'], [19.8, 'tag']],
      draw(t) {
        const r = M(R`y = \id{a}{a}(x − \id{h}{h})^{2} + \id{k}{k}`, 540, 700, 110, { id: 'f' });
        fade(A(t, 9.8), () => { label('abertura', r.box.a.cx, r.box.a.y1 + 70, P.ac, { s: 34 }); label('vértice', (r.box.h.cx + r.box.k.cx) / 2, r.box.k.y1 + 120, P.ac, { s: 34 }); line(r.box.h.cx, r.box.h.y1 + 10, (r.box.h.cx + r.box.k.cx) / 2 - 30, r.box.k.y1 + 80, { c: P.ac, w: 3 }); line(r.box.k.cx, r.box.k.y1 + 10, (r.box.h.cx + r.box.k.cx) / 2 + 30, r.box.k.y1 + 80, { c: P.ac, w: 3 }); });
        fade(A(t, 19.8), () => { M(R`a > 0: \; \t{mínimo } k`, 540, 1080, 62, { id: 'mn' }); M(R`a < 0: \; \t{máximo } k`, 540, 1200, 62, { id: 'mx' }); });
      } },
    { id: 'completar', name: 'Completar el cuadrado', dur: 37,
      caps: [[0.5, 9.0, 'SIN ARMAR', '$y = x^{2} − 6x + 11$:', 'el vértice no se ve.'], [9.4, 19.0, 'COMPLETAR', 'Las barras se reparten', '3 y 3; la esquina pide 9.'],
        [19.4, 28.0, 'SOBRAN 2', '$x^{2} − 6x + 11 = (x − 3)^{2} + 2$.', ''], [28.4, 36.4, 'EL VÉRTICE', '$(3, 2)$: mínimo 2.', '']],
      narr: [[0.5, 9.0, 'Si la fórmula viene desarrollada, como x al cuadrado menos seis x más once, el vértice no se ve.'],
        [9.4, 19.0, 'Se completa el cuadrado, como con las fichas: las seis barras se reparten tres y tres, y la esquina pide nueve.'],
        [19.4, 28.0, 'De los once se usan nueve y sobran dos. Queda x menos tres al cuadrado, más dos.'],
        [28.4, 36.4, 'Ahora se lee: el vértice está en tres, dos, y como abre hacia arriba, el valor mínimo es dos.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'card'], [28.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x^{2} − 6x + 11`, 540, 620, 80, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= (x^{2} − 6x + \hl{9}) + 11 − \hl{9}`, 540, 760, 66, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`= (x − 3)^{2} + 2`, 540, 900, 80, { id: 'c' }));
        if (t > 28.4) { const Pl = plane({ ox: 300, oy: 1500, sx: 70, sy: 40, x0: -1, x1: 7, y0: -1, y1: 9, k: A(t, 28.8, .6), grid: true, xt: [3], yt: [2] }); plot(x => (x - 3) ** 2 + 2, -.2, 5.6, Pl, { k: draw(t, 29.0, 1.0), ymax: 9 }); fade(A(t, 30.0), () => { dot(Pl.X(3), Pl.Y(2), { r: 12, c: P.ac }); M('(3, 2)', Pl.X(3) + 26, Pl.Y(2) + 50, 38, { a: 'l', c: P.ac, pass: true }); }); }
      } },
    { id: 'atajo', name: 'Un atajo', dur: 30,
      caps: [[0.5, 9.0, 'LA ABSCISA DEL VÉRTICE', R`$h = −\frac{b}{2a}$, siempre.`, ''], [9.4, 19.0, 'EJEMPLO', '$y = 2x^{2} − 4x + 5$:', R`$h = \frac{4}{4} = 1$.`],
        [19.4, 29.4, 'LA ALTURA', '$k = 2 − 4 + 5 = 3$.', 'Vértice $(1, 3)$.']],
      narr: [[0.5, 9.0, 'Completando el cuadrado en general se llega a un atajo: la x del vértice es menos b sobre dos a.'],
        [9.4, 19.0, 'Para dos x al cuadrado menos cuatro x más cinco: menos menos cuatro sobre cuatro, uno.'],
        [19.4, 29.4, 'La altura del vértice se obtiene reemplazando uno en la fórmula: dos menos cuatro más cinco, tres. El vértice es uno, tres.']],
      ev: [[1.0, 'card'], [9.8, 'rise'], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`h = −\frac{b}{2a}`, 540, 700, 110, { id: 'h' }));
        fade(A(t, 9.8), () => M(R`h = −\frac{−4}{2 · 2} = \hl{1}`, 540, 920, 76, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`k = 2(1)^{2} − 4(1) + 5 = \hl{3}`, 540, 1100, 70, { id: 'k' }));
      } },
    { id: 'maximo', name: 'Un máximo', dur: 33,
      caps: [[0.5, 9.0, 'UNA PELOTA', 'Altura $h(t) = −5t^{2} + 20t + 1$', 'metros, a los $t$ segundos.'], [9.4, 19.0, 'EL VÉRTICE', R`$t = −\frac{20}{2(−5)} = 2$`, 'segundos.'],
        [19.4, 32.4, 'LO MÁS ALTO', '$h(2) = −20 + 40 + 1 = 21$', 'metros.']],
      narr: [[0.5, 9.0, 'Una pelota se lanza hacia arriba y su altura sigue una parábola: menos cinco t al cuadrado más veinte t más uno.'],
        [9.4, 19.0, 'Como a es negativo, abre hacia abajo y el vértice es el punto más alto. Con el atajo: t igual a dos segundos.'],
        [19.4, 32.4, 'Reemplazando, la altura máxima es veintiún metros. Sube durante dos segundos y luego empieza a caer.']],
      ev: [[1.0, 'draw', 2.0], [9.8, 'pop'], [19.8, 'card']],
      draw(t) {
        const Pl = plane({ ox: 180, oy: 1180, sx: 170, sy: 26, x0: 0, x1: 4.4, y0: 0, y1: 23.5, k: A(t, .8, .8), grid: false, xt: [1, 2, 3, 4], yt: [5, 10, 15, 20] });
        const f = x => -5 * x * x + 20 * x + 1; plot(f, 0, 4.04, Pl, { k: draw(t, 1.0, 2.0) });
        const bt = 4.04 * seg(t, 1.0, 3.0); if (t > 1 && t < 9.4) dot(Pl.X(bt), Pl.Y(f(bt)), { r: 14, c: P.ink });
        fade(A(t, 9.8), () => { dot(Pl.X(2), Pl.Y(21), { r: 14, c: P.ac, ping: ping(t, 9.8) }); stroke(P.ac, 3, () => { X.moveTo(Pl.X(2), Pl.Y(21)); X.lineTo(Pl.X(2), Pl.Y(0)); }, { dash: [8, 8] }); });
        fade(A(t, 19.8), () => M('21 m', Pl.X(2) + 30, Pl.Y(21) - 20, 44, { a: 'l', c: P.ac, pass: true }));
        fade(A(t, 1.0), () => M(R`h(t) = −5t^{2} + 20t + 1`, 540, 1420, 66, { id: 'f' }));
      } },
  ],
  sum: [['Parábola', R`y = x^{2}`], ['Forma canónica', R`y = a(x − h)^{2} + k`], ['Vértice', R`(h, k) \qquad h = −\frac{b}{2a}`], ['Completar el cuadrado', R`x^{2} − 6x + 11 = (x − 3)^{2} + 2`], ['Máximo o mínimo', R`a < 0: \t{máximo} \quad a > 0: \t{mínimo}`]],
  end: ['En la forma canónica,', 'la parábola se lee sola.'],
  finNarr: [[0.8, 9.0, 'En resumen: la parábola es la gráfica del polinomio de grado dos, con un vértice y un eje de simetría.'],
    [9.2, 16.0, 'En forma canónica el vértice se lee directo, y se llega a ella completando el cuadrado.']],
};
