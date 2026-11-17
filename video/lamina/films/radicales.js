// Lección alg-22b · Simplificar y racionalizar (mundo Exponentes y Radicales).
// √(ab) = √a·√b; sacar el cuadrado escondido (√45 con la baldosa partida, ∛54); radicales semejantes (y √2 + √3 ≠ √5);
// raíz de un cociente; racionalizar con un uno disfrazado; el conjugado (10 / (√6 + 1)); para qué sirve.
const R = String.raw;
const POSTER = 60;
const FILM = {
  lesson: 'alg-22b', world: 'potencias', key: 'Bb', n: [4, 4],
  title: 'Simplificar y racionalizar',
  next: 'Sucesiones y progresiones aritméticas',
  intro: 'Muchas raíces esconden un cuadrado adentro. Sacarlo simplifica, y un uno bien elegido quita las raíces del denominador.',
  examples: ['√45', '∛54', '√12 + √27', '3/√5', '10/(√6 + 1)', '√(9/16)'],
  scenes: [
    { id: 'producto', name: 'Raíz de un producto', dur: 30,
      caps: [[0.5, 9.0, 'UNA LEY', R`$\sqrt{ab} = \sqrt{a}\,\sqrt{b}$`, 'si $a, b ≥ 0$.'], [9.4, 19.0, 'COMPROBAR', R`$\sqrt{4 · 9} = \sqrt{36} = 6$`, R`y $\sqrt{4}\,\sqrt{9} = 2 · 3 = 6$.`],
        [19.4, 29.4, 'DE DÓNDE SALE', 'Es la ley $(ab)^{n} = a^{n}b^{n}$', R`con $n = \frac{1}{2}$.`]],
      narr: [[0.5, 9.0, 'La raíz de un producto es el producto de las raíces, si los números no son negativos.'],
        [9.4, 19.0, 'Por ejemplo, raíz de cuatro por nueve es raíz de treinta y seis, seis. Y raíz de cuatro por raíz de nueve es dos por tres, también seis.'],
        [19.4, 29.4, 'No es una regla nueva: es la ley del producto elevado, con exponente un medio.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'tag']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\sqrt{ab} = \sqrt{a}\,\sqrt{b}`, 540, 700, 96, { id: 'l' }));
        fade(A(t, 9.8), () => M(R`\sqrt{4 · 9} = \sqrt{36} = 6 = 2 · 3`, 540, 920, 70, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`(ab)^{\frac{1}{2}} = a^{\frac{1}{2}}b^{\frac{1}{2}}`, 540, 1140, 76, { id: 'p' }));
      } },
    { id: 'simplificar', name: 'El cuadrado escondido', dur: 38,
      caps: [[0.5, 9.0, 'UNA BALDOSA', 'De área 45: se busca un', 'cuadrado perfecto adentro.'], [9.4, 19.0, 'LO HAY', '$45 = 9 · 5$, y 9 es', 'un cuadrado: $3^{2}$.'],
        [19.4, 28.0, 'SE SACA', R`$\sqrt{45} = \sqrt{9}\,\sqrt{5} = 3\sqrt{5}$.`, ''], [28.4, 37.4, 'CON RAÍZ CÚBICA', 'Se busca un cubo:', R`$\sqrt[3]{54} = \sqrt[3]{27 · 2} = 3\sqrt[3]{2}$.`]],
      narr: [[0.5, 9.0, 'Raíz de cuarenta y cinco no es exacta. Pero cuarenta y cinco esconde un cuadrado perfecto como factor.'],
        [9.4, 19.0, 'Cuarenta y cinco es nueve por cinco, y nueve es tres al cuadrado. La baldosa se parte en nueve cuadritos de área cinco.'],
        [19.4, 28.0, 'Entonces raíz de cuarenta y cinco es raíz de nueve por raíz de cinco: tres raíz de cinco. El nueve salió del radical.'],
        [28.4, 37.4, 'Con raíz cúbica se busca un cubo perfecto. Cincuenta y cuatro es veintisiete por dos: raíz cúbica de cincuenta y cuatro es tres raíz cúbica de dos.']],
      ev: [[1.0, 'draw', 1.2], [9.8, 'cut'], [19.8, 'card'], [28.8, 'rise']],
      draw(t) {
        const s = 450, x0 = 315, y0 = 520; rect(x0, y0, s, s, { k: draw(t, 1.0, 1.2), w: 6, fill: .15 });
        fade(A(t, 2.0) * (1 - A(t, 9.6)), () => M('45', x0 + s / 2, y0 + s / 2 + 30, 90, { pass: true }));
        fade(A(t, 9.8), () => { for (let i = 1; i < 3; i++) { line(x0 + s * i / 3, y0, x0 + s * i / 3, y0 + s, { w: 4, k: A(t, 9.8 + i * .3) }); line(x0, y0 + s * i / 3, x0 + s, y0 + s * i / 3, { w: 4, k: A(t, 9.8 + i * .3) }); } for (let i = 0; i < 9; i++) fade(A(t, 11.0 + i * .1), () => M('5', x0 + s / 6 + (i % 3) * s / 3, y0 + s / 6 + Math.floor(i / 3) * s / 3 + 18, 50, { pass: true })); });
        fade(A(t, 19.8), () => { brace(x0, x0 + s, y0 + s + 20, { label: R`3\sqrt{5}`, m: true, k: 1, s: 52 }); });
        fade(A(t, 9.8) * (1 - A(t, 28.2)), () => M(R`\sqrt{45} = \sqrt{\hl{9} · 5} = \hl{3}\sqrt{5}`, 540, 1340, 80, { id: 'r' }));
        fade(A(t, 28.8), () => M(R`\sqrt[3]{54} = \sqrt[3]{\hl{27} · 2} = \hl{3}\sqrt[3]{2}`, 540, 1340, 80, { id: 'c' }));
      } },
    { id: 'semejantes', name: 'Sumar radicales', dur: 36,
      caps: [[0.5, 9.0, 'SEMEJANTES', 'Mismo índice y mismo', 'radicando: se suman.'], [9.4, 18.0, 'COMO MANZANAS', R`$3\sqrt{2} + 4\sqrt{2} = 7\sqrt{2}$.`, ''],
        [18.4, 27.0, '!DISTINTOS NO', R`$\sqrt{2} + \sqrt{3} ≠ \sqrt{5}$:`, '1.414 + 1.732 ≠ 2.236.'], [27.4, 35.4, 'A VECES SE ESCONDEN', R`$\sqrt{12} + \sqrt{27}$`, R`$= 2\sqrt{3} + 3\sqrt{3} = 5\sqrt{3}$.`]],
      narr: [[0.5, 9.0, 'Los radicales con el mismo índice y el mismo radicando se llaman semejantes, y se suman como cosas iguales.'],
        [9.4, 18.0, 'Tres raíz de dos más cuatro raíz de dos son siete raíz de dos, como tres manzanas más cuatro manzanas.'],
        [18.4, 27.0, 'Los distintos no se juntan. Raíz de dos más raíz de tres no es raíz de cinco: los decimales lo muestran.'],
        [27.4, 35.4, 'A veces no se nota: raíz de doce es dos raíz de tres; raíz de veintisiete, tres raíz de tres. Suman cinco.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 7], [18.8, 'no'], [27.8, 'card']],
      draw(t) {
        const u = 92; if (t < 18.4) { for (let i = 0; i < 7; i++) fade(A(t, 9.8 + i * .15), () => { const x = 160 + i * (u + 18); rect(x, 640, u, 90, { r: 10, w: 4, fill: i < 3 ? .5 : .25 }); M(R`\sqrt{2}`, x + u / 2, 702, 40, { pass: true }); }); }
        else { [[R`\sqrt{2}`, Math.SQRT2], [R`\sqrt{3}`, Math.sqrt(3)], [R`\sqrt{5}`, Math.sqrt(5)]].forEach(([s, v], i) => fade(A(t, 18.8 + i * .3), () => { const y = 600 + i * 110; bar(160, y, v * 300, 80, { label: s, s: 38, a: i === 2 ? .6 : .3 }); })); fade(A(t, 20.0), () => { stroke(P.no, 4, () => { X.moveTo(160 + 300 * Math.sqrt(5), 580); X.lineTo(160 + 300 * Math.sqrt(5), 920); }, { dash: [8, 8] }); label('√2 + √3 llega más lejos', 600, 960, P.no, { s: 34 }); }); }
        fade(A(t, 1.0), () => M(R`a\sqrt[n]{x} + b\sqrt[n]{x} = (a + b)\sqrt[n]{x}`, 540, 1240, 64, { id: 'g' }));
        fade(A(t, 9.8) * (1 - A(t, 27.2)), () => M(R`3\sqrt{2} + 4\sqrt{2} = \hl{7\sqrt{2}}`, 540, 1400, 76, { id: 'e' }));
        fade(A(t, 27.8), () => M(R`\sqrt{12} + \sqrt{27} = 2\sqrt{3} + 3\sqrt{3} = \hl{5\sqrt{3}}`, 540, 1400, 62, { id: 's' }));
      } },
    { id: 'cociente', name: 'Raíz de un cociente', dur: 24,
      caps: [[0.5, 11.0, 'IGUAL CON UN COCIENTE', R`$\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}$, con $b > 0$.`, ''], [11.4, 23.4, 'EJEMPLO', R`$\sqrt{\frac{9}{16}} = \frac{3}{4}$: raíz arriba`, 'y raíz abajo.']],
      narr: [[0.5, 11.0, 'Con un cociente pasa lo mismo: la raíz de una fracción es la raíz de arriba sobre la raíz de abajo, si el de abajo es positivo.'],
        [11.4, 23.4, 'Raíz de nueve dieciseisavos es tres cuartos. Y tres cuartos al cuadrado da, en efecto, nueve dieciseisavos.']],
      ev: [[1.0, 'rise'], [11.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}`, 540, 760, 96, { id: 'g' }));
        fade(A(t, 11.8), () => M(R`\sqrt{\frac{9}{16}} = \frac{\sqrt{9}}{\sqrt{16}} = \hl{\frac{3}{4}}`, 540, 1080, 84, { id: 'e' }));
      } },
    { id: 'racionalizar', name: 'Racionalizar', dur: 36,
      caps: [[0.5, 9.0, 'UNA RAÍZ ABAJO', R`$\frac{3}{\sqrt{5}}$: se quiere quitar`, 'la raíz del denominador.'], [9.4, 19.0, 'UN UNO DISFRAZADO', R`Se multiplica por $\frac{\sqrt{5}}{\sqrt{5}} = 1$:`, 'el valor no cambia.'],
        [19.4, 27.0, 'ABAJO', R`$\sqrt{5} · \sqrt{5} = 5$:`, 'la raíz desaparece.'], [27.4, 35.4, 'RESULTADO', R`$\frac{3}{\sqrt{5}} = \frac{3\sqrt{5}}{5}$:`, 'el mismo número.']],
      narr: [[0.5, 9.0, 'En tres sobre raíz de cinco hay una raíz en el denominador. Racionalizar es quitarla sin cambiar el número.'],
        [9.4, 19.0, 'El truco es multiplicar por uno, escrito como raíz de cinco sobre raíz de cinco. Multiplicar por uno no cambia nada.'],
        [19.4, 27.0, 'Abajo, raíz de cinco por raíz de cinco da cinco: un número entero.'],
        [27.4, 35.4, 'Queda tres raíz de cinco sobre cinco. Es el mismo número, escrito sin raíz abajo.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'cut'], [27.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{3}{\sqrt{5}}`, 280, 760, 100, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`· \hl{\frac{\sqrt{5}}{\sqrt{5}}}`, 520, 760, 100, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`= \frac{3\sqrt{5}}{\sqrt{5} · \sqrt{5}} = \frac{3\sqrt{5}}{5}`, 540, 1020, 84, { id: 'c' }));
        fade(A(t, 27.8), () => M(R`\frac{3}{\sqrt{5}} = \hl{\frac{3\sqrt{5}}{5}} ≈ 1.342`, 540, 1300, 76, { id: 'd' }));
      } },
    { id: 'conjugado', name: 'El conjugado', dur: 41,
      caps: [[0.5, 9.0, 'UN BINOMIO ABAJO', R`$\frac{10}{\sqrt{6} + 1}$: multiplicar por`, R`$\sqrt{6}$ no basta.`], [9.4, 19.0, 'EL CONJUGADO', R`$\sqrt{6} − 1$: el mismo`, 'binomio con el signo cambiado.'],
        [19.4, 29.0, 'SUMA POR DIFERENCIA', R`$(\sqrt{6} + 1)(\sqrt{6} − 1)$`, '$= 6 − 1 = 5$.'], [29.4, 40.4, 'RESULTADO', R`$\frac{10(\sqrt{6} − 1)}{5}$`, R`$= 2(\sqrt{6} − 1)$.`]],
      narr: [[0.5, 9.0, 'Ahora abajo hay una suma: raíz de seis más uno. Multiplicar por raíz de seis no la elimina.'],
        [9.4, 19.0, 'Se usa el conjugado: el mismo binomio con el signo del medio cambiado, raíz de seis menos uno.'],
        [19.4, 29.0, 'Una suma por su diferencia da la resta de los cuadrados: seis menos uno, cinco. La raíz se fue.'],
        [29.4, 40.4, 'Arriba queda diez por raíz de seis menos uno, y al dividir entre cinco, dos por raíz de seis menos uno.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.0], [19.8, 'card'], [29.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{10}{\sqrt{6} + 1}`, 540, 680, 90, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\frac{10}{\sqrt{6} + 1} · \frac{\sqrt{6} \hl{−} 1}{\sqrt{6} \hl{−} 1}`, 540, 900, 80, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`(a + b)(a − b) = a^{2} − b^{2}`, 540, 1110, 66, { id: 'g' }));
        fade(A(t, 21.0), () => M(R`(\sqrt{6})^{2} − 1^{2} = 6 − 1 = 5`, 540, 1230, 66, { id: 'c' }));
        fade(A(t, 29.8), () => M(R`= \frac{10(\sqrt{6} − 1)}{5} = \hl{2(\sqrt{6} − 1)}`, 540, 1440, 74, { id: 'd' }));
      } },
    { id: 'paraque', name: 'Para qué sirve', dur: 27,
      caps: [[0.5, 9.0, 'DIVIDIR ENTRE UNA RAÍZ', R`$\frac{1}{1.414…}$ es una división`, 'difícil de hacer a mano.'], [9.4, 18.0, 'RACIONALIZADO', R`$\frac{\sqrt{2}}{2}$: basta partir`, '1.414 en dos.'],
        [18.4, 26.4, 'Y ADEMÁS', 'Así se ve si dos expresiones', 'son el mismo número.']],
      narr: [[0.5, 9.0, 'Antes de las calculadoras, dividir uno entre uno coma cuatro uno cuatro era una cuenta larga.'],
        [9.4, 18.0, 'Racionalizado, uno sobre raíz de dos es raíz de dos sobre dos: basta partir uno coma cuatro uno cuatro por la mitad. Cero coma siete cero siete.'],
        [18.4, 26.4, 'Hoy se usa sobre todo para comparar: escritas sin raíz abajo, se ve enseguida si dos expresiones son iguales.']],
      ev: [[1.0, 'doubt'], [9.8, 'yes'], [18.8, 'tag']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{1}{\sqrt{2}} = \frac{1}{1.414…}`, 540, 720, 86, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2} = \frac{1.414…}{2} = \hl{0.707…}`, 540, 960, 70, { id: 'b' }));
      } },
  ],
  sum: [['Producto y cociente', R`\sqrt{ab} = \sqrt{a}\sqrt{b} \qquad \sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}`], ['Simplificar', R`\sqrt{45} = 3\sqrt{5}`], ['Semejantes', R`3\sqrt{2} + 4\sqrt{2} = 7\sqrt{2}`],
    ['Racionalizar', R`\frac{3}{\sqrt{5}} = \frac{3\sqrt{5}}{5}`], ['Conjugado', R`(a + b)(a − b) = a^{2} − b^{2}`]],
  end: ['Busca el cuadrado escondido', 'y el uno disfrazado.'],
  finNarr: [[0.8, 9.0, 'En resumen: la raíz se reparte en productos y cocientes, y así se sacan los cuadrados escondidos.'],
    [9.2, 16.0, 'Solo los radicales semejantes se suman, y para quitar raíces de abajo se multiplica por un uno bien elegido.']],
};
