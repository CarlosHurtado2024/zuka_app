// Preuniversitario · mundo 8 «Codificación»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
PU_JUEGOS.push(({ setLesson, setExam }) => {
  const KEY = [['R', '#'], ['A', '*'], ['M', '%'], ['O', '@'], ['T', '&'], ['S', '=']];
  setLesson('pu-cd-1', [
    play('rueda-cesar', 'La rueda de César', { rounds: [{ pair: ['A', 'E'], msg: 'QIWE' }, { pair: ['B', 'D'], msg: 'RGTTQ' }] },
      'Si A se cifra E, cada letra avanza 4: para descifrar se retrocede 4 y QIWE dice MESA. Si B se cifra D, la clave es +2 y RGTTQ dice PERRO.',
      { hint: 'Alinea la letra original con su cifrada: el mismo giro sirve para todas las letras.' }),
    play('clave-simbolos', 'Clave de símbolos', { rounds: [{ key: KEY, word: 'RAMO', mode: 'code' }, { key: KEY, word: 'ROSA', mode: 'decode' }] },
      'Con la tabla, cada letra tiene siempre su símbolo: RAMO es # * % @, y # @ = * se lee ROSA.',
      { hint: 'Busca cada letra (o cada símbolo) en la tabla, uno por uno, sin saltarte ninguno.' }),
    play('altura-letras', 'Lo que vale una palabra', { rounds: [{ word: 'PAN' }, { word: 'DEDO' }] },
      'Cada letra vale su lugar: $P + A + N = 16 + 1 + 14 = 31$ y $D + E + D + O = 4 + 5 + 4 + 15 = 28$.',
      { hint: 'Sin la Ñ, la K es la 11: cuenta desde la regla de la izquierda.' }),
    play('binario-luces', 'El código de los bombillos', { rounds: [{ n: 13, bits: 5 }, { n: 22, bits: 5 }, { n: 7, bits: 4 }] },
      'Cada bombillo vale el doble del de su derecha: $13 = 8 + 4 + 1$ (01101), $22 = 16 + 4 + 2$ (10110) y $7 = 4 + 2 + 1$ (0111).',
      { hint: 'Empieza por el bombillo más grande que quepa en el número y sigue con lo que falta.' }),
    play('cuadro-polibio', 'Letras con coordenadas', { rounds: [{ word: 'FLOR', mode: 'code' }, { word: 'VELA', mode: 'code' }] },
      'Cada letra es su fila y su columna: F = 21, L = 32, O = 35, R = 43; V = 52, E = 15, L = 32, A = 11.',
      { hint: 'Primero la fila (número de la izquierda) y después la columna (número de arriba).' }),
    play('espejo-palabra', 'El código espejo', { rounds: [{ word: 'PAZ' }, { word: 'RISA' }] },
      'En el espejo la palabra se lee al revés: PAZ se ve ZAP y RISA se ve ASIR, cada letra volteada.',
      { hint: 'La última letra de la palabra es la primera que se ve en el espejo.' }),
    play('vuela-precios', 'Vuela al código correcto', { rounds: [{ title: 'Códigos', items: [
      { ask: 'César +3: ¿cómo se cifra ASA?', options: ['DVD', 'BTB', 'CUC'], answer: 0 },
      { ask: 'A = 1, …, Z = 26: ¿cuánto vale OSO?', options: ['49', '47', '51'], answer: 0 },
      { ask: 'En binario, 10010 es…', options: ['18', '20', '9'], answer: 0 },
    ] }] }, 'A + 3 = D y S + 3 = V: DVD. $15 + 19 + 15 = 49$. $10010 = 16 + 2 = 18$.',
      { hint: 'Haz cada cuenta con la regla del código antes de volar.' }),
  ]);

  setLesson('pu-cd-2', [
    play('maquina-regla', 'La máquina de la regla', { rounds: [
      { ex: [[34, 7], [52, 7], [18, 9]], ask: 46, op: 'dsum' },
      { ex: [[3, 11], [5, 13], [10, 18]], ask: 21, op: 'add', k: 8 },
      { ex: [[23, 6], [45, 20], [17, 7]], ask: 38, op: 'dmul' },
    ] }, 'La regla tiene que servir con todos los ejemplos: $3 + 4 = 7$, $5 + 2 = 7$, $1 + 8 = 9$ (suma de cifras, $46 \\to 10$); sumar 8 ($21 \\to 29$); y multiplicar las cifras ($38 \\to 24$).',
      { hint: 'Prueba una regla y mira si la máquina marca todos los ejemplos; si falla uno, no es la regla.' }),
    play('permuta-codigo', 'El código que reordena', { rounds: [
      { ex: [['PERA', 'REPA'], ['LIMO', 'MILO']], word: 'NUBE' },
      { ex: [['FRESA', 'RFSEA'], ['PLUMA', 'LPMUA']], word: 'CIELO' },
    ] }, 'En la primera, la primera y la tercera letra cambian de lugar: NUBE → BUNE. En la segunda se cambian las letras de dos en dos y la última se queda: CIELO → ICLEO.',
      { hint: 'Fíjate a qué lugar fue a parar la primera letra de cada ejemplo, luego la segunda…' }),
    play('rueda-cesar', 'Descubre la clave con una palabra', { rounds: [{ pair: ['NUBE', 'QXEH'], msg: 'IUXWD' }] },
      'N → Q, U → X, B → E, E → H: todas avanzan 3. Retrocediendo 3, IUXWD dice FRUTA.',
      { hint: 'Mira cuánto avanzó la primera letra y comprueba con las demás.' }),
    play('clave-simbolos', 'La clave escondida en los ejemplos', { rounds: [{ key: [['C', '#'], ['A', '*'], ['S', '%'], ['O', '@'], ['L', '&']], ex: [['CASO', '# * % @'], ['SOL', '% @ &']], word: 'LOCA', mode: 'decode' }] },
      'Comparando posición por posición: C = #, A = *, S = %, O = @ y, con SOL, L = &. Entonces & @ # * dice LOCA.',
      { hint: 'Pon cada letra encima de su símbolo en los ejemplos.' }),
    play('letras-salto', 'La regla de las letras', { rounds: [{ seq: ['D', 'H', 'L', 'P'], need: 'T' }, { seq: ['Y', 'V', 'S', 'P'], need: 'M' }] },
      'D, H, L, P son 4, 8, 12, 16: sigue 20, T. Y, V, S, P son 25, 22, 19, 16: sigue 13, M.',
      { hint: 'Pasa las letras a números y busca el salto.' }),
    play('cuadro-polibio', 'Descifra las coordenadas', { rounds: [{ word: 'NIDO', mode: 'decode' }] },
      'Fila y columna: 34 es N, 24 es I, 14 es D y 35 es O: NIDO.',
      { hint: 'La primera cifra es la fila; la segunda, la columna.' }),
    play('rompe-cambios', 'Manda la pelota a lo que sigue la regla', { miss: 'comprueba la regla con todos los ejemplos', rounds: [{ title: 'Reglas', items: [
      { ask: 'Si PISO se escribe OSIP, ¿cómo se escribe RAMO?', options: ['OMAR', 'AMOR', 'MORA'], answer: 0 },
      { ask: '12 → 3, 41 → 5, 70 → 7. ¿27 → ?', options: ['9', '14', '5'], answer: 0 },
      { ask: 'Si CAMA se cifra DBNB, ¿qué dice TPM?', options: ['SOL', 'UQN', 'TOM'], answer: 0 },
    ] }] }, 'PISO al revés es OSIP: RAMO al revés, OMAR. Se suman las cifras: $2 + 7 = 9$. Cada letra avanzó 1: retrocediendo, TPM dice SOL.',
      { hint: 'Descubre la regla con el ejemplo y aplícala tal cual.' }),
  ]);

  setExam('pu-codigos', 'Codificación', [
    ['pu-cd-1', 'En la clave César todas las letras se corren lo mismo.',
      play('rueda-cesar', 'César', { rounds: [{ pair: ['C', 'F'], msg: 'GLD' }] }, 'Clave +3: GLD dice DIA.', { hint: 'Retrocede.' })],
    ['pu-cd-1', 'Con A = 1, …, Z = 26 (sin Ñ), una palabra vale la suma de sus letras.',
      play('altura-letras', 'Valor', { rounds: [{ word: 'MAR' }] }, '$13 + 1 + 18 = 32$.', { hint: 'Suma lugares.' })],
    ['pu-cd-1', 'En binario cada lugar vale el doble del de su derecha.',
      play('binario-luces', 'Binario', { rounds: [{ n: 25, bits: 5 }] }, '$25 = 16 + 8 + 1$: 11001.', { hint: 'Del más grande.' })],
    ['pu-cd-2', 'La regla tiene que servir para todos los ejemplos.',
      play('maquina-regla', 'Regla', { rounds: [{ ex: [[4, 12], [7, 21], [10, 30]], ask: 9, op: 'mul', k: 3 }] }, 'Multiplicar por 3: $9 \\to 27$.', { hint: 'Todos.' })],
    ['pu-cd-2', 'Si las letras no cambian, el código solo las reordena.',
      play('permuta-codigo', 'Orden', { rounds: [{ ex: [['TECLA', 'ALCET']], word: 'PIANO' }] }, 'Se escribe al revés: ONAIP.', { hint: 'La primera.' })],
    ['pu-cd-2', 'Una clave se saca comparando los ejemplos posición por posición.',
      play('clave-simbolos', 'Clave', { rounds: [{ key: [['P', '#'], ['A', '*'], ['L', '%'], ['O', '@']], ex: [['PALO', '# * % @']], word: 'POLO', mode: 'decode' }] }, '# @ % @ dice POLO.', { hint: 'Compara.' })],
  ]);
});
