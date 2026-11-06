# Clase 3 · Parte 2: Aumentos, descuentos e interés (vertical 9:16, tema Zuka)

Segunda mitad de la clase de porcentajes e interés: un video de unos 5 minutos con el tema
oscuro de la app (degradado morado y mascota de Zuka), hecho con `manimgl` y las utilidades
compartidas de `mb_common.py` (copiadas de `../clase_regla_de_tres/`).

El video va **sin subtítulos ni voz**: cada frase del guion deja una pausa de su mismo largo.
El `.srt` y el guion `.md` sirven para grabar la locución; después se sube a Bunny Stream y se
enlaza en `js/courses/algebra.js` como segundo video de la lección 1.3:
`more: [{ bunny: '<id>', duration: <segundos>, after: 6, scenes: [] }]` (se muestra tras los
primeros seis ejercicios).

Contenido: ejercicios propuestos 1.6, 1.10 y 1.12 del texto guía Ude@ «Elementos de aritmética»
(descuentos e incrementos sucesivos, volver al precio) y el interés simple y compuesto del
programa (2 000 000 al 1,5 % mensual durante 12 meses).

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00 | `S00_Portada` | Clase 3 · Parte 2 · Aumentos, descuentos e interés |
| 0:06 | `S01_Factor` | aumentar r % = × (1 + r); descontar = × (1 − r); 50.000 → 60.000 |
| 0:55 | `S02_Sucesivos` | 30 % y 20 % → 0,7 · 0,8 = 0,56 → único 44 %; 20 % y 25 % → +50 % |
| 2:00 | `S03_Volver` | rebaja del 10 % → hay que subir 10/90 = 11,1 % |
| 2:45 | `S04_Simple` | M = C(1 + rt); 2 000 000 al 1,5 % × 12 → 2 360 000 (doce monedas iguales) |
| 3:35 | `S05_Compuesto` | M = C(1 + r)ⁿ → 2 391 236; gráfica recta vs curva a 24 meses |
| 4:30 | `S06_Cierre` | repaso, «ponte a prueba» (40 % y 25 % → 55 %) y «¡a practicar!» |

## Cómo se genera (Windows)

Con el entorno aislado `video/.venv-gl` (ver `../clase_sistemas_numericos/README.md`). Desde
esta carpeta y con `video/.venv-gl/Scripts` en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/
python build.py --quality=-l    # borrador rápido en 540 × 960
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `interes_parte2.mp4`, `..._guion.srt` y `..._guion.md`.
