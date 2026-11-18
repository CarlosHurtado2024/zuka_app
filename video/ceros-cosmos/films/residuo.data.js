// «El atajo de Horner» · lección alg-92 (Residuo, factor y división sintética). Datos puros (generados desde residuo.json).
// Historia (docs/storytelling-videos.md): Ruffini (1804) y Horner (1819) publican la división sintética, que Qin Jiushao ya
// usaba en 1247; hoy los computadores evalúan polinomios así. Analogía: el residuo es el valor del polinomio. La sorpresa:
// para saber si x − 2 es factor no hace falta dividir: basta calcular P(2).
const D = (() => {
  const SCENES = [
    { id: 'horner', name: 'INGLATERRA, 1819', dur: 28, formula: [['P', 'i'], ['(', 'r'], ['c', 'i'], [')', 'r']],
      caps: [[1.0, 9.0, 'Inglaterra, 1819', 'William Horner publica un método'], [9.6, 18.0, 'Ruffini en 1804; Qin Jiushao en 1247', 'la misma idea, varias veces'], [18.6, 27.4, 'Hoy lo usan los computadores', 'para evaluar polinomios rápido']],
      narr: [[1.0, 9.0, 'Inglaterra, mil ochocientos diecinueve. William Horner publica un método para resolver ecuaciones con muy pocas cuentas.'], [9.6, 18.0, 'Paolo Ruffini lo había publicado en mil ochocientos cuatro, y en China, Qin Jiushao lo usaba en mil doscientos cuarenta y siete.'], [18.6, 27.4, 'Hoy los computadores lo usan para evaluar polinomios con pocas multiplicaciones. Detrás hay un secreto sobre el residuo.']] },
    { id: 'secreto', name: 'EL SECRETO DEL RESIDUO', dur: 30, formula: [['P', 'i'], ['(', 'r'], ['x', 'i'], [') = (', 'r'], ['x', 'i'], [' − ', 'r'], ['c', 'i'], [')', 'r'], ['Q', 'i'], ['(', 'r'], ['x', 'i'], [') + ', 'r'], ['R', 'i']],
      caps: [[0.8, 9.4, 'Al dividir entre x − c', 'P(x) = (x − c) Q(x) + R'], [10.0, 19.4, 'Se reemplaza x por c', 'el primer pedazo se vuelve cero'], [20.0, 29.4, 'P(c) = R', 'teorema del residuo']],
      narr: [[0.8, 9.4, 'Al dividir un polinomio P entre x menos c, queda P igual a x menos c por el cociente, más el residuo, que es un número.'], [10.0, 19.4, 'Ahora se reemplaza x por c. El factor x menos c se vuelve cero, y todo el primer pedazo desaparece.'], [20.0, 29.4, 'Queda P de c igual al residuo. Es el teorema del residuo: el residuo es el valor del polinomio en c.']] },
    { id: 'ejemplo', name: 'SIN DIVIDIR', dur: 28, formula: [['P', 'i'], ['(1) = 1 − 4 + 1 + 6 = 4', 'r']],
      caps: [[0.8, 9.4, 'P(x) = x³ − 4x² + x + 6', 'residuo al dividir entre x − 1'], [10.0, 18.4, 'P(1) = 1 − 4 + 1 + 6 = 4', 'el residuo es 4, sin dividir'], [19.0, 27.4, 'Residuo distinto de 0', 'x − 1 no es factor']],
      narr: [[0.8, 9.4, 'Por ejemplo, P de x igual a x al cubo menos cuatro x al cuadrado más x más seis. Se quiere el residuo de dividir entre x menos uno.'], [10.0, 18.4, 'Basta calcular P de uno: uno menos cuatro más uno más seis, cuatro. El residuo es cuatro, sin hacer la división.'], [19.0, 27.4, 'Como no es cero, x menos uno no es un factor de P.']] },
    { id: 'teorema', name: 'TEOREMA DEL FACTOR', dur: 30, formula: [['P', 'i'], ['(', 'r'], ['c', 'i'], [') = 0  ⟺  (', 'r'], ['x', 'i'], [' − ', 'r'], ['c', 'i'], [') es factor', 'r']],
      caps: [[0.8, 9.4, 'P(2) = 8 − 16 + 2 + 6 = 0', 'residuo 0'], [10.0, 19.4, 'Teorema del factor', 'P(c) = 0 si y solo si x − c es un factor'], [20.0, 29.4, 'Un cero da un factor', 'y un factor da un cero']],
      narr: [[0.8, 9.4, 'En cambio, P de dos es ocho menos dieciséis más dos más seis: cero. El residuo es cero.'], [10.0, 19.4, 'De ahí sale el teorema del factor: P de c es cero si y solo si x menos c es un factor de P.'], [20.0, 29.4, 'Encontrar un número donde el polinomio vale cero es lo mismo que encontrar un factor.']] },
    { id: 'sintetica', name: 'DIVISIÓN SINTÉTICA', dur: 30, formula: [['1   −4   1   6', 'r']],
      caps: [[0.8, 9.4, 'Solo los coeficientes', '1, −4, 1, 6 y el 2 a un lado'], [10.0, 19.4, 'Baja el 1; por 2 y se suma', '1 · 2 = 2 → −4 + 2 = −2'], [20.0, 29.4, '−2 · 2 = −4 → −3; −3 · 2 = −6 → 0', 'el último número es el residuo']],
      narr: [[0.8, 9.4, 'La división sintética divide entre x menos dos sin escribir las x: se ponen los coeficientes en fila, uno, menos cuatro, uno, seis, y el dos a un lado.'], [10.0, 19.4, 'Se baja el uno. Se multiplica por dos y se suma con el siguiente: menos cuatro más dos, menos dos.'], [20.0, 29.4, 'Menos dos por dos, menos cuatro, más uno: menos tres. Menos tres por dos, menos seis, más seis: cero. El último es el residuo.']] },
    { id: 'cociente', name: 'EL COCIENTE', dur: 28, formula: [['x', 'i'], ['² − 2', 'r'], ['x', 'i'], [' − 3', 'r']],
      caps: [[0.8, 9.4, 'Los otros números: el cociente', '1, −2, −3 → x² − 2x − 3'], [10.0, 18.4, 'x³ − 4x² + x + 6', '= (x − 2)(x² − 2x − 3)'], [19.0, 27.4, 'Y x² − 2x − 3 = (x − 3)(x + 1)', 'ceros: 2, 3 y −1']],
      narr: [[0.8, 9.4, 'Los demás números de la última fila son el cociente: uno, menos dos, menos tres. Es decir, x al cuadrado menos dos x menos tres.'], [10.0, 18.4, 'Así, P es x menos dos por x al cuadrado menos dos x menos tres.'], [19.0, 27.4, 'Y esa cuadrática se factoriza en x menos tres por x más uno. Los ceros de P son dos, tres y menos uno.']] },
    { id: 'evaluar', name: 'EVALUAR RÁPIDO', dur: 30, formula: [['((1 · 2 − 4) · 2 + 1) · 2 + 6', 'r']],
      caps: [[0.8, 9.4, 'La división sintética evalúa', 'el residuo es P(2)'], [10.0, 19.4, 'Es anidar la cuenta', '((1 · 2 − 4) · 2 + 1) · 2 + 6'], [20.0, 29.4, 'Pocas multiplicaciones', '3 en vez de las 6 de calcular cada potencia']],
      narr: [[0.8, 9.4, 'Por eso la división sintética también sirve para evaluar: su último número es P de dos.'], [10.0, 19.4, 'En el fondo, es calcular la cuenta anidada: uno por dos, menos cuatro; por dos, más uno; por dos, más seis.'], [20.0, 29.4, 'Con un polinomio de grado tres se hacen tres multiplicaciones, en vez de calcular cada potencia por separado. Por eso los computadores la prefieren.']] },
    { id: 'buscar', name: 'BUSCAR CEROS', dur: 30, formula: [['P', 'i'], ['(−1) = −1 − 4 − 1 + 6 = 0', 'r']],
      caps: [[0.8, 9.4, 'Se prueban candidatos', 'P(0) = 6, P(1) = 4, P(2) = 0, P(3) = 0'], [10.0, 19.4, 'P(−2) = −20 y P(0) = 6', 'signos contrarios: un cero entre −2 y 0'], [20.0, 29.4, 'P(−1) = 0', 'el tercer cero']],
      narr: [[0.8, 9.4, 'Para buscar ceros se prueban números: P de cero es seis, de uno es cuatro, de dos es cero y de tres, cero.'], [10.0, 19.4, 'P de menos dos es menos veinte y P de cero es seis: signos contrarios, así que la curva cruza el eje entre menos dos y cero.'], [20.0, 29.4, 'Se prueba el entero que queda en medio: P de menos uno es menos uno menos cuatro menos uno más seis, cero. Es el tercer cero.']] },
    { id: 'curva', name: 'LA CURVA', dur: 28, formula: [['(', 'r'], ['x', 'i'], [' + 1)(', 'r'], ['x', 'i'], [' − 2)(', 'r'], ['x', 'i'], [' − 3)', 'r']],
      caps: [[0.8, 9.4, 'La gráfica de P', 'cruza el eje en −1, 2 y 3'], [10.0, 18.4, 'Cada cero, un factor', '(x + 1)(x − 2)(x − 3)'], [19.0, 27.4, 'P(1) = 4', 'el residuo es la altura de la curva en 1']],
      narr: [[0.8, 9.4, 'La gráfica de P cruza el eje x justo en menos uno, en dos y en tres.'], [10.0, 18.4, 'Cada cruce es un factor: P es x más uno, por x menos dos, por x menos tres.'], [19.0, 27.4, 'Y el residuo de dividir entre x menos uno, cuatro, es la altura de la curva en uno.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['P', 'i'], ['(', 'r'], ['c', 'i'], [') = ', 'r'], ['R', 'i']],
      caps: [[0.8, 10.4, 'El atajo de Horner', 'el residuo es el valor del polinomio']],
      narr: [[0.8, 10.4, 'Horner, Ruffini y Qin Jiushao llegaron al mismo método, con siglos de diferencia.'], [11.0, 20.4, 'El residuo de dividir entre x menos c es P de c; si es cero, x menos c es un factor.'], [21.0, 29.4, 'Un cero de la curva, un factor del polinomio.']] },
  ];
  const WORLD = 'ÁLGEBRA · RAÍCES DE POLINOMIOS', TITLE = 'RESIDUO Y FACTOR', LINE = 'El residuo de dividir entre x − c es P(c).';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-92' };
})();
if (typeof module !== 'undefined') module.exports = D;
