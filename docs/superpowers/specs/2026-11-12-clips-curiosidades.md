# Clips de curiosidades

Fecha: 2026-11-12

## Qué pide el usuario

La pestaña **Clips** deja de ser «los videos de las lecciones, uno tras otro» y pasa a ser un feed de **videos
cortos de datos curiosos de matemáticas y ciencia**. Los videos de las lecciones ya no aparecen ahí (siguen
dentro de cada lección). Primer clip: «El origen de los números».

## Datos

`js/curiosidades.js` (se carga después de `content.js`):

```js
const CURIO_TOPICS = [{ id: 'mate', name: 'Matemáticas', color }, { id: 'ciencia', name: 'Ciencia', color }];
const CURIOS = [{
  id: 'cur-origen-numeros',            // siempre con prefijo cur-, para no chocar con ids de lecciones
  topic: 'mate',
  title: 'El origen de los números',
  fact: 'una frase: el dato curioso',  // pie del clip en el feed
  clip: { video: 'media/clips/origen-numeros.mp4', duration: 83, scenes: [sc(…)] },
}];
curioFeed(filtro)   // [{ c: tema, l: curiosidad }], la misma forma que usaba el feed de lecciones
findCurio(id)       // { c, l } o undefined
curioTopics()       // solo los temas que ya tienen algún clip
```

- `clip` tiene la misma forma que el de una lección, así que `makePlayer` lo reproduce sin cambios: `video`
  (mp4 dentro del repositorio) o `bunny` (id de Bunny). Mientras el usuario no suba el video a Bunny se sirve el
  mp4 de `media/clips/`; al recibir el id se cambia `video` por `bunny` y se borra el mp4.
- `scenes` es el respaldo animado: si el video da error, `VideoClip` avisa con `opts.onFail` y el feed cambia ese
  clip por un `ClipPlayer` con sus escenas.

## Pestaña Clips

- El feed sale de `curioFeed(feedFilter)`. Nada de `COURSES` ni `lessonsOf`.
- Chips: «Para ti» y un chip por tema **que tenga clips**; con un solo tema no se muestran chips (no hay nada
  que filtrar).
- Riel: «Me gusta» y «Guardar». Se quitan «Voz» (los videos traen su propio sonido; el botón de silencio ya
  está en el reproductor) y «Practicar» (una curiosidad no tiene ejercicios).
- Pie abajo a la izquierda con tema, título y la frase `fact`: **solo en pausa** (mientras corre taparía lo escrito
  en el video), por encima de la barra de adelantar. Sonido y velocidad van en la columna del riel.
- Ver un clip completo sigue dando +1 XP (`watched`).

## Perfil

«Clips guardados» resuelve cada id guardado como lección o como curiosidad. Una curiosidad guardada abre la
pestaña Clips en ese clip. Los guardados viejos (lecciones) siguen abriendo su lección; si está bloqueada, se
avisa con un mensaje en vez de mandar al feed, que ya no las contiene.

## Textos que cambian

- Recorrido guiado, paso `clips`: título «Clips: datos curiosos» y texto acorde.
- Hoja «Sin vidas»: «mira clips de curiosidades».

## El mp4 y el service worker

El mp4 no entra en `SHELL` (pesa varios MB). El navegador pide los videos con `Range` y recibe 206, que la
Cache API no acepta: el service worker deja pasar sin tocar las peticiones con cabecera `Range`.

## Pruebas (`tests/curiosidades.test.js`)

- Cada curiosidad: id único con prefijo `cur-`, tema válido, título, `fact` corta, clip con `video` o `bunny`,
  duración y escenas de respaldo; si es `video`, el archivo existe.
- Ningún id de curiosidad coincide con el de una lección; `curioFeed` solo devuelve curiosidades y filtra por tema.
- `renderClips` no usa `lessonsOf` ni pinta «Practicar».
- `js/curiosidades.js` está en `index.html` y en `SHELL`; el paso del recorrido ya no habla de lecciones.
