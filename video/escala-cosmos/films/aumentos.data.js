// «El factor escondido» · lección alg-13c (Aumentos y descuentos). Datos puros.
// Historia (docs/storytelling-videos.md): en 2018 una ley de Colombia dice que la propina es voluntaria y que la sugerida no
// pasa del 10 % del consumo; en cada cuenta hay escondido un factor, 1.10. Analogías: el factor como un solo número que
// cambia el precio, la ida y vuelta (multiplicar y dividir) y la entrada de cine. La sorpresa: quitarle el 10 % a la cuenta
// con propina no devuelve el consumo. (El IVA no se usa: ya sale en un ejercicio de la lección.) Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'propina', name: 'COLOMBIA, 2018', dur: 28, formula: [['propina', 'it'], [' ≤ 10 %', 'r']],
      caps: [[1.0, 9.0, 'Colombia, 2018', 'una ley regula la propina en restaurantes'], [9.6, 18.0, 'Es voluntaria', 'y la sugerida no puede pasar del 10 %'], [18.6, 27.4, 'Hay un atajo', 'multiplicar por un solo número']],
      narr: [[1.0, 9.0, 'Colombia, dos mil dieciocho. Una ley pone reglas a la propina que se sugiere en bares y restaurantes.'], [9.6, 18.0, 'La propina es voluntaria, y la que sugiere la cuenta no puede pasar del diez por ciento del consumo.'], [18.6, 27.4, 'Para sumarle a una cuenta su diez por ciento hay un atajo: multiplicar por un número llamado factor.']] },
    { id: 'descuento', name: 'UN DESCUENTO', dur: 28, formula: [['P', 'i'], [' − 0.25', 'r'], ['P', 'i'], [' = 0.75', 'r'], ['P', 'i']],
      caps: [[0.8, 9.4, 'Un descuento del 25 %', 'deja pagar el 75 %'], [10.0, 18.4, 'Por la distributiva', 'P − 0.25 P = (1 − 0.25) P = 0.75 P'], [19.0, 27.4, '0.75 es el factor', '120 000 · 0.75 = 90 000']],
      narr: [[0.8, 9.4, 'Empecemos por un descuento del veinticinco por ciento. Si te quitan un cuarto del precio, pagas las otras tres cuartas partes.'], [10.0, 18.4, 'Con la distributiva: P menos cero punto veinticinco P es uno menos cero punto veinticinco, por P.'], [19.0, 27.4, 'Cero punto setenta y cinco es el factor. Un precio de ciento veinte mil queda en noventa mil.']] },
    { id: 'factor', name: 'EL FACTOR', dur: 30, formula: [['× (1 ± ', 'r'], ['r', 'i'], ['/100)', 'r']],
      caps: [[0.8, 9.4, 'Aumentar r %', 'multiplicar por 1 + r/100'], [10.0, 19.4, 'Descontar r %', 'multiplicar por 1 − r/100'], [20.0, 29.4, 'El factor lo dice todo', 'mayor que 1 sube; menor que 1 baja']],
      narr: [[0.8, 9.4, 'En general, aumentar r por ciento es multiplicar por uno más r centésimas: lo de antes, más su parte nueva.'], [10.0, 19.4, 'Y descontar r por ciento es multiplicar por uno menos r centésimas: lo de antes, menos lo que se quita.'], [20.0, 29.4, 'Un factor mayor que uno hace crecer; uno menor que uno hace bajar. Uno exacto deja todo igual.']] },
    { id: 'propfactor', name: 'EL FACTOR DE LA PROPINA', dur: 28, formula: [['100 000 · 1.10 = 110 000', 'r']],
      caps: [[0.8, 9.4, 'Propina del 10 %', 'factor 1 + 0.10 = 1.10'], [10.0, 18.4, 'Una cena de 100 000', '100 000 · 1.10 = 110 000'], [19.0, 27.4, 'La propina es la diferencia', '10 000 pesos, el 10 % de 100 000']],
      narr: [[0.8, 9.4, 'Sumar una propina del diez por ciento es un aumento: su factor es uno punto diez.'], [10.0, 18.4, 'Una cena de cien mil pesos, con la propina, cuesta ciento diez mil.'], [19.0, 27.4, 'La propina es la diferencia: diez mil pesos, el diez por ciento del consumo.']] },
    { id: 'trampa', name: 'LA TRAMPA', dur: 30, formula: [['110 000 · 0.90 = 99 000', 'r']],
      caps: [[0.8, 9.4, 'Volver al consumo', 'con 110 000 en la cuenta'], [10.0, 19.4, 'Quitar el 10 % no sirve', '110 000 · 0.90 = 99 000'], [20.0, 29.4, 'El 10 % era de otro número', 'se calculó sobre 100 000, no sobre 110 000']],
      narr: [[0.8, 9.4, 'Ahora al revés: la cuenta dice ciento diez mil con propina, y quieres saber cuánto fue el consumo.'], [10.0, 19.4, 'Quitarle el diez por ciento da noventa y nueve mil. No son los cien mil de antes.'], [20.0, 29.4, 'El error: el diez por ciento se calculó sobre cien mil, no sobre ciento diez mil.']] },
    { id: 'dividir', name: 'DIVIDIR ENTRE EL FACTOR', dur: 28, formula: [['110 000 ÷ 1.10 = 100 000', 'r']],
      caps: [[0.8, 9.4, 'Para deshacer un factor', 'se divide entre él'], [10.0, 18.4, '110 000 ÷ 1.10', '= 100 000, el consumo'], [19.0, 27.4, 'Ida y vuelta', '× 1.10 y luego ÷ 1.10 deja todo igual']],
      narr: [[0.8, 9.4, 'Lo que se hizo multiplicando se deshace dividiendo entre el mismo factor.'], [10.0, 18.4, 'Ciento diez mil entre uno punto diez: cien mil exactos.'], [19.0, 27.4, 'Por uno punto diez de ida, y entre uno punto diez de vuelta: la cuenta vuelve al consumo.']] },
    { id: 'cambio', name: 'CAMBIO PORCENTUAL', dur: 30, formula: [['cambio', 'it'], [' / ', 'r'], ['valor de antes', 'it']],
      caps: [[0.8, 9.4, 'El cambio porcentual', 'el cambio dividido entre el valor de antes'], [10.0, 19.4, 'Una entrada de cine: 12 000 → 15 000', '3 000 / 12 000 = 0.25: subió 25 %'], [20.0, 29.4, 'El valor de antes es la referencia', 'es el 100 %']],
      narr: [[0.8, 9.4, 'Para medir cuánto cambió algo en porcentaje, se divide el cambio entre el valor de antes.'], [10.0, 19.4, 'Una entrada de cine pasa de doce mil a quince mil pesos. Subió tres mil, y tres mil entre doce mil es un cuarto: veinticinco por ciento.'], [20.0, 29.4, 'El valor de antes es la referencia: el cien por ciento.']] },
    { id: 'simetria', name: 'NO ES SIMÉTRICO', dur: 30, formula: [['3 000 / 15 000 = 0.2', 'r']],
      caps: [[0.8, 9.4, 'Si vuelve a 12 000', 'baja 3 000 sobre 15 000'], [10.0, 19.4, '3 000 / 15 000 = 0.2', 'bajó 20 %, no 25 %'], [20.0, 29.4, 'Mismo cambio, otro porcentaje', 'porque cambió la referencia']],
      narr: [[0.8, 9.4, 'Si después la entrada vuelve a doce mil, baja los mismos tres mil pesos.'], [10.0, 19.4, 'Pero ahora la referencia es quince mil: tres mil entre quince mil es un quinto, el veinte por ciento.'], [20.0, 29.4, 'Subió veinticinco y bajó veinte: el mismo cambio en pesos es otro porcentaje, porque cambió el valor de antes.']] },
    { id: 'signo', name: 'EL SIGNO', dur: 28, formula: [['−20 %', 'r'], ['  ⟶  ', 'r'], ['× 0.8', 'r']],
      caps: [[0.8, 9.4, 'Subir es un cambio positivo', 'bajar, uno negativo: −20 % es × 0.8'], [10.0, 18.4, 'Duplicar es subir 100 %', 'factor 2 = 1 + 1'], [19.0, 27.4, 'Bajar no pasa de −100 %', 'con factor 0 ya no queda nada']],
      narr: [[0.8, 9.4, 'Un aumento es un cambio positivo y una rebaja, uno negativo: menos veinte por ciento es factor cero punto ocho.'], [10.0, 18.4, 'Duplicar un precio es subirlo el cien por ciento: el factor es dos, uno más uno.'], [19.0, 27.4, 'Y una rebaja nunca pasa del menos cien por ciento: con factor cero ya no queda nada que quitar.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['× 1.10', 'r'], ['   ida      ', 'it'], ['÷ 1.10', 'r'], ['   vuelta', 'it']],
      caps: [[0.8, 10.4, 'Un número en cada cuenta', 'el factor: × 1.10 de ida, ÷ 1.10 de vuelta']],
      narr: [[0.8, 10.4, 'Detrás de cada cuenta con propina hay escondido un factor: uno punto diez.'], [11.0, 20.4, 'Multiplicar por él agrega la propina; dividir entre él la quita.'], [21.0, 29.4, 'Y cualquier cambio se mide sobre el valor de antes.']] },
  ];
  const WORLD = 'ÁLGEBRA · ESCALAS Y PROPORCIONES', TITLE = 'AUMENTOS Y DESCUENTOS', LINE = 'Cambiar un porcentaje es multiplicar por un factor.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-13c' };
})();
if (typeof module !== 'undefined') module.exports = D;
