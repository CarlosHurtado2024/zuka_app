// «La cantidad infinita de Bhaskara» · lección alg-25a (Dominio y simplificación). Datos puros (generados desde dominio.json).
// Historia (docs/storytelling-videos.md): hacia 1150, Bhaskara II escribe que un número dividido entre cero es una cantidad
// infinita; hoy se dice que no está definido. Analogía: repartir un alquiler de 200 000 entre n personas (200 000 / n).
// La sorpresa: al simplificar, un punto prohibido se vuelve un hueco y otro sigue siendo una asíntota.
const D = (() => {
  const SCENES = [
    { id: 'bhaskara', name: 'INDIA, HACIA 1150', dur: 28, formula: [['a', 'i'], [' / 0', 'r']],
      caps: [[1.0, 9.0, 'India, hacia 1150', 'Bhaskara II escribe sobre dividir entre cero'], [9.6, 18.0, 'La llamó «cantidad infinita»', 'un número entre cero no cambia, sume lo que sume'], [18.6, 27.4, 'Hoy se dice: no está definido', 'ningún número sirve como resultado']],
      narr: [[1.0, 9.0, 'India, hacia mil ciento cincuenta. El matemático Bhaskara segundo escribe qué pasa al dividir un número entre cero.'], [9.6, 18.0, 'Lo llamó una cantidad infinita, que no cambia aunque se le sume o se le quite algo.'], [18.6, 27.4, 'Hoy se dice algo más preciso: dividir entre cero no está definido, porque ningún número sirve como resultado.']] },
    { id: 'racional', name: 'EXPRESIÓN RACIONAL', dur: 28, formula: [['P', 'i'], ['(', 'r'], ['x', 'i'], [') / ', 'r'], ['Q', 'i'], ['(', 'r'], ['x', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Una expresión racional', 'una fracción de polinomios'], [10.0, 18.4, 'Un alquiler de 200 000 entre n', 'cada uno paga 200 000 / n'], [19.0, 27.4, 'Más personas, menos paga cada una', '4 personas: 50 000; 8 personas: 25 000']],
      narr: [[0.8, 9.4, 'Una expresión racional es una fracción de polinomios: un polinomio dividido entre otro.'], [10.0, 18.4, 'Por ejemplo, un alquiler de doscientos mil pesos repartido entre n personas: cada una paga doscientos mil sobre n.'], [19.0, 27.4, 'Con cuatro personas, cincuenta mil cada una; con ocho, veinticinco mil. Más personas, menos paga cada una.']] },
    { id: 'dominio', name: 'EL DOMINIO', dur: 30, formula: [['Q', 'i'], ['(', 'r'], ['x', 'i'], [') ≠ 0', 'r']],
      caps: [[0.8, 9.4, 'El dominio', 'los valores de x donde la expresión tiene sentido'], [10.0, 19.4, 'El denominador no puede ser 0', 'con n = 0 nadie paga: 200 000 / 0 no existe'], [20.0, 29.4, '(x + 2) / (x² − x − 2)', 'x² − x − 2 = (x − 2)(x + 1): fuera 2 y −1']],
      narr: [[0.8, 9.4, 'El dominio es el conjunto de valores de x donde la expresión tiene sentido.'], [10.0, 19.4, 'El único problema es el denominador: no puede valer cero. Con cero personas, el alquiler no se puede repartir.'], [20.0, 29.4, 'En x más dos sobre x al cuadrado menos x menos dos, el denominador es x menos dos por x más uno. Quedan fuera el dos y el menos uno.']] },
    { id: 'asintota', name: 'LA ASÍNTOTA', dur: 30, formula: [['1 / ', 'r'], ['x', 'i']],
      caps: [[0.8, 9.4, 'Cerca de cero, 1/x se dispara', '1/0.1 = 10, 1/0.01 = 100, 1/0.001 = 1 000'], [10.0, 19.4, 'Una asíntota vertical', 'una recta a la que la curva se pega sin tocarla'], [20.0, 29.4, 'Del otro lado, hacia abajo', '1/(−0.01) = −100']],
      narr: [[0.8, 9.4, 'Cerca de donde el denominador vale cero, la expresión se dispara: uno entre cero punto uno es diez; entre cero punto cero uno, cien.'], [10.0, 19.4, 'La curva sube pegada a una recta vertical que nunca toca. Esa recta se llama asíntota vertical.'], [20.0, 29.4, 'Del otro lado del cero baja sin fin: uno entre menos cero punto cero uno es menos cien.']] },
    { id: 'simplificar', name: 'SIMPLIFICAR', dur: 30, formula: [['(', 'r'], ['x', 'i'], [' − 2)(', 'r'], ['x', 'i'], [' + 2) / (', 'r'], ['x', 'i'], [' − 2)(', 'r'], ['x', 'i'], [' + 1)', 'r']],
      caps: [[0.8, 9.4, '(x² − 4) / (x² − x − 2)', 'se factoriza arriba y abajo'], [10.0, 19.4, '(x − 2) está en los dos pisos', 'se cancela: queda (x + 2) / (x + 1)'], [20.0, 29.4, 'Como 6/8 = (2 · 3)/(2 · 4) = 3/4', 'un factor común se cancela']],
      narr: [[0.8, 9.4, 'Se factoriza arriba y abajo. En x al cuadrado menos cuatro sobre x al cuadrado menos x menos dos, arriba queda x menos dos por x más dos.'], [10.0, 19.4, 'El factor x menos dos aparece arriba y abajo, y se cancela. Queda x más dos sobre x más uno.'], [20.0, 29.4, 'Es lo mismo que con números: seis octavos es dos por tres sobre dos por cuatro, y el dos se cancela.']] },
    { id: 'factores', name: 'SOLO FACTORES', dur: 28, formula: [['(', 'r'], ['x', 'i'], [' + 5) / ', 'r'], ['x', 'i'], [' ≠ 5', 'r']],
      caps: [[0.8, 9.4, 'Solo se cancelan factores', 'lo que multiplica a todo un piso'], [10.0, 18.4, '(x + 5) / x no es 5', 'la x de arriba está sumando'], [19.0, 27.4, 'Con x = 1: 6/1 = 6, no 5', 'un ejemplo basta para ver el error']],
      narr: [[0.8, 9.4, 'Ojo: solo se cancelan factores, es decir, lo que multiplica a todo el numerador y a todo el denominador.'], [10.0, 18.4, 'En x más cinco sobre x, la x de arriba está sumando, no multiplicando. No se cancela.'], [19.0, 27.4, 'Basta probar con x igual a uno: seis sobre uno es seis, no cinco.']] },
    { id: 'hueco', name: 'UN HUECO Y UNA ASÍNTOTA', dur: 30, formula: [['(', 'r'], ['x', 'i'], [' + 2) / (', 'r'], ['x', 'i'], [' + 1),  ', 'r'], ['x', 'i'], [' ≠ 2', 'r']],
      caps: [[0.8, 9.4, 'El dominio se mira en la original', 'x ≠ 2 y x ≠ −1'], [10.0, 19.4, 'En x = 2: un hueco', 'el factor se canceló; la curva tiene un punto vacío'], [20.0, 29.4, 'En x = −1: una asíntota', 'el denominador vale 0 y el numerador, 1']],
      narr: [[0.8, 9.4, 'Pero el dominio se mira en la expresión original, antes de cancelar: x no puede ser dos ni menos uno.'], [10.0, 19.4, 'En dos, el factor que se canceló deja un hueco: la curva sigue de largo, pero en x igual a dos le falta un punto.'], [20.0, 29.4, 'En menos uno, el denominador vale cero y el numerador no: hay una asíntota. Dos puntos prohibidos, dos cosas distintas.']] },
    { id: 'valor', name: 'CERCA DEL HUECO', dur: 28, formula: [['(2 + 2) / (2 + 1) = 4/3', 'r']],
      caps: [[0.8, 9.4, 'Cerca de x = 2', 'la expresión se acerca a 4/3'], [10.0, 18.4, 'x = 1.99: ≈ 1.334; x = 2.01: ≈ 1.332', 'pero en 2 no hay valor'], [19.0, 27.4, 'El hueco está en (2, 4/3)', 'un punto vacío en la curva']],
      narr: [[0.8, 9.4, 'Cerca del hueco la expresión se porta bien: con x cerca de dos, vale casi cuatro tercios.'], [10.0, 18.4, 'Con uno punto noventa y nueve da uno punto trescientos treinta y cuatro; con dos punto cero uno, uno punto trescientos treinta y dos.'], [19.0, 27.4, 'En dos no tiene valor: el hueco está en el punto dos, cuatro tercios.']] },
    { id: 'alquiler', name: 'EL ALQUILER, OTRA VEZ', dur: 30, formula: [['200 000 / ', 'r'], ['n', 'i']],
      caps: [[0.8, 9.4, '200 000 / n', 'dominio: n ≠ 0'], [10.0, 19.4, 'Pocas personas: cuota alta', '1 persona: 200 000'], [20.0, 29.4, 'Con muchas, se acerca a 0', '1 000 personas: 200 pesos']],
      narr: [[0.8, 9.4, 'Volvamos al alquiler. Doscientos mil sobre n tiene dominio n distinto de cero.'], [10.0, 19.4, 'Con una persona, la cuota es todo el alquiler; entre menos gente, más cara.'], [20.0, 29.4, 'Y con muchísima gente se acerca a cero sin llegar: con mil personas, doscientos pesos cada una.']] },
    { id: 'cierre', name: 'CIERRE', dur: 28, formula: [['Q', 'i'], ['(', 'r'], ['x', 'i'], [') ≠ 0', 'r']],
      caps: [[0.8, 10.4, 'La cantidad infinita de Bhaskara', 'donde el denominador es cero, no hay valor']],
      narr: [[0.8, 10.4, 'Bhaskara intuyó que algo raro pasa al dividir entre cero. Hoy lo decimos con el dominio: ahí no hay valor.'], [11.0, 20.4, 'Se factoriza, se cancelan solo factores, y el dominio se mira antes de cancelar.'], [21.0, 27.4, 'Un hueco o una asíntota: el denominador avisa.']] },
  ];
  const WORLD = 'ÁLGEBRA · FRACCIONES ALGEBRAICAS', TITLE = 'DOMINIO Y SIMPLIFICACIÓN', LINE = 'El denominador manda: donde vale cero, no hay valor.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-25a' };
})();
if (typeof module !== 'undefined') module.exports = D;
