// «La curva de Galileo» · lección alg-4a (Polinomio cuadrático y parábola). Datos puros (generados desde parabola.json).
// Historia (docs/storytelling-videos.md): en 1638 Galileo publica que un proyectil describe una parábola. Aplicación:
// un corral rectangular con 40 m de cerca tiene área A(x) = x(20 − x) = −x² + 20x, máxima en x = 10 (100 m²). Analogía:
// mover la plantilla de y = x² sin deformarla. La sorpresa: las antenas parabólicas juntan las señales en un punto.
const D = (() => {
  const SCENES = [
    { id: 'galileo', name: 'LEIDEN, 1638', dur: 28, formula: [['y', 'i'], [' = ', 'r'], ['x', 'i'], ['²', 'r']],
      caps: [[1.0, 9.0, 'Leiden, 1638', 'Galileo publica «Dos nuevas ciencias»'], [9.6, 18.0, 'Un objeto lanzado', 'sin aire: avanza parejo y cae cada vez más rápido'], [18.6, 27.4, 'Su camino es una parábola', 'la curva de los polinomios de grado 2']],
      narr: [[1.0, 9.0, 'Leiden, mil seiscientos treinta y ocho. Galileo Galilei publica su último libro, Dos nuevas ciencias.'], [9.6, 18.0, 'Allí muestra que, si no se cuenta el aire, un objeto lanzado avanza de forma pareja mientras cae cada vez más rápido.'], [18.6, 27.4, 'Juntando las dos cosas, su camino es una parábola: la curva de los polinomios de grado dos.']] },
    { id: 'base', name: 'LA PLANTILLA', dur: 28, formula: [['y', 'i'], [' = ', 'r'], ['x', 'i'], ['²', 'r']],
      caps: [[0.8, 9.4, 'La parábola más sencilla: y = x²', 'x = 0, 1, 2 dan 0, 1, 4'], [10.0, 18.4, 'El vértice', 'el punto donde la curva da la vuelta'], [19.0, 27.4, 'Es simétrica', 'x y −x tienen la misma altura']],
      narr: [[0.8, 9.4, 'La parábola más sencilla es y igual a x al cuadrado. Con x igual a cero, uno y dos, la altura es cero, uno y cuatro.'], [10.0, 18.4, 'El punto donde la curva da la vuelta se llama vértice. Aquí es el origen.'], [19.0, 27.4, 'Y es simétrica: x y menos x dan la misma altura, porque tienen el mismo cuadrado.']] },
    { id: 'mover', name: 'MOVERLA', dur: 30, formula: [['y', 'i'], [' = (', 'r'], ['x', 'i'], [' − 4)² + 1', 'r']],
      caps: [[0.8, 9.4, '(x − 4)² mueve la plantilla', '4 a la derecha: el vértice pasa a x = 4'], [10.0, 19.4, '+ 1 la sube 1', 'el vértice queda en (4, 1)'], [20.0, 29.4, 'Forma canónica: a(x − h)² + k', 'el vértice (h, k) se lee de una vez']],
      narr: [[0.8, 9.4, 'Para mover la plantilla sin deformarla: en x menos cuatro, al cuadrado, la vuelta ocurre cuando x vale cuatro. La curva se corre cuatro a la derecha.'], [10.0, 18.4, 'Sumarle uno la sube una unidad. El vértice queda en el punto cuatro, uno.'], [20.0, 29.4, 'Esa es la forma canónica: a, que se verá enseguida, por x menos h, al cuadrado, más k. El vértice se lee de una vez.']] },
    { id: 'abrir', name: 'LA ABERTURA', dur: 28, formula: [['y', 'i'], [' = ', 'r'], ['a', 'i'], ['x', 'i'], ['²', 'r']],
      caps: [[0.8, 9.4, 'El número a estira o aplana', 'a = 3, más cerrada; a = 1/3, más abierta'], [10.0, 18.4, 'Si a < 0, se voltea', 'abre hacia abajo'], [19.0, 27.4, 'Arriba: el vértice es un mínimo', 'abajo: el vértice es un máximo']],
      narr: [[0.8, 9.4, 'El número a que multiplica estira o aplana la curva: con tres, se cierra; con un tercio, se abre.'], [10.0, 18.4, 'Si a es negativo, la parábola se voltea y abre hacia abajo.'], [19.0, 27.4, 'Si abre hacia arriba, el vértice es el punto más bajo; si abre hacia abajo, el más alto.']] },
    { id: 'corral', name: 'UN CORRAL', dur: 30, formula: [['A', 'i'], ['(', 'r'], ['x', 'i'], [') = ', 'r'], ['x', 'i'], ['(20 − ', 'r'], ['x', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Un corral con 40 m de cerca', 'ancho x, largo 20 − x'], [10.0, 19.4, 'Su área: A(x) = x(20 − x)', '= −x² + 20x, un polinomio de grado 2'], [20.0, 29.4, 'a = −1 < 0', 'abre hacia abajo: tiene un área máxima']],
      narr: [[0.8, 9.4, 'Un ejemplo: con cuarenta metros de cerca se arma un corral rectangular. Si el ancho es x, el largo es veinte menos x.'], [10.0, 19.4, 'Su área es x por veinte menos x: menos x al cuadrado más veinte x. Un polinomio de grado dos.'], [20.0, 29.4, 'Como a es menos uno, negativo, la parábola abre hacia abajo: hay un área máxima, en el vértice.']] },
    { id: 'completar', name: 'COMPLETAR EL CUADRADO', dur: 30, formula: [['−(', 'r'], ['x', 'i'], [' − 10)² + 100', 'r']],
      caps: [[0.8, 9.4, 'Para leer el vértice', 'se pasa a la forma canónica'], [10.0, 19.4, '−(x² − 20x)', '(x − 10)² = x² − 20x + 100: sobran 100'], [20.0, 29.4, 'A(x) = −(x − 10)² + 100', 'vértice (10, 100)']],
      narr: [[0.8, 9.4, 'Para leer el vértice se pasa a la forma canónica, completando el cuadrado.'], [10.0, 19.4, 'Se saca el menos de los términos con x. La mitad de veinte es diez; x menos diez, al cuadrado, trae cien de más, y se restan.'], [20.0, 29.4, 'Queda menos x menos diez, al cuadrado, más cien. El vértice es diez, cien: con diez metros de ancho, el área máxima es cien metros cuadrados.']] },
    { id: 'atajo', name: 'EL ATAJO', dur: 28, formula: [['h', 'i'], [' = −', 'r'], ['b', 'i'], [' / 2', 'r'], ['a', 'i']],
      caps: [[0.8, 9.4, 'Para ax² + bx + c', 'la primera coordenada del vértice es −b/2a'], [10.0, 18.4, 'En el corral: −20 / (2 · (−1)) = 10', 'y A(10) = 10 · 10 = 100'], [19.0, 27.4, 'Es el punto medio', 'entre dos puntos de la misma altura']],
      narr: [[0.8, 9.4, 'Completar el cuadrado en general da un atajo: en a x al cuadrado más b x más c, la x del vértice es menos b sobre dos a.'], [10.0, 18.4, 'En el corral, menos veinte entre menos dos: diez. Y evaluando en diez, el área es cien.'], [19.0, 27.4, 'Tiene sentido por la simetría: el vértice está justo en el medio de dos puntos con la misma altura.']] },
    { id: 'simetria', name: 'SIMETRÍA', dur: 30, formula: [['A', 'i'], ['(4) = ', 'r'], ['A', 'i'], ['(16) = 64', 'r']],
      caps: [[0.8, 9.4, 'A(4) = A(16) = 64', '4 × 16 y 16 × 4: el mismo corral girado'], [10.0, 19.4, 'El vértice está en el medio', '(4 + 16) / 2 = 10'], [20.0, 29.4, 'El mejor corral es un cuadrado', '10 × 10 = 100 m²']],
      narr: [[0.8, 9.4, 'Con cuatro metros de ancho el área es sesenta y cuatro; con dieciséis, también: es el mismo corral, girado.'], [10.0, 19.4, 'Por la simetría, el vértice está justo en el medio de cuatro y dieciséis: en diez.'], [20.0, 29.4, 'Así que el corral de mayor área es un cuadrado de diez por diez. La parábola lo dice sin probar uno por uno.']] },
    { id: 'antena', name: 'LA ANTENA', dur: 28, formula: [['y', 'i'], [' = ', 'r'], ['x', 'i'], ['² / (4', 'r'], ['f', 'i'], [')', 'r']],
      caps: [[0.8, 9.4, 'Una antena parabólica', 'tiene la forma de una parábola girada'], [10.0, 18.4, 'Las señales llegan paralelas', 'y rebotan todas hacia un mismo punto: el foco'], [19.0, 27.4, 'Los faros, al revés', 'la luz sale del foco y se va en un haz']],
      narr: [[0.8, 9.4, 'La parábola también está en las antenas parabólicas: su forma es una parábola que gira sobre su eje.'], [10.0, 18.4, 'Las señales que llegan paralelas rebotan y se juntan en un solo punto, el foco. Allí se pone el receptor.'], [19.0, 27.4, 'Los faros de un carro hacen lo contrario: la luz sale del foco, rebota y sale en un haz paralelo.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], ['(', 'r'], ['x', 'i'], [' − ', 'r'], ['h', 'i'], [')² + ', 'r'], ['k', 'i']],
      caps: [[0.8, 10.4, 'La curva de Galileo', 'una plantilla que se mueve y se voltea']],
      narr: [[0.8, 10.4, 'La curva de Galileo es la de y igual a x al cuadrado, movida, estirada o volteada.'], [11.0, 20.4, 'En la forma canónica se lee todo: hacia dónde abre, cuánto y dónde está el vértice.'], [21.0, 29.4, 'De un corral a una antena, es la misma curva.']] },
  ];
  const WORLD = 'ÁLGEBRA · PARÁBOLAS Y COMPLEJOS', TITLE = 'LA PARÁBOLA', LINE = 'Una plantilla que se mueve, se estira y se voltea.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-4a' };
})();
if (typeof module !== 'undefined') module.exports = D;
