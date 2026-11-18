// «La pastilla de cada día» · lección alg-14d (Suma geométrica y suma infinita). Datos puros (generados desde sumageo.json).
// Analogía real (docs/storytelling-videos.md): una pastilla de 100 mg cada mañana, y el cuerpo elimina la mitad cada día
// (valores de ejemplo); lo que hay justo después de cada toma se acerca a 200 mg = 100 / (1 − 1/2). Historia: Arquímedes
// llena la parábola con triángulos (1 + 1/4 + 1/16 + … = 4/3). La sorpresa: 0.999… = 1. Zenón no se usa: es un ejercicio.
const D = (() => {
  const SCENES = [
    { id: 'pastilla', name: 'UNA PASTILLA AL DÍA', dur: 28, formula: [['100 + 50 + 25 + …', 'r']],
      caps: [[1.0, 9.0, 'Una pastilla de 100 mg cada mañana', 'el cuerpo elimina la mitad cada día'], [9.6, 18.0, 'Lo que queda se acumula', '100, 150, 175, 187.5, …'], [18.6, 27.4, 'Parece que crece sin fin', 'pero tras cada toma se acerca a 200 mg']],
      narr: [[1.0, 9.0, 'Supongamos que una persona toma cada mañana una pastilla de cien miligramos, y su cuerpo elimina la mitad cada día.'], [9.6, 18.0, 'Lo que queda se suma a la pastilla siguiente: cien, ciento cincuenta, ciento setenta y cinco, ciento ochenta y siete y medio.'], [18.6, 27.4, 'Parece que se va a acumular sin fin. No pasa: justo después de cada toma, la cantidad se acerca a doscientos miligramos y no los pasa.']] },
    { id: 'suma', name: 'SUMAR n TÉRMINOS', dur: 30, formula: [['3 + 6 + 12 + 24 + 48 = 93', 'r']],
      caps: [[0.8, 9.4, 'Sumar una geométrica', '3 + 6 + 12 + 24 + 48'], [10.0, 19.4, 'Multiplicar la suma por r', '2S = 6 + 12 + 24 + 48 + 96'], [20.0, 29.4, 'Restar: casi todo se cancela', '2S − S = 96 − 3, así que S = 93']],
      narr: [[0.8, 9.4, 'Antes de lo infinito, una suma con pocos términos: tres más seis más doce más veinticuatro más cuarenta y ocho.'], [10.0, 19.4, 'El truco es multiplicar la suma por la razón, dos. Sale la misma lista, corrida un lugar.'], [20.0, 29.4, 'Al restar, todo se cancela menos el último de abajo y el primero de arriba: dos S menos S es noventa y seis menos tres. S es noventa y tres.']] },
    { id: 'formula', name: 'LA FÓRMULA', dur: 28, formula: [['S', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁(', 'r'], ['r', 'i'], ['ⁿ − 1) / (', 'r'], ['r', 'i'], [' − 1)', 'r']],
      caps: [[0.8, 9.4, 'En general', 'rS − S = a₁rⁿ − a₁'], [10.0, 18.4, 'Sₙ = a₁ (rⁿ − 1) / (r − 1)', 'si r ≠ 1'], [19.0, 27.4, 'Con r = 1 no hace falta', 'todos los términos son iguales: n · a₁']],
      narr: [[0.8, 9.4, 'En general, r S menos S deja a sub uno por r a la n, menos a sub uno.'], [10.0, 18.4, 'Despejando, la suma es a sub uno por r a la n menos uno, entre r menos uno. Vale si r no es uno.'], [19.0, 27.4, 'Si r es uno, todos los términos son iguales y la suma es simplemente n por a sub uno.']] },
    { id: 'achica', name: 'SI SE ACHICAN', dur: 30, formula: [['1/2 + 1/4 + 1/8 + …', 'r']],
      caps: [[0.8, 9.4, 'Con r = 1/2', '1/2 + 1/4 + 1/8 + …'], [10.0, 19.4, 'Cada pedazo llena la mitad del hueco', 'el cuadrado nunca se pasa de 1'], [20.0, 29.4, 'La suma se acerca a 1', 'tanto como se quiera']],
      narr: [[0.8, 9.4, 'Ahora una suma que no termina: un medio, más un cuarto, más un octavo, y así para siempre.'], [10.0, 19.4, 'Con un cuadrado de área uno: cada pedazo llena la mitad de lo que falta. Nunca se pasa.'], [20.0, 29.4, 'Las sumas se acercan a uno tanto como se quiera. Por eso se dice que la suma infinita vale uno.']] },
    { id: 'infinita', name: 'LA SUMA INFINITA', dur: 28, formula: [['S', 'i'], [' = ', 'r'], ['a', 'i'], ['₁ / (1 − ', 'r'], ['r', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Si |r| < 1, rⁿ se va a 0', '(1/2)¹⁰ ≈ 0.001'], [10.0, 18.4, 'La fórmula queda', 'S = a₁ / (1 − r)'], [19.0, 27.4, '(1/2) / (1 − 1/2) = 1', 'lo que mostraba el cuadrado']],
      narr: [[0.8, 9.4, 'Si la razón está entre menos uno y uno, sus potencias se achican hacia cero: un medio a la diez ya es casi una milésima.'], [10.0, 18.4, 'Con r a la n yendo a cero, la fórmula queda: la suma infinita es a sub uno sobre uno menos r.'], [19.0, 27.4, 'Con el cuadrado: un medio entre uno menos un medio es uno. Lo mismo que mostraba el dibujo.']] },
    { id: 'dosis', name: 'LOS 200 mg', dur: 30, formula: [['100 / (1 − 1/2) = 200', 'r']],
      caps: [[0.8, 9.4, 'Volvamos a la pastilla', '100 + 50 + 25 + 12.5 + …'], [10.0, 19.4, 'a₁ = 100 y r = 1/2', 'S = 100 / (1 − 1/2) = 200 mg'], [20.0, 29.4, 'No se acumula sin fin', 'justo tras cada toma, se acerca a 200 mg']],
      narr: [[0.8, 9.4, 'Volvamos a la pastilla. Justo después de cada toma está la de hoy, la mitad de la de ayer, la cuarta parte de la de anteayer, y así.'], [10.0, 19.4, 'Es una geométrica con primer término cien y razón un medio. Su suma infinita es cien entre un medio: doscientos miligramos.'], [20.0, 29.4, 'Por eso el medicamento no se acumula sin fin: justo después de cada toma se acerca a doscientos miligramos, y justo antes, a cien.']] },
    { id: 'parabola', name: 'LA PARÁBOLA', dur: 28, formula: [['1 + 1/4 + 1/16 + … = 4/3', 'r']],
      caps: [[0.8, 9.4, 'Siglo III a. C.: Arquímedes', 'llena una parábola con triángulos'], [10.0, 18.4, 'Cada tanda es 1/4 de la anterior', '1 + 1/4 + 1/16 + …'], [19.0, 27.4, 'Suma 4/3', 'del triángulo grande: el área exacta']],
      narr: [[0.8, 9.4, 'Arquímedes llegó a algo parecido sin hablar de infinito: para medir un trozo de parábola, lo llenó con triángulos cada vez más pequeños.'], [10.0, 18.4, 'Cada tanda de triángulos tiene la cuarta parte del área de la tanda anterior.'], [19.0, 27.4, 'Uno más un cuarto más un dieciseisavo, y así: cuatro tercios del triángulo más grande. El área exacta.']] },
    { id: 'diverge', name: 'DIVERGE', dur: 30, formula: [['|', 'r'], ['r', 'i'], ['| ≥ 1', 'r']],
      caps: [[0.8, 9.4, 'Si |r| ≥ 1', 'los términos no se achican'], [10.0, 19.4, '1 + 2 + 4 + 8 + …', 'crece sin límite: diverge'], [20.0, 29.4, '1 − 1 + 1 − 1 + …', 'salta entre 1 y 0: tampoco se estabiliza']],
      narr: [[0.8, 9.4, 'Si la razón vale uno o más, en valor absoluto, los términos no se achican, y la suma no se estabiliza.'], [10.0, 19.4, 'Uno más dos más cuatro más ocho, y así, crece sin límite. Se dice que la suma diverge.'], [20.0, 29.4, 'Y con razón menos uno, las sumas saltan entre uno y cero para siempre: tampoco se acercan a un número.']] },
    { id: 'nueves', name: '0.999…', dur: 28, formula: [['0.999… = 1', 'r']],
      caps: [[0.8, 9.4, '0.999… es una suma infinita', '9/10 + 9/100 + 9/1 000 + …'], [10.0, 18.4, 'a₁ = 9/10 y r = 1/10', 'S = (9/10) / (9/10) = 1'], [19.0, 27.4, '0.999… = 1', 'dos escrituras del mismo número']],
      narr: [[0.8, 9.4, 'Una última sorpresa: cero punto nueve nueve nueve, con nueves para siempre, es una suma geométrica infinita.'], [10.0, 18.4, 'Primer término nueve décimos, razón un décimo. La suma: nueve décimos entre uno menos un décimo, que es uno.'], [19.0, 27.4, 'Cero punto nueve periódico es exactamente uno: dos maneras de escribir el mismo número.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['S', 'i'], [' = ', 'r'], ['a', 'i'], ['₁ / (1 − ', 'r'], ['r', 'i'], [')', 'r']],
      caps: [[0.8, 10.4, 'La pastilla de cada día', 'infinitas tomas, un límite: 200 mg']],
      narr: [[0.8, 10.4, 'Infinitas pastillas, una tras otra, y aun así el medicamento no pasa de doscientos miligramos.'], [11.0, 20.4, 'Cuando la razón está entre menos uno y uno, la suma infinita tiene un valor finito.'], [21.0, 29.4, 'Cuando no, la suma diverge.']] },
  ];
  const WORLD = 'ÁLGEBRA · SUCESIONES Y SERIES', TITLE = 'SUMA GEOMÉTRICA', LINE = 'Infinitos términos, una suma finita si |r| < 1.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-14d' };
})();
if (typeof module !== 'undefined') module.exports = D;
