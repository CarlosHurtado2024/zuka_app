// Preuniversitario · mundo 16 «Probabilidad»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
PU_JUEGOS.push(({ setLesson, setExam }) => {
  const COIN = [['C', 1, 2], ['S', 1, 2]];
  setLesson('pu-pb-1', [
    play('tabla-dados', 'Los 36 resultados de dos dados', { rounds: [
      { say: 'la suma es 8', f: (a, b) => a + b === 8 },
      { say: 'salen dobles', f: (a, b) => a === b },
      { say: 'el producto es par', f: (a, b) => (a * b) % 2 === 0 },
    ] }, 'Suma 8: (2, 6), (3, 5), (4, 4), (5, 3), (6, 2), así que $\\tfrac{5}{36}$. Dobles: 6 de 36, $\\tfrac16$. Producto par: basta un dado par, 27 de 36, $\\tfrac34$.',
      { hint: 'Recorre la tabla fila por fila: cada casilla es un resultado igual de probable.' }),
    play('urna-fraccion', 'Arma la urna', { rounds: [{ color: 'coral', others: [['sky', 4]], target: [1, 3] }, { color: 'mint', others: [['sky', 3], ['sun', 3]], target: [2, 5] }] },
      'Con 2 rojas y 4 azules, $P(\\text{roja}) = \\tfrac26 = \\tfrac13$. Con 4 verdes y 6 de otros colores, $\\tfrac{4}{10} = \\tfrac25$.',
      { hint: 'Cada bola que echas suma a los favorables y también a los posibles.' }),
    play('ruleta-sectores', 'Pinta la ruleta', { rounds: [{ n: 8, target: [3, 8] }, { n: 12, target: [1, 4] }] },
      'Con 8 sectores iguales, $\\tfrac38$ son 3 sectores. Con 12, un cuarto son 3.',
      { hint: 'Convierte la fracción a una con el número de sectores abajo.' }),
    play('arbol-opciones', 'El espacio muestral', { rounds: [{ levels: [{ name: 'resultados de la moneda', n: 2 }, { name: 'resultados del dado', n: 6 }], miss: 1, total: 12 }] },
      'Una moneda y un dado: $2 \\cdot 6 = 12$ resultados posibles, todos igual de probables.',
      { hint: 'Cada resultado de la moneda se combina con cada uno del dado.' }),
    play('rueda-porcentaje', 'La probabilidad como parte del todo', { rounds: [{ part: 9, whole: 36 }, { part: 12, whole: 48 }], tol: 1 },
      '9 de 36 resultados son $\\tfrac14$, el 25 %. 12 de 48 también.',
      { hint: 'Favorables entre posibles.' }),
    play('cubo-pintado', 'Un cubito al azar', { rounds: [{ n: 3 }] },
      'De los 27 cubitos, 8 tienen tres caras pintadas: $P = \\tfrac{8}{27}$; solo 1 no tiene ninguna: $\\tfrac{1}{27}$.',
      { hint: 'Cuenta cuántos hay de cada tipo; la probabilidad es ese conteo entre 27.' }),
    play('vuela-precios', 'Vuela a la probabilidad', { rounds: [{ title: 'Laplace', items: [
      { ask: 'Un dado: P(sale un primo)', options: ['1/2', '1/3', '2/3'], answer: 0 },
      { ask: 'Moneda y dado: resultados posibles', options: ['12', '8', '36'], answer: 0 },
      { ask: '3 rojas y 5 azules: P(roja)', options: ['3/8', '3/5', '5/8'], answer: 0 },
    ] }] }, 'Primos del dado: 2, 3 y 5: $\\tfrac36$. $2 \\cdot 6 = 12$. 3 de 8 bolas.',
      { hint: 'Favorables sobre posibles.' }),
  ]);

  setLesson('pu-pb-2', [
    play('arbol-caminos', 'El árbol de probabilidades', { rounds: [
      { steps: [COIN, COIN, COIN], say: 'sale al menos una cara', f: pa => pa.some(i => i === 0) },
      { steps: [[['R', 2, 5], ['A', 3, 5]], [['R', 2, 5], ['A', 3, 5]]], say: 'las dos son del mismo color', f: pa => pa[0] === pa[1] },
    ] }, 'Al menos una cara son 7 de los 8 caminos: $1 - \\tfrac18 = \\tfrac78$. Mismo color: $\\tfrac{4}{25} + \\tfrac{9}{25} = \\tfrac{13}{25}$.',
      { hint: 'Cada camino multiplica sus ramas; los caminos que sirven se suman.' }),
    play('area-probabilidad', 'Independientes: el área', { rounds: [{ a: [1, 2], b: null, both: [1, 6], grid: 6 }, { a: null, b: [3, 4], both: [3, 8], grid: 8 }] },
      '$\\tfrac12 \\cdot P(B) = \\tfrac16$ da $P(B) = \\tfrac13$. $P(A) \\cdot \\tfrac34 = \\tfrac38$ da $P(A) = \\tfrac12$.',
      { hint: 'El área del rectángulo es ancho por alto.' }),
    play('tabla-dados', 'Al menos un 6', { rounds: [{ say: 'sale al menos un 6', f: (a, b) => a === 6 || b === 6 }, { say: 'NO salen dobles', f: (a, b) => a !== b }] },
      'Al menos un 6: 11 casillas (no 12: el (6, 6) se cuenta una vez). Es $1 - \\tfrac{25}{36}$. No dobles: $1 - \\tfrac16 = \\tfrac56$.',
      { hint: 'Fíjate en la casilla que está en la fila y en la columna a la vez.' }),
    play('complemento-conteo', 'Al menos una cara', { rounds: [{ ask: 'Resultados de 3 monedas con al menos una cara', slots: ['moneda 1', 'moneda 2', 'moneda 3'], all: [2, 2, 2], none: [1, 1, 1], tray: [2, 1, 3, 0] }] },
      'Todos: $2^3 = 8$; ninguna cara: 1 (SSS). Al menos una: $8 - 1 = 7$, la probabilidad $\\tfrac78$.',
      { hint: 'Cuenta los que NO sirven y réstalos.' }),
    play('solapa-barras', 'Cuando se puede sumar y cuando no', { rounds: [{ labels: ['ven fútbol', 'ven tenis'], total: 40, a: 24, b: 18, none: 6 }] },
      'No se puede sumar 24 + 18: los que ven los dos quedan contados dos veces. La unión es 34, así que 8 ven los dos.',
      { hint: 'Si los dos sucesos pueden pasar a la vez, hay que restar la parte común.' }),
    play('ruleta-sectores', 'El complemento en la ruleta', { rounds: [{ n: 10, target: [3, 10], not: true }] },
      'Para que NO caer tenga $\\tfrac{3}{10}$, caer debe tener $\\tfrac{7}{10}$: 7 sectores pintados.',
      { hint: '$P(\\text{no}) = 1 - P$.' }),
    play('rompe-cambios', 'Manda la pelota a la probabilidad', { miss: 'complemento: 1 − P', rounds: [{ title: 'Probabilidades', items: [
      { ask: 'P(lluvia) = 0.3: P(no lluvia)', options: ['0.7', '0.3', '1.3'], answer: 0 },
      { ask: 'Dos caras seguidas', options: ['1/4', '1/2', '1'], answer: 0 },
      { ask: 'Al menos un 6 en dos dados', options: ['11/36', '12/36', '1/6'], answer: 0 },
    ] }] }, '$1 - 0.3 = 0.7$. $\\tfrac12 \\cdot \\tfrac12 = \\tfrac14$. $1 - \\tfrac{25}{36} = \\tfrac{11}{36}$.',
      { hint: 'Complemento y producto.' }),
  ]);

  setExam('pu-probabilidad', 'Probabilidad', [
    ['pu-pb-1', 'Con resultados igual de probables, P = favorables / posibles.',
      play('tabla-dados', 'Dados', { rounds: [{ say: 'la suma es 10', f: (a, b) => a + b === 10 }] }, '(4, 6), (5, 5), (6, 4): $\\tfrac{3}{36} = \\tfrac{1}{12}$.', { hint: 'Cuenta.' })],
    ['pu-pb-1', 'Cada bola cuenta en los posibles.',
      play('urna-fraccion', 'Urna', { rounds: [{ color: 'sun', others: [['coral', 6]], target: [1, 4] }] }, '2 amarillas y 6 rojas: $\\tfrac28$.', { hint: 'Posibles.' })],
    ['pu-pb-2', 'Para independientes se multiplica a lo largo del camino.',
      play('arbol-caminos', 'Árbol', { rounds: [{ steps: [COIN, COIN], say: 'salen dos sellos', f: pa => pa[0] === 1 && pa[1] === 1 }] }, '$\\tfrac12 \\cdot \\tfrac12 = \\tfrac14$.', { hint: 'Producto.' })],
    ['pu-pb-2', 'P(A y B) = P(A) · P(B) si son independientes.',
      play('area-probabilidad', 'Área', { rounds: [{ a: [2, 3], b: null, both: [1, 3], grid: 6 }] }, '$\\tfrac23 \\cdot P(B) = \\tfrac13$: $P(B) = \\tfrac12$.', { hint: 'Área.' })],
  ]);
});
