// V3 · alg-11c «Los irracionales y los números reales» (Valle de los Números, lección 3). Libro UdeA §1.1.
// Ejemplos del video: el cuadrado de área 2 (1.4² = 1.96, 1.42²), la rueda de π, el mapa con 8, −6, 2/5 y √3,
// las reglas apiladas entre 1 y 2, y clasificar √16, −10/5, 0.25 y √11.
const NN = { dbl: 'N' }, ZZ = { dbl: 'Z' }, QQ = { dbl: 'Q' }, RR = { dbl: 'R' }, II = { dbl: 'I' }, IN = { s: 'in' }, SUB = { s: 'sub' }, F = (a, b) => ({ frac: [a, b] });
const SQ = v => ({ sqrt: v });
function FILM() {
  beat('Hasta ahora, cada número que vimos se podía escribir como fracción. Hagamos un experimento con un cuadrado.', 300, B => {
    const a = B.big('Los irracionales', 150, 120, 112); B.ul(a);
    const b = B.big('y los reales', 150, 250, 112); B.hl(b);
  }, { idea: true, min: 3 });
  beat(['Tenemos dos cuadritos de área uno.', 'Queremos un solo cuadrado con la misma área: dos.', 'Su lado mide un número que todavía no conocemos.'], 420, B => {
    B.rect(180, 60, 150, 150); B.rect(330, 60, 150, 150); B.fillRect(180, 60, 300, 150, COL.sky, { a: 0.8 });
    B.txt('1', 240, 160, 64, { f: 'CB' }); B.txt('1', 390, 160, 64, { f: 'CB' });
    B.at(1); B.rect(600, 30, 212, 212); B.fillRect(600, 30, 212, 212, COL.mustard, { a: 0.8 }); B.txt('área 2', 640, 160, 58, { f: 'CB' });
    B.at(2); B.txt('lado = ?', 620, 330, 64, { col: 'coral' });
  });
  beat(['Probemos. Uno por uno da uno: muy poco. Dos por dos da cuatro: demasiado.', 'Con un decimal: uno punto cuatro al cuadrado da uno punto noventa y seis, y uno punto cinco se pasa.'], 300, B => {
    B.m(['1²', '=', '1'], 180, 80, 80); B.txt('poco', 470, 80, 56); B.m(['2²', '=', '4'], 640, 80, 80); B.txt('mucho', 900, 80, 56, { col: 'coral' });
    B.at(1); B.m(['1.4²', '=', '1.96'], 180, 190, 80); B.m(['1.5²', '=', '2.25'], 600, 190, 80, { col: 'coral' });
  }, { page: true });
  beat(['Con dos decimales se acerca más, pero uno punto cuarenta y dos ya se pasa de dos.', 'Podemos seguir toda la vida y nunca da exactamente dos.'], 200, B => {
    B.m(['1.41²', '≈', '1.988'], 180, 80, 80); B.m(['1.42²', '≈', '2.016'], 600, 80, 80, { col: 'coral' });
    B.at(1); B.txt('nunca da 2 exacto', 220, 180, 64, { col: 'coral' });
  });
  beat(['Ninguna fracción al cuadrado da dos. Ese lado es un número nuevo: la raíz cuadrada de dos.', 'Su decimal nunca termina y nunca repite un período: es un número irracional.'], 200, B => {
    const r = B.m([SQ('2'), '=', '1.41421356…'], 180, 110, 100); B.hl({ x: r.x0 - 4, y: r.y, w: tokW(SQ('2'), 100) + 8, size: 100 });
    B.at(1); B.txt('ni termina ni se repite', 220, 200, 62, { col: 'coral' });
  }, { idea: true });
  beat(['Otro irracional famoso es pi.', 'Una rueda de un metro de ancho da una vuelta completa y avanza un poco más de tres metros.'], 460, B => {
    B.circ(240, 150, 110, { w: 3 }, 0.4); B.pen([[130, B.Y(150)], [350, B.Y(150)]], { layer: 'light', w: 1.6 }); B.txt('1 m', 210, 130, 50);
    B.dot(240, 260, COL.coral, 11);
    B.at(1); B.pen([[150, B.Y(260)], [1010, B.Y(260)]], { w: 3 });
    for (let i = 0; i <= 3; i++) { const x = 240 + i * 220; B.pen([[x, B.Y(246)], [x, B.Y(276)]], { w: 2.4 }, 0.04); B.txt(String(i), x - 10, 330, 52, { cps: 900, gap: 0.02 }); }
    B.coral([[240, B.Y(300)], [240 + 3.1416 * 220, B.Y(300)]], { w: 4 }); B.dot(240 + 3.1416 * 220, 260, COL.coral, 11);
    B.m([{ s: 'pi' }, '=', '3.14159…'], 300, 420, 92);
  }, { page: true });
  beat(['Hay infinitos irracionales: la raíz de tres, la raíz de diecinueve y muchos más.', 'Aparecen cuando medimos diagonales y curvas.'], 150, B => {
    B.m([SQ('3'), ',', SQ('19'), ',', { s: 'pi' }, ', …'], 200, 110, 96);
  });
  // ---- los reales ----
  beat(['Si unimos los racionales y los irracionales, obtenemos los números reales.', 'Todo número que es racional o irracional.'], 170, B => {
    const r = B.m([RR, '=', QQ, { s: 'cup' }, II], 200, 120, 110); B.hl({ x: r.x0, y: r.y, w: tokW(RR, 110), size: 110 });
  }, { page: true, idea: true });
  beat(['Racionales e irracionales no tienen nada en común: un número es fracción o no lo es.', 'Su intersección es vacía: son disjuntos.'], 160, B => {
    B.m([QQ, { s: 'cap' }, II, '=', { s: 'empty' }], 200, 110, 100);
    B.at(1); B.txt('disjuntos', 640, 100, 64, { col: 'coral' });
  });
  beat(['Este es el mapa de los números. Los reales lo contienen todo.', 'Ocho sirve para contar: va en los naturales, y por eso también en todas las bolsas que lo rodean.', 'Menos seis es entero pero no natural.', 'Menos tres séptimos es racional pero no entero.', 'Y raíz de tres va del lado de los irracionales.'], 760, B => {
    B.rect(150, 40, 900, 680); B.m([RR], 980, 110, 64);
    B.pen([[790, B.Y(40)], [790, B.Y(720)]], { w: 2.4 }); B.m([II], 830, 690, 64);
    B.pen(ell(470, B.Y(380), 300, 300, 0, 0.5, 0.5 + TAU * 1.02, 50), { w: 3 }, 0.5); B.m([QQ], 210, 160, 64);
    B.pen(ell(500, B.Y(430), 200, 200, 0, 1, 1 + TAU * 1.02, 40), { w: 3 }, 0.4); B.m([ZZ], 330, 290, 60);
    B.pen(ell(520, B.Y(480), 100, 100, 0, 2, 2 + TAU * 1.02, 30), { w: 3 }, 0.3); B.m([NN], 480, 430, 56);
    B.fill(ell(470, B.Y(380), 300, 300, 0, 0, TAU, 50), COL.sky, { a: 0.5, sp: 18 }, 0.3);
    B.fill(ell(500, B.Y(430), 200, 200, 0, 0, TAU, 40), COL.green, { a: 0.55, sp: 16 }, 0.25);
    B.fill(ell(520, B.Y(480), 100, 100, 0, 0, TAU, 30), COL.mustard, { a: 0.8, sp: 12 }, 0.2);
    B.at(1); B.txt('8', 510, 530, 70, { f: 'CB', col: 'coral' });
    B.at(2); B.txt('−6', 300, 480, 66, { f: 'CB', col: 'coral' });
    B.at(3); B.m([F('−3', '7')], 230, 420, 64, { col: 'coral' });
    B.at(4); B.m([SQ('3')], 860, 380, 66, { col: 'coral' });
  }, { page: true });
  beat('Cada número tiene una sola casa, la más pequeña donde cabe, pero también vive en todas las bolsas que la contienen.', 190, B => {
    B.txt('la casa más pequeña,', 170, 60, 60, { col: 'coral' }); B.txt('y todas las de afuera', 170, 150, 60, { col: 'coral' });
  });
  beat(['Los reales llenan toda la recta: a cada punto le corresponde un número real.', 'Por eso se llama la recta real.'], 220, B => {
    const X = B.axis(170, 1030, 80, -3, 3, { labels: [-3, -2, -1, 0, 1, 2, 3] });
    B.at(1); B.m([{ s: 'pi' }], X(3.14) - 20, 20, 52, { col: 'coral' }); B.dot(X(1.414), 80, COL.coral, 10); B.m([SQ('2')], X(1.414) - 30, 20, 48, { col: 'coral' });
    B.txt('la recta real', 170, 200, 64, { f: 'CB' });
  }, { page: true, idea: true });
  beat(['Entre dos reales distintos siempre cabe otro, por ejemplo el de la mitad.', 'Mira entre uno y dos con reglas apiladas: cada una tiene diez marcas más, y se puede seguir para siempre.'], 470, B => {
    const ruler = (dy, a, b, lab) => { B.pen([[200, B.Y(dy)], [1000, B.Y(dy)]], { w: 2.8 }, 0.25); for (let i = 0; i <= 10; i++) { const x = 200 + i * 80; B.pen([[x, B.Y(dy - (i % 5 ? 12 : 20))], [x, B.Y(dy + (i % 5 ? 12 : 20))]], { w: 2 }, 0.025); } B.txt(a, 175, dy + 64, 48, { cps: 900 }); B.txt(b, 960, dy + 64, 48, { cps: 900 }); };
    ruler(60, '1', '2');
    B.at(1); B.coral([[440, B.Y(80)], [200, B.Y(170)]], { w: 2 }); B.coral([[520, B.Y(80)], [1000, B.Y(170)]], { w: 2 });
    ruler(200, '1.3', '1.4');
    B.coral([[520, B.Y(220)], [200, B.Y(310)]], { w: 2 }); B.coral([[600, B.Y(220)], [1000, B.Y(310)]], { w: 2 });
    ruler(340, '1.34', '1.35');
    B.txt('siempre cabe otro', 360, 450, 66, { f: 'CB', col: 'coral' });
  });
  // ---- clasificar ----
  beat(['Para saber a qué conjuntos pertenece un número, primero se simplifica.', 'Raíz de dieciséis es cuatro: es fracción, no tiene partes y es positivo.', 'Pertenece a los naturales, los enteros, los racionales y los reales.'], 260, B => {
    B.m([SQ('16'), '=', '4'], 180, 90, 92);
    B.at(1); B.m(['4', '=', F('4', '1')], 600, 90, 80);
    B.at(2); B.m(['4', IN, NN, ',', ZZ, ',', QQ, ',', RR], 180, 220, 80, { col: 'coral' });
  }, { page: true });
  beat(['Menos diez quintos es menos dos: entero, pero no natural.', 'Cero punto veinticinco es un cuarto: racional.', 'Y raíz de once no es exacta: irracional. Todos son reales.'], 330, B => {
    B.m([F('−10', '5'), '=', '−2', IN, ZZ], 180, 90, 80);
    B.at(1); B.m(['0.25', '=', F('1', '4'), IN, QQ], 180, 200, 80);
    B.at(2); B.m([SQ('11'), IN, II], 180, 310, 80);
  });
  beat(['Repasemos.', 'Los reales son la unión de racionales e irracionales, que no comparten ningún número.', 'Juntos llenan toda la recta.'], 560, B => {
    SFX.push({ t: B.t, type: 'title', d: 0, pan: 0 });
    const r = B.big('Repasemos', 150, 130, 120); B.hl(r);
    B.at(1); B.m([RR, '=', QQ, { s: 'cup' }, II], 170, 300, 92);
    B.m([QQ, { s: 'cap' }, II, '=', { s: 'empty' }], 170, 420, 92);
    B.at(2); B.txt('llenan toda la recta', 170, 540, 66);
  }, { page: true, hold: 1.2 });
}
