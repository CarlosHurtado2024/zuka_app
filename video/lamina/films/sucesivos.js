// Lección alg-13d · Cambios sucesivos (mundo Escalas y Proporciones).
// Dos descuentos se multiplican (no se suman), por qué; el orden no importa; subir y bajar lo mismo no regresa; cuánto
// subir para volver; crecer varias veces es una potencia del factor; la regla general.
const R = String.raw;
const POSTER = 60;
const W0 = 720;
const FILM = {
  lesson: 'alg-13d', world: 'razones', key: 'F', n: [6, 6],
  title: 'Cambios sucesivos',
  next: 'Potencias y exponentes',
  intro: 'Un descuento sobre otro descuento no se suma. Esta lección muestra por qué, y aparece la sorpresa de subir y bajar lo mismo.',
  examples: ['25 % y luego 10 %', '0.675', '1.3 · 0.7', '0.91', '−40 %', '1.05', '1.2155'],
  scenes: [
    { id: 'dos', name: 'Dos descuentos', dur: 35,
      caps: [[0.5, 9.0, 'DOS REBAJAS', 'Un 25 % y después', 'un 10 % más.'], [9.4, 19.0, '!NO ES 35 %', 'El segundo descuento se', 'aplica al precio ya rebajado.'],
        [19.4, 34.4, 'SE MULTIPLICAN', '$0.75 · 0.9 = 0.675$:', 'un descuento total de 32.5 %.']],
      narr: [[0.5, 9.0, 'Una tienda rebaja todo un veinticinco por ciento, y en caja descuenta otro diez por ciento. Parece que fuera un treinta y cinco por ciento.'],
        [9.4, 19.0, 'Pero no. El segundo diez por ciento se calcula sobre el precio que ya estaba rebajado, que es más pequeño. Descuenta menos.'],
        [19.4, 34.4, 'Con los factores: cero coma setenta y cinco por cero coma nueve da cero coma seis siete cinco. Se paga el sesenta y siete coma cinco por ciento: el descuento total es treinta y dos coma cinco.']],
      ev: [[1.0, 'draw', 1.0], [3.0, 'cut'], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        bar(180, 600, W0, 90, { label: '100 %', a: .3 });
        bar(180, 740, W0 * .75, 90, { k: draw(t, 3.0, 1.0), label: '75 %', a: .45 });
        fade(A(t, 9.8), () => { bar(180, 880, W0 * .675, 90, { k: draw(t, 9.8, 1.0), label: '67.5 %', a: .7 }); stroke(P.no, 4, () => { X.moveTo(180 + W0 * .675, 860); X.lineTo(180 + W0 * .75, 860); }); label('10 % de 75 %', 180 + W0 * .72, 1010, P.no, { s: 32 }); });
        fade(A(t, 1.2) * (1 - A(t, 19.2)), () => M(R`25\% + 10\% \no{≠} 35\%`, 540, 1340, 74, { id: 'no' }));
        fade(A(t, 19.8), () => M(R`0.75 · 0.9 = \hl{0.675}`, 540, 1340, 86, { id: 'si' }));
        fade(A(t, 21.0), () => M(R`1 − 0.675 = 0.325 = 32.5\%`, 540, 1480, 62, { id: 'tot' }));
      } },
    { id: 'orden', name: 'El orden no importa', dur: 26,
      caps: [[0.5, 12.0, 'EL ORDEN', 'Primero el 10 % y luego el', '25 %: el mismo precio final.'], [12.4, 25.4, 'POR QUÉ', 'El producto es conmutativo:', '$0.9 · 0.75 = 0.75 · 0.9$.']],
      narr: [[0.5, 12.0, 'Si la tienda aplica primero el diez por ciento y después el veinticinco, el precio final es el mismo.'],
        [12.4, 25.4, 'Es la propiedad conmutativa del producto: multiplicar por cero coma nueve y luego por cero coma setenta y cinco da lo mismo que al revés.']],
      ev: [[1.0, 'draw', 1.0], [3.0, 'draw', 1.0], [12.8, 'shuffle', 1.2]],
      draw(t) {
        bar(180, 600, W0, 80, { label: '100 %', a: .3 }); bar(180, 720, W0 * .9, 80, { k: draw(t, 1.0, 1.0), label: '90 %', a: .45 }); bar(180, 840, W0 * .675, 80, { k: draw(t, 3.0, 1.0), label: '67.5 %', a: .7 });
        fade(A(t, 12.8), () => M(R`0.9 · 0.75 = 0.75 · 0.9 = 0.675`, 540, 1340, 66, { id: 'c' }));
      } },
    { id: 'ofertas', name: 'Dos ofertas', dur: 32,
      caps: [[0.5, 9.0, 'OFERTA A', 'Un 25 % y luego', 'un 20 % más.'], [9.4, 19.0, 'OFERTA B', 'Un 40 % de una vez.', ''],
        [19.4, 31.4, 'SON IGUALES', '$0.75 · 0.8 = 0.6$: las dos', 'dejan pagar el 60 %.']],
      narr: [[0.5, 9.0, 'Dos almacenes anuncian ofertas. El primero rebaja un veinticinco por ciento y luego otro veinte. Suena a cuarenta y cinco.'],
        [9.4, 19.0, 'El segundo rebaja un cuarenta por ciento de una vez. Parece peor.'],
        [19.4, 31.4, 'Con factores: cero coma setenta y cinco por cero coma ocho es cero coma seis. Las dos ofertas dejan pagar el sesenta por ciento. Son iguales.']],
      ev: [[1.0, 'draw', 1.0], [2.4, 'draw', 1.0], [9.8, 'draw', 1.0], [19.8, 'yes']],
      draw(t) {
        label('A', 120, 650, P.ink, { s: 46 }); bar(180, 600, W0, 70, { label: '100 %', a: .2 }); bar(180, 690, W0 * .75, 70, { k: draw(t, 1.0, 1.0), a: .4 }); bar(180, 780, W0 * .6, 70, { k: draw(t, 2.4, 1.0), label: '60 %', a: .7 });
        fade(A(t, 9.8), () => { label('B', 120, 1010, P.ink, { s: 46 }); bar(180, 960, W0, 70, { label: '100 %', a: .2 }); bar(180, 1050, W0 * .6, 70, { k: draw(t, 9.8, 1.0), label: '60 %', a: .7 }); });
        fade(A(t, 19.8), () => { stroke(P.ac, 3, () => { X.moveTo(180 + W0 * .6, 560); X.lineTo(180 + W0 * .6, 1140); }, { dash: [8, 8] }); M(R`0.75 · 0.8 = 0.6 = 1 − 0.4`, 540, 1340, 70, { id: 'e' }); });
      } },
    { id: 'subebaja', name: 'Subir y bajar', dur: 37,
      caps: [[0.5, 9.0, 'SUBE 30 %', 'Un precio de 100', 'sube a 130.'], [9.4, 19.0, 'BAJA 30 %', 'Ahora el 30 % es de 130:', 'baja 39 y queda en 91.'],
        [19.4, 28.0, '!NO VUELVE', '$1.3 · 0.7 = 0.91$:', 'se perdió un 9 %.'], [28.4, 36.4, 'EN EL OTRO ORDEN', 'Bajar y luego subir da', 'lo mismo: también 0.91.']],
      narr: [[0.5, 9.0, 'Ahora la sorpresa. Un precio de cien sube un treinta por ciento: queda en ciento treinta.'],
        [9.4, 19.0, 'Después baja un treinta por ciento. Pero ese treinta se calcula sobre ciento treinta: son treinta y nueve. Queda en noventa y uno.'],
        [19.4, 28.0, 'Subir y bajar el mismo porcentaje no deja el precio igual. Uno coma tres por cero coma siete da cero coma noventa y uno.'],
        [28.4, 36.4, 'Y al revés pasa lo mismo, porque el producto es conmutativo. En los dos órdenes se pierde un nueve por ciento.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'cut'], [19.8, 'no'], [28.8, 'shuffle', 1.0]],
      draw(t) {
        const U = 6;
        bar(150, 600, 100 * U, 80, { label: '100', a: .3 }); bar(150, 720, 130 * U, 80, { k: draw(t, 1.0, 1.0), label: '130', a: .5 });
        fade(A(t, 9.8), () => { bar(150, 840, 91 * U, 80, { k: draw(t, 9.8, 1.0), label: '91', a: .7 }); stroke(P.no, 4, () => { X.moveTo(150 + 91 * U, 940); X.lineTo(150 + 130 * U, 940); }); label('− 39', 150 + 110 * U, 990, P.no, { s: 34 }); });
        fade(A(t, 19.8), () => { stroke(P.ac, 3, () => { X.moveTo(150 + 100 * U, 580); X.lineTo(150 + 100 * U, 940); }, { dash: [8, 8] }); label('no llega a 100', 150 + 100 * U, 560, P.ac, { s: 32 }); });
        fade(A(t, 19.8), () => M(R`1.3 · 0.7 = \hl{0.91}`, 540, 1340, 86, { id: 'r' }));
        fade(A(t, 28.8), () => M(R`0.7 · 1.3 = 0.91`, 540, 1480, 66, { id: 'r2' }));
      } },
    { id: 'volver', name: 'Cuánto subir para volver', dur: 33,
      caps: [[0.5, 9.0, 'UNA CAÍDA DEL 40 %', 'Un precio de 100', 'baja a 60.'], [9.4, 19.0, 'PARA VOLVER A 100', 'Se busca el factor $x$:', '$0.6 · x = 1$.'],
        [19.4, 32.4, 'HAY QUE SUBIR MUCHO', R`$x = \frac{1}{0.6} ≈ 1.667$:`, 'un 66.7 %, no un 40 %.']],
      narr: [[0.5, 9.0, 'Una acción vale cien y cae un cuarenta por ciento: queda en sesenta.'],
        [9.4, 19.0, 'Para volver a cien hay que buscar el factor que multiplicado por cero coma seis dé uno.'],
        [19.4, 32.4, 'Ese factor es uno entre cero coma seis: uno coma seis seis siete. Hay que subir casi un sesenta y siete por ciento, mucho más que el cuarenta que se perdió.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'rise'], [19.8, 'draw', 1.4]],
      draw(t) {
        const U = 6; bar(150, 620, 100 * U, 90, { label: '100', a: .3 }); bar(150, 760, 60 * U, 90, { k: draw(t, 1.0, 1.0), label: '60', a: .5 });
        fade(A(t, 19.8), () => { bar(150 + 60 * U, 760, 40 * U, 90, { k: draw(t, 19.8, 1.4), c: P.ac, a: .8, label: '+40', s: 36 }); brace(150 + 60 * U, 150 + 100 * U, 880, { label: '40 de 60 = 66.7 %', k: 1, s: 34 }); });
        fade(A(t, 9.8), () => M(R`0.6 · x = 1`, 540, 1340, 86, { id: 'e' }));
        fade(A(t, 20.4), () => M(R`x = \frac{1}{0.6} ≈ \hl{1.667}`, 540, 1500, 76, { id: 'x' }));
      } },
    { id: 'potencia', name: 'Crecer varias veces', dur: 37,
      caps: [[0.5, 9.0, 'CRECER CADA AÑO', 'Un ahorro crece el 5 %', 'cada año, cuatro años.'], [9.4, 19.0, 'EL MISMO FACTOR', 'Cuatro veces por 1.05:', 'una potencia.'],
        [19.4, 28.0, 'LA CUENTA', '$1.05^{4} ≈ 1.2155$:', 'crece un 21.55 %.'], [28.4, 36.4, '!NO ES 20 %', 'Cada año el 5 % es de', 'un número más grande.']],
      narr: [[0.5, 9.0, 'Un ahorro crece un cinco por ciento cada año. Al cabo de cuatro años, parece que hubiera crecido un veinte.'],
        [9.4, 19.0, 'Cada año se multiplica por uno coma cero cinco. Cuatro años son cuatro veces el mismo factor: uno coma cero cinco a la cuarta.'],
        [19.4, 28.0, 'Eso da uno coma dos uno cinco cinco. El ahorro creció un veintiuno coma cincuenta y cinco por ciento.'],
        [28.4, 36.4, 'Es más que veinte, porque cada año el cinco por ciento se calcula sobre lo que ya había crecido. Es el comienzo del interés compuesto.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'pop', 0], [11.0, 'pop', 1], [12.2, 'pop', 2], [13.4, 'pop', 3], [19.8, 'card']],
      draw(t) {
        const vals = [1, 1.05, 1.1025, 1.157625, 1.21550625], U = 560;
        vals.forEach((v, i) => fade(i ? A(t, 9.8 + (i - 1) * 1.2) : 1, () => { const y = 580 + i * 100; bar(150, y, U * v, 70, { k: i ? draw(t, 9.8 + (i - 1) * 1.2, .8) : 1, a: .25 + i * .12 }); M(v.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''), 150 + U * v + 30, y + 50, 40, { a: 'l', pass: true }); T('año ' + i, 120, y + 48, { s: 28, c: P.mute, a: 'r', pass: true }); }));
        fade(A(t, 19.8), () => M(R`1.05^{4} ≈ \hl{1.2155}`, 540, 1340, 86, { id: 'p' }));
        fade(A(t, 28.8), () => M(R`1.2155 \;>\; 1.20`, 540, 1490, 66, { id: 'c' }));
      } },
    { id: 'regla', name: 'La regla', dur: 29,
      caps: [[0.5, 9.0, 'LA REGLA', 'Varios cambios seguidos:', 'se multiplican los factores.'], [9.4, 19.0, 'Y SE LEE', 'Factor total mayor que 1:', 'subió. Menor que 1: bajó.'],
        [19.4, 28.4, 'EJEMPLO', '$1.3 · 0.9 = 1.17$:', 'subió un 17 %.']],
      narr: [[0.5, 9.0, 'La regla general: para encadenar varios cambios, se multiplican sus factores.'],
        [9.4, 19.0, 'Si el factor total es mayor que uno, el precio subió; si es menor, bajó. Lo que sobra o falta para llegar a uno es el cambio total.'],
        [19.4, 28.4, 'Subir treinta por ciento y bajar diez: uno coma tres por cero coma nueve, uno coma diecisiete. Subió un diecisiete por ciento en total.']],
      ev: [[1.0, 'rise'], [9.8, 'tag'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`f_{\t{total}} = f_{1} · f_{2} · … · f_{n}`, 540, 660, 76, { id: 'g' }));
        fade(A(t, 9.8), () => { M(R`f > 1 \;:\; \t{subió}`, 540, 860, 64, { id: 's', c: P.ac }); M(R`f < 1 \;:\; \t{bajó}`, 540, 980, 64, { id: 'b' }); });
        fade(A(t, 19.8), () => M(R`1.3 · 0.9 = 1.17 \;⇒\; \hl{+17\%}`, 540, 1340, 70, { id: 'e' }));
      } },
  ],
  sum: [['Dos descuentos', R`0.75 · 0.9 = 0.675`], ['Subir y bajar', R`1.3 · 0.7 = 0.91`], ['Volver', R`0.6 · x = 1 \;⇒\; x ≈ 1.667`], ['Crecer n veces', R`1.05^{4} ≈ 1.2155`], ['La regla', R`f_{\t{total}} = f_{1} · f_{2} · … · f_{n}`]],
  end: ['Los cambios seguidos no se suman:', 'se multiplican.'],
  finNarr: [[0.8, 9.0, 'En resumen: cambios porcentuales seguidos se multiplican, en cualquier orden.'],
    [9.2, 16.0, 'Subir y bajar lo mismo no regresa, y crecer varias veces es una potencia del factor.']],
};
