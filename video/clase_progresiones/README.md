# Clase 5: Progresiones aritméticas (Parte 1) y geométricas (Parte 2), vertical 9:16, tema Zuka

Dos videos de unos 4:30 para la lección 1.4 «Progresiones aritméticas y geométricas», con el
tema oscuro de la app (degradado morado y mascota de Zuka), hechos con `manimgl` y las
utilidades compartidas de `mb_common.py` (copiadas de `../clase_regla_de_tres/`).

Los videos van **sin subtítulos ni voz**: cada frase del guion deja una pausa de su mismo largo.
Los `.srt` y guiones `.md` sirven para grabar la locución; después se suben a Bunny Stream y se
enlazan en `js/courses/algebra.js` en la lección `alg-14`: la parte 1 como
`clip: { bunny: '<id>', duration: <s>, scenes: [] }` y la parte 2 como
`more: [{ bunny: '<id>', duration: <s>, after: 5, scenes: [] }]` (tras el quinto ejercicio).

Los ejemplos resueltos en los videos no se repiten en los ejercicios de la lección.

## Parte 1 · Aritméticas (`progresiones_parte1.mp4`)

| Escena | Contenido |
|---|---|
| `S00_Portada` | Clase 5 · Parte 1 · Progresiones aritméticas |
| `S01_Sucesion` | sucesión, puesto n, término general: 2, 5, 8… → aₙ = 3n − 1, a₅₀ = 149 |
| `S02_Aritmetica` | d fija; aₙ = a₁ + (n − 1)d; 4, 9, 14… → a₁₅ = 74; d negativa; puntos en recta |
| `S03_Gauss` | 1 + … + 100 = 5.050; Sₙ = n(a₁ + aₙ)/2; 2 + 5 + … + 59 → n = 20, S = 610 |
| `S04_Medios` | 4 medios entre 3 y 18 → d = 3; k medios ⇒ k + 2 términos |
| `S05_Teatro` | 12 sillas, +3 por fila, 15 filas → a₁₅ = 54, S = 495 |
| `S06_Cierre` | repaso, «ponte a prueba» (a₁ = 5, d = 4 → a₃₀ = 121) y «¡a practicar!» |

## Parte 2 · Geométricas (`progresiones_parte2.mp4`)

| Escena | Contenido |
|---|---|
| `S10_Portada` | Clase 5 · Parte 2 · Progresiones geométricas |
| `S11_Geometrica` | r fija; aₙ = a₁·rⁿ⁻¹; 2, 6, 18… → a₈ = 4.374; r entre 0 y 1; r negativa |
| `S12_Suma` | Sₙ = a₁(rⁿ − 1)/(r − 1); 3 + 6 + … + 384 → n = 8, S = 765 |
| `S13_Infinita` | 8 + 4 + 2 + … = 16 con el rectángulo que se parte; S∞ = a₁/(1 − r) |
| `S14_Medios` | 2 medios entre 5 y 135 → r = 3: 15, 45 |
| `S15_Rumor` | 2 personas, se triplica cada hora → 1.458 a las 6 horas; gráfica |
| `S16_Cierre` | repaso, «ponte a prueba» (a₁ = 7, r = 2 → S₆ = 441) y «¡a practicar!» |

## Cómo se genera (Windows)

Con el entorno aislado `video/.venv-gl` (ver `../clase_sistemas_numericos/README.md`). Desde
esta carpeta y con `video/.venv-gl/Scripts` en el `PATH`:

```bash
python build.py                 # renderiza todo en 1080 × 1920 y arma dist/ (dos partes)
python build.py --quality=-l    # borrador rápido en 540 × 960
python build.py --skip-render   # solo vuelve a armar dist/
```

Salidas en `dist/`: `progresiones_parte1.mp4`, `progresiones_parte2.mp4` y sus `_guion.srt` / `_guion.md`.
