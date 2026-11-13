// V1 · alg-11 «Los números naturales y los enteros» (Valle de los Números, lección 1). Libro UdeA §1.1.
// Ejemplos del video (no salen en los ejercicios): manzanas, 5 ∈ ℕ, termómetro 2 − 5, sótanos y deuda, el espejo del cero.
const NN = { dbl: 'N' }, ZZ = { dbl: 'Z' }, QQ = { dbl: 'Q' }, RR = { dbl: 'R' }, IN = { s: 'in' }, NIN = { s: 'nin' }, SUB = { s: 'sub' };
function apple(B, x, dy, k = 1) {
  const y = B.Y(dy), body = ell(x, y, 46 * k, 42 * k, 0, -1.2, -1.2 + TAU * 1.04, 30);
  B.pen(body, { w: 2.8 });
  B.pen([[x, y - 40 * k], [x + 4 * k, y - 66 * k]], { w: 2.6 });
  const lf = ell(x + 22 * k, y - 60 * k, 18 * k, 8 * k, -0.5, 0, TAU, 16); B.pen(lf, { w: 2.2 });
  B.fill(ell(x, y, 46 * k, 42 * k, 0, 0, TAU, 30), COL.red, { sp: 8 }, 0.18); B.fill(lf, COL.leaf, { sp: 5 }, 0.06);
}
function FILM() {
  beat('Los números también forman conjuntos.', 300, B => {
    const a = B.big('Los números', 150, 120, 120);
    const b = B.big('naturales y enteros', 150, 250, 104);
    B.hl({ x: 150, y: b.y, w: textW('naturales', 104, 'CB'), size: 104 });
    B.ul(a);
  }, { idea: true, min: 3 });
  beat('Algunos son tan importantes que tienen nombre propio, con letras de doble trazo.', 330, B => {
    B.m([NN, ZZ, QQ, RR], 200, 120, 130);
    B.txt('letras de doble trazo:', 200, 250, 52);
    B.txt('una línea de más', 200, 310, 52, { col: 'coral' });
  });
  beat(['Los primeros números sirven para contar.', 'Una, dos, tres manzanas.'], 300, B => {
    B.at(1); apple(B, 260, 110); apple(B, 470, 110); apple(B, 680, 110);
    ['1', '2', '3'].forEach((s, i) => B.mid(s, 260 + i * 210, 250, 76, { f: 'CB' }));
  });
  beat('Esos números forman el conjunto de los naturales.', 150, B => {
    const r = B.m([NN, '=', '{1, 2, 3, 4, …}'], 160, 110, 96);
    B.hl({ x: r.x0, y: r.y, w: tokW(NN, 96), size: 96 });
  }, { idea: true });
  beat('Los tres puntos dicen que la lista sigue para siempre.', 90, B => {
    B.txt('… : la lista sigue para siempre', 160, 60, 56, { col: 'coral' });
  });
  beat(['El cinco pertenece a los naturales.', 'Menos dos no: no se cuentan menos dos manzanas.', 'Un medio tampoco: es un pedazo, no un conteo.', 'Y en este curso, el cero no es natural.'], 330, B => {
    B.m(['5', IN, NN], 180, 80, 84); B.txt('se cuenta', 560, 80, 52);
    B.at(1); B.m(['−2', NIN, NN], 180, 160, 84); B.txt('no se cuenta', 560, 160, 52);
    B.at(2); B.m(['½', NIN, NN], 180, 240, 84); B.txt('es un pedazo', 560, 240, 52);
    B.at(3); B.m(['0', NIN, NN], 180, 320, 84); B.txt('empezamos en 1', 560, 320, 52);
  });
  beat(['Si sumas o multiplicas dos naturales, el resultado es otro natural.', 'Por eso se dice que los naturales son cerrados para esas dos operaciones.'], 230, B => {
    B.m(['3', '+', '4', '=', '7'], 180, 90, 80); B.m(['3', '×', '4', '=', '12'], 180, 190, 80);
    B.at(1); const c = B.txt('cerrado', 640, 140, 72, { f: 'CB', col: 'coral' }); B.circ(c.x + c.w / 2, 118, 110, { layer: 'coral', ry: 56, w: 3 }, 0.35);
  });

  // ---- la resta se escapa ----
  beat(['Con la resta hay un problema.', 'Un termómetro marca dos grados, y la temperatura baja cinco.', 'Pasa por el cero y sigue bajando: llega a menos tres.'], 760, B => {
    const x = 420, top = 80, step = 92, Yv = v => top + (3 - v) * step + 40;
    B.pen([[x - 34, B.Y(top)], [x - 34, B.Y(Yv(-3) + 30)]], { w: 3 }); B.pen([[x + 34, B.Y(top)], [x + 34, B.Y(Yv(-3) + 30)]], { w: 3 });
    B.pen(ell(x, B.Y(top), 34, 30, 0, Math.PI, TAU, 14), { w: 3 });
    B.circ(x, Yv(-3) + 80, 58, { w: 3 });
    for (let v = 3; v >= -3; v--) { B.pen([[x + 34, B.Y(Yv(v))], [x + 60, B.Y(Yv(v))]], { w: 2.2 }, 0.04); B.txt(String(v).replace('-', '−'), x + 78, Yv(v) + 18, 52, { cps: 900, gap: 0.02 }); }
    B.at(1); B.fillCirc(x, Yv(-3) + 80, 50, COL.red, { a: 0.9 }); B.fill([[x - 24, B.Y(Yv(2))], [x + 24, B.Y(Yv(2))], [x + 24, B.Y(Yv(-3) + 40)], [x - 24, B.Y(Yv(-3) + 40)]], COL.red, { a: 0.9 }, 0.25);
    B.dot(x - 70, Yv(2), COL.coral); B.txt('hoy: 2°', x - 255, Yv(2) + 16, 54);
    B.at(2); B.arrow([[x - 90, B.Y(Yv(2) + 20)], [x - 110, B.Y(Yv(-0.5))], [x - 90, B.Y(Yv(-3) - 14)]], {});
    B.txt('baja 5', x - 275, Yv(-0.5) + 16, 54, { col: 'coral' });
    B.m(['2', '−', '5', '=', '−3'], 600, 330, 88);
    B.m(['−3', NIN, NN], 630, 460, 88, { col: 'coral' });
    B.txt('la resta se escapó', 600, 560, 56);
  }, { idea: true });
  beat(['Para que la resta siempre tenga respuesta, nacieron los enteros.', 'Los naturales, el cero y los negativos.'], 160, B => {
    const r = B.m([ZZ, '=', '{…, −2, −1, 0, 1, 2, …}'], 150, 110, 84);
    B.hl({ x: r.x0, y: r.y, w: tokW(ZZ, 84), size: 84 });
  }, { idea: true, page: true });
  beat(['En la recta, el cero queda en el centro.', 'A la derecha están los positivos; a la izquierda, los negativos.'], 260, B => {
    const X = B.axis(170, 1030, 90, -5, 5, { labels: [-4, -2, 0, 2, 4] });
    B.dot(X(0), 90, COL.mustard, 15);
    B.at(1); B.coral([[X(0.3), B.Y(190)], [X(4.6), B.Y(190)]], { w: 3 }); B.txt('positivos', X(1.4), 245, 54, { col: 'coral' });
    B.pen([[X(-0.3), B.Y(190)], [X(-4.6), B.Y(190)]], { w: 3 }); B.txt('negativos', X(-4), 245, 54);
  });
  beat(['Los negativos aparecen todos los días.', 'Bajo el nivel del mar, o en una deuda de tres mil pesos.'], 440, B => {
    const wave = Array.from({ length: 13 }, (_, i) => [170 + i * 32, B.Y(110 + 10 * Math.sin(i * 1.3))]);
    B.pen(wave, { w: 3 }); B.fill([...wave, [554, B.Y(400)], [170, B.Y(400)]], COL.sky, { a: 0.75, sp: 14 }, 0.35);
    B.txt('0 m', 470, 90, 50);
    B.circ(300, 230, 22, { w: 2.6 }, 0.1); B.pen([[300, B.Y(252)], [300, B.Y(320)]], { w: 2.6 }); B.pen([[270, B.Y(280)], [330, B.Y(280)]], { w: 2.4 });
    B.txt('−10 m', 400, 240, 50, { col: 'coral' }); B.txt('−20 m', 400, 350, 50, { col: 'coral' });
    B.at(1); B.txt('debo $3 000', 640, 160, 64); B.arrow([[740, B.Y(200)], [740, B.Y(270)]], { w: 3.6 }, 0.25); B.txt('saldo: −3 000', 640, 340, 64, { col: 'coral' });
  });
  beat('Ahora sí: dos menos cinco es menos tres, y menos tres pertenece a los enteros.', 140, B => {
    const r = B.m(['2', '−', '5', '=', '−3', IN, ZZ], 180, 100, 92);
    B.hl({ x: r.at[4][0] - 50, y: r.y, w: 100, size: 92 });
  });

  // ---- el opuesto ----
  beat(['Cada entero tiene un opuesto.', 'Imagina un espejo parado en el cero: el opuesto es el reflejo, a la misma distancia del otro lado.'], 420, B => {
    const X = B.axis(170, 1030, 260, -5, 5, { labels: [-4, 0, 4] });
    B.at(1); B.coral([[X(0), B.Y(60)], [X(0), B.Y(320)]], { w: 4.5 });
    B.txt('espejo', X(0) + 20, 80, 50, { col: 'coral' });
    B.dot(X(4), 260, COL.blue); B.dot(X(-4), 260, COL.blue);
    B.pen(ell(X(0), B.Y(260), X(4) - X(0), 130, 0, -0.1, -Math.PI + 0.1, 30), { w: 2.4, layer: 'light' }, 0.6);
  }, { page: true, idea: true });
  beat(['El opuesto de cuatro es menos cuatro, y el de menos cuatro es cuatro.', 'Un número más su opuesto siempre da cero.'], 230, B => {
    B.m(['−(4)', '=', '−4'], 160, 80, 80); B.m(['−(−4)', '=', '4'], 600, 80, 80);
    B.at(1); const r = B.m(['4', '+', '(−4)', '=', '0'], 260, 200, 92); B.ul({ x: r.x0, y: r.y, w: r.x1 - r.x0, size: 92 });
  });
  beat('El cero es el único número que es su propio opuesto.', 110, B => {
    B.m(['−0', '=', '0'], 180, 80, 80); B.txt('su reflejo es él mismo', 480, 80, 56, { col: 'coral' });
  });

  // ---- ℕ dentro de ℤ ----
  beat(['Todo natural es también entero: los naturales son un subconjunto de los enteros.', 'Lo que tienen los enteros y no los naturales es el cero y los negativos.'], 620, B => {
    const cz = [600, 300], cn = [700, 300];
    B.pen(ell(cz[0], B.Y(cz[1]), 440, 270, 0, 0.3, 0.3 + TAU * 1.03, 60), { w: 3 }, 0.8);
    B.pen(ell(cn[0], B.Y(cn[1]), 230, 160, 0, 2.2, 2.2 + TAU * 1.03, 50), { w: 3 }, 0.6);
    B.fill(ell(cz[0], B.Y(cz[1]), 440, 270, 0, 0, TAU, 60), COL.sky, { a: 0.7, sp: 18 }, 0.45);
    B.fill(ell(cn[0], B.Y(cn[1]), 230, 160, 0, 0, TAU, 50), COL.mustard, { a: 0.8, sp: 14 }, 0.35);
    B.m([NN], 790, 230, 80); B.m([ZZ], 230, 160, 80);
    ['1', '2', '3', '7'].forEach((s, i) => B.txt(s, 620 + (i % 2) * 110, 300 + (i >> 1) * 80, 60, { f: 'CB', cps: 900, gap: 0.02 }));
    B.at(1); ['0', '−1', '−2', '−7'].forEach((s, i) => B.txt(s, 230 + (i % 2) * 120, 300 + (i >> 1) * 90, 60, { f: 'CB', col: 'coral', cps: 900, gap: 0.02 }));
    B.m([NN, SUB, ZZ], 420, 560, 92);
  }, { idea: true });
  beat('Es la diferencia de la unidad de conjuntos: zeta menos ene.', 120, B => {
    B.m([ZZ, '−', NN, '=', '{0, −1, −2, …}'], 170, 90, 80, { col: 'coral' });
  });

  // ---- repaso ----
  beat(['Repasemos.', 'Los naturales sirven para contar.', 'Los enteros resuelven todas las restas, y cada uno tiene su opuesto en el espejo del cero.', 'Y los naturales viven dentro de los enteros.'], 640, B => {
    SFX.push({ t: B.t, type: 'title', d: 0, pan: 0 });
    const r = B.big('Repasemos', 150, 130, 120); B.hl(r);
    B.at(1); B.m([NN, ':', 'para contar'], 170, 280, 80);
    B.at(2); B.m([ZZ, ':', 'todas las restas'], 170, 400, 80);
    B.txt('el opuesto: el espejo del cero', 170, 490, 56);
    B.at(3); const s = B.m([NN, SUB, ZZ], 170, 610, 96); B.ul({ x: s.x0, y: s.y, w: s.x1 - s.x0, size: 96 });
  }, { page: true, hold: 1.2 });
}
