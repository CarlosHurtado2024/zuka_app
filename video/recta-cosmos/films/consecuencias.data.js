// «El barco que dividió entre cero» · lección alg-12c (Consecuencias de los axiomas: restar, dividir y los signos). Datos puros.
// Historia (docs/storytelling-videos.md): en 1997 el USS Yorktown quedó quieto en el mar porque un programa dividió entre
// cero. Las consecuencias de los axiomas explican por qué eso no tiene respuesta. Analogía de los signos: caminar hacia
// atrás y rebobinar la película. La sorpresa: «cualquier número por cero da cero» no es una regla, se demuestra.
// Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'yorktown', name: 'USS YORKTOWN, 1997', dur: 28, formula: [['12', 'r'], [' ÷ ', 'r'], ['0', 'r'], [' = ', 'r'], ['?', 'r']],
      caps: [[1.0, 9.0, 'Septiembre de 1997', 'un buque de guerra queda quieto en el mar'], [9.6, 18.0, 'La causa: un cero', 'un tripulante escribió 0 en un campo de datos'], [18.6, 27.4, 'El programa dividió entre cero', 'y se cayó el sistema que movía el barco']],
      narr: [[1.0, 9.0, 'Septiembre de 1997, frente a la costa de Virginia. El USS Yorktown, un buque de guerra de Estados Unidos, se queda quieto en el mar.'], [9.6, 18.0, 'No fue un ataque ni una avería. Un tripulante escribió un cero en una casilla donde el programa no lo esperaba.'], [18.6, 27.4, 'El programa del barco intentó dividir entre ese cero, se bloqueó, y arrastró al sistema que movía los motores. Pasaron horas antes de que el barco volviera a avanzar.']] },
    { id: 'teoremas', name: 'CONSECUENCIAS', dur: 26, formula: [['axiomas', 'it'], ['  ⟹  ', 'r'], ['teoremas', 'it']],
      caps: [[0.8, 9.4, 'Del reglamento salen consecuencias', 'reglas que ya no se aceptan: se demuestran'], [10.0, 25.4, 'Se llaman teoremas', 'cada uno se apoya en los axiomas']],
      narr: [[0.8, 9.4, 'Para entender qué falló hay que volver al reglamento de los números reales. De esos axiomas salen otras reglas.'], [10.0, 25.4, 'Esas reglas ya no se aceptan sin más: se demuestran usando los axiomas. Se llaman teoremas. Hoy van dos definiciones, restar y dividir, y tres teoremas: por cero, los signos y cancelar.']] },
    { id: 'restar', name: 'RESTAR', dur: 26, formula: [['a', 'i'], [' − ', 'r'], ['b', 'i'], [' = ', 'r'], ['a', 'i'], [' + (', 'r'], ['−b', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Restar es sumar el opuesto', 'a − b = a + (−b)'], [10.0, 25.4, 'Así la resta hereda las reglas', 'escrita como suma, se puede reordenar']],
      narr: [[0.8, 9.4, 'Primero, una definición. Restar es sumar el opuesto: once menos cuatro es once más menos cuatro.'], [10.0, 25.4, 'Por eso la resta, que no era conmutativa, se vuelve fácil de manejar: escrita como suma, hereda todas las reglas de la suma y se puede reordenar.']] },
    { id: 'dividir', name: 'DIVIDIR', dur: 26, formula: [['a', 'i'], [' ÷ ', 'r'], ['b', 'i'], [' = ', 'r'], ['a', 'i'], [' · ', 'r'], ['1/b', 'i']],
      caps: [[0.8, 9.4, 'Dividir: por el recíproco', 'a ÷ b = a · 1/b'], [10.0, 25.4, 'Si b = 0 no hay recíproco', 'por eso dividir entre 0 no está definido']],
      narr: [[0.8, 9.4, 'También se define dividir: es multiplicar por el recíproco. Doce entre tres es doce por un tercio, que es cuatro.'], [10.0, 25.4, 'Y aquí está el problema del Yorktown. Para dividir entre cero haría falta el recíproco de cero, y el cero no tiene recíproco. Dividir entre cero no está definido.']] },
    { id: 'porcero', name: 'POR QUÉ NO SE PUEDE', dur: 30, formula: [['12', 'r'], [' ÷ ', 'r'], ['x', 'i']],
      caps: [[0.8, 9.4, '12 ÷ 0 = ?', 'ningún número multiplicado por 0 da 12'], [10.0, 19.4, '0 ÷ 0 = ?', 'cualquier número sirve: no hay una sola respuesta'], [20.0, 29.4, 'Cerca de cero se dispara', '12 ÷ 0.1 = 120,  12 ÷ 0.001 = 12 000']],
      narr: [[0.8, 9.4, 'También se ve sin axiomas. Doce entre cero tendría que ser un número que, multiplicado por cero, dé doce. No existe ninguno.'], [10.0, 19.4, 'Y cero entre cero es peor: cualquier número por cero da cero, como se verá enseguida, así que todos servirían.'], [20.0, 29.4, 'Mientras más cerca de cero está el divisor, más se dispara el resultado. En el cero mismo no hay nada que escribir.']] },
    { id: 'porcero2', name: 'POR CERO DA CERO', dur: 30, formula: [['a', 'i'], [' · 0 = 0', 'r']],
      caps: [[0.8, 9.4, 'a · 0 = 0', 'no es un axioma: se demuestra'], [10.0, 19.4, 'Con la distributiva', 'a · 0 = a · (0 + 0) = a · 0 + a · 0'], [20.0, 29.4, 'Se resta a · 0 a los dos lados', 'y lo que queda es 0 = a · 0']],
      narr: [[0.8, 9.4, 'Aquí viene la sorpresa. Que cualquier número por cero dé cero no está en el reglamento. Es un teorema, y se demuestra.'], [10.0, 19.4, 'Como cero más cero es cero, a por cero vale a por la suma cero más cero. Con la distributiva, eso es a por cero más a por cero.'], [20.0, 29.4, 'Restando a por cero a los dos lados, queda cero igual a a por cero. Demostrado con las reglas del juego.']] },
    { id: 'signos', name: 'LA LEY DE LOS SIGNOS', dur: 30, formula: [['(−)(+) = −', 'r'], ['      ', 'r'], ['(−)(−) = +', 'r']],
      caps: [[0.8, 9.4, 'Una película al revés', 'caminar hacia adelante y rebobinar'], [10.0, 19.4, '(−)(+) = −', 'caminar atrás y pasar normal: va hacia atrás'], [20.0, 29.4, '(−)(−) = +', 'caminar atrás y rebobinar: va hacia adelante']],
      narr: [[0.8, 9.4, 'Para la ley de los signos sirve una película. Alguien camina hacia adelante, y la película se pasa al revés: en pantalla parece que retrocede.'], [10.0, 19.4, 'Si camina hacia atrás y la película se pasa normal, en pantalla va hacia atrás. Negativo por positivo da negativo.'], [20.0, 29.4, 'Pero si camina hacia atrás y la película se rebobina, en pantalla avanza. Negativo por negativo da positivo.']] },
    { id: 'signos2', name: 'LA DEMOSTRACIÓN', dur: 30, formula: [['(', 'r'], ['−a', 'i'], [')(', 'r'], ['−b', 'i'], [') = ', 'r'], ['ab', 'i']],
      caps: [[0.8, 10.4, 'Por qué menos por menos da más', '(−a)(−b) + (−a)b = (−a)(−b + b) = 0'], [11.0, 20.4, 'Entonces (−a)(−b) es el opuesto', 'del número (−a)b, que es −ab'], [21.0, 29.4, 'Y el opuesto de −ab es ab', 'menos por menos da más, sin trucos']],
      narr: [[0.8, 10.4, 'Y no es solo una analogía: se demuestra. Al sumar menos a por menos b y menos a por b, la distributiva saca factor común y queda menos a por cero: cero.'], [11.0, 20.4, 'Dos números que suman cero son opuestos. Menos a por menos b es el opuesto de menos a por b, que es menos a b: sumado con a b da cero.'], [21.0, 29.4, 'Y el opuesto de menos a b es a b. Menos por menos da más, con las reglas del juego.']] },
    { id: 'cancelativa', name: 'CANCELATIVA', dur: 30, formula: [['ab', 'i'], [' = ', 'r'], ['ac', 'i'], [', ', 'r'], ['a', 'i'], [' ≠ 0  ⟹  ', 'r'], ['b', 'i'], [' = ', 'r'], ['c', 'i']],
      caps: [[0.8, 9.4, 'Ley cancelativa', 'lo mismo a los dos lados se puede quitar'], [10.0, 19.4, 'Con el producto, cuidado', '0 · 3 = 0 · 7, pero 3 ≠ 7'], [20.0, 29.4, 'Solo si no es cero', 'ab = ac y a ≠ 0  ⟹  b = c']],
      narr: [[0.8, 9.4, 'Último teorema: la ley cancelativa. Si dos cuentas son iguales y tienen el mismo sumando, ese sumando se puede quitar de las dos.'], [10.0, 19.4, 'Con el producto hay que tener cuidado. Cero por tres es igual a cero por siete, y sin embargo tres no es igual a siete.'], [20.0, 29.4, 'Por eso un factor solo se cancela si no es cero. Es el mismo error del Yorktown: tratar al cero como a cualquier otro número.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], [' ÷ ', 'r'], ['b', 'i'], [' = ', 'r'], ['a', 'i'], [' · ', 'r'], ['1/b', 'i'], ['   (', 'r'], ['b', 'i'], [' ≠ 0)', 'r']],
      caps: [[0.8, 10.4, 'Hoy los programas preguntan antes', 'revisan el divisor: si es cero, no dividen']],
      narr: [[0.8, 10.4, 'Desde entonces, los programas bien hechos revisan el divisor antes de dividir. Si es cero, no dividen: avisan.'], [11.0, 20.4, 'Restar es sumar el opuesto. Dividir es multiplicar por el recíproco, nunca entre cero.'], [21.0, 29.4, 'Y la ley de los signos, la multiplicación por cero y la cancelativa salen del mismo reglamento.']] },
  ];
  const WORLD = 'ÁLGEBRA · LA RECTA REAL', TITLE = 'CONSECUENCIAS', LINE = 'Todo sale del reglamento.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-12c' };
})();
if (typeof module !== 'undefined') module.exports = D;
