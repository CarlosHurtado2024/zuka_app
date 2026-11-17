// Lección alg-3 · Productos notables (mundo Álgebra de Polinomios).
// (x + 2)² con la mesa que crece; (a + b)² (la lámina del mundo); (a − b)²; suma por diferencia (el cuadrado sin esquina);
// (x + a)(x + b); (a + b)³ con un cubo; cálculos de cabeza.
const R = String.raw;
const POSTER = 70;
// cuadrado (a + b)² partido como la lámina: lados en px
function square4(x, y, a, b, o = {}) {
  const k = o.k || (() => 1);
  fade(k(0), () => { fillP(P.ac, .32, () => X.rect(x, y, a, a)); rect(x, y, a, a, { w: 4 }); M(o.la || 'a^{2}', x + a / 2, y + a / 2 + 18, 52, { pass: true }); });
  fade(k(1), () => { fillP(P.ac, .14, () => X.rect(x + a, y, b, a)); rect(x + a, y, b, a, { w: 4 }); M(o.lab || 'ab', x + a + b / 2, y + a / 2 + 16, 42, { pass: true }); });
  fade(k(2), () => { fillP(P.ac, .14, () => X.rect(x, y + a, a, b)); rect(x, y + a, a, b, { w: 4 }); M(o.lab || 'ab', x + a / 2, y + a + b / 2 + 16, 42, { pass: true }); });
  fade(k(3), () => { fillP(P.ac, .5, () => X.rect(x + a, y + a, b, b)); rect(x + a, y + a, b, b, { w: 4 }); M(o.lb || 'b^{2}', x + a + b / 2, y + a + b / 2 + 16, 42, { pass: true }); });
}
const FILM = {
  lesson: 'alg-3', world: 'polinomios', key: 'C', n: [2, 4],
  title: 'Productos notables',
  next: 'Binomio de Newton',
  intro: 'Algunos productos aparecen tanto que vale la pena reconocerlos de un vistazo. Cada uno tiene un dibujo que lo explica.',
  examples: ['(x + 2)²', '31²', '49²', '32 · 28', '(x + 4)(x + 6)', '(a + b)³'],
  scenes: [
    { id: 'mesa', name: 'Una mesa que crece', dur: 34,
      caps: [[0.5, 9.0, 'UNA MESA CUADRADA', 'De lado $x$: se alarga 2', 'por cada lado.'], [9.4, 19.0, '!NO ES $x^{2} + 4$', 'Faltan dos tablas', 'de 2 por $x$.'],
        [19.4, 33.4, 'EL DOBLE PRODUCTO', '$(x + 2)^{2} = x^{2} + 4x + 4$:', 'el $4x$ son las dos tablas.']],
      narr: [[0.5, 9.0, 'Una mesa cuadrada mide x por lado, y se alarga dos unidades por cada lado. La nueva mesa mide x más dos por lado.'],
        [9.4, 19.0, 'Es tentador decir que su área es x al cuadrado más cuatro: la mesa vieja y la esquina. Pero faltan dos tablas largas, de dos por x.'],
        [19.4, 33.4, 'La cuenta completa: x al cuadrado, más dos tablas de dos x, más la esquina de cuatro. Ese cuatro x se llama el doble producto.']],
      ev: [[1.0, 'draw', 1.0], [3.0, 'fly', 1.0], [9.8, 'no'], [11.4, 'pops', 2], [19.8, 'card']],
      draw(t) {
        const a = 330, b = 120, x0 = 300, y0 = 520, g = eo(seg(t, 3.0, 4.0));
        square4(x0, y0, a, b, { la: 'x^{2}', lab: '2x', lb: '4', k: i => (i === 0 ? A(t, 1.0) : i === 3 ? g : A(t, 11.4 + (i - 1) * .4)) });
        fade(A(t, 9.8) * (1 - A(t, 11.4)), () => { stroke(P.no, 4, () => { X.rect(x0 + a, y0, b, a); X.rect(x0, y0 + a, a, b); }, { dash: [10, 8] }); });
        fade(A(t, 1.6), () => { M('x', x0 + a / 2, y0 - 24, 44, { pass: true }); M('2', x0 + a + b / 2, y0 - 24, 44, { c: P.ac, pass: true }); });
        fade(A(t, 9.8) * (1 - A(t, 19.2)), () => M(R`(x + 2)^{2} \no{≠} x^{2} + 4`, 540, 1180, 80, { id: 'no' }));
        fade(A(t, 19.8), () => M(R`(x + 2)^{2} = x^{2} + \hl{4x} + 4`, 540, 1180, 80, { id: 'si' }));
      } },
    { id: 'binomio', name: 'Cuadrado de una suma', dur: 31,
      caps: [[0.5, 9.0, 'LA LÁMINA DEL MUNDO', 'Un cuadrado de lado $a + b$', 'en cuatro piezas.'], [9.4, 19.0, 'LA FÓRMULA', '$(a + b)^{2} = a^{2} + 2ab + b^{2}$.', ''],
        [19.4, 30.4, 'DE CABEZA', '$31^{2} = 900 + 60 + 1 = 961$.', '']],
      narr: [[0.5, 9.0, 'Es la lámina de este mundo: un cuadrado de lado a más b, partido en dos cuadrados y dos rectángulos iguales.'],
        [9.4, 19.0, 'Por eso a más b al cuadrado es a al cuadrado más dos a b más b al cuadrado. El cuadrado de una suma.'],
        [19.4, 30.4, 'Sirve para calcular de cabeza: treinta y uno al cuadrado es treinta más uno al cuadrado. Novecientos, más sesenta, más uno: novecientos sesenta y uno.']],
      ev: [[1.0, 'pops', 4], [9.8, 'card'], [19.8, 'rise']],
      draw(t) {
        square4(320, 520, 300, 140, { k: i => A(t, 1.0 + i * .4) });
        fade(A(t, 1.6), () => { M('a', 470, 496, 44, { pass: true }); M('b', 690, 496, 44, { pass: true }); M('a', 290, 690, 44, { pass: true }); M('b', 290, 910, 44, { pass: true }); });
        fade(A(t, 9.8), () => M(R`(a + b)^{2} = a^{2} + \hl{2ab} + b^{2}`, 540, 1180, 80, { id: 'f' }));
        fade(A(t, 19.8), () => M(R`31^{2} = (30 + 1)^{2} = 900 + 60 + 1 = \hl{961}`, 540, 1360, 62, { id: 'e' }));
      } },
    { id: 'resta', name: 'Cuadrado de una resta', dur: 33,
      caps: [[0.5, 9.0, 'CON UNA RESTA', '$(a − b)^{2} = a^{2} − 2ab + b^{2}$:', 'el doble producto resta.'], [9.4, 19.0, 'POR QUÉ', 'Es $(a + (−b))^{2}$: el doble', 'producto lleva el signo.'],
        [19.4, 32.4, 'DE CABEZA', '$49^{2} = (50 − 1)^{2}$', '$= 2500 − 100 + 1 = 2401$.']],
      narr: [[0.5, 9.0, 'Con una resta, el cuadrado tiene los mismos tres términos, pero el doble producto lleva signo menos.'],
        [9.4, 19.0, 'La razón: a menos b es a más menos b. Con la fórmula de la suma, el doble producto queda negativo y el último sigue positivo.'],
        [19.4, 32.4, 'Cuarenta y nueve al cuadrado es cincuenta menos uno al cuadrado: dos mil quinientos, menos cien, más uno. Dos mil cuatrocientos uno.']],
      ev: [[1.0, 'card'], [9.8, 'rise'], [19.8, 'rise']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`(a − b)^{2} = a^{2} \hl{− 2ab} + b^{2}`, 540, 700, 80, { id: 'f' }));
        fade(A(t, 9.8), () => M(R`(a + (−b))^{2} = a^{2} + 2a(−b) + (−b)^{2}`, 540, 900, 60, { id: 'p' }));
        fade(A(t, 19.8), () => M(R`49^{2} = (50 − 1)^{2} = 2500 − 100 + 1 = \hl{2401}`, 540, 1140, 60, { id: 'e' }));
      } },
    { id: 'sumadif', name: 'Suma por diferencia', dur: 37,
      caps: [[0.5, 9.0, 'UN CUADRADO SIN ESQUINA', 'Lado $a$, y se le quita', 'una esquina de lado $b$.'], [9.4, 19.0, 'SE MUEVE UNA TIRA', 'Queda un rectángulo de', '$a + b$ por $a − b$.'],
        [19.4, 28.0, 'LA FÓRMULA', '$(a + b)(a − b) = a^{2} − b^{2}$.', ''], [28.4, 36.4, 'DE CABEZA', '$32 · 28 = 30^{2} − 2^{2}$', '$= 900 − 4 = 896$.']],
      narr: [[0.5, 9.0, 'A un cuadrado de lado a se le quita una esquina cuadrada de lado b. Lo que queda tiene área a al cuadrado menos b al cuadrado.'],
        [9.4, 19.0, 'Ahora se corta la tira de abajo y se pone de pie al lado. Se forma un rectángulo: de largo a más b y de ancho a menos b.'],
        [19.4, 28.0, 'Así que a más b por a menos b es a al cuadrado menos b al cuadrado. Suma por diferencia, diferencia de cuadrados.'],
        [28.4, 36.4, 'Treinta y dos por veintiocho es treinta más dos por treinta menos dos: novecientos menos cuatro, ochocientos noventa y seis.']],
      ev: [[1.0, 'draw', 1.0], [3.0, 'cut'], [9.8, 'shuffle', 1.6], [19.8, 'card'], [28.8, 'rise']],
      draw(t) {
        const a = 420, b = 140, x0 = 280, y0 = 500, mv = eio(seg(t, 9.8, 11.4));
        fade(A(t, 1.0), () => { fillP(P.ac, .3, () => X.rect(x0, y0, a - b, a - b)); rect(x0, y0, a - b, a - b, { w: 4 });
          fade(1 - A(t, 3.0) * .9, () => { stroke(P.no, 4, () => X.rect(x0 + a - b, y0 + a - b, b, b), { dash: [10, 8] }); });
          fillP(P.ac, .3, () => X.rect(x0 + a - b, y0, b, a - b)); rect(x0 + a - b, y0, b, a - b, { w: 4 });
          const bx = lerp(x0, x0 + a, mv), by = lerp(y0 + a - b, y0, mv); X.save(); X.translate(bx, by); if (mv > 0) { X.translate(b * mv, 0); X.rotate(Math.PI / 2 * mv); X.translate(-b * mv, 0); } fillP(P.ac, .5, () => X.rect(0, 0, a - b, b)); rect(0, 0, a - b, b, { w: 4 }); X.restore(); });
        fade(A(t, 1.6), () => { M('a', x0 + a / 2, y0 - 20, 44, { pass: true }); M('b', x0 + a - b / 2, y0 + a + 50, 40, { c: P.no, pass: true }); });
        fade(A(t, 11.6), () => { brace(x0, x0 + a + b, y0 + a - b + 20, { label: 'a + b', m: true, k: 1, s: 44 }); });
        fade(A(t, 19.8), () => M(R`(a + b)(a − b) = a^{2} − b^{2}`, 540, 1240, 76, { id: 'f' }));
        fade(A(t, 28.8), () => M(R`32 · 28 = 30^{2} − 2^{2} = \hl{896}`, 540, 1400, 70, { id: 'e' }));
      } },
    { id: 'comun', name: 'Un término común', dur: 33,
      caps: [[0.5, 9.0, 'DOS BINOMIOS', '$(x + 4)(x + 6)$: los dos', 'empiezan con $x$.'], [9.4, 19.0, 'EL RECTÁNGULO', '1 cuadrado, $4 + 6 = 10$', 'barras y $4 · 6 = 24$ cuadritos.'],
        [19.4, 32.4, 'LA REGLA', '$(x + a)(x + b)$', '$= x^{2} + (a + b)x + ab$.']],
      narr: [[0.5, 9.0, 'Cuando dos binomios comparten la x, como x más cuatro por x más seis, el producto tiene un patrón fácil.'],
        [9.4, 19.0, 'El rectángulo tiene un cuadrado, cuatro más seis barras, diez, y cuatro por seis cuadritos, veinticuatro.'],
        [19.4, 32.4, 'En general: x al cuadrado, más la suma de los números por x, más su producto. Es la clave para factorizar en la lección que viene.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 12], [19.8, 'card']],
      draw(t) {
        const s = .72; X.save(); X.translate(250, 470); X.scale(s, s); areaModel(0, 60, 4, 6, { k: i => A(t, 9.8 + i * .07, .25), sa: A(t, 1.0) }); X.restore();
        fade(A(t, 1.0), () => M(R`(x + 4)(x + 6)`, 540, 1180, 76, { id: 'e' }));
        fade(A(t, 10.4), () => M(R`= x^{2} + \hl{10}x + \hl{24}`, 540, 1300, 76, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`(x + a)(x + b) = x^{2} + (a + b)\,x + ab`, 540, 1460, 62, { id: 'g' }));
      } },
    { id: 'cubo', name: 'El cubo de una suma', dur: 33,
      caps: [[0.5, 9.0, 'UN CUBO', 'De arista $a + b$:', 'se parte en ocho piezas.'], [9.4, 19.0, 'LAS PIEZAS', '$a^{3}$, tres $a^{2}b$,', 'tres $ab^{2}$ y $b^{3}$.'],
        [19.4, 32.4, 'LA FÓRMULA', '$(a + b)^{3} = a^{3} + 3a^{2}b$', '$+ 3ab^{2} + b^{3}$.']],
      narr: [[0.5, 9.0, 'Lo mismo pasa en tres dimensiones. Un cubo de arista a más b se parte, con tres cortes, en ocho piezas.'],
        [9.4, 19.0, 'Hay un cubo grande, a al cubo; tres placas de a por a por b; tres barras de a por b por b; y un cubito, b al cubo.'],
        [19.4, 32.4, 'Por eso a más b al cubo es a al cubo, más tres a al cuadrado b, más tres a b al cuadrado, más b al cubo. Los coeficientes uno, tres, tres, uno volverán en la próxima lección.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'pops', 8], [19.8, 'card']],
      draw(t) {
        const cx = 330, cy = 640, a = 260, b = 110, d = .5, k = draw(t, 1.0, 1.4), s = a + b;
        const face = (pts, f) => poly(pts, { k, w: 4, fill: f });
        face([[cx, cy + s * d], [cx + s, cy + s * d], [cx + s, cy + s * d + s], [cx, cy + s * d + s]], .2);
        face([[cx, cy + s * d], [cx + s * d, cy], [cx + s + s * d, cy], [cx + s, cy + s * d]], .35);
        face([[cx + s, cy + s * d], [cx + s + s * d, cy], [cx + s + s * d, cy + s], [cx + s, cy + s * d + s]], .1);
        fade(A(t, 2.6), () => { line(cx + a, cy + s * d, cx + a, cy + s * d + s, { w: 3, c: P.ac }); line(cx, cy + s * d + a, cx + s, cy + s * d + a, { w: 3, c: P.ac }); line(cx + a + s * d * 0, cy + s * d, cx + a + s * d, cy, { w: 3, c: P.ac }); });
        [['a^{3}', 9.8], ['3a^{2}b', 10.6], ['3ab^{2}', 11.4], ['b^{3}', 12.2]].forEach(([s_, t0], i) => fade(A(t, t0), () => M(s_, 900, 620 + i * 110, 52, { a: 'r', c: i === 0 ? P.ac : P.ink, pass: true })));
        fade(A(t, 19.8), () => M(R`(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}`, 540, 1300, 62, { id: 'f' }));
      } },
    { id: 'usar', name: 'Usarlos', dur: 26,
      caps: [[0.5, 12.0, 'RECONOCER', 'Un producto notable se', 'desarrolla sin multiplicar.'], [12.4, 25.4, 'Y AL REVÉS', 'Reconocer $x^{2} + 6x + 9$', 'es ver $(x + 3)^{2}$.']],
      narr: [[0.5, 12.0, 'La ventaja de los productos notables es que se escriben sin multiplicar término por término: se reconoce la forma y se aplica la fórmula.'],
        [12.4, 25.4, 'Y al revés: reconocer un desarrollo, como x al cuadrado más seis x más nueve, permite escribirlo como un producto: x más tres al cuadrado. Eso es factorizar.']],
      ev: [[1.0, 'rise'], [12.8, 'shuffle', 1.2]],
      draw(t) {
        [[R`(x + 3)^{2} = x^{2} + 6x + 9`, 1.0], [R`(y − 5)^{2} = y^{2} − 10y + 25`, 2.0], [R`(2m + 1)(2m − 1) = 4m^{2} − 1`, 3.0]].forEach(([s, t0], i) => fade(A(t, t0), () => M(s, 540, 640 + i * 140, 62, { id: 'u' + i })));
        fade(A(t, 12.8), () => M(R`x^{2} + 6x + 9 \;→\; \hl{(x + 3)^{2}}`, 540, 1180, 70, { id: 'f' }));
      } },
  ],
  sum: [['Cuadrado de una suma', R`(a + b)^{2} = a^{2} + 2ab + b^{2}`], ['Cuadrado de una resta', R`(a − b)^{2} = a^{2} − 2ab + b^{2}`], ['Suma por diferencia', R`(a + b)(a − b) = a^{2} − b^{2}`],
    ['Término común', R`(x + a)(x + b) = x^{2} + (a + b)x + ab`], ['Cubo', R`(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}`]],
  end: ['Cada producto notable', 'tiene un dibujo que lo explica.'],
  finNarr: [[0.8, 9.0, 'En resumen: el cuadrado de un binomio tiene un doble producto, y la suma por la diferencia da una diferencia de cuadrados.'],
    [9.2, 16.0, 'Con un término común se suman y se multiplican los números, y el cubo tiene coeficientes uno, tres, tres, uno.']],
};
