// «La regla de oro» · lección alg-12f (Regla de tres simple y compuesta). Datos puros.
// Historia (docs/storytelling-videos.md): en el año 499 Aryabhata describe la regla de los tres términos; los mercaderes la
// llevan al mundo árabe y a Europa, donde la llaman «regla de oro». Analogías: la tabla (columnas = magnitudes, filas =
// situaciones), el café (directa), los víveres de una expedición (inversa) y las impresoras (compuesta). La sorpresa:
// armada al revés, la inversa da más comida con más gente. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'aryabhata', name: 'INDIA, AÑO 499', dur: 28, formula: [['a', 'i'], [' → ', 'r'], ['b', 'i'], ['     ', 'r'], ['c', 'i'], [' → ', 'r'], ['x', 'i']],
      caps: [[1.0, 9.0, 'India, año 499', 'Aryabhata escribe la regla de los tres términos'], [9.6, 18.0, 'Un viaje de siglos', 'de la India al mundo árabe y a Europa'], [18.6, 27.4, 'En Europa la llaman «regla de oro»', 'tres datos conocidos dan el cuarto']],
      narr: [[1.0, 9.0, 'India, año cuatrocientos noventa y nueve. El astrónomo Aryabhata describe la regla de los tres términos.'], [9.6, 18.0, 'Con los siglos viaja al mundo árabe y luego a Europa, donde se enseña en los libros de cuentas.'], [18.6, 27.4, 'Allí la llaman la regla de oro: con tres datos conocidos se encuentra el cuarto. Hoy la llamamos regla de tres.']] },
    { id: 'tabla', name: 'LA TABLA', dur: 28, formula: [['2 tazas → 3 cucharadas', 'r']],
      caps: [[0.8, 9.4, 'Una columna por magnitud', 'una fila por situación'], [10.0, 18.4, 'Tres datos y una x', 'la x es el término que falta'], [19.0, 27.4, 'Antes de calcular, decidir', 'si es directa o inversa']],
      narr: [[0.8, 9.4, 'La regla de tres empieza con una tabla. Cada columna es una magnitud y cada fila es una situación.'], [10.0, 18.4, 'Para dos tazas de café se usan tres cucharadas. Para ocho tazas, x cucharadas. Tres datos y una incógnita.'], [19.0, 27.4, 'Antes de calcular hay que decidir: si al duplicar una la otra se duplica, es directa; si se reduce a la mitad, es inversa.']] },
    { id: 'directa', name: 'DIRECTA', dur: 30, formula: [['3 ÷ 2 = 1.5', 'r'], ['     ', 'r'], ['8 · 1.5 = 12', 'r']],
      caps: [[0.8, 9.4, 'Directa', 'más tazas, más café, en la misma razón'], [10.0, 19.4, 'Reducir a la unidad', '3 ÷ 2 = 1.5 cucharadas por taza'], [20.0, 29.4, 'Para 8 tazas', '8 · 1.5 = 12 cucharadas']],
      narr: [[0.8, 9.4, 'Aquí, más tazas piden más café, y en la misma razón: es una regla de tres directa.'], [10.0, 19.4, 'Una manera de resolverla es reducir a la unidad: tres cucharadas para dos tazas es una y media por taza.'], [20.0, 29.4, 'Y para ocho tazas, ocho por una y media: doce cucharadas.']] },
    { id: 'cocientes', name: 'IGUALAR COCIENTES', dur: 28, formula: [['3', 'r'], ['/', 'r'], ['2', 'r'], [' = ', 'r'], ['x', 'i'], ['/', 'r'], ['8', 'r']],
      caps: [[0.8, 9.4, 'Otra manera: la proporción', '3 / 2 = x / 8'], [10.0, 18.4, 'Productos cruzados', '2 · x = 3 · 8, así que x = 12'], [19.0, 27.4, 'Flechas en el mismo sentido', 'en la directa se conserva el cociente']],
      narr: [[0.8, 9.4, 'Otra manera: como el cociente se conserva, tres sobre dos es igual a x sobre ocho.'], [10.0, 18.4, 'Por la propiedad fundamental, dos por x es tres por ocho, veinticuatro. Entonces x es doce.'], [19.0, 27.4, 'En la tabla, las dos columnas suben juntas: las flechas van en el mismo sentido.']] },
    { id: 'inversa', name: 'INVERSA', dur: 30, formula: [['12', 'r'], [' · ', 'r'], ['30', 'r'], [' = ', 'r'], ['18', 'r'], [' · ', 'r'], ['x', 'i']],
      caps: [[0.8, 9.4, 'Víveres para una expedición', 'alcanzan 30 días para 12 personas'], [10.0, 19.4, 'Si van 18 personas', 'doble de personas, mitad de días: inversa'], [20.0, 29.4, 'Se conserva el producto', '12 · 30 = 360 raciones de un día']],
      narr: [[0.8, 9.4, 'Ahora, los víveres de una expedición alcanzan para treinta días si viajan doce personas.'], [10.0, 19.4, 'Si viajan dieciocho, la comida dura menos: con el doble de personas duraría la mitad. Es una regla de tres inversa.'], [20.0, 29.4, 'Lo que se conserva es el producto: doce por treinta son trescientas sesenta raciones, una por persona cada día.']] },
    { id: 'inversa2', name: 'EL PRODUCTO SE CONSERVA', dur: 28, formula: [['x', 'i'], [' = 360 ÷ 18 = 20', 'r']],
      caps: [[0.8, 9.4, '360 raciones entre 18 personas', 'x = 360 ÷ 18 = 20 días'], [10.0, 18.4, 'Flechas cruzadas', 'en la inversa una sube y la otra baja'], [19.0, 27.4, 'Armada como directa, da 45 días', 'más gente y la comida dura más: absurdo']],
      narr: [[0.8, 9.4, 'Repartidas entre dieciocho personas, trescientas sesenta raciones duran trescientos sesenta entre dieciocho: veinte días.'], [10.0, 18.4, 'En la tabla, una columna sube y la otra baja: las flechas se cruzan.'], [19.0, 27.4, 'Si se armara como directa, saldrían cuarenta y cinco días: más gente y la misma comida durando más. No tiene sentido.']] },
    { id: 'compuesta', name: 'COMPUESTA', dur: 30, formula: [['4 impr. · 5 min → 1200 págs.', 'r']],
      caps: [[0.8, 9.4, 'Más de dos magnitudes', 'regla de tres compuesta'], [10.0, 19.4, '4 impresoras, 5 min: 1 200 páginas', '6 impresoras, 3 min: x páginas'], [20.0, 29.4, 'Se cambia una magnitud a la vez', 'y cada una decide si es directa o inversa']],
      narr: [[0.8, 9.4, 'Cuando intervienen más de dos magnitudes, la regla es compuesta.'], [10.0, 19.4, 'Cuatro impresoras iguales imprimen mil doscientas páginas en cinco minutos. Seis impresoras, en tres minutos, imprimen x páginas.'], [20.0, 29.4, 'El truco: cambiar una magnitud a la vez, y decidir en cada paso si es directa o inversa.']] },
    { id: 'cadena', name: 'UNA A LA VEZ', dur: 30, formula: [['1200 · 6/4 · 3/5 = 1080', 'r']],
      caps: [[0.8, 9.4, 'Primero, las impresoras: de 4 a 6', 'más impresoras, más páginas: · 6/4'], [10.0, 19.4, 'Luego, el tiempo: de 5 a 3 minutos', 'menos tiempo, menos páginas: · 3/5'], [20.0, 29.4, '1 200 · 6/4 · 3/5 = 1 080', 'las razones se multiplican en cadena']],
      narr: [[0.8, 9.4, 'Primero las impresoras, con el tiempo fijo: de cuatro a seis. Más impresoras, más páginas: se multiplica por seis cuartos.'], [10.0, 19.4, 'Luego el tiempo, con seis impresoras: de cinco a tres minutos. Menos tiempo, menos páginas: por tres quintos.'], [20.0, 29.4, 'Mil doscientos por seis cuartos por tres quintos: mil ochenta páginas.']] },
    { id: 'volteada', name: 'SI ES INVERSA, SE VOLTEA', dur: 28, formula: [['30 · 12/18 · 3/2 = 30', 'r']],
      caps: [[0.8, 9.4, 'Si una magnitud es inversa', 'su razón entra volteada'], [10.0, 18.4, '18 personas, 2 comidas al día', 'antes eran 12 personas y 3 comidas'], [19.0, 27.4, '30 · 12/18 · 3/2 = 30 días', 'los dos cambios se compensan']],
      narr: [[0.8, 9.4, 'Si alguna magnitud es inversa, su razón entra volteada en la cadena.'], [10.0, 18.4, 'La expedición otra vez, ahora con dieciocho personas que hacen dos comidas al día en vez de tres.'], [19.0, 27.4, 'Treinta por doce dieciochoavos por tres medios da treinta días: más personas, pero cada una come menos.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['directa', 'it'], [': cociente   ', 'r'], ['inversa', 'it'], [': producto', 'r']],
      caps: [[0.8, 10.4, 'La regla de oro', 'una tabla, una decisión y una proporción']],
      narr: [[0.8, 10.4, 'Mil quinientos años después de Aryabhata, la regla de tres sigue siendo la cuenta de todos los días.'], [11.0, 20.4, 'Una tabla, una decisión, directa o inversa, y una proporción.'], [21.0, 29.4, 'Con eso, tres datos bastan para encontrar el cuarto.']] },
  ];
  const WORLD = 'ÁLGEBRA · ESCALAS Y PROPORCIONES', TITLE = 'REGLA DE TRES', LINE = 'Tres datos, una tabla y una decisión.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-12f' };
})();
if (typeof module !== 'undefined') module.exports = D;
