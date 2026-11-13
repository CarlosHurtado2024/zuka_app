# Juegos dinámicos conceptuales: lecciones 2 y 3 del Valle de los Números

Fecha: 2026-11-14. Pedido del usuario: los juegos no deben exigir cálculos rápidos; la app no busca mecanizar sino que
se entienda el concepto que explica el video de cada lección. Reemplaza el enfoque de `2026-11-14-mejoras-carrera-y-aguja`
(racha con turbo, aguja que hay que frenar a tiempo).

## Regla general (vale para todos los juegos dinámicos de aquí en adelante)

- **Sin reloj sobre el pensamiento:** nada de responder antes de que algo llegue, se vaya o se acabe. El movimiento
  sirve para dar vida y para mostrar la idea, no para apurar. Si algo avanza solo, se detiene y espera la decisión.
- **Se ve la idea, no se calcula de memoria:** el juego dibuja la cantidad (barras, áreas, vueltas) y el estudiante
  compara, construye o ajusta. Las cuentas las hace el juego y las muestra.
- **Equivocarse enseña:** al fallar se muestra por qué (las barras no miden lo mismo, al cuadrado le falta área).

## `carrera-fracciones` (alg-11b): un mismo número, muchos nombres

- La fila de puertas baja y **se detiene**; espera el tiempo que haga falta.
- Bajo el número pedido hay dos reglas con la misma escala. La primera muestra el número pedido como una barra desde el 0,
  con la unidad cortada en sus partes (1/4: la unidad en 4 y se toma 1; 0.25: la unidad en 10).
- Tocar una puerta la **mide** en la segunda regla. Si las dos barras terminan en el mismo punto, son el mismo número.
  Tocar la misma puerta otra vez hace pasar al corredor.
- Pasar por otra quita una vida y la pregunta vuelve con su ayuda (`helpOf`). Se conservan la racha (solo como festejo,
  sin cambiar la velocidad), los pedazos, la sacudida y la meta.
- Funciones puras: `valueOf`, `partsOf(texto)` (en cuántas partes corta la unidad), `rangeOf(item)` (enteros que abarca
  la regla), `helpOf`. Se quitó `turbo`.
- Contenido: en «8/2» la opción 16 pasa a 3 para que la regla no sea tan larga.

## `frena-aguja` (alg-11c): construir el irracional

El video dice que √2 es el lado de un cuadrado de área 2 y que cada real tiene su punto en la recta. El juego conserva
su nombre (no se pierde progreso) pero ya no hay aguja que frenar.

- Se arrastra un punto por la recta. Con él crece un **cuadrado apoyado en la recta** (su lado va del 0 al punto), con
  la cuadrícula de unidades y su área escrita. Hay que dejarlo en el área pedida: el lado es la raíz.
- Para π: una **rueda de diámetro 1** rueda con el punto; se ve cuántas vueltas lleva y el borde desenrollado sobre la
  recta. Una vuelta completa mide π.
- Los negativos (−√5, −π) se construyen hacia la izquierda del 0: el opuesto.
- Botones − y + (una centésima) para afinar y «¡Listo!» para comprobar. Sin tiempo.
- Al acertar: lupa con las décimas, el número con seis decimales y «…» («sus decimales nunca terminan ni se repiten») y
  estrellas. Al fallar: una vida, aviso («al cuadrado le falta área»), tramo entre enteros y la pista del contenido.
- Funciones puras: `hits`, `starsOf`, `bracket`, `kindOf(label)`, `areaOf(item)`, `turnsOf(pos)`, `digitsOf(item)`.
  Se quitó `needleAt`.

## Pruebas

`tests/juegos-dinamicos-valle.test.js`: funciones puras nuevas, que la fila espere (`state === 'waiting'`) y no haya
turbo, que no exista `needleAt`, que cada regla del contenido abarque a lo sumo 8 unidades y que cada valor del contenido
sea el del cuadrado o la rueda. En el navegador, el robot los gana perdiendo antes una ronda.

## Ajustes tras la revisión

- Aguja: el encabezado ya no dice «el lado es −√5» (un lado no mide negativo): dice «√5, a la izquierda del 0». El punto no
  deja que el cuadrado suba hasta el encabezado. Con el punto en 0 el aviso es «Aún no hay cuadrado». Tocar el encabezado
  no mueve el punto. La tolerancia es la menor entre la de la ronda y 0.05.
- Carrera: los cortes de la regla solo se dibujan si quedan a 5 px o más (antes se veían como una mancha en 5/20 o 1/25);
  un decimal corta la unidad en 10, 100 o 1000 y, si no cabe, en décimas. Regla con borde para el tema claro. Dos toques
  seguidos mientras la fila baja ya cuentan (pasa al llegar). Tocar las reglas no elige puerta.
- Queda igual: con el punto cerca del 0 la rueda se sale un poco por la izquierda del lienzo (solo visual).
- No se sacaron capturas nuevas después de estos ajustes; el robot volvió a ganar los dos juegos completos.
