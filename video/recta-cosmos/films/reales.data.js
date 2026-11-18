// «El secreto de la hoja A4» · lección alg-11c (Los irracionales y los números reales). Datos puros.
// Historia (docs/storytelling-videos.md): una hoja A4 doblada por la mitad conserva su forma, y para eso su lado largo
// entre el corto tiene que ser √2. Hipaso de Metaponto ya había mostrado que √2 no es una fracción. La sorpresa: el papel
// de todos los días lleva un número que ninguna fracción alcanza. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'hoja', name: 'LA HOJA A4', dur: 28, formula: [['A4', 'r'], ['  ⟶  ', 'r'], ['A5', 'r'], ['  ⟶  ', 'r'], ['A6', 'r']],
      caps: [[1.0, 9.0, 'Una hoja A4 tiene un secreto', 'doblada por la mitad, conserva su forma'], [9.6, 18.0, 'A4, A5, A6, …', 'cada una es la mitad de la anterior'], [18.6, 27.4, 'Para eso hace falta una razón exacta', 'el lado largo entre el lado corto']],
      narr: [[1.0, 9.0, 'Toma una hoja tamaño A4 y dóblala por la mitad. Lo que queda tiene exactamente la misma forma, solo que más pequeña.'], [9.6, 18.0, 'Esa mitad se llama A5. Doblada otra vez da la A6, y así. Todas igual de alargadas.'], [18.6, 27.4, 'Eso no pasa con cualquier rectángulo. Pasa solo si el lado largo dividido entre el corto da un número muy especial.']] },
    { id: 'razon', name: 'LA RAZÓN', dur: 30, formula: [['r', 'i'], ['² = 2', 'r'], ['  ⟹  ', 'r'], ['r', 'i'], [' = √2', 'r']],
      caps: [[0.8, 9.4, 'La hoja y su mitad, iguales', 'r = largo / corto en las dos'], [10.0, 19.4, 'La razón cumple r² = 2', 'su cuadrado tiene que dar 2'], [20.0, 29.4, 'Medida real de una A4', '297 mm entre 210 mm ≈ 1.414']],
      narr: [[0.8, 9.4, 'Llamemos erre a la razón entre el lado largo y el corto. La hoja y su mitad tienen que tener la misma erre.'], [10.0, 19.4, 'Al doblar, el lado largo de la mitad es el corto de la hoja. Igualando las razones, erre al cuadrado tiene que dar dos.'], [20.0, 29.4, 'Y se puede medir: una A4 tiene doscientos noventa y siete milímetros de largo y doscientos diez de ancho. Su razón es uno punto cuatro uno cuatro.']] },
    { id: 'hipaso', name: 'METAPONTO', dur: 28, formula: [['diagonal', 'it'], [' / ', 'r'], ['lado', 'it'], [' = √2', 'r']],
      caps: [[0.8, 9.4, 'Los pitagóricos creían', 'que toda medida es una fracción'], [10.0, 18.4, 'Hipaso de Metaponto', 'se le atribuye: la diagonal no es una fracción'], [19.0, 27.4, 'Según la leyenda', 'lo arrojaron al mar por decirlo']],
      narr: [[0.8, 9.4, 'Ese número ya había causado un escándalo. Los pitagóricos creían que cualquier medida se podía escribir como una fracción.'], [10.0, 18.4, 'A Hipaso de Metaponto, uno de ellos, se le atribuye estudiar la diagonal de un cuadrado de lado uno. Mide raíz de dos, y no es ninguna fracción.'], [19.0, 27.4, 'Según la leyenda, lo arrojaron al mar por revelarlo. Es una leyenda, pero cuenta lo mucho que incomodó.']] },
    { id: 'prueba', name: 'NO ES FRACCIÓN', dur: 32, formula: [['a', 'i'], ['² = 2', 'r'], ['b', 'i'], ['²', 'r']],
      caps: [[0.8, 10.4, 'Supón que √2 = a/b, ya simplificada', 'entonces a² = 2b²: a es par'], [11.0, 21.4, 'Pero entonces b también es par', 'y la fracción no estaba simplificada'], [22.0, 31.4, 'Contradicción', 'ninguna fracción da √2']],
      narr: [[0.8, 10.4, 'Supón que raíz de dos es a sobre b, simplificada. Al cuadrado, a cuadrado es dos b cuadrado: es par. Y a es par, porque un impar al cuadrado da impar.'], [11.0, 21.4, 'Si a es par, es dos por algo. Reemplazando, sale que b cuadrado también es par, y b también. Pero entonces los dos se podían dividir entre dos.'], [22.0, 31.4, 'La fracción no estaba simplificada. Eso contradice lo que supusimos: ninguna fracción da raíz de dos.']] },
    { id: 'decimal', name: 'SU DECIMAL', dur: 28, formula: [['√2', 'r'], [' = 1.41421356…', 'r']],
      caps: [[0.8, 9.4, 'Se puede acorralar', '1.4² = 1.96 < 2 < 2.25 = 1.5²'], [10.0, 18.4, 'Cada paso gana una cifra', '1.41, 1.414, 1.4142, …'], [19.0, 27.4, 'Pero nunca termina ni se repite', 'si se repitiera, sería una fracción']],
      narr: [[0.8, 9.4, 'Aunque no sea fracción, raíz de dos se puede acorralar. Uno punto cuatro al cuadrado se queda corto, y uno punto cinco se pasa.'], [10.0, 18.4, 'Partiendo el tramo una y otra vez se gana una cifra en cada paso: uno punto cuatro uno, uno punto cuatro uno cuatro.'], [19.0, 27.4, 'Pero su decimal nunca termina ni se repite. Si se repitiera, sería una fracción, y ya vimos que no lo es.']] },
    { id: 'irracionales', name: 'IRRACIONALES', dur: 30, formula: [['𝕀', 'r'], [' : decimal que no termina ni se repite', 'r']],
      caps: [[0.8, 9.4, '𝕀, los números irracionales', 'su decimal nunca termina ni se repite'], [10.0, 18.4, 'Hay muchos', '√3, π y el número de oro φ'], [19.0, 29.4, 'En un girasol', 'cada semilla gira 137.5°, el ángulo de oro']],
      narr: [[0.8, 9.4, 'Los números cuyo decimal nunca termina ni se repite se llaman irracionales. Irracional quiere decir que no es una razón entre enteros.'], [10.0, 18.4, 'Hay muchísimos. Raíz de tres, pi, y el número de oro, fi, que es uno punto seis uno ocho y así sin fin.'], [19.0, 29.4, 'Fi aparece en los girasoles. Cada semilla nueva sale girada ciento treinta y siete grados y medio respecto a la anterior: el ángulo de oro. Así las semillas llenan la flor casi sin dejar huecos.']] },
    { id: 'reales', name: 'LOS REALES', dur: 26, formula: [['ℝ', 'r'], [' = ', 'r'], ['ℚ', 'r'], [' ∪ ', 'r'], ['𝕀', 'r'], ['      ', 'r'], ['ℚ', 'r'], [' ∩ ', 'r'], ['𝕀', 'r'], [' = ∅', 'r']],
      caps: [[0.8, 9.4, 'ℝ, los números reales', 'racionales e irracionales juntos'], [10.0, 25.4, 'No comparten ningún número', 'ℚ ∩ 𝕀 = ∅: o se repite o no se repite']],
      narr: [[0.8, 9.4, 'Racionales e irracionales juntos forman los números reales. Erre es la unión de cu y de i.'], [10.0, 25.4, 'Y no comparten ningún número: un decimal o termina o se repite, o no hace ninguna de las dos cosas. La intersección de cu e i es vacía.']] },
    { id: 'cadena', name: 'LAS FAMILIAS', dur: 26, formula: [['ℕ', 'r'], [' ⊆ ', 'r'], ['ℤ', 'r'], [' ⊆ ', 'r'], ['ℚ', 'r'], [' ⊆ ', 'r'], ['ℝ', 'r']],
      caps: [[0.8, 9.4, 'Cada familia dentro de la siguiente', 'ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ'], [10.0, 25.4, 'Y 𝕀 al lado de ℚ', 'dentro de ℝ, sin tocarse']],
      narr: [[0.8, 9.4, 'Así quedan las familias de números de este mundo: naturales dentro de enteros, enteros dentro de racionales, y todos dentro de los reales.'], [10.0, 25.4, 'Los irracionales viven al lado de los racionales, dentro de los reales, sin tocarlos.']] },
    { id: 'recta', name: 'LA RECTA REAL', dur: 30, formula: [['ℝ', 'r'], ['  ⟷  ', 'r'], ['puntos de la recta', 'it']],
      caps: [[0.8, 9.4, 'La recta real', 'cada punto es un número y cada número un punto'], [10.0, 19.4, '√2 tiene su lugar exacto', 'el lado largo de la hoja, acostado en la recta'], [20.0, 29.4, 'Entre dos números siempre hay otro', 'el punto medio, y el medio del medio, sin fin']],
      narr: [[0.8, 9.4, 'Los reales llenan una recta sin huecos: cada punto es un número, y cada número es un punto. Por eso se llama la recta real.'], [10.0, 19.4, 'Raíz de dos tiene su punto exacto. Con una hoja de lado corto uno, su lado largo acostado sobre la recta llega justo ahí.'], [20.0, 29.4, 'Y entre dos números cualesquiera siempre hay otro: el punto medio. Y entre ese y cualquiera de los dos, otro más, sin fin.']] },
    { id: 'cierre', name: 'CIERRE', dur: 32, formula: [['largo', 'it'], [' / ', 'r'], ['corto', 'it'], [' = √2', 'r'], ['  ∈ ', 'r'], ['𝕀', 'r']],
      caps: [[0.8, 10.4, 'El secreto de la hoja', 'una razón que ninguna fracción alcanza']],
      narr: [[0.8, 10.4, 'El secreto de la hoja A4 es un número irracional. El papel de todos los días guarda el número que escandalizó a los pitagóricos.'], [11.0, 20.4, 'Racionales, que terminan o se repiten. Irracionales, que no. Juntos, los reales llenan la recta.'], [21.0, 31.4, 'Y esa recta, sin un solo hueco, es el lugar donde vive todo lo que sigue en el curso.']] },
  ];
  const WORLD = 'ÁLGEBRA · LA RECTA REAL', TITLE = 'IRRACIONALES Y REALES', LINE = 'Hasta una hoja guarda un irracional.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-11c', A4: [210, 297], GOLDEN: 137.5077640500378 };
})();
if (typeof module !== 'undefined') module.exports = D;
