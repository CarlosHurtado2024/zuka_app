// El árbol de la potencia (Álgebra, potencias; lección alg-21a): un árbol en el que de cada nudo salen b ramas, nivel
// tras nivel. Con e niveles tiene b · b · … · b = bᵉ hojas. Se eligen las ramas por nudo (la base) y los niveles (el
// exponente) hasta tener exactamente las hojas pedidas. Hay metas con varias respuestas (64 = 2⁶ = 4³ = 8²).
// params = { rounds: [{ target }], maxBase?, maxExp? }   state = { rounds: [{ b, e }] }
// Spec 2026-11-15-torres-de-potencias.

GAMES['arbol-potencia'] = (() => {
  // Primera pareja (base, exponente) que da n hojas, con la base más pequeña.
  function powersOf(n, maxB = 9, maxE = 7) {
    const out = [];
    for (let b = 2; b <= maxB; b++) for (let e = 1; e <= maxE; e++) if (b ** e === n) out.push([b, e]);
    return out;
  }
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ b: 2, e: 1 }),
    ok: (s, r) => s.b ** s.e === r.target,
    solution: (r, P) => powersOf(r.target, P.maxBase, P.maxExp).map(([b, e]) => `${b}${sup(e)}`).join(' = ') + ` = ${r.target}`,
    prompt: r => `Haz un árbol con exactamente ${r.target} hojas`,
    foot: (r, s) => (s.b ** s.e === r.target ? `${Array(s.e).fill(s.b).join(' · ')} = ${r.target}` : 'Cada nivel multiplica las puntas por las ramas de cada nudo'),
    layout(G) { const w = (G.W - 36) / 2; G.box = [{ x: 12, y: G.H - 64, w, h: 32 }, { x: 24 + w, y: G.H - 64, w, h: 32 }]; },
    draw(G) {
      const { p, C, W, H, s, r } = G, n = s.b ** s.e, good = n === r.target, top = 128, bot = H - 96, lv = (bot - top) / s.e;
      p.noStroke(); p.fill(good ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(17);
      p.text(`${s.b}${sup(s.e)} = ${n} hojas`, W / 2, 94);
      // Las ramas: el nivel k tiene bᵏ puntas repartidas a lo ancho; se dibuja hasta donde se alcanzan a ver.
      const X = (k, i) => 12 + ((i + 0.5) / s.b ** k) * (W - 24), Y = k => bot - k * lv;
      p.stroke(C.Q); p.strokeWeight(5); p.line(W / 2, bot + 14, W / 2, bot);
      let last = 0;
      for (let k = 1; k <= s.e && s.b ** k <= 160; k++) {
        p.stroke(C.Q); p.strokeWeight(Math.max(1, 4 - k));
        for (let i = 0; i < s.b ** k; i++) p.line(X(k - 1, Math.floor(i / s.b)), Y(k - 1), X(k, i), Y(k));
        last = k;
      }
      const cnt = s.b ** last, d = Math.max(3, Math.min(12, (W - 24) / cnt - 1));
      p.noStroke(); p.fill(good ? C.ok : C.mint);
      for (let i = 0; i < cnt; i++) p.circle(X(last, i), Y(last), d);
      if (last < s.e) { p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.text(`… y ${s.e - last} ${s.e - last === 1 ? 'nivel' : 'niveles'} más: ya no caben en el dibujo`, W / 2, top - 12); }
      drawStepper(p, C, G.box[0], s.b, 'ramas por nudo (base)');
      drawStepper(p, C, G.box[1], s.e, 'niveles (exponente)');
    },
    press(G, x, y) {
      const P = G.params, db = stepHit(G.box[0], x, y), de = stepHit(G.box[1], x, y);
      if (!db && !de) return false;
      G.s.b = Math.max(2, Math.min(P.maxBase ?? 9, G.s.b + db)); G.s.e = Math.max(1, Math.min(P.maxExp ?? 7, G.s.e + de)); G.touch();
      return true;
    },
    peek: G => ({ box: G.box }),
  });
  return { ...game, powersOf };
})();
