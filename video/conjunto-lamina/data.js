// «¿Qué es un conjunto?» · modelo lámina (lección alg-0a de Zuka). Datos puros: escenas, rótulos, narración y sonidos.
// Cada escena tiene sus tiempos relativos; al final se pasan a tiempos absolutos (D.CAPS, D.NARR, D.EV, D.SC).
// film.js dibuja; tests/conjunto-lamina.test.js comprueba este archivo en Node.
const D = (() => {
  const SCENES = [
    { id: 'idea', name: 'La idea', dur: 15,
      caps: [[0.6, 6.4, 'UNA IDEA', 'Casi toda la matemática', 'se escribe con una idea:'], [6.8, 14.4, 'UNA IDEA', 'juntar objetos y tratarlos', 'como una sola cosa.']],
      narr: [[0.6, 6.4, 'Casi toda la matemática se escribe con una sola idea.'], [6.8, 14.4, 'Juntar objetos y tratarlos como una sola cosa. Aquí juntamos las vocales.']],
      ev: [[0.4, 'pops', 9], [6.8, 'draw', 1.8], [9.0, 'yes']] },
    { id: 'def', name: 'Definición', dur: 24,
      caps: [[0.5, 8.0, 'DEFINICIÓN', 'Un conjunto es una colección', 'bien definida de objetos.'], [8.4, 15.6, 'ELEMENTOS', 'Cada objeto del conjunto', 'se llama elemento.'], [16.0, 23.4, 'LOS NOMBRES', 'Conjuntos: con mayúscula.', 'Elementos: con minúscula.']],
      narr: [[0.5, 8.0, 'Un conjunto es una colección bien definida de objetos. A este lo llamamos V: el conjunto de las vocales.'], [8.4, 15.6, 'Cada objeto del conjunto se llama elemento. V tiene cinco elementos.'], [16.0, 23.4, 'Por costumbre, los conjuntos se nombran con mayúscula y los elementos con minúscula.']],
      ev: [[8.8, 'pops', 5], [16.4, 'tag'], [18.4, 'tag']] },
    { id: 'bien', name: 'Bien definida', dur: 28,
      caps: [[0.5, 8.0, 'BIEN DEFINIDA', 'De cada objeto se puede', 'decidir si está o no está.'], [8.4, 16.4, 'SÍ ES UN CONJUNTO', '«Las vocales»: la respuesta', 'no depende de quién opine.'], [16.8, 27.4, 'NO ES UN CONJUNTO', '«Las letras bonitas»:', 'cada quien responde distinto.']],
      narr: [[0.5, 8.0, 'Bien definida quiere decir que de cada objeto se puede decidir si está o no está. La e es vocal: está. La t no.'], [8.4, 16.4, 'La respuesta no depende de quién opine. Por eso las vocales sí forman un conjunto.'], [16.8, 27.4, 'En cambio, «las letras bonitas» no: cada persona elige letras distintas y la frontera nunca se cierra. No es un conjunto.']],
      ev: [[2.0, 'yes'], [4.6, 'no'], [9.0, 'yes'], [17.2, 'doubt'], [19.6, 'doubt'], [22.0, 'doubt']] },
    { id: 'venn', name: 'Diagrama de Venn', dur: 17,
      caps: [[0.5, 8.0, 'DIAGRAMA DE VENN', 'Una curva cerrada:', 'adentro van sus elementos.'], [8.4, 16.4, 'DIAGRAMA DE VENN', 'Lo que no es elemento', 'queda afuera.']],
      narr: [[0.5, 8.0, 'Este dibujo se llama diagrama de Venn: una curva cerrada, con los elementos adentro.'], [8.4, 16.4, 'Todo lo que no es elemento del conjunto queda afuera de la curva.']],
      ev: [[1.0, 'draw', 1.2], [8.8, 'pops', 4]] },
    { id: 'pert', name: 'Pertenencia', dur: 33,
      caps: [[0.5, 8.0, 'PERTENENCIA', '«a es elemento de V»', 'se escribe con un símbolo.'], [8.4, 16.4, 'EL SÍMBOLO ∈', '∈ se lee «pertenece a»', 'o «es elemento de».'], [16.8, 24.4, 'DE DÓNDE VIENE', 'Es una épsilon griega, ε.', 'Giuseppe Peano, 1889.'], [24.8, 32.4, 'NO PERTENECE', 'Con una raya, lo contrario:', '∉, «no pertenece a».']],
      narr: [[0.5, 8.0, 'Para decir que a es un elemento de V no se escribe la frase: se usa un símbolo.'], [8.4, 16.4, 'Este símbolo se lee «pertenece a» o «es elemento de». Entonces: a pertenece a V.'], [16.8, 24.4, 'El símbolo es una letra griega, épsilon. Lo empezó a usar el matemático Giuseppe Peano en 1889.'], [24.8, 32.4, 'Y con una raya encima dice lo contrario: m no pertenece a V.']],
      ev: [[2.0, 'rise'], [9.0, 'yes'], [17.4, 'tag'], [25.2, 'no']] },
    { id: 'ext', name: 'Por extensión', dur: 27,
      caps: [[0.5, 9.0, 'POR EXTENSIÓN', 'Primera forma de escribirlo:', 'nombrar todos los elementos.'], [9.4, 18.0, 'LA ESCRITURA', 'Nombre, signo igual, llaves', 'y comas entre los elementos.'], [18.4, 26.4, 'SOLO LLAVES', 'Paréntesis y corchetes', 'significan otra cosa.']],
      narr: [[0.5, 9.0, 'Hay dos formas de escribir un conjunto. La primera es por extensión: se nombran todos sus elementos.'], [9.4, 18.0, 'Se escribe el nombre, el signo igual, y entre llaves los elementos separados por comas.'], [18.4, 26.4, 'Tienen que ser llaves. Los paréntesis y los corchetes significan otra cosa en matemáticas.']],
      ev: [[2.0, 'fly', 2.2], [4.4, 'brace'], [9.8, 'tag'], [11.0, 'tag'], [12.2, 'tag'], [19.0, 'cut'], [20.4, 'cut']] },
    { id: 'comp', name: 'Por comprensión', dur: 43,
      caps: [[0.5, 8.0, 'POR COMPRENSIÓN', 'Segunda forma: escribir la', 'condición que cumplen.'], [8.4, 17.4, 'CÓMO SE LEE', '«V es el conjunto de las x', 'tal que x es una vocal».'], [17.8, 24.8, 'LA LETRA x', 'x representa a un elemento', 'cualquiera.'], [25.2, 33.0, 'LOS DOS PUNTOS', '«:» se lee «tal que».', 'También se escribe «|».'], [33.4, 42.4, 'LA CONDICIÓN', 'Entra quien la cumple:', 'a sí, m no.']],
      narr: [[0.5, 8.0, 'La segunda forma es por comprensión: en vez de nombrar los elementos, se escribe la condición que cumplen.'], [8.4, 17.4, 'Se lee así: V es el conjunto de las x tal que x es una vocal.'], [17.8, 24.8, 'La letra x representa a un elemento cualquiera, todavía sin nombre.'], [25.2, 33.0, 'Los dos puntos se leen «tal que». En algunos libros aparece una barra vertical: significa lo mismo.'], [33.4, 42.4, 'Y lo que sigue es la condición. La a es una vocal, así que pertenece a V. La m no lo es: no pertenece.']],
      ev: [[1.5, 'rise'], [18.2, 'tag'], [25.6, 'tag'], [34.6, 'yes'], [38.2, 'no']] },
    { id: 'dos', name: 'Dos formas', dur: 20,
      caps: [[0.5, 8.0, 'DOS FORMAS', 'El mismo conjunto,', 'dos maneras de escribirlo.'], [8.4, 19.4, 'CUÁL CONVIENE', 'Con muchos elementos,', 'la condición es más corta.']],
      narr: [[0.5, 8.0, 'Las dos escrituras nombran exactamente el mismo conjunto.'], [8.4, 19.4, 'Cuál usar depende del caso. Para el conjunto de todas las letras, la condición es mucho más corta que la lista.']],
      ev: [[1.0, 'rise'], [9.0, 'draw', 1.6], [10.6, 'rise']] },
    { id: 'orden', name: 'Sin orden', dur: 19,
      caps: [[0.5, 8.5, 'CONJUNTOS IGUALES', 'Dos conjuntos son iguales si', 'tienen los mismos elementos.'], [8.9, 18.4, 'EL ORDEN NO IMPORTA', 'Se cambia el orden y sigue', 'siendo el mismo conjunto.']],
      narr: [[0.5, 8.5, 'Dos conjuntos son iguales cuando tienen exactamente los mismos elementos, como V y W.'], [8.9, 18.4, 'Por eso el orden no importa: W tiene las vocales al revés y sigue siendo igual a V.']],
      ev: [[1.0, 'rise'], [10.5, 'shuffle', 2.0]] },
    { id: 'rep', name: 'Sin repetidos', dur: 20,
      caps: [[0.5, 9.0, 'SIN REPETIDOS', 'Cada elemento se escribe', 'una sola vez.'], [9.4, 19.4, 'LETRAS DE «salsa»', 'Cinco letras en la palabra,', 'tres elementos en el conjunto.']],
      narr: [[0.5, 9.0, 'Tampoco hay repetidos: cada elemento se escribe una sola vez. Un elemento está o no está, no puede estar dos veces.'], [9.4, 19.4, 'La palabra salsa tiene cinco letras, pero el conjunto de sus letras tiene solo tres elementos: s, a y l.']],
      ev: [[0.8, 'pops', 5], [3.0, 'fly', 1.2], [4.4, 'fly', 1.2], [6.2, 'brace']] },
    { id: 'card', name: 'Cardinal', dur: 19,
      caps: [[0.5, 9.0, 'CARDINAL', 'El número de elementos', 'de un conjunto.'], [9.4, 18.4, 'SU NOTACIÓN', 'n(V) se lee', '«el cardinal de V».']],
      narr: [[0.5, 9.0, 'El número de elementos de un conjunto se llama cardinal. V tiene uno, dos, tres, cuatro, cinco.'], [9.4, 18.4, 'Se escribe n de V igual a cinco. Y el conjunto de las letras de salsa tiene cardinal tres.']],
      ev: [[2.0, 'count', 0], [2.6, 'count', 1], [3.2, 'count', 2], [3.8, 'count', 3], [4.4, 'count', 4], [5.6, 'card'], [10.4, 'rise']] },
    { id: 'ojo', name: 'Elemento y conjunto', dur: 19,
      caps: [[0.5, 9.0, 'CUIDADO', 'a es un elemento.', '{a} es un conjunto.'], [9.4, 18.4, 'NO SON LO MISMO', 'a ∈ V: a es una vocal.', '{a} ∉ V: {a} no lo es.']],
      narr: [[0.5, 9.0, 'Un detalle fino: la letra a es un elemento. Pero a entre llaves es un conjunto que tiene un solo elemento.'], [9.4, 18.4, 'No son lo mismo. La a pertenece a V. El conjunto con la a adentro no es una vocal, así que no pertenece a V.']],
      ev: [[1.2, 'pops', 2], [2.4, 'draw', 1.0], [10.2, 'yes'], [13.0, 'no']] },
    { id: 'fin', name: 'Resumen', dur: 24,
      caps: [],
      narr: [[0.6, 11.0, 'En resumen: un conjunto es una colección bien definida. Se escribe por extensión o por comprensión, y la pertenencia con este símbolo.'], [11.4, 17.0, 'No tiene orden ni repetidos, y su cardinal cuenta los elementos.'], [17.4, 23.4, 'Con esta idea se escribe todo lo que sigue.']],
      ev: [[0.8, 'sum', 0], [2.4, 'sum', 1], [4.0, 'sum', 2], [5.6, 'sum', 3], [7.2, 'sum', 4], [8.8, 'sum', 5], [17.4, 'end']] },
  ];
  const SUM = ['Conjunto: colección bien definida', 'a ∈ V   y   m ∉ V', 'V = {a, e, i, o, u}', 'V = {x : x es una vocal}', 'Sin orden ni repetidos', 'n(V) = 5'];
  const END = [17.4, 'Con esta idea se escribe', 'todo lo que sigue.'];
  let t = 0; const SC = [], CAPS = [], NARR = [], EV = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const c of s.caps) CAPS.push([+(t + c[0]).toFixed(2), +(t + c[1]).toFixed(2), c[2], c[3], c[4]]);
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    for (const e of s.ev) EV.push({ t: +(t + e[0]).toFixed(2), type: e[1], v: e[2] ?? 0 });
    EV.push({ t: +t.toFixed(2), type: 'scene', v: SC.length - 1 });
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, CAPS, NARR, EV, SUM, END, VOWELS: ['a', 'e', 'i', 'o', 'u'], OUT: ['m', 't', 's', 'r'], WORD: 'salsa' };
})();
if (typeof module !== 'undefined') module.exports = D;
