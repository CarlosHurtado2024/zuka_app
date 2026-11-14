# Sin escribir: los ejercicios de teclear un número pasan a ser juegos de pensar

Fecha: 2026-11-17. Pedido: cambiar los ejercicios donde el usuario tiene que escribir algo por juegos dinámicos o
ejercicios más originales y divertidos, y que toque pensar.

Había 166 ejercicios `num(...)` (tipo `input`) en todos los cursos: Álgebra 40, Trigonometría 22, Cálculo 25,
Geometría vectorial 64, Física 10, Cálculo integral 2, Álgebra lineal 3. Ahora la app no muestra ninguno.

## Dos juegos nuevos (con `roundsGame`)

| Juego | Idea | Qué se piensa |
|---|---|---|
| `arma-la-cuenta` | Fichas con los datos del problema (y algunas que sobran) y fichas de operación (+ − × ÷ ( ) ^ √). Se tocan en orden para escribir la cuenta en una pizarra y **el juego la calcula** en vivo. Vale cualquier cuenta que dé el resultado. | Qué datos sirven y cómo se combinan (plantear), no la aritmética. Sigue la regla «entender, no mecanizar»: las cuentas las hace el juego. |
| `escala-solucion` | La solución es una pared que se sube de abajo hacia arriba. En cada nivel hay dos o tres agarres con un paso posible del razonamiento; solo uno se justifica. La cuerda une la ruta hasta la bandera. | Qué paso es válido en cada momento (despejes, propiedades, orden de una composición). Las trampas son los errores típicos. |

- Nada se revela hasta comprobar. En `arma-la-cuenta` el estudiante ve el valor de su cuenta, pero no sabe si es el pedido.
- Una ficha suelta no cuenta como respuesta cuando la solución necesita una operación (a veces un dato vale lo mismo
  que el resultado).
- `escala-solucion` baraja los agarres de cada nivel (siempre igual para el mismo ejercicio).

## Cómo se reemplazan (`js/courses/sin-escribir.js`)

Los cursos conservan sus `num(...)`; al cargar, `sinEscribir(COURSES)` cambia cada uno por su juego usando la tabla
`SIN_ESCRIBIR`, con clave `lección#posición` (evaluaciones: `exam-<mundo>#posición`):

```js
'alg-12#3': C('7 * 200000 / 100000', ['1000', '100']),   // una cuenta correcta y las fichas que sobran
'alg-1#1': E(['2x = 10 + 4', '2x = 10 − 4'], ['x = 14 ÷ 2', …], ['x = 7', …]),   // un nivel por paso; el válido primero
```

Se conservan el enunciado, la explicación y la pista. La respuesta, la unidad y la tolerancia salen del `num`
original. Si alguien mueve un ejercicio y la cuenta de la ficha ya no da su respuesta, ese ejercicio se queda como
estaba (de escribir) y la prueba avisa. 135 ejercicios pasan a `arma-la-cuenta` y 31 a `escala-solucion`.

**Un ejercicio `num` nuevo necesita su entrada en la tabla** (lo exige la prueba). Mejor aún: no añadir `num`.

## Pruebas

`tests/sin-escribir.test.js`: no queda ningún `input` en la app; no sobran entradas en la tabla; el cambio conserva
enunciado, explicación y pista; la cuenta de cada ficha da la respuesta del ejercicio, usa de 2 a 8 fichas de número y
a lo sumo 21 fichas; una ficha suelta no gana; el evaluador respeta paréntesis, potencias, raíces y rechaza cuentas mal
escritas; en `escala-solucion` solo gana la ruta válida, hay de 2 a 4 niveles con 2 o 3 agarres de hasta 40 letras y el
válido cambia de lugar; un ejercicio movido no se cambia. En el navegador un robot resolvió los 166 (una vez mal y una
vez bien).

## Queda para después

- Los cursos viejos (Polinomios, Cuadráticas, Grado superior, Racionales, Exp-log, Cálculo desde límites, Física,
  Integral, Lineal) siguen teniendo opción múltiple y ejercicios sin pista.
- Los juegos de las evaluaciones (`detective-pasos` y compañía) siguen sin usarse en lecciones.
