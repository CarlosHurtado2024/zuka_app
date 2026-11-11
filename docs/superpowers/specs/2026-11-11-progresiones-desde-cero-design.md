# Progresiones aritméticas y geométricas desde cero (Álgebra, mundo «Escalera de Sigma»)

Pedido: un video mejor sobre progresiones aritméticas y geométricas, conectado con lo anterior (naturales N1, racionales
y decimales periódicos N2, axiomas F1–F2, razones R1, proporciones R2, potencias y raíces), muy explicativo desde lo
básico, partido en partes, con ejercicios creativos tras cada video. Sin zoom ni 3D; sin solapamientos (revisor de
`alg_u1_fx.py`).

## Partes

La lección `alg-14` (id sin cambiar) se parte en cuatro, antes de `alg-15` (sumatoria):

| Lección | Video | Carpeta | Contenido |
|---|---|---|---|
| `alg-14` Sucesiones y progresiones aritméticas | P1 | `video/clase_alg_u3_p1_aritmeticas` | sucesión = lista ordenada; posición n ∈ ℕ y notación aₙ (cuadrados 1, 4, 9, 16, pares); término general y regla recursiva; aritmética: misma diferencia d (ahorro 20, 25, 30 mil; vela 30, 28, 26 cm; d = 0); revisar todos los saltos (1, 2, 4 no); término general por los «saltos» (de a₁ a aₙ hay n − 1): a₂₀ de 7, 11, 15 = 83; gráfica: puntos sobre una recta; dos datos a₃ = 10 y a₈ = 25; medios aritméticos entre 2 y 18 |
| `alg-14b` Suma de una progresión aritmética | P2 | `…_p2_suma_aritmetica` | Gauss 1 + … + 100 (fila y fila al revés); escaleras que forman un rectángulo (3, 5, 7, 9, 11 → 5 · 14 / 2 = 35); Sₙ = n(a₁ + aₙ)/2 y Sₙ = n(2a₁ + (n − 1)d)/2 (distributiva); impares: 1 + 3 + … = n² con escuadras; estadio 20 sillas + 4 por fila, 15 filas = 720 |
| `alg-14c` Progresiones geométricas | P3 | `…_p3_geometricas` | multiplicar siempre por lo mismo: cadena de mensajes 1, 3, 9, 27; razón r = cociente (R1); r fraccionaria: medicamento 800, 400, 200 mg; r negativa: 1, −2, 4, −8 (ley de signos); aₙ = a₁ rⁿ⁻¹ (potencias): a₇ de 3, 6, 12 = 192; crecer sumando vs multiplicando (recta vs curva); medios entre 2 y 162: r⁴ = 81, r = ±3 |
| `alg-14d` Suma geométrica e infinita | P4 | `…_p4_suma_geometrica` | truco de multiplicar por r y restar: 1 + 2 + … + 2⁹ = 2¹⁰ − 1; Sₙ = a₁(rⁿ − 1)/(r − 1); suma infinita con un chocolate 1/2 + 1/4 + … = 1; converge si |r| < 1: S∞ = a₁/(1 − r); 0.333… = 3/10 + 3/100 + … = 1/3 (N2); diverge: 1 + 2 + 4, 1 − 1 + 1 |

## Ejercicios (juegos con pista; sin tarjetas; ningún ejemplo del video)

- `alg-14`: `pisa-huellas` (nuevo), `escalera-aritmetica` (6 → a₁₀ = 42), `rellena-medios` aritmética (10 … 26), `num` a₃₀ de 4, 9, 14 = 149.
- `alg-14b`: `dos-escaleras` (nuevo), `parejas-gauss`, `suma-filas` (teatro 170), `num` 5 + 9 + … + 81 = 860.
- `alg-14c`: `rebota-pelota` (nuevo), `torre-producto` (bacterias), `rellena-medios` geométrica (2 … 512, r = 4), `num` a₆ de 2, 6, 18 = 486.
- `alg-14d`: `limite-serie` (9 + 3 + 1), `num` 2 + 6 + … (6 términos) = 728, `num` 0.2727… = x/11 → 3, `rebota-pelota` no.

### Juegos nuevos

- **pisa-huellas**: un caminante deja huellas numeradas en la recta; dos banderas marcan dónde cayeron dos pasos
  (p. ej. el 3.º en 13 y el 7.º en 25). Con − / + se fijan el primer paso a₁ y el salto d; las huellas se mueven en
  vivo. `params = { rounds: [{ known: [[k, v], [k, v]], a1, d }] }`, `state = { ans: [[a1, d] | null] }`.
- **dos-escaleras**: una escalera de n columnas (a₁, a₁ + d, …) y su copia volteada colgando de una tapa; se sube o baja
  la tapa (− / + o arrastre) hasta que las dos escaleras encajen en un rectángulo: altura a₁ + aₙ. Al encajar se ve
  el área n(a₁ + aₙ) y la suma, su mitad. `params = { rounds: [{ a1, d, n }] }`, `state = { hs: [altura | null] }`.
- **rebota-pelota**: una pelota cae de h₀ y cada rebote sube la fracción r del anterior; se ajusta la altura de los tres
  primeros rebotes (arrastre y − / +). `params = { rounds: [{ h0, r, rTex }], max }`, `state = { hs: [[h1, h2, h3] | null] }`.

## Pruebas

`tests/progresiones-desde-cero.test.js` (reemplaza a `tests/leccion-progresiones.test.js`): grade de los tres juegos;
orden del mundo (alg-14 alg-14b alg-14c alg-14d alg-15); cada lección con escenas, pistas, sin tarjetas ni opción
múltiple; reparto de juegos; ejemplos de los videos ausentes; rondas alcanzables.
