# ¿Qué es un conjunto? · modelo lámina

Video de la lección 1 del mundo **Teoría de Conjuntos** (`alg-0a`). Es la respuesta al pedido del usuario: videos
**consecuentes con el mundo** (el mismo dibujo de su lámina del mapa), con **rigor matemático**, animación sencilla,
lenguaje llano y mucha intuición, y que no deje sin explicar ningún concepto ni ninguna notación, aunque dure 4 o 5
minutos.

- **Formato:** vertical 1080 × 1920, 30 fps, 308 s (5 min 8 s), sin voz ni subtítulos quemados. La narración va
  aparte (`conjunto-lamina.srt`, `narracion.txt`), escrita para leerse en voz alta a menos de 3.25 palabras por segundo.
- **Contenido:** *Manual de Álgebra y Trigonometría* (UdeA) §1.1.

## El estilo es el de la lámina (`js/worlds.js`, `plate` y el mundo `conjuntos`)

| Lámina del mundo | Video |
|---|---|
| fondo de tinta `#0B0E24` teñido con el color del mundo (degradado radial) | igual, con TEAL `#5EE0C1` |
| retícula fina cada 8 unidades | retícula cada 54 px (la misma proporción) |
| trazo blanco redondo, círculos de 1.2 unidades | trazo de 8 px, punteado para lo secundario |
| un solo acento | TEAL para lo que se está explicando; el coral queda solo para la negación (∉, «no es un conjunto») |
| letras en cursiva de libro con borde de tinta | Georgia cursiva con el mismo borde; símbolos en Cambria Math |
| puntos blancos como elementos | igual: cada letra es un punto con su nombre |

Otro mundo = otro color de acento y otro diagrama central (la recta real, el triángulo de proporciones…); lo demás no
cambia. Los rótulos de arriba van en Jost, la letra de la app.

## Cómo se arma cada pantalla

- **Arriba:** un rótulo en versalitas y dos renglones de 30 letras como mucho. Dicen la idea con palabras sencillas.
- **Centro:** el diagrama. Casi todo el video es el mismo: el conjunto V de las vocales, con a, e, i, o, u adentro y
  m, t, s, r afuera. Que no cambie es parte de la explicación: cada notación nueva habla del mismo dibujo.
- **Abajo:** la escritura formal, grande: `a ∈ V`, `V = {a, e, i, o, u}`, `V = {x : x es una vocal}`, `n(V) = 5`.
- **Animación:** se traza, aparece o se mueve una sola vez. Nada rebota ni gira.

## Escenas (tiempos en `data.js`)

| # | Escena | Qué queda claro |
|---|---|---|
| 1 | La idea | juntar objetos y tratarlos como una sola cosa |
| 2 | Definición | conjunto, elemento; mayúsculas y minúsculas |
| 3 | Bien definida | «las vocales» sí; «las letras bonitas» no: tres personas eligen distinto |
| 4 | Diagrama de Venn | curva cerrada: adentro y afuera |
| 5 | Pertenencia | ∈ y sus dos lecturas; de dónde viene (ε, Peano, 1889); ∉ |
| 6 | Por extensión | nombre, signo igual, llaves y comas; ni paréntesis ni corchetes |
| 7 | Por comprensión | cómo se lee; qué es x; «:» y «\|» = «tal que»; la condición decide quién entra |
| 8 | Dos formas | el mismo conjunto; con muchos elementos conviene la condición (L, las letras) |
| 9 | Sin orden | conjuntos iguales: V = W aunque W esté al revés |
| 10 | Sin repetidos | las letras de «salsa»: cinco letras, T = {s, a, l} |
| 11 | Cardinal | n(V) = 5, n(T) = 3 |
| 12 | Elemento y conjunto | a ≠ {a}; a ∈ V y {a} ∉ V |
| 13 | Resumen | seis renglones y la frase que cierra la idea del principio |

Los ejemplos (vocales, «salsa», letras bonitas) no salen en los ejercicios de la lección.

## Archivos

`data.js` (escenas, rótulos, narración y sonidos; lo prueba `tests/conjunto-lamina.test.js`), `film.js` (dibujo en
canvas 2D), `index.html`, `mix.py` (música tranquila y efectos mínimos; escribe el `.srt`) y `build.sh` (unos 12 min;
falla si algún texto no alcanza a leerse).
