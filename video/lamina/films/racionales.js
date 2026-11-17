// Lección alg-11b · Los números racionales: fracciones y decimales (mundo La Recta Real).
// Repartir (3 panes entre 4), qué dice una fracción, ℚ, fracciones equivalentes, ℤ ⊆ ℚ, decimal que termina o se repite
// (1/7 y el ciclo de restos), periódico a fracción (0.2727…), fracciones en la recta.
const R = String.raw;
const POSTER = 150;
const LY = 880;
// barra partida en n partes con las primeras m pintadas
function fbar(x, y, w, h, n, m, k = 1, o = {}) {
  if (k <= 0) return; fade(Math.min(1, k * 2), () => {
    for (let i = 0; i < n; i++) { const xi = x + w * i / n; if (i < m) fillP(o.c || P.ac, (o.a || .5) * clamp(k * n - i), () => X.rect(xi, y, w / n, h)); }
    rect(x, y, w, h, { w: 5 }); for (let i = 1; i < n; i++) line(x + w * i / n, y, x + w * i / n, y + h, { w: 3, c: hexA(P.ink, .7) });
  });
}
const FILM = {
  lesson: 'alg-11b', world: 'numeros', key: 'A', n: [2, 6],
  title: 'Los números racionales: fracciones y decimales',
  next: 'Los irracionales y los números reales',
  intro: 'Repartir no siempre da un número entero. Para eso existen las fracciones, y cada fracción tiene también su nombre decimal.',
  examples: ['3 panes', '2/7', '4/14', '18/24', '1/7', '0.2727', '7/8', '0.875', '5/3'],
  scenes: [
    { id: 'repartir', name: 'Repartir', dur: 29,
      caps: [[0.5, 9.0, 'REPARTIR', 'Tres panes entre cuatro', 'personas.'], [9.4, 18.0, 'A CADA UNA', 'Le tocan tres cuartos', R`de pan: $\frac{3}{4}$.`],
        [18.4, 28.4, '!NO ES ENTERO', 'Dividir enteros no siempre', 'da un entero.']],
      narr: [[0.5, 9.0, 'Hay tres panes y cuatro personas. Ninguna puede recibir un pan entero, así que cada pan se parte en cuatro.'],
        [9.4, 18.0, 'A cada persona le toca un pedazo de cada pan: tres pedazos de un cuarto. Tres cuartos de pan.'],
        [18.4, 28.4, 'Tres entre cuatro no es un entero. Así como la resta pidió los negativos, la división pide números nuevos: las fracciones.']],
      ev: [[0.8, 'pops', 3], [3.0, 'cut'], [9.8, 'pops', 3], [13.0, 'card'], [18.8, 'no']],
      draw(t) {
        for (let b = 0; b < 3; b++) { const y = 520 + b * 170; fbar(150, y, 780, 110, t > 3.0 ? 4 : 1, t > 9.8 ? 1 : 0, A(t, .8 + b * .2), { a: .6 }); if (t > 9.8) fade(A(t, 9.8 + b * .4), () => M(R`\frac{1}{4}`, 245, y + 70, 46, { c: P.bg, pass: true })); }
        fade(A(t, 12.0), () => { fbar(150, 1060, 780, 110, 4, 3, draw(t, 12.0, 1.0), { a: .6 }); label('lo de una persona', 540, 1230, P.mute, { s: 36 }); });
        fade(A(t, 1.2) * (1 - A(t, 18.2)), () => M(R`3 ÷ 4 = \hl{\frac{3}{4}}`, 540, 1440, 96, { id: 'rep' }));
        fade(A(t, 18.6), () => M(R`3 ÷ 4 \no{∉} ℤ`, 540, 1440, 96, { id: 'noZ' }), (1 - A(t, 18.6)) * 14);
      } },
    { id: 'fraccion', name: 'Qué dice una fracción', dur: 31,
      caps: [[0.5, 9.0, 'DENOMINADOR', 'Abajo: en cuántas partes', 'iguales se parte la unidad.'], [9.4, 18.0, 'NUMERADOR', 'Arriba: cuántas de esas', 'partes se toman.'],
        [18.4, 30.4, 'EN LA RECTA', 'Se parte el tramo de 0 a 1', 'y se cuentan las partes.']],
      narr: [[0.5, 9.0, 'Una fracción tiene dos números. El de abajo, el denominador, dice en cuántas partes iguales se parte la unidad.'],
        [9.4, 18.0, 'El de arriba, el numerador, dice cuántas de esas partes se toman. Tres cuartos: se parte en cuatro y se toman tres.'],
        [18.4, 30.4, 'En la recta es igual. El tramo del cero al uno se parte en cuatro, y tres cuartos es la tercera marca. Siete cuartos se pasa del uno: es uno y tres cuartos.']],
      ev: [[1.0, 'cut'], [9.8, 'pops', 3], [18.8, 'draw', 1.2], [21.0, 'pops', 3], [25.0, 'pops', 4]],
      draw(t) {
        fade(1 - A(t, 18.2), () => { fbar(150, 560, 780, 150, t > 1.0 ? 4 : 1, t > 9.8 ? Math.min(3, 1 + Math.floor((t - 9.8) / .6)) : 0, A(t, .6), { a: .55 });
          brace(150, 930, 750, { label: '4 partes iguales', k: A(t, 2.0), s: 38 }); fade(A(t, 11.6), () => brace(150, 735, 540, { up: true, label: 'se toman 3', k: 1, s: 38 })); });
        fade(A(t, 18.4), () => { const X_ = axis({ x0: 110, x1: 960, y: LY - 200, v0: 0, v1: 2, ticks: [0, 1, 2], k: draw(t, 18.8, 1.2) });
          for (let i = 1; i < 8; i++) if (i !== 4) line(X_(i / 4), LY - 214, X_(i / 4), LY - 186, { w: 3, k: A(t, 20.0 + i * .1) });
          for (let i = 1; i <= 3; i++) hop(X_((i - 1) / 4), X_(i / 4), LY - 200, draw(t, 21.0 + i * .4, .35), { c: P.ac, h: 50 }); if (t > 22.4) fade(A(t, 22.4), () => { dot(X_(.75), LY - 200, { r: 12, c: P.ac }); M(R`\frac{3}{4}`, X_(.75), LY - 300, 54, { c: P.ac, pass: true }); });
          for (let i = 1; i <= 7; i++) hop(X_((i - 1) / 4), X_(i / 4), LY - 200, draw(t, 25.0 + i * .25, .25), { c: P.mute, h: 34, below: true }); if (t > 26.8) fade(A(t, 26.8), () => { dot(X_(1.75), LY - 200, { r: 12, c: P.ac }); M(R`\frac{7}{4} = 1 + \frac{3}{4}`, X_(1.75) - 40, LY - 50, 46, { c: P.ac, pass: true }); }); });
        fade(A(t, .8), () => { const r = M(R`\frac{\id{n}{3}}{\id{d}{4}}`, 540, 1440, 160, { id: 'frac' }); fade(A(t, 1.4), () => label('denominador', r.box.d.x1 + 30, r.box.d.cy + 14, t < 9.4 ? P.ac : P.mute, { a: 'l', s: 36 })); fade(A(t, 9.8), () => label('numerador', r.box.n.x1 + 30, r.box.n.cy + 14, P.ac, { a: 'l', s: 36 })); });
      } },
    { id: 'Q', name: 'Los racionales', dur: 29,
      caps: [[0.5, 9.0, 'RACIONALES', 'Todos los cocientes', 'de enteros: $ℚ$.'], [9.4, 18.0, '!NUNCA ENTRE CERO', 'El denominador no', 'puede ser 0.'],
        [18.4, 28.4, 'CON SIGNO', R`$−\frac{3}{4}$ queda a la izquierda`, 'del cero.']],
      narr: [[0.5, 9.0, 'Las fracciones de enteros forman el conjunto de los números racionales. Se escribe con una Q de doble trazo, de cociente.'],
        [9.4, 18.0, 'Con una condición: el denominador no puede ser cero. Partir la unidad en cero partes no tiene sentido.'],
        [18.4, 28.4, 'Las fracciones también tienen signo. Menos tres cuartos es el opuesto de tres cuartos: el mismo tramo, a la izquierda del cero.']],
      ev: [[1.0, 'rise'], [9.8, 'no'], [18.8, 'fly', 1.2]],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: -2, v1: 2, ticks: [-2, -1, 0, 1, 2], k: 1 });
        for (let i = -7; i <= 7; i++) if (i % 4) line(X_(i / 4), LY - 12, X_(i / 4), LY + 12, { w: 3, c: hexA(P.ink, .6) });
        dot(X_(.75), LY, { r: 12, c: P.ac }); M(R`\frac{3}{4}`, X_(.75), LY - 70, 50, { pass: true });
        const k = draw(t, 18.8, 1.2); if (k > 0) { dot(lerp(X_(.75), X_(-.75), k), LY - Math.sin(Math.PI * k) * 160, { r: 12, c: P.ac }); if (k >= 1) M(R`−\frac{3}{4}`, X_(-.75), LY - 70, 50, { c: P.ac, pass: true }); }
        fade(A(t, 1.0), () => M(R`ℚ = \{ \frac{m}{n} : m, n ∈ ℤ, \; \hl{n ≠ 0} \}`, 540, 1340, 72, { id: 'Q' }));
        fade(A(t, 10.0), () => M(R`\frac{5}{0} \; \no{\t{no existe}}`, 540, 1540, 76, { id: 'cero' }));
      } },
    { id: 'equiv', name: 'Fracciones equivalentes', dur: 33,
      caps: [[0.5, 9.0, 'MUCHOS NOMBRES', R`$\frac{2}{7} = \frac{4}{14} = \frac{6}{21}$:`, 'el mismo pedazo.'], [9.4, 18.0, 'AMPLIFICAR', 'Multiplicar arriba y abajo', 'por lo mismo.'],
        [18.4, 32.4, 'SIMPLIFICAR', 'Dividir arriba y abajo', R`por lo mismo: $\frac{18}{24} = \frac{3}{4}$.`]],
      narr: [[0.5, 9.0, 'Dos séptimos, cuatro catorceavos y seis veintiunavos pintan exactamente el mismo pedazo. Son la misma fracción con distinto nombre.'],
        [9.4, 18.0, 'Si cada parte se corta en dos, hay el doble de partes y de partes pintadas. Multiplicar arriba y abajo por lo mismo no cambia nada.'],
        [18.4, 32.4, 'Al revés, dividir arriba y abajo por un mismo número simplifica. Dieciocho veinticuatroavos, dividiendo entre seis, es tres cuartos.']],
      ev: [[0.8, 'pops', 3], [9.8, 'cut'], [12.0, 'cut'], [19.0, 'card']],
      draw(t) {
        const cut = t > 9.8 ? (t > 12.0 ? 3 : 2) : 1;
        [[1, 2, 7], [2, 4, 14], [3, 6, 21]].forEach(([q, m, n], i) => { const y = 520 + i * 170, show = t < 9.4 ? A(t, .8 + i * .4) : (i === 0 ? 1 : 0); fade(show, () => { fbar(150, y, 640, 110, n, m, 1); M(R`\frac{${m}}{${n}}`, 900, y + 76, 56, { pass: true }); }); });
        if (t >= 9.4) fade(A(t, 9.4) * (1 - A(t, 18.2)), () => { fbar(150, 690, 640, 140, 7 * cut, 2 * cut, 1); M(R`\frac{${2 * cut}}{${7 * cut}}`, 900, 790, 64, { c: P.ac, pass: true }); });
        fade(A(t, 1.2) * (1 - A(t, 9.2)), () => M(R`\frac{2}{7} = \frac{4}{14} = \frac{6}{21}`, 540, 1400, 90, { id: 'eq' }));
        fade(A(t, 10.2) * (1 - A(t, 18.2)), () => M(R`\frac{2}{7} = \frac{2 · \hl{3}}{7 · \hl{3}} = \frac{6}{21}`, 540, 1400, 90, { id: 'amp' }));
        fade(A(t, 18.6), () => { fbar(150, 600, 780, 110, 24, 18, 1, { a: .45 }); fbar(150, 800, 780, 110, 4, 3, A(t, 21.0)); M(R`\frac{18 ÷ \hl{6}}{24 ÷ \hl{6}} = \frac{3}{4}`, 540, 1400, 90, { id: 'simp' }); });
      } },
    { id: 'ZQ', name: 'Los enteros también', dur: 25,
      caps: [[0.5, 9.0, 'ENTEROS', 'Todo entero es racional:', R`$5 = \frac{5}{1} = \frac{10}{2}$.`], [9.4, 24.4, 'UNOS DENTRO DE OTROS', '$ℕ ⊆ ℤ ⊆ ℚ$: cada', 'conjunto cabe en el siguiente.']],
      narr: [[0.5, 9.0, 'Un entero también es una fracción: cinco es cinco entre uno, o diez entre dos. Así que todo entero es racional.'],
        [9.4, 24.4, 'Los conjuntos quedan uno dentro de otro: los naturales dentro de los enteros, y los enteros dentro de los racionales. Y en los racionales, dividir entre algo distinto de cero ya no se escapa.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.0], [10.6, 'draw', 1.0], [11.4, 'draw', 1.0]],
      draw(t) {
        circ(540, 800, 330, { k: draw(t, 9.8, 1.0), fill: .05 }); circ(600, 830, 230, { k: draw(t, 10.6, 1.0), fill: .07 }); circ(650, 860, 120, { k: draw(t, 11.4, 1.0), fill: .1 });
        fade(A(t, 11.8), () => { M('ℚ', 260, 560, 74, { pass: true }); M('ℤ', 400, 660, 64, { pass: true }); M('ℕ', 650, 790, 56, { c: P.ac, pass: true }); });
        fade(A(t, 12.6), () => { el('5', 640, 880, { s: 46 }); el('−2', 430, 900, { s: 46 }); el(R`\frac{3}{4}`, 300, 790, { s: 46, dy: 0 }); el(R`−\frac{1}{2}`, 370, 1030, { s: 46, dy: 0 }); });
        fade(A(t, 1.0), () => M(R`5 = \frac{5}{1} = \frac{10}{2}`, 540, 1350, 84, { id: 'cinco' }));
        fade(A(t, 10.0), () => M(R`ℕ ⊆ ℤ ⊆ \hl{ℚ}`, 540, 1520, 96, { id: 'cad' }));
      } },
    { id: 'decimal', name: 'El decimal de una fracción', dur: 39,
      caps: [[0.5, 9.0, 'DIVIDIR', R`$\frac{7}{8} = 7 ÷ 8 = 0.875$:`, 'el decimal termina.'], [9.4, 20.0, 'OTRAS NO TERMINAN', R`$\frac{1}{7} = 0.142857142857…$`, 'el bloque se repite.'],
        [20.4, 29.0, 'POR QUÉ SE REPITE', 'Al dividir entre 7 solo hay', 'seis restos posibles.'], [29.4, 38.4, 'LA RAYITA', 'Marca el bloque que se repite,', 'el período.']],
      narr: [[0.5, 9.0, 'Para pasar una fracción a decimal se divide. Siete octavos es siete entre ocho: cero coma ochocientos setenta y cinco. Se acaba.'],
        [9.4, 20.0, 'Un séptimo no se acaba: uno, cuatro, dos, ocho, cinco, siete, y otra vez uno, cuatro, dos… El mismo bloque, sin fin.'],
        [20.4, 29.0, 'Al dividir entre siete, los restos solo pueden ser del uno al seis. Tarde o temprano uno se repite, y desde ahí todo se repite.'],
        [29.4, 38.4, 'Por eso el decimal de una fracción o termina o se repite. El bloque que se repite se llama período y se marca con una rayita.']],
      ev: [[1.0, 'rise'], [10.0, 'pops', 6], [20.8, 'draw', 3.0], [24.4, 'yes'], [29.8, 'draw', .6]],
      draw(t) {
        fade(A(t, 1.0) * (1 - A(t, 9.2)), () => { M(R`\frac{7}{8} = 7 ÷ 8 = \hl{0.875}`, 540, 760, 92, { id: 'ter' }); label('termina', 540, 880, P.mute, { s: 40 }); });
        if (t > 9.4) { const digs = '142857142857', n = Math.min(12, Math.floor((t - 10.0) / .55) + 1); fade(A(t, 9.6), () => { M(R`\frac{1}{7} = 0.`, 260, 640, 80, { a: 'r', nr: true }); for (let i = 0; i < n; i++) M(digs[i], 280 + i * 54, 640, 80, { a: 'l', c: i >= 6 ? P.ac : P.ink, pass: true }); if (n === 12) M('…', 280 + 12 * 54, 640, 80, { a: 'l', pass: true }); recBox('sep', '1/7 = 0.142857142857…', 100, 560, 1000, 670); }); }
        // el ciclo de restos 1 → 3 → 2 → 6 → 4 → 5 → 1
        if (t > 20.4) { const rs = [1, 3, 2, 6, 4, 5], cx = 540, cy = 1000, r = 190, k = draw(t, 20.8, 3.0);
          fade(A(t, 20.6), () => { label('restos', cx, cy + 12, P.mute, { s: 36 }); rs.forEach((v, i) => { const a = -Math.PI / 2 + i * Math.PI / 3, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; circ(x, y, 40, { w: 4, fill: .14, k: A(t, 20.8 + i * .45) }); fade(A(t, 20.8 + i * .45), () => M(String(v), x, y + 18, 48, { pass: true })); });
            stroke(P.ac, 5, () => { const n = k * 6; for (let s = 0; s <= 60; s++) { const q = s / 60 * n, a = -Math.PI / 2 + q * Math.PI / 3; const x = cx + Math.cos(a) * (r - 62), y = cy + Math.sin(a) * (r - 62); s ? X.lineTo(x, y) : X.moveTo(x, y); } }); }); }
        fade(A(t, 29.8), () => M(R`\frac{1}{7} = 0.\hl{\bar{142857}}`, 540, 1440, 96, { id: 'bar' }), (1 - A(t, 29.8)) * 14);
        fade(A(t, 31.0), () => M(R`\frac{7}{8} = 0.875 \qquad \frac{1}{7} = 0.\bar{142857}`, 540, 1620, 62, { id: 'dos' }));
      } },
    { id: 'periodico', name: 'De decimal a fracción', dur: 38,
      caps: [[0.5, 9.0, 'DECIMAL QUE TERMINA', 'Se escribe sobre 10, 100,', R`1000…: $0.875 = \frac{875}{1000}$.`], [9.4, 18.0, 'PERIÓDICO', 'Se llama $x$ al número', 'y se corre la coma.'],
        [18.4, 27.0, 'SE RESTA', 'Las colas que se repiten', 'se cancelan.'], [27.4, 37.4, 'RESULTADO', R`$0.\bar{27} = \frac{27}{99} = \frac{3}{11}$:`, 'es racional.']],
      narr: [[0.5, 9.0, 'El camino de vuelta. Un decimal que termina se escribe sobre una potencia de diez y se simplifica: ochocientos setenta y cinco milésimos es siete octavos.'],
        [9.4, 18.0, 'Para uno periódico, como cero coma veintisiete veintisiete, se le llama x. El bloque tiene dos cifras, así que se multiplica por cien.'],
        [18.4, 27.0, 'Cien x y x tienen la misma cola después de la coma. Al restarlas, la cola desaparece: noventa y nueve x es igual a veintisiete.'],
        [27.4, 37.4, 'Entonces x es veintisiete noventainueveavos, que se simplifica a tres onceavos. Todo decimal periódico es una fracción.']],
      ev: [[1.0, 'rise'], [3.6, 'card'], [9.8, 'rise'], [12.4, 'fly', 1.0], [18.8, 'cut'], [27.8, 'card']],
      draw(t) {
        fade(A(t, 1.0) * (1 - A(t, 9.2)), () => { M(R`0.875 = \frac{875}{1000}`, 540, 760, 86, { id: 'p1' }); fade(A(t, 3.6), () => M(R`= \frac{875 ÷ 125}{1000 ÷ 125} = \hl{\frac{7}{8}}`, 540, 960, 80, { id: 'p2' })); });
        const st = t < 9.4 ? 0 : 1 + Math.floor((t - 9.8) / 2.6);
        fade(A(t, 9.6), () => {
          M(R`x = 0.272727…`, 540, 660, 76, { id: 'x' });
          fade(A(t, 12.4), () => M(R`100x = 27.272727…`, 540, 790, 76, { id: 'cx' }));
          fade(A(t, 18.6), () => { line(230, 830, 850, 830, { w: 4, k: draw(t, 18.6, .6) }); M(R`99x = 27`, 540, 930, 86, { id: 'res' }); });
          fade(win(t, 18.8, 27.2), () => { stroke(P.ac, 5, () => { X.roundRect(560, 600, 300, 80, 16); X.roundRect(560, 730, 300, 80, 16); }, { dash: [12, 10] }); label('iguales: se cancelan', 860, 1010, P.ac, { s: 36, a: 'r' }); });
          fade(A(t, 27.8), () => M(R`x = \frac{27}{99} = \hl{\frac{3}{11}}`, 540, 1180, 92, { id: 'fin' }));
        });
        fade(A(t, 28.4), () => label('todo decimal periódico es racional', 540, 1440, P.ink, { s: 44 }));
        void st;
      } },
    { id: 'recta', name: 'Fracciones en la recta', dur: 27,
      caps: [[0.5, 9.0, 'UBICAR', 'Se parte cada unidad en', 'tantas partes como diga abajo.'], [9.4, 18.0, 'TRES EJEMPLOS', R`$\frac{2}{7}$, $\frac{5}{4}$ y $−\frac{5}{3}$`, 'en su lugar.'],
        [18.4, 26.4, 'MUY JUNTOS', 'Entre dos racionales', 'siempre caben más.']],
      narr: [[0.5, 9.0, 'Para ubicar una fracción en la recta, se parte cada unidad en tantas partes como diga el denominador, y se cuentan.'],
        [9.4, 18.0, 'Dos séptimos queda antes de la mitad. Cinco cuartos se pasa un poco del uno. Menos cinco tercios queda entre menos dos y menos uno.'],
        [18.4, 26.4, 'Y los racionales están muy apretados: entre uno y cinco cuartos cabe nueve octavos, su punto medio. Siempre se puede meter otro.']],
      ev: [[1.0, 'draw', 1.2], [9.8, 'pop', 0], [11.6, 'pop', 1], [13.4, 'pop', 2], [18.8, 'pop', 3]],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: -2, v1: 2, ticks: [-2, -1, 0, 1, 2], k: draw(t, 1.0, 1.2) });
        fade(A(t, 2.0), () => { for (let i = 1; i < 7; i++) line(X_(i / 7), LY - 12, X_(i / 5), LY + 12, { w: 3, c: hexA(P.ink, .6) }); for (let i = 1; i < 4; i++) line(X_(1 + i / 4), LY - 12, X_(1 + i / 4), LY + 12, { w: 3, c: hexA(P.ink, .6) }); line(X_(-5 / 3), LY - 12, X_(-5 / 3), LY + 12); line(X_(-4 / 3), LY - 12, X_(-4 / 3), LY + 12, { w: 3, c: hexA(P.ink, .6) }); });
        [[2 / 7, R`\frac{2}{7}`, 9.8], [1.25, R`\frac{5}{4}`, 11.6], [-5 / 3, R`−\frac{5}{3}`, 13.4]].forEach(([v, s, t0]) => fade(A(t, t0), () => { dot(X_(v), LY, { r: 13, c: P.ac, ping: ping(t, t0) }); M(s, X_(v), LY - 70, 52, { c: P.ac, pass: true }); }));
        fade(A(t, 18.8), () => { const a = 1, b = 1.25, m = (a + b) / 2; dot(X_(m), LY, { r: 11, c: P.ink, ping: ping(t, 18.8) }); M(R`\frac{9}{8}`, X_(m), LY + 160, 46, { pass: true }); brace(X_(a), X_(b), LY + 40, { k: 1, c: P.mute }); });
        fade(A(t, 19.4), () => M(R`\frac{1}{2}(1 + \frac{5}{4}) = \frac{9}{8}`, 540, 1420, 66, { id: 'medio' }));
      } },
  ],
  sum: [['Racionales', R`ℚ = \{ \frac{m}{n} : m, n ∈ ℤ, \; n ≠ 0 \}`], ['Equivalentes', R`\frac{2}{7} = \frac{4}{14} \qquad \frac{18}{24} = \frac{3}{4}`], ['Los enteros también', R`ℕ ⊆ ℤ ⊆ ℚ`],
    ['El decimal termina…', R`\frac{7}{8} = 0.875`], ['…o se repite', R`\frac{1}{7} = 0.\bar{142857}`], ['Periódico a fracción', R`0.\bar{27} = \frac{27}{99} = \frac{3}{11}`]],
  end: ['Una fracción y su decimal', 'son el mismo número.'],
  finNarr: [[0.8, 10.4, 'En resumen: los racionales son los cocientes de enteros con denominador distinto de cero, y cada uno tiene muchos nombres.'],
    [10.6, 17.6, 'Su decimal termina o se repite, y todo decimal así vuelve a ser una fracción.']],
};
