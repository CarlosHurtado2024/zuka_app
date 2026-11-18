// El término que rompe el patrón (Álgebra, alg-14; spec 2026-11-18-algebra-revision): en una progresión aritmética la
// diferencia entre términos seguidos es siempre la misma. Una fila de barras con un término mal; se arrastra hacia arriba o
// abajo cualquier barra (las diferencias se ven entre ellas) hasta que todas las diferencias coincidan.
// params = { rounds: [{ terms: [..], fix: [índice, valor] }] }   state = { rounds: [{ vals: [..] }] }   (enteros de −10 a 30)
GAMES['arregla-termino'] = (() => {
  const target = r => r.terms.map((v, i) => (i === r.fix[0] ? r.fix[1] : v));
  const ok = (s, r) => s.vals.join() === target(r).join();
  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ vals: [...r.terms] }),
    ok,
    answered: (s, r) => s.vals.join() !== r.terms.join(),
    solution: r => target(r).join(', '),
    prompt: () => 'Un término no sigue la progresión: arréglalo',
    foot: () => 'Arrastra una barra arriba o abajo; mira las diferencias',
    layout(G) { G.b = { x: 20, y: 110, w: G.W - 40, h: G.H - 210 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { vals: target(r) } : G.s, n = r.terms.length, lo = -10, hi = 30, b = G.b, Y = v => b.y + b.h - (v - lo) / (hi - lo) * b.h, w = b.w / n, y0 = Y(0);
      p.stroke(C.ink); p.strokeWeight(1.2); p.line(b.x, y0, b.x + b.w, y0);
      G.cols = s.vals.map((v, i) => { const x = b.x + i * w + w * 0.2; p.noStroke(); p.fill(G.grab === i ? C.brand : C.sky); p.rect(x, Math.min(y0, Y(v)), w * 0.6, Math.abs(Y(v) - y0), 3); TK.label(p, C, String(v), x + w * 0.3, Y(v) + (v >= 0 ? -10 : 10), C.ink, 12, w); return x + w * 0.3; });
      const d = s.vals.slice(1).map((v, i) => v - s.vals[i]), same = d.every(x => x === d[0]);
      d.forEach((x, i) => TK.label(p, C, `${x > 0 ? '+' : ''}${x}`, (G.cols[i] + G.cols[i + 1]) / 2, b.y + 6, ok(s, r) ? C.ok : d.filter(y => y === x).length > 1 ? C.mute : C.coral, 11, w));
      RK.strip(p, C, G.fb, ok(s, r) ? `$d = ${d[0]}$` : same ? '$\\text{progresión, pero cambiaste de más}$' : '$\\text{las diferencias no coinciden}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; const w = G.b.w / G.r.terms.length; G.grab = Math.max(0, Math.min(G.r.terms.length - 1, Math.floor((x - G.b.x) / w))); game.move(G, y); return true; },
    drag(G, x, y) { if (G.grab < 0) return false; game.move(G, y); return true; },
    release(G) { G.grab = -1; },
    demo: G => { const i = G.r.fix[0] === 0 ? 1 : 0, b = G.b, Y = v => b.y + b.h - (v + 10) / 40 * b.h; return { from: { x: G.cols?.[i] ?? b.x + 20, y: Y(G.s.vals[i]) }, to: { x: G.cols?.[i] ?? b.x + 20, y: Y(G.s.vals[i] + 4) }, text: 'Arrastra una barra', ty: b.y + b.h + 14 }; },
    peek: G => ({ b: G.b }),
  });
  game.move = (G, y) => { const b = G.b, v = Math.max(-10, Math.min(30, Math.round(-10 + (b.y + b.h - y) / b.h * 40))), i = G.grab; if (v !== G.s.vals[i] || !G.touched[G.cur]) { G.s.vals[i] = v; G.touch(); } };
  return Object.assign(game, { target });
})();
