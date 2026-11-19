// Preuniversitario · mundo 11 «Operadores definidos»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
PU_JUEGOS.push(({ setLesson, setExam }) => {
  const STAR = (a, b) => 2 * a - b;
  const TAB4 = [[1, 2, 3, 4], [2, 4, 1, 3], [3, 1, 4, 2], [4, 3, 2, 1]];
  const ABC = [['a', 'c', 'b'], ['a', 'b', 'c'], ['c', 'a', 'b']];
  setLesson('pu-op-1', [
    play('maquina-operador', 'La máquina de dos entradas', { rounds: [
      { sym: '\\star', tex: '2a - b', f: STAR, target: 9, lo: -5, hi: 10, fix: { a: 6 } },
      { sym: '\\triangle', tex: 'a^2 - 3b', f: (a, b) => a * a - 3 * b, target: 4, lo: 0, hi: 10, fix: { b: 4 } },
      { sym: '\\diamond', tex: 'a + 2b', f: (a, b) => a + 2 * b, target: 11, lo: 0, hi: 10 },
    ] }, 'Se reemplaza $a$ por el primer número y $b$ por el segundo: $2 \\cdot 6 - 3 = 9$; $4^2 - 3 \\cdot 4 = 4$; y $a + 2b = 11$ tiene varias parejas, como $(1, 5)$ o $(5, 3)$.',
      { hint: 'Escribe la regla con los números puestos y mira cuánto falta para el resultado.' }),
    play('cruce-tabla', 'La operación por tabla', { rounds: [{ set: [1, 2, 3, 4], tab: TAB4, chain: [3, 4] }, { set: ['a', 'b', 'c'], tab: ABC, chain: ['b', 'a'] }] },
      'Fila del primero, columna del segundo: $3 \\circ 4 = 2$. En la segunda tabla $b \\circ a = a$, pero $a \\circ b = c$: el orden importa.',
      { hint: 'El primer elemento manda la fila; el segundo, la columna.' }),
    play('neutro-buscador', 'El que no cambia nada', { rounds: [
      { sym: '\\circ', tex: 'a + b - 3', f: (a, b) => a + b - 3, lo: -5, hi: 8, as: [1, 2, 4, 6] },
      { sym: '\\odot', tex: 'a + b + a \\cdot b', f: (a, b) => a + b + a * b, lo: -5, hi: 8, as: [1, 2, 3, 5] },
      { sym: '\\#', tex: 'a \\cdot b \\div 2', f: (a, b) => a * b / 2, lo: -5, hi: 8, as: [2, 4, 6, 8] },
    ] }, '$a + 3 - 3 = a$: $e = 3$. $a + 0 + a \\cdot 0 = a$: $e = 0$. $a \\cdot 2 \\div 2 = a$: $e = 2$.',
      { hint: 'Escribe $a \\circ e = a$ con la regla y despeja $e$; tiene que servir para todos los $a$.' }),
    play('adivina-operador', '¿Cuál es la regla?', { rounds: [
      { sym: '\\star', ex: [[3, 1, 8], [2, 5, 1], [4, 4, 8]], rules: [{ tex: 'a + b + 4', f: (a, b) => a + b + 4 }, { tex: '2a + b', f: (a, b) => 2 * a + b }, { tex: '3a - b', f: (a, b) => 3 * a - b }, { tex: 'a \\cdot b + 5', f: (a, b) => a * b + 5 }], ok: 2 },
      { sym: '\\diamond', ex: [[2, 3, 10], [1, 4, 9], [5, 0, 25]], rules: [{ tex: 'a + b + 5', f: (a, b) => a + b + 5 }, { tex: 'a^2 + 2b', f: (a, b) => a * a + 2 * b }, { tex: '2ab - 2', f: (a, b) => 2 * a * b - 2 }, { tex: '2(a + b)', f: (a, b) => 2 * (a + b) }], ok: 1 },
    ] }, 'La regla tiene que dar todos los ejemplos: $3a - b$ da 8, 1 y 8. En la segunda, el primer ejemplo lo cumplen las cuatro reglas; solo $a^2 + 2b$ cumple también los otros dos.',
      { hint: 'Que una regla sirva para un ejemplo no basta: pruébala con todos.' }),
    play('contraejemplo', '¿Importa el orden?', { rounds: [{ claim: 'Con a ★ b = 2a − b, cambiar el orden da lo mismo en cada pareja (a, b)', items: ['(3, 3)', '(5, 5)', '(2, 6)', '(0, 0)'], bad: x => { const [a, b] = x.slice(1, -1).split(', ').map(Number); return 2 * a - b !== 2 * b - a; } }] },
      'Con $(2, 6)$: $2 \\star 6 = -2$ pero $6 \\star 2 = 10$. Con números iguales no se nota; basta una pareja distinta para ver que no es conmutativa.',
      { hint: 'Calcula $a \\star b$ y $b \\star a$ con cada pareja.' }),
    play('capas-operacion', 'Reemplaza y calcula por capas', { rounds: [{ title: 'Después de reemplazar', items: [{ expr: '4 ^ 2 - 3 * 5' }, { expr: '2 * 7 - 3 * 2' }] }] },
      'Con $a \\triangle b = a^2 - 3b$: $4 \\triangle 5 = 4^2 - 3 \\cdot 5 = 16 - 15 = 1$. Con $a \\otimes b = 2a - 3b$: $7 \\otimes 2 = 14 - 6 = 8$. Primero potencias, luego productos, luego restas.',
      { hint: 'Al reemplazar aparecen potencias y productos: resuélvelos antes de restar.' }),
    play('vuela-precios', 'Vuela al resultado del operador', { rounds: [{ title: 'Operadores', items: [
      { ask: 'a ★ b = 2a − b: 4 ★ 1', options: ['7', '2', '9'], answer: 0 },
      { ask: 'a ∘ b = a + b − 3: el neutro', options: ['3', '0', '−3'], answer: 0 },
      { ask: 'a # b = a·b − b: 3 # 2', options: ['4', '5', '6'], answer: 0 },
    ] }] }, '$2 \\cdot 4 - 1 = 7$. El neutro deja $a + e - 3 = a$: $e = 3$. $3 \\cdot 2 - 2 = 4$.',
      { hint: 'Reemplaza con cuidado: el primer número va en $a$.' }),
  ]);

  setLesson('pu-op-2', [
    play('anida-operador', 'De adentro hacia afuera', { rounds: [
      { sym: '\\star', tex: '2a - b', f: STAR, expr: [[4, 3], 2] },
      { sym: '\\#', tex: 'a + 2b', f: (a, b) => a + 2 * b, expr: [2, [1, 3]] },
      { sym: '\\circ', tex: 'a \\cdot b - 1', f: (a, b) => a * b - 1, expr: [[2, 3], [1, 4]] },
    ] }, '$4 \\star 3 = 5$ y $5 \\star 2 = 8$. $1 \\# 3 = 7$ y $2 \\# 7 = 16$. $2 \\circ 3 = 5$, $1 \\circ 4 = 3$ y $5 \\circ 3 = 14$.',
      { hint: 'Solo se puede calcular una caja que ya no tenga cajas adentro.' }),
    play('busca-x-operador', 'La x dentro del operador', { rounds: [
      { sym: '\\oplus', tex: '3a + b', f: (a, b) => 3 * a + b, k: 5, side: 'left', target: 26, lo: -5, hi: 10 },
      { sym: '\\star', tex: '2a - b', f: STAR, k: 3, side: 'right', target: -4, lo: -5, hi: 15 },
      { sym: '\\triangle', tex: 'a^2 - b', f: (a, b) => a * a - b, k: 4, side: 'left', target: 21, lo: 0, hi: 10 },
    ] }, '$3x + 5 = 26$ da $x = 7$. $3 \\star x = 6 - x = -4$ da $x = 10$ (aquí $x$ es el segundo). $x^2 - 4 = 21$ da $x = 5$.',
      { hint: 'Fíjate si la x está en el lugar de $a$ o en el de $b$ antes de reemplazar.' }),
    play('cruce-tabla', 'Cadenas en la tabla', { rounds: [
      { set: [0, 1, 2, 3], tab: [[0, 1, 2, 3], [1, 2, 3, 0], [2, 3, 0, 1], [3, 0, 1, 2]], chain: [2, 3, 3] },
      { set: ['a', 'b', 'c'], tab: ABC, chain: ['c', 'b', 'a'] },
    ] }, 'Primero el paréntesis: $2 \\circ 3 = 1$ y luego $1 \\circ 3 = 0$. En la otra, $c \\circ b = a$ y $a \\circ a = a$.',
      { hint: 'Lo que sale del primer cruce es la fila del segundo.' }),
    play('maquina-operador', 'Encuentra la entrada', { rounds: [{ sym: '\\star', tex: 'a^2 - 2b', f: (a, b) => a * a - 2 * b, target: 3, lo: 0, hi: 8, fix: { a: 3 } }] },
      '$9 - 2b = 3$: $2b = 6$ y $b = 3$.',
      { hint: 'Con $a$ fija, la regla se vuelve una ecuación en $b$.' }),
    play('capas-operacion', 'El anidado, reemplazado', { rounds: [{ title: '(4 ★ 2) ★ 3', items: [{ expr: '2 * ( 2 * 4 - 2 ) - 3' }] }] },
      'Con $a \\star b = 2a - b$, $(4 \\star 2) \\star 3 = 2(2 \\cdot 4 - 2) - 3 = 2 \\cdot 6 - 3 = 9$: el paréntesis es la operación de adentro.',
      { hint: 'Lo de adentro del paréntesis es la primera operación.' }),
    play('arma-negacion', 'Escribe el reemplazo', { rounds: [
      { ask: 'Con a ★ b = 2a − b, escribe la regla', show: '$5 \\star x$', tray: ['$2 \\cdot 5$', '$2x$', '$-$', '$+$', '$x$', '$5$'], need: [0, 2, 4] },
      { ask: 'Con a ⊕ b = 3a + b, escribe la regla', show: '$x \\oplus 7$', tray: ['$3x$', '$3 \\cdot 7$', '$+$', '$-$', '$7$', '$x$'], need: [0, 2, 4], alt: [[4, 2, 0]] },
    ] }, '$5 \\star x = 2 \\cdot 5 - x$: el 5 va en $a$ y la $x$ en $b$. $x \\oplus 7 = 3x + 7$.',
      { hint: 'Copia la regla y cambia $a$ por lo de la izquierda y $b$ por lo de la derecha.' }),
    play('balanza-cajas', 'Despeja lo que queda', { rounds: [{ title: 'Ecuaciones del operador', items: [{ a: 3, b: 2, c: 0, d: 17 }, { a: 4, b: 3, c: 1, d: 12 }] }] },
      'Con $x \\oplus 2 = 17$ y $\\oplus$ como $3a + b$: $3x + 2 = 17$, $x = 5$. Y $4x + 3 = x + 12$ da $3x = 9$, $x = 3$.',
      { hint: 'Quita lo mismo de los dos platillos hasta dejar cajas solas contra baldosas.' }),
  ]);

  setExam('pu-operadores', 'Operadores definidos', [
    ['pu-op-1', 'En un operador, el primer número reemplaza a $a$ y el segundo a $b$.',
      play('maquina-operador', 'Máquina', { rounds: [{ sym: '\\star', tex: '3a - b', f: (a, b) => 3 * a - b, target: 10, lo: 0, hi: 10, fix: { a: 4 } }] }, '$12 - b = 10$: $b = 2$.', { hint: 'Reemplaza.' })],
    ['pu-op-1', 'Por tabla: fila del primero, columna del segundo.',
      play('cruce-tabla', 'Tabla', { rounds: [{ set: [1, 2, 3, 4], tab: TAB4, chain: [4, 2] }] }, '$4 \\circ 2 = 3$.', { hint: 'Fila 4.' })],
    ['pu-op-1', 'El neutro cumple $a \\circ e = a$ para todo $a$.',
      play('neutro-buscador', 'Neutro', { rounds: [{ sym: '\\circ', tex: 'a + b + 5', f: (a, b) => a + b + 5, lo: -8, hi: 5, as: [1, 3, 5, 7] }] }, '$e = -5$.', { hint: 'Despeja.' })],
    ['pu-op-2', 'Los anidados se resuelven de adentro hacia afuera.',
      play('anida-operador', 'Anidado', { rounds: [{ sym: '\\star', tex: 'a + 3b', f: (a, b) => a + 3 * b, expr: [[1, 2], 1] }] }, '$1 \\star 2 = 7$ y $7 \\star 1 = 10$.', { hint: 'Adentro.' })],
    ['pu-op-2', 'Con el operador en una ecuación, se reemplaza y se despeja.',
      play('busca-x-operador', 'Ecuación', { rounds: [{ sym: '\\oplus', tex: '2a + 3b', f: (a, b) => 2 * a + 3 * b, k: 2, side: 'left', target: 14, lo: -5, hi: 10 }] }, '$2x + 6 = 14$: $x = 4$.', { hint: 'Reemplaza.' })],
  ]);
});
