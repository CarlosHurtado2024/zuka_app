// preUDA · Componente 1: Razonamiento lógico (spec 2026-11-18-curso-preuda). Un mundo por tema del temario del
// preuniversitario, en orden de prioridad. Cada lección: escenas de respaldo (intuición primero, regla después, un
// ejemplo resuelto) y ejercicios de juego con pista. Los ejemplos de las escenas no se repiten en los ejercicios.
// Las ayudas PU_* sirven también a preuda-lectura.js (va después de este archivo).

const PU_ES = (q, levels, explain, hint) => play('escala-solucion', q, { rounds: [{ levels }] }, explain, { hint });
// tol: el juego calcula exacto; solo se deja el margen de la coma flotante.
const PU_CTA = (q, round, explain, hint) => play('arma-la-cuenta', q, { rounds: [{ tol: 1e-6 * Math.max(1, Math.abs(round.answer)), ...round }] }, explain, { hint });
const PU_ORD = (q, tex, chips, order, sep, explain, hint) => play('ordena-terminos', q, { tex, chips, order, sep }, explain, { hint });
const PU_SUB = (q, rounds, explain, hint) => play('subraya-texto', q, { rounds }, explain, { hint });
// video: { bunny, duration } cuando la lección ya tiene su video en Bunny (duración la que reporta Bunny).
const PU_L = (id, title, scenes, ex, video) => ({ id, title, clip: { ...video, scenes }, ex });

const PU_RAZONAMIENTO = [
  // ---------------- 1 · Cálculo mental ----------------
  { world: 'pu-calculo', title: 'Cálculo mental', block: 'razonamiento', lessons: [
    // Video: video/preuda-cosmos, película «enteros» (spec 2026-11-18-preuda-enteros). Las escenas cuentan lo mismo.
    PU_L('pu-cm-1', 'Enteros, signos y jerarquía', [
      sc(6, 'Un problema para empezar: Luisa, Juliana y Ana hacen el mismo cálculo y obtienen 33, 37 y 49. El resultado correcto difiere de los de ellas en 5, 7 y 9, no necesariamente en ese orden. Al final se sabe quién falló por cuánto.', { title: 'Tres resultados' }),
      sc(6, 'Los enteros son **posiciones** en la recta: a la derecha del 0 los positivos, a la izquierda los negativos. $-3$ y $3$ son **opuestos**: igual de lejos del 0.', { title: 'La recta numérica' }),
      sc(6, 'La **distancia** entre dos números es cuántos pasos hay de uno a otro: de $-3$ a $5$ hay $5 - (-3) = 8$. Se escribe $|5 - (-3)| = 8$ y nunca es negativa. A distancia 4 de 10 hay dos lugares: 6 y 14.', { title: 'La distancia en la recta' }),
      sc(6, 'Sumar es **moverse**: $+6$ va seis pasos a la derecha. $-4 + 6$ sale de $-4$ y llega a $2$.', { title: '$-4 + 6 = 2$' }),
      sc(7, 'Restar es sumar el opuesto: $3 - 7 = 3 + (-7) = -4$. Y restar un negativo es **quitar una deuda**: $2 - (-5) = 7$.', { title: '$2 - (-5) = 2 + 5 = 7$' }),
      sc(7, 'Otro problema: el día siguiente de pasado mañana está tan lejos del domingo como ayer de pasado mañana. En la recta: hoy 0, ayer $-1$, pasado mañana 2 y el día siguiente 3. De $-1$ a 2 hay 3 días, así que el domingo es el día 6: hoy es lunes.', { title: 'Los días en la recta' }),
      sc(7, 'Multiplicar es repetir saltos: $(-3) \\cdot 4$ son cuatro saltos de 3 hacia la izquierda, $-12$. Multiplicar por $-1$ es **dar la vuelta** en el 0: $(-3)(-4)$ son dos vueltas, y queda $12$.', { title: 'El menos da la vuelta' }),
      sc(6, 'Por eso se cuentan los negativos: un número **par** de signos menos da positivo, uno **impar** da negativo. $(-1)(-2)(-3) = -6$.', { title: 'Regla de los signos' }),
      sc(7, 'La jerarquía son **capas**: primero los paréntesis, luego las potencias, después × y ÷ de izquierda a derecha, y al final + y −. Como vestirse: medias antes que zapatos.', { title: 'Las capas de una cuenta' }),
      sc(7, 'Capa por capa: $5 - 7 = -2$, $(-2)^2 = 4$, $2 \\cdot 4 = 8$ y $8 - 8 = 0$. Ojo: $(-2)^2 = 4$, pero $-2^2 = -4$.', { title: '$8 - 2 \\cdot (5 - 7)^2 = 0$' }),
      sc(7, 'El reto: el correcto está a 5, 7 o 9 de 33 (24, 26, 28, 38, 40 o 42). Solo 42 cuadra con los otros: $|42 - 33| = 9$, $|42 - 37| = 5$ y $|42 - 49| = 7$. Juliana falló por 5.', { title: 'Juliana falló por 5' }),
    ], [
      play('recta-espejo', 'Pon en la recta el número que describe cada ronda', { min: -8, max: 8, rounds: [
        { text: 'el opuesto de 7', value: -7 }, { text: '−(−4)', value: 4 }, { text: 'el que sumado con −6 da 0', value: 6 }, { text: 'el opuesto del opuesto de −2', value: -2 },
      ] }, 'El opuesto de un número está a la misma distancia del 0, al otro lado: el de $7$ es $-7$. Un número y su opuesto suman $0$. Y dos signos menos se cancelan: $-(-4) = 4$.',
        { hint: 'Busca primero el número en la recta y luego refléjalo en el 0, como en un espejo. Si hay dos «opuestos», refleja dos veces.' }),
      play('globo-lastre', 'Lleva el canasto a la altura de la bandera', { rounds: [
        { g: 2, s: 5, act: 'addG', target: 1 }, { g: 3, s: 1, act: 'addS', target: -4 }, { g: 6, s: 2, act: 'remG', target: -1 },
        { g: 1, s: 6, act: 'remS', target: -1 }, { g: 4, s: 6, act: 'remS', target: 3 },
      ] }, 'Cada globo vale $+1$ y cada saco de arena $-1$. Amarrar globos es sumar positivos y colgar sacos es sumar negativos. Soltar un globo es restar un positivo: baja. Soltar un saco es restar un negativo: **sube**. Por eso $-5 - (-4) = -1$.',
        { hint: 'Mira si el canasto está por debajo o por encima de la bandera y cuántos niveles le faltan. Luego piensa qué le pasa a la altura cada vez que haces lo que permite esa ronda.' }),
      play('ascensor', 'Lleva el ascensor al piso donde termina cada viaje', { min: -6, max: 7, rounds: [
        { start: 4, move: -9, text: 'Estás en el piso 4 y bajas 9 pisos' }, { start: -5, move: 8, text: 'Estás en el sótano 5 y subes 8 pisos' },
        { start: -2, move: -3, text: 'Estás en el sótano 2 y bajas 3 pisos más' }, { start: 6, move: -6, text: 'Estás en el piso 6 y bajas 6 pisos' },
      ] }, 'Subir suma y bajar resta: $4 - 9 = -5$, $-5 + 8 = 3$, $-2 - 3 = -5$ y $6 - 6 = 0$. Los sótanos son los pisos negativos y la planta baja es el 0.',
        { hint: 'Cuenta los pisos uno por uno pasando por la planta baja, que es el piso 0. Los sótanos se numeran hacia abajo.' }),
      play('tren-ordenado', 'Ordena cada tren de menor a mayor', { rounds: [
        { items: [{ label: '5', v: 5 }, { label: '−8', v: -8 }, { label: '0', v: 0 }, { label: '−3', v: -3 }, { label: '−12', v: -12 }] },
        { items: [{ label: '−1', v: -1 }, { label: '|−6|', v: 6 }, { label: '−|−4|', v: -4 }, { label: '2', v: 2 }, { label: '−9', v: -9 }] },
      ] }, 'En la recta es menor el que queda más a la izquierda. Entre negativos, el más lejano del 0 es el menor: $-12 < -8 < -3 < 0 < 5$. El valor absoluto es la distancia al 0: $|-6| = 6$, pero $-|-4| = -4$.',
        { hint: 'Imagina cada número en la recta. Entre dos negativos, piensa cuál debe más: ese es el menor.' }),
      play('voltea-flecha', 'Estira y voltea la flecha hasta el aro', { rounds: [
        { a: 2, target: -12 }, { a: -4, target: -20 }, { a: -2, target: 10 }, { a: -5, target: 15 }, { a: 6, target: -18 },
      ] }, 'El multiplicador repite la flecha y, si es negativo, la refleja en el 0. Una flecha que ya miraba a la izquierda queda a la derecha al voltearla: por eso $(-2)(-5) = 10$ y $(-5)(-3) = 15$, mientras que $2 \\cdot (-6) = -12$.',
        { hint: 'Primero decide cuántas copias de la flecha caben hasta el aro. Después mira de qué lado del 0 está el aro y hacia dónde apunta la flecha: así sabes si hay que voltearla.' }),
      play('pares-negativos', 'Empareja los factores **negativos** de cada potencia y decide su signo', { rounds: [
        { base: 3, n: 2, paren: true, outer: false }, { base: 3, n: 3, paren: true, outer: false }, { base: 3, n: 2, paren: false, outer: true }, { base: 2, n: 5, paren: true, outer: true },
      ] }, 'Con paréntesis el signo se repite con la base: $(-3)^2$ tiene dos negativos (una pareja, positivo) y $(-3)^3$ deja uno suelto (negativo). Sin paréntesis, $-3^2 = -(3^2) = -9$: solo hay un negativo, el de afuera.',
        { hint: 'Mira si el signo menos está dentro del paréntesis: solo así se repite con cada factor. Empareja los negativos de dos en dos y fíjate si sobra alguno.' }),
      play('capas-operacion', 'Resuelve capa por capa: junta las fichas que se operan primero', { rounds: [
        { title: 'Primero lo de adentro', items: [{ expr: '6 + 2 * ( 5 - 8 ) ^ 2' }, { expr: '( 4 - 9 ) * ( 3 + 1 )' }, { expr: '18 - ( 2 + 4 ) * 3' }] },
        { title: 'Izquierda a derecha', items: [{ expr: '20 / 4 * 5 - 3' }, { expr: '-12 + 18 / -3 * 2' }, { expr: '3 ^ 2 - 4 * ( 1 - 3 )' }] },
      ] }, 'El orden es: paréntesis, potencias, × y ÷ de izquierda a derecha, y + y − de izquierda a derecha. Por ejemplo, $6 + 2(5 - 8)^2 = 6 + 2 \\cdot 9 = 24$.',
        { hint: 'Busca primero si queda algún paréntesis con una operación adentro. Si no, mira si hay potencias; luego × y ÷, y al final + y −, siempre la que esté más a la izquierda.' }),
      play('salta-signos', 'Salta las fichas del signo que dice la misión y atrapa las demás corriendo', { rounds: [
        { title: 'Productos', mission: 'neg', items: [{ text: '(−6)(−2)', sign: 1 }, { text: '(−4)(3)', sign: -1 }, { text: '(7)(−1)', sign: -1 }, { text: '(−5)(−5)', sign: 1 }, { text: '(2)(9)', sign: 1 }, { text: '(−8)(2)', sign: -1 }] },
        { title: 'Tres factores y potencias', mission: 'pos', items: [{ text: '(−1)(−4)(−2)', sign: -1 }, { text: '(−2)(3)(−4)', sign: 1 }, { text: '(−4)²', sign: 1 }, { text: '−4²', sign: -1 }, { text: '(−2)³', sign: -1 }, { text: '(−1)(−1)(5)', sign: 1 }] },
      ] }, 'Basta contar los signos menos: si son pares, el resultado es positivo; si son impares, negativo. Ojo con $-4^2$: el menos está fuera de la potencia, así que da $-16$.',
        { hint: 'No calcules el número: cuenta cuántos factores negativos hay. Un número par de negativos da positivo.' }),
    ], { bunny: '1fb04a76-64d9-42e9-a931-9efec25a2135', duration: 237.1 }),
    PU_L('pu-cm-2', 'Fracciones', [
      sc(6, 'Un problema para empezar: Luis se comió un tercio de una torta y notó que una torta completa era el $60\\,\\%$ (tres quintos) de lo que le quedaba. Al final se sabe cuántas recibió.', { title: 'Las tortas de Luis' }),
      sc(6, 'El número de abajo, el **denominador**, dice en cuántas partes **iguales** se corta; el de arriba, el **numerador**, cuántas se toman. $\\tfrac38$: ocho partes, se toman tres.', { title: 'Abajo se corta, arriba se cuenta' }),
      sc(6, 'Más cortes, la misma cantidad: $\\tfrac35 = \\tfrac{6}{10} = \\tfrac{12}{20}$. Simplificar es el camino de vuelta: $\\tfrac{18}{24} = \\tfrac34$, dividiendo entre 6.', { title: '$\\tfrac{18}{24} = \\tfrac34$' }),
      sc(6, 'Para comparar se multiplica en cruz: $\\tfrac47$ frente a $\\tfrac59$ da $36$ frente a $35$, así que $\\tfrac47$ es mayor. Es pasar las dos a sesenta y tresavos.', { title: 'Producto cruzado' }),
      sc(6, 'La fracción de una cantidad: $\\tfrac27$ de 35 son siete grupos de 5 y se toman dos: $10$. Primero dividir, luego multiplicar.', { title: '$\\tfrac27 \\cdot 35 = 10$' }),
      sc(7, 'Solo se suman pedazos del mismo tamaño: $\\tfrac14 + \\tfrac16 = \\tfrac{3}{12} + \\tfrac{2}{12} = \\tfrac{5}{12}$, no $\\tfrac{2}{10}$.', { title: '$\\tfrac14 + \\tfrac16 = \\tfrac{5}{12}$' }),
      sc(7, 'La fracción **del resto**: Sara gasta $\\tfrac13$ de 120 000 y luego $\\tfrac14$ de lo que le queda (de 80 000, no de 120 000). Le queda $\\tfrac23 \\cdot \\tfrac34 = \\tfrac12$: 60 000.', { title: 'La fracción del resto' }),
      sc(7, 'Otro problema: si sale una niña, $\\tfrac17$ del resto son niñas; si salen dos niños, $\\tfrac15$. Probando opciones: con 22, quedan 21 (3 niñas) o 20 (4 niñas). Eran 4 niñas y 18 niños.', { title: 'Probar las opciones' }),
      sc(7, 'Las tortas: si una torta son $\\tfrac35$ de lo que quedó, cada quinto es $\\tfrac13$ de torta y quedaron $\\tfrac53$. Con el tercio comido: $\\tfrac53 + \\tfrac13 = 2$ tortas.', { title: 'Luis recibió 2 tortas' }),
    ], [
      play('pizzeria', 'Sirve cada pedido: corta la pizza y marca las porciones que pide', { maxSlices: 12, orders: [
        { label: '2/6', num: 1, den: 3 }, { label: 'cinco octavos', num: 5, den: 8 }, { label: 'tres cuartos', num: 3, den: 4 }, { label: '6/9', num: 2, den: 3 },
      ] }, 'El denominador dice en cuántas partes iguales se corta y el numerador cuántas se toman. Fracciones distintas pueden ser la misma cantidad: $\\tfrac26 = \\tfrac13$ y $\\tfrac69 = \\tfrac23$. Eso es simplificar.',
        { hint: 'Elige primero en cuántas porciones cortar. Si el pedido no se puede con ese corte, prueba una fracción equivalente con otro número de porciones.' }),
      play('tableta-fraccion', 'Corta la tableta y toma la fracción que pide cada ronda', { rounds: [
        { total: 32, cols: 8, num: 5, den: 8, what: 'chocolates' }, { total: 40, cols: 10, num: 7, den: 10, what: 'chocolates' },
        { total: 36, cols: 9, num: 5, den: 6, what: 'chocolates' }, { total: 30, cols: 10, num: 2, den: 3, what: 'chocolates' },
      ] }, 'La fracción de una cantidad: se reparte en tantas partes iguales como dice el denominador y se toman las del numerador. $\\tfrac58$ de 32: ocho partes de 4, se toman cinco, $20$. $\\tfrac{7}{10}$ de 40 son $28$; $\\tfrac56$ de 36, $30$; y $\\tfrac23$ de 30, $20$.',
        { hint: 'El número de abajo te dice en cuántas partes iguales cortar. El de arriba, cuántas de esas partes tomar.' }),
      play('ubica-en-recta', 'Suelta cada fracción en su lugar de la recta', { min: 0, max: 3, tol: 0.1, points: [
        { label: '1/2', tex: '\\tfrac12', value: 0.5 }, { label: '5/4', tex: '\\tfrac54', value: 1.25 }, { label: '7/3', tex: '\\tfrac73', value: 2.3333 }, { label: '9/5', tex: '\\tfrac95', value: 1.8 }, { label: '11/4', tex: '\\tfrac{11}{4}', value: 2.75 },
      ] }, 'Una fracción mayor que 1 tiene más arriba que abajo: $\\tfrac54 = 1 + \\tfrac14$, $\\tfrac95 = 1 + \\tfrac45$, $\\tfrac73 = 2 + \\tfrac13$ y $\\tfrac{11}{4} = 2 + \\tfrac34$.',
        { hint: 'Mira cuántas veces cabe el denominador en el numerador: esos son los enteros. Lo que sobra dice cuánto pasa de ese entero.' }),
      play('tren-ordenado', 'Ordena cada tren de menor a mayor', { rounds: [
        { items: [{ label: '1/2', v: 0.5 }, { label: '1/5', v: 0.2 }, { label: '1/3', v: 1 / 3 }, { label: '1/10', v: 0.1 }, { label: '1/4', v: 0.25 }] },
        { items: [{ label: '5/9', v: 5 / 9 }, { label: '3/5', v: 0.6 }, { label: '2/3', v: 2 / 3 }, { label: '7/12', v: 7 / 12 }, { label: '1/2', v: 0.5 }] },
      ] }, 'Con el mismo numerador, es menor la de denominador más grande (se reparte entre más). Para las demás se cruzan los productos o se pasa a un denominador común: $\\tfrac12 < \\tfrac59 < \\tfrac{7}{12} < \\tfrac35 < \\tfrac23$.',
        { hint: 'Si los numeradores son iguales, piensa entre cuántos se reparte. Si no, compara dos fracciones multiplicando en cruz.' }),
      play('corta-igual', 'Recorta las barras en pedacitos del mismo tamaño para poder operar', { rounds: [
        { a: [1, 2], b: [1, 3] }, { a: [3, 4], b: [1, 6] }, { a: [2, 3], b: [1, 4], op: '-' }, { a: [5, 6], b: [3, 8], op: '-' },
      ] }, 'Solo se suman o restan pedazos del mismo tamaño: por eso se busca un denominador común. $\\tfrac12 + \\tfrac13 = \\tfrac36 + \\tfrac26 = \\tfrac56$, $\\tfrac34 + \\tfrac16 = \\tfrac{11}{12}$, $\\tfrac23 - \\tfrac14 = \\tfrac{5}{12}$ y $\\tfrac56 - \\tfrac38 = \\tfrac{11}{24}$.',
        { hint: 'Busca un número de pedacitos que se pueda repartir en los cortes de la primera barra y también en los de la segunda: un múltiplo de los dos denominadores.' }),
      play('lupa-densidad', 'Acerca la lupa y suelta un punto **entre** las dos banderitas', { rounds: [
        { a: { label: '1/3', value: 1 / 3 }, b: { label: '0.34', value: 0.34 }, view: [0, 1] }, { a: { label: '3/4', value: 0.75 }, b: { label: '7/9', value: 7 / 9 }, view: [0, 1] }, { a: { label: '5/3', value: 5 / 3 }, b: { label: '1.7', value: 1.7 }, view: [1, 2] },
      ] }, 'Entre dos fracciones distintas siempre cabe otra, por cerca que estén: $\\tfrac13 = 0.333\\ldots < 0.335 < 0.34$, y entre $\\tfrac34 = 0.75$ y $\\tfrac79 = 0.777\\ldots$ está, por ejemplo, $0.76$.',
        { hint: 'Pasa las dos a decimal con tres cifras: así ves cuál es la menor y qué número queda entre ellas.' }),
      play('carrera-fracciones', 'Toca una puerta para **medirla** en la regla y pasa por la que mide lo mismo que el número de arriba', { rounds: [
        { title: 'Simplificar', items: [{ ask: '6/8', options: ['3/4', '2/3', '6/4'], answer: 0 }, { ask: '10/15', options: ['2/3', '1/5', '5/3'], answer: 0 }, { ask: '9/12', options: ['3/4', '3/2', '1/3'], answer: 0 }, { ask: '4/10', options: ['2/5', '1/4', '4/5'], answer: 0 }] },
        { title: 'Fracción y decimal', items: [{ ask: '3/4', options: ['0.75', '0.34', '3.4'], answer: 0 }, { ask: '2/5', options: ['0.4', '0.25', '2.5'], answer: 0 }, { ask: '1/8', options: ['0.125', '0.8', '1.8'], answer: 0 }, { ask: '9/10', options: ['0.9', '0.09', '9.1'], answer: 0 }] },
      ] }, 'Simplificar es dividir arriba y abajo por lo mismo: $\\tfrac68 = \\tfrac34$, $\\tfrac{10}{15} = \\tfrac23$. Y una fracción es una división: $\\tfrac34 = 0.75$, $\\tfrac25 = 0.4$, $\\tfrac18 = 0.125$.',
        { hint: 'No hay prisa: mide cada puerta en la regla y compara su largo con el del número de arriba.' }),
    ]),
    PU_L('pu-cm-3', 'Decimales y porcentajes', [
      sc(6, 'Un problema para empezar: unos tenis de 120 000 rebajados un $10\\,\\%$ y luego con un impuesto del $10\\,\\%$. Carlos esperaba pagar lo mismo.', { title: 'Los tenis de Carlos' }),
      sc(6, 'Por ciento es «de cada 100»: $\\tfrac14 = 0.25 = 25\\,\\%$ son 25 casillas de 100. El $100\\,\\%$ es el total y el $120\\,\\%$ es más que el total.', { title: '$\\tfrac14 = 0.25 = 25\\,\\%$' }),
      sc(6, 'Una fracción es una división: $\\tfrac38 = 0.375 = 37.5\\,\\%$. Algunas no terminan: $\\tfrac{1}{13} = 0.\\overline{076923}$.', { title: '$\\tfrac38 = 0.375$' }),
      sc(7, 'Un problema: la suma de las 2019 primeras cifras de $\\tfrac{1}{13}$. Bloques de 6 que suman 27: $2019 = 336 \\cdot 6 + 3$, y $336 \\cdot 27 + 0 + 7 + 6 = 9085$.', { title: 'El bloque que se repite' }),
      sc(6, 'Para comparar, todo a decimal: $\\tfrac25 = 0.40$, $0.38$ y $41\\,\\% = 0.41$. Ordenados: $0.38 < \\tfrac25 < 41\\,\\%$.', { title: 'Todo a decimal' }),
      sc(6, 'El $10\\,\\%$ corre el punto: de 80 000 es 8 000. El $15\\,\\%$ es $10\\,\\% + 5\\,\\%$: $8\\,000 + 4\\,000 = 12\\,000$.', { title: 'Pedazos fáciles' }),
      sc(7, 'Cada cambio es un factor: bajar $20\\,\\%$ es multiplicar por $0.8$ ($250\\,000 \\to 200\\,000$) y subir $20\\,\\%$, por $1.2$ ($250\\,000 \\to 300\\,000$).', { title: 'Subir y bajar es multiplicar' }),
      sc(7, 'Otro problema: Humberto $40\\,\\%$, Iván $25\\,\\%$ y Javier el resto, 70 g. El resto es $35\\,\\%$; si $35\\,\\%$ son 70 g, el $1\\,\\%$ son 2 g y la barra pesa 200 g.', { title: 'La barra de chocolate' }),
      sc(7, 'Los tenis: $120\\,000 \\cdot 0.9 = 108\\,000$ y $108\\,000 \\cdot 1.1 = 118\\,800$. Juntos, $0.9 \\cdot 1.1 = 0.99$: el $10\\,\\%$ que se quita y el que se pone se calculan sobre bases distintas.', { title: 'Pagó 118 800' }),
    ], [
      play('cuadricula-cien', 'Pinta en la cuadrícula lo que pide cada ronda', { rounds: [{ ask: '35 %', count: 35 }, { ask: '2/5', count: 40 }, { ask: '0.08', count: 8 }] },
        'Por ciento es «de cada 100»: cada casilla es el 1 %. $\\tfrac25 = \\tfrac{40}{100} = 40\\,\\%$ y $0.08 = \\tfrac{8}{100} = 8\\,\\%$.',
        { hint: 'La cuadrícula tiene 100 casillas. Pasa cada fracción o decimal a «de cada 100» antes de pintar.' }),
      play('candado-fraccion', 'Gira las ruedas hasta que la fracción abra el candado', { rounds: [
        { dec: '0.45', num: 9, den: 20 }, { dec: '0.625', num: 5, den: 8 }, { dec: '0.16', num: 4, den: 25 }, { dec: '1.25', num: 5, den: 4 },
      ] }, 'Un decimal que termina se escribe sobre 10, 100 o 1000 y se simplifica: $0.45 = \\tfrac{45}{100} = \\tfrac{9}{20}$, $0.625 = \\tfrac{625}{1000} = \\tfrac58$, $0.16 = \\tfrac{4}{25}$ y $1.25 = \\tfrac54$.',
        { hint: 'Cuenta las cifras después del punto: una es sobre 10, dos sobre 100, tres sobre 1000. Luego simplifica. El visor muestra el decimal de lo que armas.' }),
      play('pon-la-rayita', 'Pon la rayita sobre el bloque que se repite para siempre', { rounds: [{ num: 2, den: 3 }, { num: 5, den: 6 }, { num: 4, den: 11 }, { num: 7, den: 12 }] },
        'Algunas fracciones dan decimales que no terminan pero se repiten: $\\tfrac23 = 0.\\overline{6}$, $\\tfrac56 = 0.8\\overline{3}$, $\\tfrac{4}{11} = 0.\\overline{36}$ y $\\tfrac{7}{12} = 0.58\\overline{3}$. La rayita cubre solo lo que se repite.',
        { hint: 'Toca una cifra y mira su residuo: cuando un residuo vuelve a salir, las cifras se repiten desde ahí.' }),
      play('rueda-porcentaje', 'Gira la aguja hasta cubrir la parte pedida y lee el porcentaje', { rounds: [{ part: 18, whole: 24 }, { part: 21, whole: 60 }, { part: 9, whole: 45 }, { part: 33, whole: 150 }], tol: 1 },
        'Qué porcentaje es una parte del total: se divide y se pasa a «de cada 100». $\\tfrac{18}{24} = 75\\,\\%$, $\\tfrac{21}{60} = 35\\,\\%$, $\\tfrac{9}{45} = 20\\,\\%$ y $\\tfrac{33}{150} = 22\\,\\%$.',
        { hint: 'Compara la parte con el total: ¿es la mitad, un cuarto, un quinto? Mientras giras, mira la parte cubierta.' }),
      play('pinta-personas', 'Pinta a las personas que pide cada ronda', { rounds: [
        { total: 20, pct: 45, what: 'llegan en bus' }, { total: 50, pct: 30, what: 'usan gafas' }, { total: 16, pct: 75, what: 'aprobaron' }, { total: 40, pct: 2.5, what: 'son gemelos' },
      ] }, 'El porcentaje de un grupo: $45\\,\\%$ de 20 son 9, $30\\,\\%$ de 50 son 15, $75\\,\\%$ de 16 son 12 y $2.5\\,\\%$ de 40 es 1. Sirve pasar por el $10\\,\\%$: de 50 es 5, así que el $30\\,\\%$ es 15.',
        { hint: 'Halla primero el 10 % del grupo (corre el punto un lugar) o el 50 % (la mitad), y arma el porcentaje con esos pedazos.' }),
      play('estira-barra', 'Estira o encoge la barra hasta lo que pide cada ronda', { max: 200, rounds: [
        { base: 80, text: 'El 25 % más de 80', pct: 125 }, { base: 600, text: 'El 30 % menos de 600', pct: 70 }, { base: 150, text: 'El doble de 150', pct: 200 }, { base: 40, text: 'Lo que queda de 40 si se le quita el 15 %', pct: 85 },
      ] }, 'Aumentar un $25\\,\\%$ deja el $125\\,\\%$: $80 \\cdot 1.25 = 100$. Quitar un $30\\,\\%$ deja el $70\\,\\%$: $600 \\cdot 0.7 = 420$. El doble es el $200\\,\\%$, y quitar el $15\\,\\%$ deja el $85\\,\\%$.',
        { hint: 'El total de antes es el 100 %. Si crece, la barra pasa de 100 %; si se le quita, queda por debajo.' }),
      play('etiqueta-rebaja', 'Pega en cada etiqueta el sticker del precio final', {
        items: [{ name: 'Morral', price: 60000, change: -25 }, { name: 'Libro', price: 40000, change: -10 }, { name: 'Balón', price: 50000, change: 20 }],
        stickers: [45000, 15000, 36000, 4000, 60000, 40000],
      }, 'El precio final es el de lista por el factor: $60\\,000 \\cdot 0.75 = 45\\,000$ (15 000 es solo el descuento), $40\\,000 \\cdot 0.9 = 36\\,000$ y, como el balón **sube** $20\\,\\%$, $50\\,000 \\cdot 1.2 = 60\\,000$.',
        { hint: 'Cuidado: algunos stickers son solo el descuento, no el precio final. Y no todo baja: mira el signo del cambio.' }),
      play('vuela-precios', 'Alinea el planeador con el resultado y suelta para volar', { rounds: [
        { title: 'Porcentaje de una cantidad', items: [{ ask: '10 % de 350', options: ['35', '3.5', '340'], answer: 0 }, { ask: '50 % de 90', options: ['45', '40', '180'], answer: 0 }, { ask: '25 % de 120', options: ['30', '25', '95'], answer: 0 }, { ask: '20 % de 45', options: ['9', '20', '25'], answer: 0 }] },
        { title: 'De fracción a porcentaje', items: [{ ask: '3/4', options: ['75 %', '34 %', '43 %'], answer: 0 }, { ask: '3/5', options: ['60 %', '35 %', '53 %'], answer: 0 }, { ask: '1/8', options: ['12.5 %', '18 %', '8 %'], answer: 0 }, { ask: '7/10', options: ['70 %', '7 %', '17 %'], answer: 0 }] },
      ] }, 'El $10\\,\\%$ corre el punto un lugar; el $50\\,\\%$ es la mitad; el $25\\,\\%$, la cuarta parte; y el $20\\,\\%$, la quinta. Y cada fracción tiene su porcentaje: $\\tfrac34 = 75\\,\\%$, $\\tfrac35 = 60\\,\\%$, $\\tfrac18 = 12.5\\,\\%$.',
        { hint: 'Piensa cada porcentaje como una fracción sencilla del número: la mitad, la cuarta parte, la décima parte.' }),
    ]),
    PU_L('pu-cm-4', 'Potencias, raíces y estimación', [
      sc(6, 'Un problema para empezar: María escribe la suma de las cifras de $10^n - 51$. Para $10^5 - 51 = 99\\,949$ escribe 40; falta saber qué escribe para $10^{10} - 51$.', { title: 'Las cuentas de María' }),
      sc(6, 'Una potencia es multiplicar repetido: $5^3 = 5 \\cdot 5 \\cdot 5 = 125$ cubitos, cinco capas de 25. No es $5 \\cdot 3$.', { title: '$5^3 = 125$' }),
      sc(6, '$10^n$ es un 1 con $n$ ceros, y $10^n - 1$ son $n$ nueves. Por eso $10\\,000 - 37 = 9\\,999 - 36 = 9\\,963$.', { title: 'Las potencias de 10' }),
      sc(7, 'Al cuadrado es un área: $13^2 = 100 + 30 + 30 + 9 = 169$. Si el lado crece $20\\,\\%$, el área se multiplica por $1.2^2 = 1.44$: crece $44\\,\\%$ (pasa igual con un círculo).', { title: 'Al cuadrado' }),
      sc(6, 'Las leyes salen de contar: $2^3 \\cdot 2^4 = 2^7$ (siete doses) y $(2^3)^2 = 2^6$ (dos grupos de tres doses).', { title: 'Contar factores' }),
      sc(7, 'Otro problema: cartas 1, 2, 4, 8, 16 y 32; Ana suma 7 más que Eliza. El total es 63, así que Ana tiene 35 = 32 + 2 + 1: tres cartas.', { title: 'Las cartas' }),
      sc(7, 'Otro problema: el residuo de $2^{2019}$ entre 7. Los residuos dan vueltas: 2, 4, 1, 2, 4, 1… Como $2019 = 3 \\cdot 673$, el residuo es 1.', { title: 'Las potencias dan vueltas' }),
      sc(7, '$\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt2 \\approx 8.5$, entre 8 y 9 porque $64 < 72 < 81$. Y $49.7 \\cdot 20.3 \\approx 50 \\cdot 20 = 1\\,000$.', { title: 'Raíces y estimación' }),
      sc(7, '$10^{10} - 51 = 9\\,999\\,999\\,949$: ocho nueves, un 4 y un 9. La suma es $72 + 4 + 9 = 85$, la opción C.', { title: 'María escribirá 85' }),
    ], [
      play('arbol-potencia', 'Haz crecer el árbol: elige cuántas **ramas** salen de cada nudo y cuántos **niveles** tiene', { rounds: [{ target: 27 }, { target: 16 }, { target: 81 }] },
        'Con $b$ ramas por nudo y $n$ niveles hay $b^n$ hojas: $27 = 3^3$, $81 = 3^4 = 9^2$ y $16 = 2^4 = 4^2$. La base es lo que se repite; el exponente, cuántas veces.',
        { hint: 'Prueba con pocas ramas y ve subiendo niveles: mira cómo cambia el número de hojas. Si te pasas, cambia las ramas.' }),
      play('torre-pisos', 'Reparte los paquetes: cada número vive en el **piso** de su exponente', { rounds: [
        { title: 'Torre del 3', base: 3, lo: -2, hi: 4, items: [{ exp: 3 }, { exp: 0 }, { exp: -1 }] },
        { title: 'Torre del 2', base: 2, lo: -3, hi: 6, items: [{ exp: 6 }, { exp: -3 }, { exp: 5 }] },
        { title: 'Torre del 10', base: 10, lo: -2, hi: 4, items: [{ exp: 4 }, { exp: -2 }, { exp: 1 }] },
      ] }, 'El piso es el exponente. En la planta baja vive el $1$, porque $a^0 = 1$. Subir un piso multiplica por la base y bajar uno divide: $3^{-1} = \\tfrac13$, $2^{-3} = \\tfrac18$, $10^{-2} = 0.01$.',
        { hint: 'Desde la planta baja, que vale 1, sube multiplicando por la base o baja dividiendo, piso por piso.' }),
      play('cuenta-factores', 'Las leyes salen de **contar**: mira las x y escribe el exponente del resultado', { rounds: [{ kind: 'prod', m: 4, n: 3 }, { kind: 'quot', m: 6, n: 2 }, { kind: 'pow', m: 3, n: 2 }, { kind: 'quot', m: 3, n: 5 }] },
        'Al multiplicar se juntan los factores: $x^4 \\cdot x^3 = x^7$. Al dividir se cancelan: $x^6 \\div x^2 = x^4$, y si sobran abajo queda negativo: $x^3 \\div x^5 = x^{-2}$. Una potencia de potencia repite el grupo: $(x^3)^2 = x^6$.',
        { hint: 'No uses fórmulas: cuenta las x del dibujo. Mira si se juntan, si se tachan por parejas o si un grupo se repite.' }),
      play('lado-del-cuadrado', 'Estira el cuadrado hasta que su área sea la pedida: su lado es la raíz cuadrada', { rounds: [{ area: 49 }, { area: 6.25 }, { area: 20 }], max: 10, step: 0.05, tol: 0.05 },
        'La raíz cuadrada es el lado del cuadrado con esa área: $\\sqrt{49} = 7$, $\\sqrt{6.25} = 2.5$ y $\\sqrt{20} \\approx 4.47$, que está entre $4$ y $5$ porque $16 < 20 < 25$.',
        { hint: 'Busca un número que multiplicado por sí mismo dé el área. Si no es exacto, piensa entre qué dos cuadrados conocidos está.' }),
      play('compas-raiz', 'Elige los lados del rectángulo para que el compás caiga en la banderita', { rounds: [{ n: 10 }, { n: 2 }, { n: 20 }, { n: 18 }], max: 4 },
        'La diagonal de un rectángulo de lados $a$ y $b$ mide $\\sqrt{a^2 + b^2}$: $1^2 + 3^2 = 10$, $1^2 + 1^2 = 2$, $2^2 + 4^2 = 20$ y $3^2 + 3^2 = 18$. Así se ubica una raíz exacta en la recta.',
        { hint: 'Busca dos cuadrados (1, 4, 9, 16) que sumen el número de adentro de la raíz.' }),
      play('acorrala-raiz', 'Acorrala la raíz: cada vez en un tramo más pequeño', { rounds: [{ n: 7 }, { n: 30 }], levels: 3 },
        'Estimar es acorralar: $2.6^2 = 6.76 < 7 < 7.29 = 2.7^2$, así que $\\sqrt7$ está entre $2.6$ y $2.7$. Y $5.4^2 = 29.16 < 30 < 30.25 = 5.5^2$: $\\sqrt{30} \\approx 5.48$.',
        { hint: 'Eleva al cuadrado los extremos de cada tramo y quédate con el tramo que deja el número de adentro en medio.' }),
      play('siembra-raices', 'Elige en la recta los números que cumplen y **siembra** para comprobarlo', { rounds: [
        { title: 'Cuadrados', items: [{ kind: 'eq', n: 2, a: 25 }, { kind: 'root', n: 2, a: 25 }, { kind: 'eq', n: 2, a: -16 }] },
        { title: 'Cubos', items: [{ kind: 'eq', n: 3, a: -27 }, { kind: 'root', n: 3, a: 8 }, { kind: 'root', n: 3, a: -125 }] },
      ] }, 'Si $x^2 = 25$ hay dos números, $5$ y $-5$; pero $\\sqrt{25}$ es uno solo, el positivo. Ningún número al cuadrado da negativo. Con cubos siempre hay exactamente una respuesta: $\\sqrt[3]{-27} = -3$.',
        { hint: 'Prueba sembrando: un negativo por sí mismo da positivo, pero tres veces por sí mismo da negativo.' }),
      play('serpiente-orden', 'Guía a la serpiente para que se coma los números de menor a mayor', { rounds: [
        { title: 'Potencias', items: [{ label: '2⁵', value: 32 }, { label: '5²', value: 25 }, { label: '3³', value: 27 }, { label: '10²', value: 100 }, { label: '4³', value: 64 }] },
        { title: 'Raíces y estimaciones', items: [{ label: '√50', value: Math.sqrt(50) }, { label: '2³', value: 8 }, { label: '√36', value: 6 }, { label: '7.5', value: 7.5 }, { label: '√80', value: Math.sqrt(80) }] },
      ] }, 'Se estima antes de ordenar: $5^2 = 25 < 3^3 = 27 < 2^5 = 32 < 4^3 = 64 < 10^2$. Y $\\sqrt{50}$ pasa un poco de 7 porque $7^2 = 49$, mientras que $\\sqrt{80}$ casi llega a 9: $6 < \\sqrt{50} < 7.5 < 8 < \\sqrt{80}$.',
        { hint: 'Calcula o estima cada número antes de moverte: para una raíz, piensa entre qué dos cuadrados conocidos está.' }),
    ]),
  ] },

  // ---------------- 2 · Geometría ----------------
  { world: 'pu-geometria', title: 'Geometría', block: 'razonamiento', lessons: [
    PU_L('pu-ge-1', 'Ángulos y paralelas', [
      sc(6, 'Dos ángulos **complementarios** suman 90°; **suplementarios**, 180°. Los **opuestos por el vértice** son iguales.', { title: 'Complementos y suplementos' }),
      sc(7, 'Dos paralelas cortadas por una transversal: los alternos internos son iguales, los correspondientes son iguales y los conjugados suman 180°.', { title: 'Paralelas y transversal' }),
      sc(7, 'Los ángulos internos de un polígono de $n$ lados suman $(n - 2) \\cdot 180°$. Un hexágono suma 720°, y si es regular cada ángulo mide 120°.', { title: '$(n-2) \\cdot 180°$' }),
    ], [
      play('rueda-angulo', 'Gira el lado hasta el ángulo de cada ronda', { snap: 15, rounds: [
        { target: 90, label: '90°', tex: '90^\\circ' }, { target: 135, label: '135°', tex: '135^\\circ' }, { target: 180, label: '180°', tex: '180^\\circ' }, { target: 60, label: '60°', tex: '60^\\circ' },
      ] }, 'Un ángulo mide cuánto se gira: un cuarto de vuelta son $90^\\circ$ (recto), media vuelta son $180^\\circ$ (llano). Menos de $90^\\circ$ es agudo, como $60^\\circ$; entre $90^\\circ$ y $180^\\circ$ es obtuso, como $135^\\circ$.',
        { hint: 'Piensa en fracciones de vuelta: un cuarto de vuelta es un ángulo recto. Compara el ángulo pedido con ese.' }),
      play('tijera-angulos', 'Dos rectas que se cruzan: deduce el ángulo que no se muestra', { rounds: [
        { kind: 'opp', given: 65 }, { kind: 'sup', given: 50 }, { kind: 'comp', given: 35 }, { kind: 'ratio', k: 2 }, { kind: 'sup', given: 105 },
      ] }, 'Los opuestos por el vértice son iguales. Los vecinos forman media vuelta: suman $180^\\circ$ (suplementarios), así que el vecino de $50^\\circ$ mide $130^\\circ$. Los complementarios suman $90^\\circ$: el de $35^\\circ$ es $55^\\circ$. Y si el vecino es el doble, $x + 2x = 180^\\circ$: $x = 60^\\circ$.',
        { hint: 'El ángulo azul y su vecino llenan media vuelta entre los dos. El azul y el que queda hasta la vertical llenan un cuarto de vuelta.' }),
      play('paralelas-gira', 'Usa los ángulos para dejar las dos rectas paralelas', { rounds: [
        { t: 65, top: 0, pair: 'corr' }, { t: 70, top: 10, pair: 'alt' }, { t: 60, top: -15, pair: 'corr' }, { t: 75, top: 5, pair: 'conj' },
      ] }, 'Cuando una transversal corta dos paralelas, los ángulos correspondientes son iguales, los alternos internos son iguales y los conjugados suman $180^\\circ$. Si eso no se cumple, las rectas se terminan cruzando.',
        { hint: 'Mira los dos ángulos marcados mientras giras: según el par de la ronda, deben quedar iguales o sumar media vuelta.' }),
      play('apice-triangulo', 'Mueve el vértice: los tres ángulos suman siempre lo mismo', { rounds: [
        { mode: 'falta', A: 50, C: 70 }, { mode: 'falta', A: 35, C: 90 }, { mode: 'falta', A: 60, C: 75 }, { mode: 'falta', A: 25, C: 120 },
      ] }, 'Los ángulos internos de un triángulo suman $180^\\circ$. Con $A = 50^\\circ$ y $C = 70^\\circ$ queda $B = 180^\\circ - 120^\\circ = 60^\\circ$; con $35^\\circ$ y $90^\\circ$, $B = 55^\\circ$; con $60^\\circ$ y $75^\\circ$, $B = 45^\\circ$; y con $25^\\circ$ y $120^\\circ$, $B = 35^\\circ$.',
        { hint: 'El ángulo de arriba no se muestra: calcula cuánto debe medir el ángulo B para que entre los tres completen media vuelta.' }),
      play('suma-poligono', 'Parte cada polígono en triángulos para saber cuánto suman sus ángulos', { rounds: [{ n: 4 }, { n: 5 }, { n: 7 }, { n: 8 }] },
        'Desde un vértice, un polígono de $n$ lados se parte en $n - 2$ triángulos, y cada uno aporta $180^\\circ$: la suma es $(n - 2) \\cdot 180^\\circ$. Un cuadrilátero suma $360^\\circ$; un pentágono, $540^\\circ$; un heptágono, $900^\\circ$; un octágono, $1\\,080^\\circ$, y si es regular cada ángulo mide $135^\\circ$.',
        { hint: 'Traza todas las diagonales que salen del punto y cuenta los triángulos que quedan: compáralos con el número de lados.' }),
      play('rieles-paralelos', 'Gira el riel nuevo desde la estación', { rounds: [
        { base: { m: 1 / 2, b: 0 }, baseTxt: 'y = x/2', through: [1, 3], mode: 'par' }, { base: { m: 2, b: -1 }, baseTxt: 'y = 2x − 1', through: [0, 2], mode: 'perp' },
        { base: { m: 0, b: 2 }, baseTxt: 'y = 2', through: [3, -1], mode: 'perp' }, { base: { m: -1, b: 1 }, baseTxt: 'y = −x + 1', through: [-2, 0], mode: 'par' },
      ] }, 'En el plano, dos rectas paralelas tienen la misma inclinación (pendiente). Una perpendicular forma $90^\\circ$: su pendiente es la recíproca con el signo cambiado ($-1/m$), y la perpendicular a una horizontal es vertical.',
        { hint: 'Paralelo: la misma inclinación que la vía. Perpendicular: que forme un ángulo recto con ella; fíjate en el cuadrito del cruce.' }),
      play('billar-rebote', 'Billar de un rebote: mete la bola en la tronera', { rounds: [
        { title: 'Misma altura', items: [{ p: [1, 2], t: [9, 2] }, { p: [1, 3], t: [7, 3] }, { p: [8, 1], t: [2, 1] }] },
        { title: 'Alturas distintas', items: [{ p: [2, 4], t: [8, 2] }, { p: [1, 1], t: [9, 3] }, { p: [9, 2], t: [3, 4] }] },
      ] }, 'La bola rebota con el mismo ángulo con que llega. Si la bola y la tronera están a la misma altura, el rebote va justo en la mitad. Si no, sirve imaginar la tronera reflejada al otro lado de la banda y apuntar derecho hacia ella.',
        { hint: 'Los dos ángulos con la banda tienen que ser iguales. Si la bola y la tronera están a la misma altura, piensa dónde queda el punto medio.' }),
    ]),
    PU_L('pu-ge-2', 'Triángulos y Pitágoras', [
      sc(6, 'En un triángulo **rectángulo**, el cuadrado construido sobre el lado largo ocupa lo mismo que los dos cuadrados de los otros lados juntos.', { title: '$c^2 = a^2 + b^2$' }),
      sc(6, 'Hay ternas que conviene reconocer: 3-4-5, 5-12-13, 8-15-17 y sus múltiplos. Una escalera de 13 m a 5 m de la pared llega a 12 m de altura.', { title: 'Ternas pitagóricas' }),
      sc(7, 'Dos triángulos especiales: el de 45-45-90 tiene lados $x, x, x\\sqrt2$; el de 30-60-90, lados $x, x\\sqrt3, 2x$.', { title: '45-45-90 y 30-60-90' }),
    ], [
      play('apice-triangulo', 'Arma el triángulo del tipo que pide cada ronda', { rounds: [
        { mode: 'tipo', tipo: 'isosceles', A: 40 }, { mode: 'tipo', tipo: 'rectangulo', A: 30 }, { mode: 'tipo', tipo: 'equilatero', A: 60 }, { mode: 'tipo', tipo: 'rectangulo', y: 'isosceles', A: 45 },
      ] }, 'Por sus lados: equilátero (tres iguales, ángulos de $60^\\circ$), isósceles (dos iguales, y dos ángulos iguales) o escaleno. Por sus ángulos: rectángulo (uno de $90^\\circ$), acutángulo u obtusángulo. El rectángulo isósceles tiene ángulos de $45^\\circ$, $45^\\circ$ y $90^\\circ$.',
        { hint: 'A lados iguales les corresponden ángulos iguales: fíjate en las rayitas que aparecen. Para un rectángulo, busca que algún ángulo sea de 90°.' }),
      play('cuadrados-pitagoras', 'Mueve los catetos hasta que la hipotenusa mida lo pedido', { max: 12, rounds: [{ c2: 25 }, { c2: 100 }, { c2: 225 }, { c2: 20 }] },
        'En un triángulo rectángulo, el cuadrado de la hipotenusa es la suma de los cuadrados de los catetos: $3^2 + 4^2 = 25 = 5^2$, $6^2 + 8^2 = 100 = 10^2$ y $9^2 + 12^2 = 225 = 15^2$. Son ternas pitagóricas. Y $2^2 + 4^2 = 20$: la hipotenusa mide $\\sqrt{20}$, que no es entera.',
        { hint: 'Busca dos cuadrados (1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144) que sumen las casillas pedidas.' }),
      play('escalera-pared', 'Apoya la escalera justo en la ventana', { rounds: [{ L: 5, h: 4 }, { L: 10, h: 6 }, { L: 17, h: 8 }, { L: 15, h: 9 }] },
        'La escalera, la pared y el piso forman un triángulo rectángulo: $\\text{pie}^2 + \\text{altura}^2 = \\text{largo}^2$. Con largo $5$ y altura $4$, el pie queda a $3$. Las demás son múltiplos o ternas conocidas: $8$-$6$-$10$, $15$-$8$-$17$ y $12$-$9$-$15$.',
        { hint: 'El largo de la escalera es la hipotenusa. Mira si la altura y el largo son múltiplos de una terna que conozcas, como 3-4-5.' }),
      play('compas-raiz', 'Elige los lados del rectángulo para que el compás caiga en la banderita', { rounds: [{ n: 5 }, { n: 13 }, { n: 25 }, { n: 32 }], max: 4 },
        'La diagonal de un rectángulo es la hipotenusa de sus dos lados: $1^2 + 2^2 = 5$, $2^2 + 3^2 = 13$, $3^2 + 4^2 = 25$ (diagonal exacta de $5$) y $4^2 + 4^2 = 32$, la diagonal de un cuadrado de lado $4$: $4\\sqrt2$.',
        { hint: 'La diagonal al cuadrado es la suma de los cuadrados de los dos lados: busca dos cuadrados que sumen el número de la raíz.' }),
      play('cuerdas-iguales', 'Desliza el anillo por el riel hasta que las **dos cuerdas midan lo mismo**', { rounds: [{ A: [1, 2], B: [5, 4], rail: 'x' }, { A: [-3, 1], B: [3, 3], rail: 'y' }, { A: [2, -2], B: [4, 4], rail: 'x' }] },
        'Cada cuerda es la hipotenusa de un triángulo que se arma con su avance horizontal y su subida. El punto que queda a la misma distancia de $A$ y de $B$ hace iguales las dos hipotenusas.',
        { hint: 'Mira cómo cambia el largo de cada cuerda al mover el anillo: una crece mientras la otra se acorta. Busca dónde se igualan.' }),
      play('acorrala-raiz', 'La diagonal no siempre es entera: acorrala su valor', { rounds: [{ n: 2 }, { n: 20 }], levels: 3 },
        'La diagonal de un cuadrado de lado $1$ mide $\\sqrt2 \\approx 1.414$: por eso en un triángulo de $45^\\circ$-$45^\\circ$-$90^\\circ$ los lados son $x$, $x$ y $x\\sqrt2$. Y $\\sqrt{20} \\approx 4.47$ está entre $4$ y $5$.',
        { hint: 'Eleva al cuadrado los extremos de cada tramo y quédate con el tramo que deja el número de adentro en medio.' }),
      play('vuela-precios', 'Alinea el planeador con la longitud que falta y suelta para volar', { rounds: [
        { title: 'Halla la hipotenusa', items: [{ ask: 'catetos 9 y 12', options: ['15', '21', '108'], answer: 0 }, { ask: 'catetos 8 y 15', options: ['17', '23', '120'], answer: 0 }, { ask: 'catetos 7 y 24', options: ['25', '31', '17'], answer: 0 }] },
        { title: 'Halla el cateto', items: [{ ask: 'hipotenusa 20, cateto 16', options: ['12', '4', '36'], answer: 0 }, { ask: 'hipotenusa 26, cateto 10', options: ['24', '16', '36'], answer: 0 }, { ask: 'hipotenusa 25, cateto 15', options: ['20', '10', '40'], answer: 0 }] },
      ] }, 'Son ternas y sus múltiplos: $9$-$12$-$15$ y $12$-$16$-$20$ y $15$-$20$-$25$ vienen de $3$-$4$-$5$; $10$-$24$-$26$, de $5$-$12$-$13$; y $8$-$15$-$17$ y $7$-$24$-$25$ son ternas propias. Sumar los catetos nunca da la hipotenusa.',
        { hint: 'Antes de elevar al cuadrado, mira si los números son múltiplos de una terna conocida: 3-4-5 o 5-12-13.' }),
    ]),
    PU_L('pu-ge-3', 'Semejanza y escala', [
      sc(6, 'Dos figuras son **semejantes** si tienen la misma forma: sus lados son proporcionales (teorema de Tales).', { title: 'Misma forma, otro tamaño' }),
      sc(7, 'Si las longitudes se multiplican por $k$, las áreas se multiplican por $k^2$ y los volúmenes por $k^3$. Duplicar el lado de un cuadrado de 9 cm² da 36 cm², no 18.', { title: '$k,\\ k^2,\\ k^3$' }),
      sc(6, 'Las sombras al mismo tiempo forman triángulos semejantes: la razón altura/sombra es la misma para un poste y para una persona.', { title: 'Sombras proporcionales' }),
    ], [
      PU_ES('Un cubo de 3 cm de arista pesa 54 g. ¿Cuánto pesa uno igual de 6 cm?', [['k = 2', 'k = 3'], ['el volumen se multiplica por 8', 'el volumen se multiplica por 2', 'el volumen se multiplica por 4'], ['432 g', '108 g', '216 g']],
        'La arista se duplica ($k = 2$), el volumen se multiplica por $2^3 = 8$ y el peso también: $54 \\cdot 8 = 432$ g.',
        'El peso depende del volumen, no de la arista. Piensa cuántos cubos pequeños caben en el grande.'),
      PU_CTA('Un edificio da una sombra de 24 m cuando una persona de 1.8 m da una sombra de 1.2 m. Plantea la altura del edificio', { sol: ['24', '*', '1.8', '/', '1.2'], traps: ['3'], answer: 36, unit: 'm' },
        'Altura y sombra van en la misma razón: $\\tfrac{h}{24} = \\tfrac{1.8}{1.2}$, así $h = 24 \\cdot 1.8 \\div 1.2 = 36$ m.',
        'La razón entre altura y sombra es la misma para la persona y para el edificio.'),
    ]),
    PU_L('pu-ge-4', 'Perímetros, áreas y círculos', [
      sc(7, 'Áreas que hay que tener a mano: rectángulo y paralelogramo $b \\cdot h$, triángulo $\\tfrac{b h}{2}$, trapecio $\\tfrac{(B + b) h}{2}$, rombo $\\tfrac{D d}{2}$ y círculo $\\pi r^2$.', { title: 'Áreas básicas' }),
      sc(6, 'La longitud de la circunferencia es $2\\pi r$. Un error frecuente: usar el diámetro donde va el radio.', { title: '$L = 2\\pi r$' }),
      sc(7, 'Un sector es una fracción del círculo: con 90° es un cuarto. Si $r = 4$, el sector de 90° tiene área $\\tfrac{16\\pi}{4} = 4\\pi$ y arco $\\tfrac{8\\pi}{4} = 2\\pi$.', { title: 'Sector: $\\tfrac{\\theta}{360°}$ del círculo' }),
    ], [
      PU_CTA('Un trapecio tiene bases de 14 y 8 cm y altura de 5 cm. Plantea su área', { sol: ['(', '14', '+', '8', ')', '*', '5', '/', '2'], traps: ['22'], answer: 55, unit: 'cm²' },
        '$\\tfrac{(14 + 8) \\cdot 5}{2} = \\tfrac{110}{2} = 55$ cm².',
        'El trapecio es como un rectángulo cuya base es el promedio de las dos bases.'),
      PU_ES('Un sector de 60° en un círculo de 12 cm de diámetro: halla su área', [['r = 6', 'r = 12'], ['círculo: 36π', 'círculo: 144π'], ['60/360 = 1/6', '60/360 = 1/3'], ['área: 6π cm²', 'área: 12π cm²']],
        'El radio es la mitad del diámetro: 6. El círculo tiene $36\\pi$ y el sector es la sexta parte: $6\\pi$ cm².',
        'Antes de usar la fórmula, revisa si el dato es el radio o el diámetro.'),
    ]),
    PU_L('pu-ge-5', 'Áreas sombreadas y cuadrícula', [
      sc(6, 'Un área sombreada casi siempre es **una figura grande menos lo que se le quita**, o la suma de piezas conocidas.', { title: 'Sumar y restar figuras' }),
      sc(7, 'Un cuadrado de lado 10 con un círculo inscrito: la zona fuera del círculo mide $100 - 25\\pi \\approx 21.5$.', { title: '$100 - 25\\pi$' }),
      sc(7, 'En una cuadrícula se cuentan cuadros o se usa la fórmula con la base y la altura que se leen en los ejes: el triángulo de vértices (1, 1), (5, 1) y (3, 4) tiene base 4, altura 3 y área 6.', { title: 'Figuras en la cuadrícula' }),
    ], [
      PU_ES('Un cuadrado de lado 8 tiene en cada esquina un cuarto de círculo de radio 4. Halla el área que queda sin cubrir', [['cuadrado: 64', 'cuadrado: 32'], ['4 cuartos = 1 círculo', '4 cuartos = 4 círculos'], ['círculo: 16π', 'círculo: 64π'], ['64 − 16π ≈ 13.7', '64 − 64π']],
        'Los cuatro cuartos forman un círculo de radio 4, de área $16\\pi$. Queda $64 - 16\\pi \\approx 13.7$.',
        'Junta mentalmente las cuatro piezas curvas: ¿qué figura completa forman?'),
      PU_CTA('En una cuadrícula, un triángulo tiene vértices en (0, 0), (6, 0) y (2, 5). Plantea su área', { sol: ['6', '*', '5', '/', '2'], traps: ['2'], answer: 15 },
        'La base está sobre el eje: mide 6. La altura es la distancia del tercer vértice al eje: 5. Área $\\tfrac{6 \\cdot 5}{2} = 15$.',
        'Usa como base el lado que está sobre un eje; la altura es qué tan lejos está el otro vértice de ese eje.'),
    ]),
    PU_L('pu-ge-6', 'Volúmenes y superficies', [
      sc(6, 'Prismas y cilindros: **área de la base por la altura**. Un cilindro de radio 3 y altura 10 tiene $90\\pi$.', { title: '$V = A_b \\cdot h$' }),
      sc(6, 'Pirámides y conos llenan **un tercio** del prisma o cilindro con la misma base y altura: ese cono tendría $30\\pi$. La esfera: $\\tfrac43 \\pi r^3$.', { title: 'Un tercio' }),
      sc(6, 'La superficie es la suma de las caras: un cubo de arista $a$ tiene $6a^2$.', { title: 'Área superficial' }),
    ], [
      PU_CTA('Un tanque cilíndrico tiene radio de 2 m y altura de 5 m. Plantea su volumen', { sol: ['π', '*', '2', '^', '2', '*', '5'], traps: ['10', '4'], answer: 20 * Math.PI, unit: 'm³' },
        'Base $\\pi \\cdot 2^2 = 4\\pi$ por altura 5: $20\\pi \\approx 62.8$ m³.',
        'Calcula el área del círculo de la base y multiplícala por la altura.'),
      PU_ES('Halla el área de la superficie de una caja de 4 × 3 × 2 cm', [['caras: 4·3, 4·2 y 3·2', 'caras: 4·3·2'], ['12 + 8 + 6 = 26', '12 · 8 · 6'], ['2 · 26 = 52 cm²', '26 cm²', '24 cm²']],
        'Hay tres pares de caras iguales: $12 + 8 + 6 = 26$, y cada una aparece dos veces: $52$ cm².',
        'Una caja tiene seis caras que vienen en parejas iguales: tapa y fondo, frente y espalda, dos lados.'),
    ]),
  ] },

  // ---------------- 3 · Acertijos de orden ----------------
  { world: 'pu-orden', title: 'Acertijos de orden y asignación', block: 'razonamiento', lessons: [
    PU_L('pu-or-1', 'Orden en línea', [
      sc(6, 'Con pistas de orden, lo primero es **dibujar**: una fila de casillas numeradas. Se ponen primero las pistas más firmes.', { title: 'Dibuja la fila' }),
      sc(8, 'Ana, Beto, Caro y Dani en fila. Caro es la primera; Beto va justo detrás de Ana; Dani no es el último. Si Ana y Beto fueran 2 y 3, Dani quedaría de último: no puede. Entonces van 3 y 4, y Dani es el 2.', { title: 'Caro, Dani, Ana, Beto' }),
      sc(6, 'Cuando una pista deja dos posibilidades, se prueba cada una hasta que una choque con otra pista.', { title: 'Probar y descartar' }),
    ], [
      PU_ES('Cinco carros en fila (1 a 5): el rojo está en 3; el azul está justo a la izquierda del verde; el negro no está en un extremo; el blanco está a la derecha del rojo', [['azul y verde en 1 y 2', 'azul y verde en 4 y 5'], ['negro en 4', 'negro en 5'], ['blanco en 5', 'blanco en 4']],
        'Si azul y verde fueran 4 y 5, el blanco no tendría sitio a la derecha del rojo. Van en 1 y 2; el negro solo cabe en 4 y el blanco en 5.',
        'Busca dónde caben dos carros pegados sin chocar con las demás pistas.'),
      PU_ES('Cuatro amigos viven en los pisos 1 a 4: Luis vive más arriba que Marta, Nora justo encima de Luis y Óscar más arriba que Nora', [['Óscar en el piso 4', 'Nora en el piso 4'], ['Nora en 3 y Luis en 2', 'Nora en 2 y Luis en 1'], ['Marta en el piso 1', 'Marta en el piso 3']],
        'Óscar tiene que estar por encima de Nora, que está encima de Luis, que está encima de Marta: 4, 3, 2 y 1.',
        'Encadena las pistas «más arriba que»: forman una sola escalera.'),
    ]),
    PU_L('pu-or-2', 'Orden circular', [
      sc(6, 'En una mesa redonda, girar a todos no cambia nada: se **fija** a una persona y el resto se ubica respecto a ella.', { title: 'Fija a uno' }),
      sc(6, 'En una mesa de seis, «frente a» son puestos opuestos: con uno fijo en el puesto 1, el de enfrente está en el 4.', { title: 'Frente a frente' }),
      sc(7, 'Ejemplo: cuatro amigos, Ana frente a Beto y Ciro a un lado de Ana. Entonces Dora queda frente a Ciro, el otro puesto libre junto a Ana.', { title: 'Ubicar paso a paso' }),
    ], [
      PU_ES('Ana, Beto, Carla, Dora, Eva y Felipe en una mesa redonda: Ana frente a Beto, Carla junto a Ana, Dora frente a Carla y Eva no está junto a Beto. ¿Quién queda frente a Eva?', [['Beto queda frente a Ana', 'Beto queda junto a Ana'], ['Dora queda junto a Beto', 'Dora queda junto a Ana'], ['Eva entre Dora y Ana', 'Eva junto a Beto'], ['Felipe frente a Eva', 'Carla frente a Eva']],
        'Con Ana fija y Beto enfrente, Carla va a un lado de Ana y Dora enfrente de Carla, junto a Beto. Quedan dos puestos: el que toca a Beto es de Felipe y Eva va entre Dora y Ana, frente a Felipe.',
        'Fija a Ana y ubica a quien tiene la pista de «frente a» con ella. Luego llena los puestos que quedan.'),
      PU_ES('Cinco personas en una mesa redonda: Q está junto a P y a R, T está junto a P, y S no está junto a P', [['P entre Q y T', 'P entre Q y S'], ['R al otro lado de Q', 'R junto a T'], ['S entre R y T', 'S entre P y R']],
        'P tiene dos vecinos: Q y T. Q tiene a P y a R. El único puesto libre, entre R y T, es de S, que así no toca a P.',
        'Cada persona tiene exactamente dos vecinos. Empieza por quien tiene más pistas.'),
    ]),
    PU_L('pu-or-3', 'Tablas de doble entrada', [
      sc(6, 'Cuando hay que emparejar personas con cosas, se arma una **tabla**: personas en las filas, opciones en las columnas.', { title: 'La tabla de doble entrada' }),
      sc(6, 'Cada pista pone una ✗. Cada fila y cada columna tiene un solo ✓: si en una fila queda un único hueco, ese es el ✓, y su columna se tacha.', { title: 'Un solo ✓ por fila y columna' }),
      sc(6, 'Las pistas negativas («no tiene…») son las más útiles: van tachando hasta dejar una sola posibilidad.', { title: 'Tachar hasta que quede una' }),
    ], [
      PU_ES('Lina, Mía y Sara estudian Medicina, Derecho e Ingeniería. Lina no estudia Medicina ni Derecho; Mía no estudia Medicina', [['Lina: Ingeniería', 'Lina: Derecho'], ['Mía: Derecho', 'Mía: Medicina'], ['Sara: Medicina', 'Sara: Ingeniería']],
        'A Lina solo le queda Ingeniería. Mía no estudia Medicina ni Ingeniería (ya es de Lina): Derecho. Sara, Medicina.',
        'Empieza por la persona con más carreras tachadas.'),
      PU_ES('A, B, C y D tienen perro, gato, loro y pez. A no tiene perro ni gato, el loro no es de A ni de C, B tiene el perro y C no tiene pez', [['A tiene el pez', 'A tiene el loro'], ['C tiene el gato', 'C tiene el loro'], ['D tiene el loro', 'D tiene el gato']],
        'A no tiene perro, gato ni loro: tiene el pez. C no tiene pez, loro ni perro: el gato. A D le queda el loro.',
        'Tacha en la fila de A todo lo que no puede tener: queda una sola mascota.'),
    ]),
    PU_L('pu-or-4', 'Condiciones: tiene que, podría, no puede', [
      sc(6, '«Si A participa, B no» solo dice algo cuando A está. Si A no está, B puede estar o no.', { title: 'Leer bien un «si…»' }),
      sc(7, '**Necesariamente** cierto: pasa en todas las soluciones. **Podría** ser cierto: pasa en al menos una. **No puede** ser: no pasa en ninguna.', { title: 'Tiene que · podría · no puede' }),
      sc(6, 'Cuando hay pocas posibilidades, lo más seguro es listarlas todas y revisar cada afirmación contra la lista.', { title: 'Lista los casos' }),
    ], [
      PU_ES('Se eligen 2 de 4 personas (F, G, H, J). Si F está, G no; H está solo si J está. ¿Qué es necesariamente cierto?', [['parejas posibles: FJ, GJ, HJ', 'parejas posibles: FG, FJ, HJ'], ['J está en todas', 'F está en todas'], ['J va en el comité', 'H va en el comité']],
        'FG no (F excluye a G); FH y GH no (H necesita a J). Quedan FJ, GJ y HJ: J está siempre.',
        'Escribe las seis parejas posibles y tacha las que rompen alguna condición.'),
      PU_ES('Cinco charlas de lunes a viernes (Arte, Biología, Cine, Danza y Economía): Arte antes que Cine, Danza el miércoles y Economía el lunes o el viernes. ¿Qué se puede afirmar?', [['Arte necesita un día después', 'Arte puede ir de último'], ['Arte no puede ir el viernes', 'Cine no puede ir el martes'], ['Biología podría ir el jueves', 'Biología tiene que ir el jueves']],
        'Arte va antes que Cine, así que nunca el viernes. Cine el martes sí puede (Arte el lunes). Biología puede ir el jueves, pero no está obligada.',
        'Para «no puede» basta un motivo; para «podría» basta un ejemplo que cumpla todo.'),
    ]),
  ] },

  // ---------------- 4 · Proporcionalidad ----------------
  { world: 'pu-proporcion', title: 'Proporcionalidad y porcentajes', block: 'razonamiento', lessons: [
    PU_L('pu-pr-1', 'Razones, repartos y escalas', [
      sc(6, 'Una razón compara dos cantidades: 2 de agua por cada 3 de harina. Dos razones iguales forman una proporción, y en ella los productos cruzados coinciden.', { title: '$\\tfrac ab = \\tfrac cd \\Rightarrow ad = bc$' }),
      sc(7, 'Repartir 600 000 en razón 2 : 3 es partir en $2 + 3 = 5$ partes de 120 000: unos reciben 240 000 y otros 360 000.', { title: 'Reparto directo' }),
      sc(6, 'Escala 1 : 50 000 significa que 1 cm del mapa son 50 000 cm de la realidad: 500 m.', { title: 'Escalas' }),
    ], [
      PU_CTA('Tres socios aportan 2, 3 y 5 millones y reparten 40 millones de ganancia según lo aportado. Plantea cuánto recibe el que aportó 3', { sol: ['40', '/', '(', '2', '+', '3', '+', '5', ')', '*', '3'], traps: ['10'], answer: 12, unit: 'millones' },
        'Son $2 + 3 + 5 = 10$ partes de 4 millones cada una; el socio del medio recibe 3 partes: 12 millones.',
        'Cuenta cuántas partes iguales hay en total y cuánto vale cada parte.'),
      PU_CTA('En un mapa a escala 1 : 25 000 dos pueblos están a 8 cm. Plantea la distancia real en km', { sol: ['8', '*', '25000', '/', '100000'], traps: ['1000'], answer: 2, unit: 'km' },
        '$8 \\cdot 25\\,000 = 200\\,000$ cm. Un kilómetro tiene $100\\,000$ cm: son 2 km.',
        'Pasa primero a centímetros reales y luego convierte: un kilómetro tiene cien mil centímetros.'),
    ]),
    PU_L('pu-pr-2', 'Regla de tres simple y compuesta', [
      sc(6, '**Directa**: si una crece, la otra crece igual (más kilos, más precio). Se mantiene el cociente.', { title: 'Directa: cociente constante' }),
      sc(6, '**Inversa**: si una crece, la otra decrece (más obreros, menos días). Se mantiene el producto: 6 obreros en 10 días = 4 obreros en 15 días.', { title: 'Inversa: producto constante' }),
      sc(7, 'En la **compuesta** se compara cada magnitud con la incógnita por separado, o se cuenta el trabajo total (obreros × horas × días).', { title: 'Compuesta' }),
    ], [
      PU_ES('5 llaves iguales llenan un tanque en 12 h. ¿Cuánto tardan 3 llaves?', [['más llaves, menos horas: inversa', 'más llaves, más horas: directa'], ['5 · 12 = 3 · t', '5/12 = 3/t'], ['t = 20 h', 't = 7.2 h']],
        'Es inversa: el trabajo $5 \\cdot 12 = 60$ llave-horas se mantiene, y $60 \\div 3 = 20$ h.',
        'Pregúntate si con menos llaves el tanque se llena más rápido o más despacio.'),
      PU_CTA('8 obreros trabajando 6 h diarias hacen una obra en 15 días. Plantea cuántos días tardan 10 obreros trabajando 8 h diarias', { sol: ['8', '*', '6', '*', '15', '/', '(', '10', '*', '8', ')'], traps: ['5'], answer: 9, unit: 'días' },
        'La obra pide $8 \\cdot 6 \\cdot 15 = 720$ horas de trabajo; el nuevo grupo hace $10 \\cdot 8 = 80$ por día: 9 días.',
        'Calcula cuántas horas de trabajo de un obrero necesita la obra completa.'),
    ]),
    PU_L('pu-pr-3', 'Velocidad y trabajo conjunto', [
      sc(6, 'Distancia = velocidad × tiempo. Dos móviles que se acercan suman sus velocidades.', { title: '$d = v \\cdot t$' }),
      sc(7, 'En el trabajo conjunto se suman las **rapideces**, no los tiempos: si una llave llena un tanque en 3 h (1/3 por hora) y otra en 6 h (1/6), juntas llenan 1/2 por hora: 2 h.', { title: 'Se suman las rapideces' }),
      sc(6, 'El error típico es promediar los tiempos: juntas siempre tardan menos que la más rápida sola.', { title: 'Juntas, menos que la más rápida' }),
    ], [
      PU_CTA('Un pintor pinta una casa en 4 días y su ayudante en 12. Plantea cuántos días tardan juntos', { sol: ['1', '/', '(', '1', '/', '4', '+', '1', '/', '12', ')'], traps: ['16', '8'], answer: 3, unit: 'días' },
        'Por día pintan $\\tfrac14 + \\tfrac1{12} = \\tfrac{4}{12} = \\tfrac13$ de la casa: tardan 3 días.',
        'Halla qué parte de la casa pinta cada uno en un día y súmalas.'),
      PU_ES('Dos ciudades están a 360 km. Un bus sale de cada una a la vez, uno hacia el otro, a 70 y 50 km/h. ¿Cuándo se cruzan?', [['se acercan a 120 km/h', 'se acercan a 20 km/h'], ['360 ÷ 120', '360 ÷ 70'], ['en 3 horas', 'en 18 horas']],
        'La distancia entre ellos baja $70 + 50 = 120$ km cada hora: $360 \\div 120 = 3$ h.',
        'Piensa cuántos kilómetros se acortan entre los dos buses en una hora.'),
    ]),
    PU_L('pu-pr-4', 'Porcentajes', [
      sc(6, 'Tres preguntas distintas: el **p % de N** es $\\tfrac{p}{100} N$; **qué % es A de B** es $\\tfrac{A}{B} \\cdot 100$; y la **cantidad original** se halla al revés.', { title: 'Tres preguntas' }),
      sc(6, 'Si el 30 % de un número es 45, el 10 % es 15 y el 100 % es 150.', { title: 'Del 30 % al 100 %' }),
      sc(6, 'Pasar por el 10 % o por el 1 % es un atajo que evita cuentas largas sin calculadora.', { title: 'Atajo: el 10 %' }),
    ], [
      PU_CTA('En una prueba acertó 18 de 24 preguntas. Plantea el porcentaje de aciertos', { sol: ['18', '/', '24', '*', '100'], traps: ['6'], answer: 75, unit: '%' },
        '$\\tfrac{18}{24} = \\tfrac34 = 75\\,\\%$.',
        'Divide lo acertado entre el total y pásalo a «de cada 100».'),
      PU_CTA('Pagué 42 000 pesos, que eran el 70 % del precio. Plantea el precio original', { sol: ['42000', '/', '70', '*', '100'], traps: ['30'], answer: 60000, unit: 'pesos' },
        'Si 70 % son 42 000, el 1 % es 600 y el 100 % es 60 000.',
        'Halla primero cuánto vale el 1 % del precio.'),
    ]),
    PU_L('pu-pr-5', 'Aumentos, descuentos e IVA', [
      sc(6, 'Aumentar un 20 % es multiplicar por 1.2; descontar un 20 % es multiplicar por 0.8.', { title: '$\\times 1.2$ y $\\times 0.8$' }),
      sc(7, 'Los porcentajes sucesivos **se multiplican**, no se suman: subir 20 % y bajar 20 % es $\\times 1.2 \\times 0.8 = \\times 0.96$: se pierde el 4 %.', { title: 'Sucesivos: se multiplican' }),
      sc(7, 'El IVA del 19 %: precio con IVA = base × 1.19, y la base sale dividiendo entre 1.19. Interés simple: $I = C \\cdot r \\cdot t$.', { title: 'IVA e interés simple' }),
    ], [
      PU_ES('Un precio sube un 10 % y luego baja un 10 %. ¿Cuál es el cambio total?', [['× 1.1 y luego × 0.9', '+10 − 10 = 0'], ['1.1 · 0.9 = 0.99', '1.1 · 0.9 = 1'], ['baja 1 %', 'no cambia']],
        'Los cambios se multiplican: $1.1 \\cdot 0.9 = 0.99$. El precio final es el 99 % del inicial.',
        'El segundo 10 % se calcula sobre un precio que ya había cambiado.'),
      PU_CTA('Un celular cuesta 1 190 000 pesos con el IVA del 19 % incluido. Plantea el precio sin IVA', { sol: ['1190000', '/', '1.19'], traps: ['0.19', '19'], answer: 1000000, unit: 'pesos' },
        'Precio con IVA = base × 1.19, así que la base es $1\\,190\\,000 \\div 1.19 = 1\\,000\\,000$.',
        'Restar el 19 % del precio final no funciona: el 19 % se cobró sobre la base, no sobre el total.'),
    ]),
  ] },

  // ---------------- 5 · Conteo ----------------
  { world: 'pu-conteo', title: 'Conteo y combinatoria', block: 'razonamiento', lessons: [
    PU_L('pu-co-1', 'Principio multiplicativo y árboles', [
      sc(6, 'Si una decisión tiene $m$ opciones y otra $n$, juntas tienen $m \\cdot n$. Si son excluyentes («esto **o** aquello»), se suman.', { title: 'Multiplicar y sumar' }),
      sc(6, 'Un árbol lo muestra: 3 camisas y 2 pantalones dan 3 ramas de 2: 6 pintas.', { title: 'Diagrama de árbol' }),
      sc(6, 'Una placa con 3 letras de 26 y 3 dígitos tiene $26^3 \\cdot 10^3$ posibilidades.', { title: '$26^3 \\cdot 10^3$' }),
    ], [
      PU_CTA('Un menú tiene 3 entradas, 4 platos fuertes y 2 postres. Plantea cuántos almuerzos distintos hay', { sol: ['3', '*', '4', '*', '2'], traps: ['9'], answer: 24 },
        'Cada entrada se combina con cada plato y cada postre: $3 \\cdot 4 \\cdot 2 = 24$.',
        'Imagina el árbol: de cada entrada salen ramas de platos, y de cada plato, ramas de postres.'),
      PU_CTA('Plantea cuántas claves de 4 dígitos (0 a 9) tienen todos sus dígitos distintos', { sol: ['10', '*', '9', '*', '8', '*', '7'], traps: ['4'], answer: 5040 },
        'El primer dígito tiene 10 opciones, el segundo 9, el tercero 8 y el cuarto 7: $5\\,040$.',
        'Cada dígito que se usa ya no está disponible para el siguiente.'),
    ]),
    PU_L('pu-co-2', 'Permutaciones', [
      sc(6, 'Para ordenar cinco libros en un estante hay 5 opciones para el primer puesto, 4 para el segundo, y así: $5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120$. Eso se escribe $5!$.', { title: '$n! = n(n-1)\\cdots 1$' }),
      sc(6, 'Con letras repetidas se divide entre las formas de reordenar las iguales: ARROZ tiene $\\tfrac{5!}{2!} = 60$ ordenamientos.', { title: 'Con repetición' }),
      sc(6, 'En una mesa redonda girar no cambia el orden: se fija a uno y se ordena al resto, $(n - 1)!$. Cinco personas: 24.', { title: 'Circulares: $(n-1)!$' }),
    ], [
      PU_CTA('Plantea de cuántas maneras se pueden sentar 6 personas en una mesa redonda', { sol: ['5', '*', '4', '*', '3', '*', '2', '*', '1'], traps: ['6'], answer: 120 },
        'Se fija a una persona y se ordenan las otras 5: $5! = 120$.',
        'Si todos se corren un puesto, la mesa se ve igual: fija a una persona y ordena a las demás.'),
      PU_CTA('Plantea cuántas palabras (con o sin sentido) se forman con las letras de CASAS', { sol: ['120', '/', '(', '2', '*', '2', ')'], traps: ['5'], answer: 30 },
        'Cinco letras dan $5! = 120$ órdenes, pero la A y la S se repiten dos veces cada una: $\\tfrac{120}{2 \\cdot 2} = 30$.',
        'Cuenta como si las cinco letras fueran distintas y luego quita los órdenes que solo intercambian letras iguales.'),
    ]),
    PU_L('pu-co-3', 'Combinaciones', [
      sc(6, 'Si el orden **no importa** (un comité, un grupo), se divide entre las formas de ordenar a los elegidos.', { title: 'Importa el orden o no' }),
      sc(6, 'Elegir 2 de 5: hay $5 \\cdot 4 = 20$ parejas ordenadas, pero cada pareja aparece 2 veces: 10.', { title: '$C(n,k) = \\tfrac{n!}{k!(n-k)!}$' }),
      sc(6, 'Prueba rápida: si intercambio a dos elegidos y el resultado es el mismo, el orden no importa.', { title: 'La prueba del intercambio' }),
    ], [
      PU_ES('De 8 jugadores se eligen 3 para un equipo sin cargos. ¿Cuántos equipos hay?', [['el orden no importa', 'el orden importa'], ['8 · 7 · 6 ÷ (3 · 2 · 1)', '8 · 7 · 6'], ['56', '336']],
        'Sin cargos el orden no importa: $\\tfrac{8 \\cdot 7 \\cdot 6}{3!} = \\tfrac{336}{6} = 56$.',
        'Si intercambias a dos jugadores elegidos, ¿cambia el equipo?'),
      PU_CTA('En un torneo de 10 equipos todos juegan una vez contra todos. Plantea cuántos partidos hay', { sol: ['10', '*', '9', '/', '2'], traps: ['100'], answer: 45 },
        'Cada equipo juega 9 partidos, pero cada partido tiene dos equipos: $\\tfrac{10 \\cdot 9}{2} = 45$.',
        'Si cuentas los partidos de cada equipo, cada partido queda contado dos veces.'),
    ]),
    PU_L('pu-co-4', 'Conteo por casos y complemento', [
      sc(6, 'Si los casos no se cruzan, se cuentan por separado y se suman.', { title: 'Por casos' }),
      sc(7, 'A veces es más fácil contar lo que **no** sirve y restarlo del total. Números de 3 cifras con al menos un 7: $900 - 8 \\cdot 9 \\cdot 9 = 252$.', { title: 'Complemento: total menos lo que no sirve' }),
      sc(6, 'Si dos casos se cruzan, lo que está en los dos se cuenta dos veces: hay que restarlo una vez.', { title: 'No contar dos veces' }),
    ], [
      PU_CTA('Con las letras A, B, C, D y E (pueden repetirse) se forman claves de 3 letras. Plantea cuántas tienen al menos una A', { sol: ['5', '^', '3', '-', '4', '^', '3'], traps: ['3'], answer: 61 },
        'Hay $5^3 = 125$ claves; sin ninguna A hay $4^3 = 64$. Con al menos una A: $125 - 64 = 61$.',
        '«Al menos una» tiene muchos casos. Cuenta mejor las claves que no tienen ninguna A.'),
      PU_ES('¿Cuántos números de dos cifras son pares o múltiplos de 5?', [['pares: 45', 'pares: 50'], ['múltiplos de 5: 18', 'múltiplos de 5: 20'], ['se restan los múltiplos de 10', 'se suman sin restar'], ['45 + 18 − 9 = 54', '45 + 18 = 63']],
        'Pares de 10 a 98: 45. Múltiplos de 5 de 10 a 95: 18. Los múltiplos de 10 (9) están en los dos grupos: $45 + 18 - 9 = 54$.',
        'Algunos números son pares y múltiplos de 5 a la vez: revisa si los estás contando dos veces.'),
    ]),
    PU_L('pu-co-5', 'Contar figuras y caminos', [
      sc(6, 'Para contar triángulos o cuadrados en un dibujo, se cuentan **por tamaños**: primero los pequeños, luego los de dos piezas, y así.', { title: 'Por tamaños' }),
      sc(7, 'Caminos en una cuadrícula moviéndose solo a la derecha y hacia arriba: de (0, 0) a (3, 2) hay que elegir cuáles de los 5 pasos son «arriba»: $C(5, 2) = 10$.', { title: 'Caminos = combinaciones' }),
      sc(6, 'Las diagonales de un polígono de $n$ lados: $\\tfrac{n(n - 3)}{2}$. Un hexágono tiene 9.', { title: 'Diagonales' }),
    ], [
      PU_CTA('Plantea cuántas diagonales tiene un decágono', { sol: ['10', '*', '(', '10', '-', '3', ')', '/', '2'], traps: ['45'], answer: 35 },
        'Desde cada vértice salen $10 - 3 = 7$ diagonales y cada una se cuenta desde sus dos extremos: $\\tfrac{10 \\cdot 7}{2} = 35$.',
        'Desde un vértice no se traza diagonal a sí mismo ni a sus dos vecinos.'),
      PU_ES('Caminos más cortos de 4 cuadras a la derecha y 2 hacia arriba', [['6 pasos: 4 D y 2 A', '8 pasos'], ['elegir dónde van las 2 A', 'ordenar 6 pasos distintos'], ['6 · 5 ÷ 2 = 15', '6! = 720']],
        'Todo camino corto tiene 6 pasos; basta elegir cuáles 2 son hacia arriba: $C(6, 2) = 15$.',
        'Todos los caminos cortos tienen los mismos pasos; solo cambia en qué momento se sube.'),
    ]),
  ] },

  // ---------------- 6 · Razonamiento espacial ----------------
  { world: 'pu-espacial', title: 'Razonamiento espacial', block: 'razonamiento', lessons: [
    PU_L('pu-es-1', 'Rejillas y caminos', [
      sc(6, 'En una rejilla sin diagonales, el camino más corto mide lo que hay que avanzar en horizontal **más** lo que hay que avanzar en vertical.', { title: 'Distancia por cuadras' }),
      sc(6, 'De (2, 1) a (5, 3) son 3 cuadras en horizontal y 2 en vertical: 5 cuadras, por cualquier camino que no retroceda.', { title: '$3 + 2 = 5$' }),
      sc(6, 'Un obstáculo obliga a rodear: el camino más corto bordea el obstáculo sin devolverse.', { title: 'Rodear sin devolverse' }),
    ], [
      PU_ES('En una ciudad cuadriculada vas de la esquina (1, 2) a la (6, 5) sin diagonales. ¿Cuánto mide el camino más corto?', [['5 cuadras al este', '6 cuadras al este'], ['3 cuadras al norte', '5 cuadras al norte'], ['8 cuadras', '√34 cuadras']],
        'En horizontal $6 - 1 = 5$ y en vertical $5 - 2 = 3$: $5 + 3 = 8$ cuadras. La línea recta ($\\sqrt{34}$) no se puede caminar.',
        'Resta las coordenadas por separado. Por las calles no se puede ir en diagonal.'),
      PU_CTA('Un robot va 3 cuadras al norte, 5 al este, 7 al sur y 2 al oeste. Plantea a cuántas cuadras queda del inicio por el camino más corto', { sol: ['7', '-', '3', '+', '5', '-', '2'], traps: ['17'], answer: 7, unit: 'cuadras' },
        'En vertical termina $7 - 3 = 4$ al sur; en horizontal, $5 - 2 = 3$ al este. Camino más corto: $4 + 3 = 7$.',
        'Los movimientos opuestos se cancelan entre sí. Calcula aparte cuánto quedó en vertical y en horizontal.'),
    ]),
    PU_L('pu-es-2', 'Vistas y cubos', [
      sc(6, 'La vista **superior** muestra qué columnas hay; la **frontal**, la columna más alta de cada fila vista de frente.', { title: 'Vistas' }),
      sc(6, 'Al contar cubos de una construcción, los que no se ven también cuentan: los que sostienen a los de arriba.', { title: 'Cubos ocultos' }),
      sc(7, 'Un cubo de 3 × 3 × 3 pintado por fuera y cortado en cubitos: 8 tienen tres caras pintadas (esquinas), 12 dos (aristas), 6 una (centros de cara) y 1 ninguna.', { title: '8 · 12 · 6 · 1' }),
    ], [
      PU_ES('Un cubo de 4 × 4 × 4 se pinta por fuera y se corta en cubitos de 1. ¿Cuántos tienen exactamente dos caras pintadas?', [['están en las aristas, sin las esquinas', 'están en las esquinas'], ['2 por arista', '4 por arista'], ['12 · 2 = 24', '8 · 2 = 16']],
        'Cada arista tiene 4 cubitos; quitando las 2 esquinas quedan 2. El cubo tiene 12 aristas: $24$.',
        'Los cubitos con tres caras pintadas están en las esquinas. ¿Dónde están los que tienen dos?'),
      PU_CTA('En ese mismo cubo de 4 × 4 × 4, plantea cuántos cubitos no tienen ninguna cara pintada', { sol: ['(', '4', '-', '2', ')', '^', '3'], traps: ['64'], answer: 8 },
        'Los que no tocan ninguna cara forman un cubo interior de $2 \\times 2 \\times 2 = 8$.',
        'Quita la capa exterior por todos los lados: ¿qué cubo queda adentro?'),
    ]),
    PU_L('pu-es-3', 'Desarrollos del cubo', [
      sc(6, 'Un **desarrollo** es el cubo abierto y aplanado: seis cuadrados unidos por sus lados. Hay 11 formas distintas.', { title: 'Abrir el cubo' }),
      sc(7, 'En una fila de tres cuadrados del desarrollo, el primero y el tercero quedan **opuestos** al armar el cubo. Dos caras que se tocan nunca son opuestas.', { title: 'Saltar uno = opuestos' }),
      sc(6, 'En un dado común, las caras opuestas suman 7: 1 con 6, 2 con 5, 3 con 4.', { title: 'El dado: suman 7' }),
    ], [
      PU_ES('Desarrollo en cruz: fila 1-2-3-4 y las caras 5 y 6 arriba y abajo de la 2. ¿Qué cara queda opuesta a la 1?', [['en la fila se salta una', 'las vecinas son opuestas'], ['1 opuesta a 3', '1 opuesta a 2'], ['5 opuesta a 6', '5 opuesta a 1']],
        'En la fila, la 1 queda frente a la 3 y la 2 frente a la 4. Las dos alas de la 2, la 5 y la 6, quedan una frente a la otra.',
        'Arma el cubo con la cara 2 de fondo y dobla las demás hacia arriba.'),
      PU_ES('Un dado muestra 1 arriba, 2 al frente y 3 a la derecha. Lo volteas hacia adelante (lo de arriba pasa al frente). ¿Qué queda arriba?', [['el 1 pasa al frente', 'el 1 pasa atrás'], ['atrás estaba el 5', 'atrás estaba el 6'], ['arriba queda el 5', 'arriba queda el 2']],
        'Al voltear hacia adelante, la cara de atrás sube. Atrás estaba la opuesta del 2: el 5.',
        'Las caras opuestas suman 7. Piensa cuál cara está atrás antes de voltearlo.'),
    ]),
    PU_L('pu-es-4', 'Giros, espejos y dobleces', [
      sc(6, 'Girar una figura no le cambia la «mano»: una F girada sigue siendo F. **Reflejarla** en un espejo sí: la F queda al revés.', { title: 'Girar ≠ reflejar' }),
      sc(6, 'Un espejo vertical cambia izquierda por derecha, pero no arriba por abajo.', { title: 'El espejo' }),
      sc(7, 'Doblar una hoja duplica sus capas: con tres dobleces hay $2 \\cdot 2 \\cdot 2 = 8$ capas, y un solo corte las atraviesa todas.', { title: 'Cada doblez duplica' }),
    ], [
      PU_ES('Doblas una hoja por la mitad dos veces y haces un agujero que atraviesa todas las capas. Al abrirla, ¿cuántos agujeros hay?', [['cada doblez duplica las capas', 'cada doblez suma una capa'], ['4 capas', '3 capas'], ['4 agujeros', '2 agujeros']],
        'Primer doblez: 2 capas; segundo: 4. El agujero atraviesa las 4, así que al abrir hay 4.',
        'Cuenta cuántas capas de papel hay justo antes de perforar.'),
      PU_ES('En el espejo, un reloj de agujas parece marcar las 3:00. ¿Qué hora es?', [['el espejo cambia izquierda y derecha', 'el espejo cambia arriba y abajo'], ['la aguja corta queda en el 9', 'la aguja corta queda en el 6'], ['son las 9:00', 'son las 3:00']],
        'El reflejo cambia los lados: la aguja corta que se ve en el 3 está en realidad en el 9.',
        'Un espejo vertical no mueve las 12 ni las 6, pero sí cambia los números de un lado por los del otro.'),
    ]),
  ] },

  // ---------------- 7 · Secuencias ----------------
  { world: 'pu-secuencias', title: 'Secuencias y patrones', block: 'razonamiento', lessons: [
    PU_L('pu-se-1', 'Sucesiones numéricas', [
      sc(6, 'Primera prueba: las **diferencias**. Si son iguales, es aritmética: $a_n = a_1 + (n - 1)d$. Si los cocientes son iguales, es geométrica.', { title: 'Diferencias y cocientes' }),
      sc(6, 'Si las diferencias no son iguales, se miran las diferencias de las diferencias, o se buscan cuadrados y cubos: 1, 8, 27, 64…', { title: 'Segundo nivel' }),
      sc(6, 'Otras familias: alternadas (dos sucesiones intercaladas) y tipo Fibonacci: 3, 4, 7, 11, 18…, cada término es la suma de los dos anteriores.', { title: 'Alternadas y Fibonacci' }),
    ], [
      PU_ES('Halla el término que sigue en 2, 5, 10, 17, 26, …', [['diferencias: 3, 5, 7, 9', 'diferencias: 3, 3, 3, 3'], ['la siguiente diferencia es 11', 'la siguiente diferencia es 10'], ['26 + 11 = 37', '26 + 9 = 35']],
        'Las diferencias son los impares: la siguiente es 11 y el término es 37. Son los cuadrados más uno: $6^2 + 1$.',
        'Resta cada término del siguiente y mira cómo cambian esas restas.'),
      PU_CTA('En la sucesión 7, 11, 15, 19, … plantea el término 50', { sol: ['7', '+', '49', '*', '4'], traps: ['50'], answer: 203 },
        'Diferencia 4. Del término 1 al 50 hay 49 saltos: $7 + 49 \\cdot 4 = 203$.',
        'Del primer término al quincuagésimo no hay 50 saltos: cuenta bien cuántos hay.'),
    ]),
    PU_L('pu-se-2', 'Letras y figuras', [
      sc(6, 'Con letras se pasa a números por su posición: A = 1, B = 2… Aquí se usa el alfabeto sin la Ñ, salvo que el enunciado diga otra cosa.', { title: 'Letras como números' }),
      sc(6, 'Ejemplo: C, F, I, L son 3, 6, 9, 12: saltos de 3. La siguiente es la 15, la O.', { title: 'C, F, I, L, O' }),
      sc(6, 'En secuencias de figuras se pregunta qué cambia (lados, giro, color, número de puntos) y cuánto cambia cada vez.', { title: 'Figuras: qué cambia' }),
    ], [
      PU_ES('Halla la letra que sigue (alfabeto sin Ñ): B, E, H, K, …', [['saltos de 3 letras', 'saltos de 2 letras'], ['K es la 11: sigue la 14', 'K es la 11: sigue la 13'], ['N', 'M']],
        'B, E, H y K son 2, 5, 8 y 11: saltos de 3. Sigue la 14, la N.',
        'Escribe la posición de cada letra en el alfabeto y mira los saltos.'),
      PU_ES('Halla la letra que sigue (alfabeto sin Ñ): A, C, F, J, O, …', [['saltos de 2, 3, 4 y 5', 'saltos de 2'], ['el salto siguiente es 6', 'el salto siguiente es 5'], ['15 + 6 = 21: U', '15 + 5 = 20: T']],
        'Posiciones 1, 3, 6, 10, 15: los saltos crecen de uno en uno. Sigue $15 + 6 = 21$, la U.',
        'Los saltos no son iguales: mira cómo crecen.'),
    ]),
    PU_L('pu-se-3', 'Patrones cíclicos', [
      sc(6, 'Si algo se repite cada $k$ pasos, lo que cae en la posición $n$ depende solo del **residuo** de $n \\div k$.', { title: 'El residuo manda' }),
      sc(7, 'Hoy es martes. Dentro de 100 días: $100 = 14 \\cdot 7 + 2$, así que las 14 semanas no cuentan y quedan 2 días: jueves.', { title: '$100 = 14 \\cdot 7 + 2$' }),
      sc(6, 'Si el residuo es 0, cae en el último elemento del ciclo, no en el primero.', { title: 'Residuo 0' }),
    ], [
      PU_ES('Una cinta repite rojo, verde, azul, amarillo, rojo, verde… ¿De qué color es la cuenta 2026?', [['el ciclo tiene 4 colores', 'el ciclo tiene 3 colores'], ['2026 = 4 · 506 + 2', '2026 = 4 · 506 + 0'], ['residuo 2: verde', 'residuo 2: rojo']],
        '2026 deja residuo 2 al dividir entre 4: es como la cuenta 2, verde.',
        'Divide la posición entre el largo del ciclo y fíjate solo en lo que sobra.'),
      PU_ES('Si hoy es miércoles, ¿qué día será dentro de 60 días?', [['60 = 7 · 8 + 4', '60 = 7 · 8 + 2'], ['4 días después del miércoles', '4 días antes del miércoles'], ['domingo', 'sábado']],
        'Ocho semanas completas no cambian el día; los 4 días que sobran llevan del miércoles al domingo.',
        'Las semanas completas te devuelven al mismo día. Cuenta solo los días que sobran.'),
    ]),
  ] },

  // ---------------- 8 · Codificación ----------------
  { world: 'pu-codigos', title: 'Codificación', block: 'razonamiento', lessons: [
    PU_L('pu-cd-1', 'Claves de sustitución', [
      sc(6, 'Una clave de sustitución cambia cada letra por otra o por un símbolo, siempre con la misma regla.', { title: 'Sustituir' }),
      sc(6, 'En la clave César cada letra se corre $k$ lugares: con $k = 3$, SOL se escribe VRO.', { title: 'César' }),
      sc(6, 'Si el enunciado trae una tabla (Morse, binario, cifrado), se sigue al pie de la letra: el examen no pide saberla de memoria.', { title: 'Seguir la tabla' }),
    ], [
      PU_ES('Con la clave César de +2 (alfabeto sin Ñ), ¿cómo se escribe LUNA?', [['L → N', 'L → M'], ['U → W', 'U → V'], ['NWPC', 'NWOC']],
        'Cada letra avanza dos: L → N, U → W, N → P, A → C: NWPC.',
        'Avanza dos letras desde cada una; cuenta con cuidado alrededor de la N.'),
      PU_ES('Si A = 1, B = 2, … (sin Ñ), ¿cuánto suma la palabra CASA?', [['C = 3 y A = 1', 'C = 2 y A = 1'], ['S = 19', 'S = 20'], ['3 + 1 + 19 + 1 = 24', '3 + 1 + 20 + 1 = 25']],
        'C = 3, A = 1, S = 19 (sin Ñ): $3 + 1 + 19 + 1 = 24$.',
        'Sin la Ñ, la S es la letra 19. Cuenta desde la A si dudas.'),
    ]),
    PU_L('pu-cd-2', 'Deducir la regla', [
      sc(6, 'Para descubrir un código se comparan los ejemplos posición por posición y se propone una regla.', { title: 'Comparar ejemplos' }),
      sc(6, 'Si GATO se escribe HBUP, cada letra avanzó una: la regla es +1.', { title: 'GATO → HBUP' }),
      sc(6, 'La regla se **comprueba** con otro ejemplo antes de usarla: una regla que sirve para uno solo no es la regla.', { title: 'Comprobar' }),
    ], [
      PU_ES('En un código, MESA se escribe ASEM y LOTE se escribe ETOL. ¿Cómo se escribe RUTA?', [['se invierte el orden', 'se corre cada letra'], ['ATUR', 'SVUB']],
        'Los dos ejemplos son la palabra al revés: RUTA se escribe ATUR.',
        'Mira dónde quedó la primera letra de cada palabra.'),
      PU_ES('En otro código, 25 → 7, 48 → 12 y 93 → 12. ¿Qué da 76?', [['se suman las cifras', 'se restan las cifras'], ['7 + 6', '7 · 6'], ['13', '42']],
        '$2 + 5 = 7$, $4 + 8 = 12$, $9 + 3 = 12$: se suman las cifras. $7 + 6 = 13$.',
        'Prueba operaciones sencillas con las dos cifras de cada número y comprueba con los tres ejemplos.'),
    ]),
  ] },

  // ---------------- 9 · Tablas y gráficas ----------------
  { world: 'pu-graficas', title: 'Tablas y gráficas', block: 'razonamiento', lessons: [
    PU_L('pu-gr-1', 'Leer gráficas', [
      sc(6, 'Antes de leer datos: el título, qué mide cada eje y la **escala**. Un eje que no empieza en cero exagera las diferencias.', { title: 'Título, ejes y escala' }),
      sc(6, 'Barras para comparar, líneas para ver cambios en el tiempo, circulares para partes de un todo (360° = 100 %).', { title: 'Cada gráfica, su uso' }),
      sc(6, 'La variación porcentual es $\\tfrac{\\text{nuevo} - \\text{viejo}}{\\text{viejo}} \\cdot 100$: de 50 a 60 es un aumento del 20 %.', { title: 'Variación porcentual' }),
    ], [
      PU_CTA('Una tienda vendió 80 unidades en enero y 100 en febrero. Plantea el aumento porcentual', { sol: ['(', '100', '-', '80', ')', '/', '80', '*', '100'], traps: ['20'], answer: 25, unit: '%' },
        'Aumentó 20 unidades sobre 80: $\\tfrac{20}{80} = 25\\,\\%$.',
        'El cambio se compara con el valor de antes, no con el de después.'),
      PU_CTA('En una gráfica circular, el sector «transporte» mide 72°. Plantea qué porcentaje del gasto es', { sol: ['72', '/', '360', '*', '100'], traps: ['180'], answer: 20, unit: '%' },
        'El círculo completo, 360°, es el 100 %: $\\tfrac{72}{360} = 20\\,\\%$.',
        'Un círculo completo representa el total de los gastos.'),
    ]),
    PU_L('pu-gr-2', 'Promedio, mediana y moda', [
      sc(6, '**Promedio**: la suma dividida entre la cantidad de datos. **Moda**: el dato que más se repite.', { title: 'Promedio y moda' }),
      sc(6, '**Mediana**: el dato del medio con los datos **ordenados**. Si hay dos en el medio, se promedian.', { title: 'Mediana' }),
      sc(6, 'Con 3, 7, 7, 8 y 10: el promedio es $35 \\div 5 = 7$, la mediana es 7 y la moda es 7.', { title: 'Un ejemplo' }),
    ], [
      PU_ES('Halla la mediana de 4, 9, 2, 9, 6, 8', [['ordenar: 2, 4, 6, 8, 9, 9', 'tomar el del medio sin ordenar'], ['en el medio están 6 y 8', 'en el medio está el 9'], ['mediana 7', 'mediana 6']],
        'Ordenados: 2, 4, 6, 8, 9, 9. Hay dos en el medio, 6 y 8: la mediana es 7.',
        'La mediana solo tiene sentido con los datos ordenados. Fíjate si la cantidad de datos es par.'),
      PU_CTA('Las notas de Juan son 3.5, 4 y 2.5. Plantea qué nota necesita en la cuarta para que el promedio sea 3.5', { sol: ['3.5', '*', '4', '-', '(', '3.5', '+', '4', '+', '2.5', ')'], traps: ['3'], answer: 4 },
        'Para promediar 3.5 en cuatro notas, la suma debe ser $3.5 \\cdot 4 = 14$. Ya lleva 10: le falta un 4.',
        'Piensa cuánto deben sumar las cuatro notas para dar ese promedio.'),
    ]),
    PU_L('pu-gr-3', 'Qué se puede concluir', [
      sc(6, 'Una conclusión vale solo si los datos la sostienen. Si la gráfica no lo muestra, no se puede afirmar.', { title: 'Lo que los datos permiten' }),
      sc(6, 'Que dos cosas suban juntas no prueba que una cause la otra: puede haber una tercera que mueva a las dos.', { title: 'Relación no es causa' }),
      sc(6, 'Una muestra habla de quienes respondieron, no de todo el país.', { title: 'La muestra' }),
    ], [
      PU_SUB('Encuesta en un colegio: toca las conclusiones que los datos permiten', [
        { title: 'Se encuestó a 200 estudiantes de un colegio: 120 prefieren estudiar de noche y 80 de día.', text: 'El 60 % de los encuestados prefiere la noche.|Los que estudian de noche sacan mejores notas.|En el país, la mayoría estudia de noche.|Hay 40 encuestados más que prefieren la noche.', ask: 'Toca las conclusiones que se pueden sacar de la encuesta', answer: [0, 3] },
      ], '$\\tfrac{120}{200} = 60\\,\\%$ y $120 - 80 = 40$ salen de los datos. Las notas no se midieron, y 200 estudiantes de un colegio no hablan por todo el país.',
        'Para cada afirmación, busca el número de la encuesta que la respalda. Si no hay ninguno, no se puede concluir.'),
      PU_ES('En una ciudad, los meses con más venta de helados tienen más ahogamientos en piscinas', [['los dos suben con el calor', 'los helados causan ahogamientos'], ['es una relación, no una causa', 'la causa está demostrada']],
        'El calor aumenta las dos cosas a la vez: hay relación, pero los helados no causan los ahogamientos.',
        'Busca algo que haga subir las dos cosas en los mismos meses.'),
    ]),
  ] },

  // ---------------- 10 · Lógica proposicional ----------------
  { world: 'pu-logica', title: 'Lógica proposicional', block: 'razonamiento', lessons: [
    PU_L('pu-lo-1', 'Conectivos y tablas de verdad', [
      sc(6, '$p \\wedge q$ («y») es verdadera solo si las dos lo son; $p \\vee q$ («o») es falsa solo si las dos son falsas; $\\neg p$ cambia el valor.', { title: 'Y, o, no' }),
      sc(7, '$p \\to q$ («si p, entonces q») solo es falsa cuando $p$ es verdadera y $q$ falsa: la promesa se rompe solo así. $p \\leftrightarrow q$ es verdadera si coinciden.', { title: 'Condicional y bicondicional' }),
      sc(6, 'Una tabla de verdad prueba todas las combinaciones: con dos letras son 4 filas.', { title: 'Tablas de verdad' }),
    ], [
      PU_ES('$p$: «llueve» es V y $q$: «hace frío» es F. Halla el valor de $(p \\vee q) \\to \\neg p$', [['p ∨ q es V', 'p ∨ q es F'], ['¬p es F', '¬p es V'], ['V → F es F', 'V → F es V']],
        '$p \\vee q$ es verdadera porque $p$ lo es; $\\neg p$ es falsa; y verdadero → falso es falso.',
        'Resuelve primero lo que está entre paréntesis y la negación; el condicional va al final.'),
      PU_ES('¿En qué caso es falsa la promesa «Si estudio, apruebo»?', [['solo en un caso', 'en dos casos'], ['estudio y no apruebo', 'no estudio y apruebo']],
        'Un condicional solo falla cuando se cumple la condición y no el resultado: estudiar y no aprobar.',
        'Piensa cuándo podrías reclamar que la promesa se incumplió.'),
    ]),
    PU_L('pu-lo-2', 'Negación y De Morgan', [
      sc(6, 'Leyes de De Morgan: negar un «y» da un «o» de negaciones, y negar un «o» da un «y» de negaciones.', { title: '$\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q$' }),
      sc(6, '«Todos son» se niega con «**alguno no es**», no con «ninguno es». «Ninguno es» se niega con «alguno es».', { title: 'Negar cuantificadores' }),
      sc(6, 'Ejemplo: la negación de «todos los buses llegaron» es «algún bus no llegó».', { title: 'Un ejemplo' }),
    ], [
      PU_ES('Niega, de abajo hacia arriba, «Todos los estudiantes trajeron el carné» y luego «Juan canta y baila»', [
        ['basta uno que no lo traiga', 'tendrían que faltar todos'], ['alguno no trajo el carné', 'ninguno trajo el carné'],
        ['basta que falle una de las dos', 'tienen que fallar las dos'], ['Juan no canta o no baila', 'Juan no canta y no baila'],
      ], '«Todos lo trajeron» deja de ser cierto si al menos uno no lo trajo. «Canta y baila» falla si falta cualquiera de las dos cosas.',
        'Para negar una frase, piensa qué es lo mínimo que tendría que pasar para que deje de ser cierta.'),
      PU_ES('Niega la frase «Si llueve, me quedo en casa»', [['p → q equivale a ¬p ∨ q', 'p → q equivale a p ∧ q'], ['su negación es p ∧ ¬q', 'su negación es ¬p → ¬q'], ['llueve y no me quedo', 'si no llueve, no me quedo']],
        'El condicional solo falla si llueve y no me quedo: esa es su negación.',
        'Busca el único caso en que la frase original sería falsa.'),
    ]),
    PU_L('pu-lo-3', 'El condicional', [
      sc(7, 'De $p \\to q$ salen tres: recíproco $q \\to p$, contrario $\\neg p \\to \\neg q$ y contrarrecíproco $\\neg q \\to \\neg p$. Solo el contrarrecíproco es equivalente.', { title: 'Recíproco, contrario y contrarrecíproco' }),
      sc(6, '**Modus ponens**: si $p \\to q$ y pasa $p$, pasa $q$. **Modus tollens**: si $p \\to q$ y no pasa $q$, no pasó $p$.', { title: 'Ponens y tollens' }),
      sc(6, 'Error frecuente: «si llueve, la calle se moja; la calle está mojada, entonces llovió». La calle pudo mojarse por otra razón.', { title: 'La falacia del consecuente' }),
    ], [
      PU_ES('«Si un número es múltiplo de 6, es par.» ¿Qué frase es equivalente?', [['solo el contrarrecíproco equivale', 'el recíproco equivale'], ['si no es par, no es múltiplo de 6', 'si es par, es múltiplo de 6', 'si no es múltiplo de 6, no es par']],
        'El contrarrecíproco, $\\neg q \\to \\neg p$, dice lo mismo. Las otras fallan: 4 es par y no es múltiplo de 6; 4 no es múltiplo de 6 y es par.',
        'Prueba cada frase con un número concreto, por ejemplo el 4.'),
      PU_ES('Premisas: «Si hay examen, Ana estudia» y «Ana no estudió». ¿Qué se concluye?', [['modus tollens', 'modus ponens'], ['no hubo examen', 'hubo examen']],
        'Si hubiera habido examen, Ana habría estudiado. No estudió: no hubo examen (modus tollens).',
        'La segunda premisa niega el resultado del condicional, no la condición.'),
    ]),
    PU_L('pu-lo-4', 'Cuantificadores y silogismos', [
      sc(6, 'Todos, algunos, ninguno: se dibujan con círculos. «Todos los A son B» es un círculo A dentro de B.', { title: 'Dibujar con círculos' }),
      sc(6, 'Si todos los A son B y todos los B son C, todos los A son C: los círculos quedan uno dentro de otro.', { title: 'Encadenar' }),
      sc(6, '«Algunos A son B» solo dice que los círculos se tocan; no dice nada de los demás A.', { title: '«Algunos» es poco' }),
    ], [
      PU_ES('«Todos los médicos son profesionales. Algunos profesionales son deportistas.» ¿Qué se concluye de los médicos?', [['médicos dentro de profesionales', 'profesionales dentro de médicos'], ['puede haber deportistas no médicos', 'todo deportista toca a los médicos'], ['nada asegura médicos deportistas', 'algunos médicos son deportistas']],
        'Los deportistas pueden ser profesionales que no son médicos: no se puede asegurar que haya médicos deportistas.',
        'Dibuja los círculos y busca una forma de ponerlos que cumpla las dos frases sin que médicos y deportistas se toquen.'),
      PU_ES('«Ningún reptil tiene plumas. Todos los loros tienen plumas.» ¿Qué se concluye?', [['loros dentro de «con plumas»', 'loros dentro de reptiles'], ['ningún loro es reptil', 'algunos loros son reptiles']],
        'Los loros están dentro del círculo de los que tienen plumas, y ese círculo no toca a los reptiles: ningún loro es reptil.',
        'Ubica primero el círculo de los loros respecto al de los animales con plumas.'),
    ]),
    PU_L('pu-lo-5', 'Verdad y mentira', [
      sc(6, 'En los problemas de quién miente, se **supone** que alguien dice la verdad y se mira si todo cuadra.', { title: 'Suponer y revisar' }),
      sc(7, 'A dice «B miente»; B dice «los dos decimos la verdad». Si B dijera la verdad, A también, y A dice que B miente: contradicción. Así que B miente, y A dice la verdad.', { title: 'Buscar la contradicción' }),
      sc(6, 'Si una suposición lleva a una contradicción, se descarta; la que no choca con nada es la respuesta.', { title: 'Descartar' }),
    ], [
      PU_ES('Solo uno dice la verdad. Pedro: «Yo no rompí el vidrio». Luis: «Fue Pedro». Juan: «Yo no fui». ¿Quién lo rompió?', [['si fue Pedro, dos dicen la verdad', 'si fue Pedro, uno dice la verdad'], ['si fue Luis, dos dicen la verdad', 'si fue Luis, uno dice la verdad'], ['fue Juan', 'fue Luis']],
        'Si fue Juan, solo Pedro dice la verdad, como pide el enunciado. Con Pedro o con Luis como culpables habría dos verdades.',
        'Prueba con cada uno como culpable y cuenta cuántos dirían la verdad.'),
      PU_ES('Ana: «Beto miente». Beto: «Carla miente». Carla: «Ana y Beto mienten». ¿Quién dice la verdad?', [['Carla no puede decir la verdad', 'Carla dice la verdad'], ['Beto dice la verdad', 'Beto miente'], ['Ana miente', 'Ana dice la verdad']],
        'Si Carla dijera la verdad, Ana mentiría, y entonces Beto diría la verdad: contradicción. Carla miente, Beto dice la verdad y Ana miente.',
        'Empieza suponiendo que Carla dice la verdad y sigue las consecuencias.'),
    ]),
  ] },

  // ---------------- 11 · Operadores definidos ----------------
  { world: 'pu-operadores', title: 'Operadores definidos', block: 'razonamiento', lessons: [
    PU_L('pu-op-1', 'Operaciones nuevas', [
      sc(6, 'Un símbolo nuevo es una máquina: en $a \\star b = 2a - b$ se reemplaza $a$ por el primer número y $b$ por el segundo.', { title: '$a \\star b = 2a - b$' }),
      sc(6, 'Con esa regla $5 \\star 3 = 7$ pero $3 \\star 5 = 1$: el orden importa, la operación no es conmutativa.', { title: 'No es conmutativa' }),
      sc(6, 'Si la operación viene en una tabla, el resultado está en el cruce de la fila del primero con la columna del segundo.', { title: 'Por tabla' }),
    ], [
      PU_CTA('Si $a \\triangle b = a^2 - 3b$, plantea $4 \\triangle 2$', { sol: ['4', '^', '2', '-', '3', '*', '2'], traps: ['1'], answer: 10 },
        '$4^2 - 3 \\cdot 2 = 16 - 6 = 10$.',
        'Reemplaza $a$ por el primer número y $b$ por el segundo, sin cambiar nada más.'),
      PU_ES('Con $a \\circ b = ab + a + b$, ¿hay un número $e$ tal que $a \\circ e = a$ para todo $a$?', [['a ∘ e = a para todo a', 'e ∘ e = e'], ['ae + a + e = a', 'ae = a'], ['e(a + 1) = 0: e = 0', 'e = 1']],
        'Hay que despejar $e$ en $ae + a + e = a$: $e(a + 1) = 0$, así que $e = 0$. Comprobación: $a \\circ 0 = 0 + a + 0 = a$.',
        'Escribe $a \\circ e$ con la regla y exige que dé $a$.'),
    ]),
    PU_L('pu-op-2', 'Anidados y ecuaciones', [
      sc(6, 'Las operaciones anidadas se resuelven **de adentro hacia afuera**, como los paréntesis.', { title: 'De adentro hacia afuera' }),
      sc(6, 'Si el operador está en una ecuación, se reemplaza con su regla y se despeja como siempre.', { title: 'Ecuaciones con operador' }),
      sc(6, 'Ejemplo: con $a \\# b = a + 2b$, $(1 \\# 1) \\# 2 = 3 \\# 2 = 7$.', { title: 'Un anidado' }),
    ], [
      PU_ES('Con $a \\star b = 2a - b$, calcula $(3 \\star 1) \\star 4$', [['3 ★ 1 = 5', '3 ★ 1 = 7'], ['5 ★ 4 = 6', '5 ★ 4 = 14']],
        '$3 \\star 1 = 6 - 1 = 5$ y luego $5 \\star 4 = 10 - 4 = 6$.',
        'Resuelve primero el paréntesis; su resultado es el primer número de la siguiente operación.'),
      PU_ES('Con $x \\oplus y = 3x + y$, halla $x$ si $x \\oplus 4 = 19$', [['3x + 4 = 19', 'x + 12 = 19'], ['3x = 15', '3x = 23'], ['x = 5', 'x = 7']],
        'La regla da $3x + 4 = 19$, así $3x = 15$ y $x = 5$.',
        'Escribe la ecuación usando la regla del operador; el 4 ocupa el lugar de $y$.'),
    ]),
  ] },

  // ---------------- 12 · Aritmética y promedios ----------------
  { world: 'pu-aritmetica', title: 'Aritmética y promedios', block: 'razonamiento', lessons: [
    PU_L('pu-ar-1', 'Fracciones de lo que queda', [
      sc(6, '«Gastó $\\tfrac13$ y luego $\\tfrac14$ de lo que le quedaba»: la segunda fracción es de **lo que queda**, no del total.', { title: 'De lo que queda' }),
      sc(7, 'Con 120 000: gasta 40 000 y quedan 80 000; luego gasta la cuarta parte de eso, 20 000, y quedan 60 000: la mitad del total.', { title: '120 000 → 80 000 → 60 000' }),
      sc(6, 'Un truco: multiplicar lo que va quedando. Después de las dos compras queda $\\tfrac23 \\cdot \\tfrac34 = \\tfrac12$.', { title: 'Multiplicar lo que queda' }),
    ], [
      PU_ES('Un tanque lleno: se usan $\\tfrac25$ y luego $\\tfrac13$ de lo que quedó. ¿Qué fracción queda?', [['quedan 3/5', 'quedan 2/5'], ['1/3 de 3/5 = 1/5', '1/3 del total'], ['quedan 2/5', 'quedan 4/15']],
        'Tras usar $\\tfrac25$ quedan $\\tfrac35$; un tercio de eso es $\\tfrac15$ y quedan $\\tfrac35 - \\tfrac15 = \\tfrac25$.',
        'La segunda fracción se calcula sobre lo que había después del primer gasto.'),
      PU_CTA('Pedro gastó la mitad de su dinero en un libro y $\\tfrac13$ de lo restante en almuerzo. Le quedan 20 000 pesos. Plantea cuánto tenía', { sol: ['20000', '*', '3'], traps: ['2'], answer: 60000, unit: 'pesos' },
        'Queda $\\tfrac12 \\cdot \\tfrac23 = \\tfrac13$ del dinero, que son 20 000: tenía 60 000.',
        'Multiplica las fracciones que van quedando para saber qué parte del total son esos 20 000.'),
    ]),
    PU_L('pu-ar-2', 'Promedios', [
      sc(6, 'La llave de los promedios: **promedio × cantidad = suma total**.', { title: 'Promedio × cantidad = suma' }),
      sc(6, 'Si se agrega un dato, se calcula la nueva suma y se divide entre la nueva cantidad.', { title: 'Agregar o quitar un dato' }),
      sc(6, 'En un promedio ponderado cada nota pesa su porcentaje: $0.4 \\cdot 3 + 0.6 \\cdot 4 = 3.6$.', { title: 'Ponderado' }),
    ], [
      PU_CTA('9 personas pesan en promedio 70 kg. Entra una más y el promedio sube a 71 kg. Plantea cuánto pesa', { sol: ['10', '*', '71', '-', '9', '*', '70'], traps: ['1'], answer: 80, unit: 'kg' },
        'Antes sumaban $9 \\cdot 70 = 630$; ahora $10 \\cdot 71 = 710$. La nueva persona pesa la diferencia: 80 kg.',
        'Calcula cuánto suman los pesos antes y después de que entre.'),
      PU_CTA('Tres parciales valen 30 %, 30 % y 40 %, con notas 3.0, 4.0 y 4.5. Plantea la nota final', { sol: ['0.3', '*', '3', '+', '0.3', '*', '4', '+', '0.4', '*', '4.5'], traps: ['3.8'], answer: 3.9 },
        '$0.3 \\cdot 3 + 0.3 \\cdot 4 + 0.4 \\cdot 4.5 = 0.9 + 1.2 + 1.8 = 3.9$.',
        'Cada nota se multiplica por su peso en decimal y luego se suman.'),
    ]),
    PU_L('pu-ar-3', 'Criptoaritmética', [
      sc(6, 'En una criptoaritmética cada letra es una cifra y letras distintas son cifras distintas.', { title: 'Letras por cifras' }),
      sc(6, 'Un número de dos cifras XY vale $10X + Y$. Así, $XY + YX = 11(X + Y)$.', { title: '$\\overline{XY} = 10X + Y$' }),
      sc(6, 'Se empieza por la columna con más información, casi siempre la de las llevadas.', { title: 'Empezar por la columna clave' }),
    ], [
      PU_ES('AB + BA = 165, con A − B = 3. Halla A y B', [['10A + B + 10B + A = 11(A + B)', '10A + B + 10B + A = 10(A + B)'], ['A + B = 15', 'A + B = 16'], ['A = 9 y B = 6', 'A = 8 y B = 7']],
        '$11(A + B) = 165$ da $A + B = 15$, y con $A - B = 3$: $A = 9$, $B = 6$. Comprobación: $96 + 69 = 165$.',
        'Escribe cada número de dos cifras como diez veces la primera más la segunda.'),
      PU_ES('Cada letra es una cifra distinta: E + E + E = AE (un número de dos cifras). Halla A y E', [['3E = 10A + E', '3E = A + E'], ['2E = 10A', 'E = 10A'], ['A = 1 y E = 5', 'A = 2 y E = 10']],
        '$3E = 10A + E$ da $E = 5A$; como E es una sola cifra, $A = 1$ y $E = 5$: $5 + 5 + 5 = 15$.',
        'AE es un número de dos cifras: escríbelo como $10A + E$.'),
    ]),
    PU_L('pu-ar-4', 'Máximos y mínimos', [
      sc(6, 'Para **asegurar** algo se piensa en el **peor caso**: lo que tendría que pasar para que todavía no se cumpla.', { title: 'El peor caso' }),
      sc(6, 'Si hay 3 colores de canicas, en el peor caso las 3 primeras son de colores distintos: con la cuarta seguro hay dos iguales.', { title: 'Colores + 1' }),
      sc(6, 'Para un máximo o un mínimo con condiciones, se prueba con los valores extremos permitidos.', { title: 'Probar los extremos' }),
    ], [
      PU_ES('Un cajón tiene 10 medias rojas y 10 azules, a oscuras. ¿Cuántas hay que sacar para asegurar dos del mismo color?', [['peor caso: una de cada color', 'peor caso: todas rojas'], ['2 + 1 = 3', '10 + 1 = 11']],
        'En el peor caso salen una roja y una azul; la tercera tiene que repetir color.',
        'Imagina la peor suerte posible: ¿cuántas puedes sacar sin tener todavía un par?'),
      PU_ES('En el mismo cajón, ¿cuántas hay que sacar para asegurar dos rojas?', [['peor caso: salen todas las azules', 'peor caso: una de cada color'], ['10 + 2 = 12', '2 + 1 = 3']],
        'En el peor caso salen las 10 azules primero; luego hacen falta 2 rojas: 12.',
        'Ahora no sirve cualquier par: piensa en todo lo que puede salir antes de la segunda roja.'),
    ]),
  ] },

  // ---------------- 13 · Ecuaciones ----------------
  { world: 'pu-ecuaciones', title: 'Ecuaciones y planteamiento', block: 'razonamiento', lessons: [
    PU_L('pu-ec-1', 'Del texto a la ecuación', [
      sc(6, 'Lo difícil no es resolver sino **plantear**: primero se decide qué es $x$ y se escribe con palabras.', { title: 'Decide qué es $x$' }),
      sc(7, '«El doble de un número, aumentado en 5» es $2x + 5$. «El doble de un número aumentado en 5» puede ser $2(x + 5)$: las comas importan.', { title: 'Cada palabra, una operación' }),
      sc(6, '«Un número excede a otro en 7» se escribe $x = y + 7$: el que excede es el mayor.', { title: 'Excede en' }),
    ], [
      PU_ORD('Encadena los pasos para «la suma de tres números consecutivos es 72»', '\\text{tres consecutivos suman 72}', ['x + (x + 1) + (x + 2) = 72', '3x + 3 = 72', '3x = 69', 'x = 23', '3x = 72', '3x = 75'], [0, 1, 2, 3], '⇒',
        'Los consecutivos son $x$, $x + 1$ y $x + 2$: $3x + 3 = 72$, $3x = 69$, $x = 23$. Son 23, 24 y 25.',
        'Si el primero es $x$, ¿cómo se escriben los dos que le siguen?'),
      PU_ES('«El triple de un número, disminuido en 4, es igual al doble del número, aumentado en 6.» Halla el número', [['3x − 4 = 2x + 6', '3(x − 4) = 2x + 6'], ['x = 10', 'x = 2']],
        'La coma dice que se resta 4 al triple: $3x - 4 = 2x + 6$, y $x = 10$.',
        'Fíjate en las comas: dicen a qué se le resta el 4 y a qué se le suma el 6.'),
    ]),
    PU_L('pu-ec-2', 'Edades, mezclas y monedas', [
      sc(6, 'En problemas de **edades** se hace una tabla de hoy y de dentro de $n$ años: todos envejecen lo mismo.', { title: 'Edades: todos suman lo mismo' }),
      sc(6, 'En **mezclas**: cantidad × precio de cada parte suma el valor de la mezcla. En **monedas**: número × valor.', { title: 'Mezclas y monedas' }),
      sc(7, 'Ejemplo: Sara tiene 4 años más que su hermano y entre los dos suman 20: $h + (h + 4) = 20$, así $h = 8$.', { title: 'Un ejemplo de edades' }),
    ], [
      PU_ES('Hoy Laura tiene el triple de la edad de su hijo; en 10 años tendrá el doble. Halla la edad del hijo hoy', [['L = 3h', 'L = h + 3'], ['3h + 10 = 2(h + 10)', '3h + 10 = 2h + 10'], ['h = 10', 'h = 20']],
        'En 10 años: $3h + 10 = 2(h + 10)$, así $3h + 10 = 2h + 20$ y $h = 10$. Laura tiene 30.',
        'Dentro de 10 años los dos tienen 10 años más: súmaselos a los dos.'),
      PU_ES('Se mezclan 6 kg de café de 20 000 $/kg con café de 30 000 $/kg para que la mezcla cueste 24 000 $/kg. ¿Cuántos kg del caro?', [['120 000 + 30 000x = 24 000(6 + x)', '20 000 + 30 000 = 24 000x'], ['6 000x = 24 000', '54 000x = 144 000'], ['x = 4 kg', 'x = 2.7 kg']],
        'Valor de las partes = valor de la mezcla: $120\\,000 + 30\\,000x = 144\\,000 + 24\\,000x$, así $6\\,000x = 24\\,000$ y $x = 4$.',
        'Cada parte aporta su cantidad por su precio, y la mezcla pesa la suma de las dos cantidades.'),
    ]),
    PU_L('pu-ec-3', 'Sistemas y desigualdades', [
      sc(6, 'Dos incógnitas necesitan dos datos. Sumando o restando las ecuaciones se elimina una.', { title: 'Dos datos, dos incógnitas' }),
      sc(6, 'Ejemplo: $x + y = 10$ y $x - y = 2$. Sumando, $2x = 12$: $x = 6$ y $y = 4$.', { title: 'Eliminar sumando' }),
      sc(6, 'Las desigualdades se despejan como ecuaciones, pero al multiplicar o dividir por un **negativo** el signo se voltea.', { title: 'El signo se voltea' }),
    ], [
      PU_ES('En un parqueadero hay 20 vehículos entre carros y motos, y en total 64 ruedas. ¿Cuántos carros hay?', [['c + m = 20 y 4c + 2m = 64', 'c + m = 64 y 4c + 2m = 20'], ['quitando el doble de la primera: 2c = 24', '4c = 44'], ['12 carros y 8 motos', '8 carros y 12 motos']],
        'Al restar $2(c + m) = 40$ de $4c + 2m = 64$ queda $2c = 24$: 12 carros y 8 motos ($48 + 16 = 64$ ruedas).',
        'Una ecuación cuenta vehículos y la otra cuenta ruedas.'),
      PU_ES('Resuelve $5 - 2x > 11$', [['−2x > 6', '−2x > 16'], ['x < −3', 'x > −3']],
        'Restando 5: $-2x > 6$. Al dividir entre $-2$ el signo se voltea: $x < -3$.',
        'Pasa el 5 al otro lado y fíjate en el signo del número que acompaña a $x$.'),
    ]),
  ] },

  // ---------------- 14 · Conjuntos ----------------
  { world: 'pu-conjuntos', title: 'Conjuntos', block: 'razonamiento', lessons: [
    PU_L('pu-cj-1', 'Operaciones y Venn', [
      sc(6, '**Unión**: lo que está en alguno. **Intersección**: lo que está en los dos. **Diferencia** $A - B$: lo de A que no está en B. **Complemento**: lo que no está.', { title: '∪ · ∩ · − · complemento' }),
      sc(6, 'Un diagrama de Venn de dos conjuntos tiene 4 zonas; el de tres, 8.', { title: 'Zonas del diagrama' }),
      sc(6, 'Con tres conjuntos se llena **desde el centro hacia afuera**: primero lo que está en los tres, luego lo de dos y al final lo de uno solo.', { title: 'Del centro hacia afuera' }),
    ], [
      PU_ES('$U = \\{1, \\dots, 10\\}$, A = los pares y B = los múltiplos de 3. Halla $A - B$', [['A = {2, 4, 6, 8, 10}', 'A = {1, 3, 5, 7, 9}'], ['A ∩ B = {6}', 'A ∩ B = {3, 6, 9}'], ['A − B = {2, 4, 8, 10}', 'A − B = {2, 4, 6, 8, 10}']],
        'Los pares que también son múltiplos de 3 solo son el 6; quitándolo queda $\\{2, 4, 8, 10\\}$.',
        'A − B son los elementos de A que no están en B: busca cuáles de A también están en B.'),
      PU_ES('15 personas hablan inglés; 7 inglés y francés, 5 inglés y alemán, y 3 los tres. ¿Cuántas hablan solo inglés?', [['centro: 3', 'centro: 7'], ['solo I y F: 4; solo I y A: 2', 'solo I y F: 7; solo I y A: 5'], ['solo inglés: 15 − 9 = 6', 'solo inglés: 15 − 12 = 3']],
        'Los 7 de inglés y francés incluyen a los 3 del centro: quedan 4. Igual, $5 - 3 = 2$. Solo inglés: $15 - 3 - 4 - 2 = 6$.',
        'Llena primero la zona de los tres idiomas; los demás datos ya la incluyen.'),
    ]),
    PU_L('pu-cj-2', 'Encuestas', [
      sc(6, 'En las encuestas, la intersección se cuenta dos veces si se suman los dos grupos: hay que restarla una vez.', { title: '$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$' }),
      sc(6, 'Los que no están en ningún grupo son el total menos la unión.', { title: 'Ninguno = total − unión' }),
      sc(6, '«Solo A» es A menos la intersección. Llenar el diagrama con esos números deja ver todo.', { title: 'Solo A' }),
    ], [
      play('encuesta-venn', 'Llena el diagrama de la encuesta', { rounds: [{ text: 'De 50 personas, 30 ven fútbol, 22 ven tenis y 10 ven los dos deportes.', labels: ['Fútbol', 'Tenis'], total: 50, a: 30, b: 22, both: 10 }] },
        'Solo fútbol: $30 - 10 = 20$; los dos: 10; solo tenis: $22 - 10 = 12$; ninguno: $50 - 42 = 8$.',
        { hint: 'Empieza por la zona de los dos deportes; luego réstala de cada grupo.' }),
      PU_CTA('En un salón de 40, 25 aprobaron Matemáticas, 20 Lenguaje y 8 reprobaron las dos. Plantea cuántos aprobaron las dos', { sol: ['25', '+', '20', '-', '(', '40', '-', '8', ')'], traps: ['5'], answer: 13 },
        'Aprobaron alguna $40 - 8 = 32$. Sumando $25 + 20 = 45$ se cuentan dos veces los de ambas: $45 - 32 = 13$.',
        'Halla primero cuántos aprobaron al menos una materia.'),
    ]),
  ] },

  // ---------------- 15 · Teoría de números ----------------
  { world: 'pu-numeros', title: 'Teoría de números', block: 'razonamiento', lessons: [
    PU_L('pu-nu-1', 'Primos y divisibilidad', [
      sc(6, 'Un **primo** tiene exactamente dos divisores. Todo número se escribe como producto de primos: $360 = 2^3 \\cdot 3^2 \\cdot 5$.', { title: '$360 = 2^3 \\cdot 3^2 \\cdot 5$' }),
      sc(7, 'Criterios: por 3 o por 9, la suma de cifras; por 4, las dos últimas cifras; por 11, que la suma alternada de cifras sea múltiplo de 11; por 6, por 2 y por 3 a la vez.', { title: 'Criterios de divisibilidad' }),
      sc(6, 'La cantidad de divisores sale de los exponentes: con $2^3 \\cdot 5$ hay $(3 + 1)(1 + 1) = 8$.', { title: 'Contar divisores' }),
    ], [
      PU_ES('¿Es 2 574 divisible por 6?', [['es par: divisible por 2', 'termina en 4: no es par'], ['2 + 5 + 7 + 4 = 18: divisible por 3', 'suma 18: no es divisible por 3'], ['divisible por 6', 'no es divisible por 6']],
        'Es par y sus cifras suman 18, múltiplo de 3: es divisible por 2 y por 3, así que por 6.',
        'Un número es múltiplo de 6 cuando es múltiplo de 2 y de 3 a la vez.'),
      PU_ES('¿Cuántos divisores tiene 72?', [['72 = 2³ · 3²', '72 = 2⁴ · 3'], ['(3 + 1)(2 + 1)', '3 · 2'], ['12 divisores', '6 divisores']],
        '$72 = 8 \\cdot 9 = 2^3 \\cdot 3^2$: $(3 + 1)(2 + 1) = 12$ divisores.',
        'Descompón en primos y suma uno a cada exponente antes de multiplicar.'),
    ]),
    PU_L('pu-nu-2', 'MCM y MCD', [
      sc(6, '**MCM**: cuándo vuelven a coincidir dos cosas que se repiten. Buses cada 12 y 18 minutos coinciden cada 36.', { title: 'MCM: coincidir' }),
      sc(6, '**MCD**: el tamaño más grande para partir en trozos iguales sin que sobre nada.', { title: 'MCD: partir igual' }),
      sc(6, 'Con primos: el MCM toma todos los factores con su mayor exponente; el MCD, los comunes con el menor.', { title: 'Por factores primos' }),
    ], [
      PU_ES('Dos faros se encienden cada 15 y cada 20 segundos y acaban de encenderse juntos. ¿Cuándo vuelven a coincidir?', [['15 = 3 · 5 y 20 = 2² · 5', '15 = 3 · 5 y 20 = 2 · 5'], ['MCM = 2² · 3 · 5', 'MCM = 5'], ['a los 60 segundos', 'a los 300 segundos']],
        'El MCM toma $2^2$, $3$ y $5$: 60 segundos. $15 \\cdot 20 = 300$ también es común, pero no es el primero.',
        'Buscas el primer momento que sea múltiplo de los dos tiempos.'),
      PU_ES('Dos cintas de 84 y 120 cm se cortan en trozos iguales, lo más largos posible, sin sobrantes. ¿Cuántos trozos salen?', [['se busca el MCD', 'se busca el MCM'], ['MCD = 12 cm', 'MCD = 6 cm'], ['7 + 10 = 17 trozos', '84 + 120 = 204 trozos']],
        '$84 = 2^2 \\cdot 3 \\cdot 7$ y $120 = 2^3 \\cdot 3 \\cdot 5$: MCD $= 12$. Salen $7 + 10 = 17$ trozos.',
        'El trozo debe caber exacto en las dos cintas y ser lo más largo posible.'),
    ]),
    PU_L('pu-nu-3', 'Paridad, residuos y última cifra', [
      sc(6, 'Par + par = par, impar + impar = par, impar · impar = impar. Basta un factor par para que el producto sea par.', { title: 'Paridad' }),
      sc(6, 'Los residuos se pueden sumar y multiplicar: el residuo de un producto es el producto de los residuos (y se vuelve a reducir).', { title: 'Residuos' }),
      sc(7, 'La última cifra de las potencias se repite: $7^1, 7^2, 7^3, 7^4$ terminan en 7, 9, 3, 1, y vuelve a empezar. $7^{10}$ termina igual que $7^2$: en 9.', { title: 'Ciclo de la última cifra' }),
    ], [
      PU_ES('¿En qué cifra termina $3^{2026}$?', [['3, 9, 7, 1: ciclo de 4', 'ciclo de 3'], ['2026 ÷ 4 deja residuo 2', '2026 ÷ 4 deja residuo 0'], ['termina en 9', 'termina en 1']],
        'Las potencias de 3 terminan en 3, 9, 7, 1 y se repiten. 2026 deja residuo 2: termina como $3^2$, en 9.',
        'Calcula las últimas cifras de las primeras potencias de 3 hasta que se repitan.'),
      PU_ES('Si $n$ es impar, ¿qué es siempre par?', [['n + 1', 'n + 2'], ['n(n + 1)', 'n²']],
        'Impar más 1 es par; y $n(n + 1)$ tiene un factor par. $n + 2$ y $n^2$ son impares.',
        'Prueba con $n = 3$ y con $n = 5$ antes de decidir.'),
    ]),
  ] },

  // ---------------- 16 · Probabilidad ----------------
  { world: 'pu-probabilidad', title: 'Probabilidad', block: 'razonamiento', lessons: [
    PU_L('pu-pb-1', 'Espacio muestral y Laplace', [
      sc(6, 'El **espacio muestral** son todos los resultados posibles. Si son igualmente probables, $P = \\tfrac{\\text{favorables}}{\\text{posibles}}$.', { title: 'Regla de Laplace' }),
      sc(7, 'Con dos dados hay $6 \\cdot 6 = 36$ resultados. Suman 7 en seis: (1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1). $P = \\tfrac{6}{36} = \\tfrac16$.', { title: 'Dos dados' }),
      sc(6, 'Una probabilidad está entre 0 (imposible) y 1 (seguro).', { title: 'Entre 0 y 1' }),
    ], [
      PU_CTA('Una urna tiene 4 bolas rojas, 5 azules y 3 verdes. Plantea la probabilidad de sacar una azul', { sol: ['5', '/', '(', '4', '+', '5', '+', '3', ')'], traps: ['9'], answer: 5 / 12 },
        'Hay 12 bolas y 5 son azules: $P = \\tfrac{5}{12} \\approx 0.42$.',
        'Cuenta todas las bolas posibles y cuántas de ellas son favorables.'),
      PU_ES('Se lanzan dos monedas. Halla la probabilidad de obtener al menos una cara', [['4 casos iguales: CC, CS, SC, SS', '3 casos iguales: 2, 1 o 0 caras'], ['favorables: 3', 'favorables: 2'], ['P = 3/4', 'P = 2/3']],
        'Los cuatro resultados son igual de probables; tres tienen al menos una cara: $\\tfrac34$.',
        '«Una cara» puede salir de dos maneras distintas: cuenta los resultados de cada moneda por separado.'),
    ]),
    PU_L('pu-pb-2', 'Complemento e independencia', [
      sc(6, 'La probabilidad de que algo **no** pase es $1 - P$. «Al menos uno» se calcula como $1 - P(\\text{ninguno})$.', { title: 'Complemento' }),
      sc(6, 'Si dos sucesos son **independientes**, la probabilidad de que pasen los dos es el producto: dos caras seguidas, $\\tfrac12 \\cdot \\tfrac12 = \\tfrac14$.', { title: 'Independientes: se multiplican' }),
      sc(6, 'Cuidado: sumar probabilidades solo vale si los sucesos no pueden pasar a la vez.', { title: 'Cuándo se suma' }),
    ], [
      PU_CTA('Plantea la probabilidad de sacar al menos un 6 al lanzar un dado dos veces', { sol: ['1', '-', '(', '5', '/', '6', ')', '^', '2'], traps: ['36'], answer: 11 / 36 },
        'Ningún 6 en dos lanzamientos: $\\left(\\tfrac56\\right)^2 = \\tfrac{25}{36}$. Al menos uno: $1 - \\tfrac{25}{36} = \\tfrac{11}{36}$.',
        'Es más fácil calcular la probabilidad de que no salga ningún 6.'),
      PU_ES('Un examen tiene 2 preguntas de 4 opciones y se responde al azar. Halla la probabilidad de acertar las dos', [['acertar una: 1/4', 'acertar una: 1/2'], ['son independientes: se multiplican', 'se suman'], ['1/16', '1/2']],
        'Cada pregunta se acierta con $\\tfrac14$ y son independientes: $\\tfrac14 \\cdot \\tfrac14 = \\tfrac1{16}$.',
        'Acertar la primera no cambia las opciones de la segunda.'),
    ]),
  ] },
];

// Constructores de los juegos de cada mundo (preuda-r-*.js); los aplica preuda-razonamiento-juegos.js.
const PU_JUEGOS = [];
