// «Donar es ser subconjunto» · lección alg-0b (Tipos de conjuntos y relaciones entre ellos), estilo «showreel matemático»
// (mismo motor que video/conjunto-cosmos: kit.js). Datos puros: escenas, rótulos y narración.
// Historia (docs/storytelling-videos.md): Viena, 1901. Las transfusiones eran una lotería hasta que Karl Landsteiner vio
// que la sangre lleva marcas. La sangre de cada persona es un conjunto de marcas, y donar es ser subconjunto. La sorpresa,
// anunciada al inicio: la sangre que le sirve a todo el mundo es el conjunto vacío. Datos y respaldo en FACTS.md.
// Modelo simplificado: glóbulos rojos, sistemas ABO y Rh (D).
const D = (() => {
  const SCENES = [
    { id: 'viena', name: 'VIENA, 1901', dur: 28, formula: [['let ', 'r'], ['M', 'i'], [' = ', 'r'], ['{ marcas de la sangre }', 'r']],
      caps: [[1.0, 9.0, 'Una lotería', 'recibir sangre de otra persona salvaba o mataba'], [9.6, 18.0, 'Viena, 1901', 'Karl Landsteiner mezcla la sangre de sus colegas'], [18.6, 27.4, 'Unas mezclas se aglutinan', 'otras no: tiene que haber una regla']],
      narr: [[1.0, 9.0, 'Hasta 1900, recibir sangre de otra persona era una lotería. A veces salvaba la vida. A veces la quitaba.'], [9.6, 18.0, 'En Viena, en 1901, el médico Karl Landsteiner mezcla en el laboratorio la sangre de sus colegas, de dos en dos.'], [18.6, 27.4, 'Unas mezclas quedan lisas y otras se aglutinan. Tiene que haber una regla. Y la respuesta más rara de todas es un conjunto sin elementos.']] },
    { id: 'marcas', name: 'LAS MARCAS', dur: 26, formula: [['M', 'i'], [' = ', 'r'], ['{', 'r'], ['A', 'i'], [', ', 'r'], ['B', 'i'], [', ', 'r'], ['Rh', 'i'], ['}', 'r']],
      caps: [[0.8, 9.0, 'Los glóbulos rojos llevan marcas', 'Landsteiner encuentra dos: A y B'], [9.6, 17.4, 'En 1940 aparece la tercera', 'el factor Rh'], [18.0, 25.4, 'Tu sangre es un conjunto', 'el de las marcas que llevan tus glóbulos']],
      narr: [[0.8, 9.0, 'Landsteiner descubre que los glóbulos rojos llevan marcas en la superficie. Encuentra dos, y las llama A y B.'], [9.6, 17.4, 'En 1940, él mismo y Alexander Wiener hallan una tercera marca: el factor Rh.'], [18.0, 25.4, 'Entonces la sangre de cada persona se puede escribir como un conjunto: el de las marcas que tiene.']] },
    { id: 'vacio', name: 'VACÍO Y UNITARIO', dur: 30, formula: [['∅', 'r'], [' = ', 'r'], ['{ }', 'r'], ['      ', 'r'], ['n', 'i'], ['(∅) = 0', 'r']],
      caps: [[0.8, 9.4, 'Conjunto vacío', 'el que no tiene ningún elemento: se escribe ∅ o { }'], [10.0, 19.4, 'Conjunto unitario', 'el que tiene un solo elemento'], [20.0, 29.4, 'El vacío sí es un conjunto', 'bien definido: nada pertenece a él']],
      narr: [[0.8, 9.4, 'Hay sangre que no lleva ninguna marca: la del tipo O negativo. Su conjunto no tiene elementos. Se llama conjunto vacío.'], [10.0, 19.4, 'Y hay sangre con una sola marca, como la A negativo. Un conjunto con un solo elemento se llama unitario.'], [20.0, 29.4, 'El vacío es un conjunto de verdad: está bien definido, porque de cualquier objeto se sabe que no pertenece a él.']] },
    { id: 'partes', name: 'CONJUNTO DE PARTES', dur: 36, formula: [['n', 'i'], ['(', 'r'], ['P', 'i'], ['(', 'r'], ['M', 'i'], [')) = 2', 'r'], ['³', 'r'], [' = 8', 'r']],
      caps: [[0.8, 9.4, 'Todas las combinaciones', 'cada marca puede estar o no estar'], [10.0, 19.4, 'Dos por dos por dos', 'ocho conjuntos distintos: los ocho tipos de sangre'], [20.0, 35.4, 'Conjunto de partes', 'todos los subconjuntos; sus elementos son conjuntos']],
      narr: [[0.8, 9.4, 'Con tres marcas, cada una puede estar o no estar. Así se arman todas las combinaciones posibles.'], [10.0, 19.4, 'Dos opciones para A, dos para B y dos para Rh: dos por dos por dos, ocho conjuntos. Son los ocho tipos de sangre.'], [20.0, 35.4, 'El conjunto que reúne todos esos conjuntos se llama conjunto de partes. Si un conjunto tiene n elementos, su conjunto de partes tiene dos a la n.']] },
    { id: 'sub', name: 'SUBCONJUNTO', dur: 38, formula: [['D', 'i'], [' ⊆ ', 'r'], ['R', 'i'], ['  : todo elemento de ', 'r'], ['D', 'i'], [' está en ', 'r'], ['R', 'i']],
      caps: [[0.8, 9.4, 'La regla que buscaba Landsteiner', 'el cuerpo rechaza toda marca que no conoce'], [10.0, 19.4, 'Subconjunto', 'todos los elementos del primero están en el segundo'], [20.0, 28.4, 'Se escribe ⊆', 'y se lee «es subconjunto de» o «está contenido en»'], [29.0, 37.4, 'Si sobra un elemento, no', 'la marca B no está en el receptor']],
      narr: [[0.8, 9.4, 'Y esta es la regla que buscaba Landsteiner: el cuerpo ataca cualquier marca que no conoce.'], [10.0, 19.4, 'Para donar, todas las marcas del donante tienen que estar en el receptor. En matemáticas eso se llama ser subconjunto.'], [20.0, 28.4, 'Se escribe con este símbolo, y se lee: es subconjunto de, o está contenido en.'], [29.0, 37.4, 'Si al donante le sobra una sola marca, ya no es subconjunto. Aquí sobra la B, y la sangre se aglutina.']] },
    { id: 'todos', name: 'EL VACÍO', dur: 28, formula: [['∅', 'r'], [' ⊆ ', 'r'], ['A', 'i'], ['      ', 'r'], ['A', 'i'], [' ⊆ ', 'r'], ['A', 'i']],
      caps: [[0.8, 9.4, 'El vacío es subconjunto de todos', 'no tiene ningún elemento que pueda sobrar'], [10.0, 18.4, 'Donante universal', 'la sangre sin marcas le sirve a los ocho tipos'], [19.0, 27.4, 'Receptor universal', 'el que tiene las tres marcas las conoce todas']],
      narr: [[0.8, 9.4, 'Y aquí está la sorpresa. El conjunto vacío es subconjunto de cualquier conjunto: no tiene ningún elemento que pueda sobrar.'], [10.0, 18.4, 'Por eso la sangre O negativo, la que no lleva marcas, le sirve a los ocho tipos. Es el donante universal.'], [19.0, 27.4, 'Al otro lado está quien tiene las tres marcas: las conoce todas, y puede recibir de cualquiera.']] },
    { id: 'iguales', name: 'IGUALES', dur: 22, formula: [['A', 'i'], [' ⊆ ', 'r'], ['B', 'i'], ['  y  ', 'r'], ['B', 'i'], [' ⊆ ', 'r'], ['A', 'i'], ['  ⟹  ', 'r'], ['A', 'i'], [' = ', 'r'], ['B', 'i']],
      caps: [[0.8, 10.4, 'Conjuntos iguales', 'tienen exactamente los mismos elementos'], [11.0, 21.4, 'Subconjunto en los dos sentidos', 'cada uno le puede donar al otro']],
      narr: [[0.8, 10.4, 'Dos personas con las mismas marcas tienen conjuntos iguales: exactamente los mismos elementos.'], [11.0, 21.4, 'Cada uno es subconjunto del otro. Por eso se pueden donar sangre en los dos sentidos.']] },
    { id: 'disjuntos', name: 'DISJUNTOS', dur: 24, formula: [['{', 'r'], ['A', 'i'], ['}  y  {', 'r'], ['B', 'i'], ['}  : disjuntos', 'r']],
      caps: [[0.8, 10.4, 'Conjuntos disjuntos', 'no comparten ningún elemento'], [11.0, 23.4, 'No es lo mismo que distintos', 'estos dos son distintos, pero comparten una marca']],
      narr: [[0.8, 10.4, 'Estos dos conjuntos no comparten ningún elemento. Se llaman disjuntos. Ninguno le puede donar al otro.'], [11.0, 23.4, 'Disjuntos no es lo mismo que distintos. Estos otros dos son distintos, pero comparten la marca Rh: no son disjuntos.']] },
    { id: 'cubo', name: 'EL MAPA', dur: 30, formula: [['∅', 'r'], [' ⊆ ', 'r'], ['{', 'r'], ['A', 'i'], ['}', 'r'], [' ⊆ ', 'r'], ['{', 'r'], ['A', 'i'], [', ', 'r'], ['Rh', 'i'], ['}', 'r'], [' ⊆ ', 'r'], ['M', 'i']],
      caps: [[0.8, 9.4, 'Los ocho conjuntos en un mapa', 'cada línea agrega una sola marca'], [10.0, 19.4, 'Subir es recibir', 'la sangre viaja hacia arriba por las líneas'], [20.0, 29.4, 'Abajo el vacío, arriba el total', 'todo conjunto queda entre los dos']],
      narr: [[0.8, 9.4, 'Los ocho conjuntos se pueden ordenar en un mapa. Cada línea une dos que se diferencian en una sola marca.'], [10.0, 19.4, 'Donar es subir por las líneas: el vacío, luego el conjunto con A, luego el de A y Rh, hasta el conjunto completo.'], [20.0, 29.4, 'Abajo queda el vacío, que es subconjunto de todos. Arriba, el conjunto total, que los contiene a todos.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['D', 'i'], [' ⊆ ', 'r'], ['R', 'i'], ['     ', 'r'], ['∅', 'r'], [' ⊆ ', 'r'], ['A', 'i'], ['     ', 'r'], ['n', 'i'], ['(', 'r'], ['P', 'i'], ['(', 'r'], ['A', 'i'], [')) = 2', 'r'], ['ⁿ', 'r']],
      caps: [[0.8, 10.4, 'La lotería tenía una regla', 'Landsteiner recibió el Nobel en 1930']],
      narr: [[0.8, 10.4, 'La lotería de las transfusiones tenía una regla, y era una regla de conjuntos. Landsteiner recibió el Nobel en 1930.'], [11.0, 20.4, 'Vacío, unitario, subconjunto, iguales, disjuntos y conjunto de partes: todo estaba en una gota de sangre.'], [21.0, 29.4, 'Donar es ser subconjunto. Y el que no tiene nada, le sirve a todos.']] },
  ];
  const TITLE = 'SUBCONJUNTOS', LINE = 'Donar es ser subconjunto.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  // Los ocho tipos: bits A = 1, B = 2, Rh = 4.
  const MARKS = ['A', 'B', 'Rh'];
  const typeName = m => ((m & 1 ? 'A' : '') + (m & 2 ? 'B' : '') || 'O') + (m & 4 ? '+' : '−');
  const setOf = m => MARKS.filter((_, i) => m & (1 << i));
  const canGive = (d, r) => (d & r) === d;   // donar: el conjunto del donante es subconjunto del receptor
  return { DUR: t, SCENES, SC, NARR, TITLE, LINE, MARKS, typeName, setOf, canGive };
})();
if (typeof module !== 'undefined') module.exports = D;
