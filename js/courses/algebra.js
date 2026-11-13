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
          // Video subido por el usuario a Bunny el 2026-11-12 (116.5 s); reemplaza al V1 de manimgl
          // (video/clase_alg_u0_v1_que_es, id 4b5c2610-…). Las escenas son el respaldo.
          // Spec 2026-11-11-conjuntos-desde-cero: sin números ni desigualdades; ejemplos de la vida diaria.
          clip: { bunny: 'a82a88d9-270f-4db1-8720-306dd4dcb78e', duration: 116.5, scenes: [
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
          // Video zoom (video/conjunto-zoom-2, 118 s) en Bunny desde el 2026-11-13; reemplaza al V2 de manimgl
          // (video/clase_alg_u0_v2_tipos, id f56e026e-…). Las escenas son el respaldo, con sus mismos ejemplos.
          clip: { bunny: 'de65d162-7fbd-459c-ad71-64f76941ee15', duration: 118, scenes: [
            sc(6, 'El conjunto **vacío** no tiene elementos: $\\varnothing = \\{\\ \\}$. Un conjunto **unitario** tiene uno solo.', { steps: ['Los meses de 32 días: $\\varnothing$', '$\\{x : x \\text{ es la capital de Colombia}\\} = \\{\\text{Bogotá}\\}$', '$\\{\\varnothing\\}$ no es vacío: tiene un elemento'] }),
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
          // Video zoom (video/conjunto-zoom-3, 120 s) en Bunny desde el 2026-11-13; reemplaza al V3 de manimgl
          // (video/clase_alg_u0_v3_operaciones, id 06ed782c-…). Las escenas son el respaldo, con sus mismos ejemplos.
          clip: { bunny: '099c6af5-9a75-470c-bf20-7c1aa88f7268', duration: 120, scenes: [
            sc(6, 'En un **diagrama de Venn** cada conjunto es un círculo dentro del universo $U$; lo común va donde se cruzan.', { steps: ['$U$: siete amigos en el patio', '$A$: juegan fútbol · $B$: tocan un instrumento'] }),
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
                { text: 'En un curso de 40 estudiantes, a 22 les gusta leer, a 18 dibujar y a 7 las dos cosas.', labels: ['leer', 'dibujar'], total: 40, a: 22, b: 18, both: 7 },
              ],
            }, 'Se empieza por el centro: los que están en los dos. Solo perro: $18 - 5 = 13$; solo gato: $12 - 5 = 7$; así van $13 + 5 + 7 = 25$ y quedan $30 - 25 = 5$ sin ninguna mascota. En el curso: 15 solo leen, 7 hacen las dos, 11 solo dibujan y 7 ninguna.',
              { hint: 'Llena primero la zona del centro. Después, a cada grupo réstale esa cantidad para saber cuántos están solo en él. Lo que falte para el total no está en ninguno.' }),
          ],
        },
      ],
    },
    {
      world: 'numeros', title: 'Sistemas numéricos y axiomas',
      lessons: [
        {
          id: 'alg-11', title: 'Los números naturales y los enteros',
          // Parte 1 de sistemas numéricos (spec 2026-11-11-sistemas-numericos-desde-cero): video N1
          // (video/clase_alg_u1_n1_naturales), en Bunny; las escenas son el respaldo. Libro UdeA §1.1.
          clip: { bunny: '44717b9d-7851-4cd6-a19a-d17070db835a', duration: 269, scenes: [
            sc(6, 'Los números también forman **conjuntos**, con letras de doble trazo. Los **naturales** sirven para contar.', { title: '$\\mathbb{N} = \\{1, 2, 3, \\dots\\}$', steps: ['$5 \\in \\mathbb{N}$, $\\;-2 \\notin \\mathbb{N}$, $\\;\\tfrac12 \\notin \\mathbb{N}$'] }),
            sc(6, 'Sumar o multiplicar naturales da otro natural; restar no siempre: $2 - 5$ no es natural.', { title: '$2 - 5 = -3$' }),
            sc(6, 'Los **enteros** agregan el cero y los negativos. Cada entero tiene su **opuesto**, al otro lado del cero.', { title: '$\\mathbb{Z} = \\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$', steps: ['$4 + (-4) = 0$'] }),
            sc(6, 'Todo natural es entero: $\\mathbb{N} \\subseteq \\mathbb{Z}$. Lo que sobra es $\\mathbb{Z} - \\mathbb{N} = \\{\\dots, -2, -1, 0\\}$.', { title: '$\\mathbb{N} \\subseteq \\mathbb{Z}$' }),
          ] },
          ex: [
            play('atrapa-elementos', 'Escribe el resultado de cada operación tocando sus elementos', {
              rounds: [
                { expr: 'A ∩ ℕ', given: ['A = {−3, 0, 2, 7, −1, 5}', 'ℕ = {1, 2, 3, …}'], pool: ['−3', '0', '2', '7', '−1', '5'], members: ['2', '7', '5'] },
                { expr: 'A − ℕ', given: ['A = {−3, 0, 2, 7, −1, 5}', 'ℕ = {1, 2, 3, …}'], pool: ['−3', '0', '2', '7', '−1', '5'], members: ['−3', '0', '−1'] },
              ],
            }, 'Como en la unidad de conjuntos: $A \\cap \\mathbb{N}$ deja los elementos de $A$ que también son naturales, $\\{2, 7, 5\\}$. $A - \\mathbb{N}$ quita de $A$ los naturales y quedan $\\{-3, 0, -1\\}$: los negativos y el cero, que no sirven para contar.',
              { hint: 'Revisa cada número de A: ¿sirve para contar objetos (uno, dos, tres…)? ¿Qué pasa con el cero: cuántos objetos cuenta?' }),
            play('ascensor', 'Lleva el ascensor al piso donde termina cada viaje', {
              min: -5, max: 6,
              rounds: [
                { start: 2, move: -6, text: 'Estás en el piso 2 y bajas 6 pisos' },
                { start: -3, move: 3, text: 'Estás en el sótano 3 y subes 3 pisos' },
                { start: -1, move: -4, text: 'Estás en el sótano 1 y bajas 4 pisos más' },
              ],
            }, 'Subir es sumar y bajar es restar: $2 - 6 = -4$ (pasas por la calle y llegas al sótano 4), $-3 + 3 = 0$ (un número y su opuesto suman cero: vuelves a la calle) y $-1 - 4 = -5$.',
              { hint: 'Cuenta piso por piso desde la banderita. La calle es el 0: al bajar de ella entras a los sótanos, que llevan signo menos. Subir desde un sótano te acerca a la calle.' }),
            play('recta-espejo', 'Pon en la recta el número que describe cada ronda', {
              min: -6, max: 6,
              rounds: [
                { text: 'el opuesto de 5', value: -5 },
                { text: '−(−3)', value: 3 },
                { text: 'el número que sumado con 6 da 0', value: -6 },
                { text: 'el opuesto del opuesto de −1', value: -1 },
                { text: '−(−(−2))', value: -2 },
              ],
            }, 'El opuesto de un número es su reflejo al otro lado del cero: el de $5$ es $-5$. El signo menos delante de un paréntesis también pide el opuesto: $-(-3) = 3$. El número que sumado con $6$ da $0$ es $-6$, porque $6 + (-6) = 0$. Sacar dos veces el opuesto te devuelve al número: $-1$. Y con tres signos menos: $-(-(-2)) = -(2) = -2$.',
              { hint: 'Piensa en el espejo del cero: el opuesto queda a la misma distancia, del otro lado. Un signo menos delante significa «el opuesto de lo que sigue». Con varios signos, resuélvelos de adentro hacia afuera.' }),
            play('pasaporte-numeros', 'Sella el pasaporte de cada número con **todas** las familias donde puede entrar', {
              sets: ['N', 'Z'],
              numbers: [
                { label: '9', in: ['N', 'Z'] }, { label: '−4', in: ['Z'] }, { label: '0', in: ['Z'] },
                { label: '−(−7)', in: ['N', 'Z'] }, { label: '−15', in: ['Z'] }, { label: '1', in: ['N', 'Z'] },
              ],
            }, 'Como $\\mathbb{N} \\subseteq \\mathbb{Z}$, todo natural lleva los dos sellos: $9$, $1$ y $-(-7) = 7$. Los negativos y el cero solo son enteros: $-4$, $-15$ y $0$.',
              { hint: 'Pregunta primero: ¿sirve para contar (1, 2, 3…)? Si sí, lleva los dos sellos, porque todo natural es entero. Resuelve primero los signos dobles.' }),
            play('fuga-de-familia', 'Mete dos fichas a la máquina para que el resultado **se escape** de los naturales', {
              rounds: [
                { set: 'N', op: '−', tiles: [{ label: '6', r: 6, k: 0 }, { label: '2', r: 2, k: 0 }, { label: '11', r: 11, k: 0 }, { label: '9', r: 9, k: 0 }] },
                { set: 'N', op: '−', tiles: [{ label: '8', r: 8, k: 0 }, { label: '3', r: 3, k: 0 }, { label: '1', r: 1, k: 0 }, { label: '13', r: 13, k: 0 }] },
              ],
            }, 'Restar dos naturales no siempre da un natural: si al primero le quitas uno más grande, el resultado es negativo. Por ejemplo, $2 - 11 = -9$ y $1 - 8 = -7$. Por eso hacían falta los enteros.',
              { hint: 'Con la resta, ¿qué pasa si al número de la izquierda le quitas uno más grande? Prueba las fichas en ese orden.' }),
          ],
        },
        {
          id: 'alg-11b', title: 'Los números racionales: fracciones y decimales',
          // Parte 2 de sistemas numéricos: video N2 (video/clase_alg_u1_n2_racionales), en Bunny; las escenas son el respaldo.
          clip: { bunny: 'e7e67f1e-8d21-4585-b990-183a253d62b5', duration: 237, scenes: [
            sc(6, 'Repartir no siempre da un entero: 3 panes entre 4 personas. Las **fracciones** forman los **racionales**.', { title: '$\\mathbb{Q} = \\left\\{\\tfrac{m}{n} : m, n \\in \\mathbb{Z},\\ n \\neq 0\\right\\}$' }),
            sc(6, 'Una fracción tiene muchos nombres: $\\tfrac12 = \\tfrac24 = \\tfrac36$. Y todo entero es racional: $-3 = \\tfrac{-3}{1}$.', { title: '$\\mathbb{Z} \\subseteq \\mathbb{Q}$' }),
            sc(6, 'El decimal de una fracción **termina** o **se repite**: la rayita marca el período.', { steps: ['$\\tfrac34 = 0.75$', '$\\tfrac{2}{11} = 0.\\overline{18}$'] }),
            sc(6, 'Un periódico se vuelve fracción alineando las colas y restando.', { steps: ['$x = 0.\\overline{7}$', '$10x - x = 7$', '$x = \\tfrac79$'] }),
          ] },
          ex: [
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
            play('pasaporte-numeros', 'Sella el pasaporte de cada número con **todas** las familias donde puede entrar', {
              sets: ['N', 'Z', 'Q'],
              numbers: [
                { label: '9', in: ['N', 'Z', 'Q'] }, { label: '−4', in: ['Z', 'Q'] }, { label: '0', in: ['Z', 'Q'] },
                { label: '3/5', in: ['Q'] }, { label: '−1.5', in: ['Q'] }, { label: '12/4', in: ['N', 'Z', 'Q'] },
              ],
            }, 'Las familias están anidadas, $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q}$: quien entra a ℕ entra también a ℤ y a ℚ. $9$ y $\\tfrac{12}{4} = 3$ llevan los tres sellos; $-4$ y $0$ son enteros (y racionales), pero no naturales; $\\tfrac35$ y $-1.5 = -\\tfrac32$ solo son racionales.',
              { hint: 'Un número puede llevar varios sellos. Pregunta en orden: ¿sirve para contar (ℕ)? ¿es un número sin partes, aunque sea negativo o el 0 (ℤ)? ¿se puede escribir como fracción (ℚ)? Simplifica primero las fracciones que parecen raras.' }),
            play('fuga-de-familia', 'Mete dos fichas a la máquina para que el resultado **se escape** de los enteros', {
              rounds: [
                { set: 'Z', op: '÷', tiles: [{ label: '12', r: 12, k: 0 }, { label: '−4', r: -4, k: 0 }, { label: '5', r: 5, k: 0 }, { label: '−6', r: -6, k: 0 }] },
                { set: 'Z', op: '÷', tiles: [{ label: '15', r: 15, k: 0 }, { label: '−3', r: -3, k: 0 }, { label: '4', r: 4, k: 0 }, { label: '−5', r: -5, k: 0 }] },
              ],
            }, 'Dividir enteros no siempre da un entero: $5 \\div 12 = \\tfrac{5}{12}$ y $15 \\div 4 = 3.75$ ya no son enteros. Así nacen los racionales: todos los cocientes de enteros (con divisor distinto de cero).',
              { hint: 'Busca una división que no sea exacta: un número que no quepa un número entero de veces en el otro.' }),
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
            play('ordena-terminos', 'Ordena los pasos para escribir $0.\\overline{45}$ como fracción', { tex: 'x = 0.\\overline{45}', chips: ['100x = 45.4545…', '100x − x = 45', '99x = 45', 'x = 45/99 = 5/11', '10x = 4.5454…', 'x = 45/100'], order: [0, 1, 2, 3], sep: '⇒' },
              'El período tiene dos cifras, así que se multiplica por $100$: $100x = 45.\\overline{45}$. Al restar $x$ desaparece la cola: $99x = 45$ y $x = \\tfrac{45}{99} = \\tfrac{5}{11}$. Multiplicar por $10$ no alinea el período, y $\\tfrac{45}{100}$ sería $0.45$ sin la rayita.',
              { hint: 'Cuenta cuántas cifras tiene el bloque que se repite: si es una, multiplica por 10; si son dos, por 100. Luego resta $x$ para que la cola infinita desaparezca y despeja.' }),
            play('atrapa-elementos', 'Escribe el resultado de cada operación tocando sus elementos', {
              rounds: [
                { expr: 'B − ℤ', given: ['B = {−2, 5/8, 0.4, 7, −1.25, 9/3}', 'ℤ = {…, −2, −1, 0, 1, 2, …}'], pool: ['−2', '5/8', '0.4', '7', '−1.25', '9/3'], members: ['5/8', '0.4', '−1.25'] },
                { expr: 'B ∩ ℕ', given: ['B = {−2, 5/8, 0.4, 7, −1.25, 9/3}', 'ℕ = {1, 2, 3, …}'], pool: ['−2', '5/8', '0.4', '7', '−1.25', '9/3'], members: ['7', '9/3'] },
              ],
            }, 'Todos los elementos de $B$ son racionales. $B - \\mathbb{Z}$ deja los que no son enteros: $\\tfrac58$, $0.4$ y $-1.25$. Cuidado con $\\tfrac93$: vale $3$, así que es entero y además natural; por eso $B \\cap \\mathbb{N} = \\{7, \\tfrac93\\}$.',
              { hint: 'Antes de decidir, simplifica: una fracción puede ser un entero disfrazado. Luego revisa si el número tiene parte decimal o no.' }),
          ],
        },
        {
          id: 'alg-11c', title: 'Los irracionales y los números reales',
          // Parte 3 de sistemas numéricos: video N3 (video/clase_alg_u1_n3_reales), en Bunny; las escenas son el respaldo.
          clip: { bunny: '820f2163-284b-4f5f-bce7-1d47c483de46', duration: 258, scenes: [
            sc(6, 'El lado de un cuadrado de área 2 no es ninguna fracción: es $\\sqrt2$, un número **irracional**. Su decimal nunca termina ni se repite.', { title: '$\\sqrt2 = 1.41421356\\dots$' }),
            sc(6, 'Los racionales y los irracionales juntos forman los **reales**, y no comparten ningún número.', { title: '$\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{I} \\qquad \\mathbb{Q} \\cap \\mathbb{I} = \\varnothing$' }),
            sc(6, 'Cada familia vive dentro de la siguiente.', { title: '$\\mathbb{N} \\subseteq \\mathbb{Z} \\subseteq \\mathbb{Q} \\subseteq \\mathbb{R}$' }),
            sc(6, 'Los reales llenan la **recta**: cada punto es un número, y entre dos números siempre hay otro.', { steps: ['$\\pi = 3.14159\\dots$'] }),
          ] },
          ex: [
            play('acorrala-raiz', 'Acorrala la raíz: cada vez en un tramo más pequeño', {
              rounds: [{ n: 5 }, { n: 10 }], levels: 3,
            }, 'Como $2.2^2 = 4.84 < 5 < 5.29 = 2.3^2$, la raíz de 5 está entre $2.2$ y $2.3$; acercándose más, $2.236 < \\sqrt5 < 2.237$, y lo mismo $3.162 < \\sqrt{10} < 3.163$. Puedes seguir para siempre: las cifras de una raíz no exacta nunca terminan ni se repiten. Por eso es **irracional**.',
              { hint: 'Fíjate en los colores: azul si el número al cuadrado da menos que el de adentro de la raíz, coral si da más. La raíz está justo donde el azul se vuelve coral: toca ese tramo y la lupa lo abre en la siguiente línea.' }),
            play('compas-raiz', 'Elige los lados del rectángulo para que el compás caiga en la banderita', {
              rounds: [{ n: 5 }, { n: 13 }, { n: 8 }, { n: 17 }], max: 4,
            }, 'La diagonal de un rectángulo de lados $a$ y $b$ mide $\\sqrt{a^2 + b^2}$ (Pitágoras), y el compás la acuesta sobre la recta sin cambiar su largo: $1^2 + 2^2 = 5$, $2^2 + 3^2 = 13$, $2^2 + 2^2 = 8$ y $1^2 + 4^2 = 17$. Así se ubica un irracional **exacto** en la recta, aunque su decimal nunca termine.',
              { hint: 'La diagonal al cuadrado es $a^2 + b^2$. Busca dos cuadrados (1, 4, 9, 16) que sumen el número de adentro de la raíz.' }),
            play('atrapa-elementos', 'Escribe el resultado de cada operación tocando sus elementos', {
              rounds: [
                { expr: 'C ∩ 𝕀', given: ['C = {−3, 1/2, √7, 0, π, 0.333…, √9}', '𝕀: los irracionales'], pool: ['−3', '1/2', '√7', '0', 'π', '0.333…', '√9'], members: ['√7', 'π'] },
                { expr: 'C ∩ ℤ', given: ['C = {−3, 1/2, √7, 0, π, 0.333…, √9}', 'ℤ = {…, −2, −1, 0, 1, 2, …}'], pool: ['−3', '1/2', '√7', '0', 'π', '0.333…', '√9'], members: ['−3', '0', '√9'] },
                { expr: 'C ∩ ℚ', given: ['C = {−3, 1/2, √7, 0, π, 0.333…, √9}', 'ℚ: las fracciones de enteros'], pool: ['−3', '1/2', '√7', '0', 'π', '0.333…', '√9'], members: ['−3', '1/2', '0', '0.333…', '√9'] },
              ],
            }, 'Los irracionales de $C$ son $\\sqrt7$ y $\\pi$: sus decimales no terminan ni se repiten. $\\sqrt9 = 3$ es entero, igual que $-3$ y $0$. Y todo lo que no es irracional es racional: $C \\cap \\mathbb{Q} = \\{-3, \\tfrac12, 0, 0.\\overline{3}, \\sqrt9\\}$. Como $\\mathbb{Q} \\cap \\mathbb{I} = \\varnothing$, cada número está en una sola de las dos.',
              { hint: 'Primero simplifica las raíces exactas. Luego pregúntate de cada número: ¿se puede escribir como fracción de enteros? Si su decimal termina o se repite, sí.' }),
            play('cajas-numericas', 'Arrastra cada número a la caja **más pequeña** donde vive', {
              cards: [
                { label: '12', tex: '12', set: 'N' }, { label: '−3', tex: '-3', set: 'Z' }, { label: '0', tex: '0', set: 'Z' },
                { label: '2/5', tex: '\\tfrac25', set: 'Q' }, { label: '0.444…', tex: '0.\\overline{4}', set: 'Q' }, { label: '√49', tex: '\\sqrt{49}', set: 'N' },
                { label: '√5', tex: '\\sqrt5', set: 'I' }, { label: '√6', tex: '\\sqrt6', set: 'I' }, { label: '−8/2', tex: '-\\tfrac82', set: 'Z' },
              ],
            }, 'Cada familia vive dentro de la siguiente: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$, y la caja más pequeña es la que mejor describe al número. $\\sqrt{49} = 7$ y $-\\tfrac82 = -4$ se simplifican antes de decidir; $0.\\overline{4} = \\tfrac49$ es una fracción disfrazada; $\\sqrt5$ y $\\sqrt6$ son raíces no exactas: no son fracciones. Una caja más grande (naranja) no está mal, pero no es la más pequeña.',
              { hint: 'Primero simplifica lo que se pueda: raíces exactas y fracciones que dan un entero. Luego prueba de la caja más pequeña a la más grande: ℕ, ℤ, ℚ. Si no se puede escribir como fracción, va en 𝕀.' }),
            play('lupa-densidad', 'Acerca la lupa y suelta un punto **entre** las dos banderitas', {
              rounds: [
                { a: { label: '√5', value: Math.sqrt(5) }, b: { label: '2.24', value: 2.24 }, view: [2, 3] },
                { a: { label: '0.66', value: 0.66 }, b: { label: '2/3', value: 2 / 3 }, view: [0, 1] },
                { a: { label: 'π', value: Math.PI }, b: { label: '22/7', value: 22 / 7 }, view: [3, 4] },
              ],
            }, 'De lejos parecen el mismo punto, pero son distintos y entre ellos cabe otro: $\\sqrt5 = 2.2360\\ldots < 2.238 < 2.24$, $0.66 < 0.663 < 0.\\overline{6}$ y $\\pi = 3.14159\\ldots < 3.142 < 3.142857\\ldots = \\tfrac{22}{7}$. Por eso $\\tfrac{22}{7}$ no es $\\pi$: solo se le parece. Entre dos reales distintos siempre hay otro (por ejemplo, su promedio): por más que acerques la lupa, nunca quedan pegados.',
              { hint: 'Escribe los dos números con varios decimales y compáralos cifra por cifra: la primera cifra en que se diferencian te dice dónde abrir la lupa. Acerca hasta que las banderitas se separen.' }),
            play('ubica-en-recta', 'Suelta cada número en su lugar de la recta', {
              min: -3, max: 4, tol: 0.15,
              points: [
                { label: '−7/4', tex: '-\\tfrac74', value: -1.75 }, { label: '1/3', tex: '\\tfrac13', value: 0.3333 },
                { label: '√8', tex: '\\sqrt8', value: 2.8284 }, { label: '5/2', tex: '\\tfrac52', value: 2.5 }, { label: '−0.5', tex: '-0.5', value: -0.5 },
              ],
            }, 'Primero conviértelos: $-\\tfrac74 = -1.75$, $\\tfrac13 \\approx 0.33$, $\\sqrt8 \\approx 2.83$ (porque $2.83^2 \\approx 8$), $\\tfrac52 = 2.5$ y $-0.5$ está a medio paso del cero, a la izquierda.',
              { hint: 'Pasa cada número a decimal antes de soltarlo; mientras arrastras, la ficha te dice el valor donde caería. Para una raíz, busca qué decimal multiplicado por sí mismo se acerca al número de adentro.' }),
            play('fuga-de-familia', 'Los irracionales tampoco se cierran: mete dos fichas para que el resultado **se escape**', {
              rounds: [
                { set: 'I', op: '+', tiles: [{ label: '√2', r: 0, k: 1 }, { label: '2√2', r: 0, k: 2 }, { label: '5 − √2', r: 5, k: -1 }, { label: '1 + √2', r: 1, k: 1 }] },
                { set: 'I', op: '×', tiles: [{ label: '√2', r: 0, k: 1 }, { label: '1 + √2', r: 1, k: 1 }, { label: '3√2', r: 0, k: 3 }, { label: '2 + √2', r: 2, k: 1 }] },
              ],
            }, 'Sumar o multiplicar dos irracionales puede dar un racional: $\\sqrt2 + (5 - \\sqrt2) = 5$ y $\\sqrt2 \\cdot 3\\sqrt2 = 6$. Las raíces se cancelan o se multiplican por sí mismas. Por eso 𝕀 no es una familia «cerrada»: los reales son el conjunto completo.',
              { hint: 'Junta fichas cuyas raíces se cancelen al sumar, o que al multiplicarse den $\\sqrt2 \\cdot \\sqrt2 = 2$.' }),
          ],
        },
        {
          id: 'alg-12b', title: 'Axiomas de campo: las reglas de la suma y el producto',
          // Parte 1 de axiomas (spec 2026-11-11-axiomas-desde-cero): video F1 (video/clase_alg_u1_f1_campo), en Bunny;
          // las escenas son el respaldo. Libro UdeA §1.2.
          clip: { bunny: '3c46885f-3797-4cd8-850d-34ad602b9cc5', duration: 350, scenes: [
            sc(6, 'Un **axioma** es una regla que se acepta sin demostrar, como las reglas de un juego. Las letras representan **cualquier** número real.', { title: '$\\forall\\, a, b \\in \\mathbb{R}$', steps: ['«para todo $a$ y $b$ que pertenecen a los reales»'] }),
            sc(6, 'El orden y los paréntesis no cambian una suma ni un producto: **conmutativa** y **asociativa**. La resta no es conmutativa.', { steps: ['$a + b = b + a \\qquad ab = ba$', '$(a + b) + c = a + (b + c) \\qquad (ab)c = a(bc)$'] }),
            sc(6, 'Los **neutros** no cambian nada; los **inversos** llevan al neutro. El $0$ no tiene recíproco.', { steps: ['$a + 0 = a \\qquad a \\cdot 1 = a$', '$a + (-a) = 0 \\qquad a \\cdot \\tfrac{1}{a} = 1\\ \\ (a \\neq 0)$'] }),
            sc(6, 'La **distributiva** reparte un factor sobre una suma: es partir un rectángulo en dos.', { title: '$a(b + c) = ab + ac$' }),
          ] },
          ex: [
            play('inversos-gemelos', 'Arma el **opuesto** de cada número: la suma debe dar el neutro $0$', {
              op: '+',
              rounds: [
                { label: '−7', v: -7, sol: '7' }, { label: '5/3', v: 5 / 3, sol: '−5/3' },
                { label: '−0.25', v: -0.25, sol: '1/4 = 0.25' }, { label: '√6', v: Math.sqrt(6), sol: '−√6' },
              ],
            }, 'El opuesto de $a$ es $-a$: su reflejo al otro lado del cero, y $a + (-a) = 0$. Así, $-7 + 7 = 0$, $\\tfrac53 + (-\\tfrac53) = 0$, $-0.25 + 0.25 = 0$ (y $0.25 = \\tfrac14$) y $\\sqrt6 + (-\\sqrt6) = 0$. Solo cambia el signo.',
              { hint: 'Piensa en el espejo del cero: el opuesto está a la misma distancia, del otro lado. ¿Qué cambia y qué se queda igual? Un decimal se puede escribir antes como fracción.' }),
            play('inversos-gemelos', 'Arma el **recíproco** de cada número: el producto debe dar el neutro $1$', {
              op: '×',
              rounds: [
                { label: '3/8', v: 3 / 8, sol: '8/3' }, { label: '−6', v: -6, sol: '−1/6' }, { label: '0.2', v: 0.2, sol: '5' },
                { label: '1', v: 1, sol: '1' }, { label: '0', v: 0, sol: 'no tiene' },
              ],
            }, 'El recíproco de $a$ es $\\tfrac1a$, y $a \\cdot \\tfrac1a = 1$: se **voltea** la fracción. $\\tfrac38 \\cdot \\tfrac83 = 1$; $-6 = -\\tfrac61$, así que su recíproco es $-\\tfrac16$ (el signo se queda); $0.2 = \\tfrac15$ y su recíproco es $5$; el $1$ es su propio recíproco. El $0$ no tiene: $0$ por cualquier número da $0$, nunca $1$.',
              { hint: 'Escribe el número como fracción (un entero va sobre 1, un decimal en décimas) y voltéala. El signo se queda igual: compruébalo en la máquina. ¿Existe algo que multiplicado por 0 dé 1?' }),
            play('corta-rectangulo', 'Usa la distributiva: corta cada rectángulo para que la cuenta salga de cabeza', {
              rounds: [{ h: 8, w: 14, piece: 80 }, { h: 7, w: 23, piece: 140 }, { h: 9, w: 12, piece: 90 }],
            }, 'Cortar el rectángulo es repartir el factor: $8 \\cdot 14 = 8 \\cdot (10 + 4) = 8 \\cdot 10 + 8 \\cdot 4 = 80 + 32 = 112$. Igual $7 \\cdot 23 = 7 \\cdot 20 + 7 \\cdot 3 = 140 + 21 = 161$ y $9 \\cdot 12 = 9 \\cdot 10 + 9 \\cdot 2 = 90 + 18 = 108$. Es la distributiva: $a(b + c) = ab + ac$.',
              { hint: 'El área de una pieza es alto × ancho. ¿Cuántas columnas de cuadritos necesitas para que la pieza tenga el área pedida? Las decenas hacen fácil la cuenta.' }),
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
            num('Calcula de cabeza, sin calculadora: $4 \\cdot 19 \\cdot 25$', 1900,
              'Con la **conmutativa** se cambia el orden y con la **asociativa** se agrupa: $4 \\cdot 19 \\cdot 25 = 19 \\cdot (4 \\cdot 25) = 19 \\cdot 100 = 1900$.',
              { tol: 0.5, hint: 'No tienes que multiplicar en el orden en que aparecen. ¿Qué dos factores, juntos, dan un número redondo?' }),
          ],
        },
        {
          id: 'alg-12c', title: 'Consecuencias de los axiomas: restar, dividir y los signos',
          // Parte 2 de axiomas: video F2 (video/clase_alg_u1_f2_consecuencias), en Bunny; las escenas son el respaldo.
          clip: { bunny: '01a50ba2-7dff-4a96-bfee-8a76c4a2d3d4', duration: 193, scenes: [
            sc(6, 'Restar es sumar el **opuesto**; dividir es multiplicar por el **recíproco**. Por eso no se divide entre $0$.', { steps: ['$a - b = a + (-b)$', '$a \\div b = a \\cdot \\tfrac1b \\quad (b \\neq 0)$'] }),
            sc(6, 'Cualquier número por cero da cero, y la ley de los signos sale de los axiomas.', { steps: ['$a \\cdot 0 = 0$', '$(-a)b = -(ab) \\qquad (-a)(-b) = ab$'] }),
            sc(6, 'La **ley cancelativa**: lo mismo a los dos lados se puede quitar (si multiplica, que no sea $0$).', { steps: ['$a + b = a + c \\Rightarrow b = c$', '$ab = ac,\\ a \\neq 0 \\Rightarrow b = c$'] }),
          ] },
          ex: [
            play('arma-producto', 'Mete fichas a la máquina hasta que el producto dé la meta', {
              tiles: [-2, 5, -1, 3, -4, 0],
              rounds: [{ target: 8 }, { target: -30 }, { target: 60 }],
            }, 'El signo de un producto depende de cuántos factores negativos tiene: una cantidad par da positivo y una impar, negativo. Por ejemplo $(-2)(-4) = 8$ (dos negativos), $(-2) \\cdot 5 \\cdot 3 = -30$ (uno) y $5 \\cdot 3 \\cdot (-4)(-1) = 60$ (dos). Y el $0$ anula todo: $a \\cdot 0 = 0$.',
              { hint: 'Primero decide el signo: para un resultado positivo necesitas una cantidad par de fichas negativas; para uno negativo, impar. Después ajusta el tamaño con los valores. Ojo con el 0: si entra a la máquina, todo da 0.' }),
            play('cancela-balanza', 'Deja la $x$ sola: quita de los dos platillos fichas iguales', {
              rounds: [
                { op: '+', left: ['x', '8', '−3'], right: ['−3', '15', '8'], ans: 'x = 15' },
                { op: '·', left: ['−2', 'x', '5'], right: ['5', '−7', '−2'], ans: 'x = −7' },
                { op: '+', left: ['√2', 'x', '1/4'], right: ['1/4', '√2', '−6'], ans: 'x = −6' },
              ],
            }, 'Es la **ley cancelativa**: si $a + b = a + c$, entonces $b = c$; y si $ab = ac$ con $a \\neq 0$, también $b = c$. De $x + 8 + (-3) = -3 + 15 + 8$ se quitan el $8$ y el $-3$ y queda $x = 15$. De $(-2) \\cdot x \\cdot 5 = 5 \\cdot (-7) \\cdot (-2)$ queda $x = -7$. Con raíces y fracciones funciona igual: $x = -6$.',
              { hint: 'Busca la misma ficha en los dos platillos: quitar lo mismo de los dos lados no rompe el equilibrio. Toca primero la de la izquierda y luego su gemela de la derecha. El orden de las fichas no importa (conmutativa).' }),
            play('ordena-terminos', 'Ordena los pasos que demuestran que $(-1) \\cdot a$ es el opuesto de $a$', {
              tex: 'a + (-1) \\cdot a = 0',
              chips: ['a + (−1) · a', '1 · a + (−1) · a', '(1 + (−1)) · a', '0 · a', '0', '(1 − 1) + a', '−a · a'],
              order: [0, 1, 2, 3, 4], sep: '=',
            }, 'Se escribe $a$ como $1 \\cdot a$ (neutro), se saca el factor $a$ (distributiva), $1 + (-1) = 0$ (inverso) y $0 \\cdot a = 0$. Como $a + (-1)a = 0$, el número $(-1)a$ es el opuesto de $a$: $(-1) \\cdot a = -a$. Multiplicar por $-1$ refleja en el espejo del cero.',
              { hint: 'Empieza por la expresión de la izquierda y en cada paso usa un solo axioma: primero el neutro del producto, luego la distributiva al revés (sacar factor común), después el inverso y al final lo que pasa al multiplicar por cero.' }),
            num('Divide multiplicando por el recíproco: $\\tfrac56 \\div \\tfrac{10}{9}$ (escribe una fracción o un decimal)', 0.75,
              'Dividir es multiplicar por el recíproco: $\\tfrac56 \\div \\tfrac{10}{9} = \\tfrac56 \\cdot \\tfrac{9}{10} = \\tfrac{45}{60} = \\tfrac34 = 0.75$.',
              { tol: 0.001, answerText: '3/4', hint: 'Voltea la segunda fracción y multiplica numerador con numerador y denominador con denominador. Al final simplifica.' }),
          ],
        },
        {
          id: 'alg-12d', title: 'Axiomas de orden y valor absoluto',
          // Parte 3 de axiomas: video F3 (video/clase_alg_u1_f3_orden), en Bunny; las escenas son el respaldo. Libro UdeA §1.3.
          clip: { bunny: '33375c84-4d32-49ce-80de-b0e5299ca8ef', duration: 220, scenes: [
            sc(6, 'Todo real es **positivo**, **cero** o **negativo** (tricotomía). $a < b$ quiere decir que $b - a$ es positivo: $b$ está más a la derecha.', { steps: ['$a < b \\iff b - a > 0$', '$\\le$: «menor o igual»'] }),
            sc(6, 'Sumar conserva el orden; multiplicar por un positivo también; por un **negativo** lo **voltea**.', { steps: ['$a < b,\\ c > 0 \\Rightarrow ac < bc$', '$a < b,\\ c < 0 \\Rightarrow ac > bc$'] }),
            sc(6, 'El **valor absoluto** es la distancia al cero: nunca es negativo. $|b - a|$ es la distancia entre $a$ y $b$.', { title: '$|a| = a$ si $a \\ge 0$, $\\;|a| = -a$ si $a < 0$' }),
          ] },
          ex: [
            play('tren-ordenado', 'Ordena cada tren de menor a mayor', {
              rounds: [
                { items: [{ label: '3', v: 3 }, { label: '−7', v: -7 }, { label: '0', v: 0 }, { label: '−2', v: -2 }, { label: '−10', v: -10 }] },
                { items: [{ label: '0.6', v: 0.6 }, { label: '2/3', v: 2 / 3 }, { label: '−1/2', v: -0.5 }, { label: '5/8', v: 0.625 }, { label: '−0.45', v: -0.45 }] },
                { items: [{ label: '√5', v: Math.sqrt(5) }, { label: '9/4', v: 2.25 }, { label: '2.2', v: 2.2 }, { label: '7/3', v: 7 / 3 }, { label: 'π − 1', v: Math.PI - 1 }] },
              ],
            }, '$a < b$ quiere decir que $b - a$ es positivo: $b$ queda a la derecha. Entre negativos, el más lejano del cero es el menor: $-10 < -7 < -2 < 0 < 3$. Con fracciones conviene pasar a decimal: $-\\tfrac12 < -0.45 < 0.6 < \\tfrac58 = 0.625 < \\tfrac23 = 0.\\overline{6}$. Y con irracionales: $\\pi - 1 \\approx 2.14 < 2.2 < \\sqrt5 \\approx 2.236 < \\tfrac94 = 2.25 < \\tfrac73 \\approx 2.33$.',
              { hint: 'Imagina cada número en la recta: el menor va a la izquierda. Con negativos, el que está más lejos del cero es el más pequeño. Pasa fracciones y raíces a decimal y compara cifra por cifra.' }),
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
      ],
    },
    {
      world: 'razones', title: 'Razones, proporciones y porcentajes',
      // Spec 2026-11-11-razones-desde-cero: razones (R1), proporciones (R2) y regla de tres (R3), y porcentajes.
      lessons: [
        {
          id: 'alg-12', title: 'Razones: comparar dividiendo',
          // Parte 1 de razones y proporciones (spec 2026-11-11-razones-desde-cero): video R1
          // (video/clase_alg_u2_r1_razones). Escenas de respaldo hasta tener su ID de Bunny. Reemplaza a la Clase 2, A3 y E3.
          clip: { scenes: [
            sc(6, 'Dos cantidades se comparan **restando** (cuánto más hay) o **dividiendo** (cuántas veces cabe una en la otra). La **razón** compara dividiendo.', { title: '$a : b = \\dfrac{a}{b}$', steps: ['12 y 4: $12 - 4 = 8$ de diferencia, pero $\\tfrac{12}{4} = 3$ veces'] }),
            sc(6, '$a : b$ se lee «$a$ es a $b$». El orden importa (la división no conmuta) y $b$ no puede ser 0.', { steps: ['18 niñas y 12 niños: $18 : 12 = 3 : 2$', 'Por cada 3 niñas hay 2 niños'] }),
            sc(6, 'Razones **equivalentes**: se multiplican o se dividen los dos términos por el mismo número, como las fracciones. Sumar lo mismo a los dos **cambia** la razón.', { steps: ['$3 : 2 = 6 : 4$, pero $3 : 2 \\ne 4 : 3$'] }),
            sc(6, 'Con $3 : 2$ las niñas son $\\tfrac35 = 0.6$ del grupo (parte al todo). Con unidades distintas la razón da rapidez o precio por unidad; la **escala** compara el mapa con la realidad.', { steps: ['180 km en 3 h: 60 km/h', 'Escala $1 : 100\\,000$: 1 cm del mapa es 1 km real'] }),
          ] },
          ex: [
            play('limonada', 'Prepara una jarra grande que sepa **igual** que el modelo', { base: [2, 3], minLemons: 4, maxEach: 12 },
              'Una **razón** compara dos cantidades por cociente: $2 : 3$ limones por vasos. Toda mezcla con la misma razón ($4 : 6$, $6 : 9$, …) sabe igual: son razones **equivalentes**.',
              { hint: 'Para que sepa igual, limones y vasos se multiplican por el mismo número: si duplicas los limones, duplica también los vasos.' }),
            play('bolsa-razon', 'Llena la bolsa con las bolas que pide cada ronda', {
              max: 20,
              rounds: [
                { text: 'Por cada 4 rojas hay 3 azules, y hay 12 rojas', red: 12, blue: 9 },
                { text: 'rojas : azules = 2 : 3, con 20 bolas en total', red: 8, blue: 12 },
                { text: '1 de cada 4 bolas es roja, y hay 6 azules', red: 2, blue: 6 },
                { text: 'Hay el doble de azules que de rojas, y 15 bolas en total', red: 5, blue: 10 },
              ],
            }, '**Parte a parte**: $4 : 3$ con 12 rojas es multiplicar por 3, así que hay $3 \\cdot 3 = 9$ azules. $2 : 3$ reparte la bolsa en $2 + 3 = 5$ partes; $20 \\div 5 = 4$ por parte: 8 rojas y 12 azules. **Parte al todo**: «1 de cada 4» es roja, así que por cada roja hay 3 azules; con 6 azules hay 2 rojas. El doble de azules es $1 : 2$, tres partes de $15 \\div 3 = 5$: 5 rojas y 10 azules.',
              { hint: 'Fíjate si la razón compara rojas con azules (parte a parte) o una parte con toda la bolsa (parte al todo). Luego busca por cuánto se multiplica cada término de la razón.' }),
            play('estira-foto', 'Amplía cada foto al ancho pedido **sin deformarla**', {
              step: 0.5, max: 12,
              rounds: [{ w0: 4, h0: 5, w: 8, h: 10 }, { w0: 6, h0: 4, w: 9, h: 6 }, { w0: 2, h0: 5, w: 3, h: 7.5 }],
            }, 'La foto no se deforma si ancho : alto sigue siendo la misma razón: $4 : 5 = 8 : 10$ (los dos por 2), $6 : 4 = 9 : 6$ (los dos por 1.5) y $2 : 5 = 3 : 7.5$ (los dos por 1.5). Sumarle al alto lo mismo que al ancho (de 4 a 8 y de 5 a 9) deja la foto alargada.',
              { hint: 'No mires cuánto le sumaron al ancho sino **por cuánto se multiplicó**. El alto se multiplica por ese mismo número; mira si el zorrito queda redondo.' }),
            num('En un mapa a escala $1 : 200\\,000$ dos pueblos están a 7 cm. ¿A cuántos kilómetros están en la realidad?', 14,
              '$1 : 200\\,000$ quiere decir que 1 cm del mapa son $200\\,000$ cm reales, es decir $2\\,000$ m o 2 km. Entonces 7 cm del mapa son $7 \\cdot 2 = 14$ km.',
              { suffix: 'km', hint: 'Averigua cuántos kilómetros reales representa 1 cm del mapa (1 m tiene 100 cm y 1 km tiene 1000 m). Luego multiplica por la distancia medida en el mapa.' }),
            num('Una bolsa de 5 kg de fríjol cuesta 13 500 pesos y una de 2 kg cuesta 5 600. ¿Cuánto cuesta un kilo en la bolsa que sale más barata por kilo?', 2700,
              'El precio por kilo es una razón con unidades (pesos/kg): $13\\,500 \\div 5 = 2\\,700$ y $5\\,600 \\div 2 = 2\\,800$. La bolsa grande sale más barata por kilo: 2 700 pesos.',
              { suffix: 'pesos', hint: 'Para comparar bolsas de distinto tamaño, compara lo mismo: divide el precio de cada bolsa entre sus kilos.' }),
          ],
        },
        {
          id: 'alg-12e', title: 'Proporciones y magnitudes proporcionales',
          // Parte 2 (spec 2026-11-11-razones-desde-cero): video R2 (video/clase_alg_u2_r2_proporciones). Escenas de respaldo.
          clip: { scenes: [
            sc(6, 'Una **proporción** es la igualdad de dos razones: «$a$ es a $b$ como $c$ es a $d$». $a$ y $d$ son los **extremos**; $b$ y $c$, los **medios**.', { title: '$\\dfrac{a}{b} = \\dfrac{c}{d}$', steps: ['$\\dfrac{4}{6} = \\dfrac{10}{15}$: las dos valen $\\tfrac23$'] }),
            sc(6, 'Propiedad fundamental: producto de extremos = producto de medios. Con ella se halla un término desconocido.', { title: '$\\dfrac{a}{b} = \\dfrac{c}{d} \\iff ad = bc$', steps: ['$\\dfrac{x}{8} = \\dfrac{9}{12} \\Rightarrow 12x = 72 \\Rightarrow x = 6$'] }),
            sc(6, '**Directamente proporcionales**: el cociente $y/x$ es constante y la gráfica es una recta por el origen. **Inversamente**: el producto $xy$ es constante y la gráfica es una curva.', { steps: ['$y = kx \\qquad xy = k$'] }),
            sc(6, '**Reparto proporcional**: se suman las partes y el total se reparte en esa razón.', { steps: ['45 000 en $2 : 3 : 4$: 9 partes de 5 000', '10 000, 15 000 y 20 000'] }),
          ] },
          ex: [
            play('balanza-proporcion', 'Encuentra $x$ para que la balanza quede en equilibrio', { a: 3, b: 5, d: 20, min: 0, max: 30 },
              'Una **proporción** es la igualdad de dos razones: $\\dfrac{a}{b} = \\dfrac{c}{d}$ si y solo si $ad = bc$. Aquí $3 \\cdot 20 = 5x$, así que $x = 12$.',
              { hint: 'En una proporción los productos cruzados son iguales: multiplica en cruz y despeja $x$. También puedes ver por cuánto se multiplicó el 5 para llegar al 20.' }),
            play('sombra-arbol', 'Halla la altura del árbol con la sombra de un palo', {
              step: 0.5, max: 12,
              rounds: [{ stick: 2, shadow: 3, treeShadow: 12, tree: 8 }, { stick: 1.5, shadow: 2, treeShadow: 10, tree: 7.5 }, { stick: 2.5, shadow: 1, treeShadow: 4, tree: 10 }],
            }, 'A la misma hora los rayos del sol llegan paralelos, así que altura y sombra forman la misma razón: $\\dfrac{2}{3} = \\dfrac{h}{12} \\Rightarrow 3h = 24,\\ h = 8$; $\\dfrac{1.5}{2} = \\dfrac{h}{10} \\Rightarrow 2h = 15,\\ h = 7.5$; $\\dfrac{2.5}{1} = \\dfrac{h}{4} \\Rightarrow h = 10$.',
              { hint: 'Escribe la proporción «altura del palo es a su sombra como altura del árbol es a su sombra» y usa los productos cruzados. Si la sombra del árbol es varias veces la del palo, su altura también.' }),
            play('cuadrado-media', 'Encuentra el lado del cuadrado con la misma área que el rectángulo $4 \\times 25$', { w: 4, h: 25, tol: 0.2 },
              'La **media proporcional** entre 4 y 25 es el $x$ con $\\dfrac{4}{x} = \\dfrac{x}{25}$: $x^2 = 100$, $x = 10$. Geométricamente, es el lado del cuadrado con la misma área que el rectángulo $4 \\times 25$.',
              { hint: 'Calcula el área del rectángulo. El cuadrado debe tener esa misma área, así que su lado es el número que multiplicado por sí mismo la da.' }),
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
            play('reparto', 'Reparte 1 200 000 en partes proporcionales a 2, 3 y 5', { total: 1200000, parts: [2, 3, 5], tol: 0.02 },
              '**Reparto proporcional**: $2 + 3 + 5 = 10$ partes, cada una vale $1\\,200\\,000 \\div 10 = 120\\,000$. Las partes son $240\\,000$, $360\\,000$ y $600\\,000$.',
              { hint: 'Suma los números de la proporción para saber en cuántas partes iguales se corta el total. Luego cada persona se lleva tantas partes como diga su número.' }),
          ],
        },
        {
          id: 'alg-12f', title: 'Regla de tres simple y compuesta',
          // Parte 3 (spec 2026-11-11-razones-desde-cero): video R3 (video/clase_alg_u2_r3_regla_tres). Escenas de respaldo.
          clip: { scenes: [
            sc(6, 'La **regla de tres** resuelve una proporción con tres datos conocidos. Se arma una tabla: una columna por magnitud y una fila por situación.', { steps: ['4 kg cuestan 10 000; ¿cuánto cuestan 7 kg?'] }),
            sc(6, '**Directa**: si una magnitud crece, la otra también. Se reduce a la unidad o se igualan los cocientes.', { steps: ['1 kg: $10\\,000 \\div 4 = 2\\,500$', '7 kg: $7 \\cdot 2\\,500 = 17\\,500$'] }),
            sc(6, '**Inversa**: si una crece, la otra decrece; lo que se conserva es el **producto**.', { steps: ['Comida para 8 personas 15 días: $8 \\cdot 15 = 120$', '12 personas: $12x = 120 \\Rightarrow x = 10$ días'] }),
            sc(6, '**Compuesta**: con varias magnitudes se cambia una a la vez y cada una decide si es directa o inversa.', { steps: ['3 impresoras, 900 hojas, 5 min', '5 impresoras, 1 800 hojas: $5 \\cdot \\tfrac35 \\cdot 2 = 6$ min'] }),
          ] },
          ex: [
            play('arma-regla', 'Arma la regla de tres de cada problema', {
              problems: [
                { text: 'Un ciclista recorre 150 km en 5 horas. ¿Cuántos km recorre en 7 horas?', kind: 'directa',
                  chips: [{ label: '150 km', mag: 0, row: 0 }, { label: '5 h', mag: 1, row: 0 }, { label: 'x', mag: 0, row: 1 }, { label: '7 h', mag: 1, row: 1 }] },
                { text: '10 pintores pintan un colegio en 18 días. ¿Cuántos días tardan 12 pintores?', kind: 'inversa',
                  chips: [{ label: '10 pintores', mag: 0, row: 0 }, { label: '18 días', mag: 1, row: 0 }, { label: '12 pintores', mag: 0, row: 1 }, { label: 'x', mag: 1, row: 1 }] },
              ],
            }, 'La **regla de tres** busca el cuarto término de una proporción. Cada columna lleva una magnitud y cada fila una situación. Es **directa** si al duplicar una magnitud la otra también se duplica (se conserva el cociente; flechas paralelas): $\\dfrac{150}{x} = \\dfrac{5}{7}$. Es **inversa** si al duplicar una la otra se reduce a la mitad (se conserva el producto; flechas cruzadas): $10 \\cdot 18 = 12\\,x$, así que $x = 15$ días.',
              { hint: 'Pon cada magnitud en su columna (km con km, horas con horas) y cada situación en su fila. Para el tipo, imagina que una magnitud se duplica: ¿la otra se duplica o se reduce a la mitad?' }),
            play('bascula', 'Fija el precio de 5 kg de manzanas', { knownKg: 3, knownPrice: 12000, askKg: 5, max: 40000, step: 500, tol: 200 },
              'Kilos y precio son directamente proporcionales: $\\dfrac{3}{5} = \\dfrac{12\\,000}{x}$, así que $x = \\dfrac{12\\,000 \\cdot 5}{3} = 20\\,000$. Cada kilo cuesta 4 000.',
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
          id: 'alg-13', title: 'Porcentajes: qué son y cómo se calculan',
          // Parte 1 de porcentajes (spec 2026-11-11-porcentajes-desde-cero): video C1 (video/clase_alg_u2_c1_porcentajes).
          // Escenas de respaldo hasta tener su ID de Bunny. Reemplaza a los dos videos viejos de porcentajes y descuentos.
          clip: { scenes: [
            sc(6, '«Por ciento» quiere decir **de cada 100**. Un porcentaje es una fracción con denominador 100.', { title: '$35\\% = \\dfrac{35}{100} = 0.35$', steps: ['$\\tfrac12 = 50\\%,\\ \\tfrac14 = 25\\%,\\ \\tfrac15 = 20\\%,\\ \\tfrac1{10} = 10\\%$'] }),
            sc(6, 'Es una razón parte : todo escalada para que el todo sea 100.', { steps: ['9 de 25 usan gafas: $\\dfrac{9}{25} = \\dfrac{36}{100} = 36\\%$'] }),
            sc(6, 'La proporción $\\dfrac{\\text{parte}}{\\text{todo}} = \\dfrac{p}{100}$ responde las tres preguntas.', { steps: ['15 % de 80: $80 \\cdot 0.15 = 12$', '18 de 72: $\\tfrac{18}{72} = 0.25 = 25\\%$', '30 es el 40 % de $30 \\div 0.4 = 75$'] }),
            sc(5, 'Hay porcentajes mayores que 100 y menores que 1.', { steps: ['150 % de 40 = 60', '0.5 % de 2 000 = 10'] }),
          ] },
          ex: [
            play('pinta-personas', 'Pinta a las personas que pide cada ronda', {
              rounds: [
                { total: 20, pct: 35, what: 'van en bicicleta' },
                { total: 25, pct: 12, what: 'tienen perro' },
                { total: 40, pct: 75, what: 'desayunaron' },
                { total: 8, pct: 12.5, what: 'son zurdos' },
              ],
            }, 'El porcentaje es de cada 100, así que se pasa al total del grupo: parte $= \\text{total} \\cdot \\tfrac{p}{100}$. $20 \\cdot 0.35 = 7$, $25 \\cdot 0.12 = 3$, $40 \\cdot 0.75 = 30$ y $8 \\cdot 0.125 = 1$.',
              { hint: 'Pasa el porcentaje a decimal (o a fracción) y multiplícalo por las personas del grupo. Con 25 personas, cada persona es el 4 %; con 20, cada una es el 5 %.' }),
            play('cuadricula-cien', 'Pinta en la cuadrícula el porcentaje que pide cada ronda', { rounds: [{ ask: '42 %', count: 42 }, { ask: '2/5', count: 40 }, { ask: '0.06', count: 6 }] },
              'Por ciento es «de cada 100»: $42\\%$ son 42 casillas de 100. Las fracciones y los decimales se pasan a centésimas: $\\tfrac25 = \\tfrac{40}{100} = 40\\%$ y $0.06 = \\tfrac{6}{100} = 6\\%$.',
              { hint: 'La cuadrícula tiene 100 casillas: cada una es el 1 %. Pasa fracciones y decimales a «de cada 100» antes de pintar.' }),
            play('rueda-porcentaje', 'Gira la aguja hasta cubrir la parte pedida y lee el porcentaje', { rounds: [{ part: 51, whole: 170 }, { part: 63, whole: 180 }, { part: 26.4, whole: 240 }], tol: 1 },
              'Qué porcentaje es $B$ de $C$: $p = \\dfrac{100 \\cdot B}{C}$. Así, $\\dfrac{100 \\cdot 51}{170} = 30\\%$, $\\dfrac{100 \\cdot 63}{180} = 35\\%$ y $\\dfrac{100 \\cdot 26.4}{240} = 11\\%$.',
              { hint: 'Divide la parte entre el total y multiplica por 100. Mientras giras, compara la parte cubierta con la que pide la ronda.' }),
            play('cruz-porcentaje', 'Arma la cruz del porcentaje de cada problema', {
              problems: [
                { text: 'Halla el 12 % de 8 000 pesos', chips: [{ label: '12', cell: 'p' }, { label: '8 000', cell: 'C' }, { label: '?', cell: 'B' }] },
                { text: '¿De qué número es 48 el 8 %?', chips: [{ label: '8', cell: 'p' }, { label: '48', cell: 'B' }, { label: '?', cell: 'C' }] },
                { text: '¿De qué número es 45 el 125 %?', chips: [{ label: '125', cell: 'p' }, { label: '45', cell: 'B' }, { label: '?', cell: 'C' }, { label: '25', cell: null }] },
              ],
            }, 'La cruz es la regla de tres $\\dfrac{100}{C} = \\dfrac{p}{B}$: $p$ es el porcentaje, $C$ el total y $B$ la parte. El 12 % de 8 000 es $B = \\dfrac{12 \\cdot 8\\,000}{100} = 960$; si 48 es el 8 %, $C = \\dfrac{100 \\cdot 48}{8} = 600$; y si 45 es el $125\\%$, $C = \\dfrac{100 \\cdot 45}{125} = 36$ (la parte es mayor que el total porque pasa del 100 %).',
              { hint: 'El total siempre va con el 100 % y la parte con su porcentaje. Si dice «el p % más», el número dado ya es más que el total: su porcentaje es 100 + p.' }),
            play('mezcla', 'Añade agua hasta que el alcohol sea el 20 % de la mezcla', { solute: 40, target: 20, step: 10, max: 400 },
              'Los 40 g de alcohol son el $20\\%$ de la mezcla, así que la mezcla pesa $C = \\dfrac{100 \\cdot 40}{20} = 200$ g; el agua es lo que falta: $200 - 40 = 160$ g.',
              { hint: 'El alcohol no cambia: solo agregas agua. Pregúntate de qué peso total son 40 g el 20 % (la quinta parte), y el agua es lo que falta para llegar.' }),
          ],
        },
        {
          id: 'alg-13c', title: 'Aumentos y descuentos',
          // Parte 2 (spec 2026-11-11-porcentajes-desde-cero): video C2 (video/clase_alg_u2_c2_aumentos). Escenas de respaldo.
          clip: { scenes: [
            sc(6, 'Un descuento del 25 % deja pagar el 75 %: se multiplica por el **factor** $0.75$ (distributiva).', { title: '$60\\,000 \\cdot (1 - 0.25) = 45\\,000$' }),
            sc(6, 'Aumentar $r\\%$ es multiplicar por $1 + \\tfrac{r}{100}$; descontar, por $1 - \\tfrac{r}{100}$.', { steps: ['IVA del 19 %: $50\\,000 \\cdot 1.19 = 59\\,500$'] }),
            sc(6, 'Para volver al precio de antes se **divide** entre el factor, no se resta el porcentaje.', { steps: ['$71\\,400 \\div 1.19 = 60\\,000$'] }),
            sc(6, 'El cambio porcentual se mide sobre el valor de antes.', { title: '$\\dfrac{\\text{nuevo} - \\text{viejo}}{\\text{viejo}} \\cdot 100$', steps: ['$2\\,500 \\to 3\\,000$: $+20\\%$; de vuelta: $-16.7\\%$'] }),
          ] },
          ex: [
            play('porcentaje-cambio', 'Fija en qué porcentaje cambió cada cantidad', {
              rounds: [{ from: 40, to: 50, unit: 'personas' }, { from: 50, to: 40, unit: 'personas' }, { from: 80, to: 200, unit: 'kg' }, { from: 120, to: 90, unit: 'minutos' }],
            }, 'El cambio se mide sobre el valor de antes: $\\tfrac{50 - 40}{40} = 0.25$ es $+25\\%$, pero $\\tfrac{40 - 50}{50} = -0.2$ es $-20\\%$ (no es simétrico). $\\tfrac{200 - 80}{80} = 1.5$ es $+150\\%$ y $\\tfrac{90 - 120}{120} = -0.25$ es $-25\\%$.',
              { hint: 'Resta lo nuevo menos lo viejo y divide entre lo viejo, que es el 100 %. Si bajó, el cambio es negativo.' }),
            play('estira-barra', 'Estira o encoge la barra hasta lo que pide cada ronda', {
              max: 200,
              rounds: [
                { base: 250, text: 'El 60 % más de 250', pct: 160 },
                { base: 400, text: 'El 15 % menos de 400', pct: 85 },
                { base: 90, text: 'El 40 % más de 90', pct: 140 },
                { base: 300, text: 'Lo que queda de 300 si se le quita el 35 %', pct: 65 },
              ],
            }, 'La cantidad original es el $100\\%$. «El $60\\%$ más» la estira al $160\\%$ ($250 \\cdot 1.6 = 400$); «el $15\\%$ menos» la deja en el $85\\%$ ($340$); «el $40\\%$ más» de 90 es el $140\\%$ ($126$), y quitar el $35\\%$ deja el $65\\%$ ($195$).',
              { hint: 'La barra punteada es el 100 %. Si la ronda dice «más», la barra crece por encima de 100; si dice «menos» o «quita», queda por debajo. Una fracción como un cuarto o un quinto se pasa a «de cada 100».' }),
            play('tragamonedas', 'Gira los rodillos hasta formar el factor de cada cambio', {
              rounds: [{ change: 35 }, { change: -12 }, { change: 150 }, { change: -0.5 }, { change: 7 }],
            }, 'Aumentar un $r\\%$ es multiplicar por $1 + \\tfrac{r}{100}$ y descontar, por $1 - \\tfrac{r}{100}$: $+35\\% \\Rightarrow \\times 1.35$, $-12\\% \\Rightarrow \\times 0.88$, $+150\\% \\Rightarrow \\times 2.5$ (dos veces y media), $-0.5\\% \\Rightarrow \\times 0.995$ y $+7\\% \\Rightarrow \\times 1.07$, no $1.7$.',
              { hint: 'Empieza en $\\times 1.000$, que deja el precio igual. Un aumento suma su porcentaje en centésimas; un descuento lo resta. Mira el billete de 100: debe salir convertido en 100 más o menos el porcentaje.' }),
            play('etiqueta-rebaja', 'Pega en cada etiqueta el sticker del precio final', {
              items: [{ name: 'Tenis', price: 45000, change: -20 }, { name: 'Audífonos', price: 80000, change: -15 }, { name: 'Bicicleta', price: 70000, change: 30 }],
              stickers: [36000, 9000, 68000, 12000, 91000, 49000],
            }, 'El precio final es el precio de lista por el factor: $45\\,000 \\cdot 0.8 = 36\\,000$ (9 000 es el descuento, no el precio), $80\\,000 \\cdot 0.85 = 68\\,000$ y, como la bicicleta **sube** $30\\%$, $70\\,000 \\cdot 1.3 = 91\\,000$ (49 000 sería bajarla).',
              { hint: 'Multiplica el precio por el factor del cambio. Cuidado: algunos stickers son solo el descuento, no el precio final, y no todo baja.' }),
            play('bodegas', 'Reparte los 2 000 sacos para que, tras el viaje del 20 %, queden iguales', { total: 2000, move: 20, step: 50 },
              'Si en A hay $x$ sacos, en B hay $2\\,000 - x$. Tras llevar el $20\\%$ de A: $0.8x = 2\\,000 - x + 0.2x$, es decir $1.6x = 2\\,000$ y $x = 1\\,250$. Había 1 250 sacos en A y 750 en B.',
              { hint: 'Llama $x$ a los sacos de A. Escribe cuántos quedan en A y cuántos llegan a B después del viaje, e iguala las dos bodegas.' }),
            num('Un celular cuesta 476 000 pesos con el IVA del 19 % incluido. ¿Cuánto cuesta sin IVA?', 400000,
              'Con IVA se paga el $119\\%$: precio $\\cdot 1.19 = 476\\,000$, así que el precio sin IVA es $476\\,000 \\div 1.19 = 400\\,000$. Restar el 19 % de 476 000 daría 385 560, que está mal: el 19 % se calculó sobre el precio sin IVA.',
              { prefix: '$', hint: 'El precio con IVA es el precio sin IVA multiplicado por un factor. Para deshacer una multiplicación, divide entre ese mismo factor.' }),
          ],
        },
        {
          id: 'alg-13d', title: 'Cambios sucesivos',
          // Parte 3 (spec 2026-11-11-porcentajes-desde-cero): video C3 (video/clase_alg_u2_c3_sucesivos). Escenas de respaldo.
          clip: { scenes: [
            sc(6, 'Dos descuentos seguidos **se multiplican**, no se suman. El orden no importa.', { steps: ['20 % y luego 10 %: $0.8 \\cdot 0.9 = 0.72$', 'descuento único del 28 %, no del 30 %'] }),
            sc(6, 'Subir y bajar el mismo porcentaje no deja el precio igual.', { steps: ['$+50\\%$ y $-50\\%$: $1.5 \\cdot 0.5 = 0.75$', 'tras $-20\\%$ hay que subir $25\\%$ para volver'] }),
            sc(6, 'Crecer el mismo porcentaje varias veces es una potencia del factor.', { steps: ['10 % tres años: $1.1^3 = 1.331$, es decir $+33.1\\%$'] }),
          ] },
          ex: [
            play('cascada', 'Pega los dos descuentos y fija el descuento único equivalente', { price: 100000, changes: [-30, -20], step: 1 },
              'Cada descuento multiplica el precio: $100\\,000 \\cdot 0.7 = 70\\,000$ y $70\\,000 \\cdot 0.8 = 56\\,000$. El factor total es $0.7 \\cdot 0.8 = 0.56$, así que el descuento único es $1 - 0.56 = 44\\%$, no $50\\%$. El orden no importa.',
              { hint: 'El segundo descuento se aplica sobre el precio ya rebajado. Sigue el precio paso a paso y compara el final con el original.' }),
            play('mejor-oferta', 'Lleva el carrito a la tienda donde el producto sale más barato', {
              rounds: [
                { price: 100000, a: { label: '30 % y luego 20 % de descuento', changes: [-30, -20] }, b: { label: '45 % de descuento de una vez', changes: [-45] } },
                { price: 90000, a: { label: 'Sube 20 % y luego baja 20 %', changes: [20, -20] }, b: { label: 'Precio de lista', changes: [] } },
                { price: 50000, a: { label: '10 % de descuento', changes: [-10] }, b: { label: '6 000 de rebaja', off: 6000 } },
              ],
            }, 'Se comparan los precios finales. Ronda 1: $0.7 \\cdot 0.8 = 0.56$ ($56\\,000$) contra $0.55$ ($55\\,000$): gana el 45 %. Ronda 2: $1.2 \\cdot 0.8 = 0.96$: subir y bajar el mismo porcentaje deja el precio en $86\\,400$, más barato que la lista. Ronda 3: el $10\\%$ de $50\\,000$ son $5\\,000$, menos que la rebaja fija de $6\\,000$.',
              { hint: 'Calcula el precio final de cada tienda paso a paso, aplicando cada cambio sobre el precio que va quedando, y compara.' }),
            play('cadena-cambios', 'Pon dos sellos para que el precio cambie lo que pide cada ronda', {
              stamps: [10, -10, -10, 20, 20, -20, 50, -25],
              rounds: [
                { goal: 1.44, text: 'Que el precio suba 44 % en total' },
                { goal: 0.81, text: 'Que el precio quede en el 81 % del original' },
                { goal: 0.99, text: 'Que el precio baje solo 1 % en total' },
                { goal: 1.08, text: 'Que el precio suba 8 % en total' },
              ],
            }, 'Los cambios sucesivos **se multiplican**, no se suman: $1.2 \\cdot 1.2 = 1.44$ (dos subidas del $20\\%$ dan $44\\%$), $0.9 \\cdot 0.9 = 0.81$ (dos bajadas del $10\\%$ dejan el $81\\%$), $0.9 \\cdot 1.1 = 0.99$ y $1.2 \\cdot 0.9 = 1.08$. Por eso subir y bajar el mismo porcentaje nunca deja el precio igual.',
              { hint: 'Cada sello multiplica el precio: +20 % es ×1.2 y −10 % es ×0.9. Multiplica los dos factores y compara con lo que pide la ronda. Mira cómo cambia la etiqueta de 100 tras cada sello.' }),
            play('rebote', 'Sube el precio rebajado hasta volver exactamente al original', { base: 100, drop: 10, max: 30, step: 0.1, tol: 0.06 },
              'Tras rebajar $10\\%$ el precio queda en 90. Para volver a 100 hay que subir 10 sobre 90: $\\dfrac{10}{90} = 11.1\\%$. La subida se calcula sobre el precio rebajado, por eso no basta con $10\\%$.',
              { hint: 'Después de la rebaja el precio es menor. La subida se calcula sobre ese precio rebajado: ¿qué porcentaje de él falta para volver al original?' }),
            play('dos-etapas', 'Gira la perilla hasta que la máquina produzca 8 840', { changes: [30, -20], output: 8840, max: 20000, step: 20 },
              'Subir $30\\%$ es $\\times 1.3$ y bajar $20\\%$ es $\\times 0.8$: en total $\\times 1.04$. Entonces $1.04x = 8\\,840$ y $x = 8\\,500$.',
              { hint: 'Junta los dos cambios en un solo factor multiplicando $1.3 \\cdot 0.8$. Luego busca qué número, multiplicado por ese factor, da 8 840.' }),
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
          id: 'alg-14', title: 'Sucesiones y progresiones aritméticas',
          // Parte 1 de progresiones (spec 2026-11-11-progresiones-desde-cero): video P1 (video/clase_alg_u3_p1_aritmeticas).
          // Escenas de respaldo hasta tener su ID de Bunny. Reemplaza a la Clase 5 (video/clase_progresiones).
          clip: { scenes: [
            sc(6, 'Una **sucesión** es una lista ordenada de números. Cada uno tiene su puesto $n = 1, 2, 3, \\dots$ (un natural) y se escribe $a_n$.', { title: '$a_1, a_2, a_3, \\dots, a_n, \\dots$', steps: ['Cuadrados: $1, 4, 9, 16, \\dots$, $a_n = n^2$'] }),
            sc(6, 'En una progresión **aritmética** se suma siempre la misma **diferencia** $d$ (positiva, negativa o cero).', { steps: ['$20, 25, 30, 35, \\dots$: $d = 5$', '$30, 28, 26, \\dots$: $d = -2$'] }),
            sc(6, 'Del primer término al término $n$ hay $n - 1$ saltos de tamaño $d$.', { title: '$a_n = a_1 + (n - 1)\\,d$', steps: ['$7, 11, 15, \\dots$: $a_{20} = 7 + 19 \\cdot 4 = 83$'] }),
            sc(6, 'Con dos términos se halla todo: $a_8 - a_3 = 5d$. Los **medios aritméticos** son los términos que van entre dos dados.', { steps: ['$a_3 = 10,\\ a_8 = 25 \\Rightarrow d = 3,\\ a_1 = 4$', 'Entre 2 y 18, tres medios: $6, 10, 14$'] }),
          ] },
          ex: [
            play('pisa-huellas', 'Elige el primer paso y el salto para que las huellas pisen las banderas', {
              rounds: [
                { known: [[3, 13], [7, 25]], a1: 7, d: 3 },
                { known: [[2, 18], [6, 6]], a1: 21, d: -3 },
                { known: [[4, 5], [9, 15]], a1: -1, d: 2 },
              ],
            }, 'Entre dos pasos conocidos hay tantos saltos como la resta de sus números: del paso 3 al 7 hay 4 saltos y $25 - 13 = 12$, así que $d = 3$; para llegar al paso 3 se dieron 2 saltos desde el primero: $a_1 = 13 - 2 \\cdot 3 = 7$. En la ronda 2 la distancia baja: $6 - 18 = -12$ en 4 saltos, $d = -3$ y $a_1 = 21$. En la 3, $10$ en 5 saltos: $d = 2$ y $a_1 = 5 - 3 \\cdot 2 = -1$.',
              { hint: 'Cuenta cuántos saltos hay entre los dos pasos conocidos y reparte entre ellos la distancia de una bandera a la otra. Luego retrocede desde una bandera hasta el paso 1.' }),
            play('escalera-aritmetica', 'Ajusta la escalera para que el décimo peldaño mida 42', { a1: 6, n: 10, target: 42, step: 1, max: 10 },
              'El peldaño $n$ mide $a_n = a_1 + (n - 1)d$. Con $a_1 = 6$ y $n = 10$: $6 + 9d = 42$, así que $9d = 36$ y $d = 4$.',
              { hint: 'Del primer peldaño al décimo hay 9 subidas iguales. ¿Cuánto hay que subir en total y cuánto toca a cada subida?' }),
            play('rellena-medios', 'Rellena los tres medios aritméticos entre 10 y 26', { first: 10, last: 26, k: 3, kind: 'aritmetica', chips: [13, 14, 18, 20, 22, 24] },
              'Con 3 medios hay 5 términos y 4 saltos: $26 = 10 + 4d$, así que $d = 4$ y los medios son $14, 18, 22$.',
              { hint: 'Si metes 3 números entre los extremos, ¿cuántos saltos iguales quedan? Reparte la distancia de 10 a 26 entre esos saltos.' }),
            num('En la progresión $4, 9, 14, 19, \\dots$ ¿cuánto vale el término 30?', 149,
              'La diferencia es $d = 5$ y del término 1 al 30 hay 29 saltos: $a_{30} = 4 + 29 \\cdot 5 = 149$.',
              { hint: 'Halla el salto restando dos términos seguidos. ¿Cuántos saltos hay del primer término al término 30?' }),
          ],
        },
        {
          id: 'alg-14b', title: 'La suma de una progresión aritmética',
          // Parte 2 (spec 2026-11-11-progresiones-desde-cero): video P2 (video/clase_alg_u3_p2_suma_aritmetica). Escenas de respaldo.
          clip: { scenes: [
            sc(6, 'Gauss sumó del 1 al 100 escribiendo la suma al derecho y al revés: cada columna suma lo mismo.', { title: '$1 + 2 + \\dots + 100 = \\dfrac{100 \\cdot 101}{2} = 5050$' }),
            sc(6, 'Dos escaleras iguales forman un rectángulo de $n$ por $a_1 + a_n$: cada escalera es la mitad.', { title: '$S_n = \\dfrac{n\\,(a_1 + a_n)}{2}$', steps: ['$3 + 5 + 7 + 9 + 11 = \\dfrac{5 \\cdot 14}{2} = 35$'] }),
            sc(6, 'Los impares forman cuadrados.', { title: '$1 + 3 + 5 + \\dots + (2n - 1) = n^2$' }),
          ] },
          ex: [
            play('dos-escaleras', 'Sube o baja la tapa hasta que las dos escaleras encajen', {
              max: 20,
              rounds: [{ a1: 2, d: 3, n: 5 }, { a1: 2, d: 2, n: 6 }, { a1: 4, d: 1, n: 7 }],
            }, 'Las escaleras encajan cuando la tapa está a $a_1 + a_n$: $2 + 14 = 16$, $2 + 12 = 14$ y $4 + 10 = 14$. El rectángulo mide $n(a_1 + a_n)$ y cada escalera es la mitad: $\\dfrac{5 \\cdot 16}{2} = 40$, $\\dfrac{6 \\cdot 14}{2} = 42$ y $\\dfrac{7 \\cdot 14}{2} = 49$.',
              { hint: 'Mira la primera columna: abajo está el escalón más bajo y arriba cuelga el más alto. ¿Qué altura debe tener la tapa para que justo se toquen?' }),
            play('parejas-gauss', 'Une las parejas de Gauss y descubre cuánto suma la progresión', { terms: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43] },
              'Extremos emparejados: $3 + 43 = 7 + 39 = \\dots = 46$. Son 5 parejas de 46 más el 23 del centro: $5 \\cdot 46 + 23 = 253$, igual que $S_{11} = \\dfrac{11 (3 + 43)}{2} = 253$.',
              { hint: 'Empieza por los extremos: el primero con el último. ¿Cuánto suman? Busca las otras parejas que sumen lo mismo; con un número impar de fichas, una queda sola.' }),
            play('suma-filas', 'Añade filas al teatro hasta tener exactamente 170 sillas', { first: 8, d: 2, target: 170, max: 14, item: 'sillas' },
              'Las sillas por fila son $8, 10, 12, \\dots$ y con $n$ filas el total es $S_n = \\dfrac{n(2 \\cdot 8 + (n - 1) 2)}{2} = n(n + 7)$. Con $n = 10$: $10 \\cdot 17 = 170$.',
              { hint: 'Suma con la fórmula de Gauss: número de filas por (primera fila + última fila) entre 2. Prueba con distintas cantidades de filas.' }),
            num('Calcula la suma $5 + 9 + 13 + \\dots + 81$', 860,
              'Es aritmética con $d = 4$. Términos: $81 = 5 + (n - 1)4$ da $n = 20$. Suma: $S_{20} = \\dfrac{20\\,(5 + 81)}{2} = 10 \\cdot 86 = 860$.',
              { hint: 'Primero averigua cuántos términos hay (cuántos saltos de 4 llevan del 5 al 81, más uno). Luego usa la suma de Gauss.' }),
          ],
        },
        {
          id: 'alg-14c', title: 'Progresiones geométricas',
          // Parte 3 (spec 2026-11-11-progresiones-desde-cero): video P3 (video/clase_alg_u3_p3_geometricas), en Bunny (3:37).
          clip: { bunny: '3a0b2b72-92f0-49fd-8946-8daf8b6fb21b', duration: 217, scenes: [
            sc(6, 'En una progresión **geométrica** se multiplica siempre por la misma **razón** $r$: el cociente de dos términos seguidos.', { steps: ['$1, 3, 9, 27, \\dots$: $r = 3$', '$800, 400, 200, \\dots$: $r = \\tfrac12$', '$1, -2, 4, -8, \\dots$: $r = -2$'] }),
            sc(6, 'Del primer término al término $n$ hay $n - 1$ multiplicaciones por $r$: una potencia.', { title: '$a_n = a_1\\,r^{\\,n-1}$', steps: ['$3, 6, 12, \\dots$: $a_7 = 3 \\cdot 2^6 = 192$'] }),
            sc(6, 'Sumar crece en línea recta; multiplicar crece cada vez más rápido. Los **medios geométricos** van entre dos términos dados.', { steps: ['Entre 2 y 162, tres medios: $r^4 = 81$, $r = \\pm 3$: $6, 18, 54$ o $-6, 18, -54$'] }),
          ] },
          ex: [
            play('rebota-pelota', 'Ajusta la altura de los tres primeros rebotes', {
              max: 130,
              rounds: [{ h0: 81, r: 2 / 3, rTex: '2/3' }, { h0: 64, r: 3 / 4, rTex: '3/4' }, { h0: 125, r: 2 / 5, rTex: '2/5' }],
            }, 'Cada rebote es el anterior por $r$: $81 \\cdot \\tfrac23 = 54$, $54 \\cdot \\tfrac23 = 36$, $36 \\cdot \\tfrac23 = 24$; $64 \\to 48 \\to 36 \\to 27$ con $r = \\tfrac34$; y $125 \\to 50 \\to 20 \\to 8$ con $r = \\tfrac25$. La pelota pierde cada vez menos altura: no se resta lo mismo, se multiplica por lo mismo.',
              { hint: 'Toma la altura anterior, pártela en tantas partes iguales como diga el denominador y quédate con las que diga el numerador. Repite con el rebote que acabas de calcular.' }),
            play('torre-producto', 'Duplica las bacterias hora a hora hasta llegar exactamente a 6 400', { kind: 'ratio', start: 50, r: 2, target: 6400, max: 10, unit: 'bacterias', period: 'hora' },
              'Es una progresión geométrica con $a_1 = 50$ y $r = 2$: tras $n$ horas hay $50 \\cdot 2^n$. Como $6\\,400 / 50 = 128 = 2^7$, son 7 horas.',
              { hint: 'Divide la meta entre las bacterias del comienzo: ese número debe ser una potencia de 2. ¿Cuántas veces se duplicó?' }),
            play('rellena-medios', 'Rellena los tres medios geométricos **positivos** entre 2 y 512', { first: 2, last: 512, k: 3, kind: 'geometrica', chips: [6, 8, 16, 32, 64, 128] },
              'Con 3 medios hay 5 términos y 4 multiplicaciones: $512 = 2 r^4$, así que $r^4 = 256$ y $r = 4$: los medios son $8, 32, 128$. Con $r = -4$ saldrían $-8, 32, -128$, que no son todos positivos.',
              { hint: 'Entre los extremos hay 4 multiplicaciones por la misma razón. ¿Por cuánto se multiplicó el 2 en total para llegar a 512? Busca el número que elevado a la 4 da eso.' }),
            num('En la progresión $2, 6, 18, 54, \\dots$ ¿cuánto vale el sexto término?', 486,
              'La razón es $r = 6 / 2 = 3$ y del término 1 al 6 hay 5 multiplicaciones: $a_6 = 2 \\cdot 3^5 = 2 \\cdot 243 = 486$.',
              { hint: 'Divide dos términos seguidos para hallar la razón. ¿Cuántas veces hay que multiplicar por ella para pasar del primer término al sexto?' }),
          ],
        },
        {
          id: 'alg-14d', title: 'Suma geométrica y suma infinita',
          // Parte 4 (spec 2026-11-11-progresiones-desde-cero): video P4 (video/clase_alg_u3_p4_suma_geometrica). Escenas de respaldo.
          clip: { scenes: [
            sc(6, 'Para sumar una geométrica se multiplica por $r$ y se resta: casi todo se cancela.', { title: '$S_n = a_1\\,\\dfrac{r^n - 1}{r - 1}$', steps: ['$1 + 2 + 4 + \\dots + 2^9 = 2^{10} - 1 = 1023$'] }),
            sc(6, 'Si $|r| < 1$ los términos se achican tanto que la suma infinita se acerca a un número.', { title: '$S_\\infty = \\dfrac{a_1}{1 - r}$', steps: ['$\\tfrac12 + \\tfrac14 + \\tfrac18 + \\dots = 1$', '$0.333\\ldots = \\tfrac{3}{10} + \\tfrac{3}{100} + \\dots = \\tfrac13$'] }),
            sc(5, 'Si $|r| \\ge 1$ la suma no se estabiliza: **diverge**.', { steps: ['$1 + 2 + 4 + \\dots$ crece sin parar', '$1 - 1 + 1 - 1 + \\dots$ salta entre 1 y 0'] }),
          ] },
          ex: [
            num('Calcula la suma de los seis primeros términos de $5 + 10 + 20 + \\dots$', 315,
              'Con $a_1 = 5$, $r = 2$ y $n = 6$: $S_6 = 5 \\cdot \\dfrac{2^6 - 1}{2 - 1} = 5 \\cdot 63 = 315$. Comprobación: $5 + 10 + 20 + 40 + 80 + 160 = 315$.',
              { hint: 'Halla la razón y usa la suma geométrica: primer término por (razón elevada al número de términos, menos 1) entre (razón menos 1). También puedes escribir los seis términos.' }),
            play('limite-serie', 'Suma términos y lleva el marcador al valor al que se acerca 9 + 3 + 1 + …', { a1: 9, r: 1 / 3, rTex: '\\tfrac13', max: 20, step: 0.5, tol: 0.26 },
              'La razón es $\\tfrac13$, menor que 1, así que la suma converge: $S_\\infty = \\dfrac{a_1}{1 - r} = \\dfrac{9}{1 - \\frac13} = \\dfrac{9}{2/3} = 13.5$. Las sumas parciales $9, 12, 13, 13.33, \\dots$ se acercan sin pasarse.',
              { hint: 'Mira cómo se achican los saltos: cada uno es la tercera parte del anterior. La suma se acerca a primer término entre (1 menos la razón).' }),
            play('limite-serie', 'Suma términos y lleva el marcador al valor al que se acerca 12 + 3 + 0.75 + …', { a1: 12, r: 1 / 4, rTex: '\\tfrac14', max: 20, step: 0.5, tol: 0.26 },
              'Cada término es la cuarta parte del anterior: $r = \\tfrac14$, así que converge a $S_\\infty = \\dfrac{12}{1 - \\frac14} = \\dfrac{12}{3/4} = 16$. Las sumas parciales $12, 15, 15.75, 15.94, \\dots$ se acercan a 16 sin pasarse.',
              { hint: 'Halla la razón dividiendo dos términos seguidos. La suma infinita es el primer término entre (1 menos la razón).' }),
            num('El decimal periódico $0.2727\\ldots$ es la suma $\\tfrac{27}{100} + \\tfrac{27}{10\\,000} + \\dots$ Escríbelo como $\\tfrac{x}{11}$: ¿cuánto vale $x$?', 3,
              'Es geométrica con $a_1 = \\tfrac{27}{100}$ y $r = \\tfrac{1}{100}$: $S_\\infty = \\dfrac{27/100}{1 - 1/100} = \\dfrac{27/100}{99/100} = \\dfrac{27}{99} = \\dfrac{3}{11}$.',
              { hint: 'Cada término es el anterior entre 100. Usa la suma infinita con ese primer término y esa razón, y simplifica la fracción que te quede.' }),
            num('Una pelota cae desde 6 m y cada rebote sube la mitad del anterior. Si rebotara para siempre, ¿cuántos metros recorrería en total, subiendo y bajando?', 18,
              'Baja 6 m y luego cada rebote sube y baja: $2(3 + 1.5 + 0.75 + \\dots) = 2 \\cdot \\dfrac{3}{1 - \\frac12} = 12$. En total $6 + 12 = 18$ m: una distancia finita aunque los rebotes no terminen.',
              { hint: 'Separa la primera caída de los rebotes. Cada rebote se recorre dos veces (subida y bajada), y sus alturas forman una geométrica de razón un medio.' }),
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
          id: 'alg-13b', title: 'Interés simple y compuesto',
          // Tras la función exponencial (spec 2026-11-11-razones-desde-cero): M = C(1 + r)^n es una exponencial en n.
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

// ---------- Evaluaciones de fin de unidad (spec 2026-11-12-evaluaciones-algebra-u1-u3) ----------
// Cada pregunta dice qué lección evalúa (lesson) y qué repasar si se falla (review). Juegos propios de las
// evaluaciones: laberinto-valor, domino-equivalencias, piramide-numerica y detective-pasos.
(() => {
  const unit = w => COURSE_ALGEBRA.units.find(u => u.world === w);
  const cells = list => list.map(([t, ok]) => ({ t, ok }));
  const tile = (a, av, b, bv) => ({ a, av, b, bv });
  const k = (t, v) => ({ t, v });

  unit('conjuntos').exam = {
    id: 'exam-alg-0', title: 'Conjuntos', minutes: 10,
    items: [
      { lesson: 'alg-0a', review: 'Un elemento pertenece ($\\in$) al conjunto; $\\{M\\}$ es un conjunto, no un elemento. El orden no cambia un conjunto, y $n(A)$ cuenta sus elementos.',
        ex: play('laberinto-valor', 'Sea $A = \\{M, A, R\\}$, las letras de MAR. Cruza el laberinto pisando solo **afirmaciones verdaderas**.', { rule: 'Pisa solo lo verdadero (A = {M, A, R})', rounds: [{ cols: 3, start: 0, end: 11, cells: cells([
          ['M ∈ A', true], ['O ∈ A', false], ['n(A) = 4', false],
          ['R ∈ A', true], ['E ∉ A', true], ['A = {A, R, M}', true],
          ['{M} ∈ A', false], ['R ∉ A', false], ['n(A) = 3', true],
          ['A = {M, R}', false], ['A ∈ A', true], ['A = {R, M, A}', true]]) }] },
        'Son verdaderas: $M \\in A$, $R \\in A$, $E \\notin A$, la letra $A \\in A$, $n(A) = 3$ y que $A$ es igual a $\\{A, R, M\\}$ y a $\\{R, M, A\\}$: el orden no importa. $\\{M\\} \\in A$ es falsa porque $\\{M\\}$ es un conjunto, no una letra de $A$.',
        { hint: 'Antes de cada casilla, mira si habla de un elemento (una letra) o de un conjunto (entre llaves).' }) },
      { lesson: 'alg-0a', review: 'Un conjunto se puede escribir por comprensión (una descripción) o por extensión (la lista de sus elementos, sin repetir).',
        ex: play('domino-equivalencias', 'Encadena fichas uniendo una **descripción** del conjunto con su **lista de elementos** (o al revés): cada ficha empieza con el mismo conjunto con que terminó la anterior.', { rounds: [{
          start: k('Vocales', 'V'), end: k('Letras de PERA', 'PERA'), need: 3, tiles: [
            tile('{A, E, I, O, U}', 'V', 'Letras de LUNA', 'LUNA'), tile('{L, U, N, A}', 'LUNA', 'Letras de NATA', 'NAT'),
            tile('{N, A, T}', 'NAT', '{P, E, R, A}', 'PERA'), tile('{S, O, L}', 'SOL', '{N, A}', 'NA'),
            tile('{A, E, I}', 'AEI', 'Letras de TAN', 'NAT')] }] },
        'Las vocales son $\\{A, E, I, O, U\\}$; las letras de LUNA son $\\{L, U, N, A\\}$; las de NATA son $\\{N, A, T\\}$ (la $A$ no se repite) y las de PERA, $\\{P, E, R, A\\}$. Trampas: $\\{N, A\\}$ no son todas las letras de NATA, y $\\{A, E, I\\}$ no son todas las vocales.',
        { hint: 'Para cada palabra, escribe sus letras sin repetir; el orden no importa.' }) },
      { lesson: 'alg-0b', review: '$X \\subseteq B$ si **todos** los elementos de $X$ están en $B$. El vacío y el mismo $B$ también son subconjuntos; una letra suelta no es un conjunto.',
        ex: play('laberinto-valor', 'Sea $B = \\{a, b, c, d\\}$. Cruza pisando solo los **subconjuntos de $B$**.', { rule: 'Pisa solo subconjuntos de B = {a, b, c, d}', rounds: [{ cols: 4, start: 0, end: 15, cells: cells([
          ['{a}', true], ['∅', true], ['{e}', false], ['{a, e}', false],
          ['a', false], ['{a, b}', true], ['{{a}}', false], ['{c}', true],
          ['{a, b, c, d, e}', false], ['B', true], ['{b, d}', true], ['{x}', false],
          ['{f, a}', false], ['{d, c}', true], ['{b, c, d}', true], ['{d}', true]]) }] },
        'Un camino posible: $\\{a\\}$, $\\varnothing$, $\\{a, b\\}$, $B$, $\\{b, d\\}$ (o $\\{d, c\\}$), $\\{b, c, d\\}$ y $\\{d\\}$: todos sus elementos están en $B$. Trampas: $a$ es un elemento (no un conjunto), $\\{\\{a\\}\\}$ tiene como elemento al conjunto $\\{a\\}$, y los que traen $e$, $f$ o $x$ se salen de $B$.',
        { hint: 'Revisa cada casilla elemento por elemento: basta uno que no esté en $B$ para que no sea subconjunto.' }) },
      { lesson: 'alg-0b', review: 'Cada elemento nuevo duplica la cantidad de subconjuntos, porque puede estar o no estar en cada uno de los que ya había.',
        ex: num('¿Cuántos subconjuntos tiene el conjunto de las letras de la palabra PLATO (contando el vacío y el conjunto completo)?', 32,
          'Las letras de PLATO son $\\{P, L, A, T, O\\}$: $5$ elementos. Cada uno puede estar o no estar, así que cada elemento duplica la cuenta: $2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2 = 32$ subconjuntos.',
          { hint: 'Primero arma el conjunto sin letras repetidas y cuenta sus elementos; cada elemento puede estar o no estar en un subconjunto.' }) },
      { lesson: 'alg-0c', review: '$A - B$ deja lo que está en $A$ y **no** en $B$. Y para contar $A \\cup B$ hay que restar los del medio: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
        ex: play('detective-pasos', 'Cada solución tiene **un paso equivocado**. Encuéntralo y corrígelo.', { rounds: [
          { title: 'A = {p, q, r, s}, B = {r, s, t, u}', steps: ['A ∪ B = {p, q, r, s, t, u}', 'A ∩ B = {r, s}', 'A − B = {p, q, t, u}', 'n(A − B) = 4'], wrong: 2,
            fixes: ['A − B = {p, q}', 'A − B = {t, u}', 'A − B = {p, q, t, u}', 'A − B = {r, s}'], fix: 0 },
          { title: '15 leen, 11 dibujan y 4 hacen las dos cosas', steps: ['n(L) = 15, n(D) = 11', 'n(L ∩ D) = 4', 'n(L ∪ D) = 15 + 11', 'n(L ∪ D) = 26 personas'], wrong: 2,
            fixes: ['n(L ∪ D) = 15 + 11 − 4', 'n(L ∪ D) = 15 − 11 + 4', 'n(L ∪ D) = 15 + 11 + 4', 'n(L ∪ D) = 15 · 11'], fix: 0 }] },
        'En la primera, $t$ y $u$ no están en $A$, así que $A - B = \\{p, q\\}$ y $n(A - B) = 2$. En la segunda, los $4$ que hacen las dos cosas se contaron dos veces: $n(L \\cup D) = 15 + 11 - 4 = 22$.',
        { hint: 'Comprueba cada línea con la definición de la operación, y en los conteos pregúntate si alguien quedó contado dos veces.' }) },
      { lesson: 'alg-0c', review: 'Unión: lo de los dos; intersección: lo común; diferencia $A - B$: lo de $A$ que no está en $B$; diferencia simétrica: lo que está en uno solo; complemento: lo de $U$ que falta.',
        ex: play('domino-equivalencias', 'Con $U = \\{a, b, c, d, e\\}$, $A = \\{a, b, c\\}$ y $B = \\{b, c, d\\}$: encadena cada **operación** con su **resultado**.', { rounds: [{
          start: k('A ∩ B', 'bc'), end: k('{d, e}', 'de'), need: 3, tiles: [
            tile('{b, c}', 'bc', 'A − B', 'a'), tile('{a}', 'a', 'A △ B', 'ad'), tile('{a, d}', 'ad', 'Aᶜ', 'de'),
            tile('{b, c, d}', 'bcd', 'B − A', 'd'), tile('{a, b, c, d}', 'abcd', 'Bᶜ', 'ae')] }] },
        '$A \\cap B = \\{b, c\\}$, $A - B = \\{a\\}$, $A \\,\\triangle\\, B = \\{a, d\\}$ (lo que está en uno solo) y $A^c = \\{d, e\\}$ (lo que le falta a $A$ para ser $U$).',
        { hint: 'Calcula cada operación aparte, con los elementos de $A$, $B$ y $U$ a la vista, y luego busca la ficha que empieza con ese resultado.' }) },
    ],
  };

  unit('numeros').exam = {
    id: 'exam-alg-1', title: 'Sistemas numéricos y axiomas', minutes: 15,
    items: [
      { lesson: 'alg-11', review: 'Un entero no tiene parte decimal ni fraccionaria, aunque esté escrito como fracción ($\\tfrac{12}{4} = 3$) o con signos ($-(-5) = 5$).',
        ex: play('laberinto-valor', 'Cruza el laberinto pisando solo **números enteros** ($\\mathbb{Z}$).', { rule: 'Pisa solo números enteros', rounds: [{ cols: 4, start: 0, end: 15, cells: cells([
          ['−7', true], ['3/2', false], ['0', true], ['−0.5', false],
          ['12/4', true], ['√2', false], ['−(−5)', true], ['1/3', false],
          ['−10/5', true], ['√9', true], ['4.5', false], ['−8', true],
          ['0.1', false], ['−1', true], ['−3', true], ['100', true]]) }] },
        'El camino pasa por $-7$, $\\tfrac{12}{4} = 3$, $\\tfrac{-10}{5} = -2$, $\\sqrt9 = 3$, $-1$, $-3$ y $100$: todos enteros. $\\tfrac32$, $-0.5$, $4.5$ y $0.1$ tienen parte decimal y $\\sqrt2$ ni siquiera es racional.',
        { hint: 'Antes de decidir, simplifica: una fracción o una raíz puede ser un entero disfrazado.' }) },
      { lesson: 'alg-11b', review: 'Para pasar de fracción a decimal se divide el numerador entre el denominador; un decimal periódico como $0.333\\ldots$ también es una fracción ($\\tfrac13$).',
        ex: play('domino-equivalencias', 'Arma la cadena de dominó: cada ficha debe empezar con **el mismo número** con que terminó la anterior, escrito de otra forma.', { rounds: [{
          start: k('0.25', 0.25), end: k('7/8', 0.875), need: 4, tiles: [
            tile('1/4', 0.25, '0.6', 0.6), tile('3/5', 0.6, '1.5', 1.5), tile('3/2', 1.5, '0.333…', 1 / 3),
            tile('1/3', 1 / 3, '0.875', 0.875), tile('2/5', 0.4, '0.75', 0.75), tile('5/4', 1.25, '0.3', 0.3)] }] },
        '$0.25 = \\tfrac14$, $0.6 = \\tfrac35$, $1.5 = \\tfrac32$, $0.333\\ldots = \\tfrac13$ y $0.875 = \\tfrac78$. Las trampas: $0.3$ no es $\\tfrac13$ y $\\tfrac54$ no es $0.25$.',
        { hint: 'Convierte cada cara a decimal dividiendo: así comparas números escritos de formas distintas.' }) },
      { lesson: 'alg-11c', review: 'Un número es irracional si su decimal es infinito y no periódico, como $\\pi$ o $\\sqrt2$. Las raíces exactas ($\\sqrt{16}$) y los decimales finitos o periódicos son racionales.',
        ex: play('laberinto-valor', 'Cruza el laberinto pisando solo **números irracionales**.', { rule: 'Pisa solo irracionales', rounds: [{ cols: 4, start: 0, end: 15, cells: cells([
          ['√2', true], ['π', true], ['√16', false], ['22/7', false],
          ['1.4142', false], ['−√7', true], ['1 + √5', true], ['0.111…', false],
          ['√(4/9)', false], ['3.14', false], ['2π', true], ['√50', true],
          ['√0.25', false], ['√8/√2', false], ['√3/2', true], ['√11', true]]) }] },
        'Son irracionales $\\sqrt2$, $\\pi$, $-\\sqrt7$, $1 + \\sqrt5$, $2\\pi$, $\\tfrac{\\sqrt3}{2}$ y $\\sqrt{11}$. Las trampas son racionales: $\\sqrt{16} = 4$, $\\sqrt{4/9} = \\tfrac23$, $\\sqrt{0.25} = 0.5$, $\\tfrac{\\sqrt8}{\\sqrt2} = 2$, y $3.14$ o $1.4142$ son solo aproximaciones con decimales finitos.',
        { hint: 'Calcula lo que se pueda: si la raíz es exacta, o el decimal termina o se repite, el número es racional.' }) },
      { lesson: 'alg-12b', review: 'La distributiva reparte el factor a **cada** sumando: $a(b + c) = ab + ac$. Y un número más su opuesto da el neutro $0$, no $1$.',
        ex: play('detective-pasos', 'Cada solución tiene **un paso equivocado**. Encuéntralo y elige cómo debía quedar.', { rounds: [
          { title: 'Calcular 7·(10 + 3) con los axiomas', steps: ['7·(10 + 3)', '= 7·10 + 3', '= 70 + 3', '= 73'], wrong: 1,
            fixes: ['= 7·10 + 7·3', '= 7·10 + 3·10', '= (7 + 10)·3', '= 7 + 10·3'], fix: 0 },
          { title: 'Despejar x en x + 5 = 12', steps: ['x + 5 = 12', '(x + 5) + (−5) = 12 + (−5)', 'x + (5 + (−5)) = 7', 'x + 1 = 7', 'x = 6'], wrong: 3,
            fixes: ['x + 0 = 7', 'x · 0 = 7', 'x + 1 = 7', 'x − 5 = 7'], fix: 0 }] },
        'En la primera, la distributiva da $7 \\cdot 10 + 7 \\cdot 3 = 91$. En la segunda, $5 + (-5) = 0$ (inverso aditivo) y $x + 0 = x$ (neutro), así que $x = 7$.',
        { hint: 'Revisa cada paso preguntándote qué axioma lo justifica: el error es el primer paso que ninguno justifica.' }) },
      { lesson: 'alg-12c', review: 'Ley de los signos: el producto de dos números de igual signo es positivo y el de signos distintos es negativo.',
        ex: play('piramide-numerica', 'Completa la pirámide: cada bloque es el **producto** de los dos que lo sostienen.', { op: 'prod',
          rows: [[k('−1', -1), k('2', 2), null, k('−3', -3)], [k('−2', -2), null, null], [k('4', 4), null], [k('−24', -24)]],
          tokens: [k('−1', -1), k('−2', -2), k('3', 3), k('−6', -6), k('1', 1), k('2', 2), k('−3', -3), k('6', 6)] },
        'Como $(-2) \\cdot (-2) = 4$, el bloque de en medio es $-2 = 2 \\cdot (-1)$. Luego $(-1)(-3) = 3$, $(-2) \\cdot 3 = -6$ y la cima $4 \\cdot (-6) = -24$.',
        { hint: 'Empieza por un bloque al que ya le conoces el resultado y uno de sus factores; cuida el signo con la ley de los signos.' }) },
      { lesson: 'alg-12d', review: 'Multiplicar por un negativo voltea la desigualdad, y el valor absoluto es una distancia: nunca es negativo.',
        ex: play('laberinto-valor', 'Cruza el laberinto pisando solo **afirmaciones verdaderas**.', { rule: 'Pisa solo lo verdadero', rounds: [{ cols: 3, start: 0, end: 11, cells: cells([
          ['|−4| = 4', true], ['−3 < −5', false], ['|−2| = −2', false],
          ['−1 > −2', true], ['−2·3 < −2·1', true], ['|x| ≥ 0', true],
          ['√2 < 1.4', false], ['|5 − 9| = −4', false], ['3 < 5 ⇒ −3 > −5', true],
          ['1/2 < 1/3', false], ['−0.5 < −0.4', true], ['|−3| + |3| = 6', true]]) }] },
        'Son falsas $-3 < -5$ (en realidad $-3 > -5$), $|-2| = -2$ (vale $2$), $\\sqrt2 < 1.4$ (pues $\\sqrt2 \\approx 1.414$), $|5 - 9| = -4$ (vale $4$) y $\\tfrac12 < \\tfrac13$. Es verdadera $-2 \\cdot 3 < -2 \\cdot 1$ ($-6 < -2$), y al multiplicar $3 < 5$ por $-1$ el orden se voltea.',
        { hint: 'Ubica los números en la recta: el que está más a la derecha es el mayor, aunque sea negativo.' }) },
      { lesson: 'alg-12d', review: 'La distancia entre $a$ y $b$ en la recta es $|a - b|$: se restan y se toma el valor absoluto.',
        ex: num('En la recta real, ¿cuál es la **distancia** entre $-3.5$ y $2.25$?', 5.75,
          '$|2.25 - (-3.5)| = |2.25 + 3.5| = 5.75$.',
          { hint: 'La distancia es el valor absoluto de la diferencia de los dos números, en cualquier orden.' }) },
    ],
  };

  unit('razones').exam = {
    id: 'exam-alg-2', title: 'Razones, proporciones y porcentajes', minutes: 12,
    items: [
      { lesson: 'alg-12', review: 'Dos razones son equivalentes si al dividir dan lo mismo: $4 : 6 = \\tfrac46 = \\tfrac23$.',
        ex: play('domino-equivalencias', 'Encadena fichas uniendo **razones equivalentes**: cada ficha empieza con una razón igual a la que terminó la anterior.', { rounds: [{
          start: k('2 : 3', 2 / 3), end: k('3 : 2', 1.5), need: 3, tiles: [
            tile('4 : 6', 4 / 6, '10 : 4', 2.5), tile('5 : 2', 2.5, '9 : 12', 0.75), tile('3 : 4', 0.75, '1.5', 1.5),
            tile('6 : 9', 6 / 9, '4 : 10', 0.4), tile('2 : 5', 0.4, '8 : 6', 8 / 6)] }] },
        '$2 : 3 = 4 : 6$, $10 : 4 = 5 : 2$, $9 : 12 = 3 : 4$ y $1.5 = 3 : 2$. La ficha $6 : 9$ también empieza bien, pero su camino no llega a $3 : 2$.',
        { hint: 'Escribe cada razón como una división: dos razones son iguales si dan el mismo cociente.' }) },
      { lesson: 'alg-12e', review: 'En una proporción los dos términos se multiplican (o dividen) por el mismo número; sumarles lo mismo no la conserva: $3 : 5 \\neq 13 : 15$.',
        ex: play('laberinto-valor', 'Cruza pisando solo las razones **proporcionales a $3 : 5$**.', { rule: 'Pisa solo lo proporcional a 3 : 5', rounds: [{ cols: 4, start: 0, end: 15, cells: cells([
          ['6 : 10', true], ['9 : 15', true], ['5 : 3', false], ['4 : 6', false],
          ['3 : 8', false], ['12 : 20', true], ['13 : 15', false], ['0.3 : 0.5', true],
          ['5 : 7', false], ['1.5 : 2.5', true], ['30 : 50', true], ['8 : 10', false],
          ['4 : 5', false], ['6 : 8', false], ['21 : 35', true], ['15 : 25', true]]) }] },
        'Cada razón del camino es $3 : 5$ multiplicada por un número ($\\times 2$, $\\times 3$, $\\times 4$, $\\times 0.5$, $\\times 10$, $\\times 7$, $\\times 5$). Las trampas suman lo mismo arriba y abajo ($13 : 15$, $5 : 7$) o voltean la razón ($5 : 3$).',
        { hint: 'Divide cada razón: es proporcional si da lo mismo que $3 \\div 5$.' }) },
      { lesson: 'alg-12f', review: 'En la regla de tres inversa (más obreros, menos días) el producto se conserva: $4 \\cdot 6 = 3 \\cdot x$.',
        ex: play('detective-pasos', 'Esta regla de tres tiene **un paso equivocado**. Encuéntralo y corrígelo.', { rounds: [
          { title: '4 obreros tardan 6 días; ¿y 3 obreros?', steps: ['4 obreros → 6 días', '3 obreros → x días', 'Menos obreros, más días: es inversa', 'x = 6·3/4', 'x = 4.5 días'], wrong: 3,
            fixes: ['x = 6·4/3', 'x = 6·3/4', 'x = 4·3/6', 'x = 6 + 4 − 3'], fix: 0 }] },
        'Si es inversa, el trabajo total se conserva: $4 \\cdot 6 = 3 \\cdot x$, así que $x = \\tfrac{6 \\cdot 4}{3} = 8$ días. Con $4.5$ días, menos obreros terminarían antes, lo que no tiene sentido.',
        { hint: 'Comprueba si el resultado tiene sentido: con menos obreros, ¿deberían tardar más o menos días?' }) },
      { lesson: 'alg-13d', review: 'Bajar un $20\\%$ es multiplicar por $0.8$ (lo que queda), no por $0.2$ (lo que se quita).',
        ex: play('detective-pasos', 'Encuentra el **paso equivocado** en esta cuenta de precios y corrígelo.', { rounds: [
          { title: 'Una chaqueta sube 20 % y luego baja 20 %', steps: ['Precio: $80 000', 'Sube 20 %: 80 000 · 1.2 = 96 000', 'Baja 20 %: 96 000 · 0.2 = 19 200', 'Precio final: $19 200'], wrong: 2,
            fixes: ['Baja 20 %: 96 000 · 0.8 = 76 800', 'Baja 20 %: 80 000 · 0.8 = 64 000', 'Baja 20 %: 96 000 − 20 = 95 980', 'Baja 20 %: 96 000 · 1.2 = 115 200'], fix: 0 }] },
        'Al bajar un $20\\%$ queda el $80\\%$: $96\\,000 \\cdot 0.8 = 76\\,800$. Por eso subir y bajar el mismo porcentaje no deja el precio igual.',
        { hint: 'Piensa en qué porcentaje del precio sigue pagando el cliente después de una rebaja.' }) },
      { lesson: 'alg-13', review: 'Un porcentaje es una fracción de 100: $25\\% = \\tfrac{25}{100} = \\tfrac14 = 0.25$.',
        ex: play('laberinto-valor', 'Cruza pisando solo lo que **vale $25\\%$**.', { rule: 'Pisa solo lo que vale 25 %', rounds: [{ cols: 4, start: 0, end: 15, cells: cells([
          ['1/4', true], ['2.5', false], ['0.025', false], ['4 %', false],
          ['0.25', true], ['25/100', true], ['1 de cada 4', true], ['50/200', true],
          ['1/25', false], ['0.52', false], ['5/20', true], ['3/12', true],
          ['2/5', false], ['0.4', false], ['1/5', false], ['10 de 40', true]]) }] },
        'Valen $25\\%$: $\\tfrac14$, $0.25$, $\\tfrac{25}{100}$, «1 de cada 4», $\\tfrac{50}{200}$, $\\tfrac{5}{20}$, $\\tfrac{3}{12}$ y «10 de 40». Trampas: $2.5$ es $250\\%$, $0.025$ es $2.5\\%$ y $\\tfrac1{25}$ es $4\\%$.',
        { hint: 'Pasa todo a fracción de 100 (o a decimal): $25\\%$ es la cuarta parte.' }) },
      { lesson: 'alg-13c', review: 'Un descuento del $r\\%$ deja pagar el $(100 - r)\\%$: se multiplica por $1 - \\tfrac{r}{100}$.',
        ex: play('detective-pasos', 'Encuentra el **paso equivocado** en este descuento y corrígelo.', { rounds: [
          { title: 'Un pantalón de $90 000 con 30 % de descuento', steps: ['Precio: $90 000', 'Con 30 % de descuento se paga el 30 %', 'Factor: 0.7', 'Precio final: 90 000 · 0.7 = 63 000'], wrong: 1,
            fixes: ['Con 30 % de descuento se paga el 70 %', 'Con 30 % de descuento se paga el 130 %', 'Con 30 % de descuento se paga el 3 %', 'Con 30 % de descuento no se paga nada'], fix: 0 }] },
        'Si se descuenta el $30\\%$, el cliente paga lo que queda: el $70\\%$. Por eso el factor es $0.7$ y el precio final $90\\,000 \\cdot 0.7 = 63\\,000$.',
        { hint: 'Piensa en qué parte del precio sigue pagando el cliente después del descuento.' }) },
      { lesson: 'alg-12e', review: 'En magnitudes directamente proporcionales el cociente es constante: halla cuánto vale una unidad y multiplica.',
        ex: num('En un mapa, $2$ cm representan $15$ km. ¿Cuántos km representan $7$ cm?', 52.5,
          'Cada centímetro son $15 \\div 2 = 7.5$ km, así que $7$ cm son $7 \\cdot 7.5 = 52.5$ km.',
          { suffix: 'km', hint: 'Las distancias del mapa y las reales son directamente proporcionales: busca cuántos km representa 1 cm.' }) },
    ],
  };

  unit('potencias').exam = {
    id: 'exam-alg-3', title: 'Potenciación y radicación', minutes: 12,
    items: [
      { lesson: 'alg-21a', review: 'El exponente afecta solo a lo que tiene pegado: $-8^2 = -64$, pero $(-8)^2 = 64$. Y todo número (no cero) a la $0$ da $1$.',
        ex: play('laberinto-valor', 'Cruza pisando solo lo que **vale $64$**.', { rule: 'Pisa solo lo que vale 64', rounds: [{ cols: 4, start: 0, end: 15, cells: cells([
          ['2⁶', true], ['4³', true], ['8²', true], ['6²', false],
          ['−8²', false], ['2⁵', false], ['(−8)²', true], ['4²', false],
          ['8·8·8', false], ['(−4)³', false], ['(2³)²', true], ['2³·2³', true],
          ['64⁰', false], ['3⁴', false], ['2⁸/2²', true], ['4·4·4', true]]) }] },
        'Valen $64$: $2^6$, $4^3$, $8^2$, $(-8)^2$, $(2^3)^2$, $2^3 \\cdot 2^3$, $\\tfrac{2^8}{2^2}$ y $4 \\cdot 4 \\cdot 4$. Trampas: $-8^2 = -64$, $(-4)^3 = -64$, $64^0 = 1$ y $8 \\cdot 8 \\cdot 8 = 512$.',
        { hint: 'Fíjate en los paréntesis y en el signo: el exponente solo afecta a lo que tiene pegado.' }) },
      { lesson: 'alg-21b', review: 'Al multiplicar potencias de la misma base se suman los exponentes: $2^a \\cdot 2^b = 2^{a + b}$.',
        ex: play('piramide-numerica', 'Completa la pirámide de potencias: cada bloque es el **producto** de los dos que lo sostienen.', { op: 'prod',
          rows: [[k('2¹', 2), k('2²', 4), null, k('2³', 8)], [k('2³', 8), null, null], [k('2⁵', 32), null], [k('2¹⁰', 1024)]],
          tokens: [k('2⁰', 1), k('2²', 4), k('2³', 8), k('2⁵', 32), k('0', 0), k('2⁶', 64), k('2¹', 2), k('2⁴', 16)] },
        'Los exponentes se suman: $2^5 = 2^3 \\cdot 2^2$, así que el de en medio es $2^2 = 2^2 \\cdot 2^0$; luego $2^0 \\cdot 2^3 = 2^3$, $2^2 \\cdot 2^3 = 2^5$ y $2^5 \\cdot 2^5 = 2^{10}$. Ojo: $2^0 = 1$, no $0$.',
        { hint: 'Trabaja con los exponentes: en un producto de la misma base se suman. ¿Qué exponente le falta a cada bloque?' }) },
      { lesson: 'alg-21b', review: 'Potencia de un producto: cada factor se eleva, $(ab)^n = a^n b^n$; potencia de una potencia: se multiplican los exponentes.',
        ex: play('detective-pasos', 'Cada simplificación tiene **un paso equivocado**. Encuéntralo y corrígelo.', { rounds: [
          { title: 'Simplificar (2x³)²', steps: ['(2x³)²', '= 2·x⁶', '= 2x⁶'], wrong: 1, fixes: ['= 2²·(x³)²', '= 2·(x³)²', '= 2²·x⁵', '= 4·x⁵'], fix: 0 },
          { title: 'Simplificar (x²)³ · x', steps: ['(x²)³ · x', '= x⁵ · x', '= x⁶'], wrong: 1, fixes: ['= x⁶ · x', '= x⁸ · x', '= x⁵ · x', '= x⁹'], fix: 0 }] },
        '$(2x^3)^2 = 2^2 (x^3)^2 = 4x^6$: el $2$ también se eleva. Y $(x^2)^3 = x^{6}$ (se multiplican los exponentes), así que $(x^2)^3 \\cdot x = x^7$.',
        { hint: 'Revisa qué ley usa cada paso: ¿se elevó cada factor? ¿se sumaron o se multiplicaron los exponentes?' }) },
      { lesson: 'alg-22a', review: 'Un exponente fraccionario es una raíz: $a^{m/n} = (\\sqrt[n]{a})^m$. Primero la raíz, luego la potencia.',
        ex: play('domino-equivalencias', 'Encadena fichas uniendo **raíces y exponentes fraccionarios** que valen lo mismo.', { rounds: [{
          start: k('√9', 3), end: k('⁴√16', 2), need: 3, tiles: [
            tile('27^⅓', 3, '8^⅔', 4), tile('√16', 4, '125^⅓', 5), tile('√25', 5, '32^⅕', 2),
            tile('9^½', 3, '4^(3/2)', 8), tile('16^½', 4, '27^⅔', 9)] }] },
        '$\\sqrt9 = 27^{1/3} = 3$, $8^{2/3} = 2^2 = 4 = \\sqrt{16}$, $125^{1/3} = 5 = \\sqrt{25}$ y $32^{1/5} = 2 = \\sqrt[4]{16}$. Trampas: $9^{1/2}$ encaja al principio y $16^{1/2}$ después de $8^{2/3}$, pero llevan a $8$ y $9$, que no siguen.',
        { hint: 'Calcula el valor de cada cara: el denominador del exponente es la raíz y el numerador, la potencia.' }) },
      { lesson: 'alg-22b', review: 'La raíz de un producto es el producto de las raíces, pero la raíz de una suma no se separa. Y $\\sqrt3 \\cdot \\sqrt3 = 3$.',
        ex: play('detective-pasos', 'Encuentra el **paso equivocado** de cada cuenta con radicales y corrígelo.', { rounds: [
          { title: 'Simplificar √72', steps: ['√72', '= √(36·2)', '= √36 + √2', '= 6 + √2'], wrong: 2, fixes: ['= √36 · √2', '= 36 · √2', '= √36 + √2', '= √(36 + 2)'], fix: 0 },
          { title: 'Racionalizar 6/√3', steps: ['6/√3', '= 6·√3 / (√3·√3)', '= 6√3 / 9', '= 2√3 / 3'], wrong: 2, fixes: ['= 6√3 / 3', '= 6√3 / 9', '= 6 / 3', '= 18 / 3'], fix: 0 }] },
        '$\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt2 = 6\\sqrt2$. Y $\\sqrt3 \\cdot \\sqrt3 = 3$, así que $\\tfrac{6}{\\sqrt3} = \\tfrac{6\\sqrt3}{3} = 2\\sqrt3$.',
        { hint: 'Recuerda qué operaciones se pueden separar dentro de una raíz y cuánto da una raíz por sí misma.' }) },
      { lesson: 'alg-22a', review: 'Para $a^{m/n}$ saca primero la raíz $n$-ésima (sale un número más pequeño) y después eleva a la $m$.',
        ex: num('¿Cuánto vale $16^{3/4}$?', 8,
          '$16^{3/4} = (\\sqrt[4]{16})^3 = 2^3 = 8$.',
          { hint: 'En un exponente fraccionario, el denominador dice qué raíz sacar y el numerador a qué potencia elevar.' }) },
    ],
  };
})();
