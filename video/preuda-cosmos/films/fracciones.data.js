// «Fracciones» · Preuniversitario UdeA, razonamiento lógico, mundo 1, lección pu-cm-2. Datos puros.
// Reto al inicio con una pregunta real del examen de admisión UdeA 2024-2 (las tortas de Luis: una torta entera es el
// 60 % de lo que le quedó; recibió 2) que se resuelve al final. En medio: qué es una fracción (abajo se corta, arriba se
// cuenta), equivalentes y simplificar, comparar con el producto cruzado, la fracción de una cantidad, sumar pedazos
// iguales, la fracción del resto y otra pregunta real (UdeA 2023-2, el grupo de niñas y niños: se prueban las opciones).
const D = (() => {
  const SCENES = [
    { id: 'reto', name: 'LAS TORTAS DE LUIS', dur: 30,
      caps: [[1.0, 9.4, 'Las tortas de Luis', 'un problema para empezar'], [10.0, 19.4, 'Una torta = 60 % del resto', 'sesenta por ciento es tres quintos'], [20.0, 29.4, 'Cuatro opciones: 3, 2, 5 o 4', 'al final del video la resolvemos']],
      narr: [[1.0, 9.4, 'Un problema para empezar. Luis recibió varias tortas iguales por su cumpleaños.'], [10.0, 19.4, 'Se comió un tercio de una, y notó que una torta completa era el sesenta por ciento de lo que le quedaba. Sesenta por ciento es tres quintos.'], [20.0, 29.4, 'Hay que decir cuántas tortas recibió. Para resolverla hace falta entender bien las fracciones; al final del video la resolvemos.']] },
    { id: 'partes', name: 'QUÉ ES UNA FRACCIÓN', dur: 28,
      caps: [[0.8, 9.0, 'Abajo: en cuántas partes', 'el denominador corta en partes iguales'], [9.6, 18.4, 'Arriba: cuántas se toman', 'el numerador cuenta las partes'], [19.0, 27.4, 'Partes iguales, siempre', 'tres pedazos desiguales no son tercios']],
      narr: [[0.8, 9.0, 'Una fracción tiene dos números. El de abajo, el denominador, dice en cuántas partes iguales se corta la unidad.'], [9.6, 18.4, 'El de arriba, el numerador, dice cuántas de esas partes se toman. Tres octavos: ocho partes, y se toman tres.'], [19.0, 27.4, 'Las partes deben ser iguales. Una barra cortada en tres pedazos desiguales no está partida en tercios.']] },
    { id: 'equivalentes', name: 'MISMA CANTIDAD, OTRO CORTE', dur: 28,
      caps: [[0.8, 9.0, '3/5 = 6/10 = 12/20', 'más cortes, la misma cantidad'], [9.6, 18.4, 'Simplificar: 18/24 = 3/4', 'dividir arriba y abajo entre 6'], [19.0, 27.4, 'El valor no cambia', 'solo cambia el tamaño de los pedazos']],
      narr: [[0.8, 9.0, 'Si cada quinto se parte en dos, tres quintos se vuelven seis décimos; si se parte en cuatro, doce veinteavos. Es la misma cantidad.'], [9.6, 18.4, 'Simplificar es el camino de vuelta: dieciocho veinticuatroavos, dividiendo arriba y abajo entre seis, queda tres cuartos.'], [19.0, 27.4, 'El valor no cambia; solo cambia el tamaño de los pedazos. Por eso conviene simplificar antes de operar.']] },
    { id: 'comparar', name: 'CUÁL ES MAYOR', dur: 28,
      caps: [[0.8, 9.0, '4/7 frente a 5/9', 'casi iguales a simple vista'], [9.6, 18.4, 'Producto cruzado', '4 · 9 = 36 y 5 · 7 = 35'], [19.0, 27.4, '4/7 > 5/9', 'es pasar las dos a sesenta y tresavos']],
      narr: [[0.8, 9.0, 'Cuatro séptimos y cinco novenos se ven casi iguales. Para saber cuál es mayor hay un truco que no falla.'], [9.6, 18.4, 'Se multiplica en cruz: cuatro por nueve da treinta y seis; cinco por siete da treinta y cinco.'], [19.0, 27.4, 'Treinta y seis gana: cuatro séptimos es mayor. El truco funciona porque es pasar las dos fracciones a sesenta y tresavos.']] },
    { id: 'cantidad', name: 'LA FRACCIÓN DE UNA CANTIDAD', dur: 28,
      caps: [[0.8, 9.0, '2/7 de 35', '35 caramelos en 7 grupos iguales'], [9.6, 18.4, '35 ÷ 7 = 5;  2 · 5 = 10', 'cada séptimo son 5 y se toman 2'], [19.0, 27.4, 'Primero dividir', 'después multiplicar: números pequeños']],
      narr: [[0.8, 9.0, 'Dos séptimos de treinta y cinco caramelos: se reparten los treinta y cinco en siete grupos iguales.'], [9.6, 18.4, 'Cada grupo tiene cinco, porque treinta y cinco entre siete es cinco. Se toman dos grupos: diez caramelos.'], [19.0, 27.4, 'Conviene dividir primero y multiplicar después: los números se mantienen pequeños y la cuenta sale de cabeza.']] },
    { id: 'sumar', name: 'SUMAR PEDAZOS IGUALES', dur: 30,
      caps: [[0.8, 9.4, '1/4 + 1/6', 'pedazos de distinto tamaño no se suman'], [10.0, 19.4, 'Doceavos: 3/12 + 2/12', '12 se reparte en 4 y también en 6'], [20.0, 29.4, '1/4 + 1/6 = 5/12', 'se suman pedazos, no denominadores']],
      narr: [[0.8, 9.4, 'Un cuarto más un sexto no da dos décimos. Un cuarto y un sexto son pedazos de distinto tamaño, y así no se pueden juntar.'], [10.0, 19.4, 'Se recortan en pedazos iguales: doceavos, porque doce se reparte en cuatro y también en seis. Un cuarto son tres doceavos; un sexto, dos.'], [20.0, 29.4, 'Ahora sí: tres doceavos más dos doceavos, cinco doceavos. Se suman los pedazos; el denominador solo dice su tamaño.']] },
    { id: 'resto', name: 'LA FRACCIÓN DEL RESTO', dur: 30,
      caps: [[0.8, 9.4, 'Gasta 1/3 de 120 000', 'le quedan 80 000: dos tercios'], [10.0, 19.4, 'Luego 1/4 del resto', 'un cuarto de 80 000, no de 120 000'], [20.0, 29.4, 'Le queda 1/2: 60 000', 'lo que queda se multiplica: 2/3 · 3/4']],
      narr: [[0.8, 9.4, 'Una trampa frecuente. Sara tiene ciento veinte mil pesos y gasta un tercio en un libro: le quedan ochenta mil.'], [10.0, 19.4, 'Después gasta un cuarto del resto. Del resto: un cuarto de ochenta mil, veinte mil, y no un cuarto de lo que tenía al principio.'], [20.0, 29.4, 'Le quedan sesenta mil, justo la mitad. Lo que queda se multiplica: dos tercios por tres cuartos da un medio.']] },
    { id: 'examen', name: 'NIÑAS Y NIÑOS', dur: 30,
      caps: [[0.8, 9.4, 'Niñas y niños en un grupo', 'otro problema con fracciones'], [10.0, 19.4, 'El quinto decide', 'descarta 36, 71 y 57'], [20.0, 29.4, '22: 21 entre 7 y 20 entre 5', 'eran 4 niñas y 18 niños']],
      narr: [[0.8, 9.4, 'Otro problema: hay que hallar cuántos había en un grupo. Si sale una niña, un séptimo del resto son niñas; si salen dos niños, un quinto.'], [10.0, 19.4, 'En vez de plantear ecuaciones, se prueban las opciones. Treinta y seis y setenta y uno no sirven: sin dos niños, el resto no se reparte en cinco.'], [20.0, 29.4, 'Con veintidós: sin una niña quedan veintiuno, y un séptimo son tres niñas; sin dos niños quedan veinte, y un quinto son cuatro. Cuadra.']] },
    { id: 'resolver', name: 'LAS TORTAS, RESUELTAS', dur: 30,
      caps: [[0.8, 9.4, '1 torta = 3/5 del resto', 'cada quinto del resto es 1/3 de torta'], [10.0, 19.4, 'Le quedaron 5/3 de torta', 'una torta y dos tercios'], [20.0, 29.4, '5/3 + 1/3 = 6/3 = 2', 'más el tercio que se comió']],
      narr: [[0.8, 9.4, 'Volvamos a Luis. Una torta entera son tres quintos de lo que le quedó, y una torta son tres tercios: cada quinto es un tercio de torta.'], [10.0, 19.4, 'Lo que le quedó son cinco quintos, o sea cinco tercios de torta: una torta entera y dos tercios de otra.'], [20.0, 29.4, 'Falta sumar el tercio que se comió: cinco tercios más un tercio, seis tercios. Luis recibió dos tortas.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30,
      caps: [[0.8, 10.4, 'Luis recibió 2 tortas', 'la opción B']],
      narr: [[0.8, 10.4, 'La respuesta era dos, la opción B. Tres quintos de lo que le quedaba eran una torta.'], [11.0, 20.4, 'Abajo se corta y arriba se cuenta; se suman pedazos iguales, y la fracción del resto se calcula sobre el resto.'], [21.0, 29.4, 'Cada fracción es un corte y una cuenta.']] },
  ];
  const WORLD = 'RAZONAMIENTO LÓGICO · MUNDO 1', TITLE = 'FRACCIONES', LINE = 'Abajo se corta; arriba se cuenta.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'pu-cm-2' };
})();
if (typeof module !== 'undefined') module.exports = D;
