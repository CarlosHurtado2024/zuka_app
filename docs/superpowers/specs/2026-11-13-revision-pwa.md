# Revisión PWA: capaz, confiable e instalable (2026-11-13)

Revisión de Zuka contra los tres pilares de una PWA. Pruebas: `tests/pwa.test.js` (más `sw.test.js`,
`update.test.js`, `arranque.test.js`, `registro.test.js`).

## Lo que ya cumplía

- **Instalable:** `manifest.json` con `name`, `short_name`, `id`, `start_url`, `scope`, `display: standalone`,
  iconos 192/512 y maskable, `theme_color`, `lang: es`; `apple-touch-icon` y metas de iOS; botón propio de
  instalación (`beforeinstallprompt`, `appinstalled`) y ayuda para Safari.
- **Confiable:** service worker con shell precacheado y versionado (`VERSION`), p5.js precacheado, aviso de
  versión nueva sin recargar a la fuerza (`js/update.js`), videos por rangos fuera de la caché, portada que no
  espera la fuente más de 300 ms, progreso guardado en el equipo, escenas de respaldo si el video no carga.
- **Capaz:** p5.js (lienzo), HLS adaptativo, Web Audio, vibración, tema del sistema, botón «atrás» del celular.

## Lo que se agregó

1. **Sin conexión desde la primera visita:** KaTeX (css y js) y hls.js se precachean al instalar, como p5.
   Antes solo quedaban guardados desde la segunda visita (en la primera el SW aún no controla la página).
   Si un CDN falla, la instalación sigue.
2. **Red lenta:** archivos propios = red primero, pero si la red tarda más de 3 s y hay copia, se responde la
   copia; la red sigue actualizándola por detrás. Sin copia, se espera a la red. Sin red: copia o `index.html`.
3. **Aviso de conexión** (`watchConnection`, `js/pwa.js`): toast al perder o recuperar la red (también al abrir
   sin red) y clase `offline` en `body`. La app ya no falla en silencio.
4. **Atajos del icono instalado** (`shortcuts` en el manifest): Clips, Tutorías y Perfil abren
   `index.html?tab=…`; `tabFromURL` solo acepta pestañas válidas. La primera visita sigue con el recorrido.
5. **Progreso a salvo** (`keepData`): instalada, pide `navigator.storage.persist()` para que el navegador no
   borre `localStorage` cuando falte espacio. Solo instalada, para no mostrar permisos en Firefox.
6. El shell guarda también `icon-maskable-512.png` y `apple-touch-icon.png`.

## Pendiente (opcional)

- `screenshots` en el manifest (Chrome muestra una ficha de instalación más rica en Android y escritorio).
- Web Share (compartir un clip) y Badging (insignia con la racha) cuando el producto lo pida.
- Las reservas de tutorías siguen solo en el celular hasta tener servidor (`TUTORIAS.whatsapp`).
