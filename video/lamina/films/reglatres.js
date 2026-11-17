// Lección alg-12f · Regla de tres simple y compuesta (mundo Escalas y Proporciones).
// La tabla; directa por reducción a la unidad y por proporción; cómo saber si es directa o inversa (la prueba del doble);
// inversa con el producto; la trampa (no todo es proporcional); compuesta cambiando una magnitud a la vez.
const R = String.raw;
const POSTER = 150;
// tabla de dos columnas: encabezados y filas; hl = fila resaltada
function tabla(x, y, heads, rows, k, o = {}) {
  fade(k, () => {
    const cw = o.cw || 300, rh = 100; heads.forEach((h, j) => T(h, x + j * cw + cw / 2, y, { s: 34, c: P.mute, a: 'c', pass: true }));
    line(x, y + 24, x + heads.length * cw, y + 24, { w: 3, c: hexA(P.ink, .5) });
    rows.forEach((r, i) => r.forEach((v, j) => fade(o.rowA ? o.rowA(i) : 1, () => M(v, x + j * cw + cw / 2, y + 110 + i * rh, 56, { c: v === 'x' ? P.ac : P.ink, pass: true }))));
  });
}
const FILM = {
  lesson: 'alg-12f', world: 'razones', key: 'F', n: [3, 6],
  title: 'Regla de tres simple y compuesta',
  next: 'Porcentajes: qué son y cómo se calculan',
  intro: 'Con tres datos se encuentra el cuarto: es la regla de tres. Lo difícil es saber si es directa o inversa.',
  examples: ['6 cuadernos', '21 000', '5 buses', '12 viajes', '600 piezas', '1 500 piezas'],
  scenes: [
    { id: 'tabla', name: 'Armar la tabla', dur: 29,
      caps: [[0.5, 9.0, 'EL PROBLEMA', '6 cuadernos cuestan 21 000.', 'Se buscan 9.'], [9.4, 19.0, 'LA TABLA', 'Una columna por magnitud,', 'una fila por situación.'],
        [19.4, 28.4, 'TRES DATOS', 'Y una $x$ en el lugar', 'del que falta.']],
      narr: [[0.5, 9.0, 'Seis cuadernos cuestan veintiún mil pesos. Queremos saber cuánto cuestan nueve. Hay tres datos y falta uno.'],
        [9.4, 19.0, 'Primero se ordena: una columna para los cuadernos y otra para los pesos. Cada fila es una situación.'],
        [19.4, 28.4, 'La segunda fila tiene el nueve y una x donde va el precio que no conocemos.']],
      ev: [[1.0, 'pops', 6], [9.8, 'draw', 1.0], [19.8, 'tag']],
      draw(t) {
        for (let i = 0; i < 9; i++) fade(A(t, 1.0 + i * .12, .3), () => rect(160 + i * 86, 560, 70, 96, { r: 8, w: 3, fill: i < 6 ? .4 : .06 }));
        tabla(240, 820, ['cuadernos', 'pesos'], [['6', '21\\,000'], ['9', 'x']], A(t, 9.8), { rowA: i => (i ? A(t, 19.8) : 1) });
      } },
    { id: 'directa', name: 'Regla de tres directa', dur: 37,
      caps: [[0.5, 9.0, 'DIRECTA', 'Más cuadernos, más pesos,', 'en la misma razón.'], [9.4, 19.0, 'A LA UNIDAD', R`Un cuaderno: $21\,000 ÷ 6$`, R`$= 3\,500$.`],
        [19.4, 27.0, 'Y LUEGO', 'Nueve cuadernos:', R`$9 · 3\,500 = 31\,500$.`], [27.4, 36.4, 'O CON PROPORCIÓN', R`$\frac{x}{9} = \frac{21\,000}{6}$:`, 'el mismo resultado.']],
      narr: [[0.5, 9.0, 'Cuadernos y pesos son directamente proporcionales: el doble de cuadernos cuesta el doble.'],
        [9.4, 19.0, 'Un camino es reducir a la unidad. Si seis cuestan veintiún mil, uno cuesta veintiún mil entre seis: tres mil quinientos.'],
        [19.4, 27.0, 'Nueve cuadernos cuestan nueve veces eso: treinta y un mil quinientos.'],
        [27.4, 36.4, 'El otro camino es la proporción: el precio por cuaderno es el mismo en las dos filas. Despejando sale lo mismo.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'card'], [27.8, 'rise']],
      draw(t) {
        tabla(240, 560, ['cuadernos', 'pesos'], [['6', '21\\,000'], ['1', '3\\,500'], ['9', t > 19.8 ? '31\\,500' : 'x']], 1, { rowA: i => (i === 1 ? A(t, 9.8) : 1) });
        fade(A(t, 9.8), () => { arrow(820, 680, 820, 760, { c: P.ac, w: 4, h: 18 }); label('÷ 6', 880, 735, P.ac, { s: 38, a: 'l' }); });
        fade(A(t, 19.8), () => { arrow(820, 790, 820, 870, { c: P.ac, w: 4, h: 18 }); label('× 9', 880, 845, P.ac, { s: 38, a: 'l' }); });
        fade(A(t, 27.8), () => M(R`\frac{x}{9} = \frac{21\,000}{6} \;⇒\; x = \hl{31\,500}`, 540, 1340, 66, { id: 'p' }));
      } },
    { id: 'saber', name: 'Directa o inversa', dur: 30,
      caps: [[0.5, 9.0, 'LA PRUEBA DEL DOBLE', 'Si una magnitud se duplica,', 'qué pasa con la otra.'], [9.4, 19.0, 'SI TAMBIÉN SE DUPLICA', 'Es directa: más cuadernos,', 'más pesos.'],
        [19.4, 29.4, 'SI SE PARTE EN DOS', 'Es inversa: más buses,', 'menos viajes.']],
      narr: [[0.5, 9.0, 'Antes de calcular hay que decidir el tipo de relación. La prueba es imaginar que una magnitud se duplica.'],
        [9.4, 19.0, 'Si la otra también se duplica, la relación es directa. El doble de cuadernos cuesta el doble.'],
        [19.4, 29.4, 'Si la otra se reduce a la mitad, es inversa. Con el doble de buses se necesitan la mitad de viajes.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.0], [19.8, 'draw', 1.0]],
      draw(t) {
        const g = (y, a, b, c) => { bar(180, y, 200, 70, { label: '×1', a: .3 }); bar(180, y + 90, 400, 70, { label: '×2', k: draw(t, a, .8) }); bar(620, y, 200, 70, { label: '×1', a: .3, c: P.ink }); bar(620, y + 90, b, 70, { label: c, k: draw(t, a + .6, .8), c: P.ink }); };
        fade(A(t, 9.8), () => { label('directa', 540, 560, P.ac, { s: 40 }); g(600, 10.0, 400, '×2'); });
        fade(A(t, 19.8), () => { label('inversa', 540, 900, P.ac, { s: 40 }); g(940, 20.0, 100, '÷2'); });
        fade(A(t, 1.0), () => M(R`x \;→\; 2x`, 540, 1400, 80, { id: 'd' }));
      } },
    { id: 'inversa', name: 'Regla de tres inversa', dur: 37,
      caps: [[0.5, 9.0, 'EL PROBLEMA', 'Con 5 buses se llevan los', 'hinchas en 12 viajes.'], [9.4, 19.0, 'LO QUE SE CONSERVA', '$5 · 12 = 60$ viajes de bus:', 'el trabajo total.'],
        [19.4, 27.0, 'CON 6 BUSES', '$6x = 60$, así que', '$x = 10$ viajes.'], [27.4, 36.4, '!NO SE MULTIPLICA EN CRUZ', 'En la inversa, se igualan', 'los productos de cada fila.']],
      narr: [[0.5, 9.0, 'Cinco buses llevan a todos los hinchas en doce viajes cada uno. Si se consigue un bus más, harán falta menos viajes.'],
        [9.4, 19.0, 'Aquí no se conserva el cociente sino el producto: cinco buses por doce viajes son sesenta viajes de bus en total.'],
        [19.4, 27.0, 'Con seis buses, seis por x tiene que dar sesenta. Cada bus hace diez viajes.'],
        [27.4, 36.4, 'Cuidado con el atajo de multiplicar en cruz: en la inversa daría un resultado mayor, y es absurdo que con más buses haya más viajes.']],
      ev: [[1.0, 'pops', 5], [9.8, 'card'], [19.8, 'yes'], [27.8, 'no']],
      draw(t) {
        tabla(240, 560, ['buses', 'viajes'], [['5', '12'], ['6', t > 19.8 ? '10' : 'x']], A(t, 1.0));
        fade(A(t, 9.8), () => { M(R`5 · 12 = \hl{60}`, 840, 670, 50, { pass: true }); }); fade(A(t, 19.8), () => M(R`6 · x = \hl{60}`, 840, 770, 50, { pass: true }));
        fade(A(t, 19.8), () => M(R`x = \frac{60}{6} = \hl{10} \t{ viajes}`, 540, 1340, 76, { id: 'r' }));
        fade(A(t, 27.8), () => M(R`\t{en cruz: } \frac{6 · 12}{5} = \no{14.4}`, 540, 1500, 56, { id: 'mal', c: P.mute }));
      } },
    { id: 'trampa', name: 'No todo es proporcional', dur: 28,
      caps: [[0.5, 9.0, '!NO TODO ES PROPORCIONAL', 'Dos huevos se cocinan', 'en 10 minutos.'], [9.4, 18.0, 'CUATRO HUEVOS', 'También tardan 10 minutos,', 'no 20.'],
        [18.4, 27.4, 'ANTES DE CALCULAR', 'Pregúntate si de verdad', 'una depende de la otra.']],
      narr: [[0.5, 9.0, 'La regla de tres no sirve para todo. Dos huevos se cocinan en diez minutos en la misma olla.'],
        [9.4, 18.0, 'Cuatro huevos también tardan diez minutos. El tiempo no depende de cuántos huevos haya.'],
        [18.4, 27.4, 'Pasa igual con la edad y la estatura, o con un taxi que cobra un arranque fijo. Antes de calcular, mira si la relación es proporcional.']],
      ev: [[1.0, 'pops', 2], [9.8, 'pops', 2], [18.8, 'doubt']],
      draw(t) {
        const pot = (x, n, t0) => fade(A(t, t0), () => { poly([[x - 140, 640], [x + 140, 640], [x + 120, 860], [x - 120, 860]], { w: 5, fill: .1 }); for (let i = 0; i < n; i++) ell(x - 70 + (i % 2) * 140, 720 + Math.floor(i / 2) * 80 - (n === 2 ? -30 : 0), 42, 54, { w: 4, fill: .5, c: P.ink, fc: P.ink }); M('10 min', x, 940, 50, { c: P.ac, pass: true }); });
        pot(320, 2, 1.0); pot(760, 4, 9.8);
        fade(A(t, 10.4), () => M(R`2 \t{ huevos} → 10 \t{ min} \qquad 4 \t{ huevos} → 10 \t{ min}`, 540, 1340, 50, { id: 'h' }));
      } },
    { id: 'compuesta', name: 'Regla de tres compuesta', dur: 47,
      caps: [[0.5, 9.0, 'TRES MAGNITUDES', '3 máquinas hacen 600 piezas', 'en 4 horas.'], [9.4, 18.0, 'LA PREGUNTA', 'Cuánto tardan 6 máquinas', 'en hacer 1 500 piezas.'],
        [18.4, 28.0, 'UNA A LA VEZ', 'Doble de máquinas, mitad', 'de tiempo: inversa.'], [28.4, 37.0, 'LA OTRA', '2.5 veces las piezas, 2.5', 'veces el tiempo: directa.'],
        [37.4, 46.4, 'RESULTADO', R`$4 · \frac{3}{6} · \frac{1500}{600} = 5$`, 'horas.']],
      narr: [[0.5, 9.0, 'Tres máquinas iguales hacen seiscientas piezas en cuatro horas. Ahora hay tres magnitudes: máquinas, piezas y horas.'],
        [9.4, 18.0, 'Queremos saber cuánto tardan seis máquinas en hacer mil quinientas piezas. Cambian dos cosas a la vez.'],
        [18.4, 28.0, 'El truco es cambiar una a la vez. Si las máquinas pasan de tres a seis, el tiempo se reduce a la mitad: inversa. Dos horas.'],
        [28.4, 37.0, 'Si las piezas pasan de seiscientas a mil quinientas, dos veces y media, el tiempo crece igual: directa. Dos por dos y medio, cinco horas.'],
        [37.4, 46.4, 'En una sola cuenta: cuatro horas por tres sextos, por mil quinientos sobre seiscientos. Cinco horas.']],
      ev: [[1.0, 'pops', 3], [9.8, 'rise'], [18.8, 'cut'], [28.8, 'draw', 1.2], [37.8, 'card']],
      draw(t) {
        tabla(110, 560, ['máquinas', 'piezas', 'horas'], [['3', '600', '4'], ['6', '1\\,500', 'x']], A(t, 1.0), { cw: 280, rowA: i => (i ? A(t, 9.8) : 1) });
        fade(A(t, 18.8), () => { M(R`3 → 6: \quad 4 · \hl{\frac{3}{6}} = 2 \t{ h}`, 540, 1000, 60, { id: 's1' }); label('inversa: se voltea la razón', 540, 1080, P.mute, { s: 34 }); });
        fade(A(t, 28.8), () => { M(R`600 → 1500: \quad 2 · \hl{\frac{1500}{600}} = 5 \t{ h}`, 540, 1200, 60, { id: 's2' }); label('directa: la razón va igual', 540, 1280, P.mute, { s: 34 }); });
        fade(A(t, 37.8), () => M(R`x = 4 · \frac{3}{6} · \frac{1500}{600} = \hl{5} \t{ h}`, 540, 1480, 70, { id: 'r' }));
      } },
    { id: 'metodo', name: 'El método', dur: 30,
      caps: [[0.5, 9.0, 'PASO 1', 'Ordenar los datos en', 'una tabla.'], [9.4, 19.0, 'PASO 2', 'Decidir con la prueba del', 'doble: directa o inversa.'],
        [19.4, 29.4, 'PASO 3', 'Directa: igualar cocientes.', 'Inversa: igualar productos.']],
      narr: [[0.5, 9.0, 'Juntemos todo en un método de tres pasos. Primero, ordenar los datos en una tabla, con la x en el dato que falta.'],
        [9.4, 19.0, 'Segundo, imaginar que una magnitud se duplica y ver qué hace la otra. Así se sabe si la relación es directa o inversa.'],
        [19.4, 29.4, 'Tercero, calcular: si es directa, los cocientes de las dos filas son iguales; si es inversa, los productos.']],
      ev: [[1.0, 'tag'], [9.8, 'tag'], [19.8, 'tag']],
      draw(t) {
        [['1', 'tabla', 1.0], ['2', 'prueba del doble', 9.8], ['3', 'cociente o producto', 19.8]].forEach(([n, s, t0], i) => note(150, 560 + i * 260, 780, 200, A(t, t0), () => {
          circ(240, 660 + i * 260, 52, { c: P.ac, w: 5, fill: .2 }); M(n, 240, 680 + i * 260, 60, { c: P.ac, pass: true }); T(s, 330, 680 + i * 260, { s: 50, w: 500 }); }));
        fade(A(t, 20.4), () => M(R`\frac{y_{1}}{x_{1}} = \frac{y_{2}}{x_{2}} \qquad x_{1}y_{1} = x_{2}y_{2}`, 540, 1480, 62, { id: 'f' }));
      } },
  ],
  sum: [['La tabla', R`\t{una columna por magnitud}`], ['Directa', R`\frac{x}{9} = \frac{21\,000}{6}`], ['Inversa', R`5 · 12 = 6 · x`], ['Directa o inversa', R`\t{la prueba del doble}`], ['Compuesta', R`x = 4 · \frac{3}{6} · \frac{1500}{600}`]],
  end: ['Una magnitud a la vez,', 'y siempre la prueba del doble.'],
  finNarr: [[0.8, 9.0, 'En resumen: se arma la tabla, se decide con la prueba del doble si es directa o inversa, y se calcula.'],
    [9.2, 16.0, 'En la directa se conserva el cociente; en la inversa, el producto. Y en la compuesta, una magnitud a la vez.']],
};
