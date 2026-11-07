# Clase 6: Sumatoria y productoria (vertical 9:16, tema Zuka)

Video de unos 5 minutos para la lección 1.5 «Sumatoria y productoria», con el tema oscuro de la
app (degradado morado y mascota de Zuka), hecho con `manimgl` y las utilidades compartidas de
`mb_common.py` (copiadas de `../clase_regla_de_tres/`).

El video va **sin subtítulos ni voz**: cada frase del guion deja una pausa de su mismo largo.
El `.srt` y el guion `.md` sirven para grabar la locución; después se sube a Bunny Stream y se
enlaza en `js/courses/algebra.js` como video de la lección `alg-15`:
`clip: { bunny: '<id>', duration: <segundos>, scenes: [] }`.

Los ejemplos resueltos en el video no se repiten en los ejercicios de la lección.

| Escena | Contenido |
|---|---|
| `S00_Portada` | Clase 6 · Sumatoria y productoria |
| `S01_Sigma` | índice, límites y término general; Σ_{k=1}^{5} 2k = 30; 1 + 4 + … + 36 = Σ k² |
| `S02_Propiedades` | lineal; Σ c = nc; Σ_{k=1}^{4} (3k + 1) = 34; Σ ab ≠ Σa · Σb |
| `S03_Notables` | Σ k = n(n + 1)/2 y Σ k² = n(n + 1)(2n + 1)/6; n = 10 → 55 y 385 |
| `S04_Telescopica` | 1/(k(k + 1)) = 1/k − 1/(k + 1); n = 4 → 4/5; suma infinita 1 |
| `S05_Productoria` | Π_{k=1}^{4} 2k = 384 = 2⁴ · 4!; factorial, tabla, n! = n(n − 1)!, 0! = 1 |
| `S06_Cierre` | repaso, «ponte a prueba» (Σ_{k=1}^{6} (k² − k) = 70) y «¡a practicar!» |

## Cómo se genera (Windows)

Con el entorno aislado `video/.venv-gl` (ver `../clase_sistemas_numericos/README.md`). Desde
esta carpeta y con `video/.venv-gl/Scripts` en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/
python build.py --quality=-l    # borrador rápido en 540 × 960
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `sumatoria_clase6.mp4`, `..._guion.srt` y `..._guion.md`.
