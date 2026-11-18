// La razón de la serie (Álgebra, alg-14d; spec 2026-11-18-algebra-revision): con |r| < 1 la suma infinita es a/(1 − r).
// El primer término está fijo; se arrastra la razón y las sumas parciales se dibujan como puntos que se acercan a una
// línea. Hay que elegir la razón que hace que se acerquen a la meta. Con |r| ≥ 1 los puntos se escapan.
// params = { rounds: [{ a, S }] }   state = { rounds: [{ k }] }   (índice en R)
GAMES['ajusta-razon'] = (() => {
  const R = [-0.5, -0.25, 0.25, 0.5, 0.6, 0.75, 0.8, 0.9, 1, 1.5];
  const need = q => R.findIndex(r => Math.abs(r) < 1 && Math.abs(q.a / (1 - r) - q.S) < 1e-9);
  const ok = (s, q) => s.k === need(q);
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ k: 8 }),
    ok,
    solution: q => `r = ${R[need(q)]}: ${q.a} / (1 − ${R[need(q)]}) = ${q.S}`,
    prompt: q => `El primer término es ${q.a}. ¿Qué razón hace que la suma infinita sea ${q.S}?`,
    foot: () => 'Arrastra la razón y mira hacia dónde van las sumas',
    layout(G) { G.base = G.H - 150; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r: q } = G, k = G.locked && !ok(G.s, q) ? need(q) : G.s.k, r = R[k], top = q.S * 1.6, Y = v => G.base - (G.base - 108) * Math.max(-0.2 * top, Math.min(v, top)) / top, N = 12, w = (G.W - 40) / N;
      p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.line(16, Y(q.S), G.W - 16, Y(q.S)); p.drawingContext.setLineDash([]); TK.label(p, C, `meta ${q.S}`, G.W - 40, Y(q.S) - 10, C.ok, 10, 60);
      if (Math.abs(r) < 1) { p.stroke(C.coral); p.strokeWeight(1.4); p.line(16, Y(q.a / (1 - r)), G.W - 16, Y(q.a / (1 - r))); }
      let s = 0; for (let n = 0; n < N; n++) { s += q.a * r ** n; drawDot(p, C, 20 + (n + 0.5) * w, Y(s), 9, Math.abs(r) < 1 ? C.sky : C.coral); }
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, R.length, k, i => String(R[i]));
      RK.strip(p, C, G.fb, Math.abs(r) < 1 ? `$S = \\tfrac{${q.a}}{1 - (${r})} = ${+(q.a / (1 - r)).toFixed(3)}$` : `$|r| \\ge 1:\\ \\text{no se acerca a nada}$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k), y: G.tY }, to: { x: G.X(G.s.k + 3), y: G.tY }, text: 'Arrastra la razón', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 24, G.W - 24, R.length); if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { need, R });
})();
