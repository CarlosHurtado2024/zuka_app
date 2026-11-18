// «El epitafio de Diofanto» · lección alg-1 (Ecuaciones lineales). Datos puros (generados desde lineales.json).
// Historia (docs/storytelling-videos.md): el papiro de Rhind (hacia 1650 a. C.) pide «una cantidad y su séptimo suman 19»;
// un acertijo griego cuenta la vida de Diofanto en fracciones (x/6 + x/12 + x/7 + 5 + x/2 + 4 = x → 84). Analogía:
// deshacer en orden contrario, como quitarse la ropa. La sorpresa: hay ecuaciones sin solución y otras con todas.
const D = (() => {
  const SCENES = [
    { id: 'rhind', name: 'EGIPTO, HACIA 1650 A. C.', dur: 28, formula: [['x', 'i'], [' + ', 'r'], ['x', 'i'], ['/7 = 19', 'r']],
      caps: [[1.0, 9.0, 'Egipto, hacia 1650 a. C.', 'el escriba Ahmes copia el papiro de Rhind'], [9.6, 18.0, 'Problema 24', 'una cantidad y su séptimo suman 19'], [18.6, 27.4, 'Una cantidad desconocida', 'hoy la llamamos x']],
      narr: [[1.0, 9.0, 'Egipto, hacia mil seiscientos cincuenta antes de Cristo. El escriba Ahmes copia un papiro lleno de problemas.'], [9.6, 18.0, 'Uno de ellos dice: una cantidad y su séptima parte, juntas, suman diecinueve. Hay que hallar la cantidad.'], [18.6, 27.4, 'Es una ecuación: una igualdad con un número desconocido, que hoy llamamos x.']] },
    { id: 'ecuacion', name: 'UNA ECUACIÓN', dur: 28, formula: [['3', 'r'], ['x', 'i'], [' + 4 = 25', 'r']],
      caps: [[0.8, 9.4, 'Una ecuación es una igualdad', 'con un valor que no se conoce'], [10.0, 18.4, 'Resolverla es hallar la x', 'que hace verdadera la igualdad'], [19.0, 27.4, 'x = 7 cumple 3x + 4 = 25', '3 · 7 + 4 = 25']],
      narr: [[0.8, 9.4, 'Una ecuación es una igualdad que incluye un valor desconocido. Por ejemplo, tres x más cuatro igual a veinticinco.'], [10.0, 18.4, 'Resolverla es encontrar el valor de x que hace verdadera la igualdad.'], [19.0, 27.4, 'Aquí es siete: tres por siete más cuatro da veinticinco. Se dice que siete es la solución.']] },
    { id: 'lados', name: 'A LOS DOS LADOS', dur: 30, formula: [['3', 'r'], ['x', 'i'], [' + 4 − 4 = 25 − 4', 'r']],
      caps: [[0.8, 9.4, 'Lo que se hace a un lado', 'se hace al otro: la igualdad se mantiene'], [10.0, 19.4, 'Restar 4 a los dos lados', '3x = 21'], [20.0, 29.4, 'Dividir los dos lados entre 3', 'x = 7']],
      narr: [[0.8, 9.4, 'La regla para resolver: lo que se hace a un lado, se hace al otro, sin dividir entre cero. Así la igualdad se mantiene.'], [10.0, 19.4, 'Para quitar el cuatro, se resta cuatro a los dos lados: tres x igual a veintiuno.'], [20.0, 29.4, 'Para quitar el tres que multiplica, se dividen los dos lados entre tres: x igual a siete.']] },
    { id: 'orden', name: 'EN ORDEN CONTRARIO', dur: 28, formula: [['× 3, + 4', 'r'], ['  ⟶  ', 'r'], ['− 4, ÷ 3', 'r']],
      caps: [[0.8, 9.4, 'A x se le hizo: × 3 y luego + 4', 'para deshacerlo, al revés'], [10.0, 18.4, 'Como quitarse la ropa', 'lo último que te pusiste sale primero'], [19.0, 27.4, 'Primero − 4, después ÷ 3', 'cada operación con su inversa']],
      narr: [[0.8, 9.4, 'El orden importa. A la x primero se le multiplicó por tres y luego se le sumó cuatro.'], [10.0, 18.4, 'Para deshacerlo se va al revés, como al quitarse la ropa: lo último que te pusiste es lo primero que te quitas.'], [19.0, 27.4, 'Primero se resta cuatro, después se divide entre tres. Cada operación se deshace con su inversa.']] },
    { id: 'ambos', name: 'x A LOS DOS LADOS', dur: 28, formula: [['5', 'r'], ['x', 'i'], [' − 3 = 2', 'r'], ['x', 'i'], [' + 12', 'r']],
      caps: [[0.8, 9.4, 'x a los dos lados', '5x − 3 = 2x + 12'], [10.0, 18.4, 'Restar 2x a los dos lados', '3x − 3 = 12'], [19.0, 27.4, 'Sumar 3 y dividir entre 3', 'x = 5']],
      narr: [[0.8, 9.4, 'Si la x aparece a los dos lados, como en cinco x menos tres igual a dos x más doce, primero se juntan las x.'], [10.0, 18.4, 'Se resta dos x a los dos lados: tres x menos tres igual a doce.'], [19.0, 27.4, 'Después se suma tres y se divide entre tres: x igual a cinco. Se comprueba: veintidós a cada lado.']] },
    { id: 'parentesis', name: 'PARÉNTESIS', dur: 28, formula: [['2(', 'r'], ['x', 'i'], [' + 3) = 18', 'r']],
      caps: [[0.8, 9.4, 'Con paréntesis, primero se reparte', '2(x + 3) = 2x + 6'], [10.0, 18.4, '2x + 6 = 18', '2x = 12, x = 6'], [19.0, 27.4, 'O se divide primero entre 2', 'x + 3 = 9: el mismo x = 6']],
      narr: [[0.8, 9.4, 'Con un paréntesis, se reparte el número de afuera: dos por x más tres es dos x más seis.'], [10.0, 18.4, 'Dos x más seis igual a dieciocho: se resta seis, dos x igual a doce, y x es seis.'], [19.0, 27.4, 'También se puede dividir primero entre dos: x más tres igual a nueve. El resultado es el mismo.']] },
    { id: 'septimo', name: 'EL SÉPTIMO DE AHMES', dur: 30, formula: [['8', 'r'], ['x', 'i'], [' = 133', 'r']],
      caps: [[0.8, 9.4, 'x + x/7 = 19', 'una fracción se quita multiplicando'], [10.0, 19.4, 'Todo por 7', '7x + x = 133, es decir, 8x = 133'], [20.0, 29.4, 'x = 133/8 = 16 5/8', '16 y cinco octavos']],
      narr: [[0.8, 9.4, 'Volvamos al papiro: x más x sobre siete igual a diecinueve. La fracción estorba.'], [10.0, 19.4, 'Se quita multiplicando todo por siete: siete x más x igual a ciento treinta y tres. Es decir, ocho x igual a ciento treinta y tres.'], [20.0, 29.4, 'La cantidad es ciento treinta y tres octavos: dieciséis y cinco octavos. Ahmes llegó a lo mismo, con su propio método.']] },
    { id: 'diofanto', name: 'EL EPITAFIO', dur: 30, formula: [['x', 'i'], ['/6 + ', 'r'], ['x', 'i'], ['/12 + ', 'r'], ['x', 'i'], ['/7 + 5 + ', 'r'], ['x', 'i'], ['/2 + 4 = ', 'r'], ['x', 'i']],
      caps: [[0.8, 9.4, 'Un acertijo griego sobre Diofanto', 'su vida contada en fracciones'], [10.0, 19.4, 'Niñez, juventud, soltería…', 'x/6 + x/12 + x/7 + 5 + x/2 + 4 = x'], [20.0, 29.4, 'Todo por 84', '75x + 756 = 84x, 9x = 756: x = 84']],
      narr: [[0.8, 9.4, 'Un acertijo griego cuenta la vida del matemático Diofanto en fracciones.'], [10.0, 19.4, 'Un sexto fue niño, un doceavo joven, un séptimo más hasta casarse; cinco años después nació su hijo, que vivió la mitad que él, y cuatro años después murió.'], [20.0, 29.4, 'Multiplicando todo por ochenta y cuatro, el mínimo común múltiplo, la ecuación da x igual a ochenta y cuatro años.']] },
    { id: 'casos', name: 'NINGUNA O TODAS', dur: 30, formula: [['0 = 3', 'r'], ['      ', 'r'], ['0 = 0', 'r']],
      caps: [[0.8, 9.4, 'x + 1 = x + 3', 'restando x: 1 = 3, falso'], [10.0, 19.4, 'Ninguna solución', 'ningún número cumple la igualdad'], [20.0, 29.4, '2x + 2 = 2(x + 1)', 'da 0 = 0: todos los números sirven']],
      narr: [[0.8, 9.4, 'Hay casos raros. En x más uno igual a x más tres, al restar x queda uno igual a tres, que es falso.'], [10.0, 19.4, 'Esa ecuación no tiene solución: ningún número, sumado con uno, da lo mismo que sumado con tres.'], [20.0, 29.4, 'Y en dos x más dos igual a dos por x más uno, todo se cancela y queda cero igual a cero: cualquier número es solución.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['x', 'i'], [' = 84', 'r']],
      caps: [[0.8, 10.4, 'Del papiro de Ahmes a Diofanto', 'una sola regla: lo mismo a los dos lados']],
      narr: [[0.8, 10.4, 'Tres mil seiscientos años después del papiro, las ecuaciones se siguen resolviendo con la misma regla: lo que se hace a un lado, se hace al otro.'], [11.0, 20.4, 'Se deshacen las operaciones en orden contrario y se comprueba al final.'], [21.0, 29.4, 'Y así, una vida escrita en fracciones se vuelve un número: ochenta y cuatro.']] },
  ];
  const WORLD = 'ÁLGEBRA · PARÁBOLAS Y COMPLEJOS', TITLE = 'ECUACIONES LINEALES', LINE = 'Lo que se hace a un lado, se hace al otro.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-1' };
})();
if (typeof module !== 'undefined') module.exports = D;
