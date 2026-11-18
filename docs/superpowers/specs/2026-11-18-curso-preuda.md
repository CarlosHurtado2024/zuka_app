# Curso Preuniversitario UdeA

Pedido del usuario (2026-11-18): un curso **Preuniversitario UdeA** (se pidió primero como «preUDA») con dos componentes, **Razonamiento lógico** y **Comprensión
lectora**, con sus mundos y lecciones sacados de `Contenidos_Preuniversitario_UdeA_Zuka.pdf` (contenidos detallados,
temas por prioridad según exámenes reales: 40 preguntas de cada componente, 50 % cada uno, sin calculadora).

## Estructura

- Curso `preuda` («Preuniversitario UdeA», nivel «Admisión», icono «pU», color lima `#a3e635`: el único tono libre entre los siete
  cursos). Vive en `js/courses/preuda.js` (va después de los demás cursos y antes de `data.js`).
- Cada unidad = un mundo, con `block: 'razonamiento' | 'lectura'`. `COURSE_PREUDA.blocks` da nombre y descripción de cada
  componente. El mapa de mundos muestra un **encabezado de componente** antes del primer mundo de cada bloque
  (`.wblock`), y la numeración de mundos sigue corrida.
- **Actualización (pedido del usuario, 2026-11-18): al entrar al curso se eligen primero los componentes.** La pestaña
  Aprender muestra la portada del curso y dos tarjetas (`renderComponents`): nombre, descripción, mundos, lecciones,
  avance y la lección que sigue; «aquí ibas» marca el componente de la última lección abierta. Al tocar una se abre la
  vista del componente (`openBlock`): botón «Componentes», portada del componente, «Sigue aquí» y solo sus mundos,
  numerados desde 1 dentro del componente (`worldNo`). «Siguiente mundo» no salta al otro componente. Cambiar de curso,
  volver a tocar Aprender o el botón atrás del celular regresan a los componentes. Reemplaza al encabezado `.wblock`.
- **Cada componente se abre por su cuenta**: la primera lección de cada bloque está abierta aunque no se haya
  terminado el bloque anterior (`isUnlocked` mira el bloque) y es gratis como la primera del curso (`catalogo`). Así un
  estudiante puede empezar por lectura; «Sigue aquí» sigue en el componente de la última lección abierta
  (`currentLesson`, `S.lastLesson`) y no salta al otro componente.
- En lectura, `subraya-texto` siempre trae un texto corrido (un resumen de un compañero, una escena, una noticia),
  nunca una lista de opciones sueltas: eso sería opción múltiple disfrazada.
- Un mundo por tema del PDF, en el orden del PDF (prioridad): 16 de razonamiento y 12 de lectura, 28 mundos, ids
  `pu-…`. Nombres de capítulo, sin lugares de cuento (como los demás mundos); lámina neón propia.
- El curso nace como **borrador** (no está en `CURSOS_LISTOS`): solo lo ven el administrador y `localhost` hasta que
  se habilite desde el panel.

## Mundos y lecciones (90)

### Componente 1 · Razonamiento lógico (57 lecciones)

| # | Mundo | Prioridad | Lecciones |
|---|---|---|---|
| 1 | Cálculo Mental | base | Enteros, signos y jerarquía · Fracciones · Decimales y porcentajes · Potencias, raíces y estimación |
| 2 | Geometría Plana y Sólida | alta | Ángulos y paralelas · Triángulos y Pitágoras · Semejanza y escala · Perímetros, áreas y círculos · Áreas sombreadas y cuadrícula · Volúmenes y superficies |
| 3 | Acertijos de Orden | alta | Orden en línea · Orden circular · Tablas de doble entrada · Condiciones: tiene que, podría, no puede |
| 4 | Proporcionalidad | alta | Razones, repartos y escalas · Regla de tres simple y compuesta · Velocidad y trabajo conjunto · Porcentajes · Aumentos, descuentos e IVA |
| 5 | Conteo y Combinatoria | alta | Principio multiplicativo y árboles · Permutaciones · Combinaciones · Conteo por casos y complemento · Contar figuras y caminos |
| 6 | Razonamiento Espacial | alta | Rejillas y caminos · Vistas y cubos · Desarrollos del cubo · Giros, espejos y dobleces |
| 7 | Secuencias y Patrones | media | Sucesiones numéricas · Letras y figuras · Patrones cíclicos |
| 8 | Códigos y Claves | media | Claves de sustitución · Deducir la regla |
| 9 | Tablas y Gráficas | media | Leer gráficas · Promedio, mediana y moda · Qué se puede concluir |
| 10 | Lógica Proposicional | media | Conectivos y tablas de verdad · Negación y De Morgan · El condicional · Cuantificadores y silogismos · Verdad y mentira |
| 11 | Operadores Definidos | media | Operaciones nuevas · Anidados y ecuaciones |
| 12 | Aritmética y Promedios | media | Fracciones de lo que queda · Promedios · Criptoaritmética · Máximos y mínimos |
| 13 | Ecuaciones con Contexto | media | Del texto a la ecuación · Edades, mezclas y monedas · Sistemas y desigualdades |
| 14 | Conjuntos y Encuestas | media | Operaciones y Venn · Encuestas |
| 15 | Teoría de Números | baja | Primos y divisibilidad · MCM y MCD · Paridad, residuos y última cifra |
| 16 | Azar y Probabilidad | baja | Espacio muestral y Laplace · Complemento e independencia |

### Componente 2 · Comprensión lectora (33 lecciones)

| # | Mundo | Prioridad | Lecciones |
|---|---|---|---|
| 17 | Estrategias de Lectura | base | Prelectura · Idea central y mapa del texto · Tiempo y preguntas EXCEPTO |
| 18 | Tipos de Texto | base | Tipologías · Géneros del examen · Estructura y testimonio |
| 19 | Información Explícita | alta | Ubicar datos · Paráfrasis · Lo que dice y lo que no · Quién dice qué |
| 20 | Inferencia | alta | Ideas implícitas · Presupuestos · Causa y efecto · Actitudes y motivos |
| 21 | Vocabulario en Contexto | alta | Sinónimos según el contexto · Palabras con varios sentidos · Expresiones y frases hechas · Prefijos y raíces |
| 22 | Aplicación y Analogía | media | Aplicar a un caso nuevo · Analogías |
| 23 | Voces y Citas | media | Citas y voces · Posturas y citas externas |
| 24 | Conectores y Funciones | media | Conectores · Función de párrafos y signos |
| 25 | Argumentación y Tono | media | Tesis y argumentos · Intención y tono · Hechos y opiniones |
| 26 | Lectura de Dos Textos | media | Coincidencias y diferencias · Qué diría el otro autor |
| 27 | Referencia y Cohesión | media | Pronombres y referentes · Sustituciones y elipsis |
| 28 | Lenguaje Figurado | baja | Figuras literarias · Ironía |

## Lecciones

- Cada lección tiene escenas de respaldo (`clip.scenes`, 3 o 4) que explican la idea con **intuición primero y regla
  después**, con un ejemplo resuelto, sin preguntas al espectador. Los videos se harán después (formato showreel).
- Ejercicios: al menos dos por lección, todos con pista que orienta sin dar la respuesta, y ningún ejemplo de las
  escenas se repite en los ejercicios. Nada de opción múltiple ni de teclear (`num`):
  - **Razonamiento**: juegos que ya existen y sirven en cualquier curso: `escala-solucion` (decidir el paso que se
    justifica en cada nivel), `arma-la-cuenta` (plantear la cuenta; la calcula el juego), `ordena-terminos` (encadenar
    pasos con «⇒») y `encuesta-venn`. Los juegos propios de cada mundo vendrán después, mundo por mundo, como en Álgebra.
  - **Lectura**: juego nuevo **`subraya-texto`**: el estudiante lee un fragmento y **subraya** (toca) los trozos que
    responden la consigna: el dato, la paráfrasis, el referente de un pronombre, el conector, la voz de un experto, la
    frase irónica. Puede pedir uno o varios trozos (preguntas «EXCEPTO»: subrayar lo que el texto no dice no aplica; se
    pide subrayar lo que sí lo respalda). Se ve como un texto con resaltador, sin reloj. Además `escala-solucion` para
    inferencias y `ordena-terminos` para reconstruir el orden de un texto.
  - Los fragmentos de lectura son textos breves originales (la nota del PDF pide textos originales o de dominio
    público y revisión docente antes de publicar: por eso el curso nace en borrador).

## Juego `subraya-texto`

- `params = { rounds: [{ title?, text, ask, answer: [índices] }] }`. `text` se parte en trozos con «|»; cada trozo es
  un botón. `answer` son los trozos que hay que subrayar (uno o varios).
- `state = { rounds: [{ sel: [índices] }] }`. `grade` es pura: acierta si en cada ronda el conjunto subrayado es
  exactamente `answer`. `solution` cita los trozos correctos entre comillas.
- HTML (no lienzo): el texto largo se lee mejor y se adapta solo a 300 px y a los dos temas (variables de la app).
  Pestañas de rondas arriba, consigna, texto, contador «Subrayaste n». `ready(true)` cuando cada ronda tiene algo
  subrayado. `lock` pinta en verde los correctos y tacha los que sobraban.
- Guía «Cómo se juega» (`GUIDES['subraya-texto']`, escena `tap`).

## Pruebas (`tests/preuda.test.js`)

Curso registrado y en borrador; 28 mundos en el orden del PDF y con `block`; 90 lecciones con escenas y al menos dos
ejercicios con pista; solo juegos permitidos y existentes; índices de `subraya-texto` válidos; cada ronda de
`escala-solucion` con su paso válido primero y opciones distintas; `arma-la-cuenta` con una `sol` que da `answer`;
`grade` de `subraya-texto`; desbloqueo por componente; encabezados de componente en el mapa; figura, paleta, láminas,
registro en `index.html` y `sw.js`.
