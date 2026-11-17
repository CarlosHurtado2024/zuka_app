// Lección alg-0b · Tipos de conjuntos y relaciones entre ellos (mundo Teoría de Conjuntos).
// Vacío, unitario, finito e infinito, universal; subconjunto, propio, igualdad, disjuntos y conjunto de partes.
// Sin números dentro de los conjuntos (spec 2026-11-11-conjuntos-desde-cero): los ejemplos son letras y palabras.
const R = String.raw;
const POSTER = 140;
// A = letras de PLANETA; B = letras de PLATA; m (de PALMA) queda afuera
const AE = { p: [420, 690], l: [520, 630], a: [470, 800], t: [610, 740], n: [690, 920], e: [540, 980] };
const elems = (keys, o = {}) => keys.forEach(k => el(k, AE[k][0] + (o.dx || 0), AE[k][1] + (o.dy || 0), (o.st && o.st[k]) || {}));

const FILM = {
  lesson: 'alg-0b', world: 'conjuntos', key: 'D', n: [2, 3],
  title: 'Tipos de conjuntos y relaciones entre ellos',
  next: 'Operaciones entre conjuntos',
  intro: 'Hay conjuntos sin nada, con uno solo o que nunca terminan. Y hay conjuntos que caben dentro de otros.',
  examples: ['grr', 'PLANETA', 'PALMA', 'TOSE', 'aaa', 'Tierra'],
  scenes: [
    { id: 'vacio', name: 'Conjunto vacío', dur: 31,
      caps: [[0.5, 8.0, 'CONJUNTO VACÍO', 'Un conjunto sin ningún', 'elemento se llama vacío.'], [8.4, 16.0, 'SU NOTACIÓN', 'Se escribe $∅$', R`o también $\{\ \}$.`],
        [16.4, 30.4, '!CUIDADO', R`$\{∅\}$ no es vacío:`, 'tiene un elemento, el $∅$.']],
      narr: [[0.5, 8.0, 'Busquemos las vocales de la palabra grr. La g no es vocal; la r tampoco. El conjunto se queda sin nada.'],
        [8.4, 16.0, 'Un conjunto sin elementos se llama vacío. Se escribe con este símbolo, o con dos llaves sin nada adentro.'],
        [16.4, 30.4, 'Cuidado: si metemos el vacío dentro de unas llaves, ya no está vacío. Ese conjunto tiene un elemento: el vacío mismo. Es como una caja que guarda una caja vacía.']],
      ev: [[0.6, 'draw', 1.2], [3.2, 'no'], [4.6, 'no'], [6.0, 'no'], [8.8, 'rise'], [16.8, 'draw', 1], [18.6, 'pop']],
      draw(t) {
        const main = 1 - A(t, 16.0, .5), pan = A(t, 16.4, .6);
        fade(main, () => {
          circ(540, 800, 260, { k: draw(t, .6, 1.2), fill: .08 });
          fade(A(t, 1.6), () => M('E', 830, 590, 76, { pass: true }));
          [['g', 170, 560], ['r', 910, 1080], ['r', 170, 1110]].forEach(([ch, sx, sy], i) => {
            const t0 = 2.4 + i * 1.4; if (t < t0) return;
            const k = seg(t, t0, t0 + 1.1), ang = Math.atan2(sy - 800, sx - 540), ex = 540 + Math.cos(ang) * 290, ey = 800 + Math.sin(ang) * 290;
            const x = k < .5 ? lerp(sx, ex, eio(k * 2)) : lerp(ex, sx * .9 + 54, eo((k - .5) * 2)), y = k < .5 ? lerp(sy, ey, eio(k * 2)) : lerp(ey, sy, eo((k - .5) * 2));
            if (k > .42 && k < .75) stroke(P.no, 6 * (1 - (k - .42) / .33), () => X.arc(540, 800, 262, ang - .35, ang + .35));
            el(ch, x, y, { c: k > .5 ? P.no : P.ink });
          });
          fade(A(t, 1.2), () => M(R`E = \{x : x es una vocal de «grr»\}`, 540, 1390, 52));
          fade(A(t, 8.6), () => M(R`E = \hl{\{\ \}} = \hl{∅}`, 540, 1560, 96, { id: 'vac' }), (1 - A(t, 8.6)) * 18);
        });
        fade(pan, () => {
          circ(300, 790, 190, { k: draw(t, 16.6, .8) }); circ(780, 790, 190, { k: draw(t, 16.8, .8) });
          circ(780, 790, 72, { k: draw(t, 18.4, .6), c: P.ac, fill: .12 });
          M('∅', 300, 1080, 72, { id: 'v1' }); M(R`\{∅\}`, 780, 1080, 72, { id: 'v2' });
          fade(A(t, 19.6), () => { label('no tiene nada', 300, 1160, P.mute); label('guarda una caja vacía', 780, 1160, P.mute); });
          fade(A(t, 21.6), () => { M('n(∅) = 0', 300, 1390, 64, { id: 'n0' }); M(R`n(\{∅\}) = \hl{1}`, 780, 1390, 64, { id: 'n1' }); });
          fade(A(t, 24.0), () => M(R`\{∅\} \no{≠} ∅`, 540, 1620, 100, { id: 'neq' }), (1 - A(t, 24.0)) * 18);
        }, (1 - pan) * 20);
      } },
    { id: 'unitario', name: 'Conjunto unitario', dur: 21,
      caps: [[0.5, 9.0, 'UNITARIO', 'Un conjunto con un solo', 'elemento se llama unitario.'], [9.4, 20.4, 'SU CARDINAL', '$n(L) = 1$: la Tierra', 'tiene una sola luna.']],
      narr: [[0.5, 9.0, 'Ahora el conjunto de las lunas de la Tierra. Solo hay una. Un conjunto con un único elemento se llama unitario.'],
        [9.4, 20.4, 'Por extensión se escribe con llaves y ese único elemento adentro. Su cardinal es uno.']],
      ev: [[0.6, 'draw', 1.0], [2.4, 'pop'], [9.6, 'rise'], [13.0, 'card']],
      draw(t) {
        circ(540, 790, 240, { k: draw(t, .6, 1.0), fill: .08 }); fade(A(t, 1.2), () => M('L', 820, 600, 76, { pass: true }));
        fade(A(t, 2.4), () => { circ(540, 790, 120, { c: hexA(P.ink, .35), w: 3, dash: [10, 12] }); });
        const an = t * .35; el('Luna', 540 + Math.cos(an) * 120 - 40, 790 + Math.sin(an) * 120, { a: A(t, 2.4), c: P.ac, ping: ping(t, 2.4) });
        fade(A(t, 2.0), () => { X.beginPath(); X.arc(540, 790, 46, 0, 7); X.fillStyle = hexA(P.ink, .15); X.fill(); stroke(P.ink, 4, () => X.arc(540, 790, 46, 0, 7)); label('Tierra', 540, 870, P.mute, { s: 32, pass: true }); });
        fade(A(t, 1.0), () => M(R`L = \{x : x es una luna de la Tierra\}`, 540, 1380, 46));
        fade(A(t, 9.8), () => M(R`L = \{\hl{Luna}\}`, 540, 1530, 88, { id: 'L' }), (1 - A(t, 9.8)) * 18);
        fade(A(t, 13.0), () => M(R`n(L) = \hl{1}`, 540, 1690, 72, { id: 'nL' }));
      } },
    { id: 'finito', name: 'Finito e infinito', dur: 27,
      caps: [[0.5, 9.0, 'FINITO', 'Se pueden contar todos', 'sus elementos y se termina.'], [9.4, 18.0, 'INFINITO', 'Por más que se cuente,', 'siempre falta otro.'],
        [18.4, 26.4, 'LOS PUNTOS «…»', 'Dicen que la lista', 'sigue sin terminar.']],
      narr: [[0.5, 9.0, 'Las letras de la palabra mar son tres: m, a y r. Se cuentan y la cuenta se acaba. Es un conjunto finito.'],
        [9.4, 18.0, 'Ahora las palabras que se escriben solo con la letra a: a, a a, a a a… Siempre se puede agregar una a más. Es infinito.'],
        [18.4, 26.4, 'Como no se pueden escribir todas, se ponen unas cuantas y tres puntos. Los puntos dicen: la lista sigue.']],
      ev: [[0.6, 'draw', 1.0], [2.6, 'count', 0], [3.4, 'count', 1], [4.2, 'count', 2], [5.2, 'card'], [9.8, 'pops', 6], [18.8, 'rise']],
      draw(t) {
        circ(290, 690, 170, { k: draw(t, .6, 1.0), fill: .08 }); fade(A(t, 1.2), () => M('M', 470, 560, 70, { pass: true }));
        [['m', 230, 640], ['a', 330, 610], ['r', 270, 750]].forEach(([c, x, y], i) => { el(c, x, y, { a: A(t, 1.2 + i * .15), c: t > 2.6 + i * .8 ? P.ac : P.ink, ping: ping(t, 2.6 + i * .8) }); fade(A(t, 2.6 + i * .8, .3), () => T(String(i + 1), x - 40, y + 50, { s: 38, w: 600, c: P.ac, a: 'c', pass: true })); });
        fade(A(t, 5.2), () => { label('finito', 760, 640, P.ac, { s: 46 }); M(R`n(M) = 3`, 760, 740, 64, { id: 'nM' }); });
        // la fila que nunca se acaba: corre a la izquierda y por la derecha siguen llegando palabras
        fade(A(t, 9.4), () => {
          const off = Math.max(0, (t - 13.5) * 70); X.save(); X.beginPath(); X.rect(80, 920, 920, 200); X.clip();
          let x = 120 - off;
          for (let k = 1; k <= 22; k++) { const w = mWidth('a'.repeat(k), 54) + 70, tk = 9.8 + (k - 1) * .45; if (t > tk && x > -400 && x < 1100) fade(A(t, tk, .3), () => { dot(x + 4, 1040, { r: 8, c: hexA(P.ink, .8) }); M('a'.repeat(k), x + 24, 1030, 54, { a: 'l', pass: true }); }); x += w; }
          X.restore();
          label('infinito', 760, 900, P.ac, { s: 46 });
        });
        fade(A(t, 1.6), () => M(R`M = \{m, a, r\}`, 540, 1390, 66, { id: 'Mext' }));
        fade(A(t, 18.6), () => M(R`S = \{a, aa, aaa, aaaa, \hl{…}\}`, 540, 1560, 66, { id: 'Sext' }), (1 - A(t, 18.6)) * 18);
      } },
    { id: 'universal', name: 'Conjunto universal', dur: 27,
      caps: [[0.5, 9.0, 'UNIVERSAL', 'Reúne todo lo que se', 'está estudiando: $U$.'], [9.4, 17.0, 'EN EL DIAGRAMA', '$U$ es el rectángulo:', 'los demás van adentro.'],
        [17.4, 26.4, 'DEPENDE DEL TEMA', 'Si se habla de letras,', '$U$ es el abecedario.']],
      narr: [[0.5, 9.0, 'Cuando se habla de letras, todas las letras forman el fondo de la conversación. Ese conjunto se llama universal y se escribe U.'],
        [9.4, 17.0, 'En el diagrama de Venn, el universal es el rectángulo. Los demás conjuntos se dibujan adentro.'],
        [17.4, 26.4, 'El universal cambia con el tema. Hoy son las letras; mañana pueden ser los colores, las ciudades o las personas de un salón.']],
      ev: [[0.6, 'pops', 8], [9.6, 'draw', 1.2], [11.2, 'draw', 1.0]],
      draw(t) {
        rect(100, 450, 880, 840, { r: 26, k: draw(t, 9.6, 1.2), w: 7 });
        fade(A(t, 10.4), () => M('U', 150, 530, 70, { a: 'l', pass: true }));
        const pts = []; for (let r = 0; r < 6; r++) for (let j = 0; j < 7; j++) { const x = 170 + j * 125, y = 560 + r * 130; if (Math.hypot(x - 545, y - 885) > 215) pts.push([x, y]); }
        const cons = 'bcdfghjklmnñpqrstvwxyz'.split('');
        cons.forEach((c, i) => { const [x, y] = pts[Math.floor(i * pts.length / cons.length)]; fade(A(t, .6 + i * .12, .3), () => { dot(x, y, { r: 7, c: hexA(P.ink, .75) }); M(c, x + 22, y - 8, 42, { a: 'l', c: hexA(P.ink, .85), pass: true }); }); });
        circ(545, 885, 175, { k: draw(t, 11.2, 1.0), fill: .1 }); fade(A(t, 12), () => M('V', 760, 760, 56, { pass: true }));
        [['a', 480, 830], ['e', 590, 820], ['i', 530, 900], ['o', 470, 960], ['u', 600, 950]].forEach(([c, x, y], i) => fade(A(t, .9 + i * .12, .3), () => { dot(x, y, { r: 7, c: P.ac }); M(c, x + 22, y - 8, 44, { a: 'l', c: P.ac, pass: true }); }));
        fade(A(t, 1.4), () => M(R`U = \{a, b, c, d, …, z\}`, 540, 1420, 64, { id: 'U' }));
        fade(A(t, 12.0), () => M(R`V = \{a, e, i, o, u\}`, 540, 1560, 64, { id: 'V' }));
        fade(A(t, 17.8), () => label('U cambia con el tema de la conversación', 540, 1680, P.mute));
      } },
    { id: 'sub', name: 'Subconjunto', dur: 46,
      caps: [[0.5, 9.0, 'SUBCONJUNTO', 'Todo elemento de $B$', 'también está en $A$.'], [9.4, 17.0, 'CÓMO SE LEE', '$B ⊆ A$: «$B$ es subconjunto', 'de $A$» o «está contenido».'],
        [17.4, 26.0, 'EN EL DIAGRAMA', 'El círculo de $B$ queda', 'dentro del de $A$.'], [26.4, 36.0, '!NO ES SUBCONJUNTO', 'Basta un elemento afuera:', '$m ∉ A$, así que $C ⊄ A$.'],
        [36.4, 45.4, 'SE LEE', '$C ⊄ A$: «$C$ no es', 'subconjunto de $A$».']],
      narr: [[0.5, 9.0, 'A son las letras de planeta. B, las letras de plata. Revisemos B letra por letra: p está en A, l también, a también, t también.'],
        [9.4, 17.0, 'Si todo elemento de B está en A, B es subconjunto de A, o B está contenido en A. Se escribe así.'],
        [17.4, 26.0, 'En el diagrama se ve enseguida: el círculo de B cabe completo dentro del círculo de A.'],
        [26.4, 36.0, 'Ahora C, las letras de palma. La p, la a y la l están en A, pero la m no. Con un solo elemento afuera ya no es subconjunto.'],
        [36.4, 45.4, 'Se escribe con el mismo símbolo tachado y se lee: C no es subconjunto de A.']],
      ev: [[0.6, 'draw', 1.2], [2.6, 'yes'], [3.6, 'yes'], [4.6, 'yes'], [5.6, 'yes'], [9.8, 'card'], [17.8, 'draw', 1.0], [27.2, 'pops', 3], [30.6, 'no'], [36.8, 'rise']],
      draw(t) {
        circ(540, 800, 310, { k: draw(t, .6, 1.2), fill: .06 }); fade(A(t, 1.4), () => M('A', 850, 560, 76, { pass: true }));
        const bOrder = ['p', 'l', 'a', 't'], ph = t > 26.4;
        const st = {};
        if (!ph) bOrder.forEach((k, i) => { const ti = 2.6 + i * 1.0; if (t > ti) st[k] = { c: P.ac, ping: ping(t, ti) }; });
        else ['p', 'a', 'l'].forEach((k, i) => { const ti = 27.2 + i * .9; if (t > ti) st[k] = { c: P.ac, ping: ping(t, ti) }; });
        elems(Object.keys(AE), { st });
        if (!ph) circ(505, 725, 150, { k: draw(t, 17.8, 1.0), c: P.ac, w: 6, fill: .12 });
        fade(A(t, 18.4) * (1 - A(t, 26.0)), () => M('B', 360, 600, 62, { c: P.ac, pass: true }));
        if (ph) { const k = A(t, 29.8); el('m', lerp(1040, 930, k), 600, { a: k, c: P.no, ping: ping(t, 30.6), pc: P.no }); fade(A(t, 30.6), () => { stroke(P.no, 4, () => X.arc(540, 800, 312, -.75, -.2), { dash: [10, 10] }); label('afuera de A', 930, 690, P.no, { s: 34 }); }); }
        const lineB = 1 - A(t, 26.2);
        fade(A(t, 1.0), () => M(R`A = \{p, l, a, n, e, t\}`, 540, 1370, 56, { id: 'A' }));
        fade(A(t, 1.6) * lineB, () => M(R`B = \{p, l, a, t\}`, 540, 1470, 56, { id: 'B' }));
        fade(A(t, 9.8) * lineB, () => M(R`B \hl{⊆} A`, 540, 1640, 110, { id: 'BA' }), (1 - A(t, 9.8)) * 18);
        fade(A(t, 26.8), () => M(R`C = \{p, a, l, \no{m}\}`, 540, 1470, 56, { id: 'C' }));
        fade(A(t, 31.2), () => M(R`C \no{⊄} A`, 540, 1640, 110, { id: 'CA' }), (1 - A(t, 31.2)) * 18);
      } },
    { id: 'propios', name: 'Subconjuntos especiales', dur: 34,
      caps: [[0.5, 9.0, 'TODO CONJUNTO', 'es subconjunto de sí', 'mismo: $A ⊆ A$.'], [9.4, 20.0, 'EL VACÍO', '$∅ ⊆ A$, siempre:', 'no tiene nada que falle.'],
        [20.4, 33.4, 'SUBCONJUNTO PROPIO', '$B ⊂ A$: $B ⊆ A$ y $B ≠ A$.', 'A $A$ le sobra algo.']],
      narr: [[0.5, 9.0, 'Primero, todo conjunto es subconjunto de sí mismo: cada elemento de A está, claro, en A.'],
        [9.4, 20.0, 'Segundo, el vacío es subconjunto de cualquier conjunto. Para no serlo tendría que tener un elemento afuera, y no tiene ninguno.'],
        [20.4, 33.4, 'Y cuando B está dentro de A pero no es todo A, se llama subconjunto propio y se escribe con este símbolo. A A le sobran elementos: aquí la n y la e.']],
      ev: [[0.8, 'draw', 1.2], [9.8, 'pop'], [21.0, 'draw', 1.0], [24.0, 'pops', 2]],
      draw(t) {
        circ(540, 800, 310, { fill: .06 }); M('A', 850, 560, 76, { pass: true });
        const st = {}; if (t > 23.8) { st.n = { c: P.ac, ping: ping(t, 24.0) }; st.e = { c: P.ac, ping: ping(t, 24.3) }; }
        elems(Object.keys(AE), { st });
        fade(win(t, .8, 9.2), () => circ(540, 800, 326, { k: draw(t, .8, 1.2), c: P.ac, w: 4, dash: [16, 14] }));
        fade(A(t, 9.8), () => { circ(800, 1000, 52, { c: P.ac, w: 5, fill: .12, k: draw(t, 9.8, .6) }); M('∅', 800, 1112, 50, { c: P.ac, pass: true }); });
        if (t > 20.4) circ(505, 725, 150, { k: draw(t, 21.0, 1.0), c: P.ac, w: 6, fill: .12 });
        fade(A(t, 21.6), () => M('B', 360, 600, 62, { c: P.ac, pass: true }));
        fade(A(t, 24.4), () => label('le sobran n y e', 760, 1080, P.ac, { s: 34 }));
        fade(A(t, 1.6) * (1 - A(t, 20.2)), () => M(R`A \hl{⊆} A`, 540, 1440, 92, { id: 'AA' }));
        fade(A(t, 10.4) * (1 - A(t, 20.2)), () => M(R`∅ \hl{⊆} A`, 540, 1620, 92, { id: 'vA' }));
        fade(A(t, 21.4), () => M(R`B \hl{⊂} A`, 540, 1440, 110, { id: 'BpA' }), (1 - A(t, 21.4)) * 18);
        fade(A(t, 22.6), () => M(R`B ⊆ A \quad \t{y} \quad B ≠ A`, 540, 1600, 62, { id: 'cond' }));
      } },
    { id: 'igual', name: 'Conjuntos iguales', dur: 31,
      caps: [[0.5, 10.0, 'EJEMPLO', 'Las letras de ESTO', 'y las letras de TOSE.'], [10.4, 20.0, 'CADA UNO EN EL OTRO', '$A ⊆ B$ y también', '$B ⊆ A$.'],
        [20.4, 30.4, 'IGUALDAD', 'Entonces $A = B$:', 'son el mismo conjunto.']],
      narr: [[0.5, 10.0, 'A son las letras de esto; B, las letras de tose. Las palabras son distintas, pero miremos sus letras.'],
        [10.4, 20.0, 'Cada letra de A está en B, y cada letra de B está en A. Cada conjunto es subconjunto del otro.'],
        [20.4, 30.4, 'Cuando pasa eso, los dos conjuntos son iguales. Tienen los mismos elementos: son un solo conjunto con dos nombres.']],
      ev: [[0.6, 'draw', 1.0], [1.0, 'draw', 1.0], [10.8, 'fly', 2.0], [15.0, 'fly', 2.0], [21.0, 'shuffle', 1.8], [22.8, 'card']],
      draw(t) {
        const m = eio(seg(t, 21.0, 22.8)), xa = lerp(300, 540, m), xb = lerp(780, 540, m);
        circ(xa, 790, 200, { k: draw(t, .6, 1.0), fill: .07 }); circ(xb, 790, 200, { k: draw(t, 1.0, 1.0), fill: .07, c: m > .98 ? P.ac : P.ink });
        fade(1 - m, () => { M('A', xa - 210, 590, 64, { pass: true }); M('B', xb + 210, 590, 64, { pass: true }); });
        fade(m, () => M('A = B', 820, 560, 64, { c: P.ac, pass: true }));
        const pos = { e: [-90, -60], s: [40, -90], t: [-40, 40], o: [70, 50] };
        const ord = ['e', 's', 't', 'o'];
        ord.forEach((c, i) => { const [dx, dy] = pos[c]; el(c, xa + dx, 790 + dy, { a: A(t, 1.2 + i * .15) * (1 - m * .999), c: t > 10.8 && t < 20.4 ? P.ac : P.ink }); el(c, xb + dx * (1 - m) - dy * .4 * (1 - m) + dx * m, 790 + dy, { a: A(t, 1.6 + i * .15), c: m > .5 ? P.ac : P.ink }); });
        if (t > 10.6 && t < 20.4) ord.forEach((c, i) => { const [dx, dy] = pos[c], k1 = draw(t, 10.8 + i * .4, .6), k2 = draw(t, 15.0 + i * .4, .6); const ya = 790 + dy;
          fade(1 - seg(t, 19.6, 20.2), () => { if (k1 > 0) arrow(xa + dx + 70, ya - 40, xb + dx * 1 - dy * .4 - 10, ya - 50, { k: k1, c: P.ac, w: 3, h: 16 }); if (k2 > 0) arrow(xb + dx - dy * .4 + 10, ya + 22, xa + dx + 70, ya + 20, { k: k2, c: hexA(P.ac, .6), w: 3, h: 16 }); }); });
        fade(A(t, 1.0), () => M(R`A = \{e, s, t, o\}`, 540, 1380, 60, { id: 'A' }));
        fade(A(t, 1.4), () => M(R`B = \{t, o, s, e\}`, 540, 1480, 60, { id: 'B' }));
        fade(A(t, 11.0), () => M(R`A ⊆ B \quad \t{y} \quad B ⊆ A`, 540, 1620, 66, { id: 'dos' }));
        fade(A(t, 22.8), () => M(R`\hl{A = B}`, 540, 1760, 90, { id: 'eq' }), (1 - A(t, 22.8)) * 14);
      } },
    { id: 'disjuntos', name: 'Conjuntos disjuntos', dur: 27,
      caps: [[0.5, 9.0, 'DISJUNTOS', 'Dos conjuntos son disjuntos', 'si no comparten elementos.'], [9.4, 17.0, 'EJEMPLO', 'Vocales y consonantes:', 'ninguna letra es las dos.'],
        [17.4, 26.4, 'EN EL DIAGRAMA', 'Dos círculos separados,', 'sin zona común.']],
      narr: [[0.5, 9.0, 'Hay conjuntos que no tienen nada en común. Se llaman disjuntos.'],
        [9.4, 17.0, 'Las vocales y las consonantes, por ejemplo. Ninguna letra es vocal y consonante a la vez.'],
        [17.4, 26.4, 'En el diagrama, sus círculos se dibujan separados: no hay un solo elemento que pueda ir en medio.']],
      ev: [[0.6, 'draw', 1.0], [1.0, 'draw', 1.0], [10.0, 'pops', 5], [17.8, 'doubt']],
      draw(t) {
        circ(300, 790, 205, { k: draw(t, .6, 1.0), fill: .08 }); circ(780, 790, 205, { k: draw(t, 1.0, 1.0), fill: .08 });
        fade(A(t, 1.6), () => { M('V', 110, 580, 64, { pass: true }); M('C', 970, 580, 64, { pass: true }); });
        [['a', 240, 720], ['e', 340, 700], ['i', 290, 800], ['o', 230, 880], ['u', 350, 870]].forEach(([c, x, y], i) => el(c, x, y, { a: A(t, 1.4 + i * .1), s: 54 }));
        [['b', 720, 720], ['c', 820, 700], ['d', 770, 800], ['f', 710, 880], ['g', 830, 870]].forEach(([c, x, y], i) => el(c, x, y, { a: A(t, 1.8 + i * .1), s: 54 }));
        fade(A(t, 17.6), () => { stroke(P.ac, 3, () => { X.moveTo(540, 600); X.lineTo(540, 980); }, { dash: [10, 12] }); label('nada en común', 540, 1060, P.ac, { s: 38 }); });
        fade(A(t, 1.2), () => M(R`V = \{a, e, i, o, u\}`, 540, 1380, 60, { id: 'V' }));
        fade(A(t, 1.6), () => M(R`C = \{b, c, d, f, g, …\}`, 540, 1480, 60, { id: 'C' }));
        fade(A(t, 9.8), () => label('V y C son disjuntos', 540, 1640, P.ink, { s: 54 }), (1 - A(t, 9.8)) * 16);
      } },
    { id: 'partes', name: 'Conjunto de partes', dur: 47,
      caps: [[0.5, 9.0, 'CONJUNTO DE PARTES', '$P(A)$ reúne todos los', 'subconjuntos de $A$.'], [9.4, 20.0, 'CÓMO SE ARMAN', 'Cada elemento entra', 'o no entra: dos opciones.'],
        [20.4, 30.0, 'LA CUENTA', 'Tres elementos:', '$2 · 2 · 2 = 2^{3} = 8$.'], [30.4, 38.0, 'LA REGLA', 'Si $A$ tiene $n$ elementos,', '$P(A)$ tiene $2^{n}$.'],
        [38.4, 46.4, '!OJO', '$∅$ y $A$ también', 'son subconjuntos de $A$.']],
      narr: [[0.5, 9.0, 'Tomemos A con tres letras: m, n y p. Vamos a armar todos sus subconjuntos. Juntarlos todos forma el conjunto de partes de A.'],
        [9.4, 20.0, 'Para armar un subconjunto, se decide letra por letra: la m entra o no entra; la n entra o no; la p entra o no.'],
        [20.4, 30.0, 'Cada decisión duplica los caminos: dos, cuatro, ocho. Por eso hay dos por dos por dos, ocho subconjuntos.'],
        [30.4, 38.0, 'En general, si A tiene n elementos, su conjunto de partes tiene dos a la n.'],
        [38.4, 46.4, 'Y en la lista están los dos extremos: el vacío, cuando ninguna entra, y A completo, cuando entran todas.']],
      ev: [[1.0, 'pops', 3], [9.8, 'draw', .8], [12.8, 'draw', .8], [15.8, 'draw', .8], [20.8, 'count', 0], [21.6, 'count', 1], [22.4, 'count', 2], [23.6, 'card'], [38.8, 'yes']],
      draw(t) {
        const lv = [[540], [300, 780], [180, 420, 660, 900], [120, 240, 360, 480, 600, 720, 840, 960]], ys = [500, 640, 780, 920], lt = ['m', 'n', 'p'];
        fade(A(t, 1.0), () => dot(540, ys[0], { r: 13, c: P.ac }));
        for (let d = 0; d < 3; d++) {
          const k = draw(t, 9.8 + d * 3, .8);
          lv[d].forEach((x, i) => { [0, 1].forEach(b => { const x2 = lv[d + 1][i * 2 + b]; line(x, ys[d], x2, ys[d + 1], { k, w: b ? 3 : 5, c: b ? hexA(P.ink, .5) : P.ink, dash: b ? [8, 10] : null }); }); });
          fade(k, () => { M(lt[d], 60, ys[d] + 80, 46, { a: 'l', c: P.ac, pass: true }); if (d === 0) { label('entra', 380, 560, P.mute, { s: 30 }); label('no entra', 720, 560, P.mute, { s: 30 }); } });
          fade(k, () => lv[d + 1].forEach(x => dot(x, ys[d + 1], { r: d === 2 ? 11 : 8 })));
        }
        const subs = [R`\{m, n, p\}`, R`\{m, n\}`, R`\{m, p\}`, R`\{m\}`, R`\{n, p\}`, R`\{n\}`, R`\{p\}`, '∅'];
        subs.forEach((s, i) => { const x = lv[3][i], tk = 16.6 + i * .25, hi = (i === 0 || i === 7) && t > 38.6; fade(A(t, tk, .35), () => M(s, x, i % 2 ? 1060 : 1000, 34, { c: hi ? P.ac : P.ink, pass: true })); if (hi) circ(x, (i % 2 ? 1060 : 1000) - 12, 58, { c: P.ac, w: 4, k: draw(t, 38.8, .6) }); });
        fade(A(t, 1.0), () => M(R`A = \{m, n, p\}`, 540, 1250, 60, { id: 'A' }));
        fade(A(t, 18.6), () => { M(R`P(A) = \{∅, \{m\}, \{n\}, \{p\}, \{m, n\},`, 540, 1380, 46, { id: 'P1' }); M(R`\{m, p\}, \{n, p\}, \{m, n, p\}\}`, 540, 1460, 46, { id: 'P2' }); });
        fade(A(t, 23.6), () => M(R`n(P(A)) = 2 · 2 · 2 = 2^{3} = \hl{8}`, 540, 1620, 60, { id: 'cnt' }), (1 - A(t, 23.6)) * 14);
        fade(A(t, 30.8), () => M(R`n(A) = n \quad ⇒ \quad n(P(A)) = \hl{2^{n}}`, 540, 1760, 56, { id: 'reg' }));
      } },
  ],
  sum: [['Vacío', R`∅ = \{\ \}`], ['Unitario', R`L = \{Luna\}`], ['Finito e infinito', R`\{m, a, r\} \quad \{a, aa, aaa, …\}`], ['Universal', R`U = \{a, b, c, …, z\}`],
    ['Subconjunto', R`B ⊆ A \qquad C ⊄ A`], ['Iguales', R`A = B \quad \t{si} \quad A ⊆ B \t{ y } B ⊆ A`], ['Conjunto de partes', R`n(P(A)) = 2^{n}`]],
  end: ['Ya sabes comparar conjuntos.', 'Ahora, a operar con ellos.'],
  finNarr: [[0.8, 11.8, 'En resumen: vacío, unitario, finito, infinito y universal. Un conjunto es subconjunto de otro si todos sus elementos están en el otro.'],
    [12.0, 19.0, 'Iguales, si cada uno está en el otro. Y el conjunto de partes tiene dos a la n elementos.']],
};
