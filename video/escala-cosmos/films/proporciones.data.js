// «El pozo de Eratóstenes» · lección alg-12e (Proporciones y magnitudes proporcionales). Datos puros.
// Historia (docs/storytelling-videos.md): hacia el 240 a. C. Eratóstenes mide el contorno de la Tierra con una proporción:
// el ángulo de los rayos en Alejandría es a la vuelta completa como la distancia Siena–Alejandría es al contorno.
// Analogías: el trueno (directa), el aire de Boyle (inversa), la estatura (ninguna) y la boleta de tres amigas (reparto).
// La sorpresa: con una vara, un pozo y una proporción sale el tamaño de la Tierra. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'eratostenes', name: 'EGIPTO, HACIA 240 A. C.', dur: 30, formula: [['ángulo', 'it'], [' : ', 'r'], ['vuelta', 'it'], [' = ', 'r'], ['distancia', 'it'], [' : ', 'r'], ['contorno', 'it']],
      caps: [[1.0, 9.4, 'Egipto, hacia el 240 a. C.', 'Eratóstenes quiere medir la Tierra'], [10.0, 19.4, 'Solsticio de verano en Siena', 'el Sol ilumina el fondo de un pozo'], [20.0, 29.4, 'Ese día, en Alejandría', 'los rayos llegan inclinados 7.2°']],
      narr: [[1.0, 9.4, 'Egipto, hacia el año doscientos cuarenta antes de Cristo. Eratóstenes, el bibliotecario de Alejandría, quiere medir el contorno de la Tierra.'], [10.0, 19.4, 'Sabe que al mediodía del solsticio de verano, en Siena, hoy Asuán, el Sol ilumina el fondo de un pozo: cae completamente vertical.'], [20.0, 29.4, 'Ese mismo día, en Alejandría, una vara vertical sí proyecta sombra. Los rayos llegan inclinados siete grados y dos décimas.']] },
    { id: 'proporcion', name: 'PROPORCIÓN', dur: 28, formula: [['a', 'i'], ['/', 'r'], ['b', 'i'], [' = ', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i']],
      caps: [[0.8, 9.4, 'Una proporción', 'es la igualdad de dos razones'], [10.0, 18.4, 'Se lee así', '«a es a b como c es a d»'], [19.0, 27.4, '3 : 4 = 6 : 8', 'las dos razones valen 0.75']],
      narr: [[0.8, 9.4, 'Para entender su idea hace falta una palabra: proporción. Una proporción es una igualdad entre dos razones.'], [10.0, 18.4, 'Se escribe a sobre b igual a c sobre d, y se lee: a es a b como c es a d.'], [19.0, 27.4, 'Por ejemplo, tres es a cuatro como seis es a ocho: las dos razones valen cero punto setenta y cinco.']] },
    { id: 'erapro', name: 'LA PROPORCIÓN DE ERATÓSTENES', dur: 30, formula: [['7.2', 'r'], ['/', 'r'], ['360', 'r'], [' = ', 'r'], ['5000', 'r'], ['/', 'r'], ['C', 'i']],
      caps: [[0.8, 9.4, '7.2° es 1/50 de la vuelta', '7.2 : 360 = 1 : 50'], [10.0, 19.4, 'Siena y Alejandría', 'separadas unos 5 000 estadios'], [20.0, 29.4, 'El ángulo es a la vuelta', 'como la distancia es al contorno']],
      narr: [[0.8, 9.4, 'Siete punto dos grados es la quincuagésima parte de una vuelta completa, de trescientos sesenta grados.'], [10.0, 19.4, 'Y entre Siena y Alejandría se contaban unos cinco mil estadios, la unidad de longitud de los griegos.'], [20.0, 29.4, 'Los rayos llegan paralelos, así que ese ángulo es también el del centro de la Tierra. Y el ángulo es a la vuelta como la distancia al contorno.']] },
    { id: 'extremos', name: 'EXTREMOS Y MEDIOS', dur: 28, formula: [['a', 'i'], ['d', 'i'], [' = ', 'r'], ['b', 'i'], ['c', 'i']],
      caps: [[0.8, 9.4, 'Extremos y medios', 'a y d son los extremos; b y c, los medios'], [10.0, 18.4, 'Propiedad fundamental', 'producto de extremos = producto de medios'], [19.0, 27.4, 'De dónde sale (b, d ≠ 0)', 'se multiplican los dos lados por b · d']],
      narr: [[0.8, 9.4, 'En a es a b como c es a d, los de las puntas, a y d, son los extremos; los del centro, b y c, los medios.'], [10.0, 18.4, 'La propiedad fundamental: el producto de los extremos es igual al producto de los medios. a por d es b por c.'], [19.0, 27.4, 'Sale de multiplicar los dos lados por b por d, que no son cero: las fracciones desaparecen.']] },
    { id: 'contorno', name: 'EL TÉRMINO QUE FALTA', dur: 30, formula: [['7.2', 'r'], [' · ', 'r'], ['C', 'i'], [' = 360 · 5000', 'r']],
      caps: [[0.8, 9.4, 'Un término desconocido', 'C, el contorno de la Tierra'], [10.0, 19.4, 'Extremos por medios', '7.2 · C = 360 · 5 000 = 1 800 000'], [20.0, 29.4, 'C = 250 000 estadios', 'unos 39 000 km, con estadios de 157 m']],
      narr: [[0.8, 9.4, 'Con la propiedad fundamental se halla el término que falta. Aquí falta C, el contorno de la Tierra.'], [10.0, 19.4, 'Siete punto dos por C es igual a trescientos sesenta por cinco mil: un millón ochocientos mil.'], [20.0, 29.4, 'Dividiendo, C da doscientos cincuenta mil estadios. Si un estadio medía unos ciento cincuenta y siete metros, son unos treinta y nueve mil kilómetros.']] },
    { id: 'directa', name: 'DIRECTAMENTE PROPORCIONALES', dur: 30, formula: [['d', 'i'], [' / ', 'r'], ['t', 'i'], [' = 343 m/s', 'r']],
      caps: [[0.8, 9.4, 'El trueno llega después del rayo', 'en aire a 20 °C, unos 343 m cada segundo'], [10.0, 19.4, 'Doble tiempo, doble distancia', 'el cociente d / t se mantiene constante'], [20.0, 29.4, 'Su gráfica es una recta', 'que pasa por el origen']],
      narr: [[0.8, 9.4, 'En una tormenta, la luz del rayo llega casi al instante, pero el sonido viaja a unos trescientos cuarenta y tres metros por segundo.'], [10.0, 19.4, 'Si el trueno tarda el doble, la tormenta está al doble de distancia. Distancia y tiempo son directamente proporcionales: su cociente es constante.'], [20.0, 29.4, 'En una gráfica, las parejas forman una recta que pasa por el origen. Cada tres segundos de espera son, más o menos, un kilómetro.']] },
    { id: 'inversa', name: 'INVERSAMENTE PROPORCIONALES', dur: 30, formula: [['P', 'i'], [' · ', 'r'], ['V', 'i'], [' = constante', 'r']],
      caps: [[0.8, 9.4, 'Inglaterra, 1662', 'Robert Boyle encierra aire y lo comprime'], [10.0, 19.4, 'Mitad de volumen, doble presión', 'P · V constante, a temperatura fija'], [20.0, 29.4, 'Su gráfica es una curva', 'que se acerca a los ejes sin tocarlos']],
      narr: [[0.8, 9.4, 'Inglaterra, mil seiscientos sesenta y dos. Robert Boyle encierra aire en un tubo y lo comprime echando mercurio.'], [10.0, 19.4, 'Si el aire ocupa la mitad del volumen, su presión se duplica. Con la temperatura fija, presión y volumen son inversamente proporcionales.'], [20.0, 29.4, 'Su producto es constante, y su gráfica no es una recta sino una curva, una hipérbola, que nunca toca los ejes.']] },
    { id: 'comparar', name: 'RECTA O CURVA', dur: 28, formula: [['y', 'i'], ['/', 'r'], ['x', 'i'], [' = ', 'r'], ['k', 'i'], ['     o     ', 'it'], ['x', 'i'], ['y', 'i'], [' = ', 'r'], ['k', 'i']],
      caps: [[0.8, 9.4, 'Directa: el cociente es fijo', 'y = k x, una recta por el origen'], [10.0, 18.4, 'Inversa: el producto es fijo', 'y = k / x, una curva'], [19.0, 27.4, 'No toda relación es proporcional', 'la estatura crece con la edad, pero no al doble']],
      narr: [[0.8, 9.4, 'Para distinguirlas: en una relación directa el cociente y sobre x es siempre el mismo, y la gráfica es una recta.'], [10.0, 18.4, 'En una inversa lo fijo es el producto x por y, y la gráfica es una curva.'], [19.0, 27.4, 'Y muchas relaciones no son ninguna de las dos: la estatura crece con la edad, pero no al doble cuando la edad se duplica.']] },
    { id: 'reparto', name: 'REPARTO PROPORCIONAL', dur: 30, formula: [['2 : 3 : 5', 'r']],
      caps: [[0.8, 9.4, 'Tres amigas ponen 2, 3 y 5 mil', 'y su boleta gana un millón'], [10.0, 19.4, 'Se suman las partes', '2 + 3 + 5 = 10 partes de 100 000'], [20.0, 29.4, 'Cada una, según lo que puso', '200 000, 300 000 y 500 000']],
      narr: [[0.8, 9.4, 'Reparto proporcional. Tres amigas compran una boleta: ponen dos, tres y cinco mil pesos. La boleta gana un millón.'], [10.0, 19.4, 'Lo justo es repartir en razón dos a tres a cinco. Se suman las partes: diez. Un millón entre diez son cien mil por parte.'], [20.0, 29.4, 'Así reciben doscientos mil, trescientos mil y quinientos mil: lo que ganó cada una es proporcional a lo que puso.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], ['/', 'r'], ['b', 'i'], [' = ', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i'], ['  ⟺  ', 'r'], ['ad', 'i'], [' = ', 'r'], ['bc', 'i']],
      caps: [[0.8, 10.4, 'Una vara, un pozo y una proporción', 'así se midió la Tierra hace más de 2 200 años']],
      narr: [[0.8, 10.4, 'Sin salir de Egipto, con una vara, un pozo y una proporción, Eratóstenes calculó el tamaño de la Tierra.'], [11.0, 20.4, 'Hoy se sabe que su contorno por el ecuador mide unos cuarenta mil setenta y cinco kilómetros: con el estadio de ciento cincuenta y siete metros, estuvo muy cerca.'], [21.0, 29.4, 'Con tres datos y una proporción, el cuarto sale solo.']] },
  ];
  const WORLD = 'ÁLGEBRA · ESCALAS Y PROPORCIONES', TITLE = 'PROPORCIONES', LINE = 'Con tres datos y una proporción, el cuarto sale solo.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-12e' };
})();
if (typeof module !== 'undefined') module.exports = D;
