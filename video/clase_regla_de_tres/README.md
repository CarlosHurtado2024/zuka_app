# Clase 2 · Parte 2: Regla de tres simple y compuesta (vertical 9:16, tema Zuka)

Segunda mitad de la clase de razones y proporciones: un video de unos 5 minutos con el tema
oscuro de la app (degradado morado y mascota de Zuka), hecho con `manimgl` y las utilidades
compartidas de `mb_common.py` (copiadas de `../clase_razones_proporciones/`).

El video va **sin subtítulos ni voz**: cada frase del guion deja una pausa de su mismo largo.
El `.srt` y el guion `.md` sirven para grabar la locución; después se sube a Bunny Stream y se
enlaza en `js/courses/algebra.js` como segundo video de la lección 1.2:
`more: [{ bunny: '<id>', duration: <segundos>, after: 7 }]` (se muestra tras los primeros
siete ejercicios).

Contenido basado en el texto guía Ude@ «Elementos de aritmética», §1.1 *Regla de tres*
(definición 1.4 y ejercicios 1.1, 1.2 y 1.6).

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00 | `S00_PortadaParte2` | Clase 2 · Parte 2 · Regla de tres |
| 0:06 | `S01_QueEs` | el cuarto término de una proporción; recordatorio directa / inversa |
| 0:50 | `S02_Directa` | 150 km en 5 h → ¿7 h? flechas paralelas, x = 150·7/5 = 210 km |
| 1:45 | `S03_Inversa` | 12 obreros en 30 días → ¿24 días? flechas cruzadas, x = 12·30/24 = 15 |
| 2:40 | `S04_SubeOBaja` | truco «¿sube o baja?»: kilos–precio (directa), velocidad–tiempo (inversa) |
| 3:15 | `S05_Compuesta` | 9 hombres, 28 días, 6 h/día → 7 hombres a 8 h/día: cadena 28·9/7·6/8 = 27 |
| 4:35 | `S06_Cierre` | repaso y «¡a practicar!» |

## Cómo se genera (Windows)

Con el entorno aislado `video/.venv-gl` (ver `../clase_sistemas_numericos/README.md`). Desde
esta carpeta y con `video/.venv-gl/Scripts` en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/
python build.py --quality=-l    # borrador rápido en 540 × 960
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `regla_de_tres_parte2.mp4`, `..._guion.srt` y `..._guion.md`.
