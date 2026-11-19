// Preuniversitario · Comprensión lectora · mundo 2 «Tipos de texto y géneros» con textos de verdad (spec
// 2026-11-19-preuda-lectura-textos): una crónica que mezcla tipologías, una entrevista y un testimonio; la evaluación usa una
// columna de opinión con una voz citada. Textos escritos para Zuka.
PU_LEC_JUEGOS.push(({ setLesson, setExam }) => {
  const RIO = {
    id: 'lec-rio-garzas', title: 'El río que volvió a tener garzas',
    ficha: { autor: 'Crónica de un periodista regional', fuente: 'Revista dominical de un periódico de Antioquia', fecha: 'Julio de 2025' },
    paras: [
      'Una mañana de 1998, los pescadores de la vereda La Clara encontraron el río cubierto de peces muertos. Venían flotando de lado, con los ojos blancos, desde más arriba de la curva donde las mujeres lavaban la ropa. Nadie supo explicar qué había pasado, y durante años el agua siguió bajando turbia y con un olor dulzón que se pegaba a la piel.',
      'Hoy, en el mismo tramo, el agua corre clara sobre piedras redondas y verdosas. Las garzas blancas se paran en una pata entre los juncos, los niños se lanzan desde una roca plana que llaman «el trampolín» y, al atardecer, el río suena como una conversación que nadie interrumpe. En la orilla crecen otra vez los guaduales que el agua sucia había secado.',
      'El cambio tiene una explicación técnica. Las aguas de las fincas porcícolas y del pueblo, que antes caían directamente al río, ahora pasan por una planta de tratamiento. Allí, primero se separan los sólidos; después, unas bacterias se alimentan de la materia orgánica disuelta, y al final el agua reposa en lagunas donde el sol termina de limpiarla. El proceso no deja el agua potable, pero sí le devuelve el oxígeno que necesitan los peces.',
      'Ofelia Zapata, que lavó ropa en esa orilla durante cuarenta años, recuerda el día en que volvió a ver una sabaleta. «La saqué con la mano y la devolví enseguida. Me dio pena con ella, como si hubiera vuelto de un viaje largo», cuenta, y se ríe. Dice que ahora sus nietos se bañan donde antes ella no dejaba meter ni los pies a nadie.',
      'Sin embargo, la recuperación es frágil. La planta funciona con un presupuesto que se discute cada año y que ya fue recortado dos veces. Bastaría una temporada sin mantenimiento para volver a 1998. Si el municipio quiere que el río siga teniendo garzas, debería tratar la planta como lo que es: una obra tan necesaria como un puente o una escuela, y no un gasto que se puede aplazar.',
    ],
  };

  const LUTIER = {
    id: 'lec-lutier', title: '«Una guitarra se demora un año»',
    ficha: { autor: 'Sección de cultura', fuente: 'Entrevista publicada en un periódico de Medellín', fecha: 'Marzo de 2026' },
    paras: [
      'En un taller del barrio Belén, entre virutas de cedro y frascos de cola, Humberto Gil fabrica guitarras desde hace treinta y cinco años. Aprendió el oficio de su padre, que a su vez lo aprendió de un lutier español que llegó a Medellín en los años cincuenta. Hablamos con él mientras lijaba la tapa de una guitarra que, dice, estará lista en diciembre. Tiene las manos llenas de cicatrices pequeñas y habla despacio, como si cada palabra también tuviera que secarse antes de usarla.',
      '—¿Por qué tarda tanto una guitarra? —Porque la madera manda. Antes de cortarla hay que dejarla secar al menos cinco años; si uno la apura, se tuerce con el primer aguacero. Después vienen meses de armar, pegar y esperar. Además, cada pieza se ajusta a mano: la tapa se lija hasta que, al golpearla con el nudillo, suena como una campana pequeña. Una guitarra de fábrica se hace en una tarde; una de taller, en un año. La diferencia se oye.',
      '—¿Se oye de verdad, o es romanticismo? —Las dos cosas. Hay una parte que se puede medir: una tapa bien trabajada vibra de manera más pareja. Y hay otra parte que no: el músico que sabe que su instrumento lo hizo una persona lo toca distinto, lo cuida distinto. Lo he visto mil veces: un muchacho toca la misma pieza en dos guitarras y en una se queda más tiempo. Eso también suena.',
      '—¿Hay jóvenes interesados en el oficio? —Pocos, y los entiendo. Esto no da para hacerse rico, y aprender bien toma diez años. Pero cada tanto llega un muchacho que se queda mirando cómo curvo un aro con calor y yo ya sé que va a volver. A ese no hay que convencerlo: hay que enseñarle.',
      '—¿Qué le pediría al público? —Que vengan a los talleres antes de comprar. Que toquen, que pregunten. No pido que compren caro; pido que sepan lo que compran. Una guitarra barata no es un pecado, pero una guitarra sin historia es una oportunidad perdida.',
    ],
  };

  const ROSALBA = {
    id: 'lec-leer-cincuenta', title: 'Aprendí a leer a los cincuenta',
    ficha: { autor: 'Testimonio de Rosalba Mena, recogido por un programa de alfabetización', fuente: 'Libro de testimonios de una biblioteca pública', fecha: '2024' },
    paras: [
      'Yo me crié en una finca de Caldas donde la escuela quedaba a dos horas de camino. Mi papá decía que para coger café no había que saber leer, y tenía razón: aprendí a coger café antes de aprender a escribir mi nombre. A los nueve años ya trabajaba como una persona grande, y la escuela se quedó en un camino que nunca volví a caminar.',
      'Lo peor no era no saber leer, sino esconderlo. En el banco decía que se me habían quedado las gafas; en el puesto de salud le pasaba los papeles a mi hija para que me los leyera «porque tengo la letra pequeña». Uno se vuelve experto en disimular. Hasta los buses los reconocía por el color, no por el letrero. Uno vive con el miedo de que alguien le pida firmar.',
      'Un día mi nieto me pidió que le leyera un cuento. Tenía cinco años y me trajo el libro con mucha ceremonia. Yo le inventé la historia mirando los dibujos, y él, que ya conocía el cuento, me dijo: «Abuela, eso no dice ahí». No me dio rabia con él; me dio vergüenza conmigo. Esa noche no pude dormir pensando en todos los cuentos que me había inventado.',
      'Esa misma semana me inscribí en las clases de la biblioteca. Éramos once, casi todas mujeres, casi todas mayores de cuarenta. La profesora tenía la edad de mi hija y nunca nos trató como niñas. Cada noche repasaba en la cocina, en un cuaderno que escondía detrás de la licuadora. Lo más difícil no fueron las letras, sino quitarse el miedo de equivocarse delante de otros.',
      'Ahora leo despacio, pero leo. Leo los letreros de los buses, los recibos, las cajas de los remedios. Y los domingos le leo cuentos a mi nieto, de verdad, con el dedo debajo de cada palabra. Él me corrige cuando me trabo, y yo lo dejo, porque así fue como aprendimos los dos. Tengo cincuenta y tres años y apenas estoy empezando a leer el mundo.',
    ],
  };

  // ---------------- Lección 1 · Tipologías ----------------
  setLesson('pu-tt-1', [
    play('mapa-del-texto', 'Una crónica, varias tipologías', { doc: RIO, labels: ['narra un hecho del pasado', 'describe el río de hoy', 'explica cómo funciona algo', 'narra con la voz de una testigo', 'argumenta una postura', 'presenta estadísticas'], key: [0, 1, 2, 3, 4] },
      'La crónica cambia de tipología en cada párrafo: narra 1998, describe el río actual, explica la planta, cuenta lo que vivió Ofelia y termina defendiendo una postura («debería tratar la planta…»). No hay estadísticas.',
      { hint: 'Busca las pistas de cada tipología: verbos en pasado (narra), adjetivos y sensaciones (describe), pasos de un proceso (explica), «debería» (argumenta).' }),
    play('termometro-tono', 'El tono cambia con la tipología', { doc: RIO, rounds: [
      { frag: 'Venían flotando de lado, con los ojos blancos, desde más arriba de la curva donde las mujeres lavaban la ropa.', scale: ['sombrío', 'festivo', 'irónico', 'técnico'], answer: 0 },
      { frag: 'Allí, primero se separan los sólidos; después, unas bacterias se alimentan de la materia orgánica disuelta.', scale: ['sombrío', 'festivo', 'irónico', 'técnico'], answer: 3 },
      { frag: 'Al atardecer, el río suena como una conversación que nadie interrumpe.', scale: ['sereno', 'alarmado', 'técnico', 'burlón'], answer: 0 },
    ] }, 'Los peces muertos se cuentan con un tono sombrío; la planta, con lenguaje técnico de pasos; el río de hoy, con una imagen serena.',
      { hint: 'Pregúntate qué siente quien lee cada fragmento: ¿pesar, calma, risa? ¿O solo recibe información precisa?' }),
    play('lupa-evidencia', 'Lo que cuenta la crónica', { doc: RIO, cards: [
      ['En 1998 aparecieron peces muertos en el río.', 0],
      ['El presupuesto de la planta ya fue recortado.', 0],
      ['La contaminación venía en parte de las fincas y del pueblo.', 1],
      ['Hacía años que no se veían sabaletas en ese tramo del río.', 1],
      ['La planta deja el agua lista para beber.', 2],
      ['Las garzas son la especie más abundante del río.', 2],
    ] }, 'Los peces muertos y el recorte están escritos. Que la contaminación venía de las fincas se deduce de que sus aguas «antes caían directamente al río»; que las sabaletas llevaban años sin verse, de que Ofelia «volvió a ver» una «como si hubiera vuelto de un viaje largo». El texto dice que el agua no queda potable, y no compara especies.',
      { hint: 'Ojo con la opción que dice lo contrario de lo que está escrito: eso también es «no lo dice».' }),
    play('conector-bisagra', 'Las bisagras de la crónica', { doc: RIO, rounds: [
      { a: 'Hoy el río tiene garzas otra vez.', b: 'la recuperación es frágil.', options: ['Sin embargo,', 'Por eso,', 'Además,', 'Es decir,'], answer: 0 },
      { a: 'Primero se separan los sólidos;', b: 'unas bacterias se alimentan de la materia orgánica disuelta.', options: ['después,', 'sin embargo,', 'por ejemplo,', 'en cambio,'], answer: 0 },
      { a: 'La planta funciona con un presupuesto que ya fue recortado dos veces.', b: 'el río podría volver a estar como en 1998.', options: ['Por eso,', 'Además,', 'Aunque', 'Por ejemplo,'], answer: 0 },
    ] }, 'Lo bueno de hoy se opone a su fragilidad (contraste). Los pasos de la planta van en orden en el tiempo. Y el riesgo de volver a 1998 es la consecuencia de los recortes.',
      { hint: 'Mira qué pasa entre las dos ideas: ¿se oponen, una sigue a la otra en el tiempo o una es resultado de la otra?' }),
    play('caso-nuevo', 'La lección del río, en otros casos', { doc: RIO, principle: 'Una mejora que depende de un gasto permanente puede perderse si ese gasto se recorta.', cards: [
      ['Un parque que se llena de basura cuando se suspende el contrato de aseo.', true],
      ['Un colegio que pierde su biblioteca cuando dejan de pagarle al bibliotecario.', true],
      ['Un acueducto veredal que vuelve a fallar cuando se deja de pagar al fontanero.', true],
      ['Un puente de piedra que sigue en pie siglos después, sin mantenimiento.', false],
      ['Una persona que aprende a nadar y no lo olvida.', false],
    ] }, 'El parque, la biblioteca y el acueducto mantienen su beneficio solo mientras se sostiene un gasto o un esfuerzo. El puente de piedra y saber nadar no dependen de algo que haya que pagar cada año.',
      { hint: 'Pregúntate si el beneficio se pierde cuando deja de pagarse o de hacerse algo periódicamente.' }),
    play('palabra-a-la-medida', 'Las palabras del párrafo 5', { doc: RIO, rounds: [
      { p: 5, before: 'Sin embargo, la recuperación es ', word: 'frágil', after: '.', options: ['delicada', 'rápida', 'completa', 'costosa'], answer: 0 },
      { p: 5, before: 'y no un gasto que se puede ', word: 'aplazar', after: '.', options: ['dejar para después', 'eliminar', 'duplicar', 'discutir'], answer: 0 },
    ] }, 'La recuperación es delicada: bastaría una temporada sin mantenimiento para perderla. Y aplazar es dejar para después, no eliminar.',
      { hint: 'El resto del párrafo 5 explica el sentido: lee qué pasaría si se descuida la planta.' }),
    play('donde-buscar', '¿En qué párrafo está?', { doc: RIO, cards: [
      ['¿Qué pasó en 1998?', [1]], ['¿Cómo se ve hoy el río?', [2]], ['¿Cómo limpia la planta el agua?', [3]],
      ['¿Qué sintió Ofelia con la sabaleta?', [4]], ['¿Por qué la recuperación está en riesgo?', [5]],
    ] }, 'Cada pregunta corresponde a una tipología del texto: el hecho de 1998 (narración), el río de hoy (descripción), la planta (explicación), Ofelia (testimonio) y el riesgo (argumentación).',
      { hint: 'Ubica la palabra clave de cada pregunta: 1998, hoy, planta, sabaleta, presupuesto.' }),
  ]);

  // ---------------- Lección 2 · Géneros del examen ----------------
  setLesson('pu-tt-2', [
    play('anticipa-texto', 'Antes de leer: ¿qué género es?', { doc: LUTIER, slots: [
      ['Género', ['entrevista', 'cuento', 'informe técnico'], 0],
      ['Voces', ['un periodista y un lutier', 'un solo narrador', 'varios científicos'], 0],
      ['Propósito', ['dar a conocer un oficio y su mirada', 'vender guitarras', 'enseñar a tocar guitarra'], 0],
    ] }, 'El título va entre comillas (es una frase del entrevistado), la fuente dice «Entrevista» y la sección es de cultura: se espera un periodista que pregunta y un lutier que responde sobre su oficio.',
      { hint: 'Fíjate en las comillas del título y en lo que dice la fuente.' }),
    play('quien-lo-dice', 'Dos voces', { doc: LUTIER, voices: ['El periodista', 'Humberto Gil'], cards: [
      ['Gil fabrica guitarras desde hace treinta y cinco años.', 0],
      ['¿Hay jóvenes interesados en el oficio?', 0],
      ['La madera debe secarse al menos cinco años.', 1],
      ['El oficio no da para hacerse rico.', 1],
      ['Una guitarra sin historia es una oportunidad perdida.', 1],
    ] }, 'El periodista presenta al lutier en el párrafo 1 y hace las preguntas. Todo lo que va después de la segunda raya de cada párrafo es respuesta de Gil.',
      { hint: 'En una entrevista, la presentación y las preguntas son del periodista; las respuestas, del entrevistado.' }),
    play('signos-que-hablan', 'Los signos de la entrevista', { doc: LUTIER, rounds: [
      { p: 2, text: '|—|¿Por qué tarda tanto una guitarra?', options: ['marca el turno de quien habla', 'encierra un comentario', 'anuncia una lista', 'indica ironía'], answer: 0 },
      { p: 3, text: 'Y hay otra parte que no|:| el músico que sabe', options: ['anuncia la explicación de lo que acaba de decir', 'cita a otra persona', 'marca una pregunta', 'separa dos palabras extranjeras'], answer: 0 },
      { p: 5, text: '—¿Qué le pediría al público|?| —Que vengan', options: ['cierra la pregunta del entrevistador', 'marca una exclamación de sorpresa', 'cierra una cita', 'anuncia un ejemplo'], answer: 0 },
    ] }, 'La raya de diálogo marca quién toma la palabra. Los dos puntos anuncian en qué consiste esa «otra parte». El signo de interrogación cierra la pregunta del periodista; enseguida empieza la respuesta.',
      { hint: 'Mira qué viene después de cada signo: ¿alguien que habla, una explicación, una respuesta?' }),
    play('lupa-evidencia', 'Lo que dice el lutier', { doc: LUTIER, cards: [
      ['El padre de Gil le enseñó el oficio.', 0],
      ['Gil reconoce que su oficio no es muy rentable.', 0],
      ['Gil sabe distinguir a los jóvenes que tienen vocación.', 1],
      ['Gil cree que el sonido depende solo de la madera.', 2],
      ['Las guitarras de fábrica suenan mal.', 2],
    ] }, 'El padre y la poca rentabilidad están dichos. Que distingue la vocación se deduce de «yo ya sé que va a volver». Gil dice que también cuenta la relación del músico con el instrumento, y no dice que las de fábrica suenen mal: dice que «la diferencia se oye» y que una guitarra barata «no es un pecado».',
      { hint: 'Compara cada afirmación con las palabras exactas de Gil. Una afirmación que exagera lo que él dijo no está en el texto.' }),
    play('termometro-tono', 'Cómo habla el lutier', { doc: LUTIER, rounds: [
      { frag: 'A ese no hay que convencerlo: hay que enseñarle.', scale: ['apasionado', 'burlón', 'indiferente', 'amargado'], answer: 0 },
      { frag: 'Una guitarra barata no es un pecado, pero una guitarra sin historia es una oportunidad perdida.', scale: ['reflexivo', 'agresivo', 'burlón', 'técnico'], answer: 0 },
    ] }, 'Cuando habla del muchacho con vocación, Gil habla con pasión por su oficio. En el cierre no ataca a quien compra barato: reflexiona sobre lo que se pierde.',
      { hint: 'Fíjate si el hablante ataca, se ríe, se queja o comparte una convicción.' }),
    play('hilo-referente', '¿A qué se refiere?', { doc: LUTIER, rounds: [
      { p: 4, text: 'Pero cada tanto llega |un muchacho| que se queda mirando cómo curvo |un aro| con calor y yo ya sé que va a volver. A |ese| no hay que convencerlo', from: 5, answer: 1 },
      { p: 2, text: '—Porque |la madera| manda. Antes de |cortarla| hay que dejarla secar al menos |cinco años|', from: 3, answer: 1 },
    ] }, '«Ese» es el muchacho que se queda mirando y va a volver. El «la» de «cortarla» es la madera, que manda en los tiempos del oficio.',
      { hint: 'Busca antes de la expresión un nombre que concuerde: una persona en masculino; algo en femenino que se corta.' }),
    play('resume-parrafo', 'Cada respuesta en una frase', { doc: LUTIER, paras: [2, 3, 4, 5], options: [
      'La calidad exige tiempo: secar, armar y ajustar a mano.',
      'El sonido mejora por razones medibles y por la relación del músico con su instrumento.',
      'Pocos jóvenes llegan, pero a los que tienen vocación hay que enseñarles.',
      'El público debería saber lo que compra.',
      'Las guitarras de fábrica deberían prohibirse.',
      'El padre de Gil aprendió de un lutier español.',
    ], key: [0, 1, 2, 3] }, 'Cada resumen bueno recoge toda la respuesta. Nadie pide prohibir las guitarras de fábrica, y lo del lutier español es un detalle de la presentación.',
      { hint: 'Lee cada respuesta completa y busca la frase que la resume sin añadir nada.' }),
  ]);

  // ---------------- Lección 3 · Estructura y testimonio ----------------
  setLesson('pu-tt-3', [
    play('mapa-del-texto', 'La estructura del testimonio', { doc: ROSALBA, labels: ['cuenta por qué no estudió', 'describe cómo lo ocultaba', 'narra el hecho que la hizo cambiar', 'cuenta cómo aprendió', 'muestra el resultado', 'presenta datos sobre analfabetismo'], key: [0, 1, 2, 3, 4] },
      'El testimonio avanza en el tiempo: la infancia sin escuela, los años de disimular, la escena con el nieto, las clases y lo que hoy puede hacer. No trae cifras: habla una sola persona de su vida.',
      { hint: 'Un testimonio suele contar un antes, un momento de cambio y un después. Ubica cada parte.' }),
    play('lupa-evidencia', 'Lo que cuenta Rosalba', { doc: ROSALBA, cards: [
      ['Rosalba trabajaba desde niña.', 0],
      ['En la clase había once personas.', 0],
      ['Rosalba ponía excusas para que no la descubrieran.', 1],
      ['La profesora era muy estricta.', 2],
      ['Rosalba aprendió a leer en menos de un mes.', 2],
    ] }, 'Que trabajaba de niña y que eran once está escrito. Las gafas olvidadas y la «letra pequeña» eran excusas: se deduce. Del carácter de la profesora solo se sabe que no las trató como niñas, y el texto no dice cuánto tardó en aprender.',
      { hint: 'Una afirmación sobre cuánto tiempo pasó o sobre cómo era alguien necesita respaldo en el texto. Búscalo.' }),
    play('termometro-tono', 'Lo que siente quien habla', { doc: ROSALBA, rounds: [
      { frag: '«Abuela, eso no dice ahí». No me dio rabia con él; me dio vergüenza conmigo. Esa noche no pude dormir pensando en todos los cuentos que me había inventado.', scale: ['autocrítico', 'furioso', 'burlón', 'indiferente'], answer: 0 },
      { frag: 'Ahora leo despacio, pero leo.', scale: ['orgulloso', 'resignado', 'irónico', 'temeroso'], answer: 0 },
    ] }, 'Rosalba no se enoja con el niño: se juzga a sí misma. Y «despacio, pero leo» dice con orgullo lo que logró.',
      { hint: 'En un testimonio el tono lo da cómo se siente quien habla frente a lo que cuenta.' }),
    play('hilo-referente', '¿Quién conocía el cuento?', { doc: ROSALBA, rounds: [
      { p: 3, text: 'Un día |mi nieto| me pidió que le leyera |un cuento|. Tenía cinco años y me trajo |el libro| con mucha ceremonia. Yo le inventé la historia mirando los dibujos, y |él|, que ya conocía el cuento', from: 7, answer: 1 },
    ] }, '«Él» es el nieto: es quien ya conocía el cuento y corrige a la abuela.',
      { hint: 'Pregúntate quién, en esa escena, podía saber lo que de verdad decía el libro.' }),
    play('donde-buscar', 'Vuelve al párrafo', { doc: ROSALBA, cards: [
      ['¿Dónde estaba la escuela?', [1]], ['¿Qué excusas usaba en el banco?', [2]], ['¿Qué la decidió a estudiar?', [3]],
      ['¿Qué fue lo más difícil de aprender?', [4]], ['¿Qué lee ahora?', [5]],
    ] }, 'El testimonio va en orden: la finca y la escuela lejana (1), las excusas (2), la escena con el nieto (3), las clases (4) y lo que lee hoy (5).',
      { hint: 'Como el relato sigue el tiempo, piensa en qué momento de la vida de Rosalba ocurre cada cosa.' }),
    play('palabra-a-la-medida', 'Palabras del testimonio', { doc: ROSALBA, rounds: [
      { p: 2, before: 'Uno se vuelve experto en ', word: 'disimular', after: '.', options: ['ocultar', 'imitar', 'mentir sobre la salud', 'olvidar'], answer: 0 },
      { p: 3, before: 'me trajo el libro con mucha ', word: 'ceremonia', after: '.', options: ['solemnidad', 'prisa', 'tristeza', 'rabia'], answer: 0 },
    ] }, 'Disimular es ocultar lo que no se quiere mostrar, como hacía Rosalba con las excusas. Y el niño trae el libro con solemnidad, como si fuera algo importante.',
      { hint: 'Lee lo que rodea cada palabra: qué hacía Rosalba en el banco y cómo un niño de cinco años entrega un libro que le importa.' }),
    play('caso-nuevo', 'El miedo de aprender de grande', { doc: ROSALBA, principle: 'Lo más difícil de aprender siendo adulto no es el contenido, sino perder el miedo a equivocarse delante de otros.', cards: [
      ['Un señor de sesenta años que no se atreve a hablar inglés en clase por temor a la burla.', true],
      ['Una mujer que deja la clase de natación por vergüenza de que la vean chapotear.', true],
      ['Un niño que no entiende las fracciones porque nadie se las explicó.', false],
      ['Un adulto que abandona un curso de cocina porque se mudó de ciudad.', false],
    ] }, 'El señor y la mujer tropiezan con el miedo a equivocarse en público, como Rosalba. El niño no es adulto y su problema es la falta de explicación; el que se muda deja el curso por otra razón.',
      { hint: 'Pregúntate si en cada caso el obstáculo es el miedo a equivocarse frente a otros.' }),
  ]);

  // ---------------- Evaluación: formato real, texto nuevo ----------------
  const CHIVA = {
    id: 'lec-chivas', title: 'Las chivas no son museo',
    paras: [
      'Quien haya viajado en chiva conoce la escena: la escalera de madera pintada de rojo, amarillo y azul, el techo cargado de bultos y gallinas, la música a todo volumen y el conductor que saluda a medio pueblo por el camino. Para el turista es una postal. Para miles de campesinos de Antioquia y del Eje Cafetero, sigue siendo la única manera de sacar la cosecha y de llegar al médico.',
      'Por eso me inquieta que algunas alcaldías hayan empezado a retirar las chivas de las rutas veredales para reemplazarlas por busetas cerradas, más modernas y, dicen, más seguras. Nadie discute que la seguridad importa. Lo que se discute es si una buseta que no sube por trochas, que no lleva carga y que cobra el doble resuelve el problema del campesino o simplemente lo cambia de lugar.',
      'Le pregunté a don Arcesio Ríos, que maneja una chiva entre Jardín y la vereda La Linda desde hace veintidós años, qué pensaba de la medida. «A mí me pueden quitar la chiva», me dijo, «pero a la gente no le pueden quitar la loma. La buseta llega hasta donde se acaba el pavimento, y de ahí para arriba, ¿quién sube el café?».',
      'La solución no está en convertir las chivas en piezas de museo ni en dejarlas como están. Está en exigirles frenos revisados, cinturones en las bancas y conductores capacitados, y en subsidiar su renovación, como se hace con los buses urbanos. Una chiva segura es posible; una vereda sin transporte, en cambio, es un abandono.',
      'Las postales sirven para recordar. Las chivas, todavía, sirven para vivir.',
    ],
  };
  const Q = (q, options, answer, explain, hint) => play('pregunta-examen', 'Pregunta del examen', { doc: CHIVA, q, options, answer }, explain, { hint, kind: 'Comprensión lectora' });
  setExam('pu-tipos', 'Evaluación · Tipos de texto y géneros', [
    ['pu-tt-1', 'La tipología que predomina es la que organiza todo el texto, aunque haya partes de otras.',
      Q('La tipología que predomina en el texto es:', ['Narrativa, porque cuenta una historia de viajes', 'Descriptiva, porque pinta una chiva', 'Argumentativa, porque defiende una postura sobre una medida', 'Instructiva, porque enseña a manejar una chiva'], 2,
        'El texto describe y cita, pero todo está al servicio de una postura: retirar las chivas no resuelve el problema y la solución es hacerlas seguras.',
        'Pregúntate para qué está cada parte del texto: ¿para contar, para mostrar o para convencer de algo?')],
    ['pu-tt-1', 'Un párrafo puede tener una tipología distinta de la del texto completo.',
      Q('El párrafo 1 es principalmente:', ['Descriptivo: presenta la escena de la chiva y para qué sirve', 'Argumentativo: plantea la tesis del autor', 'Expositivo: da cifras de pasajeros', 'Narrativo: cuenta la historia de don Arcesio'], 0,
        'Pinta la escalera, los colores, el techo cargado y la música, y dice para qué la usan los campesinos. La postura llega en el párrafo 2; don Arcesio, en el 3.',
        'Fíjate en las palabras del párrafo: ¿son colores, objetos y sensaciones, o razones y propuestas?')],
    ['pu-tt-1', 'El cierre de un texto suele retomar una imagen del comienzo.',
      Q('Con la oración final, «Las postales sirven para recordar. Las chivas, todavía, sirven para vivir», el autor:', ['Introduce un tema nuevo', 'Retoma la imagen de la postal del párrafo 1 para cerrar su argumento', 'Contradice lo dicho en el párrafo 4', 'Cita a don Arcesio'], 1,
        'En el párrafo 1 la chiva es «una postal» para el turista; el cierre vuelve a esa palabra para oponerla al uso real que le dan los campesinos.',
        'Relee el primer párrafo: ¿qué imagen de la chiva aparecía allí y qué hace el autor con ella al final?')],
    ['pu-tt-2', 'El género se reconoce por quién habla, para qué y con qué marcas (primera persona, postura, firma).',
      Q('Por su forma y su propósito, el texto es:', ['Un cuento', 'Una columna de opinión', 'Un informe técnico', 'Una entrevista'], 1,
        'Un autor en primera persona («me inquieta», «le pregunté») toma postura sobre un tema de actualidad y propone una solución. Incluye una cita de don Arcesio, pero no es una entrevista: no hay preguntas y respuestas.',
        'Tener una cita no convierte el texto en entrevista. Fíjate si el autor da su opinión.')],
    ['pu-tt-2', 'Una cita de alguien que vive el problema suele respaldar la postura del autor.',
      Q('La cita de don Arcesio (párrafo 3) cumple la función de:', ['Contradecir la tesis del autor', 'Introducir un tema nuevo que no se desarrolla', 'Demostrar con cifras que las busetas son inseguras', 'Aportar la voz de alguien que vive el problema y respaldar la postura del autor'], 3,
        'Don Arcesio dice lo mismo que el autor desde su experiencia: la buseta no sube por la loma ni lleva el café.',
        'Compara lo que dice don Arcesio con lo que piensa el autor en el párrafo 2.')],
    ['pu-tt-3', 'En una pregunta EXCEPTO, cada opción se busca en el párrafo; la que no está es la respuesta.',
      Q('Según el párrafo 2, son razones por las que la buseta podría no resolver el problema del campesino, EXCEPTO:', ['No sube por trochas', 'No lleva carga', 'Cobra el doble', 'No tiene cinturones'], 3,
        'Las trochas, la carga y el precio están en el párrafo 2. Los cinturones aparecen en el párrafo 4, y como algo que se les debe exigir a las chivas.',
        'Vuelve al párrafo 2 y marca cada razón que encuentres.')],
    ['pu-tt-3', 'La estructura es el orden de las partes: qué hace cada párrafo, uno tras otro.',
      Q('La estructura del texto puede resumirse así:', ['Pregunta, respuesta, pregunta, respuesta', 'Hecho, causas, consecuencias y datos', 'Situación, problema, testimonio, propuesta y cierre', 'Definición, clasificación y ejemplos'], 2,
        'Párrafo 1: la situación (la chiva y su uso); 2: el problema (las busetas); 3: el testimonio de don Arcesio; 4: la propuesta; 5: el cierre.',
        'Nombra lo que hace cada párrafo y compara la lista con las opciones.')],
    ['pu-tt-3', 'Una pregunta retórica no espera respuesta: sirve para señalar algo.',
      Q('En la frase de don Arcesio «de ahí para arriba, ¿quién sube el café?», la pregunta funciona como:', ['Una pregunta retórica que señala un problema', 'Una duda que don Arcesio no sabe responder', 'Una pregunta dirigida al lector para que la conteste', 'Una crítica a los cultivadores de café'], 0,
        'Don Arcesio no espera una respuesta: con la pregunta muestra que, sin chiva, nadie subiría el café por la loma.',
        'Pregúntate si quien hace la pregunta espera que alguien le conteste.')],
  ]);
});
