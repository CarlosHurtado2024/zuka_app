# Mejoras a los juegos dinámicos de las lecciones 2 y 3 del Valle de los Números

Fecha: 2026-11-14. Juegos: `carrera-fracciones` (`alg-11b`, racionales) y `frena-aguja` (`alg-11c`, irracionales y
reales). El contenido de las rondas, el estado (`{ done }`) y `grade` no cambian: no se pierde progreso.

## Qué les faltaba

- **Carrera:** se veía plana (un cuadrado que espera puertas), solo respondía a toques, no premiaba jugar bien y al
  fallar no enseñaba nada: la pregunta volvía igual.
- **Aguja:** acertar y casi acertar daban lo mismo, no se veía por qué el número queda ahí, y la pista tras fallar era
  solo texto.

## Carrera de las fracciones

| Mejora | Detalle |
|---|---|
| Control | El corredor sigue el dedo: tocar un carril o arrastrar de uno a otro. |
| Racha y turbo | Cada acierto seguido sube la racha; la pista corre más rápido (`turbo(racha)`, tope ×1.4) y el corredor deja estela. Fallar la reinicia. |
| Ayuda tras fallar | La pregunta que vuelve trae bajo el número una ayuda que orienta sin dar el resultado (`helpOf`): «1/4 es 1 ÷ 4», «0.9 son 9 décimas», «arriba y abajo por el mismo número». |
| Meta | Al resolver la última pregunta baja una línea de meta a cuadros; la ronda se gana al cruzarla. |
| Vida | Corredor con piernas y sombra, puerta que estalla en pedazos al acertar, sacudida al fallar. |

Funciones puras nuevas: `valueOf(texto)`, `helpOf(item)`, `turbo(racha)`.

## Frena la aguja

| Mejora | Detalle |
|---|---|
| Puntería | Tres estrellas según qué tan cerca se frenó (`starsOf(error, tol)`: tercio, dos tercios, tolerancia). Aviso «¡Diana!», «¡Cerca!», «Por poco». El resumen final cuenta las estrellas. |
| Lupa | Al acertar se abre una lupa bajo la recta: el tramo ampliado con sus décimas numeradas, dónde está el número y dónde cayó la aguja. |
| Pista visible | Tras fallar se ilumina en la recta el tramo entre los dos enteros que encierran al número (`bracket(valor)`), además del texto. |
| Vida | La aguja deja estela. |

Las estrellas son solo vistosas: no cambian la nota ni lo que se guarda.

## Pruebas

`tests/juegos-dinamicos-valle.test.js`: `valueOf`, `helpOf` (y que ninguna ayuda del contenido traiga la respuesta),
`turbo` con tope, `starsOf` y `bracket`. En el navegador, el robot de `peek()` los juega perdiendo una ronda primero.

## Ajustes tras la revisión

- Ayudas de la carrera: «0.9 son 9 décimas» era ya la respuesta (9/10); cuando la respuesta es esa cuenta sin
  simplificar, la ayuda solo nombra el lugar («llega hasta las décimas: ¿sobre qué número va?»). «0/5» ya no dice «cero».
- La ayuda de una pregunta fallada se conserva si la ronda se reintenta (`missedOf` por ronda).
- La píldora de la racha va al lado del corredor: encima tapaba la puerta que llegaba.
- Lupa: rotula las décimas pares y siempre el entero (con π no se veía el 3); sus guías salen debajo de los números.
- Tema claro: estrellas apagadas con contorno y tramo entre enteros con borde. Meta a cuadros con `C.night` y
  `C.cream` (con `C.ink` salía toda blanca en tema oscuro).
- Sin capturas nuevas después de estos ajustes: solo se comprobó en el navegador que los dos juegos corren sin errores.
