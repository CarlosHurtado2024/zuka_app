// Gira hasta que sean paralelas (Preuniversitario UdeA, pu-ge-1; spec 2026-11-18-preuda-geometria): una transversal
// corta dos rectas. La de arriba está quieta; la de abajo se gira arrastrando su punta. En cada cruce se ve un ángulo:
// cuando las rectas son paralelas, los correspondientes (o los alternos internos) son IGUALES y los conjugados SUMAN
// 180°. Si no lo son, las rectas se encuentran en algún lado: el juego marca hacia dónde.
// params = { rounds: [{ t, top, pair: 'corr' | 'alt' | 'conj' }] }   (t: dirección de la transversal; top: inclinación
// de la recta de arriba)   state = { rounds: [{ b }] }   (b: inclinación de la de abajo, de 5° en 5°)
GAMES['paralelas-gira'] = (() => {
  const NAME = { corr: 'correspondientes', alt: 'alternos internos', conj: 'conjugados' };
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ b: r.top + (r.top > 0 ? -20 : 20) }),
    ok: (s, r) => s.b === r.top,
    solution: r => `inclinación ${TK.minusTxt(r.top)}°: los ${NAME[r.pair]} ${r.pair === 'conj' ? 'suman 180°' : 'quedan iguales'}`,
    prompt: r => `Gira la recta de abajo hasta que sea paralela a la de arriba`,
    foot: (r, s) => (s.b === r.top ? 'No se encuentran nunca: son paralelas' : `Los ${NAME[r.pair]} ${r.pair === 'conj' ? 'deben sumar 180°' : 'deben ser iguales'}`),
    layout(G) { G.y1 = 150; G.y2 = G.H - 110; G.L = G.W * 0.44; },
    enter(G) { G.dragging = false; },
    draw(G) {
      const { p, C, r, s, y1, y2, L } = G, cx = G.W / 2, ok = s.b === r.top;
      // La transversal pasa por el centro; corta cada recta en un punto.
      const dx = (y2 - y1) / 2 / Math.tan(GEO.rad(r.t)), P1 = [cx + dx, y1], P2 = [cx - dx, y2];
      G.P2 = P2;
      GEO.line(p, cx, (y1 + y2) / 2, (y2 - y1) / 2 / Math.sin(GEO.rad(r.t)) + 34, r.t, C.mute, 3);
      GEO.line(p, P1[0], P1[1], L, r.top, C.ink);
      GEO.line(p, P2[0], P2[1], L, s.b, G.locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.ink);
      // Los ángulos del par: arriba fijo, abajo en vivo.
      const top = r.t - r.top, bot = r.t - s.b;
      if (r.pair === 'corr') { GEO.wedge(p, C, P1[0], P1[1], 30, r.top, r.t, C.sky, `${top}°`); GEO.wedge(p, C, P2[0], P2[1], 30, s.b, r.t, C.coral, `${bot}°`); }
      else if (r.pair === 'alt') { GEO.wedge(p, C, P1[0], P1[1], 30, r.top + 180, r.t + 180, C.sky, `${top}°`); GEO.wedge(p, C, P2[0], P2[1], 30, s.b, r.t, C.coral, `${bot}°`); }
      else { GEO.wedge(p, C, P1[0], P1[1], 30, r.t + 180, r.top + 360, C.sky, `${180 - top}°`); GEO.wedge(p, C, P2[0], P2[1], 30, s.b, r.t, C.coral, `${bot}°`); TK.label(p, C, `${180 - top}° + ${bot}° = ${180 - top + bot}°`, cx, G.H - 58, ok ? C.ok : C.mute, 14, 220); }
      if (r.pair !== 'conj') TK.label(p, C, ok ? `${top}° = ${bot}°` : `${top}° y ${bot}°`, cx, G.H - 58, ok ? C.ok : C.mute, 14, 220);
      // Si no son paralelas, una flecha marca hacia dónde se encuentran.
      if (!ok) { const right = s.b > r.top, ax = right ? G.W - 20 : 20; p.noStroke(); p.fill(C.bad); p.triangle(ax, (y1 + y2) / 2 - 8, ax, (y1 + y2) / 2 + 8, ax + (right ? 12 : -12), (y1 + y2) / 2); TK.label(p, C, 'se cruzan', right ? G.W - 44 : 44, (y1 + y2) / 2 + 22, C.bad, 11, 70); }
      const [kx, ky] = GEO.at(P2[0], P2[1], L - 6, s.b); G.kx = kx; G.ky = ky;
      GEO.knob(p, C, kx, ky, C.coral);
    },
    press(G, x, y) { if (Math.abs(y - G.y2) > 70 || x < G.P2[0] + 20) return false; G.dragging = true; game.turn(G, x, y); return true; },
    drag(G, x, y) { if (!G.dragging) return false; game.turn(G, x, y); return true; },
    release(G) { G.dragging = false; },
    demo: G => ({ from: { x: G.kx, y: G.ky }, to: { x: G.kx, y: G.ky + (G.s.b > G.r.top ? 34 : -34) }, text: 'Arrastra la punta de la recta de abajo', ty: G.H - 84 }),
    peek: G => ({ P2: G.P2, L: G.L, want: G.r.top }),
  });
  game.turn = (G, x, y) => { let b = GEO.snap(GEO.angOf(G.P2[0], G.P2[1], x, y), 5); if (b > 180) b -= 360; b = Math.max(-35, Math.min(35, b)); if (b !== G.s.b || !G.touched[G.cur]) { G.s.b = b; G.touch(); } };
  return game;
})();
