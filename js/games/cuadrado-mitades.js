// El cuadrado que no se llena (Álgebra, alg-14d; spec 2026-11-18-algebra-revision): una suma geométrica infinita con
// |r| < 1 se acerca a un número. Se pinta un cuadrado de área 1 por pedazos: la primera capa es una parte y cada capa
// siguiente es r veces la anterior. Se arrastra el número de capas; hay que llegar a la suma pedida, y se ve que nunca
// se pasa del límite a/(1 − r).
// params = { rounds: [{ r: [num, den], target: [num, den] }] }   (primera capa = 1 − r)   state = { rounds: [{ n }] }
GAMES['cuadrado-mitades'] = (() => {
  const MAX = 8;
  const sum = (q, n) => 1 - (q.r[0] / q.r[1]) ** n;   // capas (1 − r)·rᵏ: la suma de n capas es 1 − rⁿ
  const need = q => { for (let n = 1; n <= MAX; n++) if (Math.abs(sum(q, n) - q.target[0] / q.target[1]) < 1e-9) return n; return -1; };
  const ok = (s, q) => s.n === need(q);
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ n: 1 }),
    ok,
    solution: q => `${need(q)} capas: 1 − (${q.r[0]}/${q.r[1]})^${need(q)} = ${q.target[0]}/${q.target[1]}`,
    prompt: q => `Cada capa es $\\tfrac{${q.r[0]}}{${q.r[1]}}$ de la anterior. Pinta hasta $\\tfrac{${q.target[0]}}{${q.target[1]}}$`,
    foot: () => 'Arrastra las capas: cada una pinta parte de lo que queda',
    layout(G) { const s = Math.min(G.W - 120, G.H * 0.46); G.sq = { x: G.W / 2 - s / 2, y: 104, s }; G.tY = G.H - 100; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r: q, sq } = G, n = G.locked && !ok(G.s, q) ? need(q) : G.s.n, rr = q.r[0] / q.r[1];
      p.stroke(C.ink); p.strokeWeight(2); p.fill(C.card); p.rect(sq.x, sq.y, sq.s, sq.s);
      // Cada capa pinta una franja de lo que falta, alternando vertical y horizontal.
      let x = sq.x, y = sq.y, w = sq.s, h = sq.s;
      for (let k = 0; k < n; k++) {
        p.noStroke(); p.fill(k % 2 ? C.sky : C.mint);
        if (k % 2 === 0) { const cw = w * (1 - rr); p.rect(x, y, cw, h); x += cw; w -= cw; } else { const ch = h * (1 - rr); p.rect(x, y, w, ch); y += ch; h -= ch; }
      }
      p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.rect(sq.x, sq.y, sq.s, sq.s);
      G.X = RK.track(p, C, 34, G.W - 34, G.tY, MAX, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$\\text{pintado} = 1 - (\\tfrac{${q.r[0]}}{${q.r[1]}})^{${n}} \\approx ${sum(q, n).toFixed(4)}$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 2), y: G.tY }, text: 'Arrastra las capas', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 34, G.W - 34, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
