# Resúmenes en PDF por mundo

**Fecha:** 2026-11-13 · **Primero:** Pradera de Venn (Álgebra, unidad 0, conjuntos)

## Qué es

Un PDF descargable por mundo con lo visto en sus niveles, para que el estudiante lo guarde o lo imprima. Lleva el
estilo de la app y de los juegos: papel crema y azul noche, letra Jost para títulos y Plus Jakarta Sans para el texto,
fichas con relieve, rótulos con barrita, tarjetas «físicas», estrellas suaves de fondo y el arte del mundo en la portada.

## Contenido (Pradera de Venn, 5 páginas A4)

1. **Portada:** arte del mundo, los tres niveles y «Las 5 ideas que no se te pueden olvidar».
2. **Nivel 1-1:** conjunto bien definido (semáforo frente a «colores bonitos»), ∈ / ∉, anatomía de la notación,
   extensión y comprensión, sin orden ni repetidos (PAPAYA) y cardinal.
3. **Nivel 1-2:** vacío, unitario y la trampa de {∅}; subconjunto (vocales dentro de las letras, el intruso 7);
   iguales, disjuntos y que se cruzan; conjunto de partes con los toppings (1 + 3 + 3 + 1 = 2³).
4. **Nivel 1-3:** el patio de los siete amigos en un Venn, las cinco operaciones con su zona pintada y su palabra clave,
   cómo contar la unión y un ejemplo con tres conjuntos.
5. **Repaso:** tabla de símbolos, errores frecuentes y la ruta para un problema de encuesta.

Usa solo los ejemplos de los videos; no trae respuestas de los ejercicios ni de la evaluación.

## Cómo se hace

- Fuente: `docs/resumenes/<nombre>.html` (página A4 con los diagramas en SVG generados por un script pequeño).
- PDF: `sh docs/resumenes/build.sh [nombre]` → `media/resumenes/<nombre>.pdf` (Chrome sin ventana).
- En la app: la unidad lleva `summary: 'media/resumenes/<nombre>.pdf'` y `renderWorld` muestra la tarjeta
  «Resumen del mundo» bajo el camino (enlace con `download`). El PDF no va en `SHELL` (se baja con conexión).
- Pruebas: `tests/resumenes.test.js`.
