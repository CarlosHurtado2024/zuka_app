// «La baraja que nadie ha visto» · lección alg-15 (Sumatoria y productoria). Datos puros (generados desde sumatoria.json).
// Historia (docs/storytelling-videos.md): en 1755 Euler usa la letra Σ para escribir sumas; en 1808 Christian Kramp
// propone n!. Analogías: desplegar una sigma, ordenar tres objetos. La sorpresa: una baraja bien mezclada casi seguro
// tiene un orden que nunca había existido (52! ≈ 8 · 10⁶⁷).
const D = (() => {
  const SCENES = [
    { id: 'euler', name: 'BERLÍN, 1755', dur: 28, formula: [['Σ', 'r']],
      caps: [[1.0, 9.0, 'Berlín, 1755', 'Leonhard Euler usa la letra Σ para sumar'], [9.6, 18.0, 'Σ es la S griega', 'la S de «suma»'], [18.6, 27.4, 'Una suma larga en un renglón', 'con un índice que recorre los términos']],
      narr: [[1.0, 9.0, 'Berlín, mil setecientos cincuenta y cinco. En un libro de cálculo, Leonhard Euler usa la letra griega sigma para escribir sumas.'], [9.6, 18.0, 'Sigma es la ese griega: la ese de suma.'], [18.6, 27.4, 'Con ella, una suma de cientos de términos cabe en un solo renglón.']] },
    { id: 'partes', name: 'LAS PARTES', dur: 30, formula: [['Σ', 'r'], ['ₖ₌₁', 'r'], ['⁵ (2', 'r'], ['k', 'i'], [' + 1)', 'r']],
      caps: [[0.8, 9.4, 'El índice k', 'recorre los enteros, de abajo hacia arriba'], [10.0, 19.4, 'Los límites', 'k = 1 abajo, 5 arriba'], [20.0, 29.4, 'El término general: 2k + 1', '3 + 5 + 7 + 9 + 11 = 35']],
      narr: [[0.8, 9.4, 'Una sumatoria tiene tres partes. La letra de abajo es el índice, que va tomando valores enteros.'], [10.0, 19.4, 'Los números de abajo y de arriba son los límites: dónde empieza y dónde termina el índice.'], [20.0, 29.4, 'Y lo que va al lado es el término general. Dos k más uno, de uno a cinco: tres más cinco más siete más nueve más once, treinta y cinco.']] },
    { id: 'desplegar', name: 'DESPLEGAR', dur: 28, formula: [['Σ', 'r'], ['ₖ₌₃', 'r'], ['⁶ 10', 'r'], ['k', 'i'], [' = 180', 'r']],
      caps: [[0.8, 9.4, 'Desplegar una sigma', 'reemplazar k por cada entero'], [10.0, 18.4, '10k, de k = 3 a k = 6', '30 + 40 + 50 + 60 = 180'], [19.0, 27.4, 'Cuántos términos hay', 'de 3 a 6 son 4: arriba − abajo + 1']],
      narr: [[0.8, 9.4, 'Para desplegar una sigma se reemplaza k por cada entero, desde el límite de abajo hasta el de arriba.'], [10.0, 18.4, 'Diez k, de k igual a tres hasta seis: treinta, cuarenta, cincuenta y sesenta. Suman ciento ochenta.'], [19.0, 27.4, 'El número de términos no es seis menos tres: de tres a seis hay cuatro, el de arriba menos el de abajo, más uno.']] },
    { id: 'lineal', name: 'LINEAL', dur: 30, formula: [['Σ(', 'r'], ['c', 'i'], ['a', 'i'], ['ₖ + ', 'r'], ['b', 'i'], ['ₖ) = ', 'r'], ['c', 'i'], ['Σ', 'r'], ['a', 'i'], ['ₖ + Σ', 'r'], ['b', 'i'], ['ₖ', 'r']],
      caps: [[0.8, 9.4, 'Las constantes salen', 'Σ 10k = 10 · Σ k'], [10.0, 19.4, 'Las sumas se separan', 'Σ (aₖ + bₖ) = Σ aₖ + Σ bₖ'], [20.0, 29.4, 'Por la distributiva', 'y porque se puede sumar en cualquier orden']],
      narr: [[0.8, 9.4, 'La sumatoria es lineal. Una constante que multiplica sale afuera: suma de diez k es diez por la suma de k.'], [10.0, 19.4, 'Y la suma de dos cosas se separa en dos sumas.'], [20.0, 29.4, 'No es magia: es la distributiva, y que una suma finita se puede hacer en cualquier orden.']] },
    { id: 'notables', name: 'SUMAS NOTABLES', dur: 28, formula: [['Σ', 'r'], ['k', 'i'], [' = ', 'r'], ['n', 'i'], ['(', 'r'], ['n', 'i'], [' + 1)/2', 'r']],
      caps: [[0.8, 9.4, 'Sumas que conviene saber', 'Σ de k = 1 a n de k = n (n + 1) / 2'], [10.0, 18.4, 'Los cuadrados', 'Σ k² = n (n + 1)(2n + 1) / 6'], [19.0, 27.4, 'Cuadrados del 1 al 10', '10 · 11 · 21 / 6 = 385']],
      narr: [[0.8, 9.4, 'Algunas sumas aparecen tanto que conviene saberlas. La de los primeros n naturales es n por n más uno, entre dos.'], [10.0, 18.4, 'La de sus cuadrados es n por n más uno, por dos n más uno, entre seis.'], [19.0, 27.4, 'Así, los cuadrados del uno al diez suman diez por once por veintiuno, entre seis: trescientos ochenta y cinco.']] },
    { id: 'producto', name: 'PRODUCTORIA', dur: 30, formula: [['Π', 'r'], ['ₖ₌₁', 'r'], ['⁴ (', 'r'], ['k', 'i'], [' + 1) = 120', 'r']],
      caps: [[0.8, 9.4, 'Productoria: Π, la P griega', 'abrevia productos largos'], [10.0, 19.4, 'Π de k = 1 a 4 de (k + 1)', '2 · 3 · 4 · 5 = 120'], [20.0, 29.4, 'Mismas partes que Σ', 'índice, límites y término general']],
      narr: [[0.8, 9.4, 'Para productos largos se usa pi mayúscula, la pe griega: la pe de producto.'], [10.0, 19.4, 'Producto de k más uno, de k igual a uno hasta cuatro: dos por tres por cuatro por cinco, ciento veinte.'], [20.0, 29.4, 'Tiene las mismas partes que la sumatoria: índice, límites y término general.']] },
    { id: 'factorial', name: 'EL FACTORIAL', dur: 28, formula: [['n', 'i'], ['! = 1 · 2 · 3 · … · ', 'r'], ['n', 'i']],
      caps: [[0.8, 9.4, 'El producto más famoso', 'n! = 1 · 2 · 3 · … · n'], [10.0, 18.4, 'Christian Kramp, 1808', 'propone escribirlo con un signo de admiración'], [19.0, 27.4, 'Crece muy rápido', '5! = 120, 10! = 3 628 800']],
      narr: [[0.8, 9.4, 'El producto más famoso es el factorial: n factorial es uno por dos por tres, y así hasta n.'], [10.0, 18.4, 'El signo de admiración lo propuso Christian Kramp en mil ochocientos ocho.'], [19.0, 27.4, 'Crece muy rápido: cinco factorial es ciento veinte; diez factorial, más de tres millones y medio.']] },
    { id: 'ordenar', name: 'MANERAS DE ORDENAR', dur: 30, formula: [['3! = 3 · 2 · 1 = 6', 'r']],
      caps: [[0.8, 9.4, 'n! cuenta ordenamientos', '3 objetos se ordenan de 6 maneras'], [10.0, 19.4, '3 opciones para el primero', 'luego 2, luego 1: 3 · 2 · 1'], [20.0, 29.4, 'Y 0! = 1, por convención', 'una sola manera de ordenar cero objetos']],
      narr: [[0.8, 9.4, 'El factorial cuenta de cuántas maneras se pueden ordenar n objetos. Tres objetos se ordenan de seis maneras.'], [10.0, 19.4, 'Para el primer lugar hay tres opciones; para el segundo, dos; para el último, una. Tres por dos por uno.'], [20.0, 29.4, 'Y se conviene que cero factorial es uno: hay una sola manera de ordenar cero objetos.']] },
    { id: 'baraja', name: 'UNA BARAJA', dur: 28, formula: [['52! ≈ 8 · 10⁶⁷', 'r']],
      caps: [[0.8, 9.4, 'Una baraja de 52 cartas', 'se puede ordenar de 52! maneras'], [10.0, 18.4, '52! ≈ 8 · 10⁶⁷', 'un número de 68 cifras'], [19.0, 27.4, 'Cada baraja bien mezclada', 'casi seguro nunca había existido']],
      narr: [[0.8, 9.4, 'Una baraja de cincuenta y dos cartas se puede ordenar de cincuenta y dos factorial maneras.'], [10.0, 18.4, 'Es un número de sesenta y ocho cifras: cerca de ocho por diez a la sesenta y siete.'], [19.0, 27.4, 'Por eso, cuando se mezcla bien una baraja, casi seguro su orden nunca había existido en la historia.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['Σ', 'r'], ['   ', 'r'], ['Π', 'r'], ['   ', 'r'], ['n', 'i'], ['!', 'r']],
      caps: [[0.8, 10.4, 'Σ, Π y n!', 'sumas, productos y ordenamientos']],
      narr: [[0.8, 10.4, 'Con la sigma de Euler, una suma de mil términos cabe en un renglón; con la pi, un producto también.'], [11.0, 20.4, 'Y el factorial cuenta las maneras de ordenar, aunque, como en la baraja, sean muchísimas.'], [21.0, 29.4, 'Tres letras para escribir cuentas enormes.']] },
  ];
  const WORLD = 'ÁLGEBRA · SUCESIONES Y SERIES', TITLE = 'SUMATORIA Y PRODUCTORIA', LINE = 'Σ para sumar, Π para multiplicar, n! para ordenar.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-15' };
})();
if (typeof module !== 'undefined') module.exports = D;
