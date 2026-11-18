// «Las tablas de Napier» · lección alg-72 (Logaritmos y sus propiedades). Datos puros (generados desde logaritmos.json).
// Historia (docs/storytelling-videos.md): en 1614 John Napier publica los logaritmos para convertir multiplicaciones en
// sumas; en 1617 Henry Briggs los lleva a base 10. Aplicación: el pH (un jugo de limón de pH 2 frente al agua de pH 7).
// La sorpresa: una diferencia de 5 en el pH es un factor de 100 000.
const D = (() => {
  const SCENES = [
    { id: 'napier', name: 'EDIMBURGO, 1614', dur: 28, formula: [['log', 'r'], ['(', 'r'], ['ab', 'i'], [') = log ', 'r'], ['a', 'i'], [' + log ', 'r'], ['b', 'i']],
      caps: [[1.0, 9.0, 'Edimburgo, 1614', 'John Napier publica los logaritmos'], [9.6, 18.0, 'Multiplicar es lento', 'sumar es rápido'], [18.6, 27.4, 'Sus tablas convierten', 'multiplicaciones en sumas']],
      narr: [[1.0, 9.0, 'Edimburgo, mil seiscientos catorce. John Napier publica un libro con tablas de unos números nuevos: los logaritmos.'], [9.6, 18.0, 'Los astrónomos pasaban días multiplicando números de muchas cifras. Sumar sus logaritmos es mucho más rápido.'], [18.6, 27.4, 'Las tablas de Napier convertían multiplicaciones en sumas. La idea está en los exponentes.']] },
    { id: 'pregunta', name: 'AL REVÉS DE LA POTENCIA', dur: 28, formula: [['log', 'r'], ['₂ 32 = 5', 'r']],
      caps: [[0.8, 9.4, '2⁵ = 32', 'conocida la base y el exponente, sale el resultado'], [10.0, 18.4, 'Al revés: 2 elevado a cuánto da 32', 'eso es el logaritmo: log₂ 32 = 5'], [19.0, 27.4, 'El logaritmo es un exponente', 'el que hay que ponerle a la base']],
      narr: [[0.8, 9.4, 'Dos a la quinta es treinta y dos: con la base y el exponente sale el resultado.'], [10.0, 18.4, 'El logaritmo responde lo contrario: a qué exponente hay que elevar el dos para que dé treinta y dos. Cinco.'], [19.0, 27.4, 'Se escribe logaritmo en base dos de treinta y dos igual a cinco. El logaritmo es un exponente.']] },
    { id: 'definicion', name: 'LA DEFINICIÓN', dur: 30, formula: [['log', 'r'], ['b', 'sb'], [' ', 'r'], ['a', 'i'], [' = ', 'r'], ['c', 'i'], ['  ⟺  ', 'r'], ['b', 'i'], ['ᶜ = ', 'r'], ['a', 'i']],
      caps: [[0.8, 9.4, 'log en base b de a = c: bᶜ = a', 'dos maneras de decir lo mismo'], [10.0, 19.4, 'log₁₀ 1 000 = 3', 'porque 10³ = 1 000'], [20.0, 29.4, 'Base positiva y distinta de 1', 'y solo hay logaritmo de números positivos']],
      narr: [[0.8, 9.4, 'En general, logaritmo en base b de a igual a c significa que b a la c es a. Son dos maneras de decir lo mismo.'], [10.0, 19.4, 'Por ejemplo, logaritmo en base diez de mil es tres, porque diez al cubo es mil.'], [20.0, 29.4, 'La base tiene que ser positiva y distinta de uno, y solo hay logaritmo de números positivos, porque b a la c nunca da cero ni negativo.']] },
    { id: 'grafica', name: 'EL ESPEJO', dur: 28, formula: [['y', 'i'], [' = log', 'r'], ['₂ ', 'r'], ['x', 'i']],
      caps: [[0.8, 9.4, 'La gráfica de log₂ x', 'es el reflejo de 2ˣ en la recta y = x'], [10.0, 18.4, 'Pasa por (1, 0)', 'log de 1 es 0 en cualquier base'], [19.0, 27.4, 'Crece cada vez más despacio', 'y el eje y es su asíntota']],
      narr: [[0.8, 9.4, 'La gráfica del logaritmo es el reflejo de la exponencial en la recta y igual a x: se intercambian los papeles de x y y.'], [10.0, 18.4, 'Pasa por uno, cero: el logaritmo de uno es cero en cualquier base, porque toda base a la cero es uno.'], [19.0, 27.4, 'Crece cada vez más despacio, y se pega al eje y sin tocarlo.']] },
    { id: 'producto', name: 'PRODUCTO EN SUMA', dur: 30, formula: [['8 · 32 = 256', 'r'], ['    3 + 5 = 8', 'r']],
      caps: [[0.8, 9.4, '8 · 32: en potencias de 2', '2³ · 2⁵ = 2⁸ = 256'], [10.0, 19.4, 'Los exponentes se suman', 'log₂ 8 + log₂ 32 = log₂ 256'], [20.0, 29.4, 'log (ab) = log a + log b', 'la idea de Napier']],
      narr: [[0.8, 9.4, 'Ocho por treinta y dos: en potencias de dos es dos al cubo por dos a la quinta, dos a la ocho, doscientos cincuenta y seis.'], [10.0, 19.4, 'Al multiplicar, los exponentes se suman: tres más cinco, ocho. Los logaritmos se suman.'], [20.0, 29.4, 'El logaritmo de un producto es la suma de los logaritmos. Esa es la idea de Napier.']] },
    { id: 'propiedades', name: 'COCIENTE Y POTENCIA', dur: 28, formula: [['log', 'r'], ['(', 'r'], ['a', 'i'], ['ⁿ', 'r'], [') = ', 'r'], ['n', 'i'], [' log ', 'r'], ['a', 'i']],
      caps: [[0.8, 9.4, 'log (a/b) = log a − log b', 'un cociente se vuelve resta'], [10.0, 18.4, 'log (aⁿ) = n log a', 'el exponente sale adelante'], [19.0, 27.4, 'log (a + b) no se parte', 'log₁₀ (10 + 10) ≠ 1 + 1']],
      narr: [[0.8, 9.4, 'Del mismo modo, el logaritmo de un cociente es una resta de logaritmos.'], [10.0, 18.4, 'Y el de una potencia baja el exponente adelante: logaritmo de a a la n es n por logaritmo de a.'], [19.0, 27.4, 'Pero el logaritmo de una suma no se parte: logaritmo de diez más diez no es uno más uno.']] },
    { id: 'briggs', name: 'LONDRES, 1617', dur: 30, formula: [['log', 'r'], ['₁₀ 1 000 = 3', 'r']],
      caps: [[0.8, 9.4, 'Londres, 1617', 'Henry Briggs publica tablas en base 10'], [10.0, 19.4, 'log 10 = 1, log 100 = 2', 'log 1 000 = 3: cuenta los ceros'], [20.0, 29.4, 'log 500 ≈ 2.7', 'entre 100 y 1 000: entre 2 y 3']],
      narr: [[0.8, 9.4, 'Londres, mil seiscientos diecisiete. Henry Briggs, que había visitado a Napier, publica las primeras tablas en base diez.'], [10.0, 19.4, 'Con base diez, el logaritmo de diez es uno, el de cien es dos, el de mil es tres: cuenta los ceros.'], [20.0, 29.4, 'Y para los números de en medio da decimales: quinientos está entre cien y mil, y su logaritmo, cerca de dos punto siete.']] },
    { id: 'ph', name: 'EL pH', dur: 30, formula: [['pH', 'r'], [' = −log', 'r'], ['₁₀', 'r'], ['[H⁺]', 'r']],
      caps: [[0.8, 9.4, 'El pH mide lo ácido', 'pH = −log [H⁺]'], [10.0, 19.4, 'Agua pura: pH 7; jugo de limón: pH 2', 'una diferencia de 5'], [20.0, 29.4, '10⁵ = 100 000 veces más ácido', '100 000 veces más iones H⁺']],
      narr: [[0.8, 9.4, 'El pH mide qué tan ácido es un líquido: es menos el logaritmo de la concentración de iones de hidrógeno.'], [10.0, 19.4, 'El agua pura tiene pH siete; el jugo de limón, más o menos dos. La diferencia parece pequeña: cinco.'], [20.0, 29.4, 'Pero cada punto es un factor de diez: el limón tiene cien mil veces más iones de hidrógeno que el agua.']] },
    { id: 'cambio', name: 'CAMBIO DE BASE', dur: 28, formula: [['log', 'r'], ['b', 'sb'], [' ', 'r'], ['a', 'i'], [' = log ', 'r'], ['a', 'i'], [' / log ', 'r'], ['b', 'i']],
      caps: [[0.8, 9.4, 'Cambio de base', 'se divide entre el logaritmo de la base'], [10.0, 18.4, 'log₃ 50 = log 50 / log 3', '≈ 1.699 / 0.477 ≈ 3.56'], [19.0, 27.4, 'Se comprueba', '3^3.56 ≈ 50']],
      narr: [[0.8, 9.4, 'Con una sola tabla, o con la calculadora, se calcula cualquier base: se divide entre el logaritmo de la base.'], [10.0, 18.4, 'Logaritmo en base tres de cincuenta es logaritmo de cincuenta entre logaritmo de tres: más o menos tres punto cinco seis.'], [19.0, 27.4, 'Y se comprueba: tres a la tres punto cinco seis da casi cincuenta.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['log', 'r'], ['b', 'sb'], [' ', 'r'], ['a', 'i'], [' = ', 'r'], ['c', 'i'], ['  ⟺  ', 'r'], ['b', 'i'], ['ᶜ = ', 'r'], ['a', 'i']],
      caps: [[0.8, 10.4, 'Las tablas de Napier', 'multiplicar sumando']],
      narr: [[0.8, 10.4, 'Se le atribuye a Laplace decir que los logaritmos duplicaron la vida de los astrónomos, porque les ahorraron meses de cuentas.'], [11.0, 20.4, 'El logaritmo es un exponente: convierte productos en sumas y potencias en productos.'], [21.0, 29.4, 'Y mide en escalas como el pH, donde cada paso es diez veces más.']] },
  ];
  const WORLD = 'ÁLGEBRA · CRECIMIENTO EXPONENCIAL', TITLE = 'LOGARITMOS', LINE = 'El logaritmo es un exponente.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-72' };
})();
if (typeof module !== 'undefined') module.exports = D;
