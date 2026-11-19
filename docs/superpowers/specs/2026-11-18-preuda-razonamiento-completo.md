# Preuniversitario UdeA · todo el componente «Razonamiento lógico»

Pedido del usuario (2026-11-18): «crea todos los juegos, ejercicios y evaluaciones del curso de razonamiento lógico».

Ya cumplían el estándar (spec `2026-11-18-preuda-mundo-1` y `2026-11-18-preuda-geometria`): el mundo 1 (Cálculo mental) y
las lecciones `pu-ge-1` y `pu-ge-2`. Faltan 51 lecciones (de `pu-ge-3` a `pu-pb-2`), que hoy tienen dos ejercicios de
`escala-solucion` o `arma-la-cuenta`, y las evaluaciones de los 16 mundos (el curso no tenía ninguna).

## Estándar (el del usuario, CLAUDE.md)

- 7 u 8 ejercicios **distintos** por lección, todos gráficos y de arrastrar; nada de `escala-solucion`, `arma-la-cuenta`,
  `une-parejas`, `clasifica-cartas` ni `ordena-terminos`; al final, un **juego en movimiento**.
- Cada ejercicio con pista que no regala la respuesta; la mano (`demo`) o la guía «Cómo se juega».
- Los ejemplos de las escenas no se repiten en los ejercicios.
- En este curso **sí** se puede usar un mismo juego en lecciones distintas (con otros datos), como ya hacían el mundo 1 y
  Geometría; dentro de una lección no se repite ninguno.
- **Evaluación por mundo**: `unit.exam = { id, title, minutes, items: [{ lesson, review, ex }] }`, al menos dos preguntas por
  lección, con juegos de sus lecciones y datos nuevos (motor `js/exam.js`).

## Dónde vive

`js/courses/preuda-razonamiento-juegos.js` (va después de `preuda-razonamiento.js`): `setLesson(id, [...])` reemplaza los
ejercicios de una lección (el último queda marcado en movimiento) y `setExam(world, [...])` arma la evaluación.
`PU_HECHOS` lista los mundos terminados; la prueba `tests/preuda-razonamiento.test.js` les exige el estándar.

## Plan por mundo

Juegos nuevos en **negrita**; los demás son de la biblioteca con datos nuevos. Finales en movimiento: los `questGame` y
arcades de la biblioteca (`vuela-precios`, `rompe-cambios`, `encesta-suma`, `serpiente-orden`, `resortera-tres`,
`traza-progresion`, `camino-pascal`, `descifra-zona`, `balanza-cajas`, `bote-corriente`, …) o uno nuevo.

| Mundo | Lecciones | Idea de los juegos |
|---|---|---|
| 2 Geometría | `pu-ge-3`…`6` | sombras, fotos, mapas, **factor de área/volumen**, **Tales**; sectores, perímetro y área, **paralelogramo a rectángulo**, **radio y diámetro**, **trapecio**; **triángulo y polígono en cuadrícula**, **sombreado = grande − chico**; **prisma por capas**, **cono = ⅓ del cilindro**, **caja desarmada** |
| 3 Orden y asignación | `pu-or-1`…`4` | **fila de personas con pistas**, **mesa redonda**, **tabla de doble entrada con ✓ y ✗**, **casos posibles** |
| 4 Proporcionalidad | `pu-pr-1`…`5` | razones, repartos, escalas, regla de tres, velocidad, trabajo conjunto, porcentajes, aumentos e IVA (biblioteca de Álgebra) |
| 5 Conteo | `pu-co-1`…`5` | **árbol de opciones**, **placas**, factoriales, **anagramas**, **mesa circular**, comités, Pascal, **complemento**, **contar triángulos**, caminos |
| 6 Espacial | `pu-es-1`…`4` | **caminos en rejilla**, **vistas de cubos**, **cubo pintado**, **desarrollos**, **dado**, **espejo**, **dobleces** |
| 7 Secuencias | `pu-se-1`…`3` | diferencias, razones, **letras con saltos**, **ciclos (reloj, días)** |
| 8 Codificación | `pu-cd-1`…`2` | **rueda de César**, **sustitución**, **deducir la regla** |
| 9 Tablas y gráficas | `pu-gr-1`…`3` | **barras**, **torta**, promedio, **mediana**, **moda**, **qué se concluye** |
| 10 Lógica | `pu-lo-1`…`5` | **tabla de verdad con interruptores**, **De Morgan**, **condicional**, **silogismos con Venn**, **caballeros y bribones** |
| 11 Operadores | `pu-op-1`…`2` | **máquina de operación**, **anidados** |
| 12 Aritmética | `pu-ar-1`…`4` | **fracciones de lo que queda**, promedios, **criptoaritmética**, **máximos y mínimos** |
| 13 Ecuaciones | `pu-ec-1`…`3` | planteamiento, edades, mezclas, **monedas**, sistemas, desigualdades (biblioteca de Álgebra) |
| 14 Conjuntos | `pu-cj-1`…`2` | Venn y encuestas (biblioteca de Álgebra, mundo 1) |
| 15 Números | `pu-nu-1`…`3` | **criba**, **árbol de factores**, **MCD con baldosas**, **MCM con relojes**, residuos, **última cifra** |
| 16 Probabilidad | `pu-pb-1`…`2` | **urna**, **tabla de dos dados**, **ruleta**, complemento, **árbol de probabilidad** |

Se trabaja por mundos, con pruebas, navegador (robot de encimados a 300 px), revisión fresca y subida a `main` por tandas.

## Estado (2026-11-19)

**Terminado**: los 16 mundos de razonamiento tienen todas sus lecciones con 7 juegos distintos (el último en movimiento) y su
evaluación; el mundo 1 (Cálculo mental) ya tenía sus juegos y ahora tiene evaluación (`js/courses/preuda-r-calculo.js`). Cada mundo
vive en `js/courses/preuda-r-<mundo>.js` (`PU_JUEGOS.push(({ setLesson, setExam }) => …)`), cargado antes de
`preuda-razonamiento-juegos.js`.

Kits nuevos: `orden-kit.js` (`ORD`), `cubo-kit.js` (`CUBO`), `sucesion-kit.js` (`SUC.nextGame`: el término que sigue como barra),
`codigo-kit.js` (`CODK.fillGame`: casillas que se llenan con fichas que no se gastan; lo usan `clave-simbolos`, `permuta-codigo`,
`adivina-conectivo`, `arma-negacion`, `adivina-operador`, `ordena-mediana`) y `grafica-kit.js` (`GRAF`: ejes y barras).

Juegos nuevos por mundo (además de los de geometría, orden, proporción, conteo y espacial ya listados en los commits):
- Secuencias: `diferencias-escalera`, `fibonacci-suma`, `alterna-dos`, `letras-salto`, `figura-patron`, `ciclo-reloj`,
  `ciclo-colores`, `ultima-cifra`.
- Codificación: `rueda-cesar`, `clave-simbolos`, `permuta-codigo`, `altura-letras`, `binario-luces`, `cuadro-polibio`, `maquina-regla`.
- Tablas y gráficas: `lee-barras`, `arma-barras`, `mayor-subida`, `variacion-barras`, `nivela-datos`, `ordena-mediana`,
  `tres-centros`, `dato-faltante`, `balanza-promedio`, `muestra-sesgo`, `eje-engano`, `tabla-doble`.
- Lógica: `circuito-logico`, `tabla-verdad`, `rompe-promesa`, `adivina-conectivo`, `arma-negacion` (genérico: escribir con fichas),
  `contraejemplo`, `niega-todos`, `flecha-deduce`, `arma-silogismo`, `quien-miente` (con `solutions`: solución única probada).
- Operadores: `maquina-operador`, `cruce-tabla`, `neutro-buscador`, `adivina-operador`, `anida-operador`, `busca-x-operador`.
- Aritmética: `corta-lo-que-queda`, `area-queda`, `total-original`, `nota-ponderada`, `cripto-letras` y `tablero-cifras` (con
  `solutions`), `peor-caso-bolsa`, `rectangulo-max`, `reparto-extremo`.
- Ecuaciones: `cinta-ecuacion`, `mezcla-precio`, `alcancia-monedas`, `intervalo-solucion` (más juegos de Álgebra con datos nuevos).
- Conjuntos: `encuesta-tres`, `solapa-barras` (más los de conjuntos de Álgebra).
- Números: `criba-primos`, `arbol-factores`, `tabla-divisores`, `cifra-faltante`, `ritmos-mcm`, `corta-mcd`, `pares-primos`.
- Probabilidad: `tabla-dados`, `urna-fraccion`, `ruleta-sectores`, `arbol-caminos`, `area-probabilidad`.

Pendiente: la Comprensión lectora (otro componente) y los videos de cada lección.
