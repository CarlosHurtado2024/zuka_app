// La tabla del conjugado (Álgebra, racionalizar; lección alg-22b): para quitar la raíz de un denominador hay que
// multiplicarlo por algo que la haga desaparecer. Se elige por cuál multiplicar y el juego hace la tabla de la
// multiplicación, término por término: se ve qué casillas quedan con raíz y cuáles se cancelan (en el conjugado, las
// dos del medio son opuestas). Se puede probar con todas antes de comprobar.
// Un término es { c, r } = c·√r (r = 1: número sin raíz).
// params = { rounds: [{ den: [término], options: [[término]] }] }   state = { rounds: [{ pick }] }
// Spec 2026-11-15-torres-de-potencias.

GAMES['tabla-conjugado'] = (() => {
  // Producto de dos términos, sacando de la raíz los cuadrados perfectos.
  function mulTerm(a, b) {
    let c = a.c * b.c, r = a.r * b.r;
    for (let f = Math.floor(Math.sqrt(r)); f > 1; f--) if (r % (f * f) === 0) { c *= f; r /= f * f; }
    return { c, r };
  }
  // Suma de términos: junta los de la misma raíz y quita los que dan cero.
  function sumTerms(ts) {
    const by = new Map(); ts.forEach(t => by.set(t.r, (by.get(t.r) || 0) + t.c));
    return [...by.entries()].filter(([, c]) => c !== 0).sort((a, b) => a[0] - b[0]).map(([r, c]) => ({ c, r }));
  }
  const product = (A, B) => sumTerms(A.flatMap(a => B.map(b => mulTerm(a, b))));
  const rational = ts => ts.every(t => t.r === 1);
  const termTxt = t => (t.r === 1 ? negTxt(t.c) : `${t.c === 1 ? '' : t.c === -1 ? '−' : negTxt(t.c)}√${t.r}`);
  const polyTxt = ts => (ts.length ? ts.map((t, i) => (i === 0 ? termTxt(t) : `${t.c < 0 ? '−' : '+'} ${termTxt({ c: Math.abs(t.c), r: t.r })}`)).join(' ') : '0');
  const goodOf = r => r.options.findIndex(o => rational(product(r.den, o)));

  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ pick: -1 }),
    ok: (s, r) => s.pick >= 0 && rational(product(r.den, r.options[s.pick])),
    answered: s => s.pick >= 0,
    solution: r => { const o = r.options[goodOf(r)]; return `(${polyTxt(r.den)})(${polyTxt(o)}) = ${polyTxt(product(r.den, o))}`; },
    prompt: r => `¿Por cuál multiplicas ${polyTxt(r.den)} para quitar la raíz? Prueba y mira la tabla`,
    foot: (r, s) => (s.pick < 0 ? 'Puedes probar todas antes de comprobar' : 'Verde: sin raíz · coral: con raíz'),
    layout(G) { const w = (G.W - 36) / 2; G.opt = [0, 1, 2, 3].map(i => ({ x: 12 + (i % 2) * (w + 12), y: 94 + Math.floor(i / 2) * 44, w, h: 36 })); },
    draw(G) {
      const { p, C, W, s, r } = G;
      r.options.forEach((o, i) => drawTile(p, C, G.opt[i], polyTxt(o), { fill: s.pick === i ? C.sun : C.cream, size: 15, r: 9, lift: 2 }));
      if (s.pick < 0) { p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text('Toca una opción para multiplicar', W / 2, 250); return; }
      const B = r.options[s.pick], A = r.den, cw = Math.min(84, (W - 24) / (B.length + 1)), ch = 38, x0 = W / 2 - ((B.length + 1) * cw) / 2, y0 = 196;
      const cell = (i, j, txt, fill, ink) => drawTile(p, C, { x: x0 + j * cw + 2, y: y0 + i * ch + 2, w: cw - 4, h: ch - 6 }, txt, { fill, ink, size: 14, r: 7, lift: fill === C.card ? 0 : 2 });
      cell(0, 0, '×', C.card, C.mute);
      B.forEach((b, j) => cell(0, j + 1, termTxt(b), C.sky));
      A.forEach((a, i) => {
        cell(i + 1, 0, termTxt(a), C.sky);
        B.forEach((b, j) => { const t = mulTerm(a, b); cell(i + 1, j + 1, termTxt(t), t.r === 1 ? C.mint : C.coral); });
      });
      const res = product(A, B), good = rational(res), y = y0 + (A.length + 1) * ch + 22;
      p.noStroke(); p.fill(good ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, `(${polyTxt(A)})(${polyTxt(B)}) = ${polyTxt(res)}`, W / 2, y, W - 24, 16);
      p.fill(good ? C.ok : C.bad); p.textSize(12); p.text(good ? 'La raíz desapareció' : 'Todavía queda una raíz', W / 2, y + 22);
    },
    press(G, x, y) {
      const i = G.opt.findIndex((b, k) => k < G.r.options.length && hitBox(b, x, y));
      if (i < 0) return false;
      G.s.pick = i; G.touch();
      return true;
    },
    peek: G => ({ opt: G.opt, good: goodOf(G.r) }),
  });
  return { ...game, mulTerm, sumTerms, product, rational, termTxt, polyTxt, goodOf };
})();
