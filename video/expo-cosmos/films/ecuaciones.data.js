// «El hombre del hielo» · lección alg-73 (Ecuaciones exponenciales y logarítmicas). Datos puros (generados desde ecuaciones.json).
// Historia (docs/storytelling-videos.md): en 1991 aparece en los Alpes de Ötztal un hombre de unos 5 300 años; si su
// cuerpo conserva cerca del 53 % del carbono 14, (1/2)^(t/5730) = 0.53 da t ≈ 5 250 años. Analogía: bajar el exponente con
// un logaritmo. La sorpresa: una ecuación con logaritmos puede dar una solución falsa que el dominio descarta.
const D = (() => {
  const SCENES = [
    { id: 'otzi', name: 'ALPES, 1991', dur: 28, formula: [['(1/2)', 'r'], ['t/5730', 'spi'], [' = 0.53', 'r']],
      caps: [[1.0, 9.0, 'Alpes de Ötztal, 1991', 'dos excursionistas encuentran un cuerpo en el hielo'], [9.6, 18.0, 'Lo llamaron Ötzi', 'vivió hace unos 5 300 años'], [18.6, 27.4, 'Su edad sale de una ecuación', 'con la incógnita en el exponente']],
      narr: [[1.0, 9.0, 'Alpes de Ötztal, mil novecientos noventa y uno. Dos excursionistas encuentran un cuerpo atrapado en el hielo.'], [9.6, 18.0, 'Lo llamaron Ötzi. No era un montañista perdido: había vivido hace unos cinco mil trescientos años.'], [18.6, 27.4, 'Su edad sale del carbono catorce, y para calcularla hay que resolver una ecuación con la incógnita en el exponente.']] },
    { id: 'bases', name: 'IGUALAR BASES', dur: 30, formula: [['8', 'r'], ['ˣ', 'r'], [' = 4', 'r'], ['ˣ⁺¹', 'r']],
      caps: [[0.8, 9.4, 'Si las bases se pueden igualar', '8ˣ = 4ˣ⁺¹'], [10.0, 19.4, '8 = 2³ y 4 = 2²', '2³ˣ = 2²ˣ⁺²'], [20.0, 29.4, 'Misma base, mismo exponente', '3x = 2x + 2, así que x = 2']],
      narr: [[0.8, 9.4, 'El camino más corto: escribir los dos lados con la misma base. Por ejemplo, ocho a la x igual a cuatro a la x más uno.'], [10.0, 19.4, 'Ocho es dos al cubo y cuatro es dos al cuadrado. Queda dos a la tres x igual a dos a la dos x más dos.'], [20.0, 29.4, 'Con la misma base, los exponentes tienen que ser iguales: tres x igual a dos x más dos. x es dos.']] },
    { id: 'logaritmo', name: 'BAJAR EL EXPONENTE', dur: 28, formula: [['3', 'r'], ['ˣ', 'r'], [' = 20', 'r']],
      caps: [[0.8, 9.4, '3ˣ = 20', '20 no es una potencia de 3'], [10.0, 18.4, 'Logaritmo a los dos lados', 'x log 3 = log 20'], [19.0, 27.4, 'x = log 20 / log 3', '≈ 2.727']],
      narr: [[0.8, 9.4, 'Pero muchas veces no se puede. Tres a la x igual a veinte: veinte no es una potencia de tres.'], [10.0, 18.4, 'Se toma logaritmo a los dos lados. Por la propiedad de la potencia, la x baja adelante: x por logaritmo de tres igual a logaritmo de veinte.'], [19.0, 27.4, 'x es logaritmo de veinte entre logaritmo de tres: dos punto siete dos siete.']] },
    { id: 'edad', name: 'LA EDAD DE ÖTZI', dur: 30, formula: [['t', 'i'], [' = 5730 · log 0.53 / log 0.5', 'r']],
      caps: [[0.8, 9.4, 'Cerca del 53 % del carbono 14', '(1/2)^(t/5730) = 0.53'], [10.0, 19.4, 'Logaritmo a los dos lados', '(t/5730) · log 0.5 = log 0.53'], [20.0, 29.4, 't ≈ 5730 · 0.916 ≈ 5 250 años', 'menos de una vida media']],
      narr: [[0.8, 9.4, 'Si en Ötzi queda cerca del cincuenta y tres por ciento del carbono catorce, un medio a la t sobre cinco mil setecientos treinta es cero punto cinco tres.'], [10.0, 19.4, 'Se toma logaritmo: t sobre cinco mil setecientos treinta, por logaritmo de un medio, igual a logaritmo de cero punto cinco tres.'], [20.0, 29.4, 'Despejando, t es unos cinco mil doscientos cincuenta años: un poco menos de una vida media, porque queda más de la mitad.']] },
    { id: 'triplicar', name: 'TRIPLICAR EL DINERO', dur: 28, formula: [['1.1', 'r'], ['ⁿ', 'r'], [' = 3', 'r']],
      caps: [[0.8, 9.4, 'Triplicar un ahorro al 10 % anual', '1.1ⁿ = 3'], [10.0, 18.4, 'n log 1.1 = log 3', 'n = log 3 / log 1.1'], [19.0, 27.4, 'n ≈ 11.5 años', 'a los 12 años ya lo triplicó']],
      narr: [[0.8, 9.4, 'La misma idea sirve con el dinero. Para triplicar un ahorro al diez por ciento anual compuesto: uno punto uno a la n igual a tres.'], [10.0, 18.4, 'Con logaritmos: n por logaritmo de uno punto uno igual a logaritmo de tres.'], [19.0, 27.4, 'n es once punto cinco, más o menos. Como los intereses se pagan por años, a los doce ya está triplicado.']] },
    { id: 'logs', name: 'ECUACIONES CON LOGARITMOS', dur: 30, formula: [['log', 'r'], ['₂ ', 'r'], ['x', 'i'], [' + log', 'r'], ['₂(', 'r'], ['x', 'i'], [' + 2) = 3', 'r']],
      caps: [[0.8, 9.4, 'log₂ x + log₂ (x + 2) = 3', 'la incógnita adentro del logaritmo'], [10.0, 19.4, 'Se juntan: log₂ (x(x + 2)) = 3', 'y se pasa a potencia: x(x + 2) = 2³'], [20.0, 29.4, 'x² + 2x − 8 = 0', 'x = 2 o x = −4']],
      narr: [[0.8, 9.4, 'También hay ecuaciones con la incógnita dentro de un logaritmo. Logaritmo en base dos de x más logaritmo en base dos de x más dos, igual a tres.'], [10.0, 19.4, 'Se juntan con la propiedad del producto, y se pasa a potencia: x por x más dos es dos al cubo, ocho.'], [20.0, 29.4, 'Queda x al cuadrado más dos x menos ocho igual a cero, que da x igual a dos o x igual a menos cuatro.']] },
    { id: 'dominio', name: 'LA TRAMPA', dur: 28, formula: [['x', 'i'], [' > 0', 'r']],
      caps: [[0.8, 9.4, 'x = −4 no sirve', 'log₂ (−4) no existe'], [10.0, 18.4, 'El dominio manda', 'x > 0 y x + 2 > 0'], [19.0, 27.4, 'Solo x = 2', 'log₂ 2 + log₂ 4 = 1 + 2 = 3']],
      narr: [[0.8, 9.4, 'Al juntar los logaritmos, la ecuación nueva acepta negativos. Pero no existe el logaritmo de menos cuatro.'], [10.0, 18.4, 'Hay que mirar el dominio: x tiene que ser positivo, y x más dos también.'], [19.0, 27.4, 'Solo sirve x igual a dos. Y se comprueba: logaritmo de dos más logaritmo de cuatro, uno más dos, tres.']] },
    { id: 'natural', name: 'CON e', dur: 30, formula: [['e', 'i'], ['0.05', 'sp'], ['t', 'spi'], [' = 2', 'r']],
      caps: [[0.8, 9.4, 'Una población crece como e^(0.05t)', 'con t en años'], [10.0, 19.4, 'Para e se usa el logaritmo natural', 'ln, con ln e = 1'], [20.0, 29.4, '0.05t = ln 2 ≈ 0.693', 't ≈ 13.9 años para duplicarse']],
      narr: [[0.8, 9.4, 'Con la base e se usa el logaritmo natural, que se escribe l n. Por ejemplo, una población que crece como e a la cero punto cero cinco t.'], [10.0, 19.4, 'Para saber cuándo se duplica, se toma logaritmo natural a los dos lados. El de e es uno, así que el exponente queda solo.'], [20.0, 29.4, 'Cero punto cero cinco t es logaritmo natural de dos, cero punto seis nueve tres: t es casi catorce años.']] },
    { id: 'comprobar', name: 'COMPROBAR SIEMPRE', dur: 28, formula: [['3', 'r'], ['2.727', 'sp'], [' ≈ 20', 'r']],
      caps: [[0.8, 9.4, 'Comprobar en la ecuación original', '3^2.727 ≈ 20.0'], [10.0, 18.4, 'Mirar el dominio', 'los logaritmos piden números positivos'], [19.0, 27.4, 'Redondear al final', 'log 20 ≈ 1.3 y log 3 ≈ 0.5 dan 2.6: lejos']],
      narr: [[0.8, 9.4, 'Siempre conviene comprobar en la ecuación original: tres a la dos punto siete dos siete da casi veinte.'], [10.0, 18.4, 'Con logaritmos, además, mirar el dominio antes de dar la respuesta.'], [19.0, 27.4, 'Y redondear solo al final: los decimales cortados a mitad del camino se van agrandando.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['x', 'i'], [' = log ', 'r'], ['a', 'i'], [' / log ', 'r'], ['b', 'i']],
      caps: [[0.8, 10.4, 'El hombre del hielo', 'una edad que estaba en el exponente']],
      narr: [[0.8, 10.4, 'La edad de Ötzi, el tiempo para triplicar un ahorro o para duplicar una población: todas son incógnitas en el exponente.'], [11.0, 20.4, 'Se igualan bases cuando se puede; si no, un logaritmo baja el exponente. Y con logaritmos, el dominio decide.'], [21.0, 29.4, 'Así se lee el reloj que estaba en el hielo.']] },
  ];
  const WORLD = 'ÁLGEBRA · CRECIMIENTO EXPONENCIAL', TITLE = 'ECUACIONES EXPONENCIALES', LINE = 'El logaritmo baja el exponente.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-73' };
})();
if (typeof module !== 'undefined') module.exports = D;
