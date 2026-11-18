// «Los signos de Harriot» · lección alg-12d (Axiomas de orden y valor absoluto). Datos puros.
// Historia (docs/storytelling-videos.md): los signos < y > aparecen en el libro de Thomas Harriot, publicado en 1631, diez
// años después de su muerte; las barras del valor absoluto las usó Karl Weierstrass en 1841. Analogías que se repiten:
// temperaturas, deudas y la tolerancia de una pieza de fábrica. La sorpresa: multiplicar por un negativo voltea la
// desigualdad, porque refleja la recta. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'harriot', name: 'INGLATERRA, 1631', dur: 28, formula: [['a', 'i'], [' < ', 'r'], ['b', 'i'], ['      ', 'r'], ['b', 'i'], [' > ', 'r'], ['a', 'i']],
      caps: [[1.0, 9.0, 'Inglaterra, 1631', 'se publica el libro de Thomas Harriot'], [9.6, 18.0, 'Trae dos signos nuevos', '< «menor que» y > «mayor que»'], [18.6, 27.4, 'La abertura mira al mayor', 'la punta señala al menor']],
      narr: [[1.0, 9.0, 'Inglaterra, 1631. Diez años después de su muerte, se publica el libro de álgebra de Thomas Harriot, uno de los primeros en mirar la Luna con telescopio.'], [9.6, 18.0, 'En ese libro aparecen por primera vez dos signos que hoy usa todo el mundo: menor que y mayor que.'], [18.6, 27.4, 'La regla para no confundirlos: la abertura queda del lado del número mayor, y la punta señala al menor.']] },
    { id: 'tricotomia', name: 'TRICOTOMÍA', dur: 26, formula: [['a', 'i'], [' > 0   o   ', 'r'], ['a', 'i'], [' = 0   o   ', 'r'], ['a', 'i'], [' < 0', 'r']],
      caps: [[0.8, 9.4, 'Tricotomía', 'todo real es positivo, cero o negativo'], [10.0, 25.4, 'Solo una de las tres', 'nunca dos a la vez, nunca ninguna']],
      narr: [[0.8, 9.4, 'Para ordenar los números hacen falta reglas, como en el video de los axiomas. La primera se llama tricotomía: todo número real es positivo, cero o negativo.'], [10.0, 25.4, 'Y siempre es exactamente una de las tres. Ningún número es positivo y negativo a la vez, y ninguno se queda sin lugar.']] },
    { id: 'menor', name: 'QUÉ ES MENOR', dur: 30, formula: [['a', 'i'], [' < ', 'r'], ['b', 'i'], ['  ⟺  ', 'r'], ['b', 'i'], [' − ', 'r'], ['a', 'i'], [' > 0', 'r']],
      caps: [[0.8, 9.4, 'a < b quiere decir', 'que b − a es positivo'], [10.0, 19.4, 'En la recta', 'el mayor siempre está más a la derecha'], [20.0, 29.4, 'Con temperaturas', '−12 °C < −3 °C: hace más frío']],
      narr: [[0.8, 9.4, 'Decir que a es menor que b quiere decir que la diferencia b menos a es positiva: a b le sobra algo respecto a a.'], [10.0, 19.4, 'En la recta eso se ve fácil: el número mayor siempre está más a la derecha.'], [20.0, 29.4, 'Con temperaturas: menos doce grados es menor que menos tres, aunque doce sea más grande que tres. Hace más frío.']] },
    { id: 'menorigual', name: 'MENOR O IGUAL', dur: 26, formula: [['v', 'i'], [' ≤ 60', 'r']],
      caps: [[0.8, 9.4, '≤ se lee «menor o igual»', 'vale si es menor o si es igual'], [10.0, 25.4, 'Un letrero de velocidad máxima', 'v ≤ 60 km/h: ir a 60 también está permitido']],
      narr: [[0.8, 9.4, 'Este otro signo se lee menor o igual. Se cumple si el número es menor, o si es igual.'], [10.0, 25.4, 'Un letrero de velocidad máxima sesenta dice eso: la velocidad tiene que ser menor o igual a sesenta. Ir a sesenta está permitido. A sesenta y uno, no.']] },
    { id: 'sumar', name: 'SUMAR CONSERVA', dur: 26, formula: [['a', 'i'], [' < ', 'r'], ['b', 'i'], ['  ⟹  ', 'r'], ['a', 'i'], [' + ', 'r'], ['c', 'i'], [' < ', 'r'], ['b', 'i'], [' + ', 'r'], ['c', 'i']],
      caps: [[0.8, 9.4, 'Sumar conserva el orden', 'a los dos se les suma lo mismo'], [10.0, 25.4, 'Las dos ciudades suben 5 °C', 'la más fría sigue siendo la más fría']],
      narr: [[0.8, 9.4, 'Si a los dos lados de una desigualdad se les suma el mismo número, el orden no cambia.'], [10.0, 25.4, 'Si las dos ciudades se calientan cinco grados, pasan a menos siete y a dos. La más fría sigue siendo la más fría.']] },
    { id: 'multiplicar', name: 'MULTIPLICAR', dur: 30, formula: [['a', 'i'], [' < ', 'r'], ['b', 'i'], [', ', 'r'], ['c', 'i'], [' < 0', 'r'], ['  ⟹  ', 'r'], ['a', 'i'], ['c', 'i'], [' > ', 'r'], ['b', 'i'], ['c', 'i']],
      caps: [[0.8, 9.4, 'Por un positivo, se conserva', '3 < 7  ⟹  3 · 2 < 7 · 2'], [10.0, 19.4, 'Por un negativo, se voltea', '3 < 7  ⟹  3 · (−1) > 7 · (−1)'], [20.0, 29.4, 'Como deudas', 'deber 3 es mejor que deber 7: −3 > −7']],
      narr: [[0.8, 9.4, 'Multiplicar los dos lados por un número positivo también conserva el orden. Tres es menor que siete, y seis es menor que catorce.'], [10.0, 19.4, 'Pero aquí está la sorpresa. Si se multiplica por un negativo, la desigualdad se voltea: menos tres es mayor que menos siete.'], [20.0, 29.4, 'Con deudas tiene sentido: deber tres es mejor que deber siete. Menos tres está por encima de menos siete.']] },
    { id: 'espejo', name: 'POR QUÉ SE VOLTEA', dur: 26, formula: [['x', 'i'], ['  ⟶  ', 'r'], ['−x', 'i']],
      caps: [[0.8, 9.4, 'Multiplicar por −1 refleja la recta', 'lo de la derecha pasa a la izquierda'], [10.0, 25.4, 'El orden queda al revés', 'por eso la desigualdad se voltea']],
      narr: [[0.8, 9.4, 'Multiplicar por menos uno es reflejar la recta en el cero, como en un espejo: lo que estaba a la derecha pasa a la izquierda.'], [10.0, 25.4, 'Y si el siete estaba a la derecha del tres, su reflejo queda a la izquierda del reflejo del tres. El orden queda al revés, y el signo de la desigualdad se voltea.']] },
    { id: 'absoluto', name: 'VALOR ABSOLUTO', dur: 30, formula: [['|', 'r'], ['a', 'i'], ['| = ', 'r'], ['a', 'i'], [' si ', 'r'], ['a', 'i'], [' ≥ 0,   ', 'r'], ['|', 'r'], ['a', 'i'], ['| = ', 'r'], ['−a', 'i'], [' si ', 'r'], ['a', 'i'], [' < 0', 'r']],
      caps: [[0.8, 9.4, 'Valor absoluto', 'la distancia de un número al cero'], [10.0, 19.4, 'Nunca es negativo', 'una distancia no puede ser negativa'], [20.0, 29.4, 'Las barras de Weierstrass', 'Karl Weierstrass las usó en 1841']],
      narr: [[0.8, 9.4, 'El valor absoluto de un número es su distancia al cero. Menos cuatro y medio está a cuatro y medio del cero.'], [10.0, 19.4, 'Por eso nunca es negativo: si el número es positivo se queda igual, y si es negativo se le cambia el signo.'], [20.0, 29.4, 'Se escribe entre dos barras. Las usó el matemático alemán Karl Weierstrass en 1841.']] },
    { id: 'distancia', name: 'DISTANCIA', dur: 30, formula: [['|', 'r'], ['x', 'i'], [' − 50| ≤ 0.2', 'r']],
      caps: [[0.8, 9.4, 'Distancia entre dos números', '|b − a|, sin importar cuál es mayor'], [10.0, 19.4, 'En una fábrica', 'una pieza de 50 mm sirve si |x − 50| ≤ 0.2'], [20.0, 29.4, 'Entre 49.8 y 50.2', 'todo lo demás se rechaza']],
      narr: [[0.8, 9.4, 'La distancia entre dos números es el valor absoluto de su diferencia. Da lo mismo restar en un orden o en el otro.'], [10.0, 19.4, 'En una fábrica, una pieza que debe medir cincuenta milímetros sirve si su medida está a lo sumo a dos décimas de cincuenta.'], [20.0, 29.4, 'Es decir, entre cuarenta y nueve punto ocho y cincuenta punto dos. Lo que se sale de ese tramo se rechaza.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], [' < ', 'r'], ['b', 'i'], ['   ', 'r'], ['|', 'r'], ['b', 'i'], [' − ', 'r'], ['a', 'i'], ['|', 'r']],
      caps: [[0.8, 10.4, 'Ordenar y medir', 'dos signos de Harriot y dos barras de Weierstrass']],
      narr: [[0.8, 10.4, 'Con los signos de Harriot se ordenan los números. Con las barras de Weierstrass se miden sus distancias.'], [11.0, 20.4, 'Sumar conserva el orden. Multiplicar por un negativo lo voltea, porque refleja la recta.'], [21.0, 29.4, 'Con esto ya tenemos la recta real: sus números, sus reglas, su orden y sus distancias.']] },
  ];
  const WORLD = 'ÁLGEBRA · LA RECTA REAL', TITLE = 'ORDEN Y VALOR ABSOLUTO', LINE = 'Ordenar los números y medir distancias.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-12d' };
})();
if (typeof module !== 'undefined') module.exports = D;
