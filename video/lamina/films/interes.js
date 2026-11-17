// Lección alg-13b · Interés simple y compuesto (mundo Crecimiento Exponencial).
// Valentina ahorra 800 000 para un viaje en 4 años al 5 % anual: simple (I = C·i·t, 960 000) frente a compuesto
// (M = C(1 + i)ⁿ, 972 405); tasa y periodo en la misma unidad (12 % anual pagado cada mes); valor presente; regla del 72.
const R = String.raw;
const POSTER = 100;
const yrs = [800000, 840000, 882000, 926100, 972405];
const fmt = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
const FILM = {
  lesson: 'alg-13b', world: 'exp-log', key: 'G', n: [2, 4],
  title: 'Interés simple y compuesto',
  next: 'Logaritmos y sus propiedades',
  intro: 'Valentina ahorra para un viaje en cuatro años. Dos bancos le pagan el cinco por ciento, pero uno paga más.',
  examples: ['800 000', '1.05⁴', '960 000', '972 405', '822 702', '72/8'],
  scenes: [
    { id: 'viaje', name: 'Dos bancos', dur: 30,
      caps: [[0.5, 9.0, 'EL AHORRO', R`$800\,000$ pesos durante`, '4 años.'], [9.4, 19.0, 'LA OFERTA', 'Los dos bancos pagan', R`el $5\,\%$ cada año.`],
        [19.4, 29.4, 'LA DIFERENCIA', 'Uno paga sobre lo inicial;', 'el otro, sobre lo acumulado.']],
      narr: [[0.5, 9.0, 'Valentina tiene ochocientos mil pesos y no los va a tocar en cuatro años: son para un viaje.'],
        [9.4, 19.0, 'Dos bancos le ofrecen lo mismo en apariencia: el cinco por ciento de interés cada año.'],
        [19.4, 29.4, 'La diferencia está en la letra pequeña: uno paga siempre sobre lo que ella metió; el otro, sobre lo que ya lleva.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 2], [19.8, 'doubt']],
      draw(t) {
        fade(A(t, 1.0), () => { bar(190, 640, 700, 110, { k: eio(seg(t, 1.0, 2.0)), label: R`800\,000` }); });
        [['A', 290], ['B', 790]].forEach(([b, x], i) => fade(A(t, 9.8 + i * .4), () => { rect(x - 190, 900, 380, 300, { r: 22, w: 5 }); M(R`\t{Banco } ${b}`, x, 990, 54, { pass: true }); M(R`5\,\% \t{ anual}`, x, 1100, 58, { c: P.ac, pass: true }); }));
        fade(A(t, 19.8), () => { M(R`\t{sobre lo inicial}`, 290, 1290, 40, { pass: true, c: P.mute }); M(R`\t{sobre lo acumulado}`, 790, 1290, 40, { pass: true, c: P.ac }); });
      } },
    { id: 'simple', name: 'Interés simple', dur: 34,
      caps: [[0.5, 9.0, 'BANCO A', R`El $5\,\%$ de $800\,000$:`, R`$40\,000$ cada año.`], [9.4, 19.0, 'LA FÓRMULA', '$I = C · i · t$', 'capital, tasa, tiempo.'],
        [19.4, 27.0, 'EL MONTO', R`$800\,000 + 160\,000$`, R`$= 960\,000$.`], [27.4, 33.4, 'LA FORMA', 'Siempre lo mismo:', 'crece en línea recta.']],
      narr: [[0.5, 9.0, 'En el banco A, el interés es simple. El cinco por ciento de ochocientos mil son cuarenta mil, y eso paga cada año.'],
        [9.4, 19.0, 'El interés es capital por tasa por tiempo. La tasa va en decimal: cinco por ciento es cero coma cero cinco.'],
        [19.4, 27.0, 'En cuatro años: ciento sesenta mil de interés. Ella recibe novecientos sesenta mil.'],
        [27.4, 33.4, 'Como cada año suma lo mismo, el dinero crece en línea recta.']],
      ev: [[1.0, 'pops', 4], [9.8, 'rise'], [19.8, 'sum']],
      draw(t) {
        for (let y = 0; y < 4; y++) fade(A(t, 1.0 + y * .7), () => { bar(160, 560 + y * 100, 640, 70, { a: .18, c: P.mute }); bar(800, 560 + y * 100, 64 * 1, 70, { label: R`40\,000`, out: true, s: 36 }); M(R`\t{año } ${y + 1}`, 120, 606 + y * 100, 34, { a: 'r', pass: true }); });
        fade(A(t, 9.8), () => M(R`I = C · i · t`, 540, 1080, 84, { id: 'f' }));
        fade(A(t, 19.8), () => M(R`I = 800\,000 · 0.05 · 4 = \hl{160\,000}`, 540, 1220, 56, { id: 'g' }));
        fade(A(t, 27.8), () => M(R`M = C + I = 960\,000`, 540, 1360, 64, { id: 'h' }));
      } },
    { id: 'compuesto', name: 'Interés compuesto', dur: 36,
      caps: [[0.5, 9.0, 'BANCO B', R`Año 1: $40\,000$.`, 'Se suman al capital.'], [9.4, 19.0, 'AÑO 2', R`Paga sobre $840\,000$:`, R`$42\,000$.`],
        [19.4, 28.0, 'AÑOS 3 Y 4', R`$44\,100$ y luego`, R`$46\,305$.`], [28.4, 35.4, 'EL MONTO', R`$972\,405$: el interés`, 'también gana interés.']],
      narr: [[0.5, 9.0, 'En el banco B, el interés es compuesto. El primer año paga lo mismo, cuarenta mil, pero los suma al capital.'],
        [9.4, 19.0, 'El segundo año, el cinco por ciento se calcula sobre ochocientos cuarenta mil: cuarenta y dos mil.'],
        [19.4, 28.0, 'El tercer año, cuarenta y cuatro mil cien. El cuarto, cuarenta y seis mil trescientos cinco. Cada escalón es más alto.'],
        [28.4, 35.4, 'Al final tiene novecientos setenta y dos mil cuatrocientos cinco: el interés también gana interés.']],
      ev: [[1.0, 'pop'], [9.8, 'pop'], [19.8, 'pops', 2], [28.8, 'yes']],
      draw(t) {
        const sc = v => (v - 760000) / 240000 * 780;
        for (let y = 0; y < 4; y++) {
          const tt = [1.0, 9.8, 19.8, 23.0][y]; const a = A(t, tt);
          fade(a, () => { const w0 = sc(yrs[y]), w1 = sc(yrs[y + 1]); bar(160, 560 + y * 110, w0, 74, { a: .2, c: P.mute }); bar(160 + w0, 560 + y * 110, (w1 - w0) * eio(seg(t, tt, tt + .8)), 74, { label: R`+${fmt(yrs[y + 1] - yrs[y])}`, out: true, s: 34 }); M(R`\t{año } ${y + 1}`, 120, 608 + y * 110, 34, { a: 'r', pass: true }); });
        }
        fade(A(t, 28.8), () => { M(R`\t{A: } 960\,000 \qquad \t{B: } \hl{972\,405}`, 540, 1160, 58, { id: 'm' }); M(R`\t{diferencia: } 12\,405`, 540, 1270, 48, { id: 'd', c: P.mute }); });
      } },
    { id: 'formula', name: 'Multiplicar por 1.05', dur: 33,
      caps: [[0.5, 9.0, 'CADA AÑO', R`Sumar el $5\,\%$ es`, 'multiplicar por $1.05$.'], [9.4, 19.0, 'LA FÓRMULA', '$M = C(1 + i)^{n}$', ''],
        [19.4, 32.4, 'ES EXPONENCIAL', 'El tiempo va en el exponente:', 'la recta frente a la curva.']],
      narr: [[0.5, 9.0, 'Sumarle a algo su cinco por ciento es lo mismo que multiplicarlo por uno coma cero cinco.'],
        [9.4, 19.0, 'Cuatro años son cuatro multiplicaciones: el monto es el capital por uno más i, elevado a n, el número de periodos.'],
        [19.4, 32.4, 'El tiempo quedó en el exponente: es una función exponencial. Al principio la curva y la recta van juntas; con los años, la curva se despega.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'draw', 1.6]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x + 0.05x = \hl{1.05}\,x`, 540, 560, 70, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`M = C\,(1 + i)^{n} = 800\,000 · 1.05^{4}`, 540, 700, 56, { id: 'b' }));
        const Pl = plane({ ox: 170, oy: 1500, sx: 36, sy: 340, x0: 0, x1: 22, y0: 0, y1: 2, k: A(t, 19.8), grid: false, xt: [5, 10, 15, 20], yt: [1, 2] });
        plot(x => 1 + .05 * x, 0, 21, Pl, { k: draw(t, 19.8, 1.6), c: P.mute, w: 5 });
        plot(x => 1.05 ** x, 0, 21, Pl, { k: draw(t, 20.6, 1.6) });
        fade(A(t, 22.6), () => { label('simple', Pl.X(21), Pl.Y(2.05) + 70, P.mute, { s: 34, a: 'r' }); label('compuesto', Pl.X(14.3), Pl.Y(2) - 10, P.ac, { s: 34, a: 'r' }); });
      } },
    { id: 'periodo', name: 'Tasa y periodo', dur: 34,
      caps: [[0.5, 9.0, 'LA MISMA UNIDAD', 'Si paga cada mes, $i$ es', 'mensual y $n$ cuenta meses.'], [9.4, 19.0, '12 % ANUAL', 'Pagado cada mes:', R`$1\,\%$ mensual, 12 veces.`],
        [19.4, 33.4, 'RINDE MÁS', '$1.01^{12} ≈ 1.1268$:', R`un $12.68\,\%$ efectivo.`]],
      narr: [[0.5, 9.0, 'Regla de oro: la tasa y los periodos van en la misma unidad. Si el banco paga cada mes, todo se cuenta en meses.'],
        [9.4, 19.0, 'Un doce por ciento anual pagado cada mes significa un uno por ciento mensual, aplicado doce veces en el año.'],
        [19.4, 33.4, 'Uno coma cero uno a la doce da uno coma uno dos seis ocho. Ese año rinde doce coma sesenta y ocho por ciento, un poco más que el doce prometido.']],
      ev: [[1.0, 'card'], [9.8, 'pops', 12], [19.8, 'sum']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`i \t{ y } n \t{ en la misma unidad}`, 540, 600, 56, { id: 'u' }));
        for (let m = 0; m < 12; m++) fade(A(t, 9.8 + m * .25), () => { const x = 130 + (m % 6) * 140, y = 760 + Math.floor(m / 6) * 130; rect(x, y, 110, 100, { r: 14, w: 4 }); M(R`×1.01`, x + 55, y + 62, 32, { pass: true, c: P.ac }); });
        fade(A(t, 19.8), () => M(R`1.01^{12} ≈ 1.1268`, 540, 1180, 76, { id: 'v' }));
        fade(A(t, 22.0), () => M(R`12.68\,\% \;>\; 12\,\%`, 540, 1320, 64, { id: 'w', c: P.ac }));
      } },
    { id: 'presente', name: 'Al revés', dur: 32,
      caps: [[0.5, 9.0, 'UNA META', R`Tener $1\,000\,000$`, R`en 4 años al $5\,\%$.`], [9.4, 19.0, 'DESPEJAR', R`$C = \frac{M}{(1 + i)^{n}}$`, ''],
        [19.4, 31.4, 'EL VALOR PRESENTE', R`$\frac{1\,000\,000}{1.2155} ≈ 822\,702$`, '']],
      narr: [[0.5, 9.0, 'También se puede preguntar al revés: cuánto debería meter hoy Valentina para tener un millón en cuatro años.'],
        [9.4, 19.0, 'Si el monto es el capital por el factor, el capital es el monto dividido entre ese factor.'],
        [19.4, 31.4, 'Uno coma cero cinco a la cuatro es uno coma dos uno cinco cinco. El millón dividido entre eso: unos ochocientos veintidós mil setecientos dos.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.0], [19.8, 'sum']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`M = 1\,000\,000, \quad n = 4, \quad i = 0.05`, 540, 620, 50, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`C = \frac{M}{(1 + i)^{n}}`, 540, 840, 84, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`C = \frac{1\,000\,000}{1.05^{4}} ≈ \hl{822\,702}`, 540, 1120, 64, { id: 'c' }));
      } },
    { id: 'regla72', name: 'Cuándo se duplica', dur: 32,
      caps: [[0.5, 9.0, 'DUPLICAR', R`Al $8\,\%$ anual compuesto,`, 'cuántos años.'], [9.4, 19.0, 'LA REGLA DEL 72', '$72 ÷ 8 = 9$ años.', ''],
        [19.4, 31.4, 'COMPROBAR', '$1.08^{9} ≈ 1.999$:', 'casi exacto.']],
      narr: [[0.5, 9.0, 'Un atajo de los banqueros: cuántos años tarda en duplicarse un dinero al ocho por ciento anual compuesto.'],
        [9.4, 19.0, 'La regla del setenta y dos dice: se divide setenta y dos entre la tasa. Setenta y dos entre ocho, nueve años.'],
        [19.4, 31.4, 'Al comprobar, uno coma cero ocho a la nueve da uno coma nueve nueve nueve. Es una aproximación, pero muy buena.']],
      ev: [[1.0, 'pops', 9], [9.8, 'card'], [19.8, 'yes']],
      draw(t) {
        for (let y = 0; y <= 9; y++) fade(A(t, 1.0 + y * .35), () => { const h = 60 * 1.08 ** y * 4; bar(110 + y * 88, 1100 - h, 66, h, { a: y === 9 ? .8 : .35 }); });
        fade(A(t, 4.6), () => { stroke(P.ac, 3, () => { X.moveTo(100, 1100 - 480); X.lineTo(990, 1100 - 480); }, { dash: [10, 10] }); label('el doble', 990, 1100 - 500, P.ac, { s: 32, a: 'r' }); });
        fade(A(t, 9.8), () => M(R`\frac{72}{8} = 9 \t{ años}`, 540, 1260, 72, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`1.08^{9} ≈ \hl{1.999}`, 540, 1420, 66, { id: 'c' }));
      } },
  ],
  sum: [['Simple', R`I = C · i · t`], ['Compuesto', R`M = C\,(1 + i)^{n}`], ['Misma unidad', R`i \t{ y } n \t{ en meses o en años}`], ['Valor presente', R`C = \frac{M}{(1 + i)^{n}}`], ['Regla del 72', R`\t{años} ≈ \frac{72}{\t{tasa}}`]],
  end: ['El interés compuesto', 'es una exponencial del tiempo.'],
  finNarr: [[0.8, 9.0, 'En resumen: el simple paga siempre sobre el capital inicial y crece en línea recta.'],
    [9.2, 16.0, 'El compuesto multiplica cada periodo por uno más i, y crece como una exponencial.']],
};
