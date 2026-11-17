// Lección alg-11 · Los números naturales y los enteros (mundo La Recta Real).
// ℕ para contar, en la recta; cerrado para + y ·, no para −; ℤ con el cero y los negativos; opuesto; sumar enteros como
// desplazamientos; ℕ ⊆ ℤ. Ejemplos distintos de los ejercicios (termómetro 4 − 9, opuesto de 8, −3 + 7, 5 + (−8)).
const R = String.raw;
const POSTER = 120;
const LY = 860;                                            // altura de la recta
const zAxis = (t, k, v0 = -7, v1 = 7) => axis({ x0: 110, x1: 960, y: LY, v0, v1, ticks: Array.from({ length: v1 - v0 + 1 }, (_, i) => v0 + i), k, ls: 34 });
const FILM = {
  lesson: 'alg-11', world: 'numeros', key: 'A', n: [1, 6],
  title: 'Los números naturales y los enteros',
  next: 'Los números racionales: fracciones y decimales',
  intro: 'Los números también forman conjuntos. Empezamos por los que sirven para contar, y vemos por qué hizo falta inventar los negativos.',
  examples: ['4 − 9', '−3 + 7', '5 + (−8)', 'opuesto de 8', '12 ∈'],
  scenes: [
    { id: 'contar', name: 'Los naturales', dur: 27,
      caps: [[0.5, 9.0, 'NATURALES', 'Los números para contar:', R`$ℕ = \{1, 2, 3, …\}$.`], [9.4, 17.4, 'NO SE ACABAN', 'Después de cada natural', 'viene otro: $n + 1$.'],
        [17.8, 26.4, 'PERTENENCIA', '$12 ∈ ℕ$, pero $0 ∉ ℕ$', 'y $−1 ∉ ℕ$.']],
      narr: [[0.5, 9.0, 'Los primeros números que aprendemos sirven para contar: uno, dos, tres. Forman el conjunto de los naturales, que se escribe con una N de doble trazo.'],
        [9.4, 17.4, 'No se acaban: después de cualquier natural viene el siguiente, sumándole uno. Por eso se escriben los primeros y tres puntos.'],
        [17.8, 26.4, 'Doce es natural. El cero y el menos uno no lo son: con ellos no se cuenta. En este curso, los naturales empiezan en uno.']],
      ev: [[0.8, 'pops', 5], [3.6, 'count', 0], [4.2, 'count', 1], [4.8, 'count', 2], [9.8, 'draw', 1.2], [18.2, 'yes'], [20.4, 'no']],
      draw(t) {
        for (let i = 0; i < 5; i++) { const k = A(t, .8 + i * .2, .4), x = 230 + i * 150; fade(k, () => { circ(x, 620, 46, { fill: .25, w: 5 }); if (t > 3.6 + i * .6) T(String(i + 1), x, 720, { s: 44, w: 600, c: P.ac, a: 'c', pass: true }); }, (1 - k) * -30); }
        const X_ = axis({ x0: 110, x1: 960, y: LY + 60, v0: 0, v1: 12, ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], k: draw(t, 9.8, 1.4), ls: 40 });
        for (let v = 1; v <= 12; v++) if (t > 10.4 + v * .18) dot(X_(v), LY + 60, { r: 10, c: P.ac });
        fade(A(t, 1.2), () => M(R`ℕ = \{1, 2, 3, 4, …\}`, 540, 1290, 80, { id: 'N' }));
        fade(A(t, 11.0), () => M(R`n ∈ ℕ \;⇒\; n + 1 ∈ ℕ`, 540, 1430, 60, { id: 'sig' }));
        fade(A(t, 18.2), () => M(R`12 \hl{∈} ℕ \qquad 0 \no{∉} ℕ \qquad −1 \no{∉} ℕ`, 540, 1590, 62, { id: 'pert' }));
      } },
    { id: 'cerrado', name: 'Sumar y multiplicar', dur: 31,
      caps: [[0.5, 9.0, 'SUMAR', 'Sumar naturales es avanzar', 'a la derecha: $3 + 4 = 7$.'], [9.4, 18.0, 'MULTIPLICAR', 'Es sumar varias veces', 'lo mismo: $3 · 4 = 12$.'],
        [18.4, 30.4, 'ℕ ES CERRADO', 'Para la suma y el producto:', 'el resultado sigue en $ℕ$.']],
      narr: [[0.5, 9.0, 'En la recta, sumar es avanzar. Se parte del tres y se dan cuatro pasos a la derecha: se llega al siete.'],
        [9.4, 18.0, 'Multiplicar tres por cuatro es dar cuatro saltos de tres. Se llega al doce.'],
        [18.4, 30.4, 'Sumando o multiplicando naturales siempre se cae en otro natural. Por eso se dice que los naturales son cerrados para la suma y el producto.']],
      ev: [[1.0, 'draw', 1.2], [2.6, 'pop', 0], [3.2, 'pop', 1], [3.8, 'pop', 2], [4.4, 'pop', 3], [9.8, 'pop', 0], [10.6, 'pop', 1], [11.4, 'pop', 2], [12.2, 'pop', 3], [19.0, 'card']],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: 0, v1: 13, ticks: Array.from({ length: 13 }, (_, i) => i + 1), k: draw(t, .5, 1.0), ls: 40 });
        const p2 = t > 9.4;
        if (!p2) { dot(X_(3), LY, { r: 13, c: P.ac }); for (let i = 0; i < 4; i++) hop(X_(3 + i), X_(4 + i), LY, draw(t, 2.6 + i * .6, .5), { c: P.ac }); if (t > 5) dot(X_(7), LY, { r: 13, c: P.ac, ping: ping(t, 5.0) }); }
        else { dot(X_(0), LY, { r: 9, hollow: true }); for (let i = 0; i < 4; i++) hop(X_(3 * i), X_(3 * i + 3), LY, draw(t, 9.8 + i * .8, .6), { c: P.ac, label: i === 0 ? '+3' : null }); if (t > 13.2) dot(X_(12), LY, { r: 13, c: P.ac, ping: ping(t, 13.2) }); }
        fade(A(t, 1.2) * (1 - A(t, 9.2)), () => M(R`3 + 4 = \hl{7}`, 540, 1300, 96, { id: 's' }), (1 - A(t, 1.2)) * 14);
        fade(A(t, 9.6), () => M(R`3 · 4 = 3 + 3 + 3 + 3 = \hl{12}`, 540, 1300, 74, { id: 'p' }), (1 - A(t, 9.6)) * 14);
        fade(A(t, 19.0), () => { M(R`a, b ∈ ℕ \;⇒\; a + b ∈ ℕ \quad \t{y} \quad a · b ∈ ℕ`, 540, 1500, 50, { id: 'cer' }); });
      } },
    { id: 'resta', name: 'La resta se escapa', dur: 31,
      caps: [[0.5, 9.0, 'RESTAR', 'Restar es devolverse:', '$9 − 4 = 5$ sí da natural.'], [9.4, 19.0, '!PERO NO SIEMPRE', '$4 − 9$: se pasa del 1', 'y no cae en ningún natural.'],
        [19.4, 30.4, 'EL TERMÓMETRO', 'Hacen 4 °C y la temperatura', 'baja 9 °C: quedan $−5$ °C.']],
      narr: [[0.5, 9.0, 'Restar es devolverse a la izquierda. Nueve menos cuatro: desde el nueve, cuatro pasos atrás. Da cinco, que es natural.'],
        [9.4, 19.0, 'Pero cuatro menos nueve no funciona: desde el cuatro, a los cuatro pasos ya no hay naturales. La resta se escapa de los naturales.'],
        [19.4, 30.4, 'Y la vida sí necesita ese resultado. Si hacen cuatro grados y la temperatura baja nueve, quedan cinco grados bajo cero: menos cinco.']],
      ev: [[1.4, 'pop', 0], [2.0, 'pop', 1], [2.6, 'pop', 2], [3.2, 'pop', 3], [10.0, 'pop', 0], [10.6, 'pop', 1], [11.2, 'pop', 2], [11.8, 'pop', 3], [12.6, 'no'], [20.0, 'draw', 1.4]],
      draw(t) {
        const ext = A(t, 19.6, 1.0), v0 = Math.round(lerp(0, -7, ext));
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: lerp(0, -7, ext), v1: lerp(13, 7, ext), ticks: Array.from({ length: 21 }, (_, i) => i - 7).filter(v => v >= -7 && (v >= 1 || ext > .99)), k: 1, ls: 40 });
        if (t < 9.4) { for (let i = 0; i < 4; i++) hop(X_(9 - i), X_(8 - i), LY, draw(t, 1.4 + i * .6, .5), { c: P.ac }); if (t > 4) dot(X_(5), LY, { r: 13, c: P.ac, ping: ping(t, 4) }); }
        else if (t < 19.4) { for (let i = 0; i < 4; i++) hop(X_(4 - i), X_(3 - i), LY, draw(t, 10.0 + i * .6, .5), { c: i === 3 ? P.no : P.ac }); fade(A(t, 12.6), () => { circ(X_(0), LY, 34, { c: P.no, w: 5 }); label('aquí no hay natural', X_(0) + 30, LY + 130, P.no, { s: 36, a: 'l' }); }); }
        else { // termómetro: la recta se pone de pie
          fade(A(t, 20.0), () => { const tx = 220, ty = (v) => 1180 - (v + 7) * 40; rect(tx - 22, ty(7), 44, ty(-7) - ty(7), { r: 22, w: 5 }); const lv = lerp(4, -5, eio(seg(t, 22.0, 25.0))); fillP(P.ac, .6, () => X.roundRect(tx - 12, ty(lv), 24, ty(-7) - ty(lv) + 10, 12)); for (const v of [-5, 0, 4]) { line(tx + 30, ty(v), tx + 56, ty(v), { w: 4 }); M((v < 0 ? '−' + -v : v) + ' °C', tx + 70, ty(v) + 14, 38, { a: 'l', pass: true }); } });
        }
        if (t < 19.4) { fade(A(t, 1.0) * (1 - A(t, 9.2)), () => M(R`9 − 4 = \hl{5} ∈ ℕ`, 540, 1320, 86, { id: 'ok' })); fade(A(t, 10.0), () => M(R`4 − 9 = \no{…}`, 540, 1320, 86, { id: 'mal' })); fade(A(t, 13.0), () => label('ningún natural sirve', 540, 1440, P.no, { s: 44 })); }
        else fade(A(t, 25.2), () => M(R`4 − 9 = \hl{−5}`, 540, 1440, 96, { id: 'neg' }), (1 - A(t, 25.2)) * 14);
      } },
    { id: 'enteros', name: 'Los enteros', dur: 30,
      caps: [[0.5, 9.0, 'ENTEROS', 'Se agregan el cero y', 'los negativos: $ℤ$.'], [9.4, 19.0, 'EN LA RECTA', 'A la izquierda del cero,', 'el reflejo de los naturales.'],
        [19.4, 29.4, 'EL CERO', 'No es positivo', 'ni negativo.']],
      narr: [[0.5, 9.0, 'Para que la resta siempre tenga respuesta se agregan el cero y los negativos. Juntos forman los enteros, con una Z de doble trazo.'],
        [9.4, 19.0, 'En la recta, los negativos son el reflejo de los naturales al otro lado del cero: menos uno, menos dos, menos tres…'],
        [19.4, 29.4, 'El cero queda en el medio. No es positivo ni negativo: es la frontera.']],
      ev: [[1.0, 'draw', 1.2], [9.8, 'pops', 7], [19.8, 'pop']],
      draw(t) {
        const X_ = zAxis(t, 1);
        for (let v = 1; v <= 7; v++) dot(X_(v), LY, { r: 10, c: P.ac });
        for (let v = 1; v <= 7; v++) { const k = draw(t, 9.8 + v * .2, .7); if (k <= 0) continue; const x = lerp(X_(v), X_(-v), k), y = LY - Math.sin(Math.PI * k) * (60 + v * 18); dot(x, y, { r: 10, c: P.mute }); }
        fade(A(t, 19.6), () => { circ(X_(0), LY, 30, { c: P.ac, w: 5 }); label('ni positivo ni negativo', X_(0), LY - 70, P.ac, { s: 36 }); label('negativos', X_(-4), LY + 150, P.mute, { s: 36 }); label('positivos', X_(4), LY + 150, P.mute, { s: 36 }); });
        fade(A(t, 1.2), () => M(R`ℤ = \{…, −3, −2, −1, 0, 1, 2, 3, …\}`, 540, 1340, 58, { id: 'Z' }));
        fade(A(t, 20.0), () => M(R`ℤ = \{…, −2, −1\} ∪ \{0\} ∪ ℕ`, 540, 1490, 54, { id: 'Z2' }));
      } },
    { id: 'usos', name: 'Los negativos en la vida', dur: 29,
      caps: [[0.5, 9.0, 'LOS NEGATIVOS', 'Miden lo que queda por', 'debajo de un cero.'], [9.4, 18.0, 'EJEMPLOS', 'Sótanos, deudas y alturas', 'bajo el nivel del mar.'],
        [18.4, 28.4, 'EL CERO', 'Es un punto de referencia', 'que alguien eligió.']],
      narr: [[0.5, 9.0, 'Los negativos sirven para todo lo que queda por debajo de un punto de partida, y la recta se puede parar como un ascensor.'],
        [9.4, 18.0, 'El segundo sótano es menos dos. Un submarino a trescientos metros de profundidad está a menos trescientos. Una deuda de veinte mil pesos es menos veinte mil.'],
        [18.4, 28.4, 'En cada caso el cero es una referencia que alguien eligió: la planta baja, el nivel del mar o no deber nada.']],
      ev: [[0.8, 'draw', 1.2], [3.0, 'pop'], [9.8, 'pop', 1], [12.4, 'pop', 2], [15.0, 'pop', 3], [18.8, 'draw', 1.0]],
      draw(t) {
        const x = 260; arrow(x, 1280, x, lerp(1280, 470, draw(t, .8, 1.2)), { w: 6, h: 28 });
        fade(A(t, 1.6), () => { line(x - 16, 860, x + 16, 860, { w: 5 }); M('0', x - 50, 876, 46, { pass: true }); });
        const items = [[3, 700, '+3', 'tercer piso', 3.0], [-2, 960, '−2', 'segundo sótano', 9.8], [-300, 1070, '−300', 'metros: un submarino', 12.4], [-20000, 1180, '−20 000', 'pesos: una deuda', 15.0]];
        items.forEach(([v, y, s, txt, t0]) => fade(A(t, t0, .4), () => { dot(x, y, { r: 12, c: v < 0 ? P.ac : P.ink, ping: ping(t, t0) }); line(x + 20, y, x + 70, y, { w: 3, c: P.mute }); M(s, x + 90, y + 18, 56, { a: 'l', c: v < 0 ? P.ac : P.ink, pass: true }); label(txt, x + 110 + mWidth(s, 56), y + 14, P.mute, { s: 36, a: 'l', pass: true }); }));
        fade(A(t, 18.8), () => { stroke(P.ac, 3, () => { X.moveTo(120, 860); X.lineTo(lerp(120, 990, draw(t, 18.8, 1.0)), 860); }, { dash: [14, 12] }); label('planta baja · nivel del mar · sin deudas', 600, 830, P.ac, { s: 32 }); });
        fade(A(t, 3.4), () => label('la recta, de pie', x, 440, P.mute, { s: 34, pass: true }));
      } },
    { id: 'opuesto', name: 'El opuesto', dur: 34,
      caps: [[0.5, 9.0, 'OPUESTO', 'El opuesto de 8 es $−8$:', 'misma distancia al cero.'], [9.4, 18.0, 'SUMAN CERO', '$8 + (−8) = 0$: ir y', 'devolverse lo mismo.'],
        [18.4, 26.0, 'EL SIGNO −', 'Se lee «el opuesto de»:', '$−a$ es el opuesto de $a$.'], [26.4, 33.4, 'DOS VECES', 'El opuesto del opuesto', 'es el mismo: $−(−8) = 8$.']],
      narr: [[0.5, 9.0, 'Cada entero tiene un opuesto al otro lado del cero, a la misma distancia. El opuesto de ocho es menos ocho.'],
        [9.4, 18.0, 'Un número y su opuesto suman cero: avanzar ocho y devolverse ocho deja en el mismo lugar.'],
        [18.4, 26.0, 'Por eso el signo menos delante de un número se lee: el opuesto de. Menos a es el opuesto de a.'],
        [26.4, 33.4, 'Y si se toma el opuesto dos veces, se vuelve al número del principio: el opuesto de menos ocho es ocho.']],
      ev: [[1.0, 'fly', 1.4], [9.8, 'draw', .8], [11.0, 'draw', .8], [12.0, 'card'], [26.8, 'fly', 1.0], [28.0, 'fly', 1.0]],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: -10, v1: 10, ticks: [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10], k: 1, ls: 38 });
        dot(X_(8), LY, { r: 13, c: P.ac });
        const k = draw(t, 1.0, 1.4); if (k > 0 && t < 9.4) { const x = lerp(X_(8), X_(-8), k); dot(x, LY - Math.sin(Math.PI * k) * 200, { r: 13, c: P.ac }); }
        if (t > 2.4) { dot(X_(-8), LY, { r: 13, c: P.ac }); brace(X_(0), X_(8), LY + 110, { label: '8', m: true, k: A(t, 3.0), s: 46 }); brace(X_(-8), X_(0), LY + 110, { label: '8', m: true, k: A(t, 3.4), s: 46 }); }
        if (t > 9.4 && t < 26) { hop(X_(0), X_(8), LY, draw(t, 9.8, .8), { c: P.ac, label: '+8', h: 150 }); hop(X_(8), X_(0), LY, draw(t, 11.0, .8), { c: P.mute, label: '−8', below: true, h: 150 }); }
        if (t > 26.4) { const k1 = draw(t, 26.8, 1.0), k2 = draw(t, 28.0, 1.0); hop(X_(8), X_(-8), LY, k1, { c: P.mute, h: 220 }); hop(X_(-8), X_(8), LY, k2, { c: P.ac, below: true, h: 220 }); }
        fade(A(t, 1.6) * (1 - A(t, 9.2)), () => M(R`\t{opuesto de } 8 = −8`, 540, 1340, 76, { id: 'op' }));
        fade(A(t, 9.8) * (1 - A(t, 26.2)), () => M(R`8 + (−8) = \hl{0}`, 540, 1340, 86, { id: 'cero' }));
        fade(A(t, 18.6) * (1 - A(t, 26.2)), () => M(R`a + (−a) = 0`, 540, 1500, 72, { id: 'gen' }));
        fade(A(t, 26.8), () => { M(R`−(−8) = \hl{8}`, 540, 1340, 92, { id: 'dob' }); M(R`−(−a) = a`, 540, 1500, 72, { id: 'dobg' }); });
      } },
    { id: 'sumar', name: 'Sumar enteros', dur: 33,
      caps: [[0.5, 10.0, 'SUMAR ES MOVERSE', 'Positivo: a la derecha.', 'Negativo: a la izquierda.'], [10.4, 20.0, 'EJEMPLO', '$−3 + 7$: desde $−3$,', 'siete pasos a la derecha.'],
        [20.4, 32.4, 'OTRO EJEMPLO', '$5 + (−8)$: desde 5,', 'ocho pasos a la izquierda.']],
      narr: [[0.5, 10.0, 'Con los enteros, sumar es moverse en la recta. Sumar un positivo es caminar a la derecha; sumar un negativo, caminar a la izquierda.'],
        [10.4, 20.0, 'Menos tres más siete: se arranca en menos tres y se dan siete pasos a la derecha. Se llega al cuatro.'],
        [20.4, 32.4, 'Cinco más menos ocho: se arranca en cinco y se dan ocho pasos a la izquierda. Se cruza el cero y se llega a menos tres.']],
      ev: [[1.2, 'draw', 1.0], [5.4, 'draw', 1.0], [11.0, 'draw', 2.2], [14.0, 'yes'], [21.0, 'draw', 2.4], [24.0, 'yes']],
      draw(t) {
        const X_ = zAxis(t, 1);
        if (t < 10.4) { arrow(X_(0), LY - 120, X_(3), LY - 120, { k: draw(t, 1.2, 1), c: P.ac }); M('+', X_(1.5), LY - 150, 60, { c: P.ac, pass: true }); fade(A(t, 5.4), () => { arrow(X_(0), LY + 140, X_(-3), LY + 140, { k: draw(t, 5.4, 1), c: P.mute }); M('−', X_(-1.5), LY + 110, 60, { c: P.mute, pass: true }); }); }
        else if (t < 20.4) { dot(X_(-3), LY, { r: 13 }); for (let i = 0; i < 7; i++) hop(X_(-3 + i), X_(-2 + i), LY, draw(t, 11.0 + i * .3, .35), { c: P.ac, h: 70 }); if (t > 13.4) dot(X_(4), LY, { r: 13, c: P.ac, ping: ping(t, 13.4) }); }
        else { dot(X_(5), LY, { r: 13 }); for (let i = 0; i < 8; i++) hop(X_(5 - i), X_(4 - i), LY, draw(t, 21.0 + i * .3, .35), { c: P.ac, h: 70 }); if (t > 23.8) dot(X_(-3), LY, { r: 13, c: P.ac, ping: ping(t, 23.8) }); }
        fade(A(t, 10.8) * (1 - A(t, 20.2)), () => M(R`−3 + 7 = \hl{4}`, 540, 1340, 92, { id: 'e1' }), (1 - A(t, 10.8)) * 14);
        fade(A(t, 20.8), () => M(R`5 + (−8) = \hl{−3}`, 540, 1340, 92, { id: 'e2' }), (1 - A(t, 20.8)) * 14);
        fade(A(t, 25.0), () => M(R`5 − 8 = 5 + (−8)`, 540, 1500, 66, { id: 'resta' }));
      } },
    { id: 'incluido', name: 'ℕ dentro de ℤ', dur: 30,
      caps: [[0.5, 9.0, 'UNOS DENTRO DE OTROS', 'Todo natural es entero:', '$ℕ ⊆ ℤ$.'], [9.4, 19.0, 'LO QUE SE AGREGÓ', '$ℤ − ℕ$: el cero', 'y los negativos.'],
        [19.4, 29.4, 'ℤ ES CERRADO', 'Para la suma, la resta', 'y el producto.']],
      narr: [[0.5, 9.0, 'Todo natural es también entero. Con el idioma de los conjuntos: los naturales son subconjunto de los enteros.'],
        [9.4, 19.0, 'Lo que hay en los enteros y no en los naturales es justo lo que se agregó: el cero y los negativos.'],
        [19.4, 29.4, 'Y ahora la resta ya no se escapa: sumar, restar o multiplicar enteros siempre da otro entero.']],
      ev: [[0.8, 'draw', 1.2], [1.6, 'draw', 1.0], [9.8, 'draw', 1.2], [20.0, 'card']],
      draw(t) {
        circ(540, 790, 330, { k: draw(t, .8, 1.2), fill: .06 }); circ(660, 800, 170, { k: draw(t, 1.6, 1.0), fill: .14 });
        fade(A(t, 1.8), () => { M('ℤ', 230, 560, 80, { pass: true }); M('ℕ', 660, 590, 70, { c: P.ac, pass: true }); });
        [['1', 610, 760], ['2', 700, 730], ['3', 640, 850], ['47', 720, 860]].forEach(([s, x, y], i) => el(s, x, y, { a: A(t, 2.0 + i * .15), s: 48 }));
        fade(A(t, 9.8), () => vennFill([[540, 790, 330], [660, 800, 170]], (z, n) => z && !n, 1, { a: .22 }));
        [['0', 380, 700], ['−1', 300, 830], ['−6', 420, 960], ['−25', 300, 980]].forEach(([s, x, y], i) => el(s, x, y, { a: A(t, 2.6 + i * .15), s: 48, c: t > 9.8 ? P.ac : P.ink }));
        fade(A(t, 1.0), () => M(R`ℕ \hl{⊆} ℤ`, 540, 1300, 100, { id: 'sub' }));
        fade(A(t, 10.0), () => M(R`ℤ − ℕ = \{…, −3, −2, −1, 0\}`, 540, 1450, 58, { id: 'dif' }));
        fade(A(t, 20.0), () => M(R`a, b ∈ ℤ \;⇒\; a + b,\; a − b,\; a · b ∈ ℤ`, 540, 1600, 52, { id: 'cer' }));
      } },
  ],
  sum: [['Naturales', R`ℕ = \{1, 2, 3, …\}`], ['ℕ es cerrado para + y ·', R`4 − 9 ∉ ℕ`], ['Enteros', R`ℤ = \{…, −2, −1, 0, 1, 2, …\}`], ['Opuesto', R`a + (−a) = 0 \qquad −(−a) = a`],
    ['Sumar es moverse', R`5 + (−8) = −3`], ['Unos dentro de otros', R`ℕ ⊆ ℤ`]],
  end: ['Contar dio los naturales;', 'restar pidió los enteros.'],
  finNarr: [[0.8, 10.4, 'En resumen: los naturales sirven para contar y son cerrados para la suma y el producto, pero no para la resta.'],
    [10.6, 17.6, 'Los enteros agregan el cero y los negativos; cada uno tiene su opuesto, y los naturales quedan adentro.']],
};
