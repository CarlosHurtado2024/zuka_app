// Preuniversitario · mundo 3 «Acertijos de orden y asignación»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
// Pistas de orden: orden-kit.js. Cada acertijo tiene una sola solución (lo comprueba tests/preuda-razonamiento.test.js).
PU_JUEGOS.push(({ setLesson, setExam }) => {
  const K = (t, a, b, say, x = {}) => ({ t, a, b, say, ...x });
  const at = (a, i, say) => ({ t: 'at', a, i, say }), notAt = (a, i, say) => ({ t: 'notAt', a, i, say });

  setLesson('pu-or-1', [
    play('fila-pistas', 'Acomoda la fila con las pistas', { rounds: [
      { names: ['Pablo', 'Quino', 'Rosa', 'Sara'], clues: [at('Rosa', 2, 'Rosa es la tercera'), K('justBefore', 'Pablo', 'Quino', 'Quino va justo después de Pablo'), notAt('Sara', 0, 'Sara no es la primera')] },
      { names: ['Tito', 'Uma', 'Vera', 'Walter', 'Xime'], clues: [at('Uma', 2, 'Uma está en el centro'), K('before', 'Vera', 'Tito', 'Tito está a la derecha de Vera'), K('justBefore', 'Walter', 'Xime', 'Xime va justo después de Walter'), notAt('Vera', 0, 'Vera no es la primera')] },
    ] }, 'Se empieza por la pista más firme: un puesto fijo. En la primera, Rosa es la 3.ª; Pablo y Quino necesitan dos puestos seguidos, y como Sara no es la primera, solo caben en 1.º y 2.º. En la segunda, Uma en el centro deja dos puestos a cada lado; si Walter y Xime fueran 4.º y 5.º, Vera quedaría de primera.',
      { hint: 'Ubica primero a quien tiene un puesto fijo; luego busca dónde caben las parejas que van juntas.' }),
    play('edificio-pisos', '¿Quién vive en cada piso?', { rounds: [
      { names: ['Ana', 'Beto', 'Ceci', 'Dani'], clues: [at('Ceci', 3, 'Ceci vive en el último piso'), K('justBefore', 'Dani', 'Ana', 'Ana vive justo encima de Dani'), K('before', 'Beto', 'Dani', 'Beto vive más abajo que Dani')] },
      { names: ['Elsa', 'Fede', 'Gabi', 'Hugo', 'Inés'], clues: [at('Hugo', 1, 'Hugo vive en el piso 2'), at('Gabi', 4, 'Gabi vive en el último piso'), K('justBefore', 'Inés', 'Fede', 'Fede vive justo encima de Inés')] },
    ] }, 'Un edificio es una fila de pie: «más arriba» es «después». Ceci arriba del todo; Beto debajo de Dani y Ana justo encima de Dani: Beto 1, Dani 2, Ana 3. En el otro, con Hugo en el 2 y Gabi en el 5, la pareja Inés-Fede solo cabe en 3 y 4, y Elsa queda en el 1.',
      { hint: 'Pon primero los pisos fijos; las parejas «justo encima» necesitan dos pisos seguidos libres.' }),
    play('carrera-llegada', 'El orden de llegada', { rounds: [
      { names: ['Juan', 'Kiara', 'Leo', 'Mila'], clues: [at('Leo', 3, 'Leo llegó de último'), K('before', 'Kiara', 'Juan', 'Kiara llegó antes que Juan'), notAt('Mila', 0, 'Mila no ganó'), K('notAdj', 'Juan', 'Kiara', 'Juan y Kiara no llegaron seguidos')] },
      { names: ['Nico', 'Olga', 'Pía', 'Raúl', 'Sol'], clues: [at('Pía', 2, 'Pía llegó tercera'), K('justBefore', 'Raúl', 'Sol', 'Sol llegó justo después de Raúl'), K('before', 'Olga', 'Nico', 'Olga llegó antes que Nico'), notAt('Sol', 4, 'Sol no fue la última')] },
    ] }, 'Con Leo último quedan tres puestos. Mila no ganó; si Mila fuera 3.ª, Kiara y Juan llegarían seguidos. Así: Kiara, Mila, Juan, Leo. En la otra, Raúl y Sol no caben al final (Sol no fue última): van 1.º y 2.º, y Olga y Nico ocupan 4.º y 5.º.',
      { hint: 'Prueba las dos opciones que deja una pista y descarta la que choca con otra.' }),
    play('dias-semana', 'La agenda de la semana', { rounds: [
      { names: ['Teatro', 'Música', 'Pintura', 'Baile', 'Cocina'], clues: [at('Música', 1, 'Música es el martes'), K('end', 'Cocina', null, 'Cocina es el primer o el último día'), notAt('Cocina', 0, 'Cocina no es el lunes'), K('justBefore', 'Baile', 'Pintura', 'Pintura es el día siguiente a Baile'), K('before', 'Teatro', 'Baile', 'Teatro es antes que Baile')] },
    ] }, 'Música el martes y Cocina el viernes (es un extremo y no es el lunes). Quedan lunes, miércoles y jueves: Baile y Pintura necesitan dos días seguidos (miércoles y jueves) y Teatro, antes que Baile, va el lunes.',
      { hint: 'Fija los días seguros y mira qué días seguidos quedan para la pareja.' }),
    play('descarta-casos', 'Tacha los acomodos imposibles', { rounds: [
      { cands: [['Lía', 'Max', 'Oto', 'Noa'], ['Max', 'Oto', 'Noa', 'Lía'], ['Oto', 'Max', 'Noa', 'Lía'], ['Lía', 'Noa', 'Oto', 'Max']], clues: [K('before', 'Max', 'Noa', 'Max va antes que Noa'), K('notEnd', 'Oto', null, 'Oto no está en un extremo'), K('end', 'Lía', null, 'Lía está en un extremo'), notAt('Noa', 3, 'Noa no es la última')] },
    ] }, 'Cada acomodo cae con una pista: el primero pone a Noa de última, el tercero a Oto en un extremo y el cuarto a Noa antes que Max. Solo queda Max, Oto, Noa, Lía.',
      { hint: 'Revisa cada tarjeta contra cada pista: basta una que no se cumpla para tacharla.' }),
    play('tren-ordenado', 'Ordena de menor a mayor estatura', { rounds: [
      { items: [{ label: 'Ana 1.62', v: 1.62 }, { label: 'Beto 1.75', v: 1.75 }, { label: 'Ciro 1.58', v: 1.58 }, { label: 'Dora 1.70', v: 1.70 }, { label: 'Eli 1.66', v: 1.66 }] },
    ] }, 'Ordenar es comparar de a dos: 1.58 < 1.62 < 1.66 < 1.70 < 1.75. Ciro, Ana, Eli, Dora y Beto.',
      { hint: 'Compara primero los decimales; todos empiezan en 1.' }),
    play('rompe-cambios', 'Manda la pelota a la respuesta', { miss: 'revisa las pistas una por una', rounds: [
      { title: 'Filas', items: [
        { ask: 'A antes que B y B antes que C: ¿quién va primero?', options: ['A', 'B', 'C'], answer: 0 },
        { ask: '5 en fila; X es la del centro: ¿qué puesto?', options: ['3.º', '2.º', '4.º'], answer: 0 },
        { ask: 'P justo antes de Q y Q es la 4.ª: ¿P?', options: ['3.ª', '5.ª', '2.ª'], answer: 0 },
      ] },
    ] }, '«Antes que» encadena: si A va antes que B y B antes que C, A va primero. En una fila de 5 el centro es el 3.º, y si Q es la 4.ª, P va justo antes: 3.ª.',
      { hint: 'Dibuja la fila en tu cabeza y pon a cada uno donde dice la pista.' }),
  ]);

  setLesson('pu-or-2', [
    play('mesa-redonda', 'Sienta a todos alrededor de la mesa', { rounds: [
      { names: ['Gil', 'Hana', 'Iván', 'Jade', 'Kai', 'Luz'], clues: [K('opp', 'Gil', 'Hana', 'Hana está frente a Gil'), K('right', 'Gil', 'Iván', 'Iván está justo a la derecha de Gil'), K('opp', 'Iván', 'Luz', 'Luz está frente a Iván'), K('adj', 'Jade', 'Hana', 'Jade está junto a Hana'), K('notAdj', 'Kai', 'Iván', 'Kai no está junto a Iván')] },
      { names: ['Mar', 'Ned', 'Oli', 'Pau'], clues: [K('opp', 'Mar', 'Oli', 'Oli está frente a Mar'), K('right', 'Oli', 'Pau', 'Pau está justo a la derecha de Oli')] },
    ] }, 'Con Gil fijo arriba, «frente a» es la silla opuesta: Hana abajo. Iván a su derecha y Luz frente a Iván. Jade junto a Hana en la silla libre de ese lado, y Kai, que no puede tocar a Iván, en la última.',
      { hint: 'Con la primera persona fija, «frente a» y «justo a la derecha» dan sillas exactas: empieza por ellas.' }),
    play('collar-cuentas', 'Ensarta el collar', { rounds: [
      { names: ['roja', 'azul', 'verde', 'negra', 'blanca'], clues: [K('right', 'roja', 'azul', 'la azul va justo después de la roja'), K('adj', 'negra', 'roja', 'la negra toca a la roja'), K('notAdj', 'verde', 'azul', 'la verde no toca a la azul')] },
      { names: ['gris', 'café', 'rosa', 'lila', 'oro', 'plata'], clues: [K('opp', 'gris', 'oro', 'el oro está frente al gris'), K('right', 'oro', 'rosa', 'la rosa va justo después del oro'), K('adj', 'café', 'gris', 'el café toca al gris'), K('notAdj', 'lila', 'rosa', 'la lila no toca a la rosa'), K('right', 'lila', 'plata', 'la plata va justo después de la lila')] },
    ] }, 'La primera cuenta queda fija y las demás se ponen respecto a ella. La azul va después de la roja; la negra, que toca a la roja, solo cabe al otro lado; la verde no toca a la azul, así que la blanca queda entre ellas.',
      { hint: 'Ubica primero las pistas de «justo después»; las de «no toca» sirven al final para descartar.' }),
    play('brujula-casas', 'Las casas alrededor de la plaza', { rounds: [
      { names: ['Rita', 'Saúl', 'Tere', 'Ugo'], clues: [at('Rita', 0, 'Rita vive al norte'), K('opp', 'Rita', 'Saúl', 'Saúl vive frente a Rita'), K('right', 'Rita', 'Tere', 'Tere vive justo después de Rita, en el sentido del reloj')] },
      { names: ['Vale', 'Wil', 'Yeni', 'Zoe'], clues: [at('Wil', 3, 'Wil vive al oeste'), K('opp', 'Wil', 'Zoe', 'Zoe vive frente a Wil'), notAt('Vale', 2, 'Vale no vive al sur')] },
    ] }, 'Aquí sí importa dónde está cada casa: el norte es el norte. Frente al norte está el sur; en el sentido del reloj, después del norte viene el este. Frente al oeste está el este, y si Vale no vive al sur, vive al norte.',
      { hint: 'Ubica primero la casa con punto cardinal fijo; «frente a» es el punto opuesto.' }),
    play('ronda-saltos', '¿Quién queda en la ronda?', { rounds: [{ n: 6, k: 2 }, { n: 7, k: 3 }, { n: 5, k: 2 }] },
      'Se cuenta en el sentido del reloj y se saca a cada k-ésimo, siguiendo desde el siguiente. Con 6 y de 2 en 2 salen 2, 4, 6, 3, 1 y queda el 5. Con 7 y de 3 en 3 queda el 4; con 5 y de 2 en 2, el 3.',
      { hint: 'Haz la cuenta despacio: tacha a cada uno que sale y no lo vuelvas a contar.' }),
    play('gira-mesa', 'Girar la mesa no cambia el acomodo', { rounds: [{ left: ['Sol', 'Mar', 'Río', 'Luz', 'Cielo'], shift: 2 }, { left: ['Ana', 'Beto', 'Ciro', 'Dora', 'Eva', 'Fede'], shift: 4 }] },
      'En una mesa redonda lo que cuenta es quién tiene a quién al lado. Si todos se corren las mismas sillas, el acomodo es el mismo: por eso se fija a una persona y se ubica a las demás respecto a ella.',
      { hint: 'Busca a una persona en las dos mesas y gira hasta que quede en la misma silla.' }),
    play('descarta-casos', 'Tacha las mesas imposibles', { rounds: [
      { circ: true, cands: [['Pilar', 'Quique', 'Rafa', 'Susi'], ['Pilar', 'Rafa', 'Quique', 'Susi'], ['Pilar', 'Susi', 'Rafa', 'Quique'], ['Pilar', 'Quique', 'Susi', 'Rafa']], clues: [K('opp', 'Pilar', 'Rafa', 'Rafa está frente a Pilar'), K('right', 'Pilar', 'Quique', 'Quique está justo a la derecha de Pilar')] },
    ] }, 'Leídas en el sentido del reloj desde Pilar, solo la primera mesa tiene a Quique justo después de ella y a Rafa en la silla opuesta.',
      { hint: 'En una mesa de cuatro, «frente a» es dos sillas más allá.' }),
    play('vuela-precios', 'Vuela a la respuesta', { rounds: [
      { title: 'Mesas redondas', items: [
        { ask: 'mesa de 8: silla frente a la 3', options: ['7', '5', '4'], answer: 0 },
        { ask: 'mesa de 6: vecinos de la silla 1', options: ['2 y 6', '2 y 3', '6 y 5'], answer: 0 },
        { ask: 'mesa de 10: silla frente a la 9', options: ['4', '1', '5'], answer: 0 },
      ] },
    ] }, 'En una mesa de $n$ sillas, la de enfrente está $n/2$ sillas más allá: frente a la 3 de 8 está la 7, y frente a la 9 de 10, la 4 (se da la vuelta). La silla 1 tiene de vecinas a la 2 y a la última.',
      { hint: 'Suma la mitad de las sillas y, si te pasas del total, da la vuelta.' }),
  ]);

  setLesson('pu-or-3', [
    play('tabla-cruces', 'Un ✓ por fila y por columna', { rounds: [
      { rows: ['Tomás', 'Vilma', 'Yago'], cols: ['Medicina', 'Derecho', 'Arte'], clues: [{ t: 'not', a: 0, v: 0 }, { t: 'not', a: 0, v: 1 }, { t: 'not', a: 1, v: 0 }] },
      { rows: ['Ema', 'Fran', 'Gus', 'Ivo'], cols: ['perro', 'gato', 'loro', 'pez'], clues: [{ t: 'not', a: 0, v: 0 }, { t: 'not', a: 0, v: 1 }, { t: 'not', a: 0, v: 2 }, { t: 'not', a: 2, v: 2 }, { t: 'not', a: 2, v: 3 }, { t: 'is', a: 1, v: 0, say: 'Fran tiene el perro' }] },
    ] }, 'Cada ✗ es una pista negativa. Una fila con un solo hueco libre tiene ahí su ✓, y esa columna se tacha para los demás. Tomás solo puede Arte; Vilma, Derecho; Yago, Medicina. En la otra: Fran el perro, Ema el pez, Gus el gato e Ivo el loro.',
      { hint: 'Busca la fila (o la columna) que tiene un solo hueco sin ✗: ese es su ✓.' }),
    play('casilleros', '¿Qué guarda cada uno?', { rounds: [
      { people: ['Bea', 'Coco', 'Dino'], names: ['mochila', 'balón', 'casco'], clues: [at('balón', 2, 'el balón es de Dino'), notAt('mochila', 0, 'la mochila no es de Bea')] },
      { people: ['Edu', 'Fer', 'Gala', 'Hilda'], names: ['libro', 'gorra', 'raqueta', 'termo'], clues: [at('raqueta', 1, 'la raqueta es de Fer'), notAt('libro', 0, 'el libro no es de Edu'), notAt('libro', 3, 'el libro no es de Hilda'), notAt('gorra', 0, 'la gorra no es de Edu')] },
    ] }, 'Con lo seguro primero: el balón es de Dino; la mochila no es de Bea, así que es de Coco, y a Bea le queda el casco. En la otra, Edu no tiene libro ni gorra ni raqueta: tiene el termo; el libro solo puede ser de Gala y la gorra, de Hilda.',
      { hint: 'Mira qué persona tiene tachadas casi todas las cosas: la que le queda es la suya.' }),
    play('tres-listas', 'Color y mascota de cada uno', { rounds: [
      { people: ['Iris', 'Joel', 'Kim'], A: ['rojo', 'azul', 'verde'], B: ['perro', 'gato', 'pez'], clues: [{ t: 'link', a: 'rojo', b: 'perro', say: 'quien viste de rojo tiene el perro' }, { t: 'isB', p: 1, v: 'gato', say: 'Joel tiene el gato' }, { t: 'notA', p: 0, v: 'rojo', say: 'Iris no viste de rojo' }, { t: 'notA', p: 0, v: 'verde', say: 'Iris no viste de verde' }] },
    ] }, 'Joel tiene el gato, así que no viste de rojo (el rojo va con el perro); Iris tampoco: el rojo y el perro son de Kim. Iris, sin verde, viste de azul y Joel de verde; a Iris le queda el pez.',
      { hint: 'Las pistas que unen dos listas («quien viste de rojo tiene el perro») sirven para tachar en las dos.' }),
    play('descarta-casos', 'Tacha los repartos imposibles', { rounds: [
      { cands: [['té', 'café', 'jugo'], ['café', 'jugo', 'té'], ['jugo', 'té', 'café'], ['café', 'té', 'jugo']], clues: [notAt('café', 0, 'Ana no toma café'), at('jugo', 2, 'Ciro toma jugo')] },
    ] }, 'Cada tarjeta dice qué toma Ana, Beto y Ciro en ese orden. Las que le dan café a Ana o no le dan el jugo a Ciro se tachan: queda té, café, jugo.',
      { hint: 'Lee cada tarjeta como Ana · Beto · Ciro y compárala con las dos pistas.' }),
    play('dias-semana', '¿Qué día atiende cada médico?', { rounds: [
      { names: ['Gómez', 'Ríos', 'Pardo', 'Vélez'], clues: [notAt('Gómez', 0, 'Gómez no atiende el lunes'), K('before', 'Ríos', 'Gómez', 'Ríos atiende antes que Gómez'), at('Vélez', 3, 'Vélez atiende el jueves'), notAt('Pardo', 1, 'Pardo no atiende el martes'), notAt('Pardo', 0, 'Pardo no atiende el lunes')] },
    ] }, 'Vélez el jueves. Gómez no el lunes y después de Ríos; Pardo no el martes. Si Gómez fuera el martes, Ríos sería el lunes y Pardo el miércoles: cumple todo. Si Gómez fuera el miércoles, a Pardo solo le quedarían lunes o martes, y no puede ninguno.',
      { hint: 'Prueba los días posibles de Gómez y mira si los demás todavía caben.' }),
    play('edificio-pisos', 'Cada uno en su piso', { rounds: [
      { names: ['Raúl', 'Sonia', 'Tobi', 'Uriel'], clues: [notAt('Raúl', 0, 'Raúl no vive en el piso 1'), notAt('Raúl', 3, 'Raúl no vive en el último piso'), K('before', 'Raúl', 'Sonia', 'Sonia vive más arriba que Raúl'), at('Tobi', 1, 'Tobi vive en el piso 2')] },
    ] }, 'Tobi en el 2. Raúl no está ni abajo ni arriba del todo, y el 2 está ocupado: vive en el 3. Sonia, más arriba, en el 4, y Uriel en el 1.',
      { hint: 'Tacha para Raúl los pisos que no puede tener: le queda uno solo.' }),
    play('rompe-cambios', 'Manda la pelota al reparto correcto', { miss: 'tacha con las pistas negativas', rounds: [
      { title: 'Tablas', items: [
        { ask: '3 personas y 3 deportes: X no juega fútbol ni tenis', options: ['X juega el tercero', 'no se sabe', 'X juega fútbol'], answer: 0 },
        { ask: 'Y tiene el gato y Z no tiene pez (gato, pez, perro)', options: ['Z tiene el perro', 'Z tiene el pez', 'no se sabe'], answer: 0 },
      ] },
    ] }, 'Con tres opciones, tachar dos deja la tercera. Si Y tiene el gato y Z no el pez, a Z solo le queda el perro.',
      { hint: 'Cuenta cuántas opciones le quedan a cada persona después de tachar.' }),
  ]);

  setLesson('pu-or-4', [
    play('comite-reglas', 'Arma un comité que cumpla las reglas', { rounds: [
      { names: ['F', 'G', 'H', 'J', 'K'], k: 3, need: ['H'], rules: [K('ifNot', 'F', 'G', 'si F va, G no'), K('onlyIf', 'H', 'J', 'H va solo si J va'), K('out', 'K', null, 'K no va')] },
      { names: ['P', 'Q', 'R', 'S', 'T'], k: 3, need: ['R'], rules: [K('either', 'P', 'Q', 'va P o va Q'), K('ifNot', 'P', 'R', 'si P va, R no'), K('out', 'T', null, 'T no va')] },
    ] }, 'Un «si A, entonces no B» solo prohíbe tenerlos juntos. «H va solo si J va»: con H, J tiene que ir. Así, con H van J y uno de F o G. En la otra, con R no puede ir P, así que va Q; el tercero es S.',
      { hint: 'Empieza por quien tiene que ir y mira qué te obliga a meter o a dejar por fuera.' }),
    play('tiene-podria', 'Tiene que, podría o no puede', { rounds: [
      { names: ['L', 'M', 'N', 'O'], k: 2, rules: [K('ifNot', 'L', 'M', 'si L va, M no'), K('onlyIf', 'N', 'O', 'N va solo si O va')], claims: [{ t: 'in', a: 'O', say: 'O va' }, { t: 'in', a: 'L', say: 'L va' }, { t: 'both', a: 'L', b: 'M', say: 'L y M van' }, { t: 'in', a: 'M', say: 'M va' }] },
    ] }, 'Los comités posibles son LO, MO y NO. O está en todos: tiene que ir. L y M aparecen en alguno: podrían. L y M juntos no aparecen nunca.',
      { hint: 'Arriba arma los comités que cumplen y anótalos; una afirmación es «tiene que» si está en todos.' }),
    play('descarta-casos', 'Tacha los horarios imposibles', { rounds: [
      { cands: [['Arte', 'Cine', 'Danza', 'Baile'], ['Cine', 'Arte', 'Danza', 'Baile'], ['Arte', 'Baile', 'Danza', 'Cine'], ['Baile', 'Arte', 'Cine', 'Danza']], clues: [K('before', 'Arte', 'Cine', 'si hay Arte y Cine, Arte va antes'), at('Danza', 2, 'Danza es el miércoles'), K('notAdj', 'Arte', 'Cine', 'Arte y Cine no van seguidos')] },
    ] }, 'Cada tarjeta es lunes, martes, miércoles y jueves. Se tacha la que pone Cine antes de Arte, la que no tiene Danza el miércoles y la que pone Arte y Cine seguidos: queda Arte, Baile, Danza, Cine.',
      { hint: 'Revisa primero Danza el miércoles; luego el orden de Arte y Cine.' }),
    play('dias-semana', 'Organiza las charlas', { rounds: [
      { names: ['Agua', 'Bosques', 'Clima', 'Desiertos', 'Energía'], clues: [at('Clima', 2, 'Clima es el miércoles'), K('end', 'Energía', null, 'Energía es el lunes o el viernes'), K('before', 'Agua', 'Bosques', 'Agua va antes que Bosques'), K('justBefore', 'Clima', 'Desiertos', 'Desiertos es justo después de Clima'), K('notAt', 'Energía', null, 'Energía no es el viernes', { i: 4 })] },
    ] }, 'Clima el miércoles y Desiertos el jueves. Energía va en un extremo pero no el viernes: el lunes. Quedan martes y viernes para Agua y Bosques, en ese orden.',
      { hint: 'Encadena: una pista fija a Clima y otra pega a Desiertos justo después.' }),
    play('fila-pistas', 'La fila del banco', { rounds: [
      { names: ['Abi', 'Bruno', 'Cata', 'Dilan'], clues: [K('notAdj', 'Abi', 'Bruno', 'Abi y Bruno no están juntos'), at('Cata', 0, 'Cata es la primera'), K('before', 'Bruno', 'Abi', 'Bruno va antes que Abi')] },
    ] }, 'Con Cata primera quedan 2.º, 3.º y 4.º. Bruno antes que Abi y sin estar juntos: Bruno 2.º y Abi 4.º; Dilan 3.º.',
      { hint: 'Si dos no pueden estar juntos y quedan tres puestos seguidos, van a los extremos.' }),
    play('casilleros', '¿De quién es cada maleta?', { rounds: [
      { people: ['Iñaki', 'Jaz', 'Kevin'], names: ['roja', 'azul', 'negra'], clues: [notAt('roja', 0, 'la roja no es de Iñaki'), notAt('roja', 1, 'la roja no es de Jaz'), notAt('azul', 0, 'la azul no es de Iñaki')] },
    ] }, 'La roja solo puede ser de Kevin. La azul no es de Iñaki ni de Kevin (ya tiene la roja): es de Jaz, e Iñaki tiene la negra.',
      { hint: 'Empieza por la maleta que tiene más personas tachadas.' }),
    play('vuela-precios', 'Vuela a lo que se puede afirmar', { rounds: [
      { title: 'Condiciones', items: [
        { ask: '«si llueve, no hay partido» y no llueve', options: ['puede haber partido o no', 'hay partido', 'no hay partido'], answer: 0 },
        { ask: '«X va solo si Y va» y X va', options: ['Y va', 'Y no va', 'no se sabe'], answer: 0 },
        { ask: 'algo pasa en todas las soluciones', options: ['tiene que ser', 'podría ser', 'no puede ser'], answer: 0 },
      ] },
    ] }, 'Un «si… no…» no dice nada cuando no se cumple la condición: si no llueve, puede haber partido o no. «X solo si Y» obliga a Y cuando X está. Y lo que pasa en todas las soluciones es necesario.',
      { hint: 'Fíjate qué dice la regla y en qué caso aplica: fuera de ese caso no obliga nada.' }),
  ]);

  setExam('pu-orden', 'Acertijos de orden y asignación', [
    ['pu-or-1', 'En una fila se ubican primero las pistas firmes y luego las parejas.',
      play('fila-pistas', 'Acomoda la fila', { rounds: [{ names: ['Elio', 'Fina', 'Gabo', 'Hilda'], clues: [at('Gabo', 1, 'Gabo es el segundo'), K('justBefore', 'Hilda', 'Elio', 'Elio va justo después de Hilda'), notAt('Fina', 3, 'Fina no es la última')] }] }, 'Gabo 2.º; Hilda y Elio solo caben en 3.º y 4.º; Fina 1.ª.', { hint: 'Primero el puesto fijo.' })],
    ['pu-or-1', 'Tacha cada caso con la pista que lo contradice.',
      play('descarta-casos', 'Descarta', { rounds: [{ cands: [['A', 'B', 'C'], ['B', 'A', 'C'], ['C', 'A', 'B']], clues: [K('before', 'A', 'C', 'A va antes que C'), notAt('A', 0, 'A no es el primero')] }] }, 'Solo B, A, C cumple.', { hint: 'Una pista basta para tachar.' })],
    ['pu-or-2', 'En una mesa redonda se fija a uno y se ubica a los demás.',
      play('mesa-redonda', 'La mesa', { rounds: [{ names: ['Iris', 'Juan', 'Kira', 'Lalo'], clues: [K('right', 'Iris', 'Kira', 'Kira está justo a la derecha de Iris'), K('opp', 'Kira', 'Lalo', 'Lalo está frente a Kira')] }] }, 'Kira a la derecha de Iris, Lalo frente a Kira y Juan frente a Iris.', { hint: 'Con Iris fija.' })],
    ['pu-or-2', 'En la ronda se cuenta en un sentido y se saca a cada k-ésimo.',
      play('ronda-saltos', 'La ronda', { rounds: [{ n: 9, k: 2 }] }, 'Con 9 y de 2 en 2 queda el 3.', { hint: 'Tacha despacio.' })],
    ['pu-or-3', 'Un solo ✓ por fila y por columna.',
      play('tabla-cruces', 'La tabla', { rounds: [{ rows: ['Ana', 'Bea', 'Cami'], cols: ['bus', 'metro', 'bici'], clues: [{ t: 'not', a: 1, v: 0 }, { t: 'not', a: 1, v: 1 }, { t: 'not', a: 2, v: 0 }] }] }, 'Bea en bici, Cami en metro, Ana en bus.', { hint: 'La fila con un solo hueco.' })],
    ['pu-or-3', 'Las pistas que unen dos listas tachan en las dos.',
      play('casilleros', 'Casilleros', { rounds: [{ people: ['Leo', 'Mía', 'Nel'], names: ['flauta', 'violín', 'tambor'], clues: [at('tambor', 0, 'el tambor es de Leo'), notAt('flauta', 1, 'la flauta no es de Mía')] }] }, 'Leo tambor, Nel flauta, Mía violín.', { hint: 'Lo seguro primero.' })],
    ['pu-or-4', 'Necesario: en todos los casos; posible: en alguno.',
      play('tiene-podria', 'Tiene que o podría', { rounds: [{ names: ['P', 'Q', 'R'], k: 2, rules: [K('either', 'P', 'Q', 'va P o va Q')], claims: [{ t: 'in', a: 'R', say: 'R va' }, { t: 'both', a: 'P', b: 'Q', say: 'P y Q van' }] }] }, 'Casos PQ, PR, QR: R podría, P y Q juntos podrían.', { hint: 'Lista los tres casos.' })],
    ['pu-or-4', '«A solo si B»: si A está, B tiene que estar.',
      play('comite-reglas', 'Comité', { rounds: [{ names: ['U', 'V', 'W', 'X'], k: 2, need: ['U'], rules: [K('onlyIf', 'U', 'W', 'U va solo si W va')] }] }, 'Con U tiene que ir W.', { hint: 'Mira qué exige U.' })],
  ]);
});
