// Parte la sigma (Álgebra, propiedades de la sumatoria; lección alg-15): la suma Σ (c·k + d) se dibuja columna por
// columna: en la columna k hay c·k piezas azules y d piezas amarillas. Las azules de todas las columnas son c veces
// Σk; las amarillas se repiten una vez por cada k, así que suman d·n (y no d: esa es la trampa). Se escribe la suma
// como «a · Σk + b» eligiendo a y b con − y +.
// params = { rounds: [{ c, d, hi }] }   (k va de 1 a hi)   state = { rounds: [{ a, b }] }
// Spec 2026-11-15-escalera-de-sigma.

GAMES['parte-sigma'] = (() => {
  const termTxt = r => (r.c === 0 ? `${r.d}` : `${r.c === 1 ? '' : r.c}k${r.d ? ` + ${r.d}` : ''}`);
  const gauss = n => (n * (n + 1)) / 2;
  const totalOf = r => r.c * gauss(r.hi) + r.d * r.hi;

  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ a: 0, b: 0 }),
    ok: (s, r) => s.a === r.c && s.b === r.d * r.hi,
    solution: r => `Σ (${termTxt(r)}) = ${r.c}·Σk + ${r.d * r.hi} = ${r.c}·${gauss(r.hi)} + ${r.d * r.hi} = ${totalOf(r)}`,
    prompt: r => `Σ (${termTxt(r)}), con k de 1 a ${r.hi}: sepárala en azules y amarillas`,
    foot: () => 'Las amarillas se repiten una vez por cada valor de k',
    layout(G) { const w = (G.W - 36) / 2; G.box = [{ x: 12, y: G.H - 64, w, h: 32 }, { x: 24 + w, y: G.H - 64, w, h: 32 }]; },
    draw(G) {
      const { p, C, W, H, s, r } = G, n = r.hi, base = H - 150, top = 100, tall = r.c * n + r.d, u = Math.min(16, (base - top) / tall), cw = Math.min(46, (W - 40) / n), x0 = W / 2 - (n * cw) / 2;
      for (let k = 1; k <= n; k++) {
        const x = x0 + (k - 1) * cw + 4, w = cw - 8;
        for (let i = 0; i < r.c * k; i++) { p.noStroke(); p.fill(C.sky); p.rect(x, base - (i + 1) * u + 1, w, u - 2, 3); }
        for (let i = 0; i < r.d; i++) { p.noStroke(); p.fill(C.sun); p.rect(x, base - (r.c * k + i + 1) * u + 1, w, u - 2, 3); }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text(`k = ${k}`, x + w / 2, base + 12);
      }
      p.stroke(C.ink); p.strokeWeight(2); p.line(x0 - 6, base, x0 + n * cw + 6, base);
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, `Σ (${termTxt(r)}) = ${s.a} · Σk + ${s.b} = ${s.a} · ${gauss(n)} + ${s.b} = ${s.a * gauss(n) + s.b}`, W / 2, base + 38, W - 20, 15);
      drawStepper(p, C, G.box[0], s.a, 'veces Σk (azules)', C.sky);
      drawStepper(p, C, G.box[1], s.b, 'amarillas en total', C.N);
    },
    press(G, x, y) {
      const a = stepHit(G.box[0], x, y), b = stepHit(G.box[1], x, y);
      if (!a && !b) return false;
      G.s.a = Math.max(0, Math.min(9, G.s.a + a)); G.s.b = Math.max(0, Math.min(60, G.s.b + b)); G.touch();
      return true;
    },
    peek: G => ({ box: G.box, want: [G.r.c, G.r.d * G.r.hi] }),
  });
  return { ...game, termTxt, totalOf };
})();
