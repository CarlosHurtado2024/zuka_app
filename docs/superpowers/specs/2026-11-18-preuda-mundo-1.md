# Preuniversitario UdeA · mundo 1 «Cálculo Mental»: el estándar de ejercicios por lección

Pedido del usuario (2026-11-18): en todas las lecciones de razonamiento lógico, y también en Álgebra y Trigonometría,
**7 u 8 ejercicios distintos por lección** (ningún juego repetido dentro de la lección), **gráficos y muy
interactivos**, sin los «aburridos» de escoger opciones o tocar fichas (`escala-solucion`, `arma-la-cuenta`,
`une-parejas`, `clasifica-cartas`, `ordena-terminos`), y **al final un juego dinámico, en movimiento**.

Son 120 lecciones entre los tres cursos, así que se hace por mundos. Este es el primero y sirve de patrón.

## Cómo se arma una lección

1. Se reparten las ideas del video en 6 o 7 ejercicios, cada uno con un juego distinto y una escena que se manipula
   (arrastrar, deslizar, pintar, estirar). Primero se busca en la biblioteca (`js/games/`, más de 100 juegos gráficos,
   muchos sirven con otros números); lo que no exista se crea, con su `demo(G)` (la mano sobre el juego).
2. El último es un juego en movimiento: `salta-signos`, `carrera-fracciones`, `vuela-precios`, `serpiente-orden`,
   `buzo-enteros`, `dispara-inverso`, `rompe-cambios`, `corta-proporciones`… o uno nuevo.
3. Cada ejercicio con pista que orienta sin regalar y explicación; los ejemplos del video no se repiten.

Nota: la regla «entender, no mecanizar» (nada que apure) sigue valiendo para los ejercicios 1 a 7. El **último** es la
excepción que pidió el usuario: un juego en movimiento «para entretener también al estudiante». Sigue sin castigar: sin
vidas la ronda se reintenta y no se pierde el ejercicio.

## Mundo 1

| Lección | Ejercicios |
|---|---|
| `pu-cm-1` Enteros, signos y jerarquía | recta-espejo · globo-lastre · ascensor · tren-ordenado · voltea-flecha · pares-negativos · capas-operacion · **salta-signos** |
| `pu-cm-2` Fracciones | pizzeria · **tableta-fraccion** (nuevo) · ubica-en-recta · tren-ordenado · **corta-igual** (nuevo) · lupa-densidad · **carrera-fracciones** |
| `pu-cm-3` Decimales y porcentajes | cuadricula-cien · candado-fraccion · pon-la-rayita · rueda-porcentaje · pinta-personas · estira-barra · etiqueta-rebaja · **vuela-precios** |
| `pu-cm-4` Potencias, raíces y estimación | arbol-potencia · torre-pisos · cuenta-factores · lado-del-cuadrado · compas-raiz · acorrala-raiz · siembra-raices · **serpiente-orden** |

Juegos nuevos (`roundsGame`, de arrastrar, con demostración):
- `tableta-fraccion`: una tableta de `total` cuadritos; un deslizador la corta en partes iguales (lo que sobra queda en
  rojo) y se arrastra el dedo sobre ella para tomar partes. «3/4 de 24 = 18». Vale un corte equivalente.
- `corta-igual`: dos barras con a/b y c/d; un deslizador las recorta en n pedacitos. Solo cuando n es múltiplo de los
  dos denominadores los cortes encajan y la tercera barra junta (o quita) los pedacitos: «1/2 + 1/3 = 3/6 + 2/6 = 5/6».

Pruebas: `tests/preuda-mundo-1.test.js`. Siguen los mundos 2 a 16 de razonamiento, y luego Álgebra y Trigonometría.
