# Preuniversitario UdeA · Razonamiento · Mundo 1, lección 1: «Enteros, signos y jerarquía» (`pu-cm-1`)

Pedido del usuario (2026-11-18): empezar los videos del curso por el componente de razonamiento lógico, mundo 1,
lección 1. Video en el estilo «showreel» de los demás cursos (sin dato histórico obligatorio, conceptos gráficos y
claros), **sin el reloj ni la barra de tiempo abajo**, con un diseño un poco distinto para diferenciar el curso. Y
ejercicios y juegos muy interactivos y dinámicos, en los que el estudiante aprenda lo que hace (regla del proyecto:
entender, no mecanizar; sin prisa; el juego hace las cuentas y el estudiante decide).

## Video `video/preuda-cosmos` → película `enteros` (≈ 4.8 min, 1080×1920, 60 fps, sin voz)

Motor `kit.js` de los videos showreel con un HUD propio del preuniversitario: arriba «ZUKA · PREUNIVERSITARIO UdeA» y
el componente («RAZONAMIENTO LÓGICO · MUNDO 1»), una franja lima (color del curso) y el número de escena en una
píldora; **abajo no hay reloj, ni barra de avance, ni fórmula fija**. Piezas propias en `preu.js` (recta numérica,
flechas que se estiran y se voltean, fichas de expresión que colapsan).

Diez escenas: el reto (8 − 2 · (5 − 7)² con tres respuestas, 0, 24 y 16: solo una es correcta y se sabrá al final) · la recta
(posición, signo, opuestos) · sumar es moverse (−4 + 6) · restar es sumar el opuesto (3 − 7, 2 − (−5): quitar una
deuda) · multiplicar es repetir saltos (3 · 4, (−3) · 4) · el signo menos da la vuelta ((−3)(−4): dos vueltas) · la
regla de los signos y contar negativos ((−1)(−2)(−3)) · la jerarquía como capas (paréntesis, potencias, × ÷, + −;
como vestirse) · el reto resuelto capa por capa (8 − 2 · (5 − 7)² = 0; y (−2)² frente a −2²) · cierre que vuelve a
las tres respuestas. Los ejemplos del video no salen en los ejercicios.

## Juegos nuevos: gráficos y de arrastrar, como «limonada» y la balanza

Pedido del usuario (2026-11-18, después de ver la primera versión con botones): **nada de juegos de solo tocar
botones**. Quiere el estilo de los juegos de Razones y proporciones de Álgebra (`limonada`, `balanza-proporcion`): una
escena con un objeto que reacciona en vivo y que se manipula directamente (arrastrar, deslizar), con la cuenta
escribiéndose sola. Vale para todos los cursos.

- **`globo-lastre`** (sumar y restar enteros; `roundsGame`, sin vidas): un canasto flota a la altura g − s; cada globo
  vale +1 y cada saco de arena −1. En cada pestaña se permite una sola acción, arrastrando: amarrar globos (+ positivo),
  colgar sacos (+ negativo), soltar globos (− positivo) o soltar sacos (− negativo: el canasto sube). El canasto se
  mueve en vivo sobre una escala de −8 a 8 y arriba se escribe la cuenta («−5 − (−4) = −1»). Hay que dejarlo a la altura
  de la bandera. `round = { g, s, act: 'addG' | 'addS' | 'remG' | 'remS', target }`, estado `{ k }`.
- **`voltea-flecha`** (signos del producto; `roundsGame`, sin vidas): una flecha de tamaño a sale del 0. Un deslizador
  elige el multiplicador b (−6 a 6): la flecha se repite |b| veces y, si b es negativo, la cadena se refleja en el 0
  (queda punteada del otro lado, con un arco de giro). La punta debe caer en el aro. `round = { a, target }`, estado `{ b }`.
- **`capas-operacion`** (jerarquía; `questGame`, con vidas): la expresión aparece en fichas y el estudiante **arrastra un
  número sobre su vecino**; el juego los opera y los funde en una ficha (para una potencia se juntan base y exponente).
  Si junta dos que aún no tocan pierde una vida y el juego dice qué capa va antes; una fila de capas marca las ya
  resueltas. Una operación se permite si es la siguiente de su grupo y sus dos vecinos ya son números (así 3² y un
  paréntesis aparte se pueden hacer en cualquier orden). `item = { expr: '6 + 2 * ( 5 - 8 ) ^ 2' }`.

Cada uno con su guía «Cómo se juega» (`GUIDES`, escenas `drag` y `slide`) y pistas que no regalan la respuesta.

## La lección

`pu-cm-1`: escenas de respaldo = los ejemplos del video. Ejercicios: `globo-lastre`, `voltea-flecha`, `arma-la-cuenta`
(el buzo) y, al final, `capas-operacion`.

Pruebas: `tests/preuda-enteros.test.js` (lógica pura de los tres juegos, que cada reto se pueda ganar con los
controles, datos de la lección, que los ejemplos del video no estén en los ejercicios, el HUD sin reloj ni barra).
