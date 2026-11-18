// «Las reglas del juego» · lección alg-12b (Axiomas de campo: las reglas de la suma y el producto). Datos puros.
// Historia y analogía (docs/storytelling-videos.md): Euclides escribe los Elementos partiendo de pocas reglas aceptadas sin
// demostrar; los reales también tienen su reglamento. Analogías que se repiten: el reglamento de un juego, la caja del
// mercado, deshacer un paso y el zoom de una foto. La sorpresa: el cero es el único número sin recíproco, porque un zoom
// por cero no tiene vuelta. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'euclides', name: 'ALEJANDRÍA', dur: 28, formula: [['pocas reglas', 'it'], ['  ⟶  ', 'r'], ['todo lo demás', 'it']],
      caps: [[1.0, 9.0, 'Alejandría, hace unos 2 300 años', 'Euclides escribe los Elementos'], [9.6, 18.0, 'Empieza con pocas reglas', 'que se aceptan sin demostrar: axiomas'], [18.6, 27.4, 'Todo lo demás se deduce', 'como un juego sale de su reglamento']],
      narr: [[1.0, 9.0, 'Alejandría, hace unos dos mil trescientos años. Euclides escribe los Elementos, el libro de matemáticas más copiado de la historia.'], [9.6, 18.0, 'Empieza con unas pocas reglas que se aceptan sin demostrar. Se llaman axiomas.'], [18.6, 27.4, 'Y de ellas deduce todo lo demás, paso a paso. Es como un juego: con pocas reglas salen millones de partidas.']] },
    { id: 'reglamento', name: 'EL REGLAMENTO', dur: 28, formula: [['∀', 'r'], [' ', 'r'], ['a', 'i'], [', ', 'r'], ['b', 'i'], [' ∈ ', 'r'], ['ℝ', 'r']],
      caps: [[0.8, 9.4, 'Los reales también tienen reglamento', 'las reglas de la suma y el producto'], [10.0, 18.4, '∀ se lee «para todo»', 'la regla vale para cualquier número real'], [19.0, 27.4, 'Se llaman axiomas de campo', 'Dedekind los llamó Körper en 1871']],
      narr: [[0.8, 9.4, 'Los números reales también tienen su reglamento: unas pocas reglas para sumar y multiplicar, de las que sale toda el álgebra.'], [10.0, 18.4, 'Las reglas usan letras, como a y b, y este símbolo, que se lee para todo. Significa que la regla vale para cualquier número real.'], [19.0, 27.4, 'Se llaman axiomas de campo. En mil ochocientos setenta y uno, Richard Dedekind llamó cuerpo, en alemán Körper, a estos sistemas de números.']] },
    { id: 'conmutativa', name: 'CONMUTATIVA', dur: 30, formula: [['a', 'i'], [' + ', 'r'], ['b', 'i'], [' = ', 'r'], ['b', 'i'], [' + ', 'r'], ['a', 'i'], ['      ', 'r'], ['ab', 'i'], [' = ', 'r'], ['ba', 'i']],
      caps: [[0.8, 9.4, 'Conmutativa', 'el orden no cambia la suma ni el producto'], [10.0, 19.4, 'En la caja del mercado', 'el total no depende del orden en que pasan'], [20.0, 29.4, 'La resta no es conmutativa', '9 − 4 = 5, pero 4 − 9 = −5']],
      narr: [[0.8, 9.4, 'Primera regla: la conmutativa. El orden de los números no cambia una suma ni un producto.'], [10.0, 19.4, 'En la caja del mercado da igual qué producto pasa primero: el total es el mismo. Y tres filas de cinco son lo mismo que cinco filas de tres.'], [20.0, 29.4, 'La resta, en cambio, no es conmutativa: nueve menos cuatro es cinco, pero cuatro menos nueve es menos cinco.']] },
    { id: 'asociativa', name: 'ASOCIATIVA', dur: 28, formula: [['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [') + ', 'r'], ['c', 'i'], [' = ', 'r'], ['a', 'i'], [' + (', 'r'], ['b', 'i'], [' + ', 'r'], ['c', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Asociativa', 'se puede agrupar como convenga'], [10.0, 19.4, 'Agrupar bien ahorra trabajo', '17 + (25 + 75) = 17 + 100'], [20.0, 27.4, 'Y con el producto también', '(ab)c = a(bc)']],
      narr: [[0.8, 9.4, 'Segunda regla: la asociativa. Para sumar tres números da igual cuáles se juntan primero: los paréntesis se pueden mover.'], [10.0, 19.4, 'Agrupar bien ahorra trabajo. Diecisiete más veinticinco más setenta y cinco: si primero se juntan los dos últimos, da cien, y el resto es fácil.'], [20.0, 27.4, 'Con el producto pasa lo mismo: los paréntesis se pueden mover.']] },
    { id: 'neutros', name: 'NEUTROS', dur: 26, formula: [['a', 'i'], [' + 0 = ', 'r'], ['a', 'i'], ['      ', 'r'], ['a', 'i'], [' · 1 = ', 'r'], ['a', 'i']],
      caps: [[0.8, 9.4, 'Neutros', 'sumar 0 o multiplicar por 1 no cambia nada'], [10.0, 25.4, 'Como un zoom al 100 %', 'la foto se queda exactamente igual']],
      narr: [[0.8, 9.4, 'Tercera regla: los neutros. Sumar cero no cambia un número. Multiplicar por uno, tampoco. Y el uno no es el cero.'], [10.0, 25.4, 'Piensa en el zoom de una foto. Multiplicar es cambiar el tamaño, y multiplicar por uno es un zoom al cien por ciento: la foto se queda exactamente igual.']] },
    { id: 'opuesto', name: 'EL OPUESTO', dur: 28, formula: [['a', 'i'], [' + (', 'r'], ['−a', 'i'], [') = 0', 'r']],
      caps: [[0.8, 9.4, 'Inverso de la suma: el opuesto', 'a + (−a) = 0: vuelve al neutro'], [10.0, 19.4, 'Como deshacer un paso', '30 pasos adelante y 30 atrás'], [20.0, 27.4, 'Todo real tiene opuesto', 'hasta el cero: −0 = 0']],
      narr: [[0.8, 9.4, 'Cuarta regla: los inversos. El inverso de la suma se llama opuesto: el número que, sumado, devuelve al neutro, al cero.'], [10.0, 19.4, 'Es como deshacer un paso. Treinta pasos adelante y treinta atrás te dejan donde empezaste.'], [20.0, 27.4, 'Todo número real tiene opuesto. Hasta el cero: su opuesto es él mismo.']] },
    { id: 'reciproco', name: 'EL RECÍPROCO', dur: 32, formula: [['a', 'i'], [' · ', 'r'], ['1/a', 'i'], [' = 1', 'r'], ['   (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']],
      caps: [[0.8, 9.4, 'Inverso del producto: el recíproco', 'a · 1/a = 1, siempre que a ≠ 0'], [10.0, 20.4, 'Zoom × 4 y luego × 1/4', 'la foto vuelve a su tamaño'], [21.0, 31.4, 'El 0 no tiene recíproco', 'un zoom × 0 la vuelve un punto: no hay vuelta']],
      narr: [[0.8, 9.4, 'El inverso del producto se llama recíproco: el número que, multiplicado, devuelve al neutro, al uno.'], [10.0, 20.4, 'Con la foto: si la agrandas cuatro veces y luego la multiplicas por un cuarto, vuelve a su tamaño. Cuatro por un cuarto es uno.'], [21.0, 31.4, 'Y aquí viene la sorpresa. Un zoom por cero aplasta la foto hasta dejarla en un punto. Ningún zoom la devuelve: el cero es el único real sin recíproco.']] },
    { id: 'distributiva', name: 'DISTRIBUTIVA', dur: 30, formula: [['a', 'i'], ['(', 'r'], ['b', 'i'], [' + ', 'r'], ['c', 'i'], [') = ', 'r'], ['ab', 'i'], [' + ', 'r'], ['ac', 'i']],
      caps: [[0.8, 9.4, 'Distributiva', 'un factor se reparte sobre una suma'], [10.0, 19.4, 'Tres combos', '3 · (12 + 4) = 3 · 12 + 3 · 4'], [20.0, 29.4, 'Une la suma con el producto', 'es la única regla que usa las dos']],
      narr: [[0.8, 9.4, 'Quinta regla: la distributiva. Un número que multiplica a una suma se reparte sobre cada sumando.'], [10.0, 19.4, 'Tres combos de hamburguesa de doce mil y jugo de cuatro mil: puedes pagar tres veces dieciséis, o tres hamburguesas más tres jugos. Da cuarenta y ocho mil.'], [20.0, 29.4, 'Es la única regla que une la suma con el producto. Por eso aparece en casi todas las cuentas del álgebra.']] },
    { id: 'completo', name: 'EL REGLAMENTO COMPLETO', dur: 28, formula: [['a', 'i'], [' + ', 'r'], ['b', 'i'], [' ∈ ', 'r'], ['ℝ', 'r'], ['      ', 'r'], ['ab', 'i'], [' ∈ ', 'r'], ['ℝ', 'r']],
      caps: [[0.8, 9.4, 'Cerradura', 'sumar o multiplicar reales da otro real'], [10.0, 27.4, 'El reglamento completo', '5 reglas para + y para ·, y la distributiva']],
      narr: [[0.8, 9.4, 'Falta una regla, la más silenciosa: la cerradura. Sumar o multiplicar dos reales siempre da otro real.'], [10.0, 27.4, 'Ese es el reglamento completo: cerradura, conmutativa, asociativa, neutros e inversos, para la suma y para el producto, más la distributiva que las une.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], ['(', 'r'], ['b', 'i'], [' + ', 'r'], ['c', 'i'], [') = ', 'r'], ['ab', 'i'], [' + ', 'r'], ['ac', 'i']],
      caps: [[0.8, 10.4, 'Como Euclides', 'pocas reglas, y todo lo demás se deduce']],
      narr: [[0.8, 10.4, 'Como Euclides con la geometría, el álgebra arranca de un reglamento corto.'], [11.0, 20.4, 'Cada cuenta que hagas, por larga que sea, se apoya en estas reglas.'], [21.0, 29.4, 'Y en el siguiente video se ve cómo, solo con ellas, se demuestran la resta, la división y la ley de los signos.']] },
  ];
  const WORLD = 'ÁLGEBRA · LA RECTA REAL', TITLE = 'AXIOMAS DE CAMPO', LINE = 'Pocas reglas, toda el álgebra.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-12b' };
})();
if (typeof module !== 'undefined') module.exports = D;
