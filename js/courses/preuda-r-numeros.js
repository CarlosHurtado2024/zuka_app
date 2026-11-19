// Preuniversitario · mundo 15 «Teoría de números»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
PU_JUEGOS.push(({ setLesson, setExam }) => {
  const isP = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const X = n => Math.floor(n / 10), Y = n => n % 10;
  const pairs = (x, sep) => x.split(sep).map(Number);

  setLesson('pu-nu-1', [
    play('criba-primos', 'La criba de Eratóstenes', { rounds: [{ N: 40 }] },
      'Basta cribar con 2, 3 y 5: como $7 \\cdot 7 = 49$ pasa de 40, todo compuesto hasta 40 ya cayó con un primo menor. Quedan 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 y 37.',
      { hint: 'Toca el número libre más pequeño: es primo. Sus múltiplos caen.' }),
    play('arbol-factores', 'El árbol de factores', { rounds: [{ n: 84 }, { n: 150 }] },
      '$84 = 2^2 \\cdot 3 \\cdot 7$ y $150 = 2 \\cdot 3 \\cdot 5^2$: sin importar por dónde empieces, las hojas son las mismas.',
      { hint: 'Prueba primero con 2; cuando ya no se pueda, con 3, luego con 5…' }),
    play('tabla-divisores', 'Contar divisores', { rounds: [{ p: [2, 3], e: [2, 2] }, { p: [3, 5], e: [1, 2] }] },
      'Cada divisor elige cuántos de cada primo lleva: $36 = 2^2 \\cdot 3^2$ tiene $3 \\cdot 3 = 9$ divisores y $75 = 3 \\cdot 5^2$ tiene $2 \\cdot 3 = 6$.',
      { hint: 'El exponente 0 también cuenta: con $5^3$ habría cuatro opciones, $5^0$, $5^1$, $5^2$ y $5^3$.' }),
    play('cifra-faltante', 'La cifra que falta', { rounds: [{ tpl: '4_72', by: 9 }, { tpl: '31_6', by: 4 }, { tpl: '7_83', by: 11 }] },
      'Por 9: $4 + x + 7 + 2 = 13 + x$ debe ser múltiplo de 9, $x = 5$. Por 4: el final $\\_6$ debe ser múltiplo de 4 (16, 36, 56…). Por 11: $7 - x + 8 - 3 = 12 - x$, $x = 1$.',
      { hint: 'Usa el criterio que pide el divisor y mira qué cifra lo cumple.' }),
    play('tablero-cifras', 'El primo escondido', { rounds: [{ conds: [{ say: 'es primo', f: isP }, { say: 'sus cifras suman 10', f: n => X(n) + Y(n) === 10 }, { say: 'es mayor que 50', f: n => n > 50 }] }] },
      'Los de cifras que suman 10 son 19, 28, 37, 46, 55, 64, 73, 82 y 91; primos: 19, 37 y 73 (91 = 7 · 13). Mayor que 50: 73.',
      { hint: 'Prueba los que suman 10 y descarta los pares y los múltiplos de 7.' }),
    play('contraejemplo', '¿Por 2 y por 4 es por 8?', { rounds: [{ claim: 'Si un número es divisible por 2 y por 4, es divisible por 8', items: [8, 16, 24, 12, 40], bad: x => x % 4 === 0 && x % 8 !== 0 }] },
      '12 es divisible por 2 y por 4, pero no por 8: 4 ya contiene al 2, no se multiplican.',
      { hint: 'Busca un múltiplo de 4 que no sea múltiplo de 8.' }),
    play('vuela-precios', 'Vuela al divisor', { rounds: [{ title: 'Primos', items: [
      { ask: '¿Cuántos divisores tiene 2⁴?', options: ['5', '4', '8'], answer: 0 },
      { ask: '¿2 346 es divisible por 3?', options: ['sí', 'no', 'no se sabe'], answer: 0 },
      { ask: 'El único primo par', options: ['2', '1', '4'], answer: 0 },
    ] }] }, '$2^4$: exponentes 0 a 4, cinco divisores. $2 + 3 + 4 + 6 = 15$, múltiplo de 3. El 2.',
      { hint: 'Exponente + 1; suma de cifras; el 1 no es primo.' }),
  ]);

  setLesson('pu-nu-2', [
    play('ritmos-mcm', 'Cuándo vuelven a coincidir', { rounds: [{ a: 6, b: 8, max: 30, labels: ['luz roja', 'luz verde'] }, { a: 10, b: 15, max: 40, labels: ['bus A', 'bus B'] }] },
      'Las marcas de 6 y de 8 coinciden en 24 por primera vez: es el MCM. Las de 10 y 15, en 30.',
      { hint: 'Ve marca por marca de la fila más espaciada y mira si la otra fila también tiene.' }),
    play('corta-mcd', 'La baldosa más grande', { rounds: [{ a: 12, b: 18 }, { a: 20, b: 15 }] },
      'La baldosa tiene que caber justo en los dos lados: su lado divide a 12 y a 18. La más grande es 6. En $20 \\times 15$, es 5.',
      { hint: 'Prueba tamaños que dividan a los dos lados y quédate con el mayor.' }),
    play('pares-primos', 'Los primos comunes', { rounds: [{ a: 60, b: 84 }, { a: 45, b: 75 }] },
      '$60 = 2 \\cdot 2 \\cdot 3 \\cdot 5$ y $84 = 2 \\cdot 2 \\cdot 3 \\cdot 7$: comunes $2 \\cdot 2 \\cdot 3 = 12$ (MCD); con todos, $12 \\cdot 5 \\cdot 7 = 420$ (MCM). $45$ y $75$: MCD 15, MCM 225.',
      { hint: 'Cada ficha solo puede tener una pareja.' }),
    play('arbol-factores', 'Factoriza para el MCM', { rounds: [{ n: 96 }] },
      '$96 = 2^5 \\cdot 3$: el 2 se repite cinco veces. Con las dos descomposiciones a la vista se arman el MCM y el MCD.',
      { hint: 'Divide entre 2 mientras se pueda; lo que quede, pruébalo con 3.' }),
    play('tablero-cifras', 'Múltiplo de dos a la vez', { rounds: [{ conds: [{ say: 'es múltiplo de 6', f: n => n % 6 === 0 }, { say: 'es múltiplo de 15', f: n => n % 15 === 0 }, { say: 'es mayor que 70', f: n => n > 70 }] }] },
      'Múltiplo de 6 y de 15 es múltiplo de su MCM, 30: 30, 60, 90. Mayor que 70: 90.',
      { hint: 'Ser múltiplo de los dos es ser múltiplo del MCM.' }),
    play('bolsas-residuo', 'Repartir sin que sobre', { rounds: [{ N: 84, d: 12 }, { N: 60, d: 9 }] },
      '84 en bolsas de 12 son 7 sin sobrar: 12 divide a 84. 60 en bolsas de 9: 6 bolsas y sobran 6.',
      { hint: 'El residuo es 0 justo cuando el divisor divide al número.' }),
    play('rompe-cambios', 'Manda la pelota al MCM o al MCD', { miss: 'MCM: coincidir; MCD: partir igual', rounds: [{ title: 'MCM y MCD', items: [
      { ask: 'MCM de 4 y 6', options: ['12', '24', '2'], answer: 0 },
      { ask: 'MCD de 18 y 24', options: ['6', '3', '72'], answer: 0 },
      { ask: 'Alarmas cada 9 y 12 minutos: coinciden cada', options: ['36', '108', '3'], answer: 0 },
    ] }] }, 'Los múltiplos de 4 y 6 se encuentran en 12. 18 y 24 comparten $2 \\cdot 3$. MCM de 9 y 12: 36.',
      { hint: 'El MCM es múltiplo de los dos; el MCD, divisor de los dos.' }),
  ]);

  setLesson('pu-nu-3', [
    play('ultima-cifra', 'El ciclo de la última cifra', { rounds: [{ a: 2, n: 35 }, { a: 4, n: 20 }] },
      'Las de $2^n$ giran 2, 4, 8, 6: $35$ deja residuo 3, termina en 8. Las de $4^n$ alternan 4 y 6: exponente par, 6.',
      { hint: 'Encuentra el ciclo y usa el residuo del exponente.' }),
    play('bolsas-residuo', 'El residuo', { rounds: [{ N: 100, d: 7 }, { N: 53, d: 4 }] },
      '$100 = 7 \\cdot 14 + 2$ y $53 = 4 \\cdot 13 + 1$.',
      { hint: 'El residuo siempre es menor que el divisor.' }),
    play('ciclo-colores', 'El residuo en un collar', { rounds: [{ cyc: ['sun', 'coral', 'sky', 'mint', 'brand'], N: 88 }] },
      '$88 = 5 \\cdot 17 + 3$: es la tercera del grupo.',
      { hint: 'Divide entre el largo del grupo.' }),
    play('ciclo-reloj', 'El residuo de los días', { rounds: [{ start: 3, n: 250 }] },
      '$250 = 7 \\cdot 35 + 5$: jueves más 5 días es martes.',
      { hint: 'Solo cuentan los días que sobran de semanas completas.' }),
    play('contraejemplo', 'Paridad: busca el que falla', { rounds: [
      { claim: 'La suma de dos impares es impar', items: ['2 + 4', '6 + 1', '3 + 5', '8 + 2'], bad: x => { const [a, b] = pairs(x, ' + '); return a % 2 && b % 2 && (a + b) % 2 === 0; } },
      { claim: 'Si un producto es par, los dos factores son pares', items: ['2 · 4', '6 · 8', '3 · 4', '10 · 2'], bad: x => { const [a, b] = pairs(x, ' · '); return (a * b) % 2 === 0 && (a % 2 || b % 2); } },
    ] }, '$3 + 5 = 8$: impar + impar da par. $3 \\cdot 4 = 12$ es par con un factor impar: basta un factor par.',
      { hint: 'Revisa la paridad de cada ejemplo.' }),
    play('tablero-cifras', 'Dos residuos a la vez', { rounds: [{ conds: [{ say: 'entre 5 deja residuo 3', f: n => n % 5 === 3 }, { say: 'entre 4 deja residuo 1', f: n => n % 4 === 1 }, { say: 'es menor que 30', f: n => n < 30 }] }] },
      'Los que dejan 3 entre 5: 13, 18, 23, 28; de esos, solo 13 deja 1 entre 4.',
      { hint: 'Lista los que cumplen una condición y prueba la otra.' }),
    play('vuela-precios', 'Vuela al residuo', { rounds: [{ title: 'Residuos', items: [
      { ask: 'impar · impar es…', options: ['impar', 'par', 'depende'], answer: 0 },
      { ask: 'Residuo de 17 · 23 entre 5', options: ['1', '2', '3'], answer: 0 },
      { ask: 'Última cifra de 3²⁰', options: ['1', '3', '9'], answer: 0 },
    ] }] }, 'Impar por impar es impar. Residuos 2 y 3: $2 \\cdot 3 = 6$, residuo 1. Las de $3^n$ giran 3, 9, 7, 1: exponente múltiplo de 4, 1.',
      { hint: 'Trabaja con los residuos, no con los números grandes.' }),
  ]);

  setExam('pu-numeros', 'Teoría de números', [
    ['pu-nu-1', 'Todo número se escribe como producto de primos.',
      play('arbol-factores', 'Factores', { rounds: [{ n: 72 }] }, '$72 = 2^3 \\cdot 3^2$.', { hint: 'Divide por 2.' })],
    ['pu-nu-1', 'Por 3 o por 9: la suma de las cifras.',
      play('cifra-faltante', 'Cifra', { rounds: [{ tpl: '5_4', by: 3 }] }, '$9 + x$ múltiplo de 3: 0, 3, 6 o 9.', { hint: 'Suma.' })],
    ['pu-nu-2', 'El MCM es cuándo vuelven a coincidir.',
      play('ritmos-mcm', 'MCM', { rounds: [{ a: 4, b: 10, max: 30 }] }, 'En 20.', { hint: 'Coinciden.' })],
    ['pu-nu-2', 'El MCD es el trozo más grande que reparte sin sobrar.',
      play('corta-mcd', 'MCD', { rounds: [{ a: 24, b: 16 }] }, 'Baldosas de 8.', { hint: 'Divide a los dos.' })],
    ['pu-nu-3', 'La última cifra de las potencias se repite.',
      play('ultima-cifra', 'Última cifra', { rounds: [{ a: 8, n: 17 }] }, 'Ciclo 8, 4, 2, 6; residuo 1: 8.', { hint: 'Ciclo.' })],
    ['pu-nu-3', 'Lo que cae en la posición n depende del residuo.',
      play('ciclo-colores', 'Collar', { rounds: [{ cyc: ['coral', 'sky', 'mint', 'sun'], N: 50 }] }, '$50 = 4 \\cdot 12 + 2$: la segunda.', { hint: 'Residuo.' })],
  ]);
});
