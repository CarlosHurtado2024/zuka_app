# Reel de Zuka · diseño (creación autónoma con video-shotcraft)

Modo: **creación libre autónoma** (el usuario pide decidir sin preguntas). 1080×1920, 30 fps, 27 s, español, sin voz.

## 0. Producto y restricciones

| | |
|---|---|
| Qué es | PWA de matemáticas en español: lecciones = video corto + ejercicios que son minijuegos; pestaña Clips de curiosidades; racha, XP y vidas |
| Para quién es el reel | estudiantes de bachillerato y primeros semestres, en redes verticales (Reels, TikTok, Shorts) |
| Idea de venta | «Aprende jugando»: las matemáticas se juegan, no se sufren |
| Debe verse | el camino de niveles, minijuegos reales, la pestaña Clips, racha/XP/vidas, la marca |
| Datos | estado local de demostración (nombre, racha 7, 1280 XP inventados). Nada personal, nada en vivo |
| No se afirma | precio, tiendas de apps ni dirección web: no hay una dirección pública confirmada, así que el cierre dice «Ábrela en tu celular» |
| Audio | música con ritmo marcado + efectos; se entregan dos versiones (con música / solo efectos) |

## 1. Dirección visual

Tres opciones consideradas: (a) pizarra y tiza, como los cortos; (b) papel claro tipo cuaderno; (c) **la propia app**:
fondo azul noche, azul de marca, dorado de recompensa, Plus Jakarta Sans. Elegida la (c): el reel debe parecer Zuka, y
todas las pantallas son capturas reales en tema oscuro.

Tokens (de `css/styles.css`): fondo `#0c0f1f` / `#070913`, tarjeta `#171c36`, línea `#2a3160`, tinta `#eef0ff`,
apagado `#8f97c4`, marca `#3d7bff`, dorado `#ffc53d`, fuego `#ff8a3d`, error `#ff5a74`. Letra Plus Jakarta Sans 800/700.

Carácter del movimiento: «activo y juguetón» (consumo, educación joven): entradas de 16–26 cuadros con salida suave,
resortes con un rebote visible en fichas y tarjetas, nada de sacudidas de cámara. Un solo estilo de movimiento por plano.

Sin página de styleframe aparte: la marca ya define letra, color y densidad; los cuadros de control de cada plano
hacen de styleframe (ver `out/qa/`).

## 2. Función → plano

| Función | Tarjeta de video-shotcraft | Por qué |
|---|---|---|
| Gancho | `blur-slide` | frase corta que entra palabra a palabra |
| «Esto es Zuka»: el camino de niveles | `radial-ripple-phone-chips` | la tarjeta pensada para apps móviles: teléfono vivo + dos fichas |
| Cantidad y variedad de minijuegos | `deck-deal-flyin` (solo el reparto, sin la órbita inicial) | «llegan sin parar» con metáfora física |
| Clips de curiosidades | plano propio: el feed se desliza dentro del teléfono | es el gesto real de la pestaña |
| Racha, XP, vidas | plano propio: tres tarjetas con contador | números que suben, uno por pulso |
| Marca | `logo-shrink-wordmark-lockup` (en vertical: el icono sube en vez de correrse a la izquierda) | cierre con sello |

Adaptaciones declaradas: todo se recompuso para 9:16 (las tarjetas son 16:9); del reparto se usan 6 naipes (2×3) en
vez de 26, con la misma aceleración fuerte entre salidas; los anillos del teléfono van en los azules de Zuka.

## 3. Guion de planos (pulsos de la música: 105 por minuto, 17.14 cuadros por pulso)

| # | Pulsos | Cuadros | Plano | Movimiento principal | Texto |
|---|---|---|---|---|---|
| 1 | 0–6 | 0–103 | gancho | palabras con desenfoque | «Las mates no tienen que aburrirte.» |
| 2 | 6–16 | 103–274 | teléfono con el camino de niveles | anillos que respiran, el camino baja a velocidad constante, dos fichas saltan | «Aprende jugando» · Videos cortos · Minijuegos |
| 3 | 16–24 | 274–411 | reparto de seis minijuegos | el mazo se hunde y reparte cada vez más rápido; contador | «136 minijuegos · cada uno enseña algo» |
| 4 | 24–32 | 411–549 | Clips | el teléfono sube; en el pulso 28 el feed se desliza al segundo clip (dos capturas reales) | «Clips: datos curiosos» |
| 5 | 32–38 | 549–651 | racha, XP, vidas | tres tarjetas, una por pulso, con contador | «Cada día cuenta» |
| 6 | 38–47 | 651–814 | cierre | anillo que se cierra en el icono, logo, lema, botón, mascota | «Matemáticas que se juegan» · «Ábrela en tu celular» |

Reposo: el cierre queda quieto unos 2 s; el reparto, 2 s con el tablero lleno; el título del teléfono, 1.5 s.
Zonas seguras: nada que deba leerse por encima de y = 250 ni por debajo de y = 1640; fichas a 48 px del borde.

## Audio y licencias

- Música: «Tonight», de Michael Ramir C. (Mixkit Stock Music Free License: uso comercial sin atribución;
  `https://assets.mixkit.co/music/841/841.mp3`), incluida entre las pistas de reserva de video-shotcraft. Rejilla
  medida con `tools/beats.py` (librosa): 104.99 pulsos por minuto, cobertura 0.88. Conviene confirmar la licencia en
  Mixkit antes de pautar el reel.
- Efectos: nueve sonidos CC0 de Freesound; origen, autor y medidas en `public/audio/sfx/audio-manifest.json` y
  `FREESOUND-CREDITS.md`. Son las vistas previas en mp3, no los originales sin pérdida.
- Dos entregas desde la misma línea de tiempo: `reel-zuka.mp4` (con música) y `reel-zuka-sin-musica.mp4` (solo efectos).

## Revisión independiente (subagente, 2026-11-12)

Corregido tras su informe: el fondo del cierre salía en mosaicos (anillo escalado con sombra enorme → ahora a tamaño
real); fichas pegadas al borde; títulos dentro del 12 % superior; contador del reparto que saltaba; naipes cortando
las pestañas de rondas; segundo clip con barras negras (ahora es captura real); título del clip a media animación;
contador de «me gusta» de adorno visible (se oculta en la captura); tarjetas de racha con poco tiempo de lectura;
cierre con poco reposo; llama pequeña; pico de audio.

Cifra: en `js/games/` hay 136 juegos (137 archivos menos `kit.js`); el contador llega a 136 y el texto dice
«136 minijuegos», sin «más de».

## Datos que afirma el reel

- «136 minijuegos»: recuento de archivos de `js/games/` sin `kit.js` el día del render.
- Racha 7, 1280 XP, 5 vidas: datos de demostración, no promesas.
