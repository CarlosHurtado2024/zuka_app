# Clase 1 · Sistemas numéricos y números reales (vertical 9:16, tema Zuka)

Versión vertical de la clase en **dos partes**, con el mismo guion y los mismos
tiempos que la versión horizontal original, pero con el tema oscuro de la app:
fondo con el degradado morado del curso de Álgebra y la mascota de Zuka.

Los videos van **sin subtítulos ni voz**: cada frase del guion deja una pausa de
su mismo largo. Los `.srt` y los guiones `.md` sirven para agregar subtítulos o
grabar la locución en un editor de video.

| Parte | Escenas |
|---|---|
| 1 · Naturales, enteros y racionales | Portada, familia, naturales, enteros, racionales, repaso |
| 2 · Irracionales, reales y sus reglas | Portada con recuerdo, irracionales, reales, reglas del juego, orden, valor absoluto, cierre con preguntas |

## Cómo se genera (Windows)

Usa la versión de 3Blue1Brown de Manim (`manimgl`) en un entorno aislado
(`video/.venv-gl`), para no chocar con Manim Community, que usan los otros videos.

```bash
cd video
python -m venv .venv-gl
.venv-gl/Scripts/python -m pip install manimgl imageio-ffmpeg "setuptools<81" audioop-lts
cp .venv-gl/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-*.exe .venv-gl/Scripts/ffmpeg.exe
```

Dos arreglos en `manimlib/utils/tex_file_writing.py` del entorno para que funcione con MiKTeX:

* pasar `-no-pdf` solo cuando el compilador es `xelatex`;
* usar la ruta larga de la carpeta temporal (`Path(temp_dir).resolve()`), porque MiKTeX no
  escribe en rutas cortas como `USERAC~1`.

Luego, desde esta carpeta y con `video/.venv-gl/Scripts` en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `sistemas_numericos_parte1.mp4`, `..._parte2.mp4` y, para cada parte,
`_guion.srt` (subtítulos) y `_guion.md` (guion con tiempos).
