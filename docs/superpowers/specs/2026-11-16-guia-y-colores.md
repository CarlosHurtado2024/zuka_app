# Revisión de todos los juegos: guía «Cómo se juega» y colores que no se pisan

Fecha: 2026-11-16. Pedido: revisar los juegos de todos los mundos, quitar el «amarillo sobre amarillo», y que cada
ejercicio y cada juego muestre un primer ejemplo de cómo se hace, para quien no sabe cómo jugarlo. Todo debe servir en
tema claro y oscuro.

## Qué se revisó

`tests/robot-colores.js` (se carga en la página, no es prueba de Node) monta los 168 juegos que usan los cursos (284
ejercicios `play`, más jefes y evaluaciones) en los dos temas, les da unos toques, los bloquea y, en cada cosa que p5
dibuja, mira el píxel que hay debajo. Avisa de textos con contraste menor de 2.2 y de figuras rellenas del mismo color
que lo que tapan. Muchos avisos son falsos (texto recortado, rótulo junto a su propia línea); los reales:

| Hallazgo | Dónde | Arreglo |
|---|---|---|
| Piezas amarillas (`C.sun`) sobre el papel crema del tema claro, con halos y estrellas también amarillentos | Todos los juegos en tema claro | El papel claro pasa a un azul muy claro: `bg #EEF1FB`, `halo #DEE5F8`, `star #AFBCE8`, `line #C6CFEA`, `creamD #CFD6EC` (y `--play-bg` en el CSS) |
| Texto escrito con el amarillo de relleno | `torre-pisos` (el 0), `siembra-raices` (la meta), `maquina-sigma` (Σ), `jefe-venn` (cartel final) | `C.N`, el amarillo de letra (oscuro en tema claro) |
| Texto blanco fijo sobre stickers de colores | `cascada` | `inkOn(color)` |
| Rótulo «B» menta sobre el círculo menta | `jefe-venn` | `C.Q` |

## Guía «Cómo se juega» (`js/guia.js`)

- La primera vez que el estudiante ve un juego (o un tipo de ejercicio: opción, número, ordenar, deslizador) sale una
  tarjeta con un **primer ejemplo animado**: una mano hace el gesto sobre una escena pequeña con fichas de ese juego.
  Después queda el botón «Cómo se juega» junto a «Ver pista». No sale sola en las evaluaciones (corre el reloj).
- Pasos: `guideSteps(ex)`. A los pasos propios del juego (`GUIDES[nombre]`, uno o dos) se añaden solos: el cartel
  «Toca para empezar» y las vidas en los juegos de acción (`GUIDE_ARCADE`), las pestañas si hay varias rondas, y
  siempre «Comprobar».
- Escenas (`GUIDE_SCENES`, dibujadas en un lienzo 2D de 300 × 150 con la paleta de los juegos): `tap`, `drag` (ficha a
  casilla, punto en cuadrícula, cuerda), `step` (− / +), `slide` (perilla o barra), `turn`, `hold`, `fling` (lanzar o
  resortera), `swipe` (tarjeta, tablero, corte), `trace`, `keys`, `paint`, `touch`, `rounds`, `lives`, `start`, `check`.
- Sin prisa: la animación se repite, se avanza con «Siguiente» y «Atrás». Con «reducir movimiento» se ve un cuadro
  quieto. `Esc` o tocar afuera la cierra.
- Se recuerda en `S.guides[juego]`; «No mostrar la guía al empezar» pone `S.guideAuto = false` (el botón sigue).
- El ejemplo enseña el gesto, no la respuesta: usa fichas pequeñas distintas de las de los ejercicios.
- La mano es un índice que señala (dedos doblados y pulgar, con rayitas al tocar), crema con borde azul noche (se ve en los dos temas y sobre cualquier ficha); las fichas elegidas van en
  menta con aro, las que se mueven en azul. No se usa amarillo de relleno en las escenas del tema claro.

## Pruebas

`tests/guia.test.js`: los 172 juegos tienen guía; escenas existentes, textos de 20 a 100 letras; pasos añadidos
(cartel, vidas, rondas, comprobar); cada escena se dibuja en los dos temas a lo largo de la animación sin fallar; la
guía está conectada (botón, primera vez, recuerdo, estilos, `index.html`, `sw.js`); el fondo claro no es amarillento,
los rellenos vivos se distinguen del fondo y entre sí, las tintas de letra contrastan ≥ 3 con fondo y tarjeta; ningún
juego escribe texto con `C.sun`.

## Queda para después (visto en la revisión, sin tocar)

- Juegos de acción que todavía apuran (Pradera: `lluvia-elementos`, `revienta-globos`, `luciernagas-venn`; Valle:
  `buzo-enteros`, `dispara-inverso`, `salta-signos`, `serpiente-orden`; Razones: los seis), contra la regla
  «entender, no mecanizar».
- Juegos viejos sin las piezas de dibujo de los videos (Trigonometría, Cálculo, Geometría y parte de Álgebra).
- Avisos menores de la auditoría sin confirmar a ojo: rótulos sobre agua en `buzo-enteros`, `encesta-suma` (texto sobre
  el tablero), `brazo-robot` (rótulo coral sobre verde), `pinta-venn` («U» sobre zona pintada).

## Ajustes tras la revisión

- **Evaluaciones**: `exam.js` buscaba el botón de la pista con `.hint-btn` y encontraba el de la guía (abrir la guía
  costaba media pregunta y la pista salía gratis). Ahora busca `.hint-open`.
- El botón atrás del celular cierra la guía (`backStep` → `guide`); al quitar el ejercicio (otra pregunta, salir) su
  guía se cierra sola.
- Con la guía abierta el teclado es suyo (flechas, Esc, Tab entre sus botones) y no llega a la lección; el campo de
  respuesta numérica no toma el foco hasta cerrarla; al cerrar, el foco vuelve a donde estaba.
- Guías que describían mal el gesto: `torre-pisos` (se toca el piso), `bascula` (se arrastra en vertical), `mezcla` y
  `torre-producto` (botones reales), `dispara-inverso`, `buzo-enteros`. La de `maquina-sigma` usaba una ficha que era
  respuesta de un ejercicio.
- La escena de − / + cuenta de uno en uno; el lienzo ya no cambia de tamaño durante la entrada; la guía va sobre los avisos.
- `dispara-inverso`: la bola amarilla lleva borde (salía sobre el cañón amarillo).
- Sin hacer: interruptor en Ajustes para volver a encender las guías automáticas (`S.guideAuto`), la píldora «Cómo se
  juega» en la maqueta del recorrido de bienvenida, y el corredor amarillo que cruza la meta amarilla en `carrera-fracciones`.
