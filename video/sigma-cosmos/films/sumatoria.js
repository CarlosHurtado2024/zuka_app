// «La baraja que nadie ha visto» · escenas de la lección alg-15. Motor en kit.js y sigma.js; guion en sumatoria.data.js.
// El índice en cian, los límites en ámbar, el término general en verde, el producto y el factorial en rosa.
const IX = C.cyan, LIM = C.amber, TG = C.green, PI_ = C.mag;
// Una sigma grande con sus partes: límites abajo y arriba, término a la derecha.
function bigOp(sym, x, y, s, lo, hi, term, o = {}) {
  T(sym, x, y, { k: 'r', s, a: 'c', c: o.c || C.ink, g: 14 });
  fade(o.kl ?? 1, () => { T(lo, x, y + s * .45, { k: 'r', s: s * .3, a: 'c', c: o.lc || LIM }); T(String(hi), x, y - s * .85, { k: 'r', s: s * .3, a: 'c', c: o.lc || LIM }); });
  fade(o.kt ?? 1, () => T(term, x + s * .5, y - s * .1, { k: 'r', s: s * .55, c: o.tc || TG }));
}
// Una carta de baraja en (x, y), girada a, con su rótulo.
function card(x, y, a, lab, col = C.ink) { X.save(); X.translate(x, y); X.rotate(a); stroke(col, 2.5, () => X.roundRect(-40, -56, 80, 112, 8), { g: 10 }); T(lab, 0, 12, { k: 'r', s: 34, a: 'c', c: col }); X.restore(); }
const S = {
  // 1 · Euler, 1755: la Σ aparece y absorbe una suma larga.
  euler(t) {
    stars(t, .5);
    fade(win(t, .8, 18.4), () => { const k = seg(t, 1, 6); T('1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + …'.slice(0, Math.ceil(52 * k)), CX, 640, { k: 'r', s: 46, a: 'c', c: C.ink, max: 960 }); T('Leonhard Euler · Berlín, 1755', CX, 520, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(win(t, 9.6, 18.4, .6), () => { T('Σ', CX, 960, { k: 'r', s: 280, a: 'c', c: IX, g: 30 }); fade(A(t, 11, .6), () => T('S griega · S de «suma»', CX, 1060, { k: 'it', s: 44, a: 'c', c: '#c3ccec' })); });
    fade(A(t, 18.6, .6), () => bigOp('Σ', 420, 700, 200, 'k = 1', 'n', 'k', { kl: A(t, 19, .5), kt: A(t, 19.6, .5) }));
  },
  // 2 · Las partes: índice, límites y término general; Σ (2k + 1) de 1 a 5 = 35.
  partes(t) {
    stars(t, .3);
    bigOp('Σ', 360, 720, 200, 'k = 1', 5, '(2k + 1)', { kl: A(t, 10.2, .5), kt: A(t, 20.2, .5) });
    fade(A(t, 1, .5), () => { ring(360 - 40, 806, 34, IX, 3, seg(t, 1.2, 2)); T('índice', 200, 860, { k: 'it', s: 36, a: 'c', c: IX }); });
    fade(A(t, 10.4, .5), () => { T('límites', 140, 560, { k: 'it', s: 36, a: 'c', c: LIM }); });
    fade(A(t, 20.4, .5), () => { const k = Math.min(5, Math.floor(seg(t, 21, 25) * 5) + 1); T([3, 5, 7, 9, 11].slice(0, k).join(' + ') + (k === 5 ? ' = 35' : ''), CX, 1000, { k: 'r', s: 52, a: 'c', c: TG }); T('k = ' + k, CX, 1070, { k: 'mono', s: 28, a: 'c', c: IX }); });
  },
  // 3 · Desplegar: 10k de 3 a 6; cuatro términos.
  desplegar(t) {
    stars(t, .3);
    bigOp('Σ', 300, 640, 160, 'k = 3', 6, '10k');
    for (let k = 3; k <= 6; k++) fade(A(t, 2 + (k - 3) * 1.2, .5), () => { chip(170 + (k - 3) * 230, 900, 180, 90, TG, String(10 * k), { s: 44, c: TG }); T('k = ' + k, 170 + (k - 3) * 230, 980, { k: 'mono', s: 22, a: 'c', c: IX }); });
    fade(A(t, 10.2, .6), () => F([['30 + 40 + 50 + 60 = ', 'r'], ['180', 'r', TG]], CX, 1100, 56));
    fade(A(t, 19.2, .6), () => F([['6 − 3 + 1 = ', 'r'], ['4', 'r', LIM], [' términos', 'it']], CX, 1200, 52));
  },
  // 4 · Lineal: la constante sale; las sumas se separan.
  lineal(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { const m = eio(seg(t, 3, 5)); T('10', lerp(440, 220, m), 646, { k: 'r', s: 72, a: 'c', c: PI_, g: 10 }); bigOp('Σ', 340, 660, 140, 'k = 1', 'n', '', { tc: TG }); T('k', lerp(485, 410, m), 646, { k: 'i', s: 77, c: TG }); fade(m, () => T('·', 270, 640, { k: 'r', s: 72, a: 'c' })); });
    fade(A(t, 10.2, .6), () => F([['Σ(', 'r'], ['a', 'i', TG], ['ₖ', 'r', TG], [' + ', 'r'], ['b', 'i', IX], ['ₖ', 'r', IX], [') = ', 'r'], ['Σ', 'r'], ['a', 'i', TG], ['ₖ', 'r', TG], [' + Σ', 'r'], ['b', 'i', IX], ['ₖ', 'r', IX]], CX, 900, 60));
    fade(A(t, 20.2, .6), () => T('distributiva  +  sumar en cualquier orden', CX, 1060, { k: 'mono', s: 26, a: 'c', c: C.mute }));
  },
  // 5 · Sumas notables: triángulo de puntos para Σk; pirámide para los cuadrados; 385.
  notables(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { for (let r = 1; r <= 8; r++) for (let j = 0; j < r; j++) fade(A(t, 1 + r * .3, .3), () => dot(300 + j * 40, 440 + r * 40, 9, TG, 14)); for (let r = 1; r <= 8; r++) for (let j = r; j < 9; j++) fade(A(t, 4 + r * .2, .3), () => dot(300 + j * 40, 440 + r * 40, 9, hexA(IX, .5), 8)); F([['Σ', 'r'], ['k', 'i'], [' = ', 'r'], ['n', 'i'], ['(', 'r'], ['n', 'i'], [' + 1)/2', 'r']], CX, 900, 64); T('dos triángulos = un rectángulo n × (n + 1)', CX, 980, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 10, .6), () => { for (let k = 1; k <= 10; k++) fade(A(t, 10.2 + k * .25, .2), () => bar(560 - k * k * 2.2, 1040 - k * 50, k * k * 4.4, 40, k % 2 ? LIM : IX, 1, { fill: .3 })); F([['Σ', 'r'], ['k', 'i'], ['² = ', 'r'], ['n', 'i'], ['(', 'r'], ['n', 'i'], [' + 1)(2', 'r'], ['n', 'i'], [' + 1)/6', 'r']], CX, 1140, 52); });
    fade(A(t, 19.2, .6), () => F([['10 · 11 · 21 / 6 = ', 'r'], ['385', 'r', TG]], CX, 1240, 60));
  },
  // 6 · Productoria: Π de (k + 1) de 1 a 4 = 120.
  producto(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { T('Π', CX, 760, { k: 'r', s: 280, a: 'c', c: PI_, g: 30 }); T('P griega · P de «producto»', CX, 860, { k: 'it', s: 40, a: 'c', c: '#c3ccec' }); });
    fade(A(t, 10.2, .6), () => { const k = Math.min(4, Math.floor(seg(t, 10.6, 15) * 4) + 1); T([2, 3, 4, 5].slice(0, k).join(' · ') + (k === 4 ? ' = 120' : ''), CX, 1000, { k: 'r', s: 56, a: 'c', c: TG }); T('k = ' + k, CX, 1070, { k: 'mono', s: 28, a: 'c', c: IX }); });
    fade(A(t, 20.2, .6), () => T('índice · límites · término general', CX, 1160, { k: 'mono', s: 26, a: 'c', c: C.mute }));
  },
  // 7 · El factorial: n! crece muy rápido; Kramp, 1808.
  factorial(t) {
    stars(t, .3);
    let f = 1; const n = Math.min(10, Math.floor(seg(t, 1, 16) * 10) + 1);
    for (let i = 1; i <= n; i++) { f *= i; const v = f; fade(A(t, 1 + (i - 1) * 1.5, .4), () => T(i + '! = ' + num(v), 300, 440 + i * 60, { k: 'r', s: 40, c: i === n ? PI_ : C.ink })); }
    fade(A(t, 10.2, .6), () => T('Christian Kramp · 1808', 780, 520, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 8 · Maneras de ordenar: las 6 maneras de ordenar tres fichas.
  ordenar(t) {
    stars(t, .3);
    const P = [['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B'], ['C', 'B', 'A']], cols = { A: LIM, B: IX, C: TG };
    P.forEach((p, i) => fade(A(t, 1 + i * .8, .4), () => p.forEach((c, j) => chip(250 + (i % 2) * 420 + j * 100, 480 + Math.floor(i / 2) * 120, 84, 84, cols[c], c, { s: 40, c: cols[c] }))));
    fade(A(t, 10.2, .6), () => { F([['3', 'r', LIM], [' · ', 'r'], ['2', 'r', IX], [' · ', 'r'], ['1', 'r', TG], [' = 6', 'r']], CX, 940, 72); T('opciones para el 1.º, el 2.º y el 3.º', CX, 1010, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 20.2, .6), () => F([['0! = 1', 'r', PI_], ['   por convención', 'it', C.mute]], CX, 1140, 64));
  },
  // 9 · Una baraja: 52! ≈ 8 · 10⁶⁷; las cartas se barajan.
  baraja(t) {
    stars(t, .3);
    const R = rng(Math.floor(t * 2) + 3), labs = ['A♠', '7♥', 'K♦', '3♣', 'Q♠', '9♥', '5♦', 'J♣', '2♠', '10♥'];
    for (let i = 0; i < 10; i++) card(160 + i * 84, 640 + (R() - .5) * 30, (R() - .5) * .3, labs[(i + Math.floor(t * 2)) % 10], i % 2 ? C.red : C.ink);
    fade(A(t, 10.2, .6), () => { T('52! ≈ 80 658 175 170 943 878 571 660 636 856 403 766 975 289 505 440 883 277 824 000 000 000 000', CX, 860, { k: 'mono', s: 22, a: 'c', c: PI_, max: 980 }); F([['52! ≈ 8 · 10', 'r'], ['⁶⁷', 'r', PI_]], CX, 980, 80); });
    fade(A(t, 19.2, .6), () => T('un orden que casi seguro nunca había existido', CX, 1100, { k: 'mono', s: 26, a: 'c', c: C.mute }));
  },
  // 10 · Cierre: Σ, Π y n!; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { T('Σ', 280, 760, { k: 'r', s: 200, a: 'c', c: IX, g: 24 }); T('Π', CX, 760, { k: 'r', s: 200, a: 'c', c: PI_, g: 24 }); T('n!', 800, 760, { k: 'i', s: 160, a: 'c', c: TG, g: 24 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['Σ', 'r'], ['ₖ₌₁', 'r'], ['ⁿ ', 'r'], ['k', 'i'], [' = ', 'r'], ['n', 'i'], ['(', 'r'], ['n', 'i'], [' + 1)/2', 'r']], 'suma notable'], [[['Σ', 'r'], ['c', 'i'], ['a', 'i'], ['ₖ = ', 'r'], ['c', 'i'], ['Σ', 'r'], ['a', 'i'], ['ₖ', 'r']], 'lineal'], [[['Π', 'r'], ['ₖ₌₁', 'r'], ['⁴ (', 'r'], ['k', 'i'], [' + 1) = 120', 'r']], 'productoria'], [[['52! ≈ 8 · 10⁶⁷', 'r', PI_]], 'ordenar una baraja']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [IX, TG, PI_]);
    });
  },
};
