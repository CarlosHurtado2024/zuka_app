// «La medida de Leonardo» · lección alg-12 (Razones: comparar dividiendo). Datos puros: escenas, rótulos y narración.
// Historia (docs/storytelling-videos.md): hacia 1490 Leonardo dibuja el Hombre de Vitruvio con las medidas del cuerpo
// escritas como comparaciones (brazos abiertos : altura = 1 : 1; cara : altura = 1 : 10), que valen para cualquier tamaño.
// Analogías: la plántula y el árbol (restar o dividir), la pantalla 16 : 9, la mezcla de concreto, la carrera de Bolt y el
// tren a escala. La sorpresa: sumar lo mismo a los dos términos deforma la imagen. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'vitruvio', name: 'ITALIA, HACIA 1490', dur: 28, formula: [['brazos', 'it'], [' : ', 'r'], ['altura', 'it'], [' = 1 : 1', 'r']],
      caps: [[1.0, 9.0, 'Italia, hacia 1490', 'Leonardo dibuja el Hombre de Vitruvio'], [9.6, 18.0, 'Un cuerpo medido con razones', 'brazos abiertos : altura = 1 : 1'], [18.6, 27.4, 'La cara es un décimo de la altura', 'cara : altura = 1 : 10']],
      narr: [[1.0, 9.0, 'Italia, hacia mil cuatrocientos noventa. Leonardo da Vinci dibuja a un hombre dentro de un círculo y un cuadrado.'], [9.6, 18.0, 'Sigue las medidas que había escrito el arquitecto romano Vitruvio: con los brazos abiertos, un hombre mide de ancho lo mismo que de alto.'], [18.6, 27.4, 'Y la cara, del nacimiento del pelo a la barbilla, es la décima parte de la altura. Son comparaciones que no dependen del tamaño.']] },
    { id: 'restar', name: 'RESTAR O DIVIDIR', dur: 28, formula: [['a', 'i'], [' − ', 'r'], ['b', 'i'], ['   o   ', 'it'], ['a', 'i'], [' ÷ ', 'r'], ['b', 'i']],
      caps: [[0.8, 9.4, 'Dos maneras de comparar', 'restando o dividiendo'], [10.0, 18.4, 'Las dos crecieron 2 cm', 'pero solo la plántula duplicó su altura'], [19.0, 27.4, 'La razón compara dividiendo', 'cuántas veces cabe una cantidad en la otra']],
      narr: [[0.8, 9.4, 'Hay dos maneras de comparar cantidades. Restando: cuánto más hay. Dividiendo: cuántas veces cabe una en la otra.'], [10.0, 18.4, 'Una plántula pasa de dos a cuatro centímetros; un árbol joven, de doscientos a doscientos dos. Los dos crecieron dos centímetros, pero solo la plántula duplicó su altura.'], [19.0, 27.4, 'La razón es la comparación que divide. Por eso las medidas de Leonardo valen igual para un niño que para un adulto.']] },
    { id: 'notacion', name: 'a : b', dur: 28, formula: [['a', 'i'], [' : ', 'r'], ['b', 'i'], [' = ', 'r'], ['a', 'i'], ['/', 'r'], ['b', 'i'], ['   (', 'r'], ['b', 'i'], [' ≠ 0)', 'r']],
      caps: [[0.8, 9.4, 'Se escribe a : b', 'y se lee «a es a b»'], [10.0, 18.4, 'El orden importa', '1 : 10 no es lo mismo que 10 : 1'], [19.0, 27.4, 'El segundo término no es cero', 'no se puede dividir entre 0']],
      narr: [[0.8, 9.4, 'Una razón se escribe a dos puntos b, y se lee a es a b. Es el cociente de a entre b.'], [10.0, 18.4, 'El orden importa, porque dividir no es conmutativo. Cara a altura es uno a diez; altura a cara es diez a uno.'], [19.0, 27.4, 'Y el segundo término no puede ser cero: no hay ningún número de veces que el cero quepa en una cantidad. Dividir entre cero no está definido.']] },
    { id: 'equivalentes', name: 'EQUIVALENTES', dur: 30, formula: [['16 : 9', 'r'], [' = ', 'r'], ['1920 : 1080', 'r']],
      caps: [[0.8, 9.4, 'Razones equivalentes', 'los dos términos por el mismo número'], [10.0, 19.4, 'Las pantallas anchas son 16 : 9', '1920 : 1080 es la misma razón, por 120'], [20.0, 29.4, 'Este video es 9 : 16', 'la misma forma, puesta de pie']],
      narr: [[0.8, 9.4, 'Dos razones son equivalentes si dan el mismo cociente. Se obtienen multiplicando o dividiendo los dos términos por el mismo número, distinto de cero, como con las fracciones.'], [10.0, 19.4, 'Las pantallas anchas tienen razón dieciséis a nueve. Una de mil novecientos veinte por mil ochenta píxeles es la misma razón: los dos términos por ciento veinte.'], [20.0, 29.4, 'Y este video es nueve a dieciséis: la misma forma, girada. Por eso se ve igual en un celular grande o pequeño.']] },
    { id: 'sumar', name: 'SUMAR LA DEFORMA', dur: 28, formula: [['20 : 13', 'r'], [' ≠ ', 'r'], ['16 : 9', 'r']],
      caps: [[0.8, 9.4, 'Sumar lo mismo cambia la razón', '16 : 9 con 4 más en cada término da 20 : 13'], [10.0, 18.4, 'La imagen se deforma', '20/13 ≈ 1.54, pero 16/9 ≈ 1.78'], [19.0, 27.4, 'Multiplicar sí la conserva', '32 : 18 sigue siendo 16 : 9']],
      narr: [[0.8, 9.4, 'En cambio, sumar lo mismo a los dos términos casi siempre cambia la razón. Dieciséis a nueve, con cuatro más en cada término, queda veinte a trece.'], [10.0, 18.4, 'Un círculo en esa pantalla se aplasta: veinte entre trece es uno punto cincuenta y cuatro, y no uno punto setenta y ocho.'], [19.0, 27.4, 'Si se multiplica por dos, en cambio, queda treinta y dos a dieciocho, y el círculo sigue redondo.']] },
    { id: 'parteparte', name: 'PARTE A PARTE', dur: 28, formula: [['cemento : arena : grava = 1 : 2 : 4', 'r']],
      caps: [[0.8, 9.4, 'Una mezcla de concreto', 'cemento : arena : grava = 1 : 2 : 4'], [10.0, 18.4, 'Razón parte a parte', 'por cada balde de cemento, 2 de arena'], [19.0, 27.4, 'Más concreto, la misma razón', '3 : 6 : 12 da el mismo concreto']],
      narr: [[0.8, 9.4, 'Una receta clásica de concreto mezcla cemento, arena y grava en razón uno a dos a cuatro.'], [10.0, 18.4, 'Es una razón parte a parte: compara un ingrediente con otro. Por cada balde de cemento van dos de arena y cuatro de grava.'], [19.0, 27.4, 'Para una obra más grande se multiplican los tres términos por lo mismo. Tres, seis y doce baldes dan el mismo concreto.']] },
    { id: 'partetodo', name: 'PARTE AL TODO', dur: 28, formula: [['cemento : mezcla = 1 : 7', 'r']],
      caps: [[0.8, 9.4, 'Razón parte al todo', 'una parte comparada con la mezcla entera'], [10.0, 18.4, '1 + 2 + 4 = 7 partes', 'el cemento es 1/7 de la mezcla'], [19.0, 27.4, 'En 21 baldes de material', '3 de cemento, 6 de arena y 12 de grava']],
      narr: [[0.8, 9.4, 'La otra manera es parte al todo: comparar un ingrediente con la mezcla completa.'], [10.0, 18.4, 'Uno más dos más cuatro son siete partes. El cemento es una de las siete: un séptimo de la mezcla.'], [19.0, 27.4, 'Así, en veintiún baldes de material hay tres de cemento, seis de arena y doce de grava.']] },
    { id: 'unidades', name: 'UNIDADES DISTINTAS', dur: 30, formula: [['100 m', 'r'], [' ÷ ', 'r'], ['9.58 s', 'r'], [' ≈ 10.4 m/s', 'r']],
      caps: [[0.8, 9.4, 'Razones con unidades distintas', 'metros por segundo, pesos por kilo'], [10.0, 19.4, 'Berlín, 2009', 'Usain Bolt corre 100 m en 9.58 s'], [20.0, 29.4, 'En promedio, 10.4 m por segundo', 'distancia : tiempo es la rapidez media']],
      narr: [[0.8, 9.4, 'Una razón también puede comparar cantidades de distinta clase. Entonces el resultado lleva unidades, como metros por segundo.'], [10.0, 19.4, 'Berlín, dos mil nueve. Usain Bolt corre cien metros en nueve segundos y cincuenta y ocho centésimas: récord mundial.'], [20.0, 29.4, 'Cien entre nueve punto cincuenta y ocho da unos diez punto cuatro metros por segundo: es su rapidez media, porque al salir iba más lento.']] },
    { id: 'escala', name: 'LA ESCALA', dur: 30, formula: [['modelo', 'it'], [' : ', 'r'], ['real', 'it'], [' = 1 : 87', 'r']],
      caps: [[0.8, 9.4, 'La escala también es una razón', 'tamaño del modelo : tamaño real'], [10.0, 19.4, 'Trenes en miniatura a escala 1 : 87', '1 cm del modelo son 87 cm reales'], [20.0, 29.4, 'Un vagón de 23 cm', 'representa uno de unos 20 m']],
      narr: [[0.8, 9.4, 'La escala de un modelo es otra razón: compara el tamaño del modelo con el tamaño real.'], [10.0, 19.4, 'Muchos trenes en miniatura están hechos a escala uno a ochenta y siete: cada centímetro del modelo representa ochenta y siete centímetros reales.'], [20.0, 29.4, 'Un vagón de veintitrés centímetros representa uno de dos mil un centímetros: unos veinte metros de largo.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], [' : ', 'r'], ['b', 'i'], [' = ', 'r'], ['ka', 'i'], [' : ', 'r'], ['kb', 'i']],
      caps: [[0.8, 10.4, 'Como Leonardo', 'medir comparando, sin importar el tamaño']],
      narr: [[0.8, 10.4, 'Leonardo anotó, sobre todo, cómo se comparan entre sí las partes del cuerpo.'], [11.0, 20.4, 'Eso es una razón: un cociente que no cambia si todo crece o se encoge en la misma medida.'], [21.0, 29.4, 'Y por eso el mismo dibujo sirve para cualquier persona.']] },
  ];
  const WORLD = 'ÁLGEBRA · ESCALAS Y PROPORCIONES', TITLE = 'RAZONES', LINE = 'Comparar dividiendo: cuántas veces cabe una en otra.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-12' };
})();
if (typeof module !== 'undefined') module.exports = D;
