// V5 · alg-12c «Consecuencias de los axiomas: restar, dividir y los signos» (Valle de los Números, lección 5).
// Ejemplos del video: 9 − 4 en la recta, 3 − (−6) con el ascensor, 12 ÷ 3, 2/5 ÷ 3/4, cinco cajas vacías, la tabla
// del 3, la balanza x + 7 = 2 + 7, 4x = 4 · 9, 0 · 2 = 0 · 5 y 7b = 0.
const F = (a, b) => ({ frac: [a, b] });
function FILM() {
  beat('Los axiomas solo hablan de sumar y multiplicar. Todo lo demás sale de ellos.', 300, B => {
    const a = B.big('Consecuencias', 150, 120, 112); B.hl(a);
    B.big('de los axiomas', 150, 250, 104); B.ul({ x: 150, y: B.Y(250), w: textW('de los axiomas', 104, 'CB'), size: 104 });
  }, { idea: true, min: 3 });
  beat(['Restar es sumar el opuesto.', 'Nueve menos cuatro: desde el nueve, cuatro pasos a la izquierda. Es lo mismo que sumar menos cuatro: llegamos al cinco.'], 300, B => {
    const r = B.m(['a − b', '=', 'a + (−b)'], 180, 80, 92); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 92 });
    B.at(1); const X = B.axis(170, 1030, 200, 0, 10, { labels: [0, 5, 9] });
    B.dot(X(9), 200); B.arrow([[X(9), B.Y(180)], [X(7), B.Y(140)], [X(5) + 6, B.Y(180)]], {});
    B.m(['9 − 4', '=', '9 + (−4)', '=', '5'], 170, 330, 72, { col: 'coral' });
  }, { idea: true });
  beat(['Así se entiende restar un negativo: tres menos menos seis es tres más seis.', 'Como en un ascensor: quitar seis pisos de sótano es subir seis.'], 260, B => {
    B.m(['3 − (−6)', '=', '3 + 6', '=', '9'], 170, 90, 84);
    B.at(1); B.rect(780, 120, 120, 140); B.pen([[840, B.Y(120)], [840, B.Y(260)]], { w: 2 }); B.arrow([[740, B.Y(250)], [740, B.Y(130)]], { w: 3.6 }, 0.3);
    B.txt('sube', 600, 210, 58, { col: 'coral' });
  });
  beat(['Dividir es multiplicar por el recíproco.', 'Doce entre tres es repartir doce en tres grupos y tomar uno: doce por un tercio.'], 240, B => {
    const r = B.m(['a ÷ b', '=', 'a ·', F('1', 'b')], 180, 100, 92); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 92 });
    B.at(1); B.m(['12 ÷ 3', '=', '12 ·', F('1', '3'), '=', '4'], 180, 230, 80, { col: 'coral' });
  }, { page: true, idea: true });
  beat('Por eso, para dividir fracciones se voltea la segunda y se multiplica: dos quintos entre tres cuartos da ocho quinceavos.', 170, B => {
    B.m([F('2', '5'), '÷', F('3', '4'), '=', F('2', '5'), '·', F('4', '3'), '=', F('8', '15')], 170, 120, 84);
  });
  beat('No se puede dividir entre cero: sería multiplicar por el recíproco del cero, y el cero no tiene.', 120, B => {
    B.m(['a ÷ 0'], 200, 90, 92, { col: 'coral' }); B.txt('no existe', 470, 84, 66, { f: 'CB', col: 'coral' });
  });
  beat(['Cinco cajas con cero dulces cada una: en total, cero dulces.', 'Cualquier número por cero da cero.'], 280, B => {
    for (let i = 0; i < 5; i++) { const x = 180 + i * 160; B.rect(x, 40, 120, 90); B.pen([[x - 6, B.Y(40)], [x + 60, B.Y(10)], [x + 126, B.Y(40)]], { w: 2.4 }, 0.1); }
    B.at(1); B.m(['5 · 0', '=', '0'], 200, 240, 92, { col: 'coral' });
  }, { page: true });
  beat(['No hace falta una regla nueva: sale de los axiomas.', 'Cero es cero más cero. Se reparte la a: a por cero más a por cero.', 'Sumamos a los dos lados el opuesto de a por cero, y queda: a por cero es cero.'], 400, B => {
    B.m(['a · 0', '=', 'a · (0 + 0)'], 170, 90, 76);
    B.at(1); B.m(['a · 0', '=', 'a · 0 + a · 0'], 170, 200, 76);
    B.at(2); const r = B.m(['0', '=', 'a · 0'], 170, 320, 92, { col: 'coral' }); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 92 });
  }, { idea: true });
  beat(['Ahora, por qué menos por menos da más. Mira la tabla del tres.', 'Cada vez que el segundo factor baja uno, el resultado baja tres. Así tres por menos uno da menos tres.'], 520, B => {
    ['3 · 2 = 6', '3 · 1 = 3', '3 · 0 = 0'].forEach((s, i) => B.txt(s, 200, 90 + i * 90, 72, { f: 'CB', cps: 1400 }));
    B.at(1); B.txt('3 · (−1) = −3', 200, 360, 72, { f: 'CB', col: 'coral' }); B.arrow([[160, B.Y(70)], [160, B.Y(360)]], { w: 3 }, 0.3); B.txt('−3 cada vez', 560, 220, 58);
  }, { page: true });
  beat(['Ahora con menos tres: cada vez que el segundo factor baja uno, el resultado sube tres.', 'Al pasar el cero, menos tres por menos uno da tres: negativo por negativo, positivo.'], 520, B => {
    ['(−3) · 2 = −6', '(−3) · 1 = −3', '(−3) · 0 = 0'].forEach((s, i) => B.txt(s, 200, 90 + i * 90, 72, { f: 'CB', cps: 1400 }));
    B.at(1); const r = B.txt('(−3) · (−1) = 3', 200, 360, 72, { f: 'CB', col: 'coral' }); B.hl(r); B.txt('+3 cada vez', 640, 220, 58);
  }, { idea: true });
  beat(['Otra forma de verlo: multiplicar por menos uno es reflejar en el espejo del cero.', 'Dos reflejos devuelven al lugar del principio.'], 320, B => {
    const X = B.axis(170, 1030, 160, -4, 4, { labels: [-3, 0, 3] });
    B.coral([[X(0), B.Y(60)], [X(0), B.Y(230)]], { w: 4 });
    B.at(1); B.pen(ell(X(0), B.Y(160), X(3) - X(0), 100, 0, -0.1, -Math.PI + 0.1, 24), { layer: 'light', w: 2 }); B.pen(ell(X(0), B.Y(160), X(3) - X(0), 100, 0, Math.PI + 0.1, TAU - 0.1, 24), { layer: 'light', w: 2 });
    B.m(['(−1) · (−1)', '=', '1'], 260, 300, 76, { col: 'coral' });
  }, { page: true });
  beat('En resumen: cuenta los factores negativos. Si son una cantidad par, el resultado es positivo; si es impar, negativo.', 160, B => {
    B.txt('cantidad par de negativos: +', 200, 70, 66, { f: 'CB' }); B.txt('cantidad impar de negativos: −', 200, 150, 66, { f: 'CB', col: 'coral' });
  });
  beat(['Una igualdad es como una balanza en equilibrio: si quitas lo mismo de los dos platillos, sigue en equilibrio.', 'Quitamos el siete de los dos lados, y queda equis igual a dos.'], 460, B => {
    B.pen([[600, B.Y(60)], [600, B.Y(330)]], { w: 3 }); B.pen([[340, B.Y(80)], [860, B.Y(80)]], { w: 3 }); B.pen([[520, B.Y(330)], [680, B.Y(330)]], { w: 3 });
    for (const x of [340, 860]) B.pen(ell(x, B.Y(150), 110, 30, 0, 0, Math.PI, 14), { w: 2.6 });
    B.txt('x + 7', 270, 150, 60, { f: 'CB' }); B.txt('2 + 7', 790, 150, 60, { f: 'CB' });
    B.at(1); B.m(['x + 7', '=', '2 + 7', { s: 'to' }, 'x', '=', '2'], 170, 420, 76, { col: 'coral' });
  }, { page: true, idea: true });
  beat(['Con el producto igual: si cuatro por equis es cuatro por nueve, equis es nueve.', 'Pero el factor que se cancela no puede ser cero: cero por dos es cero por cinco, y dos no es cinco.'], 260, B => {
    B.m(['4x', '=', '4 · 9', { s: 'to' }, 'x', '=', '9'], 170, 90, 80);
    B.at(1); B.m(['0 · 2', '=', '0 · 5'], 170, 210, 80, { col: 'coral' }); B.txt('pero 2 ≠ 5', 620, 206, 62, { col: 'coral' });
  });
  beat(['Una última consecuencia: si un producto da cero, al menos uno de los factores es cero.', 'Si siete por b da cero, b es cero.'], 240, B => {
    const r = B.m(['a · b', '=', '0', { s: 'to' }, 'a = 0  o  b = 0'], 170, 100, 80); B.hl({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 80 });
    B.at(1); B.m(['7b', '=', '0', { s: 'to' }, 'b', '=', '0'], 170, 220, 80, { col: 'coral' });
  }, { page: true, idea: true });
  beat(['Repasemos.', 'Restar es sumar el opuesto, y dividir es multiplicar por el recíproco.', 'De los axiomas salen la ley de los signos y la ley cancelativa.'], 560, B => {
    SFX.push({ t: B.t, type: 'title', d: 0, pan: 0 });
    const r = B.big('Repasemos', 150, 130, 120); B.hl(r);
    B.at(1); B.m(['a − b', '=', 'a + (−b)'], 170, 290, 80); B.m(['a ÷ b', '=', 'a ·', F('1', 'b')], 170, 410, 80);
    B.at(2); B.txt('ley de los signos · cancelativa', 170, 530, 62, { col: 'coral' });
  }, { page: true, hold: 1.2 });
}
