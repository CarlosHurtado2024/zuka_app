// La escalera y la pared (Preuniversitario UdeA, pu-ge-2; spec 2026-11-18-preuda-geometria): una escalera de largo
// fijo apoyada en una pared. Se arrastra su pie por el piso: la punta sube o baja sola, porque el largo no cambia.
// Hay que dejar la punta justo en la ventana. La distancia del pie, la altura y el largo forman un triángulo
// rectángulo: d² + h² = L². El juego muestra d y h mientras se arrastra.
// params = { rounds: [{ L, h }] }   (h: altura de la ventana; d sale entero)   state = { rounds: [{ d }] }
GAMES['escalera-pared'] = (() => {
  const need = r => Math.sqrt(r.L * r.L - r.h * r.h);
  const game = roundsGame({
    aspect: 1.4,
    init: r => ({ d: 1 }),
    ok: (s, r) => s.d === need(r),
    solution: r => `pie a ${need(r)} m de la pared`,
    prompt: r => `La escalera mide ${r.L} m. Llévala hasta la ventana, a ${r.h} m`,
    foot: (r, s) => `pie² + altura² = ${s.d * s.d} + ${(r.L * r.L - s.d * s.d)} = ${r.L * r.L}`,
    layout(G) { G.wx = 44; G.fy = G.H - 70; },
    enter(G) { G.dragging = false; },
    draw(G) {
      const { p, C, r, s, wx, fy } = G, u = G.u = Math.min((G.W - 80) / r.L, (fy - 124) / r.L), h = Math.sqrt(r.L * r.L - s.d * s.d), ok = s.d === need(r);
      // Pared con marcas de metro, piso y ventana.
      p.stroke(C.ink); p.strokeWeight(4); p.line(wx, fy, wx, fy - r.L * u - 8); p.line(wx - 8, fy, G.W - 14, fy);
      p.strokeWeight(1.5); p.stroke(C.line); for (let i = 1; i <= r.L; i++) { p.line(wx - 5, fy - i * u, wx, fy - i * u); p.line(wx + i * u, fy, wx + i * u, fy + 5); }
      const wy = fy - r.h * u;
      p.noFill(); p.stroke(C.ok); p.strokeWeight(2.5); p.rect(wx - 22, wy - 12, 18, 24, 3); p.line(wx - 13, wy - 12, wx - 13, wy + 12);
      TK.label(p, C, `${r.h} m`, wx - 13, wy - 22, C.ok, 11, 40);
      // La escalera: dos largueros y peldaños.
      const fx = wx + s.d * u, ty = fy - h * u, col = G.locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.sun;
      p.stroke(col); p.strokeWeight(5); p.line(fx, fy, wx, ty);
      p.stroke(C.bg); p.strokeWeight(2); for (let i = 1; i < r.L; i++) { const k = i / r.L, x = fx + (wx - fx) * k, y = fy + (ty - fy) * k, a = Math.atan2(ty - fy, wx - fx) + Math.PI / 2; p.line(x - 3 * Math.cos(a), y - 3 * Math.sin(a), x + 3 * Math.cos(a), y + 3 * Math.sin(a)); }
      TK.label(p, C, `${r.L} m`, (fx + wx) / 2 + 18, (fy + ty) / 2 - 10, C.N, 13, 50);
      // Las dos medidas, en vivo.
      p.stroke(C.sky); p.strokeWeight(3); p.line(wx, fy + 14, fx, fy + 14);
      TK.label(p, C, `pie: ${s.d} m`, (wx + fx) / 2 + 10, fy + 30, C.sky, 13, 110);
      p.stroke(C.coral); p.strokeWeight(3); p.line(wx + 9, fy, wx + 9, ty);
      TK.label(p, C, `altura: ${Number.isInteger(h) ? h : h.toFixed(1)} m`, wx + 62, Math.min(fy - 16, Math.max(ty + 14, 132)), C.coral, 13, 110);
      G.fx = fx; GEO.knob(p, C, fx, fy, C.sky);
    },
    press(G, x, y) { if (Math.abs(y - G.fy) > 34) return false; G.dragging = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.dragging) return false; game.move(G, x); return true; },
    release(G) { G.dragging = false; },
    demo: G => ({ from: { x: G.fx, y: G.fy }, to: { x: G.fx + 4 * G.u, y: G.fy }, text: 'Arrastra el pie de la escalera', ty: 106 }),
    peek: G => ({ wx: G.wx, fy: G.fy, u: G.u, need: need(G.r) }),
  });
  game.move = (G, x) => { const d = Math.max(0, Math.min(G.r.L, Math.round((x - G.wx) / G.u))); if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); } };
  return Object.assign(game, { need });
})();
