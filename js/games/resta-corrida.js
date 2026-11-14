// La resta corrida (Álgebra, suma de una progresión geométrica; lección alg-14d): el truco para sumar
// S = a + ar + ar² + … es multiplicar toda la suma por la razón: sale la misma lista corrida un lugar. Arriba está
// r·S y abajo S, cada término en la columna de su valor. Se tocan las columnas con dos números iguales para tacharlos:
// al restar sobreviven solo el último de arriba y el primero de abajo, y el juego termina la cuenta.
// params = { rounds: [{ a1, r, n }] }   state = { rounds: [{ cut: [bool por pareja] }] }
// Spec 2026-11-15-escalera-de-sigma.

GAMES['resta-corrida'] = (() => {
  const term = (r, k) => r.a1 * r.r ** k;
  const sumOf = r => (term(r, r.n) - r.a1) / (r.r - 1);

  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ cut: Array(r.n - 1).fill(false) }),
    ok: s => s.cut.every(Boolean),
    solution: r => `${r.r}S − S = ${term(r, r.n)} − ${r.a1}, así que S = ${term(r, r.n) - r.a1} ÷ ${r.r - 1} = ${sumOf(r)}`,
    prompt: r => `S = ${[0, 1, 2].map(k => term(r, k)).join(' + ')} + … (${r.n} términos). Tacha las parejas iguales de ${r.r}S y S`,
    foot: (r, s) => (s.cut.every(Boolean) ? 'Solo quedan el último de arriba y el primero de abajo' : 'Al multiplicar por la razón, la lista se corre un lugar'),
    draw(G) {
      const { p, C, W, s, r } = G, cols = r.n + 1, cw = (W - 56) / cols, x0 = 50, yT = 122, yB = 172, done = s.cut.every(Boolean);
      G.cols = [];
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.RIGHT, p.CENTER);
      p.text(`${r.r}S =`, x0 - 6, yT + 16); p.text('S =', x0 - 6, yB + 16);
      for (let c = 0; c < cols; c++) {
        const x = x0 + c * cw, pair = c >= 1 && c <= r.n - 1, dead = pair && s.cut[c - 1], v = term(r, c);
        G.cols.push({ x, y: yT - 4, w: cw, h: yB + 40 - yT, pair });
        const tile = (y, col) => {
          drawTile(p, C, { x: x + 2, y, w: cw - 4, h: 30 }, v, { fill: dead ? C.card : col, ink: dead ? C.mute : undefined, size: 14, r: 7, lift: dead ? 0 : 2 });
          if (dead) { p.stroke(C.bad); p.strokeWeight(2); p.line(x + 6, y + 26, x + cw - 6, y + 4); }
        };
        if (c >= 1) tile(yT, c === r.n ? C.sun : C.sky);         // r·S ocupa las columnas 1 … n
        if (c <= r.n - 1) tile(yB, c === 0 ? C.sun : C.mint);    // S ocupa las columnas 0 … n − 1
      }
      p.stroke(C.ink); p.strokeWeight(2); p.line(x0 - 34, yB + 44, W - 8, yB + 44);
      p.noStroke(); p.fill(done ? C.ink : C.mute); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      const left = s.cut.filter(c => !c).length;
      fitText(p, done ? `${r.r}S − S = ${term(r, r.n)} − ${r.a1} = ${term(r, r.n) - r.a1}` : `Faltan ${left} ${left === 1 ? 'pareja' : 'parejas'} por tachar`, W / 2, yB + 66, W - 20, 16);
      if (done) {
        if (r.r - 1 > 1) { p.fill(C.ink); fitText(p, `${r.r - 1}S = ${term(r, r.n) - r.a1}`, W / 2, yB + 92, W - 20, 16); }
        p.fill(C.N); fitText(p, `S = ${sumOf(r)}`, W / 2, yB + 120, W - 20, 20);
      }
    },
    press(G, x, y) {
      const c = (G.cols || []).findIndex(b => hitBox(b, x, y));
      if (c < 0) return false;
      if (G.cols[c].pair) { G.s.cut[c - 1] = !G.s.cut[c - 1]; G.touch(); }
      return true;
    },
    peek: G => ({ cols: G.cols }),
  });
  return { ...game, term, sumOf };
})();
