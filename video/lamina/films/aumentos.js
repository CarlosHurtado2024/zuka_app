// Lección alg-13c · Aumentos y descuentos (mundo Escalas y Proporciones).
// Descuento = pagar el resto; el factor (distributiva); aumentos (IVA); volver al precio de antes dividiendo por el factor
// (y la trampa de restar el porcentaje); cambio porcentual sobre el valor de antes; comparar ofertas; puntos porcentuales.
const R = String.raw;
const POSTER = 120;
const W0 = 720;                                             // ancho de la barra del precio de partida
const FILM = {
  lesson: 'alg-13c', world: 'razones', key: 'F', n: [5, 6],
  title: 'Aumentos y descuentos',
  next: 'Cambios sucesivos',
  intro: 'Una rebaja o un impuesto cambian un precio en un porcentaje. Todo se resuelve con una sola multiplicación: la del factor.',
  examples: ['80 000', '56 000', '30 000', '35 700', '50 a 65', '120 000', '4 % a 5 %'],
  scenes: [
    { id: 'descuento', name: 'Un descuento', dur: 33,
      caps: [[0.5, 9.0, 'REBAJA DEL 30 %', 'Unos zapatos de 80 000', 'con 30 % de descuento.'], [9.4, 19.0, 'SE PAGA EL RESTO', 'Si se descuenta el 30 %,', 'se paga el 70 %.'],
        [19.4, 32.4, 'UNA SOLA CUENTA', R`$80\,000 · 0.7 = 56\,000$.`, '']],
      narr: [[0.5, 9.0, 'Unos zapatos cuestan ochenta mil pesos y tienen un treinta por ciento de descuento.'],
        [9.4, 19.0, 'Se puede calcular el descuento y restarlo. Pero es más corto pensar en lo que sí se paga: si quitan el treinta, queda el setenta por ciento.'],
        [19.4, 32.4, 'Ochenta mil por cero coma siete: cincuenta y seis mil pesos. Una sola multiplicación.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        bar(180, 640, W0, 100, { k: draw(t, 1.0, 1.0), label: '80 000', a: .35 });
        if (t > 9.4) { fade(A(t, 9.8), () => { fillP(P.no, .35, () => X.rect(180 + W0 * .7, 642, W0 * .3, 96)); stroke(P.no, 4, () => { X.moveTo(180 + W0 * .7, 620); X.lineTo(180 + W0 * .7, 760); }, { dash: [8, 8] }); brace(180, 180 + W0 * .7, 780, { label: '70 % se paga', k: 1, s: 38 }); label('30 %', 180 + W0 * .85, 620, P.no, { s: 38 }); }); }
        fade(A(t, 19.8), () => bar(180, 960, W0 * .7, 100, { label: '56 000', k: draw(t, 19.8, 1.0), a: .6 }));
        fade(A(t, 20.4), () => M(R`80\,000 · 0.7 = \hl{56\,000}`, 540, 1340, 80, { id: 'r' }));
      } },
    { id: 'factor', name: 'El factor', dur: 33,
      caps: [[0.5, 9.0, 'POR QUÉ FUNCIONA', '$P − 0.3P = P(1 − 0.3)$:', 'la distributiva.'], [9.4, 19.0, 'EL FACTOR', R`Descontar $r\%$ es`, R`multiplicar por $1 − \frac{r}{100}$.`],
        [19.4, 32.4, 'EJEMPLOS', R`$−15\% → 0.85$`, R`$−8\% → 0.92$.`]],
      narr: [[0.5, 9.0, 'Funciona por la propiedad distributiva. El precio menos el treinta por ciento del precio es el precio por uno menos cero coma tres.'],
        [9.4, 19.0, 'Ese número, uno menos el porcentaje en decimal, se llama factor. Descontar es multiplicar por el factor.'],
        [19.4, 32.4, 'Un descuento del quince por ciento tiene factor cero coma ochenta y cinco; uno del ocho por ciento, cero coma noventa y dos.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'pops', 2]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`P − 0.3P = P(1 − 0.3) = \hl{0.7}P`, 540, 640, 72, { id: 'd' }));
        fade(A(t, 9.8), () => M(R`\t{descuento de } r\% \;→\; × \left(1 − \frac{r}{100}\right)`, 540, 860, 64, { id: 'f' }));
        [[15, '0.85', 19.8], [8, '0.92', 21.0]].forEach(([r, f, t0], i) => fade(A(t, t0), () => { const y = 1080 + i * 160; rect(180, y, W0, 80, { r: 10, w: 3 }); bar(180, y, W0 * (1 - r / 100), 80, { k: draw(t, t0, 1.0), a: .5, label: '× ' + f, s: 40 }); label('−' + r + ' %', 180 + W0 + 40, y + 54, P.no, { a: 'l', s: 38 }); }));
      } },
    { id: 'aumento', name: 'Un aumento', dur: 31,
      caps: [[0.5, 9.0, 'EL IVA DEL 19 %', 'Un servicio de 30 000', 'más el IVA.'], [9.4, 19.0, 'SE PAGA DE MÁS', 'El 100 % más el 19 %:', 'el 119 %.'],
        [19.4, 30.4, 'EL FACTOR', R`$30\,000 · 1.19 = 35\,700$.`, 'El factor del aumento: 1.19.']],
      narr: [[0.5, 9.0, 'Un servicio cuesta treinta mil pesos y hay que sumarle el IVA, que en Colombia es del diecinueve por ciento.'],
        [9.4, 19.0, 'Se paga el precio completo, el cien por ciento, más el diecinueve: el ciento diecinueve por ciento.'],
        [19.4, 30.4, 'Treinta mil por uno coma diecinueve: treinta y cinco mil setecientos. Aumentar es multiplicar por uno más el porcentaje.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'draw', .8], [19.8, 'card']],
      draw(t) {
        bar(150, 640, 600, 100, { k: draw(t, 1.0, 1.0), label: '30 000', a: .35 });
        fade(A(t, 9.8), () => { bar(750, 640, 114, 100, { k: draw(t, 9.8, .8), a: .75, label: '19 %', s: 30 }); brace(150, 864, 780, { label: '119 %', k: 1, s: 40 }); });
        fade(A(t, 19.8), () => M(R`30\,000 · 1.19 = \hl{35\,700}`, 540, 1340, 80, { id: 'r' }));
        fade(A(t, 21.0), () => M(R`\t{aumento de } r\% \;→\; × \left(1 + \frac{r}{100}\right)`, 540, 1500, 60, { id: 'f' }));
      } },
    { id: 'volver', name: 'Volver al precio de antes', dur: 37,
      caps: [[0.5, 9.0, 'AL REVÉS', 'Con IVA cuesta 35 700.', 'Se busca el precio sin IVA.'], [9.4, 19.0, '!LA TRAMPA', 'Restar el 19 % de 35 700', 'da 28 917: no es.'],
        [19.4, 28.0, 'POR QUÉ', 'El 19 % se calculó sobre', 'el precio de antes.'], [28.4, 36.4, 'LO CORRECTO', 'Dividir entre el factor:', R`$35\,700 ÷ 1.19 = 30\,000$.`]],
      narr: [[0.5, 9.0, 'Ahora al revés. Una factura dice treinta y cinco mil setecientos con IVA incluido. Queremos el precio sin IVA.'],
        [9.4, 19.0, 'La tentación es quitarle el diecinueve por ciento. Pero eso da veintiocho mil novecientos diecisiete, y no es el precio de antes.'],
        [19.4, 28.0, 'El diecinueve por ciento se calculó sobre el precio de antes, que es más pequeño. Quitarlo sobre el precio nuevo quita de más.'],
        [28.4, 36.4, 'Como para llegar se multiplicó por uno coma diecinueve, para volver se divide entre uno coma diecinueve: treinta mil.']],
      ev: [[1.0, 'rise'], [9.8, 'no'], [19.8, 'draw', 1.0], [28.8, 'card']],
      draw(t) {
        bar(150, 620, 714, 100, { label: '35 700', a: .5 });
        if (t > 9.4 && t < 28.4) fade(A(t, 9.8), () => { bar(150, 790, 578, 100, { label: '28 917', a: .25, c: P.no }); stroke(P.no, 4, () => { X.moveTo(728, 600); X.lineTo(728, 910); }, { dash: [8, 8] }); label('quita de más', 800, 960, P.no, { s: 36 }); });
        fade(A(t, 19.8), () => { stroke(P.ac, 4, () => { X.moveTo(750, 600); X.lineTo(750, 910); }, { dash: [8, 8] }); label('aquí estaba el precio', 750, 580, P.ac, { s: 32 }); });
        if (t > 28.4) fade(A(t, 28.8), () => bar(150, 790, 600, 100, { label: '30 000', a: .6, k: draw(t, 28.8, 1.0) }));
        fade(A(t, 10.0) * (1 - A(t, 28.2)), () => M(R`35\,700 − 0.19 · 35\,700 = \no{28\,917}`, 540, 1340, 60, { id: 'mal' }));
        fade(A(t, 28.8), () => M(R`35\,700 ÷ 1.19 = \hl{30\,000}`, 540, 1340, 80, { id: 'bien' }));
      } },
    { id: 'cambio', name: 'Cambio porcentual', dur: 37,
      caps: [[0.5, 9.0, 'CUÁNTO CAMBIÓ', 'Un pasaje subió de 50 000', 'a 65 000.'], [9.4, 19.0, 'SOBRE EL DE ANTES', R`$\frac{65 − 50}{50} = 0.3$:`, 'subió el 30 %.'],
        [19.4, 28.0, 'SI VUELVE A BAJAR', 'De 65 000 a 50 000:', R`$\frac{50 − 65}{65} ≈ −23.1\%$.`], [28.4, 36.4, '!NO SON IGUALES', 'Subir 30 % y bajar 23 %', 'dejan el mismo precio.']],
      narr: [[0.5, 9.0, 'Un pasaje pasó de cincuenta mil a sesenta y cinco mil pesos. Para saber cuánto subió en porcentaje, se compara con el precio de antes.'],
        [9.4, 19.0, 'El cambio fue de quince mil. Quince mil sobre cincuenta mil es cero coma tres: subió el treinta por ciento.'],
        [19.4, 28.0, 'Si después vuelve a cincuenta mil, el cambio se mide sobre sesenta y cinco mil: bajó cerca del veintitrés por ciento.'],
        [28.4, 36.4, 'Por eso subir y bajar no tienen el mismo porcentaje, aunque los precios sean los mismos: cambia la base.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'card'], [19.8, 'draw', 1.0], [28.8, 'doubt']],
      draw(t) {
        bar(150, 620, 500, 90, { label: '50 000', a: .35 }); bar(150, 760, 650, 90, { label: '65 000', a: .55, k: draw(t, 1.0, 1.4) });
        fade(A(t, 9.8) * (1 - A(t, 19.2)), () => { brace(650, 800, 870, { label: '15 000', k: 1, s: 36 }); stroke(P.ac, 4, () => { X.moveTo(150, 600); X.lineTo(650, 600); }); label('base: 50 000', 400, 580, P.ac, { s: 32 }); });
        fade(A(t, 19.8), () => { stroke(P.ac, 4, () => { X.moveTo(150, 880); X.lineTo(800, 880); }); label('base: 65 000', 475, 920, P.ac, { s: 32 }); });
        fade(A(t, 1.2), () => M(R`\t{cambio} = \frac{\t{nuevo} − \t{antes}}{\t{antes}}`, 540, 1180, 64, { id: 'f' }));
        fade(A(t, 9.8), () => M(R`\frac{65 − 50}{50} = 0.3 = \hl{+30\%}`, 540, 1380, 66, { id: 'up' }));
        fade(A(t, 19.8), () => M(R`\frac{50 − 65}{65} ≈ \hl{−23.1\%}`, 540, 1540, 66, { id: 'down' }));
      } },
    { id: 'ofertas', name: 'Comparar ofertas', dur: 30,
      caps: [[0.5, 9.0, 'DOS OFERTAS', 'Sobre 120 000: 25 000 menos', 'o un 20 % de descuento.'], [9.4, 18.0, 'SE PASAN A LO MISMO', 'El 20 % de 120 000', 'es 24 000.'],
        [18.4, 29.4, 'GANA', 'La rebaja fija de 25 000:', 'ahorra 1 000 más.']],
      narr: [[0.5, 9.0, 'Un televisor de ciento veinte mil pesos tiene dos ofertas: veinticinco mil pesos menos, o un veinte por ciento de descuento.'],
        [9.4, 18.0, 'Para compararlas hay que pasarlas a lo mismo. El veinte por ciento de ciento veinte mil es veinticuatro mil.'],
        [18.4, 29.4, 'Entonces la rebaja fija ahorra mil pesos más. Con un precio mayor, el porcentaje habría ganado.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'draw', 1.0], [18.8, 'yes']],
      draw(t) {
        rect(150, 620, W0, 90, { r: 10, w: 3 }); bar(150, 620, W0 * 95 / 120, 90, { k: draw(t, 1.0, 1.0), label: '95 000', a: .5 }); label('− 25 000', 150 + W0 + 30, 680, P.mute, { a: 'l', s: 34 });
        rect(150, 780, W0, 90, { r: 10, w: 3 }); bar(150, 780, W0 * .8, 90, { k: draw(t, 9.8, 1.0), label: '96 000', a: .3 }); label('− 20 %', 150 + W0 + 30, 840, P.mute, { a: 'l', s: 34 });
        fade(A(t, 18.8), () => { circ(150 + W0 * 95 / 240, 665, 70, { c: P.ac, w: 4 }); label('se paga menos', 150 + W0 * 95 / 240, 580, P.ac, { s: 34 }); });
        fade(A(t, 10.2), () => M(R`0.2 · 120\,000 = 24\,000 \;<\; 25\,000`, 540, 1340, 62, { id: 'c' }));
      } },
    { id: 'puntos', name: 'Puntos porcentuales', dur: 30,
      caps: [[0.5, 9.0, 'UNA TASA SUBE', 'Del 4 % al 5 %:', 'subió 1 punto porcentual.'], [9.4, 19.0, 'PERO EN PORCENTAJE', R`$\frac{5 − 4}{4} = 0.25$:`, 'subió un 25 %.'],
        [19.4, 29.4, '!NO CONFUNDIR', 'Puntos: se restan.', 'Porcentaje: sobre el de antes.']],
      narr: [[0.5, 9.0, 'El interés de un crédito pasa del cuatro al cinco por ciento. La diferencia es un punto porcentual: se restan los porcentajes.'],
        [9.4, 19.0, 'Pero si se mide como cambio porcentual, sobre el cuatro de antes, subió un veinticinco por ciento.'],
        [19.4, 29.4, 'Las dos frases son ciertas y dicen cosas distintas. Por eso en las noticias conviene fijarse si hablan de puntos o de porcentaje.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'card'], [19.8, 'tag']],
      draw(t) {
        bar(150, 640, 4 * 120, 90, { label: '4 %', a: .35 }); bar(150, 780, 5 * 120, 90, { label: '5 %', a: .55, k: draw(t, 1.0, 1.0) });
        fade(A(t, 2.4), () => brace(150 + 480, 150 + 600, 890, { label: '1 punto', k: 1, s: 36 }));
        fade(A(t, 1.6), () => M(R`5\% − 4\% = 1 \t{ punto}`, 540, 1340, 70, { id: 'pt' }));
        fade(A(t, 9.8), () => M(R`\frac{5 − 4}{4} = 0.25 = \hl{+25\%}`, 540, 1500, 70, { id: 'pc' }));
      } },
  ],
  sum: [['Descuento de r %', R`× \left(1 − \frac{r}{100}\right)`], ['Aumento de r %', R`× \left(1 + \frac{r}{100}\right)`], ['Volver al precio de antes', R`\t{dividir entre el factor}`], ['Cambio porcentual', R`\frac{\t{nuevo} − \t{antes}}{\t{antes}}`], ['Puntos porcentuales', R`5\% − 4\% = 1 \t{ punto}`]],
  end: ['Todo cambio porcentual se', 'mide sobre el valor de antes.'],
  finNarr: [[0.8, 9.0, 'En resumen: un descuento o un aumento es una multiplicación por el factor, y para volver se divide.'],
    [9.2, 16.0, 'Los cambios se miden sobre el valor de antes, y no son lo mismo que los puntos porcentuales.']],
};
