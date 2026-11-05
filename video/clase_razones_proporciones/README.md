# Clase 2 · Razones, proporciones y proporcionalidad (vertical 9:16, tema Zuka)

Un solo video de 5 a 6 minutos con el tema oscuro de la app (degradado morado del curso
de Álgebra y la mascota de Zuka), hecho con la versión de 3Blue1Brown de Manim (`manimgl`)
y las utilidades compartidas de `mb_common.py` (copiadas de `../clase_sistemas_numericos/`).

El video va **sin subtítulos ni voz**: cada frase del guion deja una pausa de su mismo
largo. El `.srt` y el guion `.md` sirven para grabar la locución o agregar subtítulos en
un editor de video; después se sube a Bunny Stream y se enlaza en `js/courses/algebra.js`
con `clip: { bunny: '<id>', duration: <segundos> }`.

Contenido basado en el texto guía Ude@ «Elementos de aritmética», §1.1 (razón, razones
inversas, proporción, cuarta y media proporcional, magnitudes directa e inversamente
proporcionales, reparto proporcional).

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00 | `S00_Portada` | Clase 2 · Razones y proporciones |
| 0:06 | `S01_Razon` | 15 a 5 = 3 y 4 a 20 = 1/4; antecedente y consecuente; receta 2 : 3; π y φ; razones inversas |
| 1:05 | `S02_Proporcion` | 15/3 = 20/4; extremos y medios; ad = bc; ¿forman proporción? |
| 2:15 | `S03_CuartaMedia` | cuarta proporcional 3/5 = 12/x; media proporcional entre 4 y 25 |
| 2:55 | `S04_Directa` | ciclista 150 km en 5 h; constante k; recta y = kx |
| 3:55 | `S05_Inversa` | 12 obreros en 30 días → 15 obreros en 24; xy = k; curva |
| 4:45 | `S06_RepartoCierre` | reparto de 1.200.000 en 2 : 3 : 5; repaso y «¡a practicar!» |

## Cómo se genera (Windows)

Con el entorno aislado `video/.venv-gl` (ver `../clase_sistemas_numericos/README.md` para
crearlo y los dos arreglos de MiKTeX). Desde esta carpeta y con `video/.venv-gl/Scripts`
en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/
python build.py --quality=-l    # borrador rápido en 540 × 960
python build.py --skip-render   # solo vuelve a armar dist/
```

Una sola escena: `manimgl razones_proporciones.py S01_Razon -w`.

Salidas en `dist/`: `razones_proporciones_parte1.mp4`, `..._guion.srt` y `..._guion.md`.
