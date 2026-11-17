# Teoría de Conjuntos: juegos en «lámina»

Fecha: 2026-11-26. Pedido: rediseñar los juegos del mundo 1 (Teoría de Conjuntos, lecciones `alg-0a`, `alg-0b`,
`alg-0c`) para que vayan con el tema del mundo, se vean mucho más profesionales y llamativos, enganchen más y
evalúen de verdad cada concepto. Se pueden añadir juegos a una lección.

## Idea: todo pasa en el diagrama

La lámina del mundo (`js/worlds.js`) es un diagrama de Venn a línea fina con un acento verde azulado. Los juegos
usan ese mismo lenguaje, y la pantalla tiene las tres franjas de los videos lámina:

1. **Rótulo** arriba (qué se pide).
2. **Diagrama** en el centro: el universo es un panel; cada conjunto es una **membrana** (curva con brillo y relleno
   translúcido: A verde azulado, B coral, C azul); cada elemento es una **píldora** que se desliza a su sitio.
3. **Escritura formal** abajo: lo que el estudiante va armando se escribe en vivo en notación, con letra de libro
   (`V = {a, e}`, `n(V) = 2`, `B ⊆ A`). Así cada gesto se conecta con su símbolo.

Piezas comunes en `js/games/conjuntos-kit.js` (`SK`): `panel`, `membrane`, `tag`, `chip`, `serif`, `formal`, `zones`
(recorte exacto de las zonas de un Venn, rellenas o rayadas), `ease` (deslizamiento), `sets` (colores de A, B, C).

## Juegos nuevos (uno por lección, el último ejercicio; sin prisa, con `questGame`)

- **`lazo-conjunto`** (`alg-0a`, reemplaza a `lluvia-elementos`, que pedía reflejos): los elementos están sueltos en
  el universo; se **encierran con el dedo** (un lazo) o se tocan, y entran a la membrana. Abajo se escribe el
  conjunto por extensión y su cardinal. Evalúa pasar de comprensión a extensión y la pertenencia.
- **`cubo-partes`** (`alg-0b`, reemplaza a `fabrica-subconjuntos`): el conjunto de partes como retículo (cada nivel,
  un tamaño). Todos empiezan apagados y sin nombre. Con un interruptor por elemento se arma un subconjunto y se
  enciende; hay que **encenderlos todos sin repetir** (repetir cuesta una vida): obliga a enumerarlos con orden y
  muestra por qué son 2ⁿ. (La primera versión, un recorrido por vecinos, se ganaba casi al azar: revisión fresca.)
- **`orbita-conjuntos`** (`alg-0b`, reemplaza a `revienta-globos`, que era a contrarreloj): A en el centro y seis
  conjuntos alrededor; se marcan todos los que cumplen la relación pedida (⊆, =, disjunto, unitario) y se comprueba.
- **`descifra-zona`** (`alg-0c`, reemplaza a `luciernagas-venn`): el diagrama muestra una zona rayada; se arma la
  operación con tres ruedas (conjunto, operación, conjunto) y el juego pinta en vivo lo que significa. Se ajusta hasta
  que lo pintado coincide con lo rayado; el juego no avisa que coincide hasta tocar «Listo» (si no, se ganaba girando a ciegas). Evalúa leer operaciones como zonas (incluye complementos).

## Juegos que se quedan, redibujados en lámina

`arma-notacion`, `cumple-notacion`, `atrapa-elementos`, `tacha-repetidos`, `arma-conjunto`, `mueve-circulos`,
`reparte-venn`, `pinta-venn` (zonas con borde exacto, ya no cuadritos) y `encuesta-venn`. Misma lógica y mismas
respuestas; cambian el dibujo, las animaciones y la franja formal.

Los cuatro juegos reemplazados siguen en el repositorio (con sus pruebas) pero ya no están en las lecciones.

## Pruebas

`tests/conjuntos-lamina.test.js`: lógica pura de los cuatro juegos nuevos (aciertos, trampas, solución alcanzable),
contenido de las tres lecciones (último ejercicio, pistas, sin prisa) y que los nueve redibujados usan `SK`.
