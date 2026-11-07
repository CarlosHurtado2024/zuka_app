# Clase 8: Potencias y exponentes (vertical 9:16, tema Zuka)

Video de unos 5 minutos para la lección «Potencias y exponentes» (`alg-21a`, unidad 1 del Manual
de la UdeA, §1.4). Sin voz ni subtítulos; intuición primero (doblar una hoja, contar factores, el
patrón hacia abajo) y fórmula después; cuatro ejemplos resueltos con detalle y sin preguntas al
espectador. Se enlaza como `clip: { bunny: '<id>', duration: <segundos>, scenes: [] }`.

| Escena | Contenido |
|---|---|
| `S00_Portada` | Clase 8 · Potencias y exponentes |
| `S01_DoblarHoja` | 1, 2, 4, 8 capas; 2⁵ = 32; base y exponente |
| `S02_BaseExponente` | 3⁴ = 81; (1/2)⁵ = 1/32; (−5)³ = −125; (−3)⁴ = 81 vs −3⁴ = −81 |
| `S03_Patron` | 8, 4, 2 → 2⁰ = 1 → 1/2, 1/4, 1/8; a⁰ = 1 y a⁻ⁿ = 1/aⁿ; 2⁻³ no es −8 |
| `S04_Ejemplos` | 4⁻³ = 1/64; (−3)⁻⁴ = 1/81; (2/3)⁻² = 9/4 y por qué se voltea; 5⁰ = 1 vs 0⁵ = 0; (−2)⁴ vs −2⁴ |
| `S05_Crecimiento` | gráfica de 2ˣ: sube el doble cada paso y nunca toca el eje |
| `S06_Cierre` | repaso y «¡a practicar!» |

```bash
python build.py                 # HD y dist/
python build.py --quality=-l    # borrador
```

Salidas en `dist/`: `potencias_clase8.mp4`, `..._guion.srt`, `..._guion.md`.
