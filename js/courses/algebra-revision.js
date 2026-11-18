// Revisión de la práctica de Álgebra (spec 2026-11-18-algebra-revision). Va después de algebra-taller.js. Rehace, mundo
// por mundo, las lecciones ya revisadas: sin los motores genéricos del taller, sin juegos repetidos en el curso y con
// una escena propia por idea; y su evaluación, con al menos dos preguntas por lección hechas con juegos de sus lecciones.
// ALG_REVISADOS lista los mundos terminados (las pruebas los revisan con las reglas nuevas).
const ALG_REVISADOS = [];
// Mecánicas que el usuario descartó (escoger, tarjetas, armar con fichas de solo tocar).
const ALG_ABURRIDOS = ['escala-solucion', 'arma-la-cuenta', 'une-parejas', 'clasifica-cartas', 'ordena-terminos', 'verdadero-falso'];
(() => {
  const units = COURSE_ALGEBRA.units, lessons = units.flatMap(u => u.lessons);
  const L = id => lessons.find(l => l.id === id);
  // Un ejercicio que la lección ya tenía.
  const keep = (id, game) => { const e = L(id).ex.find(e => e.game === game); if (!e) throw new Error(`${id} no tiene ${game}`); return e; };
  const setLesson = (id, list) => { L(id).ex = list.map((e, i) => ({ ...e, canvasGuide: true, motion: i === list.length - 1 })); };
  // Evaluación: lo que tenía (sin motores del taller) más las preguntas nuevas, en el orden de las lecciones.
  function setExam(world, extra) {
    const u = units.find(u => u.world === world), order = u.lessons.map(l => l.id);
    const old = u.exam.items.filter(it => !String(it.ex.game).startsWith('taller-') && !ALG_ABURRIDOS.includes(it.ex.game));
    // La pista de una pregunta corta se completa con la idea que repasa (orienta sin dar el resultado).
    const items = [...old, ...extra.map(([lesson, review, ex]) => ({ lesson, review: review.length > 30 ? review : `${review} ${ex.explain}`, ex: { ...ex, hint: ex.hint.length >= 30 ? ex.hint : `${ex.hint} ${review}`, canvasGuide: true, exam: true, params: { ...ex.params, autoDemo: false } } }))];
    u.exam.items = items.map((it, k) => [it, k]).sort((a, b) => order.indexOf(a[0].lesson) - order.indexOf(b[0].lesson) || a[1] - b[1]).map(([it]) => it);
    u.exam.minutes = Math.max(12, Math.round(u.exam.items.length * 1.5));
    ALG_REVISADOS.push(world);
  }

  // ───────── Mundo 1 · Teoría de Conjuntos ─────────
  {
    const a = ['cumple-notacion', 'tacha-repetidos', 'atrapa-elementos', 'lazo-conjunto'].map(g => keep('alg-0a', g));
    setLesson('alg-0a', [a[0], a[1],
      play('tamiz-rango', 'De la regla a la lista: deja adentro solo lo que cumple', { rounds: [
        { name: 'A', text: 'los días después del martes y antes del sábado', labels: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], lo: 2, hi: 4 },
        { name: 'B', text: 'los días desde el viernes hasta el domingo', labels: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], lo: 4, hi: 6 },
        { name: 'C', text: 'las letras desde la c hasta la g', labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], lo: 2, hi: 6 },
        { name: 'D', text: 'los días que hay entre el lunes y el martes', labels: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], lo: 1, hi: 0 },
      ] }, 'Por comprensión se da la regla; por extensión se escriben los elementos. «Después del martes y antes del sábado» deja por fuera al martes y al sábado: $A = \\{\\text{mié}, \\text{jue}, \\text{vie}\\}$. «Desde… hasta» incluye los dos extremos: $B$ tiene tres días y $C$ cinco letras. Entre el lunes y el martes no hay ningún día: $D = \\varnothing$.',
      { hint: '«Después de» y «antes de» dejan por fuera lo que nombran; «desde» y «hasta» lo incluyen. Si nada cumple, junta los corchetes.' }),
      play('cajas-anidadas', 'Un conjunto puede guardar conjuntos: arma cada uno', { rounds: [
        { name: 'A', target: ['1', '{2, 3}'], tray: ['1', '2', '3', '{2, 3}', '{1}'] },
        { name: 'B', target: ['{a}', 'b'], tray: ['a', 'b', '{a}', '{b}', '{a, b}'] },
        { name: 'C', target: ['{x, y}'], tray: ['x', 'y', '{x}', '{y}', '{x, y}'] },
        { name: 'D', target: ['{1}', '{1, 2}'], tray: ['1', '2', '{1}', '{2}', '{1, 2}'] },
      ] }, '$A = \\{1, \\{2, 3\\}\\}$ tiene dos elementos: el 1 y la bolsa $\\{2, 3\\}$; el 2 y el 3 sueltos no son elementos de A. $B = \\{\\{a\\}, b\\}$ tiene dos. $C = \\{\\{x, y\\}\\}$ tiene un solo elemento, aunque dentro de la bolsa haya dos. Y $D = \\{\\{1\\}, \\{1, 2\\}\\}$ tiene dos elementos, los dos conjuntos.',
      { hint: 'Lee la notación por capas: cada coma de afuera separa un elemento. Una llave dentro de otra es una bolsa que entra entera, tenga lo que tenga.' }),
      a[2],
      play('gemelos', 'Cada hilo une elementos iguales. Deja A = B sin sacar de más', { rounds: [
        { goal: '=', A: ['t', 'e', 'l', 'a', 's'], B: ['l', 'a', 't', 'e', 'e'] },
        { goal: '=', A: ['m', 'a', 'r'], B: ['r', 'a', 'm', 'o'] },
        { goal: '=', A: ['c', 'a', 's', 'o'], B: ['s', 'a', 'c', 'a', 'r'] },
        { goal: '=', A: ['1', '3', '5', '7'], B: ['7', '5', '9', '1', '3', '3'] },
      ] }, 'Dos conjuntos son iguales si tienen los mismos elementos: el orden y las repeticiones no cuentan. Por eso la e repetida no estorba y solo sobra la s; luego sobra la o de B; en la tercera sobran la o de A y la r de B; en la última, el 3 repetido no estorba y sobra el 9.',
      { hint: 'Sigue los hilos: un elemento sin hilo no tiene gemelo al otro lado y no deja que los conjuntos sean iguales. Los repetidos sí tienen hilo.' }),
      a[3]]);

    const b = ['arma-conjunto', 'mueve-circulos', 'cubo-partes', 'orbita-conjuntos'].map(g => keep('alg-0b', g));
    setLesson('alg-0b', [b[0], b[1],
      play('escalera-inclusion', 'Muñecas de conjuntos: cada uno envuelve al de adentro', { rounds: [
        { sets: [['a', 'b', 'c'], [], ['a'], ['a', 'c'], ['b', 'd']] },
        { sets: [['1', '2'], ['1', '2', '3', '4'], ['2'], ['1', '2', '4'], ['3']] },
        { sets: [['x'], ['x', 'y', 'z'], [], ['y'], ['x', 'y']] },
      ] }, 'Cada conjunto de la cadena tiene todos los elementos del anterior y alguno más. El vacío está contenido en cualquier conjunto, así que va en el centro cuando aparece. $\\{b, d\\}$ no cabe en la cadena de $\\{a, c\\}$ porque no contiene a $a$. En la tercera hay dos cadenas igual de largas: por $\\{x\\}$ o por $\\{y\\}$.',
      { hint: 'Empieza por el conjunto con menos elementos. Antes de soltar uno nuevo, revisa que tenga todos los elementos del que ya está adentro.' }),
      b[2],
      play('arbol-partes', 'El árbol de los subconjuntos: cada elemento parte las ramas en dos', { rounds: [
        { target: 8, pool: ['p', 'q', 'r', 's', 't'] },
        { target: 1, pool: ['p', 'q', 'r'] },
        { target: 16, pool: ['p', 'q', 'r', 's', 't'] },
        { target: 32, pool: ['p', 'q', 'r', 's', 't'] },
      ] }, 'Cada elemento nuevo parte cada hoja en dos: sin él y con él. Por eso las hojas se duplican: $2, 4, 8, 16, 32$. Un conjunto de $n$ elementos tiene $2^n$ subconjuntos, y el vacío tiene uno solo, él mismo: $2^0 = 1$.',
      { hint: 'Mira cuánto cambia el número de hojas cada vez que agregas un elemento. ¿Cuántas veces hay que duplicar para llegar a la meta?' }),
      b[3],
      play('anillos-subconjunto', 'Aros de subconjuntos: el aro solo encaja si la estaca lo contiene', { rounds: [
        { title: 'Encaja el aro', items: [
          { ring: ['a', 'c'], pegs: [['a', 'b'], ['a', 'b', 'c'], ['c', 'd']] },
          { ring: ['1', '2'], pegs: [['2', '3'], ['1', '3', '4'], ['1', '2', '5']] },
          { ring: ['m'], pegs: [['n', 'o'], ['l', 'm'], ['p']] }] },
        { title: 'Casos especiales', items: [
          { ring: [], pegs: [['a'], ['b'], ['c']] },
          { ring: ['x', 'y', 'z'], pegs: [['x', 'y'], ['x', 'y', 'z'], ['y', 'z', 'w']] },
          { ring: ['2', '4'], pegs: [['4'], ['1', '2', '3'], ['2', '4', '6']] }] },
      ] }, '$X \\subseteq Y$ cuando cada elemento de X está en Y. El vacío encaja en cualquier estaca, y todo conjunto es subconjunto de sí mismo: $\\{x, y, z\\} \\subseteq \\{x, y, z\\}$.',
      { hint: 'Antes de lanzar, busca cada elemento del aro en la estaca. Basta que falte uno para que no encaje.' })]);

    const c = ['reparte-venn', 'pinta-venn', 'encuesta-venn', 'descifra-zona'].map(g => keep('alg-0c', g));
    setLesson('alg-0c', [c[0], c[1],
      play('solapa-cardinal', 'Solapa B sobre A hasta que la unión tenga el total', { rounds: [
        { a: 12, b: 9, total: 17, A: 'leen', B: 'escuchan pódcast' },
        { a: 15, b: 10, total: 15, A: 'usan bici', B: 'usan casco' },
        { a: 7, b: 8, total: 15, A: 'estudian de día', B: 'de noche' },
        { a: 20, b: 14, total: 26, A: 'toman café', B: 'toman té' },
      ] }, 'Al sumar $n(A) + n(B)$, los que están en los dos se cuentan dos veces; por eso se resta una vez la intersección: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$. $12 + 9 - 17 = 4$; $15 + 10 - 15 = 10$ (todos los del casco usan bici: $B \\subseteq A$); $7 + 8 - 15 = 0$ (disjuntos); $20 + 14 - 26 = 8$.',
      { hint: 'Suma los dos grupos y compara con el total: lo que sobra son personas contadas dos veces.' }),
      play('goma-diferencia', 'Borra lo que la operación deja por fuera', { rounds: [
        { op: 'A-B', U: ['1', '2', '3', '4', '5', '6', '7', '8'], A: ['1', '2', '3', '4', '6'], B: ['2', '4', '5', '7'] },
        { op: 'Ac', U: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], A: ['a', 'c', 'e'], B: ['e', 'f'] },
        { op: 'B-A', U: ['m', 'a', 'r', 'i', 'o', 's'], A: ['m', 'a', 'r'], B: ['r', 'i', 'o', 'm'] },
        { op: 'AdB', U: ['1', '2', '3', '4', '5', '6', '7'], A: ['1', '2', '3', '4'], B: ['3', '4', '5', '6'] },
      ] }, '$A - B$ deja lo de A que no está en B: $\\{1, 3, 6\\}$. El complemento deja lo de U que no está en A: $\\{b, d, f, g\\}$. $B - A = \\{i, o\\}$: no es lo mismo que $A - B$. Y la diferencia simétrica quita de la unión lo que es común: $\\{1, 2, 5, 6\\}$.',
      { hint: 'Antes de borrar, busca en el diagrama la zona de cada elemento: solo se borra lo que cae en la parte que la operación excluye.' }),
      c[2],
      play('busca-b', 'Las operaciones al revés: encuentra el conjunto B', { rounds: [
        { U: ['1', '2', '3', '4', '5', '6'], A: ['1', '2', '3'], conds: [['union', ['1', '2', '3', '4', '5']], ['inter', ['2']]] },
        { U: ['a', 'e', 'i', 'o', 'u', 'y'], A: ['a', 'e', 'i'], conds: [['union', ['a', 'e', 'i', 'o', 'u']], ['inter', []]] },
        { U: ['1', '2', '3', '4', '5', '6', '7', '8'], A: ['2', '4', '6', '8'], conds: [['inter', ['4', '8']], ['BmA', ['1']]] },
        { U: ['w', 'x', 'y', 'z'], A: ['x', 'y'], conds: [['union', ['w', 'x', 'y', 'z']], ['inter', ['x', 'y']]] },
      ] }, 'La intersección dice qué elementos de A están en B, y la unión, qué más puede tener B. En la primera, B tiene el 2 (lo común) y el 4 y el 5 (lo que la unión agrega): $B = \\{2, 4, 5\\}$. Luego $B = \\{o, u\\}$, $B = \\{1, 4, 8\\}$ y $B = \\{w, x, y, z\\}$, que contiene a A.',
      { hint: 'Empieza por la pista de la intersección: eso de A va en B. Luego mira qué agrega la otra pista y qué elementos no pueden estar.' }),
      c[3]]);

    setExam('conjuntos', [
      ['alg-0a', 'Por comprensión se da la regla y por extensión se escriben los elementos; «desde» y «hasta» incluyen los extremos, «antes de» y «después de» no.',
        play('tamiz-rango', 'Deja adentro solo lo que cumple', { rounds: [
          { name: 'P', text: 'las vocales que van después de la e', labels: ['a', 'e', 'i', 'o', 'u'], lo: 2, hi: 4 },
          { name: 'Q', text: 'los días antes del jueves', labels: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'], lo: 0, hi: 2 }] },
        '$P = \\{i, o, u\\}$ y $Q = \\{\\text{lun}, \\text{mar}, \\text{mié}\\}$.', { hint: 'Revisa los extremos uno por uno.' })],
      ['alg-0a', 'Una bolsa dentro de un conjunto es un solo elemento, tenga lo que tenga.',
        play('cajas-anidadas', 'Arma el conjunto', { rounds: [{ name: 'E', target: ['a', '{b, c}'], tray: ['a', 'b', 'c', '{b, c}', '{a}'] }] },
        '$E = \\{a, \\{b, c\\}\\}$ tiene dos elementos.', { hint: 'Cada coma de afuera separa un elemento.' })],
      ['alg-0a', 'Dos conjuntos son iguales si tienen los mismos elementos; el orden y las repeticiones no cuentan.',
        play('gemelos', 'Deja A = B sin sacar de más', { rounds: [{ goal: '=', A: ['c', 'a', 'm', 'p', 'o'], B: ['m', 'o', 'c', 'a', 'a'] }] },
        'Sobra la p: $\\{m, o, c, a, a\\} = \\{c, a, m, o\\}$.', { hint: 'Busca el elemento sin hilo.' })],
      ['alg-0b', 'El vacío no tiene elementos; $\\{\\varnothing\\}$ tiene uno, y 0 no es el vacío.',
        play('cajas-anidadas', 'Arma cada conjunto', { rounds: [
          { name: 'F', target: ['∅'], tray: ['∅', '{∅}', '0', '{0}'] },
          { name: 'H', target: ['0', '∅'], tray: ['0', '∅', '{0}', '{∅}', '1'] }] },
        '$F = \\{\\varnothing\\}$ tiene un elemento, el vacío. $H = \\{0, \\varnothing\\}$ tiene dos: el número 0 y el conjunto vacío.', { hint: 'Una bolsa vacía también es una pieza.' })],
      ['alg-0b', '$A \\subseteq B$ pide que todo elemento de A esté en B; disjuntos es no compartir nada.',
        play('gemelos', 'Logra la relación sin sacar de más', { rounds: [
          { goal: 'sub', A: ['3', '6', '9'], B: ['1', '3', '6', '12'] },
          { goal: 'disj', A: ['p', 'e', 'z'], B: ['p', 'a', 'z', 'o'] }] },
        'Para $A \\subseteq B$ sobra el 9. Para que sean disjuntos salen de B la p y la z.', { hint: 'Mira qué elementos tienen hilo.' })],
      ['alg-0b', 'En una cadena de inclusión cada conjunto contiene al anterior; el vacío está contenido en todos.',
        play('escalera-inclusion', 'Arma la cadena más larga', { rounds: [{ sets: [['m', 'n'], [], ['m', 'n', 'o'], ['n'], ['o', 'p']] }] },
        '$\\varnothing \\subseteq \\{n\\} \\subseteq \\{m, n\\} \\subseteq \\{m, n, o\\}$.', { hint: 'Empieza por el más pequeño.' })],
      ['alg-0b', 'Un conjunto de $n$ elementos tiene $2^n$ subconjuntos: cada elemento duplica las posibilidades.',
        play('arbol-partes', 'Haz crecer el árbol', { rounds: [{ target: 4, pool: ['a', 'b', 'c', 'd'] }] },
        '$2^2 = 4$: dos elementos.', { hint: 'Cada elemento duplica las hojas.' })],
      ['alg-0c', 'La intersección es lo común. A − B quita de A lo que también está en B.',
        play('goma-diferencia', 'Borra lo que la operación deja por fuera', { rounds: [
          { op: 'A-B', U: ['C', 'L', 'I', 'M', 'A', 'R'], A: ['C', 'L', 'I', 'M', 'A'], B: ['M', 'A', 'R'] },
          { op: 'Ac', U: ['1', '2', '3', '4', '5', '6'], A: ['2', '4', '6'], B: ['1', '2'] }] },
        'Las letras de CLIMA que no están en MAR son $\\{C, L, I\\}$. El complemento de $\\{2, 4, 6\\}$ en $\\{1, \\dots, 6\\}$ es $\\{1, 3, 5\\}$.', { hint: 'Ubica cada elemento en su zona.' })],
      ['alg-0c', 'Lo común de A va en B; lo que la unión agrega fuera de A también; nada más.',
        play('busca-b', 'Encuentra el conjunto B', { rounds: [{ U: ['1', '2', '3', '4', '5', '6'], A: ['1', '2', '4'], conds: [['union', ['1', '2', '3', '4']], ['inter', ['1']]] }] },
        '$B = \\{1, 3\\}$.', { hint: 'Empieza por la intersección.' })],
      ['alg-0c', 'Al sumar dos grupos, los que están en ambos se cuentan dos veces.',
        play('solapa-cardinal', 'Solapa B sobre A', { rounds: [{ a: 9, b: 6, total: 11, A: 'hablan inglés', B: 'hablan francés' }] },
        '$9 + 6 - 11 = 4$ hablan los dos idiomas.', { hint: 'Suma y compara con el total.' })],
    ]);
  }
  // ───────── Mundo 2 · La Recta Real ─────────
  {
    const n11 = ['ascensor', 'recta-espejo', 'fuga-de-familia', 'buzo-enteros'].map(g => keep('alg-11', g));
    setLesson('alg-11', [n11[0], n11[1],
      play('globo-lastre', 'Lleva el canasto a la altura de la bandera', { rounds: [
        { g: 3, s: 7, act: 'addG', target: -1 }, { g: 5, s: 2, act: 'addS', target: -2 }, { g: 4, s: 4, act: 'remS', target: 3 }, { g: 6, s: 1, act: 'remG', target: -1 },
      ] }, 'Cada globo vale $+1$ y cada saco $-1$: la altura es globos menos sacos. Amarrar globos es sumar positivos y colgar sacos es sumar negativos. Soltar un globo es restar un positivo: baja. Soltar un saco es restar un negativo: **sube**. Por eso $0 - (-3) = 3$.',
        { hint: 'Calcula primero a qué altura está el canasto y cuántos niveles le faltan hasta la bandera. Luego piensa qué le hace a la altura cada cosa que permite la ronda.' }),
      play('pares-cero', 'Suma y resta enteros con fichas + y −', { rounds: [
        { op: '+', a: 5, b: -8 }, { op: '+', a: -4, b: 6 }, { op: '-', a: 3, b: -4 }, { op: '-', a: -2, b: 5 },
      ] }, 'Una ficha $+$ y una $-$ juntas valen 0: se anulan. $5 + (-8)$: se anulan cinco parejas y quedan tres $-$, o sea $-3$. Para restar se quitan fichas: en $3 - (-4)$ no hay fichas $-$ que quitar, así que se agregan cuatro pares cero (no cambian el valor) y se quitan las cuatro $-$: quedan siete $+$. Igual, $-2 - 5 = -7$.',
        { hint: 'Restar es quitar. Si en la mesa no hay fichas del signo que hay que quitar, agrega pares cero: un par + y − vale 0, así que no cambia nada.' }),
      n11[2],
      play('flecha-resta', 'Pon la flecha del cambio: de antes a después', { min: -9, max: 9, rounds: [
        { text: 'La temperatura pasa de −3 °C a 5 °C', from: -3, to: 5 }, { text: 'Un dron baja de 4 m a 6 m bajo el agua', from: 4, to: -6 },
        { text: 'Un buzo sube de −8 m a −2 m', from: -8, to: -2 }, { text: 'La temperatura baja de 7 °C a 0 °C', from: 7, to: 0 },
      ] }, 'El cambio es después menos antes, y la flecha lo dibuja: $5 - (-3) = 8$ (sube 8 grados), $-6 - 4 = -10$ (el dron baja 10 metros), $-2 - (-8) = 6$ (el buzo sube 6 metros) y $0 - 7 = -7$.',
        { hint: 'La cola de la flecha va en el valor de antes y la punta en el de después. Si la flecha va hacia la izquierda, el cambio es negativo.' }),
      n11[3]]);

    const n11b = ['pizzeria', 'candado-fraccion', 'pon-la-rayita', 'carrera-fracciones'].map(g => keep('alg-11b', g));
    setLesson('alg-11b', [n11b[0], n11b[1],
      play('tableta-fraccion', 'Corta la tableta y toma la fracción que pide cada ronda', { rounds: [
        { total: 24, cols: 6, num: 3, den: 4, what: 'galletas' }, { total: 30, cols: 6, num: 2, den: 5, what: 'galletas' },
        { total: 42, cols: 7, num: 5, den: 6, what: 'galletas' }, { total: 20, cols: 5, num: 3, den: 10, what: 'galletas' },
      ] }, 'La fracción de una cantidad se reparte en tantas partes iguales como dice el denominador y se toman las del numerador. $\\tfrac34$ de 24: cuatro partes de 6, se toman tres, $18$. $\\tfrac25$ de 30 es $12$; $\\tfrac56$ de 42, $35$; y $\\tfrac{3}{10}$ de 20, $6$.',
        { hint: 'El número de abajo dice en cuántas partes iguales cortar; el de arriba, cuántas de esas partes tomar.' }),
      play('agrupa-fraccion', 'Simplifica agrupando las partes de la barra', { rounds: [
        { num: 6, den: 8 }, { num: 9, den: 12 }, { num: 10, den: 15 }, { num: 12, den: 18 },
      ] }, 'Simplificar es juntar las partes en grupos iguales sin cortar ninguno: el grupo tiene que repartir justo las partes pintadas y las de toda la barra. El grupo más grande que sirve es el máximo común divisor: $\\tfrac68 = \\tfrac34$ (de a 2), $\\tfrac{9}{12} = \\tfrac34$ (de a 3), $\\tfrac{10}{15} = \\tfrac23$ (de a 5) y $\\tfrac{12}{18} = \\tfrac23$ (de a 6).',
        { hint: 'Un grupo sirve si cabe un número exacto de veces en las partes pintadas y también en toda la barra. Prueba grupos cada vez más grandes.' }),
      play('corta-igual', 'Recorta las barras en pedacitos del mismo tamaño para poder operar', { rounds: [
        { a: [1, 4], b: [2, 3] }, { a: [5, 6], b: [1, 4] }, { a: [3, 5], b: [1, 2], op: '-' }, { a: [7, 8], b: [1, 6], op: '-' },
      ] }, 'Solo se suman o restan pedazos del mismo tamaño: por eso se busca un denominador común. $\\tfrac14 + \\tfrac23 = \\tfrac{3}{12} + \\tfrac{8}{12} = \\tfrac{11}{12}$, $\\tfrac56 + \\tfrac14 = \\tfrac{13}{12}$, $\\tfrac35 - \\tfrac12 = \\tfrac{1}{10}$ y $\\tfrac78 - \\tfrac16 = \\tfrac{17}{24}$.',
        { hint: 'Busca un número de pedacitos que se pueda repartir en los cortes de la primera barra y también en los de la segunda: un múltiplo de los dos denominadores.' }),
      n11b[2], n11b[3]]);

    const n11c = ['cajas-numericas', 'lupa-densidad', 'ubica-en-recta', 'compas-raiz', 'acorrala-raiz', 'frena-aguja'].map(g => keep('alg-11c', g));
    setLesson('alg-11c', [n11c[0], n11c[1], n11c[2], n11c[3],
      play('espiral-teodoro', 'Arma la espiral de las raíces', { rounds: [{ n: 5 }, { n: 3 }, { n: 7 }, { n: 10 }] },
        'Cada triángulo tiene un cateto de 1 y otro igual a la hipotenusa anterior. Por Pitágoras, si la anterior mide $\\sqrt{k}$, la nueva mide $\\sqrt{k + 1}$: con 4 triángulos se llega a $\\sqrt5 \\approx 2.236$, con 2 a $\\sqrt3$, con 6 a $\\sqrt7$ y con 9 a $\\sqrt{10}$. En la recta quedan entre dos enteros: no son fracciones.',
        { hint: 'Mira la hipotenusa que tienes y cuánto aumenta lo de adentro de la raíz con cada triángulo nuevo.' }),
      n11c[4], n11c[5]]);

    const n12b = ['corta-rectangulo', 'inversos-gemelos'].map(g => keep('alg-12b', g));
    setLesson('alg-12b', [n12b[0],
      play('agrupa-amigos', 'Reagrupa la suma en parejas redondas', { rounds: [
        { nums: [17, 38, 83, 62], unit: 100 }, { nums: [26, 45, 74, 55], unit: 100 }, { nums: [8, 13, 92, 87], unit: 100 }, { nums: [36, 19, 64, 81], unit: 100 },
      ] }, 'Por la conmutativa y la asociativa se puede sumar en cualquier orden y agrupar como se quiera. $(17 + 83) + (38 + 62) = 100 + 100 = 200$; $(26 + 74) + (45 + 55) = 200$; $(8 + 92) + (13 + 87) = 200$ y $(36 + 64) + (19 + 81) = 200$.',
        { hint: 'Mira las unidades: busca parejas cuyas unidades sumen 10, y luego revisa si las decenas completan la centena.' }),
      play('multiplica-primero', 'Multiplica primero la pareja que da una cifra redonda', { rounds: [
        { nums: [25, 13, 4] }, { nums: [2, 37, 5] }, { nums: [17, 20, 5] }, { nums: [125, 3, 8] },
      ] }, 'En un producto el orden y los paréntesis tampoco cambian el resultado: $(25 \\cdot 4) \\cdot 13 = 1300$, $(2 \\cdot 5) \\cdot 37 = 370$, $17 \\cdot (20 \\cdot 5) = 1700$ y $(125 \\cdot 8) \\cdot 3 = 3000$. Elegir bien la primera pareja vuelve la cuenta fácil.',
        { hint: 'Busca dos factores que juntos den 10, 100 o 1000: 2 y 5, 4 y 25, 8 y 125.' }),
      n12b[1],
      play('une-rectangulos', 'Factor común: junta los rectángulos que comparten el alto', { rounds: [
        { base: [6, 7], others: [[6, 3], [4, 3]] }, { base: [4, 9], others: [[3, 9], [4, 6]] },
        { base: [5, 8], others: [[5, 2], [8, 5]] }, { base: [7, 4], others: [[7, 3], [2, 4], [7, 3]] },
      ] }, 'La distributiva leída al revés: si dos productos comparten un factor, sus rectángulos tienen el mismo alto y se pegan en uno solo. $6 \\cdot 7 + 6 \\cdot 3 = 6 \\cdot 10 = 60$; $4 \\cdot 9 + 4 \\cdot 6 = 4 \\cdot 15$; $5 \\cdot 8 + 5 \\cdot 2 = 5 \\cdot 10$; $7 \\cdot 4 + 7 \\cdot 3 + 7 \\cdot 3 = 7 \\cdot 10$. Un $8 \\cdot 5$ tiene alto 8: no comparte el 5 como alto.',
        { hint: 'Fíjate solo en el alto de cada rectángulo, el primer número: tiene que ser igual al de la base.' }),
      play('deshaz-camino', 'Regresa al número de partida deshaciendo los pasos', { rounds: [
        { x: 2, ops: [['×', 4], ['+', 3]], cards: [['+', -3], ['×', 0.25], ['+', 3], ['×', 4], ['×', -0.25]] },
        { x: -5, ops: [['+', 6], ['×', -2]], cards: [['×', -0.5], ['+', -6], ['×', 2], ['+', 6], ['×', 0.5]] },
        { x: 3, ops: [['×', 1 / 3], ['+', 4]], cards: [['+', -4], ['×', 3], ['+', 4], ['×', 1 / 3], ['×', -3]] },
      ] }, 'Sumar el opuesto deshace una suma y multiplicar por el recíproco deshace un producto, porque llevan al neutro: $a + (-a) = 0$ y $a \\cdot \\tfrac1a = 1$. Y se deshace al revés: lo último que se hizo es lo primero que se quita. $2 \\to 8 \\to 11$, y de regreso $11 - 3 = 8$, $8 \\cdot \\tfrac14 = 2$.',
        { hint: 'Empieza por la última puerta de la ida. ¿Qué número la deshace: el opuesto o el recíproco?' }),
      play('vagon-inverso', 'Inversos: lleva el vagón al 0 y la liga al largo 1', { rounds: [
        { title: 'Opuestos', items: [{ kind: '+', a: 5 }, { kind: '+', a: -3 }, { kind: '+', a: -6 }] },
        { title: 'Recíprocos', items: [{ kind: '×', a: [3, 1] }, { kind: '×', a: [2, 3] }, { kind: '×', a: [1, 4] }] },
      ] }, 'El opuesto lleva al neutro de la suma: $5 + (-5) = 0$. El recíproco lleva al neutro del producto: $3 \\cdot \\tfrac13 = 1$, $\\tfrac23 \\cdot \\tfrac32 = 1$ y $\\tfrac14 \\cdot 4 = 1$. El 0 no tendría recíproco: ninguna liga de largo 0 se estira hasta 1.',
        { hint: 'Para el vagón, suma lo mismo que está lejos del 0 pero hacia el otro lado. Para la liga, voltea la fracción.' })]);

    const n12c = ['arma-producto', 'cancela-balanza'].map(g => keep('alg-12c', g));
    setLesson('alg-12c', [n12c[0],
      play('resta-opuesto', 'Resta sumando el opuesto, con flechas', { min: -12, max: 12, rounds: [
        { a: 5, b: 8 }, { a: -3, b: -6 }, { a: 2, b: -4 }, { a: -1, b: 5 },
      ] }, 'Restar $b$ es sumar su opuesto: $a - b = a + (-b)$. Se voltea la flecha de $b$ y se pega a la de $a$: $5 - 8 = 5 + (-8) = -3$; $-3 - (-6) = -3 + 6 = 3$; $2 - (-4) = 6$; $-1 - 5 = -6$.',
        { hint: 'Primero voltea la flecha de abajo: el opuesto apunta al otro lado. Después pega su cola en la punta de la flecha de arriba.' }),
      play('voltea-flecha', 'Estira y voltea la flecha hasta el aro', { rounds: [
        { a: 3, target: -9 }, { a: -2, target: 8 }, { a: -6, target: -12 }, { a: 4, target: -16 },
      ] }, 'El multiplicador repite la flecha y, si es negativo, la refleja en el 0: $3 \\cdot (-3) = -9$, $(-2)(-4) = 8$, $(-6) \\cdot 2 = -12$ y $4 \\cdot (-4) = -16$. Dos negativos dan positivo porque voltear dos veces deja la flecha como estaba.',
        { hint: 'Decide cuántas copias de la flecha caben hasta el aro y mira de qué lado del 0 está el aro: así sabes si hay que voltear.' }),
      play('parte-flecha', 'Divide partiendo la flecha y volteando si hace falta', { min: -18, max: 18, rounds: [
        { a: -12, b: 3 }, { a: 15, b: -5 }, { a: -18, b: -6 }, { a: 7, b: 2 },
      ] }, 'Dividir es multiplicar por el recíproco: $a \\div b = a \\cdot \\tfrac1b$. Partir en 3 es tomar $\\tfrac13$: $(-12) \\div 3 = -4$. Si el divisor es negativo se voltea además: $15 \\div (-5) = -3$ y $(-18) \\div (-6) = 3$. Y $7 \\div 2 = 3.5$.',
        { hint: 'El número de pedazos es el valor del divisor sin signo. El signo del divisor dice si hay que voltear el pedazo.' }),
      n12c[1],
      play('capas-operacion', 'Resuelve capa por capa, cuidando los signos', { rounds: [
        { title: 'Con signos', items: [{ expr: '-3 * ( 4 - 6 ) + 5' }, { expr: '12 / -4 - 2 * -3' }, { expr: '-8 - ( 2 - 7 ) * 2' }] },
      ] }, 'Primero los paréntesis, luego × y ÷ de izquierda a derecha, y al final + y −, con la ley de los signos en cada paso: $-3(4 - 6) + 5 = -3(-2) + 5 = 11$; $12 \\div (-4) - 2(-3) = -3 + 6 = 3$; $-8 - (-5) \\cdot 2 = -8 + 10 = 2$.',
        { hint: 'Antes de operar dos números, mira sus signos: dos iguales dan positivo y dos distintos, negativo.' }),
      play('rebote-signos', 'Saltos con signo: cada salto multiplica por un negativo', { rounds: [
        { title: 'Saltos con signo', items: [{ f: -2, n: 2, target: 12 }, { f: -2, n: 3, target: 24 }, { f: -3, n: 2, target: -18 }] },
        { title: 'Pares e impares', items: [{ f: -1, n: 5, target: 4 }, { f: -2, n: 1, target: -10 }, { f: -2, n: 4, target: -16 }] },
      ] }, 'Cada salto multiplica por un negativo y cambia de lado del 0. Con un número par de saltos el signo vuelve a ser el del comienzo; con un número impar, cambia: $3 \\cdot (-2)^2 = 12$, $-3 \\cdot (-2)^3 = 24$, $-2 \\cdot (-3)^2 = -18$, $-4 \\cdot (-1)^5 = 4$.',
        { hint: 'Calcula primero cuánto multiplican todos los saltos juntos y con qué signo; después busca de dónde hay que salir.' })]);

    const n12d = ['tren-ordenado', 'dobla-la-recta', 'distancia-justa', 'dibuja-intervalo', 'serpiente-orden'].map(g => keep('alg-12d', g));
    setLesson('alg-12d', [n12d[0], n12d[1],
      play('espejo-desigualdad', 'Mira qué le pasa al orden al sumar o multiplicar', { rounds: [
        { op: '×', a: 2, b: 5, target: -6 }, { op: '+', a: -3, b: 1, target: 2 }, { op: '×', a: -4, b: 2, target: 2 }, { op: '×', a: 1, b: 3, target: 2 },
      ] }, 'Sumar el mismo número corre los dos puntos igual: el orden se conserva ($-3 < 1 \\Rightarrow 2 < 6$). Multiplicar por un positivo también lo conserva ($1 < 3 \\Rightarrow 2 < 6$). Multiplicar por un negativo refleja la recta en el 0 y el orden **se voltea**: $2 < 5 \\Rightarrow -6 > -15$ y $-4 < 2 \\Rightarrow 2 > -1$.',
        { hint: 'Busca el número que lleva a a la bandera. Luego compara: ¿b quedó a la derecha o a la izquierda de a?' }),
      n12d[2], n12d[3],
      play('correa-del-perro', 'Pon el poste, la correa y la zona de cada desigualdad', { min: -8, max: 8, rounds: [
        { txt: '|x − 3| > 2', c: 3, r: 2, out: true, closed: false }, { txt: '|x + 2| ≥ 4', c: -2, r: 4, out: true, closed: true }, { txt: '|x| < 5', c: 0, r: 5, out: false, closed: false },
      ] }, '$|x - c|$ es la distancia de $x$ al poste $c$. «Menor que» es lo que alcanza la correa; «mayor que» es lo que queda fuera de su alcance, a los dos lados. $|x - 3| > 2$: $x < 1$ o $x > 5$. $|x + 2| \\ge 4$: $x \\le -6$ o $x \\ge 2$ (el poste está en $-2$). $|x| < 5$: $-5 < x < 5$.',
        { hint: 'Escribe la desigualdad como distancia: |x + 2| es la distancia de x a −2. Luego decide si la zona es adentro o afuera del alcance.' }),
      n12d[4]]);

    setExam('numeros', [
      ['alg-11', 'Restar es quitar fichas; si no hay de las que hay que quitar, se agregan pares cero.',
        play('pares-cero', 'Calcula con fichas', { rounds: [{ op: '-', a: -1, b: -3 }, { op: '+', a: 4, b: -7 }] }, '$-1 - (-3) = 2$ y $4 + (-7) = -3$.', { hint: 'Un par + y − vale cero.' })],
      ['alg-11', 'El cambio es después menos antes, con su signo.',
        play('flecha-resta', 'Pon la flecha del cambio', { min: -9, max: 9, rounds: [{ text: 'La temperatura sube de −6 °C a −1 °C', from: -6, to: -1 }] }, '$-1 - (-6) = 5$.', { hint: 'Cola en el antes, punta en el después.' })],
      ['alg-11b', 'Simplificar es agrupar partes sin cortar ninguna: el grupo más grande es el máximo común divisor.',
        play('agrupa-fraccion', 'Simplifica agrupando', { rounds: [{ num: 8, den: 12 }] }, '$\\tfrac{8}{12} = \\tfrac23$, de a 4.', { hint: 'Prueba grupos cada vez más grandes.' })],
      ['alg-11b', 'Para sumar fracciones hace falta un denominador común.',
        play('corta-igual', 'Recorta en pedacitos iguales', { rounds: [{ a: [2, 5], b: [1, 3] }] }, '$\\tfrac25 + \\tfrac13 = \\tfrac{6}{15} + \\tfrac{5}{15} = \\tfrac{11}{15}$.', { hint: 'Busca un múltiplo de los dos denominadores.' })],
      ['alg-11c', 'Cada triángulo de la espiral suma uno bajo la raíz: $\\sqrt{k} \\to \\sqrt{k + 1}$.',
        play('espiral-teodoro', 'Arma la espiral', { rounds: [{ n: 6 }] }, 'Con 5 triángulos se llega a $\\sqrt6 \\approx 2.449$.', { hint: 'Cuenta los triángulos desde $\\sqrt2$.' })],
      ['alg-11c', 'La diagonal de un rectángulo de lados a y b mide $\\sqrt{a^2 + b^2}$.',
        play('compas-raiz', 'Elige los lados del rectángulo para que el compás caiga en la banderita', { rounds: [{ n: 13 }], max: 4 }, '$2^2 + 3^2 = 13$: la diagonal mide $\\sqrt{13}$.', { hint: 'Busca dos cuadrados que sumen 13.' })],
      ['alg-12b', 'El opuesto deshace una suma y el recíproco un producto; se deshace en orden contrario.',
        play('deshaz-camino', 'Regresa al número de partida', { rounds: [{ x: 4, ops: [['+', -7], ['×', 2]], cards: [['×', 0.5], ['+', 7], ['×', 2], ['+', -7]] }] }, '$4 \\to -3 \\to -6$; de regreso $-6 \\cdot \\tfrac12 = -3$ y $-3 + 7 = 4$.', { hint: 'Empieza por la última puerta.' })],
      ['alg-12b', 'La conmutativa y la asociativa permiten sumar en el orden más cómodo.',
        play('agrupa-amigos', 'Suma en parejas redondas', { rounds: [{ nums: [47, 29, 53, 71], unit: 100 }] }, '$(47 + 53) + (29 + 71) = 200$.', { hint: 'Mira las unidades.' })],
      ['alg-12c', 'Restar es sumar el opuesto.',
        play('resta-opuesto', 'Resta sumando el opuesto', { min: -12, max: 12, rounds: [{ a: -4, b: 3 }] }, '$-4 - 3 = -4 + (-3) = -7$.', { hint: 'Voltea y pega.' })],
      ['alg-12c', 'Dividir es multiplicar por el recíproco; el signo sigue la ley de los signos.',
        play('parte-flecha', 'Divide partiendo la flecha', { min: -18, max: 18, rounds: [{ a: -15, b: -3 }] }, '$(-15) \\div (-3) = 5$.', { hint: 'Tres pedazos y voltear.' })],
      ['alg-12d', 'Multiplicar por un negativo voltea el orden.',
        play('espejo-desigualdad', 'Mira qué le pasa al orden', { rounds: [{ op: '×', a: -3, b: 1, target: 6 }] }, 'Por $-2$: $-3 < 1 \\Rightarrow 6 > -2$.', { hint: 'Busca el factor que lleva a a la bandera.' })],
      ['alg-12d', '$|x - c| > r$ son los puntos a más de r del poste c, a los dos lados.',
        play('correa-del-perro', 'Pon el poste, la correa y la zona', { min: -8, max: 8, rounds: [{ txt: '|x + 1| > 3', c: -1, r: 3, out: true, closed: false }] }, '$x < -4$ o $x > 2$.', { hint: 'El poste está en −1.' })],
    ]);
  }
  // ───────── Mundo 3 · Escalas y Proporciones ─────────
  {
    const r12 = ['limonada', 'estira-foto'].map(g => keep('alg-12', g));
    setLesson('alg-12', [r12[0],
      play('barra-razon', 'Parte la cinta en la razón pedida', { rounds: [
        { T: 35, p: 2, q: 5, A: 'jugo', B: 'agua' }, { T: 24, p: 5, q: 3, A: 'rojas', B: 'azules' },
        { T: 36, p: 4, q: 5, A: 'niños', B: 'adultos' }, { T: 30, p: 1, q: 4, A: 'vinagre', B: 'aceite' },
      ] }, 'En $p : q$ el todo tiene $p + q$ partes iguales. En 35 con $2 : 5$ hay 7 partes de 5: quedan $10$ y $25$. Con $5 : 3$ en 24, 8 partes de 3: $15$ y $9$. Con $4 : 5$ en 36, partes de 4: $16$ y $20$. Con $1 : 4$ en 30, partes de 6: $6$ y $24$.',
        { hint: 'Suma los dos números de la razón: así sabes en cuántas partes iguales se reparte la cinta. Luego mira cuánto vale cada parte.' }),
      r12[1],
      play('rejilla-razon', 'Pinta las baldosas en la razón pedida', { rounds: [
        { rows: 3, cols: 5, p: 2, q: 3 }, { rows: 4, cols: 6, p: 1, q: 2 }, { rows: 3, cols: 6, p: 5, q: 1 }, { rows: 4, cols: 5, p: 3, q: 7 },
      ] }, 'Razones equivalentes: multiplicar los dos términos por el mismo número no cambia la razón. En 15 baldosas $2 : 3$ es $6 : 9$; en 24, $1 : 2$ es $8 : 16$; en 18, $5 : 1$ es $15 : 3$; en 20, $3 : 7$ es $6 : 14$.',
        { hint: 'El total de baldosas tiene que repartirse en p + q partes iguales: pinta p de esas partes.' }),
      play('receta-escala', 'Agranda o achica la receta', { rounds: [
        { base: 4, items: [['harina', 300, 'g'], ['leche', 200, 'mL'], ['azúcar', 80, 'g']], goal: [0, 450] },
        { base: 6, items: [['arroz', 450, 'g'], ['agua', 900, 'mL']], goal: [1, 300] },
        { base: 2, items: [['avena', 60, 'g'], ['leche', 250, 'mL']], goal: [1, 1250] },
      ] }, 'La razón entre ingredientes y porciones se conserva: si la harina pasa de 300 g a 450 g, se multiplicó por $\\tfrac32$, y las porciones también: $4 \\cdot \\tfrac32 = 6$. Con 300 mL de agua en lugar de 900 se divide entre 3: $2$ porciones. Y $1250$ mL de leche son 5 veces 250: $10$ porciones.',
        { hint: 'Compara la cantidad pedida con la de la receta: ¿por cuánto se multiplicó? Multiplica por lo mismo las porciones.' }),
      play('bici-cambios', 'Elige el piñón para llegar a la bandera', { rounds: [
        { title: 'Cambios', items: [{ front: 48, cogs: [16, 12, 24], turns: 3, target: 12 }, { front: 36, cogs: [12, 24, 18], turns: 4, target: 8 }, { front: 40, cogs: [10, 20, 16], turns: 2, target: 5 }] },
      ] }, 'Por cada pedalada la rueda da plato : piñón vueltas. $48 : 12 = 4$, y 3 pedaladas dan 12 vueltas. $36 : 18 = 2$, por 4 son 8. $40 : 16 = 2.5$, por 2 son 5.',
        { hint: 'Divide las vueltas de la meta entre las pedaladas: eso debe dar el plato dividido entre el piñón.' })]);

    const r12e = ['balanza-proporcion', 'sombra-arbol', 'cuadrado-media', 'duplica-magnitud', 'grafica-relacion', 'reparto'].map(g => keep('alg-12e', g));
    setLesson('alg-12e', [...r12e,
      play('llaves-tanque', 'Proporción inversa: llena el tanque a tiempo', { rounds: [
        { title: 'Más llaves, menos tiempo', items: [{ taps: 2, hours: 6, target: 3 }, { taps: 3, hours: 8, target: 6 }, { taps: 4, hours: 3, target: 2 }] },
      ] }, 'Llaves y horas son inversamente proporcionales: el producto se conserva. $2 \\cdot 6 = 12$, así que en 3 horas hacen falta $12 \\div 3 = 4$ llaves; $3 \\cdot 8 = 24$ da 4 llaves para 6 horas; $4 \\cdot 3 = 12$ da 6 llaves para 2 horas.',
        { hint: 'Multiplica las llaves por las horas del dato: ese producto se mantiene. Divide entre las horas de la meta.' })]);

    const r12f = ['arma-regla', 'bascula', 'la-obra', 'engranajes', 'resortera-tres'].map(g => keep('alg-12f', g));
    setLesson('alg-12f', [r12f[0], r12f[1], r12f[2],
      play('mapa-escala', 'Ubica el pueblo a la distancia real', { rounds: [
        { cm: 1, km: 25, real: 150 }, { cm: 2, km: 15, real: 60 }, { cm: 1, km: 40, real: 100 }, { cm: 4, km: 50, real: 75 },
      ] }, 'Es una regla de tres directa: más kilómetros, más centímetros. $150 \\div 25 = 6$ cm; $60$ km son 4 veces 15, así que $4 \\cdot 2 = 8$ cm; $100 \\div 40 = 2.5$ cm; y 75 km son $\\tfrac32$ de 50: $6$ cm.',
        { hint: 'Busca cuántos km vale un solo centímetro (reducir a la unidad) y cuántos de esos caben en la distancia real.' }),
      r12f[3], r12f[4]]);

    const r13 = ['cuadricula-cien', 'rueda-porcentaje', 'cruz-porcentaje', 'mezcla'].map(g => keep('alg-13', g));
    setLesson('alg-13', [r13[0], r13[1],
      play('pinta-personas', 'Pinta a las personas que pide cada ronda', { rounds: [
        { total: 20, pct: 45, what: 'usan gafas' }, { total: 40, pct: 15, what: 'trotan' }, { total: 25, pct: 68, what: 'leen' }, { total: 8, pct: 75, what: 'cantan' },
      ] }, 'El por ciento es de cada 100: en un grupo de 20, cada persona es el 5 %, así que el 45 % son 9. En 40, cada una es 2.5 %: el 15 % son 6. En 25, cada una es 4 %: el 68 % son 17. En 8, el 75 % son tres cuartos: 6.',
        { hint: 'Averigua qué porcentaje vale una sola persona del grupo (100 entre el total) y cuántas hacen falta.' }),
      r13[2], r13[3],
      play('tanque-porcentaje', 'Llena el tanque al porcentaje pedido', { rounds: [
        { title: 'Litros', items: [{ cap: 80, pct: 35, step: 2 }, { cap: 60, pct: 15, step: 3 }, { cap: 200, pct: 12, step: 4 }] },
        { title: 'Más finos', items: [{ cap: 50, pct: 8, step: 2 }, { cap: 120, pct: 75, step: 6 }, { cap: 40, pct: 5, step: 1 }] },
      ] }, 'El $p\\,\\%$ de una capacidad es $\\tfrac{p}{100}$ de ella: $0.35 \\cdot 80 = 28$ L, $0.15 \\cdot 60 = 9$ L, $0.12 \\cdot 200 = 24$ L, $0.08 \\cdot 50 = 4$ L, $\\tfrac34$ de 120 son 90 L y el 5 % de 40 son 2 L.',
        { hint: 'Calcula primero el 1 % o el 10 % del tanque y luego junta las veces que haga falta.' })]);

    const r13c = ['estira-barra', 'etiqueta-rebaja', 'bodegas'].map(g => keep('alg-13c', g));
    setLesson('alg-13c', [r13c[0], r13c[1],
      play('factor-cambio', 'Encuentra el factor del cambio', { rounds: [
        { from: 80, to: 92 }, { from: 120, to: 90 }, { from: 40, to: 50 }, { from: 50, to: 40 },
      ] }, 'Cambiar un $r\\,\\%$ es multiplicar por $1 \\pm \\tfrac{r}{100}$, y el porcentaje se mide sobre el valor de antes: $80 \\cdot 1.15 = 92$ (+15 %), $120 \\cdot 0.75 = 90$ (−25 %). De 40 a 50 es $\\times 1.25$ (+25 %), pero de 50 a 40 es $\\times 0.8$ (−20 %): no es simétrico.',
        { hint: 'Divide el valor de después entre el de antes: ese es el factor. Si es mayor que 1 aumentó; si es menor, bajó.' }),
      r13c[2],
      play('precio-original', 'Encuentra el precio de antes', { rounds: [
        { r: -20, now: 48, step: 5, max: 100 }, { r: -25, now: 90, step: 5, max: 160 }, { r: 15, now: 69, step: 5, max: 100 }, { r: -40, now: 27, step: 5, max: 60 },
      ] }, 'Para volver se divide entre el factor: $48 \\div 0.8 = 60$, $90 \\div 0.75 = 120$, $69 \\div 1.15 = 60$, $27 \\div 0.6 = 45$. Sumar el 20 % a 48 daría 57.6, no 60: el porcentaje se calculó sobre el precio de antes.',
        { hint: 'El precio de ahora es el de antes por el factor. Prueba un precio de antes y mira si al aplicar el cambio sale la etiqueta.' }),
      play('rampa-precio', 'Elige el sello para que la etiqueta llegue con su precio', { rounds: [
        { title: 'Descuentos', items: [{ from: 200, to: 170 }, { from: 80, to: 60 }, { from: 50, to: 45 }] },
        { title: 'Aumentos', items: [{ from: 120, to: 150 }, { from: 40, to: 46 }, { from: 300, to: 345 }] },
      ] }, 'El porcentaje es el cambio dividido entre el precio de arriba: de 200 a 170 bajan 30, que es el 15 % de 200; de 80 a 60, el 25 %; de 50 a 45, el 10 %. De 120 a 150 sube 30: el 25 %; de 40 a 46 y de 300 a 345, el 15 %.',
        { hint: 'Mira cuánto cambió el precio y qué parte es eso del precio de arriba.' })]);

    const r13d = ['cascada', 'rebote', 'dos-etapas'].map(g => keep('alg-13d', g));
    setLesson('alg-13d', [r13d[0], r13d[1],
      play('semanas-rebaja', 'Cambios repetidos: ¿en qué semana cruza la línea?', { rounds: [
        { r: -10, line: 50 }, { r: -20, line: 30 }, { r: 5, line: 150 }, { r: -30, line: 10 },
      ] }, 'Repetir un cambio es multiplicar otra vez por el mismo factor: $100 \\cdot 0.9^n$. $0.9^6 \\approx 0.53$ y $0.9^7 \\approx 0.48$: la semana 7. $0.8^6 \\approx 0.26$: la 6. $1.05^9 \\approx 1.55$: la 9. $0.7^7 \\approx 0.08$: la 7. No basta con multiplicar el porcentaje por las semanas.',
        { hint: 'Cada semana se multiplica por el mismo factor. Mira las barras: ¿cuál es la primera que cruza la línea?' }),
      r13d[2],
      play('sube-y-baja', 'Sube y baja el mismo porcentaje', { rounds: [{ end: 91 }, { end: 84 }, { end: 96 }, { end: 75 }] },
        'Subir $x$ y bajar $x$ multiplica por $(1 + x)(1 - x) = 1 - x^2$: siempre queda por debajo. Con 30 % queda $100(1 - 0.09) = 91$; con 40 %, 84; con 20 %, 96; con 50 %, 75.',
        { hint: 'Después de subir, el porcentaje de bajada se calcula sobre un precio más grande. Mira cuánto se pierde con cada porcentaje.' }),
      play('rompe-cambios', 'Mueve la paleta y manda la pelota al ladrillo del resultado', { rounds: [
        { title: 'Dos cambios', items: [
          { ask: '100 → −20 % → −10 %', options: ['72', '70', '80'], answer: 0 },
          { ask: '200 → +10 % → +10 %', options: ['240', '220', '242'], answer: 2 },
          { ask: '50 → −50 % → +50 %', options: ['50', '37.5', '25'], answer: 1 }] },
      ] }, 'Los cambios seguidos se multiplican: $100 \\cdot 0.8 \\cdot 0.9 = 72$; $200 \\cdot 1.1 \\cdot 1.1 = 242$; $50 \\cdot 0.5 \\cdot 1.5 = 37.5$. Sumar los porcentajes daría otra cosa.',
        { hint: 'Aplica el primer cambio, y el segundo sobre lo que resultó.' })]);

    setExam('razones', [
      ['alg-12', 'En $p : q$ el todo tiene $p + q$ partes iguales.',
        play('barra-razon', 'Parte la cinta', { rounds: [{ T: 28, p: 3, q: 4, A: 'té', B: 'leche' }] }, '$12$ de té y $16$ de leche.', { hint: 'Siete partes de 4.' })],
      ['alg-12', 'Las razones equivalentes multiplican los dos términos por lo mismo.',
        play('rejilla-razon', 'Pinta en la razón', { rounds: [{ rows: 2, cols: 6, p: 1, q: 3 }] }, '$3 : 9 = 1 : 3$.', { hint: 'Cuatro partes de 3.' })],
      ['alg-12e', 'En el reparto proporcional se suman las partes y el total se divide en esa razón.',
        play('barra-razon', 'Reparte la cinta', { rounds: [{ T: 45, p: 4, q: 5, A: 'Ana', B: 'Beto' }] }, 'Nueve partes de 5: 20 y 25.', { hint: 'Suma 4 + 5.' })],
      ['alg-12e', 'En una proporción directa el cociente se conserva.',
        play('receta-escala', 'Ajusta la receta', { rounds: [{ base: 3, items: [['tomate', 6, 'u'], ['cebolla', 2, 'u']], goal: [0, 14] }] }, 'Dos tomates por porción: 7 porciones.', { hint: 'Reduce a una porción.' })],
      ['alg-12f', 'Con una escala se arma una regla de tres directa.',
        play('mapa-escala', 'Ubica el pueblo', { rounds: [{ cm: 1, km: 30, real: 105 }, { cm: 3, km: 20, real: 50 }] }, '$105 \\div 30 = 3.5$ cm y $50 \\cdot 3 \\div 20 = 7.5$ cm.', { hint: 'Reduce a la unidad.' })],
      ['alg-12f', 'En la proporción inversa lo que se conserva es el producto.',
        play('la-obra', 'Deja en la obra los obreros justos', { workers: 6, days: 20, askDays: 15, max: 12 }, '$6 \\cdot 20 = 120$ jornadas: en 15 días hacen falta 8 obreros.', { hint: 'Obreros × días se mantiene.' })],
      ['alg-13', 'El $p\\,\\%$ es $p$ de cada 100.',
        play('pinta-personas', 'Pinta a las personas', { rounds: [{ total: 20, pct: 65, what: 'votaron' }] }, 'Cada persona es el 5 %: 13.', { hint: '100 entre 20.' })],
      ['alg-13', 'Un porcentaje es una razón parte : todo con el todo en 100.',
        play('cuadricula-cien', 'Pinta en la cuadrícula el porcentaje', { rounds: [{ ask: '3 de cada 4', count: 75 }] }, '$\\tfrac34 = \\tfrac{75}{100}$.', { hint: 'Lleva el denominador a 100.' })],
      ['alg-13c', 'Un cambio porcentual es un factor sobre el valor de antes.',
        play('factor-cambio', 'Encuentra el factor', { rounds: [{ from: 60, to: 45 }] }, '$\\times 0.75$: −25 %.', { hint: 'Divide después entre antes.' })],
      ['alg-13c', 'Para recuperar el precio de antes se divide entre el factor.',
        play('precio-original', 'Encuentra el precio de antes', { rounds: [{ r: -30, now: 56, step: 5, max: 120 }] }, '$56 \\div 0.7 = 80$.', { hint: 'Prueba precios y aplica el cambio.' })],
      ['alg-13d', 'Un cambio repetido es una potencia del factor.',
        play('semanas-rebaja', '¿En qué semana cruza la línea?', { rounds: [{ r: -15, line: 50 }] }, '$0.85^4 \\approx 0.52$ y $0.85^5 \\approx 0.44$: la semana 5.', { hint: 'Mira las barras.' })],
      ['alg-13d', 'Subir y bajar el mismo porcentaje deja el precio por debajo: $(1 + x)(1 - x) = 1 - x^2$.',
        play('sube-y-baja', 'Sube y baja el mismo porcentaje', { rounds: [{ end: 99 }] }, 'Con 10 %: $100 \\cdot 0.99 = 99$.', { hint: '$1 - x^2$.' })],
    ]);
  }
  // ───────── Mundo 4 · Exponentes y Radicales ─────────
  {
    const p21a = ['arbol-potencia', 'torre-producto', 'pares-negativos', 'torre-pisos'].map(g => keep('alg-21a', g));
    setLesson('alg-21a', [p21a[0], p21a[1],
      play('escalera-potencias', 'Sube y baja por la escalera de potencias', { rounds: [
        { base: 2, num: 1, den: 8 }, { base: 5, num: 1, den: 1 }, { base: 10, num: 1, den: 100 }, { base: 4, num: 64, den: 1 },
      ] }, 'Bajar un escalón es dividir entre la base. Por eso $5^0 = 5 \\div 5 = 1$ (no 0), y por debajo del cero salen fracciones: $2^{-3} = \\tfrac18$ y $10^{-2} = \\tfrac{1}{100}$. Y $4^3 = 64$.',
        { hint: 'Desde $b^1 = b$, cada escalón hacia abajo divide entre la base y cada uno hacia arriba multiplica.' }),
      p21a[2],
      play('cubo-bloques', 'Arma el cubo con los bloques pedidos', { rounds: [{ vol: 27 }, { vol: 64 }, { vol: 8 }, { vol: 125 }] },
        'El cubo de un número es el volumen de un cubo de esa arista: $3^3 = 27$, $4^3 = 64$, $2^3 = 8$ y $5^3 = 125$. Al doblar la arista el volumen se multiplica por 8.',
        { hint: 'Multiplica la arista por sí misma tres veces: largo por ancho por alto.' }),
      p21a[3]]);

    const p21b = ['cuenta-factores', 'cambia-de-piso', 'salta-la-coma'].map(g => keep('alg-21b', g));
    setLesson('alg-21b', [p21b[0],
      play('cancela-pisos', 'Divide potencias cancelando por parejas', { rounds: [
        { a: 7, b: 3, v: 'x' }, { a: 2, b: 5, v: 'y' }, { a: 4, b: 4, v: 'a' }, { a: 6, b: 1, v: 'm' },
      ] }, 'Cada pareja $\\tfrac{x}{x}$ vale 1, así que se restan los exponentes: $\\tfrac{x^7}{x^3} = x^4$. Si abajo hay más, sobran abajo: $\\tfrac{y^2}{y^5} = \\tfrac{1}{y^3} = y^{-3}$. Con los mismos, todo se cancela: $\\tfrac{a^4}{a^4} = a^0 = 1$.',
        { hint: 'Cancela de a una pareja: una de arriba con una de abajo. Al final cuenta cuántas quedan y dónde.' }),
      p21b[1],
      play('copias-potencia', 'Potencia de una potencia: copia la caja', { rounds: [
        { a: 3, total: 12, v: 'x' }, { a: 2, total: 10, v: 'y' }, { a: 4, total: 8, v: 'a' }, { a: 5, total: 15, v: 'b' },
      ] }, 'Elevar $x^a$ a la $b$ es poner $b$ copias de la caja, y cada caja trae $a$ factores: $(x^a)^b = x^{ab}$. $(x^3)^4 = x^{12}$, $(y^2)^5 = y^{10}$, $(a^4)^2 = a^8$, $(b^5)^3 = b^{15}$.',
        { hint: 'Cada copia trae los mismos factores. ¿Cuántas cajas iguales hacen falta para juntar todos los pedidos?' }),
      p21b[2],
      play('escala-leyes', 'Lleva al escalador a la bandera usando **todas** las tarjetas: el orden importa', { rounds: [
        { title: 'Dos tarjetas', items: [{ start: 2, cards: [{ op: 'mul', k: 1 }, { op: 'pow', k: 3 }], target: 7 }, { start: 3, cards: [{ op: 'pow', k: 2 }, { op: 'div', k: 1 }], target: 4 }] },
        { title: 'Tres tarjetas', items: [{ start: 2, cards: [{ op: 'pow', k: 2 }, { op: 'div', k: 4 }, { op: 'mul', k: 3 }], target: 6 }, { start: 1, cards: [{ op: 'div', k: 5 }, { op: 'mul', k: 2 }, { op: 'pow', k: 3 }], target: 4 }] },
      ] }, 'Multiplicar por $x^k$ suma $k$ al exponente, dividir lo resta y elevar a la $k$ lo multiplica. Como elevar multiplica todo lo que se lleva, el orden cambia el resultado: desde $x^2$, primero $(\\;)^3$ y luego $\\cdot x$ deja $x^7$; al revés daría $x^9$.',
        { hint: 'Fíjate cuándo te conviene elevar: multiplica todo lo que llevas hasta ese momento.' })]);

    const p22a = ['lado-del-cuadrado', 'reparte-factores', 'siembra-raices'].map(g => keep('alg-22a', g));
    setLesson('alg-22a', [p22a[0], p22a[1],
      play('fraccion-exponente', 'El exponente fraccionario: raíz y potencia', { rounds: [
        { a: 27, target: 9 }, { a: 16, target: 8 }, { a: 64, target: 16 }, { a: 81, target: 27 },
      ] }, 'En $a^{m/n}$ el denominador es el índice de la raíz y el numerador la potencia: $27^{2/3} = (\\sqrt[3]{27})^2 = 3^2 = 9$, $16^{3/4} = 2^3 = 8$, $64^{2/3} = 4^2 = 16$ y $81^{3/4} = 3^3 = 27$.',
        { hint: 'Busca primero una raíz que deje un número entero pequeño; después mira a qué potencia hay que elevarlo.' }),
      play('absoluto-raiz', 'La raíz de un cuadrado es el valor absoluto', { rounds: [
        { kind: 'eq', v: 4, neg: true }, { kind: 'neq' }, { kind: 'eq', v: 3, neg: false }, { kind: 'eq', v: 6, neg: true },
      ] }, 'Al elevar al cuadrado se pierde el signo y la raíz devuelve el positivo: $\\sqrt{(-4)^2} = \\sqrt{16} = 4 = |-4|$. Por eso $\\sqrt{x^2} = |x|$, que es distinto de $x$ cuando $x$ es negativo.',
        { hint: 'Prueba con un número negativo: ¿qué queda después de elevarlo al cuadrado y sacarle raíz?' }),
      play('suma-raices', 'La raíz no se reparte en una suma', { rounds: [{ a: 9, b: 16 }, { a: 36, b: 64 }, { a: 1, b: 3 }, { a: 4, b: 5 }] },
        'El cuadrado nuevo tiene el área de los dos: $\\sqrt{9 + 16} = \\sqrt{25} = 5$, pero $\\sqrt9 + \\sqrt{16} = 7$. Igual $\\sqrt{100} = 10 \\ne 14$, $\\sqrt4 = 2 \\ne 1 + \\sqrt3$ y $\\sqrt9 = 3 \\ne 2 + \\sqrt5$.',
        { hint: 'Suma primero las dos áreas y busca el lado de un cuadrado con esa área.' }),
      p22a[2]]);

    const p22b = ['saca-del-radical', 'parte-baldosa', 'tabla-conjugado', 'muro-radicales'].map(g => keep('alg-22b', g));
    setLesson('alg-22b', [p22b[0], p22b[1],
      play('copias-raiz', 'Mete el coeficiente al radical', { rounds: [{ k: 3, n: 5 }, { k: 2, n: 7 }, { k: 4, n: 2 }, { k: 5, n: 3 }] },
        '$k\\sqrt n$ son $k$ segmentos de $\\sqrt n$, y miden lo mismo que $\\sqrt{k^2 n}$: $3\\sqrt5 = \\sqrt{45}$, $2\\sqrt7 = \\sqrt{28}$, $4\\sqrt2 = \\sqrt{32}$ y $5\\sqrt3 = \\sqrt{75}$. Al revés, sacar del radical es encontrar ese cuadrado escondido.',
        { hint: 'Para entrar a la raíz, el coeficiente entra elevado al cuadrado.' }),
      play('racionaliza-uno', 'Racionaliza con un uno disfrazado', { rounds: [
        { k: 6, n: 3, cards: [2, 3, -3, 6] }, { k: 5, n: 2, cards: [-2, 5, 2, 3] }, { k: 10, n: 5, cards: [5, 10, -5, 2] },
      ] }, 'Multiplicar por $\\tfrac{\\sqrt n}{\\sqrt n}$ es multiplicar por 1, y abajo queda $\\sqrt n \\cdot \\sqrt n = n$: $\\tfrac{6}{\\sqrt3} = \\tfrac{6\\sqrt3}{3} = 2\\sqrt3$, $\\tfrac{5}{\\sqrt2} = \\tfrac{5\\sqrt2}{2}$, $\\tfrac{10}{\\sqrt5} = 2\\sqrt5$. Otro uno deja la raíz abajo.',
        { hint: '¿Qué hay que multiplicar por la raíz de abajo para que deje de ser raíz?' }),
      p22b[2], p22b[3]]);

    setExam('potencias', [
      ['alg-21a', 'Bajar un escalón divide entre la base: $b^0 = 1$ y $b^{-n} = \\tfrac{1}{b^n}$.',
        play('escalera-potencias', 'Busca el exponente', { rounds: [{ base: 2, num: 1, den: 4 }, { base: 10, num: 1000, den: 1 }] }, '$2^{-2} = \\tfrac14$ y $10^3 = 1000$.', { hint: 'Cuenta escalones desde $b^1$.' })],
      ['alg-21b', 'Al dividir potencias de la misma base se restan los exponentes.',
        play('cancela-pisos', 'Cancela por parejas', { rounds: [{ a: 9, b: 4, v: 'z' }] }, '$\\tfrac{z^9}{z^4} = z^5$.', { hint: 'Cada pareja vale 1.' })],
      ['alg-21b', 'Potencia de una potencia: se multiplican los exponentes.',
        play('copias-potencia', 'Copia la caja', { rounds: [{ a: 2, total: 12, v: 'x' }] }, '$(x^2)^6 = x^{12}$.', { hint: 'Cada caja trae 2 factores.' })],
      ['alg-22a', '$a^{m/n} = (\\sqrt[n]{a})^m$.',
        play('fraccion-exponente', 'Raíz y potencia', { rounds: [{ a: 125, target: 25 }] }, '$125^{2/3} = 5^2 = 25$.', { hint: 'Saca primero la raíz.' })],
      ['alg-22a', 'La raíz no se reparte en una suma.',
        play('suma-raices', 'Arma el cuadrado', { rounds: [{ a: 64, b: 36 }] }, '$\\sqrt{100} = 10 \\ne 8 + 6$.', { hint: 'Suma las áreas.' })],
      ['alg-22b', '$k\\sqrt n = \\sqrt{k^2 n}$.',
        play('copias-raiz', 'Una sola raíz', { rounds: [{ k: 3, n: 7 }] }, '$3\\sqrt7 = \\sqrt{63}$.', { hint: 'El 3 entra como 9.' })],
      ['alg-22b', 'Racionalizar es multiplicar por un uno que quita la raíz de abajo.',
        play('racionaliza-uno', 'Quita la raíz de abajo', { rounds: [{ k: 4, n: 7, cards: [7, -7, 2] }] }, '$\\tfrac{4}{\\sqrt7} = \\tfrac{4\\sqrt7}{7}$.', { hint: 'La misma raíz arriba y abajo.' })],
    ]);
  }
  // ───────── Mundo 5 · Sucesiones y Series ─────────
  {
    const s14 = ['pisa-huellas', 'escalera-aritmetica', 'cuenta-saltos', 'traza-progresion'].map(g => keep('alg-14', g));
    setLesson('alg-14', [s14[0], s14[1],
      play('goteo-tanque', 'El tanque que gotea: una progresión que baja', { rounds: [
        { a1: 60, d: -4, target: 36 }, { a1: 90, d: -8, target: 34 }, { a1: 75, d: -6, target: 9 },
      ] }, 'Con diferencia negativa la progresión baja: $a_n = a_1 + (n - 1)d$. $60 - 4(n - 1) = 36$ da $n - 1 = 6$: la medición 7. $90 - 8 \\cdot 7 = 34$: la 8. $75 - 6 \\cdot 11 = 9$: la 12.',
        { hint: 'Calcula cuánto tiene que bajar y cuántas horas tarda en bajar eso; la medición es una más que las horas.' }),
      s14[2],
      play('poste-cerca', 'Los postes de la cerca: términos y saltos', { rounds: [
        { L: 24, d: 3 }, { L: 50, d: 5 }, { L: 18, d: 2 }, { L: 36, d: 4 },
      ] }, 'Entre el primer poste y el último hay un tramo menos que postes, igual que entre $a_1$ y $a_n$ hay $n - 1$ saltos: $24 \\div 3 = 8$ tramos, 9 postes; $50 \\div 5 = 10$ tramos, 11 postes; 9 tramos, 10 postes; 9 tramos, 10 postes.',
        { hint: 'Cuenta primero los tramos que caben en la cerca; los postes son uno más, porque las dos puntas llevan poste.' }),
      s14[3]]);

    const s14b = ['dos-escaleras', 'parejas-gauss', 'suma-filas', 'encesta-suma'].map(g => keep('alg-14b', g));
    setLesson('alg-14b', [s14b[0], s14b[1],
      play('nivela-barras', 'Nivela las barras: la suma es n por el promedio', { rounds: [
        { a1: 3, d: 2, n: 6 }, { a1: 2, d: 3, n: 5 }, { a1: 5, d: 4, n: 4 }, { a1: 1, d: 1, n: 8 },
      ] }, 'En una progresión aritmética lo que sobra a un lado del promedio llena lo que falta al otro: todas las barras quedan a la altura $\\tfrac{a_1 + a_n}{2}$. Por eso $S_n = n \\cdot \\tfrac{a_1 + a_n}{2}$: $6 \\cdot 8 = 48$, $5 \\cdot 8 = 40$, $4 \\cdot 11 = 44$ y $8 \\cdot 4.5 = 36$.',
        { hint: 'La línea queda justo entre la primera y la última barra: promedia esas dos alturas.' }),
      s14b[2],
      play('alcancia-semanas', 'La alcancía: ahorra un poco más cada semana', { rounds: [
        { a1: 2, d: 1, goal: 27 }, { a1: 4, d: 4, goal: 40 }, { a1: 2, d: 2, goal: 56 }, { a1: 5, d: 2, goal: 60 },
      ] }, 'El total es la suma de la progresión: $S_n = \\tfrac{n(a_1 + a_n)}{2}$. $2 + 3 + \\cdots + 7 = 27$ en 6 semanas; $4 + 8 + 12 + 16 = 40$ en 4; $2 + 4 + \\cdots + 14 = 56$ en 7; $5 + 7 + \\cdots + 15 = 60$ en 6.',
        { hint: 'Ve sumando semana a semana, o usa n por el promedio de la primera y la última semana.' }),
      s14b[3]]);

    const s14c = ['rebota-pelota', 'rellena-medios', 'dobla-fichas'].map(g => keep('alg-14c', g));
    setLesson('alg-14c', [s14c[0],
      play('razon-terminos', 'Halla la razón con dos términos', { rounds: [
        { i: 2, ai: 3, j: 5, aj: 81 }, { i: 1, ai: 64, j: 4, aj: 8 }, { i: 3, ai: 2, j: 5, aj: 50 }, { i: 1, ai: 5, j: 3, aj: 45 },
      ] }, 'Entre $a_i$ y $a_j$ hay $j - i$ multiplicaciones por $r$: $r^{j - i} = \\tfrac{a_j}{a_i}$. $r^3 = 27$ da $r = 3$; $r^3 = \\tfrac18$ da $r = \\tfrac12$; $r^2 = 25$ da $r = 5$ (o $-5$); $r^2 = 9$ da $r = 3$ o $r = -3$: con un número par de pasos, el signo no se ve.',
        { hint: 'Divide el término de adelante entre el de atrás y cuenta cuántas veces se multiplicó.' }),
      s14c[1],
      play('carrera-crecimiento', 'Sumar o multiplicar: ¿cuándo gana la geométrica?', { rounds: [
        { a: 10, d: 5, g: 1, r: 2 }, { a: 20, d: 10, g: 2, r: 3 }, { a: 50, d: 20, g: 1, r: 3 },
      ] }, 'La aritmética suma siempre lo mismo y la geométrica multiplica: al principio la primera va adelante, pero la segunda termina pasándola. $2^6 = 64 > 40$ en el término 7; $2 \\cdot 3^3 = 54 > 50$ en el 4; $3^5 = 243 > 150$ en el 6.',
        { hint: 'Compara las dos barras puesto por puesto y busca la primera vez que la coral es más alta.' }),
      play('cultivo-celulas', 'El cultivo: ¿qué generación tiene tantas células?', { rounds: [
        { a1: 3, r: 2, target: 96 }, { a1: 1, r: 3, target: 243 }, { a1: 5, r: 4, target: 320 }, { a1: 2, r: 5, target: 250 },
      ] }, '$a_n = a_1 \\cdot r^{n - 1}$: $3 \\cdot 2^5 = 96$ (generación 6), $3^5 = 243$ (6), $5 \\cdot 4^3 = 320$ (4) y $2 \\cdot 5^3 = 250$ (4).',
        { hint: 'Divide la meta entre lo del comienzo y busca qué potencia de la razón da eso.' }),
      s14c[2]]);

    const s14d = ['resta-corrida', 'limite-serie', 'rana-zenon'].map(g => keep('alg-14d', g));
    setLesson('alg-14d', [s14d[0],
      play('torre-geometrica', 'Apila términos de una geométrica', { rounds: [
        { a: 3, r: 2, target: 45 }, { a: 1, r: 3, target: 121 }, { a: 5, r: 2, target: 155 }, { a: 2, r: 4, target: 42 },
      ] }, '$S_n = \\tfrac{a(r^n - 1)}{r - 1}$: $3 + 6 + 12 + 24 = 3(2^4 - 1) = 45$; $1 + 3 + 9 + 27 + 81 = \\tfrac{3^5 - 1}{2} = 121$; $5(2^5 - 1) = 155$; $\\tfrac{2(4^3 - 1)}{3} = 42$.',
        { hint: 'Suma de a un bloque y mira cuánto falta; o usa la fórmula con varios n.' }),
      s14d[1],
      play('cuadrado-mitades', 'Pinta un cuadrado por capas que se achican', { rounds: [
        { r: [1, 2], target: [15, 16] }, { r: [1, 3], target: [26, 27] }, { r: [1, 2], target: [63, 64] }, { r: [1, 4], target: [63, 64] },
      ] }, 'Cada capa pinta una parte de lo que falta, así que lo que falta se multiplica por $r$ en cada capa: después de $n$ capas falta $r^n$ y está pintado $1 - r^n$. $1 - (\\tfrac12)^4 = \\tfrac{15}{16}$, $1 - (\\tfrac13)^3 = \\tfrac{26}{27}$, $1 - (\\tfrac12)^6 = \\tfrac{63}{64}$ y $1 - (\\tfrac14)^3 = \\tfrac{63}{64}$. Nunca se llena: la suma infinita es 1.',
        { hint: 'Fíjate en lo que falta por pintar: ¿qué fracción queda después de cada capa?' }),
      play('ajusta-razon', 'Elige la razón de la suma infinita', { rounds: [
        { a: 6, S: 12 }, { a: 3, S: 12 }, { a: 8, S: 40 }, { a: 5, S: 4 },
      ] }, 'Con $|r| < 1$ la suma infinita es $S = \\tfrac{a}{1 - r}$: $\\tfrac{6}{1 - 0.5} = 12$, $\\tfrac{3}{0.25} = 12$, $\\tfrac{8}{0.2} = 40$ y $\\tfrac{5}{1.25} = 4$ con $r = -0.25$. Con $r = 1$ o más los puntos se escapan: diverge.',
        { hint: 'Despeja: $1 - r = \\tfrac{a}{S}$.' }),
      s14d[2]]);

    const s15 = ['arma-sigma', 'parte-sigma', 'maquina-sigma'].map(g => keep('alg-15', g));
    setLesson('alg-15', [s15[0],
      play('sigma-indices', 'Pon los límites de la sigma', { rounds: [
        { f: '2k', vals: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], lo: 2, hi: 6 },
        { f: 'k^2', vals: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100], lo: 3, hi: 7 },
        { f: '(3k - 1)', vals: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29], lo: 1, hi: 5 },
        { f: '(k + 4)', vals: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14], lo: 4, hi: 9 },
      ] }, 'El índice $k$ va del límite de abajo al de arriba, y cada valor de $k$ da un término: $4 + 6 + \\cdots + 12 = \\sum_{k=2}^{6} 2k$, $9 + 16 + \\cdots + 49 = \\sum_{k=3}^{7} k^2$, $2 + 5 + 8 + 11 + 14 = \\sum_{k=1}^{5}(3k - 1)$ y $8 + \\cdots + 13 = \\sum_{k=4}^{9}(k + 4)$.',
        { hint: 'Busca en la fila qué k da el primer término de la suma y cuál da el último.' }),
      s15[1],
      play('cambia-indice', 'Corre el índice de la sigma', { rounds: [
        { lo: 1, hi: 5, add: 2 }, { lo: 0, hi: 4, add: 3 }, { lo: 2, hi: 6, add: 1 }, { lo: 1, hi: 4, add: 5 },
      ] }, 'Con $j = k + c$ los términos son los mismos y solo cambian los límites: $\\sum_{k=1}^{5}(k + 2) = \\sum_{j=3}^{7} j$, $\\sum_{k=0}^{4}(k + 3) = \\sum_{j=3}^{7} j$, $\\sum_{k=2}^{6}(k + 1) = \\sum_{j=3}^{7} j$ y $\\sum_{k=1}^{4}(k + 5) = \\sum_{j=6}^{9} j$.',
        { hint: 'El primer término de arriba tiene que quedar sobre el primero de abajo.' }),
      play('factorial-cajas', 'El factorial: ¿cuántos objetos en fila?', { rounds: [{ target: 120 }, { target: 24 }, { target: 720 }, { target: 6 }] },
        'Para la primera casilla hay $n$ opciones, para la segunda $n - 1$, y así: $n! = n(n - 1)\\cdots 1$. $5! = 120$, $4! = 24$, $6! = 720$ y $3! = 6$.',
        { hint: 'Multiplica las opciones de cada casilla: cada una tiene una menos que la anterior.' }),
      s15[2]]);

    setExam('progresiones', [
      ['alg-14', 'En una progresión aritmética del primer término al n-ésimo hay $n - 1$ saltos.',
        play('goteo-tanque', 'El tanque que gotea', { rounds: [{ a1: 40, d: -3, target: 16 }] }, '$40 - 3 \\cdot 8 = 16$: la medición 9.', { hint: 'Cuenta horas.' })],
      ['alg-14', 'Entre el primer término y el n-ésimo hay n − 1 saltos.',
        play('poste-cerca', 'Los postes de la cerca', { rounds: [{ L: 42, d: 6 }] }, '7 tramos, 8 postes.', { hint: 'Cuenta los tramos y suma uno.' })],
      ['alg-14b', 'La suma de una progresión aritmética es n por el promedio de los extremos.',
        play('nivela-barras', 'Nivela las barras', { rounds: [{ a1: 4, d: 3, n: 5 }] }, 'Promedio 10: $S = 50$.', { hint: 'Promedia la primera y la última.' })],
      ['alg-14b', '$S_n = \\tfrac{n(a_1 + a_n)}{2}$.',
        play('alcancia-semanas', 'La alcancía', { rounds: [{ a1: 3, d: 3, goal: 45 }] }, '$3 + 6 + 9 + 12 + 15 = 45$.', { hint: 'Suma semana a semana.' })],
      ['alg-14c', '$r^{j - i} = \\tfrac{a_j}{a_i}$.',
        play('razon-terminos', 'Halla la razón', { rounds: [{ i: 1, ai: 2, j: 4, aj: 54 }] }, '$r^3 = 27$: $r = 3$.', { hint: 'Divide y cuenta pasos.' })],
      ['alg-14c', '$a_n = a_1 r^{n - 1}$.',
        play('cultivo-celulas', 'El cultivo', { rounds: [{ a1: 4, r: 3, target: 324 }] }, '$4 \\cdot 3^4 = 324$: generación 5.', { hint: 'Divide entre 4.' })],
      ['alg-14d', '$S_n = \\tfrac{a(r^n - 1)}{r - 1}$.',
        play('torre-geometrica', 'Apila términos', { rounds: [{ a: 4, r: 3, target: 52 }] }, '$4 + 12 + 36 = 52$.', { hint: 'Suma bloque a bloque.' })],
      ['alg-14d', 'Con $|r| < 1$ la suma infinita es $\\tfrac{a}{1 - r}$.',
        play('ajusta-razon', 'Elige la razón', { rounds: [{ a: 9, S: 12 }] }, '$\\tfrac{9}{1 - 0.25} = 12$.', { hint: '$1 - r = a/S$.' })],
      ['alg-15', 'En Σ el índice recorre de un límite a otro.',
        play('sigma-indices', 'Pon los límites', { rounds: [{ f: '3k', vals: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30], lo: 2, hi: 5 }] }, '$6 + 9 + 12 + 15 = \\sum_{k=2}^{5} 3k$.', { hint: '¿Qué k da el 6?' })],
      ['alg-15', '$n! = n(n - 1)\\cdots 1$ cuenta las filas posibles.',
        play('factorial-cajas', 'El factorial', { rounds: [{ target: 5040 }] }, '$7! = 5040$.', { hint: 'Multiplica las opciones.' })],
    ]);
  }
  // ───────── Mundo 6 · Álgebra de Polinomios ─────────
  {
    setLesson('alg-23a', [
      play('bloques-polinomio', 'Arma y suma polinomios con bloques', { rounds: [
        { mode: 'arma', target: [1, -2, 3] }, { mode: 'arma', target: [-2, 1, -1] }, { mode: 'suma', P: [1, 2, -1], Q: [1, -3, 2] }, { mode: 'suma', P: [2, 0, 3], Q: [-1, 1, -3] },
      ] }, 'Cada término es un tipo de bloque: los cuadrados son $x^2$, las barras $x$ y los cuadritos 1; el signo menos es el color rojo. Para sumar se juntan bloques del mismo tipo y un bloque con su opuesto se anula: $(x^2 + 2x - 1) + (x^2 - 3x + 2) = 2x^2 - x + 1$.',
        { hint: 'Cuenta cuántos bloques de cada tipo pide el polinomio y de qué color. Al sumar, las barras rojas se comen las azules.' }),
      play('reduce-semejantes', 'Reduce: anula los bloques opuestos', { rounds: [
        { tiles: [[2, 0], [1, 0], [1, 1], [0, 0], [1, 0], [0, 1], [0, 1]] },
        { tiles: [[2, 0], [2, 1], [2, 0], [1, 1], [1, 1], [0, 0], [0, 0], [0, 1]] },
        { tiles: [[1, 0], [1, 0], [1, 1], [1, 1], [1, 1], [0, 1], [0, 0]] },
      ] }, 'Solo se anulan piezas iguales de signo contrario: una barra con una barra roja, un cuadrito con uno rojo. Un cuadrado y una barra no son semejantes. Quedan $x^2 + x - 1$, $x^2 - 2x + 1$ y $-x$.',
        { hint: 'Busca parejas del mismo tipo y distinto color. Lo que queda sin pareja es el resultado.' }),
      play('resta-voltea', 'Resta polinomios volteando los bloques', { rounds: [
        { P: [1, 3, 2], Q: [0, 1, 4] }, { P: [2, -1, 0], Q: [1, -2, 3] }, { P: [0, 2, 5], Q: [1, 2, -1] },
      ] }, 'Restar Q es sumar su opuesto: se voltean todos sus bloques. $(x^2 + 3x + 2) - (x + 4) = x^2 + 2x - 2$; $(2x^2 - x) - (x^2 - 2x + 3) = x^2 + x - 3$; $(2x + 5) - (x^2 + 2x - 1) = -x^2 + 6$.',
        { hint: 'Antes de llevar un bloque de Q a la mesa, pásalo por el volteador: restar es sumar el opuesto.' }),
      play('evalua-polinomio', 'Evalúa el polinomio con bloques', { rounds: [
        { c: [1, -2, 3], target: 11 }, { c: [2, 1, -1], target: 14 }, { c: [-1, 0, 10], target: 1 }, { c: [1, 3, 0], target: -2 },
      ] }, 'Evaluar es poner el número en lugar de $x$, con paréntesis: $4^2 - 2\\cdot4 + 3 = 11$ (también sirve $x = -2$). $2(-3)^2 + (-3) - 1 = 14$. $-3^2$ no es lo mismo que $-(3)^2$… y aquí $-(\\pm3)^2 + 10 = 1$. $(-1)^2 + 3(-1) = -2$.',
        { hint: 'Mueve x y mira cómo cambia cada término. El cuadrado de un negativo es positivo.' }),
      play('llena-rectangulo', 'Multiplica llenando el rectángulo', { rounds: [{ a: 2, b: 3 }, { a: 3, b: 4 }, { a: 2, b: 5 }, { a: 1, b: 3 }] },
        'Multiplicar es llenar el rectángulo de lados $(x + a)$ y $(x + b)$: un cuadrado $x^2$, $a + b$ barras y $a\\cdot b$ cuadritos. $(x + 2)(x + 3) = x^2 + 5x + 6$; $(x + 3)(x + 4) = x^2 + 7x + 12$; $(x + 2)(x + 5) = x^2 + 7x + 10$; $(x + 1)(x + 3) = x^2 + 4x + 3$.',
        { hint: 'Mira el marco: la esquina grande es x por x, las franjas son x por 1 y la esquina chica es a por b.' }),
      keep('alg-23a', 'torre-grados')]);

    setLesson('alg-3', [keep('alg-3', 'bloques-area'),
      play('parte-cuadrado', 'El cuadrado de un binomio, de cabeza', { rounds: [{ N: 23 }, { N: 41 }, { N: 58 }, { N: 72 }] },
        '$(a + b)^2 = a^2 + 2ab + b^2$: el cuadrado se parte en $a^2$, dos rectángulos $ab$ y $b^2$. Con un corte en la decena se calcula de cabeza: $23^2 = 400 + 120 + 9 = 529$, $41^2 = 1600 + 80 + 1 = 1681$, $58^2 = 2500 + 800 + 64 = 3364$, $72^2 = 4900 + 280 + 4 = 5184$.',
        { hint: 'Corta el lado en la decena: los cuadrados y el rectángulo de la decena son fáciles de calcular.' }),
      play('diferencia-cuadrados', 'Suma por diferencia: mueve la esquina', { rounds: [{ p: 32, q: 28 }, { p: 43, q: 37 }, { p: 55, q: 45 }, { p: 26, q: 14 }] },
        '$(a + b)(a - b) = a^2 - b^2$: $a$ es el punto medio y $b$ la distancia a él. $32 \\cdot 28 = 30^2 - 2^2 = 896$; $43 \\cdot 37 = 40^2 - 3^2 = 1591$; $55 \\cdot 45 = 50^2 - 5^2 = 2475$; $26 \\cdot 14 = 20^2 - 6^2 = 364$.',
        { hint: 'a queda justo en la mitad de los dos factores y b es cuánto se aleja cada uno de esa mitad.' }),
      play('binomios-comun', 'Dos binomios con x: suma y producto', { rounds: [{ s: 7, p: 10 }, { s: 9, p: 20 }, { s: 6, p: 5 }, { s: 10, p: 21 }] },
        'En $(x + a)(x + b)$ las barras son $a + b$ y los cuadritos $a\\cdot b$: $x^2 + 7x + 10 = (x + 2)(x + 5)$, $x^2 + 9x + 20 = (x + 4)(x + 5)$, $x^2 + 6x + 5 = (x + 1)(x + 5)$, $x^2 + 10x + 21 = (x + 3)(x + 7)$.',
        { hint: 'Busca dos números que multiplicados den los cuadritos y sumados den las barras.' }),
      play('marco-cuadro', 'El marco del cuadro', { rounds: [{ w: 1, area: 44 }, { w: 2, area: 64 }, { w: 3, area: 84 }, { w: 1, area: 20 }] },
        'El marco es el cuadrado grande menos el cuadro: $(x + 2w)^2 - x^2 = 4wx + 4w^2$. Con $w = 1$: $4x + 4 = 44$, $x = 10$. Con $w = 2$: $8x + 16 = 64$, $x = 6$. Con $w = 3$: $12x + 36 = 84$, $x = 4$. Y $4x + 4 = 20$ da $x = 4$.',
        { hint: 'Desarrolla el cuadrado grande: los $x^2$ se cancelan y queda algo que crece de a poco con x.' }),
      keep('alg-3', 'arma-la-mesa')]);

    setLesson('alg-24c', [
      play('triangulo-pascal', 'Completa la fila del triángulo de Pascal', { rounds: [{ n: 3, extra: [2, 4] }, { n: 5, extra: [6, 8] }, { n: 6, extra: [12, 18] }] },
        'Cada número es la suma de los dos de arriba: la fila 3 es $1, 3, 3, 1$; la 5, $1, 5, 10, 10, 5, 1$; la 6, $1, 6, 15, 20, 15, 6, 1$. Son los coeficientes de $(a + b)^n$.',
        { hint: 'Para cada casilla vacía suma los dos números que tiene justo encima.' }),
      play('elige-parentesis', '¿De cuántas maneras sale el término?', { rounds: [{ n: 3, k: 2 }, { n: 4, k: 1 }, { n: 5, k: 2 }] },
        'Cada término sale de elegir a o b en cada paréntesis. $a b^2$ en $(a + b)^3$ sale de 3 maneras (bba, bab, abb); $a^3b$ en $(a + b)^4$, de 4; $a^3b^2$ en $(a + b)^5$, de 10. Ese número es el coeficiente: $\\binom{n}{k}$.',
        { hint: 'Cambia una ficha a la vez de paréntesis para no repetir maneras. Piensa en qué paréntesis van las b.' }),
      play('exponentes-binomio', 'Busca el término con la potencia pedida', { rounds: [{ n: 5, c: 2, p: 3 }, { n: 6, c: 1, p: 4 }, { n: 4, c: 3, p: 1 }, { n: 7, c: 1, p: 2 }] },
        'En $(x + c)^n$ el término $k$ es $\\binom{n}{k} x^{n - k} c^k$: los exponentes de $x$ bajan y los de $c$ suben. $10 \\cdot 2^2 x^3 = 40x^3$; $15x^4$; $4 \\cdot 27x = 108x$; $21x^2$.',
        { hint: 'El exponente de x más el del número siempre suman n.' }),
      play('fila-potencia', 'Cada fila suma una potencia de 2', { rounds: [{ total: 32 }, { total: 8 }, { total: 128 }, { total: 1 }] },
        'La fila $n$ cuenta todas las maneras de elegir a o b en $n$ paréntesis, que son $2^n$: $2^5 = 32$, $2^3 = 8$, $2^7 = 128$ y la fila 0, que es solo un 1, suma $2^0 = 1$.',
        { hint: 'Mira cuánto suma cada fila al pasar a la siguiente: se duplica.' }),
      play('once-potencias', 'Las potencias de 11 y Pascal', { rounds: [{ value: 1331 }, { value: 121 }, { value: 14641 }, { value: 161051 }] },
        '$11^n = (10 + 1)^n$ y sus cifras son la fila $n$ de Pascal: $11^2 = 121$, $11^3 = 1331$, $11^4 = 14641$. En la fila 5 hay un 10, que se lleva: $1, 5, 10, 10, 5, 1$ da $161051 = 11^5$.',
        { hint: 'Compara las cifras del número con las filas del triángulo.' }),
      keep('alg-24c', 'camino-pascal')]);

    setLesson('alg-24b', [
      play('factor-comun-bloques', 'Factor común: reparte en filas iguales', { rounds: [{ p: 6, q: 9 }, { p: 4, q: 10 }, { p: 12, q: 18 }, { p: 5, q: 15 }] },
        'Sacar factor común es acomodar los bloques en filas iguales: $6x + 9 = 3(2x + 3)$, $4x + 10 = 2(2x + 5)$, $12x + 18 = 6(2x + 3)$, $5x + 15 = 5(x + 3)$. El mayor número de filas que reparte justo es el máximo común divisor.',
        { hint: 'Busca el número más grande que divide tanto a las barras como a los cuadritos.' }),
      play('diferencia-esquina', 'Diferencia de cuadrados: quita una esquina', { rounds: [{ c: 9 }, { c: 25 }, { c: 36 }, { c: 4 }] },
        'Si $c = b^2$, se quita una esquina de $b$ por $b$ y la tira se pasa abajo: $x^2 - 9 = (x + 3)(x - 3)$, $x^2 - 25 = (x + 5)(x - 5)$, $x^2 - 36 = (x + 6)(x - 6)$, $x^2 - 4 = (x + 2)(x - 2)$.',
        { hint: '¿Qué número al cuadrado da lo que se resta?' }),
      play('suma-producto', 'Factoriza con suma y producto', { rounds: [{ s: -1, p: -12 }, { s: 7, p: 12 }, { s: -8, p: 15 }, { s: 2, p: -15 }] },
        '$x^2 + sx + p = (x + m)(x + n)$ con $m + n = s$ y $mn = p$: $x^2 - x - 12 = (x - 4)(x + 3)$, $x^2 + 7x + 12 = (x + 3)(x + 4)$, $x^2 - 8x + 15 = (x - 3)(x - 5)$, $x^2 + 2x - 15 = (x + 5)(x - 3)$.',
        { hint: 'Si el producto es negativo, un número es positivo y el otro negativo; si es positivo, tienen el mismo signo que la suma.' }),
      play('agrupa-terminos', 'Factoriza agrupando de a dos', { rounds: [
        { terms: ['x^3', '2x^2', '3x', '6'], groups: { '0,1': ['x^2', 'x + 2'], '2,3': ['3', 'x + 2'], '0,2': ['x', 'x^2 + 3'], '1,3': ['2', 'x^2 + 3'] }, goods: [['0,1', '2,3'], ['0,2', '1,3']], result: '(x + 2)(x^2 + 3)' },
        { terms: ['ax', 'ay', 'bx', 'by'], groups: { '0,1': ['a', 'x + y'], '2,3': ['b', 'x + y'], '0,2': ['x', 'a + b'], '1,3': ['y', 'a + b'] }, goods: [['0,1', '2,3'], ['0,2', '1,3']], result: '(a + b)(x + y)' },
        { terms: ['2x^2', '6x', '5x', '15'], groups: { '0,1': ['2x', 'x + 3'], '2,3': ['5', 'x + 3'], '0,2': ['x', '2x + 5'], '1,3': ['3', '2x + 5'] }, goods: [['0,1', '2,3'], ['0,2', '1,3']], result: '(x + 3)(2x + 5)' },
      ] }, 'Se agrupan de a dos para que cada grupo tenga un factor común y deje el mismo paréntesis: $x^2(x + 2) + 3(x + 2) = (x + 2)(x^2 + 3)$. Otra agrupación puede servir igual; otras no dejan el mismo paréntesis.',
        { hint: 'En cada caja saca el factor común. Si los dos paréntesis salen iguales, ya está.' }),
      keep('alg-24b', 'completa-cuadrado'), keep('alg-24b', 'reparte-barras')]);

    setExam('polinomios', [
      ['alg-23a', 'Un polinomio se arma con bloques de cada grado; el signo menos es el color contrario.',
        play('bloques-polinomio', 'Arma el polinomio', { rounds: [{ mode: 'arma', target: [2, -3, 1] }] }, '$2x^2 - 3x + 1$: dos cuadrados, tres barras rojas y un cuadrito.', { hint: 'Cuenta los bloques de cada tipo y su color.' })],
      ['alg-23a', 'Restar un polinomio es sumar su opuesto.',
        play('resta-voltea', 'Resta volteando', { rounds: [{ P: [1, 0, 4], Q: [1, -2, 1] }] }, '$(x^2 + 4) - (x^2 - 2x + 1) = 2x + 3$.', { hint: 'Voltea todo Q antes de sumarlo.' })],
      ['alg-3', '$(x + a)(x + b) = x^2 + (a + b)x + ab$.',
        play('binomios-comun', 'Dos binomios con x', { rounds: [{ s: 8, p: 15 }] }, '$(x + 3)(x + 5)$.', { hint: 'Suma 8 y producto 15.' })],
      ['alg-3', '$(a + b)(a - b) = a^2 - b^2$.',
        play('diferencia-cuadrados', 'Mueve la esquina', { rounds: [{ p: 62, q: 58 }] }, '$62 \\cdot 58 = 60^2 - 2^2 = 3596$.', { hint: 'a está en la mitad.' })],
      ['alg-24c', 'El término $k$ de $(x + c)^n$ es $\\binom{n}{k}x^{n - k}c^k$.',
        play('exponentes-binomio', 'Busca el término', { rounds: [{ n: 6, c: 2, p: 4 }] }, '$\\binom62 x^4 \\cdot 2^2 = 60x^4$.', { hint: 'Los exponentes suman 6.' })],
      ['alg-24c', 'Cada número del triángulo de Pascal suma los dos de arriba.',
        play('triangulo-pascal', 'Completa la fila', { rounds: [{ n: 7, extra: [14, 28] }] }, 'Fila 7: $1, 7, 21, 35, 35, 21, 7, 1$.', { hint: 'Suma los dos de arriba.' })],
      ['alg-24b', 'Factorizar un trinomio es buscar dos números con esa suma y ese producto.',
        play('suma-producto', 'Factoriza', { rounds: [{ s: 2, p: -8 }] }, '$x^2 + 2x - 8 = (x + 4)(x - 2)$.', { hint: 'Producto negativo: signos distintos.' })],
      ['alg-24b', '$x^2 - b^2 = (x + b)(x - b)$.',
        play('diferencia-esquina', 'Quita una esquina', { rounds: [{ c: 49 }] }, '$x^2 - 49 = (x + 7)(x - 7)$.', { hint: '¿Qué número al cuadrado da 49?' })],
    ]);
  }
  // ───────── Mundo 7 · Parábolas y Complejos ─────────
  {
    setLesson('alg-23c', [
      play('plano-complejo', 'Ubica cada complejo en su plano', { rounds: [{ a: -1, b: 4 }, { a: 3, b: -2 }, { a: -2, b: -3 }, { a: 0, b: 4 }] },
        'El complejo $a + bi$ es el punto que está $a$ a lo ancho y $b$ a lo alto: $-1 + 4i$ va a la izquierda y arriba; $3 - 2i$, a la derecha y abajo. $4i$ no tiene parte real: vive en el eje vertical.',
        { hint: 'La parte real se mide a lo ancho (eje horizontal) y la imaginaria a lo alto.' }),
      play('vueltas-i', 'Las potencias de i dan cuartos de vuelta', { rounds: [{ n: 7 }, { n: 10 }, { n: 16 }, { n: 11 }] },
        'Multiplicar por $i$ es un cuarto de vuelta y cuatro cuartos vuelven al 1, así que solo importa el residuo de dividir entre 4: $i^7 = i^3 = -i$, $i^{10} = i^2 = -1$, $i^{16} = 1$, $i^{11} = -i$.',
        { hint: 'Quita todas las vueltas completas (de 4 en 4) y mira cuántos cuartos sobran.' }),
      play('suma-complejos', 'Suma complejos flecha tras flecha', { rounds: [
        { z1: [2, 1], target: [5, -1] }, { z1: [-3, 2], target: [1, 4] }, { z1: [1, -4], target: [-2, -1] },
      ] }, 'Se suma real con real e imaginaria con imaginaria: $z_2 = \\text{meta} - z_1$. $(5 - i) - (2 + i) = 3 - 2i$; $(1 + 4i) - (-3 + 2i) = 4 + 2i$; $(-2 - i) - (1 - 4i) = -3 + 3i$.',
        { hint: 'Cuenta cuánto le falta a la punta de z₁ para llegar a la estrella, a lo ancho y a lo alto.' }),
      play('conjugado-espejo', 'El conjugado es el reflejo en el eje real', { rounds: [{ a: 2, b: 5 }, { a: -3, b: 1 }, { a: 4, b: -2 }] },
        'El conjugado cambia el signo de la parte imaginaria: es el reflejo en el eje real. Y $z \\cdot \\bar z = a^2 + b^2$ siempre es real: $(2 + 5i)(2 - 5i) = 29$, $(-3 + i)(-3 - i) = 10$, $(4 - 2i)(4 + 2i) = 20$.',
        { hint: 'La parte real no cambia; la imaginaria queda igual de lejos del eje, del otro lado.' }),
      play('modulo-circulo', 'El módulo es la distancia al origen', { rounds: [{ a: 6, b: 8 }, { a: 5, b: 12 }, { a: -8, b: 6 }, { a: 0, b: -7 }] },
        '$|a + bi| = \\sqrt{a^2 + b^2}$, por Pitágoras con catetos $|a|$ y $|b|$: $|6 + 8i| = 10$, $|5 + 12i| = 13$, $|-8 + 6i| = 10$, $|-7i| = 7$.',
        { hint: 'Arma el triángulo con la parte real y la imaginaria como catetos: el módulo es la hipotenusa.' }),
      keep('alg-23c', 'gira-complejos')]);

    setLesson('alg-1', [
      play('despeja-x', 'Despeja x aplicando lo mismo a los dos lados', { rounds: [
        { a: 4, b: -5, c: 23, cards: [['+', 5], ['+', -5], ['×', 0.25], ['×', 4]] },
        { a: 3, b: 7, c: -2, cards: [['+', -7], ['+', 7], ['×', 1 / 3], ['×', 3]] },
        { a: 5, div: true, b: 2, c: 6, cards: [['+', -2], ['+', 2], ['×', 5], ['×', 0.2]] },
        { a: -2, b: 3, c: 11, cards: [['+', -3], ['×', -0.5], ['×', 0.5], ['+', 3]] },
      ] }, 'Se deshace primero lo que se sumó y luego lo que multiplica, con la misma operación a los dos lados: $4x - 5 = 23 \\Rightarrow 4x = 28 \\Rightarrow x = 7$; $3x = -9$, $x = -3$; $\\tfrac{x}{5} = 4$, $x = 20$; $-2x = 8$, $x = -4$.',
        { hint: 'Primero quita el número que se suma o resta; después lo que multiplica a x, multiplicando por su recíproco.' }),
      play('encuentro-caminantes', '¿Cuándo se encuentran?', { rounds: [
        { A: [60, 0], B: [40, 300], max: 20 }, { A: [80, 100], B: [50, 400], max: 14 }, { A: [90, 0], B: [60, 240], max: 12 },
      ] }, 'Se encuentran cuando sus posiciones son iguales: $60t = 40t + 300$ da $20t = 300$, $t = 15$; $80t + 100 = 50t + 400$ da $t = 10$; $90t = 60t + 240$ da $t = 8$.',
        { hint: 'El de atrás descuenta cada minuto la diferencia de velocidades. ¿Cuántos minutos tarda en descontar la ventaja?' }),
      play('consecutivos', 'Números seguidos que suman', { rounds: [{ k: 3, d: 1, S: 72 }, { k: 4, d: 1, S: 90 }, { k: 3, d: 2, S: 51 }, { k: 5, d: 1, S: 115 }] },
        'Si el primero es $x$, los siguientes son $x + 1$, $x + 2$…: $3x + 3 = 72$ da $x = 23$; $4x + 6 = 90$ da $x = 21$; de dos en dos, $3x + 6 = 51$ da $x = 15$; $5x + 10 = 115$ da $x = 21$.',
        { hint: 'Escribe todos con x: el primero es x y cada uno suma lo mismo al anterior. Junta las x y los números.' }),
      play('sin-o-infinitas', 'Ninguna o infinitas soluciones', { rounds: [
        { a: 2, b: 3, c: 2, want: 'infinitas' }, { a: 3, b: -1, c: 3, want: 'ninguna' }, { a: -2, b: 5, c: -2, want: 'infinitas' }, { a: 4, b: 0, c: 4, want: 'ninguna' },
      ] }, 'Con la misma $x$ a los dos lados, al restar se va la $x$. Si quedan iguales ($0 = 0$) toda $x$ sirve: las rectas son la misma. Si quedan distintas ($3 = 5$) ninguna sirve: las rectas son paralelas.',
        { hint: 'Resta lo mismo a los dos lados: ¿queda una igualdad cierta o una falsa?' }),
      play('perimetro-x', 'El rectángulo de perímetro dado', { rounds: [{ m: 3, P: 26 }, { k: 2, P: 36 }, { m: 5, P: 50 }, { k: 3, P: 48 }] },
        'El perímetro es dos veces ancho más largo: $2(x + x + 3) = 26$ da $4x + 6 = 26$, $x = 5$; $2(x + 2x) = 36$ da $x = 6$; $2(2x + 5) = 50$ da $x = 10$; $2(x + 3x) = 48$ da $x = 6$.',
        { hint: 'Escribe el largo con x y suma los cuatro lados.' }),
      keep('alg-1', 'balanza-cajas')]);

    setLesson('alg-4a', [keep('alg-4a', 'mueve-parabola'),
      play('simetria-parabola', 'Encuentra el eje de simetría', { rounds: [
        { a: 1, h: 2, k: -3, x1: -1 }, { a: -1, h: -1, k: 4, x1: 1 }, { a: 0.5, h: 0.5, k: -2, x1: 3 }, { a: 2, h: -2, k: 1, x1: -3 },
      ] }, 'Dos puntos de la parábola a la misma altura están a igual distancia del eje: el eje pasa por el punto medio. Entre $-1$ y $5$ el medio es 2; entre 1 y $-3$, $-1$; entre 3 y $-2$, $0.5$; entre $-3$ y $-1$, $-2$.',
        { hint: 'Suma las dos x y divide entre 2.' }),
      play('abertura-a', 'Ajusta la abertura de la parábola', { rounds: [
        { h: 1, k: -2, pt: [3, 6] }, { h: -2, k: 5, pt: [0, 1] }, { h: 0, k: -4, pt: [4, 0] }, { h: 2, k: 3, pt: [4, 1] },
      ] }, 'Con el vértice fijo, $a$ se halla con un punto: $a \\cdot 2^2 - 2 = 6$ da $a = 2$; $a \\cdot 2^2 + 5 = 1$ da $a = -1$; $16a - 4 = 0$ da $a = \\tfrac14$; $4a + 3 = 1$ da $a = -\\tfrac12$.',
        { hint: 'Si el punto está más abajo que el vértice, a es negativo. Cuenta cuánto sube o baja desde el vértice y a qué distancia horizontal.' }),
      play('forma-canonica', 'Pasa a la forma canónica', { rounds: [{ b: -4, c: 1 }, { b: 6, c: 5 }, { b: 2, c: -3 }, { b: -6, c: 8 }] },
        'Se completa el cuadrado: $x^2 - 4x + 1 = (x - 2)^2 - 3$, $x^2 + 6x + 5 = (x + 3)^2 - 4$, $x^2 + 2x - 3 = (x + 1)^2 - 4$, $x^2 - 6x + 8 = (x - 3)^2 - 1$. El vértice queda a la vista: $h = -\\tfrac{b}{2}$.',
        { hint: 'h es la mitad del número que acompaña a x, con el signo cambiado. Para k, mira qué le falta o le sobra al cuadrado.' }),
      play('ingreso-maximo', 'El precio del mayor ingreso', { rounds: [{ base: 40, drop: 2 }, { base: 60, drop: 3 }, { base: 30, drop: 1 }, { base: 48, drop: 4 }] },
        'El ingreso es precio por ventas, $I = p(b - dp)$: una parábola que abre hacia abajo con ceros en $0$ y en $\\tfrac{b}{d}$. Su vértice está en la mitad: $p = 10$ (ingreso 200), $p = 10$ (300), $p = 15$ (225) y $p = 6$ (144). Subir más el precio hace vender tan poco que el ingreso baja.',
        { hint: 'El ingreso vale cero si el precio es 0 y también si ya no se vende nada. El mejor precio está a medio camino.' }),
      keep('alg-4a', 'apunta-chorro')]);

    setLesson('alg-4', [keep('alg-4', 'raices-imanes'),
      play('producto-cero', 'Si un producto es cero, algún factor es cero', { rounds: [{ p: 3, q: -2 }, { p: -4, q: -1 }, { p: 5, q: 0 }, { p: 2, q: 2 }] },
        'Un producto vale cero solo si algún factor vale cero: $(x - 3)(x + 2) = 0$ da $x = 3$ o $x = -2$. Si un factor es $x$ solo, una raíz es 0. Y $(x - 2)^2 = 0$ tiene una raíz doble: $x = 2$ dos veces.',
        { hint: 'Busca para qué x cada paréntesis vale cero: el signo dentro del paréntesis es el contrario de la raíz.' }),
      play('discriminante-traslada', '¿Cuántas veces corta el eje?', { rounds: [{ b: 4, want: 1 }, { b: -6, want: 0 }, { b: 2, want: 2 }, { b: -4, want: 1 }] },
        'Subir la parábola cambia $\\Delta = b^2 - 4c$: si es positivo hay dos cortes, si es cero toca una vez y si es negativo no corta. Con $b = 4$, toca cuando $c = 4$; con $b = -6$, no corta si $c > 9$; con $b = 2$, corta dos veces si $c < 1$.',
        { hint: 'Calcula para qué c el discriminante vale cero; arriba de eso no corta y abajo corta dos veces.' }),
      play('raices-simetricas', 'Las raíces a los dos lados del eje', { rounds: [{ a: 1, b: -2, c: -8 }, { a: 1, b: 4, c: -5 }, { a: 2, b: -4, c: -6 }, { a: -1, b: 2, c: 3 }] },
        'La fórmula general es $x = h \\pm d$ con $h = -\\tfrac{b}{2a}$ y $d = \\tfrac{\\sqrt{\\Delta}}{2|a|}$: $1 \\pm 3$; $-2 \\pm 3$; $1 \\pm \\tfrac{\\sqrt{64}}{4} = 1 \\pm 2$; $1 \\pm \\tfrac{\\sqrt{16}}{2} = 1 \\pm 2$.',
        { hint: 'Las dos raíces están a la misma distancia del eje. Calcula el discriminante y divide su raíz entre 2a.' }),
      play('area-ecuacion', 'El terreno de área dada', { rounds: [{ m: 3, area: 40 }, { m: 2, area: 63 }, { m: 5, area: 84 }, { m: 4, area: 96 }] },
        '$x(x + 3) = 40$ es $x^2 + 3x - 40 = 0 = (x + 8)(x - 5)$: sirve $x = 5$; la raíz $-8$ no es una medida. Igual $x = 7$ ($7\\cdot9 = 63$), $x = 7$ ($7 \\cdot 12 = 84$) y $x = 8$ ($8 \\cdot 12 = 96$).',
        { hint: 'Prueba anchos y multiplica por el largo; o factoriza la ecuación y quédate con la raíz positiva.' }),
      keep('alg-4', 'donde-cae')]);

    setExam('cuadraticas', [
      ['alg-23c', 'Los complejos se suman parte por parte: es poner una flecha después de la otra.',
        play('suma-complejos', 'Suma complejos', { rounds: [{ z1: [-1, 3], target: [2, 1] }] }, '$z_2 = 3 - 2i$.', { hint: 'Meta menos z₁.' })],
      ['alg-23c', '$|a + bi| = \\sqrt{a^2 + b^2}$.',
        play('modulo-circulo', 'El módulo', { rounds: [{ a: 9, b: 12 }] }, '$\\sqrt{81 + 144} = 15$.', { hint: 'Catetos 9 y 12.' })],
      ['alg-1', 'Para despejar se aplica la misma operación a los dos lados.',
        play('despeja-x', 'Despeja x', { rounds: [{ a: 6, b: -4, c: 20, cards: [['+', 4], ['+', -4], ['×', 1 / 6], ['×', 6]] }] }, '$6x = 24$, $x = 4$.', { hint: 'Primero el −4.' })],
      ['alg-1', 'Plantear es escribir lo desconocido con una letra.',
        play('consecutivos', 'Números seguidos', { rounds: [{ k: 3, d: 1, S: 48 }] }, '$3x + 3 = 48$: 15, 16 y 17.', { hint: 'x, x + 1 y x + 2.' })],
      ['alg-4a', 'Completar el cuadrado deja el vértice a la vista.',
        play('forma-canonica', 'Forma canónica', { rounds: [{ b: -8, c: 10 }] }, '$(x - 4)^2 - 6$.', { hint: 'h es la mitad de −8 cambiada de signo.' })],
      ['alg-4a', 'El eje de la parábola pasa por el punto medio de dos puntos a la misma altura.',
        play('simetria-parabola', 'El eje de simetría', { rounds: [{ a: 1, h: -3, k: -5, x1: 0 }] }, 'Entre 0 y −6: $x = -3$.', { hint: 'Promedia las x.' })],
      ['alg-4', 'Si un producto vale cero, algún factor vale cero.',
        play('producto-cero', 'Producto cero', { rounds: [{ p: -3, q: 6 }] }, '$x = -3$ o $x = 6$.', { hint: 'Cada paréntesis por separado.' })],
      ['alg-4', 'El discriminante cuenta los cortes con el eje.',
        play('discriminante-traslada', '¿Cuántos cortes?', { rounds: [{ b: -2, want: 1 }] }, 'Toca una vez con $c = 1$.', { hint: '$\\Delta = 0$.' })],
    ]);
  }
  // ───────── Mundo 8 · Raíces de Polinomios ─────────
  {
    setLesson('alg-23b', [
      play('bolsas-residuo', 'Empaca y mira lo que sobra', { rounds: [{ N: 53, d: 6 }, { N: 40, d: 7 }, { N: 62, d: 9 }, { N: 35, d: 5 }] },
        'Dividir es empacar: $53 = 6 \\cdot 8 + 5$, $40 = 7 \\cdot 5 + 5$, $62 = 9 \\cdot 6 + 8$ y $35 = 5 \\cdot 7 + 0$. El residuo siempre es menor que el divisor; si alcanza para otra bolsa, se empaca. Con polinomios pasa igual: el residuo tiene grado menor que el divisor.',
        { hint: 'Llena bolsas mientras alcance para una completa. Lo que queda suelto, si es menos que una bolsa, es el residuo.' }),
      play('grado-cociente', 'Los grados en la división', { rounds: [{ n: 5, m: 2 }, { n: 4, m: 1 }, { n: 3, m: 1 }, { n: 6, m: 4 }] },
        'Si $P = D \\cdot Q + R$, al multiplicar $D \\cdot Q$ se suman los grados: el grado de $Q$ es el de $P$ menos el de $D$. Grado 5 entre grado 2 da cociente de grado 3; 4 entre 1, grado 3; 3 entre 1, grado 2; 6 entre 4, grado 2.',
        { hint: 'Al multiplicar dos polinomios, el término de mayor grado sale de multiplicar los dos de mayor grado: los exponentes se suman.' }),
      play('lado-faltante', 'Divide buscando el lado que falta', { rounds: [{ a: 2, s: 7, p: 13 }, { a: 3, s: 5, p: 6 }, { a: 1, s: 6, p: 8 }, { a: 4, s: 7, p: 15 }] },
        'Dividir entre $x + a$ es armar un rectángulo con ese lado: el otro lado es el cociente y lo que no cabe, el residuo. $x^2 + 7x + 13 = (x + 2)(x + 5) + 3$; $x^2 + 5x + 6 = (x + 3)(x + 2)$, exacta; $x^2 + 6x + 8 = (x + 1)(x + 5) + 3$; $x^2 + 7x + 15 = (x + 4)(x + 3) + 3$.',
        { hint: 'Las barras deben cuadrar: a + b tiene que ser el número de barras. Después mira cuántos cuadritos sobran.' }),
      play('completa-identidad', 'La prueba de la división', { rounds: [
        { P: [1, 5, 9], d: 2, Q: [1, 3] }, { P: [1, 1, -4], d: -3, Q: [1, 4] }, { P: [2, 7, 10], d: 1, Q: [2, 5] }, { P: [1, -6, 7], d: -2, Q: [1, -4] },
      ] }, 'Dividendo = divisor · cociente + residuo: $(x + 2)(x + 3) = x^2 + 5x + 6$, así que el residuo es $9 - 6 = 3$. Igual: $8$, $5$ y $-1$.',
        { hint: 'Multiplica el divisor por el cociente y compara con el dividendo: lo que le falta es el residuo.' }),
      play('iguala-coeficientes', 'Polinomios iguales, coeficientes iguales', { rounds: [
        { c: 2, P: [1, -3, -4, 12] }, { c: -1, P: [1, 4, 5, 2] }, { c: 3, P: [1, -1, -5, -3] }, { c: -2, P: [1, 2, -3, -6] },
      ] }, 'Dos polinomios son iguales si tienen los mismos coeficientes. Al desarrollar $(x - c)(x^2 + ax + b)$ sale $x^3 + (a - c)x^2 + (b - ca)x - cb$: se iguala término a término. $(x - 2)(x^2 - x - 6)$, $(x + 1)(x^2 + 3x + 2)$, $(x - 3)(x^2 + 2x + 1)$, $(x + 2)(x^2 - 3)$.',
        { hint: 'Empieza por el coeficiente de x²: solo depende de a. Luego busca b con el de x.' }),
      keep('alg-23b', 'empaca-filas')]);

    setLesson('alg-92', [keep('alg-92', 'division-sintetica'),
      play('signo-divisor', 'El residuo es P(c): ojo con el signo', { rounds: [
        { P: [1, 0, -3, 2], c: -2 }, { P: [2, -1, 0, 5], c: 1 }, { P: [1, 2, -5], c: 3 }, { P: [1, 0, 1], c: -3 },
      ] }, 'Al dividir entre $x - c$ el residuo es $P(c)$, y $x + 2$ es $x - (-2)$: se evalúa en $-2$. $P(-2) = -8 + 6 + 2 = 0$ (división exacta); $P(1) = 6$; $P(3) = 10$; $P(-3) = 10$.',
        { hint: 'El número que va en lugar de x es el que anula el divisor: si el divisor es x + 3, es −3.' }),
      play('llena-sintetica', 'Completa la división sintética', { rounds: [
        { coef: [1, -4, 1, 6], c: 3, extra: [2, -6] }, { coef: [2, 3, -5, 1], c: -2, extra: [4, 5] }, { coef: [1, 0, -7, 6], c: 2, extra: [-1, 5] },
      ] }, 'Se baja el primer coeficiente; luego se multiplica por $c$ y se suma en la columna siguiente. Entre $x - 3$: $1, -1, -2, 0$ (exacta). Entre $x + 2$: $2, -1, -3, 7$ (residuo 7). Entre $x - 2$: $1, 2, -3, 0$.',
        { hint: 'Cada número de abajo es el de arriba más c por el de abajo de la columna anterior.' }),
      play('factor-k', 'Ajusta k para que haya un factor', { rounds: [
        { P: [1, null, -4, 4], c: 2 }, { P: [1, 3, null, 6], c: -1 }, { P: [1, null, -6], c: 2 },
      ] }, 'Por el teorema del factor, $x - c$ es factor si $P(c) = 0$: $8 + 4k - 8 + 4 = 0$ da $k = -1$; $-1 + 3 - k + 6 = 0$ da $k = 8$; $4 + 2k - 6 = 0$ da $k = 1$.',
        { hint: 'Evalúa el polinomio en c con k como letra e iguala a cero.' }),
      play('arma-factores', 'De los ceros a los factores', { rounds: [
        { roots: [-2, 1, 3], chips: [-3, -2, -1, 1, 2, 3] }, { roots: [0, 4], chips: [-4, 0, 2, 4] }, { roots: [-3, -1, 2], chips: [-3, -2, -1, 1, 2, 3] },
      ] }, 'Si $c$ es un cero, $x - c$ es un factor: el número dentro del factor tiene el signo contrario al cero. Ceros $-2, 1, 3$: $(x + 2)(x - 1)(x - 3)$. Un cero en 0 da el factor $x$.',
        { hint: 'En cada casilla pon el número que hace cero ese paréntesis: es el cero de la gráfica.' }),
      keep('alg-92', 'sondea-niebla')]);

    setLesson('alg-93', [
      play('tramo-signo', 'El signo del polinomio en cada tramo', { rounds: [
        { zeros: [-2, 3], want: -1 }, { zeros: [-1, 1, 4], want: 1 }, { zeros: [0, 2], want: 1, a: -1 }, { zeros: [-3, 2], want: 1 },
      ] }, 'Entre dos ceros seguidos el polinomio no cambia de signo, y en un cero simple cambia. Cada factor $x - c$ es negativo a la izquierda de $c$ y positivo a la derecha; el signo del producto sale de contar los negativos.',
        { hint: 'Mira cuántos factores son negativos en el tramo: si son pares, el producto es positivo.' }),
      play('multiplicidad', 'Cruza o rebota: la multiplicidad', { rounds: [
        { zeros: [-3, 1], want: ['cruza', 'rebota'], deg: 3 }, { zeros: [-2, 1], want: ['rebota', 'cruza'], deg: 5 }, { zeros: [0, 3], want: ['cruza', 'cruza'], deg: 4 }, { zeros: [-1, 2], want: ['rebota', 'rebota'], deg: 4 },
      ] }, 'Con exponente impar la gráfica cruza el eje; con exponente par, lo toca y se devuelve. El grado es la suma de los exponentes: $(x + 3)(x - 1)^2$ tiene grado 3; $(x + 2)^2(x - 1)^3$, grado 5; $x(x - 3)^3$ o $x^3(x - 3)$, grado 4; $(x + 1)^2(x - 2)^2$, grado 4.',
        { hint: 'Elige primero exponentes con la paridad correcta y luego ajústalos para que sumen el grado.' }),
      play('prueba-candidatos', 'Prueba los candidatos a cero', { rounds: [
        { P: [1, 0, -7, 6], cands: [-6, -3, -2, -1, 1, 2, 3, 6] }, { P: [1, 2, -1, -2], cands: [-2, -1, 1, 2] }, { P: [1, -1, -4, 4], cands: [-4, -2, -1, 1, 2, 4] },
      ] }, 'Un cero entero debe dividir al término independiente. $x^3 - 7x + 6$ tiene ceros $1, 2, -3$; $x^3 + 2x^2 - x - 2$, ceros $-2, -1, 1$; $x^3 - x^2 - 4x + 4$, ceros $1, 2, -2$.',
        { hint: 'Prueba cada candidato: si P(c) da cero, es un cero. Un cúbico tiene a lo más tres.' }),
      play('arma-ceros', 'Pon los ceros con su multiplicidad', { rounds: [
        { zeros: [[-2, 1], [1, 2]] }, { zeros: [[-1, 2], [3, 1]] }, { zeros: [[0, 1], [2, 1], [-3, 1]] },
      ] }, 'Un polinomio de grado $n$ tiene $n$ ceros contando los repetidos: donde la gráfica rebota hay un cero doble. $(x + 2)(x - 1)^2$; $(x + 1)^2(x - 3)$; $x(x - 2)(x + 3)$.',
        { hint: 'Donde la curva cruza el eje pon un cero; donde lo toca y se devuelve, pon dos en el mismo lugar.' }),
      play('factoriza-cubica', 'Del cúbico a la parábola', { rounds: [
        { P: [1, -1, -4, 4], c: 1 }, { P: [1, 0, 0, -8], c: 2 }, { P: [1, -1, 1, -1], c: 1 }, { P: [1, 4, 1, -6], c: 1 },
      ] }, 'Con un cero $c$ se divide entre $x - c$ y queda una parábola. $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$, cuyos otros ceros son complejos: $-1 \\pm \\sqrt3\\, i$. $x^3 - x^2 + x - 1 = (x - 1)(x^2 + 1)$ tiene $\\pm i$. Los ceros complejos llegan en parejas conjugadas.',
        { hint: 'Prueba los divisores del último coeficiente hasta que P(c) dé cero.' }),
      keep('alg-93', 'cruza-o-rebota')]);

    setExam('grado-superior', [
      ['alg-23b', 'Dividendo = divisor · cociente + residuo, con residuo menor que el divisor.',
        play('bolsas-residuo', 'Empaca', { rounds: [{ N: 71, d: 8 }] }, '$71 = 8 \\cdot 8 + 7$.', { hint: 'El residuo es menor que 8.' })],
      ['alg-23b', 'Dos polinomios iguales tienen los mismos coeficientes.',
        play('iguala-coeficientes', 'Iguala coeficientes', { rounds: [{ c: 1, P: [1, 1, -5, 3] }] }, '$(x - 1)(x^2 + 2x - 3)$.', { hint: 'Empieza por x².' })],
      ['alg-92', 'La división sintética baja, multiplica y suma.',
        play('llena-sintetica', 'Completa la tabla', { rounds: [{ coef: [1, -3, 0, 4], c: 2, extra: [1, 6] }] }, 'Abajo: $1, -1, -2, 0$.', { hint: 'Baja el primero.' })],
      ['alg-92', 'x − c es factor si P(c) = 0.',
        play('factor-k', 'Ajusta k', { rounds: [{ P: [1, null, 2, -8], c: 2 }] }, '$8 + 4k + 4 - 8 = 0$: $k = -1$.', { hint: 'Evalúa en 2.' })],
      ['alg-93', 'Los ceros enteros dividen al término independiente.',
        play('prueba-candidatos', 'Prueba candidatos', { rounds: [{ P: [1, -6, 11, -6], cands: [-3, -2, -1, 1, 2, 3, 6] }] }, 'Ceros $1, 2, 3$.', { hint: 'Divisores de 6.' })],
      ['alg-93', 'Entre dos ceros seguidos el polinomio no cambia de signo.',
        play('tramo-signo', 'El signo en cada tramo', { rounds: [{ zeros: [-1, 2, 5], want: -1 }] }, 'Negativo antes de −1 y entre 2 y 5.', { hint: 'Cuenta factores negativos.' })],
    ]);
  }
  // ───────── Mundo 9 · Fracciones Algebraicas ─────────
  {
    setLesson('alg-25a', [
      play('prohibidos', 'Los valores prohibidos: donde el denominador vale cero', { rounds: [
        { tex: '\\dfrac{x + 3}{(x - 2)(x + 4)}', bad: [2, -4] }, { tex: '\\dfrac{5}{x^2 - 16}', bad: [4, -4] },
        { tex: '\\dfrac{x - 6}{x^2 + 2x}', bad: [0, -2] }, { tex: '\\dfrac{2x}{x^2 - 5x + 6}', bad: [2, 3] },
      ] }, 'No se puede dividir entre cero: se excluyen los valores que anulan el denominador. $(x - 2)(x + 4) = 0$ en $2$ y $-4$; $x^2 - 16 = (x - 4)(x + 4)$; $x^2 + 2x = x(x + 2)$; $x^2 - 5x + 6 = (x - 2)(x - 3)$. El numerador no importa: si vale cero, la fracción vale 0 y existe.',
        { hint: 'Factoriza el denominador y busca qué número anula cada factor. Lo de arriba puede valer cero sin problema.' }),
      keep('alg-25a', 'cancela-factores'),
      play('evalua-racional', 'Evalúa la fracción: busca el x que da la meta', { rounds: [
        { n: [1, 4], d: [1, -2], target: 3 }, { n: [2, 1], d: [1, 1], target: 3 }, { n: [1, -6], d: [1, 2], target: 0 }, { n: [3, 0], d: [1, -3], target: 2 },
      ] }, 'El valor de la fracción es numerador entre denominador. $\\dfrac{5 + 4}{5 - 2} = 3$; $\\dfrac{2(-2) + 1}{-2 + 1} = 3$; la fracción vale 0 donde el numerador es 0 (en $x = 6$); $\\dfrac{3(-6)}{-6 - 3} = 2$. Donde el denominador vale 0 la fracción no existe.',
        { hint: 'Mira las dos barras: la fracción vale la meta cuando el numerador es la meta veces el denominador.' }),
      play('cerca-asintota', 'Acércate al valor prohibido', { rounds: [
        { k: 1, a: 2, side: 1, target: 30 }, { k: 2, a: -3, side: -1, target: 15 }, { k: 3, a: 1, side: 1, target: 1000 },
      ] }, 'Cerca del valor que anula el denominador, se divide entre un número muy pequeño y la fracción se dispara: $\\dfrac{1}{0.02} = 50$, $\\dfrac{2}{-0.1} = -20$, $\\dfrac{3}{0.001} = 3000$. Por eso la gráfica sube (o baja) sin fin junto a la asíntota vertical.',
        { hint: 'Dividir entre 0.1 es multiplicar por 10; entre 0.01, por 100. Cuanto más cerca, más grande el resultado.' }),
      play('cruz-asintotas', 'Lleva la cruz de asíntotas a su lugar', { rounds: [
        { p: 3, q: -1, h: -1, xr: [-7, 6], yr: [-4, 9] }, { p: -2, q: 5, h: 4, xr: [-4, 9], yr: [-7, 5] },
      ] }, 'En $y = \\dfrac{3x - 1}{x + 1}$ la vertical está en $x = -1$ (ahí se anula el denominador) y la horizontal en $y = 3$, el cociente de los coeficientes de $x$. En $y = \\dfrac{-2x + 5}{x - 4}$: $x = 4$ y $y = -2$.',
        { hint: 'La vertical va donde se anula el denominador. Para la horizontal piensa en x enorme: los números sueltos dejan de pesar.' }),
      keep('alg-25a', 'rio-o-hueco')]);

    setLesson('alg-25b', [
      play('denominador-comun', 'Arma el mínimo común denominador', { rounds: [
        { d1: ['x', 'x-3'], d2: ['x-3', 'x+2'], chips: ['x', 'x-3', 'x+2', 'x-2', 'x^2'] },
        { d1: ['x', 'x'], d2: ['x', 'x+1'], chips: ['x', 'x', 'x', 'x+1', 'x-1'] },
        { d1: ['x+1', 'x-1'], d2: ['x+1', 'x+1'], chips: ['x+1', 'x+1', 'x+1', 'x-1', 'x'] },
        { d1: ['x-2'], d2: ['x+5', 'x-2'], chips: ['x-2', 'x-2', 'x+5', 'x+2'] },
      ] }, 'Cada factor entra con la mayor potencia que aparece, y un factor que comparten no se repite: $x(x - 3)(x + 2)$; $x^2(x + 1)$; $(x + 1)^2(x - 1)$; y $(x - 2)(x + 5)$, porque el primer denominador ya está dentro del segundo.',
        { hint: 'Factor por factor: ¿cuántas veces aparece como máximo en un mismo denominador? Esa es la cantidad de copias.' }),
      play('amplifica-fraccion', 'Completa cada fracción al común denominador', { rounds: [
        { f1: ['3', ['x']], f2: ['2', ['x+4']], chips: ['x', 'x+4', 'x-4', '4'], sum: '\\dfrac{3(x + 4) + 2x}{x(x + 4)} = \\dfrac{5x + 12}{x(x + 4)}' },
        { f1: ['5', ['x+2']], f2: ['1', ['x-2']], chips: ['x-2', 'x+2', 'x', '2'], sum: '\\dfrac{5(x - 2) + (x + 2)}{(x + 2)(x - 2)} = \\dfrac{6x - 8}{x^2 - 4}' },
        { f1: ['x', ['x+1', 'x-1']], f2: ['2', ['x+1']], chips: ['x-1', 'x+1', 'x'], sum: '\\dfrac{x + 2(x - 1)}{(x + 1)(x - 1)} = \\dfrac{3x - 2}{x^2 - 1}' },
      ] }, 'Se multiplica arriba y abajo por el factor que le falta a cada denominador: eso es multiplicar por 1 y la fracción no cambia. Si una fracción ya tiene el común denominador, no se toca. Luego se suman los numeradores.',
        { hint: 'Compara cada denominador con el común: el factor que le falta es el que va arriba y abajo.' }),
      play('resta-fracciones', 'El menos de la resta va a todo el numerador', { rounds: [
        { A: ['3x', '+1'], B: ['x', '-4'], den: 'x + 2' }, { A: ['x^2'], B: ['x', '-6'], C: ['2x', '-1'], den: 'x - 3' }, { A: ['4x', '-2'], B: ['-x', '+5'], C: ['x'], den: '2x' },
      ] }, 'Al restar una fracción, el signo menos multiplica a todo su numerador; la que se suma queda igual: $3x + 1 - (x - 4) = 2x + 5$; $x^2 - (x - 6) + (2x - 1) = x^2 + x + 5$; $4x - 2 - (-x + 5) + x = 6x - 7$. Olvidar un término es el error más común.',
        { hint: 'Mira qué signo hay delante de cada paréntesis: solo el menos cambia los signos, y los cambia todos.' }),
      play('multiplica-cancela', 'Multiplica y cancela cruzado', { rounds: [
        { top: ['x', 'x+5'], bottom: ['x+5', '3', 'x'] }, { top: ['x-4', 'x+1'], bottom: ['x+1', 'x+4', 'x-4'] }, { top: ['x', 'x', 'x-3'], bottom: ['x-3', 'x', '5'] },
      ] }, 'Al multiplicar fracciones todo lo de arriba queda multiplicando, y todo lo de abajo también: un factor de un numerador se cancela con uno igual de cualquier denominador. Quedan $\\dfrac{1}{3}$, $\\dfrac{1}{x + 4}$ y $\\dfrac{x}{5}$.',
        { hint: 'Busca parejas iguales: una arriba y otra abajo, sin importar de qué fracción venga cada una.' }),
      play('voltea-divide', 'Dividir es multiplicar por la recíproca', { rounds: [
        { a: ['x + 1', '4'], b: ['x + 1', '8'], res: '\\dfrac{(x + 1) \\cdot 8}{4 (x + 1)} = 2', wrong: '\\tfrac12' },
        { a: ['x^2', 'x - 2'], b: ['x', 'x - 2'], res: '\\dfrac{x^2 (x - 2)}{(x - 2)\\, x} = x', wrong: '\\tfrac1x' },
        { a: ['3', 'x + 5'], b: ['6', 'x(x + 5)'], res: '\\dfrac{3 \\cdot x(x + 5)}{(x + 5) \\cdot 6} = \\dfrac{x}{2}', wrong: '\\tfrac2x' },
        { a: ['x^2 - 1', '3'], b: ['x - 1', '1'], res: '\\dfrac{(x - 1)(x + 1)}{3 (x - 1)} = \\dfrac{x + 1}{3}', wrong: '\\tfrac{3}{x + 1}' },
      ] }, 'Dividir entre una fracción es multiplicar por la fracción volteada: $\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}$; se voltea solo el divisor. Una expresión sola es una fracción con 1 abajo: $x - 1 = \\tfrac{x - 1}{1}$. Después se cancelan los factores comunes.',
        { hint: 'Pregúntate cuál es el divisor: la fracción que va después del signo ÷. Solo esa cambia.' }),
      keep('alg-25b', 'llena-estanque')]);

    setLesson('alg-101', [
      play('dos-rectas', 'La solución es el punto de las dos rectas', { rounds: [
        { e1: [1, 1, 3], e2: [1, -1, -1] }, { e1: [2, 1, 1], e2: [1, -1, 5] }, { e1: [1, 2, -4], e2: [3, -1, 2] }, { e1: [1, 0, -3], e2: [1, 1, 1] },
      ] }, 'Cada ecuación es una recta: sus puntos la cumplen. El punto que cumple las dos está en las dos rectas, en su cruce: $(1, 2)$, $(2, -3)$, $(0, -2)$ y $(-3, 4)$. La ecuación $x = -3$ es una recta vertical.',
        { hint: 'Pon el punto sobre una de las rectas y deslízalo por ella hasta que la otra ecuación también se encienda.' }),
      keep('alg-101', 'afina-sistema'),
      play('elimina-variable', 'Suma las ecuaciones para que se vaya la y', { rounds: [
        { e1: [3, 2, 12], e2: [1, 1, 5] }, { e1: [2, -3, 1], e2: [1, 1, 3] }, { e1: [1, 4, 7], e2: [3, -2, 7] },
      ] }, 'Sumar a una ecuación otra multiplicada por un número no cambia la solución. Con $k = -2$, $3x + 2y - 2(x + y) = 12 - 10$ da $x = 2$; con $k = 3$, $5x = 10$; con $k = 2$, $7x = 21$ y $x = 3$.',
        { hint: 'La y se va cuando su coeficiente de la fila 1 y k veces el de la fila 2 son opuestos.' }),
      play('dos-compras', 'Dos recibos, los mismos precios', { rounds: [
        { names: ['cuaderno', 'lápiz'], e1: [2, 1, 11], e2: [1, 1, 7], max: 8 },
        { names: ['empanada', 'jugo'], e1: [3, 2, 12], e2: [1, 1, 5], max: 8 },
        { names: ['boleta', 'crispeta'], e1: [2, 3, 34], e2: [1, 2, 20], max: 10 },
      ] }, 'Cada recibo es una ecuación y los dos se cumplen a la vez. Entre $2a + b = 11$ y $a + b = 7$ la única diferencia es un cuaderno, que cuesta 4; el lápiz, 3. Luego empanada 2 y jugo 3; boleta 8 y crispeta 6.',
        { hint: 'Compara los dos recibos: ¿qué tiene de más uno que el otro, y cuánto más cuesta?' }),
      keep('alg-101', 'combina-vectores'),
      keep('alg-101', 'bote-corriente')]);

    setLesson('alg-102', [
      play('corte-parabola-recta', 'La recta que corta a la parábola', { rounds: [
        { a: 1, m: -1, x0: -3 }, { a: 1, m: -2, x0: 1 }, { a: 2, m: 2, x0: -1 }, { a: 1, m: 0, x0: 2 },
      ] }, 'En un corte las dos expresiones de $y$ valen lo mismo: al igualarlas queda una cuadrática. $x^2 = -x + 6$ da $x^2 + x - 6 = 0$, con cortes $-3$ y $2$; $x^2 = -2x + 3$, cortes $1$ y $-3$; $2x^2 = 2x + 4$, cortes $-1$ y $2$; $x^2 = 4$, cortes $\\pm 2$.',
        { hint: 'La recta debe pasar por el punto de la parábola en la línea punteada: su altura es a por x al cuadrado.' }),
      play('circulo-recta', 'Dos, uno o ningún corte', { rounds: [
        { R: 5, m: 0, want: 1 }, { R: 4, m: 0.75, want: 1 }, { R: 3, m: 1, want: 0 }, { R: 5, m: -0.75, want: 2 },
      ] }, 'Al sustituir la recta en el círculo queda una cuadrática: si su discriminante es positivo hay dos cortes, si es cero la recta solo toca el círculo y si es negativo no lo corta. La horizontal $y = 5$ toca a $x^2 + y^2 = 25$ en $(0, 5)$.',
        { hint: 'Mira el discriminante abajo: un solo corte es exactamente cero, cuando la recta apenas roza el círculo.' }),
      play('rectangulo-pa', 'Perímetro y área a la vez', { rounds: [{ P: 18, A: 20, max: 9 }, { P: 20, A: 21, max: 9 }, { P: 16, A: 15, max: 8 }] },
        'Pedir perímetro y área es un sistema no lineal: $x + y = 9$ y $xy = 20$ dan $x^2 - 9x + 20 = 0$, lados 4 y 5. Igual: 3 y 7; 3 y 5. Muchos rectángulos tienen el perímetro pedido, pero solo uno tiene además el área.',
        { hint: 'Primero consigue el perímetro; luego desliza la esquina sin cambiarlo (lo que gana un lado lo pierde el otro) hasta el área.' }),
      play('parciales-tapar', 'Fracciones parciales: iguala los numeradores', { rounds: [{ p: 2, q: -1, c: 2, d: 5 }, { p: 3, q: -2, c: 1, d: 7 }, { p: 1, q: 4, c: 2, d: 1 }] },
        'Al juntar $\\dfrac{A}{x - p} + \\dfrac{B}{x - q}$ el numerador es $A(x - q) + B(x - p)$. Igualar el coeficiente de $x$ y el número suelto da un sistema: $A = 3$, $B = -1$; $A = 2$, $B = -1$; $A = -1$, $B = 3$.',
        { hint: 'La barra de x pide A + B; la del número depende de los dos de otra manera. Ajusta uno y corrige con el otro.' }),
      play('tapa-evalua', 'Tapa un factor y evalúa', { rounds: [
        { num: [1, 9], ps: [3, -3] }, { num: [3, 9], ps: [-1, -4] }, { num: [1, -4], ps: [0, 1, -2] },
      ] }, 'Para hallar el numerador de $\\dfrac{A}{x - p}$ se tapa $x - p$ en la fracción original y lo que queda se evalúa en $x = p$: $\\dfrac{3 + 9}{3 + 3} = 2$. Funciona porque, al multiplicar todo por $x - p$ y poner $x = p$, las demás fracciones se anulan.',
        { hint: 'Cada factor se tapa con el número que lo vuelve cero: cuidado con el signo dentro del paréntesis.' }),
      keep('alg-102', 'cruce-curvas')]);

    setExam('racionales', [
      ['alg-25a', 'Los valores prohibidos son los que anulan el denominador.',
        play('prohibidos', 'Tacha los valores prohibidos', { rounds: [{ tex: '\\dfrac{x + 1}{x^2 - 25}', bad: [5, -5] }] }, '$x^2 - 25 = (x - 5)(x + 5)$: se excluyen $5$ y $-5$.', { hint: 'Factoriza el denominador.' })],
      ['alg-25a', 'La fracción vale la meta cuando el numerador es la meta veces el denominador.',
        play('evalua-racional', 'Busca el x', { rounds: [{ n: [1, 1], d: [1, -3], target: 3 }] }, '$\\dfrac{5 + 1}{5 - 3} = 3$.', { hint: 'Compara las barras.' })],
      ['alg-25b', 'El común denominador lleva cada factor con su mayor potencia.',
        play('denominador-comun', 'Arma el común denominador', { rounds: [{ d1: ['x', 'x+6'], d2: ['x+6', 'x-5'], chips: ['x', 'x+6', 'x-5', 'x-6'] }] }, '$x(x + 6)(x - 5)$.', { hint: 'El factor compartido va una vez.' })],
      ['alg-25b', 'Al restar, el menos cambia el signo de todo el numerador.',
        play('resta-fracciones', 'Resta y suma', { rounds: [{ A: ['2x'], B: ['x', '-3'], C: ['-x', '+4'], den: 'x + 1' }] }, '$2x - (x - 3) + (-x + 4) = 7$.', { hint: 'Solo el menos cambia signos.' })],
      ['alg-101', 'La solución de un sistema está en el cruce de las rectas.',
        play('dos-rectas', 'Busca el cruce', { rounds: [{ e1: [1, 1, 4], e2: [2, -1, 5] }] }, 'El punto $(3, 1)$ cumple las dos.', { hint: 'Desliza el punto por una recta.' })],
      ['alg-101', 'Sumando un múltiplo de una ecuación se elimina una incógnita.',
        play('elimina-variable', 'Elimina la y', { rounds: [{ e1: [4, 3, 10], e2: [1, 1, 3] }] }, 'Con $k = -3$: $x = 1$, y luego $y = 2$.', { hint: 'Coeficientes de y opuestos.' })],
      ['alg-102', 'En los cortes de dos curvas las dos expresiones de y son iguales.',
        play('corte-parabola-recta', 'Corta la parábola', { rounds: [{ a: 1, m: 1, x0: -2 }] }, '$x^2 = x + 6$: cortes en $-2$ y $3$.', { hint: 'Pasa por el punto marcado.' })],
      ['alg-102', 'Cada fracción parcial sale de igualar los numeradores.',
        play('parciales-tapar', 'Halla A y B', { rounds: [{ p: 4, q: -1, c: 3, d: -2 }] }, '$A = 2$, $B = 1$.', { hint: 'La barra de x pide A + B.' })],
    ]);
  }
  // ───────── Mundo 10 · Crecimiento Exponencial ─────────
  {
    setLesson('alg-71', [
      play('ajusta-exponencial', 'La curva exponencial por dos puntos', { rounds: [
        { a: 2, b: 3, pts: [[0, 2], [1, 6]] }, { a: 5, b: 0.5, pts: [[0, 5], [1, 2.5]] }, { a: 3, b: 2, pts: [[1, 6], [2, 12]] }, { a: 4, b: 0.25, pts: [[-1, 16], [0, 4]] },
      ] }, 'En $y = a \\cdot b^x$, $a$ es la altura en $x = 0$ y $b$ es el factor por el que se multiplica la altura en cada paso a la derecha: de 2 a 6 se multiplica por 3; de 5 a 2.5, por $\\tfrac12$. Si no está el punto de $x = 0$, se retrocede un paso dividiendo: $6 \\div 2 = 3$.',
        { hint: 'Divide la altura de un punto entre la del punto anterior: ese cociente es b. La altura en x = 0 es a.' }),
      keep('alg-71', 'proyector-sombras'),
      play('mueve-asintota', 'Corre la exponencial y su asíntota', { rounds: [
        { b: 2, h: 1, k: -3 }, { b: 2, h: -2, k: 2 }, { b: 0.5, h: 0, k: 1 }, { b: 3, h: 1, k: -4 },
      ] }, '$y = b^{x - h} + k$ es $b^x$ corrida $h$ a la derecha y $k$ hacia arriba. Su asíntota horizontal sube con ella: queda en $y = k$. El punto $(0, 1)$ de $b^x$ pasa a $(h, k + 1)$.',
        { hint: 'Primero sube o baja hasta que la curva tenga la forma de los puntos; luego córrela a los lados.' }),
      play('mitad-espejo', 'Base menor que 1: el reflejo', { rounds: [{ b: 2, target: 8 }, { b: 3, target: 9 }, { b: 2, target: 0.25 }, { b: 2, target: 32 }] },
        '$\\left(\\tfrac1b\\right)^x = b^{-x}$: la curva de base $\\tfrac1b$ es el reflejo de $b^x$ en el eje $y$ y decrece. Para pasar de 1 hay que ir a la izquierda: $\\left(\\tfrac12\\right)^{-3} = 2^3 = 8$, $\\left(\\tfrac13\\right)^{-2} = 9$; en cambio $\\left(\\tfrac12\\right)^{2} = \\tfrac14$.',
        { hint: 'Un exponente negativo voltea la fracción. Mira la curva clara: su reflejo te dice dónde está la altura pedida.' }),
      play('hacia-e', 'Repartir el interés: el número e', { rounds: [{ target: 2.5 }, { target: 2.65 }, { target: 2.7 }] },
        'Con el 100 % anual pagado en $n$ partes, un peso se vuelve $\\left(1 + \\tfrac1n\\right)^n$: 2 con un pago, 2.25 con dos, 2.59 con diez, 2.705 con cien. Crece, pero cada vez menos, y nunca pasa de $e \\approx 2.718$.',
        { hint: 'Desliza n y mira cómo se frena la barra: entre más pagos, menos gana cada pago nuevo.' }),
      keep('alg-71', 'lirios-laguna')]);

    setLesson('alg-13b', ['crece-planta', 'carrera-interes', 'ajusta-capital', 'mejor-oferta', 'alcancias-gemelas', 'dos-bancos'].map(g => keep('alg-13b', g)));

    setLesson('alg-72', [
      play('exponente-buscado', 'El logaritmo es un exponente', { rounds: [{ b: 2, N: 64 }, { b: 3, N: 81 }, { b: 10, N: 0.001 }, { b: 5, N: 1 }] },
        '$\\log_b N$ es cuántas veces hay que multiplicar por $b$ para pasar de 1 a $N$: $2^6 = 64$, $3^4 = 81$. Si $N$ es menor que 1 hay que dividir: $10^{-3} = 0.001$. Y $\\log_5 1 = 0$, porque sin multiplicar se queda en 1.',
        { hint: 'Empieza en 1 y multiplica por la base hasta llegar al número; si el número es menor que 1, divide.' }),
      keep('alg-72', 'espejo-diagonal'),
      play('entre-potencias10', 'El logaritmo decimal cuenta cifras', { rounds: [
        { N: 1024, tex: '2^{10}' }, { N: 16807, tex: '7^{5}' }, { N: 0.05, tex: '0.05' }, { N: 1048576, tex: '2^{20}' },
      ] }, 'Si $10^k \\le N < 10^{k + 1}$, el logaritmo de $N$ está entre $k$ y $k + 1$, y $N$ tiene $k + 1$ cifras antes de la coma: $2^{10} = 1024$ (4 cifras, $\\log \\approx 3.01$); $7^5 = 16\\,807$; $0.05$ está entre $10^{-2}$ y $10^{-1}$; $2^{20}$ pasa del millón.',
        { hint: 'Cuenta las cifras del número antes de la coma; para un decimal, mira cuántas posiciones tiene detrás.' }),
      play('expande-log', 'Abre el logaritmo en una suma', { rounds: [
        { tex: '\\log \\dfrac{x^2 y}{z}', parts: [['x', 2], ['y', 1], ['z', -1]], tray: [-2, -1, 0.5, 1, 2, 3] },
        { tex: '\\log \\dfrac{\\sqrt{x}}{y^3}', parts: [['x', 0.5], ['y', -3]], tray: [-3, -0.5, 0.5, 1, 3] },
        { tex: '\\log_2 (8x^4)', base: 2, parts: [['8', 1], ['x', 4]], tray: [1, 2, 3, 4, 8] },
        { tex: '\\log \\dfrac{1}{x\\,y^2}', parts: [['x', -1], ['y', -2]], tray: [-2, -1, 0.5, 1, 2] },
      ] }, 'El logaritmo de un producto es la suma de los logaritmos; el de un cociente, la resta; y un exponente baja como factor: $\\log \\dfrac{x^2 y}{z} = 2\\log x + \\log y - \\log z$. Una raíz cuadrada es el exponente $\\tfrac12$. Y $\\log_2 8 = 3$.',
        { hint: 'Lo que está abajo de la fracción entra restando; el exponente de cada letra pasa a multiplicar.' }),
      play('cabe-barra', 'Cambio de base: cuántas veces cabe', { rounds: [{ b: 4, a: 64 }, { b: 9, a: 27 }, { b: 2, a: 32 }, { b: 25, a: 5 }] },
        '$\\log_b a = \\dfrac{\\log a}{\\log b}$: cuántas barras de $\\log b$ caben en la de $\\log a$. $\\log_4 64 = 3$; $\\log_9 27 = \\tfrac32$, porque $9^{1.5} = 27$; $\\log_{25} 5 = \\tfrac12$, porque $\\sqrt{25} = 5$. Así se calcula cualquier base con la tecla log.',
        { hint: 'Pon copias de la barra de abajo hasta igualar el largo de la de arriba; puede caber media barra.' }),
      keep('alg-72', 'regla-de-calculo')]);

    setLesson('alg-73', [keep('alg-73', 'balanza-exponencial'),
      play('baja-con-log', 'Cuando las bases no coinciden: logaritmo', { rounds: [{ b: 5, N: 20, max: 4 }, { b: 2, N: 10, max: 6 }, { b: 1.05, N: 2, max: 20 }] },
        'Si no se puede escribir con la misma base, se toma logaritmo a los dos lados: $x \\log b = \\log N$, y se divide entre $\\log b$. $5^x = 20$ da $x \\approx 1.86$; $2^x = 10$, $x \\approx 3.32$; y al 5 % el dinero se duplica en $x \\approx 14.2$ periodos.',
        { hint: 'Con logaritmos la potencia se vuelve un producto: busca la x donde la barra que crece alcanza a la fija.' }),
      play('sube-al-exponente', 'Del logaritmo a la potencia', { rounds: [{ b: 2, k: -1, c: 3 }, { b: 3, k: 4, c: 2 }, { b: 5, k: -5, c: 1 }, { b: 2, k: 3, c: -1 }] },
        '$\\log_b(x + k) = c$ quiere decir $x + k = b^c$: $x - 1 = 8$, $x = 9$; $x + 4 = 9$, $x = 5$; $x - 5 = 5$, $x = 10$; $x + 3 = \\tfrac12$, $x = -2.5$. La solución debe dejar positivo lo de adentro del logaritmo.',
        { hint: 'Escribe la ecuación como potencia: la base del logaritmo elevada al otro lado es lo de adentro.' }),
      play('media-vida', 'La vida media', { rounds: [
        { A0: 200, T: 5, target: 25, thing: 'cafeína', unit: 'mg' }, { A0: 80, T: 8, target: 5, thing: 'un medicamento', unit: 'mg' }, { A0: 1000, T: 2, target: 62.5, thing: 'cloro', unit: 'g' },
      ] }, 'Cada vida media la cantidad se divide entre 2: $200 \\to 100 \\to 50 \\to 25$ en 3 vidas medias, 15 horas. En general $A_0\\left(\\tfrac12\\right)^{t/T} = A$ da $t = T \\log_2 \\tfrac{A_0}{A}$.',
        { hint: 'Cuenta cuántas veces hay que partir por la mitad la cantidad inicial para llegar a la pedida.' }),
      play('cambio-u', 'La incógnita escondida: u = aˣ', { rounds: [{ a: 2, p: -6, q: 8 }, { a: 3, p: -4, q: 3 }, { a: 2, p: -1, q: -2 }] },
        'Con $u = a^x$ la ecuación queda $u^2 + pu + q = 0$. $u^2 - 6u + 8 = 0$ da $u = 2$ y $u = 4$: $x = 1$ y $x = 2$. $u^2 - 4u + 3 = 0$: $u = 1$ ($x = 0$) y $u = 3$ ($x = 1$). En $u^2 - u - 2 = 0$ el cero $u = -1$ no sirve: $2^x$ nunca es negativo.',
        { hint: 'Busca dónde la parábola corta el eje u, pero recuerda que una potencia de base positiva nunca es negativa.' }),
      keep('alg-73', 'piedras-selva')]);

    setExam('exp-log', [
      ['alg-71', 'En y = a·bˣ, a es la altura en x = 0 y b el factor de cada paso.',
        play('ajusta-exponencial', 'Curva por dos puntos', { rounds: [{ a: 2, b: 4, pts: [[0, 2], [1, 8]] }] }, '$y = 2 \\cdot 4^x$.', { hint: 'Divide las alturas.' })],
      ['alg-71', 'Una base menor que 1 refleja la curva: (1/b)ˣ = b⁻ˣ.',
        play('mitad-espejo', 'Base menor que 1', { rounds: [{ b: 3, target: 27 }] }, '$\\left(\\tfrac13\\right)^{-3} = 27$.', { hint: 'Exponente negativo.' })],
      ['alg-13b', 'En el interés compuesto cada periodo gana sobre lo ya ganado.',
        play('crece-planta', 'Haz crecer la planta', { rounds: [{ kind: 'compuesto', C: 800, M1: 880, step: 1 }] }, 'Cada mes se multiplica por 1.1: $880$, $968$, $1064.8$.', { hint: 'Compuesto multiplica.' })],
      ['alg-13b', 'Una tasa simple que iguale a la compuesta debe ser mayor.',
        play('alcancias-gemelas', 'Alcancías gemelas', { tol: 0.06, max: 40, rounds: [{ C: 1000, r: 30, n: 2 }] }, '$1000 \\cdot 1.3^2 = 1690$: la simple necesita $34.5\\,\\%$.', { hint: 'Mayor que 30 %.' })],
      ['alg-72', 'El logaritmo es el exponente que lleva la base al número.',
        play('exponente-buscado', 'Busca el exponente', { rounds: [{ b: 4, N: 0.0625 }] }, '$4^{-2} = \\tfrac{1}{16}$.', { hint: 'Divide entre 4.' })],
      ['alg-72', 'Productos se vuelven sumas y exponentes, factores.',
        play('expande-log', 'Abre el logaritmo', { rounds: [{ tex: '\\log (x^3 y)', parts: [['x', 3], ['y', 1]], tray: [-1, 1, 2, 3] }] }, '$3\\log x + \\log y$.', { hint: 'El exponente baja.' })],
      ['alg-73', 'log_b(x + k) = c quiere decir x + k = bᶜ.',
        play('sube-al-exponente', 'Del logaritmo a la potencia', { rounds: [{ b: 3, k: -2, c: 2 }] }, '$x - 2 = 9$: $x = 11$.', { hint: 'Pasa a potencia.' })],
      ['alg-73', 'Con bases distintas se toma logaritmo a los dos lados.',
        play('baja-con-log', 'Resuelve', { rounds: [{ b: 3, N: 50, max: 5 }] }, '$x = \\dfrac{\\log 50}{\\log 3} \\approx 3.56$.', { hint: 'Iguala las barras.' })],
    ]);
  }
  // ───────── Séptimo juego de las lecciones que tenían seis (pedido del 2026-11-18) ─────────
  {
    // Entra antes del juego en movimiento, que sigue siendo el último.
    const add7 = (id, ex) => { const l = L(id); l.ex.splice(l.ex.length - 1, 0, { ...ex, canvasGuide: true, motion: false }); };
    add7('alg-12', play('tasa-unitaria', 'Compara precios por unidad', { rounds: [
      { names: ['paquete A', 'paquete B'], packs: [[6, 9000], [4, 7200]], step: 100, max: 2500 },
      { names: ['paquete A', 'paquete B'], packs: [[12, 18000], [8, 10400]], step: 100, max: 2500 },
      { names: ['paquete A', 'paquete B'], packs: [[3, 4500], [5, 8000]], step: 100, max: 2500 },
    ] }, 'Para comparar paquetes de distinto tamaño se divide: precio ÷ unidades. $9000 \\div 6 = 1500$ frente a $7200 \\div 4 = 1800$; $18\\,000 \\div 12 = 1500$ frente a $10\\,400 \\div 8 = 1300$; $1500$ frente a $1600$. El paquete más grande no siempre es el más barato.',
      { hint: 'Las copias del precio unitario deben llenar la barra del paquete exactamente: ni sobra ni falta.' }));
    add7('alg-12f', play('tabla-compuesta', 'Regla de tres compuesta: reduce a la unidad', { rounds: [
      { who: 'hornos', what: 'panes', m1: 2, h1: 3, c1: 1200, m2: 3, h2: 5, step: 50, max: 500 },
      { who: 'pintores', what: 'paredes', m1: 4, h1: 2, c1: 16, m2: 6, h2: 3, step: 1, max: 10 },
      { who: 'bombas', what: 'litros', m1: 5, h1: 2, c1: 3000, m2: 2, h2: 7, step: 50, max: 500 },
    ] }, 'Si el resultado es proporcional a dos magnitudes, se busca lo que hace una unidad de cada una: $1200 \\div (2 \\cdot 3) = 200$ panes por horno y hora, y $200 \\cdot 3 \\cdot 5 = 3000$. Luego $16 \\div 8 = 2$ y $2 \\cdot 18 = 36$; $3000 \\div 10 = 300$ y $300 \\cdot 14 = 4200$.',
      { hint: 'Cada casilla es un trabajador durante una hora; reparte el total conocido entre todas las casillas.' }));
    add7('alg-13', play('estira-todo', '¿De qué número es ese porcentaje?', { rounds: [
      { part: 15, p: 25, step: 5, max: 150 }, { part: 9, p: 12, step: 5, max: 150 }, { part: 36, p: 120, step: 5, max: 150 }, { part: 14, p: 35, step: 5, max: 150 },
    ] }, 'Si la parte es el $p\\,\\%$ del total, el total es parte $\\div p \\cdot 100$: $15 \\div 25 \\cdot 100 = 60$, $9 \\div 12 \\cdot 100 = 75$, $36 \\div 120 \\cdot 100 = 30$ y $14 \\div 35 \\cdot 100 = 40$. Si el porcentaje pasa de 100, la parte es mayor que el total.',
      { hint: 'Estira el total hasta que la marca del porcentaje caiga sobre la parte: la barra entera es el 100 %.' }));
    add7('alg-13c', play('oferta-lleve', '«Lleve tantos, pague menos» en porcentaje', { rounds: [{ take: 5, pay: 4 }, { take: 4, pay: 3 }, { take: 2, pay: 1 }, { take: 10, pay: 7 }] },
      'En «lleve $n$, pague $m$» se regalan $n - m$ de cada $n$: el descuento es $\\tfrac{n - m}{n}$. Lleve 5 pague 4: $\\tfrac15 = 20\\,\\%$; 4 por 3: $25\\,\\%$; 2 por 1: $50\\,\\%$; 10 por 7: $30\\,\\%$.',
      { hint: 'El descuento es la parte que no se paga comparada con todo lo que te llevas.' }));
    add7('alg-13d', play('puntos-o-porciento', 'Puntos porcentuales o por ciento', { rounds: [
      { what: 'El desempleo', from: 20, to: 25 }, { what: 'La humedad', from: 40, to: 30 }, { what: 'La aprobación', from: 10, to: 15 }, { what: 'La tasa', from: 50, to: 60 },
    ] }, 'La diferencia entre dos porcentajes se mide en puntos; el cambio relativo, sobre el valor de antes: de 20 % a 25 % son 5 puntos, pero $\\tfrac{5}{20} = 25\\,\\%$ de aumento. De 40 a 30: $-25\\,\\%$; de 10 a 15: $+50\\,\\%$; de 50 a 60: $+20\\,\\%$.',
      { hint: 'Compara la diferencia con el valor de antes, no con 100.' }));

    add7('alg-21a', play('ubica-potencias', 'Ubica las potencias en la recta', { rounds: [
      { chips: [['2^5', 32], ['3^3', 27], ['5^2', 25], ['4^3', 64]], max: 70, snap: 1 },
      { chips: [['2^{-1}', 0.5], ['3^0', 1], ['10^{-1}', 0.1], ['2^1', 2]], max: 2.5, snap: 0.1 },
    ] }, 'Para comparar potencias hay que calcularlas: $2^5 = 32$ pasa a $5^2 = 25$ aunque su base sea menor, y $4^3 = 64$ queda lejos. Un exponente 0 da 1 y uno negativo da una fracción: $2^{-1} = \\tfrac12$, $10^{-1} = 0.1$.',
      { hint: 'Calcula cada potencia multiplicando la base tantas veces como dice el exponente; un exponente negativo divide.' }));
    add7('alg-21b', play('reparte-exponente', 'El exponente le llega a cada factor', { rounds: [{ a: 2, b: 5, n: 3 }, { a: 3, b: 2, n: 2 }, { a: 6, b: 2, n: 3, div: true }, { a: 2, b: 3, n: 4 }] },
      '$(a \\cdot b)^n = a^n \\cdot b^n$ porque al repetir el producto $n$ veces cada factor aparece $n$ veces: $(2 \\cdot 5)^3 = 2^3 \\cdot 5^3 = 1000$. Con un cociente pasa igual: $(6 \\div 2)^3 = 6^3 \\div 2^3 = 27$.',
      { hint: 'Escribe la potencia como el producto repetido y cuenta cuántas veces aparece cada factor.' }));
    add7('alg-22a', play('lado-cubo', 'La raíz cúbica es el lado del cubo', { rounds: [{ V: 27 }, { V: 125 }, { V: 64 }, { V: 8 }] },
      '$\\sqrt[3]{V}$ es el lado del cubo de volumen $V$: $3^3 = 27$, $5^3 = 125$, $4^3 = 64$ y $2^3 = 8$.',
      { hint: 'Cuenta los cubitos de una capa y multiplícalos por el número de capas.' }));
    add7('alg-22b', play('indice-radical', 'Simplifica el índice', { rounds: [{ n0: 6, m0: 8, n: 2, m: 2 }, { n0: 4, m0: 9, n: 2, m: 3 }, { n0: 6, m0: 25, n: 3, m: 5 }, { n0: 9, m0: 27, n: 3, m: 3 }] },
      'Si el radicando es una potencia, índice y exponente se dividen entre lo mismo: $\\sqrt[6]{8} = \\sqrt[6]{2^3} = 2^{3/6} = \\sqrt{2}$; $\\sqrt[4]{9} = \\sqrt[4]{3^2} = \\sqrt3$; $\\sqrt[6]{25} = \\sqrt[3]{5}$; $\\sqrt[9]{27} = \\sqrt[3]{3}$.',
      { hint: 'Escribe el radicando como potencia de un número primo y simplifica la fracción exponente.' }));

    add7('alg-14', play('arregla-termino', 'Un término rompe la progresión', { rounds: [
      { terms: [3, 7, 11, 16, 19], fix: [3, 15] }, { terms: [20, 17, 13, 11, 8], fix: [2, 14] }, { terms: [-5, -2, 1, 4, 8], fix: [4, 7] }, { terms: [2, 8, 10, 14, 18], fix: [1, 6] },
    ] }, 'En una progresión aritmética la diferencia es constante. En $3, 7, 11, 16, 19$ casi todas son $+4$: el cuarto debía ser 15. Luego $-3$ pide 14; $+3$ pide 7; y $+4$ pide 6 en el segundo lugar.',
      { hint: 'Busca la diferencia que más se repite; el término mal es el que tiene diferencias raras a sus dos lados.' }));
    add7('alg-14b', play('suma-impares', 'La suma de los impares es un cuadrado', { rounds: [{ S: 49 }, { S: 36 }, { S: 81 }, { S: 100 }] },
      'Cada impar es una escuadra que agranda el cuadrado: $1 + 3 + \\dots + (2n - 1) = n^2$. Con 7 impares la suma es 49; con 6, 36; con 9, 81; con 10, 100. Es la suma aritmética: $n \\cdot \\tfrac{1 + (2n - 1)}{2} = n^2$.',
      { hint: 'Mira la forma: con n escuadras tienes un cuadrado de lado n.' }));
    add7('alg-14c', play('zigzag-razon', 'Razón negativa o menor que 1', { rounds: [{ a: 1, r: -2 }, { a: 8, r: -0.5 }, { a: 2, r: -1 }, { a: 1, r: 3 }] },
      'La razón es cada término dividido entre el anterior: $-2 \\div 1 = -2$ (los signos se alternan), $-4 \\div 8 = -\\tfrac12$ (se alternan y se achican), $-2 \\div 2 = -1$ (vaivén) y $3 \\div 1 = 3$.',
      { hint: 'Divide un término entre el anterior; el signo del cociente dice si la cadena hace zigzag.' }));
    add7('alg-14d', play('periodico-serie', 'El decimal periódico es una serie', { rounds: [{ block: '3' }, { block: '45' }, { block: '12' }, { block: '6' }] },
      '$0.\\overline{45} = \\tfrac{45}{100} + \\tfrac{45}{100^2} + \\dots$ es geométrica de razón $\\tfrac1{100}$: suma $\\tfrac{45/100}{1 - 1/100} = \\tfrac{45}{99} = \\tfrac{5}{11}$. Igual: $0.\\overline3 = \\tfrac13$, $0.\\overline{12} = \\tfrac{4}{33}$, $0.\\overline6 = \\tfrac23$.',
      { hint: 'El bloque que se repite va sobre tantos nueves como cifras tenga; luego simplifica.' }));
    add7('alg-15', play('producto-telescopico', 'Productoria telescópica', { rounds: [{ kind: 'up', target: 6 }, { kind: 'down', target: 0.125 }, { kind: 'up', target: 11 }] },
      'En $\\prod \\tfrac{k + 1}{k}$ cada numerador se cancela con el denominador siguiente y quedan los extremos: $\\tfrac{n + 1}{1}$. En $\\prod_{k = 2}^{n} \\tfrac{k - 1}{k}$ queda $\\tfrac1n$.',
      { hint: 'Escribe los primeros factores y tacha lo que se repite arriba y abajo: ¿qué sobrevive?' }));

    add7('alg-23a', play('monomio-area', 'El producto de monomios es un área', { rounds: [{ f: [[3, 1], [2, 2]] }, { f: [[4, 2], [5, 1]] }, { f: [[2, 3], [4, 2]] }, { f: [[3, 1], [3, 1]] }] },
      'Los números se multiplican y los exponentes de la misma letra se suman: $3x \\cdot 2x^2 = 6x^3$, $4x^2 \\cdot 5x = 20x^3$, $2x^3 \\cdot 4x^2 = 8x^5$, $3x \\cdot 3x = 9x^2$.',
      { hint: 'Separa: primero el producto de los números, después cuántas x quedan multiplicándose en total.' }));
    add7('alg-3', play('cubo-del-binomio', 'El cubo de un binomio', { rounds: [{ b: 1 }, { b: 2 }, { b: 3 }] },
      'El cubo de arista $x + b$ se parte en un cubo $x^3$, tres losas $b x^2$, tres barras $b^2 x$ y un cubito $b^3$: $(x + 2)^3 = x^3 + 6x^2 + 12x + 8$.',
      { hint: 'Hay tres losas iguales y tres barras iguales: cada coeficiente es 3 por el área o el largo de una pieza.' }));
    add7('alg-24c', play('elige-comite', 'Comités: los números de Pascal', { rounds: [{ n: 4, ways: 6 }, { n: 5, ways: 10 }, { n: 6, ways: 15 }, { n: 7, ways: 35 }] },
      'Cada persona es un paréntesis $(1 + x)$: entra al comité (se toma la $x$) o no. Las maneras de escoger $k$ entre $n$ son $\\binom{n}{k}$, un número de la fila $n$ de Pascal: $\\binom42 = 6$, $\\binom52 = 10$, $\\binom62 = 15$, $\\binom73 = 35$. Escoger a $k$ es lo mismo que dejar por fuera a $n - k$.',
      { hint: 'Busca el número en la fila del triángulo de Pascal que corresponde al número de personas.' }));
    add7('alg-24b', play('parte-medio', 'Parte el término del medio', { rounds: [{ a: 2, b: 7, c: 3 }, { a: 3, b: -1, c: -2 }, { a: 6, b: 5, c: 1 }, { a: 2, b: -5, c: 2 }] },
      'Se buscan $m$ y $n$ con $m + n = b$ y $mn = ac$: $2x^2 + 7x + 3$ pide $6$ y $1$, y $2x^2 + 6x + x + 3 = (2x + 1)(x + 3)$. Luego $-3, 2$; $3, 2$; $-4, -1$.',
      { hint: 'Primero multiplica a por c; luego busca entre los divisores de ese número dos que sumen b.' }));

    add7('alg-23c', play('cuadrado-complejo', 'La raíz cuadrada de un complejo', { rounds: [{ t: [-4, 0] }, { t: [0, 2] }, { t: [3, 4] }, { t: [-5, 12] }] },
      'Al elevar $a + bi$ al cuadrado sale $a^2 - b^2 + 2ab\\,i$: el ángulo se duplica y el módulo se eleva al cuadrado. Así $(2i)^2 = -4$, $(1 + i)^2 = 2i$, $(2 + i)^2 = 3 + 4i$ y $(2 + 3i)^2 = -5 + 12i$. El opuesto también sirve.',
      { hint: 'El módulo de z debe ser la raíz del módulo de la estrella, y su ángulo la mitad.' }));
    add7('alg-1', play('edades-barras', 'Un problema de edades', { rounds: [{ k1: 3, L: 10, k2: 2 }, { k1: 4, L: 6, k2: 2 }, { k1: 5, L: 4, k2: 3 }, { k1: 3, L: 12, k2: 2 }] },
      'Con $x$ la edad del hijo: $3x + 10 = 2(x + 10)$ da $x = 10$. Luego $4x + 6 = 2(x + 6)$, $x = 3$; $5x + 4 = 3(x + 4)$, $x = 4$; $3x + 12 = 2(x + 12)$, $x = 12$. Los dos envejecen lo mismo.',
      { hint: 'La primera condición ya la cumple la barra; mueve la edad hasta que también se cumpla la segunda.' }));
    add7('alg-4a', play('tres-puntos', 'La parábola por tres puntos', { rounds: [{ a: 1, b: -2, c: -3, xs: [-1, 0, 3] }, { a: -1, b: 2, c: 3, xs: [0, 1, 3] }, { a: 2, b: 0, c: -4, xs: [0, 1, 2] }] },
      'Tres puntos con $x$ distintas fijan una sola parábola. El punto con $x = 0$ da $c$ directamente; los otros dos dan un sistema para $a$ y $b$: $y = x^2 - 2x - 3$, $y = -x^2 + 2x + 3$ y $y = 2x^2 - 4$.',
      { hint: 'Empieza por c: es la altura del punto que está sobre el eje y.' }));
    add7('alg-4', play('vieta-raices', 'Suma y producto de las raíces', { rounds: [{ S: 5, P: 6 }, { S: -1, P: -6 }, { S: 0, P: -9 }, { S: -4, P: 4 }] },
      'Si $x^2 - Sx + P = (x - r_1)(x - r_2)$, entonces $r_1 + r_2 = S$ y $r_1 r_2 = P$: raíces 2 y 3; $-3$ y 2; $3$ y $-3$; y $-2$ doble.',
      { hint: 'Con producto negativo las raíces tienen signos distintos; con suma cero son opuestas.' }));

    add7('alg-23b', play('reparte-terminos', 'Divide término a término', { rounds: [
      { terms: ['6x^3', '+4x^2', '-2x'], d: '2x', ans: ['3x^2', '+2x', '-1'], tray: ['3x^2', '+2x', '-1', '3x^3', '+2x^2', '-x'] },
      { terms: ['9x^4', '-3x^2'], d: '3x^2', ans: ['3x^2', '-1'], tray: ['3x^2', '-1', '6x^2', '-x', '3x^6'] },
      { terms: ['10x^5', '+5x^3', '+15x'], d: '5x', ans: ['2x^4', '+x^2', '+3'], tray: ['2x^4', '+x^2', '+3', '2x^5', '+x^3', '+3x'] },
    ] }, 'Un divisor monomio reparte: cada término se divide por separado, números entre números y exponentes que se restan: $\\tfrac{6x^3}{2x} = 3x^2$, $\\tfrac{-2x}{2x} = -1$. Un término igual al divisor da 1, no 0.',
      { hint: 'En cada término: divide los números y resta el exponente del divisor al del término.' }));
    add7('alg-92', play('divisor-fraccion', 'Dividir entre ax − b', { rounds: [{ P: [2, -1, 3, -1], a: 2, b: 1 }, { P: [4, 0, -1, 5], a: 2, b: -1 }, { P: [1, 2, 0, -3], a: 1, b: 2 }] },
      'El residuo de dividir entre $ax - b$ es $P\\left(\\tfrac ba\\right)$: el número que anula el divisor. Entre $2x - 1$ se evalúa en $\\tfrac12$ y el residuo es $0.5$; entre $2x + 1$, en $-\\tfrac12$ (residuo 5); entre $x - 2$, en 2 (residuo 13).',
      { hint: 'Busca el valor de x que hace cero al divisor completo, con su coeficiente incluido.' }));
    add7('alg-93', play('ceros-fraccion', 'Ceros que son fracciones', { rounds: [{ P: [2, -3, -3, 2], zeros: [-1, 0.5, 2] }, { P: [2, -1, -1], zeros: [-0.5, 1] }, { P: [4, 0, -1], zeros: [-0.5, 0.5] }] },
      'Un cero racional $\\tfrac pq$ tiene $p$ divisor del término independiente y $q$ divisor del coeficiente principal; por eso con 2 o 4 adelante aparecen mitades: $2x^3 - 3x^2 - 3x + 2 = (x + 1)(2x - 1)(x - 2)$.',
      { hint: 'Prueba enteros y mitades: si el primer coeficiente es 2 o 4, los ceros pueden ser medios.' }));

    add7('alg-25a', play('signo-afuera', 'Factores opuestos', { rounds: [
      { top: ['2-x'], bottom: ['x-2'], pairs: [[0, 0]], res: '-1' },
      { top: ['x+3', '5-x'], bottom: ['x-5', 'x'], pairs: [[1, 0]], res: '-\\dfrac{x+3}{x}' },
      { top: ['x-4'], bottom: ['4-x', 'x+1'], pairs: [[0, 0]], res: '-\\dfrac{1}{x+1}' },
      { top: ['3-x', 'x+2'], bottom: ['x+2', 'x-3'], pairs: [[0, 1]], res: '-1' },
    ] }, '$a - b$ y $b - a$ son opuestos: $2 - x = -(x - 2)$. Se saca el signo de uno, los factores iguales se cancelan y queda un $-1$: $\\tfrac{2 - x}{x - 2} = -1$. Un factor como $x + 3$ no tiene opuesto aquí.',
      { hint: 'Busca parejas que tengan los mismos números pero restados al revés; basta voltear uno de los dos.' }));
    add7('alg-25b', play('fraccion-compuesta', 'Simplifica la fracción compuesta', { rounds: [
      { tex: '\\dfrac{\\frac1x + \\frac12}{x + 2}', chips: ['x', '2', '2x', 'x^2'], good: 2, res: '\\dfrac{2 + x}{2x(x + 2)} = \\dfrac{1}{2x}', why: ['queda el 1/2 adentro', 'queda el 1/x adentro', '', 'queda el 1/2 adentro'] },
      { tex: '\\dfrac{1 - \\frac1x}{1 - \\frac{1}{x^2}}', chips: ['x', 'x^2', 'x - 1', '2x'], good: 1, res: '\\dfrac{x^2 - x}{x^2 - 1} = \\dfrac{x}{x + 1}', why: ['queda el 1/x² adentro', '', 'no quita ninguna fracción', 'queda el 1/x² adentro'] },
      { tex: '\\dfrac{\\frac3x}{\\frac{6}{x^2}}', chips: ['3', 'x', 'x^2', '6'], good: 2, res: '\\dfrac{3x}{6} = \\dfrac{x}{2}', why: ['quedan las dos fracciones', 'queda el 6/x² como 6/x', '', 'quedan las dos fracciones'] },
    ] }, 'Se multiplica arriba y abajo por el común denominador de las fracciones de adentro; así todas desaparecen a la vez: con $2x$, $\\tfrac{\\frac1x + \\frac12}{x + 2} = \\tfrac{2 + x}{2x(x + 2)} = \\tfrac1{2x}$.',
      { hint: 'Mira los denominadores pequeños de adentro: el multiplicador debe ser múltiplo de todos.' }));
    add7('alg-101', play('escalera-sistema', 'Tres ecuaciones en escalera', { rounds: [
      { eqs: [[1, 2, -1, -6], [0, 1, 1, 1], [0, 0, 2, 6]], sol: [1, -2, 3] },
      { eqs: [[1, -1, 3, -2], [0, 2, 1, 1], [0, 0, 1, -1]], sol: [2, 1, -1] },
      { eqs: [[1, 1, 1, -1], [0, 1, -2, -4], [0, 0, 3, 6]], sol: [-3, 0, 2] },
    ] }, 'En un sistema escalonado la última ecuación tiene una sola incógnita: $2z = 6$ da $z = 3$; con ella, $y + 3 = 1$ da $y = -2$; y con las dos, $x - 4 - 3 = -6$ da $x = 1$.',
      { hint: 'Empieza por la ecuación de abajo, que solo tiene z; cada valor hallado sirve para la de arriba.' }));
    add7('alg-102', play('parciales-repetido', 'Fracciones parciales con factor repetido', { rounds: [{ p: 1, c: 2, d: -1 }, { p: -2, c: 3, d: 5 }, { p: 3, c: 1, d: 4 }, { p: -1, c: -1, d: 3 }] },
      'Un factor al cuadrado pide dos fracciones: $\\tfrac{A}{x - p} + \\tfrac{B}{(x - p)^2}$, cuyo numerador común es $A(x - p) + B$. El coeficiente de $x$ da $A$ y el número suelto da $B$: $\\tfrac{2x - 1}{(x - 1)^2} = \\tfrac{2}{x - 1} + \\tfrac{1}{(x - 1)^2}$.',
      { hint: 'Solo A acompaña a la x: empieza por A con la barra de x y luego ajusta B con la del número.' }));

    add7('alg-71', play('cruce-potencias', 'Exponencial contra polinomio', { rounds: [{ b: 2, g: 'sq', zeros: [2, 4] }, { b: 2, g: 'lin', zeros: [1, 2] }, { b: 2, g: 'plus1', zeros: [0, 1] }] },
      '$2^x$ y $x^2$ valen lo mismo en $x = 2$ y $x = 4$; después la exponencial gana para siempre: $2^5 = 32 > 25$. Con $2x$ se cruzan en 1 y 2; con $x + 1$, en 0 y 1. Multiplicar siempre por lo mismo termina superando a cualquier polinomio.',
      { hint: 'Compara las dos tablas de valores en x = 0, 1, 2, …: busca dónde dan el mismo número.' }));
    add7('alg-13b', play('regla-del-72', 'La regla del 72', { rounds: [{ r: 8 }, { r: 12 }, { r: 9 }, { r: 24 }] },
      'Al $r\\,\\%$ compuesto el dinero se duplica en unos $72 \\div r$ periodos: al 8 % la regla dice 9 años y $1.08^9 \\approx 1.999$, así que se duplica al décimo. Al 12 %: regla 6, real 7; al 9 %: regla 8, real 9; al 24 %: regla 3, real 4.',
      { hint: 'La barra debe pasar la marca de 2 pesos; la regla del 72 te da un buen punto de partida.' }));
    add7('alg-72', play('escala-sonido', 'Los decibeles son un logaritmo', { rounds: [{ tex: '10^{3}', db: 30 }, { tex: '1\\,000\\,000', db: 60 }, { tex: '1', db: 0 }, { tex: '10^{11}', db: 110 }] },
      'El nivel en decibeles es $10 \\log \\tfrac{I}{I_0}$: diez veces el exponente de la intensidad relativa. $10^3$ da 30 dB; $1\\,000\\,000 = 10^6$ da 60; $1 = 10^0$ da 0 (el umbral); $10^{11}$ da 110. Cada 10 dB más es diez veces más intensidad.',
      { hint: 'Escribe la intensidad como potencia de 10 y multiplica su exponente por 10.' }));
    add7('alg-73', play('dos-ciudades', '¿Cuándo una ciudad alcanza a la otra?', { rounds: [
      { names: ['Villa Sol', 'Río Claro'], A: 50000, a: 2, B: 40000, b: 5 },
      { names: ['El Alto', 'La Vega'], A: 90000, a: 1, B: 60000, b: 4 },
      { names: ['Norte', 'Sur'], A: 30000, a: 3, B: 20000, b: 8 },
    ] }, 'Con tasas $a\\,\\%$ y $b\\,\\%$ se iguala $A\\left(1 + \\tfrac{a}{100}\\right)^t = B\\left(1 + \\tfrac{b}{100}\\right)^t$ y se toma logaritmo: $t = \\dfrac{\\log(A/B)}{\\log\\frac{1 + b/100}{1 + a/100}}$. Para la primera, $t \\approx 7.7$: el pueblo de abajo pasa en el año 8.',
      { hint: 'Compara las barras año tras año: la de crecimiento rápido acorta la distancia cada vez más.' }));
  }
})();
