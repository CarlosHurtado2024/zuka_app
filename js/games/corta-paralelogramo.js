// El área del paralelogramo (Preuniversitario, pu-ge-4; spec 2026-11-18-preuda-razonamiento-completo): un paralelogramo se
// corta y se vuelve un rectángulo de la misma base y la misma altura: área = base × altura (no base × lado inclinado). Está
// la altura y el lado inclinado; se arrastra la base hasta el área pedida. El triángulo recortado se ve pasar al otro lado.
// params = { rounds: [{ h, slant, target }] }   (slant: lado inclinado, solo de distractor)   state = { rounds: [{ b }] }   (base de 1 a 12)
GAMES['corta-paralelogramo'] = (() => {
  const ok = (s, r) => s.b * r.h === r.target;
  const answer = r => ({ b: r.target / r.h });
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ b: 1 }),
    ok,
    solution: r => `base ${r.target / r.h}`,
    prompt: r => `Altura ${r.h}, lado inclinado ${r.slant}. ¿Qué base da un área de ${r.target}?`,
    foot: () => 'Arrastra la base del paralelogramo',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, off = Math.sqrt(Math.max(0, r.slant ** 2 - r.h ** 2)), u = Math.min((G.W - 60) / (12 + off), (G.tY - 160) / r.h), x0 = 30, yb = G.tY - 50, good = ok(s, r);
      const pts = [[x0, yb], [x0 + s.b * u, yb], [x0 + (s.b + off) * u, yb - r.h * u], [x0 + off * u, yb - r.h * u]];
      p.stroke(C.ink); p.strokeWeight(1.6); p.fill(RK.al(p, good ? C.ok : C.sky, 120)); p.beginShape(); pts.forEach(q => p.vertex(...q)); p.endShape(p.CLOSE);
      p.noFill(); p.stroke(C.coral); p.drawingContext.setLineDash([5, 4]); p.rect(x0 + off * u, yb - r.h * u, s.b * u, r.h * u); p.drawingContext.setLineDash([]);
      p.stroke(C.brand); p.strokeWeight(1.4); p.line(x0 + off * u, yb, x0 + off * u, yb - r.h * u);
      TK.label(p, C, `h = ${r.h}`, x0 + off * u + 26, yb - r.h * u - 10, C.brand, 10, 50);
      TK.label(p, C, `${r.slant}`, x0 + off * u / 2 - 10, yb - r.h * u / 2, C.mute, 10, 30);
      TK.label(p, C, `base ${s.b}`, x0 + s.b * u / 2, yb + 12, C.ink, 10, 70);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 12, s.b - 1, i => (i % 2 === 1 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$${s.b} \\cdot ${r.h} = ${s.b * r.h}$`, { kicker: 'base × altura', col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X([2, 3, 5].find(i => i + 1 !== answer(G.r).b)), y: G.tY }, text: 'Arrastra la base', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 12) + 1; if (v !== G.s.b || !G.touched[G.cur]) { G.s.b = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
