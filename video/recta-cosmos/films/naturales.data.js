// «La deuda de Brahmagupta» · lección alg-11 (Los números naturales y los enteros). Datos puros: escenas, rótulos y narración.
// Historia (docs/storytelling-videos.md): hace unos 20 000 años alguien talló rayas en un hueso para contar; contar da los
// naturales. Pero 3 − 8 no tiene respuesta en ℕ, hasta que en la India del año 628 Brahmagupta escribe reglas para las
// «deudas». Analogía que se repite: la cuenta de banco. La sorpresa: el calendario no tiene año cero. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'ishango', name: 'EL HUESO DE ISHANGO', dur: 27, formula: [['contar', 'it'], ['  ⟶  ', 'r'], ['1, 2, 3, …', 'r']],
      caps: [[1.0, 8.8, 'Hace unos 20 000 años', 'alguien talló rayas en un hueso, quizá para contar'], [9.4, 17.6, 'Una raya por cada cosa', 'contar es la primera matemática'], [18.2, 26.4, 'Así nacen los naturales', '1, 2, 3, …: los números para contar']],
      narr: [[1.0, 8.8, 'Hace unos veinte mil años, en África, alguien talló rayas en un hueso. Lo encontraron en Ishango, en el Congo.'], [9.4, 17.6, 'Una raya por cada cosa, quizá días o presas. Contar es de las matemáticas más antiguas que conocemos.'], [18.2, 26.4, 'De contar nacen los primeros números: uno, dos, tres, y así sin parar. Se llaman números naturales.']] },
    { id: 'naturales', name: 'LOS NATURALES', dur: 27, formula: [['ℕ', 'r'], [' = {1, 2, 3, …}', 'r']],
      caps: [[0.8, 8.8, 'ℕ, los números naturales', 'se escriben con una letra de doble trazo'], [9.4, 17.4, 'No se acaban', 'después de cada natural n viene n + 1'], [18.0, 26.4, 'Pertenecer a ℕ', '12 ∈ ℕ, pero −8 ∉ ℕ y 3.5 ∉ ℕ']],
      narr: [[0.8, 8.8, 'Los números también forman conjuntos. El de los naturales se llama ene, y se escribe con una letra de doble trazo.'], [9.4, 17.4, 'No se acaban nunca: después de cada natural viene el siguiente, sumándole uno. Por eso se escriben tres puntos.'], [18.0, 26.4, 'Doce pertenece a los naturales. Menos ocho no, y tres y medio tampoco: con ellos no se cuenta.']] },
    { id: 'cerrado', name: 'SUMAR Y RESTAR', dur: 28, formula: [['3', 'r'], [' − ', 'r'], ['8', 'r'], [' = ', 'r'], ['?', 'r']],
      caps: [[0.8, 9.0, 'Sumar y multiplicar', 'dos naturales siempre dan otro natural'], [9.6, 18.0, 'Restar no siempre', 'a 3 no se le pueden quitar 8 en ℕ'], [18.6, 27.4, 'Hace falta algo más', 'números para lo que se debe']],
      narr: [[0.8, 9.0, 'Si sumas dos naturales, o los multiplicas, siempre llegas a otro natural. El conjunto alcanza.'], [9.6, 18.0, 'Pero restar es otra cosa. Tres menos ocho: en los naturales no hay ningún número que sirva.'], [18.6, 27.4, 'Durante siglos, en Grecia y en Europa, esa cuenta se tuvo por imposible. Para dársela hacía falta una idea nueva: números para lo que se debe.']] },
    { id: 'brahma', name: 'INDIA, AÑO 628', dur: 30, formula: [['fortuna', 'it'], [' + ', 'r'], ['deuda', 'it'], [' = ', 'r'], ['0', 'r']],
      caps: [[0.8, 9.4, 'India, año 628', 'Brahmagupta escribe reglas para el cero'], [10.0, 19.4, 'Fortunas y deudas', 'así llamaba a los positivos y a los negativos'], [20.0, 29.4, 'Una fortuna y una deuda iguales', 'se cancelan: queda cero']],
      narr: [[0.8, 9.4, 'India, año 628. El astrónomo Brahmagupta escribe un libro con reglas para calcular con el cero.'], [10.0, 19.4, 'A los números positivos los llama fortunas, y a los negativos, deudas. Así, menos cinco es deber cinco.'], [20.0, 29.4, 'Una de sus reglas: si una fortuna y una deuda son iguales, se cancelan, y lo que queda es cero.']] },
    { id: 'enteros', name: 'LOS ENTEROS', dur: 28, formula: [['ℤ', 'r'], [' = {…, −2, −1, 0, 1, 2, …}', 'r']],
      caps: [[0.8, 9.4, 'ℤ, los números enteros', 'los naturales, el cero y los negativos'], [10.0, 18.4, 'La Z viene del alemán', 'Zahlen quiere decir «números»'], [19.0, 27.4, 'Una recta hacia los dos lados', 'positivos a la derecha, negativos a la izquierda']],
      narr: [[0.8, 9.4, 'Juntando los naturales, el cero y los negativos se forma un conjunto más grande: los números enteros.'], [10.0, 18.4, 'Se escribe zeta, por la palabra alemana Zahlen, que quiere decir números.'], [19.0, 27.4, 'Los enteros se ponen en una recta: el cero en el medio, los positivos a la derecha y los negativos a la izquierda.']] },
    { id: 'cuenta', name: 'LA CUENTA DE BANCO', dur: 28, formula: [['3', 'r'], [' − ', 'r'], ['8', 'r'], [' = ', 'r'], ['−5', 'r']],
      caps: [[0.8, 9.4, 'Ahora 3 − 8 sí tiene respuesta', 'en la cuenta de banco el saldo queda en −5'], [10.0, 18.4, 'Restar es moverse a la izquierda', 'ocho pasos desde el 3 llegan al −5'], [19.0, 27.4, 'Sumar es ir a la derecha', 'consignar 5 devuelve el saldo a 0']],
      narr: [[0.8, 9.4, 'Con los enteros, tres menos ocho ya tiene respuesta. Tienes tres en la cuenta, pagas ocho y el saldo queda en menos cinco.'], [10.0, 18.4, 'En la recta, restar ocho es dar ocho pasos a la izquierda. Desde el tres se llega al menos cinco.'], [19.0, 27.4, 'Y sumar es ir a la derecha. Si consignas cinco, la deuda se cancela y el saldo vuelve a cero.']] },
    { id: 'opuestos', name: 'OPUESTOS', dur: 28, formula: [['8', 'r'], [' + (', 'r'], ['−8', 'r'], [') = 0', 'r']],
      caps: [[0.8, 9.4, 'El opuesto', 'el mismo número al otro lado del cero'], [10.0, 18.4, 'Un número y su opuesto suman cero', 'como la fortuna y la deuda de Brahmagupta'], [19.0, 27.4, 'El opuesto del opuesto', '−(−8) = 8: dos reflejos vuelven al inicio']],
      narr: [[0.8, 9.4, 'Cada entero tiene un opuesto: el número que queda a la misma distancia del cero, pero del otro lado. Es como un espejo.'], [10.0, 18.4, 'Un número y su opuesto suman cero, como la fortuna y la deuda iguales de Brahmagupta.'], [19.0, 27.4, 'Y el opuesto del opuesto es el mismo número: menos menos ocho es ocho. Dos reflejos devuelven al principio.']] },
    { id: 'inclusion', name: 'ℕ DENTRO DE ℤ', dur: 26, formula: [['ℕ', 'r'], [' ⊆ ', 'r'], ['ℤ', 'r']],
      caps: [[0.8, 9.4, 'Todo natural es entero', 'ℕ es subconjunto de ℤ'], [10.0, 25.4, 'Lo que ℤ agrega', 'ℤ − ℕ = {…, −3, −2, −1, 0}']],
      narr: [[0.8, 9.4, 'Todo número natural es también un entero. En el lenguaje de la lección anterior: ene es subconjunto de zeta.'], [10.0, 25.4, 'Lo que los enteros agregan son el cero y los negativos. Es la diferencia zeta menos ene: lo que está en zeta pero no en ene.']] },
    { id: 'cero', name: 'EL CERO', dur: 32, formula: [['0', 'r'], [' ∉ ', 'r'], ['ℕ', 'r'], ['      ', 'r'], ['0', 'r'], [' ∈ ', 'r'], ['ℤ', 'r']],
      caps: [[0.8, 9.4, 'El cero no es positivo ni negativo', 'es la frontera entre los dos lados'], [10.0, 22.4, 'El calendario no tiene año cero', 'del año 1 a. C. se pasa al año 1 d. C.'], [23.0, 31.4, 'En este curso ℕ empieza en 1', 'algunos libros incluyen el 0: hay que fijarse']],
      narr: [[0.8, 9.4, 'El cero no es positivo ni negativo: es la frontera entre los dos lados de la recta.'], [10.0, 22.4, 'La sorpresa: el calendario no tiene año cero: del año uno antes de Cristo se pasa al año uno después. Dionisio el Exiguo fijó esa cuenta en el siglo seis, cuando en Europa aún no se escribía la cifra cero.'], [23.0, 31.4, 'En este curso, los naturales empiezan en uno. Algunos libros incluyen el cero: por eso conviene fijarse en cómo se define.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['ℕ', 'r'], [' ⊆ ', 'r'], ['ℤ', 'r'], ['      ', 'r'], ['a', 'i'], [' + (', 'r'], ['−a', 'i'], [') = 0', 'r']],
      caps: [[0.8, 10.4, 'Del hueso a la cuenta de banco', 'contar lo que se tiene y lo que se debe']],
      narr: [[0.8, 10.4, 'Las rayas del hueso de Ishango contaban lo que se tenía. Las reglas de Brahmagupta permitieron contar también lo que se debe.'], [11.0, 20.4, 'Naturales para contar. Enteros para contar hacia los dos lados, con el cero en la mitad.'], [21.0, 29.4, 'Y desde entonces, tres menos ocho tiene respuesta.']] },
  ];
  const WORLD = 'ÁLGEBRA · LA RECTA REAL', TITLE = 'NATURALES Y ENTEROS', LINE = 'Para contar lo que se tiene y lo que se debe.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-11' };
})();
if (typeof module !== 'undefined') module.exports = D;
