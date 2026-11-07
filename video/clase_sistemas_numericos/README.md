# Clase 1 · Sistemas numéricos y números reales (vertical 9:16, tema Zuka)

Clase en **dos partes** de unos 6–7 minutos para la lección `alg-11` (Manual de la UdeA, §1.1).
Sin voz ni subtítulos quemados ni preguntas al espectador: cada frase del guion deja una pausa de su
mismo largo (los `.srt` y `.md` sirven para subtitular o grabar la locución). Las reglas del juego,
el orden y el valor absoluto, que estaban en la primera versión, viven ahora en la Clase 7
(`video/clase_axiomas`). Se enlaza en `js/courses/algebra.js` como
`clip: { bunny: '<parte 1>', duration, scenes: [...] }` y `more: [{ bunny: '<parte 2>', duration, scenes: [] }]`.

| Parte | Escena | Contenido |
|---|---|---|
| 1 | `S00_Portada` | Clase 1 · Parte 1 |
| 1 | `S01_Familia` | la caja de herramientas (contar, bajar de cero, repartir, medir) y los apodos ℕ ℤ ℚ ℝ |
| 1 | `S02_Naturales` | contar, leer `{1, 2, 3, …}`, el camino de baldosas, ∈ y ∉, el problema 3 − 5 |
| 1 | `S03_Enteros` | pisos y sótanos, ℤ = ℤ⁺ ∪ ℤ⁻ ∪ {0}, opuestos, el problema de repartir |
| 1 | `S04_Racionales` | pizza y fracción, la definición leída por partes, equivalentes, en la recta, 9/4 = 2.25, 1/3, 177/55 = 3.2 18 periódico y la rayita |
| 1 | `S04b_CierreParte1` | repaso ℕ ⊂ ℤ ⊂ ℚ y «sigue la parte 2» |
| 2 | `S00_PortadaParte2` | recuerdo de la parte 1 |
| 2 | `S05_Irracionales` | la baldosa y √2, los símbolos √ y ≈, patrón vs. sin patrón, π con la rueda, e |
| 2 | `S06_Reales` | ℝ = ℚ ∪ 𝕀, cajas dentro de cajas, dónde vive cada número, la recta del libro (−2.7, √2, e, π, 24/5) |
| 2 | `S07_DecimalAFraccion` | 0.36 periódico = 4/11 y 3.2 18 periódico = 177/55 paso a paso; la regla rápida |
| 2 | `S08_Cierre` | repaso y «¡a practicar!» |

```bash
python build.py                 # HD y dist/
python build.py --quality=-l    # borrador
```

Salidas en `dist/`: `sistemas_numericos_parte1.mp4`, `sistemas_numericos_parte2.mp4` y, por parte,
`_guion.srt` y `_guion.md`.
