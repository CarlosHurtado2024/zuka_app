# Juegos y ejercicios con estética sobria (Álgebra y Trigonometría)

Fecha: 2026-11-25. Pedido: que los ejercicios y juegos de Álgebra y Trigonometría no se vean tan infantiles, sin
volverse aburridos, con jugabilidad y UX/UI excelentes. Sigue a `2026-11-24-mundos-sobrios` (mundos como láminas).

## Qué se veía infantil

Fondo azul-morado con estrellas que titilan y halos en las esquinas; fichas color crema con un labio grueso (relieve
de juguete); carteles con borde amarillo de 3 px; corazones grandes; botones de la app con sombra de 4 px (estilo
caricatura); jefes con ojos saltones, cejas y boca.

## Estilo nuevo: «estudio»

El mismo lenguaje de las láminas de los mundos, para que juego y mapa se sientan una sola app:

- **Fondo**: tinta azul profunda (oscuro) o papel azul muy claro (claro), con **papel milimetrado** fino (líneas cada
  16 px y más marcadas cada 64 px) y un brillo suave arriba. Quieto: nada titila (se lee mejor y gasta menos).
- **Paleta afinada**: los mismos papeles de siempre (sol, coral, menta, cielo, violeta) pero menos saturados y más
  separados entre sí; la ficha neutra pasa de crema cálido a blanco frío.
- **Fichas**: radio 8, labio de 2 px y un filo de luz arriba: se ven tocables (buena UX) sin parecer juguete.
- **Carteles**: tarjeta con borde fino y una barra de color a la izquierda, como los rótulos de los videos.
- **Pestañas**: aro fino de color de marca en la ronda actual.
- **Vidas**: corazones más pequeños; la perdida queda hueca y tachada (no depende solo del color).
- **Celebración**: el confeti es más fino y corto, y la onda al tocar más delgada. Sigue habiendo premio visual.
- **Jefes**: sin caras de caricatura. El Guardián de los Conjuntos es un monolito con tres anillos que giran y un
  núcleo que late; los de Trigonometría tienen un núcleo luminoso en vez de ojos.
- **App (CSS)**: botones con sombra de 2 px, opciones y marco del juego con borde de 1 px, barra de avance más fina,
  enunciado en peso 700.

Lo que se conserva porque hace bueno el juego: tres vidas, cartel «Toca para empezar», pausa tras acertar, chispas al
acertar, guía «Cómo se juega», letras grandes y todo lo táctil (cajas de 30 px o más).

## Pruebas

`tests/juegos-sobrios.test.js`: la paleta es de tinta (no morada) y la ficha neutra es fría; el fondo es papel
milimetrado determinista y sin titileo; fichas con labio ≤ 2 px; sin ojos en los jefes; botones de la app con
sombra ≤ 2 px. Las pruebas de contraste de `tests/guia.test.js` siguen valiendo con la paleta nueva.
