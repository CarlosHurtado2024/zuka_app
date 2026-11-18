// «Tres luces, ocho colores» · lección alg-0c (Operaciones entre conjuntos), estilo «showreel matemático» (mismo motor
// que video/conjunto-cosmos: kit.js). Datos puros: escenas, rótulos y narración.
// Historia (docs/storytelling-videos.md): la pantalla en la que se ve este video solo tiene tres luces. En 1861 James
// Clerk Maxwell proyectó la primera fotografía en color con tres filtros. Cada color de pantalla es una combinación de
// luces prendidas, y mezclar luces es operar conjuntos: la sorpresa, anunciada al inicio, es que el amarillo no existe en
// la pantalla: es una intersección. Datos y respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'pantalla', name: 'TU PANTALLA', dur: 26, formula: [['let ', 'r'], ['U', 'i'], [' = ', 'r'], ['{ colores de un píxel }', 'r']],
      caps: [[1.0, 8.6, 'Esta pantalla solo tiene tres luces', 'roja, verde y azul'], [9.2, 17.2, 'Cada punto es un trío de luces', 'se llama píxel, y hay millones'], [17.8, 25.4, 'Aquí no hay ninguna luz amarilla', 'y aun así el amarillo aparece']],
      narr: [[1.0, 8.6, 'La pantalla en la que ves este video solo tiene luces de tres colores: rojo, verde y azul.'], [9.2, 17.2, 'De cerca, cada punto es un trío de luces diminutas. Se llama píxel, y la pantalla tiene millones.'], [17.8, 25.4, 'No hay ninguna luz amarilla. Y aun así ves amarillo. Para entender cómo, hacen falta las operaciones entre conjuntos.']] },
    { id: 'maxwell', name: 'LONDRES, 1861', dur: 26, formula: [['3', 'r'], [' luces  ⟶  ', 'r'], ['todos los colores', 'r']],
      caps: [[0.8, 9.0, 'Londres, 1861', 'James Clerk Maxwell proyecta la primera foto en color'], [9.6, 17.4, 'Tres fotos, tres filtros', 'rojo, verde y azul, una encima de otra'], [18.0, 25.4, 'El ojo tiene tres tipos de conos', 'por eso tres luces bastan para engañarlo']],
      narr: [[0.8, 9.0, 'Londres, mayo de 1861. El físico James Clerk Maxwell proyecta ante el público la primera fotografía en color.'], [9.6, 17.4, 'En realidad son tres fotos en blanco y negro, proyectadas con filtros rojo, verde y azul, una encima de otra.'], [18.0, 25.4, 'Funciona porque el ojo humano tiene tres tipos de células para el color. Con tres luces basta.']] },
    { id: 'universo', name: 'UNIVERSO', dur: 30, formula: [['R', 'i'], [' = ', 'r'], ['{ ', 'r'], ['x', 'i'], [' ∈ ', 'r'], ['U', 'i'], [' : ', 'r'], ['x', 'i'], [' lleva luz roja }', 'r']],
      caps: [[0.8, 9.4, 'El universo', 'todos los objetos de los que se va a hablar'], [10.0, 19.4, 'Ocho colores', 'los que hace un píxel con cada luz prendida o apagada'], [20.0, 29.4, 'Dos conjuntos dentro de U', 'R: llevan luz roja · G: llevan luz verde']],
      narr: [[0.8, 9.4, 'Antes de operar hay que decir de qué objetos se habla. Ese conjunto grande se llama universo, y se dibuja como un rectángulo.'], [10.0, 19.4, 'Aquí el universo son los ocho colores que hace un píxel, con cada luz prendida o apagada.'], [20.0, 29.4, 'Adentro van dos conjuntos: R, los colores que llevan luz roja, y G, los que llevan luz verde. Es un diagrama de Venn.']] },
    { id: 'union', name: 'UNIÓN', dur: 28, formula: [['R', 'i'], [' ∪ ', 'r'], ['G', 'i'], [' = ', 'r'], ['{ ', 'r'], ['x', 'i'], [' : ', 'r'], ['x', 'i'], [' ∈ ', 'r'], ['R', 'i'], ['  o  ', 'r'], ['x', 'i'], [' ∈ ', 'r'], ['G', 'i'], [' }', 'r']],
      caps: [[0.8, 9.4, 'Unión', 'lo que está en R o está en G'], [10.0, 18.4, 'Se escribe ∪', 'el «o» incluye a los que están en los dos'], [19.0, 27.4, 'Seis colores', 'todos los que llevan rojo, verde o ambos']],
      narr: [[0.8, 9.4, 'La primera operación es la unión: se juntan los elementos que están en R o están en G.'], [10.0, 18.4, 'Se escribe con este símbolo. Ese «o» incluye a los elementos que están en los dos conjuntos.'], [19.0, 27.4, 'La unión de R y G tiene seis colores: todos los que llevan luz roja, luz verde, o las dos.']] },
    { id: 'inter', name: 'INTERSECCIÓN', dur: 28, formula: [['R', 'i'], [' ∩ ', 'r'], ['G', 'i'], [' = ', 'r'], ['{ ', 'r'], ['x', 'i'], [' : ', 'r'], ['x', 'i'], [' ∈ ', 'r'], ['R', 'i'], ['  y  ', 'r'], ['x', 'i'], [' ∈ ', 'r'], ['G', 'i'], [' }', 'r']],
      caps: [[0.8, 9.4, 'Intersección', 'lo que está en R y también en G'], [10.0, 18.4, 'Se escribe ∩', 'la zona donde los dos círculos se cruzan'], [19.0, 27.4, 'Ahí está el amarillo', 'luz roja y luz verde a la vez']],
      narr: [[0.8, 9.4, 'La intersección es lo contrario de juntar todo: solo los elementos que están en R y también en G.'], [10.0, 18.4, 'Se escribe con este símbolo, y es la zona donde los dos círculos se cruzan.'], [19.0, 27.4, 'Y ahí está el amarillo. No es una luz: es la intersección de la luz roja y la luz verde.']] },
    { id: 'dif', name: 'DIFERENCIA', dur: 28, formula: [['R', 'i'], [' − ', 'r'], ['G', 'i'], [' = ', 'r'], ['{ ', 'r'], ['x', 'i'], [' : ', 'r'], ['x', 'i'], [' ∈ ', 'r'], ['R', 'i'], ['  y  ', 'r'], ['x', 'i'], [' ∉ ', 'r'], ['G', 'i'], [' }', 'r']],
      caps: [[0.8, 9.4, 'Diferencia', 'lo que está en R pero no en G'], [10.0, 18.4, 'El orden importa', 'G − R es otro conjunto'], [19.0, 27.4, 'Como una resta', 'a R se le quita lo que comparte con G']],
      narr: [[0.8, 9.4, 'La diferencia R menos G: los elementos que están en R pero no están en G. Rojo y magenta.'], [10.0, 18.4, 'Aquí el orden sí importa. G menos R es otro conjunto distinto: verde y cian.'], [19.0, 27.4, 'Funciona como una resta: al conjunto R se le quita todo lo que comparte con G.']] },
    { id: 'comp', name: 'COMPLEMENTO', dur: 26, formula: [['R', 'i'], ['ᶜ', 'r'], [' = ', 'r'], ['U', 'i'], [' − ', 'r'], ['R', 'i']],
      caps: [[0.8, 9.4, 'Complemento', 'lo que está en el universo pero no en R'], [10.0, 17.4, 'Se escribe con una c arriba', 'y se lee «R complemento»'], [18.0, 25.4, 'Depende del universo', 'por eso primero hay que decir cuál es U']],
      narr: [[0.8, 9.4, 'El complemento de R es todo lo que está en el universo pero no está en R: los colores sin luz roja.'], [10.0, 17.4, 'Se escribe con una c pequeña arriba, y se lee R complemento.'], [18.0, 25.4, 'El complemento depende del universo. Por eso lo primero fue decir cuál era U.']] },
    { id: 'sim', name: 'DIFERENCIA SIMÉTRICA', dur: 26, formula: [['R', 'i'], [' △ ', 'r'], ['G', 'i'], [' = (', 'r'], ['R', 'i'], [' − ', 'r'], ['G', 'i'], [') ∪ (', 'r'], ['G', 'i'], [' − ', 'r'], ['R', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Diferencia simétrica', 'lo que está en uno solo de los dos'], [10.0, 17.4, 'Se escribe △', 'la unión menos la intersección'], [18.0, 25.4, 'Las dos diferencias juntas', 'R − G unido con G − R']],
      narr: [[0.8, 9.4, 'La diferencia simétrica reúne los elementos que están en uno solo de los dos conjuntos.'], [10.0, 17.4, 'Se escribe con un triángulo. Es la unión, quitándole la intersección.'], [18.0, 25.4, 'También se puede ver como las dos diferencias juntas: R menos G, unido con G menos R.']] },
    { id: 'contar', name: 'CONTAR LA UNIÓN', dur: 30, formula: [['n', 'i'], ['(', 'r'], ['A', 'i'], [' ∪ ', 'r'], ['B', 'i'], [') = ', 'r'], ['n', 'i'], ['(', 'r'], ['A', 'i'], [') + ', 'r'], ['n', 'i'], ['(', 'r'], ['B', 'i'], [') − ', 'r'], ['n', 'i'], ['(', 'r'], ['A', 'i'], [' ∩ ', 'r'], ['B', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Contar la unión', 'cuatro más cuatro no da seis'], [10.0, 19.4, 'Los del cruce se contaron dos veces', 'una con R y otra con G'], [20.0, 29.4, 'Se resta la intersección', 'cuatro más cuatro menos dos: seis']],
      narr: [[0.8, 9.4, 'Para contar la unión no basta sumar. R tiene cuatro elementos y G tiene cuatro, pero la unión tiene seis.'], [10.0, 19.4, 'El amarillo y el blanco se contaron dos veces: una vez con R y otra vez con G.'], [20.0, 29.4, 'Por eso se resta la intersección. Cuatro más cuatro, menos dos, da seis. Vale para dos conjuntos cualesquiera.']] },
    { id: 'cierre', name: 'CIERRE', dur: 34, formula: [['R', 'i'], [' ∩ ', 'r'], ['G', 'i'], [' ∩ ', 'r'], ['B', 'i'], [' = ', 'r'], ['{ blanco }', 'r']],
      caps: [[0.8, 9.4, 'Con la tercera luz', 'tres círculos y ocho zonas: una para cada color'], [10.0, 19.4, 'En el centro, las tres', 'la intersección de los tres conjuntos es el blanco']],
      narr: [[0.8, 9.4, 'Con la luz azul son tres conjuntos. Tres círculos hacen ocho zonas: exactamente una para cada color.'], [10.0, 19.4, 'En el centro están las tres luces a la vez. La intersección de los tres conjuntos es el blanco.'], [20.0, 33.4, 'Cada píxel de esta pantalla es una zona de este diagrama. Unir, cruzar y quitar: con tres luces y esas operaciones salen todos los colores.']] },
  ];
  const TITLE = 'OPERACIONES', LINE = 'Tres luces, ocho colores.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  // Los ocho colores: bits R = 1, G = 2, B = 4 (qué luces lleva prendidas).
  const COLORS = [['negro', '#0a0c14'], ['rojo', '#ff2a3c'], ['verde', '#20e060'], ['amarillo', '#ffe83a'], ['azul', '#3a6cff'], ['magenta', '#ff3af0'], ['cian', '#30e8ff'], ['blanco', '#ffffff']];
  const has = (m, bit) => !!(m & bit), R = [1, 3, 5, 7], G = [2, 3, 6, 7];
  const OPS = { union: m => has(m, 1) || has(m, 2), inter: m => has(m, 1) && has(m, 2), dif: m => has(m, 1) && !has(m, 2), difGR: m => has(m, 2) && !has(m, 1), comp: m => !has(m, 1), sim: m => has(m, 1) !== has(m, 2) };
  return { DUR: t, SCENES, SC, NARR, TITLE, LINE, COLORS, R, G, OPS };
})();
if (typeof module !== 'undefined') module.exports = D;
