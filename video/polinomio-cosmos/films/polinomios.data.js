// «La caja de cartón» · lección alg-23a (Grado y operaciones). Datos puros (generados desde polinomios.json).
// Historia (docs/storytelling-videos.md): hacia el 820, en Bagdad, al-Juarismi escribe el libro de al-jabr, que da nombre
// al álgebra, con «cuadrados, raíces y números». Aplicación: una lámina de 30 × 20 cm a la que se le cortan cuadrados de
// lado x en las esquinas; la caja tiene volumen V(x) = 4x³ − 100x² + 600x. La sorpresa: el producto suma los grados.
const D = (() => {
  const SCENES = [
    { id: 'bagdad', name: 'BAGDAD, HACIA 820', dur: 28, formula: [['al-jabr', 'it']],
      caps: [[1.0, 9.0, 'Bagdad, hacia el año 820', 'al-Juarismi escribe el libro de al-jabr'], [9.6, 18.0, 'De ese título viene «álgebra»', 'y de su nombre, «algoritmo»'], [18.6, 27.4, 'Cuadrados, raíces y números', 'así llamaba a las partes de sus ecuaciones']],
      narr: [[1.0, 9.0, 'Bagdad, hacia el año ochocientos veinte. En la Casa de la Sabiduría, al-Juarismi escribe un libro sobre cómo resolver problemas con números desconocidos.'], [9.6, 18.0, 'La palabra al-jabr del título se volvió álgebra, y su propio nombre se volvió algoritmo.'], [18.6, 27.4, 'Él hablaba de cuadrados, raíces y números. Hoy escribimos x al cuadrado, x y números: las piezas de un polinomio.']] },
    { id: 'terminos', name: 'LAS PIEZAS', dur: 28, formula: [['2', 'r'], ['x', 'i'], ['² + 3', 'r'], ['x', 'i'], [' + 4', 'r']],
      caps: [[0.8, 9.4, 'Un polinomio', 'una suma de términos con una variable x'], [10.0, 18.4, 'Cada término', 'coeficiente · x elevada a 0, 1, 2, 3…'], [19.0, 27.4, 'El término independiente', 'el que no lleva x: aquí, 4']],
      narr: [[0.8, 9.4, 'Un polinomio es una suma de términos. Por ejemplo, dos x al cuadrado más tres x más cuatro.'], [10.0, 18.4, 'En cada término hay un número, el coeficiente, que multiplica a la variable elevada a un entero no negativo: cero, uno, dos…'], [19.0, 27.4, 'El término que no lleva x se llama término independiente. Aquí es el cuatro.']] },
    { id: 'grado', name: 'EL GRADO', dur: 30, formula: [['gr', 'r'], ['(7', 'r'], ['x', 'i'], ['² − 3', 'r'], ['x', 'i'], ['⁵ + 1) = 5', 'r']],
      caps: [[0.8, 9.4, 'El grado', 'el mayor exponente de la variable'], [10.0, 19.4, 'No importa el orden', 'en 7x² − 3x⁵ + 1, el grado es 5'], [20.0, 29.4, 'Un número solo, distinto de 0', 'tiene grado 0: es 5x⁰']],
      narr: [[0.8, 9.4, 'El grado de un polinomio es el mayor exponente al que aparece la variable.'], [10.0, 19.4, 'No importa en qué orden estén escritos ni qué tan grandes sean los coeficientes: en siete x al cuadrado menos tres x a la quinta más uno, el grado es cinco.'], [20.0, 29.4, 'Un número solo, distinto de cero, tiene grado cero, porque es ese número por x a la cero.']] },
    { id: 'semejantes', name: 'TÉRMINOS SEMEJANTES', dur: 28, formula: [['3', 'r'], ['x', 'i'], ['² + 5', 'r'], ['x', 'i'], ['² = 8', 'r'], ['x', 'i'], ['²', 'r']],
      caps: [[0.8, 9.4, 'Términos semejantes', 'la misma variable con el mismo exponente'], [10.0, 18.4, 'Se suman sus coeficientes', '3x² + 5x² = 8x²'], [19.0, 27.4, 'x² y x no son semejantes', 'x² + x se queda así']],
      narr: [[0.8, 9.4, 'Dos términos son semejantes si tienen la misma variable con el mismo exponente.'], [10.0, 18.4, 'Los semejantes se juntan sumando sus coeficientes: tres x al cuadrado más cinco x al cuadrado es ocho x al cuadrado.'], [19.0, 27.4, 'Pero x al cuadrado y x no son semejantes: como al-Juarismi no sumaba cuadrados con raíces, la suma se deja indicada.']] },
    { id: 'suma', name: 'SUMAR', dur: 30, formula: [['(4', 'r'], ['x', 'i'], ['² − ', 'r'], ['x', 'i'], [' + 3) + (', 'r'], ['x', 'i'], ['² + 5', 'r'], ['x', 'i'], [' − 7)', 'r']],
      caps: [[0.8, 9.4, 'Sumar polinomios', 'se juntan los términos semejantes'], [10.0, 19.4, 'Columna por columna', 'x² con x², x con x, números con números'], [20.0, 29.4, '5x² + 4x − 4', 'el grado no sube al sumar']],
      narr: [[0.8, 9.4, 'Para sumar polinomios se juntan los términos semejantes. Cuatro x al cuadrado menos x más tres, más x al cuadrado más cinco x menos siete.'], [10.0, 19.4, 'Conviene ponerlos en columnas: los x al cuadrado juntos, las x juntas y los números juntos.'], [20.0, 29.4, 'Queda cinco x al cuadrado más cuatro x menos cuatro. Al sumar, el grado nunca sube.']] },
    { id: 'resta', name: 'RESTAR', dur: 28, formula: [['−(', 'r'], ['x', 'i'], ['² + 5', 'r'], ['x', 'i'], [' − 7) = −', 'r'], ['x', 'i'], ['² − 5', 'r'], ['x', 'i'], [' + 7', 'r']],
      caps: [[0.8, 9.4, 'Restar es sumar el opuesto', 'el signo cambia a todo el paréntesis'], [10.0, 18.4, '−(x² + 5x − 7)', '= −x² − 5x + 7'], [19.0, 27.4, '3x² − 6x + 10', 'el error común: cambiar solo el primero']],
      narr: [[0.8, 9.4, 'Restar un polinomio es sumar su opuesto: el signo menos cambia a todos los términos del paréntesis.'], [10.0, 18.4, 'Menos, entre paréntesis, x al cuadrado más cinco x menos siete, es menos x al cuadrado menos cinco x más siete.'], [19.0, 27.4, 'Así, la resta da tres x al cuadrado menos seis x más diez. El error común es cambiar el signo solo al primero.']] },
    { id: 'producto', name: 'MULTIPLICAR', dur: 30, formula: [['(', 'r'], ['x', 'i'], [' + 3)(2', 'r'], ['x', 'i'], [' + 1) = 2', 'r'], ['x', 'i'], ['² + 7', 'r'], ['x', 'i'], [' + 3', 'r']],
      caps: [[0.8, 9.4, 'Cada término por cada término', 'la distributiva, en un rectángulo'], [10.0, 19.4, '(x + 3)(2x + 1)', '2x² + x + 6x + 3 = 2x² + 7x + 3'], [20.0, 29.4, 'Los grados se suman', 'grado 1 por grado 1 da grado 2']],
      narr: [[0.8, 9.4, 'Para multiplicar, cada término de un polinomio multiplica a cada término del otro. Es la distributiva, y se ve como un rectángulo.'], [10.0, 19.4, 'Equis más tres por dos x más uno: dos x al cuadrado, más x, más seis x, más tres. Juntando: dos x al cuadrado más siete x más tres.'], [20.0, 29.4, 'Al multiplicar, los grados se suman: los términos de mayor grado se multiplican y sus exponentes se suman.']] },
    { id: 'caja', name: 'LA CAJA', dur: 30, formula: [['V', 'i'], ['(', 'r'], ['x', 'i'], [') = ', 'r'], ['x', 'i'], ['(30 − 2', 'r'], ['x', 'i'], [')(20 − 2', 'r'], ['x', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Una lámina de cartón de 30 × 20 cm', 'se cortan cuadrados de lado x en las esquinas'], [10.0, 19.4, 'Al doblar sale una caja', 'alto x, largo 30 − 2x, ancho 20 − 2x'], [20.0, 29.4, 'Su volumen es un polinomio', 'V(x) = 4x³ − 100x² + 600x, de grado 3']],
      narr: [[0.8, 9.4, 'Una aplicación: una lámina de cartón de treinta por veinte centímetros. En cada esquina se corta un cuadrado de lado x.'], [10.0, 19.4, 'Al doblar los bordes sale una caja sin tapa: su alto es x, su largo treinta menos dos x y su ancho veinte menos dos x.'], [20.0, 29.4, 'Su volumen es el producto de las tres medidas. Multiplicando sale cuatro x al cubo menos cien x al cuadrado más seiscientos x.']] },
    { id: 'evaluar', name: 'EVALUAR', dur: 28, formula: [['V', 'i'], ['(4) = 4 · 22 · 12 = 1 056', 'r']],
      caps: [[0.8, 9.4, 'Evaluar es reemplazar x', 'por un número; aquí x va de 0 a 10'], [10.0, 18.4, 'Con cortes de 4 cm', 'V(4) = 4 · 22 · 12 = 1 056 cm³'], [19.0, 27.4, 'Con cortes de 8 cm', 'V(8) = 8 · 14 · 4 = 448 cm³: más alta, más pequeña']],
      narr: [[0.8, 9.4, 'Evaluar un polinomio es reemplazar la variable por un número y hacer la cuenta.'], [10.0, 18.4, 'Con cortes de cuatro centímetros: cuatro por veintidós por doce, mil cincuenta y seis centímetros cúbicos.'], [19.0, 27.4, 'Con cortes de ocho, la caja es más alta pero cabe menos: ocho por catorce por cuatro, cuatrocientos cuarenta y ocho.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['gr', 'r'], ['(', 'r'], ['PQ', 'i'], [') = ', 'r'], ['gr', 'r'], ['(', 'r'], ['P', 'i'], [') + ', 'r'], ['gr', 'r'], ['(', 'r'], ['Q', 'i'], [')', 'r']],
      caps: [[0.8, 10.4, 'De al-Juarismi a la caja', 'cuadrados, raíces y números']],
      narr: [[0.8, 10.4, 'Mil doscientos años después de al-Juarismi, seguimos sumando cuadrados con cuadrados y raíces con raíces.'], [11.0, 20.4, 'Sumar junta lo semejante; multiplicar reparte cada término y suma los grados.'], [21.0, 29.4, 'Y con eso, una caja de cartón se vuelve un polinomio.']] },
  ];
  const WORLD = 'ÁLGEBRA · ÁLGEBRA DE POLINOMIOS', TITLE = 'POLINOMIOS', LINE = 'Cuadrados, raíces y números: sumar y multiplicar con letras.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-23a' };
})();
if (typeof module !== 'undefined') module.exports = D;
