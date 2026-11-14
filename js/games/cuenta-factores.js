// Cuenta los factores (Álgebra, leyes de los exponentes; lección alg-21b): las leyes salen de contar. Cada potencia
// se dibuja como sus x: en un producto las dos filas se juntan (se suman), en un cociente cada x de abajo tacha una de
// arriba (se restan; si sobran abajo, el exponente es negativo) y en una potencia de potencia el grupo se repite (se
// multiplican). Se elige el exponente del resultado con − y +.
// params = { rounds: [{ kind: 'prod' | 'quot' | 'pow', m, n }], letter? }   state = { rounds: [{ e }] }
// Spec 2026-11-15-torres-de-potencias.

GAMES['cuenta-factores'] = (() => {
  const expOf = r => (r.kind === 'prod' ? r.m + r.n : r.kind === 'quot' ? r.m - r.n : r.m * r.n);
  const exprOf = (r, x = 'x') => (r.kind === 'prod' ? `${x}${sup(r.m)} · ${x}${sup(r.n)}` : r.kind === 'quot' ? `${x}${sup(r.m)} ÷ ${x}${sup(r.n)}` : `(${x}${sup(r.m)})${sup(r.n)}`);
  const lawOf = r => (r.kind === 'prod' ? `${r.m} + ${r.n}` : r.kind === 'quot' ? `${r.m} − ${r.n}` : `${r.m} · ${r.n}`);

  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ e: 0 }),
    ok: (s, r) => s.e === expOf(r),
    solution: (r, P) => `${exprOf(r, P.letter)} = ${P.letter || 'x'}${sup(expOf(r))}`,
    prompt: (r, s, G) => `${exprOf(r, G.params.letter)}: cuenta las ${G.params.letter || 'x'} y pon el exponente`,
    foot: r => (r.kind === 'prod' ? 'Las dos filas se juntan en una sola' : r.kind === 'quot' ? 'Cada una de abajo tacha una de arriba' : 'El mismo grupo se repite varias veces'),
    layout(G) { G.box = { x: G.W / 2 - 70, y: G.H - 70, w: 140, h: 34 }; },
    draw(G) {
      const { p, C, W, H, s, r } = G, x = G.params.letter || 'x', sz = 26;
      const tile = (cx, cy, col, dead) => {
        drawTile(p, C, { x: cx - sz / 2, y: cy - sz / 2, w: sz, h: sz - 3 }, x, { fill: dead ? C.card : col, ink: dead ? C.mute : undefined, size: 14, r: 7, lift: dead ? 0 : 2 });
        if (dead) { p.stroke(C.bad); p.strokeWeight(2); p.line(cx - 9, cy + 8, cx + 9, cy - 10); }
      };
      const row = (n, cy, col, deadN = 0) => { const step = Math.min(32, (W - 30) / n); for (let i = 0; i < n; i++) tile(W / 2 - ((n - 1) * step) / 2 + i * step, cy, col, i < deadN); };
      if (r.kind === 'prod') {   // dos colores en una sola fila
        const n = r.m + r.n, step = Math.min(32, (W - 30) / n);
        for (let i = 0; i < n; i++) tile(W / 2 - ((n - 1) * step) / 2 + i * step, 160, i < r.m ? C.sky : C.mint);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(`${r.m} azules y ${r.n} verdes`, W / 2, 196);
      } else if (r.kind === 'quot') {   // arriba y abajo de la raya; las parejas se tachan
        const cut = Math.min(r.m, r.n);
        row(r.m, 138, C.sky, cut); p.stroke(C.ink); p.strokeWeight(3); p.line(24, 166, W - 24, 166); row(r.n, 194, C.mint, cut);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
        p.text(r.m >= r.n ? `quedan ${r.m - r.n} arriba` : `quedan ${r.n - r.m} abajo: exponente negativo`, W / 2, 226);
      } else {   // n grupos iguales de m
        const gw = r.m * 28 + 10, perRow = Math.max(1, Math.floor((W - 20) / (gw + 8))), rows = Math.ceil(r.n / perRow);
        for (let g = 0; g < r.n; g++) {
          const rr = Math.floor(g / perRow), inRow = Math.min(perRow, r.n - rr * perRow), gx = W / 2 - (inRow * (gw + 8) - 8) / 2 + (g % perRow) * (gw + 8), gy = 128 + rr * 44;
          p.noFill(); p.stroke(C.sun); p.strokeWeight(2); p.rect(gx, gy, gw, 36, 9);
          for (let i = 0; i < r.m; i++) tile(gx + 5 + 14 + i * 28, gy + 19, C.sky);
        }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(`${r.n} grupos de ${r.m}`, W / 2, 128 + rows * 44 + 10);
      }
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(15); p.textAlign(p.CENTER, p.CENTER);
      p.text(`${exprOf(r, x)} = ${x} elevado a`, W / 2, H - 98);
      drawStepper(p, C, G.box, negTxt(s.e), '', G.locked ? (s.e === expOf(r) ? C.ok : C.bad) : C.ink);
    },
    press(G, x, y) { const d = stepHit(G.box, x, y); if (!d) return false; G.s.e = Math.max(-9, Math.min(15, G.s.e + d)); G.touch(); return true; },
    peek: G => ({ box: G.box, want: expOf(G.r) }),
  });
  return { ...game, expOf, exprOf, lawOf };
})();
