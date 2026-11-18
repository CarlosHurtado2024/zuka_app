// «El contador de arena» · lección alg-21a (Potencias y exponentes). Datos puros (generados desde potencias.json).
// Historia (docs/storytelling-videos.md): en el siglo III a. C. Arquímedes calcula cuántos granos de arena llenarían el
// universo, unos 10⁶³, e inventa cómo nombrar números enormes. Analogías: la bacteria que se divide (2ⁿ), la media vuelta
// de los negativos, la escalera de potencias de 10 y los prefijos micro y nano. La sorpresa: 10⁰ = 1 y 2⁻³ es positivo.
const D = (() => {
  const SCENES = [
    { id: 'arquimedes', name: 'SIRACUSA, SIGLO III A. C.', dur: 28, formula: [['10', 'r'], ['⁶³', 'r']],
      caps: [[1.0, 9.0, 'Siracusa, siglo III a. C.', 'Arquímedes quiere contar los granos de arena'], [9.6, 18.0, 'Llenar el universo de arena', 'el universo que se imaginaba entonces'], [18.6, 27.4, 'Su respuesta: unos 10⁶³ granos', 'un 1 seguido de 63 ceros']],
      narr: [[1.0, 9.0, 'Siracusa, siglo tercero antes de Cristo. Arquímedes se propone algo que parece imposible: contar granos de arena.'], [9.6, 18.0, 'No solo los de una playa: los que harían falta para llenar todo el universo, tal como lo imaginaban los griegos.'], [18.6, 27.4, 'Su cuenta da unos diez a la sesenta y tres granos: un uno seguido de sesenta y tres ceros. Para escribirlo inventó una forma de nombrar números enormes.']] },
    { id: 'potencia', name: 'MULTIPLICAR REPETIDO', dur: 28, formula: [['10 · 10 · 10 = 10³', 'r']],
      caps: [[0.8, 9.4, 'Una potencia', 'es una multiplicación repetida'], [10.0, 18.4, 'Base y exponente', 'la base se repite; el exponente cuenta las veces'], [19.0, 27.4, '10³ = 10 · 10 · 10 = 1 000', 'se lee «diez al cubo»']],
      narr: [[0.8, 9.4, 'La idea de Arquímedes es la de las potencias: una potencia es una multiplicación repetida.'], [10.0, 18.4, 'El número que se repite es la base. El exponente, el número pequeño de arriba, cuenta cuántas veces se repite.'], [19.0, 27.4, 'Diez al cubo es diez por diez por diez: mil. Cada exponente más agrega un cero.']] },
    { id: 'bacterias', name: 'DUPLICARSE', dur: 30, formula: [['2', 'r'], ['ⁿ', 'r']],
      caps: [[0.8, 9.4, 'Una bacteria E. coli', 'en el laboratorio se divide cada 20 minutos'], [10.0, 19.4, 'Cada división multiplica por 2', 'tras n divisiones hay 2ⁿ bacterias'], [20.0, 29.4, 'En 4 horas, 12 divisiones', '2¹² = 4 096 bacterias']],
      narr: [[0.8, 9.4, 'Una bacteria E. coli, en condiciones ideales de laboratorio, se divide en dos más o menos cada veinte minutos.'], [10.0, 19.4, 'Cada división multiplica la cantidad por dos. Después de n divisiones hay dos a la n bacterias.'], [20.0, 29.4, 'En cuatro horas caben doce divisiones: dos a la doce, cuatro mil noventa y seis bacterias a partir de una.']] },
    { id: 'trampa', name: 'NO ES MULTIPLICAR', dur: 28, formula: [['2¹⁰', 'r'], [' ≠ ', 'r'], ['2 · 10', 'r']],
      caps: [[0.8, 9.4, '2¹⁰ no es 2 · 10', 'el exponente no multiplica a la base'], [10.0, 18.4, '2 · 10 = 20', 'sumar el 2 diez veces'], [19.0, 27.4, '2¹⁰ = 1 024', 'multiplicar el 2 diez veces']],
      narr: [[0.8, 9.4, 'Una confusión frecuente: dos a la diez no es dos por diez.'], [10.0, 18.4, 'Dos por diez es sumar el dos diez veces: veinte.'], [19.0, 27.4, 'Dos a la diez es multiplicar el dos diez veces: mil veinticuatro. La diferencia crece muy rápido.']] },
    { id: 'signo', name: 'EL SIGNO', dur: 30, formula: [['(−2)⁴ = 16', 'r'], ['      ', 'r'], ['−2⁴ = −16', 'r']],
      caps: [[0.8, 9.4, 'Por −2: media vuelta y el doble', 'sobre la recta, el número salta al otro lado'], [10.0, 19.4, 'Base negativa', 'exponente par: positivo; impar: negativo'], [20.0, 29.4, 'El paréntesis importa', '(−2)⁴ = 16, pero −2⁴ = −(2⁴) = −16']],
      narr: [[0.8, 9.4, 'Con bases negativas sirve una imagen: multiplicar por menos dos es estirar al doble y dar media vuelta sobre la recta.'], [10.0, 19.4, 'Dos medias vueltas te devuelven al lado positivo. Por eso un exponente par da positivo, y uno impar, negativo.'], [20.0, 29.4, 'Y el paréntesis importa: menos dos, entre paréntesis, a la cuarta es dieciséis. Sin paréntesis, el exponente solo toca al dos: menos dieciséis.']] },
    { id: 'escalera', name: 'LA ESCALERA', dur: 28, formula: [['10³ → 10² → 10¹ → 10⁰', 'r']],
      caps: [[0.8, 9.4, 'Una escalera de potencias de 10', '1 000, 100, 10'], [10.0, 18.4, 'Bajar un escalón es dividir entre 10', 'el exponente baja de uno en uno'], [19.0, 27.4, 'Un escalón más', '10 ÷ 10 = 1, así que 10⁰ = 1']],
      narr: [[0.8, 9.4, 'Las potencias de diez forman una escalera: mil, cien, diez.'], [10.0, 18.4, 'Cada escalón que bajas divide entre diez, y el exponente baja de uno en uno.'], [19.0, 27.4, 'Un escalón más abajo del diez está diez entre diez: uno. Por eso diez a la cero es uno, y no cero.']] },
    { id: 'cero', name: 'EXPONENTE CERO', dur: 28, formula: [['a', 'i'], ['⁰ = 1', 'r'], ['   (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']],
      caps: [[0.8, 9.4, 'Con cualquier base pasa igual', '2⁰ = 1, 7⁰ = 1, (−3)⁰ = 1'], [10.0, 18.4, 'a⁰ = 1, si a ≠ 0', 'cero veces la base: queda el 1 de partida'], [19.0, 27.4, 'Como la bacteria al empezar', 'antes de dividirse hay 2⁰ = 1']],
      narr: [[0.8, 9.4, 'Con cualquier base pasa lo mismo: bajar del exponente uno al cero es dividir la base entre sí misma.'], [10.0, 18.4, 'Así, a elevado a cero es uno para toda base distinta de cero. Multiplicar cero veces deja el uno de partida.'], [19.0, 27.4, 'Como la bacteria al empezar: antes de la primera división hay dos a la cero, una bacteria.']] },
    { id: 'negativo', name: 'EXPONENTE NEGATIVO', dur: 30, formula: [['a', 'i'], ['⁻ⁿ = 1 / ', 'r'], ['a', 'i'], ['ⁿ', 'r'], ['   (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']],
      caps: [[0.8, 9.4, 'Bajo el cero, se sigue dividiendo', '10⁻¹ = 0.1, 10⁻² = 0.01'], [10.0, 19.4, 'El exponente negativo', 'manda la potencia al denominador'], [20.0, 29.4, 'No vuelve negativo el número', '2⁻³ = 1/8, un número positivo']],
      narr: [[0.8, 9.4, 'La escalera sigue bajo el cero. Diez a la menos uno es un décimo; diez a la menos dos, un centésimo.'], [10.0, 19.4, 'En general, a elevado a menos n es uno sobre a elevado a n: el exponente negativo manda la potencia al denominador.'], [20.0, 29.4, 'Ojo: no vuelve negativo el número. Dos a la menos tres es un octavo, un número positivo y pequeño.']] },
    { id: 'micro', name: 'LO MUY PEQUEÑO', dur: 30, formula: [['2 · 10⁻⁶ m', 'r']],
      caps: [[0.8, 9.4, 'Los prefijos son potencias de 10', 'mili = 10⁻³, micro = 10⁻⁶, nano = 10⁻⁹'], [10.0, 19.4, 'Una E. coli mide unos 2 µm', '2 · 10⁻⁶ m'], [20.0, 29.4, 'Un virus de la gripe, unos 100 nm', '10⁻⁷ m: veinte veces más corto']],
      narr: [[0.8, 9.4, 'Los exponentes negativos tienen nombre en las unidades: mili es diez a la menos tres, micro, diez a la menos seis, nano, diez a la menos nueve.'], [10.0, 19.4, 'Una bacteria E. coli mide unos dos micrómetros: dos por diez a la menos seis metros.'], [20.0, 29.4, 'Un virus de la gripe mide unos cien nanómetros, diez a la menos siete metros: veinte veces más corto que la bacteria.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], ['⁻ⁿ = 1 / ', 'r'], ['a', 'i'], ['ⁿ', 'r'], ['   (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']],
      caps: [[0.8, 10.4, 'Del contador de arena', 'a la bacteria: lo enorme y lo diminuto']],
      narr: [[0.8, 10.4, 'Arquímedes necesitó un tratado entero para nombrar su número. Hoy basta con escribir diez a la sesenta y tres.'], [11.0, 20.4, 'Los exponentes positivos cuentan multiplicaciones; los negativos, divisiones.'], [21.0, 29.4, 'Y entre unos y otros, el exponente cero deja el uno.']] },
  ];
  const WORLD = 'ÁLGEBRA · EXPONENTES Y RADICALES', TITLE = 'POTENCIAS', LINE = 'Multiplicar muchas veces, escrito en poco espacio.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-21a' };
})();
if (typeof module !== 'undefined') module.exports = D;
