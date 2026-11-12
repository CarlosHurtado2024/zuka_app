# Calidad y jugabilidad de los juegos de Álgebra U1–U3 (lecciones y evaluaciones)

## Qué se revisó

Los 91 ejercicios `play` (64 juegos distintos) de las unidades «Sistemas numéricos y axiomas», «Razones,
proporciones y porcentajes» y «Potenciación y radicación», más sus tres evaluaciones. Método:

1. **Auditoría automática** en el navegador: cada ejercicio se monta a 256, 276 y 328 px de lienzo (celulares
   de 300, 320 y 375 px), se recorren sus rondas y su estado bloqueado, y se registra cada `p.text`: textos
   fuera del lienzo, cortados por su caja, encimados o con letra menor de 10 px.
2. **Hojas de contacto** de todos los juegos a 276 y 256 px, tema oscuro y claro.
3. **Auditoría de toques** en los 252 ejercicios `play` de toda la app (133 juegos): se presiona una rejilla
   de puntos y se comprueba que todo toque que cambia el estado devuelva `false` en `mousePressed`.

## Qué se encontró

- Los juegos se diseñaron para un lienzo de ~328 px. Como el alto era `ancho × aspecto`, en un celular de
  320 px (lienzo de 272) el alto bajaba ~60 px y lo que va apilado con medidas fijas se encimaba o se salía:
  unos 30 juegos con textos cortados, rótulos montados o botones fuera del lienzo (en `arma-regla` dos fichas
  quedaban fuera y el ejercicio no se podía resolver; en `rebote` los botones − y + quedaban cortados).
- `.play { touch-action: none }`: sobre el lienzo no se podía desplazar la lección. Con juegos de 400–650 px
  de alto (en la evaluación, `domino-equivalencias`) el estudiante quedaba atrapado sin ver «Comprobar».
- Detalles: «1 capas», «0 doblezs», la etiqueta de obreros tapada por los botones, rótulos de `cruz-porcentaje`
  tapados por la casilla de abajo, pestañas de `lado-del-cuadrado` bajo los botones − y +.

## Qué se hizo

**En el kit (`js/games/kit.js`), para todos los juegos:**

- `heightFor(w, aspecto)`: el lienzo conserva el alto del diseño (`max(w, 328) × aspecto`) en pantallas angostas.
- `safeText`: todo `p.text` pasa por aquí. Texto suelto más ancho que el lienzo → se encoge (mín. 9 px); si se
  sale por un borde → se corre hacia adentro. Texto en caja → se dibuja renglón a renglón, encogido si hace
  falta y siempre dentro del lienzo (p5 recortaba los renglones que no cabían). No actúa con el lienzo
  trasladado o girado, ni sobre lo que está casi todo fuera de la vista (escondido a propósito).
- Toques: el lienzo usa `touch-action: pan-y`. Un toque es del juego solo si `mousePressed` devuelve `false`
  (agarró algo); si no, es un desplazamiento y el juego no recibe ni el arrastre ni el final de ese toque.
  **Regla para juegos nuevos: devolver `false` en `mousePressed` siempre que se agarre o toque algo.**

**En la lección (`js/exercises.js`, `css/styles.css`):** el marco del juego aparece con un fundido, muestra
un indicador mientras carga p5.js, y al comprobar se pinta de verde o rojo (y se sacude si falló).

**Juego por juego:** `la-obra`, `rebote`, `cruz-porcentaje`, `mezcla`, `lado-del-cuadrado`, `acorrala-raiz`,
`torre-producto` (plurales: «1 capa», «9 dobleces»).

## Pruebas

`tests/juegos-celular.test.js`: `wrapWords`, `spanShift`, `heightFor`, `safeText` (con un p5 de mentira),
reparto de toques, CSS del marco y que todo juego con arrastre devuelva `false` al agarrar.
