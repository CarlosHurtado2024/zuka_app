// La raíz cuadrada de un complejo (Álgebra, alg-23c; spec 2026-11-18-algebra-revision): al elevar al cuadrado, (a + bi)² =
// a² − b² + 2ab·i: el ángulo se duplica y el módulo se eleva al cuadrado. Se arrastra z por el plano y se ve z² en vivo;
// hay que lograr que z² caiga en la estrella. (Siempre hay dos respuestas, opuestas.)
// params = { rounds: [{ t: [re, im] }] }   state = { rounds: [{ a, b }] }   (enteros de −4 a 4)
GAMES['cuadrado-complejo'] = (() => {
  const sq = (a, b) => [a * a - b * b, 2 * a * b];
  const ok = (s, r) => { const [x, y] = sq(s.a, s.b); return x === r.t[0] && y === r.t[1]; };
  const answer = r => { for (let a = 0; a <= 4; a++) for (let b = -4; b <= 4; b++) if (ok({ a, b }, r)) return { a, b }; return null; };
  const zt = (a, b) => (b === 0 ? `${a}` : a === 0 ? `${b === 1 ? '' : b === -1 ? '-' : b}i` : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}i`);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ a: 1, b: 0 }),
    ok,
    solution: r => { const s = answer(r); return `z = ±(${zt(s.a, s.b)})`; },
    prompt: r => `Busca z con $z^2 = ${zt(...r.t)}$`,
    foot: () => 'Arrastra z; el punto claro es z²',
    layout(G) { const s = Math.min(G.W - 32, G.H * 0.6); G.b = { x: (G.W - s) / 2, y: 96, w: s, h: s }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, L = Math.max(13, Math.abs(r.t[0]) + 1, Math.abs(r.t[1]) + 1), V = { x0: -L, x1: L, y0: -L, y1: L }, M = G.M = RK.plane(p, C, G.b, V, { step: L > 8 ? 5 : 1, lx: 'Re', ly: 'Im' });
      p.noStroke(); p.fill(C.coral); const tx = M.X(r.t[0]), ty = M.Y(r.t[1]); p.triangle(tx, ty - 9, tx - 8, ty + 6, tx + 8, ty + 6);
      const [x2, y2] = sq(s.a, s.b);
      p.stroke(C.sky); p.strokeWeight(1.6); p.line(M.X(0), M.Y(0), M.X(s.a), M.Y(s.b));
      if (Math.abs(x2) <= L && Math.abs(y2) <= L) { p.stroke(RK.al(p, ok(s, r) ? C.ok : C.mint, 200)); p.line(M.X(0), M.Y(0), M.X(x2), M.Y(y2)); drawDot(p, C, M.X(x2), M.Y(y2), 12, ok(s, r) ? C.ok : C.mint); }
      RK.knob(p, C, M.X(s.a), M.Y(s.b), C.brand);
      RK.strip(p, C, G.fb, `$(${zt(s.a, s.b)})^2 = ${zt(x2, y2)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.hypot(x - G.M.X(G.s.a), y - G.M.Y(G.s.b)) > 40) return false; G.grab = true; return true; },
    drag(G, x, y) { if (!G.grab) return false; const c = v => Math.max(-4, Math.min(4, Math.round(v))), a = c(G.M.iX(x)), b = c(G.M.iY(y)); if (a !== G.s.a || b !== G.s.b || !G.touched[G.cur]) { G.s.a = a; G.s.b = b; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.a), y: G.M.Y(G.s.b) }, to: { x: G.M.X(-3), y: G.M.Y(-3) }, text: 'Arrastra z', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  return Object.assign(game, { answer });
})();
