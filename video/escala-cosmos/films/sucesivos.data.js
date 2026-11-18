// «La predicción de Moore» · lección alg-13d (Cambios sucesivos). Datos puros.
// Historia (docs/storytelling-videos.md): en 1965 Gordon Moore predice que los transistores de un chip se duplicarán a un
// ritmo fijo (en 1975: cada dos años); duplicar es +100 % repetido, una potencia. Analogías: el abrigo con dos descuentos,
// la acción que cae 50 % y sube 50 %, el 7 % anual. La sorpresa: 40 % y 25 % no dan 65 %, y subir y bajar lo mismo nunca
// deja el precio igual. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'moore', name: 'ESTADOS UNIDOS, 1965', dur: 28, formula: [['× 2', 'r'], ['  cada dos años', 'it']],
      caps: [[1.0, 9.0, 'Estados Unidos, 1965', 'Gordon Moore estudia los chips'], [9.6, 18.0, 'Una predicción', 'los transistores se duplicarán a un ritmo fijo'], [18.6, 27.4, 'Duplicar es subir 100 %', 'y ese cambio se repite una y otra vez']],
      narr: [[1.0, 9.0, 'Estados Unidos, mil novecientos sesenta y cinco. El químico Gordon Moore estudia cuántos transistores caben en un chip.'], [9.6, 18.0, 'Predice que esa cantidad se duplicará cada año. En mil novecientos setenta y cinco ajusta el ritmo: cada dos años.'], [18.6, 27.4, 'Duplicar es crecer el cien por ciento. Y ese crecimiento se repite, una vez tras otra.']] },
    { id: 'dosdescuentos', name: 'DOS DESCUENTOS', dur: 28, formula: [['0.60 · 0.75 = 0.45', 'r']],
      caps: [[0.8, 9.4, 'Un 40 % y luego un 25 %', 'no es un 65 % de descuento'], [10.0, 18.4, 'Cada descuento es un factor', '0.60 y luego 0.75'], [19.0, 27.4, 'Los factores se multiplican', '0.60 · 0.75 = 0.45: se paga el 45 %']],
      narr: [[0.8, 9.4, 'Antes de los chips, una tienda. Un abrigo tiene cuarenta por ciento de descuento, y en caja te descuentan otro veinticinco.'], [10.0, 18.4, 'Cada descuento es un factor: cero punto sesenta y luego cero punto setenta y cinco.'], [19.0, 27.4, 'Seguidos, se multiplican: cero punto cuarenta y cinco. Pagas el cuarenta y cinco por ciento.']] },
    { id: 'nosuman', name: 'NO SE SUMAN', dur: 28, formula: [['200 000 → 120 000 → 90 000', 'r']],
      caps: [[0.8, 9.4, 'Un abrigo de 200 000', '200 000 · 0.60 = 120 000'], [10.0, 18.4, 'El segundo es sobre lo rebajado', '120 000 · 0.75 = 90 000'], [19.0, 27.4, 'Descuento total: 55 %', 'no 65 %: los porcentajes no se suman']],
      narr: [[0.8, 9.4, 'Con un abrigo de doscientos mil pesos: el primer descuento lo deja en ciento veinte mil.'], [10.0, 18.4, 'El segundo veinticinco por ciento se calcula sobre ciento veinte mil, no sobre doscientos mil: queda en noventa mil.'], [19.0, 27.4, 'El descuento total es del cincuenta y cinco por ciento, no del sesenta y cinco: los porcentajes seguidos no se suman.']] },
    { id: 'orden', name: 'EL ORDEN NO IMPORTA', dur: 28, formula: [['0.75 · 0.60 = 0.60 · 0.75', 'r']],
      caps: [[0.8, 9.4, 'Primero 25 % y luego 40 %', '0.75 · 0.60 = 0.45'], [10.0, 18.4, 'El mismo precio final', '90 000 en los dos órdenes'], [19.0, 27.4, 'El producto es conmutativo', 'por eso el orden no cambia nada']],
      narr: [[0.8, 9.4, 'Y si la caja aplica primero el veinticinco y luego el cuarenta, el resultado es el mismo.'], [10.0, 18.4, 'Doscientos mil por cero punto setenta y cinco, ciento cincuenta mil; por cero punto sesenta, noventa mil.'], [19.0, 27.4, 'La multiplicación es conmutativa, así que el orden de los factores no cambia el precio final.']] },
    { id: 'subebaja', name: 'SUBIR Y BAJAR', dur: 30, formula: [['0.5 · 1.5 = 0.75', 'r']],
      caps: [[0.8, 9.4, 'Una acción vale 100', 'un año baja 50 % y al siguiente sube 50 %'], [10.0, 19.4, '0.5 · 1.5 = 0.75', 'termina en 75, no en 100'], [20.0, 29.4, 'Tras perder la mitad', 'para volver a 100 hay que subir 100 %']],
      narr: [[0.8, 9.4, 'En la bolsa pasa algo parecido. Una acción vale cien; un año cae el cincuenta por ciento y al siguiente sube el cincuenta.'], [10.0, 19.4, 'Factor cero punto cinco y luego uno punto cinco: cero punto setenta y cinco. Termina valiendo setenta y cinco, no cien.'], [20.0, 29.4, 'Después de perder la mitad, para volver a cien hay que duplicar: subir el cien por ciento.']] },
    { id: 'nuncaigual', name: 'NUNCA QUEDA IGUAL', dur: 28, formula: [['(1 + ', 'r'], ['r', 'i'], [')(1 − ', 'r'], ['r', 'i'], [') = 1 − ', 'r'], ['r', 'i'], ['²', 'r']],
      caps: [[0.8, 9.4, 'Subir y bajar r (en decimal)', '(1 + r)(1 − r) = 1 − r²'], [10.0, 18.4, 'Con r = 0.3', '1.3 · 0.7 = 0.91: se pierde el 9 %'], [19.0, 27.4, 'Siempre queda por debajo', 'r² es positivo si r ≠ 0']],
      narr: [[0.8, 9.4, 'En general, con r en decimal, subir y bajar el mismo porcentaje es uno más r por uno menos r: uno menos r al cuadrado.'], [10.0, 18.4, 'Con el treinta por ciento, uno punto tres por cero punto siete es cero punto noventa y uno: se pierde el nueve por ciento.'], [19.0, 27.4, 'Como r al cuadrado es positivo, el resultado siempre queda por debajo del de partida.']] },
    { id: 'potencia', name: 'UNA POTENCIA', dur: 30, formula: [['factor', 'it'], ['ⁿ', 'r']],
      caps: [[0.8, 9.4, 'El mismo cambio n veces', 'el factor elevado a la n'], [10.0, 19.4, 'Duplicar cada dos años', 'en 10 años: 2⁵ = 32 veces'], [20.0, 29.4, 'En 50 años, 25 duplicaciones', '2²⁵ ≈ 33 millones de veces']],
      narr: [[0.8, 9.4, 'Cuando el mismo cambio se repite n veces, se multiplican n factores iguales: es una potencia.'], [10.0, 19.4, 'Duplicar cada dos años es factor dos. En diez años son cinco duplicaciones: dos a la quinta, treinta y dos veces.'], [20.0, 29.4, 'En cincuenta años son veinticinco duplicaciones: dos a la veinticinco, unos treinta y tres millones de veces.']] },
    { id: 'chips', name: 'DEL 4004 A HOY', dur: 28, formula: [['2 300 · 2²⁵ ≈ 77 000 000 000', 'r']],
      caps: [[0.8, 9.4, '1971: el Intel 4004', 'unos 2 300 transistores'], [10.0, 18.4, '2 300 · 2²⁵', '50 años después: unos 77 000 millones'], [19.0, 27.4, 'Los chips de hoy', 'tienen decenas de miles de millones']],
      narr: [[0.8, 9.4, 'En mil novecientos setenta y uno, el primer microprocesador comercial, el Intel cuatro mil cuatro, tenía unos dos mil trescientos transistores.'], [10.0, 18.4, 'Multiplicado por dos a la veinticinco, da unos setenta y siete mil millones.'], [19.0, 27.4, 'Y los chips grandes de hoy tienen, en efecto, decenas de miles de millones de transistores.']] },
    { id: 'pocoapoco', name: 'POCO A POCO', dur: 30, formula: [['1.07', 'r'], ['¹⁰', 'r'], [' ≈ 1.97', 'r']],
      caps: [[0.8, 9.4, 'Un 7 % cada año parece poco', 'pero se acumula'], [10.0, 19.4, '1.07 elevado a 10', '≈ 1.97: casi el doble en 10 años'], [20.0, 29.4, 'Sumando saldría 70 %', 'multiplicando sale 97 %']],
      narr: [[0.8, 9.4, 'Un cambio pequeño repetido también crece mucho. Subir siete por ciento cada año parece poco.'], [10.0, 19.4, 'Pero uno punto cero siete a la diez es casi uno punto noventa y siete: en diez años, casi el doble.'], [20.0, 29.4, 'Sumando los porcentajes saldría setenta por ciento. Multiplicando, noventa y siete.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['× ', 'r'], ['f', 'i'], ['₁', 'r'], [' × ', 'r'], ['f', 'i'], ['₂', 'r'], [' × … ', 'r']],
      caps: [[0.8, 10.4, 'La predicción de Moore', 'un +100 % repetido: una potencia']],
      narr: [[0.8, 10.4, 'La predicción de Moore se cumplió durante décadas, y su secreto es solo este: un mismo factor, multiplicado una y otra vez.'], [11.0, 20.4, 'Los cambios seguidos se multiplican, en cualquier orden.'], [21.0, 29.4, 'Y por eso subir y bajar el mismo porcentaje nunca deja las cosas como estaban.']] },
  ];
  const WORLD = 'ÁLGEBRA · ESCALAS Y PROPORCIONES', TITLE = 'CAMBIOS SUCESIVOS', LINE = 'Los cambios seguidos se multiplican.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-13d' };
})();
if (typeof module !== 'undefined') module.exports = D;
