// «Enteros, signos y jerarquía» · Preuniversitario UdeA, razonamiento lógico, mundo 1, lección pu-cm-1. Datos puros.
// Mismo formato que fracciones, porcentajes y potencias (spec 2026-11-19-preuda-videos-mundo-1): reto al inicio con una
// pregunta real del examen de admisión UdeA 2023-2 (Luisa, Juliana y Ana obtienen 33, 37 y 49; fallaron por 5, 7 y 9 en
// algún orden: el correcto es 42 y Juliana falló por 5) que se resuelve al final. En medio: la recta (posiciones,
// opuestos, orden), la distancia (|a − b|), sumar es moverse, restar es sumar el opuesto (quitar una deuda), otra pregunta
// real (UdeA 2024-1: los días como posiciones, hoy es lunes), el menos da la vuelta y la regla de los signos, y las capas.
const D = (() => {
  const SCENES = [
    { id: 'reto', name: 'TRES RESULTADOS', dur: 30,
      caps: [[1.0, 9.4, 'Tres resultados', 'tres estudiantes, el mismo cálculo'], [10.0, 19.4, '33, 37 y 49', 'fallaron por 5, 7 y 9, en algún orden'], [20.0, 29.4, 'Cuatro opciones', 'al final sabremos quién falló por cuánto']],
      narr: [[1.0, 9.4, 'Un problema para empezar. Luisa, Juliana y Ana hacen el mismo cálculo mental, cada una por su cuenta.'], [10.0, 19.4, 'Obtienen treinta y tres, treinta y siete y cuarenta y nueve. El profesor dice que se equivocaron por cinco, siete y nueve, sin decir quién por cuánto.'], [20.0, 29.4, 'Hay que decidir cuál afirmación es la verdadera. Para resolverla basta entender la recta numérica y las distancias; al final la resolvemos.']] },
    { id: 'recta', name: 'LA RECTA NUMÉRICA', dur: 28,
      caps: [[0.8, 9.4, 'Los enteros son posiciones', 'a la derecha del 0, positivos; a la izquierda, negativos'], [10.0, 18.4, '−3 y 3 son opuestos', 'están a la misma distancia del 0'], [19.0, 27.4, 'Más a la derecha, mayor', 'por eso −1 es mayor que −5']],
      narr: [[0.8, 9.4, 'Los enteros son posiciones en una recta. A la derecha del cero están los positivos; a la izquierda, los negativos.'], [10.0, 18.4, 'Menos tres y tres son opuestos: están a la misma distancia del cero, uno a cada lado.'], [19.0, 27.4, 'En la recta, el que está más a la derecha es el mayor. Por eso menos uno es mayor que menos cinco.']] },
    { id: 'distancia', name: 'LA DISTANCIA EN LA RECTA', dur: 26,
      caps: [[0.8, 8.4, 'De −3 a 5 hay 8 pasos', '5 − (−3) = 8: el mayor menos el menor'], [9.0, 16.8, '|5 − (−3)| = |−3 − 5| = 8', 'la distancia nunca es negativa'], [17.4, 25.4, 'A distancia 4 de 10', 'hay dos lugares: 6 y 14']],
      narr: [[0.8, 8.4, 'La distancia entre dos números es cuántos pasos hay de uno a otro. De menos tres a cinco hay ocho: cinco menos menos tres.'], [9.0, 16.8, 'Se escribe con barras de valor absoluto: es la misma de ida que de vuelta, y nunca es negativa.'], [17.4, 25.4, 'Y si un número está a distancia cuatro de diez, hay dos lugares posibles: seis, a la izquierda, y catorce, a la derecha.']] },
    { id: 'sumar', name: 'SUMAR ES MOVERSE', dur: 30,
      caps: [[0.8, 9.4, 'Sumar es moverse', '+6: seis pasos a la derecha'], [10.0, 19.4, '−4 + 6 = 2', 'sale de −4 y llega a 2'], [20.0, 29.4, 'Sumar un negativo', '5 + (−8): ocho pasos a la izquierda, −3']],
      narr: [[0.8, 9.4, 'Sumar es moverse en la recta. Más seis significa seis pasos hacia la derecha.'], [10.0, 19.4, 'Menos cuatro más seis: se sale de menos cuatro, se dan seis pasos a la derecha y se llega a dos.'], [20.0, 29.4, 'Sumar un negativo es moverse a la izquierda: cinco más menos ocho termina en menos tres.']] },
    { id: 'restar', name: 'RESTAR ES SUMAR EL OPUESTO', dur: 30,
      caps: [[0.8, 9.4, '3 − 7 = 3 + (−7)', 'restar es sumar el opuesto'], [10.0, 19.4, '3 − 7 = −4', 'siete pasos a la izquierda desde 3'], [20.0, 29.4, '2 − (−5) = 7', 'quitar una deuda te deja más arriba']],
      narr: [[0.8, 9.4, 'Restar es sumar el opuesto. Tres menos siete es lo mismo que tres más menos siete.'], [10.0, 19.4, 'Desde tres se dan siete pasos a la izquierda y se llega a menos cuatro.'], [20.0, 29.4, 'Y restar un negativo es quitar una deuda: si te quitan una deuda de cinco, quedas cinco más arriba. Dos menos menos cinco es siete.']] },
    { id: 'examen', name: 'LOS DÍAS EN LA RECTA', dur: 30,
      caps: [[0.8, 9.4, 'Ayer, hoy y pasado mañana', 'los días como posiciones en la recta'], [10.0, 19.4, 'Hoy = 0, ayer = −1', 'pasado mañana = 2; el día siguiente, 3'], [20.0, 29.4, 'Domingo: día 0 o día 6', 'el día 0 no es opción: hoy es lunes']],
      narr: [[0.8, 9.4, 'Otro problema: el día siguiente de pasado mañana está tan lejos del domingo como ayer lo está de pasado mañana. Hay que hallar el día de hoy.'], [10.0, 19.4, 'En la recta: hoy es cero, ayer menos uno, pasado mañana dos y el día siguiente tres. De menos uno a dos hay tres días.'], [20.0, 29.4, 'A tres días del día tres están el cero y el seis. El domingo no puede ser hoy, porque no es opción: es el seis, y hoy es lunes.']] },
    { id: 'vuelta', name: 'EL MENOS DA LA VUELTA', dur: 30,
      caps: [[0.8, 9.4, 'Por −1: dar la vuelta', 'la flecha se refleja en el 0'], [10.0, 19.4, '(−3) · (−4)', 'cada menos es una vuelta'], [20.0, 29.4, 'Dos vueltas: 12', 'cantidad par de −: +; impar: −']],
      narr: [[0.8, 9.4, 'Multiplicar por menos uno es dar la vuelta: la flecha del cinco se refleja en el cero y queda en menos cinco.'], [10.0, 19.4, 'Menos tres por menos cuatro: tres por cuatro da doce, y cada signo menos es una vuelta. La primera la deja en menos doce; la segunda la regresa.'], [20.0, 29.4, 'Por eso negativo por negativo da positivo. Con muchos factores se cuentan los signos menos: si la cantidad es par, positivo; si es impar, negativo.']] },
    { id: 'capas', name: 'LAS CAPAS DE UNA CUENTA', dur: 30,
      caps: [[0.8, 9.4, 'Primero, los paréntesis', 'lo de adentro va antes'], [10.0, 19.4, 'Luego potencias; luego × y ÷', 'de izquierda a derecha'], [20.0, 29.4, 'Al final, + y −', 'también de izquierda a derecha']],
      narr: [[0.8, 9.4, 'Una cuenta larga se resuelve por capas, como vestirse: las medias van antes que los zapatos. Primero, los paréntesis.'], [10.0, 19.4, 'Después, las potencias. Luego, multiplicaciones y divisiones, de izquierda a derecha.'], [20.0, 29.4, 'Y al final, sumas y restas, también de izquierda a derecha.']] },
    { id: 'resolver', name: 'TRES RESULTADOS, RESUELTOS', dur: 30,
      caps: [[0.8, 9.4, 'A 5, 7 o 9 de 33', 'seis lugares posibles, tres a cada lado'], [10.0, 19.4, 'Solo 42 funciona', 'está a 9 de 33, a 5 de 37 y a 7 de 49'], [20.0, 29.4, 'Juliana falló por 5', 'Luisa por 9 y Ana por 7']],
      narr: [[0.8, 9.4, 'Volvamos al reto. El resultado correcto está a distancia cinco, siete o nueve de treinta y tres: hay seis lugares posibles, tres a cada lado.'], [10.0, 19.4, 'Se prueba cada lugar. Solo cuarenta y dos funciona: a nueve de treinta y tres, a cinco de treinta y siete y a siete de cuarenta y nueve.'], [20.0, 29.4, 'Luisa falló por nueve, Juliana por cinco y Ana por siete. La afirmación verdadera es la de Juliana: se equivocó por cinco unidades.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30,
      caps: [[0.8, 10.4, 'Juliana falló por 5', 'la opción D']],
      narr: [[0.8, 10.4, 'La respuesta era la D: Juliana se equivocó por cinco. Quien piensa en la recta ve las distancias sin plantear ecuaciones.'], [11.0, 20.4, 'Sumar es moverse, restar un negativo es quitar una deuda, cada signo menos da la vuelta, y una cuenta se resuelve por capas.'], [21.0, 29.4, 'Cada signo es una dirección; cada capa, un turno.']] },
  ];
  const WORLD = 'RAZONAMIENTO LÓGICO · MUNDO 1', TITLE = 'ENTEROS, SIGNOS Y JERARQUÍA', LINE = 'Cada signo es una dirección; cada capa, un turno.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'pu-cm-1' };
})();
if (typeof module !== 'undefined') module.exports = D;
