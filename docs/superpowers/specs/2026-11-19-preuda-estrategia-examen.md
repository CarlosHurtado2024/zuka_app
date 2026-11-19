# Preuniversitario UdeA: cómo estructurar el curso para un puntaje muy alto

Fecha: 2026-11-19. Análisis y propuesta; todavía no hay nada implementado.

## 1. En qué se basa

- **Exámenes reales** (`Documents/PreU`): leídos con texto completo 2026-1 (80 preguntas), 2024-2 (80), 2025-1 (lectura completa y
  razonamiento 41–64) y, solo razonamiento, 2023-2 y 2025-2. Los dos escaneados (2024-1 y «con Respuestas») **no** se clasificaron
  pregunta por pregunta. Son unas 270 preguntas clasificadas a mano; los porcentajes de abajo son rangos, no cifras exactas.
- **Curso en la app** (`COURSES` → `preuda`): 16 mundos y 57 lecciones de razonamiento (7 u 8 juegos cada una, evaluación por
  mundo); 12 mundos y 33 lecciones de lectura (2 ejercicios cada una). Ninguna lección tiene video publicado.
- **Los 10 simulacros nuevos** (`docs/simulacros`): 800 preguntas originales con el formato del examen.

No se puede garantizar un puntaje: el corte depende de la carrera y de quienes se presenten. Lo que sí se puede es cerrar la
distancia entre «entender el tema» y «acertar 70 de 80 en tres horas», que es donde hoy está el vacío.

## 2. Qué pide el examen

### Formato
80 preguntas en 3 horas (2 min 15 s por pregunta), 40 de lectura y 40 de razonamiento, cuatro opciones, sin calculadora.

### Competencia lectora
- Dos textos sobre un mismo tema (entre 1.200 y 1.600 palabras en total); unas 21 preguntas del primero, 13 del segundo y 5 o 6
  que cruzan los dos.
- Géneros vistos: divulgación periodística (2026-1, 2024-2), ensayo literario (2023-2) y testimonio (2025-1). El género cambia
  mucho el tipo de pregunta: el testimonio no trajo ningún «EXCEPTO»; el periodístico trajo 10 y 13.
- Por conteo de palabras clave en los enunciados (2024-2, 2025-1, 2026-1): unas 25 de 40 preguntas remiten a un párrafo concreto;
  9 a 11 son de vocabulario o expresión en contexto; 4 a 6 de referente («la primera alude a»); 3 a 5 de inferencia; hasta 8 de
  función de un párrafo o de un signo; 4 a 8 de completar espacios («el tono del texto Uno es ___»); 2 a 4 de tono o intención.
- Rasgo decisivo: casi todas se responden **volviendo al párrafo**. Gana quien verifica en el texto, no quien recuerda.

### Razonamiento lógico (rangos sobre las ~190 preguntas clasificadas)

| Tipo | Peso aprox. | Mundo de la app | Estado |
|---|---|---|---|
| Acertijos de condiciones: orden, asignación, juegos con reglas, verdad y mentira | 18–22 % | Orden y asignación; Lógica 5 | Cubierto; es el mundo 3, debería ir antes |
| Proporcionalidad, porcentajes, tasas, trabajo | 12–15 % | Proporcionalidad | Cubierto |
| Geometría y medida (áreas sombreadas, volúmenes, semejanza) | 10–15 % | Geometría | Cubierto |
| Planteamiento, promedios, edades, fracciones de lo que queda | ~10 % | Aritmética; Ecuaciones | Cubierto |
| Conteo y probabilidad | 8–10 % | Conteo; Probabilidad | Cubierto |
| Cuadrículas con reglas (llenar, colorear, contar llenados) y espacial | 8–10 % | Espacial | **Falta el llenado con reglas** |
| Dígitos, divisibilidad, criptoaritmética | 5–8 % | Teoría de números; Aritmética 3 | Cubierto |
| Códigos y sistemas de numeración inventados | 5–8 % | Codificación | Cubierto en parte |
| Operadores definidos y programas paso a paso | 5–8 % | Operadores | **Falta seguir un algoritmo** |
| Secuencias numéricas y de figuras | 5–8 % | Secuencias | Cubierto |
| Tablas y gráficas | 5–8 % | Tablas y gráficas | Cubierto |
| Conjuntos | 3–5 % | Conjuntos | Cubierto |
| Negación, condicional, cuantificadores | 3–5 % | Lógica 1–4 | Cubierto |

Tres rasgos que no son temas y pesan más que cualquier tema:

1. **Bloques de contexto.** En 2026-1, 17 de las 40 preguntas iban en bloques de dos o tres con un enunciado común largo.
2. **El enunciado de la pregunta es lógico.** «De la única que se tiene certeza», «la única que no es posible», «son posibles: I y
   II», «la única falsa». Muchos fallos no son de cálculo: son de confundir *puede ser* con *tiene que ser*.
3. **Reglas nuevas.** Buena parte de los problemas definen un juego, un código o una operación que el estudiante nunca ha visto.
   Lo que se mide es leer reglas con precisión y probar casos.

## 3. Dónde está el vacío hoy

1. **Lectura está subatendida.** Es la mitad del puntaje y tiene 66 ejercicios frente a unos 400 de razonamiento. Cada lección
   tiene dos ejercicios, casi siempre `subraya-texto`, y usa `escala-solucion` y `ordena-terminos`, que el estándar del proyecto
   ya descartó. Los textos son cortos; el examen exige sostener la atención en 700 palabras y volver a ellas veinte veces.
2. **Falta la capa de transferencia.** Los juegos enseñan la idea y hacen las cuentas por el estudiante, que es lo correcto para
   entender. Pero el examen pide resolver a mano, elegir entre cuatro opciones con distractores y hacerlo en dos minutos. Entre
   una cosa y la otra hoy no hay nada.
3. **No hay práctica con el formato real** dentro de la app: ni bloques de contexto, ni «EXCEPTO», ni simulacros cronometrados de
   80 preguntas, ni informe por tipo de pregunta.
4. **No hay repaso de errores.** Lo que se falla no vuelve.
5. **El orden no sigue el peso del examen.** Lo más frecuente (acertijos de condiciones) es el mundo 3 y la lógica, el 10.
6. **Finales repetidos.** `vuela-precios` y `rompe-cambios` cierran unas 40 lecciones y no tienen relación con el tema.
7. **Sin videos.** Solo el mundo 1 está producido y espera sus ID.

## 4. Estructura propuesta

### Tres capas por tema
1. **Entender** (lo que ya existe): video con un reto real del examen, y juegos que construyen la idea.
2. **Resolver a mano** (nueva): 6 a 10 preguntas con el formato del examen, sin reloj, con solución paso a paso y explicación de
   por qué cada distractor atrae. Va fuera de la lección, en un espacio propio («Entrenamiento»), para no romper el estándar de
   lecciones sin opción múltiple. Es la única excepción a esa regla y es necesaria: el examen *es* de opción múltiple.
3. **Rendir** (nueva): series mezcladas con tiempo y simulacros completos, con informe por tipo.

### Razonamiento: cuatro fases
- **Fase 0, diagnóstico:** 20 + 20 preguntas en 90 minutos. Define por dónde empieza cada estudiante.
- **Fase 1, herramientas:** cálculo mental, proporcionalidad y porcentajes, planteamiento de ecuaciones.
- **Fase 2, núcleo del examen:** acertijos de condiciones, lógica, conjuntos, conteo y probabilidad, tablas y gráficas,
  secuencias, códigos, operadores, teoría de números.
- **Fase 3, forma y espacio:** geometría y razonamiento espacial.
- **Fase 4, transferencia** (mundo nuevo, «El examen por dentro»), con cinco lecciones:
  1. Certeza, posibilidad e imposibilidad.
  2. Leer reglas nuevas (un juego inventado en cada ejercicio).
  3. Bloques de contexto: una situación, tres preguntas.
  4. Seguir un programa paso a paso.
  5. Estimar y descartar opciones (orden de magnitud, paridad, última cifra).
- Además, una lección «Cuadrículas con reglas» en Espacial y otra de «Sistemas de numeración» en Codificación.

### Lectura: rehacerla alrededor de textos de tamaño real
- Cada lección trabaja **un solo texto de 350 a 500 palabras** que se queda en pantalla durante sus 7 ejercicios; el último mundo
  usa parejas de textos de 600 a 800 palabras cada uno.
- Los mundos siguen los tipos de pregunta del examen (los 12 actuales sirven), pero cada lección pasa de 2 a 7 ejercicios y
  termina con 5 preguntas en formato real sobre el mismo texto.
- **Biblioteca de lecturas**: parejas de textos por género (divulgación, ensayo, testimonio, crónica), cada una con sus 40
  preguntas. Las 10 parejas de los simulacros ya existen.
- Hábito diario: un texto corto y 5 preguntas, 10 minutos. El volumen de lectura es lo que más mueve este componente.

## 5. Juegos nuevos

Todos gráficos, de arrastrar, sin reloj y con demostración sobre el lienzo.

### Lectura (kit `LEC`: texto en párrafos numerados que se puede tocar, resaltar y enlazar)
| Juego | Qué hace el estudiante | Pregunta del examen que entrena |
|---|---|---|
| `mapa-del-texto` | Arrastra etiquetas (plantea, ejemplifica, matiza, objeta, concluye) a cada párrafo; se arma el esqueleto | Función de un párrafo |
| `hilo-referente` | Tira un hilo desde «este último» o «aquella» hasta lo que nombra | Referentes |
| `lupa-evidencia` | Mueve una lupa por el texto hasta la línea que sostiene una afirmación; tres bandejas: dicho, inferido, no dicho | Información explícita e inferencia |
| `intruso-excepto` | Lleva cada una de cuatro tarjetas al párrafo que la respalda; la que no encuentra casa es la respuesta | EXCEPTO |
| `palabra-a-la-medida` | Encaja sinónimos en el hueco de la oración; una balanza muestra cuánto cambia el sentido | Vocabulario en contexto |
| `termometro-tono` | Suelta frases sobre un dial (irónico, crítico, neutral, entusiasta) y la aguja responde | Tono e intención |
| `balanza-argumento` | Pone oraciones del lado que apoya o debilita la tesis; la balanza se inclina | Tesis, argumentos, «qué debilitaría» |
| `conector-bisagra` | Desliza conectores en la bisagra entre dos oraciones; cambia el dibujo de la relación | Conectores |
| `quien-lo-dice` | Arrastra citas hacia el autor, el experto o los críticos | Voces y posturas |
| `puente-dos-textos` | Reparte ideas en «solo Uno», «solo Dos», «ambos» (reutiliza el Venn de conjuntos) | Preguntas sobre los dos textos |
| `caso-nuevo` | Empareja el principio del texto con la situación que lo repite | Aplicación y analogía |
| `signos-que-hablan` | Toca rayas, comillas y dos puntos y elige su oficio en esa oración | Función de signos |

### Razonamiento
| Juego | Qué hace el estudiante |
|---|---|
| `mundos-posibles` | Ve todas las soluciones válidas de un acertijo como tarjetas y reparte afirmaciones en «siempre», «a veces», «nunca». Es el más importante: enseña qué significa «certeza» |
| `regla-nueva` | Prueba jugadas en un juego inventado hasta entender la regla; después responde |
| `sigue-programa` | Una ficha recorre las instrucciones y el estudiante arrastra los valores a la tabla de seguimiento |
| `rejilla-reglas` | Llena o colorea una cuadrícula; las casillas que rompen la regla se encienden |
| `descarta-opciones` | Tacha opciones arrastrando un argumento (es par, termina en 5, es demasiado grande) sin hacer la cuenta completa |
| `bloque-contexto` | Una escena (galería, torneo, tabla) que se manipula y sobre la que caen tres preguntas seguidas |

Y reemplazar los finales `vuela-precios` y `rompe-cambios` por un juego en movimiento propio de cada lección.

## 6. Funcionalidades

**Las que más suben el puntaje**
1. **Banco de preguntas tipo examen**, etiquetadas por tipo, dificultad y tiempo objetivo. Semilla: los simulacros. Como lo que
   entra a la app queda visible en el código, conviene pasar cinco simulacros al banco y guardar cinco para aplicar en papel.
2. **Simulacros cronometrados en la app** sobre el motor de `js/exam.js`: completo (80 en 3 h), medio (40 en 90 min) y series de
   10. Informe por tipo de pregunta, tiempo por pregunta y comparación con el intento anterior.
3. **Cuaderno de errores con repaso espaciado**: cada pregunta fallada vuelve a 1, 3, 7 y 21 días. Al fallar, el estudiante marca
   la causa (no entendí el enunciado, me equivoqué en la cuenta, caí en la trampa, se me acabó el tiempo); el informe muestra cuál
   domina.
4. **Diagnóstico y ruta personal**: el mapa de mundos se ordena por lo más débil y más frecuente en el examen; un tablero de
   dominio muestra los 13 tipos de razonamiento y los 12 de lectura.

**Las que sostienen el hábito**
5. **Plan con fecha**: el estudiante pone el día del examen y la carrera; la app reparte lecciones, entrenamiento y simulacros por
   semana y avisa si se atrasa.
6. **Lectura diaria** con racha, y **vocabulario propio**: cada palabra que marca en un texto se guarda con su oración.
7. **Entrenador de ritmo** (solo en simulacros): barra de avance contra el tiempo y la estrategia de dos pasadas, que el motor ya
   permite con «saltar».
8. **Solución en tres niveles**: pista, planteamiento y desarrollo completo; para los tipos frecuentes, un video de dos minutos.

**Para el preuniversitario presencial y el plan Pro**
9. **Hoja de respuestas digital**: el estudiante que hizo un simulacro en papel digita sus 80 letras y recibe el mismo informe.
10. **Panel del tutor** en `/admin`: avance por estudiante y tipos débiles del grupo, para orientar las tutorías.
11. **Meta por carrera**: puntaje estimado frente al corte histórico. Necesita los cortes de la UdeA, que hay que conseguir.

## 7. Cómo saber que funciona

- Meta por estudiante antes del examen: 85 % de acierto en cada tipo del banco, dos minutos o menos por pregunta y tres simulacros
  completos seguidos con 65 o más de 80.
- Con los primeros 30 estudiantes, calcular la dificultad real de cada pregunta y recalibrar el banco.
- Comparar el puntaje de admisión con el último simulacro para saber si la app predice bien. Sin ese dato no se puede afirmar que
  la probabilidad de pasar subió.

## 8. Orden de trabajo

1. **Lectura** con el kit `LEC`, sus 12 juegos y lecciones de 7 ejercicios, más el banco de preguntas y los simulacros en la app.
2. Cuaderno de errores, diagnóstico y tablero de dominio.
3. Mundo «El examen por dentro», las dos lecciones que faltan y el cambio de los finales repetidos.
4. Videos de razonamiento (mundos 2 a 16) y de lectura, con el modelo del mundo 1.
5. Plan con fecha, vocabulario, hoja digital y panel del tutor.

## 9. Pendiente de verificar

- Clasificar pregunta por pregunta los exámenes 2024-1 y «con Respuestas» (escaneados) y lo que falta del 2025-1.
- Confirmar con la UdeA la fórmula del puntaje y los cortes por carrera.
- Revisar si los textos de lectura actuales de la app se pueden alargar o hay que escribirlos de nuevo.
