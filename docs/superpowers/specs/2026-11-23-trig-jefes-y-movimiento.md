# Trigonometría: jefes finales, juegos de cierre con movimiento y revisión completa

Fecha: 2026-11-23. Pedido: revisar y mejorar los juegos y ejercicios de Trigonometría, poner un jefe final al terminar
cada mundo y que el juego del final de cada lección se sienta vivo, no aburrido.

## Jefe final de cada mundo: `jefe-rueda`

Batalla por turnos, **sin reloj**, hecha con `questGame` (tres fases = tres rondas, tres vidas por fase, la fase se
reintenta si se acaban). El jefe aparece arriba, se mueve solo y tiene barra de vida; abajo hay una **rueda de ángulos**
con nudos cada 15°. Cada ataque es un reto corto cuya respuesta son uno o varios nudos: se marcan como runas (tocar otra
vez las quita) y se toca «¡Atacar!». Si están todas las soluciones y solo ellas, salen rayos hacia el jefe y pierde vida;
si no, el jefe golpea (una vida) y dice si sobran o faltan runas, sin decir cuáles. El juego no revela cuántas
soluciones hay salvo que el reto lo diga.

| Mundo | Jefe | Fases |
|---|---|---|
| Mar de las Ondas | El Kraken de las Olas (`jefe-trig-ondas`) | Ángulos y arcos · Triángulos y circunferencia · Signos y ondas |
| Faro de los Ángulos | El Guardián del Faro (`jefe-trig-inversas`) | Inversas e identidades · Suma, doble y ecuaciones · Triángulos sin ángulo recto |
| Galaxia Polar | La Nebulosa Polar (`jefe-trig-polar`) | Forma polar · Producto, cociente y potencia · Raíces |

En la Galaxia Polar la rueda tiene cuatro anillos (módulos 1, 2, 4 y 8) y nudos cada 30°: se marca un complejo, o
todas las raíces n-ésimas. Datos en `TRIG_BOSS` (final de `js/courses/trig-juegos.js`): ataque =
`[rótulo, nudos [[grados, anillo?]], por qué, opciones?]`. Casos para pensar: un ángulo de triángulo no pasa de 180°
(`cos C = −½` tiene una sola respuesta), las inversas dan un solo valor, `sen²θ = ¾` tiene cuatro.

## Juegos de cierre con movimiento

`TK.glide(G, clave, destino)` acerca poco a poco un valor dibujado a su destino y `TK.fire(G)` / `TK.prog(G, dur)`
marcan y miden una animación de lanzamiento. Solo cambian el dibujo: la lógica (`ok`, `press`, `peek`) usa siempre el
valor real, y sin cuadros (Node) o con «reducir movimiento» todo salta al final. Con ellas: la rueda de `rueda-rodante`
rueda de verdad hasta donde llegó; las olas de `ola-entre-lineas` y `crestas-faroles` avanzan al soltarlas; la espiral
de `quita-vueltas` se enrolla y desenrolla; giran suave la bisagra, el punto de `parientes-polares`, el reflejo de
`espejo-cuadrantes`, la ventana de `ventana-inversa` y el corte de `tira-doble`.

## Revisión

- Robot de colores (`tests/robot-colores.js`) sobre los 43 juegos que usa el curso, en los dos temas: sin textos sin
  contraste en los juegos nuevos; quedan dos rótulos sobre líneas en juegos viejos (`telarana-polar`,
  `espiral-potencias`).
- Robot de juego (`tests/robot-trig.js`) sobre los juegos `questGame` y los tres jefes.
- Revisión fresca de todo el curso (lo nuevo y los ejercicios viejos de `trig.js`): sus arreglos se anotan abajo.

## Pruebas

`tests/jefes-trig.test.js`: un jefe por mundo con tres fases; cada ataque con solución sobre nudos del tablero, sin
empezar resuelto, con rótulo corto y explicación; casos para pensar; registro, guía y vidas; los juegos de cierre usan
las ayudas de movimiento.

## Ajustes tras la revisión fresca

- **Jefe**: en la rueda con anillos el toque elige el anillo más cercano al dedo y el nudo más cercano en ángulo (ya no
  hace falta puntería); rueda un poco más grande; el jefe cae y sale «¡Vencido!» con el último golpe; los retos dicen
  qué hacer («Marca…», «Resuelve…»); el de la inversa pide «el lado terminal» de sen⁻¹ (su valor es −60°, lado de 300°).
- **Movimiento**: al empezar un reto se limpian los valores animados (nada vuela desde el reto anterior) y las
  animaciones de lanzamiento son más cortas, para que el aviso no salga antes de que terminen.
- **Cada juego de cierre, solo en su lección**: se quitaron los préstamos de `multiplica-razon` (trig-1) y
  `proyecta-punto` (trig-2).
- **Ejercicios viejos**: trig-1 ya calcula con el seno (no Pitágoras); trig-2 pide condiciones nuevas (sen θ = cos θ,
  cos θ = sen 30°, tan θ · tan 60° = 1); trig-43b y trig-46b no repiten el ejemplo de su video (210°; a = 5, b = 8,
  C = 60° → c = 7); trig-44b tiene por fin la tangente (periodo de tan 4x); trig-46a usa un triángulo que no es
  rectángulo; trig-151 cambia 5 − 12i por −6 + 8i; la telaraña de trig-152 ya no cae dos veces en el mismo nudo; en
  trig-3 el estudiante arma r con la raíz. Pistas reescritas donde dictaban la cuenta (trig-41a, trig-45, trig-153) y
  `corredores-dobles` ya no dice «frena justo».
- `red-periodica` vuelve a esconder los peces al mover una perilla.
- Sin hacer: retos repetidos entre lecciones (3-4-5, el faro de trig-42c), el rótulo «½» apretado en
  `parientes-polares` y `multiplicador-oculto`, y los dos rótulos sobre líneas de `telarana-polar` y `espiral-potencias`.
