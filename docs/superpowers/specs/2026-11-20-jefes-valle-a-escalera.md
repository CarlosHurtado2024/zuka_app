# Jefes finales del Valle, el Mercado, las Torres y la Escalera; evaluación de la Escalera

Fecha: 2026-11-20. Faltaba el jefe final en cuatro mundos de Álgebra y la evaluación en uno
(spec `2026-11-19-mundos-altos`, tabla «Dónde falta todavía»).

- **Jefes** (`jefe-ruta`, tres fases de dos retos, definidos en `js/courses/mundos-altos.js`): el Guardián del Valle
  (`numeros`: enteros y racionales; reales y campo; signos, orden y valor absoluto), el del Mercado (`razones`: razones
  y proporciones; regla de tres y porcentajes; aumentos y cambios sucesivos), el de las Torres (`potencias`: potencias;
  leyes; raíces y radicales) y el de la Escalera (`progresiones`: aritméticas; geométricas; sumatoria).
- **Evaluación de la Escalera de Sigma** (`exam-alg-progresiones`, 5 preguntas, 12 minutos): término n-ésimo, suma
  aritmética, crecimiento geométrico, `resta-corrida` y `parte-sigma`.
- Con esto, los diez mundos de Álgebra tienen jefe y evaluación (lo comprueba `tests/mundos-altos.test.js`).
- En el navegador un robot jugó los cuatro jefes: falla un paso (pierde un corazón), corrige y gana.

Sigue faltando jefe y evaluación en Trigonometría, Cálculo, Geometría vectorial, Física, Integral y Lineal.

## Ajustes tras la revisión

- Dieciocho retos cambiados: repetían ejemplos de los videos o de los ejercicios de sus lecciones (18 de 72, 80 sube
  15 %, +20 % y −20 %, x⁵ · x² ÷ x³, 1 + … + 20, 3, 6, 12…, 0.75, (−3)² y −3², la constante de la sumatoria), tenían pasos
  «falsos» que eran cuentas ciertas, o usaban algo de otro mundo (simplificar √50 en el Valle; partir en dos casos una
  ecuación con valor absoluto, que el Valle enseña como distancia).
- Pasos largos sin corte natural, acortados. Cada jefe vecino tiene un color distinto.
- Evaluación de la Escalera: la hoja doblada era la historia del video de `alg-14c` (ahora, una bacteria que se parte
  en dos) y la ronda de `parte-sigma` casi copiaba una de la lección.

## División sintética: pocas divisiones

`division-sintetica` ya no muestra la tabla de cualquier r: hay que tocar «Dividir» y solo hay cuatro divisiones por
ronda (`probes`). Las hechas quedan anotadas en orden, para ver dónde cambia el signo del residuo. La respuesta es el r
que queda elegido al comprobar, se haya dividido con él o no.
