// «El día que Plutón cambió de conjunto» · lección alg-0a (¿Qué es un conjunto? Notación y pertenencia), estilo
// «showreel matemático» (pedido del usuario, 2026-11-27): cada cuadro es una función pura de t, trazos neón de varios
// colores, fórmulas en letra de libro, etiquetas monoespaciadas y un HUD fijo. Datos puros: escenas, rótulos y narración.
// Historia (docs/storytelling-videos.md): el 24 de agosto de 2006 Plutón dejó de ser planeta sin moverse; no cambió
// Plutón, cambió la regla. Idea semilla: un conjunto es una regla clara que decide quién entra.
// Cada escena: dur (s), name (HUD), formula (abajo a la izquierda: partes [texto, tipo, color]), caps [desde, hasta,
// título, subtítulo] y narr [desde, hasta, texto] (el .srt). Tiempos relativos a la escena. Datos y respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'praga', name: 'PRAGA, 2006', dur: 26, formula: [['let ', 'r'], ['P', 'i'], [' = ', 'r'], ['{ planetas }', 'r']],
      caps: [[1.0, 8.6, '24 de agosto de 2006', 'en Praga, 424 astrónomos levantan la mano'], [9.2, 17.2, 'Ese día, Plutón dejó de ser planeta', 'y no se movió ni un kilómetro'], [17.8, 25.4, 'No cambió Plutón', 'cambió la regla que decide quién entra']],
      narr: [[1.0, 8.6, 'Praga, 24 de agosto de 2006. En una sala, 424 astrónomos votan levantando la mano.'], [9.2, 17.2, 'Ese día Plutón dejó de ser planeta. Y no se movió ni un kilómetro de su órbita.'], [17.8, 25.4, 'No cambió Plutón. Cambió la regla que decide quién entra al grupo. De eso trata esta lección.']] },
    { id: 'lio', name: 'SIN REGLA', dur: 24, formula: [['x', 'i'], [' es planeta', 'r'], ['  ⟶  ', 'r'], ['sin regla, nadie decide', 'r']],
      caps: [[0.8, 8.4, 'Durante años no hubo regla', 'los planetas eran una lista aprendida de memoria'], [9.0, 16.4, 'En 2005 aparece Eris', 'casi del mismo tamaño que Plutón'], [17.0, 23.4, 'Sin una regla nadie podía decidir', 'si Eris entraba o no entraba']],
      narr: [[0.8, 8.4, 'Durante años no hubo ninguna regla. Los planetas eran una lista que se aprendía de memoria.'], [9.0, 16.4, 'En 2005 se descubre Eris, un mundo helado casi del mismo tamaño que Plutón.'], [17.0, 23.4, 'Y sin una regla, nadie podía decidir si Eris entraba a la lista o se quedaba afuera.']] },
    { id: 'conjunto', name: 'CONJUNTO', dur: 28, formula: [['P', 'i'], [' : el conjunto de los planetas', 'r']],
      caps: [[0.8, 9.4, 'Conjunto', 'una colección bien definida de objetos'], [10.0, 18.4, 'Elemento', 'cada objeto que está en el conjunto'], [19.0, 27.4, 'Los nombres', 'conjuntos con mayúscula, elementos con minúscula']],
      narr: [[0.8, 9.4, 'La matemática tiene una palabra para un grupo así: conjunto. Una colección bien definida de objetos.'], [10.0, 18.4, 'Cada objeto que está en el conjunto se llama elemento. Este conjunto tiene ocho.'], [19.0, 27.4, 'Por costumbre, a los conjuntos se les pone una letra mayúscula, como P, y a los elementos, minúsculas.']] },
    { id: 'regla', name: 'BIEN DEFINIDA', dur: 36, formula: [['x', 'i'], [' ∈ ', 'r'], ['P', 'i'], ['   o   ', 'r'], ['x', 'i'], [' ∉ ', 'r'], ['P', 'i'], ['  : siempre se puede decidir', 'r']],
      caps: [[0.8, 8.8, 'Bien definida', 'de cada objeto se puede decidir si está o no está'], [9.4, 17.4, 'La regla de 2006', 'tres condiciones que se cumplen o no se cumplen'], [18.0, 26.4, 'Plutón falla la tercera', 'comparte su órbita con miles de cuerpos helados'], [27.0, 35.4, '«Los planetas más bonitos»', 'depende de quién opine: no es un conjunto']],
      narr: [[0.8, 8.8, 'Bien definida quiere decir que de cada objeto se puede decidir, sin discutir, si está o no está.'], [9.4, 17.4, 'La regla de 2006 tiene tres condiciones: girar alrededor del Sol, ser casi redondo y haber limpiado su órbita.'], [18.0, 26.4, 'La Tierra cumple las tres. La Luna falla la primera. Plutón falla la tercera: comparte su órbita con miles de cuerpos helados.'], [27.0, 35.4, 'En cambio, los planetas más bonitos no forman un conjunto: la respuesta depende de quién opine.']] },
    { id: 'pertenece', name: 'PERTENENCIA', dur: 32, formula: [['∈', 'r'], [' : «pertenece a»', 'r'], ['      ', 'r'], ['∉', 'r'], [' : «no pertenece a»', 'r']],
      caps: [[0.8, 9.0, 'Pertenece', 'el símbolo ∈ se lee «pertenece a» o «es elemento de»'], [9.6, 17.6, 'No pertenece', 'el mismo símbolo, tachado'], [18.2, 31.4, 'Giuseppe Peano, 1889', 'es una épsilon, la primera letra de «es» en griego']],
      narr: [[0.8, 9.0, 'Para decir que Marte es un elemento de P se usa un símbolo. Se lee: Marte pertenece a P.'], [9.6, 17.6, 'Y cuando un objeto no es elemento, el símbolo va tachado: Plutón no pertenece a P.'], [18.2, 31.4, 'El símbolo lo propuso Giuseppe Peano en 1889. Es una épsilon griega, la primera letra de la palabra que significa «es».']] },
    { id: 'escrituras', name: 'DOS ESCRITURAS', dur: 40, formula: [['P', 'i'], [' = { ', 'r'], ['x', 'i'], [' : ', 'r'], ['x', 'i'], [' es un planeta }', 'r']],
      caps: [[0.8, 10.4, 'Por extensión', 'se nombran todos los elementos, entre llaves y con comas'], [11.0, 20.4, 'Por comprensión', 'se escribe la condición que cumplen'], [21.0, 29.4, 'Cómo se lee', '«P es el conjunto de las x tal que x es un planeta»'], [30.0, 39.4, 'Las estrellas de la Vía Láctea', 'nadie podría nombrarlas: solo cabe la condición']],
      narr: [[0.8, 10.4, 'Un conjunto se puede escribir de dos formas. Por extensión: se nombran todos sus elementos, entre llaves y separados por comas.'], [11.0, 20.4, 'O por comprensión: en vez de la lista, se escribe la condición que cumplen los elementos.'], [21.0, 29.4, 'Se lee: P es el conjunto de las x tal que x es un planeta. Los dos puntos se leen «tal que», y x es un elemento cualquiera.'], [30.0, 39.4, 'Para las estrellas de la Vía Láctea, unos cien mil millones, la lista es imposible. Solo cabe la condición.']] },
    { id: 'vida', name: 'ADN', dur: 34, formula: [['{', 'r'], ['A', 'i'], [', ', 'r'], ['C', 'i'], [', ', 'r'], ['G', 'i'], [', ', 'r'], ['T', 'i'], ['} = {', 'r'], ['T', 'i'], [', ', 'r'], ['G', 'i'], [', ', 'r'], ['C', 'i'], [', ', 'r'], ['A', 'i'], ['}', 'r']],
      caps: [[0.8, 9.4, 'La vida también usa un conjunto', 'el ADN se escribe con cuatro bases'], [10.0, 19.4, 'Sin repetidos', 'millones de letras, pero solo cuatro elementos'], [20.0, 33.4, 'Sin orden', 'mismos elementos en otro orden: el mismo conjunto']],
      narr: [[0.8, 9.4, 'La naturaleza también usa conjuntos. Todo el ADN se escribe con cuatro bases: A, C, G y T.'], [10.0, 19.4, 'Una cadena de ADN tiene millones de letras, pero el conjunto de sus bases tiene solo cuatro elementos. En un conjunto no hay repetidos.'], [20.0, 33.4, 'Tampoco importa el orden. Dos conjuntos son iguales cuando tienen exactamente los mismos elementos, se escriban como se escriban.']] },
    { id: 'cardinal', name: 'CARDINAL', dur: 22, formula: [['n', 'i'], ['(', 'r'], ['A', 'i'], [') : el número de elementos de ', 'r'], ['A', 'i']],
      caps: [[0.8, 10.4, 'Cardinal', 'el número de elementos de un conjunto'], [11.0, 21.4, 'Su notación', 'n(P) se lee «el cardinal de P»']],
      narr: [[0.8, 10.4, 'El número de elementos de un conjunto se llama cardinal. El conjunto de los planetas tiene ocho.'], [11.0, 21.4, 'Se escribe n de P igual a ocho. Y el cardinal del conjunto de las bases del ADN es cuatro.']] },
    { id: 'cuidado', name: 'ELEMENTO Y CONJUNTO', dur: 22, formula: [['a', 'i'], [' ≠ ', 'r'], ['{', 'r'], ['a', 'i'], ['}', 'r']],
      caps: [[0.8, 10.4, 'Un detalle fino', 'la Tierra es un elemento; {Tierra} es un conjunto'], [11.0, 21.4, 'No son lo mismo', 'una caja con un planeta adentro no es un planeta']],
      narr: [[0.8, 10.4, 'Un detalle fino. La Tierra es un elemento. Pero la Tierra entre llaves es un conjunto que tiene un solo elemento.'], [11.0, 21.4, 'No son lo mismo: una caja con un planeta adentro no es un planeta. Por eso ese conjunto no pertenece a P.']] },
    { id: 'cierre', name: 'CIERRE', dur: 34, formula: [['P', 'i'], [' = { ', 'r'], ['x', 'i'], [' : ', 'r'], ['x', 'i'], [' es un planeta }', 'r'], ['     ', 'r'], ['n', 'i'], ['(', 'r'], ['P', 'i'], [') = 8', 'r']],
      caps: [[0.8, 9.4, 'Plutón no desapareció', 'salió de un conjunto y entró a otro'], [10.0, 19.4, 'Los planetas enanos', 'otra regla clara, otro conjunto: hoy tiene cinco elementos']],
      narr: [[0.8, 9.4, 'Y Plutón no desapareció. Salió de un conjunto y entró a otro: el de los planetas enanos.'], [10.0, 19.4, 'Otra regla clara, otro conjunto. Hoy tiene cinco elementos: Ceres, Plutón, Haumea, Makemake y Eris.'], [20.0, 33.4, 'Un conjunto es eso: una regla clara que decide quién entra. Se escribe con llaves, se pertenece con este símbolo, y se cuenta con el cardinal.']] },
  ];
  const TITLE = 'CONJUNTOS', LINE = 'Una regla clara decide quién entra.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  // Planetas: nombre, color neón y radio de órbita del dibujo (no a escala). El noveno es Plutón.
  const PLANETS = [['Mercurio', '#c9d2ff'], ['Venus', '#ffc247'], ['Tierra', '#35e0ff'], ['Marte', '#ff6a5a'], ['Júpiter', '#ffb37a'], ['Saturno', '#f5e08a'], ['Urano', '#7ff2e0'], ['Neptuno', '#5b8cff'], ['Plutón', '#ff4fb0']];
  const DWARFS = ['Ceres', 'Plutón', 'Haumea', 'Makemake', 'Eris'];
  return { DUR: t, SCENES, SC, NARR, TITLE, LINE, PLANETS, DWARFS, BASES: ['A', 'C', 'G', 'T'] };
})();
if (typeof module !== 'undefined') module.exports = D;
