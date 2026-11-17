// Lección alg-22a · Raíces y exponentes racionales (mundo Exponentes y Radicales).
// La raíz cuadrada deshace el cuadrado (lado de un cuadrado de área 49) y es la positiva; raíz cúbica con un cubo (343), índice
// impar y par; partes de un radical; por qué a^(1/n) es la raíz n-ésima; a^(m/n); exponente fraccionario negativo; dos trampas.
const R = String.raw;
const POSTER = 40;
const FILM = {
  lesson: 'alg-22a', world: 'potencias', key: 'Bb', n: [3, 4],
  title: 'Raíces y exponentes racionales',
  next: 'Simplificar y racionalizar',
  intro: 'La raíz deshace la potencia. Y con las leyes de los exponentes se descubre que una raíz es una potencia con exponente fracción.',
  examples: ['√49', '∛343', '∛(−27)', '⁴√625', '125^(2/3)', '100^(−1/2)', '√(9 + 16)'],
  scenes: [
    { id: 'cuadrada', name: 'Raíz cuadrada', dur: 34,
      caps: [[0.5, 9.0, 'DESHACER EL CUADRADO', 'Un cuadrado de área 49:', 'su lado mide 7.'], [9.4, 19.0, 'SE ESCRIBE', R`$\sqrt{49} = 7$ porque`, '$7^{2} = 49$.'],
        [19.4, 33.4, '!LA POSITIVA', '$(−7)^{2}$ también da 49, pero', R`$\sqrt{49}$ es solo 7.`]],
      narr: [[0.5, 9.0, 'Un terreno cuadrado tiene cuarenta y nueve metros cuadrados. Su lado es el número que por sí mismo da cuarenta y nueve: siete.'],
        [9.4, 19.0, 'Eso es la raíz cuadrada: deshace el cuadrado. Raíz de cuarenta y nueve es siete, porque siete al cuadrado es cuarenta y nueve.'],
        [19.4, 33.4, 'Menos siete al cuadrado también da cuarenta y nueve. Pero el símbolo de raíz da solo la positiva, para que tenga una sola respuesta.']],
      ev: [[1.0, 'draw', 1.4], [3.0, 'pops', 7], [9.8, 'card'], [19.8, 'doubt']],
      draw(t) {
        const s = 60; rect(240, 520, 7 * s, 7 * s, { k: draw(t, 1.0, 1.4), w: 6, fill: .2 }); fade(A(t, 3.0), () => { cells(240, 520, 7, 7, s, Math.floor(clamp((t - 3.0) / 3) * 49), { a: .35 }); M('49', 240 + 3.5 * s, 520 + 3.5 * s + 20, 60, { pass: true }); });
        fade(A(t, 6.2), () => { brace(240, 240 + 7 * s, 520 + 7 * s + 20, { label: '7', m: true, k: 1, s: 52 }); });
        fade(A(t, 9.8), () => M(R`\sqrt{49} = 7 \quad ⇔ \quad 7^{2} = 49`, 540, 1300, 72, { id: 'd' }));
        fade(A(t, 19.8), () => M(R`(−7)^{2} = 49 \qquad \sqrt{49} = \hl{7}`, 540, 1460, 68, { id: 'p' }));
      } },
    { id: 'cubica', name: 'Raíz cúbica', dur: 34,
      caps: [[0.5, 9.0, 'UNA CAJA CÚBICA', 'De 343 cm³: su arista', R`mide $\sqrt[3]{343} = 7$.`], [9.4, 19.0, 'ÍNDICE IMPAR', 'Acepta negativos:', R`$\sqrt[3]{−27} = −3$.`],
        [19.4, 33.4, '!ÍNDICE PAR', R`$\sqrt{−4}$ no es real:`, 'ningún real al cuadrado da −4.']],
      narr: [[0.5, 9.0, 'Una caja cúbica tiene trescientos cuarenta y tres centímetros cúbicos. Su arista es la raíz cúbica: siete, porque siete al cubo da eso.'],
        [9.4, 19.0, 'Con índice impar se aceptan negativos. Menos tres al cubo es menos veintisiete, así que la raíz cúbica de menos veintisiete es menos tres.'],
        [19.4, 33.4, 'Con índice par, no. Ningún número real al cuadrado da negativo, así que la raíz cuadrada de menos cuatro no es un número real.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'rise'], [19.8, 'no']],
      draw(t) {
        const cx = 360, cy = 760, a = 220, d = 110, k = draw(t, 1.0, 1.4);
        poly([[cx, cy], [cx + a, cy], [cx + a, cy + a], [cx, cy + a]], { k, w: 5, fill: .25 }); poly([[cx, cy], [cx + d, cy - d], [cx + a + d, cy - d], [cx + a, cy]], { k, w: 5, fill: .4 }); poly([[cx + a, cy], [cx + a + d, cy - d], [cx + a + d, cy + a - d], [cx + a, cy + a]], { k, w: 5, fill: .12 });
        fade(A(t, 2.4), () => { M('7', cx + a / 2, cy + a + 60, 50, { pass: true }); M('343', cx + a / 2, cy + a / 2 + 18, 50, { pass: true }); });
        fade(A(t, 3.0), () => M(R`\sqrt[3]{343} = 7`, 820, 860, 64, { id: 'c', a: 'c' }));
        fade(A(t, 9.8), () => M(R`\sqrt[3]{−27} = −3 \quad ⇐ \quad (−3)^{3} = −27`, 540, 1300, 62, { id: 'i' }));
        fade(A(t, 19.8), () => M(R`\sqrt{−4} \;\no{∉ ℝ}`, 540, 1460, 76, { id: 'p' }));
      } },
    { id: 'partes', name: 'Las partes de un radical', dur: 28,
      caps: [[0.5, 9.0, 'UN RADICAL', R`$\sqrt[n]{a}$: índice $n$ y`, 'radicando $a$.'], [9.4, 18.0, 'LO QUE SIGNIFICA', R`$\sqrt[n]{a} = b$ cuando`, '$b^{n} = a$.'],
        [18.4, 27.4, 'EJEMPLO', R`$\sqrt[4]{625} = 5$ porque`, '$5^{4} = 625$.']],
      narr: [[0.5, 9.0, 'En general, un radical tiene un índice, el número pequeño, y un radicando, lo de adentro. Si no se escribe índice, es dos.'],
        [9.4, 18.0, 'La raíz enésima de a es el número que elevado a la n da a. Deshace la potencia enésima.'],
        [18.4, 27.4, 'La raíz cuarta de seiscientos veinticinco es cinco, porque cinco a la cuarta es seiscientos veinticinco.']],
      ev: [[1.0, 'rise'], [2.4, 'tag'], [3.4, 'tag'], [18.8, 'card']],
      draw(t) {
        const r = M(R`\sqrt[\id{n}{n}]{\id{a}{a}}`, 540, 760, 180, { id: 'rad' });
        fade(A(t, 2.4), () => { line(r.box.n.cx, r.box.n.y0 - 10, r.box.n.cx - 120, r.box.n.y0 - 90, { c: P.ac, w: 3 }); label('índice', r.box.n.cx - 140, r.box.n.y0 - 104, P.ac, { s: 38, a: 'r' }); });
        fade(A(t, 3.4), () => { line(r.box.a.x1 + 10, r.box.a.cy, r.box.a.x1 + 100, r.box.a.cy, { c: P.ac, w: 3 }); label('radicando', r.box.a.x1 + 115, r.box.a.cy + 14, P.ac, { s: 38, a: 'l' }); });
        fade(A(t, 9.8), () => M(R`\sqrt[n]{a} = b \quad ⇔ \quad b^{n} = a`, 540, 1180, 72, { id: 'd' }));
        fade(A(t, 18.8), () => M(R`\sqrt[4]{625} = 5`, 540, 1380, 80, { id: 'e' }));
      } },
    { id: 'mitad', name: 'Un exponente fracción', dur: 37,
      caps: [[0.5, 9.0, 'UNA PREGUNTA', 'Qué número es $a^{1/2}$:', 'la ley de potencias lo dice.'], [9.4, 19.0, 'ELEVARLO AL CUADRADO', R`$\left(a^{1/2}\right)^{2} = a^{\frac{1}{2} · 2} = a^{1} = a$.`, ''],
        [19.4, 28.0, 'ENTONCES', 'Es el número que al cuadrado', R`da $a$: $a^{1/2} = \sqrt{a}$.`], [28.4, 36.4, 'EN GENERAL', R`$a^{1/n} = \sqrt[n]{a}$:`, 'el denominador es el índice.']],
      narr: [[0.5, 9.0, 'Las potencias pueden tener exponente fracción. Para saber qué es a a la un medio, usemos la ley de potencia de una potencia.'],
        [9.4, 19.0, 'Si a a la un medio se eleva al cuadrado, los exponentes se multiplican: un medio por dos, uno. Da a.'],
        [19.4, 28.0, 'Entonces a a la un medio es el número que al cuadrado da a: la raíz cuadrada de a.'],
        [28.4, 36.4, 'Con el mismo razonamiento, a a la uno sobre n es la raíz enésima. El denominador hace de índice.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'card'], [28.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`a^{\frac{1}{2}} = \;…`, 540, 680, 100, { id: 'q' }));
        fade(A(t, 9.8), () => M(R`\left(a^{\frac{1}{2}}\right)^{2} = a^{\frac{1}{2} · 2} = a^{1} = a`, 540, 880, 72, { id: 's' }));
        fade(A(t, 19.8), () => M(R`a^{\frac{1}{2}} = \hl{\sqrt{a}}`, 540, 1100, 96, { id: 'r' }));
        fade(A(t, 28.8), () => M(R`a^{\frac{1}{n}} = \sqrt[n]{a}`, 540, 1340, 96, { id: 'g' }));
      } },
    { id: 'racional', name: 'Exponente m/n', dur: 35,
      caps: [[0.5, 9.0, 'CON NUMERADOR', '$a^{m/n}$: raíz de índice $n$', 'y potencia $m$.'], [9.4, 19.0, 'EJEMPLO', R`$125^{2/3} = \left(\sqrt[3]{125}\right)^{2}$`, '$= 5^{2} = 25$.'],
        [19.4, 34.4, 'CONVIENE', 'Sacar primero la raíz:', 'los números se achican.']],
      narr: [[0.5, 9.0, 'Si el exponente es m sobre n, se hacen las dos cosas: la raíz de índice n y la potencia m.'],
        [9.4, 19.0, 'Ciento veinticinco a la dos tercios: raíz cúbica de ciento veinticinco, cinco; y cinco al cuadrado, veinticinco.'],
        [19.4, 34.4, 'Se puede en cualquier orden, pero conviene la raíz primero. Al revés habría que elevar al cuadrado ciento veinticinco y sacarle raíz cúbica a quince mil seiscientos veinticinco.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'doubt']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^{m} = \sqrt[n]{a^{m}}`, 540, 680, 80, { id: 'g' }));
        fade(A(t, 9.8), () => M(R`125^{\frac{2}{3}} = \left(\sqrt[3]{125}\right)^{2} = 5^{2} = \hl{25}`, 540, 900, 68, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`\sqrt[3]{125^{2}} = \sqrt[3]{15\,625} = 25`, 540, 1100, 60, { id: 'o', c: P.mute }));
      } },
    { id: 'negativo', name: 'Exponente fracción negativo', dur: 25,
      caps: [[0.5, 12.0, 'CON SIGNO MENOS', 'Se voltea y luego', 'se saca la raíz.'], [12.4, 24.4, 'EJEMPLO', R`$100^{−1/2} = \frac{1}{\sqrt{100}} = \frac{1}{10}$.`, '']],
      narr: [[0.5, 12.0, 'Si el exponente fracción es negativo, se combinan las dos reglas: el menos manda la potencia al denominador, y la fracción la vuelve raíz.'],
        [12.4, 24.4, 'Cien a la menos un medio es uno sobre cien a la un medio: uno sobre raíz de cien, un décimo.']],
      ev: [[1.0, 'rise'], [12.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`a^{−\frac{m}{n}} = \frac{1}{a^{\frac{m}{n}}}`, 540, 700, 86, { id: 'g' }));
        fade(A(t, 12.8), () => M(R`100^{−\frac{1}{2}} = \frac{1}{\sqrt{100}} = \hl{\frac{1}{10}}`, 540, 960, 76, { id: 'e' }));
      } },
    { id: 'trampas', name: 'Dos trampas', dur: 36,
      caps: [[0.5, 9.0, '!PRIMERA TRAMPA', R`$\sqrt{x^{2}}$ no siempre es $x$:`, 'si $x = −3$, da 3.'], [9.4, 18.0, 'LO CORRECTO', R`$\sqrt{x^{2}} = |x|$:`, 'la raíz nunca es negativa.'],
        [18.4, 27.0, '!SEGUNDA TRAMPA', R`$\sqrt{9 + 16} = 5$, pero`, R`$\sqrt{9} + \sqrt{16} = 7$.`], [27.4, 35.4, 'LA RAZÓN', 'La raíz, como el exponente,', 'no se reparte en una suma.']],
      narr: [[0.5, 9.0, 'Primera trampa: raíz de equis al cuadrado parece ser equis. Pero con equis igual a menos tres, da raíz de nueve: tres, no menos tres.'],
        [9.4, 18.0, 'Lo correcto es el valor absoluto de equis: así nunca sale negativa.'],
        [18.4, 27.0, 'Segunda trampa. Raíz de nueve más dieciséis es raíz de veinticinco, cinco. Pero raíz de nueve más raíz de dieciséis da siete.'],
        [27.4, 35.4, 'La raíz es un exponente un medio, y los exponentes no se reparten en una suma.']],
      ev: [[1.0, 'no'], [9.8, 'card'], [18.8, 'no'], [27.8, 'tag']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x = −3: \quad \sqrt{(−3)^{2}} = \sqrt{9} = 3`, 540, 660, 64, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\sqrt{x^{2}} = \hl{|x|}`, 540, 820, 90, { id: 'b' }));
        fade(A(t, 18.8), () => M(R`\sqrt{9 + 16} = 5 \;\no{≠}\; \sqrt{9} + \sqrt{16} = 7`, 540, 1060, 62, { id: 'c' }));
        fade(A(t, 20.0), () => { const u = 40; poly([[260, 1500], [260 + 4 * u, 1500], [260, 1500 - 3 * u]], { w: 5, fill: .2 }); M('3', 230, 1460, 36, { pass: true }); M('4', 340, 1550, 36, { pass: true }); M('5', 370, 1420, 36, { c: P.ac, pass: true }); label('3 + 4 = 7, pero la diagonal mide 5', 640, 1440, P.mute, { s: 32 }); });
      } },
  ],
  sum: [['Raíz cuadrada', R`\sqrt{49} = 7 \quad (\t{la positiva})`], ['Índice impar y par', R`\sqrt[3]{−27} = −3 \qquad \sqrt{−4} ∉ ℝ`], ['Exponente fracción', R`a^{\frac{1}{n}} = \sqrt[n]{a}`], ['Exponente m/n', R`a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^{m}`], ['Trampas', R`\sqrt{x^{2}} = |x| \qquad \sqrt{a + b} ≠ \sqrt{a} + \sqrt{b}`]],
  end: ['Una raíz es una potencia', 'con exponente fracción.'],
  finNarr: [[0.8, 9.0, 'En resumen: la raíz deshace la potencia, y la cuadrada da siempre la positiva.'],
    [9.2, 16.0, 'Una raíz es un exponente fracción, y como todo exponente, no se reparte en una suma.']],
};
