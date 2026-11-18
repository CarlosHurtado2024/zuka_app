// «Multiplicar es fácil» · lección alg-24b (Factorización). Datos puros (generados desde factorizacion.json).
// Historia (docs/storytelling-videos.md): en 1977 Rivest, Shamir y Adleman basan el cifrado RSA en que multiplicar dos
// primos es fácil y deshacerlo es muy difícil (61 · 53 = 3 233). Factorizar polinomios es deshacer la distributiva.
// Analogías: el rectángulo de lados desconocidos, la esquina que falta. La sorpresa: x² + 4 no se factoriza en los reales.
const D = (() => {
  const SCENES = [
    { id: 'rsa', name: 'ESTADOS UNIDOS, 1977', dur: 28, formula: [['61 · 53 = 3 233', 'r']],
      caps: [[1.0, 9.0, 'Estados Unidos, 1977', 'Rivest, Shamir y Adleman inventan el RSA'], [9.6, 18.0, 'Multiplicar dos primos es fácil', '61 · 53 = 3 233'], [18.6, 27.4, 'Ir de vuelta es difícil', 'de 3 233 a 61 · 53 hay que buscar']],
      narr: [[1.0, 9.0, 'Estados Unidos, mil novecientos setenta y siete. Tres investigadores, Rivest, Shamir y Adleman, inventan un sistema para cifrar mensajes.'], [9.6, 18.0, 'Su idea: multiplicar dos números primos es fácil. Sesenta y uno por cincuenta y tres, tres mil doscientos treinta y tres.'], [18.6, 27.4, 'Pero ir de vuelta, de tres mil doscientos treinta y tres a sus factores, obliga a buscar. Con números enormes, casi imposible.']] },
    { id: 'factorizar', name: 'FACTORIZAR', dur: 28, formula: [['suma', 'it'], ['  ⟶  ', 'r'], ['producto', 'it']],
      caps: [[0.8, 9.4, 'Factorizar un polinomio', 'escribirlo como un producto'], [10.0, 18.4, 'Es deshacer la distributiva', 'de 2x² + 7x + 3 a (x + 3)(2x + 1)'], [19.0, 27.4, 'Hallar los lados de un rectángulo', 'conociendo la fórmula de su área']],
      narr: [[0.8, 9.4, 'Con los polinomios pasa algo parecido. Factorizar es escribir un polinomio como un producto.'], [10.0, 18.4, 'Es deshacer la distributiva: de dos x al cuadrado más siete x más tres, volver a x más tres por dos x más uno.'], [19.0, 27.4, 'Es como conocer la fórmula del área de un rectángulo y buscar la de sus lados.']] },
    { id: 'comun', name: 'FACTOR COMÚN', dur: 30, formula: [['6', 'r'], ['x', 'i'], ['² + 9', 'r'], ['x', 'i'], [' = 3', 'r'], ['x', 'i'], ['(2', 'r'], ['x', 'i'], [' + 3)', 'r']],
      caps: [[0.8, 9.4, 'Lo primero: el factor común', 'lo que se repite en todos los términos'], [10.0, 19.4, '6x² + 9x', 'los dos tienen un 3 y una x'], [20.0, 29.4, '3x(2x + 3)', 'se comprueba multiplicando']],
      narr: [[0.8, 9.4, 'Lo primero que se busca es un factor común: algo que esté en todos los términos.'], [10.0, 19.4, 'En seis x al cuadrado más nueve x, los dos términos tienen un tres y una x.'], [20.0, 29.4, 'Sale tres x por dos x más tres. Y se comprueba multiplicando de vuelta.']] },
    { id: 'diferencia', name: 'DIFERENCIA DE CUADRADOS', dur: 28, formula: [['4', 'r'], ['x', 'i'], ['² − 25 = (2', 'r'], ['x', 'i'], [' − 5)(2', 'r'], ['x', 'i'], [' + 5)', 'r']],
      caps: [[0.8, 9.4, 'Diferencia de cuadrados', 'a² − b² = (a − b)(a + b)'], [10.0, 18.4, '4x² − 25', '4x² = (2x)² y 25 = 5²'], [19.0, 27.4, '(2x − 5)(2x + 5)', 'la suma por diferencia, al revés']],
      narr: [[0.8, 9.4, 'Una diferencia de cuadrados se factoriza como suma por diferencia.'], [10.0, 18.4, 'Cuatro x al cuadrado menos veinticinco: cuatro x al cuadrado es dos x, al cuadrado, y veinticinco es cinco al cuadrado.'], [19.0, 27.4, 'Queda dos x menos cinco por dos x más cinco: el producto notable, leído al revés.']] },
    { id: 'trinomio', name: 'x² + bx + c', dur: 30, formula: [['x', 'i'], ['² + ', 'r'], ['x', 'i'], [' − 12 = (', 'r'], ['x', 'i'], [' + 4)(', 'r'], ['x', 'i'], [' − 3)', 'r']],
      caps: [[0.8, 9.4, 'Un trinomio x² + bx + c', 'se buscan dos números'], [10.0, 19.4, 'que multiplicados den c', 'y sumados den b'], [20.0, 29.4, 'x² + x − 12', '4 · (−3) = −12 y 4 + (−3) = 1']],
      narr: [[0.8, 9.4, 'Para un trinomio como x al cuadrado más b x más c, se buscan dos números.'], [10.0, 19.4, 'Tienen que dar c al multiplicarse, y b al sumarse: es la regla de x más a por x más b, al revés.'], [20.0, 29.4, 'En x al cuadrado más x menos doce: cuatro y menos tres multiplican menos doce y suman uno. Queda x más cuatro por x menos tres.']] },
    { id: 'perfecto', name: 'CUADRADO PERFECTO', dur: 28, formula: [['x', 'i'], ['² + 10', 'r'], ['x', 'i'], [' + 25 = (', 'r'], ['x', 'i'], [' + 5)²', 'r']],
      caps: [[0.8, 9.4, 'Trinomio cuadrado perfecto', 'a² + 2ab + b² = (a + b)²'], [10.0, 18.4, 'x² + 10x + 25', '25 = 5² y 10x = 2 · x · 5'], [19.0, 27.4, '(x + 5)²', 'el rectángulo resulta ser un cuadrado']],
      narr: [[0.8, 9.4, 'Si el trinomio es el cuadrado de un binomio, se llama trinomio cuadrado perfecto.'], [10.0, 18.4, 'En x al cuadrado más diez x más veinticinco: veinticinco es cinco al cuadrado, y diez x es justo el doble producto.'], [19.0, 27.4, 'Se factoriza como x más cinco, al cuadrado: el rectángulo resultó ser un cuadrado.']] },
    { id: 'completar', name: 'COMPLETAR EL CUADRADO', dur: 30, formula: [['x', 'i'], ['² + 6', 'r'], ['x', 'i'], [' + 13 = (', 'r'], ['x', 'i'], [' + 3)² + 4', 'r']],
      caps: [[0.8, 9.4, 'Cuando no cuadra', 'x² + 6x + 13'], [10.0, 19.4, '(x + 3)² = x² + 6x + 9', 'sobran 4'], [20.0, 29.4, 'x² + 6x + 13 = (x + 3)² + 4', 'completar el cuadrado']],
      narr: [[0.8, 9.4, 'No siempre cuadra. En x al cuadrado más seis x más trece no hay dos números que multipliquen trece y sumen seis.'], [10.0, 19.4, 'Pero x más tres, al cuadrado, es x al cuadrado más seis x más nueve. Al trece le sobran cuatro.'], [20.0, 29.4, 'Se escribe x más tres, al cuadrado, más cuatro. No es un producto, pero muestra que nunca baja de cuatro.']] },
    { id: 'nosiempre', name: 'NO SIEMPRE SE PUEDE', dur: 28, formula: [['x', 'i'], ['² + 4 > 0', 'r']],
      caps: [[0.8, 9.4, 'x² + 4 no se factoriza', 'con números reales'], [10.0, 18.4, 'x² ≥ 0, así que x² + 4 ≥ 4', 'nunca vale 0'], [19.0, 27.4, 'Si se factorizara en (x − r)(…)', 'valdría 0 en x = r']],
      narr: [[0.8, 9.4, 'Y a veces no se puede. Equis al cuadrado más cuatro no se factoriza con números reales.'], [10.0, 18.4, 'Como x al cuadrado nunca es negativo, x al cuadrado más cuatro vale al menos cuatro: nunca es cero.'], [19.0, 27.4, 'Si se pudiera escribir como x menos r por otro factor, valdría cero en x igual a r. Y eso no pasa.']] },
    { id: 'grande', name: 'NÚMEROS ENORMES', dur: 30, formula: [['RSA-250', 'r']],
      caps: [[0.8, 9.4, 'Febrero de 2020', 'se factoriza RSA-250, un número de 250 cifras'], [10.0, 19.4, 'Miles de años de cómputo', 'repartidos entre muchos computadores'], [20.0, 29.4, 'Las claves de hoy son más largas', 'por eso RSA sigue en uso']],
      narr: [[0.8, 9.4, 'En febrero de dos mil veinte, un equipo logró factorizar un número de doscientas cincuenta cifras llamado RSA doscientos cincuenta.'], [10.0, 19.4, 'Necesitaron el equivalente a unos dos mil setecientos años de un núcleo de procesador, repartidos entre muchos computadores.'], [20.0, 29.4, 'Las claves que se usan hoy son todavía más largas: multiplicar es fácil, y factorizar sigue siendo el candado.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['2', 'r'], ['x', 'i'], ['² + 7', 'r'], ['x', 'i'], [' + 3 = (', 'r'], ['x', 'i'], [' + 3)(2', 'r'], ['x', 'i'], [' + 1)', 'r']],
      caps: [[0.8, 10.4, 'Multiplicar es fácil', 'volver atrás pide reconocer la forma']],
      narr: [[0.8, 10.4, 'Multiplicar es fácil; volver atrás pide reconocer la forma: un factor común, una diferencia de cuadrados, dos números que suman y multiplican.'], [11.0, 20.4, 'Con los polinomios, eso es factorizar.'], [21.0, 29.4, 'Con los números enormes, es lo que protege muchas claves en internet.']] },
  ];
  const WORLD = 'ÁLGEBRA · ÁLGEBRA DE POLINOMIOS', TITLE = 'FACTORIZACIÓN', LINE = 'Factorizar: volver de la suma al producto.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-24b' };
})();
if (typeof module !== 'undefined') module.exports = D;
