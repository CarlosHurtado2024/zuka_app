// «Ocho minutos de luz» · lección alg-21b (Leyes de los exponentes). Datos puros (generados desde leyes.json).
// Historia (docs/storytelling-videos.md): cuando miras el Sol lo ves como era hace unos ocho minutos; la cuenta
// 1.5 · 10⁸ km ÷ 3 · 10⁵ km/s se hace de cabeza con las leyes. Analogías: contar factores, el kilómetro cuadrado (10⁶ m²)
// y el cuadrado de lado 3 + 4. La sorpresa: el exponente no se reparte en una suma (faltan los dos rectángulos).
const D = (() => {
  const SCENES = [
    { id: 'sol', name: 'LA LUZ DEL SOL', dur: 28, formula: [['1.5 · 10⁸ km', 'r']],
      caps: [[1.0, 9.0, 'Cuando miras el Sol', 'lo ves como era hace unos 8 minutos'], [9.6, 18.0, 'La luz tarda en llegar', '150 000 000 km a 300 000 km/s'], [18.6, 27.4, 'Números con muchos ceros', 'las leyes de los exponentes los vuelven fáciles']],
      narr: [[1.0, 9.0, 'Cuando miras el Sol, no lo ves como es ahora, sino como era hace unos ocho minutos.'], [9.6, 18.0, 'Su luz recorre ciento cincuenta millones de kilómetros, a trescientos mil kilómetros por segundo.'], [18.6, 27.4, 'Dividir números con tantos ceros parece pesado. Con las leyes de los exponentes se vuelve una cuenta de cabeza.']] },
    { id: 'producto', name: 'MULTIPLICAR', dur: 30, formula: [['a', 'i'], ['ᵐ · ', 'r'], ['a', 'i'], ['ⁿ = ', 'r'], ['a', 'i'], ['ᵐ⁺ⁿ', 'r']],
      caps: [[0.8, 9.4, '10² · 10³', 'dos dieces y tres dieces'], [10.0, 19.4, 'Se cuentan los factores', '2 + 3 = 5: 10² · 10³ = 10⁵'], [20.0, 29.4, 'Misma base: se suman', 'aᵐ · aⁿ = aᵐ⁺ⁿ']],
      narr: [[0.8, 9.4, 'Diez al cuadrado por diez al cubo. Escrito completo: dos dieces multiplicados por otros tres dieces.'], [10.0, 19.4, 'Juntos son cinco dieces seguidos: diez a la quinta. No hay que memorizar nada, solo contar los factores.'], [20.0, 29.4, 'Con la misma base, al multiplicar se suman los exponentes: a elevado a m, por a elevado a n, es a elevado a m más n.']] },
    { id: 'base', name: 'LA MISMA BASE', dur: 28, formula: [['2³ · 3² = 8 · 9 = 72', 'r']],
      caps: [[0.8, 9.4, 'Solo con la misma base', '2³ · 3² no es 6⁵ ni 2⁵'], [10.0, 18.4, 'Factores distintos no se juntan', '2³ · 3² = 8 · 9 = 72'], [19.0, 27.4, 'La ley cuenta factores iguales', 'por eso exige la misma base']],
      narr: [[0.8, 9.4, 'La ley solo vale con la misma base. Dos al cubo por tres al cuadrado no es seis a la quinta ni dos a la quinta.'], [10.0, 18.4, 'Son factores distintos: tres doses y dos treses. Hay que calcular: ocho por nueve, setenta y dos.'], [19.0, 27.4, 'La ley cuenta cuántos factores iguales hay, y eso solo tiene sentido si todos son el mismo número.']] },
    { id: 'cociente', name: 'DIVIDIR', dur: 30, formula: [['a', 'i'], ['ᵐ ÷ ', 'r'], ['a', 'i'], ['ⁿ = ', 'r'], ['a', 'i'], ['ᵐ⁻ⁿ', 'r'], ['   (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']],
      caps: [[0.8, 9.4, '10⁸ ÷ 10⁵', 'ocho dieces arriba, cinco abajo'], [10.0, 19.4, 'Se cancelan por parejas', 'quedan tres: 10⁸ ÷ 10⁵ = 10³'], [20.0, 29.4, 'Si abajo hay más', '10² ÷ 10⁵ = 10⁻³: sobran abajo']],
      narr: [[0.8, 9.4, 'Al dividir, diez a la ocho entre diez a la cinco: ocho dieces arriba y cinco abajo.'], [10.0, 19.4, 'Cada diez de abajo cancela uno de arriba. Quedan tres: diez al cubo. Con la misma base, al dividir se restan los exponentes.'], [20.0, 29.4, 'Si abajo hay más, sobran abajo, y la resta da negativa: diez al cuadrado entre diez a la cinco es diez a la menos tres.']] },
    { id: 'potpot', name: 'POTENCIA DE POTENCIA', dur: 28, formula: [['(', 'r'], ['a', 'i'], ['ᵐ)ⁿ = ', 'r'], ['a', 'i'], ['ᵐⁿ', 'r']],
      caps: [[0.8, 9.4, 'Un kilómetro son 10³ metros', 'un kilómetro cuadrado: (10³ m)²'], [10.0, 18.4, '(10³)² = 10³ · 10³ = 10⁶', 'un millón de metros cuadrados'], [19.0, 27.4, 'Se multiplican los exponentes', '(aᵐ)ⁿ = aᵐⁿ']],
      narr: [[0.8, 9.4, 'Un kilómetro son diez al cubo metros. Un kilómetro cuadrado es un cuadrado de diez al cubo metros de lado.'], [10.0, 18.4, 'Su área es diez al cubo por diez al cubo: diez a la seis, un millón de metros cuadrados.'], [19.0, 27.4, 'El grupo de tres dieces se repite dos veces: seis dieces. En la potencia de una potencia se multiplican los exponentes.']] },
    { id: 'reparte', name: 'UN PRODUCTO', dur: 28, formula: [['(', 'r'], ['ab', 'i'], [')ⁿ = ', 'r'], ['a', 'i'], ['ⁿ', 'r'], ['b', 'i'], ['ⁿ', 'r']],
      caps: [[0.8, 9.4, 'El exponente va a cada factor', '(2 · 5)³ = 2³ · 5³'], [10.0, 18.4, 'Se reordena la multiplicación', '2·5 · 2·5 · 2·5 = 2·2·2 · 5·5·5'], [19.0, 27.4, '8 · 125 = 1 000 = 10³', 'las dos cuentas dan lo mismo']],
      narr: [[0.8, 9.4, 'Cuando la base es un producto, el exponente va a cada factor: dos por cinco, al cubo, es dos al cubo por cinco al cubo.'], [10.0, 18.4, 'Basta reordenar: la multiplicación es conmutativa y asociativa, así que se juntan los doses y los cincos.'], [19.0, 27.4, 'Ocho por ciento veinticinco es mil, que es diez al cubo. Las dos cuentas dan lo mismo.']] },
    { id: 'suma', name: 'NO EN UNA SUMA', dur: 30, formula: [['(3 + 4)²', 'r'], [' ≠ ', 'r'], ['3² + 4²', 'r']],
      caps: [[0.8, 9.4, 'En una suma no se reparte', '(3 + 4)² = 49, pero 3² + 4² = 25'], [10.0, 19.4, 'Un cuadrado de lado 3 + 4', 'tiene dos cuadrados y dos rectángulos'], [20.0, 29.4, 'Faltaban los rectángulos', '49 = 9 + 16 + 12 + 12']],
      narr: [[0.8, 9.4, 'Pero en una suma el exponente no se reparte. Tres más cuatro, al cuadrado, es cuarenta y nueve; tres al cuadrado más cuatro al cuadrado, veinticinco.'], [10.0, 19.4, 'Tomemos un cuadrado de lado tres más cuatro. Adentro caben un cuadrado de tres, uno de cuatro y dos rectángulos de tres por cuatro.'], [20.0, 29.4, 'Repartir el exponente olvida los dos rectángulos: doce más doce, justo los veinticuatro que faltaban.']] },
    { id: 'cientifica', name: 'NOTACIÓN CIENTÍFICA', dur: 30, formula: [['a', 'i'], [' · 10ⁿ', 'r'], ['     1 ≤ ', 'r'], ['a', 'i'], [' < 10', 'r']],
      caps: [[0.8, 9.4, 'Notación científica', 'un número entre 1 y 10 por una potencia de 10'], [10.0, 19.4, '150 000 000 = 1.5 · 10⁸', 'el punto salta 8 lugares'], [20.0, 29.4, '300 000 = 3 · 10⁵', 'la rapidez de la luz, en km/s']],
      narr: [[0.8, 9.4, 'La notación científica escribe un número como un número entre uno y diez, por una potencia de diez.'], [10.0, 19.4, 'Ciento cincuenta millones de kilómetros: uno punto cinco por diez a la ocho. El exponente cuenta los lugares que salta el punto.'], [20.0, 29.4, 'Y trescientos mil kilómetros por segundo, la rapidez de la luz, es tres por diez a la cinco.']] },
    { id: 'minutos', name: 'OCHO MINUTOS', dur: 28, formula: [['(1.5 · 10⁸) ÷ (3 · 10⁵) = 500', 'r']],
      caps: [[0.8, 9.4, 'Tiempo = distancia ÷ rapidez', '(1.5 · 10⁸) ÷ (3 · 10⁵)'], [10.0, 18.4, 'Números aparte, potencias aparte', '1.5 ÷ 3 = 0.5 y 10⁸ ÷ 10⁵ = 10³'], [19.0, 27.4, '0.5 · 10³ = 500 segundos', 'unos 8 minutos y 20 segundos']],
      narr: [[0.8, 9.4, 'El tiempo que tarda la luz es la distancia entre la rapidez: uno punto cinco por diez a la ocho, entre tres por diez a la cinco.'], [10.0, 18.4, 'Se dividen los números por un lado, y las potencias por otro, restando exponentes.'], [19.0, 27.4, 'Cero punto cinco por diez al cubo: quinientos segundos, unos ocho minutos y veinte segundos.']] },
    { id: 'cierre', name: 'CIERRE', dur: 30, formula: [['a', 'i'], ['ᵐ', 'r'], ['a', 'i'], ['ⁿ = ', 'r'], ['a', 'i'], ['ᵐ⁺ⁿ', 'r']],
      caps: [[0.8, 10.4, 'Ocho minutos de luz', 'calculados contando factores']],
      narr: [[0.8, 10.4, 'La próxima vez que veas el Sol, recuerda: esa luz salió hace unos ocho minutos.'], [11.0, 20.4, 'Para saberlo bastan tres ideas: multiplicar suma exponentes, dividir los resta y elevar los multiplica.'], [21.0, 29.4, 'Y detrás de las tres hay una sola: contar factores.']] },
  ];
  const WORLD = 'ÁLGEBRA · EXPONENTES Y RADICALES', TITLE = 'LEYES DE LOS EXPONENTES', LINE = 'Contar factores: sumar, restar o multiplicar exponentes.';
  let t = 0; const SC = [], NARR = [];
  for (const s of SCENES) {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur });
    for (const n of s.narr) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    t += s.dur;
  }
  return { DUR: t, SCENES, SC, NARR, WORLD, TITLE, LINE, LESSON: 'alg-21b' };
})();
if (typeof module !== 'undefined') module.exports = D;
