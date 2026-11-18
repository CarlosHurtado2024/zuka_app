// «La cuerda de Pitágoras» · lección alg-11b (Los números racionales: fracciones y decimales). Datos puros.
// Historia (docs/storytelling-videos.md): los pitagóricos descubren que las notas que suenan bien salen de partir una cuerda
// en fracciones (1/2, 2/3, 3/4); los egipcios ya repartían panes en fracciones (papiro de Rhind). La sorpresa: el decimal de
// una fracción siempre termina o se repite, y la razón es que solo hay unos pocos residuos posibles. Respaldo en FACTS.md.
const D = (() => {
  const SCENES = [
    { id: 'cuerda', name: 'LA CUERDA', dur: 28, formula: [['largo', 'it'], ['  ⟶  ', 'r'], ['nota', 'it']],
      caps: [[1.0, 9.0, 'Grecia, hace unos 2 500 años', 'los pitagóricos estudian una cuerda tensa'], [9.6, 18.0, 'La mitad de la cuerda', 'suena la misma nota, más aguda: una octava'], [18.6, 27.4, 'Las notas que suenan bien', 'salen de partir la cuerda en fracciones']],
      narr: [[1.0, 9.0, 'Grecia, hace unos dos mil quinientos años. Los seguidores de Pitágoras estudian algo sencillo: una cuerda tensa que suena al pulsarla.'], [9.6, 18.0, 'Si se pisa la cuerda justo en la mitad, suena la misma nota, pero más aguda. Los músicos lo llaman una octava.'], [18.6, 27.4, 'Y descubren algo más: las notas que suenan bien juntas salen de partir la cuerda en fracciones sencillas.']] },
    { id: 'rhind', name: 'EGIPTO, PAPIRO DE RHIND', dur: 28, formula: [['7', 'r'], [' ÷ ', 'r'], ['10', 'r'], [' = ', 'r'], ['?', 'r']],
      caps: [[0.8, 9.4, 'Egipto, hace unos 3 600 años', 'el papiro de Rhind reparte panes'], [10.0, 18.4, '7 panes entre 10 trabajadores', 'a cada uno le toca menos de un pan'], [19.0, 27.4, 'Ningún entero alcanza', 'hace falta un número entre 0 y 1']],
      narr: [[0.8, 9.4, 'Mucho antes, en Egipto, un escriba copió un papiro con problemas de matemáticas. Hoy se llama papiro de Rhind.'], [10.0, 18.4, 'Uno de sus problemas: repartir siete panes entre diez trabajadores, en partes iguales. A cada uno le toca menos de un pan.'], [19.0, 27.4, 'Ningún entero sirve: el cero es poco y el uno es demasiado. Hace falta un número entre los dos.']] },
    { id: 'q', name: 'LOS RACIONALES', dur: 30, formula: [['ℚ', 'r'], [' = { ', 'r'], ['m', 'i'], ['/', 'r'], ['n', 'i'], [' : ', 'r'], ['m', 'i'], [', ', 'r'], ['n', 'i'], [' ∈ ', 'r'], ['ℤ', 'r'], [', ', 'r'], ['n', 'i'], [' ≠ 0 }', 'r']],
      caps: [[0.8, 9.4, 'ℚ, los números racionales', 'los que se escriben como cociente de enteros'], [10.0, 19.4, 'Numerador y denominador', 'arriba cuántas partes, abajo en cuántas se parte'], [20.0, 29.4, 'El denominador nunca es 0', 'nada se puede partir en cero partes']],
      narr: [[0.8, 9.4, 'Los números que se escriben como un entero dividido entre otro forman los racionales. Se escriben cu, por la palabra cociente.'], [10.0, 19.4, 'En siete décimos, el diez de abajo dice en cuántas partes se divide el pan. El siete de arriba dice cuántas se toman.'], [20.0, 29.4, 'El número de abajo nunca puede ser cero: nada se puede partir en cero partes.']] },
    { id: 'nombres', name: 'MUCHOS NOMBRES', dur: 28, formula: [['2/3', 'r'], [' = ', 'r'], ['4/6', 'r'], [' = ', 'r'], ['6/9', 'r'], ['      ', 'r'], ['ℤ', 'r'], [' ⊆ ', 'r'], ['ℚ', 'r']],
      caps: [[0.8, 9.4, 'Una fracción, muchos nombres', '2/3 = 4/6 = 6/9: el mismo largo de cuerda'], [10.0, 18.4, 'Todo entero es racional', '−5 = −5/1'], [19.0, 27.4, 'ℤ ⊆ ℚ', 'los enteros caben dentro de los racionales']],
      narr: [[0.8, 9.4, 'Dos tercios, cuatro sextos y seis novenos marcan el mismo punto de la cuerda. Son nombres distintos de un mismo número.'], [10.0, 18.4, 'Y todo entero es racional: menos cinco es menos cinco dividido entre uno.'], [19.0, 27.4, 'Así, los enteros quedan dentro de los racionales. Zeta es subconjunto de cu.']] },
    { id: 'escala', name: 'QUINTA Y CUARTA', dur: 30, formula: [['1/2', 'r'], ['   ', 'r'], ['2/3', 'r'], ['   ', 'r'], ['3/4', 'r']],
      caps: [[0.8, 9.4, 'Octava, quinta y cuarta', '1/2, 2/3 y 3/4 de la cuerda'], [10.0, 19.4, 'La frecuencia sube al revés', 'cuerda a 2/3: vibra 3/2 veces más rápido'], [20.0, 29.4, 'Por eso suenan bien juntas', 'sus vibraciones coinciden cada pocas vueltas']],
      narr: [[0.8, 9.4, 'Pisando la cuerda a la mitad suena la octava. A los dos tercios, la quinta. A los tres cuartos, la cuarta.'], [10.0, 19.4, 'Una cuerda más corta vibra más rápido. Si mide dos tercios, vibra tres medios de veces más rápido: el la de cuatrocientos cuarenta pasa a seiscientos sesenta.'], [20.0, 29.4, 'Por eso esas notas suenan bien juntas: sus vibraciones vuelven a coincidir cada pocas vueltas.']] },
    { id: 'decimales', name: 'DECIMALES', dur: 26, formula: [['7/10', 'r'], [' = 0.7', 'r'], ['      ', 'r'], ['5/16', 'r'], [' = 0.3125', 'r']],
      caps: [[0.8, 9.4, 'Dividir da un decimal', 'el numerador entre el denominador'], [10.0, 25.4, 'Algunos decimales terminan', 'si el denominador simplificado solo tiene 2 y 5']],
      narr: [[0.8, 9.4, 'Toda fracción se puede volver decimal: se divide el número de arriba entre el de abajo. Siete décimos es cero punto siete.'], [10.0, 25.4, 'Cinco dieciseisavos es cero punto tres uno dos cinco, y ahí termina. Pasa cuando el denominador, ya simplificado, solo se arma con doses y cincos, porque diez es dos por cinco.']] },
    { id: 'periodo', name: 'PERIÓDICOS', dur: 32, formula: [['1/7', 'r'], [' = 0.', 'r'], ['142857', 'r'], [' 142857 …', 'r']],
      caps: [[0.8, 9.4, 'Otros se repiten para siempre', '1/7 = 0.142857 142857 …'], [10.0, 21.4, 'Solo hay 6 residuos posibles', 'tarde o temprano uno se repite, y con él todo'], [22.0, 31.4, 'La rayita marca el período', 'el bloque que se repite sin fin']],
      narr: [[0.8, 9.4, 'Otros decimales no terminan nunca. Un séptimo da cero punto uno cuatro dos ocho cinco siete, y el bloque vuelve a empezar.'], [10.0, 21.4, 'Aquí está la sorpresa, y su razón. Al dividir entre siete, lo que sobra en cada paso solo puede ser de uno a seis. Tarde o temprano un residuo se repite, y desde ahí se repite todo.'], [22.0, 31.4, 'El bloque que se repite se llama período, y se marca con una rayita encima.']] },
    { id: 'vuelta', name: 'DE DECIMAL A FRACCIÓN', dur: 30, formula: [['x', 'i'], [' = 0.8181…', 'r'], ['  ⟹  ', 'r'], ['99', 'r'], ['x', 'i'], [' = 81', 'r']],
      caps: [[0.8, 9.4, 'De vuelta a fracción', 'se multiplica para correr el período'], [10.0, 19.4, 'Restar borra la cola infinita', '100x − x = 81'], [20.0, 29.4, 'x = 81/99 = 9/11', 'todo periódico es un racional']],
      narr: [[0.8, 9.4, 'El camino también se puede recorrer al revés. Sea equis igual a cero punto ocho uno ocho uno, y así. Multiplicando por cien, el período corre dos lugares.'], [10.0, 19.4, 'Ahora las dos colas son idénticas. Al restar cien equis menos equis, la cola infinita desaparece y queda ochenta y uno.'], [20.0, 29.4, 'Noventa y nueve equis es ochenta y uno, así que equis es ochenta y uno sobre noventa y nueve: nueve onceavos.']] },
    { id: 'huella', name: 'LA HUELLA DE ℚ', dur: 26, formula: [['racional', 'it'], ['  ⟺  ', 'r'], ['termina o se repite', 'it']],
      caps: [[0.8, 9.4, 'La huella de ℚ', 'su decimal termina o se repite'], [10.0, 18.4, 'Y al revés también', 'todo decimal que termina o se repite es racional'], [19.0, 25.4, 'Queda una pregunta abierta', 'un decimal que nunca termina ni se repite']],
      narr: [[0.8, 9.4, 'Esa es la huella de los racionales: su decimal o termina o se repite.'], [10.0, 18.4, 'Y funciona en los dos sentidos: todo decimal que termina, o que se repite, viene de una fracción.'], [19.0, 25.4, 'Entonces, un decimal que nunca termine y nunca se repita no puede ser racional.']] },
    { id: 'cierre', name: 'CIERRE', dur: 32, formula: [['ℕ', 'r'], [' ⊆ ', 'r'], ['ℤ', 'r'], [' ⊆ ', 'r'], ['ℚ', 'r']],
      caps: [[0.8, 10.4, '«Todo es número»', 'decían los pitagóricos: todo es una fracción']],
      narr: [[0.8, 10.4, 'Los pitagóricos quedaron tan maravillados con la cuerda que decían que todo es número: que cualquier medida es una fracción.'], [11.0, 20.4, 'Con los racionales se reparte, se mide y se afina. Su decimal termina o se repite.'], [21.0, 31.4, 'Pero uno de sus propios discípulos iba a encontrar una medida que ninguna fracción alcanza. Esa historia viene en el siguiente video.']] },
  ];
  const WORLD = 'ÁLGEBRA · LA RECTA REAL', TITLE = 'RACIONALES', LINE = 'Partir, repartir y afinar.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  // División larga de n entre d: cifras decimales y residuos (para la escena de los períodos).
  const longDiv = (n, d, k) => { const digits = [], rests = []; let r = n % d; for (let i = 0; i < k; i++) { rests.push(r); r *= 10; digits.push(Math.floor(r / d)); r %= d; } return { digits, rests }; };
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-11b', longDiv };
})();
if (typeof module !== 'undefined') module.exports = D;
