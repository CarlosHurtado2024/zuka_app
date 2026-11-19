// Preuniversitario · mundo 14 «Conjuntos»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo). Reutiliza los
// juegos de conjuntos de Álgebra (pinta-venn, reparte-venn, descifra-zona, mueve-circulos, orbita-conjuntos) con datos nuevos.
PU_JUEGOS.push(({ setLesson, setExam }) => {
  setLesson('pu-cj-1', [
    play('pinta-venn', 'Pinta la operación', { rounds: [
      { text: 'A ∪ B', n: 2, f: (a, b) => a || b },
      { text: '(A ∩ B) ∪ C', n: 3, f: (a, b, c) => (a && b) || c },
      { text: 'A − (B ∪ C)', n: 3, f: (a, b, c) => a && !(b || c) },
    ] }, 'La unión junta todas las zonas de A y de B. $(A \\cap B) \\cup C$ es la parte común de A y B más todo C. $A - (B \\cup C)$ es lo de A que no toca ni a B ni a C.',
      { hint: 'Revisa zona por zona: ¿está en A? ¿en B? ¿en C? Y aplica la operación.' }),
    play('reparte-venn', 'Ubica cada número', { rounds: [{ U: ['2', '3', '4', '5', '6', '8', '9', '10'], A: ['2', '4', '6', '8', '10'], B: ['3', '6', '9'] }] },
      'A son los pares y B los múltiplos de 3: el 6 está en los dos, el 5 en ninguno.',
      { hint: 'Pregunta por cada número: ¿es par? ¿es múltiplo de 3?' }),
    play('descifra-zona', 'Nombra la zona', { rounds: [{ title: 'Operaciones', items: [{ zones: [2] }, { zones: [1, 2] }, { zones: [0] }] }] },
      'Solo B es $B - A$. Las dos lunas son la diferencia simétrica $A \\triangle B$. Lo de afuera es $(A \\cup B)^c$.',
      { hint: 'Mira si la zona rayada está dentro o fuera de cada círculo.' }),
    play('encuesta-tres', 'Tres conjuntos, del centro hacia afuera', { rounds: [{ labels: ['fútbol', 'tenis', 'natación'], z: { abc: 2, ab: 3, ac: 4, bc: 1, a: 10, b: 5, c: 6, none: 4 } }] },
      'Primero el centro (los tres: 2); luego cada pareja menos el centro; luego cada deporte menos lo que ya está en sus zonas compartidas; al final, los de ninguno.',
      { hint: 'Empieza por el centro: cada zona de dos se calcula restando lo del centro.' }),
    play('mueve-circulos', 'Cómo se relacionan', { rounds: [{ A: '{a, e, i, o, u}', B: '{a, e}', rB: 0.5, rel: 'sub' }, { A: '{1, 2, 3}', B: '{4, 5}', rB: 0.7, rel: 'disjoint' }] },
      '{a, e} está dentro de las vocales: subconjunto. {1, 2, 3} y {4, 5} no comparten nada: disjuntos.',
      { hint: 'Revisa si todos los de B están en A, o si no comparten ninguno.' }),
    play('arma-negacion', 'Escribe la operación', { rounds: [
      { ask: 'Escribe con símbolos', show: 'lo que está en A pero no en B', tray: ['$A$', '$B$', '$-$', '$\\cup$', '$\\cap$', '$C$'], need: [0, 2, 1] },
      { ask: 'Escribe con símbolos', show: 'lo que está en B y también en C', tray: ['$A$', '$B$', '$-$', '$\\cup$', '$\\cap$', '$C$'], need: [1, 4, 5], alt: [[5, 4, 1]] },
    ] }, '«Pero no» es diferencia: $A - B$. «Y también» es intersección: $B \\cap C$.',
      { hint: '«O» es unión, «y» es intersección, «pero no» es diferencia.' }),
    play('orbita-conjuntos', 'Marca los que cumplen', { rounds: [{ title: 'Relaciones', items: [
      { kind: 'sub', A: ['1', '2', '3', '4'], sets: [['1', '2'], ['5'], ['2', '4'], ['1', '6'], [], ['3', '4', '1']] },
      { kind: 'disj', A: ['a', 'b', 'c'], sets: [['d'], ['a', 'd'], ['e', 'f'], ['c'], ['b', 'g'], ['h']] },
    ] }] }, 'Son subconjuntos de A los que solo tienen elementos de A (también el vacío). Son disjuntos de A los que no comparten nada con él.',
      { hint: 'Revisa cada conjunto elemento por elemento.' }),
  ]);

  setLesson('pu-cj-2', [
    play('solapa-barras', 'Los que están en los dos', { rounds: [
      { labels: ['leen', 'dibujan'], total: 50, a: 30, b: 25, none: 10 },
      { labels: ['café', 'té'], total: 60, a: 35, b: 20, none: 13 },
    ] }, 'La unión es el total menos los de ninguno: $50 - 10 = 40$. Como $30 + 25 = 55$, sobran 15: esos están en los dos. En la otra: $60 - 13 = 47$ y $55 - 47 = 8$.',
      { hint: 'Si sumas los dos grupos, los de la intersección quedan contados dos veces.' }),
    play('encuesta-tres', 'La encuesta de tres materias', { rounds: [{ labels: ['Mat', 'Fís', 'Quí'], z: { abc: 3, ab: 5, ac: 2, bc: 4, a: 8, b: 6, c: 7, none: 5 } }] },
      'Del centro hacia afuera: los tres, luego cada pareja sin el centro, luego cada materia sola, y al final los de ninguna.',
      { hint: 'Cada dato de dos materias incluye a los del centro: réstalos.' }),
    play('complemento-conteo', 'Al menos uno = todos menos ninguno', { rounds: [{ ask: 'Números de 2 cifras con al menos un 4', slots: ['decenas', 'unidades'], all: [9, 10], none: [8, 9], tray: [10, 9, 8, 7] }] },
      'Todos los de dos cifras son $9 \\cdot 10 = 90$; sin ningún 4 son $8 \\cdot 9 = 72$; con al menos un 4: $90 - 72 = 18$.',
      { hint: 'Cuenta los que no tienen ningún 4 y réstalos del total.' }),
    play('cinta-ecuacion', 'La encuesta con una incógnita', { rounds: [{ say: 'De 40: 25 en A, 22 en B, 3 en ninguno. Los dos son x', parts: [[-1, 25, 'solo A'], [1, 0, 'los dos'], [-1, 22, 'solo B'], [0, 3, 'ninguno']], total: 40, lo: 0, hi: 20 }] },
      '$(25 - x) + x + (22 - x) + 3 = 40$ da $50 - x = 40$: $x = 10$.',
      { hint: 'Solo A es A menos los de los dos.' }),
    play('tabla-doble', 'Comparar grupos', { rounds: [{ rows: [['hombres', 12, 30], ['mujeres', 27, 45]], what: 'practica deporte' }] },
      'Hay más mujeres que practican (27 frente a 12) y también en proporción: 60 % frente a 40 %.',
      { hint: 'Divide entre el total de cada grupo.' }),
    play('pinta-venn', 'Solo y exactamente', { rounds: [{ text: 'solo A', n: 2, f: (a, b) => a && !b }, { text: 'exactamente dos de los tres', n: 3, f: (a, b, c) => a + b + c === 2 }] },
      '«Solo A» es la luna de A sin B. «Exactamente dos» son las tres zonas de parejas, sin el centro.',
      { hint: '«Exactamente dos» no incluye a los que están en los tres.' }),
    play('rompe-cambios', 'Manda la pelota a la cuenta de la encuesta', { miss: 'la intersección no se cuenta dos veces', rounds: [{ title: 'Encuestas', items: [
      { ask: '30 en A, 20 en B, 8 en los dos: la unión', options: ['42', '50', '58'], answer: 0 },
      { ask: 'Total 50 y unión 42: ninguno', options: ['8', '42', '92'], answer: 0 },
      { ask: 'A tiene 30 y 8 están en los dos: solo A', options: ['22', '38', '30'], answer: 0 },
    ] }] }, '$30 + 20 - 8 = 42$. $50 - 42 = 8$. $30 - 8 = 22$.',
      { hint: 'Unión = A + B − los dos.' }),
  ]);

  setExam('pu-conjuntos', 'Conjuntos', [
    ['pu-cj-1', 'Cada operación es un grupo de zonas del diagrama.',
      play('pinta-venn', 'Operación', { rounds: [{ text: '(A ∪ B) − C', n: 3, f: (a, b, c) => (a || b) && !c }] }, 'Lo de A o B que no toca C.', { hint: 'Zona por zona.' })],
    ['pu-cj-1', 'Con tres conjuntos se llena del centro hacia afuera.',
      play('encuesta-tres', 'Tres', { rounds: [{ labels: ['A', 'B', 'C'], z: { abc: 1, ab: 2, ac: 3, bc: 2, a: 4, b: 5, c: 3, none: 2 } }] }, 'Del centro hacia afuera.', { hint: 'Centro.' })],
    ['pu-cj-2', '$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
      play('solapa-barras', 'Solapa', { rounds: [{ labels: ['A', 'B'], total: 40, a: 22, b: 15, none: 9 }] }, 'Unión 31; los dos: $37 - 31 = 6$.', { hint: 'Doble conteo.' })],
    ['pu-cj-2', 'Los de ninguno son el total menos la unión.',
      play('cinta-ecuacion', 'Incógnita', { rounds: [{ say: 'De 30: 18 en A, 14 en B, 4 en ninguno. Los dos son x', parts: [[-1, 18, 'solo A'], [1, 0, 'los dos'], [-1, 14, 'solo B'], [0, 4, 'ninguno']], total: 30, lo: 0, hi: 14 }] }, '$36 - x = 30$: $x = 6$.', { hint: 'Solo A.' })],
  ]);
});
