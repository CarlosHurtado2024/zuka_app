// «El día que sobra» · lección alg-14 (Sucesiones y progresiones aritméticas). Datos puros (generados desde sucesiones.json).
// Historia (docs/storytelling-videos.md): en el 46 a. C. Julio César agrega un día cada cuatro años; los bisiestos
// 2024, 2028, 2032… forman una progresión aritmética. Analogías: los dedos de la mano (n − 1 saltos) y la vela que baja.
// La sorpresa: el bisiesto número 20 sería 2100, que no será bisiesto (reforma de Gregorio XIII, 1582).
const D = (() => {
  const SCENES = [
    { id: 'cesar', name: 'ROMA, 46 A. C.', dur: 28, formula: [['2024, 2028, 2032, …', 'r']],
      caps: [[1.0, 9.0, 'Roma, 46 a. C.', 'Julio César reforma el calendario'], [9.6, 18.0, 'El año dura casi 365 días y cuarto', 'cada 4 años sobra un día'], [18.6, 27.4, 'Los años bisiestos', '2024, 2028, 2032, …: de 4 en 4']],
      narr: [[1.0, 9.0, 'Roma, año cuarenta y seis antes de Cristo. Julio César ordena reformar el calendario, que andaba desfasado de las estaciones.'], [9.6, 18.0, 'La Tierra tarda casi trescientos sesenta y cinco días y cuarto en dar la vuelta al Sol. Así que cada cuatro años sobra un día.'], [18.6, 27.4, 'Ese día se agrega en los años bisiestos. Hoy son dos mil veinticuatro, dos mil veintiocho, dos mil treinta y dos: de cuatro en cuatro.']] },
    { id: 'sucesion', name: 'SUCESIÓN', dur: 28, formula: [['a', 'i'], ['₁, ', 'r'], ['a', 'i'], ['₂, ', 'r'], ['a', 'i'], ['₃, …', 'r']],
      caps: [[0.8, 9.4, 'Una sucesión', 'es una lista ordenada de números'], [10.0, 18.4, 'Cada término tiene su puesto', 'a₁, a₂, a₃, …, aₙ'], [19.0, 27.4, 'El puesto es un natural', 'a₃ = 2032, el tercero desde 2024']],
      narr: [[0.8, 9.4, 'Esa lista de años es una sucesión: números ordenados, uno detrás de otro.'], [10.0, 18.4, 'Cada término tiene su puesto, escrito abajo: a sub uno es el primero, a sub n el que ocupa el puesto n.'], [19.0, 27.4, 'Los puestos son números naturales. Aquí, a sub tres es dos mil treinta y dos, el tercer bisiesto contando desde dos mil veinticuatro.']] },
    { id: 'aritmetica', name: 'PROGRESIÓN ARITMÉTICA', dur: 30, formula: [['a', 'i'], ['ₙ₊₁ = ', 'r'], ['a', 'i'], ['ₙ + ', 'r'], ['d', 'i']],
      caps: [[0.8, 9.4, 'Progresión aritmética', 'se suma siempre lo mismo'], [10.0, 19.4, 'La diferencia d', '2028 − 2024 = 4: siempre 4'], [20.0, 29.4, 'd puede ser negativa o cero', 'una vela que pierde 2 cm cada hora: d = −2']],
      narr: [[0.8, 9.4, 'Cuando para pasar de un término al siguiente se suma siempre lo mismo, la sucesión es una progresión aritmética.'], [10.0, 19.4, 'Lo que se suma se llama diferencia, d. Se halla restando dos términos seguidos: dos mil veintiocho menos dos mil veinticuatro, cuatro.'], [20.0, 29.4, 'La diferencia también puede ser negativa, como una vela que pierde dos centímetros cada hora, o cero, si nada cambia.']] },
    { id: 'saltos', name: 'SALTOS', dur: 28, formula: [['a', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁ + (', 'r'], ['n', 'i'], [' − 1)', 'r'], ['d', 'i']],
      caps: [[0.8, 9.4, 'Del primero al término n', 'hay n − 1 saltos, no n'], [10.0, 18.4, 'Como los dedos de una mano', '5 dedos, 4 espacios entre ellos'], [19.0, 27.4, 'aₙ = a₁ + (n − 1) d', 'el término general']],
      narr: [[0.8, 9.4, 'Para llegar al término n desde el primero no se dan n saltos, sino n menos uno.'], [10.0, 18.4, 'Pasa como con los dedos de una mano: cinco dedos, pero solo cuatro espacios entre ellos.'], [19.0, 27.4, 'Por eso el término general es a sub n igual a a sub uno más n menos uno veces d.']] },
    { id: 'bisiesto', name: 'EL BISIESTO 20', dur: 30, formula: [['2024 + 19 · 4 = 2100', 'r']],
      caps: [[0.8, 9.4, 'El bisiesto número 20', 'a₂₀ = 2024 + 19 · 4'], [10.0, 19.4, 'a₂₀ = 2100', 'pero 2100 no será bisiesto'], [20.0, 29.4, 'Roma, 1582: Gregorio XIII', 'los años de siglo, solo si se dividen entre 400']],
      narr: [[0.8, 9.4, 'Con la fórmula, el bisiesto número veinte, contando desde dos mil veinticuatro, es dos mil veinticuatro más diecinueve veces cuatro.'], [10.0, 19.4, 'Da dos mil cien. Y aquí viene la sorpresa: el año dos mil cien no será bisiesto.'], [20.0, 29.4, 'El año dura algo menos de trescientos sesenta y cinco días y cuarto. En mil quinientos ochenta y dos, Gregorio trece ajustó: los de siglo, solo si se dividen entre cuatrocientos.']] },
    { id: 'dos', name: 'CON DOS TÉRMINOS', dur: 28, formula: [['a', 'i'], ['₁₀ − ', 'r'], ['a', 'i'], ['₄ = 6', 'r'], ['d', 'i']],
      caps: [[0.8, 9.4, 'a₄ = 19 y a₁₀ = 43', 'dos términos bastan'], [10.0, 18.4, 'Del puesto 4 al 10 hay 6 saltos', '43 − 19 = 24 = 6d, así que d = 4'], [19.0, 27.4, 'Y se retrocede al primero', 'a₁ = 19 − 3 · 4 = 7']],
      narr: [[0.8, 9.4, 'Con dos términos se halla toda la progresión. Si el cuarto es diecinueve y el décimo cuarenta y tres:'], [10.0, 18.4, 'Del puesto cuatro al diez hay seis saltos, que suman veinticuatro. Cada salto es cuatro.'], [19.0, 27.4, 'Y del cuarto al primero se retroceden tres saltos: diecinueve menos doce, siete.']] },
    { id: 'medios', name: 'MEDIOS ARITMÉTICOS', dur: 30, formula: [['2, 5, 8, 11, 14, 17, 20', 'r']],
      caps: [[0.8, 9.4, 'Medios aritméticos', 'los términos que van entre dos dados'], [10.0, 19.4, 'Cinco medios entre 2 y 20', '7 términos, 6 saltos: d = 18 ÷ 6 = 3'], [20.0, 29.4, 'Los medios: 5, 8, 11, 14, 17', 'repartidos a la misma distancia']],
      narr: [[0.8, 9.4, 'Los medios aritméticos son los términos que se meten entre dos números dados, para formar una progresión.'], [10.0, 19.4, 'Para meter cinco entre dos y veinte: con los extremos son siete términos y seis saltos. Dieciocho entre seis, tres.'], [20.0, 29.4, 'Los medios son cinco, ocho, once, catorce y diecisiete, repartidos a la misma distancia.']] },
    { id: 'recta', name: 'EN LA GRÁFICA', dur: 28, formula: [['(', 'r'], ['n', 'i'], [', ', 'r'], ['a', 'i'], ['ₙ)', 'r'], ['  en línea recta', 'it']],
      caps: [[0.8, 9.4, 'Puestos contra términos', 'los puntos quedan en línea recta'], [10.0, 18.4, 'd dice cuánto sube', 'por cada puesto: subir, bajar o quedarse'], [19.0, 27.4, 'Solo puntos sueltos', 'n es natural: no hay término 2.5']],
      narr: [[0.8, 9.4, 'Si se dibuja cada puesto contra su término, los puntos de una progresión aritmética quedan sobre una línea recta.'], [10.0, 18.4, 'La diferencia es cuánto sube la recta por cada puesto: positiva sube, negativa baja, cero queda plana.'], [19.0, 27.4, 'Pero son puntos sueltos: los puestos son naturales, y no existe el término dos y medio.']] },
    { id: 'vela', name: 'BAJANDO', dur: 30, formula: [['a', 'i'], ['ₙ = 30 − 2(', 'r'], ['n', 'i'], [' − 1)', 'r']],
      caps: [[0.8, 9.4, 'Una vela de 30 cm', 'pierde 2 cm cada hora'], [10.0, 19.4, 'Al empezar la hora n', 'aₙ = 30 − 2(n − 1)'], [20.0, 29.4, 'a₁₆ = 0', 'tras 15 horas se termina']],
      narr: [[0.8, 9.4, 'Una progresión que baja: una vela de treinta centímetros que pierde dos centímetros cada hora.'], [10.0, 19.4, 'Al empezar la hora n mide treinta menos dos por n menos uno. La diferencia es menos dos.'], [20.0, 29.4, 'El término que vale cero es el dieciséis: después de quince horas, la vela se termina.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁ + (', 'r'], ['n', 'i'], [' − 1)', 'r'], ['d', 'i']],
      caps: [[0.8, 10.4, 'Un día cada cuatro años', 'la progresión del calendario']],
      narr: [[0.8, 10.4, 'Desde Julio César, el calendario agrega un día cada cuatro años: una progresión aritmética, con un ajuste en los siglos.'], [11.0, 20.4, 'Primer término, diferencia y número de saltos: con eso se encuentra cualquier término.'], [21.0, 29.4, 'Y el próximo día que sobra ya tiene fecha.']] },
  ];
  const WORLD = 'ÁLGEBRA · SUCESIONES Y SERIES', TITLE = 'PROGRESIONES ARITMÉTICAS', LINE = 'Sumar siempre lo mismo: un salto fijo.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-14' };
})();
if (typeof module !== 'undefined') module.exports = D;
