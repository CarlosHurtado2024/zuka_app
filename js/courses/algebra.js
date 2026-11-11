// Curso de Álgebra — sigue el orden de las clases 1 a 19 del cronograma 2026-2 de Álgebra y Trigonometría
// (UdeA) con el contenido del Manual de Álgebra y Trigonometría (Instituto de Matemáticas, UdeA, 2024).
// Desigualdades, recta y funciones viven en el curso de Cálculo (js/courses/calculo.js), como en su cronograma.
// Spec: docs/superpowers/specs/2026-11-07-cronograma-algebra-calculo-design.md

const COURSE_ALGEBRA = {
  id: 'algebra', level: 'Fundamentos', name: 'Álgebra', icon: 'x²', color: '#8b7bff',
  tagline: 'El lenguaje de las matemáticas: números, ecuaciones y funciones para describir el mundo.',
  units: [
    {
      // Unidad 0 (specs 2026-11-09-algebra-conjuntos y 2026-11-11-conjuntos-desde-cero): conjuntos desde cero,
      // tres lecciones, cada una con su video y luego sus ejercicios; sin números ni desigualdades.
      world: 'conjuntos', title: 'Conjuntos',
      lessons: [
        {
          id: 'alg-0a', title: '¿Qué es un conjunto? Notación y pertenencia',
          // Video V1 (video/clase_alg_u0_v1_que_es) en Bunny; las escenas son el respaldo.
          // Spec 2026-11-11-conjuntos-desde-cero: sin números ni desigualdades; ejemplos de la vida diaria.
          clip: { bunny: '4b5c2610-9e65-4556-8e58-875f5927efbd', duration: 237, scenes: [
            sc(6, 'Un **conjunto** es una colección de objetos **bien definida**: cualquiera puede decidir, sin dudar, si un objeto está o no está. Los objetos se llaman **elementos**.', { title: '$S = \\{\\text{rojo},\\ \\text{amarillo},\\ \\text{verde}\\}$', steps: ['Nombre en mayúscula, elementos entre llaves y separados por comas'] }),
            sc(6, '$\\in$ se lee «pertenece a» y $\\notin$ «no pertenece a».', { title: '$\\text{rojo} \\in S \\qquad \\text{azul} \\notin S$' }),
            sc(6, 'Por **extensión** se escriben todos los elementos; por **comprensión**, la condición que cumplen. «:» se lee «tal que».', { title: '$V = \\{a, e, i, o, u\\} = \\{x : x \\text{ es una vocal}\\}$' }),
            sc(6, 'El orden no importa y no se repite ningún elemento. El **cardinal** $n(A)$ cuenta los elementos distintos.', { steps: ['Letras de PAPAYA: $\\{P, A, Y\\}$', '$n = 3$'] }),
          ] },
          ex: [
            play('arma-notacion', 'Toca las fichas en orden para escribir cada conjunto por **extensión**', {
              rounds: [
                { prompt: 'B: los colores de la bandera de Colombia', name: 'B', members: ['amarillo', 'azul', 'rojo'], chips: ['B', '=', '{', '}', ',', '(', ')', 'amarillo', 'azul', 'rojo', 'verde'] },
                { prompt: 'P: los puntos cardinales', name: 'P', members: ['norte', 'sur', 'este', 'oeste'], chips: ['P', '=', '{', '}', ',', '[', ']', 'norte', 'sur', 'este', 'oeste', 'arriba'] },
                { prompt: 'G: las vocales de la palabra GATO', name: 'G', members: ['a', 'o'], chips: ['G', '=', '{', '}', ',', '(', ')', 'a', 'o', 'e', 'g', 't'] },
              ],
            }, 'Un conjunto por extensión se escribe así: su nombre en mayúscula, el signo $=$, una llave que abre, los elementos separados por comas y una llave que cierra: $B = \\{\\text{amarillo}, \\text{azul}, \\text{rojo}\\}$. Los paréntesis y los corchetes no sirven para conjuntos. El orden de los elementos no importa, pero ninguno se repite: en GATO las vocales son solo $a$ y $o$.',
              { hint: 'Empieza por el nombre del conjunto y el signo =. Luego abre la llave, pon un elemento, una coma, otro elemento… y cierra la llave. Cuidado con las fichas que no pertenecen.' }),
            play('cumple-notacion', 'Mete o saca cada ficha de la bolsa para que **todas** las frases sean ciertas', {
              rounds: [
                { set: 'M', tokens: ['perro', 'gato', 'pez', 'ballena', 'rana', 'loro'], inside: [true, true, false, true, false, false] },
                { set: 'R', tokens: ['fresa', 'cereza', 'limón', 'banano'], inside: [true, true, false, false] },
              ],
            }, '$\\in$ dice que el elemento está dentro del conjunto y $\\notin$ que está afuera. Con las frases de la primera ronda, $M = \\{\\text{perro}, \\text{gato}, \\text{ballena}\\}$ (los mamíferos); en la segunda, $R = \\{\\text{fresa}, \\text{cereza}\\}$.',
              { hint: 'Lee cada frase en voz alta: «∈» es «pertenece a» (va adentro de la bolsa) y «∉» es «no pertenece a» (se queda afuera). Al lado de cada frase aparece un ✓ cuando ya se cumple.' }),
            play('atrapa-elementos', 'Atrapa los elementos que cumplen la condición y escribe el conjunto por **extensión**', {
              rounds: [
                { name: 'E', rule: 'x : x es una estación del año', pool: ['primavera', 'enero', 'verano', 'lluvia', 'otoño', 'sol', 'invierno', 'julio'], members: ['primavera', 'verano', 'otoño', 'invierno'] },
                { name: 'J', rule: 'x : x es un mes que empieza por J', pool: ['enero', 'junio', 'jueves', 'julio', 'agosto', 'febrero'], members: ['junio', 'julio'] },
                { name: 'O', rule: 'x : x es un océano', pool: ['Pacífico', 'Caribe', 'Atlántico', 'Índico', 'Amazonas', 'Ártico', 'Antártico', 'Andes'], members: ['Pacífico', 'Atlántico', 'Índico', 'Ártico', 'Antártico'] },
              ],
            }, 'Por comprensión se da la condición; por extensión se listan los elementos que la cumplen. $E$ tiene las cuatro estaciones (enero y julio son meses). $J = \\{\\text{junio}, \\text{julio}\\}$: jueves empieza por J pero es un día, no un mes. Y los océanos son cinco; el Caribe es un mar y el Amazonas, un río.',
              { hint: 'Prueba cada ficha en la condición, leyéndola completa: no basta con que «suene» parecido. Por ejemplo, ¿jueves es un mes?' }),
            play('tacha-repetidos', 'Tacha las letras que sobran para que quede el conjunto de letras de cada palabra', {
              rounds: [{ word: 'BANANA', name: 'L' }, { word: 'COCODRILO', name: 'C' }, { word: 'PERRERA', name: 'P' }],
            }, 'En un conjunto cada elemento se escribe una sola vez, así que las letras repetidas sobran: BANANA tiene 6 letras, pero su conjunto de letras es $\\{B, A, N\\}$ y $n = 3$. COCODRILO da $\\{C, O, D, R, I, L\\}$ y PERRERA da $\\{P, E, R, A\\}$.',
              { hint: 'Deja una sola copia de cada letra y tacha las demás. Las letras que todavía están repetidas se ven en amarillo.' }),
            num('¿Cuántos elementos tiene el conjunto de las letras de la palabra CARACOL?', 5,
              'Las letras distintas de CARACOL son $C, A, R, O, L$: el conjunto es $\\{C, A, R, O, L\\}$ y su cardinal es $5$, aunque la palabra tenga 7 letras.',
              { hint: 'Escribe las letras una por una y no repitas las que ya escribiste. Luego cuenta.' }),
          ],
        },
        {
          id: 'alg-0b', title: 'Tipos de conjuntos y relaciones entre ellos',
          // Video V2 (video/clase_alg_u0_v2_tipos) en Bunny; las escenas son el respaldo.
          clip: { bunny: 'f56e026e-8127-40d7-b344-14eb34e91fad', duration: 226, scenes: [
            sc(6, 'El conjunto **vacío** no tiene elementos: $\\varnothing = \\{\\ \\}$. Un conjunto **unitario** tiene uno solo.', { steps: ['$\\{x : x \\text{ es la capital de Colombia}\\} = \\{\\text{Bogotá}\\}$', '$\\{\\varnothing\\}$ no es vacío: tiene un elemento'] }),
            sc(6, '$B \\subseteq A$ (subconjunto) cuando todo elemento de $B$ está en $A$. El vacío es subconjunto de todo conjunto.', { title: '$\\{a, e, i, o, u\\} \\subseteq \\{\\text{letras}\\}$' }),
            sc(6, 'Dos conjuntos son **iguales** si tienen los mismos elementos, y **disjuntos** si no comparten ninguno.', { steps: ['Letras de AMOR = letras de ROMA', 'frutas y herramientas: disjuntos'] }),
            sc(6, 'Con los toppings fresa, mora y coco hay 8 combinaciones posibles, desde ninguno hasta los tres: el **conjunto de partes**.', { title: '$P(\\{f, m, c\\})$' }),
          ] },
          ex: [
            play('arma-conjunto', 'Arma en las llaves un conjunto que cumpla lo que pide cada ronda', {
              pool: ['perro', 'gato', 'loro', 'pez', 'vaca', 'oveja'],
              sets: { A: ['perro', 'gato', 'loro'], B: ['vaca', 'oveja'] },
              rounds: [
                { text: 'Un conjunto vacío (usa «∅ Vaciar»)', rule: { size: 0 }, example: [] },
                { text: 'Un conjunto unitario que sea subconjunto de A', rule: { size: 1, subsetOf: ['perro', 'gato', 'loro'] }, example: ['gato'] },
                { text: 'Un conjunto igual a B', rule: { equal: ['vaca', 'oveja'] }, example: ['oveja', 'vaca'] },
                { text: 'Un conjunto disjunto de A, con al menos dos elementos', rule: { disjointFrom: ['perro', 'gato', 'loro'], minSize: 2 }, example: ['pez', 'vaca'] },
                { text: 'Un conjunto con cuatro elementos del que A sea subconjunto', rule: { contains: ['perro', 'gato', 'loro'], size: 4 }, example: ['perro', 'gato', 'loro', 'pez'] },
              ],
            }, 'El vacío no lleva nada: $\\varnothing$. Un unitario tiene un solo elemento, y si es subconjunto de $A$ ese elemento debe estar en $A$ (sirven $\\{\\text{perro}\\}$, $\\{\\text{gato}\\}$ o $\\{\\text{loro}\\}$). Igual a $B$ es tener justo vaca y oveja, en cualquier orden. Disjunto de $A$ es no compartir ningún elemento con $A$. Y para que $A$ sea subconjunto de tu conjunto, este debe tener los tres elementos de $A$, y uno más.',
              { hint: 'Lee la condición palabra por palabra: «vacío» es sin elementos (el botón «∅ Vaciar» deja las llaves sin nada), «unitario» es uno solo, «subconjunto de A» es usar solo elementos de A, «disjunto» es no compartir ninguno. Puede haber varias respuestas buenas.' }),
            play('mueve-circulos', 'Arrastra el círculo B para dibujar cómo se relacionan los dos conjuntos', {
              rounds: [
                { A: '{do, re, mi, fa, sol, la, si}', B: '{do, mi, sol}', rB: 0.5, rel: 'sub' },
                { A: '{x : x es una vocal de PERA}', B: '{e, a}', rB: 1, rel: 'equal' },
                { A: '{mar, río, lago}', B: '{montaña, volcán}', rB: 0.6, rel: 'disjoint' },
                { A: '{rojo, azul, amarillo}', B: '{azul, verde}', rB: 0.6, rel: 'overlap' },
              ],
            }, 'Las tres notas de $B$ están en $A$: $B \\subseteq A$ y su círculo va adentro. Las vocales de PERA son justo $e$ y $a$: $A = B$, los círculos se enciman. Agua y montañas no comparten nada: son **disjuntos**. Y los colores comparten solo el azul: los círculos se cruzan.',
              { hint: 'Busca elementos que estén en los dos conjuntos. Si todos los de B están en A, B va adentro; si no comparten ninguno, sepáralos; si comparten algunos, crúzalos; si tienen exactamente los mismos, enciméralos.' }),
            play('fabrica-subconjuntos', 'Llena las cajas con **todos** los subconjuntos, sin repetir ninguno', {
              rounds: [{ elements: ['🍕', '🍔'] }, { elements: ['🎸', '🥁', '🎹'] }],
            }, 'Cada elemento entra o no entra en la caja. Con dos hay 4 subconjuntos: $\\varnothing$, uno solo de cada uno y los dos juntos. Con tres instrumentos hay 8: la caja vacía, tres de uno, tres de dos y la banda completa. El vacío y el conjunto completo también cuentan.',
              { hint: 'Organízate por tamaños: primero la caja vacía, luego las de un elemento, luego las de dos… y al final todos juntos. Si una caja se pone roja, está repetida.' }),
            num('En un pasillo hay 4 bombillos, y cada uno puede estar prendido o apagado. ¿De cuántas formas distintas se puede ver el pasillo, contando todos apagados?', 16,
              'Cada forma es el conjunto de bombillos prendidos: un subconjunto de los 4. Por tamaños: ninguno prendido (1), uno (4), dos (6), tres (4) y los cuatro (1): $1 + 4 + 6 + 4 + 1 = 16$. Es lo mismo que duplicar con cada bombillo nuevo: $2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$.',
              { hint: 'Cuenta por tamaños, como en el video: ¿cuántas formas hay con ningún bombillo prendido?, ¿con uno?, ¿con dos?… Y suma todo.' }),
          ],
        },
        {
          id: 'alg-0c', title: 'Operaciones entre conjuntos',
          // Video V3 (video/clase_alg_u0_v3_operaciones) en Bunny; las escenas son el respaldo.
          clip: { bunny: '06ed782c-e7dd-49e7-abba-fcfb38ee41f6', duration: 181, scenes: [
            sc(6, 'En un **diagrama de Venn** cada conjunto es un círculo dentro del universo $U$; lo común va donde se cruzan.', { steps: ['$A$: juegan fútbol · $B$: tocan un instrumento'] }),
            sc(6, '**Unión** («o»): está en $A$ o en $B$. **Intersección** («y»): está en los dos.', { title: '$A \\cup B \\qquad A \\cap B$' }),
            sc(6, '**Diferencia** («pero no»), **complemento** («no está») y **diferencia simétrica** («en uno solo»).', { title: '$A - B \\qquad A^c \\qquad A \\,\\triangle\\, B$' }),
            sc(6, 'Para contar la unión, lo común se cuenta una sola vez.', { title: '$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$' }),
          ] },
          ex: [
            play('reparte-venn', 'Pon cada elemento de $U$ en su zona del diagrama de Venn', {
              rounds: [
                { U: ['Luis', 'Sara', 'Tomás', 'Vera', 'Iván', 'Rosa', 'Nico'], A: ['Luis', 'Sara', 'Tomás', 'Vera'], B: ['Sara', 'Vera', 'Iván'] },
                { U: ['mango', 'uva', 'pera', 'kiwi', 'limón', 'coco'], A: ['mango', 'uva', 'kiwi'], B: ['kiwi', 'limón'] },
              ],
            }, 'Lo que está en los dos conjuntos va en el centro ($A \\cap B$): Sara y Vera, y el kiwi. Lo que está en uno solo va en su luna, y lo que no está en ninguno queda fuera de los círculos, pero dentro de $U$: Rosa y Nico, y la pera y el coco.',
              { hint: 'Empieza por los elementos que aparecen en las dos listas: van donde se cruzan los círculos. Después reparte los demás, y los que no estén en ninguna lista déjalos afuera.' }),
            play('atrapa-elementos', 'Escribe el resultado de cada operación tocando sus elementos', {
              rounds: [
                { expr: 'A ∪ B', given: ['A = {rojo, azul, verde, negro}', 'B = {verde, blanco, negro}'], pool: ['rojo', 'azul', 'verde', 'negro', 'blanco', 'gris'], members: ['rojo', 'azul', 'verde', 'negro', 'blanco'] },
                { expr: 'A ∩ B', given: ['A = {rojo, azul, verde, negro}', 'B = {verde, blanco, negro}'], pool: ['rojo', 'azul', 'verde', 'negro', 'blanco', 'gris'], members: ['verde', 'negro'] },
                { expr: 'A − B', given: ['A = {rojo, azul, verde, negro}', 'B = {verde, blanco, negro}'], pool: ['rojo', 'azul', 'verde', 'negro', 'blanco', 'gris'], members: ['rojo', 'azul'] },
                { expr: 'Bᶜ', given: ['U = {rojo, azul, verde, negro, blanco, gris}', 'B = {verde, blanco, negro}'], pool: ['rojo', 'azul', 'verde', 'negro', 'blanco', 'gris'], members: ['rojo', 'azul', 'gris'] },
              ],
            }, 'La unión junta las dos listas sin repetir: $\\{\\text{rojo}, \\text{azul}, \\text{verde}, \\text{negro}, \\text{blanco}\\}$. La intersección deja lo común: verde y negro. $A - B$ quita de $A$ lo que también está en $B$: rojo y azul. Y el complemento de $B$ es lo del universo que no está en $B$: rojo, azul y gris.',
              { hint: 'Traduce el símbolo a palabras: ∪ es «está en A o en B», ∩ es «está en los dos», − es «está en A pero no en B» y ᶜ es «no está». Revisa ficha por ficha.' }),
            play('pinta-venn', 'Pinta las zonas de cada operación', {
              rounds: [
                { text: 'B − A', n: 2, f: (a, b) => b && !a },
                { text: '(A ∪ B)ᶜ', n: 2, f: (a, b) => !(a || b) },
                { text: 'A △ B', n: 2, f: (a, b) => a !== b },
                { text: 'Bᶜ', n: 2, f: (a, b) => !b },
              ],
            }, '$B - A$ es solo la luna de $B$. $(A \\cup B)^c$ es lo de afuera de los dos círculos. $A \\,\\triangle\\, B$ son las dos lunas (lo que está en uno solo). Y $B^c$ es todo lo que no está en $B$: la luna de $A$ y lo de afuera.',
              { hint: 'Piensa en cada zona por separado y pregúntate: ¿esta zona está en A?, ¿está en B? Luego mira si cumple la operación.' }),
            play('pinta-venn', 'Ahora con tres conjuntos: pinta las zonas de cada operación', {
              rounds: [
                { text: 'A ∩ B ∩ C', n: 3, f: (a, b, c) => a && b && c },
                { text: 'A ∩ (B ∪ C)', n: 3, f: (a, b, c) => a && (b || c) },
                { text: 'A − (B ∪ C)', n: 3, f: (a, b, c) => a && !b && !c },
                { text: '(A ∩ B) ∪ C', n: 3, f: (a, b, c) => (a && b) || c },
              ],
            }, '$A \\cap B \\cap C$ es la zona del centro, común a los tres. $A \\cap (B \\cup C)$ es lo de $A$ que también toca a $B$ o a $C$. $A - (B \\cup C)$ es la parte de $A$ que no toca a nadie. Y $(A \\cap B) \\cup C$ es todo el círculo $C$ más lo común de $A$ y $B$.',
              { hint: 'Resuelve primero lo de los paréntesis y piensa qué zonas lo cumplen; después aplica la operación de afuera.' }),
            play('encuesta-venn', 'Reparte a las personas de la encuesta en las zonas del diagrama', {
              rounds: [
                { text: 'En un grupo de 30 amigos, 18 tienen perro, 12 tienen gato y 5 tienen los dos.', labels: ['perro', 'gato'], total: 30, a: 18, b: 12, both: 5 },
                { text: 'En un curso de 40 estudiantes, 22 practican música, 18 hacen deporte y 7 hacen las dos cosas.', labels: ['música', 'deporte'], total: 40, a: 22, b: 18, both: 7 },
              ],
            }, 'Se empieza por el centro: los que están en los dos. Solo perro: $18 - 5 = 13$; solo gato: $12 - 5 = 7$; así van $13 + 5 + 7 = 25$ y quedan $30 - 25 = 5$ sin ninguna mascota. En el curso: 15 solo música, 7 las dos, 11 solo deporte y 7 ninguna.',
              { hint: 'Llena primero la zona del centro. Después, a cada grupo réstale esa cantidad para saber cuántos están solo en él. Lo que falte para el total no está en ninguno.' }),
          ],
        },
      ],
    },
    {
      world: 'numeros', title: 'Sistemas numéricos, razones y proporciones',
      lessons: [
        {
          id: 'alg-11', title: 'Sistemas numéricos y números reales',
          // Un solo video en Bunny Stream (A1, video/clase_alg_u1_*). Libro UdeA §1.1.
          // Las escenas quedan de respaldo si el video no carga. Cada ejercicio trae una pista (`hint`).
          clip: { bunny: '3a8d04bc-5ae8-43e7-af64-d8af25eb2078', duration: 259, scenes: [
            sc(6, 'Los números se fueron ampliando para resolver nuevos problemas: contar, restar, repartir, medir.', { title: '$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$', steps: ['$\\mathbb{N} = \\{1, 2, 3, \\dots\\}$: contar', '$\\mathbb{Z}$: los enteros, con negativos', '$\\mathbb{Q} = \\left\\{\\tfrac{m}{n} : n \\neq 0\\right\\}$: fracciones', '$\\mathbb{I}$: irracionales como $\\sqrt2,\\ \\pi,\\ e$'] }),
            sc(5, 'Todo decimal que **termina o se repite** es racional: viene de una fracción.', { steps: ['$\\tfrac94 = 2.25$', '$\\tfrac{177}{55} = 3.2\\overline{18}$'] }),
            sc(5, 'Los reales llenan la **recta numérica**: cada punto tiene su número y cada número su punto.', { steps: ['$-2.7 < \\sqrt2 < e < \\pi < \\tfrac{24}{5}$', '$\\sqrt2 \\approx 1.41,\\; e \\approx 2.72,\\; \\pi \\approx 3.14$'] }),
            sc(5, 'Un decimal periódico se vuelve fracción: multiplica por 10, 100… según el período, y resta.', { steps: ['$x = 0.\\overline{36}$', '$100x - x = 36$', '$x = \\tfrac{36}{99} = \\tfrac{4}{11}$'] }),
          ] },
          // Video de ejemplos resueltos (E1, video/clase_alg_u1_ej_*): justo después del de conceptos.
          more: [{ bunny: '3848a920-6d9b-433b-9e8d-8d5dc3bd843f', duration: 238, scenes: [] }],
          ex: [
            // --- Parte 1: naturales, enteros y racionales (todo con juegos) ---
            play('pasaporte-numeros', 'Sella el pasaporte de cada número con **todas** las familias donde puede entrar', {
              sets: ['N', 'Z', 'Q'],
              numbers: [
                { label: '9', in: ['N', 'Z', 'Q'] }, { label: '−4', in: ['Z', 'Q'] }, { label: '0', in: ['Z', 'Q'] },
                { label: '3/5', in: ['Q'] }, { label: '−1.5', in: ['Q'] }, { label: '12/4', in: ['N', 'Z', 'Q'] },
              ],
            }, 'Las familias están anidadas, $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q}$: quien entra a ℕ entra también a ℤ y a ℚ. $9$ y $\\tfrac{12}{4} = 3$ llevan los tres sellos; $-4$ y $0$ son enteros (y racionales), pero no naturales; $\\tfrac35$ y $-1.5 = -\\tfrac32$ solo son racionales.',
              { hint: 'Un número puede llevar varios sellos. Pregunta en orden: ¿sirve para contar (ℕ)? ¿es un número sin partes, aunque sea negativo o el 0 (ℤ)? ¿se puede escribir como fracción (ℚ)? Simplifica primero las fracciones que parecen raras.' }),
            play('ascensor', 'Lleva el ascensor al piso donde termina cada viaje', {
              min: -5, max: 6,
              rounds: [
                { start: 2, move: -6, text: 'Estás en el piso 2 y bajas 6 pisos' },
                { start: -3, move: 3, text: 'Estás en el sótano 3 y subes 3 pisos' },
                { start: -1, move: -4, text: 'Estás en el sótano 1 y bajas 4 pisos más' },
              ],
            }, 'Subir es sumar y bajar es restar: $2 - 6 = -4$ (pasas por la calle y llegas al sótano 4), $-3 + 3 = 0$ (un número y su opuesto suman cero: vuelves a la calle) y $-1 - 4 = -5$.',
              { hint: 'Cuenta piso por piso desde la banderita. La calle es el 0: al bajar de ella entras a los sótanos, que llevan signo menos. Subir desde un sótano te acerca a la calle.' }),
            play('fuga-de-familia', 'Mete dos fichas a la máquina para que el resultado **se escape** de su familia', {
              rounds: [
                { set: 'N', op: '−', tiles: [{ label: '6', r: 6, k: 0 }, { label: '2', r: 2, k: 0 }, { label: '11', r: 11, k: 0 }, { label: '9', r: 9, k: 0 }] },
                { set: 'Z', op: '÷', tiles: [{ label: '12', r: 12, k: 0 }, { label: '−4', r: -4, k: 0 }, { label: '5', r: 5, k: 0 }, { label: '−6', r: -6, k: 0 }] },
                { set: 'I', op: '+', tiles: [{ label: '√2', r: 0, k: 1 }, { label: '2√2', r: 0, k: 2 }, { label: '5 − √2', r: 5, k: -1 }, { label: '1 + √2', r: 1, k: 1 }] },
                { set: 'I', op: '×', tiles: [{ label: '√2', r: 0, k: 1 }, { label: '1 + √2', r: 1, k: 1 }, { label: '3√2', r: 0, k: 3 }, { label: '2 + √2', r: 2, k: 1 }] },
              ],
            }, 'Cada familia se queda corta para alguna operación, y por eso se inventó la siguiente: $2 - 11 = -9$ no es natural (nacen los enteros), $5 \\div 12 = \\tfrac{5}{12}$ no es entero (nacen los racionales). Y los irracionales tampoco se cierran: $\\sqrt2 + (5 - \\sqrt2) = 5$ y $\\sqrt2 \\cdot 3\\sqrt2 = 6$ ya son racionales.',
              { hint: 'Busca la operación que la familia «no aguanta». Con naturales, resta un número más grande; con enteros, divide entre uno que no quepa exacto. Con raíces, junta fichas cuyas raíces se cancelen o se multipliquen por sí mismas: $\\sqrt2 \\cdot \\sqrt2 = 2$.' }),
            play('pizzeria', 'Sirve cada pedido: corta la pizza y marca las porciones que pide', {
              maxSlices: 12,
              orders: [
                { label: '0.6', num: 3, den: 5 },
                { label: '0.666…', num: 2, den: 3 },
                { label: '25 %', num: 1, den: 4 },
                { label: 'tres octavos', num: 3, den: 8 },
              ],
            }, 'La misma cantidad se puede escribir como fracción, decimal, porcentaje o con palabras: $0.6 = \\tfrac35 = \\tfrac{6}{10}$, $0.\\overline{6} = \\tfrac23 = \\tfrac{4}{6}$, $25\\,\\% = \\tfrac14 = \\tfrac{3}{12}$ y tres octavos es $\\tfrac38$. Cortar en más porciones no cambia cuánto es: son fracciones **equivalentes**.',
              { hint: 'Pasa cada pedido a fracción: 0.6 son seis décimas, un porcentaje es «de cada 100» y las palabras ya dicen la fracción. Corta la pizza en tantas porciones como diga el denominador (o en un múltiplo) y marca las del numerador.' }),
            play('candado-fraccion', 'Gira las ruedas hasta que la fracción abra el candado', {
              rounds: [
                { dec: '0.35', num: 7, den: 20 }, { dec: '0.555…', num: 5, den: 9 }, { dec: '0.12', num: 3, den: 25 },
                { dec: '1.333…', num: 4, den: 3 }, { dec: '2.625', num: 21, den: 8 },
              ],
            }, 'Un decimal que termina se escribe sobre 10, 100, 1000 y se simplifica: $0.35 = \\tfrac{35}{100} = \\tfrac{7}{20}$, $0.12 = \\tfrac{12}{100} = \\tfrac{3}{25}$ y $2.625 = \\tfrac{2625}{1000} = \\tfrac{21}{8}$. Una cifra que se repite para siempre va sobre 9: $0.\\overline{5} = \\tfrac59$ y $1.\\overline{3} = 1 + \\tfrac39 = \\tfrac43$. Cualquier fracción equivalente también abre.',
              { hint: 'Si el decimal termina, escríbelo sobre 10, 100 o 1000 según sus cifras y simplifica. Si una cifra se repite sin fin, esa cifra va sobre 9, y si hay parte entera se suma aparte. El visor te muestra el decimal de lo que armas.' }),
            play('pon-la-rayita', 'Pon la rayita sobre el bloque que se repite para siempre', {
              rounds: [{ num: 5, den: 11 }, { num: 1, den: 6 }, { num: 23, den: 12 }, { num: 3, den: 7 }],
            }, 'La rayita cubre solo el bloque que se repite, desde donde empieza a repetirse: $\\tfrac{5}{11} = 0.\\overline{45}$, $\\tfrac16 = 0.1\\overline{6}$, $\\tfrac{23}{12} = 1.91\\overline{6}$ y $\\tfrac37 = 0.\\overline{428571}$. Los residuos lo delatan: cuando un residuo vuelve a salir, las cifras vuelven a salir en el mismo orden.',
              { hint: 'Toca una cifra y mira su residuo debajo: las cifras con el mismo residuo se iluminan. Donde un residuo aparece por segunda vez, ahí empieza a repetirse todo. Las cifras de antes quedan sin rayita.' }),
            // --- Parte 2: irracionales, reales y decimales periódicos ---
            play('acorrala-raiz', 'Acorrala la raíz: cada vez en un tramo más pequeño', {
              rounds: [{ n: 5 }, { n: 10 }], levels: 3,
            }, 'Como $2.2^2 = 4.84 < 5 < 5.29 = 2.3^2$, la raíz de 5 está entre $2.2$ y $2.3$; acercándose más, $2.236 < \\sqrt5 < 2.237$, y lo mismo $3.162 < \\sqrt{10} < 3.163$. Puedes seguir para siempre: las cifras de una raíz no exacta nunca terminan ni se repiten. Por eso es **irracional**.',
              { hint: 'Fíjate en los colores: azul si el número al cuadrado da menos que el de adentro de la raíz, coral si da más. La raíz está justo donde el azul se vuelve coral: toca ese tramo y la lupa lo abre en la siguiente línea.' }),
            play('compas-raiz', 'Elige los lados del rectángulo para que el compás caiga en la banderita', {
              rounds: [{ n: 5 }, { n: 13 }, { n: 8 }, { n: 17 }], max: 4,
            }, 'La diagonal de un rectángulo de lados $a$ y $b$ mide $\\sqrt{a^2 + b^2}$ (Pitágoras), y el compás la acuesta sobre la recta sin cambiar su largo: $1^2 + 2^2 = 5$, $2^2 + 3^2 = 13$, $2^2 + 2^2 = 8$ y $1^2 + 4^2 = 17$. Así se ubica un irracional **exacto** en la recta, aunque su decimal nunca termine.',
              { hint: 'La diagonal al cuadrado es $a^2 + b^2$. Busca dos cuadrados (1, 4, 9, 16) que sumen el número de adentro de la raíz.' }),
            play('cajas-numericas', 'Arrastra cada número a la caja **más pequeña** donde vive', {
              cards: [
                { label: '12', tex: '12', set: 'N' }, { label: '−3', tex: '-3', set: 'Z' }, { label: '0', tex: '0', set: 'Z' },
                { label: '2/5', tex: '\\tfrac25', set: 'Q' }, { label: '0.444…', tex: '0.\\overline{4}', set: 'Q' }, { label: '√49', tex: '\\sqrt{49}', set: 'N' },
                { label: '√5', tex: '\\sqrt5', set: 'I' }, { label: 'e', tex: 'e', set: 'I' }, { label: '−8/2', tex: '-\\tfrac82', set: 'Z' },
              ],
            }, 'Cada familia vive dentro de la siguiente: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$, y la caja más pequeña es la que mejor describe al número. $\\sqrt{49} = 7$ y $-\\tfrac82 = -4$ se simplifican antes de decidir; $0.\\overline{4} = \\tfrac49$ es una fracción disfrazada; $\\sqrt5$ y el número $e \\approx 2.718$ no son fracciones. Una caja más grande (naranja) no está mal, pero no es la más pequeña.',
              { hint: 'Primero simplifica lo que se pueda: raíces exactas y fracciones que dan un entero. Luego prueba de la caja más pequeña a la más grande: ℕ, ℤ, ℚ. Si no se puede escribir como fracción, va en 𝕀.' }),
            play('lupa-densidad', 'Acerca la lupa y suelta un punto **entre** las dos banderitas', {
              rounds: [
                { a: { label: '√5', value: Math.sqrt(5) }, b: { label: '2.24', value: 2.24 }, view: [2, 3] },
                { a: { label: '0.66', value: 0.66 }, b: { label: '2/3', value: 2 / 3 }, view: [0, 1] },
                { a: { label: 'π', value: Math.PI }, b: { label: '22/7', value: 22 / 7 }, view: [3, 4] },
              ],
            }, 'De lejos parecen el mismo punto, pero son distintos y entre ellos cabe otro: $\\sqrt5 = 2.2360\\ldots < 2.238 < 2.24$, $0.66 < 0.663 < 0.\\overline{6}$ y $\\pi = 3.14159\\ldots < 3.142 < 3.142857\\ldots = \\tfrac{22}{7}$. Por eso $\\tfrac{22}{7}$ no es $\\pi$: solo se le parece. Entre dos reales distintos siempre hay otro (por ejemplo, su promedio), así que la recta no tiene huecos.',
              { hint: 'Escribe los dos números con varios decimales y compáralos cifra por cifra: la primera cifra en que se diferencian te dice dónde abrir la lupa. Acerca hasta que las banderitas se separen.' }),
            play('ubica-en-recta', 'Suelta cada número en su lugar de la recta', {
              min: -3, max: 4, tol: 0.15,
              points: [
                { label: '−5/2', tex: '-\\tfrac52', value: -2.5 }, { label: '1/3', tex: '\\tfrac13', value: 0.3333 },
                { label: '√6', tex: '\\sqrt6', value: 2.4495 }, { label: '7/2', tex: '\\tfrac72', value: 3.5 }, { label: '−0.5', tex: '-0.5', value: -0.5 },
              ],
            }, 'Primero conviértelos: $-\\tfrac52 = -2.5$, $\\tfrac13 \\approx 0.33$, $\\sqrt6 \\approx 2.45$ (porque $2.45^2 \\approx 6$), $\\tfrac72 = 3.5$ y $-0.5$ está a medio paso del cero, a la izquierda.',
              { hint: 'Pasa cada número a decimal antes de soltarlo; mientras arrastras, la ficha te dice el valor donde caería. Para una raíz, busca qué decimal multiplicado por sí mismo se acerca al número de adentro.' }),
            play('ordena-terminos', 'Ordena los pasos para escribir $0.\\overline{45}$ como fracción', { tex: 'x = 0.\\overline{45}', chips: ['100x = 45.4545…', '100x − x = 45', '99x = 45', 'x = 45/99 = 5/11', '10x = 4.5454…', 'x = 45/100'], order: [0, 1, 2, 3], sep: '⇒' },
              'El período tiene dos cifras, así que se multiplica por $100$: $100x = 45.\\overline{45}$. Al restar $x$ desaparece la cola: $99x = 45$ y $x = \\tfrac{45}{99} = \\tfrac{5}{11}$. Multiplicar por $10$ no alinea el período, y $\\tfrac{45}{100}$ sería $0.45$ sin la rayita.',
              { hint: 'Cuenta cuántas cifras tiene el bloque que se repite: si es una, multiplica por 10; si son dos, por 100. Luego resta $x$ para que la cola infinita desaparezca y despeja.' }),
          ],
        },
        {
          id: 'alg-12b', title: 'Axiomas de campo y orden',
          // Clase 7 en Bunny Stream (video/clase_axiomas). Las escenas quedan de respaldo si el video no carga. Libro UdeA §1.2–1.3.
          clip: { bunny: '1992ff97-e3e7-438e-b9c4-8d79b91865a8', duration: 383, scenes: [
            sc(6, 'Los **axiomas de campo** son las reglas de la suma y el producto en $\\mathbb{R}$: conmutativa, asociativa, neutros, inversos y distributiva.', { steps: ['$a + b = b + a \\qquad ab = ba$', '$a + 0 = a \\qquad a \\cdot 1 = a$', '$a(b + c) = ab + ac$'] }),
            sc(6, 'De ellos salen las propiedades que usas sin pensar: la **ley cancelativa**, $0 \\cdot a = 0$ y la regla de los signos.', { steps: ['$a + b = a + c \\Rightarrow b = c$', '$(-a)(-b) = ab \\qquad (-a)b = -(ab)$'] }),
            sc(6, 'Los **axiomas de orden**: $a < b$ significa que $b - a$ es positivo. Multiplicar por un negativo **invierte** la desigualdad.', { steps: ['Tricotomía: $a > b$, $a = b$ o $a < b$', '$a < b,\\ c > 0 \\Rightarrow ac < bc$', '$a < b,\\ c < 0 \\Rightarrow ac > bc$'] }),
            sc(5, 'El **valor absoluto** es la distancia al cero: nunca es negativo.', { title: '$|a| = a$ si $a \\ge 0$, $\\;|a| = -a$ si $a < 0$', steps: ['$|-3| = 3 \\qquad |2 - \\sqrt2| = 2 - \\sqrt2$', '$|\\sqrt2 - 2| = 2 - \\sqrt2$'] }),
          ] },
          ex: [
            // Solo juegos: axiomas de campo, ley de signos, orden y valor absoluto (sin tarjetas ni opción múltiple).
            play('atajo-axiomas', 'Llega a la meta reescribiendo con axiomas: toca la regla que quieres usar', {
              rounds: [
                { start: '(4 + a) + (−4)', target: 'a', states: {
                  '(4 + a) + (−4)': { Conmutativa: '(a + 4) + (−4)', Asociativa: '4 + (a + (−4))' },
                  '(a + 4) + (−4)': { Asociativa: 'a + (4 + (−4))', Conmutativa: '(−4) + (a + 4)' },
                  '(−4) + (a + 4)': { Conmutativa: '(a + 4) + (−4)' },
                  'a + (4 + (−4))': { Inverso: 'a + 0' },
                  'a + 0': { Neutro: 'a' },
                  '4 + (a + (−4))': { Conmutativa: '4 + ((−4) + a)' },
                  '4 + ((−4) + a)': { Asociativa: '(4 + (−4)) + a' },
                  '(4 + (−4)) + a': { Inverso: '0 + a' },
                  '0 + a': { Neutro: 'a' },
                } },
                { start: '(1/3) · (3 · b)', target: 'b', states: {
                  '(1/3) · (3 · b)': { Asociativa: '((1/3) · 3) · b', Conmutativa: '(3 · b) · (1/3)' },
                  '(3 · b) · (1/3)': { Conmutativa: '(1/3) · (3 · b)' },
                  '((1/3) · 3) · b': { Inverso: '1 · b' },
                  '1 · b': { Neutro: 'b' },
                } },
                { start: '2(x + 5) + (−10)', target: '2x', states: {
                  '2(x + 5) + (−10)': { Distributiva: '(2x + 10) + (−10)' },
                  '(2x + 10) + (−10)': { Asociativa: '2x + (10 + (−10))', Conmutativa: '(10 + 2x) + (−10)' },
                  '(10 + 2x) + (−10)': { Conmutativa: '(2x + 10) + (−10)' },
                  '2x + (10 + (−10))': { Inverso: '2x + 0' },
                  '2x + 0': { Neutro: '2x' },
                } },
              ],
            }, 'Cada paso del álgebra es un axioma: la **conmutativa** cambia el orden, la **asociativa** mueve los paréntesis, la **distributiva** reparte el factor, el **inverso** convierte $4 + (-4)$ en $0$ y $\\tfrac13 \\cdot 3$ en $1$, y el **neutro** borra el $+\\,0$ y el $1 \\cdot$. Por ejemplo: $(4 + a) + (-4) = (a + 4) + (-4) = a + (4 + (-4)) = a + 0 = a$.',
              { hint: 'Busca juntar cada número con su opuesto (o con su recíproco): primero cambia el orden o los paréntesis hasta que queden vecinos, después usa el inverso para volverlos 0 (o 1) y al final el neutro para borrarlo. Si hay un número por un paréntesis, empieza repartiéndolo.' }),
            play('arma-producto', 'Mete fichas a la máquina hasta que el producto dé la meta', {
              tiles: [-3, 2, -1, 4, -2, 0],
              rounds: [{ target: 12 }, { target: -24 }, { target: 6 }],
            }, 'El signo de un producto depende de cuántos factores negativos tiene: una cantidad par da positivo y una impar, negativo. Por ejemplo $(-3) \\cdot (-1) \\cdot 4 = 12$ (dos negativos), $(-3) \\cdot 2 \\cdot 4 = -24$ (uno) y $(-3) \\cdot (-2) = 6$. Y el $0$ anula todo: $0 \\cdot a = 0$.',
              { hint: 'Primero decide el signo: para un resultado positivo necesitas una cantidad par de fichas negativas; para uno negativo, impar. Después ajusta el tamaño con los valores. Ojo con el 0: si entra a la máquina, todo da 0.' }),
            play('voltea-desigualdad', 'Sigue los puntos en la recta y elige el signo correcto tras cada operación', { a: -1, b: 2, steps: [{ op: '+', k: 3 }, { op: '×', k: 2 }, { op: '×', k: -1 }, { op: '+', k: -4 }] },
              'Sumar o restar lo mismo a los dos lados **conserva** el orden; multiplicar por un positivo también. Multiplicar por un negativo **refleja** la recta y voltea el signo: de $4 < 10$ se pasa a $-4 > -10$.', { hint: 'Sumar o restar el mismo número a los dos lados no cambia el signo, y multiplicar por un positivo tampoco. Solo multiplicar por un negativo voltea la desigualdad.' }),
            play('dobla-la-recta', 'Dobla la recta por el cero: ¿dónde cae el valor absoluto?', {
              min: -3, max: 3, tol: 0.1,
              points: [
                { label: '|−2.5|', insideLabel: '−2.5', inside: -2.5, tex: '|-2.5|', sol: '2.5' },
                { label: '|3 − √5|', insideLabel: '3 − √5', inside: 0.7639, tex: '|3 - \\sqrt5|', sol: '3 - \\sqrt5 \\approx 0.76' },
                { label: '|√3 − 2|', insideLabel: '√3 − 2', inside: -0.2679, tex: '|\\sqrt3 - 2|', sol: '2 - \\sqrt3 \\approx 0.27' },
                { label: '|1 − π|', insideLabel: '1 − π', inside: -2.1416, tex: '|1 - \\pi|', sol: '\\pi - 1 \\approx 2.14' },
              ],
            }, 'El valor absoluto es la distancia al cero: si lo de adentro es positivo se queda donde está ($|3 - \\sqrt5| = 3 - \\sqrt5$, porque $\\sqrt5 \\approx 2.24 < 3$); si es negativo, pasa al otro lado del cero como en un espejo ($|\\sqrt3 - 2| = 2 - \\sqrt3$ y $|1 - \\pi| = \\pi - 1$). Nunca da un número negativo.',
              { hint: 'Mira de qué lado del cero está el punto de adentro. Si está a la derecha, el valor absoluto es el mismo número; si está a la izquierda, dobla la recta por el cero y pon la marca al otro lado, a la misma distancia.' }),
            play('distancia-justa', 'Coloca $b$ a la distancia justa de $a$', { min: -10, max: 6, a: -3, d: 5 },
              '$|b - a|$ es la distancia entre $a$ y $b$. Desde $-3$, a 5 unidades hay dos puntos: $-3 + 5 = 2$ y $-3 - 5 = -8$.', { hint: '$|b - a|$ es cuántos pasos hay entre $a$ y $b$. Desde $a$ puedes caminar hacia la derecha o hacia la izquierda: hay dos lugares posibles.' }),
            play('dibuja-intervalo', 'Dibuja en la recta los números que cumplen $|x - 2| \\le 3$', { min: -4, max: 8, a: -1, b: 5, aClosed: true, bClosed: true, set: '|x − 2| ≤ 3' },
              '$|x - 2| \\le 3$ son los números a distancia **a lo sumo 3** del 2: desde $2 - 3 = -1$ hasta $2 + 3 = 5$, con los extremos incluidos: $[-1, 5]$.', { hint: 'Lee $|x - 2|$ como la distancia de $x$ al número 2. ¿Hasta dónde puedes alejarte del 2 hacia cada lado? El signo ≤ te dice si los extremos entran.' }),
          ],
        },
        {
          id: 'alg-12', title: 'Razones, proporciones y regla de tres',
          // Clase 2 en Bunny Stream (video/clase_razones_proporciones); las escenas quedan como guion.
          // Parte 2 (video/clase_regla_de_tres): se muestra tras los primeros siete ejercicios.
          more: [{ bunny: '1cda8e9b-5fff-4633-a543-de4105860b3d', duration: 263, after: 7, scenes: [] }],
          clip: { bunny: '4c098c45-1ab3-4f66-942a-3764b2da832a', duration: 289, scenes: [
            sc(5, 'Una **razón** compara dos cantidades por cociente. Una **proporción** es la igualdad de dos razones.', { title: '$\\dfrac{a}{b} = \\dfrac{c}{d} \\iff ad = bc$', steps: ['$\\dfrac{3}{5} = \\dfrac{12}{20}$ porque $3 \\cdot 20 = 5 \\cdot 12$'] }),
            sc(5, '**Directamente proporcionales**: si una se duplica, la otra también. Su gráfica es una recta por el origen.', { title: '$y = kx$', viz: { type: 'graph', xr: [0, 6], yr: [0, 9], f: (x, k) => k * x, anim: [0.5, 1.5], label: k => `k = ${fmt(k)}` } }),
            sc(5, '**Inversamente proporcionales**: si una se duplica, la otra se reduce a la mitad. Su producto es constante.', { title: '$xy = k$', viz: { type: 'graph', xr: [0, 8], yr: [0, 8], f: x => 6 / x, draw: true, points: [[2, 3, '(2, 3)'], [3, 2, '(3, 2)']] } }),
            sc(5, '**Reparto proporcional**: suma las partes y reparte el total en esa razón.', { steps: ['Repartir $1\\,200\\,000$ en partes proporcionales a $2, 3, 5$', '$2 + 3 + 5 = 10$, cada parte vale $120\\,000$', '$240\\,000,\\ 360\\,000,\\ 600\\,000$'] }),
          ] },
          // Siete minijuegos de p5.js (js/games/*.js) basados en el texto guía §1.1 (razón, proporción,
          // magnitudes directa e inversamente proporcionales, reparto y media proporcional).
          ex: [
            play('limonada', 'Prepara una jarra grande que sepa **igual** que el modelo', { base: [2, 3], minLemons: 4, maxEach: 12 },
              'Una **razón** compara dos cantidades por cociente: $2 : 3$ limones por vasos. Toda mezcla con la misma razón ($4 : 6$, $6 : 9$, …) sabe igual: son razones **equivalentes**.',
              { hint: 'Para que sepa igual, limones y vasos se multiplican por el mismo número: si duplicas los limones, duplica también los vasos.' }),
            play('balanza-proporcion', 'Encuentra $x$ para que la balanza quede en equilibrio', { a: 3, b: 5, d: 20, min: 0, max: 30 },
              'Una **proporción** es la igualdad de dos razones: $\\dfrac{a}{b} = \\dfrac{c}{d}$ si y solo si $ad = bc$. Aquí $3 \\cdot 20 = 5x$, así que $x = 12$.',
              { hint: 'En una proporción los productos cruzados son iguales: multiplica en cruz y despeja $x$. También puedes ver por cuánto se multiplicó el 5 para llegar al 20.' }),
            play('duplica-magnitud', 'Una magnitud cambió: sube o baja la barra de la otra hasta su nuevo valor', {
              rounds: [
                { text: 'Con 3 llaves iguales un tanque se llena en 12 horas. Ahora se abren 6 llaves.', nx: 'llaves', ny: 'horas', uy: 'horas', x0: 3, y0: 12, x1: 6, y1: 6, step: 1, ymax: 24 },
                { text: '4 m de tela cuestan 30 mil pesos. Ahora se compran 12 m.', nx: 'metros', ny: 'miles de pesos', uy: 'mil pesos', x0: 4, y0: 30, x1: 12, y1: 90, step: 5, ymax: 120 },
                { text: 'Un cuadrado de 2 cm de lado tiene 4 cm² de área. Ahora el lado mide 6 cm.', nx: 'lado', ny: 'área', uy: 'cm²', x0: 2, y0: 4, x1: 6, y1: 36, step: 2, ymax: 48 },
                { text: 'A 40 km/h el viaje dura 3 horas. Ahora se va a 120 km/h.', nx: 'velocidad', ny: 'horas', uy: 'horas', x0: 40, y0: 3, x1: 120, y1: 1, step: 0.25, ymax: 4 },
              ],
            }, '**Directa**: si una se multiplica por 3, la otra también (12 m de tela cuestan $30 \\cdot 3 = 90$ mil). **Inversa**: si una se multiplica, la otra se divide por lo mismo (el doble de llaves, la mitad de horas: 6; el triple de velocidad, la tercera parte del tiempo: 1 hora). El área del cuadrado es $l^2$: el lado $\\times 3$ hace el área $\\times 9$, así que $4 \\cdot 9 = 36$ y la relación **no es ninguna** de las dos.',
              { hint: 'Pregúntate primero: si esta magnitud crece, ¿la otra crece o decrece? Luego mira por cuánto se multiplicó (la flecha te lo dice) y aplica el mismo cambio, o el contrario. Con áreas, piensa en lado por lado.' }),
            play('grafica-relacion', 'Mueve los puntos para que la relación sea **directa**', { kind: 'directa', k: 1.5, given: [[2, 3]], xs: [4, 6, 8], tol: 0.25, xmax: 10, ymax: 14 },
              'En una relación directa $y = kx$: con $(2, 3)$ la constante es $k = \\tfrac32 = 1.5$, y los puntos quedan sobre la recta que pasa por el origen: $(4, 6)$, $(6, 9)$, $(8, 12)$.',
              { hint: 'En una relación directa el cociente $y/x$ es siempre el mismo: calcúlalo con el punto que ya está y úsalo para los demás. Todos quedan en una recta que pasa por el origen.' }),
            play('grafica-relacion', 'Mueve los puntos para que la relación sea **inversa**', { kind: 'inversa', k: 12, given: [[2, 6]], xs: [3, 4, 6], tol: 0.25, xmax: 8, ymax: 8 },
              'En una relación inversa $xy = k$: con $(2, 6)$ la constante es $k = 12$, y los puntos quedan sobre la curva $y = \\tfrac{12}{x}$: $(3, 4)$, $(4, 3)$, $(6, 2)$.',
              { hint: 'En una relación inversa el producto $x \\cdot y$ es siempre el mismo. Calcúlalo con el punto dado y busca para cada $x$ el $y$ que da ese producto.' }),
            play('reparto', 'Reparte 1.200.000 en partes proporcionales a 2, 3 y 5', { total: 1200000, parts: [2, 3, 5], tol: 0.02 },
              '**Reparto proporcional**: $2 + 3 + 5 = 10$ partes, cada una vale $1\\,200\\,000 \\div 10 = 120\\,000$. Las partes son $240\\,000$, $360\\,000$ y $600\\,000$.',
              { hint: 'Suma los números de la proporción para saber en cuántas partes iguales se corta el total. Luego cada persona se lleva tantas partes como diga su número.' }),
            play('cuadrado-media', 'Encuentra el lado del cuadrado con la misma área que el rectángulo $4 \\times 25$', { w: 4, h: 25, tol: 0.2 },
              'La **media proporcional** entre 4 y 25 es el $x$ con $\\dfrac{4}{x} = \\dfrac{x}{25}$: $x^2 = 100$, $x = 10$. Geométricamente, es el lado del cuadrado con la misma área que el rectángulo $4 \\times 25$.',
              { hint: 'Calcula el área del rectángulo. El cuadrado debe tener esa misma área, así que su lado es el número que multiplicado por sí mismo la da.' }),
            // --- Parte 2: regla de tres (el video 2 de `more` se muestra antes de estos cinco).
            play('arma-regla', 'Arma la regla de tres de cada problema', {
              problems: [
                { text: 'Un ciclista recorre 150 km en 5 horas. ¿Cuántos km recorre en 7 horas?', kind: 'directa',
                  chips: [{ label: '150 km', mag: 0, row: 0 }, { label: '5 h', mag: 1, row: 0 }, { label: 'x', mag: 0, row: 1 }, { label: '7 h', mag: 1, row: 1 }] },
                { text: '12 obreros terminan una obra en 30 días. ¿Cuántos obreros la terminan en 24 días?', kind: 'inversa',
                  chips: [{ label: '12 obreros', mag: 0, row: 0 }, { label: '30 días', mag: 1, row: 0 }, { label: 'x', mag: 0, row: 1 }, { label: '24 días', mag: 1, row: 1 }] },
              ],
            }, 'La **regla de tres** busca el cuarto término de una proporción. Cada columna lleva una magnitud y cada fila una situación. Si al crecer una magnitud la otra también crece, es **directa** (flechas paralelas): $\\dfrac{150}{x} = \\dfrac{5}{7}$. Si una crece y la otra baja, es **inversa** (flechas cruzadas): $\\dfrac{12}{x} = \\dfrac{24}{30}$.',
              { hint: 'Pon cada magnitud en su columna (km con km, horas con horas) y cada situación en su fila. Para el tipo, pregúntate: si una crece, ¿la otra crece o baja?' }),
            play('bascula', 'Fija el precio de 5 kg de manzanas', { knownKg: 3, knownPrice: 12000, askKg: 5, max: 40000, step: 500, tol: 200 },
              'Kilos y precio son directamente proporcionales: $\\dfrac{3}{5} = \\dfrac{12\\,000}{x}$, así que $x = \\dfrac{12\\,000 \\cdot 5}{3} = 20\\,000$. Cada kilo cuesta 4.000.',
              { hint: 'Averigua primero cuánto cuesta un solo kilo y luego multiplica por los kilos que se piden.' }),
            play('la-obra', 'Deja en la obra los obreros justos para terminar en 24 días', { workers: 12, days: 30, askDays: 24, max: 40 },
              'Obreros y días son inversamente proporcionales: el producto se conserva. $12 \\cdot 30 = 360 = x \\cdot 24$, así que $x = 15$. Más obreros, menos días.',
              { hint: 'La obra completa mide «obreros × días» (jornadas de trabajo). Calcula esas jornadas y repártelas en los días nuevos.' }),
            play('engranajes', 'Completa la rueda B para que los engranajes encajen', {
              rounds: [
                { A: [12, 10], B: [30, null], min: 1, max: 20 },
                { A: [18, 5], B: [null, 9], min: 6, max: 36 },
                { A: [40, 3], B: [24, null], min: 1, max: 12 },
              ],
            }, 'Por el punto de contacto pasan los mismos dientes de las dos ruedas, así que **dientes × vueltas** es igual en ambas: dientes y vueltas son **inversamente proporcionales**. $12 \\cdot 10 = 30 \\cdot 4$, $18 \\cdot 5 = 10 \\cdot 9$ y $40 \\cdot 3 = 24 \\cdot 5$. La rueda más chica es la que da más vueltas.',
              { hint: 'Cuenta cuántos dientes pasan por el punto donde se tocan las ruedas: los de A son dientes × vueltas. Los de B tienen que ser los mismos.' }),
            play('cadena-razones', 'Voltea las razones que haga falta para que la cadena dé los días', { base: 28, unit: 'días', factors: [{ label: 'hombres', a: 9, b: 7, inverse: true }, { label: 'horas/día', a: 6, b: 8, inverse: true }], answer: 27 },
              'En la **regla de tres compuesta** cada magnitud aporta una razón: si es inversa, la razón va al revés del cambio. Menos hombres (de 9 a 7) → más días: $\\tfrac{9}{7}$. Más horas por día (de 6 a 8) → menos días: $\\tfrac{6}{8}$. $x = 28 \\cdot \\tfrac{9}{7} \\cdot \\tfrac{6}{8} = 27$ días.',
              { hint: 'Mira cada magnitud por separado: ¿con menos hombres se tardan más o menos días? ¿Y con más horas al día? Si los días deben crecer, la razón tiene que ser mayor que 1.' }),
          ],
        },
        {
          id: 'alg-13', title: 'Porcentajes y descuentos',
          // Parte 1 «Porcentajes» (Bunny, 3:44).
          clip: { bunny: '59348bd7-b5b5-4c29-bf79-31a54b439a1b', duration: 224, scenes: [] },
          // Parte 2 «Aumentos y descuentos» (Bunny, 2:11), después del sexto ejercicio.
          more: [{ bunny: '3b666757-462f-4ccf-8f95-a8c816e33141', duration: 131, after: 6, scenes: [] }],
          ex: [
            // --- Parte 1: porcentajes ---
            play('cuadricula-cien', 'Pinta en la cuadrícula el porcentaje que pide cada ronda', { rounds: [{ ask: '35 %', count: 35 }, { ask: '3/4', count: 75 }, { ask: '0.08', count: 8 }] },
              'Por ciento es «de cada 100»: $35\\%$ son 35 casillas de 100. Las fracciones y los decimales se pasan a centésimas: $\\tfrac34 = \\tfrac{75}{100} = 75\\%$ y $0.08 = \\tfrac{8}{100} = 8\\%$.',
              { hint: 'La cuadrícula tiene 100 casillas: cada una es el 1 %. Pasa fracciones y decimales a «de cada 100» antes de pintar.' }),
            play('cruz-porcentaje', 'Arma la cruz del porcentaje de cada problema', {
              problems: [
                { text: 'Halla el 12 % de 8.000 pesos', chips: [{ label: '12', cell: 'p' }, { label: '8.000', cell: 'C' }, { label: '?', cell: 'B' }] },
                { text: '¿De qué número es 48 el 8 %?', chips: [{ label: '8', cell: 'p' }, { label: '48', cell: 'B' }, { label: '?', cell: 'C' }] },
                { text: '¿De qué número es 408 el 70 % más?', chips: [{ label: '170', cell: 'p' }, { label: '408', cell: 'B' }, { label: '?', cell: 'C' }, { label: '70', cell: null }] },
              ],
            }, 'La cruz es la regla de tres $\\dfrac{100}{C} = \\dfrac{p}{B}$: $p$ es el porcentaje, $C$ el total y $B$ la parte. «El 70 % más» de un número es su $170\\%$, así que $p = 170$ y $C = \\dfrac{100 \\cdot 408}{170} = 240$.',
              { hint: 'El total siempre va con el 100 % y la parte con su porcentaje. Si dice «el p % más», el número dado ya es más que el total: su porcentaje es 100 + p.' }),
            play('mezcla', 'Añade agua hasta que el alcohol sea el 20 % de la mezcla', { solute: 40, target: 20, step: 10, max: 400 },
              'Los 40 g de alcohol son el $20\\%$ de la mezcla, así que la mezcla pesa $C = \\dfrac{100 \\cdot 40}{20} = 200$ g; el agua es lo que falta: $200 - 40 = 160$ g.',
              { hint: 'El alcohol no cambia: solo agregas agua. Pregúntate de qué peso total son 40 g el 20 % (la quinta parte), y el agua es lo que falta para llegar.' }),
            play('rueda-porcentaje', 'Gira la aguja hasta cubrir la parte pedida y lee el porcentaje', { rounds: [{ part: 51, whole: 170 }, { part: 63, whole: 180 }, { part: 26.4, whole: 240 }], tol: 1 },
              'Qué porcentaje es $B$ de $C$: $p = \\dfrac{100 \\cdot B}{C}$. Así, $\\dfrac{100 \\cdot 51}{170} = 30\\%$, $\\dfrac{100 \\cdot 63}{180} = 35\\%$ y $\\dfrac{100 \\cdot 26.4}{240} = 11\\%$.',
              { hint: 'Divide la parte entre el total y multiplica por 100. Mientras giras, compara la parte cubierta con la que pide la ronda.' }),
            play('bodegas', 'Reparte los 2.000 sacos para que, tras el viaje del 20 %, queden iguales', { total: 2000, move: 20, step: 50 },
              'Si en A hay $x$ sacos, en B hay $2\\,000 - x$. Tras llevar el $20\\%$ de A: $0.8x = 2\\,000 - x + 0.2x$, es decir $1.6x = 2\\,000$ y $x = 1\\,250$. Había 1.250 sacos en A y 750 en B.',
              { hint: 'Llama $x$ a los sacos de A. Escribe cuántos quedan en A y cuántos llegan a B después del viaje, e iguala las dos bodegas.' }),
            play('estira-barra', 'Estira o encoge la barra hasta lo que pide cada ronda', {
              max: 200,
              rounds: [
                { base: 250, text: 'El 60 % más de 250', pct: 160 },
                { base: 400, text: 'El 15 % menos de 400', pct: 85 },
                { base: 90, text: 'La quinta parte de 90', pct: 20 },
                { base: 300, text: 'Lo que queda de 300 si se le quita el 35 %', pct: 65 },
              ],
            }, 'La cantidad original es el $100\\%$. «El $60\\%$ más» la estira al $160\\%$ ($250 \\cdot 1.6 = 400$); «el $15\\%$ menos» la deja en el $85\\%$ ($340$); la quinta parte es $\\tfrac15 = 20\\%$ ($18$), y quitar el $35\\%$ deja el $65\\%$ ($195$).',
              { hint: 'La barra punteada es el 100 %. Si la ronda dice «más», la barra crece por encima de 100; si dice «menos» o «quita», queda por debajo. Una fracción como un cuarto o un quinto se pasa a «de cada 100».' }),
            // --- Parte 2: aumentos y descuentos ---
            play('tragamonedas', 'Gira los rodillos hasta formar el factor de cada cambio', {
              rounds: [{ change: 35 }, { change: -12 }, { change: 150 }, { change: -0.5 }, { change: 7 }],
            }, 'Aumentar un $r\\%$ es multiplicar por $1 + \\tfrac{r}{100}$ y descontar, por $1 - \\tfrac{r}{100}$: $+35\\% \\Rightarrow \\times 1.35$, $-12\\% \\Rightarrow \\times 0.88$, $+150\\% \\Rightarrow \\times 2.5$ (dos veces y media), $-0.5\\% \\Rightarrow \\times 0.995$ y $+7\\% \\Rightarrow \\times 1.07$, no $1.7$.',
              { hint: 'Empieza en $\\times 1.000$, que deja el precio igual. Un aumento suma su porcentaje en centésimas; un descuento lo resta. Mira el billete de 100: debe salir convertido en 100 más o menos el porcentaje.' }),
            play('etiqueta-rebaja', 'Pega en cada etiqueta el sticker del precio final', {
              items: [{ name: 'Tenis', price: 45000, change: -20 }, { name: 'Audífonos', price: 80000, change: -15 }, { name: 'Bicicleta', price: 60000, change: 30 }],
              stickers: [36000, 9000, 68000, 12000, 78000, 42000],
            }, 'El precio final es el precio de lista por el factor: $45\\,000 \\cdot 0.8 = 36\\,000$ (9.000 es el descuento, no el precio), $80\\,000 \\cdot 0.85 = 68\\,000$ y, como la bicicleta **sube** $30\\%$, $60\\,000 \\cdot 1.3 = 78\\,000$.',
              { hint: 'Multiplica el precio por el factor del cambio. Cuidado: algunos stickers son solo el descuento, no el precio final, y no todo baja.' }),
            play('cascada', 'Pega los dos descuentos y fija el descuento único equivalente', { price: 100000, changes: [-30, -20], step: 1 },
              'Cada descuento multiplica el precio: $100\\,000 \\cdot 0.7 = 70\\,000$ y $70\\,000 \\cdot 0.8 = 56\\,000$. El factor total es $0.7 \\cdot 0.8 = 0.56$, así que el descuento único es $1 - 0.56 = 44\\%$, no $50\\%$. El orden no importa.',
              { hint: 'El segundo descuento se aplica sobre el precio ya rebajado. Sigue el precio paso a paso y compara el final con el original.' }),
            play('mejor-oferta', 'Lleva el carrito a la tienda donde el producto sale más barato', {
              rounds: [
                { price: 100000, a: { label: '30 % y luego 20 % de descuento', changes: [-30, -20] }, b: { label: '45 % de descuento de una vez', changes: [-45] } },
                { price: 80000, a: { label: 'Sube 20 % y luego baja 20 %', changes: [20, -20] }, b: { label: 'Precio de lista', changes: [] } },
                { price: 50000, a: { label: '10 % de descuento', changes: [-10] }, b: { label: '6.000 de rebaja', off: 6000 } },
              ],
            }, 'Se comparan los precios finales. Ronda 1: $0.7 \\cdot 0.8 = 0.56$ ($56\\,000$) contra $0.55$ ($55\\,000$): gana el 45 %. Ronda 2: $1.2 \\cdot 0.8 = 0.96$: subir y bajar el mismo porcentaje deja el precio en $76\\,800$, más barato que la lista. Ronda 3: el $10\\%$ de $50\\,000$ son $5\\,000$, menos que la rebaja fija de $6\\,000$.',
              { hint: 'Calcula el precio final de cada tienda paso a paso, aplicando cada cambio sobre el precio que va quedando, y compara.' }),
            play('rebote', 'Sube el precio rebajado hasta volver exactamente al original', { base: 100, drop: 10, max: 30, step: 0.1, tol: 0.06 },
              'Tras rebajar $10\\%$ el precio queda en 90. Para volver a 100 hay que subir 10 sobre 90: $\\dfrac{10}{90} = 11.1\\%$. La subida se calcula sobre el precio rebajado, por eso no basta con $10\\%$.',
              { hint: 'Después de la rebaja el precio es menor. La subida se calcula sobre ese precio rebajado: ¿qué porcentaje de él falta para volver al original?' }),
            play('dos-etapas', 'Gira la perilla hasta que la máquina produzca 8.840', { changes: [30, -20], output: 8840, max: 20000, step: 20 },
              'Subir $30\\%$ es $\\times 1.3$ y bajar $20\\%$ es $\\times 0.8$: en total $\\times 1.04$. Entonces $1.04x = 8\\,840$ y $x = 8\\,500$.',
              { hint: 'Junta los dos cambios en un solo factor multiplicando $1.3 \\cdot 0.8$. Luego busca qué número, multiplicado por ese factor, da 8.840.' }),
            play('cadena-cambios', 'Pon dos sellos para que el precio cambie lo que pide cada ronda', {
              stamps: [10, 10, -10, 50, -50, 20, -20, -25],
              rounds: [
                { goal: 1.21, text: 'Que el precio suba 21 % en total' },
                { goal: 0.75, text: 'Que el precio quede en el 75 % del original' },
                { goal: 0.99, text: 'Que el precio baje solo 1 % en total' },
                { goal: 1.08, text: 'Que el precio suba 8 % en total' },
              ],
            }, 'Los cambios sucesivos **se multiplican**, no se suman: $1.1 \\cdot 1.1 = 1.21$ (dos subidas del $10\\%$ dan $21\\%$), $1.5 \\cdot 0.5 = 0.75$, $0.9 \\cdot 1.1 = 0.99$ y $1.2 \\cdot 0.9 = 1.08$. Por eso subir y bajar el mismo porcentaje nunca deja el precio igual.',
              { hint: 'Cada sello multiplica el precio: +10 % es ×1.1 y −50 % es ×0.5. Multiplica los dos factores y compara con lo que pide la ronda. Mira cómo cambia la etiqueta de 100 tras cada sello.' }),
          ],
        },
        {
          id: 'alg-13b', title: 'Interés simple y compuesto',
          // Clase 4 (video/clase_interes_sc): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(6, 'El **interés** es lo que gana el dinero prestado; el **monto** es capital más interés.', { title: '$M = C + I$', steps: ['$C$ capital · $r$ tasa por periodo · $t$ periodos', '500.000 al 2 % mensual: $I_{\\text{mes}} = 500\\,000 \\cdot 0.02 = 10\\,000$'] }),
            sc(6, 'Interés **simple**: siempre sobre el capital inicial, cada periodo paga lo mismo. Crece en línea recta.', { title: '$I = C\\,r\\,t \\qquad M = C\\,(1 + r\\,t)$', steps: ['1.200.000 al 1.5 % mensual, 8 meses: $I = 144\\,000$', '$M = 1\\,200\\,000 \\cdot 1.12 = 1\\,344\\,000$'] }),
            sc(7, 'Interés **compuesto**: el interés se suma al capital y también gana interés. Crece en curva.', { title: '$M = C\\,(1 + r)^n$', steps: ['500.000 al 2 % mensual, 3 meses: $500\\,000 \\cdot 1.02^3 = 530\\,604$', '1.000.000 al 10 % anual, 10 años: simple 2.000.000 · compuesto 2.593.742'], viz: { type: 'graph', xr: [0, 10], yr: [0, 1.8], f: t => 1.1 ** t - 1, points: [[10, 1.59, 'compuesto 1.59']] } }),
          ] },
          ex: [
            play('cobra-intereses', 'Cobra mes a mes hasta juntar 180.000 pesos de interés', { capital: 1500000, rate: 0.01, target: 180000, months: 18 },
              'Con interés simple cada mes paga lo mismo: $1\\,500\\,000 \\cdot 0.01 = 15\\,000$. Para juntar $180\\,000$ hacen falta $180\\,000 / 15\\,000 = 12$ meses: $I = C\\,r\\,t$.',
              { hint: 'Con interés simple cada mes paga lo mismo. Calcula cuánto paga un mes y cuántos meses hacen falta para juntar la meta.' }),
            play('crece-planta', 'Haz crecer las plantas de los meses 2 y 3 según el tipo de interés', {
              rounds: [
                { kind: 'simple', C: 400, M1: 430, step: 1 }, { kind: 'compuesto', C: 500, M1: 600, step: 1 },
                { kind: 'compuesto', C: 1000, M1: 1100, step: 1 }, { kind: 'simple', C: 250, M1: 270, step: 1 },
              ],
            }, 'Con interés **simple** el monto sube siempre lo mismo (lo del primer mes): $400 \\to 430 \\to 460 \\to 490$. Con **compuesto** se multiplica siempre por el mismo factor: de 500 a 600 es $\\times 1.2$, así que $600 \\cdot 1.2 = 720$ y $720 \\cdot 1.2 = 864$; de 1.000 a 1.100 es $\\times 1.1$: $1\\,210$ y $1\\,331$. El compuesto crece cada vez más porque el interés también gana interés.',
              { hint: 'Mira cuánto creció la planta del mes 0 al mes 1. Si el interés es simple, súmale eso mismo cada mes. Si es compuesto, averigua por cuánto se multiplicó y multiplica otra vez por ese número.' }),
            play('carrera-interes', 'Encuentra el primer mes en que el compuesto le saca más de 120.000 al simple', { capital: 3000000, rate: 0.02, months: 24, gap: 120000 },
              'Simple: $M = 3\\,000\\,000(1 + 0.02n)$. Compuesto: $M = 3\\,000\\,000(1.02)^n$. La ventaja crece cada mes: en el 14 es $\\approx 118\\,400$ y en el 15 ya es $\\approx 137\\,600$.',
              { hint: 'Calcula los dos montos mes a mes y réstalos. La diferencia empieza en 0 y crece cada mes: busca el primer mes en que pasa de 120.000.' }),
            play('ajusta-capital', 'Fija el capital que, al 3 % mensual compuesto, deja 1.125.509 en 4 meses', { rate: 0.03, periods: 4, target: 1125509, step: 50000, max: 2000000, tol: 1 },
              'Se despeja el capital de $M = C(1 + r)^n$: $C = \\dfrac{1\\,125\\,509}{1.03^4} = \\dfrac{1\\,125\\,509}{1.12551} \\approx 1\\,000\\,000$.',
              { hint: 'Despeja $C$ de $M = C(1 + r)^n$: divide el monto entre el factor elevado al número de meses.' }),
            play('mejor-oferta', 'Lleva el carrito al banco donde el millón queda convertido en más dinero', {
              prefer: 'high', noun: 'Banco',
              rounds: [
                { price: 1000000, a: { label: '1.2 % mensual simple, 10 meses', changes: [12] }, b: { label: '1 % mensual compuesto, 10 meses', changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] } },
                { price: 1000000, a: { label: '8 % anual simple, 5 años', changes: [40] }, b: { label: '7 % anual compuesto, 5 años', changes: [7, 7, 7, 7, 7] } },
                { price: 1000000, a: { label: '2 % mensual compuesto, 6 meses', changes: [2, 2, 2, 2, 2, 2] }, b: { label: '12.5 % semestral simple', changes: [12.5] } },
              ],
            }, 'Se comparan los montos. Ronda 1: simple $1.12 \\Rightarrow 1\\,120\\,000$ contra $1.01^{10} = 1.1046 \\Rightarrow 1\\,104\\,622$: gana el simple. Ronda 2: $1.40 \\Rightarrow 1\\,400\\,000$ contra $1.07^5 = 1.4026 \\Rightarrow 1\\,402\\,552$: gana el compuesto. Ronda 3: $1.02^6 = 1.1262 \\Rightarrow 1\\,126\\,162$ contra $1\\,125\\,000$: gana el compuesto por poco. La tasa y el plazo pesan más que el tipo de interés.',
              { hint: 'Calcula el monto final de cada banco: el simple suma tasa × periodos una sola vez; el compuesto multiplica por el factor cada periodo. A veces gana el simple, si su tasa es bastante más alta.' }),
            play('alcancias-gemelas', 'Elige la tasa simple que llena la alcancía igual que el compuesto', {
              tol: 0.06, max: 40,
              rounds: [{ C: 1000, r: 10, n: 2 }, { C: 1000, r: 20, n: 2 }, { C: 2000, r: 10, n: 3 }],
            }, 'Con la misma tasa el compuesto siempre gana desde el segundo periodo, porque el interés también gana interés. Para empatar, la tasa simple debe ser mayor: $\\dfrac{(1 + r)^n - 1}{n}$. Al $10\\%$ en 2 periodos, $1.1^2 = 1.21$: hace falta $10.5\\%$ simple. Al $20\\%$, $1.2^2 = 1.44$: hace falta $22\\%$ (duplicar la tasa no duplicó la ganancia: de $21\\%$ pasó a $44\\%$). Al $10\\%$ en 3 periodos, $1.1^3 = 1.331$: unos $11.03\\%$.',
              { hint: 'Calcula cuánto gana en total la alcancía compuesta (multiplicando por el factor cada periodo) y reparte esa ganancia en partes iguales entre los periodos: eso es lo que debe ganar la simple en cada uno.' }),
          ],
        },
      ],
    },
    {
      world: 'potencias', title: 'Potenciación y radicación',
      lessons: [
        {
          id: 'alg-21a', title: 'Potencias y exponentes',
          // Clase 8 (video/clase_potencias): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration). Libro UdeA §1.4.
          clip: { scenes: [
            sc(4, 'Una potencia es una multiplicación repetida: la **base** se multiplica tantas veces como dice el **exponente**.', { title: '$a^n = \\underbrace{a \\cdot a \\cdots a}_{n \\text{ veces}}$', steps: ['$2^3 = 2 \\cdot 2 \\cdot 2 = 8$'] }),
            sc(5, 'Cada vez que el exponente sube en 1, el resultado se multiplica por la base.', { title: '$y = 2^x$', viz: { type: 'graph', xr: [-3, 4.5], yr: [-1, 17], f: x => 2 ** x, draw: true, points: [[0, 1, '2⁰ = 1'], [3, 8, '2³ = 8']] } }),
            sc(5, '¡Cuidado con el signo! El exponente solo afecta a lo que toca.', { steps: ['$-2^4 = -(2^4) = -16$', '$(-2)^4 = 16$', '$(-2)^3 = -8$'] }),
            sc(5, 'El exponente cero y los negativos siguen el mismo patrón: dividir entre la base.', { steps: ['$a^0 = 1 \\quad (a \\neq 0)$', '$a^{-n} = \\dfrac{1}{a^n}$', '$2^{-3} = \\dfrac{1}{8}$'] }),
          ] },
          ex: [
            num('Calcula $-2^4$', -16, 'El exponente solo afecta al 2: $-(2^4) = -16$.', { hint: 'Ojo con el paréntesis: sin él, el exponente solo toca al 2. Calcula primero la potencia de 2 y después pon el signo menos delante.' }),
            num('Calcula $(-2)^3$', -8, 'Base negativa con exponente impar: el resultado es negativo.', { hint: 'Aquí el paréntesis hace que el −2 completo se multiplique por sí mismo tres veces. Cuenta los factores negativos: ¿son una cantidad par o impar?' }),
            mc('$5^0 = \\;?$', ['$1$', '$0$', '$5$', 'No está definido'], 0, 'Toda base distinta de cero elevada a la 0 vale 1.', { hint: 'Piensa en la escalera de potencias: $5^2$, $5^1$… cada peldaño hacia abajo divide entre 5. ¿Qué queda al bajar un peldaño más desde $5^1$?' }),
            num('Calcula $2^{-3}$ (puedes escribir una fracción)', 0.125, '$2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$.', { hint: 'Un exponente negativo no hace negativo el número: lo manda al denominador. Escribe $\\tfrac{1}{2^3}$ y calcula; puedes responder con una fracción.', answerText: '$\\tfrac{1}{8}$' }),
            mc('$-(-2)^3 = \\;?$', ['$8$', '$-8$', '$6$', '$-6$'], 0, '$(-2)^3 = -8$, y su opuesto es $8$.', { hint: 'Hazlo por partes: primero $(-2)^3$ con su signo, y después aplica el signo menos de afuera, que le cambia el signo al resultado.' }),
            play('torre-producto', 'Dobla la hoja hasta tener exactamente 512 capas', { kind: 'ratio', start: 1, r: 2, target: 512, max: 12, unit: 'capas', period: 'doblez' },
              'Cada doblez duplica las capas: tras $n$ dobleces hay $2^n$. Como $512 = 2^9$, son 9 dobleces. Con 10 ya serían 1024: lo exponencial se dispara.', { hint: 'Cada doblez duplica las capas: 1, 2, 4, 8… ¿Cuántas veces hay que duplicar para llegar a 512? Cuenta los dobleces.' }),
            play('clasifica-cartas', 'Desliza cada potencia según el **signo** de su valor', {
              left: 'Negativo', right: 'Positivo',
              cards: [
                { text: '(−3)⁴', side: 'right', why: 'Cuatro factores −3: exponente par, positivo (81).' },
                { text: '−3⁴', side: 'left', why: 'El exponente solo toca al 3: −(81) = −81.' },
                { text: '(−3)³', side: 'left', why: 'Tres factores −3: exponente impar, negativo (−27).' },
                { text: '−(−3)³', side: 'right', why: '(−3)³ = −27 y su opuesto es 27.' },
                { text: '(−1)¹⁰⁰', side: 'right', why: 'Exponente par: 1.' },
                { text: '−(−2)²', side: 'left', why: '(−2)² = 4 y el menos de afuera lo vuelve −4.' },
                { text: '(−2)⁻³', side: 'left', why: '1/(−2)³ = 1/(−8) = −1/8: el exponente negativo no cambia el signo.' },
              ],
            }, 'Con paréntesis, el signo entra en la potencia: exponente par da positivo e impar da negativo. Sin paréntesis, $-a^n = -(a^n)$. El exponente negativo solo manda la potencia al denominador.', { hint: 'Fíjate si el signo está dentro del paréntesis. Si está, cuenta los factores negativos: par da positivo, impar da negativo. Sin paréntesis, el exponente solo toca al número y el menos queda afuera.' }),
            play('rellena-medios', 'Completa la escalera de potencias de 2: cada peldaño hacia abajo divide entre 2', { first: 16, last: 0.25, k: 5, kind: 'geometrica', chips: [8, 4, 2, 1, 0.5, 0, -2, -1] },
              'De $2^4 = 16$ hacia abajo cada peldaño divide entre 2: $8, 4, 2$, luego $2^0 = 1$, $2^{-1} = 0.5$ y $2^{-2} = 0.25$. Ningún peldaño es 0 ni negativo: las potencias de 2 siempre son positivas.', { hint: 'Cada peldaño se divide entre 2. Después del 1 viene la mitad de 1, y así sigue: los exponentes negativos dan fracciones, nunca números negativos.' }),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: '2⁻³ = −8', truth: false, why: '2⁻³ = 1/2³ = 1/8: el exponente negativo pone una fracción, no un signo.' },
                { text: '0⁵ = 0', truth: true, why: '0 · 0 · 0 · 0 · 0 = 0.' },
                { text: '7⁰ = 0', truth: false, why: 'Toda base no nula a la cero vale 1.' },
                { text: '(2/3)⁻² = 9/4', truth: true, why: 'El exponente negativo voltea la fracción: (3/2)² = 9/4.' },
                { text: '(−5)² = −5²', truth: false, why: '(−5)² = 25 pero −5² = −25.' },
              ],
            }, 'Las trampas de siempre: $a^{-n} = \\dfrac{1}{a^n}$ (no un negativo), $a^0 = 1$ para $a \\ne 0$, $0^n = 0$ para $n > 0$, y el paréntesis decide si el signo entra en la potencia.', { hint: 'Tres reglas para revisar las tarjetas: toda base no nula a la 0 vale 1, un exponente negativo da una fracción (no un signo) y en $-5^2$ el exponente no toca al menos.' }),
          ],
        },
        {
          id: 'alg-21b', title: 'Leyes de los exponentes',
          // Clase 9 (video/clase_leyes_exponentes): parte 1 aquí y parte 2 en `more` (tras el sexto ejercicio); escenas de respaldo hasta enlazar Bunny. Libro UdeA §1.4.
          more: [{ after: 6, scenes: [
            sc(6, 'Un exponente **negativo** es un cambio de piso: la potencia baja al denominador (o sube) y se vuelve positiva.', { steps: ['$a^{-n} = \\dfrac{1}{a^n} \\qquad \\dfrac{x^{-2}}{y^{-3}} = \\dfrac{y^3}{x^2}$', '$\\left(\\tfrac25\\right)^{-3} = \\left(\\tfrac52\\right)^3 = \\tfrac{125}{8}$'] }),
            sc(6, 'Para simplificar: primero los paréntesis (multiplicar exponentes), luego sumar o restar.', { steps: ['$(3x^{-2}y)^{-2} = \\dfrac{x^4}{9y^2}$', '$\\dfrac{(x^{-3}y^2)^{-4}}{(y^6x^{-4})^{-2}} = x^4y^4$'] }),
            sc(5, 'La **notación científica** usa potencias de 10: $a \\times 10^n$ con $1 \\le a < 10$.', { steps: ['$300\\,000\\,000 = 3 \\times 10^8 \\qquad 0.00000012 = 1.2 \\times 10^{-7}$'] }),
          ] }],
          clip: { scenes: [
            sc(5, 'Al multiplicar potencias de igual base, **se suman** los exponentes; al dividir, **se restan**.', { steps: ['$a^m \\cdot a^n = a^{m+n}$', '$\\dfrac{a^m}{a^n} = a^{m-n}$'] }),
            sc(5, 'Potencia de una potencia: **se multiplican** los exponentes.', { steps: ['$(a^m)^n = a^{mn}$', '$(ab)^n = a^n b^n$', '$\\left(\\dfrac{a}{b}\\right)^{-n} = \\left(\\dfrac{b}{a}\\right)^{n}$'] }),
            sc(5, 'Con estas leyes simplificas expresiones con exponentes literales:', { steps: ['$\\dfrac{3^{n+2} - 3^n}{8 \\cdot 3^n}$', '$= \\dfrac{3^n (3^2 - 1)}{8 \\cdot 3^n}$', '$= \\dfrac{8}{8} = 1$'] }),
            sc(4, 'La **notación científica** usa potencias de 10 para números muy grandes o muy pequeños.', { steps: ['$300\\,000\\,000 = 3 \\times 10^8$', '$0.00042 = 4.2 \\times 10^{-4}$'] }),
          ] },
          ex: [
            mc('$x^3 \\cdot x^5 = \\;?$', ['$x^8$', '$x^{15}$', '$x^2$', '$2x^8$'], 0, 'Misma base: se suman los exponentes, $3 + 5 = 8$.', { hint: 'Escribe los factores: $x^3$ son tres $x$ multiplicadas y $x^5$ son cinco. ¿Cuántas $x$ hay en total?' }),
            mc('$(x^5)^2 = \\;?$', ['$x^{10}$', '$x^7$', '$x^{25}$', '$x^3$'], 0, 'Potencia de potencia: $5 \\cdot 2 = 10$.', { hint: 'Elevar al cuadrado es multiplicar por sí mismo: $x^5 \\cdot x^5$. ¿Cuántas $x$ quedan multiplicadas?' }),
            mc('Escribe sin exponentes negativos: $(2x^3y^{-2})^{-2}$', ['$\\dfrac{y^4}{4x^6}$', '$\\dfrac{4x^6}{y^4}$', '$-4x^6y^4$', '$\\dfrac{y^4}{2x^6}$'], 0, '$2^{-2}x^{-6}y^{4} = \\dfrac{y^4}{4x^6}$.', { hint: 'Primero el exponente de afuera va a cada factor: multiplica cada exponente por $-2$, también el del 2. Luego pasa los exponentes negativos al otro piso de la fracción.' }),
            mc('Simplifica $\\dfrac{2^x \\cdot 4^{x+1}}{8^x}$', ['$4$', '$2^x$', '$8$', '$4^x$'], 0, '$\\dfrac{2^x \\cdot 2^{2x+2}}{2^{3x}} = 2^{x + 2x + 2 - 3x} = 2^2 = 4$.', { hint: 'Escribe todo en base 2: $4 = 2^2$ y $8 = 2^3$. Después suma los exponentes de arriba y resta el de abajo; las $x$ se cancelan.' }),
            num('¿Cuánto es $3.2 \\times 10^4$?', 32000, 'Mueve la coma 4 lugares a la derecha.', { hint: 'Multiplicar por $10^4$ corre la coma cuatro lugares a la derecha; rellena con ceros los lugares vacíos.' }),
            ord('Ordena de menor a mayor', ['$2^{-2}$', '$2^{0}$', '$2^{1}$', '$2^{3}$'], '$\\tfrac14 < 1 < 2 < 8$.', { hint: 'Calcula cada potencia: un exponente negativo da una fracción menor que 1, y cualquier base no nula a la 0 vale 1.' }),
            // --- Parte 2: negativos y simplificación ---
            play('une-parejas', 'Une cada expresión con su forma simplificada', {
              left: ['x⁴ · x⁶', '(x³)⁴', 'x⁷ / x²', '(3x)²', 'x⁻³'],
              right: ['x¹⁰', 'x¹²', 'x⁵', '9x²', '1/x³', 'x²⁴', '3x²'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'Multiplicar suma exponentes ($x^{10}$), potencia de potencia los multiplica ($x^{12}$), dividir los resta ($x^5$), el exponente de un producto va a cada factor ($9x^2$) y el negativo cambia de piso ($\\tfrac{1}{x^3}$). $x^{24}$ y $3x^2$ son las trampas.', { hint: 'Misma base al multiplicar: se suman exponentes; potencia de potencia: se multiplican; al dividir: se restan. En $(3x)^2$ el exponente va al 3 y a la $x$, y un exponente negativo cambia de piso.' }),
            play('ordena-terminos', 'Ordena los pasos para simplificar $(3x^{-2}y^3)^{-2}$', { tex: '(3x^{-2}y^3)^{-2}', chips: ['3⁻²x⁴y⁻⁶', 'x⁴ / (3²y⁶)', 'x⁴ / (9y⁶)', '3⁻²x⁻⁴y⁻⁶', '9x⁴ / y⁶'], order: [0, 1, 2], sep: '=' },
              'Primero el paréntesis: cada exponente se multiplica por $-2$ ($3^{-2}x^{4}y^{-6}$). Luego los negativos cambian de piso: $\\dfrac{x^4}{3^2y^6}$, y $3^2 = 9$. Las fichas $3^{-2}x^{-4}y^{-6}$ (signo mal) y $\\dfrac{9x^4}{y^6}$ (pisos al revés) sobran.', { hint: 'Primero reparte el exponente de afuera: multiplica cada exponente por $-2$, sin olvidar el del 3. Después manda los exponentes negativos al otro piso y calcula la potencia del 3.' }),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿la ley es **verdadera** o **falsa**?', {
              cards: [
                { text: '(a + b)² = a² + b²', truth: false, why: 'El exponente no se reparte en sumas: (1 + 1)² = 4 pero 1 + 1 = 2.' },
                { text: '(ab)ⁿ = aⁿ · bⁿ', truth: true, why: 'El exponente de un producto va a cada factor.' },
                { text: 'aᵐ · bⁿ = (ab)ᵐ⁺ⁿ', truth: false, why: 'Solo se suman exponentes con la misma base.' },
                { text: '(aᵐ)ⁿ = aᵐⁿ', truth: true, why: 'Potencia de potencia: se multiplican.' },
                { text: '2ˣ · 2ˣ = 4ˣ', truth: true, why: '2ˣ · 2ˣ = 2²ˣ = (2²)ˣ = 4ˣ.' },
                { text: 'a⁻ⁿ = −aⁿ', truth: false, why: 'a⁻ⁿ = 1/aⁿ: una fracción, no un negativo.' },
              ],
            }, 'Las leyes valen para productos, cocientes y potencias, nunca para sumas: $(a + b)^n \\ne a^n + b^n$. Y solo se suman exponentes cuando la base es la misma.', { hint: 'Las leyes valen para productos, cocientes y potencias, nunca para sumas. Si dudas, prueba la igualdad con números pequeños, como $a = 1$, $b = 1$ o $x = 2$.' }),
            mc('Simplifica $\\dfrac{(x^{-2}y^3)^{-3}}{(y^4x^{-5})^{-2}}$', ['$\\dfrac{1}{x^4y}$', '$x^4y$', '$x^{16}y^{-17}$', '$\\dfrac{y}{x^4}$'], 0, 'Arriba: $x^{6}y^{-9}$; abajo: $y^{-8}x^{10}$. Dividiendo: $x^{6 - 10}\\,y^{-9 + 8} = x^{-4}y^{-1} = \\dfrac{1}{x^4y}$.', { hint: 'Primero los paréntesis: multiplica los exponentes de adentro por el de afuera, arriba y abajo. Luego, para cada letra, resta el exponente de abajo al de arriba.' }),
            mc('Simplifica $\\dfrac{2^{n+1}}{(2^{n-1})^{n}} \\div \\dfrac{4^{n+1}}{(2^{n-1})^{n+1}}$', ['$\\tfrac14$', '$\\tfrac12$', '$1$', '$2$'], 0, 'Dividir es multiplicar por el recíproco: $\\dfrac{2^{n+1}}{2^{n(n-1)}} \\cdot \\dfrac{2^{(n-1)(n+1)}}{2^{2n+2}}$. Los exponentes: $(n + 1) - n(n - 1) + (n - 1)(n + 1) - (2n + 2) = n + 1 - n^2 + n + n^2 - 1 - 2n - 2 = -2$. Queda $2^{-2} = \\tfrac14$. Compruébalo con $n = 1$: $\\tfrac{4}{1} \\div \\tfrac{16}{1} = \\tfrac14$.', { hint: 'Pasa todo a base 2 ($4 = 2^2$) y cambia la división por una multiplicación por el recíproco. Al sumar y restar exponentes, los términos con $n^2$ se cancelan. Si te enredas, prueba con $n = 1$.' }),
            mc('Simplifica $\\dfrac{3^{p+1}}{(3^{p})^{p-1}} \\div \\dfrac{9^{p+1}}{(3^{p-1})^{p+1}}$', ['$\\tfrac19$', '$\\tfrac13$', '$1$', '$3$'], 0, 'Con $9 = 3^2$ todo queda en base 3: exponentes $(p + 1) - p(p - 1) + (p - 1)(p + 1) - 2(p + 1) = p + 1 - p^2 + p + p^2 - 1 - 2p - 2 = -2$. Resultado $3^{-2} = \\tfrac19$.', { hint: 'Igual que con base 2: escribe $9 = 3^2$, divide multiplicando por el recíproco y suma los exponentes. También puedes probar con $p = 1$ y comparar con las opciones.' }),
          ],
        },
        {
          id: 'alg-22a', title: 'Raíces y exponentes racionales',
          // Clase 10 (video/clase_raices): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration). Libro UdeA §1.5.
          clip: { scenes: [
            sc(5, 'La raíz $n$-ésima deshace la potencia: $\\sqrt[n]{a} = b$ significa $b^n = a$.', { steps: ['$\\sqrt{49} = 7$', '$\\sqrt[3]{-8} = -2$', '$\\sqrt{-4}$ no es un número real'] }),
            sc(5, 'Un exponente fraccionario es una raíz: el denominador es el índice.', { title: '$a^{m/n} = \\sqrt[n]{a^m} = \\left(\\sqrt[n]{a}\\right)^m$', steps: ['$8^{2/3} = \\left(\\sqrt[3]{8}\\right)^2 = 2^2 = 4$'] }),
            sc(5, 'Ojo: la raíz cuadrada de un cuadrado es el **valor absoluto**.', { title: '$\\sqrt{x^2} = |x|$', viz: { type: 'graph', xr: [-4, 4], yr: [-1, 4.5], f: x => Math.abs(x), draw: true } }),
            sc(4, 'Y la raíz **no** se reparte en una suma:', { steps: ['$\\sqrt{9 + 16} = \\sqrt{25} = 5$', '$\\sqrt{9} + \\sqrt{16} = 7$', '$\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}$'] }),
          ] },
          ex: [
            num('Calcula $27^{2/3}$', 9, '$\\left(\\sqrt[3]{27}\\right)^2 = 3^2 = 9$.', { hint: 'El denominador del exponente es el índice de la raíz y el numerador es la potencia: primero saca la raíz cúbica de 27 y después eleva al cuadrado.' }),
            num('Calcula $\\left(\\dfrac{27}{125}\\right)^{-1/3}$ (puedes escribir una fracción)', 5 / 3, 'Invierte y saca raíz cúbica: $\\left(\\tfrac{125}{27}\\right)^{1/3} = \\tfrac{5}{3}$.', { hint: 'El exponente negativo voltea la fracción y el $\\tfrac13$ pide raíz cúbica. Busca qué número al cubo da 27 y cuál da 125; puedes responder con una fracción.', tol: 0.01, answerText: '$\\tfrac{5}{3}$' }),
            mc('$\\sqrt{x^2} = \\;?$', ['$|x|$', '$x$', '$-x$', '$\\pm x$'], 0, 'Si $x = -3$: $\\sqrt{9} = 3 = |-3|$.', { hint: 'Prueba con un número negativo, por ejemplo $x = -3$: calcula $(-3)^2$ y luego su raíz. ¿Volviste al −3?' }),
            mc('¿Es cierto que $\\sqrt{a + b} = \\sqrt{a} + \\sqrt{b}$?', ['No, en general es falso', 'Sí, siempre', 'Solo si $a$ y $b$ son negativos', 'Solo para raíces cúbicas'], 0, 'Contraejemplo: $\\sqrt{9 + 16} = 5$ pero $3 + 4 = 7$.', { hint: 'Prueba con números que tengan raíz exacta, como $a = 36$ y $b = 64$, y compara los dos lados.' }),
            play('lado-del-cuadrado', 'Estira el cuadrado hasta que su área sea la pedida: su lado es la raíz cuadrada', { rounds: [{ area: 36 }, { area: 12.25 }, { area: 3 }], max: 10, step: 0.05, tol: 0.05 },
              'La raíz cuadrada es el lado del cuadrado con esa área: $\\sqrt{36} = 6$, $\\sqrt{12.25} = 3.5$ y $\\sqrt{3} \\approx 1.73$, un número que no termina ni se repite pero es un lado perfectamente real.', { hint: 'El área de un cuadrado es lado por lado. Busca un número que multiplicado por sí mismo dé el área pedida; si no es exacto, ajusta fino con − y +.' }),
            play('une-parejas', 'Une cada potencia de exponente fraccionario con su valor', {
              left: ['27^(1/3)', '32^(3/5)', '49^(−1/2)', '(−8)^(1/3)', '9^(3/2)'],
              right: ['3', '8', '1/7', '−2', '27', '1/49', '6'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'El denominador es el índice y el numerador la potencia: $\\sqrt[3]{27} = 3$, $(\\sqrt[5]{32})^3 = 2^3 = 8$, $49^{-1/2} = \\tfrac{1}{\\sqrt{49}} = \\tfrac17$, $\\sqrt[3]{-8} = -2$ y $(\\sqrt9)^3 = 27$.', { hint: 'En $a^{m/n}$ el denominador $n$ es el índice de la raíz y el numerador $m$ la potencia: saca primero la raíz y después eleva. Un exponente negativo pone el resultado en el denominador.' }),
            play('clasifica-cartas', 'Desliza cada raíz: ¿es un **número real** o **no**?', {
              left: 'No es real', right: 'Es real',
              cards: [
                { text: '√(−4)', side: 'left', why: 'Índice par con radicando negativo: ningún real al cuadrado da −4.' },
                { text: '∛(−8)', side: 'right', why: 'Índice impar: (−2)³ = −8, así que vale −2.' },
                { text: '√0', side: 'right', why: '0² = 0: vale 0.' },
                { text: '(−16)^(1/4)', side: 'left', why: 'Es la raíz cuarta de −16: índice par, radicando negativo.' },
                { text: '(−32)^(1/5)', side: 'right', why: 'Raíz quinta de −32: (−2)⁵ = −32, vale −2.' },
                { text: '√((−3)²)', side: 'right', why: '(−3)² = 9 y √9 = 3: el radicando ya es positivo.' },
              ],
            }, 'Con índice impar siempre hay raíz real, aun de negativos. Con índice par el radicando debe ser $\\ge 0$; ojo que $(-3)^2 = 9$ es positivo, así que $\\sqrt{(-3)^2} = 3 = |-3|$.', { hint: 'Mira el índice: si es impar, siempre hay raíz real, aun de un negativo. Si es par, lo de adentro no puede ser negativo. Calcula primero lo que haya dentro del radical.' }),
            mc('¿Qué valor de $x$ satisface $\\sqrt{x} = 4$?', ['$x = 16$', '$x = 2$', '$x = 8$', '$x = 64$'], 0, 'La raíz deshace el cuadrado: $x = 4^2 = 16$. Comprueba: $\\sqrt{16} = 4$.', { hint: 'La raíz deshace el cuadrado, y el cuadrado deshace la raíz: eleva los dos lados al cuadrado.' }),
            mc('¿Cuál es el valor de $\\sqrt[3]{-64}$?', ['$-4$', '$4$', '$-8$', 'No es real'], 0, 'Índice impar: $(-4)^3 = -64$. Las raíces cúbicas de negativos sí existen.', { hint: '¿Qué número multiplicado por sí mismo tres veces da 64? Con índice impar, el signo negativo se conserva.' }),
            num('Si $x = \\sqrt{36}$, ¿cuánto vale $x^2$?', 36, '$x = 6$ y $6^2 = 36$: elevar al cuadrado deshace la raíz.', { hint: 'No hace falta calcular la raíz: elevar al cuadrado deshace la raíz cuadrada.' }),
            mc('$\\sqrt{a^2}$ con $a = -7$ vale', ['$7$', '$-7$', '$49$', '$-49$'], 0, '$(-7)^2 = 49$ y $\\sqrt{49} = 7 = |-7|$: la raíz cuadrada nunca es negativa.', { hint: 'Primero eleva al cuadrado (el resultado es positivo) y después saca la raíz. La raíz cuadrada nunca da un resultado negativo.' }),
          ],
        },
        {
          id: 'alg-22b', title: 'Simplificar y racionalizar',
          // Clase 11 (video/clase_radicales): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration). Libro UdeA §1.5.
          clip: { scenes: [
            sc(5, 'Para simplificar un radical, extrae los factores que son potencias exactas.', { steps: ['$\\sqrt{50} = \\sqrt{25 \\cdot 2}$', '$= 5\\sqrt{2}$'] }),
            sc(5, 'Solo se suman radicales **semejantes** (mismo índice y mismo radicando).', { steps: ['$3\\sqrt2 + 5\\sqrt2 = 8\\sqrt2$', '$\\sqrt2 + \\sqrt3$ no se simplifica'] }),
            sc(6, '**Racionalizar** es quitar la raíz del denominador. Con un binomio, multiplica por el **conjugado**.', { steps: ['$\\dfrac{9}{4 + \\sqrt5} \\cdot \\dfrac{4 - \\sqrt5}{4 - \\sqrt5}$', '$= \\dfrac{9(4 - \\sqrt5)}{16 - 5}$', '$= \\dfrac{9(4 - \\sqrt5)}{11}$'] }),
          ] },
          ex: [
            num('Si $\\sqrt{32} = k\\sqrt{2}$, ¿cuánto vale $k$?', 4, '$\\sqrt{32} = \\sqrt{16 \\cdot 2} = 4\\sqrt2$.', { hint: 'Busca el cuadrado perfecto más grande que divide a 32 y sepáralo: $\\sqrt{32} = \\sqrt{\\square \\cdot 2}$. Su raíz sale afuera.', prefix: '$k =$' }),
            mc('Simplifica $\\sqrt{48} + 2\\sqrt{27} - \\sqrt{12}$', ['$8\\sqrt3$', '$10\\sqrt3$', '$\\sqrt{63}$', '$12\\sqrt3$'], 0, '$4\\sqrt3 + 6\\sqrt3 - 2\\sqrt3 = 8\\sqrt3$.', { hint: 'Simplifica cada radical por separado sacando el cuadrado perfecto que tiene adentro (todos esconden un $\\sqrt3$). Luego suma los coeficientes, como si $\\sqrt3$ fuera una $x$.' }),
            mc('Racionaliza $\\dfrac{6}{\\sqrt5 - \\sqrt2}$', ['$2(\\sqrt5 + \\sqrt2)$', '$6(\\sqrt5 + \\sqrt2)$', '$2(\\sqrt5 - \\sqrt2)$', '$\\dfrac{6}{3}$'], 0, 'Multiplica por el conjugado: el denominador queda $5 - 2 = 3$.', { hint: 'Multiplica arriba y abajo por el conjugado: la misma resta con el signo cambiado. Abajo, suma por diferencia borra las raíces.' }),
            ord('Ordena los pasos para racionalizar $\\dfrac{1}{\\sqrt7}$', ['$\\dfrac{1}{\\sqrt7}$', '$\\dfrac{1}{\\sqrt7} \\cdot \\dfrac{\\sqrt7}{\\sqrt7}$', '$\\dfrac{\\sqrt7}{7}$'], 'Multiplica arriba y abajo por $\\sqrt7$: abajo queda $7$.', { hint: 'Para quitar una raíz sola del denominador, multiplica arriba y abajo por esa misma raíz: $\\sqrt7 \\cdot \\sqrt7$ da un número sin raíz.' }),
            play('saca-del-radical', 'Saca del radical las parejas (o tríos) de primos iguales', { rounds: [{ index: 2, n: 98 }, { index: 2, n: 75 }, { index: 3, n: 250 }] },
              'Cada pareja de primos iguales sale de la raíz cuadrada como un solo factor: $\\sqrt{98} = \\sqrt{2 \\cdot 7 \\cdot 7} = 7\\sqrt2$ y $\\sqrt{75} = \\sqrt{3 \\cdot 5 \\cdot 5} = 5\\sqrt3$. En la raíz cúbica salen los tríos: $\\sqrt[3]{250} = \\sqrt[3]{2 \\cdot 5^3} = 5\\sqrt[3]{2}$.', { hint: 'Las fichas ya son los factores primos. En raíz cuadrada sale un factor por cada pareja igual; en raíz cúbica, uno por cada trío.' }),
            play('une-parejas', 'Une cada fracción con su forma racionalizada', {
              left: ['1/√3', '4/√2', '5/(1 + √2)', '2/(3 − √5)'],
              right: ['√3 / 3', '2√2', '5(√2 − 1)', '(3 + √5) / 2', '5(√2 + 1)', '(3 − √5) / 2'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'Con un radical solo se multiplica por él: $\\tfrac{1}{\\sqrt3} = \\tfrac{\\sqrt3}{3}$ y $\\tfrac{4}{\\sqrt2} = \\tfrac{4\\sqrt2}{2} = 2\\sqrt2$. Con un binomio, por el conjugado: $\\tfrac{5(\\sqrt2 - 1)}{2 - 1} = 5(\\sqrt2 - 1)$ y $\\tfrac{2(3 + \\sqrt5)}{9 - 5} = \\tfrac{3 + \\sqrt5}{2}$. Las dos fichas sobrantes tienen el conjugado al revés.', { hint: 'Si abajo hay una raíz sola, multiplica por ella. Si hay una suma o resta con raíz, multiplica por el conjugado (signo cambiado) y usa $(a + b)(a - b) = a^2 - b^2$.' }),
            play('ordena-terminos', 'Ordena los pasos para racionalizar $\\dfrac{6}{3 + \\sqrt7}$', { tex: '\\dfrac{6}{3 + \\sqrt7}', chips: ['6(3−√7)/(3²−(√7)²)', '6(3−√7)/2', '3(3−√7)', '6(3+√7)/(3²+(√7)²)', '6(3+√7)/2'], order: [0, 1, 2], sep: '=' },
              'Se multiplica arriba y abajo por el conjugado $3 - \\sqrt7$; abajo, suma por diferencia: $3^2 - (\\sqrt7)^2 = 9 - 7 = 2$, y $\\tfrac{6}{2} = 3$. Las fichas con $3 + \\sqrt7$ arriba o con $+$ abajo son las trampas.', { hint: 'El conjugado de $3 + \\sqrt7$ tiene el signo del medio cambiado. Abajo queda $3^2 - (\\sqrt7)^2$; después simplifica el 6 de arriba con lo que dé abajo.' }),
            mc('¿Cuál es el resultado de racionalizar el denominador de $\\dfrac{3}{\\sqrt5}$?', ['$\\dfrac{3\\sqrt5}{5}$', '$\\dfrac{5\\sqrt3}{5}$', '$\\dfrac{\\sqrt{15}}{5}$', '$\\dfrac{3}{5\\sqrt5}$'], 0, 'Se multiplica por $\\tfrac{\\sqrt5}{\\sqrt5}$: $\\dfrac{3\\sqrt5}{5}$.', { hint: 'Multiplica arriba y abajo por $\\sqrt5$: abajo queda $\\sqrt5 \\cdot \\sqrt5$, un número sin raíz.' }),
            mc('Racionaliza el denominador de $\\dfrac{5}{2\\sqrt3}$', ['$\\dfrac{5\\sqrt3}{6}$', '$\\dfrac{2\\sqrt3}{5}$', '$\\dfrac{10\\sqrt3}{3}$', '$\\dfrac{\\sqrt{15}}{6}$'], 0, '$\\dfrac{5}{2\\sqrt3} \\cdot \\dfrac{\\sqrt3}{\\sqrt3} = \\dfrac{5\\sqrt3}{2 \\cdot 3} = \\dfrac{5\\sqrt3}{6}$.', { hint: 'Solo hay que quitar la raíz: multiplica arriba y abajo por $\\sqrt3$ (no por todo el denominador). El 2 de abajo se queda y se multiplica por lo que salga.' }),
            mc('Al simplificar y racionalizar $\\dfrac{5}{\\sqrt{x + 5} - \\sqrt{x}}$ se obtiene', ['$\\sqrt{x + 5} + \\sqrt{x}$', '$5$', '$x$', '$\\dfrac{\\sqrt{x + 5} + \\sqrt{x}}{5}$'], 0, 'Por el conjugado: abajo queda $(x + 5) - x = 5$, que se cancela con el 5 de arriba.', { hint: 'Multiplica por el conjugado. Abajo, $(\\sqrt{x + 5})^2 - (\\sqrt{x})^2$ deja solo un número: compáralo con el 5 de arriba.' }),
            mc('¿Cuál es el resultado de racionalizar $\\dfrac{1}{\\sqrt[3]{3} - \\sqrt[3]{2}}$?', ['$\\sqrt[3]{9} + \\sqrt[3]{6} + \\sqrt[3]{4}$', '$\\sqrt[3]{19}$', '$19$', '$\\sqrt[3]{9} - \\sqrt[3]{6} + \\sqrt[3]{4}$'], 0, 'Diferencia de cubos: se multiplica por $\\sqrt[3]{9} + \\sqrt[3]{6} + \\sqrt[3]{4}$ y abajo queda $3 - 2 = 1$.', { hint: 'Con raíces cúbicas el conjugado no basta: usa la diferencia de cubos $(a - b)(a^2 + ab + b^2) = a^3 - b^3$ con $a = \\sqrt[3]{3}$ y $b = \\sqrt[3]{2}$.' }),
            mc('¿Cuál es el valor de $\\sqrt{63}$ simplificado?', ['$3\\sqrt7$', '$9\\sqrt7$', '$7\\sqrt3$', '$21\\sqrt3$'], 0, '$63 = 9 \\cdot 7$ y $\\sqrt{9} = 3$.', { hint: 'Busca un cuadrado perfecto que divida a 63 (prueba con 4, 9, 16…) y saca su raíz afuera del radical.' }),
          ],
        },
      ],
    },
    {
      world: 'progresiones', title: 'Progresiones y sumatoria',
      lessons: [
        {
          id: 'alg-14', title: 'Progresiones aritméticas y geométricas',
          // Clase 5 (video/clase_progresiones): Parte 1 aritméticas, Parte 2 geométricas tras el quinto ejercicio.
          // Escenas de respaldo hasta enlazar los videos de Bunny (bunny + duration).
          clip: { scenes: [
            sc(6, 'Una **sucesión** es una lista ordenada; si hay patrón, el **término general** da el término del puesto $n$.', { title: '$a_n = 3n - 1$', steps: ['$2, 5, 8, 11, \\dots$', '$a_{50} = 3 \\cdot 50 - 1 = 149$'] }),
            sc(6, 'En una progresión **aritmética** se suma siempre la misma diferencia $d$.', { title: '$a_n = a_1 + (n - 1)d$', viz: { type: 'graph', xr: [0, 7], yr: [0, 32], f: () => NaN, points: [[1, 4, '4'], [2, 9, '9'], [3, 14, '14'], [4, 19, '19'], [5, 24, '24'], [6, 29, '29']] } }),
            sc(6, 'Gauss sumó del 1 al 100 emparejando extremos: cada pareja suma lo mismo.', { title: '$S_n = \\dfrac{n}{2}(a_1 + a_n)$', steps: ['$1 + 100 = 2 + 99 = \\dots = 101$', '$S_{100} = 50 \\cdot 101 = 5050$', '$2 + 5 + \\dots + 59$: $n = 20$, $S = 610$'] }),
          ] },
          more: [{ after: 5, scenes: [
            sc(6, 'En una progresión **geométrica** se multiplica siempre por la misma razón $r$.', { title: '$a_n = a_1 r^{n-1}$', viz: { type: 'graph', xr: [0, 6], yr: [0, 170], f: () => NaN, points: [[1, 2, '2'], [2, 6, '6'], [3, 18, '18'], [4, 54, '54'], [5, 162, '162']] } }),
            sc(6, 'La suma de los primeros $n$ términos tiene fórmula.', { title: '$S_n = a_1 \\dfrac{r^n - 1}{r - 1}$', steps: ['$3 + 6 + 12 + \\dots + 384$: $n = 8$', '$S_8 = 3 \\cdot 255 = 765$'] }),
            sc(6, 'Si $|r| < 1$, la suma infinita converge:', { title: '$S_\\infty = \\dfrac{a_1}{1 - r}$', steps: ['$8 + 4 + 2 + 1 + \\cdots = \\dfrac{8}{1 - \\frac12} = 16$'] }),
          ] }],
          ex: [
            // --- Parte 1: aritméticas ---
            play('clasifica-cartas', 'Desliza cada sucesión: ¿**aritmética** o **geométrica**?', {
              left: 'Aritmética', right: 'Geométrica',
              cards: [
                { text: '7, 10, 13, 16, …', side: 'left', why: 'Suma siempre 3.' },
                { text: '5, 10, 20, 40, …', side: 'right', why: 'Multiplica siempre por 2.' },
                { text: '100, 90, 80, 70, …', side: 'left', why: 'Suma siempre −10.' },
                { text: '81, 27, 9, 3, …', side: 'right', why: 'Multiplica siempre por 1/3.' },
                { text: '1.5, 3, 4.5, 6, …', side: 'left', why: 'Suma siempre 1.5 (aunque 1.5 → 3 parezca doblar, 3 → 4.5 no).' },
                { text: '1, −2, 4, −8, …', side: 'right', why: 'Multiplica siempre por −2: los signos se alternan.' },
              ],
            }, 'Aritmética: la **diferencia** entre términos consecutivos es constante ($10 - 7 = 13 - 10 = 3$). Geométrica: el **cociente** es constante ($10 / 5 = 20 / 10 = 2$). Mira siempre dos saltos, no uno.'),
            play('escalera-aritmetica', 'Ajusta la escalera para que el décimo peldaño mida 42', { a1: 6, n: 10, target: 42, step: 1, max: 10 },
              'El peldaño $n$ mide $a_n = a_1 + (n - 1)d$. Con $a_1 = 6$ y $n = 10$: $6 + 9d = 42$, así que $9d = 36$ y $d = 4$.'),
            play('parejas-gauss', 'Une las parejas de Gauss y descubre cuánto suma la progresión', { terms: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43] },
              'Extremos emparejados: $3 + 43 = 7 + 39 = \\dots = 46$. Son 5 parejas de 46 más el 23 del centro: $5 \\cdot 46 + 23 = 253$, igual que $S_{11} = \\dfrac{11 (3 + 43)}{2} = 253$.'),
            play('rellena-medios', 'Rellena los tres medios aritméticos entre 10 y 26', { first: 10, last: 26, k: 3, kind: 'aritmetica', chips: [13, 14, 18, 20, 22, 24] },
              'Con 3 medios hay 5 términos: $26 = 10 + 4d$, así que $d = 4$ y los medios son $14, 18, 22$.'),
            play('suma-filas', 'Añade filas al teatro hasta tener exactamente 170 sillas', { first: 8, d: 2, target: 170, max: 14, item: 'sillas' },
              'Las sillas por fila son $8, 10, 12, \\dots$ y el total es $S_n = \\dfrac{n(2 \\cdot 8 + (n - 1) 2)}{2} = n(n + 7)$. Con $n = 10$: $10 \\cdot 17 = 170$.'),
            // --- Parte 2: geométricas ---
            play('rellena-medios', 'Rellena los tres medios geométricos entre 5 y 405', { first: 5, last: 405, k: 3, kind: 'geometrica', chips: [15, 25, 45, 90, 135, 225] },
              'Con 3 medios hay 5 términos: $405 = 5 r^4$, así que $r^4 = 81$ y $r = 3$: los medios son $15, 45, 135$.'),
            play('limite-serie', 'Suma términos y lleva el marcador al valor al que se acerca 9 + 3 + 1 + …', { a1: 9, r: 1 / 3, rTex: '\\tfrac13', max: 20, step: 0.5, tol: 0.26 },
              'La razón es $\\tfrac13$, menor que 1, así que la suma converge: $S_\\infty = \\dfrac{a_1}{1 - r} = \\dfrac{9}{1 - \\frac13} = \\dfrac{9}{2/3} = 13.5$. Las sumas parciales $9, 12, 13, 13.33, \\dots$ se acercan sin pasarse.'),
            play('clasifica-cartas', 'Desliza cada serie: ¿la suma infinita **converge** o **diverge**?', {
              left: 'Converge', right: 'Diverge',
              cards: [
                { text: '1 + 1/2 + 1/4 + 1/8 + …', side: 'left', why: 'r = 1/2: suma 2.' },
                { text: '2 + 4 + 8 + 16 + …', side: 'right', why: 'r = 2: los términos crecen sin parar.' },
                { text: '10 − 5 + 2.5 − 1.25 + …', side: 'left', why: 'r = −1/2, |r| < 1: suma 10 / 1.5 = 6.67.' },
                { text: '0.9 + 0.81 + 0.729 + …', side: 'left', why: 'r = 0.9: suma 0.9 / 0.1 = 9.' },
                { text: '1 − 1 + 1 − 1 + …', side: 'right', why: 'r = −1: la suma salta entre 1 y 0, no se estabiliza.' },
                { text: '100 + 100 + 100 + …', side: 'right', why: 'r = 1: la suma crece sin límite.' },
              ],
            }, 'Una serie geométrica converge solo si $|r| < 1$: entonces $S_\\infty = \\dfrac{a_1}{1 - r}$. Con $|r| \\ge 1$ los términos no se hacen pequeños y la suma no se estabiliza.'),
            play('torre-producto', 'Duplica las bacterias hora a hora hasta llegar exactamente a 6.400', { kind: 'ratio', start: 50, r: 2, target: 6400, max: 10, unit: 'bacterias', period: 'hora' },
              'Es una progresión geométrica con $a_1 = 50$ y $r = 2$: tras $n$ horas hay $50 \\cdot 2^n$. Como $6\\,400 / 50 = 128 = 2^7$, son 7 horas.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'En una progresión aritmética la diferencia entre términos consecutivos es constante', truth: true, why: 'Esa es la definición: d fija.' },
                { text: 'En una progresión geométrica se suma siempre lo mismo', truth: false, why: 'Se multiplica siempre por lo mismo (la razón r).' },
                { text: 'Si |r| < 1, la suma infinita de una geométrica existe', truth: true, why: 'Converge a a₁ / (1 − r).' },
                { text: 'La sucesión 3, 6, 12, 24 tiene razón 3', truth: false, why: '6 / 3 = 2: la razón es 2 (3 es la diferencia del primer salto, no la razón).' },
                { text: 'La suma de los primeros n impares es n²', truth: true, why: '1 + 3 + 5 + … + (2n − 1) = n(1 + 2n − 1)/2 = n².' },
              ],
            }, 'Aritmética: $a_n = a_1 + (n - 1)d$ y $S_n = \\dfrac{n(a_1 + a_n)}{2}$. Geométrica: $a_n = a_1 r^{n-1}$, $S_n = a_1 \\dfrac{r^n - 1}{r - 1}$ y, si $|r| < 1$, $S_\\infty = \\dfrac{a_1}{1 - r}$.'),
          ],
        },
        {
          id: 'alg-15', title: 'Sumatoria y productoria',
          // Clase 6 (video/clase_sumatoria): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(6, 'La letra griega $\\Sigma$ abrevia sumas largas: índice, límites y término general.', { title: '$\\displaystyle\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n$', steps: ['$\\displaystyle\\sum_{k=1}^{5} 2k = 2 + 4 + 6 + 8 + 10 = 30$'] }),
            sc(6, 'Es **lineal**: las constantes salen y las sumas se separan. Y hay sumas notables.', { steps: ['$\\displaystyle\\sum (c\\,a_k + b_k) = c\\sum a_k + \\sum b_k \\qquad \\sum_{k=1}^{n} c = nc$', '$\\displaystyle\\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2} \\qquad \\sum_{k=1}^{n} k^2 = \\dfrac{n(n + 1)(2n + 1)}{6}$'] }),
            sc(6, '$\\Pi$ abrevia productos. El más famoso es el **factorial**.', { title: '$\\displaystyle\\prod_{k=1}^{n} k = n!$', steps: ['$\\displaystyle\\prod_{k=1}^{4} 2k = 2 \\cdot 4 \\cdot 6 \\cdot 8 = 384$', '$4! = 24 \\quad 5! = 120 \\quad 6! = 720$'] }),
          ] },
          ex: [
            play('arma-sigma', 'Arma la sigma de cada suma con las fichas', {
              rounds: [
                { text: '3 + 6 + 9 + … + 30', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '10', cell: 'upper' }, { label: '3k', cell: 'term' }, { label: 'k = 0', cell: null }, { label: '30', cell: null }, { label: 'k + 3', cell: null }] },
                { text: '5 + 7 + 9 + … + 21', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '9', cell: 'upper' }, { label: '2k + 3', cell: 'term' }, { label: '21', cell: null }, { label: '2k + 1', cell: null }] },
                { text: '1 + 4 + 9 + … + 64', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '8', cell: 'upper' }, { label: 'k²', cell: 'term' }, { label: '64', cell: null }, { label: '2k', cell: null }] },
              ],
            }, 'El límite superior es el **número de términos**, no el último valor: $3 + 6 + \\cdots + 30$ tiene 10 términos, $\\sum_{k=1}^{10} 3k$ (desde $k = 0$ se colaría un término $0$ y serían 11). En $5 + 7 + \\cdots + 21$ el término es $2k + 3$ (con $k = 1$ da 5) y hay 9 términos. Los cuadrados $1, 4, \\dots, 64 = 8^2$ son $\\sum_{k=1}^{8} k^2$.'),
            play('ordena-terminos', 'Despliega la sigma: pon los términos en orden', { tex: '\\sum_{k=2}^{5} (k^2 - 1)', chips: ['3', '8', '15', '24', '0', '35'], order: [0, 1, 2, 3], result: '50' },
              'El índice empieza en $k = 2$, no en 1: los términos son $2^2 - 1 = 3$, $3^2 - 1 = 8$, $4^2 - 1 = 15$ y $5^2 - 1 = 24$. La suma es $3 + 8 + 15 + 24 = 50$; el 0 ($k = 1$) y el 35 ($k = 6$) quedan fuera.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Σ (aₖ + bₖ) = Σ aₖ + Σ bₖ', truth: true, why: 'La suma de sumas se separa: la sigma es lineal.' },
                { text: 'Σ (aₖ · bₖ) = Σ aₖ · Σ bₖ', truth: false, why: 'Un producto no se separa: (1·1 + 2·2) = 5, pero (1 + 2)(1 + 2) = 9.' },
                { text: 'Σ desde k = 1 hasta n de una constante c vale n · c', truth: true, why: 'Se suma c n veces.' },
                { text: 'Σ c · aₖ = c · Σ aₖ', truth: true, why: 'La constante sale de la suma.' },
                { text: 'Σ desde k = 1 hasta n de k vale n(n + 1)', truth: false, why: 'Falta dividir entre 2: n(n + 1)/2 (con n = 3: 6, no 12).' },
              ],
            }, 'La sigma es lineal: $\\sum (c\\,a_k + b_k) = c \\sum a_k + \\sum b_k$ y $\\sum_{k=1}^{n} c = nc$, pero $\\sum a_k b_k \\ne \\sum a_k \\sum b_k$. La suma de Gauss es $\\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2}$.'),
            play('suma-filas', 'Apila filas de puntos (1, 2, 3, …) hasta tener exactamente 78', { first: 1, d: 1, target: 78, max: 15, item: 'puntos' },
              'Las filas suman $1 + 2 + \\cdots + n = \\dfrac{n(n + 1)}{2}$. Con $n = 12$: $\\dfrac{12 \\cdot 13}{2} = 78$. Es la suma de Gauss hecha pirámide.'),
            play('ordena-terminos', 'Arma la cadena telescópica en orden y mira qué se cancela', { tex: '\\sum_{k=1}^{5} \\left(\\dfrac{1}{k} - \\dfrac{1}{k + 1}\\right)', chips: ['1 − 1/2', '1/2 − 1/3', '1/3 − 1/4', '1/4 − 1/5', '1/5 − 1/6', '1/2 − 1/4', '1/6 − 1/7'], order: [0, 1, 2, 3, 4], result: '5/6' },
              'Al poner las restas en fila, cada $-\\tfrac1{k+1}$ se cancela con el $+\\tfrac1{k+1}$ del siguiente término: solo quedan el primero y el último, $1 - \\tfrac16 = \\tfrac56$. Las fichas $\\tfrac12 - \\tfrac14$ y $\\tfrac16 - \\tfrac17$ no pertenecen a la cadena.'),
            play('torre-producto', 'Multiplica 1 · 2 · 3 · … hasta llegar exactamente a 5.040', { kind: 'factorial', target: 5040, max: 9, unit: '', period: 'paso' },
              'El factorial multiplica los enteros desde 1: $7! = 1 \\cdot 2 \\cdot 3 \\cdot 4 \\cdot 5 \\cdot 6 \\cdot 7 = 5\\,040$. Cada paso es el anterior por el siguiente número: $6! = 720$ y $7 \\cdot 720 = 5\\,040$.'),
            play('clasifica-cartas', 'Desliza cada expresión: ¿la abrevia una **suma** (Σ) o un **producto** (Π)?', {
              left: 'Suma Σ', right: 'Producto Π',
              cards: [
                { text: '1 + 1/2 + 1/3 + … + 1/10', side: 'left', why: 'Se suman los términos 1/k.' },
                { text: '1 · 3 · 5 · 7 · 9', side: 'right', why: 'Se multiplican los impares: Π (2k − 1).' },
                { text: '5!', side: 'right', why: '5! = 1 · 2 · 3 · 4 · 5 es un producto.' },
                { text: '3 + 3 + 3 + 3 + 3', side: 'left', why: 'Una constante sumada 5 veces: Σ 3 = 15.' },
                { text: '2 · 2 · 2 · 2', side: 'right', why: 'Una constante multiplicada 4 veces: Π 2 = 2⁴.' },
                { text: '1 + 2 + 3 + … + n', side: 'left', why: 'Es la suma de Gauss: Σ k = n(n + 1)/2.' },
              ],
            }, '$\\Sigma$ abrevia una suma de términos y $\\Pi$ un producto: $\\sum_{k=1}^{5} 3 = 15$ pero $\\prod_{k=1}^{4} 2 = 2^4$; $5! = \\prod_{k=1}^{5} k$; y $\\dfrac{n(n + 1)}{2}$ es el valor de la suma $\\sum_{k=1}^{n} k$.'),
          ],
        },
      ],
    },
    {
      world: 'polinomios', title: 'Polinomios: productos notables y factorización',
      lessons: [
        {
          id: 'alg-23a', title: 'Grado y operaciones',
          clip: { scenes: [
            sc(5, 'Un **polinomio** es una suma de términos $a_k x^k$. El **grado** es el mayor exponente.', { title: '$P(x) = 3x^3 - 2x + 5$', steps: ['grado 3', 'coeficiente principal 3', 'término independiente 5'] }),
            sc(5, 'Para sumar o restar, agrupa los términos semejantes.', { steps: ['$(3x^3 - 2x + 5) - 2(x^2 - 4x + 1)$', '$= 3x^3 - 2x^2 - 2x + 8x + 5 - 2$', '$= 3x^3 - 2x^2 + 6x + 3$'] }),
            sc(5, 'Al multiplicar, los grados **se suman**.', { title: '$\\operatorname{gr}(PQ) = \\operatorname{gr}P + \\operatorname{gr}Q$', steps: ['$(x + 2)(x^2 - 1) = x^3 + 2x^2 - x - 2$'] }),
          ] },
          ex: [
            num('Grado de $P(x) = 4x^5 - 2x^3 + 7$', 5, 'El mayor exponente es 5.'),
            mc('Si $P = 3x^3 - 2x + 5$ y $Q = x^2 - 4x + 1$, ¿cuánto es $P - 2Q$?', ['$3x^3 - 2x^2 + 6x + 3$', '$3x^3 - 2x^2 - 10x + 7$', '$3x^3 + 2x^2 + 6x + 3$', '$x^3 - 2x^2 + 6x + 3$'], 0, '$-2Q = -2x^2 + 8x - 2$; suma término a término.'),
            num('Si $\\operatorname{gr}P = 3$ y $\\operatorname{gr}Q = 2$, ¿cuál es el grado de $PQ$?', 5, 'Los grados se suman: $3 + 2 = 5$.'),
            num('Valor numérico de $x^2 - 3x + 2$ en $x = 4$', 6, '$16 - 12 + 2 = 6$.'),
          ],
        },
        {
          id: 'alg-3', title: 'Productos notables',
          clip: { scenes: [
            sc(4, '¿Cuánto es $(a + b)^2$? Dibujémoslo como un área.', { title: '$(a + b)^2 = \\;?$', viz: { type: 'areaSquare' } }),
            sc(5, 'Un cuadrado de lado $a + b$ se parte en 4 piezas.', { viz: { type: 'areaSquare' } }),
            sc(5, 'Suma las áreas: hay dos rectángulos iguales $ab$.', { title: '$(a + b)^2 = a^2 + 2ab + b^2$', viz: { type: 'areaSquare', full: true } }),
            sc(5, 'Otros productos que conviene reconocer a simple vista:', { steps: ['$(a + b)(a - b) = a^2 - b^2$', '$(x + a)(x + b) = x^2 + (a + b)x + ab$', '$(a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3$'] }),
          ] },
          ex: [
            mc('Expande $(x + 3)^2$', ['$x^2 + 6x + 9$', '$x^2 + 9$', '$x^2 + 3x + 9$', '$2x + 6$'], 0, '$(x + 3)^2 = x^2 + 2 \\cdot 3x + 3^2$.'),
            mc('Expande $(x - 5)(x + 5)$', ['$x^2 - 25$', '$x^2 + 25$', '$x^2 - 10x - 25$', '$x^2 - 10$'], 0, 'Diferencia de cuadrados: $a^2 - b^2$.'),
            num('Si $(x + k)^2 = x^2 + 10x + 25$, ¿cuánto vale $k$?', 5, '$2k = 10 \\Rightarrow k = 5$ (y $k^2 = 25$ ✓).', { prefix: '$k =$' }),
            mc('Expande $(x + 2)(x + 5)$', ['$x^2 + 7x + 10$', '$x^2 + 10x + 7$', '$x^2 + 7x + 7$', '$x^2 + 10$'], 0, 'Término común: $x^2 + (2 + 5)x + 2 \\cdot 5$.'),
          ],
        },
        {
          id: 'alg-24c', title: 'Binomio de Newton',
          clip: { scenes: [
            sc(5, 'Los coeficientes de $(a + b)^n$ forman el **triángulo de Pascal**: cada número es la suma de los dos de arriba.', { steps: ['$1$', '$1 \\quad 1$', '$1 \\quad 2 \\quad 1$', '$1 \\quad 3 \\quad 3 \\quad 1$', '$1 \\quad 4 \\quad 6 \\quad 4 \\quad 1$'] }),
            sc(5, 'Por eso:', { steps: ['$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$', '$(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$'] }),
            sc(6, 'En general, el término $k$ usa el número combinatorio $\\binom{n}{k}$.', { title: '$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$', steps: ['En $(2x - 1)^6$, el término con $x^4$:', '$\\binom{6}{2}(2x)^4(-1)^2 = 15 \\cdot 16\\,x^4 = 240x^4$'] }),
          ] },
          ex: [
            mc('Fila 5 del triángulo de Pascal (coeficientes de $(a + b)^5$)', ['$1, 5, 10, 10, 5, 1$', '$1, 4, 6, 4, 1$', '$1, 5, 5, 5, 5, 1$', '$1, 5, 10, 5, 1$'], 0, 'Suma los vecinos de la fila $1, 4, 6, 4, 1$.'),
            mc('Expande $(x + 1)^3$', ['$x^3 + 3x^2 + 3x + 1$', '$x^3 + 1$', '$x^3 + 3x + 1$', '$x^3 + x^2 + x + 1$'], 0, 'Coeficientes $1, 3, 3, 1$.'),
            num('Coeficiente del término en $x^4$ en $(2x - 1)^6$', 240, '$\\binom{6}{2} \\cdot 2^4 \\cdot (-1)^2 = 15 \\cdot 16 = 240$.'),
            num('$\\binom{5}{2} = \\;?$', 10, '$\\dfrac{5 \\cdot 4}{2 \\cdot 1} = 10$.'),
          ],
        },
        {
          id: 'alg-24b', title: 'Factorización',
          clip: { scenes: [
            sc(5, 'Factorizar es lo contrario de expandir: escribir como **producto**. Empieza siempre por el factor común.', { steps: ['$6x^3 - 9x^2 = 3x^2(2x - 3)$'] }),
            sc(5, 'Diferencia de cuadrados y suma o diferencia de cubos:', { steps: ['$x^4 - 81 = (x^2 + 9)(x^2 - 9)$', '$= (x^2 + 9)(x - 3)(x + 3)$', '$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$'] }),
            sc(5, 'Trinomio $ax^2 + bx + c$: busca dos números que multipliquen $ac$ y sumen $b$.', { steps: ['$6x^2 + 7x - 20$', '$= 6x^2 + 15x - 8x - 20$', '$= (2x + 5)(3x - 4)$'] }),
            sc(5, '**Completar el cuadrado** convierte un trinomio en un cuadrado más una constante.', { title: '$x^2 + bx + c = \\left(x + \\tfrac{b}{2}\\right)^2 + c - \\tfrac{b^2}{4}$', steps: ['$x^2 + 6x + 13 = (x + 3)^2 + 4$'] }),
          ] },
          ex: [
            mc('Factoriza completamente $x^4 - 81$', ['$(x^2 + 9)(x - 3)(x + 3)$', '$(x^2 - 9)^2$', '$(x - 3)^4$', '$(x^2 + 9)^2$'], 0, 'Dos veces diferencia de cuadrados; $x^2 + 9$ no se factoriza en $\\mathbb{R}$.'),
            mc('Factoriza $6x^2 + 7x - 20$', ['$(2x + 5)(3x - 4)$', '$(2x - 5)(3x + 4)$', '$(6x - 5)(x + 4)$', '$(3x + 5)(2x - 4)$'], 0, 'Comprueba: $6x^2 - 8x + 15x - 20$.'),
            mc('Factoriza $a^3 + 27b^3$', ['$(a + 3b)(a^2 - 3ab + 9b^2)$', '$(a + 3b)^3$', '$(a + 3b)(a^2 + 3ab + 9b^2)$', '$(a - 3b)(a^2 + 3ab + 9b^2)$'], 0, 'Suma de cubos con $b \\to 3b$.'),
            ord('Ordena los pasos para completar el cuadrado de $x^2 + 6x + 13$', ['$x^2 + 6x + 13$', '$x^2 + 6x + 9 + 4$', '$(x + 3)^2 + 4$'], 'La mitad de 6 es 3 y $3^2 = 9$; lo que sobra es $13 - 9 = 4$.'),
          ],
        },
      ],
    },
    {
      world: 'cuadraticas', title: 'Números complejos y ecuaciones cuadráticas',
      lessons: [
        {
          id: 'alg-23c', title: 'Números complejos',
          // Libro UdeA §2.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'La **unidad imaginaria** $i$ es el número cuyo cuadrado es $-1$. Un **complejo** es $z = a + bi$: parte real $a$ y parte imaginaria $b$.', { title: '$i^2 = -1$', steps: ['$\\sqrt{-r} = \\sqrt{r}\\,i$ para $r > 0$', '$\\sqrt{-9} = 3i \\qquad i^3 = -i \\qquad i^4 = 1$'] }),
            sc(6, 'Se suman y restan por partes; se multiplican como binomios recordando que $i^2 = -1$.', { steps: ['$(a + bi) + (c + di) = (a + c) + (b + d)i$', '$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$'] }),
            sc(6, 'El **conjugado** $\\bar z = a - bi$ y el **módulo** $|z| = \\sqrt{a^2 + b^2}$. Para dividir se multiplica arriba y abajo por el conjugado del divisor.', { steps: ['$z \\bar z = a^2 + b^2 = |z|^2$', '$\\dfrac{1 + 4i}{5 - 12i} = \\dfrac{(1 + 4i)(5 + 12i)}{169} = -\\dfrac{43}{169} + \\dfrac{32}{169}i$'] }),
            sc(5, 'En el **plano complejo** la parte real va en el eje horizontal y la imaginaria en el vertical: $2 + 3i$ es el punto $(2, 3)$.', { steps: ['Los reales viven en el eje horizontal', '$i$ es el punto $(0, 1)$'] }),
          ] },
          ex: [
            mc('Sean $z = x + 3i$ y $w = -1 + yi$. Si $z - w = 5 + 6i$, entonces', ['$x = 4,\\ y = -3$', '$x = -4,\\ y = -3$', '$x = 3,\\ y = -4$', '$x = 3,\\ y = 4$'], 0, '$z - w = (x + 1) + (3 - y)i$. Igualando partes: $x + 1 = 5$ y $3 - y = 6$, así que $x = 4$ y $y = -3$.'),
            mc('El módulo del complejo $z = \\sqrt2 - \\sqrt3\\,i$ es', ['$\\sqrt5$', '$5$', '$13$', '$\\sqrt{13}$'], 0, '$|z| = \\sqrt{(\\sqrt2)^2 + (\\sqrt3)^2} = \\sqrt{2 + 3} = \\sqrt5$.'),
            mc('La forma estándar de $z = \\dfrac{1 + 3i}{1 - i}$ es', ['$-1 + 2i$', '$1 - 2i$', '$2 - i$', '$-2 + i$'], 0, 'Se multiplica por el conjugado $1 + i$: $\\dfrac{(1 + 3i)(1 + i)}{1 + 1} = \\dfrac{1 + i + 3i + 3i^2}{2} = \\dfrac{-2 + 4i}{2} = -1 + 2i$.'),
            num('$(2 + 5i)(2 - 5i) = \\;?$', 29, 'Un complejo por su conjugado da el módulo al cuadrado: $2^2 + 5^2 = 29$. También: $4 - 25i^2 = 4 + 25$.'),
            mc('Si $z = -\\sqrt3 + i$, el valor de $z^2$ es', ['$2 - 2\\sqrt3\\,i$', '$4 - 2\\sqrt3\\,i$', '$2 + 2\\sqrt3\\,i$', '$4 + 2\\sqrt3\\,i$'], 0, '$(-\\sqrt3 + i)^2 = 3 - 2\\sqrt3\\,i + i^2 = 3 - 1 - 2\\sqrt3\\,i = 2 - 2\\sqrt3\\,i$.'),
            mc('La forma estándar de $\\left(\\dfrac{\\sqrt{-16}\\,\\sqrt{-9}}{\\sqrt{-36}}\\right)^3$ es', ['$-8i$', '$8i$', '$-8$', '$8$'], 0, '$\\sqrt{-16}\\sqrt{-9} = (4i)(3i) = -12$ y $\\sqrt{-36} = 6i$: el cociente es $\\dfrac{-12}{6i} = \\dfrac{-2}{i} = 2i$. Entonces $(2i)^3 = 8i^3 = -8i$.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'i⁴ = 1', truth: true, why: 'i⁴ = (i²)² = (−1)² = 1.' },
                { text: 'El conjugado de 3 − 2i es −3 + 2i', truth: false, why: 'Solo cambia el signo de la parte imaginaria: 3 + 2i.' },
                { text: '|z| es siempre un número real no negativo', truth: true, why: 'Es la raíz cuadrada de a² + b².' },
                { text: '√(−9) = 3i', truth: true, why: '(3i)² = 9i² = −9.' },
                { text: '(a + bi)(a − bi) = a² − b²', truth: false, why: 'Da a² + b²: el −b²i² se vuelve +b².' },
              ],
            }, 'Las potencias de $i$ se repiten cada cuatro: $i, -1, -i, 1$. El conjugado cambia el signo de la parte imaginaria y $z \\bar z = a^2 + b^2 = |z|^2 \\ge 0$.'),
          ],
        },
        {
          id: 'alg-1', title: 'Ecuaciones lineales',
          clip: { scenes: [
            sc(4, 'Una ecuación es una **balanza**: ambos lados pesan lo mismo.', { title: '$2x + 3 = 11$', viz: { type: 'balance', l: '2x + 3', r: '11' } }),
            sc(5, 'Lo que hagas a un lado, hazlo también al otro. Resta 3:', { steps: ['$2x + 3 = 11$', '$2x + 3 - 3 = 11 - 3$', '$2x = 8$'] }),
            sc(4, 'Ahora divide ambos lados entre 2:', { steps: ['$2x = 8$', '$\\dfrac{2x}{2} = \\dfrac{8}{2}$', '$x = 4$'] }),
            sc(4, 'Comprueba siempre: sustituye y verifica.', { title: '$2(4) + 3 = 11$ ✓', viz: { type: 'balance', l: '2·4 + 3', r: '11' } }),
          ] },
          ex: [
            mc('Resuelve $x + 5 = 12$', ['$x = 7$', '$x = 17$', '$x = 5$', '$x = -7$'], 0, 'Resta 5 en ambos lados: $x = 12 - 5 = 7$.'),
            num('Resuelve $2x - 4 = 10$', 7, 'Suma 4: $2x = 14$. Divide entre 2: $x = 7$.', { prefix: '$x =$' }),
            ord('Ordena los pasos para resolver $5x + 2 = 17$', ['$5x + 2 = 17$', '$5x = 15$', '$x = 3$'], 'Primero quitas el término independiente y luego el coeficiente.'),
            num('Resuelve $3(x - 2) - \\dfrac{2x + 1}{4} = 5$', 4.5, 'Multiplica todo por 4: $12x - 24 - 2x - 1 = 20 \\Rightarrow 10x = 45 \\Rightarrow x = 4.5$.', { prefix: '$x =$' }),
          ],
        },
        {
          id: 'alg-4a', title: 'Polinomio cuadrático y parábola',
          // Cronograma 2026-2, clase 10 (libro UdeA, polinomio cuadrático). Video: video/clase_cuadratico
          // (Clase 12), entregado; falta su ID de Bunny (clip.bunny + duration).
          // Spec: docs/superpowers/specs/2026-11-07-cuadratico-y-ecuaciones-exp-log-design.md
          clip: { scenes: [
            sc(6, 'Un **polinomio cuadrático** es $ax^2 + bx + c$ con $a \\ne 0$. Su gráfica es una **parábola**: una curva simétrica que da la vuelta en un solo punto, el **vértice**.', { title: '$y = x^2$', viz: { type: 'graph', xr: [-4, 4], yr: [-2, 8], f: sq, points: [[0, 0, 'vértice']] } }),
            sc(6, 'Mover la parábola es fácil si se escribe así: $(x - h)^2$ la corre $h$ hacia la derecha y el $+k$ la sube $k$. El vértice queda en $(h, k)$.', { title: '$y = (x - h)^2 - 1$', viz: { type: 'graph', xr: [-5, 5], yr: [-2, 7], f: (x, h) => (x - h) ** 2 - 1, anim: [-2, 2], label: h => `h = ${fmt(h)}` } }),
            sc(7, '**Completar el cuadrado** con fichas: $x^2 + 4x$ es un cuadrado $x^2$ y cuatro tiras $x$. Dos tiras a la derecha y dos abajo dejan un hueco en la esquina de $2 \\times 2 = 4$ cuadritos.', { steps: ['$x^2 + 4x = (x^2 + 4x + 4) - 4 = (x + 2)^2 - 4$', 'Se suma y se resta $\\left(\\tfrac{b}{2}\\right)^2$: la mitad del coeficiente de $x$, al cuadrado'] }),
            sc(7, 'Así se llega a la **forma canónica** $y = a(x - h)^2 + k$, que muestra el vértice y el **eje de simetría** $x = h$.', { title: '$y = x^2 - 6x + 5 = (x - 3)^2 - 4$', viz: { type: 'graph', xr: [-1, 7], yr: [-5, 6], f: x => x * x - 6 * x + 5, points: [[3, -4, 'V(3, −4)'], [1, 0, '1'], [5, 0, '5']] } }),
            sc(7, 'Atajo: $h = -\\dfrac{b}{2a}$ y $k$ es el valor del polinomio en $h$. Si $a > 0$ abre hacia arriba y el vértice es un **mínimo**; si $a < 0$ abre hacia abajo y es un **máximo**.', { steps: ['$y = -2x^2 + 4x + 1$: $h = -\\tfrac{4}{2(-2)} = 1$', '$k = -2 + 4 + 1 = 3$: el punto más alto es $(1, 3)$'] }),
          ] },
          ex: [
            play('completa-cuadrado', 'Pasa cuadritos de la bandeja a la esquina hasta **completar el cuadrado**', {
              rounds: [{ b: 6, c: 5 }, { b: 8, c: 20 }, { b: 2, c: 1 }, { b: 10, c: 16 }],
            }, 'La esquina que falta siempre tiene $\\left(\\tfrac{b}{2}\\right)^2$ cuadritos: $x^2 + 6x + 5 = (x + 3)^2 - 4$, $x^2 + 8x + 20 = (x + 4)^2 + 4$, $x^2 + 2x + 1 = (x + 1)^2$ y $x^2 + 10x + 16 = (x + 5)^2 - 9$.',
            { hint: 'Las tiras se reparten mitad a la derecha y mitad abajo, así que la esquina es un cuadrado cuyo lado es la mitad del coeficiente de x. Lo que quede en la bandeja (o lo prestado) es el número que acompaña al paréntesis.' }),
            play('mueve-parabola', 'Pon el **vértice** y la **abertura** para que tu parábola sea la de la ecuación', {
              rounds: [{ a: 1, b: -4, c: 1 }, { a: -1, b: -2, c: 3 }, { a: 2, b: 8, c: 5 }, { a: 0.5, b: 1, c: -3.5 }],
            }, 'Con $h = -\\tfrac{b}{2a}$ y $k$ el valor en $h$: $x^2 - 4x + 1 = (x - 2)^2 - 3$, $-x^2 - 2x + 3 = -(x + 1)^2 + 4$, $2x^2 + 8x + 5 = 2(x + 2)^2 - 3$ y $0.5x^2 + x - 3.5 = 0.5(x + 1)^2 - 4$.',
            { hint: 'El número que acompaña a x² es la abertura a, la misma en las dos formas. La primera coordenada del vértice es −b dividido entre 2a; la segunda sale de evaluar la ecuación en ese valor.' }),
            play('une-parejas', 'Une cada polinomio con su **forma canónica**', {
              left: ['x² + 10x + 21', 'x² − 2x − 8', '−x² + 6x − 5', '3x² − 6x + 7'],
              right: ['(x + 5)² − 4', '(x − 1)² − 9', '−(x − 3)² + 4', '3(x − 1)² + 4', '(x + 5)² + 4', '−(x + 3)² + 4'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'Al completar el cuadrado: $x^2 + 10x + 21 = (x + 5)^2 - 4$, $x^2 - 2x - 8 = (x - 1)^2 - 9$, $-x^2 + 6x - 5 = -(x - 3)^2 + 4$ y $3x^2 - 6x + 7 = 3(x - 1)^2 + 4$. Las trampas tienen mal el signo de $h$ o de $k$.',
            { hint: 'El número dentro del paréntesis es la mitad del coeficiente de x (después de sacar a como factor). Para revisar una pareja, desarrolla el cuadrado y compara el término independiente.' }),
            num('Una pelota se lanza hacia arriba y su altura en metros a los $t$ segundos es $h(t) = -5t^2 + 30t + 1$. ¿Cuál es su **altura máxima**?', 46,
              'El vértice está en $t = -\\tfrac{30}{2(-5)} = 3$ s y $h(3) = -45 + 90 + 1 = 46$ m. Como $a = -5 < 0$, el vértice es el punto más alto.',
              { suffix: 'm', hint: 'La altura máxima está en el vértice: busca primero el tiempo con −b/(2a) y luego evalúa h en ese tiempo.' }),
            num('Dos números suman 30. ¿Cuál es el **mayor producto** que pueden dar?', 225,
              'Si uno es $x$, el otro es $30 - x$ y el producto es $P = x(30 - x) = -x^2 + 30x = -(x - 15)^2 + 225$. El máximo es $225$, con $x = 15$.',
              { hint: 'Llama x a uno de los números; el otro es 30 − x. El producto es un polinomio cuadrático que abre hacia abajo: su vértice da el máximo.' }),
          ],
        },
        {
          id: 'alg-4', title: 'Ecuaciones cuadráticas',
          clip: { scenes: [
            sc(4, 'Las cuadráticas $ax^2 + bx + c = 0$ se relacionan con **parábolas**.', { title: '$y = ax^2$', viz: { type: 'graph', xr: [-4, 4], yr: [-2, 8], f: sq, draw: true } }),
            sc(5, 'El signo de $a$ decide si abre hacia arriba o hacia abajo.', { viz: { type: 'graph', xr: [-4, 4], yr: [-6, 6], f: (x, a) => a * x * x, anim: [2, -2], label: a => `a = ${fmt(a)}` } }),
            sc(5, 'Las **raíces** son donde la parábola toca el eje $x$. Factorizar es el camino más rápido.', { title: '$x^2 - 5x + 6 = (x - 2)(x - 3) = 0$', viz: { type: 'graph', xr: [-1, 6], yr: [-2, 6], f: x => x * x - 5 * x + 6, points: [[2, 0, 'x = 2'], [3, 0, 'x = 3']] } }),
            sc(6, 'Si no factoriza fácil, usa la fórmula general. El discriminante te dice cuántas raíces hay:', { title: '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', steps: ['$b^2 - 4ac > 0$: dos raíces', '$b^2 - 4ac = 0$: una raíz', '$b^2 - 4ac < 0$: ninguna real'] }),
          ] },
          ex: [
            sld('Ajusta $a$ para que $y = ax^2$ pase por el punto $(2, 2)$', {
              viz: { type: 'graph', xr: [-3, 3], yr: [-4, 5], f: (x, a) => a * x * x, points: [[2, 2, '(2, 2)']] },
              min: -2, max: 2, step: 0.25, init: 1, readout: v => `$a = ${v}$`,
              check: v => near(v, 0.5), answerText: '$a = 0.5$', explain: '$2 = a \\cdot 2^2 \\Rightarrow a = \\tfrac{1}{2}$.',
            }),
            num('¿Cuál es la raíz **mayor** de $x^2 - 5x + 6 = 0$?', 3, 'Factoriza: $(x - 2)(x - 3) = 0$. Raíces 2 y 3.', { prefix: '$x =$' }),
            mc('Discriminante $b^2 - 4ac$ de $x^2 + 2x + 5$', ['$-16$', '$24$', '$16$', '$-4$'], 0, '$2^2 - 4(1)(5) = 4 - 20 = -16$: no tiene raíces reales.'),
            num('El producto de dos números impares consecutivos es 143. ¿Cuál es el menor (positivo)?', 11, '$n(n + 2) = 143 \\Rightarrow n^2 + 2n - 143 = 0 \\Rightarrow (n - 11)(n + 13) = 0$.'),
          ],
        },
      ],
    },
    {
      world: 'grado-superior', title: 'Polinomios de grado superior',
      lessons: [
        {
          id: 'alg-23b', title: 'División e igualdad de polinomios',
          clip: { scenes: [
            sc(5, 'Dividir polinomios es como dividir números: hay cociente y residuo.', { title: '$P(x) = D(x)\\,Q(x) + R(x)$', steps: ['$\\operatorname{gr}R < \\operatorname{gr}D$ o $R = 0$'] }),
            sc(6, 'Ejemplo: $(x^2 + 3x + 5) \\div (x + 1)$', { steps: ['$x^2 + 3x + 5 = (x + 1)(x + 2) + 3$', 'cociente $x + 2$', 'residuo $3$'] }),
            sc(5, 'Dos polinomios son **iguales** si tienen los mismos coeficientes.', { steps: ['$(a + 1)x^2 + (b - 2)x + 3 = 4x^2 + 3$', '$a + 1 = 4 \\Rightarrow a = 3$', '$b - 2 = 0 \\Rightarrow b = 2$'] }),
          ] },
          ex: [
            mc('Cociente de $(x^2 + 5x + 6) \\div (x + 2)$', ['$x + 3$', '$x + 2$', '$x - 3$', '$x + 6$'], 0, '$(x + 2)(x + 3) = x^2 + 5x + 6$, residuo 0.'),
            num('Residuo de $(x^2 + 3x + 5) \\div (x + 1)$', 3, '$(x + 1)(x + 2) = x^2 + 3x + 2$; faltan 3.'),
            num('Si $(a + 1)x^2 + (b - 2)x + 3 = 4x^2 + 3$ para todo $x$, ¿cuánto vale $a$?', 3, 'Compara los coeficientes de $x^2$: $a + 1 = 4$.', { prefix: '$a =$' }),
            num('…¿y cuánto vale $b$?', 2, 'No hay término en $x$ a la derecha: $b - 2 = 0$.', { prefix: '$b =$' }),
          ],
        },
        {
          id: 'alg-92', title: 'Residuo, factor y división sintética',
          // Libro UdeA §9.2–9.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, '**Algoritmo de la división**: $f(x) = g(x)\\,q(x) + r(x)$, con $r = 0$ o grado de $r$ menor que el de $g$.', { steps: ['$3x^4 + 2x^3 - x^2 - x - 6 = (x^2 + 1)(3x^2 + 2x - 4) - 3x - 2$'] }),
            sc(6, '**Teorema del residuo**: al dividir $f(x)$ entre $x - c$, el residuo es $f(c)$. No hace falta dividir.', { steps: ['$f(x) = x^4 + 5x^3 + 5x^2 - 4x - 7$ entre $x + 3$: $r = f(-3) = -4$'] }),
            sc(6, '**Teorema del factor**: $x - c$ es factor de $f(x)$ si y solo si $f(c) = 0$.', { steps: ['$f(x) = x^3 - 8x^2 + 19x - 20$: $f(5) = 0 \\Rightarrow x - 5$ es factor'] }),
            sc(7, '**División sintética** entre $x - c$: se bajan los coeficientes, se multiplica por $c$ y se suma; la última casilla es el residuo.', { steps: ['$3x^3 - 4x^2 - 2x - 7$ entre $x - 2$: $3 \\;\\; 2 \\;\\; 2 \\;\\; | -3$', 'cociente $3x^2 + 2x + 2$, residuo $-3$'] }),
          ] },
          ex: [
            mc('¿Cuál es el residuo de dividir $P(x) = x^3 - 2x + 4$ entre $x - 1$?', ['$3$', '$2$', '$4$', '$-1$'], 0, 'Teorema del residuo: $P(1) = 1 - 2 + 4 = 3$.'),
            num('¿Cuál es el residuo de dividir $P(x) = 2x^3 - x + 5$ entre $x - 1$?', 6, '$P(1) = 2 - 1 + 5 = 6$.'),
            mc('Si el residuo de dividir $P(x)$ entre $x - 4$ es 0, ¿qué podemos concluir?', ['$P(x)$ tiene una raíz en $x = 4$', '$P(x)$ tiene una raíz en $x = 0$', '$P(x)$ no tiene raíces', 'No se puede concluir nada'], 0, 'Residuo cero significa $P(4) = 0$: $x - 4$ es factor y $4$ es raíz.'),
            mc('¿Cuál es el cociente de dividir $x^3 + 3x^2 + 3x + 1$ entre $x + 1$ por división sintética?', ['$x^2 + 2x + 1$', '$x^2 + 3x$', '$x^2 + 3x + 3$', '$x + 1$'], 0, 'Con $c = -1$: coeficientes $1, 3, 3, 1 \\to 1, 2, 1, 0$. Cociente $x^2 + 2x + 1$ y residuo $0$: es $(x + 1)^3$.'),
            mc('Al dividir $2x^3 - 3x^2 + x - 4$ entre $x - 2$, el cociente y el residuo son', ['$2x^2 + x + 3$ y $2$', '$2x^2 - x + 3$ y $-2$', '$2x^2 + x - 3$ y $2$', '$2x^2 + 7x + 15$ y $26$'], 0, 'Sintética con $c = 2$: $2 \\to 2$; $-3 + 4 = 1$; $1 + 2 = 3$; $-4 + 6 = 2$. Cociente $2x^2 + x + 3$, residuo $2$.'),
            mc('El valor de $k$ para el cual $x + 1$ es factor de $P(x) = 2x^3 + (2 - k)x^2 - (k - 2)$ es', ['$k = 1$', '$k = -1$', '$k = 0$', '$k = 2$'], 0, 'Debe ser $P(-1) = 0$: $-2 + (2 - k) - (k - 2) = 2 - 2k = 0$, luego $k = 1$.'),
            num('Sin dividir, halla el residuo de $x^4 + 5x^3 + 5x^2 - 4x - 7$ entre $x + 3$', -4, '$f(-3) = 81 - 135 + 45 + 12 - 7 = -4$.'),
          ],
        },
        {
          id: 'alg-93', title: 'Ceros de un polinomio',
          // Libro UdeA §9.4–9.5. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, '**Teorema fundamental del álgebra**: todo polinomio de grado $n \\ge 1$ tiene exactamente $n$ ceros complejos, contando **multiplicidades**.', { steps: ['$f(x) = x(x - 1)^2(x - 4)^3$: ceros $0$, $1$ (doble), $4$ (triple)'] }),
            sc(6, '**Ceros racionales**: si $\\tfrac{c}{d}$ es cero de un polinomio con coeficientes enteros, $c$ divide al término independiente y $d$ al coeficiente principal.', { steps: ['$x^3 + 2x^2 - 9x - 4$: candidatos $\\pm1, \\pm2, \\pm4$', '$f(-4) = 0 \\Rightarrow (x + 4)(x^2 - 2x - 1)$'] }),
            sc(6, '**Regla de los signos de Descartes**: los ceros reales positivos son tantos como los cambios de signo de $f(x)$, o ese número menos un par.', { steps: ['$3x^5 - 2x^4 + 5x^2 + 3x - 1$: 3 cambios $\\Rightarrow$ 3 o 1 positivos'] }),
            sc(6, 'Los ceros **irracionales** $s \\pm t\\sqrt{u}$ y los **complejos** $a \\pm bi$ vienen en parejas conjugadas cuando los coeficientes son reales (o enteros).', { steps: ['Si $3 + i$ es cero, $3 - i$ también', '$x^3 - x^2 + 4x - 4 = (x - 1)(x - \\sqrt2 i)(x + \\sqrt2 i)$'] }),
          ] },
          ex: [
            mc('Las raíces del polinomio $f(x) = x^3 - x^2 - 10x - 8$ son', ['$-2, -1, 4$', '$-1, 5, 8$', '$-4, -2, -1$', '$-2, -i, i$'], 0, '$f(-1) = -1 - 1 + 10 - 8 = 0$; dividiendo: $(x + 1)(x^2 - 2x - 8) = (x + 1)(x - 4)(x + 2)$.'),
            mc('Según la regla de los signos de Descartes, ¿cuál es el número máximo de raíces positivas de $f(x) = x^4 - 3x^3 + 2x^2 - 5x + 1$?', ['$4$', '$1$', '$3$', '$2$'], 0, 'Los signos son $+\\,-\\,+\\,-\\,+$: cuatro cambios, así que hay 4, 2 o 0 raíces positivas; el máximo es 4.'),
            mc('¿Cuál de estos valores NO puede ser cero racional de $f(x) = 2x^3 - 3x^2 + x - 6$?', ['$\\tfrac14$', '$\\tfrac12$', '$3$', '$-6$'], 0, 'Los candidatos son $\\tfrac{c}{d}$ con $c \\mid 6$ y $d \\mid 2$: $\\pm1, \\pm2, \\pm3, \\pm6, \\pm\\tfrac12, \\pm\\tfrac32$. El denominador 4 no divide al coeficiente principal 2.'),
            mc('El grado mínimo de un polinomio con coeficientes enteros que tiene como ceros a $1$, $-3$, $2 - \\sqrt7$ y $3 + i$ es', ['$6$', '$3$', '$4$', '$5$'], 0, 'Con coeficientes enteros, $2 + \\sqrt7$ y $3 - i$ también son ceros: en total seis ceros, grado mínimo 6.'),
            mc('Si el polinomio $f(x) = x^3 - x$ tiene un cero en $x = 0$, ¿qué otros ceros tiene?', ['$\\pm1$', '$\\pm i$', '$\\pm 2i$', '$\\pm\\sqrt2$'], 0, '$x^3 - x = x(x^2 - 1) = x(x - 1)(x + 1)$.'),
            mc('En $f(x) = x(x - 1)^2(x - 4)^3$, la multiplicidad del cero $4$ es', ['$3$', '$1$', '$2$', '$6$'], 0, 'El factor $(x - 4)$ aparece tres veces: multiplicidad 3. En total hay $1 + 2 + 3 = 6$ ceros, el grado.'),
            mc('Para $f(x) = x^2 - 4$ se sabe que $f(-3) = 5$ y $f(3) = 5$. ¿Garantiza el teorema del valor intermedio una raíz en $(-3, 3)$?', ['No, porque $f(-3)$ y $f(3)$ no tienen signos opuestos', 'Sí, porque el polinomio es continuo', 'Sí, porque el polinomio tiene grado 2', 'No, porque el valor intermedio debe ser cero'], 0, 'El teorema asegura una raíz solo cuando hay cambio de signo. Aquí las raíces $\\pm2$ existen, pero el teorema no es quien lo garantiza.'),
          ],
        },
      ],
    },
    {
      world: 'racionales', title: 'Expresiones racionales y fracciones parciales',
      lessons: [
        {
          id: 'alg-25a', title: 'Dominio y simplificación',
          clip: { scenes: [
            sc(5, 'Una expresión racional es un cociente de polinomios. Su dominio excluye los valores que anulan el denominador.', { title: '$\\dfrac{x^2 - 9}{x^2 + x - 6}$', steps: ['$x^2 + x - 6 = (x + 3)(x - 2)$', '$x \\neq -3, \\; x \\neq 2$'] }),
            sc(5, 'Para simplificar, factoriza y cancela **factores** comunes.', { steps: ['$\\dfrac{(x - 3)(x + 3)}{(x + 3)(x - 2)}$', '$= \\dfrac{x - 3}{x - 2}, \\quad x \\neq -3$'] }),
            sc(5, 'En la gráfica, el factor cancelado deja un **hueco** en $x = -3$.', { viz: { type: 'graph', xr: [-6, 6], yr: [-4, 6], f: x => (x - 3) / (x - 2), holes: [[-3, 1.2]], draw: true } }),
            sc(4, 'Error típico: cancelar **términos** en lugar de factores.', { steps: ['$\\dfrac{x + 2}{x} \\neq 2$', '$\\dfrac{x + 2}{x} = 1 + \\dfrac{2}{x}$'] }),
          ] },
          ex: [
            mc('Simplifica $\\dfrac{x^2 - 9}{x^2 + x - 6}$', ['$\\dfrac{x - 3}{x - 2}$', '$\\dfrac{x + 3}{x - 2}$', '$\\dfrac{-9}{x - 6}$', '$\\dfrac{3}{2}$'], 0, 'Factoriza arriba y abajo y cancela $x + 3$.'),
            mc('¿Qué valores quedan excluidos del dominio de esa expresión?', ['$x = -3$ y $x = 2$', 'Solo $x = 3$', 'Solo $x = 2$', 'Ninguno'], 0, 'Los que anulan el denominador original $(x + 3)(x - 2)$.'),
            mc('¿Es correcto que $\\dfrac{x + 2}{x} = 2$?', ['No: solo se cancelan factores, no términos', 'Sí, siempre', 'Sí, si $x \\neq 0$', 'Solo si $x = 2$'], 0, 'Con $x = 1$: $\\tfrac{3}{1} = 3 \\neq 2$.'),
            mc('Simplifica $\\dfrac{2x + 4}{x^2 - 4}$', ['$\\dfrac{2}{x - 2}$', '$\\dfrac{2}{x + 2}$', '$\\dfrac{2x}{x^2}$', '$\\dfrac{1}{x - 2}$'], 0, '$\\dfrac{2(x + 2)}{(x + 2)(x - 2)}$.'),
          ],
        },
        {
          id: 'alg-25b', title: 'Operaciones con fracciones algebraicas',
          clip: { scenes: [
            sc(5, 'Multiplicar y dividir: factoriza todo y cancela.', { steps: ['$\\dfrac{P}{Q} \\cdot \\dfrac{R}{S} = \\dfrac{PR}{QS}$', '$\\dfrac{P/Q}{R/S} = \\dfrac{PS}{QR}$'] }),
            sc(6, 'Sumar y restar: usa el **mínimo común denominador**.', { steps: ['$\\dfrac{2}{x - 1} - \\dfrac{3}{x + 1} + \\dfrac{6}{x^2 - 1}$', '$= \\dfrac{2(x + 1) - 3(x - 1) + 6}{x^2 - 1}$', '$= \\dfrac{11 - x}{x^2 - 1}$'] }),
            sc(5, '**Fracción compleja**: multiplica arriba y abajo por el MCD de las fracciones pequeñas.', { steps: ['$\\dfrac{\\frac{1}{x} - \\frac{1}{a}}{x - a} = \\dfrac{a - x}{ax(x - a)}$', '$= -\\dfrac{1}{ax}$'] }),
          ] },
          ex: [
            mc('Efectúa $\\dfrac{2}{x - 1} - \\dfrac{3}{x + 1} + \\dfrac{6}{x^2 - 1}$', ['$\\dfrac{11 - x}{x^2 - 1}$', '$\\dfrac{5}{x^2 - 1}$', '$\\dfrac{x + 11}{x^2 - 1}$', '$\\dfrac{5}{x - 1}$'], 0, 'Numerador: $2x + 2 - 3x + 3 + 6 = 11 - x$.'),
            mc('$\\dfrac{x}{x + 1} \\cdot \\dfrac{x + 1}{x^2} = \\;?$', ['$\\dfrac{1}{x}$', '$x$', '$\\dfrac{x + 1}{x}$', '$1$'], 0, 'Se cancelan $x + 1$ y una $x$.'),
            mc('Simplifica $\\dfrac{\\frac{1}{x} - \\frac{1}{a}}{x - a}$', ['$-\\dfrac{1}{ax}$', '$\\dfrac{1}{ax}$', '$\\dfrac{a - x}{x - a}$', '$ax$'], 0, '$\\dfrac{a - x}{ax} \\cdot \\dfrac{1}{x - a} = -\\dfrac{1}{ax}$.'),
            mc('MCD de $\\dfrac{1}{x^2 - 4}$ y $\\dfrac{1}{x + 2}$', ['$(x - 2)(x + 2)$', '$(x + 2)^2$', '$(x^2 - 4)(x + 2)$', '$x - 2$'], 0, '$x^2 - 4 = (x - 2)(x + 2)$ ya contiene a $x + 2$.'),
          ],
        },
        {
          id: 'alg-101', title: 'Sistemas de ecuaciones lineales',
          // Libro UdeA §10.1–10.2. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Un **sistema lineal** son varias ecuaciones de primer grado con las mismas incógnitas. Resolverlo es hallar los valores que cumplen **todas** a la vez.', { steps: ['$x + y = 4,\\quad 3x - 2y = 7$'] }),
            sc(7, 'Tres métodos para $2 \\times 2$: **sustitución** (despeja una incógnita y reemplaza), **igualación** (despeja la misma en ambas) y **reducción** (suma múltiplos para eliminar una).', { steps: ['Sustitución: $x = 4 - y \\Rightarrow 3(4 - y) - 2y = 7 \\Rightarrow y = 1,\\ x = 3$', 'Reducción: $5x + 6y = 20$ y $8x - 6y = -46$ se suman $\\Rightarrow 13x = -26$'] }),
            sc(6, 'Dos rectas pueden cortarse en **un punto** (solución única), ser **paralelas** (sin solución) o ser **la misma** (infinitas soluciones).', { steps: ['Sistemas equivalentes: intercambiar, multiplicar por $k \\ne 0$, sumar un múltiplo de otra'] }),
          ] },
          ex: [
            mc('La solución del sistema $x + y = 5$, $2x - y = 1$ es', ['$x = 2,\\ y = 3$', '$x = 1,\\ y = 4$', '$x = 3,\\ y = 2$', '$x = 4,\\ y = 1$'], 0, 'Sumando las ecuaciones se elimina $y$: $3x = 6$, $x = 2$, y entonces $y = 3$.'),
            mc('¿Cuál es el valor de $x$ en el sistema $5x + 4y = 10$, $2x - 2y = 4$?', ['$x = 2$', '$x = 1$', '$x = 0$', '$x = 3$'], 0, 'De la segunda, $x = y + 2$. Sustituyendo: $5(y + 2) + 4y = 10 \\Rightarrow 9y = 0$, así que $y = 0$ y $x = 2$.'),
            mc('¿Cuál sistema tiene como solución $x = 2$ y $y = 3$?', ['$x + y = 5,\\ 2x - y = 1$', '$x + y = 5,\\ 2x - y = 4$', '$x + y = 4,\\ 2x - y = 1$', '$x + y = 6,\\ 2x - y = 2$'], 0, 'Se reemplaza: $2 + 3 = 5$ y $2(2) - 3 = 1$. Las otras fallan en al menos una ecuación.'),
            num('Si $x + y = 10$ y $x - y = 4$, ¿cuánto vale $x$?', 7, 'Sumando: $2x = 14$, $x = 7$ (y $y = 3$).'),
            mc('La solución del sistema $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$ es', ['$x = 1,\\ y = 2,\\ z = 3$', '$x = 2,\\ y = 0,\\ z = 4$', '$x = 3,\\ y = 1,\\ z = 2$', '$x = 1,\\ y = 3,\\ z = 2$'], 0, 'Sumando la segunda y la tercera: $3x + y = 5$; de la primera, $z = 6 - x - y$, que en la segunda da $x - 2y = -3$. Resolviendo: $x = 1$, $y = 2$, $z = 3$.'),
            mc('Al resolver el sistema $x + 2y = 8$, $3x - 4y = 4$, su solución representa', ['Un punto', 'La misma recta', 'Dos rectas paralelas', 'Ninguna de las otras opciones'], 0, 'Las pendientes son distintas ($-\\tfrac12$ y $\\tfrac34$): las rectas se cortan en un único punto, $(4, 2)$.'),
            mc('Del sistema $x - y + 2z = 3$, $x + 2y - z = -3$, $2y - 2z = 1$ podemos afirmar que', ['no tiene soluciones', 'tiene solución única $x = 2, y = 3, z = 1$', 'tiene infinitas soluciones', 'tiene solución única $x = 0, y = -1, z = 1$'], 0, 'De la tercera, $y = z + \\tfrac12$; con la primera, $x = \\tfrac72 - z$. Al sustituir en la segunda queda $\\tfrac92 = -3$, imposible: el sistema es inconsistente.'),
          ],
        },
        {
          id: 'alg-102', title: 'Sistemas no lineales y fracciones parciales',
          // Libro UdeA §10.3–10.4. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Un sistema **no lineal** $y = f(x)$, $y = g(x)$ se resuelve igualando: las soluciones son los **puntos de corte** de las dos gráficas.', { title: '$y = x^2$ y $y = 3x + 4$', viz: { type: 'graph', xr: [-3, 6], yr: [0, 20], f: x => x * x, points: [[4, 16, '(4, 16)'], [-1, 1, '(−1, 1)']] }, steps: ['$x^2 = 3x + 4 \\Rightarrow (x - 4)(x + 1) = 0$'] }),
            sc(6, 'Una fracción racional es **propia** si el grado del numerador es menor que el del denominador; si no, primero se divide.', { steps: ['$\\dfrac{x + 7}{x^2 - x - 6}$ es propia · $\\dfrac{x^3 - 6x^2 + 5x - 3}{x^2 - 1}$ no'] }),
            sc(7, '**Fracciones parciales**: se factoriza el denominador y se pone una constante por cada factor lineal (y $Bx + C$ por cada cuadrático irreducible); los factores repetidos llevan una fracción por cada potencia.', { steps: ['$\\dfrac{5x - 1}{(x + 1)(x - 2)} = \\dfrac{A}{x + 1} + \\dfrac{B}{x - 2}$', '$5x - 1 = A(x - 2) + B(x + 1) \\Rightarrow A = 2,\\ B = 3$'] }),
            sc(6, 'Con un factor cuadrático: $\\dfrac{x^2 + 1}{(x + 1)(x^2 + x + 1)} = \\dfrac{A}{x + 1} + \\dfrac{Bx + C}{x^2 + x + 1}$ y se iguala coeficiente a coeficiente.', { steps: ['$A + B = 1,\\ A + B + C = 0,\\ A + C = 1 \\Rightarrow A = 2,\\ B = -1,\\ C = -1$'] }),
          ] },
          ex: [
            mc('Las soluciones del sistema $y = x^2$, $y = x + 6$ son', ['$\\{(3, 9), (-2, 4)\\}$', '$\\{(3, 9)\\}$', '$\\{(2, 4), (-3, 9)\\}$', '$\\{(6, 36), (0, 0)\\}$'], 0, 'Igualando: $x^2 - x - 6 = 0 = (x - 3)(x + 2)$. Con $x = 3$, $y = 9$; con $x = -2$, $y = 4$.'),
            mc('¿Cuál es la descomposición en fracciones parciales de $\\dfrac{1}{(x - 1)(x + 2)}$?', ['$\\dfrac{A}{x - 1} + \\dfrac{B}{x + 2}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x + 2}$', '$\\dfrac{A}{x - 1} + \\dfrac{B}{x - 2}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x - 1}$'], 0, 'Cada factor lineal distinto del denominador aporta una fracción con constante arriba.'),
            mc('La descomposición de $\\dfrac{5}{(x - 2)(x + 3)}$ es', ['$\\dfrac{1}{x - 2} - \\dfrac{1}{x + 3}$', '$\\dfrac{1}{x - 2} + \\dfrac{1}{x + 3}$', '$\\dfrac{2}{x - 2} - \\dfrac{1}{x + 3}$', '$\\dfrac{5}{x - 2} - \\dfrac{5}{x + 3}$'], 0, '$5 = A(x + 3) + B(x - 2)$. Con $x = 2$: $5 = 5A$, $A = 1$; con $x = -3$: $5 = -5B$, $B = -1$.'),
            mc('¿Cómo se descompone $\\dfrac{5x^2 + 7x + 2}{(x + 1)(x^2 + 1)}$ en fracciones parciales?', ['$\\dfrac{A}{x + 1} + \\dfrac{Bx + C}{x^2 + 1}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x^2 + 1}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x + 1} + \\dfrac{C}{x^2 + 1}$', '$\\dfrac{A}{x^2 + 1} + \\dfrac{Bx}{x + 1}$'], 0, 'El factor $x^2 + 1$ es cuadrático irreducible: su numerador es de la forma $Bx + C$, no una constante.'),
            mc('Al descomponer en fracciones parciales $\\dfrac{x^2 - 11x + 6}{(x^3 - 2x^2 - 4x)^2}$, el número de constantes a determinar es', ['$6$', '$3$', '$4$', '$5$'], 0, 'El denominador es $x^2 (x^2 - 2x - 4)^2$: $x^2$ aporta 2 constantes y el cuadrático al cuadrado aporta $2 + 2 = 4$. Total 6.'),
            mc('Si el área y el perímetro de un triángulo rectángulo miden 30 cada una, sus lados son', ['$5, 12$ y $13$', '$3, 20$ y $7$', '$10, 6$ y $14$', '$9, 10$ y $11$'], 0, 'Los únicos que cumplen las dos: $\\tfrac{5 \\cdot 12}{2} = 30$ y $5 + 12 + 13 = 30$, con $5^2 + 12^2 = 13^2$.'),
            mc('Al descomponer $\\dfrac{1}{(x + k)(x - 1)} = \\dfrac{A}{x + k} + \\dfrac{B}{x - 1}$, los valores de $A$ y $B$ en función de $k$ son', ['$A = \\dfrac{-1}{k + 1},\\ B = \\dfrac{1}{k + 1}$', '$A = \\dfrac{1}{k + 1},\\ B = \\dfrac{1}{k + 1}$', '$A = \\dfrac{-1}{1 - k},\\ B = \\dfrac{1}{1 - k}$', '$A = 1 - k,\\ B = \\dfrac{1 - k}{k}$'], 0, '$1 = A(x - 1) + B(x + k)$. Con $x = 1$: $B = \\tfrac{1}{1 + k}$; con $x = -k$: $A = \\tfrac{1}{-k - 1} = \\tfrac{-1}{k + 1}$.'),
          ],
        },
      ],
    },
    {
      world: 'exp-log', title: 'Funciones exponenciales y logarítmicas',
      lessons: [
        {
          id: 'alg-71', title: 'Función exponencial',
          // Libro UdeA §7.1–7.2. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'La **función exponencial** $f(x) = a^x$ ($a > 0$, $a \\ne 1$) tiene dominio $\\mathbb{R}$ y rango $(0, \\infty)$: nunca toca el eje $x$.', { title: '$f(x) = 2^x$', viz: { type: 'graph', xr: [-3, 3], yr: [0, 8], f: x => 2 ** x, points: [[0, 1, '(0, 1)'], [2, 4, '(2, 4)'], [-1, 0.5, '(−1, 0.5)']] } }),
            sc(6, 'Si $a > 1$ **crece**; si $0 < a < 1$ **decrece**. El eje $x$ es una **asíntota horizontal**.', { steps: ['$2^x$: $\\tfrac18, \\tfrac14, \\tfrac12, 1, 2, 4, 8$', '$(\\tfrac12)^x$: la misma lista al revés'] }),
            sc(6, 'El número $e \\approx 2.71828$ es el límite de $(1 + \\tfrac1n)^n$. $f(x) = e^x$ es la exponencial **natural**, la de los crecimientos continuos.', { steps: ['$P(t) = P_0\\,e^{kt}$ modela poblaciones y desintegración'] }),
            sc(6, 'Como la exponencial es biunívoca, para resolver $a^p = a^q$ basta igualar exponentes.', { steps: ['$3^{2x} = 81 = 3^4 \\Rightarrow 2x = 4 \\Rightarrow x = 2$', '$4^{x + 1} = 64 = 4^3 \\Rightarrow x = 2$'] }),
          ] },
          ex: [
            num('Si $f(x) = 3^x$, ¿cuál es el valor de $f(2)$?', 9, '$3^2 = 9$.'),
            mc('¿Cuál es el dominio de la función exponencial $f(x) = e^x$?', ['$(-\\infty, \\infty)$', '$(0, \\infty)$', '$(-\\infty, 0)$', '$[0, \\infty)$'], 0, 'Se puede elevar $e$ a cualquier real, positivo, negativo o cero.'),
            mc('¿Cuál es el rango de la función $f(x) = 2^x$?', ['$(0, \\infty)$', '$(-\\infty, \\infty)$', '$[0, 1]$', '$[-1, 1]$'], 0, 'Una potencia de base positiva siempre es positiva y puede ser tan grande o tan cercana a 0 como se quiera, pero nunca 0.'),
            mc('Resuelve la ecuación exponencial $3^{2x} = 81$', ['$x = 2$', '$x = 1$', '$x = 4$', '$x = 3$'], 0, '$81 = 3^4$, así que $2x = 4$ y $x = 2$.'),
            num('Resuelve $2^{x - 1} = 8$', 4, '$8 = 2^3$, entonces $x - 1 = 3$ y $x = 4$.'),
            mc('Resuelve la ecuación $4^{x + 1} = 64$', ['$x = 2$', '$x = 1$', '$x = 3$', '$x = 4$'], 0, '$64 = 4^3$: $x + 1 = 3$, $x = 2$.'),
            mc('Una población de hormigas era de 3000 en el año 2000 y crece de forma continua al 6 % anual, $P(t) = 3000\\,e^{0.06t}$. ¿Cuántas había en 2018?', ['$\\approx 8834$', '$\\approx 1833$', '$\\approx 32400$', '$\\approx 18834$'], 0, 'Con $t = 18$: $e^{0.06 \\cdot 18} = e^{1.08} \\approx 2.945$ y $3000 \\cdot 2.945 \\approx 8834$.'),
          ],
        },
        {
          id: 'alg-72', title: 'Logaritmos y sus propiedades',
          // Libro UdeA §7.3–7.4. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'El **logaritmo** es la inversa de la exponencial: $y = \\log_a x$ si y solo si $x = a^y$. Pregunta «¿a qué exponente elevo $a$ para obtener $x$?».', { steps: ['$\\log_2 8 = 3$ porque $2^3 = 8$', 'Dominio $(0, \\infty)$ · rango $\\mathbb{R}$'] }),
            sc(6, '**Propiedades**: el logaritmo convierte productos en sumas, cocientes en restas y potencias en productos.', { steps: ['$\\log_a(xy) = \\log_a x + \\log_a y \\qquad \\log_a \\tfrac{x}{y} = \\log_a x - \\log_a y$', '$\\log_a x^b = b \\log_a x \\qquad \\log_a 1 = 0 \\qquad \\log_a a = 1$'] }),
            sc(5, 'Dos bases famosas: $\\ln x = \\log_e x$ (natural) y $\\log x = \\log_{10} x$ (común). Cambio de base: $\\log_a x = \\dfrac{\\log_c x}{\\log_c a}$.', { steps: ['$\\log_3 x + \\log_4 x = 4 \\Rightarrow \\ln x\\left(\\tfrac{1}{\\ln 3} + \\tfrac{1}{\\ln 4}\\right) = 4$'] }),
            sc(6, 'Para resolver ecuaciones: junta los logaritmos en uno solo y pasa a forma exponencial. **Comprueba** que las soluciones estén en el dominio.', { steps: ['$\\log x + \\log(x + 15) = 2 \\Rightarrow x(x + 15) = 100 \\Rightarrow x = 5$ (el $-20$ no sirve)'] }),
          ] },
          ex: [
            mc('¿Cuál es el dominio de la función $f(x) = \\log(x)$?', ['$(0, \\infty)$', '$(-\\infty, 0)$', '$[0, \\infty)$', '$(-\\infty, \\infty)$'], 0, 'Solo los positivos tienen logaritmo: ninguna potencia de 10 da 0 ni un negativo.'),
            num('Si $f(x) = \\log_2(x)$, ¿cuál es el valor de $f(8)$?', 3, '$2^3 = 8$, así que $\\log_2 8 = 3$.'),
            mc('Si $\\log_a(b) = c$, ¿cómo se expresa en forma exponencial?', ['$a^c = b$', '$a = b^c$', '$b^a = c$', '$c = a^b$'], 0, 'El logaritmo es el exponente: la base $a$ elevada al resultado $c$ da el argumento $b$.'),
            num('Resuelve $\\log_2(x) = 3$', 8, 'En forma exponencial: $x = 2^3 = 8$.'),
            mc('Resuelve $\\log_3(x) + \\log_3(4) = 2$', ['$x = \\tfrac94$', '$x = 5$', '$x = 8$', '$x = 3$'], 0, 'Se juntan: $\\log_3(4x) = 2$, luego $4x = 9$ y $x = \\tfrac94$.'),
            num('Si $\\log_5(a) = 2$, ¿cuál es el valor de $\\log_5(a^3)$?', 6, 'La potencia sale como factor: $\\log_5 a^3 = 3 \\log_5 a = 3 \\cdot 2 = 6$.'),
            mc('Si $\\log_b(x) = p$, ¿cuál es $\\log_b\\!\\left(\\dfrac1x\\right)$?', ['$-p$', '$p$', '$\\tfrac1p$', '$p + 1$'], 0, '$\\log_b x^{-1} = -\\log_b x = -p$.'),
            mc('Una sustancia radiactiva tiene vida media de 40 minutos. Si hay 30 mg al inicio, a los 50 minutos quedan', ['$\\approx 12.613$ mg', '$\\approx 17.65$ mg', '$\\approx 10.56$ mg', '$\\approx 22.021$ mg'], 0, 'Cada 40 min se reduce a la mitad: $30 \\cdot (\\tfrac12)^{50/40} = 30 \\cdot 2^{-1.25} \\approx 30 \\cdot 0.4204 \\approx 12.613$ mg.'),
          ],
        },
        {
          id: 'alg-73', title: 'Ecuaciones exponenciales y logarítmicas',
          // Cronograma 2026-2, clase 19 (libro UdeA §7.5). Video: video/clase_ecuaciones_exp_log (Clase 13),
          // entregado; falta su ID de Bunny (clip.bunny + duration).
          // Spec: docs/superpowers/specs/2026-11-07-cuadratico-y-ecuaciones-exp-log-design.md
          clip: { scenes: [
            sc(6, 'Una **ecuación exponencial** tiene la incógnita en el exponente. Si los dos lados se escriben con la **misma base**, basta igualar los exponentes.', { steps: ['$2^{x+3} = 4^{x} = 2^{2x}$', '$x + 3 = 2x \\Rightarrow x = 3$'] }),
            sc(6, 'Si las bases no se pueden igualar, se **toma logaritmo** a los dos lados: el exponente baja como factor.', { steps: ['$5^x = 12 \\Rightarrow x \\ln 5 = \\ln 12$', '$x = \\dfrac{\\ln 12}{\\ln 5} \\approx 1.544$'] }),
            sc(6, 'En una **ecuación logarítmica** se juntan los logaritmos en uno solo con las propiedades y se pasa a forma exponencial.', { steps: ['$\\log_6 x + \\log_6(x + 5) = 2 \\Rightarrow \\log_6[x(x + 5)] = 2$', '$x^2 + 5x = 6^2 \\Rightarrow (x + 9)(x - 4) = 0$'] }),
            sc(6, '**Comprueba siempre** el dominio: el logaritmo solo acepta números positivos. Con $x = -9$ aparece $\\log_6(-9)$, que no existe: es una **solución extraña**. La única solución es $x = 4$.', { steps: ['$x = 4$: $\\log_6 4 + \\log_6 9 = \\log_6 36 = 2$ ✓'] }),
            sc(5, 'Aplicación: con interés continuo $A = Pe^{rt}$. Para saber cuándo se triplica un capital: $e^{rt} = 3 \\Rightarrow t = \\dfrac{\\ln 3}{r}$.', { steps: ['Al 5 %: $t = \\tfrac{\\ln 3}{0.05} \\approx 22$ años'] }),
          ] },
          ex: [
            play('balanza-exponencial', 'Mueve $x$ hasta que la balanza quede en **equilibrio**', {
              rounds: [
                { tex: '9^{x} = 27^{x-1}', txt: '9ˣ = 27ˣ⁻¹', L: x => 9 ** x, R: x => 27 ** (x - 1), x: 3 },
                { tex: '(\\tfrac12)^{x} = 4^{x-3}', txt: '(½)ˣ = 4ˣ⁻³', L: x => 0.5 ** x, R: x => 4 ** (x - 3), x: 2 },
                { tex: '4^{x} = 8', txt: '4ˣ = 8', L: x => 4 ** x, R: () => 8, x: 1.5 },
              ],
            }, '$9^x = 27^{x-1}$ es $3^{2x} = 3^{3x-3}$: $x = 3$. $(\\tfrac12)^x = 4^{x-3}$ es $2^{-x} = 2^{2x-6}$: $x = 2$. $4^x = 8$ es $2^{2x} = 2^3$: $x = \\tfrac32$.',
            { hint: 'Escribe los dos lados como potencias de la misma base (9 y 27 son potencias de 3; ½, 4 y 8 son potencias de 2) e iguala los exponentes. La balanza te dice qué lado pesa más.' }),
            play('balanza-exponencial', 'Equilibra la balanza. Ojo: para algunos $x$ un platillo **no existe**', {
              rounds: [
                { tex: '\\log_2(x + 6) = \\log_2 x + 2', txt: 'log₂(x + 6) = log₂x + 2', L: x => Math.log2(x + 6), R: x => Math.log2(x) + 2, x: 2 },
                { tex: '\\log_3 x + \\log_3(x - 8) = 2', txt: 'log₃x + log₃(x − 8) = 2', L: x => (Math.log(x) + Math.log(x - 8)) / Math.log(3), R: () => 2, x: 9, extra: -1, min: -4, max: 12, step: 1 },
                { tex: '\\log(x + 3) + \\log x = 1', txt: 'log(x + 3) + log x = 1', L: x => Math.log10(x + 3) + Math.log10(x), R: () => 1, x: 2, extra: -5, min: -6 },
              ],
            }, '$\\log_2\\tfrac{x + 6}{x} = 2 \\Rightarrow x + 6 = 4x \\Rightarrow x = 2$. $\\log_3[x(x - 8)] = 2 \\Rightarrow x^2 - 8x - 9 = 0$: $x = 9$ o $x = -1$, pero $\\log_3(-1)$ no existe. $\\log[x(x + 3)] = 1 \\Rightarrow x^2 + 3x - 10 = 0$: $x = 2$; el $-5$ es extraño.',
            { hint: 'Junta los logaritmos en uno solo, pasa a forma exponencial y resuelve. Antes de aceptar un valor, revisa que lo que está dentro de cada logaritmo sea positivo: si no, la balanza se pone roja.' }),
            play('ordena-terminos', 'Ordena los pasos para resolver $3 \\cdot 2^{x} - 5 = 43$', { tex: '3 \\cdot 2^{x} - 5 = 43', chips: ['3 · 2ˣ = 48', '2ˣ = 16', '2ˣ = 2⁴', 'x = 4', '6ˣ = 48', '2ˣ = 38/3'], order: [0, 1, 2, 3], sep: '⇒' },
              'Se despeja la potencia: sumar 5 da $3 \\cdot 2^x = 48$, dividir entre 3 da $2^x = 16 = 2^4$, y $x = 4$. Pegar el 3 a la base ($6^x$) es un error: el 3 multiplica a la potencia, no a la base.',
              { hint: 'Primero despeja la potencia como si fuera una incógnita cualquiera: deshaz la resta y después la multiplicación. El 3 no se puede pegar a la base 2.' }),
            num('Resuelve $4^x = 30$ con logaritmos (redondea a dos decimales)', 2.45,
              '$x \\ln 4 = \\ln 30 \\Rightarrow x = \\dfrac{\\ln 30}{\\ln 4} \\approx \\dfrac{3.401}{1.386} \\approx 2.45$. Tiene sentido: $4^2 = 16$ y $4^3 = 64$.',
              { tol: 0.01, prefix: '$x \\approx$', hint: 'Toma logaritmo natural a los dos lados para que el exponente baje como factor, y despeja x dividiendo.' }),
            num('Un capital crece con interés continuo del 4 % anual: $A = Pe^{0.04t}$. ¿En cuántos años se **duplica**? (dos decimales)', 17.33,
              'Duplicarse es $A = 2P$: $e^{0.04t} = 2 \\Rightarrow 0.04t = \\ln 2 \\Rightarrow t = \\dfrac{0.6931}{0.04} \\approx 17.33$ años.',
              { tol: 0.05, suffix: 'años', hint: 'Duplicarse significa que A = 2P, así que el capital P se cancela. Toma ln a los dos lados y despeja t.' }),
          ],
        },
      ],
    },
  ],
};
