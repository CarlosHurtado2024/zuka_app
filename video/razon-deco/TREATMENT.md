# «La razón que no cambia» · estilo Art Deco

Clip de la pestaña Clips de Zuka (tema Matemáticas). Vertical 1080×1920, 30 fps, unos 88 s, sin voz.
La narración va como `.srt` (cama para una locución futura); en pantalla, rótulos cortos en tarjetas deco.

## 1. Tres estructuras candidatas

1. **La exposición** — cinco pabellones de una feria mundial; detrás de cada puerta dorada, una época de la
   razón (Euclides, Pacioli, el SI, el Modulor, el hospital). Se cruza el umbral con puertas que se parten
   por el eje.
2. **La cuenta regresiva** — una enfermera tiene 30 s para cargar una jeringa; cada segundo abre un recuerdo
   histórico. Tensión alta, pero la historia queda de relleno y el reloj eclipsa la idea.
3. **El viaje de una sola razón** — una barra dorada partida en dos (el par *a : b*) atraviesa 2300 años
   cambiando de tamaño: segmento de Euclides → rectángulo de Pacioli → regla del metro → cuerpo del
   Modulor → jeringa. Lo único que no cambia es su color y su proporción.

**Elegida: 3 con la gramática de puertas de 1.** El protagonista es la razón misma: una barra partida, el
único elemento en coral (la excepción de un color, STYLE §3). Cada época es una puerta que se abre por el
eje; la barra cruza todas. Así el tema («la razón no depende del tamaño») *es* el movimiento de la película.

## 2. Logline y arco

Una barra dorada partida en dos viaja de la Grecia antigua a un hospital de hoy, y en cada época alguien la
estira o la encoge sin romper su proporción, hasta que salva una dosis.

- **Planteamiento**: ¿dónde cortar una línea? Euclides propone un corte perfecto (media y extrema razón).
- **Desarrollo**: el corte se vuelve belleza (Pacioli y Leonardo, 1509), luego medida común (SI, 1960),
  luego cuerpo humano (Modulor: 113 · 183 · 226 cm).
- **Giro**: silencio; una sola gota. 80 mg en 2 mL… el médico pide 20 mg.
- **Final**: regla de tres; la jeringa marca 0.5 mL. Se apagan las luces una por una hasta dejar el signo
  «a : b = c : d». Eco del comienzo: la misma barra partida, ahora con cuatro números.

## 3. Referencia

- **Aprender**: títulos de *The Great Gatsby* (2013) — la línea dorada que se dibuja al ritmo de la música;
  carteles de Cassandre — volumen aerografiado dentro de bordes duros, contrapicado extremo; letreros de
  bombillas de Broadway — luz contada.
- **No tomar**: composiciones de carteles concretos, edificios reales, tipografías propias de esas obras,
  melodías.

## 4. Lista de planos (eje central siempre)

| # | Escena | Plano | Cámara | Dur. | Por qué |
|---|---|---|---|---|---|
| 1 | Gancho | inserto: punto de oro | la línea se traza del centro hacia los bordes; empuje | 3 s | en 3 s hay una línea y un corte que suena |
| 2 | Título | general sobre sol radiante | arco escalonado se despliega; bombillas «LA RAZÓN» letra por letra | 4 s | luz contada: el título se cuenta |
| 3 | Euclides | medio: segmento AB con columna | el punto C se desliza y se asienta en el corte áureo; dial φ | 13 s | la idea se construye a la vista |
| 4 | Puerta I | — | hojas que se abren por el eje | 1 s | umbral de época |
| 5 | Pacioli 1509 | general: libro abierto, rectángulo áureo | el rectángulo se subdivide; espiral dibujada en oro; tirón hacia atrás | 12 s | la razón se vuelve figura |
| 6 | Puerta II → SI 1960 | medio: barra patrón, medallones | empuje sobre medallones que giran 1 g = 1000 mg, 1 L = 1000 mL | 12 s | los números llevan la trama (diales) |
| 7 | Modulor | contrapicado Cassandre sobre figura de 7 cabezas | inclinación de abajo arriba por las marcas 113 → 183 → 226 | 15 s | escala y aspiración |
| 8 | Silencio | inserto: frasco esmeralda | empuje lento; tic de reloj | 4 s | respiro antes del giro |
| 9 | Regla de tres | medio: dos filas de medallones | la fila 80 → 2 se copia en 20 → x; flechas cruzadas | 10 s | el método en una imagen |
| 10 | Jeringa-dial | primer plano | el émbolo sube hasta 0.5 mL; destello | 7 s | el pico: la razón salva la dosis |
| 11 | Cierre | general: cartel | tirón atrás al cartel; luces se apagan en reversa | 7 s | eco del comienzo |

Movimientos: empuje, tirón atrás, inclinación vertical, apertura de puertas, rotación de dial, barrido de brillo.

## 5. Guion de pulsos (120 ppm · pulso 0.5 s · compás 2 s)

| Escena | Pulsos | Inicio |
|---|---|---|
| gancho+título | 14 | 0.0 s |
| Euclides | 28 | 7.0 s |
| Pacioli | 24 | 21.0 s |
| SI 1960 | 24 | 33.0 s |
| Modulor | 30 | 45.0 s |
| silencio + regla de tres | 28 | 60.0 s |
| jeringa | 16 | 74.0 s |
| cierre | 16 | 82.0 s |

Total ≈ 90 s.

## 6. Mapa de entradas (música)

Foxtrot sinfónico en fa mayor, 120 ppm, sintetizado con numpy: piano de zancada (bajo-acorde), clarinete
(trinos y un glissando), contrabajo pizzicato caminante, escobillas, campanas tubulares en los golpes de luz.

- Gancho: un golpe de platillo suave + campana al cortarse la línea.
- Título: una campana por letra encendida (una nota por bombilla, escala ascendente).
- Euclides–Modulor: foxtrot completo; cada puerta, un glissando de arpa y el «chunk» de interruptor.
- Silencio (60 s): la música se corta; solo un tic de reloj y una gota.
- Regla de tres: vuelve solo el contrabajo; cada medallón un clic de latón.
- Jeringa: el clarinete sube en glissando con el émbolo y aterriza en el acorde completo al marcar 0.5 mL.
- Cierre: las luces se apagan una por una con un tic descendente; última campana; fin.

## 7. Diseño de sonido

| Sección | Ambiente | Foley | Música |
|---|---|---|---|
| Gancho | sala vacía (ruido rosa grave) | tiralíneas de oro, campana | silencio → golpe |
| Título | — | relés, «chunk», zumbido de filamento | campanas por letra |
| Euclides | — | clic del punto C, roce de piedra | foxtrot suave |
| Pacioli | — | papel (hoja que pasa), pluma | foxtrot |
| SI 1960 | — | engranaje de medallón, clic de latón | foxtrot pleno |
| Modulor | — | pasos de mármol en cada marca | foxtrot con trompeta sordina |
| Silencio | tic de reloj | gota | nada |
| Regla de tres | — | clic de latón por medallón | contrabajo solo |
| Jeringa | — | émbolo (fricción), destello | glissando y acorde |
| Cierre | — | relés que se apagan | coda y campana |

## 8. Texto en pantalla

- Títulos: Limelight, dorado, sobre barra escalonada. Números en Italiana / Poiret One.
- Rótulos: tarjeta lacada con extremos escalonados y doble filete dorado, Josefin Sans SemiBold 40–44 px
  marfil, que se despliega desde el centro. Una idea por tarjeta, ≤ 2 renglones.
- Todo lo que se lee dentro de x 14 %–86 % (151–929 px) y por encima del 85 % del alto (y < 1632).
- Decimales con punto (0.5 mL), como en la app. Mililitro: «mL».

## 9. Datos y respaldo

Ver `FACTS.md`.
