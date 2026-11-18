// «La suma que se derrumba» · lección alg-102 (Sistemas no lineales y fracciones parciales). Datos puros (generados desde parciales.json).
// Historia (docs/storytelling-videos.md): hacia 1702, Leibniz y Johann Bernoulli parten fracciones en piezas simples para
// poder integrarlas. Ejemplo: (x + 7)/((x − 1)(x + 3)) = 2/(x − 1) − 1/(x + 3). La sorpresa: 1/(k(k + 1)) = 1/k − 1/(k + 1)
// hace que la suma 1/2 + 1/6 + 1/12 + … se derrumbe y dé 1.
const D = (() => {
  const SCENES = [
    { id: 'leibniz', name: 'EUROPA, HACIA 1702', dur: 28, formula: [['1/(', 'r'], ['k', 'i'], ['(', 'r'], ['k', 'i'], [' + 1))', 'r']],
      caps: [[1.0, 9.0, 'Europa, hacia 1702', 'Leibniz y Johann Bernoulli'], [9.6, 18.0, 'Partir una fracción en piezas', 'para calcular áreas con cada pieza'], [18.6, 27.4, '1/2 + 1/6 + 1/12 + 1/20 + …', 'una suma que se va a derrumbar']],
      narr: [[1.0, 9.0, 'Europa, hacia mil setecientos dos. Gottfried Leibniz y Johann Bernoulli necesitan trabajar con fracciones de polinomios complicadas.'], [9.6, 18.0, 'Su idea: partir cada fracción en piezas más simples, y trabajar con cada pieza por separado.'], [18.6, 27.4, 'Con esa idea, una suma como un medio más un sexto más un doceavo más un veinteavo, y así, se va a derrumbar.']] },
    { id: 'nolineal', name: 'UNA CURVA Y UNA RECTA', dur: 30, formula: [['x', 'i'], ['² = ', 'r'], ['x', 'i'], [' + 2', 'r']],
      caps: [[0.8, 9.4, 'Antes: un sistema no lineal', 'la parábola y = x², la recta y = x + 2'], [10.0, 19.4, 'Donde se cortan, las y son iguales', 'x² = x + 2, es decir, x² − x − 2 = 0'], [20.0, 29.4, 'x = 2 o x = −1', 'puntos (2, 4) y (−1, 1)']],
      narr: [[0.8, 9.4, 'Antes, otro sistema: uno donde una ecuación no es una recta. La parábola y igual a x al cuadrado y la recta y igual a x más dos.'], [10.0, 19.4, 'Donde se cortan, las dos y son iguales: x al cuadrado igual a x más dos. Una cuadrática.'], [20.0, 29.4, 'Sus soluciones son dos y menos uno. Los puntos de corte son dos, cuatro y menos uno, uno.']] },
    { id: 'idea', name: 'LA IDEA', dur: 28, formula: [['1/2 − 1/3 = 1/6', 'r']],
      caps: [[0.8, 9.4, 'Combinar fracciones es fácil', '1/2 − 1/3 = 1/6'], [10.0, 18.4, 'Ir al revés: partir 1/6', 'en dos fracciones más simples'], [19.0, 27.4, 'Con polinomios', 'partir una fracción en fracciones parciales']],
      narr: [[0.8, 9.4, 'Sumar fracciones ya se sabe: un medio menos un tercio es un sexto.'], [10.0, 18.4, 'Las fracciones parciales van al revés: dado un sexto, encontrar las fracciones simples que lo forman.'], [19.0, 27.4, 'Con polinomios es lo mismo: una fracción complicada se parte en fracciones con denominadores más simples.']] },
    { id: 'partir', name: 'PARTIR', dur: 30, formula: [['A', 'i'], ['/(', 'r'], ['x', 'i'], [' − 1) + ', 'r'], ['B', 'i'], ['/(', 'r'], ['x', 'i'], [' + 3)', 'r']],
      caps: [[0.8, 9.4, '(x + 7) / ((x − 1)(x + 3))', 'el denominador ya está factorizado'], [10.0, 19.4, 'Cada factor lineal pone una fracción', 'A/(x − 1) + B/(x + 3)'], [20.0, 29.4, 'Se buscan A y B', 'dos números']],
      narr: [[0.8, 9.4, 'Por ejemplo, x más siete sobre x menos uno por x más tres. El denominador ya está factorizado.'], [10.0, 19.4, 'Cada factor lineal pone una fracción con una constante arriba: A sobre x menos uno, más B sobre x más tres.'], [20.0, 29.4, 'Solo falta encontrar los números A y B.']] },
    { id: 'igualar', name: 'IGUALAR NUMERADORES', dur: 30, formula: [['x', 'i'], [' + 7 = ', 'r'], ['A', 'i'], ['(', 'r'], ['x', 'i'], [' + 3) + ', 'r'], ['B', 'i'], ['(', 'r'], ['x', 'i'], [' − 1)', 'r']],
      caps: [[0.8, 9.4, 'Se quitan los denominadores', 'x + 7 = A(x + 3) + B(x − 1)'], [10.0, 19.4, 'Con x = 1: 8 = 4A', 'A = 2'], [20.0, 29.4, 'Con x = −3: 4 = −4B', 'B = −1']],
      narr: [[0.8, 9.4, 'Se multiplica todo por el denominador: x más siete igual a A por x más tres, más B por x menos uno.'], [10.0, 19.4, 'La igualdad vale para todo x, incluso uno: ahí el término de B desaparece. Ocho igual a cuatro A: A es dos.'], [20.0, 29.4, 'Con x igual a menos tres, desaparece el de A: cuatro igual a menos cuatro B. B es menos uno.']] },
    { id: 'comprobar', name: 'COMPROBAR', dur: 28, formula: [['2/(', 'r'], ['x', 'i'], [' − 1) − 1/(', 'r'], ['x', 'i'], [' + 3)', 'r']],
      caps: [[0.8, 9.4, '(x + 7)/((x − 1)(x + 3))', '= 2/(x − 1) − 1/(x + 3)'], [10.0, 18.4, 'Se comprueba sumando', '2(x + 3) − (x − 1) = x + 7'], [19.0, 27.4, 'O con un número', 'x = 2: 9/5 = 2 − 1/5']],
      narr: [[0.8, 9.4, 'La fracción se parte en dos sobre x menos uno, menos uno sobre x más tres.'], [10.0, 18.4, 'Se comprueba sumando: dos por x más tres, menos el paréntesis x menos uno, da x más siete.'], [19.0, 27.4, 'O con un número: con x igual a dos, nueve quintos es dos menos un quinto.']] },
    { id: 'casos', name: 'OTROS FACTORES', dur: 30, formula: [['(', 'r'], ['B', 'i'], ['x', 'i'], [' + ', 'r'], ['C', 'i'], [') / (', 'r'], ['x', 'i'], ['² + 1)', 'r']],
      caps: [[0.8, 9.4, 'Cuadrático sin raíces reales', 'pide Bx + C arriba'], [10.0, 19.4, 'Un factor repetido, (x − 2)²', 'una fracción por cada potencia: A/(x − 2) + B/(x − 2)²'], [20.0, 29.4, 'La fracción debe ser propia', 'grado de arriba menor; si no, se divide antes']],
      narr: [[0.8, 9.4, 'Hay otros casos. Si un factor es cuadrático y no se puede partir, como x al cuadrado más uno, su fracción lleva B x más C arriba.'], [10.0, 19.4, 'Si un factor se repite, como x menos dos al cuadrado, se pone una fracción por cada potencia.'], [20.0, 29.4, 'Y la fracción tiene que ser propia: el grado de arriba menor que el de abajo. Si no, primero se divide.']] },
    { id: 'derrumbe', name: 'LA SUMA QUE SE DERRUMBA', dur: 30, formula: [['1/(', 'r'], ['k', 'i'], ['(', 'r'], ['k', 'i'], [' + 1)) = 1/', 'r'], ['k', 'i'], [' − 1/(', 'r'], ['k', 'i'], [' + 1)', 'r']],
      caps: [[0.8, 9.4, '1/(k(k + 1)) en parciales', '= 1/k − 1/(k + 1)'], [10.0, 19.4, '1/2 = 1 − 1/2, 1/6 = 1/2 − 1/3, …', 'cada pieza se cancela con la siguiente'], [20.0, 29.4, 'Queda 1 − 1/(n + 1)', 'que se acerca a 1']],
      narr: [[0.8, 9.4, 'Ahora la suma del principio. Cada término es uno sobre k por k más uno, y en fracciones parciales es uno sobre k menos uno sobre k más uno.'], [10.0, 19.4, 'Un medio es uno menos un medio; un sexto, un medio menos un tercio; un doceavo, un tercio menos un cuarto. Cada pieza se cancela con la siguiente.'], [20.0, 29.4, 'De toda la suma solo quedan el primero y el último: uno menos uno sobre n más uno. Se acerca a uno.']] },
    { id: 'barras', name: 'EN BARRAS', dur: 28, formula: [['1/2 + 1/6 + 1/12 + … = 1', 'r']],
      caps: [[0.8, 9.4, '1/2 + 1/6 = 2/3', '1/2 + 1/6 + 1/12 = 3/4'], [10.0, 18.4, 'Siempre n/(n + 1)', '4/5, 5/6, 99/100…'], [19.0, 27.4, 'Infinitos términos', 'y la suma vale exactamente 1']],
      narr: [[0.8, 9.4, 'Las sumas parciales son fáciles de ver: dos tercios, tres cuartos, cuatro quintos.'], [10.0, 18.4, 'Después de n términos, la suma es n sobre n más uno: noventa y nueve centésimos con noventa y nueve términos.'], [19.0, 27.4, 'La suma infinita es el límite de esas sumas: exactamente uno.']] },
    { id: 'cierre', name: 'CIERRE', dur: 28, formula: [['1/', 'r'], ['k', 'i'], [' − 1/(', 'r'], ['k', 'i'], [' + 1)', 'r']],
      caps: [[0.8, 10.4, 'La idea de Leibniz', 'partir en piezas para que se cancelen']],
      narr: [[0.8, 10.4, 'Leibniz y Bernoulli partían fracciones para trabajar con piezas simples. La misma idea hace que una suma infinita se derrumbe.'], [11.0, 20.4, 'Factorizar abajo, una fracción por factor, igualar numeradores y comprobar.'], [21.0, 27.4, 'Lo complicado se vuelve una suma de piezas simples.']] },
  ];
  const WORLD = 'ÁLGEBRA · FRACCIONES ALGEBRAICAS', TITLE = 'FRACCIONES PARCIALES', LINE = 'Partir una fracción en piezas simples.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-102' };
})();
if (typeof module !== 'undefined') module.exports = D;
