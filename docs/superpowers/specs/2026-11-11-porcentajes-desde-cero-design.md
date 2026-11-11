# Porcentajes y descuentos desde cero (Álgebra, mundo «Mercado de las Razones»)

Pedido: un video mejor sobre porcentajes y descuentos, conectado con lo anterior (fracciones y decimales N2, axiomas
F1–F2: conmutativa, distributiva, recíproco; razones R1, proporciones R2, regla de tres R3), muy explicativo desde lo
básico, en partes, con ejercicios creativos tras cada video. Sin zoom ni 3D; sin solapamientos.

## Partes

`alg-13` (id sin cambiar) se parte en tres, al final del mundo `razones`. Los dos videos viejos de Bunny quedan
reemplazados.

| Lección | Video | Carpeta | Contenido |
|---|---|---|---|
| `alg-13` Porcentajes: qué son y cómo se calculan | C1 | `video/clase_alg_u2_c1_porcentajes` | «por ciento» = de cada 100; cuadrícula de 100 con 35 pintadas = 35/100 = 0.35; equivalencias 1/2, 1/4, 3/4, 1/5, 1/10; razón parte : todo escalada a 100 (9 de 25 con gafas = 36 %); la proporción parte/todo = p/100 resuelve las tres preguntas: 15 % de 80 (también 10 % + 5 %), qué % es 18 de 72, 30 es el 40 % de 75; más de 100 % (150 % de 40) y menos de 1 % (0.5 % de 2 000) |
| `alg-13c` Aumentos y descuentos | C2 | `…_c2_aumentos` | camisa de 60 000 con 25 % de descuento: restar o pagar el 75 % (distributiva: 60 000(1 − 0.25)); IVA 19 % de 50 000 → × 1.19 = 59 500; factores 1 ± r/100 (+8 %, −8 %, +100 %); precio sin IVA: 71 400 ÷ 1.19 = 60 000 (dividir es multiplicar por el recíproco) y el error de restar 19 %; cambio porcentual (nuevo − viejo)/viejo: 2 500 → 3 000 es +20 % y de vuelta −16.7 % |
| `alg-13d` Cambios sucesivos | C3 | `…_c3_sucesivos` | 20 % y luego 10 % ≠ 30 %: 100 000 → 80 000 → 72 000, factor 0.8 · 0.9 = 0.72, descuento único 28 %; el orden no importa (conmutativa); sube 50 % y baja 50 %: 100 → 150 → 75; tras −20 % hay que subir 25 %; crecimiento repetido 10 % tres años: 1.1³ = 1.331 (potencias), no 30 % |

## Ejercicios (juegos con pista; ningún ejemplo del video)

- `alg-13`: `pinta-personas` (nuevo), `cuadricula-cien` (42 %, 2/5, 0.06), `rueda-porcentaje`, `cruz-porcentaje`, `mezcla`, `bodegas`.
- `alg-13c`: `porcentaje-cambio` (nuevo), `estira-barra`, `tragamonedas`, `etiqueta-rebaja`, `num` precio sin IVA (476 000 → 400 000).
- `alg-13d`: `cascada`, `mejor-oferta`, `cadena-cambios`, `rebote`, `dos-etapas`.

### Juegos nuevos

- **pinta-personas**: un grupo de personitas (20, 25, 40, 8); se tocan para pintarlas hasta tener el porcentaje
  pedido. Obliga a pasar de «de cada 100» a otro total. `params = { rounds: [{ total, pct, what }] }`,
  `state = { painted: [número | null] }`.
- **porcentaje-cambio**: una cantidad pasa de A a B (dos barras); con −10, −1, +1, +10 se fija el cambio porcentual
  (de −100 a +300). Enseña que se divide entre el valor viejo y que subir y bajar no son simétricos.
  `params = { rounds: [{ from, to, unit }] }`, `state = { pcts: [número | null] }`.

## Pruebas

`tests/porcentajes-desde-cero.test.js`: grade de los dos juegos; orden del mundo (alg-12 alg-12e alg-12f alg-13 alg-13c
alg-13d); cada lección con escenas, pistas, sin tarjetas; reparto; ejemplos del video ausentes; rondas alcanzables.
Se ajustan `tests/contenido.test.js`, `tests/cola.test.js`, `tests/razones-desde-cero.test.js` y `tests/estructura.test.js`.
