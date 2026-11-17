// Lección alg-12d · Axiomas de orden y valor absoluto (mundo La Recta Real).
// Positivos y tricotomía; a < b si b − a > 0 (b a la derecha); transitiva; sumar conserva el orden; multiplicar por
// positivo lo conserva y por negativo lo voltea (espejo); valor absoluto como distancia al cero; |b − a| como distancia.
const R = String.raw;
const POSTER = 170;
const LY = 860;
const line10 = (k = 1, ls = 38) => axis({ x0: 110, x1: 960, y: LY, v0: -7, v1: 7, ticks: [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7], k, ls: 32 });
const FILM = {
  lesson: 'alg-12d', world: 'numeros', key: 'A', n: [6, 6],
  title: 'Axiomas de orden y valor absoluto',
  next: 'Razones: comparar dividiendo',
  intro: 'En la recta, unos números quedan a la derecha de otros. Esa idea simple se vuelve reglas precisas, y una de ellas sorprende.',
  examples: ['−4 < −1', '1 < 3', '−2 > −6', '|−5|', '|5 − (−2)|'],
  scenes: [
    { id: 'positivos', name: 'Positivos y negativos', dur: 30,
      caps: [[0.5, 9.0, 'TRES ZONAS', 'Todo real es positivo,', 'cero o negativo.'], [9.4, 19.0, 'TRICOTOMÍA', 'Solo una de las tres,', 'nunca dos a la vez.'],
        [19.4, 29.4, 'LOS POSITIVOS', 'Son cerrados para la', 'suma y el producto.']],
      narr: [[0.5, 9.0, 'El cero parte la recta en dos: a la derecha, los positivos; a la izquierda, los negativos; y en medio, el cero.'],
        [9.4, 19.0, 'Cada número real está exactamente en una de las tres zonas. Esta regla se llama tricotomía: tres partes, y solo una.'],
        [19.4, 29.4, 'Y la suma o el producto de dos positivos siempre es positivo. Estas son las reglas de partida del orden.']],
      ev: [[1.0, 'draw', 1.2], [3.0, 'rise'], [9.8, 'pops', 3], [19.8, 'card']],
      draw(t) {
        const X_ = line10(draw(t, 1.0, 1.2));
        fade(A(t, 3.0), () => { fillP(P.ac, .22, () => X.rect(X_(0) + 12, LY - 40, X_(7) - X_(0), 80)); fillP(P.ink, .08, () => X.rect(X_(-7), LY - 40, X_(0) - X_(-7) - 12, 80)); circ(X_(0), LY, 28, { c: P.ac, w: 5 }); label('negativos', X_(-3.5), LY - 80, P.mute, { s: 40 }); label('positivos', X_(3.5), LY - 80, P.ac, { s: 40 }); label('cero', X_(0), LY + 140, P.ink, { s: 36 }); });
        fade(A(t, 9.8), () => M(R`a > 0 \quad \t{o} \quad a = 0 \quad \t{o} \quad a < 0`, 540, 1340, 66, { id: 'tri' }));
        fade(A(t, 19.8), () => M(R`a > 0, \; b > 0 \;⇒\; a + b > 0, \;\; ab > 0`, 540, 1500, 56, { id: 'pos' }));
      } },
    { id: 'menor', name: 'Menor que', dur: 35,
      caps: [[0.5, 9.0, 'MENOR QUE', '$a < b$: $b$ queda a la', 'derecha de $a$.'], [9.4, 19.0, 'LA DEFINICIÓN', '$a < b$ cuando $b − a$', 'es positivo.'],
        [19.4, 27.0, 'CON NEGATIVOS', '$−4 < −1$ porque', '$−1 − (−4) = 3 > 0$.'], [27.4, 34.4, 'LOS SÍMBOLOS', '$≤$ es «menor o igual»;', '$>$ y $≥$, lo contrario.']],
      narr: [[0.5, 9.0, 'Decimos que a es menor que b cuando b queda a la derecha de a en la recta. La punta del símbolo señala al menor.'],
        [9.4, 19.0, 'La definición precisa: a es menor que b cuando la diferencia b menos a es positiva. Es la distancia que hay que caminar hacia la derecha.'],
        [19.4, 27.0, 'Por eso menos cuatro es menor que menos uno: menos uno menos menos cuatro es tres, positivo. Aunque el cuatro parezca más grande.'],
        [27.4, 34.4, 'Menor o igual incluye la igualdad. Mayor y mayor o igual dicen lo mismo, leyendo al revés.']],
      ev: [[1.0, 'pop'], [9.8, 'draw', 1.0], [19.8, 'draw', 1.2], [22.0, 'yes'], [27.8, 'tag']],
      draw(t) {
        const X_ = line10(1); const [a, b] = t < 19.4 ? [-2, 4] : [-4, -1];
        dot(X_(a), LY, { r: 13 }); dot(X_(b), LY, { r: 13, c: P.ac }); M(t < 19.4 ? 'a' : '−4', X_(a), LY - 50, 50, { pass: true }); M(t < 19.4 ? 'b' : '−1', X_(b), LY - 50, 50, { c: P.ac, pass: true });
        fade(A(t, 9.8), () => brace(X_(a), X_(b), LY + 90, { label: t < 19.4 ? 'b − a > 0' : '3', m: true, k: 1, s: 46 }));
        if (t > 19.4) arrow(X_(-4), LY - 130, X_(-1), LY - 130, { k: draw(t, 19.8, 1.2), c: P.ac, w: 5 });
        fade(A(t, 1.0) * (1 - A(t, 19.2)), () => M(R`a < b`, 540, 1340, 110, { id: 'm' }));
        fade(A(t, 9.8) * (1 - A(t, 19.2)), () => M(R`a < b \;\; ⇔ \;\; b − a > 0`, 540, 1500, 70, { id: 'def' }));
        fade(A(t, 19.8), () => M(R`−1 − (−4) = 3 > 0 \;⇒\; \hl{−4 < −1}`, 540, 1400, 62, { id: 'neg' }));
        fade(A(t, 27.8), () => M(R`≤ \quad ≥ \quad > \quad <`, 540, 1560, 80, { id: 'sim' }));
      } },
    { id: 'transitiva', name: 'Transitiva', dur: 24,
      caps: [[0.5, 11.0, 'TRANSITIVA', 'Si $a < b$ y $b < c$,', 'entonces $a < c$.'], [11.4, 23.4, 'EN LA RECTA', 'Ir a la derecha y otra', 'vez a la derecha.']],
      narr: [[0.5, 11.0, 'Si a es menor que b, y b es menor que c, entonces a es menor que c. Se llama propiedad transitiva.'],
        [11.4, 23.4, 'En la recta es evidente: de a hacia b se va a la derecha, y de b hacia c otra vez a la derecha. c queda a la derecha de a.']],
      ev: [[1.0, 'pops', 3], [11.8, 'draw', 1.0], [13.2, 'draw', 1.0]],
      draw(t) {
        const X_ = line10(1); [[-5, 'a'], [-1, 'b'], [4, 'c']].forEach(([v, s], i) => fade(A(t, 1.0 + i * .3), () => { dot(X_(v), LY, { r: 13, c: i === 2 ? P.ac : P.ink }); M(s, X_(v), LY - 50, 52, { pass: true }); }));
        hop(X_(-5), X_(-1), LY, draw(t, 11.8, 1.0), { c: P.mute, h: 110 }); hop(X_(-1), X_(4), LY, draw(t, 13.2, 1.0), { c: P.mute, h: 110 }); hop(X_(-5), X_(4), LY, draw(t, 15.0, 1.2), { c: P.ac, h: 200, below: true });
        fade(A(t, 1.4), () => M(R`a < b \;\t{ y }\; b < c \;⇒\; a < c`, 540, 1400, 70, { id: 'tr' }));
      } },
    { id: 'sumar', name: 'Sumar conserva el orden', dur: 30,
      caps: [[0.5, 9.0, 'SUMAR', 'Si $a < b$, entonces', '$a + c < b + c$.'], [9.4, 18.0, 'EN LA RECTA', 'Los dos puntos se mueven', 'lo mismo: no se cruzan.'],
        [18.4, 29.4, 'CON NEGATIVOS TAMBIÉN', 'Sumar $−6$ mueve los dos', 'a la izquierda, juntos.']],
      narr: [[0.5, 9.0, 'Si a un lado y al otro de una desigualdad se suma el mismo número, la desigualdad se conserva.'],
        [9.4, 18.0, 'Uno es menor que tres. Si a los dos se les suma cuatro, se mueven juntos cuatro pasos: cinco es menor que siete.'],
        [18.4, 29.4, 'Con un negativo pasa igual. Sumar menos seis los mueve juntos a la izquierda: menos cinco es menor que menos tres. El orden no cambia.']],
      ev: [[1.0, 'rise'], [9.8, 'fly', 1.4], [18.8, 'fly', 1.4]],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: -6, v1: 8, ticks: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8], k: 1, ls: 32 });
        const sh = t < 18.4 ? 4 * eio(seg(t, 9.8, 11.2)) : 4 - 10 * eio(seg(t, 18.8, 20.2));
        [1, 3].forEach((v, i) => { dot(X_(v + sh), LY, { r: 14, c: i ? P.ac : P.ink }); M(String(v + Math.round(sh) < 0 ? '−' + -(v + Math.round(sh)) : v + Math.round(sh)), X_(v + sh), LY - 50, 46, { c: i ? P.ac : P.ink, pass: true }); });
        fade(A(t, 1.0), () => M(R`a < b \;⇒\; a + c < b + c`, 540, 1340, 72, { id: 'reg' }));
        fade(A(t, 11.4) * (1 - A(t, 18.2)), () => M(R`1 < 3 \;⇒\; 1 + 4 < 3 + 4 \;:\; 5 < 7`, 540, 1500, 60, { id: 'e1' }));
        fade(A(t, 20.4), () => M(R`1 + (−6) < 3 + (−6) \;:\; −5 < −3`, 540, 1500, 60, { id: 'e2' }));
      } },
    { id: 'multiplicar', name: 'Multiplicar: la sorpresa', dur: 42,
      caps: [[0.5, 10.0, 'POR UN POSITIVO', 'Si $a < b$ y $c > 0$,', 'entonces $ac < bc$.'], [10.4, 20.0, '!POR UN NEGATIVO', 'Si $c < 0$, el orden', 'se voltea: $ac > bc$.'],
        [20.4, 30.0, 'POR QUÉ', 'Multiplicar por $−1$ refleja', 'la recta en el cero.'], [30.4, 41.4, 'EJEMPLO', '$1 < 3$, pero', '$1 · (−2) > 3 · (−2)$.']],
      narr: [[0.5, 10.0, 'Multiplicar por un positivo estira la recta desde el cero, sin dar vuelta: uno es menor que tres, y dos es menor que seis.'],
        [10.4, 20.0, 'Pero multiplicar por un negativo voltea la desigualdad. Esta es la regla que más se olvida al resolver.'],
        [20.4, 30.0, 'La razón se ve en la recta: multiplicar por menos uno es reflejar en el cero, como un espejo. Lo que estaba a la derecha queda a la izquierda.'],
        [30.4, 41.4, 'Uno es menor que tres. Por menos dos dan menos dos y menos seis, y menos dos es mayor que menos seis. El signo se volteó.']],
      ev: [[1.0, 'draw', 1.4], [10.8, 'doubt'], [20.8, 'shuffle', 2.0], [31.0, 'card']],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: -7, v1: 7, ticks: [-6, -4, -2, 0, 2, 4, 6], k: 1, ls: 38 });
        let f = 1; if (t < 10.4) f = lerp(1, 2, eio(seg(t, 1.0, 2.4))); else f = lerp(1, -2, eio(seg(t, 20.8, 23.0)));
        const pa = 1 * f, pb = 3 * f;
        if (t > 20.4 && t < 23.2) stroke(P.ac, 3, () => { X.moveTo(X_(0), LY - 200); X.lineTo(X_(0), LY + 200); }, { dash: [10, 10] });
        dot(X_(pa), LY, { r: 14 }); dot(X_(pb), LY, { r: 14, c: P.ac });
        M('a', X_(pa), LY - 50, 48, { pass: true }); M('b', X_(pb), LY - 50, 48, { c: P.ac, pass: true });
        fade(A(t, 1.0) * (1 - A(t, 10.2)), () => { M(R`a < b, \; c > 0 \;⇒\; ac < bc`, 540, 1340, 66, { id: 'p' }); fade(A(t, 2.6), () => M(R`1 · 2 < 3 · 2 \;:\; 2 < 6`, 540, 1480, 60, { id: 'pe' })); });
        fade(A(t, 10.8), () => M(R`a < b, \; c < 0 \;⇒\; ac \no{>} bc`, 540, 1340, 66, { id: 'n' }));
        fade(A(t, 31.0), () => M(R`1 · (−2) = −2 \;\no{>}\; −6 = 3 · (−2)`, 540, 1500, 60, { id: 'ne' }));
        fade(A(t, 23.4), () => label('b quedó a la izquierda de a', 540, LY + 150, P.ac, { s: 40 }));
      } },
    { id: 'absoluto', name: 'Valor absoluto', dur: 36,
      caps: [[0.5, 9.0, 'VALOR ABSOLUTO', '$|a|$ es la distancia', 'de $a$ al cero.'], [9.4, 18.0, 'NUNCA NEGATIVO', '$|−5| = 5$ y $|5| = 5$:', 'una distancia no es negativa.'],
        [18.4, 27.0, 'LA DEFINICIÓN', '$|a| = a$ si $a ≥ 0$, y', '$|a| = −a$ si $a < 0$.'], [27.4, 35.4, '!OJO', 'Si $a$ es negativo,', '$−a$ es positivo.']],
      narr: [[0.5, 9.0, 'El valor absoluto de un número es su distancia al cero. Se escribe entre dos barras verticales.'],
        [9.4, 18.0, 'Menos cinco está a cinco pasos del cero, igual que el cinco. Los dos tienen valor absoluto cinco. Una distancia nunca es negativa.'],
        [18.4, 27.0, 'Por eso la definición tiene dos casos. Si a es positivo o cero, se queda igual. Si es negativo, se le cambia el signo: menos a.'],
        [27.4, 35.4, 'Ese menos a no es negativo. Si a es menos cinco, menos a es cinco. El signo menos quiere decir opuesto.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'draw', 1.0], [11.0, 'draw', 1.0], [18.8, 'rise'], [27.8, 'tag']],
      draw(t) {
        const X_ = line10(1);
        dot(X_(0), LY, { r: 10 }); fade(A(t, 1.0), () => { dot(X_(-5), LY, { r: 14, c: P.ac }); dot(X_(5), LY, { r: 14, c: P.ac }); });
        if (t > 9.4) { brace(X_(-5), X_(0), LY + 50, { label: '5', m: true, k: A(t, 9.8), s: 48 }); brace(X_(0), X_(5), LY + 50, { label: '5', m: true, k: A(t, 11.0), s: 48 }); }
        line(X_(0), LY - 70, X_(-5), LY - 70, { k: draw(t, 1.4, 1.0), c: P.ac, w: 6 });
        fade(A(t, 1.2) * (1 - A(t, 18.2)), () => M(R`|−5| = 5 \qquad |5| = 5`, 540, 1340, 80, { id: 'ej' }));
        fade(A(t, 18.8), () => M(R`|a| = a \;\; \t{si } a ≥ 0 \qquad |a| = −a \;\; \t{si } a < 0`, 540, 1340, 50, { id: 'def' }));
        fade(A(t, 27.8), () => M(R`a = −5 \;⇒\; |a| = −(−5) = \hl{5}`, 540, 1500, 64, { id: 'ojo' }));
      } },
    { id: 'distancia', name: 'Distancia entre dos números', dur: 32,
      caps: [[0.5, 9.0, 'DISTANCIA', 'Entre $a$ y $b$ hay', '$|b − a|$ unidades.'], [9.4, 19.0, 'EJEMPLO', 'De $−2$ a 5: $|5 − (−2)|$', '$= |7| = 7$.'],
        [19.4, 31.4, 'EN CUALQUIER ORDEN', '$|a − b| = |b − a|$: ir', 'o volver mide lo mismo.']],
      narr: [[0.5, 9.0, 'El valor absoluto también mide la distancia entre dos números cualesquiera: es el valor absoluto de su diferencia.'],
        [9.4, 19.0, 'De menos dos a cinco: cinco menos menos dos es siete. Hay siete unidades. Se cuentan en la recta y salen siete.'],
        [19.4, 31.4, 'Si se resta al revés, menos dos menos cinco da menos siete, pero su valor absoluto es otra vez siete. Ir o volver mide lo mismo.']],
      ev: [[1.0, 'pops', 2], [9.8, 'draw', 2.1], [19.8, 'draw', 2.1]],
      draw(t) {
        const X_ = line10(1);
        dot(X_(-2), LY, { r: 14 }); dot(X_(5), LY, { r: 14, c: P.ac }); M('−2', X_(-2), LY - 50, 46, { pass: true }); M('5', X_(5), LY - 50, 46, { c: P.ac, pass: true });
        for (let i = 0; i < 7; i++) hop(X_(-2 + i), X_(-1 + i), LY, draw(t, 9.8 + i * .3, .3), { c: P.ac, h: 60 });
        for (let i = 0; i < 7; i++) hop(X_(5 - i), X_(4 - i), LY, draw(t, 19.8 + i * .3, .3), { c: P.mute, h: 60, below: true });
        fade(A(t, 1.0), () => M(R`d(a, b) = |b − a|`, 540, 1340, 80, { id: 'd' }));
        fade(A(t, 12.0), () => M(R`|5 − (−2)| = |7| = \hl{7}`, 540, 1480, 66, { id: 'e1' }));
        fade(A(t, 22.0), () => M(R`|−2 − 5| = |−7| = \hl{7}`, 540, 1600, 66, { id: 'e2' }));
      } },
    { id: 'propiedades', name: 'Propiedades del valor absoluto', dur: 26,
      caps: [[0.5, 12.0, 'TRES PROPIEDADES', '$|a| ≥ 0$, $|−a| = |a|$', 'y $|ab| = |a| · |b|$.'], [12.4, 25.4, 'POR QUÉ LA ÚLTIMA', 'El signo se decide aparte;', 'los tamaños se multiplican.']],
      narr: [[0.5, 12.0, 'Tres propiedades salen enseguida: el valor absoluto nunca es negativo, un número y su opuesto tienen el mismo, y el de un producto es el producto de los valores absolutos.'],
        [12.4, 25.4, 'La última es la ley de los signos otra vez: el signo del producto se decide aparte, y los tamaños simplemente se multiplican. Por ejemplo, menos tres por cinco.']],
      ev: [[1.0, 'rise'], [3.0, 'rise'], [5.0, 'rise'], [13.0, 'card']],
      draw(t) {
        [[R`|a| ≥ 0`, 1.0], [R`|−a| = |a|`, 3.0], [R`|ab| = |a| · |b|`, 5.0]].forEach(([s, t0], i) => fade(A(t, t0), () => M(s, 540, 640 + i * 170, 84, { id: 'p' + i }), (1 - A(t, t0)) * 14));
        fade(A(t, 13.0), () => M(R`|(−3) · 5| = |−15| = 15 = |−3| · |5|`, 540, 1340, 58, { id: 'ej' }));
      } },
  ],
  sum: [['Tricotomía', R`a > 0 \quad \t{o} \quad a = 0 \quad \t{o} \quad a < 0`], ['Menor que', R`a < b \;⇔\; b − a > 0`], ['Sumar', R`a < b \;⇒\; a + c < b + c`],
    ['Multiplicar por c < 0', R`a < b \;⇒\; ac > bc`], ['Valor absoluto', R`|a| = a \;\t{si } a ≥ 0, \quad |a| = −a \;\t{si } a < 0`], ['Distancia', R`d(a, b) = |b − a|`]],
  end: ['Por un negativo, el orden', 'se voltea. No lo olvides.'],
  finNarr: [[0.8, 10.4, 'En resumen: a es menor que b cuando b menos a es positivo. Sumar conserva el orden, y multiplicar por un negativo lo voltea.'],
    [10.6, 17.6, 'El valor absoluto es la distancia al cero, y el valor absoluto de una resta es la distancia entre dos números.']],
};
