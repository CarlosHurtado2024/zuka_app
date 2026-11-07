# Clase 4: Interés simple y compuesto (vertical 9:16, tema Zuka)

Video de unos 6 minutos para la lección 1.3b «Interés simple y compuesto», con el tema oscuro de
la app (degradado morado y mascota de Zuka), hecho con `manimgl` y las utilidades compartidas de
`mb_common.py` (copiadas de `../clase_regla_de_tres/`).

El video va **sin subtítulos ni voz**: cada frase del guion deja una pausa de su mismo largo.
El `.srt` y el guion `.md` sirven para grabar la locución; después se sube a Bunny Stream y se
enlaza en `js/courses/algebra.js` como video de la lección `alg-13b`:
`clip: { bunny: '<id>', duration: <segundos>, scenes: [] }`.

Los ejemplos resueltos en el video no se repiten en los ejercicios de la lección.

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00 | `S00_Portada` | Clase 4 · Interés simple y compuesto |
| 0:06 | `S01_QueEs` | capital, tasa, tiempo; interés y monto; 500.000 al 2 % mensual, 3 meses → 30.000 y 530.000 |
| 1:05 | `S02_Simple` | I = Crt, M = C(1 + rt); préstamo de 1.200.000 al 1,5 % × 8 meses → 144.000 y 1.344.000; barras en recta |
| 2:05 | `S03_Compuesto` | M = C(1 + r)ⁿ; 500.000 al 2 % × 3 → 510.000 → 520.200 → 530.604 (vs 530.000) |
| 3:05 | `S04_Comparar` | 1.000.000 al 10 % anual, 10 años: 2.000.000 vs 2.593.742; gráfica recta vs curva |
| 4:05 | `S05_Despejar` | C = I/(rt): 200.000 al 1 % en 10 meses → 2.000.000; duplicar al 10 %: entre 7 y 8 años; regla del 72 |
| 5:05 | `S06_Cierre` | repaso, «ponte a prueba» (300.000 al 5 % anual compuesto, 2 años → 330.750) y «¡a practicar!» |

## Cómo se genera (Windows)

Con el entorno aislado `video/.venv-gl` (ver `../clase_sistemas_numericos/README.md`). Desde
esta carpeta y con `video/.venv-gl/Scripts` en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/
python build.py --quality=-l    # borrador rápido en 540 × 960
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `interes_sc_clase4.mp4`, `..._guion.srt` y `..._guion.md`.
