// «Resistencias en paralelo» · lección alg-25b (Operaciones con fracciones algebraicas). Datos puros (generados desde operaciones.json).
// Historia (docs/storytelling-videos.md): en 1827 Georg Ohm publica su ley; dos resistencias en paralelo cumplen
// 1/R = 1/R₁ + 1/R₂ (4 Ω y 12 Ω dan 3 Ω). Analogía: dos puertas por donde sale la gente. La sorpresa: con dos caminos la
// resistencia baja, aunque se agregue otra resistencia.
const D = (() => {
  const SCENES = [
    { id: 'ohm', name: 'ALEMANIA, 1827', dur: 28, formula: [['V', 'i'], [' = ', 'r'], ['I', 'i'], [' · ', 'r'], ['R', 'i']],
      caps: [[1.0, 9.0, 'Alemania, 1827', 'Georg Ohm publica su ley'], [9.6, 18.0, 'La resistencia frena la corriente', 'se mide en ohmios, Ω'], [18.6, 27.4, 'Dos resistencias en paralelo', 'la corriente tiene dos caminos']],
      narr: [[1.0, 9.0, 'Alemania, mil ochocientos veintisiete. Georg Ohm publica la ley que relaciona voltaje, corriente y resistencia.'], [9.6, 18.0, 'La resistencia mide cuánto se opone un componente al paso de la corriente. Se mide en ohmios.'], [18.6, 27.4, 'Si se conectan dos resistencias en paralelo, la corriente tiene dos caminos. La cuenta para combinarlas es una suma de fracciones.']] },
    { id: 'paralelo', name: 'EN PARALELO', dur: 30, formula: [['1/', 'r'], ['R', 'i'], [' = 1/', 'r'], ['R', 'i'], ['₁ + 1/', 'r'], ['R', 'i'], ['₂', 'r']],
      caps: [[0.8, 9.4, 'Como dos puertas de salida', 'por las dos pasa gente: sale más rápido'], [10.0, 19.4, 'Se suman las facilidades, 1/R', '1/R = 1/R₁ + 1/R₂'], [20.0, 29.4, '4 Ω y 12 Ω', '1/R = 1/4 + 1/12']],
      narr: [[0.8, 9.4, 'Es como un salón con dos puertas: por cada una sale gente, y entre las dos la salida es más rápida.'], [10.0, 19.4, 'Uno sobre R mide qué tan fácil pasa la corriente. En paralelo, esas facilidades se suman: uno sobre R es uno sobre R uno más uno sobre R dos.'], [20.0, 29.4, 'Con resistencias de cuatro y doce ohmios: uno sobre R es un cuarto más un doceavo.']] },
    { id: 'comun', name: 'DENOMINADOR COMÚN', dur: 28, formula: [['1/4 + 1/12 = 3/12 + 1/12 = 4/12', 'r']],
      caps: [[0.8, 9.4, 'Denominador común: 12', '1/4 = 3/12'], [10.0, 18.4, '3/12 + 1/12 = 4/12 = 1/3', 'se suman los numeradores'], [19.0, 27.4, '1/R = 1/3, así que R = 3 Ω', 'menos que cualquiera de las dos']],
      narr: [[0.8, 9.4, 'Para sumar fracciones hace falta un denominador común. Doce sirve: un cuarto es tres doceavos.'], [10.0, 18.4, 'Tres doceavos más un doceavo, cuatro doceavos: un tercio.'], [19.0, 27.4, 'Si uno sobre R es un tercio, R es tres ohmios. La sorpresa: es menos que cada una de las dos resistencias.']] },
    { id: 'letras', name: 'CON LETRAS', dur: 30, formula: [['1/', 'r'], ['x', 'i'], [' + 1/(', 'r'], ['x', 'i'], [' + 2)', 'r']],
      caps: [[0.8, 9.4, 'Una de x ohmios y otra de x + 2', '1/x + 1/(x + 2)'], [10.0, 19.4, 'Denominador común: x(x + 2)', 'cada fracción se completa con lo que le falta'], [20.0, 29.4, '(x + 2 + x) / (x(x + 2))', '= (2x + 2) / (x(x + 2))']],
      narr: [[0.8, 9.4, 'Con letras se hace igual. Una resistencia de x ohmios y otra de x más dos: uno sobre x más uno sobre x más dos.'], [10.0, 19.4, 'El denominador común es x por x más dos. A cada fracción se le multiplica arriba y abajo por el factor que le falta.'], [20.0, 29.4, 'Queda x más dos más x, sobre x por x más dos: dos x más dos, sobre x por x más dos.']] },
    { id: 'voltear', name: 'VOLTEAR', dur: 28, formula: [['R', 'i'], [' = ', 'r'], ['x', 'i'], ['(', 'r'], ['x', 'i'], [' + 2) / (2', 'r'], ['x', 'i'], [' + 2)', 'r']],
      caps: [[0.8, 9.4, '1/R es esa fracción', 'R es su inversa: se voltea'], [10.0, 18.4, 'R = x(x + 2) / (2x + 2)', 'dividir entre una fracción: por su inversa'], [19.0, 27.4, 'Con x = 4', '4 · 6 / 10 = 2.4 Ω']],
      narr: [[0.8, 9.4, 'Pero eso es uno sobre R. Para tener R se voltea la fracción.'], [10.0, 18.4, 'R es x por x más dos, sobre dos x más dos. Dividir entre una fracción es multiplicar por su inversa.'], [19.0, 27.4, 'Con x igual a cuatro: cuatro por seis, sobre diez, dos punto cuatro ohmios.']] },
    { id: 'multiplicar', name: 'MULTIPLICAR', dur: 30, formula: [['(', 'r'], ['a', 'i'], ['/', 'r'], ['b', 'i'], [')(', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i'], [') = ', 'r'], ['ac', 'i'], ['/', 'r'], ['bd', 'i']],
      caps: [[0.8, 9.4, 'Multiplicar: arriba con arriba', 'y abajo con abajo'], [10.0, 19.4, '(x / (x + 3)) · ((x + 3) / x²)', 'antes de multiplicar, cancelar'], [20.0, 29.4, 'Queda 1 / x', 'con x ≠ 0 y x ≠ −3']],
      narr: [[0.8, 9.4, 'Multiplicar es más fácil que sumar: numerador por numerador y denominador por denominador.'], [10.0, 19.4, 'En x sobre x más tres, por x más tres sobre x al cuadrado, conviene cancelar antes: x más tres se va, y una x también.'], [20.0, 29.4, 'Queda uno sobre x, recordando que x no puede ser cero ni menos tres.']] },
    { id: 'dividir', name: 'DIVIDIR', dur: 28, formula: [['(', 'r'], ['a', 'i'], ['/', 'r'], ['b', 'i'], [') ÷ (', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i'], [') = ', 'r'], ['ad', 'i'], ['/', 'r'], ['bc', 'i']],
      caps: [[0.8, 9.4, 'Dividir: multiplicar por la inversa', '(a/b) ÷ (c/d) = (a/b)(d/c)'], [10.0, 18.4, '(2x / 5) ÷ (x / 10)', '= (2x / 5) · (10 / x) = 4'], [19.0, 27.4, 'Con x ≠ 0', 'no se divide entre 0, y al voltear x queda abajo']],
      narr: [[0.8, 9.4, 'Dividir es multiplicar por la inversa: se voltea la segunda fracción.'], [10.0, 18.4, 'Dos x quintos entre x décimos es dos x quintos por diez sobre x: veinte x sobre cinco x, cuatro.'], [19.0, 27.4, 'Con una condición: x no puede ser cero, porque al voltear quedó en el denominador.']] },
    { id: 'compleja', name: 'FRACCIÓN DENTRO DE FRACCIÓN', dur: 30, formula: [['1 / (1/', 'r'], ['R', 'i'], ['₁ + 1/', 'r'], ['R', 'i'], ['₂)', 'r']],
      caps: [[0.8, 9.4, 'R = 1 / (1/R₁ + 1/R₂)', 'una fracción dentro de otra'], [10.0, 19.4, 'Arriba y abajo por R₁R₂', 'R = R₁R₂ / (R₂ + R₁)'], [20.0, 29.4, '4 · 12 / 16 = 3 Ω', 'producto sobre suma']],
      narr: [[0.8, 9.4, 'La fórmula de R tiene una fracción dentro de otra: uno sobre la suma de uno sobre R uno y uno sobre R dos.'], [10.0, 19.4, 'Se simplifica multiplicando arriba y abajo por R uno por R dos: queda el producto sobre la suma.'], [20.0, 29.4, 'Con cuatro y doce: cuarenta y ocho entre dieciséis, tres ohmios, como antes.']] },
    { id: 'mas', name: 'AGREGAR UNA', dur: 30, formula: [['1/4 + 1/12 + 1/6 = 1/2', 'r']],
      caps: [[0.8, 9.4, 'Una tercera resistencia de 6 Ω', '1/R = 1/4 + 1/12 + 1/6'], [10.0, 19.4, '3/12 + 1/12 + 2/12 = 6/12', '1/R = 1/2'], [20.0, 29.4, 'R = 2 Ω', 'más caminos, menos resistencia']],
      narr: [[0.8, 9.4, 'Si se agrega una tercera resistencia de seis ohmios en paralelo, se suma otro inverso: un sexto.'], [10.0, 19.4, 'En doceavos: tres más uno más dos, seis doceavos, un medio.'], [20.0, 29.4, 'La resistencia total baja a dos ohmios. Agregar un camino siempre facilita el paso.']] },
    { id: 'cierre', name: 'CIERRE', dur: 28, formula: [['R', 'i'], [' = ', 'r'], ['R', 'i'], ['₁', 'r'], ['R', 'i'], ['₂ / (', 'r'], ['R', 'i'], ['₁ + ', 'r'], ['R', 'i'], ['₂)', 'r']],
      caps: [[0.8, 10.4, 'Las resistencias de Ohm', 'sumar inversos, voltear y simplificar']],
      narr: [[0.8, 10.4, 'Detrás de cada circuito hay fracciones algebraicas: inversos que se suman y una fracción que se voltea.'], [11.0, 20.4, 'Denominador común para sumar; multiplicar directo; dividir volteando; y siempre cuidar que nada quede dividido entre cero.'], [21.0, 27.4, 'Con dos caminos, la corriente pasa mejor.']] },
  ];
  const WORLD = 'ÁLGEBRA · FRACCIONES ALGEBRAICAS', TITLE = 'OPERACIONES CON FRACCIONES', LINE = 'Denominador común, voltear y simplificar.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-25b' };
})();
if (typeof module !== 'undefined') module.exports = D;
