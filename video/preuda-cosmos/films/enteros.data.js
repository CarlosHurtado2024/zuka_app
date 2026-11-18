// «Enteros, signos y jerarquía» · Preuniversitario UdeA, razonamiento lógico, mundo 1, lección pu-cm-1. Datos puros (generados desde enteros.json).
// Sin dato histórico: un reto que se plantea al inicio (tres estudiantes resuelven 8 − 2 · (5 − 7)² y obtienen 0, 24 y 16)
// y se resuelve al final. En medio, la recta (posiciones y opuestos), sumar es moverse, restar es sumar el opuesto (quitar
// una deuda), multiplicar es repetir saltos, el menos da la vuelta, la regla de los signos y las capas de la jerarquía.
const D = (() => {
  const SCENES = [
    { id: 'reto', name: 'UNA CUENTA, TRES RESPUESTAS', dur: 28, formula: [['8 − 2 · (5 − 7)²', 'r']],
      caps: [[1.0, 9.0, '8 − 2 · (5 − 7)²', 'tres estudiantes, la misma cuenta'], [9.6, 18.0, '0, 24 o 16', 'solo uno la hizo bien'], [18.6, 27.4, 'Al final lo sabremos', 'antes, qué significa cada signo']],
      narr: [[1.0, 9.0, 'Tres estudiantes resuelven la misma cuenta: ocho menos dos por, cinco menos siete, al cuadrado.'], [9.6, 18.0, 'Uno obtiene cero, otro veinticuatro y el tercero dieciséis. Solo uno la hizo bien.'], [18.6, 27.4, 'Al final de este video sabremos cuál. Antes, hay que entender qué hace cada signo.']] },
    { id: 'recta', name: 'LA RECTA NUMÉRICA', dur: 28, formula: [['… −2  −1  0  1  2 …', 'r']],
      caps: [[0.8, 9.4, 'Los enteros son posiciones', 'a la derecha del 0, positivos; a la izquierda, negativos'], [10.0, 18.4, '−3 y 3 son opuestos', 'están a la misma distancia del 0'], [19.0, 27.4, 'Más a la derecha, mayor', 'por eso −1 es mayor que −5']],
      narr: [[0.8, 9.4, 'Los enteros son posiciones en una recta. A la derecha del cero están los positivos; a la izquierda, los negativos.'], [10.0, 18.4, 'Menos tres y tres son opuestos: están a la misma distancia del cero, uno a cada lado.'], [19.0, 27.4, 'En la recta, el que está más a la derecha es el mayor. Por eso menos uno es mayor que menos cinco.']] },
    { id: 'sumar', name: 'SUMAR ES MOVERSE', dur: 30, formula: [['−4 + 6 = 2', 'r']],
      caps: [[0.8, 9.4, 'Sumar es moverse', '+6: seis pasos a la derecha'], [10.0, 19.4, '−4 + 6 = 2', 'sale de −4 y llega a 2'], [20.0, 29.4, 'Sumar un negativo', '5 + (−8): ocho pasos a la izquierda, −3']],
      narr: [[0.8, 9.4, 'Sumar es moverse en la recta. Más seis significa seis pasos hacia la derecha.'], [10.0, 19.4, 'Menos cuatro más seis: se sale de menos cuatro, se dan seis pasos a la derecha y se llega a dos.'], [20.0, 29.4, 'Sumar un negativo es moverse a la izquierda: cinco más menos ocho termina en menos tres.']] },
    { id: 'restar', name: 'RESTAR ES SUMAR EL OPUESTO', dur: 30, formula: [['a − b = a + (−b)', 'r']],
      caps: [[0.8, 9.4, '3 − 7 = 3 + (−7)', 'restar es sumar el opuesto'], [10.0, 19.4, '3 − 7 = −4', 'siete pasos a la izquierda desde 3'], [20.0, 29.4, '2 − (−5) = 7', 'quitar una deuda te deja más arriba']],
      narr: [[0.8, 9.4, 'Restar es sumar el opuesto. Tres menos siete es lo mismo que tres más menos siete.'], [10.0, 19.4, 'Desde tres se dan siete pasos a la izquierda y se llega a menos cuatro.'], [20.0, 29.4, 'Y restar un negativo es quitar una deuda: si te quitan una deuda de cinco, quedas cinco más arriba. Dos menos menos cinco es siete.']] },
    { id: 'multiplicar', name: 'MULTIPLICAR ES REPETIR', dur: 28, formula: [['(−3) · 4 = −12', 'r']],
      caps: [[0.8, 9.4, '3 · 4 = 12', 'cuatro saltos de 3 hacia la derecha'], [10.0, 18.4, '(−3) · 4 = −12', 'cuatro saltos de 3 hacia la izquierda'], [19.0, 27.4, 'El signo dice la dirección', 'el número dice el tamaño']],
      narr: [[0.8, 9.4, 'Multiplicar es repetir saltos. Tres por cuatro son cuatro saltos de tres hacia la derecha: doce.'], [10.0, 18.4, 'Menos tres por cuatro son cuatro saltos de tres, pero hacia la izquierda: menos doce.'], [19.0, 27.4, 'El signo dice hacia dónde, y el número dice qué tan lejos.']] },
    { id: 'vuelta', name: 'EL MENOS DA LA VUELTA', dur: 30, formula: [['(−3) · (−4) = 12', 'r']],
      caps: [[0.8, 9.4, 'Por −1: dar la vuelta', 'la flecha se refleja en el 0'], [10.0, 19.4, '(−3) · (−4)', 'primero −12; el otro menos, otra vuelta'], [20.0, 29.4, 'Dos vueltas: 12', 'negativo por negativo da positivo']],
      narr: [[0.8, 9.4, 'Multiplicar por menos uno es dar la vuelta: la flecha se refleja en el cero y apunta al otro lado.'], [10.0, 19.4, 'Menos tres por menos cuatro: tres por cuatro da doce, y cada signo menos es una vuelta.'], [20.0, 29.4, 'Con dos vueltas la flecha vuelve a mirar a la derecha. Por eso negativo por negativo da positivo.']] },
    { id: 'signos', name: 'LA REGLA DE LOS SIGNOS', dur: 28, formula: [['(−1)(−2)(−3) = −6', 'r']],
      caps: [[0.8, 9.4, 'Mismo signo: positivo', 'signos distintos: negativo'], [10.0, 18.4, 'Se cuentan los negativos', 'par: positivo; impar: negativo'], [19.0, 27.4, '(−1)(−2)(−3) = −6', 'tres vueltas: queda a la izquierda']],
      narr: [[0.8, 9.4, 'La regla de los signos: con el mismo signo, positivo; con signos distintos, negativo. En la división pasa igual.'], [10.0, 18.4, 'Con muchos factores basta contar los negativos: si son pares, positivo; si son impares, negativo.'], [19.0, 27.4, 'Menos uno por menos dos por menos tres: tres vueltas, así que el resultado es menos seis.']] },
    { id: 'capas', name: 'LAS CAPAS DE UNA CUENTA', dur: 30, formula: [['( )  →  xⁿ  →  × ÷  →  + −', 'r']],
      caps: [[0.8, 9.4, 'Primero, los paréntesis', 'lo de adentro va antes'], [10.0, 19.4, 'Luego potencias; luego × y ÷', 'de izquierda a derecha'], [20.0, 29.4, 'Al final, + y −', 'también de izquierda a derecha']],
      narr: [[0.8, 9.4, 'Una cuenta larga se resuelve por capas, como vestirse: las medias van antes que los zapatos. Primero, los paréntesis.'], [10.0, 19.4, 'Después, las potencias. Luego, multiplicaciones y divisiones, de izquierda a derecha.'], [20.0, 29.4, 'Y al final, sumas y restas, también de izquierda a derecha.']] },
    { id: 'resolver', name: 'EL RETO, CAPA POR CAPA', dur: 30, formula: [['8 − 2 · (5 − 7)² = 0', 'r']],
      caps: [[0.8, 9.4, '5 − 7 = −2', 'la capa de adentro'], [10.0, 19.4, '(−2)² = 4; 2 · 4 = 8', 'la potencia y luego el producto'], [20.0, 29.4, '8 − 8 = 0', '−2² sin paréntesis sería −4']],
      narr: [[0.8, 9.4, 'Ahora el reto, capa por capa. Primero el paréntesis: cinco menos siete es menos dos.'], [10.0, 19.4, 'Luego la potencia: menos dos al cuadrado es cuatro. Después el producto: dos por cuatro, ocho.'], [20.0, 29.4, 'Y al final la resta: ocho menos ocho, cero. Ojo con los paréntesis: menos dos al cuadrado sin ellos sería menos cuatro.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['8 − 2 · (5 − 7)² = 0', 'r']],
      caps: [[0.8, 10.4, 'La respuesta era 0', '24 restó antes; 16 tomó (−2)² como −4']],
      narr: [[0.8, 10.4, 'La respuesta era cero. Quien obtuvo veinticuatro restó antes de multiplicar; quien obtuvo dieciséis olvidó los paréntesis de la potencia.'], [11.0, 20.4, 'Cada signo es una dirección en la recta, y el signo menos da la vuelta.'], [21.0, 29.4, 'Y cada capa tiene su turno.']] },
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
