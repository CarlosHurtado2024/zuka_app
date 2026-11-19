// preUDA · Componente 2: Comprensión lectora (spec 2026-11-18-curso-preuda). Un mundo por tema del temario, en orden
// de prioridad. Los fragmentos son textos breves originales (el temario pide textos originales o de dominio público y
// revisión docente antes de publicar). El juego principal es subraya-texto: la respuesta está en el texto y hay que
// encontrarla. Usa las ayudas PU_* de preuda-razonamiento.js.

const PU_LECTURA = [
  // ---------------- 17 · Estrategias de lectura ----------------
  { world: 'pu-estrategias', title: 'Estrategias de lectura', block: 'lectura', lessons: [
    PU_L('pu-el-1', 'Prelectura', [
      sc(6, 'Antes de leer el texto se leen sus bordes: **título, autor, fuente y fecha**. Ahí se anuncian el tema y el propósito.', { title: 'Leer los bordes' }),
      sc(7, 'Un texto titulado «Leer en pantalla: lo que dice la evidencia», de una revista de divulgación de 2025, va a explicar con datos, no a contar una historia.', { title: 'Anticipar' }),
      sc(6, 'La fuente dice mucho: una columna de opinión defiende una postura; un informe técnico describe; un testimonio cuenta lo vivido.', { title: 'La fuente orienta' }),
    ], [
      PU_SUB('Lee la ficha del texto antes de leerlo', [
        { text: 'Título: «El celular en el aula: prohibir no basta»|Autora: profesora de un colegio público de Medellín|Fuente: columna de opinión de un periódico regional|Fecha: marzo de 2026', ask: 'Toca los datos que anuncian que el texto defenderá una postura', answer: [0, 2] },
      ], 'El título ya toma partido («prohibir no basta») y una columna de opinión es un género para defender posturas. Autora y fecha no dicen si habrá postura.',
        'Busca los datos que muestran una opinión o un género donde se opina; quién escribe y cuándo no lo dicen por sí solos.'),
      PU_ES('Antes de leer: «Cinco mitos sobre el agua potable», publicado en el sitio de una empresa de acueducto', [['tema: el agua potable', 'tema: la empresa'], ['propósito: corregir creencias erradas', 'propósito: contar una historia'], ['tipo: expositivo', 'tipo: narrativo']],
        'El título anuncia el tema (el agua) y el propósito (desmentir mitos): un texto que explica, expositivo.',
        'La palabra «mitos» del título dice qué va a hacer el texto con esas ideas.'),
    ]),
    PU_L('pu-el-2', 'Idea central y mapa del texto', [
      sc(6, 'Cada párrafo tiene una idea que se puede decir en pocas palabras. Escribirla al margen evita releer todo después.', { title: 'Una idea por párrafo' }),
      sc(7, 'Con esas notas se arma el **mapa del texto**: problema, causas, ejemplo, propuesta… Así se ve cómo avanza el razonamiento de principio a fin.', { title: 'El mapa' }),
      sc(6, 'La idea central no siempre está en la primera frase: muchas veces está en la última, como conclusión.', { title: 'No siempre al principio' }),
    ], [
      PU_SUB('Encuentra la idea central del párrafo', [
        { text: 'Medellín tiene cada vez más ciclorrutas.|Sin embargo, muchos ciclistas siguen usando la calzada.|La razón es que las rutas se cortan sin aviso y obligan a bajarse.|Una red que no conecta no sirve como red.', ask: 'Toca la frase que resume mejor la idea central', answer: [3] },
      ], 'Las primeras frases dan el dato, el problema y la causa; la última los resume: la red no sirve porque no conecta.',
        'Busca la frase que reúne lo que dicen las demás, no la que solo aporta un dato.'),
      PU_ORD('Texto sobre las abejas. P1: polinizan lo que comemos. P2: su número cae. P3: una finca perdió su cosecha. P4: hay que regular los pesticidas. Ordena la función de cada párrafo', '\\text{Párrafos 1, 2, 3 y 4}', ['importancia', 'problema', 'ejemplo', 'propuesta', 'conclusión opuesta'], [0, 1, 2, 3], '→',
        'El texto avanza de la importancia de las abejas al problema, lo ilustra con un caso y termina con una propuesta.',
        'Para cada párrafo, pregúntate qué hace: si explica por qué importa algo, si plantea un problema, si da un caso o si propone.'),
    ]),
    PU_L('pu-el-3', 'Tiempo y preguntas EXCEPTO', [
      sc(6, 'El examen trae dos textos largos y 40 preguntas: unos **15 minutos de lectura por texto**. Las preguntas se pueden leer antes, para saber qué buscar.', { title: 'Manejar el tiempo' }),
      sc(7, 'En una pregunta «EXCEPTO», tres opciones sí están en el texto y una no. Se verifica cada opción contra el texto y se marca la que no aparece.', { title: 'Preguntas EXCEPTO' }),
      sc(6, 'Las respuestas malas no restan: ninguna pregunta se deja en blanco.', { title: 'Nada en blanco' }),
    ], [
      PU_SUB('Pregunta EXCEPTO: «La biblioteca ofrece todo lo siguiente, EXCEPTO: a) préstamo de computadores, b) talleres para jóvenes, c) una sala infantil, d) cursos de inglés»', [
        { text: 'La biblioteca del barrio abrió en 2019.|Presta libros, computadores y juegos de mesa.|Los sábados ofrece talleres de escritura para jóvenes.|Su sala infantil fue pintada por los vecinos.', ask: 'Toca los trozos que respaldan las opciones a, b y c', answer: [1, 2, 3] },
      ], 'Las opciones a, b y c tienen respaldo en el texto; los cursos de inglés no aparecen: la respuesta es d.',
        'Toma cada opción y busca en qué frase del texto aparece. La que no encuentres es la respuesta.'),
      PU_ES('Tienes dos textos y 40 preguntas de lectura. ¿Cuál es el mejor plan?', [['unos 15 minutos de lectura por texto', 'leer cada texto tres veces con calma'], ['marcar la difícil y volver a ella', 'quedarse hasta resolverla'], ['no dejar nada en blanco', 'dejar en blanco si hay duda']],
        'Leer con un tiempo fijo, saltar lo difícil para volver después y responder todo, porque las malas no restan.',
        'Recuerda que en este examen las respuestas malas no anulan las buenas.'),
    ]),
  ] },

  // ---------------- 18 · Tipos de texto ----------------
  { world: 'pu-tipos', title: 'Tipos de texto y géneros', block: 'lectura', lessons: [
    PU_L('pu-tt-1', 'Tipologías', [
      sc(6, '**Narrativo**: cuenta hechos en el tiempo. **Descriptivo**: muestra cómo es algo. **Expositivo**: explica. **Argumentativo**: defiende una tesis.', { title: 'Cuatro tipologías' }),
      sc(6, 'Pistas: verbos en pasado y personajes (narrativo); adjetivos y sensaciones (descriptivo); datos y definiciones (expositivo); «creo que», «por eso», «debería» (argumentativo).', { title: 'Pistas en las palabras' }),
      sc(6, 'Un mismo texto mezcla tipologías: una crónica narra y describe; un ensayo expone para argumentar.', { title: 'Se mezclan' }),
    ], [
      PU_SUB('Un mismo tema, cuatro tipologías', [
        { text: 'El río Medellín atraviesa la ciudad de sur a norte.|Aquella mañana el agua bajó turbia y nadie supo por qué.|Sus orillas tienen guaduales, garzas y un olor a lluvia vieja.|Por eso, recuperar el río debería ser la prioridad del próximo alcalde.', ask: 'Toca el fragmento argumentativo', answer: [3] },
        { text: 'El río Medellín atraviesa la ciudad de sur a norte.|Aquella mañana el agua bajó turbia y nadie supo por qué.|Sus orillas tienen guaduales, garzas y un olor a lluvia vieja.|Por eso, recuperar el río debería ser la prioridad del próximo alcalde.', ask: 'Toca el fragmento narrativo', answer: [1] },
      ], 'El argumentativo propone qué «debería» hacerse; el narrativo cuenta un hecho en el tiempo («aquella mañana»). El primero informa y el tercero describe.',
        'Busca una palabra que pida algo y otra que ubique un hecho en el pasado.'),
      PU_SUB('Otro texto, otras tipologías', [
        { text: 'El fique se siembra en las laderas de Nariño y Santander.|Mi abuela tejía costales con él cada tarde, sin mirarse las manos.|Hoy compite con el plástico, y a mi juicio merece una ley que lo proteja.', ask: 'Toca el fragmento argumentativo', answer: [2] },
        { text: 'El fique se siembra en las laderas de Nariño y Santander.|Mi abuela tejía costales con él cada tarde, sin mirarse las manos.|Hoy compite con el plástico, y a mi juicio merece una ley que lo proteja.', ask: 'Toca el fragmento narrativo', answer: [1] },
      ], '«A mi juicio merece una ley» es una postura; «mi abuela tejía cada tarde» cuenta lo que pasaba. El primero es expositivo.',
        'Busca la frase que da una opinión y la que cuenta algo que pasó.'),
    ]),
    PU_L('pu-tt-2', 'Géneros del examen', [
      sc(6, '**Ensayo**: reflexión con tesis. **Artículo de opinión**: postura sobre un tema de actualidad, firmada. **Texto divulgativo**: explica ciencia a no expertos.', { title: 'Ensayo, opinión, divulgación' }),
      sc(6, '**Testimonio**: la voz en primera persona de quien vivió algo. **Entrevista**: preguntas y respuestas. **Crónica**: relato periodístico con detalles de lugar y tiempo.', { title: 'Testimonio, entrevista, crónica' }),
      sc(6, 'Reconocer el género ayuda a anticipar qué preguntan: en un testimonio, sentimientos; en una opinión, la tesis.', { title: 'El género anticipa' }),
    ], [
      PU_SUB('Cada fragmento viene de un género distinto', [
        { text: '«—¿Cuándo empezó a escribir? —A los doce, en los cuadernos de mi hermano.»|«Yo tenía nueve años cuando nos tocó salir de la vereda; mi mamá cargaba la olla y nosotros, el miedo.»|«El cerebro adulto sigue formando conexiones nuevas toda la vida.»', ask: 'Toca el testimonio', answer: [1] },
        { text: '«—¿Cuándo empezó a escribir? —A los doce, en los cuadernos de mi hermano.»|«Yo tenía nueve años cuando nos tocó salir de la vereda; mi mamá cargaba la olla y nosotros, el miedo.»|«El cerebro adulto sigue formando conexiones nuevas toda la vida.»', ask: 'Toca el fragmento divulgativo', answer: [2] },
      ], 'El testimonio cuenta en primera persona algo vivido; el divulgativo explica un dato científico. El primero, con rayas de diálogo, es una entrevista.',
        'Busca la voz que cuenta su propia vida y la que explica un hecho de la ciencia.'),
      PU_ES('Un texto firmado por un columnista sobre una reforma reciente dice: «esta reforma es un error». ¿Qué género es?', [['tiene postura y es de actualidad', 'solo informa datos'], ['artículo de opinión', 'crónica']],
        'Firma, tema de actualidad y una postura explícita: es un artículo de opinión.',
        'Fíjate si el autor solo cuenta o informa, o si toma partido.'),
    ]),
    PU_L('pu-tt-3', 'Estructura y testimonio', [
      sc(6, 'Casi todo texto tiene introducción, desarrollo y cierre. En uno argumentativo: **tesis**, **argumentos** y, a veces, un **contraargumento** respondido.', { title: 'Tesis y argumentos' }),
      sc(7, 'El testimonio tiene rasgos propios: primera persona, marcas de oralidad («pues», «uno», «sí me entiende») y un contexto histórico que explica lo vivido.', { title: 'Rasgos del testimonio' }),
      sc(6, 'En un testimonio las preguntas del examen suelen ir a los sentimientos y a las causas de lo que se cuenta.', { title: 'Qué preguntan' }),
    ], [
      PU_SUB('Un fragmento de testimonio', [
        { text: 'Mire, o sea, uno no sabía nada de leyes.|Yo llegué a Bogotá en 2002 con dos bolsas y una dirección escrita en un papel.|Allá en el pueblo la guerra ya no dejaba sembrar.', ask: 'Toca la marca de oralidad', answer: [0] },
        { text: 'Mire, o sea, uno no sabía nada de leyes.|Yo llegué a Bogotá en 2002 con dos bolsas y una dirección escrita en un papel.|Allá en el pueblo la guerra ya no dejaba sembrar.', ask: 'Toca el trozo que explica por qué se fue', answer: [2] },
      ], '«Mire, o sea» es habla oral; la causa de la salida es que la guerra no dejaba sembrar.',
        'La oralidad suena a conversación; la causa responde al «por qué» de la llegada a Bogotá.'),
      PU_ORD('Ordena las partes de un artículo de opinión', '\\text{Artículo sobre la jornada única}', ['La jornada debe ampliarse', 'Más horas, más lectura', 'Y menos tiempo solos', 'Por eso, jornada única', 'Hay que bajar impuestos'], [0, 1, 2, 3], '→',
        'Primero la tesis, luego dos argumentos y al final la conclusión que retoma la tesis. Lo de los impuestos no pertenece a este texto.',
        'Empieza por lo que el autor defiende y termina con la frase que lo retoma.'),
    ]),
  ] },

  // ---------------- 19 · Información explícita ----------------
  { world: 'pu-explicita', title: 'Información explícita', block: 'lectura', lessons: [
    PU_L('pu-ie-1', 'Ubicar datos', [
      sc(6, '«Según el texto…» pide un dato que está **escrito**. Se vuelve al texto a buscarlo: la memoria engaña.', { title: 'Volver al texto' }),
      sc(6, 'Para buscar rápido se usa una palabra clave de la pregunta: un nombre, una cifra, una fecha.', { title: 'Palabras clave' }),
      sc(6, 'A veces la respuesta necesita dos datos de frases distintas que se combinan.', { title: 'Datos que se juntan' }),
    ], [
      PU_SUB('Lee y ubica los datos', [
        { text: 'El páramo de Santurbán abastece de agua a más de dos millones de personas.|Se extiende por Santander y Norte de Santander.|Sus frailejones crecen apenas un centímetro al año.|Por eso, una zona dañada tarda décadas en recuperarse.', ask: 'Toca el dato de cuántas personas dependen del páramo', answer: [0] },
        { text: 'El páramo de Santurbán abastece de agua a más de dos millones de personas.|Se extiende por Santander y Norte de Santander.|Sus frailejones crecen apenas un centímetro al año.|Por eso, una zona dañada tarda décadas en recuperarse.', ask: 'Toca el dato que explica por qué se recupera tan despacio', answer: [2] },
      ], 'La cifra de personas está en la primera frase; la lentitud se explica porque el frailejón crece un centímetro al año.',
        'Busca las palabras clave de cada consigna: «personas» y «despacio».'),
      PU_SUB('Datos que se combinan', [
        { text: 'En 2025 la biblioteca prestó 12 000 libros.|De ellos, la mitad fueron infantiles.|El libro más pedido fue una novela gráfica.|El año anterior había prestado 9 000.', ask: 'Toca los datos que permiten saber cuántos libros infantiles se prestaron en 2025', answer: [0, 1] },
        { text: 'En 2025 la biblioteca prestó 12 000 libros.|De ellos, la mitad fueron infantiles.|El libro más pedido fue una novela gráfica.|El año anterior había prestado 9 000.', ask: 'Toca los datos que muestran que los préstamos aumentaron', answer: [0, 3] },
      ], 'Infantiles: la mitad de 12 000. Aumento: de 9 000 a 12 000. Cada respuesta necesita dos frases.',
        'Una sola frase no basta: busca los dos datos que juntos responden.'),
    ]),
    PU_L('pu-ie-2', 'Paráfrasis', [
      sc(6, 'Parafrasear es decir lo mismo con otras palabras, **sin agregar ni quitar**.', { title: 'Lo mismo, con otras palabras' }),
      sc(7, 'Las opciones trampa cambian el alcance: «algunos» por «todos», «puede» por «siempre», «reduce» por «elimina».', { title: 'Cuidado con el alcance' }),
      sc(6, 'Si la frase original es «Muchos jóvenes prefieren el podcast», «A varios jóvenes les gusta más el podcast» es fiel; «Los jóvenes ya no leen» no lo es.', { title: 'Fiel y no fiel' }),
    ], [
      PU_SUB('Original: «Algunos estudios sugieren que dormir menos de seis horas puede afectar la memoria.» Un compañero lo resumió así', [
        { text: 'Según el texto, hay investigaciones que indican que dormir menos de seis horas podría perjudicar la memoria,|y eso le pasa siempre a todo el mundo.|Además, todos los estudios lo prueban sin excepción.', ask: 'Toca la parte del resumen que es fiel al original', answer: [0] },
        { text: 'Según el texto, hay investigaciones que indican que dormir menos de seis horas podría perjudicar la memoria,|y eso le pasa siempre a todo el mundo.|Además, todos los estudios lo prueban sin excepción.', ask: 'Toca las partes que exageran lo que dice el original', answer: [1, 2] },
      ], 'La fiel conserva «algunos» (hay investigaciones) y «puede» (podría). Las demás vuelven absoluto lo que era posible.',
        'Compara palabras como «algunos», «puede», «siempre» y «todos» con las de la frase original.'),
      PU_SUB('Original: «La ciudad no prohibió los carros: restringió su paso por el centro en las horas pico.» Una compañera lo resumió así', [
        { text: 'La ciudad puso restricciones al paso de carros por el centro en las horas pico,|aunque al final terminó prohibiéndolos,|y de paso subió el precio de los parqueaderos.', ask: 'Toca la parte del resumen que el original respalda', answer: [0] },
      ], 'Solo la primera parte conserva «restricciones», «centro» y «horas pico». El original niega la prohibición y no habla de parqueaderos.',
        'Fíjate en los límites que pone la frase: dónde y cuándo.'),
    ]),
    PU_L('pu-ie-3', 'Lo que dice y lo que no', [
      sc(6, 'Una opción puede ser verdad en el mundo y aun así **no estar en el texto**. La pregunta clave es dónde lo dice.', { title: 'Verdadero no es «dicho»' }),
      sc(6, 'Si para aceptarla hay que usar lo que uno sabe, y no lo que leyó, no está en el texto.', { title: 'Solo lo leído' }),
      sc(6, 'Es el error más frecuente del examen: elegir lo que suena bien en lugar de lo que el texto afirma.', { title: 'El error más común' }),
    ], [
      PU_SUB('Texto: «El café llegó a Colombia en el siglo XVIII y hoy se cultiva en más de 20 departamentos. La mayoría de los cafeteros tiene fincas de menos de cinco hectáreas.» Un compañero escribió este resumen', [
        { text: 'El café se cultiva en más de 20 departamentos,|Colombia es el mayor productor de café del mundo|y muchos cafeteros tienen fincas pequeñas,|así que el café colombiano es el más suave.', ask: 'Toca solo lo que el texto original afirma', answer: [0, 2] },
      ], 'El texto da los departamentos y el tamaño de las fincas. Lo del mayor productor (que además no es cierto) y lo del sabor no aparecen.',
        'Para cada afirmación, señala la palabra del texto que la respalda. Si no hay, no la toques.'),
      PU_SUB('Texto: «La encuesta se hizo a 500 jóvenes de Cali; el 70 % dijo leer noticias solo en redes sociales.» Una periodista escribió esto', [
        { text: 'El 70 % de los encuestados lee noticias solo en redes;|los jóvenes de Colombia ya no leen periódicos.|La encuesta se hizo en Cali|y demuestra que las redes informan mal.', ask: 'Toca solo lo que el texto original afirma', answer: [0, 2] },
      ], 'El texto habla de 500 jóvenes de Cali, no de todo el país, y no juzga a las redes.',
        'Revisa de quiénes habla la encuesta y si el texto valora o solo informa.'),
    ]),
    PU_L('pu-ie-4', 'Quién dice qué', [
      sc(6, 'En un texto hablan varias voces: el autor y las personas citadas. Verbos como «afirma», «según», «sostiene» marcan de quién es cada idea.', { title: 'Atribuir' }),
      sc(6, 'Una pregunta puede poner en boca del autor lo que dijo un citado, o al revés.', { title: 'La trampa de la voz' }),
      sc(6, 'Para la secuencia de hechos, sirven las fechas y los marcadores: primero, luego, al año siguiente.', { title: 'La secuencia' }),
    ], [
      PU_SUB('Varias voces sobre un programa de computadores', [
        { text: 'La ministra aseguró que el programa llegará a 300 colegios.|El rector Pérez, en cambio, dijo que su colegio aún no recibe los equipos.|Para la investigadora Gómez, el problema no son los equipos sino la formación docente.|El periódico consultó a diez colegios.', ask: 'Toca lo que piensa la investigadora', answer: [2] },
        { text: 'La ministra aseguró que el programa llegará a 300 colegios.|El rector Pérez, en cambio, dijo que su colegio aún no recibe los equipos.|Para la investigadora Gómez, el problema no son los equipos sino la formación docente.|El periódico consultó a diez colegios.', ask: 'Toca quién pone en duda que el programa ya funcione', answer: [1] },
      ], 'La investigadora habla de la formación docente; el rector muestra que los equipos aún no llegan.',
        'Busca el nombre de cada persona y el verbo que introduce lo que dice.'),
      PU_ORD('Ordena los hechos: «La sala de lectura se inauguró en 2025. Antes, los vecinos la pintaron con recursos que la alcaldía había aprobado al año siguiente de la asamblea de 2023 donde surgió la idea.»', '\\text{La sala de lectura del barrio}', ['asamblea (2023)', 'recursos aprobados', 'los vecinos pintan', 'inauguración (2025)'], [0, 1, 2, 3], '→',
        'Asamblea en 2023, recursos en 2024, la pintura con esos recursos y la inauguración en 2025.',
        'Fíjate en las fechas y en «con esos recursos» y «antes de inaugurarla».'),
    ]),
  ] },

  // ---------------- 20 · Inferencia ----------------
  { world: 'pu-inferencia', title: 'Inferencia', block: 'lectura', lessons: [
    PU_L('pu-in-1', 'Ideas implícitas', [
      sc(6, '**Inferir** es sacar lo que el texto no dice pero lleva a pensar. Una inferencia válida se apoya en **pistas del texto**.', { title: 'Leer entre líneas' }),
      sc(6, 'Si para sostenerla hace falta una opinión propia o un dato externo, ya no es inferencia: es suposición.', { title: 'Inferencia o suposición' }),
      sc(7, 'Ejemplo: «Cerró el paraguas y se quitó las gafas empañadas» permite inferir que venía de la lluvia, aunque el texto no lo diga.', { title: 'Un ejemplo' }),
    ], [
      PU_SUB('Lee la escena', [
        { text: 'Marta revisó tres veces el reloj del bus.|Cuando por fin llegó a la oficina, la reunión ya había empezado.|Se sentó en la última silla, sin saludar.', ask: 'Toca la pista de que estaba preocupada por la hora', answer: [0] },
        { text: 'Marta revisó tres veces el reloj del bus.|Cuando por fin llegó a la oficina, la reunión ya había empezado.|Se sentó en la última silla, sin saludar.', ask: 'Toca la pista de que no quería llamar la atención', answer: [2] },
      ], 'Mirar el reloj tres veces muestra preocupación; sentarse atrás y sin saludar, que no quería hacerse notar.',
        'Los sentimientos no se nombran: se muestran en lo que hace la persona.'),
      PU_ES('Texto: «Desde que instalaron las cámaras, los robos en el parque bajaron, aunque también llegaron más policías.» ¿Qué se puede concluir?', [['los robos bajaron', 'las cámaras acabaron con el delito'], ['hubo dos cambios a la vez', 'solo cambiaron las cámaras'], ['no se sabe cuál causó la baja', 'las cámaras causaron la baja']],
        'El texto da dos cambios al mismo tiempo; no permite decir cuál de los dos explica la baja.',
        'Cuenta cuántas cosas cambiaron en el parque según el texto.'),
    ]),
    PU_L('pu-in-2', 'Presupuestos', [
      sc(6, 'Un **presupuesto** es lo que el autor da por hecho sin decirlo. «Dejó de fumar» presupone que fumaba.', { title: 'Lo que se da por hecho' }),
      sc(6, '«Ya es hora de que el gobierno cumpla» presupone que no ha cumplido.', { title: 'Un presupuesto en opinión' }),
      sc(6, 'Palabras que suelen cargar presupuestos: «otra vez», «todavía», «ya no», «por fin», «dejar de».', { title: 'Palabras delatoras' }),
    ], [
      PU_SUB('Frase de una noticia', [
        { text: 'Otra vez|el metro|se detuvo|en hora pico.', ask: 'Toca las palabras que dan por hecho que ya había pasado antes', answer: [0] },
      ], '«Otra vez» presupone que el metro ya se había detenido antes; el resto solo informa.',
        'Busca la expresión que habla de una repetición.'),
      PU_SUB('Frase: «Cuando por fin reabran el puente, los campesinos volverán a vender en el pueblo.»', [
        { text: 'Cuando por fin|reabran|el puente,|los campesinos|volverán a vender|en el pueblo.', ask: 'Toca la palabra que da por hecho que el puente está cerrado', answer: [1] },
        { text: 'Cuando por fin|reabran|el puente,|los campesinos|volverán a vender|en el pueblo.', ask: 'Toca lo que da por hecho que antes vendían allí', answer: [4] },
      ], '«Reabran» presupone que está cerrado y «volverán a vender», que antes vendían. No se dice cuándo abre.',
        'Busca las palabras que hablan de algo que ya pasó antes y que se repetirá.'),
    ]),
    PU_L('pu-in-3', 'Causa y efecto', [
      sc(6, 'A veces la causa no se dice con «porque»: se deduce del orden de los hechos y de lo que se sabe de ellos.', { title: 'Causas implícitas' }),
      sc(6, 'Pero que algo pase **después** no significa que pase **por** lo anterior.', { title: 'Después no es por' }),
      sc(6, 'Una buena inferencia de causa encadena hechos del propio texto, sin agregar nada.', { title: 'Encadenar hechos' }),
    ], [
      PU_ES('Texto: «La sequía redujo el caudal del embalse. En marzo la ciudad empezó a racionar el agua.»', [['la causa es la sequía', 'la causa es marzo'], ['el efecto es el racionamiento', 'el efecto es el embalse']],
        'La sequía baja el embalse y, por eso, se raciona el agua. Marzo solo dice cuándo.',
        'Pregúntate qué hecho provoca al otro; una fecha no causa nada.'),
      PU_SUB('Una cadena de causas', [
        { text: 'La cosecha de mango fue enorme este año.|Por eso, el precio del kilo cayó a la mitad.|Muchos campesinos prefirieron regalarlo antes que perderlo.', ask: 'Toca la causa de la caída del precio', answer: [0] },
        { text: 'La cosecha de mango fue enorme este año.|Por eso, el precio del kilo cayó a la mitad.|Muchos campesinos prefirieron regalarlo antes que perderlo.', ask: 'Toca la consecuencia de que el precio cayera', answer: [2] },
      ], 'Mucho mango hizo bajar el precio, y el precio tan bajo llevó a regalarlo.',
        'Sigue las flechas: cosecha → precio → lo que hacen los campesinos.'),
    ]),
    PU_L('pu-in-4', 'Actitudes y motivos', [
      sc(6, 'En los testimonios, los sentimientos casi nunca se nombran: se ven en los gestos, en lo que se guarda o se calla.', { title: 'Mostrar, no nombrar' }),
      sc(6, 'Nostalgia, miedo, orgullo, resignación: cada uno deja huellas en lo que la persona hace o recuerda.', { title: 'Huellas de cada emoción' }),
      sc(6, 'La pregunta «qué siente el autor» se responde con una frase del texto, no con lo que uno sentiría.', { title: 'Con pruebas del texto' }),
    ], [
      PU_SUB('Fragmento de un testimonio', [
        { text: 'Todavía guardo la llave de la casa de la finca,|aunque la casa ya no existe.|A veces la saco del cajón y la miro un rato.', ask: 'Toca el trozo que explica por qué la llave ya no abre nada', answer: [1] },
        { text: 'Todavía guardo la llave de la casa de la finca,|aunque la casa ya no existe.|A veces la saco del cajón y la miro un rato.', ask: 'Toca el gesto que muestra que la recuerda con cariño', answer: [2] },
      ], 'La casa ya no existe; sacar la llave para mirarla es un gesto de nostalgia.',
        'La emoción está en lo que hace con la llave, no en un adjetivo.'),
      PU_ES('«Le pregunté si tenía miedo y se rió: "Miedo tuve cuando no sabía leer".» ¿Qué actitud muestra?', [['su miedo de antes era no saber leer', 'hoy tiene mucho miedo'], ['orgullo por haber aprendido', 'vergüenza por haber aprendido']],
        'Se ríe del miedo actual porque el verdadero miedo era no saber leer: muestra orgullo de haberlo superado.',
        'Fíjate en la risa y en el tiempo del verbo «tuve».'),
    ]),
  ] },

  // ---------------- 21 · Vocabulario en contexto ----------------
  { world: 'pu-vocabulario', title: 'Vocabulario en contexto', block: 'lectura', lessons: [
    PU_L('pu-vo-1', 'Sinónimos según el contexto', [
      sc(6, 'El sinónimo correcto es el que **encaja en la frase**, no el primero del diccionario.', { title: 'El contexto manda' }),
      sc(6, 'En «una propuesta sólida», sólida significa bien fundamentada, no dura ni pesada.', { title: '«Sólida»' }),
      sc(6, 'La prueba: reemplazar la palabra por la opción y leer la frase completa. Si cambia el sentido, no sirve.', { title: 'La prueba del reemplazo' }),
    ], [
      PU_SUB('Un informe sobre el río', [
        { text: 'El informe fue|contundente:|el río está contaminado|y los datos no dejan lugar a otra lectura.', ask: 'Toca la palabra que significa «terminante, que no deja dudas»', answer: [1] },
      ], '«Contundente» es terminante; la última frase lo confirma: los datos no dejan otra lectura.',
        'Busca un adjetivo que califique al informe; el final de la frase te ayuda a confirmarlo.'),
      PU_SUB('Una consulta polémica', [
        { text: 'La comunidad rechazó el proyecto minero.|Los líderes dijeron que la consulta había sido apresurada|y que nadie les explicó los riesgos.', ask: 'Toca el trozo con la palabra que significa «hecha sin el tiempo necesario»', answer: [1] },
      ], '«Apresurada» es hecha con prisa, sin el tiempo que hacía falta.',
        'Busca un adjetivo que tenga que ver con la prisa.'),
    ]),
    PU_L('pu-vo-2', 'Palabras con varios sentidos', [
      sc(6, 'Muchas palabras tienen varios significados (**polisemia**): «banco» es un asiento o una entidad; «salvar» una materia es aprobarla.', { title: 'Polisemia' }),
      sc(6, 'El contexto elige el sentido: «cerraron el banco a las tres» habla de la entidad.', { title: 'El contexto elige' }),
      sc(6, 'En el examen, la opción trampa suele ser el sentido más común de la palabra, que no es el del texto.', { title: 'La trampa' }),
    ], [
      PU_SUB('Una noticia sobre la gasolina', [
        { text: 'El gobierno congeló|los precios de la gasolina|por seis meses:|en ese tiempo no subirán ni bajarán.', ask: 'Toca el trozo que explica qué significa «congeló» aquí', answer: [3] },
      ], 'El propio texto lo aclara después de los dos puntos: congelar un precio es dejarlo quieto.',
        'Los dos puntos suelen anunciar una explicación de lo que se acaba de decir.'),
      PU_SUB('Una ley nueva', [
        { text: 'La nueva ley quiere tejer puentes entre el campo y la ciudad:|que los campesinos vendan directo en los barrios|y que los jóvenes de la ciudad conozcan las veredas.', ask: 'Toca los trozos que muestran qué significa «tejer puentes»', answer: [1, 2] },
      ], 'No se trata de hilos ni de cemento: los ejemplos muestran que «tejer puentes» es crear lazos entre las dos partes.',
        'La ley no construye nada físico: mira los ejemplos que siguen a los dos puntos.'),
    ]),
    PU_L('pu-vo-3', 'Expresiones y frases hechas', [
      sc(6, 'En una frase hecha el sentido no es la suma de las palabras: «meter la pata» no tiene que ver con patas.', { title: 'Frases hechas' }),
      sc(6, 'El examen usa coloquialismos colombianos: «dar papaya», «echar los perros», «estar en la olla», «hacer vaca».', { title: 'Colombianismos' }),
      sc(6, '«Hacer vaca» es juntar dinero entre varios para algo común.', { title: '«Hacer vaca»' }),
    ], [
      PU_SUB('Una final', [
        { text: 'Después de perder tres partidos seguidos,|el equipo no tiró la toalla:|entrenó el doble|y llegó a la final.', ask: 'Toca lo que muestra qué significa «no tiró la toalla»', answer: [2] },
      ], '«Tirar la toalla» es rendirse; entrenar el doble muestra que el equipo siguió luchando.',
        'Busca lo que hizo el equipo justo después de la expresión.'),
      PU_SUB('En el salón', [
        { text: 'Ana mamaba gallo con que se iba a vivir a la Luna;|todos se rieron|porque sabían que era una broma.', ask: 'Toca el trozo que revela qué significa «mamar gallo»', answer: [2] },
      ], '«Mamar gallo» es tomar del pelo, bromear; el final lo dice: era una broma.',
        'Busca la explicación de por qué todos se rieron.'),
    ]),
    PU_L('pu-vo-4', 'Prefijos y raíces', [
      sc(6, 'Muchas palabras se entienden por sus piezas griegas y latinas: **anti-** contra, **sub-** debajo, **poli-** muchos, **bio-** vida.', { title: 'Prefijos' }),
      sc(6, 'Y por sus finales: **-logía** estudio, **-cida** que mata, **-fobia** miedo. Un insecticida mata insectos.', { title: 'Sufijos y raíces' }),
      sc(6, 'Con esas piezas se deduce una palabra que nunca se ha visto: un «hidrófobo» teme al agua (hidro-, agua).', { title: 'Deducir' }),
    ], [
      PU_SUB('Raíces que significan «vida»', [
        { text: 'biodiversidad|biografía|bisabuelo|antibiótico', ask: 'Toca las palabras que tienen la raíz «bio», vida', answer: [0, 1, 3] },
      ], 'Biodiversidad, biografía y antibiótico llevan «bio». En bisabuelo, «bis» significa dos veces.',
        'Ojo: que empiece por «bi» no basta; tiene que estar la raíz completa con el sentido de vida.'),
      PU_ES('¿Qué significa «políglota»?', [['poli: muchos', 'poli: ciudad'], ['glota: lengua', 'glota: globo'], ['habla muchas lenguas', 'viaja por muchas ciudades']],
        '«Poli» es muchos y «glota» viene de lengua: políglota es quien habla muchas lenguas.',
        'Piensa en «glotis», una parte de la garganta.'),
    ]),
  ] },

  // ---------------- 22 · Aplicación y analogía ----------------
  { world: 'pu-aplicacion', title: 'Aplicación y analogía', block: 'lectura', lessons: [
    PU_L('pu-ap-1', 'Aplicar a un caso nuevo', [
      sc(6, 'Estas preguntas piden llevar una idea del texto a una situación distinta. Primero se saca el **principio general**.', { title: 'Sacar el principio' }),
      sc(6, 'Luego se busca el caso que cumple ese principio aunque el tema sea otro: lo que importa es la estructura, no el tema.', { title: 'La estructura, no el tema' }),
      sc(6, 'Ejemplo: «lo que se mide, mejora» se aplica a quien anota sus gastos para gastar menos.', { title: 'Un ejemplo' }),
    ], [
      PU_SUB('Texto: «Los hábitos se forman cuando una acción pequeña se repite en el mismo lugar y a la misma hora.»', [
        { title: 'Camilo quiso volverse lector.', text: 'Primero compró diez libros de una vez.|Luego leyó un libro entero un domingo.|Después leía cuando le quedaba tiempo.|Al final se puso a leer diez minutos cada noche, en la cama.', ask: 'Toca el intento que sigue la idea del texto', answer: [3] },
      ], 'Solo el último es pequeño, repetido, en el mismo lugar y a la misma hora.',
        'El principio tiene tres condiciones: pequeño, repetido y siempre igual. Busca el caso que cumpla las tres.'),
      PU_SUB('Texto: «Una regla se respeta más cuando quienes deben cumplirla ayudaron a crearla.»', [
        { title: 'Un colegio quiso bajar el ruido en los descansos.', text: 'El rector impuso multas.|Luego pegaron carteles con normas que nadie consultó.|Por último, cada curso redactó sus propias normas de convivencia.', ask: 'Toca la medida que aplica la idea del texto', answer: [2] },
      ], 'En la última, quienes cumplirán las reglas las escriben.',
        'Busca el caso en que los que obedecen son los mismos que crean la regla.'),
    ]),
    PU_L('pu-ap-2', 'Analogías', [
      sc(6, 'Una analogía dice que **A es a B como C es a D**: la relación entre A y B es la misma que entre C y D.', { title: 'Misma relación' }),
      sc(6, 'Relaciones frecuentes: herramienta y quien la usa, parte y todo, causa y efecto, etapa y lo que llega a ser.', { title: 'Tipos de relación' }),
      sc(6, 'Ejemplo: «página es a libro como ladrillo es a muro»: parte y todo.', { title: 'Parte y todo' }),
    ], [
      PU_ES('Pincel es a pintor como…', [['relación: herramienta y quien la usa', 'relación: parte y todo'], ['bisturí es a cirujano', 'hoja es a árbol']],
        'El pintor usa el pincel; el cirujano, el bisturí. La hoja es parte del árbol: otra relación.',
        'Describe primero con una frase qué relación hay entre el pincel y el pintor.'),
      PU_ES('Semilla es a árbol como…', [['relación: lo que llega a ser', 'relación: lo que lo destruye'], ['niño es a adulto', 'hacha es a árbol']],
        'La semilla llega a ser árbol como el niño llega a ser adulto.',
        'Piensa en qué se convierte la semilla con el tiempo.'),
    ]),
  ] },

  // ---------------- 23 · Fuentes y voces ----------------
  { world: 'pu-fuentes', title: 'Fuentes y voces', block: 'lectura', lessons: [
    PU_L('pu-fu-1', 'Citas y voces', [
      sc(6, 'Una **cita directa** copia las palabras exactas, entre comillas. Una **indirecta** las cuenta: «dijo que…».', { title: 'Directa e indirecta' }),
      sc(6, 'Hay que separar la voz del autor de la de los expertos que cita: no siempre piensan lo mismo.', { title: 'Autor y citados' }),
      sc(6, 'Marcas de la voz del autor: «yo», «a mi modo de ver», «creo», «me parece».', { title: 'La voz del autor' }),
    ], [
      PU_SUB('Un texto con citas', [
        { text: 'Según el biólogo Ruiz, «los colibríes visitan hasta mil flores al día».|Yo, que no sé de biología, me sorprendí.|Ruiz añadió que su memoria para las flores es asombrosa.|Desde entonces miro distinto el jardín.', ask: 'Toca la cita directa', answer: [0] },
        { text: 'Según el biólogo Ruiz, «los colibríes visitan hasta mil flores al día».|Yo, que no sé de biología, me sorprendí.|Ruiz añadió que su memoria para las flores es asombrosa.|Desde entonces miro distinto el jardín.', ask: 'Toca la cita indirecta', answer: [2] },
      ], 'La directa está entre comillas; la indirecta cuenta lo que dijo Ruiz con «añadió que».',
        'Busca las comillas y el verbo seguido de «que».'),
      PU_SUB('Tres voces sobre el teletrabajo', [
        { text: 'La economista Díaz sostiene que el teletrabajo aumenta la productividad.|Su colega Mejía responde que eso depende del tipo de empleo.|A mi modo de ver, ambos olvidan a quienes no tienen internet en casa.', ask: 'Toca lo que piensa el autor del texto', answer: [2] },
        { text: 'La economista Díaz sostiene que el teletrabajo aumenta la productividad.|Su colega Mejía responde que eso depende del tipo de empleo.|A mi modo de ver, ambos olvidan a quienes no tienen internet en casa.', ask: 'Toca la postura matizada', answer: [1] },
      ], 'El autor habla en primera persona («a mi modo de ver»). Mejía matiza: «depende».',
        'La voz del autor se reconoce por la primera persona; una postura matizada pone condiciones.'),
    ]),
    PU_L('pu-fu-2', 'Posturas y citas externas', [
      sc(6, 'Cada fuente toma una postura: **a favor**, **en contra** o **matizada** (sí, pero con condiciones).', { title: 'Tres posturas' }),
      sc(6, 'Una pregunta frecuente trae una cita que no está en el texto y pide decidir si apoya o contradice la tesis.', { title: 'La cita externa' }),
      sc(6, 'Para decidir, se compara lo que afirma la cita con la tesis, no con un detalle del texto.', { title: 'Comparar con la tesis' }),
    ], [
      PU_ES('Tesis del texto: «las tareas largas no mejoran el aprendizaje». Cita externa: «Enseña más practicar poco y a menudo».', [['la cita apoya la tesis', 'la cita contradice la tesis'], ['ambas: práctica corta y frecuente', 'la cita pide más horas seguidas']],
        'La cita prefiere práctica corta y frecuente, lo mismo que dice la tesis contra las tareas largas.',
        'Resume la cita con tus palabras y compárala con la tesis.'),
      PU_SUB('Tres expertos sobre la jornada única', [
        { text: 'El experto A dice que la jornada única mejora los resultados.|La experta B afirma que no tiene ningún efecto.|El experto C cree que sirve solo si se acompaña de alimentación escolar.', ask: 'Toca la postura en contra', answer: [1] },
        { text: 'El experto A dice que la jornada única mejora los resultados.|La experta B afirma que no tiene ningún efecto.|El experto C cree que sirve solo si se acompaña de alimentación escolar.', ask: 'Toca la postura matizada', answer: [2] },
      ], 'B niega que sirva; C dice que sí, pero con una condición.',
        'La postura matizada acepta, pero con condiciones.'),
    ]),
  ] },

  // ---------------- 24 · Conectores ----------------
  { world: 'pu-conectores', title: 'Conectores y función de partes', block: 'lectura', lessons: [
    PU_L('pu-cn-1', 'Conectores', [
      sc(6, 'Los conectores dicen cómo se relacionan las ideas: **adición** (además), **contraste** (sin embargo), **causa** (porque), **consecuencia** (por lo tanto).', { title: 'Tipos de conectores' }),
      sc(6, 'También hay de **ejemplificación** (por ejemplo, como) y de **conclusión** (en suma, en conclusión).', { title: 'Más conectores' }),
      sc(6, 'Un conector de contraste anuncia que viene lo importante: lo que sigue a «sin embargo» suele pesar más.', { title: 'El peso del contraste' }),
    ], [
      PU_SUB('Encuentra los conectores', [
        { text: 'El parque es pequeño;|sin embargo,|recibe más visitantes que el zoológico,|porque|la entrada es gratis.', ask: 'Toca el conector de contraste', answer: [1] },
        { text: 'El parque es pequeño;|sin embargo,|recibe más visitantes que el zoológico,|porque|la entrada es gratis.', ask: 'Toca el conector de causa', answer: [3] },
      ], '«Sin embargo» contrapone el tamaño con los visitantes; «porque» introduce la causa.',
        'Un conector une dos ideas: busca las palabras que hacen de puente.'),
      PU_SUB('Otra serie de conectores', [
        { text: 'La lluvia arrasó los cultivos;|por lo tanto,|el precio de la papa subió.|Además,|faltó transporte para sacar la cosecha.', ask: 'Toca el conector de consecuencia', answer: [1] },
        { text: 'La lluvia arrasó los cultivos;|por lo tanto,|el precio de la papa subió.|Además,|faltó transporte para sacar la cosecha.', ask: 'Toca el conector de adición', answer: [3] },
      ], '«Por lo tanto» introduce el efecto; «además» suma otro problema.',
        'Pregúntate si el conector anuncia un resultado o simplemente agrega algo.'),
    ]),
    PU_L('pu-cn-2', 'Función de párrafos y signos', [
      sc(6, 'Cada párrafo cumple una función: **introducir**, **ejemplificar**, **contraargumentar** o **concluir**.', { title: 'Funciones de un párrafo' }),
      sc(7, 'Los signos también: las **comillas** citan o marcan ironía; los **paréntesis** aclaran; las **rayas** abren un inciso; los **dos puntos** anuncian una explicación o una lista.', { title: 'Funciones de los signos' }),
      sc(6, 'Ejemplo: «Llegó el "gran" cambio: un semáforo nuevo.» Las comillas de «gran» son irónicas.', { title: 'Comillas irónicas' }),
    ], [
      PU_SUB('Signos con función', [
        { text: 'El gobierno anunció un «generoso» aumento:|apenas 2 % (menos que la inflación).|Los maestros —que esperaban un 8 %— protestaron.', ask: 'Toca el trozo con comillas irónicas', answer: [0] },
        { text: 'El gobierno anunció un «generoso» aumento:|apenas 2 % (menos que la inflación).|Los maestros —que esperaban un 8 %— protestaron.', ask: 'Toca la aclaración entre paréntesis', answer: [1] },
      ], 'Las comillas de «generoso» dicen lo contrario de lo que significa la palabra; el paréntesis aclara por qué el 2 % es poco.',
        'Fíjate en qué signo encierra a cada trozo.'),
      PU_ORD('Un texto sobre el ruido: P1 presenta el problema, P2 cuenta el caso de un barrio, P3 responde a quienes dicen que es exageración y P4 propone una norma. Ordena las funciones', '\\text{Párrafos 1, 2, 3 y 4}', ['introducir', 'ejemplificar', 'contraargumentar', 'concluir'], [0, 1, 2, 3], '→',
        'Presentar es introducir; el caso del barrio, ejemplificar; responder a los críticos, contraargumentar; y proponer al final, concluir.',
        'Para cada párrafo, piensa qué hace con la idea principal: la presenta, la ilustra, la defiende o la cierra.'),
    ]),
  ] },

  // ---------------- 25 · Argumentación ----------------
  { world: 'pu-argumentacion', title: 'Argumentación, intención y tono', block: 'lectura', lessons: [
    PU_L('pu-ag-1', 'Tesis y argumentos', [
      sc(6, 'La **tesis** es lo que el autor defiende. Los **argumentos** la sostienen; el **contraargumento** es la objeción que el autor responde.', { title: 'Tesis, argumentos, objeción' }),
      sc(6, 'Tipos de argumento: de **autoridad** (un experto), de **ejemplo** (un caso), de **datos** (cifras), de **causa** y por **analogía**.', { title: 'Tipos de argumento' }),
      sc(6, 'La tesis responde a «qué defiende»; un argumento, a «por qué».', { title: 'Qué y por qué' }),
    ], [
      PU_SUB('Un texto sobre el parqueo en la calle', [
        { text: 'Las ciudades deberían cobrar por parquear en la calle.|Un cupo en la calle ocupa un espacio que vale millones.|Además, el cobro reduce las vueltas buscando dónde parquear.|Algunos dicen que es un impuesto más, pero el dinero puede ir al transporte público.', ask: 'Toca la tesis', answer: [0] },
        { text: 'Las ciudades deberían cobrar por parquear en la calle.|Un cupo en la calle ocupa un espacio que vale millones.|Además, el cobro reduce las vueltas buscando dónde parquear.|Algunos dicen que es un impuesto más, pero el dinero puede ir al transporte público.', ask: 'Toca el contraargumento y su respuesta', answer: [3] },
      ], 'La tesis es lo que «deberían» hacer las ciudades; la última frase presenta una objeción y la responde.',
        'La tesis es lo que el autor pide o defiende; el contraargumento presenta lo que dicen quienes no están de acuerdo.'),
      PU_SUB('Tres argumentos a favor de caminar', [
        { text: 'Según la Organización Mundial de la Salud, caminar a diario reduce el riesgo de enfermedades del corazón.|Mi abuelo caminó toda la vida y llegó a los 95.|Caminar es para el cuerpo lo que leer es para la mente.', ask: 'Toca el argumento de autoridad', answer: [0] },
        { text: 'Según la Organización Mundial de la Salud, caminar a diario reduce el riesgo de enfermedades del corazón.|Mi abuelo caminó toda la vida y llegó a los 95.|Caminar es para el cuerpo lo que leer es para la mente.', ask: 'Toca el argumento por analogía', answer: [2] },
      ], 'La autoridad es la OMS; la analogía compara caminar con leer. El abuelo es un ejemplo.',
        'Uno cita una institución, otro cuenta un caso y otro compara dos cosas distintas.'),
    ]),
    PU_L('pu-ag-2', 'Intención y tono', [
      sc(6, 'La **intención** es para qué escribe el autor: informar, persuadir, criticar o reflexionar.', { title: 'Intención' }),
      sc(6, 'El **tono** es la actitud: crítico, irónico, nostálgico, preocupado, optimista. Se nota en los adjetivos y en lo que se elige contar.', { title: 'Tono' }),
      sc(6, 'Un texto puede informar con datos y, aun así, tener un tono preocupado si elige los datos más alarmantes.', { title: 'Datos y tono' }),
    ], [
      PU_ES('«Qué maravilla: otro puente nuevo que se inunda con la primera lluvia.» ¿Cuál es el tono?', [['dice lo contrario de lo que piensa', 'elogia el puente'], ['irónico', 'optimista']],
        '«Qué maravilla» choca con un puente que se inunda: el autor critica diciendo lo contrario, con ironía.',
        'Compara el elogio del comienzo con el hecho que se cuenta.'),
      PU_SUB('Un recuerdo del barrio', [
        { text: 'Aún recuerdo el olor del pan de la panadería de la esquina,|que cerró hace veinte años.|Hoy hay un parqueadero.', ask: 'Toca el trozo que da el tono nostálgico', answer: [0] },
        { text: 'Aún recuerdo el olor del pan de la panadería de la esquina,|que cerró hace veinte años.|Hoy hay un parqueadero.', ask: 'Toca el trozo que muestra lo que hay ahora', answer: [2] },
      ], 'El recuerdo del olor del pan da la nostalgia; el parqueadero marca el contraste con el presente.',
        'La nostalgia vive en un recuerdo de los sentidos; el presente aparece al final.'),
    ]),
    PU_L('pu-ag-3', 'Hechos y opiniones', [
      sc(6, 'Un **hecho** se puede comprobar: una fecha, una cifra, un suceso. Una **opinión** es una valoración.', { title: 'Comprobar o valorar' }),
      sc(6, 'Palabras que delatan opinión: «mejor», «peor», «debería», «lamentable», «excelente», «a mi juicio».', { title: 'Palabras de opinión' }),
      sc(6, 'Un texto mezcla los dos: los hechos sirven de apoyo a las opiniones.', { title: 'Hechos al servicio de opiniones' }),
    ], [
      PU_SUB('Sobre el metro de Medellín', [
        { text: 'El metro de Medellín se inauguró en 1995.|Es el mejor sistema de transporte del país.|Moviliza cerca de un millón de viajes en un día hábil.|Debería extenderse a todos los municipios del valle.', ask: 'Toca los hechos', answer: [0, 2] },
      ], 'La fecha y la cifra de viajes se pueden comprobar; «el mejor» y «debería» son opiniones.',
        'Pregúntate si cada frase se podría verificar con un registro o un dato.'),
      PU_SUB('Sobre la papa', [
        { text: 'La papa llegó a Europa desde los Andes.|Es el alimento más rico que existe.|Hay miles de variedades nativas.|Sería un error dejar que se pierdan.', ask: 'Toca las opiniones', answer: [1, 3] },
      ], '«El más rico» y «sería un error» son valoraciones; el origen y las variedades se pueden comprobar.',
        'Pregúntate si cada frase se puede verificar o si valora.'),
    ]),
  ] },

  // ---------------- 26 · Dos textos ----------------
  { world: 'pu-dos-textos', title: 'Lectura de dos textos', block: 'lectura', lessons: [
    PU_L('pu-dt-1', 'Coincidencias y diferencias', [
      sc(6, 'Las últimas preguntas del examen comparan los dos textos. Conviene una tabla: tema, postura y argumentos de cada uno.', { title: 'Una tabla de comparación' }),
      sc(6, 'Dos textos pueden tratar el mismo tema con **enfoques** distintos: económico, ambiental, ético, personal.', { title: 'Mismo tema, otro enfoque' }),
      sc(6, 'Una coincidencia debe estar en los dos textos; si solo está en uno, no es coincidencia.', { title: 'En los dos' }),
    ], [
      PU_SUB('Texto A: «La inteligencia artificial puede ayudar a los profesores a corregir más rápido.» Texto B: «Si una máquina corrige, el estudiante pierde la conversación con su profesor.»', [
        { title: 'Un estudiante comparó los dos textos así:', text: 'Los dos hablan de la IA en la educación;|los dos la rechazan;|A destaca una ventaja y B, un riesgo;|y B propone prohibirla.', ask: 'Toca lo que es cierto de la comparación', answer: [0, 2] },
      ], 'Comparten tema; A ve una ventaja y B un riesgo. A no rechaza la IA y B no habla de prohibirla.',
        'Para cada afirmación, revisa si se cumple en A y en B por separado.'),
      PU_ES('El texto A habla del páramo por el agua que da a las ciudades; el B, por los campesinos que viven allí', [['mismo tema, distinto enfoque', 'temas distintos'], ['A: ambiental; B: social', 'A: social; B: económico']],
        'Los dos tratan el páramo; A lo mira por el agua (ambiental) y B por la gente (social).',
        'Pregúntate sobre qué escriben los dos y desde qué punto de vista lo mira cada uno.'),
    ]),
    PU_L('pu-dt-2', 'Qué diría el otro autor', [
      sc(6, 'Otra pregunta común: qué opinaría el autor de un texto sobre lo que dice el otro.', { title: 'Ponerse en sus zapatos' }),
      sc(6, 'Se responde usando la **tesis** de ese autor como lente para juzgar la idea del otro.', { title: 'Su tesis como lente' }),
      sc(6, 'La respuesta no puede contradecir lo que ese autor ya dijo en su propio texto.', { title: 'Coherencia' }),
    ], [
      PU_SUB('Autor A: «Leer en papel ayuda a concentrarse.» Autor B: «Lo importante no es el soporte sino el hábito.»', [
        { title: 'Una estudiante imaginó la respuesta de B:', text: 'B le diría a A que el papel no basta si no hay hábito,|que hay que prohibir las pantallas|y que leer, en el fondo, no importa.', ask: 'Toca lo que B sí diría según su tesis', answer: [0] },
      ], 'Para B lo decisivo es el hábito, así que el papel solo no alcanza.',
        'Usa la tesis de B («no es el soporte sino el hábito») para juzgar la idea de A.'),
      PU_SUB('A: «Las redes sociales acercan a las familias que viven lejos.» B: «Las redes nos alejan de quienes tenemos al lado.»', [
        { title: 'Así imaginó un estudiante el diálogo:', text: 'B le respondería a A que olvida a los que están cerca,|que está de acuerdo en todo con él|y que los dos hablan de temas distintos.', ask: 'Toca lo que B sí respondería según su tesis', answer: [0] },
      ], 'A mira a los que están lejos; B, a los que están cerca: le reprocharía ese olvido.',
        'Fíjate en a quiénes mira cada autor: a los de lejos o a los de cerca.'),
    ]),
  ] },

  // ---------------- 27 · Referencia y cohesión ----------------
  { world: 'pu-referencia', title: 'Referencia y cohesión', block: 'lectura', lessons: [
    PU_L('pu-rf-1', 'Pronombres y referentes', [
      sc(6, 'Pronombres como «él», «esto», «aquello» o «lo cual» reemplazan algo dicho antes: su **referente**.', { title: 'El referente' }),
      sc(6, 'Para hallarlo se busca hacia atrás y se prueba reemplazando: si la frase conserva el sentido, ese es.', { title: 'Probar reemplazando' }),
      sc(6, '«Este» señala lo más cercano y «aquel» lo más lejano: «Vinieron Ana y Luis; este se quedó, aquella se fue.»', { title: 'Este y aquel' }),
    ], [
      PU_SUB('Encuentra los referentes', [
        { text: 'Los estudiantes sembraron una huerta en el patio,|lo cual|redujo la basura orgánica del colegio.', ask: 'Toca a qué se refiere «lo cual»', answer: [0] },
        { text: 'Laura|le prestó el libro|a su hermana|porque ella quería leerlo.', ask: 'Toca a quién se refiere «ella»', answer: [2] },
      ], '«Lo cual» retoma toda la acción de sembrar la huerta. «Ella» es la hermana: quien quería leerlo es quien recibe el libro, no la dueña.',
        'Reemplaza el pronombre por cada candidato y lee la frase: solo uno tiene sentido.'),
      PU_SUB('Este y aquel', [
        { text: 'El alcalde|y el gobernador|se reunieron ayer.|Este anunció recursos;|aquel, solo promesas.', ask: 'Toca a quién se refiere «este»', answer: [1] },
        { text: 'El alcalde|y el gobernador|se reunieron ayer.|Este anunció recursos;|aquel, solo promesas.', ask: 'Toca a quién se refiere «aquel»', answer: [0] },
      ], '«Este» señala al más cercano en el texto (el gobernador) y «aquel», al más lejano (el alcalde).',
        'Mira cuál de los dos nombres quedó más cerca del pronombre.'),
    ]),
    PU_L('pu-rf-2', 'Sustituciones y elipsis', [
      sc(6, 'Para no repetir, se nombra lo mismo con otra palabra: «el gato… el felino». Es una **sustitución léxica**.', { title: 'Otra palabra, lo mismo' }),
      sc(6, 'La **elipsis** omite lo que ya se dijo: «Ana estudia Medicina; Juan, Derecho» (se omite «estudia»).', { title: 'Elipsis' }),
      sc(6, 'En la escritura, la coma suele marcar el lugar de lo omitido.', { title: 'La coma de la elipsis' }),
    ], [
      PU_SUB('Una noticia sobre el cóndor', [
        { text: 'El cóndor|volvió a verse en Boyacá.|El ave|había desaparecido de la zona hace décadas.', ask: 'Toca el trozo que nombra de otro modo al cóndor', answer: [2] },
      ], '«El ave» retoma al cóndor sin repetir su nombre.',
        'Busca otro sustantivo que se refiera al mismo animal.'),
      PU_SUB('Dos preferencias', [
        { text: 'Mi hermana prefiere el mar;|yo,|la montaña.', ask: 'Toca el trozo donde se omitió una palabra ya dicha', answer: [1] },
      ], 'En «yo, la montaña» se omite «prefiero»: la coma marca el hueco.',
        'Lee la segunda parte y piensa qué verbo falta.'),
    ]),
  ] },

  // ---------------- 28 · Lenguaje figurado ----------------
  { world: 'pu-figurado', title: 'Lenguaje figurado', block: 'lectura', lessons: [
    PU_L('pu-lf-1', 'Figuras literarias', [
      sc(6, '**Metáfora**: decir que A es B («sus ojos eran dos faroles»). **Comparación**: con «como» («ojos como faroles»).', { title: 'Metáfora y comparación' }),
      sc(6, '**Personificación**: dar acciones humanas a cosas («el viento susurraba»). **Hipérbole**: exagerar («te lo dije un millón de veces»).', { title: 'Personificación e hipérbole' }),
      sc(6, 'La pregunta del examen suele ser qué **significa** la figura en el texto, más que su nombre.', { title: 'Qué quiere decir' }),
    ], [
      PU_SUB('Una mañana en la ciudad', [
        { text: 'La ciudad despertó con hambre de sol.|Sus calles eran ríos de gente.|El tráfico avanzaba como una tortuga cansada.|Esperé mil años el bus.', ask: 'Toca la comparación', answer: [2] },
        { text: 'La ciudad despertó con hambre de sol.|Sus calles eran ríos de gente.|El tráfico avanzaba como una tortuga cansada.|Esperé mil años el bus.', ask: 'Toca la hipérbole', answer: [3] },
      ], 'La comparación usa «como»; esperar «mil años» es una exageración.',
        'La comparación tiene una palabra que la delata; la hipérbole, una cifra imposible.'),
      PU_ES('«Ese examen fue una montaña.» ¿Qué figura es y qué significa?', [['metáfora', 'comparación'], ['fue muy difícil', 'fue largo de leer']],
        'Dice que el examen «fue» una montaña sin usar «como»: metáfora. Una montaña cuesta subirla: fue difícil.',
        'Fíjate si aparece la palabra «como» y piensa qué cuesta de una montaña.'),
    ]),
    PU_L('pu-lf-2', 'Ironía', [
      sc(6, 'La **ironía** dice lo contrario de lo que se piensa. El contexto la delata: lo que se dice choca con lo que pasa.', { title: 'Decir lo contrario' }),
      sc(6, '«Qué puntual», dicho a quien llega una hora tarde, es ironía.', { title: 'Un ejemplo' }),
      sc(6, 'Para reconocerla se compara el tono de la frase con los hechos que la rodean.', { title: 'Tono contra hechos' }),
    ], [
      PU_SUB('Un mal comienzo', [
        { text: 'Llegué empapado, sin paraguas y con el bus perdido.|«Qué día tan perfecto», le dije al portero.', ask: 'Toca la frase irónica', answer: [1] },
      ], 'Llamar «perfecto» a un día de lluvia y bus perdido es decir lo contrario de lo que se piensa.',
        'Compara lo que le pasó con lo que dice del día.'),
      PU_ES('«Excelente servicio: solo esperé tres horas.» ¿Qué hace el autor?', [['el dato contradice el elogio', 'el dato confirma el elogio'], ['critica el servicio', 'agradece el servicio']],
        'Tres horas de espera no son un buen servicio: el elogio es irónico y la frase critica.',
        'Fíjate si tres horas de espera encajan con la palabra «excelente».'),
    ]),
  ] },
];

// Mundos de lectura rehechos con textos de verdad (spec 2026-11-19-preuda-lectura-textos): cada js/courses/preuda-l-<mundo>.js
// empuja aquí su función; preuda-lectura-juegos.js las aplica.
const PU_LEC_JUEGOS = [];
