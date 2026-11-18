// La alcancía (Álgebra, alg-14b; spec 2026-11-18-algebra-revision): ahorrar cada semana un poco más que la anterior es
// sumar una progresión aritmética. Se arrastran las semanas; cada semana aparece su aporte y el total de la alcancía.
// Hay que encontrar la semana en que el total llega justo a la meta.
// params = { rounds: [{ a1, d, goal }] }   state = { rounds: [{ n }] }
GAMES['alcancia-semanas'] = (() => {
  const MAX = 12;
  const sum = (r, n) => (n * (2 * r.a1 + (n - 1) * r.d)) / 2;
  const need = r => { for (let n = 1; n <= MAX; n++) if (sum(r, n) === r.goal) return n; return -1; };
  const ok = (s, r) => sum(r, s.n) === r.goal;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `semana ${need(r)}: ${need(r)} · (${r.a1} + ${r.a1 + (need(r) - 1) * r.d}) / 2 = ${r.goal}`,
    prompt: r => `Ahorra ${r.a1} mil la 1.ª semana y ${r.d} mil más cada semana. ¿Cuándo junta ${r.goal} mil?`,
    foot: () => 'Arrastra las semanas',
    layout(G) { G.base = G.H - 150; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, w = (G.W - 110) / MAX, top = r.a1 + (MAX - 1) * r.d, Y = v => G.base - (G.base - 110) * v / top;
      for (let k = 1; k <= n; k++) { const v = r.a1 + (k - 1) * r.d; p.noStroke(); p.fill(C.mint); p.rect(20 + (k - 1) * w + 2, Y(v), w - 4, G.base - Y(v), 3); }
      // La alcancía con el total.
      const tot = sum(r, n), hb = 90, f = Math.min(1, tot / (r.goal * 1.3));
      p.stroke(C.ink); p.strokeWeight(2); p.fill(C.card); p.rect(G.W - 74, G.base - hb, 54, hb, 10);
      p.noStroke(); p.fill(tot === r.goal ? C.ok : C.sun); p.rect(G.W - 72, G.base - hb * f, 50, hb * f - 2, 8);
      p.stroke(C.ok); p.strokeWeight(2); p.line(G.W - 80, G.base - hb / 1.3, G.W - 14, G.base - hb / 1.3);
      TK.label(p, C, `${tot}`, G.W - 47, G.base - hb - 14, C.ink, 13, 60);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, MAX, n - 1, i => ((i + 1) % 2 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$S_{${n}} = \\tfrac{${n}\\,(${r.a1} + ${r.a1 + (n - 1) * r.d})}{2} = ${tot}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 3), y: G.tY }, text: 'Arrastra las semanas', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need, sum });
})();
