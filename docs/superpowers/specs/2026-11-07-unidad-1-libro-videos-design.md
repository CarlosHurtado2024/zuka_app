# Unidad 1 «Números reales, potenciación y radicación»: videos y ejercicios nuevos

Fecha: 2026-11-07 · Estado: ejecución autónoma

## 1. Objetivo

Dar video y ejercicios interactivos a las clases de la unidad 1 reorganizada según el Manual de la
UdeA, con el formato de las clases anteriores (manimgl vertical, tema Zuka, sin voz: cada `say()`
deja su pausa). Reglas del usuario: videos de ~6 min (varios por lección si el tema es largo),
**varios ejemplos resueltos con todo detalle**, intuición primero y fórmula después, **sin «ponte a
prueba» ni ejercicios dentro del video** (eso va en los juegos), y conservar lo que ya existe
mejorándolo. El contenido y los números salen del libro (§1.2–1.5, problemas 1.1–1.21 y la
autoevaluación 4.2–4.5); los ejemplos del video y los ejercicios no se repiten.

| Lección | Video(s) | Estado |
|---|---|---|
| alg-11 Sistemas numéricos y reales | Clase 1 (dos partes en Bunny) | se conserva; su cierre «ponte a prueba» se deja para una re-render posterior |
| alg-12b Axiomas de campo y orden | **Clase 7** (1 video) | nuevo |
| alg-21a Potencias y exponentes | **Clase 8** (1 video) | nuevo |
| alg-21b Leyes de los exponentes | **Clase 9** (parte 1 leyes, parte 2 negativos y simplificar) | nuevo |
| alg-22a Raíces y exponentes racionales | **Clase 10** (1 video) | nuevo |
| alg-22b Simplificar y racionalizar | **Clase 11** (1 video) | nuevo |

Cada lección mantiene sus ejercicios anteriores y suma juegos; mientras no haya ID de Bunny, el
`clip` lleva las escenas de texto ya existentes (mejoradas) como respaldo.

## 2. Juegos nuevos (contrato de `js/games/kit.js`)

| Juego | Mecánica | `params` | `state` | Correcto si |
|---|---|---|---|---|
| `voltea-desigualdad` | Dos puntos en una recta con `a < b`; cada paso aplica una operación (+k, −k, ×k, ×(−k)) y los puntos se mueven; el alumno elige «<» o «>» para el resultado | `{ a, b, steps: [{ op: '+'\|'×', k }] }` | `{ signs: ['<'\|'>'\|null] }` | cada signo es el correcto tras aplicar la operación |
| `une-parejas` | Como `une-factor` pero con etiquetas libres a los dos lados | `{ left: [label], right: [label], pairs: [[i, j]] }` | `{ links: [j\|null] }` | `links[i]` es la pareja de `i` para todo `i` |
| `lado-del-cuadrado` | Un cuadrado cuya esquina se arrastra; el área se muestra en vivo; meta: el lado cuya área es la pedida (rondas) | `{ rounds: [{ area }], max, step, tol }` | `{ sides: [número\|null] }` | `\|side² − area\| ≤ tol` por ronda |
| `saca-del-radical` | Factores primos del radicando como fichas dentro del radical; tocar un grupo de `index` fichas iguales lo saca como un factor afuera | `{ rounds: [{ index, n }] }` | `{ rounds: [{ out: [p], in: [p] }] }` | producto de `out` y de `in` iguales a la forma simplificada |
| `ordena-terminos` (generalizado) | gana `sep` (por defecto `'+'`) para encadenar pasos con `'='` | + `sep` | igual | igual |

Reutilizados: `reglas-del-juego`, `clasifica-cartas`, `dibuja-intervalo`, `torre-producto`,
`rellena-medios`, `verdadero-falso`.

## 3. Clases

**Clase 7 · Axiomas de campo y orden** (`video/clase_axiomas/`): S01 las reglas del juego (balanza:
conmutar y asociar no cambian el peso; distributiva con rectángulos de área) · S02 consecuencias
(cancelativa, $0 \cdot a = 0$, ¿por qué menos por menos da más? con el patrón $(-2)\cdot 3, (-2)\cdot 2,
\dots$) · S03 el orden (tricotomía en la recta; sumar desplaza; multiplicar por negativo refleja y
voltea) · S04 valor absoluto como distancia ($|{-7}|$, $|2 - \sqrt2|$, $|a - b|$) · S05 ejemplos
detallados (justificar $5 - 3 = 5 + (-3)$ paso a paso; resolver $-3x > 12$ viendo el volteo; distancia
entre $-4$ y $3$) · S06 cierre. Ejercicios: 5 mc existentes + V/F + `reglas-del-juego`
(ampliado), `clasifica-cartas` signos de operaciones, `voltea-desigualdad`, `dibuja-intervalo` con
$|x - 2| \le 3$.

**Clase 8 · Potencias y exponentes** (`video/clase_potencias/`): S01 multiplicación repetida (doblar
una hoja: 1, 2, 4, 8…) · S02 base y exponente, $3^4$, $(1/2)^5$, $(-5)^3$ con cuidado del signo ·
S03 el patrón hacia abajo (÷ la base): $2^1, 2^0, 2^{-1}$; por qué $a^0 = 1$ y $a^{-n} = 1/a^n$ ·
S04 ejemplos detallados ($-2^4$ vs $(-2)^4$; $4^{-3}$; $(-3)^{-4}$; $(2/3)^{-2}$) · S05 crecimiento
exponencial (gráfica de $2^x$) · S06 cierre. Ejercicios: 5 existentes + `torre-producto` (dobleces
hasta 512 capas), `clasifica-cartas` signo de potencias, `rellena-medios` (escalera $16, 8, \dots,
0.25$), V/F.

**Clase 9 · Leyes de los exponentes** (`video/clase_leyes_exponentes/`, dos partes): Parte 1: S01
contar factores ($a^3 \cdot a^4$) → suma · S02 dividir cancela → resta · S03 potencia de potencia
→ producto; $(ab)^n$ y $(a/b)^n$ · S04 ejemplos detallados ($x^2 x^5$, $y^7/y^3$, $(2x)^3$,
$(x^2y)^4$, $5^{n+1}/5^{n-1}$) · S05 cierre. Parte 2: S11 negativos: $a^{-n} = 1/a^n$ y
$(a/b)^{-n} = (b/a)^n$ (voltear la fracción) · S12 simplificar con literales
($(3x^{-2}y)^{-2}$, $\frac{(x^{-3}y^2)^{-4}}{(y^6x^{-4})^{-2}}$) · S13 exponentes con $n$:
$\frac{2^{n+3}}{2^{n}}$, $\frac{9^{n}}{3^{n}}$ · S14 notación científica · S15 cierre. Ejercicios: 6
existentes + `une-parejas` (expresión ↔ simplificada), `ordena-terminos` con `sep: '='`, V/F de
leyes, 3 mc del libro (1.9 y 1.10 con exponentes literales, 1.16 adaptado). Los juegos que muestran
opciones (`une-parejas`, `ordena-terminos`) las barajan con `shuffledOrder` (kit), y `lado-del-cuadrado`
mide la tolerancia sobre el lado (0.05) con botones − y + de ajuste fino.

**Clase 10 · Raíces y exponentes racionales** (`video/clase_raices/`): S01 la raíz deshace la
potencia (área → lado: $\sqrt{49}$, $\sqrt{2}$ como lado del cuadrado de área 2) · S02 índice par e
impar; raíces de negativos · S03 $\sqrt{x^2} = |x|$ · S04 exponentes fraccionarios (el denominador
es el índice) con ejemplos ($8^{2/3}$, $16^{3/4}$, $25^{-1/2}$, $(-27)^{1/3}$) · S05 la raíz no se
reparte en sumas · S06 cierre. Ejercicios: 4 existentes + `lado-del-cuadrado`, `une-parejas`,
`clasifica-cartas` real/no real, mc del libro (4.5–4.7).

**Clase 11 · Simplificar y racionalizar** (`video/clase_radicales/`): S01 propiedades
($\sqrt{ab} = \sqrt a \sqrt b$, $\sqrt{a/b}$) · S02 sacar factores (factores primos por parejas:
$\sqrt{72}$, $\sqrt{45}$, $\sqrt[3]{54}$) · S03 radicales semejantes ($\sqrt{72} + 3\sqrt{50} -
\sqrt{18}$) · S04 racionalizar un monomio ($\frac{7}{3\sqrt2}$) · S05 conjugado ($\frac{9}{4 +
\sqrt5}$, $\frac{3}{\sqrt{2x + 3} - \sqrt{2x}}$) · S06 raíz cúbica con diferencia de cubos
($\frac{1}{\sqrt[3]{2} - 1}$) · S07 cierre. Ejercicios: 4 existentes + `saca-del-radical`,
`une-parejas`, `ordena-terminos` (`sep: '='`), mc del libro (1.7, 1.8, 1.11, 1.12, 4.1–4.12).

## Adenda · Clase 1 regenerada (alg-11 Sistemas numéricos y números reales)

La Clase 1 se vuelve a generar en `video/clase_sistemas_numericos/` con el guion ya existente,
recortado a lo que el libro pone en §1.1 (naturales, enteros, racionales, irracionales, reales y la
recta real): las reglas del juego, el orden y el valor absoluto ya viven en la Clase 7 (alg-12b) y
salen de aquí, igual que el cierre «ponte a prueba». Dos partes de unos 6 minutos:

* **Parte 1 · Naturales, enteros y racionales**: portada · familia (caja de herramientas, apodos) ·
  naturales (contar, llaves y puntos, baldosas, ∈, el problema 3 − 5) · enteros (pisos y sótanos,
  ℤ = ℤ⁺ ∪ ℤ⁻ ∪ {0} como en el libro, opuestos, el problema de repartir) · racionales (pizza,
  definición leída por partes, equivalentes, en la recta, de fracción a decimal con 9/4 = 2.25 y
  177/55 = 3.2 18 periódico del libro, la rayita) · cierre de la parte.
* **Parte 2 · Irracionales, reales y la recta**: portada con recuerdo · irracionales (baldosa √2,
  √ y ≈, patrón vs. sin patrón, π con la rueda, e) · reales (unión, cajas dentro de cajas, dónde
  vive cada número, la recta del libro con −2.7, √2, e, π y 24/5) · **nuevo**: de decimal periódico
  a fracción con dos ejemplos detallados (0.36 periódico = 4/11 y 3.2 18 periódico = 177/55) ·
  repaso y «¡a practicar!».

Ejercicios de alg-11 (sin repetir los ejemplos del video): `cajas-numericas` con tarjetas nuevas y
veredicto «caja válida pero no la más pequeña» (naranja) distinto de «equivocada» (rojo) ·
`verdadero-falso` renovado · `ubica-en-recta` con lectura en vivo del valor y puntos nuevos ·
`pizzeria` con pedidos nuevos (0.6, 0.666…, 25 %, tres octavos) · `clasifica-cartas` racional /
irracional por el decimal (con 22/7 y 0.1010010001… de trampa) · `ordena-terminos` con los pasos
de 0.45 periódico → 5/11 · `num` 0.27 periódico = k/11 · `une-parejas` fracción ↔ decimal · mc del
libro 1.2 adaptado. `reglas-del-juego` y `dibuja-intervalo` ya están en alg-12b (se quitan de
alg-11); `distancia-justa` se mueve a alg-12b (valor absoluto).
