// Lección alg-23c · Números complejos (mundo Parábolas y Complejos).
// x² = −1 no tiene solución real; se inventa i; multiplicar por −1 es media vuelta y por i un cuarto de vuelta; potencias de i;
// el plano complejo; sumar y multiplicar; conjugado, módulo y división.
const R = String.raw;
const POSTER = 90;
const OX = 540, OY = 900, SC = 110;
const cplane = (k = 1) => { const Pl = plane({ ox: OX, oy: OY, sx: SC, sy: SC, x0: -4.2, x1: 4.2, y0: -3.6, y1: 3.6, k, grid: true }); fade(A(k, .9, .1), () => { label('real', OX + 4.2 * SC - 20, OY + 100, P.mute, { s: 30, a: 'r', pass: true }); label('imaginario', OX + 20, OY - 3.6 * SC + 10, P.mute, { s: 30, a: 'l', pass: true }); }); return Pl; };
const zdot = (Pl, a, b, s, o = {}) => { dot(Pl.X(a), Pl.Y(b), { r: 13, c: o.c || P.ac, ping: o.ping }); if (s) M(s, Pl.X(a) + (o.dx ?? 30), Pl.Y(b) - 20, o.s || 42, { a: 'l', c: o.c || P.ac, pass: true }); };
const FILM = {
  lesson: 'alg-23c', world: 'cuadraticas', key: 'E', n: [1, 4],
  title: 'Números complejos',
  next: 'Ecuaciones lineales',
  intro: 'Ningún número real al cuadrado da negativo. Los complejos resuelven el acertijo, y la clave es girar.',
  examples: ['√(−49)', '7i', 'i¹⁰', '3 + 2i', '(1 + 2i)(3 − i)', '(2 + i)(2 − i)', '(5 + 5i)/(2 + i)'],
  scenes: [
    { id: 'acertijo', name: 'Un acertijo', dur: 30,
      caps: [[0.5, 9.0, 'UN ACERTIJO', 'Un número cuyo cuadrado', 'sea $−1$.'], [9.4, 19.0, 'EN LOS REALES NO', '$3^{2} = 9$ y $(−3)^{2} = 9$:', 'ningún cuadrado es negativo.'],
        [19.4, 29.4, 'LA PARÁBOLA', '$y = x^{2}$ nunca baja del eje:', 'nunca llega a $−1$.']],
      narr: [[0.5, 9.0, 'Un acertijo: encontrar un número que, multiplicado por sí mismo, dé menos uno.'],
        [9.4, 19.0, 'En los reales no existe. Tres al cuadrado es nueve, menos tres al cuadrado también: los cuadrados nunca son negativos.'],
        [19.4, 29.4, 'Se ve en la gráfica de y igual a x al cuadrado: nunca baja del eje. La recta y igual a menos uno no la toca.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 2], [19.8, 'draw', 1.4]],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1100, sx: 120, sy: 60, x0: -3.6, x1: 3.6, y0: -2, y1: 9.5, k: A(t, 1.0, .8), xt: [-3, -2, -1, 1, 2, 3], yt: [1, 4, 9] });
        plot(x => x * x, -3.05, 3.05, Pl, { k: draw(t, 19.8, 1.4) });
        fade(A(t, 21.0), () => { stroke(P.no, 4, () => { X.moveTo(Pl.X(-3.6), Pl.Y(-1)); X.lineTo(Pl.X(3.6), Pl.Y(-1)); }, { dash: [12, 10] }); label('y = −1', Pl.X(3.4), Pl.Y(-1) + 50, P.no, { s: 34, a: 'r' }); });
        fade(A(t, 9.8), () => { dot(Pl.X(3), Pl.Y(9), { r: 12, c: P.ac }); dot(Pl.X(-3), Pl.Y(9), { r: 12, c: P.ac }); });
        fade(A(t, 1.0), () => M(R`x^{2} = −1`, 540, 1340, 100, { id: 'q' }));
      } },
    { id: 'i', name: 'Inventar i', dur: 30,
      caps: [[0.5, 9.0, 'UN NÚMERO NUEVO', '$i$, con $i^{2} = −1$:', 'la unidad imaginaria.'], [9.4, 19.0, 'RAÍCES DE NEGATIVOS', R`$\sqrt{−49} = \sqrt{49}\,\sqrt{−1}$`, '$= 7i$.'],
        [19.4, 29.4, 'IMAGINARIOS', R`$7i$, $−2i$, $\frac{1}{2}i$: múltiplos`, 'reales de $i$.']],
      narr: [[0.5, 9.0, 'Como con los negativos y las fracciones, se inventa un número nuevo: i, con la regla i al cuadrado igual a menos uno.'],
        [9.4, 19.0, 'Con él, las raíces de negativos tienen sentido. Raíz de menos cuarenta y nueve es raíz de cuarenta y nueve por i: siete i.'],
        [19.4, 29.4, 'Los múltiplos reales de i se llaman imaginarios. El nombre es histórico: son tan reales como los demás.']],
      ev: [[1.0, 'card'], [9.8, 'rise'], [19.8, 'pops', 3]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`i^{2} = −1`, 540, 680, 110, { id: 'd', c: P.ac }));
        fade(A(t, 9.8), () => M(R`\sqrt{−49} = \sqrt{49} · \sqrt{−1} = \hl{7i}`, 540, 900, 70, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`7i, \quad −2i, \quad \frac{1}{2}i, \quad \sqrt{3}\,i`, 540, 1100, 66, { id: 'l' }));
      } },
    { id: 'girar', name: 'Girar', dur: 37,
      caps: [[0.5, 9.0, 'POR −1', 'Multiplicar por $−1$ es', 'dar media vuelta.'], [9.4, 19.0, 'POR i', 'Un cuarto de vuelta:', 'el 1 sube a $i$.'],
        [19.4, 28.0, 'DOS CUARTOS', 'Dos cuartos de vuelta son', 'media vuelta: $i · i = −1$.'], [28.4, 36.4, 'DÓNDE VIVE i', 'Fuera de la recta:', 'en un plano.']],
      narr: [[0.5, 9.0, 'Hay una manera de ver i. Multiplicar por menos uno lleva el uno al menos uno: es dar media vuelta alrededor del cero.'],
        [9.4, 19.0, 'Multiplicar por i debería ser algo que, repetido dos veces, dé media vuelta: un cuarto de vuelta. El uno sube y queda en i.'],
        [19.4, 28.0, 'Otro cuarto de vuelta lleva i a menos uno. Por eso i por i es menos uno.'],
        [28.4, 36.4, 'Así que i no está en la recta: está arriba del cero, en un plano.']],
      ev: [[1.0, 'draw', 1.2], [3.0, 'shuffle', 1.4], [9.8, 'shuffle', 1.2], [19.8, 'shuffle', 1.2], [28.8, 'yes']],
      draw(t) {
        const Pl = cplane(A(t, 1.0, .8));
        let ang = 0; if (t < 9.4) ang = Math.PI * eio(seg(t, 3.0, 4.4)); else ang = Math.PI / 2 * eio(seg(t, 9.8, 11.0)) + Math.PI / 2 * eio(seg(t, 19.8, 21.0));
        const r = 2.4; stroke(P.ac, 3, () => X.arc(Pl.X(0), Pl.Y(0), r * SC, -ang, 0), { dash: [8, 8] });
        zdot(Pl, r * Math.cos(ang), r * Math.sin(ang), null);
        fade(A(t, 1.0), () => { M('1', Pl.X(r), Pl.Y(0) + 60, 44, { pass: true }); M('−1', Pl.X(-r), Pl.Y(0) + 60, 44, { pass: true }); });
        fade(A(t, 11.0), () => M('i', Pl.X(0) + 30, Pl.Y(r) - 20, 50, { c: P.ac, a: 'l', pass: true }));
        fade(A(t, 1.0) * (1 - A(t, 9.4)), () => M(R`1 · (−1) = −1`, 540, 1440, 70, { id: 'a' }));
        fade(A(t, 9.8) * (1 - A(t, 19.4)), () => M(R`1 · i = i`, 540, 1440, 70, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`i · i = \hl{−1}`, 540, 1440, 80, { id: 'c' }));
      } },
    { id: 'potencias', name: 'Potencias de i', dur: 28,
      caps: [[0.5, 9.0, 'DAR VUELTAS', R`$i, \; i^{2} = −1, \; i^{3} = −i,$`, '$i^{4} = 1$.'], [9.4, 18.0, 'SE REPITE', 'Cada cuatro potencias,', 'una vuelta completa.'],
        [18.4, 27.4, 'EJEMPLO', '$i^{10} = i^{8} · i^{2} = −1$:', 'el resto de dividir entre 4.']],
      narr: [[0.5, 9.0, 'Cada potencia de i es otro cuarto de vuelta: i, menos uno, menos i, y la cuarta vuelve al uno.'],
        [9.4, 18.0, 'Así que las potencias de i se repiten cada cuatro.'],
        [18.4, 27.4, 'Para i a la diez se quitan vueltas completas: diez entre cuatro deja resto dos. Es lo mismo que i al cuadrado: menos uno.']],
      ev: [[1.0, 'pop', 0], [2.2, 'pop', 1], [3.4, 'pop', 2], [4.6, 'pop', 3], [18.8, 'card']],
      draw(t) {
        const Pl = cplane(1);
        [[0, 1, 'i'], [-1, 0, 'i^{2} = −1'], [0, -1, 'i^{3} = −i'], [1, 0, 'i^{4} = 1']].forEach(([a, b, s], i) => fade(A(t, 1.0 + i * 1.2), () => zdot(Pl, a * 2.4, b * 2.4, s, { ping: ping(t, 1.0 + i * 1.2), dx: a < 0 ? -210 : 30 })));
        for (let i = 0; i < 4; i++) fade(A(t, 1.0 + i * 1.2), () => stroke(P.ac, 3, () => X.arc(Pl.X(0), Pl.Y(0), 2.4 * SC, -(i) * Math.PI / 2, -(i + 1) * Math.PI / 2, true)));
        fade(A(t, 18.8), () => M(R`i^{10} = (i^{4})^{2} · i^{2} = \hl{−1}`, 540, 1480, 70, { id: 'e' }));
      } },
    { id: 'plano', name: 'El plano complejo', dur: 31,
      caps: [[0.5, 9.0, 'UN COMPLEJO', '$a + bi$: $a$ es la parte real,', '$b$ la imaginaria.'], [9.4, 19.0, 'UN PUNTO', '$3 + 2i$: 3 a la derecha', 'y 2 hacia arriba.'],
        [19.4, 30.4, 'LOS REALES ESTÁN', 'En el eje horizontal:', '$ℝ ⊆ ℂ$.']],
      narr: [[0.5, 9.0, 'Un número complejo tiene dos partes: a más b i. La a es la parte real y la b, la parte imaginaria.'],
        [9.4, 19.0, 'Se dibuja como un punto del plano: tres más dos i está tres a la derecha y dos hacia arriba.'],
        [19.4, 30.4, 'Los reales son los complejos con parte imaginaria cero: están en el eje horizontal. Los complejos se escriben con una C de doble trazo.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.2], [19.8, 'draw', 1.0]],
      draw(t) {
        const Pl = cplane(1);
        fade(A(t, 9.8), () => { line(Pl.X(0), Pl.Y(0), Pl.X(3), Pl.Y(0), { c: P.mute, w: 4, k: draw(t, 9.8, .6) }); line(Pl.X(3), Pl.Y(0), Pl.X(3), Pl.Y(2), { c: P.mute, w: 4, k: draw(t, 10.4, .6) }); });
        fade(A(t, 11.0), () => zdot(Pl, 3, 2, '3 + 2i'));
        fade(A(t, 19.8), () => stroke(P.ac, 9, () => { X.moveTo(Pl.X(-4.2), Pl.Y(0)); X.lineTo(Pl.X(4.2), Pl.Y(0)); }, { glow: 10 }));
        fade(A(t, 1.0), () => M(R`z = \id{a}{a} + \id{b}{b}\,i`, 540, 1440, 86, { id: 'z' }));
        fade(A(t, 20.4), () => M(R`ℝ ⊆ ℂ`, 540, 1580, 76, { id: 'c' }));
      } },
    { id: 'operar', name: 'Sumar y multiplicar', dur: 35,
      caps: [[0.5, 9.0, 'SUMAR', 'Real con real e', 'imaginaria con imaginaria.'], [9.4, 19.0, 'EN EL PLANO', 'Sumar es poner una', 'flecha tras otra.'],
        [19.4, 34.4, 'MULTIPLICAR', 'Como binomios, y al final', '$i^{2} = −1$.']],
      narr: [[0.5, 9.0, 'Para sumar complejos se juntan las partes reales y las imaginarias: dos más cinco i, más cuatro menos tres i, es seis más dos i.'],
        [9.4, 19.0, 'En el plano es poner una flecha después de la otra, como dos desplazamientos seguidos.'],
        [19.4, 34.4, 'Para multiplicar se usa la distributiva, como con binomios, y al final se cambia i al cuadrado por menos uno. Uno más dos i, por tres menos i, da cinco más cinco i.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.2], [11.2, 'draw', 1.2], [19.8, 'card']],
      draw(t) {
        if (t < 19.4) { const Pl = plane({ ox: 300, oy: 1100, sx: 90, sy: 90, x0: -1, x1: 7.4, y0: -3.4, y1: 5.8, k: 1, grid: true });
          arrow(Pl.X(0), Pl.Y(0), Pl.X(2), Pl.Y(5), { k: draw(t, 9.8, 1.2), c: P.ac, w: 5 }); arrow(Pl.X(2), Pl.Y(5), Pl.X(6), Pl.Y(2), { k: draw(t, 11.2, 1.2), c: P.mute, w: 5 }); fade(A(t, 12.6), () => { arrow(Pl.X(0), Pl.Y(0), Pl.X(6), Pl.Y(2), { c: P.ink, w: 6 }); M('6 + 2i', Pl.X(6) + 20, Pl.Y(2) + 50, 40, { a: 'l', pass: true }); }); }
        fade(A(t, 1.0) * (1 - A(t, 19.2)), () => M(R`(2 + 5i) + (4 − 3i) = \hl{6 + 2i}`, 540, 1440, 66, { id: 's' }));
        fade(A(t, 19.8), () => { M(R`(1 + 2i)(3 − i) = 3 − i + 6i − 2i^{2}`, 540, 760, 62, { id: 'm1' }); M(R`= 3 + 5i + 2 = \hl{5 + 5i}`, 540, 900, 70, { id: 'm2' }); });
      } },
    { id: 'conjugado', name: 'Conjugado y módulo', dur: 39,
      caps: [[0.5, 9.0, 'EL CONJUGADO', 'De $2 + i$ es $2 − i$:', 'su reflejo en el eje real.'], [9.4, 19.0, 'SU PRODUCTO', '$(2 + i)(2 − i) = 4 + 1 = 5$:', 'un número real.'],
        [19.4, 28.0, 'EL MÓDULO', 'La distancia al origen:', R`$|2 + i| = \sqrt{5}$.`], [28.4, 38.4, 'PARA DIVIDIR', 'Se multiplica arriba y abajo', 'por el conjugado de abajo.']],
      narr: [[0.5, 9.0, 'El conjugado de un complejo es su reflejo en el eje real: se cambia el signo de la parte imaginaria.'],
        [9.4, 19.0, 'Un complejo por su conjugado siempre da real: dos más i por dos menos i es cuatro más uno, cinco.'],
        [19.4, 28.0, 'Ese número es el cuadrado de la distancia al origen, por Pitágoras. La distancia se llama módulo: raíz de cinco.'],
        [28.4, 38.4, 'Así se divide: se multiplica arriba y abajo por el conjugado del denominador, que queda real.']],
      ev: [[1.0, 'shuffle', 1.0], [9.8, 'card'], [19.8, 'draw', 1.0], [28.8, 'rise']],
      draw(t) {
        if (t < 28.4) { const Pl = cplane(1); zdot(Pl, 2, 1, '2 + i'); fade(A(t, 1.0), () => { zdot(Pl, 2, -1, '2 − i', { c: P.mute }); stroke(P.mute, 3, () => { X.moveTo(Pl.X(2), Pl.Y(1)); X.lineTo(Pl.X(2), Pl.Y(-1)); }, { dash: [8, 8] }); });
          fade(A(t, 19.8), () => { line(Pl.X(0), Pl.Y(0), Pl.X(2), Pl.Y(1), { c: P.ac, w: 6, k: draw(t, 19.8, 1.0) }); M(R`\sqrt{5}`, Pl.X(1) - 20, Pl.Y(.5) - 30, 44, { a: 'r', c: P.ac, pass: true }); }); }
        fade(A(t, 9.8) * (1 - A(t, 28.2)), () => M(R`(2 + i)(2 − i) = 4 − i^{2} = \hl{5}`, 540, 1480, 66, { id: 'p' }));
        fade(A(t, 28.8), () => { M(R`\frac{5 + 5i}{2 + i} · \frac{2 − i}{2 − i} = \frac{15 + 5i}{5}`, 540, 760, 66, { id: 'd' }); M(R`= \hl{3 + i}`, 540, 960, 80, { id: 'r' }); });
      } },
  ],
  sum: [['Unidad imaginaria', R`i^{2} = −1 \qquad \sqrt{−49} = 7i`], ['Girar', R`× i \;=\; \t{un cuarto de vuelta}`], ['Potencias', R`i, \; −1, \; −i, \; 1, \; …`], ['Complejos', R`z = a + bi \qquad ℝ ⊆ ℂ`], ['Conjugado y módulo', R`(a + bi)(a − bi) = a^{2} + b^{2}`]],
  end: ['Multiplicar por i', 'es dar un cuarto de vuelta.'],
  finNarr: [[0.8, 9.0, 'En resumen: i al cuadrado es menos uno, y multiplicar por i es girar un cuarto de vuelta.'],
    [9.2, 16.0, 'Los complejos viven en un plano, se operan como binomios, y el conjugado sirve para dividir.']],
};
