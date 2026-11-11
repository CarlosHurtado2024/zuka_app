# Álgebra, unidad 0: Conjuntos desde cero (2026-11-11)

Reemplaza la lección única `alg-0` (spec 2026-11-09-algebra-conjuntos). Pedido del usuario: un video mejor y muy
explicativo, para alguien que empieza desde lo más básico; **sin ejemplos con números ni desigualdades** (ℕ, ℤ,
«x < 10» aún no se han visto); ejemplos generales de la vida diaria; dividir en partes si es largo; después de
cada video, sus ejercicios, creativos y coherentes con él; **sin zoom ni 3D** salvo que sea imprescindible.

## Tres lecciones, cada una con su video y luego sus ejercicios

| Lección | Video | Contenido |
|---|---|---|
| `alg-0a` ¿Qué es un conjunto? | V1 `video/clase_alg_u0_v1_que_es` | Agrupar cosas; conjunto **bien definido** (semáforo sí, «colores bonitos» no); elementos; notación paso a paso: mayúscula, `=`, llaves, comas; `∈` y `∉` y cómo se leen; extensión y comprensión (`{x : x es una vocal}`, «x tal que…»); orden y repeticiones no importan (letras de OSO); cardinal `n(A)` (letras de PAPAYA); dibujar un conjunto como una curva cerrada |
| `alg-0b` Tipos y relaciones | V2 `video/clase_alg_u0_v2_tipos` | Vacío `∅ = { }` y la trampa `{∅}`; unitario (capital de Colombia); finito e infinito (puntos de un segmento); universal `U` según el contexto; subconjunto `⊆` y `⊄` (vocales ⊆ letras); `∅ ⊆ A`, `A ⊆ A`; igualdad (letras de AMOR = letras de ROMA); disjuntos (frutas y herramientas); conjunto de partes con los toppings de un helado (fresa, mora, coco: 8 combinaciones) |
| `alg-0c` Operaciones | V3 `video/clase_alg_u0_v3_operaciones` | Un salón: `U` siete estudiantes, `A` fútbol, `B` instrumento; ubicarlos en el diagrama de Venn; unión («o»), intersección («y»), diferencia («pero no»), complemento («no»), diferencia simétrica («uno solo»); traducir frases a símbolos; contar con `n(A ∪ B) = n(A) + n(B) − n(A ∩ B)` |

Ejemplos de los videos (no se repiten en los ejercicios): semáforo, fin de semana, vocales, OSO, PAPAYA, Bogotá,
puntos de un segmento, AMOR/ROMA, frutas/herramientas, helado fresa/mora/coco, el salón de Ana a Gina.

## Ejercicios

**alg-0a**
- `arma-notacion` (nuevo): fichas de símbolos (`A`, `=`, `{`, `}`, `,`, elementos y distractores como `(`, `[`)
  que se tocan en orden para escribir un conjunto por extensión. Se valida la forma (nombre, `=`, llaves, comas
  entre elementos) y que estén justo los elementos, en cualquier orden y sin repetir.
- `cumple-notacion` (nuevo): frases como `perro ∈ M`, `pez ∉ M`; se mete o se saca cada ficha de la bolsa de M
  hasta que todas las frases sean ciertas.
- `atrapa-elementos` con condiciones en palabras («x es una estación del año»).
- `tacha-repetidos` (nuevo): una lista con repeticiones (letras de una palabra); se tachan las sobrantes y queda
  el conjunto con su cardinal.
- Un `num` de cardinal.

**alg-0b**
- `arma-conjunto` (nuevo): fichas y una caja con llaves; cada ronda pide un conjunto con condiciones (vacío,
  unitario, subconjunto de A, igual a A, disjunto de B, …); varias respuestas valen.
- `mueve-circulos` con conjuntos de palabras.
- `fabrica-subconjuntos` con toppings en emoji.
- Un `num` de subconjuntos (2ⁿ, contando).

**alg-0c**
- `reparte-venn` con conjuntos de palabras.
- `atrapa-elementos` extendido (`given`: A y B por extensión; `expr`: la operación) para escribir el resultado.
- `pinta-venn` con 2 y 3 círculos.
- `encuesta-venn` con una encuesta.

Todos con pista; sin opción múltiple ni tarjetas. Videos con la plantilla de Álgebra (fondo morado vivo),
escenas `MBScene`/`ExScene`, sin `zoom_to` ni escenas 3D.
