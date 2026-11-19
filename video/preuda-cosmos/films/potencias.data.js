// «Potencias, raíces y estimación» · Preuniversitario UdeA, razonamiento lógico, mundo 1, lección pu-cm-4. Datos puros.
// Reto al inicio con una pregunta real del examen de admisión UdeA 2024-2 (María escribe la suma de las cifras de
// 10ⁿ − 51: para 10⁵ escribe 40; para 10¹⁰, 85) que se resuelve al final. En medio: la potencia como multiplicación
// repetida (5³ en cubitos), las potencias de 10, el cuadrado como área (y la pregunta UdeA 2026-1: la circunferencia
// crece 20 % y el área 44 %), las leyes contando factores, otra pregunta real (UdeA 2025-2, las cartas 1 a 32), las
// potencias que dan vueltas (2²⁰¹⁹ ÷ 7, taller del preuniversitario UdeA) y raíces y estimación.
const D = (() => {
  const SCENES = [
    { id: 'reto', name: 'LAS CUENTAS DE MARÍA', dur: 30,
      caps: [[1.0, 9.4, 'Las cuentas de María', 'un problema para empezar'], [10.0, 19.4, '10⁵ − 51 = 99 949', 'María escribe 9 + 9 + 9 + 4 + 9 = 40'], [20.0, 29.4, 'Ahora, 10¹⁰ − 51', 'sin calculadora: 75, 90, 85 u 80']],
      narr: [[1.0, 9.4, 'Un problema para empezar. María hace cálculo mental con números de la forma diez a la ene menos cincuenta y uno.'], [10.0, 19.4, 'No escribe el resultado, sino la suma de sus cifras. Diez a la cinco menos cincuenta y uno es noventa y nueve mil novecientos cuarenta y nueve: escribe cuarenta.'], [20.0, 29.4, 'Hay que decir qué escribirá para diez a la diez menos cincuenta y uno. Las opciones: setenta y cinco, noventa, ochenta y cinco y ochenta.']] },
    { id: 'potencia', name: 'MULTIPLICAR REPETIDO', dur: 28,
      caps: [[0.8, 9.0, '5³ = 5 · 5 · 5', 'la base se repite; el exponente cuenta'], [9.6, 18.4, '5³ = 125 cubitos', 'un cubo de 5 por 5 por 5'], [19.0, 27.4, '5³ no es 5 · 3', 'es 125, no 15']],
      narr: [[0.8, 9.0, 'Una potencia es una multiplicación repetida. En cinco al cubo, el cinco es la base, lo que se repite, y el tres es el exponente: cuántas veces.'], [9.6, 18.4, 'Cinco por cinco por cinco: una capa de veinticinco cubitos, y cinco capas. Ciento veinticinco cubitos en total.'], [19.0, 27.4, 'Un error muy común: cinco al cubo no es cinco por tres. No es quince; es ciento veinticinco.']] },
    { id: 'diez', name: 'LAS POTENCIAS DE 10', dur: 28,
      caps: [[0.8, 9.0, '10ⁿ: un 1 y n ceros', '10³ = 1 000 y 10⁶ = 1 000 000'], [9.6, 18.4, '10ⁿ − 1: n nueves', '1 000 − 1 = 999'], [19.0, 27.4, '10 000 − 37 = 9 963', 'restar a una potencia de 10 es fácil']],
      narr: [[0.8, 9.0, 'Las potencias de diez son las más fáciles: diez a la ene es un uno seguido de ene ceros. Diez a la seis es un millón.'], [9.6, 18.4, 'Y si a una potencia de diez se le resta uno, todos los ceros se vuelven nueves: mil menos uno es novecientos noventa y nueve.'], [19.0, 27.4, 'Por eso restar a una potencia de diez es sencillo: diez mil menos treinta y siete es nueve mil novecientos sesenta y tres.']] },
    { id: 'cuadrado', name: 'AL CUADRADO', dur: 30,
      caps: [[0.8, 9.4, '13² = 169', '100 + 30 + 30 + 9'], [10.0, 19.4, 'Lado + 20 %: área · 1.44', '1.2 · 1.2 = 1.44'], [20.0, 29.4, 'El círculo que crece', 'la circunferencia crece 20 %; el área, 44 %']],
      narr: [[0.8, 9.4, 'Elevar al cuadrado es hallar un área. Trece al cuadrado es un cuadrado de cien, dos franjas de treinta y un cuadradito de nueve: ciento sesenta y nueve.'], [10.0, 19.4, 'Si el lado crece un veinte por ciento, el área no crece veinte: se multiplica dos veces por uno punto dos: por uno punto cuarenta y cuatro.'], [20.0, 29.4, 'Lo mismo pasa con un círculo: una circunferencia veinte por ciento más larga encierra un círculo con cuarenta y cuatro por ciento más de área.']] },
    { id: 'leyes', name: 'MISMA BASE: SE SUMAN', dur: 28,
      caps: [[0.8, 9.0, '2³ · 2⁴ = 2⁷', 'tres doses y cuatro doses: siete'], [9.6, 18.4, '(2³)² = 2⁶', 'dos grupos de tres doses'], [19.0, 27.4, 'Contar, no memorizar', 'las leyes salen de contar factores']],
      narr: [[0.8, 9.0, 'Dos al cubo por dos a la cuatro: son tres doses por cuatro doses, siete doses en fila. Dos a la siete, ciento veintiocho.'], [9.6, 18.4, 'Dos al cubo, todo al cuadrado: el grupo de tres doses se repite dos veces. Seis doses: dos a la seis, sesenta y cuatro.'], [19.0, 27.4, 'No hace falta memorizar las leyes: salen de contar cuántas veces se repite la base.']] },
    { id: 'examen', name: 'LAS CARTAS', dur: 30,
      caps: [[0.8, 9.4, 'Cartas 1, 2, 4, 8, 16 y 32', 'Ana supera a Eliza por 7'], [10.0, 19.4, 'Total 63: Ana 35, Eliza 28', '35 + 28 = 63 y 35 − 28 = 7'], [20.0, 29.4, '35 = 32 + 2 + 1', 'Ana tomó 3 cartas']],
      narr: [[0.8, 9.4, 'Otro problema. Seis cartas: uno, dos, cuatro, ocho, dieciséis y treinta y dos. Ana toma algunas, Eliza las demás, y Ana suma siete más.'], [10.0, 19.4, 'Todas suman sesenta y tres. Dos números que suman sesenta y tres y se diferencian en siete son treinta y cinco y veintiocho.'], [20.0, 29.4, 'Cada potencia de dos es mayor que todas las anteriores juntas; por eso treinta y cinco se arma de una sola forma: treinta y dos, dos y uno. Tres cartas.']] },
    { id: 'ciclos', name: 'LAS POTENCIAS DAN VUELTAS', dur: 30,
      caps: [[0.8, 9.4, 'El residuo de 2²⁰¹⁹ ÷ 7', 'ese número tiene 608 cifras'], [10.0, 19.4, 'Residuos: 2, 4, 1, 2, 4, 1…', 'cada 3 pasos se repiten'], [20.0, 29.4, '2019 = 3 · 673', 'cae en el 1: el residuo es 1']],
      narr: [[0.8, 9.4, 'Otro problema: el residuo de dividir dos a la dos mil diecinueve entre siete. Ese número tiene seiscientas ocho cifras.'], [10.0, 19.4, 'Pero los residuos dan vueltas: dos, cuatro, uno, y otra vez dos, cuatro, uno. Cada tres pasos se repiten, como las horas de un reloj.'], [20.0, 29.4, 'Dos mil diecinueve es múltiplo de tres, así que cae en el mismo lugar que dos a la tres, ocho, que deja residuo uno.']] },
    { id: 'raices', name: 'RAÍCES Y ESTIMACIÓN', dur: 30,
      caps: [[0.8, 9.4, '√72 = √(36 · 2) = 6√2', 'sacar el cuadrado que se esconde'], [10.0, 19.4, '64 < 72 < 81', '√72 está entre 8 y 9'], [20.0, 29.4, '49.7 · 20.3 ≈ 50 · 20', 'casi 1 000: descarta opciones']],
      narr: [[0.8, 9.4, 'La raíz cuadrada es el lado de un cuadrado. Raíz de setenta y dos esconde un cuadrado perfecto: treinta y seis por dos. Queda seis raíz de dos.'], [10.0, 19.4, 'Para estimarla se busca entre qué cuadrados está: sesenta y cuatro y ochenta y uno. Raíz de setenta y dos queda entre ocho y nueve, cerca de ocho punto cinco.'], [20.0, 29.4, 'Estimar también sirve para elegir opciones: cuarenta y nueve punto siete por veinte punto tres es casi cincuenta por veinte, mil. Las opciones lejanas se descartan.']] },
    { id: 'resolver', name: 'LAS CUENTAS DE MARÍA, RESUELTAS', dur: 30,
      caps: [[0.8, 9.4, '10¹⁰ − 51 = 9 999 999 949', 'ocho nueves, un 4 y un 9'], [10.0, 19.4, '8 · 9 + 4 + 9 = 85', 'la suma de las cifras'], [20.0, 29.4, 'Comprobado con 10⁵: 40', 'tres nueves: 27 + 13 = 40']],
      narr: [[0.8, 9.4, 'Volvamos a María. Diez a la diez es un uno con diez ceros. Al restar cincuenta y uno quedan ocho nueves, luego un cuatro y un nueve.'], [10.0, 19.4, 'La suma de las cifras: ocho nueves son setenta y dos, más cuatro, más nueve: ochenta y cinco. Es la opción C.'], [20.0, 29.4, 'Se comprueba con el ejemplo del enunciado: diez a la cinco deja tres nueves, veintisiete, más trece: cuarenta. El patrón funciona.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30,
      caps: [[0.8, 10.4, 'María escribirá 85', 'la opción C']],
      narr: [[0.8, 10.4, 'La respuesta era ochenta y cinco, la opción C. Bastó entender cómo se ven las potencias de diez.'], [11.0, 20.4, 'Una potencia repite la base; con la misma base se suman los exponentes; al cuadrado es un área; y las potencias dan vueltas.'], [21.0, 29.4, 'En una potencia, el exponente cuenta.']] },
  ];
  const WORLD = 'RAZONAMIENTO LÓGICO · MUNDO 1', TITLE = 'POTENCIAS Y RAÍCES', LINE = 'El exponente cuenta cuántas veces.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'pu-cm-4' };
})();
if (typeof module !== 'undefined') module.exports = D;
