# Regla de tres: Parte 2 de la lección 1.2 (video + minijuegos)

Fecha: 2026-11-06 · Estado: aprobado en conversación

## 1. Objetivo

La lección `alg-12` (Razones, proporciones y proporcionalidad) gana una **segunda parte** sobre la
regla de tres simple y compuesta: un video nuevo que se muestra **después de los primeros siete
ejercicios**, seguido de cinco ejercicios interactivos nuevos. La lección `alg-13` deja de explicar
la regla de tres y queda como «Porcentajes e interés».

Fuente del contenido: texto guía Ude@ «Elementos de aritmética», §1.1 *Regla de tres*
(definición 1.4 y ejercicios 1.1 a 1.6).

## 2. Motor: videos intercalados con ejercicios

### 2.1 Contenido
Un video de `more` puede llevar `after: n` (entero ≥ 1): se muestra después de los primeros `n`
ejercicios de la lección. Sin `after`, el comportamiento actual (todos los videos antes de los
ejercicios) no cambia.

```js
clip: { bunny: '4c098c45-…', duration: 289, scenes: [...] },
more: [{ bunny: '<id>', duration: <s>, after: 7, scenes: [] }],
ex: [ /* 7 juegos actuales */, /* 5 juegos nuevos */ ],
```

### 2.2 Cola de la lección (`startLesson` en `js/app.js`)
- `buildQueue(l)` (función pura, probada en Node) devuelve la lista de tareas
  `{ k: 'clip', n } | { k: 'ex', i }` en el orden: `clip` principal, luego, por cada ejercicio `i`,
  antes de él los videos de `more` con `after === i`, y después todos los videos de `more` sin
  `after` van justo tras el clip principal (orden actual). Un `after` mayor que `ex.length`
  coloca el video al final, antes de terminar.
- Un ejercicio fallado se vuelve a encolar al final, como hoy. Los videos no se repiten.
- **Deslizar atrás / anterior**: vuelve al último video de la cola anterior a la posición actual
  (desde los juegos nuevos, el video 2; desde los primeros, el video 1). **Siguiente** durante el
  repaso avanza al siguiente video anterior a la posición actual o regresa a la tarea en curso.
- **Rótulos**: «Parte k de N» cuenta todos los videos de la lección en orden de cola; el botón del
  video dice «Parte k+1 →» solo si la siguiente tarea de la cola es un video; si no, «Ejercicios →»
  (o «Al ejercicio →» durante el repaso, como hoy).
- Barra de progreso, corazones, XP y pantalla final no cambian (`total = cola.length`).

## 3. Video «Clase 2 · Parte 2: Regla de tres»

- manimgl en `video/.venv-gl`, carpeta nueva `video/clase_regla_de_tres/` con la estructura de
  `video/clase_razones_proporciones/` (`mb_common.py` copiado, `build.py` de una parte,
  `custom_config.yml`, `assets/`, README). Vertical 1080 × 1920, tema morado, mascota, sin voz
  ni subtítulos; duración entre **4:30 y 5:30**.
- Entregables en `Descargas/Zuka_Clase2_Regla_de_tres/`: `regla_de_tres_parte2.mp4`,
  `_guion.srt`, `_guion.md`. El usuario lo edita, lo sube a Bunny y entrega el ID; entonces se
  enlaza con `more: [{ bunny: '<id>', duration: <s>, after: 7 }]`.

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00–0:06 | `S00_PortadaParte2` | «Clase 2 · Parte 2 · Regla de tres» (estilo de las portadas anteriores) |
| 0:06–0:50 | `S01_QueEs` | Def. 1.4: buscar el cuarto término de una proporción conociendo los otros tres; recordatorio directa (cociente constante) e inversa (producto constante) |
| 0:50–1:45 | `S02_Directa` | Ejercicio 1.1: 150 km en 5 h → ¿7 h? Tabla de dos filas con flechas paralelas; `150/x = 5/7`; `x = 150·7/5 = 210 km` |
| 1:45–2:40 | `S03_Inversa` | Ejercicio 1.2: 12 obreros en 30 días → ¿24 días? Flechas cruzadas; `12/y = 24/30`; `y = 12·30/24 = 15 obreros` |
| 2:40–3:15 | `S04_SubeOBaja` | Truco: «si esta magnitud sube, ¿la otra sube o baja?» con dos ejemplos rápidos (kilos–precio: directa; velocidad–tiempo: inversa) |
| 3:15–4:35 | `S05_Compuesta` | Ejercicio 1.6: 9 hombres, 28 días, 6 h/día → 7 hombres a 8 h/día. (a) fijar las demás magnitudes y resolver obreros–días (inversa), (b) encadenar horas–días (inversa), (c) método rápido: `x = 28 · 9/7 · 6/8 = 27 días` |
| 4:35–5:00 | `S06_Cierre` | Repaso (directa: flechas paralelas; inversa: cruzadas; compuesta: cadena de razones) y «¡a practicar!» |

## 4. Minijuegos nuevos (lección 1.2, ejercicios 8 a 12)

Todos usan el motor `play` existente (`js/games/kit.js`): `grade(state, params)` pura con test en
Node, `create(host, params, api)` con p5.js, `label` para el lienzo y `tex` para KaTeX, toques
enlazados por `mountSketch`.

| # | Juego (`game`) | Mecánica | Correcto si |
|---|---|---|---|
| 8 | `arma-regla` | Dos problemas (directo: 150 km/5 h → 7 h; inverso: 12 obreros/30 días → 24 días). Para cada uno se arrastran las cuatro fichas (`150 km`, `5 h`, `7 h`, `x`) a una tabla de 2 × 2 (misma magnitud por columna, misma situación por fila) y se toca el botón de flechas: paralelas (directa) o cruzadas (inversa). Al bloquear se muestra la proporción armada | Las fichas de cada problema quedan con su magnitud en columna y su situación en fila (las dos filas pueden ir en cualquier orden) y la flecha coincide con el tipo del problema |
| 9 | `bascula` | 3 kg de manzanas cuestan 12.000. Una rueda de precio (de 0 a 40.000 en pasos de 500) y una báscula con 5 kg; la etiqueta de precio de la báscula marca lo que fija la rueda | Precio de 5 kg = 20.000 (±200) |
| 10 | `la-obra` | 12 obreros tardan 30 días. Se arrastran obreros desde la banca a la obra (de 1 a 40); un calendario muestra los días = 360 / obreros. Pregunta: ¿cuántos obreros para terminar en 24 días? | 15 obreros en la obra |
| 11 | `directa-inversa` (reutilizado) | Seis situaciones nuevas: máquinas–horas para un pedido (inversa), grifos iguales–tiempo de llenado (inversa), kilos–precio del mismo producto (directa), velocidad–tiempo del mismo trayecto (inversa), fotocopias–costo (directa), lado–perímetro de un cuadrado (directa) | Todas bien clasificadas |
| 12 | `cadena-razones` | Ejercicio 1.6 como cadena: `x = 28 × [9/7] × [6/8]`. Cada fracción es una tarjeta que se voltea al tocarla (`9/7 ⇄ 7/9`); el resultado se calcula en vivo con un medidor «sube/baja» respecto a 28 | `x = 27` (tarjetas `9/7` y `6/8`) |

Cada juego lleva su `explain` basado en el texto guía. Los nuevos archivos se registran en
`index.html` y en el `SHELL` de `sw.js`; `VERSION` del service worker sube una vez por entrega.

## 5. Lección 1.3

- Título: «Porcentajes e interés». Se elimina la escena «Regla de tres: primero decide…» y los dos
  ejercicios de regla de tres (obreros/muro y máquinas/piezas). Quedan tres escenas (porcentaje,
  descuentos sucesivos, interés simple y compuesto) y tres ejercicios.

## 6. Pruebas

- `tests/cola.test.js`: `buildQueue` con `after: 7` da `clip0, ex0–6, clip1, ex7–11`; sin `after`,
  todos los videos primero; `after` mayor que el número de ejercicios deja el video al final.
- Un test por juego nuevo (`grade` pura): equivalencias y fallos típicos (filas intercambiadas en
  `arma-regla` valen; flecha equivocada no; 19.900 en `bascula` vale, 19.000 no; 15 obreros vale,
  16 no; en `cadena-razones` voltear una sola tarjeta no vale).
- `tests/contenido.test.js` se amplía a `alg-13` y a todas las cadenas nuevas.
- Navegador (375 × 812, toques): lección 1.2 completa (video 1 → 7 juegos → video 2 → 5 juegos),
  deslizar atrás desde el juego 8 muestra el video 2, un fallo se repite al final.
- Video: hoja de fotogramas y duración entre 4:30 y 5:30.

## 7. Fuera de alcance

Porcentajes e interés (siguen en 1.3), más de un video intercalado por lección (soportado por
`after`, pero no se usa), cambios en Clips.
