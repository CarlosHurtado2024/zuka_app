# Clase 7: Axiomas de campo y orden (vertical 9:16, tema Zuka)

Video de unos 6 minutos para la lección «Axiomas de campo y orden» (`alg-12b`, unidad 1 del Manual
de la UdeA, §1.2–1.3), con el tema oscuro de la app, hecho con `manimgl` y las utilidades
compartidas de `mb_common.py`.

Sin subtítulos ni voz: cada frase del guion deja una pausa de su mismo largo. Intuición primero
(la balanza, las áreas, la recta que se refleja) y fórmula después; tres ejemplos resueltos con todo
detalle y **sin preguntas al espectador** (los ejercicios están en la app). Al subirlo a Bunny se
enlaza como `clip: { bunny: '<id>', duration: <segundos>, scenes: [] }`.

| Escena | Contenido |
|---|---|
| `S00_Portada` | Clase 7 · Axiomas de campo y orden |
| `S01_Reglas` | balanza: conmutativa y asociativa; neutros e inversos; distributiva con áreas (3 · (4 + 2)) |
| `S02_Consecuencias` | ley cancelativa demostrada; 0 · a = 0; por qué menos por menos da más (el patrón −6, −4, −2, 0, 2, 4); restar es sumar el opuesto |
| `S03_Orden` | a < b en la recta; tricotomía; sumar desplaza; × positivo conserva, × negativo refleja y voltea (1 < 3 → −2 > −6) |
| `S04_ValorAbsoluto` | distancia al cero; definición por casos; |√2 − 2| = 2 − √2; distancia entre −4 y 3 |
| `S05_Ejemplos` | 2x + 5 = 11 justificando cada paso; −3x > 12 (voltea); |x − 2| = 3 y |x − 2| < 3 en la recta |
| `S06_Cierre` | repaso y «¡a practicar!» |

## Cómo se genera (Windows)

```bash
python build.py                 # renderiza en 1080 × 1920 y arma dist/
python build.py --quality=-l    # borrador rápido
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `axiomas_clase7.mp4`, `..._guion.srt` y `..._guion.md`.
