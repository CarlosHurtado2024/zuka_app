# Datos de «La curva más corta»

Fuente del tema: informe del usuario «La línea recta no siempre es el camino más corto». Las cuentas están en `data.js`
y se comprueban en `tests/curva-corta.test.js`.

| En pantalla | Respaldo |
|---|---|
| Nueva York y Tokio | Aeropuertos JFK (40.6413° N, 73.7781° O) y Narita (35.7720° N, 140.3929° E), coordenadas públicas de los aeropuertos. |
| R = 6 371 km | Radio medio de la Tierra (radio medio volumétrico/IUGG, 6 371.0 km). |
| θ = 97.4° = 1.70 rad | Fórmula del haversine con esas coordenadas: θ = 1.6998 rad = 97.39°. |
| d = R · θ = 6 371 × 1.6998 ≈ 10 829 km | 6 371 × 1.69979 = 10 829.3 km (arco de círculo máximo sobre una esfera de radio medio). En un elipsoide la cifra cambia unas decenas de km. |
| La recta del mapa: 12 745 km | Loxodrómica (rumbo constante: es la línea recta en Mercator) de JFK a Narita hacia el oeste: 12 744.8 km. Hacia el este mediría 18 708 km. |
| +1 916 km ≈ 2 h de vuelo | 12 745 − 10 829 = 1 916 km; a la velocidad de crucero típica de un avión de línea (unos 900 km/h) son 2.1 h. |
| Por dentro: 9 572 km | Cuerda = 2R · sen(θ/2) = 9 571.9 km. |
| 69.6° N, el punto más al norte del arco | Punto del arco con mayor latitud: 69.59° N, cerca de 145.2° O (la costa norte de Alaska). |
| «Por eso la ruta pasa cerca de Alaska» | Es la ruta teórica de círculo máximo. Los vuelos reales se desvían por vientos (corriente en chorro), clima y espacio aéreo; la línea de fuentes lo dice en pantalla. |
| Círculo máximo = corte por el centro | Definición (el ecuador y los meridianos lo son; los demás paralelos no). |
| «Ningún mapa plano guarda todas las distancias» | Teorema Egregium de Gauss: una esfera no se puede aplanar sin deformar distancias. Mercator conserva los ángulos (rumbos), no las distancias. |
| Relieve ×20 | Exageración vertical del relieve en el globo, para que se vea desde la altura de la cámara. |

## Material del mapa

- Imagen: Sentinel-2 cloudless 2016, https://s2maps.eu, EOX IT Services GmbH (Contains modified Copernicus Sentinel data
  2016), CC BY 4.0. Capa `s2cloudless_3857`, zoom 5. Las ediciones posteriores son CC BY-NC-SA y no se usan.
- Relieve y batimetría: AWS Terrain Tiles (terrarium), zoom 4 (fuentes: SRTM, GMTED, ETOPO1, GEBCO).
- Cada descarga queda anotada en `raw/manifest.jsonl`. Las rutas se calculan; no se dibujan a mano.
