// «Decimales y porcentajes» · Preuniversitario UdeA, razonamiento lógico, mundo 1, lección pu-cm-3. Datos puros.
// Reto al inicio con una pregunta real del examen de admisión UdeA 2025-2 (los tenis de Carlos: 120 000 con −10 % y luego
// +10 % de impuesto; pagó 118 800) que se resuelve al final. En medio: por ciento es «de cada 100», fracción → decimal →
// porcentaje, el bloque que se repite en 1/13 (taller del preuniversitario UdeA), comparar todo en decimal, el porcentaje
// de una cantidad armado con pedazos, cada cambio es un factor y otra pregunta real (UdeA 2026-1, la barra de chocolate).
const D = (() => {
  const SCENES = [
    { id: 'reto', name: 'LOS TENIS DE CARLOS', dur: 30,
      caps: [[1.0, 9.4, 'Los tenis de Carlos', 'un problema para empezar'], [10.0, 19.4, '−10 % y luego +10 %', 'Carlos esperaba pagar 120 000'], [20.0, 29.4, 'Cuatro opciones', 'al final sabremos si Carlos tenía razón']],
      narr: [[1.0, 9.4, 'Un problema para empezar. Carlos compra unos tenis de ciento veinte mil pesos, rebajados un diez por ciento.'], [10.0, 19.4, 'Al pagar le cobran además un impuesto del diez por ciento por ser importados. Carlos reclama: si se quita el diez y se pone el diez, debería pagar lo mismo.'], [20.0, 29.4, 'Las opciones son ciento veinte mil, ciento dieciocho mil ochocientos, ciento ocho mil y ciento diecisiete mil seiscientos. Al final sabremos si Carlos tenía razón.']] },
    { id: 'caras', name: 'TRES CARAS DEL MISMO NÚMERO', dur: 28,
      caps: [[0.8, 9.0, 'Por ciento: de cada 100', '25 % son 25 casillas de 100'], [9.6, 18.4, '1/4 = 0.25 = 25 %', 'fracción, decimal y porcentaje'], [19.0, 27.4, '100 % es el total', 'más de 100 % es más que el total']],
      narr: [[0.8, 9.0, 'Por ciento quiere decir de cada cien. Veinticinco por ciento son veinticinco casillas de una cuadrícula de cien.'], [9.6, 18.4, 'Esas casillas son también un cuarto de la cuadrícula, y en decimal, cero punto veinticinco. Son tres maneras de escribir lo mismo.'], [19.0, 27.4, 'El cien por ciento es el total. Un porcentaje mayor que cien, como ciento veinte por ciento, es más que el total.']] },
    { id: 'decimal', name: 'DE FRACCIÓN A DECIMAL', dur: 28,
      caps: [[0.8, 9.0, 'Una fracción es una división', '3/8 = 3 ÷ 8 = 0.375'], [9.6, 18.4, '0.375 = 37.5 %', 'el punto corre dos lugares'], [19.0, 27.4, '1/13 = 0.076923 076923…', 'a veces un bloque se repite']],
      narr: [[0.8, 9.0, 'Una fracción es una división pendiente. Tres octavos es tres entre ocho: cero punto trescientos setenta y cinco.'], [9.6, 18.4, 'Para pasarlo a porcentaje se corre el punto dos lugares: treinta y siete punto cinco por ciento.'], [19.0, 27.4, 'Otras divisiones no terminan. Un treceavo da cero punto cero siete seis nueve dos tres, y ese bloque de seis cifras se repite para siempre.']] },
    { id: 'bloque', name: 'EL BLOQUE QUE SE REPITE', dur: 30,
      caps: [[0.8, 9.4, 'La suma de 2019 cifras', 'las primeras cifras de 1/13 tras el punto'], [10.0, 19.4, 'Bloques de 6 cifras', 'cada bloque suma 27'], [20.0, 29.4, '336 bloques y 3 cifras más', '336 · 27 + 0 + 7 + 6 = 9085']],
      narr: [[0.8, 9.4, 'Un problema: hallar cuánto suman las primeras dos mil diecinueve cifras después del punto de un treceavo.'], [10.0, 19.4, 'No hay que escribirlas. Las cifras vienen en bloques de seis: cero, siete, seis, nueve, dos, tres. Cada bloque suma veintisiete.'], [20.0, 29.4, 'Dos mil diecinueve entre seis da trescientos treinta y seis bloques completos, y sobran tres cifras: cero, siete y seis. Total: nueve mil ochenta y cinco.']] },
    { id: 'comparar', name: 'TODO A DECIMAL', dur: 28,
      caps: [[0.8, 9.0, '2/5, 0.38 y 41 %', 'tres números escritos distinto'], [9.6, 18.4, '0.40, 0.38 y 0.41', 'todo en la misma forma'], [19.0, 27.4, '0.38 < 2/5 < 41 %', 'ahora se ordenan sin esfuerzo']],
      narr: [[0.8, 9.0, 'Dos quintos, cero punto treinta y ocho y cuarenta y uno por ciento. Así escritos, no es fácil decir cuál es mayor.'], [9.6, 18.4, 'Se pasan todos a decimal: dos quintos es cero punto cuarenta, y cuarenta y uno por ciento es cero punto cuarenta y uno.'], [19.0, 27.4, 'Ahora se ordenan sin esfuerzo: primero cero punto treinta y ocho, luego dos quintos y al final cuarenta y uno por ciento.']] },
    { id: 'cantidad', name: 'EL PORCENTAJE DE UNA CANTIDAD', dur: 28,
      caps: [[0.8, 9.0, '10 %: correr el punto', '10 % de 80 000 = 8 000'], [9.6, 18.4, '15 % = 10 % + 5 %', '8 000 + 4 000 = 12 000'], [19.0, 27.4, 'Armar con pedazos fáciles', '50 % es la mitad; 25 %, la cuarta parte']],
      narr: [[0.8, 9.0, 'El diez por ciento se saca corriendo el punto un lugar: el diez por ciento de ochenta mil es ocho mil.'], [9.6, 18.4, 'El quince por ciento es diez más cinco: ocho mil más la mitad de ocho mil, cuatro mil. En total, doce mil.'], [19.0, 27.4, 'Así se arma casi cualquier porcentaje con pedazos fáciles: el cincuenta es la mitad y el veinticinco, la cuarta parte.']] },
    { id: 'factor', name: 'SUBIR Y BAJAR ES MULTIPLICAR', dur: 30,
      caps: [[0.8, 9.4, 'Bajar 20 % deja el 80 %', '250 000 · 0.8 = 200 000'], [10.0, 19.4, 'Subir 20 % lleva al 120 %', '250 000 · 1.2 = 300 000'], [20.0, 29.4, 'Cada cambio es un factor', '· 0.8 para bajar, · 1.2 para subir']],
      narr: [[0.8, 9.4, 'Si un precio baja un veinte por ciento, queda el ochenta por ciento. Doscientos cincuenta mil por cero punto ocho: doscientos mil.'], [10.0, 19.4, 'Si sube un veinte por ciento, llega al ciento veinte por ciento. Doscientos cincuenta mil por uno punto dos: trescientos mil.'], [20.0, 29.4, 'Todo cambio porcentual es multiplicar por un factor: menor que uno si baja, mayor que uno si sube. Así se hace en un solo paso.']] },
    { id: 'examen', name: 'LA BARRA DE CHOCOLATE', dur: 30,
      caps: [[0.8, 9.4, 'Una barra para tres', 'Humberto 40 %, Iván 25 % y Javier el resto'], [10.0, 19.4, 'Javier: el 35 % restante', '100 − 40 − 25 = 35'], [20.0, 29.4, '35 % = 70 g, 100 % = 200 g', 'el 1 % son 2 gramos']],
      narr: [[0.8, 9.4, 'Otro problema. Humberto recibe el cuarenta por ciento de una barra de chocolate e Iván el veinticinco por ciento.'], [10.0, 19.4, 'Javier recibe el resto, que pesa setenta gramos. El resto es lo que falta: cien menos cuarenta menos veinticinco, el treinta y cinco por ciento.'], [20.0, 29.4, 'Si el treinta y cinco por ciento son setenta gramos, el uno por ciento son dos gramos, y el cien por ciento, doscientos gramos.']] },
    { id: 'resolver', name: 'LOS TENIS, RESUELTOS', dur: 30,
      caps: [[0.8, 9.4, '120 000 · 0.9 = 108 000', 'primero la rebaja'], [10.0, 19.4, '108 000 · 1.1 = 118 800', 'el impuesto se cobra sobre 108 000'], [20.0, 29.4, '0.9 · 1.1 = 0.99', '−10 % y +10 % no se cancelan: −1 %']],
      narr: [[0.8, 9.4, 'Volvamos a Carlos. Primero la rebaja: ciento veinte mil por cero punto nueve, ciento ocho mil.'], [10.0, 19.4, 'Después el impuesto, pero sobre ciento ocho mil y no sobre ciento veinte mil: por uno punto uno, ciento dieciocho mil ochocientos.'], [20.0, 29.4, 'Los dos cambios juntos son cero punto nueve por uno punto uno: cero punto noventa y nueve. Carlos pagó el noventa y nueve por ciento del precio.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30,
      caps: [[0.8, 10.4, 'Pagó 118 800', 'la opción B']],
      narr: [[0.8, 10.4, 'La respuesta era ciento dieciocho mil ochocientos, la opción B. El segundo diez por ciento se calcula sobre otro precio.'], [11.0, 20.4, 'Cada cambio es un factor, y los cambios seguidos se multiplican: quince y veinte por ciento de descuento dan treinta y dos, no treinta y cinco.'], [21.0, 29.4, 'Cada porcentaje se calcula sobre su propia base.']] },
  ];
  const WORLD = 'RAZONAMIENTO LÓGICO · MUNDO 1', TITLE = 'DECIMALES Y PORCENTAJES', LINE = 'Cada porcentaje, sobre su propia base.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'pu-cm-3' };
})();
if (typeof module !== 'undefined') module.exports = D;
