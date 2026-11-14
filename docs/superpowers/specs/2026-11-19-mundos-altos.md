# Mundos altos de Álgebra: ejercicios, jefe final y evaluación

Fecha: 2026-11-19. Pedido: diseñar y crear los ejercicios y juegos de los mundos Taller (Torre) de los Bloques, Fuente
de la Parábola, Cordillera Cúbica, Río de Asíntotas y Selva Exponencial, con el enfrentamiento con su jefe final y la
evaluación de cada mundo; y revisar en qué mundos falta esto.

## Cómo estaban

Los cinco mundos (unidades `polinomios`, `cuadraticas`, `grado-superior`, `racionales`, `exp-log`; 19 lecciones) eran
casi todo opción múltiple, sin pistas, sin jefe y sin evaluación. Solo `alg-4a`, `alg-13b` y `alg-73` ya eran juegos.

## Qué se hizo

`js/courses/mundos-altos.js` (va después de `algebra.js`) pone a 16 lecciones sus ejercicios nuevos y a cada mundo su
jefe y su evaluación. Las tres lecciones que ya eran juegos se quedan como están. **Los `ex` de esas 16 lecciones que
siguen escritos en `algebra.js` ya no se usan.**

- **80 ejercicios nuevos** (5 por lección), todos juegos con pista y explicación, sin opción múltiple ni teclado.
- **Juegos nuevos**

  | Juego | Mundo | Idea |
  |---|---|---|
  | `bloques-area` | Taller de los Bloques | (x + a)(x + b) como rectángulo de un cuadrado x², barras x y cuadritos. `factor`: se eligen a y b hasta tener las barras y cuadritos del polinomio. `expand`: se cuentan las piezas de un producto ya dibujado. |
  | `division-sintetica` | Cordillera Cúbica | Se elige r y el juego hace la división entre x − r (baja, multiplica, suma). El último número es el residuo, P(r). Meta: residuo 0 (factor) o un residuo dado. |
  | `cancela-factores` | Río de Asíntotas | Fracción con fichas arriba y abajo: se cancelan parejas de factores iguales; lo que está sumando no se cancela. |
  | `jefe-ruta` | Jefes de los cinco mundos | Batalla por turnos sin reloj: cada reto se responde con una ruta de pasos (uno válido por nivel) y «¡Atacar!». Un paso falso cuesta un corazón y el juego dice en qué nivel repensar. Sin corazones se repite la fase. |

- **Juegos reutilizados** con rondas nuevas: `arma-la-cuenta`, `escala-solucion`, `une-parejas`, `completa-cuadrado`,
  `raices-imanes`, `balanza-exponencial`, `cruz-asintotas`, `afina-sistema`, `combina-vectores`, `proyector-sombras`,
  `espejo-diagonal`, `mueve-parabola`.
- **Jefe final de cada mundo** (`unit.boss`, tres fases de dos retos): el Maestro del Taller, el Guardián de la Fuente,
  el de la Cordillera, el del Río y el de la Selva.
- **Evaluación de cada mundo** (`unit.exam`, 5 preguntas, 12 minutos), cada pregunta ligada a una lección con su nota
  de repaso.

## Dónde falta todavía (revisado)

| Curso | Mundo | Jefe | Evaluación |
|---|---|---|---|
| Álgebra | Pradera de Venn (conjuntos) | sí | sí |
| Álgebra | Valle de los Números, Mercado de las Razones, Torres de Potencias | **falta** | sí |
| Álgebra | Escalera de Sigma (progresiones) | **falta** | **falta** |
| Álgebra | Los cinco de este trabajo | sí | sí |
| Trigonometría, Cálculo, Geometría vectorial, Física, Integral, Lineal | todos | **falta** | **falta** |

`jefe-ruta` sirve tal cual para cualquier mundo: solo hay que escribir sus fases.

## Pruebas

`tests/mundos-altos.test.js`: ninguna lección de los cinco mundos tiene opción múltiple ni teclado; cada ejercicio
tiene pista, explicación y guía; las cuentas dan su resultado, las rutas válidas ganan, los rectángulos y las
divisiones tienen solución; cada mundo tiene jefe (tres fases, seis retos, rutas válidas, dice el nivel que falla) y
evaluación (cinco preguntas de al menos tres lecciones); lógica pura de los juegos nuevos; registro y sin reloj.
En el navegador un robot resolvió los ejercicios nuevos, los cinco jefes y las evaluaciones.

## Queda para después

- Un juego dinámico propio por lección en estos mundos (la regla de «uno distinto por lección»).
- Jefe y evaluación de los mundos de la tabla.
- Las escenas de respaldo de los videos de estas lecciones siguen usando los ejemplos viejos.
- Borrar de `algebra.js` los `ex` viejos de las 16 lecciones.

## Ajustes tras la revisión

- `combina-vectores`: dos estrellas caían fuera del plano (de −6 a 6); se cambiaron los sistemas.
- Ejemplos que salían en los videos zoom de estas lecciones: cambiados (cortes de la parábola, polinomios de la
  división sintética y de los imanes, primer rectángulo de bloques, trinomio con coeficiente principal, fila de
  Pascal, conjugado complejo, raíz de un negativo, fracciones de `alg-25a`).
- Pasos «falsos» que eran ciertos (`alg-24b` y `alg-23a`) y una ficha que ya era la respuesta (evaluación de la Cordillera).
- `cancela-factores` usa el mismo enunciado en todas las rondas: ya no delata cuáles son la trampa.
- Los pasos largos se parten en dos renglones por un corte natural (`stepLines`) en la escalada y en el jefe.
- `bloques-area`: los cuadritos son color sol (el coral es «negativo» en el kit y en los videos).
- «Vence al Guardián», no «a el».
- Sin hacer: `division-sintetica` deja llegar al residuo probando valores; `lock()` del jefe antes de ganar mostraría el
  cartel de victoria (hoy no se alcanza); el nombre del Guardián sale con el artículo en minúscula.
