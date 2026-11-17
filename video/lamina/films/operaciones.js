// Lección alg-0c · Operaciones entre conjuntos (mundo Teoría de Conjuntos).
// Unión, intersección, diferencia, complemento, diferencia simétrica, cómo se cuenta una unión, leyes de De Morgan y tres conjuntos.
const R = String.raw;
const POSTER = 70;
const UR = [110, 460, 860, 780], CA = [430, 850, 235], CB = [650, 850, 235];
const E2 = { a: [290, 790], b: [320, 940], c: [520, 790], d: [535, 915], e: [770, 860], f: [190, 1170], g: [900, 550] };
const inA = k => 'abcd'.includes(k), inB = k => 'cde'.includes(k);
// el diagrama de siempre; fill = [pred, t0] pinta esas zonas; hl(k) = elementos del resultado
function venn2(t, o = {}) {
  rect(...UR, { r: 24, w: 6, k: o.kU ?? 1 }); fade(o.kU ?? 1, () => M('U', 150, 545, 64, { a: 'l', pass: true }));
  if (o.fill) vennFill([CA, CB], o.fill[0], draw(t, o.fill[1], 1.3), { bounds: UR, c: o.fc });
  circ(...CA, { k: o.kA ?? 1 }); circ(...CB, { k: o.kB ?? 1 });
  fade(o.kA ?? 1, () => M('A', 250, 640, 66, { pass: true })); fade(o.kB ?? 1, () => M('B', 840, 640, 66, { pass: true }));
  for (const k in E2) { const on = o.hl && o.hl(k) && t > (o.hlT ?? 0); el(k, E2[k][0], E2[k][1], { a: o.ke ? o.ke(k) : 1, c: on ? P.ac : (o.dim && o.dim(k) ? hexA(P.ink, .45) : P.ink), ping: on ? ping(t, o.hlT ?? 0) : 0, s: 54 }); }
}
const rows = (t, list) => list.forEach(([src, t0, y, s, id]) => fade(A(t, t0), () => M(src, 540, y, s || 58, { id }), (1 - A(t, t0)) * 14));

const FILM = {
  lesson: 'alg-0c', world: 'conjuntos', key: 'D', n: [3, 3],
  title: 'Operaciones entre conjuntos',
  next: 'Los números naturales y los enteros',
  intro: 'Con dos conjuntos se pueden armar otros: juntarlos, quedarse con lo común o quitar una parte. Cada operación es una zona del dibujo.',
  examples: ['inglés', 'francés', 'a, b, c, d, e, f, g'],
  scenes: [
    { id: 'venn', name: 'Universo y zonas', dur: 26,
      caps: [[0.5, 9.0, 'EL DIBUJO', 'Dentro del universo $U$,', 'los círculos $A$ y $B$.'], [9.4, 17.0, 'CUATRO ZONAS', 'Solo en $A$, en los dos,', 'solo en $B$ y en ninguno.'],
        [17.4, 25.4, 'LA IDEA', 'Cada operación pinta', 'unas zonas del dibujo.']],
      narr: [[0.5, 9.0, 'El universo son las letras de la a a la g. A tiene a, b, c, d, y B tiene c, d, e.'],
        [9.4, 17.0, 'Los círculos parten el rectángulo en cuatro zonas: solo en A, en los dos, solo en B, y en ninguno.'],
        [17.4, 25.4, 'Cada operación entre conjuntos es pintar algunas de esas zonas y leer qué elementos quedaron pintados.']],
      ev: [[0.6, 'draw', 1.2], [1.6, 'draw', 1.0], [2.2, 'draw', 1.0], [3.0, 'pops', 7], [9.8, 'tag'], [11.2, 'tag'], [12.6, 'tag'], [14.0, 'tag']],
      draw(t) {
        venn2(t, { kU: draw(t, .6, 1.2), kA: draw(t, 1.6, 1.0), kB: draw(t, 2.2, 1.0), ke: k => A(t, 3.0 + 'abcdefg'.indexOf(k) * .15, .3) });
        const zs = [[a => a, (x, y) => x && !y, 9.8, 'solo A', 300, 1060], [0, (x, y) => x && y, 11.2, 'los dos', 540, 1035], [0, (x, y) => !x && y, 12.6, 'solo B', 780, 1060], [0, (x, y) => !x && !y, 14.0, 'ninguno', 830, 1180]];
        zs.forEach(([, pr, t0, lab, lx, ly]) => { const w = win(t, t0, t0 + 3.2, .3); if (w > 0) fade(w, () => vennFill([CA, CB], pr, 1, { bounds: UR, a: .3 })); fade(A(t, t0, .3), () => label(lab, lx, ly, P.ac, { s: 34, pass: true })); });
        rows(t, [[R`U = \{a, b, c, d, e, f, g\}`, 1.0, 1390], [R`A = \{a, b, c, d\} \qquad B = \{c, d, e\}`, 3.0, 1510]]);
      } },
    { id: 'union', name: 'Unión', dur: 33,
      caps: [[0.5, 9.0, 'UNIÓN', '$A ∪ B$: lo que está en $A$', 'o en $B$.'], [9.4, 18.0, 'LA «O» INCLUYE', 'Lo que está en los dos', 'también entra, una vez.'],
        [18.4, 32.4, 'CÓMO SE LEE', '$A ∪ B$: «$A$ unión $B$».', 'Junta los dos conjuntos.']],
      narr: [[0.5, 9.0, 'La unión junta los dos conjuntos: entra todo lo que está en A o en B. Se pintan los dos círculos completos.'],
        [9.4, 18.0, 'Esa «o» incluye a los que están en los dos. La c y la d entran, pero se escriben una sola vez.'],
        [18.4, 32.4, 'Se escribe con este símbolo, parecido a una u, y se lee A unión B. El resultado es a, b, c, d, e.']],
      ev: [[0.8, 'draw', 1.3], [2.4, 'pops', 5], [10.0, 'pops', 2], [19.0, 'rise'], [24.0, 'card']],
      draw(t) {
        venn2(t, { fill: [(a, b) => a || b, .8], hl: k => inA(k) || inB(k), hlT: 2.4 });
        fade(win(t, 9.8, 18.2), () => { circ(...E2.c.map((v, i) => v + [-4, -14][i]), 56, { c: P.ac, w: 4 }); circ(E2.d[0] - 4, E2.d[1] - 14, 56, { c: P.ac, w: 4 }); });
        rows(t, [[R`A ∪ B = \{x : x ∈ A \t{ o } x ∈ B\}`, 1.0, 1390, 52, 'def'], [R`A ∪ B = \{a, b, \hl{c, d}, e\}`, 10.4, 1530, 66, 'res'], [R`A \hl{∪} B`, 18.8, 1700, 110, 'sym']]);
      } },
    { id: 'inter', name: 'Intersección', dur: 31,
      caps: [[0.5, 9.0, 'INTERSECCIÓN', '$A ∩ B$: lo que está en $A$', 'y también en $B$.'], [9.4, 18.0, 'CÓMO SE LEE', '$A ∩ B$: «$A$ intersección $B$».', 'Solo lo común.'],
        [18.4, 30.4, 'SI NO HAY NADA COMÚN', '$A ∩ B = ∅$: los conjuntos', 'son disjuntos.']],
      narr: [[0.5, 9.0, 'La intersección se queda solo con lo común: lo que está en A y también en B. Se pinta la zona donde los círculos se cruzan.'],
        [9.4, 18.0, 'Se escribe con una u al revés y se lee A intersección B. Aquí da c y d.'],
        [18.4, 30.4, 'Si dos conjuntos no tienen nada en común, su intersección es el vacío. Eso es justo ser disjuntos.']],
      ev: [[0.8, 'draw', 1.3], [2.4, 'pops', 2], [9.8, 'card'], [19.0, 'shuffle', 1.6], [21.0, 'no']],
      draw(t) {
        const sep = eio(seg(t, 19.0, 20.6)), dx = 150 * sep;
        const ca = [CA[0] - dx, CA[1], CA[2] - 50 * sep], cb = [CB[0] + dx, CB[1], CB[2] - 50 * sep];
        fade(1 - sep, () => venn2(t, { fill: [(a, b) => a && b, .8], hl: k => inA(k) && inB(k), hlT: 2.4 }));
        if (sep > 0) fade(sep, () => { rect(...UR, { r: 24, w: 6 }); M('U', 150, 545, 64, { a: 'l', pass: true }); circ(...ca); circ(...cb); M('C', 180, 640, 62, { pass: true }); M('D', 900, 640, 62, { pass: true }); label('nada común', 540, 860, P.no, { s: 38 }); });
        rows(t, [[R`A ∩ B = \{x : x ∈ A \t{ y } x ∈ B\}`, 1.0, 1390, 52, 'def']]);
        fade(A(t, 9.8) * (1 - A(t, 18.6)), () => M(R`A \hl{∩} B = \{c, d\}`, 540, 1580, 96, { id: 'res' }), (1 - A(t, 9.8)) * 14);
        fade(A(t, 21.0), () => M(R`C ∩ D = \no{∅}`, 540, 1580, 96, { id: 'vac' }), (1 - A(t, 21.0)) * 14);
      } },
    { id: 'dif', name: 'Diferencia', dur: 33,
      caps: [[0.5, 9.0, 'DIFERENCIA', '$A − B$: lo que está en $A$', 'pero no en $B$.'], [9.4, 18.0, 'CÓMO SE LEE', '«$A$ menos $B$»: a $A$', 'se le quita lo de $B$.'],
        [18.4, 32.4, '!EL ORDEN IMPORTA', R`$B − A = \{e\}$, distinto`, R`de $A − B = \{a, b\}$.`]],
      narr: [[0.5, 9.0, 'La diferencia A menos B toma lo que está en A pero no está en B. Se pinta el círculo A sin la parte común.'],
        [9.4, 18.0, 'A A se le quitan los elementos que comparte con B. Quedan la a y la b.'],
        [18.4, 32.4, 'Cuidado, el orden importa. B menos A es lo que está en B pero no en A: solo la e. Son conjuntos distintos.']],
      ev: [[0.8, 'draw', 1.3], [2.4, 'pops', 2], [9.8, 'cut'], [19.0, 'draw', 1.3], [21.0, 'no']],
      draw(t) {
        const two = t > 18.6;
        venn2(t, two ? { fill: [(a, b) => !a && b, 19.0], fc: P.no, hl: k => inB(k) && !inA(k), hlT: 20.4 } : { fill: [(a, b) => a && !b, .8], hl: k => inA(k) && !inB(k), hlT: 2.4, dim: k => t > 9.8 && inA(k) && inB(k) });
        if (!two) fade(win(t, 9.8, 18.4), () => { [E2.c, E2.d].forEach(([x, y]) => stroke(P.no, 5, () => { X.moveTo(x - 30, y - 30); X.lineTo(x + 80, y - 2); })); });
        rows(t, [[R`A − B = \{x : x ∈ A \t{ y } x ∉ B\}`, 1.0, 1390, 52, 'def'], [R`A − B = \{\hl{a, b}\}`, 9.8, 1530, 72, 'r1'], [R`B − A = \{\no{e}\}`, 20.4, 1650, 72, 'r2'], [R`A − B ≠ B − A`, 24.0, 1770, 60, 'neq']]);
      } },
    { id: 'comp', name: 'Complemento', dur: 29,
      caps: [[0.5, 9.0, 'COMPLEMENTO', '$A^{c}$: lo del universo que', 'no está en $A$.'], [9.4, 18.0, 'DEPENDE DE U', 'Sin el universo no se', 'sabe qué queda afuera.'],
        [18.4, 28.4, 'OTRAS FORMAS', 'También se escribe $A′$', 'y se lee «complemento de $A$».']],
      narr: [[0.5, 9.0, 'El complemento de A es todo lo del universo que no está en A. Se pinta todo menos el círculo A.'],
        [9.4, 18.0, 'Por eso depende del universo: aquí da e, f y g. Con otro universo, el complemento sería otro.'],
        [18.4, 28.4, 'Se escribe con una c arriba o con una comilla, y se lee complemento de A.']],
      ev: [[0.8, 'draw', 1.3], [2.4, 'pops', 3], [9.8, 'rise'], [19.0, 'tag']],
      draw(t) {
        venn2(t, { fill: [a => !a, .8], hl: k => !inA(k), hlT: 2.4 });
        fade(win(t, 9.6, 18.4), () => rect(UR[0] - 12, UR[1] - 12, UR[2] + 24, UR[3] + 24, { r: 30, c: P.ac, w: 4, dash: [14, 12] }));
        rows(t, [[R`A^{c} = \{x ∈ U : x ∉ A\}`, 1.0, 1390, 58, 'def'], [R`A^{c} = \{\hl{e, f, g}\}`, 9.8, 1540, 72, 'res'], [R`A^{c} = A′ = U − A`, 19.0, 1690, 66, 'alt']]);
      } },
    { id: 'sim', name: 'Diferencia simétrica', dur: 31,
      caps: [[0.5, 9.0, 'DIFERENCIA SIMÉTRICA', '$A △ B$: lo que está', 'en uno solo de los dos.'], [9.4, 19.0, 'SE ARMA ASÍ', '$(A − B) ∪ (B − A)$:', 'las dos diferencias juntas.'],
        [19.4, 30.4, 'OTRA MANERA', 'La unión sin la parte', 'común: $(A ∪ B) − (A ∩ B)$.']],
      narr: [[0.5, 9.0, 'La diferencia simétrica toma lo que está en uno solo de los conjuntos: en A o en B, pero no en los dos.'],
        [9.4, 19.0, 'Se arma juntando las dos diferencias: A menos B, y B menos A. Quedan a, b y e.'],
        [19.4, 30.4, 'Es lo mismo que tomar la unión y quitarle la intersección. Se pinta todo menos el centro.']],
      ev: [[0.8, 'draw', 1.3], [2.4, 'pops', 3], [10.0, 'tag'], [12.0, 'tag'], [20.0, 'cut']],
      draw(t) {
        venn2(t, { fill: [(a, b) => a !== b, .8], hl: k => inA(k) !== inB(k), hlT: 2.4, dim: k => inA(k) && inB(k) });
        fade(win(t, 9.8, 19.2), () => { label('A − B', 300, 1080, P.ac, { s: 38, pass: true }); label('B − A', 780, 1080, P.ac, { s: 38, pass: true }); });
        rows(t, [[R`A △ B = \{\hl{a, b, e}\}`, 1.0, 1390, 72, 'res'], [R`A △ B = (A − B) ∪ (B − A)`, 10.2, 1540, 60, 'f1'], [R`A △ B = (A ∪ B) − (A ∩ B)`, 20.0, 1680, 60, 'f2']]);
      } },
    { id: 'contar', name: 'Contar una unión', dur: 45,
      caps: [[0.5, 9.0, 'CONTAR LA UNIÓN', 'Sumar $n(A) + n(B)$ cuenta', 'dos veces lo común.'], [9.4, 18.0, 'LA CORRECCIÓN', 'Se resta una vez', 'la intersección.'],
        [18.4, 28.0, 'UNA ENCUESTA', '25 personas: 15 hablan inglés,', '12 francés y 6 los dos.'], [28.4, 36.0, 'LA CUENTA', '$15 + 12 − 6 = 21$', 'hablan alguno de los dos.'],
        [36.4, 44.4, 'LO QUE QUEDA', '$25 − 21 = 4$ no hablan', 'ninguno de los dos.']],
      narr: [[0.5, 9.0, 'Ahora contemos. A tiene cuatro elementos y B tres. Pero A unión B no tiene siete: tiene cinco. La c y la d se contaron dos veces.'],
        [9.4, 18.0, 'Por eso, para contar la unión se suman los dos y se resta una vez lo común.'],
        [18.4, 28.0, 'Sirve para encuestas. De veinticinco personas, quince hablan inglés, doce francés y seis hablan los dos idiomas.'],
        [28.4, 36.0, 'Quince más doce menos seis da veintiuno: veintiuna personas hablan al menos uno.'],
        [36.4, 44.4, 'Y las que quedan afuera de los dos círculos son veinticinco menos veintiuno: cuatro.']],
      ev: [[1.0, 'count', 0], [1.6, 'count', 1], [2.2, 'count', 2], [2.8, 'count', 3], [3.6, 'count', 4], [4.2, 'count', 5], [4.8, 'count', 6], [6.0, 'no'], [9.8, 'card'], [18.8, 'draw', 1.2], [20.0, 'pops', 3], [28.8, 'card'], [36.8, 'pop']],
      draw(t) {
        const two = t > 18.4;
        fade(1 - A(t, 18.0), () => {
          venn2(t, {});
          // A cuenta 1–4 y B 1–3: la c y la d llevan dos números
          [['a', 1, 0], ['b', 2, 0], ['c', 3, 0], ['d', 4, 0], ['c', 1, 1], ['d', 2, 1], ['e', 3, 1]].forEach(([k, nmb, s], i) => fade(A(t, 1.0 + i * .6, .3), () => { const [x, y] = E2[k]; T(String(nmb), x + (s ? 70 : -36), y + (s ? 46 : 50), { s: 36, w: 600, c: s ? P.mute : P.ac, a: 'c', pass: true }); }));
          fade(A(t, 6.0) * (1 - A(t, 9.6)), () => { circ(E2.c[0] + 10, E2.c[1], 70, { c: P.no, w: 4 }); circ(E2.d[0] + 10, E2.d[1], 70, { c: P.no, w: 4 }); });
          rows(t, [[R`n(A) + n(B) = 4 + 3 = \no{7}`, 4.4, 1390, 58, 'wr'], [R`n(A ∪ B) = \hl{5}`, 6.4, 1500, 66, 'ok']]);
          fade(A(t, 9.8), () => M(R`n(A ∪ B) = n(A) + n(B) − \hl{n(A ∩ B)}`, 540, 1650, 52, { id: 'formula' }), (1 - A(t, 9.8)) * 14);
        });
        if (two) fade(A(t, 18.4), () => {
          rect(...UR, { r: 24, w: 6 }); M('U', 150, 545, 64, { a: 'l', pass: true });
          circ(...CA, { k: draw(t, 18.8, 1.2) }); circ(...CB, { k: draw(t, 19.2, 1.2) }); label('inglés', 300, 600, P.ink, { s: 40 }); label('francés', 790, 600, P.ink, { s: 40 });
          [['9', 330, 870, 20.0], ['6', 540, 870, 20.4], ['6', 760, 870, 20.8], ['4', 880, 1170, 36.8]].forEach(([s, x, y, t0]) => fade(A(t, t0, .4), () => M(s, x, y, 84, { c: s === '4' && t0 > 30 ? P.ac : P.ink, pass: true })));
          fade(A(t, 20.2), () => { label('solo inglés', 330, 960, P.mute, { s: 30, pass: true }); label('los dos', 540, 960, P.mute, { s: 30, pass: true }); label('solo francés', 760, 960, P.mute, { s: 30, pass: true }); });
          fade(A(t, 37.2), () => label('ninguno', 880, 1220, P.ac, { s: 30, pass: true }));
          rows(t, [[R`n(I ∪ F) = 15 + 12 − 6 = \hl{21}`, 28.8, 1420, 64, 'enc'], [R`25 − 21 = \hl{4}`, 37.0, 1580, 72, 'out']]);
        });
      } },
    { id: 'morgan', name: 'Leyes de De Morgan', dur: 37,
      caps: [[0.5, 9.0, 'LEYES DE DE MORGAN', 'El complemento de una unión', 'es la intersección…'], [9.4, 18.0, 'POR QUÉ', '«No está en $A$ ni en $B$»', '= no está en $A$ y no en $B$.'],
        [18.4, 27.0, 'LA OTRA LEY', 'El complemento de una', 'intersección es la unión…'], [27.4, 36.4, 'EN UNA FRASE', 'Al sacar el complemento,', '$∪$ y $∩$ se intercambian.']],
      narr: [[0.5, 9.0, 'Dos reglas muy útiles llevan el nombre de Augustus De Morgan. La primera: lo que queda afuera de la unión…'],
        [9.4, 18.0, '…es lo que no está en A y tampoco en B: la parte común de los dos complementos. Es la zona de afuera.'],
        [18.4, 27.0, 'La segunda: lo que no está en la intersección es lo que falta en A o falta en B. Se pinta todo menos el centro.'],
        [27.4, 36.4, 'En una frase: al tomar el complemento, la unión se vuelve intersección y la intersección se vuelve unión.']],
      ev: [[0.8, 'draw', 1.3], [10.0, 'rise'], [18.8, 'draw', 1.3], [28.0, 'shuffle', 1.4]],
      draw(t) {
        const second = t > 18.4;
        venn2(t, { fill: second ? [(a, b) => !(a && b), 18.8] : [(a, b) => !(a || b), .8], hl: second ? k => !(inA(k) && inB(k)) : k => !inA(k) && !inB(k), hlT: second ? 20.2 : 2.2 });
        rows(t, [[R`(A ∪ B)^{c} = A^{c} ∩ B^{c}`, 1.0, 1400, 72, 'm1'], [R`(A ∪ B)^{c} = \{\hl{f, g}\}`, 10.0, 1520, 58, 'r1'], [R`(A ∩ B)^{c} = A^{c} ∪ B^{c}`, 19.0, 1660, 72, 'm2']]);
        fade(A(t, 28.0), () => { label('∪  ↔  ∩', 540, 1780, P.ac, { s: 50 }); });
      } },
    { id: 'tres', name: 'Tres conjuntos', dur: 35,
      caps: [[0.5, 9.0, 'TRES CONJUNTOS', 'Tres círculos parten', 'el universo en ocho zonas.'], [9.4, 18.0, 'PRIMERO EL PARÉNTESIS', 'En $(A ∪ C) − B$ se pinta', 'primero $A ∪ C$.'],
        [18.4, 26.0, 'DESPUÉS', 'A lo pintado se le quita', 'todo lo que esté en $B$.'], [26.4, 34.4, 'EL RESULTADO', 'Lo de $A$ o de $C$', 'que no toca a $B$.']],
      narr: [[0.5, 9.0, 'Con tres conjuntos el dibujo tiene tres círculos, y el universo queda partido en ocho zonas.'],
        [9.4, 18.0, 'Para una expresión como A unión C, menos B, se empieza por el paréntesis: se pintan los círculos A y C.'],
        [18.4, 26.0, 'Después se aplica la diferencia: se borra todo lo pintado que caiga dentro de B.'],
        [26.4, 34.4, 'Queda lo que está en A o en C sin tocar a B. Paso a paso, cualquier expresión se pinta así.']],
      ev: [[0.8, 'draw', 1.0], [1.4, 'draw', 1.0], [2.0, 'draw', 1.0], [9.8, 'draw', 1.3], [18.8, 'cut'], [27.0, 'yes']],
      draw(t) {
        const C3 = [[440, 760, 210], [640, 760, 210], [540, 935, 210]];
        rect(...UR, { r: 24, w: 6 }); M('U', 150, 545, 64, { a: 'l', pass: true });
        if (t < 18.8) vennFill(C3, (a, b, c) => a || c, draw(t, 9.8, 1.3), { bounds: UR });
        else { vennFill(C3, (a, b, c) => (a || c) && !b, 1, { bounds: UR }); fade(1 - seg(t, 18.8, 20.0), () => vennFill(C3, (a, b, c) => (a || c) && b, 1, { bounds: UR, c: P.no, a: .4 })); }
        C3.forEach((c, i) => circ(...c, { k: draw(t, .8 + i * .6, 1.0) }));
        fade(A(t, 1.6), () => { M('A', 220, 620, 62, { pass: true }); M('B', 860, 620, 62, { pass: true }); M('C', 540, 1210, 62, { pass: true }); });
        fade(win(t, 2.6, 9.2), () => { const R8 = [[330, 720], [750, 720], [540, 1060], [540, 680], [420, 900], [660, 900], [540, 830], [900, 1150]]; R8.forEach(([x, y], i) => fade(A(t, 2.8 + i * .4, .3), () => T(String(i + 1), x, y, { s: 40, w: 600, c: P.ac, a: 'c', pass: true }))); });
        rows(t, [[R`(A ∪ C) − B`, 9.6, 1420, 90, 'expr'], [R`\s{1}{\hl{A ∪ C}} \;→\; \s{2}{\t{quitar } B}`, 10.4, 1580, 56, 'pasos']]);
      } },
  ],
  sum: [['Unión', R`A ∪ B = \{x : x ∈ A \t{ o } x ∈ B\}`], ['Intersección', R`A ∩ B = \{x : x ∈ A \t{ y } x ∈ B\}`], ['Diferencia', R`A − B = \{x : x ∈ A \t{ y } x ∉ B\}`],
    ['Complemento', R`A^{c} = U − A`], ['Diferencia simétrica', R`A △ B = (A − B) ∪ (B − A)`], ['Contar una unión', R`n(A ∪ B) = n(A) + n(B) − n(A ∩ B)`], ['De Morgan', R`(A ∪ B)^{c} = A^{c} ∩ B^{c}`]],
  end: ['Cada operación es una zona', 'del diagrama de Venn.'],
  finNarr: [[0.8, 11.8, 'En resumen: la unión junta, la intersección se queda con lo común, la diferencia quita y el complemento toma lo de afuera.'],
    [12.0, 20.0, 'Para contar una unión se resta lo común, y al sacar el complemento, unión e intersección se intercambian.']],
};
