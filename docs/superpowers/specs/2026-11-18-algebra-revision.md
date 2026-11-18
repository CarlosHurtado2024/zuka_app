# Álgebra · revisión a fondo de la práctica

Pedido del usuario (2026-11-18, después del commit `74352a0` «Rediseña la práctica de los diez mundos de Álgebra», hecho
por otro agente, y de `587631a` «Unifica el estilo y los controles»):

- Revisar todos los juegos de todas las lecciones de los diez mundos y el **sentido** de cada ejercicio.
- **Sin juegos repetidos**: hoy se ven por todas partes la balanza donde no corresponde, la recta, o «ubicar un punto en
  una línea horizontal» sobre lo que en realidad es un plano cartesiano.
- Aplicar el estilo nuevo (gráfico, de arrastrar, la cuenta se escribe sola) también a los juegos que ya estaban.
- **Quitar los jefes finales** y, con sus ejercicios, hacer una **evaluación más completa** al final de cada mundo.

## Diagnóstico

### Qué hizo el rediseño del 18 de noviembre

`js/courses/algebra-taller.js` toma cada lección, conserva 3 o 4 de sus juegos propios y rellena el resto con **nueve
motores genéricos** (`js/games/algebra-taller.js` + `algebra-escenas.js`): `taller-membrana` (arrastrar fichas a
regiones), `taller-mosaico` (tocar celdas), `taller-plano` (mover un punto en un plano), `taller-barra` (deslizador),
`taller-sonda` (mover x sobre una gráfica), `taller-area` (rectángulo de casillas), `taller-balanza` (deslizador con dos
platillos), `taller-trazo` (ruta por estaciones) y `taller-giro` (rueda de valores). También rehízo los jefes con tres
de esos motores y cambió preguntas de las evaluaciones por ellos.

Uso en las 43 lecciones:

| Motor | Veces | Lecciones |
|---|---|---|
| `taller-membrana` | 26 | en 26 de 43 |
| `taller-mosaico` | 26 | en 26 de 43 |
| `taller-plano` | 26 | en 26 de 43 |
| `taller-barra` | 23 | |
| `taller-sonda` | 16 | |
| `taller-area` | 14 | |
| `taller-balanza` | 12 | |
| `taller-trazo` | 10 | |
| `taller-giro` | 9 | |

Son 162 de los 302 ejercicios: más de la mitad de la práctica es el mismo puñado de pantallas con otros datos.

### Problemas de sentido (ejemplos)

- **El plano en vez de la recta**: `taller-plano` con «el eje horizontal» para sumar enteros (`alg-11`), ubicar $\tfrac54$
  (`alg-11b`), un racional entre 1.41 y 1.42 (`alg-11c`), $-3-(-5)$ (`alg-12c`), distancias (`alg-12d`) y el jefe
  (−7/4). Se dibuja un plano cartesiano con el punto atado a $y = 0$: la idea es una recta, no un plano.
- **El plano para algo que no es una gráfica**: «coloca una mezcla de 9 vasos» (`alg-12`), «marca la compra de 80 mil
  con un ahorro del 30 %» (`alg-13`), parejas de precios (`alg-13c`, `alg-13d`), términos de sucesiones como puntos
  (`alg-14`, `alg-14c`, `alg-14d`).
- **La balanza sin equilibrio que pesar**: «mueve el contrapeso hasta que $(-3)x$ sea 18» (`alg-12c`), «iguala la
  distancia de $x$ a 3 y a −5» (`alg-12d`), «el lado del cuadrado hasta que su área sea 49» (`alg-22a`), «el
  multiplicador de $\sqrt3$» (`alg-22b`), el discriminante (`alg-4`), el coeficiente $a$ de una parábola (`alg-4a`), el
  argumento de un logaritmo (`alg-72`). Y `balanza-exponencial` en la lección de ecuaciones **lineales** (`alg-1`) y en la
  de la **función** exponencial (`alg-71`), donde no hay ecuación.
- **Clasificar y tocar casillas**: `taller-membrana` y `taller-mosaico` son las tarjetas de clasificar y los botones que
  el usuario ya había descartado, con otro dibujo.
- **Deslizadores sin escena**: `taller-barra` y `taller-giro` mueven un número y muestran una barra; no dibujan la idea.
- **Juegos propios repetidos entre lecciones**: `torre-producto` (3 lecciones), `balanza-exponencial` (3), y en dos
  lecciones cada uno `fuga-de-familia`, `rellena-medios`, `suma-filas`, `bloques-area`, `completa-cuadrado`,
  `raices-imanes`, `cancela-factores`, `mejor-oferta`.
- **Jefes**: hoy son tres motores genéricos con el nombre de un guardián; el usuario no los quiere.

## Reglas de la revisión

1. **Ningún `taller-*` en las lecciones.** Cada ejercicio tiene una escena propia que dibuja la idea de su lección.
2. **Ningún juego repetido dentro del curso de Álgebra** (cada juego vive en una sola lección). Las evaluaciones sí
   reutilizan juegos de sus lecciones, con datos nuevos.
3. 7 u 8 ejercicios distintos por lección, el último en movimiento; todos con pista y con la
   mano que muestra el gesto (`demo`).
4. Cada escena corresponde a la idea: recta para la recta, plano solo cuando hay dos variables o una gráfica, balanza
   solo cuando hay dos lados que deben pesar lo mismo (una ecuación), área cuando hay un producto.
5. **Sin jefes.** El nodo del jefe desaparece del camino y su contenido pasa a la evaluación del mundo.
6. **Evaluación completa** al final de cada mundo: al menos dos preguntas por lección, de juegos distintos, con su nota
   de repaso y el enlace a la lección; minutos según el número de preguntas.

## Plan por mundo

Se trabaja mundo por mundo, en orden. Cada mundo: diseño de sus juegos nuevos → pruebas → juegos → lecciones y
evaluación → navegador (300 y 380 px, dos temas) → revisión fresca → subir.

| Mundo | Lecciones | Juegos propios que quedan | Salen |
|---|---|---|---|
| 1 Teoría de Conjuntos | `alg-0a`, `0b`, `0c` | 4 por lección | 3 `taller-*` por lección |
| 2 La Recta Real | `alg-11` … `12d` | 3 a 6 | `taller-*`; `fuga-de-familia` queda solo en `alg-11b` |
| 3 Escalas y Proporciones | `alg-12` … `13d` | 4 a 7 | `taller-*`; `mejor-oferta` solo en `alg-13b` |
| 4 Exponentes y Radicales | `alg-21a` … `22b` | 3 a 4 | `taller-*`; `torre-producto` solo en una |
| 5 Sucesiones y Series | `alg-14` … `15` | 3 a 4 | `taller-*`; `rellena-medios`, `suma-filas` en una sola |
| 6 Álgebra de Polinomios | `alg-23a` … `24b` | 1 a 2 | `taller-*`; `bloques-area` en una sola |
| 7 Parábolas y Complejos | `alg-23c` … `4` | 1 a 2 | `taller-*`; `balanza-exponencial` sale de `alg-1` |
| 8 Raíces de Polinomios | `alg-23b` … `93` | 1 a 2 | `taller-*`; `raices-imanes` en una sola |
| 9 Fracciones Algebraicas | `alg-25a` … `102` | 1 a 3 | `taller-*`; `cancela-factores` en una sola |
| 10 Crecimiento Exponencial | `alg-71` … `73` | 2 a 7 | `taller-*`; `balanza-exponencial` solo en `alg-73` |

Los mundos 6 a 10 son los que más juegos nuevos necesitan (cuatro o cinco por lección).

### Mundo 1 · Teoría de Conjuntos (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-0a` | `cumple-notacion`, `tacha-repetidos`, **`tamiz-rango`** (corchetes sobre una tira: de la regla a la lista), **`cajas-anidadas`** (bolsas dentro de un conjunto: $\{2,3\}$, $\varnothing$, $\{\varnothing\}$ cuentan como un elemento), `atrapa-elementos`, **`gemelos`** (hilos entre elementos iguales; sacar lo que impide $A = B$, $A \subseteq B$ o $A \cap B = \varnothing$), `lazo-conjunto` |
| `alg-0b` | `arma-conjunto`, `mueve-circulos`, **`escalera-inclusion`** (muñecas: cada conjunto envuelve al anterior), `cubo-partes`, **`arbol-partes`** (cada elemento parte las ramas: $2^n$ hojas), `orbita-conjuntos`, **`anillos-subconjunto`** (aro que encaja solo en una estaca que lo contiene; vuela al soltar) |
| `alg-0c` | `reparte-venn`, `pinta-venn`, **`solapa-cardinal`** (arrastrar B sobre A: $n(A \cup B) = n(A) + n(B) - n(A \cap B)$), **`goma-diferencia`** (borrar lo que la operación excluye), `encuesta-venn`, **`busca-b`** (encontrar B con la unión y la intersección), `descifra-zona` |

Evaluación: las preguntas que tenía (laberinto, dominó, detective) y siete nuevas con los juegos de las lecciones y datos
distintos; dos de ellas reciclan los retos del jefe (letras de CLIMA y MAR, complemento de $\{2, 4, 6\}$).

Pedido del usuario el mismo día: «examina todos los mundos de una vez y todas las lecciones, después sube los cambios». Los mundos 2 a 10 se rehicieron juntos; en negrita no se marca nada: cada juego aparece en una sola lección del curso (algunos, como `globo-lastre`, también viven en el Preuniversitario, que es otro curso). Los juegos nuevos se dibujan con el kit `RK` de `js/games/recta-kit.js` (`chip`, `strip`, `track`, `pick`, `tile`, `plane`, `curve`).
### Mundo 2 · La Recta Real (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-11` | `ascensor`, `recta-espejo`, `globo-lastre`, `pares-cero`, `fuga-de-familia`, `flecha-resta`, `buzo-enteros` |
| `alg-11b` | `pizzeria`, `candado-fraccion`, `tableta-fraccion`, `agrupa-fraccion`, `corta-igual`, `pon-la-rayita`, `carrera-fracciones` |
| `alg-11c` | `cajas-numericas`, `lupa-densidad`, `ubica-en-recta`, `compas-raiz`, `espiral-teodoro`, `acorrala-raiz`, `frena-aguja` |
| `alg-12b` | `corta-rectangulo`, `agrupa-amigos`, `multiplica-primero`, `inversos-gemelos`, `une-rectangulos`, `deshaz-camino`, `vagon-inverso` |
| `alg-12c` | `arma-producto`, `resta-opuesto`, `voltea-flecha`, `parte-flecha`, `cancela-balanza`, `capas-operacion`, `rebote-signos` |
| `alg-12d` | `tren-ordenado`, `dobla-la-recta`, `espejo-desigualdad`, `distancia-justa`, `dibuja-intervalo`, `correa-del-perro`, `serpiente-orden` |

Evaluación (19 preguntas, 29 min): `laberinto-valor`, `pares-cero`, `flecha-resta`, `domino-equivalencias`, `ubica-en-recta`, `agrupa-fraccion`, `corta-igual`, `espiral-teodoro`, `compas-raiz`, `detective-pasos`, `deshaz-camino`, `agrupa-amigos`, `piramide-numerica`, `resta-opuesto`, `parte-flecha`, `espejo-desigualdad`, `correa-del-perro`.

### Mundo 3 · Escalas y Proporciones (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-12` | `limonada`, `barra-razon`, `estira-foto`, `rejilla-razon`, `receta-escala`, `tasa-unitaria`, `bici-cambios` |
| `alg-12e` | `balanza-proporcion`, `sombra-arbol`, `cuadrado-media`, `duplica-magnitud`, `grafica-relacion`, `reparto`, `llaves-tanque` |
| `alg-12f` | `arma-regla`, `bascula`, `la-obra`, `mapa-escala`, `engranajes`, `tabla-compuesta`, `resortera-tres` |
| `alg-13` | `cuadricula-cien`, `rueda-porcentaje`, `pinta-personas`, `cruz-porcentaje`, `mezcla`, `estira-todo`, `tanque-porcentaje` |
| `alg-13c` | `estira-barra`, `etiqueta-rebaja`, `factor-cambio`, `bodegas`, `precio-original`, `oferta-lleve`, `rampa-precio` |
| `alg-13d` | `cascada`, `rebote`, `semanas-rebaja`, `dos-etapas`, `sube-y-baja`, `puntos-o-porciento`, `rompe-cambios` |

Evaluación (18 preguntas, 27 min): `domino-equivalencias`, `barra-razon`, `rejilla-razon`, `laberinto-valor`, `receta-escala`, `detective-pasos`, `mapa-escala`, `la-obra`, `pinta-personas`, `cuadricula-cien`, `factor-cambio`, `precio-original`, `semanas-rebaja`, `sube-y-baja`.

### Mundo 4 · Exponentes y Radicales (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-21a` | `arbol-potencia`, `torre-producto`, `escalera-potencias`, `pares-negativos`, `cubo-bloques`, `ubica-potencias`, `torre-pisos` |
| `alg-21b` | `cuenta-factores`, `cancela-pisos`, `cambia-de-piso`, `copias-potencia`, `salta-la-coma`, `reparte-exponente`, `escala-leyes` |
| `alg-22a` | `lado-del-cuadrado`, `reparte-factores`, `fraccion-exponente`, `absoluto-raiz`, `suma-raices`, `lado-cubo`, `siembra-raices` |
| `alg-22b` | `saca-del-radical`, `parte-baldosa`, `copias-raiz`, `racionaliza-uno`, `tabla-conjugado`, `indice-radical`, `muro-radicales` |

Evaluación (12 preguntas, 18 min): `laberinto-valor`, `escalera-potencias`, `piramide-numerica`, `detective-pasos`, `cancela-pisos`, `copias-potencia`, `domino-equivalencias`, `fraccion-exponente`, `suma-raices`, `copias-raiz`, `racionaliza-uno`.

### Mundo 5 · Sucesiones y Series (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-14` | `pisa-huellas`, `escalera-aritmetica`, `goteo-tanque`, `cuenta-saltos`, `poste-cerca`, `arregla-termino`, `traza-progresion` |
| `alg-14b` | `dos-escaleras`, `parejas-gauss`, `nivela-barras`, `suma-filas`, `alcancia-semanas`, `suma-impares`, `encesta-suma` |
| `alg-14c` | `rebota-pelota`, `razon-terminos`, `rellena-medios`, `carrera-crecimiento`, `cultivo-celulas`, `zigzag-razon`, `dobla-fichas` |
| `alg-14d` | `resta-corrida`, `torre-geometrica`, `limite-serie`, `cuadrado-mitades`, `ajusta-razon`, `periodico-serie`, `rana-zenon` |
| `alg-15` | `arma-sigma`, `sigma-indices`, `parte-sigma`, `cambia-indice`, `factorial-cajas`, `producto-telescopico`, `maquina-sigma` |

Evaluación (12 preguntas, 18 min): `goteo-tanque`, `poste-cerca`, `nivela-barras`, `alcancia-semanas`, `razon-terminos`, `cultivo-celulas`, `resta-corrida`, `torre-geometrica`, `ajusta-razon`, `parte-sigma`, `sigma-indices`, `factorial-cajas`.

### Mundo 6 · Álgebra de Polinomios (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-23a` | `bloques-polinomio`, `reduce-semejantes`, `resta-voltea`, `evalua-polinomio`, `llena-rectangulo`, `monomio-area`, `torre-grados` |
| `alg-3` | `bloques-area`, `parte-cuadrado`, `diferencia-cuadrados`, `binomios-comun`, `marco-cuadro`, `cubo-del-binomio`, `arma-la-mesa` |
| `alg-24c` | `triangulo-pascal`, `elige-parentesis`, `exponentes-binomio`, `fila-potencia`, `once-potencias`, `elige-comite`, `camino-pascal` |
| `alg-24b` | `factor-comun-bloques`, `diferencia-esquina`, `suma-producto`, `agrupa-terminos`, `completa-cuadrado`, `parte-medio`, `reparte-barras` |

Evaluación (9 preguntas, 14 min): `bloques-polinomio`, `resta-voltea`, `binomios-comun`, `diferencia-cuadrados`, `exponentes-binomio`, `triangulo-pascal`, `bloques-area`, `suma-producto`, `diferencia-esquina`.

### Mundo 7 · Parábolas y Complejos (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-23c` | `plano-complejo`, `vueltas-i`, `suma-complejos`, `conjugado-espejo`, `modulo-circulo`, `cuadrado-complejo`, `gira-complejos` |
| `alg-1` | `despeja-x`, `encuentro-caminantes`, `consecutivos`, `sin-o-infinitas`, `perimetro-x`, `edades-barras`, `balanza-cajas` |
| `alg-4a` | `mueve-parabola`, `simetria-parabola`, `abertura-a`, `forma-canonica`, `ingreso-maximo`, `tres-puntos`, `apunta-chorro` |
| `alg-4` | `raices-imanes`, `producto-cero`, `discriminante-traslada`, `raices-simetricas`, `area-ecuacion`, `vieta-raices`, `donde-cae` |

Evaluación (9 preguntas, 14 min): `suma-complejos`, `modulo-circulo`, `despeja-x`, `consecutivos`, `mueve-parabola`, `forma-canonica`, `simetria-parabola`, `producto-cero`, `discriminante-traslada`.

### Mundo 8 · Raíces de Polinomios (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-23b` | `bolsas-residuo`, `grado-cociente`, `lado-faltante`, `completa-identidad`, `iguala-coeficientes`, `reparte-terminos`, `empaca-filas` |
| `alg-92` | `division-sintetica`, `signo-divisor`, `llena-sintetica`, `factor-k`, `arma-factores`, `divisor-fraccion`, `sondea-niebla` |
| `alg-93` | `tramo-signo`, `multiplicidad`, `prueba-candidatos`, `arma-ceros`, `factoriza-cubica`, `ceros-fraccion`, `cruza-o-rebota` |

Evaluación (8 preguntas, 12 min): `bolsas-residuo`, `iguala-coeficientes`, `division-sintetica`, `llena-sintetica`, `factor-k`, `raices-imanes`, `prueba-candidatos`, `tramo-signo`.

### Mundo 9 · Fracciones Algebraicas (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-25a` | `prohibidos`, `cancela-factores`, `evalua-racional`, `cerca-asintota`, `cruz-asintotas`, `signo-afuera`, `rio-o-hueco` |
| `alg-25b` | `denominador-comun`, `amplifica-fraccion`, `resta-fracciones`, `multiplica-cancela`, `voltea-divide`, `fraccion-compuesta`, `llena-estanque` |
| `alg-101` | `dos-rectas`, `afina-sistema`, `elimina-variable`, `dos-compras`, `combina-vectores`, `escalera-sistema`, `bote-corriente` |
| `alg-102` | `corte-parabola-recta`, `circulo-recta`, `rectangulo-pa`, `parciales-tapar`, `tapa-evalua`, `parciales-repetido`, `cruce-curvas` |

Evaluación (11 preguntas, 17 min): `cancela-factores`, `cruz-asintotas`, `prohibidos`, `evalua-racional`, `denominador-comun`, `resta-fracciones`, `combina-vectores`, `dos-rectas`, `elimina-variable`, `corte-parabola-recta`, `parciales-tapar`.

### Mundo 10 · Crecimiento Exponencial (hecho)

| Lección | Ejercicios (el último en movimiento) |
|---|---|
| `alg-71` | `ajusta-exponencial`, `proyector-sombras`, `mueve-asintota`, `mitad-espejo`, `hacia-e`, `cruce-potencias`, `lirios-laguna` |
| `alg-13b` | `crece-planta`, `carrera-interes`, `ajusta-capital`, `mejor-oferta`, `alcancias-gemelas`, `regla-del-72`, `dos-bancos` |
| `alg-72` | `exponente-buscado`, `espejo-diagonal`, `entre-potencias10`, `expande-log`, `cabe-barra`, `escala-sonido`, `regla-de-calculo` |
| `alg-73` | `balanza-exponencial`, `baja-con-log`, `sube-al-exponente`, `media-vida`, `cambio-u`, `dos-ciudades`, `piedras-selva` |

Evaluación (9 preguntas, 14 min): `balanza-exponencial`, `ajusta-exponencial`, `mitad-espejo`, `crece-planta`, `alcancias-gemelas`, `exponente-buscado`, `expande-log`, `sube-al-exponente`, `baja-con-log`.

### Séptimo juego (segunda pasada)

Tras la revisión independiente, las 33 lecciones que habían quedado con seis juegos recibieron un séptimo (bloque «Séptimo juego» al final de `algebra-revision.js`, función `add7`; entra antes del juego en movimiento) y se rehicieron cuatro juegos que decidían poco: `voltea-divide` (se puede voltear cualquiera de las dos; voltear el dividendo da otro resultado), `resta-fracciones` (hay fracciones que se suman y no cambian), `baja-con-log` (ya no es escoger pasos: se arrastra x hasta que $x\log b$ iguale a $\log N$) y `tapa-evalua` (el estudiante elige en qué x evaluar cada factor). Cuatro temas que ya salían en los videos se cambiaron: el cubo se mide por su lado, los coeficientes del binomio con comités, la regla de los logaritmos con decibeles y el crecimiento con ciudades.

## Evaluaciones sin jefe (todas desde ya)

`assess` (en `algebra-taller.js`) ya no reemplaza preguntas ni toca al jefe: la evaluación queda con sus preguntas
originales, más las variantes que el rediseño había escrito para ellas, más los tres retos del jefe, cada uno ligado a
la lección que repasa. El jefe se borra del mundo (`delete u.boss`). Mientras un mundo no se rehace, sus preguntas
nuevas pueden usar los motores del taller; al rehacerlo se cambian por juegos de sus lecciones. La pregunta del jefe que
ubicaba $-\tfrac74$ en un plano pasa a `ubica-en-recta` desde ya.

## Pruebas

`tests/algebra-revision.test.js`:

- ningún mundo tiene jefe y ninguna parte de la app lo dibuja;
- cada evaluación tiene al menos dos preguntas por lección, todas con lección existente y nota de repaso;
- en los mundos ya rehechos (lista `DONE`): ningún `taller-*` en lecciones ni en la evaluación, 7 u 8 juegos distintos
  por lección con el último en movimiento, ningún juego repetido entre lecciones del curso, pista y `demo` en cada uno.
