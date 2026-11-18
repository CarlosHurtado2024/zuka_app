// «El problema de Cardano» · lección alg-23c (Números complejos). Datos puros (generados desde complejos.json).
// Historia (docs/storytelling-videos.md): en 1545 Cardano busca dos números que sumen 10 y multipliquen 40 y llega a
// 5 ± √−15; Bombelli (1572) da reglas para calcular con esas raíces. Analogía: multiplicar por −1 es media vuelta y por i,
// un cuarto de vuelta. La sorpresa: el resultado «imposible» de Cardano funciona al multiplicar: (5 + √15 i)(5 − √15 i) = 40.
const D = (() => {
  const SCENES = [
    { id: 'cardano', name: 'NÚREMBERG, 1545', dur: 28, formula: [['5 + √−15', 'r'], ['   ', 'r'], ['5 − √−15', 'r']],
      caps: [[1.0, 9.0, 'Núremberg, 1545', 'se imprime el «Ars Magna» de Cardano'], [9.6, 18.0, 'Dos números que sumen 10', 'y que multiplicados den 40'], [18.6, 27.4, 'Su respuesta: 5 ± √−15', 'una raíz de un número negativo']],
      narr: [[1.0, 9.0, 'Núremberg, mil quinientos cuarenta y cinco. Se imprime el Ars Magna de Gerolamo Cardano, el gran libro del álgebra de su tiempo.'], [9.6, 18.0, 'Allí se plantea partir el diez en dos números cuyo producto sea cuarenta.'], [18.6, 27.4, 'La cuenta le da cinco más raíz de menos quince, y cinco menos raíz de menos quince. Una raíz de un número negativo: algo que parecía no existir.']] },
    { id: 'ningun', name: 'NINGÚN REAL', dur: 28, formula: [['x', 'i'], ['² ≥ 0', 'r']],
      caps: [[0.8, 9.4, 'Ningún real al cuadrado es negativo', '3² = 9 y (−3)² = 9'], [10.0, 18.4, 'Ningún cuadrado queda a la izquierda', 'x² = −1 no tiene solución real'], [19.0, 27.4, 'Hace falta un número nuevo', 'fuera de la recta']],
      narr: [[0.8, 9.4, 'El problema es que ningún número real al cuadrado da negativo: tres al cuadrado es nueve, y menos tres al cuadrado, también.'], [10.0, 18.4, 'Ningún cuadrado cae a la izquierda del cero. Así que x al cuadrado igual a menos uno no tiene solución en la recta.'], [19.0, 27.4, 'Para resolverlo hace falta un número nuevo, que no esté en la recta.']] },
    { id: 'i', name: 'EL NÚMERO i', dur: 30, formula: [['i', 'i'], ['² = −1', 'r']],
      caps: [[0.8, 9.4, 'Se define i con i² = −1', 'la unidad imaginaria'], [10.0, 19.4, '√−25 = 5i', 'porque (5i)² = 25 · i² = −25'], [20.0, 29.4, '√−15 = √15 i', 'así se escribe la respuesta de Cardano']],
      narr: [[0.8, 9.4, 'Se define un número, i, cuyo cuadrado es menos uno. Se llama la unidad imaginaria.'], [10.0, 19.4, 'Con él, raíz de menos veinticinco es cinco i, porque cinco i al cuadrado es veinticinco por menos uno.'], [20.0, 29.4, 'Y raíz de menos quince es raíz de quince por i. Así se escribe la respuesta de Cardano: cinco más o menos raíz de quince i.']] },
    { id: 'vuelta', name: 'UN CUARTO DE VUELTA', dur: 30, formula: [['i', 'i'], [' · ', 'r'], ['i', 'i'], [' = −1', 'r']],
      caps: [[0.8, 9.4, 'Por −1 es media vuelta', 'el 1 gira 180° y queda en −1'], [10.0, 19.4, 'Por i es un cuarto de vuelta', 'el 1 gira 90° y sube a i'], [20.0, 29.4, 'Dos cuartos son media vuelta', 'por eso i · i = −1']],
      narr: [[0.8, 9.4, 'La pregunta es dónde vive i. Una imagen ayuda: multiplicar por menos uno es dar media vuelta alrededor del cero.'], [10.0, 19.4, 'Si dos multiplicaciones por i tienen que dar menos uno, cada una debe ser la mitad de media vuelta: un cuarto de vuelta. El uno gira y sube a i.'], [20.0, 29.4, 'Dos cuartos de vuelta hacen media vuelta. Por eso i por i es menos uno: i vive arriba, fuera de la recta.']] },
    { id: 'plano', name: 'EL PLANO', dur: 28, formula: [['a', 'i'], [' + ', 'r'], ['b', 'i'], ['i', 'i']],
      caps: [[0.8, 9.4, 'Los complejos forman un plano', 'a + bi: a hacia la derecha, b hacia arriba'], [10.0, 18.4, '2 + 3i es un punto', 'parte real 2, parte imaginaria 3'], [19.0, 27.4, 'Los reales son el eje horizontal', 'los complejos con b = 0']],
      narr: [[0.8, 9.4, 'Los números complejos son de la forma a más b i, y se dibujan en un plano: a hacia la derecha, b hacia arriba.'], [10.0, 18.4, 'Dos más tres i es el punto que está dos a la derecha y tres arriba. La parte real es dos y la imaginaria, tres.'], [19.0, 27.4, 'Los números reales siguen ahí: son el eje horizontal, los complejos con parte imaginaria cero.']] },
    { id: 'suma', name: 'SUMAR', dur: 28, formula: [['(2 + 3', 'r'], ['i', 'i'], [') + (4 − ', 'r'], ['i', 'i'], [') = 6 + 2', 'r'], ['i', 'i']],
      caps: [[0.8, 9.4, 'Sumar complejos', 'real con real, imaginaria con imaginaria'], [10.0, 18.4, '(2 + 3i) + (4 − i) = 6 + 2i', 'como juntar términos semejantes'], [19.0, 27.4, 'En el plano, flechas encadenadas', 'una flecha a continuación de la otra']],
      narr: [[0.8, 9.4, 'Sumar complejos es como sumar polinomios: parte real con parte real, parte imaginaria con parte imaginaria.'], [10.0, 18.4, 'Dos más tres i, más cuatro menos i, da seis más dos i.'], [19.0, 27.4, 'En el plano se ve como dos flechas puestas una a continuación de la otra.']] },
    { id: 'producto', name: 'MULTIPLICAR', dur: 30, formula: [['i', 'i'], ['(3 + 2', 'r'], ['i', 'i'], [') = −2 + 3', 'r'], ['i', 'i']],
      caps: [[0.8, 9.4, 'Se multiplica como binomios', 'y donde aparece i² se pone −1'], [10.0, 19.4, 'i (3 + 2i) = 3i + 2i² = −2 + 3i', 'el punto gira un cuarto de vuelta'], [20.0, 29.4, '(1 + i)(1 + i) = 1 + 2i + i² = 2i', 'multiplicar también gira']],
      narr: [[0.8, 9.4, 'Para multiplicar se reparte como con binomios, y donde aparece i al cuadrado se pone menos uno.'], [10.0, 19.4, 'Por ejemplo, i por tres más dos i es tres i más dos i al cuadrado: menos dos más tres i. En el plano, el punto giró un cuarto de vuelta.'], [20.0, 29.4, 'Y uno más i, al cuadrado, es uno más dos i más i al cuadrado: dos i. Multiplicar complejos estira y gira.']] },
    { id: 'conjugado', name: 'EL CONJUGADO', dur: 30, formula: [['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], ['i', 'i'], [')(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], ['i', 'i'], [') = ', 'r'], ['a', 'i'], ['² + ', 'r'], ['b', 'i'], ['²', 'r']],
      caps: [[0.8, 9.4, 'El conjugado de a + bi', 'es a − bi: su reflejo en el eje real'], [10.0, 19.4, 'Un complejo por su conjugado', '(a + bi)(a − bi) = a² + b², un real'], [20.0, 29.4, 'El módulo: distancia al 0', '|a + bi| = √(a² + b²)']],
      narr: [[0.8, 9.4, 'El conjugado de a más b i es a menos b i: su reflejo al otro lado del eje real.'], [10.0, 19.4, 'Un complejo por su conjugado da a al cuadrado más b al cuadrado, un real sin i. Con tres más cuatro i: veinticinco.'], [20.0, 29.4, 'Su raíz es el módulo, la distancia del punto al cero, por el teorema de Pitágoras.']] },
    { id: 'comprobar', name: 'LA PRUEBA DE CARDANO', dur: 30, formula: [['(5 + √15', 'r'], ['i', 'i'], [')(5 − √15', 'r'], ['i', 'i'], [') = 40', 'r']],
      caps: [[0.8, 9.4, 'Sumar las dos respuestas', '(5 + √15 i) + (5 − √15 i) = 10'], [10.0, 19.4, 'Multiplicarlas', 'son conjugadas: 5² + 15 = 40'], [20.0, 29.4, 'Bolonia, 1572', 'Bombelli da reglas para calcular con i']],
      narr: [[0.8, 9.4, 'Volvamos a Cardano. Si se suman sus dos respuestas, las partes imaginarias se cancelan: diez.'], [10.0, 19.4, 'Y como son conjugadas, su producto es cinco al cuadrado más quince: cuarenta. El propio Cardano hizo esta cuenta.'], [20.0, 29.4, 'En mil quinientos setenta y dos, Rafael Bombelli escribió reglas para calcular con estos números, y desde entonces no han dejado de usarse.']] },
    { id: 'cierre', name: 'CIERRE', dur: 26, formula: [['i', 'i'], ['² = −1', 'r']],
      caps: [[0.8, 10.4, 'Lo que parecía imposible', 'un cuarto de vuelta fuera de la recta']],
      narr: [[0.8, 10.4, 'Cardano llamó a esas raíces tan sutiles como inútiles. Hoy se usan para calcular circuitos eléctricos, ondas y señales.'], [11.0, 20.4, 'Bastó aceptar un número nuevo, i, y entender que multiplicar por él es girar un cuarto de vuelta.'], [21.0, 25.4, 'Con i, cada punto del plano es un número.']] },
  ];
  const WORLD = 'ÁLGEBRA · PARÁBOLAS Y COMPLEJOS', TITLE = 'NÚMEROS COMPLEJOS', LINE = 'Un cuarto de vuelta: el número i.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-23c' };
})();
if (typeof module !== 'undefined') module.exports = D;
