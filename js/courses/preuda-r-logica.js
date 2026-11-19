// Preuniversitario · mundo 10 «Lógica proposicional»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
PU_JUEGOS.push(({ setLesson, setExam }) => {
  const K = (t, a, b, say, x = {}) => ({ t, a, b, say, ...x });
  const at = (a, i, say) => ({ t: 'at', a, i, say }), notAt = (a, i, say) => ({ t: 'notAt', a, i, say });
  const AND = (p, q) => p && q, OR = (p, q) => p || q, IMP = (p, q) => !p || q, IFF = (p, q) => p === q;

  setLesson('pu-lo-1', [
    play('circuito-logico', 'El circuito lógico', { rounds: [{ op: 'and', want: true }, { op: 'or', want: false }, { op: 'and', neg: [false, true], want: true }] },
      'En serie ($\\wedge$) el bombillo pide los dos cerrados; en paralelo ($\\vee$) se apaga solo si los dos están abiertos. Con $\\neg q$, ese interruptor se cierra cuando $q$ es falsa: $p$ V y $q$ F.',
      { hint: 'Serie es «y»: todo tiene que estar cerrado. Paralelo es «o»: basta uno.' }),
    play('tabla-verdad', 'Llena la tabla de verdad', { rounds: [{ tex: 'p \\vee q', f: OR, n: 2 }, { tex: 'p \\to q', f: IMP, n: 2 }] },
      '$p \\vee q$ solo es falsa en la fila F F. $p \\to q$ solo es falsa en la fila V F: si $p$ es falsa, la promesa no se rompe.',
      { hint: 'Busca primero la única fila donde cambia el resultado.' }),
    play('rompe-promesa', '¿Cuándo es falsa?', { rounds: [
      { say: 'Si gano el partido, te invito a cine', p: 'gano', q: 'te invito', f: IMP, want: false },
      { say: 'Voy en bus o en metro', p: 'voy en bus', q: 'voy en metro', f: OR, want: false },
      { say: 'Estudio y apruebo', p: 'estudio', q: 'apruebo', f: AND, want: true },
    ] }, 'La promesa solo se rompe si gano y no invito. El «o» solo falla si no voy en ninguno. El «y» solo es verdad si pasan las dos.',
      { hint: 'Imagina cada caso como una escena: ¿alguien podría reclamar que mentiste?' }),
    play('pinta-venn', 'Los conectivos en el diagrama (p es A, q es B)', { rounds: [{ text: 'p ∧ q', n: 2, f: (a, b) => a && b }, { text: 'p ∨ ¬q', n: 2, f: (a, b) => a || !b }] },
      '«y» es la parte común de los dos círculos; «o» junta zonas. $p \\vee \\neg q$ es todo A más lo que queda fuera de B.',
      { hint: 'Revisa zona por zona si cumple la fórmula.' }),
    play('adivina-conectivo', '¿Qué conectivo es?', { rounds: [{ out: [true, false, true, true] }, { out: [true, false, false, true] }, { out: [true, true, true, false] }] },
      'V F V V es el condicional: solo falla en V F. V F F V es el bicondicional: verdad cuando coinciden. V V V F es el «o».',
      { hint: 'Mira en qué filas sale F: cada conectivo falla en sus propias filas.' }),
    play('arbol-opciones', 'Las filas de una tabla de verdad', { rounds: [{ levels: [{ name: 'valores de p', n: 2 }, { name: 'valores de q', n: 2 }, { name: 'valores de r', n: 2 }], miss: 2, total: 8 }] },
      'Cada letra tiene 2 valores: con tres letras la tabla tiene $2 \\cdot 2 \\cdot 2 = 8$ filas.',
      { hint: 'Cada letra nueva duplica las filas.' }),
    play('vuela-precios', 'Vuela al valor de verdad', { rounds: [{ title: 'Conectivos', items: [
      { ask: 'p V y q F: p ∧ q es…', options: ['F', 'V', 'no se sabe'], answer: 0 },
      { ask: 'p F y q F: p → q es…', options: ['V', 'F', 'no se sabe'], answer: 0 },
      { ask: 'Filas de la tabla con 3 letras', options: ['8', '6', '3'], answer: 0 },
    ] }] }, 'El «y» pide las dos verdaderas. Un condicional con $p$ falsa es verdadero. $2^3 = 8$.',
      { hint: 'Recuerda en qué único caso falla cada conectivo.' }),
  ]);

  setLesson('pu-lo-2', [
    play('arma-negacion', 'Escribe la negación', { rounds: [
      { ask: 'Escribe la negación con De Morgan', show: '$\\neg(p \\wedge q)$', tray: ['$\\neg p$', '$\\neg q$', '$\\wedge$', '$\\vee$', '$p$', '$q$'], need: [0, 3, 1], alt: [[1, 3, 0]] },
      { ask: 'Escribe la negación con De Morgan', show: '$\\neg(p \\vee \\neg q)$', tray: ['$\\neg p$', '$q$', '$\\wedge$', '$\\vee$', '$p$', '$\\neg q$'], need: [0, 2, 1], alt: [[1, 2, 0]] },
      { ask: 'Escribe la negación de la frase', show: 'Todos los trenes salieron a tiempo', tray: ['algún', 'ningún', 'tren', 'todos', 'no salió', 'salió'], need: [0, 2, 4] },
    ] }, 'Negar un «y» da un «o» de negaciones: $\\neg p \\vee \\neg q$. Negar un «o» da un «y»: $\\neg p \\wedge q$ (la doble negación se cancela). «Todos salieron» se niega con «algún tren no salió».',
      { hint: 'Niega cada parte y cambia el conectivo: «y» por «o», «o» por «y».' }),
    play('contraejemplo', 'Basta un contraejemplo', { rounds: [
      { claim: 'Todos los números de la caja son pares', items: [4, 10, 8, 15, 22, 6], bad: x => x % 2 !== 0 },
      { claim: 'Ningún número de la caja es primo', items: [9, 15, 21, 13, 25, 27], bad: x => [2, 3, 5, 7, 11, 13].includes(x) },
      { claim: 'Todo número que termina en 3 es primo', items: [13, 23, 33, 43, 53], bad: x => x === 33 },
    ] }, 'Para tumbar un «todos» basta uno que no cumpla (15); para tumbar un «ninguno», uno que sí (13). Y $33 = 3 \\cdot 11$ no es primo.',
      { hint: 'No hay que revisarlos todos para tumbar la frase: busca uno solo que falle.' }),
    play('niega-todos', 'Tumba la frase con lo mínimo', { rounds: [
      { kind: 'todas', on: [true, true, true, true, true] },
      { kind: 'alguna', on: [false, true, false, true, false, false] },
      { kind: 'ninguna', on: [false, false, false, false, false] },
    ] }, '«Todas prendidas» cae apagando una sola: su negación es «alguna está apagada». «Alguna prendida» solo cae si se apagan todas: su negación es «ninguna». «Ninguna» cae prendiendo una.',
      { hint: 'Piensa qué frase es la negación y cumple exactamente esa.' }),
    play('circuito-logico', 'El inversor y De Morgan', { rounds: [{ op: 'and', out: true, want: false }, { op: 'or', neg: [true, true], want: false }] },
      '$\\neg(p \\wedge q)$ y $\\neg p \\vee \\neg q$ se apagan en el mismo único caso: $p$ y $q$ verdaderas. Son la misma fórmula.',
      { hint: 'El inversor apaga cuando lo de adentro está prendido.' }),
    play('tabla-verdad', 'Comprueba De Morgan con la tabla', { rounds: [{ tex: '\\neg p \\vee \\neg q', given: { tex: '\\neg(p \\wedge q)', f: (p, q) => !(p && q) }, f: (p, q) => !p || !q, n: 2 }] },
      'Las dos columnas son iguales fila por fila: F V V V. Por eso son equivalentes.',
      { hint: 'Llena tu columna y compárala con la de al lado.' }),
    play('pinta-venn', 'De Morgan en el diagrama', { rounds: [{ text: '(A ∪ B)ᶜ', n: 2, f: (a, b) => !(a || b) }, { text: 'Aᶜ ∪ Bᶜ', n: 2, f: (a, b) => !a || !b }] },
      'Lo que no está en ninguno de los dos es $A^c \\cap B^c$. Y $A^c \\cup B^c$ es todo menos la parte común: $(A \\cap B)^c$.',
      { hint: 'Pinta zona por zona preguntando si cumple.' }),
    play('rompe-cambios', 'Manda la pelota a la negación', { miss: '«todos» se niega con «alguno no»', rounds: [{ title: 'Negaciones', items: [
      { ask: 'Negación de «todos aprobaron»', options: ['alguno no aprobó', 'ninguno aprobó', 'todos reprobaron'], answer: 0 },
      { ask: 'Negación de «ninguno vino»', options: ['alguno vino', 'todos vinieron', 'nadie faltó'], answer: 0 },
      { ask: '¬(p ∨ q) equivale a…', options: ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∧ q'], answer: 0 },
    ] }] }, 'Basta uno que no aprobó; basta uno que vino. Negar un «o» da un «y» de negaciones.',
      { hint: 'La negación tiene que ser verdad exactamente cuando la frase es falsa.' }),
  ]);

  setLesson('pu-lo-3', [
    play('flecha-deduce', '¿Qué se puede concluir?', { rounds: [
      { p: 'es domingo', q: 'la biblioteca cierra', fact: ['p', true] },
      { p: 'la figura es un cuadrado', q: 'tiene cuatro lados', fact: ['q', true] },
      { p: 'el agua hierve', q: 'está muy caliente', fact: ['q', false] },
      { p: 'Ana estudia', q: 'Ana aprueba', fact: ['p', false] },
    ] }, 'Ponens: pasa $p$, entonces pasa $q$. Tener cuatro lados no prueba que sea cuadrado (puede ser un rectángulo). Tollens: si no está caliente, no hierve. Y si Ana no estudia, la regla no dice nada.',
      { hint: 'La flecha solo empuja hacia adelante desde $p$, o hacia atrás desde «no $q$».' }),
    play('arma-negacion', 'Recíproco, contrario y contrarrecíproco', { rounds: [
      { ask: 'Escribe el contrarrecíproco', show: '$p \\to q$', tray: ['$p$', '$q$', '$\\neg p$', '$\\neg q$', '$\\to$'], need: [3, 4, 2] },
      { ask: 'Escribe el recíproco', show: '$p \\to q$', tray: ['$p$', '$q$', '$\\neg p$', '$\\neg q$', '$\\to$'], need: [1, 4, 0] },
      { ask: 'Escribe el contrario', show: '$p \\to q$', tray: ['$p$', '$q$', '$\\neg p$', '$\\neg q$', '$\\to$'], need: [2, 4, 3] },
    ] }, 'Contrarrecíproco $\\neg q \\to \\neg p$ (el único equivalente); recíproco $q \\to p$; contrario $\\neg p \\to \\neg q$.',
      { hint: 'Recíproco: se voltea. Contrario: se niega. Contrarrecíproco: se voltea y se niega.' }),
    play('rompe-promesa', 'Condicional y bicondicional', { rounds: [
      { say: 'Si es mayor de edad, puede votar', p: 'es mayor de edad', q: 'puede votar', f: IMP, want: true },
      { say: 'Se cancela el partido si y solo si llueve', p: 'se cancela', q: 'llueve', f: IFF, want: false },
    ] }, 'El condicional es verdad en tres de los cuatro casos: solo falla «mayor y no puede votar». El bicondicional falla cuando las dos partes no coinciden.',
      { hint: 'El condicional no dice nada de los menores de edad.' }),
    play('tabla-verdad', 'El contrarrecíproco es equivalente', { rounds: [{ tex: '\\neg q \\to \\neg p', given: { tex: 'p \\to q', f: IMP }, f: (p, q) => q || !p, n: 2 }] },
      'Las dos columnas dan V F V V: el contrarrecíproco dice lo mismo que el condicional.',
      { hint: 'Calcula $\\neg q$ y $\\neg p$ en cada fila y aplica el condicional.' }),
    play('circuito-logico', 'El condicional como circuito', { rounds: [{ op: 'or', neg: [true, false], want: false }, { op: 'or', neg: [true, false], want: true, fix: { p: true } }] },
      '$p \\to q$ es lo mismo que $\\neg p \\vee q$: solo se apaga con $p$ V y $q$ F. Si $p$ es V, para prender hace falta $q$ V (modus ponens).',
      { hint: 'Con $\\neg p$, el interruptor de arriba se abre cuando $p$ es verdadera.' }),
    play('tiene-podria', 'Reglas con «solo si»', { rounds: [
      { names: ['A', 'B', 'C', 'D'], k: 2, rules: [K('onlyIf', 'A', 'B', 'A va solo si B va'), K('ifNot', 'C', 'D', 'si C va, D no')], claims: [{ t: 'in', a: 'B', say: 'B va' }, { t: 'in', a: 'A', say: 'A va' }, { t: 'both', a: 'A', b: 'C', say: 'A y C van' }] },
    ] }, 'Las parejas posibles son AB, BC y BD. B está en todas: tiene que ir. A podría ir. A y C juntos no caben.',
      { hint: '«A solo si B» quiere decir: si A va, B tiene que ir.' }),
    play('vuela-precios', 'Vuela a la conclusión', { rounds: [{ title: 'Condicional', items: [
      { ask: 'Si p → q y pasa p…', options: ['pasa q', 'no pasa q', 'no se sabe'], answer: 0 },
      { ask: 'Si p → q y no pasa q…', options: ['no pasó p', 'pasó p', 'no se sabe'], answer: 0 },
      { ask: 'Si p → q y pasa q…', options: ['no se sabe si p', 'pasó p', 'no pasó p'], answer: 0 },
    ] }] }, 'Ponens y tollens concluyen; afirmar el consecuente no.',
      { hint: 'La flecha va de $p$ a $q$, no de vuelta.' }),
  ]);

  setLesson('pu-lo-4', [
    play('arma-silogismo', 'Dibuja las premisas', { rounds: [
      { sets: [{ k: 'A', name: 'perros', r: 0.9 }, { k: 'B', name: 'mamíferos', r: 1.7 }, { k: 'C', name: 'animales', r: 2.6 }], rels: [['A', 'B', 'sub'], ['B', 'C', 'sub']], sol: { A: [5, 3], B: [5, 3], C: [5, 3] } },
      { sets: [{ k: 'A', name: 'peces', r: 1 }, { k: 'B', name: 'aves', r: 1.2 }, { k: 'C', name: 'con plumas', r: 2 }], rels: [['B', 'C', 'sub'], ['A', 'C', 'disj']], sol: { A: [7.5, 3], B: [3, 3], C: [3, 3] } },
      { sets: [{ k: 'A', name: 'estudiantes', r: 1.5 }, { k: 'B', name: 'deportistas', r: 1.5 }, { k: 'C', name: 'nadadores', r: 0.8 }], rels: [['C', 'B', 'sub'], ['A', 'B', 'cross']], sol: { A: [3.5, 3], B: [5.5, 3], C: [6.2, 3] } },
    ] }, 'Los perros quedan dentro de los animales: se concluye. Las aves quedan dentro de «con plumas» y los peces afuera: ningún pez es ave. Con «algunos estudiantes son deportistas», los nadadores pueden quedar fuera de los estudiantes: no se concluye nada sobre ellos.',
      { hint: '«Todos» mete un círculo dentro de otro; «ningún» los separa; «algunos» los cruza.' }),
    play('mueve-circulos', 'Todos, ninguno y algunos', { rounds: [
      { A: '{múltiplos de 2}', B: '{múltiplos de 4}', rB: 0.5, rel: 'sub' },
      { A: '{números pares}', B: '{números impares}', rB: 0.8, rel: 'disjoint' },
      { A: '{múltiplos de 2}', B: '{múltiplos de 3}', rB: 0.8, rel: 'overlap' },
    ] }, 'Todo múltiplo de 4 es par: B dentro de A. Ningún par es impar: separados. Algunos múltiplos de 2 lo son de 3 (el 6) y otros no: cruzados.',
      { hint: 'Busca un elemento que esté en los dos y otro que esté en uno solo.' }),
    play('pinta-venn', 'Pinta lo que dice la frase', { rounds: [{ text: 'los A que no son B', n: 2, f: (a, b) => a && !b }, { text: 'los A que también son C', n: 3, f: (a, b, c) => a && c }] },
      '«Los A que no son B» es la luna de A fuera de B. «Los A que también son C» es la parte común de A y C, esté o no en B.',
      { hint: 'Pinta zona por zona preguntando si cumple las dos condiciones.' }),
    play('reparte-venn', 'Algunos mamíferos viven en el agua', { rounds: [{ U: ['delfín', 'tiburón', 'ballena', 'salmón', 'perro', 'gato'], A: ['delfín', 'tiburón', 'ballena', 'salmón'], B: ['delfín', 'ballena', 'perro', 'gato'] }] },
      'A son los que viven en el agua y B los mamíferos. Delfín y ballena están en los dos: por eso «algunos mamíferos viven en el agua», pero no todos.',
      { hint: 'Pregunta por cada animal: ¿vive en el agua? ¿es mamífero?' }),
    play('contraejemplo', '¿Todos? Busca el que falla', { rounds: [{ claim: 'Todo múltiplo de 3 es impar', items: [9, 15, 21, 12, 27], bad: x => x % 2 === 0 }] },
      'El 12 es múltiplo de 3 y es par: la frase cae.',
      { hint: 'Busca uno que cumpla la primera parte y no la segunda.' }),
    play('descifra-zona', 'Describe la zona', { rounds: [{ title: 'Zonas', items: [{ zones: [1] }, { zones: [3] }] }] },
      'La zona solo de A es $A - B$ («los A que no son B»); la del medio es $A \\cap B$ («los A que son B»).',
      { hint: 'Mira si la zona rayada está dentro o fuera de cada círculo.' }),
    play('lazo-conjunto', 'Encierra a los que cumplen', { rounds: [{ title: 'Todos los que cumplen', items: [{ name: 'P', rule: 'x es múltiplo de 5', members: ['10', '25', '40'], others: ['12', '33', '8', '21'] }] }] },
      'Solo 10, 25 y 40 terminan en 0 o en 5: son los múltiplos de 5.',
      { hint: 'Un múltiplo de 5 termina en 0 o en 5.' }),
  ]);

  setLesson('pu-lo-5', [
    play('quien-miente', '¿Quién miente?', { rounds: [
      { people: [{ name: 'Ana', say: 'Beto miente', f: t => !t[1] }, { name: 'Beto', say: 'Carla miente', f: t => !t[2] }, { name: 'Carla', say: 'Ana y Beto mienten', f: t => !t[0] && !t[1] }] },
      { people: [{ name: 'Rosa', say: 'Exactamente uno de los dos miente', f: t => t.filter(x => !x).length === 1 }, { name: 'Saúl', say: 'Rosa miente', f: t => !t[0] }] },
      { people: [{ name: 'Teo', say: 'Ulises miente', f: t => !t[1] }, { name: 'Ulises', say: 'Vale miente', f: t => !t[2] }, { name: 'Vale', say: 'Teo y Ulises mienten', f: t => !t[0] && !t[1] }] },
    ] }, 'Si Carla dijera la verdad, Ana y Beto mentirían, pero entonces Ana diría la verdad: choca. Carla miente, Beto dice la verdad y Ana miente. Rosa dice la verdad y Saúl miente. Ulises dice la verdad y Teo y Vale mienten.',
      { hint: 'Supón que alguien dice la verdad y sigue la cadena; si algo choca, cambia la suposición.' }),
    play('descarta-casos', 'Tacha los podios imposibles', { rounds: [
      { cands: [['Iván', 'Julia', 'Kevin'], ['Julia', 'Iván', 'Kevin'], ['Kevin', 'Julia', 'Iván'], ['Julia', 'Kevin', 'Iván']], clues: [notAt('Julia', 0, 'Julia no ganó'), K('before', 'Iván', 'Kevin', 'Iván llegó antes que Kevin')] },
    ] }, 'Tres podios ponen a Julia de primera o a Kevin antes que Iván: queda Iván, Julia, Kevin.',
      { hint: 'Revisa cada podio contra las dos pistas.' }),
    play('tabla-cruces', 'Un ✓ por fila y por columna', { rounds: [{ rows: ['Lina', 'Mario', 'Nora'], cols: ['rojo', 'azul', 'verde'], clues: [{ t: 'not', a: 0, v: 0 }, { t: 'not', a: 1, v: 0 }, { t: 'not', a: 1, v: 1 }] }] },
      'Mario solo puede verde; entonces Lina, que no es roja, queda azul, y Nora roja.',
      { hint: 'Empieza por la fila con un solo hueco libre.' }),
    play('casilleros', '¿De quién es cada cosa?', { rounds: [{ people: ['Ola', 'Pau', 'Quim'], names: ['lápiz', 'borrador', 'regla'], clues: [at('regla', 2, 'la regla es de Quim'), notAt('lápiz', 0, 'el lápiz no es de Ola')] }] },
      'La regla es de Quim; el lápiz no es de Ola, así que es de Pau, y a Ola le queda el borrador.',
      { hint: 'Lo seguro primero, luego lo que queda.' }),
    play('dias-semana', 'El horario de exámenes', { rounds: [{ names: ['Química', 'Física', 'Biología', 'Historia'], clues: [at('Física', 0, 'Física es el lunes'), K('before', 'Historia', 'Química', 'Historia va antes que Química'), notAt('Biología', 3, 'Biología no es el jueves'), notAt('Biología', 1, 'Biología no es el martes')] }] },
      'Física el lunes y Biología el miércoles (no martes ni jueves). Quedan martes y jueves: Historia antes que Química.',
      { hint: 'Ubica primero lo que tiene menos lugares posibles.' }),
    play('flecha-deduce', 'Verdad y consecuencia', { rounds: [{ p: 'Raúl dice la verdad', q: 'el tesoro está en la cueva', fact: ['q', false] }] },
      'Raúl dijo que el tesoro está en la cueva. Si no está, Raúl no dijo la verdad: es modus tollens.',
      { hint: 'Si lo que dijo resultó falso, ¿qué pasa con quien lo dijo?' }),
    play('rompe-cambios', 'Manda la pelota a quien miente', { miss: 'supón y busca la contradicción', rounds: [{ title: 'Mentiras', items: [
      { ask: 'A: «B miente». B: «A miente». ¿Cuántos mienten?', options: ['exactamente uno', 'los dos', 'ninguno'], answer: 0 },
      { ask: 'F: «G y yo mentimos». ¿F miente?', options: ['sí', 'no', 'no se sabe'], answer: 0 },
      { ask: 'Si una suposición lleva a una contradicción…', options: ['se descarta', 'se acepta', 'no importa'], answer: 0 },
    ] }] }, 'Si A dice la verdad, B miente, y viceversa: siempre uno. Si F dijera la verdad, mentiría: choca, así que F miente (y G dice la verdad). Lo que choca se descarta.',
      { hint: 'Prueba las dos suposiciones y quédate con la que no choca.' }),
  ]);

  setExam('pu-logica', 'Lógica proposicional', [
    ['pu-lo-1', 'Una tabla de verdad prueba todas las combinaciones.',
      play('tabla-verdad', 'Tabla', { rounds: [{ tex: 'p \\wedge \\neg q', f: (p, q) => p && !q, n: 2 }] }, 'Solo es V en la fila V F.', { hint: 'Fila por fila.' })],
    ['pu-lo-1', 'En serie es «y»; en paralelo es «o».',
      play('circuito-logico', 'Circuito', { rounds: [{ op: 'or', neg: [false, true], want: false }] }, '$p \\vee \\neg q$ se apaga con $p$ F y $q$ V.', { hint: 'Paralelo.' })],
    ['pu-lo-2', 'Negar un «y» da un «o» de negaciones.',
      play('arma-negacion', 'Negación', { rounds: [{ ask: 'Escribe la negación con De Morgan', show: '$\\neg(\\neg p \\wedge q)$', tray: ['$p$', '$\\neg q$', '$\\wedge$', '$\\vee$', '$\\neg p$', '$q$'], need: [0, 3, 1], alt: [[1, 3, 0]] }] }, '$p \\vee \\neg q$.', { hint: 'De Morgan.' })],
    ['pu-lo-2', '«Todos» cae con un solo caso que no cumpla.',
      play('niega-todos', 'Negar', { rounds: [{ kind: 'todas', on: [true, true, true, true] }] }, 'Basta apagar una.', { hint: 'Mínimo.' })],
    ['pu-lo-3', 'Ponens y tollens concluyen; afirmar el consecuente no.',
      play('flecha-deduce', 'Concluir', { rounds: [{ p: 'llueve', q: 'el andén se moja', fact: ['q', true] }] }, 'No se sabe: pudo mojarse por otra razón.', { hint: 'Flecha.' })],
    ['pu-lo-3', 'El condicional solo falla con antecedente verdadero y consecuente falso.',
      play('rompe-promesa', 'Promesa', { rounds: [{ say: 'Si apruebo, hago una fiesta', p: 'apruebo', q: 'hago fiesta', f: IMP, want: false }] }, 'Solo si apruebo y no hay fiesta.', { hint: 'Un caso.' })],
    ['pu-lo-4', '«Todos los A son B» pone el círculo A dentro de B.',
      play('arma-silogismo', 'Círculos', { rounds: [{ sets: [{ k: 'A', name: 'rosas', r: 0.9 }, { k: 'B', name: 'flores', r: 1.8 }, { k: 'C', name: 'árboles', r: 1.4 }], rels: [['A', 'B', 'sub'], ['B', 'C', 'disj']], sol: { A: [3, 3], B: [3, 3], C: [7.5, 3] } }] }, 'Rosas dentro de flores; árboles aparte: ninguna rosa es árbol.', { hint: 'Adentro y aparte.' })],
    ['pu-lo-4', 'Un solo contraejemplo tumba un «todos».',
      play('contraejemplo', 'Contraejemplo', { rounds: [{ claim: 'Todos los números de la caja son menores que 50', items: [12, 49, 33, 51, 8], bad: x => x >= 50 }] }, 'El 51.', { hint: 'Uno.' })],
    ['pu-lo-5', 'Se supone y se revisa: lo que choca se descarta.',
      play('quien-miente', 'Mentiras', { rounds: [{ people: [{ name: 'Iris', say: 'Jaime miente', f: t => !t[1] }, { name: 'Jaime', say: 'Kiko miente', f: t => !t[2] }, { name: 'Kiko', say: 'Iris y Jaime mienten', f: t => !t[0] && !t[1] }] }] }, 'Jaime dice la verdad; Iris y Kiko mienten.', { hint: 'Supón.' })],
    ['pu-lo-5', 'Una fila con un solo hueco tiene ahí su ✓.',
      play('tabla-cruces', 'Cruces', { rounds: [{ rows: ['Sol', 'Tito', 'Uma'], cols: ['café', 'té', 'jugo'], clues: [{ t: 'not', a: 2, v: 2 }, { t: 'not', a: 2, v: 1 }, { t: 'not', a: 0, v: 1 }] }] }, 'Uma café, Sol jugo, Tito té.', { hint: 'Un hueco.' })],
  ]);
});
