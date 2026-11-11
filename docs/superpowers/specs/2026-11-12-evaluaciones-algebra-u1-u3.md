# Evaluaciones de las unidades 1, 2 y 3 de Álgebra

## Qué pidió el usuario
Una evaluación al final de las unidades 1 (Sistemas numéricos y axiomas), 2 (Razones, proporciones y
porcentajes) y 3 (Potenciación y radicación) de Álgebra: ejercicios creativos con un estilo nuevo respecto a
las lecciones, tiempo límite y, al final, retroalimentación de lo que está bien y de lo que se debe repasar.

## Decisiones
- **Dónde:** un nodo de trofeo al final del camino de cada mundo (`renderWorld`). Se abre cuando todas las
  lecciones del mundo están hechas (o en modo revisión). No cuenta como lección (no cambia `lessonsOf`, los
  contadores ni el desbloqueo de mundos), así que el progreso guardado no se toca.
- **Datos:** `unit.exam = { id, title, minutes, items: [{ lesson, review, ex }] }`. Cada pregunta indica la
  lección que evalúa (`lesson`) y una nota de repaso (`review`) que se muestra si se falla.
- **Modo examen** (`js/exam.js`, `startExam`):
  - cronómetro con cuenta regresiva (Unidad 1: 15 min; 2 y 3: 12 min); en rojo en el último minuto; al llegar
    a cero se entrega sola y lo que falte cuenta como «sin responder»;
  - no se dice si la respuesta es correcta hasta el final (no se llama `lock`); no se pierden vidas;
  - «Saltar» manda la pregunta al final; la segunda vez el botón dice «Dejar en blanco»;
  - la pista sigue en cada pregunta, pero usarla hace que la pregunta valga la mitad (lo dice el botón);
  - puntos de seguimiento arriba: uno por pregunta (pendiente, actual, respondida, en blanco).
- **Informe final** (`examReport`, pura y probada en Node):
  - porcentaje (correcta 1, con pista ½), mensaje según el nivel, correctas, tiempo usado y XP;
  - «Lo que dominas»: lecciones con todas sus preguntas bien sin pista;
  - «Para repasar»: lecciones con algo mal (o bien solo con pista), con la nota de repaso de cada pregunta
    fallada y un botón «Repasar» que abre esa lección;
  - «Pregunta por pregunta»: resultado, respuesta correcta y explicación;
  - se guarda el mejor resultado en `S.exams[id]` y se muestra en el nodo.
- **Estilo nuevo:** cuatro mecánicas que no existen en las lecciones, parametrizadas para servir a las tres
  unidades:
  - `laberinto-valor`: cuadrícula de casillas; se traza un camino de la entrada a la salida pisando solo las
    casillas que cumplen una regla (enteros, irracionales, afirmaciones verdaderas, «vale 25 %», «vale 64»…);
  - `domino-equivalencias`: fichas de dominó con dos caras; se encadenan desde una cara fija de salida hasta
    una de llegada, uniendo caras que valen lo mismo escritas de forma distinta. Sobran fichas trampa;
  - `piramide-numerica`: pirámide donde cada bloque es la suma o el producto de los dos de abajo; se arrastran
    fichas (con trampas) a los bloques vacíos;
  - `detective-pasos`: una solución resuelta paso a paso con un error; se toca la línea equivocada y se elige
    cómo debía quedar.
  - Cada examen trae además una pregunta numérica de situación.
- Todo se ve en tema claro y oscuro (colores de `api.palette` y variables CSS) y a 300–380 px.
