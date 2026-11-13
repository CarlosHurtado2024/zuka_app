// V4 · alg-12b «Axiomas de campo: las reglas de la suma y el producto» (Valle de los Números, lección 4). Libro UdeA §1.2.
// Ejemplos del video: el alfil, 2 + 5 dulces, 3 × 4 puntos girados, 5 − 2, 8 ÷ 2, 38 + 19 + 2, 7 × 5 × 2, −4/9,
// el recíproco de 5, el jardín de 3 × 6 y 6 · 102.
const RR = { dbl: 'R' }, IN = { s: 'in' }, ALL = { s: 'all' }, F = (a, b) => ({ frac: [a, b] }), SQ = v => ({ sqrt: v });
function FILM() {
  beat('Ya armamos los números reales. Ahora vienen las reglas para operar con ellos.', 300, B => {
    const a = B.big('Axiomas de campo', 150, 120, 112); B.hl(a);
    B.big('las reglas de + y ×', 150, 250, 96); B.ul({ x: 150, y: B.Y(250), w: textW('las reglas de + y ×', 96, 'CB'), size: 96 });
  }, { idea: true, min: 3 });
  beat(['Piensa en un juego de mesa: en el ajedrez, el alfil se mueve en diagonal.', 'Nadie lo demuestra: son las reglas del juego.'], 420, B => {
    const x0 = 200, s = 80;
    for (let i = 0; i <= 4; i++) { B.pen([[x0, B.Y(40 + i * s)], [x0 + 4 * s, B.Y(40 + i * s)]], { w: 2 }, 0.06); B.pen([[x0 + i * s, B.Y(40)], [x0 + i * s, B.Y(40 + 4 * s)]], { w: 2 }, 0.06); }
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) B.fillRect(x0 + i * s, 40 + j * s, s, s, COL.gray, { d: 0.04, sp: 8 });
    B.circ(x0 + 40, 320, 22, { w: 2.6 }, 0.1); B.pen([[x0 + 40, B.Y(298)], [x0 + 40, B.Y(270)]], { w: 2.6 }, 0.06);
    B.arrow([[x0 + 70, B.Y(290)], [x0 + 290, B.Y(70)]], { w: 3.6 });
    B.at(1); B.txt('reglas del juego', 620, 200, 64, { col: 'coral' });
  });
  beat(['En matemáticas, a las reglas que se aceptan sin demostrar se les llama axiomas.', 'Los axiomas de campo son las reglas de la suma y el producto.'], 250, B => {
    const a = B.big('axioma', 200, 90, 96); B.hl(a); B.txt('= regla que no se demuestra', 200, 200, 58);
  }, { idea: true });
  beat(['Como las reglas valen para todos los números, se escriben con letras.', 'La A al revés significa para todo, y a, b pertenecen a los reales: pueden ser cualquier real.'], 300, B => {
    B.m([ALL, 'a, b', IN, RR, ':'], 200, 100, 100);
    B.at(1); B.txt('«para todo»', 170, 200, 60, { col: 'coral' }); B.txt('cualquier real', 600, 200, 60, { col: 'coral' });
  }, { page: true });
  beat('Primera regla, la cerradura: si sumas o multiplicas dos reales, el resultado sigue siendo real.', 200, B => {
    B.m(['a + b', IN, RR], 200, 90, 88); B.m(['a · b', IN, RR], 600, 90, 88);
    B.m([SQ('2'), '+', F('1', '3'), IN, RR], 200, 200, 80, { col: 'coral' });
  }, { idea: true });
  beat(['Conmutativa: dos dulces y luego cinco, o cinco y luego dos: siete igual.', 'Tres filas de cuatro puntos son doce; si giramos el dibujo, quedan cuatro filas de tres: los mismos doce.'], 440, B => {
    B.m(['2 + 5', '=', '5 + 2'], 200, 80, 92);
    B.at(1); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) B.dot(220 + c * 60, 190 + r * 60, COL.blue, 14);
    B.arrow([[500, B.Y(250)], [600, B.Y(250)]], { w: 3.4 }, 0.2);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) B.dot(660 + c * 60, 170 + r * 60, COL.blue, 14);
    B.m(['3 · 4', '=', '4 · 3'], 280, 420, 88, { col: 'coral' });
  });
  beat('Es la propiedad conmutativa: el orden no cambia el resultado.', 130, B => {
    const r = B.m(['a + b', '=', 'b + a'], 200, 90, 92); B.m(['a · b', '=', 'b · a'], 620, 90, 92); B.hl({ x: 190, y: r.y, w: 760, size: 92 }, COL.green);
  });
  beat(['Ojo: la resta no conmuta. Cinco menos dos es tres, pero dos menos cinco es menos tres.', 'La división tampoco: ocho entre dos es cuatro, y dos entre ocho es un cuarto.'], 240, B => {
    B.m(['5 − 2', '=', '3'], 200, 90, 84); B.m(['2 − 5', '=', '−3'], 620, 90, 84, { col: 'coral' });
    B.at(1); B.m(['8 ÷ 2', '=', '4'], 200, 200, 84); B.m(['2 ÷ 8', '=', F('1', '4')], 620, 200, 84, { col: 'coral' });
  }, { page: true });
  beat(['Asociativa: para sumar tres números se suman de dos en dos, y los paréntesis dicen cuál pareja va primero.', 'Si agrupamos distinto, el resultado es el mismo.'], 240, B => {
    B.m(['(8 + 3) + 7', '=', '11 + 7', '=', '18'], 170, 90, 76);
    B.at(1); B.m(['8 + (3 + 7)', '=', '8 + 10', '=', '18'], 170, 200, 76, { col: 'coral' });
  }, { idea: true });
  beat(['Con las dos juntas se hacen cuentas de cabeza: primero los números que dan algo redondo.', 'Treinta y ocho más dos son cuarenta, más diecinueve: cincuenta y nueve. Y siete por cinco por dos es siete por diez.'], 260, B => {
    B.m(['38 + 19 + 2', '=', '40 + 19', '=', '59'], 170, 90, 76);
    B.at(1); B.m(['7 · 5 · 2', '=', '7 · 10', '=', '70'], 170, 210, 76, { col: 'coral' });
  });
  beat(['Neutros: sumar cero no cambia nada, y multiplicar por uno tampoco.', 'Cero es el neutro de la suma y uno el del producto. Ojo: multiplicar por cero sí cambia todo.'], 200, B => {
    B.m(['a + 0', '=', 'a'], 200, 90, 92); B.m(['a · 1', '=', 'a'], 620, 90, 92);
    B.at(1); B.txt('ojo: a · 0 = 0 sí cambia todo', 200, 200, 58, { col: 'coral' });
  }, { page: true, idea: true });
  beat(['Cada número tiene un opuesto que, al sumarlo, lo devuelve al cero.', 'El opuesto de cuatro novenos es menos cuatro novenos.'], 200, B => {
    B.m(['a + (−a)', '=', '0'], 200, 90, 92);
    B.at(1); B.m([F('4', '9'), '+', '(', F('−4', '9'), ')', '=', '0'], 200, 220, 84, { col: 'coral' });
  });
  beat(['En el producto, la pareja que devuelve al uno es el recíproco: se voltea la fracción.', 'Siete es siete sobre uno, así que su recíproco es un séptimo.'], 240, B => {
    B.m(['a', '·', F('1', 'a'), '=', '1'], 200, 110, 92); B.txt('si a ≠ 0', 640, 100, 58);
    B.at(1); B.m(['7', '=', F('7', '1'), { s: 'to' }, F('1', '7')], 200, 230, 84, { col: 'coral' });
  });
  beat(['El cero no tiene recíproco: cero por cualquier número da cero, nunca uno.', 'Por eso el denominador nunca puede ser cero.'], 120, B => {
    B.m(['0 · x', '=', '0', '≠', '1'], 200, 90, 88, { col: 'coral' });
  });
  beat(['La última regla une la suma con el producto.', 'Un jardín de tres metros de ancho y seis de largo, partido en dos zonas: una de cuatro metros y otra de dos.'], 380, B => {
    const x = 200, y0 = 60, k = 100;
    B.rect(x, y0, 6 * k, 3 * k); B.at(1); B.pen([[x + 4 * k, B.Y(y0)], [x + 4 * k, B.Y(y0 + 3 * k)]], { layer: 'coral', w: 3 });
    B.fillRect(x, y0, 4 * k, 3 * k, COL.green, { a: 0.75 }); B.fillRect(x + 4 * k, y0, 2 * k, 3 * k, COL.mustard, { a: 0.8 });
    B.txt('4', x + 2 * k - 10, y0 - 14, 56, { f: 'CB' }); B.txt('2', x + 5 * k - 10, y0 - 14, 56, { f: 'CB' }); B.txt('3', x - 50, y0 + 1.6 * k, 56, { f: 'CB' });
  }, { page: true, idea: true });
  beat(['El área total es tres por seis: dieciocho.', 'Sumando las dos zonas: tres por cuatro más tres por dos, doce más seis: dieciocho otra vez.'], 240, B => {
    B.m(['3 · (4 + 2)', '=', '3 · 6', '=', '18'], 170, 90, 76);
    B.at(1); B.m(['3 · 4 + 3 · 2', '=', '12 + 6', '=', '18'], 170, 200, 76, { col: 'coral' });
  });
  beat('Es la propiedad distributiva: el factor de afuera se reparte, multiplicando a cada sumando.', 140, B => {
    const r = B.m(['a · (b + c)', '=', 'a · b + a · c'], 170, 100, 92); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 92 });
  });
  beat(['Sirve para cuentas difíciles: seis por ciento dos es seis por cien más seis por dos.', 'Y al revés sirve para sacar factor común.'], 240, B => {
    B.m(['6 · 102', '=', '600 + 12', '=', '612'], 170, 90, 80);
    B.at(1); B.m(['5x + 5y', '=', '5 · (x + y)'], 170, 210, 80, { col: 'coral' });
  });
  beat(['Juntemos todo. La suma y el producto cumplen estas reglas: por eso los reales forman un campo.', 'Una pareja para la suma y otra para el producto, y la distributiva que las une.'], 720, B => {
    B.big('Los axiomas de campo', 170, 90, 88);
    const rows = [['cerradura', ['a + b', IN, RR], ['a · b', IN, RR]], ['conmutativa', ['a + b = b + a'], ['ab = ba']], ['asociativa', ['(a+b)+c = a+(b+c)'], ['(ab)c = a(bc)']], ['neutro', ['a + 0 = a'], ['a · 1 = a']], ['inverso', ['a + (−a) = 0'], ['a ·', F('1', 'a'), '= 1']]];
    rows.forEach(([n, s1, s2], i) => { const y = 200 + i * 92; B.txt(n, 170, y, 48, { col: 'coral', cps: 1600, gap: 0.03 }); B.m(s1, 420, y, 46, { cps: 1800 }); B.m(s2, 790, y, 46, { cps: 1800 }); });
    B.txt('(a ≠ 0)', 820, 620, 44, { col: 'coral' });
    B.at(1); B.txt('distributiva:  a(b + c) = ab + ac', 170, 700, 56, { f: 'CB' });
  }, { page: true, hold: 1.0 });
  beat(['Repasemos.', 'Los axiomas de campo son las reglas de la suma y el producto: cerradura, conmutativa, asociativa, neutros, inversos y distributiva.'], 420, B => {
    SFX.push({ t: B.t, type: 'title', d: 0, pan: 0 });
    const r = B.big('Repasemos', 150, 130, 120); B.hl(r);
    B.at(1); B.txt('cerradura · conmutativa · asociativa', 170, 270, 58);
    B.txt('neutros · inversos · distributiva', 170, 370, 58, { col: 'coral' });
  }, { page: true, hold: 1.2 });
}
