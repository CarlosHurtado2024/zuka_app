// «La centésima de Augusto» · lección alg-13 (Porcentajes: qué son y cómo se calculan). Datos puros.
// Historia (docs/storytelling-videos.md): el emperador Augusto cobra la centesima rerum venalium, una centésima de lo que se
// vendía en subasta; los comerciantes italianos abrevian «per cento» y nace el %. Analogías: el aire en una cuadrícula de 100
// casillas, la habitación de 20 000 litros, el agua del cuerpo y el árbol que crece. La sorpresa: hay porcentajes de más de
// 100 y de menos de 1. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'augusto', name: 'ROMA', dur: 28, formula: [['1 de cada 100', 'it']],
      caps: [[1.0, 9.0, 'Roma, hace unos 2 000 años', 'el emperador Augusto crea un impuesto'], [9.6, 18.0, 'La «centésima»', 'una centésima de lo vendido en subasta'], [18.6, 27.4, 'De cada 100 monedas, 1', 'un impuesto del 1 %']],
      narr: [[1.0, 9.0, 'Roma, hace unos dos mil años. El emperador Augusto necesita dinero para el retiro de sus soldados.'], [9.6, 18.0, 'Cobra un impuesto llamado la centésima: una centésima parte del precio de lo que se vendía en las subastas.'], [18.6, 27.4, 'De cada cien monedas, una para el tesoro. Hoy diríamos: un impuesto del uno por ciento.']] },
    { id: 'porciento', name: 'POR CIENTO', dur: 28, formula: [['p', 'i'], [' % = ', 'r'], ['p', 'i'], [' / 100', 'r']],
      caps: [[0.8, 9.4, '«Por ciento» es de cada 100', 'p % = p / 100'], [10.0, 18.4, 'El símbolo %', 'nació de abreviar «per cento»'], [19.0, 27.4, '25 % = 25/100 = 1/4', 'una fracción con denominador 100']],
      narr: [[0.8, 9.4, 'Por ciento quiere decir de cada cien. Un porcentaje es una fracción con denominador cien.'], [10.0, 18.4, 'El símbolo nació en Italia, en los libros de los comerciantes, de tanto abreviar per cento.'], [19.0, 27.4, 'Así, el veinticinco por ciento es veinticinco centésimas: un cuarto de algo.']] },
    { id: 'aire', name: 'EL AIRE', dur: 30, formula: [['78 %', 'r'], [' + ', 'r'], ['21 %', 'r'], [' + ', 'r'], ['1 %', 'r'], [' = 100 %', 'r']],
      caps: [[0.8, 9.4, 'El aire seco', '78 % nitrógeno y 21 % oxígeno'], [10.0, 19.4, 'Una cuadrícula de 100 casillas', '78 de nitrógeno y 21 de oxígeno'], [20.0, 29.4, 'Queda 1 % para lo demás', 'sobre todo argón, y un poco de CO₂']],
      narr: [[0.8, 9.4, 'En volumen, el aire seco es setenta y ocho por ciento nitrógeno y veintiuno por ciento oxígeno.'], [10.0, 19.4, 'Imagina cien casillas. Setenta y ocho son de nitrógeno y veintiuna de oxígeno: así se lee un porcentaje.'], [20.0, 29.4, 'Queda una casilla para todo lo demás: sobre todo argón, y un poco de dióxido de carbono.']] },
    { id: 'razon', name: 'RAZÓN CON EL TODO', dur: 28, formula: [['parte', 'it'], [' / ', 'r'], ['todo', 'it'], [' = ', 'r'], ['p', 'i'], [' / 100', 'r']],
      caps: [[0.8, 9.4, 'Una razón parte : todo', 'llevada a un todo de 100'], [10.0, 18.4, 'En 500 litros, 105 de oxígeno', '105 : 500 = 21 : 100'], [19.0, 27.4, 'La proporción del porcentaje', 'parte / todo = p / 100']],
      narr: [[0.8, 9.4, 'Un porcentaje es una razón de una parte con el todo, escalada para que el todo valga cien.'], [10.0, 18.4, 'En quinientos litros de aire hay ciento cinco de oxígeno. Ciento cinco es a quinientos como veintiuno es a cien.'], [19.0, 27.4, 'Esa proporción, parte sobre todo igual a p sobre cien, sirve para hallar cualquiera de los tres datos.']] },
    { id: 'parte', name: 'HALLAR LA PARTE', dur: 28, formula: [['20 000 · 0.21 = 4 200', 'r']],
      caps: [[0.8, 9.4, 'Hallar la parte', 'el 21 % de 20 000 litros'], [10.0, 18.4, 'Multiplicar por la fracción', '20 000 · 21/100 = 4 200 litros'], [19.0, 27.4, 'En decimal', '20 000 · 0.21 = 4 200']],
      narr: [[0.8, 9.4, 'Primero, hallar la parte. Una habitación pequeña tiene unos veinte mil litros de aire, y el veintiuno por ciento es oxígeno.'], [10.0, 18.4, 'Se multiplica el todo por veintiún centésimas: cuatro mil doscientos litros de oxígeno.'], [19.0, 27.4, 'O, en decimal, veinte mil por cero punto veintiuno. Es la misma cuenta.']] },
    { id: 'porcentaje', name: 'HALLAR EL PORCENTAJE', dur: 28, formula: [['390 / 500 · 100 = 78 %', 'r']],
      caps: [[0.8, 9.4, 'Hallar el porcentaje', '390 litros de nitrógeno en 500'], [10.0, 18.4, 'Dividir y multiplicar por 100', '390 / 500 · 100 = 78 %'], [19.0, 27.4, 'El mismo 78 %', 'en cualquier muestra de aire seco']],
      narr: [[0.8, 9.4, 'Segundo, hallar el porcentaje. En una muestra de quinientos litros de aire hay trescientos noventa de nitrógeno.'], [10.0, 18.4, 'Se divide la parte entre el todo y se multiplica por cien: setenta y ocho por ciento.'], [19.0, 27.4, 'Es el mismo setenta y ocho por ciento de cualquier muestra de aire seco, grande o pequeña.']] },
    { id: 'todo', name: 'HALLAR EL TODO', dur: 28, formula: [['42 ÷ 0.6 = 70', 'r']],
      caps: [[0.8, 9.4, 'Hallar el todo', 'cerca del 60 % del cuerpo es agua'], [10.0, 18.4, '42 kg de agua son el 60 %', '42 ÷ 0.6 = 70 kg'], [19.0, 27.4, 'Comprobación', 'el 60 % de 70 es 42']],
      narr: [[0.8, 9.4, 'Tercero, hallar el todo. Cerca del sesenta por ciento del cuerpo de un adulto es agua.'], [10.0, 18.4, 'Si una persona tiene cuarenta y dos kilos de agua, y son justo el sesenta por ciento, pesa cuarenta y dos entre cero punto seis: setenta kilos.'], [19.0, 27.4, 'Y se comprueba al revés: el sesenta por ciento de setenta es cuarenta y dos.']] },
    { id: 'mayor', name: 'MÁS DE 100 %', dur: 30, formula: [['5 / 2 = 2.5 = 250 %', 'r']],
      caps: [[0.8, 9.4, 'Un porcentaje puede pasar de 100', 'si se compara con algo más pequeño'], [10.0, 19.4, 'Un árbol de 2 m crece hasta 5 m', '5 es el 250 % de 2'], [20.0, 29.4, '250 % = 2.5', 'dos veces y media la altura de antes']],
      narr: [[0.8, 9.4, 'Un porcentaje puede pasar de cien cuando se compara con una referencia más pequeña.'], [10.0, 19.4, 'Un árbol que medía dos metros ahora mide cinco. Su altura de hoy es el doscientos cincuenta por ciento de la de antes.'], [20.0, 29.4, 'Doscientos cincuenta por ciento es dos punto cinco: dos veces y media. Creció un ciento cincuenta por ciento.']] },
    { id: 'menor', name: 'MENOS DE 1 %', dur: 28, formula: [['0.04 % = 0.0004', 'r']],
      caps: [[0.8, 9.4, 'Y puede ser menor que 1 %', 'el CO₂ es cerca del 0.04 % del aire'], [10.0, 18.4, '0.04 % = 0.04 / 100', '4 partes de cada 10 000'], [19.0, 27.4, 'En 20 000 litros de aire', '20 000 · 0.0004 = 8 litros']],
      narr: [[0.8, 9.4, 'También hay porcentajes menores que uno. El dióxido de carbono es apenas un cero punto cero cuatro por ciento del aire.'], [10.0, 18.4, 'Eso es cuatro centésimas de centésima: cuatro partes de cada diez mil.'], [19.0, 27.4, 'En la habitación de veinte mil litros, son solo unos ocho litros de dióxido de carbono.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['parte', 'it'], [' / ', 'r'], ['todo', 'it'], [' = ', 'r'], ['p', 'i'], [' / 100', 'r']],
      caps: [[0.8, 10.4, 'De la centésima de Augusto', 'al por ciento de hoy']],
      narr: [[0.8, 10.4, 'La centésima de Augusto es la misma idea que hoy llamamos por ciento: comparar con un todo de cien.'], [11.0, 20.4, 'Parte, porcentaje y todo: una proporción con tres datos, y uno que falta.'], [21.0, 29.4, 'Por eso el mismo símbolo sirve para el aire, el cuerpo y los impuestos.']] },
  ];
  const WORLD = 'ÁLGEBRA · ESCALAS Y PROPORCIONES', TITLE = 'PORCENTAJES', LINE = 'De cada cien: la parte comparada con un todo de 100.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-13' };
})();
if (typeof module !== 'undefined') module.exports = D;
