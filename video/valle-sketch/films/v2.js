// V2 · alg-11b «Los números racionales: fracciones y decimales» (Valle de los Números, lección 2). Libro UdeA §1.1.
// Ejemplos del video: 3 panes para 4 amigos, 1/2 = 2/4 = 3/6, −3/1, 3/4 = 0.75, 2/11, 0.8, 0.15 y 0.777… = 7/9.
const NN = { dbl: 'N' }, ZZ = { dbl: 'Z' }, QQ = { dbl: 'Q' }, IN = { s: 'in' }, SUB = { s: 'sub' }, F = (a, b) => ({ frac: [a, b] });
function bread(B, x, dy, cut) {
  const y = B.Y(dy), P = [[x, y], [x + 150, y - 4], [x + 158, y + 70], [x + 4, y + 74], [x, y]];
  B.pen(P, { w: 2.8 }); B.fill(P, COL.honey, { sp: 10 }, 0.15);
  if (cut) for (let i = 1; i < 4; i++) B.pen([[x + i * 38, y - 2], [x + i * 39, y + 72]], { layer: 'coral', w: 2.6 }, 0.06);
}
function friend(B, x, dy) { B.circ(x, dy, 30, { w: 2.6 }, 0.12); B.pen(ell(x, B.Y(dy + 90), 46, 50, 0, Math.PI, TAU, 14), { w: 2.6 }, 0.12); }
function FILM() {
  beat('Con los enteros ya podemos sumar, restar y multiplicar. Pero falta dividir.', 300, B => {
    const a = B.big('Los números', 150, 120, 116); B.ul(a);
    const b = B.big('racionales', 150, 250, 116); B.hl(b);
  }, { idea: true, min: 3 });
  beat(['Tres panes para repartir entre cuatro amigos.', 'A cada uno no le toca ni un pan entero.'], 400, B => {
    bread(B, 180, 60); bread(B, 400, 60); bread(B, 620, 60);
    [220, 400, 580, 760].forEach(x => friend(B, x, 230));
  });
  beat(['La solución: partir cada pan en cuatro pedazos iguales.', 'Salen doce cuartos, y a cada amigo le tocan tres: tres cuartos de pan.'], 300, B => {
    bread(B, 180, 40, 1); bread(B, 400, 40, 1); bread(B, 620, 40, 1);
    B.at(1); const r = B.m(['3', '÷', '4', '=', F('3', '4')], 220, 240, 96); B.hl({ x: r.at[4][0] - 45, y: r.y, w: 90, size: 96 });
  });
  beat('Tres cuartos no es un entero: la división se escapó de los enteros.', 130, B => {
    B.m([F('3', '4'), { s: 'nin' }, ZZ], 200, 90, 96, { col: 'coral' });
    B.txt('está entre 0 y 1', 520, 80, 56);
  });
  beat(['Una fracción tiene dos números separados por una raya.', 'El de abajo, el denominador, dice en cuántas partes iguales se partió el entero.', 'El de arriba, el numerador, dice cuántas partes se toman.'], 420, B => {
    B.m([F('3', '4')], 200, 230, 200);
    B.at(1); B.arrow([[520, B.Y(300)], [380, B.Y(300)]], { w: 3.6 }, 0.25); B.txt('denominador:', 540, 290, 58, { col: 'coral' }); B.txt('partes iguales', 540, 350, 58);
    B.at(2); B.arrow([[520, B.Y(120)], [380, B.Y(120)]], { w: 3.6 }, 0.25); B.txt('numerador:', 540, 110, 58, { col: 'coral' }); B.txt('partes que se toman', 540, 170, 58);
  }, { page: true, idea: true });
  beat(['Todas las fracciones de enteros forman el conjunto de los racionales.', 'Se escribe con una cu de doble trazo, de cociente.'], 200, B => {
    const r = B.m([QQ, '=', '{', F('a', 'b'), ':', 'a, b', IN, ZZ, ',', 'b ≠ 0', '}'], 160, 120, 76);
    B.at(1); B.hl({ x: r.x0, y: r.y, w: tokW(QQ, 76), size: 76 });
  }, { idea: true });
  beat(['El de abajo no puede ser cero: dividir entre cero es repartir entre cero amigos.', 'No hay a quién darle, y la pregunta no tiene sentido.'], 130, B => {
    B.m(['b ≠ 0'], 180, 80, 88, { col: 'coral' }); B.txt('no se reparte entre nadie', 470, 76, 58);
  });
  beat('Ejemplos de racionales: tres cuartos, menos dos quintos, siete medios.', 170, B => {
    B.m([F('3', '4'), ',', F('−2', '5'), ',', F('7', '2'), IN, QQ], 200, 120, 96);
  });
  // ---- equivalentes ----
  beat(['Una misma cantidad se puede escribir con distintas fracciones.', 'Medio pan, dos cuartos y tres sextos son la misma cantidad.'], 420, B => {
    const bar = (dy, n, k) => { const x = 200, w = 480; B.rect(x, dy, w, 70); for (let i = 1; i < n; i++) B.pen([[x + w * i / n, B.Y(dy)], [x + w * i / n, B.Y(dy + 70)]], { w: 2 }, 0.05); B.fillRect(x, dy, w * k / n, 70, COL.honey, { sp: 10 }); };
    bar(40, 2, 1); B.at(1); bar(150, 4, 2); bar(260, 6, 3);
    B.m([F('1', '2')], 740, 110, 76); B.m([F('2', '4')], 740, 220, 76); B.m([F('3', '6')], 740, 330, 76);
  }, { page: true });
  beat(['Son fracciones equivalentes: se multiplica arriba y abajo por el mismo número.', 'No son tres números distintos, sino tres nombres del mismo número.'], 200, B => {
    B.m([F('1', '2'), '=', F('1 · 3', '2 · 3'), '=', F('3', '6')], 180, 120, 92);
    B.at(1); B.txt('tres nombres, un solo número', 200, 210, 60, { col: 'coral' });
  }, { idea: true });
  beat(['Los enteros también son racionales: basta ponerles un uno abajo.', 'Menos tres es menos tres sobre uno.'], 150, B => {
    B.m(['−3', '=', F('−3', '1'), IN, QQ], 200, 110, 96);
  });
  beat('Así los naturales caben en los enteros, y los enteros en los racionales: bolsas una dentro de otra.', 520, B => {
    B.pen(ell(600, B.Y(260), 440, 250, 0, 0.3, 0.3 + TAU * 1.03, 60), { w: 3 }, 0.6);
    B.pen(ell(660, B.Y(270), 300, 170, 0, 2, 2 + TAU * 1.03, 50), { w: 3 }, 0.5);
    B.pen(ell(720, B.Y(280), 150, 90, 0, 1, 1 + TAU * 1.03, 40), { w: 3 }, 0.4);
    B.fill(ell(600, B.Y(260), 440, 250, 0, 0, TAU, 60), COL.sky, { a: 0.6, sp: 18 }, 0.35);
    B.fill(ell(660, B.Y(270), 300, 170, 0, 0, TAU, 50), COL.green, { a: 0.6, sp: 16 }, 0.3);
    B.fill(ell(720, B.Y(280), 150, 90, 0, 0, TAU, 40), COL.mustard, { a: 0.8, sp: 12 }, 0.25);
    B.m([QQ], 210, 200, 80); B.m([ZZ], 400, 230, 80); B.m([NN], 690, 300, 76);
    B.m([NN, SUB, ZZ, SUB, QQ], 330, 500, 92);
  });
  // ---- decimales ----
  beat(['Toda fracción se puede escribir como decimal: se divide el de arriba entre el de abajo.', 'Tres entre cuatro da cero punto setenta y cinco. Ese decimal termina.'], 150, B => {
    B.m([F('3', '4'), '=', '3 ÷ 4', '=', '0.75'], 180, 110, 96);
  }, { page: true, idea: true });
  beat(['Otras veces la división nunca termina, pero las cifras se repiten.', 'Dos entre once da cero punto dieciocho, dieciocho, dieciocho, sin parar.'], 150, B => {
    B.m([F('2', '11'), '=', '0.181818…'], 180, 110, 96);
  });
  beat(['El grupo que se repite se llama período.', 'Para no escribir los puntos, se le pone una rayita encima.'], 150, B => {
    const r = B.m([F('2', '11'), '=', '0.', { bar: '18', tight: true }], 180, 110, 96); B.txt('período', 640, 90, 60, { col: 'coral' });
  });
  beat(['Con las fracciones solo pasan dos cosas: el decimal termina, o se repite.', 'Nunca sigue para siempre sin repetirse.'], 200, B => {
    const a = B.big('termina', 200, 90, 88); B.big('o', 500, 90, 88); const b = B.big('se repite', 580, 90, 88);
    B.hl(a); B.hl(b, COL.green);
  }, { idea: true });
  beat(['Al revés: si el decimal termina, se lee en voz alta.', 'Cero punto ocho son ocho décimas: ocho sobre diez, que se simplifica a cuatro quintos.'], 170, B => {
    B.m(['0.8', '=', F('8', '10'), '=', F('4', '5')], 180, 120, 96);
  });
  beat('Con dos cifras son centésimas: cero punto quince es quince sobre cien, y queda tres veinteavos.', 170, B => {
    B.m(['0.15', '=', F('15', '100'), '=', F('3', '20')], 180, 120, 96);
  });
  beat(['Y todo decimal periódico viene de una fracción.', 'Le ponemos nombre al número: equis igual a cero punto siete, siete, siete.'], 140, B => {
    B.at(1); B.m(['x', '=', '0.777…'], 200, 100, 96);
  }, { page: true });
  beat(['Como el período tiene una cifra, multiplicamos por diez.', 'Al restar, las colas infinitas se cancelan.'], 300, B => {
    B.m(['10x', '=', '7.777…'], 160, 90, 96);
    B.at(1); B.coral([[150, B.Y(130)], [700, B.Y(128)]], { w: 3 });
    B.m(['9x', '=', '7'], 200, 230, 96);
  });
  beat(['Entonces equis es siete novenos.', 'Por eso los decimales periódicos también son racionales.'], 180, B => {
    const r = B.m(['x', '=', F('7', '9')], 200, 120, 110); B.hl({ x: r.at[2][0] - 40, y: r.y, w: 80, size: 110 });
  }, { idea: true });
  beat(['Repasemos.', 'Los racionales son las fracciones de enteros.', 'Su decimal termina o se repite, y los enteros viven dentro de ellos.'], 560, B => {
    SFX.push({ t: B.t, type: 'title', d: 0, pan: 0 });
    const r = B.big('Repasemos', 150, 130, 120); B.hl(r);
    B.at(1); B.m([QQ, '=', '{', F('a', 'b'), ':', 'a, b', { s: 'in' }, ZZ, ',', 'b ≠ 0', '}'], 170, 300, 70);
    B.at(2); B.txt('decimal: termina o se repite', 170, 430, 62);
    B.m([ZZ, SUB, QQ], 170, 540, 92);
  }, { page: true, hold: 1.2 });
}
