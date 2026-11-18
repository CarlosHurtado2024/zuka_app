// Llena el rectángulo (Álgebra, alg-23a; spec 2026-11-18-algebra-revision): multiplicar es llenar un rectángulo. El marco
// mide (x + a) por (x + b): una esquina grande x por x, franjas de x por 1 y una esquina de a por b. Se arrastran bloques
// de la bandeja al marco hasta llenarlo, y el producto queda escrito: x² + (a + b)x + ab.
// params = { rounds: [{ a, b }] }   state = { rounds: [{ n: [x², x, 1] }] }
GAMES['llena-rectangulo'] = (() => {
  const need = r => [1, r.a + r.b, r.a * r.b];
  const ok = (s, r) => s.n.join() === need(r).join();
  const poly = c => GAMES['bloques-polinomio'].poly(c);
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ n: [0, 0, 0] }),
    ok,
    answered: s => s.n.some(Boolean),
    solution: r => poly(need(r)),
    prompt: r => `Llena el rectángulo de $(x + ${r.a})(x + ${r.b})$`,
    foot: () => 'Arrastra bloques al marco; cada uno va donde cabe',
    layout(G) { G.u = 70; G.s = 16; G.ox = 40; G.oy = 108; G.trayY = G.H - 140; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, u, s, ox, oy } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, W = u + r.b * s, H = u + r.a * s;
      // Marco y sus zonas.
      p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.rect(ox, oy, W, H);
      p.stroke(C.line); p.strokeWeight(1); p.line(ox + u, oy, ox + u, oy + H); p.line(ox, oy + u, ox + W, oy + u);
      TK.label(p, C, 'x', ox + u / 2, oy - 10, C.mute, 11, 20); TK.label(p, C, String(r.b), ox + u + r.b * s / 2, oy - 10, C.mute, 11, 20);
      TK.label(p, C, 'x', ox - 10, oy + u / 2, C.mute, 11, 20); TK.label(p, C, String(r.a), ox - 10, oy + u + r.a * s / 2, C.mute, 11, 20);
      if (n[0]) RK.tile(p, C, 2, ox, oy, u, s, false, { label: true });
      // Barras: primero las verticales de la derecha (b), luego las horizontales de abajo (a), dibujadas acostadas.
      for (let i = 0; i < n[1]; i++) { if (i < r.b) RK.tile(p, C, 1, ox + u + i * s, oy, u, s, false, { label: false }); else { const j = i - r.b; p.stroke(C.line); p.fill(RK.al(p, C.sky, 170)); p.rect(ox, oy + u + j * s, u, s, 3); } }
      for (let i = 0; i < n[2]; i++) RK.tile(p, C, 0, ox + u + (i % r.b) * s, oy + u + Math.floor(i / r.b) * s, u, s, false, { label: false });
      G.zone = { x: ox, y: oy, w: W, h: H };
      G.src = [2, 1, 0].map((k, i) => { const [w, h] = RK.tileSize(k, 40, 14), x = 30 + i * (G.W - 60) / 3; RK.tile(p, C, k, x, G.trayY, 40, 14, false); return { k, x, y: G.trayY, w, h }; });
      if (G.drag) RK.tile(p, C, G.drag.k, G.drag.x - 10, G.drag.y - 10, 40, 14, false, { lift: true });
      RK.strip(p, C, G.fb, `$(x + ${r.a})(x + ${r.b}) = ${poly(n)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const q = (G.src || []).find(q => hitBox({ x: q.x - 4, y: q.y - 4, w: q.w + 8, h: q.h + 8 }, x, y)); if (q) { G.drag = { k: q.k, x, y, from: 'tray' }; return true; } if (hitBox(G.zone, x, y)) { G.drag = { k: -1, x, y, from: 'zone' }; return true; } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d || d.from !== 'tray') return;
      if (!hitBox({ x: G.zone.x - 10, y: G.zone.y - 10, w: G.zone.w + 20, h: G.zone.h + 20 }, x, y)) return;
      const i = 2 - d.k, cap = need(G.r)[i];
      if (G.s.n[i] < cap) { G.s.n[i]++; G.touch(); }
    },
    demo(G) { const q = G.src?.[0]; return q ? { from: { x: q.x + 20, y: q.y + 20 }, to: { x: G.ox + 30, y: G.oy + 30 }, text: 'Arrastra al marco', ty: G.trayY - 16 } : null; },
    peek: G => ({ src: G.src, zone: G.zone }),
  });
  return Object.assign(game, { need });
})();
