# Clase 3 · Parte 1: Porcentajes (vertical 9:16, tema Zuka)

Primera mitad de la clase de porcentajes e interés: un video de unos 5 minutos con el tema
oscuro de la app (degradado morado y mascota de Zuka), hecho con `manimgl` y las utilidades
compartidas de `mb_common.py` (copiadas de `../clase_regla_de_tres/`).

El video va **sin subtítulos ni voz**: cada frase del guion deja una pausa de su mismo largo.
El `.srt` y el guion `.md` sirven para grabar la locución; después se sube a Bunny Stream y se
enlaza en `js/courses/algebra.js` como video principal de la lección 1.3:
`clip: { bunny: '<id>', duration: <segundos>, scenes: [] }`.

Contenido basado en el texto guía Ude@ «Elementos de aritmética», §1.1 *Cálculo porcentual*
(ejercicios resueltos 1.7 a 1.12).

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00 | `S00_Portada` | Clase 3 · Parte 1 · Porcentajes |
| 0:06 | `S01_QueEs` | por ciento = de cada 100; cuadrícula 10 × 10; 35 % = 35/100 = 0,35 |
| 0:55 | `S02_LaCruz` | 100 → C, p → B (regla de tres directa); 12 % de 8.000 = 960 |
| 1:50 | `S03_HallarBase` | ¿de qué número es 48 el 8 %? → 600 |
| 2:25 | `S04_QuePorcentaje` | ¿qué porcentaje es 51 de 170? → 30 % |
| 3:00 | `S05_MasYMenos` | «el 70 % más» = 170 % (408 → 240); «el 9 % menos» = 91 % (546 → 600) |
| 3:50 | `S06_Mezcla` | 40 g de alcohol al 20 % → 200 g de mezcla → 160 g de agua |
| 4:30 | `S07_Cierre` | los tres casos, «ponte a prueba» (63 de 180 → 35 %) y «¡a practicar!» |

## Cómo se genera (Windows)

Con el entorno aislado `video/.venv-gl` (ver `../clase_sistemas_numericos/README.md`). Desde
esta carpeta y con `video/.venv-gl/Scripts` en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/
python build.py --quality=-l    # borrador rápido en 540 × 960
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `porcentajes_parte1.mp4`, `..._guion.srt` y `..._guion.md`.
