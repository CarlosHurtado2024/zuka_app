// El área del trapecio (Preuniversitario, pu-ge-4; spec 2026-11-18-preuda-razonamiento-completo): un trapecio ocupa lo mismo
// que un rectángulo de su misma altura y de base el promedio de sus dos bases: A = (B + b)/2 · h. Sobre el trapecio se
// arrastra el ancho de un rectángulo de la misma altura (de medio en medio) hasta que las dos áreas coincidan.
// params = { rounds: [{ B, b, h }] }   state = { rounds: [{ w }] }   (de 1 a 14)
GAMES['trapecio-promedio'] = (() => {
  const need = r => (r.B + r.b) / 2;
  const ok = (s, r) => Math.abs(s.w - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ w: need(r) === r.B ? r.b : r.B }),
    ok,
    solution: r => `ancho ${RK.num(need(r))}: área ${RK.num(need(r) * r.h)}`,
    prompt: r => `Bases ${r.B} y ${r.b}, altura ${r.h}: iguala el área con un rectángulo`,
    foot: () => 'Arrastra el ancho del rectángulo punteado',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { w: need(r) } : G.s, u = Math.min((G.W - 60) / 14, (G.tY - 170) / r.h), cx = G.W / 2, yb = G.tY - 54, good = ok(s, r);
      p.stroke(C.ink); p.strokeWeight(1.6); p.fill(RK.al(p, C.sky, 110)); p.quad(cx - r.B * u / 2, yb, cx + r.B * u / 2, yb, cx + r.b * u / 2, yb - r.h * u, cx - r.b * u / 2, yb - r.h * u);
      p.stroke(good ? C.ok : C.coral); p.strokeWeight(2); p.noFill(); p.drawingContext.setLineDash([6, 4]); p.rect(cx - s.w * u / 2, yb - r.h * u, s.w * u, r.h * u); p.drawingContext.setLineDash([]);
      RK.knob(p, C, cx + s.w * u / 2, yb - r.h * u / 2, C.brand); G.kx = cx + s.w * u / 2; G.ky = yb - r.h * u / 2;
      TK.label(p, C, `B = ${r.B}`, cx, yb + 12, C.ink, 10, 70); TK.label(p, C, `b = ${r.b}`, cx, yb - r.h * u - 12, C.ink, 10, 70);
      const T = need(r) * r.h, R2 = s.w * r.h;
      RK.strip(p, C, G.fb, `$\\text{rectángulo}\\ ${RK.num(s.w)} \\cdot ${r.h} = ${RK.num(R2)}$`, { kicker: good ? 'Mismo área que el trapecio' : 'Compara las dos áreas', col: G.locked || good ? C.ok : C.brand, size: 17 });
      G.T = T;
    },
    press(G, x, y) { if (Math.abs(y - G.ky) > 60) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.kx, y: G.ky }, to: { x: G.kx + 30, y: G.ky }, text: 'Arrastra el ancho', ty: G.tY - 10 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, u = Math.min((G.W - 60) / 14, (G.tY - 170) / r.h), v = Math.max(1, Math.min(14, Math.round(Math.abs(x - G.W / 2) * 2 / u * 2) / 2)); if (v !== G.s.w || !G.touched[G.cur]) { G.s.w = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ w: need(r) }) });
})();
