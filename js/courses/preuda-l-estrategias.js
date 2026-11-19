// Preuniversitario · Comprensión lectora · mundo 1 «Estrategias de lectura» con textos de verdad (spec
// 2026-11-19-preuda-lectura-textos). Cada lección trabaja un texto original en 7 juegos distintos; la evaluación usa otro texto
// en el formato real del examen. Textos escritos para Zuka.
PU_LEC_JUEGOS.push(({ setLesson, setExam }) => {
  const RUIDO = {
    id: 'lec-ruido', title: '¿Cuánto ruido aguanta una ciudad?',
    ficha: { autor: 'Equipo de divulgación de una universidad pública', fuente: 'Revista de divulgación científica', fecha: 'Agosto de 2025' },
    paras: [
      'En Medellín, una persona que vive cerca de una avenida principal escucha durante el día un ruido promedio de 75 decibeles, el mismo que produce una aspiradora encendida a un metro de distancia. La diferencia es que la aspiradora se apaga. El tráfico, en cambio, empieza antes del amanecer y termina pasada la medianoche. Por eso los especialistas ya no hablan del ruido como una simple molestia, sino como un problema de salud pública.',
      'El oído humano no tiene párpados: no puede cerrarse para descansar. Mientras dormimos, el cerebro sigue registrando los sonidos y reacciona ante los más fuertes con pequeñas descargas de alerta. La persona no se despierta del todo y a la mañana siguiente no recuerda nada, pero su corazón se aceleró varias veces durante la noche. Repetido durante años, ese sobresalto silencioso se asocia con hipertensión, insomnio y dificultades de concentración.',
      '«El daño no depende solo del volumen, sino de la hora y de la costumbre», explica la ingeniera acústica Natalia Restrepo, que mide el ruido de la ciudad desde hace una década. Según ella, una fiesta ocasional molesta, pero el compresor de una fábrica que funciona todas las noches desgasta. «Uno cree que se acostumbra. En realidad, el cuerpo solo deja de quejarse en voz alta», añade.',
      'Las soluciones conocidas son de dos tipos. Las primeras actúan sobre la fuente: pavimentos que reducen el roce de las llantas, buses eléctricos, horarios para el cargue y descargue de mercancías. Las segundas protegen al que escucha: ventanas de doble vidrio, barreras de árboles y muros, normas que impiden construir viviendas junto a las vías rápidas. Estas últimas son más baratas, pero dejan intacto el problema en la calle.',
      'Hay, además, una desigualdad que pocas veces se menciona. Los barrios con menos recursos suelen estar junto a las autopistas, los talleres y las rutas de carga, y sus casas tienen ventanas sencillas. Quien puede pagar un apartamento en una zona tranquila compra también silencio; quien no puede, duerme con el ruido de los demás.',
      'Restrepo propone empezar por algo sencillo: publicar mapas de ruido de cada barrio, como se publican los de calidad del aire. «Lo que no se mide no se discute», dice. Un mapa no baja ni un decibel, pero convierte una queja que se pierde en el aire en un dato que la ciudad ya no puede ignorar.',
    ],
  };

  const TIENDA = {
    id: 'lec-tienda', title: 'La tienda de la esquina no es nostalgia',
    ficha: { autor: 'Columnista invitada, economista', fuente: 'Columna de opinión de un periódico regional', fecha: 'Febrero de 2026' },
    paras: [
      'Cada vez que cierra una tienda de barrio, alguien escribe una despedida llena de nostalgia: el tendero que fiaba, el olor a panela, la radio encendida. Esos textos son bonitos, pero equivocan el diagnóstico. La tienda de la esquina no merece defenderse por ser un recuerdo, sino porque sigue siendo, para millones de familias, la manera más racional de hacer mercado.',
      'La razón es económica. Una familia que vive del día a día no puede comprar el arroz por arrobas para aprovechar el precio del supermercado; compra lo que alcanza hoy, a veces una libra, a veces media. La tienda vende por unidades pequeñas, abre temprano, queda a dos cuadras y no exige transporte. Lo que parece más caro por gramo resulta más barato cuando se cuenta el bus, el tiempo y el riesgo de quedarse sin plata a mitad de mes.',
      'Además, la tienda presta un servicio que ningún banco ofrece a esas familias: el crédito sin papeles. El cuaderno donde el tendero anota lo que se debe es, en la práctica, un préstamo basado en la confianza. Cuando la tienda cierra, ese préstamo desaparece, y muchos hogares quedan expuestos a prestamistas informales que cobran intereses abusivos.',
      'Quienes celebran el avance de las grandes cadenas responden que los precios bajos benefician a todos. Es cierto que el supermercado baja precios; no es cierto que todos puedan aprovecharlos. Un descuento por comprar doce rollos de papel solo ayuda a quien tiene con qué comprar doce. Tampoco basta con abrir una sucursal en cada barrio: el supermercado no fía, no parte el paquete de lentejas y no espera hasta el viernes.',
      'Por eso, las políticas que buscan modernizar el comercio deberían empezar por preguntar a quién sirve cada forma de vender. Facilitar que las tiendas acepten pagos digitales, se asocien para comprar al por mayor y accedan a crédito formal haría más por los barrios populares que cualquier homenaje, y reconocería a las tiendas como lo que son: parte de la infraestructura del barrio.',
      'La tienda no necesita que la lloren. Necesita que la entiendan.',
    ],
  };

  const VOLCAN = {
    id: 'lec-volcanes', title: 'Los que escuchan a los volcanes',
    ficha: { autor: 'Redacción de ciencia', fuente: 'Sección de ciencia de un diario nacional', fecha: 'Noviembre de 2025' },
    paras: [
      'En noviembre de 1985, una erupción pequeña del volcán Nevado del Ruiz derritió parte de su glaciar. El agua bajó por los ríos mezclada con ceniza, rocas y troncos, y horas después sepultó el pueblo de Armero. Murieron más de veinte mil personas. La tragedia dejó una lección que los científicos repiten desde entonces: el peligro de un volcán no siempre es la lava, y casi nunca llega sin avisar.',
      'Para escuchar esos avisos, el país instaló observatorios en Manizales, Pasto y Popayán. Allí se vigila de forma permanente una veintena de volcanes con instrumentos de tres clases. Los sismómetros registran los pequeños temblores que produce el magma al abrirse paso. Los inclinómetros detectan si la montaña se infla, aunque sea unos milímetros. Y los sensores de gases miden cuánto dióxido de azufre sale por el cráter.',
      'Ningún instrumento, por sí solo, predice una erupción. «Un volcán es como un paciente: un síntoma aislado no dice mucho; lo que importa es que varios cambien al mismo tiempo», explica la vulcanóloga Laura Cifuentes. Si aumentan los temblores, el suelo se deforma y crecen los gases, el riesgo sube. Si solo cambia uno, puede tratarse de una variación normal.',
      'Con esa información, los observatorios asignan a cada volcán un nivel de alerta, con colores que van del verde al rojo. El verde indica actividad estable; el amarillo, cambios que hay que seguir de cerca; el naranja, una erupción probable en días o semanas; el rojo, una erupción en curso o inminente. El color no lo decide un solo científico, sino el equipo que compara todas las mediciones.',
      'Sin embargo, la vigilancia sirve de poco si nadie la escucha. En 1985 hubo señales y mapas de riesgo, pero los avisos no llegaron a tiempo ni con claridad a quienes debían evacuar. Por eso hoy los observatorios dedican tanto esfuerzo a las mediciones como a la comunicación: simulacros en las escuelas, emisoras comunitarias y rutas de evacuación señalizadas.',
      'La ciencia puede anticipar; solo la gente puede salvarse. Entre una y otra, la confianza es el instrumento que ningún observatorio puede instalar por su cuenta.',
    ],
  };

  // ---------------- Lección 1 · Prelectura ----------------
  setLesson('pu-el-1', [
    play('anticipa-texto', 'Antes de leer', { doc: RUIDO, slots: [
      ['Tema', ['el ruido de la ciudad y la salud', 'la historia de Medellín', 'el oído de los animales'], 0],
      ['Propósito', ['explicar un problema con datos', 'contar una anécdota personal', 'vender un producto'], 0],
      ['Tipo de texto', ['divulgativo, que expone', 'cuento, que narra', 'poema, que expresa'], 0],
    ] }, 'El título pregunta por el ruido que aguanta una ciudad; lo firma un equipo universitario y sale en una revista de divulgación científica: se espera un texto que explique un problema con datos.',
      { hint: 'Mira qué anuncia el título y qué clase de publicación es la fuente. Quien escribe también da una pista.' }),
    play('mapa-del-texto', 'El esqueleto del texto', { doc: RUIDO, labels: ['presenta el problema con un dato', 'explica cómo nos afecta', 'trae la voz de una experta', 'clasifica las soluciones', 'señala una desigualdad', 'cierra con una propuesta', 'cuenta una anécdota del autor'], key: [0, 1, 2, 3, 4, 5] },
      'El texto abre con un dato (75 decibeles), explica qué le hace el ruido al cuerpo, cita a la ingeniera Restrepo, divide las soluciones en dos tipos, muestra quiénes sufren más y termina con la propuesta de los mapas. Nadie cuenta una anécdota propia.',
      { hint: 'Para cada párrafo pregúntate qué hace: ¿da un dato, explica, cita a alguien, clasifica, compara o propone?' }),
    play('donde-buscar', '¿A qué párrafo vuelvo?', { doc: RUIDO, cards: [
      ['¿Qué ruido produce una aspiradora?', [1]], ['¿Por qué el ruido afecta aunque no despierte?', [2]], ['¿Qué opina Restrepo de acostumbrarse?', [3]],
      ['¿Qué soluciones protegen al que escucha?', [4]], ['¿Quiénes duermen con más ruido?', [5]], ['¿Qué propone la ingeniera?', [6]],
    ] }, 'Cada pregunta tiene su párrafo: el dato de la aspiradora en el 1, el sueño en el 2, la cita sobre acostumbrarse en el 3, los dos tipos de soluciones en el 4, la desigualdad en el 5 y los mapas en el 6.',
      { hint: 'Usa el esqueleto: cada párrafo trata un asunto. Busca la palabra clave de la pregunta en el texto.' }),
    play('lupa-evidencia', '¿Lo dice o lo pones tú?', { doc: RUIDO, cards: [
      ['En Medellín, quien vive junto a una avenida principal oye de día unos 75 decibeles.', 0],
      ['Mientras dormimos, el cerebro sigue registrando los sonidos.', 0],
      ['Alguien puede estar sufriendo por el ruido aunque no se queje.', 1],
      ['En los barrios pobres el ruido pesa más sobre la salud.', 1],
      ['Los buses eléctricos son más caros que los de diésel.', 2],
      ['Medellín es la ciudad más ruidosa de Colombia.', 2],
    ] }, 'Los dos primeros están en los párrafos 1 y 2. Que el cuerpo sufra sin quejarse se deduce de la cita de Restrepo; que en los barrios pobres pese más se deduce del párrafo 5. Los precios de los buses y la comparación entre ciudades no aparecen.',
      { hint: 'Busca cada afirmación en el texto. Si está, «lo dice»; si sale de juntar lo que dice, «se deduce»; si no hay de dónde sacarla, «no lo dice».' }),
    play('palabra-a-la-medida', 'La palabra en su oración', { doc: RUIDO, rounds: [
      { p: 3, before: 'el compresor de una fábrica que funciona todas las noches ', word: 'desgasta', after: '.', options: ['agota', 'limpia', 'adelgaza', 'enfría'], answer: 0 },
      { p: 4, before: 'pero dejan ', word: 'intacto', after: ' el problema en la calle', options: ['sin cambios', 'resuelto', 'pequeño', 'oculto'], answer: 0 },
      { p: 6, before: 'en un dato que la ciudad ya no puede ', word: 'ignorar', after: '.', options: ['pasar por alto', 'aprender', 'medir', 'castigar'], answer: 0 },
    ] }, 'El compresor de todas las noches agota al cuerpo, no lo limpia ni lo enfría. Proteger al que escucha deja el problema de la calle sin cambios. Y un dato publicado ya no se puede pasar por alto.',
      { hint: 'Lee la oración con cada palabra puesta: la buena dice lo mismo que la original en ese contexto, no en el diccionario.' }),
    play('hilo-referente', '¿A quién apunta?', { doc: RUIDO, rounds: [
      { p: 4, text: 'Las primeras| actúan sobre la fuente: pavimentos que reducen el roce de las llantas, buses eléctricos, horarios para el cargue y descargue de mercancías. |Las segundas| protegen al que escucha: ventanas de doble vidrio, barreras de árboles y muros, normas que impiden construir viviendas junto a las vías rápidas. |Estas últimas| son más baratas', from: 4, answer: 2 },
      { p: 3, text: '«El daño no depende solo del volumen, sino de la hora y de la costumbre», explica |la ingeniera acústica Natalia Restrepo|, que mide |el ruido de la ciudad| desde hace una década. Según |ella|, una fiesta ocasional molesta', from: 5, answer: 1 },
    ] }, '«Estas últimas» son las soluciones nombradas en último lugar: las segundas, las que protegen al que escucha. «Ella» es la ingeniera Natalia Restrepo, la única persona nombrada antes.',
      { hint: 'El párrafo nombra dos grupos de soluciones; «estas últimas» apunta a uno de los dos grupos. «Ella» apunta a una persona en femenino nombrada antes.' }),
    play('termometro-tono', 'El tono de la voz', { doc: RUIDO, rounds: [
      { frag: '«Uno cree que se acostumbra. En realidad, el cuerpo solo deja de quejarse en voz alta».', scale: ['burlón', 'de advertencia', 'nostálgico', 'entusiasta'], answer: 1 },
      { frag: 'Quien puede pagar un apartamento en una zona tranquila compra también silencio; quien no puede, duerme con el ruido de los demás.', scale: ['indiferente', 'alegre', 'crítico', 'nostálgico'], answer: 2 },
    ] }, 'La cita de Restrepo advierte de un daño que no se nota. La oración del párrafo 5 critica una injusticia: el silencio también se compra.',
      { hint: 'Pregúntate qué quiere provocar la frase en quien la lee: ¿risa, alarma, añoranza, rechazo a algo injusto?' }),
  ]);

  // ---------------- Lección 2 · Idea central y mapa del texto ----------------
  setLesson('pu-el-2', [
    play('resume-parrafo', 'Una idea por párrafo', { doc: TIENDA, paras: [1, 2, 3, 4], options: [
      'La tienda debe defenderse por razones prácticas, no sentimentales.',
      'Comprar poco y cerca le sale más barato a quien vive del día a día.',
      'El fiado es un préstamo basado en la confianza.',
      'Los precios bajos del supermercado no benefician a todos por igual.',
      'El tendero de antes fiaba y ponía la radio.',
      'Los supermercados deberían desaparecer de los barrios.',
    ], key: [0, 1, 2, 3] }, 'Cada resumen bueno dice lo que hace todo el párrafo. «El tendero fiaba» es un detalle del párrafo 1 y que los supermercados desaparezcan no lo dice nadie.',
      { hint: 'Un buen resumen no se queda en un detalle ni dice más de lo que dice el párrafo. Pruébalo contra todo el párrafo.' }),
    play('mapa-del-texto', 'Cómo avanza la columna', { doc: TIENDA, labels: ['plantea la tesis', 'da una razón económica', 'agrega otra razón', 'responde a una objeción', 'hace una propuesta', 'remata la tesis', 'narra un recuerdo de la autora'], key: [0, 1, 2, 3, 4, 5] },
      'La columna plantea la tesis (la tienda es racional, no nostálgica), da una razón económica, agrega el fiado («Además»), responde a quienes defienden las cadenas, propone medidas («Por eso») y remata con una frase corta.',
      { hint: 'Los conectores del comienzo de cada párrafo («La razón es», «Además», «Por eso») dicen qué hace cada uno.' }),
    play('balanza-argumento', 'Pesa los argumentos', { doc: TIENDA, thesis: 'La tienda de barrio merece defenderse porque sigue siendo útil para muchas familias.', cards: [
      ['La tienda vende por unidades pequeñas y queda cerca.', 0],
      ['El cuaderno del fiado funciona como un crédito sin papeles.', 0],
      ['Un estudio muestra que las familias del barrio ya hacen todo su mercado en el supermercado.', 1],
      ['Las familias del barrio pagan menos en el supermercado, aun contando el bus y el tiempo.', 1],
      ['El olor a panela recuerda la infancia.', null],
    ] }, 'Las unidades pequeñas y el fiado son las razones de la autora. Si las familias ya no compraran en la tienda, o si el supermercado les saliera más barato aun contando el bus y el tiempo, su utilidad quedaría en duda. El olor a panela es nostalgia: no prueba que la tienda sea útil.',
      { hint: 'La tesis habla de utilidad, no de recuerdos. Pregúntate si cada oración hace más creíble o menos creíble que la tienda sea útil.' }),
    play('conector-bisagra', 'Las bisagras de la columna', { doc: TIENDA, rounds: [
      { a: 'Esos textos son bonitos,', b: 'equivocan el diagnóstico.', options: ['pero', 'por eso', 'porque', 'además'], answer: 0 },
      { a: 'La tienda vende por unidades pequeñas, abre temprano y queda a dos cuadras.', b: 'la tienda presta un servicio que ningún banco ofrece a esas familias: el crédito sin papeles.', options: ['Además,', 'Sin embargo,', 'Por ejemplo,', 'En cambio,'], answer: 0 },
      { a: 'Los precios bajos no los aprovechan todos.', b: 'las políticas deberían preguntar a quién sirve cada forma de vender.', options: ['Por eso,', 'Aunque', 'Es decir,', 'Pero'], answer: 0 },
    ] }, 'Lo bonito y lo equivocado se oponen: contraste. El fiado es una razón más que se suma a la anterior. Y preguntar a quién sirve cada forma de vender es la consecuencia de que no todos aprovechen los precios bajos.',
      { hint: 'Mira qué relación hay entre las dos ideas: ¿se oponen, la segunda se suma, la segunda es resultado de la primera o la aclara?' }),
    play('quien-lo-dice', 'Las voces de la columna', { doc: TIENDA, voices: ['La autora', 'Los defensores de las cadenas', 'Las despedidas nostálgicas'], cards: [
      ['La tienda es la manera más racional de hacer mercado para muchas familias.', 0],
      ['Los precios bajos benefician a todos.', 1],
      ['Lo que se pierde es el tendero que fiaba y la radio encendida.', 2],
      ['Un descuento por cantidad solo ayuda a quien puede comprar la cantidad.', 0],
      ['Hay que facilitar que las tiendas acepten pagos digitales.', 0],
    ] }, 'La autora sostiene la tesis, la respuesta sobre los descuentos y la propuesta. Que los precios bajos benefician a todos es lo que dicen quienes celebran las cadenas. El tendero y la radio son el tema de las despedidas que la autora critica.',
      { hint: 'En una columna aparecen ideas que la autora cita para discutirlas. Fíjate en «Quienes celebran… responden que».' }),
    play('hilo-referente', '¿De qué textos habla?', { doc: TIENDA, rounds: [
      { p: 1, text: 'Cada vez que cierra |una tienda de barrio|, alguien escribe |una despedida llena de nostalgia|: el tendero que fiaba, el olor a panela, la radio encendida. |Esos textos| son bonitos', from: 5, answer: 3 },
    ] }, '«Esos textos» son las despedidas llenas de nostalgia que alguien escribe cuando cierra una tienda.',
      { hint: 'Una expresión con «esos» apunta hacia atrás, a algo ya nombrado en la misma oración. Prueba cuál de los trozos encaja con «textos».' }),
    play('lupa-evidencia', 'Lo que la autora dice y lo que no', { doc: TIENDA, cards: [
      ['La tienda vende por unidades pequeñas.', 0],
      ['Sin el fiado, muchos hogares quedan expuestos a prestamistas informales.', 0],
      ['Para algunas familias, el supermercado sale más caro de lo que parece.', 1],
      ['La autora considera inútiles las despedidas nostálgicas.', 2],
      ['Las tiendas venden más barato que los supermercados.', 2],
    ] }, 'Las dos primeras están en los párrafos 2 y 3. Que el supermercado salga más caro para algunos se deduce del párrafo 2. La autora dice que las despedidas «equivocan el diagnóstico», no que sean inútiles; y nunca dice que la tienda venda más barato, solo que comprar en ella resulta más barato contando el bus y el tiempo.',
      { hint: 'Cuidado con las afirmaciones que exageran lo que dice el texto: compara palabra por palabra con el párrafo.' }),
  ]);

  // ---------------- Lección 3 · Tiempo y preguntas EXCEPTO ----------------
  setLesson('pu-el-3', [
    play('intruso-excepto', 'Pregunta EXCEPTO', { doc: VOLCAN, ask: 'Los observatorios hacen todo lo siguiente, EXCEPTO:', cards: [
      ['Medir los gases que salen del cráter', [2, 3]],
      ['Detectar si la montaña se infla', [2, 3]],
      ['Asignar a cada volcán un nivel de alerta', [4]],
      ['Decidir quiénes deben salir de sus casas', null],
    ] }, 'Medir gases y detectar si la montaña se infla está en el párrafo 2; los niveles de alerta, en el 4. Decidir quién evacúa no aparece: los observatorios comunican y hacen simulacros. Esa es la respuesta.',
      { hint: 'No elijas por intuición: busca cada opción en el texto. La que no encuentre párrafo es la que no está.' }),
    play('donde-buscar', 'Ubica sin releer todo', { doc: VOLCAN, cards: [
      ['¿Qué causó la tragedia de Armero?', [1]], ['¿Dónde están los observatorios?', [2]], ['¿Por qué un solo síntoma no basta?', [3]],
      ['¿Qué significa la alerta naranja?', [4]], ['¿Qué falló en 1985 además del volcán?', [5]],
    ] }, 'Armero está en el párrafo 1; los observatorios y sus instrumentos, en el 2; la comparación con el paciente, en el 3; los colores, en el 4; los avisos que no llegaron, en el 5.',
      { hint: 'Busca la palabra clave de cada pregunta (Armero, observatorios, síntoma, naranja, avisos) y mira en qué párrafo aparece.' }),
    play('lupa-evidencia', 'Lo dice, se deduce o no lo dice', { doc: VOLCAN, cards: [
      ['Los inclinómetros detectan si el volcán se infla.', 0],
      ['En 1985 los avisos existieron, pero no llegaron bien a la gente.', 0],
      ['Lo que destruyó Armero no fue la lava.', 1],
      ['Una alerta roja es más grave que una amarilla.', 1],
      ['Un aumento de temblores siempre anuncia una erupción.', 2],
      ['El Galeras es el volcán más peligroso del país.', 2],
    ] }, 'Los inclinómetros y los avisos de 1985 están escritos tal cual. Que no fue la lava se deduce de cómo se describe el agua con ceniza; que el rojo es más grave, del orden de los colores. Lo de los temblores contradice el párrafo 3 y el Galeras no se menciona.',
      { hint: 'Busca cada afirmación en su párrafo. Si para aceptarla tienes que añadir algo que el texto no dice, no la pongas en «lo dice».' }),
    play('palabra-a-la-medida', 'Vocabulario en contexto', { doc: VOLCAN, rounds: [
      { p: 3, before: 'un síntoma ', word: 'aislado', after: ' no dice mucho', options: ['solo', 'lejano', 'encerrado', 'frío'], answer: 0 },
      { p: 4, before: 'una erupción en curso o ', word: 'inminente', after: '.', options: ['a punto de ocurrir', 'muy grande', 'imposible de ver', 'ya terminada'], answer: 0 },
    ] }, 'Un síntoma aislado es uno solo, sin otros que lo acompañen: la cita lo opone a «varios al mismo tiempo». Inminente es lo que está a punto de pasar, por eso va junto a «en curso».',
      { hint: 'Busca en la misma oración la palabra que se opone o se suma a la subrayada: te dice qué significa ahí.' }),
    play('signos-que-hablan', 'Los signos del texto', { doc: VOLCAN, rounds: [
      { p: 3, text: '|«|Un volcán es como un paciente', options: ['cita las palabras de una experta', 'marca una palabra extranjera', 'muestra ironía del autor', 'anuncia una lista'], answer: 0 },
      { p: 5, text: 'tanto esfuerzo a las mediciones como a la comunicación|:| simulacros en las escuelas', options: ['anuncia ejemplos de lo que acaba de decir', 'cita a alguien', 'cierra el texto', 'introduce una pregunta'], answer: 0 },
      { p: 6, text: 'La ciencia puede anticipar|;| solo la gente puede salvarse', options: ['separa dos ideas que se contrastan', 'anuncia una cita', 'abre una pregunta', 'marca una abreviatura'], answer: 0 },
    ] }, 'Las comillas dan paso a las palabras de la vulcanóloga Cifuentes. Los dos puntos anuncian en qué consiste la comunicación. El punto y coma separa dos ideas que se oponen: lo que hace la ciencia y lo que solo puede hacer la gente.',
      { hint: 'Fíjate qué viene después del signo: ¿palabras de otra persona, una lista de casos, una idea opuesta?' }),
    play('caso-nuevo', 'La idea del paciente, en otros casos', { doc: VOLCAN, principle: 'Un síntoma aislado no basta: lo que importa es que varias señales cambien al mismo tiempo.', cards: [
      ['Un médico no diagnostica una infección por la fiebre sola, sino cuando también suben otros indicadores.', true],
      ['Un meteorólogo anuncia tormenta solo cuando bajan la presión, sube la humedad y cambia el viento.', true],
      ['Un banco bloquea una tarjeta cuando varias compras extrañas ocurren el mismo día en ciudades distintas.', true],
      ['Un profesor reprueba a un estudiante por llegar tarde una vez.', false],
      ['Un conductor frena en cuanto ve una luz roja.', false],
    ] }, 'El médico, el meteorólogo y el banco esperan a que coincidan varias señales, como los vulcanólogos. El profesor decide por un solo hecho, y el conductor reacciona a una sola señal, que en su caso basta.',
      { hint: 'Pregúntate en cada caso si la decisión se toma por una sola señal o porque varias coinciden.' }),
    play('mapa-del-texto', 'El mapa del artículo', { doc: VOLCAN, labels: ['narra un caso que deja una lección', 'describe los instrumentos de vigilancia', 'explica cómo se interpretan las señales', 'explica los niveles de alerta', 'señala un límite de la vigilancia', 'cierra con una conclusión', 'refuta a una experta'], key: [0, 1, 2, 3, 4, 5] },
      'El texto parte de Armero, describe los instrumentos, explica que las señales se leen juntas, presenta los colores de alerta, admite que vigilar no basta si nadie escucha («Sin embargo») y cierra con una frase sobre la confianza. La experta se cita, no se refuta.',
      { hint: 'El párrafo que empieza con «Sin embargo» marca un giro: ¿qué hace frente a lo anterior?' }),
  ]);

  // ---------------- Evaluación: formato real, texto nuevo ----------------
  const BIBLIO = {
    id: 'lec-biblio-movil', title: 'Bibliotecas que salen a la calle',
    paras: [
      'Durante décadas, la biblioteca fue un edificio silencioso al que había que ir. Quien vivía lejos, trabajaba en horario de oficina o no se sentía bienvenido en un lugar tan solemne, simplemente no iba. En los últimos años, varias ciudades colombianas decidieron invertir la pregunta: en lugar de esperar a que los lectores lleguen, llevar la biblioteca adonde ellos están.',
      'Así nacieron las bibliotecas móviles: bicicletas con cajones de libros, lanchas que recorren los ríos del Pacífico, maletas que pasan de una vereda a otra y estantes instalados en estaciones del metro, plazas de mercado y salas de espera de hospitales. Ninguna exige carné ni cobra multa por retrasos; algunas ni siquiera piden devolver el libro, sino pasarlo a otra persona.',
      'Los resultados sorprendieron incluso a sus promotores. En los barrios donde llegó una biblioteca móvil, el préstamo de libros creció más entre los adultos que entre los niños. «Pensábamos que el público serían los estudiantes, y resultó que eran sus papás, que nunca habían tenido tiempo de entrar a una biblioteca», cuenta Óscar Mena, bibliotecario de una de estas iniciativas. En una vereda de Urabá, las señoras que esperaban el bus empezaron pidiendo novelas de amor y libros de recetas, y terminaron pidiendo historia.',
      'No todo es celebración. Los libros se deterioran rápido con la lluvia y el sol, los recorridos dependen de voluntarios que a veces se cansan y los presupuestos cambian con cada gobierno. Además, algunos críticos advierten que la biblioteca móvil corre el riesgo de convertirse en una __vitrina__ para la foto: aparece el día del lanzamiento y desaparece cuando se apagan las cámaras.',
      'Por eso, quienes trabajan en estos proyectos insisten en que la clave no es el vehículo, sino la constancia. Una lancha que pasa cada quince días, siempre el mismo día y a la misma hora, crea lectores; un evento espectacular que no se repite, no. La biblioteca, dicen, no es un edificio ni una bicicleta: es la promesa de volver.',
    ],
  };
  const Q = (q, options, answer, explain, hint) => play('pregunta-examen', 'Pregunta del examen', { doc: BIBLIO, q, options, answer }, explain, { hint, kind: 'Comprensión lectora' });
  setExam('pu-estrategias', 'Evaluación · Estrategias de lectura', [
    ['pu-el-1', 'Antes de leer, el título y la manera de presentar el tema anuncian el tipo de texto.',
      Q('Por su manera de presentar el tema, el texto es principalmente:', ['Narrativo: cuenta la vida de un bibliotecario', 'Expositivo: explica una iniciativa, sus resultados y sus dificultades', 'Instructivo: enseña a fundar una biblioteca', 'Poético: describe la belleza de los libros'], 1,
        'Explica qué son las bibliotecas móviles, qué lograron y qué problemas tienen: es expositivo. Óscar Mena aparece citado, pero no se cuenta su vida.',
        'Fíjate si el texto cuenta una historia, da instrucciones o explica un fenómeno con sus resultados.')],
    ['pu-el-1', 'El propósito se ve en lo que hace todo el texto, no en un párrafo.',
      Q('El propósito principal del texto es:', ['Pedir más presupuesto para las bibliotecas tradicionales', 'Criticar a los gobiernos por no apoyar la lectura', 'Narrar la historia de la lectura en Colombia', 'Mostrar cómo funcionan las bibliotecas móviles y qué las hace durar'], 3,
        'Recorre la idea, los resultados, los problemas y lo que las hace durar (la constancia). Los presupuestos y los gobiernos solo se mencionan como una dificultad.',
        'Descarta las opciones que toman un detalle de un párrafo como si fuera el propósito de todo el texto.')],
    ['pu-el-2', 'Para saber la función de un párrafo, mira qué hace frente al anterior.',
      Q('El párrafo 4 cumple la función de:', ['Presentar los problemas y riesgos de la iniciativa', 'Ofrecer cifras sobre el préstamo de libros', 'Narrar el origen de las bibliotecas móviles', 'Concluir con la idea central del texto'], 0,
        '«No todo es celebración» anuncia el giro: el párrafo enumera el deterioro, la dependencia de voluntarios, los presupuestos y el riesgo de la vitrina.',
        'Lee la primera oración del párrafo: anuncia qué viene después de los buenos resultados.')],
    ['pu-el-2', 'La idea central reúne lo que dicen todos los párrafos, sin quedarse en un detalle.',
      Q('La idea central del texto se resume mejor en:', ['Las bicicletas son el mejor medio para llevar libros', 'Los adultos leen más que los niños', 'Llevar los libros adonde está la gente funciona, si se hace con constancia', 'Las bibliotecas tradicionales deben desaparecer'], 2,
        'El texto presenta la idea de llevar la biblioteca a la gente, sus logros y sus riesgos, y concluye que la clave es la constancia. Lo de los adultos es un resultado; lo de las bicicletas, un ejemplo.',
        'La idea central tiene que valer para el principio y para el final del texto, no solo para un párrafo.')],
    ['pu-el-2', 'Una palabra subrayada se entiende con lo que la rodea en la oración.',
      Q('En el párrafo 4, la palabra subrayada __vitrina__ se refiere a:', ['Un mueble de vidrio para guardar libros', 'Algo que se exhibe para aparentar, más que para servir', 'Un lugar donde se venden libros', 'Una forma de proteger los libros del sol'], 1,
        'Los dos puntos lo explican: la biblioteca aparece el día del lanzamiento y desaparece cuando se apagan las cámaras. Es algo que se muestra para la foto.',
        'Lee lo que viene después de los dos puntos: describe qué quiere decir esa palabra en este caso.')],
    ['pu-el-3', 'En una pregunta EXCEPTO, cada opción se busca en el texto; la que no está es la respuesta.',
      Q('Son rasgos de las bibliotecas móviles mencionados en el párrafo 2, EXCEPTO:', ['No exigen carné', 'No cobran multas por retraso', 'Algunas piden pasar el libro a otra persona', 'Ofrecen conexión a internet gratuita'], 3,
        'El carné, las multas y pasar el libro están en el párrafo 2. El internet no aparece en ninguna parte del texto.',
        'Vuelve al párrafo 2 y marca cada opción que encuentres. Queda una sin marcar.')],
    ['pu-el-3', 'Una opción EXCEPTO puede contradecir el texto en lugar de faltar en él.',
      Q('Según el texto, son dificultades de las bibliotecas móviles, EXCEPTO:', ['El deterioro de los libros', 'La dependencia de voluntarios', 'La falta de lectores adultos', 'Los cambios de presupuesto'], 2,
        'Las otras tres están en el párrafo 4. La falta de adultos contradice el párrafo 3: el préstamo creció más entre los adultos.',
        'Busca las dificultades en el párrafo que empieza con «No todo es celebración» y compara cada opción.')],
    ['pu-el-3', 'Para responder rápido, ubica el párrafo por su palabra clave y vuelve a él.',
      Q('Lo que más sorprendió a los promotores (párrafo 3) fue que:', ['El préstamo creciera más entre los adultos que entre los niños', 'Los niños no quisieran leer', 'Las bibliotecas móviles costaran tanto', 'Los libros se dañaran con la lluvia'], 0,
        'El párrafo 3 dice que el préstamo creció más entre los adultos y lo confirma la cita de Mena. Que los libros se dañen está en el párrafo 4 y no se presenta como sorpresa.',
        'Ubica el párrafo que habla de los resultados y lee qué fue lo inesperado.')],
  ]);
});
