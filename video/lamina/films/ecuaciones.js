// Lección alg-73 · Ecuaciones exponenciales y logarítmicas (mundo Crecimiento Exponencial).
// La cafeína de una taza (160 mg, queda el 88 % cada hora): ¿cuándo baja a 40 mg? Igualar bases (16ˣ = 8ˣ⁺²),
// tomar logaritmos (5ˣ = 40), aislar la potencia (2·3ˣ + 7 = 61), juntar logaritmos y descartar soluciones extrañas.
const R = String.raw;
const POSTER = 120;
const FILM = {
  lesson: 'alg-73', world: 'exp-log', key: 'G', n: [4, 4],
  title: 'Ecuaciones exponenciales y logarítmicas',
  next: null,
  intro: 'Cuando la incógnita sube al exponente, despejarla pide una herramienta nueva. Los logaritmos la bajan.',
  examples: ['160 mg', '0.88', '16ˣ = 8ˣ⁺²', '5ˣ = 40', '2 · 3ˣ + 7 = 61', 'log₃(x + 1)', '10.8'],
  scenes: [
    { id: 'cafe', name: 'La cafeína', dur: 31,
      caps: [[0.5, 9.0, 'UNA TAZA', 'Deja 160 mg de cafeína;', R`cada hora queda el $88\,\%$.`], [9.4, 19.0, 'EL MODELO', '$C(t) = 160 · 0.88^{t}$', ''],
        [19.4, 30.4, 'LA PREGUNTA', 'Cuándo baja a 40 mg:', '$160 · 0.88^{t} = 40$.']],
      narr: [[0.5, 9.0, 'Una taza de café deja ciento sesenta miligramos de cafeína en el cuerpo, y cada hora queda el ochenta y ocho por ciento.'],
        [9.4, 19.0, 'Quedar el ochenta y ocho por ciento es multiplicar por cero coma ochenta y ocho cada hora: una exponencial que decrece.'],
        [19.4, 30.4, 'La pregunta es cuándo baja a cuarenta miligramos. La incógnita, el tiempo, quedó arriba, en el exponente.']],
      ev: [[1.0, 'pop'], [9.8, 'draw', 1.6], [19.8, 'doubt']],
      draw(t) {
        const Pl = plane({ ox: 170, oy: 1380, sx: 50, sy: 4.2, x0: 0, x1: 16.5, y0: 0, y1: 175, k: A(t, 9.8), grid: false, xt: [4, 8, 12, 16], yt: [40, 80, 160] });
        plot(x => 160 * .88 ** x, 0, 16, Pl, { k: draw(t, 9.8, 1.6) });
        fade(A(t, 1.0), () => M(R`160 \t{ mg}`, 540, 560, 76, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`C(t) = 160 · 0.88^{\hl{t}}`, 620, 700, 60, { id: 'b' }));
        fade(A(t, 19.8), () => { stroke(P.ac, 3, () => { X.moveTo(Pl.X(0), Pl.Y(40)); X.lineTo(Pl.X(16.5), Pl.Y(40)); }, { dash: [10, 10] }); dot(Pl.X(10.84), Pl.Y(40), { r: 13, c: P.ac, ping: ping(t, 20.4) }); M('t = ?', Pl.X(10.84), Pl.Y(40) + 70, 40, { c: P.ac, pass: true }); });
      } },
    { id: 'bases', name: 'Igualar bases', dur: 33,
      caps: [[0.5, 9.0, 'EL CAMINO CORTO', '$16^{x} = 8^{x + 2}$: los dos', 'son potencias de 2.'], [9.4, 19.0, 'MISMA BASE', '$2^{4x} = 2^{3x + 6}$', ''],
        [19.4, 32.4, 'EXPONENTES IGUALES', '$4x = 3x + 6$, así que', '$x = 6$.']],
      narr: [[0.5, 9.0, 'Primero el camino corto. En dieciséis a la x igual a ocho a la x más dos, las dos bases son potencias de dos.'],
        [9.4, 19.0, 'Dieciséis es dos a la cuatro y ocho es dos al cubo. Con la ley de potencias: dos a la cuatro x igual a dos a la tres x más seis.'],
        [19.4, 32.4, 'Como la exponencial no repite valores, los exponentes deben ser iguales: cuatro x igual a tres x más seis. Así que x vale seis.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.0], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`16^{x} = 8^{x + 2}`, 540, 620, 92, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`(2^{4})^{x} = (2^{3})^{x + 2}`, 540, 820, 70, { id: 'b' }));
        fade(A(t, 12.0), () => M(R`2^{\hl{4x}} = 2^{\hl{3x + 6}}`, 540, 980, 76, { id: 'c' }));
        fade(A(t, 19.8), () => M(R`4x = 3x + 6 \;⇒\; x = \hl{6}`, 540, 1160, 70, { id: 'd' }));
      } },
    { id: 'tomarlog', name: 'Tomar logaritmos', dur: 33,
      caps: [[0.5, 9.0, 'SIN BASE COMÚN', '$5^{x} = 40$: 40 no es', 'potencia de 5.'], [9.4, 19.0, 'LOGARITMO A LOS DOS LADOS', R`$\log 5^{x} = \log 40$`, R`$x \log 5 = \log 40$`],
        [19.4, 32.4, 'DESPEJAR', R`$x = \frac{\log 40}{\log 5} ≈ 2.29$`, '']],
      narr: [[0.5, 9.0, 'Pero cinco a la x igual a cuarenta no se deja: cuarenta no es una potencia de cinco. La respuesta está entre dos y tres.'],
        [9.4, 19.0, 'Se toma logaritmo a los dos lados. Por la ley de la potencia, el exponente baja y queda multiplicando.'],
        [19.4, 32.4, 'Ya es una ecuación lineal: x es el logaritmo de cuarenta entre el de cinco, más o menos dos coma veintinueve.']],
      ev: [[1.0, 'doubt'], [9.8, 'rise'], [19.8, 'sum']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`5^{x} = 40`, 540, 600, 92, { id: 'a' }));
        fade(A(t, 2.6), () => M(R`5^{2} = 25 \qquad 5^{3} = 125`, 540, 720, 50, { id: 'p', c: P.mute }));
        fade(A(t, 9.8), () => M(R`\log 5^{x} = \log 40`, 540, 880, 66, { id: 'b' }));
        fade(A(t, 12.0), () => M(R`\hl{x} \, \log 5 = \log 40`, 540, 1010, 66, { id: 'c' }));
        fade(A(t, 19.8), () => M(R`x = \frac{\log 40}{\log 5} ≈ \frac{1.602}{0.699} ≈ \hl{2.29}`, 540, 1210, 58, { id: 'd' }));
      } },
    { id: 'resolver', name: 'La taza de café', dur: 34,
      caps: [[0.5, 9.0, 'DIVIDIR', R`$0.88^{t} = \frac{40}{160} = 0.25$`, ''], [9.4, 19.0, 'LOGARITMO NATURAL', R`$t \ln 0.88 = \ln 0.25$`, ''],
        [19.4, 33.4, 'LA RESPUESTA', R`$t = \frac{\ln 0.25}{\ln 0.88} ≈ 10.8$ horas.`, '']],
      narr: [[0.5, 9.0, 'Volviendo al café: primero se deja sola la potencia. Se divide entre ciento sesenta: cero coma ochenta y ocho a la t es un cuarto.'],
        [9.4, 19.0, 'Se toma logaritmo, ahora el natural, de base e. Sirve cualquier base: el resultado es el mismo.'],
        [19.4, 33.4, 'Los dos logaritmos son negativos, así que el cociente es positivo: unas diez coma ocho horas. Por eso un café de la tarde todavía actúa en la noche.']],
      ev: [[1.0, 'shuffle', 1.0], [9.8, 'rise'], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`160 · 0.88^{t} = 40`, 540, 600, 70, { id: 'a' }));
        fade(A(t, 2.6), () => M(R`0.88^{t} = 0.25`, 540, 740, 76, { id: 'b' }));
        fade(A(t, 9.8), () => M(R`\ln 0.88^{t} = \ln 0.25 \;⇒\; t \, \ln 0.88 = \ln 0.25`, 540, 900, 50, { id: 'c' }));
        fade(A(t, 19.8), () => M(R`t = \frac{\ln 0.25}{\ln 0.88} ≈ \frac{−1.386}{−0.128} ≈ \hl{10.8}`, 540, 1110, 56, { id: 'd' }));
      } },
    { id: 'aislar', name: 'Aislar la potencia', dur: 30,
      caps: [[0.5, 9.0, 'PRIMERO AISLAR', '$2 · 3^{x} + 7 = 61$:', 'quitar lo que estorba.'], [9.4, 19.0, 'PASO A PASO', 'Restar 7, dividir entre 2:', '$3^{x} = 27$.'],
        [19.4, 29.4, '!EL ERROR', 'No se puede juntar', '$2 · 3^{x}$ en $6^{x}$.']],
      narr: [[0.5, 9.0, 'Cuando la potencia viene acompañada, como en dos por tres a la x más siete igual a sesenta y uno, primero se aísla.'],
        [9.4, 19.0, 'Se resta siete: dos por tres a la x es cincuenta y cuatro. Se divide entre dos: tres a la x es veintisiete, así que x es tres.'],
        [19.4, 29.4, 'Un error frecuente es juntar dos por tres a la x en seis a la x. El exponente solo afecta al tres.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 2], [19.8, 'no']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`2 · 3^{x} + 7 = 61`, 540, 600, 76, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`2 · 3^{x} = 54`, 540, 760, 66, { id: 'b' }));
        fade(A(t, 11.6), () => M(R`3^{x} = 27 = 3^{3} \;⇒\; x = \hl{3}`, 540, 900, 66, { id: 'c' }));
        fade(A(t, 19.8), () => M(R`2 · 3^{x} \no{≠} 6^{x}`, 540, 1120, 72, { id: 'd' }));
      } },
    { id: 'logaritmica', name: 'Con logaritmos', dur: 34,
      caps: [[0.5, 9.0, 'AL REVÉS', R`$\log_{3}(x + 1) + \log_{3}(x − 1) = 1$`, ''], [9.4, 19.0, 'JUNTAR', 'Suma de logaritmos:', R`$\log_{3}(x^{2} − 1) = 1$.`],
        [19.4, 33.4, 'A POTENCIA', '$x^{2} − 1 = 3^{1}$, así que', '$x = 2$ o $x = −2$.']],
      narr: [[0.5, 9.0, 'En una ecuación logarítmica se hace lo contrario: hay que sacar la x de adentro del logaritmo.'],
        [9.4, 19.0, 'La suma de logaritmos es el logaritmo del producto: x más uno por x menos uno es x al cuadrado menos uno.'],
        [19.4, 33.4, 'Ahora se pasa a potencia: si el logaritmo en base tres es uno, lo de adentro es tres a la uno. x al cuadrado es cuatro: dos o menos dos.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.0], [19.8, 'pops', 2]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\log_{3}(x + 1) + \log_{3}(x − 1) = 1`, 540, 620, 54, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\log_{3} \hl{(x + 1)(x − 1)} = 1`, 540, 780, 58, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`x^{2} − 1 = 3^{1} \;⇒\; x^{2} = 4`, 540, 960, 64, { id: 'c' }));
        fade(A(t, 22.4), () => M(R`x = 2 \quad \t{o} \quad x = −2`, 540, 1110, 66, { id: 'd' }));
      } },
    { id: 'extranas', name: 'Soluciones extrañas', dur: 32,
      caps: [[0.5, 9.0, 'COMPROBAR', R`Con $x = −2$: $\log_{3}(−1)$`, 'no existe.'], [9.4, 19.0, 'SE DESCARTA', '$−2$ es una solución', 'extraña.'],
        [19.4, 31.4, 'LA QUE SÍ', R`$x = 2$: $\log_{3} 3 + \log_{3} 1$`, '$= 1 + 0 = 1$.']],
      narr: [[0.5, 9.0, 'Hay que comprobar en la ecuación original. Con menos dos aparecen logaritmos de menos uno y de menos tres, que no existen.'],
        [9.4, 19.0, 'Menos dos salió del álgebra, pero no resuelve la ecuación: es una solución extraña, y se descarta.'],
        [19.4, 31.4, 'Con dos: logaritmo de tres más logaritmo de uno, uno más cero, uno. La única solución es dos.']],
      ev: [[1.0, 'no'], [9.8, 'cut'], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => { M(R`x = −2`, 290, 640, 64, { id: 'a' }); M(R`\log_{3}(−1) \no{\t{ no existe}}`, 290, 760, 46, { id: 'b' }); });
        mark(290, 920, 52, false, A(t, 9.8));
        fade(A(t, 19.8), () => { M(R`x = 2`, 790, 640, 64, { id: 'c' }); M(R`\log_{3} 3 + \log_{3} 1 = 1`, 790, 760, 46, { id: 'd' }); });
        mark(790, 920, 52, true, A(t, 21.4));
        fade(A(t, 23.0), () => M(R`\t{Solución: } x = \hl{2}`, 540, 1140, 72, { id: 'e' }));
      } },
  ],
  sum: [['Igualar bases', R`2^{4x} = 2^{3x + 6} \;⇒\; 4x = 3x + 6`], ['Tomar logaritmos', R`5^{x} = 40 \;⇒\; x = \frac{\log 40}{\log 5}`], ['Aislar primero', R`2 · 3^{x} + 7 = 61 \;⇒\; 3^{x} = 27`], ['Logarítmicas', R`\t{juntar y pasar a potencia}`], ['Comprobar', R`\t{descartar las extrañas}`]],
  end: ['El logaritmo baja la incógnita;', 'la potencia la saca del logaritmo.'],
  finNarr: [[0.8, 9.0, 'En resumen: con bases iguales se igualan los exponentes; si no, se toma logaritmo y el exponente baja.'],
    [9.2, 16.0, 'En las logarítmicas se junta todo y se pasa a potencia, y siempre se comprueba la respuesta.']],
};
