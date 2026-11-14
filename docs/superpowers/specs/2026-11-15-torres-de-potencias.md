# Torres de Potencias: ejercicios y juegos dinámicos

Fecha: 2026-11-15. Mundo «Torres de Potencias» (unidad `potencias` de Álgebra): `alg-21a` potencias, `alg-21b` leyes de los
exponentes, `alg-22a` raíces y exponentes racionales, `alg-22b` simplificar y racionalizar. Base: secciones 1.4
(Potenciación) y 1.5 (Radicación) del Manual de Álgebra y Trigonometría, y los cuatro videos zoom del mundo.

Antes: 44 ejercicios (21 de opción múltiple, 4 de tarjetas, 8 cálculos, 2 de ordenar y 9 juegos). Ahora: 23 ejercicios
(21 juegos y 2 cálculos cortos), cada uno con pista. Son menos porque cada juego trae varias rondas. Reglas que se siguieron: «entender, no mecanizar» (ningún juego tiene reloj; el juego dibuja la idea
y hace las cuentas), los ejemplos de los videos no se repiten, y cada lección termina con un juego dinámico de mecánica
propia.

## Base nueva en el kit

`roundsGame(def)`: armazón de juegos por rondas (pestañas arriba, enunciado, pie, estado por ronda, `grade`, `peek`).
`def = { aspect, init, ok, answered?, solution, prompt, foot?, layout?, enter?, draw, press?, drag?, release?, peek? }`.
Estado: `{ rounds: [estado de cada ronda] }`. También `sup(n)` (superíndices), `drawStepper` y `stepHit` (control − valor +).

## Lecciones

### alg-21a · Potencias

| # | Juego | Idea |
|---|---|---|
| 1 | `arbol-potencia` (nuevo) | Un árbol con b ramas por nudo y e niveles tiene bᵉ hojas. Se arma el de 32, 64 (tres formas) y 125 hojas. |
| 2 | `torre-producto` | Doblar la hoja hasta 512 capas (se conserva). |
| 3 | `pares-negativos` (nuevo) | La potencia escrita como factores: se emparejan los negativos y se elige el signo. (−2)⁴, (−2)⁵, −2⁴, −(−2)³. |
| 4 | `une-parejas` | Exponente cero y negativos con su valor. |
| 5 | `torre-pisos` (dinámico, nuevo) | El piso n es aⁿ: planta baja = 1, sótanos = fracciones. Solo se ven la planta baja y el piso 1: hay que contar pisos y entregar cada paquete donde vive su número. Bases 2, 5 y 10. |

### alg-21b · Leyes de los exponentes

| # | Juego | Idea |
|---|---|---|
| 1 | `cuenta-factores` (nuevo) | Las leyes salen de contar x: se juntan (suma), se tachan por parejas (resta, puede dar negativo), el grupo se repite (producto). |
| 2 | `une-parejas` | Expresión con su forma simplificada (se conserva). |
| 3 | `cambia-de-piso` (nuevo) | Tocar una potencia la manda al otro lado de la raya y su exponente cambia de signo. Meta: ningún exponente negativo. |
| 4 | `ordena-terminos` | Pasos para simplificar (3x⁻²y³)⁻² (se conserva). |
| 5 | `salta-la-coma` (nuevo) | Correr el punto decimal: el exponente de 10 lo compensa. Dos rondas hacia notación científica y dos de regreso. |
| 6 | `escala-leyes` (dinámico, nuevo) | El exponente es un piso: «· xᵏ» sube k, «÷ xᵏ» baja k, «( )ᵏ» multiplica el piso. Hay que usar todas las tarjetas en el orden que deja al escalador en la bandera. |

La parte 2 del video viejo (`more`) pasa a ir antes del tercer ejercicio.

### alg-22a · Raíces y exponentes racionales

| # | Juego | Idea |
|---|---|---|
| 1 | `lado-del-cuadrado` | La raíz es el lado del cuadrado (se conserva). |
| 2 | `reparte-factores` (nuevo) | a^(m/n): el denominador reparte los factores primos en n grupos iguales, el numerador dice cuántos tomar. |
| 3 | `une-parejas` | Potencias de exponente fraccionario con su valor (se conserva). |
| 4 | cálculo | √(64 + 36): la raíz no se reparte en la suma. |
| 5 | `siembra-raices` (dinámico, nuevo) | Una semilla por entero; cada una crece hasta xⁿ. «xⁿ = a» puede tener dos, una o ninguna respuesta; «ⁿ√a» es un solo número. Se eligen y se siembra para verlo. |

### alg-22b · Simplificar y racionalizar

| # | Juego | Idea |
|---|---|---|
| 1 | `saca-del-radical` | Parejas de primos que salen de la raíz (se conserva). |
| 2 | `parte-baldosa` (nuevo) | Baldosa de área n partida en k × k baldosas de área entera: √n = k·√(n/k²). Se busca la cuadrícula más fina. |
| 3 | cálculo | √20 + √80 = k√5. |
| 4 | `tabla-conjugado` (nuevo) | Se elige por cuál multiplicar el denominador y el juego hace la tabla término a término: se ve qué se cancela. |
| 5 | `une-parejas` | Fracción con su forma racionalizada (se conserva). |
| 6 | `ordena-terminos` | Pasos para racionalizar 6/(3 + √7) (se conserva). |
| 7 | `muro-radicales` (dinámico, nuevo) | Ladrillos de largo √n a escala; los compuestos traen costuras (√12 = dos de √3). Se arma una fila que mida lo pedido: solo se juntan los del mismo tipo. |

## Juegos dinámicos

Usan `makeArcade` (tres vidas por ronda; sin vidas la ronda empieza otra vez) pero **sin reloj**: nada avanza solo ni se
acaba. El cartel de inicio dice «Sin prisa». Mientras se muestra un acierto sigue en pantalla la pregunta respondida.
Mecánicas: mover un ascensor y entregar, ordenar tarjetas de operaciones, elegir puntos y verlos crecer, armar una fila
con ladrillos a escala. Ninguna repite las de los otros mundos.

## Pruebas

`tests/torres-de-potencias.test.js`: que el mundo no tenga opción múltiple ni tarjetas, que cada lección termine con su
juego dinámico y que este no tenga reloj, lógica pura de los doce juegos y validez de cada ronda (soluciones que existen,
órdenes que no vienen resueltos, una sola opción buena en la tabla, metas que caben). `tests/contenido-unidad1.test.js`
se ajustó: comprobaba dos preguntas de opción múltiple que ya no existen. En el navegador se prueban con
`tests/robot-torres.js` (se carga con `fetch` + `eval` en la página): resuelve cada juego con `peek()` y, en los de
rondas, comprueba además que una respuesta mala no pasa.

## Ajustes tras la revisión

- `siembra-raices`: cuando lo pedido es negativo, la recta sube para que las plantas tengan sitio hacia abajo y la línea
  de la altura pedida siempre se ve (antes se cortaban todas a la misma altura). La ronda 3 usa 81 en vez de 16, que
  era el paso intermedio de un ejemplo del video.
- `muro-radicales`: el montón y la meta ya no llevan el color del tipo (se podía resolver escogiendo colores); el color
  y las costuras aparecen al poner el ladrillo en la fila. «¡Listo!» con la fila vacía no quita una vida.
- `parte-baldosa` y `reparte-factores`: el verde de «correcto» solo sale al comprobar; antes delataba la respuesta.
- `torre-pisos`: las ventanas no se abren al pasar (se jugaba leyendo en vez de contando); se abre la del piso donde se
  entrega. La pista ya no invita a pasear el ascensor.
- `pares-negativos`: la solución nombra las parejas, que también se califican.
- Contenido: fuera «√2 + √3 no es √5» y √8 (salen en el video); 10⁻³ ya no se repite en dos ejercicios de alg-21a.
- Queda igual: `pares-negativos` usa −2⁴ y (−2)³, y el `une-parejas` de alg-22a usa 49^(−1/2) y (−8)^(1/3), que se
  parecen a ejemplos de las escenas de respaldo viejas (no a los del video zoom). En un teléfono de 320 px las semillas
  de `siembra-raices` quedan tocándose. No se sacaron capturas nuevas de todos los juegos después de estos ajustes: el
  robot los volvió a resolver y se miró una captura de la siembra con número negativo.
