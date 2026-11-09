# Álgebra, unidad 0: Conjuntos (2026-11-09)

Unidad nueva al inicio del curso de Álgebra, antes de «Sistemas numéricos». Una lección `alg-0`
«Conjuntos: notación, tipos y operaciones» con un video de conceptos (manimgl, fondo morado vivo, zoom de
cámara, **sin 3D**) y ejercicios con juegos originales (sin tarjetas), cada uno con pista.

## Video C0 (`video/clase_alg_u0_conjuntos`)

Intuición primero y notación después; sin preguntas al espectador, sin voz ni subtítulos quemados.

1. Qué es un conjunto: colección **bien definida** (las vocales sí; «los números bonitos» no). Elementos,
   `∈` y `∉`, nombres con mayúscula y llaves.
2. Determinar un conjunto: por **extensión** `{2, 4, 6, 8}` y por **comprensión** `{x ∈ ℕ : x es par, x < 10}`;
   el orden y las repeticiones no importan; cardinal `n(A)`.
3. Tipos: vacío `∅ = { }` (y `{∅}` no es vacío), unitario, finito, infinito, universal `U`.
4. Relaciones: subconjunto `⊆` (y `∅ ⊆ A`), igualdad, disjuntos; conjunto de partes `P(A)` con `2ⁿ`
   elementos (árbol de decisiones «entra / no entra», con zoom).
5. Diagramas de Venn y operaciones: unión, intersección, diferencia, complemento y diferencia simétrica, con
   sombreado animado y su notación.
6. Contar con Venn: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B)` con una encuesta.

Ejemplos del video: vocales; `{2, 4, 6, 8}`; `{x ∈ ℕ : x < 4}`; `A = {1, 2, 3, 4}`, `B = {3, 4, 5, 6}`,
`U = {1, …, 8}`; `P({a, b, c})` en el árbol; encuesta de 35 personas (20 café, 18 té, 8 ambos). Los ejercicios
no los repiten.

## Juegos nuevos

| Juego | Mecánica |
|---|---|
| `atrapa-elementos` | Un conjunto por comprensión; se tocan las fichas que pertenecen y van entrando a las llaves (extensión en vivo, con `n(A)`) |
| `mueve-circulos` | Se arrastra el círculo B para dibujar la relación de los conjuntos dados: B dentro de A (`⊆`), encima (=), separados (disjuntos) o cruzados; la notación de lo dibujado se ve en vivo |
| `fabrica-subconjuntos` | 2ⁿ casillas; en cada una se encienden elementos; meta: todos los subconjuntos, sin repetir (incluye ∅ y el conjunto completo) |
| `reparte-venn` | Se toca un elemento y luego la zona del diagrama (solo A, A ∩ B, solo B, fuera) |
| `pinta-venn` | Se pintan las zonas de un Venn de 2 o 3 círculos para representar una operación (`A − B`, `(A ∪ B)ᶜ`, `A ∩ (B ∪ C)`…) |
| `encuesta-venn` | Una encuesta: se ajusta con − / + cuántas personas hay en cada zona; se ven las sumas de cada círculo y del total |

Más dos cálculos (`num`): subconjuntos de un conjunto de 5 elementos (32) y `n(A ∪ B)` (17).

Colores de los juegos desde `api.palette`: A en `C.Z`, B en `C.I`, C en `C.N`, lo pintado en `C.brand`.

## Video EC0: ejemplos resueltos (`video/clase_alg_u0_ej_conjuntos`)

Escena `ExScene` paso a paso, sin 3D y con un solo acercamiento (la trampa de `{2} ⊆ A`). Ejemplos:
`{x ∈ ℕ : 3 < x ≤ 8}`; `{1, 4, 9, 16, 25}` por comprensión; letras de MATEMATICA; `∈` contra `⊆` con
`A = {1, {2}, 3}`; `P({x, y})` y `n(P(A)) = 64 ⇒ n(A) = 6`; seis operaciones con pares y múltiplos de 3 en
`U = {1, …, 10}`; De Morgan comprobada con listas; encuesta de 60 (35 leen, 28 ejercicio, 10 ninguna ⇒ 13 ambas).
Al tener su ID va en `more` sin `after`, justo después de C0.
