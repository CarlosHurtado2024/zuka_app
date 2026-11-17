// Lección alg-23b · División e igualdad de polinomios (mundo Raíces de Polinomios).
// Dividir enteros (38 = 7 · 5 + 3); el algoritmo P = D·Q + R con gr R < gr D; la división larga paso a paso
// ((2x² + 7x + 8) ÷ (x + 2)); comprobar; división exacta = factor; grado del cociente; polinomios iguales y coeficientes.
const R = String.raw;
const POSTER = 100;
const FILM = {
  lesson: 'alg-23b', world: 'grado-superior', key: 'A', n: [1, 3],
  title: 'División e igualdad de polinomios',
  next: 'Residuo, factor y división sintética',
  intro: 'Los polinomios se dividen igual que los números: un cociente y algo que sobra. Cuando no sobra nada, aparece un factor.',
  examples: ['38 = 7 · 5 + 3', '2x² + 7x + 8', 'x³ + 2x² − 5x − 6', '(a − 1)x²', 'x² + x − 6'],
  scenes: [
    { id: 'enteros', name: 'Dividir números', dur: 30,
      caps: [[0.5, 9.0, 'CARAMELOS', '38 caramelos en bolsas', 'de 7.'], [9.4, 19.0, 'COCIENTE Y RESIDUO', '5 bolsas y sobran 3:', '$38 = 7 · 5 + 3$.'],
        [19.4, 29.4, 'LO QUE SOBRA', 'Es menor que una bolsa:', '$3 < 7$.']],
      narr: [[0.5, 9.0, 'Treinta y ocho caramelos se empacan en bolsas de siete.'],
        [9.4, 19.0, 'Caben cinco bolsas llenas y sobran tres. Treinta y ocho es siete por cinco más tres.'],
        [19.4, 29.4, 'Lo que sobra siempre es menor que una bolsa: si fuera mayor, cabría otra bolsa.']],
      ev: [[1.0, 'pops', 8], [9.8, 'pops', 5], [19.8, 'tag']],
      draw(t) {
        for (let i = 0; i < 38; i++) { const b = Math.floor(i / 7), inBag = b < 5, x = inBag ? 150 + b * 160 + (i % 7 % 4) * 34 : 820 + (i - 35) * 40, y = inBag ? 620 + Math.floor(i % 7 / 4) * 34 : 900; fade(A(t, 1.0 + i * .05, .2), () => dot(x, y, { r: 13, c: inBag ? P.ac : P.ink })); }
        for (let b = 0; b < 5; b++) fade(A(t, 9.8 + b * .3), () => rect(130 + b * 160, 590, 150, 100, { r: 14, w: 4 }));
        fade(A(t, 9.8), () => M(R`38 = 7 · 5 + \hl{3}`, 540, 1180, 86, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`3 < 7`, 540, 1320, 70, { id: 'm' }));
      } },
    { id: 'algoritmo', name: 'El algoritmo', dur: 31,
      caps: [[0.5, 9.0, 'CON POLINOMIOS', '$P = D · Q + R$: dividendo,', 'divisor, cociente y residuo.'], [9.4, 19.0, 'LO QUE SOBRA', 'El residuo tiene grado', 'menor que el divisor.'],
        [19.4, 30.4, 'COMO LOS NÚMEROS', 'Si el residuo no fuera menor,', 'cabría otra vez el divisor.']],
      narr: [[0.5, 9.0, 'Con polinomios es igual. Dividir P entre D da un cociente Q y un residuo R, y se cumple P igual a D por Q más R.'],
        [9.4, 19.0, 'Lo que sobra ahora se mide con el grado: el residuo tiene grado menor que el divisor.'],
        [19.4, 30.4, 'Por la misma razón que con caramelos: si el residuo fuera de grado mayor o igual, todavía cabría el divisor otra vez.']],
      ev: [[1.0, 'card'], [9.8, 'tag']],
      draw(t) {
        const r = M(R`\id{p}{P} = \id{d}{D} · \id{q}{Q} + \id{r}{R}`, 540, 760, 120, { id: 'a' });
        fade(A(t, 1.6), () => [['p', 'dividendo'], ['d', 'divisor'], ['q', 'cociente'], ['r', 'residuo']].forEach(([k, s], i) => label(s, r.box[k].cx, r.box[k].y1 + 60 + (i % 2) * 50, P.ac, { s: 32 })));
        fade(A(t, 9.8), () => M(R`\t{gr}\,R < \t{gr}\,D`, 540, 1180, 80, { id: 'g' }));
      } },
    { id: 'larga', name: 'Paso a paso', dur: 47,
      caps: [[0.5, 9.0, 'DIVIDIR', '$(2x^{2} + 7x + 8) ÷ (x + 2)$.', ''], [9.4, 18.0, 'PRIMER PASO', 'Cuántas veces cabe $x$ en $2x^{2}$:', '$2x$.'],
        [18.4, 27.0, 'MULTIPLICAR Y RESTAR', '$2x(x + 2) = 2x^{2} + 4x$;', 'queda $3x + 8$.'], [27.4, 36.0, 'SEGUNDO PASO', '$x$ cabe 3 veces en $3x$:', '$3(x + 2) = 3x + 6$; queda 2.'],
        [36.4, 46.4, 'RESULTADO', 'Cociente $2x + 3$,', 'residuo 2.']],
      narr: [[0.5, 9.0, 'Dividamos dos x al cuadrado más siete x más ocho entre x más dos. Se ordena como una división de números.'],
        [9.4, 18.0, 'Primero se mira solo el término mayor: x cabe dos x veces en dos x al cuadrado.'],
        [18.4, 27.0, 'Se multiplica dos x por el divisor, dos x al cuadrado más cuatro x, y se resta. Queda tres x más ocho.'],
        [27.4, 36.0, 'Otra vez: x cabe tres veces en tres x. Tres por x más dos es tres x más seis; al restar, quedan dos.'],
        [36.4, 46.4, 'Dos ya no tiene x: su grado es menor que el del divisor. El cociente es dos x más tres y el residuo, dos.']],
      ev: [[1.0, 'rise'], [9.8, 'tag'], [18.8, 'cut'], [27.8, 'cut'], [36.8, 'card']],
      draw(t) {
        const x0 = 150, y0 = 600;
        fade(A(t, 1.0), () => { M(R`2x^{2} + 7x + 8`, x0, y0, 60, { a: 'l', id: 'dv' }); line(x0 + 470, y0 - 60, x0 + 470, y0 + 20, { w: 4 }); line(x0 + 470, y0 + 20, x0 + 780, y0 + 20, { w: 4 }); M(R`x + 2`, x0 + 500, y0, 60, { a: 'l', id: 'ds' }); });
        fade(A(t, 9.8), () => M(R`2x`, x0 + 500, y0 + 90, 60, { a: 'l', c: P.ac, id: 'q1' }));
        fade(A(t, 18.8), () => { M(R`−(2x^{2} + 4x)`, x0 - 30, y0 + 90, 56, { a: 'l', id: 's1' }); line(x0, y0 + 115, x0 + 420, y0 + 115, { w: 3 }); M(R`3x + 8`, x0 + 160, y0 + 180, 60, { a: 'l', id: 'r1' }); });
        fade(A(t, 27.8), () => { M(R`+ 3`, x0 + 600, y0 + 90, 60, { a: 'l', c: P.ac, id: 'q2' }); M(R`−(3x + 6)`, x0 + 130, y0 + 270, 56, { a: 'l', id: 's2' }); line(x0 + 160, y0 + 295, x0 + 420, y0 + 295, { w: 3 }); M('2', x0 + 330, y0 + 360, 60, { a: 'l', c: P.ac, id: 'r2' }); });
        fade(A(t, 36.8), () => M(R`Q = 2x + 3 \qquad R = 2`, 540, 1300, 76, { id: 'res' }));
      } },
    { id: 'comprobar', name: 'Comprobar', dur: 27,
      caps: [[0.5, 12.0, 'SE COMPRUEBA', '$(x + 2)(2x + 3) + 2$', '$= 2x^{2} + 7x + 6 + 2$.'], [12.4, 26.4, 'Y DA', 'El dividendo:', '$2x^{2} + 7x + 8$.']],
      narr: [[0.5, 12.0, 'Toda división se comprueba: divisor por cociente más residuo. x más dos por dos x más tres es dos x al cuadrado más siete x más seis.'],
        [12.4, 26.4, 'Más el residuo dos: dos x al cuadrado más siete x más ocho. Es el dividendo, así que la división está bien hecha.']],
      ev: [[1.0, 'rise'], [12.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`(x + 2)(2x + 3) + 2`, 540, 700, 76, { id: 'a' }));
        fade(A(t, 3.0), () => M(R`= 2x^{2} + 3x + 4x + 6 + 2`, 540, 860, 66, { id: 'b' }));
        fade(A(t, 12.8), () => M(R`= \hl{2x^{2} + 7x + 8}`, 540, 1020, 76, { id: 'c' }));
      } },
    { id: 'exacta', name: 'División exacta', dur: 33,
      caps: [[0.5, 9.0, 'RESIDUO CERO', '$(x^{3} + 2x^{2} − 5x − 6) ÷ (x + 1)$', 'da residuo 0.'], [9.4, 19.0, 'UN FACTOR', '$x + 1$ cabe justo:', 'es un factor.'],
        [19.4, 32.4, 'SE ESCRIBE', '$(x + 1)(x^{2} + x − 6)$:', 'una multiplicación.']],
      narr: [[0.5, 9.0, 'A veces no sobra nada. Al dividir este polinomio de grado tres entre x más uno, el residuo es cero.'],
        [9.4, 19.0, 'Eso quiere decir que x más uno cabe justo: es un factor del polinomio, como siete es factor de treinta y cinco.'],
        [19.4, 32.4, 'El polinomio queda escrito como una multiplicación: x más uno por x al cuadrado más x menos seis. Y ese segundo factor se puede seguir partiendo.']],
      ev: [[1.0, 'rise'], [9.8, 'yes'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x^{3} + 2x^{2} − 5x − 6 = (x + 1)(x^{2} + x − 6) + \hl{0}`, 540, 760, 54, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`= (x + 1)(x + 3)(x − 2)`, 540, 960, 70, { id: 'b' }));
      } },
    { id: 'grados', name: 'Los grados', dur: 27,
      caps: [[0.5, 12.0, 'EL COCIENTE', R`$\t{gr}\,Q = \t{gr}\,P − \t{gr}\,D$:`, 'los grados se restan.'], [12.4, 26.4, 'EJEMPLO', 'Grado 3 entre grado 1', 'da cociente de grado 2.']],
      narr: [[0.5, 12.0, 'Como al multiplicar los grados se suman, al dividir se restan: el grado del cociente es el del dividendo menos el del divisor.'],
        [12.4, 26.4, 'Un polinomio de grado tres entre uno de grado uno deja un cociente de grado dos, como x al cuadrado más x menos seis.']],
      ev: [[1.0, 'rise'], [12.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\t{gr}\,Q = \t{gr}\,P − \t{gr}\,D`, 540, 760, 80, { id: 'g' }));
        fade(A(t, 12.8), () => M(R`3 − 1 = 2`, 540, 960, 86, { id: 'e' }));
      } },
    { id: 'igualdad', name: 'Polinomios iguales', dur: 39,
      caps: [[0.5, 9.0, 'IGUALES PARA TODO x', 'Dos polinomios son iguales', 'con los mismos coeficientes.'], [9.4, 19.0, 'EJEMPLO', '$(a − 1)x^{2} + bx + 4$', '$= 2x^{2} − 3x + c$.'],
        [19.4, 28.0, 'SE COMPARA', '$a − 1 = 2$, $b = −3$, $c = 4$:', 'término a término.'], [28.4, 38.4, 'OTRO CAMINO', 'Escribir el producto con', 'letras y comparar.']],
      narr: [[0.5, 9.0, 'Dos polinomios que valen lo mismo para todo x tienen exactamente los mismos coeficientes, término por término.'],
        [9.4, 19.0, 'Si a menos uno, x al cuadrado, más b x más cuatro es igual a dos x al cuadrado menos tres x más c, se comparan los términos semejantes.'],
        [19.4, 28.0, 'Los de x al cuadrado: a menos uno es dos, así que a es tres. Los de x: b es menos tres. Los sueltos: c es cuatro.'],
        [28.4, 38.4, 'Eso permite factorizar sin dividir: se escribe x más uno por x al cuadrado más a x más b, se multiplica y se comparan los coeficientes.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'tag'], [28.8, 'card']],
      draw(t) {
        fade(A(t, 9.8), () => M(R`\hl{(a − 1)}x^{2} + \hl{b}x + \hl{4} = 2x^{2} − 3x + c`, 540, 700, 60, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`a = 3 \qquad b = −3 \qquad c = 4`, 540, 880, 66, { id: 'r' }));
        fade(A(t, 28.8), () => { M(R`(x + 1)(x^{2} + ax + b) = x^{3} + (a + 1)x^{2} + (a + b)x + b`, 540, 1080, 44, { id: 'p' }); M(R`b = −6, \;\; a + 1 = 2 \;⇒\; a = 1`, 540, 1200, 56, { id: 'q' }); });
      } },
  ],
  sum: [['El algoritmo', R`P = D · Q + R, \quad \t{gr}\,R < \t{gr}\,D`], ['Ejemplo', R`2x^{2} + 7x + 8 = (x + 2)(2x + 3) + 2`], ['División exacta', R`R = 0 \;⇒\; D \t{ es factor}`], ['Grados', R`\t{gr}\,Q = \t{gr}\,P − \t{gr}\,D`], ['Igualdad', R`\t{mismos coeficientes}`]],
  end: ['Cuando no sobra nada,', 'el divisor es un factor.'],
  finNarr: [[0.8, 9.0, 'En resumen: dividir polinomios da un cociente y un residuo de grado menor que el divisor.'],
    [9.2, 16.0, 'Si el residuo es cero, el divisor es un factor. Y dos polinomios iguales tienen los mismos coeficientes.']],
};
