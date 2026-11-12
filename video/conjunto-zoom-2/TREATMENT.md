# Tipos de conjuntos y relaciones (zoom) · tratamiento

Este es el video de la lección 2 del mundo **Pradera de Venn** (`alg-0b`, «Tipos de conjuntos y relaciones entre ellos»),
en estilo **Scale Zoom Explainer** (Lemo-Opuscar, `flat-space-explainer`). Usa el mismo motor que el video de la
lección 1 (`../conjunto-zoom`); las partes comunes están en `zoomkit.js`.

- **Formato:** vertical 1080×1920, 24 fps, 118 s, en español.
- **Sin voz grabada.** La imagen sigue el ritmo de una narración (`NARR`), que se entrega aparte: `conjunto-zoom-2.srt` con
  los tiempos y `narracion.txt` con el texto corrido. En pantalla queda una etiqueta por idea, así que el video se
  entiende también sin sonido.
- **Contenido:** *Manual de Álgebra y Trigonometría* (UdeA), §1.1: vacío, unitario, {∅}, subconjunto (con el vacío como
  subconjunto de todo), iguales, disjuntos, conjunto de partes contado por tamaños.
- **Ejemplos:** meses de 32 días, la capital de Colombia, letras y vocales, {a, 7}, AMOR y ROMA, guayaba, manzana y
  lulo frente a martillo y serrucho, y los toppings fresa, mora y coco.
  - Ninguno se repite en los ejercicios, que usan animales, notas, PERA, agua y montañas, colores, pizza, instrumentos
    y bombillos.
  - La pista del ejercicio de los bombillos remite a «contar por tamaños, como en el video»: el nivel 4 lo hace así.

## 1. Tres estructuras posibles

1. **Un catálogo:** un tipo de conjunto por tarjeta. Es plano y no tiene cambio de escala.
2. **Bolsas que se abren:** cada idea vive dentro de una bolsa de la anterior. Es claro, pero las relaciones (iguales,
   disjuntos) necesitan dos conjuntos a la vez.
3. **Hacia adentro, de lo que no tiene nada a lo que lo tiene todo:**
   - la bolsa vacía;
   - el conjunto L de las letras, con V adentro;
   - dos conjuntos que se comparan;
   - todas las combinaciones de tres toppings.

**Elegida: la 3.** Cada puerta sale del ejemplo anterior:
- la bolsa vacía que está dentro de {∅} se vuelve el gran círculo de las letras;
- la «o» lleva a AMOR;
- la manzana compartida lleva a la heladería.

## 2. Idea y arco

*Un conjunto puede no tener nada, tener uno, caber en otro, ser igual a otro o no tocarlo; y con tres cosas salen ocho.*

- **Planteamiento:** abre con unas llaves vacías que brillan solas: el vacío. Al retroceder la cámara aparecen tres bolsas.
- **Giro:** se entra en la bolsa vacía que está dentro de otra bolsa, y desde ahí se empieza a comparar conjuntos.
- **Final:** ocho vasos de helado ordenados por tamaño: 1 + 3 + 3 + 1. Luego, el resumen en la cinta.

## 3. Planos (un plano continuo, cuatro niveles)

| t (s) | Nivel | Cámara | Por qué |
|---|---|---|---|
| 0–4.4 | Llaves vacías en primer plano y título | empuje lento | Gancho: un conjunto sin nada. |
| 4.4–6.6 | Tres bolsas: vacía, {Bogotá} y {∅} | retroceso con rebote | Revelar. |
| 6.6–27.6 | Vacío, unitario y el cuidado con {∅} | empuje del 4 % | Lectura. |
| 27.6–29.8 | **Zambullida** en la bolsa de adentro de {∅} | zoom logarítmico | La bolsita se vuelve el círculo L. |
| 29.8–57.2 | L (letras) con V adentro; V ⊆ L; ∅ ⊆ L; {a, 7} no cabe | empuje | Subconjunto. |
| 57.2–59.4 | **Zambullida** en la «o» | igual | De vocales a palabras. |
| 59.4–81.6 | AMOR y ROMA se funden; frutas y herramientas aparte; dos conjuntos que se cruzan | empuje | Iguales, disjuntos y lo de en medio. |
| 81.6–83.8 | **Zambullida** en la manzana compartida | igual | |
| 83.8–108 | Toppings: 8 vasos por tamaños; 1 + 3 + 3 + 1 y 2 · 2 · 2 | abre un 6 % | Conjunto de partes. |
| 108–118 | Resumen en la cinta | quieta | Cierre. |

## 4. Sonido

- **Música:** sol mayor pentatónico, 96 bpm. Un instrumento lleva la melodía en cada nivel, como en el video 1:

  | Nivel | Instrumento |
  |---|---|
  | 1 | arpa |
  | 2 | marimba |
  | 3 | xilófono |
  | 4 | vibráfono |

- **Silencios:** casi silencio antes de {∅} y antes de que aparezca el 8.
- **Mezcla:** −14 LUFS. Si se graba la voz, la música deja sitio para ella.

## 5. Letra

- Jost, igual que en el video 1, con las etiquetas en versalitas de 42 px.
- Jost no trae ⊆, ∪, ∩ ni △: se dibujan en código.
