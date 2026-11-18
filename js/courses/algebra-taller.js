// Práctica final del curso. Los id de las lecciones, el progreso y los medios se conservan.
(() => {
  const algebra = COURSE_ALGEBRA.units.flatMap(u => u.lessons);
  const lessons = new Map(algebra.map(l => [l.id, l]));
  const tex = s => '$' + s + '$';
  const n = x => +x.toFixed(5);
  const grid = (size, fn) => Array.from({ length: size }, (_, i) => fn(i));
  const pick = (size, fn) => grid(size, i => i).filter(fn);
  const xy = v => tex('(' + v.join(',') + ')');
  const line = (a, b) => x => a * x + b;
  const par = (a, h, k) => x => a * (x - h) ** 2 + k;
  const format = (v, symbol = 'x') => tex(symbol + '=' + n(v));
  const lab = (mode, q, r, hint, explain, motion = false) => play('taller-' + mode, q,
    { rounds: [r], ...(motion ? { motion: true } : {}) },
    explain || hint + ' ' + (r.solution || r.read(r.goal)), { hint, canvasGuide: true, ...(motion ? { motion: true } : {}) });
  const rail = (q, [lo, hi, start, goal, step], read, hint, more = {}) =>
    lab(more.loads ? 'balanza' : 'barra', q, { lo, hi, start, goal, step, read, ...more }, hint, more.explain, more.motion);
  const rect = (q, max, goal, hint, { start = [1, 2], read = ([a, b]) => tex(`${a}\\cdot ${b}=${a * b}`), valid, explain } = {}) =>
    lab('area', q, { max, start, goal, read, valid }, hint, explain);
  const point = (q, bounds, start, goal, curves, hint, more = {}) =>
    lab('plano', q, { bounds, start, goal, curves, read: xy, ...more }, hint, more.explain, more.motion);
  const probe = (q, bounds, start, goal, fn, hint, more = {}) => lab('sonda', q,
    { bounds, start, goal, curves: [fn, ...(more.other || [])],
      read: x => Number.isFinite(fn(x)) ? tex(`f(${x})=${n(fn(x))}`) : `Sin valor en ${x}`,
      ...more }, hint, more.explain, more.motion);
  const dial = (q, values, goal, read, hint, more = {}) =>
    lab('giro', q, { values, goal, start: more.start ?? 0, read: i => read(values[i], i), ...more }, hint, more.explain, more.motion);
  const tiles = (q, cols, values, goal, hint, more = {}) => lab('mosaico', q,
    { tiles: values, cols, start: [], goal, read: v => 'Celdas pintadas · ' + v.length, ...more }, hint, more.explain);
  const groups = (q, regions, values, goal, hint, more = {}) => lab('membrana', q,
    { regions, tiles: values, start: values.map(() => -1), goal,
      read: v => regions.map((label, i) => label + ' ' + v.filter(x => x === i).length).join('  ·  '),
      solution: regions.map((label, i) => label + ' → ' + values.filter((_, j) => goal[j] === i).join(', ')).join(' · '),
      ...more }, hint, more.explain, more.motion);
  const bridges = (q, fractions, den, cards, goal, hint, explain) => lab('puentes', q,
    { fractions: fractions.map(([a, b]) => tex('\\frac{' + a + '}{' + b + '}')), tiles: cards.map(tex), start: [-1, -1], goal,
      read: v => tex(v.map((j, i) => j < 0 ? den[i] : '(' + den[i] + ')(' + cards[j] + ')').join('\\quad | \\quad')),
      solution: explain }, hint, explain);
  function route(q, labels, goal, hint, more = {}) {
    const nodes = [[.5, .07, labels[0]], [.22, .38, labels[1]], [.78, .38, labels[2]],
      [.22, .68, labels[3]], [.78, .68, labels[4]], [.5, .94, labels[5]]];
    const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 5], [4, 5]];
    const read = v => v.map(i => labels[i]).join(' → ');
    return lab('trazo', q, { nodes, edges, start: [0], goal: [0, ...goal, 5], minLength: 4, read, ...more }, hint, more.explain, more.motion);
  }
  function tune(id, keep, additions, close) {
    const l = lessons.get(id), previous = l.ex;
    const selected = keep.map(g => {
      const e = previous.find(e => e.game === g);
      if (!e) throw new Error(id + ' no contiene el juego ' + g);
      return { ...e, canvasGuide: true };
    });
    const ending = close || previous.at(-1);
    l.ex = [...selected, ...additions, { ...ending, canvasGuide: true, motion: true }];
  }

  // Teoría de Conjuntos
  tune('alg-0a', ['cumple-notacion', 'tacha-repetidos', 'atrapa-elementos'], [
    groups('Separa las letras de SOL del resto del universo.', ['En SOL', 'Fuera'], ['S', 'M', 'O', 'L', 'R'], [0, 1, 0, 0, 1], 'Cada letra cuenta una vez. Busca las que puedes señalar en SOL.', { explain: 'El conjunto de letras de SOL es $\\{S,O,L\\}$. M y R quedan fuera.' }),
    tiles('Pinta todas las palabras que terminan en «a».', 3, ['mesa', 'sol', 'nube', 'silla', 'papel', 'tiza'], [0, 3, 5], 'Comprueba la última letra de cada palabra.', { read: v => 'Elementos elegidos · ' + v.length, explain: 'Mesa, silla y tiza comparten la propiedad de terminar en «a».' }),
    rail('Ajusta la cardinalidad del conjunto de letras de ARENA.', [0, 7, 1, 4], v => tex('n(A)=' + v), 'Las dos apariciones de A representan el mismo elemento.', { input: v => v + ' elementos', bars: v => [['Letras distintas', v]], explain: '$A=\\{A,R,E,N\\}$ contiene cuatro elementos.' }),
  ]);
  tune('alg-0b', ['arma-conjunto', 'mueve-circulos', 'cubo-partes'], [
    groups('Construye dos conjuntos disjuntos. Pon las vocales en A y las consonantes en B.', ['A', 'B'], ['A', 'R', 'U', 'S', 'I', 'T'], [0, 1, 0, 1, 0, 1], 'Si los conjuntos son disjuntos, ningún elemento puede pertenecer a ambos.', { explain: '$A\\cap B=\\varnothing$. Ninguna letra de A está en B.' }),
    tiles('Pinta dos elementos del conjunto $B=\\{A,C,E\\}$.', 3, ['A', 'b', 'C', 'd', 'E', 'f'], [0, 2], 'Elige dos de las letras mayúsculas. Cualquier pareja de ellas sirve.', { valid: v => v.length === 2 && v.every(i => i % 2 === 0), explain: 'Cualquier pareja tomada de $B=\\{A,C,E\\}$ es un subconjunto de dos elementos.' }),
    rail('Cuenta los subconjuntos de un conjunto con tres elementos, incluido el vacío.', [0, 12, 3, 8], v => tex('n(\\mathcal P(A))=' + v), 'Haz dos elecciones por elemento: incluirlo o dejarlo fuera.', { bars: v => [['Subconjuntos', v]], explain: 'Hay $2^3=8$ combinaciones de incluir o excluir elementos.' }),
  ]);
  tune('alg-0c', ['reparte-venn', 'pinta-venn', 'encuesta-venn'], [
    tiles('Pinta la intersección. M marca múltiplos de 2 y T marca múltiplos de 3.', 4,
      ['2M', '3T', '4M', '6MT', '7', '8M', '9T', '12MT'], [3, 7], 'La intersección conserva cada elemento que cumple las dos condiciones.', { explain: 'Los únicos números que pertenecen a las dos familias de la escena son 6 y 12.' }),
    groups('Construye A menos B. A contiene las letras de CASTOR y B las de CARTA.', ['$A-B$', 'Resto'], ['A', 'S', 'T', 'O', 'R', 'C'], [1, 0, 1, 0, 1, 1], 'Parte de las letras de CASTOR y retira las que también se usan en CARTA.', { explain: '$A-B=\\{S,O\\}$.' }),
    rail('Entre 18 personas, 10 usan bus, 11 usan metro y 6 usan ambos. Ajusta cuántas usan al menos uno.', [0, 18, 7, 15], v => tex('n(B\\cup M)=' + v), 'Entre las dos listas, las seis personas en común aparecen dos veces.', { bars: v => [['Al menos uno', v], ['Ninguno', 18 - v]], explain: '$10+11-6=15$ personas usan al menos uno. Tres no usan ninguno.' }),
  ]);

  // La Recta Real
  tune('alg-11', ['ascensor', 'recta-espejo', 'fuga-de-familia'], [
    point('Marca en el eje horizontal dónde terminas después de avanzar 4 desde −7.', [-8, 8, -2, 2], [0, 0], [-3, 0], [], 'Cada avance es un paso hacia la derecha. Conserva la altura cero.', { explain: '$-7+4=-3$.' }),
    groups('Distribuye los enteros según queden antes o después de cero.', ['Negativos', 'Cero', 'Positivos'], ['$-7$', '$0$', '$4$', '$-3$', '$9$'], [0, 1, 2, 0, 2], 'Usa la posición respecto del cero. El cero queda en su propia región.'),
    rail('Eleva una sonda que parte de la cota −9 hasta la cota 2.', [0, 15, 3, 11], v => tex('(-9)+' + v + '=' + (v - 9)),
      'Cuenta los pasos hasta la cota cero y luego añade los que faltan.', { bars: v => [['Distancia al cero', 9], ['Tramo recorrido', v]] }),
  ]);
  tune('alg-11b', ['pizzeria', 'candado-fraccion', 'pon-la-rayita', 'fuga-de-familia'], [
    tiles('Cubre con un color exactamente tres octavos del tablero.', 4, grid(8, () => ''), [0, 1, 2], 'El tablero tiene ocho partes del mismo tamaño. El numerador cuenta las que se cubren.', { valid: v => v.length === 3, read: v => tex('\\frac{' + v.length + '}{8}'), explain: 'Tres celdas de ocho representan $\\tfrac38$ sin importar su ubicación.' }),
    rect('Construye 18 casillas organizadas en 3 filas iguales.', [9, 6], [6, 3], 'Reparte las 18 unidades entre las tres filas. Cada fila es un tercio del total.', { read: ([a, b]) => tex(a + '\\cdot' + b + '=' + (a * b)) }),
    point('Pon el punto en el eje horizontal donde están $\\tfrac54$ y 1.25.', [0, 2, -1, 1], [.25, 0], [1.25, 0], [], 'Completa primero una unidad de cuatro cuartos. Mira cuánto sobra.', { dx: .25, explain: '$\\tfrac54=1+\\tfrac14=1.25$.' }),
  ]);
  tune('alg-11c', ['cajas-numericas', 'lupa-densidad', 'ubica-en-recta', 'compas-raiz', 'acorrala-raiz'], [
    dial('Gira hasta una marca situada entre $\\sqrt{19}$ y $\\sqrt{27}$.', [3, 4, 5, 6, 7, 8], 2, v => tex(v + '^2=' + v * v), 'Eleva al cuadrado las marcas positivas para compararlas con 19 y 27.', { explain: '$19<25<27$, de modo que $5$ queda entre las dos raíces.' }),
    point('Busca en el eje horizontal un racional estrictamente entre 1.41 y 1.42.', [1.405, 1.425, -1, 1], [1.405, 0], [1.415, 0], [], 'Mira las milésimas que hay entre las dos centésimas dadas.', { dx: .001, valid: ([x, y]) => y === 0 && x > 1.41 && x < 1.42, explain: '$1.415$ es una de varias opciones racionales dentro del intervalo.' }),
  ]);
  tune('alg-12b', ['corta-rectangulo', 'inversos-gemelos'], [
    rect('Reagrupa el área de $4(2+3)$ en dos filas iguales.', [10, 6], [10, 2], 'La distributiva conserva las 20 unidades de área. Cambia la forma sin cambiar la cantidad.'),
    rail('Iguala $4(3+x)$ con 32.', [0, 9, 2, 5], x => tex('4(3+' + x + ')=' + (4 * (3 + x))), 'Divide 32 entre los cuatro grupos y mira qué parte de cada grupo ya está fija.', { loads: x => [4 * (3 + x), 32] }),
    tiles('Pinta el rectángulo de 3 filas que forman las columnas B, C y D.', 5, grid(15, i => 'ABCDE'[i % 5]), [1, 2, 3, 6, 7, 8, 11, 12, 13], 'El área de cada columna suma lo mismo. Tres columnas por tres filas forman nueve celdas.', { read: v => tex('A=' + v.length), explain: 'Puedes repartir el cálculo como $3(1+2)=3+6=9$.' }),
    route('Desde 1, recorre las estaciones aplicando primero ×4 y después +3.', ['1', '4', '5', '7', '8', 'fin'], [1, 3], 'Multiplica primero lo que hay en la estación de salida. Suma después.'),
  ], probe('Lleva la sonda al valor que deja $3x+12$ en cero y suéltala.', [-7, 6, -10, 32], 1, -4, line(3, 12), 'Busca el opuesto aditivo de 12 antes de dividir entre 3.', { motion: true }));
  tune('alg-12c', ['arma-producto', 'cancela-balanza'], [
    rail('Mueve el contrapeso hasta que $(-3)x$ sea 18.', [-8, 8, 2, -6], x => tex('(-3)(' + x + ')=' + (-3 * x)), 'Con un factor negativo, ¿qué signo necesita el otro para que el producto sea positivo?', { loads: x => [-3 * x, 18] }),
    point('Representa en el eje horizontal el resultado de $-3-(-5)$.', [-7, 7, -3, 3], [0, 0], [2, 0], [], 'Restar un negativo equivale a sumar su opuesto.'),
    tiles('Pinta los productos de signo negativo.', 3, ['$(-2)(-5)$', '$3(-4)$', '$(-7)2$', '$2(6)$', '$0(-4)$', '$(-6)(-1)$'], [1, 2], 'Un producto de dos factores distintos de cero es negativo cuando exactamente uno de ellos lo es.', { explain: 'Los productos negativos son $3(-4)$ y $(-7)2$.' }),
    groups('Lleva cada cociente a la región de su signo.', ['$+$', '$-$'], ['$8/2$', '$-6/3$', '$-9/-3$', '$9/-3$'], [0, 1, 0, 1], 'Los signos iguales dan cociente positivo. Los distintos dan negativo.'),
  ], route('Traza la ruta que aplica ×(−2) dos veces desde 3. Suelta para recorrerla.', ['3', '6', '$-6$', '$-12$', '12', 'fin'], [2, 4], 'Cada multiplicación por un negativo invierte el signo.', { motion: true, explain: '$3\\to -6\\to12$.' }));
  tune('alg-12d', ['tren-ordenado', 'dobla-la-recta', 'distancia-justa', 'dibuja-intervalo'], [
    point('En el eje horizontal, marca el punto a cuatro unidades de −2 que queda a su izquierda.', [-8, 8, -2, 2], [0, 0], [-6, 0], [], 'La distancia admite dos direcciones. La consigna fija la que necesitas.', { marks: [[-2, 0]], explain: '$|-6-(-2)|=4$ y $-6<-2$.' }),
    rail('Iguala la distancia de $x$ a 3 con la distancia de $x$ a −5.', [-8, 8, 2, -1], x => tex('|' + x + '-3|=' + Math.abs(x - 3) + '\\quad |' + x + '+5|=' + Math.abs(x + 5)), 'El punto medio de dos marcas queda a la misma distancia de ambas.', { loads: x => [Math.abs(x - 3), Math.abs(x + 5)] }),
  ]);

  // Escalas y Proporciones
  tune('alg-12', ['limonada', 'estira-foto'], [
    rect('Haz un panel de 12 celdas cuyo ancho sea tres veces su alto.', [10, 5], [6, 2], 'Si cada fila es tres veces el alto, prueba con alturas pequeñas y compara las áreas.', { read: ([a, b]) => tex(a + ':' + b + '\\qquad A=' + a * b) }),
    tiles('Pinta exactamente dos celdas por cada tres que dejes sin pintar.', 5, grid(10, () => ''), [0, 1, 2, 3], 'Una copia de la razón ocupa cinco celdas. El tablero admite dos copias.', { valid: v => v.length === 4, read: v => tex(v.length + ':' + (10 - v.length)), explain: '$4:6$ y $2:3$ representan la misma razón.' }),
    point('Coloca en el plano una mezcla de 9 vasos con razón limón a agua de 1:2. El eje horizontal mide limón.', [0, 9, 0, 9], [1, 2], [3, 6], [line(2, 0)], 'Cada grupo completo tiene un vaso de limón y dos de agua.', { read: ([x, y]) => tex(x + ':' + y + '\\qquad ' + x + '+' + y + '=' + (x + y)) }),
    rail('Ajusta el número de tandas para servir 20 porciones, con 5 por tanda.', [0, 8, 1, 4], x => tex('5\\cdot' + x + '=' + 5 * x), 'Cada tanda añade el mismo volumen.', { bars: x => [['Porciones servidas', 5 * x]], scale: 40 }),
  ], dial('Ajusta el brazo de la válvula para servir 15 medidas en razón jarabe a agua de 2:3. Suelta para verter.', [0, 1, 2, 3, 4, 5], 3,
    k => tex(2 * k + ':' + 3 * k + '\\qquad V=' + 5 * k), 'Una vuelta a otra marca selecciona cuántos lotes de cinco medidas sirves.', { motion: true }));
  tune('alg-12e', ['balanza-proporcion', 'sombra-arbol', 'cuadrado-media', 'duplica-magnitud', 'grafica-relacion', 'reparto'], [],
    lab('fraccion', 'Ajusta la segunda cinta hasta representar la misma fracción que la primera.',
      { parts: 5, filled: 3, lo: 0, hi: 10, start: 2, goal: 6, read: v => tex('\\frac35\\qquad\\frac{' + v + '}{10}') },
      'Cada quinto ocupa exactamente dos décimos. Compara las dos longitudes.', '$\\frac35=\\frac6{10}$.', true));
  tune('alg-12f', ['arma-regla', 'bascula', 'la-obra', 'engranajes'], [
    probe('Tres bombas llenan un tanque en 20 minutos. Sitúa la sonda en cinco bombas para leer el tiempo.', [1, 8, 0, 30], 3, 5, x => 60 / x,
      'Duplica el número de bombas y el tiempo se reduce a la mitad. El producto se conserva.',
      { read: x => tex('t=' + (60 % x ? '\\frac{60}{' + x + '}' : 60 / x) + '\\ \\mathrm{min}'), explain: 'Con cinco bombas tarda $60/5=12$ minutos.' }),
    rect('Ocho personas hacen un trabajo en seis turnos. Organiza la misma carga en cuatro turnos.', [14, 8], [12, 4], 'Conserva las 48 unidades persona-turno. Déjalas en cuatro filas.', { explain: 'Se necesitan $48/4=12$ personas a ese ritmo.' }),
  ]);
  tune('alg-13', ['cuadricula-cien', 'rueda-porcentaje', 'cruz-porcentaje', 'mezcla'], [
    rect('Forma 20 casillas en 5 filas. La primera fila será exactamente el 20 % del rectángulo.', [8, 7], [4, 5], 'Cinco filas iguales hacen que cada fila sea la quinta parte.', { read: ([x, y]) => tex(x + '\\cdot' + y + '=' + x * y + '\\qquad \\frac{1}{' + y + '}') }),
    point('Marca la compra de 80 mil pesos con un ahorro del 30 %. El eje horizontal es el precio, el vertical es el ahorro.', [0, 100, 0, 40], [20, 6], [80, 24], [line(.3, 0)], 'Por cada diez mil pesos de precio ahorras tres mil.', { dx: 10, dy: 1 }),
  ], rail('Desliza la banda del precio para cobrar el 35 % de $80 mil. Suelta para aplicar el cobro.', [0, 100, 15, 35, 5],
    p => tex('\\frac{' + p + '}{100}\\cdot 80=' + n(.8 * p)), 'El precio completo representa el 100 %. Busca qué parte del total te piden cobrar.',
    { input: p => p + ' %', bars: p => [['Precio completo', 80], ['Cobro · ' + n(.8 * p) + ' mil', .8 * p]], scale: 80, motion: true }));
  tune('alg-13c', ['estira-barra', 'etiqueta-rebaja', 'bodegas'], [
    rail('Halla el descuento para que 150 mil pesos se conviertan en 120 mil.', [0, 50, 10, 20, 5], p => tex('150(1-' + p + '/100)=' + n(150 * (1 - p / 100))), 'Compara el ahorro con los 150 mil iniciales.', { input: p => p + ' %', bars: p => [['Antes', 150], ['Después', 150 * (1 - p / 100)]], scale: 150 }),
    tiles('Un artículo pierde una cuarta parte de su valor. Pinta el valor que conserva.', 4, grid(12, () => ''), grid(9, i => i), 'El descuento ocupa una de cuatro partes iguales. Pinta las restantes.', { valid: v => v.length === 9, read: v => tex('100\\%\\cdot\\frac{' + v.length + '}{12}=' + n(v.length * 100 / 12) + '\\%'), explain: 'Conserva el 75 % del valor inicial.' }),
    point('Marca en la gráfica la pareja de precios antes y después de aumentar 25 % a 48 mil pesos.', [0, 80, 0, 100], [16, 20], [48, 60], [line(1.25, 0)], 'El precio original sigue allí y se suma una cuarta parte.', { dx: 4, dy: 5 }),
  ], lab('recibo', 'Recorta el precio de 72 mil para que vuelva a 60 mil.',
    { price: 72, lo: 0, hi: 12, start: 0, goal: 2, read: v => tex('72\\cdot\\frac{' + (12 - v) + '}{12}=' + (72 - 6 * v)) },
    'La rebaja se mide sobre 72. Cada división de la banda descuenta seis mil.',
    'La rebaja exacta es $\\tfrac16$ del precio vigente, es decir, $16\\tfrac23\\%$.', true));
  tune('alg-13d', ['cascada', 'mejor-oferta', 'rebote', 'dos-etapas'], [
    rail('Después de un aumento del 25 %, ajusta el descuento que devuelve un precio al valor inicial.', [0, 50, 10, 20, 5],
      p => tex('1.25(1-' + p + '/100)=' + n(1.25 * (1 - p / 100))), 'El descuento se aplica sobre un total mayor que el original.', { input: v => v + ' %', loads: v => [1.25 * (1 - v / 100), 1] }),
    point('Marca el par de precios de un artículo de 50 mil tras descuentos del 10 % y del 20 %.', [0, 70, 0, 70], [20, 14], [50, 36], [line(.72, 0)], 'Multiplica los factores de lo que queda: 90 % y 80 %.', { dx: 2, dy: 1 }),
  ], lab('cascada', 'Aplica a 100 mil una rebaja del 30 % y luego un aumento del 20 %.',
    { price: 100, start: [0, 0], goal: [-30, 20], read: ([a, b]) => tex('100(' + (1 + a / 100) + ')(' + (1 + b / 100) + ')=' + n(100 * (1 + a / 100) * (1 + b / 100))) },
    'El segundo porcentaje se calcula sobre el resultado de la primera etapa.', 'Primero quedan 70 mil. Al aumentar ese valor un 20 %, quedan 84 mil.', true));

  // Exponentes y Radicales
  tune('alg-21a', ['arbol-potencia', 'torre-producto', 'pares-negativos'], [
    rail('Ajusta el exponente de base 3 para producir 243.', [0, 6, 1, 5], x => tex('3^{' + x + '}=' + 3 ** x), 'Cada paso multiplica otra vez por 3.', { bars: x => [['Cantidad producida', 3 ** x]], scale: 3 ** 6 }),
    tiles('Identifica las potencias de base negativa que dan un valor positivo.', 3, ['$(-3)^2$', '$(-3)^3$', '$(-2)^4$', '$(-2)^5$', '$(-5)^6$', '$(-5)^7$'], [0, 2, 4], 'Agrupa los signos negativos en pares. Cuando sobra uno, el resultado queda negativo.', { explain: 'Los exponentes 2, 4 y 6 forman pares completos de signos.' }),
    dial('Gira al exponente que produce $\\tfrac{1}{8}$ con base 2.', [-4, -3, -2, -1, 0, 1], 1, v => tex('2^{' + v + '}=' + n(2 ** v)), 'Un exponente negativo da el recíproco de la potencia con exponente positivo.'),
  ]);
  tune('alg-21b', ['cuenta-factores', 'cambia-de-piso', 'salta-la-coma'], [
    rail('Ajusta el exponente de $2^x$ para que $2^5\\cdot 2^x=2^9$.', [-5, 7, 1, 4], x => tex('2^5\\cdot2^{' + x + '}=2^{' + (5 + x) + '}'), 'Al unir las dos cadenas se cuentan juntos todos los factores.'),
    rect('Representa los factores de $(a^4)^3$ como tres filas iguales de factores $a$.', [7, 6], [4, 3], 'Cada fila representa una copia completa de $a^4$.', { read: ([x, y]) => tex('(a^{' + x + '})^{' + y + '}=a^{' + x * y + '}') }),
    groups('Distribuye las potencias según el signo de su exponente tras simplificarlas.', ['Negativo', 'Cero', 'Positivo'], ['$a^2/a^5$', '$a^2a^3$', '$a^4/a^4$', '$(a^{-1})^3$'], [0, 2, 1, 0],
      'En un cociente de la misma base, elimina los factores que están en ambos lados.', { explain: 'Los exponentes finales son −3, 5, 0 y −3, respectivamente.' }),
  ], lab('factores', 'Simplifica $a^6/a^3$ arrastrando los factores de abajo sobre sus copias de arriba.',
    { top: 6, bottom: 3, factor: '$a$', start: 0, goal: 3,
      read: k => tex('\\frac{a^{' + (6 - k) + '}}{a^{' + (3 - k) + '}}' + (k === 3 ? '=a^3' : '')) },
    'Cada pareja cancelada reduce en uno los dos exponentes.', '$a^6/a^3=a^{6-3}=a^3$ para $a\\ne0$.', true));
  tune('alg-22a', ['lado-del-cuadrado', 'reparte-factores'], [
    rail('Mueve el lado del cuadrado hasta que su área sea 49.', [0, 10, 3, 7], x => tex(x + '^2=' + x * x), 'La raíz cuadrada principal mide una longitud y es no negativa.', { loads: x => [x * x, 49] }),
    groups('Agrupa los radicandos según si tienen raíz cuadrada entera.', ['Entera', 'No entera'], ['16', '18', '25', '27', '36', '38'], [0, 1, 0, 1, 0, 1], 'Busca los números que aparecen al cuadrar un entero.', { explain: '$16=4^2$, $25=5^2$ y $36=6^2$.' }),
    probe('Mueve la sonda de $x^3$ hasta la altura −27.', [-4, 4, -30, 30], 2, -3, x => x ** 3, 'Una potencia impar conserva el signo de la base.'),
    dial('Ajusta el exponente de 64 que equivale a sacar la raíz cúbica y luego elevar al cuadrado.', ['$0$', '$1/3$', '$1/2$', '$2/3$', '$3/2$', '$2$'], 3,
      (v, i) => tex('64^{' + ['0', '1/3', '1/2', '2/3', '3/2', '2'][i] + '}=' + n(64 ** [0, 1 / 3, 1 / 2, 2 / 3, 3 / 2, 2][i])), 'El índice de la raíz queda en el denominador y la potencia en el numerador.'),
  ]);
  tune('alg-22b', ['saca-del-radical', 'parte-baldosa', 'tabla-conjugado'], [
    groups('Agrupa las longitudes radicales por su parte irracional simplificada.', ['$\\sqrt2$', '$\\sqrt3$'],
      ['$\\sqrt8$', '$\\sqrt{12}$', '$\\sqrt{18}$', '$\\sqrt{27}$'], [0, 1, 0, 1], 'Separa primero un factor cuadrado perfecto de cada radicando.', { explain: '$2\\sqrt2,2\\sqrt3,3\\sqrt2,3\\sqrt3$.' }),
    rect('Construye una baldosa de área 24 con base cuadrada perfecta 4.', [8, 8], [4, 6], 'Extraer la raíz de 4 solo deja el otro factor dentro del radical.',
      { read: ([a, b]) => tex('\\sqrt{' + (a * b) + '}=\\sqrt{' + a + '}\\sqrt{' + b + '}'), explain: '$\\sqrt{24}=2\\sqrt6$.' }),
    rail('Ajusta el multiplicador entero de $\\sqrt3$ para igualar $\\sqrt{75}$.', [1, 9, 2, 5], x => tex('(' + x + '\\sqrt3)^2=' + 3 * x * x), 'Busca el cuadrado perfecto que acompaña al 3 dentro de 75.', { loads: x => [3 * x * x, 75], explain: '$\\sqrt{75}=5\\sqrt3$.' }),
  ]);

  // Sucesiones y Series
  tune('alg-14', ['pisa-huellas', 'escalera-aritmetica', 'rellena-medios', 'cuenta-saltos'], [
    point('Ubica el quinto término de la secuencia 4, 7, 10, … . El eje horizontal es el índice.', [0, 7, 0, 25], [1, 4], [5, 16], [line(3, 1)], 'Desde la primera posición hasta la quinta hay cuatro saltos.'),
    rail('Ajusta la diferencia para que una progresión que empieza en 24 tenga cuarto término 9.', [-8, 6, 1, -5], d => tex('a_4=24+3(' + d + ')=' + (24 + 3 * d)), 'Hay tres saltos y el total disminuye 15 unidades.', { bars: d => [['Primer término', 24], ['Cuarto término', 24 + 3 * d]], scale: 42 }),
  ]);
  tune('alg-14b', ['dos-escaleras', 'parejas-gauss', 'suma-filas'], [
    rect('Construye el rectángulo formado por dos escaleras de cinco peldaños, con extremos 4 y 12.', [7, 18], [5, 16], 'Los extremos de las escaleras se emparejan para producir la altura de cada columna.', { explain: 'El rectángulo tiene cinco columnas de altura 16. Cada escalera tiene área 40.' }),
    rail('Ajusta el número de términos de 3, 6, 9, … cuya suma sea 63.', [1, 10, 3, 6], x => tex('S_{' + x + '}=' + (3 * x * (x + 1) / 2)), 'La suma es la media del primer y último término por el número de términos.', { bars: x => [['Suma', 3 * x * (x + 1) / 2]], scale: 165 }),
    tiles('Pinta las parejas que permiten sumar 5, 8, 11, 14, 17 por los extremos.', 3, ['$5+17$', '$5+14$', '$8+14$', '$8+17$', '$11+11$', '$11+14$'], [0, 2, 4],
      'Cada término emparejado con su reflejo en la lista suma lo mismo. El central se empareja consigo al duplicar la lista.', { explain: 'Las parejas valen 22. Para calcular una sola suma, divides en dos la suma de la lista duplicada.' }),
  ]);
  tune('alg-14c', ['rebota-pelota', 'torre-producto', 'rellena-medios'], [
    probe('Una pelota parte de 64 cm y conserva la mitad de la altura en cada rebote. Busca cuándo queda en 8 cm.', [0, 6, 0, 64], 1, 3, x => 64 * .5 ** x,
      'Cada rebote multiplica la altura anterior por la misma razón.'),
    dial('Gira a la razón que transforma 5 en 20 después de dos pasos.', ['$1/2$', '$1$', '$2$', '$3$', '$4$', '$5$'], 2,
      (_, i) => tex('a_3=' + n(5 * [.5, 1, 2, 3, 4, 5][i] ** 2)), 'La misma razón debe aplicarse dos veces para que el resultado se cuadruplique.'),
    point('Ubica el cuarto término de 3, 6, 12, … en el plano índice–valor.', [0, 6, 0, 32], [1, 3], [4, 24], [x => 3 * 2 ** (x - 1)], 'Al pasar del índice 1 al 4 aplicas tres veces la razón.', { dy: 1 }),
  ]);
  tune('alg-14d', ['resta-corrida', 'limite-serie'], [
    tiles('En un mosaico de 16 celdas pinta lo que cubren las tres primeras capas: mitad, cuarto y octavo.', 4, grid(16, () => ''), grid(14, i => i), 'Parte de la mitad. Cada nueva contribución ocupa la mitad de la anterior.', { valid: v => v.length === 14, read: v => tex('\\frac{' + v.length + '}{16}'), explain: '$\\frac12+\\frac14+\\frac18=\\frac{14}{16}$.' }),
    rail('Ajusta cuántos términos de $12+6+3+\\cdots$ suman 21.', [1, 8, 1, 3], x => tex('S_{' + x + '}=' + n(24 * (1 - .5 ** x))), 'Al agregar un término, se suma la mitad del último que ya tienes.', { bars: x => [['Suma acumulada', 24 * (1 - .5 ** x)], ['Distancia a 24', 24 * .5 ** x]], scale: 24 }),
    point('Ubica el punto que muestra cuánto falta para 2 después de sumar $1+\\tfrac12+\\tfrac14$. El eje horizontal cuenta términos.', [0, 6, 0, 2], [1, 1], [3, .25], [x => 2 * .5 ** x], 'Resta la suma parcial al límite. La distancia restante va disminuyendo.', { dy: .125 }),
    dial('Ajusta la razón de una serie geométrica cuyo primer término es 8 y cuya suma infinita es 16.', ['$0$', '$1/4$', '$1/3$', '$1/2$', '$3/4$', '$7/8$'], 3,
      (_, i) => tex('S_\\infty=' + n(8 / (1 - [0, .25, 1 / 3, .5, .75, .875][i]))), 'Si la suma es el doble del primer término, compara cuánto queda al quitar la primera contribución.'),
  ]);
  tune('alg-15', ['arma-sigma', 'parte-sigma', 'suma-filas', 'torre-producto'], [
    groups('Lleva a la región de suma los términos que intervienen en $\\sum_{k=2}^{4}(2k+1)$.', ['Suma', 'Fuera'], ['3', '5', '7', '9', '11'], [1, 0, 0, 0, 1],
      'Los índices de 2 a 4 se incluyen en ambos extremos.', { explain: 'Los términos son 5, 7 y 9. El total es 21.' }),
    rail('Ajusta el último índice para que $\\prod_{k=2}^{m}k=120$.', [2, 7, 3, 5],
      m => tex('\\prod_{k=2}^{' + m + '}k=' + grid(m - 1, i => i + 2).reduce((a, b) => a * b, 1)), 'Cada nuevo índice aporta un factor y el producto anterior se conserva como factor parcial.'),
  ]);

  // Álgebra de Polinomios
  tune('alg-23a', [], [
    groups('Agrupa los términos por su grado para ver cuáles se pueden sumar.', ['$x^2$', '$x$', 'Constante'],
      ['$-5x$', '$7$', '$-x^2$', '$4x^2$', '$3x$', '$-2$'], [1, 2, 0, 0, 1, 2], 'El coeficiente puede variar. Los términos semejantes conservan la misma potencia de x.'),
    tiles('En la expresión $7x^5-5x^5-2x^5+4x^2+x-3$, pinta los términos de grado 5 que se cancelan.', 3,
      ['$7x^5$', '$-5x^5$', '$-2x^5$', '$4x^2$', '$x$', '$-3$'], [0, 1, 2], 'Suma los coeficientes de la potencia mayor antes de leer el grado.', { explain: 'Los términos de grado 5 suman cero. El polinomio resultante tiene grado 2.' }),
    probe('Evalúa $2x^2-x+3$ en $x=-2$ con la sonda.', [-4, 4, 0, 32], 1, -2, x => 2 * x ** 2 - x + 3, 'Sustituye el número negativo entre paréntesis antes de elevarlo.'),
    rail('Ajusta $k$ para que $kx^3-6x^3+2x^2$ tenga grado 2.', [0, 10, 2, 6], x => tex('(' + (x - 6) + ')x^3+2x^2'),
      'El grado baja cuando el coeficiente del término cúbico se vuelve cero.'),
    rect('Construye la malla de cruces al multiplicar un polinomio de tres términos por uno de cuatro.', [6, 6], [4, 3],
      'Cada término de un polinomio se multiplica por cada término del otro.', { valid: ([a, b]) => a * b === 12 && Math.min(a, b) === 3, explain: 'Se calculan 12 productos antes de reunir términos semejantes.' }),
    point('Marca el intercepto vertical de $x^2+2x-3$.', [-5, 5, -6, 10], [1, 0], [0, -3], [x => x * x + 2 * x - 3],
      'En el eje vertical, la entrada es cero y solo queda el término constante.'),
  ]);
  tune('alg-3', ['bloques-area'], [
    rect('Arma el cuadrado que representa $(3+4)^2$.', [9, 9], [7, 7], 'El lado tiene las dos partes juntas. El cuadrado incluye también los dos rectángulos mixtos.',
      { explain: '$7^2=3^2+2\\cdot3\\cdot4+4^2=49$.' }),
    rail('Equilibra $(x+3)^2$ con $x^2+6x+9$ y llévalos juntos a 64.', [0, 8, 1, 5],
      x => tex('(' + x + '+3)^2=' + (x + 3) ** 2), 'La expansión da el mismo valor para todo x. Busca primero qué lado positivo tiene área 64.',
      { loads: x => [(x + 3) ** 2, 64], explain: 'El lado mide 8. Por eso $x=5$ y ambas escrituras valen 64.' }),
    tiles('Pinta las piezas que quedan al repartir $(x+3)(x-3)$.', 2, ['$x^2$', '$3x$', '$-3x$', '$-9$'], [0, 3],
      'Los dos productos mixtos tienen el mismo tamaño y signos opuestos.', { explain: 'Se cancelan $3x$ y $-3x$. Queda $x^2-9$.' }),
    probe('Usa la sonda de $(x-4)^2$ para encontrar dónde vale cero.', [-1, 8, 0, 30], 1, 4, par(1, 4, 0),
      'Un cuadrado es cero cuando la cantidad que se eleva es cero.'),
    groups('Separa por tipo las piezas del área de $(x+2)(x+5)$.', ['$x^2$', 'Término lineal', 'Constante'],
      ['$x^2$', '$2x$', '$5x$', '$10$'], [0, 1, 1, 2], 'Las bandas mixtas llevan una sola x y se pueden juntar.', { explain: 'El área total es $x^2+7x+10$.' }),
  ]);
  tune('alg-24c', [], [
    rail('Ajusta el coeficiente central en $(a+b)^4$.', [0, 10, 2, 6], v => tex(v + 'a^2b^2'),
      'Cuenta cuántas formas hay de escoger dos de los cuatro factores para tomar b.', { bars: v => [['Término central', v]] }),
    tiles('Para obtener $a^2b^3$ en $(a+b)^5$, pinta tres factores de los que tomas $b$.', 5,
      ['1', '2', '3', '4', '5'], [0, 2, 4], 'Cada casilla pintada representa un factor del que tomas b.', { valid: v => v.length === 3,
        read: v => tex('a^{' + (5 - v.length) + '}b^{' + v.length + '}'), explain: 'Hay $\\binom53=10$ maneras de pintar tres de las cinco posiciones.' }),
    groups('Agrupa los términos de $(a-b)^4$ según el signo de su coeficiente.', ['Positivos', 'Negativos'],
      ['$a^4$', '$a^3b$', '$a^2b^2$', '$ab^3$', '$b^4$'], [0, 1, 0, 1, 0], 'Cada b viene de elegir un factor −b. Cuenta cuántos signos negativos se multiplican.'),
    rect('En $(a+b)^3$ dibuja tres columnas con dos opciones por columna.', [6, 6], [3, 2],
      'Cada columna representa un factor, y sus dos celdas son las opciones a y b.', { read: ([x, y]) => tex(y + '^{' + x + '}=' + y ** x), explain: 'Hay 8 productos antes de reunirlos en los términos de la expansión.' }),
    dial('Gira hasta el exponente de b del término con coeficiente 5 que tiene menor exponente de a en $(a+b)^5$.', [0, 1, 2, 3, 4, 5], 4,
      (k, i) => tex([1, 5, 10, 10, 5, 1][i] + 'a^{' + (5 - k) + '}b^{' + k + '}'), 'Hay dos coeficientes 5. Compara en cuál el exponente de a queda más pequeño.'),
    route('Sigue la potencia de a al avanzar dos términos desde el primer término de $(a+b)^5$.', ['5', '4', '6', '3', '2', 'fin'], [1, 3],
      'En cada paso, cambias una elección de a por una de b.'),
  ]);
  tune('alg-24b', ['bloques-area', 'completa-cuadrado'], [
    rect('Encuentra dos factores positivos de 24 que sumen 11.', [12, 10], [8, 3],
      'El área representa el producto y la suma de los dos lados representa el término lineal.', { valid: ([a, b]) => a * b === 24 && a + b === 11,
        read: ([a, b]) => tex('u+v=' + (a + b) + '\\quad uv=' + a * b), explain: '$x^2+11x+24=(x+3)(x+8)$.' }),
    rail('Ajusta el factor común de $18x^3+12x^2$ para que el factor restante tenga coeficientes 3 y 2.', [1, 18, 3, 6],
      v => tex(v + 'x^2\\left(\\frac{18}{' + v + '}x+\\frac{12}{' + v + '}\\right)'), 'El número debe dividir ambos coeficientes. Usa además la menor potencia común de x.'),
    probe('Encuentra el cero negativo de $x^2-25$ sobre la curva.', [-7, 7, -27, 26], 1, -5, x => x * x - 25,
      'Factoriza como diferencia de cuadrados. Busca el cruce que está a la izquierda del origen.'),
    groups('Separa los factores de $x^2+x-20$ de las otras expresiones.', ['Factores', 'Fuera'], ['$x+5$', '$x-4$', '$x+4$', '$x-5$'], [0, 0, 1, 1],
      'Los dos números deben sumar 1 y multiplicar −20.', { explain: '$x^2+x-20=(x+5)(x-4)$.' }),
  ]);

  // Parábolas y Complejos
  tune('alg-23c', [], [
    point('Arrastra el punto hasta representar $-3+2i$.', [-5, 5, -5, 5], [1, 1], [-3, 2], [],
      'El eje horizontal mide la parte real y el vertical la parte imaginaria.'),
    dial('Gira el brazo desde $i^0$ hasta la quinta multiplicación por $i$.', [0, 1, 2, 3, 4, 5, 6, 7], 5,
      k => tex('i^{' + k + '}=' + ['1', 'i', '-1', '-i'][k % 4]), 'Cada paso multiplica por i. Cuatro pasos completan una vuelta.'),
    rail('Ajusta la parte imaginaria de $3+bi$ hasta que el módulo sea 5. Usa un b positivo.', [0, 7, 2, 4],
      b => tex('|3+' + b + 'i|=\\sqrt{' + (9 + b * b) + '}'), 'Las partes real e imaginaria son catetos de un triángulo rectángulo.',
      { bars: b => [['Cuadrado de la parte real', 9], ['Cuadrado de la parte imaginaria', b * b]], scale: 49 }),
    groups('Mueve cada complejo a su lado del eje real.', ['Arriba', 'Abajo', 'En el eje'], ['$5-2i$', '$-i$', '$2i$', '$-3$', '$2+i$'],
      [1, 1, 0, 2, 0], 'Solo el coeficiente de i decide la altura.'),
    tiles('Pinta las operaciones que dejan un número real.', 2, ['$i^2$', '$i^3$', '$(2+i)(2-i)$', '$2+i$'], [0, 2],
      'Busca productos de conjugados y potencias pares de i.', { explain: '$i^2=-1$ y $(2+i)(2-i)=5$ son reales.' }),
    route('Parte de $1+i$ y multiplica por i dos veces.', ['$1+i$', '$-1+i$', '$1-i$', '$-1-i$', '$1+i$', 'fin'], [1, 3],
      'Multiplicar por i gira el vector 90° en sentido antihorario.'),
  ]);
  tune('alg-1', ['balanza-exponencial'], [
    rail('Quita la misma cantidad a ambos lados de $3x+7=19$ hasta aislar $3x$.', [0, 14, 0, 7],
      v => tex('3x+' + (7 - v) + '=' + (19 - v)), 'El 7 debe quedar en cero y los dos miembros deben recibir el mismo cambio.', { explain: 'Quitar 7 deja $3x=12$ y luego $x=4$.' }),
    rect('Construye tres filas de fichas iguales para representar $3x=21$.', [10, 7], [7, 3],
      'El total se reparte en tres filas iguales. La fila representa una copia de x.', { explain: '$x=7$.' }),
    point('Coloca el punto donde $y=2x-1$ y $y=7$ tienen el mismo valor.', [-4, 8, -5, 12], [1, 1], [4, 7], [line(2, -1), line(0, 7)],
      'El punto de intersección debe tener la misma altura en las dos rectas.'),
    tiles('Pinta las ecuaciones cuyo único valor solución sea 3.', 2, ['$2x=6$', '$x+2=6$', '$5x-7=8$', '$3x=12$'], [0, 2],
      'Sustituye x por 3 y compara los miembros de cada igualdad.', { explain: 'Tres cumple $2x=6$ y $5x-7=8$.' }),
    route('Traza las cantidades correctas al resolver $4x-5=23$: primero elimina el −5 y luego despeja.', ['23', '$4x=28$', '$4x=18$', '$x=7$', '$x=4$', 'fin'],
      [1, 3], 'Suma 5 a ambos lados. Después divide ambos lados entre 4.'),
  ]);
  tune('alg-4a', ['completa-cuadrado', 'mueve-parabola'], [
    point('Marca el vértice de $y=2(x+1)^2-3$.', [-5, 5, -6, 12], [1, 2], [-1, -3], [par(2, -1, -3)],
      'El vértice aparece donde se anula la parte al cuadrado.'),
    probe('Busca en $f(x)=-(x-2)^2+7$ el máximo de la altura.', [-3, 7, -11, 9], -1, 2, par(-1, 2, 7), 'El término cuadrático se resta. La altura es mayor cuando ese término es cero.'),
    rail('Ajusta el coeficiente $a$ para que $y=ax^2+1$ pase por $(2,13)$.', [-4, 7, 1, 3], a => tex('y(2)=4(' + a + ')+1=' + (4 * a + 1)),
      'Sustituye el valor horizontal en el cuadrado y compara la altura resultante con 13.', { loads: a => [4 * a + 1, 13] }),
    groups('Mueve cada parábola al lado que indica su abertura.', ['Hacia arriba', 'Hacia abajo'],
      ['$2x^2$', '$-x^2+4$', '$(x-2)^2$', '$-3(x+1)^2$'], [0, 1, 0, 1], 'El signo del factor que multiplica el cuadrado controla la abertura.'),
  ]);
  tune('alg-4', ['raices-imanes'], [
    point('Marca la raíz positiva de $y=x^2-9$.', [-6, 6, -10, 12], [1, 3], [3, 0], [par(1, 0, -9)], 'Una raíz es un cruce con la altura cero. La raíz positiva queda a la derecha.'),
    rail('Ajusta $c$ para que el discriminante de $x^2-6x+c=0$ sea cero.', [0, 14, 5, 9], c => tex('\\Delta=36-4(' + c + ')=' + (36 - 4 * c)),
      'Iguala el cuadrado del coeficiente lineal con cuatro veces el independiente.', { loads: c => [36, 4 * c] }),
    groups('Separa las ecuaciones por la cantidad de raíces reales distintas.', ['Ninguna', 'Una', 'Dos'],
      ['$x^2+1=0$', '$x^2-4=0$', '$(x-2)^2=0$', '$x^2+9=0$'], [0, 2, 1, 0],
      'Compara lo que tendría que valer el cuadrado con cero.'),
    tiles('Pinta todas las raíces enteras de $x^2-3x-10=0$.', 3, ['$-5$', '$-2$', '$0$', '$2$', '$3$', '$5$'], [1, 5],
      'Busca dos números cuyo producto sea −10 y cuya suma sea 3 para leer las raíces.', { explain: 'Los cruces son $-2$ y $5$, pues $(x+2)(x-5)=0$.' }),
    route('Empieza en $x^2-10x=-21$ y sigue hasta la raíz mayor por completar el cuadrado.', ['$x^2-10x$', 'suma 25', 'suma 10', '$5+2$', '$5-2$', 'fin'],
      [1, 3], 'La mitad de −10 se eleva al cuadrado. Luego usa el signo que produce la raíz mayor.'),
  ]);

  // Raíces de Polinomios
  tune('alg-23b', [], [
    rect('Empaca 32 unidades como cuatro filas de ocho para representar una división exacta en el arreglo.', [10, 8], [8, 4],
      'Cada fila tiene el tamaño del divisor. El número de filas es el cociente.', { explain: '$32=8\\cdot4+0$.' }),
    rail('Ajusta el coeficiente de $x^2$ para que $kx^2+5x+6=(x+2)(x+3)$.', [0, 8, 4, 1],
      k => tex(k + 'x^2+5x+6'), 'El coeficiente del término de mayor grado se obtiene multiplicando los dos términos x.'),
    groups('Pon los términos del dividendo en su columna y detecta qué grado falta.', ['Grado 3', 'Grado 2', 'Grado 1'],
      ['$2x^3$', '$0x$', '$-4x^2$', '$0x^2$'], [0, 2, 1, 1],
      'Un término con coeficiente cero sirve como marcador de posición en una columna.', { explain: 'El polinomio $2x^3-4x^2$ tiene coeficiente lineal cero.' }),
    probe('Sondea $x^2+2x+7$ en $x=2$ para medir el residuo al dividir por $x-2$.', [-4, 4, 0, 30], 0, 2, x => x * x + 2 * x + 7,
      'La identidad del dividendo se simplifica cuando el divisor se vuelve cero.'),
    tiles('Pinta las divisiones cuyo cociente, si la división es exacta, tiene grado 2.', 2,
      ['$x^5/x^3$', '$x^4/x^3$', '$x^6/x^4$', '$x^3/x^3$'], [0, 2], 'Resta el grado del divisor al grado del dividendo.',
      { explain: 'Las diferencias $5-3$ y $6-4$ valen 2.' }),
    route('Parte del grado 7. Divide por un polinomio de grado 3 y luego divide el cociente por otro de grado 2.',
      ['7', '4', '10', '2', '6', 'fin'], [1, 3], 'En cada división, resta el grado del divisor al del dividendo.'),
  ]);
  tune('alg-92', ['division-sintetica'], [
    probe('Mide el residuo de dividir $x^3-2x+5$ por $x+2$.', [-4, 4, -14, 18], 0, -2, x => x ** 3 - 2 * x + 5,
      'Busca primero el valor que hace que el divisor valga cero.'),
    point('Marca el punto que da el residuo de dividir $x^2-3x+4$ por $x-4$.', [-2, 6, 0, 22], [1, 3], [4, 8],
      [x => x * x - 3 * x + 4], 'El dato horizontal viene del divisor. El vertical es el valor del polinomio en ese punto.'),
    tiles('Pinta los valores de r que hacen de $x-r$ un factor de $(x-1)(x+3)(x-4)$.', 3, ['$-4$', '$-3$', '$-1$', '$0$', '$1$', '$4$'],
      [1, 4, 5], 'Para cada factor, encuentra qué valor de x lo hace cero.', { explain: '$r=-3,1,4$.' }),
    rail('Ajusta $k$ para que $x-3$ sea factor de $x^2+kx-15$.', [-5, 6, 0, 2],
      k => tex('P(3)=9+3(' + k + ')-15=' + (3 * k - 6)), 'Si el divisor es un factor, el residuo de evaluar en 3 debe ser cero.', { loads: k => [9 + 3 * k, 15] }),
    groups('Agrupa divisores de $P(x)=x^2-4$ según produzcan división exacta o residuo.', ['Exacta', 'Con residuo'],
      ['$x-2$', '$x+1$', '$x+2$', '$x-3$'], [0, 1, 0, 1], 'El divisor es factor cuando el polinomio se anula en su raíz.'),
  ]);
  tune('alg-93', ['raices-imanes'], [
    tiles('Marca las raíces en las que la gráfica de $(x+3)(x-1)^2(x-4)^3$ cruza el eje.', 3, ['$-3$', '$1$', '$4$'],
      [0, 2], 'Un factor de potencia impar cambia de signo al pasar por su cero.', { explain: 'Cruza en −3 y 4. En 1 toca el eje y rebota.' }),
    probe('Alumbra la raíz negativa de $(x+2)^2(x-3)$.', [-4, 5, -30, 24], 0, -2, x => (x + 2) ** 2 * (x - 3),
      'Un cero doble toca el eje aunque la gráfica no cambie de lado.'),
    groups('Coloca cada potencia en su región. Mira el comportamiento de la curva en 2.', ['Cruza', 'Toca y vuelve'],
      ['$(x-2)^2$', '$(x-2)^3$', '$(x-2)^4$', '$x-2$'], [1, 0, 1, 0], 'Los exponentes pares mantienen el signo alrededor de la raíz.'),
    point('Marca la altura de $y=-(x+2)(x-4)$ en $x=0$.', [-5, 6, -12, 10], [1, 1], [0, 8],
      [x => -(x + 2) * (x - 4)], 'Sustituye cero y observa los signos de los dos factores.'),
    rail('Ajusta la multiplicidad del primer cero para que $(x+1)^m(x-4)^2$ tenga grado 7.', [1, 8, 2, 5],
      m => tex('\\deg P=' + m + '+2=' + (m + 2)), 'Cada copia de un factor lineal aporta uno al grado total.'),
  ]);

  // Fracciones Algebraicas
  tune('alg-25a', ['cancela-factores', 'cruz-asintotas'], [
    point('Marca el hueco que queda al simplificar $(x^2-9)/(x-3)$.', [-5, 6, -4, 11], [1, 4], [3, 6], [line(1, 3)],
      'La recta simplificada da la altura. La coordenada horizontal se excluye por el denominador original.', { explain: 'El hueco queda en $(3,6)$ porque la expresión original excluye $x=3$.' }),
    tiles('Pinta todos los valores que deja fuera $\\dfrac{x+5}{(x-2)(x+3)}$.', 3, ['$-5$', '$-3$', '$-2$', '$0$', '$2$', '$3$'],
      [1, 4], 'Se excluyen los ceros del denominador original, incluso si otro factor pudiera cancelarse.', { explain: 'Se excluyen $x=-3$ y $x=2$.' }),
    groups('Para $\\dfrac{(x-1)(x+4)}{(x-1)(x+2)}$, separa hueco, asíntota y valor permitido.', ['Hueco', 'Asíntota', 'Permitido'],
      ['$1$', '$-2$', '$-4$', '$0$'], [0, 1, 2, 2], 'Un cero de un factor cancelado deja un hueco. Si el factor sigue en el denominador, hay asíntota.'),
    probe('Sigue la gráfica de $\\dfrac{x^2-4}{x-2}$ y busca dónde llega a 7.', [-5, 8, -4, 12], 0, 5, x => x === 2 ? NaN : x + 2,
      'El factor compartido deja $x+2$ en todos los puntos permitidos.', { holes: [[2, 4]] }),
  ]);
  tune('alg-25b', ['cancela-factores'], [
    bridges('Amplía las dos fracciones hasta construir el mismo denominador.', [['1', 'x-2'], ['2', 'x+3']], ['x-2', 'x+3'],
      ['x+3', 'x-2', 'x+2', 'x-3'], [0, 1], 'Cada fracción necesita el factor que ya aparece en la otra.',
      'Las dos fracciones quedan sobre $(x-2)(x+3)$. La suma es $\\frac{3x-1}{(x-2)(x+3)}$, con $x\\ne2,-3$.'),
    tiles('Para $1/(x-2)+1/(x+3)$, pinta los factores que deben estar en el denominador común.', 2,
      ['$x-2$', '$x+3$', '$x-3$', '$x+2$'], [0, 1], 'Cada factor original debe poder dividir al denominador común sin residuo.',
      { explain: 'El denominador común más corto es $(x-2)(x+3)$.' }),
    groups('Construye el numerador de $\\frac{2}{x}+\\frac{3}{x+1}$ sobre $x(x+1)$ llevando cada pieza a su lugar.',
      ['Primer sumando', 'Segundo sumando', 'Sobra'], ['$2x$', '$2$', '$3x$', '$3$'], [0, 0, 1, 2],
      'Multiplica cada numerador por el factor que le falta a su denominador.', { explain: '$2(x+1)+3x=5x+2$.' }),
    probe('Sondea en $x=3$ la suma $\\dfrac1x+\\dfrac1{x+1}$.', [1, 7, 0, 2], 1, 3, x => 1 / x + 1 / (x + 1),
      'Al sustituir 3, compara los dos denominadores para convertirlos a doceavos.', { explain: '$\\frac13+\\frac14=\\frac7{12}$.' }),
    route('Traza los factores al convertir $\\dfrac{x}{x-1}\\div\\dfrac{x+2}{x-1}$ en un producto y simplificar.',
      ['inicio', '$\\times\\frac{x-1}{x+2}$', '$\\times\\frac{x+2}{x-1}$', '$\\frac{x}{x+2}$', '$\\frac{x+2}{x}$', 'fin'],
      [1, 3], 'Invierte solo el divisor. Conserva las restricciones de la operación original.',
      { explain: 'El resultado es $x/(x+2)$ con $x\\ne1$ y $x\\ne-2$.' }),
  ]);
  tune('alg-101', ['afina-sistema', 'combina-vectores'], [
    point('Encuentra la intersección de $y=x+2$ y $y=8-x$.', [-3, 9, -2, 11], [1, 3], [3, 5], [line(1, 2), line(-1, 8)],
      'Una solución debe quedar sobre las dos rectas al mismo tiempo.'),
    groups('Distribuye los puntos según si cumplen $x+y=5$.', ['En la recta', 'Fuera'], ['$(1,4)$', '$(2,4)$', '$(5,0)$', '$(-1,6)$'], [0, 1, 0, 0],
      'Suma las dos coordenadas de cada punto para comprobar la ecuación.'),
    rail('Ajusta el multiplicador de $x-2y$ para sumarlo a $3x+6y$ y eliminar y.', [-5, 7, 1, 3],
      m => tex((3 + m) + 'x+(' + (6 - 2 * m) + ')y'), 'Busca qué múltiplo de −2 cancela el coeficiente +6.', { loads: m => [2 * m, 6] }),
    tiles('Pinta las ecuaciones de rectas paralelas a $y=2x+1$ que no coinciden con ella.', 2,
      ['$y=2x-4$', '$y=-2x+1$', '$y=2x+1$', '$y=2x+5$'], [0, 3], 'Las rectas paralelas tienen la misma pendiente. Compara sus interceptos.',
      { explain: 'Los interceptos −4 y 5 son distintos de 1, y ambas pendientes valen 2.' }),
  ]);
  tune('alg-102', [], [
    point('Encuentra la intersección positiva de $y=x^2$ y $y=4$.', [-4, 4, -2, 10], [1, 1], [2, 4], [par(1, 0, 0), line(0, 4)],
      'Compara la rama derecha de la parábola con la altura de la recta.'),
    probe('Sigue $y=x^2-1$ hasta su intersección de abscisa negativa con $y=2x+2$.', [-4, 5, -7, 15], 0, -1, x => x * x - 1,
      'Iguala las dos alturas y conserva la candidata que queda a la izquierda del cero.', { other: [line(2, 2)] }),
    tiles('Pinta las parejas que resuelven simultáneamente $x+y=5$ y $xy=6$.', 2, ['$(2,3)$', '$(1,4)$', '$(3,2)$', '$(0,5)$'],
      [0, 2], 'Cada pareja debe pasar las dos pruebas. Cambiar el orden puede dejar las dos relaciones intactas.', { explain: 'Las parejas $(2,3)$ y $(3,2)$ tienen suma 5 y producto 6.' }),
    rail('En $A/(x-1)+2/(x+1)$, ajusta $A$ para que el numerador común contenga $5x$.', [-4, 8, 1, 3],
      a => tex((a + 2) + 'x+(' + (a - 2) + ')'), 'Al expandir el numerador, el coeficiente de x reúne una copia de A y una de 2.'),
    groups('Al eliminar los denominadores de $A/(x-2)+B/(x+3)$, asigna a cada letra su factor.', ['Multiplica A', 'Multiplica B', 'Fuera'],
      ['$x-2$', '$x+3$', '$x$', '$x+2$'], [1, 0, 2, 2], 'Completa cada denominador con el factor del otro término.'),
    route('En $\\dfrac{7x-1}{(x-1)(x+2)}$, usa $x=1$ para despejar $A$.',
      ['inicio', '$6=3A$', '$6=3B$', '$A=2$', '$A=3$', 'fin'], [1, 3],
      'A acompaña a $1/(x-1)$. Tras multiplicar por el denominador común, el término con $x-1$ desaparece al sustituir 1.'),
  ]);

  // Crecimiento Exponencial
  tune('alg-71', ['balanza-exponencial', 'proyector-sombras'], [
    probe('Sigue la gráfica de $3^x$ hasta la altura 27.', [-3, 4, 0, 30], 0, 3, x => 3 ** x,
      'La curva sube multiplicando por 3 con cada paso de una unidad.'),
    point('Marca el intercepto vertical de $f(x)=2\\cdot4^x$.', [-3, 3, 0, 16], [1, 2], [0, 2], [x => 2 * 4 ** x],
      'En el eje vertical el exponente vale cero.'),
    groups('Separa las funciones según aumenten o disminuyan al mover x hacia la derecha.', ['Crecen', 'Decrecen'],
      ['$2^x$', '$(1/3)^x$', '$4^x$', '$(3/4)^x$'], [0, 1, 0, 1], 'Una base entre 0 y 1 reduce la altura de cada paso siguiente.'),
    rail('Ajusta la cantidad inicial para que, después de triplicarse dos veces, queden 54 unidades.', [1, 10, 2, 6],
      v => tex(v + '\\cdot3^2=' + v * 9), 'Deshaz las dos multiplicaciones por 3.', { bars: v => [['Inicio', v], ['Tras dos etapas', v * 9]], scale: 90 }),
  ]);
  tune('alg-13b', ['crece-planta', 'carrera-interes', 'ajusta-capital', 'mejor-oferta', 'alcancias-gemelas'], [
    rail('Ajusta los periodos hasta duplicar un capital de 100 con interés simple de 20 % por periodo.', [0, 9, 1, 5],
      t => tex('M=100(1+0.2\\cdot' + t + ')=' + n(100 * (1 + .2 * t))), 'Cada vez se añaden 20 unidades calculadas sobre el capital inicial.',
      { bars: t => [['Capital', 100], ['Monto acumulado', 100 + 20 * t]], scale: 280 }),
    point('Marca en la curva el monto de 200 tras tres periodos al 10 % compuesto.',
      [0, 5, 210, 300], [1, 220], [3, 266], [t => 200 * 1.1 ** t],
      'Cada crecimiento se aplica al monto completo del periodo anterior.',
      { valid: ([x, y]) => x === 3 && Math.abs(y - 266.2) <= 1.25, explain: '$200\\cdot1.1^3=266.2$.' }),
  ]);
  tune('alg-72', ['espejo-diagonal'], [
    point('Refleja $(3,8)$ de $y=2^x$ sobre $y=x$.', [0, 9, 0, 9], [3, 8], [8, 3],
      [x => 2 ** x, x => Math.log2(x), x => x], 'La entrada de la exponencial se vuelve la salida del logaritmo.', { explain: '$2^3=8$ equivale a $\\log_2(8)=3$.' }),
    rail('Ajusta el argumento $b$ para que $\\log_2 4 + \\log_2 b=\\log_2 32$.', [1, 12, 2, 8],
      b => tex('\\log_2(4\\cdot' + b + ')=\\log_2(' + (4 * b) + ')'), 'Sumar logaritmos de la misma base corresponde a multiplicar los argumentos.', { loads: b => [4 * b, 32] }),
    dial('Gira hasta el exponente de 5 que produce $1/25$.', [-3, -2, -1, 0, 1, 2], 1,
      v => tex('5^{' + v + '}=' + n(5 ** v)), 'El exponente que buscas es el logaritmo en base 5 de esa fracción.'),
    groups('Agrupa los argumentos de $\\log_3 x$ por el signo del resultado.', ['Negativo', 'Cero', 'Positivo'],
      ['$1/3$', '$1$', '$9$', '$1/9$', '$3$'], [0, 1, 2, 0, 2], 'Para una base mayor que 1, las potencias de exponente negativo quedan entre 0 y 1.'),
    tiles('Pinta los argumentos que admite $\\ln(x-2)$.', 3, ['$-3$', '$0$', '$1$', '$2$', '$3$', '$8$'], [4, 5],
      'El argumento completo, x menos 2, debe quedar estrictamente positivo.', { explain: 'El dominio es $x>2$. De la lista sirven 3 y 8.' }),
  ]);
  tune('alg-73', ['balanza-exponencial'], [
    point('Marca el punto donde $2^x$ iguala a 16.', [-2, 6, 0, 22], [1, 2], [4, 16], [x => 2 ** x, line(0, 16)],
      'Busca qué potencia de 2 da la altura de la recta horizontal.'),
    probe('Sondea $\\log_2(x-1)$ hasta que la altura sea 3.', [2, 12, 0, 4], 3, 9, x => Math.log2(x - 1),
      'Convierte la igualdad a forma exponencial y añade el desplazamiento de una unidad.'),
    groups('Clasifica los valores para resolver $\\log_2(x-1)+\\log_2(x+1)=3$.', ['Solución', 'Admitido', 'Fuera del dominio'],
      ['$-3$', '$1$', '$2$', '$3$', '$5$'], [2, 2, 1, 0, 1], 'Primero exige que ambos argumentos sean positivos. Luego prueba el producto en la ecuación.',
      { explain: '$x^2-1=8$ produce las candidatas −3 y 3. La única válida es 3.' }),
    tiles('Pinta las ecuaciones que tienen $x=2$ como solución.', 2, ['$3^x=9$', '$2^x=2$', '$\\log_2(x+2)=2$', '$\\ln(x-2)=0$'],
      [0, 2], 'Sustituye 2 en cada caso. Para evaluar un logaritmo, verifica antes el dominio.',
      { explain: '$3^2=9$ y $\\log_2(2+2)=2$.' }),
    route('Despeja $x$ en $3^{2x-1}=27$ aumentando de estación cuando la igualdad sea equivalente.', ['inicio', '$2x-1=3$', '$2x-1=9$', '$x=2$', '$x=5$', 'fin'],
      [1, 3], 'Expresa 27 como potencia de 3. Luego iguala exponentes.'),
  ]);

  // Sin jefes (spec 2026-11-18-algebra-revision): la evaluación conserva sus preguntas, suma las variantes y los retos
  // que eran del jefe (cada uno ligado a la lección que repasa) y el nodo del jefe desaparece del mundo.
  function assess(world, boss, replacements, bossLessons) {
    const u = COURSE_ALGEBRA.units.find(u => u.world === world);
    const item = (lesson, ex, review) => ({ lesson, review: review || ((ex.hint || '') + ' ' + (ex.explain || '')).trim(),
      ex: { ...ex, canvasGuide: true, exam: true, motion: false, params: { ...ex.params, motion: false, autoDemo: false } } });
    // Las preguntas de escoger o de armar con fichas de tocar no siguen: el usuario las descartó.
    const dull = ['escala-solucion', 'arma-la-cuenta', 'une-parejas', 'clasifica-cartas', 'ordena-terminos', 'verdadero-falso'];
    const items = u.exam.items.filter(it => !dull.includes(it.ex.game)).map(it => item(it.lesson, it.ex, it.review));
    for (const [i, ex] of Object.entries(replacements)) items.push(item(u.exam.items[i].lesson, ex));
    boss.forEach((ex, i) => items.push(item(bossLessons[i], ex)));
    // Orden del mundo: primero las preguntas de la primera lección.
    const order = u.lessons.map(l => l.id);
    u.exam.items = items.map((it, k) => [it, k]).sort((a, b) => order.indexOf(a[0].lesson) - order.indexOf(b[0].lesson) || a[1] - b[1]).map(([it]) => it);
    u.exam.minutes = Math.max(12, Math.round(u.exam.items.length * 1.5));
    delete u.boss;
  }

  assess('conjuntos', [
    groups('El universo son las letras de CLIMA. Separa las que pertenecen también a MAR.', ['En común', 'Solo en CLIMA'],
      ['C', 'L', 'I', 'M', 'A'], [1, 1, 1, 0, 0], 'Un elemento en común aparece en las dos palabras.'),
    tiles('Colorea el complemento de $A=\\{2,4,6\\}$ en $U=\\{1,2,3,4,5,6\\}$.', 3,
      ['1', '2', '3', '4', '5', '6'], [0, 2, 4], 'Parte de U y excluye los elementos que aparecen en A.', { explain: '$A^c=\\{1,3,5\\}$.' }),
    route('Traza las cardinalidades. Parte de 3 elementos, añade uno nuevo y luego añade dos que ya estaban.', ['3', '4', '5', '4', '6', 'fin'],
      [1, 3], 'Añadir una copia de un elemento no cambia la cardinalidad.', { motion: true }),
  ], {
    3: rail('Ajusta el número de subconjuntos de $\\{P,L,A,T,O\\}$.', [0, 40, 10, 32], v => tex('n(\\mathcal P(A))=' + v),
      'Incluye o deja fuera cada uno de los cinco elementos.', { explain: '$2^5=32$ subconjuntos, incluido el vacío.' }),
  }, ['alg-0c', 'alg-0c', 'alg-0a']);
  assess('numeros', [
    play('ubica-en-recta', 'Suelta cada número en su lugar de la recta', { min: -3, max: 3, tol: 0.15, points: [
      { label: '−7/4', tex: '-\\tfrac74', value: -1.75 }, { label: '2/3', tex: '\\tfrac23', value: 0.6667 }, { label: '−√2', tex: '-\\sqrt2', value: -1.4142 }, { label: '2.25', tex: '2.25', value: 2.25 },
    ] }, 'Siete cuartos son una unidad y tres cuartos, a la izquierda del cero; $-\\sqrt2 \\approx -1.41$ queda un poco a su derecha, y $\\tfrac23$ y $2.25$ a la derecha del cero.',
      { hint: 'Antes de soltar, convierte cada número a decimal: así ves entre qué enteros cae y de qué lado del cero está.' }),
    groups('Pon cada valor en la familia más pequeña que lo contiene.', ['Enteros', 'Racionales no enteros', 'Irracionales'],
      ['$-3$', '$1/7$', '$\\sqrt5$', '$\\sqrt{16}$', '$0.25$'], [0, 1, 2, 0, 1],
      'Reduce una raíz cuadrada exacta antes de clasificarla.'),
    probe('Desplaza la sonda de $y=|x+2|$ hasta la rama izquierda con altura 3 y suéltala.', [-7, 5, 0, 7], 0, -5, x => Math.abs(x + 2),
      'Busca el punto que se aleja tres unidades hacia la izquierda de −2.', { motion: true }),
  ], {
    6: rail('Ajusta la distancia entre $-3.5$ y $2.25$.', [0, 8, 3, 5.75, .25], v => format(v, 'd'),
      'Mide cada tramo hasta cero y suma las longitudes.', { explain: '$|2.25-(-3.5)|=5.75$.' }),
  }, ['alg-11b', 'alg-11c', 'alg-12d']);
  assess('razones', [
    rect('Construye un rectángulo de 24 unidades cuya razón ancho a alto sea 3:2.', [10, 8], [6, 4],
      'Multiplica los lados del modelo por el mismo número y comprueba el área.', { read: ([a, b]) => tex(a + ':' + b + '\\quad A=' + a * b) }),
    point('Marca cuánto cuesta comprar seis unidades si cuatro cuestan 18 mil pesos.', [0, 10, 0, 40], [2, 9], [6, 27], [line(4.5, 0)],
      'Dos unidades cuestan la mitad del precio conocido.'),
    route('Desde 200 mil, aplica una rebaja de 25 % y después un aumento de 10 %.', ['200', '150', '175', '165', '160', 'fin'], [1, 3],
      'El segundo cambio toma como base el precio tras la rebaja.', { motion: true }),
  ], {
    6: probe('En un mapa, 2 cm representan 15 km. Pon la sonda en la distancia que representan 7 cm.',
      [0, 8, 0, 64], 2, 7, line(7.5, 0), 'Un centímetro representa la mitad de 15 km.', { explain: '$7\\cdot7.5=52.5$ km.' }),
  }, ['alg-12', 'alg-12f', 'alg-13d']);
  assess('potencias', [
    rect('Empaca $(2^3)^2$ como dos filas de tres factores 2. Muestra cuántos factores hay en total.', [6, 5], [3, 2],
      'Cada fila repite completa la potencia de adentro.', { read: ([x, y]) => tex('(2^{' + x + '})^{' + y + '}=2^{' + x * y + '}') }),
    rail('Equilibra $k\\sqrt5$ con $\\sqrt{180}$ usando un entero positivo.', [1, 9, 3, 6], k => tex('(' + k + '\\sqrt5)^2=' + 5 * k * k),
      'Factoriza 180 como cinco veces un cuadrado perfecto.', { loads: k => [5 * k * k, 180], explain: '$\\sqrt{180}=6\\sqrt5$.' }),
    probe('Lleva la sonda a $x=-3$ en $y=4^x$ y sigue el cambio de escala.', [-4, 2, 0, 5], 0, -3, x => 4 ** x,
      'Un paso hacia la izquierda divide la altura entre 4.', { motion: true, explain: '$4^{-3}=\\tfrac1{64}$.' }),
  ], {
    5: dial('En la rueda de potencias de 81, identifica el exponente que saca la raíz cuarta y luego eleva al cubo.',
      ['$1/4$', '$1/3$', '$3/4$', '$4/3$', '$2$', '$3$'], 2, (v, i) => tex('81^{' + v.slice(1, -1) + '}=' + n(81 ** [.25, 1 / 3, .75, 4 / 3, 2, 3][i])),
      'El índice de la raíz es el denominador de la potencia fraccionaria.', { explain: '$81^{3/4}=3^3=27$.' }),
  }, ['alg-21b', 'alg-22b', 'alg-21a']);
  assess('progresiones', [
    point('Marca en la gráfica el séptimo término de 2, 6, 10, … .', [0, 8, 0, 35], [1, 2], [7, 26], [line(4, -2)],
      'Entre los términos 1 y 7 hay seis saltos de la misma longitud.'),
    tiles('Pinta cuatro capas sobre 32 celdas: mitad, cuarto, octavo y dieciseisavo.', 8, grid(32, () => ''), grid(30, i => i),
      'La primera capa usa 16 celdas. Cada capa posterior usa la mitad de la anterior.', { valid: v => v.length === 30, read: v => tex('\\frac{' + v.length + '}{32}'), explain: '$16+8+4+2=30$ celdas.' }),
    probe('Busca cuántas etapas necesita un acumulado de $1+2+4+\\cdots$ para llegar a 31.', [0, 6, 0, 65], 1, 5, x => 2 ** x - 1,
      'Al duplicar la suma y restar la original, queda la siguiente potencia menos uno.', { motion: true }),
  ], {
    0: point('Marca el término 12 de $5,8,11,\\ldots$.', [0, 14, 0, 48], [2, 8], [12, 38], [line(3, 2)], 'Cuenta los saltos que separan el término 1 del 12.'),
    1: rect('Forma un rectángulo de diez columnas con dos copias de la suma $2+4+\\cdots+20$.', [12, 24], [10, 22],
      'Los términos se emparejan por los extremos. Cada pareja suma lo mismo.', { explain: 'El rectángulo tiene 220 unidades. Una copia de la suma vale 110.' }),
    2: probe('Sondea el número de bacterias tras seis horas, si empieza una y la cantidad se duplica cada hora.', [0, 7, 0, 130], 2, 6, x => 2 ** x,
      'El número de duplicaciones es el número de horas.'),
  }, ['alg-14', 'alg-14d', 'alg-14d']);
  assess('polinomios', [
    groups('Reúne las piezas semejantes de $(x+2)(x+7)$ para construir el polinomio.', ['Cuadrado', 'Lineales', 'Constante'],
      ['$7x$', '$x^2$', '$14$', '$2x$'], [1, 0, 2, 1], 'Solo las dos piezas lineales comparten la misma potencia de x.', { explain: '$x^2+9x+14$.' }),
    tiles('Para el término $a^3b^2$ de $(a+b)^5$, marca exactamente las dos posiciones que aportan b.', 5,
      ['1', '2', '3', '4', '5'], [1, 3], 'Puedes elegir cualquier par de las cinco posiciones.', { valid: v => v.length === 2, explain: 'Hay diez pares. El término completo es $10a^3b^2$.' }),
    probe('Lleva la sonda al cero positivo de $y=x^2-2x-15$ y suéltala.', [-6, 7, -18, 20], 0, 5, x => x * x - 2 * x - 15,
      'El factor que corresponde a la raíz positiva se anula en la rama derecha.', { motion: true }),
  ], {
    0: probe('Evalúa $x^2-4x+7$ en $x=-2$.', [-4, 5, 0, 42], 1, -2, x => x * x - 4 * x + 7, 'Sustituye con paréntesis en los dos términos variables.'),
    1: tiles('Pinta los tres términos que quedan al desarrollar $(3x-2)^2$.', 3,
      ['$9x^2$', '$-12x$', '$9x$', '$4$', '$-4x$', '$-4$'], [0, 1, 3],
      'La parte de grado 1 suma los productos mixtos.', { explain: 'Al desarrollar sale $9x^2-12x+4$.' }),
    2: rect('Construye una tabla de parejas ordenadas de siete objetos, sin repetir un objeto consigo mismo.', [9, 8], [7, 6],
      'Una primera elección deja seis posibilidades para la segunda. Cada pareja sin orden aparece dos veces.',
      { explain: '$\\binom72=7\\cdot6/2=21$.' }),
    4: tiles('Pinta los dos factores que recomponen $x^3+27$.', 2,
      ['$x+3$', '$x^2-3x+9$', '$x-3$', '$x^2+3x+9$'], [0, 1],
      'Es una suma de cubos. Al multiplicar, los términos mixtos se cancelan.', { explain: '$x^3+27=(x+3)(x^2-3x+9)$.' }),
  }, ['alg-3', 'alg-24c', 'alg-24b']);
  assess('cuadraticas', [
    point('Coloca el conjugado de $-2+3i$ en el plano complejo.', [-5, 5, -5, 5], [1, 0], [-2, -3], [],
      'Refleja sobre el eje real. La parte real queda fija y la imaginaria cambia de signo.'),
    rail('Equilibra la ecuación $5x-8=2x+7$.', [0, 10, 2, 5], x => tex(5 * x - 8 + '\\quad\\text{y}\\quad' + (2 * x + 7)),
      'Junta las copias de x en un miembro y las constantes en el otro.', { loads: x => [5 * x - 8, 2 * x + 7] }),
    probe('Encuentra la abscisa del máximo de $y=-(x-3)^2+8$.', [-2, 8, -9, 10], 0, 3, par(-1, 3, 8),
      'El término que se resta es un cuadrado y puede valer cero.', { motion: true }),
  ], {
    0: rail('Ajusta el valor real del producto $(2-i)(2+i)$.', [0, 10, 2, 5], v => format(v),
      'Multiplica como una diferencia de cuadrados y usa $i^2=-1$.', { explain: 'El producto es $4-i^2=5$.' }),
    1: point('Marca la intersección de $y=2(x+3)$ y $y=x-4$.', [-12, 2, -17, 10], [-3, 0], [-10, -14], [line(2, 6), line(1, -4)],
      'Simplifica primero la distributiva. El punto debe estar en las dos rectas.'),
    3: rail('Desliza hasta indicar el discriminante de $3x^2-2x-1$.', [-12, 24, 0, 16], v => format(v, '\\Delta'),
      'Eleva b al cuadrado y resta $4ac$, conservando el signo del término independiente.', { explain: '$(-2)^2-4\\cdot3(-1)=16$.' }),
    4: tiles('Marca en el tablero las raíces de $x^2+2x-8=0$.', 3, ['$-4$', '$-2$', '$0$', '$2$', '$4$', '$8$'],
      [0, 3], 'Dos factores lineales con constantes de producto −8 y suma 2 dejan ver las raíces.', { explain: 'Los factores son $(x+4)(x-2)$.' }),
  }, ['alg-23c', 'alg-1', 'alg-4a']);
  assess('grado-superior', [
    tiles('Pinta los puntos donde cruza el eje $y=(x+1)^2(x-2)(x-4)^3$.', 3, ['$-1$', '$2$', '$4$'],
      [1, 2], 'Solo la multiplicidad impar cambia el signo de la gráfica.', { explain: 'Cruza en 2 y 4. Rebota en −1.' }),
    rail('Ajusta el coeficiente de $x$ para que $x+2$ sea factor de $x^2+kx+6$.', [-2, 9, 1, 5],
      k => tex('P(-2)=10-2(' + k + ')=' + (10 - 2 * k)), 'El residuo que se obtiene al evaluar en −2 debe valer cero.', { loads: k => [10, 2 * k] }),
    probe('Lleva la sonda al valor que da el residuo de dividir $x^3-2x+1$ por $x+3$.', [-5, 5, -45, 45], 0, -3, x => x ** 3 - 2 * x + 1,
      'Para un divisor de la forma $x-r$, el residuo es $P(r)$.', { motion: true }),
  ], {
    0: groups('Reconstruye el cociente de $(x^2+2x-3)/(x-1)$ arrastrando las piezas que contiene.', ['Cociente', 'Fuera'], ['$x$', '$3$', '$-3$', '$x^2$'],
      [0, 0, 1, 1], 'Factoriza el dividendo y retira el factor que coincide con el divisor.', { explain: '$x^2+2x-3=(x-1)(x+3)$.' }),
    2: probe('Marca el valor de entrada que revela el residuo de dividir $2x^3-x+5$ entre $x+1$.', [-4, 4, -16, 22], 1, -1, x => 2 * x ** 3 - x + 5,
      'Evalúa donde el divisor es cero.'),
    4: tiles('Para $x^3-3x^2+2x+5$, pinta cada coeficiente que cambia de signo con respecto al anterior.', 4,
      ['1', '$-3$', '2', '5'], [1, 2], 'Recorre los coeficientes en orden descendente de grado.',
      { explain: 'Hay dos cambios de signo. Por la regla de Descartes puede haber dos raíces positivas o ninguna.' }),
  }, ['alg-93', 'alg-92', 'alg-92']);
  assess('racionales', [
    bridges('Construye el denominador común para sumar las dos expresiones.',
      [['3', 'x+1'], ['1', 'x-4']], ['x+1', 'x-4'], ['x+1', 'x-4', 'x-1', 'x+4'], [1, 0],
      'Cada expresión necesita el factor que le falta.', 'Queda $\\frac{4x-11}{(x+1)(x-4)}$, con $x\\ne-1,4$.'),
    groups('Clasifica los valores para $\\dfrac{(x+2)(x-5)}{(x+2)(x-1)}$.', ['Hueco', 'Asíntota', 'Permitido'],
      ['$-2$', '$1$', '$5$', '$0$'], [0, 1, 2, 2], 'Conserva todas las restricciones del denominador original.'),
    point('Encuentra la intersección con $x>0$ de $y=x^2-4$ y $y=2x+4$. Suelta para recorrer el plano.', [-5, 6, -6, 14],
      [0, 1], [4, 12], [par(1, 0, -4), line(2, 4)], 'Iguala las alturas y conserva la solución positiva.', { motion: true }),
  ], {
    2: bridges('Amplía lo necesario para sumar $\\frac3x+\\frac2{x^2}$.', [['3', 'x'], ['2', 'x^2']], ['x', 'x^2'],
      ['x', '1', 'x^2', 'x+1'], [0, 1], 'Solo falta un factor de x a la primera fracción.',
      '$\\frac3x+\\frac2{x^2}=\\frac{3x+2}{x^2}$, con $x\\ne0$.'),
    4: point('Encuentra el punto de corte de $y=x^2$ y $y=x+2$ que tiene abscisa negativa.', [-4, 4, -2, 12], [1, 1], [-1, 1],
      [par(1, 0, 0), line(1, 2)], 'Las dos curvas pueden tener más de un punto en común. Usa el que queda a la izquierda del eje vertical.'),
  }, ['alg-25b', 'alg-25a', 'alg-102']);
  assess('exp-log', [
    point('Marca en $y=2^x$ la altura que corresponde a dos pasos a la izquierda de cero.', [-4, 5, 0, 8], [1, 2], [-2, .25],
      [x => 2 ** x], 'Cada paso a la izquierda divide la altura anterior por 2.', { dy: .25 }),
    tiles('Pinta los argumentos que hacen que $\\log_2(x-4)$ sea positivo.', 3, ['$2$', '$4$', '$5$', '$6$', '$8$', '$3$'],
      [3, 4], 'Para un logaritmo en base mayor que 1, la salida positiva pide un argumento estrictamente mayor que 1.',
      { explain: '$x-4>1$, así que sirven 6 y 8.' }),
    probe('Encuentra el valor que hace $\\log_2(x+2)=4$. Suelta para recorrer la curva.', [-1, 20, 0, 5], 2, 14, x => Math.log2(x + 2),
      'Vuelve a la forma exponencial. Luego deshaz el desplazamiento de dos unidades.', { motion: true }),
  ], {
    1: rail('Ajusta el interés simple en miles que generan 200 mil pesos durante seis meses al 2 % mensual.',
      [0, 42, 10, 24], v => format(v, 'I'), 'Cada mes se añaden 4 mil pesos sobre el capital original.', { explain: '$200\\cdot0.02\\cdot6=24$ mil pesos.' }),
    2: dial('Elige en la rueda el exponente de base 4 que produce 64.', [0, 1, 2, 3, 4, 5], 3, v => tex('4^{' + v + '}=' + 4 ** v),
      'Parte de la unidad y cuenta las multiplicaciones por 4.'),
    3: probe('Sondea $3^x$ hasta alcanzar el producto $9\\cdot27$ que corresponde a la suma de logaritmos.', [0, 6, 0, 300], 2, 5, x => 3 ** x,
      'La suma de logaritmos de la misma base se convierte en el logaritmo de un producto.'),
    4: probe('Busca el valor aproximado de x que hace que $5^x$ llegue a 20.', [1, 2, 0, 26], 1, 1.86, x => 5 ** x,
      'La solución queda entre 1 y 2. Acerca la sonda a la altura dada.',
      { dx: .01, valid: x => Math.abs(5 ** x - 20) < .2, explain: '$x=\\log_5 20\\approx1.861$.' }),
  }, ['alg-71', 'alg-72', 'alg-73']);
})();
