# Juegos dinámicos de la Pradera de Venn

Fecha: 2026-11-13

## Qué se pidió

Que cada lección tenga por lo menos un juego dinámico (de acción, para divertirse), ligado al tema de su video, muy
creativo y sin repetir mecánica. Se empieza por el mundo Pradera de Venn (Conjuntos: `alg-0a`, `alg-0b`, `alg-0c`).

## Decisión

Un juego de acción por lección, como **último ejercicio** (el premio de la lección). Los tres se juegan en tiempo real
y cada uno tiene una mecánica distinta:

| Lección | Juego | Mecánica | Idea del video que practica |
|---|---|---|---|
| `alg-0a` Qué es un conjunto | `lluvia-elementos` | **Arrastrar** una canasta de lado a lado mientras caen palabras del cielo | pertenece (∈) / no pertenece (∉); de la comprensión a la extensión: arriba se va escribiendo `F = {mango, pera…}` con lo atrapado |
| `alg-0b` Tipos y relaciones | `revienta-globos` | **Tocar a tiempo** globos que suben, cada uno con un conjunto escrito | subconjunto, iguales, disjuntos, unitario (el vacío aparece como caso curioso) |
| `alg-0c` Operaciones | `luciernagas-venn` | **Tocar algo que se mueve y cambia de zona**: luciérnagas que vuelan por un diagrama de Venn | ∩, −, complemento y △ como **zonas** del diagrama |

### Reglas comunes

- Cada ronda arranca con «Toca para empezar» (el juego no corre solo mientras se lee el enunciado).
- Tres vidas (corazones) por ronda. Un error quita una vida y dice por qué («papa ∉ F», «🦊 ∉ A»). Sin vidas, la ronda
  vuelve a empezar: **no se puede perder el ejercicio**, se reintenta hasta lograrlo. Dejar pasar algo bueno no quita
  vida (vuelve a salir).
- Al completar la ronda pasa sola a la siguiente; al terminar todas se habilita «Comprobar».
- El movimiento usa el tiempo real entre cuadros (`deltaTime`, con tope), así va igual en celulares lentos.
- Dibujo con las piezas del kit (`drawTile`, `drawPill`, `drawKicker`) y la paleta de los videos. Ayudas nuevas en el
  kit: `drawHearts` (vidas) y `drawBanner` (cartel de «Toca para empezar», «¡Ronda lista!», «Otra vez»).

### Contrato y estado

- `lluvia-elementos`: `params = { rounds: [{ name, rule, members, others }], lives? }`, `state = { caught: [[etiquetas]] }`.
  Correcto si lo atrapado en cada ronda es exactamente `members`. Funciones puras: `belongs`, `nextDrop`.
- `revienta-globos`: `params = { rounds: [{ kind: 'sub'|'igual'|'disj'|'unit'|'vacio', A?, sets }], goal?, lives? }`,
  `state = { pops: [n] }`. Correcto si cada ronda llegó a `goal`. Puras: `fits`, `setText`.
- `luciernagas-venn`: `params = { rounds: [{ op: 'union'|'inter'|'diffAB'|'diffBA'|'comp'|'sim' }], goal?, flies?, lives? }`,
  `state = { catches: [n] }`. Correcto si cada ronda llegó a `goal`. Puras: `maskAt`, `inOp`, `OPS`.

## Contenido

No repite los ejemplos de los videos y sigue sin números ni desigualdades (regla de la unidad 0).

- `alg-0a`: frutas; días de la semana que empiezan por M (trampas: mayo, marzo, mesa); animales que vuelan
  (trampas: pingüino, avestruz).
- `alg-0b`: subconjuntos de un conjunto de animales; iguales a un conjunto de instrumentos (en otro orden y con un
  elemento repetido); disjuntos con un conjunto de comidas; unitarios.
- `alg-0c`: `A ∩ B`, `A − B`, `(A ∪ B)ᶜ` y `A △ B`.

## Pruebas

`tests/juegos-dinamicos-conjuntos.test.js`: lógica pura de los tres, que el estado inicial no sea la respuesta, que cada
ronda se pueda ganar (suficientes elementos buenos y trampas; cada zona pedida existe en el diagrama) y que las tres
lecciones terminen con su juego dinámico y con pista.

## Ajustes tras la revisión

- El toque que empieza la ronda de `lluvia-elementos` también agarra la canasta (se desliza sin levantar el dedo).
- `luciernagas-venn`: una luciérnaga sobre el borde de un círculo (a menos de 7 px) ni cuenta ni quita vida; entre dos
  al alcance del dedo se prefiere la que está en la zona pedida (`edgeDist`, `pickFly`).
- Al terminar o calificar, el juego deja de dibujar (`noLoop`) para no gastar batería.
- Con «reducir movimiento» todo va al 60 % de la velocidad.
- La vida perdida va tachada, no solo en otro color.
- `peek()` en lo que devuelve `create` deja ver lo que hay en pantalla: con eso un robot en el navegador jugó los tres
  de principio a fin (perder una ronda, reintentar, ganar todas).
