# Jefe final de la Pradera de Venn

Fecha: 2026-11-14. Pedido: un juego dinámico «final boss» al final del mundo Pradera de Venn, divertido y que obligue a
pensar con los conceptos de las tres lecciones del mundo. Sigue la regla «entender, no mecanizar»
(`2026-11-14-juegos-conceptuales-valle`): no hay reloj.

## Dónde vive

- `unit.boss = { id, title, clip: { scenes }, ex: [play('jefe-venn', …)] }` en la unidad de conjuntos (`jefe-alg-0`,
  «El Guardián de la Pradera»), definido junto a las evaluaciones al final de `js/courses/algebra.js`.
- En el camino del mundo (`renderWorld`) es un nodo propio, rojo y con corona (`.node.boss`, `ICON.crown`), entre la
  última lección y la evaluación. **No es una lección**: no cuenta en el avance del mundo ni cambia `unit.lessons`.
- Se abre al terminar las lecciones del mundo (`bossUnlocked`; siempre en modo revisión). Su hoja (`openBossSheet`) lo
  lanza con `startLesson(c, unit.boss)`: dos escenas de presentación y el juego. Al ganar queda en `S.done['jefe-alg-0']`.
- La evaluación sigue dependiendo solo de las lecciones.

## El juego `jefe-venn`

Batalla por turnos. El prado es un diagrama de Venn (A y B dentro de U) con seis números. El Guardián da una orden
escrita con conjuntos; se arma la respuesta y se toca «¡Atacar!». Si está bien, el conjunto sale volando y le quita un
segmento de vida; si no, él golpea, se pierde una vida y dice qué falló. Tres vidas por fase; sin vidas la fase empieza
otra vez y el Guardián recupera esa vida.

| Fase | Lección | Modo | Órdenes |
|---|---|---|---|
| 1 · Pertenencia | `alg-0a` | tocar | `{ x : x ∈ A }`, `{ x ∈ U : x ∉ B }`, `{ x ∈ U : x es par y x > 2 }` |
| 2 · Relaciones | `alg-0b` | arrastrar | A y B disjuntos; A ⊆ B; A = B con dos elementos; A unitario y B vacío |
| 3 · Operaciones | `alg-0c` | tocar | A ∩ B, A − B, (A ∪ B)ᶜ, (A − B) ∩ B |

- **Tocar (`pick`):** se eligen los elementos del conjunto pedido; abajo se va escribiendo «Tu conjunto: {…}». Si el
  conjunto pedido es el vacío, se ataca sin elegir ninguno (última orden).
- **Arrastrar (`move`):** se mueven los números entre las cuatro zonas hasta que A y B cumplan la relación; abajo se ven
  A y B por extensión. Hay muchas respuestas buenas (el contenido trae un ejemplo, `sample`, para la solución y las pruebas).
- Al fallar en `pick` se dice qué elemento sobra, o que falta alguno (sin decir cuál).

Funciones puras: `setsOf(zones)`, `wantOf(order, zones)`, `fmtSet`, `judgePick`, `judgeMove`, `zoneAt`.
`params = { rounds: [{ title, mode, zones: { a, ab, b, out }, orders }] }`, `state = { done: [n por fase] }`.

## Pruebas

`tests/jefe-venn.test.js`: lógica pura, que el mundo conserve sus tres lecciones y tenga jefe con pista y explicación,
que cada orden tenga respuesta, que las de arrastrar no vengan resueltas y su ejemplo cumpla, que haya una orden cuya
respuesta sea ∅, y que `app.js`, `ui.js` y `styles.css` traigan el nodo. En el navegador, un robot lo vence con `peek()`
perdiendo antes una fase.

## Ajustes tras la revisión

- Los elementos de afuera van en las esquinas del universo, medidas desde su borde (`outSlot`): en celulares angostos se
  salían del lienzo, y los dos sitios del centro quedaban montados sobre el cruce de los círculos (no se sabía si estaban
  en A ∩ B o afuera). El universo es un poco más alto y el lienzo pasa a 1.5 de alto por ancho.
- La notación por comprensión usa «:» («tal que»), como en la lección, no «|».
- En la fase de arrastrar, si la falla es que un conjunto quedó vacío, el aviso lo dice (`no` puede ser una función).
- Mientras se ve el resultado de un ataque sigue en pantalla la orden que se respondió, no la siguiente.
- Al perder la fase se sigue viendo qué falló. Tocar un espacio vacío del lienzo deja desplazar la lección.
- Queda igual: al vencerlo, la pantalla final dice «¡Lección completada!» (la común de `startLesson`); la evaluación se
  abre con las lecciones, sin exigir vencer al jefe; el encabezado del juego dice «Ronda» y no «Fase».
- Del camino del mundo no hay captura (el panel del navegador estaba oculto): el nodo se comprobó leyendo la página.
