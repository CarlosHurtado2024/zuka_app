// V6 · alg-12d «Axiomas de orden y valor absoluto» (Valle de los Números, lección 6). Libro UdeA §1.2.
// Ejemplos del video: −5 < −2, 1.4 < √2, la fila de Ana, Beto y Caro, 1 < 4 (+2, ×3, ×(−1)), |−6|, |√2 − 1.5|,
// la distancia entre −4 y 3 y |x − 1| ≤ 2.
const RR = { dbl: 'R' }, SQ = v => ({ sqrt: v });
function FILM() {
  beat('Los números reales, además de sumarse y multiplicarse, se pueden ordenar.', 300, B => {
    const a = B.big('Orden y', 150, 120, 116); B.ul(a);
    const b = B.big('valor absoluto', 150, 250, 116); B.hl(b);
  }, { idea: true, min: 3 });
  beat(['Todo empieza con los positivos: los que están a la derecha del cero.', 'Primera regla: si sumas o multiplicas dos positivos, el resultado también es positivo.'], 360, B => {
    const X = B.axis(170, 1030, 90, -4, 4, { labels: [-4, 0, 4] });
    B.coral([[X(0.2), B.Y(150)], [X(3.8), B.Y(150)]], { w: 4 }); B.txt('positivos', X(1.2), 210, 58, { col: 'coral' });
    B.at(1); B.m(['a, b > 0', { s: 'to' }, 'a + b > 0', ',', 'ab > 0'], 170, 320, 64);
  });
  beat(['Segunda regla, la tricotomía: todo real es positivo, o es cero, o es negativo.', 'Exactamente una de las tres, nunca dos a la vez.'], 160, B => {
    B.txt('positivo  ·  cero  ·  negativo', 180, 90, 66, { f: 'CB' });
    B.at(1); B.txt('solo una', 400, 160, 60, { col: 'coral' });
  }, { idea: true });
  beat(['A es menor que b cuando b menos a da un número positivo.', 'Menos cinco es menor que menos dos, porque menos dos menos menos cinco da tres.'], 340, B => {
    const r = B.m(['a < b', { s: 'iff' }, 'b − a > 0'], 170, 90, 84); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 84 });
    B.at(1); B.m(['−5 < −2', ':', '−2 − (−5)', '=', '3'], 170, 210, 72, { col: 'coral' });
    const X = B.axis(170, 1030, 300, -6, 0, { labels: [-5, -2, 0] }); B.dot(X(-5), 300); B.dot(X(-2), 300, COL.blue);
  }, { page: true });
  beat(['En la recta, el menor siempre queda a la izquierda.', 'Sirve también con irracionales: uno punto cuatro es menor que raíz de dos.'], 160, B => {
    B.txt('el menor, a la izquierda', 170, 70, 62);
    B.at(1); B.m(['1.4', '<', SQ('2'), '=', '1.414…'], 170, 160, 80, { col: 'coral' });
  });
  beat(['Hay cuatro signos para comparar. La boca abierta siempre mira al más grande.', 'El signo con rayita lleva una o: cuatro es menor o igual que cuatro es verdad.'], 260, B => {
    B.txt('<     >     ≤     ≥', 200, 100, 100, { f: 'CB' });
    B.at(1); B.m(['4 ≤ 4'], 200, 220, 84, { col: 'coral' }); B.txt('porque son iguales', 480, 216, 58);
  }, { idea: true });
  beat(['La transitiva: si a es menor que b, y b menor que c, entonces a es menor que c.', 'Si Ana es más baja que Beto, y Beto más bajo que Caro, Ana es más baja que Caro.'], 420, B => {
    B.m(['a < b', ',', 'b < c', { s: 'to' }, 'a < c'], 170, 90, 76);
    B.at(1); [['Ana', 200, 1.0], ['Beto', 420, 1.25], ['Caro', 640, 1.5]].forEach(([n, x, k]) => { const top = 380 - 160 * k; B.circ(x + 40, top - 24, 24, { w: 2.4 }, 0.1); B.pen([[x + 40, B.Y(top)], [x + 40, B.Y(380)]], { w: 2.6 }, 0.1); B.txt(n, x, 430, 54, { cps: 1200 }); });
  }, { page: true });
  beat(['Si a uno menor que cuatro le sumamos dos a los dos lados, queda tres menor que seis: sumar conserva el orden.', 'Multiplicar por tres, un positivo, también: tres menor que doce.'], 260, B => {
    B.m(['1 < 4', { s: 'to' }, '3 < 6'], 170, 90, 84); B.txt('+2', 720, 86, 60, { col: 'coral' });
    B.at(1); B.m(['1 < 4', { s: 'to' }, '3 < 12'], 170, 210, 84); B.txt('×3', 720, 206, 60, { col: 'coral' });
  }, { idea: true });
  beat(['Pero al multiplicar por menos uno, cada punto salta a su reflejo en el espejo del cero.', 'Uno y cuatro pasan a menos uno y menos cuatro: el orden se voltea.'], 420, B => {
    const X = B.axis(170, 1030, 150, -5, 5, { labels: [-4, -1, 0, 1, 4] });
    B.coral([[X(0), B.Y(50)], [X(0), B.Y(230)]], { w: 4 }); B.dot(X(1), 150, COL.blue); B.dot(X(4), 150, COL.blue);
    B.at(1); B.dot(X(-1), 150); B.dot(X(-4), 150);
    const r = B.m(['1 < 4', { s: 'to' }, '−1 > −4'], 170, 360, 88, { col: 'coral' }); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 88 });
  }, { page: true, idea: true });
  beat(['El valor absoluto de un número es su distancia al cero.', 'Una distancia nunca es negativa: seis pasos a la izquierda siguen siendo seis pasos.'], 300, B => {
    const X = B.axis(170, 1030, 120, -7, 2, { labels: [-6, 0] });
    B.at(1); B.coral([[X(-6), B.Y(80)], [X(0), B.Y(80)]], { w: 4 }); B.txt('6 pasos', X(-3.8), 60, 58, { col: 'coral' });
    B.m(['|−6|', '=', '6'], 260, 270, 92);
  }, { page: true });
  beat(['En fórmula: si el número es positivo o cero, se queda igual; si es negativo, se toma su opuesto.', 'Ojo: si a es menos seis, menos a es seis.'], 340, B => {
    B.txt('|a| =', 170, 160, 84, { f: 'CB' });
    B.pen([[410, B.Y(60)], [385, B.Y(70)], [385, B.Y(130)], [365, B.Y(140)], [385, B.Y(150)], [385, B.Y(210)], [410, B.Y(220)]], { w: 3 });
    B.txt('a,   si a ≥ 0', 430, 110, 66, { f: 'CB' }); B.txt('−a,  si a < 0', 430, 200, 66, { f: 'CB', col: 'coral' });
    B.at(1); B.m(['−(−6)', '=', '6'], 260, 320, 76, { col: 'coral' });
  }, { idea: true });
  beat(['Con un irracional adentro: raíz de dos es uno punto cuatro uno, menor que uno punto cinco, así que la resta es negativa.', 'Se toma el opuesto: uno punto cinco menos raíz de dos, más o menos cero punto cero ocho seis.'], 260, B => {
    B.m(['|', SQ('2'), '− 1.5 |'], 170, 100, 84); B.txt('adentro es negativo', 600, 96, 56);
    B.at(1); B.m(['=', '1.5 −', SQ('2'), '≈', '0.086'], 170, 220, 84, { col: 'coral' });
  }, { page: true });
  beat(['La distancia entre dos números es el valor absoluto de su resta. Entre menos cuatro y tres hay siete pasos.', 'No importa el orden de la resta: el valor absoluto quita el signo.'], 340, B => {
    const X = B.axis(170, 1030, 110, -5, 4, { labels: [-4, 0, 3] }); B.dot(X(-4), 110); B.dot(X(3), 110);
    B.coral([[X(-4), B.Y(60)], [X(3), B.Y(60)]], { w: 4 });
    B.m(['|3 − (−4)|', '=', '7'], 200, 250, 80);
    B.at(1); B.m(['d(a, b)', '=', '|a − b|'], 200, 340, 76, { col: 'coral' });
  }, { idea: true });
  beat(['Al revés: los números a distancia de a lo sumo dos del uno cumplen esto.', 'Desde el uno caminamos dos pasos a cada lado: llegamos al menos uno y al tres.'], 330, B => {
    B.m(['|x − 1|', '≤', '2'], 200, 90, 88);
    B.at(1); const X = B.axis(170, 1030, 220, -3, 5, { labels: [-1, 1, 3] }); B.dot(X(1), 220, COL.blue);
    B.coral([[X(-1), B.Y(220)], [X(3), B.Y(220)]], { w: 7 }); B.dot(X(-1), 220); B.dot(X(3), 220);
  }, { page: true });
  beat(['Ese tramo se llama intervalo, y se escribe con corchetes cuando los extremos entran.', 'Si el signo fuera menor estricto, los extremos no entrarían y se usan paréntesis.'], 240, B => {
    const r = B.m(['[−1, 3]'], 200, 90, 100); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 100 }); B.txt('los extremos entran', 520, 80, 58);
    B.at(1); B.m(['(−1, 3)'], 200, 210, 100, { col: 'coral' }); B.txt('no entran', 520, 200, 58, { col: 'coral' });
  }, { idea: true });
  beat(['Repasemos.', 'Los reales se ordenan con los positivos: a es menor que b cuando b menos a es positivo.', 'Y el valor absoluto mide distancias.'], 560, B => {
    SFX.push({ t: B.t, type: 'title', d: 0, pan: 0 });
    const r = B.big('Repasemos', 150, 130, 120); B.hl(r);
    B.at(1); B.m(['a < b', { s: 'iff' }, 'b − a > 0'], 170, 300, 80);
    B.at(2); B.m(['|a|', '=', 'distancia al 0'], 170, 430, 80, { col: 'coral' });
  }, { page: true, hold: 1.2 });
}
