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
    const items = [...old, ...extra.map(([lesson, review, ex]) => ({ lesson, review, ex: { ...ex, canvasGuide: true, exam: true, params: { ...ex.params, autoDemo: false } } }))];
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
})();
