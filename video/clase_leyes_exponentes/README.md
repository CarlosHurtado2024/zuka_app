# Clase 9: Leyes de los exponentes, dos partes (vertical 9:16, tema Zuka)

Dos videos de unos 5–6 minutos para la lección «Leyes de los exponentes» (`alg-21b`, unidad 1 del
Manual de la UdeA, §1.4). Sin voz ni subtítulos; las leyes se deducen contando factores y los
ejemplos van resueltos con detalle, sin preguntas al espectador. Parte 1 como `clip` y parte 2 en
`more: [{ bunny, duration, after: <n>, scenes: [] }]`.

## Parte 1 · Las leyes (`leyes_exponentes_parte1.mp4`)

| Escena | Contenido |
|---|---|
| `S01_Producto` | a³ · a⁴ contando factores → aᵐ⁺ⁿ; 2³ · 2⁵ = 2⁸ (no 4⁸); (3x²)(2x⁵) |
| `S02_Cociente` | y⁷ / y³ cancelando parejas → aᵐ⁻ⁿ; 5² / 5⁵ = 5⁻³ |
| `S03_PotenciaDePotencia` | (a²)³ = a⁶; (ab)ⁿ y (a/b)ⁿ; (2x)³ vs 2x³; (x²y)⁴ |
| `S04_EjemplosParte1` | 5ⁿ⁺¹ / 5ⁿ⁻¹ = 25; 3ⁿ⁺² − 3ⁿ = 8 · 3ⁿ; 4ˣ · 8 / 2³ˣ = 2³⁻ˣ |
| `S05_CierreParte1` | repaso y puente a la parte 2 |

## Parte 2 · Negativos, simplificar y notación científica (`leyes_exponentes_parte2.mp4`)

| Escena | Contenido |
|---|---|
| `S11_Negativos` | cambio de piso; x⁻² / y⁻³; (2/5)⁻³; 3x⁻¹ vs (3x)⁻¹ |
| `S12_Simplificar` | (3x⁻²y)⁻²; (x⁻³y²)⁻⁴ / (y⁶x⁻⁴)⁻² = x⁴y⁴; 9ⁿ / 3ⁿ = 3ⁿ |
| `S13_Cientifica` | 3 × 10⁸, 1.2 × 10⁻⁷, forma estándar y un producto |
| `S14_CierreParte2` | repaso y «¡a practicar!» |

```bash
python build.py                 # HD, dos partes en dist/
python build.py --quality=-l    # borrador
```
