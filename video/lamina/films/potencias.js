// Lección alg-21a · Potencias y exponentes (mundo Exponentes y Radicales).
// Multiplicación repetida (10⁴ y los cuadrados de la lámina), base y exponente; el signo y los paréntesis; la escalera que
// baja dividiendo: a⁰ = 1 y exponentes negativos; potencias de 10; potencias de fracciones; crecer duplicando.
const R = String.raw;
const POSTER = 30;
// los cuadrados anidados de la lámina: lados 1, 2, 4, 8 (en unidades u)
function squares(x, y, u, n, k = 1) { for (let i = 0; i < n; i++) { const s = u * Math.pow(2, i), a = A(k, i * .2, .2); fade(a, () => { fillP(P.ac, [.5, .3, .18, .1][i] ?? .08, () => X.rect(x, y - s, s, s)); rect(x, y - s, s, s, { w: i === n - 1 ? 6 : 3, c: i === n - 1 ? P.ac : P.ink }); M(String(Math.pow(2, i)), x + s, y + 46, 36, { pass: true }); }); } }
const FILM = {
  lesson: 'alg-21a', world: 'potencias', key: 'Bb', n: [1, 4],
  title: 'Potencias y exponentes',
  next: 'Leyes de los exponentes',
  intro: 'Multiplicar muchas veces lo mismo tiene una escritura corta. Y siguiendo su patrón aparecen el exponente cero y los negativos.',
  examples: ['10⁴', '(−5)²', '−5²', '(−1)⁷', '2⁻³', '(2/3)³', '4096'],
  scenes: [
    { id: 'repetir', name: 'Multiplicar repetido', dur: 31,
      caps: [[0.5, 9.0, 'UNA ESCRITURA CORTA', '$10 · 10 · 10 · 10 = 10^{4}$:', 'cuatro veces el 10.'], [9.4, 19.0, 'SUS PARTES', 'Base: lo que se repite.', 'Exponente: cuántas veces.'],
        [19.4, 30.4, 'LA LÁMINA DEL MUNDO', 'Cada cuadrado tiene el doble', 'de lado: $1, 2, 4, 8$.']],
      narr: [[0.5, 9.0, 'Diez por diez por diez por diez da diez mil. Escribirlo así es largo; se escribe diez a la cuatro.'],
        [9.4, 19.0, 'El número de abajo es la base, el que se repite. El pequeño de arriba es el exponente: cuántas veces aparece como factor.'],
        [19.4, 30.4, 'La lámina de este mundo dibuja eso: cuadrados cuyo lado se duplica. Uno, dos, cuatro, ocho: dos a la cero, a la uno, a la dos, a la tres.']],
      ev: [[1.0, 'pops', 4], [3.6, 'card'], [9.8, 'tag'], [11.0, 'tag'], [19.8, 'pops', 4]],
      draw(t) {
        if (t < 19.4) { for (let i = 0; i < 4; i++) fade(A(t, 1.0 + i * .3), () => M('10', 240 + i * 180, 700, 80, { pass: true })); for (let i = 0; i < 3; i++) fade(A(t, 1.3 + i * .3), () => M('·', 330 + i * 180, 700, 80, { pass: true }));
          fade(A(t, 3.6), () => { brace(200, 880, 760, { label: '4 veces', k: 1, s: 40 }); });
          fade(A(t, 3.6), () => { const r = M(R`\id{b}{10}^{\id{e}{4}} = 10\,000`, 540, 1100, 110, { id: 'p' }); fade(A(t, 9.8), () => { label('base', r.box.b.cx, r.box.b.y1 + 70, P.ac, { s: 38 }); }); fade(A(t, 11.0), () => { label('exponente', r.box.e.cx + 40, r.box.e.y0 - 30, P.ac, { s: 38 }); }); }); }
        else { squares(200, 1150, 70, 4, seg(t, 19.8, 23.0)); fade(A(t, 23.0), () => M(R`2^{0} \quad 2^{1} \quad 2^{2} \quad 2^{3}`, 540, 1400, 70, { id: 'pl' })); }
        fade(A(t, 9.8), () => M(R`a^{n} = a · a · … · a`, 540, 1600, 66, { id: 'def' }));
        fade(A(t, 10.4), () => label('n factores', 640, 1680, P.mute, { s: 34 }));
      } },
    { id: 'signo', name: 'El signo y los paréntesis', dur: 34,
      caps: [[0.5, 9.0, 'CON PARÉNTESIS', '$(−5)^{2} = (−5)(−5) = 25$:', 'la base es $−5$.'], [9.4, 19.0, '!SIN PARÉNTESIS', '$−5^{2} = −(5 · 5) = −25$:', 'el exponente solo toca al 5.'],
        [19.4, 33.4, 'BASE NEGATIVA', 'Exponente par: positivo.', 'Impar: negativo.']],
      narr: [[0.5, 9.0, 'Con paréntesis, menos cinco al cuadrado es menos cinco por menos cinco: veinticinco. La base es todo el menos cinco.'],
        [9.4, 19.0, 'Sin paréntesis cambia todo: el exponente solo toca al cinco, y el menos queda afuera. Menos cinco al cuadrado, escrito así, da menos veinticinco.'],
        [19.4, 33.4, 'Con base negativa, los signos menos se cancelan por parejas. Si el exponente es par, no sobra ninguno y da positivo; si es impar, sobra uno.']],
      ev: [[1.0, 'rise'], [9.8, 'no'], [19.8, 'pops', 7]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\hl{(−5)}^{2} = (−5)(−5) = 25`, 540, 680, 74, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`−\hl{5}^{2} = −(5 · 5) = \no{−25}`, 540, 860, 74, { id: 'b' }));
        if (t > 19.4) { for (let i = 0; i < 7; i++) fade(A(t, 19.8 + i * .3), () => { const x = 200 + i * 115; circ(x, 1080, 42, { w: 4, fill: .2 }); M('−1', x, 1098, 40, { pass: true }); }); for (let p = 0; p < 3; p++) fade(A(t, 22.6 + p * .5), () => stroke(P.ac, 4, () => X.arc(257 + p * 230, 1080, 100, Math.PI * .15, Math.PI * .85))); fade(A(t, 24.6), () => { circ(890, 1080, 56, { c: P.no, w: 5 }); label('sobra uno', 890, 1180, P.no, { s: 34 }); M(R`(−1)^{7} = −1`, 540, 1340, 70, { id: 'c' }); }); }
      } },
    { id: 'cero', name: 'El exponente cero', dur: 35,
      caps: [[0.5, 9.0, 'UNA ESCALERA', 'Bajar un escalón', 'es dividir entre 2.'], [9.4, 19.0, 'HASTA EL CERO', '$2^{1} = 2$, y un escalón', 'más abajo: $2^{0} = 1$.'],
        [19.4, 34.4, 'CON CUALQUIER BASE', '$a^{0} = 1$ si $a ≠ 0$:', 'no es cero.']],
      narr: [[0.5, 9.0, 'Pongamos las potencias de dos en una escalera: dieciséis, ocho, cuatro, dos. Cada vez que el exponente baja uno, se divide entre dos.'],
        [9.4, 19.0, 'Dos a la uno es dos. Un escalón más abajo, dos a la cero, tiene que ser dos entre dos: uno.'],
        [19.4, 34.4, 'Pasa con cualquier base distinta de cero: a a la cero es uno. No es cero, porque se llegó dividiendo, no restando.']],
      ev: [[1.0, 'pops', 4], [9.8, 'pop'], [11.4, 'card'], [19.8, 'rise']],
      draw(t) {
        const steps = [[4, '16'], [3, '8'], [2, '4'], [1, '2'], [0, '1']];
        steps.forEach(([e, v], i) => { const t0 = i < 4 ? 1.0 + i * .3 : 11.4; fade(A(t, t0), () => { const x = 160 + i * 170, y = 560 + i * 120; rect(x, y, 160, 100, { r: 10, w: 4, fill: e === 0 ? .6 : .18 }); M(`2^{${e}} = ${v}`, x + 80, y + 66, 42, { pass: true }); if (i) M('÷ 2', x - 20, y - 6, 34, { c: P.ac, pass: true }); }); });
        fade(A(t, 19.8), () => M(R`a^{0} = \hl{1} \quad (a ≠ 0)`, 540, 1400, 90, { id: 'z' }));
      } },
    { id: 'negativo', name: 'Exponentes negativos', dur: 35,
      caps: [[0.5, 9.0, 'SEGUIR BAJANDO', R`$2^{−1} = \frac{1}{2}$, $2^{−2} = \frac{1}{4}$,`, R`$2^{−3} = \frac{1}{8}$.`], [9.4, 19.0, 'LA REGLA', R`$a^{−n} = \frac{1}{a^{n}}$: el negativo`, 'manda la potencia abajo.'],
        [19.4, 34.4, '!NO ES UN NÚMERO NEGATIVO', R`$2^{−3}$ es $\frac{1}{8}$, positivo.`, 'El signo es del exponente.']],
      narr: [[0.5, 9.0, 'La escalera sigue debajo del cero. Uno entre dos, un medio; entre dos otra vez, un cuarto; otra vez, un octavo.'],
        [9.4, 19.0, 'Así que dos a la menos tres es uno sobre dos a la tres. Un exponente negativo manda la potencia al denominador.'],
        [19.4, 34.4, 'Cuidado: dos a la menos tres no es negativo. Es un octavo, positivo y pequeño. El signo menos es del exponente, no de la potencia.']],
      ev: [[1.0, 'pop', 0], [2.4, 'pop', 1], [3.8, 'pop', 2], [9.8, 'card'], [19.8, 'no']],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: 860, v0: 0, v1: 2.2, ticks: [0, 1, 2], k: 1, ls: 40 });
        [[1, '2^{0}'], [2, '2^{1}']].forEach(([v, s]) => { dot(X_(v), 860, { r: 11 }); M(s, X_(v), 790, 40, { pass: true }); });
        [[.5, R`\frac{1}{2}`, 1.0], [.25, R`\frac{1}{4}`, 2.4], [.125, R`\frac{1}{8}`, 3.8]].forEach(([v, s, t0], i) => fade(A(t, t0), () => { dot(X_(v), 860, { r: 11, c: P.ac, ping: ping(t, t0) }); M(s, X_(v), 960 + i * 20, 38, { c: P.ac, pass: true }); M(`2^{−${i + 1}}`, X_(v), 790 - i * 50, 36, { c: P.ac, pass: true }); }));
        fade(A(t, 9.8), () => M(R`a^{−n} = \frac{1}{a^{n}}`, 540, 1300, 96, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`2^{−3} = \frac{1}{8} = 0.125 \;\hl{> 0}`, 540, 1520, 70, { id: 'p' }));
      } },
    { id: 'diez', name: 'Potencias de 10', dur: 30,
      caps: [[0.5, 9.0, 'POTENCIAS DE 10', 'El exponente cuenta', 'los ceros: $10^{3} = 1000$.'], [9.4, 18.0, 'CON NEGATIVOS', R`$10^{−3} = \frac{1}{1000} = 0.001$:`, 'un milímetro en metros.'],
        [18.4, 29.4, 'LA COMA', 'Multiplicar por $10^{n}$ corre', 'la coma $n$ lugares.']],
      narr: [[0.5, 9.0, 'Con base diez todo es más fácil: el exponente cuenta los ceros. Diez a la tres es mil, un uno con tres ceros.'],
        [9.4, 18.0, 'Y diez a la menos tres es una milésima: cero coma cero cero uno. Un milímetro es diez a la menos tres metros.'],
        [18.4, 29.4, 'Multiplicar por una potencia de diez es correr la coma: a la derecha si el exponente es positivo, a la izquierda si es negativo.']],
      ev: [[1.0, 'pops', 3], [9.8, 'pops', 3], [18.8, 'fly', 1.2]],
      draw(t) {
        const rows = [['10^{3}', '1000'], ['10^{2}', '100'], ['10^{1}', '10'], ['10^{0}', '1'], ['10^{−1}', '0.1'], ['10^{−2}', '0.01'], ['10^{−3}', '0.001']];
        rows.forEach(([a, b], i) => fade(A(t, i < 4 ? 1.0 + i * .3 : 9.8 + (i - 4) * .4), () => { M(a, 380, 560 + i * 100, 50, { a: 'r', pass: true }); M('= ' + b, 420, 560 + i * 100, 50, { a: 'l', c: i > 3 ? P.ac : P.ink, pass: true }); }));
        fade(A(t, 18.8), () => { const k = eio(seg(t, 18.8, 20.0)); M(R`3.7 × 10^{2} = 370`, 540, 1400, 70, { id: 'c1' }); dot(lerp(470, 540, k), 1420, { r: 8, c: P.ac }); });
      } },
    { id: 'fracciones', name: 'Potencias de fracciones', dur: 30,
      caps: [[0.5, 9.0, 'UNA FRACCIÓN', R`$\left(\frac{2}{3}\right)^{3}$: se elevan`, 'el de arriba y el de abajo.'], [9.4, 19.0, 'SE ACHICA', 'Una fracción menor que 1', 'elevada da algo más chico.'],
        [19.4, 29.4, 'CON NEGATIVO', R`Se voltea: $\left(\frac{2}{3}\right)^{−2} = \frac{9}{4}$.`, '']],
      narr: [[0.5, 9.0, 'Dos tercios al cubo es dos tercios por dos tercios por dos tercios: arriba dos al cubo, abajo tres al cubo. Ocho veintisieteavos.'],
        [9.4, 19.0, 'Fíjate: ocho veintisieteavos es menos que dos tercios. Multiplicar por un número menor que uno achica.'],
        [19.4, 29.4, 'Con exponente negativo, la fracción se voltea: dos tercios a la menos dos es tres medios al cuadrado, nueve cuartos.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.0], [19.8, 'shuffle', 1.0]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\left(\frac{2}{3}\right)^{3} = \frac{2^{3}}{3^{3}} = \frac{8}{27}`, 540, 700, 80, { id: 'a' }));
        fade(A(t, 9.8), () => { rect(200, 900, 680, 70, { r: 10, w: 3 }); bar(200, 900, 680 * 2 / 3, 70, { label: R`\frac{2}{3}`, s: 36, a: .35 }); bar(200, 1000, 680 * 8 / 27, 70, { k: draw(t, 9.8, 1.0), label: R`\frac{8}{27}`, s: 36, a: .65 }); });
        fade(A(t, 19.8), () => M(R`\left(\frac{2}{3}\right)^{−2} = \left(\frac{3}{2}\right)^{2} = \hl{\frac{9}{4}}`, 540, 1340, 76, { id: 'n' }));
      } },
    { id: 'crecer', name: 'Duplicar', dur: 30,
      caps: [[0.5, 9.0, 'BACTERIAS', 'Se duplican cada hora:', '$1, 2, 4, 8, …$'], [9.4, 19.0, 'DESPUÉS DE n HORAS', 'Hay $2^{n}$ bacterias.', ''],
        [19.4, 29.4, 'CRECE RÁPIDO', 'En 12 horas, $2^{12} = 4096$;', 'en 20, más de un millón.']],
      narr: [[0.5, 9.0, 'Una bacteria se divide en dos cada hora. Al principio hay una; luego dos, cuatro, ocho.'],
        [9.4, 19.0, 'Después de n horas hay dos a la n bacterias. El exponente es el número de veces que se duplicó.'],
        [19.4, 29.4, 'Parece lento al principio, pero en doce horas son cuatro mil noventa y seis, y en veinte, más de un millón. Ese es el poder de un exponente.']],
      ev: [[1.0, 'pops', 4], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        const gen = Math.min(5, Math.floor(seg(t, 1.0, 9.0) * 6));
        for (let g = 0; g <= gen; g++) { const n = Math.pow(2, g); for (let i = 0; i < n; i++) { const x = 540 + (i - (n - 1) / 2) * Math.min(56, 900 / n), y = 560 + g * 110; fade(A(t, 1.0 + g * 1.4, .4), () => dot(x, y, { r: Math.max(6, 18 - g * 2), c: P.ac })); } fade(A(t, 1.0 + g * 1.4), () => T(String(n), 980, 570 + g * 110, { s: 34, a: 'r', c: P.mute, pass: true })); }
        fade(A(t, 9.8), () => M(R`\t{bacterias} = 2^{n}`, 540, 1340, 80, { id: 'f' }));
        fade(A(t, 19.8), () => M(R`2^{12} = 4096 \qquad 2^{20} = 1\,048\,576`, 540, 1500, 62, { id: 'g' }));
      } },
  ],
  sum: [['Potencia', R`a^{n} = a · a · … · a \;\;(n \t{ veces})`], ['Signo', R`(−5)^{2} = 25 \qquad −5^{2} = −25`], ['Exponente cero', R`a^{0} = 1 \quad (a ≠ 0)`], ['Exponente negativo', R`a^{−n} = \frac{1}{a^{n}}`], ['Fracciones', R`\left(\frac{a}{b}\right)^{n} = \frac{a^{n}}{b^{n}}`]],
  end: ['Subir un escalón: multiplicar.', 'Bajar un escalón: dividir.'],
  finNarr: [[0.8, 9.0, 'En resumen: una potencia repite un factor. Ojo con los paréntesis cuando la base es negativa.'],
    [9.2, 16.0, 'Bajando la escalera se llega a a a la cero igual a uno, y a los exponentes negativos, que son fracciones.']],
};
