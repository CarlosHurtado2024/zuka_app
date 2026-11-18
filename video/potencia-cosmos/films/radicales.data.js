// «La espiral de Teodoro» · lección alg-22b (Simplificar y racionalizar). Datos puros (generados desde radicales.json).
// Historia (docs/storytelling-videos.md): según el Teeteto de Platón, Teodoro de Cirene mostró que √3, √5, …, √17 no son
// fracciones; hoy se dibuja su espiral de triángulos. Analogías: el cuadrado escondido (√8 mide el doble que √2), los
// objetos iguales (semejantes), el uno disfrazado y el cuadrado al que se le quita otro. La sorpresa: √8 + √18 = 5√2.
const D = (() => {
  const SCENES = [
    { id: 'teodoro', name: 'GRECIA, SIGLO V A. C.', dur: 28, formula: [['√2, √3, √4, …, √17', 'r']],
      caps: [[1.0, 9.0, 'Grecia, siglo V a. C.', 'Teodoro de Cirene estudia √3, √5, …, √17'], [9.6, 18.0, 'Una espiral de triángulos', 'cada uno con un cateto de 1'], [18.6, 27.4, 'Las hipotenusas', '√2, √3, √4, √5…']],
      narr: [[1.0, 9.0, 'Grecia, siglo quinto antes de Cristo. Según Platón, Teodoro de Cirene mostró que raíz de tres, de cinco y otras hasta diecisiete no son fracciones.'], [9.6, 18.0, 'Hoy se dibuja su espiral: triángulos rectángulos pegados, cada uno con un cateto de longitud uno.'], [18.6, 27.4, 'Las hipotenusas miden raíz de dos, raíz de tres, raíz de cuatro, raíz de cinco, y así, una tras otra.']] },
    { id: 'escondido', name: 'EL CUADRADO ESCONDIDO', dur: 30, formula: [['√8 = √4 · √2 = 2√2', 'r']],
      caps: [[0.8, 9.4, '√8 en la espiral', 'mide justo el doble que √2'], [10.0, 19.4, '8 = 4 · 2, y 4 es un cuadrado', '√8 = √4 · √2 = 2√2'], [20.0, 29.4, '√(ab) = √a · √b', 'si a y b no son negativos']],
      narr: [[0.8, 9.4, 'En la espiral, la hipotenusa de raíz de ocho mide justo el doble que la de raíz de dos.'], [10.0, 19.4, 'La razón: ocho es cuatro por dos, y cuatro es un cuadrado escondido. Raíz de ocho es raíz de cuatro por raíz de dos: dos raíz de dos.'], [20.0, 29.4, 'Funciona porque la raíz de un producto es el producto de las raíces, si los factores no son negativos.']] },
    { id: 'simplificar', name: 'SIMPLIFICAR', dur: 28, formula: [['√50 = 5√2', 'r']],
      caps: [[0.8, 9.4, 'Buscar el mayor cuadrado', 'que divida al número'], [10.0, 18.4, '√12 = √(4 · 3) = 2√3', '4 es el cuadrado de 2'], [19.0, 27.4, '√50 = √(25 · 2) = 5√2', '25 es el cuadrado de 5']],
      narr: [[0.8, 9.4, 'Para simplificar una raíz se busca el mayor cuadrado que divida al número de adentro.'], [10.0, 18.4, 'Raíz de doce: doce es cuatro por tres. Sale el dos, y queda dos raíz de tres.'], [19.0, 27.4, 'Raíz de cincuenta: cincuenta es veinticinco por dos. Sale el cinco: cinco raíz de dos.']] },
    { id: 'semejantes', name: 'SEMEJANTES', dur: 30, formula: [['3√2 + 5√2 = 8√2', 'r']],
      caps: [[0.8, 9.4, 'Radicales semejantes', 'mismo índice y radicando: se suman como objetos'], [10.0, 19.4, '3√2 + 5√2 = 8√2', 'tres más cinco de la misma cosa'], [20.0, 29.4, '√2 + √3 no es √5', '≈ 3.15, y √5 ≈ 2.24']],
      narr: [[0.8, 9.4, 'Los radicales con la misma raíz se llaman semejantes, y se suman como objetos iguales.'], [10.0, 19.4, 'Tres raíz de dos más cinco raíz de dos son ocho raíz de dos: tres más cinco de la misma cosa.'], [20.0, 29.4, 'Pero raíz de dos más raíz de tres no es raíz de cinco: la suma da cerca de tres punto quince, y raíz de cinco, dos punto veinticuatro.']] },
    { id: 'primero', name: 'SIMPLIFICAR PRIMERO', dur: 28, formula: [['√8 + √18 = 5√2', 'r']],
      caps: [[0.8, 9.4, '√8 + √18', 'parecen distintos'], [10.0, 18.4, '√8 = 2√2 y √18 = 3√2', 'escondían la misma raíz'], [19.0, 27.4, '2√2 + 3√2 = 5√2', 'ya son semejantes']],
      narr: [[0.8, 9.4, 'A veces dos raíces parecen distintas y no lo son. Raíz de ocho más raíz de dieciocho.'], [10.0, 18.4, 'Simplificando: raíz de ocho es dos raíz de dos, y raíz de dieciocho es tres raíz de dos.'], [19.0, 27.4, 'Ahora sí son semejantes: dos más tres, cinco raíz de dos.']] },
    { id: 'racionalizar', name: 'RACIONALIZAR', dur: 30, formula: [['1/√2 = √2/2', 'r']],
      caps: [[0.8, 9.4, 'Antes de las calculadoras', 'dividir entre 1.41421… era muy pesado'], [10.0, 19.4, 'Multiplicar por un uno disfrazado', '√2 / √2 = 1'], [20.0, 29.4, '1/√2 = √2/2 ≈ 0.7071', 'la mitad de 1.41421']],
      narr: [[0.8, 9.4, 'Antes de las calculadoras, dividir uno entre uno punto cuatro uno cuatro dos uno, un decimal que no termina, era una cuenta muy pesada.'], [10.0, 19.4, 'El truco es multiplicar por un uno disfrazado: raíz de dos sobre raíz de dos. El valor no cambia.'], [20.0, 29.4, 'Arriba queda raíz de dos, y abajo, raíz de dos por raíz de dos, que es dos. Basta partir uno punto cuatro uno cuatro dos uno por la mitad.']] },
    { id: 'disfrazado', name: 'EL UNO DISFRAZADO', dur: 28, formula: [['6/√3 = 6√3/3 = 2√3', 'r']],
      caps: [[0.8, 9.4, 'Racionalizar', 'quitar la raíz del denominador'], [10.0, 18.4, '6/√3 · √3/√3', '= 6√3 / 3'], [19.0, 27.4, '= 2√3', 'y el resultado se simplifica']],
      narr: [[0.8, 9.4, 'Eso se llama racionalizar: dejar el denominador sin raíces, sin cambiar el valor de la fracción.'], [10.0, 18.4, 'Seis sobre raíz de tres: se multiplica arriba y abajo por raíz de tres. Abajo queda tres.'], [19.0, 27.4, 'Seis raíz de tres sobre tres es dos raíz de tres.']] },
    { id: 'conjugado', name: 'EL CONJUGADO', dur: 30, formula: [['1/(√3 − 1) = (√3 + 1)/2', 'r']],
      caps: [[0.8, 9.4, 'Con un binomio abajo', '1 / (√3 − 1)'], [10.0, 19.4, 'Multiplicar por el conjugado', 'el mismo binomio con el signo cambiado: √3 + 1'], [20.0, 29.4, '(√3 − 1)(√3 + 1) = 3 − 1 = 2', 'la raíz desaparece']],
      narr: [[0.8, 9.4, 'Si abajo hay un binomio, como raíz de tres menos uno, multiplicar por raíz de tres no basta.'], [10.0, 19.4, 'Se usa el conjugado: el mismo binomio con el signo del medio cambiado, raíz de tres más uno.'], [20.0, 29.4, 'Raíz de tres menos uno, por raíz de tres más uno, da tres menos uno: dos. El resultado es raíz de tres más uno, sobre dos.']] },
    { id: 'diferencia', name: 'SUMA POR DIFERENCIA', dur: 28, formula: [['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [')(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], [') = ', 'r'], ['a', 'i'], ['² − ', 'r'], ['b', 'i'], ['²', 'r']],
      caps: [[0.8, 9.4, 'Por qué funciona', '(a + b)(a − b) = a² − b²'], [10.0, 18.4, 'A un cuadrado a² se le quita b²', 'lo que queda se reacomoda en un rectángulo'], [19.0, 27.4, 'Los términos del medio se cancelan', '− ab + ab = 0']],
      narr: [[0.8, 9.4, 'Funciona por un producto notable: suma por diferencia da el cuadrado del primero menos el cuadrado del segundo.'], [10.0, 18.4, 'A un cuadrado de lado a se le quita uno de lado b. El resto se reacomoda en un rectángulo de a más b por a menos b.'], [19.0, 27.4, 'Al multiplicar, los términos del medio se cancelan, y si a o b son raíces cuadradas, sus cuadrados ya no tienen raíz.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['√(', 'r'], ['ab', 'i'], [') = √', 'r'], ['a', 'i'], [' · √', 'r'], ['b', 'i']],
      caps: [[0.8, 10.4, 'La espiral de Teodoro', 'cada raíz, en su forma más simple']],
      narr: [[0.8, 10.4, 'En la espiral de Teodoro aparecen las raíces de todos los enteros, y muchas esconden un cuadrado: raíz de ocho, de doce, de dieciocho.'], [11.0, 20.4, 'Simplificar es sacar esos cuadrados; racionalizar, quitar la raíz de abajo.'], [21.0, 29.4, 'Así, cada número queda en su forma más simple.']] },
  ];
  const WORLD = 'ÁLGEBRA · EXPONENTES Y RADICALES', TITLE = 'SIMPLIFICAR RADICALES', LINE = 'Sacar los cuadrados escondidos y quitar la raíz de abajo.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-22b' };
})();
if (typeof module !== 'undefined') module.exports = D;
